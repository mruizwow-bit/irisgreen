// R66 · Sabik conversational core. One turn path for text and voice.
export function createSabikConversation({retrieve,onState=()=>{},onAnswer=()=>{},onSources=()=>{}}={}){
 if(typeof retrieve!=='function') throw new TypeError('R66_RETRIEVE_REQUIRED');
 let controller=null,serial=0;
 const session={turns:[],locale:'es',audience:'GENERAL'};
 const sentence=(s)=>String(s||'').replace(/\s+/g,' ').trim();
 function compose(result,locale){
   const rows=Array.isArray(result?.candidates)?result.candidates:[];
   if(!rows.length) return locale==='en'
     ?"I couldn't find enough information in the available Iris Green sources."
     :'No he encontrado información suficiente en las fuentes disponibles de Iris Green.';
   const seen=new Set(),bits=[];
   for(const row of rows){
     const t=sentence(row.snippet);
     if(!t||seen.has(t)) continue; seen.add(t); bits.push(t);
     if(bits.length===2) break;
   }
   if(!bits.length) return locale==='en'
     ?"I found sources, but not enough text to give you a reliable answer."
     :'He encontrado fuentes, pero no texto suficiente para darte una respuesta fiable.';
   return bits.join(' ');
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
 async function submitTurn(text,{inputMode='text',locale=session.locale,audience=session.audience,explicitIntent=false}={}){
   const q=sentence(text);
   if(!q) throw new Error('EMPTY_TURN');
   cancel('superseded');
   const ticket=++serial; controller=new AbortController();
   session.locale=locale; session.audience=audience;
   onState('ORIENTAR',{inputMode});
   const turn={query:q,inputMode,locale,audience,startedAt:Date.now()};
   try{
     onState('TRANSICION',{phase:'retrieval',inputMode});
     const result=await retrieve({query:q,locale,audience,explicitIntent},{signal:controller.signal});
     if(ticket!==serial||controller.signal.aborted) throw new DOMException('Aborted','AbortError');
     const answer=compose(result,locale),src=sources(result);
     turn.answer=answer;turn.sources=src;turn.completedAt=Date.now();
     session.turns.push(turn);
     if(session.turns.length>8) session.turns.splice(0,session.turns.length-8);
     onAnswer(answer,{inputMode,locale});
     onSources(src);
     onState('CONFIRMAR',{phase:'answer',inputMode});
     return {answer,sources:src,result};
   }catch(error){
     if(error?.name==='AbortError'){onState('PAUSA',{phase:'cancelled',inputMode});throw error;}
     onState('PAUSA',{phase:'error',inputMode});throw error;
   }finally{if(ticket===serial)controller=null;}
 }
 function cancel(reason='cancelled'){serial++;if(controller){controller.abort(reason);controller=null;}}
 function reset(){cancel('reset');session.turns.length=0;}
 function snapshot(){return {locale:session.locale,audience:session.audience,turns:session.turns.map(t=>({...t,sources:[...(t.sources||[])]}))};}
 return {submitTurn,cancel,reset,snapshot};
}
