import {createRetrievalQuery} from './retrieval-bridge.browser.mjs';
import {createAuthorizedTransport} from './authorized-transport.mjs';
import {connectionConfig,sealedLibrary} from './mount-config.mjs';
import {createSabikVoice} from './audio-r01.mjs';
import {createSabikConversation} from './conversation-core-r66.mjs';

const TEXT={
 es:{
  subtitle:'Asistente de Iris Green',
  unavailable:'Sabik está disponible con las fuentes seguras locales de Iris Green.',
  available:'Sabik está disponible.',
  hide:'Ocultar',show:'Mostrar',
  welcome:'Puedo ayudarte a buscar información.',conversationWelcome:'Puedes preguntarme por escrito. Respondo con información de Iris Green y te enseño las fuentes.',
  explanation:'Si la biblioteca Cloud no responde, uso el índice seguro local de Iris Green. No invento una respuesta cuando no encuentro información suficiente.',
  connected:'Puedo responder con las fuentes de Iris Green. No hago diagnósticos.',
  label:'¿Qué necesitas?',help:'Hasta 300 caracteres. Enter añade una línea; Ctrl+Enter envía.',send:'Enviar',
  cancel:'Cancelar respuesta',low:'Desactivar movimiento',reset:'Empezar de nuevo',
  motion:'Movimiento de Sabik',normal:'Normal',reduced:'Reducido',still:'Sin movimiento',motionHelp:'Movimiento breve cuando cambia el estado.',
  memory:'No se guarda el historial entre sesiones.',limits:'Comprueba la información importante en las fuentes. Sabik no realiza diagnósticos.',
  browse:'Explorar los recursos',placeholder:'Por ejemplo: el ruido me agota',cleared:'La consulta y los resultados se han borrado.',
  busy:'Buscando en las fuentes de Iris Green.',error:'No se pudo conectar. Puedes intentarlo de nuevo o usar el buscador de Iris Green.',
  empty:'Escribe qué necesitas.',spanish:'Algunas fuentes originales están en español.',
  voice:'Voz de Sabik',voiceOn:'Activada',voiceOff:'Desactivada',
  voiceHelp:'Los mensajes fijos usan la voz aprobada de Sabik. Las respuestas conversacionales dinámicas por voz todavía no sustituyen al texto.',
  voiceError:'La voz no se pudo activar.',sources:'Fuentes'
 },
 en:{
  subtitle:'Iris Green assistant',
  unavailable:'Sabik is available with Iris Green’s safe local sources.',available:'Sabik is available.',hide:'Hide',show:'Show',
  welcome:'I can help you find information.',conversationWelcome:'You can ask me in writing. I answer with Iris Green information and show the sources.',
  explanation:'If the Cloud library is unavailable, I use Iris Green’s safe local index. I do not invent an answer when there is not enough information.',
  connected:"I can answer using Iris Green's sources. I don't make diagnoses.",
  label:'What do you need?',help:'Up to 300 characters. Enter adds a new line; Ctrl+Enter sends.',send:'Send',
  cancel:'Cancel response',low:'Turn off motion',reset:'Start again',motion:'Sabik motion',normal:'Normal',reduced:'Reduced',still:'No motion',motionHelp:'Brief motion when the state changes.',
  memory:'No history is saved between sessions.',limits:'Check important information against the sources. Sabik does not make diagnoses.',
  browse:'Explore resources',placeholder:'For example: noise drains me',cleared:'Your query and results have been cleared.',
  busy:'Searching Iris Green sources.',error:"Could not connect. You can try again or use Iris Green's search.",
  empty:'Write what you need.',spanish:'Some original sources are in Spanish.',
  voice:'Sabik voice',voiceOn:'On',voiceOff:'Off',
  voiceHelp:'Fixed system messages use Sabik’s approved voice. Dynamic spoken conversational answers do not replace the text yet.',
  voiceError:'Sabik voice could not be turned on.',sources:'Sources'
 }
};

