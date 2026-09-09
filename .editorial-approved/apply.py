#!/usr/bin/env python3
"""Integrate only the two approved editorial pages; preserve current site controls."""
import hashlib, html, json, re
from pathlib import Path

FILES = {'es/sobre-iris-green/index.html':'556ff2e8c81d0164fb6c4fb92af50e3dbc009d41', 'es/metodologia/index.html':'bf5c1116e8a46a71f91b7ec69061949efbf9e384'}
def blob_sha(data):
    return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
for name, expected in FILES.items():
    assert blob_sha(Path(name).read_bytes()) == expected, 'Source changed: '+name

ABOUT = {
'es': {
 'title':'Sobre Iris Green',
 'lead':'Información y recursos para comprender la neurodiversidad en la vida cotidiana.',
 'intro':'Iris Green es autora y creadora de este proyecto de divulgación sobre neurodiversidad. Su trabajo parte de la experiencia familiar y de una necesidad concreta: encontrar explicaciones comprensibles y recursos que puedan utilizarse en el día a día.',
 'bookPrefix':'Es autora de', 'book1':'Luma y la flor que sabía escuchar', 'and':'y', 'book2':'Autismo en la vida diaria',
 'bookAfter':'Sus libros abordan la sensibilidad, las emociones y las situaciones cotidianas mediante historias y escenas reconocibles.',
 'projectTitle':'El proyecto',
 'project':[
 'La web reúne información sobre condiciones y situaciones cotidianas, experiencias en primera persona, investigación explicada y recursos prácticos. También permite consultar ayudas y trámites, encontrar juegos y actividades, explorar intereses personales o acceder al Rincón tranquilo.',
 'Está dirigida a personas neurodivergentes, familias, docentes y a quienes buscan comprender mejor estas experiencias. Su propósito es facilitar el acceso a la información sin exigir conocimientos previos ni que la persona sepa de antemano el nombre de lo que le ocurre.'
 ],
 'workTitle':'Una forma de trabajar',
 'work':'El proyecto presta atención a las dificultades concretas y a los apoyos que pueden resultar útiles, sin reducir a nadie a un diagnóstico. La experiencia familiar aporta preguntas y situaciones; las explicaciones documentadas y los testimonios tienen funciones distintas y deben reconocerse como tales.',
 'methodBefore':'Los criterios de selección de fuentes, redacción y revisión se explican en', 'methodLink':'Metodología',
 'contactTitle':'Contacto', 'contactBefore':'Para comunicar un error, proponer una mejora o contactar con Iris Green, escribe a',
 'contactAfter':'Si el mensaje se refiere a un contenido de la web, incluye el enlace para facilitar su revisión.',
 'description':'Iris Green, autora de Luma y la flor que sabía escuchar y Autismo en la vida diaria, presenta su proyecto de información y recursos sobre neurodiversidad.'
},
'en': {
 'title':'About Iris Green',
 'lead':'Information and resources for understanding neurodiversity in everyday life.',
 'intro':'Iris Green is an author and the creator of this project sharing information about neurodiversity. Her work draws on family experience and a practical need: to find understandable explanations and resources that can be used in everyday life.',
 'bookPrefix':'She is the author of', 'book1':'Luma and the Flower That Knew How to Listen', 'and':'and', 'book2':'Autism in Everyday Life',
 'bookAfter':'Her books explore sensitivity, emotions and everyday situations through stories and recognisable scenes.',
 'projectTitle':'The project',
 'project':[
 'The website brings together information about conditions and everyday situations, first-person experiences, explanations of research and practical resources. It also offers information about support and application procedures, games and activities, topics to explore through personal interests, and access to the Quiet space.',
 'It is for neurodivergent people, families, teachers and anyone seeking to understand these experiences better. Its purpose is to make information easier to access without requiring prior knowledge or expecting people to already know the name for what they are experiencing.'
 ],
 'workTitle':'An approach to the work',
 'work':'The project pays attention to specific difficulties and support that may be useful, without reducing anyone to a diagnosis. Family experience brings questions and situations; documented explanations and personal accounts serve different purposes and should be recognised as such.',
 'methodBefore':'The criteria for selecting sources, writing and reviewing content are explained in', 'methodLink':'Methodology',
 'contactTitle':'Contact', 'contactBefore':'To report an error, suggest an improvement or contact Iris Green, write to',
 'contactAfter':'If your message concerns content on the website, include the link to make it easier to review.',
 'description':'Iris Green, author of Luma and the Flower That Knew How to Listen and Autism in Everyday Life, introduces her neurodiversity information and resources project.'
},
'pt': {
 'title':'Sobre Iris Green',
 'lead':'Informações e recursos para compreender a neurodiversidade na vida cotidiana.',
 'intro':'Iris Green é autora e criadora deste projeto de divulgação sobre neurodiversidade. Seu trabalho parte da experiência familiar e de uma necessidade concreta: encontrar explicações compreensíveis e recursos que possam ser usados no dia a dia.',
 'bookPrefix':'É autora de', 'book1':'Luma e a flor que sabia escutar', 'and':'e', 'book2':'Autismo na vida diária',
 'bookAfter':'Seus livros abordam a sensibilidade, as emoções e as situações cotidianas por meio de histórias e cenas reconhecíveis.',
 'projectTitle':'O projeto',
 'project':[
 'O site reúne informações sobre condições e situações cotidianas, experiências em primeira pessoa, pesquisas explicadas e recursos práticos. Também permite consultar apoios e procedimentos, encontrar jogos e atividades, explorar interesses pessoais ou acessar o Espaço tranquilo.',
 'É voltado a pessoas neurodivergentes, famílias, docentes e a quem busca compreender melhor essas experiências. Seu propósito é facilitar o acesso à informação sem exigir conhecimentos prévios nem que a pessoa já saiba o nome do que está acontecendo com ela.'
 ],
 'workTitle':'Uma forma de trabalhar',
 'work':'O projeto considera as dificuldades concretas e os apoios que podem ser úteis, sem reduzir ninguém a um diagnóstico. A experiência familiar traz perguntas e situações; as explicações documentadas e os depoimentos têm funções diferentes e devem ser reconhecidos como tais.',
 'methodBefore':'Os critérios de seleção de fontes, redação e revisão são explicados em', 'methodLink':'Metodologia (em espanhol)',
 'contactTitle':'Contato', 'contactBefore':'Para comunicar um erro, propor uma melhoria ou entrar em contato com Iris Green, escreva para',
 'contactAfter':'Se a mensagem se refere a um conteúdo do site, inclua o link para facilitar a revisão.',
 'description':'Iris Green, autora de Luma e a flor que sabia escutar e Autismo na vida diária, apresenta seu projeto de informações e recursos sobre neurodiversidade.'
}
}

