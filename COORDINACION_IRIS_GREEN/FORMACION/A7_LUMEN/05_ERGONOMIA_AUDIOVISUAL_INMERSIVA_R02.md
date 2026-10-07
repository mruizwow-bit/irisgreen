# LUMEN · ERGONOMÍA AUDIOVISUAL E INMERSIVA R02

Fecha: 30/09/2026
Agente: A7
Puesto: Immersive Media & Interactive Audiovisual Engineer
Estado: ADVANCED_STUDY_R02

## Por qué esta ampliación
La foundation R01 cubría tecnología, accesibilidad, media, audio y QA. Esta ampliación añade ergonomía específica de entornos inmersivos y efectos adversos de imagen, luz y sonido.

## ISO 9241-820:2024 · interacción en entornos inmersivos
Publicada en 2024. El resumen oficial la sitúa en sistemas donde la persona percibe presencia en mundos virtuales, AR/VR/MR y entornos simulados, con foco en problemas ergonómicos y de interacción humano-sistema.

Aplicación a Lumen:
- presencia no equivale a espectáculo;
- estudiar relación entre interacción y experiencia humana;
- evaluar controles, orientación, carga perceptiva y salida;
- usar el marco como conocimiento de ergonomía inmersiva aunque el Rincón actual no sea VR con HMD.

Fuente:
https://www.iso.org/standard/84583.html

## ISO 9241-394:2020 · visually induced motion sickness
Publicada en 2020 y confirmada por ISO en 2025. Su alcance incluye requisitos y recomendaciones para contenido de imagen y sistemas de visualización destinados a reducir efectos no deseados de mareo inducido visualmente.

Aplicación:
- movimiento de cámara/campo visual es decisión ergonómica;
- una escena lenta puede seguir siendo problemática;
- reduced motion no sustituye estudiar VIMS;
- paisajes con cámara fija tienen una ventaja potencial de confort que debe validarse, no presumirse.

Fuente:
https://www.iso.org/standard/73227.html

## ISO 9241-391:2016 · fotosensibilidad
La edición 2016 es la edición publicada mientras una edición 2 está en desarrollo como Committee Draft.

Regla:
- no convertir el borrador en requisito vigente;
- vigilar flashes y patrones repetitivos;
- mantener WCAG y coordinación con Axioma como capa web aplicable;
- revisar la edición nueva cuando se publique.

Fuentes:
https://www.iso.org/standard/56350.html
https://www.iso.org/standard/94287.html

## ISO 9241-392:2015 · fatiga visual estereoscópica
Sigue publicada y está en revisión sistemática. Es relevante si Iris Green entra algún día en estereoscopía/HMD. No se usa como obligación sobre una pantalla web 2D ordinaria.

Fuente:
https://www.iso.org/standard/60317.html

## ISO/TS 9241-620:2023 · papel del sonido
Technical Specification publicada en 2023 y en revisión sistemática en 2026. El resumen oficial aborda la influencia del sonido en entornos de uso de sistemas interactivos y el control de efectos no deseados del ruido.

Aplicación:
- el sonido ambiental no se evalúa solo por gusto;
- hiss, ruido persistente y carga acústica importan;
- el ambiente sonoro forma parte del contexto de uso;
- su alcance no cubre prevención de pérdida auditiva, así que no sustituye safe-listening específico.

Fuente:
https://www.iso.org/standard/84930.html

## ISO/TR 9241-610:2022 · luz e iluminación
Technical Report publicado en 2022. Resume consideraciones ergonómicas de la influencia de luz e iluminación en personas usuarias de sistemas interactivos, incluidos efectos no visuales. Excluye uso terapéutico de la luz.

Aplicación:
- no usar “luz calmante” como claim terapéutico;
- luminancia, contraste, cambios de luz y contexto importan;
- evitar transiciones abruptas y flashes;
- evaluar efectos visuales en contexto de uso, no solo por estética.

Fuente:
https://www.iso.org/standard/80750.html

## Reglas R02 de Lumen
1. Movimiento global de cámara/campo visual se trata como riesgo perceptivo.
2. Las escenas inmersivas requieren gate de mareo/malestar, además de reduced motion.
3. Flashes y patrones repetitivos necesitan evaluación específica.
4. Un borrador futuro no sustituye la edición publicada.
5. Ruido ambiental/hiss forma parte de ergonomía de uso.
6. Luz e iluminación no se presentan como terapia.
7. Si aparece estereoscopía/HMD, abrir gate específico de fatiga visual y ergonomía XR.
8. “Calma” no se presume: se observa en HUMAN QA.

## Prácticas R02 pendientes
- protocolo QA de VIMS para escenas no-HMD;
- matriz movimiento de cámara vs movimiento local;
- test de patrones/flashes con Axioma;
- test de ruido/hiss y transiciones con Eco cuando corresponda;
- revisión de luminancia/cambios de luz;
- si entra XR: evaluación específica 820/392 y XAUR.

## Estado
Estudio avanzado R02 completado a nivel documental.
Prácticas perceptivas y de dispositivo siguen pendientes.
