/* Mantener el idioma elegido al saltar entre páginas estáticas y dinámicas.
   La web pública usa solo ES y EN. Las rutas PT-BR se conservan únicamente
   como redirecciones antiguas y no deben reaparecer en la interfaz. */
(function () {
  'use strict';
  function codeFromLang(value) {
    value=String(value||'').toLowerCase();
    if(value.indexOf('en')===0)return 'en';
    if(value.indexOf('es')===0)return 'es';
    return null;
  }
  function remember(code) {
    if(!code)return;
    try { localStorage.setItem('ig_lang',code); } catch (_) {}
  }
  function english(){return codeFromLang(document.documentElement.lang)==='en';}
  function labelElement(control,text){
    if(!control)return;
    var span=control.querySelector('span');
    if(span)span.textContent=text;
  }
  function controlCode(control){
    if(!control)return null;
    var lang=(control.getAttribute('lang')||control.getAttribute('data-lang')||control.getAttribute('data-language')||'').toLowerCase();
    var href=(control.getAttribute('href')||'').toLowerCase();
    var text=(control.textContent||'').trim().toUpperCase();
    if(lang.indexOf('pt')===0||href.indexOf('/pt-br/')!==-1||text==='PT'||text==='PT-BR')return 'pt';
    if(lang.indexOf('en')===0||text==='EN')return 'en';
    if(lang.indexOf('es')===0||text==='ES')return 'es';
    return null;
  }
  function retirePortuguese(){
    document.querySelectorAll('.ig-nav-pt, header a[href*="/pt-br/"], .langs [lang^="pt"], .ig-uh-langs [lang^="pt"]').forEach(function(control){
      control.hidden=true;
      control.setAttribute('aria-hidden','true');
      if('tabIndex' in control)control.tabIndex=-1;
    });
    document.querySelectorAll('.langs a,.langs button,.langs span,.ig-uh-langs a,.ig-uh-langs button,.ig-uh-langs span').forEach(function(control){
      if(controlCode(control)==='pt'){
        control.hidden=true;
        control.setAttribute('aria-hidden','true');
        if('tabIndex' in control)control.tabIndex=-1;
      }
    });
  }
  function syncLanguageControls(){
    var current=english()?'en':'es';
    retirePortuguese();
    document.querySelectorAll('.langs,.ig-uh-langs').forEach(function(nav){
      nav.querySelectorAll('a,button,span').forEach(function(control){
        var code=controlCode(control);
        if(code!=='es'&&code!=='en')return;
        var active=code===current;
        control.classList.toggle('on',active);
        if(active)control.setAttribute('aria-current','true');
        else control.removeAttribute('aria-current');
        if(control.tagName==='BUTTON')control.setAttribute('aria-pressed',String(active));
      });
    });
  }
  /* Small shared chrome only. This never translates article/content text and does
     not observe or rebuild the document. It keeps the common controls coherent
     when a dynamic page changes the html lang attribute in place. */
  function syncChromeLanguage(){
    var en=english();
    document.querySelectorAll('.ig-menu-button').forEach(function(button){
      button.textContent=en?'Menu':'Menú';
      button.setAttribute('aria-label',en?'Open menu':'Abrir menú');
    });
    document.querySelectorAll('#ig-main-nav').forEach(function(nav){nav.setAttribute('aria-label',en?'Explore':'Explorar');});
    document.querySelectorAll('.ig-uh-music,#plBtn').forEach(function(control){
      labelElement(control,en?'Music':'Música');
      control.setAttribute('aria-label',en?'Music':'Música');
      if(control.hasAttribute('title'))control.setAttribute('title',en?'Music':'Música');
    });
    document.querySelectorAll('.ig-uh-reading,#a11yBtn').forEach(function(control){
      labelElement(control,en?'Reading':'Lectura');
      control.setAttribute('aria-label',en?'Accessible reading':'Lectura accesible');
      if(control.hasAttribute('title'))control.setAttribute('title',en?'Reading':'Lectura');
    });
    document.querySelectorAll('.ig-uh-langs,.langs').forEach(function(nav){nav.setAttribute('aria-label',en?'Language':'Idioma');});
    document.querySelectorAll('[data-ig-reading-close]').forEach(function(button){button.setAttribute('aria-label',en?'Close reading settings':'Cerrar opciones de lectura');});
    syncLanguageControls();
  }
  function scheduleChrome(){requestAnimationFrame(syncChromeLanguage);}
  var path=location.pathname;
  try {
    var saved=String(localStorage.getItem('ig_lang')||'').toLowerCase();
    if(saved.indexOf('pt')===0)localStorage.setItem('ig_lang','es');
  } catch (_) {}
  if(/^\/en(?:\/|$)/.test(path))remember('en');
  else if(/^\/es(?:\/|$)/.test(path)||path==='/')remember(codeFromLang(document.documentElement.lang)||'es');
  /* Explicit language links must update the shared preference before navigation.
     This also makes EN → ES → dynamic-page round trips deterministic. */
  document.addEventListener('click',function(event){
    var link=event.target.closest('a[lang]');
    if(link)remember(codeFromLang(link.getAttribute('lang')));
    if(link||event.target.closest('.ig-uh-langs button,.langs button'))scheduleChrome();
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncChromeLanguage,{once:true});else syncChromeLanguage();
  new MutationObserver(syncChromeLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

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
    /* Algunas páginas antiguas conservan el disparador #mBtn junto al botón común.
       Si ambos existen, el antiguo deja de ser visible y enfocables sin eliminarlo
       del DOM, para no romper scripts heredados que todavía lo consulten. */
    document.querySelectorAll('header').forEach(function (header) {
      var modern = header.querySelector('.ig-menu-button');
      var legacy = header.querySelector('#mBtn');
      if (modern && legacy && modern !== legacy) {
        legacy.hidden = true;
        legacy.setAttribute('aria-hidden', 'true');
        legacy.tabIndex = -1;
      }
    });
    document.querySelectorAll('a[data-ig-back-conditions]').forEach(function (link) {
      try {
        var saved = sessionStorage.getItem('ig-conditions-url');
        if (saved && new URL(saved, location.origin).pathname === '/es/neurodiversidad/condiciones/') link.href = saved;
      } catch (_) {}
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
    if(window.IGPreferences&&window.IGPreferences.mountTextOptions)window.IGPreferences.mountTextOptions(p);
    if(active===p)return;
    active=p;
    document.dispatchEvent(new CustomEvent('ig:panel-opening',{detail:'reading'}));
    if(typeof p.showPopover==='function'&&!isPopover(p))p.showPopover();
    var close=p.querySelector('[data-ig-reading-close]');
    if(close){close.setAttribute('aria-label',label());close.focus({preventScroll:true});}
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

/* Uncover keyboard focus without moving a floating player or rebuilding the page.
   A panel is collapsed only when it actually overlaps focus outside that panel.
   Collapsing music must not stop the user's current track. */
(function(){
 'use strict';
 var pending=0;
 function visible(el){return el&&!el.hidden&&el.getClientRects().length;}
 function overlaps(a,b){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}
 function protect(){
  pending=0;
  var target=document.activeElement;
  if(!target||target===document.body||!target.getClientRects().length)return;
  var rect=target.getBoundingClientRect();
  document.querySelectorAll('#ig-music-panel,[data-ig-reading-panel]').forEach(function(p){
   if(!visible(p)||p.contains(target)||!overlaps(rect,p.getBoundingClientRect()))return;
   if(p.id==='ig-music-panel')document.dispatchEvent(new CustomEvent('ig:uncover-focus',{detail:'music'}));
   else if(window.IGReading)window.IGReading.close(false);
  });
  var header=document.querySelector('header.ig-menu-open');
  if(header&&!header.contains(target)){
   header.classList.remove('ig-menu-open');
   var menu=header.querySelector('.ig-menu-button');if(menu)menu.setAttribute('aria-expanded','false');
  }
  var top=0;
  document.querySelectorAll('header').forEach(function(h){
   var position=getComputedStyle(h).position, box=h.getBoundingClientRect();
   if(!h.contains(target)&&visible(h)&&(position==='fixed'||position==='sticky')&&box.top<=1&&overlaps(rect,box))top=Math.max(top,box.bottom);
  });
  if(top>0&&rect.top<top+8)window.scrollBy({top:rect.top-top-12,left:0,behavior:'instant'});
  var guide=document.getElementById('rguide')||document.getElementById('ig-guide');
  rect=target.getBoundingClientRect();
  if(visible(guide)&&overlaps(rect,guide.getBoundingClientRect())){
   var height=guide.getBoundingClientRect().height;
   var next=rect.bottom+6;
   if(next+height>window.innerHeight)next=Math.max(0,rect.top-height-6);
   guide.style.top=next+'px';
  }
 }
 document.addEventListener('focusin',function(){
  if(pending)cancelAnimationFrame(pending);
  pending=requestAnimationFrame(protect);
 });
})();
