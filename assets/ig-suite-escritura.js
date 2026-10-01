/* Iris Green · El taller · Estudio de escritura con restricciones (R43).
   El «lienzo» es un documento de texto: el editor ocupa el centro, Estructura lista borradores y partes,
   y Propiedades muestra las reglas y las comprobaciones en vivo.
   Reglas combinables: lipograma, número de palabras, límite de caracteres, número de párrafos, acróstico,
   tautograma, univocalismo, palíndromo, haiku 5-7-5, soneto y estructura fija de cuento.
   Métrica española: silabeo según las reglas de la RAE y la ASALE (Ortografía de la lengua española, 2010),
   con sinalefa y ajuste por acento final opcionales. En inglés, recuento aproximado documentado.
   Privacidad: el texto no sale del navegador salvo cuando la persona descarga un archivo. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang;
  var MAX_TEXT = 60000, MAX_DOCS = 40, CREDIT = 'IRIS GREEN · irisgreen.eu';

  /* ---------- Utilidades de texto ---------- */
  var WORD_RE = /[\p{L}\p{M}\p{N}]+(?:['’\-][\p{L}\p{M}\p{N}]+)*/gu;
  var ACCENTS = { 'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a', 'ã': 'a', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e', 'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o', 'õ': 'o', 'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u', 'ý': 'y', 'ÿ': 'y' };
  /* Minúsculas y, si se pide, sin tildes ni diéresis. La ñ se queda: es otra letra. */
  function fold(s, accents) {
    var x = String(s || '').toLowerCase();
    return accents === false ? x : x.replace(/[áàâäãéèêëíìîïóòôöõúùûüýÿ]/g, function (c) { return ACCENTS[c]; });
  }
  function isLetter(ch) { return /\p{L}/u.test(ch); }
  function words(text) {
    var out = [], m; WORD_RE.lastIndex = 0;
    while ((m = WORD_RE.exec(text))) out.push({ w: m[0], a: m.index, b: m.index + m[0].length });
    return out;
  }
  function lines(text) {
    var out = [], a = 0;
    String(text).split('\n').forEach(function (ln) { out.push({ t: ln, a: a, b: a + ln.length }); a += ln.length + 1; });
    return out;
  }
  function verses(text) { return lines(text).filter(function (l) { return l.t.trim(); }); }
  function paragraphs(text) {
    var out = [], re = /[^\n]*\S[^\n]*(?:\n[^\n]*\S[^\n]*)*/g, m;
    while ((m = re.exec(text))) out.push({ t: m[0], a: m.index, b: m.index + m[0].length });
    return out;
  }
  function sentences(text) {
    var out = [], re = /[^.!?…\n]+(?:[.!?…]+|$|\n)/g, m;
    while ((m = re.exec(text))) {
      if (!m[0]) { re.lastIndex++; continue; }
      var ws = words(m[0]); if (!ws.length) continue;
      var lead = m[0].search(/\S/);
      out.push({ t: m[0].trim(), a: m.index + lead, b: m.index + m[0].replace(/\s+$/, '').length, n: ws.length });
    }
    return out;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function plural(t, n) { return n === 1 ? t('issue1') : t('issuesN', { n: n }); }
  function clip(s, n) { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  /* ---------- Sílabas en español (Ortografía de la RAE y la ASALE, 2010) ----------
     Núcleos: dos vocales abiertas (a, e, o) forman hiato; una abierta con una cerrada (i, u) sin tilde,
     o dos cerradas distintas, forman diptongo; la cerrada con tilde junto a una abierta forma hiato.
     La h intercalada no impide el diptongo. «qu» y «gu» ante e, i: la u no suena. La y final es vocal.
     Consonantes entre vocales: una va con la vocal siguiente; dos se separan salvo los grupos
     inseparables (pr, br, tr, dr, cr, gr, fr, pl, bl, cl, gl, fl); tres o cuatro, según esos grupos. */
  var OPEN = 'aeoáéó', CLOSED = 'iuüyíú', ACC_CLOSED = 'íú', VOWELS = 'aeiouáéíóúü';
  var CLUSTERS = ['pr', 'br', 'tr', 'dr', 'cr', 'kr', 'gr', 'fr', 'pl', 'bl', 'cl', 'kl', 'gl', 'fl'];
  function unitsEs(word) {
    var w = fold(word, false).replace(/[^a-zñáéíóúüàèìòùç]/g, ''), u = [], i = 0;
    while (i < w.length) {
      var c = w[i], n = w[i + 1] || '', n2 = w[i + 2] || '';
      if ((c === 'c' && n === 'h') || (c === 'l' && n === 'l') || (c === 'r' && n === 'r')) { u.push({ s: c + n, v: false }); i += 2; continue; }
      if ((c === 'q' || c === 'g') && n === 'u' && 'eiéí'.indexOf(n2) >= 0) { u.push({ s: c + n, v: false }); i += 2; continue; }
      if (c === 'y') {
        var vNext = n && VOWELS.indexOf(n) >= 0;
        u.push({ s: c, v: !vNext }); i += 1; continue;
      }
      u.push({ s: c, v: VOWELS.indexOf(c) >= 0, h: c === 'h' }); i += 1;
    }
    return u;
  }
  function canJoin(a, b) {
    var ao = OPEN.indexOf(a) >= 0, bo = OPEN.indexOf(b) >= 0;
    if (ao && bo) return false;
    if ((ao && ACC_CLOSED.indexOf(b) >= 0) || (bo && ACC_CLOSED.indexOf(a) >= 0)) return false;
    if (!ao && !bo && fold(a) === fold(b)) return false;
    return true;
  }
  function syllabifyEs(word) {
    var u = unitsEs(word);
    /* 1. Núcleos vocálicos (índices de unidades) */
    var nuclei = [], i = 0;
    while (i < u.length) {
      if (!u[i].v) { i++; continue; }
      var nuc = [i], opens = OPEN.indexOf(u[i].s) >= 0 ? 1 : 0, j = i + 1;
      while (j < u.length) {
        var k = j; if (u[k] && u[k].h && u[k + 1] && u[k + 1].v) k = j + 1;
        if (!u[k] || !u[k].v) break;
        var last = u[nuc[nuc.length - 1]].s, isOpen = OPEN.indexOf(u[k].s) >= 0;
        if (!canJoin(last, u[k].s) || (isOpen && opens) || nuc.length >= 3) break;
        if (isOpen) opens++;
        nuc.push(k); j = k + 1;
      }
      nuclei.push(nuc); i = nuc[nuc.length - 1] + 1;
    }
    if (!nuclei.length) return { syl: u.length ? [u.map(function (x) { return x.s; }).join('')] : [], n: 0, stress: -1 };
    /* 2. Reparto de consonantes entre núcleos */
    var bounds = [0];
    for (var q = 0; q < nuclei.length - 1; q++) {
      var endA = nuclei[q][nuclei[q].length - 1], startB = nuclei[q + 1][0];
      var cons = []; for (var c = endA + 1; c < startB; c++) cons.push(c);
      var cut;
      if (cons.length <= 1) cut = endA + 1;
      else {
        var lastTwo = cons.length >= 2 ? u[cons[cons.length - 2]].s + u[cons[cons.length - 1]].s : '';
        cut = CLUSTERS.indexOf(lastTwo) >= 0 ? cons[cons.length - 2] : cons[cons.length - 1];
        if (cons.length === 4) cut = cons[2];
      }
      bounds.push(cut);
    }
    var syl = [];
    for (var s = 0; s < bounds.length; s++) {
      var from = bounds[s], to = s + 1 < bounds.length ? bounds[s + 1] : u.length;
      syl.push(u.slice(from, to).map(function (x) { return x.s; }).join(''));
    }
    /* 3. Sílaba tónica: la de la tilde; si no hay, llana si acaba en vocal, n o s; aguda en los demás casos */
    var stress = -1;
    nuclei.forEach(function (nuc, ix) { nuc.forEach(function (k) { if ('áéíóú'.indexOf(u[k].s) >= 0) stress = ix; }); });
    if (stress < 0) {
      var lastU = u[u.length - 1].s;
      var llana = 'aeiou'.indexOf(lastU) >= 0 || lastU === 'n' || lastU === 's';
      stress = nuclei.length >= 2 && llana ? nuclei.length - 2 : nuclei.length - 1;
    }
    var firstIsV = u[0].v || (u[0].h && u[1] && u[1].v), lastIsV = u[u.length - 1].v;
    var vowelOnly = u.every(function (x) { return x.v || x.h; });
    return { syl: syl, n: nuclei.length, stress: stress, startsV: !!firstIsV, endsV: !!lastIsV, vowelOnly: vowelOnly };
  }
  /* Recuento métrico de un verso. opts.syn: sinalefa; opts.acc: ajuste por acento final. */
  function meterEs(lineText, opts) {
    var ws = words(lineText).filter(function (w) { return /\p{L}/u.test(w.w); });
    var info = ws.map(function (w) { return syllabifyEs(w.w.replace(/['’\-]/g, '')); });
    /* Una palabra de una sola vocal («y», «a», «o») se une solo a una vecina; la sinalefa triple se acepta como alternativa. */
    var gram = info.reduce(function (a, x) { return a + x.n; }, 0), syn = 0, synAll = 0, joins = [], mergedPrev = false;
    for (var i = 1; i < ws.length; i++) {
      var between = lineText.slice(ws[i - 1].b, ws[i].a), ok = opts.syn && info[i - 1].endsV && info[i].startsV && !/[.;:!?¡¿()«»"—]/.test(between);
      if (ok) synAll++;
      if (ok && mergedPrev && info[i - 1].vowelOnly && info[i - 1].n === 1) ok = false;
      if (ok) { syn++; joins.push(i); }
      mergedPrev = ok;
    }
    var lastW = info[info.length - 1], kind = 'llana', adj = 0;
    if (lastW && lastW.n) {
      var pos = lastW.n - 1 - lastW.stress;
      kind = pos === 0 ? 'aguda' : pos === 1 ? 'llana' : 'esdrujula';
      if (opts.acc) adj = pos === 0 ? 1 : pos >= 2 ? -1 : 0;
    }
    var shown = ws.map(function (w, ix) { return (joins.indexOf(ix) >= 0 ? '‿' : (ix ? ' ' : '')) + info[ix].syl.join('-'); }).join('');
    return { count: gram - syn + adj, alt: synAll !== syn ? gram - synAll + adj : null, gram: gram, syn: syn, adj: adj, kind: kind, shown: shown, digits: /\d/.test(lineText), rhyme: rhymeEs(ws, info) };
  }
  function rhymeEs(ws, info) {
    var i = ws.length - 1; if (i < 0 || !info[i].n) return '';
    var syl = info[i].syl, st = info[i].stress, tail = syl.slice(st).join('');
    var m = tail.match(/[aeiouáéíóúü].*$/); tail = m ? m[0] : tail;
    return fold(tail).replace(/h/g, '').replace(/v/g, 'b').replace(/^([iu])(?=[aeo])/, '');
  }
  /* Inglés: aproximación por grupos de vocales (e muda final, -es y -ed) */
  function syllablesEn(word) {
    var w = String(word).toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return 0; if (w.length <= 3) return 1;
    w = w.replace(/([aeiouy]l)e$/, '$1').replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, '').replace(/^y/, '');
    var m = w.match(/[aeiouy]{1,2}/g); return Math.max(1, m ? m.length : 0);
  }
  function meterEn(lineText) {
    var ws = words(lineText).filter(function (w) { return /\p{L}/u.test(w.w); });
    var parts = ws.map(function (w) { return syllablesEn(w.w); });
    var last = ws.length ? fold(ws[ws.length - 1].w).replace(/[^a-z]/g, '') : '';
    var rm = last.replace(/e$/, '').match(/[aeiouy]+[^aeiouy]*$/);
    return { count: parts.reduce(function (a, b) { return a + b; }, 0), gram: null, syn: 0, adj: 0, kind: null,
      shown: ws.map(function (w, i) { return w.w + ' (' + parts[i] + ')'; }).join(' '), digits: /\d/.test(lineText), rhyme: rm ? rm[0] + (/e$/.test(last) ? 'e' : '') : last };
  }

  /* ---------- Plantillas de estructura fija ---------- */
  var TEMPLATES = ['spine', 'three', 'letter', 'object'];
  function cues(ctx, tpl) { return String(ctx.t('tplCues_' + tpl)).split('|'); }

  /* ---------- Documentos ---------- */
  function defRules() {
    return {
      lipo: { on: false, letters: 'e', accents: true }, words: { on: false, n: 50, mode: 'exact' }, chars: { on: false, n: 280, spaces: true },
      paras: { on: false, n: 3 }, acro: { on: false, word: '' }, tauto: { on: false, letter: '', short: false }, univ: { on: false, vowel: 'a' },
      pali: { on: false, unit: 'letters' }, haiku: { on: false }, sonnet: { on: false }, story: { on: false, tpl: 'spine', cues: true, min: 3 }
    };
  }
  var RULE_ORDER = ['words', 'chars', 'paras', 'lipo', 'acro', 'tauto', 'univ', 'pali', 'haiku', 'sonnet', 'story'];
  function normDoc(d, i) {
    var r = defRules(), src = (d && d.rules) || {};
    Object.keys(r).forEach(function (k) { if (src[k] && typeof src[k] === 'object') Object.keys(r[k]).forEach(function (f) { if (src[k][f] !== undefined && typeof src[k][f] === typeof r[k][f]) r[k][f] = src[k][f]; }); });
    var mt = (d && d.meter) || {};
    return { id: String(d && d.id || ('d' + (i + 1))), name: String(d && d.name || '').slice(0, 120), lang: d && d.lang === 'en' ? 'en' : d && d.lang === 'es' ? 'es' : LANG,
      text: String(d && d.text || '').slice(0, MAX_TEXT), rules: r, meter: { syn: mt.syn !== false, acc: mt.acc !== false } };
  }

  IG.defineEngine('escritura', {
    version: 1, fileBase: LANG === 'en' ? 'constraint-writing' : 'escritura',
    extraKeys: ['kWriteNext', 'kWriteUndo'],
    initialStart: function (para) { return { child: 'acro', teen: 'micro50', adult: 'sonnet' }[para] || 'spine'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'acro', title: t('stAcro'), desc: t('stAcroD'), para: 'child' },
        { id: 'micro50', title: t('stMicro'), desc: t('stMicroD'), para: 'teen' },
        { id: 'sonnet', title: t('stSonnet'), desc: t('stSonnetD'), para: 'adult' },
        { id: 'lipo', title: t('stLipo'), desc: t('stLipoD'), para: 'adult' },
        { id: 'spine', title: t('stSpine'), desc: t('stSpineD'), para: 'any' },
        { id: 'three', title: t('stThree'), desc: t('stThreeD'), para: 'any' },
        { id: 'haiku', title: t('stHaiku'), desc: t('stHaikuD'), para: 'any' },
        { id: 'tauto', title: t('stTauto'), desc: t('stTautoD'), para: 'child' },
        { id: 'univ', title: t('stUniv'), desc: t('stUnivD'), para: 'teen' },
        { id: 'pali', title: t('stPali'), desc: t('stPaliD'), para: 'teen' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport;
    var S = { v: 1, cur: 0, docs: [normDoc({ name: t('draftN', { n: 1 }) }, 0)] }, seq = 1;
    var sel = null; /* {kind:'line'|'para'|'part', i} */
    var ui = { marks: true, size: 19, font: 'atkinson' };
    function doc() { return S.docs[S.cur]; }
    function nid() { seq += 1; return 'd' + seq; }

    /* ---------- Vista: editor de texto accesible ---------- */
    vp.setAttribute('role', 'region'); vp.removeAttribute('aria-roledescription'); vp.removeAttribute('tabindex');
    vp.classList.add('igw-viewport');
    var nameEl = h('span', { class: 'igw-docname' });
    var label = h('label', { for: 'igw-text', class: 'igw-label' }, h('span', { class: 'igw-label-k', text: t('editorLabel') }), ' ', nameEl);
    var badge = h('p', { class: 'igw-badge', id: 'igw-badge' });
    var hl = h('div', { class: 'igw-hl' });
    var backdrop = h('div', { class: 'igw-backdrop', 'aria-hidden': 'true' }, hl);
    var ta = h('textarea', { id: 'igw-text', class: 'igw-ta', spellcheck: 'true', maxlength: String(MAX_TEXT), 'aria-describedby': 'igw-badge igw-help', autocomplete: 'off' });
    var field = h('div', { class: 'igw-field' }, backdrop, ta);
    var counts = h('span', { class: 'igw-counts' }), lineInfo = h('span', { class: 'igw-lineinfo' });
    var help = h('p', { id: 'igw-help', class: 'igs-sr', text: t('editorHelp') });
    var editor = h('div', { class: 'igw-editor', 'data-font': ui.font }, h('div', { class: 'igw-head' }, label, badge), field, h('div', { class: 'igw-foot' }, counts, lineInfo), help);
    vp.appendChild(editor);
    function applyUi() { editor.dataset.font = ui.font; editor.style.setProperty('--igw-size', ui.size + 'px'); editor.dataset.marks = String(ui.marks); }
    applyUi();

    /* ---------- Comprobaciones ---------- */
    function meterOf(d, ln) { return d.lang === 'en' ? meterEn(ln) : meterEs(ln, d.meter); }
    function check(d) {
      var text = d.text, R = d.rules, out = [], ws = words(text);
      function rule(id, title) { var r = { id: id, title: title, issues: [], info: [] }; out.push(r); return r; }
      function issue(r, txt, a, b) { r.issues.push({ text: txt, a: a, b: b === undefined ? a : b }); }
      var end = text.length;
      if (R.words.on) {
        var r1 = rule('words', t('rWordsT', { n: R.words.n, mode: t('mode_' + R.words.mode) })), n = ws.length, want = R.words.n;
        r1.info.push(t('countWords', { n: n }));
        if (n > want && R.words.mode !== 'min') issue(r1, t('iTooMany', { n: n - want, w: ws[want].w }), ws[want].a, ws[n - 1].b);
        if (n < want && R.words.mode !== 'max') issue(r1, t('iTooFew', { n: want - n }), end);
      }
      if (R.chars.on) {
        var r2 = rule('chars', t('rCharsT', { n: R.chars.n, sp: t(R.chars.spaces ? 'withSpaces' : 'withoutSpaces') })), cnt = 0, cut = -1;
        for (var i = 0; i < text.length; i++) { if (R.chars.spaces || !/\s/.test(text[i])) { cnt++; if (cnt === R.chars.n + 1) cut = i; } }
        r2.info.push(t('countChars', { n: cnt }));
        if (cnt > R.chars.n) issue(r2, t('iCharsOver', { n: cnt - R.chars.n }), cut, end);
      }
      if (R.paras.on) {
        var r3 = rule('paras', t('rParasT', { n: R.paras.n })), ps = paragraphs(text);
        r3.info.push(t('countParas', { n: ps.length }));
        if (ps.length > R.paras.n) issue(r3, t('iParasOver', { n: ps.length - R.paras.n }), ps[R.paras.n].a, ps[ps.length - 1].b);
        if (ps.length < R.paras.n) issue(r3, t('iParasUnder', { n: R.paras.n - ps.length }), end);
      }
      if (R.lipo.on) {
        var letters = fold(R.lipo.letters, R.lipo.accents).replace(/[^\p{L}]/gu, '');
        var r4 = rule('lipo', t('rLipoT', { l: letters.split('').join(', ') || '—' }));
        if (letters) ws.forEach(function (w) {
          var f = fold(w.w, R.lipo.accents), hit = letters.split('').filter(function (c) { return f.indexOf(c) >= 0; });
          if (hit.length) issue(r4, t('iLipo', { w: w.w, l: hit.join(', ') }), w.a, w.b);
        });
      }
      if (R.acro.on) {
        var word = fold(R.acro.word).replace(/[^\p{L}]/gu, ''), vs = verses(text);
        var r5 = rule('acro', t('rAcroT', { w: String(R.acro.word).toUpperCase() || '—' }));
        word.split('').forEach(function (ch, k) {
          var v = vs[k];
          if (!v) { issue(r5, t('iAcroMissing', { n: k + 1, l: ch.toUpperCase() }), end); return; }
          var fw = words(v.t)[0], first = fw ? fold(fw.w)[0] : '';
          if (first !== ch) issue(r5, t('iAcroWrong', { n: k + 1, l: ch.toUpperCase(), got: (first || '—').toUpperCase() }), fw ? v.a + fw.a : v.a, fw ? v.a + fw.b : v.b);
        });
        for (var k2 = word.length; k2 < vs.length; k2++) issue(r5, t('iAcroExtra', { n: k2 + 1 }), vs[k2].a, vs[k2].b);
      }
      if (R.tauto.on) {
        var tl = fold(R.tauto.letter).replace(/[^\p{L}]/gu, '')[0] || (ws[0] ? fold(ws[0].w)[0] : '');
        var r6 = rule('tauto', t('rTautoT', { l: (tl || '—').toUpperCase() }));
        if (tl) ws.forEach(function (w) { if (R.tauto.short && w.w.length <= 3) return; if (fold(w.w)[0] !== tl) issue(r6, t('iTauto', { w: w.w, l: tl.toUpperCase() }), w.a, w.b); });
      }
      if (R.univ.on) {
        var vv = fold(R.univ.vowel)[0] || 'a', r7 = rule('univ', t('rUnivT', { v: vv }));
        ws.forEach(function (w) { var other = fold(w.w).replace(/[^aeiou]/g, '').replace(new RegExp(vv, 'g'), ''); if (other) issue(r7, t('iUniv', { w: w.w, v: other.split('').filter(function (c, ix, a) { return a.indexOf(c) === ix; }).join(', ') }), w.a, w.b); });
      }
      if (R.pali.on) {
        var r8 = rule('pali', t(R.pali.unit === 'words' ? 'rPaliWT' : 'rPaliT'));
        if (R.pali.unit === 'words') {
          var seqW = ws.map(function (w) { return fold(w.w); });
          for (var p = 0; p < Math.floor(seqW.length / 2); p++) if (seqW[p] !== seqW[seqW.length - 1 - p]) { var q = ws[ws.length - 1 - p]; issue(r8, t('iPaliW', { a: ws[p].w, b: q.w }), ws[p].a, ws[p].b); issue(r8, t('iPaliW2', { a: q.w, b: ws[p].w }), q.a, q.b); break; }
        } else {
          var ls = []; for (var c = 0; c < text.length; c++) if (isLetter(text[c]) || /\d/.test(text[c])) ls.push({ c: fold(text[c]), i: c });
          for (var p2 = 0; p2 < Math.floor(ls.length / 2); p2++) {
            var A = ls[p2], B = ls[ls.length - 1 - p2];
            if (A.c !== B.c) { issue(r8, t('iPali', { a: text[A.i], b: text[B.i], n: p2 + 1 }), A.i, A.i + 1); issue(r8, t('iPali2', { a: text[B.i], b: text[A.i] }), B.i, B.i + 1); break; }
          }
          if (ls.length < 2) issue(r8, t('iPaliShort'), end);
        }
      }
      if (R.haiku.on || R.sonnet.on) {
        var vsm = verses(text), digitsWarned = false;
        [['haiku', R.haiku.on, [5, 7, 5]], ['sonnet', R.sonnet.on, null]].forEach(function (cfg) {
          if (!cfg[1]) return;
          var target = cfg[2] || new Array(14).fill(d.lang === 'en' ? 10 : 11);
          var r9 = rule(cfg[0], t(cfg[0] === 'haiku' ? 'rHaikuT' : (d.lang === 'en' ? 'rSonnetEnT' : 'rSonnetT')));
          vsm.forEach(function (v, k) {
            var m = meterOf(d, v.t);
            if (m.digits && !digitsWarned) { issue(r9, t('iDigits'), v.a, v.b); digitsWarned = true; }
            if (k >= target.length) { issue(r9, t('iVerseExtra', { n: k + 1 }), v.a, v.b); return; }
            if (m.count !== target[k] && m.alt !== target[k]) issue(r9, t('iVerseCount', { n: k + 1, c: m.count, want: target[k] }), v.a, v.b);
          });
          if (vsm.length < target.length) issue(r9, t('iVersesMissing', { n: target.length - vsm.length }), end);
          if (cfg[0] === 'sonnet' && vsm.length) {
            var letters2 = [], map = {};
            vsm.slice(0, 14).forEach(function (v) { var rk = meterOf(d, v.t).rhyme || '?'; if (!map[rk]) map[rk] = String.fromCharCode(65 + Object.keys(map).length); letters2.push(map[rk]); });
            var groups = paragraphs(text).map(function (p) { return verses(p.t).length; });
            r9.info.push(t('rhymeScheme', { s: letters2.join('') }));
            if (groups.length > 1) r9.info.push(t('stanzas', { s: groups.join('-') }));
          }
        });
      }
      if (R.story.on) {
        var cs = cues(ctx_forLang(d), R.story.tpl), ps2 = paragraphs(text), r10 = rule('story', t('rStoryT', { tpl: t('tpl_' + R.story.tpl), n: cs.length }));
        cs.forEach(function (cue, k) {
          var pp = ps2[k];
          if (!pp) { issue(r10, t('iPartMissing', { n: k + 1, cue: cue }), end); return; }
          var own = words(pp.t).length;
          if (R.story.cues) {
            var norm = function (s) { return fold(s).replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim(); };
            if (norm(pp.t).indexOf(norm(cue)) !== 0) issue(r10, t('iPartCue', { n: k + 1, cue: cue }), pp.a, Math.min(pp.b, pp.a + 40));
            own -= words(cue).length;
          }
          if (own < R.story.min) issue(r10, t('iPartShort', { n: k + 1, min: R.story.min }), pp.a, pp.b);
        });
        for (var k3 = cs.length; k3 < ps2.length; k3++) issue(r10, t('iPartExtra', { n: k3 + 1 }), ps2[k3].a, ps2[k3].b);
      }
      return out;
    }
    /* Las frases de arranque siguen el idioma del borrador, no el de la página. */
    var CUES_OTHER = null;
    function ctx_forLang(d) {
      if (d.lang === LANG) return ctx;
      if (!CUES_OTHER) { CUES_OTHER = {}; TEMPLATES.forEach(function (k) { CUES_OTHER['tplCues_' + k] = t('tplCuesOther_' + k); }); }
      return { t: function (key) { return CUES_OTHER[key] || t(key); } };
    }
    function stats(d) {
      var ws = words(d.text), ss = sentences(d.text), longW = 0;
      ws.forEach(function (w) { var n = d.lang === 'en' ? syllablesEn(w.w) : syllabifyEs(w.w).n; if (n >= (d.lang === 'en' ? 3 : 4)) longW++; });
      var longest = ss.reduce(function (a, s) { return !a || s.n > a.n ? s : a; }, null);
      return { words: ws.length, chars: d.text.length, charsNoSp: d.text.replace(/\s/g, '').length, sentences: ss.length, paras: paragraphs(d.text).length,
        lines: verses(d.text).length, avg: ss.length ? ws.length / ss.length : 0, longW: longW, longPct: ws.length ? longW / ws.length * 100 : 0,
        minutes: ws.length / 200, longest: longest, longSent: ss.filter(function (s) { return s.n > 25; }) };
    }

    /* ---------- Resaltado detrás del texto (marca ondulada, no solo color) ---------- */
    var lastChecks = [], issuesFlat = [], issueIx = -1;
    function drawMarks() {
      var text = ta.value, ranges = [];
      if (ui.marks) issuesFlat.forEach(function (x) { if (x.b > x.a) ranges.push([x.a, x.b]); });
      ranges.sort(function (a, b) { return a[0] - b[0]; });
      var merged = []; ranges.forEach(function (r) { var l = merged[merged.length - 1]; if (l && r[0] <= l[1]) l[1] = Math.max(l[1], r[1]); else merged.push(r.slice()); });
      var html = '', pos = 0;
      merged.forEach(function (r) { html += esc(text.slice(pos, r[0])) + '<mark>' + esc(text.slice(r[0], r[1])) + '</mark>'; pos = r[1]; });
      html += esc(text.slice(pos)) + '\n';
      hl.innerHTML = html; /* texto escapado: solo etiquetas <mark> propias */
      backdrop.scrollTop = ta.scrollTop;
    }
    ta.addEventListener('scroll', function () { backdrop.scrollTop = ta.scrollTop; });

    function scrollToOffset(a) {
      var text = ta.value, probe = h('span', { class: 'igw-probe' });
      hl.textContent = text.slice(0, a); hl.appendChild(probe); hl.appendChild(D.createTextNode(text.slice(a) + '\n'));
      var y = probe.offsetTop; drawMarks();
      ta.scrollTop = Math.max(0, y - ta.clientHeight / 3); backdrop.scrollTop = ta.scrollTop;
    }
    function closeSheet() { var dl = ctx.inspector.closest('dialog[open]'); if (dl) dl.close(); }
    function goRange(a, b, msg) {
      a = Math.max(0, Math.min(ta.value.length, a)); b = Math.max(a, Math.min(ta.value.length, b));
      closeSheet();
      try { ta.focus({ preventScroll: true }); } catch (_) { ta.focus(); }
      ta.setSelectionRange(a, b); scrollToOffset(a);
      if (!vpVisible()) vp.scrollIntoView({ block: 'nearest' });
      updateLineInfo();
      if (msg) ctx.announce(msg + (b > a ? ' · ' + t('selectedText', { s: clip(ta.value.slice(a, b), 60) }) : ''));
    }
    function vpVisible() { var r = vp.getBoundingClientRect(); return r.top >= 0 && r.bottom <= (root.innerHeight || 800); }
    function nextIssue() {
      if (!issuesFlat.length) { ctx.announce(t('noIssues')); ctx.setStatus(t('noIssues')); return; }
      var s0 = ta.selectionStart || 0, s1 = ta.selectionEnd || 0;
      var here = issuesFlat.findIndex(function (x) { return x.a === s0 && x.b === s1; });
      var ix = here >= 0 ? here + 1 : issuesFlat.findIndex(function (x) { return x.a >= s0; });
      if (ix < 0 || ix >= issuesFlat.length) ix = 0; issueIx = ix;
      var it = issuesFlat[ix]; goRange(it.a, it.b, t('issueN', { i: ix + 1, n: issuesFlat.length }) + ': ' + it.text);
    }

    /* ---------- Escritura en el editor ---------- */
    var typeTimer = 0, sideTimer = 0;
    function flushCommit() { if (typeTimer) { root.clearTimeout(typeTimer); typeTimer = 0; ctx.commit(t('typed')); } }
    ta.addEventListener('input', function () {
      doc().text = ta.value;
      root.clearTimeout(typeTimer); typeTimer = root.setTimeout(function () { typeTimer = 0; ctx.commit(t('typed')); }, 700);
      recheck(); drawMarks(); updateCounts(); updateLineInfo();
      root.clearTimeout(sideTimer); sideTimer = root.setTimeout(renderSide, 160);
    });
    ta.addEventListener('blur', flushCommit);
    ['keyup', 'click', 'select'].forEach(function (ev) { ta.addEventListener(ev, updateLineInfo); });
    ta.addEventListener('keydown', function (e) {
      var mod = e.ctrlKey || e.metaKey, k = String(e.key).toLowerCase();
      if (mod && (k === 'z' || k === 'y')) { e.preventDefault(); flushCommit(); clickCore(k === 'y' || e.shiftKey ? '.igs-redo' : '.igs-undo'); return; }
      if (mod && k === 's') { e.preventDefault(); flushCommit(); clickCore('[aria-keyshortcuts="Control+S Meta+S"]'); return; }
      if (e.key === 'F8') { e.preventDefault(); nextIssue(); }
    });
    function clickCore(selector) { var b = D.querySelector(selector); if (b && !b.disabled) b.click(); else ctx.announce(t(selector === '.igs-redo' ? 'nothingToRedo' : selector === '.igs-undo' ? 'nothingToUndo' : 'saved')); }
    function recheck() {
      lastChecks = check(doc()); issuesFlat = [];
      lastChecks.forEach(function (r) { r.issues.forEach(function (x) { issuesFlat.push(x); }); });
      issuesFlat.sort(function (a, b) { return a.a - b.a; });
      var okN = lastChecks.filter(function (r) { return !r.issues.length; }).length;
      badge.textContent = !lastChecks.length ? t('badgeNone') : okN === lastChecks.length ? t('badgeAll', { n: okN }) : t('badgeSome', { ok: okN, n: lastChecks.length, i: plural(t, issuesFlat.length) });
      badge.dataset.kind = !lastChecks.length ? 'none' : okN === lastChecks.length ? 'ok' : 'bad';
      ctx.setSummary(summary());
    }
    function updateCounts() {
      var st = stats(doc());
      counts.textContent = t('footCounts', { w: st.words, c: st.chars, l: st.lines });
    }
    function currentLine() {
      var pos = ta.selectionStart || 0, ls = lines(ta.value);
      for (var i = 0; i < ls.length; i++) if (pos <= ls[i].b) return { i: i, l: ls[i] };
      return { i: ls.length - 1, l: ls[ls.length - 1] };
    }
    function updateLineInfo() {
      var cl = currentLine(); if (!cl.l) { lineInfo.textContent = ''; return; }
      var d = doc(), txt = t('lineN', { n: cl.i + 1 });
      if (cl.l.t.trim()) {
        if (d.rules.haiku.on || d.rules.sonnet.on) { var m = meterOf(d, cl.l.t); txt += ' · ' + (d.lang === 'en' ? t('syllApprox', { n: m.count }) : t('syllMetric', { n: m.count })); }
        txt += ' · ' + t('wordsN', { n: words(cl.l.t).length });
      }
      lineInfo.textContent = txt;
    }

    /* ---------- Estructura: borradores y partes ---------- */
    function partsOf(d) {
      var R = d.rules;
      if (R.haiku.on || R.sonnet.on || R.acro.on) return { kind: 'line', list: verses(d.text) };
      return { kind: 'para', list: paragraphs(d.text) };
    }
    function renderStructure() {
      var out = [], ul = h('ul', { class: 'igs-list' });
      S.docs.forEach(function (d, i) {
        var b = h('button', { type: 'button', 'aria-current': String(i === S.cur) }, h('span', { class: 'igw-doc-ico', 'aria-hidden': 'true', text: '¶' }), h('span', { text: d.name || t('untitled') }), h('small', { text: t('wordsShort', { n: words(d.text).length }) }));
        b.addEventListener('click', function () { goDoc(i); }); ul.appendChild(h('li', null, b));
      });
      out.push(h('h3', { text: t('drafts') + ' (' + S.docs.length + ')' }), ul,
        h('div', { class: 'igs-actions' }, ctx.button(t('newDraft'), { icon: 'plus', onClick: newDraft }), ctx.button(t('dupDraft'), { icon: 'copy', onClick: dupDraft }),
          ctx.button(t('renameDraft'), { icon: 'pen', onClick: renameDraft }), ctx.button(t('delDraft'), { icon: 'trash', class: 'igs-danger', onClick: delDraft })));
      var P = partsOf(doc()), pl = h('ul', { class: 'igs-list' });
      var isStory = doc().rules.story.on;
      var storyCues = isStory ? cues(ctx_forLang(doc()), doc().rules.story.tpl) : [];
      P.list.slice(0, 80).forEach(function (p, i) {
        var kind = isStory && P.kind === 'para' ? 'part' : P.kind;
        var name = kind === 'line' ? t('verseN', { n: i + 1 }) : kind === 'part' ? (storyCues[i] ? t('partN', { n: i + 1 }) : t('paraN', { n: i + 1 })) : t('paraN', { n: i + 1 });
        var b = h('button', { type: 'button', 'aria-current': String(!!sel && sel.i === i) },
          h('span', { class: 'igw-part-n', 'aria-hidden': 'true', text: String(i + 1) }),
          h('span', { class: 'igw-part-t' }, h('span', { class: 'igs-sr', text: name + ': ' }), clip(p.t, 34)),
          h('small', { text: kind === 'line' ? t('syllShort', { n: meterOf(doc(), p.t).count }) : t('wordsShort', { n: words(p.t).length }) }));
        b.addEventListener('click', function () { selectPart(kind, i); });
        pl.appendChild(h('li', null, b));
      });
      out.push(h('h3', { text: P.kind === 'line' ? t('versesTitle') : isStory ? t('partsTitle') : t('parasTitle') }));
      if (P.list.length) out.push(pl); else out.push(h('p', { class: 'igs-muted', text: t('noParts') }));
      ctx.setStructure(out);
    }
    function selectPart(kind, i) {
      var P = partsOf(doc()), p = P.list[i]; if (!p) return;
      sel = { kind: kind, i: i };
      renderSide();
      try { ta.focus({ preventScroll: true }); } catch (_) { ta.focus(); }
      ta.setSelectionRange(p.a, p.b); scrollToOffset(p.a); updateLineInfo();
      ctx.announce(t('selected', { name: (kind === 'line' ? t('verseN', { n: i + 1 }) : t('paraN', { n: i + 1 })) + ': ' + clip(p.t, 80) }));
    }
    function goDoc(i) {
      flushCommit(); S.cur = Math.max(0, Math.min(S.docs.length - 1, i)); sel = null; loadDoc(); ctx.announce(t('draftOpened', { name: doc().name }));
    }
    function newDraft() { if (S.docs.length >= MAX_DOCS) { ctx.announce(t('tooManyDocs', { n: MAX_DOCS })); return; } flushCommit(); var d = normDoc({ id: nid(), name: t('draftN', { n: S.docs.length + 1 }), lang: doc().lang }, 0); d.rules = JSON.parse(JSON.stringify(doc().rules)); d.meter = JSON.parse(JSON.stringify(doc().meter)); S.docs.push(d); S.cur = S.docs.length - 1; sel = null; loadDoc(); ctx.commit(t('newDraft')); ctx.announce(t('draftCreated', { name: d.name })); root.setTimeout(function () { ta.focus(); }, 80); }
    function dupDraft() { if (S.docs.length >= MAX_DOCS) { ctx.announce(t('tooManyDocs', { n: MAX_DOCS })); return; } flushCommit(); var d = JSON.parse(JSON.stringify(doc())); d.id = nid(); d.name = t('copyOf', { name: doc().name }).slice(0, 120); S.docs.splice(S.cur + 1, 0, d); S.cur += 1; sel = null; loadDoc(); ctx.commit(t('dupDraft')); ctx.announce(t('draftDuplicated', { name: d.name })); }
    function delDraft() {
      if (S.docs.length < 2) { ctx.announce(t('lastDraft')); ctx.setStatus(t('lastDraft')); return; }
      flushCommit(); var name = doc().name; S.docs.splice(S.cur, 1); S.cur = Math.min(S.cur, S.docs.length - 1); sel = null; loadDoc(); ctx.commit(t('delDraft')); ctx.announce(t('draftDeleted', { name: name }));
    }
    var renameDlg = null;
    function renameDraft(trigger) {
      if (!renameDlg) renameDlg = ctx.dialog(t('renameDraft'));
      ctx.clear(renameDlg.body);
      var f = F.text(t('draftName'), doc().name, { max: 120 });
      var form = h('form', { class: 'igw-rename' }, f, h('div', { class: 'igs-actions' }, h('button', { type: 'submit', class: 'igs-btn igs-primary', text: t('renameOk') }), ctx.button(t('cancel'), { onClick: function () { renameDlg.close(); } })));
      form.addEventListener('submit', function (e) { e.preventDefault(); var v = String(f.input.value).trim().slice(0, 120); if (v) { doc().name = v; ctx.commit(t('renamed')); renderSide(); ctx.announce(t('renamedTo', { name: v })); } renameDlg.close(); });
      renameDlg.body.appendChild(form); renameDlg.open(trigger && trigger.nodeType ? trigger : D.activeElement); f.input.select();
    }

    /* ---------- Propiedades (inspector) ---------- */
    function keyed(el, k) { if (el && el.input) el.input.dataset.k = k; else if (el) el.dataset.k = k; return el; }
    function ruleBlock(id, R, params) {
      var box = h('div', { class: 'igw-rule', 'data-on': String(R[id].on) });
      box.appendChild(keyed(F.check(t('rule_' + id), R[id].on, { onChange: function (v) { R[id].on = v; commitRules(t(v ? 'ruleOn' : 'ruleOff', { r: t('rule_' + id) })); } }), 'on-' + id));
      box.appendChild(h('p', { class: 'igw-rule-help', text: t('ruleHelp_' + id) }));
      if (R[id].on && params) params.forEach(function (p) { box.appendChild(p); });
      return box;
    }
    function commitRules(label) { recheck(); drawMarks(); ctx.commit(label); renderSide(); ctx.announce(label + '. ' + badge.textContent); }
    function numField(label, obj, key, min, max, k, unit) { return keyed(F.number(label, obj[key], { min: min, max: max, step: 1, unit: unit, onChange: function (v) { obj[key] = Math.round(v); commitRules(t('ruleChanged')); } }), k); }
    function textField(label, obj, key, max, k) { return keyed(F.text(label, obj[key], { max: max, onChange: function (v) { obj[key] = String(v).slice(0, max); commitRules(t('ruleChanged')); } }), k); }
    function checkField(label, obj, key, k) { return keyed(F.check(label, obj[key], { onChange: function (v) { obj[key] = v; commitRules(t('ruleChanged')); } }), k); }
    function selField(label, obj, key, opts, k) { return keyed(F.select(label, obj[key], opts, { onChange: function (v) { obj[key] = v; commitRules(t('ruleChanged')); } }), k); }

    function issueList(r) {
      var ul = h('ul', { class: 'igw-issues' });
      r.issues.slice(0, 40).forEach(function (x, i) {
        var go = h('button', { type: 'button', class: 'igs-btn igw-go', 'aria-label': t('goTo', { what: x.text }) }, h('span', { class: 'igs-btn-label', text: t('go') }));
        go.addEventListener('click', function () { issueIx = issuesFlat.indexOf(x); goRange(x.a, x.b, x.text); });
        ul.appendChild(h('li', null, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: '!' }), h('span', { class: 'igw-issue-t' }, h('span', { class: 'igs-sr', text: t('checkWord') + ': ' }), x.text), go));
      });
      if (r.issues.length > 40) ul.appendChild(h('li', { class: 'igw-more' }, t('moreIssues', { n: r.issues.length - 40 })));
      return ul;
    }
    function checksView() {
      var out = [h('h4', { text: t('checksTitle') })];
      if (!lastChecks.length) { out.push(h('p', { class: 'igs-muted', text: t('noRules') })); return out; }
      var okN = lastChecks.filter(function (r) { return !r.issues.length; }).length;
      out.push(h('p', { class: 'igs-result', 'data-kind': okN === lastChecks.length ? 'ok' : 'bad' }, h('strong', { text: okN === lastChecks.length ? t('allOk') : t('someBad', { ok: okN, n: lastChecks.length }) }), issuesFlat.length ? t('issuesTotal', { i: plural(t, issuesFlat.length) }) : t('allOkD')));
      if (issuesFlat.length) out.push(h('div', { class: 'igs-actions' }, ctx.button(t('nextIssue'), { icon: 'warn', onClick: nextIssue, keys: 'F8' })));
      lastChecks.forEach(function (r) {
        var ok = !r.issues.length;
        var sec = h('section', { class: 'igw-check', 'data-ok': String(ok), 'aria-label': r.title },
          h('p', { class: 'igw-check-head' }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: ok ? '✓' : '!' }), h('span', { class: 'igs-sr', text: (ok ? t('okWord') : t('checkWord')) + ': ' }), h('strong', { text: r.title })));
        r.info.forEach(function (i) { sec.appendChild(h('p', { class: 'igw-check-info', text: i })); });
        if (!ok) sec.appendChild(issueList(r)); else sec.appendChild(h('p', { class: 'igw-check-info', text: t('ruleMet') }));
        out.push(sec);
      });
      return out;
    }
    function rulesView() {
      var d = doc(), R = d.rules, out = [h('h4', { text: t('rulesTitle') }), h('p', { class: 'igs-muted', text: t('rulesHelp') })];
      var blocks = {
        words: [selField(t('wordsMode'), R.words, 'mode', [['exact', t('mode_exact')], ['max', t('mode_max')], ['min', t('mode_min')]], 'wmode'), numField(t('wordsN2'), R.words, 'n', 1, 5000, 'wn')],
        chars: [numField(t('charsN'), R.chars, 'n', 1, MAX_TEXT, 'cn'), checkField(t('countSpaces'), R.chars, 'spaces', 'csp')],
        paras: [numField(t('parasN'), R.paras, 'n', 1, 200, 'pn')],
        lipo: [textField(t('lipoLetters'), R.lipo, 'letters', 12, 'll'), checkField(t('lipoAccents'), R.lipo, 'accents', 'la')],
        acro: [textField(t('acroWord'), R.acro, 'word', 40, 'aw')],
        tauto: [textField(t('tautoLetter'), R.tauto, 'letter', 1, 'tl'), checkField(t('tautoShort'), R.tauto, 'short', 'ts')],
        univ: [selField(t('univVowel'), R.univ, 'vowel', ['a', 'e', 'i', 'o', 'u'].map(function (v) { return [v, v]; }), 'uv')],
        pali: [selField(t('paliUnit'), R.pali, 'unit', [['letters', t('paliLetters')], ['words', t('paliWords')]], 'pu')],
        haiku: null, sonnet: null,
        story: [selField(t('storyTpl'), R.story, 'tpl', TEMPLATES.map(function (k) { return [k, t('tpl_' + k)]; }), 'st'),
          h('ol', { class: 'igw-cues' }, cues(ctx_forLang(d), R.story.tpl).map(function (c) { return h('li', { text: c + '…' }); })),
          checkField(t('storyCues'), R.story, 'cues', 'sc'), numField(t('storyMin'), R.story, 'min', 0, 500, 'sm'),
          h('div', { class: 'igs-actions' }, ctx.button(t('insertCues'), { icon: 'plus', onClick: function () { insertTemplate(R.story.tpl); } }))]
      };
      RULE_ORDER.forEach(function (id) { out.push(ruleBlock(id, R, blocks[id])); });
      if (R.haiku.on || R.sonnet.on) {
        out.push(h('p', { class: 'igs-field-group', text: t('meterTitle') }));
        if (d.lang === 'es') {
          out.push(keyed(F.check(t('meterSyn'), d.meter.syn, { onChange: function (v) { d.meter.syn = v; commitRules(t('ruleChanged')); } }), 'msyn'));
          out.push(keyed(F.check(t('meterAcc'), d.meter.acc, { onChange: function (v) { d.meter.acc = v; commitRules(t('ruleChanged')); } }), 'macc'));
          out.push(h('p', { class: 'igs-muted', text: t('meterHelpEs') }));
        } else out.push(h('p', { class: 'igs-muted', text: t('meterHelpEn') }));
      }
      return out;
    }
    function challengesView() {
      var box = h('div', { class: 'igs-actions igw-challenges' });
      [['micro50', 'chMicro'], ['lipo', 'chLipo'], ['spine', 'chStory']].forEach(function (c) {
        box.appendChild(ctx.button(t(c[1]), { icon: 'flag', onClick: function () { applyChallenge(c[0]); } }));
      });
      return [h('h4', { text: t('challengesTitle') }), h('p', { class: 'igs-muted', text: t('challengesHelp') }), box];
    }
    function applyChallenge(id) {
      var R = doc().rules;
      if (id === 'micro50') { R.words.on = true; R.words.n = 50; R.words.mode = 'exact'; }
      if (id === 'lipo') { R.lipo.on = true; R.lipo.letters = 'e'; R.lipo.accents = true; }
      if (id === 'spine') { R.story.on = true; R.story.tpl = 'spine'; R.story.cues = true; if (!doc().text.trim()) { insertTemplate('spine'); return; } }
      commitRules(t('challengeApplied', { c: t({ micro50: 'chMicro', lipo: 'chLipo', spine: 'chStory' }[id]) }));
    }
    function statsView() {
      var st = stats(doc()), d = doc();
      function row(k, v) { return h('tr', null, h('th', { scope: 'row', text: k }), h('td', { class: 'igs-numcell', text: v })); }
      var tb = h('table', { class: 'igs-table' }, h('caption', { text: t('statsCaption') }), h('tbody', null,
        row(t('stWords'), IG.num(st.words, 0)), row(t('stChars'), IG.num(st.chars, 0) + ' (' + t('noSpaces', { n: IG.num(st.charsNoSp, 0) }) + ')'),
        row(t('stSentences'), IG.num(st.sentences, 0)), row(t('stParas'), IG.num(st.paras, 0)), row(t('stLines'), IG.num(st.lines, 0)),
        row(t('stAvg'), IG.num(st.avg, 1) + ' ' + t('wordsUnit')), row(t('stLong'), IG.num(st.longW, 0) + ' (' + IG.num(st.longPct, 0) + ' %)'),
        row(t('stTime'), st.minutes < 1 ? t('lessMinute') : t('minutes', { n: IG.num(Math.round(st.minutes * 2) / 2, 1) }))));
      var out = [h('h4', { text: t('plainTitle') }), h('div', { class: 'igs-table-wrap' }, tb)];
      var notes = [];
      if (st.avg > 20) notes.push({ ok: false, text: t('plainAvgHigh', { n: IG.num(st.avg, 1) }) });
      else if (st.sentences) notes.push({ ok: true, text: t('plainAvgOk', { n: IG.num(st.avg, 1) }) });
      st.longSent.slice(0, 8).forEach(function (s) { notes.push({ ok: false, text: t('plainLongSentence', { n: s.n, s: clip(s.t, 40) }), a: s.a, b: s.b }); });
      if (notes.length) {
        var ul = h('ul', { class: 'igw-issues' });
        notes.forEach(function (x) {
          var li = h('li', { 'data-ok': String(x.ok) }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: x.ok ? '✓' : '!' }), h('span', { class: 'igw-issue-t' }, h('span', { class: 'igs-sr', text: (x.ok ? t('okWord') : t('checkWord')) + ': ' }), x.text));
          if (x.a !== undefined) { var go = h('button', { type: 'button', class: 'igs-btn igw-go', 'aria-label': t('goTo', { what: x.text }) }, h('span', { class: 'igs-btn-label', text: t('go') })); go.addEventListener('click', function () { goRange(x.a, x.b, x.text); }); li.appendChild(go); }
          ul.appendChild(li);
        });
        out.push(ul);
      }
      out.push(h('p', { class: 'igs-muted', text: t(d.lang === 'en' ? 'plainNoteEn' : 'plainNoteEs') }));
      return out;
    }
    function docView() {
      var d = doc();
      return [h('h4', { text: t('docTitle') }),
        keyed(F.text(t('draftName'), d.name, { max: 120, onChange: function (v) { v = String(v).trim().slice(0, 120); if (!v) return; d.name = v; ctx.commit(t('renamed')); renderSide(); } }), 'dname'),
        keyed(F.select(t('docLang'), d.lang, [['es', t('langEs')], ['en', t('langEn')]], { onChange: function (v) { d.lang = v === 'en' ? 'en' : 'es'; ta.setAttribute('lang', d.lang); commitRules(t('langChanged')); } }), 'dlang'),
        h('p', { class: 'igs-muted', text: t('docLangHelp') })];
    }
    function partView() {
      var P = partsOf(doc()), p = P.list[sel.i], d = doc();
      if (!p) { sel = null; return null; }
      var isLine = P.kind === 'line', out = [h('h4', { text: (isLine ? t('verseN', { n: sel.i + 1 }) : t('paraN', { n: sel.i + 1 })) })];
      out.push(h('blockquote', { class: 'igw-quote', lang: d.lang, text: clip(p.t, 400) }));
      var ul = h('dl', { class: 'igs-vars' });
      function item(k, v) { ul.appendChild(h('dt', { text: k })); ul.appendChild(h('dd', { text: v })); }
      if (isLine || d.rules.haiku.on || d.rules.sonnet.on) {
        var m = meterOf(d, p.t.split('\n')[0]);
        if (d.lang === 'es') {
          item(t('mGram'), String(m.gram)); item(t('mSyn'), String(m.syn)); item(t('mEnd'), t('kind_' + m.kind) + (m.adj ? ' (' + (m.adj > 0 ? '+' : '') + m.adj + ')' : ''));
          item(t('mMetric'), String(m.count)); if (m.alt !== null) item(t('mAlt'), String(m.alt)); item(t('mRhyme'), '-' + m.rhyme);
          out.push(ul, h('p', { class: 'igw-syll', lang: 'es' }, h('span', { class: 'igs-sr', text: t('syllDivision') + ': ' }), m.shown));
          out.push(h('p', { class: 'igs-muted', text: t('syllLegend') }));
        } else {
          item(t('mApprox'), String(m.count)); item(t('mRhyme'), '-' + m.rhyme);
          out.push(ul, h('p', { class: 'igw-syll', lang: 'en', text: m.shown }), h('p', { class: 'igs-muted', text: t('meterHelpEn') }));
        }
      } else {
        var ss = sentences(p.t), ws = words(p.t);
        item(t('stWords'), String(ws.length)); item(t('stSentences'), String(ss.length)); item(t('stAvg'), IG.num(ss.length ? ws.length / ss.length : 0, 1));
        out.push(ul);
      }
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('selectInText'), { icon: 'select', onClick: function () { goRange(p.a, p.b, t('selectedPart')); } }), ctx.button(t('backToDoc'), { icon: 'file', onClick: function () { sel = null; renderSide(); ctx.announce(t('deselected')); } })));
      return out;
    }
    var FOCUS_KEY = null;
    function renderSide() {
      var active = D.activeElement, k = active && ctx.inspector.contains(active) ? active.dataset.k : null;
      renderStructure();
      nameEl.textContent = t('quoted', { s: doc().name || t('untitled') });
      var out = [];
      if (sel) { var pv = partView(); if (pv) out = out.concat(pv); }
      out = out.concat(checksView(), rulesView(), challengesView(), statsView(), docView());
      ctx.setInspector(out);
      if (k || FOCUS_KEY) { var el = ctx.inspector.querySelector('[data-k="' + (k || FOCUS_KEY) + '"]'); if (el) { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } } FOCUS_KEY = null; }
      ctx.setSummary(summary());
    }
    function summary() {
      var d = doc(), st = stats(d), active = lastChecks.map(function (r) { return r.title + (r.issues.length ? ' (' + plural(t, r.issues.length) + ')' : ' (' + t('okWord') + ')'); });
      return t('summary', { name: d.name || t('untitled'), n: S.cur + 1, total: S.docs.length, w: st.words, s: st.sentences, l: st.lines }) + ' ' +
        (active.length ? t('summaryRules', { list: active.join('; ') }) : t('noRules')) + (d.text.trim() ? ' ' + t('summaryStart', { s: clip(d.text, 160) }) : ' ' + t('emptyDoc'));
    }

    /* ---------- Plantillas de cuento ---------- */
    function insertTemplate(tpl) {
      var d = doc(), cs = cues(ctx_forLang(d), tpl);
      var block = cs.map(function (c) { return c + '…'; }).join('\n\n');
      var base = d.text.replace(/\s+$/, '');
      d.text = (base ? base + '\n\n' : '') + block;
      d.rules.story.on = true; d.rules.story.tpl = tpl;
      loadDoc(); ctx.commit(t('templateInserted', { tpl: t('tpl_' + tpl) }));
      var first = d.text.length - block.length;
      goRange(first + cs[0].length, first + cs[0].length + 1, t('templateInserted', { tpl: t('tpl_' + tpl) }));
    }
    var tplDlg = null;
    function templateDialog(trigger) {
      if (!tplDlg) tplDlg = ctx.dialog(t('templateTitle'), { wide: true });
      ctx.clear(tplDlg.body);
      tplDlg.body.appendChild(h('p', { class: 'igs-muted', text: t('templateHelp') }));
      var list = h('ul', { class: 'igs-starts' });
      TEMPLATES.forEach(function (k) {
        var b = h('button', { type: 'button', class: 'igs-start' }, h('strong', { text: t('tpl_' + k) }), h('span', { text: t('tplDesc_' + k) }), h('span', { class: 'igw-tpl-cues', text: cues(ctx_forLang(doc()), k).join(' · ') }));
        b.addEventListener('click', function () { tplDlg.close(); insertTemplate(k); });
        list.appendChild(h('li', null, b));
      });
      tplDlg.body.appendChild(list); tplDlg.open(trigger);
    }

    /* ---------- Exportaciones ---------- */
    function slug(s) { return fold(s).replace(/ñ/g, 'n').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'texto'; }
    function fname(ext) { return (LANG === 'en' ? 'writing' : 'escritura') + '-' + slug(doc().name) + '-' + ctx.stamp() + ext; }
    function rulesText(d) {
      return check(d).map(function (r) { return r.title + ': ' + (r.issues.length ? plural(t, r.issues.length) : t('ruleMet')); });
    }
    function mdFor(d) {
      var body = paragraphs(d.text).map(function (p) { return p.t.split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('  \n'); }).join('\n\n');
      var rl = rulesText(d);
      return '# ' + (d.name || t('untitled')) + '\n\n' + body + '\n' + (rl.length ? '\n---\n\n**' + t('rulesTitle') + '**\n\n' + rl.map(function (x) { return '- ' + x; }).join('\n') + '\n' : '') + '\n_' + CREDIT + '_\n';
    }
    function htmlBody(d) {
      return paragraphs(d.text).map(function (p) { return '<p>' + p.t.split('\n').map(esc).join('<br>\n') + '</p>'; }).join('\n');
    }
    function exportTxt() { var d = doc(); ctx.download(new Blob([d.text.replace(/\s+$/, '') + '\n\n— ' + CREDIT + '\n'], { type: 'text/plain;charset=utf-8' }), fname('.txt')); }
    function exportMd() { ctx.download(new Blob([mdFor(doc())], { type: 'text/markdown;charset=utf-8' }), fname('.md')); }
    function exportAllMd() { var all = S.docs.map(mdFor).join('\n\n'); ctx.download(new Blob([all], { type: 'text/markdown;charset=utf-8' }), (LANG === 'en' ? 'writing-drafts-' : 'escritura-borradores-') + ctx.stamp() + '.md'); }
    function exportHtml() {
      var d = doc(), rl = rulesText(d), title = esc(d.name || t('untitled'));
      var html = '<!DOCTYPE html>\n<html lang="' + d.lang + '">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>' + title + '</title>\n' +
        '<style>body{margin:0;background:#fff;color:#172b42;font:1.15rem/1.7 "Atkinson Hyperlegible",Georgia,serif}main{max-width:38rem;margin:0 auto;padding:2rem 1.25rem 3rem}h1{font-size:1.8rem;line-height:1.25;margin:0 0 1.5rem}p{margin:0 0 1.1em}' +
        'aside{margin-top:2.5rem;padding-top:1rem;border-top:1px solid #c9d8e6;font-size:.95rem;color:#44586c}aside h2{font-size:1rem;margin:0 0 .4rem}footer{margin-top:2rem;font-size:.85rem;color:#44586c}</style>\n</head>\n<body>\n<main>\n<article>\n<h1>' + title + '</h1>\n' +
        htmlBody(d) + '\n</article>\n' + (rl.length ? '<aside aria-labelledby="reglas">\n<h2 id="reglas">' + esc(t('rulesTitle')) + '</h2>\n<ul>\n' + rl.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('\n') + '\n</ul>\n</aside>\n' : '') +
        '<footer><p>' + esc(CREDIT) + '</p></footer>\n</main>\n</body>\n</html>\n';
      ctx.download(new Blob([html], { type: 'text/html;charset=utf-8' }), fname('.html'));
    }
    function printDoc() {
      flushCommit();
      var d = doc(), art = h('article', { class: 'igw-print', lang: d.lang }, h('h1', { text: d.name || t('untitled') }));
      paragraphs(d.text).forEach(function (p) { var para = h('p'); p.t.split('\n').forEach(function (l, i) { if (i) para.appendChild(h('br')); para.appendChild(D.createTextNode(l)); }); art.appendChild(para); });
      var rl = rulesText(d);
      if (rl.length) art.appendChild(h('aside', null, h('h2', { text: t('rulesTitle') }), h('ul', null, rl.map(function (x) { return h('li', { text: x }); }))));
      art.appendChild(h('footer', { text: CREDIT }));
      ctx.printPages([art]); ctx.announce(t('printing'));
    }
    ctx.addExport(t('exportTxt'), exportTxt, 'file');
    ctx.addExport(t('exportMd'), exportMd, 'file');
    ctx.addExport(t('exportHtml'), exportHtml, 'code');
    ctx.addExport(t('exportPrint'), printDoc, 'file');
    ctx.addExport(t('exportAllMd'), exportAllMd, 'layers');

    /* ---------- Herramientas y órdenes ---------- */
    var marksBtn = ctx.button(t('marksBtn'), { icon: 'eye', pressed: ui.marks });
    marksBtn.addEventListener('click', toggleMarks);
    function toggleMarks() { ui.marks = !ui.marks; marksBtn.setAttribute('aria-pressed', String(ui.marks)); applyUi(); drawMarks(); ctx.announce(t(ui.marks ? 'marksOn' : 'marksOff')); }
    function fontSize(dx) { ui.size = Math.max(14, Math.min(32, ui.size + dx)); applyUi(); drawMarks(); ctx.announce(t('fontSizeNow', { n: ui.size })); }
    var fontSel = h('label', { class: 'igs-inline-select' }, h('span', { text: t('editorFont') }));
    var fsel = h('select', null, ['atkinson', 'serif', 'mono'].map(function (k) { var o = h('option', { value: k, text: t('font_' + k) }); if (k === ui.font) o.selected = true; return o; }));
    fsel.addEventListener('change', function () { ui.font = fsel.value; applyUi(); drawMarks(); });
    fontSel.appendChild(fsel);
    ctx.setTools([
      { id: 'next', label: t('nextIssue'), icon: 'warn', action: nextIssue, primary: true, title: 'F8' },
      { node: marksBtn },
      { id: 'tpl', label: t('templateBtn'), icon: 'layers', action: templateDialog },
      { id: 'new', label: t('newDraft'), icon: 'plus', action: newDraft },
      { id: 'dup', label: t('dupDraft'), icon: 'copy', action: dupDraft, level: 'more' },
      { id: 'bigger', label: t('fontBigger'), icon: 'plus', action: function () { fontSize(2); }, level: 'more' },
      { id: 'smaller', label: t('fontSmaller'), icon: 'minus', action: function () { fontSize(-2); }, level: 'more' },
      { node: fontSel, level: 'more' }
    ]);
    ctx.command('next', t('nextIssue'), 'F8', nextIssue);
    ctx.command('marks', t('marksBtn'), '', toggleMarks);
    ctx.command('template', t('templateBtn'), t('templateHelp'), function () { templateDialog(D.activeElement); });
    ctx.command('newDraft', t('newDraft'), t('drafts'), newDraft);
    ctx.command('dupDraft', t('dupDraft'), t('drafts'), dupDraft);
    ctx.command('rename', t('renameDraft'), t('drafts'), function () { renameDraft(D.activeElement); });
    ctx.command('write', t('focusEditor'), '', function () { ta.focus(); });
    ctx.command('bigger', t('fontBigger'), '', function () { fontSize(2); });
    ctx.command('smaller', t('fontSmaller'), '', function () { fontSize(-2); });
    ctx.command('txt', t('exportTxt'), t('fileMenu'), exportTxt);
    ctx.command('md', t('exportMd'), t('fileMenu'), exportMd);
    ctx.command('html', t('exportHtml'), t('fileMenu'), exportHtml);
    ctx.command('print', t('exportPrint'), t('fileMenu'), printDoc);

    /* ---------- Carga ---------- */
    function loadDoc() {
      var d = doc();
      if (ta.value !== d.text) { var pos = ta.selectionStart; ta.value = d.text; try { ta.setSelectionRange(Math.min(pos, d.text.length), Math.min(pos, d.text.length)); } catch (_) {} }
      ta.setAttribute('lang', d.lang);
      recheck(); drawMarks(); updateCounts(); updateLineInfo(); renderSide();
    }
    function example(id) {
      var d = normDoc({ id: 'd1', name: t('ex_' + id + '_name'), text: t('ex_' + id), lang: LANG }, 0), R = d.rules;
      if (id === 'acro') { R.acro.on = true; R.acro.word = t('ex_acro_word'); }
      if (id === 'micro50') { R.words.on = true; R.words.n = 50; }
      if (id === 'sonnet') { R.sonnet.on = true; }
      if (id === 'lipo') { R.lipo.on = true; R.lipo.letters = 'e'; }
      if (id === 'spine') { R.story.on = true; R.story.tpl = 'spine'; }
      if (id === 'three') { R.story.on = true; R.story.tpl = 'three'; R.paras.on = true; R.paras.n = 3; }
      if (id === 'haiku') { R.haiku.on = true; }
      if (id === 'tauto') { R.tauto.on = true; }
      if (id === 'univ') { R.univ.on = true; R.univ.vowel = 'a'; }
      if (id === 'pali') { R.pali.on = true; }
      return d;
    }

    function validate(d) {
      if (!d || !Array.isArray(d.docs) || !d.docs.length || d.docs.length > MAX_DOCS) return false;
      if (typeof d.cur !== 'number' || d.cur < 0 || d.cur >= d.docs.length) return false;
      return d.docs.every(function (x) { return x && typeof x.text === 'string' && x.text.length <= MAX_TEXT && typeof x.name === 'string' && x.name.length <= 120 && (!x.rules || typeof x.rules === 'object'); });
    }
    loadDoc();
    return {
      serialize: function () { return JSON.parse(JSON.stringify({ v: 1, cur: S.cur, docs: S.docs })); },
      validate: validate,
      restore: function (st) {
        S = { v: 1, cur: Math.min(st.cur || 0, st.docs.length - 1), docs: st.docs.map(normDoc) };
        S.docs.forEach(function (x) { var n = parseInt(String(x.id).replace(/\D/g, ''), 10); if (n > seq) seq = n; });
        if (sel && !partsOf(doc()).list[sel.i]) sel = null;
        loadDoc();
      },
      start: function (id) {
        seq = 1; sel = null;
        S = { v: 1, cur: 0, docs: [id === 'empty' ? normDoc({ id: 'd1', name: t('draftN', { n: 1 }) }, 0) : example(id)] };
        loadDoc();
      },
      onKey: function (e) { if (e.key === 'F8') { nextIssue(); return true; } if (e.key === 'Escape' && sel) { sel = null; renderSide(); ctx.announce(t('deselected')); return true; } return false; }
    };
  }

  /* Pruebas en Node o consola: IGSuite.Escritura.meterEs('verso', {syn:true, acc:true}) */
  IG.Escritura = { syllabifyEs: syllabifyEs, meterEs: meterEs, meterEn: meterEn, syllablesEn: syllablesEn, words: words };
})(window);
