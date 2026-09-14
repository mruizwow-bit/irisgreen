(function(){
'use strict';
var card=document.getElementById('card');
if(!card)return;
var supports=Array.from(document.querySelectorAll('[data-iris-approved-field]'));
if(!supports.length)return;
function sync(){
  var visible=0;
  supports.forEach(function(support){
    var field=document.getElementById(support.dataset.irisApprovedField);
    var image=support.querySelector('.iris-tool-picto');
    if(!field||!image)return;
    var keep=field.value.trim()===support.dataset.irisApprovedText;
    image.hidden=!keep;
    support.classList.toggle('has-picto',keep);
    if(keep)visible+=1;
  });
  card.setAttribute('data-iris-picto-variant',visible?'B':'A');
}
supports.forEach(function(support){
  var field=document.getElementById(support.dataset.irisApprovedField);
  if(field)field.addEventListener('input',sync);
});
var reset=document.getElementById('reset');
if(reset)reset.addEventListener('click',sync);
sync();
})();
