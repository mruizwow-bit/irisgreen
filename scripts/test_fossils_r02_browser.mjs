import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const ROOT=process.cwd();
const DIST=path.join(ROOT,"artifacts","PRISMA_FOSILES_R02_PILOTO_3");
const URL=pathToFileURL(path.join(DIST,"index.html")).href;
const browser=await chromium.launch(process.env.CHROME_EXECUTABLE?{headless:true,executablePath:process.env.CHROME_EXECUTABLE}:{headless:true});
fs.mkdirSync(path.join(DIST,"evidence"),{recursive:true});
const result={schema:"iris-green.prisma.fossils-r02-browser-qa.v1",date:"2026-10-06",tests:{}};
const assert=(v,m)=>{if(!v)throw new Error(m)};

async function open(width,height=820){
  const context=await browser.newContext({viewport:{width,height}});const page=await context.newPage();
  const errors=[],failed=[],requests=[];page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});page.on("requestfailed",r=>failed.push(r.url()));page.on("request",r=>requests.push(r.url()));
  await page.goto(URL);await page.waitForFunction(()=>window.__PRISMA_FOSSILS_QA__&&document.querySelector("#scene").width>0);await page.waitForTimeout(120);
  return{context,page,errors,failed,requests};
}
async function clickNorm(page,x,y){const q=await page.evaluate(([x,y])=>window.__PRISMA_FOSSILS_QA__.screenOf(x,y),[x,y]);const r=await page.locator("#scene").boundingBox();assert(r,"canvas bbox");await page.mouse.click(r.x+q.x,r.y+q.y);await page.waitForTimeout(35)}
const st=page=>page.evaluate(()=>window.__PRISMA_FOSSILS_QA__.getState());

async function encounter0Mouse(){
 const{context,page,errors,failed,requests}=await open(390,844);
 await clickNorm(page,.50,.54);await page.locator("#brushMode").click();await clickNorm(page,.50,.54);
 let s=await st(page);assert(s.evaluation.identifiable,"trilobite should be identifiable after local feature reveal");assert((await page.locator("#sceneState").textContent()).includes("rasgos necesarios")||!(await page.locator("#identify").isDisabled()),"R03 ready status missing");
 await page.locator("#observe").click();assert((await page.locator("#observationText").textContent()).includes("bandas"),"trilobite observation missing");await page.locator("#identify").click();s=await st(page);assert(s.state.identified&&s.journal.includes("trilobites"),"trilobite identity flow failed");
 await page.locator("#depthBtn").focus();await page.locator("#depthBtn").click();assert(await page.locator("#dialog").evaluate(el=>el.open),"depth dialog did not open");await page.locator("#closeDialog").click();assert(await page.locator("#depthBtn").evaluate(el=>document.activeElement===el),"focus did not return to origin");
 assert(errors.length===0&&failed.length===0,"runtime errors route 1");assert(requests.every(u=>u.startsWith("file:")),"external request route 1");
 await page.screenshot({path:path.join(DIST,"evidence","trilobite-revealed-390.png"),fullPage:true});result.tests.route_trilobite={result:"PASS",input:"mouse_direct",identified:s.state.identified};await context.close();
}

async function encounter1NoDrag(){
 const{context,page,errors,failed}=await open(320,720);await page.locator("#encounter").selectOption("1");await page.waitForTimeout(70);
 await page.locator("#guide").click();await page.locator("#brushMode").click();let before=await st(page);const p1=before.state.point;await page.locator("#clearPoint").click();let after=await st(page);const last1=after.state.strokes.at(-1);assert(Math.abs(last1.x-p1.x)<1e-9&&Math.abs(last1.y-p1.y)<1e-9,"R05 clearPoint moved elsewhere");
 assert(!after.evaluation.identifiable,"Dimetrodon identified after only one region");assert(await page.locator("#identify").isDisabled(),"identify should stay disabled after one region");
 await page.locator("#observe").click();assert((await page.locator("#observationText").textContent()).length>20,"partial observation missing");
 await page.locator("#guide").click();await page.locator("#clearPoint").click();after=await st(page);assert(after.evaluation.identifiable,"Dimetrodon two-zone readiness failed");await page.locator("#observe").click();await page.locator("#identify").click();after=await st(page);assert(after.state.identified,"Dimetrodon identity failed");
 assert(errors.length===0&&failed.length===0,"runtime errors route 2");await page.screenshot({path:path.join(DIST,"evidence","dimetrodon-revealed-320.png"),fullPage:true});result.tests.route_dimetrodon={result:"PASS",input:"single_pointer_no_drag",identified:true};await context.close();
}

