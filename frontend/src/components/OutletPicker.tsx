import { Check, Clock3, MapPin, Navigation, Store } from 'lucide-react';
import type { Outlet } from '../data';

interface OutletPickerProps {
  isOpen: boolean;
  outlets: Outlet[];
  selectedOutlet: Outlet;
  onSelect: (outlet: Outlet) => void;
}

export default function OutletPicker({ isOpen, outlets, selectedOutlet, onSelect }: OutletPickerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-cream px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] shadow-pop-sm">
            <Navigation size={14} /> Step 1 of your order
          </span>
          <h1 className="mt-5 font-display text-5xl text-cherry outline-text sm:text-6xl">Choose your kitchen</h1>
          <p className="mx-auto mt-4 max-w-xl font-semibold text-cocoa-soft">
            Your order is routed to one serviceable outlet. Pick the location closest to your delivery address.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-3" aria-label="Available Hyderabad outlets">
          {outlets.map((outlet) => {
            const isSelected = outlet.id === selectedOutlet.id;
            return (
              <article
                key={outlet.id}
                className={`card-pop flex flex-col p-6 ${isSelected ? 'bg-lemon ring-4 ring-tangerine/40' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-cocoa bg-tangerine text-cocoa shadow-pop-sm">
                    <Store size={20} />
                  </span>
                  <span className={`rounded-full border-2 border-cocoa px-2.5 py-1 text-[10px] font-black ${outlet.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-cherry-soft text-cherry'}`}>
                    {outlet.isOpen ? '● OPEN NOW' : '● CLOSED'}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-2xl leading-tight text-cocoa">{outlet.name}</h2>
                <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-cocoa-soft">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-cherry" /> {outlet.address}, Hyderabad
                </p>
                <div className="mt-5 space-y-2 border-y-2 border-dashed border-cocoa/20 py-4 text-xs font-bold text-cocoa-soft">
                  <p className="flex items-center gap-2"><Navigation size={15} className="text-cherry" /> Delivery radius: {outlet.deliveryRadiusKm} km</p>
                  <p className="flex items-center gap-2"><Clock3 size={15} className="text-cherry" /> Kitchen promise: from {outlet.minPrepTimeMinutes} min</p>
                </div>
                <button
                  type="button"
                  disabled={!outlet.isOpen}
                  onClick={() => onSelect(outlet)}
                  className={`pill-btn mt-6 w-full text-sm ${isSelected ? 'bg-cherry text-white' : 'bg-aqua text-cocoa'} disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {isSelected ? <><Check size={16} /> Deliver from here</> : 'Select this outlet'}
                </button>
                <p className="mt-4 text-center text-[10px] font-bold text-cocoa-fade">FSSAI Lic. {outlet.fssaiLicense}</p>
              </article>
            );
          })}
        </section>

        <p className="mx-auto mt-8 max-w-2xl rounded-2xl border-2 border-cocoa bg-white p-4 text-center text-xs font-bold text-cocoa-soft shadow-pop-sm">
          One cart belongs to one outlet. Changing kitchens later will clear your current cart so availability and prep time remain accurate.
        </p>
      </main>
    </div>
  );
}
