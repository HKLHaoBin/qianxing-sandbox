import { readFileSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";

const root = "F:/编程/千星沙箱";
const logPath = join(root, "debug-40e715.log");
writeFileSync(logPath, "", "utf8");

function log(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
) {
  const line = JSON.stringify({
    sessionId: "40e715",
    runId: "static-pre",
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  });
  appendFileSync(logPath, line + "\n", "utf8");
  console.log(line);
}

const dump = readFileSync(
  join(root, "文档/限时夺宝-时间门/_gate_after_edit.log"),
  "utf8",
);

const nodes: { tid: string; id: number }[] = [];
const nodeRe = /Node: ([^\s]+) \(Index: (\d+)\)/g;
let m: RegExpExecArray | null;
while ((m = nodeRe.exec(dump))) {
  nodes.push({ tid: m[1], id: Number(m[2]) });
}
const maxId = Math.max(...nodes.map((n) => n.id));
log("META", "diag:catalog", "node catalog", {
  count: nodes.length,
  maxId,
  globalTimers: nodes
    .filter((n) => n.tid.includes("Global_Timer"))
    .map((n) => ({ id: n.id, tid: n.tid })),
});

function block(id: number): string | null {
  const marker = `(Index: ${id})`;
  const start = dump.indexOf(marker);
  if (start < 0) return null;
  const hdr = dump.lastIndexOf("Node:", start);
  const next = dump.indexOf("\n  Node:", start + 1);
  return dump.slice(hdr, next < 0 ? undefined : next);
}

function analyze(id: number) {
  const b = block(id);
  if (!b) {
    log("H1", "diag:missing", "node missing", { id });
    return;
  }
  const nameMatch = b.match(/Node: ([^\s]+)/);
  const timer = [...b.matchAll(/timer_name: "([^"]*)"/g)].map((x) => x[1]);
  const flows = [...b.matchAll(/\[(.*?)\] --> \[(.*?)\]/g)].map((x) => ({
    from: x[1],
    to: x[2],
  }));
  log("H1-H6", `diag:node_${id}`, nameMatch?.[1] || "?", {
    id,
    timer,
    flows,
  });
}

for (const id of [1, 5, 23, 24, 25, 30, 31, 32, 33]) analyze(id);

const b23 = block(23) || "";
const b24 = block(24) || "";
const b25 = block(25) || "";
const b31 = block(31) || "";
const b32 = block(32) || "";

log("H1", "diag:flow_chain", "31→24→25→23 chain", {
  "31_to_24": /Start\(31\)::FlowOut/.test(b24),
  "24_to_25": /Start\(24\)::FlowOut/.test(b25),
  "25_to_23": /Pause\(25\)::FlowOut/.test(b23),
  "29_to_32_resume": /Set_Variable\(29\)::FlowOut/.test(b32),
  "32_to_5": /Resume\(32\)::FlowOut/.test(block(5) || ""),
});

log("H2", "diag:timer_names", "close timer name consistency", {
  start24: /关门倒计时/.test(b24),
  pause25: /关门倒计时/.test(b25),
  resume32: /关门倒计时/.test(b32),
  prep31: /准备倒计时/.test(b31),
});

log("H2", "diag:target_entity", "Start/Pause target from On_Created", {
  start24: /On_Created\(1\)::source_entity/.test(b24),
  pause25: /On_Created\(1\)::source_entity/.test(b25),
  resume32: /On_Timer_Trigger\(13\)::source_entity/.test(b32),
});

log("H3", "diag:cannot_static", "timer manager duration not in graph GIA", {
  need: "runtime Get_Time after Start/Pause",
});
log("H4", "diag:cannot_static", "UI widget binding not in this GIA", {
  need: "user confirm widget timer name + source=关卡实体",
});
log("H5", "diag:hypothesis", "UI shows 00:00 while paused even if time>0", {
  test: "if Get_Time>0 but UI still 00:00 => H5 confirmed",
});
log("H6", "diag:hypothesis", "component auto-activate race / Start failed", {
  test: "if Get_Time==0 right after Start => H3 or H6",
});

log("META", "diag:next", "need runtime print probes", {
  proposedIds: {
    getTimeAfterPause: maxId + 1,
    convert: maxId + 2,
    printAfterPause: maxId + 3,
    printAfterStart: maxId + 4,
  },
  markers: ["DBG_CLOSE_AFTER_START", "DBG_CLOSE_AFTER_PAUSE", "DBG_CLOSE_TIME="],
});
