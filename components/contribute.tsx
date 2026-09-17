'use client';

import { useState } from 'react';
import { ArrowRight, CircleCheck, Send } from 'lucide-react';
import { atlasCountries } from '@/lib/atlas';

const blank = { name: '', officialUrl: '', country: '', kind: 'programa', note: '', replyEmail: '', website: '' };

export function Contribute() {
  const [form, setForm] = useState(blank);
  const [status, setStatus] = useState<'idle' | 'sending' | 'saved'>('idle');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'No se pudo guardar la sugerencia.');
      setStatus('saved');
      setForm(blank);
    } catch (reason) {
      setStatus('idle');
      setError(reason instanceof Error ? reason.message : 'Inténtalo más tarde.');
    }
  }

  return (
    <section className="contribute-section" id="colabora" aria-labelledby="contribute-title">
      <div className="contribute-copy">
        <span className="contribute-eyebrow">EL MAPA SE HACE ENTRE TODOS</span>
        <h2 id="contribute-title">¿Conoces otro programa?</h2>
        <p>Comparte su enlace oficial. Lo revisaremos antes de incluirlo en el catálogo; las propuestas no aparecen automáticamente.</p>
      </div>
      <div className="contribute-panel">
        {status === 'saved' ? (
          <div className="contribute-done" role="status">
            <CircleCheck size={27} />
            <h3>Gracias por sumar al mapa.</h3>
            <p>Guardamos tu propuesta para revisión editorial.</p>
            <button className="button secondary" onClick={() => setStatus('idle')}>Sugerir otro programa <ArrowRight size={16} /></button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="contribute-row">
              <label>Nombre del programa
                <input required maxLength={120} minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Programa de aceleración" />
              </label>
              <label>País o alcance
                <select required value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })}>
                  <option value="">Selecciona uno</option>
                  <option value="Latinoamérica">Latinoamérica</option>
                  <option value="Global">Global</option>
                  {atlasCountries.map((country) => <option key={country.code} value={country.name}>{country.name}</option>)}
                </select>
              </label>
            </div>
            <div className="contribute-row">
              <label>Enlace oficial
                <input type="url" required maxLength={500} value={form.officialUrl} onChange={(event) => setForm({ ...form, officialUrl: event.target.value })} placeholder="https://..." />
              </label>
              <label>Tipo
                <select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })}>
                  <option value="programa">Programa</option>
                  <option value="aceleradora">Aceleradora</option>
                  <option value="fellowship">Fellowship</option>
                  <option value="recurso">Recurso</option>
                  <option value="otro">Otro</option>
                </select>
              </label>
            </div>
            <label>¿Algo que debamos saber? <span>(opcional)</span>
              <textarea maxLength={600} rows={3} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Por qué vale la pena, fechas o requisitos a verificar" />
            </label>
            <label>Tu correo <span>(opcional; solo si podemos pedirte una aclaración)</span>
              <input type="email" maxLength={254} value={form.replyEmail} onChange={(event) => setForm({ ...form, replyEmail: event.target.value })} placeholder="tu@correo.com" />
            </label>
            <label className="contribute-honeypot" aria-hidden="true">Sitio web <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></label>
            {error && <p className="contribute-error" role="alert">{error}</p>}
            <div className="contribute-actions">
              <p>No necesitas cuenta. No añadimos tu correo a la lista de novedades.</p>
              <button className="button primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando…' : 'Enviar sugerencia'} <Send size={16} /></button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export function UnsubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  async function unsubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus('');
    try {
      const response = await fetch('/api/subscribe', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'No pudimos procesar tu baja.');
      setStatus('Listo: retiramos ese correo de la lista, si estaba registrado.');
      setEmail('');
    } catch (reason) { setStatus(reason instanceof Error ? reason.message : 'Inténtalo otra vez.'); }
    finally { setSending(false); }
  }
  return (
    <form className="unsubscribe-form" onSubmit={unsubscribe}>
      <label htmlFor="unsubscribe-email">Retirar mi correo de novedades</label>
      <div><input id="unsubscribe-email" type="email" placeholder="tu@correo.com" required value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit" disabled={sending}>Dar de baja</button></div>
      {status && <p role="status">{status}</p>}
    </form>
  );
}
