import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
const out = path.resolve(
  process.env.DAYFRAME_925_EVIDENCE ||
    "docs/implementation/phase-9/evidence/task-9.25",
);
const targets = await (await fetch("http://127.0.0.1:9326/json")).json();
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
    `({label:${JSON.stringify(label)},viewport:{width:innerWidth,height:innerHeight,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth},focus:{tag:document.activeElement.tagName,text:document.activeElement.textContent?.trim().slice(0,130),name:document.activeElement.getAttribute('aria-label')||document.activeElement.labels?.[0]?.textContent?.trim(),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth},iterations:document.querySelectorAll('.df-goal-inspection .df-accepted-iteration').length,facts:document.querySelectorAll('.df-goal-inspection .df-accepted-fact').length,controls:[...document.querySelectorAll('.df-goal-inspection button,.df-goal-inspection input,.df-goal-inspection summary')].filter(e=>e.checkVisibility()).map(e=>({name:e.getAttribute('aria-label')||e.textContent.trim(),height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width})),validation:[...document.querySelectorAll('.df-goal-inspection input')].map(e=>({name:e.getAttribute('aria-label'),invalid:e.getAttribute('aria-invalid'),describedBy:e.getAttribute('aria-describedby')}))})`,
  );
  observations.push(r);
  fs.writeFileSync(
    path.join(out, "browser-measurements-RESULT.json"),
    JSON.stringify(observations, null, 2),
  );
  if (r.viewport.scroll > r.viewport.client)
    throw Error("Horizontal overflow " + label);
  if (r.controls.some((c) => c.height < 43.5))
    throw Error("Small hit target " + label);
  return r;
}
async function authority() {
  return ev(
    `new Promise((resolve,reject)=>{const req=indexedDB.open('dayframe-durable-v1');req.onerror=()=>reject('DB');req.onsuccess=()=>{const db=req.result,names=[...db.objectStoreNames].filter(n=>!n.startsWith('restore')),tx=db.transaction(names,'readonly'),values={};for(const n of names){const r=tx.objectStore(n).getAll();r.onsuccess=()=>values[n]=r.result;}tx.oncomplete=()=>{db.close();resolve(values)}}})`,
  );
}
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Network.clearBrowserCache");
await send("Page.enable");
await send("Page.bringToFront");
await send("Emulation.setFocusEmulationEnabled", { enabled: true });
await send("Page.navigate", { url: "about:blank" });
await send("Storage.clearDataForOrigin", {
  origin: "http://127.0.0.1:4926",
  storageTypes: "all",
});
await send("Page.navigate", { url: "http://127.0.0.1:4926/" });
await until(has("My Schedule"));
await ev(
  fs.readFileSync(
    "/tmp/dayframe-925-seed-build-RESULT/canonical-seed-RESULT.js",
    "utf8",
  ),
);
const exported = await ev(
  `(async()=>{const {store}=await globalThis.seedDayFrame925();const result=await store.exportBackupV14(new Date().toISOString());if(result.status!=='exported')throw Error(JSON.stringify(result));return result.backup})()`,
);
fs.writeFileSync(
  path.join(out, "canonical-fixture-RESULT.json"),
  JSON.stringify(exported, null, 2),
);
await send("Page.navigate", { url: "http://127.0.0.1:4926/" });
await until(has("My Schedule"));
const before = await authority();
for (const width of [320, 390, 768, 1280]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await click("Goals");
  await until(`!!document.querySelector('.df-goal-list-button')`);
  await input("Search Goals", "Network+");
  await ev('document.querySelector(".df-goal-list-button").click()');
  await until(
    `!!document.querySelector('input[aria-label="Requested Time hours"]')`,
  );
  await input("Requested Time hours", "7");
  await click("Edit Goal");
  await input("Goal title", `Retained Goal draft ${width}`);
  await click("Inspect accepted planning");
  await until(has("3 readable accepted iterations"));
  await input("Goal inspection start date", "2026-09-04");
  await input("Goal inspection end date", "2026-09-06");
  await click("Apply inspection period");
  await until(has("3 readable accepted iterations"));
  await measure(`${width}-canonical-period`);
  await click("Inspect accepted iteration 1");
  await clickMatch("Inspect scheduled fact: Goal work");
  await clickMatch(
    "Publication:",
    `document.querySelector('.df-goal-inspection')`,
  ).catch(async () => {
    await ev(
      `document.querySelector('.df-goal-inspection details summary').click()`,
    );
    await pause();
  });
  await until(has("Goal name at publication: Network+ original"));
  await ev(
    'document.querySelector(".df-goal-inspection .df-accepted-iteration").scrollIntoView({block:"start"})',
  );
  const identity = await ev(
    `({owner:[...document.querySelectorAll('.df-goal-inspection button')].find(e=>e.textContent.startsWith('Open Daily Planner')).textContent, references:[...document.querySelectorAll('.df-goal-inspection dd')].map(e=>e.textContent)})`,
  );
  observations.push({ label: `${width}-canonical-identity`, ...identity });
  await measure(`${width}-canonical-inspection`);
  if (width === 320) await screenshot("320-canonical-inspection");
  const owner = await ev(
    `[...document.querySelectorAll('.df-goal-inspection button')].find(e=>e.textContent.startsWith('Open Daily Planner')).textContent.replace('Open Daily Planner for ','')`,
  );
  await click("Open Daily Planner for " + owner);
  await until(has("Day agenda"));
  observations.push({
    label: `${width}-canonical-day`,
    expectedOwner: owner,
    text: await ev(
      'document.querySelector(".df-day-workspace")?.innerText||document.querySelector("main").innerText.slice(-4500)',
    ),
  });
  await click("Back");
  await until(has("3 readable accepted iterations"));
  if (
    !(await ev(
      `document.querySelector('.df-goal-editor input').value===${JSON.stringify("Retained Goal draft " + width)}`,
    ))
  )
    throw Error("Goal draft lost");
  if (
    !(await ev(
      `document.querySelector('input[aria-label="Goal inspection end date"]').value==='2026-09-06'`,
    ))
  )
    throw Error("Range lost");
  if (
    !(await ev(
      `document.body.innerText.includes('Goal name at publication: Network+ original')`,
    ))
  )
    throw Error("Publication disclosure lost");
  await measure(`${width}-canonical-return`);
  if (width === 320) await screenshot("320-canonical-return");
  await click("Cancel");
  if (
    !(await ev(
      `document.querySelector('input[aria-label="Requested Time hours"]').value==='7'`,
    ))
  )
    throw Error("Requested Time draft lost");
  await send("Page.navigate", { url: "http://127.0.0.1:4926/" });
  await until(has("My Schedule"));
}
const after = await authority();
const digest = (v) =>
  createHash("sha256")
    .update(
      JSON.stringify(
        Object.fromEntries(
          Object.entries(v).sort(([a], [b]) => a.localeCompare(b)),
        ),
      ),
    )
    .digest("hex");
