#!/usr/bin/env python3
"""Monta las páginas de Eclipses (ES y EN) sobre la cubierta de Planetas y sistema solar.
Uso: build_pages_ecl.py <raíz del repositorio>
Datos: out/eclipses.json (gen/eclipses.mjs, astronomy-engine). Mapas: gen/maps.py (Natural Earth, dominio público)."""
import html, json, re, sys
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import maps

HERE = Path(__file__).resolve().parent.parent
ROOT = Path(sys.argv[1])
D = json.load(open(HERE / 'out/eclipses.json'))
e = lambda s: html.escape('' if s is None else str(s), quote=True)
CITY = {c['n']: c for c in D['ciudades']}
MAPC = {'Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao', 'A Coruña', 'Málaga', 'Cádiz', 'Palma', 'Zaragoza', 'Oviedo', 'Almería', 'Ceuta', 'Melilla',
        'Las Palmas', 'Santa Cruz de Tenerife', 'Valladolid', 'Murcia', 'Badajoz', 'León'}
for c in D['ciudades']: c['map'] = c['n'] in MAPC
CITY_EN = {'Sevilla': 'Seville', 'A Coruña': 'A Coruña', 'Observatorio del Teide': 'Teide Observatory', 'Mahón': 'Mahón'}
MONTHS = {'es': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
          'en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']}

def cn(n, lang): return CITY_EN.get(n, n) if lang == 'en' else n
def dt(s): return datetime.fromisoformat(s.replace('Z', '+00:00'))
def local(s, tz, secs=False): return dt(s).astimezone(ZoneInfo(tz)).strftime('%H:%M:%S' if secs else '%H:%M')
def fdate(s, lang, tz='Europe/Madrid'):
    d = dt(s).astimezone(ZoneInfo(tz)); m = MONTHS[lang][d.month - 1]
    return f'{d.day} de {m} de {d.year}' if lang == 'es' else f'{d.day} {m} {d.year}'
def pct(o, lang, total=True):
    v = o * 100
    if not total: v = min(v, 99.9)
    s = f'{v:.1f}' if v < 99.95 else '100'
    return (s.replace('.', ',') if lang == 'es' else s) + ' %'
def dur(sec, lang):
    m, s = divmod(int(round(sec)), 60)
    return f'{m} min {s:02d} s' if m else f'{s} s'
KIND = {'es': {'total': 'Total', 'anular': 'Anular', 'parcial': 'Parcial', 'hibrido': 'Híbrido', 'penumbral': 'Penumbral'},
        'en': {'total': 'Total', 'anular': 'Annular', 'parcial': 'Partial', 'hibrido': 'Hybrid', 'penumbral': 'Penumbral'}}

