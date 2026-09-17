'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Globe2 } from 'lucide-react';
import { geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import { atlasCountries, countryOpportunities } from '@/lib/atlas';
import { opportunities } from '@/lib/opportunities';

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
          <stop stopColor="#343434" />
          <stop offset="1" stopColor="#181818" />
        </radialGradient>
      </defs>
      <circle cx="340" cy="340" r="295" fill="none" stroke="#5c5c5c" strokeDasharray="2 9" />
      <circle cx="340" cy="340" r="284" fill={`url(#${patternId})`} stroke="#777" strokeWidth="1.5" />
      <path d={path(geoGraticule10()) ?? ''} fill="none" stroke="#555" strokeWidth="0.7" />
      {countries.map((country, index) => (
        <path key={index} d={path(country) ?? ''} fill="#2c2c2c" stroke="#979797" strokeWidth="0.65" />
      ))}
      {mapped.map((country) => {
        const point = projection([...country.coordinates]);
        if (!point || !path({ type: 'Point', coordinates: [...country.coordinates] })) return null;
        return (
          <g key={country.code}>
            <circle cx={point[0]} cy={point[1]} r="11" fill="#f4f4f4" fillOpacity=".14" />
            <circle cx={point[0]} cy={point[1]} r="4" fill="#fff" />
          </g>
        );
      })}
    </svg>
  );
}

export function WelcomeGate({ onEnter }: { onEnter: () => void }) {
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
      <div className="welcome-layout">
        <div className="welcome-content">
          <div className="welcome-wordmark">
            <span className="welcome-brand-icon"><img src="/brand/chancla-mark.png" alt="" /></span>
            <span>chancletazo</span>
          </div>
          <span className="welcome-eyebrow">LATINOAMÉRICA, EN EL MAPA</span>
          <h1 id="welcome-title">Encuentra tu próximo paso.</h1>
          <p className="welcome-description">
            Programas, inversión, recursos y fellowships para emprender. Explora el mapa y ve directo a cada fuente oficial.
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
          <p className="welcome-fineprint">Sin registro en Chancletazo. Tu correo se guarda solo si lo envías con consentimiento; tus guardados y el perfil de match siguen en este navegador.</p>
        </div>
        <div className="welcome-visual" aria-hidden="true">
          <IntroGlobe />
          <span className="welcome-globe-caption"><Globe2 size={16} /> Un mapa que sigue creciendo</span>
        </div>
      </div>
    </section>
  );
}
