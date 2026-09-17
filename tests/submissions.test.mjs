import test from 'node:test';
import assert from 'node:assert/strict';
import { validEmail, validSuggestion } from '../lib/submission-validation.ts';
import { sameOriginJson, readSmallJson } from '../lib/request-checks.ts';

test('Newsletter email is normalized and invalid values rejected', () => {
  assert.equal(validEmail('  Hola@Example.COM  '), 'hola@example.com');
  assert.equal(validEmail('sin-arroba'), null);
  assert.equal(validEmail('x'.repeat(255) + '@example.com'), null);
});

test('Program suggestions require a first-party HTTPS link and known geography', () => {
  const input = {
    name: 'Una incubadora', officialUrl: 'https://institucion.pe/programa',
    country: 'Perú', kind: 'programa', note: '', replyEmail: '',
  };
  assert.equal(validSuggestion(input).officialUrl, input.officialUrl);
  assert.equal(validSuggestion({ ...input, officialUrl: 'javascript:alert(1)' }), null);
  assert.equal(validSuggestion({ ...input, officialUrl: 'http://institucion.pe' }), null);
  assert.equal(validSuggestion({ ...input, country: 'Inventado' }), null);
  assert.equal(validSuggestion({ ...input, replyEmail: 'sin email' }), null);
  assert.equal(validSuggestion({ ...input, note: 'a'.repeat(601) }), null);
});

test('Write requests stay same-origin, JSON-only and bounded', async () => {
  const request = new Request('https://ejemplo.com/api/suggest', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://ejemplo.com' },
    body: JSON.stringify({ name: 'test' }),
  });
  assert.equal(sameOriginJson(request), true);
  assert.deepEqual(await readSmallJson(request), { name: 'test' });
  const foreign = new Request('https://ejemplo.com/api/suggest', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://otro.com' },
    body: '{}',
  });
  assert.equal(sameOriginJson(foreign), false);
  const tooLarge = new Request('https://ejemplo.com/api/suggest', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'x'.repeat(3001) }),
  });
  assert.equal(await readSmallJson(tooLarge), null);
});
