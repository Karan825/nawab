import { MARQUEE_FLAVORS } from '../data';

export default function Marquee() {
  const items = [...MARQUEE_FLAVORS, ...MARQUEE_FLAVORS];

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y-[3px] border-cocoa bg-lemon py-3 shadow-[0_4px_0_0_#3A2318]"
    >
      <div className="flex w-max animate-marquee">
        {items.map((flavor, i) => (
          <div key={i} className="flex items-center gap-6 px-4">
            <span className="font-display text-lg tracking-wide text-cocoa sm:text-xl">
              {flavor}
            </span>
            <span className="text-xl">🍗</span>
            <span className="h-2 w-2 rounded-full border-2 border-cocoa bg-cherry" />
          </div>
        ))}
      </div>
    </div>
  );
}
