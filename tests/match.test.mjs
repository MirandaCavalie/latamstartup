import test from 'node:test';
import assert from 'node:assert/strict';
import { opportunities } from '../lib/opportunities.ts';
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
  countryCode: 'PE',
};
test('Every catalogue entry has a unique ID, HTTPS source and sufficient editorial context', () => {
  assert.equal(opportunities.length, 59);
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
test('In-person participation still requires confirming the actual location', () => {
  const match = matchOpportunity(find('uni-incubacion'), tech, date);
  assert.ok(match.eligibleForSuggestions);
  assert.ok(match.pending.some((r) => r.includes('Lima')));
  assert.ok(match.pending.some((r) => r.includes('disponibilidad para viajar')));
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
  assert.equal(validateProfile(null), null);
  assert.equal(validateProfile({ ...tech, stage: 'unknown' }), null);
  assert.equal(validateProfile({ ...tech, needs: [] }), null);
  assert.equal(
    validateProfile({ ...tech, countryCode: 'XX' }),
    null,
  );
  assert.deepEqual(
    validateProfile({ ...tech, needs: ['tecnologia', 'tecnologia'] })
      .needs,
    ['tecnologia'],
  );
});

test('The atlas maps verified country chapters without treating regional eligibility as local', () => {
  const peru = atlasCountries.find((c) => c.code === 'PE');
  const local = countryOpportunities(opportunities, peru);
  const global = opportunities.filter((o) => o.geography === 'Global');
  const regional = opportunities.filter((o) => o.geography === 'Latinoamérica');
  assert.equal(local.length, 18);
  assert.equal(global.length, 6);
  assert.equal(regional.length, 3);
  for (const [code, expected] of Object.entries({ MX: 6, CO: 3, CL: 3, AR: 3, BR: 3 })) {
    const country = atlasCountries.find((c) => c.code === code);
    assert.equal(countryOpportunities(opportunities, country).length, expected, code);
  }
  assert.equal(local.length + global.length + regional.length + 18 + 14, opportunities.length);
  assert.ok(!local.some((o) => o.id === 'hubspot-bootstrap'));
});

test('Cross-border fellowships disclose actual travel coverage and live status', () => {
  const puentes = find('puentes-antigravity');
  const ylai = find('ylai-fellowship');
  const makers = find('makers-fellowship');
  assert.equal(availability(puentes, date), 'closed');
  assert.equal(puentes.cost, 'condicionado');
  assert.match(puentes.costLabel, /vuelos/);
  assert.equal(matchOpportunity(puentes, tech, date).eligibleForSuggestions, false);
  assert.equal(ylai.cost, 'gratis');
  assert.equal(ylai.status, 'consult');
  assert.match(ylai.note, /no se verificó una nueva fecha/);
  assert.equal(makers.cost, 'gratis');
  assert.equal(availability(makers, new Date('2026-09-21T05:00:00Z')), 'closed');
  assert.match(makers.note, /remota/);
  const regionalMatch = matchOpportunity(makers, { ...tech, stage: 'idea', needs: ['aprender'] }, date);
  assert.ok(regionalMatch.eligibleForSuggestions);
  assert.ok(regionalMatch.pending.some((reason) => reason.includes('edad')));
});

test('Investment programs disclose equity and regional reach without reopening closed rounds', () => {
  const mexico = atlasCountries.find((c) => c.code === 'MX');
  const invest = ['500-latam', 'latitud-fellowship', 'rockstart-latam', 'platanus-programa'];
  assert.ok(countryOpportunities(opportunities, mexico).some((o) => o.id === '500-latam'));
  for (const id of invest) {
    const item = find(id);
    assert.equal(item.category, 'inversion');
    assert.equal(item.benefitType, 'Inversión por participación');
    assert.equal(matchOpportunity(item, tech, date).eligibleForSuggestions, id === 'rockstart-latam');
  }
  assert.equal(availability(find('platanus-programa'), date), 'closed');
  assert.equal(availability(find('endeavor-argentina-premio'), new Date('2026-10-01T04:00:00Z')), 'closed');
  assert.equal(find('fondo-emprender-sena').benefitType, 'Capital semilla condonable');
});

test('IFE Accelerator distinguishes conditional costs, international reach and closed intake', () => {
  const item = find('ife-accelerator');
  assert.equal(item.countryCode, 'MX');
  assert.equal(item.matchScope, 'Latinoamérica');
  assert.equal(item.category, 'incubacion');
  assert.equal(item.cost, 'condicionado');
  assert.equal(item.mode, 'Híbrido');
  assert.match(item.requirements.join(' '), /5%.*ingresos netos.*12 meses/);
  assert.match(item.note, /26 de julio.*19 de julio/);
  assert.match(item.sourceUrl, /Bases%20EN\.pdf$/);
  assert.ok(matchesText(item, 'edtech ife'));
  for (const country of atlasCountries) {
    assert.equal(matchOpportunity(item, { ...tech, countryCode: country.code }, date).eligibleForSuggestions, false);
  }
});

test('Every mapped country gets its own local suggestions, not Peru by default', () => {
  const examples = {
    PE: 'startup-peru', MX: 'incmty-accelerator', CO: 'innpulsa-convocatorias',
    CL: 'startup-chile-ignite', AR: 'endeavor-argentina-premio', BR: 'sebrae-startups',
  };
  for (const [countryCode, id] of Object.entries(examples)) {
    const profile = { ...tech, countryCode };
    assert.ok(validateProfile(profile), countryCode);
    assert.ok(matchOpportunity(find(id), profile, date).eligibleForSuggestions, id);
    for (const other of Object.keys(examples).filter((c) => c !== countryCode)) {
      assert.equal(matchOpportunity(find(id), { ...tech, countryCode: other }, date).eligibleForSuggestions, false, `${id} from ${other}`);
    }
  }
});

test('Regional and global suggestions name the selected country and retain pending requirements', () => {
  for (const country of atlasCountries) {
    const profile = { ...tech, countryCode: country.code };
    for (const id of ['aws-activate', 'rockstart-latam']) {
      const match = matchOpportunity(find(id), profile, date);
      assert.ok(match.eligibleForSuggestions, `${id} / ${country.code}`);
      assert.ok(match.pending.some((reason) => reason.includes(`desde ${country.name}`)));
    }
    for (const item of opportunities.filter((o) => availability(o, date) === 'closed')) {
      assert.equal(matchOpportunity(item, profile, date).eligibleForSuggestions, false);
    }
  }
});

test('New country records do not leak other national programs into matches', () => {
  const profile = { ...tech, countryCode: 'EC' };
  assert.ok(validateProfile(profile));
  const matches = opportunities.filter((o) => matchOpportunity(o, profile, date).eligibleForSuggestions);
  assert.ok(matches.length > 0);
  assert.ok(matches.every((o) => o.countryCode === 'EC' || ['Global', 'Latinoamérica'].includes(o.geography) || o.matchScope === 'Latinoamérica'));
  assert.equal(matchOpportunity(find('aws-activate'), { ...tech, countryCode: 'XX' }, date).eligibleForSuggestions, false);
});

test('Legacy Peruvian profiles migrate without overriding a selected country', () => {
  const { countryCode, ...answers } = tech;
  const migrated = validateProfile({ ...answers, region: 'Cusco' });
  assert.deepEqual(migrated, { ...answers, countryCode: 'PE' });
  assert.deepEqual(validateProfile(migrated), migrated);
  assert.equal(validateProfile({ ...answers, region: 'Inventada' }), null);
  assert.equal(validateProfile({ ...answers }), null);
  assert.equal(validateProfile({ ...answers, region: 'Lima', countryCode: 'XX' }), null);
  assert.equal(validateProfile({ ...answers, region: 'Lima', countryCode: 'BR' }).countryCode, 'BR');
});
