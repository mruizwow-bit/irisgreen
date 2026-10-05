import json,argparse
from pathlib import Path
from PIL import Image
parser=argparse.ArgumentParser(description='Regenerar datos desde el web/ original de R2v4. Requiere Pillow.')
parser.add_argument('source_web',type=Path)
args=parser.parse_args()
src=args.source_web
dst=Path(__file__).resolve().parents[1]
d=json.loads((src/'datos.json').read_text())
labels={
 'trilobites': [('Parte anterior','Front region'),('Segmentos del caparazón','Shell segments'),('Surcos longitudinales','Lengthwise grooves')],
 'meganeura':[('Contorno del ala','Wing outline'),('Red de venas','Network of veins'),('Extremo de la impresión','End of the impression')],
 'dunkleosteus':[('Borde de la placa','Edge of the plate'),('Superficie ósea','Bony surface'),('Zona afilada','Sharp region')],
 'dimetrodon':[('Espina alargada','Long spine'),('Cuerpo de la vértebra','Vertebral body'),('Base de la espina','Base of the spine')],
 'concavenator':[('Espina alta','Tall spine'),('Cuerpo de la vértebra','Vertebral body'),('Base de la espina','Base of the spine')],
 'mamut':[('Láminas paralelas','Parallel plates'),('Superficie del molar','Molar surface'),('Borde de la pieza','Edge of the piece')],
 'antecessor':[('Dientes conservados','Preserved teeth'),('Cuerpo de la mandíbula','Body of the jaw'),('Borde del fragmento','Fragment edge')],
 'pelecanimimus':[('Hilera de dientes','Row of teeth'),('Cuerpo de la mandíbula','Body of the jaw'),('Extremo de la pieza','End of the piece')],
 'eoraptor':[('Dientes curvos','Curved teeth'),('Cuerpo de la mandíbula','Body of the jaw'),('Extremo de la pieza','End of the piece')],
 'plateosaurus':[('Extremo del hueso','End of the bone'),('Cuerpo alargado','Long shaft'),('Extremo opuesto','Opposite end')],
 'turiasaurus':[('Extremo del hueso','End of the bone'),('Cuerpo alargado','Long shaft'),('Extremo opuesto','Opposite end')],
 'trex':[('Punta del diente','Tooth tip'),('Cuerpo curvado','Curved body'),('Base del diente','Base of the tooth')],
 'iguanodon':[('Extremo puntiagudo','Pointed end'),('Cuerpo de la púa','Body of the spike'),('Base de la pieza','Base of the piece')],
 'archaeopteryx':[('Eje de la impresión','Axis of the impression'),('Contorno de la pluma','Feather outline'),('Losa que la conserva','Preserving slab')]
}
positions=[[(450,510)],[(470,450),(1280,690)],[(430,430),(1320,310),(1100,850)],[(420,350),(1290,300),(520,830),(1380,840)]]
records=[]
for idx in [6,5,4,3,2,0]:
 e=d['estratos'][idx];fs=[];pos=positions[len(e['fosiles'])-1]
 for j,f0 in enumerate(e['fosiles']):
  f=dict(f0);im=Image.open(src/'arte'/('f-'+f['id']+'.webp')).convert('RGBA');w,h=im.size
  a=im.getchannel('A');box=a.getbbox();samples=[]
  for yy in range(10):
   for xx in range(10):
    px=round((xx+.5)/10*(w-1));py=round((yy+.5)/10*(h-1))
    if a.getpixel((px,py))>150:samples.append([round(px/w,5),round(py/h,5)])
  goals=[(.5,.25),(.5,.5),(.5,.77)] if h>w else [(.25,.5),(.5,.5),(.76,.5)]
  feat=[]
  for n,(gx,gy) in enumerate(goals):
   q=min(samples,key=lambda p:(p[0]-gx)**2+(p[1]-gy)**2)
   feat.append({'x':q[0],'y':q[1],'es':labels[f['id']][n][0],'en':labels[f['id']][n][1]})
  factor=min(490/w,465/h)
  f.update(x=pos[j][0],y=pos[j][1],w=round(w*factor),h=round(h*factor),samples=samples,features=feat,asset='assets/arte/f-'+f['id']+'.webp')
  fs.append(f)
 records.append(dict(id=e['id'],nombre=e['nombre'],edad=e['edad'],corto=e['corto'],roca=e['roca'],background='assets/arte/estrato-'+str(idx)+'-'+e['id']+'-desktop.webp',pieces=fs))
content={'source':d['fuente'],'sectors':records,'total':sum(len(e['pieces']) for e in records)}
(dst/'assets/data.js').write_text('window.FOSSILS_DATA = '+json.dumps(content,ensure_ascii=False,separators=(',',':'))+';\n')
print('Piezas:',content['total'],'Muestras:',sum(len(f['samples']) for e in records for f in e['pieces']))