T = {
 'es': dict(title='Eclipses', docTitle='Eclipses · Tus intereses | Iris Green', crumbHref='/es/intereses/', crumb='Tus intereses',
   desc='Cómo se verán los eclipses desde tu ciudad, minuto a minuto: el total del 2 de agosto de 2027, el anular de 2028 y todos los eclipses de Sol y de Luna hasta 2100.',
   stage_lede='Mira cómo se verá un eclipse desde tu ciudad, minuto a minuto. Está calculado con las posiciones reales del Sol y de la Luna.',
   nojs_stage='El simulador necesita JavaScript. Más abajo están todos los mapas, las horas y las tablas.',
   s_now='Qué estás viendo', now_nojs='Aquí aparece lo que ves en el simulador: cuánto Sol queda tapado, a qué altura está y cuándo empieza y acaba cada fase.',
   onpage='En esta página', s_27='2 de agosto de 2027: total', s_28='26 de enero de 2028: anular', s_26='12 de agosto de 2026: el último', s_next='Próximos eclipses desde España',
   s_safe='Cómo mirarlo sin peligro', s_how='Cómo funcionan', s_cat='Todos los eclipses de 2000 a 2100', s_mine='Mi colección', s_src='Fuentes y cómo se calcula',
   p1='eclipses de Sol visibles desde España hasta 2040', p2='eclipses de Luna visibles desde España hasta 2040', p3='eclipses en el catálogo', p4='ciudades y lugares',
   i27='Un eclipse total largo: en Ceuta y Melilla la totalidad dura casi 5 minutos. La franja de totalidad cruza el Estrecho y la costa de Cádiz y Málaga. En el resto de España se verá parcial, con más del 70 % del Sol tapado.',
   i28='Un eclipse anular: la Luna, algo más lejos de lo normal, no llega a tapar el Sol entero y deja un anillo de luz. Se verá con el Sol muy bajo, hacia el suroeste, poco antes de ponerse, en una franja ancha que cruza la península desde Huelva y Cádiz hasta Valencia, Tarragona y Baleares. En Barcelona, Girona y Menorca el anillo coincide con la puesta de sol.',
   i26='El 12 de agosto de 2026 la totalidad cruzó el norte y el este de España al atardecer. Aquí queda cómo fue en cada ciudad.',
   map_note='Zona oscura: allí el eclipse es total. Líneas blancas: 1, 2, 3 y 4 minutos de totalidad, de fuera hacia dentro. Líneas moradas discontinuas: porcentaje del Sol tapado. Canarias, en el recuadro.',
   map_note_a='Zona naranja: allí el eclipse es anular. Líneas moradas discontinuas: porcentaje del Sol tapado. Canarias, en el recuadro.',
   th_city='Lugar', th_kind='Qué se ve', th_pct='Sol tapado', th_start='Empieza', th_max='Máximo', th_end='Acaba', th_tstart='Empieza la totalidad', th_tend='Acaba', th_dur='Duración', th_alt='Altura del Sol en el máximo', th_date='Fecha',
   th_astart='Empieza el anillo', th_type='Tipo', th_where='Dónde es mayor', th_mad='Madrid', th_bcn='Barcelona', th_sev='Sevilla', th_lpa='Las Palmas', th_visible='Se ve desde España',
   th_lmax='Máximo (hora de la península)', th_ltotal='Totalidad', th_utc='Máximo (UTC)',
   cap27='Eclipse del 2 de agosto de 2027 en cada lugar', cap28='Eclipse del 26 de enero de 2028 en cada lugar', cap26='Eclipse del 12 de agosto de 2026 en cada lugar',
   capsol='Eclipses de Sol visibles desde España, de 2027 a 2040', caplun='Eclipses de Luna visibles desde España, de 2027 a 2040', capcat='Eclipses de Sol y de Luna de 2000 a 2100',
   hours='Horas oficiales de cada lugar (Canarias, una hora menos). Altura del Sol en grados sobre el horizonte.',
   safe_intro='Mirar el Sol sin protección daña los ojos en segundos, y no duele: no te das cuenta. Estas normas sirven para cualquier eclipse de Sol.',
   safe=['Usa gafas de eclipse que cumplan la norma ISO 12312-2 y lleven la marca CE. Compruébalas antes: sin rayas ni agujeros.', 'Las gafas de sol, las radiografías, los cristales ahumados y los CD no protegen.',
         'Nunca mires el Sol con prismáticos, telescopios o la cámara del móvil sin un filtro solar delante del objetivo, aunque lleves las gafas puestas.',
         'Una forma segura sin gafas: haz un agujero pequeño en una cartulina y proyecta la imagen del Sol sobre un papel blanco, de espaldas al Sol. Un colador o las hojas de un árbol hacen lo mismo.',
         'Solo durante la totalidad, cuando el Sol está tapado por completo, se puede mirar sin gafas. En cuanto asoma el primer punto de luz, vuelve a ponértelas.',
         'En un eclipse anular o parcial no hay ningún momento sin peligro: las gafas no se quitan en ningún momento.'],
   how_intro='Un eclipse ocurre cuando el Sol, la Tierra y la Luna quedan en línea.',
   how=[('Eclipse de Sol', 'La Luna pasa por delante del Sol y su sombra cae sobre la Tierra. Solo pasa en luna nueva. Donde llega la parte más oscura de la sombra, el eclipse es total; alrededor se ve parcial.'),
        ('Total, anular o parcial', 'La Luna es 400 veces más pequeña que el Sol, pero está 400 veces más cerca: por eso parecen del mismo tamaño. Si la Luna está algo más lejos, no tapa el Sol entero y queda un anillo: es un eclipse anular.'),
        ('Eclipse de Luna', 'La Tierra se pone entre el Sol y la Luna, y su sombra cubre la Luna. Solo pasa en luna llena y se ve desde toda la mitad de la Tierra donde es de noche. Mirarlo no tiene ningún peligro.'),
        ('Por qué la Luna se pone roja', 'En un eclipse total de Luna, algo de luz del Sol atraviesa la atmósfera de la Tierra y se dobla hacia la Luna. La atmósfera deja pasar sobre todo la luz roja, como en los atardeceres.'),
        ('Por qué no hay uno cada mes', 'La órbita de la Luna está inclinada unos 5° respecto a la de la Tierra. Casi siempre la Luna pasa por encima o por debajo de la línea Sol-Tierra. Hay entre 4 y 7 eclipses al año, contando los de Sol y los de Luna.'),
        ('El ciclo de Saros', 'Cada 18 años, 11 días y 8 horas, el Sol, la Tierra y la Luna vuelven a quedar casi igual. Un eclipse se repite parecido un Saros después, un tercio de vuelta a la Tierra más al oeste.')],
   mine_intro='Marca los eclipses que has visto. Se guarda solo en este navegador y en este dispositivo: no se envía a ningún sitio. Puedes borrarlo cuando quieras.',
   mine_nojs='Mi colección necesita JavaScript.',
   src=['Cálculo propio de Iris Green con astronomy-engine 2.1.19 (Don Cross, licencia MIT): posiciones del Sol y de la Luna, eclipses globales de 2000 a 2100, circunstancias locales en 72 lugares de España y mapas con una rejilla de 0,1°.',
        'Comprobación con los datos oficiales del Instituto Geográfico Nacional para el 2 de agosto de 2027: en Ceuta, Cádiz, Málaga y Melilla la duración de la totalidad difiere en menos de 8 segundos, y el porcentaje de Madrid en un punto. No se tiene en cuenta el relieve del borde de la Luna, que cambia la duración unos segundos.',
        'Para planificar un viaje o una observación, consulta siempre las horas oficiales del IGN: eclipses.ign.es.',
        'Mapas: Natural Earth (dominio público). Lugares: Natural Earth y coordenadas de centro urbano para las capitales que faltaban.',
        'Estrellas del simulador: HYG Database v4.1 (CC BY-SA 4.0), las mismas que Cielo nocturno.'],
   dl='Descargar los datos (JSON)', langLink='/en/interests/eclipses/'),
 'en': dict(title='Eclipses', docTitle='Eclipses · Your interests | Iris Green', crumbHref='/en/interests/', crumb='Your interests',
   desc='How eclipses will look from your city, minute by minute: the total eclipse of 2 August 2027, the annular eclipse of 2028 and every solar and lunar eclipse up to 2100.',
   stage_lede='See how an eclipse will look from your city, minute by minute. It is worked out from the real positions of the Sun and the Moon.',
   nojs_stage='The simulator needs JavaScript. All the maps, times and tables are further down.',
   s_now='What you are looking at', now_nojs='What you see in the simulator appears here: how much of the Sun is covered, how high it is and when each phase starts and ends.',
   onpage='On this page', s_27='2 August 2027: total', s_28='26 January 2028: annular', s_26='12 August 2026: the latest one', s_next='Coming eclipses from Spain',
   s_safe='How to watch safely', s_how='How they work', s_cat='All eclipses from 2000 to 2100', s_mine='My collection', s_src='Sources and how it is calculated',
   p1='solar eclipses visible from Spain up to 2040', p2='lunar eclipses visible from Spain up to 2040', p3='eclipses in the catalogue', p4='cities and places',
   i27='A long total eclipse: in Ceuta and Melilla totality lasts almost 5 minutes. The strip of totality crosses the Strait of Gibraltar and the coast of Cádiz and Málaga. The rest of Spain will see a partial eclipse, with more than 70% of the Sun covered.',
   i28='An annular eclipse: the Moon, a little further away than usual, cannot cover the whole Sun and leaves a ring of light. It will be seen with the Sun very low in the south-west, shortly before sunset, in a wide strip that crosses mainland Spain from Huelva and Cádiz to Valencia, Tarragona and the Balearic Islands. In Barcelona, Girona and Menorca the ring coincides with sunset.',
   i26='On 12 August 2026 totality crossed the north and east of Spain at sunset. This is how it was in each city.',
   map_note='Dark area: the eclipse is total there. White lines: 1, 2, 3 and 4 minutes of totality, from the outside in. Dashed purple lines: percentage of the Sun covered. The Canary Islands are in the box.',
   map_note_a='Orange area: the eclipse is annular there. Dashed purple lines: percentage of the Sun covered. The Canary Islands are in the box.',
   th_city='Place', th_kind='What you see', th_pct='Sun covered', th_start='Starts', th_max='Maximum', th_end='Ends', th_tstart='Totality starts', th_tend='Ends', th_dur='Length', th_alt='Height of the Sun at maximum', th_date='Date',
   th_astart='Ring starts', th_type='Type', th_where='Where it is greatest', th_mad='Madrid', th_bcn='Barcelona', th_sev='Seville', th_lpa='Las Palmas', th_visible='Visible from Spain',
   th_lmax='Maximum (mainland time)', th_ltotal='Totality', th_utc='Maximum (UTC)',
   cap27='Eclipse of 2 August 2027 at each place', cap28='Eclipse of 26 January 2028 at each place', cap26='Eclipse of 12 August 2026 at each place',
   capsol='Solar eclipses visible from Spain, 2027 to 2040', caplun='Lunar eclipses visible from Spain, 2027 to 2040', capcat='Solar and lunar eclipses from 2000 to 2100',
   hours='Official local time at each place (Canary Islands, one hour less). Height of the Sun in degrees above the horizon.',
   safe_intro='Looking at the Sun without protection damages your eyes in seconds, and it does not hurt: you do not notice. These rules apply to any solar eclipse.',
   safe=['Use eclipse glasses that meet the ISO 12312-2 standard and carry the CE mark. Check them first: no scratches or holes.', 'Sunglasses, X-rays, smoked glass and CDs do not protect you.',
         'Never look at the Sun through binoculars, telescopes or a phone camera without a solar filter in front of the lens, even if you are wearing the glasses.',
         'A safe way without glasses: make a small hole in a piece of card and project the image of the Sun onto white paper, with your back to the Sun. A colander or the leaves of a tree do the same.',
         'Only during totality, when the Sun is completely covered, can you look without glasses. As soon as the first point of light appears, put them back on.',
         'In an annular or partial eclipse there is no safe moment: the glasses never come off.'],
   how_intro='An eclipse happens when the Sun, the Earth and the Moon are in line.',
   how=[('Solar eclipse', 'The Moon passes in front of the Sun and its shadow falls on the Earth. It only happens at new moon. Where the darkest part of the shadow reaches, the eclipse is total; around it, it is partial.'),
        ('Total, annular or partial', 'The Moon is 400 times smaller than the Sun but 400 times closer: that is why they look the same size. If the Moon is a little further away, it does not cover the whole Sun and a ring is left: an annular eclipse.'),
        ('Lunar eclipse', 'The Earth comes between the Sun and the Moon, and its shadow covers the Moon. It only happens at full moon and can be seen from the whole night side of the Earth. Watching it is completely safe.'),
        ('Why the Moon turns red', 'In a total lunar eclipse some sunlight passes through the Earth’s atmosphere and bends towards the Moon. The atmosphere mostly lets red light through, as at sunset.'),
        ('Why there is not one every month', 'The Moon’s orbit is tilted by about 5° to the Earth’s. Most of the time the Moon passes above or below the Sun-Earth line. There are between 4 and 7 eclipses a year, counting solar and lunar ones.'),
        ('The Saros cycle', 'Every 18 years, 11 days and 8 hours, the Sun, the Earth and the Moon line up almost the same way again. An eclipse repeats in a similar way one Saros later, a third of the way round the Earth further west.')],
   mine_intro='Mark the eclipses you have seen. It is saved only in this browser and on this device: it is not sent anywhere. You can delete it whenever you like.',
   mine_nojs='My collection needs JavaScript.',
   src=['Iris Green’s own calculation with astronomy-engine 2.1.19 (Don Cross, MIT licence): positions of the Sun and Moon, global eclipses from 2000 to 2100, local circumstances at 72 places in Spain and maps on a 0.1° grid.',
        'Checked against the official data of Spain’s National Geographic Institute (IGN) for 2 August 2027: in Ceuta, Cádiz, Málaga and Melilla the length of totality differs by less than 8 seconds, and Madrid’s percentage by one point. The relief of the Moon’s edge, which changes the length by a few seconds, is not taken into account.',
        'To plan a trip or an observation, always check the IGN’s official times: eclipses.ign.es.',
        'Maps: Natural Earth (public domain). Places: Natural Earth and town-centre coordinates for the provincial capitals that were missing.',
        'Simulator stars: HYG Database v4.1 (CC BY-SA 4.0), the same as Night sky.'],
   dl='Download the data (JSON)', langLink='/es/intereses/eclipses/'),
}

