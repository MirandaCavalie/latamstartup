import { stickerCell } from '@/lib/map-presentation';

// Equal-cell artwork stays in its original transparent sprite sheet.
export function TravelSticker({ country, index }: { country: string; index: number }) {
  const { sheet, cell } = stickerCell(country, index);
  return <span className="travel-sticker" aria-hidden="true">
    <img src={`/brand/souvenirs-${sheet}.png`} alt="" draggable={false} decoding="async"
      style={{ left: `${-(cell % 3) * 100}%`, top: `${-Math.floor(cell / 3) * 100}%` }} />
  </span>;
}
