/* R40-RINCON-R04 · sprites de audio renderizados first-party.
   Web Audio solo decodifica, reproduce, hace loop/fade y controla volumen. */
(function(window){
'use strict';
var AC=window.AudioContext||window.webkitAudioContext,ctx=null,cache={},loading={};
var SPR={nature:'/audio/rincon/r04/general-nature.m4a',calm:'/audio/rincon/r04/general-calm.m4a',scenes:'/audio/rincon/r04/scenes.m4a'};
var ITEM={lluvia:['nature',0,14],'lluvia-ventana':['nature',14,14],olas:['nature',28,14],rio:['nature',42,14],viento:['nature',56,14],pajaros:['nature',70,14],grillos:['nature',84,14],fuego:['nature',98,14],'ruido-rosa':['calm',0,14],'ruido-marron':['calm',14,14],piano:['calm',28,14],cuencos:['calm',42,14],'escena-mar':['scenes',0,14],'escena-lluvia':['scenes',14,14],'escena-rio':['scenes',28,14],'escena-noche':['scenes',42,14],'escena-acuario':['scenes',56,14],'escena-burbujas':['scenes',70,14],'escena-medusas':['scenes',84,14],'escena-fibra':['scenes',98,14],'escena-pulpos':['scenes',112,14]};
var catalog=[
{id:'lluvia',fam:'nat',es:'Lluvia',en:'Rain',des:'Lluvia suave y estable, sin truenos',den:'Soft, steady rain with no thunder'},
{id:'lluvia-ventana',fam:'nat',es:'Lluvia en la ventana',en:'Rain on the window',des:'Gotas y escorrentía sobre el cristal',den:'Drops and runoff on glass'},
{id:'olas',fam:'nat',es:'Olas del mar',en:'Sea waves',des:'Llegada, espuma y retirada del agua',den:'Water arriving, foaming and receding'},
{id:'rio',fam:'nat',es:'Río',en:'Stream',des:'Corriente suave sobre piedras',den:'Gentle current over stones'},
{id:'viento',fam:'nat',es:'Viento suave',en:'Gentle wind',des:'Brisa redonda y estable, sin silbidos',den:'Rounded, steady breeze with no whistling'},
{id:'pajaros',fam:'nat',es:'Pájaros en el bosque',en:'Birds in the forest',des:'Cantos discretos y espaciados',den:'Soft, widely spaced bird calls'},
{id:'grillos',fam:'nat',es:'Grillos de noche',en:'Crickets at night',des:'Noche estable con llamadas suaves',den:'Stable night ambience with soft calls'},
{id:'fuego',fam:'nat',es:'Chimenea',en:'Fireplace',des:'Crepitar bajo y cálido',den:'Low, warm crackle'},
{id:'ruido-rosa',fam:'ruido',es:'Ruido rosa',en:'Pink noise',des:'Sonido uniforme y suave. Puede ayudar o molestar según la persona',den:'Soft, even sound. It can help or bother depending on the person'},
{id:'ruido-marron',fam:'ruido',es:'Ruido marrón',en:'Brown noise',des:'Sonido grave moderado. Puede ayudar o molestar según la persona',den:'Moderately deep sound. It can help or bother depending on the person'},
{id:'piano',fam:'mus',es:'Piano suave',en:'Soft piano',des:'Notas simples, lentas y espaciadas',den:'Simple, slow, widely spaced notes'},
{id:'cuencos',fam:'mus',es:'Cuencos',en:'Singing bowls',des:'Ataque suave y resonancia corta',den:'Soft attack and short resonance'}];
function context(){if(!AC)return null;if(!ctx)ctx=new AC();if(ctx.state==='suspended')ctx.resume().catch(function(){});return ctx;}
function load(name){if(cache[name])return Promise.resolve(cache[name]);if(loading[name])return loading[name];var c=context();if(!c)return Promise.reject(new Error('AUDIO_CONTEXT_UNAVAILABLE'));loading[name]=fetch(SPR[name],{credentials:'same-origin'}).then(function(r){if(!r.ok)throw new Error('AUDIO_ASSET_'+r.status);return r.arrayBuffer();}).then(function(ab){return c.decodeAudioData(ab);}).then(function(buf){cache[name]=buf;delete loading[name];return buf;}).catch(function(e){delete loading[name];window.dispatchEvent(new CustomEvent('ig:r04-audio-error',{detail:{sprite:name,message:String(e&&e.message||e)}}));throw e;});return loading[name];}
function start(id,level,fade){var spec=ITEM[id],c=context();if(!spec||!c)return null;var alive=true,src=null,g=c.createGain(),target=Math.max(0,Math.min(1,level==null?.3:level));g.gain.value=.0001;g.connect(c.destination);var h={out:g,stop:function(sec){if(!alive)return;alive=false;var t=c.currentTime,d=Math.max(.08,sec==null?1.2:sec);g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(Math.max(.0001,g.gain.value),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);setTimeout(function(){try{if(src)src.stop();g.disconnect();}catch(e){}},d*1000+100);},setLevel:function(v){target=Math.max(0,Math.min(1,v));var t=c.currentTime;g.gain.cancelScheduledValues(t);g.gain.setTargetAtTime(Math.max(.0001,target),t,.16);}};load(spec[0]).then(function(buf){if(!alive)return;src=c.createBufferSource();src.buffer=buf;src.loop=true;src.loopStart=spec[1];src.loopEnd=spec[1]+spec[2];src.connect(g);src.start(0,spec[1]);var t=c.currentTime,d=Math.max(.4,fade==null?1.6:fade);g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,target),t+d);}).catch(function(){if(alive){alive=false;try{g.disconnect();}catch(e){}}});return h;}
window.IGSonidos={catalog:catalog,start:start,context:context,supported:!!AC,kind:'RENDERED_FIRST_PARTY_R40_R04',assetManifest:{sprites:SPR,items:ITEM}};
})(window);
