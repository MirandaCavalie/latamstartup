import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { geoMercator, geoPath, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json' with { type: 'json' };
import { atlasCountries } from '../lib/atlas.ts';
import { fitMapCamera, zoomMapAt } from '../lib/map-camera.ts';

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

test('Each LATAM country has a geometry and a fitted camera clear of the results panel', () => {
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
        assert.ok(x >= 0 && x < width - (width >= 760 ? 390 : 0), country.name + ': horizontal');
        assert.ok(y >= 0 && y <= height - (width < 760 ? Math.min(height * .44, 325) + 104 : 65), country.name + ': vertical');
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

test('Map opens directly; newsletter is optional and all original details stay available', () => {
  const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const atlas = readFileSync(new URL('../components/opportunity-atlas.tsx', import.meta.url), 'utf8');
  const newsletter = readFileSync(new URL('../components/newsletter-dialog.tsx', import.meta.url), 'utf8');
  assert.match(page, /useState<'map' \| 'catalog'>\('map'\)/);
  assert.match(page, /onDetails=\{setDetails\}/);
  assert.match(page, /href=\{details.url\}/);
  assert.doesNotMatch(page, /if \(!entered\)|WelcomeGate/);
  assert.match(atlas, /prefers-reduced-motion: reduce/);
  assert.match(atlas, /onPointerCancel/);
  assert.match(atlas, /onLostPointerCapture/);
  assert.match(atlas, /combi-mark.png/);
  assert.match(atlas, /geoMercator/);
  assert.match(newsletter, /if \(!consent\)/);
  assert.match(newsletter, /JSON.stringify\(\{ email, consent, website \}\)/);
});
