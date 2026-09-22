import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const proto = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");
const docs = join(__dirname, "..", "文档", "限时夺宝-时间门");
const root = join(__dirname, "..");

function summarize(path: string, outName: string) {
  const b: any = decode_gia_file(path, proto, true);
  const collect: any[] = [];
  const push = (d: any, where: string) => {
    collect.push({
      where,
      name: d.internal_name,
      class: d.resource_class,
      nodes: d.graph_data?.inner?.graph?.nodes?.length ?? 0,
      display: d.graph_data?.inner?.graph?.display_name,
      blackboard: (d.graph_data?.inner?.graph?.blackboard || []).map((x: any) => x.name || x),
    });
  };
  if (b.primary_resource) push(b.primary_resource, "primary");
  for (const d of b.dependencies || []) push(d, "dep");

  const slim = {
    file: path,
    engine: b.engine_version,
    export_tag: b.export_tag,
    entries: collect,
  };
  writeFileSync(join(docs, outName), JSON.stringify(slim, null, 2), "utf8");
  console.log("\n====", outName, "entries", collect.length);
  for (const e of collect) {
    console.log(`- [${e.where}] ${e.name} class=${e.class} nodes=${e.nodes}`);
  }
}

summarize(
  join(root, "常用复合节点大全v1.7(补充包同步更新中).gia"),
  "asset-复合节点摘要.json",
);
summarize(join(root, "数据结构：队列-二维数组-栈.gia"), "asset-数据结构摘要.json");
