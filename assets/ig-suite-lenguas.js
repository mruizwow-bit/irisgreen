/* Iris Green · El taller · Estudio de lenguas inventadas (R43).
   El «lienzo» es el documento de tu lengua: cada parte (sonidos, sílabas, escritura, gramática,
   diccionario, texto y cambios de sonido) se edita en el centro; Estructura lista las partes y
   Propiedades muestra las reglas, las comprobaciones y los retos.
   Sonidos: tablas del Alfabeto Fonético Internacional (IPA Chart, 2020) con descripción en lenguaje claro.
   Glosa interlineal según las Leipzig Glossing Rules (2015). Conceptos básicos inspirados en Swadesh (1955).
   Sin audio. Privacidad: nada sale del navegador salvo cuando la persona descarga un archivo. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang, DATA = IG.LenguasDatos, SVGNS = 'http://www.w3.org/2000/svg';
  var CREDIT = 'IRIS GREEN · irisgreen.eu';
  var SECTIONS = ['sounds', 'syllables', 'writing', 'grammar', 'dict', 'text', 'changes'];
  var GOAL_SIGNS = 20, GOAL_WORDS = 100, MAX_LEX = 600, MAX_TEXTS = 40;
  /* Rejilla de trazos: 3 columnas × 4 filas de puntos (0 a 11). */
  var GW = 3, GH = 4;
  function px(i) { return 12 + (i % GW) * 18; }
  function py(i) { return 12 + Math.floor(i / GW) * 18; }
  var GLYPH_W = 12 + (GW - 1) * 18 + 12, GLYPH_H = 12 + (GH - 1) * 18 + 12;
  /* Diseños de signo propios del taller (trazos entre puntos de la rejilla). */
  var PRESETS = [
    [[0, 2], [1, 10]], [[0, 9], [9, 11]], [[0, 2], [2, 11], [9, 11]], [[1, 10]], [[0, 11]], [[2, 9]],
    [[0, 2], [0, 9], [9, 11]], [[3, 5], [4, 10]], [[0, 6], [6, 8], [8, 2]], [[0, 1], [1, 5], [5, 11]],
    [[1, 4], [4, 6], [4, 8]], [[3, 5], [3, 9], [5, 11]], [[0, 2], [1, 7], [6, 8]], [[6, 0], [0, 2], [2, 8]],
    [[9, 1], [1, 11]], [[0, 4], [4, 2], [4, 10]], [[3, 4], [4, 1], [4, 7], [7, 10]], [[0, 3], [3, 7], [7, 11]],
    [[2, 5], [5, 7], [7, 9]], [[1, 4], [3, 5], [4, 10]], [[0, 2], [1, 4], [3, 5]], [[6, 8], [7, 1], [0, 2]],
    [[0, 9], [0, 2], [2, 11]], [[4, 0], [4, 2], [4, 6], [4, 8]]
  ];
  function symInfo(sym) {
    var c = DATA.CONS.concat(DATA.OTHER).filter(function (x) { return x[0] === sym; })[0];
    if (c) return { kind: 'c', place: c[1], manner: c[2], voiced: !!c[3] };
    var v = DATA.VOWELS.filter(function (x) { return x[0] === sym; })[0];
    if (v) return { kind: 'v', height: v[1], back: v[2], round: !!v[3] };
    return null;
  }

  IG.defineEngine('lenguas', {
    version: 1, fileBase: LANG === 'en' ? 'language' : 'lengua',
    extraKeys: ['kLangTable', 'kLangParts'],
    initialStart: function (para) { return { child: 'secret', teen: 'fantasy', adult: 'full' }[para] || 'translate'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'secret', title: t('stSecret'), desc: t('stSecretD'), para: 'child' },
        { id: 'fantasy', title: t('stFantasy'), desc: t('stFantasyD'), para: 'teen' },
        { id: 'full', title: t('stFull'), desc: t('stFullD'), para: 'adult' },
        { id: 'translate', title: t('stTranslate'), desc: t('stTranslateD'), para: 'any' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport;
    var S = empty(), seq = 0, section = 'sounds', sel = null, curText = 0, search = '', gen = [], genSeed = '';
    var FOCUS_KEY = null;

    function empty() {
      return { v: 1, name: t('newLangName'), cons: [], vowels: [], patterns: [{ p: 'CV', w: 4 }, { p: 'CVC', w: 2 }],
        seed: 'iris', roman: {}, glyphs: {},
        grammar: { order: 'SVO', adj: 'after', plural: { type: 'suffix', form: 'ni' }, past: { type: 'suffix', form: 'ka' }, present: { type: 'suffix', form: '' }, future: { type: 'suffix', form: 'tu' } },
        lex: [], changes: [], texts: [] };
    }
    function nid() { seq += 1; return 'w' + seq; }
    function sounds() { return S.cons.concat(S.vowels); }
    function romanOf(sym) { return S.roman[sym] !== undefined ? S.roman[sym] : DATA.roman(sym, LANG); }
    function romanWord(ph) { return (ph || []).map(romanOf).join(''); }
    function example(sym) { var k = 'ex_' + DATA.key(sym), v = t(k); return v === k ? '' : v; }
    function describe(sym) {
      var i = symInfo(sym); if (!i) return sym;
      if (i.kind === 'c') return t('cDesc', { m: t('m_' + i.manner), p: t('p_' + i.place), v: t(i.voiced ? 'voiced' : 'voiceless') });
      return t('vDesc', { h: t('h_' + i.height), b: t('b_' + i.back), r: t(i.round ? 'rounded' : 'unrounded') });
    }
    function howTo(sym) {
      var i = symInfo(sym); if (!i) return '';
      return i.kind === 'c' ? t('how_' + i.manner) + ' ' + t('where_' + i.place) : t('howV', { h: t('h_' + i.height), b: t('b_' + i.back) });
    }
    function soundLabel(sym) { var ex = example(sym); return sym + ' («' + romanOf(sym) + '»). ' + describe(sym) + '. ' + howTo(sym) + (ex ? ' ' + ex : ''); }

    /* ---------- Fonotaxis y generador ---------- */
    function validPattern(p) { return /^[CV]{1,5}$/.test(String(p || '').toUpperCase()); }
    function pickBy(rnd, list) { return list[Math.min(list.length - 1, Math.floor(rnd() * list.length))]; }
    function pickPattern(rnd) {
      var tot = S.patterns.reduce(function (a, x) { return a + Math.max(0, x.w); }, 0);
      if (!tot) return S.patterns[0] ? S.patterns[0].p : 'CV';
      var r = rnd() * tot;
      for (var i = 0; i < S.patterns.length; i++) { r -= Math.max(0, S.patterns[i].w); if (r <= 0) return S.patterns[i].p; }
      return S.patterns[S.patterns.length - 1].p;
    }
    function makeWord(rnd) {
      var n = 1 + (rnd() < 0.55 ? 1 : 0) + (rnd() < 0.18 ? 1 : 0), ph = [];
      for (var s = 0; s < n; s++) {
        var pat = String(pickPattern(rnd)).toUpperCase();
        for (var i = 0; i < pat.length; i++) ph.push(pat[i] === 'C' ? pickBy(rnd, S.cons) : pickBy(rnd, S.vowels));
      }
      return ph;
    }
    function known(ph) { var r = romanWord(ph); return S.lex.some(function (w) { return romanWord(w.ph) === r; }); }
    function generate(count, seed) {
      if (!S.cons.length || !S.vowels.length) return [];
      var rnd = ctx.rng(String(seed || S.seed) + '·' + S.cons.join('') + S.vowels.join('')), out = [], guard = 0;
      while (out.length < count && guard < count * 60) {
        guard++;
        var ph = makeWord(rnd);
        if (!ph.length || ph.length > 9) continue;
        var rw = romanWord(ph);
        /* Filtro de palabras malsonantes reales (ES y EN) sobre la lectura aproximada y la romanización. */
        if (DATA.isBad([DATA.plain(ph), rw])) continue;
        if (known(ph) || out.some(function (o) { return romanWord(o) === rw; })) continue;
        out.push(ph);
      }
      return out;
    }

    /* ---------- Cambios de sonido ---------- */
    function ruleText(r) { return (r.from || '?') + ' > ' + (r.to || '∅') + ' / ' + (r.left || '') + '_' + (r.right || ''); }
    function applyRule(ph, r) {
      var out = [], changed = false;
      for (var i = 0; i < ph.length; i++) {
        var L = i === 0 ? '#' : ph[i - 1], R = i === ph.length - 1 ? '#' : ph[i + 1];
        if (ph[i] === r.from && (!r.left || r.left === L) && (!r.right || r.right === R)) {
          changed = true; if (r.to) out.push(r.to);
        } else out.push(ph[i]);
      }
      return { ph: out, changed: changed };
    }
    function afterChanges(ph) {
      var cur = ph.slice(), any = false;
      S.changes.forEach(function (r) { if (!r.on || !r.from) return; var x = applyRule(cur, r); cur = x.ph; any = any || x.changed; });
      return { ph: cur, changed: any };
    }

    /* ---------- Gramática y glosa (Leipzig Glossing Rules) ---------- */
    function affixPh(a) { var p = parseRoman(a && a.form || ''); return p.ph; }
    function parseRoman(str) {
      var map = sounds().map(function (s) { return [String(romanOf(s)).toLowerCase(), s]; }).filter(function (x) { return x[0]; });
      map.sort(function (a, b) { return b[0].length - a[0].length; });
      var low = String(str || '').toLowerCase(), out = [], bad = [], i = 0;
      while (i < low.length) {
        if (/[\s'’-]/.test(low[i])) { i++; continue; }
        var m = null;
        for (var k = 0; k < map.length; k++) if (low.substr(i, map[k][0].length) === map[k][0]) { m = map[k]; break; }
        if (m) { out.push(m[1]); i += m[0].length; } else { if (bad.indexOf(low[i]) < 0) bad.push(low[i]); i++; }
      }
      return { ph: out, bad: bad };
    }
    function byId(id) { for (var i = 0; i < S.lex.length; i++) if (S.lex[i].id === id) return S.lex[i]; return null; }
    function meaning(w) { return (LANG === 'en' ? w.en || w.es : w.es || w.en) || '·'; }
    /* Devuelve las palabras de una frase, ya ordenadas y con sus afijos, con su glosa. */
    function buildSentence(tx) {
      var slots = (tx.words || []).map(function (s, i) { return { s: s, i: i, w: byId(s.ref) }; }).filter(function (x) { return x.w; });
      /* Los adjetivos se pegan al nombre que los precede (sujeto u objeto). */
      var groups = [], last = null;
      slots.forEach(function (x) {
        if (x.s.role === 'ADJ' && last) { last.adj.push(x); return; }
        last = { head: x, adj: [] }; groups.push(last);
      });
      var order = S.grammar.order, seqOut = [];
      ['S', 'V', 'O'].forEach(function () {});
      order.split('').forEach(function (role) { groups.forEach(function (g) { if (g.head.s.role === role) seqOut.push(g); }); });
      groups.forEach(function (g) { if (seqOut.indexOf(g) < 0) seqOut.push(g); });
      var outWords = [];
      seqOut.forEach(function (g) {
        var pack = [wordForm(g.head)];
        g.adj.forEach(function (a) { pack.push(wordForm(a)); });
        if (S.grammar.adj === 'before' && pack.length > 1) pack = pack.slice(1).concat([pack[0]]);
        pack.forEach(function (p) { outWords.push(p); });
      });
      return outWords;
    }
    function wordForm(x) {
      var base = afterChanges(x.w.ph).ph, forms = [{ ph: base, gloss: meaning(x.w), gram: false }];
      if (x.s.pl) { var a = S.grammar.plural; forms.push({ ph: affixPh(a), gloss: 'PL', gram: true, type: a.type }); }
      if (x.s.tense && x.s.tense !== 'none') {
        var b = S.grammar[x.s.tense] || { type: 'suffix', form: '' };
        forms.push({ ph: affixPh(b), gloss: { past: 'PST', present: 'PRS', future: 'FUT' }[x.s.tense], gram: true, type: b.type });
      }
      var ph = forms[0].ph.slice(), parts = [{ text: romanWord(forms[0].ph), gloss: forms[0].gloss, gram: false }];
      forms.slice(1).forEach(function (f) {
        /* Un afijo vacío no se escribe: la marca queda sin marcar (Leipzig, regla 1). */
        if (!f.ph.length) return;
        if (f.type === 'prefix') { ph = f.ph.concat(ph); parts.unshift({ text: romanWord(f.ph), gloss: f.gloss, gram: true }); }
        else { ph = ph.concat(f.ph); parts.push({ text: romanWord(f.ph), gloss: f.gloss, gram: true }); }
      });
      return { ph: ph, parts: parts, entry: x.w, slot: x.s };
    }
    function sentenceDone(tx) { return buildSentence(tx).length >= 2 && String(tx.free || '').trim().length > 0; }

    /* ---------- Signos ---------- */
    function glyph(sym) { return S.glyphs[sym] || null; }
    function glyphCount() { return Object.keys(S.glyphs).filter(function (k) { return S.glyphs[k] && S.glyphs[k].length; }).length; }
    function glyphSVG(sym, size, cls) {
      var svg = D.createElementNS(SVGNS, 'svg');
      svg.setAttribute('viewBox', '0 0 ' + GLYPH_W + ' ' + GLYPH_H);
      svg.setAttribute('width', size); svg.setAttribute('height', Math.round(size * GLYPH_H / GLYPH_W));
      svg.setAttribute('class', cls || 'igl-glyph'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
      var segs = glyph(sym) || [];
      if (!segs.length) {
        var d = D.createElementNS(SVGNS, 'rect');
        d.setAttribute('x', 4); d.setAttribute('y', 4); d.setAttribute('width', GLYPH_W - 8); d.setAttribute('height', GLYPH_H - 8);
        d.setAttribute('class', 'igl-glyph-empty'); svg.appendChild(d);
      }
      segs.forEach(function (s) {
        var ln = D.createElementNS(SVGNS, 'line');
        ln.setAttribute('x1', px(s[0])); ln.setAttribute('y1', py(s[0])); ln.setAttribute('x2', px(s[1])); ln.setAttribute('y2', py(s[1]));
        svg.appendChild(ln);
      });
      return svg;
    }

    /* ---------- Vista: el documento de la lengua ---------- */
    vp.setAttribute('role', 'region'); vp.removeAttribute('aria-roledescription'); vp.removeAttribute('tabindex');
    vp.classList.add('igl-viewport');
    var docEl = h('div', { class: 'igl-doc' });
    vp.appendChild(docEl);

    function tableWrap(node) { return h('div', { class: 'igs-table-wrap' }, node); }
    function progress(done, goal, label) {
      var pct = Math.min(100, Math.round(done / goal * 100));
      return h('div', { class: 'igl-progress' },
        h('p', { class: 'igl-progress-t' }, h('strong', { text: label }), ' ', t('progressN', { n: done, goal: goal })),
        h('div', { class: 'igl-bar', role: 'img', 'aria-label': t('progressPct', { n: pct }) }, h('span', { style: 'width:' + pct + '%' })));
    }

    /* Tabla del AFI con foco itinerante (flechas) y botones de dos estados. */
    function ipaTable(kind) {
      var rows = kind === 'c' ? DATA.MANNERS : DATA.HEIGHTS, cols = kind === 'c' ? DATA.PLACES : DATA.BACKS;
      var table = h('table', { class: 'igs-table igl-ipa' }, h('caption', { text: t(kind === 'c' ? 'consTable' : 'vowTable') }));
      var thead = h('thead'), hr = h('tr', null, h('th', { scope: 'col', text: t(kind === 'c' ? 'mannerCol' : 'heightCol') }));
      cols.forEach(function (c) { hr.appendChild(h('th', { scope: 'col', text: t((kind === 'c' ? 'p_' : 'b_') + c) })); });
      thead.appendChild(hr); table.appendChild(thead);
      var tbody = h('tbody');
      rows.forEach(function (r) {
        var tr = h('tr', null, h('th', { scope: 'row', text: t((kind === 'c' ? 'm_' : 'h_') + r) }));
        cols.forEach(function (c) {
          var list = (kind === 'c' ? DATA.CONS : DATA.VOWELS).filter(function (x) { return kind === 'c' ? (x[2] === r && x[1] === c) : (x[1] === r && x[2] === c); });
          var td = h('td');
          list.forEach(function (x) { td.appendChild(soundButton(x[0])); });
          if (!list.length) { td.appendChild(h('span', { class: 'igl-none', 'aria-hidden': 'true', text: '·' })); }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      roving(table);
      return tableWrap(table);
    }
    function soundButton(sym) {
      var on = sounds().indexOf(sym) >= 0;
      var b = h('button', { type: 'button', class: 'igl-sound', 'aria-pressed': String(on), 'aria-label': soundLabel(sym), lang: 'und', tabindex: '-1' }, h('span', { 'aria-hidden': 'true', text: sym }));
      b.addEventListener('click', function () { toggleSound(sym); });
      return b;
    }
    function roving(box) {
      var items = function () { return Array.prototype.slice.call(box.querySelectorAll('button')); };
      var first = items()[0]; if (first) first.tabIndex = 0;
      box.addEventListener('keydown', function (e) {
        var list = items(), i = list.indexOf(D.activeElement); if (i < 0) return;
        var n = i;
        if (e.key === 'ArrowRight') n = (i + 1) % list.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + list.length) % list.length;
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          var cell = list[i].closest('td'), row = cell && cell.closest('tr'), ix = row ? Array.prototype.indexOf.call(row.children, cell) : -1;
          var rows = Array.prototype.slice.call(box.querySelectorAll('tbody tr')), ri = rows.indexOf(row);
          if (ri < 0 || ix < 0) return;
          for (var step = 1; step <= rows.length; step++) {
            var rr = rows[(ri + (e.key === 'ArrowDown' ? step : rows.length - step)) % rows.length];
            var cc = rr.children[ix], bb = cc && cc.querySelector('button');
            if (bb) { n = list.indexOf(bb); break; }
          }
        } else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = list.length - 1;
        else return;
        e.preventDefault(); list.forEach(function (b) { b.tabIndex = -1; });
        list[n].tabIndex = 0; list[n].focus();
      });
      box.addEventListener('focusin', function (e) { if (e.target.tagName === 'BUTTON') items().forEach(function (b) { b.tabIndex = b === e.target ? 0 : -1; }); });
    }
    function toggleSound(sym) {
      var i = symInfo(sym), list = i && i.kind === 'v' ? S.vowels : S.cons, ix = list.indexOf(sym);
      if (ix >= 0) {
        var used = S.lex.some(function (w) { return w.ph.indexOf(sym) >= 0; });
        list.splice(ix, 1); delete S.glyphs[sym];
        commit(t('soundOff', { s: sym }) + (used ? ' ' + t('soundUsed') : ''));
      } else {
        list.push(sym);
        if (!S.glyphs[sym]) S.glyphs[sym] = PRESETS[(sounds().length - 1) % PRESETS.length].map(function (s) { return s.slice(); });
        sel = { kind: 'sound', sym: sym };
        commit(t('soundOn', { s: sym + ' (' + describe(sym) + ')' }));
      }
    }

    /* ---------- Secciones ---------- */
    function secSounds() {
      var out = [h('p', { class: 'igl-lede', text: t('soundsLede') })];
      out.push(h('div', { class: 'igl-inv' },
        h('h3', { text: t('yourSounds') }),
        S.cons.length + S.vowels.length ? h('ul', { class: 'igl-chips' }, sounds().map(function (s) {
          var b = h('button', { type: 'button', class: 'igl-chip', 'aria-label': t('chipSound', { s: soundLabel(s) }) },
            h('span', { class: 'igl-chip-sym', 'aria-hidden': 'true', text: s }), h('span', { class: 'igl-chip-rom', 'aria-hidden': 'true', text: romanOf(s) }));
          b.addEventListener('click', function () { sel = { kind: 'sound', sym: s }; renderSide(); ctx.announce(soundLabel(s)); });
          return h('li', null, b);
        })) : h('p', { class: 'igs-muted', text: t('noSounds') })));
      out.push(ipaTable('c'));
      var other = h('div', { class: 'igl-other' }, h('h3', { text: t('otherSounds') }), h('ul', { class: 'igl-chips' }, DATA.OTHER.map(function (x) { return h('li', null, soundButton(x[0])); })));
      roving(other); out.push(other);
      out.push(ipaTable('v'));
      out.push(h('p', { class: 'igs-muted', text: t('ipaSource') }));
      return out;
    }

    function secSyllables() {
      var out = [h('p', { class: 'igl-lede', text: t('syllLede') })];
      var ul = h('ul', { class: 'igl-patterns' });
      S.patterns.forEach(function (p, i) {
        var row = h('li', { class: 'igl-pattern' });
        var f = F.text(t('patternN', { n: i + 1 }), p.p, { max: 5, onChange: function (v) {
          v = String(v).toUpperCase().replace(/[^CV]/g, '').slice(0, 5);
          if (!validPattern(v)) { ctx.announce(t('patternBad')); renderView(); return; }
          p.p = v; commit(t('patternChanged', { p: v }));
        } });
        f.input.dataset.k = 'pat' + i;
        row.appendChild(f);
        row.appendChild(F.number(t('patternWeight'), p.w, { min: 0, max: 10, step: 1, onChange: function (v) { p.w = v; commit(t('patternChanged', { p: p.p })); } }));
        row.appendChild(ctx.button(t('removePattern'), { icon: 'trash', class: 'igs-danger', onClick: function () {
          if (S.patterns.length < 2) { ctx.announce(t('lastPattern')); return; }
          S.patterns.splice(i, 1); commit(t('patternRemoved'));
        } }));
        ul.appendChild(row);
      });
      out.push(h('h3', { text: t('patternsTitle') }), ul, h('p', { class: 'igs-muted', text: t('patternHelp') }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('addPattern'), { icon: 'plus', onClick: function () {
        if (S.patterns.length >= 8) { ctx.announce(t('maxPatterns')); return; }
        S.patterns.push({ p: 'CV', w: 1 }); commit(t('patternAdded'));
      } })));
      out.push(h('h3', { text: t('genTitle') }), h('p', { class: 'igs-muted', text: t('genHelp') }));
      var seedF = F.text(t('seed'), S.seed, { max: 24, onChange: function (v) { S.seed = String(v).slice(0, 24) || 'iris'; ctx.commit(t('seedChanged')); renderView(); } });
      seedF.input.dataset.k = 'seed';
      out.push(seedF);
      out.push(h('div', { class: 'igs-actions' },
        ctx.button(t('genBtn'), { icon: 'sparkle', class: 'igs-primary', onClick: function () { doGenerate(8); } }),
        ctx.button(t('genMore'), { icon: 'plus', onClick: function () { doGenerate(8, true); } })));
      if (gen.length) {
        var gl = h('ul', { class: 'igl-gen' });
        gen.forEach(function (ph, i) {
          var b = ctx.button(t('addToDict'), { icon: 'plus', onClick: function () { addWord(ph); gen.splice(i, 1); renderView(); } });
          gl.appendChild(h('li', null, h('span', { class: 'igl-gen-w', lang: 'und' }, romanWord(ph)), h('span', { class: 'igl-gen-ipa', 'aria-hidden': 'true', text: '/' + ph.join('') + '/' }), b));
        });
        out.push(h('h4', { text: t('genResults', { n: gen.length, seed: genSeed }) }), gl);
      } else out.push(h('p', { class: 'igs-muted', text: t('genEmpty') }));
      return out;
    }
    function doGenerate(n, more) {
      if (!S.cons.length || !S.vowels.length) { ctx.announce(t('needSounds')); ctx.setStatus(t('needSounds')); return; }
      genSeed = more ? S.seed + '+' + (gen.length + Math.random().toString(36).slice(2, 5)) : S.seed;
      var made = generate(n, genSeed);
      gen = more ? gen.concat(made) : made;
      renderView(); ctx.announce(t('genDone', { n: made.length }));
      var first = docEl.querySelector('.igl-gen button'); if (first) { try { first.focus({ preventScroll: true }); } catch (_) { first.focus(); } }
    }
    function addWord(ph, concept) {
      if (S.lex.length >= MAX_LEX) { ctx.announce(t('maxWords', { n: MAX_LEX })); return null; }
      var w = { id: nid(), ph: ph.slice(), es: '', en: '', cat: 'n', concept: concept || '' };
      if (concept) {
        var c = DATA.CONCEPTS.filter(function (x) { return x[0] === concept; })[0];
        if (c) { w.cat = c[1]; w.es = c[2]; w.en = c[3]; }
      }
      S.lex.push(w); sel = { kind: 'word', id: w.id };
      commit(t('wordAdded', { w: romanWord(ph) }));
      return w;
    }

    function secWriting() {
      var out = [h('p', { class: 'igl-lede', text: t('writeLede') })];
      out.push(progress(glyphCount(), GOAL_SIGNS, t('signsGoal')));
      var cur = sel && sel.kind === 'sound' ? sel.sym : sounds()[0];
      if (!sounds().length) { out.push(h('p', { class: 'igs-muted', text: t('noSounds') })); return out; }
      if (sounds().indexOf(cur) < 0) cur = sounds()[0];
      out.push(h('h3', { text: t('designFor', { s: cur + ' «' + romanOf(cur) + '»' }) }));
      out.push(designer(cur));
      out.push(h('h3', { text: t('alphabetTitle') }));
      var ul = h('ul', { class: 'igl-alphabet' });
      sounds().forEach(function (s) {
        var b = h('button', { type: 'button', class: 'igl-sign' + (s === cur ? ' igl-sign-cur' : ''), 'aria-current': String(s === cur), 'aria-label': t('signOf', { s: soundLabel(s), n: (glyph(s) || []).length }) },
          glyphSVG(s, 42), h('span', { class: 'igl-sign-rom', 'aria-hidden': 'true', text: romanOf(s) }));
        b.addEventListener('click', function () { sel = { kind: 'sound', sym: s }; renderView(); renderSide(); ctx.announce(t('designFor', { s: s })); });
        ul.appendChild(h('li', null, b));
      });
      out.push(ul);
      return out;
    }
    var pending = null;
    function designer(sym) {
      var box = h('div', { class: 'igl-designer' });
      var svg = D.createElementNS(SVGNS, 'svg');
      svg.setAttribute('viewBox', '0 0 ' + GLYPH_W + ' ' + GLYPH_H); svg.setAttribute('class', 'igl-canvas'); svg.setAttribute('aria-hidden', 'true');
      (glyph(sym) || []).forEach(function (s) {
        var ln = D.createElementNS(SVGNS, 'line');
        ln.setAttribute('x1', px(s[0])); ln.setAttribute('y1', py(s[0])); ln.setAttribute('x2', px(s[1])); ln.setAttribute('y2', py(s[1]));
        svg.appendChild(ln);
      });
      var grid = h('div', { class: 'igl-grid', role: 'group', 'aria-label': t('gridLabel') });
      for (var i = 0; i < GW * GH; i++) (function (i) {
        var b = h('button', { type: 'button', class: 'igl-point' + (pending === i ? ' igl-point-on' : ''), 'aria-pressed': String(pending === i),
          'aria-label': t('pointN', { c: (i % GW) + 1, r: Math.floor(i / GW) + 1 }), style: 'left:' + (px(i) / GLYPH_W * 100) + '%;top:' + (py(i) / GLYPH_H * 100) + '%' });
        b.addEventListener('click', function () { pickPoint(sym, i); });
        grid.appendChild(b);
      })(i);
      box.appendChild(h('div', { class: 'igl-canvas-wrap' }, svg, grid));
      box.appendChild(h('div', { class: 'igs-actions' },
        ctx.button(t('undoStroke'), { icon: 'undo', onClick: function () { var g = glyph(sym) || []; if (!g.length) { ctx.announce(t('noStrokes')); return; } g.pop(); pending = null; commit(t('strokeRemoved')); } }),
        ctx.button(t('clearGlyph'), { icon: 'erase', onClick: function () { S.glyphs[sym] = []; pending = null; commit(t('glyphCleared')); } }),
        ctx.button(t('presetGlyph'), { icon: 'sparkle', onClick: function () {
          var used = Object.keys(S.glyphs).length;
          S.glyphs[sym] = PRESETS[used % PRESETS.length].map(function (s) { return s.slice(); }); pending = null; commit(t('glyphPreset'));
        } })));
      box.appendChild(h('p', { class: 'igs-muted', text: t('designHelp') }));
      return box;
    }
    function pickPoint(sym, i) {
      if (pending === null) { pending = i; renderView(); ctx.announce(t('pointPicked', { c: (i % GW) + 1, r: Math.floor(i / GW) + 1 })); focusPoint(i); return; }
      if (pending === i) { pending = null; renderView(); ctx.announce(t('pointCancel')); focusPoint(i); return; }
      var g = S.glyphs[sym] = S.glyphs[sym] || [], a = pending, b = i;
      var ix = g.findIndex(function (s) { return (s[0] === a && s[1] === b) || (s[0] === b && s[1] === a); });
      if (ix >= 0) g.splice(ix, 1); else g.push([a, b]);
      pending = null;
      commit(ix >= 0 ? t('strokeRemoved') : t('strokeAdded'));
      focusPoint(i);
    }
    function focusPoint(i) { var b = docEl.querySelectorAll('.igl-point')[i]; if (b) { try { b.focus({ preventScroll: true }); } catch (_) { b.focus(); } } }

    function secGrammar() {
      var out = [h('p', { class: 'igl-lede', text: t('gramLede') })];
      var g = S.grammar;
      var o = F.select(t('wordOrder'), g.order, ['SVO', 'SOV', 'VSO', 'VOS', 'OSV', 'OVS'].map(function (x) { return [x, t('order_' + x)]; }), { onChange: function (v) { g.order = v; commit(t('orderChanged', { o: t('order_' + v) })); } });
      o.input.dataset.k = 'order'; out.push(o);
      var adjF = F.choice(t('adjPos'), g.adj, [['before', t('adjBefore')], ['after', t('adjAfter')]], { onChange: function (v) { g.adj = v; commit(t('adjChanged')); } });
      adjF.querySelectorAll('input').forEach(function (i, ix) { i.dataset.k = 'adj' + ix; }); out.push(adjF);
      out.push(h('h3', { text: t('affixTitle') }), h('p', { class: 'igs-muted', text: t('affixHelp') }));
      [['plural', 'PL'], ['past', 'PST'], ['present', 'PRS'], ['future', 'FUT']].forEach(function (k) {
        var a = g[k[0]], row = h('div', { class: 'igl-affix' });
        row.appendChild(h('h4', { text: t('affix_' + k[0]) + ' (' + k[1] + ')' }));
        var f = F.text(t('affixForm'), a.form, { max: 12, onChange: function (v) {
          var p = parseRoman(v);
          a.form = p.ph.length ? romanWord(p.ph) : '';
          commit(t('affixChanged', { a: t('affix_' + k[0]), f: a.form || '∅' }) + (p.bad.length ? ' ' + t('affixBad', { l: p.bad.join(' ') }) : ''));
        } });
        f.input.dataset.k = 'aff' + k[0]; row.appendChild(f);
        row.appendChild(F.choice(t('affixType'), a.type, [['prefix', t('prefix')], ['suffix', t('suffix')]], { onChange: function (v) { a.type = v; commit(t('affixChanged', { a: t('affix_' + k[0]), f: a.form || '∅' })); } }));
        var demo = S.lex[0];
        if (demo) row.appendChild(h('p', { class: 'igl-demo', lang: 'und' }, h('span', { class: 'igs-sr', text: t('example') + ': ' }),
          romanWord(demo.ph) + (a.form ? (a.type === 'prefix' ? ' → ' + a.form + '-' + romanWord(demo.ph) : ' → ' + romanWord(demo.ph) + '-' + a.form) : ' → ' + romanWord(demo.ph) + ' (∅)')));
        out.push(row);
      });
      return out;
    }

    function secDict() {
      var out = [h('p', { class: 'igl-lede', text: t('dictLede') })];
      out.push(progress(S.lex.length, GOAL_WORDS, t('wordsGoal')));
      var sf = F.text(t('searchLabel'), search, { max: 40 });
      sf.input.type = 'search'; sf.input.dataset.k = 'search';
      sf.input.addEventListener('input', function () { search = sf.input.value; renderList(); });
      out.push(sf);
      out.push(h('div', { class: 'igs-actions' },
        ctx.button(t('addWordBtn'), { icon: 'plus', class: 'igs-primary', onClick: function () {
          if (!S.cons.length || !S.vowels.length) { ctx.announce(t('needSounds')); return; }
          var made = generate(1, S.seed + '·' + S.lex.length);
          var w = addWord(made[0] || [S.cons[0], S.vowels[0]]);
          if (w) { FOCUS_KEY = 'wes'; renderSide(); }
        } }),
        ctx.button(t('fillConcept'), { icon: 'sparkle', onClick: fillNextConcept })));
      var listBox = h('div', { class: 'igl-list-box' });
      out.push(listBox);
      function renderList() {
        ctx.clear(listBox);
        var q = String(search).toLowerCase().trim();
        var rows = S.lex.filter(function (w) {
          if (!q) return true;
          return (romanWord(w.ph) + ' ' + w.ph.join('') + ' ' + w.es + ' ' + w.en).toLowerCase().indexOf(q) >= 0;
        });
        if (!S.lex.length) { listBox.appendChild(h('p', { class: 'igs-muted', text: t('dictEmpty') })); }
        else if (!rows.length) { listBox.appendChild(h('p', { class: 'igs-muted', text: t('noMatches', { q: search }) })); }
        else {
          var table = h('table', { class: 'igs-table igl-dict' }, h('caption', { text: t('dictCaption', { n: rows.length, total: S.lex.length }) }),
            h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('colWord') }), h('th', { scope: 'col', text: t('colIpa') }),
              h('th', { scope: 'col', text: t('colEs') }), h('th', { scope: 'col', text: t('colEn') }), h('th', { scope: 'col', text: t('colCat') }))));
          var tb = h('tbody');
          rows.slice(0, 300).forEach(function (w) {
            var b = h('button', { type: 'button', class: 'igl-word-btn', 'aria-current': String(!!sel && sel.kind === 'word' && sel.id === w.id) }, h('span', { lang: 'und', text: romanWord(w.ph) || '—' }));
            b.addEventListener('click', function () { sel = { kind: 'word', id: w.id }; renderList(); renderSide(); ctx.announce(t('wordSelected', { w: romanWord(w.ph), m: meaning(w) })); });
            tb.appendChild(h('tr', { 'data-sel': String(!!sel && sel.kind === 'word' && sel.id === w.id) }, h('td', null, b), h('td', { lang: 'und', text: '/' + w.ph.join('') + '/' }),
              h('td', { text: w.es || '—' }), h('td', { text: w.en || '—' }), h('td', { text: t('cat_' + w.cat) })));
          });
          table.appendChild(tb);
          listBox.appendChild(tableWrap(table));
          if (rows.length > 300) listBox.appendChild(h('p', { class: 'igs-muted', text: t('tooManyRows') }));
        }
      }
      renderList();
      out.push(h('h3', { text: t('conceptsTitle') }), h('p', { class: 'igs-muted', text: t('conceptsHelp') }));
      var pend = pendingConcepts();
      var cl = h('ul', { class: 'igl-concepts' });
      pend.slice(0, 24).forEach(function (c) {
        var b = h('button', { type: 'button', class: 'igl-concept', 'aria-label': t('makeWordFor', { m: LANG === 'en' ? c[3] : c[2] }) },
          h('span', { text: LANG === 'en' ? c[3] : c[2] }), h('small', { text: t('cat_' + c[1]) }));
        b.addEventListener('click', function () { makeForConcept(c); });
        cl.appendChild(h('li', null, b));
      });
      out.push(pend.length ? cl : h('p', { class: 'igs-muted', text: t('conceptsDone') }));
      return out;
    }
    function pendingConcepts() {
      var have = {}; S.lex.forEach(function (w) { if (w.concept) have[w.concept] = 1; });
      return DATA.CONCEPTS.filter(function (c) { return !have[c[0]]; });
    }
    function makeForConcept(c) {
      if (!S.cons.length || !S.vowels.length) { ctx.announce(t('needSounds')); return; }
      var made = generate(1, S.seed + '·' + c[0]);
      if (!made.length) { ctx.announce(t('genNone')); return; }
      addWord(made[0], c[0]);
    }
    function fillNextConcept() { var p = pendingConcepts(); if (!p.length) { ctx.announce(t('conceptsDone')); return; } makeForConcept(p[0]); }

    function secText() {
      var out = [h('p', { class: 'igl-lede', text: t('textLede') })];
      if (!S.texts.length) S.texts.push({ free: '', words: [] });
      curText = Math.max(0, Math.min(S.texts.length - 1, curText));
      var tx = S.texts[curText];
      out.push(h('div', { class: 'igs-actions' },
        ctx.button(t('addSentence'), { icon: 'plus', class: 'igs-primary', onClick: function () {
          if (S.texts.length >= MAX_TEXTS) { ctx.announce(t('maxSentences')); return; }
          S.texts.push({ free: '', words: [] }); curText = S.texts.length - 1; commit(t('sentenceAdded'));
        } }),
        ctx.button(t('delSentence'), { icon: 'trash', class: 'igs-danger', onClick: function () {
          if (S.texts.length < 2) { ctx.announce(t('lastSentence')); return; }
          S.texts.splice(curText, 1); curText = Math.max(0, curText - 1); commit(t('sentenceDeleted'));
        } })));
      var free = F.text(t('freeLabel'), tx.free, { max: 200, onChange: function (v) { tx.free = String(v).slice(0, 200); commit(t('freeChanged')); } });
      free.input.dataset.k = 'free'; out.push(free);
      out.push(h('h3', { text: t('wordsOfSentence') }));
      if (!S.lex.length) out.push(h('p', { class: 'igs-muted', text: t('needWords') }));
      var ul = h('ul', { class: 'igl-slots' });
      (tx.words || []).forEach(function (sl, i) {
        var li = h('li', { class: 'igl-slot' });
        var opts = S.lex.map(function (w) { return [w.id, (romanWord(w.ph) || '—') + ' · ' + meaning(w)]; });
        var wsel = F.select(t('slotWord', { n: i + 1 }), sl.ref, opts, { onChange: function (v) { sl.ref = v; commit(t('slotChanged')); } });
        wsel.input.dataset.k = 'slot' + i; li.appendChild(wsel);
        li.appendChild(F.select(t('slotRole'), sl.role, [['S', t('role_S')], ['V', t('role_V')], ['O', t('role_O')], ['ADJ', t('role_ADJ')], ['X', t('role_X')]], { onChange: function (v) { sl.role = v; commit(t('slotChanged')); } }));
        li.appendChild(F.check(t('slotPlural'), !!sl.pl, { onChange: function (v) { sl.pl = v; commit(t('slotChanged')); } }));
        li.appendChild(F.select(t('slotTense'), sl.tense || 'none', [['none', t('tense_none')], ['past', t('tense_past')], ['present', t('tense_present')], ['future', t('tense_future')]], { onChange: function (v) { sl.tense = v; commit(t('slotChanged')); } }));
        li.appendChild(h('div', { class: 'igs-actions' },
          ctx.button(t('slotUp'), { icon: 'undo', onClick: function () { if (!i) { ctx.announce(t('firstSlot')); return; } var a = tx.words.splice(i, 1)[0]; tx.words.splice(i - 1, 0, a); commit(t('slotMoved')); } }),
          ctx.button(t('slotDown'), { icon: 'redo', onClick: function () { if (i >= tx.words.length - 1) { ctx.announce(t('lastSlot')); return; } var a = tx.words.splice(i, 1)[0]; tx.words.splice(i + 1, 0, a); commit(t('slotMoved')); } }),
          ctx.button(t('slotRemove'), { icon: 'trash', class: 'igs-danger', onClick: function () { tx.words.splice(i, 1); commit(t('slotRemoved')); } })));
        ul.appendChild(li);
      });
      if (tx.words && tx.words.length) out.push(ul);
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('addSlot'), { icon: 'plus', onClick: function () {
        if (!S.lex.length) { ctx.announce(t('needWords')); return; }
        if (tx.words.length >= 20) { ctx.announce(t('maxSlots')); return; }
        var roles = ['S', 'V', 'O'], used = tx.words.map(function (x) { return x.role; });
        var role = roles.filter(function (r) { return used.indexOf(r) < 0; })[0] || 'X';
        tx.words.push({ ref: S.lex[0].id, role: role, pl: false, tense: 'none' });
        FOCUS_KEY = 'slot' + (tx.words.length - 1);
        commit(t('slotAdded'));
      } })));
      out.push(h('h3', { text: t('glossTitle') }));
      out.push(glossBlock(tx));
      out.push(h('p', { class: 'igs-muted', text: t('glossNote') }));
      out.push(h('h3', { text: t('inYourAlphabet') }));
      out.push(alphabetLine(tx));
      return out;
    }
    function glossBlock(tx) {
      var built = buildSentence(tx);
      if (!built.length) return h('p', { class: 'igs-muted', text: t('glossEmpty') });
      var box = h('div', { class: 'igl-gloss', role: 'group', 'aria-label': t('glossTitle') });
      var row = h('ol', { class: 'igl-gloss-row' });
      built.forEach(function (w) {
        row.appendChild(h('li', null,
          h('span', { class: 'igl-form', lang: 'und', text: w.parts.map(function (p) { return p.text; }).join('-') }),
          h('span', { class: 'igl-gl' }, w.parts.map(function (p, i) { return [i ? h('span', { 'aria-hidden': 'true', text: '-' }) : null, p.gram ? h('abbr', { class: 'igl-abbr', title: t('abbr_' + p.gloss), text: p.gloss }) : h('span', { text: p.gloss })]; }))));
      });
      box.appendChild(row);
      box.appendChild(h('p', { class: 'igl-free' }, '‘', String(tx.free || t('noFree')), '’'));
      return box;
    }
    function alphabetLine(tx) {
      var built = buildSentence(tx);
      if (!built.length) return h('p', { class: 'igs-muted', text: t('glossEmpty') });
      var wrap = h('div', { class: 'igl-script', role: 'img', 'aria-label': t('scriptAlt', { s: built.map(function (w) { return romanWord(w.ph); }).join(' ') }) });
      built.forEach(function (w) {
        var word = h('span', { class: 'igl-script-w' });
        w.ph.forEach(function (p) { word.appendChild(glyphSVG(p, 30, 'igl-glyph igl-glyph-run')); });
        wrap.appendChild(word);
      });
      return wrap;
    }

    function secChanges() {
      var out = [h('p', { class: 'igl-lede', text: t('changeLede') })];
      var opts = [['', t('anySound')]].concat(sounds().map(function (s) { return [s, s + ' «' + romanOf(s) + '»']; }));
      var envOpts = [['', t('anySound')], ['#', t('wordEdge')]].concat(sounds().map(function (s) { return [s, s + ' «' + romanOf(s) + '»']; }));
      S.changes.forEach(function (r, i) {
        var box = h('div', { class: 'igl-rule', 'data-on': String(!!r.on) });
        box.appendChild(h('h3', { lang: 'und' }, t('ruleN', { n: i + 1 }) + ': ', h('span', { class: 'igl-rule-text', text: ruleText(r) })));
        var f1 = F.select(t('ruleFrom'), r.from || '', opts.slice(1), { onChange: function (v) { r.from = v; commit(t('ruleChanged')); } });
        f1.input.dataset.k = 'rf' + i; box.appendChild(f1);
        box.appendChild(F.select(t('ruleTo'), r.to || '', [['', t('deleteSound')]].concat(opts.slice(1)), { onChange: function (v) { r.to = v; commit(t('ruleChanged')); } }));
        box.appendChild(F.select(t('ruleLeft'), r.left || '', envOpts, { onChange: function (v) { r.left = v; commit(t('ruleChanged')); } }));
        box.appendChild(F.select(t('ruleRight'), r.right || '', envOpts, { onChange: function (v) { r.right = v; commit(t('ruleChanged')); } }));
        box.appendChild(F.check(t('ruleOn'), !!r.on, { onChange: function (v) { r.on = v; commit(t(v ? 'ruleEnabled' : 'ruleDisabled')); } }));
        box.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('ruleRemove'), { icon: 'trash', class: 'igs-danger', onClick: function () { S.changes.splice(i, 1); commit(t('ruleRemoved')); } })));
        out.push(box);
      });
      if (!S.changes.length) out.push(h('p', { class: 'igs-muted', text: t('noRules') }));
      out.push(h('div', { class: 'igs-actions' },
        ctx.button(t('addRule'), { icon: 'plus', onClick: function () {
          if (S.changes.length >= 12) { ctx.announce(t('maxRules')); return; }
          S.changes.push({ from: S.vowels[0] || S.cons[0] || '', to: S.vowels[1] || S.cons[1] || '', left: '', right: '', on: true });
          commit(t('ruleAdded'));
        } }),
        ctx.button(t('applyChanges'), { icon: 'check', class: 'igs-primary', onClick: applyToLex })));
      out.push(h('h3', { text: t('previewTitle') }));
      var changed = S.lex.map(function (w) { var a = afterChanges(w.ph); return { w: w, a: a }; }).filter(function (x) { return x.a.changed; });
      if (!S.changes.filter(function (r) { return r.on && r.from; }).length) out.push(h('p', { class: 'igs-muted', text: t('previewNoRules') }));
      else if (!changed.length) out.push(h('p', { class: 'igs-muted', text: t('previewNone') }));
      else {
        var table = h('table', { class: 'igs-table' }, h('caption', { text: t('previewCaption', { n: changed.length }) }),
          h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('colBefore') }), h('th', { scope: 'col', text: t('colAfter') }), h('th', { scope: 'col', text: t('colMeaning') }))));
        var tb = h('tbody');
        changed.slice(0, 60).forEach(function (x) {
          tb.appendChild(h('tr', null, h('td', { lang: 'und', text: romanWord(x.w.ph) }), h('td', { lang: 'und', text: romanWord(x.a.ph) }), h('td', { text: meaning(x.w) })));
        });
        table.appendChild(tb); out.push(tableWrap(table));
      }
      return out;
    }
    function applyToLex() {
      var active = S.changes.filter(function (r) { return r.on && r.from; });
      if (!active.length) { ctx.announce(t('previewNoRules')); return; }
      var n = 0;
      S.lex.forEach(function (w) { var a = afterChanges(w.ph); if (a.changed) { w.ph = a.ph; n++; } });
      S.changes.forEach(function (r) { r.on = false; });
      commit(t('changesApplied', { n: n }));
    }

    /* ---------- Estructura ---------- */
    function plural(key, n) { return n === 1 ? t(key + '1') : t(key, { n: n }); }
    function sectionMeta(id) {
      if (id === 'sounds') return plural('nSounds', sounds().length);
      if (id === 'syllables') return plural('nPatterns', S.patterns.length);
      if (id === 'writing') return t('nSigns', { n: glyphCount(), goal: GOAL_SIGNS });
      if (id === 'grammar') return t('order_' + S.grammar.order);
      if (id === 'dict') return t('nWords', { n: S.lex.length, goal: GOAL_WORDS });
      if (id === 'text') return plural('nSentences', S.texts.length);
      return plural('nRules', S.changes.length);
    }
    function renderStructure() {
      var ul = h('ul', { class: 'igs-list' });
      SECTIONS.forEach(function (id, i) {
        var b = h('button', { type: 'button', 'aria-current': String(id === section) },
          h('span', { class: 'igl-sec-n', 'aria-hidden': 'true', text: String(i + 1) }), h('span', { text: t('sec_' + id) }), h('small', { text: sectionMeta(id) }));
        b.addEventListener('click', function () { goSection(id); });
        ul.appendChild(h('li', null, b));
      });
      ctx.setStructure([h('h3', { text: t('partsTitle') }), ul, h('p', { class: 'igs-muted', text: t('partsHelp') })]);
    }
    function goSection(id) {
      section = id;
      if (id !== 'writing' && id !== 'sounds' && sel && sel.kind === 'sound') sel = null;
      renderView(); renderStructure(); renderSide();
      ctx.announce(t('sectionNow', { s: t('sec_' + id), meta: sectionMeta(id) }));
      var hd = docEl.querySelector('h2'); if (hd) { hd.setAttribute('tabindex', '-1'); try { hd.focus({ preventScroll: true }); } catch (_) { hd.focus(); } }
      vp.scrollTop = 0;
    }

    /* ---------- Propiedades ---------- */
    function challenges() {
      var done = [glyphCount() >= GOAL_SIGNS, S.lex.length >= GOAL_WORDS, S.texts.some(sentenceDone)];
      var items = [
        { ok: done[0], text: t('chSigns', { n: glyphCount(), goal: GOAL_SIGNS }) },
        { ok: done[1], text: t('chWords', { n: S.lex.length, goal: GOAL_WORDS }) },
        { ok: done[2], text: plural('chText', S.texts.filter(sentenceDone).length) }
      ];
      var ul = h('ul', { class: 'iga-review' });
      items.forEach(function (x) {
        ul.appendChild(h('li', { 'data-ok': String(x.ok) }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: x.ok ? '✓' : '·' }),
          h('span', { class: 'igs-sr', text: (x.ok ? t('doneWord') : t('pendingWord')) + ': ' }), x.text));
      });
      return [h('h4', { text: t('challengesTitle') }), ul];
    }
    function checks() {
      var out = [h('h4', { text: t('checksTitle') })], items = [];
      if (!S.cons.length) items.push({ ok: false, text: t('ckNoCons') });
      if (!S.vowels.length) items.push({ ok: false, text: t('ckNoVowels') });
      if (S.cons.length && S.vowels.length) items.push({ ok: true, text: t('ckInventory', { c: S.cons.length, v: S.vowels.length }) });
      var noGlyph = sounds().filter(function (s) { return !(glyph(s) || []).length; });
      items.push({ ok: !noGlyph.length, text: noGlyph.length ? t('ckNoGlyph', { n: noGlyph.length, l: noGlyph.slice(0, 6).join(' ') }) : t('ckGlyphs') });
      var dupes = {}, dupN = 0;
      S.lex.forEach(function (w) { var r = romanWord(w.ph); if (dupes[r]) dupN++; dupes[r] = 1; });
      if (dupN) items.push({ ok: false, text: t('ckDupes', { n: dupN }) });
      var noMeaning = S.lex.filter(function (w) { return !String(w.es).trim() && !String(w.en).trim(); }).length;
      if (noMeaning) items.push({ ok: false, text: t('ckNoMeaning', { n: noMeaning }) });
      var badPat = S.patterns.filter(function (p) { return !validPattern(p.p); }).length;
      if (badPat) items.push({ ok: false, text: t('ckBadPattern') });
      if (!items.filter(function (x) { return !x.ok; }).length) items.push({ ok: true, text: t('ckAllGood') });
      var ul = h('ul', { class: 'iga-review' });
      items.forEach(function (x) {
        ul.appendChild(h('li', { 'data-ok': String(x.ok) }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: x.ok ? '✓' : '!' }),
          h('span', { class: 'igs-sr', text: (x.ok ? t('okWord') : t('checkWord')) + ': ' }), x.text));
      });
      out.push(ul);
      return out;
    }
    function soundProps(sym) {
      var out = [h('h4', { text: t('soundTitle', { s: sym }) })];
      out.push(h('p', { class: 'igl-sound-big', lang: 'und', 'aria-hidden': 'true', text: sym }));
      out.push(h('p', { text: describe(sym) + '.' }), h('p', { class: 'igs-muted', text: howTo(sym) }));
      var ex = example(sym); if (ex) out.push(h('p', { class: 'igs-muted', text: ex }));
      var rf = F.text(t('romanLabel'), romanOf(sym), { max: 4, onChange: function (v) {
        v = String(v).replace(/\s/g, '').slice(0, 4);
        if (!v) delete S.roman[sym]; else S.roman[sym] = v;
        commit(t('romanChanged', { s: sym, r: romanOf(sym) }));
      } });
      rf.input.dataset.k = 'roman'; out.push(rf);
      out.push(h('p', { class: 'igs-muted', text: t('romanHelp') }));
      out.push(h('div', { class: 'igl-sign-prev' }, glyphSVG(sym, 56), h('span', { text: t('strokesN', { n: (glyph(sym) || []).length }) })));
      out.push(h('div', { class: 'igs-actions' },
        ctx.button(t('designBtn'), { icon: 'pen', onClick: function () { sel = { kind: 'sound', sym: sym }; goSection('writing'); } }),
        ctx.button(sounds().indexOf(sym) >= 0 ? t('removeSound') : t('addSound'), { icon: sounds().indexOf(sym) >= 0 ? 'trash' : 'plus', class: sounds().indexOf(sym) >= 0 ? 'igs-danger' : '', onClick: function () { toggleSound(sym); } })));
      return out;
    }
    function wordProps(id) {
      var w = byId(id); if (!w) { sel = null; return null; }
      var out = [h('h4', { text: t('wordTitle') })];
      var wf = F.text(t('wordForm'), romanWord(w.ph), { max: 40, onChange: function (v) {
        var p = parseRoman(v);
        if (!p.ph.length) { ctx.announce(t('wordEmpty')); renderSide(); return; }
        w.ph = p.ph;
        commit(t('wordChanged', { w: romanWord(w.ph) }) + (p.bad.length ? ' ' + t('affixBad', { l: p.bad.join(' ') }) : ''));
      } });
      wf.input.dataset.k = 'wform'; wf.input.setAttribute('lang', 'und'); out.push(wf);
      out.push(h('p', { class: 'igs-muted', lang: 'und', text: '/' + w.ph.join('') + '/' }));
      var e1 = F.text(t('colEs'), w.es, { max: 60, onChange: function (v) { w.es = String(v).slice(0, 60); commit(t('meaningChanged')); } });
      e1.input.dataset.k = 'wes'; out.push(e1);
      out.push(F.text(t('colEn'), w.en, { max: 60, onChange: function (v) { w.en = String(v).slice(0, 60); commit(t('meaningChanged')); } }));
      out.push(F.select(t('colCat'), w.cat, ['n', 'v', 'adj', 'pron', 'num', 'part'].map(function (c) { return [c, t('cat_' + c)]; }), { onChange: function (v) { w.cat = v; commit(t('catChanged')); } }));
      var a = afterChanges(w.ph);
      if (a.changed) out.push(h('p', { class: 'igs-result', 'data-kind': 'ok' }, h('strong', { text: t('withChanges') }), h('span', { lang: 'und', text: romanWord(a.ph) })));
      out.push(h('div', { class: 'igl-sign-prev' }, w.ph.map(function (p) { return glyphSVG(p, 34); })));
      out.push(h('div', { class: 'igs-actions' },
        ctx.button(t('useInSentence'), { icon: 'note', onClick: function () {
          if (!S.texts.length) S.texts.push({ free: '', words: [] });
          S.texts[curText].words.push({ ref: w.id, role: S.texts[curText].words.length ? 'O' : 'S', pl: false, tense: 'none' });
          goSection('text'); commit(t('slotAdded'));
        } }),
        ctx.button(t('deleteWord'), { icon: 'trash', class: 'igs-danger', onClick: function () {
          S.lex = S.lex.filter(function (x) { return x.id !== w.id; });
          S.texts.forEach(function (tx) { tx.words = tx.words.filter(function (s) { return s.ref !== w.id; }); });
          sel = null; commit(t('wordDeleted', { w: romanWord(w.ph) }));
        } })));
      return out;
    }
    function langProps() {
      var out = [h('h4', { text: t('langTitle') })];
      var nf = F.text(t('langName'), S.name, { max: 60, onChange: function (v) { S.name = String(v).trim().slice(0, 60) || t('newLangName'); commit(t('nameChanged', { n: S.name })); } });
      nf.input.dataset.k = 'name'; out.push(nf);
      out.push(h('dl', { class: 'igs-vars' },
        h('dt', { text: t('nSoundsLabel') }), h('dd', { text: String(sounds().length) }),
        h('dt', { text: t('nWordsLabel') }), h('dd', { text: String(S.lex.length) }),
        h('dt', { text: t('nSignsLabel') }), h('dd', { text: String(glyphCount()) }),
        h('dt', { text: t('nSentencesLabel') }), h('dd', { text: String(S.texts.length) })));
      return out;
    }
    function renderSide() {
      var active = D.activeElement, k = active && ctx.inspector.contains(active) ? active.dataset.k : null;
      var out = [];
      if (sel && sel.kind === 'sound') out = out.concat(soundProps(sel.sym));
      else if (sel && sel.kind === 'word') { var wp = wordProps(sel.id); if (wp) out = out.concat(wp); }
      if (!out.length) out = out.concat(langProps());
      out = out.concat(challenges(), checks());
      ctx.setInspector(out);
      var want = k || FOCUS_KEY; FOCUS_KEY = null;
      if (want) { var el = ctx.inspector.querySelector('[data-k="' + want + '"]'); if (el) { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } } }
    }
    function renderView() {
      /* El documento se vuelve a dibujar entero: se devuelve el foco al mismo control. */
      var active = D.activeElement, k = active && docEl.contains(active) ? active.dataset.k : null;
      ctx.clear(docEl);
      var body = { sounds: secSounds, syllables: secSyllables, writing: secWriting, grammar: secGrammar, dict: secDict, text: secText, changes: secChanges }[section]();
      docEl.appendChild(h('h2', { class: 'igl-h2' }, t('sec_' + section), h('span', { class: 'igl-h2-meta', text: sectionMeta(section) })));
      body.forEach(function (n) { docEl.appendChild(n); });
      if (k) { var el = docEl.querySelector('[data-k="' + k + '"]'); if (el) { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } } }
    }
    function render() { renderStructure(); renderView(); renderSide(); ctx.setSummary(summary()); }
    function commit(label) {
      render(); ctx.commit(label);
      if (label) { ctx.announce(label); ctx.setStatus(label); }
    }
    function summary() {
      var parts = [t('sumHead', { name: S.name, sec: t('sec_' + section) }),
        t('sumSounds', { c: S.cons.length, v: S.vowels.length, list: sounds().slice(0, 12).join(' ') }),
        t('sumSigns', { n: glyphCount(), goal: GOAL_SIGNS }),
        t('sumWords', { n: S.lex.length, goal: GOAL_WORDS }),
        t('sumGrammar', { o: t('order_' + S.grammar.order), a: t(S.grammar.adj === 'before' ? 'adjBefore' : 'adjAfter') })];
      var tx = S.texts[curText];
      if (tx) { var b = buildSentence(tx); if (b.length) parts.push(t('sumText', { s: b.map(function (w) { return w.parts.map(function (p) { return p.text; }).join('-'); }).join(' '), free: tx.free || t('noFree') })); }
      return parts.join(' ');
    }

    /* ---------- Exportaciones ---------- */
    function fbase() { return (LANG === 'en' ? 'language' : 'lengua') + '-' + slug(S.name) + '-' + ctx.stamp(); }
    function slug(s) {
      return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'lengua';
    }
    function csvCell(v) { var s = String(v == null ? '' : v); return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
    function exportCsv() {
      var rows = [[t('colWord'), t('colIpa'), t('colEs'), t('colEn'), t('colCat'), t('colConcept')]];
      S.lex.forEach(function (w) { rows.push([romanWord(w.ph), w.ph.join(''), w.es, w.en, t('cat_' + w.cat), w.concept]); });
      rows.push([]); rows.push([CREDIT]);
      var csv = '﻿' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n') + '\r\n';
      ctx.download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), fbase() + '-' + (LANG === 'en' ? 'dictionary' : 'diccionario') + '.csv');
    }
    function svgEl(w, hgt, title, desc) {
      var svg = D.createElementNS(SVGNS, 'svg');
      svg.setAttribute('xmlns', SVGNS); svg.setAttribute('viewBox', '0 0 ' + w + ' ' + hgt);
      svg.setAttribute('width', w); svg.setAttribute('height', hgt); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', title);
      var ti = D.createElementNS(SVGNS, 'title'); ti.textContent = title; svg.appendChild(ti);
      var de = D.createElementNS(SVGNS, 'desc'); de.textContent = desc || title; svg.appendChild(de);
      var bg = D.createElementNS(SVGNS, 'rect'); bg.setAttribute('width', w); bg.setAttribute('height', hgt); bg.setAttribute('fill', '#ffffff'); svg.appendChild(bg);
      return svg;
    }
    function svgLine(svg, a, b, dx, dy, sc) {
      var ln = D.createElementNS(SVGNS, 'line');
      ln.setAttribute('x1', dx + px(a) * sc); ln.setAttribute('y1', dy + py(a) * sc);
      ln.setAttribute('x2', dx + px(b) * sc); ln.setAttribute('y2', dy + py(b) * sc);
      ln.setAttribute('stroke', '#101820'); ln.setAttribute('stroke-width', 5 * sc); ln.setAttribute('stroke-linecap', 'round');
      svg.appendChild(ln);
    }
    function svgTextNode(svg, x, y, text, size, anchor, fill) {
      var n = D.createElementNS(SVGNS, 'text');
      n.setAttribute('x', x); n.setAttribute('y', y); n.setAttribute('font-size', size); n.setAttribute('text-anchor', anchor || 'middle');
      n.setAttribute('font-family', 'Atkinson Hyperlegible, Verdana, Arial, sans-serif'); n.setAttribute('fill', fill || '#172b42');
      n.textContent = text; svg.appendChild(n); return n;
    }
    function creditInto(svg, w, hgt) { svgTextNode(svg, w - 14, hgt - 12, CREDIT, 13, 'end', '#44586c'); }
    function alphabetSVG(withCredit) {
      var list = sounds().filter(function (s) { return (glyph(s) || []).length; });
      if (!list.length) return null;
      var cols = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(list.length)))), rows = Math.ceil(list.length / cols);
      var sc = 1.2, cellW = 108, cellH = Math.round(GLYPH_H * sc) + 58, padX = 30, top = 76, bottom = 46;
      var w = padX * 2 + cols * cellW, hgt = top + rows * cellH + bottom;
      var svg = svgEl(w, hgt, t('alphaTitle', { name: S.name }), t('alphaDesc', { n: list.length, list: list.map(function (s) { return romanOf(s) + ' (' + s + ')'; }).join(', ') }));
      svgTextNode(svg, w / 2, 42, t('alphaTitle', { name: S.name }), 26, 'middle', '#17395c');
      list.forEach(function (s, i) {
        var cx = padX + (i % cols) * cellW, cy = top + Math.floor(i / cols) * cellH;
        var dx = cx + (cellW - GLYPH_W * sc) / 2, dy = cy + 6;
        (glyph(s) || []).forEach(function (seg) { svgLine(svg, seg[0], seg[1], dx, dy, sc); });
        svgTextNode(svg, cx + cellW / 2, cy + GLYPH_H * sc + 28, romanOf(s), 18, 'middle', '#172b42');
        svgTextNode(svg, cx + cellW / 2, cy + GLYPH_H * sc + 48, '/' + s + '/', 14, 'middle', '#44586c');
      });
      if (withCredit) creditInto(svg, w, hgt);
      return { svg: svg, w: w, h: hgt };
    }
    function textSVG(withCredit) {
      var tx = S.texts[curText], built = tx ? buildSentence(tx) : [];
      if (!built.length) return null;
      var sc = 1.4, gw = GLYPH_W * sc, gh = GLYPH_H * sc, gap = 10 * sc, wordGap = 34;
      var padX = 30, top = 70, lineH = gh + 58, maxW = 980;
      var lines = [], cur = [], curW = 0;
      built.forEach(function (w) {
        var ww = w.ph.length * (gw + gap);
        if (curW + ww > maxW - padX * 2 && cur.length) { lines.push(cur); cur = []; curW = 0; }
        cur.push(w); curW += ww + wordGap;
      });
      if (cur.length) lines.push(cur);
      var w2 = Math.min(maxW, Math.max(420, padX * 2 + Math.max.apply(null, lines.map(function (l) { return l.reduce(function (a, x) { return a + x.ph.length * (gw + gap) + wordGap; }, 0); }))));
      var hgt = top + lines.length * lineH + 70;
      var roman = built.map(function (x) { return x.parts.map(function (p) { return p.text; }).join('-'); }).join(' ');
      var svg = svgEl(w2, hgt, t('textSvgTitle', { name: S.name }), t('textSvgDesc', { s: roman, free: tx.free || t('noFree') }));
      svgTextNode(svg, w2 / 2, 40, t('textSvgTitle', { name: S.name }), 22, 'middle', '#17395c');
      lines.forEach(function (line, li) {
        var x = padX, y = top + li * lineH;
        line.forEach(function (word) {
          var startX = x;
          word.ph.forEach(function (p) {
            (glyph(p) || []).forEach(function (seg) { svgLine(svg, seg[0], seg[1], x, y, sc); });
            if (!(glyph(p) || []).length) {
              var r = D.createElementNS(SVGNS, 'rect');
              r.setAttribute('x', x + 6); r.setAttribute('y', y + 6); r.setAttribute('width', gw - 12); r.setAttribute('height', gh - 12);
              r.setAttribute('fill', 'none'); r.setAttribute('stroke', '#a8b6c4'); r.setAttribute('stroke-dasharray', '4 3'); svg.appendChild(r);
            }
            x += gw + gap;
          });
          svgTextNode(svg, startX + (x - startX - gap) / 2, y + gh + 22, word.parts.map(function (p) { return p.text; }).join('-'), 15, 'middle', '#44586c');
          x += wordGap;
        });
      });
      svgTextNode(svg, padX, hgt - 40, '‘' + (tx.free || t('noFree')) + '’', 16, 'start', '#172b42');
      if (withCredit) creditInto(svg, w2, hgt);
      return { svg: svg, w: w2, h: hgt };
    }
    function downloadSvg(make, suffix) {
      var r = make(true);
      if (!r) { ctx.announce(t('nothingToExport')); ctx.setStatus(t('nothingToExport')); return; }
      ctx.download(new Blob([ctx.svgText(r.svg)], { type: 'image/svg+xml' }), fbase() + suffix + '.svg');
    }
    function downloadPng(make, suffix) {
      var r = make(false);
      if (!r) { ctx.announce(t('nothingToExport')); ctx.setStatus(t('nothingToExport')); return; }
      var scale = Math.min(3, Math.max(1, 1400 / r.w));
      var url = URL.createObjectURL(new Blob([ctx.svgText(r.svg)], { type: 'image/svg+xml' })), im = new Image();
      im.onload = function () {
        var c = D.createElement('canvas'); c.width = Math.round(r.w * scale); c.height = Math.round(r.h * scale);
        var x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height);
        x.drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        ctx.canvasBlob(ctx.canvasWithCredit(c, '#ffffff')).then(function (b) { ctx.download(b, fbase() + suffix + '.png'); });
      };
      im.onerror = function () { URL.revokeObjectURL(url); ctx.announce(t('pngError')); };
      im.src = url;
    }
    function printGrammar() {
      var art = h('article', { class: 'igl-print' });
      art.appendChild(h('h1', { text: S.name }));
      art.appendChild(h('p', { class: 'igl-print-sub', text: t('printSub', { c: S.cons.length, v: S.vowels.length, w: S.lex.length, s: glyphCount() }) }));
      art.appendChild(h('h2', { text: t('sec_sounds') }));
      art.appendChild(h('ul', null, sounds().map(function (s) { return h('li', null, h('strong', { lang: 'und', text: s + ' «' + romanOf(s) + '»' }), ' — ' + describe(s) + '.'); })));
      art.appendChild(h('h2', { text: t('sec_syllables') }));
      art.appendChild(h('p', { text: t('printPatterns', { p: S.patterns.map(function (p) { return p.p + ' (' + p.w + ')'; }).join(', ') }) }));
      art.appendChild(h('h2', { text: t('sec_grammar') }));
      art.appendChild(h('ul', null,
        h('li', { text: t('wordOrder') + ': ' + t('order_' + S.grammar.order) }),
        h('li', { text: t('adjPos') + ': ' + t(S.grammar.adj === 'before' ? 'adjBefore' : 'adjAfter') }),
        h('li', { text: t('affix_plural') + ' (PL): ' + (S.grammar.plural.form || '∅') + ' · ' + t(S.grammar.plural.type) }),
        h('li', { text: t('affix_past') + ' (PST): ' + (S.grammar.past.form || '∅') + ' · ' + t(S.grammar.past.type) }),
        h('li', { text: t('affix_present') + ' (PRS): ' + (S.grammar.present.form || '∅') + ' · ' + t(S.grammar.present.type) }),
        h('li', { text: t('affix_future') + ' (FUT): ' + (S.grammar.future.form || '∅') + ' · ' + t(S.grammar.future.type) })));
      if (S.changes.length) {
        art.appendChild(h('h2', { text: t('sec_changes') }));
        art.appendChild(h('ul', null, S.changes.map(function (r) { return h('li', { lang: 'und', text: ruleText(r) + (r.on ? '' : ' (' + t('ruleOff') + ')') }); })));
      }
      art.appendChild(h('h2', { text: t('sec_writing') }));
      var grid = h('div', { class: 'igl-print-alpha' });
      sounds().forEach(function (s) {
        grid.appendChild(h('div', { class: 'igl-print-sign' }, glyphSVG(s, 46), h('span', { text: romanOf(s) + ' /' + s + '/' })));
      });
      art.appendChild(grid);
      art.appendChild(h('h2', { text: t('sec_dict') }));
      var tb = h('table', { class: 'igl-print-table' }, h('thead', null, h('tr', null, h('th', { text: t('colWord') }), h('th', { text: t('colIpa') }), h('th', { text: t('colEs') }), h('th', { text: t('colEn') }), h('th', { text: t('colCat') }))));
      var body = h('tbody');
      S.lex.slice(0, 400).forEach(function (w) {
        body.appendChild(h('tr', null, h('td', { lang: 'und', text: romanWord(w.ph) }), h('td', { lang: 'und', text: '/' + w.ph.join('') + '/' }), h('td', { text: w.es }), h('td', { text: w.en }), h('td', { text: t('cat_' + w.cat) })));
      });
      tb.appendChild(body); art.appendChild(tb);
      if (S.texts.some(function (x) { return buildSentence(x).length; })) {
        art.appendChild(h('h2', { text: t('sec_text') }));
        S.texts.forEach(function (tx) {
          var built = buildSentence(tx); if (!built.length) return;
          art.appendChild(h('p', { class: 'igl-print-line', lang: 'und', text: built.map(function (w) { return w.parts.map(function (p) { return p.text; }).join('-'); }).join(' ') }));
          art.appendChild(h('p', { class: 'igl-print-gloss', text: built.map(function (w) { return w.parts.map(function (p) { return p.gloss; }).join('-'); }).join(' ') }));
          art.appendChild(h('p', { class: 'igl-print-free', text: '‘' + (tx.free || t('noFree')) + '’' }));
        });
        art.appendChild(h('p', { class: 'igl-print-note', text: t('glossNote') }));
      }
      art.appendChild(h('footer', { class: 'igl-print-credit', text: CREDIT }));
      ctx.printPages([art]);
      ctx.announce(t('printing'));
    }
    ctx.addExport(t('exportCsv'), exportCsv, 'file');
    ctx.addExport(t('exportGrammar'), printGrammar, 'file');
    ctx.addExport(t('exportAlphaSvg'), function () { downloadSvg(alphabetSVG, '-' + (LANG === 'en' ? 'alphabet' : 'alfabeto')); }, 'pen');
    ctx.addExport(t('exportAlphaPng'), function () { downloadPng(alphabetSVG, '-' + (LANG === 'en' ? 'alphabet' : 'alfabeto')); }, 'download');
    ctx.addExport(t('exportTextSvg'), function () { downloadSvg(textSVG, '-' + (LANG === 'en' ? 'text' : 'texto')); }, 'pen');
    ctx.addExport(t('exportTextPng'), function () { downloadPng(textSVG, '-' + (LANG === 'en' ? 'text' : 'texto')); }, 'download');

    /* ---------- Herramientas y órdenes ---------- */
    var secSel = h('label', { class: 'igs-inline-select' }, h('span', { text: t('goToPart') }));
    var ssel = h('select', null, SECTIONS.map(function (id) { var o = h('option', { value: id, text: t('sec_' + id) }); if (id === section) o.selected = true; return o; }));
    ssel.addEventListener('change', function () { goSection(ssel.value); });
    secSel.appendChild(ssel);
    ctx.setTools([
      { node: secSel },
      { id: 'gen', label: t('genBtn'), icon: 'sparkle', primary: true, action: function () { if (section !== 'syllables') goSection('syllables'); doGenerate(8); } },
      { id: 'word', label: t('addWordBtn'), icon: 'plus', action: function () { if (section !== 'dict') goSection('dict'); var b = docEl.querySelector('.igs-actions .igs-primary'); if (b) b.click(); } },
      { id: 'sign', label: t('designBtn'), icon: 'pen', action: function () { goSection('writing'); } },
      { id: 'sentence', label: t('addSentence'), icon: 'note', action: function () {
        if (section !== 'text') { goSection('text'); return; }
        if (S.texts.length >= MAX_TEXTS) { ctx.announce(t('maxSentences')); return; }
        S.texts.push({ free: '', words: [] }); curText = S.texts.length - 1; commit(t('sentenceAdded'));
      } },
      { id: 'concept', label: t('fillConcept'), icon: 'star', level: 'more', action: function () { if (section !== 'dict') goSection('dict'); fillNextConcept(); } },
      { id: 'rule', label: t('addRule'), icon: 'sliders', level: 'more', action: function () {
        goSection('changes');
        if (S.changes.length >= 12) { ctx.announce(t('maxRules')); return; }
        S.changes.push({ from: S.vowels[0] || S.cons[0] || '', to: S.vowels[1] || S.cons[1] || '', left: '', right: '', on: true });
        commit(t('ruleAdded'));
      } },
      { id: 'apply', label: t('applyChanges'), icon: 'check', level: 'more', action: function () { goSection('changes'); applyToLex(); } }
    ]);
    SECTIONS.forEach(function (id) { ctx.command('sec-' + id, t('sec_' + id), t('partsTitle'), function () { goSection(id); }); });
    ctx.command('gen', t('genBtn'), t('sec_syllables'), function () { goSection('syllables'); doGenerate(8); });
    ctx.command('concept', t('fillConcept'), t('sec_dict'), function () { goSection('dict'); fillNextConcept(); });
    ctx.command('apply', t('applyChanges'), t('sec_changes'), function () { goSection('changes'); applyToLex(); });
    ctx.command('csv', t('exportCsv'), t('fileMenu'), exportCsv);
    ctx.command('grammar', t('exportGrammar'), t('fileMenu'), printGrammar);
    ctx.command('alpha', t('exportAlphaSvg'), t('fileMenu'), function () { downloadSvg(alphabetSVG, '-alfabeto'); });
    ctx.command('textsvg', t('exportTextSvg'), t('fileMenu'), function () { downloadSvg(textSVG, '-texto'); });

    /* ---------- Puntos de partida ---------- */
    function build(id) {
      var s = empty();
      var packs = {
        secret: { cons: ['p', 't', 'k', 'm', 'n', 's', 'l', 'ʃ'], vowels: ['a', 'i', 'u', 'e', 'o'], pat: [{ p: 'CV', w: 5 }, { p: 'CVC', w: 1 }], n: 8, name: t('nameSecret') },
        fantasy: { cons: ['p', 't', 'k', 'b', 'd', 'ɡ', 'm', 'n', 'ŋ', 's', 'ʃ', 'l', 'r', 'j', 'w'], vowels: ['a', 'e', 'i', 'o', 'u'], pat: [{ p: 'CV', w: 5 }, { p: 'CVC', w: 3 }, { p: 'V', w: 1 }], n: 26, name: t('nameFantasy') },
        full: { cons: ['p', 't', 'k', 'ʔ', 'm', 'n', 'f', 's', 'x', 'l', 'r', 'j'], vowels: ['a', 'e', 'i', 'o', 'u', 'ə'], pat: [{ p: 'CV', w: 4 }, { p: 'CVC', w: 3 }, { p: 'CCV', w: 1 }], n: 18, name: t('nameFull') },
        translate: { cons: ['p', 't', 'k', 'm', 'n', 's', 'l', 'r'], vowels: ['a', 'i', 'u'], pat: [{ p: 'CV', w: 5 }, { p: 'CVC', w: 2 }], n: 10, name: t('nameTranslate') }
      };
      var p = packs[id] || packs.translate;
      s.cons = p.cons.slice(); s.vowels = p.vowels.slice(); s.patterns = p.pat.map(function (x) { return { p: x.p, w: x.w }; });
      s.name = p.name; s.seed = id;
      var all = s.cons.concat(s.vowels);
      all.forEach(function (sym, i) { s.glyphs[sym] = PRESETS[i % PRESETS.length].map(function (x) { return x.slice(); }); });
      S = s; seq = 0;
      var made = generate(p.n, s.seed), concepts = DATA.CONCEPTS.slice();
      made.forEach(function (ph, i) {
        var c = concepts[i] || null;
        S.lex.push({ id: nid(), ph: ph, es: c ? c[2] : '', en: c ? c[3] : '', cat: c ? c[1] : 'n', concept: c ? c[0] : '' });
      });
      if (id === 'full') {
        /* Las reglas salen del léxico recién creado, así que la vista previa nunca está vacía. */
        S.changes = [guessRule(), { from: 'k', to: 'x', left: '', right: '#', on: false }];
        S.grammar.order = 'SOV'; S.grammar.adj = 'before';
      }
      if (id === 'fantasy') { S.grammar.order = 'VSO'; S.grammar.plural = { type: 'suffix', form: romanWord([S.vowels[0], S.cons[5] || S.cons[0]]) }; }
      /* Una frase de ejemplo con palabras que ya existen. */
      var find = function (c) { return S.lex.filter(function (w) { return w.concept === c; })[0]; };
      var subj = find('child') || find('i') || S.lex[0], verb = find('see') || find('eat') || S.lex[1], obj = find('water') || find('sun') || S.lex[2];
      if (subj && verb && obj) {
        S.texts = [{ free: t('exFree'), words: [{ ref: subj.id, role: 'S', pl: false, tense: 'none' }, { ref: verb.id, role: 'V', pl: false, tense: 'present' }, { ref: obj.id, role: 'O', pl: false, tense: 'none' }] }];
      } else S.texts = [{ free: '', words: [] }];
      section = id === 'secret' ? 'writing' : id === 'translate' ? 'text' : id === 'full' ? 'changes' : 'dict';
      sel = null; curText = 0; gen = []; pending = null; search = '';
    }

    /* Busca el par de sonidos más repetido del léxico y propone un cambio que sí se vea. */
    function guessRule() {
      var count = {}, best = null;
      S.lex.forEach(function (w) {
        for (var i = 0; i + 1 < w.ph.length; i++) {
          if (S.vowels.indexOf(w.ph[i]) < 0) continue;
          var k = w.ph[i] + '\u0001' + w.ph[i + 1];
          count[k] = (count[k] || 0) + 1;
          if (!best || count[k] > count[best]) best = k;
        }
      });
      if (!best) return { from: S.vowels[0] || 'a', to: S.vowels[1] || 'e', left: '', right: '', on: true };
      var pair = best.split('\u0001');
      var to = S.vowels.filter(function (v) { return v !== pair[0]; })[0] || S.vowels[0];
      return { from: pair[0], to: to, left: '', right: pair[1], on: true };
    }

    function validate(d) {
      if (!d || !Array.isArray(d.cons) || !Array.isArray(d.vowels) || !Array.isArray(d.lex) || !Array.isArray(d.patterns)) return false;
      if (d.cons.length > 90 || d.vowels.length > 40 || d.lex.length > MAX_LEX || d.patterns.length > 12) return false;
      var okSym = function (s) { return typeof s === 'string' && s.length <= 3 && !!symInfo(s); };
      if (!d.cons.every(okSym) || !d.vowels.every(okSym)) return false;
      if (!d.lex.every(function (w) { return w && typeof w.id === 'string' && Array.isArray(w.ph) && w.ph.length <= 20 && w.ph.every(okSym) && typeof w.es === 'string' && typeof w.en === 'string' && w.es.length <= 80 && w.en.length <= 80; })) return false;
      if (d.glyphs && Object.keys(d.glyphs).some(function (k) {
        var g = d.glyphs[k];
        return !Array.isArray(g) || g.length > 20 || !g.every(function (s) { return Array.isArray(s) && s.length === 2 && s.every(function (n) { return Number.isInteger(n) && n >= 0 && n < GW * GH; }); });
      })) return false;
      if (d.texts && (!Array.isArray(d.texts) || d.texts.length > MAX_TEXTS || !d.texts.every(function (x) { return x && typeof x.free === 'string' && x.free.length <= 300 && Array.isArray(x.words) && x.words.length <= 24; }))) return false;
      return typeof d.name === 'string' && d.name.length <= 80;
    }
    function restore(st) {
      var e = empty();
      S = { v: 1, name: String(st.name || e.name).slice(0, 80), cons: st.cons.slice(), vowels: st.vowels.slice(),
        patterns: st.patterns.filter(function (p) { return p && validPattern(p.p); }).map(function (p) { return { p: String(p.p).toUpperCase(), w: Math.max(0, Math.min(10, +p.w || 0)) }; }),
        seed: String(st.seed || 'iris').slice(0, 24), roman: {}, glyphs: {}, grammar: e.grammar, lex: [], changes: [], texts: [] };
      if (!S.patterns.length) S.patterns = e.patterns;
      Object.keys(st.roman || {}).forEach(function (k) { if (typeof st.roman[k] === 'string') S.roman[k] = st.roman[k].slice(0, 4); });
      Object.keys(st.glyphs || {}).forEach(function (k) { S.glyphs[k] = st.glyphs[k].map(function (s) { return s.slice(); }); });
      var g = st.grammar || {};
      S.grammar.order = /^(SVO|SOV|VSO|VOS|OSV|OVS)$/.test(g.order) ? g.order : 'SVO';
      S.grammar.adj = g.adj === 'before' ? 'before' : 'after';
      ['plural', 'past', 'present', 'future'].forEach(function (k) {
        var a = g[k] || {};
        S.grammar[k] = { type: a.type === 'prefix' ? 'prefix' : 'suffix', form: String(a.form || '').slice(0, 12) };
      });
      st.lex.forEach(function (w) { S.lex.push({ id: String(w.id), ph: w.ph.slice(), es: String(w.es || '').slice(0, 80), en: String(w.en || '').slice(0, 80), cat: /^(n|v|adj|pron|num|part)$/.test(w.cat) ? w.cat : 'n', concept: String(w.concept || '').slice(0, 24) }); });
      (st.changes || []).forEach(function (r) { S.changes.push({ from: String(r.from || ''), to: String(r.to || ''), left: String(r.left || ''), right: String(r.right || ''), on: !!r.on }); });
      (st.texts || []).forEach(function (x) {
        S.texts.push({ free: String(x.free || '').slice(0, 300), words: (x.words || []).map(function (s) {
          return { ref: String(s.ref || ''), role: /^(S|V|O|ADJ|X)$/.test(s.role) ? s.role : 'X', pl: !!s.pl, tense: /^(none|past|present|future)$/.test(s.tense) ? s.tense : 'none' };
        }) });
      });
      if (!S.texts.length) S.texts = [{ free: '', words: [] }];
      seq = 0; S.lex.forEach(function (w) { var n = parseInt(String(w.id).replace(/\D/g, ''), 10); if (n > seq) seq = n; });
      curText = 0; sel = null; gen = []; pending = null; search = '';
      if (SECTIONS.indexOf(section) < 0) section = 'sounds';
    }

    render();
    return {
      serialize: function () { return JSON.parse(JSON.stringify(S)); },
      validate: validate,
      restore: function (st) { restore(st); render(); },
      start: function (id) {
        if (id === 'empty') { S = empty(); seq = 0; section = 'sounds'; sel = null; curText = 0; gen = []; pending = null; search = ''; S.texts = [{ free: '', words: [] }]; }
        else build(id);
        render();
      },
      onKey: function (e) {
        if (e.key === 'Escape' && sel) { sel = null; renderSide(); ctx.announce(t('deselected')); return true; }
        if ((e.key === 'PageDown' || e.key === 'PageUp') && vp.contains(e.target)) {
          var i = SECTIONS.indexOf(section), n = (i + (e.key === 'PageDown' ? 1 : SECTIONS.length - 1)) % SECTIONS.length;
          goSection(SECTIONS[n]); return true;
        }
        return false;
      }
    };
  }
})(window);
