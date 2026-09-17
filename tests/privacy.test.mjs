import test from 'node:test';
import assert from 'node:assert/strict';
import { hashToken, validDeletionToken } from '../lib/privacy.ts';
import { readSmallJson, sameOriginJson } from '../lib/request-checks.ts';

test('Removal credentials are validated and hashed, never stored verbatim', async () => {
  const token = 'a'.repeat(64);
  assert.equal(validDeletionToken(token), true);
  for (const value of [null, {}, 'a'.repeat(63), 'z'.repeat(64), token + '\n']) assert.equal(validDeletionToken(value), false);
  const digest = await hashToken(token);
  assert.equal(digest.length, 64);
  assert.notEqual(digest, token);
  assert.equal(digest, await hashToken(token));
  assert.notEqual(digest, await hashToken('b'.repeat(64)));
});

test('Missing origin, malformed JSON and oversized multibyte streams fail closed', async () => {
  const request = (body) => new Request('https://example.com/api/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  assert.equal(sameOriginJson(request('{}')), false);
  for (const body of ['null', '[]', '{broken', JSON.stringify({ text: '😀'.repeat(800) })]) assert.equal(await readSmallJson(request(body)), null);
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(2000)); },
    cancel() { cancelled = true; },
  });
  assert.equal(await readSmallJson(new Request('https://example.com', { method: 'POST', body: stream, duplex: 'half' })), null);
  assert.equal(cancelled, true);
});
