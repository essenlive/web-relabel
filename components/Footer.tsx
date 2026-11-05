import SmartImage from '@components/SmartImage';
import Link from 'next/link';

function FooterSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col w-full p-4 ${className ?? ''}`}>
      <h3 className="mb-1">{title}</h3>
      {children}
    </div>
  );
}

export default function Footer({ wide }: { wide?: boolean }) {
  return (
    <footer className="w-full border-t-4 border-primary bg-white mt-auto">
      <div className={`flex flex-row w-full mx-auto max-md:flex-col ${wide ? "" : "max-w-270 px-4"}`}>

        <div className={`w-[55%] py-4 max-md:w-full *:py-2 ${wide ? "px-6 lg:px-10" : ""}`}>
          <h2 className="text-primary leading-none uppercase font-black text-3xl">À propos</h2>
          <p>
            Le projet <strong>Re-Label</strong> est porté à Paris dans le cadre du projet ReFlow, par l&apos;équipe de Ars Longa. Si vous avez des questions, des suggestions ou autre, contactez nous directement à <Link href="mailto:info@arslonga.fr"><span className="link">info@arslonga.fr</span></Link>
          </p>
          <div className="flex flex-row justify-between mt-6 p-4 gap-4 max-md:flex-wrap max-md:justify-center">
            <SmartImage className="w-1/2 min-w-62.5 max-md:w-full max-md:min-w-0 h-20 object-contain" src="/assets/horizon2020_logo_black.png" alt="Horizon 2020" width={2420} height={423} />
            <SmartImage className="w-1/4 h-20 object-contain" src="/assets/reflow.png" alt="ReFlow" width={600} height={600} />
            <SmartImage className="w-1/4 h-20 object-contain" src="/assets/logo-ars-longa.png" alt="Ars Longa" width={693} height={478} />
          </div>
        </div>

        <div className={`w-[45%] border-primary grid grid-cols-2 grid-rows-2 max-md:flex max-md:flex-col max-md:w-full max-md:border-x-0 max-md:border-t-4 ${wide ? "border-l-4" : "border-x-4"}`}>
          <FooterSection title="Communautés" className="border-r-4 border-b-4 border-primary max-md:border-none">
            <p><Link href="/communities/"><span className="link-simple">Liste des communautés</span></Link></p>
            <p><Link href="/communities/add"><span className="link-simple">Proposer une communauté</span></Link></p>
          </FooterSection>

          <FooterSection title="Structures" className="border-b-4 border-primary max-md:border-none">
            <p><Link href="/structures/"><span className="link-simple">Carte des structures</span></Link></p>
            <p><Link href="/structures/add"><span className="link-simple">Référencer la votre</span></Link></p>
          </FooterSection>

          <FooterSection title="Productions" className="border-r-4 border-primary max-md:border-none">
            <p><Link href="/projects/"><span className="link-simple">Portfolio</span></Link></p>
            <p><Link href="/projects/add"><span className="link-simple">Labelliser un projet</span></Link></p>
          </FooterSection>

          <FooterSection title="Contact">
            <p><Link href="/contact"><span className="link-simple">Nous contacter</span></Link></p>
            <p><Link href="https://github.com/essenlive/web-relabel"><span className="link-simple">Github</span></Link></p>
          </FooterSection>
        </div>

      </div>
    </footer>
  );
}
