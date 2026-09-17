// Stable, sticker-inspired accents; these are not availability indicators.
const accents: Record<string, string> = {
  PE: '#c4f542', MX: '#f36bc4', CO: '#ffb45e', CL: '#ffeb55', AR: '#79dcef', BR: '#ba95f5',
  EC: '#fc97a6', BO: '#a2df83', UY: '#87b8fc', PY: '#ee97ed', CR: '#6ee2c5', PA: '#ffd16e',
  GT: '#b9c8ff', HN: '#8ae4df', SV: '#d4adfa', NI: '#f9ba83', CU: '#f89ccb', DO: '#dbe877',
  HT: '#e0a7db', VE: '#e9cf8a',
};
export const countryColor = (code: string) => accents[code] ?? '#c4f542';
// Smaller windows get fewer cards, never a crowded four-card overlay.
export const previewLimit = (width: number, height: number) => width < 760 ? 4 : width >= 1200 && height >= 840 ? 6 : height >= 620 ? 4 : 2;

const countrySheets: Record<string, [string, number]> = {
  PE: ['andes', 0], MX: ['andes', 2], CO: ['andes', 4],
  CL: ['sur', 0], AR: ['sur', 2], BR: ['sur', 4], EC: ['latam', 0],
};
export function stickerCell(country: string, index: number) {
  const pair = countrySheets[country];
  if (pair && index < 2) return { sheet: pair[0], cell: pair[1] + index };
  return { sheet: 'latam', cell: 2 + ((pair ? index - 2 : index) % 4) };
}

// Preview different kinds of support first; the complete list retains its ordering.
export function diversePreview<T extends { category: string }>(items: T[], limit: number): T[] {
  const seen = new Set<string>();
  const first: T[] = [];
  const rest: T[] = [];
  for (const item of items) {
    if (seen.has(item.category)) rest.push(item);
    else { seen.add(item.category); first.push(item); }
  }
  return [...first, ...rest].slice(0, limit);
}
