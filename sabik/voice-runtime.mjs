import {createSabikVoice} from './audio-r01.mjs';

const LANG={
 es:{recognition:'es-ES',tts:['es-ES','es'],name:'es'},
 en:{recognition:'en-GB',tts:['en-GB','en-US','en'],name:'en'}
};
const ERROR_CODE=new Set([
 'not-allowed','service-not-allowed','audio-capture','network','no-speech','aborted','language-not-supported'
]);

function language(value){return String(value||'').toLowerCase().startsWith('en')?'en':'es';}
function clamp(value,min,max){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):min;}
function speechRecognitionCtor(host){
 return host?.SpeechRecognition||host?.webkitSpeechRecognition||null;
}
function speechSynthesisApi(host){
 const synth=host?.speechSynthesis;
 const Utterance=host?.SpeechSynthesisUtterance;
 return synth&&typeof synth.speak==='function'&&typeof synth.cancel==='function'&&typeof Utterance==='function'
  ?{synth,Utterance}:null;
}
function normalizedError(event){
 const raw=String(event?.error||event?.name||event?.code||'unknown').toLowerCase();
 return ERROR_CODE.has(raw)?raw:'unknown';
}
function bestVoice(synth,lang){
 const voices=typeof synth.getVoices==='function'?synth.getVoices():[];
 const wanted=LANG[lang].tts.map(v=>v.toLowerCase());
 for(const exact of wanted){
  const found=voices.find(v=>String(v.lang||'').toLowerCase()===exact);
  if(found)return found;
 }
 const prefix=lang==='en'?'en':'es';
 return voices.find(v=>String(v.lang||'').toLowerCase().startsWith(prefix))||null;
}