async function encounter2Keyboard(){
 const{context,page,errors,failed}=await open(390,844);await page.locator("#encounter").selectOption("2");await page.waitForTimeout(70);
 await page.locator("#guide").focus();await page.keyboard.press("Enter");await page.locator("#brushMode").focus();await page.keyboard.press("Enter");await page.locator("#clearPoint").focus();await page.keyboard.press("Enter");
 await page.locator("#observe").focus();await page.keyboard.press("Enter");
 await page.locator("#guide").focus();await page.keyboard.press("Enter");await page.locator("#clearPoint").focus();await page.keyboard.press("Enter");await page.locator("#observe").focus();await page.keyboard.press("Enter");await page.locator("#identify").focus();await page.keyboard.press("Enter");
 const s=await st(page);assert(s.state.identified,"Meganeura keyboard route failed");assert(s.state.observed.length===2,"Meganeura observations incomplete");assert(errors.length===0&&failed.length===0,"runtime errors route 3");await page.screenshot({path:path.join(DIST,"evidence","meganeura-revealed-390.png"),fullPage:true});result.tests.route_meganeura={result:"PASS",input:"keyboard_DOM",identified:true};await context.close();
}

async function regressions(){
 const{context,page}=await open(390,844);await page.locator("#encounter").selectOption("1");await page.waitForTimeout(60);
 await page.locator("#brushMode").click();await page.locator("#lang").click();let s=await st(page);assert(s.mode==="brush","R04 language changed mode");assert((await page.locator("#modeBadge").textContent())==="UNCOVER","R04 badge wrong after language");
 const before=await st(page);await page.locator("#scene").evaluate(el=>{el.dispatchEvent(new PointerEvent("pointerdown",{pointerId:77,button:0,clientX:120,clientY:120,bubbles:true}));el.dispatchEvent(new PointerEvent("pointercancel",{pointerId:77,button:0,clientX:200,clientY:160,bubbles:true}))});await page.waitForTimeout(20);const cancelled=await st(page);assert(cancelled.state.strokes.length===before.state.strokes.length,"pointercancel added reveal stroke");
 await page.locator("#scene").focus();for(let i=0;i<80;i++)await page.keyboard.press("ArrowRight");for(let i=0;i<80;i++)await page.keyboard.press("ArrowDown");s=await st(page);const q=await page.evaluate(([x,y])=>window.__PRISMA_FOSSILS_QA__.screenOf(x,y),[s.state.point.x,s.state.point.y]);const bb=await page.locator("#scene").boundingBox();assert(q.x>=20&&q.x<=bb.width-20&&q.y>=20&&q.y<=bb.height-20,"R02 keyboard point left visible scene");
 assert(await page.locator("#motion").count()===0,"R06 inert motion selector remains");
 result.tests.regressions_R02_R04_R05_R06_pointercancel={result:"PASS"};await context.close();
}

