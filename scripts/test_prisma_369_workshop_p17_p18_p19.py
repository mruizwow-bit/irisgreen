#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import functools,threading,json,re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-workshop-p17-p18-p19';OUT.mkdir(parents=True,exist_ok=True)

PAGES=[
 ('es','/es/taller/','Tus proyectos','Guardar y abrir',
  'Para conservar un proyecto, abre Archivo dentro del estudio y elige «Guardar proyecto». Para retomarlo otro día, usa Archivo → Abrir.',
  ['Sin puntuaciones ni rankings.','Lo que haces no sale de tu dispositivo: lo guardas tú como archivo.']),
 ('en','/en/workshop/','Your projects','Save and open',
  'To keep a project, open File in the studio and choose “Save project”. To carry on another day, use File → Open.',
  ['No scores or rankings.','What you make never leaves your device: you keep it as a file.'])
]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def main():
    # P17 static production contract.
    js=(PUBLIC/'assets'/'ig-taller-r42.js').read_text(encoding='utf-8')
    fn=re.search(r'function moveSourceSections\(helpBody\)\{(.+?)\n  \}',js,re.S)
    assert fn,'moveSourceSections missing'
    body=fn.group(1)
    order=[
      ".igt-hero",
      '.igt-sec[aria-labelledby="igt-how"]',
      '.igt-sec[aria-labelledby="igt-x0"]',
      '.igt-sec[aria-labelledby="igt-files"]',
      'nav.igt-sec'
    ]
    positions=[body.index(x) for x in order]
    assert positions==sorted(positions),positions
    assert 'function addHelpShortcuts(helpBody,app)' in js
    assert "helpBody.insertBefore(sec,technical)" in js
    assert js.count("addHelpShortcuts(q('.ig42-dialog-body',helpDlg),app)")>=2

    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    cases=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for lang,route,summary,heading,copy,banned in PAGES:
          html=(PUBLIC/route.strip('/')/'index.html').read_text(encoding='utf-8')
          assert f'<summary>{summary}</summary>' in html,(lang,'summary')
          assert f'<h2>{heading}</h2>' in html,(lang,'heading')
          assert copy in html,(lang,'compact copy')
          for phrase in banned:
            assert phrase not in html,(lang,'repeated copy',phrase)
          assert 'class="igk-note"' not in html,(lang,'igk-note remains')

          for width,height in ((1440,1000),(390,844)):
            page=browser.new_page(viewport={'width':width,'height':height})
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            resp=page.goto(base+route,wait_until='networkidle')
            assert resp and resp.status==200,(lang,width,'route')
            panel=page.locator('.igk-collection')
            assert panel.count()==1
            closed=panel.bounding_box(); assert closed
            assert closed['width']<=738,(lang,width,'panel too wide',closed)
            assert closed['height']<=70,(lang,width,'closed panel too tall',closed)
            panel.locator('summary').click()
            page.wait_for_timeout(50)
            opened=panel.bounding_box(); assert opened
            assert opened['width']<=738,(lang,width,'open panel too wide',opened)
            assert opened['height']<=210,(lang,width,'open panel too tall',opened)
            main=page.locator('main').bounding_box(); assert main
            assert opened['x']>=main['x']-2 and opened['x']+opened['width']<=main['x']+main['width']+2,(lang,width,'panel outside grid',opened,main)
            assert not errors,(lang,width,'js',errors)
            if lang=='es':
              page.screenshot(path=str(OUT/f'projects-es-{width}.png'),full_page=False)
            cases.append({'lang':lang,'width':width,'closed_h':round(closed['height'],2),'open_h':round(opened['height'],2),'width_px':round(opened['width'],2)})
            page.close()
        browser.close()
    finally:
      server.shutdown()

    report={
      'gate':'ISSUE_369_P17_P18_P19_WORKSHOP_PASS',
      'p17':{'help_order':['what-it-is','how-to-use','keyboard-shortcuts','technical-detail','files-and-links'],'passed':True},
      'p18':{'project_panel_max_width_px':738,'open_max_height_px':210,'passed':True},
      'p19':{'repeated_launcher_copy':0,'passed':True},
      'cases':cases,
      'passed':True
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
