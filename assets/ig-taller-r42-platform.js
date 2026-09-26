/* Iris Green · R42 Taller · progressive Web Platform layer.
   All capabilities are optional. No network transport, analytics or remote storage. */
(function(root,factory){
  var api=factory(root);
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.IGTallerR42Platform=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';
  var D=root.document, worker=null, seq=0, pending=new Map(), lockFallback=new Map(), channel=null, audioEngine=null;

  function reducedMotion(){
    try{return !!(root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){return false;}
  }
  function capabilities(){
    var css=root.CSS&&root.CSS.supports;
    return {
      worker:typeof root.Worker==='function',
      offscreen:typeof root.OffscreenCanvas==='function',
      indexedDB:!!root.indexedDB,
      opfs:!!(root.navigator&&root.navigator.storage&&root.navigator.storage.getDirectory),
      fileSystemAccess:typeof root.showOpenFilePicker==='function'||typeof root.showSaveFilePicker==='function',
      locks:!!(root.navigator&&root.navigator.locks&&root.navigator.locks.request),
      broadcast:typeof root.BroadcastChannel==='function',
      audioWorklet:!!(root.AudioWorkletNode&&(root.AudioContext||root.webkitAudioContext)),
      webgl2:(function(){try{var c=D&&D.createElement('canvas');return !!(c&&c.getContext('webgl2'));}catch(e){return false;}})(),
      webgpu:!!(root.navigator&&root.navigator.gpu),
      viewTransitions:!!(D&&D.startViewTransition),
      popover:!!(root.HTMLElement&&root.HTMLElement.prototype&&('popover' in root.HTMLElement.prototype)),
      anchorPositioning:!!(css&&css.call(root.CSS,'position-anchor','--ig-anchor'))
    };
  }

  function ensureWorker(){
    if(worker||!capabilities().worker) return worker;
    try{
      worker=new root.Worker('/assets/workers/ig-taller-r42-worker.js?v=r42-a5-2');
      worker.onmessage=function(e){
        var m=e.data||{},p=pending.get(m.id);if(!p)return;pending.delete(m.id);
        if(m.error)p.reject(new Error(m.error));else p.resolve(m.bitmap!==undefined?m.bitmap:m.result);
      };
      worker.onerror=function(){pending.forEach(function(p){p.reject(new Error('WORKER_FAILED'));});pending.clear();try{worker.terminate();}catch(e){}worker=null;};
    }catch(e){worker=null;}
    return worker;
  }
  function task(type,payload){
    var w=ensureWorker();if(!w)return Promise.reject(new Error('WORKER_UNAVAILABLE'));
    return new Promise(function(resolve,reject){
      var id='ig42-'+(++seq);pending.set(id,{resolve:resolve,reject:reject});
      try{w.postMessage({id:id,type:type,payload:payload});}catch(e){pending.delete(id);reject(e);}
    });
  }
  function lifeStepLocal(cells,w,h){
    var out=new Array(cells.length).fill(false);
    for(var y=0;y<h;y++)for(var x=0;x<w;x++){var n=0;for(var yy=-1;yy<=1;yy++)for(var xx=-1;xx<=1;xx++)if((xx||yy)&&cells[((y+yy+h)%h)*w+((x+xx+w)%w)])n++;var live=!!cells[y*w+x];out[y*w+x]=live?(n===2||n===3):n===3;}
    return out;
  }
  async function lifeStep(cells,w,h,steps){
    steps=Math.max(1,Math.min(256,Number(steps)||1));
    if(capabilities().worker){try{return await task('life-step',{cells:cells,w:w,h:h,steps:steps});}catch(e){}}
    var c=Array.from(cells,Boolean);for(var i=0;i<steps;i++)c=lifeStepLocal(c,w,h);return c;
  }
  async function renderPreview(canvas,family,seed){
    if(!canvas)return false;
    var x=canvas.getContext&&canvas.getContext('2d');if(!x)return false;
    if(capabilities().worker&&capabilities().offscreen){
      try{
        var b=await task('preview',{width:canvas.width,height:canvas.height,family:family,seed:seed});
        if(b){x.clearRect(0,0,canvas.width,canvas.height);x.drawImage(b,0,0);if(b.close)b.close();return true;}
      }catch(e){}
    }
    return false;
  }

  function cleanKey(key){return String(key||'').replace(/[^A-Za-z0-9._-]/g,'_').slice(0,180);}
  async function opfsRoot(){if(!capabilities().opfs)throw new Error('OPFS_UNAVAILABLE');return root.navigator.storage.getDirectory();}
  var opfs={
    async put(key,blob){var dir=await opfsRoot(),h=await dir.getFileHandle(cleanKey(key),{create:true}),w=await h.createWritable();await w.write(blob);await w.close();return true;},
    async get(key){var dir=await opfsRoot();try{var h=await dir.getFileHandle(cleanKey(key));return await h.getFile();}catch(e){if(e&&e.name==='NotFoundError')return null;throw e;}},
    async remove(key){var dir=await opfsRoot();try{await dir.removeEntry(cleanKey(key));return true;}catch(e){if(e&&e.name==='NotFoundError')return false;throw e;}}
  };

  async function withLock(name,fn){
    name='irisgreen:r42:'+cleanKey(name);
    if(capabilities().locks)return root.navigator.locks.request(name,{mode:'exclusive'},fn);
    var prev=lockFallback.get(name)||Promise.resolve(),release;var next=new Promise(function(r){release=r;});lockFallback.set(name,prev.then(function(){return next;}));
    await prev;try{return await fn();}finally{release();if(lockFallback.get(name)===next)lockFallback.delete(name);}
  }
  function ensureChannel(){
    if(channel||!capabilities().broadcast)return channel;
    try{channel=new root.BroadcastChannel('irisgreen:r42:workshop');}catch(e){channel=null;}return channel;
  }
  function publish(type,detail){var c=ensureChannel();if(c)try{c.postMessage({type:type,detail:detail||null});}catch(e){}}
  function subscribe(fn){var c=ensureChannel();if(!c)return function(){};var h=function(e){fn(e.data||{});};c.addEventListener('message',h);return function(){c.removeEventListener('message',h);};}

  function transition(update){
    if(!D||reducedMotion()||typeof D.startViewTransition!=='function'){update();return null;}
    try{return D.startViewTransition(update);}catch(e){update();return null;}
  }

  async function ensureAudio(){
    if(audioEngine)return audioEngine;
    var C=root.AudioContext||root.webkitAudioContext;if(!C)throw new Error('AUDIO_UNAVAILABLE');
    var ac=new C();
    if(capabilities().audioWorklet&&ac.audioWorklet){
      try{
        var src="class IGTone extends AudioWorkletProcessor{constructor(){super();this.tones=[];this.port.onmessage=e=>{let m=e.data||{},sr=sampleRate,d=Math.max(.03,Math.min(4,+m.duration||.2));this.tones.push({p:0,f:Math.max(20,Math.min(12000,+m.freq||220)),w:m.wave||'sine',n:0,N:Math.floor(d*sr)});};}process(i,o){let ch=o[0][0];if(!ch)return true;for(let s=0;s<ch.length;s++){let v=0;for(let t of this.tones){if(t.n>=t.N)continue;let q=t.p%(Math.PI*2),z=t.w==='square'?(q<Math.PI?1:-1):t.w==='sawtooth'?(q/Math.PI-1):t.w==='triangle'?(2/Math.PI*Math.asin(Math.sin(q))):Math.sin(q),e=Math.min(1,t.n/(sampleRate*.015))*Math.min(1,(t.N-t.n)/(sampleRate*.04));v+=z*e*.11;t.p+=Math.PI*2*t.f/sampleRate;t.n++;}ch[s]=Math.max(-.8,Math.min(.8,v));}this.tones=this.tones.filter(t=>t.n<t.N);return true;}}registerProcessor('ig-r42-tone',IGTone);";
        var url=URL.createObjectURL(new Blob([src],{type:'text/javascript'}));await ac.audioWorklet.addModule(url);URL.revokeObjectURL(url);
        var node=new root.AudioWorkletNode(ac,'ig-r42-tone');node.connect(ac.destination);
        audioEngine={context:ac,worklet:true,tone:async function(freq,duration,wave){if(ac.state==='suspended')await ac.resume();node.port.postMessage({freq:freq,duration:duration,wave:wave});}};
        return audioEngine;
      }catch(e){}
    }
    audioEngine={context:ac,worklet:false,tone:async function(freq,duration,wave,filter){if(ac.state==='suspended')await ac.resume();var o=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();o.type=wave||'sine';o.frequency.value=freq||220;f.type='lowpass';f.frequency.value=filter||1800;var now=ac.currentTime;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.12,now+.02);g.gain.exponentialRampToValueAtTime(.0001,now+Math.max(.05,duration||.2));o.connect(f);f.connect(g);g.connect(ac.destination);o.start(now);o.stop(now+Math.max(.08,duration||.2)+.04);}};
    return audioEngine;
  }
  async function tone(freq,duration,wave,filter){var a=await ensureAudio();return a.tone(freq,duration,wave,filter);}

  function capabilityText(locale){
    var c=capabilities(),en=locale==='en';
    var labels=[];
    if(c.worker&&c.offscreen)labels.push(en?'worker graphics':'gráficos en worker');
    if(c.audioWorklet)labels.push('AudioWorklet');
    if(c.opfs)labels.push('OPFS');
    if(c.webgl2)labels.push('WebGL2');
    if(c.webgpu)labels.push(en?'optional WebGPU':'WebGPU opcional');
    return labels.join(' · ');
  }

  return {capabilities:capabilities,lifeStep:lifeStep,renderPreview:renderPreview,opfs:opfs,withLock:withLock,publish:publish,subscribe:subscribe,transition:transition,tone:tone,reducedMotion:reducedMotion,capabilityText:capabilityText};
});
