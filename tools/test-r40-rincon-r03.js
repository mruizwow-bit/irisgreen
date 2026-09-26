const fs=require('node:fs'),assert=require('node:assert/strict');
const es=fs.readFileSync('es/sitio-tranquilo/index.html','utf8'),en=fs.readFileSync('en/quiet-space/index.html','utf8');
const snd=fs.readFileSync('assets/rincon-sonidos-r40.js','utf8'),ctl=fs.readFileSync('assets/rincon-r03.js','utf8'),oct=fs.readFileSync('assets/rincon-pulpos-r40.js','utf8'),css=fs.readFileSync('assets/rincon-r03.css','utf8'),calm=fs.readFileSync('assets/rincon-calma.js','utf8');
for(const [lang,h] of [['ES',es],['EN',en]]){
 const scenes=[...h.matchAll(/data-scene="([^"]+)"/g)].map(x=>x[1]);assert.equal(scenes.length,9,lang+' nine scenes');assert.equal(new Set(scenes).size,9,lang+' unique scenes');assert.ok(scenes.includes('octopus'));
 ['videos','sounds','ball'].forEach(k=>assert.ok(h.includes('data-r40-mode="'+k+'"'),lang+' mode '+k));
 ['r40StartAV','r40ImageOnly','r40Mute','sceneVol','stopVideo','r40SceneStatus','r40ModeSelect','r40Workspace'].forEach(id=>assert.ok(h.includes('id="'+id+'"'),lang+' '+id));
}
assert.ok(es.includes('Ver y escuchar')&&en.includes('Watch and listen'));
assert.ok(es.includes('Bola de relajación')&&en.includes('Relaxation ball'));
const catalog=[...snd.matchAll(/\{id:'([^']+)',fam:/g)].map(x=>x[1]);assert.deepEqual(catalog,['lluvia','lluvia-ventana','olas','rio','viento','pajaros','grillos','fuego','ruido-rosa','ruido-marron','piano','cuencos']);
['escena-mar','escena-lluvia','escena-rio','escena-noche','escena-acuario','escena-burbujas','escena-medusas','escena-fibra','escena-pulpos'].forEach(id=>assert.ok(snd.includes("'"+id+"'"),id));
assert.ok(!snd.includes('/audio/rincon/'),'new library has no HOLD recording path');
assert.ok(snd.includes("kind:'SYNTHETIC_FIRST_PARTY_R40_R03'"));
assert.ok(ctl.includes("stopMode(current)"),'mode switch stops previous tool');
assert.ok(ctl.includes("addEventListener('click',capture,true)"),'scene choice does not auto-start');
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
assert.ok(oct.includes('IGOctopusScene')&&!oct.includes('AudioContext'));
assert.ok(calm.includes("var SOUNDS = [];"),'historical recordings removed from mixer');
assert.ok(calm.includes("octopus: 'escena-pulpos'"),'octopus scene sound mapped');
console.log('R40_RINCON_R03_STATIC_PASS');