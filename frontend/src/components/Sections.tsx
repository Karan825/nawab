import { OUTLETS, type Outlet, HOURS } from '../data';
import { Clock, MapPin, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';

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

export function FindUs({
  selectedOutlet,
  onSelectOutlet,
}: {
  selectedOutlet: Outlet;
  onSelectOutlet: (o: Outlet) => void;
}) {
  return (
    <section id="outlets" className="bg-cream py-16 sm:py-24 border-t-[3px] border-cocoa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="17 Outlets Chain"
          title="Direct Delivery Outlets"
          sub="Orders route directly to the kitchen display screen of the outlet closest to your delivery address."
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
                      ● Live KDS
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
                      FSSAI Lic: {outlet.fssaiLicense}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectOutlet(outlet)}
                  className={`pill-btn w-full mt-6 text-xs !py-3 ${
                    isSelected ? 'bg-cherry text-white' : 'bg-white text-cocoa border-cocoa'
                  }`}
                >
                  {isSelected ? '✓ Currently Selected' : 'Order From This Kitchen'}
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
            Slow Dum Coal Cooking
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
            All Prices Include 5% GST
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
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-lemon bg-lemon text-2xl shadow-[3px_3px_0_0_#FF4FA3]">
              🍗
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
          <h3 className="font-display text-lg text-hot-pink">Internal Portals</h3>
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            <li>
              <a href="/kds" className="text-lemon font-bold transition-colors hover:underline">
                🍳 Kitchen Display System (KDS)
              </a>
            </li>
            <li>
              <a href="/admin" className="text-aqua font-bold transition-colors hover:underline">
                ⚙️ Central Menu Admin CMS
              </a>
            </li>
            <li>
              <a href="#menu" className="text-cream/75 transition-colors hover:text-lemon">
                Menu Lineup
              </a>
            </li>
            <li>
              <a href="#outlets" className="text-cream/75 transition-colors hover:text-lemon">
                Hyderabad Outlets
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15 py-5 text-center text-sm font-bold text-cream/60">
        <p className="font-display text-base text-cream/85">Dum happens. Since 1978.</p>
        <p className="mt-1">© 2026 Nawaab's Biryani Co. All rights reserved. Menu prices are inclusive of 5% GST.</p>
      </div>
    </footer>
  );
}
