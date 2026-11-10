import React from 'react';
import { X, CheckCircle2, Clock, ChefHat, Bike, MapPin, type LucideIcon } from 'lucide-react';
import { Order, OrderStatus } from '../data';

interface OrderTrackModalProps {
  order: Order | null;
  onClose: () => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; icon: LucideIcon; sub: string }[] = [
  { status: 'PLACED', label: 'Order Placed', icon: CheckCircle2, sub: 'Payment verified, routed to outlet' },
  { status: 'ACCEPTED', label: 'Kitchen Accepted', icon: ChefHat, sub: 'Order acknowledged by station chef' },
  { status: 'PREPARING', label: 'Cooking on Dum', icon: Clock, sub: 'Sealed handi on coal fire' },
  { status: 'READY', label: 'Ready for Pickup', icon: CheckCircle2, sub: 'Packaged hot at station counter' },
  { status: 'HANDED_TO_RIDER', label: 'Dispatched with Rider', icon: Bike, sub: 'Out for direct delivery' },
];

export default function OrderTrackModal({ order, onClose }: OrderTrackModalProps) {
  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="card-pop relative w-full max-w-xl bg-cream border-[4px] border-cocoa shadow-pop-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl">
        
        {/* Header */}
        <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
              Live Order Tracker
            </span>
            <h2 className="font-display text-2xl text-cherry outline-text [text-stroke-width:0.5px]">
              {order.orderNumber}
            </h2>
            <p className="text-xs font-bold text-cocoa flex items-center gap-1 mt-0.5">
              <MapPin size={12} className="text-cherry" />
              <span>Dispatched from: {order.outletName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-cocoa-fade block">Promised By</span>
              <span className="bg-white border-2 border-cocoa px-2.5 py-0.5 rounded-lg text-xs font-black text-cocoa">
                {new Date(order.promisedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tracker Progress Bar */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-cocoa">
          {/* Status Tracker */}
          <div className="space-y-4">
            {STATUS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              return (
                <div key={step.status} className="flex items-start gap-4 relative">
                  {/* Connecting Line */}
                  {idx < STATUS_STEPS.length - 1 && (
                    <span
                      className={`absolute left-5 top-10 w-0.5 h-8 -ml-[1px] ${
                        isPast ? 'bg-emerald-600' : 'bg-cocoa/20'
                      }`}
                    />
                  )}

                  <div
                    className={`h-10 w-10 rounded-full border-2 border-cocoa flex items-center justify-center shrink-0 z-10 ${
                      isPast
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-lemon text-cocoa shadow-pop-sm ring-2 ring-cocoa'
                        : 'bg-white text-cocoa-fade'
                    }`}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 pt-1">
                    <p
                      className={`font-display text-sm ${
                        isCurrent ? 'text-cherry font-black' : isPast ? 'text-cocoa font-bold' : 'text-cocoa-fade'
                      }`}
                    >
                      {step.label} {isCurrent && <span className="text-xs ml-1.5 font-bold">● In Progress</span>}
                    </p>
                    <p className="text-xs text-cocoa-soft font-medium mt-0.5">{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ordered Items Summary */}
          <div className="bg-white p-4 rounded-2xl border-2 border-cocoa space-y-2">
            <h4 className="font-display text-xs text-cherry uppercase tracking-wider">Ordered Items</h4>
            <div className="divide-y divide-cocoa/10">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-2 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-cocoa">
                      {it.quantity}x {it.itemName}
                    </span>
                    <span className="text-[10px] block text-cocoa-fade">{it.portionName}</span>
                  </div>
                  <span className="font-black text-cocoa">₹{it.totalPrice}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-cocoa/20 pt-2 flex justify-between text-xs font-black">
              <span>Total Paid ({order.paymentMethod})</span>
              <span className="text-cherry font-display text-sm">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-[3px] border-cocoa bg-lemon flex items-center justify-between">
          <p className="text-xs font-bold text-cocoa">
            Need changes? Call catering manager: <span className="underline">+91 40 2361 9028</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="pill-btn bg-cherry text-white text-xs !py-2 !px-4"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

