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

test('Original stickers replace the large poster without replacing the combi identity', () => {
  for (const [file, width, height] of [
    ['sticker-tu-envidia-neon.png', 1536, 1024],
    ['sticker-hecho-en-latam-neon.png', 1774, 887],
    ['sticker-siguiente-parada-neon.png', 1774, 887],
    ['sticker-ideas-sin-fronteras-neon.png', 1536, 1024],
  ]) {
    const sticker = readFileSync(new URL(`../public/brand/${file}`, import.meta.url));
    assert.equal(sticker.subarray(1, 4).toString(), 'PNG');
    assert.equal(sticker.readUInt32BE(16), width);
    assert.equal(sticker.readUInt32BE(20), height);
    assert.equal(sticker[25], 6, 'RGBA PNG preserves generated transparency');
  }
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
  const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  assert.match(layout, /La Combi/);
  assert.doesNotMatch(mark + page + layout, /chancla-mark|chancletazo|WelcomeGate/i);
  assert.doesNotMatch(atlas, /ChichaPoster|tu-envidia-es-mi-progreso-combi|geoOrthographic/);
  assert.match(atlas, /selected && <>/);
  assert.match(atlas, /<BrandSticker kind="latam"/);
  assert.match(atlas, /'envidia'.*'parada'.*'fronteras'/);
  const sticker = readFileSync(new URL('../components/brand-sticker.tsx', import.meta.url), 'utf8');
  assert.match(sticker, /\/brand\/sticker-tu-envidia-neon\.png/);
  assert.match(sticker, /\/brand\/sticker-hecho-en-latam-neon\.png/);
  assert.match(sticker, /aria-hidden="true"/);
  assert.doesNotMatch(sticker, /<button|onClick/);
  for (const view of ['explore', 'resources', 'matches', 'saved']) {
    assert.ok(page.includes(`switchView('${view}')`));
  }
  assert.match(page, /<SiteMark variant="header"/);
  assert.match(page, /<SiteMark variant="footer"/);
  assert.doesNotMatch(page, /BrandLogo|ChichaPoster/);
});

test('The neutral UI preserves official image colors and respects reduced motion', () => {
  const css = readFileSync(
    new URL('../app/globals.css', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(css, /grayscale\s*\(/);
  assert.doesNotMatch(css, /chicha-title|font-chicha/);
  assert.match(css, /animation: sticker-arrive 800ms[^;]*both;/);
  assert.doesNotMatch(css, /animation: sticker-arrive[^;]*infinite/);
  assert.match(css, /\.brand-sticker \{ animation: none; \}/);
  assert.match(css, /\.brand-sticker img \{ transition: none; \}/);
  assert.match(css, /pointer-events: none; animation: sticker-arrive/);
  assert.match(css, /--combi-paper: #fafafa/);
  assert.match(css, /--sticker-lilac: #ded7fa/);
  assert.doesNotMatch(css, /(?:saturate|hue-rotate|sepia|brightness)\s*\(/);
  for (const token of ['yellow', 'red', 'blue', 'green', 'paper']) {
    assert.ok(css.includes(`--combi-${token}:`));
  }
  assert.doesNotMatch(css, /animation: (?:combi|route|ticket)[^;]*infinite/);
  assert.match(css, /\.welcome-combi, \.welcome-orbit, \.welcome-route-ticket, \.site-mark img, \.site-mark:hover img \{ animation: none; \}/);
});
