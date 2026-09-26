/* Iris Green R40 · componentes comunes.
   Sin analítica, sin persistencia implícita, sin voz y sin llamadas de red salvo
   cargar el índice local cuando la persona abre y usa Buscar. */
(function () {
  'use strict';
  if (window.IGR40) return;

  var root = document.documentElement;
  var locale = (root.lang || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var TEXT = {
    es: {
      search:'Buscar', searchTitle:'Buscar en Iris Green', searchLabel:'¿Qué buscas?',
      searchHint:'Escribe una palabra o una frase.', close:'Cerrar', results:'Resultados',
      noResults:'No hay resultados con esas palabras.', loadError:'No se ha podido abrir el buscador.',
      loading:'Buscando…', empty:'No hay elementos que mostrar.', error:'No se ha podido mostrar este contenido.',
      open:'Abrir', collection:'Mi colección', added:'Añadido a Mi colección', removed:'Quitado de Mi colección',
      sortAsc:'Orden ascendente', sortDesc:'Orden descendente', explore:'También puedes explorar'
    },
    en: {
      search:'Search', searchTitle:'Search Iris Green', searchLabel:'What are you looking for?',
      searchHint:'Type a word or phrase.', close:'Close', results:'Results',
      noResults:'No results match those words.', loadError:'Search could not be opened.',
      loading:'Searching…', empty:'There is nothing to show.', error:'This content could not be displayed.',
      open:'Open', collection:'My collection', added:'Added to My collection', removed:'Removed from My collection',
      sortAsc:'Ascending order', sortDesc:'Descending order', explore:'You can also explore'
    }
  };
  function t(key){ return TEXT[locale][key] || key; }
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (key) {
      var value = attrs[key];
      if (value === null || value === undefined || value === false) return;
      if (key === 'text') el.textContent = String(value);
      else if (key === 'class') el.className = String(value);
      else if (key === 'on') Object.keys(value).forEach(function (name) { el.addEventListener(name, value[name]); });
      else if (key in el && key !== 'list') {
        try { el[key] = value; } catch (_) { el.setAttribute(key, String(value)); }
      } else el.setAttribute(key, value === true ? '' : String(value));
    });
    for (var i=2;i<arguments.length;i++) append(el, arguments[i]);
    return el;
  }
  function append(el, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (x) { append(el,x); }); return; }
    el.appendChild(child && child.nodeType ? child : document.createTextNode(String(child)));
  }
  function normal(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
  }
  function sameOriginPath(value) {
    try {
      var u = new URL(value, location.origin);
      return u.origin === location.origin ? u.pathname + u.search + u.hash : '/';
    } catch (_) { return '/'; }
  }
  function dispatch(node, name, detail) {
    (node || document).dispatchEvent(new CustomEvent(name, { detail: detail || {}, bubbles: true }));
  }

  /* Estado de baja estimulación. */
  function setState(container, state, message, detail) {
    if (!container) return null;
    var old = container.querySelector(':scope > .ig-state[data-ig-generated="r40"]');
    if (old) old.remove();
    if (!state || state === 'ready') return null;
    var title = message || t(state === 'loading' ? 'loading' : state === 'empty' ? 'empty' : 'error');
    var box = h('div',{class:'ig-state','data-state':state,'data-ig-generated':'r40',role:state === 'error' ? 'alert' : 'status'},
      h('strong',{text:title}),
      detail ? h('span',{text:detail}) : null
    );
    container.appendChild(box);
    dispatch(container,'ig:state-change',{state:state});
    return box;
  }

  /* Ficha común. */
  function createCard(data) {
    data = data || {};
    var tag = data.href ? 'a' : 'article';
    var attrs = {class:'ig-card'};
    if (data.href) attrs.href = sameOriginPath(data.href);
    if (data.id) attrs['data-id'] = data.id;
    var title = h(data.headingTag || 'h3',{class:'ig-card__title',text:data.title || ''});
    var card = h(tag,attrs,title);
    if (data.description) card.appendChild(h('p',{class:'ig-card__description',text:data.description}));
    if (data.meta && data.meta.length) card.appendChild(h('div',{class:'ig-card__meta'},data.meta.map(function(x){return h('span',{text:x});})));
    return card;
  }

  /* Buscador local reutilizable para listas ya presentes en la página. */
  function bindSearch(options) {
    options = options || {};
    var input = options.input, items = Array.from(options.items || []), status = options.status;
    if (!input) throw new TypeError('R40 search needs an input');
    function run() {
      var q = normal(input.value), count = 0;
      items.forEach(function (item) {
        var text = options.text ? options.text(item) : item.textContent;
        var show = !q || normal(text).indexOf(q) !== -1;
        item.hidden = !show;
        if (show) count++;
      });
      if (status) status.textContent = String(count);
      if (options.onChange) options.onChange({query:input.value,count:count});
      dispatch(options.root || input,'ig:query-change',{query:input.value,count:count});
      return count;
    }
    input.addEventListener('input',run);
    run();
    return { refresh:run, destroy:function(){ input.removeEventListener('input',run); } };
  }

  /* Filtros progresivos: primarios visibles; avanzados pueden vivir en <details>. */
  function bindFilters(options) {
    options = options || {};
    var rootNode = options.root;
    if (!rootNode) throw new TypeError('R40 filters need a root');
    var buttons = Array.from(rootNode.querySelectorAll('[data-ig-filter-value]'));
    var items = Array.from(options.items || rootNode.querySelectorAll('[data-ig-filter-item]'));
    var active = options.initial || 'all';
    function apply(value, source) {
      active = value || 'all';
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.igFilterValue === active)); });
      var count = 0;
      items.forEach(function (item) {
        var values = (item.dataset.igFilterItem || '').split(/\s+/);
        var show = active === 'all' || values.indexOf(active) !== -1;
        item.hidden = !show;
        if (show) count++;
      });
      if (options.status) options.status.textContent = String(count);
      dispatch(rootNode,'ig:filters-change',{value:active,count:count,source:source || 'api'});
      if (options.onChange) options.onChange({value:active,count:count});
    }
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed',String(b.dataset.igFilterValue === active));
      b.addEventListener('click',function(){ apply(b.dataset.igFilterValue,'user'); });
    });
    apply(active,'init');
    return { set:apply, get:function(){return active;} };
  }

  /* Tabla ordenable. No cambia datos ni hace ranking: solo orden visible. */
  function enhanceSortableTable(table) {
    if (!table || table.dataset.igR40Sorted === 'true') return table;
    var body = table.tBodies && table.tBodies[0];
    if (!body) return table;
    table.dataset.igR40Sorted = 'true';
    table.classList.add('ig-table');
    if (table.parentElement && !table.parentElement.classList.contains('ig-table-wrap')) {
      var wrap = h('div',{class:'ig-table-wrap'});
      table.parentNode.insertBefore(wrap,table);
      wrap.appendChild(table);
    }
    Array.from(table.querySelectorAll('thead th[data-sort],thead th[data-ig-sort]')).forEach(function (th) {
      var key = th.dataset.sort || th.dataset.igSort || 'text';
      var label = th.textContent.trim();
      th.textContent = '';
      var button = h('button',{type:'button',class:'ig-sort-button',text:label});
      th.appendChild(button);
      button.addEventListener('click',function(){
        var next = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        Array.from(table.querySelectorAll('thead th[aria-sort]')).forEach(function(x){x.removeAttribute('aria-sort');});
        th.setAttribute('aria-sort',next);
        var index = Array.from(th.parentNode.children).indexOf(th);
        var rows = Array.from(body.rows).map(function(row,i){ return {row:row,i:i}; });
        rows.sort(function(a,b){
          var av=(a.row.cells[index] && a.row.cells[index].dataset.sortValue) || (a.row.cells[index] && a.row.cells[index].textContent) || '';
          var bv=(b.row.cells[index] && b.row.cells[index].dataset.sortValue) || (b.row.cells[index] && b.row.cells[index].textContent) || '';
          var an=Number(av),bn=Number(bv),cmp;
          if (key === 'number' && Number.isFinite(an) && Number.isFinite(bn)) cmp=an-bn;
          else cmp=String(av).localeCompare(String(bv),locale,{numeric:true,sensitivity:'base'});
          if (!cmp) cmp=a.i-b.i;
          return next === 'ascending' ? cmp : -cmp;
        });
        rows.forEach(function(x){body.appendChild(x.row);});
        button.setAttribute('aria-label',label+' · '+t(next === 'ascending' ? 'sortAsc' : 'sortDesc'));
        dispatch(table,'ig:sort-change',{column:index,direction:next});
      });
    });
    return table;
  }

  /* Visor común con retorno de foco. */
  function createViewer(options) {
    options = options || {};
    var dialog = h('dialog',{class:'ig-viewer'});
    var title = h('strong',{text:options.title || ''});
    var close = h('button',{type:'button',class:'ig-button ig-button--secondary',text:t('close')});
    var body = h('div',{class:'ig-viewer__body'});
    dialog.appendChild(h('div',{class:'ig-viewer__bar'},title,close));
    dialog.appendChild(body);
    document.body.appendChild(dialog);
    var opener = null;
    close.addEventListener('click',function(){dialog.close();});
    dialog.addEventListener('close',function(){ if (opener && opener.isConnected) opener.focus({preventScroll:true}); dispatch(dialog,'ig:viewer-close',{}); });
    dialog.addEventListener('cancel',function(){});
    return {
      element:dialog,
      open:function(content,trigger,label){
        opener=trigger || document.activeElement;
        title.textContent=label || options.title || '';
        body.replaceChildren();
        append(body,content);
        dialog.showModal();
        close.focus({preventScroll:true});
        dispatch(dialog,'ig:viewer-open',{});
      },
      close:function(){ if(dialog.open) dialog.close(); },
      destroy:function(){ dialog.remove(); }
    };
  }

  /* Mi colección: memoria de sesión por defecto. A5 puede inyectar un adaptador
     persistente sin que los componentes conozcan el backend de almacenamiento ni la red. */
  var memoryCollection = [];
  var collectionAdapter = {
    list:function(){return Promise.resolve(memoryCollection.slice());},
    has:function(id){return Promise.resolve(memoryCollection.indexOf(id)!==-1);},
    add:function(id){if(memoryCollection.indexOf(id)===-1)memoryCollection.push(id);return Promise.resolve();},
    remove:function(id){memoryCollection=memoryCollection.filter(function(x){return x!==id;});return Promise.resolve();},
    clear:function(){memoryCollection=[];return Promise.resolve();}
  };
  function setCollectionAdapter(adapter) {
    if (!adapter || ['list','has','add','remove'].some(function(k){return typeof adapter[k] !== 'function';})) throw new TypeError('Invalid collection adapter');
    collectionAdapter = adapter;
    dispatch(document,'ig:collection-adapter',{ready:true});
  }
  var collection = {
    list:function(){return collectionAdapter.list();},
    has:function(id){return collectionAdapter.has(id);},
    add:function(id){return collectionAdapter.add(id).then(function(){dispatch(document,'ig:collection-change',{id:id,action:'add'});});},
    remove:function(id){return collectionAdapter.remove(id).then(function(){dispatch(document,'ig:collection-change',{id:id,action:'remove'});});},
    clear:function(){return typeof collectionAdapter.clear==='function'?collectionAdapter.clear().then(function(){dispatch(document,'ig:collection-change',{action:'clear'});}):Promise.resolve();}
  };

  /* Proyectos: solo interfaz. El adaptador de A5 decide validación, límites y
     persistencia/exportación. Si IGT ya existe se reutiliza explícitamente. */
  var projectAdapter = null;
  function setProjectAdapter(adapter) {
    if (!adapter || typeof adapter.save !== 'function' || typeof adapter.open !== 'function') throw new TypeError('Invalid project adapter');
    projectAdapter=adapter;
    dispatch(document,'ig:project-adapter',{ready:true});
  }
  var projects = {
    available:function(){return !!projectAdapter || !!(window.IGT && window.IGT.saveProject && window.IGT.openProject);},
    save:function(type,data,title){
      dispatch(document,'ig:project-dirty',{type:type,dirty:true});
      if(projectAdapter)return Promise.resolve(projectAdapter.save(type,data,title)).then(function(v){dispatch(document,'ig:project-saved',{type:type});return v;});
      if(window.IGT && window.IGT.saveProject){window.IGT.saveProject(type,data,title);dispatch(document,'ig:project-saved',{type:type});return Promise.resolve();}
      return Promise.reject(new Error('PROJECT_ADAPTER_UNAVAILABLE'));
    },
    open:function(type,onData){
      if(projectAdapter)return Promise.resolve(projectAdapter.open(type,onData)).then(function(v){dispatch(document,'ig:project-opened',{type:type});return v;});
      if(window.IGT && window.IGT.openProject){window.IGT.openProject(type,function(data,doc){onData(data,doc);dispatch(document,'ig:project-opened',{type:type});});return Promise.resolve();}
      return Promise.reject(new Error('PROJECT_ADAPTER_UNAVAILABLE'));
    }
  };

  var ROUTES = {
    home:{es:'/',en:'/'},
    information:{es:'/es/neurodiversidad/condiciones/',en:'/en/neurodiversity/conditions/'},
    situations:{es:'/es/situaciones/',en:'/en/situations/'},
    support:{es:'/es/tramites/directorio/',en:'/es/tramites/directorio/'},
    resources:{es:'/es/recursos/',en:'/en/resources/'},
    interests:{es:'/es/intereses/',en:'/en/interests/'},
    workshop:{es:'/es/taller/',en:'/en/workshop/'},
    quiet:{es:'/es/sitio-tranquilo/',en:'/en/quiet-space/'}
  };

  /* Buscador global: se crea una vez; el índice local se solicita al usarlo. */
  var searchDialog=null, searchInput=null, searchList=null, searchStatus=null, searchIndex=null, searchOpener=null;
  function pickRecord(raw) {
    var rec = locale === 'en' && raw.en ? raw.en : raw;
    return {
      title: rec.t || rec.title || rec.name || '',
      description: rec.d || rec.description || '',
      url: rec.u || rec.url || raw.u || raw.url || '/',
      kind: rec.s || rec.kind || ''
    };
  }
  function buildSearchDialog() {
    if(searchDialog)return searchDialog;
    searchInput=h('input',{type:'search',class:'ig-field',autocomplete:'off',spellcheck:false});
    searchList=h('ul',{class:'ig-global-search__results'});
    searchStatus=h('p',{role:'status'});
    var close=h('button',{type:'button',class:'ig-button ig-button--secondary',text:t('close')});
    searchDialog=h('dialog',{class:'ig-global-search','aria-labelledby':'ig-global-search-title'});
    searchDialog.appendChild(h('div',{class:'ig-global-search__head'},
      h('h2',{id:'ig-global-search-title',text:t('searchTitle')}),close));
    searchDialog.appendChild(h('div',{class:'ig-global-search__body'},
      h('label',null,h('span',{text:t('searchLabel')}),searchInput),
      h('p',{text:t('searchHint')}),
      searchStatus,
      searchList
    ));
    document.body.appendChild(searchDialog);
    close.addEventListener('click',function(){searchDialog.close();});
    searchDialog.addEventListener('close',function(){if(searchOpener&&searchOpener.isConnected)searchOpener.focus({preventScroll:true});});
    searchInput.addEventListener('input',runGlobalSearch);
    return searchDialog;
  }
  function renderGlobal(items) {
    searchList.replaceChildren();
    if (!items.length) {
      searchStatus.textContent=t('noResults');
      return;
    }
    searchStatus.textContent=items.length+' · '+t('results');
    items.slice(0,12).forEach(function(item){
      var a=h('a',{href:sameOriginPath(item.url)},h('strong',{text:item.title}));
      if(item.kind)a.appendChild(h('small',{text:item.kind}));
      if(item.description)a.appendChild(h('span',{text:item.description}));
      searchList.appendChild(h('li',null,a));
    });
  }
  function runGlobalSearch() {
    var q=normal(searchInput.value);
    if(!q){searchList.replaceChildren();searchStatus.textContent=t('searchHint');return;}
    if(!searchIndex){searchStatus.textContent=t('loading');return;}
    var scored=[];
    searchIndex.forEach(function(raw){
      var item=pickRecord(raw), hay=normal(item.title+' '+item.description+' '+item.kind);
      var at=hay.indexOf(q);
      if(at!==-1)scored.push({item:item,score:at+(normal(item.title).indexOf(q)===0?-100:0)});
    });
    scored.sort(function(a,b){return a.score-b.score;});
    renderGlobal(scored.map(function(x){return x.item;}));
    dispatch(searchDialog,'ig:query-change',{query:searchInput.value,count:scored.length});
  }
  function openGlobalSearch(trigger) {
    var dialog=buildSearchDialog();
    searchOpener=trigger || document.activeElement;
    dialog.showModal();
    searchInput.focus({preventScroll:true});
    if(searchIndex)return;
    searchStatus.textContent=t('loading');
    fetch('/buscador.json',{credentials:'same-origin',cache:'force-cache'})
      .then(function(r){if(!r.ok)throw new Error('INDEX');return r.json();})
      .then(function(data){searchIndex=Array.isArray(data)?data:(Array.isArray(data.items)?data.items:[]);runGlobalSearch();})
      .catch(function(){searchStatus.textContent=t('loadError');});
  }

  function markCurrentNavigation() {
    var path=location.pathname;
    document.querySelectorAll('.ig-r40-nav a[href]').forEach(function(a){
      var href;
      try{href=new URL(a.href,location.origin).pathname;}catch(_){return;}
      if(href!=='/' && (path===href || path.indexOf(href)===0))a.setAttribute('aria-current','page');
      else if(href==='/' && path==='/')a.setAttribute('aria-current','page');
    });
  }
  function addCrosslinks() {
    var main=document.getElementById('main') || document.querySelector('main');
    if(!main || main.querySelector('.ig-r40-crosslinks'))return;
    var p=location.pathname;
    if(!/(\/recursos\/|\/resources\/|\/taller\/|\/workshop\/|\/intereses\/|\/interests\/|\/sitio-tranquilo\/|\/quiet-space\/)/.test(p))return;
    var box=h('nav',{class:'ig-r40-crosslinks','aria-label':t('explore')},
      h('strong',{text:t('explore')}),
      h('a',{href:ROUTES.resources[locale],text:locale==='en'?'Resources':'Recursos'}),
      h('a',{href:ROUTES.interests[locale],text:locale==='en'?'Your interests':'Tus intereses'}),
      h('a',{href:ROUTES.workshop[locale],text:locale==='en'?'The workshop':'El taller'}),
      h('a',{href:ROUTES.quiet[locale],text:locale==='en'?'Quiet space':'Rincón tranquilo'})
    );
    main.appendChild(box);
  }
  function ready() {
    markCurrentNavigation();
    addCrosslinks();
    document.querySelectorAll('table[data-ig-sortable]').forEach(enhanceSortableTable);
    document.addEventListener('click',function(e){
      var trigger=e.target.closest('[data-ig-r40-search]');
      if(!trigger)return;
      e.preventDefault();
      openGlobalSearch(trigger);
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){
        document.querySelectorAll('.ig-r40-nav-group[open]').forEach(function(d){d.open=false;});
      }
    });
  }

  window.IGR40 = {
    version:'1.0.0',
    locale:locale,
    routes:ROUTES,
    h:h,
    createCard:createCard,
    bindSearch:bindSearch,
    bindFilters:bindFilters,
    enhanceSortableTable:enhanceSortableTable,
    createViewer:createViewer,
    setState:setState,
    collection:collection,
    setCollectionAdapter:setCollectionAdapter,
    projects:projects,
    setProjectAdapter:setProjectAdapter,
    openGlobalSearch:openGlobalSearch
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
  else ready();
})();