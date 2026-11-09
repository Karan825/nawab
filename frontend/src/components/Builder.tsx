import { useMemo, useState } from 'react';
import { Check, Flame, RotateCcw, Sparkles, ShoppingBag } from 'lucide-react';
import { MenuItem, PortionOption, AddonOption } from '../data';

interface Option {
  id: string;
  label: string;
  tag: string;
  price: number;
  color: string;
}

const BASES: Option[] = [
  { id: 'b-chk', label: 'Tender Farm Chicken', tag: 'Kachhi Marinated', price: 380, color: '#FFC96B' },
  { id: 'b-mut', label: 'Royal Nizami Mutton', tag: 'Slow Dum 4-Hrs', price: 490, color: '#D9534F' },
  { id: 'b-veg', label: 'Subz Malai Paneer', tag: 'Fresh Farm & Ghee', price: 290, color: '#5CB85C' },
  { id: 'b-egg', label: 'Spiced Farm Egg Dum', tag: 'Roasted Brown Onions', price: 260, color: '#F0AD4E' },
];

const SIZES: { id: string; label: string; price: number; serves: string }[] = [
  { id: 's', label: 'Regular Handi', price: 0, serves: 'Serves 1 person' },
  { id: 'm', label: 'Family Pack Handi', price: 420, serves: 'Serves 3–4 persons' },
  { id: 'l', label: 'Jumbo Royal Handi', price: 850, serves: 'Serves 6–8 persons' },
];

const GHEE_LAYERS: Option[] = [
  { id: 'g-asli', label: 'Pure Buffalo Desi Ghee Tadka', tag: '+ Aroma', price: 40, color: '#FFE066' },
  { id: 'g-masala', label: 'Extra Saffron Masala Layer', tag: '+ Spicy', price: 50, color: '#E85D04' },
  { id: 'g-onion', label: 'Double Crispy Brown Onions (Birista)', tag: '+ Sweet Crunch', price: 35, color: '#6A040F' },
];

const TOPPINGS: Option[] = [
  { id: 't-salan', label: 'Extra Mirchi Ka Salan', tag: 'Peanut-Sesame Gravy', price: 60, color: '#D00000' },
  { id: 't-raita', label: 'Double Burani Garlic Raita', tag: 'Thick Curd', price: 40, color: '#FFFFFF' },
  { id: 't-eggs', label: 'Boiled Eggs (2 pcs)', tag: 'Golden Fried', price: 40, color: '#FFD166' },
  { id: 't-cashew', label: 'Roasted Cashews & Pistachios', tag: 'Royal Garnish', price: 50, color: '#E9D8A6' },
];

