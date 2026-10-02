#!/usr/bin/env bash
# R44 SUITE5 · prueba del porte mínimo sobre main.
#
# Este test FALLA (exit 1) si cualquiera de estas cosas no se cumple:
#   · no se escriben EXACTAMENTE las 10 rutas esperadas;
#   · aparece una ruta escrita que no estaba prevista;
#   · se modifica cualquier página fuera de esas 10;
#   · Estructuras (ES o EN) o la portada (ES o EN) cambian de huella;
#   · falta alguno de los retos e1..e11 de Estructuras;
#   · aparece cualquier cambio real extra bajo es/ o en/, incluido untracked (??), A/D/R.
#
# Uso: ejecutar dentro de un árbol de trabajo limpio en main@ad7ea662.
set -uo pipefail

D=${DONANTE:-$(cd "$(dirname "$0")" && pwd)}
FALLOS=0
fallo() { echo "  FALLA  $*"; FALLOS=$((FALLOS+1)); }
ok()    { echo "  ok     $*"; }

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

echo "== base =="
git log --oneline -1
BASE_SHA=$(git rev-parse HEAD)
BASE_ESPERADA=${BASE_ESPERADA:-ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5}
if [ "$BASE_SHA" != "$BASE_ESPERADA" ]; then
  fallo "la base no es la esperada $BASE_ESPERADA sino $BASE_SHA"
fi

echo
echo "== huellas ANTES =="
declare -A ANTES
for f in es/taller/estructuras/index.html en/workshop/structures/index.html \
         es/taller/index.html en/workshop/index.html; do
  ANTES[$f]=$(sha256sum "$f" | cut -d' ' -f1)
  echo "  ${ANTES[$f]:0:16}  $f"
done

echo
echo "== porte mínimo =="
mkdir -p scripts/taller_suite assets/vendor/taller assets/data
for f in ig-suite-core.js ig-suite-pixelart.js ig-suite-escritura.js ig-suite-escritura.css \
         ig-suite-juegosmesa.js ig-suite-juegosmesa.css ig-suite-musica.js \
         ig-suite-videojuegos.js ig-suite-juego-runtime.js ig-suite-meter-worklet.js \
         ig-r44-retos.js ig-r44-retos.css; do
  cp "$D/assets/$f" assets/ || fallo "no se pudo copiar assets/$f"
done
cp "$D/assets/data/r44-retos.json" assets/data/ || fallo "falta r44-retos.json"
for f in comun pixelart escritura juegos_mesa ritmo videojuegos musica_comun; do
  cp "$D/scripts/taller_suite/$f.py" scripts/taller_suite/ || fallo "falta el módulo $f"
done
for v in pixi.js tone.js LICENCIAS.txt; do
  cp "$D/assets/vendor/taller/$v" assets/vendor/taller/ || fallo "falta vendor/$v"
done
cp "${GENERADOR:-$D/scripts/build_taller_suite5.py}" scripts/build_taller_suite5.py || fallo "falta el generador selectivo"

echo
echo "== el worklet que pide Ritmo está presente =="
if [ -f assets/ig-suite-meter-worklet.js ]; then ok "assets/ig-suite-meter-worklet.js"
else fallo "assets/ig-suite-meter-worklet.js NO está: Ritmo haría un 404 y degradaría el medidor"; fi
REF=$(grep -o "addModule('[^']*'" assets/ig-suite-musica.js | head -1 | sed "s/.*('//;s/'//;s/?.*//")
if [ -n "$REF" ] && [ -f ".${REF}" ]; then ok "la ruta que pide el motor existe: $REF"
elif [ -n "$REF" ]; then fallo "el motor pide $REF y no está en el árbol"; fi

echo
echo "== generador selectivo =="
python3 scripts/build_taller_suite5.py > /tmp/escritas.txt 2>/tmp/err.txt || { fallo "el generador terminó con error"; cat /tmp/err.txt; }
N=$(grep -c . /tmp/escritas.txt || true)
if [ "$N" -eq 10 ]; then ok "ha escrito exactamente 10 rutas"
else fallo "ha escrito $N rutas y se esperaban exactamente 10"; fi

