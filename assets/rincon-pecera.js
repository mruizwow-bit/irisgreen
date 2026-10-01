/* R61 original illustrated aquarium, mounted inside the shared Quiet Corner.
   Audio remains separate so gentle motion never changes its pitch. */
(function () {
  'use strict';
  const root = document.querySelector('.pecera');
  if (!root) return;
  const en = document.documentElement.lang.startsWith('en');
  const words = en ? {
    start:'Watch and listen', stop:'Stop', mute:'Mute', unmute:'Sound on',
    ready:'Ready when you are.', playing:'Playing.', stopped:'Stopped.',
    still:'Still image. Sound and motion are stopped.', loading:'Loading the scene…',
    error:'The scene could not play. Try again.', full:'Full screen', exit:'Leave full screen'
  } : {
    start:'Ver y escuchar', stop:'Parar', mute:'Silenciar', unmute:'Activar sonido',
    ready:'Preparada cuando tú quieras.', playing:'En marcha.', stopped:'Escena detenida.',
    still:'Imagen fija. Sonido y movimiento detenidos.', loading:'Cargando la escena…',
    error:'No se ha podido reproducir la escena. Vuelve a intentarlo.', full:'Pantalla completa', exit:'Salir de pantalla completa'
  };
  const get = name => root.querySelector('[data-pecera="'+name+'"]');
  const video=get('video'), audio=get('audio'), poster=get('poster'), status=get('status');
  const start=get('start'), stop=get('stop'), mute=get('mute'), gentle=get('gentle'), still=get('still'), volume=get('volume'), full=get('full');
  const narrow=matchMedia('(max-width:520px)'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const base='/assets/rincon-pecera/';
  let running=false, pending=false, muted=false, soft=reduced.matches, imageOnly=false, serial=0;
  let chosen='';
  function selectMedia() {
    if (running || pending) return;
    const name=narrow.matches ? 'pecera_10min_movil.mp4' : 'pecera_10min.mp4';
    const picture=base+(narrow.matches ? 'pecera_poster_movil.jpg' : 'pecera_poster.jpg');
    poster.src=picture; video.poster=picture;
    // Do not assign a video/audio source until a deliberate play action.
    if (chosen!==name) { chosen=name; video.removeAttribute('src'); video.load(); }
  }
  function paint() {
    start.disabled=pending || imageOnly || running;
    start.textContent=words.start;
    stop.disabled=!running && !pending;
    mute.disabled=imageOnly;
    mute.textContent=muted ? words.unmute : words.mute;
    mute.setAttribute('aria-pressed',String(muted));
    gentle.setAttribute('aria-pressed',String(soft));
    still.setAttribute('aria-pressed',String(imageOnly));
    volume.disabled=imageOnly;
    full.textContent=document.fullscreenElement===root ? words.exit : words.full;
    video.playbackRate=soft ? .7 : 1;
    video.muted=true;
    audio.muted=muted || imageOnly;
    audio.volume=Number(volume.value)/100;
  }
  function halt(message) {
    serial++; running=false; pending=false;
    video.pause(); audio.pause();
    if (video.readyState) video.currentTime=0;
    if (audio.readyState) audio.currentTime=0;
    video.hidden=true; poster.hidden=false;
    status.textContent=message || words.stopped;
    selectMedia(); paint();
  }
  async function play() {
    if (imageOnly) return;
    const token=++serial;
    pending=true; status.textContent=words.loading; paint();
    video.src=base+chosen;
    audio.src=base+'pecera_audio_10min.m4a';
    try {
      // Both requests start in the user's gesture; only the separate audio is audible.
      await Promise.all([video.play(),audio.play()]);
      if (token!==serial) return;
      pending=false; running=true; video.hidden=false; poster.hidden=true;
      status.textContent=words.playing; paint();
    } catch (_) {
      if (token===serial) halt(words.error);
    }
  }
  start.addEventListener('click',()=>running ? halt() : play());
  stop.addEventListener('click',()=>halt());
  mute.addEventListener('click',()=>{muted=!muted;paint();});
  volume.addEventListener('input',()=>{if(Number(volume.value)>0) muted=false;paint();});
  gentle.addEventListener('click',()=>{soft=!soft;paint();});
  still.addEventListener('click',()=>{
    imageOnly=!imageOnly;
    halt(imageOnly ? words.still : words.ready);
  });
  full.addEventListener('click',async()=>{
    try {
      if (document.fullscreenElement===root) await document.exitFullscreen();
      else if (root.requestFullscreen) await root.requestFullscreen();
    } catch (_) { status.textContent=en?'Full screen is unavailable.':'Pantalla completa no disponible.'; }
  });
  document.addEventListener('fullscreenchange',paint);
  video.addEventListener('ended',()=>halt());
  [video,audio].forEach(media=>media.addEventListener('error',()=>{if(running || pending)halt(words.error);}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden && (running || pending))halt();});
  window.addEventListener('pagehide',()=>halt());
  document.addEventListener('ig:quiet-mode',event=>{if(event.detail!=='aquarium' && (running || pending))halt();});
  narrow.addEventListener('change',selectMedia);
  selectMedia(); status.textContent=words.ready; paint();
})();
