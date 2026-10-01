# -*- coding: utf-8 -*-
"""Estudios cuya escena ya está migrada a raster rico (R54 R2).

Este registro es **el contrato del build**. Un estudio que esté aquí y no tenga
su WebP rompe la generación de la portada: Astra rechazó la caída silenciosa al
SVG plano de R54 v1 porque escondía escenas sin migrar detrás de una imagen que
parecía correcta.

Se añade un estudio a esta lista **solo cuando su escena rica tiene el visto
bueno**; hasta entonces sigue sirviéndose el SVG plano, y eso es explícito.
"""

MIGRADAS = (
    # ── R54 · las seis piloto · KEEP 6/6 ────────────────────────────────────
    'dibujo',
    'estructuras',
    'modelado-3d',
    'mundos',
    'programacion',
    'videojuegos',
    # ── R65 · tanda 1 ───────────────────────────────────────────────────────
    'diseno-grafico',
    'pixel-art',
    'comic',
    # ── R65 · tanda 2 ───────────────────────────────────────────────────────
    'color',
    'patrones',
    'fotografia',
    # ── R65 · tanda 3 ───────────────────────────────────────────────────────
    'moda-textil',
    'ideas',
    'arquitectura',
    # ── R65 · tanda 4 ───────────────────────────────────────────────────────
    'maquinas',
    'circuitos',
    'papiroflexia',
    # ── R65 · tanda 5 ───────────────────────────────────────────────────────
    'simulaciones',
    'ritmo',
    'composicion',
    # ── R65 · tanda 6 ───────────────────────────────────────────────────────
    'sintesis-sonido',
    'videomapping',
    'robotica',
    # ── R65 · tanda 7 ───────────────────────────────────────────────────────
    'escritura-restricciones',
    'lenguas-inventadas',
    'juegos-de-mesa',
    # ── R65 · fase 2 · variantes AGE_0_12 ───────────────────────────────────
    'circuitos-age-0-12',
    'arquitectura-age-0-12',
    'color-age-0-12',
    'composicion-age-0-12',
    'sintesis-sonido-age-0-12',
    'videomapping-age-0-12',
    'fotografia-age-0-12',
    'lenguas-inventadas-age-0-12',
    'escritura-restricciones-age-0-12',
)


# ── R65 · fase 2 · las nueve variantes AGE_0_12 ──────────────────────────────
#
# El identificador canónico de la banda es ``AGE_0_12``; lo de abajo es el
# **nombre técnico del fichero**, que no puede llevar guion bajo ni mayúsculas
# por convención del resto de las imágenes del sitio. No es un valor de
# taxonomía y no se emite a ninguna URL: la migración de URLs es de A2 y R65 no
# la reabre.
#
# Regla de la variante: mismo estudio, mismo proceso creativo, misma o mayor
# calidad. Menos densidad, objetos mayores, acción más inmediata. **Nunca**
# estética bebé, mascotas, cartoon genérico ni menos detalle.

#: estudio → slug del fichero de su variante AGE_0_12
VARIANTES_AGE_0_12 = {
    'circuitos': 'circuitos-age-0-12',
    'arquitectura': 'arquitectura-age-0-12',
    'color': 'color-age-0-12',
    'composicion': 'composicion-age-0-12',
    'sintesis-sonido': 'sintesis-sonido-age-0-12',
    'videomapping': 'videomapping-age-0-12',
    'fotografia': 'fotografia-age-0-12',
    'lenguas-inventadas': 'lenguas-inventadas-age-0-12',
    'escritura-restricciones': 'escritura-restricciones-age-0-12',
}


def variante_migrada(slug: str) -> str:
    """Slug de la variante AGE_0_12 de un estudio, si ya está migrada a raster."""
    v = VARIANTES_AGE_0_12.get(slug)
    return v if v in MIGRADAS else ''
