/* Iris Green · Juegos. Sin dependencias. Nada suena ni se mueve solo. */
(function(){
'use strict';
var D=window.IG_JUEGOS_DATA;if(!D)return;
var root=document.getElementById('jg-app');if(!root)return;
var BASE=root.getAttribute('data-base')||'/assets/pictogramas/';
var UI={
 es:{h1:'Juegos',lede:'297 juegos prácticos para situaciones cotidianas. Sin tiempo, sin puntos y sin prisa. Nada suena ni se mueve hasta que tú lo decides.',crumb:'Recursos',crumbHref:'/es/recursos/',
  buscar:'Buscar un juego',buscarPh:'Por ejemplo: mochila, ducha, autobús',practica:'¿Qué quieres practicar?',moreOptions:'Más opciones',hideOptions:'Ocultar opciones',clearContext:'Quitar filtro de contexto',temas:'Temas',n:function(n){return n===1?'1 juego':n+' juegos';},sinRes:'No hay juegos con esa palabra. Prueba con otra o elige «Todos».',
  jugar:'Jugar',todos:'Todos los juegos',menos:'Menos opciones',ayuda:'Ayúdame',otraVez:'Empezar otra vez',imprimir:'Imprimir',
  parte:function(a,b){return 'Parte '+a+' de '+b;},vacio:'Todavía está vacío.',listo:'Ya está',seguir:'Seguir',otroJuego:'Elegir otro juego',
  minutos:'Minutos',parar:'Parar',empezar:'Empezar',pausar:'Pausar',seguirReloj:'Seguir',
  atrib:'Pictogramas: Mulberry Symbols, © Garry Paxton 2008-2017 y © Steve Lee 2018-2026, licencia CC BY-SA 4.0 · mulberrysymbols.org. Otros dibujos: Iris Green.',
  bien:'Bien. Sigue.',masAdelante:'Ese va más adelante. Prueba otro.',otroMomento:'Eso va en otro momento. Prueba otra.',noHueco:'Ese no va en el hueco. Prueba otro.',
  noEncaja:'Ahí no acaba de encajar. Prueba otro sitio.',noJuntas:'Esas dos no van juntas. Prueba otra.',primeroIzq:'Primero toca una imagen de la izquierda.',
  anadido:'Añadido.',quitado:'Quitado.',huecosLlenos:'Los huecos están llenos. Quita uno para cambiar.',hechoT:'Ya está.',hechoFin:'Lo has terminado a tu ritmo.',hechoParte:'Esta parte está hecha.',
  eseEs:'Ese es el primero.',intrusoOk:'Eso es. No va con lo demás.',ayudaOrden:'Mira el que tiene el borde de puntos.',ayudaGen:'Te marco una opción con borde de puntos.',
  tiraOrden:'Tu secuencia',tiraSig:'Lo que ya ha pasado',tiraFalta:'La secuencia',tiraMia:'Tu plan',vuelta:'¿Dónde va esto?',
  hechos:function(a,b){return a+' de '+b+' hechos';},elegidos:function(a,m){return a<m?'Llevas '+a+'. Elige al menos '+m+'.':'Llevas '+a+'. Puedes seguir o pulsar «Ya está».';},
  hecho:'Hecho',subir:'Mover antes',bajar:'Mover después',quitar:'Quitar',minL:function(m){return m===1?'1 minuto':m+' minutos';},
  mitad:'Queda la mitad.',poco:'Queda poco.',finReloj:'Se acabó el tiempo.',relojListo:'Preparado cuando tú quieras.',
  hojaOrden:'Pasos en orden.',hojaLista:'Marca cada casilla cuando lo hayas hecho.',hojaPlan:'Mi plan.',elige:'Buena elección. Sigue cuando quieras.',
  objetos:'Objetos',conEsto:'Con esto',meLoPongo:'Lo que me pongo',juego:'Juego',etapa:'Etapa',todasEdades:'Todas las edades',contexto:'Situación',tipo:'Tipo de juego',todosTipos:'Todos',dur:function(m){return 'Unos '+m+' minutos';},imprimible:'Descargar el imprimible',encontrados:function(a,b){return a+' de '+b+' encontradas';},noEsta:'Eso no está en la lista. Prueba otra.',pareja:'¡Pareja!',noPareja:'No son iguales. Se vuelven a tapar.',carta:'Carta tapada',tuEleccion:'Tu elección',libreOk:'Anotado.',resumen:'Así queda tu plan.'},
 en:{h1:'Games',lede:'297 practical games for everyday situations. No timer, no points and no rush. Nothing plays or moves until you decide.',crumb:'Resources',crumbHref:'/en/resources/',
  buscar:'Search for a game',buscarPh:'For example: backpack, shower, bus',practica:'What do you want to practise?',moreOptions:'More options',hideOptions:'Hide options',clearContext:'Clear context filter',temas:'Topics',n:function(n){return n===1?'1 game':n+' games';},sinRes:'No games match that word. Try another or choose “All”.',
  jugar:'Play',todos:'All games',menos:'Fewer options',ayuda:'Help me',otraVez:'Start again',imprimir:'Print',
  parte:function(a,b){return 'Part '+a+' of '+b;},vacio:'It is still empty.',listo:'Done',seguir:'Continue',otroJuego:'Choose another game',
  minutos:'Minutes',parar:'Stop',empezar:'Start',pausar:'Pause',seguirReloj:'Resume',
  atrib:'Pictograms: Mulberry Symbols, © Garry Paxton 2008-2017 and © Steve Lee 2018-2026, CC BY-SA 4.0 licence · mulberrysymbols.org. Other drawings: Iris Green.',
  bien:'Good. Keep going.',masAdelante:'That one comes later. Try another.',otroMomento:'That happens at another time. Try another.',noHueco:'That one does not go in the gap. Try another.',
  noEncaja:'It does not quite fit there. Try another place.',noJuntas:'Those two do not go together. Try another.',primeroIzq:'First tap a picture on the left.',
  anadido:'Added.',quitado:'Taken out.',huecosLlenos:'The spaces are full. Take one out to change.',hechoT:'Done.',hechoFin:'You finished it at your own pace.',hechoParte:'This part is done.',
  eseEs:'That is the first one.',intrusoOk:'That is it. It does not go with the rest.',ayudaOrden:'Look at the one with the dotted border.',ayudaGen:'I have marked one option with a dotted border.',
  tiraOrden:'Your sequence',tiraSig:'What has happened so far',tiraFalta:'The sequence',tiraMia:'Your plan',vuelta:'Where does this go?',
  hechos:function(a,b){return a+' of '+b+' done';},elegidos:function(a,m){return a<m?'You have '+a+'. Choose at least '+m+'.':'You have '+a+'. Keep going or press “Done”.';},
  hecho:'Done',subir:'Move earlier',bajar:'Move later',quitar:'Take out',minL:function(m){return m===1?'1 minute':m+' minutes';},
  mitad:'Half the time is left.',poco:'Not much time left.',finReloj:'Time is up.',relojListo:'Ready when you are.',
  hojaOrden:'Steps in order.',hojaLista:'Tick each box when you have done it.',hojaPlan:'My plan.',elige:'Good choice. Continue when you like.',
  objetos:'Objects',conEsto:'Match with',meLoPongo:'What I am wearing',juego:'Game',etapa:'Stage of life',todasEdades:'All ages',contexto:'Situation',tipo:'Type of game',todosTipos:'All',dur:function(m){return 'About '+m+' minutes';},imprimible:'Download the printable',encontrados:function(a,b){return a+' of '+b+' found';},noEsta:'That is not on the list. Try another.',pareja:'A pair!',noPareja:'They do not match. They turn back over.',carta:'Face-down card',tuEleccion:'Your choice',libreOk:'Noted.',resumen:'This is your plan.'}
};
var S={lang:(document.documentElement.lang||'es').indexOf('en')===0?'en':'es',vista:'lista',gi:null,fi:0,red:false,ayuda:false,msg:null,hecha:false,cat:'todos',etapa:null,tipo:null,q:'',adv:false,d:{}};
var A=[],lastKey=null,focusHead=false;

function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function U(){var u=UI[S.lang];if(D.atrib)u.atrib=D.atrib[S.lang];return u;}
function L(o){return o?(o[S.lang]||o.es||''):'';}
function pk(k){var x=D.pictos[k];if(!x)return {img:'',l:k};return {img:BASE+x[0],l:S.lang==='en'?x[2]:x[1]};}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function mezcla(arr,seed){var a=arr.slice(),x=hash(seed)||1;for(var i=a.length-1;i>0;i--){x=(Math.imul(x,1103515245)+12345)>>>0;var j=x%(i+1),t=a[i];a[i]=a[j];a[j]=t;}
 if(a.length>1&&a.every(function(v,i){return v===arr[i];}))a.push(a.shift());return a;}
function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function act(fn){A.push(fn);return A.length-1;}
function juego(){return S.gi===null?null:D.juegos[S.gi];}
function fases(){var j=juego();if(!j)return [];return j.f.filter(function(f){return !(S.red&&f.soloNormal);}).map(function(f){return S.red&&f.red?Object.assign({},f,f.red):f;});}
function fase(){return fases()[S.fi]||null;}
function dd(){return S.d[S.fi]||(S.d[S.fi]={});}
function put(patch,msg,hecha){Object.assign(dd(),patch);if(msg!==undefined)S.msg=msg;S.ayuda=false;if(hecha)S.hecha=true;}
function say(t){S.msg=t?{t:t,k:'guia'}:null;}
function ok(t){return {t:t,k:'ok'};}
function seed(x){var j=juego();return (j?j.s:'')+'|'+S.fi+'|'+(S.red?1:0)+'|'+(x||'');}

function img(src,cls){return '<img src="'+esc(src)+'" alt=""'+(cls?' class="'+cls+'"':'')+' loading="lazy" decoding="async">';}
function tile(k,o,fn){o=o||{};var p=pk(k),c='jg-tile'+(o.on?' is-on':'')+(o.hint?' is-hint':'');
 return '<button type="button" class="'+c+'" draggable="true" data-a="'+act(fn||function(){})+'" data-k="t-'+esc(k)+'" aria-pressed="'+(o.on?'true':'false')+'">'+
  (o.badge?'<span class="jg-badge" aria-hidden="true">'+esc(o.badge)+'</span>':'')+img(p.img)+'<span class="jg-tile-l">'+esc(p.l)+'</span>'+
  (o.estado?'<span class="jg-tile-e">'+esc(o.estado)+'</span>':'')+'</button>';}
function grid(html){return '<div class="jg-grid">'+html+'</div>';}
function slotLleno(k,o){o=o||{};var p=pk(k);return '<li class="jg-slot'+(o.flecha?' has-arrow':'')+'">'+(o.flecha?'<span class="jg-arrow" aria-hidden="true">→</span>':'')+
 '<span class="jg-slot-card">'+(o.n?'<span class="jg-num">'+esc(o.n)+'</span>':'')+(o.etiqueta?'<span class="jg-slot-tag">'+esc(o.etiqueta)+'</span>':'')+img(p.img)+
 '<span class="jg-slot-l">'+esc(p.l)+'</span>'+(o.ctl||'')+'</span></li>';}
function slotVacio(o){o=o||{};return '<li class="jg-slot'+(o.flecha?' has-arrow':'')+'">'+(o.flecha?'<span class="jg-arrow" aria-hidden="true">→</span>':'')+
 '<span class="jg-slot-empty'+(o.foco?' is-focus jg-drop-target':'')+'"><span class="jg-slot-mark">'+esc(o.marca||'')+'</span>'+(o.etiqueta?'<span class="jg-slot-etq">'+esc(o.etiqueta)+'</span>':'')+'</span></li>';}
function tira(titulo,items){return '<div class="jg-strip-wrap"><p class="jg-small">'+esc(titulo)+'</p><ol class="jg-strip">'+items.join('')+'</ol></div>';}
function ctxBox(f){var h='';if(f.ctx){var c=pk(f.ctx);h='<div class="jg-ctx">'+img(c.img)+'<span>'+esc(c.l)+'</span></div>';}
 else if(f.ctxTxt)h='<div class="jg-ctx"><span>'+esc(L(f.ctxTxt))+'</span></div>';return h;}
function boton(txt,fn,cls,k,extra){return '<button type="button" class="jg-btn'+(cls?' '+cls:'')+'" data-a="'+act(fn)+'" data-k="'+esc(k||txt)+'"'+(extra||'')+'>'+esc(txt)+'</button>';}

/* ---------- vista de cada fase ---------- */
function vistaFase(){
 var u=U(),f=fase(),d=dd(),ay=S.ayuda,hecha=S.hecha,H=[],hoja=null;
 if(!f)return {html:'',hoja:null};
 H.push(ctxBox(f));
 if(f.tipo==='orden'){
  var placed=d.placed||[],next=f.pasos[placed.length];
  H.push(tira(u.tiraOrden,f.pasos.map(function(k,i){return i<placed.length?slotLleno(placed[i],{n:i+1,flecha:f.ruta&&i>0}):slotVacio({marca:String(i+1),flecha:f.ruta&&i>0,foco:i===placed.length});})));
  if(!hecha)H.push(grid(mezcla(f.pasos,seed()).filter(function(k){return placed.indexOf(k)<0;}).map(function(k){return tile(k,{hint:ay&&k===next},function(){
   if(k===next){var np=placed.concat([k]),fin=np.length===f.pasos.length;put({placed:np},ok(fin?u.hechoT:u.bien),fin);}else say(u.masAdelante);});}).join('')));
  hoja={t:u.hojaOrden,items:f.pasos.map(function(k,i){return [String(i+1),k];})};
 }
 else if(f.tipo==='siguiente'){
  var i=d.i===undefined?f.desde:d.i,finS=i>=f.sec.length;
  H.push(tira(u.tiraSig,f.sec.slice(0,i).map(function(k,n){return slotLleno(k,{n:n+1});}).concat(finS?[]:[slotVacio({marca:'?',foco:true})])));
  if(!finS&&!hecha){var okk=f.sec[i],dis=mezcla(f.otros.concat(f.sec.slice(i+1)),seed(i)).slice(0,(f.n||3)-1);
   H.push(grid(mezcla([okk].concat(dis),seed('c'+i)).map(function(k){return tile(k,{hint:ay&&k===okk},function(){
    if(k===okk){var ni=i+1,end=ni>=f.sec.length;put({i:ni},ok(end?u.hechoT:u.bien),end);}else say(u.otroMomento);});}).join('')));}
  hoja={t:u.hojaOrden,items:f.sec.map(function(k,n){return [String(n+1),k];})};
 }
 else if(f.tipo==='falta'){
  var okf=f.sec[f.hueco];
  H.push(tira(u.tiraFalta,f.sec.map(function(k,n){return (n===f.hueco&&!hecha)?slotVacio({marca:'?',foco:true}):slotLleno(k,{n:f.obj?'':n+1});})));
  if(!hecha)H.push(grid(mezcla(f.ops,seed()).map(function(k){return tile(k,{hint:ay&&k===okf},function(){if(k===okf)put({ok:true},ok(u.hechoT),true);else say(u.noHueco);});}).join('')));
  hoja={t:f.obj?u.hojaLista:u.hojaOrden,items:f.sec.map(function(k,n){return [f.obj?'☐':String(n+1),k];})};
 }
 else if(f.tipo==='meter'){
  var dentro=d.dentro||[],nec=f.items.filter(function(x){return x[1];}).map(function(x){return x[0];});
  var dp=f.destino?pk(f.destino):{img:pk('vestirse').img,l:u.meLoPongo};
  H.push('<div class="jg-dest">'+img(dp.img)+'<div><p class="jg-dest-t">'+esc(dp.l)+'</p><p class="jg-chips">'+
   (dentro.length?dentro.map(function(k){var p=pk(k);return '<span class="jg-chip">'+img(p.img)+esc(p.l)+'</span>';}).join(''):'<span class="jg-small">'+esc(u.vacio)+'</span>')+'</p></div></div>');
  var falta=nec.filter(function(k){return dentro.indexOf(k)<0;})[0];
  if(f.min)H.push('<p class="jg-prog">'+esc(u.elegidos(dentro.length,f.min))+'</p>');
  H.push(grid(mezcla(f.items.map(function(x){return x[0];}),seed()).map(function(k){var esta=dentro.indexOf(k)>=0,esNec=nec.indexOf(k)>=0;
   return tile(k,esta?{on:true,badge:'✓',estado:u.hecho}:{hint:ay&&k===falta},function(){
    if(hecha)return;
    if(esta){put({dentro:dentro.filter(function(x){return x!==k;})},{t:u.quitado,k:'guia'});return;}
    if(!esNec){say(L(f.no));return;}
    var nd=dentro.concat([k]),fin=!f.min&&nec.every(function(x){return nd.indexOf(x)>=0;});put({dentro:nd},ok(fin?u.hechoT:u.anadido),fin);});}).join('')));
  if(f.min&&!hecha&&dentro.length>=f.min)H.push('<div>'+boton(u.listo,function(){put({},ok(u.hechoT),true);},'is-primary','listo')+'</div>');
 }
 else if(f.tipo==='parejas'){
  var m=d.m||{},sel=d.sel||null,izq=f.pares.map(function(p){return p[0];}),der=mezcla(f.pares.map(function(p){return p[1];}),seed());
  var num=function(a){return izq.indexOf(a)+1;},par=function(a){return f.pares[izq.indexOf(a)][1];},aDe=function(b){return f.pares.filter(function(p){return p[1]===b;})[0][0];};
  var prim=izq.filter(function(a){return !m[a];})[0];
  var fila=function(k,o,fn,kk){var p=pk(k);return '<button type="button" class="jg-row'+(o.on?' is-on':'')+(o.hint?' is-hint':'')+'" data-a="'+act(fn)+'" data-k="'+kk+'" aria-pressed="'+(o.on?'true':'false')+'">'+img(p.img)+'<span>'+esc(p.l)+'</span>'+(o.badge?'<span class="jg-badge-in" aria-hidden="true">'+o.badge+'</span>':'')+'</button>';};
  H.push('<div class="jg-cols"><div class="jg-col"><p class="jg-small">'+esc(u.objetos)+'</p>'+izq.map(function(a){
    return fila(a,m[a]?{on:true,badge:String(num(a))}:(a===sel?{on:true}:{hint:ay&&!sel&&a===prim}),function(){if(m[a]||hecha)return;put({sel:a},null);},'l-'+a);}).join('')+
   '</div><div class="jg-col"><p class="jg-small">'+esc(u.conEsto)+'</p>'+der.map(function(b){var a=aDe(b);
    return fila(b,m[a]?{on:true,badge:String(num(a))}:{hint:ay&&sel&&par(sel)===b},function(){
     if(m[a]||hecha)return;if(!sel){say(u.primeroIzq);return;}
     if(par(sel)===b){var nm=Object.assign({},m);nm[sel]=true;var fin=izq.every(function(x){return nm[x];});put({m:nm,sel:null},ok(fin?u.hechoT:u.bien),fin);}else say(u.noJuntas);},'r-'+b);}).join('')+'</div></div>');
 }
 else if(f.tipo==='intruso'){
  H.push(grid(mezcla(f.items,seed()).map(function(k){return tile(k,hecha?(k===f.intruso?{on:true,badge:'✓'}:{}):{hint:ay&&k===f.intruso},function(){if(hecha)return;if(k===f.intruso)put({ok:true},ok(u.intrusoOk),true);else say(L(f.si));});}).join('')));
 }
 else if(f.tipo==='primero'){
  var ch=d.ch;
  H.push(grid(mezcla(f.items,seed()).map(function(k){return tile(k,k===ch?{on:true,badge:'1'}:{hint:ay&&!hecha&&k===f.ok[0]},function(){
   if(hecha)return;if(f.ok.indexOf(k)>=0)put({ch:k},ok(f.bien?L(f.bien):u.eseEs),true);else say(f.no?L(f.no):u.masAdelante);});}).join('')));
 }
 else if(f.tipo==='repartir'){
  var idx=d.idx||0,pl=d.pl||{},cur=f.items[idx];
  if(cur&&!hecha){var cp=pk(cur[0]);H.push('<div class="jg-ctx jg-actual" draggable="true" data-drag-current="true">'+img(cp.img)+'<span><span class="jg-small">'+esc(u.vuelta)+'</span><strong>'+esc(cp.l)+'</strong></span></div>');}
  H.push('<p class="jg-prog">'+esc(u.hechos(Math.min(idx,f.items.length),f.items.length))+'</p>');if(f.libre&&Object.keys(pl).length)hoja={t:u.resumen,items:f.items.map(function(it,n){return pl[n]?[pk(pl[n]).l,it[0]]:null;}).filter(Boolean)};
  H.push('<div class="jg-dests">'+f.destinos.map(function(dk){var p=pk(dk),aqui=cur&&(f.libre||String(cur[1]).split('|').indexOf(dk)>=0);
   return '<div class="jg-destcol"><button type="button" class="jg-row jg-drop-target'+(ay&&aqui?' is-hint':'')+'" data-k="d-'+dk+'" data-a="'+act(function(){
     if(!cur||hecha)return;if(aqui){var np=Object.assign({},pl);np[idx]=dk;var ni=idx+1,fin=ni>=f.items.length;put({pl:np,idx:ni},ok(fin?(f.libre?u.resumen:u.hechoT):(f.libre?u.libreOk:u.bien)),fin);}else say(u.noEncaja);})+'">'+img(p.img)+'<span>'+esc(p.l)+'</span></button>'+
    '<span class="jg-mini">'+f.items.map(function(it,n){if(pl[n]!==dk)return '';var q=pk(it[0]);return '<img src="'+esc(q.img)+'" alt="'+esc(q.l)+'" title="'+esc(q.l)+'">';}).join('')+'</span></div>';}).join('')+'</div>');
 }
 else if(f.tipo==='construir'){
  var mia=d.mia||[],hu=f.huecos;
  var mover=function(i,dir){var a=mia.slice(),j=i+dir;if(j<0||j>=a.length)return;var t=a[i];a[i]=a[j];a[j]=t;put({mia:a},null);};
  var items=[],n=hu?hu.length:mia.length;
  for(var q=0;q<n;q++){(function(i){var k=mia[i];
   if(k){var ctl=hecha?'':'<span class="jg-ctl">'+
     '<button type="button" class="jg-mini-btn" data-a="'+act(function(){mover(i,-1);})+'" data-k="up-'+k+'" aria-label="'+esc(U().subir+': '+pk(k).l)+'"'+(i===0?' disabled':'')+'>←</button>'+
     '<button type="button" class="jg-mini-btn" data-a="'+act(function(){put({mia:mia.filter(function(x,j){return j!==i;})},{t:U().quitado,k:'guia'});})+'" data-k="rm-'+k+'" aria-label="'+esc(U().quitar+': '+pk(k).l)+'">×</button>'+
     '<button type="button" class="jg-mini-btn" data-a="'+act(function(){mover(i,1);})+'" data-k="dn-'+k+'" aria-label="'+esc(U().bajar+': '+pk(k).l)+'"'+(i===mia.length-1?' disabled':'')+'>→</button></span>';
    items.push(slotLleno(k,{n:hu?'':i+1,etiqueta:hu?L(hu[i]):'',ctl:ctl}));}
   else items.push(slotVacio({etiqueta:hu?L(hu[i]):'',foco:i===mia.length}));})(q);}
  if(!hu&&!hecha)items.push(slotVacio({marca:String(mia.length+1),foco:true}));
  H.push(tira(u.tiraMia,items));
  if(f.pide&&mia.length&&mia.indexOf(f.pide)<0)H.push('<p class="jg-nota">'+esc(L(f.pideTxt))+'</p>');
  if(!hecha){H.push(grid(f.banco.map(function(k){var ya=mia.indexOf(k)>=0;return tile(k,ya?{on:true,badge:String(mia.indexOf(k)+1)}:{},function(){
    if(ya){put({mia:mia.filter(function(x){return x!==k;})},{t:u.quitado,k:'guia'});return;}
    if(hu&&mia.length>=hu.length){say(u.huecosLlenos);return;}put({mia:mia.concat([k])},ok(u.anadido));});}).join('')));
   if(hu?mia.length===hu.length:mia.length>0)H.push('<div>'+boton(u.listo,function(){put({},ok(u.hechoT),true);},'is-primary','listo')+'</div>');}
  if(mia.length)hoja={t:u.hojaPlan,items:mia.map(function(k,i){return [hu?L(hu[i]):String(i+1),k];})};
 }
 else if(f.tipo==='lista'){
  var h=d.h||{},nh=f.items.filter(function(k){return h[k];}).length,sig=f.items.filter(function(k){return !h[k];})[0];
  H.push('<p class="jg-prog">'+esc(u.hechos(nh,f.items.length))+'</p>');
  H.push(grid(f.items.map(function(k){return tile(k,h[k]?{on:true,badge:'✓',estado:u.hecho}:{hint:ay&&k===sig},function(){
   var n2=Object.assign({},h);n2[k]=!h[k];var fin=f.items.every(function(x){return n2[x];});put({h:n2},fin?ok(u.hechoT):null,fin);});}).join('')));
  hoja={t:u.hojaLista,items:f.items.map(function(k){return ['☐',k];})};
 }
 else if(f.tipo==='reloj'){
  var mins=d.mins||f.mins[1],total=mins*60,left=d.left===undefined?total:d.left,run=!!d.run;
  H.push('<div class="jg-chips" role="group" aria-label="'+esc(u.minutos)+'">'+f.mins.map(function(mm){return boton(u.minL(mm),function(){S.d[S.fi]={mins:mm,total:mm*60,left:mm*60,run:false};S.msg=null;S.hecha=false;},mm===mins?'is-on':'','m'+mm,' aria-pressed="'+(mm===mins)+'"');}).join('')+'</div>');
  var pct=Math.round(left/total*1000)/10,mm2=Math.floor(left/60),ss=left%60;
  H.push('<div class="jg-clock"><div class="jg-bar" aria-hidden="true"><span style="width:'+pct+'%"></span></div><p class="jg-time">'+mm2+':'+(ss<10?'0':'')+ss+'</p><p class="jg-small">'+esc(d.aviso||u.relojListo)+'</p></div>');
  H.push('<div class="jg-chips">'+boton(run?u.pausar:(left<total&&left>0?u.seguirReloj:u.empezar),function(){
    if(left<=0){S.d[S.fi]={mins:mins,total:total,left:total,run:true};S.msg=null;S.hecha=false;return;}put({mins:mins,total:total,left:left,run:!run},null);},'is-primary','play')+
   boton(u.parar,function(){S.d[S.fi]={mins:mins,total:total,left:total,run:false};S.msg=null;S.hecha=false;},'','stop')+'</div>');
 }
 else if(f.tipo==='elegir'){
  var che=d.ch;
  H.push('<div class="jg-ops">'+f.ops.map(function(o){var k=o[0],p=pk(k),on=che===k;
   return '<button type="button" class="jg-op'+(on?' is-on':'')+'" data-k="o-'+k+'" aria-pressed="'+on+'" data-a="'+act(function(){put({ch:k},ok(U().elige),true);})+'"><span class="jg-op-img">'+
    (o[2]||[k]).map(function(z){return img(pk(z).img);}).join('')+'</span><strong>'+esc(p.l)+'</strong><span>'+esc(L(o[1]))+'</span></button>';}).join('')+'</div>');
 }
 if(f.tipo==='busca'){
  var fo=d.fo||{},nf=f.ok.filter(function(k){return fo[k];}).length;
  H.push('<p class="jg-prog">'+esc(u.encontrados(nf,f.ok.length))+'</p>');
  H.push(grid(mezcla(f.items,seed()).map(function(k){return tile(k,fo[k]?{on:true,badge:'✓',estado:u.hecho}:{hint:ay&&!hecha&&k===f.ok.filter(function(x){return !fo[x];})[0]},function(){
   if(hecha||fo[k])return;if(f.ok.indexOf(k)<0){say(u.noEsta);return;}var n2=Object.assign({},fo);n2[k]=true;var fin=f.ok.every(function(x){return n2[x];});put({fo:n2},ok(fin?u.hechoT:u.bien),fin);});}).join('')));
 }
 else if(f.tipo==='memoria'){
  var cartas=d.cartas||(d.cartas=mezcla(f.items.concat(f.items).map(function(k,i){return k+'#'+i;}),seed('m'))),ab=d.ab||[],hechas=d.pr||{};
  H.push('<p class="jg-prog">'+esc(u.encontrados(Object.keys(hechas).length,f.items.length).replace(/encontradas|found/,S.lang==='en'?'pairs found':'parejas encontradas'))+'</p>');
  H.push('<div class="jg-grid jg-mem">'+cartas.map(function(c,i){var k=c.split('#')[0],vis=hechas[k]||ab.indexOf(i)>=0,p=pk(k);
   return '<button type="button" class="jg-tile'+(hechas[k]?' is-on':'')+'" data-k="c-'+i+'" data-a="'+act(function(){
     if(hecha||hechas[k])return;if(ab.length<2&&ab.indexOf(i)>=0)return;var na=ab.length>=2?[i]:ab.concat([i]);
     if(na.length===2){var k1=cartas[na[0]].split('#')[0],k2=cartas[na[1]].split('#')[0];
      if(k1===k2){var np=Object.assign({},hechas);np[k1]=true;var fin=Object.keys(np).length===f.items.length;put({ab:[],pr:np},ok(fin?u.hechoT:u.pareja),fin);}
      else put({ab:na},{t:u.noPareja,k:'guia'});}
     else put({ab:na},null);})+'" aria-label="'+esc(vis?p.l:u.carta+' '+(i+1))+'">'+(vis?img(p.img)+'<span class="jg-tile-l">'+esc(p.l)+'</span>':'<span class="jg-back" aria-hidden="true">?</span>')+'</button>';}).join('')+'</div>');
 }
 if(f.nota)H.push('<p class="jg-nota">'+esc(L(f.nota))+'</p>');
 return {html:H.join(''),hoja:hoja};
}

/* ---------- pantallas ---------- */
function contextoPreview(catId){
 var juegos=D.juegos.filter(function(j){return j.c===catId;}).slice(0,3),ks=[];
 juegos.forEach(function(j){var f=j.f&&j.f[0],arr=f?[].concat(f.pasos||[],f.sec||[],f.banco||[],(f.items||[]).map(function(x){return Array.isArray(x)?x[0]:x;}),(f.pares||[]).map(function(p){return p[0];}),(f.ops||[]).map(function(o){return o[0];}),f.ctx?[f.ctx]:[]):[];arr.forEach(function(k){if(k&&ks.indexOf(k)<0)ks.push(k);});});
 return ks.slice(0,3);
}
function contextoCard(cat){
 var ks=contextoPreview(cat.id),count=D.juegos.filter(function(j){return j.c===cat.id;}).length;
 return '<button type="button" class="jg-context-card" data-a="'+act(function(){S.cat=cat.id;S.q='';})+'" data-k="ctx-'+esc(cat.id)+'">'+
   '<span class="jg-context-art" aria-hidden="true">'+ks.map(function(k){var p=pk(k);return img(p.img);}).join('')+'</span>'+
   '<span class="jg-context-copy"><strong>'+esc(L(cat.l))+'</strong><span>'+esc(U().n(count))+'</span></span><span class="jg-context-arrow" aria-hidden="true">→</span></button>';
}
function filtrosPopover(u){
 var ets={};(D.etapas||[]).forEach(function(x){ets[x.id]=x;});
 var btnsEt=[{v:null,l:u.todasEdades}].concat((D.etapas||[]).filter(function(x){return x.id!=='todas';}).map(function(x){return {v:x.id,l:L(x.l)};}));
 var btnsTp=[{v:null,l:u.todosTipos}].concat((D.tipos||[]).map(function(x){return {v:x.id,l:L(x.l)};}));
 var group=function(id,label,opts,cur,set){return '<fieldset class="jg-filter"><legend>'+esc(label)+'</legend><div class="jg-chips">'+opts.map(function(o){var on=cur===o.v;return boton(o.l,function(){set(o.v);},on?'is-on':'',id+'-'+(o.v||'x'),' aria-pressed="'+on+'"');}).join('')+'</div></fieldset>';};
 return '<button type="button" class="jg-btn jg-actions-btn" popovertarget="jg-filter-pop">'+esc(u.moreOptions)+'</button>'+
  '<div class="jg-filter-pop" id="jg-filter-pop" popover><div class="jg-pop-head"><strong>'+esc(u.moreOptions)+'</strong><button type="button" class="jg-pop-close" popovertarget="jg-filter-pop" popovertargetaction="hide" aria-label="×">×</button></div>'+
  group('et',u.etapa,btnsEt,S.etapa,function(v){S.etapa=v;})+
  group('tp',u.tipo,btnsTp,S.tipo,function(v){S.tipo=v;})+'</div>';
}
function gameCard(o,cats){
 var u=U(),j=o.j,f=j.f[0],ks=[].concat(f.pasos||[],f.sec||[],f.banco||[],(f.items||[]).map(function(x){return Array.isArray(x)?x[0]:x;}),(f.pares||[]).map(function(p){return p[0];}),(f.ops||[]).map(function(x){return x[0];}),f.ctx?[f.ctx]:[]),un=[];
 ks.forEach(function(k){if(k&&un.indexOf(k)<0)un.push(k);});
 var art=un.slice(0,3).map(function(k){return img(pk(k).img);}).join('');
 return '<li><a class="jg-card jg-r41-game-card" href="#juego-'+esc(j.s)+'" data-k="g-'+esc(j.s)+'" data-a="'+act(function(){abrir(o.i);})+'">'+
  '<span class="jg-card-img" aria-hidden="true">'+art+'</span><span class="jg-card-copy"><span class="jg-card-type">'+esc(L((D.tipos||[]).filter(function(t){return t.id===grupo(j);})[0]?.l||{}))+'</span>'+
  '<strong class="jg-card-t">'+esc(L(j.t))+'</strong><span class="jg-card-d">'+esc(L(j.d))+'</span></span>'+
  '<span class="jg-card-f"><span class="jg-small">'+esc(cats[j.c]?L(cats[j.c].l):'')+'</span><span class="jg-card-cta">'+esc(u.jugar)+'</span></span></a></li>';
}
function catalogo(){
 var u=U(),q=norm(S.q),cats={};D.cats.forEach(function(c){cats[c.id]=c;});
 var vis=D.juegos.map(function(j,i){return {j:j,i:i};}).filter(function(o){var j=o.j;
  return (S.cat==='todos'||j.c===S.cat)&&(!S.etapa||(j.e||['todas']).indexOf(S.etapa)>=0||(j.e||['todas']).indexOf('todas')>=0)&&(!S.tipo||grupo(j)===S.tipo)&&(!q||norm(L(j.t)+' '+L(j.d)).indexOf(q)>=0);});
 var search='<label class="jg-search jg-search-inline"><span class="sr-only">'+esc(u.buscar)+'</span><input type="search" id="jg-q" value="'+esc(S.q)+'" placeholder="'+esc(u.buscarPh)+'" autocomplete="off"></label>';
 if(S.cat==='todos'&&!q){
  return '<section class="jg-r41-hub" aria-labelledby="jg-practice-title"><div class="jg-r41-actions"><div><p class="jg-kicker">'+esc(u.temas)+'</p><h2 class="jg-practice" id="jg-practice-title">'+esc(u.practica)+'</h2></div><div class="jg-r41-tools">'+search+filtrosPopover(u)+'</div></div>'+
   '<div class="jg-context-grid">'+D.cats.filter(function(c){return c.id!=='todos';}).map(contextoCard).join('')+'</div>'+
   '<p class="jg-hub-note">'+esc(u.n(D.juegos.length))+'</p></section>';
 }
 var current=S.cat!=='todos'?cats[S.cat]:null;
 return '<section class="jg-r41-browser" aria-label="'+esc(u.practica)+'"><div class="jg-r41-browserbar">'+
   (current?boton('← '+u.todos,function(){S.cat='todos';S.q='';},'','ctx-back'):'')+
   '<div class="jg-r41-browser-title"><span class="jg-small">'+esc(u.practica)+'</span><strong>'+esc(current?L(current.l):u.buscar)+'</strong></div>'+
   '<div class="jg-r41-tools">'+search+filtrosPopover(u)+'</div></div>'+
   '<p class="jg-small" id="jg-n">'+esc(u.n(vis.length))+'</p>'+
   (vis.length?'<ul class="jg-cards jg-r41-results">'+vis.map(function(o){return gameCard(o,cats);}).join('')+'</ul>':'<p class="jg-nota">'+esc(u.sinRes)+'</p>')+
   '</section>';
}
function grupo(j){var t=j.f[0].tipo;if(/orden|siguiente|falta|primero/.test(t))return 'ordenar';if(/meter|elegir/.test(t))return 'elegir';if(/repartir|parejas|intruso|busca/.test(t))return (t==='repartir'&&j.f[0].libre)?'planificar':'clasificar';if(t==='memoria')return 'memoria';return 'planificar';}
function pantallaJuego(){
 var u=U(),j=juego(),fs=fases(),f=fase(),last=S.fi>=fs.length-1,v=vistaFase(),m=S.msg,fam=grupo(j);
 var ps=Object.keys(D.links||{}).filter(function(p){return D.links[p]===j.s;})[0];
 var tools='<button type="button" class="jg-btn jg-actions-btn" popovertarget="jg-game-tools">'+esc(S.lang==='en'?'Options':'Opciones')+'</button>'+
  '<div class="jg-filter-pop jg-game-tools" id="jg-game-tools" popover><div class="jg-pop-head"><strong>'+esc(S.lang==='en'?'Game options':'Opciones del juego')+'</strong><button type="button" class="jg-pop-close" popovertarget="jg-game-tools" popovertargetaction="hide" aria-label="×">×</button></div><div class="jg-pop-actions">'+
  boton(u.menos,function(){S.red=!S.red;S.fi=0;S.d={};S.msg=null;S.hecha=false;S.ayuda=false;},S.red?'is-on':'','red',' aria-pressed="'+S.red+'"')+
  boton(u.ayuda,function(){if(S.hecha)return;var t=f&&f.tipo;S.ayuda=true;if(!(t==='reloj'||t==='elegir'||t==='construir'))S.msg={t:t==='orden'?u.ayudaOrden:u.ayudaGen,k:'guia'};},'','ayuda')+
  boton(u.otraVez,reiniciar,'','otra')+(v.hoja?boton(u.imprimir,function(){setTimeout(function(){try{window.print();}catch(e){}},50);},'','print'):'')+
  (ps?'<a class="jg-btn" href="'+(S.lang==='en'?'/en/resources/printable-routines/':'/es/recursos/rutinas-imprimibles/')+'#pack-'+ps+'">'+esc(u.imprimible)+'</a>':'')+
  '</div></div>';
 var h='<div class="jg-ui jg-r41-game"><header class="jg-gamebar">'+
  '<button type="button" class="jg-iconbtn" data-k="volver" data-a="'+act(volver)+'" aria-label="'+esc(u.todos)+'">←</button>'+
  '<div class="jg-gamebar-title"><span class="jg-small">'+esc((D.tipos||[]).filter(function(t){return t.id===fam;}).map(function(t){return L(t.l);})[0]||u.juego)+'</span><h1 tabindex="-1" id="jg-h2">'+esc(L(j.t))+'</h1></div>'+tools+'</header>'+
  '<div class="jg-r41-app jg-family-'+esc(fam)+'"><section class="jg-play jg-workspace" aria-label="'+esc(L(j.t))+'">'+
   '<div class="jg-taskbar">'+(fs.length>1?'<span class="jg-step">'+esc(u.parte(S.fi+1,fs.length))+'</span>':'')+
   '<div class="jg-instr">'+(f&&f.t?'<h2>'+esc(L(f.t))+'</h2>':'')+'<p>'+esc(f?L(f.i):'')+'</p></div></div>'+
   '<div class="jg-stage">'+v.html+'</div>'+
   '<div class="jg-status">'+(m&&!S.hecha?'<p class="jg-msg'+(m.k==='ok'?' is-ok':'')+'">'+esc(m.t)+'</p>':'')+'</div>'+
   (S.hecha?'<div class="jg-done"><p class="jg-done-t">'+esc(last?u.hechoT:u.hechoParte)+'</p>'+(last?'<p>'+esc(u.hechoFin)+'</p>':'')+'<div class="jg-chips">'+
    (last?boton(u.otroJuego,volver,'is-primary','otro')+boton(u.otraVez,reiniciar,'','otra2'):boton(u.seguir,function(){S.fi++;S.msg=null;S.hecha=false;S.ayuda=false;focusHead=true;},'is-primary','seguir'))+'</div></div>':'')+
  '</section><aside class="jg-inspector" aria-label="'+esc(S.lang==='en'?'About this game':'Sobre este juego')+'"><p class="jg-kicker">'+esc((D.cats||[]).filter(function(c){return c.id===j.c;}).map(function(c){return L(c.l);})[0]||'')+'</p><p>'+esc(L(j.d))+'</p><div class="jg-family-legend" aria-hidden="true"><span></span><span></span><span></span></div></aside></div></div>';
 if(v.hoja)h+='<section class="jg-hoja"><h2>'+esc(L(j.t))+'</h2><p>'+esc(v.hoja.t)+'</p><ol>'+v.hoja.items.map(function(it){var p=pk(it[1]);return '<li><span>'+esc(it[0])+'</span>'+img(p.img)+'<strong>'+esc(p.l)+'</strong></li>';}).join('')+'</ol><footer class="jg-hoja-pie"><span>'+esc(u.atrib)+'</span><strong class="jg-marca">'+esc(D.marca||'IRIS GREEN · irisgreen.eu')+'</strong></footer></section>';
 return h;
}

/* ---------- ciclo ---------- */
var hero=document.getElementById('jg-hero');
var live=document.createElement('p');live.className='jg-live';live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');root.parentNode.insertBefore(live,root.nextSibling);var lastLive='';
function textos(){var u=U(),set=function(id,t){var e=document.getElementById(id);if(e)e.textContent=t;};set('jg-h1',u.h1);set('jg-lede',u.lede);set('jg-atrib',u.atrib);
 var c=document.getElementById('jg-crumb');if(c){c.textContent=u.crumb;c.setAttribute('href',u.crumbHref);}}
function render(){
 A=[];textos();
 if(hero)hero.hidden=S.vista!=='lista';
 root.innerHTML=S.vista==='lista'?catalogo():pantallaJuego();
 var lv=S.vista==='juego'?(S.hecha?(S.fi>=fases().length-1?U().hechoT+' '+U().hechoFin:U().hechoParte):(S.msg?S.msg.t:'')):'';if(lv!==lastLive){live.textContent=lv;lastLive=lv;}
 var j0=juego();document.title=S.vista==='juego'&&j0?L(j0.t)+' · '+U().h1+' · Iris Green':U().h1+' · Iris Green';
 var qi=document.getElementById('jg-q');if(qi)qi.addEventListener('input',function(){S.q=qi.value;var pos=qi.selectionStart;render();var nn=document.getElementById('jg-n');if(nn){live.textContent=nn.textContent;lastLive=nn.textContent;}var n=document.getElementById('jg-q');if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(e){}}});
 if(focusHead){focusHead=false;var h2=document.getElementById('jg-h2');if(h2)h2.focus();lastKey=null;return;}
 if(lastKey){var el=root.querySelector('[data-k="'+(window.CSS&&CSS.escape?CSS.escape(lastKey):lastKey)+'"]');
  if(el&&!el.disabled)el.focus({preventScroll:true});else{var alt=root.querySelector('.jg-grid button,.jg-cols button,.jg-dests button,.jg-done button');if(alt)alt.focus({preventScroll:true});}
  lastKey=null;}
}
root.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b||!root.contains(b))return;var fn=A[+b.getAttribute('data-a')];if(!fn)return;e.preventDefault();lastKey=b.getAttribute('data-k');fn();render();});
var dragAction=null,dragCurrent=false;
root.addEventListener('dragstart',function(e){
 var current=e.target.closest('[data-drag-current="true"]');
 if(current){dragCurrent=true;dragAction=null;try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain','iris-current-item');}catch(_){}return;}
 var b=e.target.closest('[data-a][draggable="true"]');if(!b)return;dragAction=+b.getAttribute('data-a');dragCurrent=false;try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain','iris-game-item');}catch(_){}
});
root.addEventListener('dragover',function(e){if(dragAction===null&&!dragCurrent)return;if(e.target.closest('.jg-drop-target,.jg-slot-empty.is-focus,.jg-row'))e.preventDefault();});
root.addEventListener('drop',function(e){
 if(dragAction===null&&!dragCurrent)return;var target=e.target.closest('.jg-drop-target,.jg-slot-empty.is-focus,.jg-row');if(!target)return;e.preventDefault();
 var fn=null;
 if(dragCurrent&&target.hasAttribute('data-a'))fn=A[+target.getAttribute('data-a')];
 else if(dragAction!==null)fn=A[dragAction];
 dragAction=null;dragCurrent=false;if(typeof fn==='function'){fn();render();}
});
root.addEventListener('dragend',function(){dragAction=null;dragCurrent=false;});
function arriba(){try{var r=(hero&&!hero.hidden?hero:root).getBoundingClientRect();window.scrollTo(0,Math.max(0,r.top+window.scrollY-24));}catch(e){}}
function altHash(h){try{Array.prototype.forEach.call(document.querySelectorAll('link[rel="alternate"][hreflang]'),function(l){var u=l.getAttribute('href').split('#')[0];l.setAttribute('href',u+(h||''));});}catch(e){}}
function abrir(i,sinHash){altHash('#juego-'+D.juegos[i].s);S.vista='juego';S.gi=i;S.fi=0;S.d={};S.msg=null;S.hecha=false;S.ayuda=false;focusHead=true;
 if(!sinHash){try{history.replaceState(null,'','#juego-'+D.juegos[i].s);}catch(e){}}setTimeout(arriba,0);}
function volver(){altHash('');var g=S.gi;S.vista='lista';S.gi=null;S.d={};S.msg=null;S.hecha=false;S.ayuda=false;
 try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}lastKey=g!==null?'g-'+D.juegos[g].s:null;setTimeout(arriba,0);}
