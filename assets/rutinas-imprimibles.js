/* Iris Green · Rutinas imprimibles. Hojas A4 con pictogramas, listas para imprimir. Sin servidor, sin datos personales. */
(function(){
'use strict';
var D=window.IG_RUTINAS_IMPRIMIBLES_DATA,X=(D&&D.pictos)||window.IG_PICTOS||{};if(!D||!D.packs)return;
var root=document.getElementById('im-app');if(!root)return;
var BASE=root.getAttribute('data-base')||'/assets/pictogramas/';
var LANG=(document.documentElement.lang||'es').indexOf('en')===0?'en':'es';
var RV=LANG==='en'?'/en/resources/visual-routines/':'/es/recursos/rutinas-visuales/';
var GAMES=LANG==='en'?'/en/resources/games/':'/es/recursos/juegos/';
var U={
 es:{tipos:{rutinas:'Rutinas paso a paso',tarjetas:'Tarjetas para recortar',tableros:'Tableros',packs:'Packs completos'},
  fmts:{pasos:'Hoja de pasos',lista:'Lista para marcar',tira:'Tira para la nevera',recortar:'Tarjetas de la rutina'},
  fmtL:'Cómo quieres la hoja',tema:'Tema',edad:'Edad',eligeEtapa:'Elige una etapa de vida',etapaAyuda:'Puedes elegir una etapa o ver todas las rutinas. Puedes cambiarla en cualquier momento.',verTodas:'Ver todas',buscar:'Buscar',buscarPh:'Por ejemplo: dientes, lavadora, autobús',
  n:function(n,w){return n+' '+(n===1?w[0]:w[1]);},wR:['rutina','rutinas'],wT:['tema','temas'],wB:['tablero','tableros'],wP:['pack','packs'],
  pasos:function(n){return n===1?'1 paso':n+' pasos';},hojas:function(n){return n===1?'1 hoja A4':n+' hojas A4';},tarj:function(n){return n+' tarjetas';},
  imprimir:'Imprimir',ver:'Ver la hoja',volver:'Todas las hojas',imprimirPdf:'Imprimir o guardar en PDF',descargarSvg:'Descargar SVG A4',descargando:'Preparando la descarga…',descargaOk:'Descarga preparada.',descargaError:'No se pudo preparar la descarga. Puedes usar «Imprimir o guardar en PDF».',contexto:'Contexto',etapasTxt:'Etapa',licenciaTxt:'Pictogramas y licencia',
  bn:'Blanco y negro (ahorra tinta)',nombre:'Añadir «Rutina de: ____»',jugar:'Jugar con esta rutina',adaptar:'Cambiarla en Rutinas visuales',
  queHay:'Qué hay en la hoja',opc:'Opciones',sinRes:'No hay hojas con esa búsqueda. Prueba con otra palabra o elige «Todos».',
  rutinaDe:'Rutina de:',nombreL:'Nombre:',nombreB:'Añadir «Nombre: ____»',hecho:'Hecho',recorta:'Recorta por la línea de puntos.',pega:'Pega aquí',
  semana:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],semanaT:'Mi semana',
  boards:{pd:['Primero → Después',['Primero','Después']],pld:['Primero · Luego · Después',['Primero','Luego','Después']],hh:['Por hacer · Hecho',['Por hacer','Hecho']],mtn:['Mañana · Tarde · Noche',['Mañana','Tarde','Noche']],sem:['Mi semana',null]},
  boardD:'Tablero vacío para pegar tarjetas. Las tarjetas están en «Tarjetas para recortar».',
  todos:'Todos',cualquier:'Cualquier edad',printing:'Preparando la hoja…',hojaDe:function(a,b){return 'Hoja '+a+' de '+b;},
  prev:'Vista previa de la hoja',incl:'Incluye'},
 en:{tipos:{rutinas:'Step-by-step routines',tarjetas:'Cards to cut out',tableros:'Boards',packs:'Full packs'},
  fmts:{pasos:'Steps sheet',lista:'Tick list',tira:'Fridge strip',recortar:'Routine cards'},
  fmtL:'How you want the sheet',tema:'Topic',edad:'Age',eligeEtapa:'Choose a stage of life',etapaAyuda:'Choose a stage or view all routines. You can change it at any time.',verTodas:'View all',buscar:'Search',buscarPh:'For example: teeth, washing, bus',
  n:function(n,w){return n+' '+(n===1?w[0]:w[1]);},wR:['routine','routines'],wT:['topic','topics'],wB:['board','boards'],wP:['pack','packs'],
  pasos:function(n){return n===1?'1 step':n+' steps';},hojas:function(n){return n===1?'1 A4 sheet':n+' A4 sheets';},tarj:function(n){return n+' cards';},
  imprimir:'Print',ver:'View the sheet',volver:'All sheets',imprimirPdf:'Print or save as PDF',descargarSvg:'Download A4 SVG',descargando:'Preparing download…',descargaOk:'Download ready.',descargaError:'The download could not be prepared. You can use “Print or save as PDF”.',contexto:'Context',etapasTxt:'Stage of life',licenciaTxt:'Pictograms and licence',
  bn:'Black and white (saves ink)',nombre:'Add “Routine for: ____”',jugar:'Play with this routine',adaptar:'Change it in Visual routines',
  queHay:'What is on the sheet',opc:'Options',sinRes:'No sheets match that search. Try another word or choose “All”.',
  rutinaDe:'Routine for:',nombreL:'Name:',nombreB:'Add “Name: ____”',hecho:'Done',recorta:'Cut along the dotted line.',pega:'Stick here',
  semana:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],semanaT:'My week',
  boards:{pd:['First → Then',['First','Then']],pld:['First · Next · Then',['First','Next','Then']],hh:['To do · Done',['To do','Done']],mtn:['Morning · Afternoon · Evening',['Morning','Afternoon','Evening']],sem:['My week',null]},
  boardD:'Empty board to stick cards on. The cards are in “Cards to cut out”.',
  todos:'All',cualquier:'Any age',printing:'Getting the sheet ready…',hojaDe:function(a,b){return 'Sheet '+a+' of '+b;},
  prev:'Sheet preview',incl:'Includes'}
}[LANG];
function L(o){return o?(o[LANG]||o.es||''):'';}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function pic(k){var p=X[k];return p?{f:p[0],t:LANG==='en'?p[2]:p[1]}:{f:'',t:k};}
function img(f,mm){return f?'<img src="'+esc(BASE+f)+'" alt="" loading="lazy" decoding="async" style="width:'+mm+'mm;height:'+mm+'mm">':'';}
var AT=L(D.atrib)||'',MARCA=D.marca||'IRIS GREEN · irisgreen.eu';
var CATS={};(D.cats||[]).forEach(function(c){CATS[c.id]=c;});
var ETAPAS={};(D.etapas||[]).forEach(function(e){ETAPAS[e.id]=e;});
var BOARDS=['pd','pld','hh','mtn','sem'];
var S={tipo:'rutinas',fmt:'pasos',cat:'todos',etapa:'',stageChosen:false,q:'',vista:'lista',id:null,bn:false,nombre:true,msg:''};

