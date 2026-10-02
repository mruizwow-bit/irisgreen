#!/usr/bin/env bash
# R44 SUITE5 · guard reconciliado contra main vivo tras recovery #367.
set -uo pipefail
FALLOS=0
fallo(){ echo "  FALLA  $*"; FALLOS=$((FALLOS+1)); }
ok(){ echo "  ok     $*"; }

ESPERADAS=(
  es/taller/pixel-art/index.html
  en/workshop/pixel-art/index.html
  es/taller/escritura-restricciones/index.html
  en/workshop/constraint-writing/index.html
  es/taller/juegos-de-mesa/index.html
  en/workshop/board-games/index.html
  es/taller/ritmo/index.html
  en/workshop/rhythm-sequencer/index.html
  es/taller/videojuegos/index.html
  en/workshop/video-game-design/index.html
)

declare -A ANTES
for f in es/taller/estructuras/index.html en/workshop/structures/index.html es/taller/index.html en/workshop/index.html; do
  ANTES[$f]=$(sha256sum "$f"|cut -d' ' -f1)
done

[ -f assets/ig-suite-meter-worklet.js ] || fallo "falta meter worklet"
grep -q "registerProcessor('igs-meter'" assets/ig-suite-meter-worklet.js || fallo "worklet no registra igs-meter"

python3 scripts/build_taller_suite5.py >/tmp/suite5-written.txt 2>/tmp/suite5-gen.err || { cat /tmp/suite5-gen.err; fallo "generador falló"; }
N=$(grep -c . /tmp/suite5-written.txt || true)
[ "$N" -eq 10 ] && ok "generador escribió 10 rutas" || fallo "generador escribió $N rutas"

for e in "${ESPERADAS[@]}"; do
  grep -qxF "$e" /tmp/suite5-written.txt || fallo "no anunció $e"
done
while IFS= read -r r; do
  printf '%s\n' "${ESPERADAS[@]}" | grep -qxF "$r" || fallo "ruta anunciada no permitida: $r"
done </tmp/suite5-written.txt

if [ "${SUITE5_MUTATION_F:-0}" = "1" ]; then
  mkdir -p es/taller/ruta-extra
  printf '%s\n' '<!doctype html><meta charset="utf-8"><title>mutation-f</title>' > es/taller/ruta-extra/index.html
fi

for f in "${!ANTES[@]}"; do
  AHORA=$(sha256sum "$f"|cut -d' ' -f1)
  [ "$AHORA" = "${ANTES[$f]}" ] && ok "$f intacto" || fallo "$f cambió"
done

STATUS=$(git status --porcelain=v1 --untracked-files=all -- es en)
CAMBIADAS=()
while IFS= read -r linea; do
  [ -z "$linea" ] && continue
  codigo=${linea:0:2}; ruta=${linea:3}
  if [[ "$ruta" == *" -> "* ]]; then fallo "rename/copy no permitido: $linea"; continue; fi
  CAMBIADAS+=("$ruta")
  printf '%s\n' "${ESPERADAS[@]}" | grep -qxF "$ruta" || { fallo "cambio extra [$codigo]: $ruta"; continue; }
  [ "$codigo" = " M" ] || fallo "estado inesperado [$codigo] para $ruta"
done <<< "$STATUS"

[ "${#CAMBIADAS[@]}" -eq 10 ] && ok "estado real = 10 rutas exactas" || fallo "estado real = ${#CAMBIADAS[@]} rutas; deben ser 10"
for e in "${ESPERADAS[@]}"; do
  found=0; for m in "${CAMBIADAS[@]}"; do [ "$m" = "$e" ] && found=1 && break; done
  [ "$found" -eq 1 ] || fallo "ruta esperada sin cambio real: $e"
done

for i in $(seq 1 11); do
  grep -q "\"e$i\"" es/taller/estructuras/index.html || fallo "falta e$i en Estructuras"
done

if [ "$FALLOS" -eq 0 ]; then echo "RESULTADO: PASA · 0 fallos"; exit 0
else echo "RESULTADO: FALLA · $FALLOS fallos"; exit 1; fi
