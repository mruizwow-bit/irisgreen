const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const es=read('es/sitio-tranquilo/index.html'),en=read('en/quiet-space/index.html');
const calm=read('assets/rincon-calma.js'),ctl=read('assets/rincon-r42.js'),audio=read('assets/rincon-audio-r42.js');
const media=read('assets/rincon-realmedia-r42.js'),css=read('assets/rincon-r42-humanqa.css');
for(const [name,src] of [['calma',calm],['controller',ctl],['audio',audio],['realmedia',media]]) new Function(src);
for(const [lang,h] of [['ES',es],['EN',en]]){
 assert.equal((h.match(/data-scene=/g)||[]).length,9,lang+' has 9 curated scenes');
 for(const k of ['sea','rain','river','night','aquarium','bubbles','jellies','fibre','octopus']) assert.ok(h.includes('data-scene="'+k+'"'),lang+' '+k);
 for(const k of ['forest','dawn','clouds']) assert.ok(!h.includes('data-scene="'+k+'"'),lang+' weak extra removed '+k);
 assert.ok(h.includes('/assets/rincon-realmedia-r42.js?v=r42-a7-hqa-20260926'),lang+' real media');
 assert.ok(h.includes('/assets/rincon-r42-humanqa.css?v=r42-a7-hqa-20260926'),lang+' HQA CSS');
}
for(const k of ['sea','rain','river','night','aquarium','jellies','octopus']) assert.ok(media.includes(k+':{file:'),'real media '+k);
assert.ok(media.includes("preload='none'")||media.includes("video.preload='none'"),'remote video not preloaded');
assert.ok(media.includes('navigator.connection')&&media.includes('saveData'),'Save-Data fallback');
assert.ok(media.includes('requestVideoFrameCallback'),'first-frame readiness');
assert.ok(calm.includes('IGQuietMediaR42'),'calma delegates natural visual scenes');
assert.ok(ctl.includes('r42-more-actions'),'secondary actions grouped');
assert.ok(css.includes('grid-template-columns:minmax(11rem,1.35fr)'),'stable desktop control grid');
assert.ok(css.includes('@media(max-width:390px)'),'narrow viewport layout');
assert.ok(css.includes('body.r42-clean .ig-r42-topbar'),'clean mode suppresses shell chrome');
assert.ok(css.includes('.r42-media-video'),'real video stage styling');
assert.ok(audio.includes("else if(id==='escena-rio'){bed(910,170,.012,.94)"),'river audio softened');
console.log('R42_A7_HQA_REBUILD_STATIC_PASS');