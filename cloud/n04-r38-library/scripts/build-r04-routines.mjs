import { mkdir,writeFile } from 'node:fs/promises';
import { buildRoutineEntities } from '../src/r04/routines-adapter.mjs';
const out=new URL('../build/r04/',import.meta.url);
const {entities,report}=buildRoutineEntities();
await mkdir(out,{recursive:true});
await writeFile(new URL('routines-entities.json',out),JSON.stringify({schema:'R51_A9_ROUTINE_ENTITIES/1.0',entities},null,2)+'\n');
await writeFile(new URL('routines-report.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
