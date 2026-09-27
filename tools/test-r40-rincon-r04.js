const fs=require('node:fs'),assert=require('node:assert/strict');
const es=fs.readFileSync('es/sitio-tranquilo/index.html','utf8'),en=fs.readFileSync('en/quiet-space/index.html','utf8');
const calm=fs.readFileSync('assets/rincon-calma.js','utf8'),visual=fs.readFileSync('assets/rincon-escenas-r04.js','utf8'),audio=fs.readFileSync('assets/rincon-audio-r04.js','utf8'),ctl=fs.readFileSync('assets/rincon-r04.js','utf8'),css=fs.readFileSync('assets/rincon-r04.css','utf8');
new Function(calm);new Function(visual);new Function(audio);new Function(ctl);
for(const [lang,h] of [['ES',es],['EN',en]]){
 assert.ok(h.includes('/assets/rincon-r04.css?v=r40-r04-20260926'),lang+' css R04');
 assert.ok(h.includes('/assets/rincon-audio-r04.js?v=r40-r04-20260926'),lang+' rendered audio');
 assert.ok(h.includes('/assets/rincon-r04.js?v=r40-r04-20260926'),lang+' controller');
 assert.ok(!h.includes('rincon-r03.js?v='),lang+' no R03 controller');
 assert.ok(!h.includes('rincon-sonidos-r40.js?v='),lang+' no runtime R03 synthesis');
 ['videos','sounds','ball'].forEach(k=>assert.ok(h.includes('data-r40-mode="'+k+'"'),lang+' mode '+k));
}
assert.ok(calm.includes('/assets/rincon-escenas-r04.js?v=r40-r04-20260926'),'new visual engine loaded');
assert.ok(!calm.includes('rincon-escenas-3d.js'),'old visual engine not loaded');
['sea','rain','river','night','aquarium','bubbles','jellies','fibre','octopus'].forEach(k=>assert.ok(visual.includes("kind==='"+k+"'")||visual.includes("kind===\""+k+"\"")||visual.includes("kind==='"+k+"'"),'visual '+k));
assert.ok(visual.includes("window.IGScenesR04"),'visual engine exported');
assert.ok(audio.includes("RENDERED_FIRST_PARTY_R40_R04"),'rendered provenance');
assert.ok(!audio.includes('createOscillator'),'runtime audio does not synthesize identity');
assert.ok(audio.includes('/audio/rincon/r04/general-nature.m4a')&&audio.includes('/audio/rincon/r04/scenes.m4a'),'sprite assets referenced');
assert.ok(!ctl.includes('scrollIntoView'),'R04 does not rescue buried player by scrolling');
assert.ok(ctl.includes('p.insertBefore(stage,p.firstChild)'),'player physically moved first');
assert.ok(ctl.includes("detailsFor(p,opts)"),'settings disclosure');
assert.ok(ctl.includes("p.insertBefore(now,p.firstChild)"),'sound status/player first');
assert.ok(ctl.includes("p.insertBefore(box,p.firstChild)"),'ball first');
assert.ok(css.includes('#watch>.stage{order:1'),'video player first CSS');
assert.ok(css.includes('#listen>.audio-now{order:1'),'sound player first CSS');
assert.ok(css.includes('#pause>.breathbox{order:1'),'ball first CSS');
assert.ok(css.includes('@media(max-width:700px)'),'mobile layout');
assert.ok(css.includes('@media(forced-colors:active)'),'forced colors');
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'),'reduced motion');
if(fs.existsSync('audio/rincon/r04/AUDIO_MANIFEST.json')){
 const m=JSON.parse(fs.readFileSync('audio/rincon/r04/AUDIO_MANIFEST.json','utf8'));assert.equal(Object.keys(m.items).length,21,'21 rendered segments');assert.equal(Object.keys(m.sprites).length,3,'3 rendered sprites');
 for(const s of Object.values(m.sprites)){assert.ok(fs.existsSync(s.path),s.path+' exists');}
}
console.log('R40_RINCON_R04_STATIC_PASS');
