# Orden · Agente 2 · integración R40-RINCON-R03

Agente 2 es la única puerta a la web.

Cuando A7 entregue el estado `R40_RINCON_R03_FULL_AUDIO_UX_BUILD_READY_FOR_A2`:

1. revisar el delta;
2. integrar sobre la rama web vigente;
3. resolver conflictos conservando la intención de #269;
4. ejecutar build/gates;
5. publicar Deploy Preview;
6. registrar HEAD, tree, deploy y URL exactos;
7. realizar comprobación live ES/EN;
8. entregar la URL para escucha y revisión visual humana;
9. si hay defectos, devolverlos a A7, reintegrar y volver a subir.

No considerar aceptado el Rincón por checks estáticos/locales. La aceptación exige comprobar la web real.

No merge a main ni producción sin autorización de María.
