// R66 · Sabik conversational core. One turn path for text and voice.
export function createSabikConversation({retrieve,onState=()=>{},onAnswer=()=>{},onSources=()=>{}}={}){
 if(typeof retrieve!=='function') throw new TypeError('R66_RETRIEVE_REQUIRED');
 let controller=null,serial=0;
 const session={turns:[],locale:'es',audience:'GENERAL',pendingTopic:''};
 const sentence=(s)=>String(s||'').replace(/\s+/g,' ').trim();
 const aliases='(?:sabik|sábik|savik|sabick|sabyck|xavid|xavik|xabik|savid)';
 function stripAddress(value,locale){
  let q=sentence(value);
  const greeting=locale==='en'?/^(?:hello|hi|hey)\b[\s,.:;!?-]*/i:/^(?:hola|oye|buenas)\b[\s,.:;!?¡¿-]*/i;
  q=q.replace(greeting,'');
  q=q.replace(new RegExp('^'+aliases+'\\b[\\s,.:;!?¡¿-]*','i'),'');
  return sentence(q);
 }
 function broadLookup(value,locale){
  const q=stripAddress(value,locale).replace(/[.!]+$/,'').trim();
  const re=locale==='en'
   ?/^(?:search(?: for)?|find|look up|tell me about|information about)\s+(.+)$/i
   :/^(?:busca|buscar|búscame|buscame|encuentra|háblame de|hablame de|información sobre|informacion sobre)\s+(.+)$/i;
  const m=q.match(re);if(!m)return null;
  const topic=sentence(m[1]).replace(/[.!]+$/,'');
  const question=locale==='en'?/^(?:what|how|why|when|where|which|who)\b/i:/^(?:qué|que|cómo|como|por qué|por que|cuándo|cuando|dónde|donde|cuál|cual|quién|quien)\b/i;
  return topic&&!question.test(topic)?topic:null;
 } function compose(result,locale){
  const rows=Array.isArray(result?.candidates)?result.candidates:[];
  if(!rows.length) return locale==='en'
    ?"I couldn't find enough information in the available Iris Green sources."
    :'No he encontrado información suficiente en las fuentes disponibles de Iris Green.';
  const first=rows.find(r=>sentence(r?.snippet));
  if(!first) return locale==='en'
    ?"I found sources, but not enough text to give you a reliable answer."
    :'He encontrado fuentes, pero no texto suficiente para darte una respuesta fiable.';
  const text=sentence(first.snippet);
  return locale==='en'
    ?'Here is the main point: '+text
    :'La idea principal es esta: '+text;
 }
 function sources(result){
  const rows=Array.isArray(result?.candidates)?result.candidates:[];
  const by=new Map();
  for(const r of rows){
   if(!r?.url||by.has(r.url))continue;
   by.set(r.url,{url:r.url,title:r.title||r.heading||r.url,heading:r.heading||'',fragment_id:r.fragment_id||'',library_version:r.library_version||''});
  }
  return [...by.values()];
 }
 function remember(turn){
  session.turns.push(turn);
  if(session.turns.length>8)session.turns.splice(0,session.turns.length-8);
 } async function submitTurn(text,{inputMode='text',locale=session.locale,audience=session.audience,explicitIntent=false}={}){
  const raw=sentence(text);if(!raw)throw new Error('EMPTY_TURN');
  cancel('superseded');
  const ticket=++serial;controller=new AbortController();
  session.locale=locale;session.audience=audience;
  onState('ORIENTAR',{inputMode});
  const directTopic=broadLookup(raw,locale);
  if(directTopic){
   session.pendingTopic=directTopic;
   const answer=locale==='en'
    ?`Sure. What do you need to know about ${directTopic}?`
    :`Claro. ¿Qué necesitas saber sobre ${directTopic}?`;
   const turn={query:raw,inputMode,locale,audience,answer,sources:[],completedAt:Date.now(),kind:'clarify'};
   remember(turn);onAnswer(answer,{inputMode,locale,kind:'clarify'});onSources([]);
   onState('CONFIRMAR',{phase:'answer',inputMode});
   if(ticket===serial)controller=null;
   return {answer,sources:[],result:null,kind:'clarify'};
  }
  let q=stripAddress(raw,locale);
  if(session.pendingTopic){
   q=locale==='en'?`${session.pendingTopic}. ${q}`:`${session.pendingTopic}. ${q}`;
   session.pendingTopic='';
  }
  const turn={query:q,inputMode,locale,audience,startedAt:Date.now()};
  try{   onState('TRANSICION',{phase:'retrieval',inputMode});
   const result=await retrieve({query:q,locale,audience,explicitIntent},{signal:controller.signal});
   if(ticket!==serial||controller.signal.aborted)throw new DOMException('Aborted','AbortError');
   const answer=compose(result,locale),src=sources(result);
   turn.answer=answer;turn.sources=src;turn.completedAt=Date.now();turn.kind='answer';
   remember(turn);
   onAnswer(answer,{inputMode,locale,kind:'answer'});
   onSources(src);
   onState('CONFIRMAR',{phase:'answer',inputMode});
   return {answer,sources:src,result,kind:'answer'};
  }catch(error){
   if(error?.name==='AbortError'){onState('PAUSA',{phase:'cancelled',inputMode});throw error;}
   onState('PAUSA',{phase:'error',inputMode});throw error;
  }finally{if(ticket===serial)controller=null;}
 }
 function cancel(reason='cancelled'){serial++;if(controller){controller.abort(reason);controller=null;}}
 function reset(){cancel('reset');session.turns.length=0;session.pendingTopic='';}
 function snapshot(){return {locale:session.locale,audience:session.audience,pendingTopic:session.pendingTopic,turns:session.turns.map(t=>({...t,sources:[...(t.sources||[])]}))};}
 return {submitTurn,cancel,reset,snapshot};
}

[executed on device: IrisGreen (3f6b1cbe-9324-4e6b-9df9-94b7628af125)]