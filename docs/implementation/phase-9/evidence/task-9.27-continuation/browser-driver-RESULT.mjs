import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
const out = path.resolve(
  "docs/implementation/phase-9/evidence/task-9.27-continuation",
);
const targets = await (await fetch("http://127.0.0.1:9330/json")).json();
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
    `({label:${JSON.stringify(label)},viewport:{width:innerWidth,height:innerHeight,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth},focus:{tag:document.activeElement.tagName,text:document.activeElement.textContent?.trim().slice(0,130),name:document.activeElement.getAttribute('aria-label')||document.activeElement.labels?.[0]?.textContent?.trim(),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth},feedback:{text:document.getElementById('backup-import-feedback')?.textContent,role:document.getElementById('backup-import-feedback')?.getAttribute('role'),describedBy:[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Import Setup Backup')?.getAttribute('aria-describedby')},iterations:document.querySelectorAll('.df-goal-inspection .df-accepted-iteration').length,facts:document.querySelectorAll('.df-goal-inspection .df-accepted-fact').length,controls:[...document.querySelectorAll('.df-workflow-block--profiles button,.df-goal-structure button,.df-goal-structure input,.df-goal-structure select,.df-goal-structure summary')].filter(e=>e.checkVisibility()).map(e=>({name:e.getAttribute('aria-label')||e.textContent.trim(),height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width})),validation:[...document.querySelectorAll('.df-goal-inspection input')].map(e=>({name:e.getAttribute('aria-label'),invalid:e.getAttribute('aria-invalid'),describedBy:e.getAttribute('aria-describedby')}))})`,
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
const downloads = "/tmp/dayframe-927-continuation-downloads-RESULT";
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
      "/tmp/dayframe-927-continuation-seed-build-RESULT/canonical-seed-RESULT.js",
      "utf8",
    ),
  );
  const identity = await ev(
    `(async()=>{const r=await globalThis.seedDayFrame927Continuation(${JSON.stringify(title)});localStorage.setItem('task927Continuation-independent-sentinel',${JSON.stringify(title)});return{goalId:r.goalId,requestId:r.requestId,acceptedIds:r.acceptedIds,planningGoalId:r.planningGoalId,targets:r.targets}})()`,
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

async function read(goalId) {
  await ev(
    fs.readFileSync(
      "/tmp/dayframe-927-continuation-seed-build-RESULT/canonical-seed-RESULT.js",
      "utf8",
    ),
  );
  return ev(
    `globalThis.readDayFrame927Continuation(${JSON.stringify(goalId)})`,
  );
}
async function openStructure() {
  await click("Open Structure");
  await until(has("Evaluated "));
}
async function save() {
  await click("Save Structure");
  await until(`!document.querySelector('form[aria-label="Structure editor"]')`);
  await until(has("Saved durably."));
}
async function link(kind, id, mode) {
  await click(kind);
  await input("Existing endpoint", id);
  if (kind === "Link Subgoal") await input("Subgoal requiredness", mode);
  if (kind === "Add prerequisite") await input("Prerequisite strength", mode);
  await save();
}
const old = JSON.parse(
  fs.readFileSync(
    "docs/implementation/phase-9/evidence/task-9.27/contract-observations-RESULT.json",
    "utf8",
  ),
);
for (const width of [320, 390, 768, 1280]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  const identity = await fresh(4951, "Native source");
  const goalId = identity.planningGoalId;
  const target = identity.targets.find(
    (g) => g.title === "Duplicate target",
  ).id;
  const before = await download(`${width}-before-authoring`);
  await selectGoal("Planning proof");
  await openStructure();
  await link("Link Subgoal", target, "required");
  await link("Add contribution", target);
  await click("Create Milestone");
  await input("Milestone title", "Native checkpoint");
  await input("Milestone target date (optional)", "2026-10-01");
  await measure(`${width}-milestone-form`);
  if (width === 320) {
    await ev(
      'document.querySelector(".df-goal-structure form").scrollIntoView({block:"start"})',
    );
    await screenshot("320-milestone-form");
  }
  await save();
  let proof = await read(goalId);
  const m = proof.structure.milestones.find((m) => m.ownerGoalId === goalId);
  await click("Add prerequisite");
  await input("Prerequisite condition", "milestoneSatisfied");
  await input("Existing endpoint", m.id);
  await input("Prerequisite strength", "hard");
  await save();
  await until(has("A hard prerequisite has not been satisfied."));
  await click("Link Subgoal");
  await input("Existing endpoint", target);
  await input("Subgoal requiredness", "required");
  await click("Save Structure");
  await until(has("This change was rejected by Structure validation"));
  if (
    !(await ev(
      `document.querySelector('form[aria-label="Structure editor"] select[required]').value===${JSON.stringify(target)}`,
    ))
  )
    throw Error("Invalid input lost");
  await measure(`${width}-graph-error`);
  if (width === 320) {
    await ev(
      'document.querySelector(".df-goal-structure [role=alert]").scrollIntoView({block:"start"})',
    );
    await screenshot("320-graph-error");
  }
  await click("Cancel Structure edit");
  const authored = await download(`${width}-authored`);
  for (const k of [
    "goals",
    "goalPlanning",
    "proposals",
    "realizations",
    "progressObservations",
    "historicalPlan",
    "executionHistory",
  ]) {
    if (stable(authored.data[k]) !== stable(before.data[k]))
      throw Error("Automatic downstream change: " + k);
  }
  await click("Evaluate planning opportunity");
  await until(has("No proposal is available."));
  await measure(`${width}-unmet-planning`);
  await click(`Edit Milestone: Native checkpoint · ${m.id}`);
  await input("Checkpoint state", "satisfied");
  await save();
  proof = await read(goalId);
  const satisfied = proof.structure.milestones.find(
    (x) => x.id === m.id && x.revision === 2,
  );
  if (!satisfied?.satisfiedAt) throw Error("No satisfaction");
  await click(`Edit Milestone: Native checkpoint · ${m.id}`);
  await input("Milestone title", "Renamed after satisfaction");
  await save();
  proof = await read(goalId);
  const renamed = proof.structure.milestones.find(
    (x) => x.id === m.id && x.revision === 3,
  );
  if (
    renamed.satisfiedAt !== satisfied.satisfiedAt ||
    renamed.targetDate !== "2026-10-01"
  )
    throw Error("Metadata fidelity");
  await until(has("No current structural prerequisite blocks this Goal."));
  await click("Evaluate planning opportunity");
  await until(has("Proposal saved for review"));
  await measure(`${width}-satisfied-planning`);
  const contribution = proof.structure.relationships.find(
    (r) => r.sourceGoalId === goalId && r.kind === "contributesTo",
  );
  await click(`Retire relationship ${contribution.id}`);
  await click("Confirm relationship retirement");
  await until(`!document.querySelector('form[aria-label="Structure editor"]')`);
  proof = await read(goalId);
  if (
    !proof.structure.relationships.some(
      (r) =>
        r.id === contribution.id && r.revision === 2 && r.status === "retired",
    ) ||
    !proof.structure.relationships.some(
      (r) => stable(r) === stable(contribution),
    )
  )
    throw Error("Retirement history");
  await input("Requested Time hours", "7");
  await click("Edit Goal");
  await input("Goal title", "Unwritten Goal draft");
  await click("Create Milestone");
  await input("Milestone title", "Unwritten Structure draft");
  await clickMatch(
    "Open related Goal:",
    'document.querySelector(".df-goal-structure")',
  );
  await click("Back to previous Goal and drafts");
  await until(
    `document.querySelector('form[aria-label="Structure editor"] input')?.value==='Unwritten Structure draft'`,
  );
  if (
    !(await ev(
      `document.querySelector('.df-goal-editor input').value==='Unwritten Goal draft'`,
    ))
  )
    throw Error("Goal draft lost");
  await measure(`${width}-related-return`);
  if (width === 320) {
    await ev(
      'document.querySelector(".df-goal-structure form").scrollIntoView({block:"start"})',
    );
    await screenshot("320-related-return");
  }
  await click("Cancel Structure edit");
  await click("Cancel");
  await until(
    `document.querySelector('input[aria-label="Requested Time hours"]').value==='7'`,
  );
  const saved = await download(`${width}-ui-authored-export`);
  fs.writeFileSync(
    path.join(out, `${width}-ui-authored-import-RESULT.json`),
    JSON.stringify(saved, null, 2),
  );
  await send("Page.navigate", { url: "http://127.0.0.1:4951/" });
  await until(has("My Schedule"));
  compare(
    `${width}-ui-authored-reload`,
    saved,
    await download(`${width}-ui-authored-reloaded`),
  );
  await fresh(4952, "Distinct destination");
  await upload(path.join(out, `${width}-ui-authored-import-RESULT.json`));
  await until(has("Complete backup restored across setup"));
  compare(
    `${width}-ui-authored-import`,
    saved,
    await download(`${width}-ui-authored-imported`),
  );
  await send("Page.navigate", { url: "http://127.0.0.1:4952/" });
  await until(has("My Schedule"));
  compare(
    `${width}-ui-authored-import-reload`,
    saved,
    await download(`${width}-ui-authored-restored-reload`),
  );
  const anomaly = structuredClone(saved);
  anomaly.data.goalStructure.relationships.push(
    ...[
      old.futureInterval.relationship,
      old.reversedInterval.retirement.value,
    ].map((r) => ({
      ...r,
      sourceGoalId: goalId,
      target: { kind: "goal", goalId: target },
    })),
  );
  anomaly.data.goalStructure.relationships.sort(
    (a, b) => a.id.localeCompare(b.id) || a.revision - b.revision,
  );
  const file = path.join(out, `${width}-anomalous-import-RESULT.json`);
  fs.writeFileSync(file, JSON.stringify(anomaly, null, 2));
  await upload(file);
  await until(has("Structure records and history were preserved"));
  await selectGoal("Planning proof");
  await openStructure();
  await until(has("Ordinary Structure changes and retry are blocked"));
  if (
    !(await ev(
      `[...document.querySelectorAll('.df-goal-structure button')].find(b=>b.textContent==='Create Milestone').disabled`,
    ))
  )
    throw Error("Protected authoring enabled");
  await measure(`${width}-protected-structure`);
  if (width === 320) {
    await ev(
      'document.querySelector(".df-goal-structure").scrollIntoView({block:"start"})',
    );
    await screenshot("320-protected-structure");
  }
  compare(
    `${width}-anomalous-preservation`,
    anomaly,
    await download(`${width}-anomalous-preserved`),
  );
  observations.push({
    label: `${width}-canonical-authoring`,
    satisfied,
    renamed,
    retired: proof.structure.relationships.filter(
      (r) => r.id === contribution.id,
    ),
    query: proof.query,
  });
  fs.writeFileSync(
    path.join(out, "browser-measurements-RESULT.json"),
    JSON.stringify(observations, null, 2),
  );
}
await upload(path.join(out, "1280-ui-authored-import-RESULT.json"));
await until(has("Complete backup restored across setup"));
await selectGoal("Planning proof");
await openStructure();
await click("Create Milestone");
await input("Milestone title", "Reduced-height unsaved draft");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 420,
  deviceScaleFactor: 1,
  mobile: false,
});
await ev(`document.querySelector('.df-goal-structure form input').focus()`);
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
await ev(
  'document.querySelector(".df-goal-structure form input[type=date]").scrollIntoView({block:"center"})',
);
await measure("reduced-height-keyboard");
await screenshot("390-reduced-height");
await send("Emulation.setDeviceMetricsOverride", {
  width: 640,
  height: 800,
  deviceScaleFactor: 1,
  mobile: false,
});
await ev('document.documentElement.style.zoom="2"');
await measure("css-reflow");
await screenshot("320-reflow");
await ev('document.documentElement.style.zoom=""');
await click("Cancel Structure edit");
observations.push({ label: "uncaught-native-errors", errors: nativeErrors });
fs.writeFileSync(
  path.join(out, "browser-measurements-RESULT.json"),
  JSON.stringify(observations, null, 2),
);
if (nativeErrors.length) throw Error("Uncaught native errors");
console.log("PASS", observations.length, "observations");
ws.close();
