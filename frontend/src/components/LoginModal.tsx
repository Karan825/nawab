import React, { useState } from 'react';
import { X, Lock, Mail, Phone, MapPin, ArrowRight, User, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import { OUTLETS, type Outlet } from '../data';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; phone: string; address: string; email?: string }, outlet: Outlet) => void;
  initialOutlet: Outlet;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialOutlet,
}: LoginModalProps) {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('karan@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Location selector
  const [selectedOutletId, setSelectedOutletId] = useState(initialOutlet.id);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_or_email: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Invalid credentials. Please verify your details.');
      }

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
      }

      const chosenOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || initialOutlet;
      onLoginSuccess(
        {
          name: data.user.name,
          phone: data.user.phone,
          email: data.user.email,
          address: `${chosenOutlet.area}, Hyderabad`,
        },
        chosenOutlet
      );
      onClose();
    } catch (err: any) {
      console.warn('Login authentication failed:', err.message);
      setErrorMessage(err.message || 'Invalid email/phone or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const chosenOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || initialOutlet;
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          email: signupEmail.trim().toLowerCase(),
          phone: signupPhone.trim(),
          password: signupPassword,
          outlet_id: 1,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create account.');
      }

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
      }

      onLoginSuccess(
        {
          name: data.user.name,
          phone: data.user.phone,
          email: data.user.email,
          address: `${chosenOutlet.area}, Hyderabad`,
        },
        chosenOutlet
      );
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card-pop relative w-full max-w-md bg-cream border-[4px] border-cocoa rounded-3xl shadow-pop-lg overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-10 w-10 rounded-2xl bg-white border-2 border-cocoa flex items-center justify-center text-cocoa shadow-pop-sm">
              <UtensilsCrossed size={18} strokeWidth={2.5} />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                Nawaab's Biryani Co.
              </span>
              <h3 className="font-display text-xl text-cherry outline-text [text-stroke-width:0.5px]">
                {mode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 border-b-[3px] border-cocoa bg-white text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setErrorMessage('');
            }}
            className={`py-3 text-center transition-all ${
              mode === 'LOGIN'
                ? 'bg-cocoa text-lemon'
                : 'text-cocoa hover:bg-cream'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('SIGNUP');
              setErrorMessage('');
            }}
            className={`py-3 text-center transition-all ${
              mode === 'SIGNUP'
                ? 'bg-cocoa text-lemon'
                : 'text-cocoa hover:bg-cream'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 mx-6 mt-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-xs font-bold text-rose-800">
            {errorMessage}
          </div>
        )}

        {/* Mode 1: Sign In */}
        {mode === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-cocoa">
            <div>
              <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                <Mail size={12} /> Email or Mobile Phone
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                placeholder="karan@example.com or +91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                <Lock size={12} /> Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                  placeholder="Enter your secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-cocoa-fade hover:text-cocoa p-1"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                <MapPin size={12} /> Delivery Area (Hyderabad Station)
              </label>
              <select
                value={selectedOutletId}
                onChange={(e) => setSelectedOutletId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon cursor-pointer"
              >
                {OUTLETS.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    {outlet.name} &bull; {outlet.area}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="pill-btn w-full bg-cherry text-white text-sm !py-3 flex items-center justify-center gap-2 shadow-pop-sm hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        ) : (
          /* Mode 2: Sign Up */
          <form onSubmit={handleSignupSubmit} className="p-6 space-y-3.5 text-cocoa">
            <div>
              <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                <User size={12} /> Full Name
              </label>
              <input
                type="text"
                required
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                placeholder="e.g. Asaduddin Khan"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                  <Mail size={12} /> Email
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                  placeholder="asad@example.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                  <Phone size={12} /> Mobile Phone
                </label>
                <input
                  type="tel"
                  required
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                  <Lock size={12} /> Password
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                  placeholder="Min 6 chars"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                  <Lock size={12} /> Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                <MapPin size={12} /> Default Station Kitchen
              </label>
              <select
                value={selectedOutletId}
                onChange={(e) => setSelectedOutletId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon cursor-pointer"
              >
                {OUTLETS.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    {outlet.name} &bull; {outlet.area}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="pill-btn w-full bg-cherry text-white text-sm !py-3 flex items-center justify-center gap-2 shadow-pop-sm hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
