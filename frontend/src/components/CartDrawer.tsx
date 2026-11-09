import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, QrCode, ShieldCheck, AlertCircle, ShoppingBag } from 'lucide-react';
import { CartItem, Outlet, Order } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  selectedOutlet: Outlet;
  onCheckoutSuccess: (order: Order) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  selectedOutlet,
  onCheckoutSuccess,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('Karan Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Aditya Sunshine, Kondapur, Hyderabad');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const itemTotal = cartItems.reduce((acc, c) => acc + c.totalPrice, 0);
  // Authoritative GST 5% inclusive formula: itemTotal * 5 / 105
  const gstAmount = Math.round(((itemTotal * 5) / 105) * 100) / 100;
  const deliveryFee = itemTotal > 0 ? (itemTotal > 500 ? 0 : 50) : 0;
  const grandTotal = itemTotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrderNum = `WEB-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const prepMins = Math.max(35, selectedOutlet.minPrepTimeMinutes);
      const promisedTime = new Date(now.getTime() + prepMins * 60 * 1000).toISOString();

      const createdOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: newOrderNum,
        outletId: selectedOutlet.id,
        outletName: selectedOutlet.name,
        customerName,
        customerPhone,
        deliveryAddress,
        items: cartItems.map((c) => ({
          id: `snap-${c.id}`,
          itemName: c.item.name,
          portionName: c.portion.name,
          addonDetails: c.addons.map((a) => a.name).join(', ') || 'None',
          unitPrice: c.unitPrice,
          quantity: c.quantity,
          totalPrice: c.totalPrice,
        })),
        itemTotal,
        gstAmount,
        deliveryFee,
        totalAmount: grandTotal,
        paymentMethod,
        paymentStatus: 'SUCCESS',
        status: 'PLACED',
        placedAt: now.toISOString(),
        promisedReadyTime: promisedTime,
        estimatedPrepMinutes: prepMins,
        isLate: false,
      };

      setIsSubmitting(false);
      onCheckoutSuccess(createdOrder);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream border-l-[4px] border-cocoa shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-cherry outline-text [text-stroke-width:0.5px]">
                Your Feast Handi
              </h2>
              <p className="text-[11px] font-bold text-cocoa-soft mt-0.5">
                Kitchen: <span className="text-cocoa font-black">{selectedOutlet.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-6xl">🍲</span>
                <h3 className="font-display text-xl text-cocoa mt-3">Your Handi is Empty</h3>
                <p className="text-xs font-bold text-cocoa-fade mt-1">
                  Add some slow-dummed Nizami Biryani &amp; Kebabs to begin!
                </p>
              </div>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-[11px] font-bold text-amber-900 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-amber-700" />
                  <span>Cart locked to <strong>{selectedOutlet.name}</strong></span>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border-2 border-cocoa shadow-pop-sm space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-cocoa">{item.item.name}</h4>
                        <p className="text-[11px] font-semibold text-cherry">{item.portion.name}</p>
                        {item.addons.length > 0 && (
                          <p className="text-[10px] text-cocoa-fade">
                            + {item.addons.map((a) => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-black text-cocoa">₹{item.totalPrice}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-cocoa/20">
                      <div className="flex items-center border border-cocoa rounded-full bg-cream px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="p-1 hover:text-cherry"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-black text-cocoa">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="p-1 hover:text-cherry"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-cocoa-fade hover:text-cherry transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Delivery Address Form */}
                <div className="pt-4 border-t-2 border-dashed border-cocoa/30 space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-cocoa">
                    Delivery &amp; Contact:
                  </h4>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 rounded-xl border-2 border-cocoa text-xs font-bold bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number (+91)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border-2 border-cocoa text-xs font-bold bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Delivery Address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-2 rounded-xl border-2 border-cocoa text-xs font-bold bg-white"
                  />
                </div>

                {/* Simulated Payment */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-black uppercase tracking-wider text-cocoa flex items-center justify-between">
                    <span>Simulated Payment:</span>
                    <span className="text-[10px] text-emerald-700 font-bold">● Safe Sandbox</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs font-extrabold ${
                        paymentMethod === 'UPI'
                          ? 'border-cocoa bg-lemon shadow-pop-sm'
                          : 'border-cocoa/30 bg-white'
                      }`}
                    >
                      <QrCode size={16} /> Instant UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs font-extrabold ${
                        paymentMethod === 'CARD'
                          ? 'border-cocoa bg-lemon shadow-pop-sm'
                          : 'border-cocoa/30 bg-white'
                      }`}
                    >
                      <CreditCard size={16} /> Credit/Debit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Bill & Button */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t-[3px] border-cocoa bg-white space-y-3">
              <div className="space-y-1 text-xs font-bold text-cocoa">
                <div className="flex justify-between">
                  <span>Item Subtotal:</span>
                  <span>₹{itemTotal}</span>
                </div>
                
                <div className="flex justify-between text-cocoa-fade text-[11px]">
                  <span>Inclusive 5% GST (Included in prices):</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-700 font-black' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="pt-2 border-t-2 border-cocoa flex justify-between font-display text-lg text-cherry">
                  <span>Total to Pay:</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="pill-btn w-full bg-cherry text-white text-xs !py-3 flex items-center justify-center gap-2 hover:bg-cherry-deep"
              >
                <ShieldCheck size={16} />
                <span>{isSubmitting ? 'Simulating Payment...' : `Pay ₹${grandTotal} & Dispatch to Kitchen`}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
