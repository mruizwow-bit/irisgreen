import assert from 'node:assert/strict';
import {createSabikVoice,cleanManifest} from '../sabik/audio-r01.mjs';
import fs from 'node:fs';
import crypto from 'node:crypto';

const raw=JSON.parse(fs.readFileSync(new URL('../sabik/assets/audio-r01/manifest.runtime.json',import.meta.url),'utf8'));
const manifest=cleanManifest(raw);
const digest=async text=>crypto.createHash('sha256').update(text).digest('hex');
const COPY=Object.freeze({
 'sabik.welcome':Object.freeze({es:'Puedo ayudarte a buscar información.',en:'I can help you find information.'}),
 'sabik.status.available':Object.freeze({es:'La búsqueda en fuentes está disponible.',en:'Source search is available.'}),
 'sabik.input.empty':Object.freeze({es:'Escribe qué necesitas.',en:'Write what you need.'})
});
let loads=0,players=[];
const manifestLoader=async()=>{loads++;return manifest;};
function fakeAudio(){
 const p={paused:true,src:'',preload:'',currentTime:0,events:{},
  play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;},
  removeAttribute(k){if(k==='src')this.src='';},load(){},addEventListener(t,f){this.events[t]=f;}};
 players.push(p);return p;
}
const voice=createSabikVoice({initialLanguage:'es',manifestLoader,digest,audioFactory:fakeAudio});
assert.deepEqual(voice.getState(),{enabled:false,language:'es',playing:false});
assert.equal(loads,0,'manifest must not load before explicit enable');
assert.equal(players.length,0,'no audio object before explicit enable');
await voice.setEnabled(true);
assert.equal(loads,1);
assert.equal(players.length,0,'enabling alone must not create/request a WAV');
const welcome=raw.entries.find(x=>x.id==='sabik.welcome'&&x.language==='es');
let result=await voice.speak('sabik.welcome',COPY['sabik.welcome'].es);
assert.equal(result.status,'playing');
assert.equal(players.length,1);
assert.equal(players[0].src,welcome.file);
assert.equal(players[0].preload,'none');
result=await voice.speak('sabik.welcome','texto cambiado');
assert.equal(result.status,'text-mismatch');
assert.equal(players.length,1,'text mismatch must not create a player');
assert.equal(players[0].paused,true,'new event cancels old audio first');
result=await voice.speak('sabik.status.available',COPY['sabik.status.available'].es);
assert.equal(result.status,'optional-blocked');
assert.equal(players.length,1,'optional voice must not autoplay');
result=await voice.speak('sabik.status.available',COPY['sabik.status.available'].es,{allowOptional:true});
assert.equal(result.status,'playing');
assert.equal(players.length,2);
voice.setLanguage('en');
assert.equal(voice.getState().language,'en');
assert.equal(players[1].paused,true,'language switch cancels previous audio');
result=await voice.speak('sabik.input.empty',COPY['sabik.input.empty'].en);
assert.equal(result.status,'playing');
assert.equal(players.length,3);
assert.match(players[2].src,/\/en\//);
voice.cancel();
assert.equal(players[2].paused,true);
await voice.setEnabled(false);
assert.equal(voice.getState().enabled,false);
result=await voice.speak('sabik.welcome',COPY['sabik.welcome'].en);
assert.equal(result.status,'disabled');
assert.equal(players.length,3,'disabled voice must not create/request WAV');
console.log('SABIK_AUDIO_R01_MODULE_PASS');
