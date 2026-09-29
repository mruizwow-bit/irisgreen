(function(){
  'use strict';
  var SPRITE='/assets/runtime/ig-icons.fa4be0c21d6c.svg';
  function q(sel,root){return (root||document).querySelector(sel)}
  function qa(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel))}
  function status(message){var el=q('[data-ig-game-status]');if(el)el.textContent=message||''}
  function icon(id){return '<svg class="ig-game-icon" aria-hidden="true" focusable="false"><use href="'+SPRITE+'#'+id+'"></use></svg>'}
  function setupBar(main){
    var bar=q('[data-ig-game-bar]',main);if(!bar)return;
    var reset=q('[data-ig-game-reset]',bar);if(reset)reset.addEventListener('click',function(){location.reload()});
    var undo=q('[data-ig-game-undo]',bar);if(undo){
      if(main.getAttribute('data-ig-undo')!=='true')undo.setAttribute('aria-disabled','true');
      undo.addEventListener('click',function(){window.dispatchEvent(new CustomEvent('ig-game-undo'));status('Se ha deshecho el último cambio.');});
    }
    var list=q('[data-ig-game-list]',bar);if(list){
      if(main.getAttribute('data-ig-list')!=='true')list.setAttribute('aria-disabled','true');
      list.addEventListener('click',function(){
        var candidates=qa('button',main).filter(function(btn){return /^(Prefiero la lista|Ver lista|Ocultar lista|View list|Hide list)$/i.test(btn.textContent.trim())&&!btn.hasAttribute('data-ig-game-list')});
        if(candidates[0]){candidates[0].click();status('Vista de lista actualizada.');}
      });
    }
  }
  function setupScene(main){
    var scene=q('#scene',main);if(!scene)return;
    scene.classList.add('ig-game-scene');
    function mark(){qa('button',scene).forEach(function(btn){btn.classList.add('ig-game-hotspot')})}
    mark();new MutationObserver(mark).observe(scene,{childList:true,subtree:true});
    var tools=document.createElement('div');tools.className='ig-game-scene-tools';
    var expand=document.createElement('button');expand.type='button';expand.className='ig-game-control';expand.setAttribute('aria-expanded','false');expand.innerHTML=icon('ig-icon-ampliar')+'<span>Ampliar la escena</span>';
    expand.addEventListener('click',function(){var on=scene.classList.toggle('ig-game-scene-expanded');expand.setAttribute('aria-expanded',String(on));expand.querySelector('span').textContent=on?'Cerrar ampliación':'Ampliar la escena';});
    tools.appendChild(expand);scene.parentNode.insertBefore(tools,scene.nextSibling);
  }
  function setupDestinationIcons(main){
    qa('[data-ig-destination]').forEach(function(btn,i){
      if(q('.ig-game-destination-icon',btn))return;
      var ids=['ig-icon-destino-calma','ig-icon-destino-activa','ig-icon-destino-depende'];
      var span=document.createElement('span');span.className='ig-game-destination-icon';span.innerHTML=icon(ids[i]||ids[2]);btn.insertBefore(span,btn.firstChild);
    });
  }
  function init(){
    var main=q('main[data-ig-game-v1]');if(!main)return;
    setupBar(main);setupScene(main);setupDestinationIcons(main);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