function reiniciar(){S.fi=0;S.d={};S.msg=null;S.hecha=false;S.ayuda=false;focusHead=true;}
function leerHash(){var m=(location.hash||'').match(/^#juego-(.+)$/);if(!m)return false;var gi=-1;D.juegos.forEach(function(j,i){if(j.s===m[1])gi=i;});if(gi<0)return false;if(gi!==S.gi){abrir(gi,true);render();}return true;}
window.addEventListener('hashchange',function(){if(!leerHash()&&S.vista==='juego'){volver();render();}});
setInterval(function(){var f=fase();if(!f||f.tipo!=='reloj'||S.vista!=='juego')return;var d=dd();if(!d.run||!(d.left>0))return;
 var left=d.left-1,tot=d.total,u=U(),aviso=null;if(left===Math.floor(tot/2))aviso=u.mitad;else if(left===Math.max(1,Math.round(tot*0.1)))aviso=u.poco;
 if(left<=0){put({left:0,run:false,aviso:u.finReloj},ok(u.finReloj),true);}else{d.left=left;if(aviso){d.aviso=aviso;live.textContent=aviso;lastLive=aviso;}}
 var ae=document.activeElement;lastKey=ae&&root.contains(ae)?ae.getAttribute('data-k'):null;render();},1000);
if(window.IG_IDIOMA)window.IG_IDIOMA.on(function(l){if(l!==S.lang){S.lang=l;render();}});
document.addEventListener('ig:idioma',function(e){var l=e.detail&&e.detail.lang;if(l&&l!==S.lang){S.lang=l;render();}});
if(!leerHash())render();
})();
