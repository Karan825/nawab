import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Build a Handi', href: '#builder' },
  { label: 'Extras', href: '#snacks' },
  { label: 'Kitchen updates', href: '#merch' },
  { label: 'Outlets', href: '#find-us' },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 group">
      <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-cocoa bg-lemon shadow-pop-sm transition-transform duration-200 group-hover:-rotate-12">
        <span className="text-2xl leading-none">🍛</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl text-cherry outline-text [text-stroke-width:0.5px] sm:text-2xl">
          Nawaab’s Biryani
        </span>
        <span className="text-[9px] font-extrabold tracking-[0.35em] text-cocoa-fade">
          HYDERABAD
        </span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled ? 'bg-cream/95 shadow-[0_3px_0_0_#3a2318] backdrop-blur' : 'bg-cream/80 backdrop-blur-sm'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-extrabold uppercase tracking-wider text-cocoa transition-colors hover:bg-lemon"
              >
                {link.label}
              </a>
            ))}
            <a href="#builder" className="pill-btn ml-3 bg-cherry text-white text-sm !px-5 !py-2.5">
              Order now
            </a>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-cocoa bg-lemon shadow-pop-sm lg:hidden"
          >
            {open ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
          </button>
        </nav>
        {open && (
          <div className="border-t-[3px] border-cocoa bg-cream px-4 pb-5 pt-2 lg:hidden">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base font-extrabold uppercase tracking-wider hover:bg-lemon"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#builder"
              onClick={() => setOpen(false)}
              className="pill-btn mt-2 w-full bg-hot-pink text-white"
            >
              Order now
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
