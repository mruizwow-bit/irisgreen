/* R40-RINCON-R03 · biblioteca sonora first-party.
   12 sonidos generales + 9 ambientes de escena. Nada empieza solo.
   Síntesis Web Audio local: no son grabaciones reales. */
(function(window){
'use strict';
var AC=window.AudioContext||window.webkitAudioContext,ctx=null,master=null,noiseCache={};
function context(){
  if(!AC)return null;
  if(!ctx){
    ctx=new AC();
    master=ctx.createGain();master.gain.value=.82;
    var comp=ctx.createDynamicsCompressor();
    comp.threshold.value=-24;comp.knee.value=18;comp.ratio.value=3;comp.attack.value=.02;comp.release.value=.35;
    master.connect(comp);comp.connect(ctx.destination);
  }
  if(ctx.state==='suspended')ctx.resume().catch(function(){});
  return ctx;
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function rnd(a,b){return a+Math.random()*(b-a);}
function pick(a){return a[(Math.random()*a.length)|0];}
function noise(kind){
  if(noiseCache[kind])return noiseCache[kind];
  var c=context(),len=c.sampleRate*5,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0),last=0;
  if(kind==='brown'){
    for(var i=0;i<len;i++){last=(last+(Math.random()*2-1)*.025)/1.025;d[i]=last*3.1;}
  }else if(kind==='pink'){
    var b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for(var j=0;j<len;j++){var w=Math.random()*2-1;b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[j]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.105;b6=w*.115926;}
  }else for(var k=0;k<len;k++)d[k]=(Math.random()*2-1)*.55;
  noiseCache[kind]=b;return b;
}
function Voice(wet){
  var c=context(),v={alive:true,nodes:[],timers:[],out:c.createGain()};
  v.out.gain.value=0;
  v.out.connect(master);
  v.keep=function(n){v.nodes.push(n);return n;};
  v.later=function(fn,ms){var id=setTimeout(function(){if(v.alive)fn();},ms);v.timers.push(id);return id;};
  v.every=function(fn,min,max){function go(){if(!v.alive)return;fn();v.later(go,rnd(min,max));}v.later(go,rnd(min,max));};
  v.stop=function(sec){
    if(!v.alive)return;v.alive=false;v.timers.forEach(function(id){clearTimeout(id);clearInterval(id);});
    var t=c.currentTime,d=Math.max(.08,sec==null?1.5:sec);
    v.out.gain.cancelScheduledValues(t);v.out.gain.setValueAtTime(Math.max(.0001,v.out.gain.value),t);v.out.gain.exponentialRampToValueAtTime(.0001,t+d);
    setTimeout(function(){v.nodes.forEach(function(n){try{n.stop();}catch(e){}try{n.disconnect();}catch(e){}});try{v.out.disconnect();}catch(e){}},d*1000+180);
  };
  v.setLevel=function(level){var t=c.currentTime,l=clamp(level,0,1);v.out.gain.cancelScheduledValues(t);v.out.gain.setTargetAtTime(Math.max(.0001,l),t,.16);};
  return v;
}
function loopNoise(v,kind,filterType,freq,q,gain,pan){
  var c=context(),s=v.keep(c.createBufferSource()),f=c.createBiquadFilter(),g=c.createGain(),p=c.createStereoPanner?c.createStereoPanner():c.createGain();
  s.buffer=noise(kind);s.loop=true;s.loopStart=rnd(0,2.5);f.type=filterType;f.frequency.value=freq;f.Q.value=q||.6;g.gain.value=gain;
  if(p.pan)p.pan.value=pan||0;s.connect(f);f.connect(g);g.connect(p);p.connect(v.out);s.start(0,rnd(0,4));return{src:s,filter:f,gain:g,pan:p};
}
function softTone(v,freq,dur,gain,pan,type,attack){
  var c=context(),t=c.currentTime,o=c.createOscillator(),g=c.createGain(),p=c.createStereoPanner?c.createStereoPanner():c.createGain(),a=attack||.06;
  o.type=type||'sine';o.frequency.value=freq;if(p.pan)p.pan.value=pan||0;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(p);p.connect(v.out);o.start(t);o.stop(t+dur+.1);return o;
}
function drop(v,low,high,gain,pan){
  var c=context(),t=c.currentTime,f=rnd(low,high),o=c.createOscillator(),g=c.createGain(),p=c.createStereoPanner?c.createStereoPanner():c.createGain();
  o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*rnd(1.12,1.35),t+.11);
  if(p.pan)p.pan.value=pan==null?rnd(-.75,.75):pan;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+.18);
  o.connect(g);g.connect(p);p.connect(v.out);o.start(t);o.stop(t+.22);
}
function rain(v,windowMode,scale){
  scale=scale||1;
  var far=loopNoise(v,'pink','bandpass',windowMode?1150:1450,.42,.095*scale,-.2);
  var near=loopNoise(v,'white','highpass',windowMode?2600:2200,.4,.022*scale,.25);
  var low=loopNoise(v,'brown','lowpass',windowMode?260:330,.5,.045*scale,0);
  var c=context(),phase=0;
  v.every(function(){phase++;var t=c.currentTime;far.gain.gain.setTargetAtTime(rnd(.07,.12)*scale,t,.7);near.gain.gain.setTargetAtTime(rnd(.012,.028)*scale,t,.9);},900,2100);
  v.every(function(){drop(v,windowMode?1200:900,windowMode?2600:2200,rnd(.005,.014)*scale);},windowMode?550:750,windowMode?1700:2200);
}
function waves(v,scale){
  scale=scale||1;
  var body=loopNoise(v,'brown','lowpass',520,.45,.012*scale,-.1);
  var foam=loopNoise(v,'pink','bandpass',1900,.35,.002*scale,.18);
  var c=context();
  function cycle(){
    if(!v.alive)return;var t=c.currentTime,rise=rnd(2.4,3.5),crest=rnd(.8,1.4),fall=rnd(3.2,4.6),peak=rnd(.10,.15)*scale;
    body.gain.gain.cancelScheduledValues(t);body.gain.gain.setValueAtTime(.012*scale,t);body.gain.gain.linearRampToValueAtTime(peak,t+rise);body.gain.gain.setTargetAtTime(.018*scale,t+rise+crest,fall/3);
    foam.gain.gain.cancelScheduledValues(t);foam.gain.gain.setValueAtTime(.002*scale,t);foam.gain.gain.linearRampToValueAtTime(.035*scale,t+rise+.25);foam.gain.gain.setTargetAtTime(.002*scale,t+rise+crest,fall/3);
    v.later(cycle,(rise+crest+fall+rnd(.3,1.3))*1000);
  }cycle();
}
function stream(v,scale){
  scale=scale||1;
  var body=loopNoise(v,'brown','bandpass',420,.48,.11*scale,-.12);
  var rip=loopNoise(v,'pink','bandpass',1050,.38,.035*scale,.16),c=context();
  v.every(function(){var t=c.currentTime;body.filter.frequency.setTargetAtTime(rnd(320,520),t,.8);rip.filter.frequency.setTargetAtTime(rnd(850,1350),t,1.1);},1200,2600);
  v.every(function(){drop(v,280,850,rnd(.006,.015)*scale);},700,2300);
}
function breeze(v,scale){
  scale=scale||1;
  var air=loopNoise(v,'pink','bandpass',520,.35,.07*scale,0),c=context();
  v.every(function(){var t=c.currentTime;air.filter.frequency.setTargetAtTime(rnd(360,720),t,2.2);air.gain.gain.setTargetAtTime(rnd(.045,.085)*scale,t,2.4);},3500,7000);
}
function birds(v,scale,minGap,maxGap){
  scale=scale||1;minGap=minGap||3800;maxGap=maxGap||7500;
  loopNoise(v,'brown','lowpass',280,.45,.018*scale,0);
  v.every(function(){
    var base=pick([1760,1980,2210,2420]),pan=rnd(-.7,.7),n=Math.random()<.35?2:3;
    for(var i=0;i<n;i++)v.later(function(){var o=softTone(v,base*rnd(.96,1.04),.32,.011*scale,pan,'sine',.055);try{o.frequency.exponentialRampToValueAtTime(base*rnd(1.18,1.32),context().currentTime+.18);}catch(e){}},i*230);
  },minGap,maxGap);
}
function crickets(v,scale){
  scale=scale||1;var c=context(),groups=[{f:4050,p:-.55},{f:4380,p:.35},{f:4660,p:.65}];
  groups.forEach(function(g,idx){
    function phrase(){
      if(!v.alive)return;var count=2+((Math.random()*3)|0),t=c.currentTime;
      for(var n=0;n<count;n++){var o=c.createOscillator(),eg=c.createGain(),p=c.createStereoPanner?c.createStereoPanner():c.createGain();o.type='sine';o.frequency.value=g.f+rnd(-45,45);if(p.pan)p.pan.value=g.p+rnd(-.08,.08);var st=t+n*.095;eg.gain.setValueAtTime(.0001,st);eg.gain.exponentialRampToValueAtTime(.008*scale,st+.018);eg.gain.exponentialRampToValueAtTime(.0001,st+.07);o.connect(eg);eg.connect(p);p.connect(v.out);o.start(st);o.stop(st+.09);}
      v.later(phrase,rnd(1200+idx*350,2400+idx*650));
    }v.later(phrase,rnd(400,1800));
  });
}
function fireplace(v,scale){
  scale=scale||1;
  var ember=loopNoise(v,'brown','lowpass',240,.5,.075*scale,0);
  loopNoise(v,'pink','bandpass',850,.4,.012*scale,.1);
  v.every(function(){
    var c=context(),t=c.currentTime,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),p=c.createStereoPanner?c.createStereoPanner():c.createGain();
    s.buffer=noise('white');f.type='bandpass';f.frequency.value=rnd(650,1700);f.Q.value=.8;if(p.pan)p.pan.value=rnd(-.45,.45);
    var peak=rnd(.006,.018)*scale;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+rnd(.08,.16));
    s.connect(f);f.connect(g);g.connect(p);p.connect(v.out);s.start(t,rnd(0,3),.2);
  },700,2600);
}
function softPink(v,scale){loopNoise(v,'pink','lowpass',4200,.2,.085*(scale||1),0);}
function softBrown(v,scale){var n=loopNoise(v,'brown','bandpass',260,.32,.075*(scale||1),0);n.filter.frequency.setTargetAtTime(300,context().currentTime,2);}
var PENTA=[0,2,4,7,9];
function piano(v,scale){
  scale=scale||1;var root=57;
  v.every(function(){
    var deg=pick(PENTA)+12*pick([0,0,1]),f=440*Math.pow(2,(root+deg-69)/12),pan=rnd(-.25,.25);
    var c=context(),t=c.currentTime,o1=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),p=c.createStereoPanner?c.createStereoPanner():c.createGain();
    o1.type='sine';o2.type='triangle';o1.frequency.value=f;o2.frequency.value=f*2;if(p.pan)p.pan.value=pan;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.022*scale,t+.09);g.gain.exponentialRampToValueAtTime(.0001,t+rnd(2.8,4.2));
    o1.connect(g);o2.connect(g);g.connect(p);p.connect(v.out);o1.start(t);o2.start(t);o1.stop(t+4.5);o2.stop(t+4.5);
  },3200,6200);
}
function bowls(v,scale){
  scale=scale||1;
  v.every(function(){
    var c=context(),t=c.currentTime,base=pick([146.8,164.8,174.6,196]);
    [1,2.03,3.14].forEach(function(r,idx){var o=c.createOscillator(),g=c.createGain(),p=c.createStereoPanner?c.createStereoPanner():c.createGain();o.type='sine';o.frequency.value=base*r;if(p.pan)p.pan.value=(idx-1)*.14;var peak=[.024,.009,.004][idx]*scale;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.22);g.gain.exponentialRampToValueAtTime(.0001,t+[5,3.8,2.8][idx]);o.connect(g);g.connect(p);p.connect(v.out);o.start(t);o.stop(t+5.3);});
  },9000,15000);
}
function aquarium(v,scale){
  scale=scale||1;var c=context(),hum=loopNoise(v,'brown','lowpass',180,.45,.045*scale,0);
  var osc=v.keep(c.createOscillator()),g=c.createGain();osc.type='sine';osc.frequency.value=68;g.gain.value=.009*scale;osc.connect(g);g.connect(v.out);osc.start();
  v.every(function(){drop(v,240,620,rnd(.004,.009)*scale);},1100,3200);
}
function bubbleTube(v,scale){
  scale=scale||1;loopNoise(v,'brown','lowpass',150,.4,.025*scale,0);
  v.every(function(){drop(v,120,340,rnd(.006,.013)*scale,rnd(-.35,.35));},300,1050);
}
function jelly(v,scale){
  scale=scale||1;var c=context(),deep=loopNoise(v,'brown','lowpass',210,.38,.035*scale,0);
  var o=v.keep(c.createOscillator()),g=c.createGain();o.type='sine';o.frequency.value=92;g.gain.value=.006*scale;o.connect(g);g.connect(v.out);o.start();
  v.every(function(){var t=c.currentTime;g.gain.setTargetAtTime(rnd(.003,.009)*scale,t,2.5);o.frequency.setTargetAtTime(rnd(82,108),t,3.2);},5000,9000);
}
function fibre(v,scale){
  scale=scale||1;var c=context();
  [174.6,261.6].forEach(function(f,idx){var o=v.keep(c.createOscillator()),g=c.createGain();o.type='sine';o.frequency.value=f;g.gain.value=(idx?.0018:.0028)*scale;o.connect(g);g.connect(v.out);o.start();});
}
function night(v,scale){scale=scale||1;crickets(v,.42*scale);var n=loopNoise(v,'brown','bandpass',360,.3,.018*scale,0);var c=context();v.every(function(){n.gain.gain.setTargetAtTime(rnd(.012,.022)*scale,c.currentTime,3);},5000,9500);}
function octopus(v,scale){
  scale=scale||1;var c=context(),water=loopNoise(v,'brown','lowpass',240,.35,.028*scale,-.1),water2=loopNoise(v,'pink','bandpass',480,.28,.009*scale,.15);
  v.every(function(){var t=c.currentTime;water.filter.frequency.setTargetAtTime(rnd(180,290),t,2.5);water2.gain.gain.setTargetAtTime(rnd(.006,.012)*scale,t,2.8);},4500,8500);
  v.every(function(){drop(v,150,300,rnd(.003,.006)*scale);},4500,9000);
}
var BUILD={
 'lluvia':function(v){rain(v,false,1);},
 'lluvia-ventana':function(v){rain(v,true,.9);},
 'olas':function(v){waves(v,1);},
 'rio':function(v){stream(v,1);},
 'viento':function(v){breeze(v,.85);},
 'pajaros':function(v){birds(v,.85,4500,8500);},
 'grillos':function(v){crickets(v,.8);},
 'fuego':function(v){fireplace(v,.8);},
 'ruido-rosa':function(v){softPink(v,.8);},
 'ruido-marron':function(v){softBrown(v,.72);},
 'piano':function(v){piano(v,.75);},
 'cuencos':function(v){bowls(v,.7);},
 'escena-mar':function(v){waves(v,.72);},
 'escena-lluvia':function(v){rain(v,true,.68);},
 'escena-rio':function(v){stream(v,.65);birds(v,.10,9000,15000);},
 'escena-noche':function(v){night(v,.62);},
 'escena-acuario':function(v){aquarium(v,.62);},
 'escena-burbujas':function(v){bubbleTube(v,.62);},
 'escena-medusas':function(v){jelly(v,.56);},
 'escena-fibra':function(v){fibre(v,.42);},
 'escena-pulpos':function(v){octopus(v,.55);}
};
var catalog=[
 {id:'lluvia',fam:'nat',es:'Lluvia',en:'Rain',des:'Lluvia suave y estable, sin truenos',den:'Soft, steady rain with no thunder'},
 {id:'lluvia-ventana',fam:'nat',es:'Lluvia en la ventana',en:'Rain on the window',des:'Lluvia y gotas suaves sobre el cristal',den:'Rain and soft drops on glass'},
 {id:'olas',fam:'nat',es:'Olas del mar',en:'Sea waves',des:'Llegada, espuma y retirada del agua',den:'Water arriving, foaming and receding'},
 {id:'rio',fam:'nat',es:'Río',en:'Stream',des:'Corriente suave sobre piedras',den:'Gentle current over stones'},
 {id:'viento',fam:'nat',es:'Viento suave',en:'Gentle wind',des:'Brisa redonda y estable, sin silbidos',den:'Rounded, steady breeze with no whistling'},
 {id:'pajaros',fam:'nat',es:'Pájaros en el bosque',en:'Birds in the forest',des:'Cantos suaves y espaciados',den:'Soft, widely spaced bird calls'},
 {id:'grillos',fam:'nat',es:'Grillos de noche',en:'Crickets at night',des:'Noche estable con llamadas suaves',den:'Stable night ambience with soft calls'},
 {id:'fuego',fam:'nat',es:'Chimenea',en:'Fireplace',des:'Crepitar bajo y cálido',den:'Low, warm crackle'},
 {id:'ruido-rosa',fam:'ruido',es:'Ruido rosa',en:'Pink noise',des:'Sonido uniforme y suave. Puede ayudar o molestar según la persona',den:'Soft, even sound. It can help or bother depending on the person'},
 {id:'ruido-marron',fam:'ruido',es:'Ruido marrón',en:'Brown noise',des:'Sonido grave moderado. Puede ayudar o molestar según la persona',den:'Moderately deep sound. It can help or bother depending on the person'},
 {id:'piano',fam:'mus',es:'Piano suave',en:'Soft piano',des:'Notas simples, lentas y espaciadas',den:'Simple, slow, widely spaced notes'},
 {id:'cuencos',fam:'mus',es:'Cuencos',en:'Singing bowls',des:'Ataque suave y resonancia corta',den:'Soft attack and short resonance'}
];
function start(id,level,fade){
 if(!context()||!BUILD[id])return null;
 var v=Voice(),target=clamp(level==null?.3:level,0,1)*.72,t=ctx.currentTime,d=fade==null?2:Math.max(.4,fade);
 BUILD[id](v);v.out.gain.setValueAtTime(.0001,t);v.out.gain.exponentialRampToValueAtTime(Math.max(.0002,target),t+d);
 return{out:v.out,stop:v.stop,setLevel:function(x){v.setLevel(clamp(x,0,1)*.72);}};
}
window.IGSonidos={catalog:catalog,start:start,context:context,supported:!!AC,kind:'SYNTHETIC_FIRST_PARTY_R40_R03'};
})(window);