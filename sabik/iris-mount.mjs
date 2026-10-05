import {createRetrievalQuery} from './retrieval-bridge.browser.mjs';
import {createAuthorizedTransport} from './authorized-transport.mjs';
import {connectionConfig,sealedLibrary} from './mount-config.mjs';
import {createSabikConversationalVoice} from './voice-runtime.mjs';
import {createSabikConversation} from './conversation-core-r66.mjs';
import {loadDialogueLibrary} from './dialogue-library.mjs';

const TEXT={
 es:{
  subtitle:'Asistente de Iris Green',
  unavailable:'Sabik está disponible con las fuentes seguras locales de Iris Green.',
  available:'Sabik está disponible.',
  hide:'Ocultar',show:'Mostrar',
  welcome:'Puedo ayudarte a buscar información.',conversationWelcome:'Pregunta por escrito o por voz. Respondo con información de Iris Green y enseño las fuentes.',
  explanation:'Si la biblioteca Cloud no responde, uso el índice seguro local de Iris Green. No invento una respuesta cuando no encuentro información suficiente.',
  connected:'Puedo responder con las fuentes de Iris Green. No hago diagnósticos.',
  label:'¿Qué necesitas?',help:'Hasta 300 caracteres. Enter añade una línea; Ctrl+Enter envía.',send:'Enviar',
  cancel:'Cancelar respuesta',low:'Desactivar movimiento',reset:'Empezar de nuevo',
  motion:'Movimiento de Sabik',normal:'Normal',reduced:'Reducido',still:'Sin movimiento',motionHelp:'Movimiento suave y continuo.',
  memory:'No se guarda el historial entre sesiones.',limits:'Comprueba la información importante en las fuentes. Sabik no realiza diagnósticos.',
  browse:'Explorar los recursos',placeholder:'Por ejemplo: el ruido me agota',cleared:'La consulta y los resultados se han borrado.',
  busy:'Buscando en las fuentes de Iris Green.',error:'No se pudo conectar. Puedes intentarlo de nuevo o usar el buscador de Iris Green.',
  empty:'Escribe qué necesitas.',spanish:'Algunas fuentes originales están en español.',
  voice:'Hablar con Sabik',voiceOn:'Conversación activa',voiceOff:'Lista',connecting:'Conectando…',mic:'Hablar',stopVoice:'Detener',repeat:'Repetir',
  volume:'Volumen',rate:'Velocidad',listening:'Escuchando',processing:'Procesando',speaking:'Hablando',
  voiceHelp:'Pulsa «Hablar con Sabik» y habla. Sabik escucha después de tu activación explícita. Iris Green no guarda el audio.',
  voiceReady:'Voz preparada.',voiceError:'La voz no se pudo activar.',micDenied:'No se pudo usar el micrófono. Puedes seguir escribiendo.',
  noSpeech:'No he detectado una consulta. Puedes intentarlo de nuevo o escribirla.',sttUnavailable:'El reconocimiento de voz de Sabik no está disponible ahora. Puedes seguir escribiendo.',
  ttsUnavailable:'La voz dinámica de Sabik no está disponible ahora. La respuesta escrita sigue disponible.',sources:'Fuentes',options:'Opciones de Sabik'
 },
 en:{
  subtitle:'Iris Green assistant',
  unavailable:'Sabik is available with Iris Green’s safe local sources.',available:'Sabik is available.',hide:'Hide',show:'Show',
  welcome:'I can help you find information.',conversationWelcome:'Ask in writing or by voice. I answer with Iris Green information and show the sources.',
  explanation:'If the Cloud library is unavailable, I use Iris Green’s safe local index. I do not invent an answer when there is not enough information.',
  connected:"I can answer using Iris Green's sources. I don't make diagnoses.",
  label:'What do you need?',help:'Up to 300 characters. Enter adds a new line; Ctrl+Enter sends.',send:'Send',
  cancel:'Cancel response',low:'Turn off motion',reset:'Start again',motion:'Sabik motion',normal:'Normal',reduced:'Reduced',still:'No motion',motionHelp:'Gentle continuous motion.',
  memory:'No history is saved between sessions.',limits:'Check important information against the sources. Sabik does not make diagnoses.',
  browse:'Explore resources',placeholder:'For example: noise drains me',cleared:'Your query and results have been cleared.',
  busy:'Searching Iris Green sources.',error:"Could not connect. You can try again or use Iris Green's search.",
  empty:'Write what you need.',spanish:'Some original sources are in Spanish.',
  voice:'Talk to Sabik',voiceOn:'Conversation active',voiceOff:'Ready',connecting:'Connecting…',mic:'Speak',stopVoice:'Stop',repeat:'Repeat',
  volume:'Volume',rate:'Speed',listening:'Listening',processing:'Processing',speaking:'Speaking',
  voiceHelp:'Press “Talk to Sabik” and speak. Sabik listens after your explicit activation. Iris Green does not store the audio.',
  voiceReady:'Voice ready.',voiceError:'Sabik voice could not be turned on.',micDenied:'The microphone could not be used. You can keep typing.',
  noSpeech:'I did not detect a query. You can try again or type it.',sttUnavailable:'Sabik speech recognition is not available right now. You can keep typing.',
  ttsUnavailable:'Sabik dynamic voice is not available right now. The written answer remains available.',sources:'Sources',options:'Sabik options'
 }
};

