# Memory Graph — 千星沙箱

- slug: 千星沙箱
- path: F:\编程\千星沙箱
- updated: 2026-09-25

## Summary

《原神》千星沙箱的协作习惯仓库：技能、可复用经验、常用资产。别人克隆后直接对 AI 描述想做的游戏；AI 先列出全部原件和节点图，再写伪代码和分工。私人玩法资产不入库。7.1 起屏幕 UI / 2D 表现优先客户端 Lua；Lua 开发与自测优先走千星沙箱模拟器（Beyond）。

## Entities

- miliastra-brief (Skill)：描述玩法 → `projects/<slug>/` 原件清单、伪代码、节点图文档、分工。
- miliastra-project (Skill)：先读整局，再回答「我需要这个元件的节点图信息」或某个节点的问题。
- miliastra-sync (Skill)：确认资产后 pull / merge / push，再写 lesson 并第二次 push。
- miliastra-node-edit (Skill)：改节点图时的五要素和空号优先 ID。
- miliastra-knowledge (Skill)：节点与官方文档查询。
- miliastra-lua (Skill)：7.1 客户端 Lua / 客户端控件；UI·2D 表现优先 Lua；写码细则指向需求档案。
- miliastra-beyond (Skill)：外置模拟器 Web/MCP；Lua 日常开发与试玩优先。
- 客户端脚本需求档案 v3.1 (文档包)：`千星奇域Lua开发环境-客户端脚本需求档案-v3.1/`（AGENT、API 快照、templates）。
- 客户端Lua与UI (文档)：`文档/客户端Lua与UI.md`。
- 千星沙箱模拟器 (文档)：`文档/千星沙箱模拟器.md`。
- beyond-simulator (工具)：`tools/beyond-simulator/` 配置示例；npm `beyond-simulator-web` / `beyond-simulator-mcp`。
- 常用复合节点大全 (资产)：根目录 `常用复合节点大全v1.7(补充包同步更新中).gia`。
- 数据结构：队列-二维数组-栈 (资产)：根目录 `数据结构：队列-二维数组-栈.gia`。
- projects (目录)：每个玩法一份 BRIEF、原件清单、分工、原件伪代码和节点图文档。

## Relations

- miliastra-brief -writes-> projects
- miliastra-brief -may-read-> miliastra-lua
- miliastra-brief -may-read-> miliastra-beyond
- miliastra-project -reads-> projects
- miliastra-project -reads-> memory/lessons
- miliastra-sync -pushes-> GitHub
- miliastra-sync -appends-> memory/lessons
- miliastra-node-edit -governs-> 节点图改动说明
- miliastra-lua -documents-> 客户端Lua与UI
- miliastra-lua -indexes-> 客户端脚本需求档案 v3.1
- miliastra-lua -defers-dev-to-> miliastra-beyond
- miliastra-beyond -documents-> 千星沙箱模拟器
- miliastra-beyond -uses-> beyond-simulator
- miliastra-beyond -defers-api-to-> 客户端脚本需求档案 v3.1

## Facts

- 协作者要某元件的做法时，对 AI 说：我需要元件「…」的节点图信息。
- 搜索 ID 以该节点图文档或导出为准。两处都没有则标「文档未记录」。
- `memory/local/`、`门限夺宝/`、`门线夺宝/`、`文档/限时夺宝-时间门/`、`beyond-workspace/`、`tools/miliastra-beyond-simulator/` 不上传。
- 第三方知识库和节点编辑器包用 `scripts/setup.ps1` 克隆；模拟器用同一脚本 `npm install -g`，不嵌进本仓库历史。
- 7.1 客户端脚本驱动客户端控件；引用控件对应模板引用；无客户端控件容器则脚本不生效。
- 上游模拟器：https://github.com/1475505/miliastra-beyond-simulator （GPL-3.0-only）。
- 客户端 Lua 写码：本仓库需求档案 v3.1（`AGENT.md`）+ Beyond 试玩；API 冲突以编辑器为准。

## Decisions

- 规则写在 `AGENTS.md`，步骤写在 skill。时机到了就读 skill 并做完，不等用户提醒提交。
- 记忆按篇追加到 `memory/lessons/`。合并规则见 `memory/MERGE.md`，两边的教训都留。
- 节点图做完的同步顺序：展示文件 → 用户确认 → 拉取合并推送 → 写记忆 → 再拉取合并推送。
- 屏幕 UI / 2D 表现优先 Lua；权威逻辑仍用服务端节点图（见 miliastra-lua）。
- Lua 开发优先 Beyond 模拟器；真机与官方编辑器做最终验证（见 miliastra-beyond）。
- Lua 实现细则以需求档案为准；lua/beyond 只做归属与工具路由，不替代档案正文。

## Lessons

- 2026-09-22 编辑器手法（计时器控件、节点真名、ID 空号、两元件不要共用获取实体）：`memory/lessons/2026-09-22-node-edit-basics.md`
- 2026-09-24 客户端 Lua 能力入库与「UI 优先 Lua」约定：`memory/lessons/2026-09-24-client-lua-skill.md`
- 2026-09-25 Beyond 模拟器接入与「Lua 优先模拟器开发」：`memory/lessons/2026-09-25-beyond-simulator-skill.md`
- 2026-09-25 需求档案 v3.1 入库与 lua/beyond 接线：`memory/lessons/2026-09-25-lua-authoring-pack-v31.md`
