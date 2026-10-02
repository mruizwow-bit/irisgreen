/* Iris Green 2026 · global LIGHT / DARK NAVY preference. DARK NAVY is the default. */
(function(){
'use strict';
if(window.IGTheme)return;
var KEY='ig-theme-2026',VALUES=['dark','light'],current='dark';
try{var saved=localStorage.getItem(KEY);if(VALUES.indexOf(saved)!==-1)current=saved;}catch(_){}
function apply(){document.documentElement.dataset.igTheme=current;document.documentElement.style.colorScheme=current==='dark'?'dark':'light';sync();}
function sync(){document.querySelectorAll('[data-ig-theme-choice]').forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-ig-theme-choice')===current));});}
function set(value){if(VALUES.indexOf(value)===-1)return false;current=value;try{localStorage.setItem(KEY,value);}catch(_){}apply();window.dispatchEvent(new CustomEvent('ig:theme-change',{detail:{theme:current}}));return true;}
function reset(){current='dark';try{localStorage.removeItem(KEY);}catch(_){}apply();window.dispatchEvent(new CustomEvent('ig:theme-change',{detail:{theme:current}}));}
function mount(root){(root||document).querySelectorAll('[data-ig-theme-choice]').forEach(function(b){if(b.dataset.igThemeReady)return;b.dataset.igThemeReady='1';b.addEventListener('click',function(){set(b.getAttribute('data-ig-theme-choice'));});});sync();}
apply();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){mount();},{once:true});else mount();
new MutationObserver(function(records){records.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType===1)mount(n.matches&&n.matches('[data-ig-theme-choice]')?n.parentNode:n);});});}).observe(document.documentElement,{childList:true,subtree:true});
window.IGTheme=Object.freeze({get:function(){return current;},set:set,reset:reset,mount:mount,refresh:apply});
})();
