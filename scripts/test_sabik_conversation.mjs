import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createDialogueLibrary} from '../sabik/dialogue-library.mjs';
import {DIALOGUE_DATA} from '../sabik/dialogue-data.mjs';
import {DIALOGUE_AUDIO} from '../sabik/dialogue-audio.mjs';
import {createSabikConversation} from '../sabik/conversation-core-r66.mjs';
import {createSabikConversationalVoice,voiceRequest,speechParts} from '../sabik/voice-runtime.mjs';
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
