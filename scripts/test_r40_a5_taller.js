#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const catalog=require('../assets/data/taller-r40-catalog.js');
const local=require('../assets/ig-taller-local-data.js');
const tools=require('../assets/ig-taller-r40-tools.js');

(async()=>{
  assert.equal(catalog.length,25);
  assert.equal(new Set(catalog.map(x=>x.id)).size,25);
  assert.equal(catalog.filter(x=>x.current).length,8);
  assert.equal(catalog.filter(x=>!x.current).length,17);
  assert.equal(new Set(catalog.map(x=>x.area.es)).size,6);
  for(const s of catalog){assert.ok(s.title.es&&s.title.en&&s.slugs.es&&s.slugs.en);assert.ok(s.current||tools.TOOL_KINDS.includes(s.kind));}
  assert.equal(tools.TOOL_KINDS.length,17);
  assert.equal(tools.contrastRatio('#000000','#ffffff').toFixed(2),'21.00');
  const blinker=[false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
  const next=tools.lifeStep(blinker,5,5); assert.equal(next.filter(Boolean).length,3);

  const b=new local.MemoryBackend(),svc=local.createService(b);
  assert.equal((await svc.capabilities()).persistent,false);
  const ref={namespace:'workshop',id:'workshop-03'};
  await svc.addCollection(ref);await svc.addCollection(ref);assert.equal((await svc.listCollection()).length,1);
  await svc.setProgressEnabled(false);assert.equal((await svc.saveProgress({target:ref,markers:['c1']})).saved,false);
  await svc.setProgressEnabled(true);assert.equal((await svc.saveProgress({target:ref,markers:['c1']})).saved,true);
  let p=await svc.saveProject({project_id:'project-0001',project_type:'workshop-03',project_schema_version:1,revision:1,title:'Test',payload:{a:1}});
  assert.equal(p.revision,1);
  await assert.rejects(()=>svc.saveProject({...p,payload:{a:2}},99),e=>e.code==='PROJECT_REVISION_CONFLICT');
  p=await svc.saveProject({...p,payload:{a:2}},1);assert.equal(p.revision,2);
  const ex=await svc.exportProject(p.project_id);const imported=svc.validateImportText(ex.text,'workshop-03');assert.equal(imported.payload.a,2);
  const copy=await svc.commitImport(imported);assert.notEqual(copy.project_id,p.project_id);
  assert.throws(()=>svc.validateImportText('{"kind":"irisgreen-r40-project-export","contract_version":"1.0","schema_version":1,"project":{"project_id":"project-0002","project_type":"workshop-03","project_schema_version":1,"revision":1,"payload":{"__proto__":{"x":1}}}}'),e=>e.code==='IMPORT_DANGEROUS_KEY'||e.code==='IMPORT_INVALID_SCHEMA');

  const localText=fs.readFileSync(path.join(__dirname,'../assets/ig-taller-local-data.js'),'utf8');
  assert.doesNotMatch(localText,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/);
  console.log(JSON.stringify({status:'PASS',catalog:25,current:8,new_studies:17,local_data:'PASS',network_calls:0}));
})().catch(e=>{console.error(e);process.exit(1);});
