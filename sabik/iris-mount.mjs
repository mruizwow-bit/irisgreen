import {createRetrievalQuery} from './retrieval-bridge.browser.mjs';
import {createAuthorizedTransport} from './authorized-transport.mjs';
import {connectionConfig,sealedLibrary} from './mount-config.mjs';
import {createSabikConversationalVoice} from './voice-runtime.mjs';
import {createSabikConversation} from './conversation-core-r66.mjs';

const TEXT={
 es:{
  subtitle:'Asistente de Iris Green',
  unavailable:'Sabik está disponible con las fuentes seguras locales de Iris Green.',
  available:'Sabik está disponible.',
  hide:'Ocultar',show:'Mostrar',
  welcome:'Puedo ayudarte a buscar información.',conversationWelcome:'Puedes preguntarme por escrito o activar la voz. Respondo con información de Iris Green y te enseño las fuentes.',
  explanation:'Si la biblioteca Cloud no responde, uso el índice seguro local de Iris Green. No invento una respuesta cuando no encuentro información suficiente.',
  connected:'Puedo responder con las fuentes de Iris Green. No hago diagnósticos.',
  label:'¿Qué necesitas?',help:'Hasta 300 caracteres. Enter añade una línea; Ctrl+Enter envía.',send:'Enviar',
  cancel:'Cancelar respuesta',low:'Desactivar movimiento',reset:'Empezar de nuevo',
  motion:'Movimiento de Sabik',normal:'Normal',reduced:'Reducido',still:'Sin movimiento',motionHelp:'Movimiento suave y continuo.',
  memory:'No se guarda el historial entre sesiones.',limits:'Comprueba la información importante en las fuentes. Sabik no realiza diagnósticos.',
  browse:'Explorar los recursos',placeholder:'Por ejemplo: el ruido me agota',cleared:'La consulta y los resultados se han borrado.',
  busy:'Buscando en las fuentes de Iris Green.',error:'No se pudo conectar. Puedes intentarlo de nuevo o usar el buscador de Iris Green.',
  empty:'Escribe qué necesitas.',spanish:'Algunas fuentes originales están en español.',
  voice:'Hablar con Sabik',voiceOn:'Lista',voiceOff:'Lista',mic:'Hablar',stopVoice:'Detener',repeat:'Repetir',
  volume:'Volumen',rate:'Velocidad',listening:'Escuchando',processing:'Procesando',speaking:'Hablando',
  voiceHelp:'Pulsa «Hablar con Sabik» y habla. Sabik empezará a escuchar y enviará tu pregunta cuando termines. El audio no se guarda en Iris Green.',
  voiceReady:'Voz preparada.',voiceError:'La voz no se pudo activar.',micDenied:'No se pudo usar el micrófono. Puedes seguir escribiendo.',
  noSpeech:'No he detectado una consulta. Puedes intentarlo de nuevo o escribirla.',sttUnavailable:'El reconocimiento de voz de Sabik no está disponible ahora. Puedes seguir escribiendo.',
  ttsUnavailable:'La voz dinámica de Sabik no está disponible ahora. La respuesta escrita sigue disponible.',sources:'Fuentes'
 },
 en:{
  subtitle:'Iris Green assistant',
  unavailable:'Sabik is available with Iris Green’s safe local sources.',available:'Sabik is available.',hide:'Hide',show:'Show',
  welcome:'I can help you find information.',conversationWelcome:'You can ask me in writing or enable voice. I answer with Iris Green information and show the sources.',
  explanation:'If the Cloud library is unavailable, I use Iris Green’s safe local index. I do not invent an answer when there is not enough information.',
  connected:"I can answer using Iris Green's sources. I don't make diagnoses.",
  label:'What do you need?',help:'Up to 300 characters. Enter adds a new line; Ctrl+Enter sends.',send:'Send',
  cancel:'Cancel response',low:'Turn off motion',reset:'Start again',motion:'Sabik motion',normal:'Normal',reduced:'Reduced',still:'No motion',motionHelp:'Gentle continuous motion.',
  memory:'No history is saved between sessions.',limits:'Check important information against the sources. Sabik does not make diagnoses.',
  browse:'Explore resources',placeholder:'For example: noise drains me',cleared:'Your query and results have been cleared.',
  busy:'Searching Iris Green sources.',error:"Could not connect. You can try again or use Iris Green's search.",
  empty:'Write what you need.',spanish:'Some original sources are in Spanish.',
  voice:'Talk to Sabik',voiceOn:'Ready',voiceOff:'Ready',mic:'Speak',stopVoice:'Stop',repeat:'Repeat',
  volume:'Volume',rate:'Speed',listening:'Listening',processing:'Processing',speaking:'Speaking',
  voiceHelp:'Press “Talk to Sabik” and speak. Sabik starts listening and sends your question when you finish. Iris Green does not store the audio.',
  voiceReady:'Voice ready.',voiceError:'Sabik voice could not be turned on.',micDenied:'The microphone could not be used. You can keep typing.',
  noSpeech:'I did not detect a query. You can try again or type it.',sttUnavailable:'Sabik speech recognition is not available right now. You can keep typing.',
  ttsUnavailable:'Sabik dynamic voice is not available right now. The written answer remains available.',sources:'Sources'
 }
};

