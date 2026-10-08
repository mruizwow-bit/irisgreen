"""Integrate the October delivery into the existing bilingual navigation."""
import re
from pathlib import Path
from reorganize_activity_hubs import card

SOURCE = Path(__file__).resolve().parents[1]
GAMES = ('cada-cerebro-su-camino', 'la-maquina-de-empezar')
TITLES = {'es': ('Cada cerebro, su camino', 'La máquina de empezar'),
          'en': ('Every brain, its own route', 'The starting machine')}
DESCRIPTIONS = {
 'es': ('Compón la ruta de una persona por el barrio, tramo a tramo, y recórrela.',
        'Coloca piezas en la rampa para quitar los frenos y prueba hasta dónde llega la bola.'),
 'en': ('Build a person’s route through the neighbourhood, one section at a time, and try it.',
        'Place pieces on the ramp to remove obstacles and see how far the ball travels.')}

def page_from(template, body, title, route, peer):
    template = re.sub(r'<(?:header|footer) class="ig-res-(?:header|footer)".*?</(?:header|footer)>', '', template, flags=re.S)
    en = route.startswith('/en/')
    nav = ('<nav aria-label="Resources and games"><a href="/en/resources/">Resources</a> · <a href="/en/games/">Games</a></nav>' if en else '<nav aria-label="Recursos y juegos"><a href="/es/recursos/">Recursos</a> · <a href="/es/juegos/">Juegos</a></nav>')
    body = re.sub(r'(<main\b[^>]*>)', lambda m: m[1]+nav, body, count=1)
    text = re.sub(r'<main\b[^>]*>.*?</main>', lambda _: body, template, count=1, flags=re.S)
    text = re.sub(r'<title>.*?</title>', lambda _: '<title>'+title+' | Iris Green</title>', text, count=1, flags=re.S)
    text = re.sub(r'<meta\b[^>]*(?:name="description"|property="og:description")[^>]*>', '', text)
    text = re.sub(r'<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>', '', text)
    es, en = (route, peer) if route.startswith('/es/') else (peer, route)
    links = f'<link rel="canonical" href="https://irisgreen.eu{route}"><link rel="alternate" hreflang="es" href="https://irisgreen.eu{es}"><link rel="alternate" hreflang="en" href="https://irisgreen.eu{en}">'
    return text.replace('</title>', '</title>'+links, 1)

