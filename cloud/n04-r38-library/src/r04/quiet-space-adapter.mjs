import { readFileSync } from 'node:fs';
import { gitShow, sha256Text } from './source-reader.mjs';
import { assertCanonicalAgeBands } from './age-taxonomy.mjs';

const source=JSON.parse(readFileSync(new URL('../../sources/r51-r04/quiet-space/SOURCE.json',import.meta.url),'utf8'));
const ORIGIN='https://irisgreen.eu';

function flattenLocale(value,locale,out=[]){
  if(value==null) return out;
  if(Array.isArray(value)){ for(const v of value) flattenLocale(v,locale,out); return out; }
  if(typeof value==='object'){
    if(typeof value[locale]==='string'){
      const text=value[locale].trim();
      if(text&&!out.includes(text)) out.push(text);
      return out;
    }
    for(const v of Object.values(value)) flattenLocale(v,locale,out);
  }
  return out;
}
function moduleTitle(id,module,locale){
  return module.title?.[locale]||module.line?.[locale]||module.help?.[locale]||id;
}

export function buildQuietSpaceEditorialEntities(){
  if(source?.schema!=='R51_A9_QUIET_SPACE_SOURCE/1.0') throw new Error('invalid_quiet_space_source');
  const copy=JSON.parse(gitShow(source.source_commit,'assets/quiet-space/copy-registry.v1.json'));
  const help=JSON.parse(gitShow(source.source_commit,'assets/quiet-space/help-sources.v1.1.json'));
  if(copy.schema!=='iris.rincon.copy/1'||help.schema!=='iris.rincon.help-sources/1') throw new Error('quiet_space_schema_mismatch');
  if(copy.status!==source.crisis_copy_status) throw new Error('quiet_space_crisis_status_drift');

  const moduleIds=['M-01','M-03','M-04','M-06','M-07','M-08'];
  const audience=[...source.audience_evidence.canonical_age_bands];
  assertCanonicalAgeBands(audience);
  const sourceUrls=help.sources.map(x=>x.official_url).filter(Boolean);
  const entities=[];

  for(const id of moduleIds){
    const module=copy[id];
    if(!module) throw new Error('quiet_space_module_missing:'+id);
    const crisis=id==='M-04';
    for(const locale of ['es','en']){
      const strings=flattenLocale(module,locale);
      const title=moduleTitle(id,module,locale);
      const text=strings.filter(x=>x!==title).join('\n');
      if(!title||!text) throw new Error('quiet_space_copy_incomplete:'+id+':'+locale);
      entities.push({
        entity_id:'quiet-space:'+id.toLowerCase()+':'+locale,
        content_id:'quiet-space:'+id.toLowerCase(),
        fragment_id:'quiet-space:'+id.toLowerCase()+':'+locale+':main',
        locale,
        content_type:'quiet_space',
        title,
        heading:id,
        text,
        canonical_url:ORIGIN+source.routes[locale],
        source_type:crisis?'quiet_space_crisis_help':'quiet_space_editorial_control',
        source_commit:source.source_commit,
        source_version:'a2@'+source.source_commit+':copy-registry.v1.json',
        source_hash:sha256Text(JSON.stringify({id,locale,module})),
        library_version:'R04_UNSEALED',
        editorial_status:crisis?source.crisis_copy_status:'FROZEN_EDITORIAL_COPY',
        audience:[...audience],
        age_classification_reason:'ISSUE_307_EXPLICIT_MINORS_PLUS_ADULT_PRODUCT_SCOPE',
        sensitivity:crisis?'S2_HIGH_SENSITIVITY':'S0_GENERAL',
        discovery:crisis?'INTENTIONAL_ONLY':'NORMAL',
        safe_variant_id:null,
        review_reason:crisis?'CRISIS_COPY_REVIEW_PENDING':null,
        active:!crisis,
        retrieval_eligible:!crisis,
        provenance:crisis?[
          {authority:'A2_INTEGRATED_COPY_REGISTRY',source_sha:source.source_commit,path:'assets/quiet-space/copy-registry.v1.json'},
          {authority:'OFFICIAL_HELP_SOURCES_REGISTRY',source_sha:source.source_commit,path:'assets/quiet-space/help-sources.v1.1.json'}
        ]:[
          {authority:'A2_INTEGRATED_COPY_REGISTRY',source_sha:source.source_commit,path:'assets/quiet-space/copy-registry.v1.json'}
        ],
        jurisdiction:crisis?'España':null,
        published_or_reviewed_at:crisis?help.consulted_on:copy.frozen_on,
        source_urls:crisis?[...sourceUrls]:[],
        privacy_notes:id==='M-04'
          ? [module.privacy?.[locale]].filter(Boolean)
          : [],
        excludes:[...source.exclusions]
      });
    }
  }

  const active=entities.filter(x=>x.active);
  const held=entities.filter(x=>!x.active);
  return {
    entities,
    report:{
      schema:'R51_A9_QUIET_SPACE_EDITORIAL_REPORT/1.0',
      source_sha:source.source_commit,
      module_ids:6,
      entities:12,
      locale_counts:{es:6,en:6},
      active_entities:active.length,
      held_entities:held.length,
      active_module_ids:5,
      held_module_ids:['M-04'],
      crisis_status:source.crisis_copy_status,
      audiovisual_status:source.audiovisual_status,
      r53_media_indexed:false
    }
  };
}
