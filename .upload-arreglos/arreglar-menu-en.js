#!/usr/bin/env node
/* Iris Green · menú inglés de las páginas españolas con cabecera generada.
   Corrige los enlaces .ig-nav-en que llevan a /es/ cuando ya existe la página inglesa,
   y amplía routeEn en assets/buscador-comun.js. Se ejecuta en la raíz del repositorio.
   Uso:  node arreglar-menu-en.js --check   (solo informa)
         node arreglar-menu-en.js           (escribe)                                  */
'use strict';
const fs = require('fs'), path = require('path');
const CHECK = process.argv.includes('--check');
const MAP = { biblioteca: '/en/everyday-life/', datos: '/en/data/', intereses: '/en/interests/', 'sitio-tranquilo': '/en/quiet-space/' };
const RE1 = /(<a\b[^>]*\bclass="ig-nav-en(?: ig-calma)?"[^>]*\bhref=")\/es\/(biblioteca|datos|intereses|sitio-tranquilo)\/(")/g;
const RE2 = /(<a\b[^>]*\bhref=")\/es\/(biblioteca|datos|intereses|sitio-tranquilo)\/("[^>]*\bclass="ig-nav-en(?: ig-calma)?")/g;
function paginas(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) paginas(p, out); else if (e.name === 'index.html') out.push(p);
  }
  return out;
}
const files = ['index.html', ...paginas('es', [])].filter((f) => fs.existsSync(f));
let tocados = 0, enlaces = 0;
for (const f of files) {
  const old = fs.readFileSync(f, 'utf8');
  if (!old.includes('class="ig-nav-en')) continue;
  let n = 0;
  const neu = old.replace(RE1, (m, a, k, b) => { n++; return a + MAP[k] + b; }).replace(RE2, (m, a, k, b) => { n++; return a + MAP[k] + b; });
  if (!n) continue;
  tocados++; enlaces += n;
  console.log(`${CHECK ? 'cambiaría' : 'cambiado'}  ${f}  (${n} enlaces)`);
  if (!CHECK) fs.writeFileSync(f, neu);
}
const js = 'assets/buscador-comun.js';
const viejo = "var routeEn = {'/es/biblioteca':'/en/everyday-life'};";
const nuevo = "var routeEn = {'/es/biblioteca':'/en/everyday-life','/es/datos':'/en/data','/es/intereses':'/en/interests','/es/sitio-tranquilo':'/en/quiet-space','/es/privacidad':'/en/privacy'};";
if (fs.existsSync(js)) {
  const s = fs.readFileSync(js, 'utf8');
  if (s.includes(viejo)) { console.log(`${CHECK ? 'cambiaría' : 'cambiado'}  ${js}  (routeEn)`); if (!CHECK) fs.writeFileSync(js, s.replace(viejo, nuevo)); }
  else console.log(s.includes(nuevo) ? `ya está      ${js}` : `AVISO: routeEn no tiene la forma esperada en ${js}`);
}
console.log(`${tocados} páginas, ${enlaces} enlaces.${CHECK ? ' Nada escrito.' : ''}`);
