import React from 'react';
import { Sparkles } from 'lucide-react';
import { MARQUEE_FLAVORS } from '../data';

export default function Marquee() {
  const items = [...MARQUEE_FLAVORS, ...MARQUEE_FLAVORS];
  return (
    <div className="overflow-hidden border-y-[3px] border-cocoa bg-lemon py-3.5 shadow-sm">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {items.map((flavor, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-lg sm:text-xl text-cocoa">
              {flavor}
            </span>
            <Sparkles className="w-4 h-4 text-cherry fill-cherry" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
