'use client';
import 'mapbox-gl/dist/mapbox-gl.css';
import SmartImage from '@components/SmartImage';
import React, { useState, useRef, useCallback } from 'react';
import ReactMapGL, { Popup, Source, Layer } from 'react-map-gl/mapbox';
import Link from 'next/link';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer, workshopsLayer, othersLayer, suppliersLayer, designersLayer } from '@libs/layers';
import Tags from '@components/Tags';
import {createMap} from '@libs/getColors'
import { cn } from '@libs/utils';
import type { GeoJSONFeatureCollection, Structure } from '../types';

const INTERACTIVE_LAYERS = [
  clusterLayer.id!,
  unclusteredPointLayer.id!,
  designersLayer.id!,
  workshopsLayer.id!,
  suppliersLayer.id!,
  othersLayer.id!,
];

function validCoords(lng: unknown, lat: unknown): [number, number] | null {
  const lo = Number(lng);
  const la = Number(lat);
  if (!isFinite(lo) || !isFinite(la)) return null;
  return [lo, la];
}

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface ReactMapProps {
  className?: string;
  structures: GeoJSONFeatureCollection;
  initialViewport?: Viewport;
  colorMap?: string[];
  // [west, south, east, north] of the visible area, on load and after each move.
  onBoundsChange?: (bounds: [number, number, number, number]) => void;
}

export default function ReactMap({ className, structures, initialViewport, colorMap = ["#D3494E", "#FFE5AD", "#13BBAF", "#7BC8F6"], onBoundsChange}: ReactMapProps) {
  if (!initialViewport || !validCoords(initialViewport.longitude, initialViewport.latitude)) {
    initialViewport = {
      latitude: 48.85658,
      longitude: 2.3518,
      zoom: 10
    }
  }
  const resolvedColorMap: Map<string, string> = createMap(colorMap)

  const [selection, setSelection] = useState<Structure | undefined | null>(undefined);
  const [picker, setPicker] = useState<Structure[] | undefined | null>(undefined);
  const [cursor, setCursor] = useState('grab');
  const close = (): void => { setSelection(undefined); setPicker(undefined); };
  const mapRef = useRef<any>(null);

  workshopsLayer.paint!["circle-color"] = resolvedColorMap.get("atelier");
  designersLayer.paint!["circle-color"] = resolvedColorMap.get("designer");
  suppliersLayer.paint!["circle-color"] = resolvedColorMap.get("stockage");
  othersLayer.paint!["circle-color"] = resolvedColorMap.get("autre");

  const emitBounds = useCallback(() => {
    const b = mapRef.current?.getBounds();
    if (b && onBoundsChange) onBoundsChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
  }, [onBoundsChange]);

  const flyTo = useCallback((longitude: number, latitude: number, zoom?: number) => {
    if (!isFinite(longitude) || !isFinite(latitude)) return;
    // Don't pass `zoom: undefined`: mapbox does `+options.zoom` (NaN) when the key exists.
    mapRef.current?.flyTo({ center: [longitude, latitude], ...(zoom != null && { zoom }), duration: 500 });
  }, []);

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('grab'), []);

  const onMapClick = (event: any): void => {
    if (!event.features || event.features.length === 0) {
      close();
      return;
    }
    const feature = event.features[0];
    const coords = validCoords(feature.geometry?.coordinates?.[0], feature.geometry?.coordinates?.[1]);
    if (!coords) return;
    const [lng, lat] = coords;

    if (feature.properties.cluster) {
      const clusterId = feature.properties.cluster_id;
      const mapboxSource = mapRef.current?.getSource('structures');
      mapboxSource?.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
        if (err) return;
        flyTo(lng, lat, zoom);
      });
    }
    else {
      let parsed: any[];
      try {
        parsed = JSON.parse(feature.properties.structures);
      } catch {
        return;
      }
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      if (parsed.length === 1) {
        const data = { ...parsed[0], longitude: lng, latitude: lat };
        flyTo(lng, lat);
        setSelection(data)
        setPicker(null)
      } else {
        const data = parsed.map((s: any) => ({ ...s, longitude: lng, latitude: lat }));
        flyTo(lng, lat);
        setSelection(null)
        setPicker(data)
      }
    }
  };
  const onPickerClick = (el: any): void => {
      const coords = validCoords(el.longitude, el.latitude);
      if (coords) flyTo(coords[0], coords[1]);
      setSelection(el)
      setPicker(null)
  };

  const selectionCoords = selection ? validCoords(selection.longitude, selection.latitude) : null;
  const pickerCoords = picker?.[0] ? validCoords(picker[0].longitude, picker[0].latitude) : null;

  return  (<div className={cn(className)} style={{ width: "100%", height: "100%" }}><ReactMapGL
      initialViewState={initialViewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOXTOKEN}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/essen/cjtsfp7dc00201fmfl8jllc3k"
      interactiveLayerIds={INTERACTIVE_LAYERS}
      cursor={cursor}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onMapClick}
      onLoad={emitBounds}
      onMoveEnd={emitBounds}
      ref={mapRef}
    >

      <Source
        id="structures"
        type="geojson"
        data={structures as any}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={20}
      >
        <Layer {...clusterLayer as any} />
        <Layer {...clusterCountLayer as any} />
        <Layer {...unclusteredPointLayer as any} />
        <Layer {...workshopsLayer as any} />
        <Layer {...designersLayer as any} />
        <Layer {...suppliersLayer as any} />
        <Layer {...othersLayer as any} />
      </Source>

      {selection && selectionCoords && <Popup
        latitude={selectionCoords[1]}
        longitude={selectionCoords[0]}
        closeButton={true}
        closeOnClick={false}
        onClose={() => close()}
        anchor="top" >
        <div className="p-3">
          {selection.illustrations?.[0] && (
            <SmartImage
              src={selection.illustrations[0]}
              alt={selection.name}
              width={400}
              height={240}
              className="-mt-3 -ml-3 mb-2 h-[120px] w-[calc(100%+1.5rem)] border-b-[3px] border-primary object-cover"
            />
          )}
          <h3 className="mb-1 text-sm font-bold uppercase">
            {selection.name}
          </h3>
          <Tags tags={selection.typologies} colorMap={resolvedColorMap} />
          <Link href={`/structures/${selection.id}`}>
            <p className="link mt-2 text-sm">Voir la structure</p>
          </Link>
        </div>
      </Popup>}

      {picker && pickerCoords && <Popup
        latitude={pickerCoords[1]}
        longitude={pickerCoords[0]}
        closeButton={true}
        closeOnClick={false}
        onClose={() => close()}
        anchor="top" >
        <div className="z-1000 block p-2">
          <h3 className="pl-8">Structures</h3>
        {picker.map((el: Structure, i: number)=>{
          return(
            <div className="mt-2 flex cursor-pointer flex-row items-center justify-between hover:[&>span]:font-bold" key={el.id} onClick={()=>{onPickerClick(el)}}>
              <span>{el.name}</span>
              <Tags tags={el.typologies} colorMap={resolvedColorMap}/>
            </div>
          )
        })}
        </div>

      </Popup>}

  </ReactMapGL>
  </div>)}
