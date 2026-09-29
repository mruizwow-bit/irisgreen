import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const out=new URL('../build/r04/',import.meta.url);
const read=async n=>readFile(new URL(n,out));
const json=async n=>JSON.parse(await read(n));
const sha=b=>createHash('sha256').update(b).digest('hex');

const [corpusBytes,manifestBytes,citations,duplicates,perf]=await Promise.all([
  read('r04-partial-corpus.json'),
  read('r04-candidate-manifest.json'),
  json('r04-citation-route-audit.json'),
  json('r04-duplicate-audit.json'),
  json('r04-incremental-performance.json')
]);
if(citations.status!=='PASS') throw new Error('citation_audit_not_pass');
const corpus=JSON.parse(corpusBytes);
const corpusSha=sha(corpusBytes);
const manifestSha=sha(manifestBytes);
const version='sabik-r04-private-partial-20260929-'+corpusSha.slice(0,12);
const release={
  schema:'R51_A9_R04_PRIVATE_PARTIAL_RELEASE/1.0',
  version,
  status:'CANDIDATE_VERIFIED_PRIVATE_PARTIAL',
  final_r04:false,
  corpus_sha256:corpusSha,
  manifest_sha256:manifestSha,
  entity_count:corpus.entity_count,
  active_entity_count:corpus.active_entity_count,
  held_entity_count:corpus.held_entity_count,
  citation_audit:{status:citations.status,checked:citations.checked,missing_routes:citations.missing_routes,invalid_urls:citations.invalid_urls},
  duplicate_audit:{status:duplicates.status,exact_duplicate_groups:duplicates.exact_duplicate_groups,cross_content_duplicate_groups:duplicates.cross_content_duplicate_groups,near_duplicate_pairs:duplicates.near_duplicate_pairs||0,near_duplicate_decisions:(duplicates.near||[]).map(x=>({content_ids:x.content_ids,similarity:x.similarity,decision:x.decision}))},
  performance:perf,
  blockers:[
    'EDITORIAL_APPROVED_PACKAGE_ROUTES_PENDING_A2',
    'HOME_CANONICAL_V4_R2_NOT_YET_ACCEPTED',
    'INTERESTS_CANONICAL_AGE_AND_SAFETY_NOT_RELEASED',
    'WORKSHOP_MODELADO_3D_AND_VIDEOMAPPING_NOT_IN_A2_SOURCE',
    'QUIET_SPACE_CRISIS_COPY_REVIEW_PENDING'
  ],
  production_activation:false,
  immutable:true
};
await writeFile(new URL('r04-private-partial-release.json',out),JSON.stringify(release,null,2)+'\n');
console.log(JSON.stringify(release,null,2));
