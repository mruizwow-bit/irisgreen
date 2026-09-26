/* Iris Green · R42 Workshop product shell.
   Workspace-first progressive enhancement for all 25 studies.
   No network calls. Existing engines and local-data contracts are preserved. */
(function(root,factory){
  var api=factory(root);
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.IGTallerR42=api;
  if(root&&root.document) api.autoMount();
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';
  var D=root.document;
  var WORK_SELECTOR='.igt-r40-canvas,.igt-r40-pixel,.igt-r40-floor,.igt-r40-game,.igt-r40-world,.igt-r40-sim,.igt-r40-board,.igt-r40-sequencer,.igt-r40-piano,.igt-r40-comic,.igt-r40-writing,.igt-r40-photo,.igt-canvas-box,canvas,.igt-arena';
  function lang(){return D&&String(D.documentElement.lang||'es').slice(0,2)==='en'?'en':'es';}
  function T(es,en){return lang()==='en'?en:es;}
  function el(tag,cls,text){var n=D.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function btn(text,cls){var b=el('button',cls||'',text);b.type='button';return b;}
  function q(s,c){return (c||D).querySelector(s);}
  function qa(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s));}
  function catalogue(){return root.IGTallerR40Catalog||[];}
  function studyFromApp(app){var id=app&&app.getAttribute('data-study-id');var c=catalogue();for(var i=0;i<c.length;i++)if(c[i].id===id)return c[i];return null;}
  function pathData(id){var p=root.IGTallerR42Paths||{};return p[id]||null;}
  function safeClick(target){if(target&&!target.disabled)target.click();}
  function findButton(container,rx){var a=qa('button',container);for(var i=0;i<a.length;i++){var t=(a[i].textContent||'').trim();if(rx.test(t))return a[i];}return null;}
  function ensureCss(){if(q('link[data-ig42-taller]'))return;var l=D.createElement('link');l.rel='stylesheet';l.href='/assets/ig-taller-r42.css?v=r42-a5-1';l.dataset.ig42Taller='true';D.head.appendChild(l);}

  function createDialog(id,title){
    var d=D.createElement('dialog');d.id=id;d.className='ig42-dialog';d.setAttribute('aria-labelledby',id+'-title');
    var head=el('div','ig42-dialog-head'),h=el('h2','',title),x=btn(T('Cerrar','Close'),'ig42-icon-btn');x.setAttribute('aria-label',T('Cerrar','Close'));x.textContent='×';x.addEventListener('click',function(){d.close();});
    h.id=id+'-title';head.appendChild(h);head.appendChild(x);d.appendChild(head);d.appendChild(el('div','ig42-dialog-body'));D.body.appendChild(d);return d;
  }
  function showDialog(d,trigger){if(!d)return;d.__trigger=trigger||D.activeElement;if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');}
  function wireDialogClose(d){d.addEventListener('close',function(){if(d.__trigger&&typeof d.__trigger.focus==='function')d.__trigger.focus();});}

  function stageSelector(study){
    var wrap=el('div','ig42-stage-choice'),label=el('span','ig42-stage-label',T('Ruta de entrada','Entry path'));wrap.appendChild(label);
    var group=el('div','ig42-segmented');group.setAttribute('role','group');group.setAttribute('aria-label',label.textContent);
    var stages=[['all',T('Cualquier edad','Any age')],['child',T('Infancia','Childhood')],['teen',T('Adolescencia','Teens')],['adult',T('Adultez','Adults')]];
    var key='ig42-stage';var current='all';try{current=root.sessionStorage.getItem(key)||'all';}catch(e){}
    stages.forEach(function(s){var b=btn(s[1],'ig42-segment');b.dataset.stage=s[0];b.setAttribute('aria-pressed',String(current===s[0]));b.addEventListener('click',function(){current=s[0];try{root.sessionStorage.setItem(key,current);}catch(e){}qa('button',group).forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});updateStageBrief(study,current);});group.appendChild(b);});
    wrap.appendChild(group);return wrap;
  }
  function updateStageBrief(study,stage){
    var out=q('#ig42-stage-brief');if(!out||!study)return;var pd=pathData(study.id);var item=pd&&pd[stage];
    if(!item&&pd)item=pd.all;if(!item){out.textContent=T('Crea libremente o abre el panel Reto cuando quieras.','Create freely or open the Challenge panel whenever you want.');return;}
    out.textContent=item[lang()]||item.es||'';
  }

  function createTopbar(main,app,study){
    var top=el('div','ig42-topbar');
    var left=el('div','ig42-topbar-left'),back=D.createElement('a');back.className='ig42-back';back.href=lang()==='en'?'/en/workshop/':'/es/taller/';back.textContent='← '+T('Taller','Workshop');left.appendChild(back);
    var title=el('div','ig42-titleblock'),name=el('strong','ig42-study-name',study?study.title[lang()]:(q('#igt-title')?q('#igt-title').textContent:T('Estudio','Studio'))),state=el('span','ig42-save-state',T('Cambios locales','Local changes'));title.appendChild(name);title.appendChild(state);left.appendChild(title);top.appendChild(left);
    var center=el('div','ig42-topbar-center'),mode=el('div','ig42-mode');mode.setAttribute('role','group');mode.setAttribute('aria-label',T('Modo de trabajo','Working mode'));
    var free=btn(T('Libre','Free'),'ig42-mode-btn'),challenge=btn(T('Reto','Challenge'),'ig42-mode-btn');free.setAttribute('aria-pressed','true');challenge.setAttribute('aria-pressed','false');mode.appendChild(free);mode.appendChild(challenge);center.appendChild(mode);center.appendChild(stageSelector(study));top.appendChild(center);
    var actions=el('div','ig42-topbar-actions');
    var undo=btn('↶','ig42-icon-btn');undo.setAttribute('aria-label',T('Deshacer','Undo'));undo.title=T('Deshacer · Ctrl+Z','Undo · Ctrl+Z');
    var redo=btn('↷','ig42-icon-btn');redo.setAttribute('aria-label',T('Rehacer','Redo'));redo.title=T('Rehacer · Ctrl+Y','Redo · Ctrl+Y');
    var file=btn(T('Archivo','File'),'ig42-action-btn');var props=btn('⌘','ig42-icon-btn ig42-properties-btn');props.setAttribute('aria-label',T('Propiedades','Properties'));props.setAttribute('aria-expanded','false');var help=btn(T('Ayuda','Help'),'ig42-icon-btn');help.setAttribute('aria-label',T('Ayuda','Help'));help.textContent='?';
    actions.appendChild(undo);actions.appendChild(redo);actions.appendChild(file);actions.appendChild(props);actions.appendChild(help);top.appendChild(actions);
    main.insertBefore(top,app);
    return {node:top,undo:undo,redo:redo,free:free,challenge:challenge,file:file,props:props,help:help,state:state};
  }

  function moveSourceSections(helpBody){
    var selectors=['.igt-hero','.igt-sec[aria-labelledby="igt-how"]','.igt-sec[aria-labelledby="igt-x0"]','.igt-sec[aria-labelledby="igt-files"]','nav.igt-sec'];
    selectors.forEach(function(s){qa(s).forEach(function(sec){if(sec.closest('.ig42-dialog'))return;sec.classList.add('ig42-help-source');helpBody.appendChild(sec);});});
  }
  function buildRail(app){
    var rail=el('nav','ig42-toolrail');rail.setAttribute('aria-label',T('Herramientas del estudio','Studio tools'));rail.tabIndex=-1;
    var originalTools=qa('.igt-side button[aria-pressed],.igt-r40-controls button[aria-pressed],.igt-r40-controls button,.igt-tabs button',app).slice(0,12);
    var seen={};originalTools.forEach(function(source){var label=(source.getAttribute('aria-label')||source.textContent||'').trim();if(!label||seen[label])return;seen[label]=1;var b=btn(label.charAt(0).toUpperCase(),'ig42-tool-shortcut');b.title=label;b.setAttribute('aria-label',label);b.setAttribute('aria-pressed',source.getAttribute('aria-pressed')||'false');b.addEventListener('click',function(){safeClick(source);sync();});rail.appendChild(b);function sync(){b.setAttribute('aria-pressed',source.getAttribute('aria-pressed')||'false');}});
    if(!rail.children.length){var b=el('span','ig42-tool-placeholder','✦');b.setAttribute('aria-hidden','true');rail.appendChild(b);}return rail;
  }
  function createInspector(){var aside=el('aside','ig42-inspector');aside.setAttribute('aria-label',T('Propiedades','Properties'));var head=el('div','ig42-inspector-head'),h=el('h2','ig42-panel-title',T('Propiedades','Properties')),close=btn('×','ig42-inspector-close');close.setAttribute('aria-label',T('Cerrar propiedades','Close properties'));head.appendChild(h);head.appendChild(close);aside.appendChild(head);var body=el('div','ig42-inspector-body');aside.appendChild(body);return {node:aside,body:body,close:close};}
  function populateInspector(app,inspector){
    var side=q('.igt-side',app);if(side){inspector.body.appendChild(side);return;}
    var tool=q('.igt-r40-tool',app);if(!tool)return;
    var controls=q('.igt-r40-controls',tool);if(controls)inspector.body.appendChild(controls);
    var direct=Array.prototype.slice.call(tool.children);direct.forEach(function(ch){if(ch===controls||ch.matches(WORK_SELECTOR)||ch.classList.contains('ig42-engine-work'))return;if(ch.tagName==='BUTTON'&&/guardar|save|imprimir|print|escuchar|play|parar|stop/i.test(ch.textContent||''))return;if(ch.matches('.igt-r40-field,.igt-r40-palette,.igt-r40-result,textarea,input,select'))inspector.body.appendChild(ch);});
  }
  function mainWork(app){return q('.igt-stage',app)||q(WORK_SELECTOR,app)||q('.igt-r40-tool',app)||app;}
  function workspaceShell(app){
    var shell=el('section','ig42-workspace');shell.setAttribute('aria-label',T('Espacio de trabajo','Workspace'));
    var rail=buildRail(app),center=el('div','ig42-workspace-center'),ins=createInspector();
    shell.appendChild(rail);shell.appendChild(center);shell.appendChild(ins.node);return {node:shell,rail:rail,center:center,inspector:ins};
  }
  function mirrorInspector(app,ins){populateInspector(app,ins);}

  function extractProjectBar(app,fileBody,top){
    var bars=qa('.igt-bar',app);var project=null;
    for(var i=0;i<bars.length;i++){if(/Deshacer|Undo/.test(bars[i].textContent||'')){project=bars[i];break;}}
    if(!project)return;
    var ub=findButton(project,/Deshacer|Undo/i),rb=findButton(project,/Rehacer|Redo/i);top.undo.onclick=function(){safeClick(ub);};top.redo.onclick=function(){safeClick(rb);};
    if(!project.dataset.ig42Extracted){qa('button',project).forEach(function(b){var txt=(b.textContent||'').trim();if(/Deshacer|Undo|Rehacer|Redo|colecci|collection|progreso|progress|Guardados|Saved projects/i.test(txt))return;var clone=btn(txt,'ig42-menu-action');clone.addEventListener('click',function(){safeClick(b);if(/Guardar|Save/i.test(txt))top.state.textContent=T('Guardado','Saved');});fileBody.appendChild(clone);});project.dataset.ig42Extracted='true';}
    project.classList.add('ig42-original-projectbar');project.hidden=true;
  }
  function extractChallenges(app,body,top,study){
    var c=q('.igt-retos',app);if(c&&!body.contains(c)){body.appendChild(c);c.classList.add('ig42-challenge-content');}
    if(!q('#ig42-stage-brief',body)){var stage=el('section','ig42-stage-brief-wrap');stage.appendChild(el('h3','',T('Sugerencia para esta etapa','Suggestion for this stage')));var p=el('p','');p.id='ig42-stage-brief';stage.appendChild(p);body.insertBefore(stage,body.firstChild);}
    updateStageBrief(study,(function(){try{return root.sessionStorage.getItem('ig42-stage')||'all';}catch(e){return'all';}})());
  }
  function makeManagementButton(main){
    var b=btn(T('Mi colección y proyectos','My collection and projects'),'ig42-manage-btn');var dlg=createDialog('ig42-manage',T('Mi colección y proyectos','My collection and projects'));wireDialogClose(dlg);b.addEventListener('click',function(){var body=q('.ig42-dialog-body',dlg);if(!body.dataset.loaded){var old=q('#igt-local-summary');if(old){body.appendChild(old);old.hidden=false;old.classList.add('ig42-local-summary');}else{var app=q('#igt-app'),found=0;qa('.igt-bar button',app).forEach(function(source){var txt=(source.textContent||'').trim();if(!/colecci|collection|progreso|progress|Guardados|Saved projects/i.test(txt))return;var proxy=btn(txt,'ig42-menu-action');proxy.addEventListener('click',function(){safeClick(source);});body.appendChild(proxy);found++;});if(!found)body.appendChild(el('p','ig42-empty',T('Todavía no hay datos locales que gestionar.','There is no local data to manage yet.')));}body.dataset.loaded='true';}showDialog(dlg,b);});
    var top=q('.ig42-topbar-actions',main);if(top)top.insertBefore(b,top.firstChild);return b;
  }

  function directManipulation(app){
    qa('.igt-r40-pixel,.igt-r40-floor,.igt-r40-world,.igt-r40-board,.igt-r40-sim,.igt-r40-game,.igt-r40-sequencer,.igt-r40-piano',app).forEach(function(grid){
      if(grid.dataset.ig42Drag)return;grid.dataset.ig42Drag='true';var down=false,last=null;
      grid.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('button');if(!b)return;down=true;last=b;});
      grid.addEventListener('pointerover',function(e){if(!down)return;var b=e.target.closest&&e.target.closest('button');if(!b||b===last)return;last=b;b.click();});
      grid.addEventListener('pointerup',function(){down=false;last=null;});grid.addEventListener('pointercancel',function(){down=false;last=null;});
    });
  }

  function bindFileSystemAccess(fileBody,app,study){
    if(fileBody.dataset.ig42Fs||(!root.showOpenFilePicker&&!root.showSaveFilePicker))return;fileBody.dataset.ig42Fs='true';var sep=el('hr','ig42-menu-sep');fileBody.appendChild(sep);
    var cap=el('p','ig42-capability',T('Guardado avanzado disponible en este navegador.','Advanced file saving is available in this browser.'));fileBody.appendChild(cap);
    if(root.showOpenFilePicker){var open=btn(T('Abrir con selector del sistema…','Open with system picker…'),'ig42-menu-action');open.addEventListener('click',async function(){try{var hs=await root.showOpenFilePicker({multiple:false,types:[{description:'Iris Green project',accept:{'application/json':['.json']}}]});var f=await hs[0].getFile();var text=await f.text();if(root.IGR40LocalData&&root.IGR40LocalData.validateImportText){var p=root.IGR40LocalData.validateImportText(text,study&&study.id);await root.IGR40LocalData.service.commitImport(p);if(root.IGT&&root.IGT.say)root.IGT.say(T('Proyecto importado.','Project imported.'));}}catch(e){if(e&&e.name!=='AbortError'&&root.IGT)root.IGT.say(T('No se pudo abrir el archivo.','The file could not be opened.'));}});fileBody.appendChild(open);}
  }

  function enhanceStudy(){
    var app=q('#igt-app'),main=q('main#main');if(!app||!main||main.dataset.ig42Mounted)return false;main.dataset.ig42Mounted='true';main.classList.add('ig42-active');ensureCss();var study=studyFromApp(app);
    var top=createTopbar(main,app,study),challengeDlg=createDialog('ig42-challenge',T('Reto','Challenge')),fileDlg=createDialog('ig42-file',T('Archivo','File')),helpDlg=createDialog('ig42-help',T('Ayuda','Help'));wireDialogClose(challengeDlg);wireDialogClose(fileDlg);wireDialogClose(helpDlg);
    top.free.addEventListener('click',function(){var sel=q('#igt-reto-sel');if(sel){sel.value='';sel.dispatchEvent(new Event('change',{bubbles:true}));}top.free.setAttribute('aria-pressed','true');top.challenge.setAttribute('aria-pressed','false');});
    top.challenge.addEventListener('click',function(){top.free.setAttribute('aria-pressed','false');top.challenge.setAttribute('aria-pressed','true');showDialog(challengeDlg,top.challenge);});top.file.addEventListener('click',function(){showDialog(fileDlg,top.file);});top.help.addEventListener('click',function(){showDialog(helpDlg,top.help);});
    ['input','change'].forEach(function(ev){app.addEventListener(ev,function(){top.state.textContent=T('Sin guardar','Unsaved');},{passive:true});});
    var ws=workspaceShell(app);app.parentNode.insertBefore(ws.node,app);ws.center.appendChild(app);
    function setInspector(open){ws.node.classList.toggle('ig42-inspector-open',!!open);top.props.setAttribute('aria-expanded',String(!!open));if(open){var first=q('button,input,select,textarea,[tabindex]',ws.inspector.body);if(first)first.focus();}}
    top.props.addEventListener('click',function(){setInspector(!ws.node.classList.contains('ig42-inspector-open'));});ws.inspector.close.addEventListener('click',function(){setInspector(false);top.props.focus();});
    ws.node.addEventListener('keydown',function(e){if(e.key==='Escape'&&ws.node.classList.contains('ig42-inspector-open')){setInspector(false);top.props.focus();}});
    moveSourceSections(q('.ig42-dialog-body',helpDlg));makeManagementButton(main);
    var tries=0;function settle(){tries++;extractProjectBar(app,q('.ig42-dialog-body',fileDlg),top);extractChallenges(app,q('.ig42-dialog-body',challengeDlg),top,study);mirrorInspector(app,ws.inspector);directManipulation(app);bindFileSystemAccess(q('.ig42-dialog-body',fileDlg),app,study);if(ws.rail.querySelector('.ig42-tool-placeholder')&&(q('.igt-r40-controls',app)||q('.igt-side button',app)||q('.igt-tabs',app))){var nr=buildRail(app);ws.node.replaceChild(nr,ws.rail);ws.rail=nr;}if((!q('.igt-r40-tool',app)&&!q('.igt-work',app))&&tries<20){root.setTimeout(settle,80);return;}root.setTimeout(function(){directManipulation(app);},120);}
    root.setTimeout(settle,0);return true;
  }

  function microPreview(study){var p=D.createElement('canvas');p.className='ig42-micro';p.width=208;p.height=136;p.setAttribute('role','img');p.setAttribute('aria-label',T('Previsualización de la herramienta','Tool preview'));var x=p.getContext('2d'),n=study&&study.number||1;x.fillStyle='#eef4fb';x.fillRect(0,0,208,136);x.strokeStyle='#17395c';x.fillStyle='#7457c7';x.lineWidth=5;
    if(n===1){x.beginPath();x.moveTo(18,100);x.bezierCurveTo(48,18,104,120,188,30);x.stroke();x.fillRect(30,24,32,32);}
    else if(n===7){x.beginPath();x.moveTo(18,106);x.lineTo(62,58);x.lineTo(104,106);x.lineTo(146,58);x.lineTo(190,106);x.stroke();x.beginPath();x.moveTo(18,106);x.lineTo(190,106);x.stroke();}
    else if(n===12){for(var i=0;i<4;i++){x.fillStyle=i%2?'#2f80ed':'#7457c7';x.fillRect(22+i*34,26+i*18,70,18);}x.strokeStyle='#17395c';x.beginPath();x.moveTo(154,112);x.lineTo(184,82);x.stroke();}
    else if(n===16){for(var r=0;r<3;r++)for(var c0=0;c0<8;c0++){x.fillStyle=(c0+r*2)%4===0?'#2f80ed':'#d8e0e9';x.fillRect(14+c0*23,24+r*30,16,16);}}
    else if(n===19){x.fillStyle='#17395c';for(var l=0;l<5;l++)x.fillRect(22,25+l*20,160-(l%2)*36,5);x.fillStyle='#7457c7';x.fillRect(22,112,72,7);}
    else{x.fillStyle='#b7d9ef';x.fillRect(18,18,172,100);x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(75,18);x.lineTo(75,118);x.moveTo(132,18);x.lineTo(132,118);x.moveTo(18,51);x.lineTo(190,51);x.moveTo(18,85);x.lineTo(190,85);x.stroke();}
    return p;}
  function recentProjects(host){
    if(!root.IGR40LocalData||!root.IGR40LocalData.service)return;root.IGR40LocalData.service.listProjects().then(function(ps){if(!ps||!ps.length)return;var sec=el('section','ig42-continue'),h=el('h2','',T('Continuar','Continue')),row=el('div','ig42-continue-row');sec.appendChild(h);sec.appendChild(row);ps.slice(0,4).forEach(function(p){var s=catalogue().find?catalogue().find(function(x){return x.id===p.project_type;}):null;if(!s)return;var a=D.createElement('a');a.className='ig42-project-card';a.href=lang()==='en'?'/en/workshop/'+s.slugs.en+'/':'/es/taller/'+s.slugs.es+'/';a.appendChild(el('strong','',p.title||s.title[lang()]));a.appendChild(el('span','',s.title[lang()]+' · r'+p.revision));row.appendChild(a);});host.insertBefore(sec,host.firstChild);}).catch(function(){});
  }
  function enhanceLauncher(){
    var old=q('#igt-taller-index'),main=q('main#main');if(!old||!main||main.dataset.ig42Launcher)return false;main.dataset.ig42Launcher='true';main.classList.add('ig42-launcher-page');ensureCss();old.hidden=true;
    var rootNode=el('section','ig42-launcher'),toolbar=el('div','ig42-launcher-toolbar'),search=D.createElement('input');search.type='search';search.placeholder=T('Buscar estudio o herramienta','Search studios or tools');search.className='ig42-search';search.setAttribute('aria-label',search.placeholder);toolbar.appendChild(search);var manage=btn(T('Mi colección / Proyectos','My collection / Projects'),'ig42-manage-btn');toolbar.appendChild(manage);rootNode.appendChild(toolbar);rootNode.appendChild(stageSelector(null));
    var areas=[];catalogue().forEach(function(s){var name=s.area[lang()];var a=areas.find?areas.find(function(x){return x.name===name;}):null;if(!a){a={name:name,items:[]};areas.push(a);}a.items.push(s);});
    var grid=el('div','ig42-area-grid');areas.forEach(function(area){var card=el('section','ig42-area-card'),head=el('div','ig42-area-head'),title=el('h2','',area.name);head.appendChild(title);head.appendChild(microPreview(area.items[0]));card.appendChild(head);var links=el('div','ig42-featured');area.items.slice(0,4).forEach(function(s){var a=D.createElement('a');a.href=lang()==='en'?'/en/workshop/'+s.slugs.en+'/':'/es/taller/'+s.slugs.es+'/';a.dataset.search=(s.title.es+' '+s.title.en+' '+s.tool.es+' '+s.tool.en).toLowerCase();a.textContent=s.title[lang()];links.appendChild(a);});card.appendChild(links);var more=btn(T('Ver todos','View all'),'ig42-view-all');more.addEventListener('click',function(){var list=card.querySelector('.ig42-all-studios');list.hidden=!list.hidden;more.setAttribute('aria-expanded',String(!list.hidden));});more.setAttribute('aria-expanded','false');card.appendChild(more);var list=el('div','ig42-all-studios');list.hidden=true;area.items.slice(4).forEach(function(s){var a=D.createElement('a');a.href=lang()==='en'?'/en/workshop/'+s.slugs.en+'/':'/es/taller/'+s.slugs.es+'/';a.dataset.search=(s.title.es+' '+s.title.en+' '+s.tool.es+' '+s.tool.en).toLowerCase();a.textContent=s.title[lang()];list.appendChild(a);});card.appendChild(list);grid.appendChild(card);});rootNode.appendChild(grid);main.insertBefore(rootNode,old);
    search.addEventListener('input',function(){var needle=search.value.trim().toLowerCase();qa('.ig42-area-card',grid).forEach(function(card){var links=qa('a',card),visible=0;links.forEach(function(a){var ok=!needle||String(a.dataset.search||a.textContent).indexOf(needle)>=0;a.hidden=!ok;if(ok)visible++;});card.hidden=visible===0;});});
    var dlg=createDialog('ig42-launcher-manage',T('Mi colección y proyectos','My collection and projects'));wireDialogClose(dlg);manage.addEventListener('click',function(){var body=q('.ig42-dialog-body',dlg);if(!body.dataset.loaded){var oldSummary=q('#igt-local-summary');if(oldSummary){body.appendChild(oldSummary);oldSummary.hidden=false;oldSummary.classList.add('ig42-local-summary');}else body.appendChild(el('p','ig42-empty',T('Todavía no hay proyectos guardados.','There are no saved projects yet.')));body.dataset.loaded='true';}showDialog(dlg,manage);});recentProjects(rootNode);return true;
  }

  function autoMount(){function go(){ensureCss();enhanceLauncher();enhanceStudy();}if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',go,{once:true});else root.setTimeout(go,0);}
  return {autoMount:autoMount,enhanceStudy:enhanceStudy,enhanceLauncher:enhanceLauncher,directManipulation:directManipulation};
});