path=Path('es/sobre-iris-green/index.html')
s=path.read_text()
pos=s.index('const STR = ')+len('const STR = ')
old,end=json.JSONDecoder().raw_decode(s[pos:])
for lang,a in ABOUT.items():
    T=old[lang]
    T.update(a)
    T['docTitle']=a['title']+' · Iris Green'
    T['lede']={'primera':a['lead'],'tercera':a['lead']}
    T['who']={'primera':[a['intro']],'tercera':[a['intro']]}
    T['method']=[]; T['collections']=[]; T['writing']=[]
    T['credits']=''; T['creditsTitle']=''; T['close']=''
    T['methodHref']='/es/metodologia/'+('?lang=en' if lang=='en' else '?lang=es')
s=s[:pos]+json.dumps(old,ensure_ascii=False,indent=2)+s[pos+end:]
main='''<main class="about-editorial" id="main" tabindex="-1" style="max-width: 1180px; margin: 0 auto; padding: 40px 28px 70px;">
    <h1>{{ tTitle }}</h1>
    <p class="about-lede">{{ tLede }}</p>
    <section class="about-block" aria-label="{{ tTitle }}">
      <sc-for list="{{ whoParas }}" as="p" hint-placeholder-count="1"><p>{{ p.text }}</p></sc-for>
      <p>{{ tBookPrefix }} <em>{{ tBook1 }}</em> {{ tAnd }} <em>{{ tBook2 }}</em>. {{ tBookAfter }}</p>
    </section>
    <section class="about-block"><h2>{{ tProjectTitle }}</h2>
      <sc-for list="{{ projectParas }}" as="p" hint-placeholder-count="2"><p>{{ p.text }}</p></sc-for>
    </section>
    <section class="about-block about-principles" id="criterios-editoriales" style="scroll-margin-top:10rem"><h2>{{ tWorkTitle }}</h2>
      <p>{{ tWork }}</p><p>{{ tMethodBefore }} <a href="{{ tMethodHref }}">{{ tMethodLink }}</a>.</p>
    </section>
    <section class="about-block"><h2>{{ tContactTitle }}</h2>
      <p>{{ tContactBefore }} <a href="mailto:informacion@irisgreen.eu">informacion@irisgreen.eu</a>. {{ tContactAfter }}</p>
    </section>
  </main>'''
