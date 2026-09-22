# Clone missing third-party tools, then npm install the node editor pack.
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$pack = Join-Path $root "tools\Miliastra-Node-Editor-Pack"
$knowledge = Join-Path $root "文档\Miliastra-knowledge"

if (-not (Test-Path (Join-Path $pack ".git"))) {
  git clone https://github.com/Wu-Yijun/Genshin-Impact-Miliastra-Wonderland-Code-Node-Editor-Pack.git $pack
}

if (-not (Test-Path (Join-Path $knowledge ".git"))) {
  git clone https://github.com/1475505/Miliastra-knowledge.git $knowledge
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Warning "npm not found; skipped dependency install for tools\Miliastra-Node-Editor-Pack."
  exit 0
}

Push-Location $pack
try {
  npm install
  if ($LASTEXITCODE -ne 0) {
    throw "npm install failed with exit code $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}