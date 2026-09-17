// Decorative artwork: never a button, never a replacement for the site logo.
const stickers = {
  envidia: { src: '/brand/sticker-tu-envidia-neon.png', width: 1536, height: 1024 },
  latam: { src: '/brand/sticker-hecho-en-latam-neon.png', width: 1774, height: 887 },
  parada: { src: '/brand/sticker-siguiente-parada-neon.png', width: 1774, height: 887 },
  fronteras: { src: '/brand/sticker-ideas-sin-fronteras-neon.png', width: 1536, height: 1024 },
};

export function BrandSticker({ kind }: { kind: keyof typeof stickers }) {
  return (
    <span className={`brand-sticker sticker-${kind}`} aria-hidden="true">
      <img
        {...stickers[kind]}
        alt=""
        draggable={false}
        decoding="async"
      />
    </span>
  );
}
