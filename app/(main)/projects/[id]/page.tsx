import type { Metadata } from 'next';
import { getProject, getAllProjectIds } from '@libs/data';
import ProjectDetail from './ProjectDetail';
import type { Project } from '../../../../types';

export const revalidate = 60;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return await getAllProjectIds();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project: Project = await getProject(id);
  return {
    title: `Re-label | ${project.name}`,
    description: project.description || null,
    openGraph: {
      images: project.illustrations ? [project.illustrations[0]] : ['/assets/logo.png'],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const project: Project = await getProject(id);
  return <ProjectDetail project={project} />;
}
