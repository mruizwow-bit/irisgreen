#!/usr/bin/env python3
"""R42 A8 · build-time child safety for Iris Green public dist."""
from __future__ import annotations
import argparse, html, json, re
from pathlib import Path
from urllib.parse import urlsplit

S2=[
('global-188','condition','abuse','/es/neurodiversidad/condiciones/abuso-y-explotacion/','/en/neurodiversity/conditions/abuse-and-exploitation/','Abuso y explotación','Abuse and exploitation'),
('global-200','condition','food','/es/neurodiversidad/condiciones/anorexia-nerviosa/','/en/neurodiversity/conditions/anorexia-nervosa/','Anorexia nerviosa','Anorexia nervosa'),
('global-212','condition','food','/es/neurodiversidad/condiciones/trastorno-por-atracon/','/en/neurodiversity/conditions/binge-eating-disorder/','Trastorno por atracón','Binge-eating disorder'),
('global-224','condition','food','/es/neurodiversidad/condiciones/bulimia-nerviosa/','/en/neurodiversity/conditions/bulimia-nervosa/','Bulimia nerviosa','Bulimia nervosa'),
('global-237','condition','food','/es/neurodiversidad/condiciones/trastornos-de-la-conducta-alimentaria-tca/','/en/neurodiversity/conditions/eating-disorders/','Trastornos de la conducta alimentaria (TCA)','Eating disorders'),
('global-320','condition','food','/es/neurodiversidad/condiciones/otros-trastornos-alimentarios-especificados-osfed/','/en/neurodiversity/conditions/other-specified-feeding-or-eating-disorder-osfed/','Otros trastornos alimentarios especificados (OSFED)','Other specified feeding or eating disorder (OSFED)'),
('global-360','condition','trauma','/es/neurodiversidad/condiciones/tept-trastorno-por-estres-postraumatico/','/en/neurodiversity/conditions/ptsd-post-traumatic-stress-disorder/','TEPT / trastorno por estrés postraumático','PTSD / post-traumatic stress disorder'),
('global-395','condition','trauma','/es/neurodiversidad/condiciones/tept-complejo/','/en/neurodiversity/conditions/complex-ptsd/','TEPT complejo','Complex PTSD'),
('library-022','library','food','/es/biblioteca/arfid-tca-y-pica-cuando-el-apoyo-cotidiano-necesita-atencion-clinica/','/en/everyday-life/arfid-eating-disorders-and-pica-when-everyday-support-needs-clinical-care/','ARFID, TCA y pica: cuándo el apoyo cotidiano necesita atención clínica','ARFID, eating disorders and pica: when everyday support needs clinical care'),
('library-057','library','abuse','/es/biblioteca/abuso-explotacion-y-relaciones-seguras/','/en/everyday-life/abuse-exploitation-and-safe-relationships/','Abuso, explotación y relaciones seguras','Abuse, exploitation and safe relationships'),
]
RS={5:('research-005','food'),36:('research-036','selfharm'),37:('research-037','selfharm'),45:('research-045','food'),46:('research-046','food'),71:('research-071','sexual')}
SAFE={
'abuse':{'es':('Explicación segura','Si alguien te hace sentir miedo, te obliga a hacer algo, te pide guardar secretos que te hacen sentir mal o se aprovecha de que necesitas ayuda, puedes contárselo a una persona adulta de confianza. No necesitas explicar todos los detalles para pedir ayuda.','Si estás en peligro ahora, busca ayuda inmediata de una persona adulta de confianza o de los servicios de emergencia de tu país.'),'en':('Safer explanation','If someone makes you feel afraid, forces you to do something, asks you to keep secrets that make you feel unsafe, or takes advantage of the fact that you need help, you can tell a trusted adult. You do not need to explain every detail in order to ask for help.','If you are in immediate danger, seek help from a trusted adult or your local emergency services.')},
'food':{'es':('Explicación segura','Esta información habla de dificultades serias relacionadas con la comida y la salud. La versión segura evita pesos, calorías, comparaciones corporales y detalles sobre conductas que puedan resultar dañinas. Si comer, el miedo a comer o lo que ocurre después de comer te preocupa, habla con una persona adulta de confianza y con un profesional sanitario.','Puedes pedir ayuda aunque no sepas ponerle un nombre a lo que te pasa.'),'en':('Safer explanation','This information is about serious difficulties involving food and health. The safer version avoids weights, calories, body comparisons and details about behaviours that could be harmful. If eating, fear around eating, or what happens after eating is worrying you, speak to a trusted adult and a health professional.','You can ask for help even if you do not know what to call what is happening.')},
'trauma':{'es':('Explicación segura','Después de una experiencia muy asustante o de situaciones difíciles repetidas, el cuerpo y la mente pueden seguir reaccionando aunque el peligro ya haya pasado. No necesitas contar lo ocurrido con detalle para pedir ayuda.','Puedes hablar con una persona adulta de confianza o con un profesional que sepa trabajar con trauma.'),'en':('Safer explanation','After a very frightening experience, or difficult situations that happened repeatedly, the body and mind can keep reacting even when the danger has passed. You do not need to describe what happened in detail in order to ask for help.','You can speak to a trusted adult or a professional who understands trauma.')},
'selfharm':{'es':('Resumen seguro de la investigación','Esta investigación trata sobre pensamientos de hacerse daño o de no querer seguir viviendo. La versión segura no muestra métodos, instrucciones ni detalles gráficos. Resume qué se ha estudiado y qué apoyos se consideran importantes.','Si esto tiene que ver contigo o con alguien cercano, busca apoyo de una persona de confianza o de un servicio de ayuda. Si hay peligro inmediato, contacta con emergencias.'),'en':('Safer research summary','This research concerns thoughts of self-harm or not wanting to stay alive. The safer version does not show methods, instructions or graphic details. It summarises what researchers have studied and what kinds of support are considered important.','If this relates to you or someone close to you, seek support from someone you trust or a support service. If there is immediate danger, contact emergency services.')},
'sexual':{'es':('Resumen seguro','Esta investigación incluye experiencias sexuales no deseadas o difíciles. La versión segura evita detalles y se centra en lo que se estudió, sus límites y la importancia de poder pedir apoyo.','Si algo te ha ocurrido y te preocupa, puedes hablar con una persona adulta de confianza o con un profesional sin tener que contar todos los detalles de una vez.'),'en':('Safer summary','This research includes unwanted or difficult sexual experiences. The safer version avoids details and focuses on what was studied, its limitations and the importance of being able to ask for support.','If something has happened to you and you are worried, you can speak to a trusted adult or a professional without having to tell every detail at once.')},
}
ARTICLE=re.compile(r'<article\b[^>]*>.*?</article>',re.S|re.I)
NOSCRIPT=re.compile(r'<noscript\b[^>]*>.*?</noscript>',re.S|re.I)

