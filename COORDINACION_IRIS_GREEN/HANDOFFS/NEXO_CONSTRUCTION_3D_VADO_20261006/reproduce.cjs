const fs=require('fs'),vm=require('vm'),path=require('path'),crypto=require('crypto');
const root=path.resolve(process.argv[2]||'construction-3d-review-20261006/ig3d');
const out={method:'Original JS in Node VM, explicit constructed states, no browser or GPU',results:[]};
function context(){
 const logs=[], data=new Map(); const c={console,Math,JSON,Date,performance:{now:()=>10000},setInterval,clearInterval};
 c.window=c;c.document={readyState:'loading',addEventListener(){},querySelector(){return null}};
 c.localStorage={setItem:(k,v)=>data.set(k,v),getItem:k=>data.get(k)||null,removeItem:k=>data.delete(k)};
 c.UI=new Proxy({el:{ajustes:{hidden:true}},mensaje:(...a)=>logs.push(a)}, {get:(o,k)=>o[k]||(()=>{})});
 vm.createContext(c);
 for(const n of ['config','world','player','build','save'])vm.runInContext(fs.readFileSync(path.join(root,'js',n+'.js'),'utf8'),c);
 let s=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
 s=s.replace("  if (document.readyState === 'loading')", `  global.REVIEW={estado:estado,key:onKeyDown,pointer:conectarPuntero,retirar:retirar,deshacer:deshacer,objetivos:revisarObjetivos,colocar:colocar,bind:function(w,j,o,sc){world=w;jugador=j;obra=o;escena=sc;estado.jugador=j;corriendo=true;}};\n  if (document.readyState === 'loading')`);
 vm.runInContext(s,c); const w=new c.World(),j=new c.Jugador(w),e=c.REVIEW.estado;
 j.x=5.5;j.y=3;j.yObj=3;j.z=7.5;e.inventario={madera:20,piedra:20};e.escalerasDesbloqueadas=true;
 const b=new c.Constructor(w,e); c.REVIEW.bind(w,j,b,{yawS:0});
 return {c,w,j,e,b,logs};
}
function record(id,v){out.results.push({id,...v})}
const sums=fs.readFileSync(path.join(root,'SHA256SUMS.txt'),'utf8').trim().split('\n');
record('manifest',{total:sums.length,valid:sums.filter(l=>{const m=l.match(/^([0-9a-f]{64})\s+(.+)$/);return m&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,m[2]))).digest('hex')===m[1]}).length});
{
 const {c,w,e}=context(); e.cursor={x:6,y:3,z:7}; e.piezaSel='bloque';
 let prevented=false; c.REVIEW.key({key:'Enter',target:{tagName:'BUTTON',id:'btn-guardar'},preventDefault(){prevented=true}});
 record('K01_enter_on_save_button',{prevented,placed:Object.keys(w.piezas),stone:e.inventario.piedra});
 let arrowPrevented=false;c.REVIEW.key({key:'ArrowRight',target:{tagName:'INPUT',type:'radio'},preventDefault(){arrowPrevented=true}});
 record('K02_arrow_on_movement_radio',{prevented:arrowPrevented});
}
{
 const {c,w,j,e,b}=context(); b.colocar(6,3,7,'bloque',0);j.paso(1,0);
 const before={x:j.x,y:j.y,z:j.z,pieces:Object.keys(w.piezas).length};
 const removed=b.retirar(6,3,7);const undo=b.deshacer();for(let i=0;i<120;i++)j.mover(0,0,1/60);
 record('U01_undo_under_feet',{before,normalRemoval:removed,undo,after:{y:j.y,ground:w.cima(6,7),pieces:Object.keys(w.piezas).length}});
}
{
 const {c,w,j,e,b,logs}=context(); b.colocar(6,3,7,'bloque',0);b.colocar(6,3,8,'bloque',0);
 const listeners={};const cv={addEventListener:(n,fn)=>listeners[n]=fn,setPointerCapture(){},releasePointerCapture(){}};
 const sc={apuntar:()=>({golpe:{x:6,y:3,z:7},colocar:{x:6,y:3,z:8}})};
 c.REVIEW.bind(w,j,b,sc);c.REVIEW.pointer(cv);
 const ev={pointerId:1,pointerType:'mouse',clientX:20,clientY:20,shiftKey:true};
 listeners.pointerdown(ev);listeners.pointerup(ev);
 record('P01_shift_click_side',{pointed:'6,3,7',remaining:Object.keys(w.piezas),lastMessage:logs.at(-1)});
}
{
 const {c,w,j,e,b}=context();b.colocar(6,3,7,'bloque',0);
 c.localStorage.setItem(c.CFG.guardadoClave,JSON.stringify({v:1,piezas:[],nodos:[]}));
 const before=Object.keys(w.piezas).length;const result=c.Guardado.cargar(e,w);
 record('S01_failed_load_mutates_world',{before,result,after:Object.keys(w.piezas).length});
}
{
 const {c,w,j,e,b}=context(); j.x=15.5;j.z=5.5;j.y=5;j.yObj=5;
 e.objetivos.slice(0,4).forEach(x=>x.hecho=true);e.piezaSel='bloque';e.cursor={x:15,y:5,z:4};
 for(let i=0;i<3;i++){c.REVIEW.colocar();c.REVIEW.retirar();}
 c.REVIEW.objetivos();
 record('G01_final_goal_empty_plot',{placements:e.parcelaColocadas,removals:e.parcelaRetiradas,pieces:Object.keys(w.piezas).length,complete:e.objetivos[4].hecho});
}
{
 const {c,w,j}=context();const n=w.nodos[0];j.x=n.x+0.5;j.z=n.z+0.5;j.y=9;j.yObj=9;
 record('I01_resource_range_ignores_height',{y:j.y,nodeGround:w.cima(n.x,n.z),target:j.objetivoCercano()});
}
fs.writeFileSync(path.resolve('construction-3d-review-20261006/REPRODUCTIONS.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));
