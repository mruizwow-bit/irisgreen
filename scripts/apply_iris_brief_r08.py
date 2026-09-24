#!/usr/bin/env python3
"""Apply Maria's shared Iris brief to the built site; preserve source documents."""
import argparse,json,re,shutil
from collections import Counter
from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
FLOWER=re.compile(r'(?:v40-brand-symbol|iris[-_]?(?:logo|flower)|logo[-_]?iris)',re.I)
TOP={'/es/taller/','/en/workshop/','/es/intereses/','/en/interests/','/es/sitio-tranquilo/','/en/quiet-space/'}

def apply(root):
    root=Path(root);inventory=[];families=Counter()
    for p in sorted(root.rglob('*.html')):
        text=p.read_text();soup=BeautifulSoup(text,'html.parser');removed=0
        for image in soup.find_all('img'):
            if FLOWER.search(image.get('src','')) or 'flor de iris' in image.get('alt','').lower():
                image.decompose();removed+=1
        for link in soup.select('link[rel]'):
            if 'icon' in ' '.join(link.get('rel',[])):link['href']='/assets/iris-favicon.svg'
        for meta in soup.select('meta[property="og:image"],meta[name="twitter:image"]'):
            if FLOWER.search(meta.get('content','')):meta['content']='https://irisgreen.eu/assets/iris-wordmark.svg'
        head=soup.head
        if head:
            sheet=soup.new_tag('link',rel='stylesheet',href='/assets/iris-brief-r08.css');head.append(sheet)
        rel=p.relative_to(root).as_posix();kind='secondary'
        if soup.select_one('.jg-main'):kind='resources-catalogue'
        elif soup.select_one('.ri-main'):kind='resources-hub'
        elif soup.select_one('.rv-page'):kind='visual-routines'
        elif '/taller/' in rel or '/workshop/' in rel:kind='workshop'
        elif '/intereses/' in rel or '/interests/' in rel:kind='interests'
        elif '/sitio-tranquilo/' in rel or '/quiet-space/' in rel:kind='quiet-space'
        if rel in ['es/recursos/index.html','en/resources/index.html']:
            for a in soup.select('main .ri-card'):
                if a.get('href') in TOP:a.parent.decompose()
        if rel=='index.html':
            kind='home';home=soup.select_one('#home-view');assert home
            content=soup.new_tag('div');content['class']='iris-home-content'
            for child in list(home.contents):content.append(child.extract())
            home.append(content)
            home.append(BeautifulSoup((ROOT/'sabik/iris-panel.html').read_text(),'html.parser'))
            head.append(soup.new_tag('link',rel='stylesheet',href='/sabik/iris-mount.css'))
            for src in ['/sabik/sabik-motion-r37.js','/sabik/sabik-web-r01.js','/sabik/retrieval-panel.js']:
                tag=soup.new_tag('script',src=src);tag['defer']='';soup.body.append(tag)
            tag=soup.new_tag('script',src='/sabik/iris-mount.mjs',type='module');soup.body.append(tag)
            nav=soup.select_one('.nav');assert nav
            for key,label,url in [('interests','Tus intereses','/es/intereses/'),('workshop','El taller','/es/taller/')]:
                a=soup.new_tag('a',href=url);a['data-iris-top']=key;a.string=label;nav.append(a)
            tag=soup.new_tag('script',src='/assets/iris-brief-r08.js');tag['defer']='';soup.body.append(tag)
        # A single shared stylesheet per page. Preserve full content, scripts and SVGs.
        p.write_text(str(soup).replace('https://irisgreen.eu/img/v40-brand-symbol.webp','https://irisgreen.eu/assets/iris-wordmark.svg')+'\n')
        families[kind]+=1;inventory.append({'path':rel,'template':kind,'flower_images_removed':removed,'shared_brief':bool(head),'lang':soup.html.get('lang') if soup.html else None})
    dest=root/'sabik';dest.mkdir(exist_ok=True)
    for p in (ROOT/'sabik').rglob('*'):
        if p.is_file() and p.suffix in {'.js','.mjs','.png','.svg'}:
            target=dest/p.relative_to(ROOT/'sabik');target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,target)
    shutil.copy2(ROOT/'sabik/iris-mount.css',dest/'iris-mount.css')
    report=ROOT/'reports/iris-brief-r08';report.mkdir(parents=True,exist_ok=True)
    (report/'inventory.json').write_text(json.dumps({'pages':inventory,'templates':dict(families),'scope':'shared presentation only; printable content and visual scenes retain their own formats'},ensure_ascii=False,indent=2))
    print(json.dumps({'brief_pages':len(inventory),'templates':dict(families),'flower_images_removed':sum(x['flower_images_removed'] for x in inventory),'sabik_transport_enabled':False}))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',required=True);apply(p.parse_args().root)
