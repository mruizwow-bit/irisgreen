/* R04 · parámetros de entrada del cielo movidos a datos. */
(function(g){
'use strict';
g.IG_R04_CIELO={
  entrada:{ruta_id:'anclas',offset_ra_horas:1.35,offset_dec_grados:15,
    declaracion:'Desvío de encuadre para no resolver el primer patrón al entrar; es dato de experiencia, no horizonte local.'},
  profundidad_aire:{inicio_rel_y:0.56,atenuacion_max:0.55,tinte_calido:'#F0C6A0'},
  suelo_perceptual:{alto_rel:0.115,declaracion:'Silueta genérica de encuadre; no representa un lugar ni un horizonte astronómico calculado.'}
};
})(typeof window!=='undefined'?window:globalThis);
