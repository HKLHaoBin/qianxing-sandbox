import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { Graph } from "./Miliastra-Node-Editor-Pack/utils/gia_gen/interface.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const docs = join(root, "文档", "限时夺宝-时间门");
const giaPath = process.argv[2] ?? join(root, "门限夺宝.gia");
const proto = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");

const bundle: any = decode_gia_file(giaPath, proto, true);
writeFileSync(join(docs, "门限夺宝.decoded.json"), JSON.stringify(bundle, null, 2), "utf8");

const hits: string[] = [];
const keywords = [
  "开小宝箱",
  "开中宝箱",
  "开大宝箱",
  "门内进出",
  "拾取钥匙",
  "尝试刷新",
  "关门计时",
  "锁分",
  "钥匙星",
  "刷新点",
  "时间门",
  "小宝箱",
  "中宝箱",
  "大宝箱",
  "是否已占用",
  "是否在门内",
  "本局得分",
  "钥匙数量",
  "价值档",
  "关门总秒数",
  "对局阶段",
];

function walk(obj: any, path: string, depth = 0) {
  if (obj == null || depth > 12) return;
  if (typeof obj === "string") {
    for (const k of keywords) {
      if (obj.includes(k)) hits.push(`${path} = ${obj.slice(0, 120)}`);
    }
    return;
  }
  if (typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => walk(v, `${path}[${i}]`, depth + 1));
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k === "nodes" && Array.isArray(v) && v.length) {
      hits.push(`${path}.nodes length=${v.length}`);
    }
    if (k === "display_name" || k === "internal_name") {
      walk(v, `${path}.${k}`, depth + 1);
    } else {
      walk(v, `${path}.${k}`, depth + 1);
    }
  }
}

walk(bundle, "root");
const uniq = [...new Set(hits)];
writeFileSync(join(docs, "门限夺宝.keyword-hits.txt"), uniq.join("\n"), "utf8");
console.log("hits", uniq.length);
console.log(uniq.slice(0, 80).join("\n"));

// Also list every resource with class and name
const rows: string[] = [];
const all = [bundle.primary_resource, ...(bundle.dependencies || [])];
for (let i = 0; i < all.length; i++) {
  const r = all[i];
  const name = r?.internal_name || "";
  const g = r?.graph_data?.inner?.graph;
  const n = g?.nodes?.length ?? 0;
  const disp = g?.display_name || "";
  rows.push(`[${i}] class=${r?.resource_class} guid=${r?.identity?.asset_guid} name=${name} graph=${disp} nodes=${n} refs=${(r?.reference_list||[]).length}`);
  if (n > 0) {
    try {
      const fake = { ...bundle, primary_resource: r, dependencies: [] };
      const graph = Graph.decode(fake as any);
      let chunk = "";
      graph.debugPrint({ log: (...m: string[]) => (chunk += m.join(" ") + "\n") });
      writeFileSync(join(docs, `门限夺宝.graph-${i}.log`), chunk, "utf8");
      rows.push(`  dumped graph-${i}.log`);
    } catch (e) {
      rows.push(`  decode fail: ${(e as Error).message}`);
    }
  }
}
writeFileSync(join(docs, "门限夺宝.resources.txt"), rows.join("\n"), "utf8");
console.log(rows.join("\n"));
