import React from 'react';
import { X, Trash2, Plus, Minus, MapPin, ArrowRight, ShoppingBag, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { CartItem, Outlet } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  selectedOutlet: Outlet;
  onNavigateToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  selectedOutlet,
  onNavigateToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalQuantity = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const itemTotal = cartItems.reduce((acc, c) => acc + c.totalPrice, 0);
  // Authoritative GST 5% inclusive formula: itemTotal * 5 / 105
  const gstAmount = Math.round(((itemTotal * 5) / 105) * 100) / 100;
  const deliveryFee = itemTotal > 0 ? (itemTotal >= 500 ? 0 : 50) : 0;
  const grandTotal = itemTotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-cocoa/65 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-cream border-l-[4px] border-cocoa shadow-2xl flex flex-col text-cocoa animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-10 w-10 rounded-full bg-white border-2 border-cocoa flex items-center justify-center text-cherry shadow-pop-sm">
                <ShoppingBag size={18} />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                  Your Order Cart
                </span>
                <h2 className="font-display text-xl sm:text-2xl text-cherry outline-text [text-stroke-width:0.5px]">
                  Your Feast ({totalQuantity})
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream transition-colors"
              title="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Assigned Outlet Station Notice */}
          <div className="bg-white border-b-2 border-cocoa/20 px-5 py-3 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={15} className="text-cherry shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-black text-cocoa-fade block">Station</span>
                <span className="truncate text-cocoa font-display text-xs">{selectedOutlet.name}</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full font-black shrink-0">
              Max {selectedOutlet.deliveryRadiusKm} km
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <span className="h-16 w-16 rounded-full bg-lemon border-2 border-cocoa flex items-center justify-center text-cocoa mx-auto shadow-pop-sm">
                  <UtensilsCrossed size={28} />
                </span>
                <h3 className="font-display text-xl text-cocoa">Your cart is empty!</h3>
                <p className="text-xs font-semibold text-cocoa-soft max-w-xs mx-auto leading-relaxed">
                  Add some sizzling Hyderabadi Dum Biryani, Shahi Mutton Haleem, or Chicken 65 to get started.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="pill-btn bg-lemon text-cocoa text-xs !py-2.5 !px-5 mt-2 shadow-pop-sm hover:bg-lemon-deep"
                >
                  Explore Royal Menu
                </button>
              </div>
            ) : (
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
                        className="h-6 w-6 rounded-lg bg-white border border-cocoa flex items-center justify-center hover:bg-lemon text-cocoa transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-black text-xs px-1 min-w-[16px] text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(cartItem.id, cartItem.quantity + 1)}
                        className="h-6 w-6 rounded-lg bg-white border border-cocoa flex items-center justify-center hover:bg-lemon text-cocoa transition-colors"
                        title="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(cartItem.id)}
                      className="text-cocoa-fade hover:text-cherry p-1 shrink-0 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer with Authoritative Bill Breakdown & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t-[3px] border-cocoa bg-white space-y-4 shadow-lg">
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
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-black">FREE (Orders &gt; ₹500)</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-cherry border-t border-dashed border-cocoa/30 pt-2">
                  <span>Total Amount</span>
                  <span className="font-display text-xl">₹{grandTotal}</span>
                </div>
              </div>

              {/* Direct Link to Checkout Page */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToCheckout();
                }}
                className="pill-btn w-full bg-cherry text-white text-base !py-3.5 flex items-center justify-center gap-2 shadow-pop-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Proceed to Checkout &bull; ₹{grandTotal}</span>
                <ArrowRight size={18} />
              </button>

              <p className="text-[10px] text-center font-bold text-cocoa-fade flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Direct Restaurant Order &bull; Zero App Commissions</span>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
