import type { Opportunity } from './opportunities';

// ISO 3166-1 numeric IDs match the Natural Earth / world-atlas boundaries.
// Coordinates locate countries, not the offices or eligibility of providers.
export const atlasCountries = [
  { id: '604', code: 'PE', name: 'Perú', flag: '🇵🇪', coordinates: [-75, -10] },
  {
    id: '484',
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    coordinates: [-102, 23],
  },
  {
    id: '170',
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    coordinates: [-73, 4],
  },
  { id: '152', code: 'CL', name: 'Chile', flag: '🇨🇱', coordinates: [-71, -32] },
  {
    id: '032',
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    coordinates: [-64, -35],
  },
  {
    id: '076',
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    coordinates: [-52, -12],
  },
  {
    id: '218',
    code: 'EC',
    name: 'Ecuador',
    flag: '🇪🇨',
    coordinates: [-78, -2],
  },
  {
    id: '068',
    code: 'BO',
    name: 'Bolivia',
    flag: '🇧🇴',
    coordinates: [-64, -17],
  },
  {
    id: '858',
    code: 'UY',
    name: 'Uruguay',
    flag: '🇺🇾',
    coordinates: [-56, -33],
  },
  {
    id: '600',
    code: 'PY',
    name: 'Paraguay',
    flag: '🇵🇾',
    coordinates: [-58, -23],
  },
  {
    id: '188',
    code: 'CR',
    name: 'Costa Rica',
    flag: '🇨🇷',
    coordinates: [-84, 10],
  },
  { id: '591', code: 'PA', name: 'Panamá', flag: '🇵🇦', coordinates: [-80, 9] },
  {
    id: '320',
    code: 'GT',
    name: 'Guatemala',
    flag: '🇬🇹',
    coordinates: [-90, 16],
  },
  {
    id: '340',
    code: 'HN',
    name: 'Honduras',
    flag: '🇭🇳',
    coordinates: [-86, 15],
  },
  {
    id: '222',
    code: 'SV',
    name: 'El Salvador',
    flag: '🇸🇻',
    coordinates: [-89, 14],
  },
  {
    id: '558',
    code: 'NI',
    name: 'Nicaragua',
    flag: '🇳🇮',
    coordinates: [-85, 13],
  },
  {
    id: '214',
    code: 'DO',
    name: 'Rep. Dominicana',
    flag: '🇩🇴',
    coordinates: [-70, 19],
  },
  { id: '192', code: 'CU', name: 'Cuba', flag: '🇨🇺', coordinates: [-79, 22] },
  { id: '332', code: 'HT', name: 'Haití', flag: '🇭🇹', coordinates: [-72, 19] },
  {
    id: '862',
    code: 'VE',
    name: 'Venezuela',
    flag: '🇻🇪',
    coordinates: [-66, 7],
  },
] as const;

export type AtlasCountry = (typeof atlasCountries)[number];

export function isCrossBorder(item: Opportunity) {
  return item.geography === 'Global' || item.geography === 'Latinoamérica' || item.matchScope === 'Latinoamérica';
}

// Discovery coverage is not an admission guarantee: age, incorporation,
// travel and provider terms remain in each record's requirements.
export function isAvailableFromCountry(item: Opportunity, code: string) {
  const country = atlasCountries.find((entry) => entry.code === code);
  if (!country) return false;
  if (item.eligibleCountryCodes) return item.eligibleCountryCodes.includes(code);
  return isCrossBorder(item) || (item.countryCode ? item.countryCode === code : item.geography === country.name);
}

export function opportunitiesForCountry(items: Opportunity[], country: AtlasCountry) {
  return items.filter((item) => isAvailableFromCountry(item, country.code));
}

export function countryOpportunities(
  items: Opportunity[],
  country: AtlasCountry,
) {
  // Global benefits are intentionally separate: a worldwide label does not
  // establish eligibility in every country on the map.
  return items.filter(
    (item) =>
      item.geography !== 'Global' &&
      (item.countryCode
        ? item.countryCode === country.code
        : item.geography === country.name),
  );
}
