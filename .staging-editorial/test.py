import json, os, subprocess, time
from pathlib import Path
from playwright.sync_api import sync_playwright
out=Path('/tmp/iris-editorial-tests');out.mkdir(exist_ok=True)
base=os.environ.get('BASE_URL','http://127.0.0.1:8093')
server=None
if not os.environ.get('BASE_URL'):
    server=subprocess.Popen(['python3','-m','http.server','8093','--bind','127.0.0.1','--directory','dist'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(.5)
report={'base':base,'geometry':[],'errors':[]}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        ctx=browser.new_context(viewport={'width':1600,'height':900})
        page=ctx.new_page()
        page.on('pageerror',lambda error:report['errors'].append(str(error)))
        for slug in ['sobre-iris-green','metodologia']:
            page.goto(base+'/es/'+slug+'/',wait_until='domcontentloaded',timeout=60000)
            main=page.locator('main:visible').first
            main.wait_for(state='visible',timeout=20000)
            page.wait_for_function('!!window.IGPreferences')
            page.evaluate('IGPreferences.reset()')
            title='Sobre Iris Green' if slug=='sobre-iris-green' else 'Metodología'
            page.get_by_role('heading',name=title,exact=True,level=1).wait_for()
            text=main.inner_text()
            assert '{{' not in text
            if slug=='sobre-iris-green':
                assert 'La autora y el proyecto' in text and 'Libros de Iris Green' in text
                assert 'no un equipo ni una máquina' not in text
                assert 'Los números de hoy' not in text and 'Cinco reglas' not in text
                assert main.locator('.about-book').count()==2
                assert main.locator('a[href="mailto:informacion@irisgreen.eu"]').count()==1
                page.get_by_role('button',name='EN',exact=True).click()
                page.get_by_role('heading',name='About Iris Green',exact=True).wait_for()
                page.wait_for_function('document.title.startsWith("About Iris Green")')
                assert page.locator('meta[name="description"]').get_attribute('content').startswith('Meet Iris Green')
                schema=json.loads(page.locator('#ig-schema').text_content())
                assert schema['inLanguage']=='en-GB' and schema['@type']=='AboutPage'
                assert main.locator('a[href="/es/metodologia/"]').inner_text()=='Read the methodology (in Spanish)'
                page.get_by_role('button',name='ES',exact=True).click()
                page.get_by_role('heading',name='Sobre Iris Green',exact=True).wait_for()
                page.locator('button[data-ig-reading-trigger]').first.click()
                page.wait_for_function('document.querySelector("button[data-ig-reading-trigger]").getAttribute("aria-expanded")==="true"')
                page.locator('button[data-ig-reading-trigger]').first.click()
                report['about_language_and_reading']=True
            else:
                assert 'no equivale' in text and 'GRADE' in text
                assert 'inteligencia artificial' in text
                assert 'No haber localizado una fuente' in text
                assert 'No hay documento porque no' not in text
                box=main.bounding_box();report['methodology_desktop_width']=box['width']
                assert box['width']>=1000 and box['x']<=300,box
                page.locator('#a11yBtn').click()
                page.locator('#a11y:visible').wait_for()
                page.locator('#a11yBtn').click()
                report['methodology_reading']=True
            for scale in [1,1.5]:
                page.evaluate('(s)=>IGPreferences.update({scale:s,spacing:s>1,controls:s>1})',scale)
                for width in [320,390,768,1440,1600]:
                    page.set_viewport_size({'width':width,'height':900})
                    page.wait_for_timeout(100)
                    g=page.evaluate('''() => ({viewport:innerWidth,document:document.documentElement.scrollWidth,main:document.querySelector('main:not(x-dc main)')?.getBoundingClientRect().width})''')
                    report['geometry'].append({'page':slug,'scale':scale,**g})
                    assert g['document']<=width+1,(slug,scale,g)
            page.evaluate('IGPreferences.reset()')
            page.set_viewport_size({'width':1600,'height':900})
            if slug=='metodologia':
                original=main.bounding_box()['width']
                page.evaluate('IGPreferences.update({text:{width:"narrow"}})')
                assert main.bounding_box()['width']<original
                report['narrow_preference_preserved']=True
                page.evaluate('IGPreferences.reset()')
            page.emulate_media(forced_colors='active',reduced_motion='reduce')
            page.wait_for_timeout(50)
            assert main.is_visible()
            page.emulate_media(forced_colors='none',reduced_motion='no-preference')
        assert not report['errors'],report['errors']
        report['ok']=True
        browser.close()
finally:
    (out/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    if server:server.terminate()
print(json.dumps(report,ensure_ascii=False,indent=2))
