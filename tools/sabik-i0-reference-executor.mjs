// Sabik I0 v0.4 reference executor for calibration V1.
// Training input: development only. Validation/#173 is never loaded here.

const STOPWORDS = new Set([
  "el","la","los","las","un","una","unos","unas","de","del","al","a","en","con","por",
  "que","quiero","quisiera","me","mi","mis","esta","este","esto","esa","ese","eso","ahora",
  "solo","solamente","y","o","pero","como","lo","se","es","son","ser","muy","mas","menos"
]);

const SYNONYMS = Object.freeze({
  letra:"texto",tipografia:"texto",fuente:"texto",tamano:"texto",
  animacion:"movimiento",animaciones:"movimiento",
  sencilla:"simple",sencillo:"simple",simplificada:"simple",simplificado:"simple",
  despejada:"simple",despejado:"simple",
  detalle:"detalles",informacion:"detalles",secundaria:"detalles",secundario:"detalles",adicional:"detalles",
  etapa:"paso",etapas:"paso",punto:"paso",puntos:"paso",
  siguiente:"next",proximo:"next",proxima:"next",continua:"next",continuar:"next",
  avanza:"next",avanzar:"next",sigue:"next",
  atras:"back",retrocede:"back",retroceder:"back",anterior:"back",previo:"back",previa:"back",
  precedente:"back",regresa:"back",volver:"back",vuelve:"back",
  repite:"repeat",repetir:"repeat",indicacion:"instruction",instruccion:"instruction",mensaje:"instruction",
  busca:"search",buscar:"search",encuentra:"search",encontrar:"search",localiza:"search",localizar:"search",
  abre:"open",abrir:"open",entra:"open",entrar:"open",llevame:"open",
  restablece:"reset",restablecer:"reset",reinicia:"reset",reiniciar:"reset",restaura:"reset",
  deshaz:"undo",deshacer:"undo",revierte:"undo",revertir:"undo",
  cancela:"cancel",cancelar:"cancel",anula:"cancel",anular:"cancel",
  confirma:"confirm",confirmar:"confirm",
  pausa:"stop",parar:"stop",deten:"stop",detener:"stop",interrumpe:"stop",
  asistente:"assistant",sabik:"assistant",voz:"speech",lectura:"speech",locucion:"speech",
  ayuda:"help",humana:"human",humano:"human",persona:"human",apoyo:"help",
  riesgo:"danger",peligro:"danger",emergencia:"danger",dano:"harm",lesionarme:"harm",
  habitual:"normal",estandar:"normal",
  reducida:"reduced",reducido:"reduced",reduce:"reduced",reducir:"reduced",suaviza:"reduced",suave:"reduced",
  amplia:"large",aumenta:"large",sube:"large",mayor:"large",enorme:"xlarge",maximo:"xlarge"
});

const clone = x => JSON.parse(JSON.stringify(x));

export const normalizeText = s => String(s || "")
  .normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase()
  .replace(/[^\p{L}\p{N}\s:;,]/gu," ").replace(/\s+/g," ").trim();

function stem(t){
  if(t.length<=6) return t;
  return t.replace(/(ando|iendo|ados|adas|idos|idas|mente|ciones|cion|es|s)$/u,"");
}

function textFeatures(s){
  const raw=normalizeText(s).replace(/[:;,]/g," ").split(" ").filter(Boolean);
  const tokens=raw.filter(t=>!STOPWORDS.has(t)).map(t=>SYNONYMS[t]||stem(t));
  const out=new Set(tokens.map(t=>"u:"+t));
  for(let i=0;i<tokens.length-1;i++) out.add("b:"+tokens[i]+"_"+tokens[i+1]);
  return out;
}

function contextFeatures(context={}){
  const out=new Set();
  if(context.activeFlow) out.add("active:"+context.activeFlow);
  if(context.unsentText!==undefined) out.add("unsent:"+String(Boolean(context.unsentText)));
  if(context.pendingClarification) out.add("pending:clarification");
  if(context.pendingConfirmation) out.add("pending:confirmation");
  if(context.lastAction) out.add("last:action");
  if(Array.isArray(context.lastSources)&&context.lastSources.length) out.add("last:sources");
  if(context.lastQuery) out.add("last:query");
  if(Array.isArray(context.excludedContentIds)&&context.excludedContentIds.length) out.add("excluded:yes");
  if(Array.isArray(context.optionsShown)&&context.optionsShown.length) out.add("options:"+Math.min(4,context.optionsShown.length));
  if(context.currentContentId) out.add("current:content");
  if(context.previousRoute) out.add("previous:route");
  if(context.offline) out.add("offline:true");
  if(context.retrievalEmpty) out.add("retrieval:empty");
  if(context.s0?.speech) out.add("speech:"+context.s0.speech);
  return out;
}

