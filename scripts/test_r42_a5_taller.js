/* R42-A5 Workshop product gate. Run with Node from repository root. */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const catalog=require(path.join(root,'assets/data/taller-r40-catalog.js'));

assert.equal(catalog.length,25,'catalog must contain 25 studios');
assert.equal(new Set(catalog.map(x=>x.id)).size,25,'studio ids must be unique');

const pathsSrc=read('assets/data/taller-r42-paths.js');
for(const s of catalog){
  assert.ok(pathsSrc.includes("'"+s.id+"'"),'missing R42 life-stage path '+s.id);
  for(const locale of ['es','en']){
    const slug=s.slugs[locale];
    const file=locale==='es'?path.join('es/taller',slug,'index.html'):path.join('en/workshop',slug,'index.html');
    assert.ok(fs.existsSync(path.join(root,file)),file+' must exist');
    assert.match(read(file),/ig-taller-estudio\.js/,'common runtime missing '+file);
  }
}

const shell=read('assets/ig-taller-r42.js');
const css=read('assets/ig-taller-r42.css');
const common=read('assets/ig-taller-estudio.js');
const platform=read('assets/ig-taller-r42-platform.js');
const direct=read('assets/ig-taller-r42-direct.js');
const worker=read('assets/workers/ig-taller-r42-worker.js');
const tools=read('assets/ig-taller-r40-tools.js');

assert.match(shell,/ig42-workspace/);
assert.match(shell,/ig42-toolrail/);
assert.match(shell,/ig42-inspector/);
assert.match(shell,/showOpenFilePicker/,'File System Access must remain optional enhancement');
assert.match(shell,/IGTallerR42Direct/,'direct manipulation layer must be mounted');
assert.match(shell,/ig42-mode/,'Free/Challenge mode must be explicit');
assert.match(shell,/Sin guardar|Unsaved/,'saved state must expose unsaved changes');
assert.match(shell,/ig42-inspector-open/,'mobile inspector sheet must be controllable');
assert.match(shell,/createElement\('canvas'\)/,'launcher previews must be real canvas previews');
assert.match(shell,/Infancia|Childhood/);
assert.match(shell,/Adolescencia|Teens/);
assert.match(shell,/Adultez|Adults/);

assert.match(platform,/OffscreenCanvas/,'OffscreenCanvas progressive path required');
assert.match(platform,/AudioWorkletNode/,'AudioWorklet progressive path required');
assert.match(platform,/storage\.getDirectory/,'OPFS capability required');
assert.match(platform,/navigator\.locks/,'Web Locks coordination required');
assert.match(platform,/BroadcastChannel/,'multi-tab coordination channel required');
assert.match(platform,/showOpenFilePicker/,'File System Access capability must remain optional');
assert.match(worker,/life-step/,'simulation worker task required');
assert.match(worker,/transferToImageBitmap/,'worker preview must use OffscreenCanvas when available');
assert.match(direct,/ig42-direct-canvas/,'direct manipulation canvas required');
assert.match(direct,/Cuadrícula accesible|Accessible keyboard grid/,'semantic keyboard fallback required');
assert.match(direct,/pointerdown/,'pointer direct manipulation required');
assert.match(direct,/ArrowLeft/,'keyboard equivalent required');
assert.match(tools,/IGTallerR42Platform/,'studio engines must consume the platform progressively');
assert.match(common,/ig-taller-r42-platform\.js/,'common runtime must load platform layer');
assert.match(common,/ig-taller-r42-direct\.js/,'common runtime must load direct-manipulation layer');
assert.match(common,/ig-taller-r42\.js/,'common runtime must load R42 shell');
assert.match(common,/taller-r42-paths\.js/,'common runtime must load stage paths');

assert.match(css,/100dvh/,'workspace must be viewport-first');
assert.match(css,/@container/,'container queries required');
assert.match(css,/@media\(max-width:720px\)/,'mobile-specific layout required');
assert.match(css,/grid-template-rows:minmax\(0,1fr\) 58px/,'mobile bottom dock required');
assert.match(css,/bottom:72px/,'mobile inspector must open as bottom sheet');
assert.match(css,/ig42-direct-canvas/,'direct canvas must have product styling');
assert.match(css,/prefers-reduced-motion/);
assert.match(css,/forced-colors/);
assert.match(css,/outline:3px/);

const forbidden=['XMLHttpRequest','sendBeacon','WebSocket'];
for(const [name,src] of [['shell',shell],['platform',platform],['direct',direct],['worker',worker]]){
  for(const token of forbidden)assert.equal(src.includes(token),false,name+' must not contain '+token);
}

const pageCount=catalog.reduce((n,s)=>n+(fs.existsSync(path.join(root,'es/taller',s.slugs.es,'index.html'))?1:0)+(fs.existsSync(path.join(root,'en/workshop',s.slugs.en,'index.html'))?1:0),0);
assert.equal(pageCount,50,'25 studios must exist in both ES and EN');

console.log(JSON.stringify({
  status:'PASS',studios:25,pages:50,stage_paths:25,workspace_first:true,mobile_bottom_dock:true,
  worker:true,offscreen:true,audio_worklet_progressive:true,opfs_progressive:true,direct_canvas:true,keyboard_fallback:true
},null,2));
