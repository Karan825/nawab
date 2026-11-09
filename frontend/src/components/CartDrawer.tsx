import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, QrCode, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { CartItem, Outlet, Order } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  selectedOutlet: Outlet;
  onCheckoutSuccess: (order: Order) => void;
  onNavigateToCheckout?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  selectedOutlet,
  onCheckoutSuccess,
  onNavigateToCheckout,
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
  const deliveryFee = itemTotal > 0 ? (itemTotal >= 500 ? 0 : 50) : 0;
  const grandTotal = itemTotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrderNum = `WEB-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      // Prep time rule: max(ai_estimated, outlet_minimum_prep_time)
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
      <div onClick={onClose} className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm animate-in fade-in duration-200" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream border-l-[4px] border-cocoa shadow-2xl flex flex-col text-cocoa animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                Direct Ordering Cart
              </span>
              <h2 className="font-display text-2xl text-cherry outline-text [text-stroke-width:0.5px]">
                Your Feast ({cartItems.reduce((acc, c) => acc + c.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream"
            >
              <X size={18} />
            </button>
          </div>

          {/* Outlet Boundary Banner */}
          <div className="bg-white border-b-2 border-cocoa/20 px-5 py-2.5 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5 text-cocoa">
              <MapPin size={14} className="text-cherry shrink-0" />
              <span className="truncate max-w-[220px]">Station: {selectedOutlet.name}</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full font-black">
              Max {selectedOutlet.deliveryRadiusKm} km
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-24 space-y-3">
                <span className="text-5xl block">🍲</span>
                <p className="font-display text-xl text-cocoa">Your cart is empty!</p>
                <p className="text-xs font-semibold text-cocoa-soft max-w-xs mx-auto">
                  Add some sizzling Hyderabadi Dum Biryani or Chicken 65 to get started.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="pill-btn bg-lemon text-cocoa text-xs !py-2.5 !px-5 mt-2"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartItems.map((cartItem) => (
                    <div
                      key={cartItem.id}
                      className="card-pop bg-white p-3.5 rounded-2xl border-2 border-cocoa flex gap-3 items-center"
                    >
                      <img
                        src={cartItem.item.photo}
                        alt={cartItem.item.name}
                        className="h-16 w-16 rounded-xl border border-cocoa object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm text-cocoa truncate">{cartItem.item.name}</h4>
                        <p className="text-[11px] font-bold text-cherry">{cartItem.portion.name}</p>
                        {cartItem.addons.length > 0 && (
                          <p className="text-[10px] text-cocoa-fade truncate">
                            +{cartItem.addons.map((a) => a.name).join(', ')}
                          </p>
                        )}
                        <span className="font-display text-sm text-cocoa block mt-0.5">
                          ₹{cartItem.totalPrice}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-cream p-1 rounded-xl border border-cocoa">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(cartItem.id, cartItem.quantity - 1)}
                          className="h-6 w-6 rounded-lg bg-white border border-cocoa flex items-center justify-center hover:bg-lemon text-cocoa"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-black text-xs px-1">{cartItem.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(cartItem.id, cartItem.quantity + 1)}
                          className="h-6 w-6 rounded-lg bg-white border border-cocoa flex items-center justify-center hover:bg-lemon text-cocoa"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(cartItem.id)}
                        className="text-cocoa-fade hover:text-cherry p-1"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Checkout Details Form */}
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="pt-4 space-y-3">
                  <h3 className="font-display text-base text-cherry border-b border-cocoa/20 pb-1">
                    Delivery &amp; Payment Details
                  </h3>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                      Phone (for live WhatsApp &amp; SMS updates)
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                      Delivery Address in Hyderabad
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                      Select Payment (Test Mode)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-2.5 rounded-xl border-2 border-cocoa flex items-center justify-center gap-2 text-xs font-black transition-all ${
                          paymentMethod === 'UPI' ? 'bg-lemon shadow-pop-sm' : 'bg-white hover:bg-cream'
                        }`}
                      >
                        <QrCode size={16} />
                        <span>UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CARD')}
                        className={`p-2.5 rounded-xl border-2 border-cocoa flex items-center justify-center gap-2 text-xs font-black transition-all ${
                          paymentMethod === 'CARD' ? 'bg-lemon shadow-pop-sm' : 'bg-white hover:bg-cream'
                        }`}
                      >
                        <CreditCard size={16} />
                        <span>Credit / Debit</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Drawer Footer with Authoritative Bill Breakdown */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t-[3px] border-cocoa bg-white space-y-3">
              <div className="space-y-1.5 text-xs font-bold text-cocoa">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span>₹{itemTotal}</span>
                </div>

                <div className="flex justify-between text-cocoa-soft text-[11px]">
                  <span>GST (5% Inclusive)</span>
                  <span>Included (₹{gstAmount.toFixed(2)})</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-700 font-black">FREE</span> : `₹${deliveryFee}`}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-cherry border-t border-dashed border-cocoa/30 pt-2">
                  <span>Total Amount</span>
                  <span className="font-display text-xl">₹{grandTotal}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="pill-btn w-full bg-cherry text-white text-sm !py-3 flex items-center justify-center gap-2 shadow-pop-sm hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Quick Pay &bull; ₹{grandTotal}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {onNavigateToCheckout && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToCheckout();
                    }}
                    className="pill-btn w-full bg-lemon text-cocoa text-xs !py-2.5 flex items-center justify-center gap-1.5 shadow-pop-sm hover:bg-lemon-deep"
                  >
                    <span>Open Dedicated Checkout Page</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

              <p className="text-[10px] text-center font-bold text-cocoa-fade flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Test Payment Gateway &bull; Dispatches directly to {selectedOutlet.name}</span>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
