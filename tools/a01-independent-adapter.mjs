import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
global.window=global;
for(const file of ["state","knowledge","language","sabik-state","risk","corrections","session","retrieval","intent","decision","response"]){
  await import(path.join(root,"sabik/nea-core",file+".js"));
}
await import(path.join(root,"sabik/nea-core.js"));
const core=global.NEACoreV1;
const PUBLICABLE=core.PUBLICABLE;
const fixture={
  concepts:[
    {editorial_status:PUBLICABLE,id:"riesgo_suicida",label:"riesgo suicida",aliases:["suicidio"],risk_level:"crisis"},
    {editorial_status:PUBLICABLE,id:"autismo",label:"autismo",aliases:[]},
    {editorial_status:PUBLICABLE,id:"ansiedad",label:"ansiedad",aliases:[]}
  ],
  relations:[],actions:[],resources:[],procedures:[],corpora:{languages:[]},questions:[],fragmentsIndex:[]
};
function project(result,outcome="accepted"){
  const risk=result?.session?.risk_state||"normal";
  let classification="normal",protection="none",clarification="none";
  if(risk==="riesgo_ambiguo"){classification="risk_uncertain";protection="clarification";clarification="yes_no";}
  if(risk==="acompanamiento_en_riesgo"){classification="risk_confirmed";protection="confirmed";}
  const plan=result?.plan||null;
  const normalAllowed=!(plan?.normal_flow_disabled===true) && classification==="normal";
  const subject=plan?.subject||"none";
  return {classification,protection,clarification,normal_response_allowed:normalAllowed,outcome,subject,plan_type:plan?.type||null};
}
export async function runA01Scenario(scenario){
  let session=core.createSessionState();
  let lastResult=null,lastUserText="";
  let lastObservation={classification:"normal",protection:"none",clarification:"none",normal_response_allowed:true,outcome:"accepted",subject:"none"};
  const steps=[];
  for(const step of scenario.steps){
    const input=step.input||{};
    if(input.type==="USER_TEXT"){
      lastUserText=input.text||"";
      lastResult=core.buildResponsePlan(lastUserText,session,fixture);
      session=lastResult.session; lastObservation=project(lastResult);
    } else if(input.type==="CLARIFICATION_ANSWER"){
      const text=input.answer==="yes"?"Sí":"No"; lastUserText=text;
      lastResult=core.buildResponsePlan(text,session,fixture);
      session=lastResult.session; lastObservation=project(lastResult);
    } else if(input.type==="TECHNICAL_ERROR"){
      lastObservation={...lastObservation,outcome:"error"};
    } else if(input.type==="RETRY"){
      if(lastUserText){lastResult=core.buildResponsePlan(lastUserText,session,fixture);session=lastResult.session;lastObservation=project(lastResult);}
      else lastObservation={...lastObservation,outcome:"accepted"};
    } else if(input.type==="PAUSE"){
      lastObservation={...lastObservation,outcome:"paused"};
    } else if(input.type==="RESUME"){
      lastObservation={...lastObservation,outcome:"resumed"};
    } else if(input.type==="RESET"){
      session=core.createSessionState();lastResult=null;lastUserText="";
      lastObservation={classification:"normal",protection:"none",clarification:"none",normal_response_allowed:true,outcome:"reset",subject:"none",plan_type:null};
    } else throw new Error("Unsupported A01 input type: "+input.type);
    steps.push(structuredClone(lastObservation));
  }
  return {steps};
}
