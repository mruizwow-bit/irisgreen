import assert from 'node:assert/strict';
import {createSabikConversationalVoice} from '../sabik/voice-runtime.mjs';

let currentRecognition=null;
class FakeRecognition{
  constructor(){currentRecognition=this;this.lang='';this.continuous=false;this.interimResults=false;this.maxAlternatives=1;}
  start(){this.onstart?.();this.onaudiostart?.();}
  stop(){}
  abort(){this.aborted=true;}
  final(text){
    const result=[{transcript:text}];result.isFinal=true;
    this.onresult?.({results:[result],resultIndex:0});
    this.onaudioend?.();this.onend?.();
  }
  deny(){this.onerror?.({error:'not-allowed'});this.onend?.();}
  silence(){this.onaudioend?.();this.onend?.();}
}
class FakeUtterance{
  constructor(text){this.text=text;this.lang='';this.volume=1;this.rate=1;this.voice=null;this.onstart=null;this.onend=null;this.onerror=null;}
}
const synth={
  spoken:[],cancelCount:0,current:null,
  getVoices(){return[{name:'ES',lang:'es-ES'},{name:'EN',lang:'en-GB'}];},
  speak(u){this.spoken.push(u);this.current=u;queueMicrotask(()=>u.onstart?.());},
  cancel(){this.cancelCount++;this.current=null;},
  end(){const u=this.current;this.current=null;u?.onend?.();}
};
const host={SpeechRecognition:FakeRecognition,SpeechSynthesisUtterance:FakeUtterance,speechSynthesis:synth};
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
  initialLanguage:'es',host,fixedVoiceFactory,
  onState:(s,m)=>states.push({s,m}),
  onTranscript:(text,meta)=>transcripts.push({text,meta}),
  onError:(code,meta)=>errors.push({code,meta})
});

assert.deepEqual(voice.capabilities(),{stt:true,tts:true});
assert.equal(voice.getState().recognitionLanguage,'es-ES');
await voice.setEnabled(true);
assert.equal(synth.spoken.length,0,'enabling voice must not autoplay');

voice.startListening();
assert.equal(voice.getState().listening,true);
assert.equal(states.at(-1).m.semantic,'listening');
currentRecognition.final('hola sabik');
await Promise.resolve();
assert.equal(transcripts.at(-1).text,'hola sabik');
assert.equal(transcripts.at(-1).meta.recognitionLanguage,'es-ES');
assert.equal(voice.getState().listening,false);

voice.setVolume(.55);voice.setRate(1.2);
const speaking=voice.speak('respuesta de prueba');
await Promise.resolve();
assert.equal(voice.getState().speaking,true);
assert.equal(synth.spoken.at(-1).lang,'es-ES');
assert.equal(synth.spoken.at(-1).voice.lang,'es-ES');
assert.equal(synth.spoken.at(-1).volume,.55);
assert.equal(synth.spoken.at(-1).rate,1.2);
synth.end();await speaking;
assert.equal(voice.getState().speaking,false);

const beforeRepeat=synth.spoken.length;
const repeating=voice.repeat();await Promise.resolve();
assert.equal(synth.spoken.length,beforeRepeat+1);
assert.equal(synth.spoken.at(-1).text,'respuesta de prueba');
synth.end();await repeating;

voice.setLanguage('en');
assert.equal(voice.getState().recognitionLanguage,'en-GB');
assert.equal(voice.getState().canRepeat,false);
voice.startListening();currentRecognition.final('hello sabik');await Promise.resolve();
assert.equal(transcripts.at(-1).meta.recognitionLanguage,'en-GB');

voice.startListening();currentRecognition.deny();await Promise.resolve();
assert.equal(errors.at(-1).code,'microphone-denied');

voice.startListening();currentRecognition.silence();await Promise.resolve();
assert.equal(errors.at(-1).code,'no-speech');

voice.startListening();
voice.stopAll('test-stop');
assert.equal(voice.getState().listening,false);
assert.equal(currentRecognition.aborted,true);

const noSttHost={SpeechSynthesisUtterance:FakeUtterance,speechSynthesis:synth};
const errors2=[];
const fallback=createSabikConversationalVoice({initialLanguage:'es',host:noSttHost,fixedVoiceFactory,onError:c=>errors2.push(c)});
await fallback.setEnabled(true);
assert.equal(fallback.startListening().status,'unavailable');
assert.equal(errors2.at(-1),'stt-unavailable');

console.log('SABIK_VOICE_RUNTIME_UNIT_PASS');
