import { writeFileSync } from "fs";
import { createRequire } from "module";
import { pathToFileURL } from "url";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pack = join(__dirname, "Miliastra-Node-Editor-Pack");

// Use tsx to load TypeScript modules via dynamic import after registering
const giaPath = process.argv[2] || join(__dirname, "..", "元件.gia");
const outJson = process.argv[3] || join(__dirname, "..", "文档", "元件.decoded.json");
const outLog = process.argv[4] || join(__dirname, "..", "文档", "元件.nodes.log");

const { decode_gia_file } = await import(
  pathToFileURL(join(pack, "utils/protobuf/decode.ts")).href
);
const { Graph } = await import(
  pathToFileURL(join(pack, "utils/gia_gen/interface.ts")).href
);

const bundle = decode_gia_file(giaPath, join(pack, "utils/protobuf/gia.proto"), true);
writeFileSync(outJson, JSON.stringify(bundle, null, 2), "utf8");

let log = "";
const logger = (...msg) => {
  log += msg.join(" ") + "\n";
};

try {
  const graph = Graph.decode(bundle);
  graph.debugPrint({ log: logger });
  writeFileSync(outLog, log, "utf8");
  console.log("Graph.debugPrint OK");
  console.log(log);
} catch (e) {
  console.error("Graph.decode failed:", e?.message || e);
  console.log("Raw AssetBundle keys:", Object.keys(bundle));
  const pr = bundle.primary_resource;
  if (pr) {
    console.log("primary_resource.resource_class:", pr.resource_class);
    console.log("primary_resource.internal_name:", pr.internal_name);
    console.log("display_name:", pr.display_name);
  }
  writeFileSync(outLog, `Graph.decode failed: ${e?.stack || e}\n`, "utf8");
}

console.log("Wrote", outJson);
console.log("Wrote", outLog);
