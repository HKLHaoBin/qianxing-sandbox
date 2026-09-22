import json
from pathlib import Path

data = json.loads(Path(r"F:\编程\千星沙箱\文档\元件.decoded.json").read_text(encoding="utf-8"))
out_lines: list[str] = []


def log(*args):
    line = " ".join(str(a) for a in args)
    out_lines.append(line)
    print(line)


pr = data["primary_resource"]
log("=== Asset Bundle ===")
log("engine_version:", data.get("engine_version"))
log("export_tag:", data.get("export_tag"))
log("primary:", pr.get("internal_name"), "class=", pr.get("resource_class"), "guid=", pr.get("identity", {}).get("asset_guid"))
log("dependencies:", len(data.get("dependencies", [])))

for di, dep in enumerate(data.get("dependencies", [])):
    log()
    log(f"=== Dependency[{di}] ===")
    log("name:", dep.get("internal_name"))
    log("class:", dep.get("resource_class"))
    log("guid:", dep.get("identity", {}).get("asset_guid"))
    log("kind:", dep.get("identity", {}).get("kind"))
    graph = (((dep.get("graph_data") or {}).get("inner") or {}).get("graph") or {})
    nodes = graph.get("nodes") or []
    comments = graph.get("comments") or []
    blackboard = graph.get("blackboard") or []
    log("nodes:", len(nodes), "comments:", len(comments), "blackboard:", len(blackboard))

    for v in blackboard:
        log("  VAR:", json.dumps(v, ensure_ascii=False)[:300])

    for c in comments:
        log("  COMMENT:", c.get("text"), "pos=", c.get("x_pos"), c.get("y_pos"))

    for node in nodes:
        idx = node.get("index")
        # common fields vary; dump key structural bits
        shell = node.get("shell") or node.get("signature") or {}
        title_bits = {
            "index": idx,
            "keys": list(node.keys()),
        }
        # try common identifiers
        for k in [
            "node_type",
            "type",
            "template_id",
            "kernel_id",
            "shell_id",
            "display_name",
            "name",
            "identifier",
            "node_id",
            "config_id",
        ]:
            if k in node:
                title_bits[k] = node[k]
        if isinstance(shell, dict) and shell:
            title_bits["shell_keys"] = list(shell.keys())[:20]
            for k in ["node_type", "template_id", "kernel_id", "identifier", "name"]:
                if k in shell:
                    title_bits[f"shell.{k}"] = shell[k]

        pins = node.get("pins") or node.get("pin_instances") or []
        conns = node.get("connections") or node.get("flows") or []
        log(f"  NODE[{idx}]:", json.dumps(title_bits, ensure_ascii=False))

        # pin values
        if pins:
            for pi, pin in enumerate(pins):
                # compact
                pv = {k: pin[k] for k in pin.keys() if k in (
                    "name", "identifier", "pin_id", "index", "value", "default_value",
                    "data_type", "type", "connected", "is_input", "direction"
                ) or "value" in k.lower() or "name" in k.lower()}
                if not pv:
                    pv = {k: pin[k] for k in list(pin.keys())[:12]}
                s = json.dumps(pv, ensure_ascii=False)
                if len(s) > 400:
                    s = s[:400] + "..."
                log(f"    pin[{pi}]:", s)

        # connections inside node
        for ck in ["connections", "flows", "links", "outputs", "input_links"]:
            if ck in node and node[ck]:
                s = json.dumps(node[ck], ensure_ascii=False)
                if len(s) > 500:
                    s = s[:500] + "..."
                log(f"    {ck}:", s)

# Also dump a slim JSON of just graphs
slim = {
    "primary_name": pr.get("internal_name"),
    "export_tag": data.get("export_tag"),
    "engine_version": data.get("engine_version"),
    "graphs": [],
}
for dep in data.get("dependencies", []):
    g = (((dep.get("graph_data") or {}).get("inner") or {}).get("graph") or {})
    slim["graphs"].append({
        "name": dep.get("internal_name"),
        "resource_class": dep.get("resource_class"),
        "guid": dep.get("identity", {}).get("asset_guid"),
        "kind": dep.get("identity", {}).get("kind"),
        "node_count": len(g.get("nodes") or []),
        "nodes": g.get("nodes") or [],
        "comments": g.get("comments") or [],
        "blackboard": g.get("blackboard") or [],
    })

Path(r"F:\编程\千星沙箱\文档\元件.graphs.json").write_text(
    json.dumps(slim, ensure_ascii=False, indent=2), encoding="utf-8"
)
Path(r"F:\编程\千星沙箱\文档\元件.nodes.log").write_text("\n".join(out_lines), encoding="utf-8")
print("\nWrote 文档/元件.graphs.json and 文档/元件.nodes.log")
