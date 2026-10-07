import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL=process.env.DETECTIVE_BASE_URL||'http://127.0.0.1:4173';
const out=process.env.DETECTIVE_ARTIFACTS||'artifacts/detective-game-first';
await fs.mkdir(path.join(out,'video'),{recursive:true});

const cases=[
{name:'es-1440',url:'/es/creacion/detective/?scene=7',width:1440,height:1000,touch:false},
{name:'es-390',url:'/es/creacion/detective/?scene=7',width:390,height:844,touch:true},
{name:'es-320',url:'/es/creacion/detective/?scene=7',width:320,height:760,touch:true},
{name:'en-1440',url:'/en/creation/detective/?scene=7',width:1440,height:1000,touch:false},
{name:'en-390',url:'/en/creation/detective/?scene=7',width:390,height:844,touch:true},
{name:'en-320',url:'/en/creation/detective/?scene=7',width:320,height:760,touch:true}
];

async function meter(page,id){return Number(await page.locator(id).evaluate(el=>el.parentElement.getAttribute('aria-valuenow')))}
async function meters(page){return{body:await meter(page,'#dg-body'),breath:await meter(page,'#dg-breath'),attention:await meter(page,'#dg-attention')}}
async function chooseObject(page,kind){
 const mobile=(page.viewportSize()?.width||9999)<=850;
 if(mobile&&await page.locator('#dg-panel').getAttribute('data-mobile-open')==='true')await page.locator('#dg-mobile-objects').tap();
 const target=page.locator('[data-pick="'+kind+'"]');
 if(mobile)await target.tap();else await target.click();
 if(mobile&&await page.locator('#dg-panel').getAttribute('data-mobile-open')!=='true')throw new Error('mobile sheet did not open after selecting '+kind);
}
async function canvasRaycast(page,touch){
 const canvas=page.locator('#detective-game canvas'); const box=await canvas.boundingBox(); if(!box)throw new Error('canvas box missing');
 await page.locator('[data-pick]').evaluateAll(xs=>xs.forEach(x=>x.setAttribute('aria-pressed','false')));
 for(const fy of [.25,.35,.45,.55,.65]){
  for(const fx of [.15,.25,.35,.45,.55,.65,.75,.85]){
   const x=box.x+box.width*fx,y=box.y+box.height*fy;
   if(touch)await page.touchscreen.tap(x,y);else await page.mouse.click(x,y);
   const pressed=await page.locator('[data-pick][aria-pressed="true"]').count();
   if(pressed)return true;
  }
 }
 return false;
}
async function strategy(page,a,b,hyp){
 await chooseObject(page,a.kind);
 await page.locator('[data-level="'+a.level+'"]').click();
 await page.locator('[data-hypothesis="'+hyp+'"]').click();
 await page.locator('#dg-try').click();
 const first=await meters(page);
 await chooseObject(page,b.kind);
 await page.locator('[data-level="'+b.level+'"]').click();
 await page.locator('#dg-try').click();
 const second=await meters(page);
 if(await page.locator('#dg-resolve').isDisabled())throw new Error('resolve should be enabled after two distinct trials + hypothesis');
 await page.locator('#dg-resolve').click();
 const status=await page.locator('#dg-status').textContent();
 if(!/cerrada|closed/i.test(status||''))throw new Error('resolution did not complete');
 return{first,second,status};
}