/* ---------- las hojas ---------- */
function foot(){return '<div class="sh-f"><span>'+esc(AT)+'</span><b>'+esc(MARCA)+'</b></div>';}
function head(t,conNombre,lab){return '<div class="sh-h"><h2 class="sh-t">'+esc(t)+'</h2>'+(conNombre?'<div class="sh-name">'+esc(lab||U.rutinaDe)+'<span></span></div>':'')+'</div>';}
function sheet(inner,land){return '<div class="im-sheet'+(land?' land':'')+'">'+inner+foot()+'</div>';}
function hojaPasos(t,ks,nombre){
 var n=ks.length,cols=n<=4?1:2,rows=Math.ceil(n/cols),pm=cols===1?(n<=3?62:48):(rows<=3?44:36);
 var h='<div class="st-grid" style="grid-template-columns:repeat('+cols+',1fr);grid-template-rows:repeat('+rows+',1fr);flex:1">';
 ks.forEach(function(k,i){var p=pic(k);h+='<div class="st'+(cols===1?' row':'')+'"><span class="st-n">'+(i+1)+'</span>'+(cols===1?img(p.f,pm)+'<div class="st-c"><b style="font-size:7.2mm">'+esc(p.t)+'</b></div>':'<div class="st-c">'+img(p.f,pm)+'<b>'+esc(p.t)+'</b></div>')+'</div>';});
 return sheet(head(t,nombre)+'<div class="sh-body">'+h+'</div></div>');
}
function hojaLista(t,ks,nombre){
 var pm=ks.length<=5?30:24,h='<div class="ls-h">'+esc(U.hecho)+'</div>';
 ks.forEach(function(k,i){var p=pic(k);h+='<div class="ls"><span class="st-n">'+(i+1)+'</span>'+img(p.f,pm)+'<b>'+esc(p.t)+'</b><i></i></div>';});
 return sheet(head(t,nombre)+'<div class="sh-body" style="align-content:start;gap:0">'+h+'</div>');
}
function hojaTira(t,ks){
 var n=ks.length,pm=n<=4?30:n<=6?24:19,one='<div class="tr"><div class="tr-t">'+esc(t)+'</div><div class="tr-s" style="grid-template-columns:repeat('+n+',1fr)">';
 ks.forEach(function(k,i){var p=pic(k);one+='<div><span>'+(i+1)+'</span>'+img(p.f,pm)+'<b>'+esc(p.t)+'</b></div>';});one+='</div></div>';
 return sheet('<p class="cut">'+esc(U.recorta)+'</p><div class="sh-body" style="grid-template-rows:repeat(3,auto);align-content:space-around">'+one+one+one+'</div>');
}
function hojasTarjetas(t,items){
 var out=[],per=12;for(var i=0;i<items.length;i+=per){var h='<div class="cd-grid" style="grid-template-rows:repeat(4,1fr)">';
  for(var j=i;j<i+per;j++){var it=items[j];h+=it?'<div class="cd">'+img(it.f,40)+'<b>'+esc(it.t)+'</b></div>':'<div class="cd"></div>';}
  out.push(sheet(head(t+(items.length>per?' · '+(i/per+1)+'/'+Math.ceil(items.length/per):''),false)+'<p class="cut">'+esc(U.recorta)+'</p>'+h+'</div>'));}
 return out;
}
function hojaTablero(id){
 var b=U.boards[id];if(id==='sem'){var h='<div class="wk">';U.semana.forEach(function(d){h+='<div><h3>'+esc(d)+'</h3>'+'<div class="bd-slot"></div>'.repeat(5)+'</div>';});return sheet(head(U.semanaT,S.nombre,U.nombreL)+h+'</div>',true);}
 var cols=b[1],two=cols.length===2&&id==='pd',h2='<div class="bd" style="grid-template-columns:'+(two?'1fr 16mm 1fr':'repeat('+cols.length+',1fr)')+'">';
 cols.forEach(function(c,i){if(two&&i===1)h2+='<div class="bd-arrow" aria-hidden="true">→</div>';var slots=id==='pd'?1:id==='hh'?6:4;
  h2+='<div class="bd-col"><h3>'+esc(c)+'</h3><div class="bd-slots" style="grid-template-rows:repeat('+slots+',1fr)">'+('<div class="bd-slot">'+esc(U.pega)+'</div>').repeat(slots)+'</div></div>';});
 return sheet(head(b[0],S.nombre,U.nombreL)+h2+'</div>');
}

