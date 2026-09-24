/* Rincón tranquilo · mejoras de relajación.
   Nada empieza solo. No se guarda nada: ni localStorage, ni cookies, ni red. */
(function () {
  'use strict';
  var ES = (document.documentElement.lang || 'es').slice(0, 2) !== 'en';
  var T = ES ? {
    stopped: 'La forma se ha quedado quieta. Puedes seguir aquí.',
    grow: 'La forma crece.', shrink: 'La forma se encoge.',
    credit: 'Escena de Iris Green. Se mueve despacio y no usa internet.',
    aquarium: 'Acuario: peces de colores nadan despacio entre plantas y burbujas.',
    bubbles: 'Tubo de burbujas: burbujas que suben despacio por una columna de luz.',
    jellies: 'Medusas: medusas de luz que laten y suben despacio en agua oscura.',
    fibre: 'Fibra óptica: cientos de hilos de luz que caen del techo y cambian de color despacio.',
    sea: 'Mar: olas suaves que llegan a la orilla, con el sol bajo sobre el agua.',
    rain: 'Lluvia en la ventana: gotas que resbalan despacio por un cristal, con luces desenfocadas detrás.',
    river: 'Río en el bosque: agua que corre entre piedras, hierba que se mueve con el viento y hojas que caen.',
    night: 'Cielo nocturno: estrellas y una aurora que ondula despacio sobre un lago rodeado de pinos.',
    no3d: 'Esta escena necesita gráficos 3D y este navegador no los permite. Prueba con el acuario o el tubo de burbujas.',
    nofull: 'Este navegador no permite la pantalla completa aquí.',
    unavailable: 'no disponible'
  } : {
    stopped: 'The shape has stopped. You can stay here.',
    grow: 'The shape grows.', shrink: 'The shape shrinks.',
    credit: 'A scene made for this site. It moves slowly and uses no internet.',
    aquarium: 'Aquarium: coloured fish swim slowly among plants and bubbles.',
    bubbles: 'Bubble tube: bubbles rise slowly up a column of light.',
    jellies: 'Jellyfish: glowing jellyfish pulse and rise slowly in dark water.',
    fibre: 'Fibre optics: hundreds of strands of light fall from the ceiling and slowly change colour.',
    sea: 'Sea: gentle waves reach the shore, with the sun low over the water.',
    rain: 'Rain on the window: drops slide slowly down a pane of glass, with blurred lights behind.',
    river: 'Stream in the forest: water runs over stones, grass moves in the wind and leaves fall.',
    night: 'Night sky: stars and an aurora that ripples slowly over a lake ringed with pine trees.',
    no3d: 'This scene needs 3D graphics and this browser does not allow them. Try the aquarium or the bubble tube.',
    nofull: 'This browser does not allow full screen here.',
    unavailable: 'unavailable'
  };
  var $ = function (s) { return document.querySelector(s); };
  function reduced() {
    var sys = false;
    try { sys = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    return sys || document.body.classList.contains('rm');
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* --- Nunca dos fuentes de sonido distintas a la vez.
         La mezcla cuenta como una sola fuente. --- */
  var media = new Set(), mixRows = [];
  function mixOff(el) {
    mixRows.forEach(function (r) { if (r.el === el) { r.box.checked = false; r.range.disabled = true; } });
  }
  var nativePlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    var self = this, mix = !!(self.dataset && self.dataset.mix);
    media.forEach(function (m) {
      if (m === self || m.paused) return;
      if (mix && m.dataset.mix) return;
      m.pause();
      if (m.dataset.mix) mixOff(m);
    });
    media.add(self);
    if (window.__igSilence) window.__igSilence(mix ? 'mix' : 'file');
    return nativePlay.apply(this, arguments);
  };

  function ramp(el, to, ms, done) {
    var from = el.volume, t0 = performance.now();
    function step(now) {
      var k = Math.min(1, (now - t0) / ms);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    }
    requestAnimationFrame(step);
  }

  /* --- Escuchar: empieza bajito y sube poco a poco; al parar, baja --- */
  var audio = $('#audio');
  if (audio) {
    audio.addEventListener('play', function () { audio.volume = 0; ramp(audio, 0.5, 4000); });
    var stopA = $('#stopAudio');
    if (stopA) stopA.onclick = function () {
      if (audio.paused) { audio.currentTime = 0; return; }
      ramp(audio, 0, 1500, function () { audio.pause(); audio.currentTime = 0; });
    };
  }

  /* --- Mezclar sonidos --- */
  var SOUNDS = [
    ['/audio/rincon/lluvia-en-tienda.mp3', 'Lluvia en una tienda', 'Rain on a tent', 'enternalrainsounds'],
    ['/audio/rincon/lluvia-en-ventana.mp3', 'Lluvia en la ventana', 'Rain on the window', 'Eryliaa'],
    ['/audio/rincon/lluvia-habitacion.m4a', 'Lluvia en una habitación', 'Rain in a room', 'CeleronBeats'],
    ['/audio/rincon/rio-lento.mp3', 'Río lento', 'Slow river', 'Nils_Vega'],
    ['/audio/rincon/olas-suaves.mp3', 'Olas suaves', 'Soft waves', 'SoundsForYou'],
    ['/audio/rincon/bosque-y-viento.mp3', 'Bosque y viento', 'Forest wind and birds', 'freesound_community'],
    ['/audio/rincon/ambiente-largo.m4a', 'Ambiente largo', 'Long ambience', 'Lachm'],
    ['/audio/rincon/meditacion-suave.m4a', 'Meditación suave', 'Soft meditation', 'Verclub_Music']
  ];
  var mixList = $('#mixList');
  if (mixList) {
    SOUNDS.forEach(function (s, i) {
      var name = ES ? s[1] : s[2];
      var row = document.createElement('div'); row.className = 'qmixrow';
      var lab = document.createElement('label'); lab.setAttribute('for', 'mix' + i);
      var box = document.createElement('input'); box.type = 'checkbox'; box.id = 'mix' + i;
      var txt = document.createElement('span');
      var strong = document.createElement('strong'); strong.textContent = name;
      var small = document.createElement('small'); small.textContent = 'Pixabay · ' + s[3];
      txt.appendChild(strong); txt.appendChild(small);
      lab.appendChild(box); lab.appendChild(txt);
      var range = document.createElement('input');
      range.type = 'range'; range.min = 0; range.max = 100; range.value = 50; range.disabled = true;
      range.setAttribute('aria-label', (ES ? 'Volumen de ' : 'Volume of ') + name);
      row.appendChild(lab); row.appendChild(range); mixList.appendChild(row);
      var r = { box: box, range: range, el: null };
      mixRows.push(r);
      box.addEventListener('change', function () {
        if (box.checked) {
          if (!r.el) {
            r.el = new Audio(); r.el.preload = 'none'; r.el.loop = true; r.el.dataset.mix = '1'; r.el.src = s[0];
            r.el.addEventListener('error', function () {
              box.checked = false; box.disabled = true; range.disabled = true;
              small.textContent = 'Pixabay · ' + s[3] + ' · ' + T.unavailable;
            });
          }
          range.disabled = false;
          r.el.volume = 0;
          var pr = r.el.play();
          if (pr && pr.catch) pr.catch(function () {});
          ramp(r.el, range.value / 100, 4000);
        } else if (r.el) {
          range.disabled = true;
          var el = r.el; ramp(el, 0, 1500, function () { el.pause(); });
        }
      });
      range.addEventListener('input', function () { if (r.el && !r.el.paused) r.el.volume = range.value / 100; });
    });
    $('#mixStop').addEventListener('click', function () {
      mixRows.forEach(function (r) {
        if (r.el && !r.el.paused) { var el = r.el; ramp(el, 0, 1500, function () { el.pause(); }); }
        r.box.checked = false; r.range.disabled = true;
      });
    });
  }


  /* --- Sonidos creados en la página (assets/rincon-sonidos.js).
         Una sola fuente a la vez: archivo, mezcla, sonido creado o sonido de escena. --- */
  var SND = window.IGSonidos && window.IGSonidos.supported ? window.IGSonidos : null;
  var activeKind = null, pausing = false;
  var owners = {};                       // quién está sonando: {file, mix, gen, scene}: función para pararlo
  function silence(except) {
    Object.keys(owners).forEach(function (k) {
      if (k === except) return;
      if (except === 'mix' && k === 'mixgen') return;
      if (except === 'mixgen' && k === 'mix') return;
      var f = owners[k]; if (f) f();
    });
    if (except !== 'file' && except !== 'mix') media.forEach(function (m) {
      if (m.paused) return;
      if (except === 'mixgen' && m.dataset.mix) return;
      m.pause(); if (m.dataset.mix) mixOff(m);
    });
    if (except === 'mixgen') media.forEach(function (m) { if (!m.paused && !m.dataset.mix) m.pause(); });
  }
  window.__igSilence = silence;

  /* Sonido de la escena */
  var SCENE_SOUND = { aquarium: 'escena-acuario', bubbles: 'escena-burbujas', jellies: 'escena-medusas', fibre: 'escena-fibra', sea: 'escena-mar', rain: 'escena-lluvia', river: 'escena-rio', night: 'escena-noche' };
  var ambience = (function () {
    var box = $('#sceneSound'), vol = $('#sceneVol'), h = null, playing = null;
    function level() { return vol ? (vol.value / 100) * 0.9 : 0.4; }
    function stop() { if (h) { h.stop(1.5); h = null; } playing = null; owners.scene = null; }
    function sync() {
      var want = SND && box && box.checked && activeKind ? activeKind : null;
      if (want === playing) return;
      stop();
      if (!want) return;
      silence('scene');
      h = SND.start(SCENE_SOUND[want] || 'escena-burbujas', level(), 4); playing = want;
      owners.scene = function () { stop(); if (box) box.checked = false; if (vol) vol.disabled = true; };
    }
    if (box && !SND) { box.disabled = true; }
    if (box) box.addEventListener('change', function () { if (vol) vol.disabled = !box.checked; sync(); });
    if (vol) vol.addEventListener('input', function () { if (h) h.setLevel(level()); });
    return { sync: sync, stop: stop };
  })();

  /* Escuchar: sonidos y música creados aquí */
  (function () {
    var box = $('#genSounds'), list = $('#genList'), vol = $('#genVol');
    if (!box || !list || !SND) return;
    box.hidden = false;
    var cur = null, curId = null, btns = [];
    var FAM = ES ? { nat: 'Naturaleza', ruido: 'Ruido suave', mus: 'Música' } : { nat: 'Nature', ruido: 'Soft noise', mus: 'Music' };
    var title = $('#audioTitle'), cred = $('#audioCredit');
    var CREDIT = ES ? 'Creado en Iris Green · no es una grabación' : 'Made by Iris Green · not a recording';
    function level() { return vol ? (vol.value / 100) * 0.9 : 0.45; }
    function stop() {
      if (cur) { cur.stop(1.5); cur = null; }
      curId = null; owners.gen = null;
      btns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    }
    ['nat', 'ruido', 'mus'].forEach(function (f) {
      var h = document.createElement('h3'); h.className = 'qgen-h'; h.textContent = FAM[f]; list.appendChild(h);
      SND.catalog.filter(function (c) { return c.fam === f; }).forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'qchoice qgen'; b.setAttribute('aria-pressed', 'false');
        b.innerHTML = '<span class="qthumb qthumb-gen qthumb-' + f + '" aria-hidden="true"></span><span><strong></strong><small></small></span>';
        b.querySelector('strong').textContent = ES ? c.es : c.en; b.querySelector('small').textContent = ES ? c.des : c.den;
        var on = document.createElement('span'); on.className = 'qgen-on'; on.textContent = ES ? 'Sonando' : 'Playing'; b.querySelector('strong').appendChild(on);
        b.addEventListener('click', function () {
          if (curId === c.id) { stop(); if (title) title.textContent = ES ? 'Elige un sonido' : 'Choose a sound'; return; }
          silence('gen'); stop();
          cur = SND.start(c.id, level(), 4); curId = c.id; owners.gen = stop;
          b.setAttribute('aria-pressed', 'true');
          if (title) title.textContent = ES ? c.es : c.en;
          if (cred) cred.textContent = CREDIT;
        });
        btns.push(b); list.appendChild(b);
      });
    });
    if (vol) vol.addEventListener('input', function () { if (cur) cur.setLevel(level()); });
    var stopA = $('#stopAudio');
    if (stopA) stopA.addEventListener('click', function () { if (curId) { stop(); if (title) title.textContent = ES ? 'Elige un sonido' : 'Choose a sound'; } });
    window.addEventListener('pagehide', function () { stop(); });
  })();

  /* Mezclar: también con los sonidos creados */
  (function () {
    var ml = $('#mixList');
    if (!ml || !SND) return;
    var rows = [], frag = document.createDocumentFragment();
    SND.catalog.forEach(function (c, i) {
      var name = ES ? c.es : c.en;
      var row = document.createElement('div'); row.className = 'qmixrow';
      var lab = document.createElement('label'); lab.setAttribute('for', 'mixg' + i);
      var box = document.createElement('input'); box.type = 'checkbox'; box.id = 'mixg' + i;
      var txt = document.createElement('span'), strong = document.createElement('strong'), small = document.createElement('small');
      strong.textContent = name; small.textContent = 'Iris Green'; txt.appendChild(strong); txt.appendChild(small);
      lab.appendChild(box); lab.appendChild(txt);
      var range = document.createElement('input'); range.type = 'range'; range.min = 0; range.max = 100; range.value = 50; range.disabled = true;
      range.setAttribute('aria-label', (ES ? 'Volumen de ' : 'Volume of ') + name);
      row.appendChild(lab); row.appendChild(range); frag.appendChild(row);
      var r = { box: box, range: range, h: null };
      rows.push(r);
      box.addEventListener('change', function () {
        if (box.checked) { silence('mixgen'); range.disabled = false; r.h = SND.start(c.id, range.value / 100 * 0.9, 4); owners.mixgen = offAll; }
        else { range.disabled = true; if (r.h) { r.h.stop(1.5); r.h = null; } if (!rows.some(function (x) { return x.h; })) owners.mixgen = null; }
      });
      range.addEventListener('input', function () { if (r.h) r.h.setLevel(range.value / 100 * 0.9); });
    });
    ml.insertBefore(frag, ml.firstChild);
    function offAll() { rows.forEach(function (r) { if (r.h) { r.h.stop(1.5); r.h = null; } r.box.checked = false; r.range.disabled = true; }); owners.mixgen = null; }
    var ms = $('#mixStop'); if (ms) ms.addEventListener('click', offAll);
    window.addEventListener('pagehide', offAll);
  })();

  /* --- Mantener la pantalla encendida mientras miras una escena o haces la pausa --- */
  var keepAwake = (function () {
    var lock = null;
    function want() { return !!activeKind || pausing; }
    function update() {
      if (!('wakeLock' in navigator)) return;
      if (want() && !lock && document.visibilityState === 'visible') {
        navigator.wakeLock.request('screen').then(function (l) { lock = l; l.addEventListener('release', function () { if (lock === l) lock = null; }); }).catch(function () {});
      } else if (!want()) release();
    }
    function release() { if (lock) { var l = lock; lock = null; l.release().catch(function () {}); } }
    document.addEventListener('visibilitychange', update);
    return { update: update, release: release };
  })();
  function sceneEnded() { activeKind = null; ambience.sync(); keepAwake.update(); }

  /* --- Ver a pantalla completa: la escena o el vídeo ocupan toda la pantalla. Esc para salir. --- */
  var fullB = $('#sceneFull');
  if (fullB) fullB.addEventListener('click', function () {
    var st = $('#watchStage'), fn = st && (st.requestFullscreen || st.webkitRequestFullscreen);
    if (!fn) { if (credit) credit.textContent = T.nofull; return; }
    try { var r = fn.call(st); if (r && r.catch) r.catch(function () { if (credit) credit.textContent = T.nofull; }); } catch (e) { if (credit) credit.textContent = T.nofull; }
  });

  /* --- Mirar en grande: cuando hay un vídeo o una escena, la tarjeta se amplía y la imagen se ve arriba --- */
  (function () {
    var card = $('#watch'), st = $('#watchStage');
    if (!card || !st || !window.MutationObserver) return;
    var was = false;
    function check() {
      var on = !!st.querySelector('iframe, canvas');
      if (on === was) return;
      was = on;
      card.classList.toggle('is-viewing', on);
      if (on && !document.body.classList.contains('focus-mode')) {
        requestAnimationFrame(function () {
          var r = st.getBoundingClientRect();
          if (r.top < 0 || r.bottom > window.innerHeight) st.scrollIntoView({ block: 'start' });
        });
      }
    }
    new MutationObserver(check).observe(st, { childList: true });
  })();

  /* --- Mirar: escenas propias (acuario y tubo de burbujas) --- */
  var stage = $('#watchStage'), credit = $('#watchCredit');
  var PAL = {
    blue:   { water: ['#2b6f96', '#17395c'], glow: '#7fc3e6', fish: ['#f2c14e', '#a8dadc', '#f4a6c1', '#ffffff', '#9fd8c8'] },
    green:  { water: ['#2f7f76', '#15413f'], glow: '#9fe0c8', fish: ['#f2c14e', '#ffd6a5', '#cdeac0', '#ffffff', '#a8dadc'] },
    violet: { water: ['#5a49a8', '#261d52'], glow: '#c9b8ff', fish: ['#f4a6c1', '#ffd6a5', '#a8dadc', '#ffffff', '#f2c14e'] }
  };
  function opt(name, def) { var r = document.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : def; }
  var scene = null, raf = 0;
  function stopScene() { cancelAnimationFrame(raf); raf = 0; scene = null; }

  /* Escenas en 3D (se cargan solo al pulsar). Si el navegador no puede, se usa la versión 2D. */
  var scene3d = null, load3d = null;
  function need3d() {
    if (window.IGScenes3D) return Promise.resolve(window.IGScenes3D);
    if (!load3d) load3d = new Promise(function (ok, ko) {
      var s = document.createElement('script'); s.src = '/assets/rincon-escenas-3d.js?v=rincon-r02-20260924'; s.async = true;
      s.onload = function () { window.IGScenes3D ? ok(window.IGScenes3D) : ko(); };
      s.onerror = function () { load3d = null; ko(); };
      document.head.appendChild(s);
    });
    return load3d;
  }
  function stop3d() { if (scene3d) { scene3d.stop(); scene3d = null; } }
  function startScene(kind, button) {
    var stopV = $('#stopVideo'); if (stopV) stopV.click();
    stopScene(); stop3d();
    var token = {}; startScene.token = token;
    document.querySelectorAll('[data-scene]').forEach(function (b) { b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); });
    stage.innerHTML = '';
    var cv3 = document.createElement('canvas');
    cv3.setAttribute('role', 'img');
    cv3.setAttribute('aria-label', T[kind] || T.bubbles);
    stage.appendChild(cv3);
    if (credit) credit.textContent = T.credit;
    need3d().then(function (lib) {
      if (startScene.token !== token || !cv3.isConnected) return;
      if (!lib.supported()) throw new Error('webgl');
      activeKind = kind; ambience.sync(); keepAwake.update();
      scene3d = lib.start(kind, cv3, {
        speed: function () { return parseFloat(opt('sspeed', '0.5')) * (reduced() ? 0.4 : 1); },
        color: function () { return opt('scolor', 'blue'); },
        reduced: reduced
      });
    }).catch(function () {
      if (startScene.token !== token) return;
      start2d(kind, button);
    });
  }
  function start2d(kind, button) {
    if (kind !== 'aquarium' && kind !== 'bubbles' && kind !== 'jellies' && kind !== 'fibre') {
      stopScene(); stage.innerHTML = '';
      var msg = document.createElement('div'); msg.className = 'empty-stage'; msg.setAttribute('role', 'status'); msg.textContent = T.no3d; stage.appendChild(msg);
      if (credit) credit.textContent = '';
      return;
    }
    activeKind = kind; ambience.sync(); keepAwake.update();
    if (kind !== 'aquarium') kind = 'bubbles';
    stopScene();
    document.querySelectorAll('[data-scene]').forEach(function (b) { b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); });
    stage.innerHTML = '';
    var cv = document.createElement('canvas');
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', kind === 'aquarium' ? T.aquarium : T.bubbles);
    stage.appendChild(cv);
    if (credit) credit.textContent = T.credit;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (kind === 'aquarium' && window.IGAquarium) {
      var aq = window.IGAquarium.create(cv);
      var fit = function () { var rc = stage.getBoundingClientRect(); aq.resize(rc.width, rc.height, dpr); };
      fit(); aq.setWater(opt('scolor', 'blue')); aq.warm(2);
      if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);
      var meA = { last: performance.now() }; scene = meA;
      var loopA = function (now) {
        if (scene !== meA || !cv.isConnected) { if (scene === meA) stopScene(); return; }
        var dt = Math.min(0.05, (now - meA.last) / 1000); meA.last = now;
        aq.setWater(opt('scolor', 'blue'));
        aq.frame(dt, parseFloat(opt('sspeed', '0.5')) * (reduced() ? 0.4 : 1));
        raf = requestAnimationFrame(loopA);
      };
      raf = requestAnimationFrame(loopA);
      return;
    }
    var ctx = cv.getContext('2d'), W = 0, H = 0;
    function size() {
      var rc = stage.getBoundingClientRect(); W = rc.width; H = rc.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(stage);
    var fish = [], bubbles = [], plants = [], i;
    for (i = 0; i < 9; i++) fish.push({ x: rnd(0, 1), y: rnd(.15, .8), s: rnd(.7, 1.3), v: rnd(.012, .025) * (Math.random() < .5 ? -1 : 1), p: rnd(0, 6.28), c: i % 5 });
    for (i = 0; i < 26; i++) bubbles.push({ x: rnd(0, 1), y: rnd(0, 1), r: rnd(1.5, 5), v: rnd(.03, .07), w: rnd(0, 6.28) });
    for (i = 0; i < 7; i++) plants.push({ x: rnd(.03, .97), h: rnd(.18, .38), p: rnd(0, 6.28), g: i % 2 });
    var me = { t: 0, last: performance.now() };
    scene = me;

    function drawBubble(b, dt, k, big, xmap) {
      b.y -= b.v * dt * k * 2; if (b.y < -.05) { b.y = 1.05; b.x = rnd(0, 1); }
      var x = xmap(b.x) + Math.sin(b.y * 12 + b.w) * 4, y = b.y * H, r = b.r * big;
      ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fill();
    }
    function frame(now) {
      if (scene !== me || !cv.isConnected) { if (scene === me) stopScene(); return; }
      var dt = Math.min(0.05, (now - me.last) / 1000); me.last = now;
      var k = parseFloat(opt('sspeed', '0.5')) * (reduced() ? 0.4 : 1);
      me.t += dt * k; var t = me.t;
      var pal = PAL[opt('scolor', 'blue')] || PAL.blue;
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, pal.water[0]); g.addColorStop(1, pal.water[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      if (kind === 'aquarium') {
        ctx.globalAlpha = .07; ctx.fillStyle = '#ffffff';
        for (var j = 0; j < 4; j++) { var rx = W * (.12 + j * .24) + Math.sin(t * .3 + j) * 12; ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx + 40, 0); ctx.lineTo(rx + 110, H); ctx.lineTo(rx + 60, H); ctx.fill(); }
        ctx.globalAlpha = 1;
        plants.forEach(function (pl) {
          ctx.strokeStyle = pl.g ? '#4f9d69' : '#3f7f5a'; ctx.lineWidth = 5; ctx.lineCap = 'round';
          for (var q = -1; q <= 1; q++) {
            var bx = pl.x * W + q * 7, sway = Math.sin(t * .8 + pl.p + q) * 14;
            ctx.beginPath(); ctx.moveTo(bx, H); ctx.quadraticCurveTo(bx + sway, H - pl.h * H * .5, bx + sway * 1.4, H - pl.h * H); ctx.stroke();
          }
        });
        ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(0, H - 8, W, 8);
        fish.forEach(function (f) {
          f.x += f.v * dt * k * 3; if (f.x > 1.1) f.x = -.1; if (f.x < -.1) f.x = 1.1;
          var x = f.x * W, y = f.y * H + Math.sin(t * .9 + f.p) * 8, L = 18 * f.s * Math.max(.7, W / 520), dir = f.v > 0 ? 1 : -1;
          ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
          ctx.fillStyle = pal.fish[f.c];
          ctx.beginPath(); ctx.ellipse(0, 0, L, L * .45, 0, 0, 6.2832); ctx.fill();
          var wag = Math.sin(t * 4 + f.p) * L * .12;
          ctx.beginPath(); ctx.moveTo(-L * .85, 0); ctx.lineTo(-L * 1.45, -L * .38 + wag); ctx.lineTo(-L * 1.45, L * .38 + wag); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#17395c'; ctx.beginPath(); ctx.arc(L * .5, -L * .08, L * .08, 0, 6.2832); ctx.fill();
          ctx.restore();
        });
        bubbles.slice(0, 14).forEach(function (b) { drawBubble(b, dt, k, .9, function (x) { return x * W; }); });
      } else {
        var cw = Math.min(W * .34, 220), cx = W / 2 - cw / 2;
        var cg = ctx.createLinearGradient(cx, 0, cx + cw, 0);
        cg.addColorStop(0, 'rgba(255,255,255,.04)'); cg.addColorStop(.5, pal.glow); cg.addColorStop(1, 'rgba(255,255,255,.04)');
        ctx.globalAlpha = .55; ctx.fillStyle = cg; ctx.fillRect(cx, 0, cw, H); ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.strokeRect(cx, -2, cw, H + 4);
        bubbles.forEach(function (b) { drawBubble(b, dt, k, 1.3, function (x) { return cx + cw * (.1 + x * .8); }); });
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }
  document.querySelectorAll('[data-scene]').forEach(function (b) {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { startScene(b.dataset.scene, b); });
  });
  var stopVideo = $('#stopVideo');
  if (stopVideo) stopVideo.addEventListener('click', function () {
    if (scene || scene3d) { stopScene(); stop3d(); startScene.token = null; if (credit) credit.textContent = ''; }
    sceneEnded();
    document.querySelectorAll('[data-scene]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
  });
  document.querySelectorAll('#watchList').forEach(function (wl) {
    wl.addEventListener('click', function () {
      stopScene(); stop3d(); startScene.token = null; sceneEnded();
      document.querySelectorAll('[data-scene]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    }, true);
  });
  window.addEventListener('pagehide', function () {
    stopScene(); stop3d(); if (pause3d) { pause3d.stop(); pause3d = null; }
    activeKind = null; ambience.stop(); keepAwake.release();
    mixRows.forEach(function (r) { if (r.el) r.el.pause(); });
  });

  /* --- Pausa: imagen en 3D que sigue la guía de la página --- */
  var pbox = $('#breathBox'), porb = pbox ? pbox.querySelector('.orbwrap') : null, pause3d = null;
  var pState = { inhale: false, t0: performance.now() };
  if (pbox && window.MutationObserver) {
    new MutationObserver(function () {
      var inh = pbox.classList.contains('breathing');
      if (inh !== pState.inhale) { pState.inhale = inh; pState.t0 = performance.now(); }
    }).observe(pbox, { attributes: true, attributeFilter: ['class'] });
  }
  function pausePhase() {
    var steps = $('#breathSteps');
    if (steps && !steps.hidden) {
      var cur = steps.querySelector('[aria-current="step"]'), idx = cur ? Array.prototype.indexOf.call(steps.children, cur) : 0;
      return { guiding: true, inhale: idx === 0, progress: 1 };
    }
    var guiding = !!pbox && pbox.classList.contains('ig-guiding');
    var dur = pState.inhale ? 4000 : 6000;
    return { guiding: guiding, inhale: pState.inhale, progress: (performance.now() - pState.t0) / dur };
  }
  function startPause3d() {
    if (pause3d || !porb) return;
    need3d().then(function (lib) {
      if (pause3d || !lib.supported()) return;
      var wrap = document.createElement('div'); wrap.className = 'qpause3d'; wrap.setAttribute('aria-hidden', 'true');
      var cv = document.createElement('canvas'); wrap.appendChild(cv);
      porb.parentNode.insertBefore(wrap, porb);
      porb.hidden = true;
      pause3d = lib.start('pause', cv, { reduced: reduced, phase: pausePhase });
    }).catch(function () {});
  }
  if ($('#pause')) {
    ['pointerenter', 'focusin', 'touchstart'].forEach(function (ev) {
      $('#pause').addEventListener(ev, function () { need3d().catch(function () {}); }, { once: true, passive: true });
    });
  }
  var sB = $('#startBreath'); if (sB) sB.addEventListener('click', function () { pausing = true; keepAwake.update(); startPause3d(); });
  var sS = $('#stopBreath'); if (sS) sS.addEventListener('click', function () { pausing = false; keepAwake.update(); });

  /* --- Pausa: modo (mirar / respirar) y duración --- */
  var label = $('#breathLabel');
  function mode() { var r = document.querySelector('input[name="pmode"]:checked'); return r ? r.value : 'look'; }
  if (label && window.MutationObserver) {
    new MutationObserver(function () {
      if (mode() !== 'look') return;
      var box = $('#breathBox');
      if (!box || !box.classList.contains('ig-guiding')) return;
      var want = box.classList.contains('breathing') ? T.grow : T.shrink;
      if (label.textContent !== want) label.textContent = want;
    }).observe(label, { childList: true, characterData: true, subtree: true });
  }
  var endTimer = null;
  var startB = $('#startBreath'), stopB = $('#stopBreath');
  if (startB) startB.addEventListener('click', function () {
    clearTimeout(endTimer);
    var sel = $('#pdur'); var min = sel ? parseInt(sel.value, 10) : 0;
    if (min > 0) endTimer = setTimeout(function () {
      if (stopB) stopB.click();
      label.textContent = T.stopped;
    }, min * 60000);
  });
  if (stopB) stopB.addEventListener('click', function () { clearTimeout(endTimer); });
})();
