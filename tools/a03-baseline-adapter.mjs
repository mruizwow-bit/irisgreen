import path from "node:path";
import {fileURLToPath} from "node:url";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
global.window=global;
let retrievalCount=0;
for(const file of ["state","knowledge","language","sabik-state","risk","corrections","session","retrieval","intent","decision","response"]){
  require(path.join(root,"sabik/nea-core",file+".js"));
  if(file==="retrieval"){const original=global.NEARetrieval.retrieveFragmentCandidates;global.NEARetrieval.retrieveFragmentCandidates=(...args)=>{retrievalCount++;return original(...args);};}
}
require(path.join(root,"sabik/nea-core.js"));
const core=global.NEACoreV1;
const machineApi=require(path.join(root,"sabik/nea-core/sabik-machine.js"));
const transition=machineApi.transitionSabikState;
const P=core.PUBLICABLE;
const data={concepts:[{editorial_status:P,id:"autismo",label:"autismo",aliases:[]},{editorial_status:P,id:"ansiedad",label:"ansiedad",aliases:[]}],relations:[],actions:[],resources:[],procedures:[],corpora:{languages:[]},questions:[],fragmentsIndex:[]};
const clone=v=>structuredClone(v);
function ready(){return transition(machineApi.createInitialSabikState(),{type:"BOOT_OK"});}
function low(session){return Boolean(session?.sabik_state?.low_intensity);}
function prefs(session){return clone(session.session_preferences);}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function protection(machine){return machine.safety;}
function normalAllowed(machine,plan){return machine.safety==="normal"&&!(plan?.normal_flow_disabled===true);}
function lifecycle(machine,plan){if(plan.type==="insufficient_information")return transition(machine,{type:"RETRIEVAL_EMPTY"});let next=transition(machine,{type:"RETRIEVAL_OK"});return transition(next,{type:plan.type==="clarifying_question"?"ASK_CLARIFICATION":"RESPONSE_READY"});}
export async function runA03Scenario(scenario){
  retrievalCount=0;
  let machine=ready();
  let session=core.createSessionState();
  if(scenario.setup?.preferences)session=core.setSessionPreferences(session,scenario.setup.preferences);
  const before={protection:protection(machine),cognitive:session.cognitive_state,preferences:prefs(session),low:low(session)};
  let lastPlan=null; let safetyTransition="none";
  const safetyResponse=(subject,text="")=>{const result=global.NEAResponse.buildSafetyResponse(text,session,data,machine,{subject});session=result.session;lastPlan=result.plan;};
  const ordinary=(text)=>{machine=transition(machine,{type:"SUBMIT"});const result=core.buildResponsePlan(text,session,data,machine);session=result.session;lastPlan=result.plan;machine=lifecycle(machine,lastPlan);};
  for(const action of scenario.actions){
    if(action.type==="SAFETY_CONFIRMED"){machine=transition(machine,{type:"RISK_CONFIRMED"});safetyTransition="RISK_CONFIRMED";safetyResponse("self");}
    else if(action.type==="SAFETY_UNCERTAIN"){machine=transition(machine,{type:"RISK_UNCERTAIN"});safetyTransition="RISK_UNCERTAIN";safetyResponse("self");}
    else if(action.type==="SAFETY_THIRD_PERSON_CURRENT"){machine=transition(machine,{type:"RISK_CONFIRMED"});safetyTransition="RISK_CONFIRMED";safetyResponse("third_person");}
    else if(action.type==="COGNITIVE_OVERLOAD_EXPLICIT"){ordinary("Estoy saturada y no puedo pensar.");}
    else if(action.type==="SAFETY_CONFIRMED_WITH_COGNITIVE_OVERLOAD"){machine=transition(machine,{type:"RISK_CONFIRMED"});safetyTransition="RISK_CONFIRMED";safetyResponse("self","Estoy saturada y no puedo pensar.");}
    else if(action.type==="NEUTRAL_TURN"){if(machine.safety==="normal")ordinary("Consulta neutra.");else safetyResponse(session.last_plan?.subject||"self","Consulta neutra.");}
    else if(action.type==="PAUSE"){machine=transition(machine,{type:"PAUSE_ASSISTANT"});}
    else if(action.type==="RESUME"){machine=transition(machine,{type:"RESUME_ASSISTANT"});if(machine.safety!=="normal")safetyResponse(session.last_plan?.subject||"self");}
    else if(action.type==="TECHNICAL_ERROR"){machine=transition(machine,{type:"TECHNICAL_ERROR"});}
    else if(action.type==="RETRY"){machine=transition(machine,{type:"RETRY"});if(machine.safety!=="normal")safetyResponse(session.last_plan?.subject||"self");}
    else if(action.type==="RESET"){const keep=prefs(session);machine=transition(machine,{type:"RESET_SESSION"});session=core.createSessionState();session=core.setSessionPreferences(session,keep);lastPlan=null;if(machine.safety!=="normal")safetyResponse("none");}
    else if(action.type==="SAFETY_CLEAR"){machine=transition(machine,{type:"RISK_CLEARED"});safetyTransition="RISK_CLEARED";}
    else if(action.type==="SENSITIVE_INFORMATIONAL"){ordinary("Consulta informativa sensible sin señal cognitiva propia.");}
    else throw new Error("Unsupported A03 action: "+action.type);
  }
  const after={protection:protection(machine),cognitive:session.cognitive_state,preferences:prefs(session),low:low(session)};
  return {
    protection_before:before.protection,protection_after:after.protection,
    cognitive_state_before:before.cognitive,cognitive_state_after:after.cognitive,
    session_preferences_before:before.preferences,session_preferences_after:after.preferences,
    low_intensity_before:before.low,low_intensity_after:after.low,
    session_preferences_unchanged:same(before.preferences,after.preferences),
    low_intensity_unchanged:before.low===after.low,
    normal_response_allowed:normalAllowed(machine,lastPlan),
    ordinary_retrieval:retrievalCount>0,
    safety_transition:safetyTransition,
    explicit_cognitive_signal:Boolean(scenario.explicit_cognitive_signal),
    adaptation_changed:!same(before.preferences,after.preferences)||before.low!==after.low
  };
}