s,n=re.subn(r'<main\b[^>]*>[\s\S]*?</main>',lambda m:main,s,count=1); assert n==1
insert='''tBookPrefix:T.bookPrefix, tBook1:T.book1, tAnd:T.and, tBook2:T.book2, tBookAfter:T.bookAfter,
      tProjectTitle:T.projectTitle, projectParas:T.project.map(text=>({text})),
      tWorkTitle:T.workTitle, tWork:T.work, tMethodBefore:T.methodBefore, tMethodHref:T.methodHref,
      tContactTitle:T.contactTitle, tContactBefore:T.contactBefore, tContactAfter:T.contactAfter,
      tDates: T.dates,'''
assert 'tDates: T.dates,' in s
s=s.replace('tDates: T.dates,',insert,1)
s=re.sub(r'<title>[^<]*</title>', '<title>Sobre Iris Green · Iris Green</title>',s,count=1)
for selector in ['name="description"','property="og:description"']:
    s=re.sub(r'<meta '+re.escape(selector)+r' content="[^"]*">',lambda m:'<meta '+selector+' content="'+html.escape(ABOUT['es']['description'],quote=True)+'">',s,count=1)
s=re.sub(r'<meta property="og:title" content="[^"]*">','<meta property="og:title" content="Sobre Iris Green · Iris Green">',s,count=1)
# Retain source controls and synchronised metadata. Stop speech on a language change.
s=s.replace('  setLang(lang) {\n','  setLang(lang) {\n    if (window.speechSynthesis) window.speechSynthesis.cancel();\n    window.IGPreferences.setSpeech(false);\n',1)
path.write_text(s)

