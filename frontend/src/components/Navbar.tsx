import { useEffect, useState } from 'react';
import { ShoppingBag, MapPin, Search, ChevronDown, X } from 'lucide-react';
import { OUTLETS, type Outlet } from '../data';

interface NavbarProps {
  selectedOutlet: Outlet;
  onSelectOutlet: (outlet: Outlet) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchTerm: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  selectedOutlet,
  onSelectOutlet,
  cartCount,
  cartTotal,
  onOpenCart,
  searchTerm,
  onSearchChange,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled ? 'bg-cream/95 shadow-[0_3px_0_0_#3A2318] backdrop-blur-md' : 'bg-cream/90 backdrop-blur-sm'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5 group shrink-0">
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-cocoa bg-lemon shadow-pop-sm transition-transform duration-200 group-hover:-rotate-12">
              <span className="text-2xl leading-none">🍗</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl text-cherry outline-text [text-stroke-width:0.5px] sm:text-2xl">
                Nawaab's
              </span>
              <span className="text-[9px] font-extrabold tracking-[0.3em] text-cocoa-fade uppercase">
                BIRYANI CO.
              </span>
            </span>
          </a>

          {/* Delivery Location Selector Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOutletDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-full border-2 border-cocoa bg-white px-3.5 py-1.5 text-xs font-black text-cocoa shadow-pop-sm hover:bg-lemon transition-colors"
            >
              <MapPin size={14} className="text-cherry shrink-0" />
              <div className="text-left hidden sm:block">
                <span className="block text-[9px] uppercase tracking-wider text-cocoa-fade font-extrabold leading-none">
                  Outlet
                </span>
                <span className="truncate max-w-[150px] block leading-tight">{selectedOutlet.name}</span>
              </div>
              <span className="sm:hidden font-bold">{selectedOutlet.area}</span>
              <ChevronDown size={14} className="text-cocoa-fade ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {isOutletDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl border-[3px] border-cocoa bg-white p-2 shadow-pop-lg z-50">
                <div className="p-2 border-b-2 border-dashed border-cocoa/20 mb-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-cocoa">
                    Select Nearest Kitchen
                  </p>
                  <p className="text-[10px] text-cocoa-soft font-semibold">
                    Orders route directly to the station screen
                  </p>
                </div>
                {OUTLETS.map((outlet) => (
                  <button
                    key={outlet.id}
                    type="button"
                    onClick={() => {
                      onSelectOutlet(outlet);
                      setIsOutletDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between text-xs ${
                      selectedOutlet.id === outlet.id
                        ? 'bg-lemon font-black text-cocoa border-2 border-cocoa'
                        : 'hover:bg-cream text-cocoa font-bold'
                    }`}
                  >
                    <div>
                      <p className="leading-tight">{outlet.name}</p>
                      <p className="text-[10px] text-cocoa-fade font-normal mt-0.5">
                        Radius: {outlet.deliveryRadiusKm} km &bull; Min Prep: {outlet.minPrepTimeMinutes}m
                      </p>
                    </div>
                    {selectedOutlet.id === outlet.id && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search Bar */}
          <div className="relative hidden md:flex items-center flex-1 max-w-xs">
            <Search size={15} className="absolute left-3.5 text-cocoa-fade" />
            <input
              type="text"
              placeholder="Search biryani, starters, chai..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-7 py-1.5 rounded-full border-2 border-cocoa text-xs font-bold bg-white outline-none focus:ring-2 focus:ring-lemon placeholder:text-cocoa-fade shadow-pop-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-cocoa-fade hover:text-cocoa"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Navigation Links & Cart Indicator */}
          <div className="flex items-center gap-2">
            <a
              href="#menu"
              className="hidden lg:inline-block rounded-full px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-cocoa hover:bg-lemon transition-colors"
            >
              Menu
            </a>
            <a
              href="#outlets"
              className="hidden lg:inline-block rounded-full px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-cocoa hover:bg-lemon transition-colors"
            >
              Outlets
            </a>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="pill-btn bg-cherry text-white text-xs sm:text-sm !px-4 sm:!px-5 !py-2 sm:!py-2.5 flex items-center gap-2 shadow-pop-sm hover:scale-105 transition-transform"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline font-black">Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 items-center justify-center rounded-full bg-lemon text-cocoa px-2 text-xs font-black">
                  {cartCount} &bull; ₹{cartTotal}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Search Input */}
        <div className="px-4 pb-2.5 md:hidden">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-cocoa-fade" />
            <input
              type="text"
              placeholder="Search biryani, starters, chai..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 rounded-full border-2 border-cocoa text-xs font-bold bg-white outline-none shadow-pop-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-cocoa-fade hover:text-cocoa"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
