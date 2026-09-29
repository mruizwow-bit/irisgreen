import { filterBeforeRanking, assertAgeContext } from './age-retrieval.mjs';

export function termsR04(value){
  return [...new Set(String(value||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[])];
}
function sectionText(sections){
  if(!Array.isArray(sections)) return '';
  return sections.flatMap(s=>[s?.heading,...(s?.blocks||[])]).filter(Boolean).join(' ');
}
function searchText(e){
  return [
    e?.title,e?.heading,e?.text,sectionText(e?.sections),
    e?.central_focus,e?.what_can_explore,e?.tool_description,
    ...(e?.starters||[]),...(e?.steps||[]),...(e?.source_urls||[])
  ].filter(Boolean).join(' ');
}
export function searchR04Candidate(entities,args={}){
  const {query,locale='es',ageBand='GENERAL',explicitIntent=false,limit=5}=args;
  if(typeof query!=='string'||!query.trim()) throw new Error('invalid_query');
  if(!['es','en'].includes(locale)) throw new Error('invalid_locale');
  assertAgeContext(ageBand);
  if(typeof explicitIntent!=='boolean') throw new Error('invalid_explicit_intent');
  if(!Number.isInteger(limit)||limit<1||limit>20) throw new Error('invalid_limit');

  const allowed=filterBeforeRanking(entities,{ageBand,explicitIntent}).filter(e=>e.locale===locale);
  const q=termsR04(query);
  const scored=[];
  for(const e of allowed){
    const body=termsR04(searchText(e));
    const title=termsR04(e.title||'');
    const heading=termsR04(e.heading||'');
    let score=0;
    for(const term of q){
      if(body.includes(term)) score+=100;
      if(title.includes(term)) score+=400;
      if(heading.includes(term)) score+=250;
    }
    if(score>0) scored.push({entity:e,score});
  }
  scored.sort((a,b)=>b.score-a.score||String(a.entity.entity_id).localeCompare(String(b.entity.entity_id)));
  return scored.slice(0,limit).map(({entity,score})=>({
    entity_id:entity.entity_id,
    content_id:entity.content_id,
    locale:entity.locale,
    title:entity.title,
    canonical_url:entity.canonical_url,
    sensitivity:entity.sensitivity,
    audience:entity.audience,
    source_type:entity.source_type,
    score
  }));
}
