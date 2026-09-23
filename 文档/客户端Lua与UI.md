# 客户端 Lua 与 UI（7.1）

《原神》千星奇域从 **7.1** 起支持用 **客户端脚本（Lua）** 驱动 **客户端控件**，用来做自定义 UI、动画，以及大多数 **2D 玩法**界面。

协作者的 AI 应优先读技能：`.cursor/skills/miliastra-lua/SKILL.md`。本文是人读总览。

## 和节点图怎么分工

| 你在做的事 | 用什么 |
|------------|--------|
| 手牌扇形、叠层露出一角、HUD、2D 点选反馈 | **Lua + 客户端控件**（优先） |
| 发牌/出牌规则、胜负、碰撞、造物、元件实体逻辑 | **服务端节点图** |

一句话：**屏幕上看见的优先 Lua；服务器说了算的走节点图。**

## 最小操作链

1. 界面布局里放 **客户端控件容器**
2. 做 **客户端控件模板**（例如一张牌）
3. 用 **引用控件** 引用模板，或由脚本按模板索引动态创建
4. 在千星沙箱打开 **客户端脚本资源管理器**，写 Lua 并挂到控件上
5. 在编辑器 API 文档中搜索：`ReferenceControl`、`ControlPrefabIndex`、`controlId`

官方指南（英文已公开，国服可用同一文档 id）：

- [客户端控件与脚本](https://act.hoyoverse.com/ys/ugc/tutorial/detail/mhbgxf0nynww)
- [引用控件](https://act.hoyoverse.com/ys/ugc/tutorial/detail/mhucb6reudwm)
- [客户端控件容器](https://act.hoyoverse.com/ys/ugc/tutorial/detail/mhlz2lrly3dq)

## 范例：扇形扑克手牌

适合 Lua：按手牌数排布角度与 Layer，叠牌但露出可辨认的一角。

不适合硬套：GridScroller（那是滚动列表）、或仅用 3D 物件节点图摆一圈牌。

权威手牌数据与出牌校验仍放服务端节点图；Lua 负责本机展开与点选表现。

## 仓库内相关文件

- 技能：`.cursor/skills/miliastra-lua/`
- 何时用 Lua：`.cursor/skills/miliastra-lua/references/when-to-use-lua.md`
- 落地步骤：`.cursor/skills/miliastra-lua/references/workflow.md`
- 触发入口：`AGENTS.md` 第 6 条
