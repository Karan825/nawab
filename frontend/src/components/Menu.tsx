import { useState } from 'react';
import { Star } from 'lucide-react';
import { DRINKS, CATEGORIES, type Category, type Drink } from '../data';

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

function DrinkCard({ drink }: { drink: Drink }) {
  return (
    <article className="card-pop relative flex flex-col hover:-translate-y-1.5 hover:shadow-pop-lg">
      <PriceBadge price={drink.price} />
      <div className="relative">
        <img
          src={drink.photo}
          alt={drink.name}
          loading="lazy"
          className="h-56 w-full border-b-[3px] border-cocoa object-cover"
        />
        {drink.badge && (
          <span className="absolute left-3 top-3 -rotate-3 rounded-full border-2 border-cocoa bg-hot-pink px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-pop-sm">
            {drink.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-cocoa">{drink.name}</h3>
        <p className="mt-0.5 text-sm font-bold italic text-cocoa-fade">{drink.tagline}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {drink.ingredients.map((ing) => (
            <li
              key={ing}
              className="rounded-full border-2 border-cocoa/70 bg-cream px-2.5 py-0.5 text-[11px] font-bold text-cocoa-soft"
            >
              {ing}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-cocoa/20 pt-3">
          <div className="flex gap-0.5" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} className="fill-lemon text-cocoa" strokeWidth={2} />
            ))}
          </div>
          <a
            href="#builder"
            className="text-sm font-extrabold uppercase tracking-wider text-cherry underline decoration-[3px] decoration-lemon underline-offset-4 transition-colors hover:text-hot-pink"
          >
            Customize
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Menu() {
  const [active, setActive] = useState<Category>('All');
  const filtered = active === 'All' ? DRINKS : DRINKS.filter((d) => d.category === active);

  return (
    <section id="menu" className="relative bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-block -rotate-1 rounded-full border-[3px] border-cocoa bg-tangerine px-4 py-1 text-xs font-extrabold uppercase tracking-[0.25em] shadow-pop-sm">
            The lineup
          </span>
          <h2 className="mt-4 font-display text-4xl text-cherry outline-text sm:text-5xl">
            Royal Dum Menu
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-semibold text-cocoa-soft">
            Slow-cooked Hyderabadi Dum Biryanis, kebabs, desserts & Irani chai. Prices include 5% GST.
          </p>
        </div>

        <div className="no-scrollbar mt-8 flex gap-2.5 overflow-x-auto pb-2 sm:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`shrink-0 rounded-full border-[3px] border-cocoa px-5 py-2 text-sm font-extrabold uppercase tracking-wider transition-all ${
                active === cat
                  ? 'bg-cocoa text-lemon shadow-pop-sm'
                  : 'bg-white text-cocoa hover:bg-lemon'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((drink) => (
            <DrinkCard key={drink.id} drink={drink} />
          ))}
        </div>
      </div>
    </section>
  );
}
