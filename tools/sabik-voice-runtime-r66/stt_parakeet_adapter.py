from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request

DEFAULT_URL = "http://127.0.0.1:8876/transcribe-path"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--locale", required=True, choices=["es", "en"])
    args = ap.parse_args()

    url = os.environ.get("SABIK_STT_SIDECAR_URL", DEFAULT_URL)
    payload = json.dumps(
        {"path": args.input, "locale": args.locale},
        ensure_ascii=False,
    ).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, ValueError):
        return 4

    text = str(body.get("text", "")).strip()
    if not text:
        return 3

    print(
        json.dumps(
            {
                "text": text,
                "locale": args.locale,
                "engine": str(body.get("engine", "transformers-cpu")),
                "model": str(body.get("model", "nvidia/parakeet-tdt-0.6b-v3")),
                "infer_s": body.get("infer_s"),
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
