import {createSabikVoice} from './audio-r01.mjs';

const MODEL={
 es:{locale:'es',ttsLanguage:'Spanish',ttsId:'SABIK_ES_MASTER_V1_ICL',ttsSha:'38fc7fc51c5e776e840414b6fd443962e9411b9654888fd7913e4da643cb857c'},
 en:{locale:'en',ttsLanguage:'English',ttsId:'SABIK_EN_MASTER_V2_ICL',ttsSha:'38fc7fc51c5e776e840414b6fd443962e9411b9654888fd7913e4da643cb857c'}
};
const MAX_CAPTURE_MS=12000;

function language(value){return String(value||'').toLowerCase().startsWith('en')?'en':'es';}
function clamp(value,min,max){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):min;}
function cleanText(value){return String(value||'').replace(/\s+/g,' ').trim();}
function failure(code,cause){const e=new Error(code);e.code=code;if(cause)e.cause=cause;return e;}
function endpoint(base,path){return String(base||'/sabik-voice').replace(/\/$/,'')+path;}
function chooseMime(host){
 const MR=host?.MediaRecorder;
 if(!MR)return '';
 for(const type of ['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus']){
  try{if(typeof MR.isTypeSupported!=='function'||MR.isTypeSupported(type))return type;}catch{}
 }
 return '';
}
async function jsonNoStore(response){
 if(!response?.ok)throw failure('VOICE_SERVICE_HTTP_'+String(response?.status||0));
 if(!/^application\/json(?:;|$)/i.test(response.headers?.get?.('content-type')||''))throw failure('VOICE_SERVICE_BAD_JSON');
 return response.json();
}
function assertCapabilities(raw){
 if(!raw||raw.schema!=='iris-green/sabik-voice-runtime/v1')throw failure('VOICE_SERVICE_BAD_CAPABILITIES');
 if(raw.privacy?.no_store!==true||raw.privacy?.persist_audio!==false||raw.privacy?.persist_transcript!==false)throw failure('VOICE_SERVICE_PRIVACY_MISMATCH');
 if(!raw.stt||raw.stt.self_hosted!==true||!Array.isArray(raw.stt.languages)||!raw.stt.languages.includes('es')||!raw.stt.languages.includes('en'))throw failure('VOICE_SERVICE_STT_MISMATCH');
 for(const lang of ['es','en']){
  const expected=MODEL[lang],actual=raw.tts?.[lang];
  if(!actual||actual.self_hosted!==true||actual.model_id!==expected.ttsId||actual.model_sha256!==expected.ttsSha)throw failure('VOICE_SERVICE_IDENTITY_MISMATCH_'+lang.toUpperCase());
 }
 return Object.freeze(raw);
}

