/* Prisma A8 · initializes Sky and Space shell from same-origin local contract. */
(function(){
'use strict';
const root=document.getElementById('space-section-shell');if(!root||!window.IGSpaceSectionShell)return;
const lang=(root.dataset.lang||document.documentElement.lang||'es').toLowerCase().startsWith('en')?'en':'es';
fetch('/assets/data/space-section-shell.'+lang+'.json',{credentials:'same-origin',cache:'no-store'})
 .then(r=>{if(!r.ok)throw new Error('SPACE_SHELL_HTTP_'+r.status);return r.json()})
 .then(data=>{
   if(data?.schema!=='iris-green/space-section-shell/v1'||!Array.isArray(data.entries)||data.entries.length!==5)throw new Error('SPACE_SHELL_DATA');
   window.__SPACE_SECTION_SHELL=IGSpaceSectionShell.mount(root,{lang,theme:'light',items:data.entries});
 })
 .catch(err=>{root.dataset.error='true';console.error(err)});
})();
