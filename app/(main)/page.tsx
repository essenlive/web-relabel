import Layout from '@components/Layout'
import SmartImage from '@components/SmartImage';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Re-Label | Valorisateur des pratiques du réemploi',
  description: 'Un outil collaboratif qui recense et partage',
  openGraph: { images: ['/assets/logo.png'] },
};

export default function Home() {
  return (
    <Layout padded>
      <div className="flex w-full flex-col self-center border-4 border-primary bg-white shadow-2xl">
        <div className="flex flex-row border-b-4 border-primary max-md:flex-col">
          <h1 className="flex w-[40%] flex-col items-center justify-center border-r-4 border-primary p-4 text-7xl leading-none font-black uppercase text-primary max-md:w-full max-md:border-0">Re-Label</h1>
          <h2 className="flex w-[60%] flex-col justify-center p-4 text-3xl leading-none font-black max-md:w-full">Un outil collaboratif qui recense et partage</h2>
        </div>
        <div className="w-full p-4 max-md:hidden">
          <SmartImage className="w-full p-4" src="/assets/hero-blank.png" alt="Illustration du processus de réemploi" width={2706} height={599} priority />
        </div>
        <div className="relative -top-12 flex h-0 w-full flex-row items-stretch justify-between max-md:hidden">
          <div className="flex h-12 w-1/4 flex-col"></div>
          <div className="flex h-12 w-1/4 flex-col border-l-4 border-primary"></div>
          <div className="flex h-12 w-1/4 flex-col border-l-4 border-primary"></div>
          <div className="flex h-12 w-1/4 flex-col border-l-4 border-primary"></div>
        </div>
        <div className="flex w-full flex-row items-stretch justify-between max-md:flex-col">
          <div className="w-1/3 border-t-4 border-primary bg-white p-4 hover:bg-gray-100 not-last:border-r-4 max-md:w-full max-md:border-r-0! max-md:first:border-t-0! [&>*]:mb-4">
            <h2>Des productions responsables</h2>
            <p>Re-Label met en avant des productions responsables et vertueuses qui contribuent au développement d'une nouvelle manière de produire et consommer.</p>
            <p className="link"><Link href="/projects">Voir les productions</Link></p>
          </div>
          <div className="w-1/3 border-t-4 border-primary bg-white p-4 hover:bg-gray-100 not-last:border-r-4 max-md:w-full max-md:border-r-0! max-md:first:border-t-0! [&>*]:mb-4">
            <h2>Des structures engagées</h2>
            <p>Re-Label cartographie les structures qui contribuent et portent ces projets pour valoriser leur démarche collaborative.</p>
            <p className="link"><Link href="/structures">Voir la carte des structures</Link></p>
          </div>
          <div className="w-1/3 border-t-4 border-primary bg-white p-4 hover:bg-gray-100 not-last:border-r-4 max-md:w-full max-md:border-r-0! max-md:first:border-t-0! [&>*]:mb-4">
            <h2>Des communautés locales</h2>
            <p>Re-Label documente le développement de réseaux de collaborations localisés. Re-Label permet de visualiser l'état des écosystèmes sur les différents territoires.</p>
            <p className="link"><Link href="/communities">Voir les communautés</Link></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
