/* Iris Green · R40 · local-only data layer for Workshop/Collection.
   No fetch/XHR/beacon/WebSocket. Persistence happens only after explicit user actions. */
(function(root,factory){
  var api=factory(root);
  if(typeof module==='object'&&module.exports) module.exports=api;
  else {
    root.IGR40Local=api;
    root.IGR40LocalData=api;
    root.IGR40=root.IGR40||{};
    root.IGR40.collection=api.collection;
    root.IGR40.projects=api.projects;
    root.IGR40.localData=api;
  }
  if(root && root.document) api.enhanceWorkshop(root);
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';
  var DB_NAME='irisgreen-r40';
  var DB_VERSION=1;
  var CONTRACT='1.0';
  var SCHEMA=1;
  var MAX_IMPORT_BYTES=8*1024*1024; // Existing Workshop file gate.
  var MAX_DEPTH=32, MAX_NODES=100000, MAX_STRING=6*1024*1024;
  var STORES=['collection','progress','projects','meta'];
  var DANGEROUS={__proto__:1,prototype:1,constructor:1};
  var STUDIO_IDS={
    dibujo:'workshop-01','diseno-grafico':'workshop-02',estructuras:'workshop-07',maquinas:'workshop-09',
    circuitos:'workshop-10',programacion:'workshop-12',robotica:'workshop-13',ideas:'workshop-25',
    drawing:'workshop-01','graphic-design':'workshop-02',structures:'workshop-07',machines:'workshop-09',
    circuits:'workshop-10',coding:'workshop-12',robotics:'workshop-13'
  };
  function LocalDataError(code){ this.name='LocalDataError'; this.code=code; this.message=code; if(Error.captureStackTrace) Error.captureStackTrace(this,LocalDataError); }
  LocalDataError.prototype=Object.create(Error.prototype); LocalDataError.prototype.constructor=LocalDataError;
  function fail(code){ throw new LocalDataError(code); }
  function plain(v){ if(v===null||typeof v!=='object'||Array.isArray(v)) return false; var p=Object.getPrototypeOf(v); return p===Object.prototype||p===null; }
  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function bytes(s){ if(typeof TextEncoder!=='undefined') return new TextEncoder().encode(String(s)).byteLength; return unescape(encodeURIComponent(String(s))).length; }
  function scan(v,depth,state){
    state=state||{n:0}; depth=depth||0;
    if(depth>MAX_DEPTH) fail('IMPORT_LIMIT_DEPTH');
    state.n++; if(state.n>MAX_NODES) fail('IMPORT_LIMIT_NODES');
    if(typeof v==='string'){ if(v.length>MAX_STRING) fail('IMPORT_LIMIT_STRING'); return; }
    if(v===null||typeof v==='number'||typeof v==='boolean') return;
    if(Array.isArray(v)){ for(var i=0;i<v.length;i++) scan(v[i],depth+1,state); return; }
    if(!plain(v)) fail('IMPORT_INVALID_VALUE');
    Object.keys(v).forEach(function(k){ if(DANGEROUS[k]) fail('IMPORT_DANGEROUS_KEY'); scan(v[k],depth+1,state); });
  }
  function refKey(r){ return r.namespace+':'+r.id; }
  function normalizeRef(r){
    if(!plain(r)||typeof r.namespace!=='string'||typeof r.id!=='string') fail('INVALID_REFERENCE');
    var ns=r.namespace.trim(), id=r.id.trim();
    if(!/^[a-z][a-z0-9-]{0,63}$/.test(ns)||!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(id)) fail('INVALID_REFERENCE');
    return {namespace:ns,id:id};
  }
  function makeId(){
    if(root && root.crypto && typeof root.crypto.randomUUID==='function') return root.crypto.randomUUID();
    return 'r40-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12);
  }
  function canonicalType(type){ return STUDIO_IDS[type]||type; }
  function normalizeProject(p){
    if(!plain(p)) fail('PROJECT_INVALID');
    scan(p);
    var type=canonicalType(String(p.project_type||'').trim());
    if(!/^workshop-\d\d$/.test(type)&&!/^[a-z][a-z0-9-]{0,63}$/.test(type)) fail('PROJECT_INVALID_TYPE');
    var id=String(p.project_id||makeId());
    if(!/^[A-Za-z0-9][A-Za-z0-9._-]{7,127}$/.test(id)) fail('PROJECT_INVALID_ID');
    var sv=Number(p.project_schema_version||1), rev=Number(p.revision||1);
    if(!Number.isInteger(sv)||sv<1||!Number.isInteger(rev)||rev<1) fail('PROJECT_INVALID_VERSION');
    var title=p.title===undefined?'':String(p.title); if(title.length>200) fail('PROJECT_TITLE_TOO_LONG');
    if(!plain(p.payload)) fail('PROJECT_INVALID_PAYLOAD');
    return {project_id:id,project_type:type,project_schema_version:sv,revision:rev,title:title,payload:clone(p.payload)};
  }
  function validateImportText(text,expectedType){
    text=String(text||'');
    if(bytes(text)>MAX_IMPORT_BYTES) fail('IMPORT_TOO_LARGE');
    var doc; try{ doc=JSON.parse(text); }catch(e){ fail('IMPORT_INVALID_JSON'); }
    scan(doc);
    var p;
    if(doc && doc.kind==='irisgreen-r40-project-export'){
      if(doc.contract_version!==CONTRACT||doc.schema_version!==SCHEMA) fail('IMPORT_UNSUPPORTED_VERSION');
      p=normalizeProject(doc.project);
    } else if(doc && doc.formato==='irisgreen-taller' && doc.version===1 && doc.datos && typeof doc.estudio==='string'){
      p=normalizeProject({project_id:makeId(),project_type:canonicalType(doc.estudio),project_schema_version:1,revision:1,title:doc.titulo||'',payload:doc.datos});
    } else fail('IMPORT_INVALID_SCHEMA');
    if(expectedType && canonicalType(expectedType)!==p.project_type) fail('IMPORT_WRONG_STUDIO');
    return p;
  }
  function MemoryBackend(){
    this.persistent=false; this.reason='MEMORY_ONLY';
    this.m={collection:new Map(),progress:new Map(),projects:new Map(),meta:new Map()};
  }
  MemoryBackend.prototype.get=async function(store,key){ var v=this.m[store].get(key); return v===undefined?null:clone(v); };
  MemoryBackend.prototype.getAll=async function(store){ return Array.from(this.m[store].values()).map(clone); };
  MemoryBackend.prototype.put=async function(store,value){ var key=value.key||value.project_id; this.m[store].set(key,clone(value)); return clone(value); };
  MemoryBackend.prototype.del=async function(store,key){ this.m[store].delete(key); };
  MemoryBackend.prototype.clear=async function(store){ this.m[store].clear(); };
  MemoryBackend.prototype.clearAll=async function(){ var self=this; STORES.forEach(function(s){self.m[s].clear();}); };
  MemoryBackend.prototype.ready=async function(){ return this; };

  function IDBBackend(idb){ this.idb=idb; this.db=null; this.persistent=true; this.reason=null; }
  IDBBackend.prototype.ready=function(){
    var self=this; if(self.db) return Promise.resolve(self);
    return new Promise(function(resolve,reject){
      var req; try{req=self.idb.open(DB_NAME,DB_VERSION);}catch(e){reject(e);return;}
      req.onupgradeneeded=function(){
        var db=req.result;
        if(!db.objectStoreNames.contains('collection')) db.createObjectStore('collection',{keyPath:'key'});
        if(!db.objectStoreNames.contains('progress')) db.createObjectStore('progress',{keyPath:'key'});
        if(!db.objectStoreNames.contains('projects')) db.createObjectStore('projects',{keyPath:'project_id'});
        if(!db.objectStoreNames.contains('meta')) db.createObjectStore('meta',{keyPath:'key'});
        req.transaction.objectStore('meta').put({key:'schema-version',value:SCHEMA});
      };
      req.onsuccess=function(){ self.db=req.result; resolve(self); };
      req.onerror=function(){ reject(req.error||new Error('IDB_OPEN')); };
      req.onblocked=function(){ reject(new Error('IDB_BLOCKED')); };
    });
  };
  IDBBackend.prototype._req=async function(store,mode,fn){
    await this.ready(); var db=this.db;
    return new Promise(function(resolve,reject){
      var tx=db.transaction(store,mode), os=tx.objectStore(store), req;
      try{ req=fn(os); }catch(e){reject(e);return;}
      var result;
      if(req){ req.onsuccess=function(){result=req.result;}; req.onerror=function(){reject(req.error||new Error('IDB_REQUEST'));}; }
      tx.oncomplete=function(){resolve(result===undefined?null:result);};
      tx.onerror=function(){reject(tx.error||new Error('IDB_TX'));};
      tx.onabort=function(){reject(tx.error||new Error('IDB_ABORT'));};
    });
  };
  IDBBackend.prototype.get=function(s,k){return this._req(s,'readonly',function(os){return os.get(k);});};
  IDBBackend.prototype.getAll=function(s){return this._req(s,'readonly',function(os){return os.getAll();}).then(function(v){return v||[];});};
  IDBBackend.prototype.put=function(s,v){return this._req(s,'readwrite',function(os){return os.put(v);}).then(function(){return clone(v);});};
  IDBBackend.prototype.del=function(s,k){return this._req(s,'readwrite',function(os){return os.delete(k);});};
  IDBBackend.prototype.clear=function(s){return this._req(s,'readwrite',function(os){return os.clear();});};
  IDBBackend.prototype.clearAll=async function(){
    await this.ready(); var db=this.db;
    return new Promise(function(resolve,reject){
      var tx=db.transaction(STORES,'readwrite');
      try{STORES.forEach(function(name){tx.objectStore(name).clear();});}catch(e){reject(e);return;}
      tx.oncomplete=function(){resolve();};
      tx.onerror=function(){reject(tx.error||new Error('IDB_TX'));};
      tx.onabort=function(){reject(tx.error||new Error('IDB_ABORT'));};
    });
  };

  function HybridBackend(){
    this.active=null; this.persistent=false; this.reason='NOT_INITIALIZED';
  }
  HybridBackend.prototype.ready=async function(){
    if(this.active) return this.active;
    if(root && root.indexedDB){
      try{ var idb=new IDBBackend(root.indexedDB); await idb.ready(); this.active=idb; this.persistent=true; this.reason=null; return idb; }
      catch(e){}
    }
    this.active=new MemoryBackend(); this.persistent=false; this.reason='STORAGE_UNAVAILABLE'; return this.active;
  };
  ['get','getAll','put','del','clear','clearAll'].forEach(function(m){
    HybridBackend.prototype[m]=async function(){ var b=await this.ready(); try{return await b[m].apply(b,arguments);}catch(e){
      if(e && (e.name==='QuotaExceededError'||e.code===22||e.code===1014)) fail('STORAGE_QUOTA');
      throw e;
    }};
  });

  function createService(backend){
    backend=backend||new HybridBackend();
    function platform(){ return root.IGTallerR42Platform||null; }
    async function coordinated(name,fn){
      var p=platform();
      if(p&&typeof p.withLock==='function') return p.withLock(name,fn);
      return fn();
    }
    function changed(type,detail){
      var p=platform();
      if(p&&typeof p.publish==='function') p.publish(type,detail||null);
      try{ if(root.document) root.document.dispatchEvent(new CustomEvent('ig:r42-local-change',{detail:{type:type,detail:detail||null}})); }catch(e){}
    }
    async function op(name,args){
      try{return await backend[name].apply(backend,args||[]);}
      catch(e){if(e&&(e.name==='QuotaExceededError'||e.code===22||e.code===1014))fail('STORAGE_QUOTA');throw e;}
    }
    async function caps(){ var b=await backend.ready(); return {persistent:!!b.persistent,reason:b.reason||null}; }
    async function listCollection(){ return (await op('getAll',['collection'])).map(function(x){return {namespace:x.namespace,id:x.id};}); }
    async function hasCollection(ref){ ref=normalizeRef(ref); return !!(await op('get',['collection',refKey(ref)])); }
    async function addCollection(ref){ ref=normalizeRef(ref); await op('put',['collection',{key:refKey(ref),namespace:ref.namespace,id:ref.id}]); changed('collection:add',ref); return ref; }
    async function removeCollection(ref){ ref=normalizeRef(ref); await op('del',['collection',refKey(ref)]); changed('collection:remove',ref); }
    async function clearCollection(){ await op('clear',['collection']); changed('collection:clear'); }
    async function isProgressEnabled(){ var v=await op('get',['meta','progress-enabled']); return !!(v&&v.value===true); }
    async function setProgressEnabled(enabled){ await op('put',['meta',{key:'progress-enabled',value:!!enabled}]); return !!enabled; }
    async function loadProgress(){ return (await op('getAll',['progress'])).map(function(x){return {target:x.target,markers:x.markers||[]};}); }
    async function saveProgress(entry){
      if(!(await isProgressEnabled())) return {saved:false,reason:'PROGRESS_DISABLED'};
      if(!plain(entry)||!Array.isArray(entry.markers)) fail('PROGRESS_INVALID');
      var target=normalizeRef(entry.target), markers=Array.from(new Set(entry.markers.map(String))).slice(0,128);
      markers.forEach(function(x){if(!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(x)) fail('PROGRESS_INVALID');});
      await op('put',['progress',{key:refKey(target),target:target,markers:markers}]); changed('progress:save',{target:target}); return {saved:true};
    }
    async function clearProgress(){ await op('clear',['progress']); changed('progress:clear'); }
    async function listProjects(type){
      var all=(await op('getAll',['projects'])).map(normalizeProject);
      if(type) all=all.filter(function(p){return p.project_type===canonicalType(type);});
      all.sort(function(a,b){ return a.title.localeCompare(b.title)||a.project_id.localeCompare(b.project_id); });
      return all;
    }
    async function getProject(id){ var p=await op('get',['projects',id]); return p?normalizeProject(p):null; }
    async function saveProject(project,expectedRevision){
      var candidate=normalizeProject(project);
      return coordinated('project-'+candidate.project_id,async function(){
        var p=normalizeProject(candidate), existing=await op('get',['projects',p.project_id]);
        if(existing){
          existing=normalizeProject(existing);
          if(expectedRevision===undefined||Number(expectedRevision)!==existing.revision) fail('PROJECT_REVISION_CONFLICT');
          p.revision=existing.revision+1;
        } else p.revision=1;
        await op('put',['projects',p]);
        changed('project:save',{project_id:p.project_id,project_type:p.project_type,revision:p.revision});
        return clone(p);
      });
    }
    async function deleteProject(id){
      id=String(id);
      return coordinated('project-'+id,async function(){await op('del',['projects',id]);changed('project:delete',{project_id:id});});
    }
    async function clearProjects(){ return coordinated('projects-clear',async function(){await op('clear',['projects']);changed('projects:clear');}); }
    async function clearAllR40Data(){ return coordinated('all-clear',async function(){await op('clearAll',[]);changed('all:clear');}); }
    async function exportProject(id){
      var p=await getProject(id); if(!p) fail('PROJECT_NOT_FOUND');
      return {filename:'iris-green-'+p.project_type+'-'+p.project_id.slice(-12)+'.json',
        text:JSON.stringify({kind:'irisgreen-r40-project-export',contract_version:CONTRACT,schema_version:SCHEMA,project:p},null,2)};
    }
    async function commitImport(project){
      var p=normalizeProject(project), existing=await getProject(p.project_id);
      if(existing){ p.project_id=makeId(); p.revision=1; }
      return saveProject(p);
    }
    return {
      capabilities:caps,listCollection:listCollection,hasCollection:hasCollection,addCollection:addCollection,removeCollection:removeCollection,clearCollection:clearCollection,
      isProgressEnabled:isProgressEnabled,setProgressEnabled:setProgressEnabled,loadProgress:loadProgress,saveProgress:saveProgress,clearProgress:clearProgress,
      listProjects:listProjects,getProject:getProject,saveProject:saveProject,deleteProject:deleteProject,clearProjects:clearProjects,clearAllR40Data:clearAllR40Data,
      exportProject:exportProject,validateImportText:validateImportText,commitImport:commitImport,makeId:makeId,canonicalType:canonicalType,backend:backend
    };
  }

  var service=createService(new HybridBackend());
  function collectionRef(value){
    if(typeof value==='string') return {namespace:'interests',id:value};
    if(!plain(value)||typeof value.id!=='string') fail('INVALID_REFERENCE');
    if(value.namespace) return {namespace:value.namespace,id:value.id};
    return {namespace:value.kind==='workshop'?'workshop':'interests',id:value.id};
  }
  var collectionFacade={
    has:function(value){return service.hasCollection(collectionRef(value));},
    add:function(value){return service.addCollection(collectionRef(value)).then(function(){return true;});},
    remove:function(value){return service.removeCollection(collectionRef(value)).then(function(){return true;});},
    list:function(){return service.listCollection().then(function(items){return items.map(function(x){return {id:x.id,kind:x.namespace==='interests'?'interest':x.namespace,namespace:x.namespace};});});},
    clear:function(){return service.clearCollection();},
    capabilities:function(){return service.capabilities();}
  };
  var projectsFacade={
    list:service.listProjects,get:service.getProject,save:service.saveProject,remove:service.deleteProject,clear:service.clearProjects,
    export:service.exportProject,validateImportText:service.validateImportText,import:service.commitImport,capabilities:service.capabilities
  };
  var TEXT={
    es:{saveLocal:'Guardar aquí',openLocal:'Guardados',collectionAdd:'Añadir a Mi colección',collectionRemove:'Quitar de Mi colección',
      progressOn:'Guardar progreso',progressOff:'No guardar progreso',sessionOnly:'Solo durante esta sesión',savedLocal:'Proyecto guardado en este dispositivo.',
      openedLocal:'Proyecto abierto.',deleted:'Proyecto borrado.',imported:'Proyecto importado y guardado.',storageError:'No se ha podido guardar. Tu trabajo sigue abierto en esta pestaña.',
      importBad:'Ese archivo no se puede importar. No se ha cambiado nada.',empty:'No hay proyectos guardados de este estudio.',open:'Abrir',del:'Borrar',export:'Exportar',
      import:'Importar',close:'Cerrar',projects:'Proyectos guardados',collection:'Mi colección',clearCollection:'Borrar Mi colección',clearProjects:'Borrar proyectos',
      clearAll:'Borrar todos los datos locales',confirmClear:'¿Borrar estos datos locales? Los archivos que ya hayas exportado no se borran.',
      progress:'Progreso opcional',progressHelp:'Desactivarlo no borra lo ya guardado. Puedes borrar el progreso por separado.',clearProgress:'Borrar progreso'},
    en:{saveLocal:'Save here',openLocal:'Saved projects',collectionAdd:'Add to My collection',collectionRemove:'Remove from My collection',
      progressOn:'Save progress',progressOff:'Do not save progress',sessionOnly:'This session only',savedLocal:'Project saved on this device.',
      openedLocal:'Project opened.',deleted:'Project deleted.',imported:'Project imported and saved.',storageError:'Could not save. Your work is still open in this tab.',
      importBad:'That file cannot be imported. Nothing has changed.',empty:'There are no saved projects for this studio.',open:'Open',del:'Delete',export:'Export',
      import:'Import',close:'Close',projects:'Saved projects',collection:'My collection',clearCollection:'Clear My collection',clearProjects:'Delete projects',
      clearAll:'Delete all local data',confirmClear:'Delete these local data? Files you have already exported will not be deleted.',
      progress:'Optional progress',progressHelp:'Turning it off does not delete saved progress. You can clear progress separately.',clearProgress:'Clear progress'}
  };
  function lang(){ return root.document&&String(root.document.documentElement.lang||'es').slice(0,2)==='en'?'en':'es'; }
  function t(k){ return TEXT[lang()][k]||k; }
  function say(msg){ if(root.IGT&&root.IGT.say) root.IGT.say(msg); }
  function download(name,text){
    var blob=new Blob([text],{type:'application/json'}), url=URL.createObjectURL(blob), a=root.document.createElement('a');
    a.href=url; a.download=name; root.document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(url);},2000);
  }
  function fileImport(expectedType,onDone){
    var input=root.document.createElement('input'); input.type='file'; input.accept='.json,application/json'; input.hidden=true;
    input.addEventListener('change',function(){
      var f=input.files&&input.files[0]; input.remove(); if(!f) return;
      if(f.size>MAX_IMPORT_BYTES){say(t('importBad'));return;}
      var r=new FileReader();
      r.onload=async function(){try{var p=validateImportText(String(r.result),expectedType);var saved=await service.commitImport(p),cap=await service.capabilities();say(cap.persistent?t('imported'):t('sessionOnly'));if(onDone)onDone(saved);}catch(e){say(t('importBad'));}};
      r.onerror=function(){say(t('importBad'));}; r.readAsText(f);
    });
    root.document.body.appendChild(input); input.click();
  }
  function studioRef(studio){ return {namespace:'workshop',id:canonicalType(studio)}; }

  function enhanceIGT(){
    var IGT=root.IGT; if(!IGT||IGT.__r40LocalEnhanced) return;
    IGT.__r40LocalEnhanced=true; IGT.localData=service;
    var original=IGT.projectBar;
    var originalChallenges=IGT.challenges;
    IGT.challenges=function(cfg){
      cfg=cfg||{}; var app=root.document&&root.document.getElementById('igt-app');
      var studio=canonicalType(app&&(app.getAttribute('data-study-id')||app.getAttribute('data-studio'))||'workshop-unknown');
      var ownPick=cfg.onPick, wrapped={};
      Object.keys(cfg).forEach(function(k){wrapped[k]=cfg[k];});
      wrapped.onPick=function(ch){
        if(ch) service.saveProgress({target:studioRef(studio),markers:[ch.id]}).catch(function(){});
        return ownPick?ownPick(ch):null;
      };
      return originalChallenges(wrapped);
    };
    IGT.projectBar=function(cfg){
      var bar=original(cfg), studio=canonicalType(cfg.studyId||cfg.studio||'workshop-unknown'), current=null;
      var sep=IGT.h('span',{class:'igt-sep','aria-hidden':'true'}); bar.appendChild(sep);
      var save=IGT.btn(t('saveLocal'),{icon:'guardar',onClick:async function(){
        try{
          var base={project_id:current?current.project_id:makeId(),project_type:studio,project_schema_version:1,revision:current?current.revision:1,
            title:cfg.getTitle?cfg.getTitle():'',payload:cfg.getData()};
          current=await service.saveProject(base,current?current.revision:undefined);
          IGT.markClean(); var cap=await service.capabilities(); say(cap.persistent?t('savedLocal'):t('sessionOnly'));
          if(await service.isProgressEnabled()) await service.saveProgress({target:studioRef(studio),markers:['project-saved']});
          await refresh();
        }catch(e){say(t('storageError'));}
      }});
      var manage=IGT.btn(t('openLocal'),{icon:'abrir',pressed:false,onClick:function(){ panel.hidden=!panel.hidden; IGT.press(manage,!panel.hidden); if(!panel.hidden)refresh(); }});
      var collection=IGT.btn(t('collectionAdd'),{pressed:false,onClick:async function(){
        var ref=studioRef(studio), has=await service.hasCollection(ref);
        if(has) await service.removeCollection(ref); else await service.addCollection(ref);
        await syncCollection();
      }});
      var progress=IGT.btn(t('progressOn'),{pressed:false,onClick:async function(){
        var on=await service.isProgressEnabled(); await service.setProgressEnabled(!on); await syncProgress();
      }});
      bar.appendChild(save);bar.appendChild(manage);bar.appendChild(collection);bar.appendChild(progress);
      var panel=IGT.h('div',{class:'igt-local-panel',hidden:true,role:'region','aria-label':t('projects')});
      var select=IGT.h('select',{'aria-label':t('projects')});
      var openB=IGT.btn(t('open'),{onClick:async function(){
        var p=await service.getProject(select.value); if(!p)return; current=p; cfg.onOpen(p.payload,p); IGT.markClean(); say(t('openedLocal')); panel.hidden=true; IGT.press(manage,false);
      }});
      var delB=IGT.btn(t('del'),{onClick:async function(){if(!select.value)return;if(!root.confirm(t('confirmClear')))return;await service.deleteProject(select.value);if(current&&current.project_id===select.value)current=null;say(t('deleted'));await refresh();}});
      var expB=IGT.btn(t('export'),{onClick:async function(){if(!select.value)return;try{var out=await service.exportProject(select.value);download(out.filename,out.text);}catch(e){say(t('storageError'));}}});
      var impB=IGT.btn(t('import'),{onClick:function(){fileImport(studio,function(){refresh();});}});
      panel.appendChild(select);panel.appendChild(openB);panel.appendChild(delB);panel.appendChild(expB);panel.appendChild(impB);bar.appendChild(panel);
      async function refresh(){
        var ps=await service.listProjects(studio); IGT.clear(select);
        if(!ps.length){var o=IGT.h('option',{value:'',text:t('empty')});select.appendChild(o);openB.disabled=delB.disabled=expB.disabled=true;}
        else{ps.forEach(function(p){select.appendChild(IGT.h('option',{value:p.project_id,text:(p.title||p.project_type)+' · r'+p.revision}));});openB.disabled=delB.disabled=expB.disabled=false;}
        var cap=await service.capabilities(); panel.setAttribute('data-persistent',cap.persistent?'true':'false'); panel.title=cap.persistent?'':t('sessionOnly');
      }
      async function syncCollection(){var has=await service.hasCollection(studioRef(studio));IGT.press(collection,has);collection.querySelector('span').textContent=has?t('collectionRemove'):t('collectionAdd');}
      async function syncProgress(){var on=await service.isProgressEnabled();IGT.press(progress,on);progress.querySelector('span').textContent=on?t('progressOff'):t('progressOn');}
      syncCollection();syncProgress();refresh();
      return bar;
    };
  }

  function mountSummary(){
    var host=root.document&&root.document.getElementById('igt-local-summary'); if(!host||!root.IGT)return;
    var IGT=root.IGT; IGT.clear(host);
    var h=IGT.h('h2',{text:t('collection')}), list=IGT.h('ul',{class:'igt-local-summary-list'}), info=IGT.h('p',{class:'igt-note'});
    var ph=IGT.h('h3',{text:t('projects')}), projectList=IGT.h('ul',{class:'igt-local-summary-list'});
    host.appendChild(h);host.appendChild(info);host.appendChild(list);host.appendChild(ph);host.appendChild(projectList);
    var controls=IGT.h('div',{class:'igt-bar'});
    var clearC=IGT.btn(t('clearCollection'),{onClick:async function(){if(root.confirm(t('confirmClear'))){await service.clearCollection();render();}}});
    var clearP=IGT.btn(t('clearProjects'),{onClick:async function(){if(root.confirm(t('confirmClear'))){await service.clearProjects();render();}}});
    var clearProg=IGT.btn(t('clearProgress'),{onClick:async function(){if(root.confirm(t('confirmClear'))){await service.clearProgress();render();}}});
    var clearAll=IGT.btn(t('clearAll'),{onClick:async function(){if(root.confirm(t('confirmClear'))){await service.clearAllR40Data();render();}}});
    controls.appendChild(clearC);controls.appendChild(clearProg);controls.appendChild(clearP);controls.appendChild(clearAll);host.appendChild(controls);
    async function render(){
      var c=await service.listCollection(),p=await service.listProjects(),pr=await service.loadProgress(),cap=await service.capabilities();
      IGT.clear(list); IGT.clear(projectList);
      var cat=root.IGTallerR40Catalog||[];
      c.forEach(function(x){
        var item=cat.find?cat.find(function(s){return s.id===x.id;}):null;
        if(item&&x.namespace==='workshop'){
          var a=IGT.h('a',{href:(lang()==='en'?'/en/workshop/'+item.slugs.en+'/':'/es/taller/'+item.slugs.es+'/'),text:item.title[lang()]});
          list.appendChild(IGT.h('li',{},a));
        }else list.appendChild(IGT.h('li',{text:x.id}));
      });
      if(!c.length)list.appendChild(IGT.h('li',{text:'—'}));
      p.forEach(function(project){
        var item=cat.find?cat.find(function(s){return s.id===project.project_type;}):null;
        var label=(project.title||item&&item.title[lang()]||project.project_type)+' · r'+project.revision;
        if(item){
          projectList.appendChild(IGT.h('li',{},IGT.h('a',{href:(lang()==='en'?'/en/workshop/'+item.slugs.en+'/':'/es/taller/'+item.slugs.es+'/'),text:label})));
        }else projectList.appendChild(IGT.h('li',{text:label}));
      });
      if(!p.length)projectList.appendChild(IGT.h('li',{text:'—'}));
      info.textContent=(lang()==='en'?'Collection: ':'Colección: ')+c.length+' · '+(lang()==='en'?'projects: ':'proyectos: ')+p.length+' · '+(lang()==='en'?'progress: ':'progreso: ')+pr.length+(cap.persistent?'':' · '+t('sessionOnly'));
    }
    render();
  }

  function enhanceWorkshop(w){
    if(!w.document) return;
    function go(){enhanceIGT();mountSummary();}
    if(w.document.readyState==='loading') w.document.addEventListener('DOMContentLoaded',go,{once:true}); else setTimeout(go,0);
  }

  return {
    DB_NAME:DB_NAME,DB_VERSION:DB_VERSION,CONTRACT:CONTRACT,SCHEMA_VERSION:SCHEMA,MAX_IMPORT_BYTES:MAX_IMPORT_BYTES,
    LocalDataError:LocalDataError,MemoryBackend:MemoryBackend,createService:createService,validateImportText:validateImportText,
    canonicalType:canonicalType,collection:collectionFacade,projects:projectsFacade,service:service,enhanceWorkshop:enhanceWorkshop
  };
});
