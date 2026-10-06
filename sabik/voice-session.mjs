// A conversation outlives each recording, transcription and spoken answer.
export function createVoiceSession({getVoice,canListen=()=>true,onChange=()=>{},host=globalThis}={}){
 let active=false,timer=null,generation=0,starting=false;
 const clear=()=>{if(timer!==null)host.clearTimeout(timer);timer=null;};
 function stop(reason='voice-session-stop'){
  active=false;generation++;starting=false;clear();getVoice().stopAll(reason);onChange(false);
 }
 function resume(delay=350){
  clear();if(!active)return;
  const ticket=generation;
  timer=host.setTimeout(()=>{timer=null;void listen(ticket);},delay);
 }
 async function listen(ticket){
   if(!active||ticket!==generation)return;
   const s=getVoice().getState();
   if(starting||!canListen()||s.speaking||s.preparing||s.transcribing){resume(250);return;}
   if(s.listening)return;
   starting=true;
   try{const result=await getVoice().startListening({keepStream:true});if(active&&ticket===generation&&['error','unavailable'].includes(result?.status))resume(2000);}
   catch{if(active&&ticket===generation)resume(2000);}
   finally{if(ticket===generation)starting=false;}
 }
 async function start(){
  if(active)return;
  active=true;generation++;onChange(true);await listen(generation);
 }
 function handleError(code){
  if(!active)return;
  if(['MICROPHONE_DENIED','MICROPHONE_UNAVAILABLE'].includes(code)){stop(code);return;}
  resume(['STT_EMPTY','STT_EMPTY_AUDIO','CAPTURE_SILENCE'].includes(code)?100:2000);
 }
 async function playback(action){
  const ticket=generation;clear();getVoice().cancelListening();
  try{return await action();}
  finally{if(active&&ticket===generation)resume();}
 }
 return Object.freeze({get active(){return active;},start,stop,resume,clear,handleError,playback});
}

export function endsVoiceConversation(text){
 const value=String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z\s]/g,' ').replace(/\bsabik\b/g,'').replace(/\s+/g,' ').trim();
 return /^(?:adios|hasta luego|hasta pronto|termina(?:r)? (?:la )?conversacion|cierra (?:la )?conversacion|fin de (?:la )?conversacion|goodbye|bye|end (?:the )?conversation|stop listening)(?: por favor| please)?$/.test(value);
}
