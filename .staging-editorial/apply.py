#!/usr/bin/env python3
"""Targeted editorial update: changes only the two explicitly requested pages."""
from pathlib import Path
import hashlib, json, re, subprocess, sys
ROOT = Path.cwd()
INPUT = Path(__file__).resolve().parent
ABOUT = ROOT/'es/sobre-iris-green/index.html'
METHOD = ROOT/'es/metodologia/index.html'
def git_sha(raw): return hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
def replace_once(s, old, new):
    if s.count(old) != 1: raise ValueError(f'Expected unique anchor: {old[:100]!r}')
    return s.replace(old, new, 1)
assert git_sha(ABOUT.read_bytes()) == '555ddb3383e99c6684aadfb2328cd6b5b9fd13f9', 'About source changed: reconcile first'
assert git_sha(METHOD.read_bytes()) == '45053db8974ffd1efe458983ea4cb272451df55c', 'Methodology source changed: reconcile first'
about = ABOUT.read_text()
match = re.search(r'const STR = (\{.*?\});\s*\nclass Component extends DCLogic', about, re.S)
assert match
result = subprocess.run(['node','-e',"const vm=require('node:vm'),fs=require('node:fs');const o=vm.runInNewContext('('+fs.readFileSync(0,'utf8')+')',Object.create(null),{timeout:1000});process.stdout.write(JSON.stringify(o));"], input=match[1], text=True, capture_output=True, check=True)
strings=json.loads(result.stdout)
updates=json.loads((INPUT/'content.json').read_text())
for lang, updated in updates.items():
    old=strings[lang]
    old.update({k:v for k,v in updated.items() if k not in ('who','lede')})
    old['who']={person:updated['who'] for person in ('primera','tercera')}
    old['lede']={person:updated['lede'] for person in ('primera','tercera')}
    old['example']=''
about=about[:match.start(1)]+json.dumps(strings,ensure_ascii=False,indent=2)+about[match.end(1):]
new_main='''<main id="main" class="about-editorial" style="max-width: 1180px; margin: 0 auto; padding: 40px 28px 64px;">
    <p class="about-eyebrow">{{ tEyebrow }}</p>
    <h1>{{ tTitle }}</h1>
    <p class="about-lede">{{ tLede }}</p>
    <section class="about-block">
      <h2>{{ tWhoTitle }}</h2>
      <sc-for list="{{ whoParas }}" as="p" hint-placeholder-count="3"><p>{{ p.text }}</p></sc-for>
    </section>
    <section class="about-books">
      <h2>{{ tHowTitle }}</h2><p>{{ tHowNote }}</p>
      <div class="about-book-grid"><sc-for list="{{ method }}" as="m" hint-placeholder-count="2">
        <article class="about-book"><h3>{{ m.rule }}</h3><p>{{ m.example }}</p><a href="{{ m.href }}">{{ m.linkLabel }}</a></article>
      </sc-for></div>
    </section>
    <section id="criterios-editoriales" class="about-block about-principles" style="scroll-margin-top: 10rem;">
      <h2>{{ tWriteTitle }}</h2>
      <sc-for list="{{ writing }}" as="w" hint-placeholder-count="2"><p>{{ w.text }}</p></sc-for>
      <p><a href="/es/metodologia/">{{ tMethodLink }}</a></p>
    </section>
    <section class="about-block"><h2>{{ tCreditsTitle }}</h2><p>{{ tCredits }}</p></section>
    <section><h2>{{ tWhatTitle }}</h2><p>{{ tWhatNote }}</p>
      <div class="about-collections"><sc-for list="{{ collections }}" as="c" hint-placeholder-count="6">
        <a href="{{ c.href }}"><strong>{{ c.label }}</strong><span>{{ c.note }}</span></a>
      </sc-for></div>
      <p>{{ tClose }}</p><p><a href="mailto:informacion@irisgreen.eu">informacion@irisgreen.eu</a></p>
    </section>
  </main>'''
