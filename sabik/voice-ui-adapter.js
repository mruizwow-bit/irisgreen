(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SabikVoiceUI=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';

  const LABELS={
    es:{legend:'Voz',available:'La voz solo se inicia cuando la activas.',unavailable:'Motor de voz no conectado en R1. S2 permanece cerrado.',enable:'Activar voz',volume:'Volumen',rate:'Velocidad',repeat:'Repetir'},
    en:{legend:'Voice',available:'Voice starts only when you turn it on.',unavailable:'Voice engine is not connected in R1. S2 remains closed.',enable:'Enable voice',volume:'Volume',rate:'Speed',repeat:'Repeat'}
  };
  const language=()=>root&&root.document&&String(root.document.documentElement.lang).toLowerCase().startsWith('en')?'en':'es';
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
    return {enabled:value.enabled===true,volume:clamp(value.volume??1,0,1),rate:clamp(value.rate??1,.75,1.5)};
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
    if(!container||!root||!root.document)return null;
    controller=controller||createController(new NullVoiceAdapter());
    const doc=container.ownerDocument||root.document;
    const wrap=doc.createElement('fieldset');
    wrap.className='sabik-voice-settings';
    wrap.id='sabik-voice-settings';

    const legend=doc.createElement('legend');
    wrap.appendChild(legend);

    const note=doc.createElement('p');
    note.id='sabik-voice-note';
    note.className='sabik-settings-note';
    wrap.appendChild(note);

    const onLabel=doc.createElement('label');
    onLabel.className='sabik-setting-row';
    const on=doc.createElement('input');
    on.type='checkbox';
    on.id='sabik-voice-enabled';
    on.setAttribute('aria-describedby','sabik-voice-note');
    const onText=doc.createElement('span');
    onLabel.append(on,onText);
    wrap.appendChild(onLabel);

    function range(id,min,max,step,value){
      const row=doc.createElement('label');
      row.className='sabik-setting-stack';
      row.htmlFor=id;
      const text=doc.createElement('span');
      const input=doc.createElement('input');
      input.type='range';
      input.id=id;
      input.min=String(min);
      input.max=String(max);
      input.step=String(step);
      input.value=String(value);
      input.setAttribute('aria-describedby','sabik-voice-note');
      row.append(text,input);
      wrap.appendChild(row);
      return {text,input};
    }
    const volume=range('sabik-voice-volume',0,1,.05,1);
    const rate=range('sabik-voice-rate',.75,1.5,.05,1);

    const repeat=doc.createElement('button');
    repeat.type='button';
    repeat.id='sabik-voice-repeat';
    repeat.className='sabik-button';
    repeat.setAttribute('aria-describedby','sabik-voice-note');
    wrap.appendChild(repeat);

    function syncLanguage(){
      const L=LABELS[language()];
      const available=controller.snapshot().capabilities.available;
      legend.textContent=L.legend;
      note.textContent=available?L.available:L.unavailable;
      onText.textContent=L.enable;
      volume.text.textContent=L.volume;
      rate.text.textContent=L.rate;
      repeat.textContent=L.repeat;
    }
    function sync(){
      const s=controller.snapshot();
      on.checked=s.prefs.enabled;
      on.disabled=!s.capabilities.available;
      volume.input.value=String(s.prefs.volume);
      rate.input.value=String(s.prefs.rate);
      const usable=s.capabilities.available&&s.prefs.enabled;
      volume.input.disabled=!usable;
      rate.input.disabled=!usable;
      repeat.disabled=!(usable&&s.capabilities.repeat);
      syncLanguage();
    }

    on.addEventListener('change',()=>{controller.setEnabled(on.checked);sync();});
    volume.input.addEventListener('input',()=>controller.setVolume(volume.input.value));
    rate.input.addEventListener('input',()=>controller.setRate(rate.input.value));
    repeat.addEventListener('click',()=>controller.repeat());

    const langObserver=new MutationObserver(records=>{
      if(records.some(r=>r.attributeName==='lang'))root.queueMicrotask(syncLanguage);
    });
    langObserver.observe(doc.documentElement,{attributes:true,attributeFilter:['lang']});

    sync();
    container.appendChild(wrap);
    return Object.freeze({element:wrap,controller,sync,syncLanguage});
  }

  return Object.freeze({NullVoiceAdapter,normalizePrefs,createController,mount});
});
