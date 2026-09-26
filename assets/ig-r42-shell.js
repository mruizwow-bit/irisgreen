/* Iris Green R42 · app shell común.
   HTML semántico primero; esta capa reorganiza solo el piloto R42 y conserva el fallback original. */
(function (window, document) {
  'use strict';
  if (window.IGR42Shell || !document.body || document.body.dataset.igR42Pilot !== 'true') return;

  var lang = String(document.documentElement.lang || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var family = document.body.dataset.igR42Family || '';
  var T = {
    es: {
      back:'Volver', work:'Trabajo', panel:'Panel', help:'Ayuda', actions:'Acciones',
      ready:'Listo', dirty:'Sin guardar', saved:'Guardado', error:'Hay un problema',
      inspector:'Panel contextual', inspectorHint:'Las opciones cambian según lo que estés usando.',
      close:'Cerrar', commandTitle:'Acciones', commandLabel:'Buscar una acción',
      commandHint:'Escribe para filtrar acciones.', noActions:'No hay acciones con ese nombre.',
      focusWork:'Ir al área de trabajo', openPanel:'Abrir panel contextual', openHelp:'Abrir ayuda',
      file:'Archivo', workshop:'El taller', games:'Juegos', interests:'Tus intereses',
      quiet:'Rincón tranquilo', shell:'Espacio de trabajo'
    },
    en: {
      back:'Back', work:'Work', panel:'Panel', help:'Help', actions:'Actions',
      ready:'Ready', dirty:'Unsaved', saved:'Saved', error:'There is a problem',
      inspector:'Context panel', inspectorHint:'Options change depending on what you are using.',
      close:'Close', commandTitle:'Actions', commandLabel:'Find an action',
      commandHint:'Type to filter actions.', noActions:'No actions match that name.',
      focusWork:'Go to workspace', openPanel:'Open context panel', openHelp:'Open help',
      file:'File', workshop:'The workshop', games:'Games', interests:'Your interests',
      quiet:'Quiet space', shell:'Workspace'
    }
  }[lang];

  var CONFIG = {
    workshop: {
      stage:'#igt-app', title:'#igt-title', hero:'.igt-hero',
      back:lang === 'en' ? '/en/workshop/' : '/es/taller/', eyebrow:T.workshop
    },
    games: {
      stage:'#jg-app', title:'#jg-h1', hero:'#jg-hero',
      back:lang === 'en' ? '/en/resources/' : '/es/recursos/', eyebrow:T.games
    },
    interests: {
      stage:'.ig-afondo', title:'main h1', hero:null,
      back:lang === 'en' ? '/en/' : '/es/', eyebrow:T.interests
    },
    quiet: {
      stage:'#r40Workspace', title:'.xhero h1', hero:'.xhero',
      context:'.r40-mode-nav',
      back:lang === 'en' ? '/en/' : '/es/', eyebrow:T.quiet
    }
  }[family];

  if (!CONFIG) return;

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (key) {
      var value = attrs[key];
      if (value === null || value === undefined || value === false) return;
      if (key === 'text') el.textContent = String(value);
      else if (key === 'class') el.className = String(value);
      else if (key === 'on') Object.keys(value).forEach(function (name) { el.addEventListener(name, value[name]); });
      else if (key in el && key !== 'list') {
        try { el[key] = value; } catch (_) { el.setAttribute(key, value === true ? '' : String(value)); }
      } else {
        el.setAttribute(key, value === true ? '' : String(value));
      }
    });
    for (var i = 2; i < arguments.length; i += 1) append(el, arguments[i]);
    return el;
  }

  function append(parent, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) {
      child.forEach(function (item) { append(parent, item); });
      return;
    }
    parent.appendChild(child && child.nodeType ? child : document.createTextNode(String(child)));
  }

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
  }

  function isEditable(node) {
    return !!(node && (node.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(node.tagName)));
  }

  function motionOK() {
    return !!document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function transition(work) {
    if (!motionOK()) {
      work();
      return;
    }
    try { document.startViewTransition(work); } catch (_) { work(); }
  }

  function openDialog(dialog, trigger) {
    if (!dialog) return;
    dialog._igTrigger = trigger || document.activeElement;
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.hidden = false;
      dialog.setAttribute('open', '');
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      var first = dialog.querySelector('button,input,select,textarea,a[href]');
      if (first) first.focus();
    }
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    var trigger = dialog._igTrigger;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else {
      dialog.hidden = true;
      dialog.removeAttribute('open');
    }
    if (trigger && trigger.isConnected && typeof trigger.focus === 'function') {
      try { trigger.focus({ preventScroll:true }); } catch (_) { trigger.focus(); }
    }
  }

  function dialogFrame(title) {
    var dialog = h('dialog', { class:'ig-r42-dialog' });
    var heading = h('h2', { text:title });
    var close = h('button', {
      type:'button', class:'ig-r42-icon-button', text:'×',
      'aria-label':T.close, on:{ click:function () { closeDialog(dialog); } }
    });
    var head = h('div', { class:'ig-r42-dialog-head' }, heading, close);
    var body = h('div', { class:'ig-r42-dialog-body' });
    dialog.appendChild(head);
    dialog.appendChild(body);
    dialog.addEventListener('cancel', function (event) {
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener('close', function () {
      var trigger = dialog._igTrigger;
      if (trigger && trigger.isConnected && typeof trigger.focus === 'function') {
        try { trigger.focus({ preventScroll:true }); } catch (_) { trigger.focus(); }
      }
    });
    document.body.appendChild(dialog);
    return { dialog:dialog, body:body, heading:heading };
  }

  var main = document.querySelector('main');
  var stageSource = document.querySelector(CONFIG.stage);
  var titleSource = document.querySelector(CONFIG.title);
  if (!main || !stageSource || !titleSource) {
    document.body.dataset.igR42Mount = 'missing-source';
    return;
  }

  var title = String(titleSource.textContent || CONFIG.eyebrow).trim();
  var shell = h('section', {
    class:'ig-r42-shell',
    'data-family':family,
    'aria-label':T.shell
  });
  var topbar = h('header', { class:'ig-r42-topbar' });
  var back = h('a', { class:'ig-r42-back', href:CONFIG.back },
    h('span', { 'aria-hidden':'true', text:'←' }),
    h('span', { text:T.back })
  );
  var titleBlock = h('div', { class:'ig-r42-titleblock' },
    h('p', { class:'ig-r42-eyebrow', text:CONFIG.eyebrow }),
    h('h1', { class:'ig-r42-title', text:title })
  );
  var topActions = h('div', { class:'ig-r42-top-actions' });
  var status = h('div', {
    class:'ig-r42-project-status',
    role:'status',
    'aria-live':'polite',
    'data-state':'ready',
    text:T.ready
  });

  var actionButton = h('button', { type:'button', class:'ig-r42-action', text:T.actions });
  var panelButton = h('button', { type:'button', class:'ig-r42-action', text:T.panel, 'aria-expanded':'true' });
  var helpButton = h('button', { type:'button', class:'ig-r42-action', text:T.help });
  topActions.appendChild(actionButton);
  topActions.appendChild(panelButton);
  topActions.appendChild(helpButton);
  topActions.appendChild(status);
  topbar.appendChild(back);
  topbar.appendChild(titleBlock);
  topbar.appendChild(topActions);

  var context = h('div', { class:'ig-r42-context', role:'region', 'aria-label':lang === 'en' ? 'Context controls' : 'Controles de contexto' });
  var body = h('div', { class:'ig-r42-body' });
  var rail = h('div', { class:'ig-r42-rail', role:'toolbar', 'aria-label':lang === 'en' ? 'Workspace tools' : 'Herramientas del espacio' });
  var workspace = h('div', { class:'ig-r42-workspace' });
  var stage = h('div', { class:'ig-r42-stage', tabindex:'-1' });
  var inspector = h('aside', { class:'ig-r42-inspector', 'data-collapsed':'false', 'aria-labelledby':'ig-r42-inspector-title' });
  var inspectorClose = h('button', { type:'button', class:'ig-r42-icon-button', text:'×', 'aria-label':T.close });
  var inspectorHead = h('div', { class:'ig-r42-inspector-head' },
    h('h2', { id:'ig-r42-inspector-title', text:T.inspector }),
    inspectorClose
  );
  var inspectorBody = h('div', { class:'ig-r42-inspector-body' },
    h('p', { class:'ig-r42-inspector-hint', text:T.inspectorHint })
  );
  inspector.appendChild(inspectorHead);
  inspector.appendChild(inspectorBody);

  var workRail = h('button', { type:'button', 'aria-pressed':'true' },
    h('span', { class:'ig-r42-glyph', 'aria-hidden':'true', text:'▣' }),
    h('span', { text:T.work })
  );
  var inspectRail = h('button', { type:'button', 'aria-pressed':'false' },
    h('span', { class:'ig-r42-glyph', 'aria-hidden':'true', text:'◫' }),
    h('span', { text:T.panel })
  );
  var helpRail = h('button', { type:'button', 'aria-pressed':'false' },
    h('span', { class:'ig-r42-glyph', 'aria-hidden':'true', text:'?' }),
    h('span', { text:T.help })
  );
  rail.appendChild(workRail);
  rail.appendChild(inspectRail);
  rail.appendChild(helpRail);

  stage.appendChild(stageSource);
  workspace.appendChild(stage);
  body.appendChild(rail);
  body.appendChild(workspace);
  body.appendChild(inspector);
  shell.appendChild(topbar);
  shell.appendChild(context);
  shell.appendChild(body);
  main.insertBefore(shell, main.firstChild);

  /* The shell owns the visible page heading. Preserve source content as secondary/help. */
  if (titleSource !== titleBlock.querySelector('h1')) titleSource.hidden = true;

  var helpFrame = dialogFrame(T.help);
  var helpSource = CONFIG.hero ? document.querySelector(CONFIG.hero) : null;
  if (helpSource && helpSource !== shell && !helpSource.contains(shell)) {
    helpSource.classList.add('ig-r42-help-source');
    var sourceH1 = helpSource.querySelector('h1');
    if (sourceH1) sourceH1.hidden = true;
    helpFrame.body.appendChild(helpSource);
  } else {
    helpFrame.body.appendChild(h('p', { text:family === 'interests'
      ? (lang === 'en' ? 'Choose a topic in the workspace. More options appear only when you need them.' : 'Elige un tema en el espacio principal. Las opciones aparecen solo cuando las necesitas.')
      : T.inspectorHint
    }));
  }

  if (family === 'workshop') {
    var howHeading = document.getElementById('igt-how');
    var howSection = howHeading && howHeading.closest('section');
    if (howSection && howSection.isConnected) helpFrame.body.appendChild(howSection);
  }

  var modeContext = CONFIG.context ? document.querySelector(CONFIG.context) : null;
  if (modeContext && modeContext.isConnected) context.appendChild(modeContext);

  var inspectorHome = document.createComment('ig-r42-inspector-home');
  body.insertBefore(inspectorHome, inspector);
  var inspectorFrame = dialogFrame(T.inspector);

  function isCompact() {
    return shell.getBoundingClientRect().width <= 1024;
  }

  function restoreInspectorHome() {
    if (inspector.parentNode !== body) {
      body.insertBefore(inspector, inspectorHome.nextSibling);
    }
  }

  inspectorFrame.dialog.addEventListener('close', restoreInspectorHome);

  function openInspector(trigger) {
    if (isCompact()) {
      inspector.setAttribute('data-collapsed', 'false');
      inspectorFrame.body.appendChild(inspector);
      openDialog(inspectorFrame.dialog, trigger);
      panelButton.setAttribute('aria-expanded', 'true');
      inspectRail.setAttribute('aria-pressed', 'true');
      return;
    }
    transition(function () {
      var collapsed = inspector.getAttribute('data-collapsed') === 'true';
      inspector.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
      panelButton.setAttribute('aria-expanded', String(collapsed));
      inspectRail.setAttribute('aria-pressed', String(collapsed));
    });
  }

  function focusWorkspace() {
    try { stage.focus({ preventScroll:false }); } catch (_) { stage.focus(); }
    workRail.setAttribute('aria-pressed', 'true');
    inspectRail.setAttribute('aria-pressed', 'false');
  }

  inspectorClose.addEventListener('click', function () {
    if (inspector.parentNode === inspectorFrame.body) closeDialog(inspectorFrame.dialog);
    else {
      inspector.setAttribute('data-collapsed', 'true');
      panelButton.setAttribute('aria-expanded', 'false');
      inspectRail.setAttribute('aria-pressed', 'false');
    }
  });

  var actions = [];
  function registerAction(id, label, description, run) {
    var found = actions.filter(function (item) { return item.id === id; })[0];
    if (found) {
      found.label = label;
      found.description = description || '';
      found.run = run;
    } else {
      actions.push({ id:id, label:label, description:description || '', run:run });
    }
    renderCommands('');
  }

  var commandFrame = dialogFrame(T.commandTitle);
  var commandLabel = h('label', { class:'ig-r42-command-search' },
    h('span', { text:T.commandLabel }),
    h('input', { type:'search', autocomplete:'off', placeholder:T.commandHint })
  );
  var commandInput = commandLabel.querySelector('input');
  var commandStatus = h('p', { class:'ig-r42-only-sr', role:'status', 'aria-live':'polite' });
  var commandList = h('ul', { class:'ig-r42-command-list' });
  commandFrame.body.appendChild(commandLabel);
  commandFrame.body.appendChild(commandStatus);
  commandFrame.body.appendChild(commandList);

  function renderCommands(query) {
    var q = normalize(query);
    while (commandList.firstChild) commandList.removeChild(commandList.firstChild);
    var visible = actions.filter(function (item) {
      return !q || normalize(item.label + ' ' + item.description).indexOf(q) !== -1;
    });
    visible.forEach(function (item) {
      var button = h('button', { type:'button' },
        h('span', { text:item.label }),
        item.description ? h('small', { text:item.description }) : null
      );
      button.addEventListener('click', function () {
        closeDialog(commandFrame.dialog);
        if (typeof item.run === 'function') item.run();
      });
      commandList.appendChild(h('li', null, button));
    });
    commandStatus.textContent = visible.length ? String(visible.length) : T.noActions;
  }

  commandInput.addEventListener('input', function () { renderCommands(commandInput.value); });
  commandFrame.dialog.addEventListener('close', function () {
    commandInput.value = '';
    renderCommands('');
  });

  function openCommands(trigger) {
    openDialog(commandFrame.dialog, trigger);
    window.setTimeout(function () {
      try { commandInput.focus({ preventScroll:true }); } catch (_) { commandInput.focus(); }
    }, 0);
  }

  function openHelp(trigger) {
    openDialog(helpFrame.dialog, trigger);
  }

  actionButton.addEventListener('click', function () { openCommands(actionButton); });
  panelButton.addEventListener('click', function () { openInspector(panelButton); });
  helpButton.addEventListener('click', function () { openHelp(helpButton); });
  workRail.addEventListener('click', focusWorkspace);
  inspectRail.addEventListener('click', function () { openInspector(inspectRail); });
  helpRail.addEventListener('click', function () { openHelp(helpRail); });

  registerAction('workspace', T.focusWork, CONFIG.eyebrow, focusWorkspace);
  registerAction('panel', T.openPanel, T.inspector, function () { openInspector(actionButton); });
  registerAction('help', T.openHelp, T.help, function () { openHelp(actionButton); });

  document.addEventListener('keydown', function (event) {
    if (!(event.ctrlKey || event.metaKey) || String(event.key).toLowerCase() !== 'k' || event.altKey || isEditable(event.target)) return;
    event.preventDefault();
    openCommands(document.activeElement);
  });

  function setStatus(state, text) {
    state = state || 'ready';
    status.dataset.state = state;
    status.textContent = text || (state === 'dirty' ? T.dirty : state === 'saved' ? T.saved : state === 'error' ? T.error : T.ready);
  }

  document.addEventListener('ig:project-dirty', function () { setStatus('dirty'); });
  document.addEventListener('ig:project-saved', function () { setStatus('saved'); });
  document.addEventListener('ig:project-opened', function () { setStatus('saved'); });
  document.addEventListener('ig:error', function (event) {
    setStatus('error', event && event.detail && event.detail.message ? String(event.detail.message) : T.error);
  });

  /* Workshop pilot: move contextual controls out of the canvas path after the studio mounts.
     Existing buttons/listeners are moved, not recreated. */
  function enhanceWorkshop() {
    if (family !== 'workshop' || stageSource.dataset.igR42Adapted === 'true') return false;
    var work = stageSource.querySelector('.igt-work');
    var side = stageSource.querySelector('.igt-side');
    var challenge = stageSource.querySelector(':scope > .igt-retos');
    var projectToolbar = stageSource.querySelector('.igt-topbar .igt-bar[role="toolbar"]');
    if (!work || !side || !projectToolbar) return false;

    stageSource.dataset.igR42Adapted = 'true';
    inspectorBody.textContent = '';
    if (challenge) inspectorBody.appendChild(challenge);
    inspectorBody.appendChild(side);

    var buttons = Array.prototype.slice.call(projectToolbar.querySelectorAll(':scope > button'));
    var immediate = [];
    var fileButtons = [];
    buttons.forEach(function (button, index) {
      if (index < 2) immediate.push(button);
      else fileButtons.push(button);
    });

    immediate.forEach(function (button) {
      button.classList.add('ig-r42-icon-button');
      context.appendChild(button);
    });

    if (fileButtons.length) {
      var fileTrigger = h('button', { type:'button', class:'ig-r42-action', text:T.file });
      var fileMenu = h('div', { class:'ig-r42-file-popover', id:'ig-r42-file-menu' });
      fileButtons.forEach(function (button) {
        button.classList.add('ig-r42-action');
        fileMenu.appendChild(button);
      });
      if (typeof fileMenu.showPopover === 'function') {
        fileMenu.setAttribute('popover', 'auto');
        fileTrigger.setAttribute('popovertarget', fileMenu.id);
      } else {
        fileMenu.hidden = true;
        fileTrigger.addEventListener('click', function () { fileMenu.hidden = !fileMenu.hidden; });
      }
      context.appendChild(fileTrigger);
      context.appendChild(fileMenu);
    }

    var oldTop = projectToolbar.closest('.igt-topbar');
    if (oldTop && !oldTop.querySelector('button')) oldTop.hidden = true;

    registerAction('file', T.file, title, function () {
      var trigger = context.querySelector('[popovertarget="ig-r42-file-menu"]');
      if (trigger) trigger.click();
      else {
        var fallback = document.getElementById('ig-r42-file-menu');
        if (fallback) fallback.hidden = false;
      }
    });
    return true;
  }

  if (family === 'workshop') {
    if (!enhanceWorkshop()) {
      var workshopObserver = new MutationObserver(function () {
        if (enhanceWorkshop()) workshopObserver.disconnect();
      });
      workshopObserver.observe(stageSource, { childList:true, subtree:true });
      window.setTimeout(function () { workshopObserver.disconnect(); }, 12000);
    }
  }

  if (family === 'games') {
    var search = stageSource.querySelector('input[type="search"]');
    if (search) registerAction('search-games', lang === 'en' ? 'Search games' : 'Buscar juegos', T.games, function () { search.focus(); });
    var gameObserver = new MutationObserver(function () {
      var q = stageSource.querySelector('input[type="search"]');
      if (q) registerAction('search-games', lang === 'en' ? 'Search games' : 'Buscar juegos', T.games, function () { q.focus(); });
      var gameHeading = stageSource.querySelector('#jg-h2');
      if (gameHeading) setStatus('ready', String(gameHeading.textContent || T.ready));
      else setStatus('ready');
    });
    gameObserver.observe(stageSource, { childList:true, subtree:true });
  }

  if (family === 'quiet' && modeContext) {
    registerAction('quiet-modes', lang === 'en' ? 'Choose quiet-space tool' : 'Elegir herramienta del Rincón', T.quiet, function () {
      var target = modeContext.querySelector('button,[role="tab"],select');
      if (target) target.focus();
    });
  }

  if (family === 'interests') {
    registerAction('explore', lang === 'en' ? 'Explore interests' : 'Explorar intereses', T.interests, focusWorkspace);
  }

  /* Keep page-level horizontal overflow from being introduced by the shell itself. */
  shell.querySelectorAll('img,svg,canvas,video').forEach(function (node) {
    if (!node.style.maxWidth) node.style.maxWidth = '100%';
  });

  document.body.dataset.igR42Mount = 'ready';

  window.IGR42Shell = {
    version:'R42-A3-1',
    shell:shell,
    family:family,
    setStatus:setStatus,
    registerAction:registerAction,
    openActions:openCommands,
    openHelp:openHelp,
    openInspector:openInspector,
    focusWorkspace:focusWorkspace,
    setInspector:function (content) {
      while (inspectorBody.firstChild) inspectorBody.removeChild(inspectorBody.firstChild);
      if (content && content.nodeType) inspectorBody.appendChild(content);
      else inspectorBody.appendChild(h('p', { class:'ig-r42-inspector-hint', text:String(content || T.inspectorHint) }));
    }
  };
})(window, document);
