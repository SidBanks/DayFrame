import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
const out = path.resolve(
  "docs/implementation/phase-9/evidence/task-9.29.2",
);
const targets = await (await fetch("http://127.0.0.1:9342/json")).json();
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
const downloads = "/tmp/dayframe-9292-downloads-RESULT";
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
      path.join(out, name + "-RESULT.json"),
      JSON.stringify(value, null, 2),
    );
  return value;
}
const observations = [];
const checks = {};
async function measure(label) {
 const value = await ev(`({label:${JSON.stringify(label)},width:innerWidth,height:innerHeight,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,focus:{tag:document.activeElement.tagName,text:document.activeElement.textContent?.trim().slice(0,160),outline:getComputedStyle(document.activeElement).outlineStyle,width:getComputedStyle(document.activeElement).outlineWidth},alerts:[...document.querySelectorAll('[role="alert"],[role="status"]')].filter(e=>e.checkVisibility()).map(e=>e.textContent),controls:[...document.querySelectorAll('button')].filter(e=>e.checkVisibility()&&/Publish (?:schedule|current schedule)|Generate Schedule|Refresh Schedule|Confirm Clear|Import Setup|Export Complete/.test(e.textContent)).map(e=>({text:e.textContent.trim(),height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width,disabled:e.disabled}))})`);
 observations.push(value); fs.writeFileSync(path.join(out,'browser-measurements-RESULT.json'),JSON.stringify(observations,null,2));
 if(value.scroll>value.client) throw Error('Horizontal overflow '+label);
 if(value.controls.some(c=>c.height<43.5)) throw Error('Small primary target '+label);
}
async function navigate(port) { await send('Page.navigate',{url:`http://127.0.0.1:${port}/`}); await until(has('My Schedule')); }
async function fresh(port,label) {
 await send('Page.navigate',{url:'about:blank'}); await send('Storage.clearDataForOrigin',{origin:`http://127.0.0.1:${port}`,storageTypes:'all'}); await navigate(port);
 await ev(fs.readFileSync('/tmp/dayframe-9292-seed-build-RESULT/canonical-seed-RESULT.js','utf8'));
 const identity=await ev(`seedPublication9292(${JSON.stringify(label)})`); await navigate(port); return identity;
}
async function review() { await click('Review Plan'); await until(has('Generate Schedule')); await click('Generate Schedule'); await until(`[...document.querySelectorAll('button')].some(e=>/^Publish (schedule|current schedule)/.test(e.textContent)&&!e.disabled)`); }
async function publish() { await ev(`[...document.querySelectorAll('button')].find(e=>/^Publish (schedule|current schedule)/.test(e.textContent)).click()`); await until(has('Schedule published. This immutable')); }
async function history() { return ev(`new Promise((resolve,reject)=>{const r=indexedDB.open('dayframe-durable-v1');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result;const tx=db.transaction(['historicalPlanBatches','historicalPlanDays'],'readonly');const a=tx.objectStore('historicalPlanBatches').getAll(),b=tx.objectStore('historicalPlanDays').getAll();tx.oncomplete=()=>{db.close();resolve({batches:a.result,days:b.result})};tx.onabort=()=>reject(tx.error)}})`); }
const retain=(name,value)=>fs.writeFileSync(path.join(out,name+'-RESULT.json'),JSON.stringify(value,null,2));
if (!process.argv.includes('--mobile-only')) {
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
checks.sourceIdentity=await fresh(4970,'Native publication source'); await review(); await publish();
checks.nativePublished=await history(); if(checks.nativePublished.batches.length!==1) throw Error('publication missing');
retain('source-history',checks.nativePublished); await measure('390-native-publication'); await screenshot('390-native-publication');
const backup=await download('source-native-export');
checks.destinationIdentity=await fresh(4971,'Distinct destination');
await upload(path.join(out,'source-native-export-RESULT.json')); await until(has('Complete backup restored across setup'));
const restored=await download('destination-native-reexport');
if(JSON.stringify(backup.data)!==JSON.stringify(restored.data)) throw Error('exact V14 data mismatch');
await navigate(4971); const reloaded=await download('destination-reload-export');
if(JSON.stringify(backup.data)!==JSON.stringify(reloaded.data)) throw Error('reload data mismatch');
checks.exactV14RoundTrip=true; checks.restoredHistory=await history();
if(JSON.stringify(checks.restoredHistory)!==JSON.stringify(checks.nativePublished)) throw Error('physical history mismatch');
// New lawful review after successful restore; change saved Work through canonical command,
// then use the actual Generate and Publish controls to create another historical revision.
await ev(`(()=>{function store(){for(const e of document.querySelectorAll('*')){const k=Object.keys(e).find(k=>k.startsWith('__reactFiber$'));let f=e[k];while(f){let h=f.memoizedState;while(h){if(h.memoizedState?.current?.publishScheduleRange)return h.memoizedState.current;h=h.next}f=f.return}}throw Error('app store missing')}globalThis.qaStore=store();const s=qaStore.getState();qaStore.setShiftDefinitions(s.shiftDefinitions.map(x=>({...x,name:x.name+' revised'})));})()`);
await review(); await publish(); checks.freshAfterRestore=await history(); if(checks.freshAfterRestore.batches.length!==2) throw Error('fresh publication missing');
retain('after-replacement-publication',checks.freshAfterRestore);
await settings(); await click('Clear Local Data'); await click('Confirm Clear Local Data'); await until(has('Local DayFrame setup data cleared'));
checks.afterClear=await history(); if(checks.afterClear.batches.length||checks.afterClear.days.length) throw Error('clear incomplete');
await navigate(4971); checks.afterClearReload=await history(); if(JSON.stringify(checks.afterClear)!==JSON.stringify(checks.afterClearReload)) throw Error('clear reload mismatch');
retain('clear-reload-history',checks.afterClearReload);
retain('browser-checks',checks);
console.log('NATIVE_CORE_PASS');
}
await mobileChecks();
ws.close();

