# 补齐第三方工具

本仓库不打包这两份公开仓库的历史。缺目录时再克隆。

```powershell
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

if (Get-Command npm -ErrorAction SilentlyContinue) {
  npm install --prefix $pack
}