/* ---------- catálogo ---------- */
function packBy(s){for(var i=0;i<D.packs.length;i++)if(D.packs[i].s===s)return D.packs[i];return null;}
function cardItems(ks){var seen={},out=[];ks.forEach(function(k){var p=pic(k);if(p.f&&!seen[p.f]){seen[p.f]=1;out.push(p);}});return out;}
function temaItems(c){return (D.tarjetas&&D.tarjetas[c]||[]).map(function(x){return {f:x[0],t:LANG==='en'?x[2]:x[1]};});}
function itemsTipo(){
 if(S.tipo==='rutinas')return D.packs.filter(function(p){var e=p.e||['todas'];return (S.cat==='todos'||p.c===S.cat)&&(!S.etapa||e.indexOf(S.etapa)>=0||e.indexOf('todas')>=0)&&(!S.q||norm(L(p.t)+' '+p.pasos.map(function(k){return pic(k).t;}).join(' ')).indexOf(norm(S.q))>=0);}).map(function(p){return {id:'r:'+p.s,t:L(p.t),p:p};});
 if(S.tipo==='tarjetas')return (D.cats||[]).filter(function(c){return c.id!=='todos'&&temaItems(c.id).length&&(!S.q||norm(L(c.l)+' '+temaItems(c.id).map(function(x){return x.t;}).join(' ')).indexOf(norm(S.q))>=0);}).map(function(c){return {id:'t:'+c.id,t:L(c.l)};});
 if(S.tipo==='tableros')return BOARDS.map(function(b){return {id:'b:'+b,t:U.boards[b][0]};});
 return (D.megapacks||[]).filter(function(m){return !S.q||norm(L(m.t)+' '+L(m.d)).indexOf(norm(S.q))>=0;}).map(function(m){return {id:'p:'+m.s,t:L(m.t),m:m};});
}
function sheetsFor(id){
 var k=id.slice(0,1),s=id.slice(2);
 if(k==='r'){var p=packBy(s);if(!p)return [];var t=L(p.t);
  if(S.fmt==='lista')return [hojaLista(t,p.pasos,S.nombre)];if(S.fmt==='tira')return [hojaTira(t,p.pasos)];if(S.fmt==='recortar')return hojasTarjetas(t,cardItems(p.pasos));return [hojaPasos(t,p.pasos,S.nombre)];}
 if(k==='t')return hojasTarjetas(L(CATS[s]&&CATS[s].l),temaItems(s));
 if(k==='b')return [hojaTablero(s)];
 if(k==='p'){var m=(D.megapacks||[]).filter(function(x){return x.s===s;})[0];if(!m)return [];return m.packs.map(packBy).filter(Boolean).map(function(p){return hojaPasos(L(p.t),p.pasos,S.nombre);});}
 return [];
}
function metaFor(it,n){
 var k=it.id.slice(0,1);
 if(k==='r')return U.pasos(it.p.pasos.length)+' · '+U.hojas(n);
 if(k==='t')return U.tarj(temaItems(it.id.slice(2)).length)+' · '+U.hojas(n);
 if(k==='b')return U.hojas(1);
 return U.n(it.m.packs.length,U.wR)+' · '+U.hojas(n);
}
function fit(el){var s=el.querySelector('.im-sheet');if(!s)return;var w=s.classList.contains('land')?1122.5:793.7;el.style.setProperty('--k',(el.clientWidth/w).toFixed(4));}
var RO=window.ResizeObserver?new ResizeObserver(function(es){es.forEach(function(e){fit(e.target);});}):null;
var IO=window.IntersectionObserver?new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;IO.unobserve(el);fill(el);});},{rootMargin:'600px 0px'}):null;
function fill(el){var id=el.getAttribute('data-thumb');if(!id||el.firstChild)return;el.innerHTML=sheetsFor(id)[0]||'';fit(el);if(RO)RO.observe(el);}
function fitAll(){Array.prototype.forEach.call(root.querySelectorAll('.im-fit'),function(el){if(el.hasAttribute('data-thumb')){if(IO)IO.observe(el);else fill(el);return;}fit(el);if(RO)RO.observe(el);});}
function thumb(html,extra){var land=html.indexOf('im-sheet land')>=0;return '<div class="im-fit '+(land?'land':'por')+(S.bn?' im-bn':'')+'"'+(extra||' aria-hidden="true"')+'>'+html+'</div>';}
function chip(a,on,label,cls){return '<button type="button" class="'+(cls||'im-chip')+'" data-act="'+a+'" aria-pressed="'+(on?'true':'false')+'">'+label+'</button>';}
function hashFor(id){var k=id.slice(0,1),s=id.slice(2);return '#'+(k==='r'?'pack':k==='t'?'tarjetas':k==='b'?'tablero':'todo')+'-'+s+(k==='r'&&S.fmt!=='pasos'?'~'+S.fmt:'');}
function etapasOrdenadas(){
 var by={};(D.etapas||[]).forEach(function(e){by[e.id]=e;});
 return ['inf','ado','adu','todas'].map(function(id){return by[id];}).filter(Boolean);
}
function etapaAplicaPack(p,id){
 var e=p.e||['todas'];
 if(!id)return true;
 return id==='todas'?e.indexOf('todas')>=0:(e.indexOf(id)>=0||e.indexOf('todas')>=0);
}
function etapaPackCount(id){return D.packs.filter(function(p){return etapaAplicaPack(p,id);}).length;}
function etapaPackPreview(id){
 var keys=[];
 D.packs.filter(function(p){return etapaAplicaPack(p,id);}).slice(0,5).forEach(function(p){
  (p.pasos||[]).forEach(function(k){if(keys.indexOf(k)<0)keys.push(k);});
 });
 return keys.slice(0,3);
}
function screenPic(k){
 var p=pic(k);return p.f?'<img src="'+esc(BASE+p.f)+'" alt="" loading="lazy" decoding="async">':'';
}
function etapaCard(et){
 var ks=etapaPackPreview(et.id);
 return '<button type="button" class="im-stage-card" data-act="stage:'+esc(et.id)+'">'+
  '<span class="im-stage-art" aria-hidden="true">'+ks.map(screenPic).join('')+'</span>'+
  '<span class="im-stage-copy"><strong>'+esc(L(et.l))+'</strong><span>'+esc(U.n(etapaPackCount(et.id),U.wR))+'</span></span><span aria-hidden="true" class="im-stage-arrow">→</span></button>';
}
function etapaLanding(){
 return '<section class="im-stage-entry" aria-labelledby="im-stage-title"><div class="im-stage-head"><p class="im-kicker">'+esc(U.edad)+'</p>'+
  '<h2 id="im-stage-title">'+esc(U.eligeEtapa)+'</h2><p>'+esc(U.etapaAyuda)+'</p></div>'+
  '<div class="im-stage-grid">'+etapasOrdenadas().map(etapaCard).join('')+'</div>'+
  '<p class="im-stage-all">'+chip('stage:all',false,esc(U.verTodas),'im-btn pri')+'</p></section>';
}
function etapaRail(){
 var all=S.stageChosen&&!S.etapa;
 return '<div class="im-stage-rail" aria-label="'+esc(U.eligeEtapa)+'">'+
  chip('stage:all',all,esc(U.verTodas),'im-chip')+
  etapasOrdenadas().map(function(et){return chip('stage:'+et.id,S.stageChosen&&S.etapa===et.id,esc(L(et.l)),'im-chip');}).join('')+'</div>';
}
function catalogo(){
 if(S.tipo==='rutinas'&&!S.stageChosen)return etapaLanding();
 var counts={rutinas:D.packs.length,tarjetas:(D.cats||[]).filter(function(c){return c.id!=='todos'&&temaItems(c.id).length;}).length,tableros:BOARDS.length,packs:(D.megapacks||[]).length};
 var w={rutinas:U.wR,tarjetas:U.wT,tableros:U.wB,packs:U.wP};
 var h='<div class="im-tabs" role="group" aria-label="'+esc(U.fmtL)+'">';Object.keys(U.tipos).forEach(function(t){h+=chip('tipo:'+t,S.tipo===t,esc(U.tipos[t])+' <small>'+esc(U.n(counts[t],w[t]))+'</small>','im-tab');});h+='</div>';if(S.tipo==='rutinas')h+=etapaRail();
 h+='<div class="im-filters">';
 if(S.tipo==='rutinas'){
  h+='<div class="im-row"><span class="im-lab" id="im-l-fmt">'+esc(U.fmtL)+'</span><div class="im-chips" role="group" aria-labelledby="im-l-fmt">';Object.keys(U.fmts).forEach(function(f){h+=chip('fmt:'+f,S.fmt===f,esc(U.fmts[f]));});h+='</div></div>';
  h+='<div class="im-row"><span class="im-lab" id="im-l-cat">'+esc(U.tema)+'</span><div class="im-chips" role="group" aria-labelledby="im-l-cat">';(D.cats||[]).forEach(function(c){h+=chip('cat:'+c.id,S.cat===c.id,esc(L(c.l)));});h+='</div></div>';
 }
 if(S.tipo!=='tableros')h+='<div class="im-row"><label class="im-lab" for="im-q">'+esc(U.buscar)+'</label><input class="im-q" id="im-q" type="search" autocomplete="off" placeholder="'+esc(U.buscarPh)+'" value="'+esc(S.q)+'"></div>';
 else h+='<p class="im-note">'+esc(U.boardD)+'</p>';
 h+='</div>';
 var its=itemsTipo();
 h+='<p class="im-count" role="status" aria-live="polite">'+esc(its.length?U.n(its.length,w[S.tipo]):'')+'</p>';
 if(!its.length)return h+'<p class="im-empty">'+esc(U.sinRes)+'</p>';
 h+='<ul class="im-grid">';
 its.forEach(function(it){var sh=sheetsFor(it.id);var href=hashFor(it.id),land=sh[0].indexOf('im-sheet land')>=0;
  h+='<li class="im-card"><div class="im-fit '+(land?'land':'por')+(S.bn?' im-bn':'')+'" aria-hidden="true" data-thumb="'+esc(it.id)+'"></div>'+'<h3><a href="'+href+'" data-open="'+esc(it.id)+'">'+esc(it.t)+'</a></h3><p class="im-meta">'+esc(metaFor(it,sh.length))+'</p><div class="im-acts"><button type="button" class="im-btn pri" data-print="'+esc(it.id)+'" aria-label="'+esc(U.imprimir+': '+it.t)+'">'+esc(U.imprimir)+'</button><a class="im-btn" href="'+href+'" data-open="'+esc(it.id)+'">'+esc(U.ver)+'</a></div></li>';});
 return h+'</ul>';
}
function detalle(){
 var id=S.id,k=id.slice(0,1),s=id.slice(2),sh=sheetsFor(id),t,steps=null,p=null,m=null;
 if(k==='r'){p=packBy(s);t=L(p.t);steps=p.pasos.map(function(x){return pic(x).t;});}
 else if(k==='t'){t=U.tipos.tarjetas+' · '+L(CATS[s].l);steps=temaItems(s).map(function(x){return x.t;});}
 else if(k==='b'){t=U.boards[s][0];}
 else {m=(D.megapacks||[]).filter(function(x){return x.s===s;})[0];t=L(m.t);steps=m.packs.map(packBy).filter(Boolean).map(function(q){return L(q.t);});}
 var h='<p><button type="button" class="im-btn" data-act="volver"><span aria-hidden="true">←</span> '+esc(U.volver)+'</button></p><div class="im-detail"><div class="im-pages" aria-label="'+esc(U.prev)+'" role="group">';
 sh.forEach(function(x,i){h+=thumb(x,' role="img" aria-label="'+esc(sh.length>1?U.hojaDe(i+1,sh.length):U.prev)+'"');});
 h+='</div><div class="im-side"><h1 id="im-h1" tabindex="-1">'+esc(t)+'</h1><p class="im-meta">'+esc(k==='r'?U.pasos(p.pasos.length)+' · '+U.hojas(sh.length):U.hojas(sh.length))+'</p>';
 if(k==='r'){h+='<div class="im-box"><h2 id="im-l-f2">'+esc(U.fmtL)+'</h2><div class="im-chips" role="group" aria-labelledby="im-l-f2">';Object.keys(U.fmts).forEach(function(f){h+=chip('fmt:'+f,S.fmt===f,esc(U.fmts[f]));});h+='</div></div>';}
 h+='<div class="im-box"><h2>'+esc(U.opc)+'</h2><label class="im-check"><input type="checkbox" id="im-bn"'+(S.bn?' checked':'')+'> '+esc(U.bn)+'</label>'+((k==='r'&&(S.fmt==='pasos'||S.fmt==='lista'))||k==='p'||k==='b'?'<label class="im-check"><input type="checkbox" id="im-nombre"'+(S.nombre?' checked':'')+'> '+esc(k==='b'?U.nombreB:U.nombre)+'</label>':'')+'</div>';
 h+='<p class="im-acts"><button type="button" class="im-btn pri" data-print="'+esc(id)+'">'+esc(U.imprimirPdf)+'</button>'+(k==='r'?'<button type="button" class="im-btn" data-download="'+esc(id)+'">'+esc(U.descargarSvg)+'</button>':'')+'</p><p class="im-note" role="status" aria-live="polite">'+esc(S.msg)+'</p>';
 if(k==='r'){var g=D.links&&D.links[s],stage=(p.e||['todas']).map(function(e){return ETAPAS[e]?L(ETAPAS[e].l):e;}).join(' · '),cat=CATS[p.c]?L(CATS[p.c].l):p.c;
   h+='<div class="im-box im-context"><h2>'+esc(U.contexto)+'</h2><p>'+esc(cat)+'</p><p><strong>'+esc(U.etapasTxt)+':</strong> '+esc(stage)+'</p></div>';
   h+='<div class="im-box im-provenance"><h2>'+esc(U.licenciaTxt)+'</h2><p>'+esc(AT)+'</p><p><a href="https://mulberrysymbols.org/" rel="noopener">mulberrysymbols.org</a></p></div>';
   h+='<p class="im-acts">'+(g?'<a class="im-btn" href="'+GAMES+'#juego-'+esc(g)+'">'+esc(U.jugar)+'</a>':'')+'<a class="im-btn" href="'+RV+'?rutina='+encodeURIComponent(s)+'">'+esc(U.adaptar)+'</a></p>';}
 if(steps)h+='<div class="im-box"><h2>'+esc(k==='p'?U.incl:U.queHay)+'</h2><ol>'+steps.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol></div>';
 else if(k==='b')h+='<p class="im-note">'+esc(U.boardD)+'</p>';
 return h+'</div></div>';
}

