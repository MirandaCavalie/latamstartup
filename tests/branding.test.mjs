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

test('The homepage poster is a real image, separate from the combi site mark', () => {
  const poster = readFileSync(
    new URL(
      '../public/brand/tu-envidia-es-mi-progreso-combi.png',
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
  assert.match(mark, /\/brand\/combi-mark\.png/);
  assert.match(mark, /la combi/);
  assert.doesNotMatch(mark, /poster|BrandLogo/);
  const combi = readFileSync(new URL('../public/brand/combi-mark.png', import.meta.url));
  assert.equal(combi.subarray(1, 4).toString(), 'PNG');
  assert.equal(combi.readUInt32BE(16), combi.readUInt32BE(20));
  const welcome = readFileSync(new URL('../components/welcome-gate.tsx', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  assert.match(welcome, /<SiteMark\s*\/>/);
  assert.match(layout, /La Combi/);
  assert.doesNotMatch(mark + welcome + layout, /chancla-mark|chancletazo/i);
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
  for (const token of ['yellow', 'red', 'blue', 'green', 'paper']) {
    assert.ok(css.includes(`--combi-${token}:`));
  }
  assert.doesNotMatch(css, /animation: (?:combi|route|ticket)[^;]*infinite/);
  assert.match(css, /\.welcome-combi, \.welcome-orbit, \.welcome-route-ticket, \.site-mark img, \.site-mark:hover img \{ animation: none; \}/);
});
