---
name: miliastra-format
description: >-
  千星奇域数据格式与编辑器行为（社区研究文档 qianxing-format-docs）：.gil/.gis/.gia
  容器与数据模型、离线合成/校验、节点连线兼容、实体尺寸/BOM、运行语义与编辑器行为定律。
  用户问文件格式、二进制图结构、不开编辑器构图、gia 打包导入细节、格式层排障时使用。
  官方玩法/节点用法仍走 miliastra-knowledge；客户端 Lua/UI 走 miliastra-lua。
---

# 千星格式层知识库（第三份知识源）

上游：[hang-ZYM/qianxing-format-docs](https://github.com/hang-ZYM/qianxing-format-docs)（CC-BY-4.0 文档）。本仓库不嵌其历史；用 `scripts/setup` 克隆到 `文档/qianxing-format-docs/`。

这是与官方知识库、Lua 创作包并列的**格式层**：讲本地文件长什么样、编辑器会怎么重写/校验，以及如何按任务查手册。不是官方玩法说明书。

人读总览：`文档/千星格式知识库.md`。入口索引：[references/index.md](references/index.md)。边界：[references/boundaries.md](references/boundaries.md)。

## 什么时候用

- `.gil` / `.gis` / `.gia` 容器、字段、文件族、段位、重保存行为
- 离线合成/校验关卡图、最小合法图、模板图、`qxfmt` 工具链
- 节点连线兼容、实体尺寸表、实体 BOM / 反向提取、配怪与组件 schema 级细节
- 编辑器行为定律、运行语义实证、格式层排障判例
- 用户明确要「按格式文档做」或「不开编辑器产出可保存文件」

## 什么时候不用

| 需求 | 改走 |
|------|------|
| 节点中文含义、官方系统怎么配、FAQ | `miliastra-knowledge` |
| 客户端 Lua / 控件 / HUD | `miliastra-lua` → `miliastra-beyond` |
| 指导人在编辑器里改节点图（五要素） | `miliastra-node-edit` |
| 玩法拆原件 / 伪代码 | `miliastra-brief` / `miliastra-project` |

格式结论与官方文档冲突时：**交付给真人编辑器操作仍以官方文档 + 编辑器实机为准**；格式层结论注明来源篇目与证据分级（对方文档中的 [A]/[J]/[P]/[C]）。

## 步骤

1. 确认目录存在：`文档/qianxing-format-docs/`（否则跑 `.\scripts\setup.ps1` 或 `scripts/setup.sh`）。
2. 先读对方 `manuals/00_目录与使用说明.md` 或本技能 [references/index.md](references/index.md)，按任务只开 1～2 册/卷，不要通读。
3. 需要「为什么/字段级」时再进 `docs/`；需要十分钟工具路径时读 `QUICKSTART.md`。
4. 回答时写明读了哪篇（`manuals/…` 或 `docs/…`），区分已写明结论与推测；遵守 [boundaries.md](references/boundaries.md)。

## 与其它技能

- 查官方节点用法后仍要核对连线/容器合法性 → 可再读本技能相关手册。
- 解析本仓 `tools/` 下 `.gia` 脚本与 Node Editor Pack 是实现侧；语义与格式定律以本克隆库文档为准（并交叉官方知识库）。
