const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const I=require(path.join(root,'sabik','b3-integration.js'));
const V=require(path.join(root,'sabik','voice-ui-adapter.js'));
const C=require(path.join(root,'sabik','cognitive-preferences.js'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'sabik','assets','b3','ASSET_MANIFEST.json'),'utf8'));

assert.equal(manifest.schema,'SABIK_B3_RUNTIME_ASSETS_R0');
assert.equal(manifest.source_files.length,15);
assert.equal(new Set(manifest.source_files.map(x=>x.file)).size,15);
assert.equal(manifest.runtime.file,'sabik-b3-r0-sprite-256-lossless.webp');
assert.equal(manifest.runtime.lossless,true);
assert.deepEqual(manifest.runtime.columns,['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR']);
assert.deepEqual(manifest.runtime.rows,['web','ia','educa']);
const sprite=path.join(root,'sabik','assets','b3',manifest.runtime.file);
assert.ok(fs.existsSync(sprite),'runtime sprite must be committed');
const bytes=fs.readFileSync(sprite);
assert.equal(bytes.length,manifest.runtime.bytes);
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),manifest.runtime.sha256);

assert.deepEqual(I.STATES,['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR']);
assert.deepEqual(I.PRESENCES,['web','ia','educa']);
assert.equal(I.SPRITE,'/sabik/assets/b3/sabik-b3-r0-sprite-256-lossless.webp');
assert.deepEqual(I.cell('web','PRESENTE'),{sprite:I.SPRITE,column:0,row:0,x:0,y:0});
assert.deepEqual(I.cell('ia','TRANSICIÓN'),{sprite:I.SPRITE,column:2,row:1,x:50,y:50});
assert.deepEqual(I.cell('educa','CONFIRMAR'),{sprite:I.SPRITE,column:4,row:2,x:100,y:100});

assert.equal(I.project({operation:'paused',interaction:'pausa'}),'PAUSA');
assert.equal(I.project({operation:'awaiting_clarification',interaction:'correccion'}),'ORIENTAR');
for(const op of ['ready','retrieving','composing','presenting','error'])assert.equal(I.project({operation:op}),'PRESENTE',op);

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
assert.doesNotMatch(intSource,/BUSCANDO|COMPONIENDO|HABLANDO|LOADING/);
const html=fs.readFileSync(path.join(root,'es','nea','index.html'),'utf8');
for(const src of ['/sabik/b3-motion.js','/sabik/voice-ui-adapter.js','/sabik/cognitive-preferences.js','/sabik/b3-integration.js'])assert.ok(html.includes(src),src);
assert.ok(html.includes('data-sabik-presence="ia"'));
console.log('SABIK_B3_INTEGRATION_R0_PASS');
