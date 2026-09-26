#!/usr/bin/env python3
from pathlib import Path
import numpy as np, math, wave, subprocess, hashlib, json
SR=24000; DUR=14.0; N=int(SR*DUR)
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'audio'/'rincon'/'r04'; OUT.mkdir(parents=True,exist_ok=True)
def R(s): return np.random.default_rng(s)
def low(x,c):
 a=1-math.exp(-2*math.pi*c/SR); y=np.empty_like(x,dtype=float); z=0.0
 for i,v in enumerate(x): z+=a*(v-z); y[i]=z
 return y
def high(x,c): return x-low(x,c)
def band(x,lo,hi): return low(high(x,lo),hi)
def seam(x,sec=.65):
 x=x.copy();m=min(int(sec*SR),len(x)//8);w=np.linspace(0,1,m);blend=x[:m]*w+x[-m:]*(1-w);x[:m]=blend;x[-m:]=blend;return x
def norm(x,target=.18):
 x=np.asarray(x,float);x-=x.mean();p=np.max(np.abs(x)) or 1;x=x/p*target;return (np.tanh(x*1.25)/np.tanh(1.25)).astype(np.float32)
def add_tone(x,st,dur,f0,f1=None,amp=.01):
 i0=max(0,int(st*SR));i1=min(len(x),int((st+dur)*SR))
 if i1<=i0:return
 tt=np.arange(i1-i0)/SR;f1=f0 if f1 is None else f1;k=(f1-f0)/max(dur,1e-6);ph=2*np.pi*(f0*tt+.5*k*tt*tt);env=np.sin(np.pi*np.clip(tt/dur,0,1))**2;x[i0:i1]+=amp*np.sin(ph)*env
def add_burst(x,st,dur,seed,lo,hi,amp):
 i0=max(0,int(st*SR));i1=min(len(x),int((st+dur)*SR))
 if i1<=i0:return
 r=R(seed).standard_normal(i1-i0);kh=max(2,int(SR/hi));kl=max(kh+1,int(SR/lo))
 ma=lambda a,k:np.convolve(a,np.ones(k)/k,mode='same')
 y=ma(r,kh)-ma(r,kl);env=np.sin(np.pi*np.linspace(0,1,i1-i0))**2;x[i0:i1]+=amp*y*env/(np.std(y)+1e-9)
def mod(seed,plo=2,phi=5,base=.4,depth=.6):
 r=R(seed);pts=[0];vals=[r.uniform(-1,1)];pos=0
 while pos<N: pos=min(N,pos+int(r.uniform(plo,phi)*SR));pts.append(pos);vals.append(r.uniform(-1,1))
 y=np.interp(np.arange(N),pts,vals);y=low(y,2);y=(y-y.min())/(np.ptp(y)+1e-9);return base+depth*y
def pink(seed):return .65*low(R(seed).standard_normal(N),1800)+.35*low(R(seed+1).standard_normal(N),6000)
def rain(seed,window=False):
 r=R(seed);base=band(pink(seed+2),500 if window else 380,4200);x=.10*base*mod(seed+3,1.4,3.3,.45,.55)
 for j in range(95 if window else 60):
  st=r.uniform(0,DUR-.2);dur=r.uniform(.035,.14);f=r.uniform(950 if window else 700,2800 if window else 2100);add_tone(x,st,dur,f,f*r.uniform(1.05,1.24),r.uniform(.006,.018))
  if window and r.random()<.35:add_burst(x,st,dur*.5,seed*100+j,1800,6500,.007)
 return norm(seam(x),.18)
def waves(seed):
 r=R(seed);t=np.arange(N)/SR;water=low(r.standard_normal(N),430);foam=band(r.standard_normal(N),1200,5200);x=np.zeros(N);st=-2.5
 while st<DUR+2:
  rise=r.uniform(1.6,2.5);crest=r.uniform(.5,.9);fall=r.uniform(2.7,3.8);local=t-st;env=np.zeros(N);m=(local>=0)&(local<rise);env[m]=.5-.5*np.cos(np.pi*local[m]/rise);m=(local>=rise)&(local<rise+crest);env[m]=1;m=(local>=rise+crest)&(local<rise+crest+fall);env[m]=.5+.5*np.cos(np.pi*(local[m]-rise-crest)/fall);x+=.10*water*env+.035*foam*(env**1.8);st+=rise+crest+fall+r.uniform(.3,1.1)
 return norm(seam(x),.20)
def stream(seed,birds=False):
 r=R(seed);a=band(r.standard_normal(N),180,900);b=band(r.standard_normal(N),700,2600);m=.65+.35*mod(seed+4,.7,2.1,0,1);x=.08*a*m+.035*b*(1-.2*m)
 for j in range(30):add_tone(x,r.uniform(0,DUR-.2),r.uniform(.08,.22),r.uniform(180,520),r.uniform(420,860),r.uniform(.004,.011))
 if birds:
  for j in range(3):
   st=1+j*4.1+r.uniform(-.5,.5);f=r.uniform(1700,2300);add_tone(x,st,.42,f,f*1.22,.0045);add_tone(x,st+.22,.35,f*1.08,f*.95,.0038)
 return norm(seam(x),.18)
def breeze(seed):return norm(seam(low(band(R(seed).standard_normal(N),90,1050),900)*mod(seed+5,2.8,6,.28,.72)),.14)
def birds(seed):
 r=R(seed);x=.012*low(r.standard_normal(N),380);st=.8
 while st<DUR-1:
  st+=r.uniform(1.9,3.8);f=r.uniform(1500,2400);n=int(r.integers(2,4))
  for k in range(n):add_tone(x,st+k*.22,.32,f*(1+.03*k),f*r.uniform(1.12,1.28),r.uniform(.007,.013))
 return norm(seam(x),.14)
def crickets(seed):
 r=R(seed);x=.006*low(r.standard_normal(N),450)
 for lane,(f,st) in enumerate([(3100,.1),(3480,.6),(3820,1.1)]):
  while st<DUR-.4:
   for k in range(int(r.integers(2,5))):add_tone(x,st+k*.075,.055,f+r.uniform(-35,35),amp=.0045)
   st+=r.uniform(.75,1.65)+lane*.15
 return norm(seam(x),.12)
def fire(seed):
 r=R(seed);x=.04*low(r.standard_normal(N),220)
 for j in range(58):add_burst(x,r.uniform(0,DUR-.18),r.uniform(.04,.11),seed*10+j,500,2200,r.uniform(.004,.016))
 return norm(seam(x),.14)
def pinknoise(seed):return norm(seam(low(R(seed).standard_normal(N),3600)),.12)
def brownnoise(seed):return norm(seam(low(R(seed).standard_normal(N),320)),.11)
def piano(seed):
 r=R(seed);x=np.zeros(N);scale=[0,2,4,7,9];st=.8
 while st<DUR-1:
  sem=int(r.choice(scale))+12*int(r.choice([0,0,1]));f=220*2**(sem/12);dur=r.uniform(2,3.8);add_tone(x,st,dur,f,amp=.025);add_tone(x,st,dur*.75,f*2,amp=.006);st+=r.uniform(2.2,4.2)
 return norm(seam(x),.12)
def bowls(seed):
 r=R(seed);x=np.zeros(N);st=1
 while st<DUR-2:
  f=float(r.choice([146.8,164.8,174.6,196.]));dur=r.uniform(3,4.6)
  for ratio,amp in [(1,.025),(2.03,.008),(3.14,.0035)]:add_tone(x,st,dur,f*ratio,amp=amp)
  st+=r.uniform(5,7)
 return norm(seam(x),.12)
def aquarium(seed):
 r=R(seed);x=.035*low(r.standard_normal(N),240);t=np.arange(N)/SR;x+=.006*np.sin(2*np.pi*72*t)*(0.7+0.3*np.sin(2*np.pi*.08*t))
 for j in range(22):add_tone(x,r.uniform(0,DUR-.2),r.uniform(.08,.18),r.uniform(220,460),r.uniform(420,780),r.uniform(.003,.007))
 return norm(seam(x),.12)
def tube(seed):
 r=R(seed);x=.012*low(r.standard_normal(N),170)
 for j in range(60):add_tone(x,r.uniform(0,DUR-.18),r.uniform(.08,.18),r.uniform(110,330),r.uniform(240,620),r.uniform(.003,.009))
 return norm(seam(x),.13)
def jelly(seed):
 r=R(seed);x=.018*low(r.standard_normal(N),260);t=np.arange(N)/SR;x+=.004*np.sin(2*np.pi*86*t)*(0.72+0.28*np.sin(2*np.pi*.07*t));x+=.018*band(r.standard_normal(N),120,420)*(.5+.5*np.sin(2*np.pi*t/6.8));return norm(seam(x),.10)
def fibre(seed):
 t=np.arange(N)/SR;x=(.0015*np.sin(2*np.pi*175*t)+.0011*np.sin(2*np.pi*262*t+1.2))*(.55+.45*(.5+.5*np.sin(2*np.pi*t/8)));return norm(seam(x),.035)
def octopus(seed):
 r=R(seed);x=.02*low(r.standard_normal(N),230)+.01*band(r.standard_normal(N),180,520)
 for j in range(10):add_tone(x,r.uniform(0,DUR-.2),r.uniform(.09,.18),r.uniform(120,260),r.uniform(220,430),r.uniform(.002,.005))
 return norm(seam(x),.09)
GENERAL={'lluvia':lambda:rain(101,False),'lluvia-ventana':lambda:rain(102,True),'olas':lambda:waves(103),'rio':lambda:stream(104,False),'viento':lambda:breeze(105),'pajaros':lambda:birds(106),'grillos':lambda:crickets(107),'fuego':lambda:fire(108),'ruido-rosa':lambda:pinknoise(109),'ruido-marron':lambda:brownnoise(110),'piano':lambda:piano(111),'cuencos':lambda:bowls(112)}
SCENES={'mar':lambda:waves(201),'lluvia':lambda:rain(202,True),'rio':lambda:stream(203,True),'noche':lambda:crickets(204),'acuario':lambda:aquarium(205),'tubo-burbujas':lambda:tube(206),'medusas':lambda:jelly(207),'fibra':lambda:fibre(208),'pulpos':lambda:octopus(209)}
SETS={'general-nature':list(GENERAL)[:8],'general-calm':list(GENERAL)[8:],'scenes':list(SCENES)}
manifest={'schema':'irisgreen-r40-rincon-r04-audio-sprite-v1','sample_rate':SR,'segment_seconds':DUR,'provenance':'SYNTHETIC_FIRST_PARTY_R40_R04','generator':'tools/r40-rincon-r04/render_audio.py','sprites':{},'items':{}}
def encode(sprite,names,source):
 arr=[];off=0.
 for name in names:
  arr.append(source[name]());manifest['items'][('general:' if source is GENERAL else 'scene:')+name]={'sprite':sprite,'offset':off,'duration':DUR};off+=DUR
 pcm=(np.clip(np.concatenate(arr),-1,1)*32767).astype('<i2');wav=OUT/(sprite+'.wav');m4a=OUT/(sprite+'.m4a')
 with wave.open(str(wav),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes())
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(wav),'-c:a','aac','-b:a','48k','-ar',str(SR),'-ac','1','-movflags','+faststart',str(m4a)],check=True);wav.unlink()
 manifest['sprites'][sprite]={'path':str(m4a.relative_to(ROOT)).replace('\\\\','/'),'sha256':hashlib.sha256(m4a.read_bytes()).hexdigest(),'bytes':m4a.stat().st_size,'duration_seconds':off}
encode('general-nature',SETS['general-nature'],GENERAL);encode('general-calm',SETS['general-calm'],GENERAL);encode('scenes',SETS['scenes'],SCENES)
(OUT/'AUDIO_MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\\n',encoding='utf-8')
print(json.dumps({'sprites':manifest['sprites'],'items':len(manifest['items'])},ensure_ascii=False))
