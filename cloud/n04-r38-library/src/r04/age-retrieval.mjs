import { assertCanonicalAgeBands } from './age-taxonomy.mjs';

export const AGE_CONTEXTS=Object.freeze([
  'GENERAL','AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES'
]);

export function assertAgeContext(value){
  if(!AGE_CONTEXTS.includes(value)) throw new Error('invalid_age_context');
  return value;
}

export function ageAllowsEntity(entity,ageBand='GENERAL'){
  const selected=assertAgeContext(ageBand);
  const bands=[...assertCanonicalAgeBands(entity?.audience)];
  if(selected==='GENERAL') return true;
  if(selected==='ALL_AGES') return bands.includes('ALL_AGES');
  return bands.includes(selected)||bands.includes('ALL_AGES');
}

export function safetyAllowsEntity(entity,{ageBand='GENERAL',explicitIntent=false}={}){
  const selected=assertAgeContext(ageBand);
  if(typeof explicitIntent!=='boolean') throw new Error('invalid_explicit_intent');
  const fullS2=entity?.sensitivity==='S2_HIGH_SENSITIVITY'&&entity?.source_type!=='safe_variant';
  return selected==='AGE_18_PLUS'&&explicitIntent ? true : !fullS2;
}

export function filterBeforeRanking(entities,{ageBand='GENERAL',explicitIntent=false}={}){
  const selected=assertAgeContext(ageBand);
  if(!Array.isArray(entities)) throw new Error('invalid_entities');
  return entities.filter(entity=>{
    if(entity?.active===false||entity?.retrieval_eligible===false) return false;
    if(!ageAllowsEntity(entity,selected)) return false;
    if(!safetyAllowsEntity(entity,{ageBand:selected,explicitIntent})) return false;
    return true;
  });
}
