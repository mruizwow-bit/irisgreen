(function(root){'use strict';
const WORLD={w:1800,h:1100},GW=360,GH=220;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const key=(x,y)=>clamp(Math.floor(y/WORLD.h*GH),0,GH-1)*GW+clamp(Math.floor(x/WORLD.w*GW),0,GW-1);
function mask(){return new Uint8Array(GW*GH)}
function clear(m,x,y,r){let changed=0;const dx=WORLD.w/GW,dy=WORLD.h/GH;
 for(let j=clamp(Math.floor((y-r)/dy),0,GH-1);j<=clamp(Math.ceil((y+r)/dy),0,GH-1);j++)for(let i=clamp(Math.floor((x-r)/dx),0,GW-1);i<=clamp(Math.ceil((x+r)/dx),0,GW-1);i++){if((i*dx+dx/2-x)**2+(j*dy+dy/2-y)**2<=r*r){const k=j*GW+i;if(!m[k]){m[k]=1;changed++}}}return changed}
function isClear(m,x,y){return x>=0&&y>=0&&x<WORLD.w&&y<WORLD.h&&m[key(x,y)]===1}
function coverage(m,p){let n=0;for(const q of p.samples)if(isClear(m,p.x-p.w/2+q[0]*p.w,p.y-p.h/2+q[1]*p.h))n++;return n/p.samples.length}
function featureVisible(m,p,q){const x=p.x-p.w/2+q.x*p.w,y=p.y-p.h/2+q.y*p.h;return isClear(m,x,y)&&isClear(m,x+8,y)&&isClear(m,x-8,y)&&isClear(m,x,y+8)&&isClear(m,x,y-8)}
function ready(m,p){return coverage(m,p)>=.48&&p.features.filter(q=>featureVisible(m,p,q)).length>=2}
function scale(cam,w,h){return Math.min(w/820,h/580)*cam.z}
function screen(p,cam,w,h){const k=scale(cam,w,h);return{x:(p.x-cam.x)*k+w/2,y:(p.y-cam.y)*k+h/2}}
function world(p,cam,w,h){const k=scale(cam,w,h);return{x:(p.x-w/2)/k+cam.x,y:(p.y-h/2)/k+cam.y}}
function bound(cam,w,h){const k=scale(cam,w,h),hx=w/k/2,hy=h/k/2;cam.x=hx*2>=WORLD.w?WORLD.w/2:clamp(cam.x,hx,WORLD.w-hx);cam.y=hy*2>=WORLD.h?WORLD.h/2:clamp(cam.y,hy,WORLD.h-hy);return cam}
function hit(pieces,p){return [...pieces].reverse().find(f=>p.x>=f.x-f.w/2&&p.x<=f.x+f.w/2&&p.y>=f.y-f.h/2&&p.y<=f.y+f.h/2)||null}
const api={WORLD,GW,GH,clamp,mask,clear,isClear,coverage,featureVisible,ready,scale,screen,world,bound,hit};root.FossilModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
