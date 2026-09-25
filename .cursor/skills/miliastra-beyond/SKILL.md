---
name: miliastra-beyond
description: >-
  千星沙箱外置模拟器（miliastra-beyond-simulator）：用 Web / MCP 编辑客户端 UI 与 Lua、
  试玩、截图与自动测试。用户要写或调试 Lua、客户端控件、2D/HUD/手牌 UI，或说模拟器、
  beyond、试玩存档、GIA 与 Authoring JSON 往返时使用。Lua 开发优先走本工具链，
  真机与官方编辑器用于最终验证。
---

# 千星沙箱模拟器：Lua 优先在此开发

外置工具链上游：[1475505/miliastra-beyond-simulator](https://github.com/1475505/miliastra-beyond-simulator)（GPL-3.0-only）。本仓库不嵌源码历史；用 `scripts/setup` 装 npm 包，工作区在 `beyond-workspace/`。

**规则：需要写或调试客户端 Lua / 客户端控件时，优先在本模拟器里完成「编写 → 试玩 → 截图/日志 → 修改」；通过后再导出资产，在千星奇域真机与官方编辑器做最终验证。** 权威局内逻辑仍归服务端节点图（见 `miliastra-lua` / `miliastra-node-edit`）。

先读 `memory-graph.md`、`memory/lessons/`，以及存在的 `memory/local/`。分工判定仍读 `miliastra-lua`；本技能只管模拟器工具链。

细则：

- [references/install.md](references/install.md) — 安装 Web / MCP、工作区、Cursor 配置
- [references/dev-loop.md](references/dev-loop.md) — MCP 工具与开发闭环
- [references/boundaries.md](references/boundaries.md) — 能力边界与导出约定
- 人读总览：`文档/千星沙箱模拟器.md`

## 什么时候用

- 用户要做或改 Lua、客户端控件、扇形手牌、HUD、2D 界面
- 用户提到模拟器、beyond、试玩、存档 JSON、Authoring、GIA 导入导出
- `miliastra-lua` 已判定「优先 Lua」之后的具体落地与调试

不要用本技能替代节点图五要素说明，也不要用模拟器结果冒充真机通过。

## 步骤

### 1. 确认工具可用

按 [install.md](references/install.md) 检查：

- Node.js 22+（官方推荐；npm 包装载要求 ≥20）
- 已执行仓库根目录 `.\scripts\setup.ps1`（或 `scripts/setup.sh`），其中会安装 `beyond-simulator-web` / `beyond-simulator-mcp`
- 工作区目录存在：默认 `beyond-workspace/`（本机，不入库）
- Cursor 已按示例配置 MCP（见 `tools/beyond-simulator/mcp.json.example`）；若 MCP 命名空间不可用，改用 Web：`beyond-simulator-web --workspace <绝对路径> --open`

完成：能指出将用的入口（MCP 工具列表可见，或 Web `http://127.0.0.1:4173/editor` 可开）。

### 2. 打开或创建工程存档

一个存档管三类资产：**服务端 UI 容器、客户端 UI 模板、Lua 脚本**。

| 用户手里有什么 | 做法 |
|----------------|------|
| 已有 `.save.json` / 工作区存档 | MCP：`qxqy_project_open`；或 Web 顶栏选工作区存档 / 导入 |
| 真机 `.gia` | 引导在编辑器顶栏「导入」；再 `qxqy_studio_get` 读 Authoring 树 |
| 从零 | `qxqy_studio_patch` 建控件与脚本，或 Web UI 编辑页手搭 |

路径只允许工作区内相对路径。写操作带最新 `expectedRevision`；冲突时重新 `get` 再改。

完成：已有可 `get` 的工程句柄或 Web 中打开的存档。

### 3. 在模拟器里实现并试玩

按 [dev-loop.md](references/dev-loop.md)：

1. 改 UI / Lua（`patch` 或指导用户在 Web 编辑）
2. `qxqy_studio_play`：`start` → 指针/按键 → `get` / 截图 → 断言或读日志
3. 布局用 `qxqy_studio_ui_screenshot`；运行时画面用 `qxqy_studio_play_screenshot`（需先 `start`）
4. 多画布用 `canvasId`（如 `mobile-16-9`）；需要时再开多人 `playerCount`

API 名以编辑器 / 工作区文档为准，不编造。模拟器装包不含完整官方知识库；需要节点或官方控件说明时另走 `miliastra-knowledge` / 编辑器内 API。

完成：用例或人工试玩在模拟器内达到预期；问题有日志或截图依据。

### 4. 保存、导出，再进真机

- 继续开发：显式保存完整存档（MCP `qxqy_project_save` 或 Web「保存存档」）；试玩不会自动写盘
- 交官方编辑器：导出已支持的 GIA，并按 [boundaries.md](references/boundaries.md) 说明丢失风险；保留 JSON 存档作真源
- 真机试玩发现问题 → 回模拟器复现修复 → 再导出验证

完成：用户知道存档路径、导出了什么、以及「模拟器通过 ≠ 真机通过」。

### 5. 与 brief / project 衔接

开新局时：原件清单里 UI 表现写「客户端脚本 + beyond 存档」，并给出建议路径如 `beyond-workspace/<slug>/`。  
只改某一 HUD/手牌模块时：直接在模拟器改，并标明仍需对齐的服务端信号/变量（名称以项目文档为准）。
