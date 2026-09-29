import { mkdir,writeFile } from 'node:fs/promises';
import { buildWorkshopIntegratedEntities } from '../src/r04/workshop-adapter.mjs';
const out=new URL('../build/r04/',import.meta.url);
const {entities,report}=buildWorkshopIntegratedEntities();
await mkdir(out,{recursive:true});
await writeFile(new URL('workshop-25-integrated-entities.json',out),JSON.stringify({schema:'R51_A9_WORKSHOP_25_ENTITIES/1.0',entities},null,2)+'\n');
await writeFile(new URL('workshop-25-integrated-report.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
