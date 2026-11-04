import Layout from '@components/Layout'
import SmartImage from '@components/SmartImage';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Re-Label | Contact',
  description: "Le projet Re-Label est porté à Paris dans le cadre du projet ReFlow, par l'équipe de Ars Longa.",
  openGraph: { images: ['/assets/logo.png'] },
};

export default function Contact() {
  return (
    <Layout padded>
      <div className="flex h-min flex-row border-4 border-primary bg-white shadow-2xl max-md:flex-col">
        <div className="w-[65%] border-r-4 border-primary max-md:w-full max-md:border-b-4 max-md:border-r-transparent [&>*]:w-full [&>*]:p-6">
          <h1 className="inline-block text-5xl leading-none font-black uppercase text-primary"> Nous contacter </h1>
          <p>
            Le projet <strong>Re-Label</strong> est porté à Paris dans le cadre du projet ReFlow, par l'équipe de Ars Longa. Si vous avez des questions, des suggestions ou autre, contactez nous directement à <Link href="mailto:info@arslonga.fr"><span className={'link'}>info@arslonga.fr</span></Link>
          </p>
          <div className="flex flex-row flex-wrap justify-between">
            <SmartImage className="h-[100px] w-1/2 min-w-[250px] object-contain" src="/assets/horizon2020_logo_black.png" alt="Horizon 2020" width={2420} height={423} />
            <SmartImage className="h-[100px] w-1/4 object-contain" src="/assets/reflow.png" alt="ReFlow" width={600} height={600} />
            <SmartImage className="h-[100px] w-1/4 object-contain" src="/assets/logo-ars-longa.png" alt="Ars Longa" width={693} height={478} />
          </div>
        </div>
        <div className="flex w-[35%] flex-col items-stretch p-6 max-md:w-full">
          <div className="flex w-full flex-col not-first:mt-4">
            <h3> Référencer une structure </h3>
            <p>
              Remplissez les informations liées à votre structure sur ce <Link href={{ pathname: '/structures/add' }}><span className={'link'}>formulaire</span></Link>.
            </p>
          </div>
          <div className="flex w-full flex-col not-first:mt-4">
            <h3> Proposer une communauté </h3>
            <p>
              Remplissez le <Link href={{ pathname: '/communities/add' }}><span className={'link'}>formulaire</span></Link> et nous validerons votre communauté au plus vite.
            </p>
          </div>
          <div className="flex w-full flex-col not-first:mt-4">
            <h3> Documenter une production </h3>
            <p>
              Utilisez le <Link href={{pathname: '/projects/add'}}><span className={'link'}>générateur de label</span></Link> et votre projet sera référencé dans la foulée.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
