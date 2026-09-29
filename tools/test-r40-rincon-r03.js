/* R40 filename retained because the A2 workflow calls this path.
   Contract updated 2026-09-29 after R63 Sakura superseded the R40 public UI.
   This gate validates the current R46/R53/R63 product instead of requiring
   nine obsolete data-scene cards from the historical R40 interface. */
const fs = require('node:fs');
const assert = require('node:assert/strict');

function read(path){ return fs.readFileSync(path, 'utf8'); }

const es = read('es/sitio-tranquilo/index.html');
const en = read('en/quiet-space/index.html');
const ctl = read('assets/rincon-r46.js');
const css = read('assets/rincon-r46.css');
const stage = read('assets/rincon-r53-stage.js');
const sakura = read('assets/rincon-r63-sala-sakura.js');

for (const [lang, h] of [['ES', es], ['EN', en]]) {
  const modes = [...h.matchAll(/data-r46-mode="([^"]+)"/g)].map(x => x[1]);
  assert.deepEqual(modes, ['breathe', 'land', 'room'], lang + ' current R46 modes');
  assert.equal(new Set(modes).size, 3, lang + ' unique current modes');

  [
    'r46ModeSelect',
    'r46Breathe', 'r46BreatheStage', 'r46BreathStart', 'r46BreathStop',
    'r46Landscapes', 'r46LandStage', 'r46LandStart', 'r46LandStop',
    'r46Rooms', 'r46RoomStage', 'r46RoomMotion', 'r46RoomLevel',
    'r46RoomStart', 'r46RoomStop', 'r46RoomStatus', 'r46ExitClean'
  ].forEach(id => assert.ok(h.includes('id="' + id + '"'), lang + ' current control ' + id));

  [
    '/assets/rincon-r46-breath.js',
    '/assets/rincon-r46-landscapes.js',
    '/assets/rincon-r53-stage.js',
    '/assets/rincon-r63-sala-sakura.js',
    '/assets/rincon-r46.js'
  ].forEach(src => assert.ok(h.includes(src), lang + ' runtime ' + src));

  assert.ok(!/<(?:audio|video)\b[^>]*\bautoplay\b/i.test(h), lang + ' no media autoplay attribute');
  assert.ok(!h.includes('/audio/rincon/'), lang + ' no historical HOLD recording path');
}

/* R42 #303 regressions must remain closed. */
assert.ok(
  css.includes('.r46-actions [hidden] { display: none !important; }') &&
  css.includes('.r46-panel[hidden] { display: none !important; }'),
  'hidden controls are really outside render'
);
assert.ok(ctl.includes('function setBodyClass(name, on)'), 'idempotent body-class helper');
assert.ok(ctl.includes("var has = document.body.classList.contains(name)"), 'idempotent class state read');
assert.ok(ctl.includes("setBodyClass('r46-clean', true)"), 'clean mode enters through helper');
assert.ok(ctl.includes("setBodyClass('r46-clean', false)"), 'clean mode exits through helper');

/* R63 accepted room progressive-enhancement and motion contract. */
assert.ok(stage.includes("var MOTION = ['normal', 'reducido', 'quieto']"), 'three real motion states');
assert.ok(stage.includes("ctx.motion === 'normal' ? 1 : (ctx.motion === 'reducido' ? 0.34 : 0)"), 'motion speed contract');
assert.ok(stage.includes("ctx.motion === 'normal' ? 1 : (ctx.motion === 'reducido' ? 0.22 : 0)"), 'motion drift contract');
assert.ok(stage.includes("if (!built && room.still) { tier = 'D'; built = true; }"), 'static tier D exists');

/* REDUCIDO must be structural, not only a speed multiplier. */
assert.ok(sakura.includes('var PETALOS_NORMAL = 170'), 'Sakura normal petal population');
assert.ok(sakura.includes('var PETALOS_REDUCIDO = 64'), 'Sakura reduced petal population');
assert.ok(
  sakura.includes("ctx.motion === 'normal' ? 1.0 : 0.0"),
  'Sakura removes cove breathing outside NORMAL'
);

/* Sakura must remain local/first-party. Global Google Fonts is a separate
   R67 shell blocker and is intentionally not converted into a Sakura PASS. */
assert.ok(!/https?:\/\//i.test(sakura), 'Sakura runtime has no external URL');

console.log('R63_RINCON_CURRENT_STATIC_PASS');
if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(es + en)) {
  console.log('R63_GLOBAL_FONT_REQUEST_PENDING_R67');
}
