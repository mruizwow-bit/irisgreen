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
    window.Worker = class extends OriginalWorker {
      constructor(...args) { super(...args); this.addEventListener("message", e => { if(e.data.state) window.__s1States.push(e.data.state); }); }
    };
    document.addEventListener("DOMContentLoaded", () => {
      new MutationObserver(() => window.__s1Announcements.push(document.querySelector("#sabik-announcement").textContent))
        .observe(document.querySelector("#sabik-announcement"), { childList: true, subtree: true, characterData: true });
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
  await test("A02", "one submission and one complete announcement", async () => {
    await submit(); const answer = await el("answer").textContent(); assert.ok(answer.length > 20);
    assert.equal(await page.evaluate(a => window.__s1Announcements.filter(s => s.startsWith(a)).length, answer), 1);
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
  await test("A17", "focus on submit", async () => { await el("input").fill("Qué es el autismo"); await el("submit").click(); assert.equal(await active(), "sabik-input"); await op("presenting"); await enabled("submit"); });
  await test("A18", "response does not steal focus", async () => { await submit(); assert.equal(await active(), "sabik-input"); });
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
  console.log(JSON.stringify({extra}));
  if (evidence) fs.writeFileSync(path.join(evidence,'s1-results.json'),JSON.stringify({root,browser:await browser.version(),policy,results,summary,extra},null,2));
  if(results.some(r=>r.automated==='FAIL')) process.exitCode=1;
  if(extra.some(r=>!r.pass)) process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
