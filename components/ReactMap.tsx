'use client';
import React, { useState, useRef, useCallback } from 'react';
import ReactMapGL, { Popup, Source, Layer } from 'react-map-gl';
import styles from "@styles/pages/Structures.module.css";
import Link from 'next/link';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer, workshopsLayer, othersLayer, suppliersLayer, designersLayer } from '@libs/layers';
import Tags from '@components/Tags';
import {createMap} from '@libs/getColors'
import classNames from 'classnames';
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
}

export default function ReactMap({ className, structures, initialViewport, colorMap = ["#D3494E", "#FFE5AD", "#13BBAF", "#7BC8F6"]}: ReactMapProps) {
  if (!initialViewport) {
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

  const flyTo = useCallback((longitude: number, latitude: number, zoom?: number) => {
    if (!isFinite(longitude) || !isFinite(latitude)) return;
    mapRef.current?.flyTo({ center: [longitude, latitude], zoom, duration: 500 });
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

  return  (<div className={classNames(className)} style={{ width: "100%", height: "100%" }}><ReactMapGL
      initialViewState={initialViewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOXTOKEN}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/essen/cjtsfp7dc00201fmfl8jllc3k"
      interactiveLayerIds={INTERACTIVE_LAYERS}
      cursor={cursor}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onMapClick}
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
        <div style={{ padding: '0.75rem' }}>
          {selection.illustrations?.[0] && (
            <img
              src={selection.illustrations[0]}
              alt={selection.name}
              style={{ height: '120px', objectFit: 'cover', borderBottom: '3px solid var(--primary)', marginBottom: '0.5rem', marginLeft: '-0.75rem', marginTop: '-0.75rem', width: 'calc(100% + 1.5rem)' }}
            />
          )}
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            {selection.name}
          </h3>
          <Tags tags={selection.typologies} colorMap={resolvedColorMap} />
          <Link href={`/structures/${selection.id}`}>
            <p className="link" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Voir la structure</p>
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
        <div className={styles.picker}>
          <h3 className={styles.picker__title}>Structures</h3>
        {picker.map((el: Structure, i: number)=>{
          return(
            <div className={styles.picker__choices} key={el.id} onClick={()=>{onPickerClick(el)}}>
              <span>{el.name}</span>
              <Tags tags={el.typologies} colorMap={resolvedColorMap}/>
            </div>
          )
        })}
        </div>

      </Popup>}

  </ReactMapGL>
  </div>)}
