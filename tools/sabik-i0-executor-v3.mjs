// Sabik I0 executor V2 — development-only structural correction.
// Contract-first. No calibration/validation data is loaded or embedded.

const clone=x=>JSON.parse(JSON.stringify(x));
export const DEFAULT_EXECUTOR_V3_CONFIG=Object.freeze({fallback_accept_score_min:0.34});

export function normalizeExecutorV3Config(config={}){
  const value=Number(config.fallback_accept_score_min??DEFAULT_EXECUTOR_V3_CONFIG.fallback_accept_score_min);
  if(!Number.isFinite(value)||value<0||value>1)throw new Error("fallback_accept_score_min must be a finite number in [0,1]");
  return {fallback_accept_score_min:value};
}
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
  const last=(re)=>{let x=-1;for(const m of n.matchAll(new RegExp(re.source,re.flags.includes("g")?re.flags:re.flags+"g")))x=m.index;return x;};
  const educational=/\b(historia|personaje|pelicula|trabajo|material educativo|informacion de prevencion|senales de riesgo|no es sobre mi|no hablo de mi situacion|yo estoy bien|no estoy en riesgo|sin crisis actual)\b/u.test(n);
  const selfReference=/\b(mi|me|estoy|propia|para mi|hacerme|lesionarme|danarme|segura)\b/u.test(n);
  if(educational&&!selfReference)return {gate:"normal",score:1,reason:"explicit_non_personal_context"};

  const candidates=[];const push=(gate,index,reason,priority)=>{if(index>=0)candidates.push({gate,index,reason,priority});};
  const human=/\b(intervencion humana|asistencia humana|ayuda humana|apoyo humano|persona|alguien|profesional|recurso humano)\b/u;
  const activeDanger=/\b(peligro|riesgo|emergencia|urgente|urgencia|inmediato|inmediata|ahora|actual|situacion peligrosa|danarme|hacerme dano|lesionarme)\b/u;
  const explicitlyNonUrgent=/\b(no\s+(?:es\s+|una\s+)?emergencia|no\s+urgente|consulta\s+(?:normal|no urgente)|gestion\s+normal|sin\s+urgencia)\b/u.test(n);
  if(human.test(n)&&activeDanger.test(n)&&!explicitlyNonUrgent)push("handoff",Math.max(last(human),last(activeDanger)),"contract_handoff_family",4);

  const urgencyIdx=last(/\b(?:peligro|riesgo|emergencia)(?:\s+\w+){0,4}\s+(?:inmediato|inmediata|urgente|actual|ahora)\b/u);
  const urgencyNegated=urgencyIdx>=0&&/\b(?:ya no|no\s+(?:es|hay|existe))\b/u.test(n.slice(Math.max(0,urgencyIdx-28),urgencyIdx+8));
  if(!urgencyNegated)push("confirmed",urgencyIdx,"contract_confirmed_urgency",3);
  push("confirmed",last(/\b(?:riesgo real(?:\s+y)?\s+urgente|riesgo real\s+ahora(?:\s+mismo)?)\b/u),"contract_confirmed_real_urgent",3);
  push("confirmed",last(/\b(?:a punto de|muy cerca de)\b[^.;]{0,55}\b(?:dano|danarme|hacerme dano|lesion|lesionarme)\b/u),"contract_confirmed_imminent_act",3);
  push("confirmed",last(/\b(?:pensando|pienso|creo que voy|voy|quiero)\s+(?:a\s+|en\s+)?(?:hacerme dano|danarme|lesionarme)\b/u),"contract_confirmed_self_harm_intent",3);
  push("confirmed",last(/\b(?:situacion|esto|ahora)\b[^.;]{0,30}\b(?:peligrosa|peligroso|riesgo real)\b/u),"contract_confirmed_current_danger",3);

  const uncertainty=/\b(no se si|no tengo claro|no estoy segura|dud\w*|me preocupa|me asusta|me inquieta|temo|no se valorar|no puedo valorar|incertidumbre)\b/u;
  const selfSafety=/\b(a salvo|segura|seguridad|peligro|riesgo|hacerme dano|danarme|lesionarme|pasarme algo|propia seguridad)\b/u;
  if(uncertainty.test(n)&&selfSafety.test(n))push("uncertain",Math.max(last(uncertainty),last(selfSafety)),"contract_uncertain_family",2);

  push("cleared",last(/\b(?:a salvo|segura|fuera de riesgo)\b/u),"contract_cleared_safe_now",1);
  const safetySubject=/\b(?:situacion|riesgo|peligro|lo preocupante)\b/u.test(n);
  const resolvedAt=last(/\b(?:termino|ha terminado|se resolvio|resuelto|ya no (?:esta|sigue|ocurre|esta ocurriendo|es (?:un )?riesgo)|ya no (?:hay|existe)(?: el| un| una)? (?:peligro|riesgo))\b/u);
  if(safetySubject&&resolvedAt>=0)push("cleared",resolvedAt,"contract_cleared_resolved",1);

  if(!candidates.length)return {gate:"normal",score:1,reason:"no_safety_signal"};
  const cleared=candidates.filter(c=>c.gate==="cleared").sort((a,b)=>b.index-a.index)[0];
  const active=candidates.filter(c=>c.gate!=="cleared");
  const latestActive=active.length?Math.max(...active.map(c=>c.index)):-1;
  if(cleared&&cleared.index>latestActive)return {gate:"cleared",score:1,reason:cleared.reason};
  active.sort((a,b)=>b.priority-a.priority||b.index-a.index);
  if(active.length)return {gate:active[0].gate,score:1,reason:active[0].reason};
  return {gate:"cleared",score:1,reason:cleared.reason};
}
function findLast(text,patterns){
  const n=normalizeText(text);let best={index:-1,value:null,match:null};
  for(const [value,arr] of Object.entries(patterns))for(const raw of arr){
    const i=n.lastIndexOf(raw);if(i>best.index)best={index:i,value,match:raw};
  }
  return best;
}
export function any(n,parts){
  const escapeRegex=value=>String(value).replace(/[.*+?^\x24{}()|[\]\\]/g,"\\$&");
  return parts.some(part=>{
    const pattern=escapeRegex(part).replace(/\s+/g,"\\s+");
    return new RegExp("(?:^|[^\\p{L}\\p{N}])"+pattern+"(?=$|[^\\p{L}\\p{N}])","u").test(n);
  });
}
function clauseBounds(n,start){
  const left=n.slice(0,start);
  const separators=[...left.matchAll(/[.;,:]|\b(?:y|pero|aunque|luego|despues|ademas|mientras)\b/gu)];
  const begin=separators.length?(separators.at(-1).index+separators.at(-1)[0].length):0;
  const right=n.slice(start);
  const endMatch=right.match(/[.;,:]|\b(?:y|pero|aunque|luego|despues|ademas|mientras)\b/u);
  const end=endMatch?start+endMatch.index:n.length;
  return {before:n.slice(begin,start),at:n.slice(start,end),segment:n.slice(begin,end)};
}
function explicitNegation(n,start){
  const w=clauseBounds(n,start);
  if(/\b(?:no|nunca|jamas)\b/u.test(w.before))return true;
  if(/^\s*(?:no|nunca|jamas)\b/u.test(w.at))return true;
  if(/\bsin\s+(?:volver a\s+)?(?:\w+\s+){0,3}$/u.test(w.before))return true;
  return false;
}
function correctionCut(text){
  const n=normalizeText(text);
  const re=/\b(?:corrijo|corrigo|rectifico|retiro(?:\s+eso)?|espera(?:\s+mejor)?|mejor|cambio\s+a)\b/gu;
  let last=null;
  for(const m of n.matchAll(re))last=m;
  if(!last)return {prefix:n,suffix:null,index:-1};
  const index=last.index??-1;
  return {prefix:n.slice(0,index),suffix:n.slice(index+last[0].length).trim(),index};
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
  if(options.length===1&&/\b(abre|entra|llevame|ve|pasar|navegar)\b/u.test(n))return {status:"resolved",option:options[0],score:.98,position:0};
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
  if(/\b(donde|ubicacion|localizacion|localiza(?:r|cion)?)\b/u.test(n))return {mode:"locate",score:1,kind:"contract_exact"};
  const nn=nearestDevelopment(target,development,c=>c.expected_commands?.length===1&&c.expected_commands[0].intent==="ENCONTRAR_CONTENIDO");
  if(nn)return {mode:nn.case.expected_commands[0].parameters.mode,score:nn.score,kind:"development_similarity"};
  return {mode:"list",score:.5,kind:"fallback_default"};
}

