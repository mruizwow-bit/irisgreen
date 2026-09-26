/* Iris Green · muestras reales de Mis libros · restauración acotada. */
(function(){
  'use strict';
  if (window.__igBookFlipbooks) return;
  window.__igBookFlipbooks = true;

  var BOOKS = [
    {
      id: 'luma',
      titleEs: 'Luma y la flor que sabía escuchar',
      titleEn: 'Luma and the Flower That Knew How to Listen',
      cover: '/assets/books/luma-es-512.webp',
      count: 8,
      ratio: '420 / 427',
      scale: '800%',
      chunks: [
        '/assets/books/samples/flip-luma-es.part1.txt',
        '/assets/books/samples/flip-luma-es.part2.txt',
        '/assets/books/samples/flip-luma-es.part3.txt'
      ]
    },
    {
      id: 'autismo',
      titleEs: 'Autismo en la vida diaria',
      titleEn: 'Autism in Everyday Life',
      cover: '/assets/books/autismo-es-512.webp',
      count: 7,
      ratio: '420 / 596',
      scale: '700%',
      chunks: [
        '/assets/books/samples/flip-autismo-es.part1.txt',
        '/assets/books/samples/flip-autismo-es.part2.txt',
        '/assets/books/samples/flip-autismo-es.part3.txt',
        '/assets/books/samples/flip-autismo-es.part4.txt'
      ]
    }
  ];

  var CSS = '\
.ig-flipbook{margin-top:18px;padding:18px;border:1px solid rgba(90,73,168,.22);border-radius:18px;background:rgba(255,255,255,.82)}\
.ig-flipbook-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin:0 0 12px}.ig-flipbook-head div{min-width:0}.ig-flipbook-kicker{margin:0 0 2px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6f5fc0}.ig-flipbook-head h3{margin:0;font-family:Newsreader,Georgia,serif;font-size:24px;font-weight:500;line-height:1.15;color:#17395c}.ig-flipbook-badge{flex:0 0 auto;padding:5px 9px;border-radius:999px;background:rgba(111,95,192,.09);color:#5a49a8;font-size:12px;font-weight:700}.ig-flip-stage{position:relative;margin:0 auto;max-width:520px;min-height:260px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:12px;background:#f5f7fa;box-shadow:0 12px 30px -22px rgba(23,57,92,.65);outline:none;touch-action:pan-y}.ig-flip-stage:focus-visible{outline:3px solid #6f5fc0;outline-offset:3px}.ig-flip-page{display:block;width:100%;height:auto;max-height:68vh;object-fit:contain;background:#fff}.ig-flip-sprite{width:min(100%,420px);background-repeat:no-repeat;background-size:100% var(--sprite-scale);background-position:0 var(--sprite-y);aspect-ratio:var(--ratio);background-color:#fff}.ig-flip-page,.ig-flip-sprite{animation:igBookPageIn .18s ease-out}@keyframes igBookPageIn{from{opacity:.45;transform:translateX(7px)}to{opacity:1;transform:none}}.ig-flip-controls{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:12px}.ig-flip-controls button{width:44px;height:44px;padding:0;border-radius:999px;border:1px solid rgba(90,73,168,.35);background:#fff;color:#5a49a8;font-size:27px;line-height:1;cursor:pointer}.ig-flip-controls button:hover:not(:disabled){background:rgba(111,95,192,.07)}.ig-flip-controls button:focus-visible{outline:3px solid rgba(90,73,168,.35);outline-offset:2px}.ig-flip-controls button:disabled{opacity:.35;cursor:default}.ig-flip-counter{min-width:76px;text-align:center;font-weight:700;color:#435268;font-size:14px}.ig-flip-note{margin:11px 0 0;color:#5a6675;font-size:13px;line-height:1.45}.ig-flip-error{margin:0;padding:16px;color:#7a3857;text-align:center}.ig-flipbook[data-loading="true"] .ig-flip-stage:after{content:"";width:26px;height:26px;border:3px solid rgba(90,73,168,.18);border-top-color:#6f5fc0;border-radius:50%;animation:igBookSpin .8s linear infinite}@keyframes igBookSpin{to{transform:rotate(360deg)}}@media(max-width:640px){.ig-flipbook{padding:14px}.ig-flip-stage{max-width:100%}.ig-flip-page{max-height:62vh}.ig-flipbook-head h3{font-size:21px}}@media(prefers-reduced-motion:reduce){.ig-flip-page,.ig-flip-sprite,.ig-flipbook[data-loading="true"] .ig-flip-stage:after{animation:none!important}}';

  var spriteCache = new Map();
  var scheduled = 0;
  var mounting = false;

  function lang(){
    return (document.documentElement.lang || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  function labels(){
    if (lang() === 'en') return {
      kicker: 'LOOK INSIDE BEFORE BUYING',
      lumaTitle: 'Real sample pages',
      autismTitle: 'Real pages from the book',
      pages: 'pages',
      prev: 'Previous page',
      next: 'Next page',
      stage: 'Book sample; use the arrow keys to change page',
      noteLuma: 'Selected pages from the published book. The full story is not included in this preview.',
      noteAutism: 'The sample includes the cover and real interior pages. It does not replace the full book.',
      failed: 'The sample could not be loaded.'
    };
    return {
      kicker: 'HOJEA ANTES DE COMPRAR',
      lumaTitle: 'Muestra real del cuento',
      autismTitle: 'Páginas reales del libro',
      pages: 'páginas',
      prev: 'Página anterior',
      next: 'Página siguiente',
      stage: 'Muestra del libro; usa las flechas para cambiar de página',
      noteLuma: 'Páginas seleccionadas del libro publicado. La muestra no incluye el cuento completo.',
      noteAutism: 'La muestra incluye la portada y páginas reales del interior. No sustituye al contenido completo del libro.',
      failed: 'No se ha podido cargar la muestra.'
    };
  }

  function addStyle(){
    if (document.getElementById('ig-books-flip-style')) return;
    var style = document.createElement('style');
    style.id = 'ig-books-flip-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function loadSprite(book){
    if (spriteCache.has(book.id)) return spriteCache.get(book.id);
    var promise = Promise.all(book.chunks.map(function(path){
      return fetch(path, {credentials:'same-origin'}).then(function(response){
        if (!response.ok) throw new Error('No se pudo cargar '+path+' ('+response.status+')');
        return response.text();
      });
    })).then(function(parts){
      return 'data:image/avif;base64,' + parts.join('').replace(/\s+/g,'');
    });
    spriteCache.set(book.id, promise);
    return promise;
  }

  function render(viewer, book, sprite, page){
    var L = labels();
    var total = book.count + 1;
    page = Math.max(0, Math.min(Number(page) || 0, total - 1));
    viewer.dataset.page = String(page);
    var stage = viewer.querySelector('.ig-flip-stage');
    stage.innerHTML = '';
    if (page === 0) {
      var img = document.createElement('img');
      img.className = 'ig-flip-page';
      img.src = book.cover;
      img.alt = (lang()==='en' ? book.titleEn : book.titleEs) + ' · ' + (lang()==='en' ? 'cover' : 'portada');
      stage.appendChild(img);
    } else {
      var frame = document.createElement('div');
      frame.className = 'ig-flip-sprite';
      frame.setAttribute('role','img');
      frame.setAttribute('aria-label',(lang()==='en' ? 'Page ' : 'Página ') + (page + 1) + ' · ' + (lang()==='en' ? book.titleEn : book.titleEs));
      frame.style.setProperty('--ratio', book.ratio);
      frame.style.setProperty('--sprite-scale', book.scale);
      var y = book.count === 1 ? 0 : ((page - 1) / (book.count - 1)) * 100;
      frame.style.setProperty('--sprite-y', y + '%');
      frame.style.backgroundImage = 'url("' + sprite + '")';
      stage.appendChild(frame);
    }
    viewer.querySelector('.ig-flip-counter').textContent = (page + 1) + ' / ' + total;
    var prev = viewer.querySelector('[data-ig-flip-prev]');
    var next = viewer.querySelector('[data-ig-flip-next]');
    prev.disabled = page === 0;
    next.disabled = page === total - 1;
    prev.setAttribute('aria-label', L.prev);
    next.setAttribute('aria-label', L.next);
  }

  function viewerMarkup(book){
    var L = labels();
    var total = book.count + 1;
    var section = document.createElement('section');
    section.className = 'ig-flipbook';
    section.id = book.id + '-muestra';
    section.dataset.igFlipbook = book.id;
    section.dataset.page = '0';
    section.dataset.loading = 'true';
    section.innerHTML = '<div class="ig-flipbook-head"><div><p class="ig-flipbook-kicker">'+L.kicker+'</p><h3>'+(book.id==='luma'?L.lumaTitle:L.autismTitle)+'</h3></div><span class="ig-flipbook-badge">'+total+' '+L.pages+'</span></div><div class="ig-flip-stage" role="group" tabindex="0" aria-label="'+L.stage+'"></div><div class="ig-flip-controls"><button type="button" data-ig-flip-prev aria-label="'+L.prev+'">‹</button><span class="ig-flip-counter" aria-live="polite">1 / '+total+'</span><button type="button" data-ig-flip-next aria-label="'+L.next+'">›</button></div><p class="ig-flip-note">'+(book.id==='luma'?L.noteLuma:L.noteAutism)+'</p>';
    return section;
  }

  function attachEvents(viewer, book, sprite){
    var stage = viewer.querySelector('.ig-flip-stage');
    var startX = null;
    function go(delta){ render(viewer, book, sprite, Number(viewer.dataset.page || 0) + delta); }
    viewer.querySelector('[data-ig-flip-prev]').addEventListener('click', function(){ go(-1); });
    viewer.querySelector('[data-ig-flip-next]').addEventListener('click', function(){ go(1); });
    stage.addEventListener('keydown', function(event){
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
    });
    stage.addEventListener('touchstart', function(event){ startX = event.touches && event.touches[0] ? event.touches[0].clientX : null; }, {passive:true});
    stage.addEventListener('touchend', function(event){
      if (startX === null) return;
      var end = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : startX;
      var delta = end - startX;
      startX = null;
      if (Math.abs(delta) < 42) return;
      go(delta < 0 ? 1 : -1);
    }, {passive:true});
  }

  function previewLink(card, book){
    var links = card.querySelectorAll('a[href]');
    for (var i=0;i<links.length;i++) {
      var href = links[i].getAttribute('href') || '';
      if (href.indexOf('#'+book.id) !== -1 || href.indexOf('#'+book.id+'-muestra') !== -1) return links[i];
    }
    return null;
  }

  function placeViewer(card, link, viewer){
    var row = link && link.parentElement;
    if (row && row.parentElement) row.parentElement.insertBefore(viewer, row.nextSibling);
    else card.appendChild(viewer);
  }

  function mountOne(card, book){
    if (!card || card.querySelector('[data-ig-flipbook="'+book.id+'"]')) return Promise.resolve();
    card.id = book.id;
    var link = previewLink(card, book);
    var viewer = viewerMarkup(book);
    placeViewer(card, link, viewer);
    if (link) {
      link.setAttribute('href','#'+book.id+'-muestra');
      link.addEventListener('click', function(){
        requestAnimationFrame(function(){
          var stage = viewer.querySelector('.ig-flip-stage');
          if (stage) stage.focus({preventScroll:true});
        });
      });
    }
    return loadSprite(book).then(function(sprite){
      viewer.dataset.loading = 'false';
      attachEvents(viewer, book, sprite);
      render(viewer, book, sprite, 0);
    }).catch(function(error){
      console.error('[Iris Green flipbook]', error);
      viewer.dataset.loading = 'false';
      var stage = viewer.querySelector('.ig-flip-stage');
      if (stage) stage.innerHTML = '<p class="ig-flip-error">'+labels().failed+'</p>';
      viewer.querySelectorAll('.ig-flip-controls button').forEach(function(button){button.disabled=true;});
    });
  }

  function mount(){
    if (mounting) return;
    var cards = document.querySelectorAll('.ig-book-card');
    if (cards.length < 2) return;
    mounting = true;
    addStyle();
    Promise.all([mountOne(cards[0], BOOKS[0]), mountOne(cards[1], BOOKS[1])]).finally(function(){
      mounting = false;
      var hash = location.hash;
      if (hash === '#luma' || hash === '#autismo') {
        var target = document.getElementById(hash.slice(1)+'-muestra');
        if (target) target.scrollIntoView({block:'start'});
      }
    });
  }

  function schedule(){
    if (scheduled) return;
    scheduled = requestAnimationFrame(function(){ scheduled = 0; mount(); });
  }

  function boot(){
    schedule();
    var main = document.querySelector('main');
    if (main) new MutationObserver(schedule).observe(main,{childList:true,subtree:true});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
