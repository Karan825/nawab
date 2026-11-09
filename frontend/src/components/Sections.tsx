import { DISHES, SNACKS, MERCH, INSTAGRAM_POSTS, HOURS } from '../data';
import type { Dish, Snack, MerchItem, InstagramPost } from '../data';
import { Clock, MapPin, Phone, Instagram, Facebook, Twitter, Heart } from 'lucide-react';
import type { ReactNode } from 'react';

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
        className={`inline-block -rotate-1 rounded-full border-[3px] border-cocoa px-4 py-1 text-xs font-extrabold uppercase tracking-[0.25em] shadow-pop-sm ${kickerColor}`}
      >
        {kicker}
      </span>
      <h2 className={`mt-4 font-display text-4xl outline-text sm:text-5xl ${titleColor}`}>{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-lg font-semibold text-cocoa-soft">{sub}</p>}
    </div>
  );
}

function SnackCard({ snack }: { snack: Snack }) {
  return (
    <article className="card-pop flex flex-col hover:-translate-y-1.5 hover:shadow-pop-lg">
      <img
        src={snack.photo}
        alt={snack.name}
        loading="lazy"
        className="h-44 w-full border-b-[3px] border-cocoa object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg text-cocoa">
            <span className="mr-1.5" aria-hidden="true">
              {snack.emoji}
            </span>
            {snack.name}
          </h3>
          <span className="shrink-0 rounded-full border-2 border-cocoa bg-lemon px-2.5 py-0.5 text-sm font-extrabold">
            ₹{snack.price}
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-cocoa-soft">{snack.description}</p>
      </div>
    </article>
  );
}

function MerchCard({ item }: { item: MerchItem }) {
  return (
    <article className="card-pop group flex flex-col hover:-translate-y-1.5 hover:shadow-pop-lg">
      <div className="relative overflow-hidden">
        <img
          src={item.photo}
          alt={item.name}
          loading="lazy"
          className="h-52 w-full border-b-[3px] border-cocoa object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rotate-6 rounded-full border-[3px] border-cocoa bg-hot-pink px-3 py-1 font-display text-sm text-white shadow-pop-sm">
          {item.price}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg text-cocoa">{item.name}</h3>
        <p className="mt-2 text-sm font-semibold text-cocoa-soft">{item.description}</p>
        <span className="mt-4 inline-flex w-fit items-center rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider shadow-pop-sm transition-transform group-hover:scale-105">
          See how it works
        </span>
      </div>
    </article>
  );
}

function IgPost({ post }: { post: InstagramPost }) {
  return (
    <a
      href="https://instagram.com"
      target="_blank"
      rel="noreferrer"
      className="group relative block overflow-hidden rounded-2xl border-[3px] border-cocoa shadow-pop-sm"
    >
      <img
        src={post.photo}
        alt={post.caption}
        loading="lazy"
        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-cocoa/0 p-3 opacity-0 transition-all duration-200 group-hover:bg-cocoa/60 group-hover:opacity-100">
        <p className="text-sm font-bold text-white">{post.caption}</p>
        <p className="mt-1 flex items-center gap-1 text-xs font-extrabold text-lemon">
          <Heart size={12} className="fill-lemon" /> {post.likes.toLocaleString()}
        </p>
      </div>
    </a>
  );
}

