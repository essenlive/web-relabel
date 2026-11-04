'use client';
import Layout from '@components/Layout'
import Link from 'next/link'
import ReactMap from '@components/ReactMap'
import { prepareData } from '@libs/mapUtils'
import { useState, useMemo } from 'react';
import { cn } from '@libs/utils';
import { FiX, FiFilter } from 'react-icons/fi';
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
  const [activeCommunities, setActiveCommunities] = useState<Set<string>>(new Set(communityNames));
  const [panelOpen, setPanelOpen] = useState(true);

  const filteredStructures = useMemo(() => {
    return structures.filter((s) => {
      const typMatch = s.typologies.some(t => activeTypologies.has(t));
      const comMatch = (s.communities as Community[]).some(c => activeCommunities.has(c.name));
      return typMatch && comMatch;
    });
  }, [structures, activeTypologies, activeCommunities]);

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
  }

  return (
    <Layout full>
      <ReactMap
        className="absolute inset-0 w-full h-full"
        structures={prepareData(filteredStructures)}
        colorMap={COLORS}
        initialViewport={{ latitude: 46.6, longitude: 2.5, zoom: 5.5 }}
      />

      {/* Toggle button when panel is closed */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute z-10 right-3 top-28 bg-white border-[3px] border-primary px-3 py-2 font-bold text-sm uppercase text-primary shadow-lg flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <FiFilter className="w-4 h-4" />
          Filtres
        </button>
      )}

      {/* Sidebar panel */}
      <div className={cn(
        "absolute z-10 right-3 top-28 bottom-3 flex flex-col",
        "bg-white/95 backdrop-blur-sm border-[3px] border-primary shadow-lg",
        "w-80 max-md:w-[calc(100%-1.5rem)] max-md:left-3",
        "transition-all duration-200",
        panelOpen ? "opacity-100 translate-x-0" : "opacity-0 pointer-events-none translate-x-4"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b-[3px] border-primary shrink-0">
          <h3 className="text-sm font-bold uppercase tracking-wide">Filtres</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-quaternary">{filteredStructures.length} structures</span>
            <button onClick={() => setPanelOpen(false)} className="cursor-pointer text-primary hover:opacity-70 transition-opacity">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Typology filters */}
        <div className="px-3 py-2 border-b border-gray-200 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {TYPOLOGIES.map((t) => (
              <button
                key={t.key}
                onClick={() => toggleTypology(t.key)}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-full border-2 transition-all cursor-pointer",
                  activeTypologies.has(t.key)
                    ? "text-white shadow-sm"
                    : "border-gray-200 text-gray-400 bg-white hover:border-gray-300"
                )}
                style={activeTypologies.has(t.key) ? { backgroundColor: t.color, borderColor: t.color } : {}}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={showAll}
              className="px-2.5 py-1 text-xs font-semibold rounded-full border-2 border-gray-300 text-primary bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Tout
            </button>
          </div>
        </div>

        {/* Community filters */}
        {communityNames.length > 0 && (
          <div className="px-3 py-2 border-b border-gray-200 shrink-0">
            <div className="flex flex-wrap gap-1">
              {communityNames.map((name) => (
                <button
                  key={name}
                  onClick={() => toggleCommunity(name)}
                  className={cn(
                    "px-2 py-0.5 text-[11px] font-medium rounded-full border transition-all cursor-pointer",
                    activeCommunities.has(name)
                      ? "bg-primary text-white border-primary"
                      : "border-gray-200 text-gray-400 bg-white hover:border-gray-300"
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add link */}
        <Link
          href="/structures/add"
          className="block px-3 py-1.5 text-xs font-semibold text-center text-white bg-primary hover:opacity-90 transition-opacity shrink-0"
        >
          Référencer votre structure
        </Link>

        {/* Structure list */}
        <div className="flex-1 overflow-y-auto">
          {filteredStructures.map((structure) => (
            <Link
              key={structure.id}
              href={`/structures/${structure.id}`}
              className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
            >
              {structure.illustrations[0] && (
                <img
                  src={structure.illustrations[0]}
                  alt={structure.name}
                  className="w-9 h-9 rounded object-cover shrink-0 bg-gray-100"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold truncate leading-tight">{structure.name}</h4>
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  {structure.typologies.map((tag) => {
                    const typo = TYPOLOGIES.find(t => t.key === tag);
                    return (
                      <span
                        key={tag}
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: typo?.color ?? '#999' }}
                      />
                    );
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
