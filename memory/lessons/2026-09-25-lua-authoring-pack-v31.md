# 2026-09-25 客户端脚本需求档案 v3.1 入库与技能接线

## 做了什么

- 将 `千星奇域Lua开发环境-客户端脚本需求档案-v3.1/`（API 快照、prompts、templates、guides）作为可复用文档入库
- `miliastra-lua` 增加 `references/authoring-pack.md`、`references/lua-coding-rules.md`；写码步骤改为：Beyond 试玩 + 档案查 API/模板
- `miliastra-beyond` / brief / AGENTS / README / 人读文档接到档案索引；档案 README 注明在本仓库内与 lua/beyond 的分工
- 根目录同名 `.zip` 不入库（与展开目录重复）

## 遇到的问题

- 此前两个 skill 只解决「要不要 Lua」和「用哪套工具」，写码细则悬空，易编造 API 或混用编号
- 档案可独立复制，若不接线，协作者 AI 不会自动打开 `AGENT.md`
- v3.1 按钮术语（组合式 vs 预设、空外观仍可点中）若不进 skill，易把「点得动」当成「看得见」

## 怎么解决

- 三分法固定：`miliastra-lua` 判归属 → `miliastra-beyond` 写测 → 需求档案管 API/模板/硬规则/交付反查
- API 权威顺序：档案正文 → 编辑器内文档 → 在线页；冲突以编辑器为准并写 lesson
- 硬规则摘要进 skill，完整条文仍按任务只加载档案分册，不默认通读 `guides/`

## 协作者下次可以直接用的结论

- 写客户端 Lua：读 `miliastra-lua` → `authoring-pack.md` → 档案 `AGENT.md`；试玩走 Beyond
- 预设按钮 / 网格背包：先档案 `docs/10`、`docs/11`、`docs/16` 与对应模板，不要猜结构
- 编号（模板索引、`imageId`、运行时 id、脚本映射等）不可互换；合法 `0` 不是「未填」
- 交付分开写静态检查、模拟器观察、真机观察；模拟通过 ≠ 真机通过
