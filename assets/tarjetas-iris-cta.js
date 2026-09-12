/* Tarjeta Iris: rail visible sin quedar bajo cabeceras sticky/fixed. */
(function(){
  'use strict';
  function visible(el){ return !!(el && el.getClientRects().length); }
  function reducedMotion(){
    try {
      if (window.IGPreferences && IGPreferences.get && IGPreferences.get().motion) return true;
    } catch (_) {}
    if (document.documentElement.dataset.igMotion === 'off') return true;
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function headerOffset(){
    var bottom = 0;
    document.querySelectorAll('header').forEach(function(header){
      if (!visible(header)) return;
      var css = getComputedStyle(header);
      if (css.position !== 'sticky' && css.position !== 'fixed') return;
      var box = header.getBoundingClientRect();
      if (box.top <= 2 && box.bottom > 0) bottom = Math.max(bottom, box.bottom);
    });
    return Math.max(18, Math.ceil(bottom + 16));
  }
  function syncOffset(){
    document.documentElement.style.setProperty('--iris-sticky-top', headerOffset() + 'px');
  }
  function reveal(card){
    if (!card) return;
    syncOffset();
    var offset = headerOffset();
    var box = card.getBoundingClientRect();
    var top = window.scrollY + box.top - offset;
    window.scrollTo({top: Math.max(0, top), left: 0, behavior: reducedMotion() ? 'auto' : 'smooth'});
    window.setTimeout(function(){
      try { card.focus({preventScroll:true}); } catch (_) { card.focus(); }
    }, reducedMotion() ? 0 : 220);
  }
  document.addEventListener('click', function(event){
    var jump = event.target.closest('[data-iris-card-jump]');
    if (!jump) return;
    var card = document.getElementById('tarjeta-iris');
    if (!card) return;
    event.preventDefault();
    reveal(card);
  });
  window.addEventListener('resize', syncOffset, {passive:true});
  document.addEventListener('DOMContentLoaded', syncOffset);
  syncOffset();
})();
