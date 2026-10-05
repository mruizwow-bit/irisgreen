"use strict";
(() => {
  const data = window.PRISMA_CATALOGO;
  const list = document.getElementById("catalog");
  const input = document.getElementById("filter");
  const empty = document.getElementById("empty");
  const summary = document.getElementById("summary");

  function normaliza(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function card(item) {
    const li = document.createElement("li");
    li.className = "card";
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = item.acceso;
    const h = document.createElement("h2");
    h.textContent = item.titulo;
    const p = document.createElement("p");
    p.textContent = item.resumen;
    li.append(pill,h,p);
    if (item.disponible && item.href) {
      const a = document.createElement("a");
      a.className = "cta";
      a.href = item.href;
      a.textContent = "Entrar";
      a.setAttribute("aria-label", `Entrar en ${item.titulo}`);
      li.append(a);
    } else {
      const status = document.createElement("span");
      status.className = "unavailable";
      status.textContent = "Todavía no disponible";
      status.setAttribute("aria-disabled","true");
      li.append(status);
    }
    return li;
  }

  function render() {
    const q = normaliza(input.value.trim());
    const visible = data.filter(item => normaliza(item.titulo+" "+item.resumen+" "+item.acceso).includes(q));
    list.replaceChildren(...visible.map(card));
    empty.hidden = visible.length !== 0;
    list.hidden = visible.length === 0;
    summary.textContent = visible.length === data.length
      ? `${data.length} entradas en el catálogo.`
      : `${visible.length} de ${data.length} entradas visibles.`;
  }

  function reset() {
    input.value = "";
    render();
    input.focus();
  }
  input.addEventListener("input",render);
  document.getElementById("clear").addEventListener("click",reset);
  document.getElementById("empty-reset").addEventListener("click",reset);
  render();
})();