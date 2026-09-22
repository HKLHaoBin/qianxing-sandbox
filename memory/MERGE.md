# 合并记忆

两边的经验都要留下。Git 负责合并，AI 负责不要在冲突里删掉任何一方的教训。

## 文件怎么分工

- `memory/lessons/YYYY-MM-DD-<主题>.md`：一次工作一篇，写完不再改。另一边有新经验时新建文件，不要改别人的文件。
- `memory-graph.md`：索引。Lessons 里追加一行指向 lesson，不搬全文。
- `memory/local/`：只留本机，不提交。私人玩法的关卡细节放这里。

`.gitattributes` 给 `memory-graph.md` 和 `memory/lessons/*.md` 使用 union 合并：同一行两边都改过时，两行都保留。

## 冲突时

1. lesson 文件互不覆盖。同名文件撞车时，把后出现的内容另存为 `原名-2.md`，两篇都留。
2. `memory-graph.md` 的 Lessons、Facts、Decisions：双方的条目都留。重复的同一句话留一句。
3. 合并完用眼睛看一遍索引，确认没有丢掉某一边的原件名或问题结论。
4. 提交这次合并，再 push。不要 force push。

项目文档（`projects/`）冲突时同样两边事实都留：同一张节点图的步骤冲突，两段都保留并标上各自来源，请当前用户判定哪段已导出核实。判定前不要删段。