def ev(city, date):
    return next((x for x in D['local'][city] if x['t'][:10] == date), None)

def central_table(date, lang, cap, annular=False):
    t = T[lang]; rows = []
    items = [(n, ev(n, date)) for n in CITY]
    items = [(n, x) for n, x in items if x]
    items.sort(key=lambda p: (-(p[1]['tb'] is not None), -((dt(p[1]['te']) - dt(p[1]['tb'])).total_seconds() if p[1]['tb'] else p[1]['o'])))
    for n, x in items:
        tz = CITY[n]['tz']; d = (dt(x['te']) - dt(x['tb'])).total_seconds() if x['tb'] else 0
        rows.append(f'<tr{" class=ec-in" if d else ""}><th scope="row">{e(cn(n, lang))}</th><td>{e(KIND[lang][x["k"]])}</td><td data-v="{x["o"]}">{pct(x["o"], lang, x["k"] == "total")}</td>'
                    f'<td>{local(x["pb"], tz)}</td><td>{local(x["tb"], tz, True) if x["tb"] else "—"}</td><td data-v="{d}">{dur(d, lang) if d else "—"}</td>'
                    f'<td>{local(x["t"], tz)}</td><td>{local(x["pe"], tz)}</td><td data-v="{x["a"][1]}">{str(x["a"][1]).replace(".", "," if lang == "es" else ".")}°</td></tr>')
    head = [t['th_city'], t['th_kind'], t['th_pct'], t['th_start'], t['th_astart'] if annular else t['th_tstart'], t['th_dur'], t['th_max'], t['th_end'], t['th_alt']]
    return (f'<div class="cn-table-wrap" role="region" aria-label="{e(("Tabla: " if lang == "es" else "Table: ") + cap)}" tabindex="0"><table class="cn-table ec-table"><caption class="cn-vh">{e(cap)}</caption>'
            f'<thead><tr>{"".join(f"<th scope=col>{e(h)}</th>" for h in head)}</tr></thead><tbody>{"".join(rows)}</tbody></table></div><p class="cn-note">{e(t["hours"])}</p>')

