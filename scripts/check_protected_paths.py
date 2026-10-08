#!/usr/bin/env python3
"""Fail closed when a PR touches protected Iris Green paths without an explicit protected-change label."""
from __future__ import annotations
import argparse
import fnmatch
import json
import os
import subprocess
import sys
from pathlib import Path

PROTECTED = (
    ".github/workflows/**",
    ".github/CODEOWNERS",
    "netlify.toml",
    "MAINTENANCE_ACTIVE.txt",
    "assets/maintenance.html",
    "scripts/build_site.py",
    "scripts/build_maintenance.py",
    "scripts/check_main_review_deploy.py",
    "sabik/**",
    "netlify/functions/**",
    "scripts/*sabik*",
    "assets/**/*sabik*",
)

LABEL = "maria-approved-protected-change"

def changed_files(base: str, head: str) -> list[str]:
    out = subprocess.check_output(
        ["git", "diff", "--name-only", f"{base}...{head}"],
        text=True,
    )
    return [line.strip() for line in out.splitlines() if line.strip()]

def is_protected(path: str) -> bool:
    return any(fnmatch.fnmatch(path, pattern) for pattern in PROTECTED)

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", required=True)
    parser.add_argument("--head", required=True)
    parser.add_argument("--labels-json", default="[]")
    parser.add_argument("--bootstrap", action="store_true")
    args = parser.parse_args()

    files = changed_files(args.base, args.head)
    protected = sorted(path for path in files if is_protected(path))
    labels = {item["name"] if isinstance(item, dict) else str(item) for item in json.loads(args.labels_json)}

    summary = Path(os.environ.get("GITHUB_STEP_SUMMARY", "/tmp/protected-paths-summary.md"))
    lines = ["## Protected paths gate", ""]
    if protected:
        lines += ["Sensitive files changed:", ""] + [f"- `{p}`" for p in protected] + [""]
    else:
        lines += ["No protected paths changed.", ""]
    summary.write_text("\n".join(lines), encoding="utf-8")

    if protected and LABEL not in labels and not args.bootstrap:
        print("PROTECTED_PATHS_TOUCHED")
        print("Missing required label:", LABEL)
        for path in protected:
            print(" -", path)
        return 2

    print("PROTECTED_PATHS_GATE_PASS")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
