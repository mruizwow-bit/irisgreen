#!/usr/bin/env python3
"""Sabik private voice runtime for HUMAN QA.

This process is intentionally self-hosted. It never publishes or copies the
private Sabik TTS checkpoints into the public repository.

Required environment:
  SABIK_TTS_ES_MODEL_PATH
  SABIK_TTS_EN_MODEL_PATH
  SABIK_STT_MODEL_PATH

Optional:
  SABIK_TTS_ES_SPEAKER=sabik_es
  SABIK_TTS_EN_SPEAKER=sabik_en
  SABIK_STT_DEVICE=cuda
  SABIK_STT_COMPUTE_TYPE=float16
  SABIK_VOICE_HOST=127.0.0.1
  SABIK_VOICE_PORT=8767
"""
from __future__ import annotations

import asyncio
import hashlib
import io
import json
import os
import tempfile
from pathlib import Path
from typing import Literal

import av
import soundfile as sf
import torch
import uvicorn
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from faster_whisper import WhisperModel
from pydantic import BaseModel, Field
from qwen_tts import Qwen3TTSModel

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
MAX_AUDIO_BYTES = 8 * 1024 * 1024
MAX_AUDIO_SECONDS = 35.0
MAX_TEXT_CHARS = 1200

TTS = {
    "es": {
        "id": "SABIK_ES_R01_FINAL",
        "model_sha256": "8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291",
        "config_sha256": "6c62a7c419fe2a72c64c51f2e143fc702ba552e12c31ff2bda31feeee1ab5a9e",
        "path_env": "SABIK_TTS_ES_MODEL_PATH",
        "speaker_env": "SABIK_TTS_ES_SPEAKER",
        "speaker_default": "sabik_es",
        "language": "Spanish",
    },
    "en": {
        "id": "SABIK_EN_R02_FINAL",
        "model_sha256": "3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df",
        "config_sha256": "6ac9cbf2727344d18fbb4d66ea8274b675f64a14b0737e9e28801181e96c0abd",
        "path_env": "SABIK_TTS_EN_MODEL_PATH",
        "speaker_env": "SABIK_TTS_EN_SPEAKER",
        "speaker_default": "sabik_en",
        "language": "English",
    },
}


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def required_path(name: str) -> Path:
    raw = os.environ.get(name, "").strip()
    if not raw:
        raise RuntimeError(f"{name}_REQUIRED")
    path = Path(raw).expanduser().resolve()
    if not path.exists():
        raise RuntimeError(f"{name}_NOT_FOUND")
    return path


def verify_tts_path(locale: str) -> Path:
    cfg = TTS[locale]
    root = required_path(cfg["path_env"])
    model = root / "model.safetensors"
    config = root / "config.json"
    if not model.is_file() or not config.is_file():
        raise RuntimeError(f"{cfg['id']}_FILES_MISSING")
    if sha256(model) != cfg["model_sha256"]:
        raise RuntimeError(f"{cfg['id']}_MODEL_HASH_MISMATCH")
    if sha256(config) != cfg["config_sha256"]:
        raise RuntimeError(f"{cfg['id']}_CONFIG_HASH_MISMATCH")
    return root


def audio_duration(path: Path) -> float:
    try:
        with av.open(str(path)) as container:
            if container.duration is not None:
                return float(container.duration * av.time_base)
            durations = []
            for stream in container.streams.audio:
                if stream.duration is not None and stream.time_base is not None:
                    durations.append(float(stream.duration * stream.time_base))
            return max(durations, default=0.0)
    except Exception as exc:
        raise ValueError("AUDIO_DECODE_FAILED") from exc


