import LabelCommunity from '@components/LabelCommunity';
import styles from '@styles/pages/Embeds.module.css';
import { getCommunity, getAllCommunityIds } from '@libs/data';

export const revalidate = 60;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return await getAllCommunityIds();
}

export default async function CommunityLabelPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const community = await getCommunity(id);
  return (
    <div className={styles.embed}>
      <a href={`https://re-label.eu/communities/${community.id}`} target={"_parent"}></a>
      <LabelCommunity community={community} bordered />
    </div>
  );
}
