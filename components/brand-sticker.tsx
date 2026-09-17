// Decorative artwork: never a button, never a replacement for the site logo.
export function BrandSticker({ kind }: { kind: 'envidia' | 'latam' }) {
  return (
    <span className={`brand-sticker sticker-${kind}`} aria-hidden="true">
      <img
        src={kind === 'envidia' ? '/brand/sticker-tu-envidia.png' : '/brand/sticker-hecho-en-latam.png'}
        width={kind === 'envidia' ? 1536 : 1774}
        height={kind === 'envidia' ? 1024 : 887}
        alt=""
        decoding="async"
      />
    </span>
  );
}