class Runtime:
    def __init__(self) -> None:
        self.lock = asyncio.Lock()
        self.stt: WhisperModel | None = None
        self.tts: dict[str, Qwen3TTSModel] = {}
        self.tts_paths: dict[str, Path] = {}
        self.stt_path: Path | None = None

    def readiness(self) -> dict:
        es = verify_tts_path("es")
        en = verify_tts_path("en")
        stt = required_path("SABIK_STT_MODEL_PATH")
        self.tts_paths = {"es": es, "en": en}
        self.stt_path = stt
        return {
            "schema": "iris-green/sabik-voice-runtime/v1",
            "stt": {
                "self_hosted": True,
                "engine": "faster-whisper",
                "model": os.environ.get("SABIK_STT_MODEL_ID", stt.name),
                "languages": ["es", "en"],
                "device": os.environ.get("SABIK_STT_DEVICE", "cuda"),
            },
            "tts": {
                locale: {
                    "self_hosted": True,
                    "engine": "Qwen3-TTS",
                    "model_id": cfg["id"],
                    "model_sha256": cfg["model_sha256"],
                    "language": cfg["language"],
                }
                for locale, cfg in TTS.items()
            },
            "privacy": {
                "no_store": True,
                "persist_audio": False,
                "persist_transcript": False,
                "persist_response_audio": False,
            },
        }

    def _stt(self) -> WhisperModel:
        if self.stt is None:
            path = self.stt_path or required_path("SABIK_STT_MODEL_PATH")
            self.stt = WhisperModel(
                str(path),
                device=os.environ.get("SABIK_STT_DEVICE", "cuda"),
                compute_type=os.environ.get("SABIK_STT_COMPUTE_TYPE", "float16"),
            )
        return self.stt

    def _tts(self, locale: str) -> Qwen3TTSModel:
        if locale not in self.tts:
            path = self.tts_paths.get(locale) or verify_tts_path(locale)
            self.tts[locale] = Qwen3TTSModel.from_pretrained(
                str(path),
                device_map=os.environ.get("SABIK_TTS_DEVICE", "cuda:0"),
                dtype=torch.bfloat16,
                attn_implementation="sdpa",
            )
        return self.tts[locale]

    def transcribe_sync(self, path: Path, locale: str) -> dict:
        model = self._stt()
        segments, info = model.transcribe(
            str(path),
            language=locale,
            beam_size=5,
            vad_filter=True,
            condition_on_previous_text=False,
            word_timestamps=False,
        )
        text = " ".join(segment.text.strip() for segment in segments if segment.text.strip()).strip()
        return {
            "text": text,
            "locale": locale,
            "engine": "faster-whisper",
            "model": os.environ.get("SABIK_STT_MODEL_ID", (self.stt_path or Path("local")).name),
            "detected_language": getattr(info, "language", locale),
        }

    def synthesize_sync(self, text: str, locale: str) -> bytes:
        cfg = TTS[locale]
        model = self._tts(locale)
        speaker = os.environ.get(cfg["speaker_env"], cfg["speaker_default"])
        wavs, sr = model.generate_custom_voice(
            text=text,
            speaker=speaker,
            language=cfg["language"],
            non_streaming_mode=True,
            do_sample=True,
            top_k=50,
            top_p=1.0,
            temperature=0.9,
            repetition_penalty=1.05,
            max_new_tokens=2048,
        )
        buf = io.BytesIO()
        sf.write(buf, wavs[0], sr, format="WAV", subtype="PCM_16")
        return buf.getvalue()


runtime = Runtime()
app = FastAPI(
    title="Sabik private voice runtime",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


@app.middleware("http")
async def privacy_headers(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response


@app.get("/sabik-voice/capabilities")
async def capabilities():
    try:
        return JSONResponse(runtime.readiness())
    except Exception:
        raise HTTPException(status_code=503, detail="VOICE_RUNTIME_NOT_READY")


@app.post("/sabik-voice/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    locale: Literal["es", "en"] = Form(...),
):
    data = await audio.read(MAX_AUDIO_BYTES + 1)
    if not data or len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="AUDIO_SIZE_INVALID")
    suffix = ".ogg" if "ogg" in (audio.content_type or "") else ".webm"
    path = None
    try:
        with tempfile.NamedTemporaryFile(prefix="sabik-stt-", suffix=suffix, delete=False) as tmp:
            tmp.write(data)
            path = Path(tmp.name)
        duration = audio_duration(path)
        if duration <= 0 or duration > MAX_AUDIO_SECONDS:
            raise HTTPException(status_code=413, detail="AUDIO_DURATION_INVALID")
        async with runtime.lock:
            result = await asyncio.to_thread(runtime.transcribe_sync, path, locale)
        if not result["text"]:
            raise HTTPException(status_code=422, detail="NO_SPEECH")
        return JSONResponse(result)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=503, detail="STT_UNAVAILABLE")
    finally:
        if path:
            try:
                path.unlink(missing_ok=True)
            except Exception:
                pass


class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=MAX_TEXT_CHARS)
    locale: Literal["es", "en"]
    model_id: str


@app.post("/sabik-voice/synthesize")
async def synthesize(payload: TTSRequest):
    expected = TTS[payload.locale]
    if payload.model_id != expected["id"]:
        raise HTTPException(status_code=400, detail="MODEL_ID_MISMATCH")
    text = " ".join(payload.text.split()).strip()
    if not text:
        raise HTTPException(status_code=422, detail="EMPTY_TEXT")
    try:
        async with runtime.lock:
            wav = await asyncio.to_thread(runtime.synthesize_sync, text, payload.locale)
        return Response(
            content=wav,
            media_type="audio/wav",
            headers={
                "X-Sabik-Voice-Model": expected["id"],
                "X-Sabik-Voice-SHA256": expected["model_sha256"],
            },
        )
    except Exception:
        raise HTTPException(status_code=503, detail="TTS_UNAVAILABLE")


@app.get("/sabik-voice/health")
async def health():
    try:
        caps = runtime.readiness()
        return JSONResponse({"status": "ready", "schema": caps["schema"]})
    except Exception:
        return JSONResponse({"status": "not-ready"}, status_code=503)


if __name__ == "__main__":
    if not DIST.is_dir():
        raise SystemExit("dist missing: run python scripts/build_site.py first")
    # Verify all private artifacts before opening the browser surface.
    runtime.readiness()
    app.mount("/", StaticFiles(directory=str(DIST), html=True), name="dist")
    config = uvicorn.Config(
        app,
        host=os.environ.get("SABIK_VOICE_HOST", "127.0.0.1"),
        port=int(os.environ.get("SABIK_VOICE_PORT", "8767")),
        log_level="warning",
        access_log=False,
        server_header=False,
    )
    uvicorn.Server(config).run()
