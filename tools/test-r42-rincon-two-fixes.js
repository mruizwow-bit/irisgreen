const fs=require('node:fs'),assert=require('node:assert/strict');
const js=fs.readFileSync('assets/rincon-r42.js','utf8');
const css=fs.readFileSync('assets/rincon-r42-humanqa.css','utf8');
const es=fs.readFileSync('es/sitio-tranquilo/index.html','utf8');
const en=fs.readFileSync('en/quiet-space/index.html','utf8');
new Function(js);
assert.ok(js.includes("function setBodyClass(c,on){var l=document.body.classList;if(l.contains(c)!==on)l.toggle(c,on);}"),'idempotent body class helper');
assert.ok(js.includes("setBodyClass('r42-clean',on)"),'clean mode uses idempotent helper');
assert.ok(!js.includes("document.body.classList.toggle('r42-clean',on)"),'old mutation-loop trigger removed');
assert.ok(css.includes(".r42-rincon .r40-scene-actions [hidden]{display:none!important}"),'hidden scene action stays hidden');
for(const [lang,h] of [['ES',es],['EN',en]]){
 assert.ok(h.includes('/assets/rincon-r42.js?v=r42-a7-20260926-d01'),lang+' JS cache-bust');
 assert.ok(h.includes('/assets/rincon-r42-humanqa.css?v=r42-a7-hqa-20260926-d01'),lang+' CSS cache-bust');
}
console.log('R42_A7_RINCON_TWO_FIXES_PASS');