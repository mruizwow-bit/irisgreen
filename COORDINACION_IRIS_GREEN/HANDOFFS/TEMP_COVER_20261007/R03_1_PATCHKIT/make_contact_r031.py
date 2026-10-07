from pathlib import Path
from PIL import Image, ImageDraw
import sys
if len(sys.argv)<3: raise SystemExit('uso: python make_contact_r031.py <views_dir> <output.jpg>')
root=Path(sys.argv[1]); out=Path(sys.argv[2])
animals=['pez-hacha','pez-linterna','calamar-cristal']; views=['lateral','tres-cuartos','frontal']
W,H=1500,1140
sheet=Image.new('RGB',(W,H),(235,238,242))
for y,a in enumerate(animals):
    for x,v in enumerate(views):
        p=root/f'{a}-{v}.png'
        im=Image.open(p).convert('RGB'); im.thumbnail((480,340))
        card=Image.new('RGB',(500,380),'white'); card.paste(im,((500-im.width)//2,10))
        ImageDraw.Draw(card).text((12,355),f'{a} · {v}',fill='black')
        sheet.paste(card,(x*500,y*380))
out.parent.mkdir(parents=True,exist_ok=True); sheet.save(out,quality=92)
print(out)
