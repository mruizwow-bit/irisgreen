#!/usr/bin/env python3
"""Aplica el marco aprobado y los tres componentes de juego v1 solo en las 13 rutas interactivas."""
from __future__ import annotations
import argparse
import json
import re
from pathlib import Path

GAMES=(
'cada-cerebro-su-camino','donde-se-fue-la-energia','el-archivo-de-capacidades','el-aula-al-reves',
'el-detective-de-los-sentidos','el-mapa-del-tesoro-de-casa','el-traductor-de-casa','el-traductor-de-instrucciones',
'la-cena-de-los-planes','la-consulta','la-maquina-de-empezar','las-cinco-cosas','palabra-misteriosa')
SPRITE='/assets/runtime/ig-icons.fa4be0c21d6c.svg'
TOKENS='<link rel="stylesheet" href="/assets/tokens-accesibilidad.css">'
CSS='<link rel="stylesheet" href="/assets/games-v1.css">'
JS='<script src="/assets/games-v1.js" defer></script>'
NOJS_END='<!-- ig-sin-js:end -->'
COLOR_MAP={
 '#1f8ba8':'var(--turq,#197991)', '#16708a':'var(--turq,#197991)', '#8a5a12':'var(--rosa,#a8336f)',
 '#435268':'var(--muted,#43566d)', '#5d6779':'var(--suave,#5c7391)', '#5a6675':'var(--suave,#5c7391)'}

JS_STRING=r'"(?:\\.|[^"\\])*"'
HOW_OL='<ol class="how" data-rol="orientacion"><li>{{ tHow1 }}</li><li>{{ tHow2 }}</li><li>{{ tHow3 }}</li></ol>'

def icon(symbol):
    return f'<svg class="ig-game-icon" aria-hidden="true" focusable="false"><use href="{SPRITE}#{symbol}"></use></svg>'

def bar_html():
    return (
      '<p class="ig-game-status" data-ig-game-status role="status" aria-live="polite" aria-atomic="true"></p>'
      '<nav class="ig-game-bar ig-solo-pantalla" data-ig-game-bar data-rol="decision" aria-label="Controles del juego">'
      '<button type="button" class="ig-game-control" data-ig-game-undo>'+icon('ig-icon-deshacer')+'<span>Deshacer</span></button>'
      '<button type="button" class="ig-game-control" data-ig-game-reset>'+icon('ig-icon-reiniciar')+'<span>Empezar de nuevo</span></button>'
      '<button type="button" class="ig-game-control" data-ig-game-list>'+icon('ig-icon-lista')+'<span>Prefiero la lista</span></button>'
      '<a class="ig-game-control" href="/es/recursos/juegos/">'+icon('ig-icon-salir')+'<span>Salir del juego</span></a>'
      '</nav>')

def replace_once(text,old,new,label,required=True):
    n=text.count(old)
    if n==0:
        if required:raise AssertionError(f'No se encontró {label}')
        return text
    if n!=1:raise AssertionError(f'{label}: se esperaban 1 coincidencia; hay {n}')
    return text.replace(old,new,1)

def sentences(value):
    return [p.strip() for p in re.split(r'(?<=[.!?…])\s+',value.strip()) if p.strip()]

def split_how_steps(value,slug):
    """Agrupa únicamente el texto editorial existente en tres pasos; no añade contenido."""
    parts=sentences(value)
    if len(parts)==3:return parts
    if slug=='el-traductor-de-casa' and len(parts)==4:
        return [parts[0],parts[1],parts[2]+' '+parts[3]]
    if slug=='la-cena-de-los-planes' and len(parts)==2:
        first=parts[0]
        if ',' not in first:raise AssertionError(f'{slug}: no se puede separar el primer paso sin inventar texto')
        a,b=first.split(',',1);b=b.strip()
        return [a.strip()+'.',b[:1].upper()+b[1:]+('.' if not b.endswith(('.', '!', '?', '…')) else ''),parts[1]]
    raise AssertionError(f'{slug}: Cómo se juega no se puede agrupar en tres pasos sin revisión: {value!r}')

def expose_steps(text,slug):
    text,n=re.subn(r'\btHow\s*:\s*T\.how\s*,',
                   'tHow: T.how, tHow1: T.howSteps[0], tHow2: T.howSteps[1], tHow3: T.howSteps[2],',text,count=1)
    if n==1:return text
    text,n=re.subn(r'(\btLede\s*:\s*T\.lede\s*,)',r'\1 tHow1: T.howSteps[0], tHow2: T.howSteps[1], tHow3: T.howSteps[2],',text,count=1)
    if n!=1:raise AssertionError(f'{slug}: no se pudo exponer tHow1/2/3')
    return text

