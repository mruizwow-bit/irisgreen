#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL } from "node:url";
const mod = await import(pathToFileURL(path.resolve(process.argv[2])).href);
const probe = {
  id: "I0-PROBE-NONCAL-0001",
  dataset_role: "probe",
  locale: "es",
  utterance: "Busca contenido general sobre descanso.",
  text: "Busca contenido general sobre descanso.",
  context: {},
  tags: []
};
const out = await mod.predictI0V3(probe);
const shape = value => {
  if (Array.isArray(value)) return {type:"array", length:value.length, item_type:value.length ? typeof value[0] : null, item_keys:value.length && value[0] && typeof value[0]==="object" ? Object.keys(value[0]).sort() : []};
  if (value && typeof value === "object") return {type:"object", keys:Object.keys(value).sort()};
  return {type:typeof value};
};
console.log(JSON.stringify({output_type:typeof out, output_keys:out && typeof out==="object" ? Object.keys(out).sort() : [], fields: out && typeof out==="object" ? Object.fromEntries(Object.entries(out).map(([k,v])=>[k,shape(v)])) : {}}, null, 2));
