/* B3 R0 browser smoke. Real AT/manual checks remain separate. */
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');

const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

const listen=()=>new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const closeServer=()=>new Promise(resolve=>server.close(resolve));

async function stableDevice(context){
  await context.addInitScript(()=>{
    try{Object.defineProperty(navigator,'hardwareConcurrency',{configurable:true,get:()=>8});}catch(_){}
    try{Object.defineProperty(navigator,'deviceMemory',{configurable:true,get:()=>8});}catch(_){}
  });
}
async function noOverflow(page,label){
  const v=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  assert.ok(v.sw<=v.cw+1,label+' horizontal overflow '+JSON.stringify(v));
}

(async()=>{
  await listen();
  const origin='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'no-preference'});
    await stableDevice(context);
    const page=await context.newPage();
    await page.goto(origin+'/es/nea/',{waitUntil:'domcontentloaded'});
    await page.locator('#sabik-cognitive-settings').waitFor();
    await page.waitForFunction(()=>document.querySelector('#sabik-hologram')?.dataset.b3Active==='true');

    assert.equal(await page.locator('.sabik-panel').getAttribute('data-sabik-motion'),'NORMAL');
    assert.equal(await page.locator('.sabik-panel').getAttribute('data-sabik-density'),'completa');
    assert.equal(await page.locator('#sabik-hologram').getAttribute('data-b3-state'),'PRESENTE');
    assert.equal(await page.locator('#sabik-hologram').getAttribute('data-sabik-presence'),'ia');
    assert.deepEqual(await page.locator('#sabik-motion-choice option').evaluateAll(ns=>ns.map(n=>n.value)),['NORMAL','REDUCIDO','SIN_MOVIMIENTO']);

    for(const id of ['#sabik-voice-enabled','#sabik-voice-volume','#sabik-voice-rate','#sabik-voice-repeat']){
      assert.equal(await page.locator(id).isDisabled(),true,id+' must stay disabled before S2');
    }
    assert.match(await page.locator('#sabik-voice-note').innerText(),/S2/);

    await page.locator('#sabik-motion-choice').selectOption('SIN_MOVIMIENTO');
    assert.equal(await page.locator('.sabik-panel').getAttribute('data-sabik-motion'),'SIN_MOVIMIENTO');
    await page.locator('#sabik-density-choice').selectOption('paso_a_paso');
    assert.equal(await page.locator('.sabik-panel').getAttribute('data-sabik-density'),'paso_a_paso');

    await page.evaluate(()=>window.IGPreferences.update({scale:1.5,text:{line:2,width:'narrow'}}));
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.sabik-panel')).zoom==='1.5');
    assert.equal(await page.locator('.sabik-panel').evaluate(n=>getComputedStyle(n).zoom),'1.5');

    await page.evaluate(()=>document.documentElement.setAttribute('lang','en'));
    await page.waitForFunction(()=>document.querySelector('#sabik-cognitive-settings>summary')?.textContent==='Sabik settings');
    assert.equal(await page.locator('#sabik-voice-repeat').innerText(),'Repeat');

    // Approximate native text-only enlargement with a root-size override. No content may disappear.
    await page.addStyleTag({content:'html{font-size:200%!important}'});
    assert.equal(await page.locator('#sabik-answer').count(),1);
    assert.equal(await page.locator('.sabik-limits').count(),1);
    await noOverflow(page,'200% text at desktop');
    await context.close();

    const mobile=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'no-preference'});
    await stableDevice(mobile);
    const mp=await mobile.newPage();
    await mp.goto(origin+'/es/nea/',{waitUntil:'domcontentloaded'});
    await mp.locator('#sabik-cognitive-settings').waitFor();
    await noOverflow(mp,'320 CSS px');
    // 320 CSS px is the automated reflow proxy for 1280 CSS px at 400% zoom.
    assert.equal(await mp.locator('#sabik-answer').count(),1);
    assert.equal(await mp.locator('#sabik-settings-global-note').isVisible(),true);
    await mobile.close();

    const reduced=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
    await stableDevice(reduced);
    const rp=await reduced.newPage();
    await rp.goto(origin+'/es/nea/',{waitUntil:'domcontentloaded'});
    await rp.locator('#sabik-cognitive-settings').waitFor();
    assert.equal(await rp.locator('.sabik-panel').getAttribute('data-sabik-motion'),'REDUCIDO');
    await rp.locator('#sabik-motion-choice').selectOption('SIN_MOVIMIENTO');
    assert.equal(await rp.locator('.sabik-panel').getAttribute('data-sabik-motion'),'SIN_MOVIMIENTO');
    await reduced.close();

    console.log('SABIK_B3_BROWSER_R0_PASS');
  }finally{
    await browser.close();
    await closeServer();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
