/**
 * Static+structural diagnosis for "have key but can't open chest".
 * Writes NDJSON to workspace debug-40e715.log
 */
import { appendFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { decode_gia_file } from "./Miliastra-Node-Editor-Pack/utils/protobuf/decode.ts";
import { Graph } from "./Miliastra-Node-Editor-Pack/utils/gia_gen/interface.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const logPath = join(root, "debug-40e715.log");
const proto = join(__dirname, "Miliastra-Node-Editor-Pack/utils/protobuf/gia.proto");
const folder = join(root, "门限夺宝");
const SESSION = "40e715";

function log(hypothesisId: string, location: string, message: string, data: Record<string, unknown>) {
  // #region agent log
  const line = JSON.stringify({
    sessionId: SESSION,
    runId: "chest-open-diag-1",
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  });
  appendFileSync(logPath, line + "\n", "utf8");
  // #endregion
}

function analyzeChest(fileName: string, expectedCostHint: number) {
  const path = join(folder, fileName);
  if (!existsSync(path)) {
    log("H0", fileName, "gia missing", { path });
    return;
  }
  const bundle: any = decode_gia_file(path, proto, true);
  const r = bundle.primary_resource;
  const graph = Graph.decode({ ...bundle, primary_resource: r, dependencies: [] } as any);

  // Collect via debug dump string analysis of pin values we already know structure for
  let dump = "";
  graph.debugPrint({
    log: (...m: string[]) => {
      dump += m.join(" ") + "\n";
    },
  });

  const hasKeyGet = dump.includes('var_name: "钥匙数量"');
  const hasCostGet = dump.includes('var_name: "钥匙消耗"');
  const hasScoreGet = dump.includes('var_name: "得分"');
  const hasPlayerScore = dump.includes('var_name: "本局得分"');
  const hasGreaterEqual = dump.includes("Greater_equal");
  const hasSubtract = dump.includes("Subtract");
  const trueToSetKey = /Branch\(2\).*True[\s\S]*Set_Variable\(9\)|True\] --> \[Execution\.Custom_Variable\.Set_Variable\(9\)/.test(
    dump,
  );
  const falseToPrint = dump.includes("False] --> [Execution.Common_Node.Print");
  const printText = (dump.match(/text: "([^"]+)"/) || [])[1] || null;
  const ownerFromSelector = dump.includes("selector_entity] --> [Query.Character_Related.Get_Owner_Player");
  const costFromSource = dump.includes("source_entity] --> [Query.Custom_Variable.Get_Variable(5)");
  const keysFromOwner = /Get_Owner_Player\(3\)::owner\] --> \[Query\.Custom_Variable\.Get_Variable\(4\)/.test(dump);

  // Greater_equal wiring: a from keys, b from cost
  const geAFromKeys = dump.includes("Get_Variable(4)::value] --> [Arithmetic.Math.Greater_equal(7)::a");
  const geBFromCost = dump.includes("Get_Variable(5)::value] --> [Arithmetic.Math.Greater_equal(7)::b");

  log("H-A", fileName, "chest cost path (need enough keys)", {
    fileName,
    expectedCostHint,
    hasCostGet,
    costFromChestEntity: costFromSource,
    note: "If user has 1 key but opens mid/big (cost 2/3), Branch False → 钥匙不足",
  });

  log("H-B", fileName, "key read entity path", {
    ownerFromSelector,
    keysFromOwner,
    hasKeyGet,
    risk: !ownerFromSelector || !keysFromOwner ? "reading keys from wrong entity" : "ok",
  });

  log("H-C", fileName, "compare Greater_equal wiring", {
    hasGreaterEqual,
    geAFromKeys,
    geBFromCost,
    hasSubtract,
    inverted: geAFromKeys && geBFromCost ? false : "check dump",
  });

  log("H-D", fileName, "false branch feedback", {
    falseToPrint,
    printText,
    trueGoesToConsumeKey: trueToSetKey || dump.includes("True] --> [Execution.Custom_Variable.Set_Variable(9)"),
  });

  log("H-E", fileName, "score/open side effects present", {
    hasScoreGet,
    hasPlayerScore,
    destroyAfter: dump.includes("Destroy_Entity(17)"),
  });

  // write dump snippet for keys
  writeFileSync(join(root, "文档", "限时夺宝-时间门", `_diag_${fileName}.txt`), dump, "utf8");
}

// clear log file content by rewrite
writeFileSync(logPath, "", "utf8");

log("H0", "diag.ts", "start chest-open diagnosis", { folder });

analyzeChest("开小宝箱.gia", 1);
analyzeChest("开中宝箱.gia", 2);
analyzeChest("开大宝箱.gia", 3);

// key pickup
{
  const path = join(folder, "拾取钥匙.gia");
  const bundle: any = decode_gia_file(path, proto, true);
  const graph = Graph.decode({
    ...bundle,
    primary_resource: bundle.primary_resource,
    dependencies: [],
  } as any);
  let dump = "";
  graph.debugPrint({ log: (...m: string[]) => (dump += m.join(" ") + "\n") });
  log("H-B", "拾取钥匙.gia", "pickup writes 钥匙数量 on owner player", {
    addsOne: dump.includes("b: 1 as Int"),
    writesKey: dump.includes('variable_name: "钥匙数量"'),
    destroyLast: /Set_Variable\(5\)::FlowOut\] --> \[Execution\.Entity_Related\.Destroy_Entity\(6\)/.test(dump),
  });
}

log("H0", "diag.ts", "static analysis done — need runtime: which chest + print keys/cost", {
  next: "user reproduce with 打印",
});

console.log("Wrote", logPath);