const browser=await chromium.launch({headless:true}); const report=[];
for(const tc of cases){
 const context=await browser.newContext({viewport:{width:tc.width,height:tc.height},hasTouch:tc.touch,recordVideo:{dir:path.join(out,'video'),size:{width:tc.width,height:tc.height}},reducedMotion:'no-preference'});
 const page=await context.newPage(),errors=[]; page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(baseURL+tc.url,{waitUntil:'networkidle'});await page.locator('#detective-game canvas').waitFor({state:'visible'});

 const stage=await page.locator('#detective-game').boundingBox(),firstPick=await page.locator('[data-pick]').first().boundingBox();
 if(!stage||!firstPick)throw new Error(tc.name+': workspace/first action missing');
 const workspaceFirst=stage.y<tc.height*.38 && firstPick.y<tc.height;
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
 const minButton=await page.locator('button').evaluateAll(bs=>Math.min(...bs.map(b=>b.getBoundingClientRect().height)));

 let mobileSpecific=true;
 if(tc.width<=850){
  const dock=page.locator('.dg-mobile-dock'),panel=page.locator('#dg-panel');
  mobileSpecific=await dock.isVisible() && (await panel.evaluate(el=>getComputedStyle(el).position))==='fixed' && await panel.getAttribute('data-mobile-open')==='false';
  await page.locator('#dg-panel-toggle').tap();
  if(await panel.getAttribute('data-mobile-open')!=='true')throw new Error(tc.name+': mobile sheet did not open');
  await page.locator('#dg-mobile-objects').tap();
 }
 if(!workspaceFirst)throw new Error(tc.name+': workspace-first/first action failed');
 if(!mobileSpecific)throw new Error(tc.name+': mobile-specific composition failed');

 const raycast=await canvasRaycast(page,tc.touch);
 if(!raycast)throw new Error(tc.name+': canvas pointer/touch raycast did not select an object');
 if(tc.width<=850){
  await page.locator('#dg-mobile-objects').tap();
  if(await page.locator('#dg-panel').getAttribute('data-mobile-open')!=='false')throw new Error(tc.name+': mobile sheet did not close after canvas selection');
 }

 await chooseObject(page,'light');
 await page.locator('[data-level="2"]').click();
 await page.locator('[data-hypothesis="depends"]').click();
 await page.locator('#dg-try').click();
 const beforeSecond=await meters(page);
 await chooseObject(page,'sound');
 await page.locator('[data-level="0"]').click();
 await page.locator('#dg-try').click();
 const afterSecond=await meters(page);
 if(JSON.stringify(beforeSecond)===JSON.stringify(afterSecond))throw new Error(tc.name+': consequence did not change between strategies');
 await page.locator('#dg-undo').click();
 const afterUndo=await meters(page);
 if(JSON.stringify(afterUndo)!==JSON.stringify(beforeSecond))throw new Error(tc.name+': undo did not restore previous consequence state');

 const motion=[];
 for(let i=0;i<4;i++){motion.push(await page.locator('#dg-motion').getAttribute('data-motion'));if(i<3)await page.locator('#dg-motion').click()}
 if(motion.join('>')!=='normal>reduced>none>normal')throw new Error(tc.name+': motion cycle invalid: '+motion.join('>'));

 const s1=await strategy(page,{kind:'light',level:'0'},{kind:'texture',level:'2'},'calm');
 await page.locator('#dg-reset').click();
 const label=await page.locator('#dg-scene-label').textContent();
 if(!/08/.test(label||''))throw new Error(tc.name+': deterministic next scene index failed');
 const s2=await strategy(page,{kind:'sound',level:'2'},{kind:'light',level:'2'},'depends');

 await page.locator('#detective-game canvas').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('+');
 await page.screenshot({path:path.join(out,tc.name+'.png'),fullPage:true});
 report.push({case:tc.name,workspaceFirst,mobileSpecific,raycast,overflow,minButton,motion,strategy1:s1,strategy2:s2,errors});
 await context.close();
}

const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const rp=await reduced.newPage();await rp.goto(baseURL+'/es/creacion/detective/?scene=7',{waitUntil:'networkidle'});
if(await rp.locator('#dg-motion').getAttribute('data-motion')!=='reduced')throw new Error('prefers-reduced-motion did not start in REDUCED');
await reduced.close();await browser.close();

const failed=report.filter(r=>r.overflow||r.minButton<44||r.errors.length||!r.workspaceFirst||!r.mobileSpecific||!r.raycast);
await fs.writeFile(path.join(out,'report.json'),JSON.stringify({generatedAt:new Date().toISOString(),baseURL,seedScene:7,report,failed},null,2));
if(failed.length){console.error(JSON.stringify(failed,null,2));process.exit(1)}
console.log('DETECTIVE_GAME_FIRST_E2E_PASS');
