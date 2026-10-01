/* Catalogue filters share the session age policy, including late adult cards. */
(function(){'use strict';
function start(){
 const input=document.getElementById('vd-search');if(!input)return;
 const buttons=[...document.querySelectorAll('.catbuttons button')],count=document.getElementById('vd-count');let cat='';
 const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 function run(){const q=norm(input.value).trim();let n=0;
  document.querySelectorAll('.vd-card').forEach(c=>{
   const age=!window.IGAudience||window.IGAudience.allowedAgeBands(c.dataset.igAgeBands||[]);
   c.hidden=!(age&&(!cat||c.dataset.cat===cat)&&(!q||norm(c.dataset.search||c.textContent).includes(q)));if(!c.hidden)n++;
  });
  document.querySelectorAll('.vd-group').forEach(g=>{g.hidden=![...g.querySelectorAll('.vd-card')].some(c=>!c.hidden);});
  document.querySelectorAll('.vd-concept').forEach(c=>{c.hidden=!!q&&!norm(c.dataset.search||c.textContent).includes(q);});
  const en=document.documentElement.lang.startsWith('en');count.textContent=n+(en?(n===1?' entry':' entries'):(n===1?' ficha':' fichas'));
 }
 buttons.forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.cat;buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));run();}));
 input.addEventListener('input',run);window.addEventListener('ig:audience-change',run);
 new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches('.vd-card')||n.querySelector('.vd-card')))))run();}).observe(document.querySelector('main'),{childList:true,subtree:true});run();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
