import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanHtmlText, normalizeRoute, routeToRepoPath, extractEditorialPage, technicalField } from '../src/r04/source-reader.mjs';

test('R04 route normalizer removes package-relative prefixes without inventing slugs', () => {
  assert.equal(normalizeRoute('../../en/data/example/'), '/en/data/example/');
  assert.equal(routeToRepoPath('../../en/data/example/'), 'en/data/example/index.html');
  assert.equal(routeToRepoPath('/es/investigacion/#estudio-4'), 'es/investigacion/index.html');
});

test('R04 HTML parser extracts only editorial main sections, sources and technical context', () => {
  const html='<!doctype html><html><head><link rel="canonical" href="https://irisgreen.eu/es/datos/x/"><meta property="article:modified_time" content="2026-09-27"></head><body><header>NO</header><main><article><p>Inicio › Datos</p><h1>Dato X</h1><section><p>Contexto completo.</p></section><section><h2>Qué ayuda</h2><ul><li>Apoyo uno.</li></ul></section><section><h2>Fuentes</h2><ul><li><a href="https://example.org/source">Fuente oficial</a></li></ul></section><section><h2>Ficha técnica</h2><ul><li><strong>Población medida:</strong> Población A</li><li><strong>Año de los datos:</strong> 2025</li></ul></section></article></main><footer>NO</footer></body></html>';
  const page=extractEditorialPage(html);
  assert.equal(page.title,'Dato X');
  assert.equal(page.canonical_url,'https://irisgreen.eu/es/datos/x/');
  assert.equal(page.reviewed_at,'2026-09-27');
  assert.ok(page.sections.some(s=>s.heading==='Qué ayuda'&&s.blocks.includes('Apoyo uno.')));
  assert.deepEqual(page.sources,[{url:'https://example.org/source',label:'Fuente oficial'}]);
  assert.equal(technicalField(page,['Población medida']),'Población A');
  assert.equal(technicalField(page,['Año de los datos']),'2025');
  assert.equal(cleanHtmlText('<p>A&nbsp;B</p>'),'A B');
});
