import type { Metadata } from 'next';
import AddCommunitiesForm from './AddCommunitiesForm';

export const metadata: Metadata = {
  title: 'Re-label | Proposer une communaut\u00e9',
  description: "Remplissez le formulaire afin de proposer une nouvelle communaut\u00e9.",
  openGraph: { images: ['/assets/logo.png'] },
};

export default function AddCommunityPage(): React.JSX.Element {
  return <AddCommunitiesForm />;
}
