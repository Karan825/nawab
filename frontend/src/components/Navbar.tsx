import { useEffect, useState } from 'react';
import { ShoppingBag, MapPin, ChevronDown, X, Search, Check, UtensilsCrossed } from 'lucide-react';
import { OUTLETS, type Outlet } from '../data';

interface NavbarProps {
  selectedOutlet: Outlet;
  onSelectOutlet: (outlet: Outlet) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onGoToOrder?: () => void;
}

export default function Navbar({
  selectedOutlet,
  onSelectOutlet,
  cartCount,
  cartTotal,
  onOpenCart,
  onGoToOrder,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);
  const [outletSearch, setOutletSearch] = useState('');
  const [outletFilter, setOutletFilter] = useState<'ALL' | 'PHYSICAL_DINEIN' | 'CLOUD_KITCHEN'>('ALL');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filteredOutlets = OUTLETS.filter((outlet) => {
    const matchesFilter = outletFilter === 'ALL' || outlet.type === outletFilter;
    const cleanSearch = outletSearch.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      outlet.name.toLowerCase().includes(cleanSearch) ||
      outlet.area.toLowerCase().includes(cleanSearch) ||
      outlet.address.toLowerCase().includes(cleanSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div
          className={`transition-all duration-300 ${
            scrolled
              ? 'bg-cream/95 shadow-[0_4px_0_0_#3A2318] backdrop-blur-md py-3'
              : 'bg-cream/90 backdrop-blur-sm py-4'
          }`}
        >
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            
            {/* Left: Brand Logo & Tagline */}
            <a href="#top" className="flex items-center gap-3 group shrink-0">
              <span className="relative inline-flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border-[3px] border-cocoa bg-lemon shadow-pop-sm transition-transform duration-200 group-hover:-rotate-6">
                <span className="text-2xl sm:text-3xl leading-none">🍗</span>
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

            {/* Middle: Prominent Outlet Location Selector Pill */}
            <div className="flex-1 max-w-sm sm:max-w-md mx-2">
              <button
                type="button"
                onClick={() => setIsOutletModalOpen(true)}
                className="w-full card-pop flex items-center justify-between gap-2 rounded-2xl border-2 sm:border-[3px] border-cocoa bg-white px-3 sm:px-4 py-2 text-left hover:bg-lemon transition-colors"
                title="Click to change your delivery kitchen"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-8 w-8 rounded-xl bg-lemon-light border border-cocoa flex items-center justify-center text-cherry shrink-0">
                    <MapPin size={16} />
                  </span>
                  <div className="min-w-0 leading-tight">
                    <span className="block text-[9px] uppercase font-black tracking-wider text-cocoa-fade">
                      Delivering From Kitchen
                    </span>
                    <span className="font-display text-xs sm:text-sm text-cocoa truncate block">
                      {selectedOutlet.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-1">
                  <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-wider bg-cream border border-cocoa px-2 py-0.5 rounded-full text-cocoa">
                    Change
                  </span>
                  <ChevronDown size={16} className="text-cocoa-fade" />
                </div>
              </button>
            </div>

            {/* Right: Nav Links & Cart Trigger */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="hidden lg:flex items-center gap-1 text-xs font-black uppercase tracking-wider text-cocoa">
                <a
                  href="#menu"
                  className="px-3.5 py-2 rounded-xl hover:bg-lemon transition-colors border border-transparent hover:border-cocoa"
                >
                  Menu
                </a>
                <a
                  href="#outlets"
                  className="px-3.5 py-2 rounded-xl hover:bg-lemon transition-colors border border-transparent hover:border-cocoa"
                >
                  17 Outlets
                </a>
              </div>

              {onGoToOrder && (
                <button
                  type="button"
                  onClick={onGoToOrder}
                  className="pill-btn bg-lemon text-cocoa text-xs sm:text-sm !py-2.5 !px-3.5 sm:!px-4 flex items-center gap-1.5 shadow-pop-sm hover:scale-105 active:scale-95"
                  title="Open Swiggy-level ordering dashboard"
                >
                  <span>Order Direct</span>
                </button>
              )}

              {/* Cart Button */}
              <button
                type="button"
                onClick={onOpenCart}
                className="pill-btn bg-cherry text-white text-xs sm:text-sm !py-2.5 !px-3.5 sm:!px-4 flex items-center gap-1.5 shadow-pop-sm hover:scale-105 active:scale-95 transition-all"
                title="View your cart"
              >
                <div className="relative">
                  <ShoppingBag size={17} strokeWidth={2.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 h-4 w-4 rounded-full bg-lemon border-2 border-cocoa text-cocoa text-[9px] font-black flex items-center justify-center shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-black">
                  {cartCount === 0 ? 'Cart' : `₹${cartTotal}`}
                </span>
              </button>
            </div>

          </nav>
        </div>
      </header>

      {/* Outlet Selection Modal (Never overflows, 100% scrollable & responsive) */}
      {isOutletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="card-pop relative w-full max-w-xl bg-cream border-[4px] border-cocoa rounded-3xl shadow-pop-lg max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-10 w-10 rounded-2xl bg-white border-2 border-cocoa flex items-center justify-center text-xl shadow-pop-sm">
                  📍
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                    17 Locations Across Hyderabad
                  </span>
                  <h3 className="font-display text-xl text-cherry outline-text [text-stroke-width:0.5px]">
                    Select Delivery Kitchen
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOutletModalOpen(false)}
                className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter & Search Bar Inside Modal */}
            <div className="p-4 bg-white border-b-2 border-cocoa/20 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3 text-cocoa-fade" />
                <input
                  type="text"
                  value={outletSearch}
                  onChange={(e) => setOutletSearch(e.target.value)}
                  placeholder="Search by area (e.g. Kondapur, Banjara Hills, Miyapur)..."
                  className="w-full pl-9 pr-8 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white focus:ring-2 focus:ring-lemon"
                />
                {outletSearch && (
                  <button
                    type="button"
                    onClick={() => setOutletSearch('')}
                    className="absolute right-2.5 top-2.5 text-cocoa-fade hover:text-cocoa"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOutletFilter('ALL')}
                  className={`text-[11px] font-black px-3 py-1.5 rounded-full border-2 border-cocoa transition-all ${
                    outletFilter === 'ALL'
                      ? 'bg-cocoa text-lemon shadow-pop-sm'
                      : 'bg-white text-cocoa hover:bg-cream'
                  }`}
                >
                  All 17 Outlets
                </button>
                <button
                  type="button"
                  onClick={() => setOutletFilter('PHYSICAL_DINEIN')}
                  className={`text-[11px] font-black px-3 py-1.5 rounded-full border-2 border-cocoa transition-all ${
                    outletFilter === 'PHYSICAL_DINEIN'
                      ? 'bg-cocoa text-lemon shadow-pop-sm'
                      : 'bg-white text-cocoa hover:bg-cream'
                  }`}
                >
                  14 Flagship Dine-In
                </button>
                <button
                  type="button"
                  onClick={() => setOutletFilter('CLOUD_KITCHEN')}
                  className={`text-[11px] font-black px-3 py-1.5 rounded-full border-2 border-cocoa transition-all ${
                    outletFilter === 'CLOUD_KITCHEN'
                      ? 'bg-cocoa text-lemon shadow-pop-sm'
                      : 'bg-white text-cocoa hover:bg-cream'
                  }`}
                >
                  3 Cloud Kitchens
                </button>
              </div>
            </div>

            {/* Scrollable List of Outlets */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 max-h-[50vh]">
              {filteredOutlets.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="font-display text-base text-cocoa">No kitchens found in "{outletSearch}"</p>
                  <p className="text-xs text-cocoa-fade">Try searching another Hyderabad area or clear filter.</p>
                </div>
              ) : (
                filteredOutlets.map((outlet) => {
                  const isSelected = selectedOutlet.id === outlet.id;
                  return (
                    <button
                      key={outlet.id}
                      type="button"
                      onClick={() => {
                        onSelectOutlet(outlet);
                        setIsOutletModalOpen(false);
                      }}
                      className={`w-full p-3.5 rounded-2xl border-2 border-cocoa text-left flex items-start justify-between gap-3 transition-all ${
                        isSelected
                          ? 'bg-lemon shadow-pop-sm border-cocoa'
                          : 'bg-white hover:bg-cream'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm text-cocoa">{outlet.name}</span>
                          <span className="text-[9px] uppercase font-black bg-white border border-cocoa px-2 py-0.5 rounded-full text-cocoa">
                            {outlet.type === 'CLOUD_KITCHEN' ? 'Cloud Kitchen' : 'Dine-In'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-cocoa-soft truncate max-w-sm">
                          {outlet.address}
                        </p>
                        <p className="text-[10px] font-bold text-cherry flex items-center gap-2">
                          <span>Radius: {outlet.deliveryRadiusKm} km</span> &bull;
                          <span>Min Prep: {outlet.minPrepTimeMinutes}m</span> &bull;
                          <span className="font-mono text-cocoa-fade">FSSAI: {outlet.fssaiLicense}</span>
                        </p>
                      </div>

                      <div className="shrink-0 pt-1">
                        {isSelected ? (
                          <span className="h-6 w-6 rounded-full bg-cherry text-white flex items-center justify-center text-xs font-black shadow-pop-sm">
                            <Check size={14} strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="text-xs font-black text-cocoa-fade hover:text-cherry">
                            Select
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Footer Note */}
            <div className="p-3 bg-white border-t-2 border-cocoa/20 text-center text-[11px] font-bold text-cocoa-fade">
              🚚 Orders are routed directly to the selected kitchen for live cooking.
            </div>

          </div>
        </div>
      )}
    </>
  );
}
