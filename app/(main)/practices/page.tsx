import Layout from '@components/Layout'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Re-Label | Bonnes pratiques',
  description: 'Partage de bonnes pratiques afin de favoriser les pratiques responsables.',
  openGraph: { images: ['/assets/logo.png'] },
};

export default function Practices() {
  return (
    <Layout fullWidth>
      <div className="mt-[100px] h-[calc(100vh-200px)] w-full border-t-4 border-primary">
        <p className="p-4 text-center">
          <a className="link" href="/assets/GUIDE-DE-BONNES-PRATIQUES_V1_Export.pdf" download>Télécharger le guide (PDF)</a>
        </p>
        <embed src="/assets/GUIDE-DE-BONNES-PRATIQUES_V1_Export.pdf" type="application/pdf" style={{ width: "100%", height: "calc(100% - 4rem)" }} title="Guide de bonnes pratiques" />
      </div>
    </Layout>
  );
}
