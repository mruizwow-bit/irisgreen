#!/usr/bin/env python3
"""Mount the existing Sabik panel into the current generated Iris home.

The accepted /es/nea source supplies only the component, never the old home.
All other generated pages and approved editorial content remain unchanged.
"""
import argparse,json,re
from pathlib import Path
from html.parser import HTMLParser

REPO=Path(__file__).resolve().parents[1]
STYLES=['/sabik/sabik-page.css','/sabik/sabik-web-r01.css']
SCRIPTS=['/sabik/sabik-web-r01.js','/sabik/sabik-page.js']

class Document(HTMLParser):
    """Locate exact spans without reserializing approved HTML or inline JS."""
    VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    def __init__(self,text):
        super().__init__(convert_charrefs=True)
        self.text=text;self.nodes=[];self.stack=[];self.offsets=[0]
        for line in text.splitlines(keepends=True):self.offsets.append(self.offsets[-1]+len(line))
        self.feed(text)
    def source_offset(self):
        line,col=self.getpos();return self.offsets[line-1]+col
    def handle_starttag(self,tag,attrs):
        start=self.source_offset();node={'tag':tag,'attrs':dict(attrs),'start':start,'open_end':start+len(self.get_starttag_text())}
        self.nodes.append(node)
        if tag in self.VOID:node['end']=node['open_end']
        else:self.stack.append(node)
    def handle_startendtag(self,tag,attrs):
        self.handle_starttag(tag,attrs)
        if self.stack and self.stack[-1]['start']==self.source_offset():
            node=self.stack.pop();node['end']=node['open_end']
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i]['tag']==tag:
                node=self.stack[i];node['close_start']=self.source_offset();node['end']=self.text.index('>',self.source_offset())+1
                del self.stack[i:];return
    def one(self,tag=None,**attrs):
        matches=[n for n in self.nodes if (tag is None or n['tag']==tag) and all(n['attrs'].get(k)==v for k,v in attrs.items())]
        assert len(matches)==1,(tag,attrs,len(matches));return matches[0]
    def content(self,node):return self.text[node['start']:node['end']]

def edit(text,changes):
    for start,end,value in sorted(changes,reverse=True):text=text[:start]+value+text[end:]
    return text

def mount(root):
    root=Path(root).resolve()
    assert root!=REPO,'Only the generated site may be mounted'
    template=Document((REPO/'es/nea/index.html').read_text(encoding='utf-8'))
    panel=template.content(template.one('aside',**{'class':'sabik-panel'}))
    layout=template.content(template.one('style',id='sabik-current-home-layout'))
    target=root/'index.html'
    original=target.read_text(encoding='utf-8');doc=Document(original)
    assert not any('sabik-panel' in n['attrs'].get('class','').split() for n in doc.nodes)
    home=doc.one(id='home-view');main=doc.one('main',id='main');hero=doc.one('div',id='inicio')
    body=doc.one('body');head=doc.one('head')
    assert home['start']<hero['start']<hero['end']<home['end']
    assert not body['attrs'].get('class'),'Review existing body classes before changing them'
    old_body=original[body['start']:body['open_end']]
    new_body=old_body.replace('<body','<body class="sabik-iris-page"',1)
    additions=[
      (hero['end'],'\n<!-- sabik-panel:start -->'+panel+'<!-- sabik-panel:end -->\n'),
      (main['start'],'<!-- sabik-wrapper:start --><div class="sabik-home-with-panel">'),
      (main['end'],'</div><!-- sabik-wrapper:end -->'),
      (head['close_start'],'\n'+''.join(f'<link rel="stylesheet" href="{p}">' for p in STYLES)+layout+'\n'),
      (body['close_start'],'\n'+''.join(f'<script defer src="{p}"></script>' for p in SCRIPTS)+'\n'),
    ]
    mounted=edit(original,[(pos,pos,text) for pos,text in additions]+[(body['start'],body['open_end'],new_body)])
    # Removing only this component's additions must reconstruct every original byte.
    restored=mounted
    for _,text in additions:
        assert restored.count(text)==1;restored=restored.replace(text,'',1)
    restored=restored.replace(new_body,old_body,1)
    assert restored==original,'Approved home content was changed'
    for path in STYLES+SCRIPTS:
        assert (root/path.lstrip('/')).is_file(),path
    target.write_text(mounted,encoding='utf-8',newline='\n')
    # Retain the existing Sabik route using this same current home composition.
    d=Document(mounted);title=d.one('title');changes=[(title['open_end'],title['close_start'],'Sabik · Iris Green')]
    for node in d.nodes:
        if (node['tag']=='link' and node['attrs'].get('rel')=='canonical') or (node['tag']=='meta' and node['attrs'].get('property')=='og:url'):
            old=d.content(node);new=old.replace('https://irisgreen.eu/','https://irisgreen.eu/es/nea/')
            changes.append((node['start'],node['end'],new))
    robots=[n for n in d.nodes if n['tag']=='meta' and n['attrs'].get('name')=='robots']
    if robots:
        assert len(robots)==1;changes.append((robots[0]['start'],robots[0]['end'],'<meta name="robots" content="noindex,follow">'))
    else:changes.append((d.one('head')['close_start'],d.one('head')['close_start'],'<meta name="robots" content="noindex,follow">'))
    dedicated=edit(mounted,changes)
    route=root/'es/nea/index.html';route.parent.mkdir(parents=True,exist_ok=True)
    route.write_text(dedicated,encoding='utf-8',newline='\n')
    return {'mounted_routes':['/','/es/nea/'],'existing_home_text_preserved':True,'existing_home_links_preserved':True,'core_modified':False,'inference_api_enabled':False,'motion_added':False,'voice_runtime_added':False}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--root',required=True)
    print(json.dumps(mount(parser.parse_args().root),ensure_ascii=False))
