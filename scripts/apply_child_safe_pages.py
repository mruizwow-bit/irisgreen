#!/usr/bin/env python3
"""Extract full S2 bodies from initial HTML and publish safe variants instead.

Scope R42-A2: 8 Conditions + 2 Everyday Life routes with dedicated pages.
Research is handled separately because 132 studies share an aggregate page.
"""
from __future__ import annotations
import argparse, html, json, re
from pathlib import Path

GROUPS={
 "abuse_exploitation":{
  "es":{"heading":"Explicación segura","summary":"Si alguien te hace sentir miedo, te obliga a hacer algo, te pide guardar secretos que te hacen sentir mal o se aprovecha de que necesitas ayuda, puedes contárselo a una persona adulta de confianza. No necesitas explicar todos los detalles para pedir ayuda.","help":"Si estás en peligro ahora, busca ayuda inmediata de una persona adulta de confianza o de los servicios de emergencia de tu país."},
  "en":{"heading":"Safer explanation","summary":"If someone makes you feel afraid, forces you to do something, asks you to keep secrets that make you feel unsafe, or takes advantage of the fact that you need help, you can tell a trusted adult. You do not need to explain every detail in order to ask for help.","help":"If you are in immediate danger, seek help from a trusted adult or your local emergency services."}},
 "eating_disorder":{
  "es":{"heading":"Explicación segura","summary":"Esta información habla de dificultades serias relacionadas con la comida y la salud. La versión segura evita pesos, calorías, comparaciones corporales y detalles sobre conductas que puedan resultar dañinas. Si comer, el miedo a comer o lo que ocurre después de comer te preocupa, habla con una persona adulta de confianza y con un profesional sanitario.","help":"Puedes pedir ayuda aunque no sepas ponerle un nombre a lo que te pasa."},
  "en":{"heading":"Safer explanation","summary":"This information is about serious difficulties involving food and health. The safer version avoids weights, calories, body comparisons and details about behaviours that could be harmful. If eating, fear around eating, or what happens after eating is worrying you, speak to a trusted adult and a health professional.","help":"You can ask for help even if you do not know what to call what is happening."}},
 "trauma":{
  "es":{"heading":"Explicación segura","summary":"Después de una experiencia muy asustante o de situaciones difíciles repetidas, el cuerpo y la mente pueden seguir reaccionando aunque el peligro ya haya pasado. No necesitas contar lo ocurrido con detalle para pedir ayuda.","help":"Puedes hablar con una persona adulta de confianza o con un profesional que sepa trabajar con trauma."},
  "en":{"heading":"Safer explanation","summary":"After a very frightening experience, or difficult situations that happened repeatedly, the body and mind can keep reacting even when the danger has passed. You do not need to describe what happened in detail in order to ask for help.","help":"You can speak to a trusted adult or a professional who understands trauma."}}
}
ROUTES={
 "global-188":("abuse_exploitation","es/neurodiversidad/condiciones/abuso-y-explotacion/index.html","en/neurodiversity/conditions/abuse-and-exploitation/index.html"),
 "global-200":("eating_disorder","es/neurodiversidad/condiciones/anorexia-nerviosa/index.html","en/neurodiversity/conditions/anorexia-nervosa/index.html"),
 "global-212":("eating_disorder","es/neurodiversidad/condiciones/trastorno-por-atracon/index.html","en/neurodiversity/conditions/binge-eating-disorder/index.html"),
 "global-224":("eating_disorder","es/neurodiversidad/condiciones/bulimia-nerviosa/index.html","en/neurodiversity/conditions/bulimia-nervosa/index.html"),
 "global-237":("eating_disorder","es/neurodiversidad/condiciones/trastornos-de-la-conducta-alimentaria-tca/index.html","en/neurodiversity/conditions/eating-disorders/index.html"),
 "global-320":("eating_disorder","es/neurodiversidad/condiciones/otros-trastornos-alimentarios-especificados-osfed/index.html","en/neurodiversity/conditions/other-specified-feeding-or-eating-disorder-osfed/index.html"),
 "global-360":("trauma","es/neurodiversidad/condiciones/tept-trastorno-por-estres-postraumatico/index.html","en/neurodiversity/conditions/ptsd-post-traumatic-stress-disorder/index.html"),
 "global-395":("trauma","es/neurodiversidad/condiciones/tept-complejo/index.html","en/neurodiversity/conditions/complex-ptsd/index.html"),
 "library-022":("eating_disorder","es/biblioteca/arfid-tca-y-pica-cuando-el-apoyo-cotidiano-necesita-atencion-clinica/index.html","en/everyday-life/arfid-eating-disorders-and-pica-when-everyday-support-needs-clinical-care/index.html"),
 "library-057":("abuse_exploitation","es/biblioteca/abuso-explotacion-y-relaciones-seguras/index.html","en/everyday-life/abuse-exploitation-and-safe-relationships/index.html"),
}
MAIN=re.compile(r'(<main\b[^>]*\bid=(["\'])main\2[^>]*>)(.*?)(</main>)',re.I|re.S)
H1=re.compile(r'<h1\b[^>]*>(.*?)</h1>',re.I|re.S)

