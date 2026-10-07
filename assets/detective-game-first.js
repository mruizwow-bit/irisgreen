(function(){
'use strict';
var host=document.getElementById('detective-game'); if(!host||!window.THREE)return;
var lang=host.dataset.lang==='en'?'en':'es';
var T={
es:{scene:'Escena',room:'Habitación de Vera',light:'Lámpara',sound:'Altavoz',texture:'Manta',low:'Suave',mid:'Media',high:'Alta',selected:'Has elegido',observe:'Observa a Vera y las señales. Cambia algo, haz una hipótesis y prueba.',start:'Vera acaba de entrar. Prueba cambios y compara qué ocurre; no hay una combinación correcta que descubrir.',trial:'Resultado de esta prueba',better:'Las señales han cambiado. Compara con la prueba anterior y decide qué interpretación te convence.',ready:'Ya has probado dos configuraciones distintas. Puedes cerrar la investigación o seguir probando.',solved:'Investigación cerrada. Has comparado al menos dos estrategias y registrado una interpretación, no una respuesta correcta.',help:'Teclado: Tab recorre controles. En la escena, flechas giran la vista; + y − acercan o alejan.',noRight:'Es una simulación abierta: distintas combinaciones producen consecuencias diferentes y varias estrategias son válidas.',hyp:{calm:'A Vera le calma',activate:'A Vera le activa',depends:'Depende de la combinación'}},
en:{scene:'Scene',room:"Vera's room",light:'Lamp',sound:'Speaker',texture:'Blanket',low:'Low',mid:'Medium',high:'High',selected:'You selected',observe:'Watch Vera and the signals. Change something, make a hypothesis and test it.',start:'Vera has just entered. Try changes and compare what happens; there is no hidden correct combination to discover.',trial:'Result of this trial',better:'The signals changed. Compare them with the previous trial and decide which interpretation fits best.',ready:'You have tried two different configurations. You can close the investigation or keep testing.',solved:'Investigation closed. You compared at least two strategies and recorded an interpretation, not a correct answer.',help:'Keyboard: Tab moves through controls. In the scene, arrow keys rotate the view; + and − zoom.',noRight:'This is an open simulation: different combinations produce different consequences and several strategies are valid.',hyp:{calm:'It calms Vera',activate:'It activates Vera',depends:'It depends on the combination'}}
}[lang];

var params=new URLSearchParams(location.search), sceneIndex=Math.max(1,parseInt(params.get('scene')||'1',10)||1);
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var motionMode=reduce?'reduced':'normal', animating=false, selected=null, hypothesis=null, solved=false;
var levels={light:1,sound:1,texture:1}, trials=[], history=[], signals={body:50,breath:50,attention:50};
var model=buildModel(sceneIndex);
var panel={
root:document.getElementById('dg-panel'),title:document.getElementById('dg-selection-title'),box:document.getElementById('dg-object'),
status:document.getElementById('dg-status'),body:document.getElementById('dg-body'),breath:document.getElementById('dg-breath'),
attention:document.getElementById('dg-attention'),resolve:document.getElementById('dg-resolve'),undo:document.getElementById('dg-undo')
};
document.getElementById('dg-help').textContent=T.help; document.getElementById('dg-note').textContent=T.noRight; updateSceneLabel(); panel.status.textContent=T.start;

var scene=new THREE.Scene(); scene.background=new THREE.Color(0xe4eadf);
var camera=new THREE.PerspectiveCamera(48,1,.1,100); camera.position.set(7,4.6,8);
var renderer=new THREE.WebGPURenderer({antialias:true,forceWebGL:true}), rendererReady=false;
host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x7a8b79,1.6));
var key=new THREE.DirectionalLight(0xfff4d6,2.1); key.position.set(3,7,4); scene.add(key);
buildRoom(); var vera=buildVera(); scene.add(vera);
var interact=[],lamp=buildLamp(),speaker=buildSpeaker(),blanket=buildBlanket();
lamp.userData.kind='light';speaker.userData.kind='sound';blanket.userData.kind='texture';interact.push(lamp,speaker,blanket);scene.add(lamp,speaker,blanket);
var ray=new THREE.Raycaster(), pointer=new THREE.Vector2(), yaw=-.15,pitch=-.16,dist=10;
renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('role','application');renderer.domElement.setAttribute('aria-label',lang==='es'?'Habitación 3D de Detective':'3D Detective room');
renderer.domElement.addEventListener('pointerup',pick);renderer.domElement.addEventListener('keydown',keyNav);window.addEventListener('resize',resize);
wireControls();updateMotionButton();applyCamera();
renderer.init().then(function(){rendererReady=true;renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;resize();render();if(motionMode!=='none')animate()}).catch(function(err){panel.status.textContent=lang==='es'?'No se pudo iniciar la escena 3D.':'The 3D scene could not start.';console.error(err)});

