import LabelProject from '@components/LabelProject';
import styles from '@styles/pages/Embeds.module.css';
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
    <div className={styles.embed}>
      <a href={`https://re-label.eu/projects/${project.id}`} target={"_parent"}></a>
      <LabelProject project={project} bordered />
    </div>
  );
}