ES=[
('fuentes','Fuentes y alcance',[
 'La documentación debe identificar la fuente utilizada, su fecha y la información que respalda. También debe permitir distinguir a qué personas, situaciones o territorios se refiere.',
 'El tipo de fuente depende del contenido: publicaciones científicas y guías para las explicaciones de salud; organismos responsables y documentación oficial para ayudas y trámites; testimonios identificados para las experiencias en primera persona.',
 'Cuando una referencia está pendiente de incorporación o comprobación, debe indicarse. Una referencia pendiente no equivale a que no exista información sobre el tema.'
]),
('tipos-contenido','Investigación, experiencias y recursos prácticos',[
 'Los resultados de una investigación, una experiencia personal y una propuesta práctica no son intercambiables.',
 'Un testimonio permite conocer cómo vive una situación esa persona; no representa necesariamente a todas. Una frase editable o un recurso para organizar una tarea ofrece una opción de uso, no una garantía de que resulte útil en cualquier contexto.',
 'Las cifras deben acompañarse de la población a la que corresponden, el periodo estudiado y la información necesaria para interpretarlas.'
]),
('limites','Las etiquetas A, B y C',[
 'Algunas fichas utilizan estas letras para describir el respaldo recogido en la página: <strong>A</strong>, una guía clínica o revisión sistemática; <strong>B</strong>, documentos institucionales o estudios individuales; <strong>C</strong>, propuestas prácticas que no se presentan como resultados de investigación.',
 'Estas etiquetas deben leerse junto con las referencias y sus límites. No equivalen a una evaluación GRADE, una revisión clínica independiente ni una garantía de eficacia. La calidad de una explicación no queda resumida en una sola letra.'
]),
('revision','Revisión y actualizaciones',[
 'La revisión de la redacción, la comprobación documental y las pruebas de funcionamiento son tareas distintas.',
 'Cambiar el diseño, corregir una traducción o añadir una herramienta no significa haber revisado de nuevo todas las fuentes. Las fechas deben señalar qué se ha actualizado y no presentarse como una validación general de la web.',
 'En las ayudas y los trámites, la información debe leerse junto con los requisitos y plazos de la fuente oficial correspondiente.'
]),
('lenguaje','Lenguaje y presentación',[
 'El criterio de redacción es utilizar explicaciones directas, ejemplos concretos y términos respetuosos. Los nombres oficiales se mantienen cuando son necesarios para identificar una condición, un recurso o un procedimiento.',
 'Los resúmenes permiten acceder primero a lo esencial. Los ajustes de lectura permiten modificar la presentación del texto. Estas funciones no deben confundirse con una certificación de accesibilidad ni con la validación de un material en lectura fácil.'
]),
('responsabilidad','Autoría y correcciones',[
 'Iris Green es la responsable editorial del proyecto. Las colaboraciones en libros y otros materiales se identifican en sus apartados correspondientes; no implican por sí mismas una revisión especializada de toda la web.',
 'Para señalar un error o una referencia que necesita revisarse, escribe a <a href="mailto:informacion@irisgreen.eu">informacion@irisgreen.eu</a> e incluye el enlace y el fragmento al que te refieres.'
])]
EN=[
('fuentes','Sources and scope',[
 'The documentation should identify the source used, its date and the information it supports. It should also make it possible to distinguish which people, situations or territories it refers to.',
 'The type of source depends on the content: scientific publications and guidelines for health explanations; responsible organisations and official documents for support and application procedures; identified personal accounts for first-person experiences.',
 'When a reference still needs to be added or checked, this should be stated. A pending reference does not mean that information on the subject does not exist.'
]),
('tipos-contenido','Research, experiences and practical resources',[
 'Research findings, personal experiences and practical suggestions are not interchangeable.',
 'A personal account helps us understand how that person experiences a situation; it does not necessarily represent everyone. An editable phrase or a resource for organising a task offers an option to use, not a guarantee that it will be useful in every context.',
 'Figures should be accompanied by the population they refer to, the period studied and the information needed to interpret them.'
]),
('limites','The A, B and C labels',[
 'Some entries use these letters to describe the supporting material cited on the page: <strong>A</strong>, a clinical guideline or systematic review; <strong>B</strong>, institutional documents or individual studies; <strong>C</strong>, practical suggestions that are not presented as research findings.',
 'These labels should be read alongside the references and their limitations. They do not amount to a GRADE assessment, an independent clinical review or a guarantee of effectiveness. The quality of an explanation cannot be summed up in a single letter.'
]),
('revision','Review and updates',[
 'Reviewing the wording, checking the documentation and testing functionality are different tasks.',
 'Changing the design, correcting a translation or adding a tool does not mean that all sources have been reviewed again. Dates should indicate what has been updated, rather than being presented as general validation of the website.',
 'For support and application procedures, the information should be read alongside the requirements and deadlines in the relevant official source.'
]),
('lenguaje','Language and presentation',[
 'The writing criterion is to use direct explanations, specific examples and respectful terms. Official names are retained when they are needed to identify a condition, a resource or a procedure.',
 'Summaries provide access to the essential information first. Reading settings allow the presentation of the text to be changed. These features should not be confused with accessibility certification or the validation of Easy Read material.'
]),
('responsabilidad','Authorship and corrections',[
 'Iris Green is responsible for the project\'s editorial work. Collaborations on books and other materials are identified in their respective sections; they do not in themselves imply a specialist review of the whole website.',
 'To report an error or a reference that needs to be reviewed, write to <a href="mailto:informacion@irisgreen.eu">informacion@irisgreen.eu</a> and include the link and the passage you are referring to.'
])]
METHOD_META={
 'es':{'title':'Metodología','lead':'Cómo se selecciona, prepara y revisa el contenido de Iris Green.','intro':'Esta página recoge los criterios editoriales del proyecto. El contenido tiene una finalidad informativa y no ofrece diagnósticos ni tratamientos personalizados.','home':'Inicio','date':'Actualización editorial de esta página: 9 de septiembre de 2026.','about':'Sobre Iris Green'},
 'en':{'title':'Methodology','lead':'How Iris Green content is selected, prepared and reviewed.','intro':'This page sets out the project\'s editorial criteria. The content is for information and does not offer personalised diagnoses or treatments.','home':'Home','date':'Editorial update to this page: 9 September 2026.','about':'About Iris Green'}
}
def method_main(lang,sections):
    t=METHOD_META[lang]
    out='<p class="crumb"><a href="/">'+t['home']+'</a></p>\n<h1>'+t['title']+'</h1>\n<p class="lede">'+t['lead']+'</p>\n<p>'+t['intro']+'</p>\n'
    for ident,title,paras in sections:
        out+='<section class="sec" id="'+ident+'"><h2>'+title+'</h2>\n'+''.join('<p>'+p+'</p>\n' for p in paras)+'</section>\n'
    out+='<p class="method-date"><time datetime="2026-09-09">'+t['date']+'</time></p>\n<p><a href="/es/sobre-iris-green/">'+t['about']+'</a></p>'
    return out
