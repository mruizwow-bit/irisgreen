import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createDialogueLibrary} from '../sabik/dialogue-library.mjs';
import {DIALOGUE_DATA} from '../sabik/dialogue-data.mjs';
import {DIALOGUE_AUDIO} from '../sabik/dialogue-audio.mjs';
import {createSabikConversation} from '../sabik/conversation-core-r66.mjs';
import {createSabikConversationalVoice,voiceRequest,speechParts} from '../sabik/voice-runtime.mjs';
import {createVoiceSession,endsVoiceConversation} from '../sabik/voice-session.mjs';
const dialogue=lang=>createDialogueLibrary({model:structuredClone(DIALOGUE_DATA[lang]),variables:DIALOGUE_DATA.variables});
test('bundled dialogue matches the editable declarative library',async()=>{
 for(const lang of ['es','en'])assert.deepEqual(DIALOGUE_DATA[lang],JSON.parse(await fs.readFile(new URL(`../sabik/assets/dialogue-r02/dialogue-model.${lang}.json`,import.meta.url),'utf8')));
});
test('greetings, identity and unsupported utilities never search or return an unrelated fiche',async()=>{
 for(const [locale,queries] of [['es',['hola','¡Hola, Sabik!','Hola, Sabik, ¿cómo estás?','hola, cómo estás','qué puedes hacer','quién eres','qué tiempo hace']],['en',['hello','hello, how are you','who are you','what can you do','what is the weather']]]){
  const d=dialogue(locale),core=createSabikConversation({getDialogue:()=>d,retrieve:()=>{throw new Error('must not search');}});
  for(const query of queries){const result=await core.submitTurn(query,{locale});assert.ok(result.answer);assert.equal(result.sources.length,0);}
 }
});
test('common words cannot turn an unrelated question into a medical answer',async()=>{
 const d=dialogue('es'),core=createSabikConversation({getDialogue:()=>d,retrieve:async()=>({candidates:[{title:'Dentista',snippet:'Puedes pedir una pausa y hablar con el dentista.',url:'/es/neurodiversidad/condiciones/dentista/'}]})});
 const result=await core.submitTurn('capital de Francia',{locale:'es'});assert.equal(result.sources.length,0);assert.doesNotMatch(result.answer,/dentista/i);
});

test('the reported Hola Sabic transcript and name variants answer locally, without retrieval',async()=>{
 for(const locale of ['es','en']){
  const d=dialogue(locale),core=createSabikConversation({getDialogue:()=>d,retrieve:()=>{throw new Error('greetings must not search');}});
  for(const alias of DIALOGUE_DATA[locale].assistant_aliases){
   const query=locale==='es'?`¡Hola, ${alias}!`:`Hello, ${alias}.`;
   assert.equal((await core.submitTurn(query,{locale})).answer,locale==='es'?'Hola. Te escucho.':"Hello. I'm here to help.");
  }
 }
 const d=dialogue('es');assert.equal(d.classify('Hola, Sabic.').intent.id,'social.greeting');
 assert.equal(d.classify('¡Hola, Sabic, cómo estás!').intent.id,'social.greeting');
 assert.notEqual(d.classify('Hola, Sabic, quiero información sobre ruido').action,'respond');
});
test('situation descriptions are attributed, broad one-word queries are not personal claims',async()=>{
 const d=dialogue('es'),rows=[{title:'Me despierta el ruido',snippet:'Me despierta cualquier ruido por la noche.',url:'/es/situaciones/ruido/'},{title:'Ruido en clase',snippet:'El ruido en clase.',url:'/es/situaciones/clase/'}];
 const core=createSabikConversation({getDialogue:()=>d,retrieve:async()=>({candidates:rows})});
 assert.match((await core.submitTurn('ruido')).answer,/He encontrado estas fuentes/);
 assert.match((await core.submitTurn('ruido noche')).answer,/La ficha.*describe esta situación/);
});
test('fixed dialogue audio is the exact generated and verified file',async()=>{
 for(const entry of DIALOGUE_AUDIO){const b=await fs.readFile(new URL('..'+entry.url,import.meta.url));assert.equal(createHash('sha256').update(b).digest('hex'),entry.sha256);}
});
test('hello playback needs no capabilities or synthesis network round trips',async()=>{
 const requests=[];const events=[];
 class Audio{callbacks={};addEventListener(k,v){this.callbacks[k]=v;}play(){this.callbacks.playing?.();queueMicrotask(()=>this.callbacks.ended?.());return Promise.resolve();}pause(){}removeAttribute(){}load(){}}
 const voice=createSabikConversationalVoice({host:{Audio,URL,setTimeout,clearTimeout},onState:s=>events.push(s),fetchImpl:async url=>{requests.push(url);assert.match(url,/dialogue-audio-r03/);return new Response(await fs.readFile(new URL('..'+url,import.meta.url)),{headers:{'content-type':'audio/wav'}});}});
 await voice.setEnabled(true,{playbackOnly:true});assert.equal(requests.length,0);
 assert.equal((await voice.speak('Hola. Te escucho.')).status,'ended');assert.equal(requests.length,1);assert.ok(events.some(s=>s.speaking));
});
test('voice deadline and cancellation bound stalled requests',async()=>{
 const pending=(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true}));
 await assert.rejects(voiceRequest(pending,'/test',{},20),{name:'AbortError'});
 const controller=new AbortController(),request=voiceRequest(pending,'/test',{signal:controller.signal});controller.abort();await assert.rejects(request,{name:'AbortError'});
 assert.ok(speechParts('A long answer '.repeat(30))[0].length<=85);
});

