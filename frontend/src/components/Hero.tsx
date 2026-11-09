import { useState, useMemo } from 'react';
import { ArrowRight, Sparkles, MapPin, Phone, ShieldCheck, Check } from 'lucide-react';
import { HERO_PHOTO, OUTLETS, type Outlet } from '../data';

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
  onStartOrder: (outlet?: Outlet) => void;
  selectedOutlet: Outlet;
}

export default function Hero({ onStartOrder, selectedOutlet }: HeroProps) {
  const bubbles = useMemo(() => BUBBLES, []);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [chosenOutletId, setChosenOutletId] = useState(selectedOutlet.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = OUTLETS.find((o) => o.id === chosenOutletId) || selectedOutlet;
    onStartOrder(matched);
  };

  return (
    <section id="top" className="relative overflow-hidden bg-cream pt-24 sm:pt-28 lg:pt-32 pb-6">
      
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
          
          {/* Left Column: Bold Copy & Customer Order Access Card (7 cols) */}
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
              Authentic slow-dummed biryani sealed with dough on coal fires. Order direct to save 15% on app fees with honest prep times across 17 Hyderabad kitchens.
            </p>

            {/* Customer Direct Order & Login Card */}
            <div className="card-pop bg-white p-5 sm:p-6 rounded-3xl border-[3px] border-cocoa text-left shadow-pop-md max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center justify-between mb-3 border-b-2 border-cocoa/20 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-cherry flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Direct Ordering Portal
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-lemon px-2.5 py-0.5 rounded-full border border-cocoa">
                  Save 15% Comm.
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                      <Phone size={12} /> Mobile Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-cocoa-fade mb-1 flex items-center gap-1">
                      <MapPin size={12} /> Select Locality
                    </label>
                    <select
                      value={chosenOutletId}
                      onChange={(e) => setChosenOutletId(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white cursor-pointer"
                    >
                      {OUTLETS.map((outlet) => (
                        <option key={outlet.id} value={outlet.id}>
                          {outlet.name} ({outlet.type === 'CLOUD_KITCHEN' ? 'Cloud' : 'Dine-In'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="pill-btn flex-1 w-full bg-cherry text-white text-sm sm:text-base !py-3 flex items-center justify-center gap-2 shadow-pop-sm hover:scale-[1.02] active:scale-95"
                  >
                    <span>Enter Ordering Menu &bull; 15% Off</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>

              <div className="mt-3 pt-2 border-t border-dashed border-cocoa/20 flex items-center justify-between text-[11px] font-bold text-cocoa-fade">
                <span>⚡ Auto-routes to station kitchen</span>
                <span className="text-emerald-700 font-black">All prices include 5% GST</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 text-xs font-black text-cocoa">
                <span className="flex items-center gap-1 bg-white border border-cocoa px-3 py-1 rounded-full shadow-sm">
                  🧈 100% Desi Ghee
                </span>
                <span className="flex items-center gap-1 bg-white border border-cocoa px-3 py-1 rounded-full shadow-sm">
                  ⭐ 4.9 Rating (18k+ Reviews)
                </span>
                <span className="flex items-center gap-1 bg-white border border-cocoa px-3 py-1 rounded-full shadow-sm">
                  📜 FSSAI Licensed
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
      <div aria-hidden="true" className="relative mt-10">
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-[44px] sm:h-[52px] w-full fill-lemon">
          <path d="M0,35 C120,65 240,5 360,35 C480,65 600,5 720,35 C840,65 960,5 1080,35 C1200,65 1320,5 1440,35 L1440,70 L0,70 Z" />
        </svg>
        <div className="h-4 w-full border-y-[3px] border-cocoa checkerboard" />
      </div>

    </section>
  );
}
