'use client';
import React, { useState, useRef, useCallback } from 'react';
import ReactMapGL, { Popup, Source, Layer } from 'react-map-gl';
import styles from "@styles/pages/Structures.module.css";
import LabelStructure from '@components/LabelStructure';
import Card from '@components/Card';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer, workshopsLayer, othersLayer, suppliersLayer, designersLayer } from '@libs/layers';
import Tags from '@components/Tags';
import {createMap} from '@libs/getColors'
import classNames from 'classnames';
import type { GeoJSONFeatureCollection, Structure } from '../types';

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
  const close = (): void => { if (selection) setSelection(undefined); if (picker) setPicker(undefined); };
  const mapRef = useRef<any>(null);

  workshopsLayer.paint!["circle-color"] = resolvedColorMap.get("atelier");
  designersLayer.paint!["circle-color"] = resolvedColorMap.get("designer");
  suppliersLayer.paint!["circle-color"] = resolvedColorMap.get("stockage");
  othersLayer.paint!["circle-color"] = resolvedColorMap.get("autre");

  const flyTo = useCallback((longitude: number, latitude: number, zoom?: number) => {
    mapRef.current?.flyTo({ center: [longitude, latitude], zoom, duration: 500 });
  }, []);

  const onMapClick = (event: any): void => {
    if (event.features.length === 0) return
    const feature = event.features[0];
    if (feature.properties.cluster) {
      const clusterId = feature.properties.cluster_id;
      const mapboxSource = mapRef.current.getSource('structures');
      mapboxSource.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
        if (err) return;
        flyTo(feature.geometry.coordinates[0], feature.geometry.coordinates[1], zoom);
      });
    }
    else if (JSON.parse(feature.properties.structures).length === 1) {
      let data = JSON.parse(feature.properties.structures)[0]
      data.longitude = Number(data.longitude);
      data.latitude = Number(data.latitude);
      flyTo(data.longitude, data.latitude);
      setSelection(data)
      setPicker(null)
    }
    else {
      let data = JSON.parse(feature.properties.structures)
      flyTo(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);
      setSelection(null)
      setPicker(data)
    }
  };
  const onPickerClick = (el: any): void => {
      el.longitude = Number(el.longitude);
      el.latitude = Number(el.latitude);
      flyTo(el.longitude, el.latitude);
      setSelection(el)
      setPicker(null)
  };


  return  (<div className={classNames(className)} style={{ width: "100%", height: "100%" }}><ReactMapGL
      initialViewState={initialViewport}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOXTOKEN}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/essen/cjtsfp7dc00201fmfl8jllc3k"
      interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
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



      {selection && <Popup
        latitude={selection.latitude}
        longitude={selection.longitude}
        closeButton={true}
        closeOnClick={false}
        onClose={() => close()}
        anchor="top" >
        <Card
          title={selection.name}
          tags={selection.typologies}
          colorMap={resolvedColorMap}
          image={selection.illustrations ? { src: selection.illustrations[0], alt: selection.name } : null}
          link={{ path: `/structures/${selection.id}`, text: "Voir la structure" }}
        >

          <LabelStructure structure={selection}/>
        </Card>

      </Popup>}

      {picker && <Popup
        latitude={Number(picker[0].latitude)}
        longitude={Number(picker[0].longitude)}
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
