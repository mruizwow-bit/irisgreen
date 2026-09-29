import { mkdir,writeFile } from 'node:fs/promises';
import { DELTA_TYPES,diffLibraryEntities } from '../src/r04/incremental-delta.mjs';
const out=new URL('../build/r04/',import.meta.url);
await mkdir(out,{recursive:true});
const empty=diffLibraryEntities([],[],{fromVersion:'r03',toVersion:'r04-candidate'});
const contract={
  schema:'R51_A9_INCREMENTAL_DELTA_CONTRACT/1.0',
  delta_schema:empty.schema,
  types:DELTA_TYPES,
  tombstones:true,
  overwrite_verified_releases:false,
  safety_changed_separate:true,
  age_changed_separate:true,
  no_content_change_when_all_unchanged:true
};
await writeFile(new URL('incremental-delta-contract.json',out),JSON.stringify(contract,null,2)+'\n');
console.log(JSON.stringify(contract,null,2));
