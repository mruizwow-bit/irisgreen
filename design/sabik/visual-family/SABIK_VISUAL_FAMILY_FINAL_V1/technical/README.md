# Technical mirror · R2.1

The authoritative runnable artifact is:

`/SABIK/Agent3/SABIK_VISUAL_FAMILY_FINAL_V1_R2_1.zip`

This repository directory exists so Astra can inspect the production logic and evidence without relying on chat summaries.

## Current R2.1 path

Only the files under `technical/r2_1/` mirror the **current** rebuild contract.

The package command is:

`python scripts/rebuild_all_r2.py`

Expected final line:

`REBUILD_ALL_R2_PASS`

## Historical scripts

Older files already present directly under `technical/` belong to R1 or pre-R2.1 evidence. They are **R1/R2 HISTORICAL ONLY** and must not be treated as the current package command.

Inside the ZIP, historical R1 tooling is isolated under `audit/legacy_r1/`.

## Visual lock

R2.1 changes documentation/orchestration only. The package test `R2_1_VISUAL_ZERO_CHANGE_REPORT.json` records:

- 69 visual PNG/SVG files compared;
- 0 changed;
- 0 missing;
- 0 added.

## Package

SHA-256:

`343ec6bab150d297150faa5299fc1c2f1e4c177e5a343cc4900e036f19fad57f`

Manifest:

`111` files.

**NO MERGE.**
