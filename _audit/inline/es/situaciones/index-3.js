
(function(){
  const root=document.querySelector('.situations-collection');
  if(!root) return;
  const cards=[...root.querySelectorAll('.cards .card')];
  const search=root.querySelector('#situationsSearch');
  const buttons=[...root.querySelectorAll('.situation-filter')];
  const count=root.querySelector('#situationsCount');
  const empty=root.querySelector('#situationsEmpty');
  let area='*';
  const normalize=(s)=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  function apply(){
    const q=normalize(search ? search.value : '');
    let shown=0;
    cards.forEach(card=>{
      const okArea=area==='*' || card.dataset.area===area;
      const okText=!q || normalize(card.textContent).includes(q);
      const show=okArea && okText;
      card.hidden=!show;
      if(show) shown++;
    });
    const total=cards.length;
    const word=shown===1?"situación":"situaciones";
    count.textContent = shown===total ? `${total} ${word}` : `${shown} de ${total} ${word} · mostradas`;
    empty.hidden=shown!==0;
  }
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    area=btn.dataset.filter;
    buttons.forEach(x=>{const on=x===btn; x.classList.toggle('is-active',on); x.setAttribute('aria-pressed',on?'true':'false');});
    apply();
  }));
  if(search) search.addEventListener('input',apply);
})();
