#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

pack="$root/tools/Miliastra-Node-Editor-Pack"
knowledge="$root/文档/Miliastra-knowledge"

if [[ ! -d "$pack/.git" ]]; then
  git clone https://github.com/Wu-Yijun/Genshin-Impact-Miliastra-Wonderland-Code-Node-Editor-Pack.git "$pack"
fi

if [[ ! -d "$knowledge/.git" ]]; then
  git clone https://github.com/1475505/Miliastra-knowledge.git "$knowledge"
fi

if command -v npm >/dev/null 2>&1; then
  npm install --prefix "$pack"
fi
