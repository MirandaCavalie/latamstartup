import { MapPinned } from 'lucide-react';

export function SiteMark({
  variant = 'header',
}: {
  variant?: 'header' | 'footer';
}) {
  return (
    <span
      className={'site-mark site-mark-' + variant}
      role="img"
      aria-label="Tu envidia es mi progreso"
    >
      <MapPinned size={34} strokeWidth={1.6} aria-hidden="true" />
    </span>
  );
}
