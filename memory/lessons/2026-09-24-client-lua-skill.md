# 2026-09-24 客户端 Lua 技能入库

## 做了什么

- 新增技能 `.cursor/skills/miliastra-lua/`（含 `when-to-use-lua`、`workflow` 参考）
- 新增人读文档 `文档/客户端Lua与UI.md`
- `AGENTS.md` 增加第 6 条触发；`miliastra-brief` 约定 UI/2D **优先 Lua**；`README.md`、`memory-graph.md` 索引已更新

## 遇到的问题

- 国内知识库镜像尚无完整 7.1「客户端脚本 / 引用控件」正文；易被误判为「编辑器不支持 Lua」
- Lua 能力边界是 **客户端 UI**，不是用脚本替代元件实体节点图

## 怎么解决

- 以 7.1 奇匠指南与已公开综合指南（`ReferenceControl`、`Client Control Container`、`ControlPrefabIndex` 等）为准写入仓库
- 明确分工：屏幕表现优先 Lua；权威逻辑仍用服务端节点图
- API 签名要求以编辑器内文档为准，技能里不编造函数名

## 协作者下次可以直接用的结论

- 扇形手牌、自定义 HUD、2D 界面动画 → 读 `miliastra-lua`，优先 Lua
- 发牌/出牌/胜负/碰撞/元件实体逻辑 → 仍走节点图技能链
- 无 **客户端控件容器** 时客户端脚本不生效；扇形叠牌不要用 GridScroller
