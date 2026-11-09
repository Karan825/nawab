import { Sparkles } from 'lucide-react';
import { MARQUEE_FLAVORS } from '../data';

export default function Marquee() {
  const items = [...MARQUEE_FLAVORS, ...MARQUEE_FLAVORS];
  return (
    <div className="overflow-hidden border-y-[3px] border-cocoa bg-hot-pink py-3">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {items.map((flavor, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-xl text-white outline-text [text-stroke-width:0.5px] sm:text-2xl">
              {flavor}
            </span>
            <Sparkles className="w-4 h-4 text-lemon fill-lemon" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
