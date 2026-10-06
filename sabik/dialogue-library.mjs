const DEFAULT_BASE='./assets/dialogue-r01';

function norm(value){
 return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}\s¿?¡!.,;:'"-]/gu,' ').replace(/\s+/g,' ').trim();
}
function clean(value){return String(value||'').replace(/\s+/g,' ').trim();}
function escapeRegExp(value){return String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function compile(pattern){try{return new RegExp(pattern,'iu');}catch{return null;}}

function stripAssistant(text,model){
 let q=clean(text);
 const aliases=(model?.assistant_aliases||[]).map(escapeRegExp);
 if(!aliases.length)return q;
 const names='(?:'+aliases.join('|')+')';
 q=q.replace(new RegExp('^(hola|buenas|hello|hi|hey)[,\\s]+'+names+'\\b[\\s,.:;!?¡¿-]*','iu'),'$1 ');
 q=q.replace(new RegExp('^'+names+'\\b[\\s,.:;!?¡¿-]*','iu'),'');
 q=q.replace(new RegExp('[\\s,.:;!?¡¿-]*'+names+'\\b[\\s,.:;!?¡¿-]*$','iu'),'');
 return clean(q);
}

function fill(template,slots={}){
 return String(template||'').replace(/\{([a-z0-9_]+)\}/gi,(_,key)=>clean(slots[key]||''));
}

function nextVariant(bucket,reprompt=false){
 const list=bucket?.[reprompt?'reprompt':'initial']||[];
 if(!list.length)return '';
 const current=Number(bucket.__cursor||0);
 const value=list[current%list.length];
 bucket.__cursor=(current+1)%list.length;
 return value;
}

function canonicalAspect(text,variables,language){
 const q=norm(text);
 const values=variables?.slots?.aspect?.values||{};
 for(const [id,meta] of Object.entries(values)){
  const words=meta?.[language]||[];
  if(words.some(word=>q===norm(word)||q.includes(norm(word))))return id;
 }
 return '';
}

function extractSlots(match,intent,variables,language,session){
 const slots={...(session?.slots||{})};
 for(const key of intent?.clear_slots||[])delete slots[key];
 if(intent?.fixed_slots)Object.assign(slots,intent.fixed_slots);
 const groups=match?.groups||{};
 for(const [key,value] of Object.entries(groups)){
  if(value)slots[key]=clean(value).replace(/[.!?]+$/,'');
 }
 if(groups.aspect)slots.aspect=canonicalAspect(groups.aspect,variables,language)||slots.aspect;
 return slots;
}

function missingRequiredParameter(intent,slots){
 for(const key of intent?.required_parameters||[]){
  if(!clean(slots?.[key]))return key;
 }
 return '';
}

export function createDialogueLibrary({model,variables}={}){
 if(!model||!variables)throw new TypeError('DIALOGUE_LIBRARY_DATA_REQUIRED');
 const session={intent:'',slots:{},promptKey:'',turn:0};

 function classify(text){
  const stripped=stripAssistant(text,model);
  const candidate=clean(stripped).replace(/[¿¡]/g,'').replace(/^[?!.,;:\s]+|[?!.,;:\s]+$/g,'');
  const intents=[...(model?.intents||[])].sort((a,b)=>(b.priority||0)-(a.priority||0));
  for(const intent of intents){
   for(const pattern of intent.patterns||[]){
    const re=compile(pattern);
    if(!re)continue;
    const match=re.exec(candidate);
    if(!match)continue;
    const slots=extractSlots(match,intent,variables,model.language,session);
    session.intent=intent.id;
    session.slots=slots;
    const missing=missingRequiredParameter(intent,slots);
    session.promptKey=missing?(intent.when_missing_parameter?.[missing]||''):(intent.prompt||'');
    session.turn+=1;
    return {intent,match,stripped,candidate,slots:{...slots},missing,promptKey:session.promptKey,action:missing?'need_parameter':intent.action||'retrieve',session:snapshot()};
   }
  }
  if(!candidate){
   if(session.slots.topic){
    session.turn+=1;
    return {intent:{id:'conversation.attention',action:'listen_again'},stripped,candidate,slots:{...session.slots},missing:'',promptKey:session.promptKey,action:'listen_again',session:snapshot()};
   }
   session.intent='social.attention';
   session.promptKey='social.attention.response';
   session.turn+=1;
   return {intent:{id:'social.attention',action:'respond'},stripped,candidate,slots:{...session.slots},missing:'',promptKey:session.promptKey,action:'respond',session:snapshot()};
  }
  const aspect=canonicalAspect(stripped,variables,model.language);
  if(aspect&&session.slots.topic){
   session.intent='information.aspect';
   session.slots.aspect=aspect;
   session.promptKey='';
   session.turn+=1;
   return {intent:{id:'information.aspect',action:'retrieve'},stripped,candidate,slots:{...session.slots},missing:'',promptKey:'',action:'retrieve',session:snapshot()};
  }
  return {intent:null,stripped,candidate,slots:{...session.slots},missing:'',promptKey:'',action:'fallback',session:snapshot()};
 }

 function prompt(key,{reprompt=false,slots=session.slots}={}){
  return fill(nextVariant(model.prompts?.[key],reprompt),slots);
 }
 function retrievalQuery(slots=session.slots){
  const topic=clean(slots?.topic);
  const aspect=clean(slots?.aspect);
  if(!topic)return '';
  if(!aspect||aspect==='definition')return topic;
  const term=variables?.slots?.aspect?.values?.[aspect]?.search_terms?.[model.language]?.[0]||aspect;
  return clean(`${topic} ${term}`);
 }
 function setSlot(key,value){if(key)session.slots[key]=clean(value);}
 function clearSlot(key){delete session.slots[key];}
 function reset(){session.intent='';session.slots={};session.promptKey='';session.turn=0;}
 function snapshot(){return {intent:session.intent,slots:{...session.slots},promptKey:session.promptKey,turn:session.turn};}
 return {classify,prompt,retrievalQuery,setSlot,clearSlot,reset,snapshot,stripAssistant:text=>stripAssistant(text,model)};
}

export async function loadDialogueLibrary({language='es',base=DEFAULT_BASE,fetchImpl=globalThis.fetch?.bind(globalThis)}={}){
 if(typeof fetchImpl!=='function')throw new TypeError('DIALOGUE_LIBRARY_FETCH_REQUIRED');
 const lang=String(language||'es').toLowerCase().startsWith('en')?'en':'es';
 const [modelRes,varRes]=await Promise.all([
  fetchImpl(`${base}/dialogue-model.${lang}.json`,{cache:'no-store'}),
  fetchImpl(`${base}/dialogue-variables.json`,{cache:'no-store'})
 ]);
 if(!modelRes.ok||!varRes.ok)throw new Error('DIALOGUE_LIBRARY_UNAVAILABLE');
 return createDialogueLibrary({model:await modelRes.json(),variables:await varRes.json()});
}