function opaqueFlowId(target,development,intent){
  const nn=nearestDevelopment(target,development,c=>c.expected_actions?.some(a=>(intent==="SIGUIENTE"&&a.type==="STEP_NEXT")||(intent==="ATRAS"&&a.type==="STEP_BACK")));
  const a=nn?.case.expected_actions?.find(x=>x.type==="STEP_NEXT"||x.type==="STEP_BACK");
  return {flowId:a?.parameters?.flowId||"flow-current",score:nn?.score||.5};
}

const SEARCH_QUERY_CANON=Object.freeze([
  {canonical:"concentrarme",pattern:/\b(?:concentr\w*|enfoc\w*|foco mental)\b/u}
]);

function stripQueryArticles(query){
  return normalizeText(query).replace(/[.?!]+$/u,"").replace(/^(?:un|una|unos|unas|el|la|los|las)\s+/u,"").trim();
}

function indexedAbsenceCanonical(query){
  const q=stripQueryArticles(query);
  const m=q.match(/^(.+?)\s+que\s+no\s+(?:figura|aparece|consta|se encuentra|esta)\s+(?:en|dentro de)\s+(?:el\s+)?indice$/u);
  if(!m)return "";
  const subject=m[1].trim();
  const last=subject.split(/\s+/u).at(-1)||"";
  const adjective=last.endsWith("as")?"no indexadas":last.endsWith("os")?"no indexados":last.endsWith("a")?"no indexada":"no indexado";
  return subject+" "+adjective;
}

