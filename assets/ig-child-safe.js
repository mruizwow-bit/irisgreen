/* Iris Green · Child Safety R01 P0.
   Restricted full content is not a public browser capability.
   AGE_18_PLUS is only an age-band claim, never adult-access authorization. */
(function(){
'use strict';
function clearRestrictedActions(root){
 root=root||document;
 root.querySelectorAll('[data-ig-s2-actions],[data-ig-research-s2-actions]').forEach(function(holder){
  holder.replaceChildren();
  holder.removeAttribute('data-ig-actions-key');
 });
}
function start(){
 clearRestrictedActions(document);
 new MutationObserver(function(){clearRestrictedActions(document);}).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('ig:audience-change',function(){clearRestrictedActions(document);});
 new MutationObserver(function(){clearRestrictedActions(document);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();