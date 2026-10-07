from pathlib import Path
from PIL import Image
import numpy as np, json, sys

if len(sys.argv)!=2:
    raise SystemExit('uso: python analyze_light_evidence_r031.py <directorio_evidencia>')
root=Path(sys.argv[1])
animals=['pez-hacha','pez-linterna','calamar-cristal']
out=[]
fail=0

def lum(im):
    a=np.asarray(im.convert('RGB'),dtype=np.float32)
    return 0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]

for animal in animals:
    files={k:root/f'{animal}-{k}.png' for k in ['dark','partial','revealed']}
    missing=[str(p) for p in files.values() if not p.exists()]
    if missing:
        out.append({'animal':animal,'estado':'FALLA','motivo':'faltan archivos','missing':missing}); fail+=1; continue
    d,p,r=[lum(Image.open(files[k])) for k in ['dark','partial','revealed']]
    if not (d.shape==p.shape==r.shape):
        out.append({'animal':animal,'estado':'FALLA','motivo':'dimensiones distintas'}); fail+=1; continue

    dp=np.maximum(0,p-d); dr=np.maximum(0,r-d)
    # umbral de cambio perceptible en luminancia 8-bit.
    th=4.0
    mp=dp>th; mr=dr>th
    changed_p=float(mp.mean()); changed_r=float(mr.mean())
    mean_p=float(dp[mp].mean()) if mp.any() else 0.0
    mean_r=float(dr[mr].mean()) if mr.any() else 0.0
    # El estado parcial debe existir, afectar menos área que revealed y no ser
    # simplemente un encendido global del mismo tamaño que el estado centrado.
    partial_exists=changed_p>0.002
    revealed_exists=changed_r>0.005
    partial_smaller=changed_p < changed_r*0.90 if revealed_exists else False
    # También exigimos que el cambio parcial no invada prácticamente toda la
    # imagen recortada; con el entorno aislado eso señalaría encendido global.
    not_global=changed_p<0.65
    state='PASA' if partial_exists and revealed_exists and partial_smaller and not_global else 'FALLA'
    if state=='FALLA': fail+=1
    out.append({
      'animal':animal,'estado':state,
      'fraccion_pixeles_cambiados_partial':round(changed_p,6),
      'fraccion_pixeles_cambiados_revealed':round(changed_r,6),
      'delta_luminancia_medio_partial':round(mean_p,3),
      'delta_luminancia_medio_revealed':round(mean_r,3),
      'checks':{
        'partial_exists':partial_exists,
        'revealed_exists':revealed_exists,
        'partial_area_smaller_than_revealed':partial_smaller,
        'partial_not_global':not_global
      }
    })

report={'resultado':'PASA' if fail==0 else 'FALLA','fallos':fail,'animales':out}
(root/'LIGHT_LUMINANCE_ANALYSIS.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
for x in out:
    print(x['estado'].ljust(7),x['animal'],x.get('fraccion_pixeles_cambiados_partial'),x.get('fraccion_pixeles_cambiados_revealed'))
print('RESULTADO',report['resultado'])
raise SystemExit(1 if fail else 0)
