/* W1-A3-A02 lateral layout acceptance: A02-L01..A02-L20.
   Usage: NODE_PATH=<playwright> A02_EVIDENCE_DIR=/tmp/a02 node tools/test-sabik-a02-lateral.js
   Optional A02_WEB_ROOT points at dist. Evidence must remain outside the repository. */
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');

const repo=path.resolve(__dirname,'..');
const root=path.resolve(process.env.A02_WEB_ROOT||repo);
const evidence=process.env.A02_EVIDENCE_DIR&&path.resolve(process.env.A02_EVIDENCE_DIR);
if(evidence){
  if(evidence===repo||evidence.startsWith(repo+path.sep))throw Error('Evidence must stay outside repository');
  fs.mkdirSync(evidence,{recursive:true});
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
const headersPath=path.join(root,'_headers');
const policy=fs.existsSync(headersPath)?(fs.readFileSync(headersPath,'utf8').match(/Content-Security-Policy:\s*([^\r\n]+)/)||[])[1]:null;
const server=http.createServer((req,res)=>{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  if(policy)res.setHeader('Content-Security-Policy',policy);
  fs.createReadStream(file).pipe(res);
});

let browser,context,page,origin;
const results=[];
const round=n=>Math.round(n*100)/100;
const rect=async sel=>page.locator(sel).boundingBox();

async function fresh(width,height=900,options={}){
  if(context)await context.close();
  context=await browser.newContext({viewport:{width,height},reducedMotion:options.reducedMotion||'no-preference'});
  page=await context.newPage();
  await page.goto(origin+'/es/nea/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.sabik-panel')?.dataset.operation==='ready');
  await page.waitForFunction(()=>!document.querySelector('#sabik-toggle')?.disabled);
}
async function shot(name){
  if(!evidence)return;
  await page.screenshot({path:path.join(evidence,name+'.png'),fullPage:true});
}
async function noHorizontalOverflow(label){
  const v=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  assert.ok(v.scroll<=v.client+1,label+' horizontal overflow '+JSON.stringify(v));
}
async function check(id,name,fn){
  try{
    const detail=await fn();
    results.push({id,name,pass:true,detail:detail??null});
    console.log('PASS '+id+' '+name+(detail?' · '+JSON.stringify(detail):''));
  }catch(error){
    results.push({id,name,pass:false,detail:error.message});
    console.error('FAIL '+id+' '+name+' · '+error.message);
  }
}
async function geometry(width,height=900){
  await fresh(width,height);
  const home=await rect('#home-view');
  const hero=await rect('#home-view>.hero');
  const panel=await rect('#home-view>.sabik-panel');
  return {home,hero,panel,gap:round(panel.x-(hero.x+hero.width))};
}
async function collapse(){
  const toggle=page.locator('#sabik-toggle');
  if(await toggle.getAttribute('aria-expanded')==='true')await toggle.click();
  await page.waitForFunction(()=>document.querySelector('#sabik-toggle')?.getAttribute('aria-expanded')==='false');
}
async function expand(){
  const toggle=page.locator('#sabik-toggle');
  if(await toggle.getAttribute('aria-expanded')==='false')await toggle.click();
  await page.waitForFunction(()=>document.querySelector('#sabik-toggle')?.getAttribute('aria-expanded')==='true');
}
async function makeLongResponse(){
  await page.evaluate(()=>{
    const output=document.querySelector('#sabik-output');
    const answer=document.querySelector('#sabik-answer');
    output.hidden=false;
    answer.textContent=('Respuesta extensa de prueba para comprobar el scroll interno de Sabik sin cambiar el producto. ').repeat(80);
  });
}
async function showResults(){
  await page.evaluate(()=>{
    const results=document.querySelector('#results');
    results.hidden=false;
    const list=document.querySelector('#result-list');
    if(!list.children.length)list.innerHTML='<li><a class="result-link" href="/es/situaciones/"><strong>Resultado de prueba</strong></a></li>';
  });
}
async function stacked(){
  const cs=await page.locator('#home-view').evaluate(n=>getComputedStyle(n).display);
  const hero=await rect('#home-view>.hero'),panel=await rect('#home-view>.sabik-panel');
  return cs!=='grid'&&panel.y>=hero.y+hero.height-1;
}

