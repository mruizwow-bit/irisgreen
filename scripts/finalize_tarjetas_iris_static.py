#!/usr/bin/env python3
"""Integra pictogramas editoriales y finaliza las 420 Tarjetas Iris v2.

Este orquestador mantiene el build general sin cambios: primero añade únicamente
los apoyos visuales aprobados, después ejecuta el finalizador v2 ya validado y,
por último, comprueba el alcance completo de esta entrega.
"""
from add_mulberry_pictograms import main as add_pictograms
from finalize_tarjetas_iris_v2_core import main as finalize_v2
from test_tarjetas_pictogramas import main as validate_delivery


if __name__ == "__main__":
    add_pictograms()
    finalize_v2()
    validate_delivery()
