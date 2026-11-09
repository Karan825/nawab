import { useMemo, useState } from 'react';
import { Check, PartyPopper, RotateCcw } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  price: number;
  color: string;
}

const BASES: Option[] = [
  { id: 'tender-chicken', label: 'Tender Farm Chicken', price: 380, color: '#D96E14' },
  { id: 'royal-mutton', label: 'Royal Nizami Mutton', price: 490, color: '#A61B22' },
  { id: 'subz-paneer', label: 'Subz Malai Paneer', price: 290, color: '#3BA55D' },
  { id: 'spiced-egg', label: 'Spiced Farm Egg Dum', price: 260, color: '#FFC96B' },
];

const SYRUPS: Option[] = [
  { id: 'pure-ghee', label: 'Pure Desi Ghee Tadka', price: 40, color: '#FFE066' },
  { id: 'saffron-milk', label: 'Kashmiri Saffron Infusion', price: 50, color: '#FFB46B' },
  { id: 'fried-onions', label: 'Crispy Brown Onions (Birista)', price: 35, color: '#6B4226' },
  { id: 'green-chilies', label: 'Charred Green Chilies', price: 20, color: '#7ED957' },
];

const CREAMS: Option[] = [
  { id: 'none', label: 'Standard Salan Only', price: 0, color: '' },
  { id: 'burani-raita', label: 'Double Burani Garlic Raita', price: 40, color: '#FFF4E2' },
  { id: 'mirchi-salan', label: 'Extra Mirchi Ka Salan Gravy', price: 60, color: '#E85D04' },
];

const TOPPINGS: Option[] = [
  { id: 'cashews', label: 'Roasted Cashews & Kaju', price: 50, color: '#EAD9B0' },
  { id: 'boiled-eggs', label: 'Fried Eggs (2 pcs)', price: 40, color: '#FFD93D' },
  { id: 'mint-coriander', label: 'Fresh Mint & Coriander', price: 15, color: '#3BA55D' },
  { id: 'silver-vark', label: 'Silver Vark Garnish', price: 30, color: '#FFFFFF' },
];

