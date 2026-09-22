import json
from pathlib import Path

p = Path(r"F:\编程\千星沙箱\文档\元件.decoded.json")
data = json.loads(p.read_text(encoding="utf-8"))

print("TOP KEYS", list(data.keys()))
pr = data.get("primary_resource", {})
print("primary keys", list(pr.keys()))
print("resource_class", pr.get("resource_class"))
print("internal_name", pr.get("internal_name"))
print("identity", pr.get("identity"))

found = []


def find_graphs(o, path=""):
    if isinstance(o, dict):
        if "graph_data" in o:
            found.append(("graph_data@" + path, list(o.keys())[:25]))
        if "nodes" in o and isinstance(o.get("nodes"), list):
            found.append(("nodes@" + path, f"count={len(o['nodes'])}"))
        for k, v in o.items():
            find_graphs(v, f"{path}.{k}" if path else k)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            find_graphs(v, f"{path}[{i}]")


find_graphs(data)
print("FOUND:")
for item in found:
    print(item)

# summarize related_resources / dependencies
for key in ["related_resources", "dependencies", "auxiliary_resources", "resources"]:
    if key in data:
        val = data[key]
        print(key, type(val).__name__, len(val) if hasattr(val, "__len__") else val)

if "related_resources" in data:
    for i, r in enumerate(data["related_resources"][:20]):
        print(
            i,
            "class=",
            r.get("resource_class"),
            "name=",
            r.get("internal_name") or r.get("display_name"),
            "keys=",
            list(r.keys())[:15],
        )
