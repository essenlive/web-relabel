'use client';
import SmartImage from '@components/SmartImage';
import Layout from '@components/Layout'
import Link from 'next/link'
import ReactMap from '@components/ReactMap'
import { prepareData } from '@libs/mapUtils'
import { useState, useMemo } from 'react';
import { cn } from '@libs/utils';
import type { Structure, Community } from '../../../types';

const TYPOLOGIES = [
  { key: 'designer', label: 'Designers', color: '#D3494E' },
  { key: 'stockage', label: 'Fournisseurs', color: '#13BBAF' },
  { key: 'atelier', label: 'Ateliers', color: '#FFE5AD' },
  { key: 'autre', label: 'Partenaires', color: '#7BC8F6' },
] as const;

const COLORS = TYPOLOGIES.map(t => t.color);

interface StructuresClientProps {
  structures: Structure[];
  communities: Community[];
}

export default function StructuresClient({ structures, communities: rawCommunities }: StructuresClientProps) {
  const communityNames = rawCommunities.map((el) => el.name);
  const [activeTypologies, setActiveTypologies] = useState<Set<string>>(new Set(TYPOLOGIES.map(t => t.key)));
  const [query, setQuery] = useState('');
  const [activeCommunities, setActiveCommunities] = useState<Set<string>>(new Set(communityNames));

  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const [onlyVisible, setOnlyVisible] = useState(true);

  const filteredStructures = useMemo(() => {
    return structures.filter((s) => {
      const typMatch = s.typologies.some(t => activeTypologies.has(t));
      const comMatch = (s.communities as Community[]).some(c => activeCommunities.has(c.name));
      const q = query.trim().toLowerCase();
      return typMatch && comMatch && (!q || s.name.toLowerCase().includes(q));
    });
  }, [structures, activeTypologies, activeCommunities, query]);

  // The map shows every filtered structure; the list can be narrowed to what is in view.
  const listedStructures = useMemo(() => {
    if (!onlyVisible || !bounds) return filteredStructures;
    const [w, s, e, n] = bounds;
    return filteredStructures.filter((st) => {
      const lng = Number(st.longitude), lat = Number(st.latitude);
      return st.longitude != null && st.latitude != null && lng >= w && lng <= e && lat >= s && lat <= n;
    });
  }, [filteredStructures, bounds, onlyVisible]);

  function toggleTypology(key: string) {
    setActiveTypologies(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function toggleCommunity(name: string) {
    setActiveCommunities(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function showAll() {
    setActiveTypologies(new Set(TYPOLOGIES.map(t => t.key)));
    setActiveCommunities(new Set(communityNames));
  }

  return (
    <Layout bleed>
      {/* Header height is 6.25rem + its 4px rule; the map and the rail share the rest of the viewport. */}
      <div className="grid grid-cols-[minmax(0,1fr)] lg:h-[calc(100dvh-6.25rem-4px)] lg:min-h-[34rem] lg:grid-cols-[24rem_minmax(0,1fr)]">
        <div className="relative h-[55dvh] min-h-80 border-b-4 border-primary lg:col-start-2 lg:row-start-1 lg:h-auto lg:border-b-0">
          <ReactMap
            className="absolute inset-0 h-full w-full"
            structures={prepareData(filteredStructures)}
            colorMap={COLORS}
            onBoundsChange={setBounds}
            initialViewport={{ latitude: 46.6, longitude: 2.5, zoom: 5.5 }}
          />
        </div>

        <aside aria-label="Filtres et liste des structures" className="flex min-h-0 flex-col lg:col-start-1 lg:row-start-1 lg:border-r-4 lg:border-primary">
          <div className="flex items-center justify-between border-b-4 border-primary px-6 py-2">
            <h1 className="text-lg">Structures</h1>
            <span className="text-sm text-primary" aria-live="polite">{listedStructures.length} sur {structures.length}</span>
          </div>

          <div className="flex flex-col gap-2 border-b-2 border-primary px-6 py-3">
            <label className="sr-only" htmlFor="structure-search">Rechercher une structure</label>
            <input
              id="structure-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une structure"
              className="min-h-9 w-full border-b-2 border-primary text-primary placeholder:text-quaternary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            />
            <div className="flex flex-wrap gap-1.5">
              {TYPOLOGIES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => toggleTypology(t.key)}
                  aria-pressed={activeTypologies.has(t.key)}
                  className={cn(
                    "inline-flex min-h-8 cursor-pointer items-center gap-1.5 border-2 px-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    activeTypologies.has(t.key) ? "border-primary bg-primary text-white" : "border-primary/40 bg-white text-primary hover:bg-gray-100"
                  )}
                >
                  <span aria-hidden className="size-2.5 border border-white outline outline-1 outline-primary" style={{ backgroundColor: t.color }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {communityNames.length > 0 && (
            <details className="group border-b-2 border-primary">
              <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between px-6 py-2 text-xs font-bold uppercase focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span>Communautés ({activeCommunities.size}/{communityNames.length})</span>
                <span aria-hidden className="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto px-6 pb-3">
                {communityNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => toggleCommunity(name)}
                    aria-pressed={activeCommunities.has(name)}
                    className={cn(
                      "min-h-8 cursor-pointer border-2 px-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      activeCommunities.has(name) ? "border-primary bg-primary text-white" : "border-primary/40 bg-white text-primary hover:bg-gray-100"
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </details>
          )}

          <Link
            href="/structures/add"
            className="block shrink-0 bg-primary px-6 py-2 text-center text-xs font-bold uppercase text-white hover:opacity-90 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
          >
            Référencer votre structure
          </Link>

          <label className="flex min-h-9 cursor-pointer items-center gap-2 border-b-2 border-primary px-6 py-2 text-xs font-semibold">
            <input type="checkbox" checked={onlyVisible} onChange={(e) => setOnlyVisible(e.target.checked)} className="size-4 accent-primary" />
            Seulement la zone visible sur la carte
          </label>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {listedStructures.map((structure) => (
              <Link
                key={structure.id}
                href={`/structures/${structure.id}`}
                className="flex min-h-14 items-center gap-3 border-b-2 border-primary/20 px-6 py-2 hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              >
                {structure.illustrations[0] && (
                  <SmartImage
                    src={structure.illustrations[0]}
                    alt=""
                    width={72}
                    height={72}
                    className="h-10 w-10 shrink-0 border-2 border-primary bg-gray-100 object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm">{structure.name}</h2>
                  <p className="mt-1 truncate text-xs text-primary">{structure.typologies.map((tag) => TYPOLOGIES.find(t => t.key === tag)?.label ?? tag).join(" · ")}</p>
                </div>
              </Link>
            ))}
            {listedStructures.length === 0 && (
              <p className="px-6 py-6 text-sm">Aucune structure {onlyVisible && filteredStructures.length > 0 ? 'dans la zone visible' : 'ne correspond à ces filtres'}. <button onClick={() => { showAll(); setQuery(''); setOnlyVisible(false); }} className="link">Tout afficher</button></p>
            )}
          </div>
        </aside>
      </div>
    </Layout>
  );
}
