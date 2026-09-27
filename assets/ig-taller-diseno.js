/* Iris Green · El taller · Estudio de diseño gráfico y tipografía.
   Mesa de trabajo con formas y textos, paleta, comprobador de contraste WCAG 2.2, capas accesibles
   y exportación en PNG y SVG con la marca de composición. */
(function (window, document) {
  'use strict';
  var T = window.IGT, D = window.IGTDis; if (!T || !D) return;
  var t = T.t, h = T.h;
  var TYPES = ['rect', 'ellipse', 'poly', 'star', 'line', 'arrow', 'text'];

  function blank() { return { format: 'cartel', bg: '#ffffff', title: '', els: [], nextId: 1 }; }

  T.ready(function () {
    var app = T.mount(); if (!app || app.getAttribute('data-studio') !== 'diseno') return;
    var CH = T.dict.challenges || [];
    var doc = blank(), sel = -1, ui = { colour: '#17395c', grid: true, snap: true }, brief = null;
    var measureCtx = document.createElement('canvas').getContext('2d');
    var history = new T.History(function () { return doc; }, function (d) { doc = d; if (sel >= doc.els.length) sel = doc.els.length - 1; renderAll(); }, function () { if (bar) bar.sync(); });
    function edit(fn) { var b = history.snapshot(); fn(); fixTexts(); history.commit(b); renderAll(); }
    function F() { return D.FORMATS[doc.format] || D.FORMATS.cartel; }

    /* Medida real de los textos: el recuadro se ajusta a la línea más larga. */
    function fixTexts() {
      doc.els.forEach(function (e) {
        if (e.type !== 'text') return;
        measureCtx.font = D.fontCss(e);
        var w = 0; D.textLines(e).forEach(function (l) { w = Math.max(w, measureCtx.measureText(l).width + Math.max(0, l.length - 1) * (e.ls || 0)); });
        var nw = Math.max(4, Math.round(w)), al = e.align || 'left';
        if (e.w && al === 'center') e.x = Math.round((e.x + e.w / 2 - nw / 2) * 10) / 10;
        else if (e.w && al === 'right') e.x = Math.round((e.x + e.w - nw) * 10) / 10;
        e.w = nw; e.h = Math.round(D.textHeight(e));
      });
    }
    function nameOf(e) { return e.type === 'text' ? t('dsNameText', { n: e.id, s: String(e.text).split('\n')[0].slice(0, 24) }) : t('dsType_' + e.type) + ' ' + e.id; }

    var retos = T.challenges({ items: CH, onPick: onPick });
    var bar = T.projectBar({ studio: 'diseno', history: history, getData: function () { return doc; }, getTitle: function () { return doc.title; },
      onNew: function () { doc = blank(); doc.format = formatSel.value || 'cartel'; sel = -1; history.reset(); T.markClean(); renderAll(); T.say(t('dsNewDone')); }, onOpen: loadDoc,
      onPrint: function () { printing = true; draw(); },
      extra: [T.btn(t('dsPng'), { icon: 'png', onClick: exportPng }), T.btn(t('dsSvg'), { icon: 'guardar', onClick: exportSvg })] });
    var printing = false;
    window.addEventListener('afterprint', function () { if (printing) { printing = false; draw(); } });

    var addBar = h('div', { class: 'igt-bar', role: 'group', 'aria-label': t('dsAdd') });
    TYPES.forEach(function (ty) { addBar.appendChild(T.btn(t('dsAdd_' + ty), { icon: 'mas', onClick: function () { addEl(ty); } })); });
    var canvas = h('canvas', { class: 'igt-dis', tabindex: '0', role: 'img', 'aria-describedby': 'igt-ds-keys-note' });
    var box = h('div', { class: 'igt-canvas-box igt-dis-box' }, canvas);
    var formatSel = h('select', { id: 'igt-ds-format' }, Object.keys(D.FORMATS).map(function (k) { return h('option', { value: k, text: t('dsFormat_' + k) }); }));
    formatSel.addEventListener('change', function () { edit(function () { doc.format = formatSel.value; }); T.say(t('dsFormat_' + doc.format)); });
    var bgIn = h('input', { type: 'color', id: 'igt-ds-bg' });
    bgIn.addEventListener('change', function () { edit(function () { doc.bg = D.norm(bgIn.value) || '#ffffff'; }); });
    var gridB = T.btn(t('dsGrid'), { cls: 'igt-chip', pressed: ui.grid, onClick: function () { ui.grid = !ui.grid; T.press(gridB, ui.grid); draw(); } });
    var snapB = T.btn(t('dsSnap'), { cls: 'igt-chip', pressed: ui.snap, onClick: function () { ui.snap = !ui.snap; T.press(snapB, ui.snap); T.say(ui.snap ? t('dsSnapOn') : t('dsSnapOff')); } });
    var boardBar = h('div', { class: 'igt-bar' },
      h('label', { class: 'igt-field inline', for: 'igt-ds-format' }, t('dsFormat'), formatSel),
      h('label', { class: 'igt-field inline', for: 'igt-ds-bg' }, t('dsBg'), bgIn), gridB, snapB);
    var keyNote = h('p', { class: 'igt-note', id: 'igt-ds-keys-note', text: t('dsKeyHint') });
    var stage = h('div', { class: 'igt-stage glass' }, addBar, box, boardBar, keyNote, T.keyHelp([
      [t('kArrows'), t('dsKMove')], [t('dsKShiftArrows'), t('dsKMove10')], [t('dsKPlusMinus'), t('dsKScale')], [t('dsKBrackets'), t('dsKCycle')],
      [t('dsKPage'), t('dsKOrder')], [t('dsKDup'), t('dsKDupT')], [t('dsKDel'), t('dsKDelT')], [t('kEsc'), t('dsKEsc')], [t('kUndoRedo'), t('dsKUndo')]]));
    var side = h('div', { class: 'igt-side glass' });
    var resultBox = h('div'), checkBox = h('div', { 'aria-live': 'polite' }), propsBox = h('div');
    var titleIn = h('input', { type: 'text', id: 'igt-ds-title', maxlength: 80 });
    titleIn.addEventListener('change', function () { edit(function () { doc.title = titleIn.value.trim(); }); });
    var layersWrap = h('div', { class: 'igt-table-wrap igt-print-keep', role: 'region', tabindex: '0', 'aria-labelledby': 'igt-ds-lcap' });
    var altBox = h('div', { class: 'igt-alt igt-print-keep', id: 'igt-ds-alt' });
    app.appendChild(retos);
    app.appendChild(h('div', { class: 'igt-topbar glass' }, bar));
    app.appendChild(h('div', { class: 'igt-work igt-print-keep' }, stage, side));
    app.appendChild(layersWrap); app.appendChild(altBox);
    history.bindKeys(document);

    /* ---------- Paleta, alineación y comprobador (paneles fijos) ---------- */
    var target = h('select', { id: 'igt-ds-target' }, ['fill', 'stroke', 'bg'].map(function (k) { return h('option', { value: k, text: t('dsTarget_' + k) }); }));
    var swatches = h('div', { class: 'igt-swatches', role: 'group', 'aria-label': t('dsPalette') });
    D.PALETTE.forEach(function (p) {
      var b = h('button', { type: 'button', class: 'igt-swatch', style: 'background:' + p[1], 'aria-label': t('dsCol_' + p[0]) + ' ' + p[1], title: t('dsCol_' + p[0]) });
      b.addEventListener('click', function () { applyColour(p[1], t('dsCol_' + p[0])); });
      swatches.appendChild(b);
    });
    var customIn = h('input', { type: 'color', id: 'igt-ds-custom', value: '#17395c' });
    var customApply = T.btn(t('dsApplyCustom'), { onClick: function () { applyColour(customIn.value, customIn.value); } });
    var palettePanel = T.panel(t('dsPalette'), true, h('label', { class: 'igt-field', for: 'igt-ds-target' }, t('dsTarget'), target), swatches,
      h('div', { class: 'igt-bar' }, h('label', { class: 'igt-field inline', for: 'igt-ds-custom' }, t('dsCustom'), customIn), customApply), h('p', { class: 'igt-note', text: t('dsPaletteNote') }));
    function applyColour(c, name) {
      var k = target.value;
      if (k === 'bg') { edit(function () { doc.bg = c; }); T.say(t('dsColourSet', { c: name, w: t('dsTarget_bg') })); return; }
      if (sel < 0) { T.say(t('dsSelectFirst')); return; }
      edit(function () { var e = doc.els[sel]; if (k === 'stroke') { e.stroke = c; if (!e.sw) e.sw = e.type === 'line' ? 6 : 4; } else if (e.type === 'line') { e.stroke = c; } else e.fill = c; });
      T.say(t('dsColourSet', { c: name, w: t('dsTarget_' + k) }));
    }
    var alignPanel = T.panel(t('dsAlign'), false, h('div', { class: 'igt-bar', role: 'group', 'aria-label': t('dsAlign') },
      ['left', 'hcenter', 'right', 'top', 'vcenter', 'bottom'].map(function (k) { return T.btn(t('dsAl_' + k), { onClick: function () { alignSel(k); } }); })),
      h('p', { class: 'igt-note', text: t('dsAlignNote') }));
    function alignSel(k) {
      if (sel < 0) { T.say(t('dsSelectFirst')); return; }
      edit(function () { var e = doc.els[sel], f = F(), m = Math.round(Math.min(f.w, f.h) * 0.06);
        if (k === 'left') e.x = m; else if (k === 'right') e.x = f.w - m - e.w; else if (k === 'hcenter') e.x = Math.round((f.w - e.w) / 2);
        else if (k === 'top') e.y = m; else if (k === 'bottom') e.y = f.h - m - e.h; else e.y = Math.round((f.h - e.h) / 2);
      });
      T.say(t('dsAl_' + k));
    }
    var cA = h('input', { type: 'color', id: 'igt-ds-ca', value: '#17395c' }), cB = h('input', { type: 'color', id: 'igt-ds-cb', value: '#ffffff' }), cOut = h('div', { 'aria-live': 'polite' });
    function checkPair() {
      var r = D.contrast(cA.value, cB.value); T.clear(cOut);
      cOut.appendChild(h('p', { class: 'igt-contrast-sample', style: 'color:' + cA.value + ';background:' + cB.value, text: t('dsSample') }));
      cOut.appendChild(h('ul', { class: 'igt-limits igt-checks', role: 'list' },
        h('li', { text: t('dsRatio', { r: T.num(r, 2) }) }),
        h('li', { text: (r >= 4.5 ? '✓ ' : '· ') + t('dsAANormal') }), h('li', { text: (r >= 3 ? '✓ ' : '· ') + t('dsAALarge') }),
        h('li', { text: (r >= 7 ? '✓ ' : '· ') + t('dsAAANormal') }), h('li', { text: (r >= 3 ? '✓ ' : '· ') + t('dsNonText') })));
    }
    cA.addEventListener('input', checkPair); cB.addEventListener('input', checkPair);
    var pairPanel = T.panel(t('dsChecker'), false, h('div', { class: 'igt-bar' }, h('label', { class: 'igt-field inline', for: 'igt-ds-ca' }, t('dsFg'), cA), h('label', { class: 'igt-field inline', for: 'igt-ds-cb' }, t('dsBgPair'), cB),
      T.btn(t('dsSwap'), { onClick: function () { var v = cA.value; cA.value = cB.value; cB.value = v; checkPair(); } })), cOut, h('p', { class: 'igt-note', text: t('dsCheckerNote') }));
    checkPair();
    var resultPanel = T.panel(t('dsResult'), true, resultBox, checkBox);
    var propsPanel = T.panel(t('dsProps'), true, propsBox);
    var docPanel = T.panel(t('dsDocPanel'), false, h('label', { class: 'igt-field', for: 'igt-ds-title' }, t('dsTitle'), titleIn));
    [resultPanel, propsPanel, palettePanel, alignPanel, pairPanel, docPanel].forEach(function (p) { side.appendChild(p); });

    /* ---------- Elementos ---------- */
    function addEl(ty) {
      var f = F(), s = Math.round(Math.min(f.w, f.h) * 0.3), e = { id: doc.nextId, type: ty, x: Math.round((f.w - s) / 2), y: Math.round((f.h - s) / 2), w: s, h: s, rot: 0, op: 1, fill: ui.colour, stroke: '#1b1f24', sw: 0 };
      if (ty === 'rect') e.r = 0;
      if (ty === 'poly') e.sides = 3;
      if (ty === 'star') { e.sides = 5; e.inner = 0.45; }
      if (ty === 'arrow') { e.h = Math.round(s * 0.6); e.y = Math.round((f.h - e.h) / 2); }
      if (ty === 'line') { e.fill = 'none'; e.stroke = ui.colour; e.sw = 6; e.h = 0; e.y = Math.round(f.h / 2); }
      if (ty === 'text') { e.text = t('dsNewText'); e.size = Math.max(16, Math.round(Math.min(f.w, f.h) * 0.08)); e.font = 'atkinson'; e.weight = 700; e.align = 'left'; e.ls = 0; e.lh = 1.2; e.fill = '#1b1f24'; e.w = 0; }
      if (doc.els.length >= 200) { T.say(t('dsTooMany')); return; }
      edit(function () { doc.els.push(e); doc.nextId++; sel = doc.els.length - 1; });
      if (ty === 'text') { e.x = Math.round((f.w - e.w) / 2); e.y = Math.round((f.h - e.h) / 2); renderAll(); }
      T.say(t('dsAdded', { n: nameOf(e) }));
      var first = propsBox.querySelector(ty === 'text' ? 'textarea' : 'input'); if (first) first.focus();
    }
    function snapV(v) { return ui.snap ? Math.round(v / 5) * 5 : Math.round(v * 10) / 10; }

    function numField(key, label, min, max, step, val, fn) {
      var id = 'igt-ds-p-' + key, el = h('input', { type: 'number', id: id, min: min, max: max, step: step || 1, value: Math.round(val * 100) / 100, inputmode: 'decimal' });
      el.addEventListener('change', function () { var v = parseFloat(String(el.value).replace(',', '.')); if (!isFinite(v)) { el.value = val; return; } v = Math.max(min, Math.min(max, v)); edit(function () { fn(v); }); });
      return h('label', { class: 'igt-field', for: id }, label, el);
    }
    function colourField(key, label, val, fn) {
      var id = 'igt-ds-p-' + key, idh = id + '-hex';
      var c = h('input', { type: 'color', id: id, value: D.norm(val) || '#000000' }), x = h('input', { type: 'text', id: idh, value: D.norm(val) || '', maxlength: 7, spellcheck: 'false', autocomplete: 'off', 'aria-label': label + ' (' + t('dsHex') + ')' });
      c.addEventListener('change', function () { edit(function () { fn(D.norm(c.value)); }); });
      x.addEventListener('change', function () { var v = D.norm(x.value); if (!v) { x.value = D.norm(val) || ''; T.say(t('dsBadHex')); return; } edit(function () { fn(v); }); });
      return h('div', { class: 'igt-bar igt-colour-row' }, h('label', { class: 'igt-field inline', for: id }, label, c), x);
    }
    function selectField(key, label, opts, val, fn) {
      var id = 'igt-ds-p-' + key, s = h('select', { id: id }, opts.map(function (o) { return h('option', { value: o[0], text: o[1] }); })); s.value = String(val);
      s.addEventListener('change', function () { edit(function () { fn(s.value); }); });
      return h('label', { class: 'igt-field', for: id }, label, s);
    }
    function renderProps() {
      T.clear(propsBox);
      if (sel < 0 || !doc.els[sel]) { propsBox.appendChild(h('p', { class: 'igt-note', text: t('dsNoSel') })); return; }
      var e = doc.els[sel], f = F(), big = Math.max(f.w, f.h) * 2;
      propsBox.appendChild(h('p', { class: 'igt-brief-k', text: nameOf(e) }));
      if (e.type === 'text') {
        var ta = h('textarea', { id: 'igt-ds-p-text', rows: 3, maxlength: 400 }); ta.value = e.text;
        ta.addEventListener('change', function () { var v = ta.value.replace(/\r/g, ''); edit(function () { e.text = v || ' '; }); });
        propsBox.appendChild(h('label', { class: 'igt-field', for: 'igt-ds-p-text' }, t('dsText'), ta));
        propsBox.appendChild(selectField('font', t('dsFont'), Object.keys(D.FONTS).map(function (k) { return [k, t('dsFont_' + k)]; }), e.font, function (v) { e.font = v; }));
        propsBox.appendChild(numField('size', t('dsSize'), 6, 400, 1, e.size, function (v) { e.size = v; }));
        propsBox.appendChild(selectField('weight', t('dsWeight'), [['400', t('dsW400')], ['700', t('dsW700')]], e.weight, function (v) { e.weight = +v; }));
        propsBox.appendChild(selectField('align', t('dsAlignText'), [['left', t('dsTA_left')], ['center', t('dsTA_center')], ['right', t('dsTA_right')]], e.align || 'left', function (v) { e.align = v; }));
        propsBox.appendChild(numField('ls', t('dsLs'), -5, 40, 0.5, e.ls || 0, function (v) { e.ls = v; }));
        propsBox.appendChild(numField('lh', t('dsLh'), 0.8, 3, 0.05, e.lh || 1.2, function (v) { e.lh = v; }));
        var it = h('input', { type: 'checkbox', id: 'igt-ds-p-it', checked: !!e.italic }); it.addEventListener('change', function () { edit(function () { e.italic = it.checked; }); });
        propsBox.appendChild(h('label', { class: 'igt-check', for: 'igt-ds-p-it' }, it, t('dsItalic')));
      }
      var pos = h('div', { class: 'igt-xy' });
      pos.appendChild(numField('x', 'X', -big, big, 1, e.x, function (v) { e.x = v; }));
      pos.appendChild(numField('y', 'Y', -big, big, 1, e.y, function (v) { e.y = v; }));
      if (e.type !== 'text') {
        pos.appendChild(numField('w', e.type === 'line' ? t('dsDx') : t('dsW'), e.type === 'line' ? -big : 1, big, 1, e.w, function (v) { e.w = v; }));
        pos.appendChild(numField('h', e.type === 'line' ? t('dsDy') : t('dsH'), e.type === 'line' ? -big : 1, big, 1, e.h, function (v) { e.h = v; }));
      }
      propsBox.appendChild(pos);
      propsBox.appendChild(numField('rot', t('dsRot'), -360, 360, 1, e.rot || 0, function (v) { e.rot = v; }));
      propsBox.appendChild(numField('op', t('dsOp'), 5, 100, 5, Math.round((e.op === undefined ? 1 : e.op) * 100), function (v) { e.op = v / 100; }));
      if (e.type === 'rect') propsBox.appendChild(numField('r', t('dsRadius'), 0, big, 1, e.r || 0, function (v) { e.r = v; }));
      if (e.type === 'poly' || e.type === 'star') propsBox.appendChild(numField('sides', e.type === 'star' ? t('dsPoints') : t('dsSides'), 3, 12, 1, e.sides, function (v) { e.sides = Math.round(v); }));
      if (e.type === 'star') propsBox.appendChild(numField('inner', t('dsInner'), 10, 90, 5, Math.round((e.inner || 0.45) * 100), function (v) { e.inner = v / 100; }));
      if (e.type !== 'line') propsBox.appendChild(colourField('fill', e.type === 'text' ? t('dsTextColour') : t('dsFill'), e.fill, function (v) { e.fill = v; }));
      if (e.type !== 'text') {
        propsBox.appendChild(colourField('stroke', e.type === 'line' ? t('dsLineColour') : t('dsStroke'), e.stroke || '#1b1f24', function (v) { e.stroke = v; if (!e.sw) e.sw = 4; }));
        propsBox.appendChild(numField('sw', t('dsSw'), 0, 80, 1, e.sw || 0, function (v) { e.sw = v; }));
      }
      propsBox.appendChild(h('div', { class: 'igt-bar' },
        T.btn(t('dsDup'), { icon: 'copiar', onClick: dupSel }), T.btn(t('dsDel'), { icon: 'borrar', cls: 'danger', onClick: delSel })));
    }
    function dupSel() { if (sel < 0) return; var c = JSON.parse(JSON.stringify(doc.els[sel])); c.id = doc.nextId; c.x += 10; c.y += 10; edit(function () { doc.els.splice(sel + 1, 0, c); doc.nextId++; sel++; }); T.say(t('dsDuplicated', { n: nameOf(c) })); }
    function delSel() { if (sel < 0) return; var n = nameOf(doc.els[sel]); edit(function () { doc.els.splice(sel, 1); sel = Math.min(sel, doc.els.length - 1); }); T.say(t('dsDeleted', { n: n })); }
    function moveOrder(i, d) { var j = i + d; if (j < 0 || j >= doc.els.length) return; edit(function () { var x = doc.els.splice(i, 1)[0]; doc.els.splice(j, 0, x); if (sel === i) sel = j; else if (sel === j) sel = i; }); T.say(t(d > 0 ? 'dsRaised' : 'dsLowered')); }

    /* ---------- Capas y texto equivalente ---------- */
    function renderLayers() {
      T.clear(layersWrap);
      if (!doc.els.length) { layersWrap.appendChild(h('p', { class: 'igt-note', id: 'igt-ds-lcap', style: 'padding:10px 12px', text: t('dsNoEls') })); return; }
      var tb = h('tbody');
      for (var i = doc.els.length - 1; i >= 0; i--) (function (i) {
        var e = doc.els[i], tc = e.type === 'text' ? D.textContrast(doc, i) : null;
        tb.appendChild(h('tr', { class: i === sel ? 'igt-row-sel' : null },
          h('th', { scope: 'row', text: String(doc.els.length - i) }),
          h('td', null, T.btn(nameOf(e), { cls: 'igt-chip', pressed: i === sel, onClick: function () { sel = i; renderAll(); T.say(t('dsSelected', { n: nameOf(e) })); } })),
          h('td', { text: tc ? T.num(tc.ratio, 2) + ':1 ' + (tc.aa ? '✓ AA' : '· ' + t('dsLow')) : '—' }),
          h('td', null,
            (function () { var b = T.btn(t('dsUp', { n: nameOf(e) }), { icon: 'arriba', cls: 'icon-only', disabled: i === doc.els.length - 1, onClick: function () { moveOrder(i, 1); } }); b.setAttribute('data-fk', 'up' + e.id); return b; })(),
            (function () { var b = T.btn(t('dsDown', { n: nameOf(e) }), { icon: 'abajo', cls: 'icon-only', disabled: i === 0, onClick: function () { moveOrder(i, -1); } }); b.setAttribute('data-fk', 'dn' + e.id); return b; })())));
      })(i);
      layersWrap.appendChild(h('table', { class: 'igt-table' }, h('caption', { id: 'igt-ds-lcap', text: t('dsLayersCap', { n: doc.els.length }) }),
        h('thead', null, h('tr', null, [t('thN'), t('dsThEl'), t('dsThContrast'), t('dsThOrder')].map(function (x) { return h('th', { scope: 'col', text: x }); }))), tb));
    }
    function describe(e) {
      var p = { x: Math.round(e.x), y: Math.round(e.y), w: Math.round(e.w), h: Math.round(e.h) };
      if (e.type === 'text') return t('dsAltText', { n: e.id, s: String(e.text).replace(/\n/g, ' / '), z: e.size, f: t('dsFont_' + e.font), c: e.fill, x: p.x, y: p.y });
      return t('dsAltShape', { k: t('dsType_' + e.type), n: e.id, c: e.type === 'line' ? e.stroke : e.fill, x: p.x, y: p.y, w: p.w, h: p.h });
    }
    function renderAlt() {
      T.clear(altBox); var f = F();
      altBox.appendChild(h('h3', { text: t('dsAltTitle') }));
      altBox.appendChild(h('p', { text: t('dsAltBoard', { f: t('dsFormat_' + doc.format), w: f.w, h: f.h, c: doc.bg, n: doc.els.length }) }));
      if (doc.els.length) altBox.appendChild(h('ol', null, doc.els.map(function (e) { return h('li', { text: describe(e) }); })));
      canvas.setAttribute('aria-label', t('dsCanvasLabel', { f: t('dsFormat_' + doc.format), n: doc.els.length, s: sel >= 0 ? nameOf(doc.els[sel]) : t('dsNone') }));
    }

    /* ---------- Dibujo ---------- */
    var ctx, dispW = 700, dispH = 500, scale = 1, ox = 0, oy = 0;
    function resize() {
      var f = F(), w = Math.max(260, box.clientWidth || 700), maxH = Math.max(280, Math.min(720, (window.innerHeight || 800) * 0.72));
      var pad = 18; scale = Math.min((w - pad * 2) / f.w, (maxH - pad * 2) / f.h);
      dispW = w; dispH = Math.round(f.h * scale + pad * 2); ox = Math.round((w - f.w * scale) / 2); oy = pad;
      ctx = T.fitCanvas(canvas, dispW, dispH); canvas.style.height = dispH + 'px'; draw();
    }
    function paintEl(c, e) {
      c.save(); c.globalAlpha = e.op === undefined ? 1 : e.op;
      c.translate(e.x + e.w / 2, e.y + (e.type === 'text' ? D.textHeight(e) : e.h) / 2); c.rotate((e.rot || 0) * Math.PI / 180);
      var w = e.w / 2, hh = e.h / 2;
      if (e.type === 'text') {
        c.font = D.fontCss(e); c.fillStyle = e.fill; c.textBaseline = 'top';
        var th = D.textHeight(e), lh = e.size * (e.lh || 1.2), al = e.align || 'left';
        if ('letterSpacing' in c) c.letterSpacing = (e.ls || 0) + 'px';
        D.textLines(e).forEach(function (l, i) {
          var lw = c.measureText(l).width, x = al === 'center' ? -lw / 2 : al === 'right' ? w - lw : -w;
          c.textAlign = 'left'; c.fillText(l, x, -th / 2 + i * lh + (lh - e.size) / 2);
        });
      } else {
        c.beginPath();
        if (e.type === 'rect') { var r = Math.max(0, Math.min(e.r || 0, Math.abs(w), Math.abs(hh))); if (c.roundRect) c.roundRect(-w, -hh, e.w, e.h, r); else c.rect(-w, -hh, e.w, e.h); }
        else if (e.type === 'ellipse') c.ellipse(0, 0, Math.abs(w), Math.abs(hh), 0, 0, Math.PI * 2);
        else if (e.type === 'line') { c.moveTo(-w, -hh); c.lineTo(w, hh); }
        else { D.polyPoints(e).forEach(function (p, i) { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.closePath(); }
        if (e.type !== 'line' && e.fill && e.fill !== 'none') { c.fillStyle = e.fill; c.fill(); }
        if ((e.sw || 0) > 0 && e.stroke) { c.strokeStyle = e.stroke; c.lineWidth = e.sw; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
      }
      c.restore();
    }
    function paintDoc(c) { var f = F(); c.fillStyle = doc.bg; c.fillRect(0, 0, f.w, f.h); doc.els.forEach(function (e) { paintEl(c, e); }); }
    function draw() {
      if (!ctx) return; var c = ctx, f = F();
      c.setTransform(canvas.width / dispW, 0, 0, canvas.height / dispH, 0, 0);
      c.fillStyle = '#e9edf2'; c.fillRect(0, 0, dispW, dispH);
      c.save(); c.translate(ox, oy); c.scale(scale, scale);
      c.save(); c.beginPath(); c.rect(0, 0, f.w, f.h); c.clip(); paintDoc(c); c.restore();
      if (ui.grid && !printing) {
        c.strokeStyle = 'rgba(23,57,92,.14)'; c.lineWidth = 1 / scale; var step = Math.min(f.w, f.h) >= 400 ? 20 : 10;
        c.beginPath(); for (var gx = step; gx < f.w; gx += step) { c.moveTo(gx, 0); c.lineTo(gx, f.h); } for (var gy = step; gy < f.h; gy += step) { c.moveTo(0, gy); c.lineTo(f.w, gy); } c.stroke();
        c.strokeStyle = 'rgba(168,51,111,.35)'; c.beginPath(); c.moveTo(f.w / 2, 0); c.lineTo(f.w / 2, f.h); c.moveTo(0, f.h / 2); c.lineTo(f.w, f.h / 2); c.stroke();
      }
      c.strokeStyle = '#46566b'; c.lineWidth = 1 / scale; c.strokeRect(0, 0, f.w, f.h);
      if (sel >= 0 && doc.els[sel] && !printing) {
        var e = doc.els[sel], eh = e.type === 'text' ? D.textHeight(e) : e.h;
        c.save(); c.translate(e.x + e.w / 2, e.y + eh / 2); c.rotate((e.rot || 0) * Math.PI / 180);
        var bx = -Math.abs(e.w) / 2 - 4 / scale, by = -Math.abs(eh) / 2 - 4 / scale, bw = Math.abs(e.w) + 8 / scale, bh = Math.abs(eh) + 8 / scale;
        c.lineWidth = 2 / scale; c.strokeStyle = '#ffffff'; c.strokeRect(bx, by, bw, bh);
        c.setLineDash([6 / scale, 4 / scale]); c.strokeStyle = '#5b3fa0'; c.strokeRect(bx, by, bw, bh); c.setLineDash([]);
        if (e.type !== 'text') { var hs = 12 / scale; c.fillStyle = '#5b3fa0'; c.fillRect(bx + bw - hs / 2, by + bh - hs / 2, hs, hs); c.strokeStyle = '#fff'; c.strokeRect(bx + bw - hs / 2, by + bh - hs / 2, hs, hs); }
        c.restore();
      }
      c.restore();
    }

    /* ---------- Puntero ---------- */
    function toDoc(ev) { var r = canvas.getBoundingClientRect(); return [(ev.clientX - r.left - ox) / scale, (ev.clientY - r.top - oy) / scale]; }
    function hitAt(p) { for (var i = doc.els.length - 1; i >= 0; i--) { var e = doc.els[i], hh = e.type === 'text' ? D.textHeight(e) : e.h; if (D.hits({ type: e.type, x: e.x, y: e.y, w: e.w, h: hh, rot: e.rot, sw: e.sw }, p[0], p[1], 6 / scale)) return i; } return -1; }
    function onHandle(p) {
      if (sel < 0) return false; var e = doc.els[sel]; if (e.type === 'text') return false;
      var l = D.toLocal(e, p[0], p[1]); return Math.abs(l[0] - (Math.abs(e.w) / 2 + 4 / scale)) < 14 / scale && Math.abs(l[1] - (Math.abs(e.h) / 2 + 4 / scale)) < 14 / scale;
    }
    var drag = null;
    canvas.addEventListener('pointerdown', function (ev) {
      var p = toDoc(ev);
      if (onHandle(p)) { var e0 = doc.els[sel]; drag = { mode: 'size', before: history.snapshot(), start: p, w: e0.w, h: e0.h, moved: false }; }
      else {
        var i = hitAt(p); sel = i;
        if (i >= 0) { var e = doc.els[i]; drag = { mode: 'move', before: history.snapshot(), start: p, x: e.x, y: e.y, moved: false }; }
        renderAll(); T.say(i >= 0 ? t('dsSelected', { n: nameOf(doc.els[i]) }) : t('dsNone'));
      }
      if (drag) { canvas.setPointerCapture(ev.pointerId); ev.preventDefault(); }
    });
    canvas.addEventListener('pointermove', function (ev) {
      if (!drag || sel < 0) return; var p = toDoc(ev), e = doc.els[sel], dx = p[0] - drag.start[0], dy = p[1] - drag.start[1];
      if (Math.abs(dx) + Math.abs(dy) > 0.5) drag.moved = true;
      if (drag.mode === 'move') { e.x = snapV(drag.x + dx); e.y = snapV(drag.y + dy); }
      else { var a = -(e.rot || 0) * Math.PI / 180, lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
        e.w = e.type === 'line' ? snapV(drag.w + lx) : Math.max(4, snapV(drag.w + lx)); e.h = e.type === 'line' ? snapV(drag.h + ly) : Math.max(4, snapV(drag.h + ly)); if (ev.shiftKey && e.type !== 'line') e.h = e.w * drag.h / drag.w; }
      draw();
    });
    function endDrag() { if (!drag) return; var d = drag; drag = null; if (d.moved) { history.commit(d.before); renderAll(); } }
    canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('keydown', function (ev) {
      var k = ev.key, e = sel >= 0 ? doc.els[sel] : null;
      if (k === '[' || k === ']') { if (!doc.els.length) return; ev.preventDefault(); sel = sel < 0 ? (k === ']' ? 0 : doc.els.length - 1) : (sel + (k === ']' ? 1 : -1) + doc.els.length) % doc.els.length; renderAll(); T.say(t('dsSelected', { n: nameOf(doc.els[sel]) })); return; }
      if (k === 'Escape') { if (sel >= 0) { sel = -1; renderAll(); T.say(t('dsNone')); ev.preventDefault(); } return; }
      if (!e) return;
      var st = ev.shiftKey ? 10 : 1;
      if (/^Arrow/.test(k)) { ev.preventDefault(); edit(function () { if (k === 'ArrowLeft') e.x -= st; if (k === 'ArrowRight') e.x += st; if (k === 'ArrowUp') e.y -= st; if (k === 'ArrowDown') e.y += st; }); T.say('X ' + Math.round(e.x) + ', Y ' + Math.round(e.y)); }
      else if (k === '+' || k === '-') { ev.preventDefault(); var fct = k === '+' ? 1.1 : 1 / 1.1; edit(function () { if (e.type === 'text') e.size = Math.max(6, Math.min(400, Math.round(e.size * fct))); else { var cx = e.x + e.w / 2, cy = e.y + e.h / 2; e.w = Math.round(e.w * fct); e.h = Math.round(e.h * fct); e.x = Math.round(cx - e.w / 2); e.y = Math.round(cy - e.h / 2); } }); T.say(e.type === 'text' ? t('dsSize') + ' ' + e.size : t('dsW') + ' ' + e.w + ', ' + t('dsH') + ' ' + e.h); }
      else if (k === 'PageUp') { ev.preventDefault(); moveOrder(sel, 1); }
      else if (k === 'PageDown') { ev.preventDefault(); moveOrder(sel, -1); }
      else if (k === 'Delete' || k === 'Backspace') { ev.preventDefault(); delSel(); }
      else if ((ev.ctrlKey || ev.metaKey) && (k === 'd' || k === 'D')) { ev.preventDefault(); dupSel(); }
    });

    /* ---------- Informe y retos ---------- */
    function renderResult() {
      T.clear(resultBox);
      var texts = []; doc.els.forEach(function (e, i) { if (e.type === 'text') texts.push(i); });
      var cols = D.coloursUsed(doc);
      var li = [t('dsCountLine', { n: doc.els.length, c: cols.length })];
      texts.forEach(function (i) { var r = D.textContrast(doc, i), e = doc.els[i]; li.push((r.aa ? '✓ ' : '· ') + t('dsTextLine', { n: nameOf(e), r: T.num(r.ratio, 2), l: r.large ? t('dsLarge') : t('dsNormal'), a: r.aaa ? 'AAA' : r.aa ? 'AA' : t('dsLow') })); });
      if (!texts.length) li.push(t('dsNoTexts'));
      resultBox.appendChild(h('ul', { class: 'igt-limits igt-checks', role: 'list' }, li.map(function (x) { return h('li', { text: x }); })));
    }
    function currentRules() { var ch = retos.current(); if (!ch) return null; return ch.random ? (brief ? brief.rules : null) : ch.rules; }
    function checkChallenge() {
      T.clear(checkBox); var R = currentRules(); if (!R) return;
      var r = D.check(doc, R);
      checkBox.appendChild(T.result(r.ok, r.ok ? t('dsDone') : t('dsNotYet')));
      checkBox.appendChild(h('ul', { class: 'igt-limits igt-checks', role: 'list' }, r.items.map(function (x) {
        var v = {}; Object.keys(x.vars).forEach(function (k) { v[k] = k === 'f' ? t('dsFormat_' + x.vars[k]) : x.vars[k]; });
        return h('li', { text: (x.ok ? '✓ ' : '· ') + t('dsChk_' + x.key, v) });
      })));
    }
    var briefBox = h('p', { class: 'igt-tip' });
    function briefText() {
      if (!brief) return ''; var R = brief.rules, th = (T.dict.dsThemes || [])[brief.theme] || '';
      return t('dsBrief', { th: th, f: t('dsFormat_' + R.format), c: R.maxColours, n: R.minTexts, b: R.bigText, a: R.contrast });
    }
    function onPick(ch) {
      brief = null;
      if (ch && ch.random) brief = D.randomBrief(Date.now() & 0xffffffff);
      if (ch && ch.preset) {
        var p = sanitize(ch.preset); edit(function () { p.title = doc.title; doc = p; sel = -1; });
      } else if (ch && (ch.rules || {}).format && ch.rules.format !== doc.format && !doc.els.length) { edit(function () { doc.format = ch.rules.format; }); }
      else renderAll();
      if (!ch) return null;
      var w = h('div', { class: 'igt-noprint' });
      if (ch.random) {
        w.appendChild(T.btn(t('dsAnother'), { icon: 'reiniciar', onClick: function () { brief = D.randomBrief((Date.now() * 7) & 0xffffffff); briefBox.textContent = briefText(); renderAll(); T.say(briefText()); } }));
        briefBox.textContent = briefText(); w.appendChild(briefBox);
      }
      if ((currentRules() || {}).format) w.appendChild(T.btn(t('dsUseFormat'), { onClick: function () { var R = currentRules(); edit(function () { doc.format = R.format; }); T.say(t('dsFormat_' + R.format)); } }));
      return w;
    }

    /* ---------- Exportar ---------- */
    function renderFull(mult) {
      var f = F(), c = document.createElement('canvas'); c.width = Math.round(f.w * mult); c.height = Math.round(f.h * mult);
      var x = c.getContext('2d'); x.scale(mult, mult); paintDoc(x); return c;
    }
    function fileBase() { return 'iris-green-diseno-' + (T.slug(doc.title) || T.stamp()); }
    function exportPng() { var f = F(), mult = Math.max(1, Math.min(4, 1600 / Math.max(f.w, f.h))); T.exportPNG(renderFull(mult), f.w, f.h, fileBase() + '.png', (doc.title || t('dsUntitled')) + ' · ' + t('dsMadeIn')); }
    function xmlEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function svgEl(e) {
      var eh = e.type === 'text' ? D.textHeight(e) : e.h, cx = e.x + e.w / 2, cy = e.y + eh / 2, w = e.w / 2, hh = e.h / 2;
      var tr = 'translate(' + r2(cx) + ' ' + r2(cy) + ')' + (e.rot ? ' rotate(' + r2(e.rot) + ')' : ''), op = e.op === undefined || e.op === 1 ? '' : ' opacity="' + r2(e.op) + '"';
      var st = (e.sw || 0) > 0 && e.stroke ? ' stroke="' + xmlEsc(e.stroke) + '" stroke-width="' + r2(e.sw) + '" stroke-linejoin="round" stroke-linecap="round"' : '';
      var fill = e.type === 'line' ? ' fill="none"' : ' fill="' + xmlEsc(e.fill || 'none') + '"';
      if (e.type === 'rect') return '<rect transform="' + tr + '" x="' + r2(-w) + '" y="' + r2(-hh) + '" width="' + r2(e.w) + '" height="' + r2(e.h) + '" rx="' + r2(e.r || 0) + '"' + fill + st + op + '/>';
      if (e.type === 'ellipse') return '<ellipse transform="' + tr + '" rx="' + r2(Math.abs(w)) + '" ry="' + r2(Math.abs(hh)) + '"' + fill + st + op + '/>';
      if (e.type === 'line') return '<line transform="' + tr + '" x1="' + r2(-w) + '" y1="' + r2(-hh) + '" x2="' + r2(w) + '" y2="' + r2(hh) + '"' + fill + st + op + '/>';
      if (e.type === 'text') {
        var lh = e.size * (e.lh || 1.2), al = e.align || 'left', anchor = al === 'center' ? 'middle' : al === 'right' ? 'end' : 'start', ax = al === 'center' ? 0 : al === 'right' ? w : -w;
        var tsp = D.textLines(e).map(function (l, i) { return '<tspan x="' + r2(ax) + '" y="' + r2(-eh / 2 + i * lh + (lh - e.size) / 2 + e.size * 0.8) + '">' + xmlEsc(l) + '</tspan>'; }).join('');
        return '<text transform="' + tr + '" font-family="' + xmlEsc(D.FONTS[e.font] || D.FONTS.atkinson) + '" font-size="' + r2(e.size) + '" font-weight="' + (e.weight || 400) + '"' + (e.italic ? ' font-style="italic"' : '') + (e.ls ? ' letter-spacing="' + r2(e.ls) + '"' : '') + ' text-anchor="' + anchor + '" fill="' + xmlEsc(e.fill) + '"' + op + '>' + tsp + '</text>';
      }
      return '<polygon transform="' + tr + '" points="' + D.polyPoints(e).map(function (p) { return r2(p[0]) + ',' + r2(p[1]); }).join(' ') + '"' + fill + st + op + '/>';
    }
    function r2(v) { return Math.round(v * 100) / 100; }
    function exportSvg() {
      var f = F(), strip = Math.max(28, Math.round(f.h * 0.06)), fs = Math.max(11, Math.round(strip * 0.42)), title = doc.title || t('dsUntitled');
      var svg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + f.w + ' ' + (f.h + strip) + '" width="' + f.w + '" height="' + (f.h + strip) + '" role="img" aria-labelledby="t d">'
        + '<title id="t">' + xmlEsc(title) + '</title><desc id="d">' + xmlEsc(doc.els.map(describe).join(' ')) + '</desc>'
        + '<rect width="' + f.w + '" height="' + f.h + '" fill="' + xmlEsc(doc.bg) + '"/>' + doc.els.map(svgEl).join('')
        + '<g><rect y="' + f.h + '" width="' + f.w + '" height="' + strip + '" fill="#f4f6f9"/><text x="' + (f.w - 10) + '" y="' + (f.h + strip / 2) + '" dominant-baseline="middle" text-anchor="end" font-family="Arial, sans-serif" font-size="' + fs + '" fill="#4a5a6e">IRIS GREEN · irisgreen.eu</text></g></svg>\n';
      var name = fileBase() + '.svg'; T.download(name, new Blob([svg], { type: 'image/svg+xml' })); T.say(t('dsSvgSaved', { name: name }));
    }

    /* ---------- Abrir y pintar todo ---------- */
    function loadDoc(d) { doc = sanitize(d); sel = -1; fixTexts(); history.reset(); renderAll(); }
    function sanitize(d) {
      if (!d || !Array.isArray(d.els)) throw new Error('bad');
      var nd = blank(); nd.format = D.FORMATS[d.format] ? d.format : 'cartel'; nd.bg = D.norm(d.bg) || '#ffffff'; nd.title = String(d.title || '').slice(0, 80);
      var n = function (v, a, b, def) { v = +v; return isFinite(v) ? Math.max(a, Math.min(b, v)) : def; };
      nd.els = d.els.slice(0, 200).filter(function (e) { return e && TYPES.indexOf(e.type) >= 0; }).map(function (e, i) {
        var o = { id: i + 1, type: e.type, x: n(e.x, -5000, 5000, 0), y: n(e.y, -5000, 5000, 0), w: n(e.w, -5000, 5000, 50), h: n(e.h, -5000, 5000, 50), rot: n(e.rot, -360, 360, 0), op: n(e.op, 0.05, 1, 1),
          fill: e.fill === 'none' ? 'none' : (D.norm(e.fill) || '#17395c'), stroke: D.norm(e.stroke) || '#1b1f24', sw: n(e.sw, 0, 80, 0) };
        if (e.type === 'rect') o.r = n(e.r, 0, 5000, 0);
        if (e.type === 'poly' || e.type === 'star') o.sides = Math.round(n(e.sides, 3, 12, 5));
        if (e.type === 'star') o.inner = n(e.inner, 0.1, 0.9, 0.45);
        if (e.type === 'text') { o.text = String(e.text || ' ').slice(0, 400); o.size = n(e.size, 6, 400, 24); o.font = D.FONTS[e.font] ? e.font : 'atkinson'; o.weight = +e.weight === 700 ? 700 : 400; o.italic = !!e.italic; o.align = ['left', 'center', 'right'].indexOf(e.align) >= 0 ? e.align : 'left'; o.ls = n(e.ls, -5, 40, 0); o.lh = n(e.lh, 0.8, 3, 1.2); }
        return o;
      });
      nd.nextId = nd.els.length + 1; return nd;
    }
    function focusKey() { var a = document.activeElement; if (!a || !app.contains(a) || a === canvas) return null; return a.id ? '#' + a.id : a.getAttribute('data-fk') ? '[data-fk="' + a.getAttribute('data-fk') + '"]' : null; }
    var busy = false, again = false;
    function renderAll() {
      if (busy) { again = true; return; }
      busy = true;
      try { var n = 0; do { again = false; renderAllNow(); } while (again && ++n < 3); } finally { busy = false; }
    }
    function renderAllNow() {
      var fkey = focusKey();
      formatSel.value = doc.format; bgIn.value = D.norm(doc.bg) || '#ffffff'; if (document.activeElement !== titleIn) titleIn.value = doc.title || '';
      renderProps(); renderLayers(); renderAlt(); renderResult(); checkChallenge(); resize();
      if (fkey) { var el = app.querySelector(fkey); if (el && !el.disabled) el.focus(); }
    }
    if (window.ResizeObserver) new ResizeObserver(function () { if (Math.abs(box.clientWidth - dispW) > 2) resize(); }).observe(box);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fixTexts(); renderAll(); });
    renderAll();
  });
})(window, document);
