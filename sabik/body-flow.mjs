// Flex the existing transparent artwork locally; the nucleus is a fixed pivot.
export const BODY_PIVOT=Object.freeze([330/642,351/642]);
export function bodyPoint(u,v,phase,strength=1){
 const x=u-BODY_PIVOT[0],y=v-BODY_PIVOT[1],r=Math.hypot(x,y);
 const t=Math.max(0,Math.min(1,(r-.065)/.38)),falloff=t*t*(3-2*t);
 const weight=falloff*strength;
 const twist=(Math.sin(phase+y*3)*.24+Math.sin(phase*.73+x*3)*.07)*weight;
 const stretch=1+Math.sin(phase*1.13+y*3-x*1.5)*.11*weight;
 const c=Math.cos(twist),s=Math.sin(twist);
 return [BODY_PIVOT[0]+(x*c-y*s)*stretch,
  BODY_PIVOT[1]+(x*s+y*c)*(1-Math.sin(phase*.91+x*3)*.075*weight)];
}

export function createBodyMesh(columns=28,rows=28){
 const uv=[],indices=[];
 for(let y=0;y<=rows;y++)for(let x=0;x<=columns;x++)uv.push(x/columns,y/rows);
 for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
  const a=y*(columns+1)+x,b=a+1,c=a+columns+1,d=c+1;
  indices.push(a,c,b,b,c,d);
 }
 return {uv:new Float32Array(uv),indices:new Uint16Array(indices)};
}

async function mountBody(visual){
 const master=visual.querySelector('#sabik-web-master');if(!master)return;
 const canvas=document.createElement('canvas');canvas.className='sabik-body-flow';canvas.setAttribute('aria-hidden','true');
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,depth:false,stencil:false});
 if(!gl)return; // The original artwork remains visible if WebGL is unavailable.
 const shader=(type,source)=>{const value=gl.createShader(type);gl.shaderSource(value,source);gl.compileShader(value);if(!gl.getShaderParameter(value,gl.COMPILE_STATUS))throw new Error('BODY_SHADER');return value;};
 const program=gl.createProgram();
 try{
  const vs=shader(gl.VERTEX_SHADER,'attribute vec2 position;attribute vec2 uv;varying vec2 tex;void main(){tex=uv;gl_Position=vec4(position,0.,1.);}');
  const fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 tex;uniform sampler2D art;void main(){gl_FragColor=texture2D(art,tex);}');
  gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('BODY_PROGRAM');
  await master.decode();
 }catch{gl.deleteProgram(program);return;}
 gl.useProgram(program);
 const mesh=createBodyMesh(),positions=new Float32Array(mesh.uv.length),buffers=[];
 function attribute(name,data,usage){const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,usage);const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);return b;}
 attribute('uv',mesh.uv,gl.STATIC_DRAW);const positionBuffer=attribute('position',positions,gl.DYNAMIC_DRAW);
 const indices=gl.createBuffer();buffers.push(indices);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,master);
 master.after(canvas);
 let frame=0,last=0,phase=0,strength=0,onscreen=true,alive=true,lost=false;
 function mode(){return document.documentElement.dataset.igMotion==='off'?'none':visual.dataset.motion||'normal';}
 function active(){return alive&&!lost&&onscreen&&!document.hidden&&visual.dataset.renderActive!=='false'&&mode()!=='none';}
 function draw(now){
  frame=0;if(!active())return sync();
  const dt=last?Math.min((now-last)/1000,.06):0;last=now;
  const reduced=mode()==='reduced',speaking=visual.dataset.state==='speaking';
  const energy=Math.max(0,Math.min(1,(parseFloat(visual.style.getPropertyValue('--sabik-core-live-scale'))-1)/1.15||0));
  const target=reduced?.16:speaking?1.2+energy*.25:visual.dataset.state==='listening'?1.05:1;
  strength+=(target-strength)*Math.min(1,dt*4);
  phase+=dt*(reduced?.45:speaking?1.2:.8);
  canvas.hidden=false;
  const pixelRatio=Math.min(window.devicePixelRatio||1,2),w=Math.round(canvas.clientWidth*pixelRatio),h=Math.round(canvas.clientHeight*pixelRatio);
  if(w&&h&&(canvas.width!==w||canvas.height!==h)){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
  const ratio=master.naturalWidth/master.naturalHeight,box=canvas.width/canvas.height;
  const fitX=Math.min(1,ratio/box),fitY=Math.min(1,box/ratio);
  for(let i=0;i<mesh.uv.length;i+=2){const [u,v]=bodyPoint(mesh.uv[i],mesh.uv[i+1],phase,strength);positions[i]=(u-.5)*2*fitX;positions[i+1]=(.5-v)*2*fitY;}
  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,positions);
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_SHORT,0);
  visual.dataset.bodyFlow='ready';canvas.hidden=false;frame=requestAnimationFrame(draw);
 }
 function sync(){
  if(!active()){if(frame)cancelAnimationFrame(frame);frame=0;last=0;
   if(mode()==='none'||lost){delete visual.dataset.bodyFlow;canvas.hidden=true;strength=0;}
   return;
  }
  if(!frame)frame=requestAnimationFrame(draw);
 }
 const observer=new MutationObserver(sync);observer.observe(visual,{attributes:true,attributeFilter:['data-motion','data-state','data-render-active']});observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-ig-motion']});
 const intersection=new IntersectionObserver(entries=>{onscreen=entries[0].isIntersecting;sync();});intersection.observe(visual);
 const visibility=()=>sync();document.addEventListener('visibilitychange',visibility);
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;sync();});
 canvas.addEventListener('webglcontextrestored',()=>{dispose();void mountBody(visual);});
 function dispose(){alive=false;if(frame)cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',pageHide);window.removeEventListener('pageshow',pageShow);for(const b of buffers)gl.deleteBuffer(b);gl.deleteTexture(texture);gl.deleteProgram(program);canvas.remove();delete visual.dataset.bodyFlow;}
 const pageHide=()=>{last=0;if(frame)cancelAnimationFrame(frame);frame=0;};
 const pageShow=()=>{window.SabikWebPresentation?.refresh();sync();};
 window.addEventListener('pagehide',pageHide);
 window.addEventListener('pageshow',pageShow);sync();
}
if(typeof document!=='undefined'){
 const boot=()=>{const visual=document.querySelector('#sabik-hologram');if(visual)void mountBody(visual);};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
}
