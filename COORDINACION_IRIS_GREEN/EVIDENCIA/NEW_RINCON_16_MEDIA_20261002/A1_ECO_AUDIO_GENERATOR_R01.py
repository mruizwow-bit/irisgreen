#!/usr/bin/env python3
from pathlib import Path
import json, math
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

OUT=Path('/mnt/data/eco_a1')
SR=48000
DURATION_S=300.0833333333333
N=14_404_000
SEED=61012026
rng=np.random.default_rng(SEED)

common=rng.standard_normal(N, dtype=np.float32)
left_extra=rng.standard_normal(N, dtype=np.float32)
right_extra=rng.standard_normal(N, dtype=np.float32)

sos_body=butter(4, [35,700], btype='bandpass', fs=SR, output='sos')
common=sosfilt(sos_body, common).astype(np.float32)
left_extra=sosfilt(sos_body, left_extra).astype(np.float32)
right_extra=sosfilt(sos_body, right_extra).astype(np.float32)

texture=rng.standard_normal(N, dtype=np.float32)
sos_tex=butter(4, [260,2400], btype='bandpass', fs=SR, output='sos')
texture=sosfilt(sos_tex, texture).astype(np.float32)

def unit_rms(x):
    r=float(np.sqrt(np.mean(x.astype(np.float64)**2)))
    return x/(r if r>1e-12 else 1)
common=unit_rms(common)
left_extra=unit_rms(left_extra)
right_extra=unit_rms(right_extra)
texture=unit_rms(texture)

t=np.arange(N, dtype=np.float32)/SR
env=(0.78
     +0.055*np.sin(2*np.pi*t/37.0 + 0.2)
     +0.045*np.sin(2*np.pi*t/61.0 + 1.1)
     +0.025*np.sin(2*np.pi*t/103.0 + 2.0)).astype(np.float32)
drift=(0.025*np.sin(2*np.pi*t/47.0 + 0.7)).astype(np.float32)

L=((0.050*common + 0.014*left_extra + 0.0065*texture)*(env-drift)).astype(np.float32)
R=((0.050*common + 0.014*right_extra + 0.0060*texture)*(env+drift)).astype(np.float32)

events=[]
cur=1.8
while cur < DURATION_S-1.5:
    cur += max(0.34, float(rng.exponential(1.35)))
    if cur >= DURATION_S-1.5: break
    cluster=1 + int(rng.random()<0.23) + int(rng.random()<0.07)
    base_pan=float(rng.uniform(-0.68,0.68))
    for j in range(cluster):
        st=cur + j*float(rng.uniform(0.055,0.16))
        if st>=DURATION_S-0.7: continue
        radius_mm=float(rng.uniform(2.2,7.2))
        f0=3260.0/radius_mm
        dur=float(rng.uniform(0.14,0.34))
        amp=float(rng.uniform(0.0045,0.0115))*(0.85+0.15*(radius_mm/7.2))
        pan=float(np.clip(base_pan+rng.normal(0,0.10),-0.78,0.78))
        events.append((st,dur,f0,amp,pan,radius_mm))

for st,dur,f0,amp,pan,radius_mm in events:
    a=int(round(st*SR)); m=max(8,int(round(dur*SR))); b=min(N,a+m); m=b-a
    if m<=8: continue
    q=np.arange(m,dtype=np.float32)/SR
    attack=max(1,int(0.012*SR))
    envb=np.exp(-q/max(0.05,dur*0.34)).astype(np.float32)
    aa=min(attack,m)
    envb[:aa]*=(0.5-0.5*np.cos(np.linspace(0,np.pi,aa,dtype=np.float32)))
    k=0.055/dur
    phase=2*np.pi*(f0*q - 0.5*f0*k*q*q)
    tone=(np.sin(phase)+0.12*np.sin(2*phase+0.3))*envb*amp
    gl=math.sqrt((1-pan)/2); gr=math.sqrt((1+pan)/2)
    L[a:b]+=tone.astype(np.float32)*gl
    R[a:b]+=tone.astype(np.float32)*gr

fade=int(2.5*SR)
f=np.linspace(0,1,fade,dtype=np.float32)
f=0.5-0.5*np.cos(np.pi*f)
L[:fade]*=f; R[:fade]*=f
L[-fade:]*=f[::-1]; R[-fade:]*=f[::-1]

peak=max(float(np.max(np.abs(L))),float(np.max(np.abs(R))))
if peak>0.92:
    sc=0.92/peak; L*=sc; R*=sc

stereo=np.column_stack((L,R))
raw=OUT/'A1_pecera_firstparty_raw.wav'
sf.write(raw, stereo, SR, subtype='PCM_24')

meta={
  'schema':'RINCON_A1_FIRSTPARTY_AUDIO_SOURCE/1.0',
  'seed':SEED,
  'sample_rate_hz':SR,
  'samples':N,
  'duration_s':N/SR,
  'channels':2,
  'source':'deterministic synthetic DSP; no samples/recordings/third-party media',
  'water_body_hz':[35,700],
  'water_texture_hz':[260,2400],
  'bubble_model':'Minnaert-inspired resonance f_hz = 3260/radius_mm with smooth attack/exponential decay',
  'bubble_event_count':len(events),
  'bubble_mean_events_per_s':len(events)/(N/SR),
  'bubble_radius_mm':[2.2,7.2],
  'voice':False,
  'music':False,
  'loop':False,
  'design':'stable low-frequency water body + sparse irregular soft bubble resonances; low-stimulation'
}
(OUT/'A1_pecera_audio_source.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(meta,ensure_ascii=False))
