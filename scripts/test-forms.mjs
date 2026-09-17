// Integration checks against LOCAL D1 only. Never run fixture writes in production.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { hashToken, PRIVACY_VERSION } from '../lib/privacy.ts';

const base = new URL(process.argv[2] ?? 'http://localhost:8787');
assert.ok(['localhost', '127.0.0.1'].includes(base.hostname), 'Only local test servers are allowed');
const token = randomBytes(32).toString('hex');
const other = randomBytes(32).toString('hex');
const email = `integration-${token.slice(0, 12)}@example.invalid`;
const hash = await hashToken(token);
const sql = (command) => {
  const output = execFileSync('npx', ['wrangler', 'd1', 'execute', 'DB', '--local', '--json', '--command', command], { encoding: 'utf8' });
  return JSON.parse(output)[0].results;
};
const call = (route, body, method = 'POST', origin = base.origin) => fetch(new URL(`/api/${route}`, base), {
  method, headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});
const consent = { consent: true, privacyVersion: PRIVACY_VERSION, deletionToken: token };
const profile = { countryCode: 'BR', stage: 'idea', businessType: 'startup', sector: 'tecnologia', needs: ['capital'] };
try {
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.equal(home.headers.get('x-frame-options'), 'DENY');
  assert.match(await home.text(), /la combi|La Combi/i);
  const privacy = await fetch(new URL('/privacidad', base));
  assert.equal(privacy.status, 200);
  assert.match(await privacy.text(), /privacy@example.invalid/);
  assert.equal((await fetch(new URL('/api/subscribe', base))).status, 405);
  assert.equal((await call('subscribe', { email, ...consent }, 'POST', 'https://foreign.example')).status, 400);
  assert.equal((await call('subscribe', { email, ...consent, consent: false })).status, 400);
  assert.equal((await call('subscribe', { email, ...consent, website: 'bot' })).status, 200);
  assert.equal(sql(`SELECT count(*) AS n FROM subscribers WHERE email='${email}'`)[0].n, 0);
  const suggestion = { name: 'Integration fixture', officialUrl: `https://example.invalid/${token}`, country: 'Perú', kind: 'programa', note: '', replyEmail: '', consent: true, privacyVersion: PRIVACY_VERSION };
  assert.equal((await call('suggest', { ...suggestion, consent: false })).status, 400);
  assert.equal((await call('suggest', suggestion)).status, 201);
  assert.equal(sql(`SELECT status FROM suggestions WHERE official_url='${suggestion.officialUrl}'`)[0].status, 'pending');
  sql(`UPDATE suggestions SET created_at=datetime('now', '-13 months') WHERE official_url='${suggestion.officialUrl}'; INSERT INTO subscribers (email, consent_at) VALUES ('${email}', datetime('now', '-25 months')); INSERT INTO match_profiles (deletion_hash, country_code, stage, business_type, sector, needs, recommended_ids, privacy_version, algorithm_version, updated_at) VALUES ('${hash}', 'BR', 'idea', 'startup', 'tecnologia', '[]', '[]', '${PRIVACY_VERSION}', 'test', datetime('now', '-13 months'))`);
  assert.equal((await fetch(new URL('/cdn-cgi/local/scheduled', base))).status, 200);
  assert.equal(sql(`SELECT count(*) AS n FROM subscribers WHERE email='${email}'`)[0].n, 0);
  assert.equal(sql(`SELECT count(*) AS n FROM match_profiles WHERE deletion_hash='${hash}'`)[0].n, 0);
  assert.equal(sql(`SELECT count(*) AS n FROM suggestions WHERE official_url='${suggestion.officialUrl}'`)[0].n, 0);
  const response = await call('subscribe', { email, ...consent });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await call('subscribe', { email, ...consent, deletionToken: other })).status, 200);
  const subscriber = sql(`SELECT deletion_hash, privacy_version, status FROM subscribers WHERE email='${email}'`);
  assert.deepEqual(subscriber, [{ deletion_hash: hash, privacy_version: PRIVACY_VERSION, status: 'unverified' }]);
  assert.equal((await call('subscribe', { deletionToken: other }, 'DELETE')).status, 200);
  assert.equal(sql(`SELECT count(*) AS n FROM subscribers WHERE email='${email}'`)[0].n, 1);
  assert.equal((await call('match', { ...consent, profile, consent: false })).status, 400);
  assert.equal((await call('match', { ...consent, profile })).status, 200);
  assert.equal((await call('match', { ...consent, profile: { ...profile, countryCode: 'MX', email: 'discard@example.invalid' } })).status, 200);
  const rows = sql(`SELECT * FROM match_profiles WHERE deletion_hash='${hash}'`);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].country_code, 'MX');
  assert.equal(JSON.stringify(rows).includes('discard@'), false);
  assert.equal((await call('match', { ...consent, profile: { ...profile, countryCode: "'; DROP TABLE subscribers;--" } })).status, 400);
  assert.equal((await call('match', { deletionToken: token }, 'DELETE')).status, 200);
  assert.equal((await call('subscribe', { deletionToken: token }, 'DELETE')).status, 200);
  assert.equal(sql(`SELECT count(*) AS n FROM match_profiles WHERE deletion_hash='${hash}'`)[0].n, 0);
  assert.equal(sql(`SELECT count(*) AS n FROM subscribers WHERE email='${email}'`)[0].n, 0);
  // Rate checks last, after API deletion has been verified.
  const intake = sql("SELECT used FROM daily_intake WHERE day=date('now') AND kind='match'")[0].used;
  try {
    sql("UPDATE daily_intake SET used=1000 WHERE day=date('now') AND kind='match'");
    const paused = await call('match', { ...consent, profile });
    assert.equal(paused.status, 429);
    assert.match((await paused.json()).error, /hoy pausamos/);
    assert.equal((await call('match', { deletionToken: token }, 'DELETE')).status, 200);
  } finally {
    sql(`UPDATE daily_intake SET used=${Number(intake)} WHERE day=date('now') AND kind='match'`);
  }
  const burst = await Promise.all(Array.from({ length: 25 }, () => call('match', {})));
  assert.ok(burst.some((r) => r.status === 429), 'Rate limit should reject bursts');
  console.log('Local HTTP/D1 checks passed: consent, origin, no public reads, deduplication, isolated match, deletion, suggestions, scheduled retention, daily pause with deletion preserved, rate limits.');
} finally {
  sql(`DELETE FROM subscribers WHERE email='${email}'; DELETE FROM match_profiles WHERE deletion_hash IN ('${hash}', '${await hashToken(other)}'); DELETE FROM suggestions WHERE official_url='https://example.invalid/${token}'`);
}
