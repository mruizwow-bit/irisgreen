# ADDENDUM R42 · Child Safety transversal a toda la web · 27/09/2026

Autoridad: decisión expresa de María en fase de integración R42.

Este addendum amplía el alcance operativo de la reactivación registrada en #293. La limitación anterior “solo Design/contenido” queda superada para el nuevo baseline R42.

Se conserva el modelo aprobado `audience / sensitivity / discovery` y sus garantías de minimización. No se introduce comprobación de edad ni recopilación de datos personales.

Regla de seguridad arquitectónica:
**el contenido S2 completo no puede viajar en HTML, SSR, payload inicial, preload o prefetch de DEFAULT, INFANCIA o ADOLESCENCIA.**

La protección debe producirse antes del render y también antes del discovery. Ocultar con CSS/JS después de descargar el contenido no cumple.

La aplicación es transversal a shell, navegación, búsqueda/autocomplete, related, catálogos, contenido, Investigación, Recursos, Juegos, Rutinas, Intereses, Taller y Rincón, incluidos los enlaces entre superficies.

Los parches #294–#297 del baseline anterior permanecen pausados y no se reutilizan por cherry-pick. La implementación se construirá de nuevo contra el baseline integrado vigente.

Gate obligatorio: pruebas DOM + red + navegación + lector de pantalla + ES/EN + desktop/móvil + transición ADULTEZ→INFANCIA/ADOLESCENCIA.

No main. No producción.