def solar_next(lang):
    t = T[lang]; dates = sorted({x['t'][:10] for n in CITY for x in D['local'][n] if x['t'][:4] >= '2027'})
    rows = []
    for d in dates:
        evs = [(n, ev(n, d)) for n in CITY if ev(n, d)]
        best = max(evs, key=lambda p: ((p[1]['tb'] is not None), p[1]['o']))
        cells = []
        for c in ['Madrid', 'Barcelona', 'Sevilla', 'Las Palmas']:
            x = ev(c, d); cells.append(f'<td data-v="{x["o"] if x else -1}">{pct(x["o"], lang, x["k"] == "total") + " · " + local(x["t"], CITY[c]["tz"]) if x else "—"}</td>')
        kinds = {x['k'] for _, x in evs}
        kind = 'total' if 'total' in kinds else ('anular' if 'anular' in kinds else 'parcial')
        rows.append(f'<tr id="sol-{d}"><th scope="row" data-v="{d}">{e(fdate(d + "T12:00:00Z", lang))}</th><td>{e(KIND[lang][kind])}</td><td>{e(cn(best[0], lang))} · {pct(best[1]["o"], lang, best[1]["k"] == "total")}</td>{"".join(cells)}</tr>')
    head = [t['th_date'], t['th_type'] + (' (en España)' if lang == 'es' else ' (in Spain)'), t['th_where'], t['th_mad'], t['th_bcn'], t['th_sev'], t['th_lpa']]
    return (f'<h3>{e("Eclipses de Sol" if lang == "es" else "Solar eclipses")}</h3><div class="cn-table-wrap" role="region" aria-label="{e(("Tabla: " if lang == "es" else "Table: ") + t["capsol"])}" tabindex="0"><table class="cn-table ec-table" id="ec-sol"><caption class="cn-vh">{e(t["capsol"])}</caption>'
            f'<thead><tr>{"".join(f"<th scope=col>{e(h)}</th>" for h in head)}</tr></thead><tbody>{"".join(rows)}</tbody></table></div>')

