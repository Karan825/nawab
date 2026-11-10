import React, { useEffect, useState } from 'react';
import { UtensilsCrossed, User, ShoppingBag, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onGoToOrder: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export default function Navbar({
  onOpenLogin,
  onGoToOrder,
  isLoggedIn = false,
  userName = 'Karan Sharma',
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-cream/95 shadow-[0_4px_0_0_#3A2318] backdrop-blur-md py-3'
            : 'bg-cream/90 backdrop-blur-sm py-4'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Tagline */}
          <a href="#top" className="flex items-center gap-3 group shrink-0">
            <span className="relative inline-flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border-[3px] border-cocoa bg-lemon shadow-pop-sm transition-transform duration-200 group-hover:-rotate-6 text-cocoa">
              <UtensilsCrossed size={22} strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl sm:text-3xl text-cherry outline-text [text-stroke-width:0.5px]">
                Nawaab's
              </span>
              <span className="text-[10px] sm:text-[11px] font-black tracking-[0.35em] text-cocoa-fade uppercase mt-0.5">
                BIRYANI CO.
              </span>
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cocoa">
            <a
              href="#heritage"
              className="px-3.5 py-2 rounded-xl hover:bg-lemon transition-colors"
            >
              Our Heritage
            </a>
            <a
              href="#why-direct"
              className="px-3.5 py-2 rounded-xl hover:bg-lemon transition-colors"
            >
              Why Direct?
            </a>
            <a
              href="#signatures"
              className="px-3.5 py-2 rounded-xl hover:bg-lemon transition-colors"
            >
              Diner Reviews
            </a>
            <a
              href="#catering"
              className="px-3.5 py-2 rounded-xl hover:bg-lemon transition-colors"
            >
              Dawat Catering
            </a>
          </div>

          {/* Actions: Direct Order & User State */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onGoToOrder}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cocoa/30 bg-white text-xs font-black text-cocoa shadow-sm hover:bg-lemon transition-colors"
                  title="Your Profile"
                >
                  <User size={14} className="text-cherry" />
                  <span>{userName.split(' ')[0]}</span>
                </button>

                <button
                  type="button"
                  onClick={onGoToOrder}
                  className="pill-btn bg-cherry text-white text-xs sm:text-sm !py-2.5 !px-5 sm:!px-6 flex items-center gap-2 shadow-pop-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <ShoppingBag size={15} />
                  <span>Order Now</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="pill-btn bg-white text-cocoa border-2 border-cocoa text-xs sm:text-sm !py-2.5 !px-4 sm:!px-5 shadow-pop-sm hover:bg-lemon transition-all"
                >
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={onGoToOrder}
                  className="pill-btn bg-cherry text-white text-xs sm:text-sm !py-2.5 !px-5 sm:!px-6 flex items-center gap-2 shadow-pop-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <ShoppingBag size={15} />
                  <span>Order Now</span>
                </button>
              </div>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
}
