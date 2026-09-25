# 客户端 Lua 落地流程

**日常编写与自测优先走模拟器**（`.cursor/skills/miliastra-beyond/`），本节描述官方编辑器概念与真机链路，供导出后核对。

依据 7.1 官方综合指南（英文页已公开）与奇匠指南口径整理。中文知识库镜像可能滞后。

**本仓库写码优先读** [authoring-pack.md](authoring-pack.md) 指向的需求档案（含 API 离线快照与模板）；与编辑器内文档冲突时以编辑器为准。

## 官方文档入口

| 主题 | 链接 |
|------|------|
| 客户端控件 / 客户端脚本总览 | https://act.hoyoverse.com/ys/ugc/tutorial/detail/mhbgxf0nynww |
| 引用控件（Reference Control） | https://act.hoyoverse.com/ys/ugc/tutorial/detail/mhucb6reudwm |
| 客户端控件容器 | https://act.hoyoverse.com/ys/ugc/tutorial/detail/mhlz2lrly3dq |
| GridScroller（列表，非扇形） | https://act.hoyoverse.com/ys/ugc/tutorial/detail/mhfkrr0i7gds |
| 界面控件 Transform（位置/旋转/Layer） | https://act.hoyoverse.com/ys/ugc/tutorial/detail/mhnapxrumtzy |

国服同路径可试：`https://act.mihoyo.com/ys/ugc/tutorial/detail/<同一 id>`。

API 检索：先查档案 `docs/本地API索引.md` → `docs/客户端控件API文档.md`；必要时再在编辑器 Local UI Control API 中搜索（勿凭记忆编签名）：

- `ReferenceControl`
- `ControlPrefabIndex`
- `controlId`
- `GridScrollerControl`
- `ClientUIBaseControl`
- `ClientUIPresetButtonControl`

## 最短搭建顺序

1. **界面控件组管理** → 界面布局中添加 **客户端控件容器**。没有容器，客户端控件与脚本不显示、不运行。
2. 进入容器画布，添加客户端控件；或先在 **客户端控件模板** 库中做好模板再引用。
3. 需要复用牌面时：保存为客户端控件模板 → 用 **引用控件** 引用该模板（可预览）。
4. **千星沙箱 → 客户端脚本资源管理器** → 新建客户端脚本（会建本地脚本与 Script Mapping）→ 在控件 Script 页签 **挂载脚本**。
5. 脚本侧只用 **客户端控件** 的模板索引创建或改控件；容器画布上的非客户端控件、以及服务端控件的模板索引，脚本访问不到。
6. 运行时控件会有 `controlId`；模板侧用 `ControlPrefabIndex`。细节以 API 文档为准。

## 扇形手牌（推荐结构）

1. 做一张「单牌」客户端控件模板（牌面图、可选按钮热区）。
2. 手牌区父节点挂脚本：读取本机手牌数据（来自服务端同步的变量/信号，项目自定）。
3. 按张数创建引用控件实例；对第 `i` 张设置位置、Z 旋转、旋转中心、Layer。
4. 间距与角度保证叠牌后仍露出用于辨认的一角（通常左上或右上，按美术定）。
5. 点选：本机高亮/抬起用脚本；真正出牌发到服务端节点图校验。

## 与节点图的交接

- 客户端脚本 **不替代** 实体节点图五要素流程（`miliastra-node-edit`）。
- 指导用户改 **服务端** 节点图时，仍输出元件 / 节点卡 / 搜索 ID / 字段 / 参数。
- 指导用户改 Lua 时，写清：脚本挂在哪个控件、用哪个模板索引、表现目标；并按档案证据分层区分静态/模拟/真机。API 未核实的不写死函数名。

## 版本备忘

- 能力随 **原神 7.1**（约 2026-09-23）千星沙箱更新进入。
- 前瞻/奇匠指南表述：新增可与客户端脚本配合的客户端控件；引用控件对应模板引用。
- 官方曾强调节点图用于沙盒安全与同步；Lua 当前公开范围是 **客户端 UI 脚本**，不是全关卡通用服务端脚本。
