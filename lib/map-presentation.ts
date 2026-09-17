// Stable, sticker-inspired accents; these are not availability indicators.
const accents: Record<string, string> = {
  PE: '#c4f542', MX: '#f36bc4', CO: '#ffb45e', CL: '#ffeb55', AR: '#79dcef', BR: '#ba95f5',
  EC: '#fc97a6', BO: '#a2df83', UY: '#87b8fc', PY: '#ee97ed', CR: '#6ee2c5', PA: '#ffd16e',
  GT: '#b9c8ff', HN: '#8ae4df', SV: '#d4adfa', NI: '#f9ba83', CU: '#f89ccb', DO: '#dbe877',
  HT: '#e0a7db', VE: '#e9cf8a',
};
export const countryColor = (code: string) => accents[code] ?? '#c4f542';
// Smaller windows get fewer cards, never a crowded four-card overlay.
export const previewLimit = (width: number, height: number) => width >= 1000 && height >= 760 ? 4 : 2;
