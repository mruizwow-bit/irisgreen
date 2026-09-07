#!/usr/bin/env python3
"""Diagnóstico reproducible del audio real, sin sustituir ni modificar las pistas."""
import functools
import json
import shutil
import subprocess
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

ROOT=Path.cwd(); OUT=ROOT/'reports'; OUT.mkdir(exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
result={'files':[], 'browsers':[], 'notes':['No se cambia ningún archivo de música. Se prueban pistas existentes.']}
for name in ['un-momento-de-calma.m4a','atmosfera.mp3']:
    p=ROOT/'audio'/name
    info={'path':str(p.relative_to(ROOT)),'exists':p.is_file()}
    if p.exists():
        info['bytes']=p.stat().st_size
        info['signature']=p.read_bytes()[:32].hex()
        if shutil.which('ffprobe'):
            proc=subprocess.run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(p)],capture_output=True,text=True,timeout=20)
            info['ffprobe_code']=proc.returncode
            info['ffprobe']=json.loads(proc.stdout) if proc.stdout.strip().startswith('{') else proc.stderr
    result['files'].append(info)
with sync_playwright() as pw:
    configs=[('chromium',{})]
    chrome=shutil.which('google-chrome') or shutil.which('google-chrome-stable')
    if chrome:configs.append(('installed-chrome',{'executable_path':chrome}))
    for label,opts in configs:
        browser=pw.chromium.launch(**opts)
        for track in ['player-first-track','/audio/atmosfera.mp3']:
            row={'browser':label,'track':track,'network':[],'errors':[]}
            context=browser.new_context(viewport={'width':1440,'height':1000});page=context.new_page()
            page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
            page.on('response',lambda r:row['network'].append({'path':urlsplit(r.url).path,'status':r.status,'type':r.headers.get('content-type')}) if '/audio/' in r.url else None)
            page.on('pageerror',lambda e:row['errors'].append(str(e)))
            page.add_init_script('''window.igAudio=null;window.igPlayError=null;const orig=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.igAudio=this;const p=orig.apply(this,arguments);p.catch(e=>window.igPlayError={name:e.name,message:e.message});return p;}''')
            page.goto(BASE+'/',wait_until='domcontentloaded');page.locator('main h1').first.wait_for()
            row['supported']=page.evaluate('''()=>{const a=document.createElement('audio');return {aac:a.canPlayType('audio/mp4; codecs="mp4a.40.2"'),mp3:a.canPlayType('audio/mpeg'),agent:navigator.userAgent}}''')
            try:
                if track=='player-first-track':
                    page.locator('#plBtn:visible,.ig-uh-music:visible,[data-ig-music]:visible').first.click()
                    page.locator('#ig-music-panel .ig-m-play').click()
                else:
                    page.evaluate('''path=>{const b=document.createElement('button');b.id='ig-test-sound';b.textContent='Play test track';b.onclick=()=>{const a=new Audio();a.src=path;a.play().catch(()=>{});};document.body.prepend(b)}''',track)
                    page.locator('#ig-test-sound').click()
                page.wait_for_function('window.igPlayError || (window.igAudio && (window.igAudio.error || window.igAudio.currentTime>0))',timeout=10000)
            except Exception as e:row['wait_error']=str(e)
            row['media']=page.evaluate('''()=>{const a=window.igAudio;return {promiseError:window.igPlayError,exists:!!a,src:a?.src,ready:a?.readyState,network:a?.networkState,paused:a?.paused,time:a?.currentTime,duration:Number.isFinite(a?.duration)?a.duration:null,error:a?.error?{code:a.error.code,message:a.error.message}:null,status:document.querySelector('.ig-m-status')?.textContent}}''')
            row['played']=bool(row['media'].get('time',0)>0 and not row['media'].get('paused',True))
            result['browsers'].append(row);context.close()
        browser.close()
server.shutdown()
(OUT/'audio-diagnostic.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False))