const SIZES: { id: string; label: string; price: number; multiplier: number }[] = [
  { id: 's', label: 'Regular Handi · Serves 1', price: 0, multiplier: 1 },
  { id: 'm', label: 'Family Pack · Serves 3–4', price: 420, multiplier: 1 },
  { id: 'l', label: 'Jumbo Royal · Serves 6–8', price: 850, multiplier: 1 },
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
  const cupWidth = size === 's' ? 130 : size === 'l' ? 170 : 150;
  // mix syrups into the base color
  const mixed = useMemo(() => {
    if (syrupColors.length === 0) return baseColor;
    // average hex channels
    const all = [baseColor, ...syrupColors].map(
      (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
    );
    const avg = [0, 1, 2].map((ch) =>
      Math.round(all.reduce((acc, c) => acc + c[ch], 0) / all.length)
        .toString(16)
        .padStart(2, '0')
    );
    return `#${avg.join('')}`;
  }, [baseColor, syrupColors]);

  return (
    <div className="relative mx-auto flex items-end justify-center" style={{ height: 320, width: 220 }}>
      {/* cup container */}
      <svg
        viewBox={`0 0 ${cupWidth} ${cupHeight}`}
        style={{ width: cupWidth, height: cupHeight }}
        className="overflow-visible drop-shadow-[4px_6px_0_#3A2318]"
      >
        <defs>
          <clipPath id="cup-shape">
            <path
              d={`
                M ${cupWidth * 0.12} 24
                L ${cupWidth * 0.22} ${cupHeight - 16}
                Q ${cupWidth * 0.24} ${cupHeight} ${cupWidth * 0.35} ${cupHeight}
                L ${cupWidth * 0.65} ${cupHeight}
                Q ${cupWidth * 0.76} ${cupHeight} ${cupWidth * 0.78} ${cupHeight - 16}
                L ${cupWidth * 0.88} 24
                Z
              `}
            />
          </clipPath>
          <linearGradient id="liquid-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={mixed} />
            <stop offset="100%" stopColor={baseColor} />
          </linearGradient>
        </defs>

        {/* liquid clipped to cup body */}
        <g clipPath="url(#cup-shape)">
          {/* soda base */}
          <rect x="0" y="0" width={cupWidth} height={cupHeight} fill="url(#liquid-grad)" />

          {/* carbonation bubbles */}
          {Array.from({ length: 9 }).map((_, i) => (
            <circle
              key={i}
              cx={cupWidth * (0.28 + ((i * 17) % 45) / 100)}
              cy={cupHeight * (0.35 + ((i * 19) % 55) / 100)}
              r={(i % 3) + 2}
              fill="#FFFFFF"
              opacity="0.35"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}

          {/* cream layer (floats near top) */}
          {creamColor && (
            <path
              d={`
                M 0 32
                Q ${cupWidth * 0.25} 24 ${cupWidth * 0.5} 32
                T ${cupWidth} 32
                L ${cupWidth} 72
                Q ${cupWidth * 0.75} 78 ${cupWidth * 0.5} 70
                T 0 72
                Z
              `}
              fill={creamColor}
              opacity="0.88"
            />
          )}

          {/* syrup swirls */}
          {syrupColors.map((col, idx) => (
            <path
              key={idx}
              d={`
                M ${cupWidth * (0.2 + idx * 0.2)} ${cupHeight * 0.4}
                Q ${cupWidth * (0.4 + idx * 0.15)} ${cupHeight * (0.55 + idx * 0.1)}
                  ${cupWidth * (0.3 + idx * 0.2)} ${cupHeight * 0.85}
              `}
              stroke={col}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />
          ))}
        </g>

        {/* cup outline + rim */}
        <path
          d={`
            M ${cupWidth * 0.12} 24
            L ${cupWidth * 0.22} ${cupHeight - 16}
            Q ${cupWidth * 0.24} ${cupHeight} ${cupWidth * 0.35} ${cupHeight}
            L ${cupWidth * 0.65} ${cupHeight}
            Q ${cupWidth * 0.76} ${cupHeight} ${cupWidth * 0.78} ${cupHeight - 16}
            L ${cupWidth * 0.88} 24
          `}
          stroke="#3A2318"
          strokeWidth="4"
          fill="none"
        />

        {/* rim */}
        <ellipse
          cx={cupWidth * 0.5}
          cy="24"
          rx={cupWidth * 0.38}
          ry="7"
          fill="#FFF4E2"
          stroke="#3A2318"
          strokeWidth="4"
        />

        {/* topping floating on rim */}
        {toppingColor && (
          <g transform={`translate(${cupWidth * 0.5}, 16)`}>
            <circle cx="-14" cy="0" r="8" fill={toppingColor} stroke="#3A2318" strokeWidth="2.5" />
            <circle cx="10" cy="-4" r="7" fill={toppingColor} stroke="#3A2318" strokeWidth="2.5" />
            <path d="M-14 -8 Q-10 -18 -6 -16" stroke="#3A2318" strokeWidth="2.5" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="card-pop bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-cocoa bg-lemon font-display text-base text-cocoa shadow-pop-sm">
          {step}
        </span>
        <h3 className="font-display text-xl text-cocoa">{title}</h3>
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
      className={`group relative flex items-center gap-2 rounded-full border-[3px] border-cocoa px-4 py-2 text-sm font-extrabold transition-all ${
        selected ? 'bg-cocoa text-lemon shadow-pop-sm' : 'bg-cream text-cocoa hover:bg-lemon/60'
      }`}
    >
      {option.color && (
        <span
          className="h-3.5 w-3.5 shrink-0 rounded-full border border-cocoa"
          style={{ backgroundColor: option.color }}
        />
      )}
      <span>{option.label}</span>
      {option.price > 0 && (
        <span className="text-xs opacity-80">+₹{option.price}</span>
      )}
      {selected && <Check size={14} strokeWidth={3} className="ml-1 text-lemon" />}
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
    const baseP = base.price;
    const sP = syrups.reduce((a, b) => a + b.price, 0);
    const cP = cream.price;
    const tP = toppings.reduce((a, b) => a + b.price, 0);
    const szP = size.price;
    return baseP + sP + cP + tP + szP;
  }, [base, syrups, cream, toppings, size]);

  const drinkName = useMemo(() => {
    const adj = syrups[0]?.label.split(' ')[0] ?? 'Royal';
    const noun = base.label.includes('Chicken')
      ? 'Chicken Handi'
      : base.label.includes('Mutton')
      ? 'Mutton Dum'
      : 'Subz Feast';
    return `${adj} ${noun}`;
  }, [syrups, base]);

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
            Handi Builder
          </span>
          <h2 className="mt-4 font-display text-4xl text-white outline-text sm:text-5xl">
            Build Your Own
          </h2>
          <p className="mx-auto mt-5 w-fit max-w-lg -rotate-1 rounded-xl border-[3px] border-cocoa bg-cream px-5 py-2.5 font-semibold text-cocoa shadow-pop-sm">
            Five delicious steps. One authentic handi. Watch it change as you go.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* steps */}
          <div className="space-y-5">
            <StepCard step={1} title="Pick your Dum base">
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

            <StepCard step={2} title="Add ghee tadka & spices">
              <p className="mb-3 text-sm font-bold text-cocoa-fade">Pick up to 3 — rich & aromatic.</p>
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

            <StepCard step={3} title="Choose your raita & gravy">
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

            <StepCard step={4} title="Royal garnishes & add-ons">
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

            <StepCard step={5} title="Choose your handi size">
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
                      {s.price === 0 ? 'the classic' : `+₹${s.price}`}
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
                      Your {drinkName} is being dum cooked in our kitchen right now. Hot dispatch in about 35
                      minutes. See you at your doorstep!
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOrdered(true)}
                    className="pill-btn w-full bg-cherry text-white text-lg animate-wiggle hover:animate-none"
                  >
                    Order my handi · ₹{total}
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
                Demo preview — inclusive of 5% GST. Sealed dum handi dispatched from nearest outlet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
