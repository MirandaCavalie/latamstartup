import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { geoMercator, geoPath, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json' with { type: 'json' };
import { atlasCountries } from '../lib/atlas.ts';
import { fitMapCamera, zoomMapAt } from '../lib/map-camera.ts';
import { countryColor, diversePreview, previewLimit, stickerCell } from '../lib/map-presentation.ts';

const projection = geoMercator().scale(1).translate([0, 0]);
const path = geoPath(projection);
const features = feature(world, world.objects.countries).features;
const bounds = [projection([-119, 34]), projection([-33, -57])];

test('Initial map frames LATAM in desktop and portrait without preselecting a country', () => {
  for (const [width, height] of [[1440, 800], [390, 700], [320, 580]]) {
    const camera = fitMapCamera(bounds, width, height);
    for (const country of atlasCountries) {
      const point = projection(country.coordinates);
      const x = camera.x + point[0] * camera.scale;
      const y = camera.y + point[1] * camera.scale;
      assert.ok(x >= 0 && x <= width, country.name);
      assert.ok(y >= 0 && y <= height, country.name);
    }
  }
});

test('Each LATAM country fits between the floating cards and above the mobile previews', () => {
  for (const country of atlasCountries) {
    const boundary = features.find((item) => String(item.id).padStart(3, '0') === country.id);
    assert.ok(boundary, country.name);
    const countryBounds = path.bounds(boundary);
    for (const [width, height] of [[1440, 800], [800, 600], [390, 700], [320, 580]]) {
      const camera = fitMapCamera(countryBounds, width, height, true);
      assert.ok(camera.scale > 0 && camera.scale <= 2400);
      for (const point of countryBounds) {
        const x = camera.x + point[0] * camera.scale;
        const y = camera.y + point[1] * camera.scale;
        const side = width >= 760 ? Math.min(300, width * .26) : 24;
        assert.ok(x >= side - 1 && x <= width - side + 1, country.name + ': horizontal');
        assert.ok(y >= 0 && y <= height - (width < 760 ? 340 : 140), country.name + ': vertical');
      }
    }
  }
});

test('Zoom keeps its geographic anchor fixed and caps extreme zoom', () => {
  const camera = { x: 120, y: 50, scale: 300 };
  const anchor = [450, 300];
  for (const factor of [1.4, 1 / 1.4, 100, .0001]) {
    const next = zoomMapAt(camera, factor, anchor);
    assert.ok(next.scale >= 70 && next.scale <= 3200);
    assert.ok(Math.abs((anchor[0] - camera.x) / camera.scale - (anchor[0] - next.x) / next.scale) < 1e-10);
    assert.ok(Math.abs((anchor[1] - camera.y) / camera.scale - (anchor[1] - next.y) / next.scale) < 1e-10);
  }
});

test('Country tap coordinates can be inverted after zoom and pan', () => {
  const peru = features.find((item) => String(item.id) === '604');
  const camera = fitMapCamera(path.bounds(peru), 1440, 800, true);
  const point = projection([-75, -10]);
  const screen = [camera.x + point[0] * camera.scale + 80, camera.y + point[1] * camera.scale - 30];
  const restored = projection.invert([(screen[0] - camera.x - 80) / camera.scale, (screen[1] - camera.y + 30) / camera.scale]);
  assert.ok(geoContains(peru, restored));
});

test('Welcome is optional, the map stays available, and all original details remain', () => {
  const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const atlas = readFileSync(new URL('../components/opportunity-atlas.tsx', import.meta.url), 'utf8');
  const newsletter = readFileSync(new URL('../components/newsletter-dialog.tsx', import.meta.url), 'utf8');
  assert.match(page, /useState<'map' \| 'catalog'>\('map'\)/);
  assert.match(page, /onDetails=\{setDetails\}/);
  assert.match(page, /href=\{details.url\}/);
  assert.doesNotMatch(page, /if \(!entered\)|WelcomeGate/);
  assert.match(page, /\[showWelcome, setShowWelcome\] = useState\(true\)/);
  assert.match(atlas, /<AtlasWelcome onEnter=\{\(\) => \{ onEnter\(\); picker.current\?\.focus\(\); \}\} onNewsletter=\{onNewsletter\}/);
  assert.match(atlas, /prefers-reduced-motion: reduce/);
  assert.match(atlas, /onPointerCancel/);
  assert.match(atlas, /onLostPointerCapture/);
  assert.doesNotMatch(atlas, /combi-mark.png|map-markers/);
  assert.match(atlas, /geoMercator/);
  assert.match(newsletter, /if \(!consent\)/);
  assert.match(newsletter, /JSON.stringify\(\{ email, consent, website, deletionToken: token, privacyVersion: PRIVACY_VERSION \}\)/);
});

test('Country previews remount cleanly and stickers belong to individual cards', () => {
  const atlas = readFileSync(new URL('../components/opportunity-atlas.tsx', import.meta.url), 'utf8');
  // Equal sibling keys left orphaned sticker layers when switching countries.
  assert.match(atlas, /key=\{`\$\{selected.code\}-\$\{item.id\}`\}/);
  assert.match(atlas, /TravelSticker country=\{selected.code\} index=\{index\}/);
  assert.doesNotMatch(atlas, /country-stickers|map-results/);
  assert.match(atlas, /key=\{`results-\$\{selected.code\}`\}/);
  assert.doesNotMatch(atlas, /key=\{selected.code\}/);
});

test('Map gestures block native selection/drag without disabling country keyboard controls', () => {
  const atlas = readFileSync(new URL('../components/opportunity-atlas.tsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../app/map.css', import.meta.url), 'utf8');
  assert.match(atlas, /onDragStart=\{\(event\) => event.preventDefault\(\)\}/);
  assert.match(atlas, /onPointerDown=[\s\S]*?event.preventDefault\(\);[\s\S]*?setPointerCapture/);
  const sticker = readFileSync(new URL('../components/travel-sticker.tsx', import.meta.url), 'utf8');
  assert.match(sticker, /draggable=\{false\}/);
  assert.match(atlas, /event.key === 'Enter' \|\| event.key === ' '/);
  assert.match(css, /\.flat-map, \.flat-map \*[^}]*user-select: none;[^}]*-webkit-user-select: none;/);
});

