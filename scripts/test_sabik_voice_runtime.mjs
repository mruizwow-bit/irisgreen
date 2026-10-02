import assert from 'node:assert/strict';
import {createSabikConversationalVoice} from '../sabik/voice-runtime.mjs';

const CAPABILITIES={
  schema:'iris-green/sabik-voice-runtime/v1',
  privacy:{no_store:true,persist_audio:false,persist_transcript:false},
  stt:{self_hosted:true,languages:['es','en'],engine:'contract-stub'},
  tts:{
    es:{self_hosted:true,model_id:'SABIK_ES_R01_FINAL',model_sha256:'8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291'},
    en:{self_hosted:true,model_id:'SABIK_EN_R02_FINAL',model_sha256:'3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df'}
  }
};
const ticks=async(n=12)=>{for(let i=0;i<n;i++)await Promise.resolve();};

let transcriptLocale='es',lastAudio=null;
const calls={capabilities:0,transcribe:[],synthesize:[]};

async function fetchMock(url,options={}){
  const u=String(url);
  if(u.endsWith('/capabilities')){
    calls.capabilities++;
    return new Response(JSON.stringify(CAPABILITIES),{status:200,headers:{'content-type':'application/json'}});
  }
  if(u.endsWith('/transcribe')){
    calls.transcribe.push({url:u,body:options.body});
    return new Response(JSON.stringify({text:transcriptLocale==='en'?'hello sabik':'hola sabik',locale:transcriptLocale,engine:'contract-stub',model:'stt-contract'}),{status:200,headers:{'content-type':'application/json'}});
  }
  if(u.endsWith('/synthesize')){
    const body=JSON.parse(options.body);
    calls.synthesize.push(body);
    return new Response(new Uint8Array([82,73,70,70,4,0,0,0,87,65,86,69]),{status:200,headers:{'content-type':'audio/wav'}});
  }
  throw new Error('unexpected fetch '+u);
}

class FakeTrack{stop(){this.stopped=true;}}
class FakeRecorder{
  static isTypeSupported(){return true;}
  constructor(stream,options={}){this.stream=stream;this.mimeType=options.mimeType||'audio/webm';this.state='inactive';}
  start(){this.state='recording';queueMicrotask(()=>this.onstart?.());}
  stop(){
    if(this.state==='inactive')return;
    this.state='inactive';
    queueMicrotask(()=>{
      this.ondataavailable?.({data:new Blob([new Uint8Array([1,2,3,4])],{type:this.mimeType})});
      this.onstop?.();
    });
  }
}
class FakeAudio{
  constructor(){this.paused=true;this.src='';this.preload='';this.volume=1;this.playbackRate=1;this.events=new Map();lastAudio=this;}
  addEventListener(type,fn){this.events.set(type,fn);}
  removeAttribute(name){if(name==='src')this.src='';}
  load(){}
  pause(){this.paused=true;}
  play(){this.paused=false;queueMicrotask(()=>this.events.get('playing')?.());return Promise.resolve();}
  emit(type){this.events.get(type)?.();}
}
const host={
  setTimeout,clearTimeout,
  MediaRecorder:FakeRecorder,
  Audio:FakeAudio,
  URL:{createObjectURL:()=> 'blob:sabik-contract',revokeObjectURL:()=>{}},
  navigator:{mediaDevices:{getUserMedia:async()=>({getTracks:()=>[new FakeTrack()]})}}
};
const fixedVoiceFactory=({initialLanguage,onState})=>{
  let enabled=false,lang=initialLanguage;
  const state=()=>({enabled,language:lang,playing:false});
  onState(state());
  return{
    async setEnabled(v){enabled=Boolean(v);onState(state());return state();},
    setLanguage(v){lang=v;onState(state());return lang;},
    async speak(){return{status:'disabled'};},
    cancel(){onState(state());},
    getState:state
  };
};

