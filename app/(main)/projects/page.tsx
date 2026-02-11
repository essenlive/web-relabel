import type { Metadata } from 'next';
import Layout from '@components/Layout';
import LabelProject from '@components/LabelProject';
import Card from '@components/Card';
import { getProjects } from '@libs/data';
import type { Project } from '../../../types';

export const revalidate = 1;
export const metadata: Metadata = {
  title: 'Re-label | Productions',
  description: "Le Re-Label vise a mettre en avant les projets labelisés et issus d'une démarche responsable.",
  openGraph: { images: ['/assets/logo.png'] },
};

export default async function ProjectsPage(): Promise<React.JSX.Element> {
  const projects: Project[] = await getProjects();

  return (
    <Layout padded grid>
      {projects.map((project: Project, i: number) => {
        return (
          <Card
            key={i}
            title={project.name}
            tags={[project.typology]}
            image={{ src: project.illustrations[0], alt: project.name }}
            link={{ path: `/projects/${project.id}`, text: "Voir le projet" }}
            colorMap={project.colors}
            id={project.id}
          >
            <LabelProject project={project} />
          </Card>
        )
      })}
      <Card
        title={"Votre projet ?"}
        description={"Vous voulez documenter un projet éco-conçu et en quantifier la démarche ?"}
        link={{ path: `/projects/add`, text: "Labeliser un projet" }}
      />
    </Layout>
  );
}
