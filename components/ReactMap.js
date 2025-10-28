import React, { useState, useRef } from 'react';
import ReactMapGL, { Popup, Source, Layer } from 'react-map-gl';
import styles from "@styles/pages/Structures.module.css";
import LabelStructure from '@components/LabelStructure';
import Card from '@components/Card';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer, workshopsLayer, othersLayer, suppliersLayer, designersLayer } from '@libs/layers';
import Tags from '@components/Tags';
import {createMap} from '@libs/getColors'
import classNames from 'classnames';

export function prepareData(structureList){
  let data = {}
  structureList.forEach((el, i) => {
    let hash = `lo-${el.longitude}la-${el.latitude}`
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
  return{
    type: "FeatureCollection",
    features: Object.values(data)
  }
}

export default function ReactMap({ className, structures, initialViewport, colorMap = ["#D3494E", "#FFE5AD", "#13BBAF", "#7BC8F6"]}) {
  if (!initialViewport) {
    initialViewport = {
      latitude: 48.85658,
      longitude: 2.3518,
      zoom: 10
    }
  }
  colorMap = createMap(colorMap)

  const [viewport, setViewport] = useState(initialViewport);
  const [selection, setSelection] = useState(undefined);
  const [picker, setPicker] = useState(undefined);
  const close = () => { if (selection) setSelection(undefined); if (picker) setPicker(undefined); };
  const mapRef = useRef(null);

  workshopsLayer.paint["circle-color"] = colorMap.get("atelier");
  designersLayer.paint["circle-color"] = colorMap.get("designer");
  suppliersLayer.paint["circle-color"] = colorMap.get("stockage");
  othersLayer.paint["circle-color"] = colorMap.get("autre");

  const onMapClick = event => {
    if (event.features.length === 0) return
    const feature = event.features[0];
    if (feature.properties.cluster) {
      const clusterId = feature.properties.cluster_id;
      const mapboxSource = mapRef.current.getMap().getSource('structures');
      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        setViewport({
          ...viewport,
          zoom,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          transitionDuration: 500,
        });
      });

    }
    else if (JSON.parse(feature.properties.structures).length === 1) {

      let data = JSON.parse(feature.properties.structures)[0]
      data.longitude = Number(data.longitude);
      data.latitude = Number(data.latitude);
      setViewport({
        ...viewport,
        longitude: data.longitude,
        latitude: data.latitude,
        transitionDuration: 500,
      });
      setSelection(data)
      setPicker(null)
    }
    else {
      let data = JSON.parse(feature.properties.structures)
      setViewport({
        ...viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        transitionDuration: 500,
      });
      setSelection(null)
      setPicker(data)
    }
  };
  const onPickerClick = (el) => {
      el.longitude = Number(el.longitude);
      el.latitude = Number(el.latitude);
      setViewport({
        ...viewport,
        longitude: el.longitude,
        latitude: el.latitude,
        transitionDuration: 500,
      });
      setSelection(el)
      setPicker(null)
  };


  return  (<ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOXTOKEN}
      width="100%"
      height="100%"
      className= {classNames(className)}
      mapStyle="mapbox://styles/essen/cjtsfp7dc00201fmfl8jllc3k"
      onViewportChange={(viewport) => setViewport(viewport)}
      interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
      onClick={onMapClick}
      ref={mapRef}
      clickRadius={5}
    >


      <Source
        id="structures"
        type="geojson"
        data={structures}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={20}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
        <Layer {...workshopsLayer} />
        <Layer {...designersLayer} />
        <Layer {...suppliersLayer} />
        <Layer {...othersLayer} />
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
          colorMap={colorMap}
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
        {picker.map((el,i)=>{
          return(
            <div className={styles.picker__choices} key={el.id} onClick={()=>{onPickerClick(el)}}>
              <span>{el.name}</span>
              <Tags tags={el.typologies} colorMap={colorMap}/>
            </div>
          )
        })}
        </div>
 
      </Popup>}

  </ReactMapGL>
)}
