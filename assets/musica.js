/* Iris Green · reproductor de audio local.
   Un único controlador para toda la web. No usa Popover API: el panel es fijo,
   no desplaza la página y no depende del sistema de componentes de cada sección. */
(function () {
  'use strict';
  if (window.__igMusicReady) return;
  window.__igMusicReady = true;

  var TRACKS = [
    { f:'un-momento-de-calma.m4a',t:'Un momento de calma',a:'MickeysCat' },
    { f:'calma-por-dentro.m4a',t:'Calma por dentro',a:'The_Mountain' },
    { f:'piano-tranquilo.m4a',t:'Piano tranquilo',a:'leberch' },
    { f:'piano-suave.m4a',t:'Piano suave',a:'leberch' },
    { f:'piano-minimo.m4a',t:'Piano mínimo',a:'leberch' },
    { f:'bajo-el-agua.m4a',t:'Bajo el agua',a:'leberch' },
    { f:'piano-fondo.m4a',t:'Piano de fondo',a:'andriih' },
    { f:'piano-flores.m4a',t:'Piano y flores',a:'andriih' },
    { f:'entre-estrellas.m4a',t:'Entre estrellas',a:'The_Mountain' },
    { f:'atmosfera.mp3',t:'Atmósfera',a:'AtlasAudio' },
    { f:'lluvia-en-el-cuarto.mp3',t:'Lluvia en el cuarto',a:'CeleronBeats' },
    { f:'lluvia-y-resonancia.mp3',t:'Lluvia y resonancia',a:'CeleronBeats' },
    { f:'meditacion.mp3',t:'Meditación',a:'DanaMusic' },
    { f:'meditacion-larga.mp3',t:'Meditación larga',a:'DanaMusic' },
    { f:'susurros-del-cielo.mp3',t:'Susurros del cielo',a:'Djovan' },
    { f:'viaje-por-el-cielo.mp3',t:'Viaje por el cielo',a:'HarumachiMusic' },
    { f:'ambiente-1.mp3',t:'Ambiente I',a:'leberch' },
    { f:'ambiente-2.mp3',t:'Ambiente II',a:'leberch' },
    { f:'ambiente-3.mp3',t:'Ambiente III',a:'leberch' },
    { f:'una-estrella-pequena.mp3',t:'Una estrella pequeña',a:'M_Haroon' },
    { f:'musica-de-lluvia.mp3',t:'Música de lluvia',a:'PaulYudin' },
    { f:'ambiente-4.mp3',t:'Ambiente 4',a:'leberch' },
    { f:'ambiente-largo-1.mp3',t:'Ambiente largo I',a:'Lachm' },
    { f:'ambiente-largo-2.mp3',t:'Ambiente largo II',a:'Lachm' }
  ];

  var TEXT = {
    es:{title:'Música',close:'Cerrar reproductor',play:'Escuchar',pause:'Pausa',prev:'Anterior',next:'Siguiente',list:'Elegir una pieza',volume:'Volumen',repeat:'Repetir lista',credit:'Música de Pixabay. Autor indicado en cada pieza.',error:'No se ha podido reproducir esta pieza. Prueba otra.',loading:'Cargando…'},
    en:{title:'Music',close:'Close player',play:'Play',pause:'Pause',prev:'Previous',next:'Next',list:'Choose a track',volume:'Volume',repeat:'Repeat playlist',credit:'Music from Pixabay. Each track credits its author.',error:'This track could not be played. Choose another.',loading:'Loading…'}
  };

  var selector='#plBtn,.ig-uh-music,[data-ig-music]';
  var panel=null,audio=null,playButton=null,title=null,author=null,status=null,closeButton=null;
  var previousButton=null,nextButton=null,listSummary=null,volumeLabel=null,volumeSlider=null,repeatText=null,creditText=null;
  var lastTrigger=null,selected=0,repeat=true,open=false,errorAdvance=false;

  function labels(){
    return String(document.documentElement.lang||'es').toLowerCase().indexOf('en')===0?TEXT.en:TEXT.es;
  }
  function el(tag,text,className){
    var node=document.createElement(tag);
    if(text!==undefined&&text!==null&&text!=='')node.textContent=text;
    if(className)node.className=className;
    return node;
  }
  function button(text,callback){
    var node=el('button',text);node.type='button';node.addEventListener('click',callback);return node;
  }
  function setExpanded(value){
    document.querySelectorAll(selector).forEach(function(trigger){
      trigger.setAttribute('aria-expanded',String(value));
      if(panel)trigger.setAttribute('aria-controls',panel.id);
    });
  }
  function audioURL(index){return new URL('/audio/'+TRACKS[index].f,location.origin).href;}
  function sync(){
    if(!panel)return;
    var L=labels();
    title.textContent=TRACKS[selected].t;
    author.textContent=TRACKS[selected].a;
    playButton.textContent=audio&&!audio.paused?L.pause:L.play;
    panel.querySelectorAll('[data-track]').forEach(function(node){
      var current=Number(node.dataset.track)===selected;
      node.setAttribute('aria-current',current?'true':'false');
    });
  }
  function updateLabels(){
    if(!panel)return;
    var L=labels();
    panel.querySelector('#ig-music-title').textContent=L.title;
    closeButton.setAttribute('aria-label',L.close);
    previousButton.textContent=L.prev;
    nextButton.textContent=L.next;
    listSummary.textContent=L.list;
    volumeLabel.textContent=L.volume;
    volumeSlider.setAttribute('aria-label',L.volume);
    repeatText.textContent=L.repeat;
    creditText.textContent=L.credit;
    sync();
  }
  function ensureAudio(){
    if(audio)return audio;
    audio=new Audio();
    audio.preload='metadata';
    audio.volume=.6;
    audio.addEventListener('play',function(){status.textContent='';sync();});
    audio.addEventListener('pause',sync);
    audio.addEventListener('waiting',function(){if(panel&&open)status.textContent=labels().loading;});
    audio.addEventListener('canplay',function(){if(status&&status.textContent===labels().loading)status.textContent='';});
    audio.addEventListener('ended',function(){
      if(selected<TRACKS.length-1)play(selected+1,false);
      else if(repeat)play(0,false);
      else sync();
    });
    audio.addEventListener('error',function(){
      if(!status)return;
      /* Algunos navegadores no reproducen M4A aunque sí MP3. Si falla una M4A,
         saltamos una sola vez a la primera MP3 para que el reproductor siga siendo útil. */
      if(!errorAdvance&&/\.m4a$/i.test(TRACKS[selected].f)){
        errorAdvance=true;
        var fallback=TRACKS.findIndex(function(track){return /\.mp3$/i.test(track.f);});
        if(fallback>=0){play(fallback,false);return;}
      }
      status.textContent=labels().error;
      sync();
    });
    return audio;
  }
  function play(index,fromUser){
    selected=(index+TRACKS.length)%TRACKS.length;
    var player=ensureAudio();
    var src=audioURL(selected);
    status.textContent='';
    if(player.src!==src){player.src=src;player.load();}
    var promise=player.play();
    if(promise&&typeof promise.catch==='function'){
      promise.catch(function(err){
        /* Un bloqueo de autoplay solo puede ocurrir al avanzar automáticamente.
           No lo presentamos como archivo roto; el botón Escuchar sigue disponible. */
        if(fromUser!==false)status.textContent=labels().error;
        sync();
      });
    }
    sync();
  }
  function close(restoreFocus){
    if(!panel)return;
    panel.hidden=true;
    open=false;
    setExpanded(false);
    if(restoreFocus&&lastTrigger&&lastTrigger.isConnected)lastTrigger.focus({preventScroll:true});
  }
  function create(){
    if(panel)return;
    var L=labels();
    var css=el('style');
    css.id='ig-music-styles';
    css.textContent=
      '#ig-music-panel{position:fixed!important;right:max(12px,env(safe-area-inset-right))!important;bottom:max(12px,env(safe-area-inset-bottom))!important;left:auto!important;top:auto!important;margin:0!important;width:min(330px,calc(100% - 24px))!important;max-height:min(500px,calc(100dvh - 24px))!important;overflow:auto!important;box-sizing:border-box!important;padding:14px!important;z-index:10000!important;background:rgba(255,255,255,.98)!important;color:#17395c!important;border:1px solid #dfe6ef!important;border-radius:18px!important;box-shadow:0 12px 40px -16px rgba(23,57,92,.4)!important;font:15px/1.4 "Atkinson Hyperlegible",system-ui,sans-serif!important;text-align:left!important;transform:none!important;filter:none!important}' +
      '#ig-music-panel[hidden]{display:none!important}' +
      '#ig-music-panel *{box-sizing:border-box}#ig-music-panel button{font:inherit;cursor:pointer;color:inherit;background:#fff;border:1px solid #dfe6ef;border-radius:999px;min-height:44px;padding:6px 10px}#ig-music-panel button:hover{border-color:#5a49a8}#ig-music-panel :focus-visible{outline:3px solid #5a49a8;outline-offset:2px}' +
      '#ig-music-panel .ig-m-head{display:flex;align-items:center;justify-content:space-between;gap:10px}#ig-music-panel .ig-m-head strong{font-size:17px}#ig-music-panel .ig-m-close{min-width:44px;font-size:23px;padding:0}' +
      '#ig-music-panel .ig-m-title{display:block;margin:8px 0 2px}#ig-music-panel .ig-m-author{display:block;color:#5a6675;font-size:13px}' +
      '#ig-music-panel .ig-m-controls{display:flex;gap:6px;margin:12px 0}#ig-music-panel .ig-m-play{flex:1;background:#17395c;color:#fff}' +
      '#ig-music-panel .ig-m-volume{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:13px}#ig-music-panel input[type=range]{flex:1;min-width:0;min-height:44px}' +
      '#ig-music-panel summary{cursor:pointer;padding:12px 0;min-height:44px;font-weight:700}' +
      '#ig-music-panel ol{list-style:none;margin:0;padding:0;max-height:175px;overflow:auto}#ig-music-panel ol button{width:100%;text-align:left;border-radius:10px;border-color:transparent;display:block}#ig-music-panel ol button span{display:block;font-size:12px;color:#5a6675}#ig-music-panel [aria-current=true]{background:#edf3fa;border-color:#dfe6ef}' +
      '#ig-music-panel .ig-m-repeat{font-size:13px;display:flex;align-items:center;gap:6px;min-height:44px}' +
      '#ig-music-panel .ig-m-credit{font-size:12px;color:#5a6675;margin:8px 0 0}#ig-music-panel .ig-m-status{font-size:13px;color:#8c245a;margin:4px 0}#ig-music-panel .ig-m-status:empty{display:none}';
    document.head.appendChild(css);

    panel=el('section');
    panel.id='ig-music-panel';
    panel.hidden=true;
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-labelledby','ig-music-title');

    var head=el('div','', 'ig-m-head');
    var heading=el('strong',L.title);heading.id='ig-music-title';
    closeButton=button('×',function(){close(true);});
    closeButton.className='ig-m-close';closeButton.setAttribute('aria-label',L.close);
    head.append(heading,closeButton);panel.append(head);

    title=el('strong','', 'ig-m-title');
    author=el('span','', 'ig-m-author');
    panel.append(title,author);

    var controls=el('div','', 'ig-m-controls');
    previousButton=button(L.prev,function(){errorAdvance=false;play(selected-1,true);});
    playButton=button(L.play,function(){
      if(audio&&!audio.paused)audio.pause();
      else{errorAdvance=false;play(selected,true);}
    });
    playButton.className='ig-m-play';
    nextButton=button(L.next,function(){errorAdvance=false;play(selected+1,true);});
    controls.append(previousButton,playButton,nextButton);panel.append(controls);

    var volume=el('label','', 'ig-m-volume');
    volumeLabel=el('span',L.volume);
    volumeSlider=el('input');volumeSlider.type='range';volumeSlider.min='0';volumeSlider.max='100';volumeSlider.value='60';volumeSlider.setAttribute('aria-label',L.volume);
    volumeSlider.addEventListener('input',function(){ensureAudio().volume=Number(volumeSlider.value)/100;});
    volume.append(volumeLabel,volumeSlider);panel.append(volume);

    var details=el('details'),list=el('ol');
    listSummary=el('summary',L.list);
    TRACKS.forEach(function(track,i){
      var li=el('li');
      var pick=button(track.t,function(){errorAdvance=false;selected=i;play(i,true);});
      pick.dataset.track=String(i);pick.append(el('span',track.a));li.append(pick);list.append(li);
    });
    details.append(listSummary,list);panel.append(details);

    var loopLabel=el('label','', 'ig-m-repeat'),loop=el('input');
    loop.type='checkbox';loop.checked=true;
    loop.addEventListener('change',function(){repeat=loop.checked;});
    repeatText=el('span',L.repeat);loopLabel.append(loop,repeatText);panel.append(loopLabel);

    status=el('p','', 'ig-m-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    creditText=el('p',L.credit,'ig-m-credit');
    panel.append(status,creditText);
    document.body.appendChild(panel);
    sync();
  }

  function openPlayer(trigger){
    lastTrigger=trigger;
    if(!panel)create();
    document.dispatchEvent(new CustomEvent('ig:panel-opening',{detail:'music'}));
    updateLabels();
    panel.hidden=false;
    open=true;
    setExpanded(true);
    closeButton.focus({preventScroll:true});
  }

  document.addEventListener('click',function(event){
    var trigger=event.target.closest&&event.target.closest(selector);
    if(!trigger)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(open){close(true);return;}
    openPlayer(trigger);
  },true);

  document.addEventListener('keydown',function(event){
    var trigger=event.target.closest&&event.target.closest(selector);
    if(trigger&&trigger.tagName!=='BUTTON'&&(event.key===' '||event.key==='Enter')){
      event.preventDefault();trigger.click();return;
    }
    if(event.key==='Escape'&&open){event.preventDefault();event.stopImmediatePropagation();close(true);}
  },true);

  document.addEventListener('ig:panel-opening',function(event){if(event.detail==='reading'&&open)close(false);});
  document.addEventListener('ig:uncover-focus',function(event){if(event.detail==='music'&&open)close(false);});
  new MutationObserver(updateLabels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('pagehide',function(){if(audio)audio.pause();});
})();
