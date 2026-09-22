/**
 * Try GIA → Graph → IR → DSL (Wu-Yijun toolchain).
 * Not TypeScript; DSL-like code for readable audit when graph_data exists.
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { Graph } from "./Miliastra-Node-Editor-Pack/utils/gia_gen/interface.ts";
import { giaIrConvertor } from "./Miliastra-Node-Editor-Pack/src/convertor/gia_ir.ts";
import { decompile_module } from "./Miliastra-Node-Editor-Pack/src/parser/decompiler.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const giaPath = process.argv[2] ?? join(root, "门限夺宝.gia");
const outDir = join(root, "文档", "限时夺宝-时间门");
const proto = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");

const bundle: any = decode_gia_file(giaPath, proto, true);
const all = [bundle.primary_resource, ...(bundle.dependencies || [])];
let report = `# GIA → DSL 尝试\n\nsource: ${giaPath}\n\n`;
let ok = 0;

for (let i = 0; i < all.length; i++) {
  const r = all[i];
  const n = r?.graph_data?.inner?.graph?.nodes?.length ?? 0;
  if (n < 2) continue;
  const name = r.internal_name || r.graph_data?.inner?.graph?.display_name || `dep${i}`;
  report += `## [${i}] ${name} nodes=${n}\n\n`;
  try {
    const graph = Graph.decode({ ...bundle, primary_resource: r, dependencies: [] } as any);
    const ir = giaIrConvertor(graph as any, true);
    const code = decompile_module(ir as any);
    writeFileSync(join(outDir, `门限夺宝.dsl-${i}-${name}.txt`), String(code), "utf8");
    report += "```\n" + String(code).slice(0, 2000) + "\n```\n\n";
    ok++;
    console.log("OK", i, name, "codeLen", String(code).length);
  } catch (e) {
    report += `FAIL: ${(e as Error).message}\n\n`;
    console.error("FAIL", i, name, (e as Error).message);
  }
}

report += `\n成功反编译图数: ${ok}\n`;
if (ok === 0) {
  report +=
    "\n本包没有可解码的多节点 graph_data，无法走 GIA→IR→DSL。需导出含节点图正文的元件/关卡图包。\n";
}
writeFileSync(join(outDir, "门限夺宝.dsl-report.md"), report, "utf8");
console.log(report.slice(0, 500));
