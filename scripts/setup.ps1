# Clone missing third-party tools, npm install the node editor pack,
# and install the Qianxing beyond simulator (Web + MCP) for Lua/UI work.
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$pack = Join-Path $root "tools\Miliastra-Node-Editor-Pack"
$knowledge = Join-Path $root "文档\Miliastra-knowledge"
$beyondWorkspace = Join-Path $root "beyond-workspace"

if (-not (Test-Path (Join-Path $pack ".git"))) {
  git clone https://github.com/Wu-Yijun/Genshin-Impact-Miliastra-Wonderland-Code-Node-Editor-Pack.git $pack
}

if (-not (Test-Path (Join-Path $knowledge ".git"))) {
  git clone https://github.com/1475505/Miliastra-knowledge.git $knowledge
}

if (-not (Test-Path $beyondWorkspace)) {
  New-Item -ItemType Directory -Path $beyondWorkspace | Out-Null
  Set-Content -Path (Join-Path $beyondWorkspace "README.txt") -Encoding utf8 -Value @"
本机 Lua / 客户端 UI 模拟器工作区（不入库）。
启动示例：
  beyond-simulator-web --workspace `"$beyondWorkspace`" --open
MCP 配置示例见 tools\beyond-simulator\mcp.json.example
"@
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Warning "npm not found; skipped node-editor-pack install and beyond-simulator packages."
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

npm install -g beyond-simulator-web beyond-simulator-mcp
if ($LASTEXITCODE -ne 0) {
  Write-Warning "beyond-simulator global install failed (exit $LASTEXITCODE). See .cursor/skills/miliastra-beyond/references/install.md"
}