function jaccard(a,b){
  let inter=0;
  for(const x of a) if(b.has(x)) inter++;
  const union=a.size+b.size-inter;
  return union?inter/union:0;
}

function structuralCommand(command){
  const p=command?.parameters||{};
  switch(command?.intent){
    case "ENCONTRAR_CONTENIDO": return {intent:command.intent,parameters:{mode:p.mode}};
    case "ABRIR_CONTENIDO": return {intent:command.intent,parameters:{}};
    case "CAMBIAR_DETALLES": return {intent:command.intent,parameters:{expanded:p.expanded}};
    case "REPETIR_INDICACION":
    case "CONFIRMAR_ACCION":
    case "RECHAZAR_RESULTADO":
    case "OTRA_VIA": return {intent:command.intent,parameters:{}};
    default: return {intent:command?.intent,parameters:p};
  }
}

function planKey(c){
  return JSON.stringify({
    gate:c.expected_gate,
    commands:(c.expected_commands||[]).map(structuralCommand),
    result:c.expected_result_kind,
    hasActions:Boolean(c.expected_actions?.length),
    events:c.expected_s0_events||[]
  });
}

function detectSafety(text){
  const n=normalizeText(text);
  const human=/\b(persona|humana|humano|intervencion|asistencia)\b/u.test(n);
  const danger=/\b(peligro|riesgo|emergencia|dano|hacerme dano|danarme|seguridad|a salvo|segura)\b/u.test(n);
  if(/\b(a salvo|fuera de riesgo|ya no (?:hay|existe|es) (?:peligro|riesgo)|riesgo termino|situacion se resolvio|ya no es un riesgo)\b/u.test(n)) return "cleared";
  if(human && /\b(peligro|riesgo|emergencia|inmediata|inmediato|actual|ahora)\b/u.test(n)) return "handoff";
  if(/\b(peligro inmediato|riesgo real|a punto de|voy a hacerme dano|puede danarme|situacion es peligrosa|no puedo esperar)\b/u.test(n)) return "confirmed";
  if(danger && /\b(no se si|no tengo claro|me preocupa|me asusta|me inquieta|temo|pueda|podria)\b/u.test(n)) return "uncertain";
  return "normal";
}

function ordinalMentions(n){
  const map=[["primera",1],["primer",1],["segunda",2],["segundo",2],["tercera",3],["tercer",3],["cuarta",4],["cuarto",4],["quinta",5],["quinto",5]];
  const found=[];
  for(const [word,slot] of map){
    const i=n.lastIndexOf(word);
    if(i>=0) found.push({i,slot});
  }
  const re=/\bopcion\s+([1-9])\b/gu;
  let m;
  while((m=re.exec(n))) found.push({i:m.index,slot:Number(m[1])});
  return found.sort((a,b)=>a.i-b.i);
}

function resolveOption(context,text,fallbackId){
  const options=Array.isArray(context?.optionsShown)?context.optionsShown:[];
  if(!options.length) return {contentId:fallbackId,route:null};
  const n=normalizeText(text);
  const ord=ordinalMentions(n);
  if(ord.length){
    const hit=options.find(o=>o.slot===ord.at(-1).slot);
    if(hit) return {contentId:hit.contentId,route:hit.route||null};
  }
  let best=null,bestScore=0;
  for(const o of options){
    const words=normalizeText(o.title||o.contentId||"").split(" ").filter(w=>w.length>2);
    const score=words.filter(w=>n.includes(w)).length;
    if(score>bestScore){bestScore=score;best=o;}
  }
  if(best) return {contentId:best.contentId,route:best.route||null};
  if(options.length===1) return {contentId:options[0].contentId,route:options[0].route||null};
  const byId=options.find(o=>o.contentId===fallbackId);
  return byId?{contentId:byId.contentId,route:byId.route||null}:{contentId:fallbackId,route:null};
}

function lastCue(text,groups,fallback){
  const n=normalizeText(text);
  let best={i:-1,value:fallback};
  for(const [value,patterns] of Object.entries(groups)){
    for(const p of patterns){
      const i=n.lastIndexOf(p);
      if(i>best.i) best={i,value};
    }
  }
  return best.value;
}

