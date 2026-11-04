import type { Metadata } from 'next';
import AddProjectForm from './AddProjectForm';

export const metadata: Metadata = {
  title: 'Re-Label | Labelliser un projet',
  description: "Remplissez le formulaire afin de labelliser votre projet.",
  openGraph: { images: ['/assets/logo.png'] },
};

export default function AddProjectPage(): React.JSX.Element {
  return <AddProjectForm />;
}