async function offscreenReadiness(){
 const{context,page}=await open(390,844);await page.locator("#encounter").selectOption("1");await page.waitForTimeout(60);await page.locator("#guide").click();await page.locator("#brushMode").click();await page.locator("#clearPoint").click();await page.locator("#guide").click();await page.locator("#clearPoint").click();let s=await st(page);assert(s.evaluation.identifiable,"setup readiness failed");
 await page.locator("#zoomIn").click();await page.locator("#zoomIn").click();await page.locator("#exploreMode").click();const r=await page.locator("#scene").boundingBox();await page.mouse.move(r.x+r.width*.55,r.y+r.height*.5);await page.mouse.down();await page.mouse.move(r.x+r.width*.95,r.y+r.height*.5,{steps:8});await page.mouse.up();await page.waitForTimeout(30);s=await st(page);if(s.evaluation.identifiable){await page.mouse.move(r.x+r.width*.55,r.y+r.height*.5);await page.mouse.down();await page.mouse.move(r.x+r.width*.98,r.y+r.height*.5,{steps:8});await page.mouse.up();await page.waitForTimeout(30);s=await st(page)}
 assert(!s.evaluation.identifiable,"R01 offscreen detail still counts as identifiable");assert(await page.locator("#identify").isDisabled(),"R01 identify enabled offscreen");await page.locator("#fit").click();s=await st(page);assert(s.evaluation.identifiable,"fit did not restore visible readiness");result.tests.R01_offscreen={result:"PASS"};await context.close();
}

async function keyboardAndForcedColors(){
 const{context,page,errors}=await open(390,844);
 await page.locator("#lang").focus();await page.keyboard.press("Tab");assert(await page.locator("#journalBtn").evaluate(el=>document.activeElement===el),"Tab did not move predictably to journal");
 await page.locator("#helpBtn").focus();await page.keyboard.press("Space");assert(await page.locator("#dialog").evaluate(el=>el.open),"Space did not activate Help");await page.locator("#closeDialog").click();
 await page.emulateMedia({forcedColors:"active"});await page.waitForTimeout(30);
 const fc=await page.evaluate(()=>({explorePressed:document.querySelector("#exploreMode").getAttribute("aria-pressed"),sceneDisplay:getComputedStyle(document.querySelector("#scene")).display,primaryHeight:document.querySelector("#observe").getBoundingClientRect().height}));
 assert(fc.explorePressed==="true","forced-colors changed selected semantics");assert(fc.sceneDisplay!=="none","scene hidden in forced colors");assert(fc.primaryHeight>=44,"forced-colors target <44");assert(errors.length===0,"forced-colors/keyboard errors");
 result.tests.keyboard_Tab_Space_forced_colors={result:"PASS",forcedColors:fc};await context.close();
}

async function reflow(){
 for(const [width,height] of [[320,720],[390,844],[1440,900]]){const{context,page,errors}=await open(width,height);const normal=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth}));assert(normal.sw<=width,`overflow ${width}`);await page.evaluate(()=>document.documentElement.style.fontSize="200%");await page.waitForTimeout(60);const m=await page.evaluate(()=>{const interactive=[...document.querySelectorAll("button,select,summary")].filter(e=>e.offsetParent!==null);return{sw:document.documentElement.scrollWidth,iw:innerWidth,minH:Math.min(...interactive.map(e=>e.getBoundingClientRect().height)),off:[...document.querySelectorAll("body *")].filter(e=>e.offsetParent!==null&&!e.classList.contains("sr-only")&&!e.classList.contains("skip")).map(e=>{const r=e.getBoundingClientRect();return{tag:e.tagName,id:e.id,right:r.right,left:r.left,sw:e.scrollWidth,cw:e.clientWidth}}).filter(x=>x.left<-.5||x.right>innerWidth+.5||x.sw>x.cw+2).slice(0,12)}});assert(m.sw<=width,`200% overflow ${width} ${JSON.stringify(m.off)}`);assert(m.minH>=44,`target <44 at ${width}`);assert(errors.length===0,`errors ${width}`);result.tests["reflow_"+width]={result:"PASS",normal,text200:m};await context.close()}
}

try{await encounter0Mouse();await encounter1NoDrag();await encounter2Keyboard();await regressions();await offscreenReadiness();await keyboardAndForcedColors();await reflow();result.result="PASS";}finally{await browser.close()}
fs.writeFileSync(path.join(DIST,"QA_BROWSER.json"),JSON.stringify(result,null,2)+"\n");console.log("FOSSILS_R02_BROWSER_QA_PASS",JSON.stringify(result.tests));