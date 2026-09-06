(function(){
 var K='ig-a11y', B=document.body, S={};
 try{S=JSON.parse(localStorage.getItem(K))||{}}catch(e){S={}}
 var steps=[1,1.15,1.3,1.5];
 function apply(){
  B.style.setProperty('--fs',(steps[S.fs||0])+'rem');
  B.style.setProperty('--ls',S.ls?'.06em':'0');
  B.classList.toggle('big',!!S.big); B.classList.toggle('hc',!!S.hc);
  B.classList.toggle('rm',!!S.rm); B.classList.toggle('tts',!!S.tts);
  var guide=document.getElementById('rguide'); if(guide)guide.hidden=!S.guide;
  document.querySelectorAll('[data-a]').forEach(function(b){
   var a=b.dataset.a; if(['ls','big','hc','guide','tts','rm'].indexOf(a)>-1) b.setAttribute('aria-pressed',S[a]?'true':'false');
  });
 }
 function save(){ try{localStorage.setItem(K,JSON.stringify(S))}catch(e){} apply(); }
 document.querySelectorAll('[data-a]').forEach(function(b){
  b.addEventListener('click',function(){
   var a=b.dataset.a;
   if(a==='fs+'){S.fs=Math.min((S.fs||0)+1,steps.length-1)}
   else if(a==='fs-'){S.fs=Math.max((S.fs||0)-1,0)}
   else if(a==='reset'){S={}; if(window.speechSynthesis)speechSynthesis.cancel()}
   else {S[a]=!S[a]; if(a==='tts'&&!S.tts&&window.speechSynthesis)speechSynthesis.cancel()}
   save();
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
 document.addEventListener('pointermove',function(e){ if(S.guide){var g=document.getElementById('rguide'); if(g)g.style.top=(e.clientY-21)+'px';} });
 document.querySelectorAll('main p, main li, main h1, main h2').forEach(function(el){ el.setAttribute('data-read',''); });
 document.addEventListener('click',function(e){
  if(!S.tts||!window.speechSynthesis)return;
  var el=e.target.closest('[data-read]'); if(!el)return;
  speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(el.textContent);
  u.lang=document.documentElement.lang; speechSynthesis.speak(u);
 });
 apply();
})();