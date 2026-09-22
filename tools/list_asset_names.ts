import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const proto = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");
const docs = join(__dirname, "..", "文档", "限时夺宝-时间门");

function listNames(giaPath: string, outFile: string) {
  const b: any = decode_gia_file(giaPath, proto, true);
  const lines: string[] = [];
  lines.push(`# ${giaPath}`);
  lines.push(`primary: ${b.primary_resource?.internal_name}`);
  lines.push(`engine: ${b.engine_version}`);
  lines.push("");
  let i = 0;
  for (const d of b.dependencies || []) {
    i++;
    const g = d.graph_data?.inner?.graph;
    const name = (d.internal_name && String(d.internal_name).trim()) || g?.display_name || `(dep#${i})`;
    const n = g?.nodes?.length ?? 0;
    lines.push(`${i}. ${name}  (nodes=${n}, class=${d.resource_class}, guid=${d.identity?.asset_guid})`);
  }
  writeFileSync(join(docs, outFile), lines.join("\n"), "utf8");
  console.log(outFile, "lines", lines.length);
}

listNames(
  join(__dirname, "..", "常用复合节点大全v1.7(补充包同步更新中).gia"),
  "asset-复合节点名单.txt",
);
listNames(join(__dirname, "..", "数据结构：队列-二维数组-栈.gia"), "asset-数据结构名单.txt");
