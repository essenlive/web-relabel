import { createClient } from '@libs/supabase/server';
import { createStaticClient } from '@libs/supabase/static';
import { prepareData } from '@libs/mapUtils';
import type { Community, Project, Structure } from '../types';

// --- Communities ---

export async function getCommunities({ status }: { status?: boolean } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from('communities')
    .select('*, community_structures(structure:structures(*))');
  if (status !== undefined) query = query.eq('status', status);
  const { data: communities, error } = await query;
  if (error) throw error;

  return (communities || []).map((c: any) => ({
    ...c,
    structures: (c.community_structures || []).map((cs: any) => cs.structure).filter(Boolean),
    community_structures: undefined,
  })) as Community[];
}

export async function getCommunity(id: string) {
  const supabase = await createClient();
  const { data: community, error } = await supabase
    .from('communities')
    .select('*, community_structures(structure:structures(*))')
    .eq('id', id)
    .single();
  if (error) throw error;

  const structures = (community.community_structures || [])
    .map((cs: any) => cs.structure)
    .filter(Boolean)
    .map((s: any) => ({
      ...s,
      communities: [{ name: community.name } as Community],
    }));

  const result = {
    ...community,
    structures,
    community_structures: undefined,
  } as Community;
  result.mapData = prepareData(structures as Structure[]);
  return result;
}

// --- Projects ---

export async function getProjects() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*, project_structures(structure:structures(id, name), role)')
    .eq('is_draft', false);
  if (error) throw error;

  return (projects || []).map((p: any) => {
    const ps = p.project_structures || [];
    return {
      ...p,
      designers: ps.filter((r: any) => r.role === 'designer').map((r: any) => r.structure).filter(Boolean),
      workshops: ps.filter((r: any) => r.role === 'workshop').map((r: any) => r.structure).filter(Boolean),
      suppliers: ps.filter((r: any) => r.role === 'supplier').map((r: any) => r.structure).filter(Boolean),
      others: ps.filter((r: any) => r.role === 'other').map((r: any) => r.structure).filter(Boolean),
      project_structures: undefined,
    };
  }) as Project[];
}

export async function getProject(id: string) {
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select('*, project_structures(structure:structures(*), role)')
    .eq('id', id)
    .single();
  if (error) throw error;

  // Get communities for each related structure
  const structureIds = [...new Set(
    (project.project_structures || [])
      .map((ps: any) => ps.structure?.id)
      .filter(Boolean)
  )];

  const structureCommunities: Record<string, Community[]> = {};
  if (structureIds.length > 0) {
    const { data: csLinks } = await supabase
      .from('community_structures')
      .select('structure_id, community:communities(*)')
      .in('structure_id', structureIds);

    for (const link of (csLinks || []) as any[]) {
      if (!structureCommunities[link.structure_id]) structureCommunities[link.structure_id] = [];
      if (link.community) structureCommunities[link.structure_id].push(link.community);
    }
  }

  // Build unique structures with role typologies
  const structureMap = new Map<string, any>();
  for (const ps of project.project_structures || []) {
    if (!ps.structure) continue;
    if (!structureMap.has(ps.structure.id)) {
      structureMap.set(ps.structure.id, {
        ...ps.structure,
        communities: structureCommunities[ps.structure.id] || [],
        typologies: [],
      });
    }
    const roleToTypo: Record<string, string> = {
      designer: 'designer',
      supplier: 'stockage',
      other: 'autre',
      workshop: 'atelier',
    };
    structureMap.get(ps.structure.id).typologies.push(roleToTypo[ps.role] || ps.role);
  }

  const ps = project.project_structures || [];
  return {
    ...project,
    designers: ps.filter((r: any) => r.role === 'designer').map((r: any) => r.structure).filter(Boolean),
    workshops: ps.filter((r: any) => r.role === 'workshop').map((r: any) => r.structure).filter(Boolean),
    suppliers: ps.filter((r: any) => r.role === 'supplier').map((r: any) => r.structure).filter(Boolean),
    others: ps.filter((r: any) => r.role === 'other').map((r: any) => r.structure).filter(Boolean),
    structures: Array.from(structureMap.values()),
    project_structures: undefined,
  } as Project;
}

