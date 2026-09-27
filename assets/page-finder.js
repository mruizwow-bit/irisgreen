/* Local section filter: no network, analytics or persistence. */
(()=>{'use strict';
const finder=document.getElementById('ig-page-finder');if(!finder)return;
const query=finder.querySelector('input'),items=[...finder.querySelectorAll('li')],status=finder.querySelector('[role=status]');
let en=document.documentElement.lang.startsWith('en');
const normal=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
finder.querySelector('.ig-page-filter').hidden=false;
function filterQuery(){const q=normal(query.value);let n=0;items.forEach(li=>{li.hidden=!normal(li.textContent).includes(q);if(!li.hidden)n++;});finder.querySelector('.ig-section-empty').hidden=n!==0;status.textContent=en?`${n} sections`:`${n} secciones`;}
query.addEventListener('input',filterQuery);
function reveal(target){for(let el=target;el;el=el.parentElement)if(el.tagName==='DETAILS')el.open=true;}
finder.addEventListener('click',e=>{const link=e.target.closest('a[href^="#"]');if(!link)return;const target=document.getElementById(link.hash.slice(1));if(!target)return;e.preventDefault();reveal(target);finder.open=false;target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'instant'});history.replaceState(null,'',link.hash);});
function hash(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const target=document.getElementById(id);if(target)reveal(target);}
window.addEventListener('hashchange',hash);hash();
new MutationObserver(()=>requestAnimationFrame(()=>{en=document.documentElement.lang.startsWith('en');const title=en?'Find a section on this page':'Buscar una sección en esta página';finder.querySelector('summary').textContent=title;finder.querySelector('nav').setAttribute('aria-label',title);finder.querySelector('label').textContent=en?'Section name':'Nombre de la sección';finder.querySelector('.ig-section-empty').textContent=en?'No matching sections.':'No hay secciones con ese nombre.';items.forEach(li=>{const a=li.querySelector('a'),target=document.getElementById(a.hash.slice(1));if(target)a.textContent=target.textContent.trim();});filterQuery();})).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
finder.addEventListener('keydown',e=>{if(e.key==='Escape'){finder.open=false;finder.querySelector('summary').focus();}});
})();
/* Printed activities include their content, even when closed on screen. */
(()=>{let opened=[];window.addEventListener('beforeprint',()=>{opened=[...document.querySelectorAll('details.qcard:not([open])')];opened.forEach(d=>d.open=true);});window.addEventListener('afterprint',()=>{opened.forEach(d=>d.open=false);opened=[];});})();
