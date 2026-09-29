import { mkdir,writeFile } from 'node:fs/promises';
import { buildEditorialEntities } from '../src/r04/editorial-adapters.mjs';
const out=new URL('../build/r04/',import.meta.url);
await mkdir(out,{recursive:true});
const ordinary=await buildEditorialEntities({contentIds:['global-001']});
const s2=await buildEditorialEntities({contentIds:['global-188']});
const report={
  schema:'R51_A9_INCREMENTAL_EDITORIAL_FIXTURE/1.0',
  ordinary:{content_ids:ordinary.report.content_ids,entities:ordinary.entities.length,ids:[...new Set(ordinary.entities.map(e=>e.content_id))]},
  s2:{content_ids:s2.report.content_ids,entities:s2.entities.length,full_s2:s2.report.full_s2_locale_entities,safe_variants:s2.report.safe_variant_entities}
};
await writeFile(new URL('incremental-editorial-fixture.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
