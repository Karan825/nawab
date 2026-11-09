import { Link } from 'react-router-dom';
import { SNACKS, MERCH, INSTAGRAM_POSTS, OUTLETS, Outlet } from '../data';
import type { Snack, MerchItem, InstagramPost } from '../data';
import { Clock, MapPin, Instagram, Facebook, Twitter, Heart, ChefHat, ShieldCheck } from 'lucide-react';

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
        className={`inline-block -rotate-1 rounded-full border-[3px] border-cocoa px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.25em] shadow-pop-sm ${kickerColor}`}
      >
        {kicker}
      </span>
      <h2 className={`mt-4 font-display text-4xl outline-text sm:text-5xl ${titleColor}`}>{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-lg font-semibold text-cocoa-soft text-base">{sub}</p>}
    </div>
  );
}

function SnackCard({ snack, onAdd }: { snack: Snack; onAdd: () => void }) {
  return (
    <article className="card-pop flex flex-col hover:-translate-y-1.5 hover:shadow-pop-lg transition-transform bg-white overflow-hidden rounded-3xl">
      <img
        src={snack.photo}
        alt={snack.name}
        loading="lazy"
        className="h-48 w-full border-b-[3px] border-cocoa object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg text-cocoa">
            <span className="mr-1.5" aria-hidden="true">
              {snack.emoji}
            </span>
            {snack.name}
          </h3>
          <span className="shrink-0 rounded-full border-2 border-cocoa bg-lemon px-3 py-1 text-sm font-extrabold text-cocoa shadow-pop-sm">
            ₹{snack.price}
          </span>
        </div>
        <p className="mt-2 text-xs font-semibold text-cocoa-soft leading-relaxed">{snack.description}</p>
        <button
          onClick={onAdd}
          className="mt-4 inline-flex w-fit items-center rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider shadow-pop-sm hover:bg-lemon-deep transition-transform"
        >
          Add to Feast
        </button>
      </div>
    </article>
  );
}

