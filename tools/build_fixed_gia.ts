/**
 * Rebuild 积木星星 prefab graphs with bugfixes and pack back to .gia
 *
 * Fixes for 开宝箱:
 * - Require 钥匙数量 >= 1 via Greater_equal
 * - Consume 1 key on success (Set_Variable write-back)
 * - Deactivate tab after open (should_activate = false)
 * - Keep False branch print "星星不足"
 *
 * 拾取星星:
 * - Keep order: add key -> print "钥匙+1" -> destroy
 */
import { writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Graph } from "./Miliastra-Node-Editor-Pack/utils/gia_gen/interface.ts";
import { NODES } from "./Miliastra-Node-Editor-Pack/utils/node_data/game_nodes.ts";
import {
  decode_gia_file,
  encode_gia_file,
} from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputGia = join(root, "元件.gia");
const outGia = join(root, "元件_修复.gia");
const outLog = join(root, "文档", "元件_修复.graph.debug.log");
const protoPath = join(
  __dirname,
  "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto",
);

const UID = 224072483;
const GUID_PICKUP = 1073741825;
const GUID_CHEST = 1073741826;
const PRESET_OPEN = 100010060;

function buildPickupGraph(): Graph {
  const g = new Graph("ENTITY_NODE_GRAPH", UID, "拾取星星", GUID_PICKUP);

  const onEnter = g.add_node(NODES.Trigger_CollisionTrigger_OnEnter)!;
  const getOwner = g.add_node(NODES.Query_CharacterRelated_GetOwnerPlayer)!;
  const getVar = g.add_node(NODES.Query_CustomVariable_GetVariable, "C<T:Int>")!;
  const add = g.add_node(NODES.Arithmetic_Math_Add, "C<T:Int>")!;
  const setVar = g.add_node(NODES.Execution_CustomVariable_SetVariable, "C<T:Int>")!;
  const print = g.add_node(NODES.Execution_CommonNode_Print)!;
  const destroy = g.add_node(NODES.Execution_EntityRelated_DestroyEntity)!;

  getVar.setVal("var_name", "钥匙数量");
  setVar.setVal("variable_name", "钥匙数量");
  add.setVal("b", 1);
  print.setVal("text", "钥匙+1");

  // flow: enter -> set -> print -> destroy
  g.flow(onEnter, setVar);
  g.flow(setVar, print);
  g.flow(print, destroy);

  // data
  g.connect(onEnter, getOwner, "enterer_entity", "character");
  g.connect(getOwner, getVar, "owner", "target_entity");
  g.connect(getOwner, setVar, "owner", "target_entity");
  g.connect(getVar, add, "value", "a");
  g.connect(add, setVar, "result", "value");
  g.connect(onEnter, destroy, "trigger_entity", "target_entity");

  g.autoLayout();
  return g;
}

function buildChestGraph(): Graph {
  const g = new Graph("ENTITY_NODE_GRAPH", UID, "开宝箱", GUID_CHEST);

  const onTab = g.add_node(NODES.Trigger_Tab_OnTabSelect)!;
  const getOwner = g.add_node(NODES.Query_CharacterRelated_GetOwnerPlayer)!;
  const getVar = g.add_node(NODES.Query_CustomVariable_GetVariable, "C<T:Int>")!;
  const ge = g.add_node(NODES.Arithmetic_Math_GreaterEqual, "C<T:Int>")!;
  const sub = g.add_node(NODES.Arithmetic_Math_Subtract, "C<T:Int>")!;
  const setVar = g.add_node(NODES.Execution_CustomVariable_SetVariable, "C<T:Int>")!;
  const branch = g.add_node(NODES.Control_General_Branch)!;
  const setStatus = g.add_node(NODES.Execution_PresetStatus_SetStatus)!;
  const setTab = g.add_node(NODES.Execution_Tab_SetState)!;
  const printFail = g.add_node(NODES.Execution_CommonNode_Print)!;

  getVar.setVal("var_name", "钥匙数量");
  setVar.setVal("variable_name", "钥匙数量");
  ge.setVal("b", 1);
  sub.setVal("b", 1);
  setStatus.setVal("preset_index", PRESET_OPEN);
  setStatus.setVal("preset_value", 1);
  setTab.setVal("should_activate", false);
  printFail.setVal("text", "星星不足");

  // flow
  g.flow(onTab, branch);
  g.flow(branch, setVar, "True", "FlowIn");
  g.flow(setVar, setStatus);
  g.flow(setStatus, setTab);
  g.flow(branch, printFail, "False", "FlowIn");

  // data: who / how many
  g.connect(onTab, getOwner, "selector_entity", "character");
  g.connect(getOwner, getVar, "owner", "target_entity");
  g.connect(getOwner, setVar, "owner", "target_entity");
  g.connect(getVar, ge, "value", "a");
  g.connect(ge, branch, "ok", "cond");
  g.connect(getVar, sub, "value", "a");
  g.connect(sub, setVar, "result", "value");

  // open chest + disable tab on the tab source entity
  g.connect(onTab, setStatus, "source_entity", "target_entity");
  g.connect(onTab, setTab, "source_entity", "target_entity");
  g.connect(onTab, setTab, "tab_id", "tab_id");

  g.autoLayout();
  return g;
}

function main() {
  const original = decode_gia_file(inputGia, protoPath, true);

  const pickup = buildPickupGraph();
  const chest = buildChestGraph();

  const pickupBundle = pickup.encode();
  const chestBundle = chest.encode();

  // Keep prefab shell; swap dependency graphs (preserve guids/names)
  const fixed = structuredClone(original) as any;
  fixed.engine_version = original.engine_version ?? "7.0.0";
  fixed.dependencies = [
    chestBundle.primary_resource,
    pickupBundle.primary_resource,
  ];

  // Ensure prefab references both graphs
  const refs = fixed.primary_resource.reference_list ?? [];
  const want = [
    {
      source_domain: 0,
      service_domain: 5,
      kind: 0,
      asset_guid: GUID_PICKUP,
      runtime_id: 0,
    },
    {
      source_domain: 0,
      service_domain: 5,
      kind: 0,
      asset_guid: GUID_CHEST,
      runtime_id: 0,
    },
  ];
  const have = new Set(refs.map((r: any) => r.asset_guid));
  for (const r of want) {
    if (!have.has(r.asset_guid)) refs.push(r);
  }
  fixed.primary_resource.reference_list = refs;

  const ts = Math.floor(Date.now() / 1000);
  fixed.export_tag = `${UID}-${ts}-${GUID_PICKUP}-\\元件_修复.gia`;

  encode_gia_file(outGia, fixed, protoPath);

  // verify by decode + debugPrint
  const verify = decode_gia_file(outGia, protoPath, true);
  let log = "";
  const logger = (...msg: string[]) => {
    log += msg.join(" ") + "\n";
  };
  for (let i = 0; i < (verify.dependencies?.length ?? 0); i++) {
    const dep = verify.dependencies![i];
    const fake = { ...verify, primary_resource: dep, dependencies: [] };
    log += `\n======== Dependency[${i}] ${dep.internal_name} ========\n`;
    try {
      Graph.decode(fake as any).debugPrint({ log: logger });
    } catch (e) {
      log += `decode fail: ${(e as Error).message}\n`;
    }
  }
  writeFileSync(outLog, log, "utf8");
  console.log(log);
  console.log("Wrote", outGia);
  console.log("Wrote", outLog);
  console.log("size", readFileSync(outGia).byteLength, "bytes");
}

main();
