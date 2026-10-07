# AXIOMA · Cielo y Espacio R03 · estado y handoff del bloque Cielo 88/88

Fecha: 2026-10-07
Estado: `AXIOMA_TEMP_COVER_CIELO_ESPACIO_R03_ACTIVE`

## Autoridad
- Orden: commit `11d72c535c3e2cf891a2023c9048e158a91246e1`
- Registro: #323 · `6031525772`

## Artefacto
`CIELO_ESPACIO_R03_CIELO_88_AXIOMA_R01.zip`
SHA-256 `7157fb1f54b2e4f48a0cc5e91df03a281a81733f6c9c8c2be31420700f1f0946`

Generado con `git archive` desde el commit local aislado:
`2f327c39b24298d65557a481b6ee25dfa3192a45`

## Base LOCKED
`CIELO_3D_R02_1.zip`
SHA-256 `1f7e6ac7aab0b56d88b880375049a621bb85d9e0bc74105366f1d71073423ba8`

Se conserva esfera continua, cámara, evidencia angular, selección, ambigüedad, cuaderno, storage compatible hacia delante, ES/EN y NORMAL/REDUCED/NONE.

## Resultado Cielo R03
- 88/88 constelaciones.
- 3.248 estrellas, magnitud límite 5,6.
- 767 vértices, 743 aristas.
- 88 fichas ES/EN.
- 88 SVG canónicos.
- 2 vértices no observables declarados: Cetus y Perseus.
- 22 rutas humanas: 1 libre, 12 región, 4 temporada, 5 ancla.
- “Seguir desde aquí”.
- Hallazgo fuera de ruta siempre válido.

## Pipeline visual
Fuente canónica:
`IRIS_GREEN_CIELO_CONSTELACIONES_01_88_PIPELINE_R03 (1).zip`
SHA-256 `6606430fcc0cf732bb794d8d582bcb31b3e643ac76c96e241c74a8418264df47`

Comprobación: 88/88 SVG byte a byte iguales.

## SKY-SCALE-01
Hidra, Erídano, Serpiente, Virgo y Osa Mayor disponen de identificación única sin rebajar el mínimo semántico.

## SKY-SCALE-02
Barrido real:
- 1.584 direcciones;
- 399 únicas;
- 4 ambiguas;
- tasa 0,2525 %;
- pares: Cen/Cru, Eri/Hor, Sco/Sgr, Cep/Lac.

Muestreo dirigido:
- 2.378 posiciones;
- 1.465 únicas correctas;
- 6 ambiguas con el objetivo;
- 16 donde una figura vecina gana;
- 891 ninguna;
- 88/88 tienen al menos una posición única correcta.

## Browser smoke
Chrome real por `file://`:
- 320×568: cielo 53,5 %;
- 390×844: 68,7 %;
- 1440×900: 72 %;
- 0 controles visibles <44 px en la sonda;
- 0 overflow horizontal;
- ~1,05–1,35 ms/cuadro en IrisGreen;
- ficha de Hidra carga fuera del antiguo subset;
- ruta seleccionada persiste al recargar.

## Cha / Vol
Mantienen `pendiente_revision_perceptual=true`.
R03 añade ancla previa y separación angular en rutas regionales; la revisión humana sigue pendiente.

## Regla 3D para siguientes bloques
Orden de María:
`TRUE_3D_WHERE_OBJECT_HAS_REAL_VOLUME`

Axioma crea directamente geometría volumétrica procedural para Sol, planetas, lunas y planetas enanos cuando haga falta.

No usar billboards finales para cuerpos físicos.
Apariencia conocida → material respaldado.
Apariencia desconocida → `UNKNOWN_APPEARANCE_REPRESENTATION`.
No inventar superficies observadas.

Las constelaciones no se extruyen: son patrones angulares.

## Pendientes Cielo
- HUMAN QA de “Desde Rigel…”.
- HUMAN QA de las cuatro zonas ambiguas.
- revisión Cha/Vol.
- teléfono físico.
- AT real.
- benchmark final con Cielo y Espacio completo.

## Siguiente bloque
Sistema Solar volumétrico.

Orden:
`88 constelaciones → Sistema Solar → lunas/planetas enanos → meteoros → exoplanetas`.

Eclipses sigue KEEP salvo defecto demostrado.

## Handoff
Cuando Claude vuelva:
- usar esta rama;
- usar este ZIP + SHA;
- leer evidencia incluida;
- continuar desde este documento;
- no reconstruir desde chat.

NO MAIN · NO PUBLIC DEPLOY.