def lunar_next(lang):
    t = T[lang]; rows = []
    for l in D['lunarES']:
        if l['t'][:4] < '2026' or (l['t'][:10] < '2026-09-24'): continue
        a = l['alt']['Madrid']; vis = a['max'] > 0 or any(v > 0 for v in a.values())
        if not vis: continue
        tot = f'{local(l["fases"]["U2"], "Europe/Madrid")}–{local(l["fases"]["U3"], "Europe/Madrid")}' if l['fases']['U2'] else '—'
        rows.append(f'<tr id="luna-{l["t"][:10]}"><th scope="row" data-v="{l["t"][:10]}">{e(fdate(l["t"], lang))}</th><td>{e(KIND[lang][l["k"]])}</td><td>{local(l["t"], "Europe/Madrid")}</td><td>{tot}</td>'
                    f'<td>{e(("Sí, entero" if lang == "es" else "Yes, all of it") if all(v > 0 for v in a.values()) else ("En parte" if lang == "es" else "Partly"))}</td></tr>')
    head = [t['th_date'], t['th_type'], t['th_lmax'], t['th_ltotal'], t['th_visible'] + ' (Madrid)']
    return (f'<h3>{e("Eclipses de Luna" if lang == "es" else "Lunar eclipses")}</h3><div class="cn-table-wrap" role="region" aria-label="{e(("Tabla: " if lang == "es" else "Table: ") + t["caplun"])}" tabindex="0"><table class="cn-table ec-table" id="ec-lun"><caption class="cn-vh">{e(t["caplun"])}</caption>'
            f'<thead><tr>{"".join(f"<th scope=col>{e(h)}</th>" for h in head)}</tr></thead><tbody>{"".join(rows)}</tbody></table></div>')