function extractQuery(text,fallback){
  const n=normalizeText(text);
  const patterns=[
    /(?:explicacion|informacion|material|materiales|recursos?|contenido|guia)\s+sobre\s+(.+?)(?=\s+(?:y|ademas|pero|antes|despues|luego)\b|$)/u,
    /\bque trate\s+(.+?)(?=\s+(?:y|ademas|pero)\b|$)/u,
    /\borientar con\s+(.+?)(?=$)/u,
    /\bsobre\s+(.+?)(?=\s+(?:y|ademas|pero|antes|despues|luego)\b|$)/u
  ];
  for(const re of patterns){
    const m=n.match(re);
    if(m?.[1]) return m[1].trim();
  }
  return fallback;
}

function adaptCommands(commands,text,context){
  const n=normalizeText(text);
  return clone(commands||[]).map(command=>{
    const p=command.parameters||{};
    switch(command.intent){
      case "ENCONTRAR_CONTENIDO":
        p.query=extractQuery(text,p.query);
        if(/\blista\b/u.test(n)) p.mode="list";
        else if(/\bdonde\b|\blocaliza\b|\blocalizar\b/u.test(n)) p.mode="locate";
        break;
      case "ABRIR_CONTENIDO": {
        const o=resolveOption(context,text,p.contentId);
        p.contentId=o.contentId;
        break;
      }
      case "CAMBIAR_TAMANO_TEXTO":
        p.size=lastCue(text,{xlarge:["extra grande","tamano maximo","maximo"],large:["grande","aumenta","sube","amplia","mayor"],normal:["normal","habitual","tamano base","estandar"]},p.size);
        break;
      case "CAMBIAR_MOVIMIENTO":
        p.motion=lastCue(text,{none:["quita el movimiento","sin movimiento","elimina todo el movimiento"],reduced:["reduc","suaviza","menos movimiento","limita las animaciones"],normal:["movimiento normal","animaciones habituales","movimiento estandar","nivel habitual"]},p.motion);
        break;
      case "CAMBIAR_PASO_A_PASO":
        p.enabled=lastCue(text,{false:["desactiva","quita el recorrido","sin etapas","sin pasos","ya no quiero","continua sin"],true:["activa","paso a paso","por pasos","en etapas","divide","una instruccion cada vez"]},String(p.enabled))==="true";
        break;
      case "CAMBIAR_VISTA_SENCILLA":
        p.enabled=lastCue(text,{false:["vista completa","interfaz completa","desactiva","salir del modo","recupera"],true:["vista sencilla","interfaz sencilla","modo simple","simplifica","despejada","menos elementos"]},String(p.enabled))==="true";
        break;
      case "CAMBIAR_DETALLES":
        p.contentId=context?.currentContentId||p.contentId||"current";
        p.expanded=lastCue(text,{false:["pliega","cierra","oculta","no muestres","no despliegues"],true:["despliega","muestra","abre la seccion","ver el detalle","mas detalles"]},String(p.expanded))==="true";
        break;
      case "ATRAS":
        if(/\b(pagina|ruta|pantalla)\b/u.test(n)&&!/\b(paso|etapa|flujo|guia)\b/u.test(n)) p.scope="page";
        else if(/\b(paso|etapa|flujo|guia|instruccion)\b/u.test(n)) p.scope="step";
        break;
      case "REPETIR_INDICACION":
        if((commands||[]).length>1) p.contextId="current";
        break;
      case "CONFIRMAR_ACCION":
        p.confirmationId=context?.pendingConfirmation?.id||p.confirmationId;
        break;
      case "CANCELAR":
        if(/\b(pregunta|aclaracion)\b/u.test(n)) p.target="clarification";
        else if(/\b(confirmacion|operacion)\b/u.test(n)) p.target="confirmation";
        else if(/\b(peticion|solicitud)\b/u.test(n)) p.target="current_request";
        break;
      case "RECHAZAR_RESULTADO":
        p.resultId=context?.lastResultId||p.resultId;
        break;
      case "OTRA_VIA":
        p.query=context?.lastQuery||p.query;
        break;
      case "DETENER":
        if(/\b(voz|lectura|locucion)\b/u.test(n)) p.target="speech";
        else if(/\b(sabik|asistente)\b/u.test(n)) p.target="assistant";
        break;
      case "RESTABLECER_PREFERENCIAS":
        if(/\b(sesion|temporal)\b/u.test(n)&&!/\b(guardad|todo)\b/u.test(n)) p.scope="session";
        else if(/\bguardad/u.test(n)&&!/\b(sesion|todo)\b/u.test(n)) p.scope="saved";
        else if(/\b(todo|sesion y|lo que sabik gestiona)\b/u.test(n)) p.scope="all";
        break;
    }
    command.parameters=p;
    return command;
  });
}

