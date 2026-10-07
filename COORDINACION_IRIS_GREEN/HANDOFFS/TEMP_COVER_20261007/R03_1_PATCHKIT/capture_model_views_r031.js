const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const URL=process.argv[2]||'http://127.0.0.1:8773/vida-marina-3d.html';
const EXE=process.env.PLAYWRIGHT_CHROMIUM||undefined;
const OUT=process.argv[3]||path.join(process.cwd(),'r031-model-views');fs.mkdirSync(OUT,{recursive:true});
const ids=['prof-pez-hacha','prof-pez-linterna','prof-calamar-cristal'];
const views=[['lateral',0],['tres-cuartos',Math.PI/4],['frontal',Math.PI/2]];
(async()=>{const b=await chromium.launch({executablePath:EXE,args:['--use-gl=angle','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1000,height:760}});await p.goto(URL,{waitUntil:'load'});await p.waitForFunction(()=>window.IG_PRUEBA3D);for(const id of ids){for(const [label,a] of views){await p.evaluate(({id,a})=>{const P=window.IG_PRUEBA3D;P.pausar(true);P.modo('ninguno');P.fijarReloj(7);P.encuadrarA(id,300,a);P.apuntarAAnimal(id);P.latir();},{id,a});await p.waitForTimeout(100);await p.locator('#lienzo3d').screenshot({path:path.join(OUT,id.replace('prof-','')+'-'+label+'.png')});}}await b.close();})().catch(e=>{console.error(e);process.exit(2)});