import Link from 'next/link';

function FooterSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col w-full p-4 hover:bg-gray-100 ${className ?? ''}`}>
      <h3 className="mb-1">{title}</h3>
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full border-t-4 border-primary bg-white mt-auto">
      <div className="flex flex-row w-full max-w-270 mx-auto px-4 max-md:flex-col">

        <div className="w-[55%] py-4 max-md:w-full *:py-2">
          <h2 className="text-primary leading-none uppercase font-black text-3xl">A propos</h2>
          <p>
            Le projet <strong>RE-label</strong> est porté à Paris dans le cadre du projet ReFlow, par l&apos;équipe de Ars Longa. Si vous avez des questions, des suggestions ou autre, contactez nous directement à <Link href="mailto:info@arslonga.fr"><span className="link">info@arslonga.fr</span></Link>
          </p>
          <div className="flex flex-row justify-between mt-6 p-4 gap-4">
            <img className="w-1/2 min-w-62.5 h-20 object-contain" src='/assets/horizon2020_logo_black.png' alt='logo h2020' />
            <img className="w-1/4 h-20 object-contain" src='/assets/reflow.png' alt='logo reflow' />
            <img className="w-1/4 h-20 object-contain" src='/assets/LOGO AL couleurs.png' alt='logo ars longa' />
          </div>
        </div>

        <div className="w-[45%] border-x-4 border-primary grid grid-cols-2 grid-rows-2 max-md:flex max-md:flex-col max-md:w-full max-md:border-x-0 max-md:border-t-4">
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
            <p><Link href="/projects/add"><span className="link-simple">Labeliser un projet</span></Link></p>
          </FooterSection>

          <FooterSection title="Contact">
            <p><Link href="/contact"><span className="link-simple">Nous contacter</span></Link></p>
            <p><Link href="https://github.com/essenlive/relabel"><span className="link-simple">Github</span></Link></p>
          </FooterSection>
        </div>

      </div>
    </footer>
  );
}
