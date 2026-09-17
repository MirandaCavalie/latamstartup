import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { opportunities } from '../lib/opportunities.ts';
import { providerLogos } from '../lib/provider-logos.ts';

test('Every opportunity has a local, attributed program or provider image', () => {
  const sources = readFileSync(
    new URL('../public/logos/SOURCES.md', import.meta.url),
    'utf8',
  );
  for (const item of opportunities) {
    const logo = providerLogos[item.id];
    assert.ok(logo, `Missing logo: ${item.id}`);
    assert.match(logo.src, /^\/logos\/[a-z0-9-]+\.(png|svg)$/);
    assert.ok(['program', 'provider'].includes(logo.kind));
    assert.ok(logo.name.length > 1);
    const file = new URL(`../public${logo.src}`, import.meta.url);
    assert.ok(existsSync(file), logo.src);
    assert.ok(readFileSync(file).length > 100);
    assert.ok(
      sources.includes(logo.src.split('/').at(-1)),
      'Missing attribution',
    );
    if (logo.src.endsWith('.svg')) {
      const svg = readFileSync(file, 'utf8');
      assert.doesNotMatch(
        svg,
        /<script\b|<foreignObject\b|\bon\w+\s*=|(?:href|xlink:href)\s*=\s*["']https?:/i,
      );
    }
  }
});

test('The brand is a real PNG and site styles do not grayscale brand or flag images', () => {
  const logo = readFileSync(
    new URL('../public/brand/tu-envidia-es-mi-progreso.png', import.meta.url),
  );
  assert.equal(logo.subarray(1, 4).toString(), 'PNG');
  const css = readFileSync(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(css, /grayscale\s*\(/);
  assert.doesNotMatch(css, /chicha-title|font-chicha/);
  for (const [color] of css.matchAll(/#[0-9a-f]{6}(?:[0-9a-f]{2})?\b/gi)) {
    assert.equal(
      color.slice(1, 3),
      color.slice(3, 5),
      `Non-neutral UI color ${color}`,
    );
    assert.equal(
      color.slice(3, 5),
      color.slice(5, 7),
      `Non-neutral UI color ${color}`,
    );
  }
});
