(function(){"use strict";
var GRUPOS={diagnostico:["diagnóstico","salud mental","salud física","desarrollo"],experiencia:["experiencia","proceso","emergente"],identidad:["identidad"],apoyo:["contexto","apoyo","controvertido"]};
var cards=[].slice.call(document.querySelectorAll(".card"));
var datos=cards.map(function(c){
  var t=c.querySelector("strong")?c.querySelector("strong").textContent:"";
  var r=c.querySelector("strong")&&c.querySelector("strong").nextElementSibling?c.querySelector("strong").nextElementSibling.textContent:"";
  var tipo=c.querySelector(".chip")?c.querySelector(".chip").textContent:"";
  return {el:c,txt:norm(t+" "+r+" "+tipo),tipo:tipo,letra:letra(t)};
});
function norm(s){return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function letra(s){var l=norm(s).charAt(0);return /[a-z]/.test(l)?l.toUpperCase():"#"}
var q=document.getElementById("q"),cuenta=document.getElementById("cuenta"),az=document.getElementById("az");
var estado={q:"",grupo:"todas",letra:""};
var letras=[];
datos.forEach(function(d){if(letras.indexOf(d.letra)<0)letras.push(d.letra)});
letras.sort();
az.appendChild(boton("Todas",""));
letras.forEach(function(l){az.appendChild(boton(l,l))});
function boton(txt,val){var b=document.createElement("button");b.type="button";b.className="azl"+(val===""?" on":"");b.textContent=txt;b.setAttribute("data-letra",val);b.setAttribute("aria-pressed",val===""?"true":"false");
 b.onclick=function(){estado.letra=val;[].forEach.call(az.children,function(x){x.classList.toggle("on",x===b);x.setAttribute("aria-pressed",x===b?"true":"false")});pinta()};return b}
document.getElementById("filtros").addEventListener("click",function(e){
 var b=e.target.closest("button[data-grupo]");if(!b)return;
 estado.grupo=b.getAttribute("data-grupo");
 [].forEach.call(this.querySelectorAll("button"),function(x){x.classList.toggle("on",x===b);x.setAttribute("aria-pressed",x===b?"true":"false")});
 pinta()});
q.addEventListener("input",function(){estado.q=norm(q.value);pinta()});
function pinta(){
 var pal=estado.q?estado.q.split(/\s+/).filter(function(w){return w.length>2}):[];
 var n=0;
 datos.forEach(function(d){
  var ok=true;
  if(estado.grupo!=="todas") ok=GRUPOS[estado.grupo].indexOf(d.tipo)>-1;
  if(ok&&estado.letra) ok=d.letra===estado.letra;
  if(ok&&pal.length) ok=pal.every(function(w){return d.txt.indexOf(w)>-1});
  if(ok){d.el.removeAttribute("hidden");n++} else d.el.setAttribute("hidden","");
 });
 cuenta.textContent=n===datos.length?(datos.length+" fichas"):(n===0?"Ninguna ficha coincide":(n===1?"1 ficha":n+" fichas"));
}
pinta();
})();