/* ---------- imprimir ---------- */
function printId(id){
 var out=document.getElementById('im-print');if(!out){out=document.createElement('div');out.id='im-print';document.body.appendChild(out);}
 out.className=S.bn?'im-bn':'';out.innerHTML=sheetsFor(id).join('');
 var imgs=out.querySelectorAll('img');Array.prototype.forEach.call(imgs,function(i){i.loading='eager';});
 var go=function(){document.documentElement.classList.add('im-printing');var clean=function(){document.documentElement.classList.remove('im-printing');window.removeEventListener('afterprint',clean);};window.addEventListener('afterprint',clean);window.print();setTimeout(clean,1500);};
 var left=Array.prototype.filter.call(imgs,function(i){return !i.complete;});if(!left.length){go();return;}
 var n=left.length,done=false,one=function(){if(--n<=0&&!done){done=true;go();}};left.forEach(function(i){i.addEventListener('load',one);i.addEventListener('error',one);});setTimeout(function(){if(!done){done=true;go();}},4000);
}

function textEncoderBase64(text){
 var bytes=new TextEncoder().encode(text),bin='',chunk=0x8000;
 for(var i=0;i<bytes.length;i+=chunk)bin+=String.fromCharCode.apply(null,bytes.subarray(i,Math.min(i+chunk,bytes.length)));
 return btoa(bin);
}
function xml(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c];});}
async function pictogramData(k){
 var p=pic(k);if(!p.f)return '';
 var r=await fetch(BASE+p.f,{credentials:'same-origin'});if(!r.ok)throw new Error('PICTOGRAM_FETCH_FAILED');
 var svg=await r.text();return 'data:image/svg+xml;base64,'+textEncoderBase64(svg);
}
async function downloadRoutineSvg(id){
 var slug=id.slice(2),p=packBy(slug);if(!p)throw new Error('ROUTINE_NOT_FOUND');
 S.msg=U.descargando;render();
 try{
  var W=794,H=1123,title=L(p.t),n=p.pasos.length,cols=n<=4?1:2,rows=Math.ceil(n/cols);
  var gap=18,top=120,bottom=92,cellW=(W-64-gap*(cols-1))/cols,cellH=(H-top-bottom-gap*(rows-1))/rows;
  var images=await Promise.all(p.pasos.map(pictogramData)),parts=[
   '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 '+W+' '+H+'" role="img" aria-labelledby="title desc">',
   '<title id="title">'+xml(title)+'</title><desc id="desc">'+xml(p.pasos.map(function(k){return pic(k).t;}).join('. '))+'</desc>',
   '<rect width="'+W+'" height="'+H+'" fill="white"/>',
   '<text x="32" y="54" font-family="Georgia,serif" font-size="28" fill="#17395c">'+xml(title)+'</text>',
   '<text x="32" y="84" font-family="Arial,sans-serif" font-size="14" fill="#435268">'+xml((CATS[p.c]?L(CATS[p.c].l):p.c)+' · '+(p.e||['todas']).map(function(e){return ETAPAS[e]?L(ETAPAS[e].l):e;}).join(' · '))+'</text>'
  ];
  p.pasos.forEach(function(k,i){
   var col=i%cols,row=Math.floor(i/cols),x=32+col*(cellW+gap),y=top+row*(cellH+gap),im=Math.min(112,cellH-54),px=x+14,py=y+14;
   parts.push('<rect x="'+x+'" y="'+y+'" width="'+cellW+'" height="'+cellH+'" rx="16" fill="#f7f9fc" stroke="#b9cbd8"/>');
   parts.push('<circle cx="'+(x+25)+'" cy="'+(y+25)+'" r="15" fill="#17395c"/><text x="'+(x+25)+'" y="'+(y+30)+'" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="white">'+(i+1)+'</text>');
   if(images[i])parts.push('<image href="'+images[i]+'" x="'+px+'" y="'+py+'" width="'+im+'" height="'+im+'" preserveAspectRatio="xMidYMid meet"/>');
   parts.push('<text x="'+(px+im+14)+'" y="'+(y+cellH/2+5)+'" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#17395c">'+xml(pic(k).t)+'</text>');
  });
  parts.push('<line x1="32" y1="'+(H-66)+'" x2="'+(W-32)+'" y2="'+(H-66)+'" stroke="#b9cbd8"/>');
  parts.push('<text x="32" y="'+(H-42)+'" font-family="Arial,sans-serif" font-size="10" fill="#435268">'+xml(AT)+'</text>');
  parts.push('<text x="'+(W-32)+'" y="'+(H-20)+'" text-anchor="end" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#17395c">IRIS GREEN · irisgreen.eu</text></svg>');
  var blob=new Blob([parts.join('')],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=slug+'-iris-green.svg';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);
  S.msg=U.descargaOk;render();
 }catch(e){S.msg=U.descargaError;render();}
}

