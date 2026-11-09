import React from 'react';
import { X, CheckCircle2, Clock, ChefHat, Bike, MapPin } from 'lucide-react';
import { Order, OrderStatus } from '../data';

interface OrderTrackModalProps {
  order: Order | null;
  onClose: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; icon: any }[] = [
  { status: 'PLACED', label: 'Order Placed', icon: CheckCircle2 },
  { status: 'ACCEPTED', label: 'Kitchen Accepted', icon: ChefHat },
  { status: 'PREPARING', label: 'Handi on Dum', icon: Clock },
  { status: 'READY', label: 'Ready for Pickup', icon: CheckCircle2 },
  { status: 'HANDED_TO_RIDER', label: 'Dispatched with Rider', icon: Bike },
];

export default function OrderTrackModal({ order, onClose }: OrderTrackModalProps) {
  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-md">
      <div className="card-pop relative w-full max-w-2xl bg-cream border-[4px] border-cocoa shadow-pop-lg max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
              Live Order Tracker
            </span>
            <h2 className="font-display text-2xl text-cherry outline-text [text-stroke-width:0.5px]">
              {order.orderNumber}
            </h2>
            <p className="text-xs font-bold text-cocoa">
              Station: <span className="text-cherry">{order.outletName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-cocoa-fade block">Promised Time</span>
              <span className="bg-white border-2 border-cocoa px-2.5 py-0.5 rounded-lg text-xs font-black text-cocoa">
                {new Date(order.promisedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Stepper */}
          <div className="card-pop bg-white p-5 border-2 border-cocoa">
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {STATUS_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full border-2 border-cocoa flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-cherry text-white scale-110 shadow-pop-sm'
                          : isPassed
                          ? 'bg-lemon text-cocoa shadow-pop-sm'
                          : 'bg-slate-100 text-slate-400 border-slate-300'
                      }`}
                    >
                      <Icon size={16} strokeWidth={2.5} />
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-extrabold mt-1.5 leading-tight ${
                        isPassed ? 'text-cocoa font-black' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Snapshot Summary */}
          <div className="card-pop bg-white p-4 border-2 border-cocoa space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-cocoa">
              Order Receipt Snapshot:
            </h4>
            <div className="space-y-2 text-xs">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-cocoa/10">
                  <div>
                    <span className="font-black text-cocoa">{it.quantity}x {it.itemName}</span>
                    <span className="text-[11px] text-cherry ml-2">({it.portionName})</span>
                  </div>
                  <span className="font-bold text-cocoa">₹{it.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-cocoa/20 text-xs font-bold text-cocoa space-y-1">
              <div className="flex justify-between text-cocoa-fade text-[11px]">
                <span>5% GST Component (Included in prices):</span>
                <span>₹{order.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-cherry pt-1">
                <span>Total Paid via {order.paymentMethod}:</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-center gap-2.5 text-xs font-bold text-cocoa bg-lemon/40 border border-cocoa/30 p-3 rounded-2xl">
            <MapPin size={16} className="text-cherry shrink-0" />
            <p>{order.deliveryAddress}</p>
          </div>

        </div>

      </div>
    </div>
  );
}
