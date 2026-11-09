import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  MapPin,
  Clock,
  Star,
  Flame,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Award,
  Filter,
  Check,
  Home
} from 'lucide-react';
import {
  Outlet,
  MenuItem,
  PortionOption,
  AddonOption,
  CartItem,
  OUTLETS,
  CATEGORIES,
  Category,
  getMenuItemsForOutlet,
} from '../data';

interface OrderDashboardPageProps {
  selectedOutlet: Outlet;
  onSelectOutlet: (outlet: Outlet) => void;
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem, portion: PortionOption, addons: AddonOption[]) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenCart: () => void;
  onNavigateToCheckout: () => void;
  onBackToHome: () => void;
  customerUser: { name: string; phone: string; address: string };
}

// Portion & Add-ons modal
function CustomizerModal({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdd: (portion: PortionOption, addons: AddonOption[]) => void;
}) {
  const [selectedPortion, setSelectedPortion] = useState<PortionOption>(item.portions[0]);
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);

  const toggleAddon = (addon: AddonOption) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id) ? prev.filter((a) => a.id !== addon.id) : [...prev, addon]
    );
  };

  const calculatedUnitPrice =
    item.price +
    selectedPortion.priceModifier +
    selectedAddons.reduce((acc, a) => acc + a.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card-pop relative w-full max-w-lg bg-cream border-[4px] border-cocoa shadow-pop-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full border border-cocoa ${
                item.dietary === 'VEG' ? 'bg-emerald-600' : 'bg-cherry'
              }`}
            />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                Customize Dish
              </span>
              <h3 className="font-display text-xl text-cherry outline-text [text-stroke-width:0.5px]">
                {item.name}
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-cocoa">
          {/* Portions */}
          <div>
            <h4 className="font-display text-base text-cherry mb-2">1. Choose Portion</h4>
            <div className="grid gap-2 sm:grid-cols-3">
              {item.portions.map((portion) => (
                <button
                  key={portion.id}
                  type="button"
                  onClick={() => setSelectedPortion(portion)}
                  className={`p-3 rounded-2xl border-2 border-cocoa flex flex-col justify-between transition-all ${
                    selectedPortion.id === portion.id
                      ? 'bg-lemon font-black shadow-pop-sm -translate-y-0.5'
                      : 'bg-white hover:bg-cream font-bold'
                  }`}
                >
                  <div className="text-left">
                    <span className="block text-sm">{portion.name}</span>
                    <span className="text-[11px] text-cocoa-fade">{portion.serves}</span>
                  </div>
                  <span className="font-display text-sm text-cherry mt-1">
                    {portion.priceModifier > 0 ? `+₹${portion.priceModifier}` : 'Standard'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          {item.addons.length > 0 && (
            <div>
              <h4 className="font-display text-base text-cherry mb-2">2. Extra Sides &amp; Salan</h4>
              <div className="space-y-2">
                {item.addons.map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-3 rounded-2xl border-2 border-cocoa flex items-center justify-between text-xs transition-all ${
                        isSelected
                          ? 'bg-aqua font-black shadow-pop-sm -translate-y-0.5'
                          : 'bg-white hover:bg-cream font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded border border-cocoa flex items-center justify-center ${
                            isSelected ? 'bg-cocoa text-lemon' : 'bg-white'
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </span>
                        <span className="text-xs">{addon.name}</span>
                      </div>
                      <span className="font-bold text-cocoa">+₹{addon.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t-[3px] border-cocoa bg-white flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">Total</span>
            <span className="font-display text-2xl text-cherry">₹{calculatedUnitPrice}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onAdd(selectedPortion, selectedAddons);
              onClose();
            }}
            className="pill-btn bg-cherry text-white text-sm !px-6 !py-3 flex items-center gap-2 shadow-pop-sm hover:scale-105"
          >
            <ShoppingBag size={18} />
            <span>Add Item &bull; ₹{calculatedUnitPrice}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default function OrderDashboardPage({
  selectedOutlet,
  onSelectOutlet,
  cartItems,
  onAddToCart,
  onUpdateQty,
  onRemoveItem,
  onOpenCart,
  onNavigateToCheckout,
  onBackToHome,
  customerUser,
}: OrderDashboardPageProps) {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);

  // Customizer state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Get outlet-specific menu items dynamically!
  const outletMenuItems = useMemo(() => {
    return getMenuItemsForOutlet(selectedOutlet.id);
  }, [selectedOutlet.id]);

  // Filter items
  const filteredItems = useMemo(() => {
    return outletMenuItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      // Veg only filter
      if (vegOnly && item.dietary !== 'VEG') return false;
      // Bestseller only filter
      if (bestsellerOnly && !item.bestseller) return false;
      // Search query
      if (searchQuery.trim()) {
        const clean = searchQuery.toLowerCase().trim();
        const matches =
          item.name.toLowerCase().includes(clean) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(clean)) ||
          item.category.toLowerCase().includes(clean) ||
          item.description.toLowerCase().includes(clean);
        if (!matches) return false;
      }
      return true;
    });
  }, [outletMenuItems, activeCategory, vegOnly, bestsellerOnly, searchQuery]);

  const totalCartCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, c) => acc + c.totalPrice, 0);

  // Helper to find quantity in cart for an item
  const getItemCartQty = (itemId: string) => {
    return cartItems
      .filter((c) => c.item.id === itemId)
      .reduce((sum, c) => sum + c.quantity, 0);
  };

  const handleAddClick = (item: MenuItem) => {
    if (item.portions.length > 1 || item.addons.length > 0) {
      setCustomizingItem(item);
    } else {
      onAddToCart(item, item.portions[0], []);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-cocoa pb-28 font-body">
      
      {/* Top Professional Sticky Header */}
      <header className="border-b-[3px] border-cocoa bg-lemon sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Home Link */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2 group text-left"
              title="Return to Nawaab's Home"
            >
              <span className="h-11 w-11 rounded-2xl bg-white border-2 border-cocoa flex items-center justify-center text-2xl shadow-pop-sm group-hover:-rotate-6 transition-transform">
                🍗
              </span>
              <div>
                <span className="font-display text-xl sm:text-2xl text-cherry outline-text [text-stroke-width:0.5px] block leading-none">
                  Nawaab's
                </span>
                <span className="text-[9px] font-black tracking-widest text-cocoa-fade uppercase">
                  DIRECT ORDER
                </span>
              </div>
            </button>
          </div>

          {/* Station Quick Switcher Chip */}
          <button
            type="button"
            onClick={() => setIsOutletModalOpen(true)}
            className="flex items-center gap-2 bg-white border-2 border-cocoa px-3.5 py-1.5 rounded-full text-xs font-black shadow-pop-sm hover:bg-cream transition-colors max-w-xs sm:max-w-sm truncate"
          >
            <MapPin size={14} className="text-cherry shrink-0" />
            <span className="truncate">{selectedOutlet.name}</span>
            <ChevronDown size={14} className="text-cocoa-fade shrink-0" />
          </button>

          {/* User Profile & Cart Button */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold bg-white/70 border border-cocoa/30 px-3 py-1.5 rounded-xl">
              <span>👤</span>
              <span className="font-display text-cocoa">{customerUser.name}</span>
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className="pill-btn bg-cherry text-white text-xs sm:text-sm !py-2 !px-4 flex items-center gap-2 shadow-pop-sm hover:scale-105 active:scale-95"
            >
              <ShoppingBag size={16} />
              <span>₹{totalCartPrice}</span>
              {totalCartCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-lemon border border-cocoa text-cocoa text-[10px] font-black flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Swiggy-Level Restaurant / Station Banner */}
        <div className="card-pop bg-white border-[3px] border-cocoa rounded-3xl p-5 sm:p-7 shadow-pop-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl text-cocoa">
                  {selectedOutlet.name}
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-lemon border border-cocoa px-2.5 py-0.5 rounded-full">
                  {selectedOutlet.type === 'CLOUD_KITCHEN' ? 'Cloud Kitchen' : 'Flagship Dine-In'}
                </span>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                  ● Kitchen Active
                </span>
              </div>

              <p className="text-xs font-semibold text-cocoa-soft flex items-center gap-1.5">
                <MapPin size={13} className="text-cherry shrink-0" />
                <span>{selectedOutlet.address}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-cocoa">
                <span className="flex items-center gap-1 text-emerald-700 font-black">
                  <Star size={14} className="fill-emerald-600 text-emerald-600" /> 4.9 (18k+ ratings)
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-cocoa-fade" /> ~{selectedOutlet.minPrepTimeMinutes + 15} mins delivery
                </span>
                <span>&bull;</span>
                <span className="text-cherry font-black">
                  Delivery Radius: {selectedOutlet.deliveryRadiusKm} km
                </span>
                <span>&bull;</span>
                <span className="text-cocoa-fade font-mono text-[11px]">
                  FSSAI: {selectedOutlet.fssaiLicense}
                </span>
              </div>
            </div>

            {/* Direct Order Commission Benefit Badge */}
            <div className="bg-lemon/40 border-2 border-cocoa rounded-2xl p-3.5 text-center sm:text-right shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                Direct Kitchen Order
              </span>
              <p className="font-display text-sm text-cherry mt-0.5">
                Zero Swiggy / App Markups
              </p>
              <p className="text-[11px] font-bold text-cocoa mt-0.5">
                All prices include 5% GST
              </p>
            </div>
          </div>
        </div>

        {/* Elongated Professional Search Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={20} className="absolute left-5 top-4 text-cocoa-fade" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for authentic dum biryani, kebabs, haleem, double ka meetha, or chai..."
              className="w-full pl-13 pr-12 py-3.5 sm:py-4 text-sm sm:text-base font-bold rounded-full border-[3px] border-cocoa bg-white shadow-pop-sm outline-none focus:ring-4 focus:ring-lemon placeholder:text-cocoa-fade/75"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-cocoa-fade hover:text-cocoa p-1"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-black uppercase text-cocoa-fade mr-1">Popular:</span>
            {[
              { label: 'Chicken Dum', q: 'Chicken' },
              { label: 'Mutton Biryani', q: 'Mutton' },
              { label: 'Shahi Haleem', q: 'Haleem' },
              { label: 'Chicken 65', q: 'Chicken 65' },
              { label: 'Double Ka Meetha', q: 'Double' },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setSearchQuery(chip.q)}
                className="bg-white border border-cocoa/40 px-3 py-1 rounded-full text-xs font-bold text-cocoa hover:bg-lemon transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Swiggy Filter Bar: Veg Only toggle, Bestsellers, Categories */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y-2 border-dashed border-cocoa/25 py-3">
          
          {/* Category Tabs */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full border-2 border-cocoa px-4 py-1.5 text-xs font-black transition-all ${
                  activeCategory === cat
                    ? 'bg-cocoa text-lemon shadow-pop-sm'
                    : 'bg-white text-cocoa hover:bg-cream'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Veg Only & Bestseller Toggles */}
          <div className="flex items-center gap-3">
            {/* Veg Switch */}
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1 rounded-full border-2 border-cocoa shadow-sm">
              <span className="h-3.5 w-3.5 rounded border border-emerald-700 bg-white flex items-center justify-center p-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 block" />
              </span>
              <span className="text-xs font-black text-cocoa">Veg Only</span>
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-7 h-4 rounded-full transition-colors relative ${
                  vegOnly ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                    vegOnly ? 'translate-x-3.5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>

            {/* Bestseller Toggle */}
            <button
              type="button"
              onClick={() => setBestsellerOnly((prev) => !prev)}
              className={`px-3 py-1 rounded-full border-2 border-cocoa text-xs font-black flex items-center gap-1 transition-all ${
                bestsellerOnly
                  ? 'bg-lemon text-cocoa shadow-pop-sm'
                  : 'bg-white text-cocoa hover:bg-cream'
              }`}
            >
              <span>★ Bestsellers</span>
            </button>
          </div>

        </div>

        {/* Outlet Change Notification if Items Differ */}
        {selectedOutlet.id === 'out-kukatpally' && (
          <div className="bg-lemon/40 border-2 border-cocoa rounded-2xl p-3 text-xs font-bold text-cocoa flex items-center justify-between">
            <span>ℹ️ Kukatpally Express Station: Double Ka Meetha and Stone seared items sell out rapidly during evening rushes.</span>
          </div>
        )}

        {selectedOutlet.type === 'CLOUD_KITCHEN' && (
          <div className="bg-aqua/20 border-2 border-cocoa rounded-2xl p-3 text-xs font-bold text-cocoa flex items-center justify-between">
            <span>✨ Cloud Kitchen Exclusive: <strong>Express Biryani Box + Thums Up</strong> combo is available only at this location!</span>
          </div>
        )}

        {/* Swiggy-Level Menu Items List */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-cocoa border-b-2 border-cocoa pb-2 flex items-center justify-between">
            <span>
              {activeCategory === 'All' ? 'Full Hyderabadi Lineup' : activeCategory} ({filteredItems.length})
            </span>
            <span className="text-xs font-black text-cocoa-fade uppercase">
              Station: {selectedOutlet.area}
            </span>
          </h2>

          <div className="divide-y-2 divide-dashed divide-cocoa/20">
            {filteredItems.map((item) => {
              const inCartQty = getItemCartQty(item.id);
              const isAvailable = item.effectiveAvailable;

              return (
                <div
                  key={item.id}
                  className="py-6 flex flex-col-reverse sm:flex-row justify-between gap-6 items-start"
                >
                  
                  {/* Left Column: Details */}
                  <div className="flex-1 space-y-1.5 min-w-0 pr-4">
                    
                    {/* Veg/Non-Veg & Bestseller Badges */}
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded border-2 border-cocoa bg-white flex items-center justify-center p-0.5 shrink-0">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            item.dietary === 'VEG' ? 'bg-emerald-600' : 'bg-cherry'
                          }`}
                        />
                      </span>

                      {item.bestseller && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-cherry flex items-center gap-0.5">
                          <Sparkles size={11} /> Bestseller
                        </span>
                      )}

                      {item.badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-lemon border border-cocoa px-2 py-0.5 rounded-full text-cocoa">
                          {item.badge}
                        </span>
                      )}

                      {/* Outlet specific status label */}
                      {item.outletStatusLabel && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }`}>
                          {item.outletStatusLabel}
                        </span>
                      )}
                    </div>

                    {/* Dish Title */}
                    <h3 className="font-display text-xl sm:text-2xl text-cocoa leading-tight">
                      {item.name}
                    </h3>

                    {/* Price with 5% inclusive notice */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-lg sm:text-xl text-cherry">
                        ₹{item.effectivePrice}
                      </span>
                      <span className="text-[10px] font-bold text-cocoa-fade">
                        (5% GST Included)
                      </span>
                    </div>

                    {/* Rating */}
                    {item.rating && (
                      <p className="text-xs font-black text-emerald-800 flex items-center gap-1">
                        <Star size={13} className="fill-emerald-700 text-emerald-700" />
                        <span>{item.rating}</span>
                        <span className="text-cocoa-fade font-normal">({item.ratingCount || 100})</span>
                      </p>
                    )}

                    {/* Tagline & Description */}
                    <p className="text-xs font-semibold text-cocoa-soft max-w-xl leading-relaxed pt-1">
                      {item.description}
                    </p>

                    {/* Portions summary */}
                    <p className="text-[11px] font-bold text-cocoa-fade pt-1">
                      {item.portions.length > 1
                        ? `Customizable in ${item.portions.length} sizes (Regular, Family, Jumbo)`
                        : 'Single serving'}
                    </p>
                  </div>

                  {/* Right Column: High-Res Photo & Iconic Swiggy-Style ADD Button */}
                  <div className="relative shrink-0 mx-auto sm:mx-0 w-36 sm:w-40 flex flex-col items-center">
                    <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-3xl border-[3px] border-cocoa overflow-hidden shadow-pop-sm bg-cream">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className={`h-full w-full object-cover transition-transform duration-300 hover:scale-105 ${
                          !isAvailable ? 'grayscale opacity-60' : ''
                        }`}
                      />
                    </div>

                    {/* ADD Button overlapping at bottom */}
                    <div className="relative -mt-5 z-10">
                      {!isAvailable ? (
                        <span className="inline-block bg-white border-2 border-cocoa px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-red-600 shadow-pop-sm">
                          Out of Stock
                        </span>
                      ) : inCartQty > 0 ? (
                        <div className="flex items-center gap-2 bg-lemon border-2 border-cocoa px-2 py-1 rounded-2xl shadow-pop-sm">
                          <button
                            type="button"
                            onClick={() => {
                              const found = cartItems.find((c) => c.item.id === item.id);
                              if (found) onUpdateQty(found.id, found.quantity - 1);
                            }}
                            className="h-6 w-6 rounded-lg bg-white border border-cocoa flex items-center justify-center text-cocoa hover:bg-cream"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-black text-xs px-1 min-w-[16px] text-center">
                            {inCartQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddClick(item)}
                            className="h-6 w-6 rounded-lg bg-white border border-cocoa flex items-center justify-center text-cocoa hover:bg-cream"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddClick(item)}
                          className="pill-btn bg-white text-emerald-800 text-xs font-black !px-6 !py-2 border-2 border-cocoa shadow-pop-sm hover:bg-lemon hover:text-cocoa active:scale-95 transition-all uppercase tracking-wider"
                        >
                          ADD +
                        </button>
                      )}
                    </div>

                    {item.portions.length > 1 && isAvailable && (
                      <span className="text-[9px] font-bold text-cocoa-fade mt-1.5 block">
                        Customizable
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Floating Sticky Bottom Cart Bar (Swiggy Pattern) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 inset-x-0 z-40 px-4">
          <div className="max-w-2xl mx-auto card-pop bg-cherry text-white border-[3px] border-cocoa p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-lemon block">
                {totalCartCount} {totalCartCount === 1 ? 'Dish' : 'Dishes'} in Feast
              </span>
              <p className="font-display text-xl sm:text-2xl text-white leading-tight">
                Total: ₹{totalCartPrice}
              </p>
              <p className="text-[10px] text-cream/75">
                Dispatching from {selectedOutlet.name} &bull; 5% GST Included
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenCart}
                className="pill-btn bg-white text-cocoa text-xs !py-2.5 !px-4 hover:bg-cream"
              >
                View Cart
              </button>

              <button
                type="button"
                onClick={onNavigateToCheckout}
                className="pill-btn bg-lemon text-cocoa text-xs sm:text-sm !py-2.5 !px-5 flex items-center gap-1.5 shadow-pop-sm hover:bg-lemon-deep active:scale-95"
              >
                <span>Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customizer Modal */}
      {customizingItem && (
        <CustomizerModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAdd={(portion, addons) => {
            onAddToCart(customizingItem, portion, addons);
          }}
        />
      )}

      {/* Outlet Selection Modal */}
      {isOutletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="card-pop relative w-full max-w-xl bg-cream border-[4px] border-cocoa rounded-3xl shadow-pop-lg max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                  17 Hyderabad Locations
                </span>
                <h3 className="font-display text-xl text-cherry outline-text [text-stroke-width:0.5px]">
                  Select Station Kitchen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOutletModalOpen(false)}
                className="h-9 w-9 rounded-full bg-white border-2 border-cocoa flex items-center justify-center shadow-pop-sm hover:bg-cream"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 max-h-[50vh]">
              {OUTLETS.map((outlet) => {
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
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
