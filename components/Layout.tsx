'use client';
import { ReactNode } from "react";
import Navigation from "@components/Navigation";
import classNames from "classnames"
import styles from "@styles/components/Layout.module.css";
import Footer from "@components/Footer";

interface LayoutProps {
  full?: boolean;
  padded?: boolean;
  children?: ReactNode;
  grid?: boolean;
  fullWidth?: boolean;
}

const Layout = ({full, padded, children, grid, fullWidth}: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        <Navigation />
      </div>

      <main className={classNames(styles.content, { [`${styles.padded}`]: padded }, { [`${styles.full}`]: full }, { [`${styles.grid}`]: grid }, { [`${styles.fullWidth}`]: fullWidth })}>
          {children}
      </main>

      <Footer/>

    </div>
  );
}

export default Layout