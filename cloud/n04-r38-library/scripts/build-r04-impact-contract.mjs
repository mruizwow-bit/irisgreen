import { mkdir,writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { planIncrementalImpact } from '../src/r04/incremental-impact.mjs';

const registry=JSON.parse(readFileSync(new URL('../library-source-registry.json',import.meta.url),'utf8'));
const contract={
  schema:'R51_A9_INCREMENTAL_IMPACT_CONTRACT/1.0',
  css_only:planIncrementalImpact(registry,['assets/site-v23.css']),
  ui_js_only:planIncrementalImpact(registry,['assets/rincon-r42.js']),
  game_data:planIncrementalImpact(registry,['assets/data/juegos-iris-data.js']),
  editorial_age:planIncrementalImpact(registry,['assets/safety/age-classification-r51-global.json'])
};
const out=new URL('../build/r04/',import.meta.url);
await mkdir(out,{recursive:true});
await writeFile(new URL('incremental-impact-contract.json',out),JSON.stringify(contract,null,2)+'\n');
console.log(JSON.stringify(contract,null,2));
