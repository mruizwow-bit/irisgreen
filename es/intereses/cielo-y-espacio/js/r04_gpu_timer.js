/* R04 · GPU timer opcional WebGL2. Nunca inventa cifra si la extensión no existe. */
(function(g){
'use strict';
function Timer(gl){
  this.gl=gl; this.ext=gl&&gl.getExtension&&gl.getExtension('EXT_disjoint_timer_query_webgl2');
  this.pendientes=[];
}
Timer.prototype.disponible=function(){return !!this.ext;};
Timer.prototype.iniciar=function(etiqueta){
  if(!this.ext) return null;
  var q=this.gl.createQuery(); this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT,q);
  return {q:q,etiqueta:etiqueta||'gpu'};
};
Timer.prototype.terminar=function(t){
  if(!this.ext||!t) return; this.gl.endQuery(this.ext.TIME_ELAPSED_EXT); this.pendientes.push(t);
};
Timer.prototype.leer=function(){
  if(!this.ext) return [];
  var gl=this.gl, ext=this.ext, out=[], keep=[];
  var disjoint=gl.getParameter(ext.GPU_DISJOINT_EXT);
  this.pendientes.forEach(function(t){
    var listo=gl.getQueryParameter(t.q,gl.QUERY_RESULT_AVAILABLE);
    if(listo&&!disjoint){out.push({etiqueta:t.etiqueta,ms:gl.getQueryParameter(t.q,gl.QUERY_RESULT)/1e6});gl.deleteQuery(t.q);}
    else keep.push(t);
  });
  this.pendientes=keep; return out;
};
g.IG_R04_GPUTimer=Timer;
})(typeof window!=='undefined'?window:globalThis);
