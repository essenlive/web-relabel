import type { Metadata } from 'next';
import AddCommunitiesForm from './AddCommunitiesForm';

export const metadata: Metadata = {
  title: 'Re-Label | Proposer une communautÃ©',
  description: "Remplissez le formulaire afin de proposer une nouvelle communautÃ©.",
  openGraph: { images: ['/assets/logo.png'] },
};

export default function AddCommunityPage(): React.JSX.Element {
  return <AddCommunitiesForm />;
}