export async function getProjectForLabel(id: string) {
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select('*, project_structures(structure:structures(id, name), role)')
    .eq('id', id)
    .single();
  if (error) throw error;

  const ps = project.project_structures || [];
  return {
    ...project,
    designers: ps.filter((r: any) => r.role === 'designer').map((r: any) => r.structure).filter(Boolean),
    workshops: ps.filter((r: any) => r.role === 'workshop').map((r: any) => r.structure).filter(Boolean),
    suppliers: ps.filter((r: any) => r.role === 'supplier').map((r: any) => r.structure).filter(Boolean),
    others: ps.filter((r: any) => r.role === 'other').map((r: any) => r.structure).filter(Boolean),
    project_structures: undefined,
  } as Project;
}

// --- Structures ---

export async function getStructures() {
  const supabase = await createClient();
  const { data: structures, error } = await supabase
    .from('structures')
    .select('*, community_structures(community:communities(*)), project_structures(role)')
    .eq('is_draft', false);
  if (error) throw error;

  const { data: communities } = await supabase.from('communities').select('*');

  const enriched = (structures || []).map((s: any) => {
    const resolvedCommunities = (s.community_structures || [])
      .map((cs: any) => cs.community)
      .filter(Boolean);

    const roles = s.project_structures || [];
    return {
      ...s,
      communities: resolvedCommunities,
      data: [
        roles.filter((ps: any) => ps.role === 'designer').length,
        roles.filter((ps: any) => ps.role === 'other').length,
        roles.filter((ps: any) => ps.role === 'supplier').length,
        roles.filter((ps: any) => ps.role === 'workshop').length,
      ],
      community_structures: undefined,
      project_structures: undefined,
    };
  });

  return { structures: enriched as Structure[], communities: (communities || []) as Community[] };
}

export async function getStructure(id: string) {
  const supabase = await createClient();
  const { data: structure, error } = await supabase
    .from('structures')
    .select('*, community_structures(community:communities(*)), project_structures(project:projects(*), role)')
    .eq('id', id)
    .single();
  if (error) throw error;

  const resolvedCommunities = (structure.community_structures || [])
    .map((cs: any) => cs.community)
    .filter(Boolean);

  const roles = structure.project_structures || [];
  const allProjects = roles
    .map((ps: any) => ps.project)
    .filter(Boolean);
  const uniqueProjects = [...new Map(allProjects.map((p: any) => [p.id, p])).values()];

  return {
    ...structure,
    communities: resolvedCommunities,
    projects: uniqueProjects,
    data: [
      roles.filter((ps: any) => ps.role === 'designer').length,
      roles.filter((ps: any) => ps.role === 'other').length,
      roles.filter((ps: any) => ps.role === 'supplier').length,
      roles.filter((ps: any) => ps.role === 'workshop').length,
    ],
    community_structures: undefined,
    project_structures: undefined,
  } as Structure;
}

export async function getStructureForLabel(id: string) {
  const supabase = await createClient();
  const { data: structure, error } = await supabase
    .from('structures')
    .select('*, community_structures(community:communities(id, name)), project_structures(role)')
    .eq('id', id)
    .single();
  if (error) throw error;

  const resolvedCommunities = (structure.community_structures || [])
    .map((cs: any) => cs.community)
    .filter(Boolean);

  const roles = structure.project_structures || [];
  return {
    ...structure,
    communities: resolvedCommunities,
    data: [
      roles.filter((ps: any) => ps.role === 'designer').length,
      roles.filter((ps: any) => ps.role === 'other').length,
      roles.filter((ps: any) => ps.role === 'supplier').length,
      roles.filter((ps: any) => ps.role === 'workshop').length,
    ],
    community_structures: undefined,
    project_structures: undefined,
  } as Structure;
}

// --- IDs for generateStaticParams ---

export async function getAllCommunityIds() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('communities').select('id');
  return (data || []).map((c) => ({ id: c.id }));
}

export async function getAllProjectIds() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('projects').select('id').eq('is_draft', false);
  return (data || []).map((p) => ({ id: p.id }));
}

export async function getAllStructureIds() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('structures').select('id').eq('is_draft', false);
  return (data || []).map((s) => ({ id: s.id }));
}