def english_detail(slug, title, description):
    if slug == GAMES[0]:
        intro = 'Six people need to get somewhere. Build their route through the neighbourhood, one section at a time, and travel it with them.'
        idea = 'The same streets work differently for each person. Choose the route by looking at who will use it. There is no single correct path.'
        steps = [('Look at the person', 'Before setting off, they tell you what they need: their energy, what stops them and what they can do.'),
                 ('Choose the first section', 'Several streets leave the starting point. Each shows how crowded and noisy it is.'),
                 ('Keep building', 'Add sections until you reach the destination. You can undo the last section or clear the whole route.'),
                 ('Try the route', 'The person follows your route. If a section is too demanding, they stop and tell you why.'),
                 ('Try another route', 'Change a section and try again. Several routes can work for each person.')]
        expectation = 'You do not lose: if someone stops, change the route.'
        stats = '<tr><th>People</th><td>6</td></tr><tr><th>Routes</th><td>10</td></tr>'
        image, alt = 'escena-juego', 'A three-dimensional neighbourhood with streets, steps and a bus stop'
    else:
        intro = 'The ball represents you starting something. Obstacles sit along the ramp. Choose the pieces that remove them.'
        idea = 'Starting is not just about wanting to: it also depends on what gets in the way. Identify an obstacle and try a piece that removes it.'
        steps = [('Look at what stops you', 'Today’s situation lists its obstacles in order, such as finding it hard to start moving, not feeling like it or forgetting.'),
                 ('Choose the pieces', 'Each piece removes one or two obstacles and uses energy. You have three spaces on the ramp and three units of energy.'),
                 ('Pull the lever', 'The ball rolls down the ramp. It stops wherever an obstacle remains.'),
                 ('See where it stopped', 'The game tells you which obstacle remains. You do not have to guess.'),
                 ('Change a piece', 'Clear the ramp or change one piece and try again. Several combinations work.')]
        expectation = 'Several ramps reach the end: there is no single solution.'
        stats = '<tr><th>Pieces per ramp</th><td>3</td></tr><tr><th>Energy</th><td>3</td></tr>'
        image, alt = 'escena-maquina', 'A long domino ramp with obstacles along its course'
    play = f'<p><a href="/en/games/{slug}/">Play</a></p>'
    items = ''.join(f'<li><h3>{heading}</h3><p>{text}</p></li>' for heading, text in steps)
    return f'<main id="main"><a href="/en/games/">Back to Games</a><h1>{title}</h1><p>{intro}</p><img class="ig-resource-image" src="/assets/recursos-{image}.webp" alt="{alt}" width="900" height="506">{play}<h2>What it is about</h2><p>{idea}</p><h2>How to play</h2><ol>{items}</ol><p>With a keyboard: use Tab to move between controls and Enter or Space to activate one. All mouse actions are also available through buttons.</p><h2>What to expect</h2><ul><li>No score, timer or correct answer.</li><li>{expectation}</li><li>Nothing is saved and no personal information is requested.</li></ul><table><caption>Game details</caption><tbody>{stats}<tr><th>Languages</th><td>Spanish and English</td></tr></tbody></table>{play}</main>'

