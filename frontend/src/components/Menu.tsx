import { useState } from 'react';
import { ShoppingBag, Flame, X, Plus, Check, Search, UtensilsCrossed } from 'lucide-react';
import {
  type MenuItem,
  type Category,
  CATEGORIES,
  type PortionOption,
  type AddonOption,
} from '../data';

function PriceBadge({ price }: { price: number }) {
  return (
    <div className="absolute -right-3 -top-3 z-10 flex h-16 w-16 rotate-12 items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[2px_2px_0_#3A2318]">
        {Array.from({ length: 14 }).map((_, i) => (
          <polygon
            key={i}
            points="50,2 55,36 50,44 45,36"
            fill="#FFD93D"
            stroke="#3A2318"
            strokeWidth="2"
            transform={`rotate(${i * (360 / 14)} 50 50)`}
          />
        ))}
      </svg>
      <span className="relative font-display text-sm text-cherry">₹{price}</span>
    </div>
  );
}

interface ItemCustomizerModalProps {
  item: MenuItem;
  onClose: () => void;
  onAdd: (item: MenuItem, portion: PortionOption, addons: AddonOption[]) => void;
}

function ItemCustomizerModal({ item, onClose, onAdd }: ItemCustomizerModalProps) {
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

  const handleConfirm = () => {
    onAdd(item, selectedPortion, selectedAddons);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="card-pop relative w-full max-w-lg bg-cream border-[4px] border-cocoa shadow-pop-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b-[3px] border-cocoa bg-lemon flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full border border-cocoa ${
                item.dietary === 'VEG' ? 'bg-emerald-600' : 'bg-cherry'
              }`}
            />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">
                Select Size &amp; Add-ons
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-cocoa">
          {/* Portion Selection */}
          <div>
            <h4 className="font-display text-base text-cherry mb-2">1. Choose Portion Size</h4>
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

          {/* Add-on Options */}
          {item.addons.length > 0 && (
            <div>
              <h4 className="font-display text-base text-cherry mb-2">2. Extra Add-ons &amp; Sides</h4>
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

        {/* Footer Button */}
        <div className="p-5 border-t-[3px] border-cocoa bg-white flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade block">Item Total</span>
            <span className="font-display text-2xl text-cherry">₹{calculatedUnitPrice}</span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="pill-btn bg-cherry text-white text-sm !px-6 !py-3 flex items-center gap-2 shadow-pop-sm hover:scale-105"
          >
            <ShoppingBag size={18} />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, portion: PortionOption, addons: AddonOption[]) => void;
}

function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleCardAdd = () => {
    if (item.portions.length > 1 || item.addons.length > 0) {
      setIsCustomizing(true);
    } else {
      onAddToCart(item, item.portions[0], []);
    }
  };

  return (
    <>
      <article className="card-pop relative flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-pop-lg transition-transform bg-white overflow-hidden rounded-3xl h-full">
        <PriceBadge price={item.price} />
        
        <div>
          <div className="relative overflow-hidden">
            <img
              src={item.photo}
              alt={item.name}
              loading="lazy"
              className="h-56 w-full border-b-[3px] border-cocoa object-cover"
            />

            {item.badge && (
              <span className="absolute left-3 top-3 -rotate-3 rounded-full border-2 border-cocoa bg-lemon px-3 py-1 text-[11px] font-black uppercase tracking-wider text-cocoa shadow-pop-sm">
                {item.badge}
              </span>
            )}

            {/* FSSAI Veg / Non-Veg Indicator */}
            <div className="absolute right-3 bottom-3 rounded-md bg-white border-2 border-cocoa p-1 shadow-pop-sm flex items-center justify-center">
              <span
                className={`h-3 w-3 rounded-full ${
                  item.dietary === 'VEG' ? 'bg-emerald-600' : 'bg-cherry'
                }`}
                title={item.dietary === 'VEG' ? 'Pure Veg' : 'Non-Veg'}
              />
            </div>
          </div>

          <div className="p-5 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-cocoa-fade bg-cream border border-cocoa/30 px-2 py-0.5 rounded-full">
                {item.category}
              </span>
              <span className="text-[10px] font-extrabold text-cherry flex items-center gap-0.5">
                <Flame size={12} /> {item.spiceLevel}
              </span>
            </div>

            <h3 className="font-display text-xl text-cocoa leading-tight">{item.name}</h3>
            <p className="mt-1 text-xs font-bold text-cocoa-fade italic leading-snug">{item.tagline}</p>
            <p className="mt-2 text-xs font-semibold text-cocoa-soft line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        <div className="p-5 pt-0">
          <div className="pt-3 border-t-2 border-dashed border-cocoa/20 flex items-center justify-between">
            <span className="text-[11px] font-bold text-cocoa-fade">
              {item.portions.length > 1 ? `${item.portions.length} sizes available` : 'Single portion'}
            </span>

            <button
              type="button"
              onClick={handleCardAdd}
              className="pill-btn bg-lemon text-cocoa text-xs !px-4 !py-2 flex items-center gap-1.5 shadow-pop-sm hover:bg-lemon-deep active:scale-95"
            >
              <Plus size={14} strokeWidth={3} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </article>

      {isCustomizing && (
        <ItemCustomizerModal
          item={item}
          onClose={() => setIsCustomizing(false)}
          onAdd={onAddToCart}
        />
      )}
    </>
  );
}

interface MenuProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, portion: PortionOption, addons: AddonOption[]) => void;
}

export default function Menu({ items, onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const clean = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !clean ||
      item.name.toLowerCase().includes(clean) ||
      item.ingredients.some((ing) => ing.toLowerCase().includes(clean)) ||
      item.category.toLowerCase().includes(clean) ||
      item.description.toLowerCase().includes(clean);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="relative bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center">
          <span className="inline-block -rotate-1 rounded-full border-[3px] border-cocoa bg-tangerine px-4 py-1 text-xs font-black uppercase tracking-[0.25em] shadow-pop-sm">
            Fresh Dum Lineup
          </span>
          <h2 className="mt-4 font-display text-4xl text-cherry outline-text sm:text-5xl lg:text-6xl">
            Royal Hyderabadi Menu
          </h2>
          <p className="mx-auto mt-2 max-w-lg font-bold text-cocoa-soft text-sm sm:text-base">
            All prices are inclusive of 5% GST. Authentic handi-cooked delicacies prepared upon order.
          </p>
        </div>

        {/* Search Bar Right in the Menu Section */}
        <div className="mt-8 max-w-md mx-auto px-2">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-cocoa-fade" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search biryani, kebabs, haleem, double ka meetha..."
              className="w-full pl-11 pr-10 py-3 text-sm font-bold rounded-full border-[3px] border-cocoa bg-white shadow-pop-sm outline-none focus:ring-4 focus:ring-lemon placeholder:text-cocoa-fade/80"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-cocoa-fade hover:text-cocoa p-0.5"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="no-scrollbar mt-6 flex gap-2.5 overflow-x-auto pb-2 sm:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`shrink-0 rounded-full border-[3px] border-cocoa px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-cocoa text-lemon shadow-pop-sm'
                  : 'bg-white text-cocoa hover:bg-lemon'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Search Status Pill */}
        {searchQuery && (
          <div className="text-center mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa bg-lemon/50 border border-cocoa px-3 py-1 rounded-full">
              Showing dishes matching <strong className="text-cherry">"{searchQuery}"</strong> ({filtered.length} found)
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-1 text-cherry hover:underline text-[11px]"
              >
                Clear
              </button>
            </span>
          </div>
        )}

        {/* Menu Cards Grid */}
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white border-2 border-dashed border-cocoa/30 rounded-3xl p-8 space-y-3">
              <UtensilsCrossed className="w-12 h-12 text-cocoa/40 mx-auto" />
              <h3 className="font-display text-2xl text-cocoa">No dishes match "{searchQuery}"</h3>
              <p className="text-xs font-bold text-cocoa-fade max-w-sm mx-auto">
                Try searching for another dish like "Chicken Biryani", "Haleem", or choose the "All" category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="pill-btn bg-lemon text-cocoa text-xs !py-2.5 !px-5 mt-2 shadow-pop-sm"
              >
                Reset Search &amp; Show All Dishes
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
            ))
          )}
        </div>

      </div>
    </section>
  );
}
