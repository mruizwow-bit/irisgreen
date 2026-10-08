import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const m = html.match(/<script id="game-data" type="application\/json">([\s\S]*?)<\/script>/);
if (!m) throw new Error('No se encontró game-data');
const data = JSON.parse(m[1]);
const out = {};
for (const e of data.edges) (out[e.a] ||= []).push(e);

const routes = [];
function walk(node, route, seen) {
  if (node === 'T') { routes.push(route.slice()); return; }
  for (const e of out[node] || []) {
    if (seen.has(e.b)) continue;
    seen.add(e.b); route.push(e); walk(e.b, route, seen); route.pop(); seen.delete(e.b);
  }
}
walk('S', [], new Set(['S']));

function stops(profile, route) {
  const total = {time:0,energy:0,noise:0,people:0,stairs:0,light:0,wait:0};
  for (const e of route) {
    for (const k of Object.keys(total)) total[k] += e.cost[k];
    if (Object.keys(total).some(k => total[k] > profile.limits[k])) return true;
  }
  return false;
}

const result = {routes: routes.length, people:{}, pass:true};
for (const p of data.profiles) {
  let llegan=0, seParan=0;
  for (const r of routes) (stops(p,r) ? seParan++ : llegan++);
  const pass = llegan >= 3 && seParan >= 1;
  result.people[p.name.es] = {llegan,se_paran:seParan,pass};
  if (!pass) result.pass=false;
}
fs.writeFileSync(path.join(import.meta.dirname,'resultado-apertura.json'), JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if (!result.pass) process.exit(1);