def run(root):
    for lang, base, other in [('es','es/recursos','en/resources'), ('en','en/resources','es/recursos')]:
        en = lang == 'en'
        gamebase = 'en/games' if en else 'es/juegos'
        peerbase = 'es/juegos' if en else 'en/games'
        printable = 'printable-routines' if en else 'rutinas-imprimibles'
        peerprint = 'rutinas-imprimibles' if en else 'printable-routines'
        template = (root/base/'index.html').read_text(encoding='utf-8')
        title = 'Resources' if en else 'Recursos'
        routinecard = card('/'+base+'/'+printable+'/', 'Printable routines' if en else 'Rutinas imprimibles', 'Print routines, cut-out cards and boards to use away from the screen.' if en else 'Imprime rutinas, tarjetas para recortar y tableros para usarlos fuera de la pantalla.', 'Choose a printable' if en else 'Elegir un imprimible')
        body = '<main id="main"><h1>'+title+'</h1><ul class="ig-activity-grid">'+routinecard+'</ul></main>'
        (root/base/'index.html').write_text(page_from(template,body,title,'/'+base+'/','/'+other+'/'),encoding='utf-8')
        cards = []
        for i, slug in enumerate(GAMES):
            detail = '/'+gamebase+'/'+slug+'-ficha/'
            image = ('escena-juego','escena-maquina')[i]
            gamecard = card(detail,TITLES[lang][i],DESCRIPTIONS[lang][i],'Read about the game' if en else 'Ver la ficha')
            cards.append(gamecard.replace('<h2>', f'<img class="ig-resource-image" src="/assets/recursos-{image}.webp" alt="" width="900" height="506"><h2>',1))
            if en:
                body = english_detail(slug,TITLES[lang][i],DESCRIPTIONS[lang][i])
            else:
                body = (SOURCE/'editorial'/f'recursos-{slug}.html').read_text(encoding='utf-8').replace(slug+'-jugar/',slug+'/')
            detailfile = root/detail.strip('/')/'index.html'
            detailfile.parent.mkdir(parents=True,exist_ok=True)
            detailfile.write_text(page_from(template,body,TITLES[lang][i],detail,'/'+peerbase+'/'+slug+'-ficha/'),encoding='utf-8')
            # Preserve the already built runtime and its audience/accessibility adapters.
            runtime = root/gamebase/slug/'index.html'
            if en:
                runtime.parent.mkdir(parents=True,exist_ok=True)
                text = (root/'es/juegos'/slug/'index.html').read_text(encoding='utf-8')
                text = text.replace('let lang="es"','let lang="en"').replace("let lang='es'","let lang='en'")
                text = text.replace('<html lang="es"','<html lang="en"')
                text = text.replace('/es/juegos/','/en/games/').replace('← Volver a la ficha','← Back to game details')
            else:
                text = runtime.read_text(encoding='utf-8')
            # Complete the delivered language toggle, including its static labels.
            labels = '''
 const english=lang==='en';
 document.querySelectorAll('a.skip,a.ig-skip').forEach(a=>{a.textContent=english?'Skip to game':'Ir al juego';a.href='#game'});
 const back=document.querySelector('.ig-experience-return');
 if(back){back.setAttribute('aria-label',english?'Back':'Volver');back.querySelector('a').textContent=english?'← Back to game details':'← Volver a la ficha'}
 const route=document.querySelector('#route-strip');if(route)route.setAttribute('aria-label',english?'Chosen route':'Ruta elegida');
 document.querySelectorAll('#motion option').forEach((o,i)=>o.textContent=(english?['Normal','Reduced','No motion']:['Normal','Reducido','Sin movimiento'])[i]);
 if(document.querySelector('#title'))document.querySelector('#title').textContent=document.title.split(' · ')[0];
'''
            if 'const english=lang' not in text:
                text = text.replace('updateSceneState();\n}',labels+'updateSceneState();\n}',1) if slug == GAMES[0] else text.replace("$('#lang-es').setAttribute",labels+"$('#lang-es').setAttribute",1)
            text = text.replace('class="return" href="/'+gamebase+'/"', 'class="return" href="'+detail+'"')
            text = re.sub(r'<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>', '', text)
            text = text.replace('</title>',f'</title><link rel="canonical" href="https://irisgreen.eu/{gamebase}/{slug}/"><link rel="alternate" hreflang="es" href="https://irisgreen.eu/es/juegos/{slug}/"><link rel="alternate" hreflang="en" href="https://irisgreen.eu/en/games/{slug}/">',1)
            runtime.write_text(text,encoding='utf-8')
        title = 'Games' if en else 'Juegos'
        desc = 'Choose a game, read how it works and start when you are ready.' if en else 'Elige un juego, mira cómo funciona y entra cuando quieras.'
        body = '<main id="main"><h1>'+title+'</h1><p>'+desc+'</p><ul class="ig-activity-grid">'+''.join(cards)+'</ul></main>'
        hub = root/gamebase/'index.html'; hub.parent.mkdir(parents=True,exist_ok=True)
        hub.write_text(page_from(template,body,title,'/'+gamebase+'/','/'+peerbase+'/'),encoding='utf-8')
        # Existing Games links reach the same two-game inventory.
        legacy = root/base/('games' if en else 'juegos')/'index.html'
        legacy.write_text(page_from(template,body,title,'/'+gamebase+'/','/'+peerbase+'/'),encoding='utf-8')
        home = root/('en/index.html' if en else 'index.html')
        text = home.read_text(encoding='utf-8').replace('Pictograms and visual supports','Resources').replace('Pictogramas y apoyos visuales','Recursos').replace('Communicate, prepare routines and print visual supports.','Print routines, cut-out cards and boards.').replace('Comunica, prepara rutinas e imprime apoyos visuales.','Imprime rutinas, tarjetas para recortar y tableros.').replace('See visual supports →','See resources →').replace('Ver apoyos visuales →','Ver recursos →')
        text = text.replace('href="/'+base+'/games/"','href="/'+gamebase+'/"')
        home.write_text(text,encoding='utf-8')
    print('Resources: printable routines retained; two delivered games and details in ES/EN.')
