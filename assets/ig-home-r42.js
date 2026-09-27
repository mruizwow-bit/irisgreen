/* Iris Green R42 · Home find-first.
   Reutiliza IGSearch, IGPreferences e IGChildSafety. No guarda etapa ni búsquedas. */
(function(){
'use strict';
if(!document.body||document.body.dataset.igHomeR42!=='true')return;
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const COPY={
 es:{
  explore:'Explorar',exploreSite:'Explorar Iris Green',quiet:'Rincón tranquilo',reading:'Lectura',music:'Música',language:'Idioma',pageTitle:'Iris Green · Neurodiversidad, información y recursos',
  eyebrow:'Neurodiversidad · Información y recursos',title:'Empieza por lo que necesitas',
  lead:'Busca una palabra o entra directamente por una sección.',
  searchLabel:'Buscar en Iris Green',placeholder:'Por ejemplo: ruido, instrucciones, transporte…',search:'Buscar',
  examples:'Por ejemplo:',ex1:'Ruido',ex2:'Instrucciones',ex3:'Ayudas',
  audience:'Contenido para…',audienceHint:'Esta elección es temporal. No pedimos edad, diagnóstico ni cuenta.',
  child:'Infancia',teen:'Adolescencia',adult:'Adultez',all:'Cualquier edad',
  results:'Resultados',none:'No hay coincidencias',noneHint:'Prueba otra palabra o entra por una sección.',
  more:'Ver más resultados',loading:'Cargando el buscador…',error:'No se ha podido cargar el buscador.',
  sections:'Explora Iris Green',sectionsLead:'Elige directamente el tipo de información o herramienta que necesitas.',
  start:'Empieza por aquí',also:'También puedes explorar',
  footer:'Base de conocimiento sobre neurodiversidad',
  about:'Sobre Iris Green',method:'Metodología',accessibility:'Accesibilidad',privacy:'Privacidad',
  reset:'Restablecer',close:'Cerrar',smaller:'Texto más pequeño',bigger:'Texto más grande',
  spacing:'Más espacio',contrast:'Más contraste',controls:'Botones grandes',guide:'Guía de lectura',motion:'Reducir movimiento'
 },
 en:{
  explore:'Explore',exploreSite:'Explore Iris Green',quiet:'Quiet space',reading:'Reading',music:'Music',language:'Language',pageTitle:'Iris Green · Neurodiversity, information and resources',
  eyebrow:'Neurodiversity · Information and resources',title:'Start with what you need',
  lead:'Search for a word or go straight to a section.',
  searchLabel:'Search Iris Green',placeholder:'For example: noise, instructions, transport…',search:'Search',
  examples:'For example:',ex1:'Noise',ex2:'Instructions',ex3:'Support',
  audience:'Content for…',audienceHint:'This choice is temporary. We do not ask for age, diagnosis or an account.',
  child:'Childhood',teen:'Adolescence',adult:'Adulthood',all:'Any age',
  results:'Results',none:'No matches',noneHint:'Try another word or choose a section.',
  more:'Show more results',loading:'Loading search…',error:'Search could not be loaded.',
  sections:'Explore Iris Green',sectionsLead:'Go straight to the kind of information or tool you need.',
  start:'Start here',also:'You can also explore',
  footer:'Neurodiversity knowledge base',
  about:'About Iris Green',method:'Methodology',accessibility:'Accessibility',privacy:'Privacy',
  reset:'Reset',close:'Close',smaller:'Smaller text',bigger:'Larger text',
  spacing:'More spacing',contrast:'More contrast',controls:'Larger buttons',guide:'Reading guide',motion:'Reduce motion'
 }
};
const SECTIONS=[
 {id:'situations',tone:'lilac',priority:1,es:['Situaciones','Lo que te pasa, explicado con ejemplos.','/es/situaciones/'],en:['Situations','Everyday experiences, explained with examples.','/en/situations/']},
 {id:'everyday',tone:'rose',priority:1,es:['Vida diaria','Apoyos y recursos para situaciones cotidianas.','/es/biblioteca/'],en:['Everyday life','Support and resources for everyday situations.','/en/everyday-life/']},
 {id:'support',tone:'blue',priority:1,es:['Ayudas','Qué puedes pedir y dónde solicitarlo.','/es/tramites/directorio/'],en:['Support','What you can ask for and where to apply.','/es/tramites/directorio/']},
 {id:'conditions',es:['Condiciones','Información organizada por temas.','/es/neurodiversidad/condiciones/'],en:['Conditions','Information organised by topic.','/en/neurodiversity/conditions/']},
 {id:'research',es:['Investigación','Estudios y explicaciones con contexto.','/es/investigacion/'],en:['Research','Studies and explanations with context.','/es/investigacion/']},
 {id:'data',es:['Datos','Cifras y fuentes para consultar.','/es/datos/'],en:['Data','Figures and sources to explore.','/en/data/']},
 {id:'videos',es:['Vídeos','Experiencias contadas en primera persona.','/es/videos/'],en:['Videos','First-person experiences.','/es/videos/']},
 {id:'resources',es:['Recursos','Juegos, rutinas y herramientas prácticas.','/es/recursos/'],en:['Resources','Games, routines and practical tools.','/en/resources/']},
 {id:'interests',es:['Tus intereses','Explora temas desde lo que te gusta.','/es/intereses/'],en:['Your interests','Explore topics through what you enjoy.','/en/interests/']},
 {id:'workshop',es:['El taller','Crea, prueba y construye proyectos.','/es/taller/'],en:['The workshop','Create, test and build projects.','/en/workshop/']},
 {id:'quiet',es:['Rincón tranquilo','Elige una imagen, un sonido o una pausa.','/es/sitio-tranquilo/'],en:['Quiet space','Choose an image, a sound or a pause.','/en/quiet-space/']},
 {id:'books',es:['Libros','Los libros de Iris Green.','/es/libros/'],en:['Books','Books by Iris Green.','/es/libros/']}
];
let lang=(new URLSearchParams(location.search).get('lang')==='en'?'en':'es'), shown=8, query='', results=[], opener=null;
const T=()=>COPY[lang];

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function sectionValue(s){return s[lang]||s.es;}
function drawSections(){
 const featured=$('#ig-home-featured'),grid=$('#ig-home-grid'),menu=$('#ig-home-menu-panel');
 if(!featured||!grid||!menu)return;
 const cards=SECTIONS.map(s=>{
   const v=sectionValue(s);
   return '<a class="ig-home-card" data-section="'+esc(s.id)+'"'+(s.priority?' data-priority="1"':'')+(s.tone?' data-tone="'+esc(s.tone)+'"':'')+' href="'+esc(v[2])+'"><h3>'+esc(v[0])+'</h3><p>'+esc(v[1])+'</p></a>';
 });
 featured.innerHTML=cards.slice(0,3).join('');
 grid.innerHTML=cards.slice(3).join('');
 menu.innerHTML=SECTIONS.map(s=>{const v=sectionValue(s);return '<a href="'+esc(v[2])+'"'+(s.id==='workshop'?' data-iris-top="workshop"':'')+(s.id==='interests'?' data-iris-top="interests"':'')+'>'+esc(v[0])+'</a>';}).join('');
 const quiet=SECTIONS.find(s=>s.id==='quiet');$('#ig-home-quiet').href=sectionValue(quiet)[2];
}
function translate(){
 document.documentElement.lang=lang;
 document.title=T().pageTitle;
 $$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(T()[key])el.textContent=T()[key];});
 $$('[data-i18n-label]').forEach(el=>{const key=el.dataset.i18nLabel;if(T()[key])el.setAttribute('aria-label',T()[key]);});
 $('#ig-home-q').placeholder=T().placeholder;
 $$('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
 drawSections();
 if(results.length)drawResults();
}

function audience(){
 const p=window.IGChildSafety;
 return p&&p.getAudience?p.getAudience():'all';
}
function setAudience(value){
 if(window.IGChildSafety&&IGChildSafety.setAudience)IGChildSafety.setAudience(value);
 $$('[data-audience]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.audience===value)));
 if(query)runSearch(query);
}
function drawAudience(){
 const a=audience()==='default'?'all':audience();
 $$('[data-audience]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.audience===a)));
}

function localItem(item){
 if(window.IGSearch&&IGSearch.localize)return IGSearch.localize(item,lang);
 return item;
}
function drawResults(){
 const box=$('#ig-home-results'),list=$('#ig-home-result-list'),empty=$('#ig-home-empty'),more=$('#ig-home-more'),count=$('#ig-home-result-count');
 box.hidden=false;
 const page=results.slice(0,shown);
 count.textContent=page.length+' / '+results.length;
 list.innerHTML=page.map(item=>{
   const x=localItem(item);
   return '<li><a href="'+esc(x.url||x.u||'/')+'"><span><small>'+esc(x.kind||x.s||x.area||'')+'</small><strong>'+esc(x.name||x.t||'')+'</strong>'+(x.hint||x.d?'<span>'+esc(x.hint||x.d)+'</span>':'')+'</span><span aria-hidden="true">→</span></a></li>';
 }).join('');
 empty.hidden=results.length!==0;
 more.hidden=shown>=results.length;
}
async function runSearch(value){
 query=String(value||'').trim().slice(0,160);
 $('#ig-home-q').value=query;
 const box=$('#ig-home-results'),status=$('#ig-home-search-status');
 if(!query){box.hidden=true;status.textContent='';return;}
 status.textContent=T().loading;
 try{
   const items=await window.IGSearch.load();
   results=window.IGSearch.rank(items,query,lang);
   shown=8;drawResults();status.textContent='';
   box.scrollIntoView({block:'start',behavior:'auto'});
   $('#ig-home-results-title').focus({preventScroll:true});
 }catch(_){results=[];drawResults();status.textContent=T().error;}
}

function syncPrefs(){
 if(!window.IGPreferences)return;
 const s=IGPreferences.get();
 $$('[data-pref]').forEach(b=>b.setAttribute('aria-pressed',String(!!s[b.dataset.pref])));
 $('#ig-home-size').textContent=Math.round((s.scale||1)*100)+'%';
 IGPreferences.apply();
}
function openReading(trigger){opener=trigger;syncPrefs();$('#ig-home-reading').showModal();}
function closeReading(){$('#ig-home-reading').close();}
$('#ig-home-reading').addEventListener('close',()=>opener&&opener.focus());

$('#ig-home-search-form').addEventListener('submit',e=>{e.preventDefault();runSearch($('#ig-home-q').value);});
$$('[data-example]').forEach(b=>b.addEventListener('click',()=>runSearch(lang==='en'?b.dataset.en:b.dataset.es)));
$$('[data-audience]').forEach(b=>b.addEventListener('click',()=>setAudience(b.dataset.audience)));
$$('[data-lang]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang==='en'?'en':'es';translate();if(query)runSearch(query);}));
$('#ig-home-more').addEventListener('click',()=>{shown+=8;drawResults();});
$('#ig-home-reading-open').addEventListener('click',e=>openReading(e.currentTarget));
$('#ig-home-reading-close').addEventListener('click',closeReading);
$('#ig-home-size-down').addEventListener('click',()=>{IGPreferences.step(-1);syncPrefs();});
$('#ig-home-size-up').addEventListener('click',()=>{IGPreferences.step(1);syncPrefs();});
$$('[data-pref]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.pref;const s=IGPreferences.get();IGPreferences.update({[k]:!s[k]});syncPrefs();}));
$('#ig-home-reset').addEventListener('click',()=>{IGPreferences.reset();syncPrefs();});
$('#ig-home-menu').addEventListener('keydown',e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary').focus();}});
document.addEventListener('click',e=>{const d=$('#ig-home-menu');if(d.open&&!d.contains(e.target))d.open=false;});

if(window.IGPreferences&&IGPreferences.mountTextOptions)IGPreferences.mountTextOptions($('#ig-home-text-options'));
if(window.IGPreferences&&IGPreferences.mountTransparencyOptions)IGPreferences.mountTransparencyOptions($('#ig-home-transparency-options'));
if(window.IGChildSafety&&IGChildSafety.subscribe)IGChildSafety.subscribe(drawAudience);
drawAudience();translate();syncPrefs();
})();