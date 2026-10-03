from __future__ import annotations

import hashlib
import io
import json
import os
import subprocess
import tempfile
import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

os.environ.setdefault("PYTORCH_CUDA_ALLOC_CONF", "expandable_segments:True")

import numpy as np
import soundfile as sf
import torch

# Windows compatibility already required by the original Sabik Qwen training scripts.
# Prevent optional sklearn discovery from pulling the problematic sklearn/SciPy path
# before qwen_tts initializes. This does not alter model weights or inference math.
import importlib.util as _iu
_original_find_spec = _iu.find_spec
_iu.find_spec = lambda name, *a, **k: (
    None if name == "sklearn" or name.startswith("sklearn.")
    else _original_find_spec(name, *a, **k)
)

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel

SCHEMA = "iris-green/sabik-voice-runtime/v1"
EXPECTED = {
    "es": {
        "model_id": "SABIK_ES_R01_FINAL",
        "model_sha256": "8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291",
        "language": "Spanish",
    },
    "en": {
        "model_id": "SABIK_EN_R02_FINAL",
        "model_sha256": "3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df",
        "language": "English",
    },
}
MAX_TEXT_CHARS = 4000
MAX_AUDIO_BYTES = 20 * 1024 * 1024
NO_STORE = {"Cache-Control": "no-store, max-age=0", "Pragma": "no-cache"}

def _sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def _load_config() -> dict:
    cfg_path = os.environ.get("SABIK_VOICE_PRIVATE_CONFIG")
    if not cfg_path:
        raise RuntimeError("SABIK_VOICE_PRIVATE_CONFIG_REQUIRED")
    p = Path(cfg_path)
    if not p.is_file():
        raise RuntimeError("SABIK_VOICE_PRIVATE_CONFIG_NOT_FOUND")
    data = json.loads(p.read_text(encoding="utf-8"))
    if data.get("schema") != "iris-green/sabik-private-runtime-config/v1":
        raise RuntimeError("SABIK_VOICE_PRIVATE_CONFIG_SCHEMA_MISMATCH")
    return data

@dataclass(frozen=True)
class ModelSpec:
    locale: str
    model_id: str
    expected_sha256: str
    model_path: Path
    hash_path: Path
    mode: str
    speaker: Optional[str]
    language: str
    ref_audio: Optional[Path]
    ref_text: Optional[str]
    attn_implementation: str
    device_map: str
    dtype: str

    @staticmethod
    def from_config(locale: str, raw: dict) -> "ModelSpec":
        canonical = EXPECTED[locale]
        model_id = str(raw.get("model_id", ""))
        if model_id != canonical["model_id"]:
            raise RuntimeError(f"MODEL_ID_MISMATCH_{locale.upper()}")
        expected_sha = str(raw.get("model_sha256", "")).lower()
        if expected_sha != canonical["model_sha256"]:
            raise RuntimeError(f"MODEL_SHA_CONFIG_MISMATCH_{locale.upper()}")
        model_path = Path(str(raw.get("model_path", "")))
        if not model_path.is_dir():
            raise RuntimeError(f"MODEL_PATH_NOT_FOUND_{locale.upper()}")
        hash_rel = raw.get("hash_file")
        if not hash_rel:
            raise RuntimeError(f"MODEL_HASH_FILE_REQUIRED_{locale.upper()}")
        hash_path = model_path / str(hash_rel)
        if not hash_path.is_file():
            raise RuntimeError(f"MODEL_HASH_FILE_NOT_FOUND_{locale.upper()}")
        actual = _sha256(hash_path)
        if actual.lower() != expected_sha:
            raise RuntimeError(f"MODEL_HASH_MISMATCH_{locale.upper()}")
        mode = str(raw.get("mode", "custom_voice"))
        if mode not in {"custom_voice", "voice_clone"}:
            raise RuntimeError(f"MODEL_MODE_UNSUPPORTED_{locale.upper()}")
        speaker = raw.get("speaker")
        ref_audio = Path(raw["ref_audio"]) if raw.get("ref_audio") else None
        ref_text = raw.get("ref_text")
        if mode == "custom_voice" and not speaker:
            raise RuntimeError(f"MODEL_SPEAKER_REQUIRED_{locale.upper()}")
        if mode == "voice_clone":
            if not ref_audio or not ref_audio.is_file() or not ref_text:
                raise RuntimeError(f"MODEL_PRIVATE_REFERENCE_REQUIRED_{locale.upper()}")
        return ModelSpec(
            locale=locale,
            model_id=model_id,
            expected_sha256=expected_sha,
            model_path=model_path,
            hash_path=hash_path,
            mode=mode,
            speaker=str(speaker) if speaker else None,
            language=str(raw.get("language") or canonical["language"]),
            ref_audio=ref_audio,
            ref_text=str(ref_text) if ref_text else None,
            attn_implementation=str(raw.get("attn_implementation", "sdpa")),
            device_map=str(raw.get("device_map", "cuda:0")),
            dtype=str(raw.get("dtype", "bfloat16")),
        )

