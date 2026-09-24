'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRetrievalPanel } = require('../sabik/retrieval-panel.js');

let groupSources;
test.before(async () => { ({ groupSources } = await import('../cloud/n04-r38-library/src/source-groups.mjs')); });

class FakeText {
  constructor(document, value) { this.ownerDocument = document; this.parentNode = null; this.nodeType = 3; this.data = String(value); }
  get textContent() { return this.data; }
  set textContent(value) { this.data = String(value); }
}

class FakeElement {
  constructor(document, tagName) {
    this.ownerDocument = document;
    this.tagName = String(tagName).toUpperCase();
    this.parentNode = null;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.className = '';
    this.type = '';
  }
  contains(node) { return node === this || this.children.some(child => child === node || child.contains?.(node)); }
  appendChild(node) { node.parentNode = this; this.children.push(node); return node; }
  append(...nodes) { nodes.forEach(node => this.appendChild(typeof node === 'string' ? this.ownerDocument.createTextNode(node) : node)); }
  replaceChildren(...nodes) { this.children.forEach(node => { node.parentNode = null; }); this.children = []; this.append(...nodes); }
  setAttribute(name, value) { this.attributes.set(String(name), String(value)); }
  getAttribute(name) { return this.attributes.has(String(name)) ? this.attributes.get(String(name)) : null; }
  removeAttribute(name) { this.attributes.delete(String(name)); }
  addEventListener(type, listener) { if (!this.listeners.has(type)) this.listeners.set(type, []); this.listeners.get(type).push(listener); }
  click() { for (const listener of this.listeners.get('click') || []) listener({ currentTarget: this, preventDefault() {} }); }
  focus() { this.ownerDocument.focusCalls.push(this); this.ownerDocument.activeElement = this; }
  get textContent() { return this.children.map(node => node.textContent).join(''); }
  set textContent(value) { this.replaceChildren(this.ownerDocument.createTextNode(value)); }
}

class FakeDocument {
  constructor() { this.activeElement = null; this.focusCalls = []; }
  createElement(tagName) { return new FakeElement(this, tagName); }
  createTextNode(value) { return new FakeText(this, value); }
}

function descendants(node) {
  const all = [];
  for (const child of node.children || []) {
    if (child.nodeType !== 3) all.push(child);
    all.push(...descendants(child));
  }
  return all;
}

function byTag(root, tag) { return descendants(root).filter(node => node.tagName === tag.toUpperCase()); }
function byClass(root, className) { return descendants(root).filter(node => String(node.className).split(/\s+/).includes(className)); }
function deferred() { let resolve, reject; const promise = new Promise((res, rej) => { resolve = res; reject = rej; }); return { promise, resolve, reject }; }
function fixture(overrides = {}) {
  return {
    library_version: 'n04-es-20260916-56f72c4d3959',
    fragment_id: 'es-biblioteca-sobrecarga.sec1',
    snippet: 'Texto original del fragmento.',
    url: 'https://irisgreen.eu/es/biblioteca/sobrecarga-sensorial',
    title: 'Sobrecarga sensorial',
    heading: 'Qué puede ocurrir',
    source_type: 'library',
    concepts: ['sensorial', 'ruido'],
    score: 222,
    ...overrides
  };
}
function envelope(candidates) { return { library_version: 'n04-es-20260916-56f72c4d3959', candidates, groups: groupSources(candidates), source_language: 'es' }; }
function setup(query, language = 'es') {
  const document = new FakeDocument();
  const root = document.createElement('div');
  const announcement = document.createElement('div');
  const input = document.createElement('textarea');
  document.activeElement = input;
  const panel = createRetrievalPanel({ root, query, announcement, language });
  return { document, root, announcement, input, panel };
}

test('renders real traceable results in engine order without reranking', async () => {
  const results = [fixture({ fragment_id: 'frag-b', score: 90, title: 'Segundo' }), fixture({ fragment_id: 'frag-a', score: 12, title: 'Primero', url: 'https://irisgreen.eu/es/otro' })];
  const original = JSON.stringify(results);
  const { root, panel } = setup(async () => envelope(results));
  const outcome = await panel.run({ query: 'sensorial' });
  assert.deepEqual(outcome, { status: 'results', count: 2, library_version: envelope([]).library_version });
  const items = byClass(root, 'sabik-retrieval-citation');
  assert.deepEqual(items.map(item => item.getAttribute('data-fragment-id')), ['frag-b', 'frag-a']);
  assert.deepEqual(items.map(item => item.getAttribute('data-score')), ['90', '12']);
  assert.equal(JSON.stringify(results), original, 'input candidates must remain intact');
});

