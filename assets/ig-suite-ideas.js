/* Iris Green · El taller · Estudio de ideas e inventos (R43).
   Tablero de ideas y mapa mental, las seis mesas de calentamiento, técnicas guiadas (SCAMPER,
   usos alternativos, combinar objetos, cambiar el punto de vista, 8 ideas en 8 minutos),
   evaluación con matrices y ficha de invento con restricciones reales y boceto.
   Todo con teclado y clics: nada obliga a arrastrar. El trabajo solo sale al descargar un archivo. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG || !D) return;
  var LANG = IG.lang, SVGNS = 'http://www.w3.org/2000/svg';

  var VIEWS = ['board', 'stories', 'whatif', 'combine', 'shapes', 'uses', 'pov', 'scamper', 'sprint', 'matrix', 'sheet'];
  var GROUPS = [
    ['grpBoard', ['board']],
    ['grpTables', ['stories', 'whatif', 'combine', 'shapes', 'uses', 'pov']],
    ['grpTechniques', ['scamper', 'sprint']],
    ['grpEvaluate', ['matrix']],
    ['grpInvention', ['sheet']]
  ];
  var TABLE_VIEW = { stories: 1, whatif: 2, combine: 3, shapes: 4, uses: 5, pov: 6 };
  var THEMES = ['libre', 'cielo', 'animales', 'transporte'];
  var LETTERS = ['S', 'C', 'A', 'M', 'P', 'E', 'R'];
  var NOTE_COLOURS = [['#fff3c4', 'colYellow'], ['#dbe9fb', 'colBlue'], ['#e6f6e2', 'colGreen'], ['#fbe0e6', 'colPink'], ['#ece6fb', 'colViolet'], ['#f1f1f1', 'colGrey']];
  var SHAPES = { circ: 'M0,-40A40,40 0 1,1 0,40A40,40 0 1,1 0,-40Z', tri: 'M0,-44L40,30L-40,30Z', cuad: 'M-34,-34H34V34H-34Z', arco: 'M-40,20A40,40 0 0,1 40,20L24,20A24,24 0 0,0 -24,20Z', gota: 'M0,-44C24,-10 34,6 34,18A34,34 0 0,1 -34,18C-34,6 -24,-10 0,-44Z' };
  var SHAPE_KEYS = ['circ', 'tri', 'cuad', 'arco', 'gota'];
  var FILLS = ['#17395c', '#5a49a8', '#a8336f', '#197991', '#1f5f8b'];
  var INK = '#172b42', SOFT = '#44586c', LINE = '#c9d8e6';
  var FONT = '"Atkinson Hyperlegible", system-ui, sans-serif';
  /* Los ocho retos del estudio anterior, en cuatro niveles. Los textos están en el módulo de idioma. */
  var CHALLENGES = [
    { id: 'i1', level: 1, scamper: 1, object: true },
    { id: 'i2', level: 1, scamper: 3 },
    { id: 'i3', level: 2, brief: { budget: 5, size: [15, 10, 10], weight: 150, minParts: 2 } },
    { id: 'i4', level: 2, brief: { budget: 10, size: [20, 10, 5], weight: 300, minParts: 3, extra: true } },
    { id: 'i5', level: 3, brief: { budget: 15, size: [33, 20, 12], weight: 800, minParts: 4 } },
    { id: 'i6', level: 3, brief: { budget: 8, size: [30, 20, 20], weight: 600, minParts: 3, extra: true } },
    { id: 'i7', level: 3, brief: { budget: 12, size: [40, 15, 10], weight: 500, minParts: 3 } },
    { id: 'i8', level: 4, random: true }
  ];

  IG.defineEngine('ideas', {
    version: 1, fileBase: LANG === 'en' ? 'ideas' : 'ideas',
    extraKeys: ['kIdeasBoard', 'kIdeasViews'],
    initialStart: function (para) { return { child: 'toy', teen: 'sprint', adult: 'brief' }[para] || 'tables'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'toy', title: t('stToy'), desc: t('stToyD'), para: 'child' },
        { id: 'sprint', title: t('stSprint'), desc: t('stSprintD'), para: 'teen' },
        { id: 'brief', title: t('stBrief'), desc: t('stBriefD'), para: 'adult' },
        { id: 'tables', title: t('stTables'), desc: t('stTablesD'), para: 'any' },
        { id: 'map', title: t('stMap'), desc: t('stMapD'), para: 'any' },
        { id: 'decide', title: t('stDecide'), desc: t('stDecideD'), para: 'adult' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function str(v, n) { return String(v === undefined || v === null ? '' : v).slice(0, n || 600); }
  function numv(v) { var n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : 0; }
  function lines(text) { return String(text || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(function (x) { return x.length > 1; }); }

  function defaults() {
    return {
      v: 1, view: 'board', theme: 'libre', mode: 'sencillo', seed: 'iris', rc: 0, challenge: null, sel: null,
      board: { items: [], links: [], next: 1 },
      stories: { idx: { personaje: 0, lugar: 0, objeto: 0, situacion: 0 }, locks: {}, text: '' },
      whatif: { i: 0, own: '', answers: [], hints: false },
      combine: { a: 0, b: 1, name: '', para: '', como: '', improve: -1 },
      shapes: { list: [], sel: -1, title: '', reto: 0, next: 1 },
      uses: { obj: 0, list: [], dir: -1 },
      pov: { scene: 0, active: 0, texts: {} },
      scamper: { object: '', answers: ['', '', '', '', '', '', ''] },
      sprint: { minutes: 8, target: 8, problem: '', ideas: [], left: 480 },
      matrix: { items: [], criteria: [], next: 1 },
      sheet: { name: '', problem: '', who: '', how: '', test: '', better: '', size: ['', '', ''], parts: [], brief: null, sketch: [] }
    };
  }

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, num = ctx.num, vp = ctx.viewport;
    var S = defaults(), tool = 'bselect', pending = null, kc = { x: 120, y: 90 }, cursorShown = false;
    ctx.setTech('renderer', 'Canvas 2D + SVG');

    /* ---------- Listas curadas: vienen del módulo de idioma, separadas por barras ---------- */
    function split1(key) { return t(key).split('|'); }
    function bankOf(key) {
      var groups = t(key).split('||'), all = (groups[0] || '').split('|').filter(Boolean);
      var i = THEMES.indexOf(S.theme);
      if (i > 0 && groups[i]) all = all.concat(groups[i].split('|').filter(Boolean));
      return all;
    }
    function scenes() {
      var groups = t('t6Scenes').split('|||'), all = (groups[0] || '').split('||').filter(Boolean);
      var i = THEMES.indexOf(S.theme);
      if (i > 0 && groups[i]) all = all.concat(groups[i].split('||').filter(Boolean));
      return all.map(function (sc) {
        var p = sc.split('>>');
        return { text: (p[0] || '').trim(), views: (p[1] || '').split('|').map(function (x) { return x.trim(); }).filter(Boolean) };
      });
    }
    /* Azar reproducible: la semilla y un contador viajan en el proyecto, así deshacer y rehacer repiten lo mismo. */
    function rnd() { var f = ctx.rng(S.seed + '|' + S.rc); S.rc += 1; return f(); }
    function pick(list, not) {
      if (!list.length) return 0;
      if (list.length < 2) return 0;
      var i, guard = 0;
      do { i = Math.floor(rnd() * list.length); guard += 1; } while (i === not && guard < 12);
      return i;
    }

    /* ---------- Escenario: lienzo (tablero y formas) y panel de trabajo (formularios) ---------- */
    var canvas = h('canvas', { class: 'igi-canvas', 'aria-hidden': 'true' });
    var pane = h('div', { class: 'igi-pane' });
    var stage = h('div', { class: 'igi-stage' }, canvas, pane);
    vp.appendChild(stage); vp.classList.add('igi-viewport');
    function usesCanvas() { return S.view === 'board' || S.view === 'shapes'; }
    var drawReq = 0;
    function draw() { if (!drawReq) drawReq = root.requestAnimationFrame(function () { drawReq = 0; drawNow(); }); }
    function sizeCanvas() {
      var r = stage.getBoundingClientRect(), dpr = Math.min(2, root.devicePixelRatio || 1);
      var w = Math.max(10, Math.round(r.width)), hh = Math.max(10, Math.round(r.height));
      if (canvas.width !== Math.round(w * dpr)) canvas.width = Math.round(w * dpr);
      if (canvas.height !== Math.round(hh * dpr)) canvas.height = Math.round(hh * dpr);
      return { w: w, h: hh, dpr: dpr };
    }
    function drawNow() {
      if (!usesCanvas()) return;
      var a = sizeCanvas(), g = canvas.getContext('2d');
      g.setTransform(a.dpr, 0, 0, a.dpr, 0, 0); g.clearRect(0, 0, a.w, a.h);
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, a.w, a.h);
      if (S.view === 'board') drawBoard(g, a.w, a.h, false); else drawShapes(g, a.w, a.h, false);
    }
    if (root.ResizeObserver) new ResizeObserver(function () { drawNow(); }).observe(stage);

    function txt(g, s, x, y, o) {
      o = o || {};
      g.font = (o.weight || 600) + ' ' + (o.size || 13) + 'px ' + FONT;
      g.fillStyle = o.color || INK; g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic';
      g.fillText(s, x, y);
    }
    function wrap(g, text, maxW, size, weight) {
      g.font = (weight || 600) + ' ' + size + 'px ' + FONT;
      var words = String(text || '').split(/\s+/), out = [], cur = '';
      words.forEach(function (w) {
        var next = cur ? cur + ' ' + w : w;
        if (g.measureText(next).width > maxW && cur) { out.push(cur); cur = w; } else cur = next;
      });
      if (cur) out.push(cur);
      return out.length ? out : [''];
    }

    /* ================= Tablero de ideas y mapa mental ================= */
    var NOTE_W = 168, NODE_W = 132;
    function items() { return S.board.items; }
    function itemById(id) { var l = items(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
    function itemBox(g, it) {
      var w = it.kind === 'node' ? NODE_W : NOTE_W, size = it.kind === 'node' ? 13 : 13;
      var ls = wrap(g, it.text || t('emptyNote'), w - 20, size);
      var hh = Math.max(it.kind === 'node' ? 44 : 56, 16 + ls.length * (size + 4));
      return { x: it.x, y: it.y, w: w, h: hh, lines: ls, size: size };
    }
    function drawBoard(g, W, H, exporting) {
      var list = items();
      if (!list.length) {
        txt(g, t('boardEmpty'), W / 2, H / 2 - 10, { align: 'center', size: 15, color: SOFT });
        txt(g, t('boardEmptyHow'), W / 2, H / 2 + 14, { align: 'center', size: 13, color: SOFT, weight: 500 });
      }
      g.strokeStyle = '#7d93a8'; g.lineWidth = 2;
      S.board.links.forEach(function (lk) {
        var a = itemById(lk.a), b = itemById(lk.b); if (!a || !b) return;
        var ba = itemBox(g, a), bb = itemBox(g, b);
        g.beginPath(); g.moveTo(ba.x + ba.w / 2, ba.y + ba.h / 2); g.lineTo(bb.x + bb.w / 2, bb.y + bb.h / 2); g.stroke();
      });
      list.forEach(function (it) {
        var b = itemBox(g, it), selected = it.id === S.sel && !exporting;
        g.save();
        g.fillStyle = it.colour || NOTE_COLOURS[0][0];
        g.strokeStyle = selected ? '#5a49a8' : SOFT; g.lineWidth = selected ? 3 : 1.5;
        if (it.kind === 'node') { roundRect(g, b.x, b.y, b.w, b.h, Math.min(b.h / 2, 22)); } else { roundRect(g, b.x, b.y, b.w, b.h, 8); }
        g.fill(); g.stroke();
        b.lines.forEach(function (ln, i) { txt(g, ln, b.x + 10, b.y + 22 + i * (b.size + 4), { size: b.size, weight: it.kind === 'node' ? 700 : 600 }); });
        g.restore();
      });
      if (!exporting && pending && pending.kind === 'link') {
        var a2 = itemById(pending.a);
        if (a2) { var ba2 = itemBox(g, a2); g.setLineDash([6, 4]); g.strokeStyle = '#5a49a8'; g.lineWidth = 2; g.beginPath(); g.moveTo(ba2.x + ba2.w / 2, ba2.y + ba2.h / 2); g.lineTo(kc.x, kc.y); g.stroke(); g.setLineDash([]); }
      }
      if (!exporting) drawCursor(g);
    }
    function roundRect(g, x, y, w, hh, r) {
      g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r);
      g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
    }
    function drawCursor(g) {
      g.save(); g.globalAlpha = cursorShown ? 1 : 0.35; g.strokeStyle = '#b3261e'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(kc.x - 10, kc.y); g.lineTo(kc.x + 10, kc.y); g.moveTo(kc.x, kc.y - 10); g.lineTo(kc.x, kc.y + 10); g.stroke(); g.restore();
    }
    function addItem(kind, text, colour) {
      var id = 'n' + S.board.next; S.board.next += 1;
      var it = { id: id, kind: kind, text: text || '', colour: colour || NOTE_COLOURS[kind === 'node' ? 4 : 0][0], x: Math.round(kc.x - (kind === 'node' ? NODE_W : NOTE_W) / 2), y: Math.round(kc.y - 28) };
      it.x = Math.max(4, it.x); it.y = Math.max(4, it.y);
      S.board.items.push(it); S.sel = id;
      return it;
    }
    function removeItem(id) {
      S.board.items = S.board.items.filter(function (x) { return x.id !== id; });
      S.board.links = S.board.links.filter(function (l) { return l.a !== id && l.b !== id; });
      if (S.sel === id) S.sel = null;
    }
    function linked(a, b) { return S.board.links.some(function (l) { return (l.a === a && l.b === b) || (l.a === b && l.b === a); }); }
    function toggleLink(a, b) {
      if (a === b) return false;
      if (linked(a, b)) { S.board.links = S.board.links.filter(function (l) { return !((l.a === a && l.b === b) || (l.a === b && l.b === a)); }); return false; }
      S.board.links.push({ a: a, b: b }); return true;
    }
    function hitAt(x, y) {
      var g = canvas.getContext('2d'), list = items(), found = null;
      list.forEach(function (it) { var b = itemBox(g, it); if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) found = it; });
      return found;
    }
    /* Guarda una idea de cualquier mesa o técnica como nota del tablero (el antiguo «Mi cuaderno»). */
    function saveToBoard(title, text, colourIndex) {
      var g = canvas.getContext('2d'), n = items().length;
      kc.x = 40 + (n % 4) * 190 + NOTE_W / 2; kc.y = 40 + Math.floor(n / 4) * 130 + 28;
      var it = addItem('note', (title ? title + '\n' : '') + text, NOTE_COLOURS[colourIndex % NOTE_COLOURS.length][0]);
      commit(t('savedToBoard'));
      ctx.announce(t('savedToBoard'));
      return it;
    }

    /* ================= Mesa 4: transforma la forma ================= */
    var GRID = 9, CELL = 40;
    function shapeName(s) { return split1('shapeNames')[SHAPE_KEYS.indexOf(s.t)] || s.t; }
    function fillName(i) { return split1('fillNames')[i] || String(i); }
    function describeShape(s, i) {
      return (i + 1) + '. ' + shapeName(s) + ', ' + fillName(s.c) + ', ' + t('rowN', { n: s.r + 1 }) + ', ' + t('colN', { n: s.col + 1 }) +
        (s.rot ? ', ' + t('turnedN', { n: s.rot }) : '') + (s.sc !== 1 ? ', ' + t('sizeN', { n: Math.round(s.sc * 100) }) : '') + (s.flip ? ', ' + t('mirrored') : '');
    }
    function drawShapes(g, W, H, exporting) {
      var side = Math.min(W - 20, H - 20), sc = side / (GRID * CELL), ox = (W - side) / 2, oy = (H - side) / 2;
      g.save(); g.translate(ox, oy); g.scale(sc, sc);
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, GRID * CELL, GRID * CELL);
      g.strokeStyle = '#dfe6ef'; g.lineWidth = 1 / sc;
      for (var i = 1; i < GRID; i++) { g.beginPath(); g.moveTo(i * CELL, 0); g.lineTo(i * CELL, GRID * CELL); g.stroke(); g.beginPath(); g.moveTo(0, i * CELL); g.lineTo(GRID * CELL, i * CELL); g.stroke(); }
      S.shapes.list.forEach(function (s, idx) {
        var p = new Path2D(SHAPES[s.t] || SHAPES.circ);
        g.save();
        g.translate(s.col * CELL + CELL / 2, s.r * CELL + CELL / 2);
        g.rotate(s.rot * Math.PI / 180);
        g.scale((s.flip ? -s.sc : s.sc) * 0.5, s.sc * 0.5);
        g.fillStyle = FILLS[s.c % FILLS.length]; g.fill(p);
        g.restore();
        if (!exporting && idx === S.shapes.sel) {
          g.save(); g.translate(s.col * CELL + CELL / 2, s.r * CELL + CELL / 2);
          g.strokeStyle = '#b3261e'; g.lineWidth = 2 / sc; g.setLineDash([6 / sc, 4 / sc]);
          g.strokeRect(-CELL * 0.6, -CELL * 0.6, CELL * 1.2, CELL * 1.2); g.setLineDash([]); g.restore();
        }
      });
      g.strokeStyle = SOFT; g.lineWidth = 2 / sc; g.strokeRect(0, 0, GRID * CELL, GRID * CELL);
      g.restore();
      if (S.shapes.title) txt(g, S.shapes.title, W / 2, oy + side + 16, { align: 'center', size: 13 });
      return { ox: ox, oy: oy, sc: sc };
    }

    /* ================= Panel de trabajo: una vista cada vez ================= */
    function head(extra) {
      return h('header', { class: 'igi-head' }, h('h2', { class: 'igi-h', id: 'igi-view-title', text: t('view_' + S.view) }),
        h('p', { class: 'igs-muted', text: t('viewInfo_' + S.view) }), extra || null);
    }
    function row(nodes, cls) { return h('div', { class: 'igi-row ' + (cls || '') }, nodes); }
    function card(tag, value, actions) {
      return h('div', { class: 'igi-card' }, h('p', { class: 'igi-tag', text: tag }), h('p', { class: 'igi-val', text: value }), actions ? row(actions) : null);
    }
    function saveBtn(label, fn) { return ctx.button(label || t('saveToBoard'), { icon: 'star', class: 'igs-primary', onClick: fn }); }
    function textField(key, value, onChange, opts) {
      opts = opts || {};
      var f = F.text(t(key), value, { multiline: opts.multiline, max: opts.max || 600, onChange: onChange });
      if (opts.multiline) f.input.rows = opts.rows || 3;
      return f;
    }
    function addList(listNode, arr, label, onRemove, extra) {
      arr.forEach(function (item, i) {
        listNode.appendChild(h('li', null, h('span', { class: 'igi-item-text', text: typeof item === 'string' ? item : item.text }),
          extra ? extra(item, i) : null,
          ctx.button(t('removeN', { n: i + 1 }), { icon: 'trash', class: 'igs-danger igi-icon-btn', onClick: function () { onRemove(i); } })));
      });
      return listNode;
    }

    function renderPane() {
      var box = pane;
      var ae = D.activeElement, path = ae && box.contains(ae) ? Array.prototype.indexOf.call(box.querySelectorAll('input,select,textarea,button,[tabindex="0"]'), ae) : -1;
      var selStart = ae && ae.selectionStart !== undefined && path >= 0 ? ae.selectionStart : null;
      ctx.clear(box);
      stage.dataset.canvas = String(usesCanvas());
      if (usesCanvas()) { drawNow(); return; }
      var build = { stories: paneStories, whatif: paneWhatIf, combine: paneCombine, uses: paneUses, pov: panePov, scamper: paneScamper, sprint: paneSprint, matrix: paneMatrix, sheet: paneSheet }[S.view];
      if (build) box.appendChild(build());
      if (path >= 0) {
        var el = box.querySelectorAll('input,select,textarea,button,[tabindex="0"]')[path];
        if (el) { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } if (selStart !== null && el.setSelectionRange) { try { el.setSelectionRange(selStart, selStart); } catch (_) {} } }
      }
    }

    /* ---- Mesa 1: laboratorio de historias ---- */
    function storyCats() { return S.mode === 'mas' ? ['personaje', 'lugar', 'objeto', 'situacion'] : ['personaje', 'lugar', 'situacion']; }
    var CAT_KEY = { personaje: 't1Char', lugar: 't1Place', objeto: 't1Obj', situacion: 't1Sit' };
    function paneStories() {
      var st = S.stories, box = h('section', { class: 'igi-view' }, head());
      var cards = h('div', { class: 'igi-cards' });
      storyCats().forEach(function (c) {
        var bank = bankOf(CAT_KEY[c]), i = st.idx[c] % Math.max(1, bank.length), lock = !!st.locks[c], label = t('cat_' + c);
        cards.appendChild(card(label + (lock ? ' · ' + t('kept') : ''), bank[i] || '—', [
          ctx.button(t('another'), { icon: 'sparkle', disabled: lock, onClick: function () { st.idx[c] = pick(bank, i); commit(t('pieceChanged', { c: label })); ctx.announce(label + ': ' + (bankOf(CAT_KEY[c])[st.idx[c]] || '')); } }),
          ctx.button(t('keep'), { icon: 'check', pressed: lock, onClick: function () { st.locks[c] = !lock; commit(lock ? t('released', { c: label }) : t('keptMsg', { c: label })); } })
        ]));
      });
      box.appendChild(cards);
      box.appendChild(row([ctx.button(t('shuffle'), { icon: 'sparkle', onClick: function () {
        var any = false;
        storyCats().forEach(function (c) { if (!st.locks[c]) { var bank = bankOf(CAT_KEY[c]); st.idx[c] = pick(bank, st.idx[c]); any = true; } });
        if (!any) { ctx.announce(t('allKept')); return; }
        commit(t('shuffled')); ctx.announce(t('shuffled'));
      } })]));
      box.appendChild(textField('yourStory', st.text, function (v) { st.text = str(v, 2000); commit(t('storyWritten')); }, { multiline: true, rows: 5, max: 2000 }));
      box.appendChild(row([saveBtn(null, function () {
        var pieces = storyCats().map(function (c) { var b = bankOf(CAT_KEY[c]); return b[st.idx[c] % Math.max(1, b.length)]; }).join(' · ');
        saveToBoard(t('view_stories'), pieces + (st.text ? '\n' + st.text : ''), 1);
      })]));
      return box;
    }

    /* ---- Mesa 2: ¿y si…? ---- */
    function paneWhatIf() {
      var st = S.whatif, bank = bankOf('t2Q'), q = st.own.trim() ? st.own : (bank[st.i % Math.max(1, bank.length)] || '');
      var box = h('section', { class: 'igi-view' }, head());
      box.appendChild(card(st.own.trim() ? t('yourQuestion') : t('question'), q, [
        ctx.button(t('anotherQuestion'), { icon: 'sparkle', onClick: function () { st.own = ''; st.i = pick(bank, st.i); commit(t('newQuestion')); ctx.announce(bankOf('t2Q')[st.i] || ''); } }),
        ctx.button(t('thinkAbout'), { icon: 'help', pressed: st.hints, onClick: function () { st.hints = !st.hints; renderPane(); } })
      ]));
      if (st.hints) box.appendChild(h('ul', { class: 'igi-hints' }, split1('t2Hints').map(function (x) { return h('li', { text: x }); })));
      box.appendChild(textField('ownQuestion', st.own, function (v) { st.own = str(v, 160); commit(t('ownQuestionSaved')); }, { max: 160 }));
      var input = h('input', { type: 'text', maxlength: 200, id: 'igi-wi-in', 'aria-label': t('anAnswer') });
      function add() {
        var v = input.value.trim(); if (!v) { ctx.announce(t('writeFirst')); input.focus(); return; }
        st.answers.push(v); input.value = ''; commit(t('answerAdded', { n: st.answers.length })); ctx.announce(t('answerAdded', { n: st.answers.length })); input.focus();
      }
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
      box.appendChild(h('div', { class: 'igs-field' }, h('label', { for: 'igi-wi-in', text: t('anAnswer') }), row([input, ctx.button(t('add'), { icon: 'plus', class: 'igs-primary', onClick: add })], 'igi-row-input')));
      box.appendChild(h('p', { class: 'igi-count', text: st.answers.length ? t('answersN', { n: st.answers.length }) : t('noAnswers') }));
      box.appendChild(addList(h('ol', { class: 'igi-items' }), st.answers, null, function (i) { st.answers.splice(i, 1); commit(t('answerRemoved')); ctx.announce(t('answerRemoved')); }));
      box.appendChild(row([saveBtn(null, function () { saveToBoard(q, st.answers.map(function (a, i) { return (i + 1) + '. ' + a; }).join('\n'), 2); })]));
      return box;
    }

    /* ---- Mesa 3 y técnica: combinar dos objetos al azar ---- */
    function paneCombine() {
      var st = S.combine, bank = bankOf('t3Obj'), A = bank[st.a % Math.max(1, bank.length)] || '', B = bank[st.b % Math.max(1, bank.length)] || '';
      var box = h('section', { class: 'igi-view' }, head());
      var cards = h('div', { class: 'igi-cards' });
      cards.appendChild(card('A', A, [ctx.button(t('changeA'), { icon: 'sparkle', onClick: function () { var n = pick(bank, st.a); if (n === st.b) n = (n + 1) % bank.length; st.a = n; commit(t('changedA')); ctx.announce('A: ' + bankOf('t3Obj')[st.a]); } })]));
      cards.appendChild(card('B', B, [ctx.button(t('changeB'), { icon: 'sparkle', onClick: function () { var n = pick(bank, st.b); if (n === st.a) n = (n + 1) % bank.length; st.b = n; commit(t('changedB')); ctx.announce('B: ' + bankOf('t3Obj')[st.b]); } })]));
      box.appendChild(cards);
      box.appendChild(row([ctx.button(t('otherPair'), { icon: 'sparkle', onClick: function () { st.a = pick(bank, st.a); st.b = pick(bank, st.a); if (st.b === st.a) st.b = (st.a + 1) % bank.length; commit(t('otherPairDone')); ctx.announce(bankOf('t3Obj')[st.a] + ' + ' + bankOf('t3Obj')[st.b]); } })]));
      box.appendChild(textField('inventName', st.name, function (v) { st.name = str(v, 80); commit(t('nameWritten')); }, { max: 80 }));
      box.appendChild(textField('whatFor', st.para, function (v) { st.para = str(v, 600); commit(t('written')); }, { multiline: true }));
      box.appendChild(textField('howWorks', st.como, function (v) { st.como = str(v, 600); commit(t('written')); }, { multiline: true }));
      var improves = split1('t3Improve');
      box.appendChild(row([ctx.button(t('improveIt'), { icon: 'sparkle', onClick: function () { st.improve = (st.improve + 1) % improves.length; commit(t('improvePrompt')); ctx.announce(improves[st.improve]); } })]));
      if (st.improve >= 0) box.appendChild(h('p', { class: 'igs-note', text: improves[st.improve] }));
      box.appendChild(row([saveBtn(null, function () {
        if (!st.name.trim()) { ctx.announce(t('needName')); return; }
        saveToBoard(st.name, A + ' + ' + B + (st.para ? '\n' + t('whatFor') + ': ' + st.para : '') + (st.como ? '\n' + t('howWorks') + ': ' + st.como : ''), 3);
      }), ctx.button(t('toSheet'), { icon: 'file', onClick: function () { S.sheet.name = S.sheet.name || st.name; S.sheet.how = S.sheet.how || st.como; setView('sheet'); } })]));
      return box;
    }

    /* ---- Mesa 5 y técnica: usos alternativos (fluidez y flexibilidad, Guilford 1967) ---- */
    function paneUses() {
      var st = S.uses, bank = bankOf('t5Obj'), obj = bank[st.obj % Math.max(1, bank.length)] || '', groups = split1('t5Groups'), dirs = split1('t5Dirs');
      var box = h('section', { class: 'igi-view' }, head());
      box.appendChild(card(t('object'), obj, [
        ctx.button(t('anotherObject'), { icon: 'sparkle', onClick: function () { st.obj = pick(bank, st.obj); st.list = []; st.dir = -1; commit(t('otherObjectDone')); ctx.announce(bankOf('t5Obj')[st.obj] || ''); } }),
        ctx.button(t('otherDirection'), { icon: 'help', onClick: function () { st.dir = (st.dir + 1) % dirs.length; commit(t('directionPrompt')); ctx.announce(dirs[st.dir]); } })
      ]));
      if (st.dir >= 0) box.appendChild(h('p', { class: 'igs-note', text: dirs[st.dir] }));
      var input = h('input', { type: 'text', maxlength: 160, id: 'igi-use-in', 'aria-label': t('aUse') });
      var gsel = h('select', { id: 'igi-use-g', 'aria-label': t('group') });
      groups.forEach(function (g, i) { gsel.appendChild(h('option', { value: String(i), text: g })); });
      function add() {
        var v = input.value.trim(); if (!v) { ctx.announce(t('writeFirst')); input.focus(); return; }
        st.list.push({ t: v, g: +gsel.value }); input.value = '';
        commit(t('useAdded')); ctx.announce(t('useStats', { n: st.list.length, g: flexibility() })); input.focus();
      }
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
      box.appendChild(row([
        h('div', { class: 'igs-field igi-grow' }, h('label', { for: 'igi-use-in', text: t('aUse') }), input),
        h('div', { class: 'igs-field' }, h('label', { for: 'igi-use-g', text: t('group') }), gsel),
        ctx.button(t('add'), { icon: 'plus', class: 'igs-primary', onClick: add })
      ], 'igi-row-input'));
      box.appendChild(h('p', { class: 'igi-count', text: st.list.length ? t('useStats', { n: st.list.length, g: flexibility() }) : t('noUses') }));
      box.appendChild(h('p', { class: 'igs-muted', text: t('fluencyNote') }));
      box.appendChild(addList(h('ol', { class: 'igi-items' }), st.list.map(function (u) { return { text: u.t + ' · ' + (groups[u.g] || '') }; }), null, function (i) { st.list.splice(i, 1); commit(t('useRemoved')); ctx.announce(t('useRemoved')); }));
      box.appendChild(row([saveBtn(null, function () { saveToBoard(obj, st.list.map(function (u, i) { return (i + 1) + '. ' + u.t + ' (' + (groups[u.g] || '') + ')'; }).join('\n'), 4); })]));
      return box;
    }
    function flexibility() { var seen = {}; S.uses.list.forEach(function (u) { seen[u.g] = 1; }); return Object.keys(seen).length; }

    /* ---- Mesa 6 y técnica: cambiar el punto de vista ---- */
    function panePov() {
      var st = S.pov, list = scenes(), sc = list[st.scene % Math.max(1, list.length)] || { text: '', views: [] };
      var box = h('section', { class: 'igi-view' }, head());
      box.appendChild(card(t('scene'), sc.text, [ctx.button(t('otherScene'), { icon: 'sparkle', onClick: function () { st.scene = pick(list, st.scene); st.active = 0; commit(t('otherSceneDone')); ctx.announce(scenes()[st.scene].text); } })]));
      var tabs = h('div', { class: 'igi-tabs', role: 'tablist', 'aria-label': t('viewpoints') });
      sc.views.forEach(function (v, i) {
        var has = (st.texts[st.scene + '-' + i] || '').trim();
        var b = h('button', { type: 'button', role: 'tab', id: 'igi-tab-' + i, 'aria-selected': String(i === st.active), 'aria-controls': 'igi-tabpanel', tabindex: i === st.active ? '0' : '-1', class: 'igs-btn' },
          h('span', { class: 'igs-btn-label', text: v + ' · ' + (has ? t('hasText') : t('emptyText')) }));
        b.addEventListener('click', function () { st.active = i; renderPane(); });
        b.addEventListener('keydown', function (e) {
          var n = sc.views.length, j = null;
          if (e.key === 'ArrowRight') j = (i + 1) % n; else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1; else return;
          e.preventDefault(); st.active = j; renderPane(); var nb = pane.querySelector('#igi-tab-' + j); if (nb) nb.focus();
        });
        tabs.appendChild(b);
      });
      box.appendChild(tabs);
      var key = st.scene + '-' + st.active;
      var panel = h('div', { class: 'igi-tabpanel', role: 'tabpanel', id: 'igi-tabpanel', 'aria-labelledby': 'igi-tab-' + st.active },
        textField('povWrite', st.texts[key] || '', function (v) { st.texts[key] = str(v, 1200); commit(t('povWritten')); }, { multiline: true, rows: 4, max: 1200 }));
      var lbl = panel.querySelector('label'); if (lbl) lbl.textContent = (sc.views[st.active] || '') + '. ' + t('t6Q');
      box.appendChild(panel);
      var filled = sc.views.map(function (v, i) { return { l: v, x: (st.texts[st.scene + '-' + i] || '').trim() }; }).filter(function (o) { return o.x; });
      box.appendChild(h('h3', { class: 'igi-h3', text: t('compareViews') }));
      box.appendChild(filled.length ? h('ul', { class: 'igi-items' }, filled.map(function (o) { return h('li', null, h('strong', { text: o.l + ': ' }), o.x); })) : h('p', { class: 'igs-muted', text: t('noViewsYet') }));
      box.appendChild(row([saveBtn(null, function () { saveToBoard(t('view_pov'), sc.text + '\n' + filled.map(function (o) { return o.l + ': ' + o.x; }).join('\n'), 5); })]));
      return box;
    }

    /* ---- Técnica: SCAMPER (Eberle 1971, a partir de las preguntas de Osborn 1953) ---- */
    function paneScamper() {
      var st = S.scamper, obj = st.object || t('scThis'), box = h('section', { class: 'igi-view' }, head());
      var objField = textField('scObject', st.object, function (v) { st.object = str(v, 80); commit(t('scObjectSet')); renderPane(); }, { max: 80 });
      box.appendChild(row([h('div', { class: 'igs-field igi-grow' }, objField), ctx.button(t('scSuggest'), { icon: 'sparkle', onClick: function () {
        var pool = split1('scObjects'); st.object = pool[Math.floor(rnd() * pool.length)]; commit(t('scObjectSet')); ctx.announce(t('scObject') + ': ' + st.object); renderPane();
      } })], 'igi-row-input'));
      LETTERS.forEach(function (L, i) {
        var ta = textField('sc_' + L, st.answers[i], function (v) { st.answers[i] = str(v, 1200); commit(t('scWritten')); updateSummary(); }, { multiline: true, rows: 3, max: 1200 });
        var lab = ta.querySelector('label');
        if (lab) { ctx.clear(lab); lab.appendChild(h('span', { class: 'igi-letter', 'aria-hidden': 'true', text: L })); lab.appendChild(D.createTextNode(t('sc_' + L))); }
        var area = ta.querySelector('textarea');
        if (area) ta.insertBefore(h('p', { class: 'igs-muted', text: t('scQ_' + L, { o: obj }) }), area);
        box.appendChild(h('div', { class: 'igi-sc-item' }, ta));
      });
      box.appendChild(h('p', { class: 'igi-count', text: t('scCount', { n: scamperIdeas() }) }));
      box.appendChild(row([saveBtn(null, function () {
        saveToBoard(t('view_scamper') + (st.object ? ' · ' + st.object : ''), LETTERS.map(function (L, i) { return t('sc_' + L) + ': ' + (st.answers[i] || '—'); }).join('\n'), 0);
      }), ctx.button(t('toSheet'), { icon: 'file', onClick: function () { setView('sheet'); } })]));
      return box;
    }
    function scamperIdeas() { return S.scamper.answers.reduce(function (a, x) { return a + lines(x).length; }, 0); }
    function scamperPerLetter() { return S.scamper.answers.map(function (x) { return lines(x).length; }); }

    /* ---- Técnica: 8 ideas en 8 minutos (el tiempo lo maneja la persona, WCAG 2.2.1) ---- */
    var sprintLeft = 480, sprintRunning = false, sprintTimer = 0, clockNode = null;
    function fmtTime(s) { var m = Math.floor(Math.max(0, s) / 60), q = Math.max(0, s) % 60; return m + ':' + (q < 10 ? '0' : '') + q; }
    function sprintStop(msg) {
      if (sprintTimer) root.clearInterval(sprintTimer);
      sprintTimer = 0; sprintRunning = false; updateClock();
      if (msg) ctx.announce(msg);
    }
    function sprintToggle() {
      if (sprintRunning) { sprintStop(t('timerPaused', { time: fmtTime(sprintLeft) })); return; }
      if (sprintLeft <= 0) sprintLeft = S.sprint.minutes * 60;
      sprintRunning = true;
      sprintTimer = root.setInterval(function () {
        sprintLeft -= 1; updateClock();
        if (sprintLeft <= 0) { sprintStop(t('timerDone', { n: S.sprint.ideas.length })); }
        else if (sprintLeft === 60) ctx.announce(t('timerOneMinute'));
      }, 1000);
      updateClock(); ctx.announce(t('timerStarted', { time: fmtTime(sprintLeft) }));
    }
    function updateClock() {
      if (!clockNode) return;
      clockNode.textContent = fmtTime(sprintLeft);
      var b = pane.querySelector('[data-igi="timer"]');
      if (b) { b.setAttribute('aria-pressed', String(sprintRunning)); var lb = b.querySelector('.igs-btn-label'); if (lb) lb.textContent = sprintRunning ? t('timerPause') : (sprintLeft < S.sprint.minutes * 60 && sprintLeft > 0 ? t('timerResume') : t('timerStart')); }
      var p = pane.querySelector('[data-igi="progress"]');
      if (p) p.textContent = t('sprintProgress', { n: S.sprint.ideas.length, m: S.sprint.target });
    }
    function paneSprint() {
      var st = S.sprint, box = h('section', { class: 'igi-view' }, head());
      box.appendChild(textField('sprintProblem', st.problem, function (v) { st.problem = str(v, 300); commit(t('problemWritten')); }, { max: 300 }));
      clockNode = h('p', { class: 'igi-clock', role: 'timer', 'aria-live': 'off', text: fmtTime(sprintLeft) });
      var tbtn = ctx.button(sprintRunning ? t('timerPause') : t('timerStart'), { icon: sprintRunning ? 'pause' : 'play', class: 'igs-primary', pressed: sprintRunning, onClick: sprintToggle });
      tbtn.dataset.igi = 'timer';
      box.appendChild(row([clockNode, tbtn,
        ctx.button(t('timerPlusMinute'), { icon: 'plus', onClick: function () { sprintLeft += 60; st.minutes = Math.min(60, st.minutes + 1); updateClock(); ctx.announce(t('timerExtended', { time: fmtTime(sprintLeft) })); } }),
        ctx.button(t('timerReset'), { icon: 'rotate', onClick: function () { sprintStop(); sprintLeft = st.minutes * 60; updateClock(); ctx.announce(t('timerReset')); } })], 'igi-clock-row'));
      box.appendChild(row([
        F.number(t('sprintMinutes'), st.minutes, { min: 1, max: 60, step: 1, unit: t('minutesUnit'), onChange: function (v) { st.minutes = v; if (!sprintRunning) { sprintLeft = v * 60; updateClock(); } commit(t('sprintSet')); } }),
        F.number(t('sprintTarget'), st.target, { min: 1, max: 40, step: 1, unit: t('ideasUnit'), onChange: function (v) { st.target = v; commit(t('sprintSet')); updateClock(); } })
      ]));
      box.appendChild(h('p', { class: 'igs-muted', text: t('timerNote') }));
      var input = h('input', { type: 'text', maxlength: 200, id: 'igi-sp-in', 'aria-label': t('anIdea') });
      function add() {
        var v = input.value.trim(); if (!v) { ctx.announce(t('writeFirst')); input.focus(); return; }
        st.ideas.push(v); input.value = ''; commit(t('ideaAdded', { n: st.ideas.length })); ctx.announce(t('ideaAdded', { n: st.ideas.length })); renderPane();
        var again = pane.querySelector('#igi-sp-in'); if (again) again.focus();
      }
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
      box.appendChild(h('div', { class: 'igs-field' }, h('label', { for: 'igi-sp-in', text: t('anIdea') }), row([input, ctx.button(t('add'), { icon: 'plus', class: 'igs-primary', onClick: add })], 'igi-row-input')));
      box.appendChild(h('p', { class: 'igi-count', dataset: { igi: 'progress' }, text: t('sprintProgress', { n: st.ideas.length, m: st.target }) }));
      box.appendChild(addList(h('ol', { class: 'igi-items' }), st.ideas, null, function (i) { st.ideas.splice(i, 1); commit(t('ideaRemoved')); renderPane(); }));
      box.appendChild(row([saveBtn(t('saveAllToBoard'), function () {
        if (!st.ideas.length) { ctx.announce(t('noIdeasYet')); return; }
        st.ideas.forEach(function (x, i) { var g = canvas.getContext('2d'), n = items().length; kc.x = 40 + (n % 4) * 190 + NOTE_W / 2; kc.y = 40 + Math.floor(n / 4) * 130 + 28; addItem('note', x, NOTE_COLOURS[i % NOTE_COLOURS.length][0]); });
        commit(t('savedToBoard')); ctx.announce(t('savedNIdeas', { n: st.ideas.length })); renderStructure();
      }), ctx.button(t('toMatrix'), { icon: 'grid', onClick: function () { importToMatrix(); setView('matrix'); } })]));
      return box;
    }

    /* ---- Evaluar: matriz impacto/esfuerzo y matriz de decisión ponderada ---- */
    function importToMatrix() {
      var seen = {}; S.matrix.items.forEach(function (x) { seen[x.text] = 1; });
      var added = 0;
      S.sprint.ideas.forEach(function (x) { if (!seen[x]) { seen[x] = 1; addMatrixItem(x); added += 1; } });
      items().forEach(function (it) { var txt0 = String(it.text || '').split('\n')[0]; if (txt0 && !seen[txt0]) { seen[txt0] = 1; addMatrixItem(txt0); added += 1; } });
      if (added) commit(t('matrixImported', { n: added }));
      ctx.announce(added ? t('matrixImported', { n: added }) : t('matrixNothingNew'));
    }
    function addMatrixItem(text) {
      var it = { id: 'm' + S.matrix.next, text: str(text, 120), impact: 3, effort: 3, scores: {} };
      S.matrix.next += 1; S.matrix.items.push(it); return it;
    }
    function weightedTotal(it) {
      var sum = 0, wsum = 0;
      S.matrix.criteria.forEach(function (c) { var v = +it.scores[c.id] || 0; sum += v * c.weight; wsum += c.weight; });
      return wsum ? Math.round(sum / wsum * 10) / 10 : 0;
    }
    function paneMatrix() {
      var M = S.matrix, box = h('section', { class: 'igi-view' }, head());
      var input = h('input', { type: 'text', maxlength: 120, id: 'igi-mx-in', 'aria-label': t('anOption') });
      function add() { var v = input.value.trim(); if (!v) { ctx.announce(t('writeFirst')); input.focus(); return; } addMatrixItem(v); input.value = ''; commit(t('optionAdded')); renderPane(); var again = pane.querySelector('#igi-mx-in'); if (again) again.focus(); }
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
      box.appendChild(h('div', { class: 'igs-field' }, h('label', { for: 'igi-mx-in', text: t('anOption') }),
        row([input, ctx.button(t('add'), { icon: 'plus', class: 'igs-primary', onClick: add }), ctx.button(t('importIdeas'), { icon: 'copy', onClick: function () { importToMatrix(); renderPane(); } })], 'igi-row-input')));
      if (!M.items.length) { box.appendChild(h('p', { class: 'igs-muted', text: t('noOptions') })); return box; }
      /* Colocación por campos: nada se arrastra. */
      box.appendChild(h('h3', { class: 'igi-h3', text: t('impactEffort') }));
      box.appendChild(h('p', { class: 'igs-muted', text: t('impactEffortNote') }));
      var tb = h('tbody');
      M.items.forEach(function (it, i) {
        function sel(key, label) {
          var s = h('select', { 'aria-label': label + ': ' + it.text });
          for (var v = 1; v <= 5; v++) { var o = h('option', { value: String(v), text: String(v) }); if (it[key] === v) o.selected = true; s.appendChild(o); }
          s.addEventListener('change', function () { it[key] = +s.value; commit(t('matrixSet')); renderPane(); });
          return s;
        }
        tb.appendChild(h('tr', null, h('th', { scope: 'row', text: it.text }), h('td', null, sel('impact', t('impact'))), h('td', null, sel('effort', t('effort'))),
          h('td', { text: t('quad_' + (it.impact >= 3 ? (it.effort >= 4 ? 'big' : 'win') : (it.effort >= 4 ? 'no' : 'maybe'))) }),
          h('td', null, ctx.button(t('removeOption', { n: i + 1 }), { icon: 'trash', class: 'igs-danger igi-icon-btn', onClick: function () { M.items.splice(i, 1); commit(t('optionRemoved')); renderPane(); } }))));
      });
      box.appendChild(h('div', { class: 'igs-table-wrap' }, h('table', { class: 'igs-table' }, h('caption', { text: t('impactEffort') }),
        h('thead', null, h('tr', null, [t('option'), t('impact'), t('effort'), t('quadrant'), t('remove')].map(function (x) { return h('th', { scope: 'col', text: x }); }))), tb)));
      var grid = h('table', { class: 'igs-table igi-quad' }, h('caption', { text: t('quadMapCaption') }),
        h('thead', null, h('tr', null, [h('td')].concat([1, 2, 3, 4, 5].map(function (e) { return h('th', { scope: 'col', text: t('effortN', { n: e }) }); })))));
      var qb = h('tbody');
      for (var im = 5; im >= 1; im--) (function (im) {
        var tr = h('tr', null, h('th', { scope: 'row', text: t('impactN', { n: im }) }));
        for (var ef = 1; ef <= 5; ef++) {
          var here = M.items.filter(function (x) { return x.impact === im && x.effort === ef; });
          tr.appendChild(h('td', { class: 'igi-quad-cell' }, here.length ? h('ul', null, here.map(function (x) { return h('li', { text: x.text }); })) : null));
        }
        qb.appendChild(tr);
      })(im);
      grid.appendChild(qb);
      box.appendChild(h('div', { class: 'igs-table-wrap' }, grid));
      /* Matriz de decisión ponderada */
      box.appendChild(h('h3', { class: 'igi-h3', text: t('decisionMatrix') }));
      var cin = h('input', { type: 'text', maxlength: 60, id: 'igi-cr-in', 'aria-label': t('aCriterion') });
      function addC() {
        var v = cin.value.trim(); if (!v) { ctx.announce(t('writeFirst')); cin.focus(); return; }
        M.criteria.push({ id: 'c' + M.next, name: str(v, 60), weight: 3 }); M.next += 1; cin.value = '';
        commit(t('criterionAdded')); renderPane(); var again = pane.querySelector('#igi-cr-in'); if (again) again.focus();
      }
      cin.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addC(); } });
      box.appendChild(h('div', { class: 'igs-field' }, h('label', { for: 'igi-cr-in', text: t('aCriterion') }), row([cin, ctx.button(t('add'), { icon: 'plus', onClick: addC })], 'igi-row-input')));
      if (!M.criteria.length) box.appendChild(h('p', { class: 'igs-muted', text: t('noCriteria') }));
      else {
        var dh = h('tr', null, h('th', { scope: 'col', text: t('option') }));
        M.criteria.forEach(function (c, ci) {
          var w = h('select', { 'aria-label': t('weightOf', { c: c.name }) });
          for (var v = 1; v <= 5; v++) { var o = h('option', { value: String(v), text: String(v) }); if (c.weight === v) o.selected = true; w.appendChild(o); }
          w.addEventListener('change', function () { c.weight = +w.value; commit(t('weightSet')); renderPane(); });
          dh.appendChild(h('th', { scope: 'col' }, h('span', { text: c.name }), w,
            ctx.button(t('removeCriterion', { n: ci + 1 }), { icon: 'trash', class: 'igs-danger igi-icon-btn', onClick: function () { M.criteria.splice(ci, 1); commit(t('criterionRemoved')); renderPane(); } })));
        });
        dh.appendChild(h('th', { scope: 'col', text: t('total') }));
        var db = h('tbody');
        var ranked = M.items.slice().sort(function (a, b) { return weightedTotal(b) - weightedTotal(a); });
        M.items.forEach(function (it) {
          var tr = h('tr', null, h('th', { scope: 'row', text: it.text }));
          M.criteria.forEach(function (c) {
            var s = h('select', { 'aria-label': c.name + ': ' + it.text });
            for (var v = 0; v <= 5; v++) { var o = h('option', { value: String(v), text: String(v) }); if ((+it.scores[c.id] || 0) === v) o.selected = true; s.appendChild(o); }
            s.addEventListener('change', function () { it.scores[c.id] = +s.value; commit(t('scoreSet')); renderPane(); });
            tr.appendChild(h('td', null, s));
          });
          tr.appendChild(h('td', { class: 'igs-numcell' }, h('strong', { text: num(weightedTotal(it), 1) + (ranked[0] === it && weightedTotal(it) > 0 ? ' · ' + t('best') : '') })));
          db.appendChild(tr);
        });
        box.appendChild(h('div', { class: 'igs-table-wrap' }, h('table', { class: 'igs-table' }, h('caption', { text: t('decisionMatrix') }), h('thead', null, dh), db)));
        box.appendChild(h('p', { class: 'igs-muted', text: t('decisionNote') }));
      }
      return box;
    }

    /* ---- Ficha de invento con restricciones reales y boceto ---- */
    function totals() {
      var cost = 0, weight = 0, n = 0;
      S.sheet.parts.forEach(function (p) { var q = numv(p.qty) || 0; cost += q * numv(p.price); weight += q * numv(p.weight); if (String(p.name).trim()) n += 1; });
      return { cost: cost, weight: weight, n: n, size: S.sheet.size.map(numv) };
    }
    function checks() {
      var b = S.sheet.brief, tt = totals(), out = [];
      ['name', 'problem', 'who', 'how', 'test'].forEach(function (k) { out.push({ ok: String(S.sheet[k]).trim().length > 2, text: t('chkField', { f: t('f_' + k) }) }); });
      if (b) {
        if (b.budget) out.push({ ok: tt.cost > 0 && tt.cost <= b.budget + 1e-9, text: t('chkBudget', { c: num(tt.cost, 2), m: num(b.budget, 2) }) });
        if (b.size && b.size.length === 3) {
          var mine = tt.size.slice().sort(function (p, q) { return q - p; }), lim = b.size.slice().sort(function (p, q) { return q - p; });
          out.push({ ok: mine.every(function (v) { return v > 0; }) && mine.every(function (v, i) { return v <= lim[i] + 1e-9; }), text: t('chkSize', { s: tt.size.map(function (v) { return num(v, 1); }).join(' × '), m: b.size.map(function (v) { return num(v, 0); }).join(' × ') }) });
        }
        if (b.weight) out.push({ ok: tt.weight > 0 && tt.weight <= b.weight + 1e-9, text: t('chkWeight', { w: num(tt.weight, 0), m: num(b.weight, 0) }) });
        if (b.minParts) out.push({ ok: tt.n >= b.minParts, text: t('chkParts', { n: tt.n, m: b.minParts }) });
      }
      var ch = currentChallenge();
      if (ch && ch.scamper) out.push({ ok: scamperPerLetter().every(function (n2) { return n2 >= ch.scamper; }), text: t('chkScamper', { m: ch.scamper }) });
      return out;
    }
    function currentChallenge() { for (var i = 0; i < CHALLENGES.length; i++) if (CHALLENGES[i].id === S.challenge) return CHALLENGES[i]; return null; }
    function randomBrief() {
      var pools = t('randPools').split('||').map(function (p) { return p.split('|'); });
      function p(a) { return a[Math.floor(rnd() * a.length)]; }
      return { text: t('randText', { p: p(pools[0]), who: p(pools[1]), where: p(pools[2]) }),
        budget: p([3, 5, 8, 10, 12, 15, 20, 30]), size: p([[10, 10, 5], [20, 15, 10], [30, 20, 12], [40, 30, 20], [60, 40, 30]]),
        weight: p([100, 250, 500, 1000, 2000]), minParts: p([2, 3, 4, 5]), extra: p(pools[3]) };
    }
    function briefLimits(b) {
      var out = [];
      if (b.budget) out.push(t('limBudget', { v: num(b.budget, 2) }));
      if (b.size && b.size.length === 3) out.push(t('limSize', { v: b.size.map(function (v) { return num(v, 0); }).join(' × ') }));
      if (b.weight) out.push(t('limWeight', { v: num(b.weight, 0) }));
      if (b.minParts) out.push(t('limParts', { v: b.minParts }));
      if (b.extra) out.push(b.extra);
      return out;
    }
    function paneSheet() {
      var sh = S.sheet, box = h('section', { class: 'igi-view' }, head());
      var brief = h('div', { class: 'igi-brief' });
      if (!sh.brief) { brief.appendChild(h('p', { class: 'igi-tag', text: t('noBrief') })); brief.appendChild(h('p', { text: t('noBriefText') })); }
      else {
        brief.appendChild(h('p', { class: 'igi-tag', text: t('briefWord') }));
        brief.appendChild(h('p', { text: sh.brief.text }));
        brief.appendChild(h('ul', { class: 'igi-limits', 'aria-label': t('limits') }, briefLimits(sh.brief).map(function (x) { return h('li', { text: x }); })));
      }
      var ch = currentChallenge();
      if (ch && ch.random) brief.appendChild(row([ctx.button(t('anotherBrief'), { icon: 'sparkle', onClick: function () { sh.brief = randomBrief(); commit(t('newBrief')); ctx.announce(sh.brief.text); renderPane(); } })]));
      box.appendChild(brief);
      var grid = h('div', { class: 'igi-grid2' });
      [['name', 0, 80], ['who', 2, 300], ['problem', 3, 600], ['how', 4, 1200], ['test', 3, 600], ['better', 3, 600]].forEach(function (f) {
        grid.appendChild(textField('f_' + f[0], sh[f[0]], function (v) { sh[f[0]] = str(v, f[2]); commit(t('sheetWritten')); updateChecks(); updateSummary(); }, { multiline: !!f[1], rows: f[1], max: f[2] }));
      });
      box.appendChild(grid);
      var sizeRow = h('fieldset', { class: 'igi-fieldset' }, h('legend', { text: t('sizeLegend') }));
      var sizeInner = h('div', { class: 'igi-row' });
      [0, 1, 2].forEach(function (i) {
        sizeInner.appendChild(F.number(t('size_' + i), numv(sh.size[i]) || '', { min: 0, max: 1000, step: 0.5, unit: 'cm', onChange: function (v) { sh.size[i] = String(v); commit(t('sizeSet')); updateChecks(); updateSummary(); } }));
      });
      sizeRow.appendChild(sizeInner); box.appendChild(sizeRow);
      box.appendChild(h('h3', { class: 'igi-h3', text: t('partsTitle') }));
      box.appendChild(h('p', { class: 'igs-muted', text: t('partsNote') }));
      var tb = h('tbody');
      sh.parts.forEach(function (p, i) {
        function cell(k, type, labelKey) {
          var el = h('input', { type: type, 'aria-label': t(labelKey, { n: i + 1 }), min: type === 'number' ? 0 : null, step: type === 'number' ? 'any' : null, inputmode: type === 'number' ? 'decimal' : null, maxlength: type === 'text' ? 60 : null });
          el.value = p[k] || '';
          el.addEventListener('change', function () { p[k] = str(el.value, 60); commit(t('partChanged')); updateChecks(); updateSummary(); });
          return h('td', null, el);
        }
        tb.appendChild(h('tr', null, cell('name', 'text', 'ariaPart'), cell('qty', 'number', 'ariaQty'), cell('price', 'number', 'ariaPrice'), cell('weight', 'number', 'ariaWeight'),
          h('td', null, ctx.button(t('delPart', { n: i + 1 }), { icon: 'trash', class: 'igs-danger igi-icon-btn', onClick: function () { sh.parts.splice(i, 1); commit(t('partDeleted')); renderPane(); ctx.announce(t('partDeleted')); } }))));
      });
      if (!sh.parts.length) tb.appendChild(h('tr', null, h('td', { colspan: 5, class: 'igs-muted', text: t('noParts') })));
      box.appendChild(h('div', { class: 'igs-table-wrap' }, h('table', { class: 'igs-table' }, h('caption', { text: t('partsCap') }),
        h('thead', null, h('tr', null, [t('thPart'), t('thQty'), t('thPrice'), t('thWeight'), t('remove')].map(function (x) { return h('th', { scope: 'col', text: x }); }))), tb)));
      box.appendChild(row([ctx.button(t('addPart'), { icon: 'plus', onClick: function () {
        sh.parts.push({ name: '', qty: '1', price: '', weight: '' }); commit(t('partAdded')); renderPane();
        var ins = pane.querySelectorAll('tbody input'); if (ins.length) ins[ins.length - 4].focus();
      } })]));
      var tt = totals();
      box.appendChild(h('p', { class: 'igi-count', dataset: { igi: 'totals' }, text: t('totals', { c: num(tt.cost, 2), w: num(tt.weight, 0), n: tt.n, s: tt.size.map(function (v) { return num(v, 1); }).join(' × ') }) }));
      box.appendChild(sketchBlock());
      box.appendChild(h('h3', { class: 'igi-h3', text: t('checksTitle') }));
      box.appendChild(h('div', { class: 'igi-checks', dataset: { igi: 'checks' } }));
      box.appendChild(row([ctx.button(t('printSheet'), { icon: 'file', class: 'igs-primary', onClick: printSheet }), saveBtn(null, function () { saveToBoard(sh.name || t('view_sheet'), sh.problem, 3); })]));
      updateChecks();
      return box;
    }
    function updateChecks() {
      var box = pane.querySelector('[data-igi="checks"]'); if (!box) return;
      ctx.clear(box);
      var list = checks(), bad = list.filter(function (x) { return !x.ok; }).length;
      box.appendChild(h('p', { class: 'igs-result', 'data-kind': bad ? '' : 'ok' }, h('strong', { text: bad ? t('someOk') : t('allOk') })));
      box.appendChild(h('ul', { class: 'igi-checklist' }, list.map(function (x) {
        return h('li', { 'data-ok': String(x.ok) }, h('span', { class: 'igi-mark', 'aria-hidden': 'true', text: x.ok ? '✓' : '·' }), h('span', { class: 'igs-sr', text: (x.ok ? t('doneWord') : t('pendingWord')) + ': ' }), h('span', { text: x.text }));
      })));
      var tot = pane.querySelector('[data-igi="totals"]');
      if (tot) { var tt = totals(); tot.textContent = t('totals', { c: num(tt.cost, 2), w: num(tt.weight, 0), n: tt.n, s: tt.size.map(function (v) { return num(v, 1); }).join(' × ') }); }
      if (S.challenge) renderInspector(); /* el estado del reto se ve siempre al día en Propiedades */
    }

    /* ---- Boceto: se dibuja con el ratón o el lápiz (usa la presión si la hay) y también con el teclado ---- */
    var sketchCv = null, sketchCur = { x: 160, y: 110 }, sketchStroke = null;
    function sketchBlock() {
      sketchCv = h('canvas', { class: 'igi-sketch', width: 640, height: 440, role: 'img', tabindex: '0', 'aria-label': t('sketchLabel') });
      var wrapEl = h('div', { class: 'igi-sketch-wrap' }, sketchCv);
      sketchCv.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        sketchCv.setPointerCapture(e.pointerId);
        sketchStroke = { pts: [] }; S.sheet.sketch.push(sketchStroke); addSketchPoint(e);
      });
      sketchCv.addEventListener('pointermove', function (e) { if (sketchStroke) addSketchPoint(e); });
      function end() { if (!sketchStroke) return; sketchStroke = null; commit(t('sketchDrawn')); }
      sketchCv.addEventListener('pointerup', end); sketchCv.addEventListener('pointercancel', end);
      sketchCv.addEventListener('keydown', function (e) {
        var step = e.shiftKey ? 20 : 6, d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
        if (d) {
          e.preventDefault(); sketchCur.x = clamp(sketchCur.x + d[0], 0, 640); sketchCur.y = clamp(sketchCur.y + d[1], 0, 440);
          if (sketchStroke) sketchStroke.pts.push([Math.round(sketchCur.x), Math.round(sketchCur.y), 0.5]);
          drawSketch(); ctx.announce(t('sketchAt', { x: Math.round(sketchCur.x), y: Math.round(sketchCur.y) }) + (sketchStroke ? ' · ' + t('sketchDrawing') : ''));
          return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (sketchStroke) { sketchStroke = null; commit(t('sketchDrawn')); ctx.announce(t('sketchEnd')); }
          else { sketchStroke = { pts: [[Math.round(sketchCur.x), Math.round(sketchCur.y), 0.5]] }; S.sheet.sketch.push(sketchStroke); drawSketch(); ctx.announce(t('sketchStart')); }
          return;
        }
        if (e.key === 'Escape' && sketchStroke) { e.preventDefault(); S.sheet.sketch.pop(); sketchStroke = null; drawSketch(); ctx.announce(t('sketchCancelled')); }
      });
      var actions = row([
        ctx.button(t('sketchUndo'), { icon: 'undo', onClick: function () { if (!S.sheet.sketch.length) { ctx.announce(t('sketchEmpty')); return; } S.sheet.sketch.pop(); sketchStroke = null; drawSketch(); commit(t('sketchUndone')); ctx.announce(t('sketchUndone')); } }),
        ctx.button(t('sketchClear'), { icon: 'trash', class: 'igs-danger', onClick: function () { if (!S.sheet.sketch.length) { ctx.announce(t('sketchEmpty')); return; } S.sheet.sketch = []; sketchStroke = null; drawSketch(); commit(t('sketchCleared')); ctx.announce(t('sketchCleared')); } })
      ]);
      var block = h('div', { class: 'igi-sketch-block' }, h('h3', { class: 'igi-h3', text: t('sketchTitle') }), h('p', { class: 'igs-muted', text: t('sketchHelp') }), wrapEl, actions);
      root.setTimeout(drawSketch, 0);
      return block;
    }
    function addSketchPoint(e) {
      var r = sketchCv.getBoundingClientRect();
      var x = clamp((e.clientX - r.left) / r.width * 640, 0, 640), y = clamp((e.clientY - r.top) / r.height * 440, 0, 440);
      /* La presión del lápiz afina el trazo; si el dispositivo no la da, se usa un valor medio. */
      var p = (e.pressure && e.pressure > 0 && e.pressure < 1) ? e.pressure : 0.5;
      sketchCur.x = x; sketchCur.y = y;
      sketchStroke.pts.push([Math.round(x), Math.round(y), Math.round(p * 100) / 100]);
      drawSketch();
    }
    function sketchPath(g, scale) {
      g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = INK;
      S.sheet.sketch.forEach(function (st) {
        if (!st.pts.length) return;
        if (st.pts.length === 1) { var p0 = st.pts[0]; g.beginPath(); g.arc(p0[0] * scale, p0[1] * scale, 1.5 * scale, 0, Math.PI * 2); g.fillStyle = INK; g.fill(); return; }
        for (var i = 1; i < st.pts.length; i++) {
          var a = st.pts[i - 1], b = st.pts[i];
          g.lineWidth = (1.2 + 2.6 * (b[2] === undefined ? 0.5 : b[2])) * scale;
          g.beginPath(); g.moveTo(a[0] * scale, a[1] * scale); g.lineTo(b[0] * scale, b[1] * scale); g.stroke();
        }
      });
    }
    function drawSketch() {
      if (!sketchCv || !sketchCv.isConnected) return;
      var g = sketchCv.getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#ffffff'; g.fillRect(0, 0, 640, 440);
      g.strokeStyle = '#eef2f7'; g.lineWidth = 1;
      for (var x = 40; x < 640; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 440); g.stroke(); }
      for (var y = 40; y < 440; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(640, y); g.stroke(); }
      sketchPath(g, 1);
      if (D.activeElement === sketchCv || sketchStroke) {
        g.strokeStyle = '#b3261e'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(sketchCur.x - 12, sketchCur.y); g.lineTo(sketchCur.x + 12, sketchCur.y); g.moveTo(sketchCur.x, sketchCur.y - 12); g.lineTo(sketchCur.x, sketchCur.y + 12); g.stroke();
      }
      g.strokeStyle = LINE; g.lineWidth = 2; g.strokeRect(1, 1, 638, 438);
    }

    /* ================= Estructura, propiedades y herramientas ================= */
    function commit(label) { ctx.commit(label); renderStructure(); updateSummary(); if (usesCanvas()) draw(); else renderPane(); }
    function listButton(label, small, current, onClick, swatch) {
      var b = h('button', { type: 'button', 'aria-current': String(!!current) }, swatch ? h('span', { class: 'igs-swatch', style: 'background:' + swatch }) : null,
        h('span', { text: label }), small ? h('small', { text: small }) : null);
      b.addEventListener('click', onClick);
      return h('li', null, b);
    }
    var FOC = 'button,input,select,textarea,[tabindex="0"]';
    function keepFocus(box, fn) {
      var ae = D.activeElement, idx = ae && box.contains(ae) ? Array.prototype.indexOf.call(box.querySelectorAll(FOC), ae) : -1;
      fn();
      if (idx >= 0) { var el = box.querySelectorAll(FOC)[idx]; if (el) { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } } }
    }
    function renderStructure() { keepFocus(ctx.structure, renderStructure0); }
    function renderStructure0() {
      var out = [];
      GROUPS.forEach(function (g) {
        var ul = h('ul', { class: 'igs-list' });
        g[1].forEach(function (v) { ul.appendChild(listButton(t('view_' + v), TABLE_VIEW[v] ? t('tableN', { n: TABLE_VIEW[v] }) : null, S.view === v, function () { setView(v); })); });
        out.push(h('h3', { text: t(g[0]) }), ul);
      });
      if (S.view === 'board') {
        var ul2 = h('ul', { class: 'igs-list' });
        items().forEach(function (it) {
          ul2.appendChild(listButton(String(it.text || t('emptyNote')).split('\n')[0].slice(0, 40) || t('emptyNote'),
            t(it.kind === 'node' ? 'kindNode' : 'kindNote'), S.sel === it.id, function () { select(it.id); }, it.colour));
        });
        out.push(h('h3', { text: t('notesAndNodes') + ' (' + items().length + ')' }), ul2);
        out.push(h('div', { class: 'igs-actions' },
          ctx.button(t('newNote'), { icon: 'plus', onClick: function () { addAtFreeSpot('note'); } }),
          ctx.button(t('newNode'), { icon: 'sparkle', onClick: function () { addAtFreeSpot('node'); } })));
      } else if (S.view === 'shapes') {
        var ul3 = h('ul', { class: 'igs-list' });
        S.shapes.list.forEach(function (s, i) { ul3.appendChild(listButton(describeShape(s, i), null, S.shapes.sel === i, function () { S.shapes.sel = i; renderStructure(); renderInspector(); draw(); ctx.announce(t('pieceChosen', { n: i + 1 })); }, FILLS[s.c % FILLS.length])); });
        out.push(h('h3', { text: t('pieces') + ' (' + S.shapes.list.length + ')' }), ul3);
      }
      ctx.setStructure(out);
    }
    function addAtFreeSpot(kind) {
      var n = items().length;
      kc.x = 40 + (n % 4) * 190 + NOTE_W / 2; kc.y = 40 + Math.floor(n / 4) * 130 + 28;
      var it = addItem(kind, '');
      commit(t(kind === 'node' ? 'nodeAdded' : 'noteAdded')); renderInspector();
      ctx.announce(t(kind === 'node' ? 'nodeAdded' : 'noteAdded'));
      var f = ctx.inspector.querySelector('textarea, input[type=text]'); if (f) f.focus();
      return it;
    }
    function select(id) { S.sel = id; renderStructure(); renderInspector(); draw(); if (id) { var it = itemById(id); if (it) ctx.announce(t('selected', { name: String(it.text || t('emptyNote')).split('\n')[0] })); } }
    function renderInspector() { keepFocus(ctx.inspector, renderInspector0); }
    function renderInspector0() {
      var out = [];
      if (S.challenge) out.push(challengeBox());
      if (S.view === 'board' && S.sel && itemById(S.sel)) out = out.concat(noteFields(itemById(S.sel)));
      else if (S.view === 'shapes') out = out.concat(shapeFields());
      else out = out.concat(docFields());
      ctx.setInspector(out);
    }
    function challengeBox() {
      var ch = currentChallenge(), box = h('div', { class: 'igs-result igi-challenge' });
      box.appendChild(h('strong', { text: t('challenge') + ' · ' + t('lvl' + ch.level) + ' · ' + t('chTitle_' + ch.id) }));
      box.appendChild(h('p', { text: t('chGoal_' + ch.id) }));
      var lim = ch.brief ? briefLimits(Object.assign({}, ch.brief, { extra: ch.brief.extra ? t('chExtra_' + ch.id) : '' })) : (ch.scamper ? [t('limScamper', { n: ch.scamper })] : (ch.random ? [t('limRandom')] : []));
      if (lim.length) box.appendChild(h('ul', { class: 'igi-limits' }, lim.map(function (x) { return h('li', { text: x }); })));
      box.appendChild(h('p', { class: 'igs-muted', text: t('tipWord') + ': ' + t('chTip_' + ch.id) }));
      if (ch.scamper) box.appendChild(h('p', { class: 'igi-chstatus', text: t('chScamperStatus', { n: scamperPerLetter().filter(function (n2) { return n2 >= ch.scamper; }).length, m: ch.scamper }) }));
      else {
        var list = checks(), bad = list.filter(function (x) { return !x.ok; }).length;
        box.appendChild(h('p', { class: 'igi-chstatus', text: bad ? t('chSheetStatus', { n: list.length - bad, m: list.length }) : t('allOk') }));
      }
      box.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('goToSheet'), { icon: 'file', onClick: function () { setView(ch.scamper ? 'scamper' : 'sheet'); } }),
        ctx.button(t('dropChallenge'), { icon: 'erase', onClick: function () { setChallenge(''); } })));
      return box;
    }
    function noteFields(it) {
      var out = [h('h4', { text: t(it.kind === 'node' ? 'kindNode' : 'kindNote') })];
      out.push(textField('noteText', it.text, function (v) { it.text = str(v, 400); commit(t('noteWritten')); }, { multiline: true, rows: 3, max: 400 }));
      out.push(F.select(t('colour'), it.colour, NOTE_COLOURS.map(function (c) { return [c[0], t(c[1])]; }), { onChange: function (v) { it.colour = v; commit(t('colourSet')); } }));
      out.push(F.number(t('posX'), Math.round(it.x), { min: 0, max: 4000, step: 10, unit: 'px', onChange: function (v) { it.x = v; commit(t('moved')); } }));
      out.push(F.number(t('posY'), Math.round(it.y), { min: 0, max: 4000, step: 10, unit: 'px', onChange: function (v) { it.y = v; commit(t('moved')); } }));
      var others = items().filter(function (x) { return x.id !== it.id; });
      if (others.length) {
        var sel = h('select', { 'aria-label': t('connectWith') });
        others.forEach(function (o) { sel.appendChild(h('option', { value: o.id, text: String(o.text || t('emptyNote')).split('\n')[0].slice(0, 40) + (linked(it.id, o.id) ? ' · ' + t('connected') : '') })); });
        out.push(h('div', { class: 'igs-field' }, h('label', { text: t('connectWith') }), sel,
          h('div', { class: 'igs-actions' }, ctx.button(t('connectToggle'), { icon: 'line', onClick: function () {
            var on = toggleLink(it.id, sel.value); commit(on ? t('connected') : t('disconnected')); renderInspector(); ctx.announce(on ? t('connected') : t('disconnected'));
          } }))));
      }
      var mine = S.board.links.filter(function (l) { return l.a === it.id || l.b === it.id; });
      out.push(h('h4', { text: t('connections') + ' (' + mine.length + ')' }));
      if (!mine.length) out.push(h('p', { class: 'igs-muted', text: t('noConnections') }));
      else out.push(h('ul', { class: 'igi-items' }, mine.map(function (l, i) {
        var other = itemById(l.a === it.id ? l.b : l.a);
        return h('li', null, h('span', { class: 'igi-item-text', text: other ? String(other.text || t('emptyNote')).split('\n')[0].slice(0, 40) : '—' }),
          ctx.button(t('removeConnection', { n: i + 1 }), { icon: 'trash', class: 'igs-danger igi-icon-btn', onClick: function () { toggleLink(l.a, l.b); commit(t('disconnected')); renderInspector(); } }));
      })));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteNote'), { icon: 'trash', class: 'igs-danger', onClick: function () { removeItem(it.id); commit(t('noteDeleted')); renderInspector(); ctx.announce(t('noteDeleted')); } })));
      return out;
    }
    function shapeFields() {
      var st = S.shapes, s = st.list[st.sel], out = [h('h4', { text: t('view_shapes') })];
      var retos = split1('t4Challenges');
      out.push(h('p', { class: 'igs-note', text: retos[st.reto % retos.length] }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('otherChallenge'), { icon: 'sparkle', onClick: function () { st.reto = pick(retos, st.reto); commit(t('otherChallengeDone')); renderInspector(); ctx.announce(split1('t4Challenges')[st.reto]); } })));
      out.push(h('h4', { text: t('addPiece') }));
      var adders = h('div', { class: 'igs-actions' });
      SHAPE_KEYS.forEach(function (k, i) {
        adders.appendChild(ctx.button(split1('shapeNames')[i], { icon: k === 'circ' ? 'circle' : k === 'cuad' ? 'square' : 'triangle', onClick: function () {
          if (st.list.length >= 12) { ctx.announce(t('maxPieces')); return; }
          st.list.push({ t: k, r: 4, col: 4, rot: 0, sc: 1, flip: false, c: st.list.length % FILLS.length });
          st.sel = st.list.length - 1; commit(t('pieceAdded', { s: split1('shapeNames')[i] })); renderInspector(); ctx.announce(t('pieceAdded', { s: split1('shapeNames')[i] }));
        } }));
      });
      out.push(adders);
      if (!s) out.push(h('p', { class: 'igs-muted', text: t('noPieceChosen') }));
      else {
        out.push(h('h4', { text: describeShape(s, st.sel) }));
        out.push(F.number(t('colN', { n: '' }).trim() || 'x', s.col + 1, { min: 1, max: GRID, step: 1, onChange: function (v) { s.col = clamp(v - 1, 0, GRID - 1); commit(t('pieceMoved')); } }));
        out.push(F.number(t('rowN', { n: '' }).trim() || 'y', s.r + 1, { min: 1, max: GRID, step: 1, onChange: function (v) { s.r = clamp(v - 1, 0, GRID - 1); commit(t('pieceMoved')); } }));
        out.push(F.range(t('turn'), s.rot, { min: 0, max: 315, step: 45, unit: '°', onChange: function (v) { s.rot = v; commit(t('pieceTurned')); } }));
        out.push(F.range(t('size'), s.sc, { min: 0.5, max: 2, step: 0.25, format: function (v) { return Math.round(v * 100) + ' %'; }, onChange: function (v) { s.sc = v; commit(t('pieceResized')); } }));
        out.push(F.select(t('colour'), String(s.c), FILLS.map(function (c, i) { return [String(i), split1('fillNames')[i] || String(i)]; }), { onChange: function (v) { s.c = +v; commit(t('colourSet')); } }));
        out.push(F.check(t('mirrorPiece'), s.flip, { onChange: function (v) { s.flip = !!v; commit(t('pieceMirrored')); } }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('removePiece'), { icon: 'trash', class: 'igs-danger', onClick: function () { st.list.splice(st.sel, 1); st.sel = st.list.length ? 0 : -1; commit(t('pieceRemoved')); renderInspector(); ctx.announce(t('pieceRemoved')); } })));
      }
      out.push(textField('shapeTitle', st.title, function (v) { st.title = str(v, 80); commit(t('titleWritten')); }, { max: 80 }));
      out.push(h('div', { class: 'igs-actions' }, saveBtn(null, function () {
        if (!st.list.length) { ctx.announce(t('noPieces')); return; }
        saveToBoard(st.title || t('view_shapes'), st.list.map(describeShape).join('\n'), 5);
      })));
      return out;
    }
    function docFields() {
      var out = [h('h4', { text: t('view_' + S.view) }), h('p', { class: 'igs-muted', text: t('viewInfo_' + S.view) })];
      out.push(F.select(t('viewLabel'), S.view, VIEWS.map(function (v) { return [v, t('view_' + v)]; }), { onChange: setView }));
      out.push(h('h4', { text: t('docTitle') }));
      out.push(F.select(t('themeLabel'), S.theme, THEMES.map(function (x, i) { return [x, split1('themeNames')[i] || x]; }), { onChange: function (v) { S.theme = v; resetBanks(); commit(t('themeSet', { v: split1('themeNames')[THEMES.indexOf(v)] })); renderPane(); ctx.announce(t('themeSet', { v: split1('themeNames')[THEMES.indexOf(v)] })); } }));
      out.push(F.choice(t('modeLabel'), S.mode, [['sencillo', t('modeSimple')], ['mas', t('modeMore')]], { onChange: function (v) { S.mode = v; commit(t('modeSet')); renderPane(); } }));
      out.push(F.text(t('seed'), S.seed, { max: 40, onChange: function (v) { S.seed = str(v, 40).trim() || 'iris'; commit(t('seedSet', { s: S.seed })); } }));
      out.push(h('p', { class: 'igs-muted', text: t('seedNote') }));
      out.push(h('h4', { text: t('challenges') }));
      var opts = [['', t('noChallenge')]];
      CHALLENGES.forEach(function (c) { opts.push([c.id, t('lvl' + c.level) + ' · ' + t('chTitle_' + c.id)]); });
      out.push(F.select(t('chooseChallenge'), S.challenge || '', opts, { onChange: setChallenge }));
      if (!S.challenge) out.push(h('p', { class: 'igs-muted', text: t('challengeNote') }));
      return out;
    }
    function resetBanks() {
      S.stories.idx = { personaje: 0, lugar: 0, objeto: 0, situacion: 0 }; S.stories.locks = {};
      S.whatif.i = 0; S.combine.a = 0; S.combine.b = 1; S.uses.obj = 0; S.uses.dir = -1; S.pov.scene = 0; S.pov.active = 0;
    }
    function setChallenge(id) {
      S.challenge = id || null;
      var ch = currentChallenge();
      if (ch) {
        if (ch.random) S.sheet.brief = randomBrief();
        else if (ch.brief) S.sheet.brief = { text: t('chGoal_' + ch.id), budget: ch.brief.budget, size: ch.brief.size.slice(), weight: ch.brief.weight, minParts: ch.brief.minParts, extra: ch.brief.extra ? t('chExtra_' + ch.id) : '' };
        else S.sheet.brief = null;
        if (ch.object) S.scamper.object = t('chObj_' + ch.id);
        commit(t('challengeSet', { c: t('chTitle_' + ch.id) }));
        setView(ch.scamper ? 'scamper' : 'sheet');
        ctx.announce(t('challengeSet', { c: t('chTitle_' + ch.id) }) + ' ' + t('chGoal_' + ch.id));
      } else { S.sheet.brief = null; commit(t('challengeDropped')); renderInspector(); ctx.announce(t('challengeDropped')); }
    }
    function setView(v) {
      if (VIEWS.indexOf(v) < 0 || v === S.view) { renderStructure(); return; }
      sprintStop();
      S.view = v; S.sel = S.view === 'board' ? S.sel : null; pending = null;
      applyViewTools(); renderPane(); renderStructure(); renderInspector(); updateSummary();
      ctx.commit(t('viewSet', { v: t('view_' + v) })); ctx.announce(t('view_' + v) + '. ' + t('viewInfo_' + v));
    }

    /* ---- Herramientas: se montan una sola vez y se muestran según la vista ---- */
    var BOARD_TOOLS = [['bselect', 'toolSelect', 'select'], ['addnote', 'toolNote', 'square'], ['addnode', 'toolNode', 'circle'], ['link', 'toolLink', 'line'], ['berase', 'toolErase', 'erase']];
    var viewSel = null;
    function buildTools() {
      var list = [];
      viewSel = h('select', { 'aria-label': t('viewLabel') });
      GROUPS.forEach(function (g) {
        var og = D.createElement('optgroup'); og.label = t(g[0]);
        g[1].forEach(function (v) { var o = h('option', { value: v, text: t('view_' + v) }); if (v === S.view) o.selected = true; og.appendChild(o); });
        viewSel.appendChild(og);
      });
      viewSel.addEventListener('change', function () { setView(viewSel.value); });
      list.push({ node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('viewShort') }), viewSel) });
      list.push({ separator: true });
      BOARD_TOOLS.forEach(function (x) { list.push({ id: x[0], label: t(x[1]), icon: x[2] }); });
      ctx.setTools(list, { initial: 'bselect' });
      applyViewTools();
    }
    function applyViewTools() {
      var onBoard = S.view === 'board';
      BOARD_TOOLS.forEach(function (x, i) {
        var b = ctx.toolButton(x[0]); if (!b) return;
        b.hidden = !onBoard;
        if (onBoard) b.setAttribute('aria-keyshortcuts', String(i + 1)); else b.removeAttribute('aria-keyshortcuts');
      });
      if (viewSel) viewSel.value = S.view;
      if (onBoard && BOARD_TOOLS.map(function (x) { return x[0]; }).indexOf(ctx.tool()) < 0) ctx.selectTool('bselect');
      var vis = Array.prototype.filter.call(ctx.toolbar.querySelectorAll('button,select,input'), function (b) { return !b.disabled && b.offsetParent !== null; });
      var act = vis.indexOf(D.activeElement);
      vis.forEach(function (b, i) { b.tabIndex = i === (act >= 0 ? act : 0) ? 0 : -1; });
    }

    /* ================= Puntero y teclado en el lienzo ================= */
    function canvasPoint(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    var drag = null;
    canvas.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || !usesCanvas()) return;
      var p = canvasPoint(e); kc.x = p.x; kc.y = p.y; cursorShown = false;
      if (S.view === 'shapes') {
        var lay = drawShapes(canvas.getContext('2d'), canvas.clientWidth, canvas.clientHeight, true);
        var cx = Math.floor((p.x - lay.ox) / lay.sc / CELL), cy = Math.floor((p.y - lay.oy) / lay.sc / CELL), found = -1;
        S.shapes.list.forEach(function (s, i) { if (s.col === cx && s.r === cy) found = i; });
        if (found >= 0) { S.shapes.sel = found; renderStructure(); renderInspector(); draw(); ctx.announce(t('pieceChosen', { n: found + 1 })); }
        return;
      }
      var hit = hitAt(p.x, p.y);
      if (tool === 'addnote' || tool === 'addnode') { addItem(tool === 'addnode' ? 'node' : 'note', ''); commit(t(tool === 'addnode' ? 'nodeAdded' : 'noteAdded')); renderInspector(); ctx.announce(t(tool === 'addnode' ? 'nodeAdded' : 'noteAdded')); return; }
      if (tool === 'berase') { if (hit) { removeItem(hit.id); commit(t('noteDeleted')); renderInspector(); ctx.announce(t('noteDeleted')); } else ctx.announce(t('nothingHere')); return; }
      if (tool === 'link') {
        if (!hit) { ctx.announce(t('linkNeedsNote')); return; }
        if (!pending) { pending = { kind: 'link', a: hit.id }; draw(); ctx.announce(t('linkStart')); return; }
        var on = toggleLink(pending.a, hit.id); pending = null; commit(on ? t('connected') : t('disconnected')); ctx.announce(on ? t('connected') : t('disconnected')); return;
      }
      select(hit ? hit.id : null);
      if (hit) { drag = { id: hit.id, dx: p.x - hit.x, dy: p.y - hit.y, moved: false }; canvas.setPointerCapture(e.pointerId); }
    });
    canvas.addEventListener('pointermove', function (e) {
      var p = canvasPoint(e);
      if (drag) { var it = itemById(drag.id); if (it) { it.x = Math.max(0, Math.round(p.x - drag.dx)); it.y = Math.max(0, Math.round(p.y - drag.dy)); drag.moved = true; draw(); } return; }
      if (pending) { kc.x = p.x; kc.y = p.y; draw(); }
    });
    function endDrag() { if (!drag) return; var moved = drag.moved; drag = null; if (moved) { commit(t('moved')); renderInspector(); } }
    canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag);

    function onKey(e) {
      if (!vp.contains(e.target) || !usesCanvas() || ctx.isEditable(e.target)) return false;
      var k = e.key, big = e.shiftKey;
      if (S.view === 'shapes') {
        var st = S.shapes, s = st.list[st.sel];
        var d = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[k];
        if (d) {
          if (!s) { ctx.announce(t('noPieceChosen')); return true; }
          s.r = clamp(s.r + d[0], 0, GRID - 1); s.col = clamp(s.col + d[1], 0, GRID - 1);
          commit(t('pieceMoved')); renderInspector(); ctx.announce(describeShape(s, st.sel)); return true;
        }
        if (k === 'Enter' || k === ' ') { if (!st.list.length) return true; st.sel = (st.sel + 1) % st.list.length; renderStructure(); renderInspector(); draw(); ctx.announce(describeShape(st.list[st.sel], st.sel)); return true; }
        if ((k === 'r' || k === 'R') && s) { s.rot = (s.rot + (big ? -45 : 45) + 360) % 360; commit(t('pieceTurned')); renderInspector(); ctx.announce(describeShape(s, st.sel)); return true; }
        if ((k === '+' || k === '=') && s) { s.sc = Math.min(2, Math.round((s.sc + 0.25) * 100) / 100); commit(t('pieceResized')); renderInspector(); return true; }
        if (k === '-' && s) { s.sc = Math.max(0.5, Math.round((s.sc - 0.25) * 100) / 100); commit(t('pieceResized')); renderInspector(); return true; }
        if ((k === 'Delete' || k === 'Backspace') && s) { st.list.splice(st.sel, 1); st.sel = st.list.length ? 0 : -1; commit(t('pieceRemoved')); renderInspector(); ctx.announce(t('pieceRemoved')); return true; }
        return false;
      }
      var step = big ? 40 : 10, dd = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[k];
      if (dd) {
        var it = S.sel ? itemById(S.sel) : null;
        if (it && tool === 'bselect') {
          it.x = Math.max(0, it.x + dd[0]); it.y = Math.max(0, it.y + dd[1]);
          commit(t('moved')); renderInspector(); ctx.announce(t('notePos', { x: Math.round(it.x), y: Math.round(it.y) }));
        } else {
          kc.x = Math.max(0, kc.x + dd[0]); kc.y = Math.max(0, kc.y + dd[1]); cursorShown = true; draw();
          var over = hitAt(kc.x, kc.y);
          ctx.announce(t('cursorAt', { x: Math.round(kc.x), y: Math.round(kc.y) }) + (over ? ' · ' + String(over.text || t('emptyNote')).split('\n')[0] : ''));
        }
        return true;
      }
      if (k === 'Enter' || k === ' ') {
        cursorShown = true;
        var hit2 = hitAt(kc.x, kc.y);
        if (tool === 'addnote' || tool === 'addnode') { addItem(tool === 'addnode' ? 'node' : 'note', ''); commit(t(tool === 'addnode' ? 'nodeAdded' : 'noteAdded')); renderInspector(); ctx.announce(t(tool === 'addnode' ? 'nodeAdded' : 'noteAdded')); return true; }
        if (tool === 'berase') { if (hit2) { removeItem(hit2.id); commit(t('noteDeleted')); renderInspector(); ctx.announce(t('noteDeleted')); } else ctx.announce(t('nothingHere')); return true; }
        if (tool === 'link') {
          if (!hit2) { ctx.announce(t('linkNeedsNote')); return true; }
          if (!pending) { pending = { kind: 'link', a: hit2.id }; draw(); ctx.announce(t('linkStart')); return true; }
          var on2 = toggleLink(pending.a, hit2.id); pending = null; commit(on2 ? t('connected') : t('disconnected')); ctx.announce(on2 ? t('connected') : t('disconnected')); return true;
        }
        select(hit2 ? hit2.id : null); if (!hit2) ctx.announce(t('nothingHere'));
        return true;
      }
      if (k === 'Escape') {
        if (pending) { pending = null; draw(); ctx.announce(t('cancelled')); return true; }
        if (S.sel) { select(null); ctx.announce(t('deselected')); return true; }
        return false;
      }
      if ((k === 'Delete' || k === 'Backspace') && S.sel) { removeItem(S.sel); commit(t('noteDeleted')); renderInspector(); ctx.announce(t('noteDeleted')); return true; }
      if (/^[1-9]$/.test(k) && S.view === 'board') {
        var idx = +k - 1;
        if (idx < BOARD_TOOLS.length) { ctx.selectTool(BOARD_TOOLS[idx][0]); ctx.announce(t(BOARD_TOOLS[idx][1])); return true; }
      }
      return false;
    }

    /* ================= Texto alternativo del lienzo ================= */
    function updateSummary() {
      var s;
      if (S.view === 'board') s = items().length ? t('sumBoard', { n: items().length, l: S.board.links.length, first: String((items()[0] || {}).text || '').split('\n')[0].slice(0, 60) }) : t('sumBoardEmpty');
      else if (S.view === 'shapes') s = t('sumShapes', { n: S.shapes.list.length, title: S.shapes.title || '—' });
      else if (S.view === 'scamper') s = t('sumScamper', { o: S.scamper.object || t('scThis'), n: scamperIdeas() });
      else if (S.view === 'sprint') s = t('sumSprint', { n: S.sprint.ideas.length, m: S.sprint.target, time: fmtTime(sprintLeft) });
      else if (S.view === 'uses') s = t('sumUses', { n: S.uses.list.length, g: flexibility() });
      else if (S.view === 'matrix') s = t('sumMatrix', { n: S.matrix.items.length, c: S.matrix.criteria.length });
      else if (S.view === 'sheet') { var tt = totals(), cl = checks(); s = t('sumSheet', { name: S.sheet.name || '—', p: tt.n, c: num(tt.cost, 2), w: num(tt.weight, 0), ok: cl.filter(function (x) { return x.ok; }).length, n: cl.length }); }
      else if (S.view === 'whatif') s = t('sumWhatIf', { n: S.whatif.answers.length });
      else if (S.view === 'stories') s = t('sumStories', { n: lines(S.stories.text).length });
      else if (S.view === 'combine') s = t('sumCombine', { name: S.combine.name || '—' });
      else s = t('sumPov', { n: Object.keys(S.pov.texts).filter(function (k) { return String(S.pov.texts[k]).trim(); }).length });
      ctx.setSummary(t('view_' + S.view) + '. ' + s);
    }

    /* ================= Exportaciones ================= */
    function base(sfx) { return (LANG === 'en' ? 'ideas-' : 'ideas-') + ctx.stamp() + sfx; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    /* Recorta a lo que hay, con un margen: la imagen exportada no lleva espacio vacío de más. */
    function boardBounds() {
      var g = canvas.getContext('2d'), any = false, b = { minX: 0, minY: 0, maxX: 320, maxY: 220 };
      items().forEach(function (it) {
        var bb = itemBox(g, it);
        if (!any) { b = { minX: bb.x, minY: bb.y, maxX: bb.x + bb.w, maxY: bb.y + bb.h }; any = true; }
        b.minX = Math.min(b.minX, bb.x); b.minY = Math.min(b.minY, bb.y);
        b.maxX = Math.max(b.maxX, bb.x + bb.w); b.maxY = Math.max(b.maxY, bb.y + bb.h);
      });
      var m = 20;
      return { minX: b.minX - m, minY: b.minY - m, w: Math.max(160, b.maxX - b.minX + 2 * m), h: Math.max(120, b.maxY - b.minY + 2 * m) };
    }
    function exportBoardPng() {
      var b = boardBounds(), c = D.createElement('canvas'), sc = 2;
      c.width = Math.round(b.w * sc); c.height = Math.round(b.h * sc);
      var g = c.getContext('2d'); g.scale(sc, sc); g.fillStyle = '#ffffff'; g.fillRect(0, 0, b.w, b.h);
      g.translate(-b.minX, -b.minY); drawBoard(g, b.w, b.h, true);
      ctx.canvasBlob(ctx.canvasWithCredit(c, '#ffffff')).then(function (bl) { ctx.download(bl, base('-tablero.png'.replace('tablero', LANG === 'en' ? 'board' : 'tablero'))); });
    }
    function exportBoardSvg() {
      var g = canvas.getContext('2d'), b = boardBounds(), out = [];
      out.push('<?xml version="1.0" encoding="UTF-8"?>');
      out.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + Math.round(b.w) + '" height="' + Math.round(b.h + 26) + '" viewBox="0 0 ' + Math.round(b.w) + ' ' + Math.round(b.h + 26) + '">');
      out.push('<title>' + esc(t('view_board')) + '</title>');
      out.push('<rect width="100%" height="100%" fill="#ffffff"/>');
      out.push('<g transform="translate(' + (-b.minX) + ',' + (-b.minY) + ')">');
      S.board.links.forEach(function (lk) {
        var a = itemById(lk.a), c2 = itemById(lk.b); if (!a || !c2) return;
        var ba = itemBox(g, a), bb = itemBox(g, c2);
        out.push('<line x1="' + (ba.x + ba.w / 2) + '" y1="' + (ba.y + ba.h / 2) + '" x2="' + (bb.x + bb.w / 2) + '" y2="' + (bb.y + bb.h / 2) + '" stroke="#7d93a8" stroke-width="2"/>');
      });
      items().forEach(function (it) {
        var bb = itemBox(g, it), r = it.kind === 'node' ? Math.min(bb.h / 2, 22) : 8;
        out.push('<rect x="' + bb.x + '" y="' + bb.y + '" width="' + bb.w + '" height="' + bb.h + '" rx="' + r + '" fill="' + esc(it.colour) + '" stroke="#44586c" stroke-width="1.5"/>');
        bb.lines.forEach(function (ln, i) { out.push('<text x="' + (bb.x + 10) + '" y="' + (bb.y + 22 + i * (bb.size + 4)) + '" font-family="Atkinson Hyperlegible, system-ui, sans-serif" font-size="' + bb.size + '" font-weight="' + (it.kind === 'node' ? 700 : 600) + '" fill="#172b42">' + esc(ln) + '</text>'); });
      });
      out.push('</g>');
      out.push('<text x="' + (b.w - 10) + '" y="' + (b.h + 16) + '" text-anchor="end" font-family="Atkinson Hyperlegible, system-ui, sans-serif" font-size="11" fill="#44586c">IRIS GREEN · irisgreen.eu</text>');
      out.push('</svg>');
      ctx.download(new Blob([out.join('\n')], { type: 'image/svg+xml' }), base('-tablero.svg'.replace('tablero', LANG === 'en' ? 'board' : 'tablero')));
    }
    function md() {
      var L = [], sh = S.sheet, tt = totals(), groups = split1('t5Groups');
      L.push('# ' + (sh.name || t('view_sheet')) + '\n');
      if (sh.brief) { L.push('## ' + t('briefWord')); L.push(sh.brief.text); briefLimits(sh.brief).forEach(function (x) { L.push('- ' + x); }); L.push(''); }
      L.push('## ' + t('view_sheet'));
      ['name', 'who', 'problem', 'how', 'test', 'better'].forEach(function (k) { if (String(sh[k]).trim()) L.push('**' + t('f_' + k) + ':** ' + sh[k]); });
      if (tt.size.some(function (v) { return v; })) L.push('**' + t('sizeLegend') + ':** ' + tt.size.map(function (v) { return num(v, 1); }).join(' × ') + ' cm');
      if (sh.parts.length) {
        L.push('\n| ' + [t('thPart'), t('thQty'), t('thPrice'), t('thWeight')].join(' | ') + ' |');
        L.push('| --- | ---: | ---: | ---: |');
        sh.parts.forEach(function (p) { L.push('| ' + [p.name || '—', p.qty || '', p.price || '', p.weight || ''].join(' | ') + ' |'); });
        L.push('\n' + t('totals', { c: num(tt.cost, 2), w: num(tt.weight, 0), n: tt.n, s: tt.size.map(function (v) { return num(v, 1); }).join(' × ') }));
      }
      L.push('\n### ' + t('checksTitle'));
      checks().forEach(function (c) { L.push('- [' + (c.ok ? 'x' : ' ') + '] ' + c.text); });
      if (items().length) {
        L.push('\n## ' + t('view_board'));
        items().forEach(function (it) {
          L.push('- **' + t(it.kind === 'node' ? 'kindNode' : 'kindNote') + ':** ' + String(it.text || '').replace(/\n/g, ' / '));
          var mine = S.board.links.filter(function (l) { return l.a === it.id || l.b === it.id; }).map(function (l) { var o = itemById(l.a === it.id ? l.b : l.a); return o ? String(o.text || '').split('\n')[0] : ''; }).filter(Boolean);
          if (mine.length) L.push('  - ' + t('connections') + ': ' + mine.join('; '));
        });
      }
      if (S.scamper.object || scamperIdeas()) {
        L.push('\n## ' + t('view_scamper') + (S.scamper.object ? ' · ' + S.scamper.object : ''));
        LETTERS.forEach(function (x, i) { if (String(S.scamper.answers[i]).trim()) L.push('**' + t('sc_' + x) + ':** ' + S.scamper.answers[i].replace(/\n/g, ' / ')); });
      }
      if (S.sprint.ideas.length) { L.push('\n## ' + t('view_sprint') + (S.sprint.problem ? ' · ' + S.sprint.problem : '')); S.sprint.ideas.forEach(function (x, i) { L.push((i + 1) + '. ' + x); }); }
      if (S.uses.list.length) { L.push('\n## ' + t('view_uses')); L.push(t('useStats', { n: S.uses.list.length, g: flexibility() })); S.uses.list.forEach(function (u, i) { L.push((i + 1) + '. ' + u.t + ' (' + (groups[u.g] || '') + ')'); }); }
      if (S.whatif.answers.length) { L.push('\n## ' + t('view_whatif')); S.whatif.answers.forEach(function (x, i) { L.push((i + 1) + '. ' + x); }); }
      if (S.matrix.items.length) {
        L.push('\n## ' + t('view_matrix'));
        L.push('| ' + [t('option'), t('impact'), t('effort'), t('total')].join(' | ') + ' |'); L.push('| --- | ---: | ---: | ---: |');
        S.matrix.items.forEach(function (it) { L.push('| ' + [it.text, it.impact, it.effort, num(weightedTotal(it), 1)].join(' | ') + ' |'); });
        if (S.matrix.criteria.length) L.push('\n' + t('criteria') + ': ' + S.matrix.criteria.map(function (c) { return c.name + ' (' + c.weight + ')'; }).join(', '));
      }
      L.push('\n---\nIRIS GREEN · irisgreen.eu');
      return L.join('\n');
    }
    function exportMd() { ctx.download(new Blob([md()], { type: 'text/markdown;charset=utf-8' }), base('.md')); }

    /* Ficha imprimible: dos hojas A4 en SVG semántico; el navegador hace el PDF. */
    function svgWrapText(text, chars) {
      var words = String(text || '').replace(/\n+/g, ' ').split(/\s+/), out = [], cur = '';
      words.forEach(function (w) { var n = cur ? cur + ' ' + w : w; if (n.length > chars && cur) { out.push(cur); cur = w; } else cur = n; });
      if (cur) out.push(cur);
      return out;
    }
    function printSheet() {
      var sh = S.sheet, tt = totals(), pages = [], y;
      function page(build) {
        var parts = ['<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" role="img">'];
        parts.push('<rect width="210" height="297" fill="#ffffff"/>');
        parts.push('<style>text{font-family:"Atkinson Hyperlegible",system-ui,sans-serif;fill:#172b42}.h{font-size:7;font-weight:700}.h2{font-size:4.6;font-weight:700}.lb{font-size:3.1;font-weight:700;fill:#44586c}.tx{font-size:3.4}.sm{font-size:2.6;fill:#44586c}</style>');
        build(parts);
        parts.push('<text class="sm" x="195" y="288" text-anchor="end">IRIS GREEN · irisgreen.eu</text>');
        parts.push('</svg>');
        var wrapEl = D.createElement('div'); wrapEl.innerHTML = parts.join('');
        pages.push(wrapEl.firstChild);
      }
      function block(parts, label, text, chars) {
        if (!String(text).trim()) return;
        parts.push('<text class="lb" x="15" y="' + y + '">' + esc(label) + '</text>'); y += 4.6;
        svgWrapText(text, chars || 88).forEach(function (ln) { parts.push('<text class="tx" x="15" y="' + y + '">' + esc(ln) + '</text>'); y += 4.4; });
        y += 2.4;
      }
      page(function (parts) {
        y = 22;
        parts.push('<text class="h" x="15" y="' + y + '">' + esc(sh.name || t('view_sheet')) + '</text>'); y += 9;
        if (sh.brief) {
          parts.push('<rect x="13" y="' + (y - 5) + '" width="184" height="' + (8 + 4.4 * (svgWrapText(sh.brief.text, 86).length + briefLimits(sh.brief).length)) + '" fill="#f3f1fb" stroke="#5a49a8" stroke-width="0.4"/>');
          block(parts, t('briefWord'), sh.brief.text, 86);
          briefLimits(sh.brief).forEach(function (x) { parts.push('<text class="tx" x="17" y="' + y + '">· ' + esc(x) + '</text>'); y += 4.4; });
          y += 4;
        }
        ['who', 'problem', 'how', 'test', 'better'].forEach(function (k) { block(parts, t('f_' + k), sh[k]); });
        if (tt.size.some(function (v) { return v; })) block(parts, t('sizeLegend'), tt.size.map(function (v) { return num(v, 1); }).join(' × ') + ' cm');
      });
      page(function (parts) {
        y = 22;
        parts.push('<text class="h2" x="15" y="' + y + '">' + esc(t('partsTitle')) + '</text>'); y += 7;
        parts.push('<text class="lb" x="15" y="' + y + '">' + esc(t('thPart')) + '</text>');
        parts.push('<text class="lb" x="120" y="' + y + '">' + esc(t('thQty')) + '</text>');
        parts.push('<text class="lb" x="145" y="' + y + '">' + esc(t('thPrice')) + '</text>');
        parts.push('<text class="lb" x="172" y="' + y + '">' + esc(t('thWeight')) + '</text>');
        y += 1.5; parts.push('<line x1="15" y1="' + y + '" x2="195" y2="' + y + '" stroke="#c9d8e6" stroke-width="0.4"/>'); y += 4.4;
        (sh.parts.length ? sh.parts : [{ name: '—', qty: '', price: '', weight: '' }]).forEach(function (p) {
          parts.push('<text class="tx" x="15" y="' + y + '">' + esc(String(p.name || '—').slice(0, 52)) + '</text>');
          parts.push('<text class="tx" x="120" y="' + y + '">' + esc(p.qty || '') + '</text>');
          parts.push('<text class="tx" x="145" y="' + y + '">' + esc(p.price || '') + '</text>');
          parts.push('<text class="tx" x="172" y="' + y + '">' + esc(p.weight || '') + '</text>');
          y += 4.6;
        });
        y += 2; block(parts, t('totalsShort'), t('totals', { c: num(tt.cost, 2), w: num(tt.weight, 0), n: tt.n, s: tt.size.map(function (v) { return num(v, 1); }).join(' × ') }));
        parts.push('<text class="h2" x="15" y="' + y + '">' + esc(t('checksTitle')) + '</text>'); y += 6;
        checks().forEach(function (c) { parts.push('<text class="tx" x="15" y="' + y + '">' + (c.ok ? '✓' : '·') + ' ' + esc(c.text) + '</text>'); y += 4.4; });
        y += 4;
        parts.push('<text class="h2" x="15" y="' + y + '">' + esc(t('sketchTitle')) + '</text>'); y += 4;
        var bw = 180, bh = Math.min(120, 280 - y), scale = Math.min(bw / 640, bh / 440);
        parts.push('<rect x="15" y="' + y + '" width="' + (640 * scale) + '" height="' + (440 * scale) + '" fill="#ffffff" stroke="#c9d8e6" stroke-width="0.4"/>');
        S.sheet.sketch.forEach(function (st) {
          if (st.pts.length < 2) return;
          var d = st.pts.map(function (p, i) { return (i ? 'L' : 'M') + (15 + p[0] * scale).toFixed(2) + ',' + (y + p[1] * scale).toFixed(2); }).join(' ');
          parts.push('<path d="' + d + '" fill="none" stroke="#172b42" stroke-width="' + (0.6).toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round"/>');
        });
      });
      ctx.printPages(pages);
      ctx.announce(t('printing'));
    }
    ctx.addExport(t('printSheet'), printSheet, 'file');
    ctx.addExport(t('exportMd'), exportMd);
    ctx.addExport(t('exportBoardPng'), exportBoardPng);
    ctx.addExport(t('exportBoardSvg'), exportBoardSvg);
    ctx.command('board', t('view_board'), t('grpBoard'), function () { setView('board'); });
    ctx.command('sheet', t('view_sheet'), t('grpInvention'), function () { setView('sheet'); });
    ctx.command('scamper', t('view_scamper'), t('grpTechniques'), function () { setView('scamper'); });
    ctx.command('sprint', t('view_sprint'), t('grpTechniques'), function () { setView('sprint'); });
    ctx.command('matrix', t('view_matrix'), t('grpEvaluate'), function () { setView('matrix'); });
    ctx.command('print', t('printSheet'), t('fileMenu'), printSheet);
    ctx.command('md', t('exportMd'), t('fileMenu'), exportMd);
    ctx.command('newnote', t('newNote'), t('view_board'), function () { if (S.view !== 'board') setView('board'); addAtFreeSpot('note'); });

    /* ================= Puntos de partida ================= */
    function ex(id) {
      sprintStop();
      var seed = S.seed; S = defaults(); S.seed = seed || 'iris'; sprintLeft = S.sprint.minutes * 60;
      if (id === 'toy') { S.view = 'scamper'; S.scamper.object = t('toyObject'); }
      else if (id === 'sprint') { S.view = 'sprint'; S.sprint.problem = t('teenProblem'); sprintLeft = 480; }
      else if (id === 'brief') { S.view = 'sheet'; S.challenge = 'i5'; var c5 = CHALLENGES[4]; S.sheet.brief = { text: t('chGoal_i5'), budget: c5.brief.budget, size: c5.brief.size.slice(), weight: c5.brief.weight, minParts: c5.brief.minParts, extra: '' }; }
      else if (id === 'tables') { S.view = 'stories'; }
      else if (id === 'map') {
        S.view = 'board';
        var centre = { id: 'n1', kind: 'node', text: t('mapCentre'), colour: NOTE_COLOURS[4][0], x: 250, y: 150 };
        S.board.items = [centre];
        [t('mapBranch1'), t('mapBranch2'), t('mapBranch3')].forEach(function (x, i) {
          S.board.items.push({ id: 'n' + (i + 2), kind: 'note', text: x, colour: NOTE_COLOURS[i][0], x: [40, 470, 250][i], y: [40, 40, 300][i] });
          S.board.links.push({ a: 'n1', b: 'n' + (i + 2) });
        });
        S.board.next = 5; S.sel = 'n1';
      } else if (id === 'decide') {
        S.view = 'matrix';
        [t('decideA'), t('decideB'), t('decideC')].forEach(function (x) { addMatrixItem(x); });
        S.matrix.items[0].impact = 5; S.matrix.items[0].effort = 2;
        S.matrix.items[1].impact = 3; S.matrix.items[1].effort = 4;
        S.matrix.items[2].impact = 4; S.matrix.items[2].effort = 3;
        [t('crit1'), t('crit2')].forEach(function (n2) { S.matrix.criteria.push({ id: 'c' + S.matrix.next, name: n2, weight: 3 }); S.matrix.next += 1; });
      }
      applyViewTools(); renderPane(); renderStructure(); renderInspector(); updateSummary();
    }

    /* ================= Proyecto ================= */
    function okNum(v, a, b) { return typeof v === 'number' && isFinite(v) && v >= a && v <= b; }
    function okStr(v, n) { return typeof v === 'string' && v.length <= n; }
    function validate(d) {
      try {
        if (!d || VIEWS.indexOf(d.view) < 0 || THEMES.indexOf(d.theme) < 0 || ['sencillo', 'mas'].indexOf(d.mode) < 0) return false;
        if (!okStr(d.seed, 40) || !okNum(d.rc, 0, 1e7)) return false;
        if (d.challenge !== null && !CHALLENGES.some(function (c) { return c.id === d.challenge; })) return false;
        var b = d.board;
        if (!b || !Array.isArray(b.items) || b.items.length > 300 || !Array.isArray(b.links) || b.links.length > 900 || !okNum(b.next, 1, 1e6)) return false;
        if (!b.items.every(function (it) { return it && okStr(it.id, 12) && (it.kind === 'note' || it.kind === 'node') && okStr(it.text, 400) && /^#[0-9a-fA-F]{3,8}$/.test(it.colour) && okNum(it.x, -1e4, 1e4) && okNum(it.y, -1e4, 1e4); })) return false;
        if (!b.links.every(function (l) { return l && okStr(l.a, 12) && okStr(l.b, 12); })) return false;
        if (!d.scamper || !Array.isArray(d.scamper.answers) || d.scamper.answers.length !== 7 || !d.scamper.answers.every(function (x) { return okStr(x, 1200); }) || !okStr(d.scamper.object, 80)) return false;
        if (!d.sprint || !okNum(d.sprint.minutes, 1, 60) || !okNum(d.sprint.target, 1, 40) || !okStr(d.sprint.problem, 300) || !Array.isArray(d.sprint.ideas) || d.sprint.ideas.length > 200 || !d.sprint.ideas.every(function (x) { return okStr(x, 200); })) return false;
        var m = d.matrix;
        if (!m || !Array.isArray(m.items) || m.items.length > 100 || !Array.isArray(m.criteria) || m.criteria.length > 20 || !okNum(m.next, 1, 1e6)) return false;
        if (!m.items.every(function (it) { return it && okStr(it.id, 12) && okStr(it.text, 120) && okNum(it.impact, 1, 5) && okNum(it.effort, 1, 5) && it.scores && typeof it.scores === 'object'; })) return false;
        if (!m.criteria.every(function (c) { return c && okStr(c.id, 12) && okStr(c.name, 60) && okNum(c.weight, 1, 5); })) return false;
        var sh = d.sheet;
        if (!sh || !Array.isArray(sh.parts) || sh.parts.length > 80 || !Array.isArray(sh.size) || sh.size.length !== 3) return false;
        if (!['name', 'problem', 'who', 'how', 'test', 'better'].every(function (k) { return okStr(sh[k], 1200); })) return false;
        if (!sh.parts.every(function (p) { return p && okStr(p.name, 60) && okStr(p.qty, 12) && okStr(p.price, 12) && okStr(p.weight, 12); })) return false;
        if (!Array.isArray(sh.sketch) || sh.sketch.length > 400) return false;
        if (!sh.sketch.every(function (st) { return st && Array.isArray(st.pts) && st.pts.length <= 3000 && st.pts.every(function (p) { return Array.isArray(p) && p.length >= 2 && okNum(p[0], -50, 700) && okNum(p[1], -50, 500); }); })) return false;
        if (sh.brief !== null && typeof sh.brief !== 'object') return false;
        var sp = d.shapes;
        if (!sp || !Array.isArray(sp.list) || sp.list.length > 12) return false;
        if (!sp.list.every(function (s) { return s && SHAPE_KEYS.indexOf(s.t) >= 0 && okNum(s.r, 0, GRID - 1) && okNum(s.col, 0, GRID - 1) && okNum(s.rot, 0, 359) && okNum(s.sc, 0.25, 4) && okNum(s.c, 0, FILLS.length - 1); })) return false;
        if (!d.uses || !Array.isArray(d.uses.list) || d.uses.list.length > 300) return false;
        if (!d.whatif || !Array.isArray(d.whatif.answers) || d.whatif.answers.length > 300) return false;
        if (!d.pov || typeof d.pov.texts !== 'object' || !d.stories || !d.combine) return false;
        return true;
      } catch (_) { return false; }
    }

    buildTools(); renderPane(); renderStructure(); renderInspector(); updateSummary();
    return {
      serialize: function () { return clone(S); },
      validate: validate,
      restore: function (st) {
        sprintStop();
        S = clone(st); pending = null; drag = null; sketchStroke = null;
        sprintLeft = S.sprint.minutes * 60;
        applyViewTools(); renderPane(); renderStructure(); renderInspector(); updateSummary();
      },
      start: function (id) { ex(id); },
      onTool: function (id) { tool = id; pending = null; if (usesCanvas()) draw(); },
      onKey: onKey
    };
  }
})(window);
