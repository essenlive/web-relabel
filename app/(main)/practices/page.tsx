import Layout from '@components/Layout'
import styles from '@styles/pages/Practices.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Re-label | Bonnes pratiques',
  description: 'Partage de bonne pratiques afin de favoriser les pratiques responsables.',
  openGraph: { images: ['/assets/logo.png'] },
};

export default function Practices() {
  return (
    <Layout fullWidth>
      <div className={styles.practices}>
        <embed src="/assets/GUIDE-DE-BONNES-PRATIQUES_V1_Export.pdf" width="100%" height="100%" />
      </div>
    </Layout>
  );
}