# Mutación F: simula que el generador escribe silenciosamente una ruta adicional.
# No se añade a /tmp/escritas.txt: solo el estado real de Git debe detectarla.
if [ "${SUITE5_MUTATION_F:-0}" = "1" ]; then
  mkdir -p es/taller/ruta-extra
  printf '%s\n' '<!doctype html><meta charset="utf-8"><title>mutation-f</title>' > es/taller/ruta-extra/index.html
fi

echo
echo "== cada ruta escrita es una de las previstas =="
for r in $(cat /tmp/escritas.txt); do
  if printf '%s\n' "${ESPERADAS[@]}" | grep -qx "$r"; then :; else fallo "ruta NO prevista: $r"; fi
done
for e in "${ESPERADAS[@]}"; do
  if grep -qx "$e" /tmp/escritas.txt; then :; else fallo "ruta prevista que no se escribió: $e"; fi
done
[ "$FALLOS" -eq 0 ] && ok "las 10 previstas y ninguna más"

echo
echo "== TEST NEGATIVO · nada fuera de las 10 se toca =="
for f in "${!ANTES[@]}"; do
  AHORA=$(sha256sum "$f" | cut -d' ' -f1)
  if [ "$AHORA" = "${ANTES[$f]}" ]; then ok "$f sin cambios"; else fallo "$f HA CAMBIADO"; fi
done

# Inspeccionar TODO el estado real bajo es/ y en/. No confiar en stdout del generador
# y no limitarse a '^ M': eso dejaría escapar rutas nuevas no trackeadas (??).
STATUS=$(git status --porcelain=v1 --untracked-files=all -- es en)
CAMBIADAS=()
while IFS= read -r linea; do
  [ -z "$linea" ] && continue
  codigo=${linea:0:2}
  ruta=${linea:3}

  if [[ "$ruta" == *" -> "* ]]; then
    fallo "rename/copy no permitido bajo es/en: $linea"
    continue
  fi

  CAMBIADAS+=("$ruta")
  if ! printf '%s\n' "${ESPERADAS[@]}" | grep -qxF "$ruta"; then
    fallo "cambio fuera de la lista permitida [$codigo]: $ruta"
    continue
  fi

  if [ "$codigo" != " M" ]; then
    fallo "estado git inesperado para ruta permitida [$codigo]: $ruta (se esperaba ' M')"
  fi
done <<< "$STATUS"

NMOD=${#CAMBIADAS[@]}
if [ "$NMOD" -eq 10 ]; then
  ok "el estado real contiene exactamente 10 cambios bajo es/en"
else
  fallo "el estado real contiene $NMOD cambios bajo es/en y deben ser exactamente 10"
  printf '%s\n' "$STATUS" | sed 's/^/       /'
fi

for e in "${ESPERADAS[@]}"; do
  encontrado=0
  for m in "${CAMBIADAS[@]}"; do
    [ "$m" = "$e" ] && encontrado=1 && break
  done
  [ "$encontrado" -eq 1 ] || fallo "ruta permitida sin cambio real en git: $e"
done

echo
printf "  retos de Estructuras: "
FALTAN=0
for i in $(seq 1 11); do
  if grep -q "\"e$i\"" es/taller/estructuras/index.html; then printf "e%s " "$i"; else printf "FALTA-e%s " "$i"; FALTAN=$((FALTAN+1)); fi
done
echo
if [ "$FALTAN" -eq 0 ]; then ok "e1..e11 completos"; else fallo "faltan $FALTAN retos de Estructuras"; fi

echo
if [ "$FALLOS" -eq 0 ]; then echo "RESULTADO: PASA · 0 fallos"; exit 0
else echo "RESULTADO: FALLA · $FALLOS fallos"; exit 1; fi
