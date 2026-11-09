import React, { useState } from 'react';
import { X, Phone, MapPin, ArrowRight, ShieldCheck, Sparkles, User } from 'lucide-react';
import { OUTLETS, type Outlet } from '../data';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; phone: string; address: string }, outlet: Outlet) => void;
  initialOutlet: Outlet;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialOutlet,
}: LoginModalProps) {
  const [name, setName] = useState('Karan Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [selectedOutletId, setSelectedOutletId] = useState(initialOutlet.id);
  const [address, setAddress] = useState('Flat 402, Aditya Sunshine, Kondapur');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || initialOutlet;
    onLoginSuccess(
      {
        name: name.trim() || 'Karan Sharma',
        phone: phone.trim() || '+91 98765 43210',
        address: address.trim() || `${chosenOutlet.area}, Hyderabad`,
      },
      chosenOutlet
    );
    onClose();
  };

  const handleQuickDemoLogin = () => {
    const defaultOutlet = OUTLETS[0]; // Kondapur Flagship
    onLoginSuccess(
      {
        name: 'Karan Sharma',
        phone: '+91 98765 43210',
        address: 'Flat 402, Aditya Sunshine, Kondapur',
      },
      defaultOutlet
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card-pop relative w-full max-w-md bg-cream border-[4px] border-cocoa rounded-3xl shadow-pop-lg overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-10 w-10 rounded-2xl bg-white border-2 border-cocoa flex items-center justify-center text-2xl shadow-pop-sm">
              🍗
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                Nawaab's Biryani Co.
              </span>
              <h3 className="font-display text-xl text-cherry outline-text [text-stroke-width:0.5px]">
                Customer Login
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-cocoa">
          <div>
            <span className="inline-block rounded-full border border-cocoa bg-aqua/30 px-3 py-1 text-[11px] font-bold text-cocoa mb-3">
              ⚡ Select your location to view authentic menu &amp; live prices
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
              <User size={12} /> Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
              <MapPin size={12} /> Select Delivery Location in Hyderabad
            </label>
            <select
              value={selectedOutletId}
              onChange={(e) => setSelectedOutletId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon cursor-pointer"
            >
              {OUTLETS.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name} ({outlet.type === 'CLOUD_KITCHEN' ? 'Cloud Kitchen' : 'Dine-In'}) &bull; {outlet.area}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-cocoa-fade font-semibold mt-1">
              Menu items and live station timers are tailored to this location.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="pill-btn w-full bg-cherry text-white text-sm !py-3 flex items-center justify-center gap-2 shadow-pop-sm hover:scale-[1.02] active:scale-95"
            >
              <span>Login &amp; View Location Menu</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full text-center text-[11px] font-bold text-cherry hover:underline py-1"
            >
              ⚡ Quick 1-Click Test Login as Karan Sharma (Kondapur)
            </button>
          </div>

          <div className="pt-2 border-t border-dashed border-cocoa/20 text-center">
            <p className="text-[10px] font-bold text-cocoa-fade flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>DPDP Act 2023 Compliant &bull; Zero Delivery App Fees</span>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}