def inject_after_lede(text,slug):
    pattern=r'(<p\b[^>]*>\s*\{\{\s*tLede\s*\}\}\s*</p>)'
    text,n=re.subn(pattern,r'\1'+HOW_OL,text,count=1,flags=re.I|re.S)
    if n!=1:raise AssertionError(f'{slug}: no se encontró el lede para colocar Cómo se juega')
    return text

def add_steps_after_key(text,slug,key,step_builder):
    pattern=rf'(\b{re.escape(key)}\s*:\s*)({JS_STRING})(?=\s*,)';count=0
    def repl(m):
        nonlocal count
        value=json.loads(m.group(2));steps=step_builder(value,count);count+=1
        if len(steps)!=3:raise AssertionError(f'{slug}: {key} no produjo tres pasos')
        return m.group(1)+m.group(2)+', howSteps: '+json.dumps(steps,ensure_ascii=False)
    text,n=re.subn(pattern,repl,text)
    if n<2:raise AssertionError(f'{slug}: faltan las versiones ES/EN de {key}')
    return text

def ensure_how_list(text,slug):
    existing=re.search(r'<ol\b[^>]*\bclass=["\'][^"\']*\bhow\b[^"\']*["\'][^>]*>(.*?)</ol>',text,re.I|re.S)
    if existing:
        if 'data-rol="orientacion"' not in existing.group(0):
            text,n=re.subn(r'<ol\b([^>]*\bclass=["\'][^"\']*\bhow\b[^"\']*["\'][^>]*)>',r'<ol\1 data-rol="orientacion">',text,count=1,flags=re.I)
            if n!=1:raise AssertionError(f'{slug}: no se pudo etiquetar Cómo se juega')
        existing=re.search(r'<ol\b[^>]*\bclass=["\'][^"\']*\bhow\b[^"\']*["\'][^>]*>(.*?)</ol>',text,re.I|re.S)
        if not existing or len(re.findall(r'<li\b',existing.group(1),re.I))!=3:
            raise AssertionError(f'{slug}: Cómo se juega debe conservar exactamente tres pasos reales')
        return text

    if slug=='el-mapa-del-tesoro-de-casa':
        text=add_steps_after_key(text,slug,'hintMark',lambda value,_: split_how_steps(value,slug))
        text=inject_after_lede(text,slug)
        return expose_steps(text,slug)

    if slug=='las-cinco-cosas':
        ledes=[json.loads(v) for v in re.findall(r'\blede\s*:\s*('+JS_STRING+r')(?=\s*,)',text)]
        notes=[json.loads(v) for v in re.findall(r'\bimgNote\s*:\s*('+JS_STRING+r')(?=\s*,)',text)]
        if len(ledes)<2 or len(notes)<2:raise AssertionError(f'{slug}: faltan lede/imgNote ES/EN')
        built=[]
        for lede,note in zip(ledes,notes):
            lp=sentences(lede);np=sentences(note)
            if not lp or len(np)!=2:raise AssertionError(f'{slug}: instrucciones existentes no tienen la forma esperada')
            built.append([lp[-1],np[0],np[1]])
        idx=0;pattern=rf'(\bimgNote\s*:\s*)({JS_STRING})(?=\s*,)'
        def repl_note(m):
            nonlocal idx
            steps=built[idx];idx+=1
            return m.group(1)+m.group(2)+', howSteps: '+json.dumps(steps,ensure_ascii=False)
        text,n=re.subn(pattern,repl_note,text)
        if n<2:raise AssertionError(f'{slug}: no se pudieron asociar los pasos ES/EN')
        text=inject_after_lede(text,slug)
        return expose_steps(text,slug)

    paragraph=r'<p\b[^>]*>\s*\{\{\s*tHow\s*\}\}\s*</p>'
    text,n=re.subn(paragraph,HOW_OL,text,count=1,flags=re.I|re.S)
    if n!=1:raise AssertionError(f'{slug}: no se encontró el texto existente de Cómo se juega')
    text=add_steps_after_key(text,slug,'how',lambda value,_: split_how_steps(value,slug))
    return expose_steps(text,slug)

