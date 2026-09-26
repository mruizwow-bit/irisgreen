/* R40 · controlador audiovisual del Rincón. Capa sobre el motor R20. */
(function(){
'use strict';
var ES=(document.documentElement.lang||'es').slice(0,2)!=='en';
var TXT=ES?{
 select:'Seleccionada: ',choose:'Elige una escena.',ready:'Lista. Pulsa Ver y escuchar o Solo imagen.',playing:'Reproduciendo: ',image:'Solo imagen: ',muted:'Silenciado.',unmuted:'Sonido activado.',stopped:'Escena detenida.',fallback:'La animación no está disponible. Puedes seguir con esta imagen fija.',
 names:{sea:'Mar',rain:'Lluvia en la ventana',river:'Río en el bosque',night:'Cielo nocturno',aquarium:'Acuario',bubbles:'Tubo de burbujas',jellies:'Medusas',fibre:'Fibra óptica',octopus:'Pulpos'},
 desc:{sea:'Olas suaves llegan a la orilla con el sol bajo sobre el agua.',rain:'Gotas resbalan despacio por el cristal. No hay truenos.',river:'El agua corre entre piedras; la vegetación se mueve despacio.',night:'Estrellas y una aurora suave sobre un lago oscuro.',aquarium:'Peces nadan despacio entre plantas y burbujas.',bubbles:'Burbujas suben despacio por una columna de luz.',jellies:'Medusas luminosas flotan despacio en agua oscura.',fibre:'Hilos de luz cambian de color lentamente.',octopus:'Pulpos se mueven despacio entre rocas y plantas bajo el agua.'}
}:{
 select:'Selected: ',choose:'Choose a scene.',ready:'Ready. Press Watch and listen or Image only.',playing:'Playing: ',image:'Image only: ',muted:'Muted.',unmuted:'Sound on.',stopped:'Scene stopped.',fallback:'The animation is not available. You can keep using this still image.',
 names:{sea:'Sea',rain:'Rain on the window',river:'Stream in the forest',night:'Night sky',aquarium:'Aquarium',bubbles:'Bubble tube',jellies:'Jellyfish',fibre:'Fibre optics',octopus:'Octopuses'},
 desc:{sea:'Gentle waves reach the shore with the sun low over the water.',rain:'Drops slide slowly down the glass. There is no thunder.',river:'Water runs over stones; the plants move slowly.',night:'Stars and a soft aurora over a dark lake.',aquarium:'Fish swim slowly among plants and bubbles.',bubbles:'Bubbles rise slowly through a column of light.',jellies:'Glowing jellyfish float slowly in dark water.',fibre:'Strands of light change colour slowly.',octopus:'Octopuses move slowly among rocks and plants underwater.'}
};
var POSTER={sea:'/img/rincon-tranquilo/escenas/mar.webp',rain:'/img/rincon-tranquilo/escenas/lluvia-ventana.webp',river:'/img/rincon-tranquilo/escenas/rio-bosque.webp',night:'/img/rincon-tranquilo/escenas/cielo-nocturno.webp',aquarium:'/img/rincon-tranquilo/escenas/acuario.webp',bubbles:'/img/rincon-tranquilo/escenas/tubo-burbujas.webp',jellies:'/img/rincon-tranquilo/escenas/medusas.webp',fibre:'/img/rincon-tranquilo/escenas/fibra-optica.webp'};
var $=function(s){return document.querySelector(s);};
var stage=$('#watchStage'),credit=$('#watchCredit'),status=$('#r40SceneStatus'),vol=$('#sceneVol'),legacySound=$('#sceneSound'),startAV=$('#r40StartAV'),imageOnly=$('#r40ImageOnly'),mute=$('#r40Mute'),stop=$('#stopVideo');
if(!stage||!startAV||!imageOnly||!stop)return;
document.body.classList.add('r40-rincon-av');
var selected='sea',active=null,mode=null,muted=false,switchSerial=0;
function reduced(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('rm');}catch(e){return document.body.classList.contains('rm');}}
function say(s){if(status)status.textContent=s;}
function sceneButtons(){return Array.prototype.slice.call(document.querySelectorAll('[data-scene]'));}
function buttonFor(kind){return document.querySelector('[data-scene="'+kind+'"]');}
function select(kind){
 if(!TXT.names[kind])return;selected=kind;sceneButtons().forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.scene===kind));});
 say(TXT.select+TXT.names[kind]+'. '+TXT.ready);
 if(!active)showPoster(kind);
}
function showPoster(kind){
 stage.innerHTML='';
 var fig=document.createElement('figure');fig.className='r40-static-fallback';
 if(POSTER[kind]){var img=document.createElement('img');img.src=POSTER[kind];img.alt='';fig.appendChild(img);}
 else{var art=document.createElement('div');art.className='r40-octopus-poster';art.setAttribute('aria-hidden','true');fig.appendChild(art);}
 var cap=document.createElement('figcaption');cap.textContent=TXT.desc[kind];fig.appendChild(cap);stage.appendChild(fig);
 if(credit)credit.textContent=ES?'Vista previa. Nada ha empezado.':'Preview. Nothing has started.';
}
function legacyClick(kind,withAudio){
 var b=buttonFor(kind);if(!b)return;
 if(legacySound)legacySound.checked=!!withAudio;
 if(vol){vol.disabled=false;if(!vol.value||Number(vol.value)>40)vol.value='30';}
 b.dataset.r40Internal='1';b.click();delete b.dataset.r40Internal;
}
function fadeSwitch(fn){
 var ticket=++switchSerial,d=reduced()?0:400;stage.classList.add('r40-fade-out');
 setTimeout(function(){if(ticket!==switchSerial)return;fn();requestAnimationFrame(function(){stage.classList.remove('r40-fade-out');});},d);
}
function startSelected(withAudio){
 if(reduced()){var slow=document.querySelector('input[name="sspeed"][value="0.5"]');if(slow)slow.checked=true;}
 fadeSwitch(function(){
   legacyClick(selected,withAudio);active=selected;mode=withAudio?'av':'image';muted=false;updateControls();say((withAudio?TXT.playing:TXT.image)+TXT.names[selected]+'.');
   setTimeout(ensureFallback,700);
 });
}
function ensureFallback(){
 if(!active||active==='aquarium'||active==='bubbles'||active==='octopus')return;
 var empty=stage.querySelector('.empty-stage');if(!empty)return;
 var kind=active;stage.innerHTML='';var fig=document.createElement('figure');fig.className='r40-static-fallback';
 var img=document.createElement('img');img.src=POSTER[kind];img.alt='';fig.appendChild(img);
 var cap=document.createElement('figcaption');cap.textContent=TXT.fallback+' '+TXT.desc[kind];fig.appendChild(cap);stage.appendChild(fig);
}
function updateControls(){
 var audio=mode==='av';if(mute){mute.disabled=!audio;mute.setAttribute('aria-pressed',String(audio&&muted));}
 if(vol)vol.disabled=!audio;
}
function toggleMute(){
 if(mode!=='av')return;muted=!muted;
 if(legacySound){legacySound.checked=!muted;legacySound.dispatchEvent(new Event('change',{bubbles:true}));}
 updateControls();say(muted?TXT.muted:TXT.unmuted);
}
function stopAll(){
 switchSerial++;active=null;mode=null;muted=false;updateControls();say(TXT.stopped);
}
function selectCapture(e){
 var b=e.currentTarget;if(b.dataset.r40Internal==='1')return;
 e.preventDefault();e.stopImmediatePropagation();select(b.dataset.scene);
}
sceneButtons().forEach(function(b){b.addEventListener('click',selectCapture,true);});
startAV.addEventListener('click',function(){startSelected(true);});
imageOnly.addEventListener('click',function(){startSelected(false);});
if(mute)mute.addEventListener('click',toggleMute);
stop.addEventListener('click',function(e){if(stop.dataset.r40Internal==='1')return;stopAll();});
var observer=new MutationObserver(function(){if(active&&active!=='octopus')ensureFallback();});observer.observe(stage,{childList:true,subtree:false});
function hideHistorical(){
 var list=$('#audioList');if(list){list.classList.add('r40-hold-recording');list.setAttribute('aria-hidden','true');}
 var au=$('#audio');if(au){try{au.pause();au.removeAttribute('src');au.load();}catch(e){}au.classList.add('r40-hold-recording');}
 Array.prototype.slice.call(document.querySelectorAll('#mixList .qmixrow')).forEach(function(row){var sm=row.querySelector('small');if(sm&&sm.textContent.trim()!=='Iris Green'){row.classList.add('r40-hold-recording');row.querySelectorAll('input').forEach(function(i){i.disabled=true;});}});
}
hideHistorical();setTimeout(hideHistorical,200);setTimeout(hideHistorical,1000);
select(selected);
window.addEventListener('pagehide',function(){active=null;mode=null;});
})();