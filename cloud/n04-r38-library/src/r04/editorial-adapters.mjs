import { readFile } from 'node:fs/promises';
import { normalizeRoute, routeToRepoPath, gitShow, gitPathExists, extractEditorialPage, technicalField, sha256Text } from './source-reader.mjs';

const ORIGIN='https://irisgreen.eu';
const PACKAGE_SHA='b24998fbdb5fab9b59135237ba5c5edb5d67167d8aa31b413656eb53459f6f23';
const PACKAGE_BASE_COMMIT='2e17ed3ae02e23a4fd734b00c10f843d14a19d4d';
const PACKAGE_REVIEWED_AT='2026-09-27';

async function json(url){ return JSON.parse(await readFile(url,'utf8')); }
function abs(route){ return ORIGIN + normalizeRoute(route).split('#')[0] + (normalizeRoute(route).includes('#') ? '#'+normalizeRoute(route).split('#')[1] : ''); }
function groupDeltaSections(rows=[]){
  const out=[];
  for(const row of rows){
    const heading=String(row.heading||'').trim();
    let bucket=out.at(-1);
    if(!bucket||bucket.heading!==heading){ bucket={heading,blocks:[]}; out.push(bucket); }
    if(row.text) bucket.blocks.push(String(row.text).trim());
  }
  return out.filter(x=>x.blocks.length);
}
function dataMetaById(data){
  const map=new Map();
  for(const row of data.records||[]){
    const id='data-'+String(row.n).padStart(3,'0');
    map.set(id,row);
  }
  return map;
}
function dataSources(meta){
  return (meta?.sources||[]).filter(x=>x?.url).map(x=>({url:x.url,label:x.label||''}));
}
function recordFingerprint(value){ return sha256Text(JSON.stringify(value)); }
function sourceStatusFromPage(html){
  return /\bBORRADOR\b/i.test(html) ? 'BORRADOR' : 'PUBLIC_OR_REVIEWED';
}
function safetyFields(record){
  return {
    audience:Array.isArray(record.audience)?record.audience:['TRANSVERSAL'],
    sensitivity:record.sensitivity,
    discovery:record.discovery,
    safe_variant_id:null,
    review_reason:record.classification_review||null
  };
}
function baseEntity({safety,locale,page,source,contentType,canonicalUrl,routeStatus='READY',extra={}}){
  return {
    entity_id:safety.id+':'+locale+':full',
    content_id:safety.id,
    locale,
    content_type:contentType,
    title:safety[locale==='es'?'title_es':'title_en']||page.title,
    canonical_url:canonicalUrl,
    sections:page.sections,
    sources:page.sources||[],
    source_type:contentType,
    source_commit:source.source_commit,
    source_version:source.source_version,
    source_hash:source.source_hash,
    library_version:'R04_UNSEALED',
    editorial_status:source.editorial_status,
    ...safetyFields(safety),
    published_or_reviewed_at:source.reviewed_at||null,
    active:true,
    provenance:source.provenance,
    source_language:locale,
    route_status:routeStatus,
    ...extra
  };
}
function packageSource(path,record,reviewedAt=PACKAGE_REVIEWED_AT){
  return {
    source_commit:PACKAGE_BASE_COMMIT,
    source_version:'r42-child-safe@'+PACKAGE_SHA,
    source_hash:recordFingerprint(record),
    editorial_status:'APPROVED_R42_PACKAGE',
    reviewed_at:reviewedAt,
    provenance:[{authority:'R42_CHILD_SAFE_PACKAGE',package_sha256:PACKAGE_SHA,path,record_hash:recordFingerprint(record)}]
  };
}
function gitSource(sourceSha,path,html,page){
  const hash=sha256Text(html);
  return {
    source_commit:sourceSha,
    source_version:'a2@'+sourceSha+':'+path,
    source_hash:hash,
    editorial_status:sourceStatusFromPage(html),
    reviewed_at:page.reviewed_at,
    provenance:[{authority:'A2_INTEGRATED_WEB',source_sha:sourceSha,path,sha256:hash}]
  };
}
function safeEntity(full,approval,approved){
  const copy=approved.groups?.[approval.safe_variant_group]?.[full.locale];
  if(!copy?.heading||!copy?.summary||!copy?.help) throw new Error('missing_safe_copy:'+approval.content_id+':'+full.locale);
  const entityId=full.content_id+':'+full.locale+':safe';
  full.safe_variant_id=entityId;
  return {
    entity_id:entityId,
    content_id:full.content_id,
    locale:full.locale,
    content_type:full.content_type,
    title:full.title,
    canonical_url:full.canonical_url,
    sections:[{heading:copy.heading,blocks:[copy.summary,copy.help]}],
    sources:[],
    source_type:'safe_variant',
    source_commit:PACKAGE_BASE_COMMIT,
    source_version:'r42-child-safe@'+approved.source_package.sha256,
    source_hash:approved.source_package.safe_variants_sha256,
    library_version:'R04_UNSEALED',
    editorial_status:'HUMAN_REVIEWED_S2_SAFE_VARIANT',
    audience:['INFANCIA','ADOLESCENCIA','ADULTEZ','TRANSVERSAL'],
    sensitivity:'S1_SENSITIVE',
    discovery:'NORMAL',
    safe_variant_id:null,
    review_reason:'HUMAN_REVIEWED_S2',
    published_or_reviewed_at:PACKAGE_REVIEWED_AT,
    active:true,
    provenance:[{authority:'R42_CHILD_SAFE_PACKAGE',path:approved.source_package.safe_variants_path,sha256:approved.source_package.safe_variants_sha256,safety_content_id:approval.content_id}],
    source_language:full.locale,
    route_status:full.route_status,
    derived_from_entity_id:full.entity_id,
    safe_variant_group:approval.safe_variant_group
  };
}
function packageDeltaPage(delta,locale){
  const raw=delta[locale];
  return {title:raw.title,canonical_url:ORIGIN+(locale==='es'?delta.url_es:delta.url_en),reviewed_at:PACKAGE_REVIEWED_AT,sections:groupDeltaSections(raw.sections),sources:raw.sources||[]};
}
function researchPage(row,locale){
  if(locale==='es'){
    const what=(row.text||[])[0]||'';
    const limitations=(row.text||[]).slice(1);
    return {title:row.heading||row.titleEs||row.titleOrig,reviewed_at:PACKAGE_REVIEWED_AT,sources:row.doi?[{url:row.doi,label:row.titleOrig||row.doi}]:[],sections:[
      {heading:'Qué se estudió',blocks:[what].filter(Boolean)},
      {heading:'Muestra',blocks:[row.sample].filter(Boolean)},
      {heading:'Método',blocks:[row.design].filter(Boolean)},
      {heading:'Resultados',blocks:[row.means].filter(Boolean)},
      {heading:'Limitaciones',blocks:[...limitations,row.notProven].filter(Boolean)}
    ].filter(s=>s.blocks.length)};
  }
  const what=(row.text_en||[])[0]||'';
  const limitations=(row.text_en||[]).slice(1);
  return {title:row.heading_en||row.titleOrig,reviewed_at:PACKAGE_REVIEWED_AT,sources:row.doi?[{url:row.doi,label:row.titleOrig||row.doi}]:[],sections:[
    {heading:'What was studied',blocks:[what].filter(Boolean)},
    {heading:'Sample',blocks:[row.sample_en].filter(Boolean)},
    {heading:'Method',blocks:[row.design].filter(Boolean)},
    {heading:'Results',blocks:[row.means_en].filter(Boolean)},
    {heading:'Limitations',blocks:[...limitations,row.notProven_en].filter(Boolean)}
  ].filter(s=>s.blocks.length)};
}
function supportPage(row){
  const sections=[
    ['Qué es',[row.que]],['Quién puede solicitarlo',[row.quien]],['Documentación',[row.docs]],['Cuantía',[row.cuantia]],['Observaciones',[row.obs]]
  ].map(([heading,blocks])=>({heading,blocks:blocks.filter(Boolean)})).filter(s=>s.blocks.length);
  return {title:row.name,reviewed_at:PACKAGE_REVIEWED_AT,sections,sources:[{url:row.fuente,label:row.org}]};
}

