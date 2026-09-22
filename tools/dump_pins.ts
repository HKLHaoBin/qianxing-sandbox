import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodes = JSON.parse(
  await import("fs").then((fs) =>
    fs.promises.readFile(
      join(__dirname, "Miliastra-Node-Editor-Pack/utils/node_data/UGC-Guide-Markdown/nodes.zh.json"),
      "utf8",
    ),
  ),
);
const want = new Set(["多分支", "创建元件", "获取实体位置与旋转", "获取随机整数", "是否小于等于", "是否相等"]);
const out: any = {};
for (const n of nodes as any[]) {
  if (want.has(n.name)) out[n.name] = n.parameters;
}
writeFileSync(join(__dirname, "../文档/限时夺宝-时间门/_node_pins.json"), JSON.stringify(out, null, 2), "utf8");
console.log(Object.keys(out));
