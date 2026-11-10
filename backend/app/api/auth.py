from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.core.database import get_db
from app.core.security import verify_password, hash_password, create_access_token
from app.models.user import User, UserRole
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse, UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate customer, kitchen staff, or operational admin."""
    clean_identifier = req.phone_or_email.strip()
    stmt = select(User).where(
        or_(
            User.email == clean_identifier.lower(),
            User.phone == clean_identifier,
            User.phone == f"+91 {clean_identifier}",
            User.email == clean_identifier,
        )
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials: user not found. Please verify your email or phone number.",
        )

    # Tight Security: verify password with Argon2id
    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials: incorrect password. Please re-enter.",
        )

    token = create_access_token(subject=user.id, expires_delta=timedelta(days=7))
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(req: SignupRequest, db: AsyncSession = Depends(get_db)):
    """Register a new customer account."""
    clean_email = req.email.strip().lower()
    clean_phone = req.phone.strip()
    if not clean_phone.startswith("+91") and len(clean_phone) == 10:
        clean_phone = f"+91 {clean_phone}"

    # Check for duplicate email or phone
    stmt = select(User).where(or_(User.email == clean_email, User.phone == clean_phone))
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email or mobile phone number already exists.",
        )

    new_user = User(
        name=req.name.strip(),
        email=clean_email,
        phone=clean_phone,
        hashed_password=hash_password(req.password),
        role=UserRole.CUSTOMER,
        outlet_id=req.outlet_id,
        is_active=True,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_access_token(subject=new_user.id, expires_delta=timedelta(days=7))
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user),
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Return authenticated user profile."""
    return UserResponse.model_validate(current_user)
