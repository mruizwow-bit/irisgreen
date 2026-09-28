import { mkdir, writeFile } from 'node:fs/promises';
import { buildEditorialEntities } from '../src/r04/editorial-adapters.mjs';
const outDir=new URL('../build/r04/',import.meta.url);
const {entities,report}=await buildEditorialEntities();
await mkdir(outDir,{recursive:true});
await writeFile(new URL('editorial-entities.json',outDir),JSON.stringify({schema:'R51_A9_EDITORIAL_ENTITIES/1.0',entities},null,2)+'\n');
await writeFile(new URL('editorial-report.json',outDir),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
