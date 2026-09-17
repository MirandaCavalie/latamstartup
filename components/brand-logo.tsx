export function BrandLogo({
  variant = 'hero',
}: {
  variant?: 'hero' | 'header' | 'footer';
}) {
  return (
    <img
      src="/brand/tu-envidia-es-mi-progreso.png"
      alt="Tu envidia es mi progreso"
      width="1536"
      height="1024"
      className={'brand-logo brand-logo-' + variant}
      loading={variant === 'footer' ? 'lazy' : 'eager'}
      fetchPriority={variant === 'hero' ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
