import vm from 'node:vm';
import { gitShow, sha256Text } from './source-reader.mjs';
import freeze from '../../sources/r51-r04/SOURCE_FREEZE.json' with { type: 'json' };

const SOURCE_SHA=freeze.canonical_web_source.head;
const ORIGIN='https://irisgreen.eu';
const STAGE={inf:'INFANCIA',ado:'ADOLESCENCIA',adu:'ADULTEZ',todas:'TRANSVERSAL'};

function parsePublicData(){
  const pictoCode=gitShow(SOURCE_SHA,'assets/data/pictogramas-iris.js');
  const routineCode=gitShow(SOURCE_SHA,'assets/data/rutinas-imprimibles-data.js');
  const sandbox={window:{}};
  vm.runInNewContext(pictoCode,sandbox,{timeout:1500});
  vm.runInNewContext(routineCode,sandbox,{timeout:1500});
  const pictos=sandbox.window.IG_PICTOS;
  const routines=sandbox.window.IG_RUTINAS_IMPRIMIBLES_DATA;
  if(!pictos||!routines||!Array.isArray(routines.packs)) throw new Error('invalid_routine_public_data');
  return {pictos,routines,pictoCode,routineCode};
}

function labelFor(pictos,id,locale){
  const row=pictos[id];
  if(!Array.isArray(row)||row.length<3) throw new Error('missing_routine_step_label:'+id+':'+locale);
  const value=locale==='es'?row[1]:row[2];
  if(!value||!String(value).trim()) throw new Error('empty_routine_step_label:'+id+':'+locale);
  return String(value).trim();
}

export function buildRoutineEntities(){
  const manifest=JSON.parse(gitShow(SOURCE_SHA,'assets/data/r42-routine-download-manifest.json'));
  const {pictos,routines,pictoCode,routineCode}=parsePublicData();
  if(manifest?.schema!=='IRIS_R42_ROUTINE_DOWNLOADS/1.0'||manifest.records?.length!==109||routines.packs.length!==109){
    throw new Error('routine_count_mismatch');
  }
  const publicById=new Map(routines.packs.map(r=>[r.s,r]));
  if(publicById.size!==109) throw new Error('duplicate_public_routine_id');

  const entities=[];
  for(const row of manifest.records){
    const publicRow=publicById.get(row.id);
    if(!publicRow) throw new Error('routine_missing_public_pack:'+row.id);
    if(row.step_count!==row.steps.length) throw new Error('routine_step_count_mismatch:'+row.id);
    for(const locale of ['es','en']){
      const title=row.title?.[locale];
      if(!title) throw new Error('routine_missing_title:'+row.id+':'+locale);
      const stepLabels=row.steps.map(id=>labelFor(pictos,id,locale));
      const stages=[...new Set((row.stages||[]).map(s=>STAGE[s]).filter(Boolean))];
      if(!stages.length) throw new Error('routine_missing_stage:'+row.id);
      const publicUrl=locale==='es'?row.public_es:row.public_en;
      if(!publicUrl||!publicUrl.startsWith(locale==='es'?'/es/':'/en/')) throw new Error('routine_bad_public_url:'+row.id+':'+locale);
      const formats=[];
      if(row.downloadable_svg_a4) formats.push('SVG_A4');
      const attribution=String(routines.atrib?.[locale]||'').trim();
      if(!attribution) throw new Error('routine_missing_attribution:'+locale);
      const watermark=String(routines.marca||'').trim();
      if(row.watermark&&watermark!=='IRIS GREEN · irisgreen.eu') throw new Error('routine_watermark_mismatch:'+row.id);
      const sourcePayload={manifest:row,public:{s:publicRow.s,c:publicRow.c,e:publicRow.e,t:publicRow.t,pasos:publicRow.pasos}};
      entities.push({
        entity_id:'routine:'+row.id+':'+locale,
        content_id:'routine:'+row.id,
        fragment_id:'routine:'+row.id+':'+locale+':main',
        locale,
        content_type:'routine',
        title,
        heading:row.context,
        text:stepLabels.map((step,i)=>String(i+1)+'. '+step).join('\n'),
        canonical_url:ORIGIN+publicUrl,
        source_type:'routine_catalog',
        source_commit:SOURCE_SHA,
        source_version:'a2@'+SOURCE_SHA+':assets/data/r42-routine-download-manifest.json+assets/data/rutinas-imprimibles-data.js+assets/data/pictogramas-iris.js',
        source_hash:sha256Text(JSON.stringify(sourcePayload)),
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
          {authority:'A2_INTEGRATED_WEB',source_sha:SOURCE_SHA,path:'assets/data/rutinas-imprimibles-data.js'},
          {authority:'A2_INTEGRATED_WEB',source_sha:SOURCE_SHA,path:'assets/data/pictogramas-iris.js'}
        ],
        artifact_type:'downloadable_routine',
        life_stage:stages,
        context:row.context,
        steps:stepLabels,
        step_count:stepLabels.length,
        formats,
        pictogram_attribution:attribution,
        pictogram_traceability:row.pictogram_traceability,
        watermark:row.watermark?watermark:null,
        editorial_source_id:row.editorial_source_id,
        editorial_source_status:row.editorial_source_status
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
      locale_counts:{es:entities.filter(e=>e.locale==='es').length,en:entities.filter(e=>e.locale==='en').length},
      downloadable_svg_a4:manifest.records.filter(r=>r.downloadable_svg_a4).length,
      watermarked:manifest.records.filter(r=>r.watermark).length,
      manifest_sha256:sha256Text(gitShow(SOURCE_SHA,'assets/data/r42-routine-download-manifest.json')),
      public_dataset_sha256:sha256Text(routineCode),
      pictogram_dataset_sha256:sha256Text(pictoCode)
    }
  };
}
