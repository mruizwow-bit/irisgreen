(function(){'use strict';
function norm(s){return String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function lang(){return document.documentElement.lang==='en'?'en':'es';}
function text(es,en){return lang()==='es'?es:en;}
function localCollection(){
  var api=(window.IGR40&&window.IGR40.collection)||(window.IGR40LocalData&&window.IGR40LocalData.collection);
  var memory=window.__IGR40InterestMemoryCollection||(window.__IGR40InterestMemoryCollection=new Map());
  function call(name,args,fallback){try{if(api&&typeof api[name]==='function')return Promise.resolve(api[name].apply(api,args));}catch(e){return Promise.reject(e);}return Promise.resolve(fallback());}
  return {
    has:function(id){return call('has',[id],function(){return memory.has(id);});},
    add:function(item){return call('add',[item],function(){memory.set(item.id,item);return true;});},
    remove:function(id){return call('remove',[id],function(){memory.delete(id);return true;});},
    list:function(){return call('list',[],function(){return Array.from(memory.values());});},
    persistent:!!api
  };
}
function collectionButtons(){
  document.querySelectorAll('[data-r40-collect]').forEach(function(btn){
    var id=btn.dataset.interestId,title=btn.dataset.title,api=localCollection(),status=document.querySelector('[data-r40-collection-status]');
    function paint(){api.has(id).then(function(on){btn.dataset.saved=String(!!on);btn.textContent=on?text('Quitar de Mi colección','Remove from My collection'):text('Guardar en Mi colección','Save to My collection');});}
    btn.addEventListener('click',function(){
      api.has(id).then(function(on){return on?api.remove(id):api.add({id:id,kind:'interest',title:title});}).then(function(){
        paint();if(status)status.textContent=api.persistent?text('Colección local actualizada.','Local collection updated.'):text('Guardado durante esta sesión. La capa persistente se añade al integrar el módulo local.','Saved for this session. Persistent storage is added when the local-data module is integrated.');
        document.dispatchEvent(new CustomEvent('ig:collection-change',{detail:{id:id}}));
      }).catch(function(){if(status)status.textContent=text('No se pudo actualizar la colección.','The collection could not be updated.');});
    });paint();
  });
}
function mainSearch(){
  var input=document.querySelector('[data-r40-search]');if(!input)return;
  var box=document.querySelector('[data-r40-search-results]'),status=document.querySelector('[data-r40-search-status]');
  var url=lang()==='es'?'/assets/data/r40-interests.es.json':'/assets/data/r40-interests.en.json',data=null;
  function render(){var q=norm(input.value).trim();if(!q){box.hidden=true;box.innerHTML='';status.textContent='';return;}if(!data){status.textContent=text('Cargando catálogo…','Loading catalogue…');fetch(url,{credentials:'same-origin'}).then(function(r){if(!r.ok)throw new Error();return r.json();}).then(function(x){data=x.interests;render();}).catch(function(){status.textContent=text('No se pudo cargar el catálogo. Usa los 11 grupos o el catálogo completo.','The catalogue could not be loaded. Use the 11 groups or the full catalogue.');});return;}
    var hits=data.filter(function(x){return norm(x.title+' '+x.objective+' '+x.group_title).includes(q);}).slice(0,24);
    status.textContent=hits.length+' '+text(hits.length===1?'resultado':'resultados',hits.length===1?'result':'results');
    box.innerHTML='';hits.forEach(function(x){var a=document.createElement('a');a.className='r40-search-result';a.href=x.route;var strong=document.createElement('strong');strong.textContent=x.title;var span=document.createElement('span');span.textContent=' · '+x.group_title;a.append(strong,span);box.appendChild(a);});box.hidden=false;
  }input.addEventListener('input',render);
}
function localSearch(){var input=document.querySelector('[data-r40-local-search]');if(!input)return;var list=document.querySelector('[data-r40-local-list]'),status=document.querySelector('[data-r40-local-status]'),items=Array.from(list.children);function paint(){var q=norm(input.value).trim(),n=0;items.forEach(function(li){var a=li.querySelector('[data-search]');var show=!q||norm(a&&a.dataset.search).includes(q);li.hidden=!show;if(show)n++;});status.textContent=n+' '+text(n===1?'interés':'intereses',n===1?'interest':'interests');}input.addEventListener('input',paint);paint();}
function tableFilter(){var q=document.querySelector('[data-r40-table-search]'),g=document.querySelector('[data-r40-table-group]');if(!q||!g)return;var rows=Array.from(document.querySelectorAll('[data-r40-row]')),status=document.querySelector('[data-r40-table-status]');function paint(){var needle=norm(q.value).trim(),group=g.value,n=0;rows.forEach(function(r){var show=(!needle||norm(r.dataset.search).includes(needle))&&(!group||r.dataset.group===group);r.hidden=!show;if(show)n++;});status.textContent=n+' '+text(n===1?'interés':'intereses',n===1?'interest':'interests');}q.addEventListener('input',paint);g.addEventListener('change',paint);paint();}
document.addEventListener('DOMContentLoaded',function(){collectionButtons();mainSearch();localSearch();tableFilter();},{once:true});
})();