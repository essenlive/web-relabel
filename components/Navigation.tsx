'use client';
import Link from 'next/link'
import { useState } from 'react';
import { usePathname } from 'next/navigation'
import { FiMenu, FiX } from 'react-icons/fi'
import { cn } from "@libs/utils";

function NavLink({ href, label, isActive, menuOpen, onClick }: {
  href: string;
  label: string;
  isActive: boolean;
  menuOpen: boolean;
  onClick: () => void;
}) {
  return (
    <Link onClick={onClick} href={href}>
      <div className={cn(
        "m-2 p-1 cursor-pointer w-max relative font-extrabold uppercase text-lg text-primary z-1",
        "after:content-[''] after:block after:h-0.75 after:w-0 after:mx-2.5 after:absolute after:bottom-0 after:left-0 after:bg-primary after:transition-all after:duration-250 after:ease-in-out",
        "hover:after:w-[calc(100%-20px)]",
        isActive && "after:w-[calc(100%-20px)]",
        "max-md:hidden",
        menuOpen && "max-md:block",
      )}>
        <span className="relative z-1">{label}</span>
      </div>
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const close = () => setMenuOpen(false);

  return (
    <nav className={cn(
      "flex items-start justify-between py-4 px-4 mx-auto w-full max-w-270 h-25 relative z-10",
      "max-md:flex-col max-md:h-auto",
      menuOpen && "max-md:fixed max-md:inset-0 max-md:h-full max-md:bg-white max-md:z-50 max-md:justify-start"
    )}>
      <Link onClick={close} href="/">
        <div className="w-auto h-18 cursor-pointer">
          <img className="h-full" src="/assets/logo.png" alt="logo relabel" />
        </div>
      </Link>

      <div className="flex flex-row items-start justify-end max-md:hidden">
        <NavLink href="/communities" label="Communautés" isActive={pathname === '/communities'} menuOpen={menuOpen} onClick={close} />
        <NavLink href="/structures" label="Structures" isActive={pathname === '/structures'} menuOpen={menuOpen} onClick={close} />
        <NavLink href="/projects" label="Productions" isActive={pathname === '/projects'} menuOpen={menuOpen} onClick={close} />
        <NavLink href="/practices" label="Bonnes Pratiques" isActive={pathname === '/practices'} menuOpen={menuOpen} onClick={close} />
        <NavLink href="/contact" label="Nous contacter" isActive={pathname === '/contact'} menuOpen={menuOpen} onClick={close} />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col items-start gap-2 mt-4 md:hidden">
          <NavLink href="/communities" label="Communautés" isActive={pathname === '/communities'} menuOpen={menuOpen} onClick={close} />
          <NavLink href="/structures" label="Structures" isActive={pathname === '/structures'} menuOpen={menuOpen} onClick={close} />
          <NavLink href="/projects" label="Productions" isActive={pathname === '/projects'} menuOpen={menuOpen} onClick={close} />
          <NavLink href="/practices" label="Bonnes Pratiques" isActive={pathname === '/practices'} menuOpen={menuOpen} onClick={close} />
          <NavLink href="/contact" label="Nous contacter" isActive={pathname === '/contact'} menuOpen={menuOpen} onClick={close} />
          <div className="absolute bottom-0 left-0 p-4 m-6 text-sm font-medium">
            Fait avec ❤️ à Paris
          </div>
        </div>
      )}

      {/* Mobile toggle */}
      <div
        className="hidden max-md:block absolute top-6 right-6 cursor-pointer bg-white border-4 border-primary p-4"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen
          ? <span className="flex flex-row font-bold uppercase text-primary">Fermer <FiX className="ml-4 h-6 w-6" /></span>
          : <span className="flex flex-row font-bold uppercase text-primary">Menu <FiMenu className="ml-4 h-6 w-6" /></span>
        }
      </div>
    </nav>
  );
}
