import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDeployStore } from '@netlify/blobs';

const SITE_ID='47b06e68-ff54-4097-8ad8-336b2d71758a';
const STORE_NAME='sabik-r04-candidates';
const REGION='us-east-2';
const deployID=String(process.env.N04_DEPLOY_ID||'').trim();
const token=String(process.env.NETLIFY_AUTH_TOKEN||'').trim();
const candidate=String(process.env.R51_CANDIDATE_NAME||'').trim();
const rel=String(process.env.R51_CANDIDATE_FILE||'').trim();
const commit=String(process.env.GITHUB_SHA||'').trim();

if(!/^[a-f0-9]{24}$/.test(deployID)||!token) throw new Error('missing_private_deploy_context');
if(!/^[a-z0-9][a-z0-9-]{1,63}$/.test(candidate)) throw new Error('invalid_candidate_name');
if(!/^build\/r04\/[A-Za-z0-9._/-]+$/.test(rel)||rel.includes('..')) throw new Error('invalid_candidate_file');
if(!/^[a-f0-9]{40}$/.test(commit)) throw new Error('invalid_github_sha');

async function api(path){
  const res=await fetch('https://api.netlify.com/api/v1/'+path,{headers:{Authorization:'Bearer '+token}});
  if(!res.ok) throw new Error('netlify_api_'+res.status);
  return res.json();
}
const [site,deploy]=await Promise.all([api('sites/'+SITE_ID),api('deploys/'+deployID)]);
if(site.id!==SITE_ID||site.name!=='sabik-asistente'||site.sso_login!==true||site.sso_login_context!=='all'){
  throw new Error('protected_site_identity_mismatch');
}
if(deploy.site_id!==SITE_ID||deploy.state!=='ready'||deploy.context==='production'||deploy.published_at||site.published_deploy?.id===deployID){
  throw new Error('candidate_requires_private_nonproduction_deploy');
}

const root=fileURLToPath(new URL('../',import.meta.url));
const bytes=await readFile(new URL('../'+rel,import.meta.url));
const sha256=value=>createHash('sha256').update(value).digest('hex');
const expected=sha256(bytes);
const key='r51-r04-candidates/'+candidate+'/'+commit+'/'+basename(rel);
const store=getDeployStore({name:STORE_NAME,region:REGION,deployID,siteID:SITE_ID,token,consistency:'strong'});

const existing=await store.get(key,{type:'arrayBuffer'});
let write='created';
if(existing!==null){
  const got=sha256(new Uint8Array(existing));
  if(got!==expected) throw new Error('candidate_key_conflict');
  write='already-identical';
}else{
  await store.set(key,bytes);
}
const readback=await store.get(key,{type:'arrayBuffer'});
if(readback===null||sha256(new Uint8Array(readback))!==expected) throw new Error('candidate_readback_failed');

console.log(JSON.stringify({
  status:'PASS',
  store:STORE_NAME,
  deploy_id:deployID,
  deploy_context:deploy.context,
  candidate,
  key,
  sha256:expected,
  bytes:bytes.byteLength,
  write,
  readback:'verified',
  production_changed:false
},null,2));
