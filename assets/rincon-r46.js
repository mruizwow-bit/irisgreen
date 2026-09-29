/* R46-CLAUDE · Rincon tranquilo · controlador de los tres modos.
   Respirar · Paisajes · Inmersivo. Nada empieza hasta que la persona lo decide.
   Sin cuenta, sin telemetria, sin analitica, sin almacenamiento propio. */
(function (window, document) {
  'use strict';

  var root = document.querySelector('.r46');
  if (!root) return;

  var EN = String(document.documentElement.lang || 'es').toLowerCase().indexOf('en') === 0;
  var L = EN ? 'en' : 'es';

  var T = EN ? {
    entry: 'Choose how you want to be here. Nothing starts until you decide.',
    breathCopy: 'Watch the ball, or breathe with it if that feels comfortable.',
    modes: { breathe: 'Breathe', land: 'Landscapes', room: 'Immersive rooms' },
    start: 'Start', pause: 'Pause', resume: 'Resume', stop: 'Stop', clean: 'Clean screen',
    exitClean: 'Leave clean screen',
    how: 'How', justLook: 'Just watch', p46: 'In 4, out 6', p66: 'In 6, out 6',
    howLong: 'How long', free: 'No end', min1: '1 minute', min3: '3 minutes', min5: '5 minutes',
    intensity: 'Intensity', soft: 'Gentle', normal: 'Normal',
    place: 'Place', session: 'Session',
    cont: 'Continuous', m10: '10 minutes', m20: '20 minutes', m30: '30 minutes', m60: '60 minutes',
    sound: 'Iris Green sound', soundOff: 'No sound', soundOn: 'Add Iris Green sound',
    volume: 'Volume',
    soundNote: 'The video always plays silently. This sound is made by Iris Green and is separate.',
    room: 'Room', ripple: 'Slow ripple', movement: 'Movement',
    mNormal: 'Normal', mReduced: 'Reduced', mStill: 'No movement',
    mFollows: 'Following your system setting.',
    roomSound: 'Iris Green sound', noSound: 'This room has no matching Iris Green sound, so it stays silent.',
    rippleBtn: 'Send a slow ripple',
    ready: 'Ready when you are.',
    inhale: 'Breathe in slowly', exhale: 'Let the air out slowly', watching: 'Just watch.',
    running: 'Playing.', stopped: 'Stopped.',
    unavailable: 'This video is not available right now. Choose another place.',
    savedata: 'Your device is set to save data, so the video will not load. You can still use Breathe and the rooms.',
    noWebgl: 'This device cannot draw the rooms. Breathe and Landscapes still work.',
    engine: 'Drawing engine'
  } : {
    entry: 'Elige una forma de estar aquí. Nada empieza hasta que tú lo decidas.',
    breathCopy: 'Mira la bola o respira con ella si te resulta cómodo.',
    modes: { breathe: 'Respirar', land: 'Paisajes', room: 'Salas inmersivas' },
    start: 'Empezar', pause: 'Pausar', resume: 'Reanudar', stop: 'Parar', clean: 'Pantalla limpia',
    exitClean: 'Salir de pantalla limpia',
    how: 'Cómo', justLook: 'Solo mirar', p46: '4 dentro, 6 fuera', p66: '6 dentro, 6 fuera',
    howLong: 'Cuánto rato', free: 'Sin final', min1: '1 minuto', min3: '3 minutos', min5: '5 minutos',
    intensity: 'Intensidad', soft: 'Suave', normal: 'Normal',
    place: 'Sitio', session: 'Sesión',
    cont: 'Continuo', m10: '10 minutos', m20: '20 minutos', m30: '30 minutos', m60: '60 minutos',
    sound: 'Sonido de Iris Green', soundOff: 'Sin sonido', soundOn: 'Añadir sonido de Iris Green',
    volume: 'Volumen',
    soundNote: 'El vídeo va siempre en silencio. Este sonido lo crea Iris Green y va aparte.',
    room: 'Sala', ripple: 'Onda lenta', movement: 'Movimiento',
    mNormal: 'Normal', mReduced: 'Reducido', mStill: 'Sin movimiento',
    mFollows: 'Sigue el ajuste de tu sistema.',
    roomSound: 'Sonido de Iris Green', noSound: 'Esta sala no tiene un sonido de Iris Green que le corresponda, así que va en silencio.',
    rippleBtn: 'Enviar una onda lenta',
    ready: 'Preparado cuando tú quieras.',
    inhale: 'Toma aire despacio', exhale: 'Suelta el aire despacio', watching: 'Solo mirar.',
    running: 'En marcha.', stopped: 'Parado.',
    unavailable: 'Este vídeo no está disponible ahora mismo. Elige otro sitio.',
    savedata: 'Tu dispositivo está en modo de ahorro de datos, así que el vídeo no se carga. Respirar y las salas siguen funcionando.',
    noWebgl: 'Este dispositivo no puede dibujar las salas. Respirar y Paisajes siguen funcionando.',
    engine: 'Motor de dibujo'
  };

  function $(s, c) { return (c || root).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); }

  /* #303 · mutacion idempotente: no se toca la clase si ya esta como debe,
     asi el MutationObserver del chrome no entra en bucle. */
  function setBodyClass(name, on) {
    var has = document.body.classList.contains(name);
    if (on && !has) document.body.classList.add(name);
    else if (!on && has) document.body.classList.remove(name);
  }

  var panels = {
    breathe: $('#r46Breathe'),
    land: $('#r46Landscapes'),
    room: $('#r46Rooms')
  };
  var stages = {
    breathe: $('#r46BreatheStage'),
    land: $('#r46LandStage'),
    room: $('#r46RoomStage')
  };
  var tabs = $$('[data-r46-mode]');
  var select = $('#r46ModeSelect');
  var statusEls = {
    breathe: $('#r46BreatheStatus'),
    land: $('#r46LandStatus'),
    room: $('#r46RoomStatus')
  };

  var mode = 'breathe';
  var breath = null, land = null, rooms = null;
  var roomFollowsBreath = false;

  function say(k, msg) { if (statusEls[k]) statusEls[k].textContent = msg; }

  function isNarrow() {
    try { return window.matchMedia('(max-width: 820px)').matches; } catch (e) { return window.innerWidth < 820; }
  }

  /* ------------------------------------------------------------ Respirar */
  function ensureBreath() {
    if (breath || !window.IGBola46 || !stages.breathe) return Promise.resolve(breath);
    breath = window.IGBola46.create(stages.breathe, {
      pattern: 'watch',
      level: $('#r46BreathLevel') && $('#r46BreathLevel').value === 'normal' ? 'normal' : 'suave'
    });
    return breath.ready().then(function () {
      var note = $('#r46BreathEngine');
      if (note) note.textContent = T.engine + ': ' + breath.label;
      breath.on('phase', function (d) {
        if (d.phase === 'in') say('breathe', T.inhale);
        else if (d.phase === 'out') say('breathe', T.exhale);
        else say('breathe', T.watching);
      });
      breath.on('end', function () {
        say('breathe', T.ready);
        syncBreathButtons(false, false);
      });
      breath.on('tick', function (d) {
        if (roomFollowsBreath && rooms) rooms.setBreath(d.value);
      });
      breath.on('motion', function (d) { syncBreathMotion(d.motion, d.explicit); });
      syncBreathMotion(breath.getMotion(), !breath.followsSystem());
      return breath;
    });
  }

  function syncBreathMotion(m, explicit) {
    var sel = $('#r46BreathMotion');
    if (sel && sel.value !== m) sel.value = m;
    var note = $('#r46BreathMotionNote');
    if (note) note.textContent = explicit ? '' : T.mFollows;
  }

  function syncBreathButtons(running, paused) {
    var b = { start: $('#r46BreathStart'), pause: $('#r46BreathPause'), resume: $('#r46BreathResume'), stop: $('#r46BreathStop') };
    if (!b.start) return;
    b.start.hidden = running;
    b.pause.hidden = !running || paused;
    b.resume.hidden = !running || !paused;
    b.stop.disabled = !running;
  }

  /* ------------------------------------------------------------ Paisajes */
  function ensureLand() {
    if (land || !window.IGPaisajes46 || !stages.land) return land;
    land = window.IGPaisajes46.create(stages.land, { lang: L });
    land.mount();
    land.on('unavailable', function () { say('land', T.unavailable); syncLandButtons(false); });
    land.on('savedata', function () { say('land', T.savedata); syncLandButtons(false); });
    land.on('ready', function () { say('land', T.running); });
    land.on('stop', function () { say('land', T.stopped); syncLandButtons(false); });
    return land;
  }
  function syncLandButtons(running) {
    var s = $('#r46LandStart'), t = $('#r46LandStop');
    if (s) s.hidden = running;
    if (t) t.disabled = !running;
  }
  function currentScene() {
    var b = $$('[data-r46-scene][aria-pressed="true"]')[0];
    return b ? b.getAttribute('data-r46-scene') : 'playa';
  }
  function currentLandDuration() {
    var sel = $('#r46LandDuration');
    return sel ? parseInt(sel.value, 10) || 0 : 0;
  }

  /* ----------------------------------------------------------- Inmersivo */
  var roomSound = null;

  function ensureRooms() {
    if (rooms || !window.IGSalaStage || !stages.room) return rooms;
    rooms = window.IGSalaStage.create(stages.room, {
      level: $('#r46RoomLevel') && $('#r46RoomLevel').value === 'normal' ? 'normal' : 'suave'
    });
    rooms.on('motion', function (d) { syncMotion(d.motion, d.explicit); });
    rooms.on('room', function (d) { syncRoomSound(d.audio); });
    syncMotion(rooms.motion(), !rooms.followsSystem());
    return rooms;
  }
  function currentRoom() {
    var b = $$('[data-r46-room][aria-pressed="true"]')[0];
    return b ? b.getAttribute('data-r46-room') : 'globos';
  }
  function syncMotion(m, explicit) {
    var sel = $('#r46RoomMotion');
    if (sel && sel.value !== m) sel.value = m;
    var note = $('#r46MotionNote');
    if (note) note.textContent = explicit ? '' : T.mFollows;
  }
  /* El sonido de una sala solo existe si hay un ambiente que le corresponde.
     Cuando no lo hay, la sala va en silencio y se dice, sin inventar pareja. */
  function stopRoomSound(fade) {
    if (roomSound) { try { roomSound.stop(fade == null ? 2.2 : fade); } catch (_) {} roomSound = null; }
  }
  function syncRoomSound(audioId) {
    var box = $('#r46RoomSoundBox'), chk = $('#r46RoomSound'), note = $('#r46RoomSoundNote');
    var has = !!audioId && !!(window.IGSonidos && window.IGSonidos.supported);
    if (chk) { chk.disabled = !has; if (!has) chk.checked = false; }
    if (box) box.setAttribute('data-available', has ? 'true' : 'false');
    if (note) note.textContent = has ? '' : T.noSound;
    if (!has) stopRoomSound(0.6);
    else if (chk && chk.checked) playRoomSound();
  }
  function playRoomSound() {
    var r = ensureRooms(); if (!r) return;
    var cur = r.room && r.room(); var id = cur && cur.audio;
    if (!id || !window.IGSonidos || !window.IGSonidos.supported) return;
    stopRoomSound(0.5);
    var vol = $('#r46RoomVolume');
    roomSound = window.IGSonidos.start(id, vol ? (parseInt(vol.value, 10) || 16) / 100 : 0.16, 2.4);
  }

  /* -------------------------------------------------------------- modos */
  function releaseAll(except) {
    if (except !== 'breathe' && breath) breath.stop();
    if (except !== 'land' && land) land.stop();
    if (except !== 'room' && rooms) { rooms.stop(); stopRoomSound(1.2); }
  }

  function setMode(next) {
    if (!panels[next]) return;
    mode = next;
    Object.keys(panels).forEach(function (k) {
      if (panels[k]) panels[k].hidden = k !== next;
    });
    tabs.forEach(function (b) {
      var on = b.getAttribute('data-r46-mode') === next;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    if (select && select.value !== next) select.value = next;
    releaseAll(next);
    if (next === 'breathe') ensureBreath();
    if (next === 'land') ensureLand();
    if (next === 'room') { ensureRooms(); if (rooms) rooms.resize(); }
  }

  /* ------------------------------------------------------- pantalla limpia */
  function enterClean() {
    setBodyClass('r46-clean', true);
    window.scrollTo(0, 0);
    window.setTimeout(function () {
      if (breath) breath.resize();
      if (rooms) rooms.resize();
      var exit = $('#r46ExitClean');
      if (exit) exit.focus();
    }, 60);
  }
  function exitClean() {
    setBodyClass('r46-clean', false);
    window.setTimeout(function () {
      if (breath) breath.resize();
      if (rooms) rooms.resize();
    }, 60);
  }

  /* ---------------------------------------------------------------- init */
  tabs.forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.getAttribute('data-r46-mode')); });
    b.addEventListener('keydown', function (ev) {
      var i = tabs.indexOf(b), n = null;
      if (ev.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (ev.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { ev.preventDefault(); n.focus(); setMode(n.getAttribute('data-r46-mode')); }
    });
  });
  if (select) select.addEventListener('change', function () { setMode(select.value); });

  /* --- respirar --- */
  $$('[name="r46-pattern"]').forEach(function (r) {
    r.addEventListener('change', function () {
      if (r.checked) ensureBreath().then(function () { breath.setPattern(r.value); });
    });
  });
  var bDur = $('#r46BreathDuration');
  if (bDur) bDur.addEventListener('change', function () {
    ensureBreath().then(function () { breath.setDuration(parseInt(bDur.value, 10) || 0); });
  });
  var bMot = $('#r46BreathMotion');
  if (bMot) bMot.addEventListener('change', function () {
    ensureBreath().then(function () { breath.setMotion(bMot.value); });
  });
  var bLev = $('#r46BreathLevel');
  if (bLev) bLev.addEventListener('change', function () {
    ensureBreath().then(function () { breath.setLevel(bLev.value); });
  });
  var bStart = $('#r46BreathStart');
  if (bStart) bStart.addEventListener('click', function () {
    ensureBreath().then(function () {
      var p = $$('[name="r46-pattern"]').filter(function (x) { return x.checked; })[0];
      breath.setPattern(p ? p.value : 'watch');
      breath.setDuration(bDur ? parseInt(bDur.value, 10) || 0 : 0);
      breath.setLevel(bLev ? bLev.value : 'suave');
      breath.start();
      syncBreathButtons(true, false);
    });
  });
  var bPause = $('#r46BreathPause');
  if (bPause) bPause.addEventListener('click', function () { if (breath) { breath.pause(); syncBreathButtons(true, true); } });
  var bResume = $('#r46BreathResume');
  if (bResume) bResume.addEventListener('click', function () { if (breath) { breath.resume(); syncBreathButtons(true, false); } });
  var bStop = $('#r46BreathStop');
  if (bStop) bStop.addEventListener('click', function () { if (breath) breath.stop(); syncBreathButtons(false, false); });

  /* --- paisajes --- */
  $$('[data-r46-scene]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-r46-scene]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      ensureLand().preview(b.getAttribute('data-r46-scene'));
      say('land', '');
    });
  });
  var lStart = $('#r46LandStart');
  if (lStart) lStart.addEventListener('click', function () {
    var l = ensureLand();
    l.play(currentScene(), { duration: currentLandDuration() });
    syncLandButtons(true);
  });
  var lStop = $('#r46LandStop');
  if (lStop) lStop.addEventListener('click', function () { if (land) land.stop(); syncLandButtons(false); });
  var lDur = $('#r46LandDuration');
  if (lDur) lDur.addEventListener('change', function () { if (land) land.setDuration(currentLandDuration()); });
  var lSound = $('#r46LandSound');
  if (lSound) lSound.addEventListener('change', function () {
    var vol = $('#r46LandVolume');
    ensureLand().sound(lSound.checked, vol ? (parseInt(vol.value, 10) || 18) / 100 : 0.18);
  });
  var lVol = $('#r46LandVolume');
  if (lVol) lVol.addEventListener('input', function () {
    if (land) land.soundLevel((parseInt(lVol.value, 10) || 18) / 100);
  });

  /* --- inmersivo --- */
  $$('[data-r46-room]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-r46-room]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      var id = b.getAttribute('data-r46-room');
      roomFollowsBreath = id === 'respiracion';
      var r = ensureRooms();
      if (r) r.setRoom(id);
      if (roomFollowsBreath) ensureBreath();
    });
  });
  var rLev = $('#r46RoomLevel');
  if (rLev) rLev.addEventListener('change', function () { if (rooms) rooms.setLevel(rLev.value); });
  var rMot = $('#r46RoomMotion');
  if (rMot) rMot.addEventListener('change', function () { ensureRooms().setMotion(rMot.value); });
  var rSnd = $('#r46RoomSound');
  if (rSnd) rSnd.addEventListener('change', function () {
    if (rSnd.checked) playRoomSound(); else stopRoomSound();
  });
  var rVol = $('#r46RoomVolume');
  if (rVol) rVol.addEventListener('input', function () {
    if (roomSound && roomSound.setLevel) roomSound.setLevel((parseInt(rVol.value, 10) || 16) / 100);
  });
  var rStart = $('#r46RoomStart');
  if (rStart) rStart.addEventListener('click', function () {
    var r = ensureRooms();
    if (!r) return;
    r.setRoom(currentRoom()).start();
    say('room', r.motion() === 'quieto' ? T.stopped : T.running);
    rStart.hidden = true;
    var st = $('#r46RoomStop'); if (st) st.disabled = false;
    var chk = $('#r46RoomSound'); if (chk && chk.checked) playRoomSound();
  });
  var rStop = $('#r46RoomStop');
  if (rStop) rStop.addEventListener('click', function () {
    if (rooms) rooms.stop();
    stopRoomSound();
    say('room', T.stopped);
    if (rStart) rStart.hidden = false;
    rStop.disabled = true;
  });
  var rRipple = $('#r46RoomRipple');
  if (rRipple) rRipple.addEventListener('click', function () { if (rooms) rooms.pushAt(null); });
  if (stages.room) {
    stages.room.addEventListener('pointermove', function (ev) { if (rooms) rooms.pointerAt(ev.clientX, ev.clientY); });
    stages.room.addEventListener('pointerleave', function () { if (rooms) rooms.pointerOut(); });
    stages.room.addEventListener('pointerdown', function (ev) { if (rooms) rooms.pushAt(ev.clientX, ev.clientY); });
  }

  /* --- pantalla limpia --- */
  $$('[data-r46-clean]').forEach(function (b) { b.addEventListener('click', enterClean); });
  var exitBtn = $('#r46ExitClean');
  if (exitBtn) exitBtn.addEventListener('click', exitClean);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && document.body.classList.contains('r46-clean')) {
      ev.preventDefault(); exitClean();
    }
  });

  /* --- ventana --- */
  var rt = 0;
  window.addEventListener('resize', function () {
    window.clearTimeout(rt);
    rt = window.setTimeout(function () {
      if (breath) breath.resize();
      if (rooms) rooms.resize();
    }, 180);
  });
  window.addEventListener('pagehide', function () {
    if (breath) breath.stop();
    if (land) land.stop();
    if (rooms) rooms.stop();
    stopRoomSound(0.3);
  });

  setMode('breathe');
  say('breathe', T.ready);
  syncBreathButtons(false, false);
  syncLandButtons(false);

  window.IGRincon46 = {
    /* QA: congelar un fotograma concreto sin animar */
    freeze: function (t, v) {
      if (rooms) rooms.freeze(t == null ? 34 : t, v == null ? 0.7 : v);
      if (breath) { breath.pause(); breath.frame(t == null ? 7 : t, v == null ? 0.6 : v); }
      return true;
    },
    engines: function () {
      return {
        breath: breath ? { tier: breath.tier, label: breath.label } : null,
        rooms: rooms ? rooms.report() : null
      };
    },
    setMode: setMode,
    enterClean: enterClean,
    exitClean: exitClean,
    kind: 'R46_RINCON_CONTROLLER',
    lang: L
  };
})(window, document);
