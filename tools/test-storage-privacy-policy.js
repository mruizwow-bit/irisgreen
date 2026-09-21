/* W03 storage/privacy policy acceptance.
   Run on built dist:
   NODE_PATH=<playwright node_modules> W03_WEB_ROOT=dist W03_EVIDENCE_DIR=/tmp/w03 node tools/test-storage-privacy-policy.js
*/
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');

const repo=path.resolve(__dirname,'..');
const root=path.resolve(process.env.W03_WEB_ROOT||repo);
const evidence=process.env.W03_EVIDENCE_DIR?path.resolve(process.env.W03_EVIDENCE_DIR):null;
if(evidence){fs.mkdirSync(evidence,{recursive:true});}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

const results=[];
function ok(id,detail={}){results.push({id,pass:true,detail});console.log('PASS '+id+' '+JSON.stringify(detail));}
function fail(id,error){results.push({id,pass:false,error:String(error&&error.stack||error)});console.error('FAIL '+id+' '+String(error));}
async function run(id,fn){try{await fn();}catch(e){fail(id,e);}}
async function screenshot(page,name){if(evidence)await page.screenshot({path:path.join(evidence,name+'.png'),fullPage:true});}
async function externalOff(context,origin){
  await context.route('**/*',route=>{
    const u=route.request().url();
    if(u.startsWith(origin)||u.startsWith('data:')||u.startsWith('blob:'))route.continue();
    else route.abort();
  });
}

