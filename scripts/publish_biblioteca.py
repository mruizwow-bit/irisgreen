#!/usr/bin/env python3
"""Publica las 48 fichas ES de Vida diaria tras la revisión de fuentes del 10-09-2026.

No reescribe la colección. Aplica correcciones factuales puntuales, añade fuentes que faltaban
y retira el estado editorial de la salida: ni BORRADOR ni VALIDADA ni fecha de revisión. El estado
es control interno (vida-diaria.json) y no se publica. Falla si queda algún marcador.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LIB = ROOT / "es" / "biblioteca"


def load(path):
    return path.read_text(encoding="utf-8")


def save(path, text):
    path.write_text(text, encoding="utf-8")


def replace_once_or_done(text, old, new, label):
    if old in text:
        return text.replace(old, new)
    if new in text:
        return text
    raise AssertionError(f"No se encontró el texto esperado en {label}: {old[:90]!r}")


def page(slug):
    p = LIB / slug / "index.html"
    if not p.is_file():
        raise FileNotFoundError(p)
    return p


def edit(slug, pairs):
    p = page(slug)
    text = load(p)
    for old, new in pairs:
        text = replace_once_or_done(text, old, new, slug)
    save(p, text)


def add_source(slug, html_li):
    p = page(slug)
    text = load(p)
    href_m = re.search(r'href="([^"]+)"', html_li)
    if href_m and href_m.group(1) in text:
        return
    heading = '<section class="sec"><h2>Dónde está escrito</h2>'
    start = text.find(heading)
    if start < 0:
        raise AssertionError(f"Sin sección de fuentes: {slug}")
    end = text.find("</ul>", start)
    if end < 0:
        raise AssertionError(f"Sin cierre de lista de fuentes: {slug}")
    text = text[:end] + html_li + text[end:]
    save(p, text)

edit("viajar-en-avion-con-una-discapacidad-no-visible", [
    (
        "La asistencia Sin Barreras (PMR) es un servicio diferente, pensado para quienes necesitan asistencia durante el recorrido aeroportuario. Conviene solicitarla con antelación a través de la aerolínea o de Aena.",
        "La asistencia Sin Barreras (PMR) es un servicio diferente, pensado para quienes necesitan asistencia durante el recorrido aeroportuario. Es gratuita. Aena indica que debe solicitarse al menos 48 horas antes de la salida del vuelo para garantizar la calidad del servicio."
    ),
])
add_source("viajar-en-avion-con-una-discapacidad-no-visible", '<li><a href="https://www.aena.es/es/pasajeros/viajeros/personas-con-necesidades-especiales/servicio-asistencia-sin-barreras.html" rel="noopener" target="_blank">Aena · Servicio de asistencia Sin Barreras</a></li>')

edit("la-beca-del-ministerio-para-apoyo-educativo-neae", [
    ("El plazo está abierto del 19 de mayo de 2026 a las 08:00 al 10 de septiembre de 2026 a las 15:00.", "El plazo de la convocatoria 2026-2027 es del 19 de mayo de 2026 a las 08:00 al 10 de septiembre de 2026 a las 15:00."),
    ("El Real Decreto 179/2026 se enlaza en su texto original (doc.php) porque el BOE genera el consolidado solo cuando la norma ha sido modificada.", "El enlace del BOE lleva al texto oficial del Real Decreto 179/2026."),
])

add_source("estudiar-en-la-universidad-con-apoyos", '<li><a href="https://www.boe.es/buscar/act.php?id=BOE-A-2023-7500" rel="noopener" target="_blank">Ley Orgánica 2/2023 del Sistema Universitario · art. 37</a></li>')

edit("buscar-trabajo-siendo-neurodivergente", [
    ("Esta ficha reúne puertas de entrada y recuerda que revelar un diagnóstico en un proceso de selección no es una obligación general.", "Esta ficha reúne puertas de entrada. En una selección ordinaria no existe una obligación general de contar un diagnóstico; algunos puestos, procesos o programas sí pueden exigir documentación concreta sobre aptitud o discapacidad."),
])
add_source("buscar-trabajo-siendo-neurodivergente", '<li><a href="https://www.aepd.es/prensa-y-comunicacion/blog/en-que-momento-comienza-legalmente-un-tratamiento-de-datos-personales" rel="noopener" target="_blank">AEPD · solicitud y tratamiento de datos de salud</a></li>')

edit("perros-de-asistencia-que-reconoce-la-ley", [
    ('<section class="sec"><p>El Real Decreto 409/2025 establece un marco estatal sobre actividad y bienestar de los perros de asistencia y reconoce varias categorías, entre ellas los perros para personas autistas. El reconocimiento y acreditación concreta se coordina también con la normativa autonómica.</p></section>', '<section class="sec"><p>El Real Decreto 409/2025 establece un marco estatal sobre actividad y bienestar de los perros de asistencia y reconoce varias categorías, entre ellas los perros para personas autistas.</p><p>Como regla general estatal, la persona usuaria debe tener reconocido un grado de discapacidad igual o superior al 33 %. El propio real decreto permite que las comunidades autónomas y Ceuta y Melilla reconozcan otros supuestos, incluidos perros de aviso médico o perros para personas autistas. Por eso hay que comprobar también la normativa autonómica.</p></section>'),
])

edit("si-una-persona-vulnerable-desaparece-que-preparar-y-que-hacer", [
    ('<p class="source-note">El II Plan Estratégico en materia de Personas Desaparecidas está vigente de 2026 a 2029, con 5,1 millones de dotación, cinco líneas de acción, trece objetivos y 102 medidas.</p>', '<p class="source-note">El II Plan Estratégico en materia de Personas Desaparecidas está vigente de 2026 a 2029.</p>'),
])

add_source("dolor-salud-gastrointestinal-y-senales-corporales", '<li><a href="https://medlineplus.gov/spanish/ency/article/003120.htm" rel="noopener" target="_blank">MedlinePlus · dolor abdominal y signos de alarma</a></li>')
add_source("epilepsia-y-otras-crisis-recurrentes-que-preparar", '<li><a href="https://medlineplus.gov/spanish/ency/article/000694.htm" rel="noopener" target="_blank">MedlinePlus · epilepsia y cuándo pedir ayuda urgente</a></li>')

edit("menstruacion-menopausia-y-salud-sexual", [
    ("Los cambios hormonales pueden modificar dolor, sueño, temperatura, energía, estado de ánimo y tolerancia sensorial. No todo cambio debe atribuirse a neurodivergencia.", "Los cambios del ciclo menstrual, la perimenopausia y la menopausia pueden acompañarse de dolor, cambios de sueño, temperatura, energía y estado de ánimo. No todo cambio debe atribuirse a neurodivergencia."),
])
add_source("menstruacion-menopausia-y-salud-sexual", '<li><a href="https://www.nhs.uk/conditions/menopause-and-perimenopause/symptoms/" rel="noopener" target="_blank">NHS · síntomas de perimenopausia y menopausia</a></li>')

add_source("arfid-tca-y-pica-cuando-el-apoyo-cotidiano-necesita-atencion-clinica", '<li><a href="https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/eating-disorders/overview/" rel="noopener" target="_blank">NHS · trastornos alimentarios y ARFID</a></li>')
add_source("arfid-tca-y-pica-cuando-el-apoyo-cotidiano-necesita-atencion-clinica", '<li><a href="https://medlineplus.gov/spanish/ency/article/001538.htm" rel="noopener" target="_blank">MedlinePlus · pica</a></li>')

add_source("comunicacion-sin-habla-mutismo-apraxia-tartamudez-y-habla-dificil", '<li><a href="https://www.nhs.uk/mental-health/conditions/selective-mutism/" rel="noopener" target="_blank">NHS · mutismo selectivo</a></li>')

add_source("interocepcion-propiocepcion-y-sistema-vestibular-en-la-vida-diaria", '<li><a href="https://pubmed.ncbi.nlm.nih.gov/33378655/" rel="noopener" target="_blank">PubMed/NIH · revisión sobre interocepción</a></li>')
add_source("interocepcion-propiocepcion-y-sistema-vestibular-en-la-vida-diaria", '<li><a href="https://pubmed.ncbi.nlm.nih.gov/33954270/" rel="noopener" target="_blank">PubMed · propiocepción y sistema vestibular</a></li>')

add_source("la-comida-explicada-desde-los-sentidos", '<li><a href="https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/eating-disorders/overview/" rel="noopener" target="_blank">NHS · ARFID y trastornos alimentarios</a></li>')
add_source("herramientas-gratuitas-de-comunicacion-y-pictogramas", '<li><a href="https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/" rel="noopener" target="_blank">ASHA · comunicación aumentativa y alternativa</a></li>')
add_source("abuso-explotacion-y-relaciones-seguras", '<li><a href="https://www.boe.es/buscar/act.php?id=BOE-A-2013-12632" rel="noopener" target="_blank">Ley General de derechos de las personas con discapacidad</a></li>')

detail_pages = sorted(p for p in LIB.glob("*/index.html") if p.parent != LIB)
if len(detail_pages) != 48:
    raise AssertionError(f"Se esperaban 48 fichas ES; encontradas: {len(detail_pages)}")

for p in detail_pages:
    text = load(p)
    text = text.replace('<meta name="robots" content="noindex,follow"/>', '<meta name="robots" content="index,follow"/>')
    text = text.replace('<span class="chip lil">BORRADOR</span>', '')
    text = text.replace('<p class="notice">Página en borrador. Las fuentes están nombradas y enlazadas; la comprobación final sigue pendiente.</p>', '')
    text = re.sub(r'<li><strong>Estado:</strong>[^<]*</li>', '', text)
    text = re.sub(r'<li><strong>(?:Revisión|Validación):</strong>[^<]*</li>', '', text)
    save(p, text)

index_path = LIB / "index.html"
index = load(index_path)
for p in detail_pages:
    slug = p.parent.name
    text = load(p)
    source_start = text.find('<ul class="fuentes">')
    source_end = text.find("</ul>", source_start)
    if source_start < 0 or source_end < 0:
        raise AssertionError(f"Lista de fuentes ausente: {slug}")
    source_count = text[source_start:source_end].count("<li>")
    href = f'/es/biblioteca/{slug}/'
    card_start = index.find(f'href="{href}"')
    if card_start < 0:
        raise AssertionError(f"Tarjeta no encontrada: {slug}")
    meta_start = index.find('<span class="meta">', card_start)
    meta_end = index.find("</span>", meta_start)
    if meta_start < 0 or meta_end < 0:
        raise AssertionError(f"Meta de tarjeta no encontrada: {slug}")
    unit = "fuente" if source_count == 1 else "fuentes"
    new_meta = f'<span class="meta">{source_count} {unit}</span>'
    index = index[:meta_start] + new_meta + index[meta_end + len("</span>"):]
save(index_path, index)

for p in detail_pages + [index_path]:
    text = load(p)
    forbidden = ["BORRADOR", "REVISADA", "VALIDADA", "Página en borrador", "Estado:</strong>", "Revisión:</strong>", "Validación:</strong>", 'content="noindex,follow"']
    found = [x for x in forbidden if x in text]
    if found:
        raise AssertionError(f"Marcadores de borrador restantes en {p.relative_to(ROOT)}: {found}")

print(f"Biblioteca ES publicada: {len(detail_pages)} fichas; sin estados editoriales en la salida.")
