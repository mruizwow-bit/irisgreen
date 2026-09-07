#!/usr/bin/env python3
"""Use native controls and Tab, preserving the actual media play implementation.
Font availability and assistive hardware are not inferred from computed styles.
"""
import argparse,functools,hashlib,json,os,re,shutil,threading,traceback
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=Path(os.environ.get('IG_TEST_OUT',str(ROOT/'reports/text-preferences')));OUT.mkdir(parents=True,exist_ok=True)
parser=argparse.ArgumentParser();parser.add_argument('--phase',choices=['baseline','base','after'],default='after');args=parser.parse_args()
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
PATHS=['/','/es/neurodiversidad/condiciones/','/es/neurodiversidad/condiciones/autismo/','/en/neurodiversity/conditions/autism/','/es/recursos/juegos/las-cinco-cosas/','/es/intereses/','/es/videos/']
R={'phase':args.phase,'cases':[],'failures':[],'notes':['Tested on the generated public files, with external domains blocked.','Text selectors are native select controls with labels.','Keyboard traversal uses Tab/Shift+Tab; no focus() or synthetic page-state completion.','Audio uses the real local MP3 and original play() call; time advancing is checked, not physical loudspeaker audibility.','Computed font stacks do not guarantee that a proprietary device font is installed.']}
SPY='''window.__igAudio=null;window.__igSpeech=0;const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__igAudio=this;return play.apply(this,arguments);};if(window.SpeechSynthesis){const say=SpeechSynthesis.prototype.speak;SpeechSynthesis.prototype.speak=function(u){window.__igSpeech++;return say.call(this,u);};}'''
def result(row,fn):
 try:fn();row['passed']=True
 except Exception as e:row.update(passed=False,error=str(e),traceback=traceback.format_exc());R['failures'].append(row.copy())
 R['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)
def load(p,path):
 p.goto(BASE+path,wait_until='domcontentloaded');p.locator('main h1').first.wait_for();p.wait_for_timeout(220)
def panel(p):
 p.locator('#a11yBtn:visible,.ig-uh-reading:visible').first.click();el=p.locator('[data-ig-reading-panel]');el.wait_for(state='visible');p.wait_for_timeout(60);return el
def tab_to(p,selector,key='Tab',limit=100):
 for n in range(limit):
  p.keyboard.press(key);p.wait_for_timeout(25)
  if p.evaluate('(s)=>document.activeElement?.matches(s)',selector):return n+1
 raise AssertionError('Tab did not reach '+selector)
def main_text(p):return re.sub(r'\s+',' ',p.locator('main').inner_text()).strip()
def metrics(p):
 return p.locator('main p').first.evaluate('(e)=>{let s=getComputedStyle(e),r=e.getBoundingClientRect();return {font:s.fontFamily,letter:s.letterSpacing,word:s.wordSpacing,line:s.lineHeight,size:s.fontSize,paragraph:s.marginBottom,width:r.width}}')
def stored(p):return p.evaluate('IGPreferences.getText()')
def geometry(p):
 return p.evaluate('({overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),header:document.querySelector("header").getBoundingClientRect().height})')
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 def context(width=390):
  c=browser.new_context(viewport={'width':width,'height':900},accept_downloads=True)
  c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
  c.add_init_script(SPY);return c
 if args.phase=='baseline':
  snap={}
  for path in PATHS:
   c=context();p=c.new_page();load(p,path);snap[path]={'text':hashlib.sha256(main_text(p).encode()).hexdigest(),'metrics':metrics(p),'header':geometry(p)['header']};c.close()
  (OUT/'baseline-values.json').write_text(json.dumps(snap,ensure_ascii=False,indent=2));print('Baseline saved')
 elif args.phase=='base':
  for width in [1440,320]:
   for path in ['/','/es/neurodiversidad/condiciones/','/es/recursos/juegos/las-cinco-cosas/']:
    c=context(width);p=c.new_page();row={'test':'real Tab traversal','path':path,'width':width}
    def keyboard():
     load(p,path);row['visited']=[]
     for n in range(65):
      p.keyboard.press('Tab');p.wait_for_timeout(30)
      item=p.evaluate('''()=>{const e=document.activeElement;if(!e||e===document.body)return null;const r=e.getBoundingClientRect();const x=Math.max(0,Math.min(innerWidth-1,r.left+r.width/2)),y=Math.max(0,Math.min(innerHeight-1,r.top+r.height/2));const hit=document.elementFromPoint(x,y);return {tag:e.tagName,id:e.id,label:(e.getAttribute('aria-label')||e.innerText||e.getAttribute('placeholder')||'').slice(0,90),width:r.width,height:r.height,visible:r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight,uncovered:!!hit&&(hit===e||e.contains(hit)||hit.contains(e)),hit:hit?.outerHTML.slice(0,180)}}''')
      if item:
       row['visited'].append(item)
       assert item['visible'] and item['uncovered'],item
     assert len(row['visited'])>=30
    result(row,keyboard);c.close()
  for width in [1440,320]:
   for path in ['/','/es/neurodiversidad/condiciones/']:
    c=context(width);p=c.new_page();row={'test':'playing track while panel collapses','width':width,'path':path}
    def audio():
     load(p,path);tab_to(p,'#plBtn,.ig-uh-music,[data-ig-music]');p.keyboard.press('Enter')
     music=p.locator('#ig-music-panel');music.wait_for(state='visible')
     tab_to(p,'#ig-music-panel summary');p.keyboard.press('Space')
     tab_to(p,'#ig-music-panel [data-track="9"]');p.keyboard.press('Enter')
     p.wait_for_function('window.__igAudio && !window.__igAudio.paused && window.__igAudio.currentTime>.3',timeout=15000)
     row['source']=p.evaluate('new URL(window.__igAudio.src).pathname');before=p.evaluate('window.__igAudio.currentTime')
     p.keyboard.press('Escape');assert not music.is_visible();p.wait_for_timeout(500)
     assert p.evaluate('!window.__igAudio.paused && window.__igAudio.currentTime')>before
     row['escape_keeps_playing']=True
     p.keyboard.press('Enter');music.wait_for(state='visible')
     # Natural sequential focus must reach an overlapping external control.
     before=p.evaluate('window.__igAudio.currentTime');collapsed=False
     for n in range(150):
      p.keyboard.press('Tab');p.wait_for_timeout(30)
      if not music.is_visible():collapsed=True;row['tab_steps_to_auto_collapse']=n+1;break
     assert collapsed,'No automatic collapse encountered in this traversal'
     p.wait_for_timeout(300);assert p.evaluate('!window.__igAudio.paused && window.__igAudio.currentTime')>before
     row['focus_collapse_keeps_playing']=True
     assert p.evaluate('document.activeElement!==document.body')
     p.locator('#plBtn:visible,.ig-uh-music:visible,[data-ig-music]:visible').first.click();music.wait_for(state='visible');music.locator('.ig-m-play').click();assert p.evaluate('window.__igAudio.paused')
    result(row,audio);c.close()
 else:
  baseline=json.loads((OUT/'baseline-values.json').read_text())
  for width in [1440,390,320]:
   for path in PATHS:
    c=context(width);p=c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)));row={'test':'independent settings and reset','path':path,'width':width}
    def adjustments():
     load(p,path);before=metrics(p);geo=geometry(p);text=main_text(p)
     assert hashlib.sha256(text.encode()).hexdigest()==baseline[path]['text'],'Main content changed'
     if width==390:assert before==baseline[path]['metrics'],(before,baseline[path]['metrics'])
     el=panel(p);el.locator('[data-ig-text-settings] summary').click()
     expected={'font':'original','letter':None,'word':None,'line':None,'paragraph':None,'width':'original'}
     for k,v in [('font','sans'),('letter',.12),('word',.16),('line',1.5),('paragraph',2),('width','narrow')]:
      ctl=el.locator('[data-ig-text-key="'+k+'"]');assert ctl.evaluate('(e)=>e.labels.length===1')
      ctl.select_option(str(v));expected[k]=v;assert stored(p)==expected,(k,stored(p),expected)
     row['independent_values']=stored(p);after=metrics(p)
     assert after['font'].startswith('Arial');size=float(after['size'].removesuffix('px'))
     for key,mult in [('letter',.12),('word',.16),('line',1.5),('paragraph',2)]:assert abs(float(after[key].removesuffix('px'))-size*mult)<.2,(key,after)
     assert geometry(p)['header']==geo['header'],'Header size changed'
     assert geometry(p)['overflow']<=2,geometry(p)
     for font in ['wide','serif']:
      el.locator('[data-ig-text-key="font"]').select_option(font);assert stored(p)['letter']==.12
     # The original size control is retained and combined with all new settings.
     plus=el.get_by_role('button',name=re.compile(r'A\+|Tamaño del texto \+|Text size \+')).first
     while plus.is_enabled():plus.click()
     assert p.evaluate('IGPreferences.get().scale')==1.5
     assert geometry(p)['overflow']<=2,geometry(p)
     page_state=p.evaluate('IGPreferences.get()');p.keyboard.press('Escape');p.reload();p.locator('main h1').first.wait_for();p.wait_for_timeout(150)
     assert p.evaluate('IGPreferences.get()')==page_state
     el=panel(p);el.locator('[data-ig-text-settings] summary').click();assert el.locator('select').count()==6
     for control in el.locator('[data-ig-text-settings] select:visible,[data-ig-text-settings] button:visible').all():
      control.scroll_into_view_if_needed();a=control.bounding_box();b=el.bounding_box();assert a['x']>=b['x'] and a['x']+a['width']<=b['x']+b['width']+1
      if control.evaluate('(e)=>e.tagName')=='SELECT':
       caption=control.evaluate('(e)=>{const s=getComputedStyle(e),c=document.createElement("canvas").getContext("2d");c.font=s.font;return {label:e.selectedOptions[0].textContent,needed:c.measureText(e.selectedOptions[0].textContent).width,available:e.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)-24}}')
       assert caption['needed']<=caption['available'],caption
     el.locator('[data-ig-text-settings]').evaluate('(e)=>e.scrollIntoView({block:"start"})')
     if path in ['/','/es/neurodiversidad/condiciones/autismo/']:
      p.screenshot(path=str(OUT/f'text-panel-{path.strip("/").replace("/","-") or "home"}-{width}.png'))
     el.locator('[data-ig-text-reset]').click();assert stored(p)=={'font':'original','letter':None,'word':None,'line':None,'paragraph':None,'width':'original'};assert p.evaluate('IGPreferences.get().scale')==1.5
     reset=el.locator('[data-a="reset"],button[sc-camel-on-click]').filter(has_text=re.compile('^Restablecer$|^Reset$')).first
     if not reset.count():reset=el.get_by_role('button',name=re.compile('^Restablecer$|^Reset$')).first
     reset.click();p.keyboard.press('Escape');assert metrics(p)==before,(metrics(p),before)
     assert geometry(p)['header']==geo['header'];assert main_text(p)==text
     assert p.evaluate('window.__igSpeech')==0;assert not errors,errors
     row.update(persisted=True,reset_exactly_restores_original=True,no_auto_speech=True,combined_150_percent=True)
    result(row,adjustments);c.close()
  # Real native-select keyboard input, then a cross-family route with shared settings.
  c=context(320);p=c.new_page();row={'test':'keyboard selects, route and two tabs'}
  def journey():
   load(p,'/');tab_to(p,'.ig-uh-reading,#a11yBtn');p.keyboard.press('Enter');tab_to(p,'[data-ig-text-settings] summary');p.keyboard.press('Space');p.keyboard.press('Tab')
   assert p.evaluate('document.activeElement.dataset.igTextKey')=='font';p.keyboard.press('ArrowDown');p.keyboard.press('Enter');assert stored(p)['font']=='sans'
   for path in ['/es/neurodiversidad/condiciones/','/es/neurodiversidad/condiciones/autismo/','/es/recursos/juegos/las-cinco-cosas/','/es/intereses/','/en/neurodiversity/conditions/autism/']:
    load(p,path);assert stored(p)['font']=='sans';assert geometry(p)['overflow']<=2
   el=panel(p);assert el.locator('[data-ig-text-settings] summary').inner_text()=='Typeface, spacing and reading width';el.locator('summary').click()
   other=c.new_page();load(other,'/es/situaciones/');el.locator('[data-ig-text-key="word"]').select_option('0.24');other.wait_for_function('IGPreferences.getText().word===.24');assert p.evaluate('window.__igSpeech')==0;assert other.evaluate('window.__igSpeech')==0
   row['shared_values']=stored(other);other.close()
  result(row,journey);c.close()
  for fixture in [{'font':'remote-url','line':100,'letter':-.4,'word':'bad','paragraph':None,'width':'http://example.org'},'bad',None]:
   c=context();p=c.new_page();row={'test':'invalid new preference','fixture':fixture}
   def malformed():
    c.add_init_script('localStorage.setItem("ig-a11y",'+json.dumps(json.dumps({'version':2,'text':fixture}))+');');load(p,'/');x=stored(p);assert x['font']=='original' and x['width']=='original';assert x['line'] in (None,2.4);assert x['letter'] in (None,0);assert p.evaluate('window.__igSpeech')==0
   result(row,malformed);c.close()
 browser.close()
server.shutdown();R['passed']=not R['failures'];R['summary']={'tested':len(R['cases']),'passed':sum(x['passed'] for x in R['cases'])}
(OUT/(args.phase+'.json')).write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'summary':R['summary'],'passed':R['passed']},ensure_ascii=False))
if not R['passed']:raise SystemExit(1)
