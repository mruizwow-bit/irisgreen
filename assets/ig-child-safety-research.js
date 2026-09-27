/* Iris Green R42 · Child-safe Investigación.
   Six S2 studies are absent from the initial dataset. Safe summaries are embedded
   here; full records are fetched only after ADULTEZ + explicit action. */
(function(){
'use strict';
var policy=window.IGChildSafety;if(!policy)return;
var lang=String(document.documentElement.lang||'es').toLowerCase().startsWith('en')?'en':'es';
var MAP={
 5:{id:'research-005',g:'eating_disorder',es:'ARFID frente a anorexia y bulimia en jóvenes',en:'ARFID compared with anorexia and bulimia in young people'},
 36:{id:'research-036',g:'suicide_self_harm',es:'Pensamientos y conductas suicidas en personas autistas',en:'Suicidal thoughts and behaviours in autistic people'},
 37:{id:'research-037',g:'suicide_self_harm',es:'Riesgo de autolesión y suicidabilidad en personas autistas',en:'Risk of self-harm and suicidality in autistic people'},
 45:{id:'research-045',g:'eating_disorder',es:'Rasgos autistas y anorexia nerviosa',en:'Autistic traits and anorexia nervosa'},
 46:{id:'research-046',g:'eating_disorder',es:'Tratamiento de los TCA en personas autistas o con rasgos autistas altos',en:'Eating-disorder treatment in autistic people or people with high autistic traits'},
 71:{id:'research-071',g:'sexual_adverse_experience',es:'Identidad de género, orientación sexual y experiencias sexuales adversas en mujeres autistas',en:'Gender identity, sexual orientation and adverse sexual experiences in autistic women'}
};
var COPY={
 eating_disorder:{es:{h:'Explicación segura',s:'Esta información habla de dificultades serias relacionadas con la comida y la salud. La versión segura evita pesos, calorías, comparaciones corporales y detalles sobre conductas que puedan resultar dañinas. Si comer, el miedo a comer o lo que ocurre después de comer te preocupa, habla con una persona adulta de confianza y con un profesional sanitario.',a:'Puedes pedir ayuda aunque no sepas ponerle un nombre a lo que te pasa.'},en:{h:'Safer explanation',s:'This information is about serious difficulties involving food and health. The safer version avoids weights, calories, body comparisons and details about behaviours that could be harmful. If eating, fear around eating, or what happens after eating is worrying you, speak to a trusted adult and a health professional.',a:'You can ask for help even if you do not know what to call what is happening.'}},
 suicide_self_harm:{es:{h:'Resumen seguro de la investigación',s:'Esta investigación trata sobre pensamientos de hacerse daño o de no querer seguir viviendo. La versión segura no muestra métodos, instrucciones ni detalles gráficos. Resume qué se ha estudiado y qué apoyos se consideran importantes.',a:'Si esto tiene que ver contigo o con alguien cercano, busca apoyo de una persona de confianza o de un servicio de ayuda. Si hay peligro inmediato, contacta con emergencias.'},en:{h:'Safer research summary',s:'This research concerns thoughts of self-harm or not wanting to stay alive. The safer version does not show methods, instructions or graphic details. It summarises what researchers have studied and what kinds of support are considered important.',a:'If this relates to you or someone close to you, seek support from someone you trust or a support service. If there is immediate danger, contact emergency services.'}},
 sexual_adverse_experience:{es:{h:'Resumen seguro',s:'Esta investigación incluye experiencias sexuales no deseadas o difíciles. La versión segura evita detalles y se centra en lo que se estudió, sus límites y la importancia de poder pedir apoyo.',a:'Si algo te ha ocurrido y te preocupa, puedes hablar con una persona adulta de confianza o con un profesional sin tener que contar todos los detalles de una vez.'},en:{h:'Safer summary',s:'This research includes unwanted or difficult sexual experiences. The safer version avoids details and focuses on what was studied, its limitations and the importance of being able to ask for support.',a:'If something has happened to you and you are worried, you can speak to a trusted adult or a professional without having to tell every detail at once.'}}
};
var L=lang==='en'?{label:'Content for…',all:'Any age',child:'Children',teen:'Teenagers',adult:'Adults',sensitive:'Sensitive research',full:'View full information',safe:'Safer summary',loading:'Loading full information…',error:'Full information could not be loaded.'}:{label:'Contenido para…',all:'Cualquier edad',child:'Infancia',teen:'Adolescencia',adult:'Adultez',sensitive:'Investigación sensible',full:'Ver información completa',safe:'Resumen seguro',loading:'Cargando la información completa…',error:'No se ha podido cargar la información completa.'};
var main=document.querySelector('main');if(!main)return;
var box=document.createElement('section');box.className='ig-research-safety';box.setAttribute('aria-label',L.label);
box.innerHTML='<div class="ig-s2-toolbar"><label><span>'+L.label+'</span><select data-ig-audience-select><option value="all">'+L.all+'</option><option value="child">'+L.child+'</option><option value="teen">'+L.teen+'</option><option value="adult">'+L.adult+'</option></select></label><p class="ig-s2-status" role="status" aria-live="polite"></p></div><div data-ig-research-sensitive></div>';
main.insertBefore(box,main.firstChild);
var select=box.querySelector('select'),region=box.querySelector('[data-ig-research-sensitive]'),status=box.querySelector('[role=status]');

function numberFromHash(){var m=String(location.hash||'').match(/(?:estudio|study)-(\d+)/);return m?Number(m[1]):0;}
function safeCard(n,adult){
 var meta=MAP[n],copy=meta&&COPY[meta.g]&&COPY[meta.g][lang];if(!meta||!copy)return null;
 var a=document.createElement('article');a.className='ig-s2-safe ig-research-s2-card';a.setAttribute('data-study',String(n));
 var title=lang==='en'?meta.en:meta.es;
 a.innerHTML='<p class="ig-research-s2-kicker">'+L.sensitive+'</p><h2>'+escapeHtml(title)+'</h2><h3>'+escapeHtml(copy.h)+'</h3><p>'+escapeHtml(copy.s)+'</p><div class="ig-s2-safe-note"><p>'+escapeHtml(copy.a)+'</p></div>';
 if(adult){var b=document.createElement('button');b.type='button';b.textContent=L.full;b.setAttribute('data-load-research-full',meta.id);b.addEventListener('click',function(){loadFull(meta,a,b);});a.appendChild(b);}
 return a;
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
function render(){
 region.replaceChildren();
 var adult=policy.getAudience()==='adult',direct=numberFromHash();
 if(direct&&MAP[direct]){region.appendChild(safeCard(direct,adult));return;}
 if(adult){Object.keys(MAP).forEach(function(n){region.appendChild(safeCard(Number(n),true));});}
}
function loadFull(meta,card,button){
 if(!policy.mayLoadFull({sensitivity:'S2_HIGH_SENSITIVITY'},{audience:policy.getAudience(),explicitAction:true}))return;
 button.disabled=true;status.textContent=L.loading;
 fetch('/assets/content/full/'+meta.id+'.'+lang+'.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(String(r.status));return r.json();}).then(function(p){
   if(policy.getAudience()!=='adult')return;
   var row=p.record||{},full=document.createElement('div');full.setAttribute('data-ig-s2-full','');full.className='ig-research-full';
   var paragraphs=(lang==='en'?(row.text_en||[]):(row.text||[])).map(function(x){return '<p>'+escapeHtml(x)+'</p>';}).join('');
   var means=lang==='en'?(row.means_en||''):(row.means||''),notp=lang==='en'?(row.notProven_en||''):(row.notProven||'');
   full.innerHTML='<h2 tabindex="-1">'+escapeHtml(lang==='en'?(row.heading_en||row.heading||''):(row.heading||''))+'</h2>'+paragraphs+'<p>'+escapeHtml(means)+'</p><p>'+escapeHtml(notp)+'</p>'+(row.doi?'<p><a href="'+escapeHtml(row.doi)+'">'+escapeHtml(row.doi)+'</a></p>':'');
   card.replaceChildren(full);full.querySelector('h2').focus();status.textContent='';
 }).catch(function(){status.textContent=L.error;}).finally(function(){button.disabled=false;});
}
select.addEventListener('change',function(){policy.setAudience(select.value);render();});
window.addEventListener('ig:audience-change',function(){if(policy.getAudience()!=='adult')policy.purgeFull(region);select.value=policy.getAudience()==='default'?'all':policy.getAudience();render();});
window.addEventListener('hashchange',render);
policy.setAudience('all');render();
})();