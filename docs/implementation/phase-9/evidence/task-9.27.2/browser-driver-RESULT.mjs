import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
const out = path.resolve("docs/implementation/phase-9/evidence/task-9.27.2");
const targets = await (await fetch("http://127.0.0.1:9328/json")).json();
const ws = new WebSocket(
  targets.find((t) => t.type === "page").webSocketDebuggerUrl,
);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const d = JSON.parse(e.data);
  if (d.id) {
    pending.get(d.id)?.(d);
    pending.delete(d.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, (d) => (d.error ? reject(d.error) : resolve(d.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
};
const pause = () => new Promise((r) => setTimeout(r, 140));
async function until(expression) {
  for (let n = 0; n < 100; n++) {
    if (await ev(expression)) return;
    await pause();
  }
  throw Error(
    "Timed out: " + expression + "\n" + (await ev("document.body.innerText")),
  );
}
const has = (text) =>
  `document.body?.innerText.includes(${JSON.stringify(text)})`;
async function click(text) {
  await until(
    `[...document.querySelectorAll('button,summary')].some(x=>x.checkVisibility()&&x.textContent.trim()===${JSON.stringify(text)})`,
  );
  await ev(
    `(()=>{const e=[...document.querySelectorAll('button,summary')].find(x=>x.checkVisibility()&&x.textContent.trim()===${JSON.stringify(text)});e.click()})()`,
  );
  await pause();
}
async function clickMatch(text, scope = "document") {
  await ev(
    `(()=>{const e=[...${scope}.querySelectorAll('button')].find(x=>x.checkVisibility()&&x.textContent.trim().startsWith(${JSON.stringify(text)}));if(!e)throw Error('Missing '+${JSON.stringify(text)});e.click()})()`,
  );
  await pause();
}
async function input(label, value) {
  await ev(
    `(()=>{const e=[...document.querySelectorAll('input,select,textarea')].find(e=>e.getAttribute('aria-label')===${JSON.stringify(label)}||[...e.labels||[]].some(l=>{const c=l.cloneNode(true);c.querySelectorAll('input,select,textarea').forEach(x=>x.remove());return c.textContent.trim().replace(/\\s+/g,' ')===${JSON.stringify(label)}}));if(!e)throw Error('Missing input '+${JSON.stringify(label)});Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e),'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}))})()`,
  );
  await pause();
}
async function screenshot(name) {
  const r = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  fs.writeFileSync(
    path.join(out, name + "-RESULT.png"),
    Buffer.from(r.data, "base64"),
  );
}
const observations = [];
async function measure(label) {
  const r = await ev(
    `({label:${JSON.stringify(label)},viewport:{width:innerWidth,height:innerHeight,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth},focus:{tag:document.activeElement.tagName,text:document.activeElement.textContent?.trim().slice(0,130),name:document.activeElement.getAttribute('aria-label')||document.activeElement.labels?.[0]?.textContent?.trim(),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth},feedback:{text:document.getElementById('backup-import-feedback')?.textContent,role:document.getElementById('backup-import-feedback')?.getAttribute('role'),describedBy:[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Import Setup Backup')?.getAttribute('aria-describedby')},iterations:document.querySelectorAll('.df-goal-inspection .df-accepted-iteration').length,facts:document.querySelectorAll('.df-goal-inspection .df-accepted-fact').length,controls:[...document.querySelectorAll('.df-workflow-block--profiles button,.df-goal-planning button,.df-goal-planning input,.df-goal-inspection summary')].filter(e=>e.checkVisibility()).map(e=>({name:e.getAttribute('aria-label')||e.textContent.trim(),height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width})),validation:[...document.querySelectorAll('.df-goal-inspection input')].map(e=>({name:e.getAttribute('aria-label'),invalid:e.getAttribute('aria-invalid'),describedBy:e.getAttribute('aria-describedby')}))})`,
  );
  observations.push(r);
  fs.writeFileSync(
    path.join(out, "browser-measurements-RESULT.json"),
    JSON.stringify(observations, null, 2),
  );
  if (
    /native-(invalid|unsupported)$/.test(label) &&
    (r.focus.tag !== "BUTTON" || r.focus.text !== "Import Setup Backup")
  )
    throw Error("Rejected import lost focus " + label);
  if (r.viewport.scroll > r.viewport.client)
    throw Error("Horizontal overflow " + label);
  if (r.controls.some((c) => c.height < 43.5))
    throw Error("Small hit target " + label);
  return r;
}
const downloads = "/tmp/dayframe-9272-downloads-RESULT";
fs.mkdirSync(downloads, { recursive: true });
await send("Page.enable");
await send("Page.bringToFront");
await send("Emulation.setFocusEmulationEnabled", { enabled: true });
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Browser.setDownloadBehavior", {
  behavior: "allow",
  downloadPath: downloads,
});
const nativeErrors = [];
ws.addEventListener("message", (e) => {
  const d = JSON.parse(e.data);
  if (d.method === "Runtime.exceptionThrown")
    nativeErrors.push(d.params.exceptionDetails);
});
await send("Runtime.enable");
async function settings() {
  await ev(
    `(()=>{const s=[...document.querySelectorAll('summary')].find(e=>e.textContent.trim()==='Settings and data');if(s&&!s.parentElement.open)s.click()})()`,
  );
  await pause();
}
async function upload(file) {
  await settings();
  await ev(
    `[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Import Setup Backup').focus()`,
  );
  const doc = await send("DOM.getDocument");
  const f = await send("DOM.querySelector", {
    nodeId: doc.root.nodeId,
    selector: 'input[aria-label="Import Setup Backup File"]',
  });
  await send("DOM.setFileInputFiles", {
    nodeId: f.nodeId,
    files: file ? [path.resolve(file)] : [],
  });
  await pause();
}
async function download(name) {
  await settings();
  const before = new Map(
    fs
      .readdirSync(downloads)
      .map((f) => [f, fs.statSync(path.join(downloads, f)).mtimeMs]),
  );
  await click("Export Complete Backup");
  let file;
  for (let n = 0; n < 150; n++) {
    file = fs
      .readdirSync(downloads)
      .find(
        (f) =>
          f.endsWith(".json") &&
          before.get(f) !== fs.statSync(path.join(downloads, f)).mtimeMs,
      );
    if (file) break;
    await pause();
  }
  if (!file) throw Error("Export download missing");
  const value = JSON.parse(fs.readFileSync(path.join(downloads, file), "utf8"));
  if (name === "source-A-native-export" || name.startsWith("320-"))
    fs.writeFileSync(
      path.join(out, name + "-RESULT.json"),
      JSON.stringify(value, null, 2),
    );
  return value;
}
async function fresh(port, title) {
  await send("Page.navigate", { url: "about:blank" });
  await send("Storage.clearDataForOrigin", {
    origin: `http://127.0.0.1:${port}`,
    storageTypes: "all",
  });
  await send("Page.navigate", { url: `http://127.0.0.1:${port}/` });
  await until(has("My Schedule"));
  await ev(
    fs.readFileSync(
      "/tmp/dayframe-9272-seed-build-RESULT/canonical-seed-RESULT.js",
      "utf8",
    ),
  );
  const identity = await ev(
    `(async()=>{const r=await globalThis.seedDayFrame9272(${JSON.stringify(title)});localStorage.setItem('task9272-independent-sentinel',${JSON.stringify(title)});return{goalId:r.goalId,requestId:r.requestId,acceptedIds:r.acceptedIds,planningGoalId:r.planningGoalId}})()`,
  );
  await send("Page.navigate", { url: `http://127.0.0.1:${port}/` });
  await until(has("My Schedule"));
  return identity;
}
const unordered = [
  ["proposals", "proposals"],
  ["proposals", "candidates"],
  ["proposals", "decisions"],
  ["proposals", "acceptedAllocations"],
  ["realizations", "realizations"],
  ["realizations", "facts"],
];
function authority(value) {
  const data = structuredClone(value.data);
  for (const [surface, key] of unordered)
    data[surface][key].sort(
      (a, b) =>
        a.id.localeCompare(b.id) || (a.revision ?? 0) - (b.revision ?? 0),
    );
  return data;
}
function stable(v) {
  return JSON.stringify(v, (_, x) =>
    x && typeof x === "object" && !Array.isArray(x)
      ? Object.fromEntries(
          Object.entries(x).sort(([a], [b]) => a.localeCompare(b)),
        )
      : x,
  );
}
const hash = (v) => createHash("sha256").update(stable(v)).digest("hex");
function compare(label, a, b) {
  const exact = stable(a.data) === stable(b.data),
    same = stable(authority(a)) === stable(authority(b));
  observations.push({
    label,
    sourceDigest: hash(authority(a)),
    restoredDigest: hash(authority(b)),
    exactArrayOrder: exact,
    allAuthorityEqualWithOnlyListedCollectionOrdering: same,
    collectionOrdering: unordered,
  });
  fs.writeFileSync(
    path.join(out, "browser-measurements-RESULT.json"),
    JSON.stringify(observations, null, 2),
  );
  if (!same) throw Error("Authority mismatch " + label);
}
async function selectGoal(title) {
  await click("Goals");
  await until(`!!document.querySelector('.df-goal-list-button')`);
  await input("Search Goals", title);
  await ev('document.querySelector(".df-goal-list-button").click()');
  await until(
    `!!document.querySelector('input[aria-label="Requested Time hours"]')`,
  );
}
async function inspect() {
  await click("Inspect accepted planning");
  await until(has("3 readable accepted iterations"));
  await click("Inspect accepted iteration 1");
  await clickMatch("Inspect scheduled fact: Goal work");
  await ev(
    'document.querySelector(".df-goal-inspection details summary").click()',
  );
  await until(has("Goal name at publication: Network+ original"));
  await until(has("Reported Actual: 47 minutes"));
}

const sourceIdentity = await fresh(4947, "Source A restored Goal");
const source = await download("source-A-native-export");
observations.push({
  label: "source-A",
  ...sourceIdentity,
  browser: await send("Browser.getVersion"),
});
// Legacy-valid fixture: exact pre-repair command evidence, endpoint IDs explicitly remapped
// to the supporting canonical Goals. No post-repair command authors inverted time.
const old = JSON.parse(
  fs.readFileSync(
    "docs/implementation/phase-9/evidence/task-9.27/contract-observations-RESULT.json",
    "utf8",
  ),
);
const anomalous = structuredClone(source);
const targetId = anomalous.data.goals.goals.find(
  (g) => g.id !== sourceIdentity.planningGoalId,
).id;
const sourceId = sourceIdentity.planningGoalId;
anomalous.data.goalStructure.relationships.push(
  ...[
    old.futureInterval.relationship,
    old.reversedInterval.retirement.value,
  ].map((r) => ({
    ...r,
    sourceGoalId: sourceId,
    target: { kind: "goal", goalId: targetId },
  })),
);
anomalous.data.goalStructure.relationships.sort(
  (a, b) => a.id.localeCompare(b.id) || a.revision - b.revision,
);
fs.writeFileSync(
  path.join(out, "legacy-anomalous-fixture-RESULT.json"),
  JSON.stringify(anomalous, null, 2),
);
fs.writeFileSync(path.join(out, "malformed-input-RESULT.json"), "{bad");
async function canonical(goalId) {
  await ev(
    fs.readFileSync(
      "/tmp/dayframe-9272-seed-build-RESULT/canonical-seed-RESULT.js",
      "utf8",
    ),
  );
  return ev(`globalThis.readDayFrame9272(${JSON.stringify(goalId)})`);
}
for (const width of [320, 390, 768, 1280]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  const destination = await fresh(4948, "Destination B");
  await selectGoal("Destination B");
  await input("Requested Time hours", "7");
  await click("Edit Goal");
  await input("Goal title", "B unsaved draft");
  const before = await download(`${width}-B-before`);
  await upload(path.join(out, "malformed-input-RESULT.json"));
  await until(has("Backup file is not valid JSON"));
  await measure(`${width}-native-invalid`);
  if (
    !(await ev(
      `document.querySelector('.df-goal-editor input').value==='B unsaved draft'`,
    ))
  )
    throw Error("Rejected draft lost");
  compare(
    `${width}-rejection-nonmutation`,
    before,
    await download(`${width}-B-after-rejection`),
  );
  await upload(path.join(out, "source-A-native-export-RESULT.json"));
  await until(has("Complete backup restored across setup"));
  await measure(`${width}-coherent-restored`);
  compare(
    `${width}-coherent-import`,
    source,
    await download(`${width}-coherent-export`),
  );
  await send("Page.navigate", { url: "http://127.0.0.1:4948/" });
  await until(has("My Schedule"));
  compare(
    `${width}-coherent-reload`,
    source,
    await download(`${width}-coherent-reloaded`),
  );
  await selectGoal("Planning proof");
  await click("Evaluate planning opportunity");
  await until(has("Proposal saved for review"));
  await measure(`${width}-planning-evaluation`);
  await click("Review Schedule");
  await click("Accept preferred option");
  await until(has("Scheduled Goal work and resources"));
  const planned = await download(`${width}-planning-accepted`);
  if (
    planned.data.proposals.acceptedAllocations.length !==
    source.data.proposals.acceptedAllocations.length + 1
  )
    throw Error("Acceptance missing");
  const newAcceptance = planned.data.proposals.acceptedAllocations.find(
    (a) =>
      !source.data.proposals.acceptedAllocations.some((b) => a.id === b.id),
  );
  observations.push({
    label: `${width}-native-planning-acceptance`,
    newAcceptance,
    query: (await canonical(sourceId)).query,
  });
  await upload(path.join(out, "legacy-anomalous-fixture-RESULT.json"));
  await until(has("Structure records and history were preserved"));
  await ev(
    'document.getElementById("backup-import-feedback").scrollIntoView({block:"center"})',
  );
  await measure(`${width}-anomalous-preservation`);
  if (width === 320) await screenshot("320-anomalous-preservation");
  compare(
    `${width}-anomalous-export`,
    anomalous,
    await download(`${width}-anomalous-export`),
  );
  await selectGoal("Planning proof");
  await until(has("their recorded times cannot safely support planning"));
  await click("Evaluate planning opportunity");
  await until(has("No proposal is available."));
  await measure(`${width}-planning-protected`);
  if (width === 320) {
    await ev(
      'document.querySelector(".df-goal-planning").scrollIntoView({block:"start"})',
    );
    await screenshot("320-planning-protected");
  }
  const proof = await canonical(sourceId);
  if (
    proof.qualification.status !== "protected" ||
    proof.query.value.eligibility !== "unknown"
  )
    throw Error("Anomaly not protected");
  observations.push({
    label: `${width}-anomalous-qualification`,
    qualification: proof.qualification,
    query: proof.query,
  });
  const after = await download(`${width}-anomalous-after-evaluation`);
  compare(`${width}-blocked-planning-nonmutation`, anomalous, after);
  await send("Page.navigate", { url: "http://127.0.0.1:4948/" });
  await until(has("My Schedule"));
  compare(
    `${width}-anomalous-reload`,
    anomalous,
    await download(`${width}-reloaded-native-export`),
  );
  await selectGoal("Planning proof");
  await until(has("their recorded times cannot safely support planning"));
  await measure(`${width}-reloaded-protection`);
  if (after.data.goals.goals.some((g) => g.id === destination.goalId))
    throw Error("Destination Goal retained");
}
await settings();
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 420,
  deviceScaleFactor: 1,
  mobile: false,
});
await ev(
  `[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Export Complete Backup').focus()`,
);
await send("Input.dispatchKeyEvent", {
  type: "keyDown",
  key: "Tab",
  code: "Tab",
  windowsVirtualKeyCode: 9,
});
await send("Input.dispatchKeyEvent", {
  type: "keyUp",
  key: "Tab",
  code: "Tab",
  windowsVirtualKeyCode: 9,
});
await measure("reduced-height-keyboard");
await screenshot("390-reduced-height-keyboard");
await send("Emulation.setDeviceMetricsOverride", {
  width: 640,
  height: 800,
  deviceScaleFactor: 1,
  mobile: false,
});
await ev('document.documentElement.style.zoom="2"');
await measure("css-zoom-approximation");
await screenshot("320-reflow");
await ev('document.documentElement.style.zoom=""');
observations.push({ label: "uncaught-native-errors", errors: nativeErrors });
fs.writeFileSync(
  path.join(out, "browser-measurements-RESULT.json"),
  JSON.stringify(observations, null, 2),
);
if (nativeErrors.length) throw Error("Uncaught native error");
console.log("PASS", observations.length, "observations");
ws.close();
