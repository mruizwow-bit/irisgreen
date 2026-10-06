import {getStore} from '@netlify/blobs';
import {createLibraryHandler,loadVerifiedCorpus} from '../lib/library-engine.mjs';
import binding from '../../sabik/library-binding.json' with {type:'json'};

let pending: Promise<any> | null = null;
async function load(){
  if(!pending) pending=(async()=>{
    const store=getStore({name:'sabik-reviewed-library',consistency:'strong'});
    const bytes=await store.get(binding.key,{type:'arrayBuffer'});
    if(!bytes)throw new Error('unavailable');
    return loadVerifiedCorpus(new Uint8Array(bytes),binding);
  })().catch(error=>{pending=null;throw error;});
  return pending;
}
export default createLibraryHandler({load,binding});
export const config={path:'/sabik-library/search'};
