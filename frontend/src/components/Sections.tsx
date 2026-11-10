import React, { useState, useRef } from 'react';
import {
  Clock,
  Instagram,
  Facebook,
  Twitter,
  ShieldCheck,
  Sparkles,
  Flame,
  Phone,
  ArrowRight,
  UtensilsCrossed,
  Award,
  CheckCircle2,
  FileText,
  Truck,
  CookingPot,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Heart,
  TrendingDown,
  Layers,
  ChefHat,
  Star
} from 'lucide-react';
import { HOURS, OUTLETS } from '../data';

// ============================================================================
// 1. HERITAGE STORY SECTION (Full Spaced View)
// ============================================================================
export function ShopHeritageSection() {
  const steps = [
    {
      step: '01',
      title: 'Overnight Nizami Marination',
      desc: 'Prime farm-fresh chicken and tender baby goat marinated for 12 hours with stone-ground spices, ginger-garlic paste, and aged curd.',
      icon: UtensilsCrossed,
    },
    {
      step: '02',
      title: 'Aged Basmati & Kashmiri Saffron',
      desc: '2-year aged long-grain basmati parboiled with royal whole spices (shahi jeera, cardamom, mace) and steeped in pure saffron milk.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Wheat Dough Handi Seal',
      desc: 'Heavy brass and clay handis layered with pure desi ghee and marinated meat, sealed airtight with kneaded dough (purdah).',
      icon: CookingPot,
    },
    {
      step: '04',
      title: '4-Hour Coal Ember Dum',
      desc: 'Handis are placed over slow charcoal embers with hot coals on the lid. Meat cooks tender in its own sealed steam juices.',
      icon: Flame,
    },
  ];

  return (
    <section id="heritage" className="relative min-h-[75vh] bg-cream py-20 sm:py-28 flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block -rotate-1 rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1 text-xs font-black uppercase tracking-[0.25em] text-cocoa shadow-pop-sm">
            Since 1978 &bull; Authenticity
          </span>
          <h2 className="font-display text-4xl sm:text-6xl text-cherry outline-text [text-stroke-width:0.5px]">
            The Ancient Art of Dum
          </h2>
          <p className="text-base sm:text-lg font-bold text-cocoa-soft leading-relaxed">
            No pressure cookers. No artificial colors. Only authentic clay and brass handis sealed with dough over smoldering coals.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="card-pop bg-white p-7 rounded-3xl border-[3px] border-cocoa flex flex-col justify-between hover:-translate-y-1.5 transition-transform shadow-pop"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display text-2xl text-lemon bg-cocoa h-12 w-12 rounded-2xl flex items-center justify-center border-2 border-cocoa shadow-pop-sm">
                      {st.step}
                    </span>
                    <span className="h-11 w-11 rounded-2xl bg-lemon/40 border-2 border-cocoa flex items-center justify-center text-cherry shadow-sm">
                      <Icon size={20} strokeWidth={2.5} />
                    </span>
                  </div>

                  <h3 className="font-display text-xl text-cocoa mb-2 leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-cocoa-soft leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-cocoa/15 flex items-center justify-between text-[11px] font-black text-cherry uppercase">
                  <span>Tradition Verified</span>
                  <span>Pure Ghee</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// ============================================================================
// 2. STICKY STACKING FEATURE CARDS ("The Nawaab's Advantage")
// ============================================================================
interface AdvantageCard {
  number: string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  iconBg: string;
  iconColor: string;
  rotateClass: string;
  topOffset: string;
  zIndex: number;
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
}

const ADVANTAGE_CARDS: AdvantageCard[] = [
  {
    number: '01+',
    title: '100% Charcoal Coal Dum Cooking',
    description: 'Every handi is sealed with kneaded dough over glowing charcoal embers. No commercial shortcuts, microwave reheating, or artificial colorings.',
    bgColor: 'bg-[#FFF9E6]',
    textColor: 'text-cocoa',
    iconBg: 'bg-lemon',
    iconColor: 'text-cocoa',
    rotateClass: 'rotate-[-1deg]',
    topOffset: '5.5rem',
    zIndex: 1,
    icon: Flame,
  },
  {
    number: '02+',
    title: 'Save 15% App Commission Directly',
    description: 'Third-party delivery apps take 25–30% in commission fees. Ordering direct from our platform saves 15 points, passing pure savings back to you.',
    bgColor: 'bg-[#EBF7F0]',
    textColor: 'text-emerald-950',
    iconBg: 'bg-emerald-600',
    iconColor: 'text-white',
    rotateClass: 'rotate-[1.2deg]',
    topOffset: '7.5rem',
    zIndex: 2,
    icon: TrendingDown,
  },
  {
    number: '03+',
    title: '17 Stations with Real-Time KDS Tablets',
    description: 'Orders route directly to our 14 flagship dine-in kitchens and 3 dark kitchens. AI predicts prep times based on active kitchen load so promised times are honest.',
    bgColor: 'bg-[#FFF0F0]',
    textColor: 'text-rose-950',
    iconBg: 'bg-cherry',
    iconColor: 'text-white',
    rotateClass: 'rotate-[-1deg]',
    topOffset: '9.5rem',
    zIndex: 3,
    icon: ChefHat,
  },
  {
    number: '04+',
    title: 'Prices Strictly Inclusive of 5% GST',
    description: 'Zero hidden taxes or checkout surprises. Every menu price includes 5% GST. DPDP Act 2023 compliant data protection guarantees zero spam.',
    bgColor: 'bg-[#EBF5FB]',
    textColor: 'text-blue-950',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    rotateClass: 'rotate-[1deg]',
    topOffset: '11.5rem',
    zIndex: 4,
    icon: ShieldCheck,
  },
  {
    number: '05+',
    title: 'Royal Dawat Catering & Nawaab Coins',
    description: 'Earn loyalty points on every direct order and redeem them instantly at checkout. Order party handis for 15 to 100+ guests with manager confirmation.',
    bgColor: 'bg-cocoa',
    textColor: 'text-cream',
    iconBg: 'bg-lemon',
    iconColor: 'text-cocoa',
    rotateClass: 'rotate-[-0.8deg]',
    topOffset: '13.5rem',
    zIndex: 5,
    icon: Award,
  },
];

export function DirectOrderingBenefitsSection({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <section id="why-direct" className="relative bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-black uppercase tracking-widest text-cocoa-fade block">
            Direct Platform Architecture
          </span>
          <h2 className="mt-2 font-display text-4xl sm:text-6xl text-cherry outline-text [text-stroke-width:0.5px]">
            The Direct Ordering Advantage
          </h2>
          <p className="mt-3 text-base sm:text-lg font-bold text-cocoa-soft leading-relaxed">
            By shifting from third-party delivery apps to our direct ordering portal, you get hotter handis, honest prices, and direct kitchen support.
          </p>
        </div>

        {/* Grid: Left Sticky Showcase Card + Right Stacking Cards */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
          
          {/* Left: Sticky Showcase Card */}
          <div className="lg:sticky lg:top-28">
            <div className="group relative flex min-h-[32rem] sm:min-h-[36rem] flex-col justify-between overflow-hidden rounded-4xl bg-cocoa p-7 sm:p-9 text-cream border-[3px] border-cocoa shadow-pop-lg transition-all duration-300">
              
              {/* Top Badges */}
              <div className="flex w-full justify-between items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-black text-white border border-white/15">
                  <span>17 Outlets Live</span>
                </span>
                <span className="flex h-9 items-center justify-center rounded-full bg-lemon px-3.5 text-xs font-black text-cocoa">
                  Save 15% Today
                </span>
              </div>

              {/* Center Graphic */}
              <div className="my-6 relative flex items-center justify-center">
                <div className="w-full max-w-sm rounded-3xl bg-white/5 border border-white/15 p-6 flex flex-col justify-between shadow-inner backdrop-blur-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-black uppercase text-lemon flex items-center gap-1.5">
                      <CookingPot size={15} /> Handi Dispatch Station
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300">Kondapur Flagship</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-cream/70">
                      <span>Delivery App Commission</span>
                      <span className="text-rose-400 font-bold line-through">27% Fee</span>
                    </div>
                    <div className="flex justify-between text-cream/70">
                      <span>Direct Platform Fee</span>
                      <span className="text-emerald-400 font-bold">12% Direct Cost</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 font-black text-sm">
                      <span className="text-white">Customer Savings</span>
                      <span className="text-lemon font-display">15% Less (DIRECT15)</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-lemon/20 border border-lemon/30 p-2.5 text-center text-[11px] font-bold text-lemon">
                    All prices strictly inclusive of 5% GST
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-2xl sm:text-3xl leading-tight text-lemon">
                  Direct from Station to Your Doorstep
                </h3>
                <p className="mt-2 text-xs sm:text-sm font-semibold text-cream/80 leading-relaxed">
                  Every order is assigned to the closest station kitchen, sealed hot with dough, and tracked stage-by-stage.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={onOrderClick}
                    className="pill-btn bg-lemon text-cocoa hover:bg-white text-xs sm:text-sm !py-3 !px-7 font-black transition-transform hover:scale-105 shadow-sm inline-flex items-center gap-2"
                  >
                    <span>Order Direct Now</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Sticky Stacking Cards */}
          <aside className="relative">
            <ul className="relative space-y-6 pb-12 list-none m-0 p-0">
              {ADVANTAGE_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <li
                    key={card.number}
                    className="sticky"
                    style={{
                      zIndex: card.zIndex,
                      top: card.topOffset,
                    }}
                  >
                    <article
                      className={`flex min-h-72 sm:min-h-80 flex-col justify-between rounded-[2.2rem] p-7 sm:p-9 shadow-pop-lg border-[3px] border-cocoa ${card.bgColor} ${card.textColor} ${card.rotateClass} transition-transform duration-300 hover:rotate-0`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-display text-5xl sm:text-7xl font-black leading-none tracking-tight opacity-90">
                          {card.number}
                        </p>
                        <span className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border-2 border-cocoa shadow-pop-sm ${card.iconBg} ${card.iconColor}`}>
                          <Icon size={24} strokeWidth={2.5} />
                        </span>
                      </div>

                      <div className="max-w-xl mt-5 space-y-2">
                        <p className="font-display text-xl sm:text-2xl font-black leading-tight">
                          {card.title}
                        </p>
                        <p className="text-xs sm:text-sm font-bold leading-relaxed opacity-90">
                          {card.description}
                        </p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </aside>

        </div>

      </div>
    </section>
  );
}

// ============================================================================
// 3. INTERACTIVE CUSTOMER TESTIMONIALS DECK
// ============================================================================
interface Review {
  quote: string;
  author: string;
  role: string;
  bgColor: string;
  textColor: string;
  authorColor: string;
}

const DINER_REVIEWS: Review[] = [
  {
    quote: "The slow-cooked mutton handi is unmatched in Hyderabad. Tender meat that truly falls off the bone with zero excessive oil. Ordering direct saved us ₹240 compared to Swiggy.",
    author: "Dr. Farooq Siddiqui",
    role: "Banjara Hills · 48 Direct Orders",
    bgColor: "bg-cherry",
    textColor: "text-white",
    authorColor: "text-lemon",
  },
  {
    quote: "We ordered 35 pax dawat degs for our family Eid milan. The handi arrived piping hot, sealed with wheat dough, exactly at 1:30 PM. The catering manager followed up personally.",
    author: "Zehra Begum",
    role: "Jubilee Hills · Bulk Dawat Client",
    bgColor: "bg-lemon",
    textColor: "text-cocoa",
    authorColor: "text-cherry",
  },
  {
    quote: "The live order tracker with the 5 kitchen stages is brilliant. Watching your biryani go from 'On Dum' to 'Packed' removes all anxiety. And the prices strictly include GST.",
    author: "Arjun Reddy",
    role: "Kondapur · Regular Friday Diner",
    bgColor: "bg-cocoa",
    textColor: "text-cream",
    authorColor: "text-lemon",
  },
  {
    quote: "Irani Chai and fresh Osmania biscuits delivered in an insulated thermal flask in 22 minutes from Gachibowli. A daily afternoon lifesaver for our engineering team.",
    author: "Sneha Mukherjee",
    role: "HITEC City · Tech Lead",
    bgColor: "bg-aqua",
    textColor: "text-cocoa",
    authorColor: "text-cherry",
  },
  {
    quote: "Pure Gir cow desi ghee and aged Kashmiri saffron. You can smell the authentic coal dum fragrance the second you break the dough seal. The real taste of 1978 Hyderabad.",
    author: "Mirza Asad Baig",
    role: "Charminar Heritage Walk Connoisseur",
    bgColor: "bg-white",
    textColor: "text-cocoa",
    authorColor: "text-cherry",
  },
];

export function SignatureSpecialtiesSection({ onOrderClick }: { onOrderClick: () => void }) {
  const [currentReview, setCurrentReview] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);
  const total = DINER_REVIEWS.length;

  const handleNext = () => setCurrentReview((prev) => (prev + 1) % total);
  const handlePrev = () => setCurrentReview((prev) => (prev - 1 + total) % total);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (dragOffset > 50) handlePrev();
    else if (dragOffset < -50) handleNext();
    setDragOffset(0);
  };

  const ROTATIONS = [0, 3, -3.5, 2.5, -2];

  return (
    <section id="signatures" className="relative min-h-[75vh] bg-cream py-20 sm:py-28 select-none flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-cocoa-fade block">
            Verified Customer Stories
          </span>
          <h2 className="font-display text-4xl sm:text-6xl text-cherry outline-text [text-stroke-width:0.5px]">
            Loved by Hyderabad
          </h2>
          <p className="text-sm sm:text-base font-bold text-cocoa-soft">
            Swipe or use arrow buttons to browse reviews from all 17 city stations.
          </p>
        </div>

        {/* The Interactive Testimonial Cards Deck */}
        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center">
          <div
            className="relative w-full max-w-sm sm:max-w-md h-[24rem] sm:h-[26rem] mx-auto cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {DINER_REVIEWS.map((review, idx) => {
              const diff = (idx - currentReview + total) % total;

              let style: React.CSSProperties = {
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                transform: 'translateY(36px) scale(0.88)',
                zIndex: 1,
              };

              if (diff === 0) {
                const currentRot = ROTATIONS[idx % ROTATIONS.length] + dragOffset * 0.04;
                style = {
                  transform: `translateX(${dragOffset}px) translateY(0px) rotate(${currentRot}deg) scale(1)`,
                  opacity: 1,
                  visibility: 'visible',
                  zIndex: 10,
                  pointerEvents: 'auto',
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s ease',
                };
              } else if (diff === 1) {
                style = {
                  transform: `translateY(16px) rotate(${ROTATIONS[(idx + 1) % ROTATIONS.length]}deg) scale(0.96)`,
                  opacity: 0.88,
                  visibility: 'visible',
                  zIndex: 9,
                  pointerEvents: 'none',
                  transition: 'transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s ease',
                };
              } else if (diff === 2) {
                style = {
                  transform: `translateY(28px) rotate(${ROTATIONS[(idx + 2) % ROTATIONS.length]}deg) scale(0.92)`,
                  opacity: 0.72,
                  visibility: 'visible',
                  zIndex: 8,
                  pointerEvents: 'none',
                  transition: 'transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s ease',
                };
              }

              return (
                <article
                  key={`${review.author}-${idx}`}
                  style={style}
                  className={`review-card-item absolute inset-0 rounded-[2.2rem] p-7 sm:p-9 flex flex-col justify-between border-[3px] border-cocoa shadow-pop-lg ${review.bgColor} ${review.textColor}`}
                >
                  <p className="text-base sm:text-lg font-bold leading-relaxed">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  
                  <div className="mt-5 border-t border-current/20 pt-4 flex items-center justify-between">
                    <div>
                      <p className={`text-base font-display font-black ${review.authorColor}`}>
                        {review.author}
                      </p>
                      <p className="text-xs font-semibold opacity-85 mt-0.5">
                        {review.role}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider bg-black/10 px-2.5 py-1 rounded-full">
                      <Star size={11} className="fill-current" />
                      <span>5.0</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Controls: Clean Previous / Next Arrow Buttons */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous review"
              className="h-12 w-12 rounded-full border-[3px] border-cocoa bg-white text-cocoa flex items-center justify-center shadow-pop-sm hover:bg-lemon transition-colors cursor-pointer active:scale-95"
            >
              <ChevronLeft size={22} strokeWidth={3} />
            </button>
            <span className="font-mono text-xs font-black text-cocoa-fade">
              {currentReview + 1} / {total}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next review"
              className="h-12 w-12 rounded-full border-[3px] border-cocoa bg-white text-cocoa flex items-center justify-center shadow-pop-sm hover:bg-lemon transition-colors cursor-pointer active:scale-95"
            >
              <ChevronRight size={22} strokeWidth={3} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

// ============================================================================
// 4. BULK & PARTY CATERING SECTION (Full Spaced View)
// ============================================================================
export function BulkPartyCateringSection() {
  const [submitted, setSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [pax, setPax] = useState('25');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="catering" className="relative min-h-[75vh] bg-cream py-20 sm:py-28 flex flex-col justify-center">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3">
          <span className="inline-block -rotate-1 rounded-full border-[3px] border-cocoa bg-tangerine px-4 py-1 text-xs font-black uppercase tracking-[0.25em] text-cocoa shadow-pop-sm">
            Bulk &amp; Weddings
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-cherry outline-text [text-stroke-width:0.5px]">
            Royal Dawat &amp; Bulk Handis
          </h2>
          <p className="text-sm sm:text-base font-bold text-cocoa-soft max-w-xl mx-auto">
            Traditional wedding degs prepared over slow charcoal embers. Directly confirmed by our central catering manager.
          </p>
        </div>

        <div className="mt-12 card-pop bg-white p-7 sm:p-10 rounded-3xl border-[3px] border-cocoa shadow-pop-lg">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <span className="h-14 w-14 rounded-full bg-lemon border-2 border-cocoa flex items-center justify-center text-cherry mx-auto shadow-pop-sm">
                <CheckCircle2 size={32} />
              </span>
              <h3 className="font-display text-2xl text-cherry">Inquiry Dispatched to Catering Team</h3>
              <p className="text-xs font-bold text-cocoa-soft max-w-md mx-auto leading-relaxed">
                Our central catering supervisor will call you at <strong className="text-cocoa">{contactPhone}</strong> within 30 minutes with our dawat deg price sheet and customized accompaniment options.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Asaduddin Khan"
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white focus:ring-2 focus:ring-lemon"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white focus:ring-2 focus:ring-lemon"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                    Number of Guests (Pax)
                  </label>
                  <select
                    value={pax}
                    onChange={(e) => setPax(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white"
                  >
                    <option value="15">15–20 Pax (Mini Deg)</option>
                    <option value="25">25–35 Pax (Standard Deg)</option>
                    <option value="50">50–60 Pax (Royal Dawat Deg)</option>
                    <option value="100">100+ Pax (Full Wedding Degs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                    Event Date (Min 4 hrs notice) *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="pill-btn w-full bg-cherry text-white text-sm sm:text-base !py-3.5 flex items-center justify-center gap-2 shadow-pop-sm hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <span>Request Instant Catering Call &bull; No Commission</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <p className="text-[11px] text-center font-bold text-cocoa-fade flex items-center justify-center gap-1.5 pt-1">
                <Phone size={13} className="text-cherry" />
                <span>Urgent bulk party inquiry? Call our direct hotline: <strong className="text-cocoa">+91 40 2300 1978</strong></span>
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}

// ============================================================================
// 5. PROFESSIONAL HIGH-END RESTAURANT FOOTER (No Separation Lines, Clean Luxury)
// ============================================================================
export function Footer() {
  const socials = [
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  ];

  return (
    <footer className="relative bg-[#1c120c] text-[#F7F2E7] pt-16 sm:pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand & Narrative Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-12 border-b border-white/10 gap-6">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-2xl bg-lemon text-cocoa flex items-center justify-center font-display text-2xl font-black shadow-sm">
              <UtensilsCrossed size={22} strokeWidth={2.5} />
            </span>
            <div>
              <p className="font-display text-2xl sm:text-3xl text-lemon tracking-wide">
                Nawaab's Biryani Co.
              </p>
              <p className="text-[10px] font-black tracking-[0.35em] text-cream/60 uppercase">
                ESTD. 1978 &bull; HYDERABAD, TELANGANA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="h-10 w-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-cream hover:bg-lemon hover:text-cocoa transition-all"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        {/* 4-Column Structured Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12 text-xs">
          
          {/* Column 1: Outlets Network */}
          <div className="space-y-3">
            <h4 className="font-display text-sm uppercase tracking-wider text-lemon">
              17 Hyderabad Outlets
            </h4>
            <p className="text-cream/70 leading-relaxed font-semibold">
              14 Flagship Dine-In Halls &amp; 3 Dark Kitchens across Kondapur, Jubilee Hills, Banjara Hills, Gachibowli, HITEC City, Charminar, Kukatpally, and Begumpet.
            </p>
            <p className="text-cream/50 text-[11px] font-mono">
              Central FSSAI: 13621014000412
            </p>
          </div>

          {/* Column 2: Direct Ordering Advantages */}
          <div className="space-y-3">
            <h4 className="font-display text-sm uppercase tracking-wider text-lemon">
              Direct Channel Guarantees
            </h4>
            <ul className="space-y-2 text-cream/80 font-semibold">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>Zero 27% Aggregator Commissions</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>100% Desi Ghee &amp; Saffron Handis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>All Prices Strictly Include 5% GST</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span>Live Kitchen Tablet Status Sync</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Timings & Operations */}
          <div className="space-y-3">
            <h4 className="font-display text-sm uppercase tracking-wider text-lemon">
              Hours of Operation
            </h4>
            <ul className="space-y-1.5 text-cream/70 font-semibold">
              {HOURS.map((h) => (
                <li key={h.days} className="flex justify-between">
                  <span>{h.days}</span>
                  <span className="text-lemon font-bold">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="text-cream/50 text-[11px] pt-1">
              Peak Dum Rush: 12:30–15:00 &amp; 19:30–22:30 IST
            </p>
          </div>

          {/* Column 4: Customer Support & Hotline */}
          <div className="space-y-3">
            <h4 className="font-display text-sm uppercase tracking-wider text-lemon">
              Concierge &amp; Dawat Hotline
            </h4>
            <p className="text-cream/80 font-semibold">
              For party inquiries, bulk orders, and corporate orders:
            </p>
            <p className="font-display text-lg text-white">
              +91 40 2300 1978
            </p>
            <p className="text-cream/50 text-[11px] font-mono">
              DPDP Act 2023 Compliant Data Vault
            </p>
          </div>

        </div>

        {/* Bottom Copyright & Compliance Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-semibold text-cream/50 gap-4">
          <p>
            &copy; 2026 Nawaab's Biryani Co. Hyderabad, Telangana. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>FSSAI Licensed</span>
            <span>&bull;</span>
            <span>DPDP Act 2023 Certified</span>
            <span>&bull;</span>
            <span>5% Inclusive GST</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