export function createSabikConversationalVoice({
 initialLanguage='es',
 host=globalThis.window||globalThis,
 onState=()=>{},
 onTranscript=()=>{},
 onError=()=>{},
 fixedVoiceFactory=createSabikVoice
}={}){
 let lang=language(initialLanguage);
 let enabled=false,recognition=null,listening=false,recognitionStarted=false;
 let dynamicSpeaking=false,fixedPlaying=false,lastText='',lastTranscript='';
 let volume=1,rate=1,revision=0,fixedReady=false;
 const Rec=()=>speechRecognitionCtor(host);
 const TTS=()=>speechSynthesisApi(host);
 const fixed=fixedVoiceFactory({
  initialLanguage:lang,
  onState:s=>{
   fixedPlaying=Boolean(s?.playing);
   emit();
  }
 });

 function capabilities(){
  return Object.freeze({stt:Boolean(Rec()),tts:Boolean(TTS())});
 }
 function snapshot(){
  const caps=capabilities();
  return Object.freeze({
   enabled,language:lang,recognitionLanguage:LANG[lang].recognition,
   sttAvailable:caps.stt,ttsAvailable:caps.tts,listening,
   speaking:dynamicSpeaking||fixedPlaying,volume,rate,
   canRepeat:Boolean(lastText),lastTranscript
  });
 }
 function semantic(){
  if(listening)return 'listening';
  if(dynamicSpeaking||fixedPlaying)return 'speaking';
  return 'idle';
 }
 function emit(extra={}){
  const state=snapshot();
  onState(state,{semantic:semantic(),...extra});
  return state;
 }
 function issue(code,detail={}){
  onError(code,{language:lang,...detail});
  emit({semantic:'degraded',error:code});
 }
 function clearRecognition(){
  const current=recognition;
  recognition=null;recognitionStarted=false;listening=false;
  if(current){
   current.onstart=current.onaudiostart=current.onspeechstart=current.onresult=current.onspeechend=current.onaudioend=current.onerror=current.onend=null;
  }
 }
 function stopRecognition({abort=true,emitState=true}={}){
  const current=recognition;
  clearRecognition();
  if(current){
   try{abort&&typeof current.abort==='function'?current.abort():current.stop?.();}catch{}
  }
  if(emitState)emit({reason:'recognition-stop'});
 }
 function cancelDynamic({emitState=true}={}){
  revision+=1;
  const api=TTS();
  if(api){try{api.synth.cancel();}catch{}}
  dynamicSpeaking=false;
  if(emitState)emit({reason:'speech-stop'});
 }
 function cancelSpeech({emitState=true}={}){
  cancelDynamic({emitState:false});
  try{fixed.cancel();}catch{}
  fixedPlaying=false;
  if(emitState)emit({reason:'speech-stop'});
 }
 function stopAll(reason='cancelled'){
  stopRecognition({abort:true,emitState:false});
  cancelSpeech({emitState:false});
  emit({reason});
 }
 async function setEnabled(next){
  enabled=Boolean(next);
  if(!enabled){
   stopAll('voice-disabled');
   try{await fixed.setEnabled(false);}catch{}
   fixedReady=false;
   return snapshot();
  }
  const caps=capabilities();
  try{
   await fixed.setEnabled(true);
   fixedReady=true;
  }catch{
   fixedReady=false;
  }
  if(!caps.stt&&!caps.tts&&!fixedReady){
   enabled=false;
   issue('voice-unavailable');
  }else emit({reason:'voice-enabled'});
  return snapshot();
 }
 function setLanguage(next){
  const value=language(next);
  if(value===lang){emit({reason:'language-same'});return lang;}
  stopAll('language-change');
  lang=value;fixed.setLanguage(lang);lastText='';lastTranscript='';
  emit({reason:'language-change'});
  return lang;
 }
 function setVolume(value){volume=clamp(value,0,1);emit({reason:'volume'});return volume;}
 function setRate(value){rate=clamp(value,.6,1.6);emit({reason:'rate'});return rate;}

 async function speakFixed(id,text,options={}){
  if(!enabled||!fixedReady)return Object.freeze({status:'disabled'});
  cancelDynamic({emitState:false});
  const result=await fixed.speak(id,text,options);
  if(['play-error','missing','text-mismatch'].includes(result.status))issue('fixed-voice-error',{status:result.status});
  return result;
 }
 function speak(text,{remember=true}={}){
  const value=String(text||'').replace(/\s+/g,' ').trim();
  if(!enabled||!value)return Promise.resolve(Object.freeze({status:'disabled'}));
  const api=TTS();
  if(!api){issue('tts-unavailable');return Promise.resolve(Object.freeze({status:'unavailable'}));}
  cancelSpeech({emitState:false});
  if(remember)lastText=value;
  const ticket=++revision;
  return new Promise(resolve=>{
   const utterance=new api.Utterance(value);
   utterance.lang=LANG[lang].recognition;
   utterance.volume=volume;utterance.rate=rate;
   const voice=bestVoice(api.synth,lang);if(voice)utterance.voice=voice;
   let settled=false;
   const finish=(status,error)=>{
    if(settled)return;settled=true;
    if(ticket===revision)dynamicSpeaking=false;
    if(error)issue(error,{status});
    else emit({reason:'speech-'+status});
    resolve(Object.freeze({status,language:lang,voice:voice?.name||null}));
   };
   utterance.onstart=()=>{
    if(ticket!==revision){try{api.synth.cancel();}catch{}return;}
    dynamicSpeaking=true;emit({semantic:'speaking',reason:'speech-start'});
   };
   utterance.onend=()=>finish('ended');
   utterance.onerror=event=>{
    const code=String(event?.error||'speech-error').toLowerCase();
    if(['canceled','interrupted'].includes(code))finish('cancelled');
    else finish('error','tts-error');
   };
   try{api.synth.speak(utterance);}
   catch{finish('error','tts-error');}
  });
 }
 function repeat(){return lastText?speak(lastText,{remember:false}):Promise.resolve(Object.freeze({status:'empty'}));}

 function startListening(){
  if(!enabled)return Object.freeze({status:'disabled'});
  const Ctor=Rec();
  if(!Ctor){issue('stt-unavailable');return Object.freeze({status:'unavailable'});}
  cancelSpeech({emitState:false});
  stopRecognition({abort:true,emitState:false});
  const ticket=++revision,current=new Ctor();recognition=current;
  let transcript='',audioActive=false;
  current.lang=LANG[lang].recognition;
  current.continuous=false;current.interimResults=false;current.maxAlternatives=1;
  current.onstart=()=>{recognitionStarted=true;emit({reason:'recognition-start'});};
  current.onaudiostart=()=>{
   if(ticket!==revision||recognition!==current)return;
   audioActive=true;listening=true;emit({semantic:'listening',reason:'audio-start'});
  };
  current.onspeechstart=()=>{
   if(ticket!==revision||recognition!==current)return;
   if(!audioActive){audioActive=true;listening=true;emit({semantic:'listening',reason:'speech-start'});}
  };
  current.onresult=event=>{
   if(ticket!==revision||recognition!==current)return;
   const result=event?.results?.[event.resultIndex??0]||event?.results?.[0];
   const item=result?.[0];
   if(item&&result?.isFinal!==false)transcript=String(item.transcript||'').trim();
  };
  current.onspeechend=()=>{try{current.stop?.();}catch{}};
  current.onaudioend=()=>{
   if(ticket!==revision||recognition!==current)return;
   listening=false;
  };
  current.onerror=event=>{
   if(ticket!==revision||recognition!==current)return;
   const code=normalizedError(event);
   listening=false;
   if(code==='aborted'){emit({reason:'recognition-aborted'});return;}
   issue(code==='not-allowed'||code==='service-not-allowed'?'microphone-denied':code);
  };
  current.onend=()=>{
   if(ticket!==revision||recognition!==current)return;
   clearRecognition();
   if(transcript){
    lastTranscript=transcript;
    Promise.resolve(onTranscript(transcript,{language:lang,recognitionLanguage:LANG[lang].recognition})).catch(()=>issue('transcript-handler-error'));
   }else if(audioActive){
    issue('no-speech');
   }else emit({reason:'recognition-end'});
  };
  try{current.start();}
  catch{clearRecognition();issue('stt-start-error');return Object.freeze({status:'error'});}
  return Object.freeze({status:'starting',language:LANG[lang].recognition});
 }

 emit({reason:'init'});
 return Object.freeze({
  setEnabled,setLanguage,setVolume,setRate,startListening,
  cancelListening:()=>stopRecognition({abort:true,emitState:true}),
  speak,speakFixed,repeat,cancelSpeech,stopAll,
  getState:snapshot,capabilities
 });
}