about,count=re.subn(r'<main\b[^>]*>.*?</main>',lambda m:new_main,about,count=1,flags=re.S)
assert count==1
css='''<style id="ig-about-editorial">
.about-editorial{font-size:18px;line-height:1.65;overflow-wrap:anywhere}
.about-editorial h1,.about-editorial h2,.about-editorial h3{font-family:'Newsreader',Georgia,serif;font-weight:400;line-height:1.2;color:#17395c}
.about-editorial h1{font-size:clamp(34px,4vw,50px);margin:0 0 14px}.about-editorial h2{font-size:clamp(25px,3vw,31px);margin:0 0 14px}.about-editorial h3{font-size:26px;margin:0 0 14px}
.about-editorial p{margin:0 0 16px}.about-editorial p:last-child{margin-bottom:0}.about-editorial .about-eyebrow{color:#5a49a8;font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin:0 0 12px}.about-editorial .about-lede{font-size:20px;max-width:48em;margin-bottom:30px;color:#435268}
.about-editorial section{margin-bottom:28px}.about-editorial .about-block{max-width:56em;padding:25px 28px;border:1px solid #c7cfe0;border-radius:20px;background:rgba(255,255,255,.8)}
.about-editorial .about-principles{background:rgba(90,73,168,.07);border-color:#bcb6d7}.about-book-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.about-editorial .about-book{padding:25px;border:1px solid #c7cfe0;border-radius:18px;background:rgba(255,255,255,.84)}.about-editorial .about-book:nth-child(2){background:rgba(240,179,206,.13)}
.about-collections{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:20px 0 28px}.about-collections a{display:block;padding:18px;border:1px solid #c7cfe0;border-radius:14px;background:rgba(255,255,255,.8);text-decoration:none!important}.about-collections strong{display:block;text-decoration:underline;text-underline-offset:3px;color:#17395c}.about-collections span{display:block;margin-top:7px;font-size:17px;color:#435268}.about-editorial a{overflow-wrap:anywhere;text-decoration:underline;text-underline-offset:3px}.about-editorial a:focus-visible{outline:3px solid #5a49a8;outline-offset:3px}
@media(max-width:700px){main.about-editorial{padding:28px 18px 44px!important}.about-editorial .about-block{padding:21px 19px}.about-book-grid,.about-collections{grid-template-columns:1fr}.about-editorial .about-book{padding:21px}.about-editorial .about-lede{font-size:19px}}
@media(forced-colors:active){.about-editorial .about-block,.about-editorial .about-book,.about-collections a{background:Canvas!important;color:CanvasText!important;border-color:CanvasText!important}.about-editorial h1,.about-editorial h2,.about-editorial h3,.about-editorial p,.about-collections span{color:CanvasText!important}.about-editorial a,.about-collections strong{color:LinkText!important}}
</style>'''
about=replace_once(about,'</head>',css+'\n</head>')
about=replace_once(about,'tWriteTitle: T.writeTitle, writing:', 'tMethodLink: T.methodLink, tWriteTitle: T.writeTitle, writing:')
about=replace_once(about,'const conEjemplos = this.props.mostrarEjemplos !== false;','const conEjemplos = true;')
about=re.sub(r'<title>.*?</title>','<title>'+updates['es']['docTitle']+'</title>',about,count=1)
about=re.sub(r'(<meta name="description" content=")[^"]*(">)',lambda m:m[1]+updates['es']['description']+m[2],about,count=1)
about=re.sub(r'(<meta property="og:title" content=")[^"]*(">)',lambda m:m[1]+updates['es']['docTitle']+m[2],about,count=1)
about=replace_once(about,'<meta property="og:locale" content="es_ES">','<meta property="og:locale" content="es_ES">\n<meta property="og:description" content="'+updates['es']['description']+'">')
start=about.index('  addSchema() {')
end=about.index('  componentDidUpdate()',start)
about=about[:start]+'''  addSchema() {
    try {
      const T = STR[this.state.lang] || STR.es;
      let s = document.getElementById("ig-schema");
      if (!s) { s = document.createElement("script"); s.id = "ig-schema"; s.type = "application/ld+json"; document.head.appendChild(s); }
      s.textContent = JSON.stringify({
        "@context": "https://schema.org", "@type": "AboutPage",
        name: T.title, description: T.description,
        url: "https://irisgreen.eu/es/sobre-iris-green/",
        inLanguage: { es: "es-ES", en: "en-GB", pt: "pt-BR" }[this.state.lang],
        datePublished: "2026-09-02", dateModified: "2026-09-09",
        author: { "@type": "Person", name: "Iris Green" },
        publisher: { "@type": "Organization", name: "Iris Green" }
      });
      const set = (selector, value) => { const el = document.querySelector(selector); if (el) el.setAttribute("content", value); };
      set('meta[name="description"]', T.description);
      set('meta[property="og:title"]', T.docTitle);
      set('meta[property="og:description"]', T.description);
      set('meta[property="og:locale"]', { es: "es_ES", en: "en_GB", pt: "pt_BR" }[this.state.lang]);
    } catch (e) {}
  }

'''+about[end:]
about=replace_once(about,'  componentDidUpdate() {','  componentDidUpdate() {\n    this.addSchema();')
for anchor in ('id="criterios-editoriales"','ig-route-editorial','window.IGPreferences','[["es", "ES"], ["en", "EN"]]'):
    assert anchor in about
