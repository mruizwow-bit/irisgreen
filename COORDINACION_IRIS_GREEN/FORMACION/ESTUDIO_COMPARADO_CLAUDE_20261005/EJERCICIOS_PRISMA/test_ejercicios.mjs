import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";

const ROOT=process.cwd();
const BASE=path.join(ROOT,"COORDINACION_IRIS_GREEN","FORMACION","ESTUDIO_COMPARADO_CLAUDE_20261005","EJERCICIOS_PRISMA");
const browser=await chromium.launch(process.env.CHROME_EXECUTABLE?{headless:true,executablePath:process.env.CHROME_EXECUTABLE}:{headless:true});
const assert=(v,m)=>{if(!v) throw new Error(m)};
const result={spatial:{},catalog:{}};

// EX 01: exact projection/picking + visible traversal.
{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(pathToFileURL(path.join(BASE,"01_ESPACIO_PROYECCION_PICKING","index.html")).href);
  const geom=await page.evaluate(()=>{
    const E=window.PRISMA_SPATIAL_EXERCISE;
    const samples=[{x:0,y:0,z:0},{x:3,y:1,z:1},{x:2,y:0,z:0}];
    return samples.map(p=>{const q=E.project(p),back=E.inverseOnPlane(q.x,q.y,p.z);return {p,q,back,err:Math.max(Math.abs(p.x-back.x),Math.abs(p.y-back.y))}});
  });
  assert(geom.every(x=>x.err<1e-9),"EX01 inverse projection");
  await page.locator("#place").click();
  let s=await page.evaluate(()=>window.PRISMA_SPATIAL_EXERCISE.getState());
  assert(s.rampPlaced,"EX01 ramp not placed");
  for(let i=0;i<4;i++) await page.locator("#walk").click();
  s=await page.evaluate(()=>window.PRISMA_SPATIAL_EXERCISE.getState());
  assert(s.player.z===1 && s.player.x===4,"EX01 traversal did not reach upper level");
  const live=await page.locator("#live").textContent();
  assert(live.includes("z1"),"EX01 live status does not expose height");
  result.spatial={projection_roundtrips:geom.length,projection_error_max:Math.max(...geom.map(x=>x.err)),rampPlaced:s.rampPlaced,finalPlayer:s.player,live};
  await page.close();
}

// EX 02: fluid layout, real route/return, empty state, one data source.
for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto(pathToFileURL(path.join(BASE,"02_CATALOGO_FLUIDO","index.html")).href);
  let metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth}));
  assert(metrics.scrollWidth<=width,"EX02 overflow "+width);
  await page.evaluate(()=>document.documentElement.style.fontSize="200%");
  metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth}));
  assert(metrics.scrollWidth<=width,"EX02 200% overflow "+width);
  result.catalog["reflow_"+width]=metrics;
  await page.close();
}
{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const index=pathToFileURL(path.join(BASE,"02_CATALOGO_FLUIDO","index.html")).href;
  await page.goto(index);
  await page.locator("a[href='cielo.html']").click();
  assert(page.url().endsWith("/cielo.html"),"EX02 real route failed");
  await page.locator("a[href='index.html']").click();
  assert(page.url().endsWith("/index.html"),"EX02 return route failed");
  await page.locator("#filter").fill("zzzz-no-existe");
  assert(await page.locator("#empty").isVisible(),"EX02 empty state missing");
  await page.locator("#empty-reset").click();
  assert((await page.locator("#catalog .card").count())===3,"EX02 reset failed");
  const fakeLinks=await page.locator("a[href='#']").count();
  assert(fakeLinks===0,"EX02 fake links present");
  result.catalog.navigation="PASS";
  result.catalog.empty_state="PASS";
  result.catalog.fake_links=0;
  await page.close();
}
await browser.close();
console.log("PRISMA_LEARNING_EXERCISES_PASS",JSON.stringify(result));