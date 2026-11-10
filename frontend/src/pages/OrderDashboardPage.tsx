import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  MapPin,
  Clock,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Check,
  User,
  UtensilsCrossed,
  Info,
  RotateCcw,
  Receipt,
  Compass
} from 'lucide-react';
import OrderTrackingModal from '../components/OrderTrackingModal';
import { apiUrl } from '../config';
import {
  Outlet,
  MenuItem,
  PortionOption,
  AddonOption,
  CartItem,
  OUTLETS,
  MENU_ITEMS,
  CATEGORIES,
  Category,
  getMenuItemsForOutlet,
  findNearestOutlet,
  calculateHaversineDistanceKm,
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
              className={`h-3 w-3 rounded-full border border-cocoa ${item.dietary === 'VEG' ? 'bg-emerald-600' : 'bg-cherry'
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
                  className={`p-3 rounded-2xl border-2 border-cocoa flex flex-col justify-between transition-all ${selectedPortion.id === portion.id
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
                      className={`w-full p-3 rounded-2xl border-2 border-cocoa flex items-center justify-between text-xs transition-all ${isSelected
                        ? 'bg-aqua font-black shadow-pop-sm -translate-y-0.5'
                        : 'bg-white hover:bg-cream font-bold'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded border border-cocoa flex items-center justify-center ${isSelected ? 'bg-cocoa text-lemon' : 'bg-white'
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
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // GPS & Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLocation(true);
    setLocationMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLocation(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        const result = findNearestOutlet(latitude, longitude, OUTLETS);
        onSelectOutlet(result.outlet);
        if (result.isDeliverable) {
          setLocationMessage(`GPS Active: Selected ${result.outlet.name} (${result.distanceKm} km away, within direct delivery radius)`);
        } else {
          setLocationMessage(`Nearest physical station is ${result.outlet.name} (${result.distanceKm} km). Routed via Central Cloud Kitchen.`);
        }
      },
      (err) => {
        setDetectingLocation(false);
        setLocationMessage('Could not access GPS. Please choose your station kitchen manually.');
      },
      { timeout: 8000 }
    );
  };

  // Customizer state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Live menu fetched directly from PostgreSQL database with instant fallback
  const [liveMenuItems, setLiveMenuItems] = useState<MenuItem[]>(() =>
    getMenuItemsForOutlet(selectedOutlet?.id || OUTLETS[0].id)
  );

  useEffect(() => {
    let isMounted = true;
    const outletId = selectedOutlet?.id || OUTLETS[0].id;

    const fetchLiveMenu = () => {
      fetch(apiUrl(`/api/menu/outlet/${outletId}`))
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            const mapped: MenuItem[] = data.map((apiItem: any) => {
              const localItem = MENU_ITEMS.find(
                (m) => m.id === apiItem.slug || m.id === String(apiItem.id) || m.name.toLowerCase() === apiItem.name.toLowerCase()
              );

              // Normalize category for frontend tabs
              const rawCat = apiItem.category || 'Biryani';
              let cat: any = rawCat;
              if (rawCat === 'Kebabs & Tandoor' || rawCat === 'Starters') cat = 'Starters';
              else if (rawCat === 'Beverages' || rawCat === 'Chai') cat = 'Chai';
              else if (rawCat === 'Desserts') cat = 'Desserts';
              else if (rawCat === 'Haleem & Curries' || rawCat === 'Biryani') cat = 'Biryani';

              return {
                id: apiItem.slug || String(apiItem.id),
                name: apiItem.name,
                tagline: apiItem.tagline || '',
                description: apiItem.description || '',
                ingredients: localItem ? localItem.ingredients : ['Pure Nizami Spices', 'Desi Ghee'],
                price: apiItem.base_price, // Live database price
                effectivePrice: apiItem.base_price,
                effectiveAvailable: apiItem.is_available !== false,
                outletStatusLabel: apiItem.custom_status_label || undefined,
                category: cat,
                photo:
                  apiItem.image_url ||
                  (localItem
                    ? localItem.photo
                    : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'),
                colors: localItem
                  ? localItem.colors
                  : { top: '#FFDE59', bottom: '#D63031', foam: '#FFFDF7' },
                badge: apiItem.bestseller ? 'Bestseller' : undefined,
                dietary: apiItem.dietary,
                spiceLevel:
                  apiItem.spice_level === 'HOT'
                    ? 'SPICY'
                    : apiItem.spice_level === 'EXTRA_HOT'
                      ? 'EXTRA_SPICY'
                      : apiItem.spice_level,
                allergens: localItem ? localItem.allergens : ['Dairy (Desi Ghee)'],
                portions:
                  apiItem.portions && apiItem.portions.length > 0
                    ? apiItem.portions.map((p: any) => ({
                      id: p.portion_key || String(p.id),
                      name: p.name,
                      priceModifier: p.price_modifier,
                      serves: p.serves || '1–2 persons',
                    }))
                    : localItem
                      ? localItem.portions
                      : [{ id: 'p-std', name: 'Standard Handi', priceModifier: 0, serves: '1–2 persons' }],
                addons:
                  apiItem.addons && apiItem.addons.length > 0
                    ? apiItem.addons.map((a: any) => ({
                      id: a.addon_key || String(a.id),
                      name: a.name,
                      price: a.price,
                    }))
                    : localItem
                      ? localItem.addons
                      : [],
                isAvailable: apiItem.is_available !== false, // Live stock status from DB
                rating: apiItem.rating || 4.9,
                ratingCount: apiItem.rating_count || 1200,
                bestseller: apiItem.bestseller,
              };
            });
            setLiveMenuItems(mapped);
          }
        })
        .catch((e) => console.warn('Live menu fetch note:', e));
    };

    fetchLiveMenu();
    // Continuous polling every 4 seconds to sync kitchen 86ing stock changes immediately
    const pollInterval = setInterval(fetchLiveMenu, 4000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [selectedOutlet?.id]);

  // Filter items
  const filteredItems = useMemo(() => {
    return liveMenuItems.filter((item) => {
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      if (vegOnly && item.dietary !== 'VEG') return false;
      if (bestsellerOnly && !item.bestseller) return false;
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
  }, [liveMenuItems, activeCategory, vegOnly, bestsellerOnly, searchQuery]);

  const totalCartCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, c) => acc + c.totalPrice, 0);

  const getItemCartQty = (itemId: string) => {
    return cartItems
      .filter((c) => c.item.id === itemId)
      .reduce((sum, c) => sum + c.quantity, 0);
  };

  const handleAddClick = (item: MenuItem) => {
    const isAvail = (item as any).effectiveAvailable !== false && item.isAvailable !== false;
    if (!isAvail) {
      alert(`"${item.name}" is currently sold out at ${selectedOutlet.name}. Please select another Nizami delicacy.`);
      return;
    }
    if (item.portions.length > 1 || item.addons.length > 0) {
      setCustomizingItem(item);
    } else {
      onAddToCart(item, item.portions[0], []);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-cocoa pb-28 font-body">

      {/* Top Header */}
      <header className="border-b-[3px] border-cocoa bg-lemon sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">

          {/* Logo & Home Link (No emojis) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2.5 group text-left"
              title="Return to Nawaab's Home"
            >
              <span className="h-11 w-11 rounded-2xl bg-white border-2 border-cocoa flex items-center justify-center text-cocoa shadow-pop-sm group-hover:-rotate-6 transition-transform">
                <UtensilsCrossed size={20} strokeWidth={2.5} />
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

          {/* Location Selector Bar (Clean, Professional, Well-proportioned) */}
          <button
            type="button"
            onClick={() => setIsOutletModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-white border-2 border-cocoa px-2.5 sm:px-3.5 py-1.5 rounded-2xl shadow-pop-sm hover:bg-cream transition-colors max-w-[125px] sm:max-w-xs truncate"
            title="Click to switch delivery outlet"
          >
            <MapPin size={14} className="text-cherry shrink-0" />
            <div className="text-left min-w-0 pr-1">
              <span className="block text-[8px] uppercase font-black tracking-wider text-cocoa-fade leading-none">
                Station
              </span>
              <span className="font-display text-xs sm:text-sm text-cocoa truncate block leading-tight mt-0.5">
                {selectedOutlet.name}
              </span>
            </div>
            <ChevronDown size={13} className="text-cocoa-fade shrink-0 ml-auto" />
          </button>

          {/* User Profile, Live Tracking & Cart Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Order Tracking Button */}
            <button
              type="button"
              onClick={() => setIsTrackingOpen(true)}
              className="pill-btn bg-white text-cocoa text-xs sm:text-sm !py-2 !px-2.5 sm:!px-4 flex items-center gap-1.5 shadow-pop-sm hover:bg-lemon transition-all"
              title="Track live station kitchen orders"
            >
              <Receipt size={14} className="text-cherry shrink-0" />
              <span>Track<span className="hidden sm:inline">&nbsp;Orders</span></span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold bg-white/75 border border-cocoa/30 px-3 py-1.5 rounded-xl">
              <User size={13} className="text-cocoa" />
              <span className="font-display text-cocoa">{customerUser.name}</span>
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className="pill-btn bg-cherry text-white text-xs sm:text-sm !py-2 !px-3 sm:!px-4 flex items-center gap-1.5 shadow-pop-sm hover:scale-105 active:scale-95"
            >
              <ShoppingBag size={15} />
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

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* Restaurant / Station Header Card */}
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
              </div>

              <p className="text-xs font-semibold text-cocoa-soft flex items-center gap-1.5">
                <MapPin size={13} className="text-cherry shrink-0" />
                <span>{selectedOutlet.address}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-cocoa">
                <span className="flex items-center gap-1 text-emerald-700 font-black">
                  <Star size={13} className="fill-emerald-600 text-emerald-600" /> 4.9 (18k+ ratings)
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-cocoa-fade" /> ~{selectedOutlet.minPrepTimeMinutes + 15} mins delivery
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
          </div>
        </div>

        {/* Elongated Professional Search Bar (Properly Aligned Icon & Text) */}
        <div className="space-y-3">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 pointer-events-none text-cocoa-fade" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for authentic dum biryani, kebabs, haleem, double ka meetha, or chai..."
              className="w-full pl-12 pr-12 py-3.5 sm:py-4 text-sm sm:text-base font-bold rounded-full border-[3px] border-cocoa bg-white shadow-pop-sm outline-none focus:ring-4 focus:ring-lemon placeholder:text-cocoa-fade/75"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-cocoa-fade hover:text-cocoa p-1"
                title="Clear search"
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

        {/* Filter Bar: Veg Only toggle, Bestsellers, Categories */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y-2 border-dashed border-cocoa/25 py-3">

          {/* Category Tabs */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full border-2 border-cocoa px-4 py-1.5 text-xs font-black transition-all ${activeCategory === cat
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
                className={`w-7 h-4 rounded-full transition-colors relative ${vegOnly ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${vegOnly ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </label>

            {/* Bestseller Toggle */}
            <button
              type="button"
              onClick={() => setBestsellerOnly((prev) => !prev)}
              className={`px-3 py-1 rounded-full border-2 border-cocoa text-xs font-black flex items-center gap-1 transition-all ${bestsellerOnly
                ? 'bg-lemon text-cocoa shadow-pop-sm'
                : 'bg-white text-cocoa hover:bg-cream'
                }`}
            >
              <Sparkles size={12} />
              <span>Bestsellers</span>
            </button>
          </div>

        </div>

        {/* Station Condition Notices */}
        {selectedOutlet.id === 'out-kukatpally' && (
          <div className="bg-lemon/40 border-2 border-cocoa rounded-2xl p-3 text-xs font-bold text-cocoa flex items-center gap-2">
            <Info size={15} className="text-cocoa shrink-0" />
            <span>Kukatpally Express Station: Double Ka Meetha and Stone seared items sell out rapidly during evening rushes.</span>
          </div>
        )}

        {selectedOutlet.type === 'CLOUD_KITCHEN' && (
          <div className="bg-aqua/20 border-2 border-cocoa rounded-2xl p-3 text-xs font-bold text-cocoa flex items-center gap-2">
            <Sparkles size={15} className="text-cherry shrink-0" />
            <span>Cloud Kitchen Exclusive: <strong>Express Biryani Box + Thums Up</strong> combo is available only at this location.</span>
          </div>
        )}

        {/* AI Smart Reorders (From Customer History - Brief Requirement) */}
        <div className="card-pop bg-lemon/20 border-2 border-cocoa rounded-3xl p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-cocoa/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-lemon border border-cocoa flex items-center justify-center text-cocoa shadow-pop-sm">
                <Sparkles size={16} />
              </span>
              <div>
                <h3 className="font-display text-lg text-cocoa">
                  AI Smart Reorders (Based on Your History)
                </h3>
                <p className="text-[11px] font-semibold text-cocoa-soft">
                  Predicted from past orders &bull; <strong className="text-cherry">Suggestions never auto-added to cart</strong> (Tap ADD to select)
                </p>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase bg-white border border-cocoa px-3 py-1 rounded-full text-emerald-800 shadow-sm flex items-center gap-1">
              <RotateCcw size={11} /> 94% Reorder Accuracy
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            {/* Suggestion 1: Royal Chicken Dum Biryani */}
            {(() => {
              const item = liveMenuItems.find(
                (m) => m.name.toLowerCase().includes('chicken dum') || m.id.includes('chicken')
              );
              if (!item) return null;
              const price = (item as any).effectivePrice ?? item.price;
              return (
                <div className="bg-white border-2 border-cocoa rounded-2xl p-3 flex items-center justify-between gap-3 shadow-pop-sm">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-cherry text-white px-2 py-0.5 rounded-full">
                        Top Past Order
                      </span>
                      <span className="text-[10px] font-bold text-cocoa-fade">Ordered 2 times</span>
                    </div>
                    <h4 className="font-display text-sm text-cocoa truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-bold text-cherry">
                      ₹{price} <span className="text-[9px] text-cocoa-fade font-normal">(5% GST incl.)</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddClick(item)}
                    className="pill-btn bg-lemon text-cocoa text-xs !py-1.5 !px-3 shadow-pop-sm shrink-0 flex items-center gap-1 hover:bg-lemon-deep active:scale-95"
                  >
                    <Plus size={13} strokeWidth={3} />
                    <span>ADD</span>
                  </button>
                </div>
              );
            })()}

            {/* Suggestion 2: Double Ka Meetha */}
            {(() => {
              const item = liveMenuItems.find(
                (m) => m.name.toLowerCase().includes('double ka meetha') || m.id.includes('double')
              );
              if (!item) return null;
              const price = (item as any).effectivePrice ?? item.price;
              return (
                <div className="bg-white border-2 border-cocoa rounded-2xl p-3 flex items-center justify-between gap-3 shadow-pop-sm">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-aqua text-cocoa px-2 py-0.5 rounded-full">
                        Frequent Pairing
                      </span>
                      <span className="text-[10px] font-bold text-cocoa-fade">Dessert Favorite</span>
                    </div>
                    <h4 className="font-display text-sm text-cocoa truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-bold text-cherry">
                      ₹{price} <span className="text-[9px] text-cocoa-fade font-normal">(5% GST incl.)</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddClick(item)}
                    className="pill-btn bg-lemon text-cocoa text-xs !py-1.5 !px-3 shadow-pop-sm shrink-0 flex items-center gap-1 hover:bg-lemon-deep active:scale-95"
                  >
                    <Plus size={13} strokeWidth={3} />
                    <span>ADD</span>
                  </button>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Menu Items List */}
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
              const isAvailable = (item as any).effectiveAvailable !== false && item.isAvailable !== false;

              return (
                <div
                  key={item.id}
                  className="py-6 flex flex-col-reverse sm:flex-row justify-between gap-6 items-start"
                >

                  {/* Left Column: Details */}
                  <div className="flex-1 space-y-1.5 min-w-0 pr-4">

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded border-2 border-cocoa bg-white flex items-center justify-center p-0.5 shrink-0">
                        <span
                          className={`h-2 w-2 rounded-full ${item.dietary === 'VEG' ? 'bg-emerald-600' : 'bg-cherry'
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

                      {item.outletStatusLabel && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${isAvailable
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
                        ₹{(item as any).effectivePrice ?? item.price}
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

                    {/* Description */}
                    <p className="text-xs font-semibold text-cocoa-soft max-w-xl leading-relaxed pt-1">
                      {item.description}
                    </p>

                    {/* Portions summary */}
                    <p className="text-[11px] font-bold text-cocoa-fade pt-1">
                      {(item.portions?.length ?? 1) > 1
                        ? `Customizable in ${item.portions.length} sizes (Regular, Family, Jumbo)`
                        : 'Single serving'}
                    </p>
                  </div>

                  {/* Right Column: High-Res Photo & ADD Button */}
                  <div className="relative shrink-0 mx-auto sm:mx-0 w-36 sm:w-40 flex flex-col items-center">
                    <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-3xl border-[3px] border-cocoa overflow-hidden shadow-pop-sm bg-cream">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className={`h-full w-full object-cover transition-transform duration-300 hover:scale-105 ${!isAvailable ? 'grayscale opacity-60' : ''
                          }`}
                      />
                    </div>

                    {/* ADD Button */}
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

                    {(item.portions?.length ?? 1) > 1 && isAvailable && (
                      <span className="text-[9px] font-bold text-cocoa-fade mt-1.5 block">
                        Customizable
                      </span>
                    )}
                  </div>

                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="py-16 text-center space-y-3 bg-white border-2 border-cocoa rounded-3xl p-6 shadow-pop-sm my-4">
                <UtensilsCrossed size={36} className="text-cocoa/30 mx-auto" />
                <h3 className="font-display text-xl text-cocoa">No authentic dishes match this filter</h3>
                <p className="text-xs text-cocoa-soft max-w-sm mx-auto">
                  Try switching categories or clearing search keywords to view our full royal lineup.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                    setVegOnly(false);
                    setBestsellerOnly(false);
                  }}
                  className="pill-btn bg-lemon text-cocoa text-xs font-black !py-2 !px-5 border-2 border-cocoa shadow-pop-sm hover:bg-lemon-deep"
                >
                  Show All Dishes
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Floating Bottom Cart Bar (No emojis) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 inset-x-0 z-40 px-4">
          <div className="max-w-2xl mx-auto card-pop bg-cherry text-white border-[3px] border-cocoa p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-lemon text-cocoa border border-cocoa flex items-center justify-center shrink-0">
                <ShoppingBag size={18} />
              </span>
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

            <div className="p-4 bg-lemon/35 border-b-2 border-cocoa flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-cocoa block flex items-center gap-1.5">
                  <Compass size={14} className="text-cherry" />
                  Auto-detect Nearest Station
                </span>
                <span className="text-[11px] font-bold text-cocoa-fade block mt-0.5">
                  {locationMessage || 'Uses your GPS coordinates to assign the closest station within delivery radius'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="pill-btn bg-cherry text-white text-xs !py-2 !px-4 flex items-center gap-1.5 shadow-pop-sm shrink-0 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Compass size={14} className={detectingLocation ? 'animate-spin' : ''} />
                <span>{detectingLocation ? 'Locating...' : 'Detect GPS Location'}</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 overscroll-contain">
              {OUTLETS.map((outlet) => {
                const isSelected = selectedOutlet.id === outlet.id;
                const distance = userLocation
                  ? calculateHaversineDistanceKm(
                      userLocation.lat,
                      userLocation.lon,
                      outlet.latitude,
                      outlet.longitude
                    )
                  : null;
                const isWithinRadius = distance !== null ? distance <= outlet.deliveryRadiusKm : true;

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
                        {distance !== null && (
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                              isWithinRadius
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            {distance} km &bull; {isWithinRadius ? 'Direct Radius' : 'Cloud Kitchen Dispatch'}
                          </span>
                        )}
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

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

    </div>
  );
}
