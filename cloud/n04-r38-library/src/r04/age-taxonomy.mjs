export const AGE_IDS=Object.freeze(['AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES']);
const CANONICAL=new Set(AGE_IDS);
const LEGACY_MAP=Object.freeze({
  inf:'AGE_0_12',
  child:'AGE_0_12',
  children:'AGE_0_12',
  INFANCIA:'AGE_0_12',
  ado:'AGE_13_17',
  teen:'AGE_13_17',
  teenagers:'AGE_13_17',
  ADOLESCENCIA:'AGE_13_17',
  adu:'AGE_18_PLUS',
  adult:'AGE_18_PLUS',
  adults:'AGE_18_PLUS',
  ADULTEZ:'AGE_18_PLUS',
  todas:'ALL_AGES',
  any:'ALL_AGES',
  TRANSVERSAL:'ALL_AGES',
  CUALQUIER_EDAD:'ALL_AGES'
});
export function canonicalizeAgeBands(input,{allowLegacy=true}={}){
  const source=Array.isArray(input)?input:[input];
  const out=[];
  for(const raw of source){
    if(typeof raw!=='string'||!raw.trim()) throw new Error('invalid_age_band');
    const value=raw.trim();
    const canonical=CANONICAL.has(value)?value:(allowLegacy?LEGACY_MAP[value]:null);
    if(!canonical) throw new Error('unknown_or_legacy_age_band:'+value);
    if(!out.includes(canonical)) out.push(canonical);
  }
  if(!out.length) throw new Error('missing_age_band');
  if(out.includes('ALL_AGES')&&out.length>1) throw new Error('all_ages_must_be_exclusive');
  return Object.freeze(out);
}
export function assertCanonicalAgeBands(input){
  return canonicalizeAgeBands(input,{allowLegacy:false});
}
export function containsLegacyAgeBand(input){
  const source=Array.isArray(input)?input:[input];
  return source.some(v=>typeof v==='string'&&!CANONICAL.has(v));
}
