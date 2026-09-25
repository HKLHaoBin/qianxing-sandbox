#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

pack="$root/tools/Miliastra-Node-Editor-Pack"
knowledge="$root/文档/Miliastra-knowledge"
beyond_workspace="$root/beyond-workspace"

if [[ ! -d "$pack/.git" ]]; then
  git clone https://github.com/Wu-Yijun/Genshin-Impact-Miliastra-Wonderland-Code-Node-Editor-Pack.git "$pack"
fi

if [[ ! -d "$knowledge/.git" ]]; then
  git clone https://github.com/1475505/Miliastra-knowledge.git "$knowledge"
fi

if [[ ! -d "$beyond_workspace" ]]; then
  mkdir -p "$beyond_workspace"
  cat >"$beyond_workspace/README.txt" <<EOF
本机 Lua / 客户端 UI 模拟器工作区（不入库）。
启动示例：
  beyond-simulator-web --workspace "$beyond_workspace" --open
MCP 配置示例见 tools/beyond-simulator/mcp.json.example
EOF
fi

if command -v npm >/dev/null 2>&1; then
  npm install --prefix "$pack"
  npm install -g beyond-simulator-web beyond-simulator-mcp || {
    echo "warning: beyond-simulator global install failed; see .cursor/skills/miliastra-beyond/references/install.md" >&2
  }
else
  echo "warning: npm not found; skipped node-editor-pack and beyond-simulator installs" >&2
fi
