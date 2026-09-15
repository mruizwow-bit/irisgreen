(function(){
'use strict';

/* Raíz de assets. Vacía en el sitio publicado; «.» permite previsualizar la
   página desde una carpeta cualquiera sin tocar las rutas del HTML. */
var BASE=document.documentElement.getAttribute('data-ti-base')||'';
var SPRITES=BASE+'/assets/mulberry-rutinas/';
var APPROVED=BASE+'/assets/mulberry/';

/* Los cuatro pictogramas aprobados uno a uno viven en /assets/mulberry.
   El resto son símbolos de la biblioteca de Rutinas visuales, servidos por sprite. */
var P={
  hablar:{file:'hablar.svg',es:'Hablar',en:'Talking'},
  escribir:{file:'escribir.svg',es:'Escribir',en:'Writing'},
  preguntar:{file:'preguntar.svg',es:'Preguntar',en:'Asking'},
  carpeta:{file:'carpeta.svg',es:'Carpeta',en:'Folder'},
  telefono:{sprite:'sprite-7.svg',es:'Teléfono',en:'Phone'},
  autobus:{sprite:'sprite-5.svg',es:'Autobús',en:'Bus'},
  tienda:{sprite:'sprite-5.svg',es:'Tienda',en:'Shop'},
  dinero:{sprite:'sprite-5.svg',es:'Dinero',en:'Money'},
  leer:{sprite:'sprite-4.svg',es:'Leer',en:'Read'},
  ordenador:{sprite:'sprite-4.svg',es:'Ordenador',en:'Computer'},
  reloj:{sprite:'sprite-6.svg',es:'Reloj',en:'Clock'},
  colegio:{sprite:'sprite-6.svg',es:'Colegio',en:'School'},
  calendario:{sprite:'sprite-6.svg',es:'Calendario',en:'Calendar'},
  auriculares:{sprite:'sprite-7.svg',es:'Auriculares',en:'Headphones'},
  hoy:{sprite:'sprite-6.svg',es:'Hoy',en:'Today'},
  abrazo:{sprite:'sprite-8.svg',es:'Abrazo',en:'Hug'},
  esperar:{sprite:'sprite-7.svg',es:'Esperar',en:'Wait'},
  silencio:{sprite:'sprite-7.svg',es:'Silencio',en:'Quiet'},
  descansar:{sprite:'sprite-3.svg',es:'Descansar',en:'Rest'},
  sentarse:{sprite:'sprite-8.svg',es:'Sentarse',en:'Sit down'},
  agua:{sprite:'sprite-3.svg',es:'Agua',en:'Water'},
  gafas:{sprite:'sprite-2.svg',es:'Gafas',en:'Glasses'},
  medicacion:{sprite:'sprite-2.svg',es:'Medicación',en:'Medicine'},
  bano:{sprite:'sprite-2.svg',es:'Baño',en:'Toilet'},
  salir:{sprite:'sprite-5.svg',es:'Salir',en:'Go out'}
};

var GROUPS={
  cuesta:['hablar','telefono','autobus','tienda','dinero','leer','ordenador','reloj','colegio'],
  ayuda:['escribir','preguntar','leer','calendario','reloj','carpeta','auriculares','hoy','abrazo'],
  necesito:['esperar','silencio','descansar','sentarse','agua','gafas','medicacion','bano','salir']
};

var KEYS=['cuesta','ayuda','necesito'];

var T={
  es:{
    kicker:'Recursos gratuitos · apoyo visual',
    title:'Mi Tarjeta Iris',
    lede:'Una tarjeta con tres cosas sobre ti, para enseñar cuando explicarlo de viva voz se hace cuesta arriba: en una consulta, en una ventanilla, en el trabajo, en clase.',
    privacy:'Lo que escribes se queda en tu navegador mientras la pestaña está abierta. Al cerrarla no queda nada. No se envía a ningún sitio y no hace falta ninguna cuenta.',
    langGroup:'Idioma de la página',
    editorTitle:'Escribe lo tuyo',
    editorNote:'No hace falta rellenarlo todo de una vez, ni usar las tres partes. Una sola frase ya sirve.',
    exampleText:'Ahora mismo hay un ejemplo escrito, para que veas cómo queda. Puedes escribir encima o borrarlo.',
    exampleBtn:'Borrar el ejemplo',
    shapeLegend:'Forma de la tarjeta',
    shapeNote:'Las tres dicen lo mismo. Elige la que te resulte más fácil de leer y de enseñar.',
    shapes:{texto:'Solo texto',uno:'Con un pictograma en cada parte',orden:'Con los apoyos en orden'},
    labels:{cuesta:'Esto me cuesta',ayuda:'Me ayuda',necesito:'Necesito'},
    orderLabel:'Me ayuda, en este orden',
    hints:{
      cuesta:'Qué situación se te hace difícil. Sin explicar por qué.',
      ayuda:'Qué hace que sea más fácil para ti.',
      necesito:'Qué necesitas de la otra persona, dicho en positivo.'
    },
    orderHint:'Tres cosas, en el orden en que te sirven. Puedes dejar alguna en blanco.',
    placeholders:{
      cuesta:'Por ejemplo: entender varias instrucciones dichas de una vez.',
      ayuda:'Por ejemplo: que me lo digan en pasos cortos y por escrito.',
      necesito:'Por ejemplo: tiempo para responder.'
    },
    stepLabel:'Apoyo número',
    pictoTitle:'Un pictograma, si quieres',
    pictoGroup:'Elegir un pictograma para',
    pictoUse:'Poner el pictograma',
    pictoRemove:'Quitar el pictograma',
    inBlock:'en',
    reset:'Empezar de nuevo',
    previewTitle:'Tu tarjeta',
    previewNote:'Se va haciendo mientras escribes. Así se ve al enseñarla y así se imprime.',
    cardHead:'Iris Green · Tarjeta Iris',
    nothing:'Sin escribir todavía.',
    cardFoot:'Lista para enseñar o guardar · irisgreen.eu/es/recursos/tarjeta-iris/',
    copy:'Copiar',print:'Imprimir',
    copyName:'Copiar la Tarjeta Iris',printName:'Imprimir la Tarjeta Iris en A4',
    copied:'Copiada. Ya puedes pegarla donde quieras.',
    notCopied:'No se ha podido copiar.',
    notCopiedWhat:'El texto completo está debajo: selecciónalo y cópialo a mano.',
    printed:'Se ha abierto la ventana de imprimir. La hoja sale en A4, en gris.',
    textTitle:'La tarjeta en texto',
    textNote:'Esto es lo que se copia. Sirve para pegarlo en un mensaje, en un correo o en una nota del móvil.',
    notOfficial:'La Tarjeta Iris no es un documento oficial ni un informe. Es tuya: la escribes tú y decides a quién se la enseñas.',
    sheetFoot:'Lista para enseñar o guardar',
    printedOn:'impreso el',
    sheetCredit:'Pictogramas: Mulberry Symbols · Steve Lee · CC BY-SA 4.0.',
    stPhrase:'Frase puesta en «$1».',
    stPicto:'Pictograma $1 puesto en «$2».',
    stPictoOff:'Pictograma quitado de «$1».',
    stShape:'Forma de la tarjeta: $1.',
    stCleared:'Ejemplo borrado. Los tres campos están vacíos.',
    stReset:'Se ha vuelto a empezar. Está otra vez el ejemplo.',
    stLang:'Página en español.'
  },
  en:{
    kicker:'Free resources · visual support',
    title:'My Iris Card',
    lede:'A card with three things about you, to show when saying it out loud is hard work: at an appointment, at a counter, at work, in class.',
    privacy:'What you write stays in your browser while the tab is open. Close it and nothing is left. It is not sent anywhere and no account is needed.',
    langGroup:'Page language',
    editorTitle:'Write your own',
    editorNote:'You do not have to fill it all in at once, or use all three parts. One sentence is already enough.',
    exampleText:'Right now there is an example written in, so you can see how it looks. You can write over it or clear it.',
    exampleBtn:'Clear the example',
    shapeLegend:'Shape of the card',
    shapeNote:'All three say the same thing. Pick the one that is easiest for you to read and to show.',
    shapes:{texto:'Text only',uno:'With one symbol in each part',orden:'With the supports in order'},
    labels:{cuesta:'This is hard for me',ayuda:'What helps me',necesito:'What I need'},
    orderLabel:'What helps me, in this order',
    hints:{
      cuesta:'Which situation is hard for you. No need to explain why.',
      ayuda:'What makes it easier for you.',
      necesito:'What you need from the other person, said in the positive.'
    },
    orderHint:'Three things, in the order that works for you. You can leave one blank.',
    placeholders:{
      cuesta:'For example: understanding several instructions said at once.',
      ayuda:'For example: being told in short steps and in writing.',
      necesito:'For example: time to answer.'
    },
    stepLabel:'Support number',
    pictoTitle:'A symbol, if you want one',
    pictoGroup:'Choose a symbol for',
    pictoUse:'Use the symbol',
    pictoRemove:'Remove the symbol',
    inBlock:'in',
    reset:'Start again',
    previewTitle:'Your card',
    previewNote:'It builds as you write. This is how it looks when you show it, and how it prints.',
    cardHead:'Iris Green · Iris Card',
    nothing:'Nothing written yet.',
    cardFoot:'Ready to show or save · irisgreen.eu/es/recursos/tarjeta-iris/',
    copy:'Copy',print:'Print',
    copyName:'Copy the Iris Card',printName:'Print the Iris Card on A4',
    copied:'Copied. You can paste it now.',
    notCopied:'It could not be copied.',
    notCopiedWhat:'The full text is below: select it and copy it by hand.',
    printed:'The print window has opened. The sheet comes out on A4, in grey.',
    textTitle:'The card as text',
    textNote:'This is what gets copied. Use it to paste into a message, an email or a note on your phone.',
    notOfficial:'The Iris Card is not an official document or a report. It is yours: you write it and you decide who sees it.',
    sheetFoot:'Ready to show or save',
    printedOn:'printed on',
    sheetCredit:'Symbols: Mulberry Symbols · Steve Lee · CC BY-SA 4.0.',
    stPhrase:'Sentence put into «$1».',
    stPicto:'$1 symbol put into «$2».',
    stPictoOff:'Symbol removed from «$1».',
    stShape:'Shape of the card: $1.',
    stCleared:'Example cleared. The three fields are empty.',
    stReset:'Started again. The example is back.',
    stLang:'Page in English.'
  }
};

var EXAMPLE={
  es:{cuesta:'Entender varias instrucciones dichas de una vez.',ayuda:'Que me lo digan en pasos cortos y por escrito.',necesito:'Tiempo para responder sin que nadie repita la pregunta.',pasos:['Una cosa cada vez.','Por escrito, para poder volver a leerlo.','Confirmar que lo he entendido.']},
  en:{cuesta:'Understanding several instructions said at once.',ayuda:'Being told in short steps and in writing.',necesito:'Time to answer without anyone repeating the question.',pasos:['One thing at a time.','In writing, so I can read it again.','Checking that I have understood.']}
};

var SUGGEST={
  es:{
    cuesta:['Entender varias instrucciones dichas de una vez.','Hablar por teléfono con alguien que no conozco.','Los sitios con mucho ruido y mucha gente.'],
    ayuda:['Que me lo digan en pasos cortos y por escrito.','Saber antes qué va a pasar y cuánto dura.','Poder preguntar sin que se molesten.'],
    necesito:['Tiempo para responder.','Que me lo repitan sin prisa si lo pido.','Un sitio tranquilo para esperar.']
  },
  en:{
    cuesta:['Understanding several instructions said at once.','Talking on the phone to someone I do not know.','Places with a lot of noise and a lot of people.'],
    ayuda:['Being told in short steps and in writing.','Knowing beforehand what will happen and how long it takes.','Being able to ask without anyone minding.'],
    necesito:['Time to answer.','Being told again, unhurried, if I ask.','A quiet place to wait.']
  }
};

var STORE='ig-tarjeta-iris';
var TICK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 12.4 9.6 17.6 19.6 6.4"></path></svg>';

var state={lang:'es',shape:'uno',example:true,cuesta:'',ayuda:'',necesito:'',pasos:['','',''],
  picto:{cuesta:'hablar',ayuda:'escribir',necesito:'esperar'},copy:null,printed:false,notice:''};

function $(sel){return document.querySelector(sel);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
function t(){return T[state.lang];}
function name(id){return P[id]?P[id][state.lang]:'';}

function pictoHTML(id,cls){
  var p=P[id];
  if(!p)return '';
  var klass=cls||'ti-picto';
  if(p.file)return '<img class="'+klass+'" src="'+APPROVED+p.file+'" alt="" aria-hidden="true">';
  return '<svg class="'+klass+'" aria-hidden="true"><use href="'+SPRITES+p.sprite+'#'+encodeURIComponent(id)+'"></use></svg>';
}

function save(){
  try{
    sessionStorage.setItem(STORE,JSON.stringify({lang:state.lang,shape:state.shape,example:state.example,
      cuesta:state.cuesta,ayuda:state.ayuda,necesito:state.necesito,pasos:state.pasos,picto:state.picto}));
  }catch(e){}
}

function restore(){
  try{
    var raw=sessionStorage.getItem(STORE);
    if(!raw)return;
    var d=JSON.parse(raw);
    if(!d||typeof d!=='object')return;
    if(d.lang==='en'||d.lang==='es')state.lang=d.lang;
    if(T.es.shapes[d.shape])state.shape=d.shape;
    if(typeof d.example==='boolean')state.example=d.example;
    KEYS.forEach(function(k){if(typeof d[k]==='string')state[k]=d[k];});
    if(Array.isArray(d.pasos))state.pasos=[0,1,2].map(function(i){return typeof d.pasos[i]==='string'?d.pasos[i]:'';});
    if(d.picto&&typeof d.picto==='object')KEYS.forEach(function(k){
      if(d.picto[k]===null||P[d.picto[k]])state.picto[k]=d.picto[k]||null;
    });
  }catch(e){}
}

function fromURL(){
  try{
    var q=new URLSearchParams(location.search);
    var any=false;
    KEYS.forEach(function(k){
      var v=q.get(k);
      if(typeof v==='string'&&v.trim()){state[k]=v.trim().slice(0,400);any=true;}
    });
    var lang=q.get('lang');
    if(lang==='en'||lang==='es'){state.lang=lang;any=true;}
    if(any)state.example=false;
  }catch(e){}
}

function values(){
  if(!state.example)return {cuesta:state.cuesta,ayuda:state.ayuda,necesito:state.necesito,pasos:state.pasos.slice()};
  var e=EXAMPLE[state.lang];
  return {cuesta:e.cuesta,ayuda:e.ayuda,necesito:e.necesito,pasos:e.pasos.slice()};
}

function commit(){
  var v=values();
  state.example=false;
  state.cuesta=v.cuesta;state.ayuda=v.ayuda;state.necesito=v.necesito;state.pasos=v.pasos;
  state.copy=null;state.printed=false;
}

function plainText(){
  var v=values(),ti=t(),lines=[ti.cardHead,''];
  if(v.cuesta)lines.push(ti.labels.cuesta+': '+v.cuesta);
  if(state.shape==='orden'){
    var used=v.pasos.filter(function(x){return x&&x.trim();});
    if(used.length)lines.push(ti.orderLabel+': '+used.map(function(x,i){return (i+1)+'. '+x;}).join(' '));
  }else if(v.ayuda){
    lines.push(ti.labels.ayuda+': '+v.ayuda);
  }
  if(v.necesito)lines.push(ti.labels.necesito+': '+v.necesito);
  lines.push('','irisgreen.eu/es/recursos/tarjeta-iris/');
  return lines.join('\n');
}

function blockHTML(key,text,withPicto){
  var ti=t();
  var pic=withPicto&&state.picto[key]?'<span class="ti-frame">'+pictoHTML(state.picto[key])+'</span>':'';
  var body=text?'<p>'+esc(text)+'</p>':'<p class="ti-empty">'+esc(ti.nothing)+'</p>';
  return '<div class="ti-block"><p class="ti-block-head">'+esc(ti.labels[key])+'</p>'+
    '<div class="ti-block-body">'+pic+body+'</div></div>';
}

function renderPreview(){
  var ti=t(),v=values(),withPicto=state.shape!=='texto';
  var used=v.pasos.map(function(x,i){return{n:i+1,text:x};}).filter(function(s){return s.text&&s.text.trim();});
  var html='<h3>'+esc(ti.cardHead)+'</h3><div class="ti-rule"></div>'+blockHTML('cuesta',v.cuesta,withPicto)+'<div class="ti-rule"></div>';
  if(state.shape==='orden'){
    html+='<div class="ti-block"><p class="ti-block-head">'+esc(ti.orderLabel)+'</p>'+
      (used.length?'<ol class="ti-order">'+used.map(function(s){return '<li><span class="ti-num">'+s.n+'</span><p>'+esc(s.text)+'</p></li>';}).join('')+'</ol>'
        :'<p class="ti-empty">'+esc(ti.nothing)+'</p>')+'</div>';
  }else{
    html+=blockHTML('ayuda',v.ayuda,withPicto);
  }
  html+='<div class="ti-rule"></div>'+blockHTML('necesito',v.necesito,withPicto)+'<div class="ti-rule"></div>'+
    '<p class="ti-hint">'+esc(ti.cardFoot)+'</p>';
  $('#ti-preview').innerHTML=html;

  var date=new Date().toLocaleDateString(state.lang==='en'?'en-GB':'es-ES');
  var sheetBlock=function(key,text){
    var pic=withPicto&&state.picto[key]?'<span class="ti-sheet-frame">'+pictoHTML(state.picto[key])+'</span>':'';
    return '<div class="ti-sheet-block">'+pic+'<div><h2>'+esc(ti.labels[key])+'</h2><p>'+esc(text||'')+'</p></div></div>';
  };
  var sheet='<p class="ti-sheet-title">'+esc(ti.cardHead)+'</p><div class="ti-sheet-rule"></div>'+
    sheetBlock('cuesta',v.cuesta)+'<div class="ti-sheet-line"></div>';
  if(state.shape==='orden'){
    sheet+='<div class="ti-sheet-block"><div><h2>'+esc(ti.orderLabel)+'</h2><ol class="ti-sheet-order">'+
      used.map(function(s){return '<li><span>'+s.n+'</span><p>'+esc(s.text)+'</p></li>';}).join('')+'</ol></div></div>';
  }else{
    sheet+=sheetBlock('ayuda',v.ayuda);
  }
  sheet+='<div class="ti-sheet-line"></div>'+sheetBlock('necesito',v.necesito)+'<div class="ti-sheet-line"></div>'+
    '<div class="ti-sheet-foot"><p class="ti-sheet-strong">'+esc(ti.sheetFoot)+'</p>'+
    '<p class="ti-sheet-small">irisgreen.eu/es/recursos/tarjeta-iris/ · '+esc(ti.printedOn)+' '+esc(date)+'</p>'+
    '<p class="ti-sheet-credit">'+esc(ti.sheetCredit)+'</p></div>';
  $('#ti-sheet').innerHTML=sheet;

  $('#ti-plain').textContent=plainText();
}

function renderPictos(key){
  var ti=t(),box=$('#ti-pic-'+key);
  box.setAttribute('aria-label',ti.pictoGroup+' «'+ti.labels[key]+'»');
  $('#ti-pic-title-'+key).textContent=ti.pictoTitle;
  var list=$('#ti-pic-list-'+key);
  list.innerHTML=GROUPS[key].map(function(id){
    var on=state.picto[key]===id;
    return '<button type="button" class="ti-picto-btn" data-picto="'+id+'" data-slot="'+key+'" aria-pressed="'+on+'" '+
      'aria-label="'+esc((on?ti.pictoRemove:ti.pictoUse)+' '+name(id)+' '+ti.inBlock+' «'+ti.labels[key]+'»')+'">'+
      pictoHTML(id)+'<span>'+esc(name(id))+'</span></button>';
  }).join('');
  list.querySelectorAll('[data-picto]').forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.dataset.picto,slot=b.dataset.slot,off=state.picto[slot]===id;
      state.picto[slot]=off?null:id;
      state.notice=off?ti.stPictoOff.replace('$1',ti.labels[slot]):ti.stPicto.replace('$1',name(id)).replace('$2',ti.labels[slot]);
      save();render();
    });
  });
}

