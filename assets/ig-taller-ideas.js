/* Iris Green · El taller · Estudio de ideas e inventos.
   Las seis mesas de calentamiento (ig-taller-lab.js), el método SCAMPER y la ficha de invento con
   restricciones reales de coste, tamaño y peso. Todo se guarda en un archivo propio. */
(function (window, document) {
  'use strict';
  var T = window.IGT; if (!T) return;
  var t = T.t, h = T.h;
  var LETTERS = ['S', 'C', 'A', 'M', 'P', 'E', 'R'];

  function blankInv() {
    return { name: '', problem: '', who: '', how: '', test: '', better: '', size: ['', '', ''], parts: [], brief: null };
  }

  T.ready(function () {
    var app = T.mount(); if (!app || app.getAttribute('data-studio') !== 'ideas') return;
    var CH = T.dict.challenges || [];
    var doc = { title: '', scamper: { object: '', answers: ['', '', '', '', '', '', ''] }, inv: blankInv() };
    var history = new T.History(function () { return doc; }, function (d) { doc = d; renderAll(); }, function () { if (bar) bar.sync(); });

    var retos = T.challenges({ items: CH, onPick: onPick });
    var bar = T.projectBar({ studio: 'ideas', history: history,
      getData: function () { var lab = window.IGL && window.IGL.store ? window.IGL.store.get('ig-taller-lab-' + T.lang) : null; return { doc: doc, lab: lab }; },
      getTitle: function () { return doc.inv.name || doc.title; },
      onNew: function () { doc = { title: '', scamper: { object: '', answers: ['', '', '', '', '', '', ''] }, inv: blankInv() }; if (window.IGL) { window.IGL.store.del('ig-taller-lab-' + T.lang); if (window.IGL.remount) window.IGL.remount(); } history.reset(); T.markClean(); renderAll(); T.say(t('iNewDone')); },
      onOpen: function (d) {
        if (!d || !d.doc || !d.doc.inv || !d.doc.scamper) throw new Error('bad');
        doc = sanitize(d.doc);
        if (d.lab && window.IGL) { window.IGL.store.set('ig-taller-lab-' + T.lang, d.lab); if (window.IGL.remount) window.IGL.remount(); }
        history.reset(); renderAll();
      } });
    if (window.IGL) window.IGL.onChange = function () { T.markDirty(); };

    function str(v, n) { return String(v === undefined || v === null ? '' : v).slice(0, n || 600); }
    function sanitize(d) {
      var inv = d.inv || {}, sc = d.scamper || {};
      return { title: str(d.title, 80),
        scamper: { object: str(sc.object, 80), answers: LETTERS.map(function (_, i) { return str((sc.answers || [])[i], 1200); }) },
        inv: { name: str(inv.name, 80), problem: str(inv.problem), who: str(inv.who), how: str(inv.how, 1200), test: str(inv.test), better: str(inv.better),
          size: [0, 1, 2].map(function (i) { return str((inv.size || [])[i], 8); }),
          parts: (Array.isArray(inv.parts) ? inv.parts : []).slice(0, 60).map(function (p) { return { name: str(p.name, 60), qty: str(p.qty, 6), price: str(p.price, 8), weight: str(p.weight, 8) }; }),
          brief: inv.brief && typeof inv.brief === 'object' ? { text: str(inv.brief.text, 400), budget: +inv.brief.budget || 0, size: (inv.brief.size || []).slice(0, 3).map(Number), weight: +inv.brief.weight || 0, minParts: +inv.brief.minParts || 0, extra: str(inv.brief.extra, 200) } : null } };
    }
    function edit(fn) { var before = history.snapshot(); fn(); history.commit(before); }
    function numv(v) { var n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : 0; }

    /* ---------- Las seis mesas ---------- */
    var labSec = h('section', { class: 'igt-sec glass', 'aria-labelledby': 'igt-i-lab' },
      h('h2', { id: 'igt-i-lab', text: t('iLabTitle') }), h('p', { class: 'igt-note', text: t('iLabNote') }));
    var mount = document.getElementById('igl-mount');
    if (mount) labSec.appendChild(mount);

    /* ---------- SCAMPER ---------- */
    var scSec = h('section', { class: 'igt-sec glass', 'aria-labelledby': 'igt-i-sc' });
    var objIn = h('input', { type: 'text', id: 'igt-i-obj', maxlength: 80, autocomplete: 'off' });
    objIn.addEventListener('change', function () { edit(function () { doc.scamper.object = objIn.value.trim(); }); renderScamper(); });
    var scList = h('div', { class: 'igt-scamper' });
    var scCount = h('p', { class: 'igt-note', 'aria-live': 'off' });
    scSec.appendChild(h('h2', { id: 'igt-i-sc', text: t('iScTitle') }));
    scSec.appendChild(h('p', { class: 'igt-note', text: t('iScNote') }));
    scSec.appendChild(h('div', { class: 'igt-bar' }, h('label', { class: 'igt-field', for: 'igt-i-obj' }, t('iScObject'), objIn),
      T.btn(t('iScSuggest'), { icon: 'reiniciar', onClick: function () { var pool = t('iScObjects').split('|'); var o = pool[Math.floor(Math.random() * pool.length)]; edit(function () { doc.scamper.object = o; }); renderScamper(); T.say(t('iScObject') + ': ' + o); } })));
    scSec.appendChild(scList); scSec.appendChild(scCount);
    function ideasCount(text) { return String(text).split(/\n+/).filter(function (x) { return x.trim().length > 1; }).length; }
    function renderScamper() {
      objIn.value = doc.scamper.object; T.clear(scList);
      var obj = doc.scamper.object || t('iScThis');
      LETTERS.forEach(function (L, i) {
        var ta = h('textarea', { id: 'igt-i-sc' + i, rows: 3, maxlength: 1200, 'aria-describedby': 'igt-i-sch' + i });
        ta.value = doc.scamper.answers[i];
        ta.addEventListener('change', function () { edit(function () { doc.scamper.answers[i] = ta.value; }); scCount.textContent = t('iScCount', { n: totalIdeas() }); });
        scList.appendChild(h('div', { class: 'igt-sc-item' },
          h('label', { for: 'igt-i-sc' + i, class: 'igt-field' }, h('span', { class: 'igt-sc-letter', 'aria-hidden': 'true', text: L }), t('iSc_' + L)),
          h('p', { class: 'igt-note', id: 'igt-i-sch' + i, text: t('iScQ_' + L, { o: obj }) }), ta));
      });
      scCount.textContent = t('iScCount', { n: totalIdeas() });
    }
    function totalIdeas() { return doc.scamper.answers.reduce(function (a, x) { return a + ideasCount(x); }, 0); }

    /* ---------- Ficha de invento ---------- */
    var invSec = h('section', { class: 'igt-sec glass', 'aria-labelledby': 'igt-i-inv' });
    var briefBox = h('div', { class: 'igt-brief igt-encargo' });
    var fields = {};
    function field(key, rows, maxl) {
      var id = 'igt-i-' + key, el = rows ? h('textarea', { id: id, rows: rows, maxlength: maxl || 600 }) : h('input', { type: 'text', id: id, maxlength: maxl || 80, autocomplete: 'off' });
      el.addEventListener('change', function () { edit(function () { doc.inv[key] = el.value; }); renderChecks(); });
      fields[key] = el;
      return h('label', { class: 'igt-field', for: id }, t('iF_' + key), el);
    }
    var sizeIns = [0, 1, 2].map(function (i) {
      var el = h('input', { type: 'number', id: 'igt-i-size' + i, min: 0, step: 0.5, inputmode: 'decimal', 'aria-label': t('iSize_' + i) });
      el.addEventListener('change', function () { edit(function () { doc.inv.size[i] = el.value; }); renderTotals(); });
      return el;
    });
    var partsBody = h('tbody');
    var totalsBox = h('p', { class: 'igt-visible-status', 'aria-live': 'polite' });
    var checksBox = h('div', { 'aria-live': 'polite' });
    invSec.appendChild(h('h2', { id: 'igt-i-inv', text: t('iInvTitle') }));
    invSec.appendChild(h('p', { class: 'igt-note', text: t('iInvNote') }));
    invSec.appendChild(briefBox);
    invSec.appendChild(h('div', { class: 'igt-grid2' }, field('name'), field('who', 2), field('problem', 3), field('how', 4, 1200), field('test', 3), field('better', 3)));
    invSec.appendChild(h('fieldset', { class: 'igt-fieldset' }, h('legend', { text: t('iSizeLegend') }),
      h('div', { class: 'igt-bar' }, sizeIns.map(function (el, i) { return h('label', { class: 'igt-field', for: 'igt-i-size' + i }, t('iSize_' + i), el); }))));
    invSec.appendChild(h('h3', { text: t('iPartsTitle') }));
    invSec.appendChild(h('p', { class: 'igt-note', text: t('iPartsNote') }));
    invSec.appendChild(h('div', { class: 'igt-table-wrap', role: 'region', tabindex: '0', 'aria-labelledby': 'igt-i-pcap' },
      h('table', { class: 'igt-table' }, h('caption', { id: 'igt-i-pcap', text: t('iPartsCap') }),
        h('thead', null, h('tr', null, [t('iThPart'), t('iThQty'), t('iThPrice'), t('iThWeight'), t('iThDel')].map(function (x) { return h('th', { scope: 'col', text: x }); }))), partsBody)));
    invSec.appendChild(h('div', { class: 'igt-bar' }, T.btn(t('iAddPart'), { icon: 'mas', onClick: function () { edit(function () { doc.inv.parts.push({ name: '', qty: '1', price: '', weight: '' }); }); renderParts(); var ins = partsBody.querySelectorAll('input'); if (ins.length) ins[ins.length - 4].focus(); } })));
    invSec.appendChild(totalsBox);
    invSec.appendChild(checksBox);

    function renderParts() {
      T.clear(partsBody);
      doc.inv.parts.forEach(function (p, i) {
        function cell(k, type, label) {
          var el = h('input', { type: type, value: p[k], 'aria-label': t(label, { n: i + 1 }), min: type === 'number' ? 0 : null, step: type === 'number' ? 'any' : null, inputmode: type === 'number' ? 'decimal' : null, maxlength: type === 'text' ? 60 : null });
          el.addEventListener('change', function () { edit(function () { p[k] = el.value; }); renderTotals(); });
          return h('td', null, el);
        }
        partsBody.appendChild(h('tr', null, cell('name', 'text', 'iAriaPart'), cell('qty', 'number', 'iAriaQty'), cell('price', 'number', 'iAriaPrice'), cell('weight', 'number', 'iAriaWeight'),
          h('td', null, T.btn(t('iDelPart', { n: i + 1 }), { icon: 'borrar', cls: 'icon-only danger', onClick: function () { edit(function () { doc.inv.parts.splice(i, 1); }); renderParts(); T.say(t('iPartDeleted')); } }))));
      });
      if (!doc.inv.parts.length) partsBody.appendChild(h('tr', null, h('td', { colspan: 5, class: 'igt-note', text: t('iNoParts') })));
      renderTotals();
    }
    function totals() {
      var cost = 0, weight = 0, n = 0;
      doc.inv.parts.forEach(function (p) { var q = numv(p.qty) || 0; cost += q * numv(p.price); weight += q * numv(p.weight); if (p.name.trim()) n += 1; });
      return { cost: cost, weight: weight, n: n, size: doc.inv.size.map(numv) };
    }
    function renderTotals() {
      var tt = totals();
      totalsBox.textContent = t('iTotals', { c: T.num(tt.cost, 2), w: T.num(tt.weight, 0), n: tt.n, s: tt.size.map(function (v) { return T.num(v, 1); }).join(' × ') });
      renderChecks();
    }
    function renderBrief() {
      T.clear(briefBox);
      var b = doc.inv.brief;
      if (!b) { briefBox.appendChild(h('p', { class: 'igt-brief-k', text: t('iNoBrief') })); briefBox.appendChild(h('p', { text: t('iNoBriefText') })); return; }
      briefBox.appendChild(h('p', { class: 'igt-brief-k', text: t('iBriefK') }));
      briefBox.appendChild(h('p', { text: b.text }));
      var lim = [];
      if (b.budget) lim.push(t('iLimBudget', { v: T.num(b.budget, 2) }));
      if (b.size && b.size.length === 3) lim.push(t('iLimSize', { v: b.size.map(function (v) { return T.num(v, 0); }).join(' × ') }));
      if (b.weight) lim.push(t('iLimWeight', { v: T.num(b.weight, 0) }));
      if (b.minParts) lim.push(t('iLimParts', { v: b.minParts }));
      if (b.extra) lim.push(b.extra);
      briefBox.appendChild(h('ul', { class: 'igt-limits', 'aria-label': t('limits') }, lim.map(function (x) { return h('li', { text: x }); })));
    }
    function renderChecks() {
      T.clear(checksBox);
      var b = doc.inv.brief, tt = totals(), out = [];
      function add(ok, txt) { out.push([ok, txt]); }
      ['name', 'problem', 'who', 'how', 'test'].forEach(function (k) { add(String(doc.inv[k]).trim().length > 2, t('iChkField', { f: t('iF_' + k) })); });
      if (b) {
        if (b.budget) add(tt.cost > 0 && tt.cost <= b.budget + 1e-9, t('iChkBudget', { c: T.num(tt.cost, 2), m: T.num(b.budget, 2) }));
        if (b.size && b.size.length === 3) {
          var mine = tt.size.slice().sort(function (p, q) { return q - p; }), lim = b.size.slice().sort(function (p, q) { return q - p; });
          add(mine.every(function (v) { return v > 0; }) && mine.every(function (v, i) { return v <= lim[i] + 1e-9; }), t('iChkSize', { s: tt.size.map(function (v) { return T.num(v, 1); }).join(' × '), m: b.size.map(function (v) { return T.num(v, 0); }).join(' × ') }));
        }
        if (b.weight) add(tt.weight > 0 && tt.weight <= b.weight + 1e-9, t('iChkWeight', { w: T.num(tt.weight, 0), m: T.num(b.weight, 0) }));
        if (b.minParts) add(tt.n >= b.minParts, t('iChkParts', { n: tt.n, m: b.minParts }));
      }
      var ch = retos.current();
      if (ch && ch.rules && ch.rules.scamper) add(doc.scamper.answers.filter(function (x) { return ideasCount(x) >= ch.rules.scamper; }).length === 7, t('iChkScamper', { m: ch.rules.scamper }));
      var all = out.every(function (x) { return x[0]; });
      checksBox.appendChild(h('h3', { text: t('iChecksTitle') }));
      checksBox.appendChild(T.result(all, all ? t('iAllOk') : t('iSomeOk')));
      checksBox.appendChild(h('ul', { class: 'igt-limits igt-checks', role: 'list' }, out.map(function (x) { return h('li', { text: (x[0] ? '✓ ' : '· ') + x[1] }); })));
    }

    /* Retos: encargos con límites; el último genera encargos sin fin */
    function onPick(ch) {
      if (!ch) return null;
      if (ch.brief || ch.random) {
        var b = ch.random ? randomBrief() : { text: ch.brief.text, budget: ch.brief.budget || 0, size: ch.brief.size || [], weight: ch.brief.weight || 0, minParts: ch.brief.minParts || 0, extra: ch.brief.extra || '' };
        edit(function () { doc.inv.brief = b; });
        renderBrief(); renderChecks();
        var w = h('div', { class: 'igt-bar igt-noprint' });
        if (ch.random) w.appendChild(T.btn(t('iAnotherBrief'), { icon: 'reiniciar', onClick: function () { edit(function () { doc.inv.brief = randomBrief(); }); renderBrief(); renderChecks(); T.say(doc.inv.brief.text); } }));
        w.appendChild(T.btn(t('iGoSheet'), { onClick: function () { invSec.scrollIntoView({ block: 'start' }); fields.name.focus(); } }));
        return w;
      }
      if (ch.rules && ch.rules.scamper) {
        if (ch.object) { edit(function () { doc.scamper.object = ch.object; }); renderScamper(); }
        renderChecks();
        return h('div', { class: 'igt-bar igt-noprint' }, T.btn(t('iGoScamper'), { onClick: function () { scSec.scrollIntoView({ block: 'start' }); objIn.focus(); } }));
      }
      return null;
    }
    function randomBrief() {
      var pools = t('iRandPools').split('||').map(function (p) { return p.split('|'); });
      var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
      var budget = pick([3, 5, 8, 10, 12, 15, 20, 30]), s = pick([[10, 10, 5], [20, 15, 10], [30, 20, 12], [40, 30, 20], [60, 40, 30]]), w = pick([100, 250, 500, 1000, 2000]);
      return { text: t('iRandText', { p: pick(pools[0]), who: pick(pools[1]), where: pick(pools[2]) }), budget: budget, size: s, weight: w, minParts: pick([2, 3, 4, 5]), extra: pick(pools[3]) };
    }

    function renderAll() {
      renderScamper(); renderBrief(); renderParts();
      Object.keys(fields).forEach(function (k) { fields[k].value = doc.inv[k]; });
      sizeIns.forEach(function (el, i) { el.value = doc.inv.size[i]; });
      renderChecks();
    }

    app.appendChild(retos);
    app.appendChild(h('div', { class: 'igt-topbar glass' }, bar));
    app.appendChild(labSec);
    scSec.classList.add('igt-print-keep'); invSec.classList.add('igt-print-keep');
    app.appendChild(scSec);
    app.appendChild(invSec);
    history.bindKeys(document);
    renderAll();
  });
})(window, document);
