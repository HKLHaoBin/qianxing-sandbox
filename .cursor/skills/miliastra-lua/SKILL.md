---
name: miliastra-lua
description: >-
  千星奇域 7.1 起的客户端 Lua（客户端脚本）与客户端控件：引用控件、控件模板索引、
  扇形手牌/自定义 HUD/2D 小游戏等 UI 表现。用户提到 Lua、客户端脚本、引用控件、
  控件模板、扇形牌、手牌 UI、自定义界面动画，或玩法明显是屏幕 UI/2D 交互时使用。
  此类表现优先用 Lua；编写与自测优先走 miliastra-beyond 模拟器；权威规则仍用服务端节点图。
---

# 客户端 Lua：适合就优先用

7.1 起千星沙箱支持 **客户端脚本（Lua）**，驱动 **客户端控件**。官方口径是强化 UI 交互、动画，以及大多数 **2D 玩法**。它不是服务端实体节点图的替代品。

**规则：玩法若主要是玩家屏幕上的 UI / 2D 表现，优先用 Lua；局内权威状态、碰撞、胜负、发牌校验走服务端节点图。**

**开发规则：一旦判定走 Lua，优先用千星沙箱模拟器（`miliastra-beyond`）编写、试玩与自测；官方编辑器 / 真机用于导入验证与最终确认。** 判定完归属后立刻读 `.cursor/skills/miliastra-beyond/SKILL.md` 并按其工具链执行，不要默认只在官方编辑器里盲改。

先读 `memory-graph.md`、`memory/lessons/`，以及存在的 `memory/local/`。细则与范例见：

- [references/when-to-use-lua.md](references/when-to-use-lua.md) — 何时优先 Lua、分工表、反例
- [references/workflow.md](references/workflow.md) — 官方编辑器概念与文档入口（真机链路）
- [references/authoring-pack.md](references/authoring-pack.md) — 本仓库 **客户端脚本需求档案 v3.1** 入口与按需索引
- [references/lua-coding-rules.md](references/lua-coding-rules.md) — 写码硬规则摘要（编号/按钮/Tween/生命周期）
- `.cursor/skills/miliastra-beyond/` — 模拟器安装、MCP/Web、试玩闭环（**日常开发优先**）
- 人读总览：`文档/客户端Lua与UI.md`、`文档/千星沙箱模拟器.md`

**API 权威顺序：** 本机档案 `docs/客户端控件API文档.md`（经索引定位后读正文）→ 编辑器内 Local UI Control API → 官方在线页。不要编造 API 名；档案快照与编辑器冲突时以编辑器为准并记 lesson。国内知识库镜像可能尚未收录 7.1 全文。

## 什么时候用

- 用户提到 Lua、客户端脚本、客户端控件、引用控件、控件模板索引
- 用户要做手牌扇形、自定义 HUD、进度/动画 UI、点选叠层、大多数纯 2D 小游戏界面
- `miliastra-brief` 拆玩法时，需要把「表现」与「权威逻辑」拆开

不要用本技能去改服务端节点图五要素说明；那是 `miliastra-node-edit`。查旧版节点/系统文档仍用 `miliastra-knowledge`。

## 步骤

### 1. 判定归属

对照 [when-to-use-lua.md](references/when-to-use-lua.md) 把需求拆成两栏：

| 栏 | 手段 |
|----|------|
| 屏幕表现（布局、旋转、层、选中动画、本机反馈） | **Lua + 客户端控件** |
| 权威逻辑（发牌结果、出牌是否合法、胜负、实体） | **服务端节点图**（可挂元件） |

完成：回复里能看到两栏各有什么；属于 UI/2D 表现的项明确写「优先 Lua」，不默认拆成一堆 3D 物件节点图。

### 2. 优先在模拟器落地，并按档案写码

1. 读并执行 `miliastra-beyond`：确认 Web/MCP、在 `beyond-workspace/`（或玩法子目录）打开/创建存档，用模拟器改 UI + Lua 并试玩。
2. 写或改脚本前：读 [authoring-pack.md](references/authoring-pack.md) → 档案 `AGENT.md`，再只加载当前任务分册；硬规则对照 [lua-coding-rules.md](references/lua-coding-rules.md)。需要练习骨架时从 `templates/README.md` 选 **一个** 相关文件，不要一次拼接多个模板。
3. 用 [workflow.md](references/workflow.md) 对齐官方概念名（客户端控件容器、模板、引用控件、脚本挂载），便于之后导出 GIA / 真机。
4. API：先经档案 `docs/本地API索引.md` 定位，再读 `docs/客户端控件API文档.md` 完整定义；必要时回编辑器核对。检索词示例：`ReferenceControl`、`ControlPrefabIndex`、`controlId`、`GridScrollerControl`（仅列表场景）。

完成：已指出模拟器入口与存档位置；所用 API/模板有档案或编辑器依据；官方链路概念与导出/真机步骤说得清。

### 3. 与 brief / project 衔接

若正在开新局（`miliastra-brief`）：

- `原件清单` 里 UI 表现可单列「客户端控件 / 脚本」项，不要假装成物件元件节点图
- 伪代码区分「玩家看见什么」（Lua）与「服务器承认什么」（节点图）

若用户只要某一个 HUD/手牌模块：直接给 Lua 侧步骤，并标明仍需哪些服务端事件/变量对齐。

完成：文档或回复里不会把扇形手牌误写成必须用实体节点图摆牌。

### 4. 边界与失败处理

- 无客户端控件容器 → 客户端控件与脚本不生效
- GridScroller / 网格视窗用于背包式列表，不用于自定义角度扇形叠牌；列表项走 `RefreshItems`，勿与 `InstantiateClientUIControl` 混用
- 脚本只能访问 **客户端控件** 的模板索引；服务端控件模板索引不可用
- 组合式按钮与预设按钮按结构区分（见档案 `docs/08`、`docs/10`）；空预设按钮不能用「点得动」证明已显示
- 交付时区分静态检查、模拟器观察、真机观察（档案 `docs/07`）；模拟通过 ≠ 真机通过
- 知识库查不到 7.1 内容时，改引本仓库档案、官方指南链接与编辑器内 API，并说明镜像可能未同步

完成：用户知道什么能靠 Lua 闭环、什么必须回节点图；写码边界有档案依据。
