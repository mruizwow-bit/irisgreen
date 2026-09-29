import { mkdir, writeFile } from 'node:fs/promises';

const sha=String(process.env.GITHUB_SHA||'').trim();
if(!/^[a-f0-9]{40}$/.test(sha)) throw new Error('invalid_github_sha');
const binding={
  schema:'R51_A9_R04_CANDIDATE_BINDING/1.0',
  github_sha:sha,
  store:'sabik-r04-candidates',
  partial_corpus_key:'r51-r04-candidates/r04-partial-corpus/'+sha+'/r04-partial-corpus.json',
  manifest_key:'r51-r04-candidates/r04-manifest/'+sha+'/r04-candidate-manifest.json',
  production_activation:false
};
const out=new URL('../build/r04/',import.meta.url);
await mkdir(out,{recursive:true});
await writeFile(new URL('r04-candidate-binding.json',out),JSON.stringify(binding,null,2)+'\n');
console.log(JSON.stringify(binding,null,2));