function MerchCard({ item, onAdd }: { item: MerchItem; onAdd: () => void }) {
  return (
    <article className="card-pop group flex flex-col hover:-translate-y-1.5 hover:shadow-pop-lg transition-transform bg-white overflow-hidden rounded-3xl">
      <div className="relative overflow-hidden">
        <img
          src={item.photo}
          alt={item.name}
          loading="lazy"
          className="h-52 w-full border-b-[3px] border-cocoa object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rotate-6 rounded-full border-[3px] border-cocoa bg-hot-pink px-3.5 py-1 font-display text-sm text-white shadow-pop-sm">
          ₹{item.price}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg text-cocoa">{item.name}</h3>
        <p className="mt-2 text-xs font-semibold text-cocoa-soft leading-relaxed">{item.description}</p>
        <button
          onClick={onAdd}
          className="mt-4 inline-flex w-fit items-center rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider shadow-pop-sm transition-transform group-hover:scale-105"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

function IgPost({ post }: { post: InstagramPost }) {
  return (
    <div className="group relative block overflow-hidden rounded-2xl border-[3px] border-cocoa shadow-pop-sm">
      <img
        src={post.photo}
        alt={post.caption}
        loading="lazy"
        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-cocoa/0 p-3 opacity-0 transition-all duration-200 group-hover:bg-cocoa/75 group-hover:opacity-100">
        <p className="text-xs font-bold text-white">{post.caption}</p>
        <p className="mt-1 flex items-center gap-1 text-xs font-extrabold text-lemon">
          <Heart size={14} fill="#FFD93D" stroke="#3A2318" /> {post.likes}
        </p>
      </div>
    </div>
  );
}

export function Snacks({ onAddSnack }: { onAddSnack: (s: Snack) => void }) {
  return (
    <section id="starters" className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Hyderabadi Appetizers"
          title="Shahi Starters & Snacks"
          sub="Crispy luqmi, fried cut mirchi bajji, and freshly baked Osmania biscuits to kick off your feast."
          kickerColor="bg-tangerine"
          titleColor="text-cherry"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SNACKS.map((snack) => (
            <SnackCard key={snack.id} snack={snack} onAdd={() => onAddSnack(snack)} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Merch({ onAddMerch }: { onAddMerch: (m: MerchItem) => void }) {
  return (
    <section id="desserts" className="bg-cream-dark py-16 sm:py-24 border-y-[3px] border-cocoa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Heirloom Sweets & Ghee"
          title="Royal Pantry Hampers"
          sub="Take the authentic flavors of Hyderabad home: pure buffalo desi ghee, brass glasses, and glazed handis."
          kickerColor="bg-lemon"
          titleColor="text-cherry"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MERCH.map((item) => (
            <MerchCard key={item.id} item={item} onAdd={() => onAddMerch(item)} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FindUs({
  selectedOutlet,
  onSelectOutlet,
}: {
  selectedOutlet: Outlet;
  onSelectOutlet: (o: Outlet) => void;
}) {
  return (
    <section id="find-us" className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="17 Outlets Chain"
          title="Our Hyderabad Outlets"
          sub="Direct dispatch within delivery radius. Hot, sealed handis straight from the nearest dum station."
          kickerColor="bg-aqua"
          titleColor="text-cherry"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {OUTLETS.map((outlet) => {
            const isSelected = selectedOutlet.id === outlet.id;

            return (
              <div
                key={outlet.id}
                className={`card-pop p-6 flex flex-col justify-between transition-all rounded-3xl ${
                  isSelected
                    ? 'border-cocoa bg-lemon shadow-pop-lg -translate-y-1'
                    : 'border-cocoa bg-white hover:border-cocoa'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-cocoa px-2.5 py-0.5 rounded-full text-cocoa">
                      {outlet.type === 'CLOUD_KITCHEN' ? 'Cloud Kitchen' : 'Flagship Dine-In'}
                    </span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      ● Active
                    </span>
                  </div>

                  <h3 className="font-display text-xl text-cocoa">{outlet.name}</h3>

                  <p className="text-xs font-semibold text-cocoa-soft flex items-start gap-1.5 leading-relaxed">
                    <MapPin size={16} className="text-cherry shrink-0 mt-0.5" />
                    <span>{outlet.address}</span>
                  </p>

                  <div className="pt-3 border-t border-dashed border-cocoa/20 text-xs font-bold text-cocoa space-y-1.5">
                    <p className="flex items-center gap-1.5">
                      <Clock size={14} className="text-cocoa-fade" />
                      <span>{outlet.openingHours}</span>
                    </p>
                    <p className="text-cherry font-black">
                      Delivery Radius: {outlet.deliveryRadiusKm} km &bull; Min Prep: {outlet.minPrepTimeMinutes}m
                    </p>
                    <p className="text-[11px] text-cocoa-fade font-mono">
                      FSSAI Lic: {outlet.fssaiLicense} (Demo)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectOutlet(outlet)}
                  className={`pill-btn w-full mt-6 text-xs !py-3 ${
                    isSelected ? 'bg-cherry text-white' : 'bg-white text-cocoa border-cocoa'
                  }`}
                >
                  {isSelected ? '✓ Currently Selected' : 'Order From This Station'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PopularStrip() {
  return (
    <div className="border-y-[3px] border-cocoa bg-tangerine py-4 shadow-[0_4px_0_0_#3A2318]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-4 px-4 text-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-display text-sm uppercase tracking-wider text-cocoa sm:text-base">
            Slow Dum Sealed Handis
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧈</span>
          <span className="font-display text-sm uppercase tracking-wider text-cocoa sm:text-base">
            100% Pure Desi Ghee
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📜</span>
          <span className="font-display text-sm uppercase tracking-wider text-cocoa sm:text-base">
            Prices Include 5% GST
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="font-display text-sm uppercase tracking-wider text-cocoa sm:text-base">
            Direct Kitchen Dispatch
          </span>
        </div>
      </div>
    </div>
  );
}

export function InstagramWall() {
  return (
    <section className="bg-cream-dark py-16 sm:py-24 border-t-[3px] border-cocoa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="From Our Handis"
          title="#NawaabsBiryani"
          sub="Tag us in your feast photos for a chance to win a free Family Pack Handi!"
          kickerColor="bg-lemon"
          titleColor="text-cherry"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {INSTAGRAM_POSTS.map((post) => (
            <IgPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
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
  return (
    <footer className="border-t-[3px] border-cocoa bg-cream py-14 text-cocoa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="font-display text-2xl text-cherry outline-text [text-stroke-width:0.5px]">
              Nawaab's Biryani Co.
            </h4>
            <p className="mt-2 text-xs font-bold text-cocoa-soft leading-relaxed">
              Direct online ordering &amp; Kitchen Display System for 17 Hyderabad locations. Authentic Kachhi Dum biryani since 1978.
            </p>
            <p className="mt-3 text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
              📋 All prices shown are inclusive of 5% GST.
            </p>
          </div>

          <div>
            <h5 className="font-display text-base text-cocoa">Hyderabad Stations</h5>
            <ul className="mt-2 space-y-1 text-xs font-bold text-cocoa-soft">
              <li>&bull; Kondapur Flagship Dine-In</li>
              <li>&bull; Gachibowli Cloud Kitchen</li>
              <li>&bull; Kukatpally Express Kitchen</li>
              <li>&bull; + 14 more locations across city</li>
            </ul>
          </div>

          <div>
            <h5 className="font-display text-base text-cocoa">Compliance &amp; FSSAI</h5>
            <ul className="mt-2 space-y-1 text-xs font-bold text-cocoa-soft">
              <li>FSSAI Lic: 23619028374901 (Demo)</li>
              <li>GSTIN: 36AAACN1234F1Z5</li>
              <li>Zero real customer data stored</li>
              <li>Simulated payments sandbox</li>
            </ul>
          </div>

          <div>
            <h5 className="font-display text-base text-cocoa">Internal Staff Portals</h5>
            <div className="mt-2 space-y-2">
              <Link
                to="/kds"
                className="inline-flex items-center gap-1.5 text-xs font-black text-cocoa bg-lemon border-2 border-cocoa px-3 py-1.5 rounded-xl shadow-pop-sm hover:bg-lemon-deep transition-all"
              >
                <ChefHat size={15} />
                <span>Open Kitchen Tablet (KDS)</span>
              </Link>
              <br />
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-black text-cocoa bg-aqua border-2 border-cocoa px-3 py-1.5 rounded-xl shadow-pop-sm hover:bg-aqua-deep transition-all"
              >
                <ShieldCheck size={15} />
                <span>Open Admin Menu CMS</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-dashed border-cocoa/20 pt-6 text-center text-xs font-bold text-cocoa-fade">
          &copy; {new Date().getFullYear()} Nawaab's Biryani Co. All rights reserved. Direct Kitchen Ordering Platform &bull; Built with React, TypeScript &amp; FastAPI.
        </div>
      </div>
    </footer>
  );
}