export async function buildEditorialEntities(){
  const freeze=await json(new URL('../../sources/r51-r04/SOURCE_FREEZE.json',import.meta.url));
  const safetySnapshot=await json(new URL('../../sources/r51-r04/package/content-safety-snapshot.json',import.meta.url));
  const delta=await json(new URL('../../sources/r51-r04/package/new-leaf-content-102.json',import.meta.url));
  const research=await json(new URL('../../sources/r51-r04/package/research-132.json',import.meta.url));
  const support=await json(new URL('../../sources/r51-r04/package/support-es-262.json',import.meta.url));
  const dataEs=await json(new URL('../../sources/r51-r04/package/data-es-60.json',import.meta.url));
  const approved=await json(new URL('../../sources/a9-r02-safety/APPROVED_SAFE_VARIANTS_R42.json',import.meta.url));
  const sourceSha=freeze.canonical_web_source.head;
  const deltaById=new Map(delta.records.map(r=>[r.id,r]));
  const researchById=new Map(research.records.map(r=>['research-'+String(r.n).padStart(3,'0'),r]));
  const supportById=new Map(support.records.map(r=>['support-'+r.id,r]));
  const dataById=dataMetaById(dataEs);
  const approvalById=new Map(approved.records.map(r=>[r.content_id,r]));
  const entities=[];
  const coreSurfaces=new Set(['condition','situation','library','data']);

  for(const safety of safetySnapshot.records){
    if(coreSurfaces.has(safety.surface)){
      const deltaRecord=deltaById.get(safety.id)||null;
      for(const locale of ['es','en']){
        const contentType=safety.surface==='library'?'everyday_life':safety.surface;
        let page,source,routeStatus='READY';
        const route=normalizeRoute(safety[locale==='es'?'url_es':'url_en']);
        const canonicalUrl=ORIGIN+route;
        if(deltaRecord){
          page=packageDeltaPage(deltaRecord,locale);
          source=packageSource('package/new-leaf-content-102.json',deltaRecord);
          routeStatus=gitPathExists(sourceSha,routeToRepoPath(route))?'READY':'APPROVED_PACKAGE_PENDING_A2';
        }else{
          const path=routeToRepoPath(route);
          if(!gitPathExists(sourceSha,path)) throw new Error('missing_frozen_a2_page:'+safety.id+':'+locale+':'+path);
          const html=gitShow(sourceSha,path);
          page=extractEditorialPage(html);
          source=gitSource(sourceSha,path,html,page);
          if(page.canonical_url && page.canonical_url!==canonicalUrl) throw new Error('canonical_mismatch:'+safety.id+':'+locale);
        }
        const extra={};
        if(contentType==='data'){
          const meta=dataById.get(safety.id);
          if(!meta) throw new Error('missing_data_context:'+safety.id);
          extra.population=meta.poblacion||null;
          extra.period=meta.refTemporal||meta.anioDatos||null;
          extra.jurisdiction=meta.territorio||null;
          extra.data_method=meta.metodo||null;
          extra.data_publication=meta.publicacion||null;
          extra.data_review_cycle=meta.revision||null;
          const ds=dataSources(meta);
          if(ds.length) page.sources=ds;
        }
        entities.push(baseEntity({safety,locale,page,source,contentType,canonicalUrl,routeStatus,extra}));
      }
      continue;
    }
    if(safety.surface==='research'){
      const row=researchById.get(safety.id);
      if(!row) throw new Error('missing_research:'+safety.id);
      for(const locale of ['es','en']){
        const page=researchPage(row,locale);
        let route=normalizeRoute(safety[locale==='es'?'url_es':'url_en']);
        let routeStatus='READY';
        if(locale==='en'&&!gitPathExists(sourceSha,routeToRepoPath(route))){
          route=normalizeRoute(safety.url_es);
          routeStatus='EN_ROUTE_NOT_IN_FROZEN_A2_USING_EXISTING_SOURCE_ROUTE';
        }
        entities.push(baseEntity({
          safety,locale,page,source:packageSource('package/research-132.json',row),
          contentType:'research',canonicalUrl:ORIGIN+route,routeStatus,
          extra:{source_language:locale,research_number:row.n,research_design:row.design||null,research_year:row.year||null}
        }));
      }
      continue;
    }
    if(safety.surface==='support_directory'){
      const row=supportById.get(safety.id);
      if(!row) throw new Error('missing_support:'+safety.id);
      const page=supportPage(row);
      entities.push(baseEntity({
        safety,locale:'es',page,source:packageSource('package/support-es-262.json',row),
        contentType:'support_directory',canonicalUrl:ORIGIN+normalizeRoute(safety.url_es),
        extra:{source_language:'es',jurisdiction:row.terr||row.ambito||null,authority:row.org||null}
      }));
    }
  }

  const fullEntities=[...entities];
  const safeEntities=[];
  for(const full of fullEntities.filter(e=>e.sensitivity==='S2_HIGH_SENSITIVITY')){
    const approval=approvalById.get(full.content_id);
    if(!approval) throw new Error('s2_without_reviewed_variant:'+full.content_id);
    safeEntities.push(safeEntity(full,approval,approved));
  }
  entities.push(...safeEntities);

  const full=entities.filter(e=>e.source_type!=='safe_variant');
  const contentIds=new Set(full.map(e=>e.content_id));
  const byContentType={};
  const byLocale={};
  for(const e of full){
    byContentType[e.content_type]=(byContentType[e.content_type]||new Set()).add(e.content_id);
    byLocale[e.locale]=(byLocale[e.locale]||0)+1;
  }
  const contentCounts=Object.fromEntries(Object.entries(byContentType).map(([k,v])=>[k,v.size]));
  const report={
    schema:'R51_A9_EDITORIAL_ADAPTER_REPORT/1.0',
    source_sha:sourceSha,
    source_tree:freeze.canonical_web_source.tree,
    content_ids:contentIds.size,
    full_locale_entities:full.length,
    locale_counts:byLocale,
    content_counts:contentCounts,
    safe_variant_entities:safeEntities.length,
    full_s2_locale_entities:full.filter(e=>e.sensitivity==='S2_HIGH_SENSITIVITY').length,
    routes_pending_a2:full.filter(e=>e.route_status==='APPROVED_PACKAGE_PENDING_A2').length,
    en_research_route_fallbacks:full.filter(e=>e.route_status==='EN_ROUTE_NOT_IN_FROZEN_A2_USING_EXISTING_SOURCE_ROUTE').length
  };
  return {entities,report};
}