function renderSuggestions(key){
  var ti=t(),box=$('#ti-sug-'+key);
  box.innerHTML=SUGGEST[state.lang][key].map(function(text,i){
    return '<button type="button" data-suggest="'+i+'">'+esc(text)+'</button>';
  }).join('');
  box.querySelectorAll('[data-suggest]').forEach(function(b,i){
    b.addEventListener('click',function(){
      var text=SUGGEST[state.lang][key][i];
      commit();
      state[key]=text;
      state.notice=ti.stPhrase.replace('$1',ti.labels[key]);
      save();render();
    });
  });
}

function renderShapes(){
  var ti=t(),box=$('#ti-shapes-list');
  box.innerHTML=['texto','uno','orden'].map(function(id){
    var on=state.shape===id;
    return '<button type="button" class="ti-shape" data-shape="'+id+'" aria-pressed="'+on+'">'+
      '<span class="ti-tick">'+(on?TICK:'')+'</span><span>'+esc(ti.shapes[id])+'</span></button>';
  }).join('');
  box.querySelectorAll('[data-shape]').forEach(function(b){
    b.addEventListener('click',function(){
      state.shape=b.dataset.shape;
      state.copy=null;state.printed=false;
      state.notice=ti.stShape.replace('$1',ti.shapes[state.shape]);
      save();render();
    });
  });
}

