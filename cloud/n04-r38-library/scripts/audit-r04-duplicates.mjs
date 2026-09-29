import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const out=new URL('../build/r04/',import.meta.url);
const corpus=JSON.parse(await readFile(new URL('r04-partial-corpus.json',out),'utf8'));
const norm=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
const hash=v=>createHash('sha256').update(v).digest('hex');
function sectionText(sections){
  if(!Array.isArray(sections)) return '';
  return sections.flatMap(s=>[s?.heading,...(s?.blocks||[])]).filter(Boolean).join(' ');
}
function editorialText(e){
  return [
    e?.title,e?.heading,e?.text,sectionText(e?.sections),
    e?.central_focus,e?.what_can_explore,e?.tool_description,
    ...(e?.starters||[]),...(e?.steps||[])
  ].filter(Boolean).join('\n');
}

const byText=new Map();
for(const e of corpus.entities){
  if(e.active===false||e.retrieval_eligible===false) continue;
  const text=norm(editorialText(e));
  if(!text) continue;
  const key=e.locale+':'+hash(text);
  if(!byText.has(key)) byText.set(key,[]);
  byText.get(key).push(e);
}
const groups=[...byText.values()].filter(g=>g.length>1).map(g=>({
  locale:g[0].locale,
  normalized_sha256:hash(norm(editorialText(g[0]))),
  entity_ids:g.map(x=>x.entity_id),
  content_ids:[...new Set(g.map(x=>x.content_id))],
  canonical_urls:[...new Set(g.map(x=>x.canonical_url))]
}));
const crossContent=groups.filter(g=>g.content_ids.length>1);
function tokens(v){ return new Set(norm(v).match(/[\p{L}\p{N}]+/gu)||[]); }
function jaccard(a,b){
  const A=tokens(a),B=tokens(b);
  if(!A.size&&!B.size) return 1;
  let inter=0;
  for(const x of A) if(B.has(x)) inter++;
  return inter/(A.size+B.size-inter);
}
const byTitle=new Map();
for(const e of corpus.entities){
  if(e.active===false||e.retrieval_eligible===false) continue;
  const title=norm(e.title);
  if(!title) continue;
  const key=e.locale+':'+title;
  if(!byTitle.has(key)) byTitle.set(key,[]);
  byTitle.get(key).push(e);
}
const near=[];
for(const list of byTitle.values()){
  if(list.length<2) continue;
  for(let i=0;i<list.length;i++) for(let j=i+1;j<list.length;j++){
    if(list[i].content_id===list[j].content_id) continue;
    const a=editorialText(list[i]),b=editorialText(list[j]);
    const sim=jaccard(a,b);
    if(sim>=0.85&&sim<1){
      near.push({
        locale:list[i].locale,
        title:list[i].title,
        entity_ids:[list[i].entity_id,list[j].entity_id],
        content_ids:[list[i].content_id,list[j].content_id],
        canonical_urls:[list[i].canonical_url,list[j].canonical_url],
        similarity:+sim.toFixed(4),
        decision:sim>=0.98?'DEDUP_REVIEW_HIGH':'KEEP_SEPARATE_REVIEWED_SIMILAR'
      });
    }
  }
}
const report={
  schema:'R51_A9_R04_DUPLICATE_AUDIT/1.1',
  active_entities:corpus.active_entity_count,
  exact_duplicate_groups:groups.length,
  cross_content_duplicate_groups:crossContent.length,
  near_duplicate_pairs:near.length,
  groups,
  near,
  status:crossContent.length?'REVIEW_REQUIRED':'PASS'
};
await writeFile(new URL('r04-duplicate-audit.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
