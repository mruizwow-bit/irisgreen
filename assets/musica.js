/* Iris Green · audio local. El panel se crea solo al abrirlo y el audio solo al pulsar Escuchar. */
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
    es:{title:'Música',close:'Cerrar reproductor',play:'Escuchar',pause:'Pausa',prev:'Anterior',next:'Siguiente',list:'Elegir una pieza',volume:'Volumen',repeat:'Repetir lista',credit:'Música de Pixabay. Autor indicado en cada pieza.',error:'No se ha podido reproducir esta pieza. Prueba otra o pulsa Escuchar de nuevo.'},
    en:{title:'Music',close:'Close player',play:'Play',pause:'Pause',prev:'Previous',next:'Next',list:'Choose a track',volume:'Volume',repeat:'Repeat playlist',credit:'Music from Pixabay. Each track credits its author.',error:'This track could not be played. Choose another or press Play again.'},
    pt:{title:'Música',close:'Fechar reprodutor',play:'Ouvir',pause:'Pausa',prev:'Anterior',next:'Seguinte',list:'Escolher uma faixa',volume:'Volume',repeat:'Repetir lista',credit:'Música do Pixabay. O autor aparece em cada faixa.',error:'Não foi possível reproduzir esta faixa. Escolha outra ou pressione Ouvir novamente.'}
  };
  var panel, audio, playButton, title, author, status, closeButton, lastTrigger, labels, previousButton, nextButton, listSummary, volumeLabel, volumeSlider, repeatText, creditText, selected = 0, repeat = true, open = false;
  var selector = '#plBtn,.ig-uh-music,[data-ig-music]';
  function language() { var lang = document.documentElement.lang || 'es'; return TEXT[lang.slice(0,2)] || TEXT.es; }
  function el(tag, text, className) { var node=document.createElement(tag); if(text)node.textContent=text;if(className)node.className=className;return node; }
  function button(text, callback) { var b=el('button',text);b.type='button';b.addEventListener('click',callback);return b; }
  function sync() {
    if(!panel)return;
    title.textContent=TRACKS[selected].t; author.textContent=TRACKS[selected].a;
    playButton.textContent=audio && !audio.paused ? labels.pause : labels.play;
    panel.querySelectorAll('[data-track]').forEach(function(b){b.setAttribute('aria-current',String(Number(b.dataset.track)===selected));});
  }
  function updateLabels() {
    if(!panel)return;
    labels=language();
    panel.querySelector('#ig-music-title').textContent=labels.title;
    closeButton.setAttribute('aria-label',labels.close);
    previousButton.textContent=labels.prev;nextButton.textContent=labels.next;
    listSummary.textContent=labels.list;volumeLabel.textContent=labels.volume;
    volumeSlider.setAttribute('aria-label',labels.volume);
    repeatText.textContent=labels.repeat;creditText.textContent=labels.credit;
    if(status.textContent)status.textContent=labels.error;
    sync();
  }
  function ensureAudio() {
    if(audio)return audio;
    audio=new Audio(); audio.preload='none';audio.volume=.6;
    audio.addEventListener('play',sync);audio.addEventListener('pause',sync);
    audio.addEventListener('error',function(){status.textContent=labels.error;sync();});
    audio.addEventListener('ended',function(){if(selected<TRACKS.length-1)play(selected+1);else if(repeat)play(0);else sync();});
    return audio;
  }
  function play(index) {
    selected=(index+TRACKS.length)%TRACKS.length;
    var a=ensureAudio(), url=new URL('/audio/'+TRACKS[selected].f,location.origin).href;
    status.textContent=''; if(a.src!==url)a.src=url;
    a.play().then(sync).catch(function(){status.textContent=labels.error;sync();});sync();
  }
  function close(restore) {
    if(!panel)return;
    if(typeof panel.hidePopover==='function'){try{panel.hidePopover();}catch(_) {}}
    panel.hidden=true;open=false;
    document.querySelectorAll(selector).forEach(function(b){b.setAttribute('aria-expanded','false');});
    if(restore&&lastTrigger&&lastTrigger.isConnected)lastTrigger.focus();
  }
  function create() {
    labels=language();
    var css=el('style');css.id='ig-music-styles';css.textContent=
      '#ig-music-panel{position:fixed!important;inset:auto max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) auto!important;margin:0!important;width:min(320px,calc(100% - 24px))!important;max-width:calc(100% - 24px)!important;max-height:min(480px,calc(100dvh - 24px))!important;height:auto!important;overflow:auto!important;box-sizing:border-box!important;padding:14px!important;z-index:10000!important;background:rgba(255,255,255,.98)!important;color:#17395c!important;border:1px solid #dfe6ef!important;border-radius:18px!important;box-shadow:0 12px 40px -16px rgba(23,57,92,.4)!important;font:15px/1.4 "Atkinson Hyperlegible",system-ui,sans-serif!important;text-align:left!important;transform:none!important;filter:none!important}' +
      '#ig-music-panel[hidden]{display:none!important}#ig-music-panel::backdrop{background:transparent;pointer-events:none}' +
      '#ig-music-panel *{box-sizing:border-box}#ig-music-panel button{font:inherit;cursor:pointer;color:inherit;background:white;border:1px solid #dfe6ef;border-radius:999px;min-height:44px;padding:6px 10px}#ig-music-panel button:hover{border-color:#5a49a8}#ig-music-panel :focus-visible{outline:3px solid #5a49a8;outline-offset:2px}' +
      '#ig-music-panel .ig-m-head{display:flex;align-items:center;justify-content:space-between;gap:10px}#ig-music-panel .ig-m-head strong{font-size:17px}#ig-music-panel .ig-m-close{min-width:44px;font-size:23px;padding:0}' +
      '#ig-music-panel .ig-m-title{display:block;margin:8px 0 2px}#ig-music-panel .ig-m-author{display:block;color:#5a6675;font-size:13px}#ig-music-panel .ig-m-controls{display:flex;gap:6px;margin:12px 0}#ig-music-panel .ig-m-play{flex:1;background:#17395c;color:white}' +
      '#ig-music-panel .ig-m-volume{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:13px}#ig-music-panel input[type=range]{flex:1;min-width:0;min-height:44px}#ig-music-panel summary{cursor:pointer;padding:12px 0;min-height:44px;font-weight:700}' +
      '#ig-music-panel ol{list-style:none;margin:0;padding:0;max-height:165px;overflow:auto}#ig-music-panel ol button{width:100%;text-align:left;border-radius:10px;border-color:transparent;display:block}#ig-music-panel ol button span{display:block;font-size:12px;color:#5a6675}#ig-music-panel [aria-current=true]{background:#edf3fa;border-color:#dfe6ef}' +
      '#ig-music-panel .ig-m-repeat{font-size:13px;display:flex;align-items:center;gap:6px;min-height:44px}#ig-music-panel .ig-m-credit{font-size:12px;color:#5a6675;margin:8px 0 0}#ig-music-panel .ig-m-status{font-size:13px;color:#8c245a;margin:4px 0}#ig-music-panel .ig-m-status:empty{display:none}';
    document.head.appendChild(css);
    panel=el('section');panel.id='ig-music-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','ig-music-title');
    if('showPopover' in HTMLElement.prototype)panel.setAttribute('popover','manual');
    var head=el('div','', 'ig-m-head'), heading=el('strong',labels.title);heading.id='ig-music-title';
    closeButton=button('×',function(){close(true);});closeButton.className='ig-m-close';closeButton.setAttribute('aria-label',labels.close);head.append(heading,closeButton);panel.append(head);
    title=el('strong','', 'ig-m-title');author=el('span','', 'ig-m-author');panel.append(title,author);
    var controls=el('div','', 'ig-m-controls');
    playButton=button(labels.play,function(){if(audio&&!audio.paused)audio.pause();else play(selected);});playButton.className='ig-m-play';
    previousButton=button(labels.prev,function(){play(selected-1);});nextButton=button(labels.next,function(){play(selected+1);});
    controls.append(previousButton,playButton,nextButton);panel.append(controls);
    var volume=el('label','', 'ig-m-volume'),slider=el('input');slider.type='range';slider.min='0';slider.max='100';slider.value='60';slider.setAttribute('aria-label',labels.volume);
    slider.addEventListener('input',function(){ensureAudio().volume=Number(slider.value)/100;});volumeLabel=el('span',labels.volume);volumeSlider=slider;volume.append(volumeLabel,slider);panel.append(volume);
    var details=el('details'), summary=el('summary',labels.list),list=el('ol');listSummary=summary;
    TRACKS.forEach(function(track,i){var li=el('li'),b=button(track.t,function(){selected=i;play(i);});b.dataset.track=String(i);b.append(el('span',track.a));li.append(b);list.append(li);});details.append(summary,list);panel.append(details);
    var loopLabel=el('label','', 'ig-m-repeat'),loop=el('input');loop.type='checkbox';loop.checked=true;loop.addEventListener('change',function(){repeat=loop.checked;});repeatText=el('span',labels.repeat);loopLabel.append(loop,repeatText);panel.append(loopLabel);
    status=el('p','', 'ig-m-status');status.setAttribute('role','status');creditText=el('p',labels.credit,'ig-m-credit');panel.append(status,creditText);
    /* Fuera de cabeceras con blur/transform. El popover usa la capa superior cuando está disponible. */
    document.body.appendChild(panel);sync();
  }
  document.addEventListener('click',function(event){
    var b=event.target.closest&&event.target.closest(selector);if(!b)return;
    event.preventDefault();event.stopImmediatePropagation();lastTrigger=b;
    if(open){close(true);return;}
    if(!panel)create();
    document.dispatchEvent(new CustomEvent('ig:panel-opening',{detail:'music'}));
    updateLabels();panel.hidden=false;
    if(typeof panel.showPopover==='function'){try{panel.showPopover();}catch(_) {}}
    open=true;b.setAttribute('aria-controls',panel.id);b.setAttribute('aria-expanded','true');closeButton.focus();
  },true);
  document.addEventListener('keydown',function(event){
    var b=event.target.closest&&event.target.closest(selector);
    if(b&&b.tagName!=='BUTTON'&&event.key===' '){event.preventDefault();b.click();return;}
    if(event.key==='Escape'&&open){event.preventDefault();event.stopImmediatePropagation();close(true);}
  });
  document.addEventListener('ig:panel-opening',function(e){if(e.detail==='reading'&&open)close(false);});
  // Only one attribute is observed: language changes, never the page subtree.
  new MutationObserver(updateLabels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('pagehide',function(){if(audio)audio.pause();});
})();
