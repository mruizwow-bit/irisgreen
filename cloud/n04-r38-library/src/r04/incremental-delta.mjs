import { createHash } from 'node:crypto';

export const DELTA_TYPES=Object.freeze([
  'ADDED','MODIFIED','UNCHANGED','REMOVED','SAFETY_CHANGED','AGE_CHANGED',
  'ROUTE_CHANGED','LOCALE_CHANGED','SOURCE_CHANGED'
]);

function stable(value){
  if(Array.isArray(value)) return value.map(stable);
  if(value&&typeof value==='object'){
    return Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])]));
  }
  return value;
}
function hash(value){
  return createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}
function arr(value){ return Array.isArray(value)?value:[]; }
function same(a,b){ return hash(a)===hash(b); }
function isSafeVariant(e){
  return Boolean(e?.safe_variant_for||e?.is_safe_variant||String(e?.fragment_id||'').includes('safe')||String(e?.entity_id||'').includes('safe'));
}
function safetyShape(e){
  return {
    sensitivity:e?.sensitivity??null,
    discovery:e?.discovery??null,
    safe_variant_id:e?.safe_variant_id??null,
    review_reason:e?.review_reason??null,
    safety_status:e?.safety_status??null
  };
}
function ageShape(e){ return [...arr(e?.audience)].sort(); }
function sourceShape(e){
  return {
    source_type:e?.source_type??null,
    source_commit:e?.source_commit??null,
    source_version:e?.source_version??null,
    source_urls:[...arr(e?.source_urls)].sort(),
    provenance:e?.provenance??[]
  };
}
function contentShape(e){
  const copy={...e};
  for(const k of ['library_version','source_hash','active','retrieval_eligible']) delete copy[k];
  return copy;
}
function byEntity(items){
  const map=new Map();
  for(const e of items||[]){
    if(!e?.entity_id) throw new Error('delta_entity_missing_id');
    if(map.has(e.entity_id)) throw new Error('delta_duplicate_entity_id:'+e.entity_id);
    map.set(e.entity_id,e);
  }
  return map;
}
function localesByContent(items){
  const out=new Map();
  for(const e of items||[]){
    if(!e?.content_id||!e?.locale) continue;
    if(!out.has(e.content_id)) out.set(e.content_id,new Set());
    out.get(e.content_id).add(e.locale);
  }
  return out;
}

export function diffLibraryEntities(previous,current,{fromVersion='previous',toVersion='candidate'}={}){
  const prev=byEntity(previous);
  const next=byEntity(current);
  const prevLocales=localesByContent(previous);
  const nextLocales=localesByContent(current);
  const ids=[...new Set([...prev.keys(),...next.keys()])].sort();
  const changes=[];
  const tombstones=[];

  for(const id of ids){
    const a=prev.get(id);
    const b=next.get(id);
    if(!a){
      const oldSet=prevLocales.get(b.content_id)||new Set();
      const newSet=nextLocales.get(b.content_id)||new Set();
      const localeExpansion=oldSet.size>0&&!oldSet.has(b.locale)&&newSet.has(b.locale);
      changes.push({entity_id:id,content_id:b.content_id,locale:b.locale,change_type:localeExpansion?'LOCALE_CHANGED':'ADDED',types:localeExpansion?['LOCALE_CHANGED','ADDED']:['ADDED']});
      continue;
    }
    if(!b){
      const oldSet=prevLocales.get(a.content_id)||new Set();
      const newSet=nextLocales.get(a.content_id)||new Set();
      const localeRemoval=newSet.size>0&&oldSet.has(a.locale)&&!newSet.has(a.locale);
      const type=localeRemoval?'LOCALE_CHANGED':'REMOVED';
      changes.push({entity_id:id,content_id:a.content_id,locale:a.locale,change_type:type,types:localeRemoval?['LOCALE_CHANGED','REMOVED']:['REMOVED']});
      tombstones.push({
        entity_id:id,content_id:a.content_id,locale:a.locale,
        removed_from_active_index:true,active:false,
        previous_library_version:fromVersion,next_library_version:toVersion,
        previous_source_hash:a.source_hash??null,
        canonical_url:a.canonical_url??null
      });
      continue;
    }

    const types=[];
    if(!same(safetyShape(a),safetyShape(b))||(isSafeVariant(a)||isSafeVariant(b))&&!same({text:a.text,source_hash:a.source_hash},{text:b.text,source_hash:b.source_hash})) types.push('SAFETY_CHANGED');
    if(!same(ageShape(a),ageShape(b))) types.push('AGE_CHANGED');
    if(a.canonical_url!==b.canonical_url) types.push('ROUTE_CHANGED');
    if(a.locale!==b.locale) types.push('LOCALE_CHANGED');
    if(!same(sourceShape(a),sourceShape(b))) types.push('SOURCE_CHANGED');
    if(!same(contentShape(a),contentShape(b))&&!types.length) types.push('MODIFIED');
    if(!types.length) types.push('UNCHANGED');

    const precedence=['SAFETY_CHANGED','AGE_CHANGED','ROUTE_CHANGED','LOCALE_CHANGED','SOURCE_CHANGED','MODIFIED','UNCHANGED'];
    const primary=precedence.find(x=>types.includes(x));
    changes.push({entity_id:id,content_id:b.content_id,locale:b.locale,change_type:primary,types});
  }

  const counts=Object.fromEntries(DELTA_TYPES.map(t=>[t,0]));
  for(const c of changes) counts[c.change_type]++;
  return {
    schema:'R51_A9_LIBRARY_DELTA/1.0',
    from_version:fromVersion,
    to_version:toVersion,
    changes,
    tombstones,
    counts,
    content_changed:changes.some(c=>c.change_type!=='UNCHANGED'),
    fingerprint:hash(changes)
  };
}
