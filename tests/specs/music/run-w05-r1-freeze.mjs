import fs from 'node:fs';
import vm from 'node:vm';
import cp from 'node:child_process';

const args=process.argv.slice(2);
const dist=args.includes('--dist');
const outArg=args.find(a=>a.startsWith('--out='));
const out=outArg?outArg.slice(6):null;
const fixture=JSON.parse(fs.readFileSync('tests/specs/music/w05-r1-fixture-v1.json','utf8'));
const contract=JSON.parse(fs.readFileSync('tests/specs/music/w05-r1-contract-v1.json','utf8'));
const src=fs.readFileSync('assets/musica.js','utf8');
const sh=(c)=>cp.execSync(c,{encoding:'utf8'}).trim();

function assert(c,m){if(!c) throw new Error(m);}
assert(sh('git merge-base --is-ancestor '+fixture.baseline_sha+' HEAD; echo $?')==='0','baseline is not ancestor');
const changed=sh('git diff --name-only '+fixture.baseline_sha+'...HEAD').split(/\r?\n/).filter(Boolean);
const allowed=p=>p.startsWith('tests/specs/music/')||p.startsWith('docs/qa/W05_R1_')||p==='.github/workflows/w05-r1-qa-freeze.yml';
assert(changed.every(allowed),'product/runtime path changed: '+changed.filter(p=>!allowed).join(', '));

const start=src.indexOf('var ALL_TRACKS =');
const end=src.indexOf('var TEXT =',start);
assert(start>=0&&end>start,'cannot locate current TRACKS block');
const snippet=src.slice(start,end)+'\nglobalThis.__RESULT=TRACKS;';
function observed(probeValue){
  const ctx={document:{createElement:()=>({canPlayType:()=>probeValue})}};
  vm.runInNewContext(snippet,ctx);
  return ctx.__RESULT.map(t=>t.f);
}
const scenarios={empty:observed(''),maybe:observed('maybe'),probably:observed('probably')};
assert(scenarios.empty.length===15,'empty probe baseline drift');
assert(scenarios.maybe.length===24,'maybe probe baseline drift');
assert(scenarios.probably.length===24,'probably probe baseline drift');

const parsed=[...src.matchAll(/\{\s*f:'([^']+)',t:'([^']+)',a:'([^']+)'\s*\}/g)].map(m=>({file:m[1],title:m[2],author:m[3]}));
assert(parsed.length===24,'logical catalog not 24 in source');
assert(parsed.filter(x=>x.file.endsWith('.m4a')).length===9,'M4A count drift');
assert(parsed.filter(x=>x.file.endsWith('.mp3')).length===15,'MP3 count drift');

for(const t of fixture.tracks){
  assert(fs.existsSync(t.path),'missing source '+t.path);
  assert(Number(fs.statSync(t.path).size)===t.size_bytes,'size drift '+t.path);
  assert(sh('git rev-parse '+fixture.baseline_sha+':'+t.path)===t.git_blob_sha1,'baseline blob drift '+t.path);
  assert(sh('git hash-object '+t.path)===t.git_blob_sha1,'HEAD original changed '+t.path);
  if(dist){
    const dp='dist/'+t.path;
    assert(fs.existsSync(dp),'missing dist '+dp);
    assert(sh('git hash-object '+dp)===t.git_blob_sha1,'dist differs from original '+t.path);
  }
}
assert(src.includes("audio.preload='none'"),'preload none missing');
assert(!/autoplay\s*=\s*true/.test(src),'autoplay enabled');
assert(src.includes("new URL('/audio/'+TRACKS[selected].f,location.origin)"),'local same-origin playback contract drift');

const repair=fs.readFileSync('scripts/repair_routes.py','utf8');
const build=fs.readFileSync('scripts/build_site.py','utf8');
assert(/PUBLIC_DIRS=.*['"]audio['"]/.test(repair),'audio not in PUBLIC_DIRS');
assert(!/ffmpeg|transcod/i.test(repair+'\n'+build),'silent conversion tool detected in build scripts');

const report={
 schema:'W05-R1-BASELINE-RUN/1.0',
 baseline_sha:fixture.baseline_sha,
 qa_head:sh('git rev-parse HEAD'),
 phase:dist?'dist':'source',
 zero_product_files:true,
 changed_paths:changed,
 scenarios:{
  probe_empty:{observed:15,target:24,result:'EXPECTED_BASELINE_FAIL'},
  probe_maybe:{observed:24,target:24,result:'EXPECTED_BASELINE_PASS'},
  probe_probably:{observed:24,target:24,result:'EXPECTED_BASELINE_PASS'}
 },
 originals:{count:24,m4a:9,mp3:15,hash_identity:'PASS',dist_identity:dist?'PASS':'NOT_RUN'},
 stop_control:{baseline:'NO_EXPLICIT_CONTROL',target:'STOP_OR_APPROVED_EQUIVALENT',result:'EXPECTED_BASELINE_FAIL'},
 provenance:fixture.provenance_summary,
 derivative_policy:fixture.derivative_policy,
 freeze_contract_cases:contract.cases.length
};
console.log(JSON.stringify(report,null,2));
if(out) fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log('W05_R1_BASELINE_REPRODUCED');
