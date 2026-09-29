import { mkdir,writeFile } from 'node:fs/promises';
import { buildQuietSpaceEditorialEntities } from '../src/r04/quiet-space-adapter.mjs';
const out=new URL('../build/r04/',import.meta.url);
const {entities,report}=buildQuietSpaceEditorialEntities();
await mkdir(out,{recursive:true});
await writeFile(new URL('quiet-space-editorial-entities.json',out),JSON.stringify({schema:'R51_A9_QUIET_SPACE_ENTITIES/1.0',entities},null,2)+'\n');
await writeFile(new URL('quiet-space-editorial-report.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