async function mount(){
 const aside=document.querySelector('.sabik-panel');if(!aside)return;
 const $=s=>aside.querySelector(s),input=$('#sabik-input'),announcement=$('#sabik-announcement'),root=$('#sabik-results'),visualRoot=$('#sabik-hologram'),voiceButton=$('#sabik-voice'),voiceState=$('#sabik-voice-state'),micButton=$('#sabik-mic'),voiceStop=$('#sabik-voice-stop'),voiceRepeat=$('#sabik-voice-repeat'),voiceVolume=$('#sabik-voice-volume'),voiceRate=$('#sabik-voice-rate');
 const connection=connectionConfig.enabled?createAuthorizedTransport({cloudOrigin:connectionConfig.cloudOrigin}):null;
 const cloudQuery=createRetrievalQuery({transport:connection?.transport||(()=>Promise.reject(new Error('LIBRARY_UNAVAILABLE'))),library:sealedLibrary});
 let lang=document.documentElement.lang.startsWith('en')?'en':'es',busy=false,voiceTurn=false,voiceSessionActive=false,voiceResumeTimer=0;
 const strings=()=>TEXT[lang],visual=(state,options)=>window.SabikWebPresentation?.setSabikState(state,options),present=()=>visual('presente',{force:true});
 const dialogues={es:null,en:null};
 await Promise.all(['es','en'].map(async code=>{try{dialogues[code]=await loadDialogueLibrary({language:code,base:'/sabik/assets/dialogue-r02'});}catch{dialogues[code]=null;}}));
 let voice,lastLanguage=lang;

 function voiceEnabled(){return Boolean(voice?.getState().enabled);}
 function ageBand(){return window.IGAudience?.get?.()||'AGE_UNSET';}
 function ageSelected(){return ['AGE_0_12','AGE_13_17','AGE_18_PLUS'].includes(ageBand());}
 function restrictedAdultAccess(){return Boolean(window.IGAudience?.canAccessRestrictedAdultContent?.());}
 function clearVoiceResume(){if(voiceResumeTimer){window.clearTimeout(voiceResumeTimer);voiceResumeTimer=0;}}
 function resumeVoiceSoon(delay=700){
  clearVoiceResume();
  if(!voiceSessionActive||!ageSelected())return;
  voiceResumeTimer=window.setTimeout(()=>{
   voiceResumeTimer=0;
   const s=voice.getState();
   if(voiceSessionActive&&!busy&&!s.speaking&&!s.listening&&!s.transcribing)void voice.startListening();
  },delay);
 }
 function endVoiceSession(reason='voice-session-stop'){
  voiceSessionActive=false;voiceTurn=false;clearVoiceResume();voice.stopAll(reason);controls();
 }
 function voiceMessage(code){
  const key={MICROPHONE_DENIED:'micDenied',MICROPHONE_UNAVAILABLE:'micDenied',MICROPHONE_ERROR:'micDenied',STT_UNAVAILABLE:'sttUnavailable',STT_ERROR:'sttUnavailable',STT_EMPTY:'noSpeech',STT_EMPTY_AUDIO:'noSpeech',VOICE_SERVICE_UNAVAILABLE:'voiceError',TTS_ERROR:'ttsUnavailable',TTS_PLAYBACK_ERROR:'ttsUnavailable'}[code]||'voiceError';
  announcement.textContent=strings()[key];
 }
 function syncVoiceEnergy(value,meta={}){
  if(!visualRoot)return;
  const energy=Math.max(0,Math.min(1,Number(value)||0));
  if(meta.active)visualRoot.dataset.audioReactive='true';
  else delete visualRoot.dataset.audioReactive;
  visualRoot.style.setProperty('--sabik-core-live-scale',(1+energy*.12).toFixed(3));
  visualRoot.style.setProperty('--sabik-ring-live-scale',(1+energy*.055).toFixed(3));
  visualRoot.style.setProperty('--sabik-core-live-opacity',(.9+energy*.1).toFixed(3));
  visualRoot.style.setProperty('--sabik-wave-opacity',Math.min(.72,.10+energy*.62).toFixed(3));
  visualRoot.style.setProperty('--sabik-wave-scale',(1+energy*.7).toFixed(3));
  visualRoot.style.setProperty('--sabik-halo-live-opacity',(.26+energy*.38).toFixed(3));
 }
 function syncVoice(state,meta={}){
  const on=Boolean(state?.enabled??voiceEnabled()),listening=Boolean(state?.listening),transcribing=Boolean(state?.transcribing),speaking=Boolean(state?.speaking);
  const semantic=meta.semantic==='degraded'?'degraded':speaking?'speaking':listening?'listening':transcribing||busy?'processing':meta.semantic||'idle';
  voiceButton.setAttribute('aria-pressed',String(voiceSessionActive));voiceState.textContent=semantic==='degraded'?strings().voiceError:listening?strings().listening:speaking?strings().speaking:transcribing||busy?strings().processing:voiceSessionActive?strings().voiceOn:strings().voiceOff;
  voiceButton.setAttribute('aria-label',`${strings().voice}: ${voiceSessionActive?strings().voiceOn:strings().voiceOff}`);
  if(micButton)micButton.disabled=busy||transcribing;
  const stopRelevant=Boolean(voiceSessionActive||listening||transcribing||speaking||busy);
  if(voiceStop){voiceStop.hidden=!stopRelevant;voiceStop.disabled=!stopRelevant;}
  const repeatRelevant=Boolean(on&&state?.ttsAvailable&&state?.canRepeat);
  if(voiceRepeat){voiceRepeat.hidden=!repeatRelevant;voiceRepeat.disabled=!repeatRelevant;}
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
  const result=await submitQuery(text,'voice');
  if(result?.kind==='listen-again'){voiceTurn=false;resumeVoiceSoon();}
  return result;
 }
 voice=createSabikConversationalVoice({
  initialLanguage:lang,
  onState:syncVoice,
  onTranscript:voiceTranscript,
  onError:voiceMessage,
  onEnergy:syncVoiceEnergy
 });

 async function speakFixed(id,text,options={}){
  if(!id||!voiceEnabled())return {status:'disabled'};
  return voice.speakFixed(id,text,options);
 }
 function say(text,{voiceId=null,allowOptional=false}={}){
  announcement.textContent=text;if(voiceId&&voiceEnabled()&&!busy)void speakFixed(voiceId,text,{allowOptional});
 }
 function controls(){
  $('#sabik-submit').disabled=busy;$('#sabik-cancel').hidden=!busy;
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
  if(!ageSelected())return Object.freeze({library_version:'irisgreen-age-unset',candidates:Object.freeze([]),groups:Object.freeze([]),source_language:lang});
  if(connection && restrictedAdultAccess()){
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
  if(voiceTurn&&voiceEnabled()){
   voiceTurn=false;
   void voice.speak(answer).then(result=>{
    if(voiceSessionActive&&result?.status==='ended')resumeVoiceSoon();
   });
  }
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
 const conversation=createSabikConversation({retrieve,getDialogue:locale=>dialogues[locale]||null,onState:state,onAnswer:renderAnswer,onSources:renderSources});

 function translate(){
  const nextLang=document.documentElement.lang.startsWith('en')?'en':'es';
  if(nextLang!==lastLanguage){
   conversation.reset();connection?.disconnect();voiceSessionActive=false;clearVoiceResume();voice.stopAll('language-change');root.replaceChildren();delete root.dataset.retrievalState;input.value='';busy=false;
   lastLanguage=nextLang;
  }
  lang=nextLang;voice.setLanguage(lang);aside.lang=lang;announcement.lang=lang;
  aside.querySelectorAll('[data-sabik-text]').forEach(el=>{if(strings()[el.dataset.sabikText]!=null)el.textContent=strings()[el.dataset.sabikText];});
  const toggle=$('#sabik-toggle');if(toggle)toggle.textContent=$('#sabik-widget-body')?.hidden?strings().show:strings().hide;input.placeholder=strings().placeholder;
  const browse=$('#sabik-browse');if(browse)browse.href=lang==='en'?'/en/resources/':'/es/recursos/';
  const stateNode=aside.querySelector('.sabik-state');if(stateNode)stateNode.textContent=strings().available;
  const availability=$('#sabik-availability');if(availability)availability.textContent=strings().connected+(lang==='en'?' '+strings().spanish:'');
  syncVoice(voice.getState(),{reason:'translate'});controls();
 }
 async function submitQuery(q,inputMode){
  if(!ageSelected()){voiceTurn=false;announcement.textContent=lang==='en'?'Choose an age group before using Sabik.':'Elige una edad antes de usar Sabik.';return Object.freeze({kind:'age-gate-blocked'});}
  voiceTurn=inputMode==='voice';
  q=String(q||'').trim();
  if(!q){void visual('orientar',{force:true,semantic:'idle'});say(strings().empty,{voiceId:'sabik.input.empty'});input.focus();return;}
  voice.cancelSpeech({emitState:false});busy=true;controls();announcement.textContent=strings().processing;
  try{
   return await conversation.submitTurn(q,{inputMode,locale:lang,audience:ageBand(),explicitIntent:true});
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
 $('#sabik-cancel').addEventListener('click',()=>{conversation.cancel('user');connection?.disconnect();endVoiceSession('cancel');busy=false;controls();void visual('pausa',{force:true,semantic:'idle'});input.focus();});
 const toggle=$('#sabik-toggle');if(toggle)toggle.addEventListener('click',()=>{const body=$('#sabik-widget-body');body.hidden=!body.hidden;aside.classList.toggle('is-collapsed',body.hidden);toggle.setAttribute('aria-expanded',String(!body.hidden));toggle.textContent=body.hidden?strings().show:strings().hide;if(body.hidden){conversation.cancel('close');connection?.disconnect();endVoiceSession('close');busy=false;controls();void present();}else visual('transicion');});
 voiceButton.addEventListener('click',async()=>{if(!ageSelected()){announcement.textContent=lang==='en'?'Choose an age group before using Sabik.':'Elige una edad antes de usar Sabik.';return;}if(voiceSessionActive){endVoiceSession('voice-primary-stop');return;}voiceSessionActive=true;voiceButton.disabled=true;voiceButton.setAttribute('aria-busy','true');voiceState.textContent=strings().connecting;announcement.textContent=strings().connecting;controls();voiceState.textContent=strings().connecting;try{const result=await voice.startListening();if(result.status==='unavailable'||result.status==='error'){voiceSessionActive=false;announcement.textContent=strings().sttUnavailable;}}catch{voiceSessionActive=false;announcement.textContent=strings().voiceError;void visual('pausa',{force:true,semantic:'degraded'});}finally{voiceButton.disabled=false;voiceButton.removeAttribute('aria-busy');syncVoice(voice.getState(),{reason:'voice-primary'});controls();}});
 if(micButton)micButton.addEventListener('click',async()=>{if(!ageSelected())return;voiceSessionActive=true;const result=await voice.startListening();if(result.status==='unavailable'||result.status==='error'){voiceSessionActive=false;announcement.textContent=strings().sttUnavailable;}controls();});
 if(voiceStop)voiceStop.addEventListener('click',()=>{conversation.cancel('voice-stop');connection?.disconnect();endVoiceSession('voice-stop');busy=false;controls();input.focus();});
 if(voiceRepeat)voiceRepeat.addEventListener('click',()=>{void voice.repeat();});
 if(voiceVolume)voiceVolume.addEventListener('input',()=>voice.setVolume(voiceVolume.value));
 if(voiceRate)voiceRate.addEventListener('input',()=>voice.setRate(voiceRate.value));
 const low=$('#sabik-low');if(low)low.addEventListener('click',()=>{const motion=$('#sabik-motion-level');motion.value='SIN_MOVIMIENTO';low.setAttribute('aria-pressed','true');motion.dispatchEvent(new Event('change',{bubbles:true}));});
 $('#sabik-motion-level').addEventListener('change',()=>{if(low)low.setAttribute('aria-pressed',String($('#sabik-motion-level').value==='SIN_MOVIMIENTO'));});
 $('#sabik-reset').addEventListener('click',()=>{conversation.reset();connection?.disconnect();endVoiceSession('reset');input.value='';root.replaceChildren();delete root.dataset.retrievalState;busy=false;controls();say(strings().cleared,{voiceId:'sabik.reset.confirmation'});visual('transicion');input.focus();});
 window.addEventListener('ig:audience-change',()=>{conversation.reset();connection?.disconnect();endVoiceSession('audience-change');busy=false;input.value='';root.replaceChildren();delete root.dataset.retrievalState;controls();void present();});
 window.addEventListener('pagehide',()=>{conversation.cancel('pagehide');connection?.disconnect();endVoiceSession('pagehide');});
 aside.addEventListener('keydown',event=>{if(event.key==='Escape'&&(voiceSessionActive||busy||voice.getState().listening||voice.getState().speaking)){event.preventDefault();conversation.cancel('escape');connection?.disconnect();endVoiceSession('escape');busy=false;controls();input.focus();}});
 new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});translate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();