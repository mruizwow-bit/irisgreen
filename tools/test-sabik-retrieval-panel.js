'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRetrievalPanel } = require('../sabik/retrieval-panel.js');

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
function envelope(candidates) { return { library_version: 'n04-es-20260916-56f72c4d3959', candidates }; }
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
  const results = [fixture({ fragment_id: 'frag-b', score: 90, title: 'Segundo' }), fixture({ fragment_id: 'frag-a', score: 12, title: 'Primero' })];
  const original = JSON.stringify(results);
  const { root, panel } = setup(async () => envelope(results));
  const outcome = await panel.run({ query: 'sensorial' });
  assert.deepEqual(outcome, { status: 'results', count: 2, library_version: envelope([]).library_version });
  const items = byTag(root, 'li');
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
  const items = byTag(root, 'li');
  assert.equal(items.length, 2);
  assert.deepEqual(items.map(item => item.getAttribute('data-fragment-id')), ['frag-1', 'frag-2']);
  assert.deepEqual(byTag(root, 'a').map(link => link.getAttribute('href')), [url, url]);
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
  assert.deepEqual(byTag(root, 'li').map(item => item.getAttribute('data-fragment-id')), ['new-fragment']);
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
  assert.match(root.textContent, /Fragment ID/);
  assert.equal(announcement.textContent, '1 result available.');
  assert.equal(byTag(root, 'a')[0].textContent, candidate.title);
});

test('source contains no transport, persistence, executable HTML, API/chat or visual-state implementation', () => {
  const code = fs.readFileSync(path.join(__dirname, '../sabik/retrieval-panel.js'), 'utf8');
  assert.doesNotMatch(code, /\bfetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|document\.cookie|innerHTML|outerHTML|insertAdjacentHTML|\/api\/chat|openai|anthropic|embedding|spinner/i);
  assert.doesNotMatch(code, /PRESENTE|ORIENTAR|TRANSICI[ÓO]N|PAUSA|CONFIRMAR/iu);
});
