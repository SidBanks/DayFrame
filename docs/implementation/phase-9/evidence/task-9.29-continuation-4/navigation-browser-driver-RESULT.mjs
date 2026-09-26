import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
const out = path.resolve(
  "docs/implementation/phase-9/evidence/task-9.29-continuation-4",
);
const attempt = process.argv[2];
if (!/^\d+$/.test(attempt ?? "")) throw Error("Numbered attempt required");
const run = path.join(out, `browser-attempt-${attempt}-RESULT`);
fs.mkdirSync(run); // refuse artifact overwrites
const targets = await (await fetch("http://127.0.0.1:9349/json")).json();
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
  try { fs.writeFileSync(path.join(run, 'native-timeout-diagnostic-RESULT.json'), JSON.stringify(await ev(`(async()=>({preview:qaStore.getState().preview,review:await qaStore.queryPlanningReview({reviewScope:{version:1,scopeType:'reviewScope',id:'diagnostic',kind:'custom',anchorUserDayDate:'2026-09-27',startUserDayDate:'2026-09-27',endUserDayDateExclusive:'2026-09-28',provenance:{source:'explicit'}},historyAsOf:new Date().toISOString()})}))()`), null, 2)); } catch {}
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
  await until(`[...${scope}.querySelectorAll('button')].some(e=>e.checkVisibility()&&e.textContent.trim().startsWith(${JSON.stringify(text)}))`);
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
    path.join(run, name + "-RESULT.png"),
    Buffer.from(r.data, "base64"),
  );
}
const downloads = "/tmp/dayframe-929c4-downloads-RESULT";
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
  if (name)
    fs.writeFileSync(
      path.join(run, name + "-RESULT.json"),
      JSON.stringify(value, null, 2),
    );
  return value;
}
const observations = [];
const checks = {};
async function measure(label) {
 const value = await ev(`({label:${JSON.stringify(label)},width:innerWidth,height:innerHeight,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,focus:{tag:document.activeElement.tagName,text:document.activeElement.textContent?.trim().slice(0,160),outline:getComputedStyle(document.activeElement).outlineStyle,width:getComputedStyle(document.activeElement).outlineWidth},alerts:[...document.querySelectorAll('[role="alert"],[role="status"]')].filter(e=>e.checkVisibility()).map(e=>e.textContent),controls:[...document.querySelectorAll('button')].filter(e=>e.checkVisibility()&&/Accept preferred|Retry scheduling|Build this Schedule|Try:|Apply Planning|Generate Schedule|Refresh Schedule|Confirm Clear|Import Setup|Export Complete/.test(e.textContent)).map(e=>({text:e.textContent.trim(),height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width,disabled:e.disabled}))})`);
 observations.push(value); fs.writeFileSync(path.join(run,'browser-measurements-RESULT.json'),JSON.stringify(observations,null,2));
 if(value.scroll>value.client) throw Error('Horizontal overflow '+label);
 if(value.controls.some(c=>c.height<43.5)) throw Error('Small primary target '+label);
}

// Only the documented unordered top-level fact collection is keyed. Nested payloads,
// every timestamp/revision/optional field, and all other collections stay exact.
const backupData = (data) => { const copy=structuredClone(data); for(const key of ["proposals","candidates","decisions","acceptedAllocations"])copy.proposals[key].sort((a,b)=>a.id.localeCompare(b.id)); for(const key of ["realizations","facts"])copy.realizations[key].sort((a,b)=>a.id.localeCompare(b.id)); return JSON.stringify(copy); };
const retain=(name,value)=>fs.writeFileSync(path.join(run,name+'-RESULT.json'),JSON.stringify(value,null,2));
async function navigate(port) { await send('Page.navigate',{url:`http://127.0.0.1:${port}/`}); await until(has('My Schedule')); }
async function appStore() {
 await ev(`(()=>{for(const e of document.querySelectorAll('*')){const k=Object.keys(e).find(k=>k.startsWith('__reactFiber$'));let f=e[k];while(f){let h=f.memoizedState;while(h){if(h.memoizedState?.current?.acceptProposalOption){globalThis.qaStore=h.memoizedState.current;return}h=h.next}f=f.return}}throw Error('app store missing')})()`);
}
async function fresh(port,label,sleepCorrection=false) {
 await send('Page.navigate',{url:'about:blank'});
 await send('Storage.clearDataForOrigin',{origin:`http://127.0.0.1:${port}`,storageTypes:'all'});
 await navigate(port);
 await ev(fs.readFileSync('/tmp/dayframe-929c4-seed-build-RESULT/canonical-seed-RESULT.js','utf8'));
 const identity=await ev(`seedReview929c4(${JSON.stringify(label)},${sleepCorrection})`);
 await navigate(port); await appStore(); return identity;
}
async function review() { await click('Review Schedule'); await until(has('Generate Schedule')); await click('Generate Schedule'); await until(has('Accept preferred option')); }
async function physical() { return ev(`new Promise((resolve,reject)=>{const r=indexedDB.open('dayframe-durable-v1');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result;const stores=['proposalAuthority','realizationAuthority','historicalPlanBatches','historicalPlanDays','executionHistoryRecords','progressObservations'];const names=stores.filter(x=>db.objectStoreNames.contains(x));const tx=db.transaction(names,'readonly'),reads=Object.fromEntries(names.map(x=>[x,tx.objectStore(x).getAll()]));tx.oncomplete=()=>{db.close();resolve(Object.fromEntries(names.map(x=>[x,reads[x].result])))};tx.onabort=()=>reject(tx.error)}})`); }
async function widths(label) {
 for(const width of [320,390,768,1280]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:width===320?568:844,deviceScaleFactor:1,mobile:false}); await pause();
  await measure(`${width}-${label}`);
  { await ev(`document.querySelector('[role="status"]')?.scrollIntoView({block:'center'})`); await screenshot(`${width}-${label}`); }
 }
}