export function Snacks() {
  return (
    <section id="snacks" className="bg-cream-dark py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Sides & chai"
          title="A Feast Needs Extras"
          sub="The perfect supporting cast for a handi that arrives hot."
          kickerColor="bg-tangerine"
          titleColor="text-cherry"
        />
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {SNACKS.map((s) => (
            <SnackCard key={s.id} snack={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Merch() {
  return (
    <section id="merch" className="relative bg-lemon py-16 sm:py-24">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-4 checkerboard-pink border-b-[3px] border-cocoa" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-4 checkerboard-pink border-t-[3px] border-cocoa" />
      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <SectionHeading
          kicker="Kitchen display system"
          title="From Payment To Pass"
          sub="A single direct-order journey keeps the customer, outlet, and rider in sync."
          kickerColor="bg-cocoa text-lemon"
          titleColor="text-cocoa"
        />
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {MERCH.map((m) => (
            <MerchCard key={m.id} item={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FindUs() {
  return (
    <section id="find-us" className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Nearest kitchen wins"
          title="Find Your Outlet"
          sub="We match your address to the closest serviceable outlet before you order."
          kickerColor="bg-aqua"
          titleColor="text-cherry"
        />
        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-2">
          {/* retro map */}
          <div className="card-pop relative min-h-[320px] bg-aqua-soft">
            <div className="absolute inset-0 overflow-hidden rounded-[21px]">
              <svg viewBox="0 0 400 320" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
                <rect width="400" height="320" fill="#D2F3F3" />
                <rect x="0" y="0" width="400" height="90" fill="#A8E6A3" />
                <path d="M0 90 Q100 70 200 90 T400 90 L400 110 Q300 130 200 110 T0 110 Z" fill="#8FD98F" />
                {/* roads */}
                <path d="M-10 200 L410 160" stroke="#FFF4E2" strokeWidth="34" />
                <path d="M-10 200 L410 160" stroke="#3A2318" strokeWidth="2" strokeDasharray="14 12" />
                <path d="M120 -10 L180 330" stroke="#FFF4E2" strokeWidth="26" />
                <path d="M120 -10 L180 330" stroke="#3A2318" strokeWidth="2" strokeDasharray="12 10" />
                {/* buildings */}
                <rect x="220" y="30" width="70" height="46" rx="8" fill="#FF9A3C" stroke="#3A2318" strokeWidth="3" />
                <rect x="300" y="150" width="80" height="60" rx="8" fill="#FF4FA3" stroke="#3A2318" strokeWidth="3" />
                <rect x="30" y="240" width="60" height="50" rx="8" fill="#FFD93D" stroke="#3A2318" strokeWidth="3" />
                <rect x="250" y="240" width="90" height="55" rx="8" fill="#38C6C6" stroke="#3A2318" strokeWidth="3" />
                {/* pin */}
                <g transform="translate(200,175)">
                  <circle cx="0" cy="-52" r="16" fill="#E8333A" stroke="#3A2318" strokeWidth="3" />
                  <circle cx="0" cy="-52" r="6" fill="#FFF4E2" />
                  <path d="M-9 -42 L0 -14 L9 -42 Z" fill="#E8333A" stroke="#3A2318" strokeWidth="3" strokeLinejoin="round" />
                </g>
                <text x="200" y="228" textAnchor="middle" fontFamily="cursive" fontWeight="bold" fontSize="14" fill="#3A2318">
                  Hyderabad service map
                </text>
              </svg>
            </div>
            <span className="absolute bottom-4 left-4 rounded-full border-2 border-cocoa bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-cocoa-fade">
              14 outlets + 3 cloud kitchens
            </span>
          </div>

          {/* info card */}
          <div className="card-pop flex flex-col justify-between bg-cocoa p-7 text-cream sm:p-9">
            <div>
              <h3 className="font-display text-2xl text-lemon sm:text-3xl">Kondapur Flagship</h3>
              <ul className="mt-5 space-y-4 text-base font-semibold">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-hot-pink" strokeWidth={2.5} />
                  <span>
                    Plot 42, Main Road, near Botanical Gardens
                    <br />
                    Kondapur, Hyderabad 500084
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={20} className="mt-0.5 shrink-0 text-tangerine" strokeWidth={2.5} />
                  <span>+91 40 4000 0171</span>
                </li>
              </ul>
              <div className="mt-6 rounded-2xl border-2 border-cream/25 bg-cocoa-soft/60 p-4">
                <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-aqua">
                  <Clock size={16} strokeWidth={2.5} /> Hours
                </p>
                <ul className="mt-3 space-y-1.5 text-sm font-semibold">
                  {HOURS.map((h) => (
                    <li key={h.days} className="flex justify-between gap-4">
                      <span className="text-cream/85">{h.days}</span>
                      <span className="font-extrabold text-lemon">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <a href="#top" className="pill-btn mt-7 bg-hot-pink text-white w-fit">
              Choose this outlet
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InstagramWall() {
  return (
    <section className="bg-cherry py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex rotate-1 items-center gap-2 rounded-full border-[3px] border-cocoa bg-white px-4 py-1.5 text-sm font-extrabold shadow-pop-sm">
            <Instagram size={16} strokeWidth={2.5} className="text-hot-pink" /> @nawaabsbiryani
          </span>
          <h2 className="mt-4 font-display text-4xl text-white outline-text sm:text-5xl">
            The Dum Diary
          </h2>
          <p className="mx-auto mt-3 max-w-md font-semibold text-cream/90">
            From a fragrant handi to the first spoonful—made for Hyderabad’s food stories.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {INSTAGRAM_POSTS.map((p) => (
            <IgPost key={p.id} post={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="pill-btn bg-lemon text-cocoa"
          >
            Follow @nawaabsbiryani
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const socials = [
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  ];
  return (
    <footer className="relative bg-cocoa pt-12 text-cream">
      <div aria-hidden="true" className="checkerboard h-4 w-full border-y-[3px] border-cocoa opacity-90" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-lemon bg-lemon text-2xl shadow-[3px_3px_0_0_#FF4FA3]">
              🍛
            </span>
            <div className="leading-none">
              <p className="font-display text-2xl text-lemon">Nawaab’s Biryani</p>
              <p className="mt-1 text-[10px] font-extrabold tracking-[0.4em] text-cream/60">HYDERABAD</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm font-semibold text-cream/75">
            Direct ordering for handi-sealed Hyderabadi food, with clear kitchen updates from 17 locations.
          </p>
          <p className="mt-3 max-w-xs rounded-xl border border-lemon/30 bg-white/10 p-2 text-[11px] font-bold text-lemon">
            FSSAI Lic. 23619028374901 · Menu prices are inclusive of 5% GST.
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
          <h3 className="font-display text-lg text-tangerine">Hours</h3>
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            {HOURS.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span className="text-cream/75">{h.days}</span>
                <span className="font-extrabold text-lemon">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg text-hot-pink">The Good Stuff</h3>
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            {(
              [
                ['Menu', '#menu'],
                ['Build a Handi', '#builder'],
                ['Extras', '#snacks'],
                ['Kitchen updates', '#merch'],
                ['Outlets', '#find-us'],
              ] as [string, string][]
            ).map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-cream/75 transition-colors hover:text-lemon">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15 py-5 text-center text-sm font-bold text-cream/60">
        <p className="font-display text-base text-cream/85">Dum happens. Since 1978.</p>
        <p className="mt-1">© 2026 Nawaab’s Biryani. All prices include 5% GST.</p>
      </div>
    </footer>
  );
}

export function PopularStrip() {
  const popular: Dish[] = DISHES.slice(0, 3);
  return (
    <section className="bg-cream py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="card-pop flex flex-col items-center gap-6 bg-lemon p-7 sm:flex-row sm:justify-between sm:p-9">
          <div>
            <h2 className="font-display text-3xl text-cocoa sm:text-4xl">First order?</h2>
            <p className="mt-2 max-w-md font-semibold text-cocoa-soft">
              Start with our most-loved handis—then add raita, salan, and dessert your way.
            </p>
          </div>
          <div className="flex -space-x-4">
            {popular.map((d, i) => (
              <img
                key={d.id}
                src={d.photo}
                alt={d.name}
                loading="lazy"
                className="h-20 w-20 rounded-full border-[3px] border-cocoa object-cover shadow-pop-sm transition-transform hover:-translate-y-1"
                style={{ zIndex: 3 - i }}
              />
            ))}
          </div>
          <a href="#menu" className="pill-btn whitespace-nowrap bg-cherry text-white">
            Choose your feast
          </a>
        </div>
      </div>
    </section>
  );
}

export function Divider({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden="true" className={flip ? 'rotate-180' : ''}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-[44px] w-full fill-cream-dark">
        <path d="M0,30 C120,55 240,5 360,30 C480,55 600,5 720,30 C840,55 960,5 1080,30 C1200,55 1320,5 1440,30 L1440,60 L0,60 Z" />
      </svg>
    </div>
  );
}

export function Testimonial({ children, name }: { children: ReactNode; name: string }) {
  return (
    <figure className="card-pop bg-white p-6">
      <blockquote className="text-sm font-semibold italic text-cocoa-soft">“{children}”</blockquote>
      <figcaption className="mt-3 text-xs font-extrabold uppercase tracking-widest text-cocoa-fade">
        — {name}
      </figcaption>
    </figure>
  );
}
