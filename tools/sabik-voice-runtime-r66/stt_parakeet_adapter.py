from __future__ import annotations

import argparse
import json
import re
import time
from pathlib import Path

from transformers import pipeline

MODEL_ID = "nvidia/parakeet-tdt-0.6b-v3"

# Closed, project-specific corrections only. No general autocorrect.
BRAND_FIXES = {
    "sabick": "Sabik",
    "savick": "Sabik",
    "sabyck": "Sabik",
}


def normalize_brand(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        return BRAND_FIXES.get(match.group(0).lower(), match.group(0))

    return re.sub(
        r"\b(?:Sabick|Savick|Sabyck)\b",
        repl,
        text,
        flags=re.IGNORECASE,
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--locale", required=True, choices=["es", "en"])
    args = ap.parse_args()

    audio = Path(args.input)
    if not audio.is_file():
        return 2

    t0 = time.perf_counter()
    asr = pipeline(
        "automatic-speech-recognition",
        model=MODEL_ID,
        device=-1,
    )
    load_s = time.perf_counter() - t0

    t1 = time.perf_counter()
    result = asr(str(audio))
    infer_s = time.perf_counter() - t1

    text = normalize_brand(str(result.get("text", "")).strip())
    if not text:
        return 3

    print(
        json.dumps(
            {
                "text": text,
                "locale": args.locale,
                "engine": "transformers-cpu",
                "model": MODEL_ID,
                "load_s": round(load_s, 3),
                "infer_s": round(infer_s, 3),
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