async function appStore() {
 await ev(`(()=>{for(const e of document.querySelectorAll('*')){const k=Object.keys(e).find(k=>k.startsWith('__reactFiber$'));let f=e[k];while(f){let h=f.memoizedState;while(h){if(h.memoizedState?.current?.publishScheduleRange){globalThis.qaStore=h.memoizedState.current;return}h=h.next}f=f.return}}throw Error('app store missing')})()`);
}
async function widths(label) {
 for(const width of [320,390,768,1280]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:width===320?568:844,deviceScaleFactor:1,mobile:false}); await pause();
  await measure(`${width}-${label}`);
  if(width===320||width===390) {
   await ev(`(()=>{const x=[...document.querySelectorAll('[role="alert"],[role="status"]')].find(e=>e.checkVisibility()&&/not started|pending persistence|protected|could not be confirmed/.test(e.textContent));x?.scrollIntoView({block:'center'})})()`);
   await screenshot(`${width}-${label}`);
  }
 }
}
async function mobileChecks() {
 await navigate(4971); await upload(path.join(out,'source-native-export-RESULT.json')); await until(has('Complete backup restored across setup'));
 await appStore();
 await ev(`(()=>{const s=qaStore.getState();qaStore.setShiftDefinitions(s.shiftDefinitions.map(x=>({...x,name:x.name+' native busy'})))})()`);
 await review();
 await click('Goals'); await until(`[...document.querySelectorAll('button')].some(e=>e.textContent.trim().startsWith('Native publication source Goal'))`); await clickMatch('Native publication source Goal'); await click('Edit Goal'); await input('Goal title','Native retained Goal draft'); await click('Review Plan');
 // Controlled native event-delivery seam: the native write commits, but its completion
 // callback/receipt is held. No successful mutation or publication is fabricated.
 await ev(`(()=>{const original=IDBDatabase.prototype.transaction;globalThis.qaNativeEnded=false;globalThis.qaPhysicalCreated=0;let armed=true;IDBDatabase.prototype.transaction=function(stores,mode,...rest){const tx=original.call(this,stores,mode,...rest);const names=typeof stores==='string'?[stores]:Array.from(stores);if(armed&&mode==='readwrite'&&names.includes('historicalPlanBatches')){armed=false;qaPhysicalCreated++;Object.defineProperty(tx,'oncomplete',{configurable:true,set(fn){tx.addEventListener('complete',event=>{qaNativeEnded=true;globalThis.qaReleasePublication=()=>fn.call(tx,event)})},get(){return null}})}return tx};globalThis.qaRestoreTransactions=()=>{IDBDatabase.prototype.transaction=original}})()`);
 const before=await ev('qaStore.getState()');
 await ev(`[...document.querySelectorAll('button')].find(e=>/^Publish (schedule|current schedule)/.test(e.textContent)).click()`);
 await until('qaNativeEnded');
 await settings(); await click('Clear Local Data'); await click('Confirm Clear Local Data'); await until(has('Clear was not started'));
 if(JSON.stringify(before)!==JSON.stringify(await ev('qaStore.getState()'))) throw Error('busy clear changed runtime');
 await widths('controlled-native-terminal-busy-clear');
 await upload(path.join(out,'source-native-export-RESULT.json')); await until(has('Backup restore was not started'));
 if(JSON.stringify(before)!==JSON.stringify(await ev('qaStore.getState()'))) throw Error('busy restore changed runtime');
 await widths('controlled-native-terminal-busy-restore');
 await click('Goals'); await until(`document.querySelector('input[aria-label="Goal title"]') || [...document.querySelectorAll('label')].some(e=>e.textContent.includes('Goal title'))`);
 checks.nativeGoalDraftRetained=await ev(`[...document.querySelectorAll('input')].some(e=>e.value==='Native retained Goal draft')`);
 if(!checks.nativeGoalDraftRetained) throw Error('busy replacement displaced Goal draft');
 await click('Review Plan'); await settings();
 checks.nativeBusyPhysicalTransactions=await ev('qaPhysicalCreated');
 await ev('qaRestoreTransactions();qaReleasePublication()'); await until(`qaStore.getLastHistoricalPlanPublicationResult()?.status === 'publishedAndDurable'`);
 checks.nativeBusySettledHistory=await history(); if(checks.nativeBusySettledHistory.batches.length!==2) throw Error('held native publication did not settle exactly once');
 // A new explicit clear and confirmation is the retry; no automatic destructive action.
 await click('Clear Local Data'); await click('Confirm Clear Local Data'); await until(has('Local DayFrame setup data cleared'));
 checks.nativeBusyRetryClear=await history(); if(checks.nativeBusyRetryClear.batches.length) throw Error('busy retry did not clear');
 await navigate(4971); checks.nativeBusyRetryReload=await history(); if(checks.nativeBusyRetryReload.batches.length) throw Error('late repopulation');
 await upload(path.join(out,'source-native-export-RESULT.json')); await until(has('Complete backup restored across setup')); await review(); await appStore();
 await ev('globalThis.qaOriginalPublish=qaStore.publishScheduleRange');
 for(const reason of ['pendingPublication','historicalPlanProtected','commitStateUncertain','contextReplaced']) {
  // Explicit consumer-result seam for presentation only. Owner behavior is proved by permanent tests.
  await ev(`qaStore.publishScheduleRange=async()=>({status:'rejected',reason:${JSON.stringify(reason)}})`);
  await click('Goals'); await click('Review Plan');
  await until(`[...document.querySelectorAll('button')].some(e=>/^Publish (schedule|current schedule)/.test(e.textContent)&&!e.disabled)`);
  await ev(`[...document.querySelectorAll('button')].find(e=>/^Publish (schedule|current schedule)/.test(e.textContent)).click()`);
  await until(has(reason==='pendingPublication'?'pending persistence':reason==='historicalPlanProtected'?'Saved plan history is protected':reason==='commitStateUncertain'?'could not be confirmed':'The schedule context changed'));
  await widths(`controlled-consumer-${reason}`);
 }
 await ev('qaStore.publishScheduleRange=qaOriginalPublish');
 await send('Emulation.setDeviceMetricsOverride',{width:320,height:420,deviceScaleFactor:1,mobile:false});
 await ev(`[...document.querySelectorAll('button')].find(e=>/^Publish (schedule|current schedule)/.test(e.textContent)).focus()`);
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await measure('320-reduced-height-keyboard-reflow'); await screenshot('320-reduced-height-keyboard-reflow');
 checks.browserVersion=await send('Browser.getVersion');checks.nativeErrors=nativeErrors;
 retain('browser-checks',checks); console.log('NATIVE_MOBILE_PASS');
}
