import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChefHat, ShieldCheck } from 'lucide-react';

const LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Build Your Own', href: '#builder' },
  { label: 'Snacks', href: '#snacks' },
  { label: 'Merch', href: '#merch' },
  { label: 'Find Us', href: '#find-us' },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 group">
      <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-cocoa bg-lemon shadow-pop-sm transition-transform duration-200 group-hover:-rotate-12">
        <span className="text-2xl leading-none">🍗</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl text-cherry outline-text [text-stroke-width:0.5px] sm:text-2xl">
          Nawaab's
        </span>
        <span className="text-[9px] font-extrabold tracking-[0.35em] text-cocoa-fade uppercase">
          BIRYANI CO.
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

            <Link
              to="/kds"
              className="rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider text-cocoa bg-lemon border-2 border-cocoa shadow-pop-sm hover:bg-lemon-deep ml-2 flex items-center gap-1"
            >
              <ChefHat size={14} />
              KDS
            </Link>

            <Link
              to="/admin"
              className="rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider text-cocoa bg-aqua border-2 border-cocoa shadow-pop-sm hover:bg-aqua-deep ml-1 flex items-center gap-1"
            >
              <ShieldCheck size={14} />
              CMS
            </Link>

            <a href="#builder" className="pill-btn ml-3 bg-cherry text-white text-sm !px-5 !py-2.5">
              Order Up
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

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link
                to="/kds"
                onClick={() => setOpen(false)}
                className="pill-btn bg-lemon text-cocoa text-xs !py-2 text-center"
              >
                Kitchen KDS
              </Link>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="pill-btn bg-aqua text-cocoa text-xs !py-2 text-center"
              >
                Admin CMS
              </Link>
            </div>

            <a
              href="#builder"
              onClick={() => setOpen(false)}
              className="pill-btn mt-3 w-full bg-cherry text-white"
            >
              Order Up
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
