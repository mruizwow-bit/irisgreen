/* Compare only surfaces computed from the real Iris page. QA styles stay in this runner. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');const {backgroundContrast}=require('./sabik-background-contrast');
const repo=path.resolve(__dirname,'..'),root=path.resolve(process.env.R25B_WEB_ROOT||repo);
const out=process.env.R25B_EVIDENCE_DIR&&path.resolve(process.env.R25B_EVIDENCE_DIR);
if(!out||out===repo||out.startsWith(repo+path.sep))throw Error('Set R25B_EVIDENCE_DIR outside the repository');
const captures=path.join(out,'capturas');fs.mkdirSync(captures,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 const url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const base=url.startsWith('/capturas/')?out:url.startsWith('/qa/')?repo:root;
 let file=path.resolve(base,'.'+url);if(!file.startsWith(base+path.sep)){res.writeHead(403).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
const states={presente:'espera',orientar:'respuesta',transicion:'procesando',pausa:'pausa',confirmar:'confirmacion'};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
 try{
  const page=await browser.newPage();await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const origin='http://127.0.0.1:'+server.address().port;
  if(!process.env.R25B_BOARDS_ONLY)for(const width of [1440,430,390,320])for(const surface of ['A','B','C']){
   await page.setViewportSize({width,height:1000});await page.emulateMedia({colorScheme:'light',reducedMotion:'no-preference'});
   await page.goto(origin+'/es/nea/');await page.locator('#sabik-submit:enabled').waitFor();
   const context=await page.evaluate(()=>{const p=s=>getComputedStyle(document.querySelector(s));return{body:{color:p('body').backgroundColor,image:p('body').backgroundImage},card:p('.small-card').backgroundColor,inherited:p('#home-view').backgroundColor,white:p(':root').getPropertyValue('--surface').trim()};});
   assert.equal(context.card,'rgba(255, 255, 255, 0.8)');assert.equal(context.inherited,'rgba(0, 0, 0, 0)');assert.equal(context.white,'#fff');
   const background={A:context.inherited,B:context.card,C:context.white}[surface];
   if(surface!=='A')await page.addStyleTag({content:`body.sabik-iris-page #home-view > .sabik-panel { background: ${background}; }`});
   const texts=[];for(const selector of ['#sabik-status-text','.sabik-capability','#sabik-state-label','#sabik-input-help']){
    const measure=await backgroundContrast(page,selector);assert(measure.minContrast>=4.5,JSON.stringify(measure));texts.push(measure);
   }
   for(const [state,interaction] of Object.entries(states)){
    await page.evaluate(interaction=>window.SabikWebPresentation.render({interaction,protection:'normal',lowIntensity:false}),interaction);
    await page.waitForFunction(s=>document.querySelector('#sabik-hologram').dataset.webAsset===s,state.toUpperCase());
    await page.locator('#sabik-web-master').evaluate(i=>i.decode());await page.evaluate(()=>scrollTo(0,0));
    const v=await page.evaluate(()=>{const e=s=>document.querySelector(s),r=s=>e(s).getBoundingClientRect().toJSON(),c=s=>getComputedStyle(e(s));return{overflow:document.documentElement.scrollWidth>innerWidth,box:r('#sabik-hologram'),image:r('#sabik-web-master'),background:{color:c('.sabik-panel').backgroundColor,image:c('.sabik-panel').backgroundImage},master:{filter:c('#sabik-web-master').filter,opacity:c('#sabik-web-master').opacity,fit:c('#sabik-web-master').objectFit,background:c('#sabik-hologram').backgroundColor,animation:e('#sabik-hologram').getAnimations({subtree:true}).length},wordmarkFilter:c('.sabik-wordmark').filter};});
    assert(!v.overflow);assert.equal(v.master.filter,'none');assert.equal(v.master.opacity,'1');assert.equal(v.master.fit,'contain');assert.equal(v.master.animation,0);assert.equal(v.master.background,'rgba(0, 0, 0, 0)');assert.equal(v.wordmarkFilter,'none');
    v.safeArea=Math.min(v.image.left-v.box.left,v.box.right-v.image.right,v.image.top-v.box.top,v.box.bottom-v.image.bottom);assert(v.safeArea>=23.9);
    assert.doesNotMatch(await page.locator('.sabik-panel').innerText(),/CLARIDAD INTELIGENTE|Una IA que adapta|PRESENTE|TRANSICIÓN|ORIENTAR|CONFIRMAR/);
    await page.screenshot({path:path.join(captures,`page-${width}-${surface}-${state}.png`),fullPage:true});
    await page.locator('.sabik-panel').screenshot({path:path.join(captures,`panel-${width}-${surface}-${state}.png`)});
    results.push({width,surface,state,context,texts,...v});
   }
   console.log(`PASS ${width} ${surface}: five exact masters; actual Iris background, contrast and layout`);
  }
  // Assemble side-by-side evidence in HTML; all raster assets above are browser captures.
  await page.setViewportSize({width:1440,height:1000});await page.goto(origin+'/qa/sabik-web-r25b/');
  for(const width of [1440,430,390,320])for(const state of Object.keys(states))for(const view of ['panel','page']){
   await page.locator('#width').selectOption(String(width));await page.locator('#state').selectOption(state);await page.locator('#view').selectOption(view);
   await page.locator('figure img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
   await page.screenshot({path:path.join(captures,`comparativa-${view}-${width}-${state}.png`),fullPage:true});
  }
  if(!process.env.R25B_BOARDS_ONLY)fs.writeFileSync(path.join(out,'background-results.json'),JSON.stringify({root,browser:browser.version(),results},null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
