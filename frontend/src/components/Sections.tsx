import React, { useState } from 'react';
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
  CookingPot
} from 'lucide-react';
import { HOURS } from '../data';

function SectionHeading({
  kicker,
  title,
  sub,
  kickerColor,
  titleColor,
}: {
  kicker: string;
  title: string;
  sub?: string;
  kickerColor: string;
  titleColor: string;
}) {
  return (
    <div className="text-center">
      <span
        className={`inline-block -rotate-1 rounded-full border-[3px] border-cocoa px-4 py-1 text-xs font-black uppercase tracking-[0.25em] shadow-pop-sm ${kickerColor}`}
      >
        {kicker}
      </span>
      <h2 className={`mt-4 font-display text-4xl outline-text sm:text-5xl ${titleColor}`}>{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-xl font-bold text-cocoa-soft text-sm sm:text-base">{sub}</p>}
    </div>
  );
}

// 1. Heritage Story Section
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
      title: 'Aged Basmati & Saffron',
      desc: '2-year aged long-grain basmati parboiled with royal whole spices (shahi jeera, cardamom, mace) and steeped in pure Kashmiri saffron milk.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Wheat Dough Handi Seal',
      desc: 'Heavy brass and clay handis layered with ghee, fried onions, and marinated meat, tightly sealed with kneaded dough (purdah) to trap internal steam.',
      icon: CookingPot,
    },
    {
      step: '04',
      title: '4-Hour Coal Ember Dum',
      desc: 'Handis are placed over slow coal embers with hot coals on the lid. The meat cooks in its own juices until it falls off the bone.',
      icon: Flame,
    },
  ];

  return (
    <section id="heritage" className="bg-cream py-16 sm:py-24 border-t-[3px] border-cocoa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Since 1978"
          title="The Ancient Art of Dum"
          sub="No pressure cookers. No artificial colors. Only authentic clay and brass handis sealed with dough over smoldering coals."
          kickerColor="bg-lemon"
          titleColor="text-cherry"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="card-pop bg-white p-6 rounded-3xl border-[3px] border-cocoa flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-2xl text-lemon bg-cocoa h-10 w-10 rounded-2xl flex items-center justify-center border-2 border-cocoa shadow-pop-sm">
                      {st.step}
                    </span>
                    <span className="h-10 w-10 rounded-2xl bg-lemon/50 border border-cocoa flex items-center justify-center text-cocoa">
                      <Icon size={20} />
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-cocoa leading-snug">{st.title}</h3>
                  <p className="mt-2 text-xs font-semibold text-cocoa-soft leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 2. Signature Dishes Showcase
export function SignatureSpecialtiesSection({ onOrderClick }: { onOrderClick: () => void }) {
  const specials = [
    {
      name: 'Royal Chicken Dum Biryani',
      desc: 'Kachhi dum layered with aged basmati, succulent chicken pieces, pure desi ghee, and saffron.',
      tag: 'Legendary Fave',
      photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      price: '₹380',
    },
    {
      name: 'Nizami Mutton Dum Biryani',
      desc: 'Prime cuts of tender baby goat slow-dummed for 4 hours with caramelized onions and whole spices.',
      tag: 'Royal Heritage',
      photo: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
      price: '₹490',
    },
    {
      name: 'Shahi Mutton Haleem',
      desc: '12-hour simmered shredded goat meat, broken wheat, pure ghee, and roasted cashews.',
      tag: 'Nizami Festival Dish',
      photo: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
      price: '₹350',
    },
    {
      name: 'Shahi Double Ka Meetha',
      desc: 'Crispy fried bread soaked in saffron cardamom milk, topped with rabri and toasted pistachios.',
      tag: 'Sweet Royalty',
      photo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      price: '₹160',
    },
  ];

  return (
    <section id="signatures" className="bg-cream py-16 sm:py-24 border-t-[3px] border-cocoa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="House Masterpieces"
          title="Signature Nizami Creations"
          sub="Dishes that have defined celebrations, weddings, and family feasts in Hyderabad for nearly five decades."
          kickerColor="bg-aqua"
          titleColor="text-hot-pink"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {specials.map((spec) => (
            <div
              key={spec.name}
              className="card-pop bg-white rounded-3xl border-[3px] border-cocoa overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 transition-transform"
            >
              <div>
                <div className="relative h-48 overflow-hidden border-b-[3px] border-cocoa">
                  <img
                    src={spec.photo}
                    alt={spec.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-lemon border-2 border-cocoa px-3 py-1 rounded-full text-[10px] font-black uppercase text-cocoa shadow-pop-sm">
                    {spec.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-white border-2 border-cocoa px-2.5 py-0.5 rounded-full text-xs font-display text-cherry shadow-pop-sm">
                    {spec.price}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg text-cocoa">{spec.name}</h3>
                  <p className="mt-1.5 text-xs font-semibold text-cocoa-soft line-clamp-3 leading-relaxed">
                    {spec.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={onOrderClick}
                  className="pill-btn w-full bg-lemon text-cocoa text-xs !py-2.5 flex items-center justify-center gap-1.5 shadow-pop-sm hover:bg-lemon-deep"
                >
                  <span>Order Direct</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onOrderClick}
            className="pill-btn bg-cherry text-white text-base !py-3.5 !px-8 shadow-pop-md hover:scale-105"
          >
            <span>View Full Ordering Menu &bull; 15% Direct Savings</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// 3. Why Order Direct
export function DirectOrderingBenefitsSection({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <section id="why-direct" className="bg-lemon py-16 sm:py-24 border-t-[3px] border-cocoa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="No Middlemen"
          title="Why Order Directly From Nawaab's?"
          sub="Delivery apps charge 25% to 30% commission on every order. When you order directly with us, you get fresher food and pass the savings back to your wallet."
          kickerColor="bg-cherry text-white"
          titleColor="text-cocoa"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="card-pop bg-white p-6 rounded-3xl border-[3px] border-cocoa space-y-3">
            <span className="h-12 w-12 rounded-2xl bg-lemon border-2 border-cocoa flex items-center justify-center text-cherry shadow-pop-sm">
              <Award size={24} />
            </span>
            <h3 className="font-display text-xl text-cherry">Save 15% on Every Meal</h3>
            <p className="text-xs font-semibold text-cocoa-soft leading-relaxed">
              No inflated food app menu prices or hidden service fees. You pay the authentic restaurant rate with all prices inclusive of 5% GST.
            </p>
          </div>

          <div className="card-pop bg-white p-6 rounded-3xl border-[3px] border-cocoa space-y-3">
            <span className="h-12 w-12 rounded-2xl bg-aqua border-2 border-cocoa flex items-center justify-center text-cocoa shadow-pop-sm">
              <Truck size={24} />
            </span>
            <h3 className="font-display text-xl text-cherry">Direct Station Dispatch</h3>
            <p className="text-xs font-semibold text-cocoa-soft leading-relaxed">
              Orders go directly to the kitchen display screen of the outlet closest to your house across our 17 Hyderabad locations. Less transit time, steaming hot handis.
            </p>
          </div>

          <div className="card-pop bg-white p-6 rounded-3xl border-[3px] border-cocoa space-y-3">
            <span className="h-12 w-12 rounded-2xl bg-cream border-2 border-cocoa flex items-center justify-center text-cocoa shadow-pop-sm">
              <Clock size={24} />
            </span>
            <h3 className="font-display text-xl text-cherry">Honest Promised Times</h3>
            <p className="text-xs font-semibold text-cocoa-soft leading-relaxed">
              AI kitchen-load estimation calculates your real preparation and dispatch schedule so you never have to guess when your biryani will arrive.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onOrderClick}
            className="pill-btn bg-cocoa text-lemon text-base !py-3.5 !px-8 shadow-pop-md hover:bg-cocoa-soft"
          >
            <span>Start Direct Order Now</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// 4. Bulk & Party Catering
export function BulkPartyCateringSection() {
  const [pax, setPax] = useState('25');
  const [date, setDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="catering" className="bg-cream py-16 sm:py-24 border-t-[3px] border-cocoa">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          kicker="Dawat &amp; Celebrations"
          title="Party &amp; Bulk Catering"
          sub="Planning a family wedding, birthday feast, or corporate celebration? Order authentic biryani degs (10 to 500 Pax) confirmed directly by our catering manager."
          kickerColor="bg-tangerine"
          titleColor="text-cherry"
        />

        <div className="mt-12 card-pop bg-white p-6 sm:p-8 rounded-3xl border-[3px] border-cocoa">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <span className="h-14 w-14 rounded-full bg-lemon border-2 border-cocoa flex items-center justify-center text-cherry mx-auto shadow-pop-sm">
                <CheckCircle2 size={32} />
              </span>
              <h3 className="font-display text-2xl text-cherry">Inquiry Received</h3>
              <p className="text-xs font-semibold text-cocoa-soft max-w-md mx-auto">
                Our central catering manager will call you at <strong className="text-cocoa">{contactPhone}</strong> within 30 minutes with our dawat deg quote and custom dessert packages.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Asaduddin Khan"
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-cocoa-fade mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-cocoa bg-cream outline-none focus:bg-white"
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
                    Event Date (Min 4 hrs notice)
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
                  className="pill-btn w-full bg-cherry text-white text-sm sm:text-base !py-3.5 flex items-center justify-center gap-2 shadow-pop-sm hover:scale-[1.01]"
                >
                  <span>Request Catering Call &bull; Instant Confirmation</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <p className="text-[11px] text-center font-bold text-cocoa-fade flex items-center justify-center gap-1.5 pt-1">
                <Phone size={13} className="text-cherry" />
                <span>Urgent bulk orders? Call our direct catering hotline: <strong className="text-cocoa">+91 40 2300 1978</strong></span>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function PopularStrip() {
  return (
    <div className="border-y-[3px] border-cocoa bg-tangerine py-4 shadow-[0_4px_0_0_#3A2318]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-4 px-4 text-center">
        <div className="flex items-center gap-2 text-cocoa font-display text-sm sm:text-base uppercase tracking-wider">
          <Flame size={18} className="text-cherry" />
          <span>Slow Dum Coal Cooking</span>
        </div>
        <div className="flex items-center gap-2 text-cocoa font-display text-sm sm:text-base uppercase tracking-wider">
          <Award size={18} className="text-cherry" />
          <span>100% Pure Desi Ghee</span>
        </div>
        <div className="flex items-center gap-2 text-cocoa font-display text-sm sm:text-base uppercase tracking-wider">
          <FileText size={18} className="text-cherry" />
          <span>All Prices Include 5% GST</span>
        </div>
        <div className="flex items-center gap-2 text-cocoa font-display text-sm sm:text-base uppercase tracking-wider">
          <Truck size={18} className="text-cherry" />
          <span>Direct Kitchen Dispatch</span>
        </div>
      </div>
    </div>
  );
}

export function Divider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`h-6 w-full border-y-[3px] border-cocoa ${
        flip ? 'checkerboard-lemon' : 'checkerboard'
      }`}
    />
  );
}

export function Footer() {
  const socials = [
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  ];

  return (
    <footer className="relative bg-cocoa pt-12 text-cream border-t-[3px] border-cocoa">
      <div aria-hidden="true" className="checkerboard h-4 w-full border-y-[3px] border-cocoa opacity-90" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] border-lemon bg-lemon text-cocoa shadow-pop-sm">
              <UtensilsCrossed size={22} strokeWidth={2.5} />
            </span>
            <div className="leading-none">
              <p className="font-display text-2xl text-lemon">Nawaab's</p>
              <p className="mt-1 text-[10px] font-extrabold tracking-[0.4em] text-cream/60 uppercase">BIRYANI CO.</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm font-semibold text-cream/75">
            Authentic Hyderabad Dum Biryani cooked with aged basmati, pure saffron, and desi ghee. Direct kitchen dispatch across 17 outlets.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-cream/30 bg-cocoa-soft text-cream transition-all hover:-translate-y-0.5 hover:border-lemon hover:text-lemon"
              >
                <Icon size={19} strokeWidth={2.5} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg text-tangerine">Outlet Operations</h3>
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            {HOURS.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span className="text-cream/75">{h.days}</span>
                <span className="font-extrabold text-lemon">{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-cream/60 mt-4 font-mono">
            FSSAI Lic: 23619028374901 (Central)
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg text-hot-pink">Customer Care &amp; Orders</h3>
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            <li>
              <a href="#signatures" className="text-cream/85 transition-colors hover:text-lemon">
                Signature Specials
              </a>
            </li>
            <li>
              <a href="#heritage" className="text-cream/85 transition-colors hover:text-lemon">
                Ancient Dum Technique
              </a>
            </li>
            <li>
              <a href="#catering" className="text-cream/85 transition-colors hover:text-lemon">
                Bulk &amp; Party Catering: +91 40 2300 1978
              </a>
            </li>
            <li>
              <span className="text-cream/65 text-xs">
                DPDP Act 2023 Compliant &bull; 5% GST Included
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15 py-5 text-center text-sm font-bold text-cream/60">
        <p className="font-display text-base text-cream/85">Dum happens. Since 1978.</p>
        <p className="mt-1">&copy; 2026 Nawaab's Biryani Co. All rights reserved. Menu prices are inclusive of 5% GST.</p>
      </div>
    </footer>
  );
}
