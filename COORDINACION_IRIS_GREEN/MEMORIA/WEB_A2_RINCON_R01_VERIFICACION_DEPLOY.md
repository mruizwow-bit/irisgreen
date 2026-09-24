# WEB-A2-RINCON-R01 · verificación en despliegue real

Fecha: 24/09/2026  
Responsable: María + Agente 2

## Alcance

Integración del Rincón tranquilo / Quiet space sobre la web Iris Green vigente.
No se modifican Juegos, Rutinas, Taller, Intereses ni otras líneas de producto.

## Código e integración

- Rama de integración: `integration/irisgreen-full-r35-20260923`
- HEAD verificado: `7b3a92723da442bbef692ae9780961f58ee1049c`
- Commit funcional principal: `38815375c904283eb7af07e4655589177abb6ff6`
- Backup previo creado: `backup/a2-before-rincon-3d-20260924`
- Deploy real dentro de `irisgreen-home`: `6ab4fee488beef00088f5b90`
- Estado Netlify: READY
- URL de candidato: https://deploy-preview-236--irisgreen-home.netlify.app

## Contenido verificado

- ES: `/es/sitio-tranquilo/`
- EN: `/en/quiet-space/`
- Acuario 3D local, carga diferida y fallback 2D.
- Tubo de burbujas 3D local, carga diferida y fallback 2D.
- Pausa guiada 4 s / 6 s.
- Pantalla limpia.
- Opciones de velocidad y color.
- Reduced motion conserva los pasos textuales sin depender de animación.
- El bundle 3D se recompone dentro del build staging desde una copia verificada y no requiere CDN.

## QA ejecutado dentro de la web desplegada

Workflow: `Rincón live QA`  
Run: `35988912524`  
Job: `107598041760`  
Resultado: **SUCCESS**  
Artefacto: `rincon-live-qa` ID `10803930128`, digest `sha256:1acdb53a8f42504449a5387782996b88a0c1db8544ec12dfcf582e3c81087c4f`.

Casos PASS:

1. Acuario ES escritorio · WebGL disponible.
2. Tubo de burbujas ES escritorio.
3. Acuario EN escritorio · WebGL disponible.
4. Tubo de burbujas EN escritorio.
5. Acuario ES móvil · WebGL disponible.
6. Tubo de burbujas ES móvil.
7. Reduced motion ES móvil · los pasos textuales avanzan sin usar la animación como único canal.

Comprobaciones adicionales del workflow:

- nada 3D ni vídeo se inicia al abrir la página;
- audio no se inicia solo;
- el bundle 3D se solicita después de la interacción, no en la carga inicial;
- nombres accesibles del canvas de acuario y tubo;
- Pantalla limpia operativa;
- sin desbordamiento horizontal en escritorio/móvil en los escenarios probados.

Capturas del propio despliegue generadas en el artefacto:
`rincon-es-desktop.png`, `rincon-en-desktop.png`, `rincon-es-mobile.png`, `rincon-es-reduced-mobile.png`.

## Otros checks del PR

El mismo HEAD pasa los checks generales de audio/movimiento, axe, orientación, contraste no textual, tamaño de objetivos, CSP, Lighthouse y navegador v2.

Hay fallos generales en el PR que **no proceden del Rincón** y ya estaban en otras superficies/expectativas:
- prueba de Rutinas visuales espera 58 pictogramas pero la fuente tiene 93;
- auditoría de almacenamiento detecta usos de sessionStorage en módulos globales/Rutinas/Tarjeta/Intereses/Taller, no en el módulo del Rincón;
- SEO falla en Taller/Intereses;
- contraste con gradientes falla en `/es/videos/`;
- teclado falla en el visor de Libros;
- comprobación previa registra fallos de Taller/Intereses; su caso específico de `/es/sitio-tranquilo/` a 320 px pasa.

## Estado

**VERIFICADO_EN_DEPLOY_REAL_EN_SU_ALCANCE**

No se confunde con merge a main ni apertura de producción. La petición de María de comprobar dentro de la web queda satisfecha mediante el deploy real de `irisgreen-home` y QA de navegador sobre ese mismo despliegue.
