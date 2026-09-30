/* Iris Green · El taller · Lanzador (R47/R69).
   R69 gives age ownership to the single global IGAudience lens. Historical
   ?para=/ ?for= remains only as no-global-shell fallback for direct old links.
   «Todos los estudios» is secondary and the child-safe classifier remains local,
   without identity, storage or network. */
(function () {
  'use strict';
  var D = document, main = D.querySelector('main.igk'); if (!main) return;
  var I = {}; try { I = JSON.parse(D.getElementById('igk-i18n').textContent); } catch (_) {}
  var en = D.documentElement.lang === 'en', key = I.key || (en ? 'for' : 'para');
  var CS = window.IGChildSafe;
  function fold(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function fmt(s, v) { return String(s || '').replace(/\{(\w+)\}/g, function (_, k) { return v[k] == null ? '' : v[k]; }); }

  /* ---------- Etapa: una sola fuente global ---------- */
  var CANON = { age_0_12:'AGE_0_12', age_13_17:'AGE_13_17', age_18_plus:'AGE_18_PLUS', all_ages:'ALL_AGES' };
  var LEGACY = { infancia:'AGE_0_12', adolescencia:'AGE_13_17', adultez:'AGE_18_PLUS', childhood:'AGE_0_12', adolescence:'AGE_13_17', adulthood:'AGE_18_PLUS', any:'ALL_AGES' };
  var q = new URLSearchParams(location.search), raw = fold(q.get(key) || q.get(en ? 'para' : 'for') || '');
  var fallbackStage = CANON[raw] || LEGACY[raw] || 'ALL_AGES';
  function globalStage(){return window.IGAudience&&window.IGAudience.get?window.IGAudience.get():null;}
  function startStage(value){return value==='AGE_0_12'||value==='AGE_13_17'||value==='AGE_18_PLUS'?value:'ALL_AGES';}
  var stage = startStage(globalStage()||fallbackStage);
  function syncStage(value){
    stage=startStage(value||fallbackStage);
    main.querySelectorAll('.igk-start').forEach(function (ul) { ul.hidden = ul.getAttribute('data-para') !== stage; });
  }
  syncStage(stage);
  function withStage(href) {
    var base=href.split('?')[0];
    if(globalStage())return base;
    return stage && stage!=='ALL_AGES' ? base + '?' + key + '=' + encodeURIComponent(stage) : base;
  }
  main.querySelectorAll('a.igk-tile').forEach(function (a) {
    if(!a.dataset.igkBaseHref)a.dataset.igkBaseHref=a.getAttribute('href').split('?')[0];
    a.setAttribute('href',withStage(a.dataset.igkBaseHref));
  });
  window.addEventListener('ig:audience-change',function(){
    syncStage(globalStage()||'GENERAL');
    main.querySelectorAll('a.igk-tile').forEach(function(a){a.setAttribute('href',withStage(a.dataset.igkBaseHref||a.getAttribute('href')));});
  });

  /* ---------- Protección infantil: filtrar antes de mostrar ---------- */
  var items = Array.prototype.slice.call(main.querySelectorAll('.igk-all .igk-item'));
  function meta(li) {
    return { id: li.querySelector('[data-studio]') ? li.querySelector('[data-studio]').getAttribute('data-studio') : '',
      audience: (li.getAttribute('data-audience') || '').split(',').filter(Boolean),
      sensitivity: li.getAttribute('data-sensitivity') || '',
      discovery: li.getAttribute('data-discovery') || '' };
  }
  var blocked = [];
  items.forEach(function (li) {
    var m = meta(li);
    var ok = CS ? CS.allow(m, globalStage()||stage, 'browse') : (m.sensitivity === 'S0_GENERAL' && m.discovery === 'NORMAL');
    li.dataset.igSafe = ok ? 'yes' : 'no';
    if (!ok) { blocked.push(li); li.remove(); }
  });
  /* Las propuestas y los perfiles se cuentan sobre lo que sí se puede mostrar. */
  var visibleBy = {};
  items = items.filter(function (li) { return li.dataset.igSafe === 'yes'; });
  items.forEach(function (li) { var p = li.getAttribute('data-profile'); visibleBy[p] = (visibleBy[p] || 0) + 1; });
  main.querySelectorAll('.igk-start .igk-item').forEach(function (li) {
    var m = meta(li); if (CS && !CS.allow(m, globalStage()||stage, 'browse')) li.remove();
  });
  main.querySelectorAll('.igk-p').forEach(function (card) {
    var p = card.getAttribute('data-profile'), n = visibleBy[p] || 0;
    if (!n) { card.remove(); return; }
    var slot = card.querySelector('.igk-p-n'); if (slot) slot.textContent = fmt(I.count, { n: n });
  });

  /* ---------- Seguir donde estabas (solo en esta sesión, por el referente) ---------- */
  (function () {
    var sec = main.querySelector('.igk-continue'), slot = sec && sec.querySelector('.igk-cont-slot');
    if (!sec || !slot || !D.referrer) return;
    var ref; try { ref = new URL(D.referrer); } catch (_) { return; }
    if (ref.origin !== location.origin) return;
    var base = I.base || (en ? '/en/workshop/' : '/es/taller/');
    if (ref.pathname.indexOf(base) !== 0 || ref.pathname === base) return;
    var slug = ref.pathname.slice(base.length).replace(/\/$/, '');
    if (!slug || slug.indexOf('/') >= 0) return;
    var tile = main.querySelector('.igk-all a.igk-tile[href^="' + base + slug + '/"]');
    if (!tile) return;
    var name = tile.querySelector('.igk-name').textContent;
    var a = D.createElement('a');
    a.className = 'igk-cont-link'; a.href = withStage(tile.getAttribute('href'));
    a.textContent = fmt(I.contCta, { name: name });
    slot.appendChild(a); sec.hidden = false;
  })();

  /* ---------- «Todos los estudios»: hoja/diálogo ---------- */
  var all = D.getElementById('igk-all'), allBtn = main.querySelector('.igk-all-btn');
  var search = main.querySelector('.igk-search'), input = D.getElementById('igk-q'), clear = main.querySelector('.igk-clear');
  var chipsBox = main.querySelector('.igk-chips'), status = D.getElementById('igk-status');
  var groups = main.querySelectorAll('.igk-group');
  var filter = '', timer = 0, opener = null, dlg = null;
  var searchHome = search ? search.parentNode : null;
  if (search) search.hidden = false;
  if (chipsBox) chipsBox.hidden = false;
  if (allBtn) allBtn.hidden = false;

  if (all && typeof HTMLDialogElement === 'function' && all.showModal !== undefined === false) { /* noop */ }
  if (all && D.createElement('dialog').showModal) {
    dlg = D.createElement('dialog');
    dlg.className = 'igk-dialog';
    dlg.setAttribute('aria-labelledby', 'igk-all-t');
    var head = D.createElement('div'); head.className = 'igk-dialog-head';
    var close = D.createElement('button');
    close.type = 'button'; close.className = 'igk-dialog-close'; close.textContent = '×';
    close.setAttribute('aria-label', I.close || (en ? 'Close' : 'Cerrar'));
    head.appendChild(close);
    all.parentNode.insertBefore(dlg, all);
    dlg.appendChild(head); dlg.appendChild(all);
    all.classList.add('igk-all-in-dialog');
    close.addEventListener('click', function () { dlg.close(); });
    /* El buscador viaja a la hoja mientras está abierta: fuera quedaría inerte. */
    dlg.addEventListener('close', function () {
      if (search && searchHome && search.parentNode !== searchHome) searchHome.insertBefore(search, searchHome.firstChild);
      if (opener && opener.isConnected) opener.focus();
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  function openAll(profile, trigger) {
    opener = trigger || null;
    filter = profile || '';
    if (chipsBox) chipsBox.querySelectorAll('.igk-chip').forEach(function (x) {
      x.setAttribute('aria-pressed', String((x.getAttribute('data-filter') || '') === filter));
    });
    apply(false);
    if (dlg) {
      if (search) dlg.querySelector('.igk-dialog-head').insertBefore(search, dlg.querySelector('.igk-dialog-close'));
      if (!dlg.open) dlg.showModal();
    } else { all.scrollIntoView({ block: 'start' }); }
    if (input) input.focus(); else all.focus();
    apply(true);
  }
  main.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open-profile]'); if (!b) return;
    e.preventDefault(); openAll(b.getAttribute('data-open-profile'), b);
  });

  function apply(announce) {
    var terms = fold(input ? input.value : '').trim().split(/\s+/).filter(Boolean), shown = 0;
    items.forEach(function (li) {
      var ok = (!filter || li.getAttribute('data-profile') === filter)
        && terms.every(function (t) { return li.getAttribute('data-search').indexOf(t) >= 0; });
      li.hidden = !ok; if (ok) shown++;
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('.igk-item:not([hidden])'); });
    if (clear) clear.hidden = !(input && input.value);
    if (!announce || !status) return;
    status.textContent = shown ? fmt(I.count, { n: shown }) : fmt(I.none, { q: input ? input.value.trim() : '' });
  }
  if (input) {
    input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { if (dlg && !dlg.open) openAll(filter, input); else apply(true); }, 250); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape' && input.value) { e.stopPropagation(); input.value = ''; apply(true); } });
  }
  if (clear) clear.addEventListener('click', function () { input.value = ''; apply(true); input.focus(); });
  if (chipsBox) chipsBox.addEventListener('click', function (e) {
    var b = e.target.closest('.igk-chip'); if (!b) return;
    filter = b.getAttribute('data-filter') || '';
    chipsBox.querySelectorAll('.igk-chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    apply(true);
  });
  apply(false);
  main.dataset.igChildsafeBlocked = String(blocked.length);
})();