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

def run(cmd,**kw):
    print('RUN', ' '.join(map(str,cmd)), flush=True)
    return subprocess.run(list(map(str,cmd)),check=True,**kw)

run([sys.executable,kit/'apply_r031_v2.py',work])
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
    run(['node',kit/'qa_browser_r031.js',url,'--json',pruebas/'autor-r031-browser.json'],env=os.environ.copy())
    run(['node',kit/'capture_light_evidence_r031.js',url,light],env=os.environ.copy())
    run([sys.executable,kit/'analyze_light_evidence_r031.py',light])
    run(['node',kit/'capture_model_views_r031.js',url,views],env=os.environ.copy())
    run([sys.executable,kit/'make_contact_r031.py',views,views/'CONTACT_R031_MODELOS.jpg'])

    metric=work/'pruebas'/'metricas3d.js'
    if metric.exists():
        # hardware result: preserve whatever backend the machine reports.
        run(['node',metric,url,'--json',pruebas/'metricas-r031.json'],env=os.environ.copy())
finally:
    server.terminate()
    try: server.wait(timeout=3)
    except subprocess.TimeoutExpired: server.kill()

zip_path=out/'VIDA_MARINA_3D_R03_1.zip'
cp=run([sys.executable,kit/'package_r031.py',work,zip_path],capture_output=True,text=True)
print(cp.stdout)
summary={'work':str(work),'zip':str(zip_path),'browser_qa':str(work/'pruebas'/'autor-r031-browser.json'),
         'light':str(work/'pruebas'/'r031-light-evidence'),'views':str(work/'pruebas'/'r031-model-views')}
(out/'R03_1_RUN_RESULT.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print('R03.1 RETEST RUN COMPLETE')
