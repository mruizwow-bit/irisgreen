#!/usr/bin/env node
/* Iris Green · añade Vida diaria (48) y Datos (49) a buscador.json, con su pareja inglesa.
   Lee las páginas publicadas (h1, canónica, hreflang) y los JSON de cada sección (lede, categoría,
   territorio). No inventa texto: todo sale de archivos que ya existen en el repositorio.
   Se ejecuta en la raíz del repositorio.  Uso: node generar-entradas-buscador.js [--check]        */
'use strict';
const fs = require('fs'), path = require('path');
const CHECK = process.argv.includes('--check');
const un = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const norm = (s) => un(s).normalize('NFC').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const ruta = (u) => { try { return new URL(u, 'https://irisgreen.eu').pathname; } catch (e) { return ''; } };
function leer(f) {
  const h = fs.readFileSync(f, 'utf8');
  const g = (re) => { const m = h.match(re); return m ? m[1] : ''; };
  const chips = g(/<p class="chips">([\s\S]*?)<\/p>/); const chip = chips.match(/<span class="chip">([\s\S]*?)<\/span>/);
  return {
    h1: norm(g(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)),
    u: ruta(g(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/) || g(/<link[^>]*href="([^"]+)"[^>]*rel="canonical"/)),
    en: ruta(g(/<link[^>]*hreflang="en"[^>]*href="([^"]+)"/) || g(/<link[^>]*href="([^"]+)"[^>]*hreflang="en"/)),
    chip: chip ? norm(chip[1]) : '',
  };
}
const fichas = (dir) => fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => leer(path.join(dir, e.name, 'index.html')));
const json = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const vdES = json('es/biblioteca/vida-diaria.json'), vdEN = json('en/everyday-life/everyday-life.json');
const dtES = json('es/datos/datos.json'), dtEN = json('en/data/data.json');
const pVD = fichas('es/biblioteca'), pDT = fichas('es/datos');
const avisos = [], nuevas = [];
if (vdES.fichas.length !== vdEN.fichas.length) throw new Error('Vida diaria: los JSON ES y EN no tienen el mismo número de fichas');
vdES.fichas.forEach((fe, i) => {
  const fn = vdEN.fichas[i];
  const p = pVD.find((x) => x.h1 === norm(fe.title));
  if (!p) { avisos.push('Vida diaria sin página: ' + fe.title); return; }
  const pe = leer(path.join(p.en.replace(/^\//, ''), 'index.html'));
  if (pe.h1 !== norm(fn.title)) avisos.push(`Vida diaria EN: página «${pe.h1}» y JSON «${fn.title}» no coinciden`);
  nuevas.push({ s: 'Vida diaria', t: fe.title, u: p.u, d: norm(fe.lede), a: fe.cat, en: { s: 'Everyday life', t: pe.h1 || fn.title, u: pe.u || p.en, d: norm(fn.lede), a: fn.cat } });
});
const dDatos = (pg) => {
  let d = (pg.lede || []).filter((x) => x.t === 'p').map((x) => x.text).join(' ');
  const c = (pg.cifras || [])[0];
  if (d.length < 120 && c) d += ' ' + c.cifra + ' ' + ((c.b && c.b[0] && c.b[0].text) || c.pie || '');
  return norm(d);
};
for (const pg of dtES.paginas) {
  const pn = dtEN.paginas.find((x) => x.n === pg.n);
  const cands = pDT.filter((x) => x.h1 === norm(pg.title));
  const p = cands.length === 1 ? cands[0] : cands.find((x) => x.chip === norm(pg.territorio));
  if (!p) { avisos.push('Datos sin página: ' + pg.title + ' · ' + pg.territorio); continue; }
  const pe = leer(path.join(p.en.replace(/^\//, ''), 'index.html'));
  if (pe.h1 !== norm(pn.title)) avisos.push(`Datos EN: página «${pe.h1}» y JSON «${pn.title}» no coinciden`);
  nuevas.push({ s: 'Datos', t: pg.title, u: p.u, d: dDatos(pg), a: pg.territorio, en: { s: 'Data', t: pe.h1 || pn.title, u: pe.u || p.en, d: dDatos(pn), a: pn.territorio } });
}
const idx = json('buscador.json'); const antes = idx.length; const urls = new Set(idx.map((x) => x.u));
let añadidas = 0;
for (const e of nuevas) { if (urls.has(e.u)) continue; idx.push(e); urls.add(e.u); añadidas++; }
console.log(JSON.stringify({ antes, despues: idx.length, añadidas, avisos }, null, 2));
if (avisos.length) { console.error('Hay avisos: no se guarda.'); process.exit(1); }
if (!CHECK) fs.writeFileSync('buscador.json', JSON.stringify(idx, null, 2) + '\n');
