'use client';
import Layout from '@components/Layout'
import styles from "@styles/pages/Structures.module.css";
import Link from 'next/link'
import ReactMap from '@components/ReactMap'
import { prepareData } from '@libs/mapUtils'
import { useState } from 'react';
import Tags from '@components/Tags';
import type { Structure, Community } from '../../../types';

interface StructuresClientProps {
  structures: Structure[];
  communities: Community[];
}

export default function StructuresClient({ structures, communities: rawCommunities }: StructuresClientProps) {
  const communities: string[] = rawCommunities.map((el: Community) => el.name);
  const [typologyFilter, setTypologyFilter] = useState<Set<string>>(new Set(["designer", "stockage", "atelier", "autre"]))
  const [communityFilter, setCommunityFilter] = useState<Set<string>>(new Set(communities))
  const [filteredStructures, setFilteredStructures] = useState<Structure[]>(filterStructures())
  const colors: string[] = ["#D3494E", "#FFE5AD", "#13BBAF", "#7BC8F6"];
  const colorMap = new Map<string, string>()
  colorMap.set('designer', colors[0]);
  colorMap.set('atelier', colors[1]);
  colorMap.set('stockage', colors[2]);
  colorMap.set('autre', colors[3]);

  function filterStructures(): Structure[] {
    let filteredStructures = structures.filter((structure) => {
      let typologyCheck = false;
      let communityCheck = false;
      structure.typologies.forEach(typology => { if (typologyFilter.has(typology)) typologyCheck = true });
      (structure.communities as Community[]).forEach(community => { if (communityFilter.has(community.name)) communityCheck = true });
      return typologyCheck && communityCheck
    })
    return(filteredStructures)
  }

  function toggleFilter(selection: string, filter: Set<string>): Set<string> {
    if (filter.has(selection)) { filter.delete(selection) }
    else (filter.add(selection))
    return(filter);
  }

  return <Layout full>
    <ReactMap
      className={styles.map}
      structures={prepareData(filteredStructures)}
      colorMap={colors}
      initialViewport={{
        latitude: 48.85658,
        longitude: 2.3518,
        zoom: 4
      }}
    />
    <div className={styles.infos}>
      <h3>Filtres</h3>
      <div className={styles.filters}>
        <div className={styles.filter}>
          <h4>Typologies</h4>
          <ul>
            <li onClick={() => { setTypologyFilter(toggleFilter("designer", typologyFilter)); setFilteredStructures(filterStructures()) }}>
              <span className={styles.legend} style={typologyFilter.has("designer") ? { backgroundColor: colors[0], borderColor: colors[0] } : {}}></span> Designers
            </li>
            <li onClick={() => { setTypologyFilter(toggleFilter("stockage", typologyFilter)); setFilteredStructures(filterStructures()) }}>
              <span className={styles.legend} style={typologyFilter.has("stockage") ? { backgroundColor: colors[1], borderColor: colors[1] } : {}}></span> Ateliers
            </li>
            <li onClick={() => { setTypologyFilter(toggleFilter("atelier", typologyFilter)); setFilteredStructures(filterStructures()) }}>
              <span className={styles.legend} style={typologyFilter.has("atelier") ? { backgroundColor: colors[2], borderColor: colors[2] } : {}}></span> Fournisseurs
            </li>
            <li onClick={() => { setTypologyFilter(toggleFilter("autre", typologyFilter)); setFilteredStructures(filterStructures()) }}>
              <span className={styles.legend} style={typologyFilter.has("autre") ? { backgroundColor: colors[3], borderColor: colors[3] } : {}}></span> Partenaires
            </li>
            <li onClick={() => { setTypologyFilter(typologyFilter.add("designer").add("atelier").add("stockage").add("autre")); setFilteredStructures(filterStructures()) }}>
              <span className={styles.legend} style={typologyFilter.size === 4 ? { backgroundColor: "var(--gray-300)" } : {}}></span>Tout afficher
            </li>
          </ul>
        </div>
        <div className={styles.filter}>
          <h4>Communautés</h4>
          <ul>
            {communities.map((community: string, i: number) => {
              return (
                <li key={i} onClick={() => { setCommunityFilter(toggleFilter(community, communityFilter)); setFilteredStructures(filterStructures()) }}>
                  <span className={styles.legend} style={communityFilter.has(community) ? { backgroundColor: "var(--gray-300)" } : {}}></span>
                  {community}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className={styles.add}>
        <Link href={{ pathname: '/structures/add' }}>
          <p className='link-simple'>Réferencer votre structure</p>
        </Link>
      </div>
      <div className={styles.list}>
        {filteredStructures.map((structure: Structure, i: number) => {
          return(
            <div className={styles.listItem} key={i}>
              <div className={styles.listItemInfo}>
                <h4> {structure.name} </h4>
                <Tags tags={structure.typologies} colorMap={colorMap}/>
                <Link href={{ pathname: `/structures/${structure.id}` }}>
                  <p className='link'>Voir la structure</p>
                </Link>
              </div>
              {structure.illustrations[0] && (<img src={structure.illustrations[0]}/>)}
            </div>
          )
        })}
      </div>
    </div>
  </Layout>;
}