function clock(){
 let now=0,id=0;const timers=new Map();
 return {setTimeout(fn,ms){timers.set(++id,{fn,at:now+ms});return id;},clearTimeout(id){timers.delete(id);},performance:{now:()=>now},
  async advance(ms){const end=now+ms;for(;;){const next=[...timers].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);await next[1].fn();await new Promise(resolve=>setImmediate(resolve));}now=end;}};
}
async function until(check){for(let i=0;i<150;i++){if(check())return;await new Promise(resolve=>setTimeout(resolve,2));}assert.ok(check(),'expected asynchronous voice state');}
function voiceHarness({vad=false,permission}={}){
 const timer=clock(),recorders=[],errors=[],transcripts=[],queue=[],states=[];let requests=0,sttCalls=0,voice,session;
 const track={enabled:true,readyState:'live',stop(){this.readyState='ended';}},stream={getTracks:()=>[track]};
 class Recorder{static isTypeSupported(){return true;}constructor(){this.state='inactive';this.mimeType='audio/webm';recorders.push(this);}start(){this.state='recording';this.onstart?.();}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['fixture'])});this.onstop?.();}}
 class Audio{callbacks={};addEventListener(k,v){this.callbacks[k]=v;}play(){this.callbacks.playing?.();queueMicrotask(()=>this.callbacks.ended?.());return Promise.resolve();}pause(){}removeAttribute(){}load(){}}
 class SilentContext{createMediaStreamSource(){return{connect(){},disconnect(){}};}createAnalyser(){return{fftSize:512,getByteTimeDomainData(data){data.fill(vad==='speech'&&timer.performance.now()<500?138:128);}};}resume(){}close(){}}
 const sha='38fc7fc51c5e776e840414b6fd443962e9411b9654888fd7913e4da643cb857c';
 const capabilities={schema:'iris-green/sabik-voice-runtime/v1',privacy:{no_store:true,persist_audio:false,persist_transcript:false},stt:{self_hosted:true,languages:['es','en']},tts:{es:{self_hosted:true,model_id:'SABIK_ES_MASTER_V1_ICL',model_sha256:sha},en:{self_hosted:true,model_id:'SABIK_EN_MASTER_V2_ICL',model_sha256:sha}}};
 const host={...timer,Audio,URL,MediaRecorder:Recorder,navigator:{mediaDevices:{async getUserMedia(){requests++;return permission?permission:stream;}}},...(vad?{AudioContext:SilentContext}:{})};
 voice=createSabikConversationalVoice({host,fixedVoiceFactory:()=>({setEnabled:async()=>{},cancel(){},setLanguage(){}}),onState:s=>states.push(s),
  onError:code=>{errors.push(code);session.handleError(code);},
  onTranscript:async text=>{transcripts.push(text);if(endsVoiceConversation(text)){session.stop('goodbye');return;}await session.playback(()=>voice.speak('Hola. Te escucho.'));},
  fetchImpl:async url=>{
   if(url.endsWith('/capabilities'))return Response.json(capabilities);
   if(url.endsWith('/transcribe')){sttCalls++;const next=queue.shift();if(next==='ERROR')return Response.json({detail:'STT_BACKEND_ERROR'},{status:503});return Response.json({text:next||'',locale:'es'});}
   return new Response(await fs.readFile(new URL('..'+url,import.meta.url)),{headers:{'content-type':'audio/wav'}});
  }});
 session=createVoiceSession({host,getVoice:()=>voice});
 return {timer,voice,session,track,stream,recorders,errors,transcripts,queue,states,get requests(){return requests;},get sttCalls(){return sttCalls;}};
}

