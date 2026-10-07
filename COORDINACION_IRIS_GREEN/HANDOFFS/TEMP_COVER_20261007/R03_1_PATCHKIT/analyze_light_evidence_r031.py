from pathlib import Path
from PIL import Image
import json, sys

if len(sys.argv)!=2:
    raise SystemExit('uso: python analyze_light_evidence_r031.py <directorio_evidencia>')
root=Path(sys.argv[1])
animals=['pez-hacha','pez-linterna','calamar-cristal']
out=[]; fail=0

def luminance(rgb):
    r,g,b=rgb
    return 0.2126*r+0.7152*g+0.0722*b

for animal in animals:
    paths={k:root/f'{animal}-{k}.png' for k in ['dark','partial','revealed']}
    missing=[str(p) for p in paths.values() if not p.exists()]
    if missing:
        out.append({'animal':animal,'estado':'FALLA','motivo':'faltan archivos','missing':missing})
        fail+=1; continue

    ims={k:Image.open(p).convert('RGB') for k,p in paths.items()}
    sizes={im.size for im in ims.values()}
    if len(sizes)!=1:
        out.append({'animal':animal,'estado':'FALLA','motivo':'dimensiones distintas','sizes':[list(x) for x in sizes]})
        fail+=1; continue

    dark=list(ims['dark'].getdata()); partial=list(ims['partial'].getdata()); revealed=list(ims['revealed'].getdata())
    total=len(dark); threshold=4.0
    changed_p=changed_r=0; sum_p=sum_r=0.0
    for d,p,r in zip(dark,partial,revealed):
        ld=luminance(d)
        dp=max(0.0,luminance(p)-ld)
        dr=max(0.0,luminance(r)-ld)
        if dp>threshold: changed_p+=1; sum_p+=dp
        if dr>threshold: changed_r+=1; sum_r+=dr
    frac_p=changed_p/total if total else 0.0
    frac_r=changed_r/total if total else 0.0
    mean_p=sum_p/changed_p if changed_p else 0.0
    mean_r=sum_r/changed_r if changed_r else 0.0

    partial_exists=frac_p>0.002
    revealed_exists=frac_r>0.005
    partial_smaller=frac_p < frac_r*0.90 if revealed_exists else False
    not_global=frac_p<0.65
    state='PASA' if partial_exists and revealed_exists and partial_smaller and not_global else 'FALLA'
    if state=='FALLA': fail+=1
    out.append({
      'animal':animal,'estado':state,
      'fraccion_pixeles_cambiados_partial':round(frac_p,6),
      'fraccion_pixeles_cambiados_revealed':round(frac_r,6),
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