def catalogue(lang):
    t = T[lang]; rows = []
    for s in D['solar']:
        w = (f'{abs(s["lat"]):.0f}° {"N" if s["lat"] >= 0 else "S"}, {abs(s["lon"]):.0f}° {("E" if s["lon"] >= 0 else ("O" if lang == "es" else "W"))}' if s['lat'] is not None else '—')
        rows.append((s['t'], f'<tr data-kind="sol-{s["k"]}" data-y="{s["t"][:4]}"><th scope="row" data-v="{s["t"][:10]}">{e(s["t"][:10])}</th><td>{e("Sol" if lang == "es" else "Solar")}</td><td>{e(KIND[lang][s["k"]])}</td><td>{s["t"][11:16]}</td><td>{e(w)}</td></tr>'))
    for l in D['lunar']:
        rows.append((l['t'], f'<tr data-kind="luna-{l["k"]}" data-y="{l["t"][:4]}"><th scope="row" data-v="{l["t"][:10]}">{e(l["t"][:10])}</th><td>{e("Luna" if lang == "es" else "Lunar")}</td><td>{e(KIND[lang][l["k"]])}</td><td>{l["t"][11:16]}</td><td>{e(("Totalidad: " if lang == "es" else "Totality: ") + dur(l["dt"] * 120, lang)) if l["dt"] else "—"}</td></tr>'))
    rows.sort()
    head = [t['th_date'], 'Sol / Luna' if lang == 'es' else 'Sun / Moon', t['th_type'], t['th_utc'], ('Punto de máximo o duración de la totalidad' if lang == 'es' else 'Point of greatest eclipse or length of totality')]
    return (f'<div id="ec-cat-tools"></div><div class="cn-table-wrap" role="region" aria-label="{e(("Tabla: " if lang == "es" else "Table: ") + t["capcat"])}" tabindex="0"><table class="cn-table ec-table" id="ec-cat"><caption class="cn-vh">{e(t["capcat"])}</caption>'
            f'<thead><tr>{"".join(f"<th scope=col>{e(h)}</th>" for h in head)}</tr></thead><tbody>{"".join(r for _, r in rows)}</tbody></table></div>')

def how_svg(k, lang='es'):
    if k == 0:   # eclipse de Sol: Sol, Luna y sombra sobre la Tierra
        return ('<svg class="ec-how-svg" viewBox="0 0 360 140" aria-hidden="true"><defs><radialGradient id="hs0"><stop offset="0" stop-color="#fff5d6"/><stop offset="1" stop-color="#f2a93b"/></radialGradient></defs>'
                '<circle cx="40" cy="70" r="34" fill="url(#hs0)"/><path d="M60 42 L312 64 L312 76 L60 98 Z" fill="#f2c46d" opacity=".12"/><path d="M200 62 L306 69 L306 71 L200 78Z" fill="#050b18" opacity=".9"/>'
                '<circle cx="200" cy="70" r="8" fill="#b9c3d3"/><circle cx="318" cy="70" r="26" fill="#3f7bd6"/><circle cx="296" cy="70" r="3" fill="#050b18"/></svg>')
    if k == 2:   # eclipse de Luna
        return ('<svg class="ec-how-svg" viewBox="0 0 360 140" aria-hidden="true"><defs><radialGradient id="hs2"><stop offset="0" stop-color="#fff5d6"/><stop offset="1" stop-color="#f2a93b"/></radialGradient></defs>'
                '<circle cx="40" cy="70" r="34" fill="url(#hs2)"/><circle cx="190" cy="70" r="26" fill="#3f7bd6"/><path d="M190 44 L340 58 L340 82 L190 96 Z" fill="#050b18" opacity=".55"/>'
                '<circle cx="318" cy="70" r="9" fill="#b3452c"/></svg>')
    if k == 1:   # total y anular
        return ('<svg class="ec-how-svg" viewBox="0 0 360 140" aria-hidden="true"><defs><radialGradient id="hsc"><stop offset=".63" stop-color="#fff" stop-opacity=".95"/><stop offset=".7" stop-color="#e8eefc" stop-opacity=".55"/><stop offset="1" stop-color="#e8eefc" stop-opacity="0"/></radialGradient></defs><circle cx="95" cy="70" r="58" fill="url(#hsc)"/><circle cx="95" cy="70" r="40" fill="#fff"/><circle cx="95" cy="70" r="41" fill="#050b18"/>'
                '<circle cx="265" cy="70" r="40" fill="#ffcf73"/><circle cx="265" cy="70" r="36" fill="#050b18"/><text x="95" y="132" class="ec-svg-t">total</text><text x="265" y="132" class="ec-svg-t">'+('anular' if lang == 'es' else 'annular')+'</text></svg>')
    return ''