function selectedReferentQuery(text){
  const n=normalizeText(text);
  if(!/\b(donde|ubicacion|localizacion|lugar|sitio)\b/u.test(n))return "";
  const before=n.split(/\b(?:espera|mejor|corrijo|corrigo|retira|retira eso|cambio)\b/u)[0];
  const m=before.match(/\b(?:abre|entra en|llevame a|ve a)\s+(?:esa|ese|aquella|aquel|la|el)?\s*([\p{L}][\p{L}-]*)/u);
  if(!m)return "";
  const noun=m[1];
  const adjective=noun.endsWith("a")?"seleccionada":"seleccionado";
  return noun+" "+adjective;
}

function canonicalizeSearchQuery(query,text){
  let q=stripQueryArticles(query);
  const indexed=indexedAbsenceCanonical(q);
  if(indexed)return indexed;
  const semanticSource=q||normalizeText(text);
  for(const entry of SEARCH_QUERY_CANON)if(entry.pattern.test(semanticSource))return entry.canonical;
  const referent=selectedReferentQuery(text);
  if(!q&&referent)return referent;
  return q;
}

function resolveSearchQuery(target,development,raw){
  const query=canonicalizeSearchQuery(queryFromText(target.utterance),target.utterance);
  if(query)return query;
  const referent=selectedReferentQuery(target.utterance);
  if(referent)return referent;
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
  const alternativeWithoutContext=/\b(?:alternativa|otra\s+via|otra\s+ruta|otro\s+camino|ruta\s+alternativa)\b/u.test(n)&&!context.lastQuery;


  // Search / locate.
  if(!alternativeWithoutContext&&any(n,["localizar","localiza","busca","buscar","encuentra","encontrar","lista de recursos","materiales del sitio","consultar contenido","guia sobre","informacion sobre","recursos sobre","contenido sobre","donde","ubicacion","localizacion"])){
    if(!(/\bayuda humana\b/u.test(n)&&!/\bguia\b/u.test(n))){
      const m=searchMode(target,development);
      const q=resolveSearchQuery(target,development);
      addCandidate(out,command("ENCONTRAR_CONTENIDO",{query:q,mode:m.mode},pos(any(n,["busca","encuentra","localiza"])?"busca":"local"),Math.max(.7,m.score),m.kind,false,correction?"correction_target":"search_rule"));
    }
  }

  // Open/navigation content.
  if(/\b(?:abre|abrir|entra|entrar|llevame|llevarme|ve|ir|navega|navegar|pasar)\b/u.test(n)&&(/\b(?:contenido|recurso|guia|tema|ficha|seccion|opcion)\b/u.test(n)||context.optionsShown?.length)){
    const r=optionResolution(context,n);
    const openCues=["abre","abrir","entra","entrar","pasar","llevame","llevarme","ve","ir","navega","navegar"];
    const openPositions=openCues.map(x=>n.indexOf(x)).filter(x=>x>=0);
    const openPosition=(openPositions.length?Math.min(...openPositions):0)+offset;
    if(r.status==="resolved")addCandidate(out,command("ABRIR_CONTENIDO",{contentId:r.option.contentId},openPosition,r.score,correction?"contract_correction":"contract_context",false,"resolved_content"));
    else out.push({kind:"ambiguity",position:openPosition,reason:r.reason,score:r.score});
  }

  // Text size.
  if(any(n,["letra","texto","tipografia","tamano","escala"])&&any(n,["normal","habitual","base","estandar","grande","mayor","amplia","amplies","amplie","aumenta","sube","extra grande","maximo"])){
    const c=findLast(n,{normal:["normal","habitual","tamano base","nivel estandar","escala normal"],large:["grande","mayor","amplia","amplies","amplie","aumenta","sube"],xlarge:["extra grande","maximo"]});
    const st=Math.max(0,c.index+offset);
    addCandidate(out,command("CAMBIAR_TAMANO_TEXTO",{size:c.value||"large"},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"text_size_rule"));
  }

  // Motion: dimension + general polarity verb/adjective.
  if(/\b(?:movimiento|animacion|animaciones)\b/u.test(n)){
    const polarity=[...n.matchAll(/\b(?:normal|habitual|reduc\w*|suaviz\w*|limit\w*|quit\w*|elimin\w*|suprim\w*|desactiv\w*)\b/gu)];
    const lastPolarity=polarity.at(-1);
    let motion=null;
    if(lastPolarity){
      const word=lastPolarity[0];
      motion=/^(?:quit|elimin|suprim|desactiv)/u.test(word)?"none":/^(?:reduc|suaviz|limit)/u.test(word)?"reduced":"normal";
    }else if(/\bsin\s+movimiento\b/u.test(n)){
      motion="none";
    }
    if(motion){
      const baseIndex=lastPolarity?.index??n.search(/\bsin\s+movimiento\b/u);
      const st=Math.max(0,(baseIndex>=0?baseIndex:0)+offset);
      addCandidate(out,command("CAMBIAR_MOVIMIENTO",{motion},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"motion_rule"));
    }
  }

  // Step-by-step preference: structural concept + last polarity verb.
  const stepConcept=/\b(?:paso(?:s)?|etapa(?:s)?|recorrido|instruccion)\b/u.test(n);
  const stepForm=/\b(?:paso\s+a\s+paso|por\s+(?:pasos|etapas)|en\s+etapas|recorrido\s+por\s+pasos|una\s+instruccion\s+cada\s+vez|de\s+uno\s+en\s+uno|modo\s+paso)\b/u.test(n);
  if(stepConcept&&stepForm){
    const polarity=[...n.matchAll(/\b(?:activ\w*|desactiv\w*|quit\w*|divid\w*|gui\w*)\b/gu)];
    const lastPolarity=polarity.at(-1);
    const disable=lastPolarity?/^(?:desactiv|quit)/u.test(lastPolarity[0]):/\b(?:sin|ya\s+no|deja\s+de)\b/u.test(n);
    const baseIndex=lastPolarity?.index??n.search(/\b(?:paso|etapa|recorrido|instruccion)\b/u);
    const st=Math.max(0,(baseIndex>=0?baseIndex:0)+offset);
    addCandidate(out,command("CAMBIAR_PASO_A_PASO",{enabled:!disable},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"step_by_step_rule"));
  }

  // Simple view.
  if(any(n,["vista","interfaz","pantalla","presentacion","elementos secundarios","carga visual","modo simple","simplifica"])){
    const c=findLast(n,{false:["vista completa","interfaz completa","diseno completo","desactiva","desactives"],true:["vista sencilla","vista simple","interfaz sencilla","pantalla despejada","version simplificada","presentacion sencilla","modo simple","simplifica","despejada","elementos secundarios","carga visual"]});
    if(c.index>=0){
      const st=Math.max(0,c.index+offset);
      addCandidate(out,command("CAMBIAR_VISTA_SENCILLA",{enabled:c.value!=="false"},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"simple_view_rule"));
    }
  }

  // Details.
  if(any(n,["detalles","detalle","ficha","informacion secundaria","informacion adicional","informacion ampliada","ampliacion","bloque complementario","lo secundario"])){
    const c=findLast(n,{false:["pliega","pliegues","recoge","cierra","oculta","cerrada","no la despliegues"],true:["despliega","muestra","abre la seccion","ver el detalle","abierta"]});
    if(c.index>=0){
      const st=Math.max(0,c.index+offset);
      addCandidate(out,command("CAMBIAR_DETALLES",{contentId:context.currentContentId||"current",expanded:c.value!=="false"},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"details_rule"));
    }
  }

  // Repeat instruction: compositional repetition form + current instructional context.
  const repeatVerb=/\b(?:rep(?:et|it)\w*|vuelve\s+a\s+(?:decir|mostrar|expresar|leer)|volver\s+a\s+(?:decir|mostrar|expresar|leer)|(?:decir|mostrar|expresar|leer)\s+de\s+nuevo)\b/u;
  const repeatAdverb=/\botra\s+vez\b/u;
  const repeatTarget=/\b(?:instruccion|indicacion|mensaje|paso|guia|lectura|texto)\b/u;
  if(repeatVerb.test(n)||(repeatAdverb.test(n)&&(repeatTarget.test(n)||context.currentContentId||context.activeFlow==="step_by_step"))){
    const st=Math.max(0,((n.search(repeatVerb)>=0?n.search(repeatVerb):n.search(repeatAdverb))>=0?(n.search(repeatVerb)>=0?n.search(repeatVerb):n.search(repeatAdverb)):0)+offset);
    addCandidate(out,command("REPETIR_INDICACION",{contextId:out.length>0||context.currentContentId||context.activeFlow==="step_by_step"?"current":"instruction-current"},st,1,"contract_exact",explicitNegation(original,st),"repeat_rule"));
  }

  // Back before next because "vuelve" can be ambiguous.
  const pageWords=/\b(pagina|ruta|pantalla|contenido anterior|pagina previa|ruta anterior|pantalla previa)\b/u.test(n);
  const stepWords=/\b(paso|etapa|instruccion|flujo|secuencia|recorrido|guia)\b/u.test(n);
  const repeatVuelve=/\b(vuelve a (?:decir|mostrar|expresar|leer)|volver a (?:decir|mostrar|expresar|leer))\b/u.test(n);
  const explicitBack=/\batras\b/u.test(n);
  if(!repeatVuelve&&any(n,["atras","retrocede","regresa","anterior","previa","precedente","vuelve"])&&(explicitBack||pageWords||stepWords||context.activeFlow==="step_by_step")){
    const scope=pageWords&&!stepWords?"page":"step";
    const c=findLast(n,{back:["atras","retrocede","regresa","anterior","previa","precedente","vuelve"]});
    const st=Math.max(0,(c.index>=0?c.index:0)+offset);
    const negated=explicitNegation(original,st);
    if(scope==="page"&&!context.previousRoute&&!negated){
      out.push({kind:"ambiguity",position:st,reason:"page_navigation_without_previous_route",score:1});
    }else if(scope==="step"&&context.activeFlow!=="step_by_step"&&!stepWords&&!negated){
      out.push({kind:"ambiguity",position:st,reason:"navigation_without_active_flow",score:1});
    }else{
      addCandidate(out,command("ATRAS",{scope},st,correction?.96:1,correction?"contract_correction":"contract_exact",negated,"back_rule"));
    }
  }

  // Next step.
  if(!/\bsin avanzar\b/u.test(n)&&(any(n,["avanza","continua","prosigue","siguiente","proximo","posterior"])||/\b(?:pasa|sigue)\b[^.;]{0,24}\b(?:paso|etapa|instruccion|punto)\b/u.test(n))&&(context.activeFlow==="step_by_step"||stepWords)){
    const c=findLast(n,{next:["avanza","continua","prosigue","siguiente","proximo","posterior"]});
    const st=Math.max(0,(c.index>=0?c.index:0)+offset);
    addCandidate(out,command("SIGUIENTE",{scope:"step"},st,correction?.96:1,correction?"contract_correction":"contract_exact",explicitNegation(original,st),"next_rule"));
  }

  const genericNextCue=/\b(?:continua|continuar|avanza|avanzar|prosigue|proseguir|siguiente|proximo|posterior)\b/u.test(n);
  if(genericNextCue&&context.activeFlow!=="step_by_step"&&!stepWords){
    const navMatch=n.search(/\b(?:continua|continuar|avanza|avanzar|prosigue|proseguir|siguiente|proximo|posterior)\b/u);
    out.push({kind:"ambiguity",position:Math.max(0,(navMatch>=0?navMatch:0)+offset),reason:"navigation_without_active_flow",score:1});
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

  // Undo: reversal verb + previous/last state target.
  const undoVerb=/\b(?:deshaz|deshacer|revierte|revertir|invierte|invertir|restaura|restaurar|recupera|recuperar)\b/u;
  const undoTarget=/\b(?:ultimo|ultima|anterior|previo|previa|cambio|accion|ajuste|modificacion|estado)\b/u;
  if(undoVerb.test(n)&&undoTarget.test(n)){
    const st=Math.max(0,(n.search(undoVerb)>=0?n.search(undoVerb):0)+offset);
    addCandidate(out,command("DESHACER_ULTIMA_ACCION",{},st,1,"contract_exact",explicitNegation(original,st),"undo_rule"));
  }

  // Confirmation is valid only when a pending confirmation exists.
  const confirmationCue=/\b(?:autoriz\w*|confirm\w*|aprueb\w*|acept\w*)\b/u;
  if(confirmationCue.test(n)){
    const st=Math.max(0,(n.search(confirmationCue)>=0?n.search(confirmationCue):0)+offset);
    if(context.pendingConfirmation?.id){
      addCandidate(out,command("CONFIRMAR_ACCION",{confirmationId:context.pendingConfirmation.id},st,1,"contract_context",explicitNegation(original,st),"confirmation_rule"));
    }else{
      out.push({kind:"ambiguity",position:st,reason:"confirmation_without_pending_operation",score:1});
    }
  }

  // Cancellation is compositional: cancellation verb + explicit or current target.
  const cancelCue=/\b(?:cancel\w*|anul\w*|retir\w*|elimin\w*|interrump\w*|deja\s+de\s+esperar)\b/u;
  const discardControl=/\bdescart\w*\b[^.;]{0,28}\b(?:pregunta|aclaracion|confirmacion|operacion)\b/u;
  if(cancelCue.test(n)||discardControl.test(n)){
    const cueIndex=cancelCue.test(n)?n.search(cancelCue):n.search(/\bdescart\w*\b/u);
    const st=Math.max(0,(cueIndex>=0?cueIndex:0)+offset);
    const target=/\b(?:pregunta|aclaracion)\b/u.test(n)?"clarification":/\b(?:confirmacion|operacion)\b/u.test(n)?"confirmation":"current_request";
    addCandidate(out,command("CANCELAR",{target},st,1,"contract_exact",explicitNegation(original,st),"cancel_rule"));
  }

  // Reject requires a concrete previous result/reference.
  const rejectCue=/\b(?:rechaz\w*|descart\w*|no\s+(?:acept\w*|consider\w*|tom\w*))\b/u;
  if(rejectCue.test(n)&&/\b(?:resultado|respuesta|opcion|contenido)\b/u.test(n)){
    const st=Math.max(0,(n.search(rejectCue)>=0?n.search(rejectCue):0)+offset);
    if(context.lastResultId){
      addCandidate(out,command("RECHAZAR_RESULTADO",{resultId:context.lastResultId},st,1,"contract_context",/^no\s+rechac/u.test(n),"reject_rule"));
    }else{
      out.push({kind:"ambiguity",position:st,reason:"rejection_without_result",score:1});
    }
  }

  // Alternative route requires an existing search context.
  const alternativeCue=/\b(?:alternativa|otra\s+via|otra\s+ruta|otro\s+camino|ruta\s+alternativa)\b/u;
  if(alternativeCue.test(n)){
    const st=Math.max(0,(n.search(alternativeCue)>=0?n.search(alternativeCue):0)+offset);
    if(context.lastQuery){
      addCandidate(out,command("OTRA_VIA",{query:context.lastQuery},st,1,"contract_context",explicitNegation(original,st),"other_route_rule"));
    }else{
      out.push({kind:"ambiguity",position:st,reason:"alternative_without_previous_search",score:1});
    }
  }

  // Stop target, including explicit exclusions.
  if(/\b(?:silenci\w*|cort\w*|deten\w*|par\w*|paus\w*|interrump\w*)\b/u.test(n)&&/\b(?:lectura|voz|locucion|sabik|asistente)\b/u.test(n)){
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
      const neg=explicitNegation(original,st)|| (target==="speech"?/\b(?:sigue|continua)\b[^.;]{0,35}\bsin\s+(?:detener|cortar|parar)|\bno\s+(?:cortes|detengas|pares)\b/u.test(original):/\bno\s+(?:pauses|pares|detengas)\b[^.;]{0,20}\b(?:sabik|asistente)\b/u.test(original));
      addCandidate(out,command("DETENER",{target},st,1,"contract_exact",neg,"stop_rule"));
    }
  }

  // Human help, normal safety only: support/resource/contact concept + human target.
  const humanSupport=/\b(?:ayuda|asistencia|atencion|apoyo|orientacion|recurso|contactar|contacto|intervencion)\b/u.test(n);
  const humanTarget=/\b(?:humana|humano|persona|personas|verificad\w*)\b/u.test(n);
  if(humanSupport&&humanTarget&&!out.some(x=>x.intent==="ENCONTRAR_CONTENIDO")){
    const st=Math.max(0,(n.search(/\b(?:ayuda|asistencia|atencion|apoyo|orientacion|recurso|contactar|contacto|intervencion)\b/u)>=0?n.search(/\b(?:ayuda|asistencia|atencion|apoyo|orientacion|recurso|contactar|contacto|intervencion)\b/u):0)+offset);
    addCandidate(out,command("PEDIR_AYUDA_HUMANA",{},st,1,"contract_exact",explicitNegation(original,st),"human_help_rule"));
  }

  const negSpecs=[
    {intent:"CAMBIAR_TAMANO_TEXTO",re:/\bno\b[^.;]{0,55}\b(?:hagas|pongas|dejes|vuelvas|devuelvas|cambies)\b[^.;]{0,30}\b(?:letra|texto|tamano)\b[^.;]{0,20}\b(grande|normal|extra grande)\b/u,params:m=>({size:m[1]==="normal"?"normal":m[1]==="extra grande"?"xlarge":"large"})},
    {intent:"CAMBIAR_MOVIMIENTO",re:/\bno\b[^.;]{0,45}\b(?:elimines|quites|reduzcas|cambies)\b[^.;]{0,35}\bmovimiento\b/u,params:m=>({motion:/elimines|quites/u.test(m[0])?"none":/reduzcas/u.test(m[0])?"reduced":"normal"})},
    {intent:"CAMBIAR_PASO_A_PASO",re:/\bno\b[^.;]{0,25}\b(?:lo\s+)?(actives|pongas|desactives|quites)\b[^.;]{0,35}\b(?:modo\s+)?(?:por\s+)?(?:pasos|etapas|paso\s+a\s+paso|recorrido\s+por\s+pasos|guia\s+por\s+(?:pasos|etapas))\b/u,params:m=>({enabled:/actives|pongas/u.test(m[1])})},
    {intent:"CAMBIAR_VISTA_SENCILLA",re:/\bno\b[^.;]{0,35}\b(?:vuelvas|cambies|pongas|actives|desactives)\b[^.;]{0,40}\b(?:vista|interfaz|diseno)\b/u,params:m=>({enabled:!/complet/u.test(m[0])})},
    {intent:"ATRAS",re:/\bno\b[^.;]{0,20}\b(?:retrocedas|vuelvas|regreses)\b[^.;]{0,25}\b(paso|pagina|ruta|pantalla)\b/u,params:m=>({scope:/pagina|ruta|pantalla/u.test(m[1])?"page":"step"})},
    {intent:"REPETIR_INDICACION",re:/\b(?:no\b[^.;]{0,20}\brepitas|sin\s+repetir)\b[^.;]{0,35}(?:mensaje|instruccion|indicacion)?/u,params:()=>({contextId:"current"})},
    {intent:"DETENER",re:/\bno\b[^.;]{0,20}\b(?:pauses|pares|detengas)\b[^.;]{0,25}\b(sabik|asistente|lectura|voz|locucion)\b/u,params:m=>({target:/lectura|voz|locucion/u.test(m[1])?"speech":"assistant"})}
  ];
  for(const spec of negSpecs){const m=original.match(spec.re);if(m)addCandidate(out,command(spec.intent,spec.params(m),m.index??0,1,"contract_negation",true,"negated_target_rule"));}
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

  // A later location request can correct an earlier open request without a phrase-specific exception.
  const locatePosition=n.search(/\b(donde|ubicacion|localizacion)\b/u);
  const openEntry=commands.find(c=>c.intent==="ABRIR_CONTENIDO");
  const searchEntry=commands.find(c=>c.intent==="ENCONTRAR_CONTENIDO");
  if(openEntry&&searchEntry&&locatePosition>openEntry.position){
    const between=n.slice(openEntry.position,locatePosition);
    if(/\b(espera|mejor|solo|unicamente|en vez)\b/u.test(between)){
      commands=commands.filter(c=>c.intent!=="ABRIR_CONTENIDO");
    }
  }

  // Search combined with another command is a result-list operation unless location was explicit.
  if(commands.length>1&&!/\b(donde|ubicacion|localizacion)\b/u.test(n)){
    const search=commands.find(c=>c.intent==="ENCONTRAR_CONTENIDO");
    if(search)search.parameters.mode="list";
  }

  // Preserve explicit ambiguity only when no resolved command addresses it.
  const ambiguities=out.filter(x=>x.kind==="ambiguity");
  return {commands:commands.slice(0,3),ambiguities};
}

