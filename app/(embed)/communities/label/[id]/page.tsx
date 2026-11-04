import { pageUrl } from '@libs/site';
import LabelCommunity from '@components/LabelCommunity';
import { getCommunity, getAllCommunityIds } from '@libs/data';

export const revalidate = 60;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return await getAllCommunityIds();
}

export default async function CommunityLabelPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const community = await getCommunity(id);
  return (
    <div className="relative h-[300px] w-[240px]">
      <a href={pageUrl(`/communities/${community.id}`)} target={"_parent"} className="absolute z-10 size-full" aria-label="Voir la fiche sur Re-Label"></a>
      <LabelCommunity community={community} bordered />
    </div>
  );
}
