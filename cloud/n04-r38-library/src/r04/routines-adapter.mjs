import vm from 'node:vm';
import { gitShow, sha256Text } from './source-reader.mjs';
import freeze from '../../sources/r51-r04/SOURCE_FREEZE.json' with { type: 'json' };

const SOURCE_SHA=freeze.canonical_web_source.head;
const ORIGIN='https://irisgreen.eu';
const STAGE={inf:'INFANCIA',ado:'ADOLESCENCIA',adu:'ADULTEZ',todas:'TRANSVERSAL'};

function parsePictograms(){
  const code=gitShow(SOURCE_SHA,'assets/data/pictogramas-iris.js');
  const sandbox={window:{}};
  vm.runInNewContext(code,sandbox,{timeout:1500});
  const pictos=sandbox.window.IG_PICTOS;
  if(!pictos||typeof pictos!=='object') throw new Error('invalid_pictogram_registry');
  return {pictos,code};
}
function parsePrintableData(){
  const code=gitShow(SOURCE_SHA,'assets/data/rutinas-imprimibles-data.js');
  const sandbox={window:{IG_PICTOS:{}}};
  vm.runInNewContext(code,sandbox,{timeout:1500});
  const data=sandbox.window.IG_RUTINAS_IMPRIMIBLES_DATA;
  if(!data||!Array.isArray(data.packs)) throw new Error('invalid_printable_routines_dataset');
  return {data,code};
}

export function buildRoutineEntities(){
  const manifestText=gitShow(SOURCE_SHA,'assets/data/r42-routine-download-manifest.json');
  const manifest=JSON.parse(manifestText);
  const {pictos,pictoCode}=parsePictograms();
  const {data:printable,code:printableCode}=parsePrintableData();
  if(manifest?.schema!=='IRIS_R42_ROUTINE_DOWNLOADS/1.0'||manifest.records?.length!==109) throw new Error('routine_manifest_mismatch');

  const packById=new Map(printable.packs.map(p=>[p.s,p]));
  const entities=[];
  for(const row of manifest.records){
    const pack=packById.get(row.id);
    if(!pack) throw new Error('routine_missing_printable_pack:'+row.id);
    if(JSON.stringify(pack.pasos)!==JSON.stringify(row.steps)) throw new Error('routine_step_drift:'+row.id);
    const stepRows=row.steps.map(step=>{
      const p=pictos[step];
      if(!Array.isArray(p)||p.length<3||!p[1]||!p[2]) throw new Error('routine_step_unresolved:'+row.id+':'+step);
      return {id:step,file:p[0],es:p[1],en:p[2]};
    });
    const stages=[...new Set((row.stages||[]).map(x=>STAGE[x]).filter(Boolean))];
    if(!stages.length) throw new Error('routine_missing_stage:'+row.id);
    for(const locale of ['es','en']){
      const title=row.title?.[locale];
      if(!title) throw new Error('routine_missing_title:'+row.id+':'+locale);
      const labels=stepRows.map(s=>s[locale]);
      const url=ORIGIN+(locale==='es'?row.public_es:row.public_en);
      const attribution=printable.atrib?.[locale]||null;
      if(!attribution) throw new Error('routine_missing_attribution:'+locale);
      const formats=['screen'];
      if(row.downloadable_svg_a4) formats.push('svg_a4');
      const payload={row,pack,stepRows};
      entities.push({
        entity_id:'routine:'+row.id+':'+locale,
        content_id:'routine:'+row.id,
        fragment_id:'routine:'+row.id+':'+locale+':main',
        locale,
        content_type:'routine',
        title,
        heading:row.context,
        text:labels.join(' → '),
        canonical_url:url,
        source_type:'routine_catalog',
        source_commit:SOURCE_SHA,
        source_version:'a2@'+SOURCE_SHA+':assets/data/r42-routine-download-manifest.json+assets/data/pictogramas-iris.js+assets/data/rutinas-imprimibles-data.js',
        source_hash:sha256Text(JSON.stringify(payload)),
        library_version:'R04_UNSEALED',
        editorial_status:'A2_INTEGRATED_WEB',
        audience:stages,
        sensitivity:'S0_GENERAL',
        discovery:'NORMAL',
        safe_variant_id:null,
        review_reason:'R42_TRANSVERSAL_POLICY',
        published_or_reviewed_at:null,
        active:true,
        provenance:[
          {authority:'A2_INTEGRATED_WEB',source_sha:SOURCE_SHA,path:'assets/data/r42-routine-download-manifest.json'},
          {authority:'A2_INTEGRATED_WEB',source_sha:SOURCE_SHA,path:'assets/data/pictogramas-iris.js'},
          {authority:'A2_INTEGRATED_WEB',source_sha:SOURCE_SHA,path:'assets/data/rutinas-imprimibles-data.js'}
        ],
        artifact_type:'routine',
        life_stage:stages,
        context:row.context,
        steps:labels,
        step_ids:[...row.steps],
        formats,
        watermark:row.watermark===true,
        attribution,
        pictogram_traceability:row.pictogram_traceability,
        editorial_source_status:row.editorial_source_status||null
      });
    }
  }
  return {
    entities,
    report:{
      schema:'R51_A9_ROUTINES_ADAPTER_REPORT/1.0',
      source_sha:SOURCE_SHA,
      routine_ids:manifest.records.length,
      entities:entities.length,
      step_references:manifest.records.reduce((n,r)=>n+(r.steps?.length||0),0),
      locale_counts:{es:entities.filter(e=>e.locale==='es').length,en:entities.filter(e=>e.locale==='en').length},
      manifest_sha256:sha256Text(manifestText),
      pictogram_registry_sha256:sha256Text(pictoCode),
      printable_dataset_sha256:sha256Text(printableCode)
    }
  };
}
