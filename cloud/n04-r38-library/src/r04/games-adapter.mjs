import vm from 'node:vm';
import { gitShow, sha256Text } from './source-reader.mjs';
import { canonicalizeAgeBands, assertCanonicalAgeBands } from './age-taxonomy.mjs';
import freeze from '../../sources/r51-r04/SOURCE_FREEZE.json' with { type: 'json' };

const SOURCE_SHA=freeze.canonical_web_source.head;
const ORIGIN='https://irisgreen.eu';

function parseGameDataset(){
  const code=gitShow(SOURCE_SHA,'assets/data/juegos-iris-data.js');
  const sandbox={window:{IG_PICTOS:{}}};
  vm.runInNewContext(code,sandbox,{timeout:1500});
  const data=sandbox.window.IG_JUEGOS_DATA;
  if(!data||!Array.isArray(data.juegos)) throw new Error('invalid_games_dataset');
  return {data,code};
}

function firstInstruction(game,locale){
  for(const phase of game.f||[]){
    const value=phase?.i?.[locale];
    if(typeof value==='string'&&value.trim()) return value.trim();
  }
  return null;
}

export function buildGameEntities(options={}){
  const requestedIds=Array.isArray(options.ids)&&options.ids.length?new Set(options.ids):null;
  const metadata=JSON.parse(gitShow(SOURCE_SHA,'assets/data/r42-games-metadata.json'));
  const {data,code}=parseGameDataset();
  if(metadata?.schema!=='IRIS_R42_GAMES_METADATA/1.0'||metadata.games?.length!==297||data.juegos.length!==297){
    throw new Error('games_count_mismatch');
  }
  const publicById=new Map(data.juegos.map(g=>[g.s,g]));
  if(publicById.size!==297) throw new Error('duplicate_public_game_id');

  const entities=[];
  for(const meta of metadata.games){
    if(requestedIds&&!requestedIds.has(meta.id)) continue;
    const game=publicById.get(meta.id);
    if(!game) throw new Error('game_missing_from_public_dataset:'+meta.id);
    for(const locale of ['es','en']){
      const instruction=firstInstruction(game,locale);
      if(!instruction) throw new Error('game_missing_instruction:'+meta.id+':'+locale);
      const title=meta.title?.[locale];
      const purpose=meta.description?.[locale];
      if(!title||!purpose) throw new Error('game_missing_bilingual_metadata:'+meta.id+':'+locale);
      const path=locale==='es'?'/es/recursos/juegos/':'/en/resources/games/';
      const stages=[...canonicalizeAgeBands(meta.stages||[])];
      assertCanonicalAgeBands(stages);
      const skillLabel=metadata.skills?.[meta.skill]?.[locale]||meta.skill;
      const durationLabel=metadata.durations?.[meta.duration_bucket]?.[locale]||null;
      const sourcePayload={meta,game:{s:game.s,c:game.c,t:game.t,d:game.d,f:game.f,e:game.e,min:game.min}};
      entities.push({
        entity_id:'game:'+meta.id+':'+locale,
        content_id:'game:'+meta.id,
        fragment_id:'game:'+meta.id+':'+locale+':main',
        locale,
        content_type:'game',
        title,
        heading:skillLabel,
        text:purpose+'\n'+instruction,
        canonical_url:ORIGIN+path+'#juego-'+meta.id,
        source_type:'game_catalog',
        source_commit:SOURCE_SHA,
        source_version:'a2@'+SOURCE_SHA+':assets/data/r42-games-metadata.json+assets/data/juegos-iris-data.js',
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
          {authority:'A2_INTEGRATED_WEB',source_sha:SOURCE_SHA,path:'assets/data/r42-games-metadata.json'},
          {authority:'A2_INTEGRATED_WEB',source_sha:SOURCE_SHA,path:'assets/data/juegos-iris-data.js'}
        ],
        artifact_type:'interactive_game',
        life_stage:stages,
        context:meta.context,
        skill:meta.skill,
        mechanic:meta.type,
        estimated_minutes:meta.estimated_minutes,
        duration_bucket:meta.duration_bucket,
        instruction
      });
    }
  }
  const report={
    schema:'R51_A9_GAMES_ADAPTER_REPORT/1.0',
    source_sha:SOURCE_SHA,
    game_ids:new Set(entities.map(e=>e.content_id)).size,
    requested_game_ids:requestedIds?[...requestedIds].sort():null,
    entities:entities.length,
    locale_counts:{es:entities.filter(e=>e.locale==='es').length,en:entities.filter(e=>e.locale==='en').length},
    metadata_sha256:sha256Text(gitShow(SOURCE_SHA,'assets/data/r42-games-metadata.json')),
    public_dataset_sha256:sha256Text(code)
  };
  return {entities,report};
}