function HandiPreview({
  base,
  size,
  gheeLayers,
  toppings,
}: {
  base: Option;
  size: string;
  gheeLayers: string[];
  toppings: string[];
}) {
  const scale = size === 's' ? 0.85 : size === 'l' ? 1.15 : 1;

  return (
    <div className="flex flex-col items-center justify-center p-6 select-none" style={{ transform: `scale(${scale})` }}>
      <div className="relative flex flex-col items-center">
        
        {/* Steam Animation */}
        <div className="absolute -top-12 flex gap-3 opacity-75">
          <span className="h-8 w-2 rounded-full bg-white/60 animate-rise" />
          <span className="h-10 w-2.5 rounded-full bg-lemon/60 animate-rise [animation-delay:0.5s]" />
          <span className="h-7 w-2 rounded-full bg-white/60 animate-rise [animation-delay:1s]" />
        </div>

        {/* Handi Lid & Atta Seal */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Lid Knob */}
          <div className="h-5 w-6 rounded-t-full border-[3px] border-cocoa bg-lemon shadow-pop-sm" />
          {/* Lid Dome */}
          <div className="h-8 w-44 rounded-t-full border-[3px] border-b-0 border-cocoa bg-tangerine shadow-pop-sm flex items-center justify-center">
            <span className="text-[10px] font-black uppercase text-cocoa tracking-widest">Atta Dum Seal</span>
          </div>
          {/* Dough Rim */}
          <div className="h-3 w-48 rounded-full border-2 border-cocoa bg-cream-dark -mt-1" />
        </div>

        {/* Earthen Clay Handi Pot */}
        <div
          className="relative z-10 w-56 rounded-b-[60px] border-[4px] border-cocoa p-4 shadow-pop-lg flex flex-col items-center overflow-hidden transition-colors duration-300"
          style={{
            height: '180px',
            backgroundColor: '#3A2318',
            backgroundImage: 'radial-gradient(circle at 50% 30%, #5C3A28, #3A2318)',
          }}
        >
          {/* Saffron Basmati Layer */}
          <div
            className="w-full rounded-t-2xl border-2 border-cocoa p-2 text-center transition-colors"
            style={{ backgroundColor: base.color }}
          >
            <p className="font-display text-xs text-cocoa leading-none">{base.label}</p>
          </div>

          {/* Ghee and Masala Layer */}
          {gheeLayers.length > 0 && (
            <div className="mt-1 w-full flex justify-center gap-1.5 py-1">
              {gheeLayers.map((g, i) => (
                <span
                  key={i}
                  className="h-3 w-8 rounded-full border border-cocoa bg-lemon animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Handi Emblem */}
          <div className="mt-auto mb-2 text-center">
            <span className="font-display text-sm text-lemon outline-text [text-stroke-width:0.5px]">
              Nawaab's Handi
            </span>
            <p className="text-[9px] font-bold text-cream/70">Kachhi Dum Sealed</p>
          </div>

          {/* Topping tags inside pot */}
          {toppings.length > 0 && (
            <div className="absolute bottom-1 flex gap-1">
              {toppings.map((t, idx) => (
                <span key={idx} className="h-2 w-2 rounded-full border border-cocoa bg-cherry" />
              ))}
            </div>
          )}
        </div>

        {/* Serving Stand */}
        <div className="relative -mt-2 h-4 w-36 rounded-full border-[3px] border-cocoa bg-lemon shadow-pop-sm" />

      </div>
    </div>
  );
}

interface BuilderProps {
  onAddToCart: (customItem: MenuItem) => void;
}

export default function Builder({ onAddToCart }: BuilderProps) {
  const [base, setBase] = useState<Option>(BASES[0]);
  const [size, setSize] = useState<'s' | 'm' | 'l'>('m');
  const [gheeLayers, setGheeLayers] = useState<string[]>([GHEE_LAYERS[0].id]);
  const [toppings, setToppings] = useState<string[]>([TOPPINGS[0].id, TOPPINGS[1].id]);

  const toggleGhee = (id: string) => {
    setGheeLayers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleTopping = (id: string) => {
    setToppings((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const currentSizeObj = SIZES.find((s) => s.id === size) || SIZES[1];
  const gheeCost = gheeLayers.reduce(
    (sum, id) => sum + (GHEE_LAYERS.find((g) => g.id === id)?.price || 0),
    0
  );
  const toppingCost = toppings.reduce(
    (sum, id) => sum + (TOPPINGS.find((t) => t.id === id)?.price || 0),
    0
  );

  const totalPrice = base.price + currentSizeObj.price + gheeCost + toppingCost;
  const gstInclusive = Math.round(((totalPrice * 5) / 105) * 100) / 100;

  const handleAddCustomHandi = () => {
    const customItem: MenuItem = {
      id: `custom-handi-${Date.now()}`,
      name: `Custom Handi (${base.label})`,
      tagline: `${currentSizeObj.label} · Sealed with Atta Dum`,
      description: `Custom handcrafted handi with ${base.label}, ${currentSizeObj.label}, and ${
        toppings.length + gheeLayers.length
      } special royal accompaniments.`,
      ingredients: [base.label, currentSizeObj.label, 'Pure Desi Ghee', 'Saffron Rice'],
      price: totalPrice,
      category: 'Biryani',
      photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
      colors: { top: '#FFC96B', bottom: '#D96E14', foam: '#FFF4E2' },
      dietary: base.id === 'b-veg' ? 'VEG' : 'NON_VEG',
      spiceLevel: 'MEDIUM',
      allergens: ['Dairy (Ghee)'],
      portions: [{ id: currentSizeObj.id, name: currentSizeObj.label, priceModifier: 0, serves: currentSizeObj.serves }],
      addons: [],
    };

    onAddToCart(customItem);
  };

  return (
    <section id="builder" className="relative bg-cream-dark py-16 sm:py-24 border-b-[3px] border-cocoa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center">
          <span className="inline-block -rotate-1 rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1 text-xs font-extrabold uppercase tracking-[0.25em] shadow-pop-sm">
            Dum Craft Station
          </span>
          <h2 className="mt-4 font-display text-4xl text-cherry outline-text sm:text-5xl">
            Craft Your Royal Handi
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-semibold text-cocoa-soft">
            Choose your dum marinated cut, handi size, ghee aroma, and shahi salan accompaniments.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-12">
          
          {/* Left: Interactive Preview Frame */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="card-pop p-6 bg-white border-[3px] border-cocoa text-center">
              <span className="text-[11px] font-black uppercase text-cocoa-fade tracking-widest block">
                Live Handi Preview
              </span>

              <HandiPreview
                base={base}
                size={size}
                gheeLayers={gheeLayers}
                toppings={toppings}
              />

              <div className="mt-4 pt-4 border-t-2 border-dashed border-cocoa/20">
                <h3 className="font-display text-xl text-cocoa">{base.label}</h3>
                <p className="text-xs font-bold text-cherry">{currentSizeObj.label} ({currentSizeObj.serves})</p>

                <div className="mt-3 flex items-center justify-between text-xs font-bold text-cocoa">
                  <span>Price (Incl. 5% GST):</span>
                  <span className="font-display text-2xl text-cherry">₹{totalPrice}</span>
                </div>
                <p className="text-[10px] text-cocoa-fade mt-0.5">
                  5% GST included: ₹{gstInclusive.toFixed(2)}
                </p>

                <button
                  onClick={handleAddCustomHandi}
                  className="pill-btn w-full mt-4 bg-cherry text-white text-sm !py-3 flex items-center justify-center gap-2 hover:bg-cherry-deep"
                >
                  <ShoppingBag size={16} />
                  <span>Add Handi to Feast &bull; ₹{totalPrice}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Step-by-Step Options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Base Marinated Cut */}
            <div className="card-pop p-5 bg-white border-[3px] border-cocoa space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-cocoa block">
                1. Select Dum Marinated Base
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BASES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBase(b)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      base.id === b.id
                        ? 'border-cocoa bg-lemon shadow-pop-sm font-black'
                        : 'border-cocoa/30 hover:border-cocoa bg-cream/40'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-cocoa">{b.label}</span>
                      <span className="text-xs font-extrabold text-cherry">₹{b.price}</span>
                    </div>
                    <span className="text-[10px] text-cocoa-fade block font-bold mt-0.5">{b.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Handi Size / Servings */}
            <div className="card-pop p-5 bg-white border-[3px] border-cocoa space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-cocoa block">
                2. Select Handi Capacity
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id as any)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      size === s.id
                        ? 'border-cocoa bg-tangerine shadow-pop-sm font-black text-cocoa'
                        : 'border-cocoa/30 hover:border-cocoa bg-cream/40 text-cocoa'
                    }`}
                  >
                    <p className="text-xs font-black">{s.label}</p>
                    <p className="text-[10px] font-bold opacity-80">{s.serves}</p>
                    <p className="text-xs font-extrabold text-cherry mt-1">
                      {s.price === 0 ? 'Base' : `+₹${s.price}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Desi Ghee & Dum Spices */}
            <div className="card-pop p-5 bg-white border-[3px] border-cocoa space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-cocoa block">
                3. Royal Ghee &amp; Spice Infusions (Optional)
              </span>
              <div className="space-y-2">
                {GHEE_LAYERS.map((g) => {
                  const isChecked = gheeLayers.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGhee(g.id)}
                      className={`w-full p-2.5 rounded-xl border-2 flex items-center justify-between text-left transition-all ${
                        isChecked
                          ? 'border-cocoa bg-lemon shadow-pop-sm font-black'
                          : 'border-cocoa/30 bg-cream/30 hover:border-cocoa'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded border-2 border-cocoa flex items-center justify-center ${
                            isChecked ? 'bg-cocoa text-lemon' : 'bg-white'
                          }`}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </span>
                        <span className="text-xs font-bold text-cocoa">{g.label}</span>
                      </div>
                      <span className="text-xs font-extrabold text-cherry">+₹{g.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Shahi Accompaniments */}
            <div className="card-pop p-5 bg-white border-[3px] border-cocoa space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-cocoa block">
                4. Salan &amp; Shahi Accompaniments
              </span>
              <div className="space-y-2">
                {TOPPINGS.map((t) => {
                  const isChecked = toppings.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTopping(t.id)}
                      className={`w-full p-2.5 rounded-xl border-2 flex items-center justify-between text-left transition-all ${
                        isChecked
                          ? 'border-cocoa bg-lemon shadow-pop-sm font-black'
                          : 'border-cocoa/30 bg-cream/30 hover:border-cocoa'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-4 w-4 rounded border-2 border-cocoa flex items-center justify-center ${
                            isChecked ? 'bg-cocoa text-lemon' : 'bg-white'
                          }`}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-cocoa">{t.label}</p>
                          <p className="text-[10px] text-cocoa-fade font-semibold">{t.tag}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-cherry">+₹{t.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
