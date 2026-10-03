#!/usr/bin/env python3
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
PKG=ROOT/"tools"/"sabik-voice-runtime-r66"
runtime=(PKG/"runtime.py").read_text(encoding="utf-8")
discover=(PKG/"discover_private_models.py").read_text(encoding="utf-8")
config=json.loads((PKG/"private-config.example.json").read_text(encoding="utf-8"))
launcher=(PKG/"start_private_runtime_windows.ps1").read_text(encoding="utf-8")

compile(runtime,str(PKG/"runtime.py"),"exec")
compile(discover,str(PKG/"discover_private_models.py"),"exec")

ES_ID="SABIK_ES_R01_FINAL"
ES_SHA="8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291"
EN_ID="SABIK_EN_R02_FINAL"
EN_SHA="3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df"

for value in (ES_ID,ES_SHA,EN_ID,EN_SHA):
    assert value in runtime
    assert value in discover
    assert value in launcher

for route in (
    '@app.get("/sabik-voice/capabilities")',
    '@app.post("/sabik-voice/transcribe")',
    '@app.post("/sabik-voice/synthesize")',
):
    assert route in runtime,route

for forbidden in ("speechSynthesis","SpeechSynthesisUtterance","pyttsx","gTTS","elevenlabs"):
    assert forbidden not in runtime

assert "generate_custom_voice" in runtime
assert "generate_voice_clone" in runtime
assert "MODEL_HASH_MISMATCH" in runtime
assert '"no_store": True' in runtime
assert '"persist_audio": False' in runtime
assert '"persist_transcript": False' in runtime
assert 'NO_STORE' in runtime
assert 'TemporaryDirectory' in runtime
assert 'shell=False' in runtime

for lang,mid,sha,speaker,folder in (
    ("es",ES_ID,ES_SHA,"sabik_es","FINAL_MODELS/SABIK_ES_R01_FINAL"),
    ("en",EN_ID,EN_SHA,"sabik_en","FINAL_MODELS/SABIK_EN_R02_FINAL"),
):
    row=config["tts"][lang]
    assert row["model_id"]==mid
    assert row["model_sha256"]==sha
    assert row["hash_file"]=="model.safetensors"
    assert row["mode"]=="custom_voice"
    assert row["speaker"]==speaker
    assert folder.lower() in row["model_path"].replace("\\","/").lower()

assert "--no-access-log" in launcher
assert "R66_STT_PRIVATE_ADAPTER_REQUIRED" in launcher
assert "R66_DYNAMIC_TTS_RUNTIME_ARTIFACT_REQUIRED" in launcher

print(json.dumps({
    "gate":"ECO_R66_PRIVATE_RUNTIME_STATIC_PASS",
    "real_private_weights_exercised":False,
    "eco_media_validation_pass":False,
    "client_contract":"iris-green/sabik-voice-runtime/v1",
    "es_model":ES_ID,
    "en_model":EN_ID,
    "es_runtime_mode":"custom_voice",
    "en_runtime_mode":"custom_voice",
    "final_model_paths_locked":True,
    "fail_closed_identity":True,
    "system_tts_fallback":False
},ensure_ascii=False))