const bodyIncludes=async text=>await ev(has(text));
async function refreshSchedule(){await click(await bodyIncludes('Refresh Schedule')?'Refresh Schedule':'Generate Schedule');await until(has('Ready to publish'));}
async function counts(){return ev('qaNativeCounts')}
async function countWrites(){await ev(`(()=>{globalThis.qaRestoreCount?.();const original=IDBDatabase.prototype.transaction;globalThis.qaNativeCounts={proposal:0,realization:0,history:0};IDBDatabase.prototype.transaction=function(stores,mode,...rest){const names=typeof stores==='string'?[stores]:Array.from(stores);const tx=original.call(this,stores,mode,...rest);if(mode==='readwrite'){if(names.includes('proposalAuthority'))qaNativeCounts.proposal++;if(names.includes('realizationAuthority'))qaNativeCounts.realization++;if(names.includes('historicalPlanBatches'))qaNativeCounts.history++;}return tx;};globalThis.qaRestoreCount=()=>IDBDatabase.prototype.transaction=original;})()`);}
async function freshQuery(){return ev(`qaStore.queryPlanningReview({reviewScope:{version:1,scopeType:'reviewScope',id:'native-range',kind:'custom',anchorUserDayDate:'2026-09-27',startUserDayDate:'2026-09-27',endUserDayDateExclusive:'2026-09-28',provenance:{source:'explicit'}},historyAsOf:new Date().toISOString()})`)}
async function publicPublish(hash){return ev(`qaStore.publishScheduleRange({publicationRange:{version:1,scopeType:'publicationRange',startUserDayDate:'2026-09-27',endUserDayDateExclusive:'2026-09-28',provenance:{source:'explicitPublication'}},expectedSourceFingerprint:${JSON.stringify(hash)},publishedAt:new Date().toISOString()})`)}


const assert=(c,m)=>{if(!c)throw Error(m)};
const exact=(a,b,m)=>assert(JSON.stringify(a)===JSON.stringify(b),m);

async function detail(){await ev(`(()=>{const s=[...document.querySelectorAll('summary')].find(e=>e.textContent.includes('Conflicts, corrections'));if(!s.parentElement.open)s.click()})()`);await pause()}
async function focusKey(key){await until(`document.activeElement.dataset.reviewReturn===${JSON.stringify(key)}`)}
for(const width of [320,390,768,1280]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:false});
 const identity=await fresh(4982,`Context ${width}`);await countWrites();await review();
 await input('Review start date','2026-09-27');await input('Review end date','2026-09-27');await click('Apply review period');await until(has('Ready to publish'));
 await click('Accept preferred option');await until(has('Decision recorded. Accepted work is scheduled'));await click('Refresh Schedule');
 await clickMatch('Inspect accepted planning:');await until(has('Accepted planning and scheduled work'));
 await click('Back');await until(`document.activeElement.dataset.reviewReturn?.startsWith('goal:')`);
 await clickMatch('Inspect accepted planning:');
 if(!(await ev(`[...document.querySelectorAll('button')].some(e=>!e.closest('nav')&&e.checkVisibility()&&e.textContent.trim()==='Review Schedule')`)))await click('Inspect accepted planning');
 await ev(`[...document.querySelectorAll('button')].find(e=>!e.closest('nav')&&e.checkVisibility()&&e.textContent.trim()==='Review Schedule').click()`);await until(has('Review start date'));
 await detail();await click('Open Daily Planner for 2026-09-27');await until(has('Day agenda'));await click('Back');await focusKey('detail-day');
 await input('Review end date','2026-09-26');await click('Apply review period');await until(has('applied review period has not changed'));
 await ev(`document.querySelector('[data-review-return="range-end"]').focus()`);await click('Summary');await click('Back');await focusKey('range-end');
 assert(await ev(`document.querySelector('[data-review-return="range-end"]').getAttribute('aria-invalid')==='true'`),'retained associated error');
 await input('Review end date','2026-09-27');await click('Apply review period');await detail();
 await ev(`[...document.querySelectorAll('button')].find(e=>e.checkVisibility()&&e.getAttribute('aria-label')?.startsWith('Edit work configuration')).click()`);await until(has('Return to Review Schedule'));await click('Return to Review Schedule');await until(`document.activeElement.dataset.reviewReturn?.startsWith('work:')`);
 await detail();await ev(`[...document.querySelectorAll('button')].find(e=>e.checkVisibility()&&e.getAttribute('aria-label')?.startsWith('Edit commitment')).click()`);await until(has('Return to Review Schedule'));await click('Return to Review Schedule');await until(`document.activeElement.dataset.reviewReturn?.startsWith('commitment:')`);
 await detail();await ev(`[...document.querySelectorAll('button')].find(e=>e.checkVisibility()&&e.getAttribute('aria-label')?.startsWith('Add event to')).click()`);await until(`document.activeElement.id==='manual-event-title'`);await click('Close');await until(`document.activeElement.dataset.reviewReturn?.startsWith('add-event:')`);
 await measure(`${width}-contextual-returns`);await screenshot(`${width}-contextual-returns`);assert((await counts()).history===0,'navigation never publishes');checks[width]={goal:true,day:true,summaryInvalidDraft:true,work:true,commitment:true,event:true,counts:await counts()};retain('browser-checks',checks);
}
console.log('NATIVE_929C4_NAVIGATION_PASS');ws.close();
