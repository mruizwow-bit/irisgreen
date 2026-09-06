#!/usr/bin/env python3
"""Exercise real game controls. Selectors are added only to HTML served by the test
server; no game logic/state is replaced, and source files are not instrumented.
External domains are blocked. This tests functionality, not pedagogical claims.
"""
from __future__ import annotations
import argparse, functools, hashlib, html, json, re, shutil, threading
from collections import Counter
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT=Path.cwd(); OUT=ROOT/'reports/games'; OUT.mkdir(parents=True,exist_ok=True)
parser=argparse.ArgumentParser();parser.add_argument('--phase',default='before');parser.add_argument('--full',action='store_true');args=parser.parse_args()
PREFIX='/es/recursos/juegos/'
GAME_FILES=sorted(p for p in (ROOT/PREFIX.strip('/')).glob('*/index.html') if p.parent.name!='coleccion')
assert len(GAME_FILES)==13

class Markers(HTMLParser):
    void={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    def __init__(self,text):
        super().__init__(convert_charrefs=False);self.text=text;self.stack=[];self.edits=[];self.lines=[0]
        for line in text.splitlines(keepends=True):self.lines.append(self.lines[-1]+len(line))
        self.feed(text);self.close()
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);start=self.lines[self.getpos()[0]-1]+self.getpos()[1];raw=self.get_starttag_text()
        if tag in {'button','textarea','input'}:
            expr=a.get('sc-camel-on-click') or a.get('sc-camel-on-change')
            if expr:
                action=expr.strip().removeprefix('{{').removesuffix('}}').strip()
                loop=next((v.get('list','') for t,v in reversed(self.stack) if t=='sc-for'),'').strip().removeprefix('{{').removesuffix('}}').strip()
                extra=' data-ig-test-action="'+html.escape(action,quote=True)+'" data-ig-test-list="'+html.escape(loop,quote=True)+'"'
                self.edits.append((start+len(raw)-1,extra))
        if tag not in self.void:self.stack.append((tag,a))
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag:del self.stack[i:];break
    def marked(self):
        text=self.text
        for pos,extra in sorted(self.edits,reverse=True):text=text[:pos]+extra+text[pos:]
        return text

