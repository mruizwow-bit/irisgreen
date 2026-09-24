// Iris Green · Eclipses: cálculo propio con astronomy-engine 2.1.19 (Don Cross, MIT).
// Salida: out/eclipses.json con eclipses globales 2000-2100, circunstancias locales en ciudades de España 2024-2040
// y rejillas de las zonas de totalidad/anularidad sobre España para los eclipses de 2026, 2027 y 2028.
import * as A from '../../ss/node_modules/astronomy-engine/esm/astronomy.js';
import fs from 'fs';
const HERE = new URL('..', import.meta.url).pathname;

const NE = JSON.parse(fs.readFileSync(HERE + 'raw/ne_10m_populated_places_simple.geojson'));
const FIX = { 'Seville': 'Sevilla', 'Granada‎': 'Granada', 'La Coruña': 'A Coruña', 'Castello': 'Castellón de la Plana', 'Vitoria': 'Vitoria-Gasteiz' };
const cities = NE.features.map(f => f.properties).filter(p => p.adm0name === 'Spain' || p.sov0name === 'Spain')
  .map(p => ({ n: FIX[p.name] || p.name, lat: +p.latitude.toFixed(3), lon: +p.longitude.toFixed(3), src: 'ne' }));
// capitales de provincia y lugares que no están en Natural Earth (coordenadas del centro urbano)
[['Lugo', 43.012, -7.556], ['Pontevedra', 42.431, -8.645], ['Huesca', 42.136, -0.409], ['Teruel', 40.344, -1.106], ['Lleida', 41.617, 0.62], ['Girona', 41.979, 2.821],
 ['Soria', 41.764, -2.465], ['Segovia', 40.948, -4.118], ['Ávila', 40.656, -4.7], ['Zamora', 41.503, -5.746], ['Palencia', 42.01, -4.531], ['Cuenca', 40.07, -2.137],
 ['Ciudad Real', 38.985, -3.927], ['Cáceres', 39.475, -6.372], ['Tarifa', 36.014, -5.604], ['Ibiza', 38.909, 1.433], ['Mahón', 39.889, 4.265],
 ['Santa Cruz de La Palma', 28.684, -17.765], ['Puerto del Rosario', 28.5, -13.862], ['San Sebastián de La Gomera', 28.092, -17.113], ['Valverde', 27.809, -17.915],
 ['Observatorio del Teide', 28.3, -16.51], ['Calar Alto', 37.22, -2.546]].forEach(([n, lat, lon]) => cities.push({ n, lat, lon, src: 'iris' }));
cities.forEach(c => { c.tz = (c.lat < 30 && c.lon < -12) ? 'Atlantic/Canary' : 'Europe/Madrid'; });
cities.sort((a, b) => a.n.localeCompare(b.n, 'es'));

const iso = (t) => t ? t.date.toISOString().slice(0, 19) + 'Z' : null;
const obs = (c) => new A.Observer(c.lat, c.lon, 0);

// ---------- eclipses globales ----------
const KIND = { partial: 'parcial', annular: 'anular', total: 'total', hybrid: 'hibrido', penumbral: 'penumbral' };
const solar = [];
for (let e = A.SearchGlobalSolarEclipse(new Date(Date.UTC(2000, 0, 1))); e.peak.date.getUTCFullYear() <= 2100; e = A.NextGlobalSolarEclipse(e.peak)) {
  solar.push({ t: iso(e.peak), k: KIND[e.kind], lat: e.latitude !== undefined ? +e.latitude.toFixed(2) : null, lon: e.longitude !== undefined ? +e.longitude.toFixed(2) : null });
}
const lunar = [];
for (let e = A.SearchLunarEclipse(new Date(Date.UTC(2000, 0, 1))); e.peak.date.getUTCFullYear() <= 2100; e = A.NextLunarEclipse(e.peak)) {
  lunar.push({ t: iso(e.peak), k: KIND[e.kind], dP: +e.sd_penum.toFixed(1), dp: +e.sd_partial.toFixed(1), dt: +e.sd_total.toFixed(1), o: +e.obscuration.toFixed(3) });
}

