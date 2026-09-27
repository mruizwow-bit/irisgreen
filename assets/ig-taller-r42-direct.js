/* Iris Green · R42 Taller · direct-manipulation adapters.
   Canvas is the visual workspace; the original semantic button grid remains available
   as an explicit keyboard/screen-reader alternative. No network calls. */
(function(root,factory){
  var api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.IGTallerR42Direct=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';
  var D=root.document;
  function L(es,en){return D&&String(D.documentElement.lang||'es').slice(0,2)==='en'?en:es;}
  function dims(grid,count){
    if(grid.classList.contains('igt-r40-pixel'))return [16,16];
    if(grid.classList.contains('igt-r40-sim'))return [20,12];
    if(grid.classList.contains('igt-r40-board'))return [8,8];
    if(grid.classList.contains('igt-r40-sequencer')||grid.classList.contains('igt-r40-piano'))return [16,Math.max(1,Math.ceil(count/16))];
    if(grid.classList.contains('igt-r40-floor')||grid.classList.contains('igt-r40-world')||grid.classList.contains('igt-r40-game'))return [12,Math.max(1,Math.ceil(count/12))];
    var c=Math.max(1,Math.round(Math.sqrt(count)));return [c,Math.ceil(count/c)];
  }
  function family(grid){
    var names=['pixel','floor','world','game','sim','board','sequencer','piano'];
    for(var i=0;i<names.length;i++)if(grid.classList.contains('igt-r40-'+names[i]))return names[i];
    return 'grid';
  }
  function colour(button,f){
    var style=button.style&&button.style.backgroundColor;
    if(style)return style;
    if(button.dataset.on==='true')return f==='piano'?'#7457c7':'#2f80ed';
    if(button.dataset.live==='true')return '#17395c';
    var v=button.dataset.type||button.dataset.token||'';
    return {
      wall:'#17395c',door:'#b97a45',window:'#73bee5',water:'#89c9ea',land:'#71a96b',mountain:'#7a8391',city:'#9a6fc3',
      a:'#2f80ed',b:'#d58caf'
    }[v]||'#f7f9fc';
  }
  function upgrade(grid){
    if(!grid||grid.dataset.ig42DirectCanvas)return false;
    var buttons=Array.prototype.slice.call(grid.querySelectorAll('button'));if(!buttons.length)return false;
    grid.dataset.ig42DirectCanvas='true';
    var d=dims(grid,buttons.length),cols=d[0],rows=d[1],f=family(grid);
    var wrap=D.createElement('section');wrap.className='ig42-direct-wrap ig42-direct-'+f;
    var canvas=D.createElement('canvas');canvas.className='ig42-direct-canvas';canvas.width=Math.max(480,cols*40);canvas.height=Math.max(280,rows*40);canvas.tabIndex=0;
    canvas.setAttribute('role','application');
    canvas.setAttribute('aria-label',L('Superficie de edición. Usa flechas para moverte y Espacio para activar una celda.','Editing surface. Use arrow keys to move and Space to activate a cell.'));
    var status=D.createElement('p');status.className='ig42-direct-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    var details=D.createElement('details');details.className='ig42-semantic-grid';var summary=D.createElement('summary');summary.textContent=L('Cuadrícula accesible de teclado','Accessible keyboard grid');details.appendChild(summary);
    grid.parentNode.insertBefore(wrap,grid);wrap.appendChild(canvas);wrap.appendChild(status);details.appendChild(grid);wrap.appendChild(details);
    var ctx=canvas.getContext('2d'),cursor=0,painting=false,visited=new Set(),ratio=1;

    function fit(){
      var box=wrap.getBoundingClientRect(),w=Math.max(280,Math.floor(box.width||canvas.width)),h=Math.max(260,Math.min(720,Math.floor(w*rows/cols)));
      ratio=Math.max(1,Math.min(2,root.devicePixelRatio||1));canvas.width=Math.floor(w*ratio);canvas.height=Math.floor(h*ratio);canvas.style.height=h+'px';draw();
    }
    function draw(){
      var w=canvas.width/ratio,h=canvas.height/ratio,cw=w/cols,ch=h/rows;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
      ctx.fillStyle='#eef3f8';ctx.fillRect(0,0,w,h);
      buttons.forEach(function(b,i){
        var x=(i%cols)*cw,y=Math.floor(i/cols)*ch;ctx.fillStyle=colour(b,f);ctx.fillRect(x+1,y+1,cw-2,ch-2);
        ctx.strokeStyle='#c2cfdb';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,cw-1,ch-1);
        var txt=(b.textContent||'').trim();if(txt){ctx.fillStyle='#17395c';ctx.font=Math.max(11,Math.min(18,ch*.42))+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,x+cw/2,y+ch/2,cw*.8);}
      });
      var x=(cursor%cols)*cw,y=Math.floor(cursor/cols)*ch;ctx.strokeStyle='#ffb000';ctx.lineWidth=3;ctx.strokeRect(x+2,y+2,cw-4,ch-4);
    }
    function indexAt(e){
      var r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height,c=Math.max(0,Math.min(cols-1,Math.floor(x*cols))),rr=Math.max(0,Math.min(rows-1,Math.floor(y*rows)));return Math.min(buttons.length-1,rr*cols+c);
    }
    function activate(i){
      if(i<0||i>=buttons.length||visited.has(i))return;visited.add(i);cursor=i;buttons[i].click();status.textContent=buttons[i].getAttribute('aria-label')||L('Celda ','Cell ')+(i+1);root.requestAnimationFrame(draw);
    }
    canvas.addEventListener('pointerdown',function(e){painting=true;visited.clear();canvas.setPointerCapture&&canvas.setPointerCapture(e.pointerId);activate(indexAt(e));});
    canvas.addEventListener('pointermove',function(e){if(painting)activate(indexAt(e));});
    ['pointerup','pointercancel'].forEach(function(ev){canvas.addEventListener(ev,function(){painting=false;visited.clear();});});
    canvas.addEventListener('keydown',function(e){
      var x=cursor%cols,y=Math.floor(cursor/cols),handled=true;
      if(e.key==='ArrowLeft')x--;else if(e.key==='ArrowRight')x++;else if(e.key==='ArrowUp')y--;else if(e.key==='ArrowDown')y++;else if(e.key==='Home'){x=0;}else if(e.key==='End'){x=cols-1;}else if(e.key===' '||e.key==='Enter'){visited.clear();activate(cursor);e.preventDefault();return;}else handled=false;
      if(handled){e.preventDefault();x=Math.max(0,Math.min(cols-1,x));y=Math.max(0,Math.min(rows-1,y));cursor=Math.min(buttons.length-1,y*cols+x);status.textContent=buttons[cursor].getAttribute('aria-label')||L('Celda ','Cell ')+(cursor+1);draw();}
    });
    var obs=new MutationObserver(function(){root.requestAnimationFrame(draw);});buttons.forEach(function(b){obs.observe(b,{attributes:true,attributeFilter:['data-type','data-token','data-on','data-live','style'],childList:true,characterData:true,subtree:true});});
    if(root.ResizeObserver)new ResizeObserver(fit).observe(wrap);else root.addEventListener('resize',fit,{passive:true});
    fit();return true;
  }
  function enhance(scope){
    if(!D)return 0;var rootNode=scope||D,count=0;
    ['.igt-r40-pixel','.igt-r40-floor','.igt-r40-world','.igt-r40-game','.igt-r40-sim','.igt-r40-board','.igt-r40-sequencer','.igt-r40-piano'].forEach(function(sel){
      rootNode.querySelectorAll(sel).forEach(function(g){if(upgrade(g))count++;});
    });return count;
  }
  return {upgrade:upgrade,enhance:enhance};
});
