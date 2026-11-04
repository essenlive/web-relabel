import Link from 'next/link';
import Layout from '@components/Layout';

export default function NotFound() {
  return (
    <Layout padded>
      <h1 className="text-4xl">Page introuvable</h1>
      <p className="mt-4">Cette page n&apos;existe pas ou a été déplacée.</p>
      <p className="link mt-6"><Link href="/">Retour à l&apos;accueil</Link></p>
    </Layout>
  );
}
