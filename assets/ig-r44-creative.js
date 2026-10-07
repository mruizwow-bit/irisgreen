/* R44: progressive workshop entry. Keeps the existing editors and file format. */
(function () {
 'use strict';
 if (document.body.dataset.igR44Creative !== 'true') return;
 const en=document.documentElement.lang==='en';
 const text=(es,eng)=>en?eng:es;
 function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);return b;}
 function mount(){
  const app=document.getElementById('igt-app'), api=app&&app.igCreative;
  if(!api||app.dataset.r44Entry==='true')return;
  
  const shell=document.querySelector('.ig-r42-shell');
  if(!shell)return;
  app.dataset.r44Entry='true';
  shell.classList.add('r44-creative');
  const code=app.querySelector('.igs-code');
  if(code && api.ctx.viewport.parentNode===code.parentNode)code.parentNode.insertBefore(api.ctx.viewport,code);
  const dock=document.createElement('div');dock.className='r44-dock';dock.setAttribute('aria-label',text('Crear','Create'));
  const undo=document.querySelector('.igs-undo'),redo=document.querySelector('.igs-redo');
  if(undo)dock.append(undo);if(redo)dock.append(redo);
  const menu=document.getElementById('ig-r42-file-menu');
  const options=document.createElement('details');options.className='r44-options';
  const summary=document.createElement('summary');summary.textContent=text('Opciones','Options');options.append(summary);
  const panel=document.createElement('div');panel.className='r44-options-body';options.append(panel);
  if(menu){menu.removeAttribute('popover');menu.hidden=false;panel.append(menu);}
  document.querySelectorAll('.ig-r42-top-actions > button').forEach(b=>panel.append(b));
  document.querySelectorAll('.ig-r42-file-trigger').forEach(b=>b.remove());
  const motionLabel=document.createElement('label');motionLabel.textContent=text('Movimiento','Motion');
  const motion=document.createElement('select');motion.setAttribute('aria-label',motionLabel.textContent);
  [['normal',text('Normal','Normal')],['reduced',text('Reducido','Reduced')],['off',text('Sin movimiento','No motion')]].forEach(([v,t])=>motion.add(new Option(t,v)));
  motion.value=matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':(document.documentElement.dataset.igMotion||'normal');
  motion.addEventListener('change',()=>{document.documentElement.dataset.igMotion=motion.value;window.dispatchEvent(new CustomEvent('ig:motion-change',{detail:{mode:motion.value}}));api.ctx.announce(motion.options[motion.selectedIndex].text);});
  motionLabel.append(motion);panel.append(motionLabel);dock.append(options);
  const workspace=document.querySelector('.ig-r42-workspace');workspace.append(dock);
  const toggle=document.querySelector('.ig-r42-inspector');if(toggle)toggle.dataset.collapsed='true';
  shell.dataset.inspector='closed';
  panel.querySelectorAll('[aria-expanded]').forEach(b=>b.setAttribute('aria-expanded','false'));
  const structure=app.querySelector('.igs-structure');
  if(structure){structure.dataset.open='false';const st=structure.querySelector('.igs-structure-toggle');if(st){st.setAttribute('aria-expanded','false');st.setAttribute('aria-label',text('Capas y piezas','Layers and pieces'));}dock.prepend(structure);}
  document.querySelectorAll('.ig-r42-rail').forEach(x=>x.hidden=true);
  const invitation=document.createElement('details');invitation.className='r44-invitations';
  const title=document.createElement('summary');title.textContent=text('¿Y si pruebas…?','What if you try…?');invitation.append(title);
  const choices=document.createElement('div');invitation.append(choices);dock.prepend(invitation);
  const dataEl=document.getElementById('r44-invitations');let entries=[];try{entries=JSON.parse(dataEl.textContent);}catch(_){return;}
  entries.filter(r=>r.start).forEach(r=>{choices.append(button(en?r.en:r.es,()=>{
   api.replaceProject(()=>api.engine.start(r.start),en?r.en:r.es);
   app.dataset.r44Invitation=r.id;invitation.open=false;api.ctx.viewport.focus();
  }));});
  const requested=new URLSearchParams(location.search).get('invitation');
  const chosen=entries.find(r=>r.id===requested && r.start);
  if(chosen){api.replaceProject(()=>api.engine.start(chosen.start),en?chosen.en:chosen.es);app.dataset.r44Invitation=chosen.id;}
  // The action is the real existing tool, never an overlay pretending to edit.
  app.querySelectorAll('.igs-toolbar button').forEach(b=>{if(!b.disabled && b.offsetParent!==null && !b.dataset.tool && !b.classList.contains('igs-more'))b.dataset.r44Action='true';});
 }
 document.addEventListener('igs:ready',mount);mount();
})();
