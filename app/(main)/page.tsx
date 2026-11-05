import Layout from '@components/Layout'
import SmartImage from '@components/SmartImage';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Re-Label | Le référentiel du réemploi',
  description: 'Re-Label recense les productions, les structures et les communautés qui font vivre le réemploi, et les rend visibles sur une carte collaborative.',
  openGraph: { images: ['/assets/logo.png'] },
};

const STEPS = ['Matières et formes brutes', 'Production centralisée', 'Ateliers locaux en réseau'];

// The link stretches over the whole card, so the card is the click target.
const cardLink = "after:absolute after:inset-0 after:content-['']";

const CARDS = [
  { title: 'Des productions responsables', text: 'Les réalisations vertueuses qui font émerger une autre manière de produire et de consommer.', href: '/projects', link: 'Voir les productions' },
  { title: 'Des structures engagées', text: 'Ateliers, designers, fournisseurs et partenaires, cartographiés pour valoriser leur démarche collaborative.', href: '/structures', link: 'Voir la carte des structures' },
  { title: 'Des communautés locales', text: "Les réseaux de collaboration d'un territoire, pour visualiser l'état de chaque écosystème.", href: '/communities', link: 'Voir les communautés' },
];

export default function Home() {
  return (
    <Layout padded>
      <div className="flex w-full flex-col self-center border-4 border-primary bg-white shadow-2xl">
        <h1 className="sr-only">Re-Label, le référentiel ouvert des productions du réemploi</h1>
        <figure className="p-6">
          <SmartImage className="w-full" src="/assets/hero-blank.png" alt="Schéma : des matières brutes passent par une grande usine, puis par un réseau de petits ateliers locaux." width={2706} height={599} priority />
          <figcaption className="mt-4 grid grid-cols-3 gap-4 text-center text-sm font-semibold text-primary max-md:text-xs">
            {STEPS.map((step) => <span key={step}>{step}</span>)}
          </figcaption>
        </figure>

        <div className="flex w-full flex-row items-stretch justify-between max-md:flex-col">
          {CARDS.map((c) => (
            <div key={c.href} className="relative w-1/3 border-t-4 border-primary bg-white p-6 hover:bg-gray-100 not-last:border-r-4 max-md:w-full max-md:border-r-0! [&>*]:mb-4 [&>*:last-child]:mb-0">
              <h2>{c.title}</h2>
              <p>{c.text}</p>
              <p className="link"><Link className={cardLink} href={c.href}>{c.link}</Link></p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
