import prisma, { serialize, manageImages } from '@libs/prisma';
import { prepareData } from '@libs/mapUtils';
import type { Community, Project, Structure } from '../types';

// --- Communities ---

export async function getCommunities({ status }: { status?: boolean } = {}) {
  const where = status !== undefined ? { status } : undefined;
  let communities = await prisma.community.findMany(where ? { where } : undefined) as unknown as Community[];
  const structures = await prisma.structure.findMany() as unknown as Structure[];

  communities = communities.map((community) => {
    community.structures = (community.structures as string[]).map((structureId) => {
      const structure = structures.filter((el) => el.id === structureId);
      return structure[0]
    })
    return community
  })

  return serialize(communities);
}

export async function getCommunity(id: string) {
  let communities = await prisma.community.findMany({ where: { id } }) as unknown as Community[];
  let community = communities[0];
  const structures = await prisma.structure.findMany() as unknown as Structure[];

  community.structures = (community.structures as string[]).map((structureId) => {
    const structure = structures.filter((el) => el.id === structureId);
    (structure[0] as Structure).communities = [{ name: community.name } as Community];
    return structure[0]
  })

  community.mapData = prepareData(community.structures as Structure[])

  return serialize(community);
}

// --- Projects ---

export async function getProjects() {
  let projects = await prisma.project.findMany() as unknown as Project[];
  const structures = await prisma.structure.findMany() as unknown as Structure[];

  projects = await Promise.all(projects.map(async (project) => {
    project.illustrations = await Promise.all(project.illustrations.map(async (illu, i) => await manageImages(illu, project.name, i)))
    return project
  }))

  projects = projects.map((project) => {
    project.designers = (project.designers as string[]).map((structureId) => {
      const structure = structures.filter((el) => el.id === structureId);
      return structure[0]
    })
    return project
  })

  return serialize(projects);
}

export async function getProject(id: string) {
  const projects = await prisma.project.findMany({ where: { id } }) as unknown as Project[];
  const project = projects[0];
  project.illustrations = await Promise.all(project.illustrations.map(async (illu, i) => await manageImages(illu, project.name, i)))
  const structures = await prisma.structure.findMany() as unknown as Structure[];
  const communities = await prisma.community.findMany() as unknown as Community[];

  const allStructureIds = [...(project.designers as string[]), ...(project.suppliers as string[]), ...(project.workshops as string[]), ...(project.others as string[])]
  project.structures = [...new Set(allStructureIds)] as any

  project.structures = (project.structures as unknown as string[]).map((structureId) => {
    let structure = structures.filter((el) => el.id === structureId)[0];
    structure.communities = (structure.communities as string[]).map((communityId) => {
      const community = communities.filter((el) => el.id === communityId);
      return community[0]
    })
    ;(structure as Structure & { typologies: string[] }).typologies = []
    if ((project.designers as string[]).indexOf(structureId) >= 0) structure.typologies = [...structure.typologies, "designer"]
    if ((project.suppliers as string[]).indexOf(structureId) >= 0) structure.typologies = [...structure.typologies, "stockage"]
    if ((project.others as string[]).indexOf(structureId) >= 0) structure.typologies = [...structure.typologies, "autre"]
    if ((project.workshops as string[]).indexOf(structureId) >= 0) structure.typologies = [...structure.typologies, "atelier"]
    return structure
  })

  return serialize(project);
}

export async function getProjectForLabel(id: string) {
  const projects = await prisma.project.findMany({ where: { id } }) as unknown as Project[];
  const project = projects[0];
  const structures = await prisma.structure.findMany() as unknown as Structure[];
  project.designers = (project.designers as string[]).map((structureId) => {
    const structure = structures.filter((el) => el.id === structureId);
    return structure[0]
  })
  return serialize(project);
}

// --- Structures ---

export async function getStructures() {
  const communities = await prisma.community.findMany() as unknown as Community[];
  let structures = await prisma.structure.findMany() as unknown as Structure[];
  structures = await Promise.all(structures.map(async (structure) => {
    structure.illustrations = await Promise.all(structure.illustrations.map(async (illu, i) => await manageImages(illu, structure.name, i)))
    return structure
  }))

  structures = structures.map((structure) => {
    structure.communities = (structure.communities as string[]).map((communityId) => {
      const community = communities.filter((el) => el.id === communityId);
      return community[0]
    })
    structure.data = [structure.projects_designer.length, structure.projects_other.length, structure.projects_supplier.length, structure.projects_workshop.length]
    return structure
  })

  return { structures: serialize(structures), communities: serialize(communities) };
}

export async function getStructure(id: string) {
  const structs = await prisma.structure.findMany({ where: { id } }) as unknown as Structure[];
  let structure = structs[0];
  structure.illustrations = await Promise.all(structure.illustrations.map(async (illu, i) => await manageImages(illu, structure.name, i)))

  const projects = await prisma.project.findMany() as unknown as Project[];
  const communities = await prisma.community.findMany() as unknown as Community[];

  structure.communities = (structure.communities as string[]).map((communityId) => {
    const community = communities.filter((el) => el.id === communityId);
    return community[0]
  })

  const allProjectIds = [...structure.projects_designer, ...structure.projects_supplier, ...structure.projects_workshop, ...structure.projects_other]
  structure.projects = [...new Set(allProjectIds)].map((projectId) => {
    const project = projects.filter((el) => el.id === projectId);
    return project[0]
  })

  return serialize(structure);
}

export async function getStructureForLabel(id: string) {
  const structs = await prisma.structure.findMany({ where: { id } }) as unknown as Structure[];
  let structure = structs[0];
  const communities = await prisma.community.findMany() as unknown as Community[];

  structure.communities = (structure.communities as string[]).map((communityId) => {
    const community = communities.filter((el) => el.id === communityId);
    return community[0]
  })

  return serialize(structure);
}

// --- IDs for generateStaticParams ---

export async function getAllCommunityIds() {
  const communities = await prisma.community.findMany() as unknown as Community[];
  return communities.map(c => ({ id: c.id }));
}

export async function getAllProjectIds() {
  const projects = await prisma.project.findMany() as unknown as Project[];
  return projects.map(p => ({ id: p.id }));
}

export async function getAllStructureIds() {
  const structures = await prisma.structure.findMany() as unknown as Structure[];
  return structures.map(s => ({ id: s.id }));
}
