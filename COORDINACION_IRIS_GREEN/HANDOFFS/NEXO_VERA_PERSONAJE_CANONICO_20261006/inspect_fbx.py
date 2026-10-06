import zipfile,struct,zlib,json,pathlib
p=pathlib.Path('upload/PERSONAJE 1(2).zip');result=[]
with zipfile.ZipFile(p) as z:
 for filename in z.namelist():
  if not filename.endswith('.fbx'):continue
  b=z.read(filename);ver=struct.unpack_from('<I',b,23)[0];hs=25 if ver>=7500 else 13;fmt='<QQQ' if ver>=7500 else '<III'
  r={'file':filename,'meshes':[],'bones':[],'skin_deformers':0,'clusters':0,'clips':[]}
  def node(at,parent=None):
   end,nprops,plen=struct.unpack_from(fmt,b,at)
   if not end:return len(b)
   nl=b[at+hs-1];tag=b[at+hs:at+hs+nl].decode('utf8','replace');ptr=at+hs+nl;pr=[]
   for _ in range(nprops):
    t=chr(b[ptr]);ptr+=1;f={'Y':'<h','C':'<?','I':'<i','F':'<f','D':'<d','L':'<q'}.get(t)
    if f:pr.append(struct.unpack_from(f,b,ptr)[0]);ptr+=struct.calcsize(f)
    elif t in 'SR':
     n=struct.unpack_from('<I',b,ptr)[0];ptr+=4;pr.append(b[ptr:ptr+n].decode('utf8','replace').split('\x00')[0] if t=='S' else {'bytes':n});ptr+=n
    else:
     n,enc,ln=struct.unpack_from('<III',b,ptr);ptr+=12
     if tag=='PolygonVertexIndex':
      raw=zlib.decompress(b[ptr:ptr+ln]) if enc else b[ptr:ptr+ln];vals=struct.unpack('<'+'i'*n,raw);sizes=[];k=0
      for v in vals:
       k+=1
       if v<0:sizes.append(k);k=0
      pr.append({'indices':n,'polygons':len(sizes),'triangles_if_fan':sum(x-2 for x in sizes),'max_face_vertices':max(sizes,default=0)})
     else:pr.append({'array_type':t,'length':n})
     ptr+=ln
   owner=parent
   if tag=='Geometry' and pr[-1]=='Mesh':
    owner={'name':pr[1]};r['meshes'].append(owner)
   if tag=='Vertices' and owner is not None:owner['vertices']=pr[0]['length']//3
   if tag=='PolygonVertexIndex' and owner is not None:owner.update(pr[0])
   if tag=='Model' and pr[-1]=='LimbNode':r['bones'].append(pr[1])
   if tag=='Deformer' and pr[-1]=='Skin':r['skin_deformers']+=1
   if tag=='Deformer' and pr[-1]=='Cluster':r['clusters']+=1
   if tag=='AnimationStack':r['clips'].append(pr[1])
   while ptr+hs<=end:
    if not any(b[ptr:ptr+hs]):break
    ptr=node(ptr,owner)
   return end
  at=27
  while at+hs<len(b) and any(b[at:at+hs]):at=node(at)
  r['bone_count']=len(r['bones']);result.append(r)
pathlib.Path('vera-intake-20261006/FBX_STRUCTURE.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
