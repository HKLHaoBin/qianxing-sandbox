# 千星沙箱协作习惯

这是一套给《原神》千星沙箱用的协作方式。克隆之后用 Cursor 打开，直接告诉 AI 你想做什么样的游戏。AI 会先列出全部原件和每张节点图，再逐个写伪代码，并写成可以分工的文档。

查某个元件怎么做时，对 AI 说：

```text
我需要元件「刷新点」的节点图信息。
```

把元件名换成分工表里的名字。AI 会先读整局，再给你这张图的步骤。文档里没有的节点 ID，它会标明未记录，而不是猜。

## 克隆之后

```powershell
git clone https://github.com/HKLHaoBin/qianxing-sandbox.git
cd qianxing-sandbox
.\scripts\setup.ps1
```

`setup.ps1` 会再克隆两份公开仓库（节点编辑器包、千星知识库），并安装 **千星沙箱模拟器** npm 包（`beyond-simulator-web` / `beyond-simulator-mcp`），创建本机工作区 `beyond-workspace/`。第三方仓库有自己的历史，不打包进本仓库。知识库和编辑器包克隆完成后，这个目录就可以开始用；写 Lua 前把 MCP 配好（见 `tools/beyond-simulator/mcp.json.example`）。

然后用 Cursor 打开这个目录。规则在 `AGENTS.md`，具体步骤在 `.cursor/skills/`。

## 仓库里有什么

- `.cursor/skills/`：开新局、按整局回答元件问题、做完后同步 Git 和记忆、节点图五要素、知识库查询、**客户端 Lua / UI（7.1）**、**千星沙箱模拟器（Beyond）**
- `文档/客户端Lua与UI.md`：7.1 起 Lua 与节点图怎么分工（人读）；细则在 `.cursor/skills/miliastra-lua/`
- `文档/千星沙箱模拟器.md`：Lua 优先用模拟器开发；配置与技能在 `.cursor/skills/miliastra-beyond/`、`tools/beyond-simulator/`
- `memory/`：可合并的经验。合并方式见 `memory/MERGE.md`
- `projects/_template/`：一个玩法的文档版式
- 根目录两份可复用资产：
  - `常用复合节点大全v1.7(补充包同步更新中).gia`
  - `数据结构：队列-二维数组-栈.gia`
- `tools/`：解析和对照 GIA 的脚本；`tools/beyond-simulator/` 为模拟器 MCP 配置示例

## 不会出现在 GitHub 上的

`门限夺宝`、`门线夺宝` 的资产和设计导出留在作者本机，不在这个仓库里。`beyond-workspace/`（模拟器存档）同样只留本机。

## 一起做一局

1. 一个人向 AI 描述玩法。AI 写好 `projects/<玩法>/` 里的原件清单、每张节点图文档和分工。
2. 分工时告诉对方负责哪个元件。对方对自己的 AI 说「我需要元件「…」的节点图信息」。
3. 对方做完节点图，把资产文件交给他的 AI。AI 先列出文件，等人确认无误，然后拉取、合并、推送；接着把这次的问题和解法写进 `memory/lessons/`，再推一次。
4. 其他人拉取之后就能用到这次的经验和更新后的文档。

记忆冲突时两边都留，规则在 `memory/MERGE.md`。

## 加协作者

仓库管理员执行：

```powershell
gh repo add-collaborator HKLHaoBin/qianxing-sandbox <GitHub用户名>
```
