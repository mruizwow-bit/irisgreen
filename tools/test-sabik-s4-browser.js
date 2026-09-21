/* NODE_PATH=<Playwright dependencies> node tools/test-sabik-s4-browser.js
   Optional S4_WEB_ROOT and S4_EVIDENCE_DIR (outside repo). No external requests. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const repo = path.resolve(__dirname, "..");
const root = path.resolve(process.env.S4_WEB_ROOT || repo);
const out = process.env.S4_EVIDENCE_DIR && path.resolve(process.env.S4_EVIDENCE_DIR);
if (out && (out === repo || out.startsWith(repo + path.sep))) throw Error("Keep evidence outside repository");
if (out) fs.mkdirSync(out, { recursive: true });
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".webp": "image/webp", ".svg": "image/svg+xml" };
const policy = fs.readFileSync(path.join(root, "_headers"), "utf8").match(/Content-Security-Policy:\s*([^\r\n]+)/)[1];
const server = http.createServer((req, res) => {
  let file = path.resolve(root, "." + new URL(req.url, "http://localhost").pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
  res.setHeader("Content-Security-Policy", policy); fs.createReadStream(file).pipe(res);
});
let browser, context, page, origin, failures = new Set(), requests = [];
let hold = null;
const results = [];
const el = name => page.locator("#sabik-" + name);
const idle = () => page.waitForFunction(() => !document.querySelector('#sabik-submit').disabled && document.querySelector('#sabik-output').getAttribute('aria-busy') === 'false');
const session = () => page.evaluate(() => window.__s4Session);
async function fresh(viewport = { width: 1280, height: 900 }) {
  if (context) await context.close();
  context = await browser.newContext({ viewport });
  page = await context.newPage();
  await page.addInitScript(() => {
    let api;
    window.__s4Calls = [];
    Object.defineProperty(window, 'NEACoreV1', {
      configurable: true, get: () => api,
      set(value) {
        for (const key of ['createSessionState', 'setSessionPreferences', 'registerPlanRejection', 'buildResponsePlan', 'applyResponseControl']) {
          const original = value[key];
          value[key] = (...args) => {
            const result = original(...args);
            window.__s4Session = result.session || result;
            window.__s4Calls.push(key);
            return result;
          };
        }
        api = value;
      }
    });
  });
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    if (url.pathname.includes('/NEA/')) {
      requests.push(url.pathname);
      if (hold && url.pathname.includes('fragments-index')) { const pending = hold; pending.seen(); await pending.release; }
      if ([...failures].some(part => url.pathname.includes(part))) return route.fulfill({ status: 503, body: 'unavailable' });
    }
    return route.continue();
  });
  await page.goto(origin + '/es/nea/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('.sabik-panel').dataset.operation === 'ready');
  await idle();
}
async function submit(text) { await el('input').fill(text); await el('submit').click(); await idle(); }
async function click(name) { await el(name).click(); await idle(); }
async function check(name, run) { await run(); results.push({ name, pass: true }); console.log('PASS ' + name); }
async function run() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  await fresh();
  await check('real data: context survives pronoun', async () => {
    await submit('Que es el ruido'); const first = await session();
    await submit('Y eso como se prepara'); const next = await session();
    assert.equal(next.context_mode, 'followup');
    assert(next.active_concepts.some(id => first.active_concepts.includes(id)));
  });
  await check('shorter preserves evidence, options and intensity', async () => {
    const before = await session(); await click('shorter'); const after = await session();
    assert.deepEqual(after.last_plan.source_urls, before.last_plan.source_urls);
    assert.equal(after.session_preferences.max_options, before.session_preferences.max_options);
    assert.equal(after.sabik_state.low_intensity, before.sabik_state.low_intensity);
    assert.equal(after.user_statements.length, before.user_statements.length);
  });
  await check('rephrase does not reject current concept or source', async () => {
    const before = await session(); await click('rephrase'); const after = await session();
    assert.deepEqual(after.last_plan.source_urls, before.last_plan.source_urls);
    assert.deepEqual(after.rejected_concepts, before.rejected_concepts);
    assert(after.last_plan.limits_notice);
  });
  await check('one option and no questions are separate preferences', async () => {
    await click('one-option'); assert.equal((await session()).session_preferences.max_options, 1);
    await click('no-questions'); assert.equal((await session()).session_preferences.question_policy, 'none');
    assert((await session()).last_plan.source_urls.length <= 1);
  });
  await check('other route does not veto concept', async () => {
    const before = await session(); await click('other-way'); const after = await session();
    assert.deepEqual(after.rejected_concepts, before.rejected_concepts);
    assert(!after.last_plan.fragments_used.some(id => before.last_plan.fragments_used.includes(id)));
  });
  await check('reload starts a new conversation', async () => {
    await page.reload(); await idle(); const next = await session();
    assert.deepEqual(next.user_statements, []); assert.equal(next.last_plan, null);
    assert.equal(await el('output').isVisible(), false);
  });
  for (const width of [1280, 768, 320]) await check(`panel/control reflow ${width}`, async () => {
    await page.setViewportSize({ width, height: 900 });
    await submit('Que es el ruido');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.equal(await page.locator('#sabik-hologram img').evaluateAll(nodes => nodes.every(n => n.complete && n.naturalWidth > 0)), true);
    for (const id of ['shorter', 'no-questions', 'one-option', 'rephrase']) assert.equal(await el(id).isVisible(), true);
    if (out) await page.screenshot({ path: path.join(out, `s4-${width}.png`), fullPage: true });
    await click('toggle'); assert.equal(await el('widget-body').isVisible(), false);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await click('toggle');
  });
  await check('new labels translate using existing language selector', async () => {
    await page.locator('[data-lang="en"]').click();
    assert.equal(await el('rephrase').textContent(), 'Explain it another way');
    assert.equal(await el('no-questions').textContent(), 'Do not ask me questions');
    assert.equal(await el('one-option').textContent(), 'Give me one option');
  });
  await check('optional failure leaves basic response usable and retries only optional', async () => {
    failures = new Set(['procedures.es']); await fresh(); requests = [];
    await submit('Que es el ruido');
    assert((await session()).last_plan.source_urls.length);
    assert.equal(await el('data-notice').isVisible(), true);
    failures.clear(); requests = []; await click('retry-data');
    assert(requests.length === 1 && requests[0].includes('procedures.es'));
    assert.equal(await el('data-notice').isVisible(), false);
  });
  await check('required failure retries the failed input without old conversation', async () => {
    failures = new Set(['fragments-index']); await fresh(); await submit('Que es el ruido');
    assert.equal(await page.locator('.sabik-panel').getAttribute('data-operation'), 'error');
    assert.deepEqual((await session()).user_statements, []);
    failures.clear(); await click('retry-data');
    assert.equal((await session()).user_statements.at(-1), 'Que es el ruido');
  });
  await check('reset invalidates pending optional error UI and session', async () => {
    await fresh(); failures = new Set(['questions.es']);
    let release, seen;
    const started = new Promise(resolve => { seen = resolve; });
    hold = { seen, release: new Promise(resolve => { release = resolve; }) };
    await el('input').fill('Consulta que se cancela'); await el('submit').click(); await started;
    await el('reset-session').click(); release(); hold = null;
    await page.waitForLoadState('networkidle'); await idle();
    assert.equal((await session()).last_plan, null);
    assert.equal(await el('data-notice').isVisible(), false);
    assert.equal(await el('output').isVisible(), false);
    failures.clear();
  });
  if (out) fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ browser: browser.version(), results, manualScreenReader: 'not run' }, null, 2));
  console.log(`${results.length}/${results.length} S4 browser checks passed`);
}
run().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close(); server.close();
});
