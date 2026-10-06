(function(root){"use strict";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function imageRect(img,W,H,cam){
  const fit=Math.min(W/img.width,H/img.height)*0.82;
  const k=fit*cam.z;
  return {x:W/2-(cam.cx*img.width)*k,y:H/2-(cam.cy*img.height)*k,w:img.width*k,h:img.height*k,k};
}
function toScreen(nx,ny,img,W,H,cam){const r=imageRect(img,W,H,cam);return{x:r.x+nx*r.w,y:r.y+ny*r.h}}
function toNorm(sx,sy,img,W,H,cam){const r=imageRect(img,W,H,cam);return{x:(sx-r.x)/r.w,y:(sy-r.y)/r.h}}
function onImage(p){return p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1}
function strokeCovers(stroke,p){return Math.hypot(stroke.x-p.x,stroke.y-p.y)<=stroke.r}
function sampleClear(strokes,p){return strokes.some(s=>strokeCovers(s,p))}
function sampleOnScreen(sample,img,W,H,cam,margin=8){const q=toScreen(sample[0],sample[1],img,W,H,cam);return q.x>=margin&&q.x<=W-margin&&q.y>=margin&&q.y<=H-margin}
function evaluate(encounter,strokes,img,W,H,cam){
  const zones=encounter.zones.map(zone=>{
    const cleared=zone.samples.filter(s=>sampleClear(strokes,{x:s[0],y:s[1]})).length;
    const onScreen=zone.samples.filter(s=>sampleOnScreen(s,img,W,H,cam)).length;
    const center=zone.guide||[(zone.rect[0]+zone.rect[2])/2,(zone.rect[1]+zone.rect[3])/2];
    const centerVisible=sampleOnScreen(center,img,W,H,cam,18);
    const revealed=cleared>=zone.minSamples;
    const visible=revealed&&centerVisible&&onScreen>=Math.ceil(zone.samples.length*.6);
    return {...zone,cleared,total:zone.samples.length,revealed,visible,center};
  });
  const required=encounter.requiredZones.map(id=>zones.find(z=>z.id===id));
  return {
    zones,
    observable:zones.some(z=>z.visible),
    identifiable:required.every(Boolean)&&required.every(z=>z.visible),
    revealedCount:zones.filter(z=>z.revealed).length,
    visibleCount:zones.filter(z=>z.visible).length,
    offscreenRequired:required.some(z=>z.revealed&&!z.visible)
  };
}
function pan(cam,dx,dy,img,W,H){
  const r=imageRect(img,W,H,cam);
  cam.cx=clamp(cam.cx-dx/r.w,-.15,1.15);
  cam.cy=clamp(cam.cy-dy/r.h,-.15,1.15);
  return cam;
}
function zoom(cam,factor){cam.z=clamp(cam.z*factor,.75,3);return cam}
const api={clamp,imageRect,toScreen,toNorm,onImage,strokeCovers,sampleClear,evaluate,pan,zoom};
root.PRISMA_FOSSIL_MODEL=api;if(typeof module!=="undefined")module.exports=api;
})(typeof window==="undefined"?globalThis:window);