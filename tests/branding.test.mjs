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
    assert.match(logo.src, /^\/logos\/[a-z0-9-]+\.(png|svg|webp)$/);
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

test('The homepage poster is a real image, separate from the chancla site mark', () => {
  const poster = readFileSync(
    new URL(
      '../public/brand/tu-envidia-es-mi-progreso-poster.png',
      import.meta.url,
    ),
  );
  assert.equal(poster.subarray(1, 4).toString(), 'PNG');
  assert.equal(poster.readUInt32BE(16), 1448);
  assert.equal(poster.readUInt32BE(20), 1086);
  const mark = readFileSync(
    new URL('../components/site-mark.tsx', import.meta.url),
    'utf8',
  );
  const atlas = readFileSync(
    new URL('../components/opportunity-atlas.tsx', import.meta.url),
    'utf8',
  );
  const page = readFileSync(
    new URL('../app/page.tsx', import.meta.url),
    'utf8',
  );
  assert.match(mark, /\/brand\/chancla-mark\.png/);
  assert.match(mark, /chancletazo/);
  assert.doesNotMatch(mark, /poster|BrandLogo/);
  const chancla = readFileSync(new URL('../public/brand/chancla-mark.png', import.meta.url));
  assert.equal(chancla.subarray(1, 4).toString(), 'PNG');
  assert.match(atlas, /<ChichaPoster\s*\/>/);
  assert.match(page, /<SiteMark variant="header"/);
  assert.match(page, /<SiteMark variant="footer"/);
  assert.doesNotMatch(page, /BrandLogo|ChichaPoster/);
});

test('The UI preserves image colors and the poster respects reduced motion', () => {
  const css = readFileSync(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(css, /grayscale\s*\(/);
  assert.doesNotMatch(css, /chicha-title|font-chicha/);
  assert.match(css, /animation: poster-settle 850ms[^;]*both;/);
  assert.doesNotMatch(css, /animation: poster-settle[^;]*infinite/);
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.poster-mount\s*\{\s*animation: none;/,
  );
  assert.match(css, /\.poster-sheet\s*\{\s*transition: none;/);
  assert.doesNotMatch(css, /(?:saturate|hue-rotate|sepia|brightness)\s*\(/);
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
