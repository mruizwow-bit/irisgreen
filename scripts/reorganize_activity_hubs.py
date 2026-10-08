"""Separate playing, creating and visual communication in the built site."""
import argparse
import re
from html import escape
from pathlib import Path



def card(url, title, description, cta):
    return '<li><a class="ig-activity-card" href="'+url+'"><h2>'+escape(title)+'</h2><p>'+escape(description)+'</p><span>'+escape(cta)+' →</span></a></li>'


def run(root):
    for lang in ('es','en'):
        en = lang == 'en'
        base = 'en/resources/' if en else 'es/recursos/'
        workshop = 'en/workshop/' if en else 'es/taller/'
        money = base+('count-and-pay/' if en else 'contar-y-pagar/')
        title = 'Pictograms and visual supports' if en else 'Pictogramas y apoyos visuales'
        desc = 'Prepare a routine, communicate what you need or print visual supports.' if en else 'Prepara una rutina, comunica lo que necesitas o imprime apoyos visuales.'
        tools = [
            ('visual-routines/' if en else 'rutinas-visuales/', 'Visual routines' if en else 'Rutinas visuales', 'Arrange steps with pictograms. Use a prepared routine or make your own.' if en else 'Ordena pasos con pictogramas. Usa una rutina preparada o crea la tuya.', 'Create a routine' if en else 'Crear una rutina'),
            ('printable-routines/' if en else 'rutinas-imprimibles/', 'Printable routines' if en else 'Rutinas imprimibles', 'Print routines, cut-out cards and boards to use away from the screen.' if en else 'Imprime rutinas, tarjetas para recortar y tableros para usarlos fuera de la pantalla.', 'Choose a printable' if en else 'Elegir un imprimible'),
            ('iris-card/' if en else 'tarjeta-iris/', 'Iris Card' if en else 'Tarjeta Iris', 'Write a message about what you need and show it to someone.' if en else 'Prepara un mensaje sobre lo que necesitas y enséñalo cuando quieras.', 'Prepare a message' if en else 'Preparar un mensaje')
        ]
        # Use the existing English Iris Card route; do not create a duplicate tool.
        for slug,*_ in tools:
            assert (root/base/slug/'index.html').is_file(), base+slug
        page=root/base/'index.html'
        # El hub en español pasa a ser una página de autor: rutinas para imprimir y juegos,
        # cada juego con su ficha. Ya no se genera aquí. El inglés sigue igual hasta su cambio.
        if en:
            text=page.read_text(encoding='utf-8')
            inner = '<header class="ig-activity-head"><h1>'+title+'</h1><p>'+desc+'</p></header><ul class="ig-activity-grid">'+''.join(card('/'+base+slug,name,info,cta) for slug,name,info,cta in tools)+'</ul>'
            text=re.sub(r'(<main\b[^>]*>).*?</main>',lambda m:m.group(1)+inner+'</main>',text,count=1,flags=re.S)
            text=re.sub(r'<title>.*?</title>','<title>'+title+' | Iris Green</title>',text,count=1,flags=re.S)
            page.write_bytes(text.encode())
        # #369 P12: global navigation already provides context; strip any legacy activity nav.
        pages=[(root/workshop/'index.html','workshop'),(root/base/'games/index.html' if en else root/base/'juegos/index.html','games'),(root/money/'index.html','games')]
        pages += [(root/base/slug/'index.html','visual') for slug,*_ in tools]
        for page,kind in pages:
            text=page.read_text(encoding='utf-8')
            text=re.sub(r'<p class="crumb">.*?</p>', '', text, flags=re.S)
            text=re.sub(r'<nav class="ig-activity-nav".*?</nav>', '', text, flags=re.S)
            text=re.sub(r'<section class="ig-activity-overview".*?</section>', '', text, flags=re.S)
            if page.parent.name in ('games','juegos'):
                text=re.sub(r'<p class="crumb">(?:(?!</p>).)*id="jg-crumb".*?</p>', '', text, flags=re.S)
                text=re.sub(r'<p class="jg-cross">.*?</p>','',text,flags=re.S)
                overview='<section class="ig-activity-overview" aria-label="'+('Coins and notes' if en else 'Monedas y billetes')+'"><ul class="ig-activity-grid">'+card('/'+money,'Count and pay' if en else 'Contar y pagar','Practise choosing coins and notes, paying and checking change.' if en else 'Practica con monedas y billetes: elige cuánto pagar y comprueba el cambio.','Play with money' if en else 'Jugar con monedas')+'</ul><h2>'+('Games with pictograms' if en else 'Juegos con pictogramas')+'</h2><p>'+('Choose a topic or search for an activity below.' if en else 'Elige un tema o busca una actividad en el catálogo de abajo.')+'</p></section>'
                text=text.replace('<div id="jg-app"',overview+'<div id="jg-app"',1)
            page.write_bytes(text.encode())
        for page in [root/base/'index.html']+[p for p,_ in pages]:
            text=page.read_text(encoding='utf-8')
            text=re.sub(r'<link[^>]*href="/assets/activity-hubs\.css[^"]*"[^>]*>', '', text)
            css='<link rel="stylesheet" href="/assets/activity-hubs.css?v=20261001">'
            final=re.search(r'<link[^>]*href="/assets/ig-r69-unified-ui\.css[^"]*"[^>]*>',text)
            text=text[:final.start()]+css+text[final.start():] if final else text.replace('</head>',css+'</head>',1)
            page.write_bytes(text.encode())
    print('Activity hubs: global navigation only; visual tools grouped separately; money remains under Games pending P0 real-games reconciliation.')


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True)
    run(p.parse_args().root)
