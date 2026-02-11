import type { Metadata } from 'next';
import { getCommunity, getAllCommunityIds } from '@libs/data';
import CommunityDetail from './CommunityDetail';

export const revalidate = 60;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return await getAllCommunityIds();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const community = await getCommunity(id);
  return {
    title: `Re-label | ${community.name}`,
    description: community.description || null,
    openGraph: {
      images: ['/assets/logo.png'],
    },
  };
}

export default async function CommunityPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const community = await getCommunity(id);
  return <CommunityDetail community={community} />;
}
