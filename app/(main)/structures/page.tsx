import type { Metadata } from 'next';
import { getStructures } from '@libs/data';
import StructuresClient from './StructuresClient';

export const revalidate = 60;
export const metadata: Metadata = {
  title: 'Re-label | Carte',
  description: "Le Re-Label vise a mettre en valeur les structures du territoire qui portent une démarche responsable et écologique.",
  openGraph: { images: ['/assets/logo.png'] },
};

export default async function StructuresPage(): Promise<React.ReactElement> {
  const { structures, communities } = await getStructures();
  return <StructuresClient structures={structures} communities={communities} />;
}
