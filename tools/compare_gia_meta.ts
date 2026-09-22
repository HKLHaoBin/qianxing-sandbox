import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const proto = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");
const docs = join(__dirname, "..", "文档");

function summarize(path: string) {
  const b: any = decode_gia_file(path, proto, true);
  return {
    path,
    size_hint: undefined as any,
    engine: b.engine_version,
    export_tag: b.export_tag,
    primary: {
      keys: Object.keys(b.primary_resource || {}),
      name: b.primary_resource?.internal_name,
      class: b.primary_resource?.resource_class,
      identity: b.primary_resource?.identity,
      refs: b.primary_resource?.reference_list,
      has_graph_data: !!b.primary_resource?.graph_data,
      field_shapes: Object.fromEntries(
        Object.entries(b.primary_resource || {}).map(([k, v]) => {
          if (v == null) return [k, null];
          if (Array.isArray(v)) return [k, `arr:${v.length}`];
          if (typeof v === "object") return [k, `obj:${Object.keys(v as object).join(",")}`];
          return [k, typeof v + ":" + String(v)];
        }),
      ),
    },
    deps: (b.dependencies || []).map((d: any) => ({
      name: d.internal_name,
      class: d.resource_class,
      identity: d.identity,
      keys: Object.keys(d),
      nodeCount: d.graph_data?.inner?.graph?.nodes?.length,
      display: d.graph_data?.inner?.graph?.display_name,
      graphIdentity: d.graph_data?.inner?.graph?.identity,
      entry_slot_index: d.graph_data?.inner?.graph?.entry_slot_index,
      evaluation_interval: d.graph_data?.inner?.graph?.evaluation_interval,
      port_mappings: d.graph_data?.inner?.graph?.port_mappings?.length,
    })),
  };
}

const orig = summarize(join(__dirname, "..", "元件.gia"));
const fixed = summarize(join(__dirname, "..", "元件_修复.gia"));
writeFileSync(join(docs, "compare_original_meta.json"), JSON.stringify(orig, null, 2));
writeFileSync(join(docs, "compare_fixed_meta.json"), JSON.stringify(fixed, null, 2));
console.log("ORIGINAL", JSON.stringify(orig, null, 2));
console.log("FIXED", JSON.stringify(fixed, null, 2));
