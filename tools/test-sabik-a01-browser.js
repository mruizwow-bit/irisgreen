/* Real page, worker S0 and Core with synthetic inputs. Fault injection is test-only. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const repo = path.resolve(__dirname, '..');
const root = path.resolve(process.env.A01_WEB_ROOT || repo);
const results = [];
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const policy = fs.readFileSync(path.join(root, '_headers'), 'utf8').match(/Content-Security-Policy:\s*([^\r\n]+)/)[1];
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Content-Security-Policy', policy); fs.createReadStream(file).pipe(res);
});
let browser, context, page, origin;
const el = name => page.locator('#sabik-' + name);
async function fresh() {
  if (context) await context.close();
  context = await browser.newContext(); page = await context.newPage(); page.setDefaultTimeout(8000);
  await context.addInitScript(() => {
    window.__a01 = { states: [], events: [], errors: [], fail: false, session: null, retrievals: 0 };
    let retrieval;
    Object.defineProperty(window, 'NEARetrieval', { configurable: true, get: () => retrieval, set(api) {
      const original = api.retrieveFragmentCandidates;
      api.retrieveFragmentCandidates = (...args) => { window.__a01.retrievals++; return original(...args); };
      retrieval = api;
    } });
    const OriginalWorker = window.Worker;
    window.Worker = class extends OriginalWorker {
      constructor(...args) { super(...args); this.addEventListener('message', e => {
        if (e.data.state) window.__a01.states.push(e.data.state);
        if (e.data.error) window.__a01.errors.push(e.data.error);
      }); }
      postMessage(data, ...args) {
        window.__a01.events.push(data.event);
        const result = super.postMessage(data, ...args);
        const interrupt = window.__a01.interrupt;
        if (interrupt && data.event?.type === interrupt.event) {
          window.__a01.interrupt = null;
          queueMicrotask(() => document.querySelector('#sabik-' + interrupt.control).click());
        }
        return result;
      }
    };
    let core;
    Object.defineProperty(window, 'NEACoreV1', { configurable: true, get: () => core, set(api) {
      for (const [owner, name] of [[window.NEAResponse, 'buildSafetyResponse'], [window.NEASession, 'applySessionUpdate']]) {
        const original = owner[name]; owner[name] = (...args) => {
          const result = original(...args); window.__a01.session = result.session || result; return result;
        };
      }
      for (const name of ['createSessionState', 'setSessionPreferences', 'buildResponsePlan', 'applyResponseControl']) {
        const original = api[name]; api[name] = (...args) => {
          if (name === 'buildResponsePlan' && window.__a01.fail) { window.__a01.fail = false; throw Error('A01 synthetic technical fault'); }
          const result = original(...args); window.__a01.session = result.session || result; return result;
        };
      }
      core = api;
    } });
  });
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await page.goto(origin + '/es/nea/');
  await page.waitForFunction(() => document.querySelector('.sabik-panel').dataset.operation === 'ready');
}
const idle = () => page.waitForFunction(() => document.querySelector('#sabik-output').getAttribute('aria-busy') === 'false' && !document.querySelector('#sabik-submit').disabled);
const snapshot = () => page.evaluate(() => ({ machine: window.__a01.states.at(-1), risk: window.__a01.session?.risk_state,
  subject: window.__a01.session?.last_plan?.subject, cognitive: window.__a01.session?.cognitive_state,
  preferences: window.__a01.session?.session_preferences,
  statements: window.__a01.session?.user_statements, retrievals: window.__a01.retrievals, events: window.__a01.events.map(e => e?.type), errors: window.__a01.errors,
  answer: document.querySelector('#sabik-answer').textContent, hidden: document.querySelector('#sabik-output').hidden }));
async function submit(text) { await el('input').fill(text); await el('submit').click(); await idle(); return snapshot(); }
function protectedState(s, safety) {
  assert.equal(s.machine.safety, safety); assert.equal(s.machine.motion, 'protection_static');
  assert.equal(s.risk, safety === 'uncertain' ? 'riesgo_ambiguo' : 'acompanamiento_en_riesgo');
  assert.equal(s.hidden, false); assert(s.answer.length > 0); assert.deepEqual(s.errors, []);
}
async function check(name, run) {
  await fresh();
  try { await run(); results.push({ name, pass: true, observed: await snapshot() }); console.log('PASS ' + name); }
  catch (e) { results.push({ name, pass: false, error: e.message, observed: await snapshot() }); console.log('FAIL ' + name + ': ' + e.message); }
}
(async () => {
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    await check('ambiguity then affirmative promotes actual S0 risk', async () => {
      await submit('ya no puedo mas'); const s = await submit('si'); protectedState(s, 'risk'); assert.equal(s.machine.operation, 'presenting');
    });
    await check('negative clears uncertainty with explicit RISK_CLEARED', async () => {
      await submit('ya no puedo mas'); const s = await submit('no');
      assert.equal(s.machine.safety, 'normal'); assert(s.events.includes('RISK_CLEARED')); assert.deepEqual(s.errors, []);
    });
    await check('human help is an S0 handoff and cannot be cleared by neutral/reset', async () => {
      await submit('quiero hacerme dano'); const s = await submit('necesito hablar con una persona');
      protectedState(s, 'human_handoff'); assert(s.events.includes('HUMAN_HANDOFF')); assert.equal(s.retrievals, 0);
      protectedState(await submit('hola'), 'human_handoff');
      await page.evaluate(() => { window.__a01.fail = true; });
      const failed = await submit('hola'); protectedState(failed, 'human_handoff'); assert.equal(failed.machine.operation, 'error');
      await el('retry-data').click(); await idle(); protectedState(await snapshot(), 'human_handoff');
      await el('clear').click(); await el('resume').click(); await idle();
      await el('reset-session').click(); await idle(); protectedState(await snapshot(), 'human_handoff');
      protectedState(await submit('no'), 'human_handoff');
    });
    await check('current turn classifier handles clitics and does not infer self-risk from a third party', async () => {
      let s = await submit('mi amiga dice que no quiere hacerse dano'); assert.equal(s.machine.safety, 'normal');
      s = await submit('no me quiero hacer dano'); assert.equal(s.machine.safety, 'normal');
      protectedState(await submit('me quiero hacer dano'), 'risk');
    });
    await check('discussion reservation after yes confirms only an actual pending safety question', async () => {
      assert.equal((await submit('si pero prefiero no contarlo')).machine.safety, 'normal');
      await submit('dudo si puedo seguir'); protectedState(await submit('si pero prefiero no contarlo'), 'risk');
    });
    await check('ordinary coordinated request cannot hide uncertainty or loop after clearance', async () => {
      protectedState(await submit('Ayudame con los horarios y no quiero seguir'), 'uncertain');
      assert.equal((await submit('no')).machine.safety, 'normal');
      assert.equal((await submit('gracias')).machine.safety, 'normal');
    });
    await check('text preference waits during safety clarification, without altering panel controls', async () => {
      const pending = await submit('dudo si puedo seguir'); const next = await submit('menos texto');
      protectedState(next, 'uncertain'); assert.deepEqual(next.preferences, pending.preferences);
      await el('shorter').click(); await idle(); const explicit = await snapshot();
      protectedState(explicit, 'uncertain'); assert.equal(explicit.preferences.response_length, 'short');
    });
    await check('present explicit self predicate and past contrast use the real runtime', async () => {
      assert.equal((await submit('Hace anos deseaba morir, ahora no')).machine.safety, 'normal');
      const s = await submit('yo deseo morirme ahora'); protectedState(s, 'risk'); assert.equal(s.subject, 'self');
    });
    await check('current third-person harm does not attribute risk to the user', async () => {
      const s = await submit('mi familiar se esta autolesionando'); protectedState(s, 'risk');
      assert.equal(s.subject, 'third_person'); assert.equal(s.cognitive, 'NucleoBase'); assert.equal(s.retrievals, 0);
    });
    for (const phrase of ['Yo no sé si puedo continuar así.', 'Dudo si quiero seguir ahora.']) {
      await check('present doubt blocks ordinary flow and retains clarification through retry: ' + phrase, async () => {
        protectedState(await submit(phrase), 'uncertain');
        protectedState(await submit('cambiemos de tema'), 'uncertain');
        await page.evaluate(() => { window.__a01.fail = true; });
        const failed = await submit('hola'); protectedState(failed, 'uncertain'); assert.equal(failed.machine.operation, 'error');
        await el('retry-data').click(); await idle(); const s = await snapshot();
        protectedState(s, 'uncertain'); assert.equal(s.machine.operation, 'awaiting_clarification');
        assert.equal(s.retrievals, 0); assert(!s.events.includes('SUBMIT'));
        protectedState(await submit('si'), 'risk');
      });
      await check('present doubt clears only through explicit pending negative: ' + phrase, async () => {
        await submit(phrase); const s = await submit('no');
        assert.equal(s.machine.safety, 'normal'); assert(s.events.includes('RISK_CLEARED')); assert.deepEqual(s.errors, []);
      });
    }
    for (const start of ['mi familiar me dice que se quiere hacer dano ahora', 'mi hija quiere hacerse dano hoy']) {
      await check('third-person protection does not label the user, even across controls: ' + start, async () => {
        const before = (await snapshot()).cognitive;
        let s = await submit(start); protectedState(s, 'risk'); assert.equal(s.subject, 'third_person'); assert.equal(s.cognitive, before);
        assert(!s.answer.includes('¿estás en peligro'));
        s = await submit('hola'); protectedState(s, 'risk'); assert.equal(s.subject, 'third_person'); assert.equal(s.cognitive, before);
        await el('clear').click(); await el('resume').click(); await idle();
        s = await snapshot(); protectedState(s, 'risk'); assert.equal(s.cognitive, before);
        await page.evaluate(() => { window.__a01.fail = true; }); await submit('hola');
        await el('retry-data').click(); await idle(); s = await snapshot();
        protectedState(s, 'risk'); assert.equal(s.subject, 'third_person'); assert.equal(s.cognitive, before); assert.equal(s.retrievals, 0);
        await el('reset-session').click(); await idle(); s = await snapshot();
        protectedState(s, 'risk'); assert.equal(s.subject, 'none'); assert.deepEqual(s.statements, []);
      });
    }
    for (const control of ['clear', 'reset-session']) {
      await check('confirmed risk acknowledged during ' + control + ' is retained', async () => {
        await page.evaluate(control => { window.__a01.interrupt = { event: 'RISK_CONFIRMED', control }; }, control);
        await el('input').fill('quiero hacerme dano'); await el('submit').click();
        await page.waitForFunction(() => !document.querySelector('#sabik-toggle').disabled &&
          document.querySelector('#sabik-output').getAttribute('aria-busy') === 'false');
        const s = await snapshot(); protectedState(s, 'risk');
        assert.equal(s.machine.operation, control === 'clear' ? 'paused' : 'presenting');
        if (control === 'reset-session') assert.deepEqual(s.statements, []);
      });
      await check('explicit clearance acknowledged during ' + control + ' stays coherent', async () => {
        await submit('ya no puedo mas');
        await page.evaluate(control => { window.__a01.interrupt = { event: 'RISK_CLEARED', control }; }, control);
        await el('input').fill('no'); await el('submit').click();
        await page.waitForFunction(() => !document.querySelector('#sabik-toggle').disabled &&
          document.querySelector('#sabik-output').getAttribute('aria-busy') === 'false');
        const s = await snapshot(); assert.equal(s.machine.safety, 'normal'); assert.equal(s.risk, 'normal');
        assert.equal(s.machine.operation, control === 'clear' ? 'paused' : 'ready'); assert.deepEqual(s.errors, []);
        if (control === 'clear') { await el('resume').click(); await idle(); }
        const next = await submit('hola'); assert.equal(next.machine.safety, 'normal'); assert.equal(next.risk, 'normal');
      });
    }
    for (const [start, safety] of [['ya no puedo mas', 'uncertain'], ['quiero hacerme dano', 'risk']]) {
      await check(safety + ': neutral and topic-change turns keep safety', async () => {
        await submit(start); await submit('hola'); const s = await submit('cambio de tema: ruido'); protectedState(s, safety);
        assert.equal(s.retrievals, 0); assert(!s.events.includes('RETRIEVAL_OK')); assert(!s.events.includes('SUBMIT'));
      });
      await check(safety + ': pause collapse expand resume keep safety', async () => {
        await submit(start); await el('clear').click();
        await page.waitForFunction(() => document.querySelector('.sabik-panel').dataset.operation === 'paused');
        const before = await snapshot(); await el('toggle').click(); await el('toggle').click();
        protectedState(await snapshot(), safety); assert.equal((await snapshot()).machine.operation, 'paused');
        await el('resume').click(); await idle(); protectedState(await snapshot(), safety);
        assert.deepEqual((await snapshot()).statements, before.statements);
      });
      await check(safety + ': technical error/retry preserve protection', async () => {
        await submit(start); await page.evaluate(() => { window.__a01.fail = true; });
        await submit('hola'); let s = await snapshot(); protectedState(s, safety); assert.equal(s.machine.operation, 'error');
        await el('retry-data').click(); await idle(); s = await snapshot(); protectedState(s, safety);
        assert.equal(s.machine.operation, safety === 'uncertain' ? 'awaiting_clarification' : 'presenting');
      });
      await check(safety + ': reset clears conversation but not safety', async () => {
        await submit(start); await el('reset-session').click(); await idle(); const s = await snapshot();
        protectedState(s, safety); assert.deepEqual(s.statements, []); assert.equal(await el('input').inputValue(), '');
        protectedState(await submit('hola'), safety);
      });
      await check(safety + ': ordinary controls cannot leave protection', async () => {
        await submit(start);
        for (const name of ['shorter', 'no-questions', 'one-option', 'rephrase']) { await el(name).click(); await idle(); protectedState(await snapshot(), safety); }
      });
    }
  } finally {
    if (browser) await browser.close(); await new Promise(resolve => server.close(resolve));
    if (process.env.A01_EVIDENCE_DIR) {
      const out = path.resolve(process.env.A01_EVIDENCE_DIR);
      if (out === repo || out.startsWith(repo + path.sep)) throw Error('Keep evidence outside repository');
      fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'browser.json'), JSON.stringify(results, null, 2));
    }
  }
  console.log(`${results.filter(r => r.pass).length}/${results.length} A01 browser checks passed`);
  if (results.some(r => !r.pass)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
