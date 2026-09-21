/* Iris Green · W03 storage/privacy policy.
   Central deletion is deliberately limited to known first-party Iris Green keys.
   It never clears the whole origin and never touches third-party storage. */
(function(window,document){
  'use strict';
  var LOCAL_KEYS=['ig-a11y','ig_lang','ig_saved_videos'];
  var SESSION_KEYS=[
    'ig-conditions-url',
    'ig-situations-url',
    'ig-idioma',
    'ig-rutinas-hechos-ready',
    'ig-rutinas-hechos-builder',
    'ig-tarjeta-iris'
  ];

  function clearIrisStorage(){
    try{window.localStorage.removeItem('ig-a11y');}catch(_){}
    try{window.localStorage.removeItem('ig_lang');}catch(_){}
    try{window.localStorage.removeItem('ig_saved_videos');}catch(_){}
    try{window.sessionStorage.removeItem('ig-conditions-url');}catch(_){}
    try{window.sessionStorage.removeItem('ig-situations-url');}catch(_){}
    try{window.sessionStorage.removeItem('ig-idioma');}catch(_){}
    try{window.sessionStorage.removeItem('ig-rutinas-hechos-ready');}catch(_){}
    try{window.sessionStorage.removeItem('ig-rutinas-hechos-builder');}catch(_){}
    try{window.sessionStorage.removeItem('ig-tarjeta-iris');}catch(_){}

    /* Reflect the deletion in the current Reading UI without persisting a
       replacement default object. Other tools are not mounted on this page. */
    if(window.IGPreferences&&typeof window.IGPreferences.clearStored==='function'){
      window.IGPreferences.clearStored();
    }

    var status=document.getElementById('ig-storage-clear-status');
    if(status){
      var en=(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;
      status.textContent=en
        ? 'Iris Green saved data has been deleted from this browser.'
        : 'Los datos guardados por Iris Green se han borrado de este navegador.';
    }
  }

  function init(){
    var button=document.getElementById('ig-storage-clear');
    if(button)button.addEventListener('click',clearIrisStorage);
  }

  window.IGStoragePrivacy={
    localKeys:LOCAL_KEYS.slice(),
    sessionKeys:SESSION_KEYS.slice(),
    clear:clearIrisStorage
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})(window,document);