def apply_common(text,slug):
    for link in (TOKENS,CSS):
        if link not in text:text=text.replace('</head>',link+'\n</head>',1)
    if JS not in text:text=text.replace('</body>',JS+'\n</body>',1)
    prefix,marker,active=text.partition(NOJS_END)
    if not marker:raise AssertionError(f'{slug}: falta el límite del fallback sin JavaScript')

    flags=' data-ig-game-v1="true" data-rol="principal"'
    if slug=='el-detective-de-los-sentidos':flags+=' data-ig-undo="true"'
    if slug=='las-cinco-cosas':flags+=' data-ig-list="true"'
    if 'data-ig-game-v1=' not in active:
        active,n=re.subn(r'<main\b([^>]*)>',lambda m:'<main'+m.group(1)+flags+'>',active,count=1,flags=re.I)
        if n!=1:raise AssertionError(f'{slug}: falta <main> activo')
    active=ensure_how_list(active,slug)
    how=re.search(r'<ol\b[^>]*\bclass=["\'][^"\']*\bhow\b[^"\']*["\'][^>]*>(.*?)</ol>',active,re.I|re.S)
    if not how or len(re.findall(r'<li\b',how.group(1),re.I))!=3:
        raise AssertionError(f'{slug}: Cómo se juega debe conservar exactamente tres pasos reales')
    if 'Juego interactivo · sin tiempo · sin puntuación' not in active:
        active,n=re.subn(r'(</h1>)',r'\1<p class="ig-game-meta">Juego interactivo · sin tiempo · sin puntuación</p>',active,count=1,flags=re.I)
        if n!=1:raise AssertionError(f'{slug}: falta h1 activo')
    status_count=len(re.findall(r'role=["\']status["\']',active,re.I))
    if status_count==0:
        active=active.replace('</main>',bar_html()+'</main>',1)
    elif status_count==1:
        active=active.replace('</main>',bar_html().replace('<p class="ig-game-status" data-ig-game-status role="status" aria-live="polite" aria-atomic="true"></p>','')+'</main>',1)
    else:
        raise AssertionError(f'{slug}: hay {status_count} regiones role=status en el juego activo antes del marco')
    for old,new in COLOR_MAP.items():active=re.sub(re.escape(old),new,active,flags=re.I)
    active=re.sub(r'\bprueba otra vez\b','si te sirve, puedes probar otra forma',active,flags=re.I)
    active=re.sub(r'\btry again\b','if it helps, you can try another way',active,flags=re.I)
    return prefix+marker+active

def apply_detective(text):
    text=text.replace('dependMsgSome: (n) => "Tú has puesto " + n + " en «depende». Eso es lo normal."','dependMsgSome: (n) => "Has puesto " + n + " en «depende». Ese es el resultado de esta ronda."')
    text=text.replace('dependMsgNone: "No has puesto ninguna en «depende». Mira otra vez: ¿alguna cambia según el día?"','dependMsgNone: "No has puesto ninguna en «depende» en esta ronda."')
    text=text.replace('dependMsgSome: (n) => "You put " + n + " in «it depends». That is normal."','dependMsgSome: (n) => "You put " + n + " in «it depends». That is the result of this round."')
    text=text.replace('dependMsgNone: "You put none in «it depends». Have another look: does any of them change with the day?"','dependMsgNone: "You put none in «it depends» in this round."')
    text=text.replace('hintPlace: (n) => "Has cogido «" + n + "». Ahora toca una cesta."','hintPlace: (n) => "¿Dónde pongo «" + n + "»?"')
    text=text.replace('state = { lang: "es", placed: {}, picked: null,','state = { lang: "es", placed: {}, picked: null, undoStack: [],')
    text=text.replace('this._igPreferencesDisconnect = window.IGPreferences.connect(this);','this._igPreferencesDisconnect = window.IGPreferences.connect(this);\n    this._igGameUndo = () => { const stack = this.state.undoStack.slice(); if (!stack.length) return; const previous = stack.pop(); this.setState({ placed: previous, picked: null, undoStack: stack }); };\n    window.addEventListener("ig-game-undo", this._igGameUndo);',1)
    old='const p = Object.assign({}, this.state.placed);\n          p[this.state.picked] = b;\n          this.setState({ placed: p, picked: null });'
    new='const previous = Object.assign({}, this.state.placed);\n          const p = Object.assign({}, previous);\n          p[this.state.picked] = b;\n          this.setState({ placed: p, picked: null, undoStack: this.state.undoStack.concat([previous]).slice(-20) });'
    text=replace_once(text,old,new,'historial de colocar en Detective')
    old='const p = Object.assign({}, this.state.placed);\n          delete p[n];\n          this.setState({ placed: p });'
    new='const previous = Object.assign({}, this.state.placed);\n          const p = Object.assign({}, previous);\n          delete p[n];\n          this.setState({ placed: p, undoStack: this.state.undoStack.concat([previous]).slice(-20) });'
    text=replace_once(text,old,new,'historial de sacar en Detective')
    text=text.replace('img: IMG[n], name: T.cards[n],\n        bg: st.picked === n ?', 'img: IMG[n], name: T.cards[n], pressed: st.picked === n,\n        bg: st.picked === n ?',1)
    text=text.replace('<button sc-camel-on-click="{{ c.pick }}" style=', '<button class="ig-game-choice" aria-pressed="{{ c.pressed }}" sc-camel-on-click="{{ c.pick }}" style=',1)
    text=text.replace('<button sc-camel-on-click="{{ b.pick }}" style=', '<button class="ig-game-destination" data-ig-destination sc-camel-on-click="{{ b.pick }}" style=',1)
    return text

