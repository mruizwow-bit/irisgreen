from pathlib import Path
import argparse, shutil, subprocess, sys, os, time, socket, json

ap=argparse.ArgumentParser()
ap.add_argument('r03_dir')
ap.add_argument('output_dir')
ap.add_argument('--port',type=int,default=8773)
args=ap.parse_args()

kit=Path(__file__).resolve().parent
src=Path(args.r03_dir).resolve()
out=Path(args.output_dir).resolve()
work=out/'VIDA_MARINA_3D_R03_1'
out.mkdir(parents=True,exist_ok=True)
if work.exists(): shutil.rmtree(work)
shutil.copytree(src,work)

env=os.environ.copy()

# Resolver Playwright instalado vía npx, como en el equipo IrisGreen.
def node_can_require_playwright(e):
    return subprocess.run(['node','-e',"require('playwright');process.exit(0)"],
                          env=e,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0

if not node_can_require_playwright(env):
    candidates=[]
    localapp=Path(env.get('LOCALAPPDATA','')) if env.get('LOCALAPPDATA') else None
    if localapp:
        npx=localapp/'npm-cache'/'_npx'
        if npx.exists():
            candidates.extend(p.parent.parent for p in npx.glob('*/node_modules/playwright/package.json'))
    for nm in candidates:
        test=env.copy()
        old=test.get('NODE_PATH','')
        test['NODE_PATH']=str(nm)+(os.pathsep+old if old else '')
        if node_can_require_playwright(test):
            env=test
            break
if not node_can_require_playwright(env):
    raise SystemExit('No se puede resolver el módulo playwright')

# Resolver Chrome real antes de permitir que Playwright intente descargar browsers.
if not env.get('PLAYWRIGHT_CHROMIUM'):
    chrome_candidates=[
      Path(env.get('PROGRAMFILES','C:/Program Files'))/'Google/Chrome/Application/chrome.exe',
      Path(env.get('PROGRAMFILES(X86)','C:/Program Files (x86)'))/'Google/Chrome/Application/chrome.exe',
      Path(env.get('LOCALAPPDATA',''))/'Google/Chrome/Application/chrome.exe' if env.get('LOCALAPPDATA') else Path('__none__')
    ]
    for cp in chrome_candidates:
        if cp.exists():
            env['PLAYWRIGHT_CHROMIUM']=str(cp)
            break

def run(cmd,**kw):
    print('RUN', ' '.join(map(str,cmd)), flush=True)
    return subprocess.run(list(map(str,cmd)),check=True,**kw)

run([sys.executable,kit/'apply_r031_v2.py',work])
run([sys.executable,'-m','py_compile',
     kit/'apply_r031_v2.py',kit/'qa_static_r031.py',kit/'qa_idempotence_r031.py',
     kit/'package_r031.py',kit/'qa_package_determinism_r031.py',
     kit/'analyze_light_evidence_r031.py',kit/'make_contact_r031.py'])
run(['node','--check',kit/'qa_browser_r031.js'])
run(['node','--check',kit/'capture_light_evidence_r031.js'])
run(['node','--check',kit/'capture_model_views_r031.js'])
run(['node','--check',work/'app'/'animales3d.js'])
run(['node','--check',work/'app'/'escena3d.js'])
run(['node','--check',work/'app'/'piloto3d.js'])
run([sys.executable,kit/'qa_static_r031.py',work])
run([sys.executable,work/'procedencia'/'gen_datos3d.py','--verificar'])
run([sys.executable,kit/'qa_idempotence_r031.py',work,kit/'apply_r031_v2.py'])

server=subprocess.Popen([sys.executable,'-m','http.server',str(args.port),'--directory',str(work)],
                        stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    deadline=time.time()+15
    while True:
        try:
            with socket.create_connection(('127.0.0.1',args.port),timeout=.5): break
        except OSError:
            if time.time()>deadline: raise RuntimeError('http.server no arrancó')
            time.sleep(.2)

    url=f'http://127.0.0.1:{args.port}/vida-marina-3d.html'
    pruebas=work/'pruebas'; pruebas.mkdir(exist_ok=True)
    light=pruebas/'r031-light-evidence'
    views=pruebas/'r031-model-views'
    run(['node',kit/'qa_browser_r031.js',url,'--json',pruebas/'autor-r031-browser.json'],env=env)
    run(['node',kit/'capture_light_evidence_r031.js',url,light],env=env)
    run([sys.executable,kit/'analyze_light_evidence_r031.py',light])
    run(['node',kit/'capture_model_views_r031.js',url,views],env=env)
    run([sys.executable,kit/'make_contact_r031.py',views,views/'CONTACT_R031_MODELOS.jpg'])

    metric=work/'pruebas'/'metricas3d.js'
    if metric.exists():
        # hardware result: preserve whatever backend the machine reports.
        run(['node',metric,url,'--json',pruebas/'metricas-r031.json'],env=env)
finally:
    server.terminate()
    try: server.wait(timeout=3)
    except subprocess.TimeoutExpired: server.kill()

run([sys.executable,kit/'qa_package_determinism_r031.py',work,kit/'package_r031.py'])
zip_path=out/'VIDA_MARINA_3D_R03_1.zip'
cp=run([sys.executable,kit/'package_r031.py',work,zip_path],capture_output=True,text=True)
print(cp.stdout)
summary={'work':str(work),'zip':str(zip_path),'browser_qa':str(work/'pruebas'/'autor-r031-browser.json'),
         'light':str(work/'pruebas'/'r031-light-evidence'),'views':str(work/'pruebas'/'r031-model-views')}
(out/'R03_1_RUN_RESULT.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print('R03.1 RETEST RUN COMPLETE')
