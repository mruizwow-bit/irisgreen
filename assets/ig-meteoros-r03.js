/* Iris Green · Meteoros R03
   EXPLORE SKY/RADIANT → LOCATE → REVEAL ORIGIN/ACTIVITY.
   REAL_DATA: estrellas HYG del catálogo local + radiante/actividad del JSON Atlas.
   REPRESENTATION: trazos de meteoros generados sobre la esfera; no son observaciones simultáneas. */
(function (g) {
  'use strict';

  var DEG=Math.PI/180, KEY='iris-green.meteoros-r03', SAVE_V=1;
  var MOTION={NORMAL:'NORMAL',REDUCED:'REDUCED',NONE:'NONE'};
  function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
  function mod(x,m){return ((x%m)+m)%m}
  function h(tag,attrs){
    var n=document.createElement(tag),kids=[].slice.call(arguments,2);
    Object.keys(attrs||{}).forEach(function(k){
      var v=attrs[k];
      if(k==='class')n.className=v;
      else if(k==='text')n.textContent=v;
      else if(k==='html')n.innerHTML=v;
      else if(k==='on')Object.keys(v).forEach(function(e){n.addEventListener(e,v[e])});
      else if(v!==null&&v!==undefined&&v!==false)n.setAttribute(k,v===true?'':String(v));
    });
    kids.flat().filter(Boolean).forEach(function(k){n.append(k.nodeType?k:document.createTextNode(String(k)))});
    return n;
  }
  function vec(x,y,z){return{x:x,y:y,z:z}}
  function add(a,b){return vec(a.x+b.x,a.y+b.y,a.z+b.z)}
  function mul(a,s){return vec(a.x*s,a.y*s,a.z*s)}
  function dot(a,b){return a.x*b.x+a.y*b.y+a.z*b.z}
  function cross(a,b){return vec(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x)}
  function len(a){return Math.hypot(a.x,a.y,a.z)}
  function unit(a){var l=len(a)||1;return mul(a,1/l)}
  function dir(ra,dec){var a=ra*15*DEG,d=dec*DEG,c=Math.cos(d);return vec(c*Math.cos(a),Math.sin(d),c*Math.sin(a))}
  function coords(v){v=unit(v);return{ra:mod(Math.atan2(v.z,v.x)/DEG/15,24),dec:Math.asin(clamp(v.y,-1,1))/DEG}}
  function angle(a,b){return Math.acos(clamp(dot(unit(a),unit(b)),-1,1))/DEG}
  function parseRA(v){var m=String(v).match(/(\d+):(\d+)/);return m?+m[1]+(+m[2]/60):0}
  function parseDec(v){return parseFloat(String(v).replace('−','-').replace('°',''))||0}
  function basis(cam){
    var f=dir(cam.ra,cam.dec),north=vec(0,1,0),r=cross(f,north);
    if(len(r)<.01)r=cross(f,vec(1,0,0));
    r=unit(r);var u=unit(cross(r,f));return{f:f,r:r,u:u}
  }
  function project(v,cam,W,H,b){
    b=b||basis(cam);var z=dot(v,b.f);if(z<=.03)return{front:false};
    var scale=(H*.5)/Math.tan(cam.fov*.5*DEG);
    return{front:true,x:W*.5+dot(v,b.r)/z*scale,y:H*.5-dot(v,b.u)/z*scale,z:z}
  }
  function unproject(p,cam,W,H,b){
    b=b||basis(cam);var scale=(H*.5)/Math.tan(cam.fov*.5*DEG);
    return unit(add(b.f,add(mul(b.r,(p.x-W*.5)/scale),mul(b.u,-(p.y-H*.5)/scale))))
  }
  function great(r,t,theta){return unit(add(mul(r,Math.cos(theta*DEG)),mul(t,Math.sin(theta*DEG))))}
  function radiantBasis(r){
    var n=vec(0,1,0),a=cross(r,n);if(len(a)<.02)a=cross(r,vec(1,0,0));
    a=unit(a);return{a:a,b:unit(cross(a,r))}
  }
  function colorBV(ci){
    if(ci===null||ci===undefined)return'#dce8f2';
    if(ci<-.1)return'#d6e6ff';if(ci<.3)return'#e6eeff';if(ci<.6)return'#f2efe2';
    if(ci<1)return'#f7e9c8';if(ci<1.5)return'#f2dec0';return'#efcbb4'
  }

  var TEXT={
    es:{
      label:'Lluvias de meteoros',question:'¿De qué punto del cielo parecen salir estos meteoros?',
      intro:'Orienta el cielo y sigue los trazos hacia atrás hasta encontrar su origen aparente.',
      stage:'Cielo para localizar el radiante de una lluvia de meteoros',
      help:'Arrastra para orientar. Pulsa donde creas que convergen los trazos. Con foco en el cielo: flechas para orientar, + y − para zoom e Intro para examinar el centro.',
      objective:'Busca el punto del que parecen venir los trazos.',found:'Has localizado el radiante aparente. Ahora puedes revelar la lluvia.',
      miss:'Aquí no convergen los trazos. Sigue su dirección hacia atrás.',reveal:'Revelar la lluvia',
      next:'Siguiente escena',prev:'Escena anterior',scene:function(a,b){return'Escena '+a+' de '+b},
      discovered:function(a,b){return a+' de '+b+' lluvias reveladas.'},already:'Ya habías revelado esta lluvia.',
      turn:'Orientar y acercar',left:'Izquierda',right:'Derecha',up:'Arriba',down:'Abajo',zin:'Acercar',zout:'Alejar',
      movement:'Movimiento',normal:'Normal',reduced:'Reducido',none:'Sin animación',describe:'Explorar con descripción',
      descTitle:'Descripción equivalente',desc:function(d,where){return'El origen aparente de los trazos está a unos '+Math.round(d)+'° del centro, '+where+'.'},
      here:'casi en el centro',dirs:{n:'arriba',s:'abajo',e:'a la derecha',w:'a la izquierda',ne:'arriba a la derecha',nw:'arriba a la izquierda',se:'abajo a la derecha',sw:'abajo a la izquierda'},
      name:'Lluvia',period:'Actividad 2026',peak:'Máximo 2026',zhr:'ZHR de referencia',speed:'Velocidad',radiant:'Radiante',parent:'Cuerpo progenitor',status:'Estado de la asociación',
      zhrNote:'El ZHR es un dato de referencia. Los trazos de esta escena son una representación y no muestran una tasa simultánea literal.',
      real:'DATOS REALES',rep:'REPRESENTACIÓN',imageAlt:function(n){return'Escena ilustrada aprobada para '+n+'.'},
      parentCaveat:'La asociación del progenitor no se presenta como cerrada.',sources:'Fuentes y alcance',
      sourceText:'Datos 2026: American Meteor Society, con tabla acreditada a International Meteor Organization y Masahiro Koseki. Progenitores contrastados con NASA/JPL SSD y NASA Science.',
      epistemic:'Las estrellas y el radiante usan coordenadas del catálogo local. Los trazos animados y el paisaje ilustrado son representaciones, no una observación en directo.',
      savedFuture:'Hay progreso de una versión más nueva. No se sobrescribe; esta sesión es temporal.',
      loadFail:'No se han podido cargar los datos locales. No se usa una fuente externa como sustituto.',
      back:'Volver a Cielo y espacio'
    },
    en:{
      label:'Meteor showers',question:'Where in the sky do these meteors appear to come from?',
      intro:'Turn the sky and follow the trails backwards until you find their apparent origin.',
      stage:'Sky for locating the radiant of a meteor shower',
      help:'Drag to turn. Click where you think the trails converge. With focus on the sky: arrow keys turn, + and − zoom, Enter examines the centre.',
      objective:'Find the point the trails seem to come from.',found:'You have located the apparent radiant. You can now reveal the shower.',
      miss:'The trails do not converge here. Follow their direction backwards.',reveal:'Reveal the shower',
      next:'Next scene',prev:'Previous scene',scene:function(a,b){return'Scene '+a+' of '+b},
      discovered:function(a,b){return a+' of '+b+' showers revealed.'},already:'You had already revealed this shower.',
      turn:'Turn and zoom',left:'Left',right:'Right',up:'Up',down:'Down',zin:'Zoom in',zout:'Zoom out',
      movement:'Motion',normal:'Normal',reduced:'Reduced',none:'No animation',describe:'Explore with description',
      descTitle:'Equivalent description',desc:function(d,where){return'The apparent origin of the trails is about '+Math.round(d)+'° from the centre, '+where+'.'},
      here:'almost at the centre',dirs:{n:'above',s:'below',e:'to the right',w:'to the left',ne:'above and right',nw:'above and left',se:'below and right',sw:'below and left'},
      name:'Shower',period:'2026 activity',peak:'2026 peak',zhr:'Reference ZHR',speed:'Speed',radiant:'Radiant',parent:'Parent body',status:'Association status',
      zhrNote:'ZHR is reference data. The trails in this scene are a representation and do not show a literal simultaneous rate.',
      real:'REAL DATA',rep:'REPRESENTATION',imageAlt:function(n){return'Approved illustrated scene for '+n+'.'},
      parentCaveat:'The parent-body association is not presented as settled.',sources:'Sources and scope',
      sourceText:'2026 data: American Meteor Society, with the table credited to the International Meteor Organization and Masahiro Koseki. Parent bodies cross-checked with NASA/JPL SSD and NASA Science.',
      epistemic:'Stars and the radiant use coordinates from the local catalogue. Animated trails and the illustrated landscape are representations, not a live observation.',
      savedFuture:'Progress from a newer version exists. It is not overwritten; this session is temporary.',
      loadFail:'Local data could not be loaded. No external source is used as a substitute.',
      back:'Back to Sky and space'
    }
  };

  function mount(host,opt){
    opt=opt||{};var lang=opt.lang==='en'?'en':'es',L=TEXT[lang];
    var state={showers:[],stars:[],i:0,found:{},localized:false,revealed:false,
      camera:{ra:0,dec:0,fov:62},motion:null,motionExplicit:false,describe:false,readOnly:false,
      drag:null,raf:0,last:0,phase:0,alive:true};
    var mq=g.matchMedia&&g.matchMedia('(prefers-reduced-motion: reduce)');
    state.motion=(mq&&mq.matches)?MOTION.REDUCED:MOTION.NORMAL;

    host.replaceChildren();
    var objective=h('p',{class:'met-status',id:'met-objective',text:L.objective});
    var progress=h('span',{class:'met-progress',id:'met-progress'});
    var btnPrev=h('button',{type:'button',class:'met-btn',text:'← '+L.prev});
    var btnNext=h('button',{type:'button',class:'met-btn',text:L.next+' →'});
    var reveal=h('button',{type:'button',class:'met-btn met-btn-primary',text:L.reveal,hidden:true});
    var objectiveRow=h('div',{class:'met-objective'},objective,progress,btnPrev,btnNext);

    var canvas=h('canvas',{'aria-hidden':'true'});
    var stage=h('div',{class:'met-stage',tabindex:'0',role:'group','aria-label':L.stage,'aria-describedby':'met-help'},canvas);
    var chipScene=h('span',{class:'met-chip'});
    var chipMode=h('span',{class:'met-chip',text:L.rep});
    stage.appendChild(h('div',{class:'met-overlay'},chipScene,chipMode));
    var panel=h('aside',{class:'met-panel',hidden:true,'aria-live':'polite'});
    var wrap=h('div',{class:'met-stage-wrap'},stage,panel);

    var status=h('p',{class:'met-status',role:'status','aria-live':'polite'});
    var desc=h('section',{class:'met-desc',hidden:true},h('strong',{text:L.descTitle}),h('p',{id:'met-desc-text'}));
    var help=h('p',{class:'met-sr',id:'met-help',text:L.help});
    var controls=h('div',{class:'met-controls',role:'group','aria-label':L.turn});
    function ctl(txt,aria,fn){var b=h('button',{type:'button',class:'met-control','aria-label':aria,text:txt,on:{click:fn}});controls.appendChild(b);return b}
    ctl('←',L.left,function(){turn(5/15,0)});ctl('→',L.right,function(){turn(-5/15,0)});
    ctl('↑',L.up,function(){turn(0,5)});ctl('↓',L.down,function(){turn(0,-5)});
    ctl('+',L.zin,function(){zoom(1.25)});ctl('−',L.zout,function(){zoom(1/1.25)});

    var motion=h('select',{class:'met-select','aria-label':L.movement},
      h('option',{value:MOTION.NORMAL,text:L.normal}),h('option',{value:MOTION.REDUCED,text:L.reduced}),h('option',{value:MOTION.NONE,text:L.none}));
    motion.value=state.motion;
    var describe=h('button',{type:'button',class:'met-btn','aria-pressed':'false',text:L.describe});
    var options=h('div',{class:'met-options'},
      h('label',{class:'met-field'},h('span',{text:L.movement}),motion),describe);
    host.append(objectiveRow,wrap,reveal,status,controls,options,desc,help,h('p',{class:'met-epistemic',text:L.epistemic}));

    var ctx=canvas.getContext('2d'),ro=null;
    function save(){
      if(state.readOnly)return;
      try{localStorage.setItem(KEY,JSON.stringify({v:SAVE_V,found:Object.keys(state.found),i:state.i,motion:state.motionExplicit?state.motion:null}))}catch(e){}
    }
    function load(){
      var v=null;try{v=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
      if(v&&typeof v.v==='number'&&v.v>SAVE_V){state.readOnly=true;status.textContent=L.savedFuture;return}
      if(!v||v.v!==SAVE_V)return;
      if(Array.isArray(v.found))v.found.forEach(function(x){state.found[x]=true});
      if(Number.isInteger(v.i))state.i=Math.max(0,v.i);
      if(v.motion&&MOTION[v.motion]){state.motion=v.motion;state.motionExplicit=true;motion.value=v.motion}
    }
    load();

    function shower(){return state.showers[state.i]||null}
    function radiant(s){return dir(parseRA(s.radiant_ra),parseDec(s.radiant_dec))}
    function resetCamera(){
      var s=shower();if(!s)return;var q=coords(radiant(s));
      state.camera={ra:mod(q.ra+1.45,24),dec:clamp(q.dec+8,-82,82),fov:62};
      state.localized=false;state.revealed=false;reveal.hidden=true;panel.hidden=true;wrap.classList.remove('has-panel');
      status.textContent='';objective.textContent=L.objective;updateDesc();draw();
    }
    function setIndex(n){
      if(!state.showers.length)return;
      state.i=mod(n,state.showers.length);resetCamera();updateUI();save();syncRAF();
    }
    function updateUI(){
      chipScene.textContent=L.scene(state.i+1,state.showers.length);
      var n=Object.keys(state.found).length;progress.textContent=L.discovered(n,state.showers.length);
    }
    btnPrev.addEventListener('click',function(){setIndex(state.i-1)});
    btnNext.addEventListener('click',function(){setIndex(state.i+1)});

    function canvasSize(){
      var r=stage.getBoundingClientRect(),dpr=Math.min(g.devicePixelRatio||1,2);
      var W=Math.max(1,Math.round(r.width)),H=Math.max(1,Math.round(r.height));
      if(canvas.width!==Math.round(W*dpr)||canvas.height!==Math.round(H*dpr)){canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr)}
      return{W:W,H:H,dpr:dpr}
    }
    function starRadius(mag,fov){
      var t=clamp((5.6-mag)/7.1,0,1);return(.55+Math.pow(t,1.5)*3.5)*clamp(Math.pow(55/fov,.3),.8,1.7)
    }
    function tracks(s){
      var r=radiant(s),rb=radiantBasis(r),arr=[];
      var seed=(s.id||1)*0.731;
      for(var i=0;i<6;i++){
        var phi=(seed*83+i*137.5)%360*DEG,t=unit(add(mul(rb.a,Math.cos(phi)),mul(rb.b,Math.sin(phi))));
        arr.push({r:r,t:t,start:3.2+(i%3)*1.1,end:17+(i%4)*3.1,offset:i/6});
      }
      return arr;
    }
    function drawTrack(tr,cam,W,H,b,phase,staticMode){
      var span=tr.end-tr.start,p=staticMode?.72:mod(phase*.16+tr.offset,1);
      var head=tr.start+span*(.28+.72*p),tail=Math.max(tr.start,head-(staticMode?7:4.5));
      var samples=10,pts=[];
      for(var j=0;j<=samples;j++){
        var th=tail+(head-tail)*j/samples,sv=project(great(tr.r,tr.t,th),cam,W,H,b);
        if(sv.front)pts.push(sv);
      }
      if(pts.length<2)return;
      var gr=ctx.createLinearGradient(pts[0].x,pts[0].y,pts[pts.length-1].x,pts[pts.length-1].y);
      gr.addColorStop(0,'rgba(235,241,248,0)');gr.addColorStop(.7,'rgba(235,241,248,.55)');gr.addColorStop(1,'rgba(255,255,255,.95)');
      ctx.strokeStyle=gr;ctx.lineWidth=1.4;ctx.beginPath();pts.forEach(function(p,i){i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.stroke();
    }
    function draw(now){
      if(!ctx||!state.showers.length)return;
      var m=canvasSize(),W=m.W,H=m.H,b=basis(state.camera);
      ctx.setTransform(m.dpr,0,0,m.dpr,0,0);ctx.clearRect(0,0,W,H);
      var gd=ctx.createRadialGradient(W*.52,H*.46,0,W*.52,H*.46,Math.max(W,H)*.7);
      gd.addColorStop(0,'#102943');gd.addColorStop(1,'#0B1A2B');ctx.fillStyle=gd;ctx.fillRect(0,0,W,H);
      state.stars.forEach(function(e){
        var p=project(e.v,state.camera,W,H,b);if(!p.front||p.x<-5||p.x>W+5||p.y<-5||p.y>H+5)return;
        var rr=starRadius(e.mag,state.camera.fov);ctx.globalAlpha=clamp(1.12-(e.mag+1.5)/9,.38,1);ctx.fillStyle=colorBV(e.ci);
        ctx.beginPath();ctx.arc(p.x,p.y,rr,0,Math.PI*2);ctx.fill();
      });ctx.globalAlpha=1;
      var staticMode=state.motion===MOTION.NONE;
      tracks(shower()).slice(0,state.motion===MOTION.REDUCED?4:6).forEach(function(t){drawTrack(t,state.camera,W,H,b,state.phase,staticMode)});
      if(state.localized||state.revealed){
        var rp=project(radiant(shower()),state.camera,W,H,b);
        if(rp.front){
          ctx.strokeStyle='#C3B8FF';ctx.lineWidth=2;ctx.beginPath();ctx.arc(rp.x,rp.y,13,0,Math.PI*2);ctx.stroke();
          ctx.beginPath();ctx.moveTo(rp.x-18,rp.y);ctx.lineTo(rp.x+18,rp.y);ctx.moveTo(rp.x,rp.y-18);ctx.lineTo(rp.x,rp.y+18);ctx.stroke();
        }
      }
    }
    function frame(ts){
      state.raf=0;if(!state.alive||document.hidden||state.motion===MOTION.NONE)return;
      if(state.last)state.phase+=(ts-state.last)/1000*(state.motion===MOTION.REDUCED?.35:1);
      state.last=ts;draw(ts);state.raf=requestAnimationFrame(frame);
    }
    function syncRAF(){
      if(state.raf){cancelAnimationFrame(state.raf);state.raf=0}
      state.last=0;if(state.motion===MOTION.NONE){draw();return}state.raf=requestAnimationFrame(frame)
    }
    function turn(dra,ddec){state.camera.ra=mod(state.camera.ra+dra,24);state.camera.dec=clamp(state.camera.dec+ddec,-85,85);state.localized=false;reveal.hidden=true;status.textContent='';updateDesc();draw()}
    function zoom(f){state.camera.fov=clamp(state.camera.fov/f,15,95);updateDesc();draw()}
    function relativeWord(target){
      var m=canvasSize(),b=basis(state.camera),p=project(target,state.camera,m.W,m.H,b);
      if(!p.front)return L.dirs.w;
      var dx=p.x-m.W/2,dy=p.y-m.H/2;if(Math.hypot(dx,dy)<30)return L.here;
      var hdir=Math.abs(dx)<35?'':(dx>0?'e':'w'),vdir=Math.abs(dy)<35?'':(dy>0?'s':'n');
      return L.dirs[vdir+hdir]||L.dirs[hdir]||L.dirs[vdir]||L.here
    }
    function updateDesc(){
      if(!state.describe||!shower())return;
      var m=canvasSize(),center=unproject({x:m.W/2,y:m.H/2},state.camera,m.W,m.H),r=radiant(shower()),d=angle(center,r);
      desc.querySelector('p').textContent=L.desc(d,relativeWord(r));
    }
    function examine(p,origin){
      var s=shower(),m=canvasSize(),target=unproject(p,state.camera,m.W,m.H),d=angle(target,radiant(s));
      if(d<=7){
        state.localized=true;reveal.hidden=false;objective.textContent=L.found;status.textContent=L.found;draw();
        if(origin==='keyboard'||origin==='button')reveal.focus();
      }else{
        state.localized=false;reveal.hidden=true;status.textContent=L.miss+' '+L.desc(d,relativeWord(radiant(s)));draw();
      }
      updateDesc();
    }
    function fact(dl,a,b){dl.append(h('dt',{text:a}),h('dd',{text:b===undefined||b===null?'—':String(b)}))}
    function revealCurrent(){
      if(!state.localized)return;var s=shower(),name=lang==='es'?s.name_es:s.name_en;
      state.revealed=true;state.found[s.iau_code]=true;save();updateUI();
      panel.replaceChildren();
      panel.append(h('div',{class:'met-actions'},h('span',{class:'met-chip',text:L.real}),h('span',{class:'met-chip',text:L.rep})));
      panel.append(h('h2',{text:name}));
      var grid=h('div',{class:'met-reveal-grid'}),img=h('img',{class:'met-reveal-img',src:'/img/intereses/meteoros/r01/'+s.file,alt:L.imageAlt(name),loading:'lazy',decoding:'async'});
      var dl=h('dl',{class:'met-facts'});fact(dl,L.name,name+' · '+s.iau_code);fact(dl,L.period,s.activity_period_2026);fact(dl,L.peak,s.peak_2026);
      fact(dl,L.zhr,s.zhr);fact(dl,L.speed,s.velocity_km_s+' km/s');fact(dl,L.radiant,s.radiant_ra+' · '+s.radiant_dec);fact(dl,L.parent,s.parent_body);fact(dl,L.status,s.parent_status);
      var info=h('div',{},dl,h('p',{class:'met-note',text:L.zhrNote}));
      if(s.parent_note)info.append(h('p',{class:'met-note',text:s.parent_note}));
      if(/suspected|not treated as settled/i.test(s.parent_status||''))info.append(h('p',{class:'met-note',text:L.parentCaveat}));
      grid.append(img,info);panel.append(grid,h('h3',{text:L.sources}),h('p',{class:'met-note',text:L.sourceText}),h('p',{class:'met-epistemic',text:L.epistemic}),
        h('div',{class:'met-actions'},h('button',{type:'button',class:'met-btn met-btn-primary',text:L.next,on:{click:function(){setIndex(state.i+1);stage.focus()}}})));
      panel.hidden=false;wrap.classList.add('has-panel');status.textContent=(state.found[s.iau_code]?L.already:'')||'';draw();
    }
    reveal.addEventListener('click',revealCurrent);
    describe.addEventListener('click',function(){state.describe=!state.describe;describe.setAttribute('aria-pressed',String(state.describe));desc.hidden=!state.describe;updateDesc()});
    motion.addEventListener('change',function(){state.motion=motion.value;state.motionExplicit=true;save();syncRAF()});

    var start=null;
    function point(ev){var r=canvas.getBoundingClientRect();return{x:ev.clientX-r.left,y:ev.clientY-r.top}}
    canvas.addEventListener('pointerdown',function(ev){if(ev.button!==undefined&&ev.button!==0)return;start={x:ev.clientX,y:ev.clientY,lastX:ev.clientX,lastY:ev.clientY,moved:false};try{canvas.setPointerCapture(ev.pointerId)}catch(e){}});
    canvas.addEventListener('pointermove',function(ev){
      if(!start)return;var dx=ev.clientX-start.lastX,dy=ev.clientY-start.lastY;start.lastX=ev.clientX;start.lastY=ev.clientY;
      if(Math.hypot(ev.clientX-start.x,ev.clientY-start.y)>6)start.moved=true;
      if(start.moved){state.camera.ra=mod(state.camera.ra-dx*(state.camera.fov/Math.max(1,stage.clientWidth))/15,24);state.camera.dec=clamp(state.camera.dec+dy*(state.camera.fov/Math.max(1,stage.clientHeight)),-85,85);state.localized=false;reveal.hidden=true;updateDesc();draw()}
    });
    canvas.addEventListener('pointerup',function(ev){if(!start)return;var moved=start.moved;start=null;if(!moved)examine(point(ev),'pointer')});
    canvas.addEventListener('pointercancel',function(){start=null});
    stage.addEventListener('keydown',function(ev){
      if(ev.ctrlKey||ev.metaKey||ev.altKey)return;var ok=true;
      if(ev.key==='ArrowLeft')turn(5/15,0);else if(ev.key==='ArrowRight')turn(-5/15,0);else if(ev.key==='ArrowUp')turn(0,5);else if(ev.key==='ArrowDown')turn(0,-5);
      else if(ev.key==='+'||ev.key==='=')zoom(1.25);else if(ev.key==='-'||ev.key==='_')zoom(1/1.25);
      else if(ev.key==='Enter'){var m=canvasSize();examine({x:m.W/2,y:m.H/2},'keyboard')}else ok=false;
      if(ok)ev.preventDefault();
    });
    stage.addEventListener('wheel',function(ev){if(document.activeElement!==stage)return;ev.preventDefault();zoom(ev.deltaY<0?1.18:1/1.18)},{passive:false});

    function starRows(cielo){
      return (cielo.estrellas||[]).filter(function(x){return x[2]<=5.6}).map(function(x){return{v:dir(x[0],x[1]),mag:x[2],ci:x[3]}})
    }
    Promise.all([
      fetch('/assets/data/meteoros/r01/meteor_showers_2026_verified.json',{credentials:'same-origin'}).then(function(r){if(!r.ok)throw Error('meteors '+r.status);return r.json()}),
      fetch('/es/intereses/cielo/cielo.json',{credentials:'same-origin'}).then(function(r){if(!r.ok)throw Error('sky '+r.status);return r.json()})
    ]).then(function(a){
      state.showers=a[0].showers||[];state.stars=starRows(a[1]);state.i=state.showers.length?state.i%state.showers.length:0;resetCamera();updateUI();syncRAF();
      ro=new ResizeObserver(function(){draw();updateDesc()});ro.observe(stage);
    }).catch(function(){status.textContent=L.loadFail;objective.textContent=L.loadFail});

    document.addEventListener('visibilitychange',syncRAF);
    return{
      state:state,
      next:function(){setIndex(state.i+1)},
      previous:function(){setIndex(state.i-1)},
      setMotion:function(x){if(MOTION[x]){state.motion=x;motion.value=x;syncRAF()}},
      snapshot:function(){return{index:state.i,found:Object.keys(state.found),camera:Object.assign({},state.camera),motion:state.motion}},
      destroy:function(){state.alive=false;if(state.raf)cancelAnimationFrame(state.raf);if(ro)ro.disconnect();host.replaceChildren()}
    };
  }

  g.IGMeteorosR03={mount:mount,parseRA:parseRA,parseDec:parseDec,aDireccion:dir,angle:angle};
})(window);