assert 'no un equipo ni una máquina' not in about
ABOUT.write_text(about,encoding='utf-8')
method=METHOD.read_text()
main=(INPUT/'method-main.html').read_text().strip()
method,n=re.subn(r'<main\b[^>]*>.*?</main>',lambda m:main,method,count=1,flags=re.S);assert n==1
style='''<style id="ig-methodology-width">
/* Page-only width: preserve all other layouts and optional narrow reading settings. */
main#main.methodology-page{width:100%;max-width:70rem;padding:clamp(1.5rem,4vw,3rem) clamp(1.125rem,3vw,2rem) 4rem;font-size:1.125rem;line-height:1.7;text-align:left;overflow-wrap:anywhere}
.methodology-page h1{font-size:clamp(2.125rem,3.2vw,3rem);margin:.4rem 0 1rem}.methodology-page h2{font-size:1.6rem;line-height:1.3}.methodology-page h3{font-size:1.25rem;line-height:1.4}.methodology-page .lede{font-size:1.2rem;margin-bottom:1rem}.methodology-page .method-date,.methodology-page .method-reference{font-size:1rem;color:#435268}.methodology-page .sec{padding:1.4rem 0}.methodology-page a{overflow-wrap:anywhere}.methodology-page .method-date{margin-bottom:2rem}
html[data-ig-text-width="medium"] main#main.methodology-page{max-width:calc(65ch + 4rem)}
html[data-ig-text-width="narrow"] main#main.methodology-page{max-width:calc(48ch + 4rem)}
@media(max-width:700px){main#main.methodology-page{padding:1.5rem 1.125rem 3rem}.methodology-page h2{font-size:1.4rem}}
@media(forced-colors:active){.methodology-page .method-date,.methodology-page .method-reference{color:CanvasText!important}}
</style>'''
method=replace_once(method,'</head>',style+'\n</head>')
desc='Criterios editoriales de Iris Green: fuentes, límites de la información, experiencias, datos, ayudas, lenguaje claro, traducciones y revisión de contenidos.'
old_desc='Cinco reglas con ejemplos: cada afirmación con su documento y su año, las fichas sin fuente lo dicen, las cifras van con su denominador y los grados separan qué existe de qué ayuda.'
assert method.count(old_desc)==3
method=method.replace(old_desc,desc)
method=replace_once(method,'<title>Metodología · Cómo se comprueba lo que hay aquí</title>','<title>Metodología · Criterios editoriales · Iris Green</title>')
method=replace_once(method,'"@type":"WebPage","name":"Metodología",','"@type":"WebPage","name":"Metodología","dateModified":"2026-09-09",')
METHOD.write_text(method,encoding='utf-8')
print(json.dumps({'changed':[str(p.relative_to(ROOT)) for p in (ABOUT,METHOD)],'sha256':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (ABOUT,METHOD)}},indent=2))
