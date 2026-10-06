#!/usr/bin/env python3
"""Record the exact main build and check Netlify's result without publishing production."""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import urllib.request

SITE_ID = "40042464-343c-4587-b6b7-f6159836e291"
REVIEW_URL = "https://main-review--irisgreen-home.netlify.app"


def source_manifest(sha):
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("Invalid source SHA")
    actual = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    if actual != sha or os.environ.get("GITHUB_REF") != "refs/heads/main":
        raise ValueError("Review must be built from the checked-out main commit")
    return {
        "source_branch": "main",
        "source_sha": sha,
        "source_url": f"https://github.com/mruizwow-bit/irisgreen/commit/{sha}",
        "workflow_url": "https://github.com/mruizwow-bit/irisgreen/actions/runs/" + os.environ["GITHUB_RUN_ID"],
        "review_url": REVIEW_URL,
    }


def validate_result(deploy, site, sha, production_id):
    expected = {
        "site_id": SITE_ID,
        "state": "ready",
        "context": "branch-deploy",
        "branch": "main-review",
        "title": f"Iris Green canonical main review {sha}",
    }
    for key, value in expected.items():
        if deploy.get(key) != value:
            raise ValueError(f"Unexpected Netlify deploy {key}")
    if deploy.get("published_at"):
        raise ValueError("Review unexpectedly published to production")
    if deploy.get("deploy_ssl_url") != REVIEW_URL:
        raise ValueError("Review alias changed")
    functions = [item.get("n", item.get("name")) if isinstance(item, dict) else item
                 for item in (deploy.get("available_functions") or [])]
    if "sabik-voice-proxy" not in functions:
        raise ValueError("Voice proxy missing from deploy")
    published = site.get("published_deploy") or {}
    if site.get("id") != SITE_ID or published.get("id") != production_id:
        raise ValueError("Public production deploy changed")
    if published.get("locked") is not True or "maintenance" not in published.get("title", "").lower():
        raise ValueError("Public maintenance is not locked")
    if site.get("sso_login") is not True or site.get("sso_login_context") != "non_production":
        raise ValueError("Review login protection changed")


def netlify(path):
    token = next((os.environ.get(key) for key in ("NETLIFY_AUTH_TOKEN", "NETLIFY_TOKEN", "NETLIFY_ACCESS_TOKEN") if os.environ.get(key)), None)
    if not token:
        raise ValueError("Missing Netlify credential")
    req = urllib.request.Request("https://api.netlify.com/api/v1" + path, headers={"Authorization": "Bearer " + token})
    with urllib.request.urlopen(req, timeout=45) as response:
        return json.load(response)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("record", "verify"))
    args = parser.parse_args()
    sha = os.environ["SOURCE_SHA"]
    if args.mode == "record":
        Path("dist/deploy-source.json").write_text(json.dumps(source_manifest(sha), indent=2) + "\n", encoding="utf-8")
        return
    result = json.loads(Path("/tmp/irisgreen-main-review-deploy.json").read_text())
    deploy_id = result["deploy_id"]
    if not re.fullmatch(r"[0-9a-f]{24}", deploy_id):
        raise ValueError("Invalid deploy ID")
    deploy = netlify("/deploys/" + deploy_id)
    site = netlify("/sites/" + SITE_ID)
    production_id = Path("/tmp/irisgreen-production-before-review.txt").read_text().strip()
    validate_result(deploy, site, sha, production_id)
    evidence = {**json.loads(Path("dist/deploy-source.json").read_text()), "deploy_id": deploy_id,
                "state": deploy["state"], "public_deploy_id": production_id, "maintenance_locked": True,
                "review_login_protected": True, "functions": [item.get("n", item.get("name")) if isinstance(item, dict) else item for item in deploy["available_functions"]],
                "permalink": deploy["links"]["permalink"]}
    Path("/tmp/irisgreen-main-review-verification.json").write_text(json.dumps(evidence, indent=2) + "\n")
    with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as summary:
        summary.write(f"\nNetlify API verification: **ready**, source **main@{sha}**.\n\n")
        summary.write(f"[Exact deploy]({evidence['permalink']}) · [Source commit]({evidence['source_url']})\n\n")
        summary.write("Public maintenance remains locked; review retains team login. Runtime functionality is checked separately.\n")
    print(json.dumps(evidence))


if __name__ == "__main__":
    main()
