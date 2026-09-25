#!/usr/bin/env python3
"""Generate W05-R1 MP3 fallback derivatives from provenance-bound local originals.

This script is NOT part of the public build. It is a one-time/reproducible
derivative generator for tracks whose frozen provenance is VERIFIED_EXACT.
It never downloads audio and never replaces or deletes an original.
"""
from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "audio" / "music-provenance.json"


def run(*args: str) -> str:
    return subprocess.check_output(args, cwd=ROOT, text=True).strip()


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def probe(path: Path) -> dict:
    raw = run(
        "ffprobe", "-v", "error",
        "-select_streams", "a:0",
        "-show_entries", "stream=codec_name,profile,codec_type,sample_rate,channels,channel_layout,bit_rate",
        "-of", "json",
        str(path),
    )
    data = json.loads(raw)
    streams = data.get("streams") or []
    return streams[0] if streams else {"codec_name": "UNKNOWN"}


def main() -> None:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    tracks = data["tracks"]
    if len(tracks) != 24:
        raise SystemExit(f"Expected 24 logical tracks, found {len(tracks)}")

    generated = []
    for track in tracks:
        source = ROOT / track["source_path"]
        if not source.is_file():
            raise SystemExit(f"Missing original: {track['source_path']}")
        if source.stat().st_size != int(track["source_size_bytes"]):
            raise SystemExit(f"Original size drift: {track['source_path']}")
        blob = run("git", "hash-object", track["source_path"])
        if blob != track["source_git_blob_sha1"]:
            raise SystemExit(f"Original blob drift: {track['source_path']}")

        track["original_sha256"] = sha256(source)
        track["original_probe"] = probe(source)

        fallback_rel = track.get("fallback_path")
        if not fallback_rel:
            track["fallback"] = None
            continue

        if track.get("provenance_status") != "VERIFIED_EXACT" or not track.get("pixabay_url"):
            raise SystemExit(
                "W05_R1_BLOCKED_BY_PROVENANCE: "
                + track["source_path"]
                + " is not VERIFIED_EXACT with an original URL"
            )

        target = ROOT / fallback_rel
        target.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                "ffmpeg", "-nostdin", "-y", "-hide_banner", "-loglevel", "error",
                "-i", str(source),
                "-map_metadata", "-1",
                "-map_chapters", "-1",
                "-vn",
                "-c:a", "libmp3lame",
                "-b:a", "128k",
                str(target),
            ],
            cwd=ROOT,
            check=True,
        )
        fallback_sha = sha256(target)
        track["fallback"] = {
            "path": fallback_rel,
            "relation": "local derivative of source_path for browser compatibility",
            "source_path": track["source_path"],
            "source_sha256": track["original_sha256"],
            "sha256": fallback_sha,
            "bytes": target.stat().st_size,
            "probe": probe(target),
            "provenance_status": track["provenance_status"],
            "pixabay_url": track["pixabay_url"],
            "license_evidence": track["license_evidence"],
        }
        generated.append(fallback_rel)

    if len(generated) != 9:
        raise SystemExit(f"Expected 9 fallback derivatives, generated {len(generated)}")

    data["measured_originals"] = 24
    data["generated_fallbacks"] = len(generated)
    data["ffmpeg_version"] = run("ffmpeg", "-version").splitlines()[0]
    MANIFEST.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({
        "status": "W05_R1_FALLBACKS_GENERATED",
        "originals": 24,
        "fallbacks": generated,
        "third_party_downloads": 0,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
