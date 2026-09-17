'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Globe2 } from 'lucide-react';
import { geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import { atlasCountries, countryOpportunities } from '@/lib/atlas';
import { opportunities } from '@/lib/opportunities';
import { SiteMark } from '@/components/site-mark';

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
          <stop stopColor="#2965ad" />
          <stop offset="1" stopColor="#154d99" />
        </radialGradient>
      </defs>
      <circle className="welcome-orbit" cx="340" cy="340" r="310" fill="none" stroke="#f4c331" strokeDasharray="4 12" />
      <circle cx="340" cy="340" r="284" fill={`url(#${patternId})`} stroke="#d9e2da" strokeWidth="1.5" />
      <path d={path(geoGraticule10()) ?? ''} fill="none" stroke="#9bb8d5" strokeWidth="0.7" />
      {countries.map((country, index) => (
        <path key={index} d={path(country) ?? ''} fill="#fff8e8" fillOpacity=".12" stroke="#fff8e8" strokeWidth="0.8" />
      ))}
      {mapped.map((country) => {
        const point = projection([...country.coordinates]);
        if (!point || !path({ type: 'Point', coordinates: [...country.coordinates] })) return null;
        return (
          <g key={country.code}>
            <circle cx={point[0]} cy={point[1]} r="11" fill="#f4c331" fillOpacity=".2" />
            <circle cx={point[0]} cy={point[1]} r="4" fill="#f4c331" />
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
            <SiteMark />
          </div>
          <span className="welcome-eyebrow">OPORTUNIDADES PARA EMPRENDER EN LATAM</span>
          <h1 id="welcome-title">Tu próxima<br /><span>parada.</span></h1>
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
          <p className="welcome-fineprint">Sin registro en La Combi. Tu correo se guarda solo si lo envías con consentimiento; tus guardados y el perfil de match siguen en este navegador.</p>
        </div>
        <div className="welcome-visual" aria-hidden="true">
          <div className="welcome-route-ticket"><span>RUTA LATINOAMÉRICA</span><strong>Hay lugar<br />para tu idea.</strong></div>
          <IntroGlobe />
          <img className="welcome-combi" src="/brand/combi-mark.png" alt="" width="1254" height="1254" />
          <span className="welcome-globe-caption"><Globe2 size={16} /> Perú · México · Colombia · Chile · Argentina · Brasil</span>
        </div>
      </div>
    </section>
  );
}
