(function(){
'use strict';
if(window.IGR49)return;
var D=document,W=window,returnFocus=null,searchPromise=null;
function en(){return String(D.documentElement.lang||'').toLowerCase().indexOf('en')===0;}
var T={
 es:{home:'Inicio',conditions:'Condiciones',situations:'Situaciones',daily:'Vida diaria',research:'Investigación',resources:'Recursos',support:'Ayudas',data:'Datos',videos:'Vídeos',books:'Libros',workshop:'El taller',interests:'Tus intereses',quiet:'Rincón tranquilo',search:'Buscar',content:'Contenido',settings:'Lectura',more:'Más',language:'EN',searchTitle:'Buscar en Iris Green',searchPh:'Escribe lo que necesitas',noResults:'No hay resultados. Prueba con otras palabras.',results:'resultados',safe:'Versión segura para esta vista',stageTitle:'Contenido para…',children:'Infancia',teenagers:'Adolescencia',adults:'Adultez',any:'Cualquier edad',defaultStage:'Protección por defecto',stageNote:'No pedimos fecha de nacimiento, identidad, diagnóstico ni cuenta. La elección dura solo esta sesión.',settingsTitle:'Lectura y accesibilidad',size:'Tamaño del texto',spacing:'Más espaciado',controls:'Controles más grandes',contrast:'Más contraste',guide:'Guía de lectura',motion:'Reducir movimiento',speak:'Leer esta página',stopSpeak:'Detener lectura',reset:'Restablecer',close:'Cerrar',about:'Sobre Iris Green',accessibility:'Accesibilidad y lectura',privacy:'Privacidad',allNav:'Explorar Iris Green'},
 en:{home:'Home',conditions:'Conditions',situations:'Situations',daily:'Everyday life',research:'Research',resources:'Resources',support:'Support',data:'Data',videos:'Videos',books:'Books',workshop:'The workshop',interests:'Your interests',quiet:'Quiet space',search:'Search',content:'Content',settings:'Reading',more:'More',language:'ES',searchTitle:'Search Iris Green',searchPh:'Write what you need',noResults:'No results. Try different words.',results:'results',safe:'Safer version for this view',stageTitle:'Content for…',children:'Children',teenagers:'Teenagers',adults:'Adults',any:'Any age',defaultStage:'Safe by default',stageNote:'We do not ask for date of birth, identity, diagnosis or an account. Your choice lasts only for this session.',settingsTitle:'Reading and accessibility',size:'Text size',spacing:'More spacing',controls:'Bigger controls',contrast:'More contrast',guide:'Reading guide',motion:'Reduce motion',speak:'Read this page',stopSpeak:'Stop reading',reset:'Reset',close:'Close',about:'About Iris Green',accessibility:'Accessibility and reading',privacy:'Privacy',allNav:'Explore Iris Green'}
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
 var d=h('dialog',{id:id,class:'ig-r49-dialog'});
 var close=h('button',{type:'button',class:'ig-r49-close','aria-label':tr().close,text:'×'});
 var head=h('div',{class:'ig-r49-dialog-head'},h('h2',{text:title}),close);
 var body=h('div',{class:'ig-r49-dialog-body'});
 d.append(head,body);D.body.appendChild(d);
 close.addEventListener('click',function(){d.close();});
 d.addEventListener('close',function(){if(returnFocus&&D.contains(returnFocus))returnFocus.focus();returnFocus=null;});
 return d;
}
function openDialog(d,trigger){returnFocus=trigger||D.activeElement;if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');var first=d.querySelector('input,button,a,select,textarea');if(first)first.focus();}
function langHref(){
 var target=en()?'es':'en',alt=D.querySelector('link[rel~="alternate"][hreflang="'+target+'"]');
 if(alt&&alt.href)return alt.href;
 if(target==='en')return '/en/';
 return '/';
}
function stageLabel(){
 var t=tr(),v=W.IGAudience?W.IGAudience.get():'default';
 return ({children:t.children,teenagers:t.teenagers,adults:t.adults,any:t.any,default:t.defaultStage})[v]||t.defaultStage;
}
function navLink(item){
 var a=h('a',{href:item.href,text:tr()[item.k]});if(current(item))a.setAttribute('aria-current','page');return a;
}
function upgradeHeader(){
 var headers=Array.from(D.querySelectorAll('header,.ig-uh')).filter(function(x){return !x.closest('x-dc')&&!x.classList.contains('ig-r42-topbar')&&!x.closest('dialog');});
 var header=headers[0];
 if(!header){header=h('header',{});D.body.insertBefore(header,D.body.firstChild);}
 if(header.dataset.igR49Upgraded==='true')return header;
 header.classList.add('ig-r49-global-header');header.dataset.igR49Upgraded='true';
 var inner=h('div',{class:'ig-r49-header-inner'});
 var brand=h('a',{class:'ig-r49-brand',href:en()?'/en/':'/',text:'Iris Green'});
 var primary=h('nav',{class:'ig-r49-primary','aria-label':tr().allNav});
 routeData().slice(0,5).forEach(function(x){primary.appendChild(navLink(x));});
 var tools=h('div',{class:'ig-r49-tools'});
 var search=h('button',{type:'button',class:'ig-r49-tool','data-ig-r49-search':'','aria-label':tr().search},h('span',{text:tr().search}));
 var stage=h('button',{type:'button',class:'ig-r49-tool','data-ig-r49-stage':'','aria-label':tr().stageTitle},h('span',{text:tr().content+': '}),h('strong',{class:'ig-r49-stage-state',text:stageLabel()}));
 var settings=h('button',{type:'button',class:'ig-r49-tool','data-ig-r49-settings':'','aria-label':tr().settingsTitle},h('span',{text:tr().settings}));
 var lang=h('a',{class:'ig-r49-lang',href:langHref(),lang:en()?'es':'en',text:tr().language});
 var more=h('button',{type:'button',class:'ig-r49-tool','data-ig-r49-more':'','aria-label':tr().allNav,text:tr().more});
 tools.append(search,stage,settings,lang,more);inner.append(brand,primary,tools);header.appendChild(inner);
 search.addEventListener('click',function(){openSearch(search);});
 stage.addEventListener('click',function(){openAudience(stage);});
 settings.addEventListener('click',function(){openSettings(settings);});
 more.addEventListener('click',function(){openMore(more);});
 return header;
}
function upgradeFooter(){
 var footers=Array.from(D.querySelectorAll('footer')).filter(function(x){return !x.closest('x-dc')&&!x.closest('dialog');});
 var footer=footers[0];
 if(!footer){footer=h('footer',{});D.body.appendChild(footer);}
 if(footer.dataset.igR49Upgraded==='true')return footer;
 footer.classList.add('ig-r49-global-footer');footer.dataset.igR49Upgraded='true';
 var inner=h('div',{class:'ig-r49-footer-inner'});
 var brand=h('div',{class:'ig-r49-footer-brand',text:'Iris Green'});
 var nav=h('nav',{class:'ig-r49-footer-nav','aria-label':tr().allNav});
 var about=en()?'/es/sobre-iris-green/?lang=en':'/es/sobre-iris-green/';
 var access=en()?'/es/lectura-accesible/?lang=en':'/es/lectura-accesible/';
 var privacy=en()?'/en/privacy/':'/es/privacidad/';
 [[about,tr().about],[access,tr().accessibility],[privacy,tr().privacy]].forEach(function(x){nav.appendChild(h('a',{href:x[0],text:x[1]}));});
 inner.append(brand,nav);footer.appendChild(inner);return footer;
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
 [['children',tr().children],['teenagers',tr().teenagers],['adults',tr().adults],['any',tr().any]].forEach(function(x){pick.appendChild(h('button',{type:'button','data-ig-audience-stage':x[0],'aria-pressed':'false',text:x[1]}));});
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
 var box=h('div',{class:'ig-r49-settings'}),row=h('div',{class:'ig-r49-settings-row'}),down=h('button',{type:'button',text:'A−'}),out=h('output',{text:Math.round(W.IGPreferences.get().scale*100)+'%'}),up=h('button',{type:'button',text:'A+'});
 down.addEventListener('click',function(){W.IGPreferences.step(-1);out.textContent=Math.round(W.IGPreferences.get().scale*100)+'%';});up.addEventListener('click',function(){W.IGPreferences.step(1);out.textContent=Math.round(W.IGPreferences.get().scale*100)+'%';});
 row.append(h('strong',{text:tr().size}),down,out,up);box.appendChild(row);
 ['spacing','controls','contrast','guide','motion'].forEach(function(k){prefToggle(k,tr()[k],box);});
 if(W.speechSynthesis){
  var speak=h('button',{type:'button',class:'ig-r49-settings-toggle','aria-pressed':'false',text:tr().speak});
  speak.addEventListener('click',function(){var on=speak.getAttribute('aria-pressed')==='true';W.speechSynthesis.cancel();W.IGPreferences.setSpeech(false);if(on){speak.setAttribute('aria-pressed','false');speak.textContent=tr().speak;return;}var main=D.querySelector('main');if(!main)return;var u=new SpeechSynthesisUtterance(main.innerText.slice(0,12000));u.lang=en()?'en-GB':'es-ES';u.rate=.95;u.onend=function(){speak.setAttribute('aria-pressed','false');speak.textContent=tr().speak;W.IGPreferences.setSpeech(false);};W.IGPreferences.setSpeech(true);W.speechSynthesis.speak(u);speak.setAttribute('aria-pressed','true');speak.textContent=tr().stopSpeak;});box.appendChild(speak);
 }
 var advanced=h('div',{id:'ig-r49-advanced-settings'});box.appendChild(advanced);W.IGPreferences.mountTextOptions(advanced);W.IGPreferences.mountTransparencyOptions(advanced);
 var reset=h('button',{type:'button',text:tr().reset});reset.addEventListener('click',function(){W.IGPreferences.reset();d.close();});box.appendChild(reset);
 box.appendChild(h('p',{class:'ig-r49-note',role:'status',text:W.IGPreferences.status(en()?'en':'es')}));body.appendChild(box);openDialog(d,trigger);
}
function openMore(trigger){
 var d=dialog('ig-r49-more',tr().allNav),body=d.querySelector('.ig-r49-dialog-body');body.replaceChildren();var nav=h('nav',{class:'ig-r49-more-nav','aria-label':tr().allNav});
 routeData().forEach(function(x){nav.appendChild(navLink(x));});body.appendChild(nav);openDialog(d,trigger);
}
function updateStage(){
 D.querySelectorAll('.ig-r49-stage-state').forEach(function(x){x.textContent=stageLabel();});
}
function ensureSkip(){
 if(D.querySelector('a.skip,a.ig-home-skip,a.ig-r49-skip'))return;var main=D.querySelector('main');if(!main)return;if(!main.id)main.id='main';var a=h('a',{class:'ig-r49-skip',href:'#'+main.id,text:en()?'Skip to content':'Ir al contenido'});D.body.insertBefore(a,D.body.firstChild);
}
function start(){ensureSkip();upgradeHeader();upgradeFooter();updateStage();W.addEventListener('ig:audience-change',updateStage);}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',start,{once:true});else start();
W.IGR49=Object.freeze({version:'R49-1',refreshStage:updateStage});
})();