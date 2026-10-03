// R66 · Sabik conversational core. One turn path for text and voice.
export function createSabikConversation({retrieve,onState=()=>{},onAnswer=()=>{},onSources=()=>{}}={}){
 if(typeof retrieve!=='function') throw new TypeError('R66_RETRIEVE_REQUIRED');
 let controller=null,serial=0;
 const session={turns:[],locale:'es',audience:'GENERAL',pendingTopic:''};
 const sentence=s=>String(s||'').replace(/\s+/g,' ').trim();
 const aliases='(?:sabik|sábik|savik|sabick|sabyck|xavid|xavik|xabik|savid|tanik|tanick)';

 function stripAddress(value,locale){
  let q=sentence(value);
  const greeting=locale==='en'
   ?/^(?:hello|hi|hey)\b[\s,.:;!?-]*/i
   :/^(?:hola|oye|buenas)\b[\s,.:;!?¡¿-]*/i;
  q=q.replace(greeting,'');
  q=q.replace(new RegExp('^'+aliases+'\\b[\\s,.:;!?¡¿-]*','i'),'');
  q=q.replace(new RegExp('[\\s,.:;!?¡¿-]*'+aliases+'\\b[\\s,.:;!?¡¿-]*$','i'),'');
  return sentence(q);
 }

 function broadLookup(value,locale){
  const q=stripAddress(value,locale).replace(/[.!]+$/,'').trim();
  const re=locale==='en'
   ?/^(?:search(?: for)?|find|look up|tell me about|information about)\s+(.+)$/i
   :/^(?:busca|buscar|búscame|buscame|encuentra|háblame de|hablame de|información sobre|informacion sobre)\s+(.+)$/i;
  const m=q.match(re);
  return m?sentence(m[1]).replace(/[.!]+$/,''):null;
 } function socialReply(value,locale){
  const q=stripAddress(value,locale).toLowerCase();
  const raw=sentence(value).toLowerCase();
  if(!q){
   return locale==='en'?'Hi. What do you need?':'Hola. ¿Qué necesitas?';
  }
  if(locale==='en'){
   if(/^(?:answer|respond|listen|can you hear me|are you there)\b/.test(q)||/\b(?:answer|respond)\b/.test(raw)) return "Yes. I'm listening.";
   if(/^(?:thanks|thank you)\b/.test(q)) return "You're welcome.";
  }else{
   if(/^(?:responde|contesta|escucha|me oyes|¿me oyes|estas ahi|estás ahí)\b/.test(q)||/\b(?:responde|contesta)\b/.test(raw)) return 'Sí. Te escucho.';
   if(/^(?:gracias|muchas gracias)\b/.test(q)) return 'De nada.';
  }
  return null;
 }

 function sources(result){
  const rows=Array.isArray(result?.candidates)?result.candidates:[];
  const by=new Map();
  for(const r of rows){
   if(!r?.url||by.has(r.url)) continue;
   by.set(r.url,{url:r.url,title:r.title||r.heading||r.url,heading:r.heading||'',fragment_id:r.fragment_id||'',library_version:r.library_version||''});
  }
  return [...by.values()];
 }

 function compose(result,locale){
  const rows=Array.isArray(result?.candidates)?result.candidates:[];
  const first=rows.find(r=>sentence(r?.snippet));
  if(!first) return locale==='en'
   ?"I couldn't find enough information in the available Iris Green sources."
   :'No he encontrado información suficiente en las fuentes disponibles de Iris Green.';
  return sentence(first.snippet);
 }

 function remember(turn){
  session.turns.push(turn);
  if(session.turns.length>8) session.turns.splice(0,session.turns.length-8);
 } async function emitDirect(answer,{raw,inputMode,locale,audience,kind='social'}){
  const turn={query:raw,inputMode,locale,audience,answer,sources:[],completedAt:Date.now(),kind};
  remember(turn);
  onAnswer(answer,{inputMode,locale,kind});
  onSources([]);
  onState('CONFIRMAR',{phase:'answer',inputMode});
  return {answer,sources:[],result:null,kind};
 }

 async function submitTurn(text,{inputMode='text',locale=session.locale,audience=session.audience,explicitIntent=false}={}){
  const raw=sentence(text);
  if(!raw) throw new Error('EMPTY_TURN');
  cancel('superseded');
  const ticket=++serial;
  controller=new AbortController();
  session.locale=locale;
  session.audience=audience;
  onState('ORIENTAR',{inputMode});

  const directTopic=broadLookup(raw,locale);
  if(directTopic){
   session.pendingTopic=directTopic;
   const answer=locale==='en'
    ?`Sure. What do you need to know about ${directTopic}?`
    :`Claro. ¿Qué necesitas saber sobre ${directTopic}?`;
   const out=await emitDirect(answer,{raw,inputMode,locale,audience,kind:'clarify'});
   if(ticket===serial) controller=null;
   return out;
  }

  const social=socialReply(raw,locale);
  if(social){
   const out=await emitDirect(social,{raw,inputMode,locale,audience,kind:'social'});
   if(ticket===serial) controller=null;
   return out;
  }

  const addressed=stripAddress(raw,locale);
  if(session.pendingTopic&&!addressed){
   onState('PRESENTE',{phase:'awaiting-followup',inputMode});
   if(ticket===serial) controller=null;
   return {answer:'',sources:[],result:null,kind:'listen-again',topic:session.pendingTopic};
  }  const topic=session.pendingTopic;
  const q=topic?`${topic}. ${addressed}`:addressed;
  if(!q){
   const answer=locale==='en'?'What would you like to know?':'¿Qué quieres saber?';
   const out=await emitDirect(answer,{raw,inputMode,locale,audience,kind:'clarify'});
   if(ticket===serial) controller=null;
   return out;
  }

  const turn={query:q,inputMode,locale,audience,startedAt:Date.now()};
  try{
   onState('TRANSICION',{phase:'retrieval',inputMode});
   const result=await retrieve({query:q,locale,audience,explicitIntent},{signal:controller.signal});
   if(ticket!==serial||controller.signal.aborted) throw new DOMException('Aborted','AbortError');

   let src=sources(result);
   if(topic&&src.length){
    const norm=s=>sentence(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(norm(src[0].title)===norm(topic)) src=src.slice(0,1);
   }

   if(topic&&!src.length){
    session.pendingTopic=topic;
    const answer=locale==='en'
     ?`I'm still with you on ${topic}. Could you repeat what you want to know?`
     :`Sigo contigo en ${topic}. ¿Puedes repetir qué quieres saber?`;
    turn.answer=answer;turn.sources=[];turn.completedAt=Date.now();turn.kind='clarify';
    remember(turn);onAnswer(answer,{inputMode,locale,kind:'clarify'});onSources([]);
    onState('CONFIRMAR',{phase:'answer',inputMode});
    return {answer,sources:[],result,kind:'clarify'};
   }

   if(topic) session.pendingTopic='';
   const answer=compose(result,locale);
   turn.answer=answer;turn.sources=src;turn.completedAt=Date.now();turn.kind='answer';
   remember(turn);onAnswer(answer,{inputMode,locale,kind:'answer'});onSources(src);
   onState('CONFIRMAR',{phase:'answer',inputMode});
   return {answer,sources:src,result,kind:'answer'};
  }catch(error){
   if(error?.name==='AbortError'){onState('PAUSA',{phase:'cancelled',inputMode});throw error;}
   onState('PAUSA',{phase:'error',inputMode});throw error;
  }finally{
   if(ticket===serial) controller=null;
  }
 } function cancel(reason='cancelled'){
  serial++;
  if(controller){controller.abort(reason);controller=null;}
 }
 function reset(){
  cancel('reset');
  session.turns.length=0;
  session.pendingTopic='';
 }
 function snapshot(){
  return {
   locale:session.locale,
   audience:session.audience,
   pendingTopic:session.pendingTopic,
   turns:session.turns.map(t=>({...t,sources:[...(t.sources||[])]}))
  };
 }
 return {submitTurn,cancel,reset,snapshot};
}