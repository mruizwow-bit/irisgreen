/* Iris Green · capa pública de rutinas visuales */
(function(){
'use strict';
var lang=(document.documentElement.lang||'es').toLowerCase().indexOf('en')===0?'en':'es';
var T=lang==='en'?{
 any:'Any age',older:'Adolescence · Adulthood',context:'Context',print:'Print / save PDF',
 note:'You can adapt the steps, remove any you do not need or change their order.',
 license:'Pictograms used in visual compositions: Mulberry Symbols © Garry Paxton 2008–2017, © Steve Lee 2018–2026 · CC BY-SA · mulberrysymbols.org. Iris Green watermark identifies the composition, not ownership of the original pictograms.'
}:{
 any:'Cualquier edad',older:'Adolescencia · Adultez',context:'Contexto',print:'Imprimir / guardar PDF',
 note:'Puedes adaptar los pasos, quitar los que no necesites o cambiar el orden.',
 license:'Pictogramas usados en composiciones visuales: Mulberry Symbols © Garry Paxton 2008–2017, © Steve Lee 2018–2026 · CC BY-SA · mulberrysymbols.org. La marca Iris Green identifica la composición, no la autoría del pictograma original.'
};
function stageFor(meta){
 var s=(meta||'').toLowerCase();
 if(/coleg|trabajo|school|work|otras habilidades|other practical|dinero|money|trámite|transport|compra|shopping/.test(s)) return T.older;
 return T.any;
}
function cleanContext(meta){
 var s=(meta||'').split('·')[0].trim();
 return s||T.context;
}
function printRoutine(d){
 var was=d.open;
 d.open=true;
 d.setAttribute('data-printing','1');
 document.body.setAttribute('data-routine-print','1');
 var cleanup=function(){
   document.body.removeAttribute('data-routine-print');
   d.removeAttribute('data-printing');
   d.open=was;
   window.removeEventListener('afterprint',cleanup);
 };
 window.addEventListener('afterprint',cleanup);
 window.print();
 setTimeout(cleanup,1600);
}
document.querySelectorAll('details.routine').forEach(function(d){
 var body=d.querySelector('.routine-body'); if(!body)return;
 body.querySelectorAll('.meta').forEach(function(m){
   if(/^Referencia interna:|^Internal reference:/i.test((m.textContent||'').trim()))m.remove();
 });
 var meta=body.querySelector(':scope > p.meta');
 var publicMeta=document.createElement('p'); publicMeta.className='routine-public-meta';
 var stage=document.createElement('span'); stage.textContent=stageFor(meta&&meta.textContent);
 var ctx=document.createElement('span'); ctx.textContent=T.context+': '+cleanContext(meta&&meta.textContent);
 publicMeta.append(stage,ctx);
 if(meta)meta.insertAdjacentElement('afterend',publicMeta); else body.prepend(publicMeta);
 var note=document.createElement('p'); note.className='routine-library-license'; note.textContent=T.note; body.appendChild(note);
 var actions=document.createElement('div'); actions.className='routine-actions';
 var b=document.createElement('button'); b.type='button'; b.className='routine-download'; b.textContent=T.print;
 b.addEventListener('click',function(){printRoutine(d);});
 actions.appendChild(b); body.appendChild(actions);
 var wm=document.createElement('p'); wm.className='routine-watermark'; wm.textContent='IRIS GREEN · irisgreen.eu'; body.appendChild(wm);
 var lic=document.createElement('p'); lic.className='routine-license'; lic.textContent=T.license; body.appendChild(lic);
});
})();