function renderSteps(){
  var ti=t(),v=values(),list=$('#ti-order-list');
  list.innerHTML=v.pasos.map(function(text,i){
    return '<li class="ti-step"><span class="ti-num" aria-hidden="true">'+(i+1)+'</span>'+
      '<input class="ti-input" data-step="'+i+'" value="'+esc(text)+'" aria-label="'+esc(ti.stepLabel+' '+(i+1))+'"></li>';
  }).join('');
  list.querySelectorAll('[data-step]').forEach(function(input){
    input.addEventListener('change',function(){
      var i=Number(input.dataset.step),pasos=values().pasos.slice();
      pasos[i]=input.value;
      commit();
      state.pasos=pasos;
      save();render();
    });
  });
}

function renderStatus(){
  var ti=t(),box=$('#ti-card-status'),html='';
  if(state.copy==='ok')html='<p class="ti-ok">'+TICK+esc(ti.copied)+'</p>';
  else if(state.copy==='error')html='<div class="ti-warn"><p><strong>'+esc(ti.notCopied)+'</strong></p><p>'+esc(ti.notCopiedWhat)+'</p></div>';
  else if(state.printed)html='<p class="ti-ok">'+TICK+esc(ti.printed)+'</p>';
  box.innerHTML=html;
  $('#ti-editor-status').textContent=state.notice||'';
}

