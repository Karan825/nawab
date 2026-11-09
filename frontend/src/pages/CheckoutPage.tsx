import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  QrCode,
  Building,
  Tag,
  MapPin,
  Clock,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Phone,
  User as UserIcon,
  Home,
  Check
} from 'lucide-react';
import { CartItem, Outlet, Order, PortionOption, AddonOption } from '../data';

interface CheckoutPageProps {
  cartItems: CartItem[];
  selectedOutlet: Outlet;
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckoutSuccess: (order: Order) => void;
  onBackToMenu: () => void;
}

export default function CheckoutPage({
  cartItems,
  selectedOutlet,
  onUpdateQty,
  onRemoveItem,
  onCheckoutSuccess,
  onBackToMenu,
}: CheckoutPageProps) {
  // Form state
  const [customerName, setCustomerName] = useState('Karan Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Aditya Sunshine, Kondapur');
  const [landmark, setLandmark] = useState('Near Botanical Garden');
  const [postalCode, setPostalCode] = useState('500084');
  const [instructions, setInstructions] = useState('Please ring bell and leave with security if unavailable.');
  const [dpdpOptIn, setDpdpOptIn] = useState(true);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; label: string } | null>({
    code: 'DIRECT15',
    discount: 0.15,
    label: '15% Direct Commission Savings',
  });
  const [couponError, setCouponError] = useState('');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('nawaab@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Calculations
  const itemTotal = cartItems.reduce((acc, c) => acc + c.totalPrice, 0);
  // Authoritative GST 5% inclusive formula: itemTotal * 5 / 105
  const gstAmount = Math.round(((itemTotal * 5) / 105) * 100) / 100;
  const deliveryFee = itemTotal > 0 ? (itemTotal >= 500 ? 0 : 50) : 0;
  
  const discountAmount = appliedCoupon
    ? Math.round(itemTotal * appliedCoupon.discount)
    : 0;

  const grandTotal = Math.max(0, itemTotal + deliveryFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'DIRECT15') {
      setAppliedCoupon({ code: 'DIRECT15', discount: 0.15, label: '15% Direct Commission Saving' });
      setCouponCode('');
    } else if (clean === 'NAWAAB50') {
      setAppliedCoupon({ code: 'NAWAAB50', discount: 0.1, label: 'Flat 10% Royal Welcome' });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon. Try DIRECT15 for 15% off!');
    }
  };

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('08/29');
    setCardCvv('789');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!dpdpOptIn) {
      alert('Please check the DPDP consent box to receive your live tracking alerts.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNum = `WEB-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      // Prep time formula: max(ai_estimated, outlet_minimum_prep_time)
      const prepMins = Math.max(38, selectedOutlet.minPrepTimeMinutes);
      const promisedTime = new Date(now.getTime() + prepMins * 60 * 1000).toISOString();

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        outletId: selectedOutlet.id,
        outletName: selectedOutlet.name,
        customerName,
        customerPhone,
        deliveryAddress: `${deliveryAddress}, ${landmark}, Hyderabad - ${postalCode}`,
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
        paymentMethod: paymentMethod === 'NETBANKING' ? 'CARD' : paymentMethod,
        paymentStatus: 'SUCCESS',
        status: 'PLACED',
        placedAt: now.toISOString(),
        promisedReadyTime: promisedTime,
        estimatedPrepMinutes: prepMins,
        isLate: false,
      };

      setIsSubmitting(false);
      setPlacedOrder(newOrder);
      onCheckoutSuccess(newOrder);
    }, 1200);
  };

  // If order was successfully placed, render Order Confirmation View
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-cream py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto card-pop bg-white p-8 sm:p-10 rounded-3xl border-[3px] border-cocoa text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-lemon border-2 border-cocoa flex items-center justify-center text-4xl mx-auto shadow-pop-sm animate-bounce">
            🎉
          </div>

          <div>
            <span className="inline-block rounded-full border-2 border-cocoa bg-aqua px-3 py-1 text-xs font-black uppercase tracking-wider text-cocoa shadow-pop-sm">
              Payment Successful &bull; Order Received
            </span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl text-cherry">
              Order Confirmed!
            </h1>
            <p className="mt-1 font-mono text-sm font-bold text-cocoa">
              Order ID: <span className="text-cherry text-base">{placedOrder.orderNumber}</span>
            </p>
          </div>

          <div className="bg-cream border-2 border-cocoa rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-cocoa/20 pb-2">
              <span className="text-xs font-black uppercase text-cocoa-fade">Dispatch Station</span>
              <span className="text-xs font-bold text-cocoa flex items-center gap-1">
                <MapPin size={14} className="text-cherry" />
                {placedOrder.outletName}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-cocoa/20 pb-2">
              <span className="text-xs font-black uppercase text-cocoa-fade">Promised By</span>
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                <Clock size={14} />
                {new Date(placedOrder.promisedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({placedOrder.estimatedPrepMinutes} mins)
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-cocoa/20 pb-2">
              <span className="text-xs font-black uppercase text-cocoa-fade">Deliver To</span>
              <span className="text-xs font-semibold text-cocoa text-right max-w-xs truncate">
                {placedOrder.deliveryAddress}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-black uppercase text-cocoa-fade">Amount Paid</span>
              <span className="font-display text-lg text-cherry">
                ₹{placedOrder.totalAmount} (5% GST Inclusive)
              </span>
            </div>
          </div>

          {/* Order Progress Tracker */}
          <div className="bg-lemon/40 border-2 border-cocoa rounded-2xl p-4">
            <h4 className="font-display text-sm text-cocoa mb-3">Live Order Status</h4>
            <div className="grid grid-cols-5 gap-1 text-[10px] font-black">
              <div className="bg-cherry text-white p-2 rounded-xl border border-cocoa text-center">
                1. Placed
              </div>
              <div className="bg-white text-cocoa p-2 rounded-xl border border-cocoa text-center">
                2. Confirmed
              </div>
              <div className="bg-white text-cocoa p-2 rounded-xl border border-cocoa text-center">
                3. Cooking
              </div>
              <div className="bg-white text-cocoa p-2 rounded-xl border border-cocoa text-center">
                4. Ready
              </div>
              <div className="bg-white text-cocoa p-2 rounded-xl border border-cocoa text-center">
                5. Out for Delivery
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onBackToMenu}
              className="pill-btn flex-1 bg-cherry text-white border-2 border-cocoa text-sm !py-3 hover:opacity-90 shadow-pop-sm"
            >
              ← Return to Storefront &amp; Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-16 px-4 flex items-center justify-center">
        <div className="card-pop bg-white p-8 max-w-md w-full rounded-3xl border-[3px] border-cocoa text-center space-y-4">
          <span className="text-6xl block">🍲</span>
          <h2 className="font-display text-2xl text-cherry">Your Cart is Empty!</h2>
          <p className="text-xs font-semibold text-cocoa-soft">
            Explore our slow-dum Hyderabadi Biryani, kebabs, and authentic double ka meetha before heading to checkout.
          </p>
          <button
            type="button"
            onClick={onBackToMenu}
            className="pill-btn bg-lemon text-cocoa text-sm !py-3 !px-6 mx-auto block shadow-pop-sm"
          >
            ← Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-cocoa pb-16 font-body">
      {/* Checkout Navbar */}
      <header className="border-b-[3px] border-cocoa bg-lemon sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToMenu}
              className="h-10 w-10 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream transition-transform active:scale-95"
              title="Return to Menu"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                Nawaab's Biryani Co. Direct
              </span>
              <h1 className="font-display text-xl sm:text-2xl text-cherry outline-text [text-stroke-width:0.5px]">
                Express Secure Checkout
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border-2 border-cocoa shadow-pop-sm text-xs font-black">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>256-Bit Encrypted &bull; Direct Kitchen</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Outlet Notice Banner */}
        <div className="mb-6 card-pop bg-aqua/20 border-2 border-cocoa rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-aqua border border-cocoa flex items-center justify-center font-display text-sm shrink-0">
              📍
            </div>
            <div>
              <p className="text-xs font-bold text-cocoa">
                Preparing from <strong className="text-cherry">{selectedOutlet.name}</strong> ({selectedOutlet.type === 'CLOUD_KITCHEN' ? 'Cloud Kitchen' : 'Dine-In Flagship'})
              </p>
              <p className="text-[11px] text-cocoa-soft font-medium">
                {selectedOutlet.address} &bull; Delivery Radius: {selectedOutlet.deliveryRadiusKm} km &bull; FSSAI: {selectedOutlet.fssaiLicense}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-black bg-white border border-cocoa px-3 py-1 rounded-full text-emerald-800 shadow-pop-sm">
            ⚡ Kitchen Ready in ~{Math.max(38, selectedOutlet.minPrepTimeMinutes)} mins
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customer Details & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Contact Information */}
            <div className="card-pop bg-white p-6 rounded-3xl border-[3px] border-cocoa space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-cocoa/20 pb-3">
                <span className="h-7 w-7 rounded-full bg-cherry text-white font-display text-sm flex items-center justify-center border border-cocoa">
                  1
                </span>
                <h2 className="font-display text-lg text-cocoa">Customer Information</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                    <UserIcon size={12} /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white focus:ring-2 focus:ring-lemon"
                    placeholder="e.g. Karan Sharma"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                    <Phone size={12} /> Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white focus:ring-2 focus:ring-lemon"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* DPDP Act 2023 Compliance Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-lemon/20 border border-cocoa/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dpdpOptIn}
                  onChange={(e) => setDpdpOptIn(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-2 border-cocoa text-cherry focus:ring-lemon"
                />
                <span className="text-[11px] font-semibold text-cocoa leading-tight">
                  <strong className="font-black text-cherry">DPDP Act 2023 Consent:</strong> I opt in to receive real-time order status, rider dispatch, and OTP notifications via WhatsApp &amp; SMS.
                </span>
              </label>
            </div>

            {/* Step 2: Hyderabad Delivery Address */}
            <div className="card-pop bg-white p-6 rounded-3xl border-[3px] border-cocoa space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-cocoa/20 pb-3">
                <span className="h-7 w-7 rounded-full bg-cherry text-white font-display text-sm flex items-center justify-center border border-cocoa">
                  2
                </span>
                <h2 className="font-display text-lg text-cocoa">Hyderabad Delivery Address</h2>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                  <Home size={12} /> Flat / House / Building &amp; Street
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white focus:ring-2 focus:ring-lemon"
                  placeholder="Flat 402, Aditya Sunshine, Kondapur"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white"
                    placeholder="Near Botanical Garden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                    Hyderabad PIN Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white"
                    placeholder="500084"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                  Kitchen / Rider Instructions
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white"
                  placeholder="e.g. Leave at gate, do not ring bell"
                />
              </div>
            </div>

            {/* Step 3: Payment Method (Test Mode) */}
            <div className="card-pop bg-white p-6 rounded-3xl border-[3px] border-cocoa space-y-4">
              <div className="flex items-center justify-between border-b-2 border-cocoa/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-cherry text-white font-display text-sm flex items-center justify-center border border-cocoa">
                    3
                  </span>
                  <h2 className="font-display text-lg text-cocoa">Payment Method (Test Mode)</h2>
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider bg-lemon px-2.5 py-1 rounded-full border border-cocoa shadow-pop-sm">
                  Test Gateway Active
                </span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-2xl border-2 border-cocoa flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'bg-lemon font-black shadow-pop-sm -translate-y-0.5'
                      : 'bg-cream hover:bg-white font-bold'
                  }`}
                >
                  <QrCode size={20} />
                  <span className="text-xs">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-2xl border-2 border-cocoa flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-lemon font-black shadow-pop-sm -translate-y-0.5'
                      : 'bg-cream hover:bg-white font-bold'
                  }`}
                >
                  <CreditCard size={20} />
                  <span className="text-xs">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3 rounded-2xl border-2 border-cocoa flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'NETBANKING'
                      ? 'bg-lemon font-black shadow-pop-sm -translate-y-0.5'
                      : 'bg-cream hover:bg-white font-bold'
                  }`}
                >
                  <Building size={20} />
                  <span className="text-xs">Net Banking</span>
                </button>
              </div>

              {/* UPI Tab Content */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-2xl bg-cream border-2 border-cocoa space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-cocoa">
                    <div className="h-28 w-28 bg-white border-2 border-cocoa rounded-xl p-2 flex flex-col items-center justify-center shrink-0 shadow-pop-sm">
                      <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-cocoa rounded">
                        <div className="bg-white col-span-2 row-span-2 rounded" />
                        <div className="bg-lemon col-span-1 row-span-2 rounded" />
                        <div className="bg-white col-span-2 row-span-2 rounded" />
                        <div className="bg-white col-span-2 row-span-2 rounded" />
                        <div className="bg-cherry col-span-1 row-span-2 rounded" />
                        <div className="bg-white col-span-2 row-span-2 rounded" />
                      </div>
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <p className="text-xs font-black text-cocoa">Scan with Any UPI App</p>
                      <p className="text-[11px] text-cocoa-soft font-semibold">
                        GPay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; Cred
                      </p>
                      <span className="inline-block text-[10px] font-mono font-bold bg-cream px-2 py-0.5 rounded border border-cocoa/30">
                        VPA: nawaabs.direct@icici
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                      Or Enter Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white"
                      placeholder="username@okhdfcbank"
                    />
                  </div>
                </div>
              )}

              {/* Card Tab Content */}
              {paymentMethod === 'CARD' && (
                <div className="p-4 rounded-2xl bg-cream border-2 border-cocoa space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-cocoa">Test Card Simulator</span>
                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      className="text-[10px] font-black text-cherry hover:underline"
                    >
                      Fill 4242 Test Card
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-cocoa-fade mb-0.5">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border-2 border-cocoa bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-cocoa-fade mb-0.5">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border-2 border-cocoa bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-cocoa-fade mb-0.5">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border-2 border-cocoa bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Tab */}
              {paymentMethod === 'NETBANKING' && (
                <div className="p-4 rounded-2xl bg-cream border-2 border-cocoa space-y-2">
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white"
                  >
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <p className="text-[11px] font-bold text-cocoa-fade flex items-center gap-1.5 pt-1">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Idempotent payment transaction key: <code className="font-mono text-cocoa">IDEMP-{Date.now().toString().slice(-6)}</code></span>
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary & Authoritative Bill Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Basket Items Summary */}
            <div className="card-pop bg-white p-6 rounded-3xl border-[3px] border-cocoa space-y-4">
              <div className="flex items-center justify-between border-b-2 border-cocoa/20 pb-3">
                <h3 className="font-display text-lg text-cocoa">Order Items ({cartItems.reduce((acc, c) => acc + c.quantity, 0)})</h3>
                <span className="text-xs font-black text-cherry">
                  Subtotal: ₹{itemTotal}
                </span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-cream border-2 border-cocoa text-xs"
                  >
                    <img
                      src={cartItem.item.photo}
                      alt={cartItem.item.name}
                      className="h-12 w-12 rounded-xl border border-cocoa object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-xs text-cocoa truncate">{cartItem.item.name}</h4>
                      <p className="text-[11px] font-bold text-cherry">{cartItem.portion.name}</p>
                      {cartItem.addons.length > 0 && (
                        <p className="text-[10px] text-cocoa-fade truncate">
                          +{cartItem.addons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      <span className="font-display text-xs text-cocoa block mt-0.5">
                        ₹{cartItem.totalPrice}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-cocoa shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(cartItem.id, cartItem.quantity - 1)}
                        className="h-5 w-5 rounded bg-cream flex items-center justify-center hover:bg-lemon"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="font-black text-xs px-1">{cartItem.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(cartItem.id, cartItem.quantity + 1)}
                        className="h-5 w-5 rounded bg-cream flex items-center justify-center hover:bg-lemon"
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(cartItem.id)}
                      className="text-cocoa-fade hover:text-cherry p-1 shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-3 text-cocoa-fade" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon (e.g. DIRECT15)"
                      className="w-full pl-8 pr-3 py-2 text-xs font-bold uppercase rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="pill-btn bg-lemon text-cocoa text-xs !py-2 !px-4 shadow-pop-sm"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-[11px] font-bold text-emerald-800 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Check size={14} /> Coupon {appliedCoupon.code} applied (-₹{discountAmount})
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-[10px] text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="mt-1 text-[11px] font-bold text-red-600">{couponError}</p>
                )}
              </form>

              {/* Authoritative Bill Breakdown */}
              <div className="border-t-2 border-dashed border-cocoa/30 pt-3 space-y-2 text-xs font-bold">
                <div className="flex justify-between text-cocoa">
                  <span>Item Subtotal</span>
                  <span>₹{itemTotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Direct Order Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-cocoa-soft text-[11px]">
                  <span>GST (5% Inclusive)</span>
                  <span>Included (₹{gstAmount.toFixed(2)})</span>
                </div>

                <div className="flex justify-between text-cocoa">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-black">FREE (Orders &gt; ₹500)</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-cherry border-t-2 border-cocoa pt-3">
                  <span>Total Payable</span>
                  <span className="font-display text-2xl">₹{grandTotal}</span>
                </div>
              </div>

              {/* Submit & Pay Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="pill-btn w-full bg-cherry text-white text-base !py-3.5 flex items-center justify-center gap-2 shadow-pop-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Simulating Payment &amp; Dispatch...
                  </span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Pay &amp; Place Order &bull; ₹{grandTotal}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center font-bold text-cocoa-fade">
                🔒 Safe &amp; verified direct transaction &bull; Zero app commissions
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

