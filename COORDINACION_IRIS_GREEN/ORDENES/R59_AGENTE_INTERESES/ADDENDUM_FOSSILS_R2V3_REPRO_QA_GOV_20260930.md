# R59 · FÓSILES R2v3 · CONTRATO REPRO ACEPTADO / QA NOMINAL + GOV BLOQUEADOS

Fecha: 30/09/2026  
Issue: #323

Estado:

`R59_FOSSILS_R2V3_REPRO_CONTRACT_ACCEPTED_QA_NOMINAL_GOV_STILL_BLOCKED`

## KEEP

Producto visual/técnico R2 sigue PASS.

No rerender.
No rework visual.

Se acepta como mejora válida:
- manifiesto de 74 entradas;
- cobertura de web/fuente/qa/doc;
- verificación de entradas antes de regeneración;
- regeneración en carpeta temporal;
- comparación byte/pixel;
- códigos 0/1/2/3;
- self-test del contrato;
- sellos de QA contra digest del manifiesto.

## QA-01 sigue abierto

`qa/shots.py` declara `idx` para cuatro hallazgos pero no lo usa.

No hay selección explícita ni assert del fósil activo antes de screenshot.

Evidencia:
- captura `18-hallazgo-trex-diente.png` muestra Iguanodon;
- captura `17-hallazgo-mamut-molar.png` duplica byte-exactamente una captura general anterior.

Corrección:
1. seleccionar objetivo por id/índice;
2. assert de objetivo activo;
3. fail nonzero si no coincide;
4. regenerar 4 capturas nominales;
5. regenerar manifiesto/sellos;
6. añadir prueba negativa del arnés.

## GOV-01 sigue abierto

El informe conserva rama:
`codex/r59-intereses-fase1`.

Coordinación vigente:
Agente R59 activo / Codex HOLD hasta 01/10/2026.

Documentar:
- ejecutor real;
- por qué la rama conserva ese prefijo;
- si es nombre histórico o ejecución Codex.

## Siguiente gate

`R59_FOSSILS_PILOT_R2V4_NOMINAL_QA_GOV_FIXED_READY_FOR_ASTRA_MARIA`

STOP.

No Minerales.
No A2.
No main.
No producción.

No cambia normativa transversal.
