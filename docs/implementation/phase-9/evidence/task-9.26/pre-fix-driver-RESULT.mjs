import fs from "node:fs";
import path from "node:path";
import { SourceMap } from "node:module";
import { createHash } from "node:crypto";
const out = path.resolve("docs/implementation/phase-9/evidence/task-9.26");
const targets = await (await fetch("http://127.0.0.1:9327/json")).json();
const ws = new WebSocket(
  targets.find((t) => t.type === "page").webSocketDebuggerUrl,
);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map(),
  scripts = new Map(),
  exceptions = [];
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, (d) => (d.error ? reject(d.error) : resolve(d.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });
ws.onmessage = async (e) => {
  const d = JSON.parse(e.data);
  if (d.id) {
    pending.get(d.id)?.(d);
    pending.delete(d.id);
  }
  if (d.method === "Debugger.scriptParsed")
    scripts.set(d.params.scriptId, d.params);
  if (d.method === "Debugger.paused") {
    const p = d.params;
    if (p.data?.description?.includes("Illegal invocation")) {
      const frames = p.callFrames.map((f) => {
        const script = scripts.get(f.location.scriptId);
        let original;
        try {
          const map = JSON.parse(
            fs.readFileSync(
              path.join(
                "/tmp/dayframe-926-prefix-build-RESULT",
                new URL(script.url).pathname,
              ) + ".map",
              "utf8",
            ),
          );
          original = new SourceMap(map).findEntry(
            f.location.lineNumber,
            f.location.columnNumber,
          );
        } catch {}
        return {
          function: f.functionName,
          url: script?.url,
          location: f.location,
          original,
        };
      });
      const frame = p.callFrames[0];
      const locals = await send("Debugger.evaluateOnCallFrame", {
        callFrameId: frame.callFrameId,
        expression: "Object.keys(this??{})",
        returnByValue: true,
      }).catch(() => null);
      exceptions.push({ description: p.data.description, frames, locals });
    }
    await send("Debugger.resume");
  }
};
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
};
const pause = () => new Promise((r) => setTimeout(r, 150));
async function until(expression) {
  for (let n = 0; n < 120; n++) {
    if (await ev(expression)) return;
    await pause();
  }
  throw Error(
    "Timeout " + expression + "\n" + (await ev("document.body?.innerText")),
  );
}
const has = (t) => `document.body?.innerText.includes(${JSON.stringify(t)})`;
async function click(t) {
  await until(
    `[...document.querySelectorAll('button,summary')].some(e=>e.checkVisibility()&&e.textContent.trim()===${JSON.stringify(t)})`,
  );
  await ev(
    `[...document.querySelectorAll('button,summary')].find(e=>e.checkVisibility()&&e.textContent.trim()===${JSON.stringify(t)}).click()`,
  );
  await pause();
}
async function capture() {
  return ev(
    `(async()=>{const local=Object.fromEntries(Object.entries(localStorage).sort());const durable=await new Promise((resolve,reject)=>{const r=indexedDB.open('dayframe-durable-v1');r.onerror=()=>reject('DB');r.onsuccess=()=>{const db=r.result,names=[...db.objectStoreNames],tx=db.transaction(names,'readonly'),v={};for(const n of names){const r=tx.objectStore(n).getAll();r.onsuccess=()=>v[n]=r.result}tx.oncomplete=()=>{db.close();resolve(v)}}});return{local,durable}})()`,
  );
}
await send("Page.enable");
await send("Page.bringToFront");
await send("Emulation.setFocusEmulationEnabled", { enabled: true });
await send("Debugger.enable");
await send("Debugger.setPauseOnExceptions", { state: "all" });
await send("Page.navigate", { url: "about:blank" });
await send("Storage.clearDataForOrigin", {
  origin: "http://127.0.0.1:4936",
  storageTypes: "all",
});
await send("Page.navigate", { url: "http://127.0.0.1:4936/" });
await click("Settings and data");
await pause();
const before = await capture();
const doc = await send("DOM.getDocument");
const file = await send("DOM.querySelector", {
  nodeId: doc.root.nodeId,
  selector: 'input[aria-label="Import Setup Backup File"]',
});
await send("DOM.setFileInputFiles", {
  nodeId: file.nodeId,
  files: [
    path.resolve(
      "docs/implementation/phase-9/evidence/task-9.25/canonical-fixture-RESULT.json",
    ),
  ],
});
await until(has("Illegal invocation"));
const after = await capture();
const digest = (v) =>
  createHash("sha256")
    .update(JSON.stringify(v, Object.keys(v).sort()))
    .digest("hex");
const result = {
  browser: await send("Browser.getVersion"),
  fixture: "../task-9.25/canonical-fixture-RESULT.json",
  exceptions,
  before,
  after,
  exactDurableAndLocalEqual: JSON.stringify(before) === JSON.stringify(after),
  text: await ev("document.body.innerText"),
  build: fs.readFileSync(
    "/tmp/dayframe-926-prefix-build-RESULT/index.html",
    "utf8",
  ),
};
fs.writeFileSync(
  path.join(out, "pre-fix-failure-RESULT.json"),
  JSON.stringify(result, null, 2),
);
console.log(
  JSON.stringify(
    { exceptions, equal: result.exactDurableAndLocalEqual },
    null,
    2,
  ),
);
ws.close();
