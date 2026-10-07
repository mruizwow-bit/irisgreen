/* Iris Green · El taller · Estudio de videomapping (R43).
   Superficies con esquinas ajustables (corner pinning), contenidos generados, imágenes y vídeo local,
   patrón de ajuste y proyección a pantalla completa. Exporta un espectáculo en un solo archivo HTML. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang;
  var TYPES = ['color', 'gradient', 'stripes', 'checker', 'circles', 'waves', 'text', 'image', 'video'];
  var ASPECTS = { '16:9': 16 / 9, '16:10': 16 / 10, '4:3': 4 / 3 };
  var PALETTE = [['#1f5f8b', 'azul', 'blue'], ['#b3261e', 'rojo', 'red'], ['#2e7d32', 'verde', 'green'], ['#e0b000', 'amarillo', 'yellow'], ['#5a49a8', 'morado', 'purple'], ['#d86b00', 'naranja', 'orange'], ['#0b8f8f', 'turquesa', 'teal'], ['#f4f4f4', 'blanco', 'white'], ['#101820', 'negro', 'black']];
  var CORNER_KEYS = ['cTL', 'cTR', 'cBR', 'cBL'];
  var MAX_IMG = 1600;

  IG.defineEngine('videomapping', {
    libs: [], version: 1, fileBase: LANG === 'en' ? 'mapping' : 'mapping',
    extraKeys: ['kMapCorner', 'kMapShow'],
    initialStart: function (para) { return { child: 'wall', teen: 'facade', adult: 'stairs' }[para] || 'box'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'wall', title: t('stWall'), desc: t('stWallD'), para: 'child' },
        { id: 'box', title: t('stBox'), desc: t('stBoxD'), para: 'any' },
        { id: 'facade', title: t('stFacade'), desc: t('stFacadeD'), para: 'teen' },
        { id: 'stairs', title: t('stStairs'), desc: t('stStairsD'), para: 'adult' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields;
    ctx.setTech('renderer', 'CSS matrix3d · Canvas 2D');
    var S = { v: 1, aspect: '16:9', bg: '#000000', surfaces: [], media: {} }, seq = 0, selId = null;
    var assets = { images: {}, videos: {} }, videoNames = {};

    /* ---------- Escenario ---------- */
    var frameEl = h('div', { class: 'igm-frame' });
    var stage = h('div', { class: 'igm-stage-el' });
    var handles = h('div', { class: 'igm-handles' });
    frameEl.append(stage, handles);
    var fsHint = h('p', { class: 'igm-fs-hint', hidden: true, text: t('fsHint') });
    frameEl.appendChild(fsHint);
    ctx.viewport.appendChild(frameEl);
    ctx.viewport.classList.add('igm-viewport');
    var player = new root.IGMap.Player(stage, S, { assets: assets, playing: false });

    function fitFrame() {
      if (D.fullscreenElement === frameEl) { frameEl.style.width = ''; frameEl.style.height = ''; return; }
      var vw = ctx.viewport.clientWidth - 16, vh = ctx.viewport.clientHeight - 16, a = ASPECTS[S.aspect] || 16 / 9;
      var w = Math.min(vw, vh * a), hh = w / a;
      frameEl.style.width = Math.max(40, Math.floor(w)) + 'px'; frameEl.style.height = Math.max(20, Math.floor(hh)) + 'px';
    }
    if (root.ResizeObserver) new ResizeObserver(function () { fitFrame(); drawHandles(); }).observe(ctx.viewport);

    function byId(id) { for (var i = 0; i < S.surfaces.length; i++) if (S.surfaces[i].id === id) return S.surfaces[i]; return null; }
    function sel() { return byId(selId); }
    function pct(v) { return IG.num(v * 100, 1) + ' %'; }
    function clamp01(v) { return Math.max(-0.25, Math.min(1.25, v)); }

    /* ---------- Asas de las esquinas (arrastre y teclado) ---------- */
    var handleEls = [];
    function drawHandles() {
      ctx.clear(handles); handleEls = [];
      var s = sel(); if (!s) return;
      var inFs = D.fullscreenElement === frameEl;
      if (inFs && !player.isTest()) return;
      var W = frameEl.clientWidth, H = frameEl.clientHeight;
      var outline = D.createElementNS('http://www.w3.org/2000/svg', 'svg');
      outline.setAttribute('class', 'igm-outline'); outline.setAttribute('aria-hidden', 'true'); outline.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var poly = D.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', s.corners.map(function (c) { return (c[0] * W) + ',' + (c[1] * H); }).join(' '));
      outline.appendChild(poly); handles.appendChild(outline);
      s.corners.forEach(function (c, i) {
        var b = h('button', { type: 'button', class: 'igm-handle', 'data-corner': String(i), 'aria-label': cornerLabel(s, i), style: 'left:' + (c[0] * W) + 'px;top:' + (c[1] * H) + 'px' }, h('span', { text: String(i + 1) }));
        b.addEventListener('keydown', function (e) { cornerKey(e, i); });
        b.addEventListener('pointerdown', function (e) { startDrag(e, i); });
        handles.appendChild(b); handleEls.push(b);
      });
    }
    function cornerLabel(s, i) { return t('cornerLabel', { corner: t(CORNER_KEYS[i]), n: i + 1, name: s.name, x: pct(s.corners[i][0]), y: pct(s.corners[i][1]) }); }
    function cornerKey(e, i) {
      var s = sel(); if (!s) return;
      var st = e.shiftKey ? 0.01 : 0.001, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key];
      if (!d) return;
      e.preventDefault(); e.stopPropagation();
      s.corners[i] = [clamp01(s.corners[i][0] + d[0]), clamp01(s.corners[i][1] + d[1])];
      player.update(S); var b = handleEls[i]; if (b) { b.style.left = (s.corners[i][0] * frameEl.clientWidth) + 'px'; b.style.top = (s.corners[i][1] * frameEl.clientHeight) + 'px'; b.setAttribute('aria-label', cornerLabel(s, i)); }
      updateOutline(); scheduleCommit(t('cornerMoved'));
      ctx.announce(t('cornerAnnounce', { n: i + 1, x: pct(s.corners[i][0]), y: pct(s.corners[i][1]) }));
    }
    function updateOutline() { var s = sel(), poly = handles.querySelector('polygon'); if (s && poly) poly.setAttribute('points', s.corners.map(function (c) { return (c[0] * frameEl.clientWidth) + ',' + (c[1] * frameEl.clientHeight) + ''; }).join(' ')); }
    var commitTimer = 0;
    function scheduleCommit(label) { clearTimeout(commitTimer); commitTimer = setTimeout(function () { ctx.commit(label); renderSide(); }, 350); }

    var drag = null;
    function startDrag(e, corner) {
      var s = sel(); if (!s) return;
      e.preventDefault(); e.stopPropagation();
      var r = frameEl.getBoundingClientRect();
      drag = { corner: corner, id: s.id, r: r, x: e.clientX, y: e.clientY, orig: s.corners.map(function (c) { return c.slice(); }), pid: e.pointerId, target: e.currentTarget };
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    }
    function moveDrag(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var s = byId(drag.id); if (!s) return;
      var dx = (e.clientX - drag.x) / drag.r.width, dy = (e.clientY - drag.y) / drag.r.height;
      if (drag.corner >= 0) s.corners[drag.corner] = [clamp01(drag.orig[drag.corner][0] + dx), clamp01(drag.orig[drag.corner][1] + dy)];
      else s.corners = drag.orig.map(function (c) { return [clamp01(c[0] + dx), clamp01(c[1] + dy)]; });
      player.update(S);
      if (drag.corner >= 0 && handleEls[drag.corner]) { handleEls[drag.corner].style.left = (s.corners[drag.corner][0] * drag.r.width) + 'px'; handleEls[drag.corner].style.top = (s.corners[drag.corner][1] * drag.r.height) + 'px'; }
      else drawHandles();
      updateOutline();
    }
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var moved = drag.orig.some(function (c, i) { var s = byId(drag.id); return s && (c[0] !== s.corners[i][0] || c[1] !== s.corners[i][1]); });
      var corner = drag.corner; drag = null;
      if (moved) { ctx.commit(corner >= 0 ? t('cornerMoved') : t('surfaceMoved')); drawHandles(); renderSide(); }
    }
    root.addEventListener('pointermove', moveDrag); root.addEventListener('pointerup', endDrag); root.addEventListener('pointercancel', endDrag);

    /* Tocar una superficie la elige; arrastrarla la mueve entera. */
    function hitTest(x, y) {
      for (var i = S.surfaces.length - 1; i >= 0; i--) { if (inside(S.surfaces[i].corners, x, y)) return S.surfaces[i]; }
      return null;
    }
    function inside(q, x, y) {
      var c = false;
      for (var i = 0, j = 3; i < 4; j = i++) { if (((q[i][1] > y) !== (q[j][1] > y)) && (x < (q[j][0] - q[i][0]) * (y - q[i][1]) / (q[j][1] - q[i][1]) + q[i][0])) c = !c; }
      return c;
    }
    frameEl.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.igm-handle')) return;
      var r = frameEl.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      var s = hitTest(x, y);
      if (!s) { if (selId) { selId = null; drawHandles(); renderSide(); } return; }
      if (s.id !== selId) { selId = s.id; drawHandles(); renderSide(); ctx.announce(t('selectedSurface', { name: s.name })); }
      drag = { corner: -1, id: s.id, r: r, x: e.clientX, y: e.clientY, orig: s.corners.map(function (c) { return c.slice(); }), pid: e.pointerId };
      try { frameEl.setPointerCapture(e.pointerId); } catch (_) {}
    });

    /* ---------- Teclado en el escenario ---------- */
    function onKey(e) {
      if (!ctx.viewport.contains(e.target) || e.target.closest('.igm-handle')) return false;
      var k = e.key, s = sel();
      if (k === 't' || k === 'T') { toggleTest(); return true; }
      if (k === 'p' || k === 'P') { togglePlay(); return true; }
      if ((k === 'f' || k === 'F') && D.fullscreenElement !== frameEl) { project(); return true; }
      if (!s) return false;
      var st = e.shiftKey ? 0.01 : 0.001, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[k];
      if (d) { s.corners = s.corners.map(function (c) { return [clamp01(c[0] + d[0]), clamp01(c[1] + d[1])]; }); player.update(S); drawHandles(); scheduleCommit(t('surfaceMoved')); ctx.announce(t('surfaceAnnounce', { name: s.name, x: pct(s.corners[0][0]), y: pct(s.corners[0][1]) })); return true; }
      if (k === 'Delete' || k === 'Backspace') { removeSurface(); return true; }
      if (k === 'Escape' && D.fullscreenElement !== frameEl) { selId = null; drawHandles(); renderSide(); ctx.announce(t('nothingSelected')); return true; }
      return false;
    }

    /* ---------- Operaciones ---------- */
    function rectCorners(x, y, w, hh) { return [[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]]; }
    function addSurface() {
      seq += 1;
      var off = (S.surfaces.length % 5) * 0.04;
      var s = { id: 's' + seq, name: t('surfaceN', { n: seq }), corners: rectCorners(0.3 + off, 0.25 + off, 0.4, 0.45), opacity: 1, content: { type: 'gradient', c1: PALETTE[seq % PALETTE.length][0], c2: PALETTE[(seq + 3) % PALETTE.length][0], n: 6, anim: true, speed: 'slow', text: '', angle: 0 } };
      S.surfaces.push(s); selId = s.id; player.update(S); drawHandles(); ctx.commit(t('added', { name: s.name })); renderSide(); ctx.announce(t('added', { name: s.name }));
    }
    function removeSurface() {
      var s = sel(); if (!s) return;
      S.surfaces = S.surfaces.filter(function (x) { return x !== s; }); selId = null; gcMedia();
      player.update(S); drawHandles(); ctx.commit(t('deleted', { name: s.name })); renderSide(); ctx.announce(t('deleted', { name: s.name }));
    }
    function duplicate() {
      var s = sel(); if (!s) return; seq += 1;
      var c = JSON.parse(JSON.stringify(s)); c.id = 's' + seq; c.name = s.name + ' ' + t('copyWord'); c.corners = c.corners.map(function (p) { return [clamp01(p[0] + 0.03), clamp01(p[1] + 0.03)]; });
      S.surfaces.push(c); selId = c.id; player.update(S); drawHandles(); ctx.commit(t('duplicated')); renderSide(); ctx.announce(t('duplicated'));
    }
    function reorder(dir) {
      var s = sel(); if (!s) return; var i = S.surfaces.indexOf(s), j = Math.max(0, Math.min(S.surfaces.length - 1, i + dir)); if (i === j) return;
      S.surfaces.splice(i, 1); S.surfaces.splice(j, 0, s); player.update(S); ctx.commit(dir > 0 ? t('forward') : t('backward')); renderSide(); ctx.announce(dir > 0 ? t('forward') : t('backward'));
    }
    function resetCorners() {
      var s = sel(); if (!s) return;
      var xs = s.corners.map(function (c) { return c[0]; }), ys = s.corners.map(function (c) { return c[1]; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      s.corners = rectCorners(x0, y0, x1 - x0, y1 - y0); player.update(S); drawHandles(); ctx.commit(t('cornersReset')); renderSide(); ctx.announce(t('cornersReset'));
    }
    function gcMedia() {
      var used = {}; S.surfaces.forEach(function (s) { if (s.content.ref) used[s.content.ref] = true; });
      Object.keys(S.media).forEach(function (k) { if (!used[k]) { delete S.media[k]; delete assets.images[k]; } });
      Object.keys(assets.videos).forEach(function (k) { if (!used[k]) { var v = assets.videos[k]; try { v.pause(); URL.revokeObjectURL(v.src); } catch (_) {} delete assets.videos[k]; delete videoNames[k]; } });
    }
    function loadImageData(ref, dataUrl) {
      return new Promise(function (resolve) { var im = new Image(); im.onload = function () { assets.images[ref] = im; resolve(); }; im.onerror = function () { resolve(); }; im.src = dataUrl; });
    }
    function chooseImage() {
      var s = sel(); if (!s) return;
      ctx.pickFile('image/png,image/jpeg,image/webp,image/gif').then(function (file) {
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) { ctx.announce(t('imageTooBig')); return; }
        var url = URL.createObjectURL(file), im = new Image();
        im.onload = function () {
          /* se reduce y se guarda dentro del proyecto (sin enviar nada) */
          var sc = Math.min(1, MAX_IMG / Math.max(im.naturalWidth, im.naturalHeight)), c = D.createElement('canvas');
          c.width = Math.max(1, Math.round(im.naturalWidth * sc)); c.height = Math.max(1, Math.round(im.naturalHeight * sc));
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
          var data = c.toDataURL('image/jpeg', 0.86); seq += 1; var ref = 'm' + seq;
          S.media[ref] = { kind: 'image', data: data, name: String(file.name || '').slice(0, 80) };
          loadImageData(ref, data).then(function () {
            s.content.type = 'image'; s.content.ref = ref; gcMedia(); player.update(S); ctx.commit(t('imageSet')); renderSide(); ctx.announce(t('imageSet'));
          });
        };
        im.onerror = function () { URL.revokeObjectURL(url); ctx.announce(t('imageError')); };
        im.src = url;
      });
    }
    function chooseVideo() {
      var s = sel(); if (!s) return;
      ctx.pickFile('video/mp4,video/webm,video/ogg,video/quicktime').then(function (file) {
        if (!file) return;
        var v = D.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
        v.src = URL.createObjectURL(file);
        seq += 1; var ref = 'v' + seq; assets.videos[ref] = v; videoNames[ref] = String(file.name || '').slice(0, 80);
        v.addEventListener('loadeddata', function () { player.update(S); });
        s.content.type = 'video'; s.content.ref = ref; s.content.videoName = videoNames[ref];
        if (player.isPlaying()) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        gcMedia(); player.update(S); ctx.commit(t('videoSet')); renderSide(); ctx.announce(t('videoSet'));
      });
    }
    function missingLabels() { S.surfaces.forEach(function (s) { if (s.content.type === 'video') s.content.missing = t('videoMissing'); else if (s.content.type === 'image') s.content.missing = t('imageMissing'); }); }

    /* ---------- Patrón, reproducción y proyección ---------- */
    var testBtn, playBtn;
    function toggleTest() { player.setTest(!player.isTest()); if (testBtn) testBtn.setAttribute('aria-pressed', String(player.isTest())); drawHandles(); ctx.announce(player.isTest() ? t('testOn') : t('testOff')); }
    function togglePlay() {
      player.setPlaying(!player.isPlaying());
      if (playBtn) { playBtn.setAttribute('aria-pressed', String(player.isPlaying())); }
      ctx.announce(player.isPlaying() ? t('playing') : t('paused'));
    }
    function project() {
      if (!frameEl.requestFullscreen) { ctx.announce(t('noFullscreen')); return; }
      frameEl.requestFullscreen({ navigationUI: 'hide' }).then(function () { frameEl.focus(); }).catch(function () { ctx.announce(t('noFullscreen')); });
    }
    frameEl.tabIndex = -1;
    D.addEventListener('fullscreenchange', function () {
      var on = D.fullscreenElement === frameEl;
      frameEl.classList.toggle('igm-fs', on); fsHint.hidden = !on;
      if (on) setTimeout(function () { fsHint.hidden = true; }, 4000);
      fitFrame(); player.update(S); drawHandles();
      ctx.announce(on ? t('fsOn') : t('fsOff'));
    });
    frameEl.addEventListener('keydown', function (e) {
      if (D.fullscreenElement !== frameEl) return;
      if (e.key === 'Tab') { /* recorre superficies para ajustarlas en la proyección */
        if (!player.isTest()) return; e.preventDefault();
        var i = S.surfaces.findIndex(function (s) { return s.id === selId; }); i = (i + (e.shiftKey ? -1 : 1) + S.surfaces.length) % S.surfaces.length;
        selId = S.surfaces[i] ? S.surfaces[i].id : null; drawHandles(); renderSide(); if (handleEls[0]) handleEls[0].focus();
      }
    });

    /* ---------- Paneles ---------- */
    var TYPE_OPTS = TYPES.map(function (k) { return [k, t('type_' + k)]; });
    function colourSel(label, value, onChange) {
      var opts = PALETTE.map(function (p) { return [p[0], p[LANG === 'en' ? 2 : 1]]; });
      if (!PALETTE.some(function (p) { return p[0] === value; })) opts.push([value, t('customColour')]);
      return F.select(label, value, opts, { onChange: onChange });
    }
    function renderSide() {
      missingLabels();
      var ul = h('ul', { class: 'igs-list' });
      S.surfaces.slice().reverse().forEach(function (s) {
        var b = h('button', { type: 'button', 'aria-current': String(s.id === selId) }, h('span', { class: 'igs-swatch', style: 'background:' + (s.content.c1 || '#555') }), h('span', { text: s.name }), h('small', { text: t('type_' + s.content.type) }));
        b.addEventListener('click', function () { selId = s.id; drawHandles(); renderSide(); ctx.announce(t('selectedSurface', { name: s.name })); });
        ul.appendChild(h('li', null, b));
      });
      ctx.setStructure([h('h3', { text: t('surfaces') + ' (' + S.surfaces.length + ')' }), ul, h('p', { class: 'igs-muted', text: t('orderHelp') })]);

      var out = [], s = sel();
      if (s) {
        var ct = s.content;
        out.push(h('h4', { text: s.name }));
        out.push(F.text(t('name'), s.name, { max: 40, onChange: function (v) { s.name = String(v).trim().slice(0, 40) || s.name; player.update(S); ctx.commit(t('renamed')); renderSide(); } }));
        out.push(F.select(t('content'), ct.type, TYPE_OPTS, { onChange: function (v) {
          if (v === 'image') { chooseImage(); renderSide(); return; }
          if (v === 'video') { chooseVideo(); renderSide(); return; }
          ct.type = v; delete ct.ref; gcMedia(); player.update(S); ctx.commit(t('contentSet')); renderSide(); ctx.announce(t('contentSet'));
        } }));
        if (ct.type === 'image') out.push(h('div', { class: 'igs-actions' }, ctx.button(t('chooseImage'), { icon: 'folder', onClick: chooseImage })), F.choice(t('fit'), ct.fit || 'cover', [['cover', t('fitCover')], ['contain', t('fitContain')]], { onChange: function (v) { ct.fit = v; player.update(S); ctx.commit(t('contentSet')); } }));
        if (ct.type === 'video') {
          out.push(h('p', { class: 'igs-muted', text: assets.videos[ct.ref] ? t('videoNote', { name: videoNames[ct.ref] || ct.videoName || '' }) : t('videoMissingNote') }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('chooseVideo'), { icon: 'folder', onClick: chooseVideo })));
        }
        if (['color', 'gradient', 'stripes', 'checker', 'circles', 'waves', 'text'].indexOf(ct.type) >= 0) {
          out.push(colourSel(ct.type === 'text' ? t('bgColour') : t('colour1'), ct.c1, function (v) { ct.c1 = v; player.update(S); ctx.commit(t('colourSet')); renderSide(); }));
          if (ct.type !== 'color') out.push(colourSel(ct.type === 'text' ? t('textColour') : t('colour2'), ct.c2, function (v) { ct.c2 = v; player.update(S); ctx.commit(t('colourSet')); }));
          if (['stripes', 'checker', 'circles', 'waves'].indexOf(ct.type) >= 0) out.push(F.range(t('count'), ct.n || 6, { min: 2, max: 24, step: 1, onChange: function (v) { ct.n = v; player.update(S); ctx.commit(t('countSet')); } }));
          if (ct.type === 'stripes') out.push(F.choice(t('direction'), ct.dir || 'v', [['v', t('dirV')], ['h', t('dirH')]], { onChange: function (v) { ct.dir = v; player.update(S); ctx.commit(t('contentSet')); } }));
          if (ct.type === 'gradient') out.push(F.range(t('angle'), ct.angle || 0, { min: 0, max: 360, step: 15, unit: '°', onChange: function (v) { ct.angle = v; player.update(S); ctx.commit(t('contentSet')); } }));
          if (ct.type === 'text') out.push(F.text(t('textLabel'), ct.text || '', { max: 80, onChange: function (v) { ct.text = String(v).slice(0, 80); player.update(S); ctx.commit(t('contentSet')); } }));
          if (ct.type !== 'checker') {
            out.push(F.check(t('animate'), !!ct.anim, { onChange: function (v) { ct.anim = !!v; player.update(S); ctx.commit(t('contentSet')); renderSide(); } }));
            if (ct.anim) out.push(F.choice(t('speed'), ct.speed || 'slow', [['slow', t('slow')], ['medium', t('medium')]], { onChange: function (v) { ct.speed = v; player.update(S); ctx.commit(t('contentSet')); } }));
          }
        }
        out.push(F.range(t('opacity'), Math.round((s.opacity == null ? 1 : s.opacity) * 100), { min: 10, max: 100, step: 5, unit: '%', onChange: function (v) { s.opacity = v / 100; player.update(S); ctx.commit(t('opacitySet')); } }));
        out.push(h('p', { class: 'igs-field-group', text: t('corners') }));
        out.push(h('p', { class: 'igs-muted', text: t('cornersHelp') }));
        s.corners.forEach(function (c, i) {
          var row = h('div', { class: 'igm-corner-row' }, h('p', { class: 'igm-corner-name', text: (i + 1) + ' · ' + t(CORNER_KEYS[i]) }));
          [0, 1].forEach(function (ax) {
            row.appendChild(F.number(ax ? 'y' : 'x', Math.round(c[ax] * 1000) / 10, { unit: '%', min: -25, max: 125, step: 0.1, onChange: function (v) { s.corners[i][ax] = clamp01(v / 100); player.update(S); drawHandles(); ctx.commit(t('cornerMoved')); ctx.announce(t('cornerAnnounce', { n: i + 1, x: pct(s.corners[i][0]), y: pct(s.corners[i][1]) })); } }));
          });
          out.push(row);
        });
        if (!player.isConvex(s.id)) out.push(h('p', { class: 'igs-result', 'data-kind': 'bad' }, h('strong', { text: t('crossedTitle') }), ' ', t('crossed')));
        out.push(h('div', { class: 'igs-actions' },
          ctx.button(t('resetCorners'), { icon: 'corners', onClick: resetCorners }), ctx.button(t('forward'), { icon: 'layers', onClick: function () { reorder(1); } }),
          ctx.button(t('backward'), { icon: 'layers', onClick: function () { reorder(-1); } }), ctx.button(t('duplicateBtn'), { icon: 'copy', onClick: duplicate }),
          ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', onClick: removeSurface })));
      } else {
        out.push(h('h4', { text: t('showSettings') }));
        out.push(h('p', { class: 'igs-muted', text: S.surfaces.length ? t('pickSurface') : t('noSurfaces') }));
      }
      out.push(h('h4', { text: t('output') }));
      out.push(F.select(t('aspect'), S.aspect, Object.keys(ASPECTS).map(function (k) { return [k, t('aspect_' + k.replace(':', '_'))]; }), { onChange: function (v) { S.aspect = v; fitFrame(); player.update(S); drawHandles(); ctx.commit(t('aspectSet')); } }));
      out.push(colourSel(t('bgStage'), S.bg, function (v) { S.bg = v; player.update(S); ctx.commit(t('colourSet')); }));
      out.push(h('p', { class: 'igs-muted', text: t('safetyNote') }));
      ctx.setInspector(out);
      ctx.setSummary(S.surfaces.length ? t('summary', { n: S.surfaces.length, list: S.surfaces.map(function (x) { return x.name + ' (' + t('type_' + x.content.type) + ')'; }).join(', '), aspect: S.aspect }) : t('noSurfaces'));
    }

    /* ---------- Herramientas y exportaciones ---------- */
    ctx.setTools([
      { id: 'add', label: t('addSurface'), icon: 'plus', primary: true, action: addSurface },
      { id: 'project', label: t('projectBtn'), icon: 'projector', action: project },
      { id: 'test', label: t('testBtn'), icon: 'grid', action: function (b) { testBtn = b; toggleTest(); } },
      { id: 'play', label: t('playBtn'), icon: 'play', action: function (b) { playBtn = b; togglePlay(); } },
      { id: 'dup', label: t('duplicateBtn'), icon: 'copy', level: 'more', action: duplicate },
      { id: 'reset', label: t('resetCorners'), icon: 'corners', level: 'more', action: resetCorners }
    ]);
    Array.prototype.forEach.call(ctx.viewport.parentNode.querySelectorAll('.igs-toolbar .igs-btn'), function (b) {
      var txt = b.textContent.trim();
      if (txt === t('testBtn')) { testBtn = b; b.setAttribute('aria-pressed', 'false'); }
      if (txt === t('playBtn')) { playBtn = b; b.setAttribute('aria-pressed', String(player.isPlaying())); }
    });
    ctx.command('add', t('addSurface'), '', addSurface); ctx.command('project', t('projectBtn'), 'F', project); ctx.command('test', t('testBtn'), 'T', toggleTest); ctx.command('play', t('playBtn'), 'P', togglePlay);

    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function exportHtml() {
      if (!S.surfaces.length) { ctx.announce(t('noSurfaces')); return; }
      root.fetch('/assets/ig-suite-mapeo-runtime.js?v=r43-1').then(function (r) { if (!r.ok) throw new Error('runtime'); return r.text(); }).then(function (runtime) {
        var show = JSON.parse(JSON.stringify(S));
        show.surfaces.forEach(function (s) { if (s.content.type === 'video') { s.content.missing = t('videoMissing'); delete s.content.videoName; } });
        var vids = show.surfaces.filter(function (s) { return s.content.type === 'video'; });
        var TX = { test: t('testBtn'), play: t('playBtn'), full: t('projectBtn'), chooseFor: t('chooseVideoFor'), fsOn: t('fsHint') };
        var boot = 'var SHOW=' + JSON.stringify(show) + ';var TX=' + JSON.stringify(TX) + ';' +
          'var st=document.getElementById("stage"),fr=document.getElementById("frame"),assets={images:{},videos:{}},pl;' +
          'var A={"16:9":16/9,"16:10":1.6,"4:3":4/3}[SHOW.aspect]||16/9;' +
          'function fit(){if(document.fullscreenElement===fr){fr.style.width="";fr.style.height="";return;}var w=Math.min(fr.parentNode.clientWidth,innerHeight*0.7*A);fr.style.width=w+"px";fr.style.height=(w/A)+"px";}' +
          'var pending=Object.keys(SHOW.media||{}).map(function(k){return new Promise(function(r){var im=new Image();im.onload=function(){assets.images[k]=im;r();};im.onerror=r;im.src=SHOW.media[k].data;});});' +
          'Promise.all(pending).then(function(){fit();pl=new IGMap.Player(st,SHOW,{assets:assets,playing:false});' +
          'document.getElementById("play").setAttribute("aria-pressed",String(pl.isPlaying()));});' +
          'addEventListener("resize",fit);' +
          'document.getElementById("full").addEventListener("click",function(){fr.requestFullscreen&&fr.requestFullscreen().then(function(){fr.focus();}).catch(function(){});});' +
          'document.addEventListener("fullscreenchange",function(){fit();pl&&pl.update();});' +
          'document.getElementById("test").addEventListener("click",function(e){pl.setTest(!pl.isTest());e.currentTarget.setAttribute("aria-pressed",String(pl.isTest()));});' +
          'document.getElementById("play").addEventListener("click",function(e){pl.setPlaying(!pl.isPlaying());e.currentTarget.setAttribute("aria-pressed",String(pl.isPlaying()));});' +
          'fr.addEventListener("keydown",function(e){if(e.key==="t"||e.key==="T")document.getElementById("test").click();if(e.key==="p"||e.key==="P")document.getElementById("play").click();});' +
          'SHOW.surfaces.forEach(function(s){if(s.content.type!=="video")return;var l=document.createElement("label");l.className="vid";l.textContent=TX.chooseFor.replace("{name}",s.name)+" ";var i=document.createElement("input");i.type="file";i.accept="video/*";' +
          'i.addEventListener("change",function(){var f=i.files&&i.files[0];if(!f)return;var v=document.createElement("video");v.muted=true;v.loop=true;v.playsInline=true;v.src=URL.createObjectURL(f);s.content.ref=s.id;assets.videos[s.id]=v;v.addEventListener("loadeddata",function(){pl.update();});if(pl.isPlaying())v.play().catch(function(){});pl.update();});' +
          'l.appendChild(i);document.getElementById("videos").appendChild(l);});';
        var html = '<!doctype html>\n<html lang="' + LANG + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<meta name="generator" content="El taller de Iris Green · irisgreen.eu"><title>' + esc(S.title || t('showTitle')) + '</title><style>' +
          ':root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f6f8fb;color:#172b42;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}main{max-width:1200px;margin:0 auto;padding:16px}' +
          'h1{margin:.2em 0 .4em;font-size:clamp(1.5rem,4vw,2.2rem)}.bar{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}.bar button{min-height:48px;padding:.5rem 1rem;border-radius:12px;border:2px solid #17395c;background:#fff;color:#17395c;font:700 1rem/1 system-ui,sans-serif;cursor:pointer}' +
          '.bar button#full{background:#17395c;color:#fff}.bar button[aria-pressed=true]{background:#e2ecf6}button:focus-visible,input:focus-visible,#frame:focus-visible{outline:3px solid #5a49a8;outline-offset:3px}' +
          '#frame{position:relative;margin:0 auto;background:#000;overflow:hidden;border-radius:10px}#frame:fullscreen{width:100vw;height:100vh;border-radius:0}#stage{position:absolute;inset:0;overflow:hidden}' +
          '.igm-surface{position:absolute;left:0;top:0;transform-origin:0 0}.igm-surface canvas{display:block;width:100%;height:100%}.vid{display:block;margin:.4rem 0}.credit{margin-top:1.5rem;font-size:.9rem;color:#44586c}' +
          '</style></head><body><main><h1>' + esc(S.title || t('showTitle')) + '</h1><p>' + esc(t('exportIntro')) + '</p>' +
          '<div class="bar"><button id="full" type="button">' + esc(t('projectBtn')) + '</button><button id="test" type="button" aria-pressed="false">' + esc(t('testBtn')) + '</button><button id="play" type="button" aria-pressed="true">' + esc(t('playBtn')) + '</button></div>' +
          '<div id="videos"></div><div id="frame" tabindex="0" role="img" aria-label="' + esc(t('summary', { n: S.surfaces.length, list: S.surfaces.map(function (x) { return x.name; }).join(', '), aspect: S.aspect })) + '"><div id="stage"></div></div>' +
          '<p>' + esc(t('exportKeys')) + '</p><p>' + esc(t('safetyNote')) + '</p><p class="credit">' + esc(t('credit')) + ' · IRIS GREEN · irisgreen.eu</p></main>' +
          '<script>' + runtime.replace(/<\/script/gi, '<\\/script') + '<\/script><script>' + boot.replace(/<\/script/gi, '<\\/script') + '<\/script></body></html>\n';
        ctx.download(new Blob([html], { type: 'text/html' }), (LANG === 'en' ? 'mapping-show-' : 'espectaculo-mapping-') + ctx.stamp() + '.html');
      }).catch(function () { ctx.announce(t('exportError')); });
    }
    ctx.addExport(t('exportHtml'), exportHtml);
    ctx.addExport(t('exportPng'), function () {
      var a = ASPECTS[S.aspect] || 16 / 9, W = 1920, H = Math.round(W / a);
      var c = ctx.canvasWithCredit(player.composite(W, H), S.bg);
      ctx.canvasBlob(c).then(function (b) { ctx.download(b, (LANG === 'en' ? 'mapping-' : 'mapping-') + ctx.stamp() + '.png'); });
    });

    /* ---------- Ejemplos ---------- */
    function P(x, y) { return [x / 1600, y / 900]; }
    function surf(name, corners, content, extra) { seq += 1; return Object.assign({ id: 's' + seq, name: name, corners: corners, opacity: 1, content: Object.assign({ c1: '#1f5f8b', c2: '#f4f4f4', n: 6, anim: false, speed: 'slow', text: '', angle: 0 }, content) }, extra || {}); }
    function ex(id) {
      seq = 0; var L = [];
      if (id === 'wall') {
        L.push(surf(t('exWall'), [P(260, 140), P(1340, 170), P(1320, 760), P(280, 790)], { type: 'circles', c1: '#5a49a8', c2: '#e0b000', n: 7, anim: true }));
        L.push(surf(t('exHello'), [P(560, 360), P(1040, 370), P(1035, 560), P(565, 570)], { type: 'text', c1: '#101820', c2: '#ffffff', text: t('exHelloText') }));
      } else if (id === 'box') {
        L.push(surf(t('exTop'), [P(610, 360), P(800, 250), P(990, 360), P(800, 470)], { type: 'gradient', c1: '#e0b000', c2: '#d86b00', anim: true }));
        L.push(surf(t('exLeft'), [P(610, 360), P(800, 470), P(800, 690), P(610, 580)], { type: 'stripes', c1: '#1f5f8b', c2: '#0b8f8f', n: 8, anim: true }));
        L.push(surf(t('exRight'), [P(800, 470), P(990, 360), P(990, 580), P(800, 690)], { type: 'waves', c1: '#5a49a8', c2: '#b3261e', n: 8, anim: true }));
      } else if (id === 'facade') {
        L.push(surf(t('exFacade'), [P(300, 120), P(1300, 120), P(1300, 820), P(300, 820)], { type: 'stripes', c1: '#26394d', c2: '#2f4a63', n: 12, dir: 'h', anim: true }));
        [[420, 220], [940, 220], [420, 480], [940, 480]].forEach(function (p, i) {
          L.push(surf(t('exWindow', { n: i + 1 }), [P(p[0], p[1]), P(p[0] + 240, p[1]), P(p[0] + 240, p[1] + 180), P(p[0], p[1] + 180)], { type: i % 2 ? 'waves' : 'circles', c1: '#101820', c2: i < 2 ? '#e0b000' : '#0b8f8f', n: 6, anim: true }));
        });
        L.push(surf(t('exDoor'), [P(700, 560), P(900, 560), P(900, 820), P(700, 820)], { type: 'text', c1: '#b3261e', c2: '#ffffff', text: t('exDoorText'), anim: true }));
      } else if (id === 'stairs') {
        var steps = 4;
        for (var i = 0; i < steps; i++) {
          var y0 = 180 + i * 150, inset = (steps - 1 - i) * 60;
          L.push(surf(t('exStep', { n: steps - i }), [P(420 + inset, y0), P(1180 - inset, y0), P(1200 - inset + 20, y0 + 120), P(400 + inset - 20, y0 + 120)], { type: i % 2 ? 'gradient' : 'stripes', c1: ['#1f5f8b', '#5a49a8', '#0b8f8f', '#d86b00'][i], c2: '#f4f4f4', n: 10, angle: 90, anim: true, speed: 'medium' }));
        }
      }
      S = { v: 1, aspect: '16:9', bg: '#000000', surfaces: L, media: {} }; selId = L.length ? L[L.length - 1].id : null;
      Object.keys(assets.images).forEach(function (k) { delete assets.images[k]; }); gcMedia();
      fitFrame(); player.update(S); drawHandles(); renderSide();
    }

    return {
      serialize: function () {
        var c = JSON.parse(JSON.stringify(S)); c.seq = seq;
        c.surfaces.forEach(function (s) { delete s.content.missing; });
        return c;
      },
      restore: function (st) {
        var keepVideos = assets.videos;
        S = JSON.parse(JSON.stringify(st)); seq = Math.max(seq, st.seq || 0); delete S.seq; S.media = S.media || {};
        assets.images = {}; assets.videos = keepVideos; player.assets = assets;
        Promise.all(Object.keys(S.media).map(function (k) { return loadImageData(k, S.media[k].data); })).then(function () { player.update(S); });
        if (!byId(selId)) selId = null;
        fitFrame(); player.update(S); drawHandles(); renderSide();
      },
      validate: function (d) {
        function num(v) { return typeof v === 'number' && isFinite(v); }
        function col(v) { return v == null || /^#[0-9a-fA-F]{6}$/.test(v); }
        if (!d || !Array.isArray(d.surfaces) || d.surfaces.length > 40 || !ASPECTS[d.aspect] || !col(d.bg)) return false;
        if (d.media && (typeof d.media !== 'object' || Object.keys(d.media).some(function (k) { var m = d.media[k]; return !m || typeof m.data !== 'string' || m.data.indexOf('data:image/') !== 0; }))) return false;
        return d.surfaces.every(function (s) {
          return s && typeof s.id === 'string' && typeof s.name === 'string' && Array.isArray(s.corners) && s.corners.length === 4 &&
            s.corners.every(function (c) { return Array.isArray(c) && c.length === 2 && num(c[0]) && num(c[1]); }) &&
            s.content && TYPES.indexOf(s.content.type) >= 0 && col(s.content.c1) && col(s.content.c2) && (s.content.text == null || typeof s.content.text === 'string');
        });
      },
      start: function (id) { if (id === 'empty') { seq = 0; S = { v: 1, aspect: '16:9', bg: '#000000', surfaces: [], media: {} }; selId = null; gcMedia(); fitFrame(); player.update(S); drawHandles(); renderSide(); } else ex(id); },
      onKey: onKey
    };
  }
})(window);
