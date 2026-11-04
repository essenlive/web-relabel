import Layout from '@components/Layout'
import SmartImage from '@components/SmartImage';
import Link from 'next/link';
import styles from "@styles/pages/Home.module.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Re-Label | Valorisateur des pratiques du réemploi',
  description: 'Un outil collaboratif qui recense et partage',
  openGraph: { images: ['/assets/logo.png'] },
};

export default function Home() {
  return (
    <Layout padded>
      <div className={styles.banner}>
        <div className={styles.header}>
          <h1>Re-Label</h1>
          <h2>Un outil collaboratif qui recense et partage</h2>
        </div>
        <div className={styles.image}>
          <SmartImage src="/assets/hero-blank.png" alt="Illustration du processus de réemploi" width={2706} height={599} priority />
        </div>
        <div className={styles.guides}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.items}>
          <div>
            <h2>Des productions responsables</h2>
            <p>Re-Label met en avant des productions responsables et vertueuses qui contribuent au développement d'une nouvelle manière de produire et consommer.</p>
            <p className={"link"}><Link href="/projects">Voir les productions</Link></p>
          </div>
          <div>
            <h2>Des structures engagées</h2>
            <p>Re-Label cartographie les structures qui contribuent et portent ces projets pour valoriser leur démarche collaborative.</p>
            <p className={"link"}><Link href="/structures">Voir la carte des structures</Link></p>
          </div>
          <div>
            <h2>Des communautés locales</h2>
            <p>Re-Label documente le développement de réseaux de collaborations localisés. Re-Label permet de visualiser l'état des écosystèmes sur les différents territoires.</p>
            <p className={"link"}><Link href="/communities">Voir les communautés</Link></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