def apply_vera(text):
    return text.replace('listOpen: "Ver lista"','listOpen: "Prefiero la lista"')

def apply_machine(text):
    text=re.sub(r'\nconst VALID = \[\[0,1,2,3,4,5\], \[0,1,3,2,4,5\]\];\n','\n',text,count=1)
    text=re.sub(r'\n\s*const isValid = complete && VALID\.some\(\(v\) => v\.every\(\(x, i\) => x === order\[i\]\)\);','',text,count=1)
    text=text.replace('okTitle: "Tu orden funciona",','okTitle: "Tu orden",').replace('okText: "Empezar tiene pasos. Cada persona tiene su orden bueno. Tú acabas de encontrar el tuyo.",','okText: "Este es el orden que has creado. Si te sirve, puedes probarlo con una tarea pequeña.",').replace('otherTitle: "Este orden es otro",','otherTitle: "Tu orden",').replace('otherText: "Hay dos órdenes que funcionan siempre: el de la lista y el que prepara la mesa antes de cortar el trabajo. El tuyo es distinto. Pruébalo mañana y mira si te sirve: si te sirve, es bueno.",','otherText: "Este es el orden que has creado. Si te sirve, puedes probarlo con una tarea pequeña.",')
    text=text.replace('okTitle: "Your order works",','okTitle: "Your order",').replace('okText: "Starting has steps. Each person has their own good order. You have just found yours.",','okText: "This is the order you created. If it helps, you can try it with a small task.",').replace('otherTitle: "This order is a different one",','otherTitle: "Your order",').replace('otherText: "Two orders always work: the list order, and the one that gets the table ready before cutting the work up. Yours is different. Try it tomorrow and see: if it works for you, it is good.",','otherText: "This is the order you created. If it helps, you can try it with a small task.",')
    text=text.replace('resultTitle: isValid ? T.okTitle : T.otherTitle,\n      resultText: isValid ? T.okText : T.otherText,\n      resultColor: isValid ? "#16708a" : "#5a49a8",\n      resultBg: isValid ? "rgba(31,139,168,0.08)" : "rgba(90,73,168,0.09)",','resultTitle: T.okTitle,\n      resultText: T.okText,\n      resultColor: "#5a49a8",\n      resultBg: "rgba(90,73,168,0.09)",')
    text=text.replace('<p style="margin: 0 0 16px; font-size: 17px; color: var(--muted,#43566d); max-width: 46em;">{{ tDare }}</p>','<details class="ig-game-other-ways"><summary>Otras maneras que hemos visto</summary><p>{{ tDare }}</p></details>')
    return text

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path('dist'));args=ap.parse_args();root=args.root.resolve();changed=[]
    for slug in GAMES:
        path=root/'es/recursos/juegos'/slug/'index.html'
        if not path.is_file():raise FileNotFoundError(path)
        old=path.read_text(encoding='utf-8');text=apply_common(old,slug)
        if slug=='el-detective-de-los-sentidos':text=apply_detective(text)
        elif slug=='las-cinco-cosas':text=apply_vera(text)
        elif slug=='la-maquina-de-empezar':text=apply_machine(text)
        if text==old:raise AssertionError(f'{slug}: no se aplicó ningún cambio')
        path.write_text(text,encoding='utf-8');changed.append(slug)
    print(json.dumps({'games_changed':len(changed),'routes':changed,'global_navigation_changed':False},ensure_ascii=False))

if __name__=='__main__':main()
