import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { opportunities, categoryLabels } from '../lib/opportunities.ts';
import { atlasCountries, countryOpportunities, countryPreviewOpportunities, opportunitiesForCountry, isAvailableFromCountry, isCrossBorder } from '../lib/atlas.ts';
import { filterCatalog } from '../lib/catalog.ts';
import { availability, matchOpportunity } from '../lib/match.ts';

const now = new Date('2026-09-17T12:00:00-05:00');
const defaults = { category: 'all', orgType: 'all', scope: 'all', query: '', freeOnly: false, availableOnly: false };
const ids = (rows) => rows.map((row) => row.id).sort();
const read = (filters, rows = opportunities) => filterCatalog(rows, { ...defaults, ...filters }, now);

for (const country of atlasCountries) {
  test(`${country.name}: local coverage and regional fellowships in the country database`, () => {
    const local = countryOpportunities(opportunities, country);
    assert.ok(local.length >= 1, 'Every atlas country has at least one verified local record');
    const rows = read({ scope: country.name });
    assert.deepEqual(ids(rows), ids(opportunitiesForCountry(opportunities, country)));
    assert.ok(local.every((item) => rows.includes(item)));
    assert.deepEqual(ids(read({ scope: country.name, category: 'fellowships' })), ['makers-fellowship', 'puentes-antigravity', 'ylai-fellowship']);
    assert.ok(rows.some((item) => item.id === 'aws-activate'));
    for (const item of rows.filter((item) => !isCrossBorder(item))) {
      assert.equal(item.countryCode ?? atlasCountries.find((c) => c.name === item.geography)?.code, country.code);
    }
  });
  test(`${country.name}: map previews are national-only while the database keeps cross-border opportunities`, () => {
    const local = countryPreviewOpportunities(opportunities, country);
    const full = read({ scope: country.name });
    assert.ok(local.length >= 1);
    assert.ok(local.every((item) => !isCrossBorder(item) && full.includes(item)));
    assert.ok(local.every((item) => (item.countryCode ?? atlasCountries.find((c) => c.name === item.geography)?.code) === country.code));
    assert.ok(full.some((item) => item.id === 'ylai-fellowship'));
    assert.ok(full.some((item) => item.id === 'rockstart-latam'));
    assert.ok(full.length > local.length);
  });
  test(`${country.name}: facet counts match actual results under combined filters`, () => {
    for (const options of [{}, { freeOnly: true }, { availableOnly: true }, { query: 'mentoria' }, { orgType: 'Estado' }, { query: 'zz-no-result-zz', freeOnly: true }]) {
      const filters = { ...options, scope: country.name };
      const facet = read(filters);
      let sum = 0;
      for (const category of Object.keys(categoryLabels)) {
        const rows = read({ ...filters, category });
        assert.deepEqual(ids(rows), ids(facet.filter((item) => item.category === category)));
        sum += rows.length;
      }
      assert.equal(sum, facet.length);
    }
  });
}

test('Peru fellowships: free and available filters do not silently include closed cohorts', () => {
  assert.deepEqual(ids(read({ scope: 'Perú', category: 'fellowships', freeOnly: true })), ['makers-fellowship', 'ylai-fellowship']);
  assert.deepEqual(ids(read({ scope: 'Perú', category: 'fellowships', availableOnly: true })), ['makers-fellowship']);
  assert.equal(availability(opportunities.find((o) => o.id === 'puentes-antigravity'), now), 'closed');
});
test('All database clears scope, regional chapter includes cross-border country-origin programs, invalid scope fails closed', () => {
  assert.equal(read({}).length, 59);
  assert.equal(read({ scope: 'not-a-country' }).length, 0);
  assert.ok(read({ scope: 'Latinoamérica' }).some((o) => o.id === 'ife-accelerator'));
  assert.ok(read({ scope: 'Global' }).every((o) => o.geography === 'Global'));
});
test('Resources and saved subsets cannot inflate category counts with records outside that view', () => {
  for (const rows of [opportunities.filter((o) => o.resource), opportunities.filter((o) => ['makers-fellowship', 'sebrae-startups'].includes(o.id))]) {
    const scoped = read({ scope: 'Perú' }, rows);
    assert.ok(scoped.every((o) => rows.includes(o)));
    assert.ok(!scoped.some((o) => o.id === 'sebrae-startups'));
    assert.equal(read({ scope: 'Perú', category: 'fellowships' }, rows).length, scoped.filter((o) => o.category === 'fellowships').length);
  }
});
test('Explicit country eligibility overrides global/regional labels in discovery and match', () => {
  const item = { ...opportunities.find((o) => o.id === 'makers-fellowship'), eligibleCountryCodes: ['MX'] };
  assert.equal(isAvailableFromCountry(item, 'PE'), false);
  assert.equal(isAvailableFromCountry(item, 'MX'), true);
  assert.equal(isAvailableFromCountry(item, 'XX'), false);
  assert.equal(matchOpportunity(item, { countryCode: 'PE', stage: 'idea', businessType: 'startup', sector: 'tecnologia', needs: ['aprender'] }, now).eligibleForSuggestions, false);
});
test('Country context and reset-all navigation use the same faceted base as the results', () => {
  const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  assert.match(page, /Estás en/);
  assert.match(page, /Ver toda la base de datos/);
  assert.match(page, /facetItems\.filter\(\(o\) => o\.category === key\)/);
  assert.doesNotMatch(page, /baseItems\.filter\(\(o\) => o\.category === key\)/);
});

test('Map uses local preview candidates and keeps the country when opening the full database', () => {
  const map = readFileSync(new URL('../components/opportunity-atlas.tsx', import.meta.url), 'utf8');
  assert.match(map, /countryPreviewOpportunities\(opportunities, selected\)/);
  assert.match(map, /diversePreview\(localItems,/);
  assert.match(map, /onExplore\(selected.name\)/);
  assert.match(map, /oportunidades locales/);
});

test('Map never fills an empty local chapter with regional programs or excludes explicit eligibility', () => {
  const peru = atlasCountries.find((country) => country.code === 'PE');
  assert.deepEqual(countryPreviewOpportunities(opportunities.filter(isCrossBorder), peru), []);
  const restricted = { ...opportunities.find((item) => item.countryCode === 'PE'), eligibleCountryCodes: ['MX'] };
  assert.deepEqual(countryPreviewOpportunities([restricted], peru), []);
});
