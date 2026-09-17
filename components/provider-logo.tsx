'use client';

import { useState } from 'react';
import { providerLogos } from '@/lib/provider-logos';

export function ProviderLogo({
  id,
  provider,
  large = false,
}: {
  id: string;
  provider: string;
  large?: boolean;
}) {
  const logo = providerLogos[id];
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return (
    <span
      className={
        'provider-logo' +
        (large ? ' provider-logo-large' : '') +
        (logo?.darkBackground ? ' provider-logo-inverse' : '')
      }
    >
      {logo && failedSource !== logo.src ? (
        <img
          src={logo.src}
          alt={`Logo de ${logo.name}${logo.kind === 'provider' ? ', institución o proveedor del programa' : ''}`}
          loading={large ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailedSource(logo.src)}
        />
      ) : (
        <span className="provider-logo-fallback">{provider}</span>
      )}
    </span>
  );
}
