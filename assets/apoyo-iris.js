(function(){
  "use strict";
  var button=document.querySelector("[data-ig-support-pay]");
  var status=document.querySelector("[data-ig-support-status]");
  if(!button) return;

  function message(text){
    if(status) status.textContent=text;
  }

  button.addEventListener("click",async function(){
    button.disabled=true;
    button.setAttribute("aria-busy","true");
    var lang=(document.documentElement.lang||"es").toLowerCase().startsWith("en")?"en":"es";
    var opening=lang==="en"?"Opening secure payment…":"Abriendo pago seguro…";
    var unavailable=lang==="en"
      ?"Voluntary contributions are not active yet. Everything on Iris Green remains available."
      :"Las aportaciones voluntarias todavía no están activadas. Todo Iris Green sigue disponible.";
    var failed=lang==="en"
      ?"We could not open the secure payment page. Please try again later."
      :"No hemos podido abrir la página de pago seguro. Inténtalo de nuevo más tarde.";
    message(opening);
    try{
      var response=await fetch("/api/support-link",{headers:{"Accept":"application/json"}});
      var payload=await response.json().catch(function(){return {};});
      if(!response.ok||!payload.url){
        message(unavailable);
        return;
      }
      var target=new URL(payload.url);
      if(target.protocol!=="https:"||target.hostname!=="buy.stripe.com"){
        message(failed);
        return;
      }
      window.location.assign(target.href);
    }catch(_err){
      message(failed);
    }finally{
      button.disabled=false;
      button.removeAttribute("aria-busy");
    }
  });
})();