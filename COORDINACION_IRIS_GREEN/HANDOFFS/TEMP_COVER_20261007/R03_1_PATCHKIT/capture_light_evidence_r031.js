const { chromium } = require('playwright');
const fs=require('fs'), path=require('path');
const URL=process.argv[2]||'http://127.0.0.1:8773/vida-marina-3d.html';
const EXE=process.env.PLAYWRIGHT_CHROMIUM||undefined;
const OUT=process.argv[3]||path.join(process.cwd(),'r031-light-evidence');
fs.mkdirSync(OUT,{recursive:true});
const ids=['prof-pez-hacha','prof-pez-linterna','prof-calamar-cristal'];
(async()=>{
 const b=await chromium.launch({executablePath:EXE,args:['--use-gl=angle','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:1200,height:800}});
 await p.goto(URL,{waitUntil:'load'});await p.waitForFunction(()=>window.IG_PRUEBA3D&&window.__E);
 const result=[];
 for(const id of ids){
  await p.evaluate(id=>{
    const P=window.IG_PRUEBA3D;P.pausar(true);P.fijarReloj(7);P.modo('ninguno');P.encuadrarA(id,260,0);P.latir();
    /* Evidencia aislada: oculta mundo y otros animales para que el análisis de
       luminancia mida la superficie del sujeto, no partículas/talud. */
    const target=window.__E.escena.children.find(o=>o.name===id);
    window.__igLightEvidenceVisibility=[];
    window.__E.escena.traverse(o=>{
      if(o===target || (target&&target.children.includes(o))) return;
      if(o.name&&o.name.startsWith('prof-')){window.__igLightEvidenceVisibility.push([o,o.visible]);o.visible=false;}
    });
    if(window.__E.mundo){
      ['talud','grumos','hebras'].forEach(k=>{const o=window.__E.mundo[k];if(o){window.__igLightEvidenceVisibility.push([o,o.visible]);o.visible=false;}});
      (window.__E.mundo.cantos&&window.__E.mundo.cantos.children||[]).forEach(o=>{window.__igLightEvidenceVisibility.push([o,o.visible]);o.visible=false;});
      (window.__E.mundo.capas||[]).forEach(o=>{window.__igLightEvidenceVisibility.push([o,o.visible]);o.visible=false;});
    }
    window.__E.renderer.render(window.__E.escena,window.__E.camara);
  },id);
  const m=await p.evaluate(id=>window.IG_PRUEBA3D.medida().find(x=>x.id===id),id);
  const c=await p.locator('#lienzo3d').boundingBox();
  const clip={x:Math.max(c.x,m.centroPantalla.x-180),y:Math.max(c.y,m.centroPantalla.y-140),width:360,height:280};
  await p.evaluate(()=>{const P=window.IG_PRUEBA3D,L=P.luz();P.apuntarAPunto(L.pos[0]+2,L.pos[1]+1,L.pos[2]-0.2);P.latir();});
  await p.screenshot({path:path.join(OUT,id.replace('prof-','')+'-dark.png'),clip});
  await p.evaluate(id=>{const P=window.IG_PRUEBA3D;P.apuntarAAnimal(id);P.latir();},id);
  await p.screenshot({path:path.join(OUT,id.replace('prof-','')+'-revealed.png'),clip});
  const partial=await p.evaluate(id=>{const P=window.IG_PRUEBA3D;const pos=P.posiciones()[id];let chosen=null;for(let k=1;k<=24;k++){const off=k*0.006;P.apuntarAPunto(pos[0]+off,pos[1],pos[2]);P.latir();const m=P.medida().find(x=>x.id===id);if(m.contextoCorporal>0.10&&m.contextoCorporal<0.90){chosen={off,ctx:m.contextoCorporal};break;}}return chosen;},id);
  await p.screenshot({path:path.join(OUT,id.replace('prof-','')+'-partial.png'),clip});
  result.push({id,partial});
  await p.evaluate(()=>{(window.__igLightEvidenceVisibility||[]).forEach(([o,v])=>o.visible=v);window.__igLightEvidenceVisibility=[];});
 }
 await b.close();
 fs.writeFileSync(path.join(OUT,'LIGHT_EVIDENCE.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));
})().catch(e=>{console.error(e);process.exit(2)});