function mount(){
 const aside=document.querySelector('.sabik-panel');if(!aside)return;
 const $=s=>aside.querySelector(s),input=$('#sabik-input'),announcement=$('#sabik-announcement'),root=$('#sabik-results'),voiceButton=$('#sabik-voice'),voiceState=$('#sabik-voice-state');
 const connection=connectionConfig.enabled?createAuthorizedTransport({cloudOrigin:connectionConfig.cloudOrigin}):null;
 const cloudQuery=createRetrievalQuery({transport:connection?.transport||(()=>Promise.reject(new Error('LIBRARY_UNAVAILABLE'))),library:sealedLibrary});
 let lang=document.documentElement.lang.startsWith('en')?'en':'es',busy=false;
 const strings=()=>TEXT[lang],visual=(state,options)=>window.SabikWebPresentation?.setSabikState(state,options),present=()=>visual('presente',{force:true});
 let voice;

 function voiceEnabled(){return Boolean(voice?.getState().enabled);}
 function syncVoice(state){
  const on=Boolean(state?.enabled??voiceEnabled()),playing=Boolean(state?.playing);
  voiceButton.setAttribute('aria-pressed',String(on));voiceState.textContent=on?strings().voiceOn:strings().voiceOff;
  voiceButton.setAttribute('aria-label',`${strings().voice}: ${on?strings().voiceOn:strings().voiceOff}`);
  window.SabikWebPresentation?.setVoiceActive(playing);if(playing)void visual('confirmar',{force:true});
 }
 voice=createSabikVoice({initialLanguage:lang,onState:syncVoice});

 async function speakFixed(id,text,options={}){
  if(!id||!voiceEnabled())return {status:'disabled'};
  const result=await voice.speak(id,text,options);
  if(['play-error','missing','text-mismatch'].includes(result.status)){
   await voice.setEnabled(false);announcement.textContent=strings().voiceError;void visual('pausa',{force:true});
  }
  return result;
 }
 function say(text,{voiceId=null,allowOptional=false}={}){
  announcement.textContent=text;if(voiceId&&voiceEnabled())void speakFixed(voiceId,text,{allowOptional});
 }
 function controls(){ $('#sabik-submit').disabled=!input.value.trim();$('#sabik-cancel').hidden=!busy; }

 function localCandidate(item,index){
  const localized=window.IGSearch.localize(item,lang);
  return Object.freeze({
   library_version:'irisgreen-local-safe-r67',
   fragment_id:'local-'+index+'-'+String(localized.url||'').replace(/[^a-z0-9]+/gi,'-').slice(0,80),
   snippet:localized.full||localized.hint||localized.name||'',
   title:localized.name||'',
   heading:localized.area||'',
   url:localized.url||'',
   source_type:'irisgreen-local-index',
   concepts:Object.freeze([]),
   score:Math.max(1,100-index)
  });
 }
 async function localRetrieve(request,{signal}={}){
  if(signal?.aborted)throw new DOMException('Aborted','AbortError');
  if(!window.IGSearch)throw new Error('LOCAL_SEARCH_UNAVAILABLE');
  const hits=await window.IGSearch.search(request.query,{intentional:true,lang});
  if(signal?.aborted)throw new DOMException('Aborted','AbortError');
  return Object.freeze({library_version:'irisgreen-local-safe-r67',candidates:Object.freeze(hits.slice(0,6).map(localCandidate)),groups:Object.freeze([]),source_language:lang});
 }
 function timeout(ms,signal){
  return new Promise((_,reject)=>{
   const id=setTimeout(()=>reject(new Error('CLOUD_CONNECT_TIMEOUT')),ms);
   if(signal)signal.addEventListener('abort',()=>{clearTimeout(id);reject(new DOMException('Aborted','AbortError'));},{once:true});
  });
 }
 async function retrieve(request,{signal}={}){
  if(connection){
   try{
    await Promise.race([connection.connect(lang),timeout(1500,signal)]);
    const envelope=await cloudQuery({query:request.query,limit:6},{signal});
    return envelope;
   }catch(error){
    connection.disconnect();
    if(signal?.aborted||error?.name==='AbortError')throw error;
   }
  }
  return localRetrieve(request,{signal});
 }

 function renderAnswer(answer){
  root.replaceChildren();root.dataset.retrievalState='results';
  const section=document.createElement('section');section.className='sabik-retrieval-results sabik-conversation';
  const p=document.createElement('p');p.className='sabik-conversation-answer';p.textContent=answer;section.appendChild(p);root.appendChild(section);
 }
 function renderSources(sources){
  let section=root.querySelector('.sabik-conversation');if(!section){section=document.createElement('section');section.className='sabik-retrieval-results sabik-conversation';root.appendChild(section);}
  section.querySelector('.sabik-source-list')?.remove();section.querySelector('.sabik-source-title')?.remove();
  if(!sources.length)return;
  const h=document.createElement('h4');h.className='sabik-source-title';h.textContent=strings().sources;
  const list=document.createElement('ol');list.className='sabik-source-list sabik-retrieval-list';
  for(const source of sources){
   const li=document.createElement('li');li.className='sabik-retrieval-result';
   const a=document.createElement('a');a.className='sabik-retrieval-link';a.href=source.url;a.textContent=source.title||source.heading||source.url;li.appendChild(a);list.appendChild(li);
  }
  section.append(h,list);
 }
 function state(next){
  const map={ORIENTAR:'orientar',TRANSICION:'transicion',CONFIRMAR:'confirmar',PAUSA:'pausa',PRESENTE:'presente'};
  const v=map[next]||String(next||'presente').toLowerCase();void visual(v,{force:true,to:'presente'});
 }
 const conversation=createSabikConversation({retrieve,onState:state,onAnswer:renderAnswer,onSources:renderSources});

 function translate(){
  lang=document.documentElement.lang.startsWith('en')?'en':'es';voice.setLanguage(lang);aside.lang=lang;announcement.lang=lang;
  aside.querySelectorAll('[data-sabik-text]').forEach(el=>{if(strings()[el.dataset.sabikText]!=null)el.textContent=strings()[el.dataset.sabikText];});
  $('#sabik-toggle').textContent=$('#sabik-widget-body').hidden?strings().show:strings().hide;input.placeholder=strings().placeholder;
  const browse=$('#sabik-browse');if(browse)browse.href=lang==='en'?'/en/resources/':'/es/recursos/';
  const stateNode=aside.querySelector('.sabik-state');if(stateNode)stateNode.textContent=strings().available;
  const availability=$('#sabik-availability');if(availability)availability.textContent=strings().connected+(lang==='en'?' '+strings().spanish:'');
  syncVoice();controls();
 }
 async function submit(event){
  event.preventDefault();const q=input.value.trim();
  if(!q){void visual('orientar',{force:true});say(strings().empty,{voiceId:'sabik.input.empty'});input.focus();return;}
  busy=true;controls();say(strings().busy,{voiceId:'sabik.search.busy'});
  try{
   await conversation.submitTurn(q,{inputMode:'text',locale:lang,audience:window.IGAudience?.get?.()||'GENERAL',explicitIntent:true});
  }catch(error){
   if(error?.name!=='AbortError'){root.dataset.retrievalState='error';say(strings().error,{voiceId:'sabik.connection.error'});}
  }finally{busy=false;controls();}
 }

 $('#sabik-form').addEventListener('submit',submit);
 input.addEventListener('focus',()=>{void visual('orientar',{force:true});});
 input.addEventListener('blur',()=>{if(!busy)void present();});
 input.addEventListener('input',()=>{controls();if(input.value.trim())void visual('orientar',{force:true});});
 input.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('#sabik-form').requestSubmit();}});
 $('#sabik-cancel').addEventListener('click',()=>{conversation.cancel('user');connection?.disconnect();voice.cancel();busy=false;controls();void visual('pausa',{force:true});input.focus();});
 $('#sabik-toggle').addEventListener('click',()=>{const body=$('#sabik-widget-body');body.hidden=!body.hidden;aside.classList.toggle('is-collapsed',body.hidden);$('#sabik-toggle').setAttribute('aria-expanded',String(!body.hidden));$('#sabik-toggle').textContent=body.hidden?strings().show:strings().hide;if(!body.hidden)visual('transicion');});
 voiceButton.addEventListener('click',async()=>{voiceButton.disabled=true;try{if(voiceEnabled())await voice.setEnabled(false);else{await voice.setEnabled(true);const result=await speakFixed('sabik.welcome',strings().welcome);if(result.status!=='playing'&&result.status!=='disabled')throw new Error('VOICE_PLAYBACK_'+result.status);}}catch{await voice.setEnabled(false);announcement.textContent=strings().voiceError;void visual('pausa',{force:true});}finally{voiceButton.disabled=false;syncVoice();}});
 const low=$('#sabik-low');if(low)low.addEventListener('click',()=>{const motion=$('#sabik-motion-level');motion.value='SIN_MOVIMIENTO';low.setAttribute('aria-pressed','true');motion.dispatchEvent(new Event('change',{bubbles:true}));});
 $('#sabik-motion-level').addEventListener('change',()=>{if(low)low.setAttribute('aria-pressed',String($('#sabik-motion-level').value==='SIN_MOVIMIENTO'));});
 $('#sabik-reset').addEventListener('click',()=>{conversation.reset();connection?.disconnect();voice.cancel();input.value='';root.replaceChildren();delete root.dataset.retrievalState;busy=false;controls();say(strings().cleared,{voiceId:'sabik.reset.confirmation'});visual('transicion');input.focus();});
 window.addEventListener('ig:audience-change',()=>{conversation.reset();connection?.disconnect();voice.cancel();busy=false;root.replaceChildren();controls();});
 window.addEventListener('pagehide',()=>{conversation.cancel('pagehide');connection?.disconnect();voice.cancel();});
 new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});translate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
