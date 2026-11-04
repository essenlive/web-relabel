import type { MetadataRoute } from 'next';
import { SITE_URL } from '@libs/site';
import { getAllCommunityIds, getAllProjectIds, getAllStructureIds } from '@libs/data';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [communities, projects, structures] = await Promise.all([
    getAllCommunityIds(), getAllProjectIds(), getAllStructureIds(),
  ]);
  const statics = ['', '/communities', '/structures', '/projects', '/practices', '/contact']
    .map((path) => ({ url: `${SITE_URL}${path}` }));
  return [
    ...statics,
    ...communities.map(({ id }) => ({ url: `${SITE_URL}/communities/${id}` })),
    ...structures.map(({ id }) => ({ url: `${SITE_URL}/structures/${id}` })),
    ...projects.map(({ id }) => ({ url: `${SITE_URL}/projects/${id}` })),
  ];
}