function hasReferentContext(context={}){
  return Boolean(
    context.currentContentId||
    context.lastResultId||
    context.lastQuery||
    context.lastAction||
    context.pendingClarification||
    context.pendingConfirmation||
    (Array.isArray(context.optionsShown)&&context.optionsShown.length)
  );
}

function structuralClarification(target){
  const n=normalizeText(target.utterance),context=target.context||{};
  const hasReferent=hasReferentContext(context);
  const deictic=/\b(?:esto|eso|aquello|este|esta|ese|esa|aquel|aquella|lo|la|los|las|otro|otra|primero|primera|segundo|segunda|tercero|tercera)\b/u.test(n);
  const actionVerb=/\b(?:abre(?:me)?|abrir|muestra(?:me)?|mostrar|oculta(?:me)?|ocultar|cambia(?:me)?|cambiar|modifica(?:me)?|modificar|ajusta(?:me)?|ajustar|pon(?:me)?|poner|haz(?:me)?|hacer|repite(?:me)?|repetir|retira(?:me)?|retirar|rechaza(?:me)?|rechazar|confirma(?:me)?|confirmar|continua|continuar|avanza|avanzar|retrocede|retroceder|vuelve|volver|restablece|restablecer|anula|anular|cancela|cancelar)\b/u.test(n);
  if(deictic&&actionVerb&&!hasReferent)return {reason:"deictic_without_referent"};

  const dimension=/\b(?:texto|letra|tamano|tipografia|movimiento|animacion|vista|interfaz|pantalla|paso|etapa|recorrido|detalle|informacion|preferencia|confirmacion|resultado|contenido|pagina|ruta|lectura|voz|asistente)\b/u.test(n);
  const genericChange=/\b(?:cambia|cambiar|modifica|modificar|ajusta|ajustar|configura|configurar|pon|poner|haz|hacer)\b/u.test(n);
  if(genericChange&&!dimension)return {reason:"generic_change_without_dimension"};

  const genericParameter=/\b(?:normal|grande|pequeno|menos|mas|reducido|completo|simple|sencillo)\b/u.test(n);
  if(genericParameter&&/\b(?:pon|deja|haz|cambia|ajusta)\w*\b/u.test(n)&&!dimension)return {reason:"generic_action_without_parameter_dimension"};

  const confirm=/\b(?:confirm\w*|autoriz\w*|aprueb\w*|acept\w*)\b/u.test(n);
  if(confirm&&!context.pendingConfirmation)return {reason:"confirmation_without_pending_operation"};

  const reject=/\b(?:rechaz\w*|descart\w*|no\s+(?:acept\w*|consider\w*|tom\w*))\b/u.test(n);
  if(reject&&!context.lastResultId&&!(Array.isArray(context.optionsShown)&&context.optionsShown.length))return {reason:"rejection_without_result"};

  const alternative=/\b(?:alternativa|otra\s+via|otra\s+ruta|otro\s+camino|otra\s+opcion)\b/u.test(n);
  if(alternative&&!context.lastQuery)return {reason:"alternative_without_previous_search"};

  const stepNavigation=/\b(?:continua|continuar|avanza|avanzar|siguiente|proximo|retrocede|retroceder|atras|vuelve|volver)\b/u.test(n);
  const pageNavigation=/\b(?:pagina|ruta|pantalla|contenido\s+anterior)\b/u.test(n);
  if(stepNavigation&&!pageNavigation&&context.activeFlow!=="step_by_step")return {reason:"navigation_without_active_flow"};
  if(pageNavigation&&/\b(?:vuelve|volver|regresa|regresar|retrocede|retroceder|atras)\b/u.test(n)&&!context.previousRoute)return {reason:"page_navigation_without_previous_route"};

  return null;
}

