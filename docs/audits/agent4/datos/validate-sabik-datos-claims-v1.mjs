#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
function parseCSV(s){
 const rows=[];let row=[],cell="",q=false;
 for(let i=0;i<s.length;i++){const c=s[i];if(q){if(c==='"'&&s[i+1]==='"'){cell+='"';i++;}else if(c==='"')q=false;else cell+=c;}else{if(c==='"')q=true;else if(c===','){row.push(cell);cell="";}else if(c==='\n'){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell="";}else cell+=c;}}
 if(cell.length||row.length){row.push(cell);rows.push(row);}
 const h=rows[0]; return rows.slice(1).filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(h.map((k,j)=>[k,r[j]??""])));
}
const claims=parseCSV(fs.readFileSync(path.join(here,"SABIK_DATOS_CLAIM_VERIFICATION_REGISTER_V1.csv"),"utf8"));
const pages=parseCSV(fs.readFileSync(path.join(here,"SABIK_DATOS_49_VERIFICATION_REGISTER_V1.csv"),"utf8"));
const changes=parseCSV(fs.readFileSync(path.join(here,"SABIK_DATOS_49_CHANGESET_V1.csv"),"utf8"));
const errors=[];
const required=["claim_id","page_id","texto_publicado","valor","unidad","tipo_de_medida","poblacion","territorio","periodo_de_datos","fecha_publicacion","metodo","fuente","fuente_primaria","url_doi","coincidencia_fuente_web","limitacion","decision","correccion_propuesta"];
const decisions=new Set(["VERIFICADO","VERIFICADO_SECUNDARIA_JUSTIFICADA","REQUIERE_CORRECCION","HISTORICO_CONSERVAR"]);
const comps=new Set(["DIRECTA","LIMITADA","NO_DIRECTA","NO_APLICA"]);
for(const r of claims){
 for(const k of required) if(!(k in r)) errors.push(r.claim_id+": missing column "+k);
 if(!decisions.has(r.decision)) errors.push(r.claim_id+": invalid decision "+r.decision);
 if(!comps.has(r.comparability)) errors.push(r.claim_id+": invalid comparability "+r.comparability);
 if(!r.claim_id||!r.page_id||!r.texto_publicado||!r.valor||!r.unidad||!r.tipo_de_medida||!r.fuente||!r.url_doi) errors.push(r.claim_id+": required value empty");
 if(r.decision==="REQUIERE_CORRECCION"&&!r.correccion_propuesta) errors.push(r.claim_id+": correction missing");
}
const ids=new Set(claims.map(r=>r.claim_id)); if(ids.size!==claims.length) errors.push("duplicate claim_id");
if(claims.length!==168) errors.push("expected 168 claims, got "+claims.length);
if(pages.length!==49) errors.push("expected 49 pages, got "+pages.length);
if(changes.length!==6) errors.push("expected 6 changes, got "+changes.length);
const dc=claims.reduce((a,r)=>(a[r.decision]=(a[r.decision]||0)+1,a),{});
for(const [k,n] of Object.entries({VERIFICADO:144,VERIFICADO_SECUNDARIA_JUSTIFICADA:18,REQUIERE_CORRECCION:2,HISTORICO_CONSERVAR:4})) if((dc[k]||0)!==n) errors.push("decision count "+k);
const cc=claims.reduce((a,r)=>(a[r.comparability]=(a[r.comparability]||0)+1,a),{});
for(const [k,n] of Object.entries({DIRECTA:60,LIMITADA:50,NO_APLICA:45,NO_DIRECTA:13})) if((cc[k]||0)!==n) errors.push("comparability count "+k);
const sc=pages.reduce((a,r)=>(a[r.estado]=(a[r.estado]||0)+1,a),{});
for(const [k,n] of Object.entries({"VERIFICADA":43,"EN_REVISIÓN":5,"HISTÓRICA":1})) if((sc[k]||0)!==n) errors.push("page status count "+k);
for(const p of pages.filter(x=>x.estado==="VERIFICADA")){
 const bad=claims.filter(c=>c.page_id===p.page_id&&c.decision==="REQUIERE_CORRECCION");
 if(bad.length) errors.push(p.page_id+": VERIFIED with correction claim");
}
const derived=["autismo-en-la-poblacion-c03","autismo-en-ninos-y-jovenes-c04","autismo-identificado-en-ninos-de-8-anos-c01","diferencia-por-sexo-en-identificacion-de-autismo-c03"];
for(const id of derived){const r=claims.find(x=>x.claim_id===id);if(!r||!r.numerador||!r.denominador||!r.formula)errors.push(id+": derived formula incomplete");}
console.log(JSON.stringify({pass:errors.length===0,claims:claims.length,pages:pages.length,changes:changes.length,decision_counts:dc,comparability_counts:cc,page_statuses:sc,errors},null,2));
if(errors.length) process.exit(1);
