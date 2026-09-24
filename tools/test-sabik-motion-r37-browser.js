const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const repo=path.resolve(__dirname,'..'), root=path.resolve(process.env.R37_WEB_ROOT||path.join(repo,'dist'));
const out=path.resolve(process.env.R37_EVIDENCE_DIR||path.join(repo,'../evidence'));
assert(!out.startsWith(repo+path.sep));fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const policy=fs.readFileSync(path.join(root,'_headers'),'utf8').match(/Content-Security-Policy:\s*([^\r\n]+)/)[1];
const server=http.createServer((req,res)=>{
 let p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');
 if(!fs.existsSync(p)){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',mime[path.extname(p)]||'application/octet-stream');res.setHeader('Content-Security-Policy',policy);fs.createReadStream(p).pipe(res);
});
const states=['presente','orientar','transicion','pausa','confirmar'], levels=['NORMAL','REDUCIDO','SIN_MOVIMIENTO'];
const results=[], errors=[], blocked=[];
async function check(name,fn){try{const evidence=await fn();results.push({name,pass:true,evidence});console.log('PASS '+name);}catch(e){results.push({name,pass:false,error:e.message});console.log('FAIL '+name+': '+e.message);}}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin=process.env.R37_LIVE_URL||'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>{
    const u=new URL(r.request().url());
    if(u.origin===origin&&!/^\/(api|\.netlify\/functions)\//.test(u.pathname)&&r.request().method()==='GET')return r.continue();
    blocked.push(u.origin+u.pathname);return r.abort();
  });
  async function fresh(width=1440,route='/'){
    await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});
    await page.goto(origin+route);await page.locator('#sabik-submit:enabled').waitFor();
    await page.locator('#sabik-web-master').evaluate(i=>i.decode());
    await page.waitForFunction(()=>document.querySelector('#sabik-hologram').dataset.webAsset==='PRESENTE');
  }
  async function set(state,level='NORMAL',hold=true){return page.evaluate(({state,level,hold})=>window.setSabikState(state,{motionLevel:level,hold}),{state,level,hold});}
  for(const width of [1440,768,390,320]) await check('Mounted layout '+width,async()=>{
    await fresh(width);
    assert.equal(await page.locator('.sabik-panel').count(),1);
    assert.equal(await page.locator('#sabik-hologram').getAttribute('aria-hidden'),'true');
    const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,active:document.querySelector('#sabik-hologram').getAnimations({subtree:true}).length}));
    assert(geometry.scroll<=geometry.width);assert.equal(geometry.active,0);
    await page.locator('.sabik-panel').screenshot({path:path.join(out,'panel-'+width+'.png')});return geometry;
  });
  await check('Five states, NORMAL/REDUCIDO/SIN_MOVIMIENTO frame evidence',async()=>{
    await fresh();
    for(const level of levels)for(const state of states){
      await set('presente','SIN_MOVIMIENTO');
      await page.evaluate(({state,level})=>{window.setSabikState(state,{motionLevel:level,hold:true});},{state,level});
      await page.waitForFunction(s=>document.querySelector('#sabik-hologram').dataset.webAsset===s.toUpperCase(),state);
      for(const fraction of [0,.4,.9]){
        await page.locator('#sabik-web-master').evaluate((image,f)=>{const a=image.getAnimations()[0];if(a){a.pause();a.currentTime=a.effect.getTiming().duration*f;}},fraction);
        const stats=await page.locator('#sabik-web-master').evaluate(i=>({active:i.getAnimations().length,opacity:getComputedStyle(i).opacity,iterations:i.getAnimations()[0]?.effect.getTiming().iterations}));
        assert(stats.active<=1);assert.equal(stats.opacity,'1');if(stats.active)assert.equal(stats.iterations,1);
        if(level==='SIN_MOVIMIENTO'||state==='presente')assert.equal(stats.active,0);
        await page.locator('.sabik-web-presentation').screenshot({path:path.join(out,`${level}-${state}-${Math.round(fraction*100)}.png`)});
      }
      await page.locator('#sabik-web-master').evaluate(i=>i.getAnimations().forEach(a=>a.finish()));
      await page.waitForFunction(()=>!window.SabikWebPresentation.snapshot().active);
    }
    return {states:5,levels:3,frames:45};
  });
  await check('Browser 5 x 5 transition matrix',async()=>{
    for(const from of states)for(const to of states){
      await set(from,'SIN_MOVIMIENTO');await set(to);
      assert.equal(await page.locator('#sabik-hologram').getAttribute('data-web-asset'),to.toUpperCase());
      assert.equal(await page.locator('#sabik-hologram').evaluate(n=>n.getAnimations({subtree:true}).length),0);
    }
    return {pairs:25};
  });
  await check('Interrupt confirmation without stale return or focus change',async()=>{
    await set('presente','SIN_MOVIMIENTO');await page.locator('#sabik-input').focus();
    await page.evaluate(()=>{window.setSabikState('confirmar');});
    await page.waitForFunction(()=>window.SabikWebPresentation.snapshot().active);
    await set('pausa');
    await page.waitForTimeout(550);
    assert.equal(await page.locator('#sabik-hologram').getAttribute('data-web-state'),'PAUSA');
    assert.equal(await page.locator('#sabik-input').evaluate(n=>n===document.activeElement),true);
    await set('confirmar','NORMAL',false);
    assert.equal(await page.locator('#sabik-hologram').getAttribute('data-web-state'),'PRESENTE');
  });
  await check('System preference dominates NORMAL; manual off is static and preserves state',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});await set('orientar','NORMAL');
    const expected=await page.evaluate(()=>document.documentElement.dataset.igMotion==='off'?'SIN_MOVIMIENTO':'REDUCIDO');
    assert.equal(await page.locator('#sabik-hologram').getAttribute('data-motion-level'),expected);
    await page.selectOption('#sabik-motion-level','SIN_MOVIMIENTO');
    await page.waitForFunction(()=>document.querySelector('#sabik-hologram').dataset.motionLevel==='SIN_MOVIMIENTO');
    await page.evaluate(()=>window.SabikWebPresentation.render({interaction:'pausa'}));
    assert.match(await page.locator('#sabik-web-master').getAttribute('src'),/web_pausa\.png$/);
    assert.equal(await page.locator('#sabik-hologram').evaluate(n=>n.getAnimations({subtree:true}).length),0);
  });
  await check('Small visual contexts 64, 40, 32 px preserve masters',async()=>{
    await fresh();
    for(const size of [64,40,32]){
      await page.locator('#sabik-hologram').evaluate((n,s)=>{n.style.width=s+'px';n.style.padding='0';},size);
      for(const state of states){await set(state);assert.equal(await page.locator('#sabik-web-master').evaluate(i=>Math.round(i.getBoundingClientRect().width)),size);}
      await page.locator('#sabik-hologram').screenshot({path:path.join(out,'visual-'+size+'.png')});
    }
  });
  await check('Functional projection and keyboard on mounted page',async()=>{
    await fresh(320);
    await page.locator('#sabik-input').fill('Qué es el autismo');await page.locator('#sabik-input').press('Control+Enter');
    await page.waitForFunction(()=>!document.querySelector('#sabik-output').hidden&&document.querySelector('#sabik-output').getAttribute('aria-busy')==='false');
    assert.equal(await page.locator('#sabik-hologram').getAttribute('data-web-state'),'PRESENTE');
    const answer=await page.locator('#sabik-answer').innerText();assert(answer.length>20);
    await page.locator('#sabik-not-this').click();
    await page.waitForFunction(()=>document.querySelector('#sabik-hologram').dataset.webState==='ORIENTAR');
    assert((await page.locator('#sabik-status-text').innerText()).includes('corrección'));
    await page.locator('#sabik-clear').click();await page.locator('#sabik-resume:visible').waitFor();
    assert.equal(await page.locator('#sabik-state-label').innerText(),'En pausa');
    await page.locator('#sabik-resume').click();await page.locator('#sabik-submit:enabled').waitFor();
    await page.waitForFunction(()=>document.querySelector('#sabik-hologram').dataset.webState==='PRESENTE');
    await page.locator('#sabik-input').focus();await page.keyboard.press('Escape');
    await page.waitForFunction(()=>document.querySelector('#sabik-toggle').getAttribute('aria-expanded')==='false');
    assert.equal(await page.locator('#sabik-toggle').evaluate(n=>n===document.activeElement),true);
    await page.locator('#sabik-toggle').press('Enter');
    await page.waitForFunction(()=>document.querySelector('#sabik-toggle').getAttribute('aria-expanded')==='true');
    assert.equal(await page.locator('#sabik-toggle').evaluate(n=>n===document.activeElement),true);
  });
  await check('Dedicated mount and no voice/provider/browser error',async()=>{
    await fresh(768,'/es/nea/');assert.equal(await page.locator('#sabik-motion-level').count(),1);
    assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);
  });
 }finally{await browser.close();server.close();}
 const report={origin,status:results.every(r=>r.pass)?'PASS':'FAIL',results,errors,blocked};
 fs.writeFileSync(path.join(out,'BROWSER_QA.json'),JSON.stringify(report,null,2)+'\n');
 if(report.status!=='PASS')process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
