(function(){
  'use strict';

  function cardText(card){
    var parts=[];
    var title=card.querySelector('.iris-mini-title');
    if(title&&title.textContent.trim())parts.push(title.textContent.trim());
    card.querySelectorAll('.iris-mini-block').forEach(function(block){
      var heading=block.querySelector('h3');
      var text=block.querySelector('p');
      var h=heading?heading.textContent.trim():'';
      var t=text?text.textContent.trim():'';
      if(h&&t)parts.push(h+'\n'+t);
    });
    return parts.join('\n\n');
  }

  function statusFor(card){
    return card.querySelector('[data-iris-card-status]');
  }

  function setStatus(card,message){
    var status=statusFor(card);
    if(status)status.textContent=message;
  }

  function fallbackCopy(text,button){
    var active=document.activeElement;
    var area=document.createElement('textarea');
    area.value=text;
    area.setAttribute('readonly','');
    area.style.position='fixed';
    area.style.left='-9999px';
    area.style.top='0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    var ok=false;
    try{ok=document.execCommand('copy');}catch(e){ok=false;}
    area.remove();
    if(button&&typeof button.focus==='function')button.focus();
    else if(active&&typeof active.focus==='function')active.focus();
    if(!ok)throw new Error('copy failed');
  }

  async function copyCard(card,button){
    var text=cardText(card);
    if(!text){
      setStatus(card,'No se ha podido copiar. Selecciona el texto para copiarlo manualmente.');
      return;
    }
    try{
      if(navigator.clipboard&&typeof navigator.clipboard.writeText==='function'){
        await navigator.clipboard.writeText(text);
      }else{
        fallbackCopy(text,button);
      }
      setStatus(card,'Copiada. Ya puedes pegarla.');
    }catch(e){
      try{
        fallbackCopy(text,button);
        setStatus(card,'Copiada. Ya puedes pegarla.');
      }catch(fallbackError){
        setStatus(card,'No se ha podido copiar. Selecciona el texto para copiarlo manualmente.');
      }
    }finally{
      if(button&&typeof button.focus==='function')button.focus();
    }
  }

  function printCard(card,button){
    var old=document.querySelector('.iris-card-print-root');
    if(old)old.remove();
    var root=document.createElement('div');
    root.className='iris-card-print-root';
    root.setAttribute('aria-hidden','true');
    var clone=card.cloneNode(true);
    var actions=clone.querySelector('.iris-mini-actions');
    if(actions)actions.remove();
    root.appendChild(clone);
    document.body.appendChild(root);
    document.body.classList.add('iris-card-printing');
    try{
      window.print();
    }finally{
      document.body.classList.remove('iris-card-printing');
      root.remove();
      if(button&&typeof button.focus==='function')button.focus();
    }
  }

  document.addEventListener('click',function(event){
    var copy=event.target.closest('[data-iris-card-copy]');
    if(copy){
      var copyCardNode=copy.closest('.iris-mini-card-static');
      if(copyCardNode)copyCard(copyCardNode,copy);
      return;
    }
    var print=event.target.closest('[data-iris-card-print]');
    if(print){
      var printCardNode=print.closest('.iris-mini-card-static');
      if(printCardNode)printCard(printCardNode,print);
    }
  });
})();
