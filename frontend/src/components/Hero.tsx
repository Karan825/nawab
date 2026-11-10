import React, { useState } from 'react';
import { ArrowRight, Sparkles, Star, UtensilsCrossed, ArrowUpRight } from 'lucide-react';
import { HERO_PHOTO } from '../data';

interface DishCard {
  index: number;
  title: string;
  tagline: string;
  description: string;
  price: number;
  badge: string;
  imageSrc: string;
  isDark?: boolean;
}

const HERO_DISHES: DishCard[] = [
  {
    index: 0,
    title: 'Nizami Mutton Biryani',
    tagline: 'Kachchi Dum Handi',
    description: 'Succulent baby goat chops marinated overnight in stone-ground spices and raw papaya, slow-cooked on smoldering embers.',
    price: 490,
    badge: 'Signature',
    imageSrc: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    isDark: true,
  },
  {
    index: 1,
    title: 'Dum Irani Chai & Osmania',
    tagline: 'Old City Classic',
    description: 'Layered mawa milk decoction brewed in copper samovars served with crisp salted Osmania bakery biscuits.',
    price: 45,
    badge: 'Café Classic',
    imageSrc: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  },
  {
    index: 2,
    title: 'Royal Chicken Dum Biryani',
    tagline: 'Sealed Dough Handi',
    description: 'Fresh farm chicken marinated in Nizami spices, layered with aged Kashmiri saffron basmati and 100% pure desi ghee.',
    price: 380,
    badge: 'Most Popular',
    imageSrc: HERO_PHOTO,
    isDark: true,
  },
  {
    index: 3,
    title: 'Shahi Veg Dum Biryani',
    tagline: 'Garden Fresh & Saffron',
    description: 'Paneer, baby potatoes, florets and French beans cooked in aromatic golden saffron basmati with rich fried onions.',
    price: 310,
    badge: 'Pure Veg',
    imageSrc: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },
  {
    index: 4,
    title: 'Double Ka Meetha',
    tagline: 'Royal Shahi Dessert',
    description: 'Crispy fried bread soaked in warm saffron-cardamom chasni, layered with rich thickened khoya rabdi and silver vark.',
    price: 140,
    badge: 'Sweet Finish',
    imageSrc: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=800&q=80',
  },
];

interface HeroProps {
  onStartOrder: () => void;
  isLoggedIn?: boolean;
}

export default function Hero({ onStartOrder, isLoggedIn = false }: HeroProps) {
  const [activeCard, setActiveCard] = useState<number>(2);

  return (
    <section id="top" className="relative w-full overflow-hidden bg-cream pt-24 sm:pt-28 pb-0">
      
      {/* 1. Hero Headline & Brand Story */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-4">
        
        {/* Heritage Tagline Badge */}
        <div className="flex items-center justify-center">
          <span className="inline-flex -rotate-1 items-center gap-2 rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-cocoa shadow-pop-sm">
            <Sparkles size={14} className="text-cherry fill-cherry" />
            <span>ESTD. 1978 &bull; HYDERABAD DUM BIRYANI</span>
          </span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[1.04] text-cherry outline-text [text-stroke-width:1px] tracking-tight">
          Dum <span className="inline-block -rotate-2 text-lemon">happens.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl font-bold text-cocoa-soft leading-relaxed">
          Slow-cooked brass handis sealed with dough, aged long-grain basmati infused with pure saffron, and secret Nizami spices. Hyderabad's royal feast cooked over slow coal embers.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onStartOrder}
            className="pill-btn bg-cherry text-white text-base sm:text-lg !py-4 !px-8 flex items-center justify-center gap-2.5 shadow-pop-md hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            <span>{isLoggedIn ? 'Go to Menu & Order' : 'Order Online (Save 15%)'}</span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>

          <a
            href="#heritage"
            className="pill-btn bg-white text-cocoa text-base sm:text-lg !py-4 !px-8 flex items-center justify-center gap-2 border-2 border-cocoa shadow-pop-md hover:bg-lemon transition-all w-full sm:w-auto"
          >
            <span>Our 1978 Heritage</span>
          </a>
        </div>

        {/* Verified Social Proof */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1 bg-white border-2 border-cocoa px-3.5 py-1.5 rounded-full shadow-pop-sm">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-500" />
              ))}
            </div>
            <span className="font-display text-sm text-cocoa ml-1">4.9 / 5.0</span>
          </div>
          <span className="text-xs font-bold text-cocoa-fade">
            18,400+ Verified Hyderabad Reviews Across 17 Stations
          </span>
        </div>

      </div>

      {/* 2. Interactive 5-Card Fanned Out Specialties Showcase */}
      <div className="relative pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-cocoa-fade block">
              Hover or tap a card to explore dishes
            </span>
          </div>

          <div className="flex items-center justify-center">
            <div className="cards-stage" title="Hover to fan out the handi dishes">
              {HERO_DISHES.map((dish) => {
                const isSelected = activeCard === dish.index;
                const isDark = dish.isDark;

                return (
                  <article
                    key={dish.index}
                    data-index={dish.index}
                    onClick={() => setActiveCard(dish.index)}
                    className={`stack-card flex flex-col justify-between border-[3px] border-cocoa transition-all ${
                      isDark
                        ? 'bg-cocoa text-cream'
                        : 'bg-white text-cocoa'
                    }`}
                  >
                    {/* Top Badge & Corner CTA */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-cocoa ${
                          isDark ? 'bg-lemon text-cocoa' : 'bg-aqua text-cocoa'
                        }`}
                      >
                        {dish.badge}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartOrder();
                        }}
                        className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-cocoa shadow-sm transition-transform hover:scale-105 ${
                          isDark ? 'bg-white text-cocoa' : 'bg-cherry text-white'
                        }`}
                      >
                        <span>Order</span>
                        <ArrowUpRight size={13} strokeWidth={3} />
                      </button>
                    </div>

                    {/* Dish Image */}
                    <div className="my-2 rounded-2xl overflow-hidden border-2 border-cocoa bg-cream-dark h-36 sm:h-44 w-full relative group">
                      <img
                        src={dish.imageSrc}
                        alt={dish.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 bg-cocoa/90 text-lemon px-2.5 py-0.5 rounded-lg border border-cocoa text-xs font-mono font-black backdrop-blur-sm">
                        ₹{dish.price}
                      </div>
                    </div>

                    {/* Dish Details */}
                    <div className="space-y-1">
                      <p className={`font-display text-lg sm:text-xl leading-tight truncate ${isDark ? 'text-lemon' : 'text-cherry'}`}>
                        {dish.title}
                      </p>
                      <p className={`text-[11px] font-bold line-clamp-2 leading-snug ${isDark ? 'text-cream/80' : 'text-cocoa-soft'}`}>
                        {dish.description}
                      </p>
                    </div>

                    {/* Bottom Status */}
                    <div className="pt-2 border-t border-cocoa/20 flex items-center justify-between text-[10px] font-bold">
                      <span className={isDark ? 'text-lemon' : 'text-cherry'}>
                        100% Desi Ghee
                      </span>
                      <span className={isDark ? 'text-cream/60' : 'text-cocoa-fade'}>
                        5% GST Incl.
                      </span>
                    </div>

                  </article>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
