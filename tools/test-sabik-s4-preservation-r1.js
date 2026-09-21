const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const lock=JSON.parse(fs.readFileSync(path.join(root,'sabik','S4_PRESERVATION_LOCK_R1.json'),'utf8'));
function gitBlobSha(file){
  const bytes=fs.readFileSync(path.join(root,file));
  const head=Buffer.from('blob '+bytes.length+'\0');
  return crypto.createHash('sha1').update(head).update(bytes).digest('hex');
}
assert.equal(lock.base,'fc5cdfc2f978c85033de2b07c34309f8a4a7bd18');
for(const [file,expected] of Object.entries(lock.files))assert.equal(gitBlobSha(file),expected,file);
console.log('SABIK_S4_PRESERVATION_R1_PASS '+Object.keys(lock.files).length+' files');