def page(root,url):
    return root/urlsplit(url).path.strip('/')/'index.html'
def inject(text,library=False):
    if '/assets/ig-audience.css' not in text:
        text=text.replace('</head>','<link rel="stylesheet" href="/assets/ig-audience.css"><script src="/assets/ig-audience.js"></script></head>',1)
    if '/assets/ig-child-safe.js' not in text:
        text=text.replace('</body>','<script defer src="/assets/ig-child-safe.js"></script></body>',1)
    if library and '/assets/ig-library-s2.js' not in text:
        text=text.replace('</body>','<script defer src="/assets/ig-library-s2.js"></script></body>',1)
    return text
def safe_article(r,lang):
    cid,_,group,_,_,tes,ten=r;title=ten if lang=='en' else tes;h,s,help_=SAFE[group][lang]
    start='Where to start' if lang=='en' else 'Por dónde empezar'
    note=('The full version is never loaded automatically. Adults can request it explicitly after selecting Adults in “Content for…”.' if lang=='en' else 'La versión completa nunca se carga automáticamente. En Adultez puede solicitarse expresamente después de elegir «Contenido para…».')
    return f'<article class="ficha ig-s2-safe" data-ig-s2-safe data-ig-s2-id="{cid}"><h1>{html.escape(title)}</h1><p class="ig-safety-kicker">{html.escape(h)}</p><section class="sec"><p class="lede">{html.escape(s)}</p></section><section class="sec helps"><h2>{start}</h2><p>{html.escape(help_)}</p></section><div class="ig-s2-actions" data-ig-s2-actions></div><p class="ig-s2-note">{html.escape(note)}</p></article>'
