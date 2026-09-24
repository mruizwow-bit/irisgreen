/* B3 presentation on the real local page. All non-local requests are blocked. */
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const {chromium} = require('playwright');
const {backgroundContrast} = require('./sabik-background-contrast');
const repo = path.resolve(__dirname, '..');
const root = path.resolve(process.env.B3_WEB_ROOT || repo);
const out = process.env.B3_EVIDENCE_DIR && path.resolve(process.env.B3_EVIDENCE_DIR);
if (out) { if (out === repo || out.startsWith(repo + path.sep)) throw Error('Evidence must be outside the repository'); fs.mkdirSync(out,{recursive:true}); }
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.webp':'image/webp'};
const policy=fs.readFileSync(path.join(root,'_headers'),'utf8').match(/Content-Security-Policy:\s*([^\r\n]+)/)[1];
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
 res.setHeader('Content-Security-Policy',policy);fs.createReadStream(file).pipe(res);
});
function luminance(c) {return c.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);}
function contrast(a,b) {const [x,y]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (x+.05)/(y+.05);}
const results=[];
async function check(name,fn) {try {const evidence=await fn();results.push({name,pass:true,evidence});console.log('PASS '+name);}catch(e){results.push({name,pass:false,error:e.message});console.log('FAIL '+name+': '+e.message);}}
async function assertFunctionalCopy(page) {
 const forbidden=/CLARIDAD\s+INTELIGENTE|INTELLIGENT\s+CLARITY|Una IA que adapta|AI that adapts information/i;
 const panel=page.locator('.sabik-panel');
 assert.doesNotMatch(await panel.innerText(),forbidden,'Marketing must not appear in functional UI');
 assert.doesNotMatch(await panel.ariaSnapshot(),forbidden,'Marketing must not appear in the accessibility tree');
 assert.equal(await page.locator('#sabik-web-state-label').count(),0);
 assert.equal(await page.locator('#sabik-hologram').getAttribute('aria-hidden'),'true');
 assert.equal(await page.locator('#sabik-hologram').getAttribute('aria-label'),null);
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage();
  const external=[];
  await page.route('**/*',r=>{if(new URL(r.request().url()).hostname==='127.0.0.1')return r.continue();external.push(r.request().url());return r.abort();});
  const origin='http://127.0.0.1:'+server.address().port;
  async function fresh(width=1440,scheme='light',images=true) {
   await page.setViewportSize({width,height:1000});await page.emulateMedia({colorScheme:scheme,reducedMotion:'no-preference',forcedColors:'none'});
   await page.goto(origin+'/es/nea/');await page.locator('#sabik-submit:enabled').waitFor();
   if(images) await page.locator('#sabik-web-master').evaluate(i=>i.decode());
  }
  for(const [width,scheme] of [[1920,'light'],[1440,'light'],[390,'light'],[430,'dark'],[768,'light'],[320,'light']]) {
   await check(`B3 layout ${width} ${scheme}`,async()=>{
    await fresh(width,scheme);
    await assertFunctionalCopy(page);
    const v=await page.evaluate(()=>{
     const el=s=>document.querySelector(s), rect=s=>el(s).getBoundingClientRect().toJSON();
     return {overflow:document.documentElement.scrollWidth>innerWidth,box:rect('#sabik-hologram'),image:rect('#sabik-web-master'),copy:rect('#sabik-status-text'),
      filter:getComputedStyle(el('#sabik-hologram')).filter,opacity:getComputedStyle(el('#sabik-web-master')).opacity,
      animations:el('#sabik-hologram').getAnimations({subtree:true}).length,
      texts:['#sabik-status-text','.sabik-capability','#sabik-state-label','#sabik-input-help'].map(s=>({selector:s,color:getComputedStyle(el(s)).color,background:getComputedStyle(el('.sabik-panel')).backgroundColor}))};
    });
    assert.equal(v.overflow,false);assert.equal(v.filter,'none');assert.equal(v.opacity,'1');assert.equal(v.animations,0);
    assert(v.image.left>=v.box.left+23 && v.image.right<=v.box.right-23);
    assert(v.image.top>=v.box.top+23 && v.image.bottom<=v.box.bottom-23);
    assert(v.copy.bottom<=v.box.top || v.copy.top>=v.box.bottom || v.copy.right<=v.box.left || v.copy.left>=v.box.right);
    for(const t of v.texts){Object.assign(t,await backgroundContrast(page,t.selector));assert(t.minContrast>=4.5,JSON.stringify(t));}
    assert.equal(await page.locator('.sabik-panel').evaluate(n=>getComputedStyle(n).backgroundColor),'rgba(0, 0, 0, 0)','R25B inherits the real Iris background even with a dark OS preference');
    assert.equal(await page.locator('.sabik-wordmark').evaluate(n=>getComputedStyle(n).filter),'none');
    assert.equal(await page.locator('#sabik-hologram svg, .sabik-avatar-base, .sabik-back, .sabik-front').count(),0);
    if(out){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,`page-${width}-${scheme}.png`)});await page.locator('.sabik-panel').screenshot({path:path.join(out,`panel-${width}-${scheme}.png`)});}
    return v;
   });
  }
  await check('R37 ordinary query stays PRESENTE without loading motion',async()=>{
   await fresh();await page.locator('#sabik-input').fill('Qué es el autismo');await page.locator('#sabik-submit').click();
   await page.waitForFunction(()=>document.querySelector('#sabik-output').getAttribute('aria-busy')==='false' && !document.querySelector('#sabik-output').hidden);
   assert.equal(await page.locator('#sabik-hologram').getAttribute('data-web-state'),'PRESENTE');
   assert.match(await page.locator('#sabik-web-master').getAttribute('src'),/web_presente\.png$/);
   assert((await page.locator('#sabik-answer').textContent()).length>0);
  });
  await check('pause preserves answer and exposes functional availability and resume control',async()=>{
   const before=await page.locator('#sabik-answer').textContent();await page.locator('#sabik-clear').click();await page.locator('#sabik-resume:visible').waitFor();
   assert.equal(await page.locator('#sabik-hologram').getAttribute('data-web-state'),'PAUSA');
   assert.equal(await page.locator('#sabik-state-label').textContent(),'En pausa');
   assert.equal(await page.getByRole('button',{name:'Reanudar',exact:true}).isVisible(),true);
   await assertFunctionalCopy(page);
   assert.equal(await page.locator('#sabik-answer').textContent(),before);
  });
  await check('R37 system reduced motion keeps the PAUSA master and functional pause text',async()=>{
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.waitForFunction(()=>document.querySelector('#sabik-hologram').dataset.webAsset==='PAUSA');
   assert.match(await page.locator('#sabik-web-master').getAttribute('src'),/web_pausa\.png$/);
   assert.equal(await page.locator('#sabik-state-label').textContent(),'En pausa');
  });
  await check('English functional availability is localized without a technical B3 label',async()=>{
   await page.locator('[data-lang="en"]').click();
   await page.waitForFunction(()=>document.querySelector('#sabik-state-label').textContent==='Paused');
   await assertFunctionalCopy(page);
  });
  await check('explicit shorter preference is acknowledged without asserting answer correctness',async()=>{
   await fresh();await page.locator('#sabik-shorter').click();
   await page.waitForFunction(()=>document.querySelector('#sabik-hologram').dataset.webState==='CONFIRMAR');
   assert.equal(await page.locator('#sabik-output').isHidden(),true);
  });
  await check('R37 manual motion off swaps exact static states',async()=>{
   await page.evaluate(()=>document.documentElement.dataset.igMotion='off');
   await page.waitForFunction(()=>document.querySelector('#sabik-hologram').dataset.motionLevel==='SIN_MOVIMIENTO');
   await page.evaluate(()=>window.setSabikState('confirmar',{hold:true}));
   assert.match(await page.locator('#sabik-web-master').getAttribute('src'),/web_confirmar\.png$/);
   assert.equal(await page.locator('#sabik-hologram').getAttribute('data-web-state'),'CONFIRMAR');
   await assertFunctionalCopy(page);
  });
  await check('forced colours retain an accessible text identity',async()=>{
   await page.emulateMedia({forcedColors:'active'});
   assert.equal(await page.locator('#sabik-widget-title').evaluate(n=>getComputedStyle(n).position),'static');
   assert.equal(await page.locator('#sabik-widget-title').textContent(),'Sabik');
  });
  await check('R25 copy guard rejects reintroduced visible and accessible slogans',async()=>{
   await fresh();
   await page.locator('.sabik-panel').evaluate(n=>{const p=document.createElement('p');p.id='regression-probe';p.textContent='CLARIDAD INTELIGENTE.';n.append(p);});
   await assert.rejects(()=>assertFunctionalCopy(page),/Marketing must not appear/);
   await page.locator('#regression-probe').evaluate(n=>n.remove());
   await page.locator('#sabik-submit').evaluate(n=>n.setAttribute('aria-label','CLARIDAD INTELIGENTE.'));
   await assert.rejects(()=>assertFunctionalCopy(page),/accessibility tree/);
   await page.locator('#sabik-submit').evaluate(n=>n.removeAttribute('aria-label'));
   await assertFunctionalCopy(page);
  });
  await check('R25 functional search, pause and resume work without any B3 images',async()=>{
   await page.route('**/sabik/assets/web-r01/*.png',r=>r.abort());
   await fresh(1440,'light',false);
   assert.equal(await page.locator('#sabik-web-master').evaluate(i=>i.naturalWidth),0);
   await page.getByRole('textbox',{name:'¿Qué necesitas?',exact:true}).fill('Qué es el autismo');
   await page.getByRole('button',{name:'Enviar',exact:true}).click();
   await page.waitForFunction(()=>!document.querySelector('#sabik-output').hidden && document.querySelector('#sabik-output').getAttribute('aria-busy')==='false');
   const answer=await page.locator('#sabik-answer').textContent();assert(answer.length>0);
   await page.getByRole('button',{name:'Pausar Sabik',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('#sabik-state-label').textContent==='En pausa');
   assert.equal(await page.locator('#sabik-state-label').textContent(),'En pausa');
   assert.equal(await page.locator('#sabik-answer').textContent(),answer);
   await page.getByRole('button',{name:'Reanudar',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('#sabik-state-label').textContent==='Disponible');
   assert.equal(await page.locator('#sabik-state-label').textContent(),'Disponible');
   await assertFunctionalCopy(page);
   await page.unroute('**/sabik/assets/web-r01/*.png');
  });
  await check('only local data is requested; no cloud or voice invocation',async()=>{
   assert(!external.some(u=>/api|anthropic|openai|speech|voice/i.test(new URL(u).hostname)));return {blockedExternalHosts:[...new Set(external.map(u=>new URL(u).hostname))]};
  });
 } finally {await browser.close();server.close();}
 if(out)fs.writeFileSync(path.join(out,'b3-results.json'),JSON.stringify({root,results},null,2));
 console.log(JSON.stringify({pass:results.filter(r=>r.pass).length,total:results.length,fail:results.filter(r=>!r.pass)}));
 if(results.some(r=>!r.pass))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