function seeded(seed){var x=(seed*2654435761)>>>0;return function(){x^=x<<13;x^=x>>>17;x^=x<<5;return((x>>>0)%10000)/10000}}
function buildModel(seed){var r=seeded(seed);function w(){return (r()*.9+.35)*(r()<.5?-1:1)}return{body:{light:w(),sound:w(),texture:w()},breath:{light:w(),sound:w(),texture:w()},attention:{light:w(),sound:w(),texture:w()}}}
function clamp(n){return Math.max(12,Math.min(92,Math.round(n)))}
function calcSignals(){
 var x={light:levels.light-1,sound:levels.sound-1,texture:levels.texture-1};
 return{
  body:clamp(56+18*(model.body.light*x.light+model.body.sound*x.sound+model.body.texture*x.texture)+7*x.sound*x.texture),
  breath:clamp(56+18*(model.breath.light*x.light+model.breath.sound*x.sound+model.breath.texture*x.texture)+6*x.light*x.sound),
  attention:clamp(56+18*(model.attention.light*x.light+model.attention.sound*x.sound+model.attention.texture*x.texture)+6*x.light*x.texture)
 }
}
function snapshot(){return{levels:{light:levels.light,sound:levels.sound,texture:levels.texture},signals:{body:signals.body,breath:signals.breath,attention:signals.attention},trials:trials.slice(),status:panel.status.textContent}}
function restore(s){levels={light:s.levels.light,sound:s.levels.sound,texture:s.levels.texture};signals={body:s.signals.body,breath:s.signals.breath,attention:s.signals.attention};trials=s.trials.slice();setAllMeters();panel.status.textContent=s.status;panel.resolve.disabled=!(trials.length>=2&&hypothesis);updateLevelButtons();updateEnvironment();poseVera(signals.body,signals.breath,signals.attention);render()}
function configKey(){return levels.light+'-'+levels.sound+'-'+levels.texture}
function wireControls(){
 document.querySelectorAll('[data-pick]').forEach(function(b){b.addEventListener('click',function(){select(b.dataset.pick)})});
 document.querySelectorAll('[data-level]').forEach(function(b){b.addEventListener('click',function(){if(!selected)return;history.push(snapshot());levels[selected]=+b.dataset.level;panel.undo.disabled=false;updateLevelButtons();panel.status.textContent=T.observe;updateEnvironment();render()})});
 document.querySelectorAll('[data-hypothesis]').forEach(function(b){b.addEventListener('click',function(){hypothesis=b.dataset.hypothesis;document.querySelectorAll('[data-hypothesis]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});panel.resolve.disabled=!(trials.length>=2&&hypothesis);if(trials.length>=2)panel.status.textContent=T.ready})});
 document.getElementById('dg-try').addEventListener('click',runTrial);
 panel.undo.addEventListener('click',function(){var s=history.pop();if(!s)return;restore(s);panel.undo.disabled=!history.length});
 document.getElementById('dg-reset').addEventListener('click',newScene);
 document.getElementById('dg-motion').addEventListener('click',cycleMotion);
 panel.resolve.addEventListener('click',function(){if(panel.resolve.disabled)return;solved=true;panel.status.textContent=T.solved;panel.resolve.disabled=true;render()});
 var toggle=document.getElementById('dg-panel-toggle'),objects=document.getElementById('dg-mobile-objects');
 if(toggle)toggle.addEventListener('click',function(){var open=panel.root.dataset.mobileOpen!=='true';panel.root.dataset.mobileOpen=String(open);toggle.setAttribute('aria-expanded',String(open));objects.setAttribute('aria-pressed',String(!open))});
 if(objects)objects.addEventListener('click',function(){panel.root.dataset.mobileOpen='false';toggle.setAttribute('aria-expanded','false');objects.setAttribute('aria-pressed','true');host.querySelector('[data-pick]')?.focus()});
}
function runTrial(){if(!selected)return;signals=calcSignals();setAllMeters();poseVera(signals.body,signals.breath,signals.attention);updateEnvironment();var k=configKey();if(!trials.includes(k))trials.push(k);panel.resolve.disabled=!(trials.length>=2&&hypothesis);var outcome=classify(signals);panel.status.textContent=T.trial+': '+T.hyp[outcome]+'. '+(trials.length>=2?T.ready:T.better);render()}
function classify(s){var avg=(s.body+s.breath+s.attention)/3;if(avg>=66)return'calm';if(avg<=46)return'activate';return'depends'}
function newScene(){sceneIndex++;model=buildModel(sceneIndex);levels={light:1,sound:1,texture:1};signals={body:50,breath:50,attention:50};trials=[];history=[];selected=null;hypothesis=null;solved=false;panel.box.hidden=true;panel.resolve.disabled=true;panel.undo.disabled=true;panel.status.textContent=T.start;document.querySelectorAll('[data-pick],[data-hypothesis]').forEach(function(x){x.setAttribute('aria-pressed','false')});setAllMeters();resetVera();updateEnvironment();updateSceneLabel();render()}
function updateSceneLabel(){document.getElementById('dg-scene-label').textContent=T.scene+' '+String(sceneIndex).padStart(2,'0')+' · '+T.room}
function pick(e){var r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;ray.setFromCamera(pointer,camera);var hits=ray.intersectObjects(interact,true);if(!hits.length)return;var o=hits[0].object;while(o.parent&&!o.userData.kind)o=o.parent;if(o.userData.kind)select(o.userData.kind)}
function select(kind){selected=kind;var name=kind==='light'?T.light:kind==='sound'?T.sound:T.texture;panel.title.textContent=T.selected+': '+name;panel.box.hidden=false;document.querySelectorAll('[data-pick]').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.pick===kind))});updateLevelButtons();panel.status.textContent=T.observe;if(matchMedia('(max-width:850px)').matches){panel.root.dataset.mobileOpen='true';var t=document.getElementById('dg-panel-toggle');if(t)t.setAttribute('aria-expanded','true')}}
function updateLevelButtons(){document.querySelectorAll('[data-level]').forEach(function(x){x.textContent=x.dataset.level==='0'?T.low:x.dataset.level==='1'?T.mid:T.high;x.setAttribute('aria-pressed',String(selected&&+x.dataset.level===levels[selected]))})}
function setAllMeters(){setMeter(panel.body,signals.body);setMeter(panel.breath,signals.breath);setMeter(panel.attention,signals.attention)}
function setMeter(el,n){el.style.width=n+'%';el.parentElement.setAttribute('aria-valuenow',String(n))}
function poseVera(body,breath,attention){vera.rotation.z=body<45?.07:0;vera.rotation.y=attention<45?.16:0;vera.scale.y=breath<45?.985:1;vera.position.y=body<35?-.04:0}
function resetVera(){vera.rotation.set(0,0,0);vera.scale.set(1,1,1);vera.position.y=0}
function cycleMotion(){motionMode=motionMode==='normal'?'reduced':motionMode==='reduced'?'none':'normal';updateMotionButton();if(motionMode==='none'){animating=false;resetVera();render()}else if(rendererReady&&!animating)animate()}
function updateMotionButton(){var b=document.getElementById('dg-motion');var labels=lang==='es'?{normal:'Movimiento: normal',reduced:'Movimiento: reducido',none:'Movimiento: ninguno'}:{normal:'Motion: normal',reduced:'Motion: reduced',none:'Motion: none'};b.textContent=labels[motionMode];b.dataset.motion=motionMode;b.setAttribute('aria-label',b.textContent)}
function updateEnvironment(){lamp.userData.light.intensity=[.5,2.3,4.4][levels.light];speaker.scale.setScalar([.92,1,1.08][levels.sound]);blanket.scale.y=[.65,1,1.45][levels.texture]}
function keyNav(e){var used=true;if(e.key==='ArrowLeft')yaw-=.1;else if(e.key==='ArrowRight')yaw+=.1;else if(e.key==='ArrowUp')pitch=Math.max(-.55,pitch-.08);else if(e.key==='ArrowDown')pitch=Math.min(.12,pitch+.08);else if(e.key==='+'||e.key==='=')dist=Math.max(6,dist-.6);else if(e.key==='-')dist=Math.min(14,dist+.6);else used=false;if(used){e.preventDefault();applyCamera();render()}}
function applyCamera(){camera.position.set(Math.sin(yaw)*dist,3.8+pitch*4,Math.cos(yaw)*dist);camera.lookAt(0,1.35,-.2)}
function resize(){var w=host.clientWidth,h=host.clientHeight||620;camera.aspect=w/h;camera.updateProjectionMatrix();if(rendererReady)renderer.setSize(w,h,false);render()}
function render(){if(!rendererReady)return;renderer.render(scene,camera)}
function animate(){if(animating||motionMode==='none')return;animating=true;var start=performance.now();(function loop(now){if(!rendererReady||motionMode==='none'){animating=false;return}var t=(now-start)/1000;if(!solved){var amp=motionMode==='reduced'?.004:.015;vera.position.y=Math.sin(t*1.8)*amp;vera.rotation.x=motionMode==='normal'&&trials.length?Math.sin(t*.8)*.006:0}renderer.render(scene,camera);requestAnimationFrame(loop)})(start)}
function mat(color,rough){return new THREE.MeshStandardMaterial({color:color,roughness:rough==null?.72:rough,metalness:.02})}
function mesh(g,c,pos){var m=new THREE.Mesh(g,mat(c));m.position.set(pos[0],pos[1],pos[2]);m.castShadow=true;m.receiveShadow=true;return m}
function buildRoom(){scene.add(mesh(new THREE.BoxGeometry(9,.18,7),0xc9d1c2,[0,-.1,0]),mesh(new THREE.BoxGeometry(9,4.5,.16),0xf4efe5,[0,2.15,-3.42]),mesh(new THREE.BoxGeometry(.16,4.5,7),0xebe5d8,[-4.42,2.15,0]),mesh(new THREE.BoxGeometry(4.2,.05,2.8),0xb7c5b5,[.4,.03,.2]));var shelf=mesh(new THREE.BoxGeometry(2.2,1.7,.45),0x8d6f55,[2.8,.85,-3]);scene.add(shelf);for(var i=0;i<3;i++)scene.add(mesh(new THREE.BoxGeometry(.28,.7,.22),[0x55728f,0xa66161,0x708b63][i],[2.25+i*.35,1.75,-2.72]));scene.add(mesh(new THREE.BoxGeometry(2,.16,1.1),0x9a7858,[-1.9,1.25,-2.1]));[-2.65,-1.15].forEach(function(x){scene.add(mesh(new THREE.BoxGeometry(.14,1.2,.14),0x72573f,[x,.62,-2.1]))})}
function buildVera(){var g=new THREE.Group();g.position.set(.2,0,1.05);var skin=mat(0xd8aa88),hair=mat(0x315f7a),dress=mat(0xeee1c3),boot=mat(0x5d463a);var head=new THREE.Mesh(new THREE.SphereGeometry(.32,24,18),skin);head.position.y=2.72;g.add(head);var h1=new THREE.Mesh(new THREE.SphereGeometry(.35,24,18,0,Math.PI*2,0,Math.PI*.62),hair);h1.position.set(0,2.79,-.03);g.add(h1);var h2=new THREE.Mesh(new THREE.BoxGeometry(.6,.85,.18),hair);h2.position.set(0,2.45,-.25);g.add(h2);var torso=new THREE.Mesh(new THREE.CylinderGeometry(.34,.52,1.12,18),dress);torso.position.y=1.82;g.add(torso);[-.5,.5].forEach(function(x){var a=new THREE.Mesh(new THREE.CylinderGeometry(.095,.085,.95,12),skin);a.position.set(x,1.9,0);a.rotation.z=x<0?-.14:.14;g.add(a)});[-.2,.2].forEach(function(x){var l=new THREE.Mesh(new THREE.CylinderGeometry(.105,.09,.78,12),skin);l.position.set(x,.88,0);g.add(l);var b=new THREE.Mesh(new THREE.BoxGeometry(.24,.32,.38),boot);b.position.set(x,.36,.06);g.add(b)});return g}
function buildLamp(){var g=new THREE.Group();g.position.set(2.35,0,-1.45);g.add(mesh(new THREE.CylinderGeometry(.32,.4,.18,20),0x6d6d66,[0,.1,0]),mesh(new THREE.CylinderGeometry(.05,.05,1.55,12),0x7b766b,[0,.9,0]));var shade=mesh(new THREE.ConeGeometry(.46,.7,24,1,true),0xe2b85d,[0,1.72,0]);shade.rotation.x=Math.PI;g.add(shade);var bulb=new THREE.PointLight(0xffe3a1,2.3,5);bulb.position.set(0,1.5,0);g.add(bulb);g.userData.light=bulb;return g}
function buildSpeaker(){var g=new THREE.Group();g.position.set(-2.7,.58,-2.05);g.add(mesh(new THREE.BoxGeometry(.72,1.2,.55),0x43505c,[0,0,0]));[.25,-.25].forEach(function(y){var cone=mesh(new THREE.CylinderGeometry(.18,.12,.04,24),0x202a32,[0,y,.3]);cone.rotation.x=Math.PI/2;g.add(cone)});return g}
function buildBlanket(){var g=new THREE.Group();g.position.set(2.25,.25,1.55);g.add(mesh(new THREE.BoxGeometry(1.35,.22,1.75),0x8ca6a0,[0,0,0]));for(var i=-2;i<=2;i++)g.add(mesh(new THREE.BoxGeometry(.06,.235,1.72),0xcad6ce,[i*.22,.02,0]));return g}
})();