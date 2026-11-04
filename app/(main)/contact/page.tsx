import Layout from '@components/Layout'
import SmartImage from '@components/SmartImage';
import styles from '@styles/pages/Contact.module.css'
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
      <div className={styles.banner}>
        <div className={styles.header}>
          <h1> Nous contacter </h1>
          <p>
            Le projet <strong>Re-Label</strong> est porté à Paris dans le cadre du projet ReFlow, par l'équipe de Ars Longa. Si vous avez des questions, des suggestions ou autre, contactez nous directement à <Link href="mailto:info@arslonga.fr"><span className={'link'}>info@arslonga.fr</span></Link>
          </p>
          <div className={styles.logos}>
            <SmartImage src="/assets/horizon2020_logo_black.png" alt="Horizon 2020" width={2420} height={423} />
            <SmartImage src="/assets/reflow.png" alt="ReFlow" width={600} height={600} />
            <SmartImage src="/assets/logo-ars-longa.png" alt="Ars Longa" width={693} height={478} />
          </div>
        </div>
        <div className={styles.items}>
          <div>
            <h3> Référencer une structure </h3>
            <p>
              Remplissez les informations liées à votre structure sur ce <Link href={{ pathname: '/structures/add' }}><span className={'link'}>formulaire</span></Link>.
            </p>
          </div>
          <div>
            <h3> Proposer une communauté </h3>
            <p>
              Remplissez le <Link href={{ pathname: '/communities/add' }}><span className={'link'}>formulaire</span></Link> et nous validerons votre communauté au plus vite.
            </p>
          </div>
          <div>
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