const states=[],transcripts=[],errors=[];
const voice=createSabikConversationalVoice({
  initialLanguage:'es',host,endpointBase:'https://voice.invalid/sabik-voice',fetchImpl:fetchMock,fixedVoiceFactory,
  onState:(s,m)=>states.push({s,m}),
  onTranscript:(text,meta)=>transcripts.push({text,meta}),
  onError:(code,meta)=>errors.push({code,meta})
});

const caps=await voice.capabilities();
assert.equal(caps.tts.es.model_id,'SABIK_ES_R01_FINAL');
assert.equal(caps.tts.en.model_id,'SABIK_EN_R02_FINAL');
assert.equal(caps.tts.es.model_sha256,CAPABILITIES.tts.es.model_sha256);
assert.equal(caps.tts.en.model_sha256,CAPABILITIES.tts.en.model_sha256);
assert.equal(calls.capabilities,1);

await voice.setEnabled(true);
assert.equal(voice.getState().enabled,true);
assert.equal(voice.getState().sttAvailable,true);
assert.equal(voice.getState().ttsAvailable,true);

await voice.startListening();await ticks();
assert.equal(voice.getState().listening,true);
assert.equal(states.at(-1).m.semantic,'listening');
voice.stopListening();
for(let i=0;i<30&&transcripts.length===0;i++)await ticks();
assert.equal(transcripts.at(-1).text,'hola sabik');
assert.equal(transcripts.at(-1).meta.language,'es');
assert.equal(calls.transcribe.length,1);

const esSpeaking=voice.speak('respuesta en español');await ticks();
assert.equal(voice.getState().speaking,true);
assert.equal(calls.synthesize.at(-1).locale,'es');
assert.equal(calls.synthesize.at(-1).model_id,'SABIK_ES_R01_FINAL');
lastAudio.emit('ended');
assert.equal((await esSpeaking).status,'ended');
assert.equal(voice.getState().speaking,false);

voice.setLanguage('en');transcriptLocale='en';
await voice.startListening();await ticks();voice.stopListening();
for(let i=0;i<30&&transcripts.length<2;i++)await ticks();
assert.equal(transcripts.at(-1).text,'hello sabik');
assert.equal(transcripts.at(-1).meta.language,'en');

const enSpeaking=voice.speak('english response');await ticks();
assert.equal(calls.synthesize.at(-1).locale,'en');
assert.equal(calls.synthesize.at(-1).model_id,'SABIK_EN_R02_FINAL');
assert.equal(voice.getState().speaking,true);
lastAudio.emit('ended');await enSpeaking;

const before=calls.synthesize.length;
const repeat=voice.repeat();await ticks();
assert.equal(calls.synthesize.length,before+1);
assert.equal(calls.synthesize.at(-1).text,'english response');
lastAudio.emit('ended');await repeat;

voice.stopAll('test-stop');
assert.equal(voice.getState().listening,false);
assert.equal(voice.getState().speaking,false);

const badCaps=structuredClone(CAPABILITIES);
badCaps.tts.en.model_sha256='0'.repeat(64);
const identityErrors=[];
const badVoice=createSabikConversationalVoice({
  initialLanguage:'en',host,endpointBase:'https://voice.invalid/sabik-voice',
  fetchImpl:async()=>new Response(JSON.stringify(badCaps),{status:200,headers:{'content-type':'application/json'}}),
  fixedVoiceFactory,onError:c=>identityErrors.push(c)
});
const badState=await badVoice.setEnabled(true);
assert.equal(badState.enabled,false);
assert.equal(identityErrors.at(-1),'VOICE_SERVICE_IDENTITY_MISMATCH_EN');

assert.equal(errors.length,0,JSON.stringify(errors));
console.log(JSON.stringify({
  gate:'SABIK_VOICE_CLIENT_SERVICE_CONTRACT_UNIT_PASS',
  speechSynthesis:false,
  es_model:'SABIK_ES_R01_FINAL',
  en_model:'SABIK_EN_R02_FINAL',
  stt_languages:['es','en'],
  identity_fail_closed:true
}));
