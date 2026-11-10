import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, UtensilsCrossed, ArrowLeft } from 'lucide-react';

interface RoleAuthGateProps {
  requiredRole: 'KITCHEN_STAFF' | 'ADMIN';
  onAuthenticated: (user: any) => void;
  onBackToHome: () => void;
}

export default function RoleAuthGate({
  requiredRole,
  onAuthenticated,
  onBackToHome,
}: RoleAuthGateProps) {
  const isKDS = requiredRole === 'KITCHEN_STAFF';

  const defaultIdentifier = isKDS ? 'chef.kondapur@nawaabs.com' : 'admin@nawaabs.com';
  const defaultPassword = isKDS ? 'kitchen123' : 'admin123';

  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [password, setPassword] = useState(defaultPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (idToUse?: string, pwToUse?: string) => {
    setIsLoading(true);
    setErrorMessage('');

    const finalId = idToUse || identifier;
    const finalPw = pwToUse || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_or_email: finalId.trim(),
          password: finalPw,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Authentication failed. Please verify credentials.');
      }

      const data = await res.json();
      const userRole = data.user.role;

      // Validate role permissions
      if (isKDS && userRole !== 'KITCHEN_STAFF' && userRole !== 'ADMIN') {
        throw new Error('Access Denied: This portal requires Kitchen Staff or Admin permissions.');
      }

      if (!isKDS && userRole !== 'ADMIN') {
        throw new Error('Access Denied: Central Operations CMS requires Admin role.');
      }

      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user_role', userRole);
      }

      onAuthenticated(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handle1ClickDemo = () => {
    const demoId = isKDS ? 'demokitchen' : 'demoadmin';
    setIdentifier(demoId);
    setPassword('demo');
    handleLogin(demoId, 'demo');
  };

  return (
    <div className="min-h-screen bg-cream text-cocoa flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md card-pop bg-white border-[4px] border-cocoa rounded-3xl shadow-pop-lg overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-11 w-11 rounded-2xl bg-white border-2 border-cocoa flex items-center justify-center text-cherry shadow-pop-sm">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                {isKDS ? 'Station Tablet Security' : 'Executive Operations'}
              </span>
              <h2 className="font-display text-2xl text-cherry outline-text [text-stroke-width:0.5px]">
                {isKDS ? 'Kitchen Staff Login' : 'Admin CMS Portal'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream"
            title="Return to Storefront"
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Reviewer 1-Click Demo Bypass */}
          <div className="rounded-2xl bg-lemon/35 border-2 border-cocoa p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-cherry flex items-center gap-1.5">
                <Sparkles size={13} /> Reviewer 1-Click Bypass
              </span>
              <span className="text-[10px] font-mono font-bold text-cocoa">demo / demo</span>
            </div>
            <button
              type="button"
              onClick={handle1ClickDemo}
              disabled={isLoading}
              className="pill-btn w-full bg-cherry text-white text-xs !py-2.5 flex items-center justify-center gap-2 shadow-pop-sm hover:scale-[1.02] active:scale-95 font-black"
            >
              <span>{isKDS ? 'Instant KDS Demo Access (Chef Raheem)' : 'Instant Admin CMS Demo Access'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-xs font-bold text-rose-800">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4 pt-1"
          >
            <div>
              <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                <Mail size={12} /> {isKDS ? 'Chef Email / Station ID' : 'Admin Email'}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                placeholder="Enter username or 'demo'"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                <Lock size={12} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-white outline-none focus:ring-2 focus:ring-lemon"
                placeholder="Enter password or 'demo'"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="pill-btn w-full bg-cocoa text-lemon text-sm !py-3 flex items-center justify-center gap-2 shadow-pop-sm hover:scale-[1.02] active:scale-95 font-black disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying...' : `Unlock ${isKDS ? 'KDS Tablet' : 'Operations Console'}`}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs font-bold text-cocoa-fade hover:text-cherry underline"
            >
              Return to Customer Storefront
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

