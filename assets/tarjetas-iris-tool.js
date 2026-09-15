(function(){
'use strict';
var root=document.querySelector('[data-ti-tool]');if(!root)return;
var labels={
 situaciones:{label:'SITUACIONES',name:'Situaciones · lila'},
 vida:{label:'VIDA DIARIA',name:'Vida diaria · malva'},
 ayudas:{label:'AYUDAS Y TRÁMITES',name:'Ayudas · azul lavanda'},
 condiciones:{label:'CONDICIONES',name:'Condiciones · gris lavanda'}
};
var defaults={
 title:'Para mi cita',
 dificultad:'Recordar varias indicaciones seguidas cuando me las explican solo de palabra.',
 ayuda:'Que me expliquen una cosa cada vez y poder consultar los pasos por escrito.',
 necesito:'Llevarme por escrito las indicaciones importantes que tengo que seguir después de la cita.'
};
var examplePictos={
 dificultad:{value:defaults.dificultad,id:'hablar'},
 ayuda:{value:defaults.ayuda,id:'escribir'},
 necesito:{value:defaults.necesito,id:'esperar'}
};
var state={section:'situaciones'};
var $=function(s){return root.querySelector(s)},$$=function(s){return Array.from(root.querySelectorAll(s))};
function val(id){var el=$('#'+id);return el?el.value.trim():''}
function setVal(id,value){var el=$('#'+id);if(el)el.value=value||''}
function pictoFor(field,text){var item=examplePictos[field];return item&&text===item.value?item.id:null}
function support(field,text){var wrap=document.createElement('div');wrap.className='ti-card-support';var picto=pictoFor(field,text);if(picto){var img=document.createElement('img');img.src='/assets/mulberry/'+picto+'.svg';img.width=64;img.height=64;img.alt='';img.setAttribute('aria-hidden','true');wrap.append(img)}var p=document.createElement('p');p.textContent=text||'—';wrap.append(p);return wrap}
function render(){
 var card=$('#ti-card');card.dataset.section=state.section;
 $('#ti-type').innerHTML=labels[state.section].label+'<br>TARJETA PERSONAL';
 $('#ti-color-name').textContent=labels[state.section].name;
 $('#ti-card-title').textContent=val('ti-title')||'Tarjeta Iris';
 var difficulty=val('ti-dificultad'),help=val('ti-ayuda'),need=val('ti-necesito');
 var diff=$('#ti-preview-difficulty');diff.replaceChildren(support('dificultad',difficulty));
 var helpp=$('#ti-preview-help');helpp.replaceChildren(support('ayuda',help));
 var needp=$('#ti-preview-need');needp.replaceChildren(support('necesito',need));
 var hasPicto=Boolean(pictoFor('dificultad',difficulty)||pictoFor('ayuda',help)||pictoFor('necesito',need));
 card.dataset.irisPictoVariant=hasPicto?'B':'A';
 $$('[data-ti-section]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.tiSection===state.section))});
}
function reset(){state.section='situaciones';setVal('ti-title',defaults.title);setVal('ti-dificultad',defaults.dificultad);setVal('ti-ayuda',defaults.ayuda);setVal('ti-necesito',defaults.necesito);render()}
function applyQuery(){var q=new URLSearchParams(location.search),incoming=false;['title','dificultad','ayuda','necesito'].forEach(function(key){if(q.has(key)){setVal('ti-'+key,q.get(key).slice(0,key==='title'?60:160));incoming=true}});if(q.has('section')&&labels[q.get('section')]){state.section=q.get('section');incoming=true}if(incoming)render()}
function cardText(){var lines=['Iris Green · Tarjeta Iris','',val('ti-title'),''];if(val('ti-dificultad'))lines.push('Esto me cuesta: '+val('ti-dificultad'));if(val('ti-ayuda'))lines.push('Me ayuda: '+val('ti-ayuda'));if(val('ti-necesito'))lines.push('Necesito: '+val('ti-necesito'));lines.push('','irisgreen.eu');return lines.join('\n')}
$$('[data-ti-section]').forEach(function(button){button.addEventListener('click',function(){state.section=button.dataset.tiSection;render()})});
$$('input,textarea').forEach(function(el){el.addEventListener('input',render)});
$('#ti-reset').addEventListener('click',reset);
$('#ti-print').addEventListener('click',function(){window.print()});
$('#ti-copy').addEventListener('click',function(){var status=$('#ti-status'),text=cardText();function ok(){status.textContent='Texto copiado.'}function fail(){status.textContent='No se ha podido copiar. Selecciona el texto y cópialo manualmente.'}if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok,fail)}else{try{var area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.left='-9999px';document.body.append(area);area.select();document.execCommand('copy')?ok():fail();area.remove()}catch(error){fail()}}});
render();applyQuery();
})();
