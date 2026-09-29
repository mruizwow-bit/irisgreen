import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const out=new URL('../build/r04/',import.meta.url);
async function json(name){ return JSON.parse(await readFile(new URL(name,out),'utf8')); }
const sha256=value=>createHash('sha256').update(value).digest('hex');

const [editorial,games,routines,interests,workshop,quiet]=await Promise.all([
  json('editorial-entities.json'),
  json('games-entities.json'),
  json('routines-entities.json'),
  json('interests-candidate-entities.json'),
  json('workshop-25-integrated-entities.json'),
  json('quiet-space-editorial-entities.json')
]);

const entities=[
  ...editorial.entities,
  ...games.entities,
  ...routines.entities,
  ...interests.entities,
  ...workshop.entities,
  ...quiet.entities
];

const ids=new Set();
for(const e of entities){
  if(!e?.entity_id) throw new Error('missing_entity_id');
  if(ids.has(e.entity_id)) throw new Error('duplicate_entity_id:'+e.entity_id);
  ids.add(e.entity_id);
}
const active=entities.filter(e=>e.active!==false&&e.retrieval_eligible!==false);
const held=entities.filter(e=>e.active===false||e.retrieval_eligible===false);
const legacy=new Set(['INFANCIA','ADOLESCENCIA','ADULTEZ','TRANSVERSAL','CUALQUIER_EDAD','children','teenagers','adults','any']);
for(const e of active){
  if(!Array.isArray(e.audience)||!e.audience.length) throw new Error('active_entity_missing_age:'+e.entity_id);
  if(e.audience.some(x=>legacy.has(x))) throw new Error('legacy_age_in_active_entity:'+e.entity_id);
}

const corpus={
  schema:'R51_A9_R04_PARTIAL_CORPUS/1.0',
  library_version:'R04_CANDIDATE_PARTIAL_UNSEALED',
  status:'PRIVATE_CANDIDATE_NOT_ACTIVE',
  entity_count:entities.length,
  active_entity_count:active.length,
  held_entity_count:held.length,
  entities
};
const text=JSON.stringify(corpus)+'\n';
const report={
  schema:'R51_A9_R04_PARTIAL_CORPUS_REPORT/1.0',
  entity_count:entities.length,
  active_entity_count:active.length,
  held_entity_count:held.length,
  sha256:sha256(text),
  bytes:Buffer.byteLength(text),
  domains:{
    editorial:editorial.entities.length,
    games:games.entities.length,
    routines:routines.entities.length,
    interests:interests.entities.length,
    workshop:workshop.entities.length,
    quiet_space:quiet.entities.length
  },
  production_activation:false
};
await mkdir(out,{recursive:true});
await writeFile(new URL('r04-partial-corpus.json',out),text);
await writeFile(new URL('r04-partial-corpus-report.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
