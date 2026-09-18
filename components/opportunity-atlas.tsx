'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { geoContains, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import { ArrowUpRight, CircleHelp, Mail, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { atlasCountries, countryPreviewOpportunities } from '@/lib/atlas';
import type { AtlasCountry } from '@/lib/atlas';
import { opportunities, categoryLabels } from '@/lib/opportunities';
import type { Opportunity } from '@/lib/opportunities';
import { availability, availabilityLabels } from '@/lib/match';
import { fitMapCamera, zoomMapAt } from '@/lib/map-camera';
import type { MapCamera, MapBounds } from '@/lib/map-camera';
import { TravelSticker } from '@/components/travel-sticker';
import { AtlasWelcome } from '@/components/atlas-welcome';
import { ProviderLogo } from '@/components/provider-logo';
import { countryColor, diversePreview, previewLimit } from '@/lib/map-presentation';

const topology = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
const boundaries = feature(topology, topology.objects.countries).features;
const projection = geoMercator().scale(1).translate([0, 0]);
const path = geoPath(projection).digits(6);
const countries = boundaries.map((boundary) => ({
  boundary, d: path(boundary) ?? '',
  country: atlasCountries.find((country) => country.id === String(boundary.id).padStart(3, '0')),
}));
const latamBounds: MapBounds = [projection([-119, 34])!, projection([-33, -57])!];

