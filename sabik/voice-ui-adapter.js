(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SabikVoiceUI=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  function clamp(n,min,max){n=Number(n);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):min;}
  class NullVoiceAdapter {
    constructor(){this.id='none';this.available=false;}
    capabilities(){return {available:false,volume:false,rate:false,repeat:false,remote:false};}
    start(){return Promise.resolve({ok:false,reason:'S2_CLOSED'});}
    stop(){return Promise.resolve({ok:true});}
    repeat(){return Promise.resolve({ok:false,reason:'S2_CLOSED'});}
  }

  function normalizePrefs(value){
    value=value&&typeof value==='object'?value:{};
    return {
      enabled:value.enabled===true,
      volume:clamp(value.volume??1,0,1),
      rate:clamp(value.rate??1,.75,1.5)
    };
  }

  function createController(adapter){
    adapter=adapter||new NullVoiceAdapter();
    let prefs=normalizePrefs();
    const caps=()=>Object.assign({available:false,volume:false,rate:false,repeat:false,remote:false},typeof adapter.capabilities==='function'?adapter.capabilities():{});
    function snapshot(){return Object.freeze({prefs:Object.assign({},prefs),capabilities:caps(),state:prefs.enabled?'enabled':'disabled'});}
    function setEnabled(on){prefs.enabled=on===true&&caps().available;return snapshot();}
    function setVolume(value){prefs.volume=clamp(value,0,1);return snapshot();}
    function setRate(value){prefs.rate=clamp(value,.75,1.5);return snapshot();}
    async function repeat(){
      if(!prefs.enabled||!caps().available||!caps().repeat)return {ok:false,reason:'UNAVAILABLE'};
      return adapter.repeat({volume:prefs.volume,rate:prefs.rate});
    }
    return Object.freeze({snapshot,setEnabled,setVolume,setRate,repeat,adapter});
  }

  function mount(container,controller){
    if(!container||typeof document==='undefined')return null;
    controller=controller||createController(new NullVoiceAdapter());
    const wrap=document.createElement('fieldset');
    wrap.className='sabik-voice-settings';
    wrap.id='sabik-voice-settings';
    const legend=document.createElement('legend');legend.textContent='Voz';wrap.appendChild(legend);

    const available=controller.snapshot().capabilities.available;
    const note=document.createElement('p');note.id='sabik-voice-note';note.className='sabik-settings-note';
    note.textContent=available?'La voz solo se inicia cuando la activas.':'Motor de voz no conectado en R0. S2 permanece cerrado.';
    wrap.appendChild(note);

    const onLabel=document.createElement('label');onLabel.className='sabik-setting-row';
    const on=document.createElement('input');on.type='checkbox';on.id='sabik-voice-enabled';on.disabled=!available;on.setAttribute('aria-describedby','sabik-voice-note');
    const onText=document.createElement('span');onText.textContent='Activar voz';
    onLabel.append(on,onText);wrap.appendChild(onLabel);

    function range(id,label,min,max,step,value){
      const row=document.createElement('label');row.className='sabik-setting-stack';row.htmlFor=id;
      const text=document.createElement('span');text.textContent=label;
      const input=document.createElement('input');input.type='range';input.id=id;input.min=String(min);input.max=String(max);input.step=String(step);input.value=String(value);input.disabled=!available;
      input.setAttribute('aria-describedby','sabik-voice-note');
      row.append(text,input);wrap.appendChild(row);return input;
    }
    const volume=range('sabik-voice-volume','Volumen',0,1,.05,1);
    const rate=range('sabik-voice-rate','Velocidad',.75,1.5,.05,1);
    const repeat=document.createElement('button');repeat.type='button';repeat.id='sabik-voice-repeat';repeat.className='sabik-button';repeat.textContent='Repetir';repeat.disabled=!available;repeat.setAttribute('aria-describedby','sabik-voice-note');wrap.appendChild(repeat);

    on.addEventListener('change',()=>{controller.setEnabled(on.checked);sync();});
    volume.addEventListener('input',()=>controller.setVolume(volume.value));
    rate.addEventListener('input',()=>controller.setRate(rate.value));
    repeat.addEventListener('click',()=>controller.repeat());

    function sync(){
      const s=controller.snapshot();on.checked=s.prefs.enabled;
      volume.value=String(s.prefs.volume);rate.value=String(s.prefs.rate);
      const usable=s.capabilities.available&&s.prefs.enabled;
      volume.disabled=!usable;rate.disabled=!usable;repeat.disabled=!(usable&&s.capabilities.repeat);
    }
    sync();container.appendChild(wrap);
    return Object.freeze({element:wrap,controller,sync});
  }

  return Object.freeze({NullVoiceAdapter,normalizePrefs,createController,mount});
});
