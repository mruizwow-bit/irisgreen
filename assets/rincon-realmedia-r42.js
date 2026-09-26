/* R42-A7 · HUMAN QA rebuild.
   Real nature footage for natural scenes, loaded only after explicit user action.
   Wikimedia Commons sources are credited per scene. Synthetic sensory scenes keep the local GPU engine. */
(function(window){
'use strict';
var FILE='https://commons.wikimedia.org/wiki/Special:Redirect/file/';
var PAGE='https://commons.wikimedia.org/wiki/File:';
var SCENES={
 sea:{file:'Waves_of_the_sea_(Video).webm',author:'Amada44',license:'CC BY-SA 4.0',page:'Waves_of_the_sea_(Video).webm'},
 rain:{file:'Rain_001.webm',author:'Amuzujoe',license:'CC BY-SA 4.0',page:'Rain_001.webm'},
 river:{file:'Bubbling_stream_at_Cascade_Springs,_May_17.webm',author:'An Errant Knight',license:'CC BY-SA 4.0',page:'Bubbling_stream_at_Cascade_Springs,_May_17.webm'},
 night:{file:'Aurora_borealis_timelapse.webm',author:'Harriniva Hotels&Safaris',license:'CC BY 3.0',page:'Aurora_borealis_timelapse.webm'},
 aquarium:{file:'Aquarium_of_Cattolica_-_Unidentified_fish.webm',author:'Horcrux92',license:'CC BY-SA 4.0',page:'Aquarium_of_Cattolica_-_Unidentified_fish.webm'},
 jellies:{file:'Phantom_Jellyfish_Off_of_the_Melchior_Islands.webm',author:'MasterfulNerd',license:'CC BY 4.0',page:'Phantom_Jellyfish_Off_of_the_Melchior_Islands.webm'},
 octopus:{file:'Octopus_Vulgaris_-_Poulpe_commun.webm',author:'Ericsfr',license:'CC BY-SA 4.0',page:'Octopus_Vulgaris_-_Poulpe_commun.webm'}
};
var POST={
 sea:'/img/rincon-tranquilo/escenas/mar.webp',
 rain:'/img/rincon-tranquilo/escenas/lluvia-ventana.webp',
 river:'/img/rincon-tranquilo/escenas/rio-bosque.webp',
 night:'/img/rincon-tranquilo/escenas/cielo-nocturno.webp',
 aquarium:'/img/rincon-tranquilo/escenas/acuario.webp',
 jellies:'/img/rincon-tranquilo/escenas/medusas.webp',
 octopus:'/img/rincon-tranquilo/escenas/acuario.webp'
};
function reduced(){
 try{return matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('rm');}catch(e){return false;}
}
function has(k){return !!SCENES[k];}
function src(k){var s=SCENES[k];return s?FILE+encodeURIComponent(s.file):'';}
function attribution(k,es){
 var s=SCENES[k];if(!s)return null;
 return {
  text:(es?'Vídeo: ':'Video: ')+s.author+' · '+s.license+' · Wikimedia Commons',
  href:PAGE+encodeURIComponent(s.page),
  author:s.author,license:s.license
 };
}
function mount(kind,stage,opts){
 var meta=SCENES[kind];if(!meta||!stage)return null;
 stage.innerHTML='';
 var wrap=document.createElement('div');wrap.className='r42-media-stage r42-media-'+kind;
 var poster=document.createElement('img');poster.className='r42-media-poster';poster.alt='';poster.decoding='async';poster.src=POST[kind]||POST.sea;wrap.appendChild(poster);
 var video=document.createElement('video');
 video.className='r42-media-video';video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';video.disablePictureInPicture=true;video.setAttribute('aria-hidden','true');
 wrap.appendChild(video);
 var veil=document.createElement('div');veil.className='r42-media-grade';veil.setAttribute('aria-hidden','true');wrap.appendChild(veil);
 var grain=document.createElement('div');grain.className='r42-media-atmosphere';grain.setAttribute('aria-hidden','true');wrap.appendChild(grain);
 stage.appendChild(wrap);
 var active=true,started=false;
 function stop(){active=false;try{video.pause();video.removeAttribute('src');video.load();}catch(e){}}
 function play(){
  if(!active||reduced())return Promise.resolve(false);
  if(!started){started=true;video.src=src(kind);}
  return video.play().then(function(){wrap.classList.add('is-video-ready');return true;}).catch(function(){wrap.classList.add('is-video-fallback');return false;});
 }
 video.addEventListener('loadeddata',function(){if(active)wrap.classList.add('is-loaded');},{once:true});
 video.addEventListener('error',function(){if(active)wrap.classList.add('is-video-fallback');});
 if(opts&&opts.autoplayAfterGesture)play();
 return {stop:stop,play:play,video:video,wrap:wrap,meta:meta};
}
window.IGQuietMediaR42={has:has,mount:mount,src:src,attribution:attribution,scenes:SCENES};
})(window);
