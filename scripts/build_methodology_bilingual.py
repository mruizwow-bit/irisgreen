#!/usr/bin/env python3
from pathlib import Path

root = Path.cwd()
es_path = root / 'es/metodologia/index.html'
en_path = root / 'en/methodology/index.html'

es = es_path.read_text(encoding='utf-8')

# Only add the English alternate/control to the existing Spanish page. Do not rewrite its content.
if 'hreflang="en"' not in es:
    needle = '<link href="https://irisgreen.eu/es/metodologia/" hreflang="es" rel="alternate"/>\n<link href="https://irisgreen.eu/es/metodologia/" hreflang="x-default" rel="alternate"/>'
    repl = '<link href="https://irisgreen.eu/es/metodologia/" hreflang="es" rel="alternate"/>\n<link href="https://irisgreen.eu/en/methodology/" hreflang="en" rel="alternate"/>\n<link href="https://irisgreen.eu/es/metodologia/" hreflang="x-default" rel="alternate"/>'
    if needle not in es:
        raise SystemExit('No encuentro el bloque hreflang esperado en Metodología ES.')
    es = es.replace(needle, repl, 1)

if 'href="/en/methodology/"' not in es:
    needle = '<nav aria-label="Idioma" class="langs">\n<span aria-current="true" class="lang on">ES</span>\n</nav>'
    repl = '<nav aria-label="Idioma" class="langs">\n<span aria-current="true" class="lang on">ES</span>\n<a class="lang" href="/en/methodology/" lang="en">EN</a>\n</nav>'
    if needle not in es:
        raise SystemExit('No encuentro el selector de idioma esperado en Metodología ES.')
    es = es.replace(needle, repl, 1)

es_path.write_text(es, encoding='utf-8')

