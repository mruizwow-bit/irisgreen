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
    const html=read(file);
    assert.match(html,/ig-taller-estudio\.js/,'common runtime missing '+file);
  }
}
const shell=read('assets/ig-taller-r42.js');
const css=read('assets/ig-taller-r42.css');
const common=read('assets/ig-taller-estudio.js');
assert.doesNotMatch(shell,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/i,'R42 shell must not send local data to network');
assert.match(shell,/ig42-workspace/);
assert.match(shell,/ig42-toolrail/);
assert.match(shell,/ig42-inspector/);
assert.match(shell,/showOpenFilePicker/,'File System Access must remain optional enhancement');
assert.match(shell,/directManipulation/);
assert.match(shell,/ig42-mode/,'Free/Challenge mode must be explicit');
assert.match(shell,/Sin guardar|Unsaved/,'saved state must expose unsaved changes');
assert.match(shell,/ig42-inspector-open/,'mobile inspector sheet must be controllable');
assert.match(shell,/createElement\('canvas'\)/,'launcher previews must be real canvas previews');
assert.match(shell,/Infancia|Childhood/);
assert.match(shell,/Adolescencia|Teens/);
assert.match(shell,/Adultez|Adults/);
assert.match(common,/ig-taller-r42\.js/,'common runtime must load R42 shell');
assert.match(common,/taller-r42-paths\.js/,'common runtime must load stage paths');
assert.match(css,/100dvh/,'workspace must be viewport-first');
assert.match(css,/@container/,'container queries required');
assert.match(css,/@media\(max-width:720px\)/,'mobile-specific layout required');
assert.match(css,/grid-template-rows:minmax\(0,1fr\) 58px/,'mobile bottom dock required');
assert.match(css,/bottom:72px/,'mobile inspector must open as bottom sheet');
assert.match(css,/ig42-mode-btn/,'Free/Challenge mode must be styled as a product control');
assert.match(css,/prefers-reduced-motion/);
assert.match(css,/forced-colors/);
assert.match(css,/outline:3px/);
const pageCount=catalog.reduce((n,s)=>n+(fs.existsSync(path.join(root,'es/taller',s.slugs.es,'index.html'))?1:0)+(fs.existsSync(path.join(root,'en/workshop',s.slugs.en,'index.html'))?1:0),0);
assert.equal(pageCount,50,'25 studios must exist in both ES and EN');
console.log(JSON.stringify({status:'PASS',studios:25,pages:50,stage_paths:25,network_calls:0,workspace_first:true,mobile_bottom_dock:true},null,2));
