# 2026-09-25 Beyond 模拟器接入方法论仓库

## 做了什么

- 新增技能 `.cursor/skills/miliastra-beyond/`（安装、开发闭环、边界）
- 新增人读文档 `文档/千星沙箱模拟器.md`；工具侧 `tools/beyond-simulator/mcp.json.example`
- `scripts/setup.ps1` / `setup.sh` 增加全局安装 `beyond-simulator-web` / `beyond-simulator-mcp`，并创建 `beyond-workspace/`
- `miliastra-lua` / `miliastra-brief` / `AGENTS.md` / `README.md`：Lua **开发与自测优先走模拟器**，真机做最终验证

## 遇到的问题

- 上游是独立 GPL 仓库，不宜把源码历史打进本仓；协作者需要开箱即用的接入方式
- 仅写「优先 Lua」仍会默认钻进官方编辑器，缺少外置试玩闭环

## 怎么解决

- 与节点编辑器包、知识库一样：setup 拉工具，本仓只留技能、文档与 MCP 示例
- `beyond-workspace/`、可选源码克隆路径写入 `.gitignore`
- AGENTS 第 6 条串读 lua + beyond；第 7 条单独触发模拟器话题

## 协作者下次可以直接用的结论

- 写 Lua / 客户端 UI → 读 `miliastra-lua` 判归属，读 `miliastra-beyond` 用 Web/MCP 开发
- `.\scripts\setup.ps1` 后按 `tools/beyond-simulator/mcp.json.example` 配 MCP
- 模拟器通过后仍要导出并真机验证；服务端权威逻辑仍走节点图技能链
