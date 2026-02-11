import type { Metadata } from 'next';
import { getStructure, getAllStructureIds } from '@libs/data';
import StructureDetail from './StructureDetail';

export const revalidate = 1;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return await getAllStructureIds();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const structure = await getStructure(id);
  return {
    title: `Re-label | ${structure.name}`,
    description: structure.description || null,
    openGraph: {
      images: structure.illustrations ? [structure.illustrations[0]] : ['/assets/logo.png'],
    },
  };
}

export default async function StructurePage({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactElement> {
  const { id } = await params;
  const structure = await getStructure(id);
  return <StructureDetail structure={structure} />;
}
