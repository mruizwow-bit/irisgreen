#!/usr/bin/env python3
"""W05-R1 candidate self-check. Does not replace the independent F01-F20 freeze."""
from __future__ import annotations

import argparse
import functools
import hashlib
import json
import re
import subprocess
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

BASELINE = "e48b51814afed825a92e83a2f6e51ee8a1c85e45"
ROOT = Path(__file__).resolve().parents[1]


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def git(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def assert_static(dist: bool) -> dict:
    music = (ROOT / "assets/musica.js").read_text(encoding="utf-8")
    manifest = json.loads((ROOT / "audio/music-provenance.json").read_text(encoding="utf-8"))
    tracks = re.findall(r"\{\s*f:'([^']+)',t:'([^']+)',a:'([^']+)'\s*\}", music)
    assert len(tracks) == 24, len(tracks)
    assert "ALL_TRACKS.filter" not in music
    assert "var TRACKS=ALL_TRACKS.slice();" in music
    assert "audio.preload='none'" in music
    assert "stopButton=button(labels.stop,stopPlayback)" in music
    assert "new URL('/audio/'+TRACKS[selected].f,location.origin)" in music
    assert "new URL('/audio/'+file,location.origin)" in music
    assert not re.search(r"autoplay\s*=\s*true", music)

    start = music.index("var ALL_TRACKS =")
    end = music.index("var TEXT =", start)
    snippet = music[start:end] + "\nglobalThis.__RESULT=TRACKS.map(t=>t.f);"
    node = r"""
const vm=require('vm'), fs=require('fs');
const src=fs.readFileSync(0,'utf8');
const out={};
for(const probe of ['', 'maybe', 'probably']){
  const ctx={document:{createElement:()=>({canPlayType:()=>probe})}};
  vm.runInNewContext(src,ctx);
  out[probe || 'empty']=ctx.__RESULT;
}
process.stdout.write(JSON.stringify(out));
"""
    scenarios = json.loads(subprocess.check_output(["node", "-e", node], input=snippet, text=True))
    assert all(len(v) == 24 for v in scenarios.values()), {k: len(v) for k,v in scenarios.items()}

    assert manifest["schema"] == "W05-R1-MUSIC-PROVENANCE/1.0"
    assert len(manifest["tracks"]) == 24
    fallbacks = [t for t in manifest["tracks"] if t.get("fallback")]
    assert len(fallbacks) == 9
    assert all(t["provenance_status"] == "VERIFIED_EXACT" and t.get("pixabay_url") for t in fallbacks)

    for t in manifest["tracks"]:
        source = ROOT / t["source_path"]
        assert source.is_file(), t["source_path"]
        assert git("hash-object", t["source_path"]) == t["source_git_blob_sha1"], t["source_path"]
        assert sha256(source) == t["original_sha256"], t["source_path"]
        if dist:
            copied = ROOT / "dist" / t["source_path"]
            assert copied.is_file(), str(copied)
            assert sha256(copied) == t["original_sha256"], str(copied)
        fb = t.get("fallback")
        if fb:
            fp = ROOT / fb["path"]
            assert fp.is_file(), fb["path"]
            assert sha256(fp) == fb["sha256"], fb["path"]
            assert fb["source_sha256"] == t["original_sha256"]
            assert fb["probe"].get("codec_name") == "mp3"
            if dist:
                copied = ROOT / "dist" / fb["path"]
                assert copied.is_file(), str(copied)
                assert sha256(copied) == fb["sha256"], str(copied)

    repair = (ROOT / "scripts/repair_routes.py").read_text(encoding="utf-8")
    build = (ROOT / "scripts/build_site.py").read_text(encoding="utf-8")
    assert re.search(r"PUBLIC_DIRS=.*['\"]audio['\"]", repair)
    assert not re.search(r"ffmpeg|transcod", repair + "\n" + build, re.I)

    return {
        "logical_tracks": 24,
        "probe_counts": {k: len(v) for k,v in scenarios.items()},
        "fallbacks": 9,
        "original_hashes": "PASS",
        "dist_hashes": "PASS" if dist else "NOT_RUN",
        "autoplay": "NO",
        "explicit_stop": "PASS",
        "third_party_audio_sources": 0,
    }


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def browser_checks(root: Path) -> dict:
    server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(root)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    rows = []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            for width in [320, 390, 768, 1440]:
                ctx = browser.new_context(viewport={"width": width, "height": 900}, reduced_motion="reduce")
                ctx.add_init_script("""
                  (() => {
                    const original = HTMLMediaElement.prototype.canPlayType;
                    HTMLMediaElement.prototype.canPlayType = function(type) {
                      if (String(type || '').includes('mp4a.40.2')) return '';
                      return original.call(this, type);
                    };
                  })();
                """)
                page = ctx.new_page()
                audio_requests, third_party = [], []
                def route_handler(route):
                    url = route.request.url
                    if not url.startswith(base):
                        third_party.append(url)
                        route.abort()
                        return
                    if "/audio/" in urlsplit(url).path:
                        audio_requests.append(urlsplit(url).path)
                    route.continue_()
                page.route("**/*", route_handler)
                page.goto(base + "/es/videos/", wait_until="domcontentloaded")
                page.locator("main h1").first.wait_for(timeout=15000)
                trigger = page.locator(".ig-uh-music:visible,#plBtn:visible,[data-ig-music]:visible").first
                trigger.click()
                panel = page.locator("#ig-music-panel")
                panel.wait_for(state="visible")
                assert not audio_requests, (width, audio_requests)
                assert panel.locator("[data-track]").count() == 24
                box = panel.bounding_box()
                assert box and box["x"] >= -1 and box["y"] >= -1
                assert box["x"] + box["width"] <= width + 1
                assert box["height"] <= 900
                assert panel.get_by_role("button", name=re.compile(r"^(Parar|Stop)$")).count() == 1
                assert panel.get_by_role("button", name=re.compile(r"^(Escuchar|Play)$")).count() == 1
                if width == 390:
                    first = panel.locator('[data-track="0"]')
                    first.click()
                    page.wait_for_timeout(450)
                    assert any(p.endswith("/audio/fallbacks/un-momento-de-calma.mp3") for p in audio_requests), audio_requests
                    panel.get_by_role("button", name=re.compile(r"^(Parar|Stop)$")).click()
                    assert "detenida" in panel.locator(".ig-m-status").inner_text().lower()
                page.keyboard.press("Escape")
                assert not panel.is_visible()
                assert trigger.evaluate("(e)=>document.activeElement===e")
                rows.append({
                    "width": width,
                    "tracks": 24,
                    "audio_before_user_play": 0,
                    "fallback_request_observed": width == 390,
                    "inside_viewport": True,
                    "stop": True,
                    "escape_focus_return": True,
                    "third_party_blocked": len(third_party),
                })
                ctx.close()

            # F09: a failed technical source must not delete the logical track.
            ctx = browser.new_context(viewport={"width": 390, "height": 900})
            ctx.add_init_script("""
              (() => {
                const original = HTMLMediaElement.prototype.canPlayType;
                HTMLMediaElement.prototype.canPlayType = function(type) {
                  if (String(type || '').includes('mp4a.40.2')) return '';
                  return original.call(this, type);
                };
              })();
            """)
            page = ctx.new_page()
            page.route("**/*", lambda route: route.abort() if "/audio/fallbacks/un-momento-de-calma.mp3" in route.request.url else (route.continue_() if route.request.url.startswith(base) else route.abort()))
            page.goto(base + "/es/videos/", wait_until="domcontentloaded")
            trigger = page.locator(".ig-uh-music:visible,#plBtn:visible,[data-ig-music]:visible").first
            trigger.click()
            panel = page.locator("#ig-music-panel")
            panel.locator('[data-track="0"]').click()
            page.wait_for_timeout(700)
            assert panel.locator("[data-track]").count() == 24
            assert panel.locator(".ig-m-status").inner_text().strip()
            ctx.close()
            browser.close()
    finally:
        server.shutdown()

    return {
        "browser": "Chromium",
        "viewports": rows,
        "failed_source_keeps_24": True,
        "manual_screen_reader": "PENDING_ENVIRONMENT",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist", action="store_true")
    parser.add_argument("--root", default=".")
    parser.add_argument("--phase", required=True)
    args = parser.parse_args()
    static = assert_static(args.dist)
    browser = browser_checks((ROOT / args.root).resolve())
    report = {
        "schema": "W05-R1-CANDIDATE-CHECK/1.0",
        "phase": args.phase,
        "baseline_sha": BASELINE,
        "head": git("rev-parse", "HEAD"),
        "static": static,
        "browser": browser,
        "independent_freeze": "NOT_RUN_BY_THIS_SCRIPT",
    }
    out = ROOT / "reports" / "w05-r1-candidate"
    out.mkdir(parents=True, exist_ok=True)
    (out / f"{args.phase}.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "phase": args.phase,
        "logical_tracks": static["logical_tracks"],
        "probe_counts": static["probe_counts"],
        "fallbacks": static["fallbacks"],
        "viewports": [r["width"] for r in browser["viewports"]],
        "failed_source_keeps_24": browser["failed_source_keeps_24"],
        "manual_screen_reader": browser["manual_screen_reader"],
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
