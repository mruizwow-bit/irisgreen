from __future__ import annotations

from pathlib import Path
import re
import tempfile
import time

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from transformers import pipeline

MODEL_ID = "nvidia/parakeet-tdt-0.6b-v3"
NO_STORE = {
    "Cache-Control": "no-store, max-age=0",
    "Pragma": "no-cache",
}

BRAND_FIXES = {
    "sabick": "Sabik",
    "savick": "Sabik",
    "sabyck": "Sabik",
}

app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)
ASR = None


def normalize_brand(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        return BRAND_FIXES.get(match.group(0).lower(), match.group(0))

    return re.sub(
        r"\b(?:Sabick|Savick|Sabyck)\b",
        repl,
        text,
        flags=re.IGNORECASE,
    )


class TranscribePathRequest(BaseModel):
    path: str
    locale: str


@app.on_event("startup")
def startup() -> None:
    global ASR
    ASR = pipeline(
        "automatic-speech-recognition",
        model=MODEL_ID,
        device=-1,
    )


def validated_turn_path(raw: str) -> Path:
    p = Path(raw).resolve()
    temp_root = Path(tempfile.gettempdir()).resolve()

    if not p.is_file():
        raise HTTPException(status_code=400, detail="STT_INPUT_NOT_FOUND")

    if p.parent.parent != temp_root:
        raise HTTPException(status_code=400, detail="STT_INPUT_OUTSIDE_TEMP")

    if not p.parent.name.startswith("sabik-stt-") or not p.name.startswith("turn"):
        raise HTTPException(status_code=400, detail="STT_INPUT_NOT_RUNTIME_TEMP")

    return p


@app.get("/health")
def health() -> JSONResponse:
    return JSONResponse(
        {
            "ready": ASR is not None,
            "model": MODEL_ID,
            "device": "cpu",
        },
        headers=NO_STORE,
    )


@app.post("/transcribe-path")
def transcribe_path(req: TranscribePathRequest) -> JSONResponse:
    if req.locale not in ("es", "en"):
        raise HTTPException(status_code=400, detail="STT_LOCALE_UNSUPPORTED")

    if ASR is None:
        raise HTTPException(status_code=503, detail="STT_NOT_READY")

    p = validated_turn_path(req.path)

    t0 = time.perf_counter()
    out = ASR(str(p))
    infer_s = time.perf_counter() - t0

    text = normalize_brand(str(out.get("text", "")).strip())
    if not text:
        raise HTTPException(status_code=503, detail="STT_EMPTY")

    return JSONResponse(
        {
            "text": text,
            "locale": req.locale,
            "engine": "transformers-cpu",
            "model": MODEL_ID,
            "infer_s": round(infer_s, 3),
        },
        headers=NO_STORE,
    )
