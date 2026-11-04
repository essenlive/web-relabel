import { pageUrl } from '@libs/site';
import LabelProject from '@components/LabelProject';
import { getProjectForLabel, getAllProjectIds } from '@libs/data';
import type { Project } from '../../../../../types';

export const revalidate = 60;

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return await getAllProjectIds();
}

export default async function ProjectLabelPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const project: Project = await getProjectForLabel(id);
  return (
    <div className="relative h-[300px] w-[240px]">
      <a href={pageUrl(`/projects/${project.id}`)} target={"_parent"} className="absolute z-10 size-full" aria-label="Voir la fiche sur Re-Label"></a>
      <LabelProject project={project} bordered />
    </div>
  );
}
