import { readFileSync } from 'node:fs';
import { sha256Text } from './source-reader.mjs';

const ORIGIN='https://irisgreen.eu';

function readJson(rel){
  return JSON.parse(readFileSync(new URL(rel,import.meta.url),'utf8'));
}
function evidenceUrls(value){
  return String(value||'').split(';').map(x=>x.trim()).filter(x=>/^https?:\/\//i.test(x));
}

export function buildInterestCandidateEntities(){
  const source=readJson('../../sources/r51-r04/interests/SOURCE.json');
  const es=readJson('../../sources/r51-r04/interests/r40-interests.es.json');
  const en=readJson('../../sources/r51-r04/interests/r40-interests.en.json');
  const routes=readJson('../../sources/r51-r04/interests/r40-interest-routes.json');

  if(source?.schema!=='R51_A9_INTERESTS_DONOR_SOURCE/1.0'||source.active_for_sealed_r04!==false){
    throw new Error('invalid_interests_donor_source');
  }
  if(source.age_status!=='PENDING_R58_R59_CANONICAL_CLASSIFICATION'){
    throw new Error('unexpected_interests_age_status');
  }
  if(es?.schema!=='IRIS_R40_INTERESTS_PUBLIC/1.0'||en?.schema!=='IRIS_R40_INTERESTS_PUBLIC/1.0'||
     es.interests?.length!==72||en.interests?.length!==72||Object.keys(routes?.routes||{}).length!==72){
    throw new Error('interests_count_or_schema_mismatch');
  }

  const enById=new Map(en.interests.map(x=>[x.id,x]));
  if(enById.size!==72) throw new Error('duplicate_interest_id_en');
  const entities=[];
  let provenanceHold=0;

  for(const esRow of es.interests){
    const enRow=enById.get(esRow.id);
    const route=routes.routes?.[esRow.id];
    if(!enRow||!route?.es||!route?.en) throw new Error('interest_pair_or_route_missing:'+esRow.id);
    if(esRow.route!==route.es||enRow.route!==route.en||esRow.alternate_route!==route.en||enRow.alternate_route!==route.es){
      throw new Error('interest_route_drift:'+esRow.id);
    }
    if(esRow.group_id!==enRow.group_id) throw new Error('interest_group_drift:'+esRow.id);

    for(const [locale,row] of [['es',esRow],['en',enRow]]){
      const donorStatus=String(row.provenance?.status||'HOLD').toUpperCase();
      if(donorStatus!=='READY') provenanceHold++;
      const canonicalPath=route[locale];
      const sourcePayload={row,route:canonicalPath,source_commit:source.source_commit};
      entities.push({
        entity_id:'interest:'+row.id+':'+locale+':candidate',
        content_id:'interest:'+row.id,
        fragment_id:'interest:'+row.id+':'+locale+':candidate',
        locale,
        content_type:'interest',
        title:row.title,
        heading:row.group_title,
        text:[row.objective,row.data_required].filter(Boolean).join('\n'),
        canonical_url:ORIGIN+canonicalPath,
        source_type:'interest_r48_editorial_donor',
        source_commit:source.source_commit,
        source_version:'r48-donor@'+source.source_commit,
        source_hash:sha256Text(JSON.stringify(sourcePayload)),
        library_version:'R04_CANDIDATE_UNSEALED',
        editorial_status:'R48_DONOR_ONLY_PENDING_R59',
        audience:null,
        age_status:source.age_status,
        sensitivity:null,
        safety_status:'PENDING_R59_CANONICAL_CLASSIFICATION',
        discovery:'HOLD_PENDING_CLASSIFICATION',
        safe_variant_id:null,
        active:false,
        retrieval_eligible:false,
        provenance:[
          {
            authority:'R48_DONOR_EDITORIAL_DATA_ONLY',
            source_branch:source.source_branch,
            source_commit:source.source_commit,
            source_file:'r40-interests.'+locale+'.json'
          }
        ],
        group_id:row.group_id,
        group_title:row.group_title,
        group_route:row.group_route,
        central_focus:row.objective,
        what_can_explore:row.data_required,
        donor_experience:row.experience,
        donor_experience_status:'NON_BINDING_R48_DONOR',
        knowledge_classes:[...(row.knowledge_classes||[])],
        experience_classes:[...(row.experience_classes||[])],
        source_authority:row.provenance?.authority||null,
        source_license:row.provenance?.license||null,
        source_urls:evidenceUrls(row.provenance?.evidence),
        source_review_status:donorStatus,
        source_checked_at:row.provenance?.checked_at||null,
        workshop_connections:[...(row.workshop||[])],
        route_status:'PINNED_DONOR_ROUTE_PENDING_R59_FINALIZATION'
      });
    }
  }

  const ids=new Set(entities.map(e=>e.entity_id));
  if(ids.size!==144) throw new Error('duplicate_interest_candidate_entity_id');
  const report={
    schema:'R51_A9_INTERESTS_CANDIDATE_REPORT/1.0',
    donor_source_commit:source.source_commit,
    interest_ids:72,
    entities:144,
    locale_counts:{es:72,en:72},
    retrieval_eligible:0,
    active:0,
    age_pending_ids:72,
    age_status:source.age_status,
    provenance_hold_locale_entities:provenanceHold,
    sealed_r04_eligible:false,
    next_gate:'R59_CANONICAL_AGE_AND_SAFETY_CLASSIFICATION'
  };
  return {entities,report};
}
