/* Iris Green · R40 Workshop · shared engines for the 17 new studios.
   All tools run in-browser. Audio starts only from an explicit button. No network calls. */
(function(root,factory){
  var api=factory(root);
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.IGTallerR40=api;
  if(root&&root.document) api.autoMount();
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';
  var TOOL_KINDS=['pattern','pixel','colour','comic','architecture','origami','game','simulation','rhythm','composition','synthesis','writing','worlds','conlang','board','photo','fashion'];
  function byId(id){var c=root.IGTallerR40Catalog||[];for(var i=0;i<c.length;i++)if(c[i].id===id)return c[i];return null;}
  function L(es,en){return root.document&&String(root.document.documentElement.lang||'es').slice(0,2)==='en'?en:es;}
  function deep(v){return JSON.parse(JSON.stringify(v));}
  function clamp(v,a,b){v=Number(v);return isFinite(v)?Math.max(a,Math.min(b,v)):a;}
  function hexRgb(h){h=String(h||'').replace('#','');if(h.length===3)h=h.replace(/(.)/g,'$1$1');var n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255];}
  function luminance(hex){return hexRgb(hex).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce(function(s,v,i){return s+v*[.2126,.7152,.0722][i];},0);}
  function contrastRatio(a,b){var x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function lifeStep(cells,w,h){
    var out=new Array(cells.length).fill(false);
    for(var y=0;y<h;y++)for(var x=0;x<w;x++){var n=0;for(var yy=-1;yy<=1;yy++)for(var xx=-1;xx<=1;xx++)if((xx||yy)&&cells[((y+yy+h)%h)*w+((x+xx+w)%w)])n++;
      var live=!!cells[y*w+x];out[y*w+x]=live?(n===2||n===3):n===3;}
    return out;
  }
  function defaultState(kind){
    if(kind==='pattern')return {repeat:6,symmetry:'mirror',depth:2,fg:'#5a49a8',bg:'#f7f5ff'};
    if(kind==='pixel')return {size:16,color:'#17395c',frame:0,frames:[new Array(256).fill('')]};
    if(kind==='colour')return {colors:['#17395c','#2f80ed','#8a5ad8','#f2b5d4','#ffffff'],fg:'#17395c',bg:'#ffffff'};
    if(kind==='comic')return {panels:Array.from({length:4},function(){return {shot:'medium',caption:''};})};
    if(kind==='architecture')return {tool:'wall',w:12,h:8,cells:new Array(96).fill('')};
    if(kind==='origami')return {solid:'cube',folds:true};
    if(kind==='game')return {w:12,h:8,cells:new Array(96).fill(''),tool:'wall',player:0,goal:95,play:false};
    if(kind==='simulation')return {w:20,h:12,cells:new Array(240).fill(false),running:false,steps:0};
    if(kind==='rhythm')return {bpm:100,tracks:Array.from({length:4},function(){return new Array(16).fill(false);})};
    if(kind==='composition')return {bpm:90,notes:Array.from({length:12},function(){return new Array(16).fill(false);})};
    if(kind==='synthesis')return {wave:'sine',freq:220,filter:1800,duration:1,preset:'tone'};
    if(kind==='writing')return {rule:'50words',text:''};
    if(kind==='worlds')return {w:12,h:8,cells:new Array(96).fill('water'),tool:'land',species:[],history:[]};
    if(kind==='conlang')return {alphabet:'a e i o u p t k m n s l r',grammar:'',words:[]};
    if(kind==='board')return {size:8,tool:'a',cells:new Array(64).fill(''),rules:''};
    if(kind==='photo')return {name:'',zoom:1,guide:'thirds',dataUrl:''};
    if(kind==='fashion')return {garment:'shirt',base:'#d7c9f2',accent:'#17395c',pattern:'stripes'};
    return {};
  }
  function challengeList(study,lang){
    var a=study&&study.challenges&&study.challenges[lang]||[];
    return a.map(function(text,i){return {id:study.id+'-c'+(i+1),level:i+1,levelName:L('Paso '+(i+1),'Step '+(i+1)),title:text,goal:text,limits:[],tip:''};});
  }
  function h(tag,attrs,children){return root.IGT.h(tag,attrs,children);}
  function field(label,control){return h('label',{class:'igt-r40-field'},[h('span',{text:label}),control]);}
  function button(label,fn,pressed){return root.IGT.btn(label,{onClick:fn,pressed:pressed});}
  function gridButtons(count,className,on,labels){
    var box=h('div',{class:className,role:'grid'});
    for(var i=0;i<count;i++)(function(i){box.appendChild(h('button',{type:'button',class:'igt-r40-cell',role:'gridcell','aria-label':labels?labels(i):String(i+1),on:{click:function(){on(i);}}}));})(i);
    return box;
  }
  function svgDownload(name,svg){root.IGT.download(name,new Blob([svg],{type:'image/svg+xml'}));}
  function jsonDownload(name,data){root.IGT.download(name,new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));}
  function audioContext(){var C=root.AudioContext||root.webkitAudioContext;return C?new C():null;}
  function playTone(freq,dur,wave,filter){
    var modern=root.IGTallerR42Platform;
    if(modern&&typeof modern.tone==='function'){
      modern.tone(freq||220,dur||.2,wave||'sine',filter||1800).catch(function(){playToneFallback(freq,dur,wave,filter);});
      return;
    }
    playToneFallback(freq,dur,wave,filter);
  }
  function playToneFallback(freq,dur,wave,filter){
    var ac=audioContext();if(!ac){root.IGT.say(L('Audio no disponible.','Audio is not available.'));return;}
    var o=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();o.type=wave||'sine';o.frequency.value=freq||220;f.type='lowpass';f.frequency.value=filter||1800;
    g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.12,ac.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+dur);
    o.connect(f);f.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+dur+.03);o.onended=function(){ac.close();};
  }
  function renderPattern(host,state,changed){
    var controls=h('div',{class:'igt-r40-controls'});
    var sym=h('select',{},['mirror','radial','tessellate','fractal'].map(function(x){var o=h('option',{value:x,text:x});if(x===state.symmetry)o.selected=true;return o;}));
    sym.onchange=function(){state.symmetry=sym.value;changed();};var rep=h('input',{type:'range',min:2,max:16,value:state.repeat});
    rep.oninput=function(){state.repeat=+rep.value;draw();};rep.onchange=changed;
    var fg=h('input',{type:'color',value:state.fg}),bg=h('input',{type:'color',value:state.bg});fg.oninput=function(){state.fg=fg.value;draw();};fg.onchange=changed;bg.oninput=function(){state.bg=bg.value;draw();};bg.onchange=changed;
    controls.appendChild(field(L('Regla','Rule'),sym));controls.appendChild(field(L('Repeticiones','Repeats'),rep));controls.appendChild(field(L('Trazo','Mark'),fg));controls.appendChild(field(L('Fondo','Background'),bg));
    var svg=h('svg',{class:'igt-r40-canvas',viewBox:'0 0 600 360',role:'img','aria-label':L('Patrón generado','Generated pattern')});
    host.appendChild(controls);host.appendChild(svg);host.appendChild(button(L('Guardar SVG','Save SVG'),function(){svgDownload('iris-green-pattern.svg',svg.outerHTML);}));
    function draw(){root.IGT.clear(svg);svg.style.background=state.bg;for(var i=0;i<state.repeat;i++){var a=2*Math.PI*i/state.repeat,x=300+Math.cos(a)*110,y=180+Math.sin(a)*110;svg.appendChild(h('rect',{x:x-28,y:y-28,width:56,height:56,rx:state.symmetry==='tessellate'?0:14,fill:state.fg,transform:'rotate('+(i*360/state.repeat)+' '+x+' '+y+')'}));if(state.symmetry==='fractal')svg.appendChild(h('circle',{cx:x,cy:y,r:12+(i%3)*8,fill:state.bg,stroke:state.fg,'stroke-width':4}));}}
    draw();
  }
  function renderPixel(host,state,changed){
    var top=h('div',{class:'igt-r40-controls'}),color=h('input',{type:'color',value:state.color});color.oninput=function(){state.color=color.value;};
    top.appendChild(field(L('Color','Colour'),color));top.appendChild(button(L('Fotograma nuevo','New frame'),function(){state.frames.push(state.frames[state.frame].slice());state.frame=state.frames.length-1;changed();render();}));
    var wrap=h('div');host.appendChild(top);host.appendChild(wrap);
    function render(){root.IGT.clear(wrap);var label=h('p',{text:L('Fotograma ','Frame ')+(state.frame+1)+' / '+state.frames.length});wrap.appendChild(label);
      var g=gridButtons(256,'igt-r40-pixel',function(i){state.frames[state.frame][i]=state.frames[state.frame][i]? '':state.color;changed();paint();},function(i){return L('Píxel ','Pixel ')+(i+1);});wrap.appendChild(g);
      function paint(){var bs=g.querySelectorAll('button');for(var i=0;i<bs.length;i++)bs[i].style.background=state.frames[state.frame][i]||'#fff';}paint();
      wrap.appendChild(button(L('Fotograma anterior','Previous frame'),function(){state.frame=Math.max(0,state.frame-1);render();}));
      wrap.appendChild(button(L('Fotograma siguiente','Next frame'),function(){state.frame=Math.min(state.frames.length-1,state.frame+1);render();}));
      wrap.appendChild(button(L('Guardar PNG','Save PNG'),function(){var c=root.document.createElement('canvas');c.width=c.height=state.size;var x=c.getContext('2d'),f=state.frames[state.frame];for(var i=0;i<f.length;i++){x.fillStyle=f[i]||'#fff';x.fillRect(i%state.size,Math.floor(i/state.size),1,1);}c.toBlob(function(b){if(b)root.IGT.download('iris-green-pixel.png',b);},'image/png');}));
    }render();
  }
  function renderColour(host,state,changed){
    var row=h('div',{class:'igt-r40-palette'}),out=h('p',{class:'igt-r40-result'});
    state.colors.forEach(function(c,i){var inp=h('input',{type:'color',value:c,'aria-label':L('Color ','Colour ')+(i+1)});inp.oninput=function(){state.colors[i]=inp.value;draw();};inp.onchange=changed;row.appendChild(inp);});
    var fg=h('select'),bg=h('select');state.colors.forEach(function(c,i){fg.appendChild(h('option',{value:i,text:L('Color ','Colour ')+(i+1)}));bg.appendChild(h('option',{value:i,text:L('Color ','Colour ')+(i+1)}));});bg.value='4';
    fg.onchange=draw;bg.onchange=draw;host.appendChild(row);host.appendChild(field(L('Texto','Text'),fg));host.appendChild(field(L('Fondo','Background'),bg));host.appendChild(out);
    host.appendChild(button(L('Guardar paleta','Save palette'),function(){jsonDownload('iris-green-palette.json',{colors:state.colors});}));
    function draw(){var r=contrastRatio(state.colors[+fg.value],state.colors[+bg.value]);out.textContent=L('Contraste: ','Contrast: ')+r.toFixed(2)+':1';out.style.color=state.colors[+fg.value];out.style.background=state.colors[+bg.value];}draw();
  }
  function renderComic(host,state,changed){
    var grid=h('div',{class:'igt-r40-comic'});host.appendChild(grid);
    state.panels.forEach(function(p,i){var card=h('section',{class:'igt-r40-panel'}),sel=h('select'),ta=h('textarea',{placeholder:L('Texto o acción del panel','Panel text or action')});
      ['wide','medium','close'].forEach(function(x){var o=h('option',{value:x,text:x});if(p.shot===x)o.selected=true;sel.appendChild(o);});ta.value=p.caption;
      sel.onchange=function(){p.shot=sel.value;changed();};ta.oninput=function(){p.caption=ta.value;};ta.onchange=changed;
      card.appendChild(h('h3',{text:L('Viñeta ','Panel ')+(i+1)}));card.appendChild(sel);card.appendChild(ta);grid.appendChild(card);});
    host.appendChild(button(L('Imprimir página','Print page'),function(){root.print();}));
  }
  function renderArchitecture(host,state,changed){
    var controls=h('div',{class:'igt-r40-controls'});['wall','door','window','empty'].forEach(function(x){controls.appendChild(button(x,function(){state.tool=x;},state.tool===x));});host.appendChild(controls);
    var grid=gridButtons(state.cells.length,'igt-r40-floor',function(i){state.cells[i]=state.tool==='empty'?'':state.tool;changed();paint();},function(i){return L('Casilla ','Cell ')+(i+1);});host.appendChild(grid);
    var preview=h('div',{class:'igt-r40-building','aria-label':L('Vista volumétrica esquemática','Schematic volume view')});host.appendChild(preview);
    host.appendChild(button(L('Guardar plano PNG','Save plan PNG'),function(){var c=root.document.createElement('canvas');c.width=600;c.height=400;var x=c.getContext('2d'),cw=50,ch=50;state.cells.forEach(function(v,i){var xx=(i%state.w)*cw,yy=Math.floor(i/state.w)*ch;x.strokeStyle='#8aa0b5';x.strokeRect(xx,yy,cw,ch);if(v){x.fillStyle=v==='wall'?'#17395c':v==='door'?'#b07a45':'#7fc7e8';x.fillRect(xx+4,yy+4,cw-8,ch-8);}});c.toBlob(function(b){if(b)root.IGT.download('iris-green-plan.png',b);});}));
    function paint(){var bs=grid.querySelectorAll('button'),n=0;for(var i=0;i<bs.length;i++){bs[i].dataset.type=state.cells[i];if(state.cells[i])n++;}preview.textContent=L('Elementos del plano: ','Plan elements: ')+n;}paint();
  }
  function renderOrigami(host,state,changed){
    var sel=h('select');['cube','tetrahedron','octahedron'].forEach(function(x){var o=h('option',{value:x,text:x});if(x===state.solid)o.selected=true;sel.appendChild(o);});sel.onchange=function(){state.solid=sel.value;changed();draw();};host.appendChild(field(L('Sólido','Solid'),sel));
    var svg=h('svg',{viewBox:'0 0 600 360',class:'igt-r40-canvas',role:'img','aria-label':L('Desarrollo imprimible','Printable net')});host.appendChild(svg);
    host.appendChild(button(L('Imprimir desarrollo','Print net'),function(){root.print();}));
    function poly(points){svg.appendChild(h('polygon',{points:points,fill:'#f4efff',stroke:'#17395c','stroke-width':3}));}
    function draw(){root.IGT.clear(svg);if(state.solid==='cube'){[[200,80],[260,80],[320,80],[260,20],[260,140],[260,200]].forEach(function(p){svg.appendChild(h('rect',{x:p[0],y:p[1],width:60,height:60,fill:'#f4efff',stroke:'#17395c','stroke-width':3}));});}
      else if(state.solid==='tetrahedron'){poly('300,50 230,170 370,170');poly('230,170 160,290 300,290');poly('370,170 300,290 440,290');poly('230,170 300,290 370,170');}
      else{for(var i=0;i<8;i++){var x=120+(i%4)*95,y=80+Math.floor(i/4)*120;poly(x+','+(y+90)+' '+(x+45)+','+y+' '+(x+90)+','+(y+90));}}}draw();
  }
  function renderGame(host,state,changed){
    var tools=h('div',{class:'igt-r40-controls'});['wall','empty','player','goal'].forEach(function(x){tools.appendChild(button(x,function(){state.tool=x;},false));});host.appendChild(tools);
    var grid=gridButtons(state.cells.length,'igt-r40-game',function(i){if(state.play)return;if(state.tool==='player')state.player=i;else if(state.tool==='goal')state.goal=i;else state.cells[i]=state.tool==='wall'?'wall':'';changed();paint();},function(i){return L('Casilla ','Cell ')+(i+1);});host.appendChild(grid);
    var status=h('p',{role:'status'});host.appendChild(button(L('Probar nivel','Play level'),function(){state.play=true;paint();grid.focus&&grid.focus();}));host.appendChild(button(L('Editar','Edit'),function(){state.play=false;paint();}));host.appendChild(status);
    root.document.addEventListener('keydown',function(e){if(!state.play||!/^Arrow/.test(e.key))return;var x=state.player%state.w,y=Math.floor(state.player/state.w);if(e.key==='ArrowLeft')x--;if(e.key==='ArrowRight')x++;if(e.key==='ArrowUp')y--;if(e.key==='ArrowDown')y++;if(x<0||x>=state.w||y<0||y>=state.h)return;var n=y*state.w+x;if(state.cells[n]==='wall')return;state.player=n;paint();if(n===state.goal)status.textContent=L('Meta alcanzada.','Goal reached.');});
    function paint(){var bs=grid.querySelectorAll('button');for(var i=0;i<bs.length;i++){bs[i].dataset.type=state.cells[i]||'';bs[i].textContent=i===state.player?'●':i===state.goal?'★':'';}}paint();
  }
  function renderSimulation(host,state,changed){
    var grid=gridButtons(state.cells.length,'igt-r40-sim',function(i){if(state.running)return;state.cells[i]=!state.cells[i];changed();paint();},function(i){return L('Célula ','Cell ')+(i+1);});host.appendChild(grid);var timer=null,status=h('p',{role:'status'}),busy=false;host.appendChild(status);
    async function step(){
      if(busy)return;busy=true;
      try{
        var modern=root.IGTallerR42Platform;
        state.cells=modern&&typeof modern.lifeStep==='function'?await modern.lifeStep(state.cells,state.w,state.h,1):lifeStep(state.cells,state.w,state.h);
        state.steps++;paint();status.textContent=L('Paso ','Step ')+state.steps;
      }finally{busy=false;}
    }
    host.appendChild(button(L('Paso','Step'),function(){step().then(changed);}));host.appendChild(button(L('Iniciar','Start'),function(){if(timer)return;state.running=true;timer=setInterval(step,350);}));
    host.appendChild(button(L('Parar','Stop'),function(){if(timer)clearInterval(timer);timer=null;state.running=false;changed();}));
    function paint(){var bs=grid.querySelectorAll('button');for(var i=0;i<bs.length;i++)bs[i].dataset.live=state.cells[i]?'true':'false';}paint();
  }
  function renderRhythm(host,state,changed){
    var bpm=h('input',{type:'range',min:50,max:180,value:state.bpm});bpm.oninput=function(){state.bpm=+bpm.value;};bpm.onchange=changed;host.appendChild(field('BPM',bpm));
    var grid=h('div',{class:'igt-r40-sequencer',role:'grid'});state.tracks.forEach(function(row,r){row.forEach(function(on,c){var b=h('button',{type:'button','aria-label':L('Pista ','Track ')+(r+1)+', '+L('paso ','step ')+(c+1)});b.dataset.on=on?'true':'false';b.onclick=function(){row[c]=!row[c];b.dataset.on=row[c]?'true':'false';changed();};grid.appendChild(b);});});host.appendChild(grid);
    var stop=false;host.appendChild(button(L('Escuchar','Play'),function(){stop=false;var step=0,ms=60000/state.bpm/4;function tick(){if(stop||step>=16)return;state.tracks.forEach(function(r,i){if(r[step])playTone([110,165,220,330][i],.08,'sine',1500);});step++;setTimeout(tick,ms);}tick();}));
    host.appendChild(button(L('Parar','Stop'),function(){stop=true;}));
  }
  function renderComposition(host,state,changed){
    var grid=h('div',{class:'igt-r40-piano',role:'grid'});state.notes.forEach(function(row,r){row.forEach(function(on,c){var b=h('button',{type:'button','aria-label':L('Nota ','Note ')+(r+1)+', '+L('paso ','step ')+(c+1)});b.dataset.on=on?'true':'false';b.onclick=function(){row[c]=!row[c];b.dataset.on=row[c]?'true':'false';changed();};grid.appendChild(b);});});host.appendChild(grid);
    var stop=false;host.appendChild(button(L('Escuchar','Play'),function(){stop=false;var step=0,ms=60000/state.bpm/4;function tick(){if(stop||step>=16)return;state.notes.forEach(function(r,i){if(r[step])playTone(220*Math.pow(2,i/12),.15,'triangle',2200);});step++;setTimeout(tick,ms);}tick();}));
    host.appendChild(button(L('Parar','Stop'),function(){stop=true;}));
  }
  function renderSynthesis(host,state,changed){
    var wave=h('select');['sine','triangle','square','sawtooth'].forEach(function(x){var o=h('option',{value:x,text:x});if(x===state.wave)o.selected=true;wave.appendChild(o);});wave.onchange=function(){state.wave=wave.value;changed();};
    var freq=h('input',{type:'range',min:60,max:1200,value:state.freq}),filter=h('input',{type:'range',min:200,max:6000,value:state.filter}),dur=h('input',{type:'range',min:.1,max:3,step:.1,value:state.duration});
    freq.oninput=function(){state.freq=+freq.value;};filter.oninput=function(){state.filter=+filter.value;};dur.oninput=function(){state.duration=+dur.value;};freq.onchange=filter.onchange=dur.onchange=changed;
    host.appendChild(field(L('Onda','Wave'),wave));host.appendChild(field(L('Frecuencia','Frequency'),freq));host.appendChild(field(L('Filtro','Filter'),filter));host.appendChild(field(L('Duración','Duration'),dur));
    host.appendChild(button(L('Escuchar sonido','Play sound'),function(){playTone(state.freq,state.duration,state.wave,state.filter);}));
  }
  function renderWriting(host,state,changed){
    var sel=h('select');[['50words',L('50 palabras','50 words')],['noe',L('Sin la letra e','Without the letter e')],['fixed',L('Tres párrafos','Three paragraphs')]].forEach(function(x){var o=h('option',{value:x[0],text:x[1]});if(x[0]===state.rule)o.selected=true;sel.appendChild(o);});sel.onchange=function(){state.rule=sel.value;changed();check();};
    var ta=h('textarea',{class:'igt-r40-writing',placeholder:L('Escribe aquí…','Write here…')}),out=h('p',{role:'status'});ta.value=state.text;ta.oninput=function(){state.text=ta.value;check();};ta.onchange=changed;
    host.appendChild(field(L('Regla','Constraint'),sel));host.appendChild(ta);host.appendChild(out);
    function check(){var w=state.text.trim()?state.text.trim().split(/\s+/).length:0,ok=state.rule==='50words'?w===50:state.rule==='noe'?!/[eéèëê]/i.test(state.text):state.text.split(/\n\s*\n/).filter(Boolean).length===3;out.textContent=(ok?'✓ ':'· ')+L('Palabras: ','Words: ')+w;}check();
  }
  function renderWorlds(host,state,changed){
    var tools=h('div',{class:'igt-r40-controls'});['water','land','mountain','city'].forEach(function(x){tools.appendChild(button(x,function(){state.tool=x;}));});host.appendChild(tools);
    var grid=gridButtons(state.cells.length,'igt-r40-world',function(i){state.cells[i]=state.tool;changed();paint();},function(i){return L('Mapa ','Map ')+(i+1);});host.appendChild(grid);
    var sp=h('input',{type:'text',placeholder:L('Nueva especie','New species')}),add=button(L('Añadir especie','Add species'),function(){if(sp.value.trim()){state.species.push(sp.value.trim().slice(0,80));sp.value='';changed();list();}});
    var ul=h('ul');host.appendChild(sp);host.appendChild(add);host.appendChild(ul);
    function paint(){var bs=grid.querySelectorAll('button');for(var i=0;i<bs.length;i++)bs[i].dataset.type=state.cells[i];}function list(){root.IGT.clear(ul);state.species.forEach(function(x){ul.appendChild(h('li',{text:x}));});}paint();list();
  }
  function renderConlang(host,state,changed){
    var alpha=h('input',{type:'text',value:state.alphabet}),grammar=h('textarea',{placeholder:L('Reglas de gramática','Grammar rules')}),word=h('input',{type:'text',placeholder:L('Palabra','Word')}),meaning=h('input',{type:'text',placeholder:L('Significado','Meaning')}),ul=h('ul');
    grammar.value=state.grammar;alpha.onchange=function(){state.alphabet=alpha.value.slice(0,500);changed();};grammar.onchange=function(){state.grammar=grammar.value.slice(0,5000);changed();};
    host.appendChild(field(L('Sonidos / alfabeto','Sounds / alphabet'),alpha));host.appendChild(grammar);host.appendChild(word);host.appendChild(meaning);
    host.appendChild(button(L('Añadir al diccionario','Add to dictionary'),function(){if(word.value.trim()&&meaning.value.trim()){state.words.push({word:word.value.trim().slice(0,80),meaning:meaning.value.trim().slice(0,160)});word.value=meaning.value='';changed();draw();}}));host.appendChild(ul);
    function draw(){root.IGT.clear(ul);state.words.forEach(function(x){ul.appendChild(h('li',{text:x.word+' — '+x.meaning}));});}draw();
  }
  function renderBoard(host,state,changed){
    var tools=h('div',{class:'igt-r40-controls'});['a','b','empty'].forEach(function(x){tools.appendChild(button(x,function(){state.tool=x;}));});host.appendChild(tools);
    var grid=gridButtons(state.cells.length,'igt-r40-board',function(i){state.cells[i]=state.tool==='empty'?'':state.tool;changed();paint();},function(i){return L('Casilla ','Cell ')+(i+1);});host.appendChild(grid);
    var rules=h('textarea',{placeholder:L('Escribe las reglas del juego','Write the game rules')});rules.value=state.rules;rules.onchange=function(){state.rules=rules.value.slice(0,10000);changed();};host.appendChild(rules);host.appendChild(button(L('Imprimir tablero','Print board'),function(){root.print();}));
    function paint(){var bs=grid.querySelectorAll('button');for(var i=0;i<bs.length;i++){bs[i].dataset.token=state.cells[i];bs[i].textContent=state.cells[i]==='a'?'●':state.cells[i]==='b'?'○':'';}}paint();
  }
  function renderPhoto(host,state,changed){
    var file=h('input',{type:'file',accept:'image/*'}),zoom=h('input',{type:'range',min:.5,max:3,step:.05,value:state.zoom}),canvas=h('canvas',{width:800,height:500,class:'igt-r40-photo',role:'img','aria-label':L('Vista previa de la fotografía','Photo preview')});
    var img=new Image();host.appendChild(file);host.appendChild(field(L('Zoom','Zoom'),zoom));host.appendChild(canvas);
    file.onchange=function(){var f=file.files&&file.files[0];if(!f)return;if(f.size>4*1024*1024){root.IGT.say(L('La imagen es demasiado grande.','The image is too large.'));return;}var r=new FileReader();r.onload=function(){state.dataUrl=String(r.result);state.name=f.name;img.onload=draw;img.src=state.dataUrl;changed();};r.readAsDataURL(f);};
    zoom.oninput=function(){state.zoom=+zoom.value;draw();};zoom.onchange=changed;
    host.appendChild(button(L('Guardar composición PNG','Save composition PNG'),function(){canvas.toBlob(function(b){if(b)root.IGT.download('iris-green-photo.png',b);},'image/png');}));
    function draw(){var x=canvas.getContext('2d');x.fillStyle='#eef3f8';x.fillRect(0,0,800,500);if(img.complete&&img.naturalWidth){var sc=Math.max(800/img.naturalWidth,500/img.naturalHeight)*state.zoom,w=img.naturalWidth*sc,hg=img.naturalHeight*sc;x.drawImage(img,(800-w)/2,(500-hg)/2,w,hg);}x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=2;x.beginPath();x.moveTo(800/3,0);x.lineTo(800/3,500);x.moveTo(1600/3,0);x.lineTo(1600/3,500);x.moveTo(0,500/3);x.lineTo(800,500/3);x.moveTo(0,1000/3);x.lineTo(800,1000/3);x.stroke();}draw();
  }
  function renderFashion(host,state,changed){
    var garment=h('select');['shirt','dress','jacket'].forEach(function(x){var o=h('option',{value:x,text:x});if(x===state.garment)o.selected=true;garment.appendChild(o);});var base=h('input',{type:'color',value:state.base}),accent=h('input',{type:'color',value:state.accent}),pattern=h('select');
    ['stripes','dots','grid'].forEach(function(x){var o=h('option',{value:x,text:x});if(x===state.pattern)o.selected=true;pattern.appendChild(o);});
    garment.onchange=function(){state.garment=garment.value;changed();draw();};base.oninput=function(){state.base=base.value;draw();};base.onchange=changed;accent.oninput=function(){state.accent=accent.value;draw();};accent.onchange=changed;pattern.onchange=function(){state.pattern=pattern.value;changed();draw();};
    host.appendChild(field(L('Prenda','Garment'),garment));host.appendChild(field(L('Color base','Base colour'),base));host.appendChild(field(L('Color de motivo','Pattern colour'),accent));host.appendChild(field(L('Estampado','Pattern'),pattern));
    var svg=h('svg',{viewBox:'0 0 600 500',class:'igt-r40-canvas',role:'img','aria-label':L('Diseño textil','Textile design')});host.appendChild(svg);host.appendChild(button(L('Guardar SVG','Save SVG'),function(){svgDownload('iris-green-fashion.svg',svg.outerHTML);}));
    function draw(){root.IGT.clear(svg);var defs=h('defs'),pat=h('pattern',{id:'p',width:40,height:40,patternUnits:'userSpaceOnUse'});pat.appendChild(h('rect',{width:40,height:40,fill:state.base}));if(state.pattern==='stripes')pat.appendChild(h('path',{d:'M0 0L40 40M-10 10L10 -10M30 50L50 30',stroke:state.accent,'stroke-width':10}));else if(state.pattern==='dots')pat.appendChild(h('circle',{cx:20,cy:20,r:8,fill:state.accent}));else{pat.appendChild(h('path',{d:'M20 0V40M0 20H40',stroke:state.accent,'stroke-width':4}));}defs.appendChild(pat);svg.appendChild(defs);var d=state.garment==='dress'?'M230 70L370 70L410 430L190 430Z':state.garment==='jacket'?'M220 80L380 80L450 170L390 210L370 450L230 450L210 210L150 170Z':'M220 90L380 90L470 180L410 240L370 200L370 430L230 430L230 200L190 240L130 180Z';svg.appendChild(h('path',{d:d,fill:'url(#p)',stroke:'#17395c','stroke-width':6}));}draw();
  }
  var RENDERERS={pattern:renderPattern,pixel:renderPixel,colour:renderColour,comic:renderComic,architecture:renderArchitecture,origami:renderOrigami,game:renderGame,simulation:renderSimulation,rhythm:renderRhythm,composition:renderComposition,synthesis:renderSynthesis,writing:renderWriting,worlds:renderWorlds,conlang:renderConlang,board:renderBoard,photo:renderPhoto,fashion:renderFashion};
  function mountStudy(){
    var IGT=root.IGT,app=root.document&&root.document.querySelector('#igt-app[data-r40-generic="true"]');if(!IGT||!app)return;
    var study=byId(app.getAttribute('data-study-id'));if(!study||!RENDERERS[study.kind])return;IGT.mount();
    var lang=String(root.document.documentElement.lang||'es').slice(0,2)==='en'?'en':'es',state=defaultState(study.kind),initial=deep(state),tool=h('section',{class:'igt-r40-tool glass','aria-label':study.title[lang]});
    var history=new IGT.History(function(){return state;},function(s){state=s;render();},function(){bar.sync();});
    var bar=IGT.projectBar({studio:study.id,studyId:study.id,history:history,getData:function(){return {kind:study.kind,state:state};},getTitle:function(){return study.title[lang];},onOpen:function(data){if(!data||data.kind!==study.kind||!data.state)return;state=deep(data.state);history.reset();render();},onNew:function(){state=deep(initial);history.reset();render();},onPrint:true});
    var challenges=IGT.challenges({items:challengeList(study,lang)});
    var help=h('details',{class:'igt-r40-help glass'},[
      h('summary',{text:L('Ayuda y teclado','Help and keyboard')}),
      h('p',{text:L('Todos los controles se pueden recorrer con Tabulador. Activa botones con Intro o Espacio. En las cuadrículas, cada casilla es un botón; en el estudio de videojuegos, las flechas mueven al personaje durante la prueba.','All controls can be reached with Tab. Activate buttons with Enter or Space. In grids, every cell is a button; in the video-game studio, arrow keys move the character while testing.')}),
      h('p',{text:L('Puedes crear libremente, cambiar de reto cuando quieras, deshacer y guardar solo cuando tú lo decidas. No hay puntuación ni tiempo límite.','You can create freely, change challenge whenever you want, undo, and save only when you choose. There is no score or time limit.')})
    ]);
    app.appendChild(bar);app.appendChild(challenges);app.appendChild(tool);app.appendChild(help);
    function changed(before){history.commit(before===undefined?undefined:before);bar.sync();}
    function render(){IGT.clear(tool);var before=history.snapshot();RENDERERS[study.kind](tool,state,function(){history.commit(before);before=history.snapshot();bar.sync();});}
    render();
  }
  function mountIndex(){
    var host=root.document&&root.document.getElementById('igt-taller-index');if(!host)return;var input=host.querySelector('input[type="search"]'),details=host.querySelectorAll('details[data-area]');
    if(input)input.addEventListener('input',function(){var q=input.value.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu,'');details.forEach(function(d){var any=false;d.querySelectorAll('li[data-title]').forEach(function(li){var s=li.getAttribute('data-title');var ok=!q||s.indexOf(q)>=0;li.hidden=!ok;if(ok)any=true;});d.hidden=!any;if(q&&any)d.open=true;});});
  }
  function autoMount(){function go(){mountStudy();mountIndex();}if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',go,{once:true});else setTimeout(go,0);}
  return {TOOL_KINDS:TOOL_KINDS,defaultState:defaultState,challengeList:challengeList,contrastRatio:contrastRatio,lifeStep:lifeStep,autoMount:autoMount};
});
