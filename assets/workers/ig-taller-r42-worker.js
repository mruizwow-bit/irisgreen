/* Iris Green · R42 Taller worker · no network.
   Heavy deterministic calculations and procedural previews live off the main thread. */
'use strict';

function lifeStep(cells,w,h,steps){
  let current=Array.from(cells,Boolean), nsteps=Math.max(1,Math.min(256,Number(steps)||1));
  for(let s=0;s<nsteps;s++){
    const out=new Array(current.length).fill(false);
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){
      let n=0;
      for(let yy=-1;yy<=1;yy++) for(let xx=-1;xx<=1;xx++){
        if(!xx&&!yy) continue;
        if(current[((y+yy+h)%h)*w+((x+xx+w)%w)]) n++;
      }
      const live=!!current[y*w+x];
      out[y*w+x]=live?(n===2||n===3):n===3;
    }
    current=out;
  }
  return current;
}

function seeded(seed){
  let s=(Number(seed)||1)>>>0;
  return ()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};
}

function preview(payload){
  if(typeof OffscreenCanvas==='undefined') return null;
  const w=Number(payload.width)||240,h=Number(payload.height)||150,f=String(payload.family||'visual'),rand=seeded(payload.seed||1);
  const c=new OffscreenCanvas(w,h),x=c.getContext('2d');
  x.fillStyle='#eef4fb';x.fillRect(0,0,w,h);
  x.lineCap='round';x.lineJoin='round';x.lineWidth=Math.max(2,w/90);
  const navy='#17395c',blue='#2f80ed',violet='#7457c7',pink='#d58caf',mint='#58a99a';
  if(f==='visual'){
    x.strokeStyle=navy;x.beginPath();x.moveTo(w*.08,h*.72);
    for(let i=1;i<9;i++)x.lineTo(w*(.08+i*.105),h*(.2+rand()*.62));x.stroke();
    x.fillStyle=violet;x.fillRect(w*.12,h*.15,w*.18,h*.18);
  }else if(f==='build'){
    x.strokeStyle=navy;x.beginPath();x.moveTo(w*.08,h*.78);
    for(let i=0;i<5;i++){let px=w*(.12+i*.18);x.lineTo(px,h*(i%2?.34:.78));}
    x.lineTo(w*.92,h*.78);x.stroke();x.fillStyle=blue;x.fillRect(w*.46,h*.58,w*.09,h*.2);
  }else if(f==='code'){
    for(let i=0;i<4;i++){x.fillStyle=i%2?blue:violet;x.fillRect(w*(.08+i*.08),h*(.16+i*.14),w*.42,h*.1);}
    x.strokeStyle=navy;x.beginPath();x.moveTo(w*.7,h*.8);x.lineTo(w*.88,h*.62);x.lineTo(w*.72,h*.48);x.stroke();
  }else if(f==='audio'){
    x.fillStyle='#d5dde8';for(let r=0;r<3;r++)for(let col=0;col<8;col++){x.fillStyle=(col+r*2)%4===0?blue:'#d5dde8';x.fillRect(w*(.06+col*.115),h*(.18+r*.22),w*.075,h*.12);}
    x.strokeStyle=violet;x.beginPath();for(let i=0;i<80;i++){let px=w*.05+i*w*.0115,py=h*.82+Math.sin(i*.42)*h*.07;x.lineTo(px,py);}x.stroke();
  }else if(f==='words'){
    x.fillStyle=navy;for(let i=0;i<5;i++)x.fillRect(w*.08,h*(.15+i*.16),w*(.72-(i%2)*.14),Math.max(3,h*.035));
    x.fillStyle=violet;x.fillRect(w*.08,h*.86,w*.32,Math.max(4,h*.045));
  }else{
    x.fillStyle=pink;x.beginPath();x.moveTo(w*.5,h*.08);x.lineTo(w*.85,h*.75);x.lineTo(w*.15,h*.75);x.closePath();x.fill();
    x.strokeStyle=navy;x.stroke();x.fillStyle=mint;x.fillRect(w*.4,h*.38,w*.2,h*.25);
  }
  return c.transferToImageBitmap();
}

self.onmessage=(event)=>{
  const m=event.data||{},id=m.id,type=m.type,p=m.payload||{};
  try{
    if(type==='life-step') return self.postMessage({id,result:lifeStep(p.cells||[],p.w||0,p.h||0,p.steps||1)});
    if(type==='preview'){
      const bitmap=preview(p);
      if(bitmap) return self.postMessage({id,bitmap},[bitmap]);
      return self.postMessage({id,result:null});
    }
    throw new Error('UNKNOWN_TASK');
  }catch(error){
    self.postMessage({id,error:error&&error.message==='UNKNOWN_TASK'?'UNKNOWN_TASK':'WORKER_FAILED'});
  }
};
