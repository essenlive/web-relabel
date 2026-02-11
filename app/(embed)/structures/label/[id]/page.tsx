import type { Metadata } from 'next';
import LabelStructure from '@components/LabelStructure';
import styles from '@styles/pages/Embeds.module.css';
import { getStructureForLabel, getAllStructureIds } from '@libs/data';

export const revalidate = 1;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return await getAllStructureIds();
}

export default async function StructureLabelPage({ params }: { params: Promise<{ id: string }> }): Promise<React.ReactElement> {
  const { id } = await params;
  const structure = await getStructureForLabel(id);
  return (
    <div className={styles.embed}>
      <a href={`https://re-label.eu/structures/${structure.id}`} target={"_parent"}></a>
      <LabelStructure structure={structure} bordered />
    </div>
  );
}
