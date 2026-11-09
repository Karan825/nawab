import { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag, MapPin } from 'lucide-react';
import { OUTLETS, Outlet } from '../data';

const LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Craft Handi', href: '#builder' },
  { label: 'Starters & Kebabs', href: '#starters' },
  { label: 'Hyderabad Outlets', href: '#find-us' },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3 group">
      <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-cocoa bg-lemon shadow-pop-sm transition-transform duration-200 group-hover:-rotate-12 shrink-0">
        <span className="text-2xl leading-none">🍗</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl text-cherry outline-text [text-stroke-width:0.5px] sm:text-3xl tracking-wide">
          Nawaab's Biryani
        </span>
        <span className="text-[10px] font-extrabold tracking-[0.35em] text-cocoa-fade uppercase mt-1">
          Kachhi Dum &bull; Hyderabad
        </span>
      </span>
    </a>
  );
}

interface NavbarProps {
  selectedOutlet: Outlet;
  onSelectOutlet: (outlet: Outlet) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({
  selectedOutlet,
  onSelectOutlet,
  cartCount,
  onOpenCart,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled ? 'bg-cream/95 shadow-[0_3px_0_0_#3a2318] backdrop-blur' : 'bg-cream/90 backdrop-blur-sm'
        } border-b-[3px] border-cocoa`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />

          {/* Center: Outlet Switcher */}
          <div className="hidden md:flex items-center gap-2 rounded-full border-[3px] border-cocoa bg-white px-4 py-1.5 shadow-pop-sm">
            <MapPin size={16} className="text-cherry animate-bounce shrink-0" />
            <span className="text-xs font-bold text-cocoa-fade">Outlet:</span>
            <select
              value={selectedOutlet.id}
              onChange={(e) => {
                const found = OUTLETS.find((o) => o.id === e.target.value);
                if (found) onSelectOutlet(found);
              }}
              className="text-xs font-black text-cocoa bg-transparent outline-none cursor-pointer pr-1"
            >
              {OUTLETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.deliveryRadiusKm}km radius)
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-extrabold uppercase tracking-wider text-cocoa transition-colors hover:bg-lemon"
              >
                {link.label}
              </a>
            ))}

            {/* Cart Pill Button */}
            <button
              onClick={onOpenCart}
              className="pill-btn ml-3 bg-cherry text-white text-sm !px-5 !py-2.5 flex items-center gap-2"
            >
              <ShoppingBag size={17} />
              <span>Handi Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-lemon text-cocoa text-xs font-black border-2 border-cocoa">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenCart}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-cocoa bg-cherry text-white shadow-pop-sm relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-lemon text-cocoa font-black text-[10px] border border-cocoa flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-cocoa bg-lemon shadow-pop-sm"
            >
              {open ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="border-t-[3px] border-cocoa bg-cream px-4 pb-5 pt-3 lg:hidden space-y-2">
            <div className="flex items-center gap-2 rounded-2xl border-2 border-cocoa bg-white p-2.5 text-xs font-bold">
              <MapPin size={16} className="text-cherry" />
              <span>{selectedOutlet.name}</span>
            </div>

            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-sm font-extrabold uppercase tracking-wider hover:bg-lemon"
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => { setOpen(false); onOpenCart(); }}
              className="pill-btn w-full mt-2 bg-cherry text-white text-sm"
            >
              View Cart ({cartCount})
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
