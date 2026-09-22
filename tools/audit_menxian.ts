import { writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { Graph } from "./Miliastra-Node-Editor-Pack/utils/gia_gen/interface.ts";
import { NODES } from "./Miliastra-Node-Editor-Pack/utils/node_data/game_nodes.ts";
import { NODES as NODES_ZH } from "./Miliastra-Node-Editor-Pack/utils/node_data/game_nodes.zh-Hans.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const docs = join(root, "文档", "限时夺宝-时间门");
const giaPath = process.argv[2] ?? join(root, "门限夺宝.gia");
const protoPath = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");

const idToZh: Record<string, string> = {};
for (const [zh, id] of Object.entries(NODES_ZH as Record<string, string>)) {
  if (typeof id === "string" && id.includes(".")) idToZh[id] = zh;
}
for (const [k, v] of Object.entries(NODES as Record<string, string>)) {
  if (typeof v === "string" && v.includes(".") && !idToZh[v]) idToZh[v] = k;
}

const bundle: any = decode_gia_file(giaPath, protoPath, true);
writeFileSync(join(docs, "门限夺宝.decoded.json"), JSON.stringify(bundle, null, 2), "utf8");

function resName(r: any): string {
  return (
    (r?.internal_name && String(r.internal_name).trim()) ||
    r?.graph_data?.inner?.graph?.display_name ||
    r?.prefab_data?.inner?.display_name ||
    `(guid ${r?.identity?.asset_guid})`
  );
}

function collectResources(b: any): any[] {
  const list = [b.primary_resource, ...(b.dependencies || [])].filter(Boolean);
  return list;
}

let overview = "";
overview += `# 门限夺宝.gia 资源总览\n\n`;
overview += `- engine: ${bundle.engine_version}\n`;
overview += `- export_tag: ${bundle.export_tag}\n`;
overview += `- primary: ${resName(bundle.primary_resource)} class=${bundle.primary_resource?.resource_class}\n`;
overview += `- dependencies: ${(bundle.dependencies || []).length}\n\n`;

const resources = collectResources(bundle);
for (let i = 0; i < resources.length; i++) {
  const r = resources[i];
  overview += `## [${i}] ${resName(r)}  class=${r.resource_class}  guid=${r.identity?.asset_guid}\n`;
  const g = r.graph_data?.inner?.graph;
  if (g) {
    overview += `- graph display: ${g.display_name || "(empty)"}\n`;
    overview += `- nodes: ${g.nodes?.length ?? 0}\n`;
  }
  const prefab = r.prefab_data?.inner;
  if (prefab) {
    overview += `- prefab display: ${prefab.display_name || prefab.name || "(empty)"}\n`;
  }
  // custom vars on blackboard / components
  const bb = g?.blackboard || r.graph_data?.inner?.blackboard;
  if (bb) overview += `- blackboard keys: ${JSON.stringify(Object.keys(bb)).slice(0, 200)}\n`;
  const refs = r.reference_list || [];
  if (refs.length) {
    overview += `- refs (${refs.length}):\n`;
    for (const ref of refs) {
      overview += `  - ${JSON.stringify(ref)}\n`;
    }
  }
  overview += `\n`;
}
writeFileSync(join(docs, "门限夺宝.overview.md"), overview, "utf8");

let allLog = overview + "\n---\n# Graph debug dumps\n";
const graphSummaries: any[] = [];

for (let i = 0; i < resources.length; i++) {
  const r = resources[i];
  const hasGraph = r.graph_data?.inner?.graph?.nodes?.length;
  if (!hasGraph) continue;
  const fake = { ...bundle, primary_resource: r, dependencies: [] };
  allLog += `\n======== [${i}] ${resName(r)} class=${r.resource_class} ========\n`;
  try {
    const graph = Graph.decode(fake as any);
    let chunk = "";
    graph.debugPrint({
      log: (...msg: string[]) => {
        chunk += msg.join(" ") + "\n";
      },
    });
    allLog += chunk;

    // structured extract
    const nodes = r.graph_data.inner.graph.nodes || [];
    const extracted: any = {
      index: i,
      name: resName(r),
      display: r.graph_data.inner.graph.display_name,
      class: r.resource_class,
      guid: r.identity?.asset_guid,
      nodeCount: nodes.length,
      nodes: nodes.map((n: any) => {
        const tid = n.tid || n.type_id || n.node_type || "";
        return {
          id: n.id ?? n.node_id,
          tid,
          zh: idToZh[tid] || tid,
          title: n.title || n.display_name || "",
        };
      }),
    };
    graphSummaries.push(extracted);
  } catch (e) {
    const err = e as Error;
    allLog += `Graph.decode failed: ${err.message}\n`;
  }
}

writeFileSync(join(docs, "门限夺宝.graph.debug.log"), allLog, "utf8");
writeFileSync(join(docs, "门限夺宝.graphs.json"), JSON.stringify(graphSummaries, null, 2), "utf8");
console.log(overview);
console.log("graphs with nodes:", graphSummaries.length);
console.log("Wrote docs under", docs);
