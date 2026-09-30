# R42 · RECURSOS · CORREGIR DOCUMENTO/ORDEN CADUCADA CONTRA A2 VIVO

Fecha: 30/09/2026  
Issue: #286  
Ejecutor de corrección documental: Claude  
Revisión: Aura/Astra

HEAD A2 de referencia al auditar:
`8ea50128b490207b4dd5508c3c46692f5be69c87`.

## Objetivo

Corregir el documento del 27/09 con las tandas A–F sin convertir fixes locales o divergidos en hechos del A2 vivo.

Usar estados explícitos:
- `CONFIRMED_CURRENT_A2`;
- `LOCAL_ONLY`;
- `BUILD_PIPELINE_PENDING`;
- `STILL_OPEN`;
- `REFERENCE_ERROR`;
- `REMOVE_FALSE_CONSTRAINT`.

## Correcciones obligatorias

1. Defecto 1 Tarjeta preview:
   - marcar hecho en A2;
   - commit 80c0c176 es ancestro;
   - rAF + input presentes;
   - no afirmar “4 sentencias input”: hay 2 sentencias aplicadas a grupos.

2. Defecto 2 Lectura:
   - NO cerrar como hecho directo;
   - 1a4ab3a4 diverge de A2 vivo;
   - R67 inyecta preferencias-lectura.js en build;
   - estado final pendiente del dist/preview R67.

3. Defecto 6 privacidad:
   - registrar resultado local 1134/57/0 como evidencia local;
   - revalidar sobre build del HEAD A2 vigente antes de PASS de integración.

4. Defecto 10:
   - EN Tarjeta enlazada;
   - ES contar-y-pagar sigue sin enlace en hub.

5. Defecto 11:
   - ruta EN existe;
   - corregir CTA porque connect_tarjetas_iris_en.py sigue apuntando a ES.

6. Restricción falsa:
   - eliminar dependencia inventada de styleSheets/CSS en rutinas-imprimibles.js.

7. Referencias:
   - test_rutinas_visuales.py: literales en línea 52;
   - pic(id) usa .file, no .sprite.

8. Cierre tanda A:
   - audit_axe_wcag duplica Juegos, sí tiene algunas rutas EN, pero no Tarjeta/Rutinas;
   - audit_target_size duplica Juegos, no tiene rutas EN, ni Tarjeta/Rutinas;
   - corregir cobertura sin afirmar “0 EN” en axe.

9. Defecto 7:
   - BATCHES 58 / sources 93 / sprites 13 confirmado;
   - pero esos 93 son manifest histórico;
   - catálogo vivo usa SVG individuales;
   - no ampliar BATCHES a ciegas: retirar o reconciliar generador histórico.

10. Defecto 8:
    - corregir solo /assets/pictos/* → /assets/pictogramas/pictos/;
    - /assets/dinero/* existe.

11. Defecto 12:
    - Tarjeta sigue fuera de sitemap.

12. Buscador:
    - 372 entradas;
    - juegos 0;
    - tarjeta 0.

13. unsafe-eval:
    - medir dist, no source;
    - source _headers puede contenerlo antes de finalize_dc_runtime_csp.py;
    - check_csp_eval_scope.py debe quedar verde en dist.

## Estructura

Conservar cadena A→B→C→D→E y F independiente si no cambia por estas correcciones.

Rehacer la recomendación “por dónde empezar” con pendientes reales, no con defectos ya cerrados/locales.

No tocar producto desde esta orden.
No main.
No producción.
