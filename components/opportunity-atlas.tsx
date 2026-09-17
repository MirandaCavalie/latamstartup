'use client';

import { useId, useMemo, useRef, useState } from 'react';
import {
  geoContains,
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
} from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Globe2,
  UsersRound,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { atlasCountries, countryOpportunities } from '@/lib/atlas';
import type { AtlasCountry } from '@/lib/atlas';
import { opportunities } from '@/lib/opportunities';
import { ChichaPoster } from '@/components/chicha-poster';

const topology = world as unknown as Topology<{
  countries: GeometryCollection<{ name: string }>;
}>;
const boundaries = feature(topology, topology.objects.countries).features;
const graticule = geoGraticule10();
const initialRotation: [number, number, number] = [78, 8, -8];

export function OpportunityAtlas({
  onExplore,
  onMatch,
}: {
  onExplore: (scope: string) => void;
  onMatch: () => void;
}) {
  const [selected, setSelected] = useState<AtlasCountry>(atlasCountries[0]);
  const [rotation, setRotation] = useState(initialRotation);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    x: number;
    y: number;
    start: typeof initialRotation;
    moved: boolean;
  } | null>(null);
  const patternId = useId().replace(/:/g, '');
  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([360, 350])
        .scale(296)
        .rotate(rotation)
        .clipAngle(90),
    [rotation],
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  const selectedItems = countryOpportunities(opportunities, selected);
  const globals = opportunities.filter((item) => item.geography === 'Global');
  const regionals = opportunities.filter((item) => item.geography === 'Latinoamérica');
  const mappedCountries = atlasCountries.filter(
    (country) => countryOpportunities(opportunities, country).length,
  );
  const selectedPoint = projection([...selected.coordinates]);
  const pointIsVisible =
    geoDistance([...selected.coordinates], [-rotation[0], -rotation[1]]) <
    Math.PI / 2;
  const selectCountry = (country: AtlasCountry) => {
    setSelected(country);
    setRotation([-country.coordinates[0], -country.coordinates[1], -8]);
  };

  return (
    <section className="atlas-section" id="mapa" aria-labelledby="atlas-title">
      <div className="atlas-main">
        <div className="atlas-copy">
          <h1 id="atlas-title" className="chicha-poster">
            <ChichaPoster />
          </h1>
          <p className="atlas-description">
            Encuentra programas, inversión y recursos para emprender en Latinoamérica.
          </p>
          <div className="atlas-actions">
            <button
              className="button atlas-primary"
              onClick={() => onExplore('all')}
            >
              Explorar oportunidades <ArrowDown size={18} />
            </button>
            <button className="atlas-match-link" onClick={onMatch}>
              <Sparkles size={17} /> Haz tu match
            </button>
          </div>
        </div>
        <div className="globe-stage">
          <svg
            viewBox="0 0 720 700"
            className={'atlas-globe ' + (dragging ? 'is-dragging' : '')}
            role="group"
            aria-label="Globo de Latinoamérica. Arrastra para girar o usa los controles. Selecciona un país en la lista inferior."
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              drag.current = {
                x: event.clientX,
                y: event.clientY,
                start: [...rotation],
                moved: false,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(true);
            }}
            onPointerMove={(event) => {
              if (!drag.current) return;
              const dx = event.clientX - drag.current.x;
              const dy = event.clientY - drag.current.y;
              if (Math.abs(dx) + Math.abs(dy) < 4) return;
              drag.current.moved = true;
              setRotation([
                drag.current.start[0] + dx * 0.28,
                Math.max(-60, Math.min(60, drag.current.start[1] - dy * 0.28)),
                -8,
              ]);
            }}
            onPointerUp={(event) => {
              // Resolve a tap geometrically because pointer capture retargets SVG clicks.
              if (drag.current && !drag.current.moved) {
                const rect = event.currentTarget.getBoundingClientRect();
                const coordinates = projection.invert?.([
                  ((event.clientX - rect.left) * 720) / rect.width,
                  ((event.clientY - rect.top) * 700) / rect.height,
                ]);
                if (coordinates) {
                  const boundary = boundaries.find((item) =>
                    geoContains(item, coordinates),
                  );
                  const country =
                    boundary &&
                    atlasCountries.find(
                      (item) =>
                        item.id === String(boundary.id).padStart(3, '0'),
                    );
                  if (country) selectCountry(country);
                }
              }
              drag.current = null;
              setDragging(false);
            }}
            onPointerCancel={() => {
              drag.current = null;
              setDragging(false);
            }}
            onLostPointerCapture={() => {
              drag.current = null;
              setDragging(false);
            }}
          >
            <defs>
              <radialGradient
                id={patternId + 'ocean'}
                cx="36%"
                cy="30%"
                r="72%"
              >
                <stop offset="0%" stopColor="#fffdf7" />
                <stop offset="72%" stopColor="#fff8e8" />
                <stop offset="100%" stopColor="#eae4d6" />
              </radialGradient>
              <pattern
                id={patternId + 'dots'}
                width="4.5"
                height="4.5"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.05" fill="#67847f" />
              </pattern>
              <pattern
                id={patternId + 'active'}
                width="4.5"
                height="4.5"
                patternUnits="userSpaceOnUse"
              >
                <rect width="4.5" height="4.5" fill="#f4c331" />
                <circle cx="2" cy="2" r="1.3" fill="#154d99" />
              </pattern>
              <filter
                id={patternId + 'shadow'}
                x="-30%"
                y="-30%"
                width="160%"
                height="180%"
              >
                <feDropShadow
                  dx="0"
                  dy="23"
                  stdDeviation="20"
                  floodColor="#414141"
                  floodOpacity=".10"
                />
              </filter>
            </defs>
            <circle cx="360" cy="350" r="320" className="globe-orbit" />
            <circle
              cx="360"
              cy="350"
              r="296"
              fill={`url(#${patternId}ocean)`}
              filter={`url(#${patternId}shadow)`}
              stroke="#dedede"
              strokeWidth=".8"
            />
            <path
              d={path(graticule) ?? ''}
              fill="none"
              stroke="#d6d6d6"
              strokeWidth=".65"
              opacity=".65"
            />
            {boundaries.map((boundary, index) => {
              const country = atlasCountries.find(
                (c) => c.id === String(boundary.id).padStart(3, '0'),
              );
              const isSelected = country?.code === selected.code;
              return (
                <path
                  key={boundary.id ?? index}
                  d={path(boundary) ?? ''}
                  fill={`url(#${patternId}${isSelected ? 'active' : 'dots'})`}
                  stroke={isSelected ? '#154d99' : '#adadad'}
                  strokeWidth={isSelected ? 1.2 : 0.5}
                  className={country ? 'globe-country' : 'globe-land'}
                  opacity={country ? 1 : 0.5}
                >
                  <title>{country?.name ?? boundary.properties?.name}</title>
                </path>
              );
            })}
            {pointIsVisible && selectedPoint && (
              <g
                transform={`translate(${selectedPoint[0]},${selectedPoint[1]})`}
                aria-hidden="true"
              >
                <circle r="17" fill="#f4c331" opacity=".55" />
                <circle r="8" fill="#c52e20" stroke="#ffffff" strokeWidth="3" />
                <path
                  d="M 8 -7 L 32 -33 H 94"
                  fill="none"
                  stroke="#4c4c4c"
                  strokeWidth="1.2"
                />
                <rect
                  x="31"
                  y="-54"
                  width={selected.name.length > 12 ? 162 : 105}
                  height="29"
                  rx="6"
                  fill="#154d99"
                />
                <text
                  x="43"
                  y="-34"
                  fill="#ffffff"
                  fontSize="14"
                  fontWeight="600"
                >
                  {selected.name}
                </text>
              </g>
            )}
          </svg>
          <div className="atlas-count-card">
            <span className="atlas-count-icon">
              <Globe2 size={20} />
            </span>
            <div>
              <strong>{opportunities.length}</strong>
              <span>oportunidades en ruta</span>
            </div>
            <span className="count-card-spark" aria-hidden="true">
              ✳
            </span>
          </div>
          <div className="country-preview" aria-live="polite">
            <div className="country-preview-top">
              <span className="country-flag" aria-hidden="true">
                {selected.flag}
              </span>
              <span
                className={
                  'country-state ' + (selectedItems.length ? 'mapped' : '')
                }
              >
                {selectedItems.length ? 'EN EL MAPA' : 'POR MAPEAR'}
              </span>
            </div>
            <h2>{selected.name}</h2>
            <p>
              {selectedItems.length
                ? `${selectedItems.length} programas y recursos en este mapa.`
                : 'Aún no hemos mapeado programas aquí.'}
            </p>
            {selectedItems.length ? (
              <button onClick={() => onExplore(selected.name)}>
                Explorar {selected.name} <ArrowUpRight size={18} />
              </button>
            ) : (
              <button onClick={() => selectCountry(atlasCountries[0])}>
                Volver a Perú <ArrowRight size={17} />
              </button>
            )}
          </div>
          <div className="globe-controls">
            <span>Arrastra para explorar</span>
            <div>
              <button
                aria-label="Girar globo a la izquierda"
                onClick={() => setRotation(([x, y, z]) => [x - 20, y, z])}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                aria-label="Centrar globo en Latinoamérica"
                onClick={() => setRotation(initialRotation)}
              >
                <RotateCcw size={15} />
              </button>
              <button
                aria-label="Girar globo a la derecha"
                onClick={() => setRotation(([x, y, z]) => [x + 20, y, z])}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="atlas-country-bar">
        <div className="country-bar-heading">
          <span>ELIGE TU PUNTO DE PARTIDA</span>
          <small>
            {mappedCountries.length}{' '}
            {mappedCountries.length === 1 ? 'país' : 'países'} con catálogo ·
            más por explorar
          </small>
        </div>
        <div
          className="country-rail"
          role="group"
          aria-label="Países de Latinoamérica"
        >
          {atlasCountries.map((country) => (
            <button
              key={country.code}
              className={
                'country-chip ' +
                (selected.code === country.code ? 'selected' : '')
              }
              aria-pressed={selected.code === country.code}
              onClick={() => selectCountry(country)}
            >
              <span aria-hidden="true">{country.flag}</span>
              {country.name}
              <span className="country-chip-count">
                {countryOpportunities(opportunities, country).length ||
                  'Por mapear'}
              </span>
            </button>
          ))}
        </div>
        <div className="international-paths">
          <button className="global-benefits" onClick={() => onExplore('Latinoamérica')}>
            <UsersRound size={18} />
            <span>
              <strong>Oportunidades para LATAM.</strong> Explora{' '}
              {regionals.length} fellowships e intercambios regionales.
              <small>Compara cobertura, edad y plazos antes de postular.</small>
            </span>
            <ArrowUpRight size={21} />
          </button>
          <button className="global-benefits" onClick={() => onExplore('Global')}>
            <Globe2 size={18} />
            <span>
              <strong>¿Tu idea no tiene fronteras?</strong> Explora{' '}
              {globals.length} beneficios globales.
              <small>Revisa la elegibilidad de tu país en cada proveedor.</small>
            </span>
            <ArrowUpRight size={21} />
          </button>
        </div>
      </div>
    </section>
  );
}
