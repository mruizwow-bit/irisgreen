
(function(){
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const norm=s=>(s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 async function routines(){
   const host=$('[data-routines]'); if(!host)return;
   const data=await fetch('/assets/data/rutinas-92-427.json').then(r=>r.json());
   const q=$('#routineSearch'), cat=$('#routineCat'), count=$('#routineCount');
   Object.keys(data.categorias).forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c+' · '+data.categorias[c];cat.appendChild(o)});
   function render(){
     const term=norm(q.value), c=cat.value;
     const rows=data.items.filter(x=>(!c||x.categoria===c)&&(!term||norm(x.es+' '+x.en+' '+x.id+' '+x.categoria).includes(term)));
     count.textContent=rows.length+' rutinas · '+rows.reduce((a,b)=>a+b.pasos.length,0)+' pasos visibles';
     host.innerHTML=rows.map(x=>`<details class="item"><summary><span><strong>${esc(x.es)}</strong><br><span class="muted">${esc(x.id)} · ${esc(x.categoria)} · ${esc(x.nivel||'')}</span></span><span class="tag">${x.pasos.length} pasos</span></summary><div class="item-body"><div>${esc(x.dificultad||'')}</div><ol class="steps">${x.pasos.map(p=>`<li><span class="step-n">${p.n}</span><span><strong>${esc(p.es)}</strong><br><span class="muted">${esc(p.en||'')}</span>${p.reformulacion?`<br><span class="muted">Reformulación: ${esc(p.reformulacion)}</span>`:''}</span><span class="status">${esc(p.estado||'')}</span></li>`).join('')}</ol></div></details>`).join('');
   }
   q.addEventListener('input',render);cat.addEventListener('change',render);render();
 }
 async function games(){
   const host=$('[data-games]'); if(!host)return;
   const data=await fetch('/assets/data/juegos-image-first-42.json').then(r=>r.json());
   const q=$('#gameSearch'), st=$('#gameStatus'), count=$('#gameCount');
   function render(){
     const term=norm(q.value), s=st.value;
     const rows=data.items.filter(x=>(!s||x.estado===s)&&(!term||norm(x.juego+' '+x.rutina+' '+x.habilidad+' '+x.mecanica).includes(term)));
     count.textContent=rows.length+' juegos';
     host.innerHTML=rows.map(x=>`<article class="game"><span class="tag ${x.estado==='REUSA_BASE_EXISTENTE'?'good':'warn'}">${x.estado==='REUSA_BASE_EXISTENTE'?'Reutiliza base':'Nuevo'}</span><h3>${esc(x.juego)}</h3><p><strong>${esc(x.habilidad)}</strong><br>${esc(x.rutina)} · ${esc(x.nivel)}</p><details><summary>Mecánica y accesibilidad</summary><p>${esc(x.mecanica)}</p><p class="muted">${esc(x.interaccion)}</p><p><strong>Reducida:</strong> ${esc(x.reducida)}</p><p><strong>Paso a paso:</strong> ${esc(x.paso_a_paso)}</p><p><strong>Sin depender de lectura:</strong> ${esc(x.sin_lectura)}</p></details></article>`).join('');
   }
   q.addEventListener('input',render);st.addEventListener('change',render);render();
 }
 function esc(v){return (v??'').toString().replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 routines();games();
})();
