const stop=new Set('que qué cual cuál quien quién como cómo es son ser estar esta está esto eso el la los las un una uno unos unas de del a al en y o por para con sin me mi mis te tu tus se su sus yo tengo tiene puedo puedes sobre quiero quisiera saber buscar busca informacion información explica explicame explícamelo dime mas más hacer what which who how is are am be this that the a an of to in and or for with without i my me you your it its can could would about want know find search information tell more do does please porfavor favor'.split(' '));
export const words=text=>String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
export const queryTerms=text=>[...new Set(words(text).filter(w=>!stop.has(w)&&w.length>1))];
export function relevantCandidates(result,query){
 const terms=queryTerms(query);
 if(!terms.length)return [];
 return (result?.candidates||[]).filter(row=>{
  const content=new Set(words([row.title,row.heading,row.snippet].join(' ')));
  return terms.filter(t=>content.has(t)).length>=Math.ceil(terms.length*.65);
 });
}