test('preserves same URL when distinct fragments carry different information', async () => {
  const url = 'https://irisgreen.eu/es/biblioteca/sobrecarga-sensorial';
  const { root, panel } = setup(async () => envelope([
    fixture({ fragment_id: 'frag-1', url, snippet: 'Fragmento uno.' }),
    fixture({ fragment_id: 'frag-2', url, snippet: 'Fragmento dos.' })
  ]));
  await panel.run({ query: 'sobrecarga' });
  const items = byClass(root, 'sabik-retrieval-citation');
  assert.equal(items.length, 2);
  assert.deepEqual(items.map(item => item.getAttribute('data-fragment-id')), ['frag-1', 'frag-2']);
  assert.deepEqual(byTag(root, 'a').map(link => link.getAttribute('href')), [url]);
  assert.equal(byTag(root, 'li').length, 1);
});

test('HTML-like characters remain text and never become executable markup', async () => {
  const dangerous = '<img src=x onerror="globalThis.pwned=1"><script>pwned()</script>';
  const { root, panel } = setup(async () => envelope([fixture({ title: dangerous, snippet: dangerous, heading: dangerous })]));
  await panel.run({ query: 'x' });
  assert.ok(root.textContent.includes(dangerous));
  assert.equal(byTag(root, 'script').length, 0);
  assert.equal(byTag(root, 'img').length, 0);
});

test('empty response has a dedicated non-AI state', async () => {
  const { root, announcement, panel } = setup(async () => envelope([]));
  const outcome = await panel.run({ query: 'sin coincidencias' });
  assert.deepEqual(outcome, { status: 'empty', count: 0, library_version: envelope([]).library_version });
  assert.equal(root.getAttribute('data-retrieval-state'), 'empty');
  assert.match(root.textContent, /No hay resultados de Iris Green/);
  assert.equal(announcement.textContent, 'No hay resultados disponibles.');
});

test('mixed library version fails closed as a recoverable UI error', async () => {
  const { root, panel } = setup(async () => envelope([fixture({ library_version: 'other-version' })]));
  const outcome = await panel.run({ query: 'x' });
  assert.equal(outcome.status, 'error');
  assert.equal(root.getAttribute('data-retrieval-state'), 'error');
  assert.equal(byTag(root, 'li').length, 0);
});

test('missing fragment identity fails closed without partial result rendering', async () => {
  const broken = fixture(); delete broken.fragment_id;
  const { root, panel } = setup(async () => envelope([broken, fixture({ fragment_id: 'good' })]));
  const outcome = await panel.run({ query: 'x' });
  assert.equal(outcome.status, 'error');
  assert.equal(byTag(root, 'li').length, 0);
});

test('unsafe or invented URL schemes are rejected instead of becoming links', async () => {
  const { root, panel } = setup(async () => envelope([fixture({ url: 'javascript:alert(1)' })]));
  assert.equal((await panel.run({ query: 'x' })).status, 'error');
  assert.equal(byTag(root, 'a').length, 0);
});

test('query errors reveal no private error message and expose an explicit retry control', async () => {
  let calls = 0;
  const { root, panel } = setup(async () => { calls += 1; throw new Error('secret-token private-query'); });
  const outcome = await panel.run({ query: 'private-query' });
  assert.equal(outcome.status, 'error');
  assert.doesNotMatch(root.textContent, /secret-token|private-query/);
  const retry = byClass(root, 'sabik-retrieval-retry')[0];
  assert.ok(retry);
  retry.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls, 2);
});

test('cancelled operation ignores a late completion and does not claim transport cancellation', async () => {
  const wait = deferred();
  const { root, panel } = setup(() => wait.promise);
  const pending = panel.run({ query: 'old' });
  assert.equal(root.getAttribute('aria-busy'), 'true');
  assert.deepEqual(panel.cancel(), { status: 'cancelled', cancelled: true });
  assert.equal(root.getAttribute('data-retrieval-state'), 'cancelled');
  wait.resolve(envelope([fixture({ title: 'Old result' })]));
  assert.deepEqual(await pending, { status: 'stale' });
  assert.doesNotMatch(root.textContent, /Old result/);
});