function mount(){
 const aside=document.querySelector('.sabik-panel');if(!aside)return;
 const $=s=>aside.querySelector(s),input=$('#sabik-input'),announcement=$('#sabik-announcement'),root=$('#sabik-results'),voiceButton=$('#sabik-voice'),voiceState=$('#sabik-voice-state'),micButton=$('#sabik-mic'),voiceStop=$('#sabik-voice-stop'),voiceRepeat=$('#sabik-voice-repeat'),voiceVolume=$('#sabik-voice-volume'),voiceRate=$('#sabik-voice-rate');
 const connection=connectionConfig.enabled?createAuthorizedTransport({cloudOrigin:connectionConfig.cloudOrigin}):null;
 const cloudQuery=createRetrievalQuery({transport:connection?.transport||(()=>Promise.reject(new Error('LIBRARY_UNAVAILABLE'))),library:sealedLibrary});
 let lang=document.documentElement.lang.startsWith('en')?'en':'es',busy=false;
 const strings=()=>TEXT[lang],visual=(state,options)=>window.SabikWebPresentation?.setSabikState(state,options),present=()=>visual('presente',{force:true});
 let voice,lastLanguage=lang;

 function voiceEnabled(){return Boolean(voice?.getState().enabled);}
 function voiceMessage(code){
  const key={MICROPHONE_DENIED:'micDenied',MICROPHONE_UNAVAILABLE:'micDenied',MICROPHONE_ERROR:'micDenied',STT_UNAVAILABLE:'sttUnavailable',STT_ERROR:'sttUnavailable',STT_EMPTY:'noSpeech',STT_EMPTY_AUDIO:'noSpeech',VOICE_SERVICE_UNAVAILABLE:'voiceError',TTS_ERROR:'ttsUnavailable',TTS_PLAYBACK_ERROR:'ttsUnavailable'}[code]||'voiceError';
  announcement.textContent=strings()[key];
 }
 function syncVoice(state,meta={}){
  const on=Boolean(state?.enabled??voiceEnabled()),listening=Boolean(state?.listening),transcribing=Boolean(state?.transcribing),speaking=Boolean(state?.speaking);
  const semantic=meta.semantic==='degraded'?'degraded':speaking?'speaking':listening?'listening':transcribing||busy?'processing':meta.semantic||'idle';
  voiceButton.setAttribute('aria-pressed',String(on));voiceState.textContent=listening?strings().listening:speaking?strings().speaking:transcribing||busy?strings().processing:on?strings().voiceOn:strings().voiceOff;
  voiceButton.setAttribute('aria-label',`${strings().voice}: ${on?strings().voiceOn:strings().voiceOff}`);
  if(micButton)micButton.disabled=busy||transcribing;
  if(voiceStop)voiceStop.disabled=!(listening||transcribing||speaking||busy);
  if(voiceRepeat)voiceRepeat.disabled=!on||!state?.ttsAvailable||!state?.canRepeat;
  if(voiceVolume)voiceVolume.disabled=!on||!state?.ttsAvailable;
  if(voiceRate)voiceRate.disabled=!on||!state?.ttsAvailable;
  window.SabikWebPresentation?.setVoiceActive(speaking);
  if(semantic==='listening')void visual('orientar',{force:true,semantic:'listening',reason:meta.reason||'voice-listening'});
  else if(semantic==='processing')void visual('transicion',{force:true,semantic:'processing',reason:meta.reason||'voice-processing'});
  else if(semantic==='speaking')void visual('confirmar',{force:true,semantic:'speaking',reason:meta.reason||'voice-speaking'});
  else if(semantic==='degraded')void visual('pausa',{force:true,semantic:'degraded',reason:meta.error||'voice-degraded'});
  else void visual('presente',{force:true,semantic:'idle',reason:meta.reason||'voice-idle'});
 }
 async function voiceTranscript(text){
  input.value=text;controls();
  return submitQuery(text,'voice');
 }
 voice=createSabikConversationalVoice({
  initialLanguage:lang,
  onState:syncVoice,
  onTranscript:voiceTranscript,
  onError:voiceMessage
 });

 async function speakFixed(id,text,options={}){
  if(!id||!voiceEnabled())return {status:'disabled'};
  return voice.speakFixed(id,text,options);
 }
 function say(text,{voiceId=null,allowOptional=false}={}){
  announcement.textContent=text;if(voiceId&&voiceEnabled()&&!busy)void speakFixed(voiceId,text,{allowOptional});
 }
 function controls(){
  $('#sabik-submit').disabled=!input.value.trim()||busy;$('#sabik-cancel').hidden=!busy;
  syncVoice(voice?.getState?.()||{});
 }

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
  if(connection && !['AGE_0_12','AGE_13_17'].includes(window.IGAudience?.get?.())){
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

 function renderAnswer(answer,meta={}){
  announcement.textContent=lang==='en'?'Answer ready.':'Respuesta lista.';
  root.replaceChildren();root.dataset.retrievalState='results';
  const section=document.createElement('section');section.className='sabik-retrieval-results sabik-conversation';
  const p=document.createElement('p');p.className='sabik-conversation-answer';p.textContent=answer;section.appendChild(p);root.appendChild(section);
   if(meta.inputMode==='voice'&&voiceEnabled())void voice.speak(answer);
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
 function state(next,meta={}){
  const map={ORIENTAR:'orientar',TRANSICION:'transicion',CONFIRMAR:'confirmar',PAUSA:'pausa',PRESENTE:'presente'};
  const v=map[next]||String(next||'presente').toLowerCase();
  let semantic='idle';
  if(next==='TRANSICION'&&meta.phase==='retrieval')semantic='processing';
  else if(next==='PAUSA'&&meta.phase==='error')semantic='degraded';
  if(next==='CONFIRMAR'&&meta.inputMode==='voice'&&voiceEnabled()&&voice.getState().ttsAvailable)return;
  void visual(v,{force:true,to:'presente',semantic,reason:meta.phase||'conversation-state'});
 }
 const conversation=createSabikConversation({retrieve,onState:state,onAnswer:renderAnswer,onSources:renderSources});

 function translate(){
  const nextLang=document.documentElement.lang.startsWith('en')?'en':'es';
  if(nextLang!==lastLanguage){
   conversation.reset();connection?.disconnect();voice.stopAll('language-change');root.replaceChildren();delete root.dataset.retrievalState;input.value='';busy=false;
   lastLanguage=nextLang;
  }
  lang=nextLang;voice.setLanguage(lang);aside.lang=lang;announcement.lang=lang;
  aside.querySelectorAll('[data-sabik-text]').forEach(el=>{if(strings()[el.dataset.sabikText]!=null)el.textContent=strings()[el.dataset.sabikText];});
  $('#sabik-toggle').textContent=$('#sabik-widget-body').hidden?strings().show:strings().hide;input.placeholder=strings().placeholder;
  const browse=$('#sabik-browse');if(browse)browse.href=lang==='en'?'/en/resources/':'/es/recursos/';
  const stateNode=aside.querySelector('.sabik-state');if(stateNode)stateNode.textContent=strings().available;
  const availability=$('#sabik-availability');if(availability)availability.textContent=strings().connected+(lang==='en'?' '+strings().spanish:'');
  syncVoice(voice.getState(),{reason:'translate'});controls();
 }
 async function submitQuery(q,inputMode){
  q=String(q||'').trim();
  if(!q){void visual('orientar',{force:true,semantic:'idle'});say(strings().empty,{voiceId:'sabik.input.empty'});input.focus();return;}
  voice.cancelSpeech({emitState:false});busy=true;controls();announcement.textContent=strings().processing;
  try{
   return await conversation.submitTurn(q,{inputMode,locale:lang,audience:window.IGAudience?.get?.()||'GENERAL',explicitIntent:true});
  }catch(error){
   if(error?.name!=='AbortError'){root.dataset.retrievalState='error';say(strings().error);}
  }finally{busy=false;controls();}
 }
 async function submit(event){
  event.preventDefault();return submitQuery(input.value,'text');
 }

 $('#sabik-form').addEventListener('submit',submit);
 const expand=$('#sabik-expand');
 if(expand)expand.addEventListener('click',()=>{const on=aside.classList.toggle('is-expanded');expand.setAttribute('aria-pressed',String(on));expand.textContent=lang==='en'?(on?'Reduce':'Expand'):(on?'Reducir':'Ampliar');});
 input.addEventListener('focus',()=>{void visual('orientar',{force:true});});
 input.addEventListener('blur',()=>{if(!busy)void present();});
 input.addEventListener('input',()=>{controls();if(input.value.trim())void visual('orientar',{force:true});});
 input.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('#sabik-form').requestSubmit();}});
 $('#sabik-cancel').addEventListener('click',()=>{conversation.cancel('user');connection?.disconnect();voice.stopAll('cancel');busy=false;controls();void visual('pausa',{force:true,semantic:'idle'});input.focus();});
 $('#sabik-toggle').addEventListener('click',()=>{const body=$('#sabik-widget-body');body.hidden=!body.hidden;aside.classList.toggle('is-collapsed',body.hidden);$('#sabik-toggle').setAttribute('aria-expanded',String(!body.hidden));$('#sabik-toggle').textContent=body.hidden?strings().show:strings().hide;if(body.hidden){conversation.cancel('close');connection?.disconnect();voice.stopAll('close');busy=false;controls();void present();}else visual('transicion');});
 voiceButton.addEventListener('click',async()=>{const s=voice.getState();if(s.listening){voice.stopListening();controls();return;}if(s.speaking){voice.cancelSpeech();controls();return;}voiceButton.disabled=true;try{const result=await voice.startListening();if(result.status==='unavailable'||result.status==='error')announcement.textContent=strings().sttUnavailable;}catch{announcement.textContent=strings().voiceError;void visual('pausa',{force:true,semantic:'degraded'});}finally{voiceButton.disabled=false;syncVoice(voice.getState(),{reason:'voice-primary'});controls();}});
 if(micButton)micButton.addEventListener('click',async()=>{const result=await voice.startListening();if(result.status==='unavailable'||result.status==='error')announcement.textContent=strings().sttUnavailable;controls();});
 if(voiceStop)voiceStop.addEventListener('click',()=>{const s=voice.getState();if(s.listening){voice.stopListening();controls();return;}if(s.speaking){voice.cancelSpeech();controls();input.focus();return;}if(busy){conversation.cancel('voice-stop');connection?.disconnect();voice.stopAll('voice-stop');busy=false;controls();input.focus();}});
 if(voiceRepeat)voiceRepeat.addEventListener('click',()=>{void voice.repeat();});
 if(voiceVolume)voiceVolume.addEventListener('input',()=>voice.setVolume(voiceVolume.value));
 if(voiceRate)voiceRate.addEventListener('input',()=>voice.setRate(voiceRate.value));
 const low=$('#sabik-low');if(low)low.addEventListener('click',()=>{const motion=$('#sabik-motion-level');motion.value='SIN_MOVIMIENTO';low.setAttribute('aria-pressed','true');motion.dispatchEvent(new Event('change',{bubbles:true}));});
 $('#sabik-motion-level').addEventListener('change',()=>{if(low)low.setAttribute('aria-pressed',String($('#sabik-motion-level').value==='SIN_MOVIMIENTO'));});
 $('#sabik-reset').addEventListener('click',()=>{conversation.reset();connection?.disconnect();voice.stopAll('reset');input.value='';root.replaceChildren();delete root.dataset.retrievalState;busy=false;controls();say(strings().cleared,{voiceId:'sabik.reset.confirmation'});visual('transicion');input.focus();});
 window.addEventListener('ig:audience-change',()=>{conversation.reset();connection?.disconnect();voice.stopAll('audience-change');busy=false;input.value='';root.replaceChildren();delete root.dataset.retrievalState;controls();void present();});
 window.addEventListener('pagehide',()=>{conversation.cancel('pagehide');connection?.disconnect();voice.stopAll('pagehide');});
 aside.addEventListener('keydown',event=>{if(event.key==='Escape'&&(busy||voice.getState().listening||voice.getState().speaking)){event.preventDefault();conversation.cancel('escape');connection?.disconnect();voice.stopAll('escape');busy=false;controls();input.focus();}});
 new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});translate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
