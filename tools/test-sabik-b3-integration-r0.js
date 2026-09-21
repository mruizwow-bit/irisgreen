const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const I=require(path.join(root,'sabik','b3-integration.js'));
const V=require(path.join(root,'sabik','voice-ui-adapter.js'));
const C=require(path.join(root,'sabik','cognitive-preferences.js'));

assert.deepEqual(I.STATES,['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR']);
assert.deepEqual(I.PRESENCES,['web','ia','educa']);
assert.equal(I.project({operation:'paused',interaction:'pausa'}),'PAUSA');
assert.equal(I.project({operation:'awaiting_clarification',interaction:'correccion'}),'ORIENTAR');
for(const op of ['ready','retrieving','composing','presenting','error'])assert.equal(I.project({operation:op}),'PRESENTE',op);
for(const p of I.PRESENCES)for(const s of I.STATES)assert.match(I.asset(p,s),/^\/sabik\/assets\/b3\/(web|ia|educa)_(presente|orientar|transicion|pausa|confirmar)\.png$/);

const nullAdapter=new V.NullVoiceAdapter();
assert.equal(nullAdapter.capabilities().available,false);
const vc=V.createController(nullAdapter);
assert.equal(vc.snapshot().prefs.enabled,false);
assert.equal(vc.setEnabled(true).prefs.enabled,false);
assert.equal(vc.setVolume(2).prefs.volume,1);
assert.equal(vc.setRate(.1).prefs.rate,.75);

assert.deepEqual(C.normalize({motion:'SIN_MOVIMIENTO',density:'paso_a_paso'}),{motion:'SIN_MOVIMIENTO',density:'paso_a_paso'});
assert.deepEqual(C.normalize({motion:'x',density:'x'}),{motion:'AUTO',density:'completa'});

const voiceSource=fs.readFileSync(path.join(root,'sabik','voice-ui-adapter.js'),'utf8');
for(const forbidden of [/ElevenLabs/i,/speechSynthesis/,/SpeechSynthesisUtterance/,/getUserMedia/,/MediaRecorder/,/https?:\/\//])assert.doesNotMatch(voiceSource,forbidden);
const intSource=fs.readFileSync(path.join(root,'sabik','b3-integration.js'),'utf8');
assert.doesNotMatch(intSource,/BUSCANDO|COMPONIENDO|HABLANDO|RIESGO|LOADING/);
const html=fs.readFileSync(path.join(root,'es','nea','index.html'),'utf8');
for(const src of ['/sabik/b3-motion.js','/sabik/voice-ui-adapter.js','/sabik/cognitive-preferences.js','/sabik/b3-integration.js'])assert.ok(html.includes(src),src);
console.log('SABIK_B3_INTEGRATION_R0_PASS');