function noCommandResult(target){
  const n=normalizeText(target.utterance);
  if(OOS.test(n))return {kind:"out_of_scope",events:[],b3:"PRESENTE",reason:"closed_capability_boundary"};
  const english=(n.match(/\b[a-z]+\b/gu)||[]).filter(w=>["please","reduce","motion","open","previous","page","for","me"].includes(w));
  if(english.length>=2&&/^(?:please|open)\b/u.test(n))return {kind:"out_of_scope",events:[],b3:"PRESENTE",reason:"non_spanish_input"};
  if(/\bplease\b/u.test(n))return {kind:"clarification",events:["ASK_CLARIFICATION"],b3:"PRESENTE",reason:"mixed_language_ambiguity"};
  const structural=structuralClarification(target);
  if(structural)return {kind:"clarification",events:["ASK_CLARIFICATION"],b3:"PRESENTE",reason:structural.reason};
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

function fallbackPlan(target,development,config){
  const nn=nearestDevelopment(target,development,c=>c.expected_gate==="normal");
  if(!nn||nn.score<config.fallback_accept_score_min)return null;
  const commands=clone(nn.case.expected_commands||[]).map((c,i)=>({...c,position:i,score:nn.score,score_kind:"development_similarity",negated:false,reason:"development_fallback"}));
  return {commands,score:nn.score,exemplar_id:nn.case.id};
}

export function predictI0V3(target,development=[],config={}){
  const executorConfig=normalizeExecutorV3Config(config);
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
      fallback=fallbackPlan(target,development,executorConfig);
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
  else if(executable.length||events.length)kind="action_result";
  else if(hasSearch)kind="response";
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
    score_semantics:"evidence_score_not_probability",executor_config:executorConfig,fallback_used:Boolean(fallback),fallback_exemplar_id:fallback?.exemplar_id||null,fallback_score:fallback?.score??null
  };
}

