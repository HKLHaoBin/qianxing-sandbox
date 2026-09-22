import { writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Graph } from "./Miliastra-Node-Editor-Pack/utils/gia_gen/interface.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const decoded = JSON.parse(
  readFileSync(join(__dirname, "..", "文档", "元件.decoded.json"), "utf8"),
);

let all = "";
for (let i = 0; i < (decoded.dependencies?.length ?? 0); i++) {
  const dep = decoded.dependencies[i];
  const fakeBundle = {
    ...decoded,
    primary_resource: dep,
    dependencies: [],
  };
  all += `\n======== Dependency[${i}] ${dep.internal_name} class=${dep.resource_class} ========\n`;
  try {
    const graph = Graph.decode(fakeBundle as any);
    let chunk = "";
    graph.debugPrint({
      log: (...msg: string[]) => {
        chunk += msg.join(" ") + "\n";
      },
    });
    all += chunk;
    console.log(chunk);
  } catch (e) {
    const err = e as Error;
    all += `Graph.decode failed: ${err.message}\n`;
    console.error(i, err.message);
  }
}

writeFileSync(join(__dirname, "..", "文档", "元件.graph.debug.log"), all, "utf8");
console.log("Wrote 文档/元件.graph.debug.log");
