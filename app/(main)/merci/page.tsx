import Layout from '@components/Layout'
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Re-Label | Merci',
  robots: { index: false },
};

export default function Merci() {
  return (
    <Layout padded>
      <div className="w-full border-4 border-primary bg-white p-8 shadow-2xl">
        <h1 className="text-5xl max-sm:text-4xl">Merci !</h1>
        <p className="mt-6 max-w-prose">
          Votre contribution est bien reçue. L&apos;équipe la relit avant de la publier : elle apparaîtra sur le site dès qu&apos;elle sera validée.
        </p>
        <p className="link mt-6"><Link href="/">Retour à l&apos;accueil</Link></p>
      </div>
    </Layout>
  );
}