class TTSBackend:
    def __init__(self, spec: ModelSpec):
        self.spec = spec
        self._model = None
        self._prompt = None
        self._lock = threading.Lock()

    def load(self) -> None:
        from qwen_tts import Qwen3TTSModel
        dtype = {
            "bfloat16": torch.bfloat16,
            "float16": torch.float16,
            "float32": torch.float32,
        }.get(self.spec.dtype)
        if dtype is None:
            raise RuntimeError(f"MODEL_DTYPE_UNSUPPORTED_{self.spec.locale.upper()}")
        self._model = Qwen3TTSModel.from_pretrained(
            str(self.spec.model_path),
            device_map=self.spec.device_map,
            dtype=dtype,
            attn_implementation=self.spec.attn_implementation,
        )
        if self.spec.mode == "voice_clone":
            self._prompt = self._model.create_voice_clone_prompt(
                ref_audio=str(self.spec.ref_audio),
                ref_text=self.spec.ref_text,
                x_vector_only_mode=False,
            )

    def synthesize(self, text: str) -> bytes:
        if self._model is None:
            raise RuntimeError("TTS_MODEL_NOT_LOADED")
        with self._lock, torch.inference_mode():
            kwargs = dict(
                text=text,
                language=self.spec.language,
                non_streaming_mode=True,
                do_sample=True,
                top_k=50,
                top_p=1.0,
                temperature=0.9,
                repetition_penalty=1.05,
                max_new_tokens=2048,
            )
            if self.spec.mode == "custom_voice":
                wavs, sr = self._model.generate_custom_voice(
                    speaker=self.spec.speaker,
                    **kwargs,
                )
            else:
                wavs, sr = self._model.generate_voice_clone(
                    voice_clone_prompt=self._prompt,
                    **kwargs,
                )
            arr = np.asarray(wavs[0], dtype=np.float32)
            out = io.BytesIO()
            sf.write(out, arr, int(sr), format="WAV", subtype="PCM_16")
            return out.getvalue()

class STTCommandBackend:
    def __init__(self, raw: dict):
        cmd = raw.get("command")
        if not isinstance(cmd, list) or not cmd or not all(isinstance(x, str) and x for x in cmd):
            raise RuntimeError("STT_COMMAND_REQUIRED")
        self.command = cmd
        langs = raw.get("languages")
        if sorted(langs or []) != ["en", "es"]:
            raise RuntimeError("STT_LANGUAGES_MUST_BE_ES_EN")
        self.engine = str(raw.get("engine", "private-self-hosted"))
        self.model = str(raw.get("model", "private"))

    def transcribe(self, audio: bytes, suffix: str, locale: str) -> dict:
        with tempfile.TemporaryDirectory(prefix="sabik-stt-") as td:
            p = Path(td) / ("turn" + suffix)
            p.write_bytes(audio)
            proc = subprocess.run(
                [*self.command, "--input", str(p), "--locale", locale],
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL,
                text=True,
                timeout=60,
                check=False,
                shell=False,
                env={**os.environ, "SABIK_NO_STORE": "1"},
            )
            try:
                p.unlink(missing_ok=True)
            except Exception:
                pass
            if proc.returncode != 0:
                raise RuntimeError("STT_BACKEND_ERROR")
            try:
                payload = json.loads(proc.stdout)
            except Exception as exc:
                raise RuntimeError("STT_BACKEND_BAD_JSON") from exc
            text = " ".join(str(payload.get("text", "")).split())
            if not text:
                raise RuntimeError("STT_EMPTY")
            out_locale = str(payload.get("locale", locale)).lower()[:2]
            if out_locale != locale:
                raise RuntimeError("STT_LANGUAGE_MISMATCH")
            return {"text": text, "locale": locale, "engine": self.engine, "model": self.model}