/* ---------- estado ---------- */
var focusH=false,focusSel=null;
function render(){
 var hero=document.getElementById('im-hero');if(hero)hero.hidden=S.vista!=='lista';
 root.className='im jg';root.innerHTML=S.vista==='hoja'?detalle():catalogo();fitAll();
 var q=document.getElementById('im-q');if(q)q.addEventListener('input',function(){S.q=q.value;var pos=q.selectionStart;render();var n=document.getElementById('im-q');if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(e){}}});
 var bn=document.getElementById('im-bn');if(bn)bn.addEventListener('change',function(){S.bn=bn.checked;render();var n=document.getElementById('im-bn');if(n)n.focus();});
 var nm=document.getElementById('im-nombre');if(nm)nm.addEventListener('change',function(){S.nombre=nm.checked;render();var n=document.getElementById('im-nombre');if(n)n.focus();});
 var base=LANG==='en'?'Printable routines · Iris Green':'Rutinas imprimibles · Iris Green',h1=document.getElementById('im-h1');document.title=S.vista==='hoja'&&h1?h1.textContent+' · '+base:base;
 if(focusH&&h1){focusH=false;h1.focus();}else if(focusSel){var el=root.querySelector(focusSel);if(el)el.focus();focusSel=null;}
}
function abrir(id,push){S.vista='hoja';S.id=id;S.msg='';focusH=true;if(push!==false){try{history.pushState(null,'',hashFor(id));}catch(e){location.hash=hashFor(id);}}render();window.scrollTo(0,Math.max(0,root.getBoundingClientRect().top+window.scrollY-24));}
function volver(){var id=S.id;S.vista='lista';S.id=null;try{history.pushState(null,'',location.pathname+location.search);}catch(e){}if(id){var t={r:'rutinas',t:'tarjetas',b:'tableros',p:'packs'}[id.slice(0,1)];if(t)S.tipo=t;focusSel='[data-open="'+id+'"]';}render();}
function leer(){var h=decodeURIComponent(location.hash||''),m=h.match(/^#(pack|tarjetas|tablero|todo|mega)-([^~]+)(?:~(\w+))?$/);if(!m)return false;
 var k={pack:'r',tarjetas:'t',tablero:'b',todo:'p',mega:'p'}[m[1]],id=k+':'+m[2];
 if(k==='r'&&!packBy(m[2]))return false;if(k==='b'&&BOARDS.indexOf(m[2])<0)return false;if(k==='t'&&!temaItems(m[2]).length)return false;if(k==='p'&&!(D.megapacks||[]).some(function(x){return x.s===m[2];}))return false;
 if(m[3]&&U.fmts[m[3]])S.fmt=m[3];S.tipo={r:'rutinas',t:'tarjetas',b:'tableros',p:'packs'}[k];S.vista='hoja';S.id=id;focusH=true;return true;}
root.addEventListener('click',function(e){
 var o=e.target.closest('[data-open]');if(o&&root.contains(o)){e.preventDefault();abrir(o.getAttribute('data-open'));return;}
 var p=e.target.closest('[data-print]');if(p&&root.contains(p)){e.preventDefault();S.msg=U.printing;printId(p.getAttribute('data-print'));return;}
 var d=e.target.closest('[data-download]');if(d&&root.contains(d)){e.preventDefault();downloadRoutineSvg(d.getAttribute('data-download'));return;}
 var a=e.target.closest('[data-act]');if(!a||!root.contains(a))return;var v=a.getAttribute('data-act'),i=v.indexOf(':'),k=i<0?v:v.slice(0,i),x=i<0?'':v.slice(i+1);
 if(k==='volver'){volver();return;}
 if(k==='stage'){S.stageChosen=true;S.etapa=x==='all'?'':x;S.cat='todos';S.q='';}
 else if(k==='tipo'){S.tipo=x;S.q='';}else if(k==='fmt'){S.fmt=x;if(S.vista==='hoja'){try{history.replaceState(null,'',hashFor(S.id));}catch(er){}}}else if(k==='cat')S.cat=x;else if(k==='et')S.etapa=x==='x'?'':x;
 focusSel='[data-act="'+v+'"]';render();
});
window.addEventListener('popstate',function(){if(!leer()){S.vista='lista';S.id=null;}render();});
window.addEventListener('hashchange',function(){if(leer())render();});
var initialStage=(location.hash||'').match(/^#etapa-(inf|ado|adu|todas|all)$/);
if(initialStage){
 S.stageChosen=true;S.etapa=initialStage[1]==='all'?'':initialStage[1];
 try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
}
leer();render();
})();