test('a newer query wins even if an older query resolves last', async () => {
  const first = deferred();
  const second = deferred();
  let call = 0;
  const { root, panel } = setup(() => (++call === 1 ? first.promise : second.promise));
  const oldRun = panel.run({ query: 'old' });
  const newRun = panel.run({ query: 'new' });
  second.resolve(envelope([fixture({ fragment_id: 'new-fragment', title: 'Nuevo' })]));
  assert.equal((await newRun).status, 'results');
  first.resolve(envelope([fixture({ fragment_id: 'old-fragment', title: 'Antiguo' })]));
  assert.deepEqual(await oldRun, { status: 'stale' });
  assert.deepEqual(byClass(root, 'sabik-retrieval-citation').map(item => item.getAttribute('data-fragment-id')), ['new-fragment']);
});

test('component never steals focus while results or errors are rendered', async () => {
  const { document, input, panel } = setup(async () => envelope([fixture()]));
  await panel.run({ query: 'x' });
  assert.equal(document.activeElement, input);
  assert.deepEqual(document.focusCalls, []);
});

test('reuses the provided announcement region instead of creating another live region', async () => {
  const { root, announcement, panel } = setup(async () => envelope([fixture()]));
  await panel.run({ query: 'x' });
  assert.equal(announcement.textContent, '1 resultado disponible.');
  assert.equal(descendants(root).filter(node => node.getAttribute('aria-live')).length, 0);
});

test('English strings are available without changing result/source data', async () => {
  const candidate = fixture({ title: 'Título en corpus' });
  const { root, announcement, panel } = setup(async () => envelope([candidate]), 'en');
  await panel.run({ query: 'x' });
  assert.match(root.textContent, /Results from Iris Green/);
  assert.doesNotMatch(root.textContent, /Fragment ID|Library version|Source type|es-biblioteca-sobrecarga.sec1/);
  assert.equal(root.getAttribute('lang'), 'en');
  assert.equal(byTag(root, 'a')[0].getAttribute('lang'), 'es');
  assert.equal(byClass(root, 'sabik-retrieval-citation')[0].getAttribute('lang'), 'es');
  assert.equal(announcement.textContent, '1 result available.');
  assert.equal(byTag(root, 'a')[0].textContent, candidate.title);
});

test('source contains no transport, persistence, executable HTML, API/chat or visual-state implementation', () => {
  const code = fs.readFileSync(path.join(__dirname, '../sabik/retrieval-panel.js'), 'utf8');
  assert.doesNotMatch(code, /\bfetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|document\.cookie|innerHTML|outerHTML|insertAdjacentHTML|\/api\/chat|openai|anthropic|embedding|spinner/i);
  assert.doesNotMatch(code, /PRESENTE|ORIENTAR|TRANSICI[ÓO]N|PAUSA|CONFIRMAR/iu);
});

test('canonical REQUEST_CANCELLED renders cancellation in ES and EN without retrying automatically', async () => {
  for (const language of ['es', 'en']) {
    let calls = 0;
    const { panel, root } = setup(async () => { calls++; throw Object.assign(new Error('private'), { code: 'REQUEST_CANCELLED' }); }, language);
    assert.equal((await panel.run({ query: 'x' })).status, 'cancelled');
    assert.equal(calls, 1);
    assert.match(root.textContent, language === 'es' ? /canceló/ : /cancelled/);
    assert.doesNotMatch(root.textContent, /private|REQUEST_CANCELLED/);
  }
});

test('cancelling one panel aborts only its own transport signal', async () => {
  const wait = deferred(); const signals = [];
  const query = (_request, { signal }) => { signals.push(signal); return wait.promise; };
  const first = setup(query); const second = setup(query);
  const a = first.panel.run({}); const b = second.panel.run({});
  first.panel.cancel();
  assert.equal(signals[0].aborted, true); assert.equal(signals[1].aborted, false);
  wait.resolve(envelope([fixture()]));
  assert.equal((await a).status, 'stale'); assert.equal((await b).status, 'results');
});

test('metadata remains traceable but never appears in visible or accessible copy', async () => {
  const candidate = fixture({ fragment_id: 'PRIVATE-TECH-ID', source_type: 'TECH-TYPE' });
  const { panel, root } = setup(async () => envelope([candidate]));
  await panel.run({});
  const citation = byClass(root, 'sabik-retrieval-citation')[0];
  assert.equal(citation.getAttribute('data-fragment-id'), candidate.fragment_id);
  assert.equal(citation.getAttribute('data-library-version'), candidate.library_version);
  assert.equal(citation.getAttribute('data-score'), String(candidate.score));
  assert.doesNotMatch(root.textContent, /PRIVATE-TECH-ID|TECH-TYPE|n04-es-|Tipo de fuente|Versión de biblioteca/);
  assert.ok(descendants(root).every(node => !node.getAttribute('aria-label') && !node.getAttribute('title')));
});

