# Memory Graph — 千星沙箱

- slug: 千星沙箱
- path: F:\编程\千星沙箱
- updated: 2026-09-22

## Summary

《原神》千星沙箱的协作习惯仓库：技能、可复用经验、常用资产。别人克隆后直接对 AI 描述想做的游戏；AI 先列出全部原件和节点图，再写伪代码和分工。私人玩法资产不入库。

## Entities

- miliastra-brief (Skill)：描述玩法 → `projects/<slug>/` 原件清单、伪代码、节点图文档、分工。
- miliastra-project (Skill)：先读整局，再回答「我需要这个元件的节点图信息」或某个节点的问题。
- miliastra-sync (Skill)：确认资产后 pull / merge / push，再写 lesson 并第二次 push。
- miliastra-node-edit (Skill)：改节点图时的五要素和空号优先 ID。
- miliastra-knowledge (Skill)：节点与官方文档查询。
- 常用复合节点大全 (资产)：根目录 `常用复合节点大全v1.7(补充包同步更新中).gia`。
- 数据结构：队列-二维数组-栈 (资产)：根目录 `数据结构：队列-二维数组-栈.gia`。
- projects (目录)：每个玩法一份 BRIEF、原件清单、分工、原件伪代码和节点图文档。

## Relations

- miliastra-brief -writes-> projects
- miliastra-project -reads-> projects
- miliastra-project -reads-> memory/lessons
- miliastra-sync -pushes-> GitHub
- miliastra-sync -appends-> memory/lessons
- miliastra-node-edit -governs-> 节点图改动说明

## Facts

- 协作者要某元件的做法时，对 AI 说：我需要元件「…」的节点图信息。
- 搜索 ID 以该节点图文档或导出为准。两处都没有则标「文档未记录」。
- `memory/local/`、`门限夺宝/`、`门线夺宝/`、`文档/限时夺宝-时间门/` 不上传。
- 第三方知识库和节点编辑器包用 `scripts/setup.ps1` 克隆，不嵌进本仓库历史。

## Decisions

- 规则写在 `AGENTS.md`，步骤写在 skill。时机到了就读 skill 并做完，不等用户提醒提交。
- 记忆按篇追加到 `memory/lessons/`。合并规则见 `memory/MERGE.md`，两边的教训都留。
- 节点图做完的同步顺序：展示文件 → 用户确认 → 拉取合并推送 → 写记忆 → 再拉取合并推送。

## Lessons

- 2026-09-22 编辑器手法（计时器控件、节点真名、ID 空号、两元件不要共用获取实体）：`memory/lessons/2026-09-22-node-edit-basics.md`
