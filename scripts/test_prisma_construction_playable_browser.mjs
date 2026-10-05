import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const GAME = path.join(ROOT, "prototypes", "construction-playable-r01", "juegos.html");
const GAME_JS = path.join(ROOT, "prototypes", "construction-playable-r01", "game.js");
const QA_OUT = path.join(ROOT, "prototypes", "construction-playable-r01", "QA_BROWSER.json");
const browser = await chromium.launch(
  process.env.CHROME_EXECUTABLE ? { headless: true, executablePath: process.env.CHROME_EXECUTABLE } : { headless: true }
);

const results = { schema: "iris-green.prisma.construction-playable-browser-qa.v1", date: "2026-10-05", tests: {} };
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const openGame = async (width, height) => {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const runtimeErrors = [];
  const failedRequests = [];
  page.on("pageerror", e => runtimeErrors.push(e.message));
  page.on("console", m => { if (m.type() === "error") runtimeErrors.push(m.text()); });
  page.on("requestfailed", r => failedRequests.push(r.url()));
  await page.goto(pathToFileURL(GAME).href);
  await page.locator("#start-new-btn").click();
  if (await page.locator("#confirm-new-dialog").evaluate(el => el.open)) {
    await page.locator("#confirm-new").click();
  }
  await page.locator("#scene").focus();
  return { context, page, runtimeErrors, failedRequests };
};
const key = async (page, value) => { await page.keyboard.press(value); await page.waitForTimeout(8); };
const getState = page => page.evaluate(() => window.__IG_CONSTRUCTION_QA__.getState());

async function collectInitial(page) {
  await key(page, "ArrowDown"); await key(page, "ArrowDown"); await key(page, "Enter");
  await key(page, "ArrowDown"); await key(page, "Enter");
}

async function routeA() {
  const { context, page, runtimeErrors, failedRequests } = await openGame(390, 844);
  await collectInitial(page);
  await key(page, "ArrowUp"); await key(page, "ArrowUp"); await key(page, "ArrowUp"); await key(page, "ArrowRight");
  await key(page, "b"); await key(page, "ArrowRight"); await key(page, "Enter");
  await key(page, "b"); await key(page, "ArrowRight");
  await key(page, "b"); await key(page, "ArrowRight"); await key(page, "Enter");
  await key(page, "b"); await key(page, "ArrowRight");
  await key(page, "b"); await key(page, "2"); await key(page, "ArrowRight"); await key(page, "Enter");
  await key(page, "1"); await key(page, "Enter");
  await page.locator("#height-down").click();
  await page.locator("#remove-btn").click();
  await page.locator("#scene").focus();
  let s = await getState(page);
  assert(s.pieces.some(p => p.type === "block" && p.x === 5 && p.y === 3 && p.z === 0), "A: dependent block removal was not blocked");
  await key(page, "1"); await key(page, "ArrowRight"); await key(page, "Enter");
  await key(page, "Control+z");
  s = await getState(page);
  assert(!s.pieces.some(p => p.type === "platform" && p.x === 6 && p.y === 3), "A: undo failed");
  await key(page, "Enter");
  await key(page, "b"); await key(page, "ArrowRight"); await key(page, "ArrowRight");
  await key(page, "b"); await key(page, "ArrowRight"); await key(page, "Enter");
  await key(page, "b"); await key(page, "ArrowRight"); await key(page, "ArrowRight");
  s = await getState(page);
  assert(s.player.x === 8 && s.player.y === 3, "A: did not cross R1");
  assert(s.inventory.wood === 19 && s.inventory.stone === 11, "A: bridge cost mismatch");
  await key(page, "Enter"); await key(page, "ArrowRight");
  await key(page, "b"); await key(page, "3"); await key(page, "ArrowRight"); await key(page, "Enter");
  await key(page, "PageUp"); await key(page, "ArrowUp"); await key(page, "Enter");
  await key(page, "b"); await key(page, "ArrowRight"); await key(page, "ArrowUp"); await key(page, "ArrowUp");
  s = await getState(page);
  assert(s.freeMode && s.player.x === 10 && s.player.y === 1 && s.player.z === 3, "A: terrace/free mode failed");
  assert(runtimeErrors.length === 0 && failedRequests.length === 0, "A: runtime/resource errors");
  results.tests.route_A = { result: "PASS", inventory: s.inventory, player: s.player, pieces: s.pieces.length };
  await context.close();
}

