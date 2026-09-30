#!/usr/bin/env python3
"""A2 · Home v4 canonical donor structure + real runtimes, ES/EN."""
from __future__ import annotations
import argparse, html
from pathlib import Path
SOURCE=Path(__file__).resolve().parents[1]

AGE_ICONS={
'AGE_0_12':'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="13" r="7"></circle><path d="M9.5 15.2c1.4 1.2 3.6 1.2 5 0M10 5.6c.4-1.6 2.6-2 3.4-.6"></path><circle cx="9.6" cy="12" r=".6" fill="currentColor"></circle><circle cx="14.4" cy="12" r=".6" fill="currentColor"></circle></svg>',
'AGE_13_17':'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="3.6"></circle><path d="M5 20c.8-3.8 3.6-5.6 7-5.6s6.2 1.8 7 5.6"></path></svg>',
'AGE_18_PLUS':'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="8" r="3.2"></circle><path d="M3 20c.7-3.4 3-5 6-5s5.3 1.6 6 5"></path><path d="M15.5 5.2a3 3 0 0 1 0 5.6M17.5 15.2c1.8.6 3 2.2 3.5 4.8"></path></svg>',
'ALL_AGES':'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 12c-2-2.6-3.6-4-5.6-4a4 4 0 0 0 0 8c2 0 3.6-1.4 5.6-4s3.6-4 5.6-4a4 4 0 0 1 0 8c-2 0-3.6-1.4-5.6-4z"></path></svg>'}

def media():
    return '<span class="ig-home-v4-media" data-ig-media-status="pending" aria-hidden="true"></span>'

def card(url,title,copy,cta=None,use=False):
    cls='ig-home-v4-card ig-home-v4-use-card' if use else 'ig-home-v4-card'
    cta_html=f'<span class="ig-home-v4-card-cta">{html.escape(cta)}</span>' if cta else ''
    return f'<a class="{cls}" href="{url}">{media()}<span><strong>{html.escape(title)}</strong><span class="ig-home-v4-card-copy">{html.escape(copy)}</span>{cta_html}</span></a>'

def age_picker(en):
    labels={'AGE_0_12':'Ages 0–12','AGE_13_17':'Ages 13–17','AGE_18_PLUS':'Ages 18+','ALL_AGES':'All ages'} if en else {'AGE_0_12':'0–12 años','AGE_13_17':'13–17 años','AGE_18_PLUS':'18 años o más','ALL_AGES':'Todas las edades'}
    buttons=''.join(f'<button type="button" data-ig-audience-stage="{k}" aria-pressed="false">{AGE_ICONS[k]}<span>{html.escape(v)}</span></button>' for k,v in labels.items())
    title='Content by age' if en else 'Contenido por edad'
    note='Choose an age range to adjust the content. If you do not choose one, you will see the general version.' if en else 'Elige una edad para ajustar el contenido. Si no eliges ninguna, verás la versión general.'
    safe='Child-safe protection: on by default.' if en else 'Protección infantil: activa por defecto.'
    adult='Adult view: explicitly selected.' if en else 'Vista adulta: seleccionada expresamente.'
    return f'<div class="ig-audience ig-home-v4-age" data-ig-audience-picker><p class="ig-home-v4-age-title">{title}</p><div class="ig-audience-options">{buttons}</div><p class="ig-home-v4-age-copy">{note}</p><p class="ig-home-v4-age-state" role="status" aria-live="polite"><strong>{"View" if en else "Vista"}:</strong> <span data-ig-audience-status>General</span></p><p class="ig-home-v4-safety-state"><span data-ig-home-safe>{safe}</span><span data-ig-home-adult>{adult}</span></p></div>'


