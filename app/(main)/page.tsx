import Layout from '@components/Layout'
import Link from 'next/link';
import styles from "@styles/pages/Home.module.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Re-label | Valorisateur des pratiques du réemploi',
  description: 'Un outils collaboratif qui recense et partage',
  openGraph: { images: ['/assets/logo.png'] },
};

export default function Home() {
  return (
    <Layout padded>
      <div className={styles.banner}>
        <div className={styles.header}>
          <h1>Re-Label</h1>
          <h2>Un outils collaboratif qui recense et partage</h2>
        </div>
        <div className={styles.image}>
          <img src="/assets/hero-blank.png" alt="process illustration" />
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
            <h2>Des communautées locales</h2>
            <p>Re-Label documente le developpement de réseaux de collaborations localisés. Re-Label permet de visualiser l'état des écosystemes sur les différents territoires.</p>
            <p className={"link"}><Link href="/communities">Voir les communautées</Link></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
