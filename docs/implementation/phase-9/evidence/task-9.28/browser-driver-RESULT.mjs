import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
const out = path.resolve(
  "docs/implementation/phase-9/evidence/task-9.28",
);
const targets = await (await fetch("http://127.0.0.1:9340/json")).json();
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
    `({label:${JSON.stringify(label)},viewport:{width:innerWidth,height:innerHeight,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth},focus:{tag:document.activeElement.tagName,text:document.activeElement.textContent?.trim().slice(0,130),name:document.activeElement.getAttribute('aria-label')||document.activeElement.labels?.[0]?.textContent?.trim(),outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth},feedback:{text:document.getElementById('backup-import-feedback')?.textContent,role:document.getElementById('backup-import-feedback')?.getAttribute('role'),describedBy:[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Import Setup Backup')?.getAttribute('aria-describedby')},iterations:document.querySelectorAll('.df-goal-inspection .df-accepted-iteration').length,facts:document.querySelectorAll('.df-goal-inspection .df-accepted-fact').length,controls:[...document.querySelectorAll('.df-workflow-block--profiles button,.df-recorded-inspection button,.df-recorded-inspection input,.df-recorded-inspection summary,.df-goal-measurement button,.df-goal-reporting button,.df-goal-reporting input')].filter(e=>e.checkVisibility()).map(e=>({name:e.getAttribute('aria-label')||e.textContent.trim(),height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width})),validation:[...document.querySelectorAll('.df-recorded-inspection input')].map(e=>({name:e.getAttribute('aria-label'),invalid:e.getAttribute('aria-invalid'),describedBy:e.getAttribute('aria-describedby')}))})`,
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
const downloads = "/tmp/dayframe-928-downloads-RESULT";
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
      "/tmp/dayframe-928-seed-build-RESULT/canonical-seed-RESULT.js",
      "utf8",
    ),
  );
  const identity = await ev(
    `(async()=>{const r=await globalThis.seedDayFrame928(${JSON.stringify(title)});localStorage.setItem('task928-independent-sentinel',${JSON.stringify(title)});return{goalId:r.goalId,requestId:r.requestId,acceptedIds:r.acceptedIds,planningGoalId:r.planningGoalId,targets:r.targets}})()`,
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
async function read(goalId) {
  await ev(fs.readFileSync('/tmp/dayframe-928-seed-build-RESULT/canonical-seed-RESULT.js', 'utf8'));
  return ev(`globalThis.readDayFrame928(${JSON.stringify(goalId)})`);
}
async function openInspection() { await click('Inspect recorded Progress and Activity'); await until(has('Policy: goalActivityPolicy')); }
async function period() { await input('Activity start User Day','2026-09-10'); await input('Activity end User Day (inclusive)','2026-09-11'); await click('Apply Activity period'); await until(`!!document.querySelector('button[aria-label="Scheduled: 13"]')`); }
async function category(name) { await ev(`document.querySelector(${JSON.stringify('button[aria-label="'+name+'"]')}).click()`); await pause(); }
fs.writeFileSync(path.join(out,'invalid-import-RESULT.json'),'{invalid');
for (const width of [320,390,768,1280]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:800,deviceScaleFactor:1,mobile:false});
  const ids=await fresh(4961,'source');
  for(const [title,expected] of [['Recorded zero','0%'],['No recorded value','No current value recorded.']]) {
    await selectGoal(title); await openInspection(); await until(`document.querySelector('.df-recorded-inspection').innerText.includes(${JSON.stringify(expected)})`); await measure(`${width}-${title.replaceAll(' ','-')}`);
  }
  await selectGoal('Recorded evidence Goal'); await openInspection();
  await click('How this Progress was calculated');
  await until(has('Definition identity / revision')); await measure(`${width}-progress-provenance`);
  if(width===320){await ev(`document.querySelector('.df-progress-quantity').scrollIntoView({block:'start'})`);await screenshot('320-progress-provenance');}
  await period(); await category('Scheduled: 13');
  if(await ev(`[...document.querySelectorAll('.df-recorded-inspection .df-history-detail-list button')].filter(b=>b.textContent.startsWith('Open Activity day')).length`)!==10)throw Error('Initial row bound');
  await click('Show more Activity rows');
  if(await ev(`[...document.querySelectorAll('.df-recorded-inspection .df-history-detail-list button')].filter(b=>b.textContent.startsWith('Open Activity day')).length`)!==13)throw Error('Incremental row reveal');
  await ev(`document.querySelector('.df-goal-activity-result details summary').click()`); await pause(); await click('Show more coverage details');
  await measure(`${width}-activity-bounds-and-coverage`);
  await until(has('Some history predates Goal-link tracking'));
  if(width===320){await ev(`document.querySelector('.df-goal-coverage').scrollIntoView({block:'start'})`);await screenshot('320-activity-coverage');}
  const beforeReporting=await read(ids.goalId);
  await input('Requested Time hours','7'); await click('Edit Goal'); await input('Goal title','Unwritten Goal draft'); await click('Open Structure'); await until(has('Evaluated ')); await click('Create Milestone'); await input('Milestone title','Unwritten Structure draft');
  await click('Open Measurement controls'); await click('Change Measurement'); await input('Quantity target','555');
  await click('Open value reporting and correction history'); await click('Record New Value'); await input('Current value','25');
  const observed=await ev(`new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,-1)`); await input('Observed date/time',observed);
  await measure(`${width}-existing-observation-form`);
  if(width===320){await ev(`document.querySelector('.df-observation-form').scrollIntoView({block:'start'})`);await screenshot('320-observation-form');}
  await click('Record Value'); await until(has('Value recorded.')); await click('Return to recorded inspection'); await until(`document.querySelector('.df-recorded-inspection .df-progress-percentage')?.innerText==='25%'`); await until(`!!document.querySelector('button[aria-label="Scheduled: 13"]')`);
  const afterObservation=await read(ids.goalId);
  if(afterObservation.progress.quantity.observedValue!=='25'||afterObservation.activity.executionDistribution.completed!==0)throw Error('Observation affected Activity or not recorded');
  await clickMatch('Open Activity day 2026-09-10'); await until(has('Day agenda'));
  await clickMatch('Details: Historical linked work 00'); await click('Report outcome'); await click('Save outcome'); await until(has('Correct or withdraw report')); 
  await click('Back'); await until(`!!document.querySelector('button[aria-label="Reported completed: 1"]')`);
  await until(`document.activeElement.textContent==='Recorded Progress and Activity'`);
  for (const [label,value] of [['Goal title','Unwritten Goal draft'],['Milestone title','Unwritten Structure draft'],['Quantity target','555']]) {
    const found=await ev(`(()=>{const e=[...document.querySelectorAll('input')].find(e=>[...e.labels||[]].some(l=>l.textContent.includes(${JSON.stringify(label)})));return e?.value})()`);if(found!==value)throw Error('Lost draft '+label);
  }
  if(await ev(`[...document.querySelectorAll('.df-recorded-inspection .df-history-detail-list button')].filter(b=>b.textContent.startsWith('Open Activity day')).length`)!==13)throw Error('Return lost row reveal');
  await measure(`${width}-day-return`); if(width===320){await ev(`document.querySelector('.df-recorded-inspection h3').scrollIntoView({block:'start'})`); await screenshot('320-day-return');}
  await ev(`document.querySelector('.df-goal-editor button[type="button"]').click()`); await until(`document.querySelector('input[aria-label="Requested Time hours"]')?.value==='7'`); await click('Edit Goal'); await input('Goal title','Unwritten Goal draft');
  const afterActual=await read(ids.goalId); if(afterActual.progress.quantity.observedValue!=='25'||afterActual.activity.executionDistribution.completed!==1)throw Error('Actual/Progress separation');
  await click('Open value reporting and correction history'); await ev(`document.querySelector('button[aria-label^="Correct record: 25"]').click()`); await pause(); await input('Current value','30'); await click('Save Correction'); await until(has('Correction saved.')); await click('Return to recorded inspection'); await until(`document.querySelector('.df-recorded-inspection .df-progress-percentage')?.innerText==='30%'`); await until(`!!document.querySelector('button[aria-label="Reported completed: 1"]')`);
  const corrected=await read(ids.goalId); if(corrected.progress.quantity.observedValue!=='30'||corrected.progress.observation.revision!==2||corrected.activity.executionDistribution.completed!==1)throw Error('Correction separation');
  for(const [name,before,after,except] of [['observation',beforeReporting,afterObservation,'progressObservations'],['Actual',afterObservation,afterActual,'executionHistory'],['correction',afterActual,corrected,'progressObservations']]) { const a=authority(before.backup.backup),b=authority(after.backup.backup);delete a[except];delete b[except];if(stable(a)!==stable(b))throw Error('Independent authority changed during '+name); }
  observations.push({label:`${width}-canonical-reporting`,afterObservation:{progress:afterObservation.progress,activity:afterObservation.activity},afterActual:{progress:afterActual.progress,activity:afterActual.activity},corrected:{progress:corrected.progress,activity:corrected.activity}});
  await upload(path.join(out,'invalid-import-RESULT.json')); await until(has('Backup file is not valid JSON')); await measure(`${width}-native-invalid`);
  if(await ev(`document.querySelector('.df-goal-editor input').value`)!=='Unwritten Goal draft')throw Error('Rejected import lost Goal draft');
  if(await ev(`document.querySelector('.df-goal-structure form input').value`)!=='Unwritten Structure draft')throw Error('Rejected import lost Structure draft');
  if(width===320)await screenshot('320-rejected-import');
  const source=await download(`${width}-native-authored-export`);
  const file=path.join(out,`${width}-import-RESULT.json`); fs.writeFileSync(file,JSON.stringify(source,null,2));
  await send('Page.reload',{ignoreCache:true});await until(has('My Schedule')); const reloaded=await download(`${width}-native-reload`); compare(`${width}-source-reload`,source,reloaded);
  await fresh(4962,'destination'); await upload(file); await until(has('Complete backup restored across setup')); const restored=await download(`${width}-native-imported`); compare(`${width}-UI-import`,source,restored);
  await send('Page.reload',{ignoreCache:true}); await until(has('My Schedule'));compare(`${width}-import-reload`,source,await download(`${width}-native-import-reload`));
  await selectGoal('Recorded evidence Goal'); await openInspection();await until(`document.querySelector('.df-recorded-inspection .df-progress-percentage')?.innerText==='30%'`);await period();await until(`!!document.querySelector('button[aria-label="Reported completed: 1"]')`);await measure(`${width}-fresh-restored-inspection`);
}
await send('Emulation.setDeviceMetricsOverride',{width:390,height:420,deviceScaleFactor:1,mobile:false});
await click('Open value reporting and correction history');await click('Record New Value');await input('Current value','42');await ev(`document.querySelector('.df-observation-form input').focus()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await ev(`document.activeElement.scrollIntoView({block:'center'})`);await measure('390-reduced-height-keyboard');await screenshot('390-reduced-height');
await send('Emulation.setDeviceMetricsOverride',{width:640,height:800,deviceScaleFactor:1,mobile:false});await ev(`document.documentElement.style.zoom='2';document.querySelector('.df-recorded-inspection').scrollIntoView({block:'start'})`);await measure('320-equivalent-css-reflow');await screenshot('320-reflow');
observations.push({label:'uncaught-native-errors',errors:nativeErrors});fs.writeFileSync(path.join(out,'browser-measurements-RESULT.json'),JSON.stringify(observations,null,2));if(nativeErrors.length)throw Error(JSON.stringify(nativeErrors));console.log('PASS',observations.length,'observations');ws.close();
