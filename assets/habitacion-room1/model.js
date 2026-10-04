/* Sala 1: geometría canónica R01. Sin movimiento de piezas ni Sala 2. */
(()=>{'use strict';
const size=4,last=size-1,entry=[0,2,0],exit=[2,0,2];
const pieces=[{x:1,y:0,height:3},{x:0,y:1,height:1},{x:0,y:0,height:1}];
const rotate={right:([x,y,z])=>[x,y,z],up:([x,y,z])=>[last-z,y,x],down:([x,y,z])=>[x,z,last-y],left:([x,y,z])=>[last-x,y,last-z]};
const key=c=>c.join(','),inside=c=>c.every(v=>v>=0&&v<size);
function solve(orientation){const rotation=rotate[orientation];if(!rotation)return null;const solids=new Set();for(const p of pieces)for(let z=0;z<p.height;z++)solids.add(key(rotation([p.x,p.y,z])));
const walkable=c=>inside(c)&&!solids.has(key(c))&&(c[2]===0||solids.has(key([c[0],c[1],c[2]-1])));
const e=rotation(entry),target=rotation(exit);let start=null;for(let z=e[2];z>=0;z--){const c=[e[0],e[1],z];if(walkable(c)){start=c;break;}}
if(!start||!walkable(target))return null;const visited=new Set([key(start)]),queue=[[start,[start]]];for(let i=0;i<queue.length;i++){const [c,path]=queue[i];if(key(c)===key(target))return path;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])for(let dz=-1;dz<=1;dz++){const next=[c[0]+dx,c[1]+dy,c[2]+dz];if(walkable(next)&&!visited.has(key(next))){visited.add(key(next));queue.push([next,[...path,next]]);}}}return null;}
globalThis.ImpossibleRoom1=Object.freeze({solve});
})();
