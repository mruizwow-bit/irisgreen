#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL } from "node:url";

const target = process.argv[2];
if (!target) throw new Error("usage: node introspect-executor-interface.mjs <module>");
const mod = await import(pathToFileURL(path.resolve(target)).href);
const exports = Object.fromEntries(
  Object.entries(mod)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([k,v]) => [k, typeof v])
);
console.log(JSON.stringify({exports}, null, 2));
