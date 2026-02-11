'use client';
import Link from 'next/link'
import { useState } from 'react';
import { usePathname } from 'next/navigation'
import { FiMenu, FiX } from 'react-icons/fi'
import classNames from "classnames"
import styles from "@styles/components/Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
    return (

        <nav className={classNames(styles.nav, { [`${styles.navOpen}`]: menuOpen})}>
         <Link onClick={() => { setMenuOpen(false) }} href="/">
           <div className={styles.logo}>
             <span>
               <img src="/assets/logo.png" alt="logo relabel" />
             </span>
           </div>
         </Link>
        <div className={classNames(styles.menu, { [`${styles.open}`]: menuOpen })}>
           <Link onClick={() => { setMenuOpen(false) }} href="/communities">
             <div className={classNames(styles.links,{ [`${styles.linkActive}`]: pathname === '/communities' }, { [`${styles.open}`]: menuOpen })}>
               <span>Communautés</span>
             </div>
          </Link>
          <Link onClick={() => { setMenuOpen(false) }} href="/structures">
            <div className={classNames(styles.links, { [`${styles.linkActive}`]: pathname === '/structures' }, { [`${styles.open}`]: menuOpen })}>
              <span>Structures</span>
            </div>
          </Link>
           <Link onClick={() => { setMenuOpen(false) }} href="/projects">
            <div className={classNames(styles.links, { [`${styles.linkActive}`]: pathname === '/projects' }, { [`${styles.open}`]: menuOpen })}>
               <span>Productions</span>
             </div>
           </Link>
           <Link onClick={() => { setMenuOpen(false) }} href="/practices">
            <div className={classNames(styles.links, { [`${styles.linkActive}`]: pathname === '/practices' }, { [`${styles.open}`]: menuOpen })}>
               <span>Bonnes Pratiques</span>
             </div>
           </Link>
           <Link onClick={() => { setMenuOpen(false) }} href="/contact">
            <div className={classNames(styles.linksEmphasis, { [`${styles.linkActive}`]: pathname === '/contact' }, { [`${styles.open}`]: menuOpen })}>
               <span>Nous contacter</span>
             </div>
          </Link>
          <div className={classNames(styles.signature, { [`${styles.open}`]: menuOpen })}>
            Fait avec ❤️ à Paris
          </div>

           <div className={styles.MobileToggle} onClick={() => { setMenuOpen(!menuOpen) }}>
            {menuOpen && (<span>Fermer <FiX /></span>)}
            {!menuOpen && (<span>Menu <FiMenu /></span>)}
           </div>
         </div>

       </nav>
    );
}