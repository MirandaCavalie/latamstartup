'use client';

import { ArrowRight, Mail } from 'lucide-react';
import { TravelSticker } from '@/components/travel-sticker';

export function AtlasWelcome({ onEnter, onNewsletter }: { onEnter: () => void; onNewsletter: () => void }) {
  return <section className="atlas-welcome" aria-labelledby="atlas-welcome-title">
    <div className="welcome-souvenir souvenir-a"><TravelSticker country="general" index={0} /></div>
    <div className="welcome-souvenir souvenir-b"><TravelSticker country="MX" index={0} /></div>
    <div className="welcome-souvenir souvenir-c"><TravelSticker country="PE" index={0} /></div>
    <div className="welcome-souvenir souvenir-d"><TravelSticker country="general" index={1} /></div>
    <span className="atlas-welcome-label">LA COMBI · LATINOAMÉRICA</span>
    <h2 id="atlas-welcome-title">Tu próxima<br />parada.</h2>
    <p>Encuentra aceleradoras, becas y recursos para tu proyecto.</p>
    <button className="welcome-map-enter" onClick={onEnter}>Entrar como invitado <ArrowRight size={18} /></button>
    <button className="welcome-map-news" onClick={onNewsletter}><Mail size={16} /> Recibir novedades</button>
    <span className="atlas-welcome-note">Sin cuenta. El correo es opcional.</span>
  </section>;
}
