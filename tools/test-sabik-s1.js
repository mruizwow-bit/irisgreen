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
async function fresh(options = {}, notifyMode = "mock") {
  if (page) await page.context().close();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...options });
  await context.addInitScript(mode => {
    const nativeNotify = document.ariaNotify;
    window.__s1NativeNotifyType = typeof nativeNotify;
    window.__s1ATCalls = [];
    if (mode === 'absent') Object.defineProperty(document, 'ariaNotify', {configurable:true,value:undefined});
    else if (mode === 'mock' || typeof nativeNotify === 'function') {
      Object.defineProperty(document, 'ariaNotify', {configurable:true,value:function(message, options) {
        window.__s1ATCalls.push({message,options,busy:document.querySelector('#sabik-output')?.getAttribute('aria-busy')});
        if (mode === 'native') return nativeNotify.call(this,message,options);
      }});
    }
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
  }, notifyMode);
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
  await test("A02", "one submission notifies once without moving focus to the response", async () => {
    await submit(); const answer = await el("answer").textContent(); assert.ok(answer.length > 20);
    assert.equal(await active(), 'sabik-input');
    assert.equal(await page.evaluate(() => window.__s1ResultFocusCalls.length), 0);
    assert.equal(await page.evaluate(a => window.__s1ATCalls.filter(c => c.message.startsWith(a)).length, answer), 1);
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
  await test("A13", "answer retained without repeat announcement", async () => { const a = await el("answer").textContent(); const count = await page.evaluate(a => [...window.__s1Announcements,...window.__s1ATCalls.map(c=>c.message)].filter(s => s.startsWith(a)).length, a); await pause(); await resume(); assert.equal(await el("answer").textContent(), a); assert.equal(await page.evaluate(a => [...window.__s1Announcements,...window.__s1ATCalls.map(c=>c.message)].filter(s => s.startsWith(a)).length, a), count); });
  await test("A14", "incompatible controls disabled", async () => { await pause(); for(const id of ['submit','shorter','not-this','other-way','low']) assert.equal(await el(id).isDisabled(), true); await resume(); });
  await test("A15", "maximum input accepted", async () => { await reset(); await submit("x".repeat(2000)); assert.equal(await el("input").getAttribute("aria-invalid"), "false"); });
  await test("A16", "over limit preserves input and announces", async () => { await reset(); await el("input").fill("x".repeat(2001)); const before = await state(); await el("submit").click(); assert.equal((await state()).revision, before.revision); assert.equal(await el("input").inputValue(), "x".repeat(2001)); assert.equal(await el("input").getAttribute("aria-invalid"), "true"); assert.equal(await el("input-error").isVisible(), true); assert.equal(await active(), "sabik-input"); });
  await test("A17", "input retains focus while submit retrieves", async () => {
    await fresh(); const held = await holdData();
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
    try { assert.equal(await active(), 'sabik-input'); } finally { held.release(); }
    await op('presenting'); await enabled('submit');
  });
  await test("A18", "final response retains input focus", async () => { await submit(); assert.equal(await active(), "sabik-input"); });
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
  const calls = () => page.evaluate(() => window.__s1ATCalls);
  const announcements = () => page.evaluate(() => window.__s1Announcements);
  const mutations = () => page.evaluate(() => window.__s1AnnouncementRecords);
  const focusCalls = () => page.evaluate(() => window.__s1ResultFocusCalls);
  const finalMessage = () => page.evaluate(() => [document.querySelector('#sabik-answer').textContent, document.querySelector('#sabik-notice').textContent].filter(Boolean).join(' ').replace(/\s+/gu,' ').trim());
  await contract('N01', 'available ariaNotify branch is exercised with an explicit mock', async () => {
    await fresh(); assert.equal(await page.evaluate(() => typeof document.ariaNotify),'function');
    await submit('Qué es el autismo');
  });
  await contract('N02', 'one final response makes exactly one ariaNotify call', async () => { assert.equal((await calls()).length,1); });
  await contract('N03', 'notification contains the complete final visible response', async () => {
    assert.equal((await calls())[0].message,await finalMessage()); assert.ok((await finalMessage()).length > 20);
  });
  await contract('N04', 'ordinary response uses normal priority after busy completes', async () => {
    assert.deepEqual((await calls())[0].options,{priority:'normal'}); assert.equal((await calls())[0].busy,'false');
  });
  await contract('N05', 'ariaNotify channel never also updates the live region', async () => {
    assert.deepEqual(await mutations(),[]); assert.equal(await el('announcement').textContent(),'');
  });
  await contract('N06', 'notification never calls focus on the response', async () => { assert.deepEqual(await focusCalls(),[]); });
  await contract('N07', 'focus remains in the textarea after the response', async () => { assert.equal(await active(),'sabik-input'); });
  await contract('N08', 'two submissions make two complete notifications, one per response', async () => {
    const first=await finalMessage(); await submit('Qué es el autismo');
    assert.deepEqual((await calls()).map(c=>c.message),[first,await finalMessage()]); assert.deepEqual(await mutations(),[]);
  });
  await contract('N09', 'technical error makes one brief call and remains visible without forced focus', async () => {
    await fresh(); await page.route('**/sabik/assets/NEA/data/concepts.es.json',r=>r.abort('failed'));
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await op('error'); await enabled('submit');
    assert.deepEqual((await calls()).map(c=>c.message),['No he podido cargar los datos locales. Puedes volver a enviar tu consulta.']);
    assert.equal((await calls())[0].message,await finalMessage()); assert.equal(await el('output').isVisible(),true);
    assert.equal(await active(),'sabik-input'); assert.deepEqual(await focusCalls(),[]); assert.deepEqual(await mutations(),[]);
  });
  await contract('N10', 'pause resume and reset use the same single channel without replay', async () => {
    await fresh(); await submit(); const response=await finalMessage(); await pause(); await resume(); await reset();
    assert.deepEqual((await calls()).map(c=>c.message),[response,'Sabik está en pausa.','Sabik vuelve a estar disponible.','Conversación reiniciada.']);
    assert.ok((await calls()).every(c=>c.options.priority==='normal')); assert.deepEqual(await mutations(),[]);
  });
  await contract('N11', 'without ariaNotify a persistent single status polite atomic fallback exists', async () => {
    await fresh({},'absent'); assert.equal(await page.evaluate(()=>typeof document.ariaNotify),'undefined');
    assert.equal(await el('announcement').getAttribute('role'),'status');
    assert.equal(await el('announcement').getAttribute('aria-live'),'polite');
    assert.equal(await el('announcement').getAttribute('aria-atomic'),'true');
    assert.equal(await page.locator('.sabik-panel [aria-live], .sabik-panel [role="status"], .sabik-panel [role="log"], .sabik-panel [role="alert"]').count(),1);
    assert.deepEqual(await mutations(),[]); await submit('Qué es el autismo');
  });
  await contract('N12', 'fallback publishes a whole text node in exactly one mutation', async () => {
    const records=await mutations(); assert.equal(records.length,1); assert.equal(records[0].type,'childList');
    assert.equal(records[0].addedCount,1); assert.equal(records[0].addedText,await finalMessage());
    assert.equal(await page.evaluate(()=>window.__s1AnnouncementRegion===document.querySelector('#sabik-announcement')),true);
  });
  await contract('N13', 'fallback branch never also calls ariaNotify', async () => { assert.deepEqual(await calls(),[]); });
  await contract('N14', 'fallback preserves textarea focus without forced response focus', async () => {
    assert.equal(await active(),'sabik-input'); assert.deepEqual(await focusCalls(),[]);
  });
  await contract('N15', 'fallback accessible text exactly matches visible answer and optional notice', async () => {
    assert.equal(await el('announcement').textContent(),await finalMessage());
    assert.equal(await el('announcement').evaluate(n=>!!n.closest('[hidden], [aria-hidden="true"], [inert]')),false);
    assert.equal(await el('status-text').getAttribute('aria-live'),null); assert.equal(await el('status-text').getAttribute('role'),null);
  });
  const productCode=fs.readFileSync(path.join(root,'sabik/sabik-page.js'),'utf8');
  await contract('N16', 'no Web Speech API', async () => { assert.doesNotMatch(productCode,/speechSynthesis|SpeechSynthesisUtterance/u); });
  await contract('N17', 'feature detection uses no browser or OS sniffing', async () => {
    assert.doesNotMatch(productCode,/navigator\.(?:userAgent|platform|userAgentData)|appVersion/u);
    assert.match(productCode,/typeof document\.ariaNotify === "function"/u);
  });
  await contract('N18', 'no application role', async () => { assert.equal(await page.locator('.sabik-panel [role="application"]').count(),0); });
  await contract('N19', 'no assertive region or high priority for ordinary messages', async () => {
    assert.equal(await page.locator('.sabik-panel [aria-live="assertive"]').count(),0);
    assert.doesNotMatch(productCode,/priority:\s*["']high["']/u);
  });
  await contract('N20', 'repeated fallback messages each replace once without segmentation or history growth', async () => {
    const first=await finalMessage(); await submit('Qué es el autismo');
    assert.deepEqual(await announcements(),[first,await finalMessage()]); assert.equal((await mutations()).length,2);
    assert.equal(await el('announcement').evaluate(n=>n.childNodes.length),1); assert.deepEqual(await calls(),[]);
  });
  await contract('N21', 'installed Chrome capability and actual native invocation are recorded separately from mocks', async () => {
    await fresh({},'native'); const nativeType=await page.evaluate(()=>window.__s1NativeNotifyType);
    assert.ok(['function','undefined'].includes(nativeType)); await submit('Qué es el autismo');
    const expected=await finalMessage();
    if(nativeType==='function') {
      assert.deepEqual(await calls(),[{message:expected,options:{priority:'normal'},busy:'false'}]);
      assert.deepEqual(await mutations(),[]);
    } else { assert.deepEqual(await calls(),[]); assert.deepEqual(await announcements(),[expected]); }
    assert.equal(await active(),'sabik-input'); assert.deepEqual(await focusCalls(),[]);
    const cdp=await page.context().newCDPSession(page);
    try {
      const ax=await cdp.send('Accessibility.getFullAXTree');
      const capability={browser:await browser.version(),nativeType,mode:'native-forwarding-observer-not-mock',query:'Qué es el autismo',expected,calls:await calls(),fallbackMutations:await mutations(),active:await active(),ax};
      console.log(JSON.stringify({nativeAriaNotify:nativeType,browser:capability.browser}));
      if(evidence) fs.writeFileSync(path.join(evidence,'arianotify-native-autismo.json'),JSON.stringify(capability,null,2));
    } finally {await cdp.detach();}
  });
  await contract('N22', 'both channels normalize whitespace and skip an empty notification', async () => {
    for(const mode of ['mock','absent']) {
      await fresh({},mode); await el('input').fill('x'.repeat(2001));
      await el('input-error').evaluate(n=>n.textContent='  Mensaje\n completo.   Otra frase.  '); await el('submit').click();
      const messages=mode==='mock'?(await calls()).map(c=>c.message):await announcements();
      assert.deepEqual(messages,['Mensaje completo. Otra frase.']);
      await el('input-error').evaluate(n=>n.textContent=' \n '); await el('submit').click();
      assert.equal(mode==='mock'?(await calls()).length:(await mutations()).length,1);
    }
  });
  await contract('N23', 'fallback controls and error each publish once without replay or forced focus', async () => {
    await fresh({},'absent'); await submit(); const response=await finalMessage(); await pause(); await resume(); await reset();
    assert.deepEqual(await announcements(),[response,'Sabik está en pausa.','Sabik vuelve a estar disponible.','Conversación reiniciada.']);
    assert.deepEqual(await calls(),[]); assert.deepEqual(await focusCalls(),[]);
    await fresh({},'absent'); await page.route('**/sabik/assets/NEA/data/concepts.es.json',r=>r.abort('failed'));
    await el('input').fill('Qué es el autismo'); await el('submit').click(); await op('error'); await enabled('submit');
    assert.deepEqual(await announcements(),[await finalMessage()]); assert.equal((await mutations()).length,1);
    assert.equal(await active(),'sabik-input'); assert.deepEqual(await focusCalls(),[]); assert.deepEqual(await calls(),[]);
  });
  await contract('N24', 'optional notice remains complete in both branches and keyboard return preserves session', async () => {
    for(const mode of ['mock','absent']) {
      await fresh({},mode); await submit('zzqxv'.repeat(20)); assert.ok((await el('notice').textContent()).trim());
      assert.equal(mode==='mock'?(await calls())[0].message:(await announcements())[0],await finalMessage());
      assert.deepEqual(await focusCalls(),[]);
      const before=await behavior(), count=(await calls()).length+(await mutations()).length;
      await el('reset-session').focus(); await page.keyboard.press('Tab'); assert.equal(await active(),'sabik-response-message');
      await page.keyboard.press('Tab'); assert.equal(await active(),'sabik-write-again');
      await page.keyboard.press('Enter'); assert.equal(await active(),'sabik-input'); assert.deepEqual(await behavior(),before);
      assert.equal((await calls()).length+(await mutations()).length,count);
    }
  });
  await contract('N25', 'retrieval stays silent and reset discards late notification in both branches', async () => {
    for(const mode of ['mock','absent']) {
      await fresh({},mode); const held=await holdData(); await el('input').fill('Qué es el autismo'); await el('submit').click(); await held.seen;
      try {
        assert.deepEqual(await calls(),[]); assert.deepEqual(await mutations(),[]); assert.deepEqual(await focusCalls(),[]);
        await reset();
      } finally {held.release();}
      await page.waitForLoadState('networkidle');
      assert.deepEqual(mode==='mock'?(await calls()).map(c=>c.message):await announcements(),['Conversación reiniciada.']);
      assert.equal(await active(),'sabik-input'); assert.deepEqual(await focusCalls(),[]);
    }
  });
  console.log(JSON.stringify({extra}));
  if (evidence) fs.writeFileSync(path.join(evidence,'s1-results.json'),JSON.stringify({root,browser:await browser.version(),policy,results,summary,extra},null,2));
  if(results.some(r=>r.automated==='FAIL')) process.exitCode=1;
  if(extra.some(r=>!r.pass)) process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
