(function(){
'use strict';
var host=document.getElementById('detective-game'); if(!host||!window.THREE)return;
var lang=host.dataset.lang==='en'?'en':'es';
var T={
es:{scene:'Escena 01 · Habitación de Vera',choose:'Mira la habitación y toca un objeto.',light:'Lámpara',sound:'Altavoz',texture:'Manta',low:'Suave',mid:'Media',high:'Alta',try:'Probar cambio',reset:'Otra escena',finish:'Resolver escena',selected:'Has elegido',observe:'Observa a Vera y las señales de la escena. Puedes cambiar la intensidad y probar otra vez.',start:'Vera acaba de entrar. Averigua qué combinación le resulta cómoda hoy.',good:'La escena parece cómoda para Vera. Puedes resolverla o seguir investigando.',close:'Aún hay una señal de incomodidad. Cambia algo y observa qué ocurre.',solved:'Escena resuelta: encontraste una combinación que funciona para Vera hoy.',body:'Cuerpo',breath:'Respiración',attention:'Atención',help:'Teclado: Tab recorre controles. En la escena, flechas giran la vista; + y − acercan o alejan.',noRight:'No existe una combinación universal. Esta Vera simulada cambia entre escenas.'},
en:{scene:"Scene 01 · Vera's room",choose:'Look around and select an object.',light:'Lamp',sound:'Speaker',texture:'Blanket',low:'Low',mid:'Medium',high:'High',try:'Try change',reset:'New scene',finish:'Resolve scene',selected:'You selected',observe:'Watch Vera and the scene signals. Change the intensity and try again.',start:'Vera has just entered. Find a combination that feels comfortable for her today.',good:'The scene seems comfortable for Vera. You can resolve it or keep investigating.',close:'One signal still suggests discomfort. Change something and observe what happens.',solved:'Scene resolved: you found a combination that works for Vera today.',body:'Body',breath:'Breathing',attention:'Attention',help:'Keyboard: Tab moves through controls. In the scene, arrow keys rotate the view; + and − zoom.',noRight:'There is no universal combination. This simulated Vera changes between scenes.'}
}[lang];
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var motionMode=reduce?'reduced':'normal', animating=false;
var levels={light:1,sound:1,texture:1}, selected=null, solved=false, tested=false;
var profile=randomProfile();
var panel={
title:document.getElementById('dg-selection-title'),box:document.getElementById('dg-object'),status:document.getElementById('dg-status'),
body:document.getElementById('dg-body'),breath:document.getElementById('dg-breath'),attention:document.getElementById('dg-attention'),
resolve:document.getElementById('dg-resolve')
};
document.getElementById('dg-scene-label').textContent=T.scene;
document.getElementById('dg-help').textContent=T.help;
document.getElementById('dg-note').textContent=T.noRight;
panel.status.textContent=T.start;
var scene=new THREE.Scene(); scene.background=new THREE.Color(0xe4eadf);
var camera=new THREE.PerspectiveCamera(48,1,.1,100); camera.position.set(7,4.6,8);
var renderer=new THREE.WebGPURenderer({antialias:true,forceWebGL:true}), rendererReady=false;
host.appendChild(renderer.domElement);
var amb=new THREE.HemisphereLight(0xffffff,0x7a8b79,1.6); scene.add(amb);
var key=new THREE.DirectionalLight(0xfff4d6,2.1); key.position.set(3,7,4); key.castShadow=true; scene.add(key);
buildRoom();
var vera=buildVera(); scene.add(vera);
var interact=[];
var lamp=buildLamp(); lamp.userData.kind='light'; interact.push(lamp); scene.add(lamp);
var speaker=buildSpeaker(); speaker.userData.kind='sound'; interact.push(speaker); scene.add(speaker);
var blanket=buildBlanket(); blanket.userData.kind='texture'; interact.push(blanket); scene.add(blanket);
var ray=new THREE.Raycaster(), pointer=new THREE.Vector2(), yaw=-.15, pitch=-.16, dist=10;
renderer.domElement.tabIndex=0; renderer.domElement.setAttribute('role','application'); renderer.domElement.setAttribute('aria-label',lang==='es'?'Habitación 3D de Detective':'3D Detective room');
renderer.domElement.addEventListener('pointerup',pick);
renderer.domElement.addEventListener('keydown',keyNav);
window.addEventListener('resize',resize);
wireControls(); updateMotionButton(); applyCamera();
renderer.init().then(function(){rendererReady=true;renderer.setPixelRatio(Math.min(devicePixelRatio,2));if(renderer.shadowMap)renderer.shadowMap.enabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;resize();render();if(motionMode!=='none')animate()}).catch(function(err){panel.status.textContent=(lang==='es'?'No se pudo iniciar la escena 3D.':'The 3D scene could not start.');console.error(err)});
function randomProfile(){return{light:Math.floor(Math.random()*3),sound:Math.floor(Math.random()*3),texture:Math.floor(Math.random()*3)}}
function mat(color,rough){return new THREE.MeshStandardMaterial({color:color,roughness:rough==null?.72:rough,metalness:.02})}
function mesh(g,c,pos){var m=new THREE.Mesh(g,mat(c));m.position.set(pos[0],pos[1],pos[2]);m.castShadow=true;m.receiveShadow=true;return m}
function buildRoom(){
 var floor=mesh(new THREE.BoxGeometry(9,.18,7),0xc9d1c2,[0,-.1,0]);scene.add(floor);
 var back=mesh(new THREE.BoxGeometry(9,4.5,.16),0xf4efe5,[0,2.15,-3.42]);scene.add(back);
 var side=mesh(new THREE.BoxGeometry(.16,4.5,7),0xebe5d8,[-4.42,2.15,0]);scene.add(side);
 var rug=mesh(new THREE.BoxGeometry(4.2,.05,2.8),0xb7c5b5,[.4,.03,.2]);scene.add(rug);
 var shelf=mesh(new THREE.BoxGeometry(2.2,1.7,.45),0x8d6f55,[2.8,.85,-3]);scene.add(shelf);
 for(var i=0;i<3;i++){var book=mesh(new THREE.BoxGeometry(.28,.7,.22),[0x55728f,0xa66161,0x708b63][i],[2.25+i*.35,1.75,-2.72]);scene.add(book)}
 var table=mesh(new THREE.BoxGeometry(2,.16,1.1),0x9a7858,[-1.9,1.25,-2.1]);scene.add(table);
 [-2.65,-1.15].forEach(function(x){var leg=mesh(new THREE.BoxGeometry(.14,1.2,.14),0x72573f,[x,.62,-2.1]);scene.add(leg)});
}
function buildVera(){
 var g=new THREE.Group();g.position.set(.2,0,1.05);g.userData.baseY=0;
 var skin=mat(0xd8aa88),hair=mat(0x315f7a),dress=mat(0xeee1c3),boot=mat(0x5d463a);
 var head=new THREE.Mesh(new THREE.SphereGeometry(.32,24,18),skin);head.position.y=2.72;g.add(head);
 var hairTop=new THREE.Mesh(new THREE.SphereGeometry(.35,24,18,0,Math.PI*2,0,Math.PI*.62),hair);hairTop.position.set(0,2.79,-.03);g.add(hairTop);
 var hairBack=new THREE.Mesh(new THREE.BoxGeometry(.6,.85,.18),hair);hairBack.position.set(0,2.45,-.25);g.add(hairBack);
 var torso=new THREE.Mesh(new THREE.CylinderGeometry(.34,.52,1.12,18),dress);torso.position.y=1.82;g.add(torso);
 var armG=new THREE.CylinderGeometry(.095,.085,.95,12);[-.5,.5].forEach(function(x){var a=new THREE.Mesh(armG,skin);a.position.set(x,1.9,0);a.rotation.z=x<0?-.14:.14;g.add(a)});
 var legG=new THREE.CylinderGeometry(.105,.09,.78,12);[-.2,.2].forEach(function(x){var l=new THREE.Mesh(legG,skin);l.position.set(x,.88,0);g.add(l);var b=new THREE.Mesh(new THREE.BoxGeometry(.24,.32,.38),boot);b.position.set(x,.36,.06);g.add(b)});
 g.traverse(function(o){if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});return g
}
function buildLamp(){
 var g=new THREE.Group();g.position.set(2.35,0,-1.45);
 var base=mesh(new THREE.CylinderGeometry(.32,.4,.18,20),0x6d6d66,[0,.1,0]);g.add(base);
 var stem=mesh(new THREE.CylinderGeometry(.05,.05,1.55,12),0x7b766b,[0,.9,0]);g.add(stem);
 var shade=mesh(new THREE.ConeGeometry(.46,.7,24,1,true),0xe2b85d,[0,1.72,0]);shade.rotation.x=Math.PI;g.add(shade);
 var bulb=new THREE.PointLight(0xffe3a1,2.3,5);bulb.position.set(0,1.5,0);g.add(bulb);g.userData.light=bulb;return g
}
function buildSpeaker(){
 var g=new THREE.Group();g.position.set(-2.7,.58,-2.05);
 var box=mesh(new THREE.BoxGeometry(.72,1.2,.55),0x43505c,[0,0,0]);g.add(box);
 [.25,-.25].forEach(function(y){var cone=mesh(new THREE.CylinderGeometry(.18,.12,.04,24),0x202a32,[0,y,.3]);cone.rotation.x=Math.PI/2;g.add(cone)});return g
}
function buildBlanket(){
 var g=new THREE.Group();g.position.set(2.25,.25,1.55);
 var b=mesh(new THREE.BoxGeometry(1.35,.22,1.75),0x8ca6a0,[0,0,0]);g.add(b);
 for(var i=-2;i<=2;i++){var stripe=mesh(new THREE.BoxGeometry(.06,.235,1.72),0xcad6ce,[i*.22,.02,0]);g.add(stripe)}return g
}
function wireControls(){
 document.querySelectorAll('[data-pick]').forEach(function(b){b.addEventListener('click',function(){select(b.dataset.pick)})});
 document.querySelectorAll('[data-level]').forEach(function(b){b.addEventListener('click',function(){if(!selected)return;levels[selected]=+b.dataset.level;document.querySelectorAll('[data-level]').forEach(function(x){x.setAttribute('aria-pressed',String(+x.dataset.level===levels[selected]))});tested=false;panel.status.textContent=T.observe;render()})});
 document.getElementById('dg-try').addEventListener('click',function(){if(!selected)return;tested=true;updateResult()});
 document.getElementById('dg-reset').addEventListener('click',function(){profile=randomProfile();levels={light:1,sound:1,texture:1};selected=null;tested=false;solved=false;panel.box.hidden=true;panel.resolve.disabled=true;panel.status.textContent=T.start;document.querySelectorAll('[data-pick]').forEach(function(x){x.setAttribute('aria-pressed','false')});resetVera();render()});
 document.getElementById('dg-motion').addEventListener('click',cycleMotion);
 panel.resolve.addEventListener('click',function(){if(panel.resolve.disabled)return;solved=true;panel.status.textContent=T.solved;panel.resolve.disabled=true;render()});
}
function pick(e){var r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(pointer,camera);var hits=ray.intersectObjects(interact,true);if(!hits.length)return;var o=hits[0].object;while(o.parent&&!o.userData.kind)o=o.parent;if(o.userData.kind)select(o.userData.kind)}
function select(kind){selected=kind;var name=kind==='light'?T.light:kind==='sound'?T.sound:T.texture;panel.title.textContent=T.selected+': '+name;panel.box.hidden=false;document.querySelectorAll('[data-pick]').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.pick===kind))});document.querySelectorAll('[data-level]').forEach(function(x){x.textContent=x.dataset.level==='0'?T.low:x.dataset.level==='1'?T.mid:T.high;x.setAttribute('aria-pressed',String(+x.dataset.level===levels[kind]))});panel.status.textContent=T.observe}
function cycleMotion(){motionMode=motionMode==='normal'?'reduced':motionMode==='reduced'?'none':'normal';updateMotionButton();if(motionMode==='none'){animating=false;vera.position.y=0;vera.rotation.x=0;render()}else if(rendererReady&&!animating)animate()}
function updateMotionButton(){var b=document.getElementById('dg-motion');if(!b)return;var labels=lang==='es'?{normal:'Movimiento: normal',reduced:'Movimiento: reducido',none:'Movimiento: ninguno'}:{normal:'Motion: normal',reduced:'Motion: reduced',none:'Motion: none'};b.textContent=labels[motionMode];b.setAttribute('aria-label',b.textContent)}
function updateResult(){
 var dl=Math.abs(levels.light-profile.light),ds=Math.abs(levels.sound-profile.sound),dt=Math.abs(levels.texture-profile.texture);
 var body=Math.max(12,100-(dt*34+ds*15)), breath=Math.max(12,100-(ds*34+dl*17)), attention=Math.max(12,100-(dl*34+dt*14));
 setMeter(panel.body,body);setMeter(panel.breath,breath);setMeter(panel.attention,attention);
 var ok=body>=66&&breath>=66&&attention>=66; panel.resolve.disabled=!ok;panel.status.textContent=ok?T.good:T.close;
 poseVera(body,breath,attention);updateEnvironment();render()
}
function setMeter(el,n){el.style.width=n+'%';el.parentElement.setAttribute('aria-valuenow',String(Math.round(n)))}
function poseVera(body,breath,attention){vera.rotation.z=(body<55?.07:0);vera.rotation.y=(attention<55?.16:0);vera.scale.y=breath<55?.985:1;vera.position.y=body<40?-.04:0}
function resetVera(){vera.rotation.set(0,0,0);vera.scale.set(1,1,1);vera.position.y=0;[panel.body,panel.breath,panel.attention].forEach(function(x){setMeter(x,50)})}
function updateEnvironment(){lamp.userData.light.intensity=[.5,2.3,4.4][levels.light];speaker.scale.setScalar([.92,1,1.08][levels.sound]);blanket.scale.y=[.65,1,1.45][levels.texture]}
function keyNav(e){var used=true;if(e.key==='ArrowLeft')yaw-=.1;else if(e.key==='ArrowRight')yaw+=.1;else if(e.key==='ArrowUp')pitch=Math.max(-.55,pitch-.08);else if(e.key==='ArrowDown')pitch=Math.min(.12,pitch+.08);else if(e.key==='+'||e.key==='=')dist=Math.max(6,dist-.6);else if(e.key==='-')dist=Math.min(14,dist+.6);else used=false;if(used){e.preventDefault();applyCamera();render()}}
function applyCamera(){camera.position.set(Math.sin(yaw)*dist,3.8+pitch*4,Math.cos(yaw)*dist);camera.lookAt(0,1.35,-.2)}
function resize(){var w=host.clientWidth,h=host.clientHeight||620;camera.aspect=w/h;camera.updateProjectionMatrix();if(rendererReady)renderer.setSize(w,h,false);render()}
function render(){if(!rendererReady)return;updateEnvironment();renderer.render(scene,camera)}
function animate(){if(animating||motionMode==='none')return;animating=true;var start=performance.now();(function loop(now){if(!rendererReady||motionMode==='none'){animating=false;return}var t=(now-start)/1000;if(!solved){var amp=motionMode==='reduced'?.004:.015;vera.position.y=Math.sin(t*1.8)*amp;vera.rotation.x=motionMode==='normal'&&tested?Math.sin(t*.8)*.006:0}renderer.render(scene,camera);requestAnimationFrame(loop)})(start)}
})();