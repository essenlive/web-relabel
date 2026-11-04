import "@styles/globals.css";
import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import { SITE_URL } from '@libs/site';

const barlow = Barlow({ subsets: ['latin'], weight: ['200', '300', '400', '500', '600', '700', '800', '900'], variable: '--font-barlow', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Re-Label',
  description: 'Un outil collaboratif qui recense et partage',
  icons: { icon: '/Favicon.png' },
  openGraph: {
    locale: 'fr_FR',
    siteName: 'Re-Label',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={barlow.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
