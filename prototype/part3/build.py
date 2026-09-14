#!/usr/bin/env python3
import json
from pathlib import Path

HERE = Path(__file__).parent
data = json.loads((HERE / "part3.data.json").read_text())
template = (HERE / "part3.template.html").read_text()
(HERE / "part3.html").write_text(
    template.replace("/*__DATA__*/ null", json.dumps(data, separators=(",", ":")))
    .replace("/*__SCRIPT__*/", (HERE / "part3.js").read_text())
)

