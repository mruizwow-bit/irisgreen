import { mkdir, readFile, writeFile } from 'node:fs/promises';

const out=new URL('../build/r04/',import.meta.url);
async function json(name){ return JSON.parse(await readFile(new URL(name,out),'utf8')); }

const [editorial,games,routines,interests,workshop,quiet,home]=await Promise.all([
  json('editorial-report.json'),
  json('games-report.json'),
  json('routines-report.json'),
  json('interests-candidate-report.json'),
  json('workshop-25-integrated-report.json'),
  json('quiet-space-editorial-report.json'),
  json('home-source-hold-report.json')
]);

const manifest={
  schema:'R51_A9_R04_CANDIDATE_MANIFEST/1.0',
  status:'CANDIDATE_PARTIAL_VERIFIED_NOT_ACTIVE',
  library_version:'R04_CANDIDATE_UNSEALED',
  candidates:{
    editorial_965:{status:'READY_CANDIDATE',content_ids:editorial.content_ids,entities:editorial.full_locale_entities+editorial.safe_variant_entities},
    games_297:{status:'READY_CANDIDATE',content_ids:games.game_ids,entities:games.entities},
    routines_109:{status:'READY_CANDIDATE',content_ids:routines.routine_ids,entities:routines.entities},
    interests_72:{status:'HELD_PENDING_R59_AGE_SAFETY',content_ids:interests.interest_ids,entities:interests.entities,retrieval_eligible:interests.retrieval_eligible},
    workshop:{status:'PARTIAL_25_OF_27',content_ids:workshop.integrated_studio_ids,entities:workshop.entities,pending:workshop.r47_donor_pending},
    quiet_space:{status:'PARTIAL_CRISIS_HELD',content_ids:quiet.module_ids,entities:quiet.entities,active_entities:quiet.active_entities,held_entities:quiet.held_entities},
    home:{status:home.status,entities:home.entities}
  },
  blockers:[
    'INTERESTS_CANONICAL_AGE_AND_SAFETY',
    'WORKSHOP_2_R47_DONOR_ITEMS',
    'HOME_CANONICAL_V4',
    'QUIET_SPACE_CRISIS_COPY_REVIEW'
  ],
  production_activation:false
};

await mkdir(out,{recursive:true});
await writeFile(new URL('r04-candidate-manifest.json',out),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest,null,2));
