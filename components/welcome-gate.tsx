'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Globe2, Sparkles } from 'lucide-react';
import { geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import { atlasCountries, countryOpportunities } from '@/lib/atlas';
import { opportunities } from '@/lib/opportunities';
import { SiteMark } from '@/components/site-mark';
import { BrandSticker } from '@/components/brand-sticker';

const topology = world as unknown as Topology<{
  countries: GeometryCollection<{ name: string }>;
}>;
const countries = feature(topology, topology.objects.countries).features;
const mapped = atlasCountries.filter((country) =>
  countryOpportunities(opportunities, country).length > 0,
);

function IntroGlobe() {
  const patternId = useId().replace(/:/g, '');
  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([340, 340])
        .scale(284)
        .rotate([69, 3, -8])
        .clipAngle(90),
    [],
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  return (
    <svg
      className="welcome-globe"
      viewBox="0 0 680 680"
      role="img"
      aria-label="Globo con los seis países latinoamericanos ya mapeados"
    >
      <defs>
        <radialGradient id={patternId} cx="45%" cy="38%" r="67%">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ecebf1" />
        </radialGradient>
      </defs>
      <circle className="welcome-orbit" cx="340" cy="340" r="310" fill="none" stroke="#d3d0df" strokeDasharray="4 12" />
      <circle cx="340" cy="340" r="284" fill={`url(#${patternId})`} stroke="#d4d3da" strokeWidth="1.5" />
      <path d={path(geoGraticule10()) ?? ''} fill="none" stroke="#cfccd8" strokeWidth="0.7" />
      {countries.map((country, index) => (
        <path key={index} d={path(country) ?? ''} fill="#c1bbd5" fillOpacity=".26" stroke="#aaa5b8" strokeWidth="0.8" />
      ))}
      {mapped.map((country) => {
        const point = projection([...country.coordinates]);
        if (!point || !path({ type: 'Point', coordinates: [...country.coordinates] })) return null;
        return (
          <g key={country.code}>
            <circle cx={point[0]} cy={point[1]} r="11" fill="#c5b5ef" fillOpacity=".6" />
            <circle cx={point[0]} cy={point[1]} r="4" fill="#29252f" />
          </g>
        );
      })}
    </svg>
  );
}

export function WelcomeGate({ onEnter, onNavigate, onMatch }: {
  onEnter: () => void;
  onNavigate: (view: 'explore' | 'resources' | 'matches' | 'saved') => void;
  onMatch: () => void;
}) {
  const guestButton = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    guestButton.current?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = oldOverflow; };
  }, []);

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) { setError('Marca la casilla para recibir novedades.'); return; }
    setState('sending');
    setError('');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'No pudimos guardar tu correo.');
      setState('saved');
      setEmail('');
    } catch (reason) {
      setState('error');
      setError(reason instanceof Error ? reason.message : 'Inténtalo de nuevo.');
    }
  }

  return (
    <section className="welcome-gate" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <header className="site-header welcome-header">
        <SiteMark />
        <nav className="welcome-nav" aria-label="Navegación principal">
          <button onClick={() => onNavigate('explore')}>Catálogo</button>
          <button onClick={() => onNavigate('resources')}>Recursos</button>
          <button onClick={() => onNavigate('matches')}>Mis matches</button>
          <button onClick={() => onNavigate('saved')}>Guardados</button>
        </nav>
        <button className="button primary" onClick={onMatch}><Sparkles size={16} /> Hacer mi match</button>
      </header>
      <div className="welcome-layout">
        <div className="welcome-content">
          <h1 id="welcome-title">la combi<span>.</span></h1>
          <p className="welcome-description">
            Un mapa para encontrar apoyo y emprender en LATAM.
          </p>
          <div className="welcome-stats" aria-label="Contenido actual del mapa">
            <div><strong>{opportunities.length}</strong><span>oportunidades</span></div>
            <div><strong>{mapped.length}</strong><span>países mapeados</span></div>
          </div>
          <button ref={guestButton} className="welcome-enter" onClick={onEnter}>
            Entrar como invitado <ArrowRight size={20} />
          </button>
          <div className="welcome-email-block">
            <p>¿Quieres enterarte cuando el mapa crezca?</p>
            {state === 'saved' ? (
              <p className="welcome-success" role="status">Listo. Guardamos tu correo para novedades. <button onClick={onEnter}>Ir al mapa <ArrowRight size={16} /></button></p>
            ) : (
              <form onSubmit={subscribe}>
                <div className="welcome-email-row">
                  <label className="sr-only" htmlFor="welcome-email">Correo electrónico</label>
                  <input id="welcome-email" type="email" name="email" autoComplete="email" placeholder="tu@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} />
                  <button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Guardando…' : 'Recibir novedades'}</button>
                </div>
                <label className="welcome-consent">
                  <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                  Acepto recibir correos ocasionales sobre nuevas oportunidades. Puedo darme de baja cuando quiera.
                </label>
                <label className="welcome-honeypot" aria-hidden="true">Sitio web <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
                {error && <p className="welcome-error" role="alert">{error}</p>}
              </form>
            )}
          </div>
          <p className="welcome-fineprint">Explora sin registro. Tu perfil y tus guardados se quedan en este navegador.</p>
        </div>
        <div className="welcome-visual" aria-hidden="true">
          <BrandSticker kind="envidia" />
          <div className="welcome-map-window">
            <div className="map-window-bar"><span className="window-dots"><i /><i /><i /></span><span>latam.map</span><Globe2 size={14} /></div>
            <IntroGlobe />
          </div>
          <BrandSticker kind="latam" />
          <span className="welcome-globe-caption"><Globe2 size={16} /> Perú · México · Colombia · Chile · Argentina · Brasil</span>
        </div>
      </div>
    </section>
  );
}