function simpleNegation(text){
  const n=normalizeText(text);
  if(!/^no\b/u.test(n)) return false;
  if(/[:;]/u.test(n)){
    const tail=n.split(/[:;]/u).at(-1);
    if(/\b(activa|desactiva|pon|usa|busca|abre|entra|repite|continua|vuelve|restablece|cancela|silencia|manten|deja|haz)\b/u.test(tail)) return false;
  }
  if(/\bpero\b/u.test(n)&&/\b(manten|deja|solo|unicamente)\b/u.test(n)) return false;
  if(/\bno,\s*mejor\b/u.test(n)) return false;
  return true;
}

function actionForCommand(command,context,text){
  const p=command.parameters||{};
  switch(command.intent){
    case "ABRIR_CONTENIDO": {
      const o=resolveOption(context,text,p.contentId);
      return {type:"NAVIGATE_IRIS",parameters:{contentId:o.contentId,route:o.route||("/"+String(o.contentId||"").replace(/^\/+/,""))},risk:"local_with_loss"};
    }
    case "CAMBIAR_TAMANO_TEXTO": return {type:"SET_TEXT_SIZE",parameters:{size:p.size},risk:"local_reversible"};
    case "CAMBIAR_MOVIMIENTO": return {type:"SET_MOTION",parameters:{motion:p.motion},risk:"local_reversible"};
    case "CAMBIAR_PASO_A_PASO": return {type:"SET_STEP_BY_STEP",parameters:{enabled:p.enabled},risk:"local_reversible"};
    case "CAMBIAR_VISTA_SENCILLA": return {type:"SET_SIMPLE_VIEW",parameters:{enabled:p.enabled},risk:"local_reversible"};
    case "CAMBIAR_DETALLES": return {type:"SET_DETAILS",parameters:{contentId:p.contentId||"current",expanded:p.expanded},risk:"local_reversible"};
    case "SIGUIENTE": return {type:"STEP_NEXT",parameters:{flowId:context?.flowId||"flow-current"},risk:"local_reversible"};
    case "ATRAS":
      if(p.scope==="page") return {type:"NAVIGATE_IRIS",parameters:{contentId:"previous",route:context?.previousRoute||"/previous"},risk:"local_with_loss"};
      return {type:"STEP_BACK",parameters:{flowId:context?.flowId||"flow-current"},risk:"local_reversible"};
    case "REPETIR_INDICACION": return {type:"REPEAT_INSTRUCTION",parameters:{contextId:p.contextId||"current"},risk:"local_reversible"};
    case "RESTABLECER_PREFERENCIAS":
      if(p.scope==="session") return {type:"RESET_PREFERENCES",parameters:{scope:"session",namedEffects:["sessionSabik"]},risk:"local_reversible"};
      return {type:"RESET_PREFERENCES",parameters:{scope:p.scope,namedEffects:p.scope==="all"?["sessionSabik","textSize","motion"]:["textSize","motion"]},risk:"local_with_loss"};
    case "DESHACER_ULTIMA_ACCION": {
      const id=context?.lastAction?.action?.id||context?.lastAction?.id;
      return id?{type:"RESTORE_PREVIOUS_STATE",parameters:{actionId:id},risk:"local_reversible"}:null;
    }
    default:return null;
  }
}

function baseEventsForGate(gate){
  if(gate==="uncertain") return ["RISK_UNCERTAIN"];
  if(gate==="confirmed") return ["RISK_CONFIRMED"];
  if(gate==="cleared") return ["RISK_CLEARED"];
  if(gate==="handoff") return ["HUMAN_HANDOFF"];
  return [];
}

function nearestPrediction(target,development,excludeId){
  const tf=textFeatures(target.utterance),cf=contextFeatures(target.context||{});
  const scored=[];
  for(const train of development){
    if(excludeId&&train.id===excludeId) continue;
    const score=.78*jaccard(tf,textFeatures(train.utterance))+.22*jaccard(cf,contextFeatures(train.context||{}));
    scored.push({train,score,key:planKey(train)});
  }
  scored.sort((a,b)=>b.score-a.score||String(a.train.id).localeCompare(String(b.train.id)));
  const top=scored[0];
  const second=scored.find(x=>x.key!==top.key)||scored[1]||{score:0};
  return {exemplar:top.train,similarity1:top.score,similarity2:second.score};
}

function confidence(sim1,sim2){
  const top1=Math.min(.999,Math.max(0,.78+.22*sim1));
  const rawTop2=Math.min(.998,Math.max(0,.52+.24*sim2));
  const top2=Math.min(rawTop2,top1-.001);
  return {top1,top2,margin:top1-top2};
}

