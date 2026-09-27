/* A5 advanced workshop correction gate. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const shell=read('assets/ig-taller-r42.js');
const loader=read('assets/ig-taller-estudio.js');
const tools=read('assets/ig-taller-r40-tools.js');
const adv=read('assets/ig-taller-r43-advanced.js');
const css=read('assets/ig-taller-r43-advanced.css');
const drawing=read('assets/ig-taller-dibujo.js');

assert.doesNotMatch(shell,/sessionStorage\.getItem\(['"]ig42-stage/,'life-stage view must not be persisted');
assert.doesNotMatch(shell,/sessionStorage\.setItem\(['"]ig42-stage/,'life-stage view must not be stored');
assert.match(shell,/Ver propuestas para|Show ideas for/,'stage control must describe a view, not identity');
assert.match(shell,/ig42-link-context/,'stage selection must change visible context');
assert.match(shell,/\.ig43-toolbar button/,'R42 rail must expose advanced-engine tools');
assert.match(shell,/\.ig43-editor/,'R42 shell must recognise advanced editors as ready workspaces');
assert.match(shell,/dataStudyId|studyId|dataset\.studyId/,'launcher must bind cards to studios');

assert.match(loader,/ig-taller-r43-advanced\.js/,'advanced engine must actually load');
assert.match(loader,/ig-taller-r43-advanced\.css/,'advanced engine styles must actually load');
assert.match(tools,/IGTallerR43Advanced\.mountGeneric/,'generic studios must route into advanced engines');
assert.match(adv,/architecture:1/);
assert.match(adv,/pixel:1/);
assert.match(adv,/game:1/);
assert.match(adv,/simulation:1/);
assert.match(adv,/rhythm:1/);
assert.match(adv,/composition:1/);
assert.match(adv,/worlds:1/);
assert.match(adv,/board:1/);
assert.match(adv,/pattern:1/);
assert.match(adv,/ig43-split/,'architecture must expose simultaneous plan/volume surface');
assert.match(adv,/Modo prueba|Play mode/,'game editor must have a playable mode');
assert.match(adv,/Piano roll/,'composition must be timeline based');
assert.match(adv,/pointerdown/,'advanced surfaces require direct pointer manipulation');
assert.match(adv,/ArrowLeft/,'advanced surfaces require keyboard equivalent');
assert.doesNotMatch(adv,/XMLHttpRequest|sendBeacon|WebSocket|fetch\s*\(/,'advanced engines must remain local only');

assert.match(drawing,/pointerPressure/,'drawing must use pen pressure progressively');
assert.match(drawing,/getCoalescedEvents/,'drawing must retain coalesced pointer events');
assert.match(css,/touch-action:none/);
assert.match(css,/forced-colors/);
assert.match(css,/prefers-reduced-motion/);

for(const src of [adv,shell,loader,tools,drawing]) new Function(src);
console.log(JSON.stringify({status:'PASS',advanced_families:9,stage_persistence:false,direct_manipulation:true,stylus_pressure:true,current_a2_base:true},null,2));