en_html = r'''<!DOCTYPE html>

<html lang="en">
<head><script src="/assets/preferencias-lectura.js"></script>
<meta charset="utf-8"/>
<meta content="width=device-width,initial-scale=1" name="viewport"/>
<title>Methodology · How the information here is checked</title>
<meta content="Five rules with examples: every claim has its document and year, entries without a source say so, figures include their denominator, and the editorial grades separate what exists from what helps." name="description"/>
<meta content="index,follow" name="robots"/>
<meta content="#f6f8fb" name="theme-color"/>
<link href="https://irisgreen.eu/en/methodology/" rel="canonical"/>
<link href="https://irisgreen.eu/es/metodologia/" hreflang="es" rel="alternate"/>
<link href="https://irisgreen.eu/en/methodology/" hreflang="en" rel="alternate"/>
<link href="https://irisgreen.eu/es/metodologia/" hreflang="x-default" rel="alternate"/>
<meta content="Iris Green" name="author"/>
<meta content="website" property="og:type"/>
<meta content="en_GB" property="og:locale"/>
<meta content="Iris Green" property="og:site_name"/>
<meta content="Methodology" property="og:title"/>
<meta content="Five rules with examples: every claim has its document and year, entries without a source say so, figures include their denominator, and the editorial grades separate what exists from what helps." property="og:description"/>
<meta content="https://irisgreen.eu/en/methodology/" property="og:url"/>
<meta content="https://irisgreen.eu/img/og-condiciones.png" property="og:image"/>
<meta content="1200" property="og:image:width"/>
<meta content="630" property="og:image:height"/>
<meta content="summary_large_image" name="twitter:card"/>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebPage","name":"Methodology","description":"Five rules with examples: every claim has its document and year, entries without a source say so, figures include their denominator, and the editorial grades separate what exists from what helps.","url":"https://irisgreen.eu/en/methodology/","inLanguage":"en","isPartOf":{"@type":"WebSite","name":"Iris Green","url":"https://irisgreen.eu/"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://irisgreen.eu/"},{"@type":"ListItem","position":2,"name":"Methodology","item":"https://irisgreen.eu/en/methodology/"}]}]}</script>
<link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&amp;display=swap" rel="stylesheet"/>
<link href="../../assets/site-v23.css" rel="stylesheet"/>
<link rel="stylesheet" href="/assets/ajustes-interfaz.css"/>
<link rel="stylesheet" href="/assets/controles-comunes.css"/>
<link rel="stylesheet" href="/assets/preferencias-lectura.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="hd">
<a class="brand" href="/"><img alt="" height="28" onerror="this.remove()" src="../../img/v40-brand-symbol.webp" width="28"/><span>Iris Green</span></a>
<button aria-controls="nav" aria-expanded="false" class="ico menu" id="mBtn"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"></path></svg><span>Menu</span></button>
<button type="button" class="ig-menu-button" aria-label="Open menu" aria-controls="ig-main-nav" aria-expanded="false">Menu</button><nav aria-label="Explore" class="nav" id="ig-main-nav"><a href="/">Home</a><a href="/en/neurodiversity/conditions/">Conditions</a><a href="/en/situations/">Situations</a><a href="/es/biblioteca/">Everyday life</a><a href="/es/videos/">Videos</a><a href="/es/investigacion/">Research</a><a href="/es/datos/">Data</a><a href="/es/tramites/directorio/">Support</a><a href="/es/libros/">Books</a><a href="/es/recursos/juegos/">Play</a><span aria-hidden="true" class="sep"></span><a class="calma ig-calma" href="/en/interests/">Your interests</a><a class="calma ig-calma" href="/es/taller/">The workshop</a><a class="calma ig-calma" href="/en/quiet-space/">Quiet space</a></nav>
<div class="tools">
<button aria-controls="a11y" aria-expanded="false" class="ico" id="a11yBtn" aria-label="Accessible reading"><svg aria-hidden="true" viewbox="0 0 24 24"><circle cx="12" cy="4.5" r="2"></circle><path d="M4 8.5h16M12 10.5v11M12 15h-4l-2 6M12 15h4l2 6"></path></svg><span>Reading</span></button>
<button aria-controls="pl" aria-expanded="false" class="ico" id="plBtn" aria-label="Music"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M9 18V6l11-2v12"></path><circle cx="6" cy="18" r="3"></circle><circle cx="17" cy="16" r="3"></circle></svg><span>Music</span></button>
</div>
<nav aria-label="Language" class="langs">
<a class="lang" href="/es/metodologia/" lang="es">ES</a>
<span aria-current="true" class="lang on">EN</span>
</nav>
</header>
<div class="panel" hidden="" id="pl"></div>
<div class="panel a11yp" hidden="" id="a11y">
<h2>Accessible reading</h2>
<div class="ctrls">
<div class="grp"><span>Text size</span><button aria-label="Text size −" data-a="fs-">A−</button><button aria-label="Text size +" data-a="fs+">A+</button></div>
<button data-a="ls">Wider letter spacing</button>
<button data-a="big">Bigger buttons</button>
<button data-a="hc">More contrast</button>
<button data-a="guide">Reading guide</button>
<button data-a="tts">Read aloud</button>
<button data-a="rm">Reduce motion</button>
<button class="reset" data-a="reset">Reset</button>
</div>
</div>
<main id="main">
<p class="crumb"><a href="/">Home</a></p>
<h1>Methodology</h1>
<p class="lede">How the information here is checked, rule by rule, with an example from the site for each one.</p>
<p class="notice">Iris Green is not a healthcare professional. What you find here is documentation: if a diagnosis or treatment is needed, that belongs in a consultation with a healthcare professional.</p>
<h2>How the information here is checked</h2>
<p>Five rules, each with an example you can open.</p>
<section class="sec"><h3>1 · Every claim has its document and year, plus what that document covers and what it does not cover</h3>
<p><strong>Example.</strong> NICE NG69, from 2017, covers anorexia, bulimia, binge-eating disorder and OSFED. It does not cover ARFID or pica, so those two entries do not cite it.</p>
<p><a href="/en/neurodiversity/conditions/">View the condition entries</a></p></section>
<section class="sec"><h3>2 · Entries without a source say so on their own page</h3>
<p><strong>Example.</strong> The dissociative amnesia entry says that evidence for treatment is scarce: no document is named because there is no such document to cite, not through oversight.</p>
<p><a href="/en/neurodiversity/conditions/dissociative-amnesia/">View an entry with this notice</a></p></section>
<section class="sec"><h3>3 · Figures include their denominator: who was asked, how many people and by which method</h3>
<p><strong>Example.</strong> The four autism figures in the Data collection do not measure the same thing, and each one gives its population and method in the same sentence.</p>
<p><a href="/es/datos/">View the Data pages (Spanish)</a></p></section>
<section class="sec"><h3>4 · The editorial certainty grades separate what exists from what helps</h3>
<p>They are two different questions and are answered separately. An entry can have the condition at grade A and the treatment at grade C.</p>
<ul><li><strong>Grade A.</strong> Supported by a clinical guideline or a systematic review, named and dated.</li><li><strong>Grade B.</strong> Supported by an institutional document or individual studies, with their limitations stated.</li><li><strong>Grade C.</strong> Reasonable practice, not a research finding. The entry says so in those words.</li></ul>
<p><a href="/en/neurodiversity/conditions/">View the grades in the entries</a></p></section>
<section class="sec"><h3>5 · The review date is visible, with a notice when a guideline is expected to be replaced or updated</h3>
<p><strong>Example.</strong> CG31 is current and is being updated. The entry says so and includes the date when it needs to be checked again.</p>
<p><a href="/es/investigacion/">View the review work (Spanish)</a></p></section>
<h2>How it is written</h2>
<ul><li>No one is singled out or labelled. Official names of a diagnosis or a procedure are kept because they are needed to request them, never as the definition of a person.</li>
<li>Derogatory terms are not used, even to rebut them: writing them already puts them in the reader's mind.</li>
<li>Advice is not disguised as evidence. When something is reasonable practice rather than a research finding, the entry says so.</li>
<li>Short sentences, one idea per sentence, and an accessible reading panel on every page.</li></ul>
<h2>What each thing is — and is not</h2>
<ul><li>An everyday situation is not a diagnosis. Every situation entry says so visibly.</li>
<li>A screening scale does not diagnose.</li>
<li>Correlation does not prove causation.</li>
<li>Lived experience is not a prevalence figure.</li></ul>
<h2>Who does what</h2>
<p>The books are written by Iris Green, from what happens in her home, and she adapts them to easy reading herself. Professional correction is by Natalia. The illustrations are by Mary. Translations are by Patricia, Wataru and Iris.</p>
<p>Each entry shows the date of its latest review and a link to this page. If a figure or a document does not add up, write to <a href="mailto:informacion@irisgreen.eu">informacion@irisgreen.eu</a>: it reaches the person who wrote it.</p>
<p><a href="/es/sobre-iris-green/">Who writes this (Spanish)</a></p>
</main>
<script defer="" src="../../assets/lectura-accesible.js"></script>

<script defer src="/assets/interfaz-comun.js"></script>
<script defer src="/assets/musica.js"></script>
</body>
</html>
'''

en_path.parent.mkdir(parents=True, exist_ok=True)
en_path.write_text(en_html, encoding='utf-8')

# Guardrails: translation must preserve the five numbered rules and the editorial grade system.
required_en = [
    '<h1>Methodology</h1>',
    '1 · Every claim has its document and year',
    '2 · Entries without a source',
    '3 · Figures include their denominator',
    '4 · The editorial certainty grades',
    '<strong>Grade A.</strong>', '<strong>Grade B.</strong>', '<strong>Grade C.</strong>',
    '5 · The review date is visible',
    '/en/neurodiversity/conditions/dissociative-amnesia/',
    'View the Data pages (Spanish)', 'View the review work (Spanish)',
    'Accessible reading', 'Wider letter spacing'
]
missing = [x for x in required_en if x not in en_html]
if missing:
    raise SystemExit('English Methodology is incomplete: ' + ', '.join(missing))

print('Metodología ES: control EN añadido sin reescribir el contenido.')
print('Methodology EN: traducción fiel creada con las cinco reglas y el sistema editorial A/B/C.')
