import { writeFileSync, readdirSync } from "fs";
import { dirname, join, basename } from "path";
import { fileURLToPath } from "url";
import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { Graph } from "./Miliastra-Node-Editor-Pack/utils/gia_gen/interface.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dir = process.argv[2] ?? join(root, "门限夺宝");
const outDir = join(root, "文档", "限时夺宝-时间门");
const proto = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");

const files = readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".gia"));
let allLog = `# 门限夺宝文件夹批量审计\n\ndir: ${dir}\nfiles: ${files.length}\n\n`;

for (const f of files) {
  const path = join(dir, f);
  allLog += `\n${"=".repeat(60)}\n# FILE: ${f}\n${"=".repeat(60)}\n`;
  try {
    const bundle: any = decode_gia_file(path, proto, true);
    const all = [bundle.primary_resource, ...(bundle.dependencies || [])].filter(Boolean);
    allLog += `engine=${bundle.engine_version} deps=${(bundle.dependencies || []).length}\n`;
    for (let i = 0; i < all.length; i++) {
      const r = all[i];
      const name = r.internal_name || r.graph_data?.inner?.graph?.display_name || `res${i}`;
      const n = r.graph_data?.inner?.graph?.nodes?.length ?? 0;
      allLog += `\n## [${i}] ${name} class=${r.resource_class} nodes=${n} guid=${r.identity?.asset_guid}\n`;
      if (n < 1) continue;
      try {
        const graph = Graph.decode({ ...bundle, primary_resource: r, dependencies: [] } as any);
        let chunk = "";
        graph.debugPrint({
          log: (...msg: string[]) => {
            chunk += msg.join(" ") + "\n";
          },
        });
        allLog += chunk;
      } catch (e) {
        allLog += `Graph.decode fail: ${(e as Error).message}\n`;
      }
    }
  } catch (e) {
    allLog += `decode_gia fail: ${(e as Error).stack ?? e}\n`;
  }
}

const out = join(outDir, "门限夺宝-文件夹审计.log");
writeFileSync(out, allLog, "utf8");
console.log("Wrote", out, "bytes", allLog.length);
console.log("files:", files.join(" | "));
