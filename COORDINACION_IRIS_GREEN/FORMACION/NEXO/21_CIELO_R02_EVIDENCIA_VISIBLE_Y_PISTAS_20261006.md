# Nexo · Aprendizaje Cielo R02
2026-10-06. Práctica sobre ZIP 581368ff4b2db0208274f3d8cca65f4973b64a4038e4c15b209a8591cd814cfa.
Informe: COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_CIELO_COMPLETO_R02_20261006/ANALISIS_R02_Y_PATCH_R02_1.md, rama nexo/new-games-area-r01-20261004.

1. Evidencia visible no significa requisito variable hacia cero. Si sólo queda una estrella del cinturón visible, 1/1 no demuestra tres alineadas. Separar visibilidad, comodidad motora y mínimo semántico del patrón; motor, marcadores y descripción comparten la misma evidencia.
2. Una pista única en el dataset puede ser inutilizable en pantalla: 53/88 pistas de R02 dependen de magnitudes numéricas. Validar lo que la persona puede distinguir, no sólo unicidad de cadenas o valores.
3. Buscar encuadres hasta conseguir el resultado demuestra alcanzabilidad. No es una matriz de precisión de intención. Fijar intención/gesto antes y conservar todos los resultados, también los fallos.
4. Cada dominio asíncrono requiere identidad/cancelación: token de campo no invalida dos fichas del mismo campo ni un cierre. Reproducido con callbacks invertidos en VM.
5. En multitouch hay transición de propiedad del gesto. Rebasar referencias al pasar de dos dedos a uno. El pinch por sí solo puede pasar mientras el pan siguiente salta.
6. Guardado en memoria no es persistencia. Probar cerrar/recargar sin pasar por la ruta feliz de Volver; validar números además de versión.
7. Medir intersección visible con viewport y oclusión, no llamar cielo visible a toda la altura CSS aunque quede fuera de pantalla.
8. La coordinación también puede introducir regresiones: mi orden pedía nombrar Orión antes de hallarlo. Corregir mi instrucción a entrada neutra; no culpar a quien la implementó.
9. La inspección de vídeo se describe por su alcance (fotogramas muestreados); Node VM con DOM simulado no es navegador ni touch físico. Evidencia del autor conserva autoría.
10. Comprobar unidades y casos límite en fórmulas geométricas: apertura de R02 comunica6° al centro cuando su propia inversa produce radio11.9274°. Una cifra que disminuye al hacer zoom no valida la geometría.

Próxima práctica: retest del patch con los negativos anteriores, luego revisión humana de pistas y continuidad. KEEP datos/assets/motor; no convertir defectos acotados en reconstrucción total.

## Ampliación · contraste Prisma/Axioma
Fuentes leídas: revisión Prisma d1086f84d136936d0004f69fc75ba76266efc79c y comentario Axioma6012932552 de #323.
Orden consolidada: ANALISIS_R02_Y_PATCH_R02_1.md, commit1f7d6625f6ea0d2c381296710e19ce9695453f9f en nexo/new-games-area-r01-20261004.

11. Tolerancia de entrada y evidencia semántica viven en espacios distintos: CSS px para adquirir; coordenadas/ángulos del cielo para sustentar el patrón. Un target cómodo no aporta evidencia adicional.
12. Comparar viewports requiere fijar punto astronómico, cámara, apertura y visibilidad. El contraejemplo Andrómeda de Prisma evidencia decisiones diferentes sobre el mismo punto. Tasas agregadas de taps no son tasas de error humano ni sustituyen casos pareados.
13. La equivalencia no exige identificar con evidencia oculta: si recorte/horizonte/panel reducen visibilidad, conservar mínimo semántico y declarar insuficiencia. No normalizar un punto hasta convertirlo en patrón completo.
14. Recalcular el objetivo y mostrarlo son operaciones separadas. Mantener la lectura del hallazgo actual; presentar siguiente pista al volver a explorar. Sin temporizadores ni lectura obligatoria.
15. Probar foco inmediatamente tras transición y después de resize/orientación. Tabular hasta reencontrar escena puede ocultar la pérdida original. Preservar nodos cuando sea posible.
16. Semántica y comportamiento deben coincidir: confirmación modal de borrado con Cancelar inicial, Escape, fondo inerte y retorno; ficha informativa no hereda modalidad por compartir contenedor.
17. Preferencia del sistema y elección explícita necesitan precedencia y actualización. reduce→REDUCED como default del patch; NONE disponible; elección propia prevalece. No convertir una duración breve en evidencia de comodidad.
18. Repetir65/65 tests aumenta confianza en sus contratos, no amplía lo que preguntan. Autoría de resultados: Prisma/browser, Nexo/VM y Axioma/inspección+pendientes AT se conservan.
19. Resolver contradicciones de coordinación dentro de la orden existente. Empezar a explorar antes del hallazgo, Volver a Orión después. No delegar otra vez una decisión ya fijada.
20. Marco técnico, guía y aplicabilidad jurídica se separan. La revisión de Axioma no se convierte automáticamente en verificación normativa propia de Nexo.

Prácticas pendientes: cerrar SAME_SKY_EVIDENCE_320_390_1440, LOW_EVIDENCE_NEVER_IDENTIFIES, SCREEN_TRANSITION_FOCUS_ORACLE y RESIZE_FOCUS_STABILITY_ORACLE sobre R02.1 real. Documentación de aprendizaje actualizada; competencia demostrada pendiente de esas reproducciones y revisión humana.
