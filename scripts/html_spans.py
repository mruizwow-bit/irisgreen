"""HTML span parser reused from the reviewed R37 mount; no reserialization."""
from html.parser import HTMLParser
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