test('one voice activation survives multiple answers, blank STT and an outage until goodbye',async()=>{
 const h=voiceHarness();await h.session.start();assert.equal(h.voice.getState().listening,true);
 for(const text of ['hola','','ERROR','hola otra vez']){
  h.queue.push(text);h.voice.stopListening();
  if(text&&text!=='ERROR')await until(()=>h.states.filter(s=>s.speaking).length>=h.transcripts.length);
  else await until(()=>h.errors.includes(text==='ERROR'?'STT_ERROR':'STT_EMPTY'));
  await until(()=>!h.voice.getState().preparing&&!h.voice.getState().speaking&&!h.voice.getState().transcribing);
  await h.timer.advance(2100);await until(()=>h.voice.getState().listening);
  assert.equal(h.session.active,true);assert.equal(h.requests,1,'reuse the live microphone between turns');
 }
 h.queue.push('adiós Sabik');h.voice.stopListening();await until(()=>!h.session.active);
 assert.equal(h.track.readyState,'ended');await h.timer.advance(60000);assert.equal(h.voice.getState().listening,false);
});

test('a minute of silence keeps the session listening and sends no blank audio to STT',async()=>{
 const h=voiceHarness({vad:true});await h.session.start();await h.timer.advance(65000);
 assert.equal(h.session.active,true);assert.equal(h.voice.getState().listening,true);assert.equal(h.requests,1);assert.equal(h.sttCalls,0);
 assert.ok(h.recorders.length>=5);h.session.stop();assert.equal(h.track.readyState,'ended');
 await h.timer.advance(60000);assert.equal(h.voice.getState().listening,false);
});

test('a short spoken greeting is transcribed after the speech pause instead of the 12 second cap',async()=>{
 const h=voiceHarness({vad:'speech'});h.queue.push('Hola, Sabic.');await h.session.start();
 await h.timer.advance(1400);await until(()=>h.transcripts.length===1);
 assert.equal(h.transcripts[0],'Hola, Sabic.');assert.equal(h.sttCalls,1);h.session.stop();
});

test('stop cancels a pending microphone request and cannot reopen it later',async()=>{
 let grant;const permission=new Promise(resolve=>{grant=resolve;}),h=voiceHarness({permission});
 const starting=h.session.start();await until(()=>h.requests===1);h.session.stop();grant(h.stream);await starting;
 assert.equal(h.track.readyState,'ended');await h.timer.advance(60000);assert.equal(h.session.active,false);assert.equal(h.recorders.length,0);
});

test('repeating a response resumes listening; stopping during playback cancels resumption',async()=>{
 const timer=clock();let listening=false,stops=0,finish;
 const voice={getState:()=>({listening}),async startListening(){listening=true;return{status:'starting'};},cancelListening(){listening=false;},stopAll(){listening=false;stops++;}};
 const session=createVoiceSession({host:timer,getVoice:()=>voice});await session.start();
 await session.playback(async()=>({status:'ended'}));await timer.advance(350);assert.equal(listening,true);
 const playing=session.playback(()=>new Promise(resolve=>{finish=resolve;}));session.stop();finish({status:'cancelled'});await playing;await timer.advance(60000);
 assert.equal(listening,false);assert.equal(stops,1);
 for(const text of ['adiós','hasta luego Sabik','termina la conversación','goodbye','stop listening'])assert.equal(endsVoiceConversation(text),true);
 assert.equal(endsVoiceConversation('qué significa adiós'),false);
});
