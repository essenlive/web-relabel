// --- Core entity types ---

export interface Structure {
  id: string;
  name: string;
  adress: string;
  description: string;
  status: string;
  typologies: string[];
  contact: string;
  website?: string;
  illustrations: string[];
  colors: string[];
  communities: string[] | Community[];
  longitude: number;
  latitude: number;
  projects_designer: string[];
  projects_workshop: string[];
  projects_supplier: string[];
  projects_other: string[];
  rgpd?: boolean;
  data?: number[];
  projects?: Project[];
}

export interface Community {
  id: string;
  name: string;
  year: number;
  description: string;
  cities: string[];
  contact: string;
  website?: string;
  colors: string[];
  structures: string[] | Structure[];
  status?: boolean;
  mapData?: GeoJSONFeatureCollection;
}

export interface Project {
  id: string;
  name: string;
  typology: string;
  description: string;
  team: string[];
  date: string;
  duration: number;
  designers: string[] | Structure[];
  workshops: string[] | Structure[];
  suppliers: string[] | Structure[];
  others: string[] | Structure[];
  contact: string;
  website?: string;
  illustrations: string[];
  colors: string[];
  material_source: string;
  material_quality: string;
  material_leftovers: string;
  material_origin: string;
  design_replicability: string;
  design_sharable: string;
  design_reparable: string;
  design_durability: string | string[];
  fab_expertise: string;
  fab_local: string;
  fab_tools: string;
  fab_social: string;
  rgpd?: boolean;
  data?: {
    partners: number;
    materials: number;
    gestion: number;
    production: number;
  };
  structures?: Structure[];
}

// --- GeoJSON types ---

export interface GeoJSONFeature {
  type: "Feature";
  properties: {
    typologies: string[];
    structures: Structure[];
  };
  id: string;
  geometry: {
    type: "Point";
    coordinates: [number, number, number];
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// --- Scoring types ---

export interface Score {
  fab: number;
  material: number;
  design: number;
}

// --- Form types ---

export interface FormInputOption {
  value: string;
  label: string;
}

export interface FormInput {
  name: string;
  schema: unknown;
  type: string;
  initial: unknown;
  placeholder: string | number;
  prefix: string;
  description?: string;
  suffix: string;
  required?: boolean;
  options?: FormInputOption[];
  handler?: [(...args: unknown[]) => string[], () => number];
  group: string;
}

export interface FormConfig {
  inputs: FormInput[];
  schema: unknown;
  initialValues: Record<string, unknown>;
}

// --- Map layer types (Mapbox GL style spec subset) ---

export interface MapLayer {
  id: string;
  type: string;
  source: string;
  filter: unknown[];
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
}
