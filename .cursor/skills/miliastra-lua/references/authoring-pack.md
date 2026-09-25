# 客户端脚本需求档案（本仓库）

可复用创作包目录（当前 **v3.1**）：

`千星奇域Lua开发环境-客户端脚本需求档案-v3.1/`

独立可读、可单独复制；在本仓库内时：**归属判定仍归本技能，日常编写/试玩仍优先 `miliastra-beyond`，写码细则以本档案为准。**

## 何时打开

写或修客户端 Lua、查 API 签名、选教学模板、核对按钮/网格/动效边界时，**先读包内 [AGENT.md](../../../千星奇域Lua开发环境-客户端脚本需求档案-v3.1/AGENT.md)**，再按任务只加载下列分册——不要默认通读整包，也不要默认加载 `guides/`（人类图册）。

## 按任务入口

| 需要解决的事 | 先读（相对档案根） |
|---|---|
| 总流程与回复格式 | `AGENT.md` |
| 第一次挂载 / 容器 | `docs/00_开始之前.md`、`prompts/20_开工交接.md` |
| API 签名与防混淆 | `docs/01_API阅读与防混淆.md` → `docs/本地API索引.md` → `docs/客户端控件API文档.md` |
| 官方概念（指南快照） | `docs/千星沙箱客户端脚本使用指南.md` |
| 官方「详见」纯文本摘要 | `docs/15_官方详见页面与图片文字记录.md` |
| 控件名、CONFIG、组合式按钮 | `docs/08_控件名称与CONFIG配置.md` |
| 预设按钮四态 / 空外观 | `docs/10_预设按钮四态与样式.md` |
| 网格列表 vs Instantiate | `docs/11_网格列表项与InstantiateClientUI区别.md`、`docs/16_网格背包动态列表与拖拽配方.md` |
| Tween / 卡牌演出 | `prompts/34_动效.md`、`docs/03_卡牌Tween演出配方.md` |
| 输入与坐标 | `prompts/38_输入.md`、`prompts/60_坐标.md` |
| 信号 | `prompts/40_信号.md` |
| 生命周期 / 任务 / 逐帧 | `prompts/30_生命周期.md`、`prompts/36_任务.md`、`prompts/32_逐帧与调试.md` |
| 调试 typeof / 控件树 | `docs/13_调试_typeof与控件树.md` |
| 界面动效播放 | `docs/12_界面动效与全屏界面动效.md` |
| 选模板 | `templates/README.md`（01–08 完整接入；09–16 单能力） |
| 交付前检查 | `prompts/90_交付前反查.md`、`docs/07_自我约束与证据回报.md` |
| 来源与版本哈希 | `REFERENCES.md` |

精简硬规则摘要见同目录 [lua-coding-rules.md](lua-coding-rules.md)。冲突时：**API 正文 > 模板/视频笔记 > 经验口诀**；与编辑器内文档冲突时以编辑器为准，并写入 `memory/lessons/`。

## 与本仓库其它技能

| 事项 | 谁管 |
|------|------|
| 要不要用 Lua、和节点图怎么切 | `miliastra-lua`（本技能） |
| Beyond 里写/试/导出 | `miliastra-beyond` |
| 具体 API、模板、交付反查 | **本档案** |
| 服务端节点图五要素 | `miliastra-node-edit` |

`guides/` 仅在用户明确要求看画面或核对官方截图时再读。
