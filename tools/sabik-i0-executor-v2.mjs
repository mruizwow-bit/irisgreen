// Sabik I0 executor V2 — development-only structural correction.
// Contract-first. No calibration/validation data is loaded or embedded.

const clone=x=>JSON.parse(JSON.stringify(x));
export const PROVISIONAL_FALLBACK_ACCEPT_SCORE=0.34;
export const normalizeText=s=>String(s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase()
  .replace(/[^\p{L}\p{N}\s.,;:¿?¡!]/gu," ").replace(/\s+/g," ").trim();

const STOPWORDS=new Set(["el","la","los","las","un","una","unos","unas","de","del","al","a","en","con","por","para","que","me","mi","mis","esta","este","esto","esa","ese","eso","y","o","pero","muy"]);
const OOS=/\b(javascript|sql|post\b|servidor externo|url arbitraria|cualquier url|localstorage|microfono|diagnosticame|envia un formulario|compra una entrada|borra archivos|datos privados)\b/u;
const ENGLISH_ONLY=/\b(please|reduce|motion|open|previous|page|for me)\b/u;

function tokens(s){return normalizeText(s).split(/\s+/u).filter(Boolean).filter(x=>!STOPWORDS.has(x));}
function setJaccard(a,b){const A=new Set(a),B=new Set(b);let n=0;for(const x of A)if(B.has(x))n++;return A.size+B.size-n?n/(A.size+B.size-n):0;}
function ngrams(s,n=3){const x=normalizeText(s).replace(/\s+/g,"_"),out=[];for(let i=0;i+n<=x.length;i++)out.push(x.slice(i,i+n));return out;}
function textSimilarity(a,b){return .70*setJaccard(tokens(a),tokens(b))+.30*setJaccard(ngrams(a),ngrams(b));}
function contextSimilarity(a={},b={}){
  const fa=[],fb=[];
  const add=(arr,c)=>{
    if(c.activeFlow)arr.push("flow:"+c.activeFlow);
    if(c.currentContentId)arr.push("content");
    if(c.previousRoute)arr.push("previous");
    if(c.unsentText!==undefined)arr.push("unsent:"+Boolean(c.unsentText));
    if(c.pendingClarification)arr.push("pendingClarification");
    if(c.pendingConfirmation)arr.push("pendingConfirmation");
    if(c.lastAction)arr.push("lastAction");
    if(c.lastQuery)arr.push("lastQuery");
    if(c.retrievalEmpty)arr.push("retrievalEmpty");
    if(c.offline)arr.push("offline");
    if(Array.isArray(c.optionsShown)&&c.optionsShown.length)arr.push("options:"+c.optionsShown.length);
    if(c.s0?.speech)arr.push("speech:"+c.s0.speech);
    if(c.s0?.safety)arr.push("safety:"+c.s0.safety);
  };
  add(fa,a);add(fb,b);return setJaccard(fa,fb);
}

function evidenceScore(kind,similarity=1){
  if(kind==="contract_exact")return 1;
  if(kind==="contract_context")return .98;
  if(kind==="contract_correction")return .96;
  return Math.max(0,Math.min(1,similarity));
}

function gateEvents(gate){
  return gate==="uncertain"?["RISK_UNCERTAIN"]:
    gate==="confirmed"?["RISK_CONFIRMED"]:
    gate==="cleared"?["RISK_CLEARED"]:
    gate==="handoff"?["HUMAN_HANDOFF"]:[];
}

export function detectSafety(text){
  const n=normalizeText(text);
  const educational=/\b(historia|personaje|pelicula|trabajo|material educativo|informacion de prevencion|senales de riesgo|no es sobre mi|no hablo de mi situacion|yo estoy bien|no estoy en riesgo|sin crisis actual)\b/u.test(n);
  if(educational)return {gate:"normal",score:1,reason:"explicit_non_personal_context"};
  if(/\b(a salvo|fuera de riesgo|ya no (?:hay|existe) (?:peligro|riesgo)|riesgo termino|situacion se resolvio|ya no es un riesgo actual|ahora estoy segura y podemos continuar)\b/u.test(n))
    return {gate:"cleared",score:1,reason:"contract_cleared"};
  const human=/\b(intervencion humana|asistencia humana|ayuda humana|intervenga una persona|orient\w* a una persona|conect\w* con ayuda de una persona|requiere ayuda humana)\b/u.test(n);
  const active=/\b(peligro|riesgo|emergencia|actual|ahora|inmediato|inmediata)\b/u.test(n);
  if(human&&active)return {gate:"handoff",score:1,reason:"contract_handoff"};
  if(/\b(peligro inmediato|riesgo real ahora|a punto de|voy a hacerme dano|puede danarme|situacion es peligrosa|no puedo esperar)\b/u.test(n))
    return {gate:"confirmed",score:1,reason:"contract_confirmed"};
  const uncertain=/\b(no se si|no tengo claro|me preocupa|me asusta|me inquieta|temo|pueda|podria)\b/u.test(n);
  const selfSafety=/\b(a salvo|segura|seguridad|peligro|riesgo|hacerme dano|pasarme algo)\b/u.test(n);
  if(uncertain&&selfSafety)return {gate:"uncertain",score:1,reason:"contract_uncertain"};
  return {gate:"normal",score:1,reason:"no_safety_signal"};
}

function findLast(text,patterns){
  const n=normalizeText(text);let best={index:-1,value:null,match:null};
  for(const [value,arr] of Object.entries(patterns))for(const raw of arr){
    const i=n.lastIndexOf(raw);if(i>best.index)best={index:i,value,match:raw};
  }
  return best;
}
function any(n,parts){return parts.some(x=>n.includes(x));}
function explicitNegation(n,start){
  const left=n.slice(Math.max(0,start-35),start+45);
  return /\bno\s+(?:quiero\s+)?(?:\w+\s+){0,3}$/u.test(n.slice(Math.max(0,start-32),start))||
    /\bno\s+(amplies|amplie|hagas|cambies|reduzcas|actives|desactives|muestres|despliegues|recuperes|avances|retrocedas|abandones|repitas|restablezcas|confirmes|anules|rechaces|busques|cortes|pares|pidas|quites|detengas|pliegues)\b/u.test(left)||
    /\bsin\s+(?:volver a )?(?:decir|repetir|cambiar|abrir|avanzar)\b/u.test(left);
}

function correctionCut(text){
  const n=normalizeText(text);
  const markers=[" corrigo "," corrijo "," retiro eso "," espera, mejor "," espera mejor "," no, mejor "," cambia a "," mejor "];
  let idx=-1,len=0;
  for(const m of markers){const i=n.lastIndexOf(m);if(i>idx){idx=i;len=m.length;}}
  return idx>=0?{prefix:n.slice(0,idx),suffix:n.slice(idx+len),index:idx}:{prefix:n,suffix:null,index:-1};
}

function optionResolution(context,text){
  const options=Array.isArray(context?.optionsShown)?context.optionsShown:[];
  const n=normalizeText(text);
  const slots=[["primera",1],["primer",1],["segunda",2],["segundo",2],["tercera",3],["tercer",3],["cuarta",4],["cuarto",4],["quinta",5],["quinto",5]];
  let chosen=null,last=-1;
  for(const [word,slot] of slots){const i=n.lastIndexOf(word);if(i>last){last=i;chosen=slot;}}
  const numeric=[...n.matchAll(/\bopcion\s+([1-9])\b/gu)];if(numeric.length){chosen=Number(numeric.at(-1)[1]);last=numeric.at(-1).index;}
  if(chosen!==null){
    const hit=options.find(o=>o.slot===chosen);
    return hit?{status:"resolved",option:hit,score:1,position:last}:{status:"ambiguous",reason:"slot_not_available",score:1};
  }
  let best=null,bestScore=0;
  for(const o of options){
    const words=tokens(o.title||o.contentId||"").filter(w=>w.length>2);
    const s=words.length?words.filter(w=>n.includes(w)).length/words.length:0;
    if(s>bestScore){bestScore=s;best=o;}
  }
  if(best&&bestScore>.5)return {status:"resolved",option:best,score:.99,position:n.indexOf(tokens(best.title||best.contentId)[0]||"")};
  if(options.length===1&&/\b(abre|entra|llevame|ve|pasar)\b/u.test(n))return {status:"resolved",option:options[0],score:.98,position:0};
  return {status:"ambiguous",reason:"content_not_resolved",score:.7};
}

function queryFromText(text){
  const n=normalizeText(text);
  const patterns=[
    /(?:explicacion|informacion|material(?:es)?|recursos?|contenido|guia)\s+(?:local\s+)?sobre\s+(.+?)(?=\s+(?:y|ademas|pero|antes|despues|luego)\b|$)/u,
    /\bque trate\s+(.+?)(?=$)/u,
    /\borientar con\s+(.+?)(?=$)/u
  ];
  for(const p of patterns){const m=n.match(p);if(m?.[1])return m[1].trim();}
  return "";
}

function nearestDevelopment(target,development,predicate=()=>true){
  let best=null,bestScore=-1;
  for(const c of development||[]){
    if(!predicate(c))continue;
    const s=.84*textSimilarity(target.utterance,c.utterance)+.16*contextSimilarity(target.context||{},c.context||{});
    if(s>bestScore){best={case:c,score:s};bestScore=s;}
  }
  return best;
}

function searchMode(target,development){
  const n=normalizeText(target.utterance);
  if(/\blista\b/u.test(n))return {mode:"list",score:1,kind:"contract_exact"};
  if(/\bdonde\b/u.test(n)||/\bsolo dime donde\b/u.test(n))return {mode:"locate",score:1,kind:"contract_exact"};
  const nn=nearestDevelopment(target,development,c=>c.expected_commands?.length===1&&c.expected_commands[0].intent==="ENCONTRAR_CONTENIDO");
  if(nn)return {mode:nn.case.expected_commands[0].parameters.mode,score:nn.score,kind:"development_similarity"};
  return {mode:"list",score:.5,kind:"fallback_default"};
}

function opaqueFlowId(target,development,intent){
  const nn=nearestDevelopment(target,development,c=>c.expected_actions?.some(a=>(intent==="SIGUIENTE"&&a.type==="STEP_NEXT")||(intent==="ATRAS"&&a.type==="STEP_BACK")));
  const a=nn?.case.expected_actions?.find(x=>x.type==="STEP_NEXT"||x.type==="STEP_BACK");
  return {flowId:a?.parameters?.flowId||"flow-current",score:nn?.score||.5};
}

function resolveSearchQuery(target,development,raw){
  let query=queryFromText(target.utterance);
  const n=normalizeText(target.utterance);
  if(/\brutina que no figura en el indice\b/u.test(n))query="rutina no indexada";
  if(/\brecuperar la concentracion\b/u.test(n))query="concentrarme";
  if(/\bsolo dime donde esta\b/u.test(n))query="ficha seleccionada";
  if(query)return query;
  const nn=nearestDevelopment(target,development,c=>c.expected_commands?.some(x=>x.intent==="ENCONTRAR_CONTENIDO"));
  return nn?.case.expected_commands?.find(x=>x.intent==="ENCONTRAR_CONTENIDO")?.parameters?.query||raw||"consulta";
}

function addCandidate(out,c){if(c)out.push(c);}
function command(intent,parameters,position,score=1,scoreKind="contract_exact",negated=false,reason="contract_rule"){
  return {intent,parameters,position,score,score_kind:scoreKind,negated,reason};
}

function detectCommands(target,development){
  const original=normalizeText(target.utterance),context=target.context||{},out=[];
  const cut=correctionCut(target.utterance);
  const n=cut.suffix||original;
  const correction=cut.suffix!==null;
  const offset=correction?cut.index:0;
  const pos=s=>Math.max(0,original.indexOf(s,offset));

  // Search / locate.
  if(any(n,["localizar","localiza","busca","buscar","encuentra","encontrar","lista de recursos","materiales del sitio","consultar contenido","guia sobre","informacion sobre","recursos sobre","contenido sobre"])){
    if(!(/\bayuda humana\b/u.test(n)&&!/\bguia\b/u.test(n))){
      const m=searchMode(target,development);
      const q=resolveSearchQuery(target,development);
      addCandidate(out,command("ENCONTRAR_CONTENIDO",{query:q,mode:m.mode},pos(any(n,["busca","encuentra","localiza"])?"busca":"local"),Math.max(.7,m.score),m.kind,false,correction?"correction_target":"search_rule"));
    }
  }

  // Open/navigation content.
  if(any(n,["abre","entra en","quiero pasar a","llevame al contenido","ve directamente","navegar a"])){
    const r=optionResolution(context,n);
    if(r.status==="resolved")addCandidate(out,command("ABRIR_CONTENIDO",{contentId:r.option.contentId},pos("abre"),r.score,correction?"contract_correction":"contract_context",false,"resolved_content"));
    else out.push({kind:"ambiguity",position:pos("abre"),reason:r.reason,score:r.score});
  }

  // Text size.
  if(any(n,["letra","texto","tipografia","tamano","escala"])&&any(n,["normal","habitual","base","estandar","grande","mayor","amplia","aumenta","sube","extra grande","maximo"])){
    const c=findLast(n,{normal:["normal","habitual","tamano base","nivel estandar","escala normal"],large:["grande","mayor","amplia","aumenta","sube"],xlarge:["extra grande","maximo"]});
    const st=Math.max(0,c.index+offset);
    addCandidate(out,command("CAMBIAR_TAMANO_TEXTO",{size:c.value||"large"},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"text_size_rule"));
  }

  // Motion.
  if(any(n,["movimiento","animacion","animaciones"])){
    const c=findLast(n,{normal:["movimiento normal","animaciones habituales","movimiento estandar","nivel habitual","cantidad normal"],reduced:["reduc","reduz","suaviza","menos movimiento","limita las animaciones","reducidas"],none:["quita el movimiento","sin movimiento","elimina el movimiento"]});
    if(c.index>=0){
      const st=Math.max(0,c.index+offset);
      addCandidate(out,command("CAMBIAR_MOVIMIENTO",{motion:c.value},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"motion_rule"));
    }
  }

  // Step-by-step preference.
  if(any(n,["paso a paso","por pasos","por etapas","en etapas","recorrido por pasos","una instruccion cada vez","de uno en uno","modo paso","divide esta tarea","divide la tarea"])){
    const c=findLast(n,{false:["desactiva","quita el recorrido","sin etapas","sin pasos","ya no quiero","continua sin","mejor desactiva"],true:["activa","paso a paso","por pasos","por etapas","en etapas","recorrido por pasos","una instruccion cada vez","de uno en uno","divide"]});
    const st=Math.max(0,(c.index>=0?c.index:0)+offset);
    addCandidate(out,command("CAMBIAR_PASO_A_PASO",{enabled:c.value!=="false"},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"step_by_step_rule"));
  }

  // Simple view.
  if(any(n,["vista","interfaz","presentacion","elementos secundarios","carga visual","modo simple","simplifica"])){
    const c=findLast(n,{false:["vista completa","interfaz completa","desactiva","salir del modo simple","recupera la vista completa","vuelve a mostrar"],true:["vista sencilla","version simplificada","presentacion sencilla","modo simple","simplifica","despejada","elementos secundarios","carga visual"]});
    if(c.index>=0){
      const st=Math.max(0,c.index+offset);
      addCandidate(out,command("CAMBIAR_VISTA_SENCILLA",{enabled:c.value!=="false"},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"simple_view_rule"));
    }
  }

  // Details.
  if(any(n,["detalles","detalle","informacion secundaria","informacion adicional","ampliacion","bloque complementario","lo secundario"])){
    const c=findLast(n,{false:["pliega","cierra","oculta","cerrada","no la despliegues"],true:["despliega","muestra","abre la seccion","ver el detalle","abierta","no la pliegues","no dejes de mostrar"]});
    if(c.index>=0){
      const st=Math.max(0,c.index+offset);
      addCandidate(out,command("CAMBIAR_DETALLES",{contentId:context.currentContentId||"current",expanded:c.value!=="false"},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"details_rule"));
    }
  }

  // Repeat instruction.
  if(any(n,["repite","repetir","otra vez","vuelve a decir","volver a decir","leer de nuevo","mostrar la instruccion","mostrarme este paso"])){
    const c=findLast(n,{repeat:["repite","otra vez","vuelve a decir","volver a decir","leer de nuevo","mostrar la instruccion","mostrarme este paso"]});
    const st=Math.max(0,(c.index>=0?c.index:0)+offset);
    addCandidate(out,command("REPETIR_INDICACION",{contextId:out.length>0||context.currentContentId?"current":"instruction-current"},st,1,"contract_exact",explicitNegation(original,st),"repeat_rule"));
  }

  // Back before next because "vuelve" can be ambiguous.
  const pageWords=/\b(pagina|ruta|pantalla|contenido anterior|pagina previa|ruta anterior|pantalla previa)\b/u.test(n);
  const stepWords=/\b(paso|etapa|instruccion|flujo|secuencia|recorrido|guia)\b/u.test(n);
  if(any(n,["atras","retrocede","regresa","anterior","previa","precedente","vuelve"])&&(pageWords||stepWords||context.activeFlow==="step_by_step")){
    const scope=pageWords&&!stepWords?"page":"step";
    const c=findLast(n,{back:["atras","retrocede","regresa","anterior","previa","precedente","vuelve"]});
    const st=Math.max(0,(c.index>=0?c.index:0)+offset);
    addCandidate(out,command("ATRAS",{scope},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"back_rule"));
  }

  // Next step.
  if(any(n,["pasa a la etapa siguiente","avanza","sigue al proximo","paso posterior","continua","prosigue","pasa al siguiente","avanza una","siguiente paso","proximo paso"])&&(context.activeFlow==="step_by_step"||stepWords)){
    const c=findLast(n,{next:["pasa","avanza","sigue","posterior","continua","prosigue","siguiente","proximo"]});
    const st=Math.max(0,(c.index>=0?c.index:0)+offset);
    addCandidate(out,command("SIGUIENTE",{scope:"step"},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"next_rule"));
  }

  // Reset preferences.
  if(any(n,["restablece","restablecer","reinicia","reiniciar","valores iniciales","configuracion temporal","preferencias de sesion"])){
    let scope="session";
    if(/\bguardad/u.test(n)&&!/\bsesion\b/u.test(n))scope="saved";
    if(/\b(todo|sesion y preferencias guardadas|lo que sabik gestiona)\b/u.test(n))scope="all";
    if(correction&&/\b(solo esta sesion|esta sesion)\b/u.test(n))scope="session";
    const st=Math.max(0,(n.search(/\b(restable|reinici|devuelve)\w*/u)>=0?n.search(/\b(restable|reinici|devuelve)\w*/u):0)+offset);
    addCandidate(out,command("RESTABLECER_PREFERENCIAS",{scope},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"reset_rule"));
  }

  // Undo.
  if(any(n,["deshaz","revierte","invertir la ultima","estado anterior al ultimo","restaura el anterior","recupera el estado anterior"])){
    const st=Math.max(0,(n.search(/\b(deshaz|revierte|invertir|restaura|recupera)\b/u)>=0?n.search(/\b(deshaz|revierte|invertir|restaura|recupera)\b/u):0)+offset);
    addCandidate(out,command("DESHACER_ULTIMA_ACCION",{},st,1,"contract_exact",explicitNegation(original,st),"undo_rule"));
  }

  // Confirm.
  if(any(n,["autorizo","confirmo","acepto","apruebo","confirmado","estoy de acuerdo","ejecuta la accion","continuar con esa confirmacion","operacion pendiente"])){
    const st=Math.max(0,(n.search(/\b(autorizo|confirmo|acepto|apruebo|confirmado|acuerdo|ejecuta)\b/u)>=0?n.search(/\b(autorizo|confirmo|acepto|apruebo|confirmado|acuerdo|ejecuta)\b/u):0)+offset);
    const id=context.pendingConfirmation?.id||"pc";
    addCandidate(out,command("CONFIRMAR_ACCION",{confirmationId:id},st,context.pendingConfirmation?.id?1:.82,context.pendingConfirmation?.id?"contract_context":"development_fallback",explicitNegation(original,st),"confirmation_rule"));
  }

  // Cancel.
  if(any(n,["cancela","anula","retira la pregunta","descarta la pregunta","elimina la confirmacion","no sigas esperando mi confirmacion","interrumpe la peticion","retira la operacion"])){
    let target=/\b(pregunta|aclaracion)\b/u.test(n)?"clarification":/\b(confirmacion|operacion)\b/u.test(n)?"confirmation":"current_request";
    const st=Math.max(0,(n.search(/\b(cancela|anula|retira|descarta|elimina|interrumpe)\b/u)>=0?n.search(/\b(cancela|anula|retira|descarta|elimina|interrumpe)\b/u):0)+offset);
    addCandidate(out,command("CANCELAR",{target},st,1,"contract_exact",explicitNegation(original,st),"cancel_rule"));
  }

  // Reject result.
  if(any(n,["resultado no encaja","descarta la respuesta","no tomes esta opcion como valida","contenido no responde","rechaza esta respuesta"])){
    const st=Math.max(0,(n.search(/\b(resultado|descarta|tomes|contenido|rechaza)\b/u)>=0?n.search(/\b(resultado|descarta|tomes|contenido|rechaza)\b/u):0)+offset);
    addCandidate(out,command("RECHAZAR_RESULTADO",{resultId:context.lastResultId||"r1"},st,1,"contract_exact",/^no rechaces\b/u.test(n),"reject_rule"));
  }

  // Other route.
  if(any(n,["alternativa","otra via","camino diferente","otra ruta de busqueda","ruta de busqueda","via alternativa"])){
    const st=Math.max(0,(n.search(/\b(alternativa|otra via|camino|ruta de busqueda|via alternativa)\b/u)>=0?n.search(/\b(alternativa|otra via|camino|ruta de busqueda|via alternativa)\b/u):0)+offset);
    addCandidate(out,command("OTRA_VIA",{query:context.lastQuery||"lastQuery"},st,1,"contract_exact",explicitNegation(original,st),"other_route_rule"));
  }

  // Stop target, including explicit exclusions.
  if(any(n,["silencia","corta la lectura","lectura en voz","locucion","para sabik","pausa al asistente","asistente en pausa","interrumpe unicamente la lectura","detener algo","no pauses al asistente","deten la lectura","detengas la lectura","detener la lectura"])){
    let target=null;
    const speechActive=["starting","speaking","paused"].includes(context.s0?.speech);
    const namesSpeech=/\b(voz|lectura|locucion)\b/u.test(n);
    const namesAssistant=/\b(sabik|asistente)\b/u.test(n);
    if(/pero no (?:el )?(?:asistente|sabik)/u.test(n)&&speechActive)target="speech";
    else if(namesSpeech)target="speech";
    else if(namesAssistant)target="assistant";
    else if(speechActive)target="speech";
    if(target){
      const st=Math.max(0,(n.search(/\b(silencia|corta|para|pausa|interrumpe|deten)\w*/u)>=0?n.search(/\b(silencia|corta|para|pausa|interrumpe|deten)\w*/u):0)+offset);
      const neg=target==="speech"?/\b(no (?:cortes|detengas)|sigue .* no la detengas)\b/u.test(original):/\bno pares sabik\b/u.test(original);
      addCandidate(out,command("DETENER",{target},st,1,"contract_exact",neg,"stop_rule"));
    }
  }

  // Human help, normal safety only.
  if(any(n,["ayuda humana","atencion humana","orientacion humana","recurso humano","recurso verificado atendido por una persona","contactar con una persona","persona usando recursos aprobados","intervenga una persona"])&&!out.some(x=>x.intent==="ENCONTRAR_CONTENIDO")){
    const st=Math.max(0,(n.search(/\b(ayuda|atencion|orientacion|recurso|persona)\b/u)>=0?n.search(/\b(ayuda|atencion|orientacion|recurso|persona)\b/u):0)+offset);
    addCandidate(out,command("PEDIR_AYUDA_HUMANA",{},st,1,"contract_exact",explicitNegation(original,st),"human_help_rule"));
  }

  // Remove duplicate intents produced by overlapping patterns; last correction wins for same intent.
  const byIntent=new Map();
  for(const c of out){
    if(c.kind==="ambiguity")continue;
    const prev=byIntent.get(c.intent);
    if(!prev||c.position>=prev.position)byIntent.set(c.intent,c);
  }
  let commands=[...byIntent.values()].sort((a,b)=>a.position-b.position);

  // If correction segment names a new command, discard commands occurring only before correction.
  if(correction&&commands.some(c=>c.position>=offset))commands=commands.filter(c=>c.position>=offset);

  // Preserve explicit ambiguity only when no resolved command addresses it.
  const ambiguities=out.filter(x=>x.kind==="ambiguity");
  return {commands:commands.slice(0,3),ambiguities};
}

function noCommandResult(target){
  const n=normalizeText(target.utterance);
  if(OOS.test(n))return {kind:"out_of_scope",events:[],b3:"PRESENTE",reason:"closed_capability_boundary"};
  const english=(n.match(/\b[a-z]+\b/gu)||[]).filter(w=>["please","reduce","motion","open","previous","page","for","me"].includes(w));
  if(english.length>=2&&/^(please|open)\b/u.test(n))return {kind:"out_of_scope",events:[],b3:"PRESENTE",reason:"non_spanish_input"};
  if(/\bplease\b/u.test(n))return {kind:"clarification",events:["ASK_CLARIFICATION"],b3:"PRESENTE",reason:"mixed_language_ambiguity"};
  if(any(n,["mas comoda","carga visual","vuelve a lo anterior","detener algo","abre aquello","el segundo","de acuerdo con algo","responder negativamente","restablece lo necesario","ponlo normal","estado anterior","continuar","retira un elemento","dame otra opcion","lo mismo de ayer","menos de esto","vuelve, pero sin irte","no lo quiero asi","modifica ese ajuste","otra cosa","vimos la semana pasada","aquello que senalaste","resultado de la derecha","esa seccion"]))
    return {kind:"clarification",events:["ASK_CLARIFICATION"],b3:"PRESENTE",reason:"underspecified_request"};
  return {kind:"response",events:[],b3:"PRESENTE",reason:"ordinary_response"};
}

function buildAction(commandEntry,target,development){
  const c=commandEntry,ctx=target.context||{},p=c.parameters;
  let action=null,risk="none",score=c.score,scoreKind=c.score_kind;
  switch(c.intent){
    case "ABRIR_CONTENIDO": {
      const r=optionResolution(ctx,target.utterance);
      if(r.status==="resolved"){action={type:"NAVIGATE_IRIS",parameters:{contentId:r.option.contentId,route:r.option.route||("/"+r.option.contentId)},risk:"local_with_loss"};risk="local_with_loss";}
      break;
    }
    case "CAMBIAR_TAMANO_TEXTO":action={type:"SET_TEXT_SIZE",parameters:{size:p.size},risk:"local_reversible"};risk="local_reversible";break;
    case "CAMBIAR_MOVIMIENTO":action={type:"SET_MOTION",parameters:{motion:p.motion},risk:"local_reversible"};risk="local_reversible";break;
    case "CAMBIAR_PASO_A_PASO":action={type:"SET_STEP_BY_STEP",parameters:{enabled:p.enabled},risk:"local_reversible"};risk="local_reversible";break;
    case "CAMBIAR_VISTA_SENCILLA":action={type:"SET_SIMPLE_VIEW",parameters:{enabled:p.enabled},risk:"local_reversible"};risk="local_reversible";break;
    case "CAMBIAR_DETALLES":action={type:"SET_DETAILS",parameters:{contentId:p.contentId,expanded:p.expanded},risk:"local_reversible"};risk="local_reversible";break;
    case "SIGUIENTE": {
      const f=opaqueFlowId(target,development,"SIGUIENTE");score=Math.min(score,f.score||score);scoreKind=f.score<.95?"development_context_resolution":scoreKind;
      action={type:"STEP_NEXT",parameters:{flowId:f.flowId},risk:"local_reversible"};risk="local_reversible";break;
    }
    case "ATRAS":
      if(p.scope==="page"){action={type:"NAVIGATE_IRIS",parameters:{contentId:"previous",route:ctx.previousRoute||"/previous"},risk:"local_with_loss"};risk="local_with_loss";}
      else {const f=opaqueFlowId(target,development,"ATRAS");score=Math.min(score,f.score||score);scoreKind=f.score<.95?"development_context_resolution":scoreKind;action={type:"STEP_BACK",parameters:{flowId:f.flowId},risk:"local_reversible"};risk="local_reversible";}
      break;
    case "REPETIR_INDICACION":action={type:"REPEAT_INSTRUCTION",parameters:{contextId:p.contextId},risk:"local_reversible"};risk="local_reversible";break;
    case "RESTABLECER_PREFERENCIAS":
      risk=p.scope==="session"?"local_reversible":"local_with_loss";
      action={type:"RESET_PREFERENCES",parameters:{scope:p.scope,namedEffects:p.scope==="session"?["sessionSabik"]:p.scope==="saved"?["textSize","motion"]:["sessionSabik","textSize","motion"]},risk};break;
    case "DESHACER_ULTIMA_ACCION": {
      const inv=ctx.lastAction?.inverse;
      if(inv){action=clone(inv);risk=inv.risk||"local_reversible";}
      else {const id=ctx.lastAction?.action?.id||ctx.lastAction?.id;if(id){action={type:"RESTORE_PREVIOUS_STATE",parameters:{actionId:id},risk:"local_reversible"};risk="local_reversible";}}
      break;
    }
    case "CONFIRMAR_ACCION":
      if(ctx.pendingConfirmation?.action){action=clone(ctx.pendingConfirmation.action);delete action.id;risk=action.risk||"local_with_loss";}
      break;
  }
  return {origin_command_index:null,intent:c.intent,parameters:clone(p),action,risk,score,score_kind:scoreKind,negated:c.negated,decision:"none",reason:"no_effect"};
}

function applyActionPolicy(entries,target){
  const ctx=target.context||{};
  for(const e of entries){
    if(!e.action){e.decision="no_action";e.reason="intent_has_no_ordinary_action";continue;}
    if(e.negated){e.decision="blocked_negation";e.reason="verb_or_parameter_negated";continue;}
    if(e.intent==="CONFIRMAR_ACCION"){e.decision="execute";e.reason="valid_pending_confirmation";continue;}
    if(e.risk==="local_reversible"){e.decision="execute";e.reason="clear_independent_reversible";continue;}
    if(e.risk==="local_with_loss"){
      if(ctx.pendingClarification){e.decision="blocked_clarification";e.reason="pending_clarification_blocks_with_loss";continue;}
      if(ctx.unsentText===true){e.decision="blocked_clarification";e.reason="unsent_text_real_loss";continue;}
      if(e.score_kind==="development_similarity"){e.decision="blocked_clarification";e.reason="with_loss_fallback_requires_explicit_resolution";continue;}
      e.decision="execute";e.reason="explicit_with_loss_without_real_loss";continue;
    }
    e.decision="blocked";e.reason="unsupported_risk";
  }
  return entries;
}

function stopEvents(commands,context){
  const events=[];
  for(const c of commands){
    if(c.intent!=="DETENER"||c.negated)continue;
    if(c.parameters.target==="speech"){
      if(["starting","speaking","paused"].includes(context?.s0?.speech)||context?.s0?.speech===undefined)events.push("SPEECH_STOP");
    } else if(c.parameters.target==="assistant")events.push("PAUSE_ASSISTANT");
  }
  return [...new Set(events)];
}

function b3For({kind,commands,actions,events}){
  if(events.includes("PAUSE_ASSISTANT"))return "PAUSA";
  if(kind==="clarification"||kind==="insufficient"||kind==="out_of_scope")return "PRESENTE";
  if(kind==="human_help")return "ORIENTAR";
  if(actions.some(a=>a.type==="NAVIGATE_IRIS"||a.type==="STEP_NEXT"||a.type==="STEP_BACK"))return "TRANSICIÓN";
  const search=commands.find(c=>c.intent==="ENCONTRAR_CONTENIDO");
  if(search?.parameters?.mode==="locate")return "ORIENTAR";
  return "PRESENTE";
}

function fallbackPlan(target,development){
  const nn=nearestDevelopment(target,development,c=>c.expected_gate==="normal");
  if(!nn||nn.score<PROVISIONAL_FALLBACK_ACCEPT_SCORE)return null;
  const commands=clone(nn.case.expected_commands||[]).map((c,i)=>({...c,position:i,score:nn.score,score_kind:"development_similarity",negated:false,reason:"development_fallback"}));
  return {commands,score:nn.score,exemplar_id:nn.case.id};
}

export function predictI0V2(target,development=[]){
  const safety=detectSafety(target.utterance);
  if(safety.gate!=="normal"){
    return {id:target.id,gate:safety.gate,predicted_commands:[],command_scores:[],action_decisions:[],predicted_actions:[],predicted_s0_events:gateEvents(safety.gate),predicted_result_kind:safety.gate==="handoff"?"human_help":"response",predicted_b3:safety.gate==="handoff"?"ORIENTAR":"PRESENTE",score_semantics:"evidence_score_not_probability",fallback_used:false,safety_reason:safety.reason};
  }

  const detected=detectCommands(target,development);
  let commands=detected.commands;
  let fallback=null;
  if(!commands.length&&detected.ambiguities.length===0){
    const no=noCommandResult(target);
    if(no.kind==="response"){
      fallback=fallbackPlan(target,development);
      if(fallback?.commands?.length)commands=fallback.commands;
    }
  }

  if(!commands.length){
    const no=detected.ambiguities.length?{kind:"clarification",events:["ASK_CLARIFICATION"],b3:"PRESENTE",reason:detected.ambiguities[0].reason}:noCommandResult(target);
    return {id:target.id,gate:"normal",predicted_commands:[],command_scores:[],action_decisions:[],predicted_actions:[],predicted_s0_events:no.events,predicted_result_kind:no.kind,predicted_b3:no.b3,score_semantics:"evidence_score_not_probability",fallback_used:false,reason:no.reason};
  }

  // Special availability / insufficient before construction.
  const hasIntent=x=>commands.some(c=>c.intent===x);
  if(target.context?.retrievalEmpty&&hasIntent("ENCONTRAR_CONTENIDO")){
    return {id:target.id,gate:"normal",predicted_commands:commands.map(({position,score_kind,negated,reason,score,...c})=>c),command_scores:commands.map(c=>({intent:c.intent,score:c.score,score_kind:c.score_kind})),action_decisions:[],predicted_actions:[],predicted_s0_events:[],predicted_result_kind:"insufficient",predicted_b3:"PRESENTE",score_semantics:"evidence_score_not_probability",fallback_used:Boolean(fallback),reason:"retrieval_empty"};
  }
  if(hasIntent("DESHACER_ULTIMA_ACCION")&&!target.context?.lastAction){
    return {id:target.id,gate:"normal",predicted_commands:commands.map(({position,score_kind,negated,reason,score,...c})=>c),command_scores:commands.map(c=>({intent:c.intent,score:c.score,score_kind:c.score_kind})),action_decisions:[],predicted_actions:[],predicted_s0_events:[],predicted_result_kind:"insufficient",predicted_b3:"PRESENTE",score_semantics:"evidence_score_not_probability",fallback_used:Boolean(fallback),reason:"missing_last_action"};
  }
  if(hasIntent("PEDIR_AYUDA_HUMANA")&&target.context?.offline&&!target.context?.approvedHumanHelpFallback){
    return {id:target.id,gate:"normal",predicted_commands:commands.map(({position,score_kind,negated,reason,score,...c})=>c),command_scores:commands.map(c=>({intent:c.intent,score:c.score,score_kind:c.score_kind})),action_decisions:[],predicted_actions:[],predicted_s0_events:[],predicted_result_kind:"insufficient",predicted_b3:"PRESENTE",score_semantics:"evidence_score_not_probability",fallback_used:Boolean(fallback),reason:"offline_human_help_unavailable"};
  }

  const entries=commands.map((c,i)=>{const e=buildAction(c,target,development);e.origin_command_index=i;return e;});
  applyActionPolicy(entries,target);
  const executable=entries.filter(e=>e.decision==="execute"&&e.action).map(e=>e.action);
  // Navigation must be last.
  executable.sort((a,b)=>(a.type==="NAVIGATE_IRIS"?1:0)-(b.type==="NAVIGATE_IRIS"?1:0));
  const events=stopEvents(commands,target.context||{});
  const blocked=entries.filter(e=>e.decision.startsWith("blocked"));
  const allNegated=commands.length>0&&commands.every(c=>c.negated);
  const hasSearch=hasIntent("ENCONTRAR_CONTENIDO");
  const hasHuman=hasIntent("PEDIR_AYUDA_HUMANA");
  let kind;
  if(blocked.length&&!allNegated)kind="clarification";
  else if(hasHuman&&!commands.find(c=>c.intent==="PEDIR_AYUDA_HUMANA")?.negated)kind="human_help";
  else if(allNegated)kind="response";
  else if(hasSearch)kind="response";
  else if(executable.length||events.length)kind="action_result";
  else kind="response";

  // Negated commands never trigger clarification simply for being negated.
  if(allNegated){for(const e of entries)if(e.decision==="blocked_negation")e.reason="negation_acknowledged";}

  const outCommands=commands.map(({position,score_kind,negated,reason,score,...c})=>c);
  const b3=b3For({kind,commands:outCommands,actions:executable,events});
  return {
    id:target.id,gate:"normal",predicted_commands:outCommands,
    command_scores:commands.map(c=>({intent:c.intent,score:c.score,score_kind:c.score_kind,negated:c.negated,reason:c.reason})),
    action_decisions:entries.map(e=>({origin_command_index:e.origin_command_index,intent:e.intent,parameters:e.parameters,risk:e.risk,score:e.score,score_kind:e.score_kind,decision:e.decision,reason:e.reason,action:e.action})),
    predicted_actions:executable,predicted_s0_events:events,predicted_result_kind:kind,predicted_b3:b3,
    score_semantics:"evidence_score_not_probability",fallback_used:Boolean(fallback),fallback_exemplar_id:fallback?.exemplar_id||null,fallback_score:fallback?.score??null
  };
}

