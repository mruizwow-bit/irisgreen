import { performance } from 'node:perf_hooks';
import { mkdir, writeFile } from 'node:fs/promises';
import { buildEditorialEntities } from '../src/r04/editorial-adapters.mjs';
import { buildGameEntities } from '../src/r04/games-adapter.mjs';
import { buildRoutineEntities } from '../src/r04/routines-adapter.mjs';

function bytes(value){ return Buffer.byteLength(JSON.stringify(value)); }
function ms(v){ return Math.round(v*100)/100; }

async function timedAsync(fn){
  const t=performance.now(); const value=await fn(); return {value,elapsed_ms:ms(performance.now()-t)};
}
function timed(fn){
  const t=performance.now(); const value=fn(); return {value,elapsed_ms:ms(performance.now()-t)};
}

await buildEditorialEntities({contentIds:['global-001']});
buildGameEntities({ids:['los-cordones']});
buildRoutineEntities({ids:['manana-para-salir']});

const editorialFull=await timedAsync(()=>buildEditorialEntities());
const editorialOne=await timedAsync(()=>buildEditorialEntities({contentIds:['global-001']}));
const gamesFull=timed(()=>buildGameEntities());
const gameOne=timed(()=>buildGameEntities({ids:['los-cordones']}));
const routinesFull=timed(()=>buildRoutineEntities());
const routineOne=timed(()=>buildRoutineEntities({ids:['manana-para-salir']}));

const report={
  schema:'R51_A9_R04_INCREMENTAL_PERFORMANCE/1.0',
  editorial:{
    full:{entities:editorialFull.value.entities.length,elapsed_ms:editorialFull.elapsed_ms,bytes:bytes(editorialFull.value.entities)},
    incremental:{entities:editorialOne.value.entities.length,elapsed_ms:editorialOne.elapsed_ms,bytes:bytes(editorialOne.value.entities)}
  },
  games:{
    full:{entities:gamesFull.value.entities.length,elapsed_ms:gamesFull.elapsed_ms,bytes:bytes(gamesFull.value.entities)},
    incremental:{entities:gameOne.value.entities.length,elapsed_ms:gameOne.elapsed_ms,bytes:bytes(gameOne.value.entities)}
  },
  routines:{
    full:{entities:routinesFull.value.entities.length,elapsed_ms:routinesFull.elapsed_ms,bytes:bytes(routinesFull.value.entities)},
    incremental:{entities:routineOne.value.entities.length,elapsed_ms:routineOne.elapsed_ms,bytes:bytes(routineOne.value.entities)}
  }
};
for(const v of Object.values(report).filter(x=>x&&x.full)){
  v.entity_reduction=1-(v.incremental.entities/v.full.entities);
  v.byte_reduction=1-(v.incremental.bytes/v.full.bytes);
}
const out=new URL('../build/r04/',import.meta.url);
await mkdir(out,{recursive:true});
await writeFile(new URL('r04-incremental-performance.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
