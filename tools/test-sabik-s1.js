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
    // Test-only timeline: observe native focus events separately from script calls.
    window.__s1FocusCalls = []; window.__s1FocusTimeline = [];
    window.__s1SubmitStarted = null;
    const focusId = node => node?.id || node?.tagName || null;
    const traceFocus = (type, details = {}) => {
      if (window.__s1SubmitStarted !== null) window.__s1FocusTimeline.push({
        type, ms: performance.now() - window.__s1SubmitStarted,
        active: focusId(document.activeElement), ...details
      });
    };
    window.__s1TraceFocus = traceFocus;
    const nativeElementFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (...args) {
      if (window.__s1SubmitStarted !== null) {
        const call = {target:focusId(this),before:focusId(document.activeElement)};
        window.__s1FocusCalls.push(call); traceFocus('focus-call',call);
      }
      return nativeElementFocus.apply(this,args);
    };
    document.addEventListener('submit', event => {
      if (event.target.id !== 'sabik-form') return;
      window.__s1SubmitStarted = performance.now();
      window.__s1FocusCalls = []; window.__s1FocusTimeline = [];
      traceFocus('submit',{target:event.target.id});
    }, true);
    for (const type of ['focus','focusin','blur','focusout']) document.addEventListener(type,
      event => traceFocus(type,{target:focusId(event.target),related:focusId(event.relatedTarget)}),true);
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
      const output = document.querySelector('#sabik-output');
      let lastBusy = output.getAttribute('aria-busy');
      new MutationObserver(() => {
        const busy = output.getAttribute('aria-busy');
        if (busy !== lastBusy) window.__s1TraceFocus(busy === 'true' ? 'loading-start' : 'loading-end');
        lastBusy = busy;
      }).observe(output,{attributes:true,attributeFilter:['aria-busy']});
      new MutationObserver(records => {
        for (const record of records) {
          if (record.target === region) for (const node of record.addedNodes) {
            window.__s1Announcements.push(node.textContent);
            window.__s1TraceFocus('status-update',{text:node.textContent});
          }
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
const submissionFocusCalls = () => page.evaluate(() => window.__s1FocusCalls);
async function naturalButtonFocus() {
  // Chromium blurs a natively disabled button to BODY; no product focus target.
  assert.ok(['', 'sabik-submit'].includes(await active()), 'button activation must not refocus input or response');
  assert.deepEqual(await submissionFocusCalls(), []);
}
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
  await test("A02", "one click keeps browser focus behavior and announces only availability", async () => {
    await submit(); const answer = await el("answer").textContent(); assert.ok(answer.length > 20);
    await naturalButtonFocus();
    assert.equal(await page.evaluate(() => window.__s1ResultFocusCalls.length), 0);
    assert.deepEqual(await page.evaluate(() => window.__s1Announcements), ['Respuesta de Sabik disponible.']);
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
  await test("A17", "click does not artificially focus input during retrieval", async () => {
    await fresh(); const held = await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    try { await naturalButtonFocus(); } finally { held.release(); }
    await op('presenting'); await enabled('submit');
  });
  await test("A18", "button submission preserves natural focus instead of imposing the input", async () => { await submit(); await naturalButtonFocus(); });
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
  const focusCalls = () => page.evaluate(() => window.__s1ResultFocusCalls);
  const announcements = () => page.evaluate(() => window.__s1Announcements);
  const finalMessage = () => page.evaluate(() => [document.querySelector('#sabik-answer').textContent, document.querySelector('#sabik-notice').textContent].filter(Boolean).join(' ').replace(/\s+/gu, ' ').trim());
  const language = async value => {
    await page.locator(`[data-lang="${value}"]`).click();
    await page.waitForFunction(value => document.documentElement.lang === value && document.querySelector('.sabik-panel').lang === value, value);
  };
  const ES_READY = 'Respuesta de Sabik disponible.', EN_READY = 'Sabik response available.';
  await contract('N01', 'complete visible response is semantic and keyboard reachable', async () => {
    await fresh(); await submit('Qué es el autismo');
    assert.equal(await el('response-message').getAttribute('tabindex'), '0');
    assert.equal(await el('response-message').getAttribute('role'), 'group');
    assert.equal(await el('response-message').isVisible(), true);
    assert.equal(await el('response-message').getAttribute('aria-labelledby'), 'sabik-output-title');
    assert.equal(await el('response-message').getAttribute('aria-describedby'), null);
    assert.equal(await el('output-title').textContent(), 'Respuesta de Sabik');
    assert.equal(await el('answer').getAttribute('lang'), 'es');
    assert.ok((await finalMessage()).length > 20);
  });
  await contract('N02', 'one completed response makes exactly one short Spanish status update', async () => {
    assert.deepEqual(await announcements(), [ES_READY]);
    const records = await page.evaluate(() => window.__s1AnnouncementRecords);
    assert.equal(records.length, 1);
    assert.equal(records[0].type, 'childList'); assert.equal(records[0].addedCount, 1);
    assert.equal(records[0].text, ES_READY); assert.equal(records[0].busy, 'false');
    assert.equal(await el('announcement').getAttribute('role'), 'status');
    assert.equal(await el('announcement').getAttribute('aria-live'), 'polite');
    assert.equal(await el('announcement').getAttribute('aria-atomic'), 'true');
  });
  await contract('N03', 'button submission does not refocus input or final response', async () => {
    await naturalButtonFocus();
    assert.deepEqual(await focusCalls(), []);
    assert.deepEqual(await page.evaluate(() => window.__s1ResultFocus), []);
  });
  await contract('N04', 'AX exposes the complete response as content, not an automatic description', async () => {
    const expected = await el('answer').textContent();
    const cdp = await page.context().newCDPSession(page);
    try {
      const ax = await cdp.send('Accessibility.getFullAXTree');
      const group = ax.nodes.find(n => n.role?.value === 'group' && n.name?.value === 'Respuesta de Sabik');
      assert.ok(group && !group.ignored);
      assert.ok(!group.description?.value);
      assert.ok(!group.properties?.some(p => p.name === 'focused' && p.value.value));
      const descendants = [];
      const walk = id => { const n = ax.nodes.find(n => n.nodeId === id); if (!n) return; descendants.push(n); (n.childIds || []).forEach(walk); };
      walk(group.nodeId);
      assert.ok(descendants.some(n => n.role?.value === 'StaticText' && n.name?.value === expected));
      if (evidence) fs.writeFileSync(path.join(evidence, 's1-short-status-autismo-ax.json'), JSON.stringify({expected,active:await active(),announcements:await announcements(),ax},null,2));
    } finally { await cdp.detach(); }
  });
  await contract('N05', 'exactly one Sabik live region contains neither response nor controls', async () => {
    assert.equal(await page.locator('.sabik-panel [aria-live], .sabik-panel [role="status"], .sabik-panel [role="log"], .sabik-panel [role="alert"]').count(), 1);
    const expected = await el('answer').textContent();
    assert.equal(await page.evaluate(text => [...document.querySelectorAll('[aria-live], [role="status"], [role="log"], [role="alert"]')].some(n => n.textContent.includes(text)), expected), false);
    assert.equal(await el('response-message').evaluate(n => !!n.closest('[aria-live], [role="status"], [role="log"], [role="alert"]')), false);
    assert.equal(await el('announcement').locator('*').count(), 0);
    assert.equal(await el('status-text').getAttribute('aria-live'), null);
    assert.equal(await el('status-text').getAttribute('role'), null);
    assert.equal(await el('response-message').getAttribute('aria-hidden'), null);
  });
  await contract('N06', 'loading neither announces the answer nor moves focus; completion notifies once', async () => {
    await fresh(); const held = await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    try {
      await naturalButtonFocus();
      assert.equal(await el('output').getAttribute('aria-busy'), 'true');
      assert.deepEqual(await focusCalls(), []); assert.deepEqual(await announcements(), []);
    } finally { held.release(); }
    await op('presenting'); await enabled('submit');
    assert.deepEqual(await focusCalls(), []); assert.deepEqual(await announcements(), [ES_READY]);
    await naturalButtonFocus();
  });
  await contract('N07', 'two explicit answers each notify once through the same persistent region', async () => {
    await fresh(); await submit(); await submit();
    assert.deepEqual(await announcements(), [ES_READY, ES_READY]);
    assert.equal(await page.evaluate(() => window.__s1AnnouncementRegion === document.querySelector('#sabik-announcement')), true);
    assert.equal(await page.evaluate(() => window.__s1AnnouncementRecords.length), 2);
    assert.deepEqual(await focusCalls(), []);
  });
  await contract('N08', 'technical failure exposes one brief error and does not artificially refocus input', async () => {
    await fresh(); await page.route('**/sabik/assets/NEA/data/concepts.es.json', r => r.abort('failed'));
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await op('error'); await enabled('submit');
    const message = 'No he podido cargar los datos locales. Puedes volver a enviar tu consulta.';
    assert.equal(await el('answer').textContent(), message);
    assert.deepEqual(await announcements(), [message]);
    assert.equal(await el('output').isVisible(), true); assert.equal(await el('sources').textContent(), '');
    await naturalButtonFocus(); assert.deepEqual(await focusCalls(), []);
  });
  await contract('N09', 'pause resume reset produce one own brief state each, never the old response', async () => {
    await fresh(); await submit(); await pause(); await resume(); await reset();
    assert.deepEqual(await announcements(), [ES_READY,'Sabik está en pausa.','Sabik vuelve a estar disponible.','Conversación reiniciada.']);
    assert.deepEqual(await focusCalls(), []); assert.equal(await active(), 'sabik-input');
  });
  await contract('N10', 'keyboard reaches response and optional return action without a focus trap', async () => {
    await fresh(); await submit(); const before = await behavior(), value = await el('input').inputValue();
    await el('reset-session').focus(); await page.keyboard.press('Tab');
    assert.equal(await active(), 'sabik-response-message');
    await page.keyboard.press('Tab'); assert.equal(await active(), 'sabik-write-again');
    await page.keyboard.press('Enter'); assert.equal(await active(), 'sabik-input');
    await page.keyboard.press('Tab'); assert.equal(await active(), 'sabik-submit');
    await page.keyboard.press('Shift+Tab'); assert.equal(await active(), 'sabik-input');
    assert.deepEqual(await behavior(), before); assert.equal(await el('input').inputValue(), value);
    assert.deepEqual(await announcements(), [ES_READY]);
  });
  await contract('N11', 'product has no ariaNotify, Web Speech, application role or response focus calls', async () => {
    const product = fs.readFileSync(path.join(root,'sabik/sabik-page.js'),'utf8');
    assert.doesNotMatch(product, /ariaNotify|speechSynthesis|SpeechSynthesisUtterance|focusFinalResponse/u);
    assert.equal(await page.locator('.sabik-panel [role="application"]').count(), 0);
    assert.equal(await el('response-message').getAttribute('aria-label'), null);
  });
  await contract('N12', 'complementary editorial notice remains complete, visible and outside live region', async () => {
    await fresh(); await submit('zzqxv'.repeat(20));
    assert.ok((await el('notice').textContent()).trim());
    assert.equal(await el('notice').isVisible(), true);
    assert.equal(await el('response-message').textContent().then(s=>s.replace(/\s+/gu,' ').trim()), await finalMessage());
    assert.deepEqual(await announcements(), [ES_READY]); assert.deepEqual(await focusCalls(), []);
  });
  await contract('N13', 'invalidated results never notify completion after reset', async () => {
    await fresh(); const held=await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    await reset(); held.release(); await page.waitForLoadState('networkidle');
    assert.deepEqual(await announcements(), ['Conversación reiniciada.']);
    assert.deepEqual(await focusCalls(), []); assert.equal(await active(), 'sabik-input');
  });
  await contract('N14', 'collapsed result never steals focus and expansion does not replay the status', async () => {
    await fresh(); const held=await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    await toggle(); held.release(); await op('presenting'); await enabled('submit');
    assert.equal(await active(), 'sabik-toggle'); assert.deepEqual(await announcements(), [ES_READY]);
    await toggle(); assert.deepEqual(await focusCalls(), []); assert.equal(await active(), 'sabik-toggle');
    assert.deepEqual(await announcements(), [ES_READY]);
  });
  const englishUI = {
    '#sabik-widget-title':'Sabik', '.sabik-badge':'AI', '.sabik-subtitle':'Iris Green assistant',
    '#sabik-state-label':'Available', '#sabik-toggle':'Hide', '#sabik-status-text':'I am here if you would like help.',
    '.sabik-capability':'I can search Iris Green and explain things more simply. I do not diagnose.',
    'label[for="sabik-input"]':'What do you need?', '#sabik-input-help':'Up to 2000 characters. Enter adds a line; Ctrl+Enter sends.',
    '#sabik-input-error':'Your question exceeds 2000 characters. Shorten it to send; your text is kept.',
    '#sabik-submit':'Send', '#sabik-low':'Lower intensity', '#sabik-shorter':'Shorter', '#sabik-clear':'Pause Sabik',
    '#sabik-resume':'Resume', '#sabik-reset-session':'Start again', '#sabik-output-title':'Sabik response',
    '#sabik-write-again':'Write another question', '#sabik-source-title':'Sources', '#sabik-not-this':'Not this',
    '#sabik-other-way':'Try another approach', '#sabik-memory-note':'No conversation history is kept between sessions.',
    '.sabik-limits':'Sabik can make mistakes. Check important information against official sources.'
  };
  await contract('N15', 'real page language selector translates every static panel label and restores Spanish', async () => {
    await fresh();
    const spanish = {};
    for (const selector of Object.keys(englishUI)) spanish[selector] = await page.locator(selector).textContent();
    const before = await behavior(); await language('en');
    for (const [selector, expected] of Object.entries(englishUI)) assert.equal(await page.locator(selector).textContent(), expected, selector);
    assert.equal(await el('content-language').isVisible(), true);
    assert.equal(await el('content-language').textContent(), 'Answers and source titles are currently available in Spanish.');
    assert.deepEqual(await behavior(), before);
    await language('es');
    for (const [selector, expected] of Object.entries(spanish)) assert.equal(await page.locator(selector).textContent(), expected, selector);
    assert.equal(await el('content-language').isHidden(), true); assert.deepEqual(await behavior(), before);
  });
  await contract('N16', 'English accessible names, labels, placeholder and effective language are coherent', async () => {
    await language('en');
    assert.equal(await page.getByRole('textbox',{name:'What do you need?',exact:true}).count(), 1);
    for (const name of ['Send','Pause Sabik','Start again','Shorter','Lower intensity','Hide']) assert.equal(await page.getByRole('button',{name,exact:true}).count(), 1);
    assert.equal(await el('input').getAttribute('placeholder'), 'Example: when I get back from shopping, I cannot cope with anyone');
    assert.equal(await page.locator('.sabik-response-actions').getAttribute('aria-label'), 'If this response does not fit');
    assert.equal(await el('hologram').getAttribute('aria-label'), 'Sabik, iris and lavender holographic sphere');
    assert.equal(await el('input').evaluate(n=>n.closest('[lang]').lang), 'en');
    assert.equal(await el('announcement').evaluate(n=>n.closest('[lang]').lang), 'en');
    await language('es');
    assert.equal(await page.locator('.sabik-response-actions').getAttribute('aria-label'), 'Si esta respuesta no encaja');
    assert.equal(await el('hologram').getAttribute('aria-label'), 'Sabik, esfera holográfica iris y lavanda');
    assert.equal(await el('input').getAttribute('placeholder'), 'Ejemplo: cuando vuelvo de comprar no puedo con nadie');
  });
  await contract('N17', 'English completion is one exact brief status; original approved answer remains Spanish', async () => {
    await fresh(); await submit('Qué es el autismo');
    const original = await finalMessage(), before = await behavior();
    await language('en'); assert.equal(await finalMessage(), original); assert.deepEqual(await behavior(), before);
    assert.equal(await el('announcement').textContent(), ''); // No replay on language change.
    await reset(); const start = (await announcements()).length; await submit('Qué es el autismo');
    assert.deepEqual((await announcements()).slice(start), [EN_READY]);
    assert.equal(await finalMessage(), original); await naturalButtonFocus();
    for (const id of ['answer','notice','sources']) assert.equal(await el(id).getAttribute('lang'), 'es');
    assert.equal(await el('status-text').textContent(), 'Sabik has prepared a response.');
    assert.equal(await page.getByRole('group',{name:'Sabik response',exact:true}).count(), 1);
    if(evidence) await page.locator('.sabik-panel').screenshot({path:path.join(evidence,'N17-English-panel.png')});
  });
  await contract('N18', 'English pause resume hide show and reset localize their own states only', async () => {
    const count = (await announcements()).length;
    await pause(); assert.equal(await el('state-label').textContent(),'Paused');
    assert.equal(await el('status-text').textContent(),'Sabik is paused. Your input and response are still here.');
    await toggle(); assert.equal(await el('toggle').textContent(),'Show'); assert.equal(await el('state-label').textContent(),'Hidden');
    await toggle(); assert.equal(await el('toggle').textContent(),'Hide'); assert.equal(await el('state-label').textContent(),'Paused');
    await resume(); assert.equal(await el('state-label').textContent(),'Available');
    await reset(); assert.equal(await el('status-text').textContent(),'Conversation restarted. You can write a new question.');
    assert.deepEqual((await announcements()).slice(count),['Sabik is paused.','Sabik is available again.','Conversation restarted.']);
  });
  await contract('N19', 'English validation and technical errors are single brief localized announcements', async () => {
    await el('input').fill('x'.repeat(2001)); const count = (await announcements()).length;
    await el('submit').click();
    assert.deepEqual((await announcements()).slice(count), ['Your question exceeds 2000 characters. Shorten it to send; your text is kept.']);
    await fresh(); await language('en'); await page.route('**/sabik/assets/NEA/data/concepts.es.json',r=>r.abort('failed'));
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await op('error'); await enabled('submit');
    const message='I could not load the local data. You can send your question again.';
    assert.deepEqual(await announcements(), [message]); assert.equal(await el('answer').textContent(),message);
    assert.equal(await el('answer').evaluate(n=>n.closest('[lang]').lang),'en');
    await naturalButtonFocus(); assert.deepEqual(await focusCalls(),[]);
  });
  await contract('N20', 'English intensity, shorter-response state and correction prompts translate', async () => {
    await fresh(); await language('en'); await el('low').click();
    assert.equal(await el('low').textContent(),'Raise intensity');
    assert.equal(await el('low').getAttribute('aria-pressed'),'true');
    assert.equal((await behavior()).intensity,'true');
    assert.equal(await el('status-text').textContent(),'Low intensity enabled.');
    await el('low').click(); assert.equal(await el('status-text').textContent(),'Normal intensity enabled.');
    assert.equal(await el('low').getAttribute('aria-pressed'),'false');
    assert.equal((await behavior()).intensity,'false');
    await el('shorter').click(); assert.equal(await el('status-text').textContent(),'Shorter responses enabled.');
    await submit('zzqxv'.repeat(20));
    assert.equal(await el('status-text').textContent(),'Sabik does not have sufficient source information.');
    await el('other-way').click();
    assert.equal(await el('answer').textContent(),'To try another approach, I need a brief clarification: what would you like to withdraw or try now?');
    assert.equal(await el('notice').textContent(),'I will not repeat the same response if there is no different approach to try.');
    assert.equal(await el('status-text').textContent(),'Sabik needs clarification to try another approach.');
    await el('not-this').click();
    assert.equal(await el('answer').textContent(),'Understood. I will withdraw this approach. You can write a specific correction.');
    assert.equal(await el('notice').textContent(),'An explicit correction takes precedence over an inference.');
    assert.equal(await el('status-text').textContent(),'Sabik is waiting for a correction.');
    assert.equal(await el('answer').evaluate(n=>n.closest('[lang]').lang),'en');
    await language('es');
    assert.equal(await el('answer').textContent(),'Entendido. Retiro esta vía. Puedes escribir una corrección concreta.');
  });
  await contract('N21', 'language change during retrieval preserves S0 and uses new language at completion', async () => {
    await fresh(); const held=await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    try {
      const before=await behavior(); await language('en'); assert.deepEqual(await behavior(),before);
      assert.equal(await el('status-text').textContent(),'Sabik is searching Iris Green.');
      // Restore typing voluntarily; completion must not steal focus from any user destination.
      await el('input').focus();
    } finally { held.release(); }
    await op('presenting'); await enabled('submit'); assert.deepEqual(await announcements(),[EN_READY]);
    assert.equal(await active(),'sabik-input'); assert.deepEqual(await focusCalls(),[]);
  });
  await contract('N22', 'English panel reflows at mobile width with full response and conventional navigation', async () => {
    await page.setViewportSize({width:320,height:900}); await noHorizontalOverflow();
    assert.equal(await el('content-language').isVisible(),true);
    assert.equal(await el('response-message').isVisible(),true);
    assert.equal(await page.locator('#search-form').count(),1);
    if(evidence) await page.locator('.sabik-panel').screenshot({path:path.join(evidence,'N22-English-mobile-panel.png')});
  });
  const naturalFocusCases = [];
  async function naturalActivation(mode, lang = 'es', hold = false) {
    await fresh(); if (lang === 'en') await language('en');
    const held = hold ? await holdData() : null;
    await el('input').fill('Qué es el autismo');
    if (mode.startsWith('keyboard')) await page.keyboard.press('Tab');
    if (mode === 'mouse') await el('submit').click();
    else await page.keyboard.press(mode === 'ctrl-enter' ? 'Control+Enter' : mode === 'keyboard-enter' ? 'Enter' : 'Space');
    if (held) await held.seen;
    return held;
  }
  async function saveNaturalCase(mode) {
    const observed = await page.evaluate(() => ({active:document.activeElement.id||document.activeElement.tagName,calls:window.__s1FocusCalls,timeline:window.__s1FocusTimeline,announcements:window.__s1Announcements}));
    naturalFocusCases.push({mode,...observed}); return observed;
  }
  await contract('N-F1','mouse click has no programmatic input or response focus',async()=>{
    await naturalActivation('mouse'); await op('presenting'); await enabled('submit');
    await naturalButtonFocus();
    const observed=await saveNaturalCase('mouse');
    assert.equal(observed.timeline.find(e=>e.type==='submit').active,'sabik-submit');
    assert.ok(!observed.timeline.some(e=>['focus','focusin'].includes(e.type)&&e.target==='sabik-input'));
  });
  await contract('N-F2','Ctrl Enter retains input by continuity without even a redundant focus call',async()=>{
    await naturalActivation('ctrl-enter'); await op('presenting'); await enabled('submit');
    assert.equal(await active(),'sabik-input'); assert.deepEqual(await submissionFocusCalls(),[]);
    const observed=await saveNaturalCase('ctrl-enter');
    assert.ok(!observed.timeline.some(e=>['focus','focusin','blur','focusout'].includes(e.type)));
  });
  await contract('N-F3','Enter and Space on Send respect browser button focus behavior',async()=>{
    for(const mode of ['keyboard-enter','keyboard-space']) {
      await naturalActivation(mode); await op('presenting'); await enabled('submit');
      await naturalButtonFocus(); const observed=await saveNaturalCase(mode);
      assert.equal(observed.timeline.find(e=>e.type==='submit').active,'sabik-submit');
      assert.ok(!observed.timeline.some(e=>['focus','focusin'].includes(e.type)&&e.target==='sabik-input'));
    }
  });
  await contract('N-F4','pending load emits no script focus or loading announcement',async()=>{
    const held=await naturalActivation('mouse','es',true);
    try {
      assert.equal(await el('output').getAttribute('aria-busy'),'true');
      assert.deepEqual(await submissionFocusCalls(),[]); assert.deepEqual(await announcements(),[]);
      assert.ok(!(await page.evaluate(()=>window.__s1FocusTimeline)).some(e=>['focus','focusin'].includes(e.type)));
    } finally {held.release();}
    await op('presenting'); await enabled('submit');
  });
  await contract('N-F5','completion publishes one status without moving focus at or after completion',async()=>{
    const observed=await saveNaturalCase('mouse-held');
    assert.deepEqual(observed.announcements,[ES_READY]); assert.deepEqual(observed.calls,[]);
    const end=observed.timeline.findIndex(e=>e.type==='loading-end');assert.ok(end>=0);
    assert.equal(observed.timeline.filter(e=>e.type==='status-update').length,1);
    assert.ok(!observed.timeline.slice(end).some(e=>['focus','focusin','blur','focusout','focus-call'].includes(e.type)));
    assert.equal(await page.evaluate(()=>window.__s1AnnouncementRecords.length),1);
  });
  await contract('N-F6','Spanish notification stays exact, persistent polite atomic status',async()=>{
    assert.deepEqual(await announcements(),[ES_READY]);
    assert.equal(await el('announcement').getAttribute('role'),'status');
    assert.equal(await el('announcement').getAttribute('aria-live'),'polite');
    assert.equal(await el('announcement').getAttribute('aria-atomic'),'true');
    assert.equal(await page.evaluate(()=>document.querySelector('#sabik-announcement')===window.__s1AnnouncementRegion),true);
  });
  await contract('N-F7','English click publishes one exact localized status without refocus',async()=>{
    await naturalActivation('mouse','en');await op('presenting');await enabled('submit');
    assert.deepEqual(await announcements(),[EN_READY]);await naturalButtonFocus();
    await saveNaturalCase('mouse-en');
  });
  await contract('N-F8','complete answer remains outside the single brief live region',async()=>{
    const answer=await el('answer').textContent();assert.ok(answer.length>20);
    assert.equal(await page.locator('.sabik-panel [aria-live], .sabik-panel [role="status"], .sabik-panel [role="log"], .sabik-panel [role="alert"]').count(),1);
    assert.ok(!(await el('announcement').textContent()).includes(answer));
    assert.equal(await el('answer').evaluate(n=>!!n.closest('[aria-live], [role="status"], [role="log"], [role="alert"]')),false);
  });
  await contract('N-F9','all activation modes have no response focus calls or response focus events',async()=>{
    for(const observed of naturalFocusCases) {
      assert.deepEqual(observed.calls,[]);
      assert.ok(!observed.timeline.some(e=>['focus','focusin'].includes(e.type)&&e.target==='sabik-response-message'));
    }
  });
  await contract('N-F10','no speculative voice, notification timer or application role is added',async()=>{
    const product=fs.readFileSync(path.join(root,'sabik/sabik-page.js'),'utf8');
    assert.doesNotMatch(product,/ariaNotify|speechSynthesis|SpeechSynthesisUtterance|setTimeout|focusFinalResponse/u);
    assert.equal(await page.locator('.sabik-panel [role="application"]').count(),0);
  });
  if(evidence)fs.writeFileSync(path.join(evidence,'natural-focus-cases.json'),JSON.stringify(naturalFocusCases,null,2));
  console.log(JSON.stringify({extra}));
  if (evidence) fs.writeFileSync(path.join(evidence,'s1-results.json'),JSON.stringify({root,browser:await browser.version(),policy,results,summary,extra},null,2));
  if(results.some(r=>r.automated==='FAIL')) process.exitCode=1;
  if(extra.some(r=>!r.pass)) process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
