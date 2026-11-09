import { useMemo } from 'react';
import { ArrowDown, Sparkles, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { HERO_PHOTO, Outlet } from '../data';

const BUBBLES = [
  { left: '8%', size: 14, delay: '0s', duration: '5s' },
  { left: '18%', size: 9, delay: '1.2s', duration: '4.2s' },
  { left: '32%', size: 18, delay: '0.6s', duration: '5.6s' },
  { left: '47%', size: 11, delay: '2s', duration: '4.8s' },
  { left: '58%', size: 8, delay: '0.9s', duration: '4.4s' },
  { left: '70%', size: 15, delay: '1.6s', duration: '5.2s' },
  { left: '82%', size: 10, delay: '0.3s', duration: '4.6s' },
  { left: '92%', size: 13, delay: '2.4s', duration: '5.4s' },
];

function Starburst({ className = '', petals = 'lemon' }: { className?: string; petals?: string }) {
  const fill =
    petals === 'pink' ? '#FF4FA3' : petals === 'red' ? '#E8333A' : petals === 'aqua' ? '#38C6C6' : '#FFD93D';
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <polygon
          key={i}
          points="50,0 56,38 50,50 44,38"
          fill={fill}
          stroke="#3A2318"
          strokeWidth="2.5"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="16" fill="#FFF4E2" stroke="#3A2318" strokeWidth="2.5" />
    </svg>
  );
}

interface HeroProps {
  selectedOutlet: Outlet;
}

export default function Hero({ selectedOutlet }: HeroProps) {
  const bubbles = useMemo(() => BUBBLES, []);

  return (
    <section id="top" className="relative overflow-hidden bg-cream pt-28 pb-10 sm:pt-32">
      {/* Sunburst Rays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[560px] w-[560px] -translate-x-1/2 sm:h-[720px] sm:w-[720px] lg:left-[62%] lg:top-16"
      >
        <svg viewBox="0 0 200 200" className="h-full w-full animate-spin-slow opacity-40">
          {Array.from({ length: 24 }).map((_, i) => (
            <polygon key={i} points="100,100 94,0 106,0" fill="#FFD93D" transform={`rotate(${i * 15} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="70" fill="#FFE9A8" opacity="0.7" />
        </svg>
      </div>

      {/* Rising Saffron & Spice Garnish Bubbles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="absolute bottom-10 rounded-full border-2 border-cocoa/15 bg-white/40"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animation: `rise ${b.duration} linear ${b.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pt-6">
        {/* Left Copy */}
        <div className="relative z-10 text-center lg:text-left">
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] shadow-pop-sm">
              <Sparkles size={14} strokeWidth={2.5} /> Est. 1978 · 17 Hyderabad Outlets
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-cocoa bg-white px-3 py-1 text-[11px] font-bold text-cocoa">
              <ShieldCheck size={13} className="text-emerald-700" />
              FSSAI: {selectedOutlet.fssaiLicense} (Demo)
            </span>
          </div>

          <h1 className="mt-5 font-display text-6xl leading-[1.05] text-cherry outline-text sm:text-7xl lg:text-8xl">
            Dum
            <span className="ml-3 inline-block -rotate-6 text-lemon">happens.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base sm:text-lg font-bold text-cocoa-soft lg:mx-0">
            Slow-cooked in sealed handis with saffron, aged basmati, and pure desi ghee. Order directly from our kitchens to save 25–30% delivery commission!
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a href="#menu" className="pill-btn bg-cherry text-white text-base sm:text-lg">
              See the menu <ArrowDown size={18} strokeWidth={3} />
            </a>
            <a href="#builder" className="pill-btn bg-lemon text-cocoa text-base sm:text-lg">
              Craft your Handi
            </a>
          </div>

          {/* 5% GST Clear Statement */}
          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-extrabold text-cocoa-soft">
            <span className="bg-white border-2 border-cocoa px-3 py-1 rounded-full shadow-pop-sm">
              📋 All prices include 5% GST
            </span>
            <span className="bg-white border-2 border-cocoa px-3 py-1 rounded-full shadow-pop-sm flex items-center gap-1 text-cherry">
              <Clock size={13} /> Avg Prep: ~{selectedOutlet.minPrepTimeMinutes} mins
            </span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-5 lg:justify-start">
            <Starburst className="h-14 w-14 animate-twinkle" petals="pink" />
            <div className="text-left">
              <p className="font-display text-2xl text-cherry outline-text">4.9 stars</p>
              <p className="text-xs font-bold text-cocoa-fade">from 48,000+ biryani lovers</p>
            </div>
            <Starburst className="h-14 w-14 animate-twinkle [animation-delay:0.8s]" petals="aqua" />
          </div>
        </div>

        {/* Right Photo Frame */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
          <div className="card-pop relative w-full overflow-hidden bg-white">
            
            {/* Pop-out stickers */}
            <span className="absolute -left-3 -top-3 z-20 -rotate-12 rounded-2xl border-[3px] border-cocoa bg-lemon px-4 py-1.5 font-display text-sm text-cherry shadow-pop">
              Sealed with Dough!
            </span>
            <span className="absolute -bottom-3 -right-3 z-20 rotate-6 rounded-2xl border-[3px] border-cocoa bg-cherry px-4 py-1.5 font-display text-xs text-white shadow-pop">
              100% Asli Ghee
            </span>

            <img
              src={HERO_PHOTO}
              alt="Authentic Hyderabadi Biryani Handi"
              className="h-80 w-full object-cover sm:h-96 border-b-[3px] border-cocoa"
            />

            <div className="p-4 bg-cream flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase text-cocoa-fade">Dispatch Station:</p>
                <h4 className="font-display text-lg text-cocoa flex items-center gap-1">
                  <MapPin size={16} className="text-cherry" />
                  {selectedOutlet.name}
                </h4>
                <p className="text-[11px] font-bold text-cocoa-soft">
                  {selectedOutlet.area} &bull; Radius: {selectedOutlet.deliveryRadiusKm}km
                </p>
              </div>

              <span className="pill-btn bg-emerald-500 text-white text-[11px] !py-1.5 !px-3 shadow-pop-sm">
                ● Live Kitchen
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
