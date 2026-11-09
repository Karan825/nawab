import { useMemo } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { HERO_PHOTO } from '../data';

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

export default function Hero() {
  const bubbles = useMemo(() => BUBBLES, []);

  return (
    <section id="top" className="relative overflow-hidden bg-cream pt-28 pb-0 sm:pt-32">
      {/* sunburst rays */}
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

      {/* rising bubbles */}
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-4 lg:pt-10">
        {/* copy */}
        <div className="relative z-10 text-center lg:text-left">
          <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-full border-[3px] border-cocoa bg-aqua px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] shadow-pop-sm">
            <Sparkles size={14} strokeWidth={2.5} /> Est. 1978 · 17 Hyderabad Outlets
          </span>
          <h1 className="mt-5 font-display text-6xl leading-[1.05] text-cherry outline-text sm:text-7xl lg:text-8xl">
            Dum
            <span className="ml-3 inline-block -rotate-6 text-lemon">happens.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg font-semibold text-cocoa-soft lg:mx-0 lg:text-xl">
            Royal Nizami dum biryani slow-cooked in sealed clay handis with saffron, aged basmati, and pure desi ghee.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a href="#menu" className="pill-btn bg-cherry text-white text-lg">
              See the menu <ArrowDown size={18} strokeWidth={3} />
            </a>
            <a href="#builder" className="pill-btn bg-lemon text-cocoa text-lg">
              Build your own
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 lg:justify-start">
            <Starburst className="h-16 w-16 animate-twinkle" petals="pink" />
            <div className="text-left">
              <p className="font-display text-2xl text-cherry outline-text">4.9 stars</p>
              <p className="text-sm font-bold text-cocoa-fade">from 48,000+ biryani lovers</p>
            </div>
            <Starburst className="h-16 w-16 animate-twinkle [animation-delay:0.8s]" petals="aqua" />
          </div>
        </div>

        {/* floating biryani card */}
        <div className="relative z-10 mx-auto w-full max-w-sm pb-12 lg:max-w-md lg:pb-16">
          <div className="relative animate-bob">
            <Starburst className="absolute -left-8 -top-8 h-24 w-24" petals="pink" />
            <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-cocoa bg-white shadow-pop-lg">
              <img
                src={HERO_PHOTO}
                alt="Hyderabadi Chicken Dum Biryani in Clay Handi"
                className="h-[420px] w-full object-cover sm:h-[480px]"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-cocoa/85 px-5 py-3 backdrop-blur-sm">
                <div>
                  <p className="font-display text-lg text-lemon">Royal Chicken Dum Biryani</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-cream/80">Today’s special · ₹380</p>
                </div>
                <span className="rounded-full border-2 border-lemon px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-lemon">
                  Kachhi Dum
                </span>
              </div>
            </div>
            <Starburst className="absolute -bottom-6 -right-6 h-20 w-20 animate-spin-slow" petals="aqua" />
          </div>
        </div>
      </div>

      {/* wavy divider */}
      <div aria-hidden="true" className="relative">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-[52px] w-full fill-lemon">
          <path d="M0,35 C120,65 240,5 360,35 C480,65 600,5 720,35 C840,65 960,5 1080,35 C1200,65 1320,5 1440,35 L1440,70 L0,70 Z" />
        </svg>
        <div className="h-4 w-full border-y-[3px] border-cocoa checkerboard" />
      </div>
    </section>
  );
}
