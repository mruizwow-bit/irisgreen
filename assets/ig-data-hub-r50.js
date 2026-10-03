(()=>{'use strict';
const root=document.getElementById('ig-data-results');
if(!root)return;
const q=document.getElementById('ig-data-search');
const region=document.getElementById('ig-data-region');
const topic=document.getElementById('ig-data-topic');
const reset=document.getElementById('ig-data-reset');
const count=document.getElementById('ig-data-count');
const empty=document.getElementById('ig-data-empty');
const cards=[...root.querySelectorAll('.card[data-region][data-topic]')];
const lang=(document.documentElement.lang||'es').toLowerCase().startsWith('en')?'en':'es';
const norm=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
function apply(){
 const query=norm(q?.value),r=region?.value||'',t=topic?.value||'';
 let shown=0;
 cards.forEach(card=>{
  const okQ=!query||norm(card.textContent).includes(query);
  const okR=!r||card.dataset.region===r;
  const okT=!t||card.dataset.topic===t;
  const show=okQ&&okR&&okT;
  card.hidden=!show;if(show)shown++;
 });
 if(count)count.textContent=lang==='en'?shown+' '+(shown===1?'result':'results'):shown+' '+(shown===1?'resultado':'resultados');
 if(empty)empty.hidden=shown!==0;
}
[q,region,topic].forEach(el=>el&&el.addEventListener(el===q?'input':'change',apply));
reset?.addEventListener('click',()=>{if(q)q.value='';if(region)region.value='';if(topic)topic.value='';apply();q?.focus();});
apply();
})();