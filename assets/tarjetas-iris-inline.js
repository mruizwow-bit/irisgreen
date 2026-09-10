(function(){
  'use strict';
  function grow(el){el.style.height='auto';el.style.height=Math.max(el.scrollHeight,56)+'px';}
  document.querySelectorAll('[data-iris-inline-card="true"] textarea').forEach(function(el){grow(el);el.addEventListener('input',function(){grow(el);});});
  document.querySelectorAll('[data-iris-print]').forEach(function(button){button.addEventListener('click',function(){document.body.classList.add('iris-print-card');window.print();});});
  window.addEventListener('afterprint',function(){document.body.classList.remove('iris-print-card');});
})();
