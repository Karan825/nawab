import { useMemo } from 'react';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { HERO_PHOTO } from '../data';

const BUBBLES = [
  { left: '6%', size: 14, delay: '0s', duration: '5s' },
  { left: '16%', size: 9, delay: '1.2s', duration: '4.2s' },
  { left: '28%', size: 16, delay: '0.6s', duration: '5.6s' },
  { left: '44%', size: 11, delay: '2s', duration: '4.8s' },
  { left: '56%', size: 8, delay: '0.9s', duration: '4.4s' },
  { left: '68%', size: 15, delay: '1.6s', duration: '5.2s' },
  { left: '80%', size: 10, delay: '0.3s', duration: '4.6s' },
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
  onStartOrder: () => void;
}

export default function Hero({ onStartOrder }: HeroProps) {
  const bubbles = useMemo(() => BUBBLES, []);

  return (
    <section id="top" className="relative overflow-hidden bg-cream pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16">
      
      {/* Sunburst background rays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 h-[640px] w-[640px] -translate-x-1/2 sm:h-[800px] sm:w-[800px] lg:left-[58%] lg:top-10 opacity-35"
      >
        <svg viewBox="0 0 200 200" className="h-full w-full animate-spin-slow">
          {Array.from({ length: 24 }).map((_, i) => (
            <polygon key={i} points="100,100 94,0 106,0" fill="#FFD93D" transform={`rotate(${i * 15} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="70" fill="#FFE9A8" opacity="0.6" />
        </svg>
      </div>

      {/* Floating rising bubbles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="absolute bottom-6 rounded-full border-2 border-cocoa/15 bg-white/40"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animation: `rise ${b.duration} linear ${b.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Hero Content Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Story & CTAs (7 cols) */}
          <div className="relative z-10 text-center lg:text-left lg:col-span-7 space-y-6">
            
            {/* Tagline Badge */}
            <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-full border-[3px] border-cocoa bg-aqua px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] shadow-pop-sm">
              <Sparkles size={14} strokeWidth={2.5} /> Est. 1978 · Hyderabad Dum Biryani
            </span>

            {/* Headline */}
            <h1 className="font-display text-5xl leading-[1.04] text-hot-pink outline-text sm:text-7xl lg:text-7xl xl:text-8xl">
              Dum <span className="inline-block -rotate-3 text-lemon">happens.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg lg:text-xl font-bold text-cocoa-soft leading-relaxed">
              Slow-cooked handis sealed with dough, aged long-grain basmati infused with pure Kashmiri saffron, and secret Nizami spices. Hyderabad's royal feast cooked on slow coal fires.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={onStartOrder}
                className="pill-btn bg-cherry text-white text-base sm:text-lg !py-4 !px-8 flex items-center justify-center gap-2.5 shadow-pop-md hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <span>Order Online Now</span>
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>

              <a
                href="#heritage"
                className="pill-btn bg-lemon text-cocoa text-base sm:text-lg !py-4 !px-7 flex items-center justify-center gap-2 shadow-pop-md hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <span>Our Heritage</span>
                <ArrowDown size={18} strokeWidth={2.5} />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t-2 border-dashed border-cocoa/20 flex flex-wrap items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-3">
                <Starburst className="h-14 w-14 animate-twinkle shrink-0" petals="pink" />
                <div className="text-left">
                  <p className="font-display text-2xl text-aqua outline-text [text-stroke-width:0.5px]">4.9 stars</p>
                  <p className="text-xs font-bold text-cocoa-fade">18,400+ biryani lovers</p>
                </div>
              </div>

              <div className="h-8 w-0.5 bg-cocoa/20 hidden sm:block" />

              <div className="flex items-center gap-2 text-xs font-black text-cocoa">
                <span className="flex items-center gap-1 bg-white border border-cocoa px-3 py-1 rounded-full shadow-sm">
                  🧈 100% Desi Ghee
                </span>
                <span className="flex items-center gap-1 bg-white border border-cocoa px-3 py-1 rounded-full shadow-sm">
                  📜 All Prices 5% GST Included
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Biryani Handi Showcase (5 cols) */}
          <div className="relative z-10 lg:col-span-5 mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative animate-bob">
              <Starburst className="absolute -left-6 -top-6 h-20 w-20 sm:h-24 sm:w-24 z-20" petals="pink" />
              
              <div className="relative overflow-hidden rounded-[2.5rem] border-[4px] border-cocoa bg-white shadow-pop-lg">
                <img
                  src={HERO_PHOTO}
                  alt="Authentic Royal Hyderabadi Chicken Dum Biryani sealed in handi"
                  className="h-[360px] sm:h-[440px] lg:h-[460px] w-full object-cover"
                  loading="eager"
                />
                
                {/* Handi Photo Caption */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-cocoa/90 px-5 py-4 backdrop-blur-sm border-t-[3px] border-cocoa text-cream">
                  <div>
                    <p className="font-display text-lg text-lemon leading-tight">Royal Chicken Dum Biryani</p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-cream/75 mt-0.5">
                      Today's Special &bull; ₹380 (5% GST Incl.)
                    </p>
                  </div>
                  <span className="rounded-full border-2 border-lemon px-3 py-1 text-[11px] font-black uppercase tracking-wider text-lemon bg-cocoa shadow-pop-sm shrink-0">
                    Authentic Dum
                  </span>
                </div>
              </div>

              <Starburst className="absolute -bottom-6 -right-6 h-20 w-20 animate-spin-slow z-20" petals="aqua" />
            </div>
          </div>

        </div>
      </div>

      {/* Wavy Retro Divider */}
      <div aria-hidden="true" className="relative mt-12">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-[44px] sm:h-[52px] w-full fill-lemon">
          <path d="M0,35 C120,65 240,5 360,35 C480,65 600,5 720,35 C840,65 960,5 1080,35 C1200,65 1320,5 1440,35 L1440,70 L0,70 Z" />
        </svg>
        <div className="h-4 w-full border-y-[3px] border-cocoa checkerboard" />
      </div>

    </section>
  );
}
