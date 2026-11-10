import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  MapPin,
  CheckCircle2,
  ChefHat,
  Bike,
  Sparkles,
  Phone,
  RefreshCw,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { Order, OrderStatus } from '../data';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeOrder?: Order | null;
}

const STAGES: { status: OrderStatus; label: string; step: number; desc: string }[] = [
  { status: 'PLACED', label: 'Order Placed', step: 1, desc: 'Payment verified & ticket dispatched to station kitchen' },
  { status: 'ACCEPTED', label: 'Kitchen Accepted', step: 2, desc: 'Station Master Chef reviewed & accepted order' },
  { status: 'PREPARING', label: 'On Dum (Cooking)', step: 3, desc: 'Aged basmati & meat slow cooking over charcoal embers' },
  { status: 'READY', label: 'Ready for Pickup', step: 4, desc: 'Handi packed in insulated thermal bag awaiting rider' },
  { status: 'HANDED_TO_RIDER', label: 'Out for Delivery', step: 5, desc: 'Rider has collected handi and is heading to your address' },
];

export default function OrderTrackingModal({
  isOpen,
  onClose,
  activeOrder: initialOrder,
}: OrderTrackingModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Fetch orders from live backend with fallback
  const fetchLiveOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Order[] = data.map((o: any) => ({
            id: String(o.id),
            orderNumber: o.order_number,
            outletId: String(o.outlet_id),
            outletName: o.outlet_name || 'Station Kitchen',
            customerName: 'Karan Sharma',
            customerPhone: '+91 98765 43210',
            deliveryAddress: o.special_instructions || 'Kondapur, Hyderabad',
            items: (o.items || []).map((it: any) => ({
              id: String(it.id),
              itemName: it.item_name,
              portionName: it.portion_name,
              addonDetails: 'None',
              unitPrice: it.unit_price,
              quantity: it.quantity,
              totalPrice: it.total_price,
            })),
            itemTotal: o.subtotal,
            gstAmount: o.gst_amount,
            deliveryFee: o.delivery_fee,
            totalAmount: o.grand_total,
            paymentMethod: 'UPI',
            paymentStatus: 'SUCCESS',
            status: o.status as OrderStatus,
            placedAt: o.created_at,
            promisedReadyTime: o.promised_delivery_time || new Date(Date.now() + 35 * 60000).toISOString(),
            estimatedPrepMinutes: o.ai_estimated_prep_minutes || 35,
            isLate: false,
          }));
          setOrders(mapped);
          if (!selectedOrderNumber && mapped.length > 0) {
            setSelectedOrderNumber(mapped[0].orderNumber);
          }
          setLastRefreshed(new Date());
          return;
        }
      }
    } catch {
      // Fallback handled below
    }

    // If initialOrder provided and not yet in list
    if (initialOrder) {
      setOrders([initialOrder]);
      setSelectedOrderNumber(initialOrder.orderNumber);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveOrders();
      // Live polling every 3 seconds so kitchen advances appear in real time
      const interval = setInterval(fetchLiveOrders, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOrder =
    orders.find((o) => o.orderNumber === selectedOrderNumber) ||
    initialOrder ||
    orders[0];

  const currentStageIndex = currentOrder
    ? STAGES.findIndex((s) => s.status === currentOrder.status)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card-pop relative w-full max-w-2xl bg-cream border-[4px] border-cocoa rounded-3xl shadow-pop-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-2xl bg-white border-2 border-cocoa flex items-center justify-center text-cherry shadow-pop-sm">
              <Receipt size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-cherry text-white px-2 py-0.5 rounded-full">
                  Live Order Tracker
                </span>
                <span className="text-[10px] font-bold text-cocoa-fade flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Syncing
                </span>
              </div>
              <h3 className="font-display text-xl text-cocoa leading-tight mt-0.5">
                {currentOrder ? `Order #${currentOrder.orderNumber}` : 'Track Your Handi'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLiveOrders}
              className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream transition-colors text-cocoa"
              title="Refresh order state"
            >
              <RefreshCw size={15} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream transition-colors text-cocoa"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-cocoa">
          
          {orders.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {orders.map((o) => (
                <button
                  key={o.orderNumber}
                  type="button"
                  onClick={() => setSelectedOrderNumber(o.orderNumber)}
                  className={`px-3 py-1.5 rounded-xl border-2 border-cocoa text-xs font-black shrink-0 transition-all ${
                    o.orderNumber === currentOrder?.orderNumber
                      ? 'bg-cocoa text-lemon shadow-pop-sm'
                      : 'bg-white text-cocoa hover:bg-lemon/50'
                  }`}
                >
                  #{o.orderNumber} &bull; {o.status}
                </button>
              ))}
            </div>
          )}

          {!currentOrder ? (
            <div className="text-center py-16 space-y-2">
              <Clock size={40} className="text-cocoa/40 mx-auto" />
              <h4 className="font-display text-lg text-cocoa">No Active Orders</h4>
              <p className="text-xs text-cocoa-fade">Place a direct order to track kitchen dum status live.</p>
            </div>
          ) : (
            <>
              {/* Station & Promised Time Banner */}
              <div className="card-pop bg-white border-2 border-cocoa rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-pop-sm">
                <div>
                  <span className="text-[10px] font-black uppercase text-cocoa-fade block">
                    Fulfilling Station
                  </span>
                  <p className="font-display text-base text-cherry flex items-center gap-1.5 mt-0.5">
                    <MapPin size={15} className="text-cherry" />
                    <span>{currentOrder.outletName}</span>
                  </p>
                  <p className="text-[11px] font-bold text-cocoa-soft mt-0.5">
                    AI Estimated Prep: ~{currentOrder.estimatedPrepMinutes} mins
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black uppercase text-cocoa-fade block">
                    Promised By
                  </span>
                  <p className="font-mono text-xl font-black text-cocoa">
                    {new Date(currentOrder.promisedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 inline-block mt-0.5">
                    Status: {currentOrder.status}
                  </span>
                </div>
              </div>

              {/* 5-Stage Live Visual Stepper */}
              <div className="space-y-4">
                <h4 className="font-display text-base text-cocoa border-b-2 border-cocoa/20 pb-1">
                  Kitchen Progress Stages
                </h4>

                <div className="space-y-3">
                  {STAGES.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isUpcoming = idx > currentStageIndex;

                    return (
                      <div
                        key={stage.status}
                        className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3.5 ${
                          isCurrent
                            ? 'bg-lemon border-cocoa shadow-pop-sm ring-2 ring-cocoa'
                            : isDone
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-white/60 border-cocoa/20 opacity-60'
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center font-display text-xs shrink-0 border ${
                            isCurrent
                              ? 'bg-cherry text-white border-cocoa shadow-sm animate-bounce'
                              : isDone
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-gray-200 text-gray-600 border-gray-300'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <span>{stage.step}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-display text-sm text-cocoa">
                              {stage.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-black uppercase text-cherry bg-white px-2 py-0.5 rounded-full border border-cocoa shadow-sm">
                                Current Stage
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-cocoa-soft font-semibold mt-0.5">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="card-pop bg-white border-2 border-cocoa rounded-2xl p-4 space-y-3 shadow-pop-sm">
                <h5 className="font-display text-sm text-cherry border-b border-cocoa/15 pb-1">
                  Order Line Items
                </h5>
                <div className="space-y-2">
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-cocoa">
                          {item.quantity}x {item.itemName}
                        </span>
                        <span className="text-cocoa-fade text-[11px] block">
                          {item.portionName}
                        </span>
                      </div>
                      <span className="font-display text-sm text-cocoa">
                        ₹{item.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cocoa/20 pt-2 flex justify-between items-center text-xs font-black">
                  <span>Grand Total (5% GST Incl.)</span>
                  <span className="font-display text-base text-cherry">
                    ₹{currentOrder.totalAmount}
                  </span>
                </div>
              </div>

              {/* Live Support Notice */}
              <div className="p-3 rounded-xl bg-lemon/30 border border-cocoa/30 flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-cocoa">
                  <Phone size={14} className="text-cherry" />
                  Need station assistance? Contact {currentOrder.outletName}
                </span>
                <span className="font-mono text-cocoa-fade">+91 40 2300 1978</span>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