class Server(SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
    def do_GET(self):
        path=Path(self.translate_path(self.path))
        if path.is_dir():path=path/'index.html'
        if path.is_file() and path.suffix=='.html' and '/es/recursos/juegos/' in str(path):
            data=Markers(path.read_text()).marked().encode()
            self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
        else:super().do_GET()
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Server,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
REPORT={'phase':args.phase,'static':{},'games':[],'collections':[],'letters':[],'failures':[],'notes':['Real button/keyboard input, not direct game-state manipulation.','Only inert test selectors are added by the HTTP server.','Images are requested locally, with external domains blocked.','Not a clinical or pedagogical assessment; print games are checked as materials, not simulated as digital games.']}


def statics():
    data=json.loads((ROOT/'es/recursos/juegos/juegos-120.json').read_text());ids=[];missing=[];bad=[]
    for item in data['juegos']:
        ids.append(item['id']);p=ROOT/item['imagen']['archivoWeb'].lstrip('/')
        if not p.is_file():missing.append(str(p.relative_to(ROOT)))
        else:
            try:
                from PIL import Image
                with Image.open(p) as im:im.verify()
            except Exception as e:bad.append({'path':str(p.relative_to(ROOT)),'error':str(e)})
    docs=list((ROOT/'es/recursos/juegos/coleccion').glob('*/index.html'));html_ids=[]
    for p in docs:
        s=BeautifulSoup(p.read_text(),'html.parser');html_ids.extend(x.get('id','').upper() for x in s.select('main article.card'))
    assert len(ids)==data['total']==130 and len(set(ids))==130
    assert Counter(ids)==Counter(html_ids),'Collection HTML IDs do not match the JSON'
    REPORT['static']={'interactive_games':len(GAME_FILES),'collection_families':len(docs),'collection_games':len(ids),'image_references':len(ids),'unique_collection_images':len({x['imagen']['archivoWeb'] for x in data['juegos']}),'missing_images':missing,'invalid_images':bad,'source_sha256':{p.relative_to(ROOT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in GAME_FILES}}
    return docs


def actions(page,action,loop=None):
    sel='[data-ig-test-action="'+action+'"]'
    if loop is not None:sel+='[data-ig-test-list="'+loop+'"]'
    return page.locator('main '+sel+':visible')


def click(page,action,loop=None,n=0,keyboard=False):
    obj=actions(page,action,loop).nth(n)
    if keyboard:obj.focus();obj.press('Enter')
    else:obj.click()


def exercise(page,slug):
    resets=True
    if slug in {'el-detective-de-los-sentidos','el-archivo-de-capacidades','la-maquina-de-empezar'}:
        total=6 if slug=='la-maquina-de-empezar' else 12
        assert actions(page,'c.pick','pending').count()==total
        for n in range(total):
            click(page,'c.pick','pending',keyboard=n==0)
            if slug!='la-maquina-de-empezar':click(page,'b.pick','baskets' if slug=='el-detective-de-los-sentidos' else 'trays',n=n%(3 if slug=='el-detective-de-los-sentidos' else 2))
        assert actions(page,'c.pick','pending').count()==0
    elif slug=='las-cinco-cosas':
        for n in range(5):click(page,'s.click','spots',n=n,keyboard=n==0)
    elif slug=='donde-se-fue-la-energia':
        for n in range(10):
            click(page,'t.click','tray',keyboard=n==0);click(page,'d.click','days',n=n%7)
        assert actions(page,'t.click','tray').count()==0
    elif slug=='cada-cerebro-su-camino':
        for n in range(3):click(page,'c.pick','probChips',n=n);click(page,'p.pick','paths',n=n,keyboard=n==0)
        resets=False
    elif slug=='el-aula-al-reves':
        assert actions(page,'o.pick','it.options').count()==51
        for n in range(17):click(page,'o.pick','it.options',n=n*3+(n%3),keyboard=n==0)
    elif slug=='el-mapa-del-tesoro-de-casa':
        click(page,'r.click','rooms',n=0,keyboard=True);click(page,'p.pick','pens',n=1);click(page,'r.click','rooms',n=1)
        click(page,'p.pick','phases',n=1)
        click(page,'r.click','rooms',n=0);click(page,'r.click','rooms',n=1)
    elif slug in {'el-traductor-de-casa','el-traductor-de-instrucciones'}:
        assert page.locator('main textarea:visible').count()==8
        for n in range(8):
            page.locator('main textarea:visible').nth(n).fill('Pongo dos libros en la mesa '+str(n+1))
            if slug=='el-traductor-de-casa':
                click(page,'o.pick','r.scores',n=n*2);click(page,'r.toggleExample','rows',n=n);click(page,'r.keep','rows',n=n)
            else:click(page,'r.useExample','rows',n=n)
    elif slug=='la-cena-de-los-planes':
        page.locator('main input:visible').nth(0).fill('Paseo de prueba')
        click(page,'addPerson');click(page,'addPerson')
        assert actions(page,'addPerson').is_disabled()
        for who in range(4):
            click(page,'p.pick','people',n=who)
            page.locator('main input:visible').nth(1).fill('Persona '+str(who+1))
            for n in range(3):click(page,'c.pick','cards',n=n)
            if who<3:assert not page.locator('main a[href*="#carta-"]:visible').count()
    elif slug=='la-consulta':
        for _ in range(11):
            if not actions(page,'roll').count():break
            click(page,'roll')
        assert not actions(page,'roll').count()
    elif slug=='palabra-misteriosa':
        rounds=0
        while actions(page,'o.pick','options').count() and rounds<16:
            click(page,'o.pick','options',keyboard=rounds==0)
            if rounds<3:click(page,'keep')
            click(page,'next');rounds+=1
        assert rounds==15,rounds
    else:raise AssertionError('No complete play-through defined for '+slug)
    carta=page.locator('main a[href*="#carta-"]:visible')
    assert carta.count()==1,'The end-of-game letter link did not appear'
    result={'completed':True,'letter_href':carta.get_attribute('href')}
    if resets:
        click(page,'reset')
        assert not page.locator('main a[href*="#carta-"]:visible').count(),'Reset did not clear completion'
        result['reset']=True
    else:result['reset']='No reset control in this game; paths are reselectable.'
    return result


def inspect_images(page):
    page.locator('main img').evaluate_all('(els)=>els.forEach(e=>e.loading="eager")')
    page.wait_for_timeout(200)
    try:page.wait_for_function('Array.from(document.querySelectorAll("main img")).every(e=>e.complete)',timeout=8000)
    except Exception:pass
    return page.locator('main img').evaluate_all('(els)=>els.filter(e=>!e.complete||!e.naturalWidth||e.naturalWidth===1).map(e=>({src:e.currentSrc||e.src,alt:e.alt,width:e.naturalWidth}))')


def geometry(page):
    return page.evaluate('''()=>({overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),smallTargets:[...document.querySelectorAll('main button')].filter(e=>{let r=e.getBoundingClientRect();return r.width&&r.height&&(r.width<43||r.height<43)}).map(e=>({text:(e.getAttribute('aria-label')||e.textContent).trim().slice(0,100),w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),offenders:[...document.querySelectorAll('main *')].filter(e=>{let r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+2&&getComputedStyle(e).position!=='fixed'}).slice(0,6).map(e=>e.outerHTML.slice(0,240))})''')


def run():
    docs=statics()
    modes=[(1440,'es'),(320,'es')] if not args.full else [(1440,'es'),(390,'es'),(320,'es'),(390,'en')]
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for width,lang in modes:
            for p in GAME_FILES:
                slug=p.parent.name;row={'game':slug,'width':width,'language':lang};errs=[];bad=[]
                ctx=browser.new_context(viewport={'width':width,'height':900},accept_downloads=True);page=ctx.new_page();page.set_default_timeout(8000)
                page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
                page.on('pageerror',lambda e:errs.append(str(e)))
                page.on('response',lambda r:bad.append({'path':urlsplit(r.url).path,'status':r.status}) if r.url.startswith(BASE) and r.status>=400 else None)
                try:
                    page.goto(BASE+PREFIX+slug+'/?lang='+lang,wait_until='domcontentloaded');page.locator('main h1').first.wait_for();page.wait_for_timeout(100)
                    # All games share the explicit language control, even if a URL query is unsupported.
                    page.locator('.ig-uh-langs button:visible').filter(has_text=re.compile('^'+lang.upper()+'$')).click()
                    assert page.evaluate('document.documentElement.lang').startswith(lang)
                    row['initial_geometry']=geometry(page);row['image_errors']=inspect_images(page)
                    page.screenshot(path=str(OUT/f'{args.phase}-{slug}-{width}-{lang}.png'))
                    row['playthrough']=exercise(page,slug)
                    row['final_geometry']=geometry(page);row['image_errors']+=inspect_images(page)
                    assert not errs,errs
                    assert not bad,bad[:4]
                    assert not row['image_errors'],row['image_errors'][:4]
                    assert row['initial_geometry']['overflow']<=2 and row['final_geometry']['overflow']<=2,'Horizontal overflow'
                    row['passed']=True
                except Exception as e:
                    row['passed']=False;row['error']=str(e);REPORT['failures'].append({'game':slug,'width':width,'language':lang,'error':str(e)})
                row['javascript_errors']=errs;row['http_errors']=bad;REPORT['games'].append(row);ctx.close()
                print(json.dumps({k:v for k,v in row.items() if k not in {'initial_geometry','final_geometry','image_errors'}},ensure_ascii=False),flush=True)
        for width in [1440,320]:
            for p in docs:
                row={'family':p.parent.name,'width':width};ctx=browser.new_context(viewport={'width':width,'height':900});page=ctx.new_page();page.set_default_timeout(8000)
                page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
                try:
                    page.goto(BASE+PREFIX+'coleccion/'+p.parent.name+'/',wait_until='domcontentloaded')
                    assert page.locator('main article.card').count()==10
                    row['image_errors']=inspect_images(page);row['geometry']=geometry(page)
                    row['tabs']=page.locator('main .tabs a').evaluate_all('(els)=>els.map(e=>({label:e.textContent.trim(),right:e.getBoundingClientRect().right,left:e.getBoundingClientRect().left}))')
                    assert not row['image_errors'],row['image_errors'][:3]
                    assert row['geometry']['overflow']<=2,'Horizontal overflow'
                    assert all(0<=t['left'] and t['right']<=width for t in row['tabs']),'Hidden collection tabs'
                    row['passed']=True
                except Exception as e:row['passed']=False;row['error']=str(e);REPORT['failures'].append(row.copy())
                REPORT['collections'].append(row);ctx.close()
        # Verify the complete letter route from all thirteen games, not only the menu.
        ctx=browser.new_context(viewport={'width':390,'height':900},accept_downloads=True);page=ctx.new_page();page.set_default_timeout(8000)
        page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
        for p in GAME_FILES:
            slug=p.parent.name;row={'game':slug}
            try:
                page.goto('about:blank')
                page.goto(BASE+PREFIX+'#carta-'+slug,wait_until='domcontentloaded')
                fields=page.locator('textarea[data-ig-test-list="cardFields"]:visible');fields.first.wait_for()
                row['fields']=fields.count()
                row['title']=page.locator('#ig-game-letter-title').inner_text()
                assert page.locator('#ig-game-letter').evaluate('(e)=>e.contains(document.activeElement)')
                for _ in range(fields.count()+5):
                    page.keyboard.press('Tab')
                    assert page.locator('#ig-game-letter').evaluate('(e)=>e.contains(document.activeElement)')
                for i in range(fields.count()):fields.nth(i).fill('Texto de prueba '+str(i+1))
                with page.expect_download() as event:page.locator('[data-ig-test-action="downloadFilled"]:visible').click()
                download=event.value;dest=OUT/(slug+'-letter.png');download.save_as(dest)
                from PIL import Image
                with Image.open(dest) as im:row['download_size']=[im.width,im.height];assert im.width>=500 and im.height>=500
                assert dest.stat().st_size>1000
                row['escape_closes']=None
                page.keyboard.press('Escape');row['escape_closes']=not fields.count()
                assert row['escape_closes'],'Escape must close the letter'
                assert not page.locator('main').evaluate('(e)=>e.inert'),'Background left inert'
                row['passed']=True
            except Exception as e:row['passed']=False;row['error']=str(e);REPORT['failures'].append({'letter':slug,'error':str(e)})
            REPORT['letters'].append(row)
        ctx.close();browser.close()
    REPORT['passed']=not REPORT['failures'] and not REPORT['static']['missing_images'] and not REPORT['static']['invalid_images']
    REPORT['summary']={'games_passed':sum(r['passed'] for r in REPORT['games']),'games_tested':len(REPORT['games']),'collections_passed':sum(r['passed'] for r in REPORT['collections']),'collections_tested':len(REPORT['collections']),'letters_passed':sum(r['passed'] for r in REPORT['letters']),'letters_tested':len(REPORT['letters'])}
    (OUT/f'games-{args.phase}.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'summary':REPORT['summary'],'failures':REPORT['failures']},ensure_ascii=False),flush=True)
    if not REPORT['passed']:raise SystemExit(1)

try:run()
finally:server.shutdown()