export function rawPredict(target,development,{excludeId=null}={}){
  const safety=detectSafety(target.utterance);
  if(safety!=="normal"){
    const c=confidence(1,.15);
    return {
      id:target.id,gate:safety,predicted_commands:[],
      predicted_result_kind:safety==="handoff"?"human_help":"response",
      proposed_actions:[],predicted_s0_events:baseEventsForGate(safety),
      predicted_b3:safety==="handoff"?"ORIENTAR":"PRESENTE",
      confidence_top1:c.top1,confidence_top2:c.top2,margin:c.margin,risk_class:"none",
      exemplar_id:null,exemplar_similarity:1,source:"safety_rule"
    };
  }

  const nn=nearestPrediction(target,development,excludeId);
  const exemplar=nn.exemplar;
  const commands=adaptCommands(exemplar.expected_commands,target.utterance,target.context||{});
  let kind=exemplar.expected_result_kind;
  let events=clone(exemplar.expected_s0_events||[]);
  let b3=exemplar.expected_b3;
  let suppress=simpleNegation(target.utterance);

  if(target.context?.retrievalEmpty&&commands.some(x=>x.intent==="ENCONTRAR_CONTENIDO")){
    kind="insufficient";events=[];b3="PRESENTE";suppress=true;
  }
  if(commands.some(x=>x.intent==="DESHACER_ULTIMA_ACCION")&&!target.context?.lastAction){
    kind="insufficient";events=[];b3="PRESENTE";suppress=true;
  }
  if(commands.some(x=>x.intent==="PEDIR_AYUDA_HUMANA")&&target.context?.offline&&!target.context?.approvedHumanHelpFallback){
    kind="insufficient";events=[];b3="PRESENTE";suppress=true;
  }

  let proposed=suppress?[]:commands.map(c=>actionForCommand(c,target.context||{},target.utterance)).filter(Boolean);
  const withLoss=proposed.some(a=>a.risk==="local_with_loss");
  if(withLoss&&(target.context?.unsentText===true||target.context?.pendingClarification)){
    proposed=[];kind="clarification";events=[];b3="PRESENTE";
  }
  if(suppress&&kind!=="insufficient"){
    kind="response";events=[];b3="PRESENTE";
  }

  const c=confidence(nn.similarity1,nn.similarity2);
  const risk=proposed.some(a=>a.risk==="local_with_loss")?"local_with_loss":proposed.length?"local_reversible":"none";
  return {
    id:target.id,gate:"normal",predicted_commands:commands,predicted_result_kind:kind,
    proposed_actions:proposed,predicted_s0_events:events,predicted_b3:b3,
    confidence_top1:c.top1,confidence_top2:c.top2,margin:c.margin,risk_class:risk,
    exemplar_id:exemplar.id,exemplar_similarity:nn.similarity1,source:"development_knn_contract"
  };
}

export function applyPolicy(raw,config){
  const out=clone(raw);
  if(raw.gate!=="normal"){
    out.decision="safety";out.predicted_actions=[];return out;
  }
  if(raw.predicted_result_kind==="insufficient"){
    out.decision="insufficient";out.predicted_actions=[];out.predicted_b3="PRESENTE";return out;
  }
  if(!raw.proposed_actions.length){
    if(raw.predicted_result_kind==="clarification") out.decision="clarify";
    else if(raw.predicted_result_kind==="out_of_scope") out.decision="abstain";
    else out.decision=raw.confidence_top1>=config.classify_floor?"classify":"abstain";
    out.predicted_actions=[];
    if(out.decision==="abstain"&&raw.predicted_commands.length){
      out.predicted_result_kind="out_of_scope";out.predicted_s0_events=[];out.predicted_b3="PRESENTE";
    }
    return out;
  }

  const threshold=raw.risk_class==="local_with_loss"?config.local_with_loss:config.local_reversible;
  const pass=raw.confidence_top1>=threshold.top1&&raw.margin>=threshold.margin;
  if(pass){
    out.decision="execute";out.predicted_actions=clone(raw.proposed_actions);return out;
  }
  if(raw.confidence_top1>=config.classify_floor){
    out.decision="clarify";out.predicted_actions=[];out.predicted_result_kind="clarification";
    out.predicted_s0_events=["ASK_CLARIFICATION"];out.predicted_b3="PRESENTE";return out;
  }
  out.decision="abstain";out.predicted_actions=[];out.predicted_result_kind="out_of_scope";
  out.predicted_s0_events=[];out.predicted_b3="PRESENTE";return out;
}

