#!/usr/bin/env python3
"""Real keyboard/pointer tests; no replacement of game state or callbacks.
Non-modal reading/music panels permit Tab to leave; Escape returns to the opener.
External services blocked. This is not an accessibility certification.
"""
import argparse,functools,json,threading,re
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=ROOT/'reports/accessibility';OUT.mkdir(parents=True,exist_ok=True)
parser=argparse.ArgumentParser();parser.add_argument('--phase',choices=['before','after'],required=True);args=parser.parse_args()
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
R={'phase':args.phase,'panels':[],'picture_games':[],'failures':[],'notes':['Non-modal reading and music: Tab is not trapped; Escape returns to their opener.','Large equivalent controls use the same game callbacks. Original picture rectangles are deliberately not enlarged over neighbouring objects.','External requests blocked. Not a WCAG certification or a screen-reader listening test.']}
DYNAMIC=[p.relative_to(ROOT).as_posix() for p in [ROOT/'index.html',*sorted((ROOT/'es').rglob('*.html'))] if '<sc-if value="{{ a11yOpen }}"' in p.read_text()]
assert len(DYNAMIC)==25
STATIC=['es/neurodiversidad/condiciones/index.html','es/neurodiversidad/condiciones/abuso-y-explotacion/index.html','es/situaciones/index.html','es/intereses/index.html','es/sitio-tranquilo/index.html','en/neurodiversity/conditions/index.html']
PICTURES=['las-cinco-cosas','el-mapa-del-tesoro-de-casa']
def url(path):return '/'+path.removesuffix('index.html')
def rects(loc):return loc.evaluate_all('(els)=>els.map(e=>{let r=e.getBoundingClientRect();return {text:(e.getAttribute("aria-label")||e.textContent).trim(),x:r.x,y:r.y,w:r.width,h:r.height}})')
def check_box(p,panel):
 b=panel.bounding_box();w=p.evaluate('document.documentElement.clientWidth');h=p.evaluate('innerHeight')
 assert b and b['x']>=-1 and b['x']+b['width']<=w+1,('Panel clipped horizontally',b,w)
 assert b['y']>=-1 and b['y']+b['height']<=h+1,('Panel clipped vertically',b,h)
 return b

