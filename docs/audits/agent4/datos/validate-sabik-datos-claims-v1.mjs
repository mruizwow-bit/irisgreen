#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
function parseCSV(s){
 const rows=[];let row=[],cell="",q=false;
 for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'&&s[i+1]==='"'){cell+='"';i++;}else if(c==='"')q=false;else cell+=c;}else{if(c==='"')q=true;else if(c===','){row.push(cell);cell="";}else if(c==='\n'){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell="";}else cell+=c;}}
 if(cell.length||row.length){row.push(cell);rows.push(row);}
 const h=rows[0];return rows.slice(1).filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(h.map((k,j)=>[k,r[j]??""])));
}
const claims=parseCSV(fs.readFileSync(path.join(here,"SABIK_DATOS_CLAIM_VERIFICATION_REGISTER_V1.csv"),"utf8"));
const pages=parseCSV(fs.readFileSync(path.join(here,"SABIK_DATOS_49_VERIFICATION_REGISTER_V1.csv"),"utf8"));
const changes=parseCSV(fs.readFileSync(path.join(here,"SABIK_DATOS_49_CHANGESET_V1.csv"),"utf8"));
const errors=[];
const claimRequired=["claim_id","page_id","texto_publicado","valor","unidad","tipo_de_medida","poblacion","territorio","periodo_de_datos","periodo_de_recogida","fecha_publicacion","metodo","fuente","fuente_primaria","url_doi","intervalo_incertidumbre","coincidencia_fuente_web","limitacion","comparability","atomicidad","derivado","decision","correccion_propuesta","fecha_consulta"];
const pageRequired=["page_id","ruta","claims_relevantes","claims_verificados","claims_requieren_correccion","claims_historicos_conservados","fuentes_secundarias_justificadas","estado","fecha_consulta","gate"];
const decisions=new Set(["VERIFICADO","VERIFICADO_SECUNDARIA_JUSTIFICADA","REQUIERE_CORRECCION","HISTORICO_CONSERVAR"]);
const comps=new Set(["DIRECTA","LIMITADA","NO_DIRECTA","NO_APLICA"]);
const primaryEnum=new Set(["SI","NO"]);
const matchEnum=new Set(["SI","DERIVADO_DE_VALORES_FUENTE","NO_FUENTE_NO_ENLAZADA"]);
const atomicEnum=new Set(["ATOMICO","CONTEXTO_MUESTRA"]);
const pageStates=new Set(["VERIFICADA","EN_REVISIÓN","HISTÓRICA","SUSTITUIDA"]);
const derivedEnum=new Set(["SI","NO"]);
const opEnum=new Set(["NO_APLICA","PERCENT_CHANGE","RATIO","PERCENT_FROM_RATE_1000","ONE_IN_N_FROM_PERCENT","ONE_IN_N_FROM_RATE_1000","ONE_IN_N_FROM_RATE_100000","PERCENT_FROM_ONE_IN_N"]);
const roundingEnum=new Set(["NO_APLICA","DECIMALS_1","DECIMALS_2","NEAREST_INTEGER"]);
for(const r of claims){
 for(const k of claimRequired) if(!(k in r)||String(r[k]).trim()==="") errors.push(r.claim_id+": substantive field empty "+k);
 if(!decisions.has(r.decision)) errors.push(r.claim_id+": invalid decision "+r.decision);
 if(!comps.has(r.comparability)) errors.push(r.claim_id+": invalid comparability "+r.comparability);
 if(!primaryEnum.has(r.fuente_primaria)) errors.push(r.claim_id+": invalid fuente_primaria "+r.fuente_primaria);
 if(!matchEnum.has(r.coincidencia_fuente_web)) errors.push(r.claim_id+": invalid coincidencia_fuente_web "+r.coincidencia_fuente_web);
 if(!atomicEnum.has(r.atomicidad)) errors.push(r.claim_id+": invalid atomicidad "+r.atomicidad);
 if(!derivedEnum.has(r.derivado)) errors.push(r.claim_id+": invalid derivado "+r.derivado);
 if(r.decision==="REQUIERE_CORRECCION"&&r.correccion_propuesta==="NO_APLICA") errors.push(r.claim_id+": correction missing");
 if(r.decision==="VERIFICADO_SECUNDARIA_JUSTIFICADA"&&r.fuente_primaria!=="NO") errors.push(r.claim_id+": secondary decision requires fuente_primaria=NO");
 if(r.fuente_primaria==="NO"&&!["VERIFICADO_SECUNDARIA_JUSTIFICADA","REQUIERE_CORRECCION"].includes(r.decision)) errors.push(r.claim_id+": secondary source decision incoherent");
 if(r.derivado==="SI"){
   if(!opEnum.has(r.formula_op)||r.formula_op==="NO_APLICA") errors.push(r.claim_id+": derived op missing");
   if(!roundingEnum.has(r.redondeo)||r.redondeo==="NO_APLICA") errors.push(r.claim_id+": rounding missing");
   if(!r.numerador||!r.denominador||!r.formula||!r.tolerancia) errors.push(r.claim_id+": derived fields incomplete");
   if(r.coincidencia_fuente_web!=="DERIVADO_DE_VALORES_FUENTE") errors.push(r.claim_id+": derived source match incoherent");
 } else {
   if(r.formula_op!=="NO_APLICA"||r.redondeo!=="NO_APLICA"||r.tolerancia!=="NO_APLICA") errors.push(r.claim_id+": non-derived formula metadata");
 }
 // Atomicity guard for hidden equivalent representations.
 if(r.atomicidad==="ATOMICO"){
   const t=r.texto_publicado;
   if(/%.*1 de cada|1 de cada.*%/i.test(t)) errors.push(r.claim_id+": hidden %/1-in-N representation");
   if(/por 1\.000.*(?:%|1 de)|(?:%|1 de).*por 1\.000/i.test(t)) errors.push(r.claim_id+": hidden rate conversion");
   if(/mill[oó]n(?:es)?.*%|%.*mill[oó]n(?:es)?/i.test(t)) errors.push(r.claim_id+": hidden count/percent representation");
 }
}
for(const p of pages) for(const k of pageRequired) if(!(k in p)||String(p[k]).trim()==="") errors.push((p.page_id||"page")+": page field empty "+k);
const pageIds=new Set(pages.map(p=>p.page_id));
if(pages.length!==49||pageIds.size!==49) errors.push("expected 49 unique page_id; rows="+pages.length+" unique="+pageIds.size);
const claimIds=new Set(claims.map(r=>r.claim_id)); if(claimIds.size!==claims.length) errors.push("duplicate claim_id");
for(const r of claims) if(!pageIds.has(r.page_id)) errors.push(r.claim_id+": claim page not registered");
for(const p of pages){
 const rr=claims.filter(c=>c.page_id===p.page_id);
 const exact={
   claims_relevantes:rr.length,
   claims_verificados:rr.filter(x=>["VERIFICADO","VERIFICADO_SECUNDARIA_JUSTIFICADA"].includes(x.decision)).length,
   claims_requieren_correccion:rr.filter(x=>x.decision==="REQUIERE_CORRECCION").length,
   claims_historicos_conservados:rr.filter(x=>x.decision==="HISTORICO_CONSERVAR").length,
   fuentes_secundarias_justificadas:rr.filter(x=>x.decision==="VERIFICADO_SECUNDARIA_JUSTIFICADA").length
 };
 for(const [k,v] of Object.entries(exact)) if(Number(p[k])!==v) errors.push(p.page_id+": count mismatch "+k+" expected "+v+" got "+p[k]);
 if(!pageStates.has(p.estado)) errors.push(p.page_id+": invalid page state");
 if(p.estado==="VERIFICADA"&&rr.some(x=>x.decision==="REQUIERE_CORRECCION")) errors.push(p.page_id+": VERIFICADA with correction claim");
}
const changeIds=new Set(changes.map(c=>c.change_id)); if(changeIds.size!==changes.length) errors.push("duplicate change_id");
if(changes.length!==6) errors.push("expected 6 changes, got "+changes.length);
for(const c of changes){
 if(!c.change_id||!c.page_id||!c.path||!c.field||!c.current_value||!c.proposed_value||!c.reason||!c.source) errors.push((c.change_id||"change")+": substantive change field empty");
 if(c.production_applied!=="NO") errors.push(c.change_id+": production_applied must be NO");
 if(!pageIds.has(c.page_id)) errors.push(c.change_id+": change page not registered");
 if(c.claim_id&&!claimIds.has(c.claim_id)) errors.push(c.change_id+": change claim not registered");
}
function raw(op,a,b){
 if(op==="PERCENT_CHANGE") return ((a-b)/b)*100;
 if(op==="RATIO") return a/b;
 if(op==="PERCENT_FROM_RATE_1000") return a/10;
 if(op==="ONE_IN_N_FROM_PERCENT") return 100/a;
 if(op==="ONE_IN_N_FROM_RATE_1000") return 1000/a;
 if(op==="ONE_IN_N_FROM_RATE_100000") return 100000/a;
 if(op==="PERCENT_FROM_ONE_IN_N") return 100/a;
 throw new Error("unknown op "+op);
}
function rounded(v,rule){
 if(rule==="DECIMALS_1") return Math.round(v*10)/10;
 if(rule==="DECIMALS_2") return Math.round(v*100)/100;
 if(rule==="NEAREST_INTEGER") return Math.round(v);
 return v;
}
let derivedChecked=0;
for(const r of claims.filter(x=>x.derivado==="SI")){
 const a=Number(r.numerador),b=Number(r.denominador),target=Number(r.valor),tol=Number(r.tolerancia);
 if(!Number.isFinite(a)||!Number.isFinite(b)||!Number.isFinite(target)||!Number.isFinite(tol)){errors.push(r.claim_id+": nonnumeric derived input");continue;}
 const result=rounded(raw(r.formula_op,a,b),r.redondeo);
 if(Math.abs(result-target)>tol) errors.push(r.claim_id+": derived mismatch computed "+result+" published "+target+" tolerance "+tol);
 derivedChecked++;
}
const dc=claims.reduce((a,r)=>(a[r.decision]=(a[r.decision]||0)+1,a),{});
const sc=pages.reduce((a,r)=>(a[r.estado]=(a[r.estado]||0)+1,a),{});
console.log(JSON.stringify({pass:errors.length===0,claims:claims.length,unique_pages:pageIds.size,changes:changes.length,derived_checked:derivedChecked,decision_counts:dc,page_statuses:sc,errors},null,2));
if(errors.length) process.exit(1);