test('language switch preserves exact Spanish citation and focused source link', async () => {
  const { panel, root, document } = setup(async () => envelope([fixture()]));
  await panel.run({}); byTag(root, 'a')[0].focus();
  panel.setLanguage('en');
  assert.equal(root.getAttribute('lang'), 'en');
  assert.equal(document.activeElement, byTag(root, 'a')[0]);
  assert.equal(document.activeElement.getAttribute('lang'), 'es');
  assert.equal(byClass(root, 'sabik-retrieval-snippet')[0].textContent, fixture().snippet);
});

test('retry preserves a meaningful focus destination when its button disappears', async () => {
  let calls = 0;
  const { panel, root, document } = setup(async () => { if (!calls++) throw new Error(); return envelope([fixture()]); });
  await panel.run({}); const retry = byTag(root, 'button')[0]; retry.focus(); retry.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(panel.getState().state, 'results');
  assert.equal(document.activeElement.tagName, 'H4'); assert.ok(root.contains(document.activeElement));
});

for (const [label, mutate] of [
  ['missing group', e => { e.groups = []; }],
  ['altered quote', e => { e.groups[0].citations[0].snippet = 'invented'; }],
  ['duplicate URL card', e => { e.groups.push(e.groups[0]); }],
  ['wrong citation language', e => { e.source_language = 'en'; }],
  ['reversed fragment order', e => { e.groups[0].citations.reverse(); }],
]) {
  test(`supplied grouping fails closed: ${label}`, async () => {
    const raw = JSON.parse(JSON.stringify(envelope([fixture(), fixture({ fragment_id: 'second' })])));
    mutate(raw); const { panel, root } = setup(async () => raw);
    assert.equal((await panel.run({})).status, 'error'); assert.equal(byTag(root, 'a').length, 0);
  });
}

test('complete local handler -> bridge -> A1 -> panel renders exact corpus citations for two independent consumers', async () => {
  const { createRetrievalQuery } = await import('../sabik/retrieval-bridge.mjs');
  const { createQAHandler } = await import('../cloud/n04-r38-library/src/qa-handler.mjs');
  const { RELEASE, createManifest, loadLibrary, BINDING } = await import('../cloud/n04-r38-library/src/library.mjs');
  const manifest = createManifest({ build_head: 'a'.repeat(40), build_tree: 'b'.repeat(40), engine_sha256: 'c'.repeat(64) });
  const bytes = fs.readFileSync(path.join(__dirname, '../cloud/n04-r26-staging-binding/source/iris-fragments-index.es.json'));
  const libraryIndex = await loadLibrary({ get: async key => key === BINDING.manifestKey ? Buffer.from(JSON.stringify(manifest)) : bytes });
  const fixtureKey = 'LOCAL-COMPOSITION-FIXTURE-NOT-A-CLOUD-CREDENTIAL';
  const handler = createQAHandler({ readLibrary: async () => libraryIndex, env: key => key === 'N04_SMOKE_TOKEN' ? fixtureKey : undefined });
  let original;
  const query = createRetrievalQuery({
    library: { version: RELEASE.version, corpusSha256: RELEASE.sha256, sourceGitBlob: RELEASE.sourceGitBlob, sourceLanguage: 'es' },
    transport: async (request, { signal }) => {
      const response = await handler(new Request('https://local.invalid/internal/n04/library/search', { method: 'POST', signal,
        headers: { 'content-type': 'application/json', 'x-n04-smoke-token': fixtureKey }, body: JSON.stringify({ q: request.query }) }), { deploy: { id: 'd'.repeat(24) } });
      original = await response.clone().json(); return response;
    }
  });
  const first = setup(query, 'en'); const second = setup(query, 'es');
  await Promise.all([first.panel.run({ query: 'sobrecarga sensorial' }), second.panel.run({ query: 'sobrecarga sensorial' })]);
  for (const { panel, root } of [first, second]) {
    assert.equal(panel.getState().state, 'results');
    assert.deepEqual(byTag(root, 'a').map(a => a.getAttribute('href')), [...new Set(original.results.map(c => c.url))]);
    const rendered = new Map(byClass(root, 'sabik-retrieval-citation').map(n => [n.getAttribute('data-fragment-id'), n]));
    for (const candidate of original.results) {
      const node = rendered.get(candidate.fragment_id); assert.ok(node);
      assert.equal(node.getAttribute('lang'), 'es'); assert.equal(node.getAttribute('data-score'), String(candidate.score));
      assert.equal(byClass(node, 'sabik-retrieval-snippet')[0].textContent, candidate.snippet);
    }
  }
});
