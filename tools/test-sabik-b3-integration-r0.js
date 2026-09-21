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
assert.equal(manifest.source.head,'e5f70cba76a4414527c10b0fbecfd549a7390e66');
assert.equal(manifest.source.frozen,true);
assert.equal(manifest.source_files.length,15);
assert.equal(manifest.runtime_files.length,15);
assert.equal(manifest.runtime.count,15);
assert.deepEqual(manifest.runtime.dimensions,[128,128]);
assert.equal(manifest.runtime.packaging,'individual_files');

const runtimeNames=new Set();
for(const item of manifest.runtime_files){
  runtimeNames.add(item.file);
  const file=path.join(root,'sabik','assets','b3',item.file);
  assert.ok(fs.existsSync(file),'missing runtime asset '+item.file);
  const bytes=fs.readFileSync(file);
  assert.equal(bytes.length,item.bytes,'byte count '+item.file);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256,'sha256 '+item.file);
  assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF','RIFF '+item.file);
  assert.equal(bytes.subarray(8,12).toString('ascii'),'WEBP','WEBP '+item.file);
}
assert.equal(runtimeNames.size,15);

assert.deepEqual(I.STATES,['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR']);
assert.deepEqual(I.PRESENCES,['web','ia','educa']);
const expectedPaths=new Set();
for(const presence of I.PRESENCES){
  for(const state of I.STATES){
    const url=I.asset(presence,state);
    assert.match(url,/^\/sabik\/assets\/b3\/(web|ia|educa)_(presente|orientar|transicion|pausa|confirmar)\.webp$/);
    expectedPaths.add(url);
  }
}
assert.equal(expectedPaths.size,15);
assert.equal(I.asset('web','PRESENTE'),'/sabik/assets/b3/web_presente.webp');
assert.equal(I.asset('ia','TRANSICIÓN'),'/sabik/assets/b3/ia_transicion.webp');
assert.equal(I.asset('educa','CONFIRMAR'),'/sabik/assets/b3/educa_confirmar.webp');

assert.equal(I.project({operation:'paused',interaction:'pausa'}),'PAUSA');
assert.equal(I.project({operation:'awaiting_clarification',interaction:'correccion'}),'ORIENTAR');
for(const op of ['ready','retrieving','composing','presenting','error'])assert.equal(I.project({operation:op}),'PRESENTE',op);
assert.equal(I.project({operation:'ready',speech:'speaking'}),'PRESENTE');
assert.equal(I.project({operation:'ready',safety:'risk'}),'PRESENTE');

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

const integrationSource=fs.readFileSync(path.join(root,'sabik','b3-integration.js'),'utf8');
for(const forbiddenState of [/['"]BUSCANDO['"]/,/['"]COMPONIENDO['"]/,/['"]HABLANDO['"]/,/['"]LOADING['"]/,/['"]ERROR['"]/,/['"]RIESGO['"]/])assert.doesNotMatch(integrationSource,forbiddenState);
assert.doesNotMatch(integrationSource,/speechSynthesis|SpeechSynthesisUtterance|getUserMedia|MediaRecorder/);

const html=fs.readFileSync(path.join(root,'es','nea','index.html'),'utf8');
for(const src of ['/sabik/b3-motion.js','/sabik/voice-ui-adapter.js','/sabik/cognitive-preferences.js','/sabik/b3-integration.js'])assert.ok(html.includes(src),src);
assert.ok(html.includes('data-sabik-presence="ia"'));

console.log('SABIK_B3_INTEGRATION_R0_PASS');
