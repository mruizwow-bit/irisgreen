/* QA-only comparison. No change to original raster bytes or production routes. */
const fs=require('node:fs'), path=require('node:path'), http=require('node:http'), assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=process.env.R25_EVIDENCE_DIR && path.resolve(process.env.R25_EVIDENCE_DIR);
if(!out || out===root || out.startsWith(root+path.sep)) throw Error('Set R25_EVIDENCE_DIR outside the repository');
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
function lum(c){return c.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);}
function contrast(a,b){const [x,y]=[lum(a),lum(b)].sort((a,b)=>b-a);return (x+.05)/(y+.05);}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'chrome',headless:true});
 const results=[];
 try {
  const page=await browser.newPage();await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  for(const width of [1600,430,390,320]) for(const background of ['night','white','soft']){
   await page.setViewportSize({width,height:1000});
   await page.goto('http://127.0.0.1:'+server.address().port+'/qa/sabik-web-r25/index.html');
   await page.locator(`input[value="${background}"]`).check();
   await page.locator('.visual img').evaluateAll(nodes=>Promise.all(nodes.map(i=>i.decode())));
   const evidence=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,states:[...document.querySelectorAll('article')].map(card=>{
    const box=card.querySelector('.visual'),img=box.querySelector('img'),sample=card.querySelector('.sample');
    return {state:card.dataset.state,box:box.getBoundingClientRect().toJSON(),image:img.getBoundingClientRect().toJSON(),natural:[img.naturalWidth,img.naturalHeight],filter:getComputedStyle(img).filter,opacity:getComputedStyle(img).opacity,fit:getComputedStyle(img).objectFit,animations:img.getAnimations().length,
     background:getComputedStyle(sample).backgroundColor,texts:[...card.querySelectorAll('.copy,.secondary')].map(n=>({color:getComputedStyle(n).color,text:n.textContent}))};})}));
   assert(!evidence.overflow);
   assert.deepEqual(evidence.states.map(s=>s.state),['PRESENTE','ORIENTAR','TRANSICION','PAUSA','CONFIRMAR']);
   for(const s of evidence.states){
    assert.deepEqual(s.natural,[544,544]);assert.equal(s.filter,'none');assert.equal(s.opacity,'1');assert.equal(s.fit,'contain');assert.equal(s.animations,0);
    s.safeArea=Math.min(s.image.left-s.box.left,s.box.right-s.image.right,s.image.top-s.box.top,s.box.bottom-s.image.bottom);
    assert(s.safeArea>=23.9);assert(Math.abs(s.image.width-s.image.height)<.1);
    for(const t of s.texts){t.contrast=contrast(t.color,s.background);assert(t.contrast>=4.5);}
   }
   await page.screenshot({path:path.join(out,`harness-${width}-${background}.png`),fullPage:true});
   results.push({width,background,...evidence});console.log(`PASS ${width} ${background} (5 states)`);
  }
  fs.writeFileSync(path.join(out,'harness-results.json'),JSON.stringify({browser:browser.version(),results},null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
