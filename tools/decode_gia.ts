import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { Graph } from "./Miliastra-Node-Editor-Pack/utils/gia_gen/interface.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const giaPath = process.argv[2] ?? join(__dirname, "..", "元件.gia");
const outJson = process.argv[3] ?? join(__dirname, "..", "文档", "元件.decoded.json");
const outLog = process.argv[4] ?? join(__dirname, "..", "文档", "元件.nodes.log");
const protoPath = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");

const bundle = decode_gia_file(giaPath, protoPath, true);
writeFileSync(outJson, JSON.stringify(bundle, null, 2), "utf8");

let log = "";
const logger = (...msg: string[]) => {
  log += msg.join(" ") + "\n";
};

try {
  const graph = Graph.decode(bundle);
  graph.debugPrint({ log: logger });
  writeFileSync(outLog, log, "utf8");
  console.log("=== Graph.debugPrint ===");
  console.log(log);
} catch (e) {
  const err = e as Error;
  console.error("Graph.decode failed:", err.message);
  writeFileSync(outLog, `Graph.decode failed: ${err.stack ?? err}\n`, "utf8");
  const pr = (bundle as any).primary_resource;
  if (pr) {
    console.log("resource_class:", pr.resource_class);
    console.log("internal_name:", pr.internal_name);
    console.log("display_name:", pr.display_name);
  }
}

console.log("Wrote", outJson);
console.log("Wrote", outLog);
