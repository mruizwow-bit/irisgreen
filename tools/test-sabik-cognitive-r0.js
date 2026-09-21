const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'sabik','sabik-page.css'),'utf8');
const prefs=fs.readFileSync(path.join(root,'sabik','cognitive-preferences.js'),'utf8');
const voice=fs.readFileSync(path.join(root,'sabik','voice-ui-adapter.js'),'utf8');
const html=fs.readFileSync(path.join(root,'es','nea','index.html'),'utf8');

for(const token of ['NORMAL','REDUCIDO','SIN_MOVIMIENTO'])assert.ok(prefs.includes(token),token);
for(const token of ['completa','reducida','paso_a_paso'])assert.ok(prefs.includes(token),token);
for(const globalHook of ['IGPreferences','data-ig-motion','data-ig-system-motion','data-ig-contrast','data-ig-text-letter','data-ig-text-word','data-ig-text-line','data-ig-text-width'])assert.ok(prefs.includes(globalHook),globalHook);

assert.match(css,/@media \(max-width:320px\)/);
assert.match(css,/data-sabik-density="paso_a_paso"/);
assert.match(css,/data-sabik-density="reducida"/);
assert.match(css,/data-ig-text-width/);
assert.match(css,/data-ig-text-line/);
assert.match(css,/data-ig-contrast="on"/);
assert.match(css,/html\[data-ig-preferences="2"\] \.sabik-panel\s*\{\s*zoom:var\(--ig-reading-scale,1\);\s*\}/);
assert.doesNotMatch(css,/font-size:calc\(1rem \* var\(--ig-reading-scale/,'do not double-apply global text scale');

const densitySection=css.slice(css.indexOf('ACC-10:'),css.indexOf('Reduced Motion is independent'));
assert.doesNotMatch(densitySection,/\.sabik-answer[^}]*display\s*:\s*none/i);
assert.doesNotMatch(densitySection,/\.sabik-(notice|limits|source-list)[^}]*display\s*:\s*none/i);

for(const id of ['sabik-voice-enabled','sabik-voice-volume','sabik-voice-rate','sabik-voice-repeat'])assert.ok(voice.includes(id),id);
for(const forbidden of [/ElevenLabs/i,/speechSynthesis/,/SpeechSynthesisUtterance/,/getUserMedia/,/MediaRecorder/,/autoplay/i])assert.doesNotMatch(voice,forbidden);

for(const src of ['/sabik/b3-motion.js','/sabik/voice-ui-adapter.js','/sabik/cognitive-preferences.js','/sabik/b3-integration.js'])assert.ok(html.includes(src),src);
assert.ok(html.includes('data-sabik-presence="ia"'));

console.log('SABIK_COGNITIVE_ACCESSIBILITY_R0_PASS');
