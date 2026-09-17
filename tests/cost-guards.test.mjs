import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { INTAKE_SQL, DAILY_INTAKE_LIMITS, reserveIntake } from '../lib/intake-budget.ts';

function database() {
  const db = new DatabaseSync(':memory:');
  for (const file of readdirSync(new URL('../drizzle/', import.meta.url)).filter((f) => f.endsWith('.sql')).sort()) db.exec(readFileSync(new URL(`../drizzle/${file}`, import.meta.url), 'utf8'));
  return db;
}

test('Global intake cannot exceed its daily allowance and has no personal identifiers', () => {
  const db = database();
  try {
    const statement = db.prepare(INTAKE_SQL);
    for (const [kind, limit] of Object.entries(DAILY_INTAKE_LIMITS)) {
      for (let i = 1; i <= limit; i++) assert.equal(statement.get(kind, limit).used, i);
      for (let i = 0; i < 10; i++) assert.equal(statement.get(kind, limit), undefined);
      assert.equal(db.prepare('SELECT used FROM daily_intake WHERE kind=?').get(kind).used, limit);
    }
    assert.deepEqual(db.prepare('PRAGMA table_info(daily_intake)').all().map((r) => r.name), ['day', 'kind', 'used']);
    db.prepare("UPDATE daily_intake SET day=date('now', '-1 day')").run();
    assert.equal(statement.get('subscribe', 200).used, 1);
  } finally { db.close(); }
});

test('Intake reservation fails closed on database errors', async () => {
  await assert.rejects(reserveIntake({ prepare() { throw new Error('unavailable'); } }, 'match'));
  assert.equal(await reserveIntake({ prepare() { return { bind() { return { first: async () => null }; } }; } }, 'match'), false);
});

test('Removal and retention use indexes instead of whole-table scans', () => {
  const db = database();
  try {
    for (const [query, index] of [
      ["SELECT id FROM subscribers WHERE deletion_hash='test'", 'subscribers_deletion_hash_idx'],
      ["SELECT id FROM subscribers WHERE consent_at < datetime('now', '-24 months')", 'subscribers_consent_at_idx'],
      ["SELECT deletion_hash FROM match_profiles WHERE updated_at < datetime('now', '-12 months')", 'match_profiles_updated_at_idx'],
      ["SELECT id FROM suggestions WHERE created_at < datetime('now', '-12 months')", 'suggestions_created_at_idx'],
    ]) assert.ok(db.prepare(`EXPLAIN QUERY PLAN ${query}`).all().some((r) => r.detail.includes(index)));
  } finally { db.close(); }
});
