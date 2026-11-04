import "@styles/globals/globals.css";
import "@styles/globals/map.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'Re-Label',
  description: 'Un outils collaboratif qui recense et partage',
  icons: { icon: '/Favicon.png' },
  openGraph: {
    locale: 'fr_FR',
    siteName: 'Re-Label',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const umami = process.env.NEXT_PUBLIC_UMAMI ? JSON.parse(process.env.NEXT_PUBLIC_UMAMI) as { id: string; url: string } : null;
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
