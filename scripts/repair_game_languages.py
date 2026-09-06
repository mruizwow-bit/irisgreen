#!/usr/bin/env python3
"""Repair misplaced existing translations. The ten Spanish object labels are
literal localisations of the Portuguese labels accidentally stored in es.tokens.
No game values, explanation meanings, illustrations or collection content change.
"""
import hashlib,json,re
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'reports/games';OUT.mkdir(parents=True,exist_ok=True)
p=ROOT/'es/recursos/juegos/donde-se-fue-la-energia/index.html';text=p.read_text();before=hashlib.sha256(text.encode()).hexdigest()
pattern=re.compile(r'    tokenWhy: (\[[^\n]+\]),\n')
found=list(pattern.finditer(text))
report={'existing_explanations_reassigned':False,'spanish_labels_corrected':[],'notes':[]}
# The original accidentally declared tokenWhy three times in ES and zero in EN/PT.
if len(found)==3 and found[-1].end()<text.index('  en: {',text.index('const STR')):
    arrays=[json.loads(m[1]) for m in found]
    assert [x[0] for x in arrays]==['Dormir é a maior recarga de todas.','Sleep is the biggest recharge of all.','Dormir es la recarga más grande.']
    text=pattern.sub('',text)
    for lang,values in [('es',arrays[2]),('en',arrays[1]),('pt',arrays[0])]:
        start=text.index('  '+lang+': {',text.index('const STR'))
        match=re.search(r'^    tokens: \[[^\n]+\],\n',text[start:],re.M)
        assert match
        pos=start+match.end()
        text=text[:pos]+'    tokenWhy: '+json.dumps(values,ensure_ascii=False,separators=(',',':'))+',\n'+text[pos:]
    report['existing_explanations_reassigned']=True
    report['explanations']={lang:values for lang,values in [('es',arrays[2]),('en',arrays[1]),('pt',arrays[0])]}
else:
    for lang in ['es','en','pt']:
        block=text.split('  '+lang+': {',1)[1].split('\n  },',1)[0]
        assert block.count('    tokenWhy: ')==1,'Unexpected explanation structure: '+lang
old=['A cama','A xícara','O Walkman','A máquina de escrever','O ônibus','O prato com dois garfos','O telefone','O livro','Os tênis','O cachorro na coleira']
new=['La cama','La taza','El Walkman','La máquina de escribir','El autobús','El plato con dos tenedores','El teléfono','El libro','Las zapatillas','El perro con correa']
start=text.index('  es: {',text.index('const STR'))
match=re.search(r'    tokens: (\[[^\n]+\]),',text[start:]);assert match
current=json.loads(match[1])
if current==old:
    a=start+match.start(1);b=start+match.end(1)
    text=text[:a]+json.dumps(new,ensure_ascii=False,separators=(',',':'))+text[b:]
    report['spanish_labels_corrected']=[{'before':a,'after':b} for a,b in zip(old,new)]
else:assert current==new
p.write_text(text)
report['before_sha256']=before;report['after_sha256']=hashlib.sha256(text.encode()).hexdigest()
# Prefer wrapping at spaces; retain every character, including an unbroken 120-char word.
p=ROOT/'es/recursos/juegos/index.html';text=p.read_text()
old='          if (line && x.measureText(line + char).width > width) { lines.push(line); line = ""; }'
new='''          if (line && x.measureText(line + char).width > width) {
            const cut = line.lastIndexOf(" ") + 1;
            if (cut > 0) { lines.push(line.slice(0, cut)); line = line.slice(cut); }
            else { lines.push(line); line = ""; }
          }'''
if old in text:
    assert text.count(old)==1;text=text.replace(old,new,1);p.write_text(text)
else:assert new in text
report['notes']=['The EN and PT explanations are copied verbatim from the original, not newly written.','Only ten short object labels are translated from the misplaced Portuguese to Spanish.','All numerical game rules and the complete 130-game catalogue remain unchanged.','The Portuguese website selector is not re-enabled.']
(OUT/'language-repairs.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
