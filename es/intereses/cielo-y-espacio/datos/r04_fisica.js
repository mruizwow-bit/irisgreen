/* Cielo y Espacio R04 · datos físicos añadidos por la orden 07/10/2026.
   No sustituye datos existentes: añade solo achatamiento y fase orbital media
   para las 21 lunas con textura. */
(function(g){
'use strict';
var EPOCH_JD = 2451545.0; /* 2000-01-01.5 TDB */
var JPL = 'https://ssd.jpl.nasa.gov/sats/elem/sep.html';
var A = {
  tierra:{f:0.00335,fuente:'orden-r04 / NASA fact sheet'},
  marte:{f:0.00589,fuente:'orden-r04 / NASA fact sheet'},
  jupiter:{f:0.06487,fuente:'orden-r04 / NASA fact sheet'},
  saturno:{f:0.09796,fuente:'orden-r04 / NASA fact sheet'},
  urano:{f:0.02293,fuente:'orden-r04 / NASA fact sheet'},
  neptuno:{f:0.01708,fuente:'orden-r04 / NASA fact sheet'}
};
var M = {
  luna:{M0:135.27,P:27.322},
  fobos:{M0:189.7,P:0.3187},
  deimos:{M0:205.0,P:1.2625},
  io:{M0:330.9,P:1.762732},
  europa:{M0:345.4,P:3.525463},
  ganimedes:{M0:324.8,P:7.155588},
  calisto:{M0:87.4,P:16.690440},
  mimas:{M0:275.3,P:0.942422},
  encelado:{M0:57.0,P:1.370218},
  tetis:{M0:0.0,P:1.887802},
  dione:{M0:212.0,P:2.736916},
  rea:{M0:31.5,P:4.517503},
  titan:{M0:11.7,P:15.945448},
  japeto:{M0:74.8,P:79.331002},
  miranda:{M0:73.0,P:1.413479},
  ariel:{M0:193.5,P:2.520379},
  umbriel:{M0:253.0,P:4.144177},
  titania:{M0:68.1,P:8.705869},
  oberon:{M0:143.6,P:13.463237},
  triton:{M0:63.0,P:5.876994,retrograda:true},
  caronte:{M0:304.1,P:6.387222}
};
Object.keys(M).forEach(function(id){ M[id].epoca_jd=EPOCH_JD; M[id].fuente=JPL; });
function jd(fecha){ return fecha.getTime()/86400000 + 2440587.5; }
function faseOrbital(id,fecha){
  var q=M[id]; if(!q) return null;
  var d=jd(fecha)-q.epoca_jd;
  var signo=q.retrograda?-1:1;
  var deg=(q.M0 + signo*360*d/q.P)%360;
  return ((deg%360)+360)%360;
}
function escalaPolar(id){ var q=A[id]; return q?1-q.f:1; }
g.IG_R04_FISICA={achatamiento:A,lunas:M,epoca_jd:EPOCH_JD,fuente_jpl:JPL,faseOrbital:faseOrbital,escalaPolar:escalaPolar,sombras_mutuas:{solo_al_rodear:true,declaracion:'Coherentes con la geometría dibujada; no son una predicción de tránsito real.'}};
if(typeof module!=='undefined'&&module.exports) module.exports=g.IG_R04_FISICA;
})(typeof window!=='undefined'?window:globalThis);
