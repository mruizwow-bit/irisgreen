# Auditoría Astra · child-safe global + Cloud R04 · 28/09/2026

## Child-safe A2

Estado:
`R51_A2_AGE_FILTER_GLOBAL_FAIL_RECLASSIFICATION_REQUIRED`

HEAD A2:
`5f759464dfa6f78d1843f9414f5b2207da33700a`

Hallazgo:
el runtime cambia correctamente el estado de audiencia, pero la clasificación subyacente impide un filtrado real por edad.

Registro actual:
- 223 Situaciones = TRANSVERSAL
- 226 Condiciones = TRANSVERSAL
- 62 Vida diaria = TRANSVERSAL
- 60 Datos = TRANSVERSAL
- 132 Investigación = ADOLESCENCIA+ADULTEZ
- 262 Trámites = ADULTEZ

Por eso al elegir la franja infantil se sigue viendo casi todo.

El test browser existente solo valida Investigación/Trámites/Cuestionarios y no cobertura individual de 965 fichas.

Requiere reclasificación real 965/965 usando:
AGE_0_12 / AGE_13_17 / AGE_18_PLUS / ALL_AGES.

## Cloud R04

Estado:
`R51_A9_R04_PROGRESS_PASS_AGE_TAXONOMY_RECLASSIFICATION_REQUIRED`

Rama:
`agent9/r51-cloud-library-r04-20260927`

HEAD:
`b2c8bec660b63fe39f145c71c92129558c281b01`

Último bloque terminado: 5B Rutinas.

R04 aún no está sellada ni terminada.

Pendientes: Intereses, Taller, Rincón, Home final, freeze A2 final, rutas pendientes, updater/delta completo, sellado y gate retrieval final.

A2 actual sigue configurado contra biblioteca anterior:
`n04-es-20260916-56f72c4d3959`.

R04 hereda el mismo problema de audience: adapters usan TRANSVERSAL masivo y taxonomía legacy. No sellar hasta reclasificar.

Regla:
sensibilidad S0/S1/S2 y edad son ejes independientes.

No asumir S0 = todas las edades.

## Gates esperados

A2:
`R51_A2_GLOBAL_AGE_FILTER_965_RECLASSIFIED_READY_FOR_ASTRA`

A9:
`R51_A9_R04_AGE_TAXONOMY_RECLASSIFIED_READY_FOR_ASTRA`
