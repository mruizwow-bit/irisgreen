#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL } from "node:url";
const mod = await import(pathToFileURL(path.resolve(process.argv[2])).href);
console.log(JSON.stringify({
  predict_arity: mod.predictI0V3?.length ?? null,
  default_config_keys: mod.DEFAULT_EXECUTOR_V3_CONFIG && typeof mod.DEFAULT_EXECUTOR_V3_CONFIG === "object"
    ? Object.keys(mod.DEFAULT_EXECUTOR_V3_CONFIG).sort()
    : []
}, null, 2));
