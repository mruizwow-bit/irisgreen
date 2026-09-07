/* Static-page adapter for the shared preference controller. */
(function(){
 var P=window.IGPreferences;
 if(!P)return;
 var names={ls:'spacing',big:'controls',hc:'contrast',guide:'guide',rm:'motion'};
 document.querySelectorAll('[data-a]').forEach(function(b){
  b.addEventListener('click',function(){
   var a=b.dataset.a;
   if(a==='fs+')P.step(1);
   else if(a==='fs-')P.step(-1);
   else if(a==='reset')P.reset();
   else if(a==='tts'){
    var on=!P.speechOn();P.setSpeech(on);
    if(!on&&window.speechSynthesis)window.speechSynthesis.cancel();
   }else if(names[a]){var patch={};patch[names[a]]=!P.get()[names[a]];P.update(patch);}
  });
 });
 function toggle(btn,pan){ if(!btn||!pan)return; btn.addEventListener('click',function(){
   var open=btn.getAttribute('aria-expanded')==='true';
   btn.setAttribute('aria-expanded',String(!open)); pan.hidden=open;
   if(!open){var f=pan.querySelector('button,a');if(f)f.focus()}
 });}
 var mb=document.getElementById('mBtn'), nv=document.getElementById('nav');
 if(mb&&nv) mb.addEventListener('click',function(){var o=mb.getAttribute('aria-expanded')==='true';mb.setAttribute('aria-expanded',String(!o));nv.classList.toggle('open',!o);});
 toggle(document.getElementById('a11yBtn'),document.getElementById('a11y'));
 // Música la controla exclusivamente assets/musica.js.
 document.addEventListener('keydown',function(e){ if(e.key==='Escape'){
  ['a11y','pl'].forEach(function(id){var p=document.getElementById(id);if(p&&!p.hidden){p.hidden=true;
   var b=document.getElementById(id==='pl'?'plBtn':'a11yBtn'); b.setAttribute('aria-expanded','false'); b.focus();}});
 }});
 document.querySelectorAll('main p, main li, main h1, main h2').forEach(function(el){el.setAttribute('data-read','');});
 document.addEventListener('click',function(e){
  if(!P.speechOn()||!window.speechSynthesis||e.target.closest('button,a,input,textarea,select'))return;
  var el=e.target.closest('[data-read]');if(!el)return;
  window.speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(el.textContent);u.lang=document.documentElement.lang;window.speechSynthesis.speak(u);
 });
 P.apply();
})();
