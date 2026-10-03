// R66 · Sabik conversational core. Dialogue data drives intents, slots and prompts.
export function createSabikConversation({
 retrieve,
 getDialogue=()=>null,
 onState=()=>{},
 onAnswer=()=>{},
 onSources=()=>{}
}={}){
 if(typeof retrieve!=='function')throw new TypeError('R66_RETRIEVE_REQUIRED');
 let controller=null,serial=0;
 const session={turns:[],locale:'es',audience:'GENERAL'};
 const sentence=s=>String(s||'').replace(/\s+/g,' ').trim();

 function sources(result){
  const rows=Array.isArray(result?.candidates)?result.candidates:[];
  const by=new Map();
  for(const row of rows){
   if(!row?.url||by.has(row.url))continue;
   by.set(row.url,{
    url:row.url,
    title:row.title||row.heading||row.url,
    heading:row.heading||'',
    fragment_id:row.fragment_id||'',
    library_version:row.library_version||''
   });
  }
  return [...by.values()];
 }

 function compose(result,locale){
  const rows=Array.isArray(result?.candidates)?result.candidates:[];
  const first=rows.find(row=>sentence(row?.snippet));
  if(first)return sentence(first.snippet);
  return locale==='en'
   ?"I couldn't find enough information in the available Iris Green sources."
   :'No he encontrado información suficiente en las fuentes disponibles de Iris Green.';
 }

 function remember(turn){
  session.turns.push(turn);
  if(session.turns.length>8)session.turns.splice(0,session.turns.length-8);
 }

 function direct(answer,{raw,inputMode,locale,audience,kind,intent='',slots={}}){
  const turn={query:raw,inputMode,locale,audience,answer,sources:[],intent,slots:{...slots},completedAt:Date.now(),kind};
  remember(turn);
  onAnswer(answer,{inputMode,locale,kind,intent,slots});
  onSources([]);
  onState('CONFIRMAR',{phase:'answer',inputMode});
  return {answer,sources:[],result:null,kind,intent,slots};
 }
 async function submitTurn(text,{inputMode='text',locale=session.locale,audience=session.audience,explicitIntent=false}={}){
  const raw=sentence(text);
  if(!raw)throw new Error('EMPTY_TURN');
  cancel('superseded');
  const ticket=++serial;
  controller=new AbortController();
  session.locale=locale;
  session.audience=audience;
  onState('ORIENTAR',{inputMode});

  const dialogue=getDialogue(locale);
  const parsed=dialogue?.classify?.(raw)||null;

  if(parsed?.action==='stop'){
   onState('PAUSA',{phase:'stopped',inputMode});
   if(ticket===serial)controller=null;
   return {answer:'',sources:[],result:null,kind:'stop',intent:parsed.intent?.id||'',slots:parsed.slots||{}};
  }

  if(parsed?.action==='repeat'){
   onState('PRESENTE',{phase:'repeat',inputMode});
   if(ticket===serial)controller=null;
   return {answer:'',sources:[],result:null,kind:'repeat',intent:parsed.intent?.id||'',slots:parsed.slots||{}};
  }

  if(parsed?.action==='respond'){
   const answer=dialogue?.prompt?.(parsed.promptKey,{slots:parsed.slots})||'';
   const out=direct(answer,{raw,inputMode,locale,audience,kind:'social',intent:parsed.intent?.id||'',slots:parsed.slots||{}});
   if(ticket===serial)controller=null;
   return out;
  }

  if(parsed?.action==='elicit'){
   const answer=dialogue?.prompt?.(parsed.promptKey,{slots:parsed.slots})||'';
   const out=direct(answer,{raw,inputMode,locale,audience,kind:'clarify',intent:parsed.intent?.id||'',slots:parsed.slots||{}});
   if(ticket===serial)controller=null;
   return out;
  }

  if(parsed?.action==='fallback'&&parsed?.session?.pendingSlot&&parsed?.session?.promptKey){
   const answer=dialogue?.prompt?.(parsed.session.promptKey,{reprompt:true,slots:parsed.slots})||'';
   const out=direct(answer,{raw,inputMode,locale,audience,kind:'clarify',intent:parsed.session.intent||'',slots:parsed.slots||{}});
   if(ticket===serial)controller=null;
   return out;
  }

  const query=parsed?.action==='retrieve'
   ?(dialogue?.retrievalQuery?.(parsed.slots)||parsed.stripped||raw)
   :(parsed?.stripped||raw);
  const turn={query,inputMode,locale,audience,startedAt:Date.now(),intent:parsed?.intent?.id||'',slots:{...(parsed?.slots||{})}};
  try{
   onState('TRANSICION',{phase:'retrieval',inputMode});
   const result=await retrieve({query,locale,audience,explicitIntent},{signal:controller.signal});
   if(ticket!==serial||controller.signal.aborted)throw new DOMException('Aborted','AbortError');

   let src=sources(result);
   const topic=sentence(parsed?.slots?.topic);
   if(topic&&src.length){
    const norm=s=>sentence(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(norm(src[0].title)===norm(topic))src=src.slice(0,1);
   }

   if(!src.length&&topic&&dialogue){
    const answer=dialogue.prompt('search.no_result',{slots:parsed.slots})||
      (locale==='en'?'What do you need to know about '+topic+'?':'¿Qué necesitas saber sobre '+topic+'?');
    turn.answer=answer;
    turn.sources=[];
    turn.completedAt=Date.now();
    turn.kind='clarify';
    remember(turn);
    onAnswer(answer,{inputMode,locale,kind:'clarify',intent:turn.intent,slots:turn.slots});
    onSources([]);
    onState('CONFIRMAR',{phase:'answer',inputMode});
    return {answer,sources:[],result,kind:'clarify',intent:turn.intent,slots:turn.slots};
   }

   const answer=compose(result,locale);
   turn.answer=answer;
   turn.sources=src;
   turn.completedAt=Date.now();
   turn.kind='answer';
   remember(turn);
   onAnswer(answer,{inputMode,locale,kind:'answer',intent:turn.intent,slots:turn.slots});
   onSources(src);
   onState('CONFIRMAR',{phase:'answer',inputMode});
   return {answer,sources:src,result,kind:'answer',intent:turn.intent,slots:turn.slots};
  }catch(error){
   if(error?.name==='AbortError'){
    onState('PAUSA',{phase:'cancelled',inputMode});
    throw error;
   }
   onState('PAUSA',{phase:'error',inputMode});
   throw error;
  }finally{
   if(ticket===serial)controller=null;
  }
 }
 function cancel(reason='cancelled'){
  serial++;
  if(controller){controller.abort(reason);controller=null;}
 }
 function reset(){
  cancel('reset');
  session.turns.length=0;
  try{getDialogue('es')?.reset?.();}catch{}
  try{getDialogue('en')?.reset?.();}catch{}
 }
 function snapshot(){
  return {
   locale:session.locale,
   audience:session.audience,
   dialogue:getDialogue(session.locale)?.snapshot?.()||null,
   turns:session.turns.map(turn=>({...turn,sources:[...(turn.sources||[])]}))
  };
 }
 return {submitTurn,cancel,reset,snapshot};
}