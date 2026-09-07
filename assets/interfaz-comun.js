/* Controles compartidos; no observa ni reconstruye el documento. */
(function () {
  'use strict';
  if (window.__igInterfaceReady) return;
  window.__igInterfaceReady = true;
  function closeMenu(header, focus) {
    if (!header) return;
    header.classList.remove('ig-menu-open');
    var button = header.querySelector('.ig-menu-button');
    if (button) { button.setAttribute('aria-expanded', 'false'); if (focus) button.focus(); }
  }
  document.addEventListener('click', function (event) {
    var button = event.target.closest('.ig-menu-button');
    if (button) {
      var header = button.closest('header');
      var open = header.classList.toggle('ig-menu-open');
      button.setAttribute('aria-expanded', String(open));
    } else if (event.target.closest('header nav a')) {
      closeMenu(event.target.closest('header'), false);
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu(document.querySelector('header.ig-menu-open'), true);
  });
  function ready() {
    document.querySelectorAll('a[data-ig-back-conditions]').forEach(function (link) {
      try {
        var saved = sessionStorage.getItem('ig-conditions-url');
        if (saved && new URL(saved, location.origin).pathname === '/es/neurodiversidad/condiciones/') link.href = saved;
      } catch (_) {}
    });
    if (!document.body.hasAttribute('data-ig-conditions') || !window.IGSearch) return;
    var api = window.IGSearch;
    var q = document.getElementById('q');
    var filters = document.getElementById('filtros');
    var az = document.getElementById('az');
    var count = document.getElementById('cuenta');
    var empty = document.getElementById('ig-search-empty');
    var reset = document.getElementById('ig-search-reset');
    if (!q || !filters || !az || !count || !empty) return;
    var cards = new Map(Array.from(document.querySelectorAll('.cards>a.card')).map(function (card) { return [api.path(card.href), card]; }));
    var params = new URLSearchParams(location.search);
    var state = { q: params.get('q') || '', type: params.get('tipo') || '', letter: params.get('letra') || '' };
    q.value = state.q;
    var entries = [], loaded = false;
    count.textContent = 'Cargando el buscador…';
    filters.setAttribute('aria-busy', 'true');
    function firstLetter(item) { return api.norm(item.indexKey || item.name).charAt(0).toLocaleUpperCase('es') || '#'; }
    function button(label, value, attr, active) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = attr === 'data-letter' ? 'azl' : 'chip lnk';
      b.textContent = label; b.setAttribute(attr, value); b.setAttribute('aria-pressed', String(active));
      return b;
    }
    function paint() {
      if (!loaded) return;
      var found = api.rank(entries, state.q).filter(function (item) {
        return (!state.type || item.tipo === state.type) && (!state.letter || firstLetter(item) === state.letter);
      });
      var urls = new Set(found.map(function (item) { return api.path(item.url); }));
      cards.forEach(function (card, url) { card.hidden = !urls.has(url); });
      var n = found.length;
      var text = state.q.trim() ? n + (n === 1 ? ' resultado para «' : ' resultados para «') + state.q.trim() + '»' : n + (n === 1 ? ' ficha' : ' fichas');
      if (state.type) text += ' · ' + state.type;
      if (state.letter) text += ' · ' + state.letter;
      count.textContent = text;
      empty.hidden = n !== 0;
      if (reset) reset.hidden = !(state.q || state.type || state.letter);
      filters.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-type') === state.type)); });
      az.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-letter') === state.letter)); });
      var u = new URL(location.href);
      [['q', state.q], ['tipo', state.type], ['letra', state.letter]].forEach(function (pair) { if (pair[1]) u.searchParams.set(pair[0], pair[1]); else u.searchParams.delete(pair[0]); });
      try { history.replaceState(history.state, '', u.pathname + u.search + u.hash); sessionStorage.setItem('ig-conditions-url', u.pathname + u.search); } catch (_) {}
    }
    q.addEventListener('input', function () { state.q = q.value; paint(); });
    filters.addEventListener('click', function (event) {
      var b = event.target.closest('button[data-type]');
      if (b) { state.type = b.getAttribute('data-type'); paint(); }
    });
    az.addEventListener('click', function (event) {
      var b = event.target.closest('button[data-letter]');
      if (b) { state.letter = b.getAttribute('data-letter'); paint(); }
    });
    if (reset) reset.addEventListener('click', function () { state = { q:'', type:'', letter:'' }; q.value = ''; paint(); q.focus(); });
    api.load().then(function (data) {
      entries = data.filter(function (item) { return cards.has(api.path(item.url)); });
      if (entries.length !== cards.size) throw new Error('El índice y el catálogo de Condiciones no coinciden.');
      var types = Array.from(new Set(entries.map(function (item) { return item.tipo; }).filter(Boolean))).sort(function (a,b) { return a.localeCompare(b, 'es'); });
      var letters = Array.from(new Set(entries.map(firstLetter))).sort(function (a,b) { return a.localeCompare(b, 'es'); });
      if (!types.includes(state.type)) state.type = '';
      if (!letters.includes(state.letter)) state.letter = '';
      filters.replaceChildren(button('Todas', '', 'data-type', !state.type));
      types.forEach(function (type) { filters.appendChild(button(type, type, 'data-type', state.type === type)); });
      az.replaceChildren(button('Todas', '', 'data-letter', !state.letter));
      letters.forEach(function (letter) { az.appendChild(button(letter, letter, 'data-letter', state.letter === letter)); });
      filters.removeAttribute('aria-busy'); loaded = true; paint();
    }).catch(function (error) {
      filters.removeAttribute('aria-busy');
      count.textContent = 'No se ha podido cargar el buscador. Puedes recorrer las fichas o recargar la página.';
      q.disabled = true;
      console.warn('[Iris Green]', error.message);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true }); else ready();
})();

/* Reading accessibility: one controller for the existing controls, no DOM polling. */
(function(){
  'use strict';
  if(window.IGReading)return;
  var trigger=null,active=null,restore=true,frame=0;
  var opener='[data-ig-reading-trigger],.ig-uh-reading,#a11yBtn';
  function panel(){return document.querySelector('[data-ig-reading-panel]');}
  function label(){return (document.documentElement.lang||'es').startsWith('en')?'Close reading settings':'Cerrar opciones de lectura';}
  function shown(p){return p&&p.isConnected&&!p.hidden;}
  function isPopover(p){return typeof p.hidePopover==='function'&&p.matches(':popover-open');}
  function focusBack(){if(restore&&trigger&&trigger.isConnected)trigger.focus({preventScroll:true});}
  function synchronize(){
    frame=0;
    var p=panel();
    if(!shown(p)){
      if(active){if(isPopover(active))active.hidePopover();active=null;focusBack();}
      document.querySelectorAll(opener).forEach(function(b){b.setAttribute('aria-expanded','false');});
      restore=true;return;
    }
    document.querySelectorAll(opener).forEach(function(b){b.setAttribute('aria-controls',p.id);b.setAttribute('aria-expanded','true');});
    if(active===p)return;
    active=p;
    document.dispatchEvent(new CustomEvent('ig:panel-opening',{detail:'reading'}));
    if(typeof p.showPopover==='function'&&!isPopover(p))p.showPopover();
    var close=p.querySelector('[data-ig-reading-close]');
    if(close)close.focus({preventScroll:true});
  }
  function schedule(){if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(synchronize);}
  function closeReading(back){
    var p=panel();if(!shown(p))return;
    restore=back!==false;
    if(p.id==='a11y'){p.hidden=true;schedule();}
    else {var b=p.querySelector('[data-ig-reading-close]');if(b)b.click();}
  }
  function prepareStatic(){
    var p=document.getElementById('a11y');if(!p||p.hasAttribute('data-ig-reading-panel'))return;
    p.setAttribute('data-ig-reading-panel','');p.setAttribute('role','region');p.setAttribute('popover','manual');
    var h=p.querySelector('h2');if(h){h.id='ig-reading-title';p.setAttribute('aria-labelledby',h.id);}
    var b=document.createElement('button');b.type='button';b.setAttribute('data-ig-reading-close','');b.setAttribute('aria-label',label());b.textContent='×';p.insertBefore(b,p.firstChild);
    b.addEventListener('click',function(){p.hidden=true;schedule();});
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest(opener);
    if(b){trigger=b;restore=true;schedule();}
    else if(e.target.closest('[data-ig-reading-close]'))schedule();
  },true);
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape'||!shown(panel())||e.target.closest('#ig-game-letter,#ig-music-panel'))return;
    e.preventDefault();e.stopImmediatePropagation();closeReading(true);
  },true);
  document.addEventListener('ig:panel-opening',function(e){if(e.detail==='music')closeReading(false);});
  window.IGReading={close:closeReading};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepareStatic,{once:true});else prepareStatic();
})();
