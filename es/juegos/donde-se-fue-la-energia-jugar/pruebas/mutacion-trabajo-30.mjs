#!/usr/bin/env node
import fs from 'fs';
import os from 'os';
import path from 'path';
import {spawnSync} from 'child_process';
import {fileURLToPath} from 'url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const srcHtml=path.join(dir,'..','index.html');
const html=fs.readFileSync(srcHtml,'utf8');
const mutated=html.replace('"id":"trabajo","value":-3','"id":"trabajo","value":-30');
if(mutated===html) throw new Error('No se encontró trabajo=-3 en game-data');

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'energia-mut-'));
const tempRoot=path.join(temp,'DONDE_SE_FUE_LA_ENERGIA_3D_R04');
const tempTests=path.join(tempRoot,'pruebas');
fs.mkdirSync(tempTests,{recursive:true});
fs.writeFileSync(path.join(tempRoot,'index.html'),mutated);
for(const name of ['banda.mjs','decision.mjs']) fs.copyFileSync(path.join(dir,name),path.join(tempTests,name));

function run(name){
  const r=spawnSync(process.execPath,[path.join(tempTests,name)],{encoding:'utf8'});
  console.log('--- '+name+' ---');
  process.stdout.write(r.stdout||'');
  process.stderr.write(r.stderr||'');
  console.log('exit',r.status);
  return r.status;
}
const bandaExit=run('banda.mjs');
const decisionExit=run('decision.mjs');
const pass=bandaExit===1 && decisionExit===1;
console.log('banda.mjs',bandaExit===1?'FALLA COMO DEBE':'NO FALLA');
console.log('decision.mjs',decisionExit===1?'FALLA COMO DEBE':'NO FALLA');
fs.rmSync(temp,{recursive:true,force:true});
process.exit(pass?0:1);
