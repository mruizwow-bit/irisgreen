
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const status=$('#qStatus'); let ctx=null, source=null, gain=null, noiseNode=null;
function announce(t){if(status){status.textContent='';setTimeout(()=>status.textContent=t,20)}}
function show(id){$$('.q-panel').forEach(p=>p.hidden=p.id!==id);const el=$('#'+id);if(el){el.hidden=false;el.focus?.();el.scrollIntoView({block:'start'})}}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.go)));
$('#seeAll')?.addEventListener('click',()=>show('all'));
$('#backHome')?.addEventListener('click',()=>show('home'));
$('#dimToggle')?.addEventListener('click',e=>{document.body.classList.toggle('dim');e.currentTarget.setAttribute('aria-pressed',document.body.classList.contains('dim'))});
function audioContext(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();gain=ctx.createGain();gain.gain.value=.12;gain.connect(ctx.destination)}return ctx}
function stopSound(){if(noiseNode){try{noiseNode.stop()}catch(e){}noiseNode=null}if(source){try{source.stop()}catch(e){}source=null}$$('.sound-card').forEach(b=>b.setAttribute('aria-pressed','false'));announce(document.documentElement.lang==='es'?'Sonido parado.':'Sound stopped.')}
function startNoise(kind,button){
 stopSound();const c=audioContext(),len=c.sampleRate*3,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);let last=0;
 for(let i=0;i<len;i++){const w=Math.random()*2-1;if(kind==='brown'){last=(last+.02*w)/1.02;d[i]=last*3.5}else if(kind==='soft'){d[i]=w*.34}else{d[i]=(w*.18)+Math.sin(i/220)*.03}}
 noiseNode=c.createBufferSource();noiseNode.buffer=buf;noiseNode.loop=true;
 const filter=c.createBiquadFilter();filter.type=kind==='soft'?'lowpass':'bandpass';filter.frequency.value=kind==='soft'?1200:kind==='brown'?420:780;filter.Q.value=.7;
 noiseNode.connect(filter).connect(gain);noiseNode.start();button.setAttribute('aria-pressed','true');announce(button.dataset.label);
}
$$('.sound-card').forEach(b=>b.addEventListener('click',()=>startNoise(b.dataset.sound,b)));
$('#soundStop')?.addEventListener('click',stopSound);
let shapeRunning=false,step=0;const shape=$('#shapeOrb'),shapeLabel=$('#shapeLabel');
function setShapeText(){if(!shapeLabel)return;const es=document.documentElement.lang==='es';shapeLabel.textContent=step%2===0?(es?'La forma crece.':'The shape grows.'):(es?'La forma se encoge.':'The shape shrinks.')}
$('#shapeStart')?.addEventListener('click',()=>{shapeRunning=true;shape?.classList.add('running');announce(document.documentElement.lang==='es'?'Movimiento iniciado.':'Movement started.')});
$('#shapeStop')?.addEventListener('click',()=>{shapeRunning=false;shape?.classList.remove('running');announce(document.documentElement.lang==='es'?'La forma se ha quedado quieta. Puedes seguir aquí.':'The shape has stopped. You can stay here.')});
$('#shapeNext')?.addEventListener('click',()=>{step++;shape?.classList.toggle('no-motion');shape?.style.setProperty('transform',step%2?'scale(1.3)':'scale(.82)');setShapeText()});
$$('[data-grounding]').forEach(b=>b.addEventListener('click',()=>{$$('.grounding-set').forEach(x=>x.hidden=x.dataset.set!==b.dataset.grounding)}));
$$('[data-card]').forEach(b=>b.addEventListener('click',()=>{const target=$('#showCard');target.textContent=b.dataset.card;target.focus()}));
window.addEventListener('pagehide',stopSound);
})();
