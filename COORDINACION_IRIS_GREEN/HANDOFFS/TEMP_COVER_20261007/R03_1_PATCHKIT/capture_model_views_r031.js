const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const URL=process.argv[2]||'http://127.0.0.1:8773/vida-marina-3d.html';
const EXE=process.env.PLAYWRIGHT_CHROMIUM||undefined;
const OUT=process.argv[3]||path.join(process.cwd(),'r031-model-views');fs.mkdirSync(OUT,{recursive:true});
const ids=['prof-pez-hacha','prof-pez-linterna','prof-calamar-cristal'];
const views=[['lateral','lateral'],['tres-cuartos','threeQuarter'],['frontal','frontal']];

(async()=>{
 const b=await chromium.launch({executablePath:EXE,args:['--use-gl=angle','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:1000,height:760}});
 await p.goto(URL,{waitUntil:'load'});await p.waitForFunction(()=>window.IG_PRUEBA3D&&window.__E);
 const evidence=[];
 for(const id of ids){
  for(const [label,kind] of views){
   const meta=await p.evaluate(({id,kind})=>{
    const P=window.IG_PRUEBA3D,E=window.__E;
    P.pausar(true);P.modo('ninguno');P.fijarReloj(7);
    const root=E.escena.children.find(o=>o.name===id);
    if(!root) throw new Error('animal no encontrado '+id);

    /* Congelar orientación corporal coherente con el estado de trayectoria.
       Las vistas NO dependen de dónde quedó la cámara anterior. */
    root.rotation.y=root.userData.giro>=0?0:Math.PI;
    root.updateMatrixWorld(true);

    const fitted=P.encuadrarA(id,300,0);
    const d=fitted&&fitted.distancia ? fitted.distancia : root.position.distanceTo(E.camara.position);
    const Vec=E.camara.position.constructor;
    const anterior=root.userData.anteriorSignX||1;
    let local;
    if(kind==='frontal') local=new Vec(anterior,0,0);
    else if(kind==='threeQuarter') local=new Vec(anterior,0,1).normalize();
    else local=new Vec(0,0,1);

    const worldDir=local.applyQuaternion(root.quaternion).normalize();
    E.camara.position.copy(root.position).add(worldDir.multiplyScalar(d));
    E.camara.lookAt(root.position);E.camara.updateMatrixWorld(true);
    E.luz.pos.copy(E.camara.position);
    E.luz.dir.copy(root.position).sub(E.luz.pos).normalize();
    P.latir();
    return {id,kind,d,anterior,rootYaw:root.rotation.y,camera:E.camara.position.toArray(),target:root.position.toArray()};
   },{id,kind});
   await p.waitForTimeout(120);
   await p.locator('#lienzo3d').screenshot({path:path.join(OUT,id.replace('prof-','')+'-'+label+'.png')});
   evidence.push(meta);
  }
 }
 fs.writeFileSync(path.join(OUT,'VIEW_GEOMETRY.json'),JSON.stringify(evidence,null,2));
 await b.close();
})().catch(e=>{console.error(e);process.exit(2)});