(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    await run('D1-language-migration-persistence-explicit',async()=>{
      let context=await browser.newContext();
      await externalOff(context,origin);
      let page=await context.newPage();
      await page.addInitScript(()=>{
        localStorage.removeItem('ig_lang');
        sessionStorage.setItem('ig-idioma','en');
      });
      await page.goto(origin+'/es/recursos/tarjeta-iris/',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.IG_IDIOMA&&document.querySelector('[data-ig-lang="en"]'));
      await page.waitForFunction(()=>localStorage.getItem('ig_lang')==='en');
      assert.equal(await page.evaluate(()=>sessionStorage.getItem('ig-idioma')),null);
      assert.equal(await page.locator('[data-ig-lang="en"]').getAttribute('aria-pressed'),'true');

      // Explicit EN remains the canonical preference.
      await page.locator('[data-ig-lang="en"]').click();
      assert.equal(await page.evaluate(()=>localStorage.getItem('ig_lang')),'en');
      const state=await context.storageState();
      await context.close();

      // New browser context restored from persisted storage: no sessionStorage survives.
      context=await browser.newContext({storageState:state});
      await externalOff(context,origin);
      page=await context.newPage();
      await page.goto(origin+'/es/recursos/tarjeta-iris/',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.IG_IDIOMA&&localStorage.getItem('ig_lang')==='en');
      assert.equal(await page.locator('[data-ig-lang="en"]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.evaluate(()=>sessionStorage.getItem('ig-idioma')),null);

      await page.locator('[data-ig-lang="es"]').click();
      await page.waitForFunction(()=>localStorage.getItem('ig_lang')==='es');
      assert.equal(await page.locator('[data-ig-lang="es"]').getAttribute('aria-pressed'),'true');
      ok('D1-language-migration-persistence-explicit',{canonical:'ig_lang',legacyRemoved:true,explicitWins:true});
      await context.close();
    });

    await run('D2-saved-videos',async()=>{
      const context=await browser.newContext({viewport:{width:1280,height:900}});
      await externalOff(context,origin);
      const page=await context.newPage();
      await page.goto(origin+'/es/videos/',{waitUntil:'domcontentloaded'});
      const save=page.getByRole('button',{name:'Guardar para luego'}).first();
      await save.waitFor();
      await save.click();
      await page.waitForFunction(()=>!!localStorage.getItem('ig_saved_videos'));
      const firstStored=await page.evaluate(()=>JSON.parse(localStorage.getItem('ig_saved_videos')||'[]'));
      assert.equal(firstStored.length,1);

      // Existing remove action remains functional; empty collection removes the key.
      await save.click();
      await page.waitForFunction(()=>localStorage.getItem('ig_saved_videos')===null);

      await save.click();
      const clear=page.getByRole('button',{name:'Borrar guardados'});
      await clear.waitFor();
      await screenshot(page,'w03-videos-saved-clear');
      await clear.focus();
      await clear.click();
      await page.waitForFunction(()=>localStorage.getItem('ig_saved_videos')===null);
      assert.match(await page.getByRole('status').filter({hasText:'Guardados borrados'}).innerText(),/Guardados borrados/);
      ok('D2-saved-videos',{save:true,remove:true,clearAction:true,physicalRemove:true});
      await context.close();
    });

    await run('D3-catalog-search-minimization',async()=>{
      const context=await browser.newContext({viewport:{width:1280,height:900}});
      await externalOff(context,origin);
      const page=await context.newPage();

      // Incoming q may initialise once, but the app must normalize it away.
      await page.goto(origin+'/es/neurodiversidad/condiciones/?q=autismo',{waitUntil:'domcontentloaded'});
      await page.locator('#q').waitFor();
      await page.waitForFunction(()=>!new URL(location.href).searchParams.has('q'));
      assert.equal(await page.locator('#q').inputValue(),'autismo');
      let saved=await page.evaluate(()=>sessionStorage.getItem('ig-conditions-url'));
      assert.ok(saved&&!saved.includes('q='),saved);

      // A non-text filter still persists.
      const filter=page.locator('#filtros button[data-type="apoyo"]');
      await filter.click();
      await page.waitForTimeout(100);
      saved=await page.evaluate(()=>sessionStorage.getItem('ig-conditions-url'));
      assert.ok(saved&&!saved.includes('q='),saved);
      assert.ok(saved.includes('tipo=')||saved.includes('letra='),saved);

      await page.locator('#q').fill('texto privado de prueba');
      await page.locator('#q').dispatchEvent('input');
      await page.waitForTimeout(100);
      assert.equal(new URL(page.url()).searchParams.has('q'),false);
      saved=await page.evaluate(()=>sessionStorage.getItem('ig-conditions-url'));
      assert.ok(saved&&!saved.includes('texto')&&!saved.includes('q='),saved);

      // Stored non-text state remains usable by detail-page back navigation.
      await page.goto(origin+'/es/neurodiversidad/condiciones/autismo/',{waitUntil:'domcontentloaded'});
      const back=page.locator('[data-ig-back-conditions]');
      await back.waitFor();
      const href=await back.getAttribute('href');
      assert.ok(href.startsWith('/es/neurodiversidad/condiciones/'));
      assert.equal(href.includes('q='),false);

      // Situations had no consumer: legacy value is cleaned and no new write occurs.
      await page.goto(origin+'/es/situaciones/',{waitUntil:'domcontentloaded'});
      await page.evaluate(()=>sessionStorage.setItem('ig-situations-url','/es/situaciones/?q=legacy'));
      const sq=page.locator('#situationsSearch');
      await sq.waitFor();
      await sq.fill('ruido');
      await sq.dispatchEvent('input');
      await page.waitForFunction(()=>sessionStorage.getItem('ig-situations-url')===null&&!new URL(location.href).searchParams.has('q'));
      assert.equal(await page.evaluate(()=>sessionStorage.getItem('ig-situations-url')),null);
      assert.equal(new URL(page.url()).searchParams.has('q'),false);

      const common=fs.readFileSync(path.join(root,'assets/interfaz-comun.js'),'utf8');
      assert.equal(common.includes("getItem('ig-situations-url')"),false);
      ok('D3-catalog-search-minimization',{qInStorage:false,qInGeneratedUrl:false,nonTextState:true,situationsDeadWriteRetired:true});
      await context.close();
    });

    await run('D4-tarjeta-session-reset',async()=>{
      const context=await browser.newContext({viewport:{width:1280,height:900},permissions:['clipboard-read','clipboard-write']});
      await externalOff(context,origin);
      const page=await context.newPage();
      await page.addInitScript(()=>{window.__w03Print=false;window.print=()=>{window.__w03Print=true;};});
      await page.goto(origin+'/es/recursos/tarjeta-iris/',{waitUntil:'domcontentloaded'});
      await page.locator('#ti-cuesta').waitFor();
      const token='TEXTO PERSONAL W03';
      await page.locator('#ti-cuesta').fill(token);
      await page.locator('#ti-cuesta').dispatchEvent('change');
      await page.waitForFunction(()=>sessionStorage.getItem('ig-tarjeta-iris')?.includes('TEXTO PERSONAL W03'));
      await page.reload({waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('#ti-cuesta').inputValue(),token);

      const reset=page.locator('#ti-reset');
      await reset.focus();
      await reset.click();
      assert.equal(await page.evaluate(()=>sessionStorage.getItem('ig-tarjeta-iris')),null);
      assert.notEqual(await page.locator('#ti-cuesta').inputValue(),token);
      await page.waitForTimeout(150);
      assert.equal(await page.evaluate(()=>sessionStorage.getItem('ig-tarjeta-iris')),null);
      assert.equal(await page.evaluate(()=>document.activeElement?.id),'ti-reset');
      assert.ok((await page.locator('#ti-editor-status').innerText()).trim().length>0);

      // New edit may create the session key again.
      await page.locator('#ti-cuesta').fill('nuevo');
      await page.locator('#ti-cuesta').dispatchEvent('change');
      await page.waitForFunction(()=>!!sessionStorage.getItem('ig-tarjeta-iris'));

      const copy=page.locator('#ti-copy');
      await copy.focus();
      await copy.click();
      await page.waitForFunction(()=>document.querySelector('#ti-card-status')?.textContent.trim().length>0);
      assert.equal(await page.evaluate(()=>document.activeElement?.id),'ti-copy');
      assert.ok((await page.locator('#ti-card-status').innerText()).trim().length>0);

      const print=page.locator('#ti-print');
      await print.focus();
      await print.click();
      await page.waitForTimeout(50);
      assert.equal(await page.evaluate(()=>window.__w03Print),true);
      assert.equal(await page.evaluate(()=>document.activeElement?.id),'ti-print');
      await screenshot(page,'w03-tarjeta-session-copy');
      ok('D4-tarjeta-session-reset',{sessionRestore:true,resetRemoves:true,noImmediateRecreate:true,copy:true,print:true});
      await context.close();
    });

    await run('D5-routines-session-only',async()=>{
      const context=await browser.newContext({viewport:{width:1280,height:900}});
      await externalOff(context,origin);
      const page=await context.newPage();
      await page.goto(origin+'/es/recursos/rutinas-visuales/',{waitUntil:'domcontentloaded'});
      await page.locator('[data-ready-format="screen"]').click();
      const readyDone=page.locator('#rv-ready-preview [data-done-key]').first();
      await readyDone.waitFor();
      await readyDone.click();
      const ready=await page.evaluate(()=>sessionStorage.getItem('ig-rutinas-hechos-ready'));
      assert.ok(ready&&ready.includes('ready-'));

      const token='PASO PERSONAL W03';
      await page.locator('#rv-text-only').fill(token);
      await page.locator('#rv-add-text').click();
      await page.locator('[data-builder-format="screen"]').click();
      const builderDone=page.locator('#rv-builder-preview [data-done-key]').first();
      await builderDone.waitFor();
      await builderDone.click();
      const builder=await page.evaluate(()=>sessionStorage.getItem('ig-rutinas-hechos-builder'));
      assert.ok(builder&&builder.includes('builder-'));
      assert.equal(builder.includes(token),false);
      assert.equal(ready.includes(token),false);

      await page.locator('#rv-reset').click();
      assert.equal(await page.evaluate(()=>sessionStorage.getItem('ig-rutinas-hechos-builder')),null);
      ok('D5-routines-session-only',{readySession:true,builderSession:true,personalTextStored:false,resetBuilder:true});
      await context.close();
    });

    await run('D6-central-delete-and-D7-privacy-copy',async()=>{
      const context=await browser.newContext({viewport:{width:1280,height:900}});
      await externalOff(context,origin);
      const page=await context.newPage();
      await page.goto(origin+'/es/privacidad/',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>window.IGStoragePrivacy&&window.IGPreferences);
      await page.evaluate(()=>{
        localStorage.setItem('ig-a11y','{"version":2,"scale":1.5}');
        localStorage.setItem('ig_lang','en');
        localStorage.setItem('ig_saved_videos','[{"name":"x"}]');
        sessionStorage.setItem('ig-conditions-url','/es/neurodiversidad/condiciones/?tipo=x');
        sessionStorage.setItem('ig-situations-url','legacy');
        sessionStorage.setItem('ig-idioma','en');
        sessionStorage.setItem('ig-rutinas-hechos-ready','["ready-0"]');
        sessionStorage.setItem('ig-rutinas-hechos-builder','["builder-0"]');
        sessionStorage.setItem('ig-tarjeta-iris','{"cuesta":"personal"}');
        localStorage.setItem('other-software-local','keep');
        sessionStorage.setItem('other-software-session','keep');
      });
      const button=page.getByRole('button',{name:'Borrar los datos guardados por Iris Green en este navegador'});
      await button.waitFor();
      await screenshot(page,'w03-privacy-central-delete-es');
      await button.click();
      const after=await page.evaluate(()=>({
        local:['ig-a11y','ig_lang','ig_saved_videos'].map(k=>[k,localStorage.getItem(k)]),
        session:['ig-conditions-url','ig-situations-url','ig-idioma','ig-rutinas-hechos-ready','ig-rutinas-hechos-builder','ig-tarjeta-iris'].map(k=>[k,sessionStorage.getItem(k)]),
        sentinelLocal:localStorage.getItem('other-software-local'),
        sentinelSession:sessionStorage.getItem('other-software-session'),
        scale:window.IGPreferences.get().scale
      }));
      assert.ok(after.local.every(([,v])=>v===null),JSON.stringify(after));
      assert.ok(after.session.every(([,v])=>v===null),JSON.stringify(after));
      assert.equal(after.sentinelLocal,'keep');
      assert.equal(after.sentinelSession,'keep');
      assert.equal(after.scale,1);
      assert.match(await page.locator('#ig-storage-clear-status').innerText(),/se han borrado/);

      const visible=(await page.locator('main').innerText());
      assert.match(visible,/idioma/i);
      assert.match(visible,/vídeos guardados/i);
      assert.match(visible,/Rutinas/i);
      assert.match(visible,/Tarjeta Iris/i);
      assert.match(visible,/perfiles/i);
      assert.match(visible,/publicidad/i);
      assert.doesNotMatch(visible,/ig[_-](?:a11y|lang|saved|conditions|situations|idioma|rutinas|tarjeta)/i);

      const privacyJs=fs.readFileSync(path.join(root,'assets/privacy-storage.js'),'utf8');
      assert.equal(/(?:localStorage|sessionStorage)\.clear\s*\(/.test(privacyJs),false);

      await page.goto(origin+'/en/privacy/',{waitUntil:'domcontentloaded'});
      const enText=await page.locator('main').innerText();
      assert.match(enText,/saved videos/i);
      assert.match(enText,/profiles/i);
      assert.match(enText,/advertising/i);
      assert.doesNotMatch(enText,/ig[_-](?:a11y|lang|saved|conditions|situations|idioma|rutinas|tarjeta)/i);

      ok('D6-central-delete-and-D7-privacy-copy',{declaredKeys:9,sentinelsPreserved:true,noClear:true,accessibleStatus:true,technicalKeysHidden:true});
      await context.close();
    });

    const failed=results.filter(r=>!r.pass);
    if(evidence)fs.writeFileSync(path.join(evidence,'w03-storage-policy-results.json'),JSON.stringify({root,results,summary:{pass:results.length-failed.length,fail:failed.length,total:results.length}},null,2));
    console.log(JSON.stringify({pass:results.length-failed.length,fail:failed.length,total:results.length,failed:failed.map(r=>r.id)}));
    if(failed.length)process.exitCode=1;
  }finally{
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
