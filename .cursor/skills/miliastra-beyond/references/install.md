# 安装与 Cursor 接入

上游发布与版本以 npm / [release 说明](https://github.com/1475505/miliastra-beyond-simulator) 为准。本仓库通过 setup 安装**已发布包**，不把模拟器 Git 历史打进本仓。

## 一键（推荐）

在仓库根目录：

```powershell
.\scripts\setup.ps1
```

或：

```bash
./scripts/setup.sh
```

setup 会：

1. 照旧克隆节点编辑器包与知识库（若尚未存在）
2. `npm install -g beyond-simulator-web beyond-simulator-mcp`
3. 创建本机工作区目录 `beyond-workspace/`（已在 `.gitignore`，不入库）

需要 Node.js **22+**（与上游一致；包装载引擎声明 ≥20）。无 npm 时 setup 会警告并跳过模拟器安装。

## 手动安装

```sh
npm install -g beyond-simulator-web beyond-simulator-mcp
mkdir beyond-workspace
```

当前已知包版本（调研时）：Web / MCP `0.2.2`，Harness 插件 `dsh-plugin-beyond-simulator` `2.0.2`。升级再执行同一 `npm install -g …`。

## 工作区

| 路径 | 用途 |
|------|------|
| `beyond-workspace/` | 默认 MCP / Web `--workspace`；放各玩法 `.save.json` |
| `beyond-workspace/<slug>/` | 建议按玩法分子目录，与 `projects/<slug>/` 同名 |

只允许工作区内相对路径；MCP 会拒绝路径穿越。

## Cursor MCP

1. 复制 `tools/beyond-simulator/mcp.json.example` 中的 server 段到本机 Cursor MCP 配置（用户级或项目级，以你当前 Cursor 版本界面为准）。
2. 将 `--workspace` 换成**本仓库** `beyond-workspace` 的**绝对路径**。
3. 重启 Cursor / 重载 MCP 后，工具列表应出现：

   - `qxqy_project_open` / `qxqy_project_save`
   - `qxqy_studio_get` / `qxqy_studio_patch`
   - `qxqy_studio_play`
   - `qxqy_studio_ui_screenshot` / `qxqy_studio_play_screenshot`
   - `qxqy_studio_load`

若 MCP 未就绪，先用 Web，不阻塞开发：

```powershell
beyond-simulator-web --workspace "<仓库绝对路径>\beyond-workspace" --open
```

- 编辑器：http://127.0.0.1:4173/editor  
- 存档预览：http://127.0.0.1:4173/

可与 MCP 共用同一工作区：AI 保存 JSON 后，预览页会刷新；Web 编辑器里未保存草稿不会被自动覆盖。

## DeepSeek Harness（可选）

本方法论默认 Cursor + MCP / Web。若使用 DeepSeek Harness：

```sh
dsh plugin --profile web add dsh-plugin-beyond-simulator
dsh web
```

插件自带操作 Skill 与「千星 2D+Lua 游戏制作」Agent 预设；详见上游 `dsh-plugin/README.md`。

## 从源码（维护者）

仅在需要跟上游改模拟器本身时：

```sh
git clone https://github.com/1475505/miliastra-beyond-simulator.git tools/miliastra-beyond-simulator
cd tools/miliastra-beyond-simulator
pnpm install --frozen-lockfile
pnpm build && pnpm test
```

该目录已在 `.gitignore`。日常协作者用 npm 全局包即可。
