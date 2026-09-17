'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export function NewsletterDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');
  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) { setError('Marca la casilla para recibir novedades.'); return; }
    setState('sending'); setError('');
    try {
      const response = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, consent, website }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'No pudimos guardar tu correo.');
      setState('saved'); setEmail('');
    } catch (reason) { setState('error'); setError(reason instanceof Error ? reason.message : 'Inténtalo de nuevo.'); }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="newsletter-dialog" showCloseButton={false}>
      <DialogClose className="dialog-dismiss" aria-label="Cerrar novedades"><X size={20} /></DialogClose>
      <DialogTitle>Nuevas paradas, en tu correo.</DialogTitle>
      <DialogDescription>Recibe novedades cuando sumemos oportunidades. Explorar el mapa no requiere registro.</DialogDescription>
      {state === 'saved' ? <p role="status">Listo. Guardamos tu correo para novedades.</p> : <form onSubmit={subscribe}>
        <label htmlFor="newsletter-email">Correo electrónico</label>
        <div className="welcome-email-row">
          <input id="newsletter-email" type="email" name="email" autoComplete="email" placeholder="tu@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} />
          <button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Guardando…' : 'Recibir novedades'}</button>
        </div>
        <label className="welcome-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />Acepto recibir correos ocasionales sobre nuevas oportunidades. Puedo darme de baja cuando quiera.</label>
        <label className="welcome-honeypot" aria-hidden="true">Sitio web<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
        {error && <p className="welcome-error" role="alert">{error}</p>}
      </form>}
    </DialogContent>
  </Dialog>;
}