if (digest(before) !== digest(after))
  throw Error("Inspection changed durable authority");
observations.push({
  label: "canonical-read-only",
  before: digest(before),
  after: digest(after),
  stores: Object.keys(before),
  fixture: "canonical-fixture-RESULT.json",
});
await send("Page.navigate", {
  url: "http://127.0.0.1:4927/defensive-harness-RESULT.html",
});
await click("Inspect accepted planning");
for (const width of [320, 390, 768, 1280]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  for (const [scenario, text] of [
    ["partial", "Retained scheduled references"],
    ["unknown", "Scheduling evidence unavailable or unknown"],
    ["empty", "No accepted planning was found in this period"],
    ["failure", "Goal evidence could not be loaded"],
    ["density", "60 readable accepted iterations"],
  ]) {
    await input("QA scenario", scenario);
    await until(has(text));
    await measure(`${width}-SIMULATED-${scenario}`);
    if (width === 320 && ["partial", "failure"].includes(scenario)) {
      await ev(
        'document.querySelector(".df-goal-inspection").scrollIntoView()',
      );
      await screenshot("320-SIMULATED-" + scenario);
    }
  }
  await click("Show more accepted iterations");
  await measure(`${width}-SIMULATED-reveal`);
  await click("Inspect accepted iteration 1");
  await measure(`${width}-SIMULATED-expanded`);
  await input("Goal inspection end date", "2028-01-01");
  await click("Apply inspection period");
  await until(has("Choose a period from 1 to 366 days"));
  await measure(`${width}-SIMULATED-invalid`);
  await input("Goal inspection end date", "2026-09-30");
  await click("Apply inspection period");
}
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 420,
  deviceScaleFactor: 1,
  mobile: false,
});
await ev(
  '[...document.querySelectorAll("input")].find(e=>e.getAttribute("aria-label")==="Goal inspection start date").focus()',
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
for (let n = 0; n < 8; n++) {
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
  const f = await ev('document.activeElement.getAttribute("aria-label")');
  if (f === "Goal inspection end date") break;
}
await measure("SIMULATED-reduced-height-keyboard");
await screenshot("390-reduced-height-focus");
await send("Emulation.setDeviceMetricsOverride", {
  width: 640,
  height: 800,
  deviceScaleFactor: 1,
  mobile: false,
});
await ev('document.documentElement.style.zoom="2"');
await measure("SIMULATED-css-zoom-approximation");
await ev('document.documentElement.style.zoom=""');
fs.writeFileSync(
  path.join(out, "browser-measurements-RESULT.json"),
  JSON.stringify(observations, null, 2),
);
console.log(
  JSON.stringify(
    observations.map((r) => ({
      label: r.label,
      viewport: r.viewport,
      focus: r.focus,
      iterations: r.iterations,
      facts: r.facts,
      before: r.before,
      after: r.after,
    })),
    null,
    2,
  ),
);
ws.close();
