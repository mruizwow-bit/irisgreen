import vm from 'node:vm';
import { gitShow, gitPathExists, sha256Text } from './source-reader.mjs';
import { assertCanonicalAgeBands } from './age-taxonomy.mjs';
import freeze from '../../sources/r51-r04/SOURCE_FREEZE.json' with { type: 'json' };

const SOURCE_SHA=freeze.canonical_web_source.head;
const ORIGIN='https://irisgreen.eu';

function parseCatalog(){
  const code=gitShow(SOURCE_SHA,'assets/data/taller-r40-catalog.js');
  const sandbox={};
  vm.runInNewContext(code,sandbox,{timeout:1500});
  const data=sandbox.IGTallerR40Catalog;
  if(!Array.isArray(data)) throw new Error('invalid_workshop_catalog');
  return {data,code};
}
function parsePaths(){
  const code=gitShow(SOURCE_SHA,'assets/data/taller-r42-paths.js');
  const sandbox={};
  vm.runInNewContext(code,sandbox,{timeout:1500});
  const data=sandbox.IGTallerR42Paths;
  if(!data||typeof data!=='object') throw new Error('invalid_workshop_paths');
  return {data,code};
}
function routeFor(row,locale){
  const slug=row.slugs?.[locale];
  if(!slug) throw new Error('workshop_missing_slug:'+row.id+':'+locale);
  return locale==='es'?'/es/taller/'+slug+'/':'/en/workshop/'+slug+'/';
}

export function buildWorkshopIntegratedEntities(){
  const {data:catalog,code:catalogCode}=parseCatalog();
  const {data:paths,code:pathsCode}=parsePaths();
  if(catalog.length!==25||Object.keys(paths).length!==25) throw new Error('workshop_integrated_count_drift');

  const entities=[];
  for(const row of catalog){
    const path=paths[row.id];
    if(!path?.all?.es||!path?.all?.en||!path?.child?.es||!path?.teen?.es||!path?.adult?.es){
      throw new Error('workshop_stage_paths_incomplete:'+row.id);
    }
    const audience=['ALL_AGES'];
    assertCanonicalAgeBands(audience);

    for(const locale of ['es','en']){
      const route=routeFor(row,locale);
      const repoPath=route.replace(/^\//,'')+'index.html';
      if(!gitPathExists(SOURCE_SHA,repoPath)) throw new Error('workshop_route_missing:'+row.id+':'+locale+':'+repoPath);
      const title=row.title?.[locale];
      const tool=row.tool?.[locale];
      const intro=path.all?.[locale];
      const starters=row.challenges?.[locale]||[];
      const exportText=row.save?.[locale]||null;
      if(!title||!tool||!intro||!starters.length||!exportText) throw new Error('workshop_bilingual_metadata_missing:'+row.id+':'+locale);
      const payload={row,path};
      entities.push({
        entity_id:'workshop:'+row.id+':'+locale,
        content_id:'workshop:'+row.id,
        fragment_id:'workshop:'+row.id+':'+locale+':main',
        locale,
        content_type:'workshop',
        title,
        heading:row.area?.[locale]||'',
        text:[intro,tool,...starters].join('\n'),
        canonical_url:ORIGIN+route,
        source_type:'workshop_catalog',
        source_commit:SOURCE_SHA,
        source_version:'a2@'+SOURCE_SHA+':assets/data/taller-r40-catalog.js+assets/data/taller-r42-paths.js',
        source_hash:sha256Text(JSON.stringify(payload)),
        library_version:'R04_UNSEALED',
        editorial_status:'A2_INTEGRATED_WEB',
        audience,
        age_classification_reason:'R42_PATHS_EXPLICIT_ALL_PLUS_STAGE_CONTEXTS_TOOLS_NOT_GATED',
        sensitivity:'S0_GENERAL',
        discovery:'NORMAL',
        safe_variant_id:null,
        active:true,
        retrieval_eligible:true,
        provenance:[
          {authority:'A2_INTEGRATED_WEB',source_sha:SOURCE_SHA,path:'assets/data/taller-r40-catalog.js'},
          {authority:'A2_INTEGRATED_WEB',source_sha:SOURCE_SHA,path:'assets/data/taller-r42-paths.js'}
        ],
        artifact_type:'creative_workshop',
        tool_description:tool,
        starters:[...starters],
        export_formats:exportText,
        connects:row.connects?.[locale]||null,
        kind:row.kind||null,
        status:row.status||null,
        stage_contexts:{
          AGE_0_12:path.child?.[locale]||null,
          AGE_13_17:path.teen?.[locale]||null,
          AGE_18_PLUS:path.adult?.[locale]||null,
          ALL_AGES:intro
        }
      });
    }
  }

  return {
    entities,
    report:{
      schema:'R51_A9_WORKSHOP_25_INTEGRATED_REPORT/1.0',
      source_sha:SOURCE_SHA,
      integrated_studio_ids:25,
      entities:50,
      locale_counts:{es:25,en:25},
      retrieval_eligible:50,
      explicit_all_ages_ids:25,
      r47_total_expected:27,
      r47_donor_pending:[
        {title_es:'Modelado 3D',title_en:'3D modelling'},
        {title_es:'Videomapping',title_en:'Video mapping'}
      ],
      catalog_sha256:sha256Text(catalogCode),
      paths_sha256:sha256Text(pathsCode),
      coverage_status:'25_A2_INTEGRATED_PLUS_2_R47_DONOR_PENDING'
    }
  };
}