def strip_tags(value:str)->str:
 return html.unescape(re.sub(r'<[^>]+>','',value)).strip()

def inject_once(text:str,needle:str,html_text:str,where:str)->str:
 if needle in text:return text
 return text.replace(where,html_text+where,1)

def safe_markup(content_id:str,title:str,copy:dict,lang:str)->str:
 labels={"es":{"for":"Contenido para…","all":"Cualquier edad","child":"Infancia","teen":"Adolescencia","adult":"Adultez","full":"Ver información completa","help":"Pedir ayuda"},
         "en":{"for":"Content for…","all":"Any age","child":"Children","teen":"Teenagers","adult":"Adults","full":"View full information","help":"Getting help"}}[lang]
 return f'''<div class="ig-s2-shell">
 <div class="ig-s2-toolbar"><label><span>{html.escape(labels["for"])}</span><select data-ig-audience-select aria-label="{html.escape(labels["for"])}"><option value="all">{html.escape(labels["all"])}</option><option value="child">{html.escape(labels["child"])}</option><option value="teen">{html.escape(labels["teen"])}</option><option value="adult">{html.escape(labels["adult"])}</option></select></label><button type="button" data-ig-load-full hidden>{html.escape(labels["full"])}</button><p class="ig-s2-status" data-ig-s2-status role="status" aria-live="polite"></p></div>
 <article class="ig-s2-safe" data-ig-s2-safe><h1>{html.escape(title)}</h1><h2>{html.escape(copy["heading"])}</h2><p>{html.escape(copy["summary"])}</p><div class="ig-s2-safe-note"><strong>{html.escape(labels["help"])}</strong><p>{html.escape(copy["help"])}</p></div></article>
 <div data-ig-s2-full-host></div>
 </div>'''

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
 full_dir=root/'assets/content/full';full_dir.mkdir(parents=True,exist_ok=True)
 done=[]
 present_ids=[]
 for content_id,(group,es_rel,en_rel) in ROUTES.items():
  es_exists=(root/es_rel).is_file()
  en_exists=(root/en_rel).is_file()
  if es_exists != en_exists:
   raise AssertionError(f'{content_id}: ES/EN S2 route pair is incomplete')
  if not es_exists:
   continue
  present_ids.append(content_id)
  for lang,rel in (('es',es_rel),('en',en_rel)):
   p=root/rel
   text=p.read_text(encoding='utf-8')
   m=MAIN.search(text)
   if not m:raise AssertionError(f'{rel}: main#main missing')
   inner=m.group(3)
   hm=H1.search(inner)
   if not hm:raise AssertionError(f'{rel}: h1 missing')
   title=strip_tags(hm.group(1))
   payload={'schema':'iris-green-s2-full-v1','content_id':content_id,'lang':lang,'html':inner}
   (full_dir/f'{content_id}.{lang}.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
   opening=m.group(1)
   if 'data-ig-s2-shell=' not in opening:
    opening=opening[:-1]+f' data-ig-s2-shell="true" data-ig-content-id="{content_id}">'
   replacement=opening+safe_markup(content_id,title,GROUPS[group][lang],lang)+m.group(4)
   text=text[:m.start()]+replacement+text[m.end():]
   text=inject_once(text,'/assets/ig-child-safety.css','<link rel="stylesheet" href="/assets/ig-child-safety.css">','</head>')
   text=inject_once(text,'/assets/ig-child-safety.js','<script defer src="/assets/ig-child-safety.js?v=r42-child-1"></script>','</body>')
   text=inject_once(text,'/assets/ig-child-safety-content.js','<script defer src="/assets/ig-child-safety-content.js?v=r42-child-1"></script>','</body>')
   # Hard gate: the original full body must no longer be in the initial HTML.
   assert inner not in text
   assert not re.search(r'data-ig-s2-full(?:\\s|=|>)',text)
   p.write_text(text,encoding='utf-8')
   done.append(rel)
 assert len(done)==2*len(present_ids),(len(done),len(present_ids))
 assert present_ids,'No audited S2 dedicated routes are present in the current baseline'
 print({'status':'PASS','safe_routes':len(done),'full_payloads':len(done),'content_ids_present':len(present_ids),'content_ids_audited':len(ROUTES),'pending_ids':sorted(set(ROUTES)-set(present_ids))})

if __name__=='__main__':main()
