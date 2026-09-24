/* Iris Green · Rutinas imprimibles. Sin servidor, sin datos personales. */
(function(){
'use strict';
var D=window.IG_RUTINAS_IMPRIMIBLES_DATA;if(!D||!D.packs)return;
var root=document.getElementById('im-app');if(!root)return;
var BASE=root.getAttribute('data-base')||'/assets/pictogramas/';
var MARCA=D.marca||'IRIS GREEN · irisgreen.eu';
var UI={
 es:{buscar:'Buscar un imprimible',buscarPh:'Por ejemplo: dientes, lavadora, tren',etapa:'Etapa',todas:'Todas las edades',contexto:'Situación',
  n:function(n){return n===1?'1 imprimible':n+' imprimibles';},sinRes:'No hay imprimibles con esa palabra. Prueba con otra o elige «Todos».',
  abrir:'Ver y descargar',todos:'Todos los imprimibles',pasos:'Los pasos',formato:'Formato',opciones:'Opciones',
  tinta:'Ahorrar tinta (blanco y negro)',sobria:'Versión sobria: texto primero, pictograma pequeño',
  imprimir:'Imprimir o guardar en PDF',png:'Descargar imagen (PNG)',pngNo:'Este navegador no permite crear la imagen. Usa «Imprimir o guardar en PDF».',pngOk:'Imagen descargada.',creando:'Creando la imagen…',
  jugar:'Jugar con esta rutina',vista:'Así queda la hoja',packsT:'Rutinas',megasT:'Packs completos',megaAbrir:'Ver el pack',megaN:function(n){return n+' rutinas en un solo archivo';},
  bancoT:'Banco de tarjetas',bancoD:'Elige los pictogramas que quieras y crea tu propia hoja de tarjetas.',bancoAbrir:'Abrir el banco de tarjetas',bancoSel:function(n){return n===1?'1 tarjeta elegida':n+' tarjetas elegidas';},
  bancoBuscar:'Buscar un pictograma',bancoVaciar:'Quitar todas',bancoVacio:'Todavía no has elegido ninguna tarjeta.',misTarjetas:'Mis tarjetas',
  primero:'Primero',luego:'Luego',despues:'Después',porHacer:'Por hacer',hecho:'Hecho',
  fmt:{secuencia:'Secuencia en A4',tarjetas:'Tarjetas para recortar',lista:'Lista para marcar',pd:'Primero → Después',pld:'Primero → Luego → Después',hh:'Por hacer / Hecho',tira:'Tira para la nevera'},
  fmtD:{secuencia:'Todos los pasos en orden en una hoja.',tarjetas:'Un paso por tarjeta. Recórtalas y úsalas sueltas.',lista:'Una casilla por paso para marcar lo hecho.',pd:'Solo dos pasos, en grande.',pld:'Tres pasos, en grande.',hh:'Dos columnas: mueve cada tarjeta cuando lo hagas.',tira:'Una columna estrecha para pegar en la nevera o la pared.'},
  elige:'Elige los pasos',fuentes:'Fuentes y licencias',fuentesT:'Los pictogramas son de Mulberry Symbols y se usan con su licencia. Los dibujos que no existen en Mulberry son de Iris Green. La marca IRIS GREEN · irisgreen.eu identifica la hoja compuesta por Iris Green; no sustituye la autoría de los pictogramas.',
  hojaTexto:'Versión en texto de la hoja',volver:'Volver'},
 en:{buscar:'Search for a printable',buscarPh:'For example: teeth, washing, train',etapa:'Stage of life',todas:'All ages',contexto:'Situation',
  n:function(n){return n===1?'1 printable':n+' printables';},sinRes:'No printables match that word. Try another or choose “All”.',
  abrir:'View and download',todos:'All printables',pasos:'The steps',formato:'Format',opciones:'Options',
  tinta:'Save ink (black and white)',sobria:'Plain version: text first, small pictogram',
  imprimir:'Print or save as PDF',png:'Download image (PNG)',pngNo:'This browser cannot create the image. Use “Print or save as PDF”.',pngOk:'Image downloaded.',creando:'Creating the image…',
  jugar:'Play with this routine',vista:'How the sheet looks',packsT:'Routines',megasT:'Full packs',megaAbrir:'View the pack',megaN:function(n){return n+' routines in one file';},
  bancoT:'Card bank',bancoD:'Choose the pictograms you want and make your own sheet of cards.',bancoAbrir:'Open the card bank',bancoSel:function(n){return n===1?'1 card chosen':n+' cards chosen';},
  bancoBuscar:'Search for a pictogram',bancoVaciar:'Remove all',bancoVacio:'You have not chosen any cards yet.',misTarjetas:'My cards',
  primero:'First',luego:'Next',despues:'Then',porHacer:'To do',hecho:'Done',
  fmt:{secuencia:'A4 sequence',tarjetas:'Cards to cut out',lista:'Checklist',pd:'First → Then',pld:'First → Next → Then',hh:'To do / Done',tira:'Fridge strip'},
  fmtD:{secuencia:'All the steps in order on one sheet.',tarjetas:'One step per card. Cut them out and use them loose.',lista:'One box per step to tick off.',pd:'Just two steps, large.',pld:'Three steps, large.',hh:'Two columns: move each card when you do it.',tira:'A narrow column to stick on the fridge or wall.'},
  elige:'Choose the steps',fuentes:'Sources and licences',fuentesT:'The pictograms are from Mulberry Symbols and are used under their licence. Drawings not available in Mulberry are by Iris Green. The IRIS GREEN · irisgreen.eu mark identifies the sheet as put together by Iris Green; it does not replace the authorship of the pictograms.',
  hojaTexto:'Text version of the sheet',volver:'Back'}
};
var FMTS=['secuencia','tarjetas','lista','pd','pld','hh','tira'];
var S={lang:(document.documentElement.lang||'es').indexOf('en')===0?'en':'es',vista:'lista',pack:null,mega:null,fmt:'secuencia',tinta:false,sobria:false,sel:[0,1,2],q:'',etapa:null,cat:'todos',banco:[],bq:'',msg:''};
var A=[],lastKey=null,focusHead=false;
function U(){return UI[S.lang];}function L(o){return o?(o[S.lang]||o.es||''):'';}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function pk(k){var x=D.pictos[k];if(!x)return {img:'',l:k};return {img:BASE+x[0],l:S.lang==='en'?x[2]:x[1]};}
function act(fn){A.push(fn);return A.length-1;}
function btn(txt,fn,cls,k,extra){return '<button type="button" class="jg-btn'+(cls?' '+cls:'')+'" data-a="'+act(fn)+'" data-k="'+esc(k)+'"'+(extra||'')+'>'+esc(txt)+'</button>';}
function img(src){return '<img src="'+esc(src)+'" alt="" decoding="async">';}
function packBy(s){return D.packs.filter(function(p){return p.s===s;})[0]||null;}
function etTxt(e){return (e||['todas']).map(function(x){var o=(D.etapas||[]).filter(function(y){return y.id===x;})[0];return o?L(o.l):'';}).join(' · ');}
function atrib(){return D.atrib?L(D.atrib):'';}

/* ---------- hojas ---------- */
function pie(){return '<footer class="im-pie"><span>'+esc(atrib())+'</span><strong class="im-marca">'+esc(MARCA)+'</strong></footer>';}
function celda(k,marca,cls){var p=pk(k);return '<div class="im-c'+(cls?' '+cls:'')+'">'+(marca?'<span class="im-n">'+esc(marca)+'</span>':'')+img(p.img)+'<span class="im-l">'+esc(p.l)+'</span></div>';}
function hoja(titulo,sub,cuerpo,cls){return '<section class="im-sheet'+(S.tinta?' is-tinta':'')+(S.sobria?' is-sobria':'')+(cls?' '+cls:'')+'"><header class="im-h"><h2>'+esc(titulo)+'</h2>'+(sub?'<p>'+esc(sub)+'</p>':'')+'</header><div class="im-body">'+cuerpo+'</div>'+pie()+'</section>';}
function hojaPack(p,fmt){
 var u=U(),ks=p.pasos,T=L(p.t),sub=u.fmt[fmt];
 if(S.sobria&&(fmt==='secuencia'||fmt==='lista'))return hoja(T,sub,'<ol class="im-sob">'+ks.map(function(k,i){var q=pk(k);return '<li>'+(fmt==='lista'?'<span class="im-box" aria-hidden="true"></span>':'<span class="im-sn">'+(i+1)+'</span>')+'<span class="im-sl">'+esc(q.l)+'</span>'+img(q.img)+'</li>';}).join('')+'</ol>');
 if(fmt==='secuencia'){var gc=ks.length>6?4:3;return hoja(T,sub,'<div class="im-grid im-fill g'+gc+'" style="--r:'+Math.ceil(ks.length/gc)+'">'+ks.map(function(k,i){return celda(k,String(i+1));}).join('')+'</div>');}
 if(fmt==='tarjetas')return hoja(T,sub,'<div class="im-grid im-fill g3 im-cut" style="--r:'+Math.ceil(ks.length/3)+'">'+ks.map(function(k){return celda(k,'');}).join('')+'</div>');
 if(fmt==='lista')return hoja(T,sub,'<ol class="im-list">'+ks.map(function(k){var q=pk(k);return '<li><span class="im-box" aria-hidden="true"></span>'+img(q.img)+'<span class="im-l">'+esc(q.l)+'</span></li>';}).join('')+'</ol>');
 if(fmt==='pd'||fmt==='pld'){var n=fmt==='pd'?2:3,labs=fmt==='pd'?[u.primero,u.despues]:[u.primero,u.luego,u.despues];
  return hoja(T,sub,'<div class="im-ft n'+n+'">'+labs.map(function(l,i){var k=ks[Math.min(S.sel[i]||0,ks.length-1)];return '<div class="im-ftc"><p class="im-ftl">'+esc(l)+'</p>'+celda(k,'')+'</div>'+(i<n-1?'<span class="im-arrow" aria-hidden="true">→</span>':'');}).join('')+'</div>');}
 if(fmt==='hh')return hoja(T,sub,'<div class="im-hh"><div><p class="im-ftl">'+esc(u.porHacer)+'</p><div class="im-grid im-fill g2 im-cut" style="--r:'+Math.ceil(ks.length/2)+'">'+ks.map(function(k){return celda(k,'');}).join('')+'</div></div><div class="im-hh-done"><p class="im-ftl">'+esc(u.hecho)+'</p></div></div>');
 if(fmt==='tira')return hoja(T,sub,'<div class="im-tira" style="--r:'+ks.length+'">'+ks.map(function(k,i){return celda(k,String(i+1),'im-row');}).join('')+'</div>','is-tira');
 return '';
}
function hojasBanco(){var u=U(),ks=S.banco,out=[];for(var i=0;i<ks.length;i+=12)out.push(hoja(u.misTarjetas,'','<div class="im-grid im-fill g3 im-cut" style="--r:'+Math.ceil(Math.min(12,ks.length-i)/3)+'">'+ks.slice(i,i+12).map(function(k){return celda(k,'');}).join('')+'</div>'));return out.join('');}
function hojasMega(m){return m.packs.map(function(s){var p=packBy(s);return p?hojaPack(p,'secuencia')+hojaPack(p,'tarjetas'):'';}).join('');}

/* ---------- pantallas ---------- */
function filtro(id,label,opts,cur,set){return '<div class="jg-filter"><p class="jg-filter-t" id="im-f-'+id+'">'+esc(label)+'</p><div class="jg-chips" role="group" aria-labelledby="im-f-'+id+'">'+opts.map(function(o){var on=cur===o.v;return btn(o.l,function(){set(o.v);},on?'is-on':'',id+'-'+(o.v||'x'),' aria-pressed="'+on+'"');}).join('')+'</div></div>';}
function catalogo(){
 var u=U(),q=norm(S.q),cats={};D.cats.forEach(function(c){cats[c.id]=c;});
 var vis=D.packs.filter(function(p){return (S.cat==='todos'||p.c===S.cat)&&(!S.etapa||p.e.indexOf(S.etapa)>=0||p.e.indexOf('todas')>=0)&&(!q||norm(L(p.t)+' '+p.pasos.map(function(k){return pk(k).l;}).join(' ')).indexOf(q)>=0);});
 var usados={};D.packs.forEach(function(p){usados[p.c]=1;});
 return '<section class="jg-finder" aria-label="'+esc(u.buscar)+'"><label class="jg-search"><span>'+esc(u.buscar)+'</span><input type="search" id="im-q" value="'+esc(S.q)+'" placeholder="'+esc(u.buscarPh)+'" autocomplete="off"></label>'+
  filtro('et',u.etapa,[{v:null,l:u.todas}].concat((D.etapas||[]).filter(function(x){return x.id!=='todas';}).map(function(x){return {v:x.id,l:L(x.l)};})),S.etapa,function(v){S.etapa=v;})+
  filtro('cx',u.contexto,D.cats.filter(function(c){return c.id==='todos'||usados[c.id];}).map(function(c){return {v:c.id,l:L(c.l)};}),S.cat,function(v){S.cat=v;})+
  '<p class="jg-small" id="im-n">'+esc(u.n(vis.length))+'</p></section>'+
  '<h2 class="im-sec">'+esc(u.packsT)+'</h2>'+
  (vis.length?'<ul class="jg-cards">'+vis.map(function(p){return '<li><a class="jg-card" href="#pack-'+esc(p.s)+'" data-k="p-'+esc(p.s)+'" data-a="'+act(function(){abrir('pack',p.s);})+'"><span class="jg-card-img im-card-img" aria-hidden="true">'+p.pasos.slice(0,4).map(function(k){return img(pk(k).img);}).join('')+'</span><span class="jg-card-t">'+esc(L(p.t))+'</span><span class="jg-card-meta"><span>'+esc(etTxt(p.e))+'</span><span>'+esc(p.pasos.length+(S.lang==='en'?' steps':' pasos'))+'</span></span><span class="jg-card-f"><span class="jg-small">'+esc(cats[p.c]?L(cats[p.c].l):'')+'</span><span class="jg-card-cta">'+esc(u.abrir)+'</span></span></a></li>';}).join('')+'</ul>':'<p class="jg-nota">'+esc(u.sinRes)+'</p>')+
  '<h2 class="im-sec">'+esc(u.megasT)+'</h2><ul class="jg-cards">'+D.megapacks.map(function(m){return '<li><a class="jg-card" href="#mega-'+esc(m.s)+'" data-k="m-'+esc(m.s)+'" data-a="'+act(function(){abrir('mega',m.s);})+'"><span class="jg-card-t">'+esc(L(m.t))+'</span><span class="jg-card-d">'+esc(L(m.d))+'</span><span class="jg-card-meta"><span>'+esc(u.megaN(m.packs.length))+'</span></span><span class="jg-card-f"><span></span><span class="jg-card-cta">'+esc(u.megaAbrir)+'</span></span></a></li>';}).join('')+'</ul>'+
  '<h2 class="im-sec">'+esc(u.bancoT)+'</h2><p class="jg-lede">'+esc(u.bancoD)+'</p><p><a class="jg-btn is-primary" href="#tarjetas" data-k="banco" data-a="'+act(function(){abrir('banco');})+'">'+esc(u.bancoAbrir)+'</a></p>'+
  '<section class="im-fuentes" aria-labelledby="im-fuentes-t"><h2 id="im-fuentes-t" class="im-sec">'+esc(u.fuentes)+'</h2><p>'+esc(u.fuentesT)+'</p><p>'+esc(atrib())+'</p></section>';
}
function acciones(png){var u=U();return '<div class="jg-chips">'+btn(u.imprimir,function(){setTimeout(function(){try{window.print();}catch(e){}},60);},'is-primary','print')+(png?btn(u.png,descargarPNG,'','png'):'')+'</div><p class="im-status" role="status" aria-live="polite">'+esc(S.msg)+'</p>';}
function opciones(){var u=U();return '<fieldset class="im-opts"><legend>'+esc(u.opciones)+'</legend>'+
 '<label class="im-chk"><input type="checkbox" id="im-tinta"'+(S.tinta?' checked':'')+'> '+esc(u.tinta)+'</label>'+
 '<label class="im-chk"><input type="checkbox" id="im-sobria"'+(S.sobria?' checked':'')+'> '+esc(u.sobria)+'</label></fieldset>';}
function vistaPack(){
 var u=U(),p=packBy(S.pack);if(!p)return '';
 var juego=D.links&&D.links[p.s];
 var fsel='<fieldset class="im-fmts"><legend>'+esc(u.formato)+'</legend>'+FMTS.map(function(f){return '<label class="im-fmt'+(S.fmt===f?' is-on':'')+'"><input type="radio" name="im-fmt" value="'+f+'"'+(S.fmt===f?' checked':'')+'><span><strong>'+esc(u.fmt[f])+'</strong><span>'+esc(u.fmtD[f])+'</span></span></label>';}).join('')+'</fieldset>';
 var pasosSel='';if(S.fmt==='pd'||S.fmt==='pld'){var labs=S.fmt==='pd'?[u.primero,u.despues]:[u.primero,u.luego,u.despues];
  pasosSel='<fieldset class="im-opts"><legend>'+esc(u.elige)+'</legend>'+labs.map(function(l,i){return '<label class="im-sel"><span>'+esc(l)+'</span><select data-sel="'+i+'">'+p.pasos.map(function(k,j){return '<option value="'+j+'"'+((S.sel[i]||0)===j?' selected':'')+'>'+esc(pk(k).l)+'</option>';}).join('')+'</select></label>';}).join('')+'</fieldset>';}
 return '<div class="jg-ui"><p class="jg-chips">'+btn('← '+u.todos,volver,'','volver')+(juego?'<a class="jg-btn" href="'+(S.lang==='en'?'/en/resources/games/':'/es/recursos/juegos/')+'#juego-'+esc(juego)+'">'+esc(u.jugar)+'</a>':'')+'</p>'+
  '<section class="jg-head"><p class="jg-small">'+esc(etTxt(p.e))+'</p><h1 tabindex="-1" id="im-h1">'+esc(L(p.t))+'</h1></section>'+
  '<div class="im-split"><div class="im-side"><section class="jg-play"><h2 class="im-sub">'+esc(u.pasos)+'</h2><ol class="im-pasos">'+p.pasos.map(function(k){var q=pk(k);return '<li>'+img(q.img)+'<span>'+esc(q.l)+'</span></li>';}).join('')+'</ol></section>'+
  '<section class="jg-play">'+fsel+pasosSel+opciones()+acciones(true)+'</section></div>'+
  '<section class="jg-play im-prev-wrap"><h2 class="im-sub">'+esc(u.vista)+'</h2><div class="im-prev" aria-hidden="true"><div class="im-print" id="im-print">'+hojaPack(p,S.fmt)+'</div></div></section></div></div>';
}
function vistaMega(){
 var u=U(),m=D.megapacks.filter(function(x){return x.s===S.mega;})[0];if(!m)return '';
 return '<div class="jg-ui"><p class="jg-chips">'+btn('← '+u.todos,volver,'','volver')+'</p><section class="jg-head"><p class="jg-small">'+esc(u.megaN(m.packs.length))+'</p><h1 tabindex="-1" id="im-h1">'+esc(L(m.t))+'</h1><p class="jg-lede">'+esc(L(m.d))+'</p></section>'+
  '<div class="im-split"><div class="im-side"><section class="jg-play"><h2 class="im-sub">'+esc(u.hojaTexto)+'</h2><ul class="im-mega-l">'+m.packs.map(function(s){var p=packBy(s);return p?'<li><a href="#pack-'+esc(p.s)+'">'+esc(L(p.t))+'</a>: '+esc(p.pasos.map(function(k){return pk(k).l;}).join(', '))+'.</li>':'';}).join('')+'</ul></section>'+
  '<section class="jg-play">'+opciones()+acciones(false)+'</section></div><section class="jg-play im-prev-wrap"><h2 class="im-sub">'+esc(u.vista)+'</h2><div class="im-prev" aria-hidden="true"><div class="im-print" id="im-print">'+hojasMega(m)+'</div></div></section></div></div>';
}
function vistaBanco(){
 var u=U(),q=norm(S.bq),todas=(function(){var seen={};return Object.keys(D.pictos).filter(function(k){if(k.indexOf('R_')===0)return false;var p=D.pictos[k][0];if(seen[p])return false;seen[p]=1;return true;});})();
 var vis=todas.filter(function(k){return !q||norm(pk(k).l).indexOf(q)>=0;}).sort(function(a,b){return pk(a).l.localeCompare(pk(b).l,S.lang);});
 return '<div class="jg-ui"><p class="jg-chips">'+btn('← '+u.todos,volver,'','volver')+'</p><section class="jg-head"><h1 tabindex="-1" id="im-h1">'+esc(u.bancoT)+'</h1><p class="jg-lede">'+esc(u.bancoD)+'</p></section>'+
  '<section class="jg-play"><label class="jg-search"><span>'+esc(u.bancoBuscar)+'</span><input type="search" id="im-bq" value="'+esc(S.bq)+'" autocomplete="off"></label>'+
  '<p class="jg-prog" id="im-bn">'+esc(u.bancoSel(S.banco.length))+'</p><div class="jg-chips">'+(S.banco.length?btn(u.bancoVaciar,function(){S.banco=[];},'','vaciar'):'')+'</div>'+
  '<div class="jg-grid im-banco">'+vis.map(function(k){var on=S.banco.indexOf(k)>=0,p=pk(k);return '<button type="button" class="jg-tile'+(on?' is-on':'')+'" aria-pressed="'+on+'" data-k="b-'+esc(k)+'" data-a="'+act(function(){var i=S.banco.indexOf(k);if(i>=0)S.banco.splice(i,1);else S.banco.push(k);})+'">'+(on?'<span class="jg-badge" aria-hidden="true">✓</span>':'')+img(p.img)+'<span class="jg-tile-l">'+esc(p.l)+'</span></button>';}).join('')+'</div></section>'+
  '<section class="jg-play">'+opciones()+(S.banco.length?acciones(false):'<p class="jg-nota">'+esc(u.bancoVacio)+'</p>')+'</section>'+
  (S.banco.length?'<section class="jg-play im-prev-wrap"><h2 class="im-sub">'+esc(u.vista)+'</h2><div class="im-prev" aria-hidden="true"><div class="im-print" id="im-print">'+hojasBanco()+'</div></div></section>':'')+'</div>';
}

/* ---------- PNG ---------- */
var CSS_TXT=null,FONT_TXT=null;
function toDataURL(url){return fetch(url).then(function(r){return r.blob();}).then(function(b){return new Promise(function(res){var fr=new FileReader();fr.onload=function(){res(fr.result);};fr.readAsDataURL(b);});});}
function cssHoja(){if(CSS_TXT!==null)return Promise.resolve(CSS_TXT);var out='';try{Array.prototype.forEach.call(document.styleSheets,function(sh){var h=sh.href||'';if(h.indexOf('imprimibles')<0)return;Array.prototype.forEach.call(sh.cssRules,function(r){if(r.type===1&&/\.im-/.test(r.selectorText))out+=r.cssText+'\n';});});}catch(e){}
 CSS_TXT=out;return Promise.resolve(out);}
function fuentes(){if(FONT_TXT!==null)return Promise.resolve(FONT_TXT);var f=[['/assets/fonts/atkinson-hyperlegible-latin-400-normal.woff2',400],['/assets/fonts/atkinson-hyperlegible-latin-700-normal.woff2',700]];
 return Promise.all(f.map(function(x){return toDataURL(x[0]).then(function(d){return '@font-face{font-family:"Atkinson Hyperlegible";src:url('+d+') format("woff2");font-weight:'+x[1]+'}';}).catch(function(){return '';});})).then(function(a){FONT_TXT=a.join('');return FONT_TXT;});}
function descargarPNG(){
 var u=U(),src=document.querySelector('#im-print .im-sheet');if(!src)return;S.msg=u.creando;
 var W=1240,H=1754,cl=src.cloneNode(true);var imgs=cl.querySelectorAll('img');
 Promise.all([cssHoja(),fuentes()].concat(Array.prototype.map.call(imgs,function(im){return toDataURL(im.getAttribute('src')).then(function(d){im.setAttribute('src',d);}).catch(function(){});}))).then(function(r){
  var html=new XMLSerializer().serializeToString(cl);
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" class="im-png" style="width:210mm;height:297mm;transform:scale('+(W/793.7)+');transform-origin:0 0;background:#fff"><style>'+r[1]+r[0]+'</style>'+html+'</div></foreignObject></svg>';
  var im=new Image();im.onload=function(){try{var c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);x.drawImage(im,0,0);
    c.toBlob(function(b){if(!b){S.msg=u.pngNo;render();return;}var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='iris-green-'+(S.pack||'tarjetas')+'-'+S.fmt+'.png';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);S.msg=u.pngOk;lastKey='png';render();},'image/png');}
   catch(e){S.msg=u.pngNo;lastKey='png';render();}};
  im.onerror=function(){S.msg=u.pngNo;lastKey='png';render();};
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 });
 render();
}

