import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunities, regions } from '../lib/opportunities.ts';
import { atlasCountries, countryOpportunities } from '../lib/atlas.ts';
import {
  availability,
  matchOpportunity,
  matchesText,
  validateProfile,
} from '../lib/match.ts';

const date = new Date('2026-09-16T18:00:00-05:00');
const find = (id) => opportunities.find((o) => o.id === id);
const tech = {
  stage: 'prototipo',
  businessType: 'startup',
  sector: 'tecnologia',
  needs: ['tecnologia', 'mentoria'],
  region: 'Lima',
};
test('Every catalogue entry has a unique ID, HTTPS source and sufficient editorial context', () => {
  assert.equal(opportunities.length, 24);
  assert.equal(
    new Set(opportunities.map((o) => o.id)).size,
    opportunities.length,
  );
  for (const o of opportunities) {
    assert.equal(new URL(o.url).protocol, 'https:');
    assert.ok(
      o.requirements.length > 0 &&
        o.benefits.length > 0 &&
        o.checkedAt &&
        o.note,
    );
    assert.ok(o.stages.length && o.businessTypes.length && o.needs.length);
    assert.ok(['open', 'closed', 'ongoing', 'consult'].includes(o.status));
  }
});
test('Application deadline closes automatically at the Peru time boundary', () => {
  const o = find('uni-incubacion');
  assert.equal(availability(o, new Date('2026-09-26T04:58:59Z')), 'open');
  assert.equal(availability(o, new Date('2026-09-26T04:59:01Z')), 'closed');
});
test('Old evergreen entries request a freshness review', () => {
  assert.equal(
    availability(find('bcp-contigo'), new Date('2026-11-15T12:00:00Z')),
    'stale',
  );
  assert.equal(availability(find('nexpro'), date), 'closed');
});
test('A tech startup can discover AWS and understand that eligibility still requires review', () => {
  const match = matchOpportunity(find('aws-activate'), tech, date);
  assert.ok(match.eligibleForSuggestions);
  assert.ok(match.reasons.length >= 2);
  assert.ok(match.pending.some((t) => t.includes('Perú')));
});
test('A traditional business does not receive startup-only cloud-credit matches', () => {
  const p = {
    ...tech,
    businessType: 'negocio',
    sector: 'gastronomia',
    stage: 'ventas',
  };
  assert.equal(
    matchOpportunity(find('aws-activate'), p, date).eligibleForSuggestions,
    false,
  );
  assert.equal(
    matchOpportunity(
      find('alicorp-crecemos'),
      { ...p, needs: ['aprender'] },
      date,
    ).eligibleForSuggestions,
    true,
  );
});
test('Ideas do not match an incubator requiring a working prototype', () => {
  assert.equal(
    matchOpportunity(find('uni-incubacion'), { ...tech, stage: 'idea' }, date)
      .eligibleForSuggestions,
    false,
  );
});
test('Closed programmes never appear as a current match', () => {
  const p = { ...tech, stage: 'ventas', needs: ['mentoria', 'capital'] };
  for (const o of opportunities.filter(
    (o) => availability(o, date) === 'closed',
  )) {
    assert.equal(matchOpportunity(o, p, date).eligibleForSuggestions, false);
  }
});
test('Location affects score and explains possible attendance in Lima', () => {
  const local = matchOpportunity(find('uni-incubacion'), tech, date);
  const remote = matchOpportunity(
    find('uni-incubacion'),
    { ...tech, region: 'Cusco' },
    date,
  );
  assert.ok(remote.score < local.score);
  assert.ok(remote.pending.some((r) => r.includes('Cusco')));
});
test('Unrelated objectives do not create a false match', () => {
  assert.equal(
    matchOpportunity(
      find('aws-activate'),
      { ...tech, needs: ['formalizar'] },
      date,
    ).eligibleForSuggestions,
    false,
  );
});
test('Search handles accents, case, multiword queries and no-result input', () => {
  assert.ok(matchesText(find('startup-peru'), 'startup peru'));
  assert.ok(matchesText(find('uni-incubacion'), 'INCUBACION UNI'));
  assert.equal(matchesText(find('uni-incubacion'), 'BCP banco'), false);
  assert.ok(opportunities.every((o) => matchesText(o, '')));
});
test('Corrupt stored profiles are rejected and duplicate needs are normalized', () => {
  assert.equal(validateProfile(null, regions), null);
  assert.equal(validateProfile({ ...tech, stage: 'unknown' }, regions), null);
  assert.equal(validateProfile({ ...tech, needs: [] }, regions), null);
  assert.equal(
    validateProfile({ ...tech, region: 'Inventada' }, regions),
    null,
  );
  assert.deepEqual(
    validateProfile({ ...tech, needs: ['tecnologia', 'tecnologia'] }, regions)
      .needs,
    ['tecnologia'],
  );
});

test('The atlas separates local origin from international benefits without inventing country coverage', () => {
  const peru = atlasCountries.find((c) => c.code === 'PE');
  const mexico = atlasCountries.find((c) => c.code === 'MX');
  const local = countryOpportunities(opportunities, peru);
  const global = opportunities.filter((o) => o.geography === 'Global');
  assert.equal(local.length, 18);
  assert.equal(global.length, 6);
  assert.equal(local.length + global.length, opportunities.length);
  assert.equal(countryOpportunities(opportunities, mexico).length, 0);
  assert.ok(!local.some((o) => o.id === 'hubspot-bootstrap'));
});

test('New country records can appear in their atlas without entering the Peru-only match', () => {
  const mexico = atlasCountries.find((c) => c.code === 'MX');
  const fixture = {
    ...find('uni-incubacion'),
    geography: 'México',
    countryCode: 'MX',
  };
  assert.equal(countryOpportunities([fixture], mexico).length, 1);
  assert.equal(
    matchOpportunity(fixture, tech, date).eligibleForSuggestions,
    false,
  );
});
