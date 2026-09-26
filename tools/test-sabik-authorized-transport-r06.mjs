import test from 'node:test';
import assert from 'node:assert/strict';
import { MessageChannel } from 'node:worker_threads';
import { readFile } from 'node:fs/promises';
import { createAuthorizedTransport } from '../sabik/authorized-transport.mjs';

const cloudOrigin="https://6ab7a2cd2cf8dc09d3ae9aca--sabik-asistente.netlify.app";

function events(){
  const map=new Map();
  return {
    addEventListener(type,fn){ if(!map.has(type)) map.set(type,new Set()); map.get(type).add(fn); },
    removeEventListener(type,fn){ map.get(type)?.delete(fn); },
    dispatch(type,event){ for(const fn of map.get(type)??[]) fn(event); }
  };
}

function makeHost(){
  const host={...events(),crypto:globalThis.crypto,MessageChannel};
  let appended=0,removed=0;
  const peer={
    postMessage(data,target,ports){
      assert.equal(target,cloudOrigin);
      const remote=ports[0];
      queueMicrotask(()=>remote.postMessage({type:'sabik:connected',nonce:data.nonce}));
    }
  };
  host.open=()=>{ throw new Error('popup transport must not be used'); };
  host.document={
    body:{appendChild(frame){
      appended++; frame.isConnected=true;
      assert.equal(frame.hidden,true);
      assert.equal(frame.tabIndex,-1);
      assert.equal(frame.src,cloudOrigin+'/sabik-connect?lang=es&embedded=1');
      queueMicrotask(()=>host.dispatch('message',{origin:cloudOrigin,source:peer,data:{type:'sabik:ready',version:1}}));
    }},
    createElement(tag){
      assert.equal(tag,'iframe');
      const e=events();
      return Object.assign(e,{hidden:false,tabIndex:0,isConnected:false,src:'',contentWindow:peer,
        setAttribute(){},remove(){removed++;this.isConnected=false;}});
    }
  };
  return {host,get appended(){return appended;},get removed(){return removed;}};
}

test('R06 uses a hidden iframe and MessageChannel instead of a popup',async()=>{
  const p=makeHost();
  const transport=createAuthorizedTransport({cloudOrigin,window:p.host,connectionTimeoutMs:500,requestTimeoutMs:500});
  await transport.connect('es');
  assert.equal(p.appended,1);
  transport.disconnect();
  assert.equal(p.removed,1);
});

test('mount config and CSP point to the exact R06 Cloud deploy',async()=>{
  const mount=await readFile(new URL('../sabik/mount-config.mjs',import.meta.url),'utf8');
  const headers=await readFile(new URL('../_headers',import.meta.url),'utf8');
  assert.ok(mount.includes("cloudOrigin:'"+cloudOrigin+"'"));
  const csp=headers.split('\n').find(line=>line.includes('Content-Security-Policy:'));
  assert.ok(csp && csp.includes('frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.instagram.com '+cloudOrigin+';'));
});

test('production and foreign Cloud origins remain rejected',()=>{
  for(const bad of ['https://sabik-asistente.netlify.app','https://attacker.invalid',cloudOrigin+'/',cloudOrigin+'@attacker.invalid']){
    assert.throws(()=>createAuthorizedTransport({cloudOrigin:bad,window:{}}),TypeError);
  }
});