/* ---------- ciclo ---------- */
var hero=document.getElementById('im-hero');
function render(){
 A=[];if(hero)hero.hidden=S.vista!=='lista';
 root.innerHTML=S.vista==='pack'?vistaPack():S.vista==='mega'?vistaMega():S.vista==='banco'?vistaBanco():catalogo();
 var t=S.vista==='pack'&&packBy(S.pack)?L(packBy(S.pack).t):S.vista==='banco'?U().bancoT:'';var base=S.lang==='en'?'Printable routines · Iris Green':'Rutinas imprimibles · Iris Green';document.title=t?t+' · '+base:base;
 var bind=function(id,fn){var el=document.getElementById(id);if(el)el.addEventListener('change',fn);};
 bind('im-tinta',function(e){S.tinta=e.target.checked;lastKey=null;render();var n=document.getElementById('im-tinta');if(n)n.focus();});
 bind('im-sobria',function(e){S.sobria=e.target.checked;lastKey=null;render();var n=document.getElementById('im-sobria');if(n)n.focus();});
 Array.prototype.forEach.call(root.querySelectorAll('input[name="im-fmt"]'),function(r){r.addEventListener('change',function(){S.fmt=r.value;S.sel=[0,1,2];S.msg='';render();var n=root.querySelector('input[name="im-fmt"][value="'+S.fmt+'"]');if(n)n.focus();});});
 Array.prototype.forEach.call(root.querySelectorAll('select[data-sel]'),function(s){s.addEventListener('change',function(){S.sel[+s.getAttribute('data-sel')]=+s.value;var i=s.getAttribute('data-sel');render();var n=root.querySelector('select[data-sel="'+i+'"]');if(n)n.focus();});});
 ['im-q','im-bq'].forEach(function(id){var qi=document.getElementById(id);if(qi)qi.addEventListener('input',function(){if(id==='im-q')S.q=qi.value;else S.bq=qi.value;var pos=qi.selectionStart;render();var n=document.getElementById(id);if(n){n.focus();try{n.setSelectionRange(pos,pos);}catch(e){}}});});
 if(focusHead){focusHead=false;var h=document.getElementById('im-h1');if(h)h.focus();return;}
 if(lastKey){var el=root.querySelector('[data-k="'+(window.CSS&&CSS.escape?CSS.escape(lastKey):lastKey)+'"]');if(el)el.focus({preventScroll:true});lastKey=null;}
}
root.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b||!root.contains(b))return;var fn=A[+b.getAttribute('data-a')];if(!fn)return;e.preventDefault();lastKey=b.getAttribute('data-k');fn();render();});
function arriba(){try{var r=(hero&&!hero.hidden?hero:root).getBoundingClientRect();window.scrollTo(0,Math.max(0,r.top+window.scrollY-24));}catch(e){}}
function alt(h){try{Array.prototype.forEach.call(document.querySelectorAll('link[rel="alternate"][hreflang]'),function(l){l.setAttribute('href',l.getAttribute('href').split('#')[0]+(h||''));});}catch(e){}}
function abrir(v,s,sinHash){S.vista=v;S.msg='';if(v==='pack'){S.pack=s;S.fmt='secuencia';S.sel=[0,1,2];}if(v==='mega')S.mega=s;focusHead=true;var h=v==='banco'?'#tarjetas':'#'+v+'-'+s;alt(h);if(!sinHash){try{history.replaceState(null,'',h);}catch(e){}}setTimeout(arriba,0);}
function volver(){var k=S.vista==='pack'?'p-'+S.pack:S.vista==='mega'?'m-'+S.mega:'banco';S.vista='lista';S.msg='';alt('');try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}lastKey=k;setTimeout(arriba,0);}
function leerHash(){var h=location.hash||'',m;
 if((m=h.match(/^#pack-(.+)$/))&&packBy(m[1])){abrir('pack',m[1],true);return true;}
 if((m=h.match(/^#mega-(.+)$/))&&D.megapacks.some(function(x){return x.s===m[1];})){abrir('mega',m[1],true);return true;}
 if(h==='#tarjetas'){abrir('banco',null,true);return true;}return false;}
window.addEventListener('hashchange',function(){if(!leerHash()){S.vista='lista';}render();});
document.addEventListener('ig:idioma',function(e){var l=e.detail&&e.detail.lang;if(l&&l!==S.lang){S.lang=l;render();}});
leerHash();render();
})();