async function routeB() {
  const { context, page, runtimeErrors, failedRequests } = await openGame(320, 720);
  const dir = async value => { await page.locator(`[data-dir="${value}"]`).click(); await page.waitForTimeout(8); };
  const action = async () => { await page.locator("#primary-action").click(); await page.waitForTimeout(8); };
  const build = async () => { await page.locator("#build-mode").click(); await page.waitForTimeout(8); };
  const roam = async () => { await page.locator("#roam-mode").click(); await page.waitForTimeout(8); };
  const piece = async type => { await page.locator(`[data-piece="${type}"]`).click(); await page.waitForTimeout(8); };
  const place = async () => { await page.locator("#place-btn").click(); await page.waitForTimeout(8); };

  // Collect initial materials and align with R2.
  await dir("S"); await dir("S"); await action();
  await dir("S"); await action();
  await dir("N"); await dir("E");

  // B2 support at C2, then P1/P2.
  await build(); await piece("block"); await dir("E"); await dir("E"); await place();
  await piece("platform"); await dir("W"); await place();
  await roam(); await dir("E");
  await build(); await dir("E"); await place();
  await roam(); await dir("E");

  // B4 support at C4, then P3/P4/P5.
  await build(); await piece("block"); await dir("E"); await dir("E"); await place();
  await piece("platform"); await dir("W"); await place();
  await roam(); await dir("E");
  await build(); await dir("E"); await place();
  await roam(); await dir("E");
  await build(); await dir("E"); await place();
  await roam(); await dir("E"); await dir("E");

  let state = await getState(page);
  assert(state.player.x === 8 && state.player.y === 5, "B: did not cross R2");
  assert(state.inventory.wood === 19 && state.inventory.stone === 10, "B: bridge cost mismatch");
  assert(state.pieces.filter(p => p.type === "block").length === 2, "B: support count mismatch");

  // Open toolbox.
  await dir("N"); await dir("N"); await action();
  state = await getState(page);
  assert(state.boxOpened && state.stairsUnlocked, "B: toolbox/stairs unlock failed");
  await dir("E");

  // Build and climb the two stairs with touch controls.
  await build(); await piece("stair"); await dir("E"); await place();
  await page.locator("#height-up").click(); await dir("N"); await place();
  await roam(); await dir("E"); await dir("N"); await dir("N");

  state = await getState(page);
  assert(state.freeMode && state.player.x === 10 && state.player.y === 1 && state.player.z === 3, "B: terrace/free mode failed");
  assert(runtimeErrors.length === 0 && failedRequests.length === 0, "B: runtime/resource errors");
  results.tests.route_B = { result: "PASS", input: "touch/buttons", inventory: state.inventory, player: state.player, pieces: state.pieces.length };
  await context.close();
}
async function reflowAndA11y(width, height) {
  const { context, page, runtimeErrors } = await openGame(width, height);
  const name = await page.locator("#scene").getAttribute("aria-label");
  assert(name && name.includes("Tablero de construcción"), width + ": canvas accessible name missing");
  const liveCount = await page.locator('[role="status"][aria-live="polite"]').count();
  assert(liveCount === 1, width + ": expected exactly one polite live region, got " + liveCount);
  await key(page, "ArrowDown");
  const liveAfterMove = await page.locator("#game-live").textContent();
  assert(liveAfterMove.includes("Posición:"), width + ": player movement not announced");
  await key(page, "b"); await key(page, "ArrowRight");
  const liveAfterCursor = await page.locator("#game-live").textContent();
  assert(/C[1-5]|No válida|Válida|\(/.test(liveAfterCursor), width + ": cursor state not announced");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.waitForTimeout(50);
  const roamMetrics = await page.evaluate(() => {
    const visible = [...document.querySelectorAll("button,select")].filter(el => el.offsetParent !== null);
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      clipped: visible.filter(el => {
        const r = el.getBoundingClientRect();
        return r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2;
      }).map(el => el.id || el.getAttribute("aria-label") || el.textContent.trim()),
      offenders: [...document.querySelectorAll("body *")].filter(el => el.offsetParent !== null && !el.classList.contains("sr-only") && !el.classList.contains("skip")).map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, id: el.id, className: String(el.className || ""), left: r.left, right: r.right, width: r.width, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
      }).filter(x => x.left < -1 || x.right > innerWidth + 1 || x.scrollWidth > x.clientWidth + 2).slice(0,20)
    };
  });
  assert(roamMetrics.scrollWidth <= width, width + ": 200% horizontal overflow " + JSON.stringify(roamMetrics));
  assert(roamMetrics.clipped.length === 0, width + ": 200% clipped controls " + JSON.stringify(roamMetrics.clipped));
  await page.locator("#build-mode").click();
  const buildMetrics = await page.evaluate(() => {
    const visible = [...document.querySelectorAll("button,select")].filter(el => el.offsetParent !== null);
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      minHeight: Math.min(...visible.map(el => el.getBoundingClientRect().height)),
      clipped: visible.filter(el => {
        const r = el.getBoundingClientRect();
        return r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2;
      }).map(el => el.id || el.getAttribute("aria-label") || el.textContent.trim()),
      offenders: [...document.querySelectorAll("body *")].filter(el => el.offsetParent !== null && !el.classList.contains("sr-only") && !el.classList.contains("skip")).map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, id: el.id, className: String(el.className || ""), left: r.left, right: r.right, width: r.width, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
      }).filter(x => x.left < -1 || x.right > innerWidth + 1 || x.scrollWidth > x.clientWidth + 2).slice(0,20)
    };
  });
  assert(buildMetrics.scrollWidth <= width, width + ": build 200% horizontal overflow " + JSON.stringify(buildMetrics));
  assert(buildMetrics.clipped.length === 0, width + ": build 200% clipped controls " + JSON.stringify(buildMetrics.clipped));
  assert(buildMetrics.minHeight >= 44, width + ": target below 44 at 200%");
  assert(runtimeErrors.length === 0, width + ": runtime errors");
  results.tests["a11y_" + width] = { result: "PASS", canvasName: name, liveAfterMove, liveAfterCursor, roamMetrics, buildMetrics };
  await context.close();
}

