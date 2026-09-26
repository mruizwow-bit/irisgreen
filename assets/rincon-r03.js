/* R40-RINCON-R03 · navegación superior y control audiovisual explícito. */
(function(){
'use strict';
var ES=(document.documentElement.lang||'es').slice(0,2)!=='en',$=function(s){return document.querySelector(s);};
var panels={videos:$('#watch'),sounds:$('#listen'),ball:$('#pause')},tabs=[].slice.call(document.querySelectorAll('[data-r40-mode]')),sel=$('#r40ModeSelect'),workspace=$('#r40Workspace');
if(!panels.videos||!panels.sounds||!panels.ball||!tabs.length)return;
document.body.classList.add('r40-rincon-r03');$('.r40-mode-nav').hidden=false;
Object.keys(panels).forEach(function(k){panels[k].open=true;panels[k].setAttribute('role','tabpanel');panels[k].setAttribute('aria-labelledby','r40-tab-'+k);});
function stopMode(k){
 if(k==='videos'){var x=$('#stopVideo');if(x)x.click();}
 if(k==='sounds'){var a=$('#stopAudio');if(a)a.click();var m=$('#mixStop');if(m)m.click();}
 if(k==='ball'){var b=$('#stopBreath');if(b)b.click();}
}
var current='videos';
function setMode(k,focusPanel){
 if(!panels[k]||k===current&&panels[k].hidden===false)return;
 stopMode(current);current=k;
 Object.keys(panels).forEach(function(id){panels[id].hidden=id!==k;});
 tabs.forEach(function(b){var on=b.dataset.r40Mode===k;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
 if(sel)sel.value=k;
 if(focusPanel){var first=panels[k].querySelector('button:not([hidden]),input:not([hidden]),select:not([hidden]),[tabindex="0"]');if(first)first.focus();}
}
tabs.forEach(function(b,i){
 b.addEventListener('click',function(){setMode(b.dataset.r40Mode,false);});
 b.addEventListener('keydown',function(e){var n=i;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();tabs[n].focus();setMode(tabs[n].dataset.r40Mode,false);});
});
if(sel)sel.addEventListener('change',function(){setMode(sel.value,false);});
Object.keys(panels).forEach(function(k){panels[k].hidden=k!=='videos';});
var stage=$('#watchStage'),legacySound=$('#sceneSound'),vol=$('#sceneVol'),start=$('#r40StartAV'),image=$('#r40ImageOnly'),mute=$('#r40Mute'),status=$('#r40SceneStatus'),stop=$('#stopVideo'),selected='sea',active=null,mode=null,muted=false,serial=0;
var N=ES?{sea:'Mar',rain:'Lluvia en la ventana',river:'Río en el bosque',night:'Cielo nocturno',aquarium:'Acuario',bubbles:'Tubo de burbujas',jellies:'Medusas',fibre:'Fibra óptica',octopus:'Pulpos'}:{sea:'Sea',rain:'Rain on the window',river:'Stream in the forest',night:'Night sky',aquarium:'Aquarium',bubbles:'Bubble tube',jellies:'Jellyfish',fibre:'Fibre optics',octopus:'Octopuses'};
var D=ES?{sea:'Olas suaves llegan a la orilla.',rain:'Gotas resbalan por el cristal. No hay truenos.',river:'El agua corre entre piedras.',night:'Noche estable con estrellas y aurora suave.',aquarium:'Peces nadan despacio entre plantas y burbujas.',bubbles:'Burbujas suben lentamente por una columna de luz.',jellies:'Medusas luminosas flotan despacio en agua oscura.',fibre:'Hilos de luz cambian de color lentamente.',octopus:'Pulpos se mueven despacio entre rocas y plantas bajo el agua.'}:{sea:'Gentle waves reach the shore.',rain:'Drops slide down the glass. There is no thunder.',river:'Water runs over stones.',night:'A stable night with stars and a soft aurora.',aquarium:'Fish swim slowly among plants and bubbles.',bubbles:'Bubbles rise slowly through a column of light.',jellies:'Glowing jellyfish float slowly in dark water.',fibre:'Strands of light change colour slowly.',octopus:'Octopuses move slowly among rocks and plants underwater.'};
var POST={sea:'/img/rincon-tranquilo/escenas/mar.webp',rain:'/img/rincon-tranquilo/escenas/lluvia-ventana.webp',river:'/img/rincon-tranquilo/escenas/rio-bosque.webp',night:'/img/rincon-tranquilo/escenas/cielo-nocturno.webp',aquarium:'/img/rincon-tranquilo/escenas/acuario.webp',bubbles:'/img/rincon-tranquilo/escenas/tubo-burbujas.webp',jellies:'/img/rincon-tranquilo/escenas/medusas.webp',fibre:'/img/rincon-tranquilo/escenas/fibra-optica.webp'};
function say(s){if(status)status.textContent=s;}
function poster(k){if(!stage)return;stage.innerHTML='';var f=document.createElement('figure');f.className='r40-static-fallback';if(POST[k]){var im=document.createElement('img');im.src=POST[k];im.alt='';f.appendChild(im);}else{var art=document.createElement('div');art.className='r40-octopus-poster';art.setAttribute('role','img');art.setAttribute('aria-label',D[k]);f.appendChild(art);}var cap=document.createElement('figcaption');cap.textContent=D[k];f.appendChild(cap);stage.appendChild(f);}
function selectScene(k){if(!N[k])return;selected=k;[].slice.call(document.querySelectorAll('[data-scene]')).forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.scene===k));});if(!active)poster(k);say((ES?'Seleccionada: ':'Selected: ')+N[k]+'. '+(ES?'Pulsa Ver y escuchar o Solo imagen.':'Press Watch and listen or Image only.'));}
function legacy(k,withAudio){var b=document.querySelector('[data-scene="'+k+'"]');if(!b)return;if(legacySound){legacySound.checked=!!withAudio;legacySound.dispatchEvent(new Event('change',{bubbles:true}));}if(vol){vol.disabled=!withAudio;if(withAudio&&Number(vol.value)>35)vol.value='30';}b.dataset.r40Internal='1';b.click();delete b.dataset.r40Internal;}
function fade(fn){var ticket=++serial,d=(document.body.classList.contains('rm')||matchMedia('(prefers-reduced-motion: reduce)').matches)?0:400;stage.classList.add('r40-fade-out');setTimeout(function(){if(ticket!==serial)return;fn();requestAnimationFrame(function(){stage.classList.remove('r40-fade-out');});},d);}
function startScene(withAudio){fade(function(){legacy(selected,withAudio);active=selected;mode=withAudio?'av':'image';muted=false;update();say((withAudio?(ES?'Reproduciendo: ':'Playing: '):(ES?'Solo imagen: ':'Image only: '))+N[selected]+'.');setTimeout(fallback,700);});}
function fallback(){if(!active||active==='aquarium'||active==='bubbles'||active==='octopus')return;var empty=stage.querySelector('.empty-stage');if(empty){poster(active);say((ES?'Animación no disponible. Mostrando imagen fija: ':'Animation unavailable. Showing still image: ')+N[active]+'.');}}
function update(){if(mute){mute.disabled=mode!=='av';mute.setAttribute('aria-pressed',String(mode==='av'&&muted));}if(vol)vol.disabled=mode!=='av';}
function doMute(){if(mode!=='av')return;muted=!muted;if(legacySound){legacySound.checked=!muted;legacySound.dispatchEvent(new Event('change',{bubbles:true}));}update();say(muted?(ES?'Silenciado.':'Muted.'):(ES?'Sonido activado.':'Sound on.'));}
function capture(e){var b=e.currentTarget;if(b.dataset.r40Internal==='1')return;e.preventDefault();e.stopImmediatePropagation();selectScene(b.dataset.scene);}
[].slice.call(document.querySelectorAll('[data-scene]')).forEach(function(b){b.addEventListener('click',capture,true);});
if(start)start.addEventListener('click',function(){startScene(true);});
if(image)image.addEventListener('click',function(){startScene(false);});
if(mute)mute.addEventListener('click',doMute);
if(stop)stop.addEventListener('click',function(){serial++;active=null;mode=null;muted=false;update();say(ES?'Escena detenida.':'Scene stopped.');});
var obs=new MutationObserver(fallback);if(stage)obs.observe(stage,{childList:true});
var audioList=$('#audioList'),audio=$('#audio'),mixer=$('#mixer');if(audioList){audioList.hidden=true;audioList.setAttribute('aria-hidden','true');}if(audio){try{audio.pause();audio.removeAttribute('src');audio.load();}catch(e){}audio.hidden=true;audio.setAttribute('aria-hidden','true');}if(mixer)mixer.hidden=true;
selectScene('sea');setMode('videos',false);
})();