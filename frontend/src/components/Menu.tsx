import { useState } from 'react';
import { Star, Flame, ShoppingBag } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES, type Category, type MenuItem } from '../data';

function PriceBadge({ price }: { price: number }) {
  return (
    <div className="absolute -right-3 -top-3 z-20 flex h-16 w-16 rotate-12 items-center justify-center">
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

function MenuItemCard({
  item,
  onAddToCart,
}: {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}) {
  return (
    <article className="card-pop relative flex flex-col hover:-translate-y-1.5 hover:shadow-pop-lg transition-transform duration-200 bg-white">
      <PriceBadge price={item.price} />
      
      <div className="relative overflow-hidden rounded-t-[21px]">
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

        {/* FSSAI Veg/Non-Veg Dot Badge */}
        <div className="absolute right-3 bottom-3 rounded-md bg-white border-2 border-cocoa p-1 shadow-pop-sm flex items-center justify-center">
          <span
            className={`h-3 w-3 rounded-full ${
              item.dietary === 'VEG' ? 'bg-emerald-600' : 'bg-cherry'
            }`}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-cocoa leading-snug">{item.name}</h3>
        <p className="mt-1 text-xs font-bold text-cocoa-fade leading-relaxed">{item.description}</p>

        {/* Spice Level & Allergens */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-cocoa/40 bg-cream px-2.5 py-0.5 text-[10px] font-bold text-cocoa">
            <Flame size={12} className={item.spiceLevel === 'EXTRA_SPICY' ? 'text-cherry fill-cherry' : 'text-tangerine'} />
            {item.spiceLevel}
          </span>
          {item.allergens.length > 0 && (
            <span className="text-[10px] font-bold text-cocoa-fade bg-cream/70 px-2 py-0.5 rounded-full border border-cocoa/20">
              {item.allergens[0]}
            </span>
          )}
          <span className="text-[10px] font-extrabold text-emerald-700 ml-auto">
            5% GST Included
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-cocoa/20 pt-3">
          <div className="flex gap-0.5" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} className="fill-lemon text-cocoa" strokeWidth={2} />
            ))}
          </div>

          <button
            onClick={() => onAddToCart(item)}
            className="pill-btn bg-cherry text-white text-xs !py-2 !px-4 hover:bg-cherry-deep flex items-center gap-1.5"
          >
            <ShoppingBag size={14} />
            <span>Customize &amp; Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}

interface MenuProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [active, setActive] = useState<Category>('All');
  const filtered = active === 'All' ? MENU_ITEMS : MENU_ITEMS.filter((d) => d.category === active);

  return (
    <section id="menu" className="relative bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-block -rotate-1 rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.25em] shadow-pop-sm">
            Handcrafted Dastarkhwan
          </span>
          <h2 className="mt-4 font-display text-4xl text-cherry outline-text sm:text-5xl">
            Menu of Hyderabad
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-semibold text-cocoa-soft text-base">
            Kachhi Dum biryanis, fiery starters, and heirloom Nizami desserts. All prices include 5% GST.
          </p>
        </div>

        {/* Categories Bar - with ample padding so pills are never cut off */}
        <div className="no-scrollbar mt-10 flex gap-3 overflow-x-auto py-4 px-2 sm:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`shrink-0 rounded-full border-[3px] border-cocoa px-6 py-2.5 text-sm font-extrabold uppercase tracking-wider transition-all select-none ${
                active === cat
                  ? 'bg-cocoa text-lemon shadow-pop -translate-y-0.5'
                  : 'bg-white text-cocoa hover:bg-lemon'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid - with top spacing so the top row price badges fit comfortably */}
        <div className="mt-12 pt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
