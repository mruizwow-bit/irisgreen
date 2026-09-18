/* S1 browser checks. Install/provide Playwright and Chrome; no product dependency.
   Run: NODE_PATH=<test dependencies> node tools/test-sabik-s1.js
   Real assistive-technology/manual gates are reported separately, never inferred. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const sourceRoot = path.resolve(__dirname, "..");
const root = path.resolve(process.env.S1_WEB_ROOT || sourceRoot);
const evidence = process.env.S1_EVIDENCE_DIR && path.resolve(process.env.S1_EVIDENCE_DIR);
if (evidence) {
  if (evidence === sourceRoot || evidence.startsWith(sourceRoot + path.sep)) throw new Error("Evidence must be outside the repository");
  fs.mkdirSync(evidence, { recursive: true });
}
const policy = fs.readFileSync(path.join(root, "_headers"), "utf8").match(/Content-Security-Policy:\s*([^\r\n]+)/)[1];
const results = [], manualGates = new Set(["A02", "A06", "A09", "A13", "A14", "A16", "A17", "A18", "A19", "A20", "A21", "A22", "A23", "A24", "A25", "A26", "A28", "A29", "A30", "A31", "A32", "A33", "A34"]);
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp" };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
  res.setHeader("Content-Security-Policy", policy);
  fs.createReadStream(file).pipe(res);
});
let browser, page, origin;
const el = id => page.locator("#sabik-" + id);
const op = value => page.waitForFunction(v => document.querySelector(".sabik-panel").dataset.operation === v, value);
const enabled = id => page.waitForFunction(id => !document.querySelector("#sabik-" + id).disabled, id);
async function fresh(options = {}) {
  if (page) await page.context().close();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...options });
  await context.addInitScript(() => {
    const OriginalWorker = window.Worker;
    window.__s1States = []; window.__s1Announcements = []; window.__s1Errors = [];
    window.__s1Events = []; window.__s1CoreCalls = []; window.__s1Sessions = [];
    // Test-only observation: preserve return values/references and call the real Core.
    let observedCore;
    Object.defineProperty(window, 'NEACoreV1', {
      configurable: true,
      get: () => observedCore,
      set(api) {
        for (const name of ['createSessionState', 'setSessionPreferences', 'registerPlanRejection', 'buildResponsePlan']) {
          const original = api[name];
          api[name] = function (...args) {
            window.__s1CoreCalls.push(name);
            const result = original.apply(this, args);
            const session = name === 'buildResponsePlan' ? result.session : result;
            window.__s1Session = session;
            if (!window.__s1Sessions.includes(session)) window.__s1Sessions.push(session);
            return result;
          };
        }
        observedCore = api;
      }
    });
    window.Worker = class extends OriginalWorker {
      constructor(...args) { super(...args); this.addEventListener("message", e => { if(e.data.state) window.__s1States.push(e.data.state); }); }
      postMessage(data, ...args) { window.__s1Events.push(data.event); return super.postMessage(data, ...args); }
    };
    document.addEventListener("DOMContentLoaded", () => {
      window.__s1ResultFocus = [];
      window.__s1ResultFocusCalls = [];
      const target = document.querySelector('#sabik-response-message');
      const nativeFocus = target.focus;
      target.focus = function (...args) {
        window.__s1ResultFocusCalls.push({ busy: document.querySelector('#sabik-output').getAttribute('aria-busy'), operation: document.querySelector('.sabik-panel').dataset.operation });
        return nativeFocus.apply(this, args);
      };
      target.addEventListener('focus', () => window.__s1ResultFocus.push({
        text: target.textContent.replace(/\s+/gu, ' ').trim(),
        busy: document.querySelector('#sabik-output').getAttribute('aria-busy'),
        operation: document.querySelector('.sabik-panel').dataset.operation,
        visible: !!target.getClientRects().length && !target.closest('[hidden], [inert]')
      }));
      const region = document.querySelector("#sabik-announcement");
      window.__s1AnnouncementRegion = region;
      window.__s1AnnouncementRecords = [];
      new MutationObserver(records => {
        for (const record of records) {
          if (record.target === region) for (const node of record.addedNodes) window.__s1Announcements.push(node.textContent);
        }
        // Count mutation records, not only observer callbacks: multiple writes
        // in the same microtask must not look like one complete announcement.
        for (const record of records) window.__s1AnnouncementRecords.push({
          type: record.type,
          targetIsLog: record.target === region,
          addedCount: record.addedNodes.length,
          removedCount: record.removedNodes.length,
          addedText: [...record.addedNodes].map(n => n.textContent).join(''),
          removedText: [...record.removedNodes].map(n => n.textContent).join(''),
          text: [...record.addedNodes].map(n => n.textContent).join(''),
          busy: document.querySelector('#sabik-output').getAttribute('aria-busy'),
          active: document.activeElement.id
        });
      }).observe(region, { childList: true, subtree: true, characterData: true });
    });
  });
  page = await context.newPage();
  page.on("pageerror", error => console.error("BROWSER_ERROR", error.message));
  await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await page.goto(origin + "/es/nea/", { waitUntil: "domcontentloaded" });
  await op("ready"); await enabled("submit");
}
async function submit(value = "Qué es la sobrecarga sensorial") {
  await el("input").fill(value); await el("submit").click();
  await op("presenting"); await enabled("submit");
  await page.waitForFunction(() => !document.querySelector("#sabik-output").hidden);
}
async function reset() { await el("reset-session").click(); await op("ready"); await enabled("submit"); }
async function pause() { await el("clear").click(); await op("paused"); await enabled("resume"); }
async function resume() { await el("resume").click(); await op("ready"); await enabled("clear"); }
async function toggle() {
  const before = await el("toggle").getAttribute("aria-expanded");
  await el("toggle").click();
  await page.waitForFunction(v => document.querySelector("#sabik-toggle").getAttribute("aria-expanded") !== v, before);
  await enabled("toggle");
}
const active = () => page.evaluate(() => document.activeElement.id);
const state = () => page.evaluate(() => window.__s1States.at(-1));
async function test(id, name, fn) {
  try { await fn(); results.push({ id, name, automated: "AUTOMATIZADO_PASS", manual: manualGates.has(id) ? "PENDIENTE_ENTORNO" : "NO_REQUERIDO" }); }
  catch (e) { results.push({ id, name, automated: "FAIL", detail: e.message, manual: manualGates.has(id) ? "PENDIENTE_ENTORNO" : "NO_REQUERIDO" }); }
  console.log(JSON.stringify(results.at(-1)));
  if (evidence && ["A02", "A30", "A31", "A32"].includes(id)) {
    await page.locator(".sabik-panel").screenshot({path:path.join(evidence, id+"-panel.png")});
  }
}
async function holdData() {
  let release, observed;
  const seen = new Promise(resolve => observed = resolve);
  const gate = new Promise(resolve => release = resolve);
  await page.route("**/sabik/assets/NEA/data/concepts.es.json", async route => { observed(); await gate; await route.continue(); });
  return { release, seen };
}
async function noHorizontalOverflow() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "page overflows horizontally");
  assert.ok(await page.evaluate(() => [...document.querySelectorAll('.sabik-panel button:not([hidden]), .sabik-panel textarea')]
    .filter(n => n.getClientRects().length).every(n => n.scrollWidth <= n.clientWidth + 2)), "controls clip text");
}
async function main() {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ channel: process.env.S1_BROWSER_CHANNEL || "chrome", headless: true });
  await test("A01", "boot to ready", async () => { await fresh(); assert.equal((await state()).operation, "ready"); assert.equal(await el("submit").isEnabled(), true); });
  await test("A02", "one submission focuses the complete visible response without a live announcement", async () => {
    await submit(); const answer = await el("answer").textContent(); assert.ok(answer.length > 20);
    assert.equal(await active(), 'sabik-response-message');
    assert.equal(await page.evaluate(() => window.__s1ResultFocusCalls.length), 1);
    assert.deepEqual(await page.evaluate(() => window.__s1Announcements), []);
  });
  await test("A03", "double submit creates one retrieval", async () => {
    await reset(); const before = await page.evaluate(() => window.__s1States.filter(s => s.operation === "retrieving").length);
    await el("input").fill("Qué es el autismo");
    await page.evaluate(() => { const f = document.querySelector('#sabik-form'); f.requestSubmit(); f.requestSubmit(); });
    await op("presenting"); await enabled("submit");
    assert.equal(await page.evaluate(() => window.__s1States.filter(s => s.operation === "retrieving").length), before + 1);
  });
  await test("A04", "stable pause", async () => { const answer = await el("answer").textContent(); await pause(); assert.equal(await el("answer").textContent(), answer); });
  await test("A05", "pause processing cancels late success", async () => {
    await fresh(); const held = await holdData(); await el("input").fill("Consulta en proceso"); await el("submit").click(); await held.seen;
    await pause(); held.release(); await page.waitForLoadState("networkidle"); assert.equal((await state()).operation, "paused"); assert.equal(await el("output").isHidden(), true);
  });
  await test("A06", "pause hide show keeps pause", async () => { await toggle(); await toggle(); assert.equal((await state()).operation, "paused"); });
  await test("A07", "resume preserves input", async () => { const value = await el("input").inputValue(); await resume(); assert.equal(await el("input").inputValue(), value); });
  await test("A08", "no reset through visibility or pause", async () => { await submit(); const a = await el("answer").textContent(); await pause(); await toggle(); await toggle(); await resume(); assert.equal(await el("answer").textContent(), a); });
  await test("A09", "explicit reset clears conversation", async () => { await reset(); assert.equal(await el("input").inputValue(), ""); assert.equal(await el("output").isHidden(), true); });
  await test("A10", "hide changes visibility only", async () => { await submit(); const before = await state(); await toggle(); const after = await state(); delete before.revision; delete after.revision; before.visibility = 'collapsed'; assert.deepEqual(after, before); });
  await test("A11", "show never resumes", async () => { await toggle(); await pause(); await toggle(); await toggle(); assert.equal((await state()).operation, "paused"); });
  await test("A12", "typed entry survives pause and resume", async () => { await el("input").fill("Borrador sin enviar"); await resume(); await pause(); await resume(); assert.equal(await el("input").inputValue(), "Borrador sin enviar"); });
  await test("A13", "answer retained without repeat announcement", async () => { const a = await el("answer").textContent(); const count = await page.evaluate(a => window.__s1Announcements.filter(s => s.startsWith(a)).length, a); await pause(); await resume(); assert.equal(await el("answer").textContent(), a); assert.equal(await page.evaluate(a => window.__s1Announcements.filter(s => s.startsWith(a)).length, a), count); });
  await test("A14", "incompatible controls disabled", async () => { await pause(); for(const id of ['submit','shorter','not-this','other-way','low']) assert.equal(await el(id).isDisabled(), true); await resume(); });
  await test("A15", "maximum input accepted", async () => { await reset(); await submit("x".repeat(2000)); assert.equal(await el("input").getAttribute("aria-invalid"), "false"); });
  await test("A16", "over limit preserves input and announces", async () => { await reset(); await el("input").fill("x".repeat(2001)); const before = await state(); await el("submit").click(); assert.equal((await state()).revision, before.revision); assert.equal(await el("input").inputValue(), "x".repeat(2001)); assert.equal(await el("input").getAttribute("aria-invalid"), "true"); assert.equal(await el("input-error").isVisible(), true); assert.equal(await active(), "sabik-input"); });
  await test("A17", "input retains focus while submit retrieves", async () => {
    await fresh(); const held = await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    try { assert.equal(await active(), 'sabik-input'); } finally { held.release(); }
    await op('presenting'); await enabled('submit');
  });
  await test("A18", "explicit submission focuses its final visible result", async () => { await submit(); assert.equal(await active(), "sabik-response-message"); });
  await test("A19", "hide/show focus stays on visible invoker", async () => { await toggle(); assert.equal(await active(), "sabik-toggle"); await toggle(); assert.equal(await active(), "sabik-toggle"); });
  await test("A20", "control focus destinations", async () => { await pause(); assert.equal(await active(), "sabik-resume"); await resume(); assert.equal(await active(), "sabik-clear"); await reset(); assert.equal(await active(), "sabik-input"); });
  await test("A21", "Tab moves forward", async () => { await el("input").focus(); await page.keyboard.press("Tab"); assert.equal(await active(), "sabik-submit"); });
  await test("A22", "Shift Tab moves backward", async () => { await page.keyboard.press("Shift+Tab"); assert.equal(await active(), "sabik-input"); });
  await test("A23", "Enter is newline; Ctrl Enter submits", async () => { await el("input").fill("Qué es el autismo"); await page.keyboard.press("Enter"); assert.ok((await el("input").inputValue()).includes("\n")); await page.keyboard.press("Control+Enter"); await op("presenting"); await enabled("submit"); });
  await test("A24", "Enter activates button", async () => { await el("clear").focus(); await page.keyboard.press("Enter"); await op("paused"); await enabled("resume"); });
  await test("A25", "Space activates button", async () => { await el("resume").focus(); await page.keyboard.press("Space"); await op("ready"); await enabled("clear"); });
  await test("A26", "Escape collapses without reset", async () => { await el("input").focus(); await page.keyboard.press("Escape"); await page.waitForFunction(() => document.querySelector('#sabik-widget-body').hidden); await enabled('toggle'); assert.equal(await active(), "sabik-toggle"); await toggle(); });
  await test("A27", "expanded matches body", async () => { await toggle(); assert.equal(await el("toggle").getAttribute("aria-expanded"), "false"); assert.equal(await el("widget-body").isHidden(), true); await toggle(); });
  await test("A28", "separate action buttons need no pressed state", async () => { assert.equal(await el("clear").getAttribute("aria-pressed"), null); assert.equal(await el("clear").textContent(), "Pausar Sabik"); await pause(); assert.equal(await el("resume").textContent(), "Reanudar"); await resume(); });
  await test("A29", "accessible control names", async () => { for(const name of ['Pausar Sabik','Empezar de nuevo','Enviar']) assert.equal(await page.getByRole('button',{name,exact:true}).count(),1); assert.equal(await page.getByRole('textbox',{name:'¿Qué necesitas?'}).count(),1); });
  await test("A30", "320 CSS pixels and source order", async () => { await page.setViewportSize({width:320,height:900}); await noHorizontalOverflow(); assert.equal(await page.evaluate(() => { const search=document.querySelector('.search-block'), panel=document.querySelector('.sabik-panel'), content=document.querySelector('#results'); return Boolean(search.compareDocumentPosition(panel)&4)&&Boolean(panel.compareDocumentPosition(content)&4); }),true); });
  await test("A31", "200 percent text simulation", async () => {
    await page.setViewportSize({width:1280,height:900});
    await page.evaluate(() => { const nodes=[...document.querySelectorAll('body *')].filter(n=>!(n instanceof SVGElement)); const sizes=nodes.map(n=>getComputedStyle(n).fontSize); nodes.forEach((n,i)=>n.style.fontSize=(parseFloat(sizes[i])*2)+'px'); });
    await noHorizontalOverflow();
  });
  await test("A32", "400 percent zoom equivalent reflow", async () => { await fresh({viewport:{width:320,height:225}}); await noHorizontalOverflow(); assert.equal(await el('input').isVisible(),true); });
  await test("A33", "reduced motion unchanged", async () => { await page.emulateMedia({reducedMotion:'reduce'}); assert.equal(await page.evaluate(() => [...document.querySelectorAll('.sabik-hologram *')].every(n => getComputedStyle(n).animationName==='none')),true); });
  await test("A34", "conventional navigation independent", async () => { assert.ok(await page.locator('.site-header a[href]').count()); assert.ok(await page.locator('[data-section="situaciones"]').count()); assert.equal(await page.locator('#search-form').count(),1); });
  await test("A35", "noindex intact", async () => { assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex,follow'); });
  await test("A36", "stale request cannot replace a newer answer", async () => {
    await fresh(); const held = await holdData(); await el('input').fill('Consulta obsoleta'); await el('submit').click(); await held.seen;
    await pause(); await resume(); await el('input').fill('Qué es el autismo'); await el('submit').click(); held.release();
    await op('presenting'); await enabled('submit'); assert.equal(await el('input').inputValue(),'Qué es el autismo');
    assert.equal(await page.evaluate(()=>window.__s1States.filter(s=>s.operation==='presenting').length),1);
  });
  await test("A37", "reset ignores late load result", async () => {
    await fresh(); const held = await holdData(); await el('input').fill('Consulta pendiente'); await el('submit').click(); await held.seen;
    await reset(); held.release(); await page.waitForLoadState('networkidle'); assert.equal(await el('output').isHidden(),true); assert.equal(await el('answer').textContent(),''); assert.equal((await state()).operation,'ready');
  });
  const summary = {automatedPass:results.filter(r=>r.automated==='AUTOMATIZADO_PASS').length,total:37,manualPending:results.filter(r=>r.manual==='PENDIENTE_ENTORNO').map(r=>r.id),status:results.some(r=>r.automated==='FAIL')?'FAIL':'AUTOMATIZADO_PASS_CON_VALIDACION_MANUAL_PENDIENTE'};
  console.log(JSON.stringify(summary));
  // Separate controls, not additional rows of the 37-case acceptance matrix.
  const extra = [];
  await fresh();
  const originalModule = await page.evaluate(() => typeof window.module);
  extra.push({id:'X01',check:'CommonJS does not pollute window',pass:originalModule==='undefined'});
  let releaseFailure, failureSeen;
  const seen = new Promise(resolve => failureSeen = resolve), gate = new Promise(resolve => releaseFailure = resolve);
  await page.route('**/sabik/assets/NEA/data/concepts.es.json', async route => { failureSeen(); await gate; await route.abort('failed'); });
  await el('input').fill('Consulta con error tardío'); await el('submit').click(); await seen;
  await reset(); releaseFailure(); await page.waitForLoadState('networkidle');
  extra.push({id:'X02',check:'Reset ignores late load errors',pass:await el('output').isHidden() && (await state()).operation==='ready'});
  async function contract(id, check, fn) {
    try { await fn(); extra.push({id,check,pass:true}); }
    catch(error) { extra.push({id,check,pass:false,detail:error.message}); }
  }
  // Snapshot the full actual session, not only visual data-* attributes. This
  // catches cognitive/profile/risk mutations even if no response is rendered.
  const behavior = () => page.evaluate(() => ({
    machine: window.__s1States.at(-1), session: window.__s1Session,
    calls: window.__s1CoreCalls.slice(), events: window.__s1Events.slice(),
    sessionIndex: window.__s1Sessions.indexOf(window.__s1Session),
    answer: document.querySelector('#sabik-answer').textContent,
    sources: document.querySelector('#sabik-sources').innerHTML,
    cognitive: document.querySelector('#sabik-hologram').dataset.cognitiveState,
    protection: document.querySelector('#sabik-hologram').dataset.protectionState,
    intensity: document.querySelector('#sabik-hologram').dataset.lowIntensity
  }));
  await contract('X03', 'V7-019: S0 controls preserve the same session and processing/pause presentation', async () => {
    await fresh();
    const held = await holdData();
    await el('input').fill('Qué es la sobrecarga sensorial'); await el('submit').click(); await held.seen;
    assert.equal((await state()).operation, 'retrieving');
    assert.equal(await el('hologram').getAttribute('data-interaction-state'), 'procesando');
    held.release(); await op('presenting'); await enabled('submit');
    await el('low').click(); // Non-default preference must survive pause/resume too.
    const before = await behavior(), input = await el('input').inputValue();
    await pause();
    assert.equal(await el('hologram').getAttribute('data-interaction-state'), 'pausa');
    assert.equal(await el('clear').isHidden(), true); assert.equal(await el('resume').isEnabled(), true);
    assert.equal(await el('submit').isDisabled(), true); assert.equal(await el('reset-session').isEnabled(), true);
    await resume();
    assert.equal(await el('clear').isEnabled(), true); assert.equal(await el('resume').isHidden(), true);
    const after = await behavior();
    for (const key of ['session','calls','sessionIndex','answer','sources','cognitive','protection','intensity']) assert.deepEqual(after[key],before[key],key);
    assert.equal(await el('input').inputValue(),input);
    assert.deepEqual(after.events.slice(before.events.length),[{type:'PAUSE_ASSISTANT'},{type:'RESUME_ASSISTANT'}]);
    assert.equal(after.machine.operation,'ready');
    assert.equal(after.machine.revision,before.machine.revision+2);
  });
  await contract('X04', 'V7-022: typing and validation cannot infer cognition, diagnosis, risk or profile', async () => {
    await fresh();
    const before = await behavior();
    // Synthetic strings intentionally include risk/diagnostic terms but are NOT submitted.
    await el('input').fill('Estoy en peligro. Dislexia, autismo, sobrecarga.');
    await page.keyboard.press('End'); await page.keyboard.press('Enter');
    await page.keyboard.press('Shift+Enter'); await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('a');
    assert.deepEqual(await behavior(),before);
    await el('input').fill('x'.repeat(2001)); await el('submit').click();
    assert.equal(await el('input').getAttribute('aria-invalid'),'true');
    assert.deepEqual(await behavior(),before);
    await el('input').fill('Texto corregido');
    assert.equal(await el('input').getAttribute('aria-invalid'),'false');
    assert.deepEqual(await behavior(),before);
  });
  await contract('X05', 'V7-022: passive signals have no Core, S0 or presentation effect', async () => {
    const before = await behavior();
    await page.evaluate(() => {
      for (const type of ['scroll','mousemove','pointermove','touchmove','visibilitychange','deviceorientation']) {
        for (const target of [window,document,document.querySelector('#sabik-input')]) target.dispatchEvent(new Event(type,{bubbles:true}));
      }
    });
    await page.mouse.move(20,20); await page.mouse.move(200,100); await page.mouse.wheel(0,120);
    assert.deepEqual(await behavior(),before);
  });
  await contract('X06', 'V7-022: Escape changes only visibility; Ctrl Enter submits explicitly', async () => {
    const before = await behavior();
    await el('input').focus(); await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.querySelector('#sabik-widget-body').hidden); await enabled('toggle');
    const collapsed = await behavior();
    assert.deepEqual(collapsed.machine,{...before.machine,visibility:'collapsed',revision:before.machine.revision+1});
    for (const key of ['session','calls','sessionIndex','answer','sources','cognitive','protection','intensity']) assert.deepEqual(collapsed[key],before[key],key);
    assert.deepEqual(collapsed.events.slice(before.events.length),[{type:'COLLAPSE'}]);
    await toggle();
    const ready = await behavior();
    await el('input').fill('Qué es el autismo'); await page.keyboard.press('Control+Enter');
    await op('presenting'); await enabled('submit');
    const submitted = await behavior();
    assert.equal(submitted.events.slice(ready.events.length).filter(e=>e.type==='SUBMIT').length,1);
    assert.deepEqual(submitted.calls.slice(ready.calls.length),['buildResponsePlan']);
  });
  const resultFocus = () => page.evaluate(() => window.__s1ResultFocus);
  const focusCalls = () => page.evaluate(() => window.__s1ResultFocusCalls);
  const announcements = () => page.evaluate(() => window.__s1Announcements);
  const finalMessage = () => page.evaluate(() => [document.querySelector('#sabik-answer').textContent, document.querySelector('#sabik-notice').textContent].filter(Boolean).join(' ').replace(/\s+/gu, ' ').trim());
  await contract('N01', 'visible final response is programmatically focusable with Spanish semantics', async () => {
    await fresh(); await submit('Qué es el autismo');
    assert.equal(await el('response-message').getAttribute('tabindex'), '-1');
    assert.equal(await el('response-message').getAttribute('role'), 'group');
    assert.equal(await el('response-message').isVisible(), true);
    assert.equal(await el('response-message').evaluate(n => n.closest('[lang]').lang), 'es');
  });
  await contract('N02', 'one final response makes exactly one result focus call and event', async () => {
    assert.equal((await focusCalls()).length, 1);
    assert.equal((await resultFocus()).length, 1);
  });
  await contract('N03', 'active element is the visible final message', async () => {
    assert.equal(await active(), 'sabik-response-message');
    assert.equal((await resultFocus())[0].visible, true);
  });
  await contract('N04', 'focused content and AX description contain the complete final response', async () => {
    const expected = await finalMessage(); assert.ok(expected.length > 20);
    assert.equal((await resultFocus())[0].text, expected);
    const cdp = await page.context().newCDPSession(page);
    try {
      const ax = await cdp.send('Accessibility.getFullAXTree');
      const focused = ax.nodes.find(n => n.role?.value === 'group' && n.properties?.some(p => p.name === 'focused' && p.value.value));
      assert.ok(focused, 'visible response group has AX focus');
      assert.equal(focused.description.value, expected);
      const descendants = [];
      const walk = id => { const n = ax.nodes.find(n => n.nodeId === id); if (!n) return; descendants.push(n); (n.childIds || []).forEach(walk); };
      walk(focused.nodeId);
      assert.ok(descendants.some(n => n.role?.value === 'StaticText' && n.name?.value === expected));
      if (evidence) fs.writeFileSync(path.join(evidence, 'narrator-focus-autismo-ax.json'), JSON.stringify({ query:'Qué es el autismo', expected, active:await active(), focus:await resultFocus(), calls:await focusCalls(), announcements:await announcements(), ax },null,2));
    } finally { await cdp.detach(); }
  });
  await contract('N05', 'normal response never publishes in the hidden control log', async () => {
    assert.deepEqual(await announcements(), []);
    assert.equal(await el('announcement').textContent(), '');
    assert.equal(await page.locator('#sabik-announcement-log').count(), 0);
  });
  await contract('N06', 'loading retrieval and composing cannot focus the result', async () => {
    await fresh(); const held = await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    try {
      assert.equal(await active(), 'sabik-input');
      assert.equal(await el('output').getAttribute('aria-busy'), 'true');
      assert.deepEqual(await focusCalls(), []);
    } finally { held.release(); }
    await op('presenting'); await enabled('submit');
    assert.deepEqual(await focusCalls(), [{busy:'false',operation:'presenting'}]);
  });
  await contract('N07', 'busy completion leaves focused text intact without a second focus', async () => {
    const before = await resultFocus(), message = await finalMessage();
    await page.waitForLoadState('networkidle');
    assert.deepEqual(await resultFocus(), before);
    assert.equal((await focusCalls()).length, 1);
    assert.equal(await finalMessage(), message);
    assert.equal(before[0].text, message);
    assert.equal(await active(), 'sabik-response-message');
  });
  await contract('N08', 'two explicit submissions each focus the complete result once', async () => {
    await fresh(); await submit('Qué es el autismo'); await submit('Qué es el autismo');
    assert.equal((await focusCalls()).length, 2); assert.equal((await resultFocus()).length, 2);
    assert.ok((await resultFocus()).every(f => f.busy === 'false' && f.visible));
    assert.deepEqual(await announcements(), []);
  });
  await contract('N09', 'technical failure focuses one visible error without a live announcement', async () => {
    await fresh(); await page.route('**/sabik/assets/NEA/data/concepts.es.json', r => r.abort('failed'));
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await op('error'); await enabled('submit');
    assert.equal(await active(), 'sabik-response-message');
    assert.equal(await el('output').isVisible(), true);
    assert.deepEqual(await focusCalls(), [{busy:'false',operation:'error'}]);
    assert.equal((await resultFocus())[0].text, 'No he podido cargar los datos locales. Puedes volver a enviar tu consulta.');
    assert.deepEqual(await announcements(), []);
    assert.equal(await el('sources').textContent(), '');
  });
  await contract('N10', 'pause resume reset never refocus or republish the previous answer', async () => {
    await fresh(); await submit(); const before = await resultFocus();
    await pause(); await resume(); await reset();
    assert.deepEqual(await resultFocus(), before); assert.equal((await focusCalls()).length, 1);
    assert.deepEqual(await announcements(), ['Sabik está en pausa.','Sabik vuelve a estar disponible.','Conversación reiniciada.']);
    assert.equal(await active(), 'sabik-input');
  });
  await contract('N11', 'visible return action focuses input without changing response or session', async () => {
    await fresh(); await submit(); const before = await behavior(), value = await el('input').inputValue();
    assert.equal(await page.getByRole('button',{name:'Escribir otra consulta',exact:true}).count(),1);
    await el('write-again').click();
    assert.equal(await active(), 'sabik-input'); assert.deepEqual(await behavior(), before);
    assert.equal(await el('input').inputValue(), value); assert.deepEqual(await announcements(), []);
  });
  await contract('N12', 'fallback has no Web Speech API or scripted voice', async () => {
    assert.doesNotMatch(fs.readFileSync(path.join(root,'sabik/sabik-page.js'),'utf8'), /speechSynthesis|SpeechSynthesisUtterance/u);
  });
  await contract('N13', 'focus target has no application role or duplicated aria label', async () => {
    assert.equal(await page.locator('.sabik-panel [role="application"]').count(),0);
    assert.equal(await el('response-message').getAttribute('aria-label'),null);
    assert.equal(await el('response-message').getAttribute('aria-hidden'),null);
  });
  await contract('N14', 'no response text in any live region and visible status stays non-live', async () => {
    const expected = await finalMessage();
    assert.equal(await page.evaluate(text => [...document.querySelectorAll('[aria-live], [role="status"], [role="log"], [role="alert"]')].some(n => n.textContent.includes(text)),expected),false);
    assert.equal(await el('response-message').evaluate(n => !!n.closest('[aria-live], [role="status"], [role="log"], [role="alert"]')),false);
    assert.equal(await el('status-text').getAttribute('aria-live'), null);
    assert.equal(await el('status-text').getAttribute('role'), null);
  });
  await contract('N15', 'Ctrl Enter focuses result and Tab Enter returns to typing without trap', async () => {
    await el('input').fill('Qué es el autismo'); await page.keyboard.press('Control+Enter');
    await op('presenting'); await enabled('submit'); assert.equal(await active(),'sabik-response-message');
    await page.keyboard.press('Tab'); assert.equal(await active(),'sabik-write-again');
    await page.keyboard.press('Enter'); assert.equal(await active(),'sabik-input');
    await page.keyboard.press('Tab'); assert.equal(await active(),'sabik-submit');
    await page.keyboard.press('Shift+Tab'); assert.equal(await active(),'sabik-input');
  });
  await contract('N16', 'nonempty complementary notice is inside the single focused message', async () => {
    await fresh(); await submit('zzqxv'.repeat(20));
    assert.ok((await el('notice').textContent()).trim());
    assert.equal((await resultFocus())[0].text, await finalMessage());
    assert.equal((await focusCalls()).length,1); assert.deepEqual(await announcements(),[]);
  });
  await contract('N17', 'late results after reset never move focus', async () => {
    await fresh(); const held=await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    await reset(); held.release(); await page.waitForLoadState('networkidle');
    assert.deepEqual(await focusCalls(),[]); assert.equal(await active(),'sabik-input');
  });
  await contract('N18', 'collapsed result does not steal focus or queue focus on expansion', async () => {
    await fresh(); const held=await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    await toggle(); held.release(); await op('presenting'); await enabled('submit');
    assert.deepEqual(await focusCalls(),[]); assert.equal(await active(),'sabik-toggle');
    await toggle(); assert.deepEqual(await focusCalls(),[]); assert.equal(await active(),'sabik-toggle');
  });
  console.log(JSON.stringify({extra}));
  if (evidence) fs.writeFileSync(path.join(evidence,'s1-results.json'),JSON.stringify({root,browser:await browser.version(),policy,results,summary,extra},null,2));
  if(results.some(r=>r.automated==='FAIL')) process.exitCode=1;
  if(extra.some(r=>!r.pass)) process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
