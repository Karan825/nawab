import { useMemo, useState } from 'react';
import { Check, PartyPopper, RotateCcw } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  price: number;
  color: string;
}

const BASES: Option[] = [
  { id: 'chicken', label: 'Kachhi Marinated Chicken', price: 380, color: '#E5A94A' },
  { id: 'mutton', label: 'Royal Nizami Mutton', price: 490, color: '#A64B32' },
  { id: 'veg', label: 'Subz Malai Paneer', price: 290, color: '#7FA84A' },
  { id: 'egg', label: 'Spiced Farm Egg Dum', price: 260, color: '#E1A83D' },
];

const SYRUPS: Option[] = [
  { id: 'saffron', label: 'Extra saffron masala', price: 50, color: '#E78C12' },
  { id: 'onion', label: 'Double crispy birista', price: 35, color: '#7E421F' },
  { id: 'mint', label: 'Fresh mint layer', price: 20, color: '#517C36' },
  { id: 'ghee', label: 'Pure desi ghee tadka', price: 40, color: '#F4CB50' },
];

const CREAMS: Option[] = [
  { id: 'classic', label: 'Classic dum seal', price: 0, color: '#E8D1A7' },
  { id: 'ghee-finish', label: 'Saffron ghee finish', price: 45, color: '#F4D56E' },
  { id: 'spicy-finish', label: 'Guntur chilli finish', price: 35, color: '#D64B2A' },
];

const TOPPINGS: Option[] = [
  { id: 'salan', label: 'Extra Mirchi Ka Salan', price: 60, color: '#7E6A2D' },
  { id: 'raita', label: 'Double Burani Raita', price: 40, color: '#F6F1E6' },
  { id: 'eggs', label: 'Boiled eggs (2 pcs)', price: 40, color: '#F0C75E' },
  { id: 'cashews', label: 'Roasted cashews & onions', price: 50, color: '#D8B77C' },
];

const SIZES: { id: string; label: string; price: number; multiplier: number }[] = [
  { id: 's', label: 'Regular Handi', price: 0, multiplier: 1 },
  { id: 'm', label: 'Family Pack · serves 3–4', price: 420, multiplier: 1 },
  { id: 'l', label: 'Jumbo Handi · serves 6–8', price: 850, multiplier: 1 },
];

