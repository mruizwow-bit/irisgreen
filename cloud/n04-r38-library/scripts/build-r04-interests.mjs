import { mkdir,writeFile } from 'node:fs/promises';
import { buildInterestCandidateEntities } from '../src/r04/interests-adapter.mjs';
const out=new URL('../build/r04/',import.meta.url);
const {entities,report}=buildInterestCandidateEntities();
await mkdir(out,{recursive:true});
await writeFile(new URL('interests-candidate-entities.json',out),JSON.stringify({schema:'R51_A9_INTEREST_CANDIDATE_ENTITIES/1.0',entities},null,2)+'\n');
await writeFile(new URL('interests-candidate-report.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