def main_html(lang):
    t = T[lang]
    for c in D['ciudades']: c['label'] = cn(c['n'], lang)
    sol_es = sorted({x['t'][:10] for n in CITY for x in D['local'][n] if '2026-09-24' <= x['t'][:10] <= '2040-12-31'})
    lun_es = [l for l in D['lunarES'] if '2026-09-24' <= l['t'][:10] and any(v > 0 for v in l['alt']['Madrid'].values())]
    m27, _ = maps.eclipse_map('27' + lang, D['rejillas']['2027-08-02'], D['ciudades'], lang, 'total', t['cap27'])
    m28, _ = maps.eclipse_map('28' + lang, D['rejillas']['2028-01-26'], D['ciudades'], lang, 'anular', t['cap28'])
    m26, meta = maps.eclipse_map('26' + lang, D['rejillas']['2026-08-12'], D['ciudades'], lang, 'total', t['cap26'])
    nav = ''.join(f'<a class="filter" href="#{k}">{e(t[v])}</a>' for k, v in [('e2027', 's_27'), ('e2028', 's_28'), ('e2026', 's_26'), ('proximos', 's_next'), ('seguridad', 's_safe'), ('como', 's_how'), ('catalogo', 's_cat'), ('mi-coleccion', 's_mine'), ('fuentes', 's_src')])
    how = ''.join(f'<article class="ec-how"><div class="ec-how-fig">{how_svg(i, lang)}</div><h3>{e(a)}</h3><p>{e(b)}</p></article>' for i, (a, b) in enumerate(t['how']))
    return f'''<main id="main" class="igx cn ss ec" data-lang="{lang}">
<section class="cn-stage ss-stage ec-stage" id="simulador" aria-labelledby="cn-title">
<div class="cn-stage-title"><p class="crumb"><a href="{t['crumbHref']}">{e(t['crumb'])}</a></p><h1 id="cn-title">{e(t['title'])}</h1><p class="cn-stage-lede">{e(t['stage_lede'])}</p></div>
<div class="cn-stage-sky ss-view" id="ec-view"><p class="cn-stage-nojs">{e(t['nojs_stage'])}</p></div>
<div class="cn-stage-ui" id="ec-ui"></div>
</section>
<section class="cn-now glass" aria-labelledby="cn-h-now"><h2 id="cn-h-now">{e(t['s_now'])}</h2><div id="ec-now"><p class="cn-note">{e(t['now_nojs'])}</p></div>
<div class="counts"><span class="pill">{len(sol_es)} {e(t['p1'])}</span><span class="pill">{len(lun_es)} {e(t['p2'])}</span><span class="pill">{len(D['solar']) + len(D['lunar'])} {e(t['p3'])}</span><span class="pill">{len(D['ciudades'])} {e(t['p4'])}</span></div></section>
<nav class="finder glass cn-onpage" aria-label="{e(t['onpage'])}"><div class="filters">{nav}</div></nav>
<section id="e2027" class="cn-sec glass" aria-labelledby="ec-h-27"><h2 id="ec-h-27">{e(t['s_27'])}</h2><p class="cn-intro">{e(t['i27'])}</p>
<figure class="ec-mapfig" data-map="2027-08-02"><div class="ec-mapwrap" role="region" tabindex="0" aria-label="{e(("Mapa: " if lang == "es" else "Map: ") + t['cap27'])}">{m27}</div><figcaption class="cn-note">{e(t['map_note'])}</figcaption></figure>{central_table('2027-08-02', lang, t['cap27'])}</section>
<section id="e2028" class="cn-sec glass" aria-labelledby="ec-h-28"><h2 id="ec-h-28">{e(t['s_28'])}</h2><p class="cn-intro">{e(t['i28'])}</p>
<figure class="ec-mapfig" data-map="2028-01-26"><div class="ec-mapwrap" role="region" tabindex="0" aria-label="{e(("Mapa: " if lang == "es" else "Map: ") + t['cap28'])}">{m28}</div><figcaption class="cn-note">{e(t['map_note_a'])}</figcaption></figure>{central_table('2028-01-26', lang, t['cap28'], True)}</section>
<section id="e2026" class="cn-sec glass" aria-labelledby="ec-h-26"><h2 id="ec-h-26">{e(t['s_26'])}</h2><p class="cn-intro">{e(t['i26'])}</p>
<figure class="ec-mapfig" data-map="2026-08-12"><div class="ec-mapwrap" role="region" tabindex="0" aria-label="{e(("Mapa: " if lang == "es" else "Map: ") + t['cap26'])}">{m26}</div><figcaption class="cn-note">{e(t['map_note'])}</figcaption></figure>{central_table('2026-08-12', lang, t['cap26'])}</section>
<section id="proximos" class="cn-sec glass" aria-labelledby="ec-h-next"><h2 id="ec-h-next">{e(t['s_next'])}</h2>{solar_next(lang)}{lunar_next(lang)}</section>
<section id="seguridad" class="cn-sec glass ec-safe" aria-labelledby="ec-h-safe"><h2 id="ec-h-safe">{e(t['s_safe'])}</h2><p class="cn-intro"><strong>{e(t['safe_intro'])}</strong></p><ul class="ss-list">{"".join(f"<li>{e(x)}</li>" for x in t['safe'])}</ul></section>
<section id="como" class="cn-sec glass" aria-labelledby="ec-h-how"><h2 id="ec-h-how">{e(t['s_how'])}</h2><p class="cn-intro">{e(t['how_intro'])}</p><div class="ec-hows">{how}</div></section>
<section id="catalogo" class="cn-sec glass" aria-labelledby="ec-h-cat"><h2 id="ec-h-cat">{e(t['s_cat'])}</h2>{catalogue(lang)}</section>
<section id="mi-coleccion" class="cn-sec glass" aria-labelledby="ec-h-mine"><h2 id="ec-h-mine">{e(t['s_mine'])}</h2><p class="cn-intro">{e(t['mine_intro'])}</p><div id="ec-mine-app"><p class="vacio cn-nojs">{e(t['mine_nojs'])}</p></div></section>
<section id="fuentes" class="cn-sec glass" aria-labelledby="ec-h-src"><h2 id="ec-h-src">{e(t['s_src'])}</h2><ul class="cn-src">{"".join(f"<li>{e(x)}</li>" for x in t['src'])}</ul>
<p><a class="bajar" href="/es/intereses/eclipses/eclipses.json" download>{e(t['dl'])}</a></p></section>
<p id="cn-status" class="cn-status" role="status" aria-live="polite"></p>
</main>''', meta

