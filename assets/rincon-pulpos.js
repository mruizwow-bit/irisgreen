/* R40 · escena Pulpos. Visual first-party Canvas2D; sin red ni audio propio aquí. */
(function(window){
'use strict';
function create(canvas,options){
  var ctx=canvas.getContext('2d');
  if(!ctx)return null;
  var W=1,H=1,dpr=1,raf=0,last=performance.now(),t=0,alive=true,ro=null;
  var motes=[],bubbles=[];
  function reduced(){try{return !!(options&&options.reduced&&options.reduced());}catch(e){return false;}}
  function rnd(a,b){return a+Math.random()*(b-a);}
  function resize(){
    var r=(canvas.parentElement||canvas).getBoundingClientRect();
    W=Math.max(1,r.width||960);H=Math.max(1,r.height||540);dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.width=W+'px';canvas.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(!motes.length){for(var i=0;i<55;i++)motes.push({x:rnd(0,W),y:rnd(0,H),r:rnd(.5,1.5),v:rnd(2,6)});}
  }
  function water(){
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#285f78');g.addColorStop(.55,'#123d57');g.addColorStop(1,'#082737');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.12;
    for(var i=0;i<5;i++){var x=W*(.08+i*.22)+Math.sin(t*.12+i)*22;ctx.fillStyle='rgba(175,225,230,.35)';ctx.beginPath();ctx.moveTo(x-24,0);ctx.lineTo(x+30,0);ctx.lineTo(x+115,H*.72);ctx.lineTo(x+28,H*.72);ctx.closePath();ctx.fill();}
    ctx.restore();
  }
  function seabed(){
    var y=H*.78;var g=ctx.createLinearGradient(0,y,0,H);g.addColorStop(0,'#807a68');g.addColorStop(1,'#4b493f');ctx.fillStyle=g;ctx.fillRect(0,y,W,H-y);
    ctx.fillStyle='#4a4d46';
    [[.15,.81,.10,.055],[.31,.85,.07,.04],[.78,.83,.12,.06],[.91,.89,.06,.035]].forEach(function(a){ctx.beginPath();ctx.ellipse(W*a[0],H*a[1],W*a[2],H*a[3],-.12,0,Math.PI*2);ctx.fill();});
    for(var i=0;i<9;i++){var x=W*(.04+i*.115),base=H*.82,h=H*(.10+(i%3)*.035),s=Math.sin(t*.32+i)*10;ctx.strokeStyle=i%2?'#416953':'#315845';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,base);ctx.quadraticCurveTo(x+s*.4,base-h*.45,x+s,base-h);ctx.stroke();}
  }
  function tentacle(cx,cy,len,angle,index,phase,alpha){
    var seg=18,pts=[],sway=Math.sin(t*.55+phase+index*.7)*(reduced()?4:10);
    for(var i=0;i<=seg;i++){var f=i/seg,curve=Math.sin(f*Math.PI)*sway+Math.sin(t*.24+phase+f*3+index)*5*(1-f);var a=angle+curve*.008;pts.push({x:cx+Math.cos(a)*len*f+Math.cos(a+Math.PI/2)*curve,y:cy+Math.sin(a)*len*f+Math.sin(a+Math.PI/2)*curve});}
    ctx.strokeStyle='rgba(126,76,61,'+alpha+')';ctx.lineCap='round';
    for(var j=0;j<seg;j++){ctx.lineWidth=Math.max(2,16*(1-j/seg));ctx.beginPath();ctx.moveTo(pts[j].x,pts[j].y);ctx.lineTo(pts[j+1].x,pts[j+1].y);ctx.stroke();}
    ctx.fillStyle='rgba(218,163,133,.35)';
    for(var k=4;k<seg;k+=3){var p=pts[k];ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.3,3.4*(1-k/seg)),0,Math.PI*2);ctx.fill();}
  }
  function octopusOne(cx,cy,scale,phase,mirror){
    ctx.save();ctx.translate(cx,cy);ctx.scale(mirror?-1:1,1);
    for(var i=0;i<8;i++){var a=Math.PI*.38+(i/7)*Math.PI*.78;tentacle(0,18*scale,120*scale,a,i,phase,.88);}
    var mg=ctx.createRadialGradient(-18*scale,-20*scale,4,0,0,58*scale);mg.addColorStop(0,'#b7836b');mg.addColorStop(.62,'#8d5f50');mg.addColorStop(1,'#66463e');
    ctx.fillStyle=mg;ctx.beginPath();ctx.ellipse(0,-18*scale,42*scale,53*scale,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(206,151,120,.34)';for(var s=0;s<14;s++){var ang=s*2.4+phase,rr=(12+(s%4)*6)*scale;ctx.beginPath();ctx.arc(Math.cos(ang)*rr*.9,(-18+Math.sin(ang)*rr*.65)*scale,1.7*scale,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#dccbb8';ctx.beginPath();ctx.ellipse(25*scale,-21*scale,6*scale,4*scale,-.15,0,Math.PI*2);ctx.fill();ctx.fillStyle='#171512';ctx.beginPath();ctx.ellipse(27*scale,-21*scale,2.2*scale,3.1*scale,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  function particles(dt){
    ctx.fillStyle='rgba(235,244,235,.33)';motes.forEach(function(m){m.y-=m.v*dt*(reduced()?.18:.6);if(m.y<0){m.y=H;m.x=rnd(0,W);}ctx.fillRect(m.x,m.y,m.r,m.r);});
    if(!reduced()&&Math.random()<dt*.55)bubbles.push({x:rnd(W*.12,W*.88),y:H*.78,r:rnd(1.5,4),v:rnd(16,28)});
    ctx.strokeStyle='rgba(230,248,250,.45)';bubbles.forEach(function(b){b.y-=b.v*dt;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.stroke();});bubbles=bubbles.filter(function(b){return b.y>H*.08;});
  }
  function frame(now){
    if(!alive)return;var dt=Math.min(.05,(now-last)/1000);last=now;t+=dt*(reduced()?.18:.55);
    water();seabed();octopusOne(W*.58,H*.58,Math.max(.65,Math.min(1.15,W/900)),.4,false);
    if(W>700)octopusOne(W*.31,H*.68,.55,2.1,true);
    particles(dt);
    var vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.2,W/2,H/2,Math.max(W,H)*.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,15,25,.42)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    raf=requestAnimationFrame(frame);
  }
  resize();if(window.ResizeObserver){ro=new ResizeObserver(resize);ro.observe(canvas.parentElement||canvas);}raf=requestAnimationFrame(frame);
  return{stop:function(){alive=false;cancelAnimationFrame(raf);if(ro){ro.disconnect();ro=null;}},resize:resize};
}
window.IGOctopusScene={create:create};
})(window);