def sabik_home(en):
    t={
      'title':'Ask Sabik' if en else 'Pregunta a Sabik',
      'subtitle':'Iris Green assistant' if en else 'Asistente de Iris Green',
      'unavailable':'Source search is not available yet.' if en else 'La búsqueda en fuentes todavía no está disponible.',
      'available':'Source search is available.' if en else 'La búsqueda en fuentes está disponible.',
      'capability':"I can search Iris Green's sources for information. I don't make diagnoses." if en else 'Puedo buscar información en las fuentes de Iris Green. No hago diagnósticos.',
      'memory':'No history is saved between sessions.' if en else 'No se guarda el historial entre sesiones.',
      'limits':'Check important information against the sources.' if en else 'Comprueba la información importante en las fuentes.',
      'label':'What do you need?' if en else '¿Qué necesitas?',
      'hide':'Hide' if en else 'Ocultar',
      'help':'Up to 300 characters. Enter adds a new line; Ctrl+Enter sends.' if en else 'Hasta 300 caracteres. Enter añade una línea; Ctrl+Enter envía.',
      'send':'Send' if en else 'Enviar',
      'settings':'Sabik settings' if en else 'Ajustes de Sabik',
      'cancel':'Cancel query' if en else 'Cancelar consulta',
      'voice':'Sabik voice' if en else 'Voz de Sabik',
      'voice_off':'Off' if en else 'Desactivada',
      'voice_help':'Only plays fixed messages when you turn it on.' if en else 'La voz solo reproduce mensajes fijos cuando la activas.',
      'low':'Turn off motion' if en else 'Desactivar movimiento',
      'reset':'Start again' if en else 'Empezar de nuevo',
      'motion':'Sabik motion' if en else 'Movimiento de Sabik',
      'normal':'Normal',
      'reduced':'Reduced' if en else 'Reducido',
      'still':'No motion' if en else 'Sin movimiento',
      'motion_help':'Gentle continuous motion.' if en else 'Movimiento suave y continuo.',
      'browse':'Explore resources' if en else 'Explorar los recursos',
      'placeholder':'For example: noise drains me' if en else 'Por ejemplo: el ruido me agota',
    }
    return f'''<aside class="sabik-panel ig-home-v4-sabik-panel" aria-labelledby="sabik-widget-title" data-connected="false">
<section class="sabik-widget">
<div id="sabik-announcement" class="sabik-sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
<div class="ig-home-v4-sabik-left">
  <h2 id="sabik-widget-title">{t['title']}</h2>
  <div class="ig-home-v4-sabik-identity-row">
    <div class="sabik-web-presentation"><div class="sabik-hologram sabik-web-visual" id="sabik-hologram" aria-hidden="true" data-web-state="PRESENTE"><img id="sabik-web-master" src="/sabik/assets/web-r01/web_presente.png" width="150" height="150" alt=""></div></div>
    <div class="sabik-identity">
      <img class="sabik-wordmark" src="/sabik/assets/web-r01/SABIK_WORDMARK_T1_MASTER_R2.svg" width="198" height="38" alt="Sabik">
      <p data-sabik-text="subtitle">{t['subtitle']}</p>
    </div>
  </div>
</div>
<div class="ig-home-v4-sabik-right">
  <div class="ig-home-v4-sabik-form-head"><label for="sabik-input" data-sabik-text="label">{t['label']}</label><button type="button" class="sabik-icon-button" id="sabik-toggle" aria-controls="sabik-widget-body" aria-expanded="true" data-sabik-text="hide">{t['hide']}</button></div>
  <div class="sabik-widget-body" id="sabik-widget-body">
    <form class="sabik-widget-form" id="sabik-form"><textarea id="sabik-input" name="need" maxlength="300" rows="3" autocomplete="off" placeholder="{t['placeholder']}"></textarea><div class="sabik-actions"><button class="sabik-button primary" id="sabik-submit" type="submit" disabled data-sabik-text="send">{t['send']}</button><button class="sabik-button" id="sabik-cancel" type="button" hidden data-sabik-text="cancel">{t['cancel']}</button></div></form>
    <div id="sabik-results"></div>
      <div class="ig-home-v4-sabik-controls">
        <div class="sabik-voice-control"><button class="sabik-button sabik-voice-toggle" id="sabik-voice" type="button" aria-pressed="false"><span data-sabik-text="voice">{t['voice']}</span>: <span id="sabik-voice-state" data-sabik-text="voiceOff">{t['voice_off']}</span></button></div>
        <div class="sabik-actions sabik-reset-actions"><button class="sabik-button" id="sabik-reset" type="button" data-sabik-text="reset">{t['reset']}</button></div>
        <div class="sabik-motion-control"><label for="sabik-motion-level" data-sabik-text="motion">{t['motion']}</label><select id="sabik-motion-level"><option value="NORMAL" data-sabik-text="normal">{t['normal']}</option><option value="REDUCIDO" data-sabik-text="reduced">{t['reduced']}</option><option value="SIN_MOVIMIENTO" data-sabik-text="still">{t['still']}</option></select></div>
      </div>
  </div>
</div>
</section></aside>'''

