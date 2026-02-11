import type { Structure, GeoJSONFeature, GeoJSONFeatureCollection } from '../types';

export function prepareData(structureList: Structure[]): GeoJSONFeatureCollection {
  const data: Record<string, GeoJSONFeature> = {}
  structureList.forEach((el) => {
    const hash = `lo-${el.longitude}la-${el.latitude}`
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
          coordinates: [el.longitude, el.latitude, 0]
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