export function OpportunityAtlas({ onExplore, onDetails, onNewsletter, onAbout, onContribute, initialCountryCode, onCountryChange, now, showWelcome, onEnter, onWelcome }: {
  showWelcome: boolean;
  onEnter: () => void;
  onWelcome: () => void;
  onExplore: (scope: string) => void;
  onDetails: (item: Opportunity) => void;
  onNewsletter: () => void;
  onAbout: () => void;
  onContribute: () => void;
  initialCountryCode?: string;
  onCountryChange: (code: string) => void;
  now: Date;
}) {
  const container = useRef<HTMLElement>(null);
  const picker = useRef<HTMLSelectElement>(null);
  const gridId = useId();
  const [size, setSize] = useState({ width: 1440, height: 800 });
  const [selected, setSelected] = useState<AtlasCountry | null>(() => atlasCountries.find((country) => country.code === initialCountryCode) ?? null);
  const [dragging, setDragging] = useState(false);
  const [camera, setCamera] = useState<MapCamera>(() => fitMapCamera(latamBounds, 1440, 800));
  const cameraRef = useRef(camera);
  const animation = useRef<number>(0);
  const drag = useRef<{ id: number; x: number; y: number; start: MapCamera; moved: boolean } | null>(null);

  const updateCamera = (next: MapCamera) => { cameraRef.current = next; setCamera(next); };
  function moveTo(next: MapCamera) {
    cancelAnimationFrame(animation.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { updateCamera(next); return; }
    const from = cameraRef.current;
    const started = performance.now();
    const frame = (time: number) => {
      const progress = Math.min(1, (time - started) / 650);
      const ease = 1 - Math.pow(1 - progress, 3);
      updateCamera({ x: from.x + (next.x - from.x) * ease, y: from.y + (next.y - from.y) * ease, scale: from.scale + (next.scale - from.scale) * ease });
      if (progress < 1) animation.current = requestAnimationFrame(frame);
    };
    animation.current = requestAnimationFrame(frame);
  }
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(container.current);
    return () => { observer.disconnect(); cancelAnimationFrame(animation.current); };
  }, []);
  useEffect(() => {
    const boundary = selected && countries.find((item) => item.country?.code === selected.code)?.boundary;
    moveTo(fitMapCamera(boundary ? path.bounds(boundary) : latamBounds, size.width, size.height, !!selected));
    // Only selection/resize reframes the map; manual panning remains independent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, size.width, size.height]);

  const localItems = useMemo(() => selected ? countryPreviewOpportunities(opportunities, selected).sort((a, b) =>
    Number(availability(a, now) === 'closed') - Number(availability(b, now) === 'closed')) : [], [selected, now]);
  const reset = () => {
    setSelected(null);
    onCountryChange('');
    moveTo(fitMapCamera(latamBounds, size.width, size.height));
    picker.current?.focus();
  };
  const selectCountry = (country: AtlasCountry) => {
    onEnter();
    setSelected(country);
    onCountryChange(country.code);
    const boundary = countries.find((item) => item.country?.code === country.code)?.boundary;
    if (boundary) moveTo(fitMapCamera(path.bounds(boundary), size.width, size.height, true));
  };
  const previewItems = diversePreview(localItems, previewLimit(size.width, size.height));
  const gridStep = Math.max(28, Math.min(110, camera.scale * Math.PI / 18));

  return (
    <section ref={container} className={'flat-atlas' + (selected ? ' has-country' : '') + (showWelcome && !selected ? ' has-welcome' : '')} id="mapa" aria-label="Mapa de oportunidades de Latinoamérica"
      onKeyDown={(event) => { if (event.key === 'Escape' && selected) { reset(); picker.current?.focus(); } }}>
      <h1 className="sr-only">La Combi: explora oportunidades por país</h1>
      <svg className={'flat-map ' + (dragging ? 'is-dragging' : '')} viewBox={`0 0 ${size.width} ${size.height}`} role="group" aria-label="Mapa plano. Selecciona un país o arrastra para desplazarte."
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.button !== 0 || drag.current) return;
          // Map gestures must not start native SVG selection/image dragging.
          event.preventDefault();
          cancelAnimationFrame(animation.current);
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, start: cameraRef.current, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const current = drag.current;
          if (!current || current.id !== event.pointerId) return;
          const dx = event.clientX - current.x;
          const dy = event.clientY - current.y;
          if (!current.moved && Math.abs(dx) + Math.abs(dy) < 6) return;
          current.moved = true; setDragging(true);
          updateCamera({ ...current.start, x: current.start.x + dx, y: current.start.y + dy });
        }}
        onPointerUp={(event) => {
          const current = drag.current;
          if (!current || current.id !== event.pointerId) return;
          if (!current.moved) {
            const rect = event.currentTarget.getBoundingClientRect();
            const live = cameraRef.current;
            const point = projection.invert?.([(event.clientX - rect.left - live.x) / live.scale, (event.clientY - rect.top - live.y) / live.scale]);
            const hit = point && countries.find((item) => item.country && geoContains(item.boundary, point));
            if (hit?.country) selectCountry(hit.country);
          }
          drag.current = null; setDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { drag.current = null; setDragging(false); }}
        onLostPointerCapture={() => { drag.current = null; setDragging(false); }}>
        <defs><pattern id={gridId} patternUnits="userSpaceOnUse" width={gridStep} height={gridStep} x={camera.x % gridStep} y={camera.y % gridStep}>
          <path d={`M ${gridStep} 0 H 0 V ${gridStep}`} className="flat-graticule" />
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} pointerEvents="none" />
        <g transform={`translate(${camera.x} ${camera.y}) scale(${camera.scale})`}>
          {countries.map(({ boundary, d, country }, index) => (
            <path key={`${boundary.id ?? 'unmapped'}-${index}`} d={d} vectorEffect="non-scaling-stroke"
              className={'flat-country' + (country ? ' is-latam' : '') + (selected?.code === country?.code && country ? ' is-selected' : '')}
              style={country ? { '--country-color': countryColor(country.code) } as CSSProperties : undefined}
              role={country ? 'button' : undefined} tabIndex={country ? 0 : undefined}
              aria-label={country ? `Explorar ${country.name}` : undefined} aria-pressed={country ? selected?.code === country.code : undefined}
              onKeyDown={country ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectCountry(country); } } : undefined}>
              {country && <title>{country.name}</title>}
            </path>
          ))}
        </g>
      </svg>
      <div className="map-picker">
        <label htmlFor="map-country">Explorar</label>
        <select ref={picker} id="map-country" value={selected?.code ?? ''} onChange={(event) => {
          const country = atlasCountries.find((item) => item.code === event.target.value);
          if (country) selectCountry(country); else reset();
        }}>
          <option value="">Latinoamérica</option>
          {atlasCountries.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name}</option>)}
        </select>
      </div>
      {selected && <>
        <aside key={`results-${selected.code}`} className="map-preview" aria-label={`Oportunidades de ${selected.name}`}>
          <div className="map-country-heading">
            <div><h2>{selected.flag} {selected.name}</h2><span className="map-chapter">{localItems.length ? `${previewItems.length} de ${localItems.length} oportunidades locales` : 'Sin programas locales aún'}</span></div>
            <button className="map-icon-button" onClick={reset} aria-label="Cerrar país y volver a Latinoamérica"><X size={20} /></button>
          </div>
          {localItems.length ? <>
            <div className={'map-popups' + (previewItems.length > 4 ? ' layout-six' : '')} aria-label="Selección de oportunidades">
              {previewItems.map((item, index) => <button className={`map-opportunity popup-${index + 1}`} key={`${selected.code}-${item.id}`} onClick={() => onDetails(item)}>
                <TravelSticker country={selected.code} index={index} />
                <span className="map-card-top"><ProviderLogo id={item.id} provider={item.org} /></span>
                <span className="map-card-category">{categoryLabels[item.category]} · {selected.name}</span>
                <strong>{item.name}</strong>
                <span className="map-card-status"><i className={'status-dot ' + availability(item, now)} />{availabilityLabels[availability(item, now)]}</span>
                <ArrowUpRight className="map-card-arrow" size={17} />
              </button>)}
            </div>
            <button className="map-catalog-link" onClick={() => onExplore(selected.name)} aria-label={`Ver todas las oportunidades de ${selected.name} en la base de datos`} title="Incluye oportunidades locales, de LATAM y globales">Ver todas <ArrowUpRight size={16} /></button>
          </> : <div className="map-empty-country"><p>Aún no hemos mapeado programas locales de {selected.name}. Puedes explorar las opciones regionales y globales disponibles para este país o ayudarnos a sumar una.</p><button className="button primary" onClick={() => onExplore(selected.name)}>Ver todas las oportunidades</button><button className="text-button" onClick={onContribute}>Proponer un programa <ArrowUpRight size={15} /></button></div>}
        </aside>
      </>}
      {showWelcome && !selected && <AtlasWelcome onEnter={() => { onEnter(); picker.current?.focus(); }} onNewsletter={onNewsletter} />}
      <div className="map-bottom-bar">
        {!selected && !showWelcome && <p className="map-hint">Elige un país.<span>Tu próxima parada empieza ahí.</span></p>}
        <div className="map-shortcuts">
          {!showWelcome && <button onClick={() => { reset(); onWelcome(); }}>Inicio</button>}
          <button onClick={() => onExplore('Latinoamérica')}>Programas regionales <ArrowUpRight size={13} /></button>
          <button onClick={() => onExplore('Global')}>Recursos globales <ArrowUpRight size={13} /></button>
          <button onClick={onNewsletter}><Mail size={14} /> Novedades</button>
          <button onClick={onContribute}>Colabora</button>
          <a href="/privacidad">Privacidad</a>
          <button onClick={onAbout} aria-label="Cómo funciona y privacidad"><CircleHelp size={17} /></button>
        </div>
        <span className="map-attribution">Natural Earth · Oportunidades por país</span>
      </div>
      <div className="map-controls" aria-label="Controles del mapa">
        <button onClick={reset} aria-label="Ver toda Latinoamérica" title="Ver Latinoamérica"><RotateCcw size={18} /></button>
        <button onClick={() => moveTo(zoomMapAt(cameraRef.current, 1.4, [size.width * .5, size.height * (selected && size.width < 760 ? .3 : .5)]))} aria-label="Acercar mapa"><Plus size={20} /></button>
        <button onClick={() => moveTo(zoomMapAt(cameraRef.current, 1 / 1.4, [size.width * .5, size.height * (selected && size.width < 760 ? .3 : .5)]))} aria-label="Alejar mapa"><Minus size={20} /></button>
      </div>
      <p className="sr-only" role="status">{selected ? `${selected.name}: mostrando ${previewItems.length} de ${localItems.length} oportunidades locales. Las tarjetas no indican sedes físicas; usa Ver todas para incluir también oportunidades de LATAM y globales en la base de datos del país.` : 'Selecciona un país para ver sus oportunidades.'}</p>
    </section>
  );
}