def protect_pages(root):
    out=root/'assets/safety/full';out.mkdir(parents=True,exist_ok=True);n=0
    for r in S2:
        for lang,url in [('es',r[3]),('en',r[4])]:
            p=page(root,url)
            if not p.is_file():continue
            text=p.read_text(encoding='utf-8');m=ARTICLE.search(text)
            if not m:raise ValueError(f'No article: {p}')
            full=re.sub(r'<article\b','<article data-ig-s2-full="true"',m.group(0),count=1,flags=re.I)
            (out/f'{r[0]}-{lang}.html').write_text(full,encoding='utf-8')
            text=text[:m.start()]+safe_article(r,lang)+text[m.end():]
            p.write_text(inject(text),encoding='utf-8');n+=1
    return n
def search_contracts(root):
    data=json.loads((root/'buscador.json').read_text(encoding='utf-8'))
    by_es={r[3]:r for r in S2 if r[1]=='condition'};by_en={r[4]:r for r in S2 if r[1]=='condition'}
    rows=[]
    for x in data:
        en=x.get('en') or {};eu=x.get('u','');nu=en.get('u',eu);r=by_es.get(eu) or by_en.get(nu)
        surf='condition' if '/condiciones/' in eu else 'situation'
        rows.append({'id':r[0] if r else eu,'surface':surf,'title_es':x.get('t',''),'title_en':en.get('t',x.get('t','')),'url_es':eu,'url_en':nu,'area_or_type_es':x.get('tipo') or x.get('a',''),'area_or_type_en':en.get('a') or x.get('tipo') or x.get('a',''),'summary_es':x.get('d',''),'summary_en':en.get('d',x.get('d','')),'audience':['TRANSVERSAL'],'sensitivity':'S2_HIGH_SENSITIVITY' if r else 'S0_GENERAL','discovery':'SAFE_VARIANT_REQUIRED' if r else 'NORMAL','safe_variant_group':r[2] if r else None})
    safe=[x for x in rows if x['sensitivity']!='S2_HIGH_SENSITIVITY']
    intent=[]
    for x in rows:
        if x['sensitivity']!='S2_HIGH_SENSITIVITY':continue
        y=dict(x);group=y.get('safe_variant_group')
        if group in SAFE:
            y['summary_es']=SAFE[group]['es'][1];y['summary_en']=SAFE[group]['en'][1]
        intent.append(y)
    out=root/'assets/safety';out.mkdir(parents=True,exist_ok=True)
    for name,obj in [('search-safe-default.json',safe),('search-intentional-safe.json',intent),('search-adult-full-catalog.json',rows)]:
        (out/name).write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    return len(safe),len(intent),len(rows)
def incidental(root):
    routes={urlsplit(r[3]).path.rstrip('/') for r in S2}|{urlsplit(r[4]).path.rstrip('/') for r in S2};removed=0
    for p in root.rglob('*.html'):
        raw=p.relative_to(root).as_posix();rel='/' + (raw[:-10] if raw.endswith('index.html') else raw)
        if rel.rstrip('/') in routes:continue
        text=p.read_text(encoding='utf-8')
        for target in routes:
            pat=re.compile(r'<a\b[^>]*href=["\'](?:https://irisgreen\.eu)?'+re.escape(target)+r'/?["\'][^>]*>.*?</a>',re.S|re.I)
            text,n=pat.subn('',text);removed+=n
        p.write_text(text,encoding='utf-8')
    return removed
