'use client';

import { useEffect, useState } from 'react';
import { MATCH_TOKEN_KEY, SUBSCRIBER_TOKEN_KEY } from '@/lib/privacy';

export function DataRemoval({ kind }: { kind: 'match' | 'subscribe' }) {
  const key = kind === 'match' ? MATCH_TOKEN_KEY : SUBSCRIBER_TOKEN_KEY;
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { try { setToken(localStorage.getItem(key) ?? ''); } catch { /* Input remains usable. */ } }, [key]);
  async function remove(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setStatus('');
    try {
      const response = await fetch(`/api/${kind}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deletionToken: token }) });
      if (!response.ok) throw new Error('No pudimos completar la eliminación. Inténtalo de nuevo.');
      try { if (localStorage.getItem(key) === token) localStorage.removeItem(key); } catch { /* Server deletion succeeded. */ }
      setToken(''); setStatus('Solicitud completada. Eliminamos los datos asociados a ese código, si existían.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Inténtalo de nuevo.'); }
    finally { setBusy(false); }
  }
  return <form className="unsubscribe-form" onSubmit={remove}>
    <label htmlFor={`remove-${kind}`}>{kind === 'match' ? 'Eliminar mi match compartido' : 'Retirar mi correo de novedades'}</label>
    <p>Usamos el código privado guardado en este navegador. Puedes copiarlo y conservarlo para gestionar tus datos desde otro dispositivo. No lo compartas.</p>
    <div><input id={`remove-${kind}`} type="password" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Código privado de 64 caracteres" pattern="[a-f0-9]{64}" required maxLength={64} /><button type="submit" disabled={busy}>{busy ? 'Eliminando…' : 'Eliminar'}</button></div>
    {token && <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(token); setStatus('Código copiado. Guárdalo en un lugar privado.'); } catch { setStatus('No pudimos copiarlo. Puedes gestionarlo desde este navegador.'); } }}>Copiar mi código privado</button>}
    {!token && <p>Si te suscribiste desde otro navegador y no tienes el código, solicita la baja al contacto indicado en <a href="/privacidad">Privacidad</a>.</p>}
    {status && <output>{status}</output>}
  </form>;
}

export function LocalDataRemoval() {
  const [notice, setNotice] = useState('');
  return <div><button className="button secondary" onClick={() => {
    try {
      localStorage.removeItem('mapping.profile.v1'); localStorage.removeItem('mapping.saved.v1'); setNotice('Borrados. Al volver al mapa se cargará sin ese perfil. Esto no elimina datos compartidos: usa los controles anteriores.');
    } catch { setNotice('No pudimos acceder al almacenamiento local. Puedes borrar los datos del sitio desde los ajustes del navegador.'); }
  }}>Borrar perfil y guardados de este navegador</button>{notice && <output>{notice}</output>}</div>;
}