(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  origin='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    await check('A02-L01','1920 lateral: HOME 1180 / gap 32 / rail 520',async()=>{
      const g=await geometry(1920);
      assert.equal(round(g.home.width),1732);
      assert.equal(round(g.hero.width),1180);
      assert.equal(round(g.panel.width),520);
      assert.equal(g.gap,32);
      await shot('A02-1920-open');
      return {home:round(g.home.width),homeColumn:round(g.hero.width),gap:g.gap,rail:round(g.panel.width)};
    });

    await check('A02-L02','1440 lateral: HOME 912 / gap 24 / rail 440',async()=>{
      const g=await geometry(1440);
      assert.equal(round(g.home.width),1376);
      assert.equal(round(g.hero.width),912);
      assert.equal(round(g.panel.width),440);
      assert.equal(g.gap,24);
      await shot('A02-1440-open');
      return {home:round(g.home.width),homeColumn:round(g.hero.width),gap:g.gap,rail:round(g.panel.width)};
    });

    await check('A02-L03','768 stacked after search and before results/cards',async()=>{
      await fresh(768);
      assert.equal(await stacked(),true);
      const panel=await rect('.sabik-panel');
      assert.equal(round(panel.width),712);
      await shot('A02-768-stacked');
      return {panelWidth:round(panel.width)};
    });

    await check('A02-L04','390 stacked width 354 without horizontal scroll',async()=>{
      await fresh(390);
      assert.equal(await stacked(),true);
      const panel=await rect('.sabik-panel');
      assert.equal(round(panel.width),354);
      await noHorizontalOverflow('390');
      await shot('A02-390-stacked');
      return {panelWidth:round(panel.width)};
    });

    await check('A02-L05','320 stacked width 292 without horizontal scroll',async()=>{
      await fresh(320);
      assert.equal(await stacked(),true);
      const panel=await rect('.sabik-panel');
      assert.equal(round(panel.width),292);
      await noHorizontalOverflow('320');
      await shot('A02-320-stacked');
      return {panelWidth:round(panel.width)};
    });

    await check('A02-L06','panel height does not push cards down on desktop',async()=>{
      await fresh(1440);
      const before=(await rect('#secciones')).y;
      await makeLongResponse();
      const after=(await rect('#secciones')).y;
      assert.ok(Math.abs(before-after)<1,'directory moved '+before+' -> '+after);
      await shot('A02-1440-long-response');
      return {directoryYBefore:round(before),directoryYAfter:round(after)};
    });

    await check('A02-L07','DOM remains search -> Sabik -> results/cards at all widths',async()=>{
      await fresh(1440);
      const ok=await page.evaluate(()=>{
        const search=document.querySelector('.search-block'),panel=document.querySelector('.sabik-panel'),results=document.querySelector('#results'),cards=document.querySelector('#secciones');
        const before=(a,b)=>Boolean(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);
        return before(search,panel)&&before(panel,results)&&before(panel,cards);
      });
      assert.equal(ok,true);
      return {sourceOrder:true};
    });

    await check('A02-L08','Tab follows source order without positive tabindex',async()=>{
      await fresh(1440);
      assert.equal(await page.locator('[tabindex]').evaluateAll(ns=>ns.every(n=>Number(n.getAttribute('tabindex'))<=0)),true);
      const lastExample=page.locator('.example').last();
      await lastExample.focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.id),'sabik-toggle');
      await collapse();
      await page.locator('#sabik-toggle').focus();
      await page.keyboard.press('Tab');
      const next=await page.evaluate(()=>({id:document.activeElement.id,section:document.activeElement.closest('#results,#secciones')?.id||null}));
      assert.ok(next.section==='secciones'||next.section==='results','focus did not continue to conventional content: '+JSON.stringify(next));
      return next;
    });

    await check('A02-L09','collapse and Escape return/keep focus on toggle',async()=>{
      await fresh(1440);
      await page.locator('#sabik-toggle').focus();
      await collapse();
      assert.equal(await page.evaluate(()=>document.activeElement.id),'sabik-toggle');

      await fresh(1440);
      await page.locator('#sabik-input').focus();
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>document.querySelector('#sabik-toggle')?.getAttribute('aria-expanded')==='false',{timeout:5000});
      assert.equal(await page.evaluate(()=>document.activeElement.id),'sabik-toggle');
      return {collapseFocus:'sabik-toggle',escapeFocus:'sabik-toggle'};
    });

    await check('A02-L10','collapse does not change HOME column width',async()=>{
      await fresh(1440);
      const before=await rect('#home-view>.hero');
      await collapse();
      const after=await rect('#home-view>.hero');
      assert.ok(Math.abs(before.width-after.width)<1);
      const panel=await rect('.sabik-panel');
      assert.equal(round(panel.width),440);
      await shot('A02-1440-collapsed');
      return {homeBefore:round(before.width),homeAfter:round(after.width),rail:round(panel.width)};
    });

    await check('A02-L11','sticky only >=1360, height >=700 and ordinary text',async()=>{
      await fresh(1440,900);
      assert.equal(await page.locator('.sabik-panel').evaluate(n=>getComputedStyle(n).position),'sticky');
      await fresh(1440,650);
      assert.equal(await page.locator('.sabik-panel').evaluate(n=>getComputedStyle(n).position),'static');
      await fresh(1440,900);
      await page.evaluate(()=>document.documentElement.setAttribute('data-ig-text-enlarged',''));
      assert.equal(await page.locator('.sabik-panel').evaluate(n=>getComputedStyle(n).position),'static');
      assert.equal(await stacked(),true);
      return {wideTall:'sticky',short:'static',enlarged:'static'};
    });

    await check('A02-L12','only panel body scrolls internally when height requires it',async()=>{
      await fresh(1440,700);
      await makeLongResponse();
      const beforeHead=await rect('.sabik-widget-head');
      const info=await page.locator('#sabik-widget-body').evaluate(n=>({scrollHeight:n.scrollHeight,clientHeight:n.clientHeight,overflow:getComputedStyle(n).overflowY}));
      assert.ok(info.scrollHeight>info.clientHeight,'body did not need internal scroll');
      assert.ok(['auto','scroll'].includes(info.overflow));
      await page.locator('#sabik-widget-body').evaluate(n=>n.scrollTop=n.scrollHeight);
      const afterHead=await rect('.sabik-widget-head');
      assert.ok(Math.abs(beforeHead.y-afterHead.y)<1,'header moved with internal body scroll');
      return {scrollHeight:info.scrollHeight,clientHeight:info.clientHeight,headerStable:true};
    });

    await check('A02-L13','200% Iris text control stacks and disables internal/sticky scroll',async()=>{
      await fresh(1440,900);
      await page.evaluate(()=>window.IGPreferences?.update({scale:2}));
      await page.waitForFunction(()=>document.documentElement.hasAttribute('data-ig-text-enlarged'));
      assert.equal(await stacked(),true);
      assert.equal(await page.locator('.sabik-panel').evaluate(n=>getComputedStyle(n).position),'static');
      assert.equal(await page.locator('#sabik-widget-body').evaluate(n=>getComputedStyle(n).overflowY),'visible');
      await noHorizontalOverflow('Iris 200%');
      await shot('A02-200-iris');
      return {stacked:true};
    });

    await check('A02-L14','native 200% zoom geometry and 400%/320 CSS px reflow stack safely',async()=>{
      await fresh(1440,900);
      const cdp=await context.newCDPSession(page);
      await cdp.send('Emulation.setDeviceMetricsOverride',{width:720,height:450,deviceScaleFactor:1,mobile:false,screenWidth:1440,screenHeight:900});
      await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:2});
      assert.ok((await page.evaluate(()=>innerWidth))<=720);
      assert.equal(await stacked(),true);
      await noHorizontalOverflow('native 200% zoom geometry');
      await shot('A02-200-native-zoom');
      await context.close(); context=null; page=null;
      await fresh(320,225);
      assert.equal(await stacked(),true);
      await noHorizontalOverflow('400% / 320 CSS px');
      assert.equal(await page.locator('#sabik-input').isVisible(),true);
      await shot('A02-400-320css');
      return {native200EffectiveCssWidth:720,zoom400CssWidth:320};
    });

    await check('A02-L15','prefers-reduced-motion removes layout transitions',async()=>{
      await fresh(1440,900,{reducedMotion:'reduce'});
      const data=await page.locator('.sabik-panel').evaluate(n=>({transition:getComputedStyle(n).transitionDuration,home:getComputedStyle(document.querySelector('#home-view')).transitionDuration}));
      assert.ok(data.transition.split(',').every(v=>parseFloat(v)===0));
      assert.ok(data.home.split(',').every(v=>parseFloat(v)===0));
      return data;
    });

    await check('A02-L16','panel does not overlap header, results/cards or footer',async()=>{
      await fresh(1440,900);
      await showResults();
      const panel=await rect('.sabik-panel'),header=await rect('.site-header'),results=await rect('#results'),cards=await rect('#secciones'),footer=await rect('.site-footer');
      const horizontalOverlap=(a,b)=>Math.min(a.x+a.width,b.x+b.width)>Math.max(a.x,b.x);
      assert.ok(panel.y>=header.y+header.height-1,'panel overlaps header');
      assert.equal(horizontalOverlap(panel,results),false);
      assert.equal(horizontalOverlap(panel,cards),false);
      await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
      await page.waitForTimeout(80);
      const p2=await rect('.sabik-panel'),f2=await rect('.site-footer');
      assert.ok(p2.y+p2.height<=f2.y+1,'sticky panel overlaps footer');
      await shot('A02-1440-results');
      return {headerClear:true,resultsClear:true,cardsClear:true,footerClear:true};
    });

    await check('A02-L17','collapsed body controls leave tab order',async()=>{
      await fresh(1440);
      await collapse();
      assert.equal(await page.locator('#sabik-widget-body').isHidden(),true);
      const tabbable=await page.locator('#sabik-widget-body button,#sabik-widget-body textarea,#sabik-widget-body a[href],[tabindex]').evaluateAll(ns=>ns.filter(n=>{
        const cs=getComputedStyle(n); return cs.display!=='none'&&cs.visibility!=='hidden'&&!n.disabled&&n.tabIndex>=0&&n.getClientRects().length;
      }).length);
      assert.equal(tabbable,0);
      return {tabbableInsideCollapsed:0};
    });

    await check('A02-L18','HOME card design/breakpoints remain conventional',async()=>{
      await fresh(1440);
      assert.equal(await page.locator('#featured').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),3);
      await fresh(390);
      assert.equal(await page.locator('#featured').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),1);
      return {desktopColumns:3,mobileColumns:1};
    });

    await check('A02-L19','aside stays inside main and is not moved after main',async()=>{
      await fresh(1440);
      const info=await page.evaluate(()=>{
        const main=document.querySelector('main#main'),panel=document.querySelector('.sabik-panel'),home=document.querySelector('#home-view');
        return {insideMain:main.contains(panel),directHomeChild:panel.parentElement===home,mainContainsHome:main.contains(home)};
      });
      assert.deepEqual(info,{insideMain:true,directHomeChild:true,mainContainsHome:true});
      return info;
    });

    await check('A02-L20','S1 semantic hooks remain present for regression suite',async()=>{
      await fresh(1440);
      const info=await page.evaluate(()=>({
        main:!!document.querySelector('main#main'),
        complementary:document.querySelector('.sabik-panel')?.tagName==='ASIDE',
        toggleControls:document.querySelector('#sabik-toggle')?.getAttribute('aria-controls'),
        live:document.querySelector('#sabik-announcement')?.getAttribute('aria-live'),
        form:!!document.querySelector('#sabik-form')
      }));
      assert.equal(info.main,true);assert.equal(info.complementary,true);assert.equal(info.toggleControls,'sabik-widget-body');assert.equal(info.live,'polite');assert.equal(info.form,true);
      return info;
    });

    if(evidence)fs.writeFileSync(path.join(evidence,'A02-L01-L20.json'),JSON.stringify({root,results},null,2));
    const failed=results.filter(r=>!r.pass);
    console.log(JSON.stringify({pass:results.length-failed.length,fail:failed.length,total:results.length,failed:failed.map(r=>r.id)}));
    if(failed.length)process.exitCode=1;
  }finally{
    if(context)await context.close();
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