function render(){
  var ti=t(),v=values();
  document.documentElement.lang=state.lang;
  $('#ti-kicker').textContent=ti.kicker;
  $('#ti-title').textContent=ti.title;
  $('#ti-lede').textContent=ti.lede;
  $('#ti-privacy-text').textContent=ti.privacy;
  $('#ti-editor-title').textContent=ti.editorTitle;
  $('#ti-editor-note').textContent=ti.editorNote;
  $('#ti-example').hidden=!state.example;
  $('#ti-example-text').textContent=ti.exampleText;
  $('#ti-example-btn').textContent=ti.exampleBtn;
  $('#ti-shape-legend').textContent=ti.shapeLegend;
  $('#ti-shape-note').textContent=ti.shapeNote;
  $('#ti-reset').textContent=ti.reset;
  $('#ti-preview-title').textContent=ti.previewTitle;
  $('#ti-preview-note').textContent=ti.previewNote;
  $('#ti-text-title').textContent=ti.textTitle;
  $('#ti-text-note').textContent=ti.textNote;
  $('#ti-not-official').textContent=ti.notOfficial;
  $('#ti-copy').lastChild.textContent=ti.copy;
  $('#ti-copy').setAttribute('aria-label',ti.copyName);
  $('#ti-print').lastChild.textContent=ti.print;
  $('#ti-print').setAttribute('aria-label',ti.printName);

  renderShapes();

  KEYS.forEach(function(key){
    $('#ti-label-'+key).textContent=ti.labels[key];
    $('#ti-hint-'+key).textContent=ti.hints[key];
    var field=$('#ti-'+key);
    field.placeholder=ti.placeholders[key];
    if(field.value!==v[key])field.value=v[key];
    renderSuggestions(key);
    renderPictos(key);
    $('#ti-pic-'+key).hidden=state.shape==='texto';
  });

  $('#ti-order-label').textContent=ti.orderLabel;
  $('#ti-order-hint').textContent=ti.orderHint;
  $('#ti-block-ayuda').hidden=state.shape==='orden';
  $('#ti-order-block').hidden=state.shape!=='orden';
  if(state.shape==='orden')renderSteps();

  renderPreview();
  renderStatus();
}

