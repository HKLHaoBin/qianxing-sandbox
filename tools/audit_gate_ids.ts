import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { Graph } from "./Miliastra-Node-Editor-Pack/utils/gia_gen/interface.ts";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { NODES as ZH } from "./Miliastra-Node-Editor-Pack/utils/node_data/game_nodes.zh-Hans.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const proto = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");
const giaPath = join(root, "门限夺宝", "关门计时与锁分.gia");
const outDir = join(root, "文档", "限时夺宝-时间门");

const idToZh: Record<string, string> = {};
for (const [zh, id] of Object.entries(ZH as Record<string, unknown>)) {
  if (typeof id === "string" && id.includes(".")) idToZh[id] = zh;
}

const bundle: any = decode_gia_file(giaPath, proto, true);
const r = bundle.primary_resource;
const rawNodes = r.graph_data?.inner?.graph?.nodes || [];

const catalog = rawNodes.map((n: any) => {
  const tid = n.authority?.authority_info?.node_id
    || n.node_id
    || n.tid
    || n.type?.identifier
    || "";
  return {
    index: n.index,
    tid: typeof tid === "string" ? tid : JSON.stringify(tid),
    zh: typeof tid === "string" ? idToZh[tid] || "" : "",
    sampleKeys: Object.keys(n).slice(0, 20),
  };
});
writeFileSync(join(outDir, "_gate_id_catalog.json"), JSON.stringify({ catalog, firstNodeKeys: rawNodes[0] ? Object.keys(rawNodes[0]) : [], firstNode: rawNodes[0] }, null, 2), "utf8");

const g = Graph.decode({ ...bundle, primary_resource: r, dependencies: [] });
let dump = "";
g.debugPrint({ log: (...m: string[]) => { dump += m.join(" ") + "\n"; } });
writeFileSync(join(outDir, "_gate_after_edit.log"), dump, "utf8");
console.log("nodes", rawNodes.length);
console.log("catalog sample", JSON.stringify(catalog.slice(0, 5), null, 2));
