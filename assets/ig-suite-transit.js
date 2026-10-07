/* Circular-orbit, uniform stellar-disc simulation. Not a measured planetary system.
 * Conventions: NASA Exoplanet Archive pl_orbincl and pl_ratdor.
 * https://exoplanetarchive.ipac.caltech.edu/docs/API_transit_detection.html
 * No limb darkening, eccentricity, stellar variability or instrument systematics.
 */
(function (root) {
  'use strict';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function defaults() { return {a:6, radius:0.1, inclination:90, cadence:5, noise:100, phase:0.94}; }
  function validate(p) {
    return p && [['a',3,30],['radius',0.01,0.3],['inclination',60,90],['cadence',2,120],['noise',0,5000],['phase',0,1]]
      .every(([k,a,b]) => typeof p[k] === 'number' && Number.isFinite(p[k]) && p[k]>=a && p[k]<=b);
  }
  // Intersection area of discs with radii 1 and r, divided by pi.
  function occulted(d,r) {
    if (d >= 1+r) return 0;
    if (d <= 1-r) return r*r;
    const a=Math.acos(clamp((d*d+1-r*r)/(2*d),-1,1));
    const b=Math.acos(clamp((d*d+r*r-1)/(2*d*r),-1,1));
    const q=Math.sqrt(Math.max(0,(-d+1+r)*(d+1-r)*(d-1+r)*(d+1+r)));
    return (a+r*r*b-q/2)/Math.PI;
  }
  function period(p) {
    // Fixed solar mass and radius; a is in stellar radii, result in minutes.
    return 2*Math.PI*Math.sqrt(Math.pow(p.a*695700000,3)/1.32712440018e20)/60;
  }
  function position(p,minutes) {
    const angle=2*Math.PI*(p.phase+minutes/period(p)), i=p.inclination*Math.PI/180;
    const x=p.a*Math.sin(angle), y=p.a*Math.cos(angle)*Math.cos(i), z=p.a*Math.cos(angle)*Math.sin(i);
    return {x,y,z,flux:1-(z>0?occulted(Math.hypot(x,y),p.radius):0)};
  }
  function sample(p,minutes,random) {
    // A finite exposure is an average, not an instantaneous sample. Twenty
    // midpoint sub-exposures resolve ingress without assuming a box-shaped dip.
    let sum=0;
    for(let i=0;i<20;i++) sum+=position(p,minutes+((i+0.5)/20-0.5)*p.cadence).flux;
    const expected=sum/20;
    const normal=p.noise && random ? Math.sqrt(-2*Math.log(Math.max(1e-12,random())))*Math.cos(2*Math.PI*random()) : 0;
    return {expected, measured:expected+normal*p.noise/1e6};
  }
  root.IGTransit={defaults,validate,occulted,period,position,sample};
})(typeof window==='undefined'?globalThis:window);