def render(root,lang):
    en=lang=='en';prefix='/en/' if en else '/'
    title='Iris Green · Clear information and practical tools' if en else 'Iris Green · Información clara y herramientas prácticas'
    meta='Clear information, practical resources and tools for everyday situations.' if en else 'Información clara, recursos prácticos y herramientas para situaciones del día a día.'
    h1='Find what you need' if en else 'Encuentra lo que necesitas'
    search_title='What are you looking for?' if en else '¿Qué estás buscando?'
    ph='For example: noise, sleep, transport or studying' if en else 'Por ejemplo: ruido, dormir, transporte o estudiar'
    search='Search' if en else 'Buscar'
    use_title='Open and use' if en else 'Entra y úsalo'
    discover_title='Understand and find' if en else 'Entiende y encuentra'
    sabik_title='Ask Sabik' if en else 'Pregunta a Sabik'
    access='Accessibility' if en else 'Accesibilidad';music='Music' if en else 'Música';close='Close' if en else 'Cerrar'
    panel='Accessibility and reading' if en else 'Accesibilidad y lectura'
    theme_title='Theme' if en else 'Tema';dark='Dark navy' if en else 'Navy oscuro';light='Light' if en else 'Claro'
    skip='Skip to content' if en else 'Ir al contenido'

    use_cards=[
      card('/en/resources/games/' if en else '/es/recursos/juegos/','Games' if en else 'Juegos','Think, observe and try ideas.' if en else 'Para pensar, observar y probar ideas.','View games →' if en else 'Ver juegos →',True),
      card('/en/workshop/' if en else '/es/taller/','The workshop' if en else 'El taller','Draw, build and create your projects.' if en else 'Dibuja, construye y crea tus proyectos.','Go to the workshop →' if en else 'Ir al taller →',True),
      card('/en/resources/visual-routines/' if en else '/es/recursos/rutinas-visuales/','Visual routines' if en else 'Rutinas visuales','Organise the day step by step with visual supports.' if en else 'Ordena el día paso a paso con apoyos visuales.','Create a routine →' if en else 'Crear una rutina →',True),
      card('/en/quiet-space/' if en else '/es/sitio-tranquilo/','Quiet space' if en else 'Rincón tranquilo','Breathe, look at landscapes or rest for a while.' if en else 'Respira, mira paisajes o descansa un rato.','Enter the quiet space →' if en else 'Entrar al rincón →',True),
    ]
    lower=[
      ('/en/neurodiversity/conditions/' if en else '/es/neurodiversidad/condiciones/','Conditions' if en else 'Condiciones','Clear explanations about different conditions.' if en else 'Explicaciones claras sobre diferentes condiciones.'),
      ('/en/situations/' if en else '/es/situaciones/','Situations' if en else 'Situaciones','Start from a specific everyday situation.' if en else 'Qué hacer a partir de una situación concreta.'),
      ('/en/everyday-life/' if en else '/es/biblioteca/','Everyday life' if en else 'Vida diaria','Support for studying, working, organising and looking after yourself.' if en else 'Apoyos para estudiar, trabajar, organizarte y cuidarte.'),
      ('/en/interests/' if en else '/es/intereses/','Your interests' if en else 'Tus intereses','Explore a topic and go deeper at your own pace.' if en else 'Explora un tema y profundiza a tu ritmo.'),
      ('/en/resources/printable-routines/' if en else '/es/recursos/rutinas-imprimibles/','Printable routines' if en else 'Rutinas imprimibles','Routines ready to download and print.' if en else 'Rutinas listas para descargar e imprimir.'),
      ('/es/investigacion/?lang=en' if en else '/es/investigacion/','Research' if en else 'Investigación','Studies explained with their results and limitations.' if en else 'Estudios explicados con sus resultados y límites.'),
      ('/en/data/' if en else '/es/datos/','Data' if en else 'Datos','Figures with their source, population and date.' if en else 'Cifras con su fuente, población y fecha.'),
      ('/es/tramites/directorio/?lang=en' if en else '/es/tramites/directorio/','Support and procedures' if en else 'Ayudas y trámites','Support, rights and procedures based on where you live.' if en else 'Apoyos, derechos y trámites según dónde vives.'),
      ('/es/libros/?lang=en' if en else '/es/libros/','Iris Green books' if en else 'Libros de Iris Green','Books to read on the web, at your own pace.' if en else 'Libros para leer en la web, a tu ritmo.'),
    ]
    age=age_picker(en);sabik=sabik_home(en)
    page=f'''<!doctype html><html lang="{lang}"><head><script src="/assets/ig-r49-lang-bootstrap.js"></script><script src="/assets/preferencias-lectura.js"></script><script src="/assets/ig-theme.js"></script><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><meta name="description" content="{html.escape(meta)}"><meta property="og:description" content="{html.escape(meta)}"><link rel="canonical" href="https://irisgreen.eu{prefix}"><link rel="alternate" hreflang="es" href="https://irisgreen.eu/"><link rel="alternate" hreflang="en" href="https://irisgreen.eu/en/"><link rel="alternate" hreflang="x-default" href="https://irisgreen.eu/"><link rel="stylesheet" href="/assets/ig-fonts.css"><link rel="stylesheet" href="/assets/ig-global-ui-tokens-2026.css"><link rel="stylesheet" href="/assets/ig-audience.css"><link rel="stylesheet" href="/sabik/iris-mount.css"><link rel="stylesheet" href="/assets/home-r42-child-safe.css"><link rel="stylesheet" href="/assets/ig-r49-transversal.css"><script src="/assets/ig-audience.js"></script><script defer src="/assets/buscador-comun.js"></script><script defer src="/assets/home-r42-child-safe.js"></script><script defer src="/assets/ig-r49-transversal.js"></script></head><body class="ig-home-r42 ig-home-v4" data-ig-r49="1" data-ig-profile="browse" data-ig-r49-owner="R69_HOME" data-ig-materials="r42" data-ig-r42-family="home" data-ig-home-version="v4"><a class="ig-home-skip" href="#main">{skip}</a><header class="ig-home-header"><a class="ig-home-brand" href="{prefix}">Iris Green</a><div class="ig-home-tools"><button type="button" data-ig-home-settings-open data-ig-reading-trigger aria-controls="ig-home-settings" aria-expanded="false">{access}</button><button type="button" data-ig-music aria-expanded="false">{music}</button><a class="ig-home-lang" href="{'/' if en else '/en/'}" lang="{'es' if en else 'en'}">{'ES' if en else 'EN'}</a></div></header><div class="ig-home-v4-wrap"><main id="main" class="ig-home-v4-main"><section class="ig-home-v4-hero" aria-labelledby="ig-home-v4-title"><h1 id="ig-home-v4-title">{h1}</h1><form class="ig-home-v4-search" data-ig-home-search role="search"><label for="ig-home-q">{search_title}</label><div class="ig-home-v4-search-row"><input id="ig-home-q" type="search" autocomplete="off" placeholder="{html.escape(ph)}"><button type="submit">{search}</button></div><div class="ig-home-suggestions" data-ig-home-suggestions></div><p class="ig-home-search-status" data-ig-home-search-status role="status" aria-live="polite"></p><div class="ig-home-results" data-ig-home-results></div></form>{age}</section><section class="ig-home-v4-section" aria-labelledby="ig-home-use"><h2 id="ig-home-use">{use_title}</h2><div class="ig-home-v4-use-grid"><div class="ig-home-v4-use-pair">{use_cards[0]}{use_cards[1]}</div><div class="ig-home-v4-use-pair">{use_cards[2]}{use_cards[3]}</div></div></section><section class="ig-home-v4-sabik" aria-label="{sabik_title}">{sabik}</section><section class="ig-home-v4-section" aria-labelledby="ig-home-discover"><h2 id="ig-home-discover">{discover_title}</h2><div class="ig-home-v4-discover-grid">{''.join(card(u,t,d) for u,t,d in lower)}</div></section></main></div><footer class="ig-home-v4-footer"><span>Iris Green</span><nav><a href="{'/en/privacy/' if en else '/es/privacidad/'}">{'Privacy' if en else 'Privacidad'}</a><a href="/es/lectura-accesible/?lang={'en' if en else 'es'}">{'Accessibility and reading' if en else 'Accesibilidad y lectura'}</a><a href="/es/sobre-iris-green/?lang={'en' if en else 'es'}">{'About Iris Green' if en else 'Sobre Iris Green'}</a></nav></footer><dialog id="ig-home-settings" data-ig-reading-panel aria-labelledby="ig-home-settings-title"><div class="ig-home-settings-head"><h2 id="ig-home-settings-title">{panel}</h2><button type="button" data-ig-home-settings-close data-ig-reading-close aria-label="{close}">×</button></div><div class="ig-home-a11y-controls"><div class="ig-home-theme"><p>{theme_title}</p><div class="ig-home-theme-options"><button type="button" data-ig-theme-choice="dark" aria-pressed="true">{dark}</button><button type="button" data-ig-theme-choice="light" aria-pressed="false">{light}</button></div></div><div class="ig-home-a11y-size"><span>{'Text size' if en else 'Tamaño del texto'}</span><button type="button" data-ig-home-pref="size-down">A−</button><output data-ig-home-pref-size aria-live="polite">100%</output><button type="button" data-ig-home-pref="size-up">A+</button></div><div class="ig-home-a11y-grid"><button type="button" data-ig-home-pref="spacing" aria-pressed="false">{'More spacing' if en else 'Más espaciado'}</button><button type="button" data-ig-home-pref="controls" aria-pressed="false">{'Bigger controls' if en else 'Controles más grandes'}</button><button type="button" data-ig-home-pref="contrast" aria-pressed="false">{'More contrast' if en else 'Más contraste'}</button><button type="button" data-ig-home-pref="guide" aria-pressed="false">{'Reading guide' if en else 'Guía de lectura'}</button><button type="button" data-ig-home-pref="motion" aria-pressed="false">{'Reduce motion' if en else 'Reducir movimiento'}</button><button type="button" data-ig-home-pref="speak" aria-pressed="false">{'Read this page' if en else 'Leer esta página'}</button></div><div data-ig-home-text-options></div><div data-ig-home-transparency-options></div><div class="ig-home-a11y-foot"><button type="button" data-ig-home-pref="reset">{'Reset' if en else 'Restablecer'}</button><a href="/es/lectura-accesible/?lang={'en' if en else 'es'}">{'More accessibility options' if en else 'Más opciones de accesibilidad'}</a></div></div></dialog><script defer src="/assets/interfaz-comun.js"></script><script defer src="/assets/musica.js"></script><script src="/sabik/sabik-motion-r37.js"></script><script src="/sabik/sabik-web-r01.js"></script><script src="/sabik/retrieval-panel.js"></script><script type="module" src="/sabik/iris-mount.mjs"></script></body></html>'''
    out=root if not en else root/'en';out.mkdir(parents=True,exist_ok=True);(out/'index.html').write_text(page,encoding='utf-8')

def sitemap(root):
    for name in ('sitemap.xml','sitemap-1.xml'):
        p=root/name
        if p.is_file():
            s=p.read_text(encoding='utf-8')
            if '<loc>https://irisgreen.eu/en/</loc>' not in s:s=s.replace('</urlset>','  <url>\n    <loc>https://irisgreen.eu/en/</loc>\n  </url>\n</urlset>')
            p.write_text(s,encoding='utf-8')
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve();render(root,'es');render(root,'en');sitemap(root);print('Home v4 ES/EN written · DARK NAVY default')
if __name__=='__main__':main()
