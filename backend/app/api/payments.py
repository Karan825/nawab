import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.user import User
from app.models.order import Order, OrderStatus, Payment, PaymentStatus, OrderStatusHistory
from app.schemas.payment import PaymentSimulateRequest, PaymentResponse
from app.api.deps import get_current_user
from app.api.websockets import kds_manager

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/simulate", response_model=PaymentResponse)
async def simulate_payment(
    req: PaymentSimulateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Simulated Payment with Idempotency Key (Invariant 5):
    - Orders enter kitchen processing (PLACED) ONLY after payment succeeds.
    - Idempotency key prevents double-charging on network retries.
    """
    # 1. Check Idempotency Key
    idemp_stmt = select(Payment).where(Payment.idempotency_key == req.idempotency_key)
    existing_pay = (await db.execute(idemp_stmt)).scalar_one_or_none()
    if existing_pay:
        # Load order to return order_number
        ord_stmt = select(Order).where(Order.id == existing_pay.order_id)
        ord_res = (await db.execute(ord_stmt)).scalar_one()
        return PaymentResponse(
            id=existing_pay.id,
            order_id=existing_pay.order_id,
            order_number=ord_res.order_number,
            idempotency_key=existing_pay.idempotency_key,
            transaction_reference=existing_pay.transaction_reference,
            amount=float(existing_pay.amount),
            status=existing_pay.status,
            created_at=existing_pay.created_at,
        )

    # 2. Retrieve Order
    order_stmt = (
        select(Order)
        .where(Order.order_number == req.order_number)
        .options(selectinload(Order.items), selectinload(Order.outlet))
    )
    order = (await db.execute(order_stmt)).scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.status != OrderStatus.PENDING_PAYMENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Order is already in state {order.status.value}",
        )

    # 3. Authoritative Amount Validation
    if abs(float(order.grand_total) - req.amount) > 0.01:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment amount mismatch. Order requires ₹{order.grand_total}, but received ₹{req.amount}",
        )

    # 4. Record Payment
    txn_ref = f"TXN_{uuid.uuid4().hex[:12].upper()}"
    payment = Payment(
        order_id=order.id,
        idempotency_key=req.idempotency_key,
        payment_method=req.payment_method,
        transaction_reference=txn_ref,
        amount=order.grand_total,
        status=PaymentStatus.SUCCESS,
    )
    db.add(payment)

    # 5. Transition Order to PLACED (Kitchen Dispatch!)
    order.status = OrderStatus.PLACED
    db.add(
        OrderStatusHistory(
            order_id=order.id,
            from_status=OrderStatus.PENDING_PAYMENT.value,
            to_status=OrderStatus.PLACED.value,
            changed_by_user_id=current_user.id,
            note=f"Payment verified via {req.payment_method} ({txn_ref}). Dispatched to kitchen.",
        )
    )

    await db.commit()
    await db.refresh(payment)

    # 6. Broadcast Real-time Dispatch to Station KDS Screen
    await kds_manager.broadcast_to_outlet(
        order.outlet_id,
        {
            "event": "NEW_ORDER_DISPATCHED",
            "order_number": order.order_number,
            "status": OrderStatus.PLACED.value,
            "outlet_id": order.outlet_id,
            "total_items": len(order.items),
            "grand_total": float(order.grand_total),
            "ai_prep_time_minutes": order.ai_estimated_prep_minutes,
            "created_at": order.created_at.isoformat(),
        },
    )

    return PaymentResponse(
        id=payment.id,
        order_id=payment.order_id,
        order_number=order.order_number,
        idempotency_key=payment.idempotency_key,
        transaction_reference=payment.transaction_reference,
        amount=float(payment.amount),
        status=payment.status,
        created_at=payment.created_at,
    )