def run():
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  paths=(DYNAMIC+STATIC) if args.phase=='after' else ['index.html',STATIC[0]]+['es/recursos/juegos/'+n+'/index.html' for n in PICTURES]
  sizes=[1440,320] if args.phase=='after' else [320]
  for width in sizes:
   for path in paths:
    row={'page':url(path),'width':width};context=browser.new_context(viewport={'width':width,'height':844},reduced_motion='reduce');p=context.new_page();p.set_default_timeout(7000);errors=[];requests=[]
    p.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
    p.on('pageerror',lambda e:errors.append(str(e)));p.on('request',lambda req:requests.append(req.url) if '/audio/' in req.url and not req.url.endswith('.json') else None)
    try:
     p.goto(BASE+url(path),wait_until='domcontentloaded');p.locator('main h1').first.wait_for();p.wait_for_timeout(150)
     opener=p.locator('#a11yBtn:visible,.ig-uh-reading:visible').first;opener.focus();opener.press('Enter');p.wait_for_timeout(100)
     if args.phase=='before':
      panel=p.locator('#a11y:visible')
      if not panel.count():panel=p.locator('button').filter(has_text=re.compile('^×$')).last.locator('..').locator('..')
      row['box']=panel.bounding_box();row['focus_entered']=panel.evaluate('(e)=>e.contains(document.activeElement)');row['aria_expanded']=opener.get_attribute('aria-expanded')
      p.keyboard.press('Escape');p.wait_for_timeout(100);row['escape_closes']=not panel.is_visible()
      row['passed']=row['focus_entered'] and row['escape_closes'] and row['box']['x']>=0
     else:
      panel=p.locator('[data-ig-reading-panel]');panel.wait_for(state='visible');row['box']=check_box(p,panel)
      assert panel.get_attribute('role')=='region'
      title_id=panel.get_attribute('aria-labelledby');assert title_id and p.locator('#'+title_id).inner_text().strip()
      assert panel.evaluate('(e)=>e.contains(document.activeElement)'),'Focus did not enter Reading'
      assert opener.get_attribute('aria-expanded')=='true'
      toggle=panel.locator('button[aria-pressed]').first
      if toggle.count():
       before=toggle.get_attribute('aria-pressed');toggle.click();assert toggle.get_attribute('aria-pressed')!=before
      plus=panel.locator('button').filter(has_text=re.compile(r'^A\+$'))
      for _ in range(4):plus.click()
      row['enlarged_box']=check_box(p,panel)
      row['enlarged_content_overflow_px']=p.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')
      reset=panel.locator('button').filter(has_text=re.compile(r'^(Restablecer|Reset)$')).last
      reset.click();check_box(p,panel)
      close=panel.locator('[data-ig-reading-close]');cbox=close.bounding_box();assert cbox['width']>=44 and cbox['height']>=44
      focusables=panel.locator('button:visible,a[href]:visible,input:visible,select:visible')
      focusables.last.focus();p.keyboard.press('Tab');assert not panel.evaluate('(e)=>e.contains(document.activeElement)')
      p.keyboard.press('Escape');p.wait_for_timeout(60);assert not panel.is_visible();assert opener.evaluate('(e)=>e===document.activeElement');assert opener.get_attribute('aria-expanded')=='false'
      music=p.locator('#plBtn:visible,.ig-uh-music:visible,[data-ig-music]:visible').first
      music.focus();music.press('Space');m=p.locator('#ig-music-panel');m.wait_for(state='visible');row['music_box']=check_box(p,m)
      langs=p.locator('.ig-uh-langs button:visible')
      if langs.count():
       langs.filter(has_text=re.compile('^EN$')).click();p.wait_for_timeout(50)
       assert m.locator('.ig-m-controls button').all_text_contents()==['Previous','Play','Next']
       assert m.locator('summary').inner_text()=='Choose a track'
       assert m.locator('input[type=range]').get_attribute('aria-label')=='Volume'
       assert 'Repeat playlist' in m.locator('.ig-m-repeat').inner_text()
       langs.filter(has_text=re.compile('^ES$')).click();p.wait_for_timeout(50)
       assert m.locator('.ig-m-controls button').all_text_contents()==['Anterior','Escuchar','Siguiente']
       row['player_language_switch']=True
      opener.click();panel.wait_for(state='visible');assert not m.is_visible(),'Two overlapping panels'
      music.click();m.wait_for(state='visible');p.wait_for_timeout(50);assert not panel.is_visible(),'Reading remained over Music'
      assert m.evaluate('(e)=>e.contains(document.activeElement)')
      p.keyboard.press('Escape');assert not m.is_visible();assert music.evaluate('(e)=>e===document.activeElement')
      opener.click();panel.wait_for(state='visible');panel.locator('[data-ig-reading-close]').click();p.wait_for_timeout(60);assert not panel.is_visible();assert opener.evaluate('(e)=>e===document.activeElement')
      menu=p.locator('.ig-menu-button:visible')
      if menu.count():
       menu.focus();menu.press('Enter');assert menu.get_attribute('aria-expanded')=='true'
       nav=p.locator('header nav#ig-main-nav');assert nav.is_visible();nav.locator('a:visible').first.focus();p.keyboard.press('Escape');assert not nav.is_visible();assert menu.evaluate('(e)=>e===document.activeElement')
      assert not requests,'Audio preloaded without Play';assert not errors,errors
      row['passed']=True
    except Exception as e:row['passed']=False;row['error']=str(e);R['failures'].append(row.copy())
    row['javascript_errors']=errors;row['audio_requests']=requests;R['panels'].append(row);context.close()
    print(json.dumps({k:v for k,v in row.items() if k!='audio_requests'},ensure_ascii=False),flush=True)
  if args.phase=='after':
   for width in [1440,390,320]:
    for lang in ['es','en']:
     for slug in PICTURES:
      row={'game':slug,'width':width,'language':lang};ctx=browser.new_context(viewport={'width':width,'height':844},reduced_motion='reduce');p=ctx.new_page();p.set_default_timeout(7000)
      p.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
      try:
       p.goto(BASE+'/es/recursos/juegos/'+slug+'/',wait_until='domcontentloaded');p.locator('main h1').first.wait_for();p.locator('.ig-uh-langs button').filter(has_text=re.compile('^'+lang.upper()+'$')).click()
       target=p.locator('main .ig-picture-target');before=rects(target)
       details=p.locator('.ig-touch-alternative');summary=details.locator('summary');summary.focus();summary.press('Space')
       buttons=details.locator('.ig-touch-choices>button');assert buttons.count()==(5 if slug=='las-cinco-cosas' else 8)
       row['buttons']=rects(buttons)
       assert all(r['w']>=44 and r['h']>=44 for r in row['buttons'])
       for i,a in enumerate(row['buttons']):
        for b in row['buttons'][i+1:]:assert min(a['x']+a['w'],b['x']+b['w'])<=max(a['x'],b['x'])+.5 or min(a['y']+a['h'],b['y']+b['h'])<=max(a['y'],b['y'])+.5,'Overlapping alternative controls'
       if slug=='las-cinco-cosas':
        target.nth(0).click();assert buttons.nth(0).get_attribute('aria-pressed')=='true'
        for i in range(1,5):buttons.nth(i).focus();buttons.nth(i).press('Enter')
       else:
        buttons.nth(3).click();assert buttons.nth(3).get_attribute('aria-pressed')=='true'
        p.get_by_role('button',name='Sitio de carga' if lang=='es' else 'Heavy place',exact=True).click()
        buttons.nth(0).focus();buttons.nth(0).press('Space')
        p.get_by_role('button',name='Los adultos' if lang=='es' else 'The adults',exact=True).click()
        assert buttons.nth(3).get_attribute('aria-pressed')=='false'
        buttons.nth(3).click();buttons.nth(0).click()
       assert p.locator('main a[href*="#carta-"]:visible').count()==1
       p.get_by_role('button',name='Empezar otra vez' if lang=='es' else 'Start again',exact=True).click()
       assert not p.locator('main a[href*="#carta-"]:visible').count()
       assert not details.locator('button[aria-pressed=true]').count()
       after=rects(target)
       assert [(round(x['w'],1),round(x['h'],1)) for x in before]==[(round(x['w'],1),round(x['h'],1)) for x in after],'Original rectangles changed'
       assert p.locator('main img').first.evaluate('(e)=>e.complete&&e.naturalWidth>1')
       summary.evaluate('(e)=>e.scrollIntoView({block:"center"})')
       if width in [390,320] and lang=='es':p.screenshot(path=str(OUT/f'touch-{slug}-{width}.png'),full_page=False)
       row['same_game_completed_and_reset']=True;row['original_geometry_preserved']=True;row['passed']=True
      except Exception as e:row['passed']=False;row['error']=str(e);R['failures'].append(row.copy())
      R['picture_games'].append(row);ctx.close();print(json.dumps({k:v for k,v in row.items() if k!='buttons'},ensure_ascii=False),flush=True)
  browser.close()
 R['summary']={'panels_tested':len(R['panels']),'panels_passed':sum(x['passed'] for x in R['panels']),'picture_scenarios':len(R['picture_games']),'picture_passed':sum(x['passed'] for x in R['picture_games'])};R['passed']=not R['failures']
 (OUT/(args.phase+'.json')).write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n')
 if args.phase=='after' and not R['passed']:raise SystemExit(1)
try:run()
finally:server.shutdown()
