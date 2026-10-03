(function(){
'use strict';
if(window.IGR49)return;
var D=document,W=window,returnFocus=null,searchPromise=null;
function en(){return String(D.documentElement.lang||'').toLowerCase().indexOf('en')===0;}
var T={
 es:{home:'Inicio',conditions:'Condiciones',situations:'Situaciones',daily:'Vida diaria',research:'Investigación',resources:'Pictogramas y apoyos visuales',support:'Ayudas',data:'Datos',videos:'Vídeos',books:'Libros',workshop:'El taller',interests:'Tus intereses',quiet:'Rincón tranquilo',search:'Buscar',content:'Contenido',settings:'Accesibilidad',music:'Música',more:'Explorar',language:'EN',searchTitle:'Buscar en Iris Green',searchPh:'Escribe lo que necesitas',noResults:'No hay resultados. Prueba con otras palabras.',results:'resultados',safe:'Versión segura para esta vista',stageTitle:'Contenido para…',children:'0–12 años',teenagers:'13–17 años',adults:'18 años o más',any:'Todas las edades',defaultStage:'General',stageNote:'No pedimos fecha de nacimiento, identidad, diagnóstico ni cuenta. La elección dura solo esta sesión.',settingsTitle:'Accesibilidad y lectura',theme:'Tema',dark:'Navy oscuro',light:'Claro',size:'Tamaño del texto',spacing:'Más espaciado',controls:'Controles más grandes',contrast:'Más contraste',guide:'Guía de lectura',motion:'Reducir movimiento',speak:'Leer esta página',stopSpeak:'Detener lectura',reset:'Restablecer',close:'Cerrar',about:'Sobre Iris Green',accessibility:'Accesibilidad y lectura',privacy:'Privacidad',allNav:'Explorar Iris Green'},
 en:{home:'Home',conditions:'Conditions',situations:'Situations',daily:'Everyday life',research:'Research',resources:'Pictograms and visual supports',support:'Support',data:'Data',videos:'Videos',books:'Books',workshop:'The workshop',interests:'Your interests',quiet:'Quiet space',search:'Search',content:'Content',settings:'Accessibility',music:'Music',more:'Explore',language:'ES',searchTitle:'Search Iris Green',searchPh:'Write what you need',noResults:'No results. Try different words.',results:'results',safe:'Safer version for this view',stageTitle:'Content for…',children:'Ages 0–12',teenagers:'Ages 13–17',adults:'Ages 18+',any:'All ages',defaultStage:'General',stageNote:'We do not ask for date of birth, identity, diagnosis or an account. Your choice lasts only for this session.',settingsTitle:'Accessibility and reading',theme:'Theme',dark:'Dark navy',light:'Light',size:'Text size',spacing:'More spacing',controls:'Bigger controls',contrast:'More contrast',guide:'Reading guide',motion:'Reduce motion',speak:'Read this page',stopSpeak:'Stop reading',reset:'Reset',close:'Close',about:'About Iris Green',accessibility:'Accessibility and reading',privacy:'Privacy',allNav:'Explore Iris Green'}
};
function tr(){return en()?T.en:T.es;}
function h(tag,attrs){
 var n=D.createElement(tag);attrs=attrs||{};
 Object.keys(attrs).forEach(function(k){var v=attrs[k];if(v==null)return;if(k==='text')n.textContent=v;else if(k==='class')n.className=v;else if(k==='html')n.innerHTML=v;else n.setAttribute(k,String(v));});
 for(var i=2;i<arguments.length;i++){var c=arguments[i];if(c==null)continue;if(typeof c==='string')n.appendChild(D.createTextNode(c));else n.appendChild(c);}return n;
}
function routeData(){
 var E=en(),q=E?'?lang=en':'';
 return [
  {k:'conditions',href:E?'/en/neurodiversity/conditions/':'/es/neurodiversidad/condiciones/'},
  {k:'situations',href:E?'/en/situations/':'/es/situaciones/'},
  {k:'daily',href:E?'/en/everyday-life/':'/es/biblioteca/'},
  {k:'research',href:'/es/investigacion/'+q},
  {k:'resources',href:E?'/en/resources/':'/es/recursos/'},
  {k:'support',href:'/es/tramites/directorio/'+q},
  {k:'data',href:E?'/en/data/':'/es/datos/'},
  {k:'videos',href:'/es/videos/'+q},
  {k:'books',href:'/es/libros/'+q},
  {k:'workshop',href:E?'/en/workshop/':'/es/taller/'},
  {k:'interests',href:E?'/en/interests/':'/es/intereses/'},
  {k:'quiet',href:E?'/en/quiet-space/':'/es/sitio-tranquilo/'}
 ];
}
function cleanPath(v){try{return new URL(v,W.location.origin).pathname.replace(/\/+$/,'')||'/';}catch(_){return '';}}
function current(item){
 var p=cleanPath(W.location.href),x=cleanPath(item.href);
 if(x==='/'||x==='/en')return p===x;
 return p===x||p.indexOf(x+'/')===0;
}
function dialog(id,title){
 var old=D.getElementById(id);if(old)return old;
 var titleId=id+'-title';
 var d=h('dialog',{id:id,class:'ig-r49-dialog','aria-labelledby':titleId});
 var close=h('button',{type:'button',class:'ig-r49-close','aria-label':tr().close,text:'×'});
 var head=h('div',{class:'ig-r49-dialog-head'},h('h2',{id:titleId,text:title}),close);
 var body=h('div',{class:'ig-r49-dialog-body'});
 d.append(head,body);D.body.appendChild(d);
 close.addEventListener('click',function(){d.close();});
 d.addEventListener('close',function(){if(returnFocus&&D.contains(returnFocus))returnFocus.focus();returnFocus=null;});
 return d;
}
function openDialog(d,trigger){returnFocus=trigger||D.activeElement;if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');var first=d.querySelector('input,button,a,select,textarea');if(first)first.focus();}
function langHref(){
 var target=en()?'es':'en',path=location.pathname;
 if(['/es/videos/','/es/investigacion/','/es/libros/','/es/tramites/','/es/tramites/directorio/'].indexOf(path)!==-1){
  return path+'?lang='+target;
 }
 var alt=D.querySelector('link[rel~="alternate"][hreflang="'+target+'"]');
 if(alt&&alt.href){try{var u=new URL(alt.href,W.location.href);return u.pathname+u.search+u.hash;}catch(_){}}
 if(target==='en')return '/en/';
 return '/';
}
function stageLabel(){
 var t=tr(),v=W.IGAudience?W.IGAudience.get():'GENERAL';
 return ({AGE_0_12:t.children,AGE_13_17:t.teenagers,AGE_18_PLUS:t.adults,GENERAL:t.defaultStage,children:t.children,teenagers:t.teenagers,adults:t.adults,default:t.defaultStage})[v]||t.defaultStage;
}
function navLink(item){
 var a=h('a',{href:item.href,text:tr()[item.k]});if(current(item))a.setAttribute('aria-current','page');return a;
}
function upgradeHeader(){
 var header=D.querySelector('.ig-home-header,header.hd,.ig-uh,body>header');
 if(header&&header.closest('x-dc'))header=null;
 if(!header){header=h('header',{});var skip=Array.from(D.querySelectorAll('body > a.skip,body > a.ig-r49-skip,body > a.ig-home-skip')).find(function(a){return !a.closest('x-dc');});if(skip)skip.insertAdjacentElement('afterend',header);else D.body.insertBefore(header,D.body.firstChild);}
 if(header.dataset.igR49Upgraded==='true')return header;
 header.classList.remove('hd','ig-home-header','ig-uh');
 header.classList.add('ig-r49-global-header');header.dataset.igR49Upgraded='true';
 var inner=h('div',{class:'ig-r49-header-inner'}),brand=h('a',{class:'ig-r49-brand',href:en()?'/en/':'/',text:'Iris Green'}),tools=h('div',{class:'ig-r49-tools'});
 var music=h('button',{type:'button',class:'ig-r49-tool','data-ig-music':'','aria-expanded':'false','aria-label':tr().music},h('span',{text:tr().music}));
 var settings=h('button',{type:'button',class:'ig-r49-tool','data-ig-r49-settings':'','aria-label':tr().settings},h('span',{text:tr().settings}));
 var lang=h('a',{class:'ig-r49-lang',href:langHref(),lang:en()?'es':'en',text:tr().language});
 var age=h('button',{type:'button',class:'ig-r49-tool','data-ig-r49-stage':'','aria-label':tr().stageTitle},h('span',{class:'ig-r49-stage-state',text:stageLabel()}));
 tools.append(age,music,settings,lang);inner.append(brand,tools);header.replaceChildren(inner);
 age.addEventListener('click',function(){openAudience(age);});
 settings.addEventListener('click',function(){openSettings(settings);});
 return header;
}
function upgradeFooter(){
 var footer=D.querySelector('.ig-home-footer,footer.ft,body>footer');
 if(footer&&footer.closest('x-dc'))footer=null;
 if(!footer){footer=h('footer',{});D.body.appendChild(footer);}
 if(footer.dataset.igR49Upgraded==='true')return footer;
 footer.classList.remove('ft','ig-home-footer');
 footer.classList.add('ig-r49-global-footer');footer.dataset.igR49Upgraded='true';
 var inner=h('div',{class:'ig-r49-footer-inner'});
 var brand=h('div',{class:'ig-r49-footer-brand',text:'Iris Green'});
 var nav=h('nav',{class:'ig-r49-footer-nav','aria-label':tr().allNav});
 var about=en()?'/es/sobre-iris-green/?lang=en':'/es/sobre-iris-green/';
 var access=en()?'/es/lectura-accesible/?lang=en':'/es/lectura-accesible/';
 var privacy=en()?'/en/privacy/':'/es/privacidad/';
 [[about,tr().about],[access,tr().accessibility],[privacy,tr().privacy]].forEach(function(x){nav.appendChild(h('a',{href:x[0],text:x[1]}));});
 inner.append(brand,nav);footer.replaceChildren(inner);return footer;
}
function ensureSearch(){
 if(W.IGSearch)return Promise.resolve(W.IGSearch);
 if(searchPromise)return searchPromise;
 searchPromise=new Promise(function(resolve,reject){
  var s=h('script',{src:'/assets/buscador-comun.js'});s.addEventListener('load',function(){W.IGSearch?resolve(W.IGSearch):reject(new Error('IGSearch unavailable'));});s.addEventListener('error',reject);D.head.appendChild(s);
 });return searchPromise;
}
function searchItem(item){
 var a=h('a',{href:item.url}),title=h('strong',{text:item.name}),desc=h('span',{text:item.hint||item.full||''});a.append(title,desc);
 if(item.sensitivity==='S2_HIGH_SENSITIVITY')a.appendChild(h('small',{text:tr().safe}));return a;
}
function openSearch(trigger){
 var d=dialog('ig-r49-search',tr().searchTitle),body=d.querySelector('.ig-r49-dialog-body');
 if(!body.dataset.ready){
  body.dataset.ready='true';
  var form=h('form',{class:'ig-r49-search-form',role:'search'}),label=h('label',{class:'ig-r49-sr',for:'ig-r49-q',text:tr().searchTitle});
  var q=h('input',{id:'ig-r49-q',type:'search',autocomplete:'off',placeholder:tr().searchPh});
  var submit=h('button',{type:'submit',text:tr().search}),status=h('p',{class:'ig-r49-note',role:'status','aria-live':'polite'});
  var results=h('div',{class:'ig-r49-search-results'});form.append(label,q,submit);body.append(form,status,results);var seq=0;
  function paint(list){results.replaceChildren();list.slice(0,12).forEach(function(x){results.appendChild(searchItem(W.IGSearch.localize(x,en()?'en':'es')));});status.textContent=list.length?Math.min(list.length,12)+' '+tr().results:tr().noResults;}
  q.addEventListener('input',function(){var ticket=++seq,val=q.value.trim();results.replaceChildren();status.textContent='';if(val.length<2)return;ensureSearch().then(function(){return W.IGSearch.load();}).then(function(items){if(ticket!==seq)return;paint(W.IGSearch.rank(items,val,en()?'en':'es').slice(0,6));}).catch(function(){status.textContent=tr().noResults;});});
  form.addEventListener('submit',function(e){e.preventDefault();var val=q.value.trim();if(!val)return;var ticket=++seq;ensureSearch().then(function(){return W.IGSearch.search(val,{intentional:true,lang:en()?'en':'es'});}).then(function(items){if(ticket!==seq)return;paint(items);}).catch(function(){status.textContent=tr().noResults;});});
 }
 openDialog(d,trigger);
}
function openAudience(trigger){
 var d=dialog('ig-r49-audience',tr().stageTitle),body=d.querySelector('.ig-r49-dialog-body');
 body.replaceChildren();
 var pick=h('div',{class:'ig-r49-stage-picker','data-ig-audience-picker':''});
 [['GENERAL',tr().defaultStage],['AGE_0_12',tr().children],['AGE_13_17',tr().teenagers],['AGE_18_PLUS',tr().adults]].forEach(function(x){pick.appendChild(h('button',{type:'button','data-ig-audience-stage':x[0],'aria-pressed':'false',text:x[1]}));});
 body.append(pick,h('p',{class:'ig-r49-note',text:tr().stageNote}));
 if(W.IGAudience)W.IGAudience.mount(body);openDialog(d,trigger);
}
function prefToggle(key,label,container){
 var b=h('button',{type:'button',class:'ig-r49-settings-toggle',text:label});
 function sync(){var state=W.IGPreferences?W.IGPreferences.get():{};b.setAttribute('aria-pressed',String(!!state[key]));}
 b.addEventListener('click',function(){var state=W.IGPreferences.get();var p={};p[key]=!state[key];W.IGPreferences.update(p);sync();});sync();container.appendChild(b);return b;
}
function openSettings(trigger){
 var d=dialog('ig-r49-settings',tr().settingsTitle),body=d.querySelector('.ig-r49-dialog-body');body.replaceChildren();
 if(!W.IGPreferences){body.appendChild(h('p',{class:'ig-r49-note',text:tr().settingsTitle}));openDialog(d,trigger);return;}
 var box=h('div',{class:'ig-r49-settings'});
 if(W.IGTheme){
  var theme=h('div',{class:'ig-r49-settings-row'}),themeLabel=h('strong',{text:tr().theme});
  var dark=h('button',{type:'button','data-ig-theme-choice':'dark',text:tr().dark}),light=h('button',{type:'button','data-ig-theme-choice':'light',text:tr().light});
  theme.append(themeLabel,dark,light);box.appendChild(theme);W.IGTheme.mount(theme);
 }
 var row=h('div',{class:'ig-r49-settings-row'}),down=h('button',{type:'button',text:'A−'}),out=h('output',{text:Math.round(W.IGPreferences.get().scale*100)+'%'}),up=h('button',{type:'button',text:'A+'});
 down.addEventListener('click',function(){W.IGPreferences.step(-1);out.textContent=Math.round(W.IGPreferences.get().scale*100)+'%';});up.addEventListener('click',function(){W.IGPreferences.step(1);out.textContent=Math.round(W.IGPreferences.get().scale*100)+'%';});
 row.append(h('strong',{text:tr().size}),down,out,up);box.appendChild(row);
 ['spacing','controls','contrast','guide','motion'].forEach(function(k){prefToggle(k,tr()[k],box);});
 if(W.speechSynthesis){
  var speak=h('button',{type:'button',class:'ig-r49-settings-toggle','aria-pressed':'false',text:tr().speak});
  speak.addEventListener('click',function(){var on=speak.getAttribute('aria-pressed')==='true';W.speechSynthesis.cancel();W.IGPreferences.setSpeech(false);if(on){speak.setAttribute('aria-pressed','false');speak.textContent=tr().speak;return;}var main=D.querySelector('main');if(!main)return;var u=new SpeechSynthesisUtterance(main.innerText.slice(0,12000));u.lang=en()?'en-GB':'es-ES';u.rate=.95;u.onend=function(){speak.setAttribute('aria-pressed','false');speak.textContent=tr().speak;W.IGPreferences.setSpeech(false);};W.IGPreferences.setSpeech(true);W.speechSynthesis.speak(u);speak.setAttribute('aria-pressed','true');speak.textContent=tr().stopSpeak;});box.appendChild(speak);
 }
 var advanced=h('div',{id:'ig-r49-advanced-settings'});box.appendChild(advanced);W.IGPreferences.mountTextOptions(advanced);W.IGPreferences.mountTransparencyOptions(advanced);
 var reset=h('button',{type:'button',text:tr().reset});reset.addEventListener('click',function(){W.IGPreferences.reset();d.close();});box.appendChild(reset);
 box.appendChild(h('p',{class:'ig-r49-note',role:'status',text:W.IGPreferences.status(en()?'en':'es')}));body.appendChild(box);D.dispatchEvent(new CustomEvent('ig:panel-opening',{detail:'reading'}));openDialog(d,trigger);
}
function openMore(trigger){
 var d=dialog('ig-r49-more',tr().allNav),body=d.querySelector('.ig-r49-dialog-body');body.replaceChildren();var nav=h('nav',{class:'ig-r49-more-nav','aria-label':tr().allNav});
 routeData().forEach(function(x){if(!W.IGAudience||!W.IGAudience.childRouteBlocked(x.href))nav.appendChild(navLink(x));});body.appendChild(nav);openDialog(d,trigger);
}
function updateStage(){
 var label=stageLabel();
 D.querySelectorAll('.ig-r49-stage-state').forEach(function(x){x.textContent=label;});
 D.querySelectorAll('[data-ig-r49-stage]').forEach(function(x){x.setAttribute('aria-label',tr().stageTitle+': '+label);});
}
function ensureSkip(){
 var existing=Array.from(D.querySelectorAll('a.skip,a.ig-home-skip,a.ig-r49-skip')).find(function(a){return !a.closest('x-dc');});
 if(existing)return;var main=Array.from(D.querySelectorAll('main')).find(function(m){return !m.closest('x-dc');})||D.querySelector('main');if(!main)return;if(!main.id)main.id='main';var a=h('a',{class:'ig-r49-skip',href:'#'+main.id,text:en()?'Skip to content':'Ir al contenido'});D.body.insertBefore(a,D.body.firstChild);
}
function ensurePageTools(){
 if(D.body.hasAttribute('data-ig-home-version'))return;
 var main=D.querySelector('main');if(!main)return;
 /* #369 P20/P21: global navigation already supplies context.
    Do not recreate legacy Home/Inicio breadcrumbs after the build removes them. */
 if(D.body.getAttribute('data-ig-r49-owner')!=='R50_DATA'||D.body.getAttribute('data-ig-profile')!=='browse'||main.querySelector('[data-ig-data-search]'))return;
 var first=main.querySelector('.cards'),heading=main.querySelector('h1');if(!first||!heading)return;
 var groupHeading=first.previousElementSibling;
 var notes=h('details',{class:'ig-data-notes'},h('summary',{text:en()?'About these figures':'Cómo leer estas cifras'}));
 while(heading.nextElementSibling&&heading.nextElementSibling!==groupHeading){notes.appendChild(heading.nextElementSibling);}
 if(notes.children.length>1)main.appendChild(notes);
 heading.textContent=tr().data;
 var label=h('label',{for:'ig-data-query',text:en()?'Search data by topic or country':'Buscar datos por tema o país'});
 var q=h('input',{id:'ig-data-query',type:'search',autocomplete:'off'}),status=h('p',{role:'status','aria-live':'polite'});
 var finder=h('section',{class:'secfind','data-ig-data-search':''},label,q,status);heading.insertAdjacentElement('afterend',finder);
 function filter(){var term=q.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(),count=0;
  main.querySelectorAll('.cards').forEach(function(group){var visible=0;group.querySelectorAll('a.card').forEach(function(card){var match=card.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(term);var age=!W.IGAudience||W.IGAudience.allowedAgeBands(card.getAttribute('data-ig-age-bands')||[]);card.hidden=!(match&&age);if(!card.hidden)visible++;});group.hidden=!visible;var title=group.previousElementSibling;if(title&&title.tagName==='H2')title.hidden=!visible;count+=visible;});
  status.textContent=count+(en()?' results':' resultados');
 }
 q.addEventListener('input',filter);W.addEventListener('ig:audience-change',filter);filter();
}
function start(){
 if(!D.body)return;
 if(!D.body.hasAttribute('data-ig-r49'))D.body.setAttribute('data-ig-r49','1');
 if(!D.body.hasAttribute('data-ig-profile'))D.body.setAttribute('data-ig-profile','content');
 ensureSkip();upgradeHeader();upgradeFooter();updateStage();
 W.addEventListener('ig:audience-change',updateStage);
 ensurePageTools();
 var toolsQueued=false;new MutationObserver(function(){if(toolsQueued)return;toolsQueued=true;requestAnimationFrame(function(){toolsQueued=false;ensurePageTools();});}).observe(D.body,{childList:true,subtree:true});
 D.addEventListener('ig:panel-opening',function(e){if(e.detail==='music'){var d=D.getElementById('ig-r49-settings');if(d&&d.open)d.close();}});
}
/* This file is loaded with defer by the canonical shell. Run as soon as the parsed
   body exists instead of waiting one more turn for DOMContentLoaded: the legacy
   header/footer must never be the first painted interface. */
if(D.body)start();else D.addEventListener('DOMContentLoaded',start,{once:true});
W.IGR49=Object.freeze({version:'R49-1',refreshStage:updateStage});
})();
