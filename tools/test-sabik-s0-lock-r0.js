const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const lock=JSON.parse(fs.readFileSync(path.join(root,'sabik','S0_SEMANTIC_LOCK_R0.json'),'utf8'));
function gitBlobSha(file){
  const bytes=fs.readFileSync(path.join(root,file));
  const head=Buffer.from('blob '+bytes.length+'\0');
  return crypto.createHash('sha1').update(head).update(bytes).digest('hex');
}
assert.equal(lock.result,'IDENTICAL_BLOBS');
for(const [file,expected] of Object.entries(lock.files)){
  assert.equal(gitBlobSha(file),expected,file);
}
console.log('SABIK_S0_SEMANTIC_LOCK_R0_PASS '+Object.keys(lock.files).length+' files');