function copyCard(){
  var text=plainText();
  var done=function(ok){state.copy=ok?'ok':'error';state.printed=false;renderStatus();};
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){done(true);},function(){done(false);});
    }else{
      done(false);
    }
  }catch(e){done(false);}
}

function printCard(){
  state.copy=null;state.printed=true;renderStatus();
  var host=$('#ti-sheet-host');
  document.documentElement.setAttribute('data-ti-print','1');
  host.setAttribute('data-ti-printing','1');
  var cleanup=function(){
    document.documentElement.removeAttribute('data-ti-print');
    host.removeAttribute('data-ti-printing');
    window.removeEventListener('afterprint',cleanup);
  };
  window.addEventListener('afterprint',cleanup);
  window.print();
  setTimeout(cleanup,1500);
}

function init(){
  restore();
  fromURL();

  /* El conmutador ES/EN vive en la cabecera del sitio, no en el contenido. */
  var applyLang=function(lang){
    if(lang!=='es'&&lang!=='en')return;
    if(lang!==state.lang){
      state.lang=lang;
      state.notice=T[lang].stLang;
      state.copy=null;state.printed=false;
      save();
    }
    render();
  };
  if(window.IG_IDIOMA){
    if(!window.IG_IDIOMA.stored())window.IG_IDIOMA.set(state.lang);
    window.IG_IDIOMA.on(applyLang);
  }else{
    document.addEventListener('ig:idioma',function(e){applyLang(e.detail.lang);});
  }

  KEYS.forEach(function(key){
    $('#ti-'+key).addEventListener('change',function(e){
      var value=e.target.value;
      commit();
      state[key]=value;
      state.notice='';
      save();render();
    });
  });

  $('#ti-example-btn').addEventListener('click',function(){
    state.example=false;
    state.cuesta='';state.ayuda='';state.necesito='';state.pasos=['','',''];
    state.notice=t().stCleared;state.copy=null;state.printed=false;
    save();render();
  });

  $('#ti-reset').addEventListener('click',function(){
    state.example=true;state.shape='uno';
    state.cuesta='';state.ayuda='';state.necesito='';state.pasos=['','',''];
    state.picto={cuesta:'hablar',ayuda:'escribir',necesito:'esperar'};
    state.notice=t().stReset;state.copy=null;state.printed=false;
    save();render();
  });

  $('#ti-copy').addEventListener('click',copyCard);
  $('#ti-print').addEventListener('click',printCard);

  render();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
