#!/usr/bin/env python3
"""Restore the verified self-contained Rincón 3D runtime inside build staging."""
from __future__ import annotations
import base64, gzip, hashlib, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tools/escenas-3d/rincon-escenas-3d.js.gz.b64"
TARGET = ROOT / "assets/rincon-escenas-3d.js"

def main() -> None:
    text = SOURCE.read_text(encoding="ascii")
    raw_sha = re.search(r"^# raw_sha256=([0-9a-f]{64})$", text, re.M)
    gzip_sha = re.search(r"^# gzip_sha256=([0-9a-f]{64})$", text, re.M)
    if not raw_sha or not gzip_sha:
        raise AssertionError("Missing Rincón bundle provenance")
    encoded = "".join(line.strip() for line in text.splitlines() if line and not line.startswith("#"))
    packed = base64.b64decode(encoded, validate=True)
    if hashlib.sha256(packed).hexdigest() != gzip_sha.group(1):
        raise AssertionError("Rincón gzip SHA-256 mismatch")
    raw = gzip.decompress(packed)
    if hashlib.sha256(raw).hexdigest() != raw_sha.group(1):
        raise AssertionError("Rincón JavaScript SHA-256 mismatch")
    TARGET.write_bytes(raw)
    print({"rincon_3d":"assembled","bytes":len(raw),"sha256":raw_sha.group(1)})

if __name__ == "__main__":
    main()