function CupPreview({
  baseColor,
  syrupColors,
  creamColor,
  toppingColor,
  size,
}: {
  baseColor: string;
  syrupColors: string[];
  creamColor: string;
  toppingColor: string;
  size: string;
}) {
  const cupHeight = size === 's' ? 220 : size === 'l' ? 300 : 260;
  // mix syrups into the base color
  const mixed = useMemo(() => {
    if (syrupColors.length === 0) return baseColor;
    // average hex channels
    const all = [baseColor, ...syrupColors].map(
      (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
    );
    const avg = all
      .reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]], [0, 0, 0])
      .map((v) => Math.round(v / all.length));
    return `#${avg.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  }, [baseColor, syrupColors]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex flex-col items-center" style={{ height: cupHeight }}>
        {/* handi lid */}
        <div className="relative z-[5] h-8 w-[85%] rounded-t-full border-[3px] border-b-0 border-cocoa bg-tangerine" />
        {/* cream layer */}
        {creamColor ? (
          <div
            className="relative z-[4] -mt-1 w-[88%] border-[3px] border-cocoa"
            style={{
              height: 22,
              background: `linear-gradient(180deg, ${creamColor}, ${creamColor} 60%, rgba(0,0,0,0.06))`,
              borderRadius: '10px 10px 4px 4px',
            }}
          />
        ) : null}
        {/* topping garnish */}
        {toppingColor ? (
          <div
            className="absolute z-[6] rounded-full border-2 border-cocoa"
            style={{
              top: creamColor ? 18 : 6,
              right: '18%',
              width: 22,
              height: 22,
              background: toppingColor,
              boxShadow: '-8px 2px 0 -6px ' + toppingColor,
            }}
          />
        ) : null}
        {/* cup body */}
        <div
            className="relative flex w-full flex-col justify-end overflow-hidden rounded-b-[45%] rounded-t-lg border-[3px] border-t-0 border-cocoa shadow-pop transition-colors duration-500"
          style={{
            height: cupHeight - 30,
            background: `linear-gradient(180deg, ${mixed} 0%, ${mixed} 100%)`,
          }}
        >
          {/* fragrant layers */}
          {syrupColors.map((c, i) => (
            <div
              key={i}
              className="absolute h-full w-3 rounded-full opacity-70 transition-all duration-500"
              style={{
                background: c,
                left: `${18 + i * 24}%`,
                top: `${-10 + (i % 3) * 18}%`,
                transform: `rotate(${i % 2 === 0 ? 8 : -8}deg)`,
              }}
            />
          ))}
          {/* steam */}
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/50"
              style={{
                width: 6 + (i % 3) * 3,
                height: 6 + (i % 3) * 3,
                left: `${15 + i * 20}%`,
                bottom: 8,
                animation: `rise ${3 + i * 0.7}s linear ${i * 0.5}s infinite`,
              }}
            />
          ))}
          {/* brand mark */}
          <span className="relative m-auto -rotate-3 font-display text-lg text-white/90 outline-text [text-stroke-width:0.5px]">
            Nawaab’s Handi
          </span>
        </div>
      </div>
      <div className="mt-1 h-2 w-[120%] rounded-full bg-cocoa/10 blur-[2px]" />
    </div>
  );
}

function StepCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-pop p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-cocoa bg-lemon font-display text-base shadow-pop-sm">
          {step}
        </span>
        <h3 className="font-display text-lg text-cocoa sm:text-xl">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function OptionButton({
  option,
  selected,
  onToggle,
}: {
  option: Option;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`flex items-center gap-2 rounded-full border-[3px] border-cocoa px-4 py-2 text-sm font-extrabold transition-all ${
        selected ? 'bg-cocoa text-lemon shadow-pop-sm' : 'bg-white hover:bg-lemon/60'
      }`}
    >
      {option.color ? (
        <span
          className="inline-block h-4 w-4 rounded-full border-2 border-cocoa"
          style={{ background: option.color }}
        />
      ) : null}
      {option.label}
      <span className={`text-xs font-bold ${selected ? 'text-cream/80' : 'text-cocoa-fade'}`}>
        +₹{option.price}
      </span>
      {selected && <Check size={15} strokeWidth={3.5} />}
    </button>
  );
}

export default function Builder() {
  const [base, setBase] = useState<Option>(BASES[0]);
  const [syrups, setSyrups] = useState<Option[]>([SYRUPS[0]]);
  const [cream, setCream] = useState<Option>(CREAMS[1]);
  const [toppings, setToppings] = useState<Option[]>([TOPPINGS[0]]);
  const [size, setSize] = useState(SIZES[1]);
  const [ordered, setOrdered] = useState(false);

  const total = useMemo(() => {
    const items =
      base.price +
      syrups.reduce((s, o) => s + o.price, 0) +
      cream.price +
      toppings.reduce((s, o) => s + o.price, 0);
    return Math.round((items + size.price) * 100) / 100;
  }, [base, syrups, cream, toppings, size]);

  const drinkName = useMemo(() => {
    const cut = base.label.replace('Kachhi Marinated ', '').replace('Royal Nizami ', '');
    return `${cut} Dum Handi`;
  }, [base]);

  const toggleFrom = <T extends Option>(list: T[], setList: (v: T[]) => void, item: T) => {
    setList(list.some((o) => o.id === item.id) ? list.filter((o) => o.id !== item.id) : [...list, item]);
  };

  const reset = () => {
    setBase(BASES[0]);
    setSyrups([SYRUPS[0]]);
    setCream(CREAMS[1]);
    setToppings([TOPPINGS[0]]);
    setSize(SIZES[1]);
    setOrdered(false);
  };

  return (
    <section id="builder" className="relative overflow-hidden bg-aqua py-16 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="h-full w-full checkerboard" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-block rotate-1 rounded-full border-[3px] border-cocoa bg-lemon px-4 py-1 text-xs font-extrabold uppercase tracking-[0.25em] shadow-pop-sm">
            Dum craft station
          </span>
          <h2 className="mt-4 font-display text-4xl text-white outline-text sm:text-5xl">
            Build Your Handi
          </h2>
          <p className="mx-auto mt-5 w-fit max-w-lg -rotate-1 rounded-xl border-[3px] border-cocoa bg-cream px-5 py-2.5 font-semibold text-cocoa shadow-pop-sm">
            Choose your dum base, capacity, aromatic layers, finish, and accompaniments.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* steps */}
          <div className="space-y-5">
            <StepCard step={1} title="Pick your dum-marinated base">
              <div className="flex flex-wrap gap-2">
                {BASES.map((b) => (
                  <OptionButton
                    key={b.id}
                    option={b}
                    selected={base.id === b.id}
                    onToggle={() => {
                      setBase(b);
                      setOrdered(false);
                    }}
                  />
                ))}
              </div>
            </StepCard>

            <StepCard step={2} title="Add aromatic layers">
              <p className="mb-3 text-sm font-bold text-cocoa-fade">Pick up to 3 for your perfect handi.</p>
              <div className="flex flex-wrap gap-2">
                {SYRUPS.map((s) => (
                  <OptionButton
                    key={s.id}
                    option={s}
                    selected={syrups.some((o) => o.id === s.id)}
                    onToggle={() => {
                      setSyrups((prev) => {
                        const has = prev.some((o) => o.id === s.id);
                        if (has) return prev.filter((o) => o.id !== s.id);
                        if (prev.length >= 3) return prev;
                        setOrdered(false);
                        return [...prev, s];
                      });
                    }}
                  />
                ))}
              </div>
            </StepCard>

            <StepCard step={3} title="Choose your dum finish">
              <div className="flex flex-wrap gap-2">
                {CREAMS.map((c) => (
                  <OptionButton
                    key={c.id}
                    option={c}
                    selected={cream.id === c.id}
                    onToggle={() => {
                      setCream(c);
                      setOrdered(false);
                    }}
                  />
                ))}
              </div>
            </StepCard>

            <StepCard step={4} title="Choose accompaniments">
              <div className="flex flex-wrap gap-2">
                {TOPPINGS.map((t) => (
                  <OptionButton
                    key={t.id}
                    option={t}
                    selected={toppings.some((o) => o.id === t.id)}
                    onToggle={() => toggleFrom(toppings, setToppings, t)}
                  />
                ))}
              </div>
            </StepCard>

            <StepCard step={5} title="Choose handi capacity">
              <div className="grid gap-2 sm:grid-cols-3">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSize(s);
                      setOrdered(false);
                    }}
                    aria-pressed={size.id === s.id}
                    className={`rounded-2xl border-[3px] border-cocoa px-4 py-3 text-center font-extrabold transition-all ${
                      size.id === s.id ? 'bg-lemon shadow-pop-sm' : 'bg-white hover:bg-lemon/50'
                    }`}
                  >
                    <span className="block text-sm">{s.label}</span>
                    <span className="text-xs font-bold text-cocoa-fade">
                      {s.price === 0 ? 'one hungry person' : `+₹${s.price}`}
                    </span>
                  </button>
                ))}
              </div>
            </StepCard>
          </div>

          {/* preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-pop bg-cream p-6 text-center">
              <div className="rounded-3xl border-[3px] border-dashed border-cocoa/30 bg-white/60 px-6 py-8">
                <CupPreview
                  baseColor={base.color}
                  syrupColors={syrups.map((s) => s.color)}
                  creamColor={cream.color}
                  toppingColor={toppings[0]?.color ?? ''}
                  size={size.id}
                />
              </div>
              <h3 className="mt-5 font-display text-2xl text-cherry">{drinkName}</h3>
              <ul className="mx-auto mt-2 max-w-[240px] space-y-1 text-left text-sm font-bold text-cocoa-soft">
                <li>· {base.label}</li>
                {syrups.length > 0 && <li>· {syrups.map((s) => s.label).join(', ')}</li>}
                <li>· {cream.label.toLowerCase()}</li>
                {toppings.length > 0 && <li>· {toppings.map((t) => t.label).join(', ')}</li>}
                <li>· {size.label}</li>
              </ul>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-sm font-extrabold uppercase tracking-widest text-cocoa-fade">Total</span>
                <span className="rounded-full border-[3px] border-cocoa bg-lemon px-5 py-1.5 font-display text-2xl shadow-pop-sm">
                  ₹{total}
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {ordered ? (
                  <div className="rounded-2xl border-[3px] border-cocoa bg-white p-4 shadow-pop-sm">
                    <p className="flex items-center justify-center gap-2 font-display text-lg text-aqua-deep">
                      <PartyPopper size={20} className="text-tangerine" /> Order placed!
                    </p>
                    <p className="mt-1 text-sm font-semibold text-cocoa-soft">
                      Your {drinkName} is now placed with the outlet kitchen. We’ll keep the status and promised time live.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOrdered(true)}
                    className="pill-btn w-full bg-cherry text-white text-lg animate-wiggle hover:animate-none"
                  >
                    Place test order · ₹{total}
                  </button>
                )}
                <button
                  type="button"
                  onClick={reset}
                  className="mx-auto flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wider text-cocoa-fade underline decoration-2 underline-offset-4 hover:text-cherry"
                >
                  <RotateCcw size={14} strokeWidth={3} /> Start over
                </button>
              </div>
              <p className="mt-4 text-[11px] font-bold text-cocoa-fade">
                Demo payment only — no payment is captured. Prices shown include 5% GST.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
