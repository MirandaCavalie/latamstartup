import type { Opportunity } from './opportunities';
import { atlasCountries, isAvailableFromCountry, isCrossBorder } from './atlas.ts';
import { availability, matchesText } from './match.ts';

export type CatalogFilters = {
  category: string; orgType: string; scope: string; query: string;
  freeOnly: boolean; availableOnly: boolean;
};

export function filterCatalog(items: Opportunity[], filters: CatalogFilters, now = new Date()) {
  const country = atlasCountries.find((entry) => entry.name === filters.scope);
  return items.filter((item) =>
    (filters.category === 'all' || item.category === filters.category) &&
    (filters.orgType === 'all' || item.orgType === filters.orgType) &&
    (filters.scope === 'all' || (country
      ? isAvailableFromCountry(item, country.code)
      : filters.scope === 'Latinoamérica'
        ? isCrossBorder(item) && item.geography !== 'Global'
        : filters.scope === 'Global' && item.geography === 'Global')) &&
    (!filters.freeOnly || item.cost === 'gratis') &&
    (!filters.availableOnly || ['open', 'ongoing'].includes(availability(item, now))) &&
    matchesText(item, filters.query),
  );
}