async function saveReload() {
  const { context, page } = await openGame(390, 844);
  await collectInitial(page);
  let s = await getState(page);
  assert(s.inventory.wood === 24, "save setup failed");
  await page.reload();
  assert(!(await page.locator("#continue-btn").isDisabled()), "continue disabled after reload");
  await page.locator("#continue-btn").click();
  s = await getState(page);
  assert(s.inventory.wood === 24 && s.player.y === 6, "save/reload state mismatch");
  results.tests.save_reload = { result: "PASS", inventory: s.inventory, player: s.player };
  await context.close();
}

const source = await readFile(GAME_JS, "utf8");
assert(!source.includes('drawText(`C${x - 2}`'), "A11Y-03 C1-C5 canvas microtext still rendered");
assert(!source.includes('drawText(`B z${p.z}`'), "A11Y-03 block z canvas microtext still rendered");
results.tests.a11y_03_policy = { result: "PASS", canvasMicrotext: "removed", coordinateInfo: "DOM #cell-desc + #game-live" };

try {
  await routeA();
  await routeB();
  await reflowAndA11y(320, 720);
  await reflowAndA11y(390, 844);
  await reflowAndA11y(1440, 900);
  await saveReload();
  results.result = "PASS";
} finally {
  await browser.close();
}
await writeFile(QA_OUT, JSON.stringify(results, null, 2) + "\n", "utf8");
console.log("BROWSER_QA_PASS", JSON.stringify(results.tests));
