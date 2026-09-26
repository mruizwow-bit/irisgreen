/* R42-A7 · paisajes sonoros first-party diferenciados.
   Nada empieza solo. El mar R04 aceptado por María se conserva; el resto se genera
   tras una acción explícita en buffers estéreo deterministas y de baja estimulación. */
(function(window){
'use strict';
var AC=window.AudioContext||window.webkitAudioContext,ctx=null,cache={},loading={};
var SEA='/audio/rincon/r04/scenes.m4a';
var catalog=[
{id:'lluvia',fam:'nat',es:'Lluvia',en:'Rain',des:'Gotas suaves y estables, sin truenos',den:'Soft steady drops with no thunder'},
{id:'lluvia-ventana',fam:'nat',es:'Lluvia en la ventana',en:'Rain on the window',des:'Gotas y escorrentía sobre cristal',den:'Drops and runoff on glass'},
{id:'olas',fam:'nat',es:'Olas del mar',en:'Sea waves',des:'Llegada, espuma y retirada del agua',den:'Water arriving, foaming and receding'},
{id:'rio',fam:'nat',es:'Río',en:'Stream',des:'Corriente suave y agua sobre piedras',den:'Gentle current and water over stones'},
{id:'viento',fam:'nat',es:'Brisa suave',en:'Gentle breeze',des:'Aire bajo y redondo, sin silbidos',den:'Low rounded air movement with no whistling'},
{id:'pajaros',fam:'nat',es:'Pájaros lejanos',en:'Distant birds',des:'Cantos muy espaciados y discretos',den:'Very sparse quiet bird calls'},
{id:'grillos',fam:'nat',es:'Grillos de noche',en:'Crickets at night',des:'Llamadas suaves y separadas',den:'Soft spaced calls'},
{id:'fuego',fam:'nat',es:'Chimenea',en:'Fireplace',des:'Crepitar bajo y cálido, sin chasquidos fuertes',den:'Low warm crackle with no sharp pops'},
{id:'ruido-rosa',fam:'ruido',es:'Ruido rosa suave',en:'Soft pink noise',des:'Textura uniforme filtrada. Puede ayudar o molestar según la persona',den:'Filtered even texture. It can help or bother depending on the person'},
{id:'ruido-marron',fam:'ruido',es:'Ruido marrón suave',en:'Soft brown noise',des:'Textura grave moderada. Puede ayudar o molestar según la persona',den:'Moderately deep texture. It can help or bother depending on the person'},
{id:'piano',fam:'mus',es:'Piano muy suave',en:'Very soft piano',des:'Notas simples, lentas y separadas',den:'Simple slow widely spaced notes'},
{id:'cuencos',fam:'mus',es:'Cuencos suaves',en:'Soft singing bowls',des:'Ataque blando y resonancia controlada',den:'Soft attack and controlled resonance'}
];
function context(){if(!AC)return null;if(!ctx)ctx=new AC({latencyHint:'playback'});if(ctx.state==='suspended')ctx.resume().catch(function(){});return ctx;}
function rng(seed){var x=seed|0;return function(){x=(x*1664525+1013904223)|0;return (x>>>0)/4294967296;};}
function smooth(a,k){var out=new Float32Array(a.length),z=0,kk=Math.max(.0001,Math.min(1,k));for(var i=0;i<a.length;i++){z+=kk*(a[i]-z);out[i]=z;}return out;}
function noise(n,r){var a=new Float32Array(n);for(var i=0;i<n;i++)a[i]=r()*2-1;return a;}
function addTone(L,R,sr,start,dur,f0,f1,amp,pan){var a=Math.max(0,(start*sr)|0),b=Math.min(L.length,((start+dur)*sr)|0);if(b<=a)return;f1=f1||f0;pan=pan||0;var gl=Math.sqrt((1-pan)/2),gr=Math.sqrt((1+pan)/2),ph=0;for(var i=a;i<b;i++){var q=(i-a)/(b-a),env=Math.sin(Math.PI*q);env*=env;var f=f0+(f1-f0)*q;ph+=2*Math.PI*f/sr;var v=Math.sin(ph)*env*amp;L[i]+=v*gl;R[i]+=v*gr;}}
function addNoiseEvent(L,R,sr,start,dur,seed,cut,amp,pan){var a=Math.max(0,(start*sr)|0),b=Math.min(L.length,((start+dur)*sr)|0),n=b-a;if(n<=2)return;var r=rng(seed),x=smooth(noise(n,r),Math.min(.45,2*Math.PI*cut/sr)),gl=Math.sqrt((1-(pan||0))/2),gr=Math.sqrt((1+(pan||0))/2);for(var i=0;i<n;i++){var q=i/(n-1),e=Math.sin(Math.PI*q);e*=e;var v=x[i]*e*amp;L[a+i]+=v*gl;R[a+i]+=v*gr;}}
function norm(L,R,target){var p=1e-9,s=0,n=L.length*2;for(var i=0;i<L.length;i++){s+=L[i]*L[i]+R[i]*R[i];p=Math.max(p,Math.abs(L[i]),Math.abs(R[i]));}var rms=Math.sqrt(s/n)||1,scale=Math.min((target||.045)/rms,.38/p);for(i=0;i<L.length;i++){L[i]=Math.tanh(L[i]*scale*1.06);R[i]=Math.tanh(R[i]*scale*1.06);}}
function seam(L,R,sr){var m=Math.min((sr*1.4)|0,(L.length/7)|0);for(var i=0;i<m;i++){var w=i/(m-1),j=L.length-m+i,l=L[i]*w+L[j]*(1-w),r=R[i]*w+R[j]*(1-w);L[i]=L[j]=l;R[i]=R[j]=r;}}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function make(id){var sr=24000,dur=12,n=sr*dur,L=new Float32Array(n),R=new Float32Array(n),r=rng(hash(id)),i,t;
 function bed(seed,cut,amp,width){var rr=rng(seed),x=smooth(noise(n,rr),Math.min(.35,2*Math.PI*cut/sr)),d=Math.max(4,(sr*.004)|0);for(var q=0;q<n;q++){L[q]+=x[q]*amp;R[q]+=x[(q+d)%n]*amp*(width||.9);}}
 if(id==='lluvia'||id==='lluvia-ventana'){for(i=0;i<(id==='lluvia'?135:205);i++){t=r()*11.8;addTone(L,R,sr,t,.035+r()*.09,850+r()*1500,1050+r()*2100,.0018+r()*.0042,r()*1.7-.85);if(id==='lluvia-ventana'&&r()<.24)addNoiseEvent(L,R,sr,t+.02,.08+r()*.18,9000+i,1000,.0018,r()*1.6-.8);}if(id==='lluvia-ventana')for(i=0;i<8;i++)addTone(L,R,sr,r()*11,.55+r()*.55,420+r()*300,280+r()*260,.0018+r()*.002,r()*1.4-.7);}
 else if(id==='olas'){bed(310,340,.032,.96);for(i=0;i<4;i++){var st=i*3.0-1.0;addNoiseEvent(L,R,sr,st,4.2,400+i,850,.020,-.55+i*.34);addNoiseEvent(L,R,sr,st+1.2,2.5,420+i,2600,.008,-.45+i*.3);}}
 else if(id==='rio'){bed(500,600,.026,.86);for(i=0;i<54;i++){t=r()*11.7;addNoiseEvent(L,R,sr,t,.12+r()*.35,520+i,1200,.003+r()*.006,r()*1.4-.7);if(r()<.45)addTone(L,R,sr,t,.10+r()*.16,160+r()*210,330+r()*300,.0015+r()*.003,r()*1.4-.7);}}
 else if(id==='viento'){bed(610,260,.026,.82);}
 else if(id==='pajaros'){bed(620,180,.004,.9);t=.8;while(t<11){t+=2.8+r()*3.8;var f=1250+r()*900,pan=r()*1.4-.7;for(i=0;i<2+(r()*2|0);i++)addTone(L,R,sr,t+i*.23,.22+r()*.16,f*(1+i*.035),f*(1.1+r()*.13),.002+r()*.0035,pan);}}
 else if(id==='grillos'){for(var lane=0;lane<3;lane++){var f0=[2800,3140,3460][lane],st2=.4+lane*.7;while(st2<11.7){for(i=0;i<2+(r()*3|0);i++)addTone(L,R,sr,st2+i*.09,.05,f0+r()*50-25,f0,.0012+r()*.0016,-.55+lane*.55);st2+=1.1+r()*1.8;}}}
 else if(id==='fuego'){bed(700,150,.015,.92);for(i=0;i<76;i++)addNoiseEvent(L,R,sr,r()*11.8,.03+r()*.09,710+i,1100,.001+r()*.005,r()*1.5-.75);}
 else if(id==='ruido-rosa'||id==='ruido-marron'){bed(id==='ruido-rosa'?801:802,id==='ruido-rosa'?1700:260,id==='ruido-rosa'?.028:.024,.97);}
 else if(id==='piano'){var scale=[196,220,246.94,293.66,329.63],pt=.7;while(pt<10.5){var pf=scale[(r()*scale.length)|0],pan2=r()*.4-.2;addTone(L,R,sr,pt,2.5+r()*1.7,pf,pf,.0065,pan2);addTone(L,R,sr,pt,2.0,pf*2.01,pf*2.01,.0012,pan2);pt+=2.8+r()*2.1;}}
 else if(id==='cuencos'){var bt=1;while(bt<9){var bf=[130.8,146.8,164.8,174.6][(r()*4)|0],bp=r()*.5-.25;addTone(L,R,sr,bt,4.5,bf,bf,.0058,bp);addTone(L,R,sr,bt,3.8,bf*2.01,bf*2.01,.0012,bp);bt+=5.3+r()*2.8;}}
 else if(id==='escena-rio'){bed(910,520,.024,.84);for(i=0;i<48;i++){t=r()*11.7;addNoiseEvent(L,R,sr,t,.14+r()*.34,920+i,1100,.003+r()*.006,r()*1.3-.65);}}
 else if(id==='escena-noche'){for(var ln=0;ln<3;ln++){var nf=[2780,3110,3400][ln],nt=.7+ln*.6;while(nt<11.6){for(i=0;i<2+(r()*2|0);i++)addTone(L,R,sr,nt+i*.1,.05,nf+r()*45-22,nf,.0011+r()*.0012,-.6+ln*.6);nt+=1.4+r()*2.2;}}}
 else if(id==='escena-acuario'||id==='escena-burbujas'){bed(1000,170,id==='escena-acuario'?.012:.006,.92);for(i=0;i<(id==='escena-acuario'?35:80);i++){t=r()*11.8;var ff=id==='escena-acuario'?180+r()*260:90+r()*230;addTone(L,R,sr,t,.08+r()*.16,ff,ff*(1.4+r()*.7),.0012+r()*.0035,r()*1.2-.6);}}
 else if(id==='escena-medusas'||id==='escena-pulpos'){bed(1100,id==='escena-medusas'?150:190,.012,.8);for(i=0;i<10;i++){t=r()*11.5;addTone(L,R,sr,t,.12+r()*.18,100+r()*180,190+r()*300,.0008+r()*.0018,r()*1.2-.6);}}
 else if(id==='escena-fibra'){for(t=1;t<11;t+=4.5+r()*2.5)addTone(L,R,sr,t,3.4,[174.6,220,261.6][(r()*3)|0],null,.0015,r()*1.1-.55);}
 else if(id==='escena-bosque-niebla'){bed(1200,720,.008,.78);for(i=0;i<3;i++){t=2+i*3.7+r();var b=1150+r()*700,p=r()*1.4-.7;addTone(L,R,sr,t,.38,b,b*1.16,.0018,p);addTone(L,R,sr,t+.28,.30,b*.96,b*1.05,.0013,p);}}
 else if(id==='escena-lago-amanecer'){bed(1300,340,.010,.88);for(i=0;i<2;i++){t=3.4+i*5.4+r()*.8;addTone(L,R,sr,t,.45,980+r()*500,1200+r()*500,.0015,r()*1.2-.6);}}
 else if(id==='escena-nubes-lentas'){bed(1400,180,.009,.92);}
 else if(id==='escena-lluvia'){return make('lluvia-ventana');}
 else {bed(1500,240,.010,.9);}
 seam(L,R,sr);norm(L,R,id==='ruido-rosa'||id==='ruido-marron'?.035:.042);var c=context(),buf=c.createBuffer(2,n,sr);buf.copyToChannel(L,0);buf.copyToChannel(R,1);return buf;}
function loadSea(){if(cache['escena-mar'])return Promise.resolve(cache['escena-mar']);if(loading.sea)return loading.sea;var c=context();loading.sea=fetch(SEA,{credentials:'same-origin'}).then(function(r){if(!r.ok)throw new Error('SEA_ASSET_'+r.status);return r.arrayBuffer();}).then(function(ab){return c.decodeAudioData(ab);}).then(function(buf){cache['escena-mar']=buf;delete loading.sea;return buf;});return loading.sea;}
function get(id){if(cache[id])return Promise.resolve(cache[id]);if(id==='escena-mar')return loadSea();return Promise.resolve().then(function(){var b=make(id);cache[id]=b;return b;});}
function start(id,level,fade){var c=context();if(!c)return null;var alive=true,src=null,g=c.createGain(),target=Math.max(0,Math.min(.62,level==null?.20:level));g.gain.value=.0001;g.connect(c.destination);var h={out:g,stop:function(sec){if(!alive)return;alive=false;var t=c.currentTime,d=Math.max(.12,sec==null?1.8:sec);g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(Math.max(.0001,g.gain.value),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);setTimeout(function(){try{if(src)src.stop();g.disconnect();}catch(e){}},d*1000+120);},setLevel:function(v){target=Math.max(0,Math.min(.62,v));g.gain.setTargetAtTime(Math.max(.0001,target),c.currentTime,.22);}};get(id).then(function(buf){if(!alive)return;src=c.createBufferSource();src.buffer=buf;src.loop=true;if(id==='escena-mar'){src.loopStart=0;src.loopEnd=Math.min(14,buf.duration);}src.connect(g);src.start(0,0);var t=c.currentTime,d=Math.max(.7,fade==null?2.2:fade);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,target),t+d);}).catch(function(e){if(alive){alive=false;try{g.disconnect();}catch(_){}}window.dispatchEvent(new CustomEvent('ig:r42-audio-error',{detail:{id:id,message:String(e&&e.message||e)}}));});return h;}
window.IGSonidos={catalog:catalog,start:start,context:context,supported:!!AC,kind:'R42_FIRST_PARTY_DIFFERENTIATED_AUDIO',assetManifest:{preservedSea:SEA,generatedAfterExplicitAction:true,segmentSeconds:12}};
})(window);