path=Path('es/metodologia/index.html'); s=path.read_text()
es=method_main('es',ES); en=method_main('en',EN)
s,n=re.subn(r'<main\b[^>]*>[\s\S]*?</main>',lambda m:'<main id="main" class="methodology-page" tabindex="-1">\n'+es+'\n</main>',s,count=1); assert n==1
s=re.sub(r'<title>[^<]*</title>','<title>Metodología · Iris Green</title>',s,count=1)
desc='Cómo se selecciona, prepara y revisa el contenido de Iris Green: fuentes, recursos, criterios editoriales y correcciones.'
for key in ['name="description"','property="og:description"']:
    s,n=re.subn(r'<meta content="[^"]*" '+re.escape(key)+r'\s*/?>',lambda m:'<meta content="'+desc+'" '+key+'/>',s,count=1); assert n==1
schema_match=re.search(r'<script type="application/ld\+json">([\s\S]*?)</script>',s)
schema=json.loads(schema_match[1]); schema['@graph'][0]['description']=desc
s=s[:schema_match.start()]+'<script id="method-schema" type="application/ld+json">'+json.dumps(schema,ensure_ascii=False,separators=(',',':'))+'</script>'+s[schema_match.end():]
# A single URL retains the original ES fallback and adds the matching EN text.
# Reading, music and menu still use the existing shared controllers.
s,n=re.subn(r'<nav aria-label="Idioma" class="langs">[\s\S]*?</nav>', '<nav aria-label="Idioma" class="langs"><span class="lang on" aria-current="true" id="method-static-language">ES</span><button type="button" class="lang on" data-method-lang="es" aria-label="Español" aria-pressed="true" hidden>ES</button><button type="button" class="lang" data-method-lang="en" lang="en" aria-label="English" aria-pressed="false" hidden>EN</button></nav>',s,count=1); assert n==1
translations={'main':en, 'meta':METHOD_META}
script='''<script id="method-translations" type="application/json">'''+json.dumps(translations,ensure_ascii=False).replace('</','<\/')+'''</script>
<script>
(function(){
  'use strict';
  var main=document.getElementById('main'), es=main.innerHTML;
  var data=JSON.parse(document.getElementById('method-translations').textContent);
  var nodes=Array.from(document.querySelectorAll('.skip,#ig-main-nav a,.ig-menu-button,#mBtn span,#a11yBtn span,#plBtn span,#a11y h2,#a11y .grp>span,#a11y [data-a]'));
  var original=nodes.map(function(n){return n.textContent;});
  var english={'Ir al contenido':'Skip to content','Inicio':'Home','Condiciones':'Conditions','Situaciones':'Situations','Vida diaria':'Everyday life','Vídeos':'Videos','Investigación':'Research','Datos':'Data','Ayudas':'Support','Libros':'Books','Jugar':'Play','Tus intereses':'Your interests','El taller':'The workshop','Rincón tranquilo':'Quiet space','Menú':'Menu','Lectura':'Reading','Música':'Music','Lectura accesible':'Accessible reading','Tamaño del texto':'Text size','Letra más separada':'Wider letter spacing','Botones más grandes':'Bigger buttons','Más contraste':'More contrast','Guía de lectura':'Reading guide','Leer en voz alta':'Read aloud','Reducir movimiento':'Reduce motion','Restablecer':'Reset'};
  function set(lang,persist){
    lang=lang==='en'?'en':'es';
    if(window.speechSynthesis)window.speechSynthesis.cancel();
    if(window.IGPreferences)window.IGPreferences.setSpeech(false);
    document.documentElement.lang=lang;
    main.innerHTML=lang==='en'?data.main:es;
    main.querySelectorAll('p,li,h1,h2').forEach(function(n){n.setAttribute('data-read','');});
    nodes.forEach(function(n,i){n.textContent=lang==='en'?(english[original[i]]||original[i]):original[i];});
    document.querySelectorAll('[data-method-lang]').forEach(function(b){b.classList.toggle('on',b.dataset.methodLang===lang);b.setAttribute('aria-pressed',String(b.dataset.methodLang===lang));b.hidden=false;});
    document.getElementById('method-static-language').hidden=true;
    document.querySelector('.langs').setAttribute('aria-label',lang==='en'?'Language':'Idioma');
    document.querySelector('#ig-main-nav').setAttribute('aria-label',lang==='en'?'Explore':'Explorar');
    document.getElementById('a11yBtn').setAttribute('aria-label',lang==='en'?'Accessible reading':'Lectura accesible');
    document.getElementById('plBtn').setAttribute('aria-label',lang==='en'?'Music':'Música');
    document.querySelectorAll('.ig-menu-button').forEach(function(b){b.setAttribute('aria-label',lang==='en'?'Open menu':'Abrir menú');});
    document.querySelectorAll('#a11y [data-a="fs-"],#a11y [data-a="fs+"]').forEach(function(b){b.setAttribute('aria-label',(lang==='en'?'Text size ':'Tamaño del texto ')+(b.dataset.a==='fs+'?'+':'−'));});
    var t=data.meta[lang];document.title=t.title+' · Iris Green';
    document.querySelector('meta[name="description"]').content=t.lead;
    document.querySelector('meta[property="og:description"]').content=t.lead;
    document.querySelector('meta[property="og:title"]').content=t.title;
    var schema=document.getElementById('method-schema'), obj=JSON.parse(schema.textContent);
    obj['@graph'][0].name=t.title;obj['@graph'][0].description=t.lead;obj['@graph'][0].inLanguage=lang;
    obj['@graph'][1].itemListElement[0].name=t.home;obj['@graph'][1].itemListElement[1].name=t.title;
    schema.textContent=JSON.stringify(obj);
    if(persist)try{localStorage.setItem('ig_lang',lang);}catch(e){}
    if(window.IGPreferences)window.IGPreferences.apply();
  }
  document.querySelectorAll('[data-method-lang]').forEach(function(b){b.addEventListener('click',function(){set(b.dataset.methodLang,true);});});
  var lang='es';try{lang=new URLSearchParams(location.search).get('lang')||localStorage.getItem('ig_lang')||'es';}catch(e){}
  set(lang,false);
})();
</script>'''
s=s.replace('</body>',script+'\n</body>')
assert 'max-width:70rem' in s, 'The previously approved wider layout must be retained'
path.write_text(s)
print(json.dumps({p:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in FILES},indent=2))
