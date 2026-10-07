import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.DETECTIVE_BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.DETECTIVE_ARTIFACTS || 'artifacts/detective-game-first';
await fs.mkdir(out, { recursive: true });

const cases = [
  { name: 'es-1440', url: '/es/creacion/detective/', width: 1440, height: 1000, touch: false },
  { name: 'es-390', url: '/es/creacion/detective/', width: 390, height: 844, touch: true },
  { name: 'es-320', url: '/es/creacion/detective/', width: 320, height: 760, touch: true },
  { name: 'en-1440', url: '/en/creation/detective/', width: 1440, height: 1000, touch: false },
  { name: 'en-390', url: '/en/creation/detective/', width: 390, height: 844, touch: true },
  { name: 'en-320', url: '/en/creation/detective/', width: 320, height: 760, touch: true }
];

const browser = await chromium.launch({ headless: true });
const report = [];

for (const tc of cases) {
  const context = await browser.newContext({
    viewport: { width: tc.width, height: tc.height },
    hasTouch: tc.touch,
    recordVideo: { dir: path.join(out, 'video'), size: { width: tc.width, height: tc.height } },
    reducedMotion: 'no-preference'
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto(baseURL + tc.url, { waitUntil: 'networkidle' });
  await page.locator('#detective-game canvas').waitFor({ state: 'visible' });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  const minButton = await page.locator('button').evaluateAll(btns => Math.min(...btns.map(b => b.getBoundingClientRect().height)));

  await page.locator('[data-pick="light"]').click();
  await page.locator('[data-level="2"]').click();
  await page.locator('[data-hypothesis="depends"]').click();
  await page.locator('#dg-try').click();

  const bodyNow = Number(await page.locator('#dg-body').evaluate(el => el.parentElement.getAttribute('aria-valuenow')));
  const breathNow = Number(await page.locator('#dg-breath').evaluate(el => el.parentElement.getAttribute('aria-valuenow')));
  const attentionNow = Number(await page.locator('#dg-attention').evaluate(el => el.parentElement.getAttribute('aria-valuenow')));
  if ([bodyNow, breathNow, attentionNow].every(v => v === 50)) throw new Error(tc.name + ': consequence meters did not change');

  await page.locator('#dg-undo').click();
  const mediumPressed = await page.locator('[data-level="1"]').getAttribute('aria-pressed');
  if (mediumPressed !== 'true') throw new Error(tc.name + ': undo did not restore previous level');

  await page.locator('#detective-game canvas').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('+');
  await page.locator('#dg-motion').click();
  await page.locator('#dg-motion').click();
  await page.locator('#dg-motion').click();

  if (tc.touch) {
    await page.locator('[data-pick="sound"]').tap();
    if (await page.locator('[data-pick="sound"]').getAttribute('aria-pressed') !== 'true') throw new Error(tc.name + ': touch selection failed');
  }

  await page.screenshot({ path: path.join(out, tc.name + '.png'), fullPage: true });

  report.push({
    case: tc.name,
    overflow,
    minButton,
    meters: { body: bodyNow, breath: breathNow, attention: attentionNow },
    errors
  });

  await context.close();
}

const reduced = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: 'reduce'
});
const reducedPage = await reduced.newPage();
await reducedPage.goto(baseURL + '/es/creacion/detective/', { waitUntil: 'networkidle' });
const reducedLabel = await reducedPage.locator('#dg-motion').textContent();
if (!/reducido/i.test(reducedLabel || '')) throw new Error('prefers-reduced-motion did not start in REDUCED');
await reduced.close();

await browser.close();

const failed = report.filter(r => r.overflow || r.minButton < 44 || r.errors.length);
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), baseURL, report, failed }, null, 2));
if (failed.length) {
  console.error(JSON.stringify(failed, null, 2));
  process.exit(1);
}
console.log('DETECTIVE_GAME_FIRST_E2E_PASS');