def research(root):
    data_path=root/'es/investigacion/estudios-textos.json'
    if not data_path.is_file():return 0
    data=json.loads(data_path.read_text(encoding='utf-8'));out=root/'assets/safety/full';out.mkdir(parents=True,exist_ok=True);n=0
    for x in data:
        num=int(x.get('n',0) or 0)
        if num not in RS:continue
        cid,group=RS[num]
        for lang in ('es','en'):
            heading=x.get('heading_en' if lang=='en' else 'heading') or x.get('titleOrig','')
            paras=x.get('text_en' if lang=='en' else 'text') or [];means=x.get('means_en' if lang=='en' else 'means','');notp=x.get('notProven_en' if lang=='en' else 'notProven','')
            body=''.join(f'<p>{html.escape(str(v))}</p>' for v in paras)
            (out/f'{cid}-{lang}.html').write_text(f'<h2>{html.escape(str(heading))}</h2>{body}<p>{html.escape(str(means))}</p><p>{html.escape(str(notp))}</p>',encoding='utf-8')
        es=SAFE[group]['es'];en=SAFE[group]['en'];x['text']=[es[1],es[2]];x['means']=es[1];x['notProven']=es[2];x['text_en']=[en[1],en[2]];x['means_en']=en[1];x['notProven_en']=en[2];x['ig_s2_id']=cid;n+=1
    data_path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    p=root/'es/investigacion/index.html'
    if p.is_file():
        text=p.read_text(encoding='utf-8')
        text=NOSCRIPT.sub('<noscript><p>Activa JavaScript para consultar el catálogo de investigación. Los temas de alta sensibilidad se muestran primero en versión segura.</p></noscript>',text)
        text=text.replace('<article style="background: rgba(255,255,255,0.78);','<article id="{{ c.anchor }}" data-ig-research-s2="{{ c.s2Id }}" style="background: rgba(255,255,255,0.78);',1)
        marker='            <div style="background: rgba(23,57,92,0.05); border-radius: 12px; padding: 14px 16px;">'
        add='            <sc-if value="{{ c.s2 }}" hint-placeholder-val="{{ false }}"><div class="ig-s2-actions" data-ig-research-s2-actions></div></sc-if>\n'
        if marker in text and add not in text:text=text.replace(marker,add+marker,1)
        old='          reference: ((L === "en" ? s.authors_en : s.authors) || s.authors) + (s.year ? " (" + s.year + ")" : "") + ". " + s.titleOrig + ". " + (L === "es" ? s.design : (T.designs[s.designKey] || s.design)) + (nSample ? ", " + nSample : "") + ". " + (s.doi || "")'
        new=old+',\n          s2: !!s.ig_s2_id, s2Id: s.ig_s2_id || "", anchor: "estudio-" + s.n'
        if old in text:text=text.replace(old,new,1)
        oldf='    const rows = all.filter((s) => {\n      if (st.design !== "all" && s.designKey !== st.design) return false;'
        newf='    const targetN = Number((location.hash.match(/\\d+/) || [])[0] || 0);\n    const rows = all.filter((s) => {\n      if (s.ig_s2_id && !(window.IGAudience && window.IGAudience.isAdult()) && !words.length && s.n !== targetN) return false;\n      if (st.design !== "all" && s.designKey !== st.design) return false;'
        if oldf in text:text=text.replace(oldf,newf,1)
        oldl='      const lang = localStorage.getItem("ig_lang");\n      const use = STR[lang] ? lang : "es";'
        newl='      const requested = new URLSearchParams(location.search).get("lang");\n      const stored = localStorage.getItem("ig_lang");\n      const lang = STR[requested] ? requested : stored;\n      const use = STR[lang] ? lang : "es";'
        if oldl in text:text=text.replace(oldl,newl,1)
        p.write_text(inject(text),encoding='utf-8')
    return n
def library(root):
    rows=[{'id':r[0],'url_es':r[3],'url_en':r[4],'title_es':r[5],'title_en':r[6],'summary_es':SAFE[r[2]]['es'][1],'summary_en':SAFE[r[2]]['en'][1]} for r in S2 if r[1]=='library']
    out=root/'assets/safety/library-adult-s2.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    for lang,p in [('es',root/'es/biblioteca/index.html'),('en',root/'en/everyday-life/index.html')]:
        if not p.is_file():continue
        text=p.read_text(encoding='utf-8');title='Temas de alta sensibilidad' if lang=='es' else 'High-sensitivity topics'
        block=f'<section class="vd-group" data-ig-library-s2 hidden><h2 class="group-title">{title}</h2><div class="cards" data-ig-library-s2-list></div></section>'
        text=text.replace('</main>',block+'</main>',1) if '</main>' in text else text.replace('</body>',block+'</body>',1)
        p.write_text(inject(text,True),encoding='utf-8')
def catalogs(root):
    for p in [root/'es/neurodiversidad/condiciones/index.html',root/'en/neurodiversity/conditions/index.html',root/'es/situaciones/index.html',root/'en/situations/index.html']:
        if p.is_file():p.write_text(inject(p.read_text(encoding='utf-8')),encoding='utf-8')
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
    safe,intent,adult=search_contracts(root);pages=protect_pages(root);removed=incidental(root);res=research(root);library(root);catalogs(root)
    print(json.dumps({'s2_pages':pages,'research_s2':res,'links_removed':removed,'search_safe':safe,'search_intentional':intent,'search_adult':adult}))
if __name__=='__main__':main()
