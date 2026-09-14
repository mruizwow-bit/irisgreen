(function(){
'use strict';
var picker=document.querySelector('[data-iris-picto-picker]');
var card=document.getElementById('card');
var preview=document.getElementById('iris-card-pictos');
var status=document.getElementById('iris-picto-status');
if(!picker||!card||!preview)return;
var selected=new Set();
var allowed={hablar:'Hablar',escribir:'Escribir',esperar:'Esperar',preguntar:'Preguntar',carpeta:'Carpeta'};
function variant(){return selected.size===0?'A':selected.size===1?'B':'C';}
function render(){
  picker.querySelectorAll('[data-iris-picto]').forEach(function(button){
    button.setAttribute('aria-pressed',String(selected.has(button.dataset.irisPicto)));
  });
  card.setAttribute('data-iris-picto-variant',variant());
  preview.replaceChildren();
  selected.forEach(function(id){
    if(!allowed[id])return;
    var item=document.createElement('span');item.className='iris-card-picto';
    var img=document.createElement('img');img.src='/assets/mulberry/'+id+'.svg';img.alt='';img.width=64;img.height=64;img.setAttribute('aria-hidden','true');
    var label=document.createElement('span');label.textContent=allowed[id];
    item.append(img,label);preview.append(item);
  });
  preview.hidden=selected.size===0;
  if(status){
    status.textContent=selected.size===0?'Tarjeta solo con texto.':selected.size===1?'1 apoyo visual seleccionado.':selected.size+' apoyos visuales seleccionados.';
  }
}
picker.addEventListener('click',function(event){
  var button=event.target.closest('[data-iris-picto]');
  if(!button)return;
  var id=button.dataset.irisPicto;
  if(!allowed[id])return;
  if(selected.has(id))selected.delete(id);else selected.add(id);
  render();
});
var reset=document.getElementById('reset');
if(reset)reset.addEventListener('click',function(){selected.clear();render();});
render();
})();
