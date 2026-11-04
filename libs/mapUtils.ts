import type { Structure, GeoJSONFeature, GeoJSONFeatureCollection } from '../types';

export function prepareData(structureList: Structure[]): GeoJSONFeatureCollection {
  const data: Record<string, GeoJSONFeature> = {}
  structureList.forEach((el) => {
    if (el.longitude == null || el.latitude == null) return;
    const lng = Number(el.longitude);
    const lat = Number(el.latitude);
    if (!isFinite(lng) || !isFinite(lat)) return;

    const hash = `lo-${lng}la-${lat}`
    if (!data[hash]) {
      data[hash] = {
        type: "Feature",
        properties: {
          typologies: el.typologies,
          structures: [el]
        },
        id: hash,
        geometry: {
          type: "Point",
          coordinates: [lng, lat, 0]
        }
      }
    }
    else {
      data[hash].properties.typologies = Array.from(new Set([...data[hash].properties.typologies, ...el.typologies]))
      data[hash].properties.structures.push(el)
    }
  })
  return {
    type: "FeatureCollection",
    features: Object.values(data)
  }
}
