/* Real browser observations shared by QA0's adapter and our storage regression.
   No expected values or fixture IDs are consulted. No storage is cleared. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function inspectStorage(page, context) {
  const stores = await page.evaluate(async () => {
    const read = storage => Object.fromEntries(Object.keys(storage).map(key => [key, storage.getItem(key)]));
    const indexedDBContents = {};
    for (const info of await indexedDB.databases()) {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(info.name);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      const entries = {};
      try {
        for (const name of db.objectStoreNames) {
          entries[name] = await new Promise((resolve, reject) => {
            const tx = db.transaction(name, 'readonly');
            const store = tx.objectStore(name);
            const keys = store.getAllKeys(), values = store.getAll();
            tx.oncomplete = () => resolve({ keys: keys.result, values: values.result });
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error || Error('Storage inspection aborted'));
          });
        }
      } finally { db.close(); }
      indexedDBContents[info.name] = entries;
    }
    return { localStorage: read(localStorage), sessionStorage: read(sessionStorage), indexedDB: indexedDBContents };
  });
  stores.cookies = await context.cookies();
  return stores;
}

function artifacts(stores, tokens) {
  return Object.fromEntries(Object.entries(stores).map(([name, value]) => {
    const serialized = JSON.stringify(value);
    return [name, tokens.filter(token => token && serialized.includes(token))];
  }));
}

async function runBrowserProbe({ root, seedTexts = [], topic = 'ruido', data = null, out } = {}) {
  root = path.resolve(root || path.join(__dirname, '../..'));
  const marker = 'S4_PRIVATE_' + crypto.randomUUID();
  const policy = fs.readFileSync(path.join(root, '_headers'), 'utf8').match(/Content-Security-Policy:\s*([^\r\n]+)/)[1];
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
  const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Content-Security-Policy', policy);
    fs.createReadStream(file).pipe(res);
  });
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ channel: process.env.S4_BROWSER_CHANNEL || 'chrome', headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    let failOptional = false, hold = null;
    await page.addInitScript(() => {
      let core;
      Object.defineProperty(window, 'NEACoreV1', {
        configurable: true, get: () => core,
        set(value) {
          for (const name of ['createSessionState', 'buildResponsePlan', 'applyResponseControl', 'registerPlanRejection']) {
            const original = value[name];
            value[name] = (...args) => {
              const result = original(...args);
              window.__s4ObservedSession = structuredClone(result.session || result);
              return result;
            };
          }
          core = value;
        }
      });
    });
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname.includes('fragments-index') && hold) {
        const pending = hold; pending.seen(); await pending.release;
      }
      if (url.pathname.includes('discriminating-questions') && failOptional) return route.fulfill({ status: 503, body: 'Unavailable' });
      if (data && url.pathname.includes('/NEA/')) {
        const names = { concepts: 'concepts.es', fragmentsIndex: 'iris-fragments-index.es', relations: 'relations.es',
          actions: 'actions.es', procedures: 'procedures.es', resources: 'human-resources.es',
          questions: 'discriminating-questions.es', corpora: 'language-corpora' };
        const key = Object.keys(names).find(key => url.pathname.endsWith('/' + names[key] + '.json'));
        if (key) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data[key]) });
      }
      return route.continue();
    });
    const idle = () => page.waitForFunction(() => document.querySelector('.sabik-panel')?.dataset.operation !== 'booting' &&
      !document.querySelector('#sabik-submit').disabled && document.querySelector('#sabik-output').getAttribute('aria-busy') === 'false');
    const session = () => page.evaluate(() => window.__s4ObservedSession);
    const submit = async text => {
      await page.locator('#sabik-input').fill(text);
      await page.locator('#sabik-submit').click(); await idle();
    };
    await page.goto(origin + '/es/nea/', { waitUntil: 'domcontentloaded' }); await idle();
    const initial = await session();
    assert.deepEqual(initial.user_statements, []);
    const before = await inspectStorage(page, context);
    for (const text of seedTexts) await submit(text);
    await submit(`Que es ${topic} ${marker}`);
    await submit('Y en el trabajo');
    const conversation = await session();
    const answer = await page.locator('#sabik-answer').innerText();
    assert(conversation.user_statements.some(text => text.includes(marker)));
    assert(conversation.active_concepts.length > 0);
    assert(conversation.last_plan.evidence.length > 0);
    const tokens = [...new Set([marker, ...seedTexts, ...conversation.user_statements, conversation.topic_query,
      ...conversation.active_concepts.map(id => `\"${id}\"`), answer,
      ...conversation.last_plan.evidence.map(item => item.relevant_text),
      'user_statements', 'active_concepts', 'topic_query', 'last_plan'])];
    const after = await inspectStorage(page, context);
    const found = artifacts(after, tokens);
    // Inspect first, then reload. Reload is not a storage-clear operation.
    await page.reload({ waitUntil: 'domcontentloaded' }); await idle();
    const reloaded = await session();
    const afterReload = await inspectStorage(page, context);
    const foundAfterReload = artifacts(afterReload, tokens);

    // Retry uses the actual optional loader failure and the page's retry button.
    failOptional = true;
    await submit(`Que es ${topic}`);
    assert(await page.locator('#sabik-retry-data').isVisible());
    failOptional = false;
    await page.locator('#sabik-retry-data').click(); await idle();
    const retrySession = await session();
    const duplicateCount = Math.max(0, await page.locator('#sabik-answer:visible').count() - 1);
    const recovered = !(await page.locator('#sabik-data-notice').isVisible()) && retrySession.last_plan.evidence.length > 0 &&
      retrySession.active_concepts.includes(topic);

    // An in-flight retrieval is released only after the explicit reset.
    await page.reload({ waitUntil: 'domcontentloaded' }); await idle();
    let release, seen;
    const started = new Promise(resolve => { seen = resolve; });
    hold = { seen, release: new Promise(resolve => { release = resolve; }) };
    await page.locator('#sabik-input').fill(`Que es ${topic} ${marker}_cancelled`);
    await page.locator('#sabik-submit').click(); await started;
    await page.locator('#sabik-reset-session').click();
    release(); hold = null;
    await page.waitForLoadState('networkidle'); await idle();
    const reset = await session();
    const stale = reset.last_plan !== null || reset.user_statements.length > 0 || await page.locator('#sabik-output').isVisible();

    // Positive control in a separate context proves every inspector sees leaks.
    const canaryContext = await browser.newContext();
    const canary = await canaryContext.newPage();
    await canary.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    await canary.goto(origin + '/es/nea/', { waitUntil: 'domcontentloaded' });
    await canary.evaluate(async marker => {
      localStorage.setItem('s4-canary', marker);
      sessionStorage.setItem('s4-canary', marker);
      document.cookie = `s4_canary=${marker}; Path=/; SameSite=Strict`;
      await new Promise((resolve, reject) => {
        const request = indexedDB.open('s4-canary', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('messages');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result, tx = db.transaction('messages', 'readwrite');
          tx.objectStore('messages').put(marker, 'conversation');
          tx.oncomplete = () => { db.close(); resolve(); };
          tx.onerror = () => reject(tx.error);
        };
      });
    }, marker);
    const canaries = artifacts(await inspectStorage(canary, canaryContext), [marker]);
    assert(Object.values(canaries).every(matches => matches.length === 1));
    await canaryContext.close();

    const result = {
      root, browser: browser.version(), topic, data: data ? 'synthetic QA transport' : 'site datasets',
      marker, tokens, before, after, afterReload, canaries,
      storage: Object.fromEntries(Object.entries(found).map(([name, matches]) => {
        const all = [...new Set([...matches, ...foundAfterReload[name]])];
        return [name, { conversation_artifacts_found: all.length, matches: all }];
      })),
      reload: { new_session: reloaded.last_plan === null && reloaded.user_statements.length === 0 && reloaded.active_concepts.length === 0,
        restored_conversation_turns: reloaded.user_statements.length, restored_active_concept: reloaded.active_concepts[0] || null },
      retry: { retry_safe: recovered && !stale && duplicateCount === 0, duplicate_response_count: duplicateCount, stale_result_reapplied: stale }
    };
    if (out) {
      fs.mkdirSync(out, { recursive: true });
      const key = crypto.createHash('sha256').update(JSON.stringify({ seedTexts, topic, synthetic: Boolean(data) })).digest('hex').slice(0, 12);
      fs.writeFileSync(path.join(out, `s4-storage-probe-${key}.json`), JSON.stringify(result, null, 2));
    }
    return result;
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
module.exports = { runBrowserProbe };