test('Database has an explicit return to the previously selected map country', () => {
  const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const atlas = readFileSync(new URL('../components/opportunity-atlas.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(page + atlas, /Catálogo|catálogo/);
  assert.match(page, /Base de datos/);
  assert.match(page, /className="back-to-map"[\s\S]*?setSurface\('map'\)[\s\S]*?Volver al mapa/);
  assert.match(page, /initialCountryCode=\{mapCountryCode\}/);
  assert.match(page, /onCountryChange=\{setMapCountryCode\}/);
  assert.match(atlas, /country.code === initialCountryCode/);
});

test('Sticker motion is staggered, bounded, and disabled for reduced motion', () => {
  const css = readFileSync(new URL('../app/map.css', import.meta.url), 'utf8');
  assert.match(css, /\.popup-2[^}]*animation-delay: 110ms/);
  assert.match(css, /@keyframes popup-sticker-float/);
  assert.match(css, /translateY\(-5px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.map-opportunity[^}]*animation: none/);
});

test('Grid covers the viewport independently of the projected world extent', () => {
  const atlas = readFileSync(new URL('../components/opportunity-atlas.tsx', import.meta.url), 'utf8');
  assert.match(atlas, /patternUnits="userSpaceOnUse"/);
  assert.match(atlas, /<rect width="100%" height="100%" fill=\{`url\(#\$\{gridId\}\)`\}/);
  assert.doesNotMatch(atlas, /geoGraticule10/);
});

test('Every LATAM country has a distinct valid sticker accent; previews are bounded', () => {
  const colors = atlasCountries.map(country => countryColor(country.code));
  assert.equal(new Set(colors).size, atlasCountries.length);
  colors.forEach(color => assert.match(color, /^#[0-9a-f]{6}$/i));
  assert.equal(previewLimit(1440, 900), 6);
  assert.equal(previewLimit(1440, 620), 4);
  assert.equal(previewLimit(1000, 559), 2);
  assert.equal(previewLimit(1000, 760), 4);
  assert.equal(previewLimit(800, 900), 4);
  assert.equal(previewLimit(390, 700), 4);
});

test('Preview includes different support categories without duplicating records', () => {
  const records = [{id:1,category:'a'},{id:2,category:'a'},{id:3,category:'b'},{id:4,category:'c'}];
  assert.deepEqual(diversePreview(records, 3).map(r=>r.id), [1,3,4]);
  assert.deepEqual(diversePreview(records, 6).map(r=>r.id), [1,3,4,2]);
  assert.deepEqual(diversePreview([], 4), []);
});

test('Seven country pairs use distinct cells and other countries receive general art', () => {
  const pairs = ['PE','MX','CO','CL','AR','BR','EC'].flatMap(c => [stickerCell(c,0), stickerCell(c,1)]);
  assert.equal(new Set(pairs.map(p=>p.sheet+p.cell)).size, 14);
  for (const code of atlasCountries.map(c=>c.code)) {
    for (let i=0;i<6;i++) {
      const cell=stickerCell(code,i);
      assert.ok(['andes','sur','latam'].includes(cell.sheet));
      assert.ok(cell.cell>=0 && cell.cell<6);
    }
  }
  assert.deepEqual(stickerCell('BO',0), {sheet:'latam',cell:2});
});
