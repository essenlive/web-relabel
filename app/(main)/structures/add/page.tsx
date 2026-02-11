import type { Metadata } from 'next';
import AddStructureForm from './AddStructureForm';

export const metadata: Metadata = {
  title: 'Re-label | Référencer une structure',
  description: "Remplissez le formulaire afin de référencer votre structure au sein de l'écosystème Re-Label.",
  openGraph: { images: ['/assets/logo.png'] },
};

export default function AddStructurePage(): React.ReactElement {
  return <AddStructureForm />;
}
