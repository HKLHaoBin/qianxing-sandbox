# 模拟器开发闭环

工具名与参数契约对齐上游 MCP / Harness；实现细节以已安装包为准。

## 推荐循环

```text
open/load 存档 → get 读树 → patch 改 UI/Lua → play start
  → 输入 / runCase → screenshot + get(日志) → 修复 → save
  →（可选）导出 GIA → 真机验证
```

不要跳过保存；关闭服务前显式 `qxqy_project_save` 或 Web「保存存档」。

## MCP 工具速查

| 工具 | 作用 |
|------|------|
| `qxqy_project_open` | 打开工作区内存档，返回 `handle` |
| `qxqy_project_save` | 显式写盘 |
| `qxqy_studio_get` | 读 Authoring / 工程快照 |
| `qxqy_studio_patch` | 改控件、脚本、服务端薄逻辑等（带 `expectedRevision`） |
| `qxqy_studio_play` | 试玩：start/stop/pointer/get/history/saveCase/runCase/server* … |
| `qxqy_studio_ui_screenshot` | 编辑器舞台静态布局 PNG |
| `qxqy_studio_play_screenshot` | 试玩 Runtime 帧 PNG（先 `start`；不步进时间） |
| `qxqy_studio_load` | 从工作区拉取已有 `qxqy-simulator-save` |

后续调用一律带上 `handle`。`revision conflict` → 重新 `get`，按新 revision 重算 patch，不要盲重试。

## 试玩最小序列

```text
qxqy_studio_play { "handle", "action": "start", "args": {} }
qxqy_studio_play { "handle", "action": "pointer", "args": { "type": "click", "x", "y" } }
qxqy_studio_play { "handle", "action": "get" }
qxqy_studio_play_screenshot { "handle" }
qxqy_studio_play { "handle", "action": "stop", "args": {} }
```

- 查布局/选中：用 `qxqy_studio_ui_screenshot`
- 查 Lua 实际画面/动画：用 `qxqy_studio_play_screenshot`
- 需要完整运行树：`get` 且 `args.inspect: true`（按需，勿每帧拉取）

多设备示例：`start` / `device` 的 `args.canvasId` 如 `mobile-16-9`、`pc-21-9`。切设备会重建运行时，用例不要跨设备连写。

多人：`playerCount`（1–8）、`view` 的 `playerIndex`。

## 自动测试

试玩时间线可 `saveCase` / `runCase`。断言 kind 常见：`log`、`control`、`var`、`signal`、`tree`、`lua`（查询 API）。失败时先读报告再 `stop`。

服务端薄模拟（变量/信号，非完整节点图）：

```text
serverSet / serverGet / serverSend
```

实体类型可用 `Level` / `PlayerSelf` / `AvatarSelf` 或座位 `Player1`–`Player8`。更复杂规则可在 Web「服务端逻辑」页或 `patch` 的 `setServerLogic` 配置——这是**模拟器存档格式**，不是官方节点图导出。

## 写码时查哪里

模拟器负责跑与看；**签名、编号防混淆、生命周期、模板选型** 回 `miliastra-lua` → [authoring-pack.md](../../miliastra-lua/references/authoring-pack.md)（需求档案 v3.1）。常见：`templates/README.md` 选一个练习；网格/按钮先读档案 `docs/11`、`docs/08`、`docs/10`。

## 对用户说话时

- 直接驱动 MCP 完成可自动的步骤；需要点顶栏「导入/导出/试玩 ↗」时，给短指令
- 玩法规则断言要写清预期（例如「每次点击 +1 分」）
- 模拟器通过后，提醒导出并真机验证；报告里写「模拟器观察」，不写「真机通过」