def shell(lang, main):
    t = T[lang]
    src = (ROOT / ('es/intereses/sistema-solar/index.html' if lang == 'es' else 'en/interests/solar-system/index.html')).read_text(encoding='utf-8')
    head = src[:src.find('</head>')]
    head = re.sub(r'<title>.*?</title>', f'<title>{e(t["docTitle"])}</title>', head)
    for prop in ['name="description"', 'property="og:description"']:
        head = re.sub(rf'<meta {prop} content="[^"]*">', f'<meta {prop} content="{e(t["desc"])}">', head)
    head = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{e(t["title"])}">', head)
    es_u, en_u = 'https://irisgreen.eu/es/intereses/eclipses/', 'https://irisgreen.eu/en/interests/eclipses/'
    me = es_u if lang == 'es' else en_u
    head = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{me}">', head)
    head = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{me}">', head)
    head = re.sub(r'<link rel="alternate" hreflang="es" href="[^"]*">', f'<link rel="alternate" hreflang="es" href="{es_u}">', head)
    head = re.sub(r'<link rel="alternate" hreflang="en" href="[^"]*">', f'<link rel="alternate" hreflang="en" href="{en_u}">', head)
    head = re.sub(r'<link rel="alternate" hreflang="x-default" href="[^"]*">', f'<link rel="alternate" hreflang="x-default" href="{es_u}">', head)
    head += '<link rel="stylesheet" href="/assets/ig-eclipses.css">\n'
    b = src.find('<body'); m = src.find('<main', b)
    top = re.sub(r'<a class="lang" href="[^"]*" lang="(en|es)">', lambda mm: f'<a class="lang" href="{t["langLink"]}" lang="{mm.group(1)}">', src[b:m])
    f = src.find('<footer'); fe = src.find('</footer>') + 9
    tail = ('<div hidden id="rguide"></div><script src="/assets/lectura-accesible.js"></script>'
            '<script defer src="/assets/interfaz-comun.js"></script>\n<script defer src="/assets/musica.js"></script>\n'
            '<script defer src="/assets/astronomy-engine-2.1.19.min.js"></script>\n<script defer src="/assets/ig-eclipses.js"></script>\n</body></html>\n')
    return head + '</head>' + top + main + src[f:fe] + tail

if __name__ == '__main__':
    out = {'es': ROOT / 'es/intereses/eclipses', 'en': ROOT / 'en/interests/eclipses'}
    meta = None
    for lang in ('es', 'en'):
        out[lang].mkdir(parents=True, exist_ok=True)
        mh, meta = main_html(lang)
        (out[lang] / 'index.html').write_text(shell(lang, mh), encoding='utf-8')
    pub = {k: v for k, v in D.items() if k != 'rejillas'}
    pub['mapa'] = meta; pub['marca'] = 'IRIS GREEN · irisgreen.eu'
    pub['licencia'] = 'Cálculo propio de Iris Green con astronomy-engine (MIT). Lugares: Natural Earth (dominio público). CC BY 4.0.'
    (out['es'] / 'eclipses.json').write_text(json.dumps(pub, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('ok', {k: (v / 'index.html').stat().st_size for k, v in out.items()}, (out['es'] / 'eclipses.json').stat().st_size)
