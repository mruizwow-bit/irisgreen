import { mkdir,writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

const gate=JSON.parse(readFileSync(new URL('../sources/r51-r04/home/SOURCE_GATE.json',import.meta.url),'utf8'));
if(gate?.schema!=='R51_A9_HOME_SOURCE_GATE/1.0') throw new Error('invalid_home_source_gate');
if(gate.observed_a2.status!=='HUMAN_QA_FAIL_HOME_NOT_CANONICAL') throw new Error('unexpected_home_source_status');
if(gate.stale_home_entities_allowed!==0||gate.candidate_active!==false) throw new Error('home_gate_must_fail_closed');

const report={
  schema:'R51_A9_HOME_HOLD_REPORT/1.0',
  observed_a2_head:gate.observed_a2.head,
  observed_index_blob:gate.observed_a2.index_blob_sha1,
  status:'HOLD_CANONICAL_HOME_V4_REQUIRED',
  entities:0,
  active_entities:0,
  indexed_stale_home:false,
  required_donor:gate.authority.required_donor,
  required_donor_sha256:gate.authority.required_donor_sha256,
  required_marker:gate.authority.required_marker,
  unblock_when:gate.unblock_when
};
const out=new URL('../build/r04/',import.meta.url);
await mkdir(out,{recursive:true});
await writeFile(new URL('home-source-hold-report.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