export function createSabikConversationalVoice({
 initialLanguage='es',
 host=globalThis.window||globalThis,
 endpointBase='/sabik-voice',
 fetchImpl=globalThis.fetch?.bind(globalThis),
 fixedVoiceFactory=createSabikVoice,
 onState=()=>{},
 onTranscript=()=>{},
 onError=()=>{},
 onEnergy=()=>{}
}={}){
 if(typeof fetchImpl!=='function')throw new TypeError('SABIK_VOICE_FETCH_REQUIRED');
 let lang=language(initialLanguage),enabled=false,capability=null,capabilityPromise=null;
 let stream=null,recorder=null,chunks=[],captureTimer=0,vadTimer=0,vadContext=null,vadSource=null,vadAnalyser=null,sttController=null,ttsController=null,audio=null,audioUrl='';
 let playbackContext=null,playbackGain=null,playbackAnalyser=null,playbackSource=null,energyFrame=0,energyData=null,energySmoothed=0;
 let listening=false,transcribing=false,speaking=false,lastText='',lastTranscript='',volume=1,rate=1,serial=0;
 let fixedPlaying=false,fixedReady=false;

 const fixed=fixedVoiceFactory({
  initialLanguage:lang,
  onState:s=>{fixedPlaying=Boolean(s?.playing);emit({reason:'fixed-state'});}
 });

 function state(){
  return Object.freeze({
   enabled,language:lang,listening,transcribing,speaking:speaking||fixedPlaying,
   serviceReady:Boolean(capability),serviceStatus:capability?'ready':capabilityPromise?'checking':'unknown',
   sttAvailable:Boolean(capability?.stt),ttsAvailable:Boolean(capability?.tts?.[lang]),
   volume,rate,canRepeat:Boolean(lastText),lastTranscript
  });
 }
 function semantic(){
  if(listening)return'listening';
  if(transcribing)return'processing';
  if(speaking||fixedPlaying)return'speaking';
  return'idle';
 }
 function emit(meta={}){const s=state();onState(s,{semantic:semantic(),...meta});return s;}
 function issue(code,detail={}){onError(code,{language:lang,...detail});emit({semantic:'degraded',error:code});}
 function clearTimer(){if(captureTimer){host.clearTimeout?.(captureTimer);captureTimer=0;}}
 function clearVad(){
  if(vadTimer){host.clearTimeout?.(vadTimer);vadTimer=0;}
  try{vadSource?.disconnect?.();}catch{}vadSource=null;vadAnalyser=null;
  if(vadContext){try{void vadContext.close?.();}catch{}vadContext=null;}
 }
 function closeStream(){clearVad();if(stream){for(const track of stream.getTracks?.()||[]){try{track.stop();}catch{}}stream=null;}}
 function startVad(current,ticket){
  const AC=host.AudioContext||host.webkitAudioContext;if(typeof AC!=='function'||!stream)return;
  try{
   const ctx=new AC();vadContext=ctx;vadSource=ctx.createMediaStreamSource(stream);vadAnalyser=ctx.createAnalyser();vadAnalyser.fftSize=512;vadAnalyser.smoothingTimeConstant=.15;vadSource.connect(vadAnalyser);void ctx.resume?.();
   const data=new Uint8Array(vadAnalyser.fftSize),started=(host.performance?.now?.()??Date.now());let heard=false,lastVoice=started;
   const tick=()=>{
    if(ticket!==serial||recorder!==current||!listening)return clearVad();
    vadAnalyser.getByteTimeDomainData(data);let sum=0;
    for(const n of data){const x=(n-128)/128;sum+=x*x;}
    const rms=Math.sqrt(sum/data.length),now=(host.performance?.now?.()??Date.now());
    if(rms>.018){heard=true;lastVoice=now;}
    if(heard&&now-lastVoice>1100&&now-started>700){stopListening();return;}
    vadTimer=host.setTimeout?.(tick,100)||0;
   };
   vadTimer=host.setTimeout?.(tick,120)||0;
  }catch{clearVad();}
 }
 function revoke(){if(audioUrl){try{host.URL?.revokeObjectURL?.(audioUrl);}catch{}audioUrl='';}}
 function stopEnergy(){
  if(energyFrame){try{host.cancelAnimationFrame?.(energyFrame);}catch{}energyFrame=0;}
  energySmoothed=0;
  try{onEnergy(0,{active:false});}catch{}
 }
 function startEnergy(){
  if(!playbackAnalyser)return;
  stopEnergy();
  energyData=new Uint8Array(playbackAnalyser.fftSize);
  try{onEnergy(0,{active:true});}catch{}
  const raf=host.requestAnimationFrame?.bind(host);
  const later=fn=>raf?raf(fn):(host.setTimeout?.(fn,33)||0);
  const tick=()=>{
   if(!speaking||!playbackAnalyser)return stopEnergy();
   playbackAnalyser.getByteTimeDomainData(energyData);
   let sum=0;
   for(const n of energyData){const x=(n-128)/128;sum+=x*x;}
   const rms=Math.sqrt(sum/energyData.length);
   const normalized=clamp((rms-.008)/.16,0,1);
   energySmoothed=energySmoothed*.7+normalized*.3;
   try{onEnergy(energySmoothed,{active:true,rms});}catch{}
   energyFrame=later(tick);
  };
  energyFrame=later(tick);
 }
 function ensurePlaybackUnlocked(){
  const AC=host.AudioContext||host.webkitAudioContext;
  if(typeof AC!=='function')return false;
  try{
   if(!playbackContext){
    playbackContext=new AC();
    playbackGain=playbackContext.createGain();playbackGain.gain.value=volume;
    playbackAnalyser=playbackContext.createAnalyser();playbackAnalyser.fftSize=512;playbackAnalyser.smoothingTimeConstant=.65;
    playbackAnalyser.connect(playbackGain);playbackGain.connect(playbackContext.destination);
   }
   if(playbackContext.state==='suspended')void playbackContext.resume();
   return true;
  }catch{return false;}
 }

 async function capabilities({force=false}={}){
  if(capability&&!force)return capability;
  if(capabilityPromise&&!force)return capabilityPromise;
  capabilityPromise=(async()=>{
   const controller=new AbortController(),id=host.setTimeout?.(()=>controller.abort('timeout'),5000);
   try{
    const response=await fetchImpl(endpoint(endpointBase,'/capabilities'),{method:'GET',cache:'no-store',credentials:'same-origin',signal:controller.signal,headers:{Accept:'application/json'}});
    const data=assertCapabilities(await jsonNoStore(response));capability=data;return data;
   }catch(error){capability=null;throw failure(error?.code||'VOICE_SERVICE_UNAVAILABLE',error);}
   finally{if(id)host.clearTimeout?.(id);capabilityPromise=null;emit({reason:'capabilities'});}
  })();
  return capabilityPromise;
 }

 function stopRecorder({discard=true}={}){
  clearTimer();
  if(recorder){
   const current=recorder;recorder=null;
   try{
    current.onstart=current.ondataavailable=current.onerror=current.onstop=null;
    if(current.state&&current.state!=='inactive')current.stop();
   }catch{}
  }
  closeStream();
  if(discard)chunks=[];
  listening=false;
 }
 function cancelStt(){
  if(sttController){try{sttController.abort('cancelled');}catch{}sttController=null;}
  transcribing=false;
 }
 function cancelDynamic({emitState=true}={}){
  serial+=1;
  if(ttsController){try{ttsController.abort('cancelled');}catch{}ttsController=null;}
  if(playbackSource){try{playbackSource.stop();}catch{}playbackSource=null;}
  if(audio){
   try{audio.pause();audio.removeAttribute?.('src');audio.load?.();}catch{}
   audio=null;
  }
  revoke();speaking=false;stopEnergy();
  if(emitState)emit({reason:'speech-stop'});
 }
 function cancelSpeech({emitState=true}={}){
  cancelDynamic({emitState:false});
  try{fixed.cancel();}catch{}fixedPlaying=false;
  if(emitState)emit({reason:'speech-stop'});
 }
 function stopAll(reason='cancelled'){
  serial+=1;stopRecorder({discard:true});cancelStt();cancelSpeech({emitState:false});emit({reason});
 }

 async function setEnabled(next){
  const value=Boolean(next);
  if(!value){
   enabled=false;stopAll('voice-disabled');
   try{await fixed.setEnabled(false);}catch{}fixedReady=false;
   return state();
  }
  try{
   await capabilities();
   try{await fixed.setEnabled(true);fixedReady=true;}catch{fixedReady=false;}
   enabled=true;emit({reason:'voice-enabled'});return state();
  }catch(error){
   enabled=false;issue(error?.code||'VOICE_SERVICE_UNAVAILABLE');return state();
  }
 }
 function setLanguage(next){
  const value=language(next);if(value===lang){emit({reason:'language-same'});return lang;}
  stopAll('language-change');lang=value;lastText='';lastTranscript='';fixed.setLanguage(lang);emit({reason:'language-change'});return lang;
 }
 function setVolume(value){volume=clamp(value,0,1);if(audio)audio.volume=volume;if(playbackGain)playbackGain.gain.value=volume;emit({reason:'volume'});return volume;}
 function setRate(value){rate=clamp(value,.6,1.6);if(audio)audio.playbackRate=rate;if(playbackSource)playbackSource.playbackRate.value=rate;emit({reason:'rate'});return rate;}

 async function speakFixed(id,text,options={}){
  if(!enabled||!fixedReady)return Object.freeze({status:'disabled'});
  cancelDynamic({emitState:false});
  const result=await fixed.speak(id,text,options);
  if(['play-error','missing','text-mismatch'].includes(result.status))issue('fixed-voice-error',{status:result.status});
  return result;
 }

 async function transcribe(blob,ticket){
  transcribing=true;emit({semantic:'processing',reason:'stt-start'});
  const controller=new AbortController();sttController=controller;
  try{
   const form=new FormData();form.append('audio',blob,'turn.'+(blob.type.includes('ogg')?'ogg':'webm'));form.append('locale',lang);
   const response=await fetchImpl(endpoint(endpointBase,'/transcribe'),{
    method:'POST',body:form,cache:'no-store',credentials:'same-origin',signal:controller.signal,headers:{Accept:'application/json'}
   });
   const data=await jsonNoStore(response);
   if(ticket!==serial||controller.signal.aborted)return;
   const text=cleanText(data?.text);
   if(!text)throw failure('STT_EMPTY');
   if(language(data?.locale)!==lang)throw failure('STT_LANGUAGE_MISMATCH');
   lastTranscript=text;transcribing=false;sttController=null;emit({semantic:'processing',reason:'stt-complete'});
   await onTranscript(text,{language:lang,engine:data?.engine||'',model:data?.model||''});
  }catch(error){
   if(ticket!==serial||controller.signal.aborted)return;
   transcribing=false;sttController=null;
   issue(error?.code||'STT_ERROR');
  }
 }

 async function startListening(){
  ensurePlaybackUnlocked();
  if(!enabled){
   const s=await setEnabled(true);if(!s.enabled)return Object.freeze({status:'unavailable'});
  }
  if(!capability?.stt){issue('STT_UNAVAILABLE');return Object.freeze({status:'unavailable'});}
  if(!host?.navigator?.mediaDevices?.getUserMedia||!host?.MediaRecorder){issue('MICROPHONE_UNAVAILABLE');return Object.freeze({status:'unavailable'});}
  stopRecorder({discard:true});cancelStt();cancelSpeech({emitState:false});
  const ticket=++serial;
  try{
   stream=await host.navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
   if(ticket!==serial){closeStream();return Object.freeze({status:'stale'});}
   const mime=chooseMime(host),MR=host.MediaRecorder;
   recorder=mime?new MR(stream,{mimeType:mime}):new MR(stream);chunks=[];
   const current=recorder;
   current.ondataavailable=event=>{if(ticket===serial&&event.data?.size)chunks.push(event.data);};
   current.onerror=()=>{if(ticket===serial){stopRecorder({discard:true});issue('MICROPHONE_ERROR');}};
    current.onstart=()=>{if(ticket===serial){listening=true;emit({semantic:'listening',reason:'capture-start'});startVad(current,ticket);}};
   current.onstop=()=>{
    if(ticket!==serial)return;
    const type=current.mimeType||mime||'audio/webm',blob=new Blob(chunks,{type});chunks=[];closeStream();listening=false;
    if(!blob.size){issue('STT_EMPTY_AUDIO');return;}
    void transcribe(blob,ticket);
   };
   current.start(250);
   captureTimer=host.setTimeout?.(()=>{if(ticket===serial)stopListening();},MAX_CAPTURE_MS)||0;
   return Object.freeze({status:'starting'});
  }catch(error){
   closeStream();stopRecorder({discard:true});
   const name=String(error?.name||'');
   issue(name==='NotAllowedError'||name==='SecurityError'?'MICROPHONE_DENIED':'MICROPHONE_ERROR');
   return Object.freeze({status:'error'});
  }
 }
 function stopListening(){
  clearTimer();
  if(!recorder)return Object.freeze({status:'idle'});
  const current=recorder;recorder=null;listening=false;emit({semantic:'processing',reason:'capture-stop'});
  try{if(current.state!=='inactive')current.stop();else current.onstop?.();}catch{closeStream();chunks=[];issue('MICROPHONE_ERROR');}
  return Object.freeze({status:'transcribing'});
 }
 function cancelListening(){serial+=1;stopRecorder({discard:true});cancelStt();emit({reason:'capture-cancel'});}

 async function speak(text,{remember=true}={}){
  const value=cleanText(text);if(!enabled||!value)return Object.freeze({status:'disabled'});
  try{await capabilities();}catch(error){issue(error?.code||'VOICE_SERVICE_UNAVAILABLE');return Object.freeze({status:'unavailable'});}
  cancelSpeech({emitState:false});
  if(remember)lastText=value;
  const pieces=value.split(/(?<=[.!?])\s+/).map(cleanText).filter(Boolean),parts=[];
  for(const piece of pieces){
   if(piece.length<=180){parts.push(piece);continue;}
   const words=piece.split(/\s+/);let current='';
   for(const word of words){
    const next=(current+' '+word).trim();
    if(current&&next.length>180){parts.push(current);current=word;}else current=next;
   }
   if(current)parts.push(current);
  }
  if(!parts.length)parts.push(value);
  const ticket=++serial,controller=new AbortController();ttsController=controller;
  try{
   for(let index=0;index<parts.length;index++){
    if(ticket!==serial||controller.signal.aborted)return Object.freeze({status:'cancelled'});
    const response=await fetchImpl(endpoint(endpointBase,'/synthesize'),{
     method:'POST',cache:'no-store',credentials:'same-origin',signal:controller.signal,
     headers:{'Content-Type':'application/json',Accept:'audio/wav'},
     body:JSON.stringify({text:parts[index],locale:lang,model_id:MODEL[lang].ttsId})
    });
    if(!response.ok)throw failure('TTS_HTTP_'+response.status);
    if(!/^audio\/(?:wav|x-wav|wave)(?:;|$)/i.test(response.headers?.get?.('content-type')||''))throw failure('TTS_BAD_MEDIA');
    const blob=await response.blob();if(ticket!==serial||controller.signal.aborted)return Object.freeze({status:'cancelled'});
    let result;
    if(ensurePlaybackUnlocked()&&playbackContext&&playbackGain){
     try{
      const bytes=await blob.arrayBuffer();
      const buffer=await playbackContext.decodeAudioData(bytes.slice(0));
      if(ticket!==serial||controller.signal.aborted)return Object.freeze({status:'cancelled'});
      result=await new Promise(resolve=>{
       let settled=false;
       const source=playbackContext.createBufferSource();playbackSource=source;source.buffer=buffer;source.playbackRate.value=rate;source.connect(playbackAnalyser||playbackGain);
       const finish=status=>{if(settled)return;settled=true;if(playbackSource===source)playbackSource=null;try{source.disconnect();}catch{}speaking=false;stopEnergy();emit({reason:'speech-'+status,part:index+1,parts:parts.length});resolve(status);};
       source.onended=()=>finish('ended');
       try{speaking=true;emit({semantic:'speaking',reason:'audio-context-playing',part:index+1,parts:parts.length});startEnergy();source.start(0);}catch{finish('play-error');}
      });
     }catch{result='play-error';}
    }else{
     const AudioCtor=host.Audio;if(typeof AudioCtor!=='function')throw failure('AUDIO_PLAYBACK_UNAVAILABLE');
     audioUrl=host.URL.createObjectURL(blob);const player=new AudioCtor();audio=player;player.preload='none';player.src=audioUrl;player.volume=volume;player.playbackRate=rate;
     result=await new Promise(resolve=>{
      let settled=false;
      const finish=status=>{if(settled)return;settled=true;if(audio===player)audio=null;revoke();speaking=false;stopEnergy();emit({reason:'speech-'+status,part:index+1,parts:parts.length});resolve(status);};
      player.addEventListener?.('playing',()=>{if(ticket!==serial){try{player.pause();}catch{}return;}speaking=true;emit({semantic:'speaking',reason:'audio-playing',part:index+1,parts:parts.length});},{once:true});
      player.addEventListener?.('ended',()=>finish('ended'),{once:true});
      player.addEventListener?.('error',()=>finish('play-error'),{once:true});
      Promise.resolve(player.play()).catch(()=>finish('play-error'));
     });
    }
    if(result!=='ended'){if(result==='play-error')issue('TTS_PLAYBACK_ERROR');return Object.freeze({status:result,language:lang,model_id:MODEL[lang].ttsId});}
   }
   return Object.freeze({status:'ended',language:lang,model_id:MODEL[lang].ttsId,parts:parts.length});
  }catch(error){
   if(ticket!==serial||controller.signal.aborted)return Object.freeze({status:'cancelled'});
   ttsController=null;issue(error?.code||'TTS_ERROR');return Object.freeze({status:'error'});
  }finally{if(ticket===serial)ttsController=null;}
 }
 function repeat(){return lastText?speak(lastText,{remember:false}):Promise.resolve(Object.freeze({status:'empty'}));}

 emit({reason:'init'});
 return Object.freeze({
  setEnabled,setLanguage,setVolume,setRate,startListening,stopListening,cancelListening,
  speak,speakFixed,repeat,cancelSpeech,stopAll,capabilities,getState:state
 });
}