param(
  [string]$SabikVoiceRoot = "C:\Users\mruiz\SabikVoice",
  [string]$HostAddress = "127.0.0.1",
  [int]$Port = 8765
)

$ErrorActionPreference = "Stop"
$RuntimeDir = $PSScriptRoot
$Python = Join-Path $SabikVoiceRoot ".venv\Scripts\python.exe"
$Discover = Join-Path $RuntimeDir "discover_private_models.py"

if (-not (Test-Path $Python)) {
  throw "R66_PRIVATE_PYTHON_NOT_FOUND: $Python"
}

$env:SABIKVOICE_ROOT = $SabikVoiceRoot
$env:SABIK_MODEL_HASH_PATTERN = "**/model.safetensors"

& $Python $Discover
if ($LASTEXITCODE -ne 0) {
  throw "R66_DYNAMIC_TTS_RUNTIME_ARTIFACT_REQUIRED"
}

$EsPath = Join-Path $SabikVoiceRoot "FINAL_MODELS\SABIK_ES_R01_FINAL"
$EnPath = Join-Path $SabikVoiceRoot "FINAL_MODELS\SABIK_EN_R02_FINAL"
foreach ($p in @(
  (Join-Path $EsPath "model.safetensors"),
  (Join-Path $EsPath "config.json"),
  (Join-Path $EnPath "model.safetensors"),
  (Join-Path $EnPath "config.json")
)) {
  if (-not (Test-Path $p)) { throw "R66_PRIVATE_MODEL_FILE_MISSING: $p" }
}

if (-not $env:SABIK_STT_ADAPTER_EXE) {
  throw "R66_STT_PRIVATE_ADAPTER_REQUIRED: set SABIK_STT_ADAPTER_EXE to the already-approved private ES/EN STT adapter"
}
if (-not (Test-Path $env:SABIK_STT_ADAPTER_EXE)) {
  throw "R66_STT_PRIVATE_ADAPTER_NOT_FOUND: $env:SABIK_STT_ADAPTER_EXE"
}

$ConfigPath = Join-Path $env:TEMP "sabik-r66-private-runtime-config.json"
$Config = @{
  schema = "iris-green/sabik-private-runtime-config/v1"
  tts = @{
    es = @{
      model_id = "SABIK_ES_R01_FINAL"
      model_sha256 = "8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291"
      model_path = $EsPath
      hash_file = "model.safetensors"
      mode = "custom_voice"
      speaker = "sabik_es"
      language = "Spanish"
      device_map = "cuda:0"
      dtype = "bfloat16"
      attn_implementation = "sdpa"
    }
    en = @{
      model_id = "SABIK_EN_R02_FINAL"
      model_sha256 = "3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df"
      model_path = $EnPath
      hash_file = "model.safetensors"
      mode = "custom_voice"
      speaker = "sabik_en"
      language = "English"
      device_map = "cuda:0"
      dtype = "bfloat16"
      attn_implementation = "sdpa"
    }
  }
  stt = @{
    command = @($env:SABIK_STT_ADAPTER_EXE)
    languages = @("es","en")
    engine = $(if ($env:SABIK_STT_ENGINE) {$env:SABIK_STT_ENGINE} else {"PRIVATE_CANONICAL_STT"})
    model = $(if ($env:SABIK_STT_MODEL) {$env:SABIK_STT_MODEL} else {"PRIVATE_CANONICAL_STT"})
  }
}
$Config | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 $ConfigPath
$env:SABIK_VOICE_PRIVATE_CONFIG = $ConfigPath

Write-Host "R66_PRIVATE_MODEL_HASHES_PASS"
Write-Host ("Starting private Sabik voice runtime on http://{0}:{1}" -f $HostAddress,$Port)
Push-Location $RuntimeDir
try {
  & $Python -m uvicorn runtime:app --host $HostAddress --port $Port --no-access-log
} finally {
  Pop-Location
  Remove-Item $ConfigPath -ErrorAction SilentlyContinue
}