class SynthRequest(BaseModel):
    text: str
    locale: str
    model_id: str

class RuntimeState:
    def __init__(self):
        self.config = _load_config()
        models = self.config.get("tts", {})
        self.specs = {lang: ModelSpec.from_config(lang, models.get(lang, {})) for lang in ("es", "en")}
        self.tts = {lang: TTSBackend(spec) for lang, spec in self.specs.items()}
        self.stt = STTCommandBackend(self.config.get("stt", {}))
        for backend in self.tts.values():
            backend.load()

STATE: Optional[RuntimeState] = None
app = FastAPI(title="Sabik private voice runtime", docs_url=None, redoc_url=None, openapi_url=None)

@app.on_event("startup")
def _startup() -> None:
    global STATE
    STATE = RuntimeState()

def _state() -> RuntimeState:
    if STATE is None:
        raise HTTPException(status_code=503, detail="VOICE_RUNTIME_NOT_READY")
    return STATE

@app.get("/sabik-voice/capabilities")
def capabilities() -> JSONResponse:
    s = _state()
    body = {
        "schema": SCHEMA,
        "privacy": {"no_store": True, "persist_audio": False, "persist_transcript": False},
        "stt": {"self_hosted": True, "languages": ["es", "en"], "engine": s.stt.engine, "model": s.stt.model},
        "tts": {
            lang: {
                "self_hosted": True,
                "model_id": spec.model_id,
                "model_sha256": spec.expected_sha256,
            }
            for lang, spec in s.specs.items()
        },
    }
    return JSONResponse(body, headers=NO_STORE)

@app.post("/sabik-voice/synthesize")
def synthesize(req: SynthRequest) -> Response:
    s = _state()
    locale = req.locale.lower()[:2]
    if locale not in ("es", "en"):
        raise HTTPException(status_code=400, detail="TTS_LOCALE_UNSUPPORTED")
    spec = s.specs[locale]
    if req.model_id != spec.model_id:
        raise HTTPException(status_code=409, detail="TTS_MODEL_ID_MISMATCH")
    text = " ".join(req.text.split())
    if not text or len(text) > MAX_TEXT_CHARS:
        raise HTTPException(status_code=400, detail="TTS_TEXT_INVALID")
    try:
        wav = s.tts[locale].synthesize(text)
    except Exception as exc:
        raise HTTPException(status_code=503, detail="TTS_BACKEND_ERROR") from exc
    return Response(wav, media_type="audio/wav", headers=NO_STORE)

@app.post("/sabik-voice/transcribe")
async def transcribe(audio: UploadFile = File(...), locale: str = Form(...)) -> JSONResponse:
    s = _state()
    lang = locale.lower()[:2]
    if lang not in ("es", "en"):
        raise HTTPException(status_code=400, detail="STT_LOCALE_UNSUPPORTED")
    data = await audio.read(MAX_AUDIO_BYTES + 1)
    if not data or len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="STT_AUDIO_SIZE_INVALID")
    ctype = (audio.content_type or "").lower()
    suffix = ".ogg" if "ogg" in ctype else ".webm"
    try:
        result = s.stt.transcribe(data, suffix, lang)
    except Exception as exc:
        raise HTTPException(status_code=503, detail="STT_BACKEND_ERROR") from exc
    return JSONResponse(result, headers=NO_STORE)
