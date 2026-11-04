'use client';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import { FiMenu, FiX } from 'react-icons/fi'
import { cn } from "@libs/utils";
import SmartImage from '@components/SmartImage';

const LINKS = [
  { href: '/communities', label: 'Communautés' },
  { href: '/structures', label: 'Structures' },
  { href: '/projects', label: 'Productions' },
  { href: '/practices', label: 'Bonnes Pratiques' },
  { href: '/contact', label: 'Nous contacter' },
];

export default function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const close = () => setMenuOpen(false);

  // Close the menu on route change and on Escape; lock page scroll while open.
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav
      aria-label="Navigation principale"
      className={cn(
        "flex items-start justify-between py-4 px-4 mx-auto w-full max-w-270 h-25 relative z-10",
        "max-md:flex-col max-md:h-auto",
        menuOpen && "max-md:fixed max-md:inset-0 max-md:h-full max-md:bg-white max-md:z-50 max-md:justify-start"
      )}>
      <Link onClick={close} href="/" className="h-18 w-auto shrink-0">
        <SmartImage className="h-full w-auto" src="/assets/logo.png" alt="Re-Label, retour à l'accueil" width={550} height={674} priority />
      </Link>

      <ul
        id="main-menu"
        className={cn(
          "flex flex-row items-start justify-end list-none p-0 m-0",
          "max-md:hidden",
          menuOpen && "max-md:flex max-md:flex-col max-md:gap-2 max-md:mt-4"
        )}>
        {LINKS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={close}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "m-2 p-1 block w-max relative font-extrabold uppercase text-lg text-primary",
                  "after:content-[''] after:block after:h-0.75 after:w-0 after:mx-2.5 after:absolute after:bottom-0 after:left-0 after:bg-primary after:transition-all after:duration-250 after:ease-in-out",
                  "hover:after:w-[calc(100%-20px)] focus-visible:after:w-[calc(100%-20px)] focus-visible:outline-2 focus-visible:outline-primary",
                  isActive && "after:w-[calc(100%-20px)]"
                )}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {menuOpen && (
        <div className="absolute bottom-0 left-0 p-4 m-6 text-sm font-medium md:hidden">
          Fait avec ❤️ à Paris
        </div>
      )}

      <button
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-menu"
        onClick={() => setMenuOpen(!menuOpen)}
        className="hidden max-md:flex absolute top-6 right-6 cursor-pointer bg-white border-4 border-primary p-4 font-bold uppercase text-primary items-center"
      >
        {menuOpen
          ? <>Fermer <FiX aria-hidden className="ml-4 h-6 w-6" /></>
          : <>Menu <FiMenu aria-hidden className="ml-4 h-6 w-6" /></>}
      </button>
    </nav>
  );
}
