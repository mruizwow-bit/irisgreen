const VERSION='SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED';
const MANIFEST_URL='/sabik/assets/audio-r01/manifest.runtime.json';
const LANGS=new Set(['es','en']);
const POLICIES=new Set(['SYSTEM_VOICE','SYSTEM_VOICE_OPTIONAL']);

function language(value){return String(value||'').toLowerCase().startsWith('en')?'en':'es';}
function key(id,lang){return `${id}\u0000${lang}`;}
function cleanManifest(raw){
 if(!raw||raw.version!==VERSION||!Array.isArray(raw.entries)||raw.entries.length!==30)throw new TypeError('Invalid Sabik audio manifest');
 const map=new Map();
 for(const entry of raw.entries){
  if(!entry||typeof entry.id!=='string'||!LANGS.has(entry.language)||!POLICIES.has(entry.policy)||
    !/^\/sabik\/assets\/audio-r01\/(?:es|en)\/[a-z0-9_]+\.wav$/.test(entry.file)||
    !/^[a-f0-9]{64}$/.test(entry.text_sha256)||!/^[a-f0-9]{64}$/.test(entry.audio_sha256))throw new TypeError('Invalid Sabik audio manifest');
  if(entry.file.split('/')[4]!==entry.language)throw new TypeError('Invalid Sabik audio manifest');
  const k=key(entry.id,entry.language);if(map.has(k))throw new TypeError('Duplicate Sabik audio manifest entry');
  map.set(k,Object.freeze({...entry}));
 }
 return Object.freeze({version:raw.version,entries:map});
}
async function browserManifestLoader(){
 const response=await fetch(MANIFEST_URL,{credentials:'same-origin',cache:'no-store'});
 if(!response.ok)throw new Error('SABIK_AUDIO_MANIFEST_UNAVAILABLE');
 return cleanManifest(await response.json());
}
async function sha256(text){
 if(!globalThis.crypto?.subtle||typeof TextEncoder==='undefined')throw new Error('SABIK_AUDIO_HASH_UNAVAILABLE');
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
 return [...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
function createSabikVoice({
 initialLanguage='es',manifestLoader=browserManifestLoader,digest=sha256,
 audioFactory=()=>new Audio(),onState=()=>{}
}={}){
 let lang=language(initialLanguage),enabled=false,manifestPromise=null,audio=null,revision=0;
 const state=()=>Object.freeze({enabled,language:lang,playing:Boolean(audio&&!audio.paused)});
 function emit(){onState(state());}
 function stop(){
  revision+=1;
  if(audio){try{audio.pause();audio.removeAttribute?.('src');audio.load?.();audio.currentTime=0;}catch{} audio=null;}
  emit();
 }
 function getManifest(){if(!manifestPromise)manifestPromise=Promise.resolve().then(manifestLoader);return manifestPromise;}
 async function setEnabled(next){
  const value=Boolean(next);
  if(!value){enabled=false;stop();return state();}
  try{await getManifest();enabled=true;emit();return state();}
  catch(error){enabled=false;manifestPromise=null;stop();throw error;}
 }
 function setLanguage(next){const nextLang=language(next);if(nextLang!==lang){lang=nextLang;stop();}else emit();return lang;}
 async function speak(id,text,{allowOptional=false}={}){
  if(!enabled)return Object.freeze({status:'disabled'});
  const ticket=++revision;
  if(audio){try{audio.pause();audio.removeAttribute?.('src');audio.load?.();audio.currentTime=0;}catch{} audio=null;}
  const manifest=await getManifest();if(ticket!==revision||!enabled)return Object.freeze({status:'stale'});
  const entry=manifest.entries.get(key(id,lang));if(!entry)return Object.freeze({status:'missing'});
  if(entry.policy==='SYSTEM_VOICE_OPTIONAL'&&!allowOptional)return Object.freeze({status:'optional-blocked'});
  const actual=await digest(String(text));if(ticket!==revision||!enabled)return Object.freeze({status:'stale'});
  if(actual!==entry.text_sha256)return Object.freeze({status:'text-mismatch'});
  const player=audioFactory();audio=player;player.preload='none';player.src=entry.file;
  player.addEventListener?.('ended',()=>{if(audio===player){audio=null;emit();}},{once:true});
  try{await player.play();if(ticket!==revision||!enabled){stop();return Object.freeze({status:'stale'});}emit();return Object.freeze({status:'playing',id,language:lang,file:entry.file,audio_sha256:entry.audio_sha256});}
  catch{if(audio===player)audio=null;emit();return Object.freeze({status:'play-error'});}
 }
 emit();
 return Object.freeze({setEnabled,setLanguage,speak,cancel:stop,getState:state});
}
export {VERSION,MANIFEST_URL,cleanManifest,createSabikVoice};
