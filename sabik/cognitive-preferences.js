(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SabikCognitivePreferences=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';
  const KEY='sabik-presentation-r1';
  const MOTION=['NORMAL','REDUCIDO','SIN_MOVIMIENTO'];
  const DENSITY=['completa','reducida','paso_a_paso'];
  const LABELS={
    es:{
      summary:'Ajustes de Sabik',
      note:'Tamaño de texto, espaciado, ancho de lectura, contraste y reducción global de movimiento se controlan desde Lectura.',
      motion:'Movimiento en Sabik',
      motionOptions:{NORMAL:'Normal',REDUCIDO:'Reducido',SIN_MOVIMIENTO:'Sin movimiento'},
      density:'Densidad de información',
      densityOptions:{completa:'Completa',reducida:'Reducida',paso_a_paso:'Paso a paso'},
      motionChanged:'Preferencia de movimiento de Sabik actualizada.',
      densityChanged:'Densidad de información de Sabik actualizada.'
    },
    en:{
      summary:'Sabik settings',
      note:'Text size, spacing, reading width, contrast and global reduced motion are controlled from Reading.',
      motion:'Motion in Sabik',
      motionOptions:{NORMAL:'Normal',REDUCIDO:'Reduced',SIN_MOVIMIENTO:'No motion'},
      density:'Information density',
      densityOptions:{completa:'Full',reducida:'Reduced',paso_a_paso:'Step by step'},
      motionChanged:'Sabik motion preference updated.',
      densityChanged:'Sabik information density updated.'
    }
  };
  let state={motion:'NORMAL',density:'completa'};
  let mounted=null;
  let languageSync=null;

  function validObject(v){return v&&typeof v==='object'&&!Array.isArray(v);}
  function normalize(v){
    v=validObject(v)?v:{};
    return {motion:MOTION.includes(v.motion)?v.motion:'NORMAL',density:DENSITY.includes(v.density)?v.density:'completa'};
  }
  function lang(){
    return root&&root.document&&String(root.document.documentElement.lang).toLowerCase().startsWith('en')?'en':'es';
  }
  function load(){
    if(!root||!root.localStorage)return normalize();
    try{return normalize(JSON.parse(root.localStorage.getItem(KEY)||'null'));}catch(_){return normalize();}
  }
  function persist(){if(!root||!root.localStorage)return;try{root.localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}}
  function globalSnapshot(){
    const P=root&&root.IGPreferences;
    const get=P&&typeof P.get==='function'?P.get():{};
    const sys=P&&typeof P.system==='function'?P.system():{};
    const text=P&&typeof P.getText==='function'?P.getText():{};
    return {scale:get.scale||1,spacing:get.spacing===true,contrast:get.contrast===true,globalMotion:get.motion===true,systemReduced:sys.reducedMotion===true,text};
  }
  function deviceSnapshot(){
    const nav=root&&root.navigator||{};
    return {hardwareConcurrency:nav.hardwareConcurrency||0,deviceMemory:nav.deviceMemory||0,saveData:Boolean(nav.connection&&nav.connection.saveData)};
  }
  function effectiveMotion(){
    const g=globalSnapshot(),mod=root&&root.SabikB3Motion&&root.SabikB3Motion.modestDevice(deviceSnapshot());
    if(state.motion==='SIN_MOVIMIENTO')return 'SIN_MOVIMIENTO';
    if(state.motion==='REDUCIDO')return 'REDUCIDO';
    if(g.globalMotion||g.systemReduced||mod)return 'REDUCIDO';
    return 'NORMAL';
  }
  function snapshot(){return Object.freeze({local:Object.assign({},state),global:globalSnapshot(),effectiveMotion:effectiveMotion()});}
  function apply(){
    if(!root||!root.document)return snapshot();
    const panel=root.document.querySelector('.sabik-panel');
    if(panel){
      panel.dataset.sabikMotion=effectiveMotion();
      panel.dataset.sabikDensity=state.density;
      const low=root.document.querySelector('#sabik-hologram')?.dataset.lowIntensity==='true';
      panel.dataset.sabikVisualIntensity=low?'reducida':'normal';
    }
    root.document.dispatchEvent(new CustomEvent('sabik:preferences-changed',{detail:snapshot()}));
    return snapshot();
  }
  function update(patch){
    const next=Object.assign({},state);
    if(patch&&MOTION.includes(patch.motion))next.motion=patch.motion;
    if(patch&&DENSITY.includes(patch.density))next.density=patch.density;
    state=normalize(next);persist();return apply();
  }
  function announce(message){
    const region=root&&root.document&&root.document.querySelector('#sabik-announcement');
    if(region)region.replaceChildren(root.document.createTextNode(message));
  }
  function mount(){
    if(!root||!root.document||mounted)return mounted;
    state=load();
    const form=root.document.querySelector('#sabik-form');
    if(!form)return null;

    const details=root.document.createElement('details');
    details.className='sabik-cognitive-settings';
    details.id='sabik-cognitive-settings';

    const summary=root.document.createElement('summary');
    details.appendChild(summary);

    const note=root.document.createElement('p');
    note.className='sabik-settings-note';
    note.id='sabik-settings-global-note';
    details.appendChild(note);

    function selectRow(id,options,value){
      const row=root.document.createElement('label');
      row.className='sabik-setting-stack';
      row.htmlFor=id;
      const span=root.document.createElement('span');
      const sel=root.document.createElement('select');
      sel.id=id;
      sel.setAttribute('aria-describedby','sabik-settings-global-note');
      for(const v of options){
        const o=root.document.createElement('option');
        o.value=v;
        sel.appendChild(o);
      }
      sel.value=value;
      row.append(span,sel);
      details.appendChild(row);
      return {row,span,select:sel};
    }
    const motion=selectRow('sabik-motion-choice',MOTION,state.motion);
    const density=selectRow('sabik-density-choice',DENSITY,state.density);

    const intensity=root.document.querySelector('#sabik-low');
    if(intensity)intensity.setAttribute('aria-describedby','sabik-settings-global-note');

    const voiceHost=root.document.createElement('div');
    voiceHost.id='sabik-voice-settings-host';
    details.appendChild(voiceHost);
    if(root.SabikVoiceUI)root.SabikVoiceUI.mount(voiceHost);

    function syncLanguage(){
      const L=LABELS[lang()];
      summary.textContent=L.summary;
      note.textContent=L.note;
      motion.span.textContent=L.motion;
      density.span.textContent=L.density;
      for(const o of motion.select.options)o.textContent=L.motionOptions[o.value]||o.value;
      for(const o of density.select.options)o.textContent=L.densityOptions[o.value]||o.value;
    }
    languageSync=syncLanguage;
    syncLanguage();

    motion.select.addEventListener('change',()=>{
      update({motion:motion.select.value});
      announce(LABELS[lang()].motionChanged);
      root.document.dispatchEvent(new CustomEvent('sabik:b3-confirm'));
    });
    density.select.addEventListener('change',()=>{
      update({density:density.select.value});
      announce(LABELS[lang()].densityChanged);
      root.document.dispatchEvent(new CustomEvent('sabik:b3-confirm'));
    });

    const notes=root.document.querySelector('.sabik-notes');
    (notes||form).insertAdjacentElement('afterend',details);
    mounted=details;

    const observer=new MutationObserver(records=>{
      apply();
      if(records.some(r=>r.attributeName==='lang'))root.queueMicrotask(syncLanguage);
    });
    observer.observe(root.document.documentElement,{
      attributes:true,
      attributeFilter:['lang','data-ig-motion','data-ig-system-motion','data-ig-contrast','data-ig-text-letter','data-ig-text-word','data-ig-text-line','data-ig-text-width','style']
    });
    const hologram=root.document.querySelector('#sabik-hologram');
    if(hologram)observer.observe(hologram,{attributes:true,attributeFilter:['data-low-intensity']});
    if(root.matchMedia){
      const mq=root.matchMedia('(prefers-reduced-motion: reduce)');
      const cb=()=>apply();
      if(mq.addEventListener)mq.addEventListener('change',cb);
      else if(mq.addListener)mq.addListener(cb);
    }
    apply();
    return details;
  }

  state=load();
  if(root&&root.document){
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',mount,{once:true});
    else root.queueMicrotask(mount);
  }
  return Object.freeze({MOTION,DENSITY,normalize,snapshot,update,effectiveMotion,globalSnapshot,deviceSnapshot,apply,mount,syncLanguage:()=>languageSync&&languageSync()});
});
