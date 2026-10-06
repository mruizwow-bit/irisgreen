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