// ---------- circunstancias locales en España (eclipses de Sol) ----------
function localSolar(c, from, to) {
  const out = [];
  let e = A.SearchLocalSolarEclipse(from, obs(c));
  while (e.peak.time.date < to) {
    const alts = [e.partial_begin.altitude, e.peak.altitude, e.partial_end.altitude];
    if (Math.max(...alts) > 0) out.push({
      t: iso(e.peak.time), k: KIND[e.kind], o: +e.obscuration.toFixed(3),
      pb: iso(e.partial_begin.time), tb: e.total_begin ? iso(e.total_begin.time) : null, te: e.total_end ? iso(e.total_end.time) : null, pe: iso(e.partial_end.time),
      a: [+e.partial_begin.altitude.toFixed(1), +e.peak.altitude.toFixed(1), +e.partial_end.altitude.toFixed(1)] });
    e = A.NextLocalSolarEclipse(e.peak.time, obs(c));
  }
  return out;
}
const FROM = new Date(Date.UTC(2024, 0, 1)), TO = new Date(Date.UTC(2041, 0, 1));
const local = {};
cities.forEach(c => { local[c.n] = localSolar(c, FROM, TO); });

// ---------- eclipses de Luna vistos desde España ----------
function moonAlt(c, t) { const eq = A.Equator(A.Body.Moon, t, obs(c), true, true); return A.Horizon(t, obs(c), eq.ra, eq.dec, 'normal').altitude; }
const REF = cities.filter(c => ['Madrid', 'Barcelona', 'Sevilla', 'A Coruña', 'Palma', 'Las Palmas'].includes(c.n));
const lunarES = lunar.filter(l => { const y = +l.t.slice(0, 4); return y >= 2024 && y <= 2040; }).map(l => {
  const t = new Date(l.t), m = (min) => new Date(t.getTime() + min * 60000);
  const phases = { P1: m(-l.dP), U1: l.dp ? m(-l.dp) : null, U2: l.dt ? m(-l.dt) : null, max: t, U3: l.dt ? m(l.dt) : null, U4: l.dp ? m(l.dp) : null, P4: m(l.dP) };
  const alt = {}; REF.forEach(c => { alt[c.n] = Object.fromEntries(Object.entries(phases).filter(([, v]) => v).map(([k, v]) => [k, +moonAlt(c, v).toFixed(1)])); });
  return { ...l, fases: Object.fromEntries(Object.entries(phases).map(([k, v]) => [k, v ? v.toISOString().slice(0, 19) + 'Z' : null])), alt };
});

// ---------- rejillas sobre España para los eclipses centrales ----------
function grid(dateStr, box, step) {
  const d0 = new Date(new Date(dateStr).getTime() - 2 * 86400000), cells = [];
  for (let lat = box[1]; lat <= box[3] + 1e-9; lat += step) for (let lon = box[0]; lon <= box[2] + 1e-9; lon += step) {
    const e = A.SearchLocalSolarEclipse(d0, new A.Observer(lat, lon, 0));
    const dur = e.total_begin ? (e.total_end.time.date - e.total_begin.time.date) / 1000 : 0;
    cells.push([+lat.toFixed(2), +lon.toFixed(2), e.kind === 'total' ? 2 : e.kind === 'annular' ? 1 : 0, +e.obscuration.toFixed(5), +dur.toFixed(1), +e.peak.altitude.toFixed(1)]);
  }
  return cells;
}
const GRIDS = {};
for (const [k, d] of [['2026-08-12', '2026-08-12T17:00:00Z'], ['2027-08-02', '2027-08-02T10:00:00Z'], ['2028-01-26', '2028-01-26T15:00:00Z']]) {
  GRIDS[k] = { peninsula: grid(d, [-10, 34.4, 4.6, 44], 0.1), canarias: grid(d, [-18.3, 27.5, -13.3, 29.5], 0.05) };
  console.error('rejilla', k);
}

fs.mkdirSync(HERE + 'out', { recursive: true });
fs.writeFileSync(HERE + 'out/eclipses.json', JSON.stringify({ calculo: 'astronomy-engine 2.1.19 (Don Cross), MIT', fecha: '2026-09-24', ciudades: cities, solar, lunar, local, lunarES, rejillas: GRIDS }));
console.log('solar', solar.length, 'lunar', lunar.length, 'ciudades', cities.length);
const mad = local['Madrid'].map(e => `${e.t.slice(0, 10)} ${e.k} ${(e.o * 100).toFixed(0)}% alt ${e.a[1]}`); console.log('Madrid', mad);
for (const n of ['Tarifa', 'Ceuta', 'Melilla', 'Málaga', 'Cádiz', 'Sevilla', 'Almería', 'A Coruña', 'Oviedo', 'Valencia', 'Palma', 'Bilbao', 'Zaragoza']) {
  const e = local[n].filter(x => ['2026-08-12', '2027-08-02', '2028-01-26'].includes(x.t.slice(0, 10))).map(x => `${x.t.slice(0, 10)} ${x.k} ${(x.o * 100).toFixed(1)}% ${x.tb ? ((new Date(x.te) - new Date(x.tb)) / 1000).toFixed(0) + 's' : ''} alt ${x.a[1]}`);
  console.log(n, e);
}
