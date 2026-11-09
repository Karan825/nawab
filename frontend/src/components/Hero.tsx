import { useMemo } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { HERO_PHOTO } from '../data';

const BUBBLES = [
  { left: '8%', size: 16, delay: '0s', duration: '5s' },
  { left: '18%', size: 11, delay: '1.2s', duration: '4.2s' },
  { left: '32%', size: 22, delay: '0.6s', duration: '5.6s' },
  { left: '47%', size: 14, delay: '2s', duration: '4.8s' },
  { left: '58%', size: 10, delay: '0.9s', duration: '4.4s' },
  { left: '70%', size: 18, delay: '1.6s', duration: '5.2s' },
  { left: '82%', size: 12, delay: '0.3s', duration: '4.6s' },
  { left: '92%', size: 16, delay: '2.4s', duration: '5.4s' },
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
    <section id="top" className="relative overflow-hidden bg-cream pt-32 pb-0 sm:pt-36 lg:pt-40">
      {/* sunburst rays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 h-[640px] w-[640px] -translate-x-1/2 sm:h-[840px] sm:w-[840px] lg:left-[60%] lg:top-10"
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pt-8">
        {/* copy */}
        <div className="relative z-10 text-center lg:text-left">
          <span className="inline-flex -rotate-2 items-center gap-2 rounded-full border-[3px] border-cocoa bg-aqua px-5 py-2 text-sm font-extrabold uppercase tracking-[0.2em] shadow-pop-sm">
            <Sparkles size={16} strokeWidth={2.5} /> Est. 1978 · Hyderabad Dum Biryani
          </span>
          <h1 className="mt-6 font-display text-7xl leading-[1.02] text-hot-pink outline-text sm:text-8xl lg:text-9xl">
            Dum
            <span className="ml-4 inline-block -rotate-6 text-lemon">happens.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-xl font-semibold text-cocoa-soft lg:mx-0 lg:text-2xl leading-relaxed">
            Slow-cooked handis sealed with dough, aged basmati infused with pure saffron, and Nizami spice blends. Authentic since the first dum.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a href="#menu" className="pill-btn bg-cherry text-white text-xl !px-8 !py-3.5 shadow-pop-lg">
              See the menu <ArrowDown size={22} strokeWidth={3} />
            </a>
            <a href="#builder" className="pill-btn bg-lemon text-cocoa text-xl !px-8 !py-3.5 shadow-pop-lg">
              Build your own
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 lg:justify-start">
            <Starburst className="h-20 w-20 animate-twinkle" petals="pink" />
            <div className="text-left">
              <p className="font-display text-3xl text-aqua outline-text sm:text-4xl">4.9 stars</p>
              <p className="text-base font-bold text-cocoa-fade">from 18,400+ happy biryani lovers</p>
            </div>
            <Starburst className="h-20 w-20 animate-twinkle [animation-delay:0.8s]" petals="red" />
          </div>
        </div>

        {/* floating drink / handi */}
        <div className="relative z-10 mx-auto w-full max-w-md pb-12 lg:max-w-xl lg:pb-16">
          <div className="relative animate-bob">
            <Starburst className="absolute -left-10 -top-10 h-28 w-28 z-20" petals="pink" />
            <div className="relative overflow-hidden rounded-[3rem] border-[5px] border-cocoa bg-white shadow-pop-lg">
              <img
                src={HERO_PHOTO}
                alt="Hyderabadi Chicken Dum Biryani sealed in handi"
                className="h-[460px] w-full object-cover sm:h-[540px] lg:h-[580px]"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-cocoa/90 px-7 py-4 backdrop-blur-sm border-t-[3px] border-cocoa">
                <div>
                  <p className="font-display text-2xl text-lemon">Royal Chicken Dum Biryani</p>
                  <p className="text-sm font-bold uppercase tracking-widest text-cream/90 mt-0.5">Chef's special · ₹380</p>
                </div>
                <span className="rounded-full border-2 border-lemon px-4 py-1.5 text-xs font-black uppercase tracking-wider text-lemon bg-cocoa shadow-pop-sm">
                  Authentic Dum
                </span>
              </div>
            </div>
            <Starburst className="absolute -bottom-8 -right-8 h-24 w-24 animate-spin-slow z-20" petals="aqua" />
          </div>
        </div>
      </div>

      {/* wavy divider */}
      <div aria-hidden="true" className="relative mt-8">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-[56px] w-full fill-lemon">
          <path d="M0,35 C120,65 240,5 360,35 C480,65 600,5 720,35 C840,65 960,5 1080,35 C1200,65 1320,5 1440,35 L1440,70 L0,70 Z" />
        </svg>
        <div className="h-5 w-full border-y-[3px] border-cocoa checkerboard" />
      </div>
    </section>
  );
}
