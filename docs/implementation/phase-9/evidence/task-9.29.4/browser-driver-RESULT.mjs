import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
const out = path.resolve(
  "docs/implementation/phase-9/evidence/task-9.29.4",
);
const targets = await (await fetch("http://127.0.0.1:9344/json")).json();
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
const downloads = "/tmp/dayframe-9294-downloads-RESULT";
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
 const value = await ev(`({label:${JSON.stringify(label)},width:innerWidth,height:innerHeight,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,focus:{tag:document.activeElement.tagName,text:document.activeElement.textContent?.trim().slice(0,160),outline:getComputedStyle(document.activeElement).outlineStyle,width:getComputedStyle(document.activeElement).outlineWidth},alerts:[...document.querySelectorAll('[role="alert"],[role="status"]')].filter(e=>e.checkVisibility()).map(e=>e.textContent),controls:[...document.querySelectorAll('button')].filter(e=>e.checkVisibility()&&/Accept preferred|Retry scheduling|Publish (?:schedule|current schedule)|Generate Schedule|Refresh Schedule|Confirm Clear|Import Setup|Export Complete/.test(e.textContent)).map(e=>({text:e.textContent.trim(),height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width,disabled:e.disabled}))})`);
 observations.push(value); fs.writeFileSync(path.join(out,'browser-measurements-RESULT.json'),JSON.stringify(observations,null,2));
 if(value.scroll>value.client) throw Error('Horizontal overflow '+label);
 if(value.controls.some(c=>c.height<43.5)) throw Error('Small primary target '+label);
}

// Only the documented unordered top-level fact collection is keyed. Nested payloads,
// every timestamp/revision/optional field, and all other collections stay exact.
const backupData = (data) => { const copy=structuredClone(data); copy.realizations.facts.sort((a,b)=>a.id.localeCompare(b.id)); return JSON.stringify(copy); };
const retain=(name,value)=>fs.writeFileSync(path.join(out,name+'-RESULT.json'),JSON.stringify(value,null,2));
async function navigate(port) { await send('Page.navigate',{url:`http://127.0.0.1:${port}/`}); await until(has('My Schedule')); }
async function appStore() {
 await ev(`(()=>{for(const e of document.querySelectorAll('*')){const k=Object.keys(e).find(k=>k.startsWith('__reactFiber$'));let f=e[k];while(f){let h=f.memoizedState;while(h){if(h.memoizedState?.current?.acceptProposalOption){globalThis.qaStore=h.memoizedState.current;return}h=h.next}f=f.return}}throw Error('app store missing')})()`);
}
async function fresh(port,label) {
 await send('Page.navigate',{url:'about:blank'});
 await send('Storage.clearDataForOrigin',{origin:`http://127.0.0.1:${port}`,storageTypes:'all'});
 await navigate(port);
 await ev(fs.readFileSync('/tmp/dayframe-9294-seed-build-RESULT/canonical-seed-RESULT.js','utf8'));
 const identity=await ev(`seedAcceptance9294(${JSON.stringify(label)})`);
 await navigate(port); await appStore(); return identity;
}
async function review() { await click('Review Plan'); await until(has('Generate Schedule')); await click('Generate Schedule'); await until(has('Accept preferred option')); }
async function physical() { return ev(`new Promise((resolve,reject)=>{const r=indexedDB.open('dayframe-durable-v1');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result;const stores=['proposalAuthority','realizationAuthority','historicalPlanBatches','historicalPlanDays','executionHistory','progressObservations'];const names=stores.filter(x=>db.objectStoreNames.contains(x));const tx=db.transaction(names,'readonly'),reads=Object.fromEntries(names.map(x=>[x,tx.objectStore(x).getAll()]));tx.oncomplete=()=>{db.close();resolve(Object.fromEntries(names.map(x=>[x,reads[x].result])))};tx.onabort=()=>reject(tx.error)}})`); }
async function widths(label) {
 for(const width of [320,390,768,1280]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:width===320?568:844,deviceScaleFactor:1,mobile:false}); await pause();
  await measure(`${width}-${label}`);
  if(width===320||width===390) { await ev(`document.querySelector('[role="status"]')?.scrollIntoView({block:'center'})`); await screenshot(`${width}-${label}`); }
 }
}
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});
checks.seed=await fresh(4974,'Native full footprint'); await review();
const before=await physical(); retain('source-before-acceptance',before);
const unacceptedBackup=await download('source-undecided-export');
await click('Accept preferred option'); await until(has('Decision recorded. Accepted work is scheduled'));
checks.accepted=await physical();
if(checks.accepted.realizationAuthority.length!==4) throw Error('complete set missing');
if(checks.accepted.proposalAuthority.filter(x=>x.recordType==='acceptedAllocation').length!==1) throw Error('acceptance missing');
const accepted=checks.accepted.proposalAuthority.find(x=>x.recordType==='acceptedAllocation');
for(const fact of checks.accepted.realizationAuthority.filter(x=>x.recordType==='realizedScheduleFact')) {
 const claim=accepted.claims.find(x=>x.id===fact.origin.acceptedClaimId);
 if(!claim||claim.startsAt!==fact.startsAt||claim.endsAt!==fact.endsAt||claim.userDayDate!==fact.userDayDate) throw Error('claim mismatch');
}
retain('native-automatic-authority',checks.accepted); await widths('native-automatic-success');
checks.alreadyRealized=await ev(`qaStore.realizeAcceptedAllocation(${JSON.stringify(accepted.id)})`);
if(checks.alreadyRealized.status!=='alreadyRealized'||JSON.stringify(await physical())!==JSON.stringify(checks.accepted)) throw Error('idempotence mismatch');
const backup=await download('source-native-export');
await fresh(4975,'Distinct destination');
await upload(path.join(out,'source-native-export-RESULT.json')); await until(has('Complete backup restored across setup'));
const restored=await download('destination-native-reexport');
if(backupData(backup.data)!==backupData(restored.data)) throw Error('exact V14 mismatch');
await navigate(4975); const reloaded=await download('destination-reload-export');
if(backupData(backup.data)!==backupData(reloaded.data)) throw Error('reload V14 mismatch');
checks.exactRoundTrip=true;
// Restore the actual undecided export, then native acceptance under a one-shot native abort.
await upload(path.join(out,'source-undecided-export-RESULT.json')); await until(has('Complete backup restored across setup')); await appStore(); await review();
await ev(`(()=>{const original=IDBDatabase.prototype.transaction;let armed=true;globalThis.qaAborts=0;IDBDatabase.prototype.transaction=function(stores,mode,...rest){const tx=original.call(this,stores,mode,...rest),names=typeof stores==='string'?[stores]:Array.from(stores);if(armed&&mode==='readwrite'&&names.includes('realizationAuthority')){armed=false;qaAborts++;queueMicrotask(()=>tx.abort())}return tx};globalThis.qaRestoreTransactions=()=>{IDBDatabase.prototype.transaction=original}})()`);
await click('Accept preferred option'); await until(has('Acceptance is saved, but scheduling has not completed'));
await ev('qaRestoreTransactions()'); checks.afterAbort=await physical();
if(checks.afterAbort.realizationAuthority.length) throw Error('abort left partial facts');
await widths('controlled-native-abort-retained-acceptance');
await click('Retry scheduling accepted work'); await until(has('Accepted work is scheduled.'));
checks.afterRetry=await physical();
if(checks.afterRetry.realizationAuthority.length!==4) throw Error('retry complete set missing');
const a=checks.afterAbort.proposalAuthority.filter(x=>x.recordType==='acceptedAllocation');
const b=checks.afterRetry.proposalAuthority.filter(x=>x.recordType==='acceptedAllocation');
if(JSON.stringify(a)!==JSON.stringify(b)) throw Error('retry reaccepted');
await widths('native-explicit-retry-success');
retain('native-retry-authority',checks.afterRetry);
await settings(); await click('Clear Local Data'); await click('Confirm Clear Local Data'); await until(has('Local DayFrame setup data cleared'));
await navigate(4975); checks.afterClearReload=await physical();
if(checks.afterClearReload.realizationAuthority.length||checks.afterClearReload.proposalAuthority.length) throw Error('resurrection after clear');
retain('native-clear-reload-authority',checks.afterClearReload);
checks.errors=nativeErrors;retain('browser-checks',checks);console.log('NATIVE_CORE_PASS');
await lifecycleFeedback();
ws.close();

async function lifecycleFeedback() {
 for(const target of ['proposalAuthority','realizationAuthority']) {
  await navigate(4975); await upload(path.join(out,'source-undecided-export-RESULT.json')); await until(has('Complete backup restored across setup')); await appStore(); await review();
  await click('Goals'); await until(`[...document.querySelectorAll('button')].some(e=>e.checkVisibility()&&e.textContent.trim().startsWith('Native full footprint'))`); await clickMatch('Native full footprint'); await click('Edit Goal'); await input('Goal title','Retained lifecycle draft'); await click('Review Plan');
  await ev(`(()=>{const original=IDBDatabase.prototype.transaction;globalThis.qaNativeEnded=false;globalThis.qaPhysicalCreated=0;let armed=true;IDBDatabase.prototype.transaction=function(stores,mode,...rest){const tx=original.call(this,stores,mode,...rest),names=typeof stores==='string'?[stores]:Array.from(stores);if(armed&&mode==='readwrite'&&names.includes(${JSON.stringify(target)})){armed=false;qaPhysicalCreated++;Object.defineProperty(tx,'oncomplete',{configurable:true,set(fn){tx.addEventListener('complete',event=>{qaNativeEnded=true;globalThis.qaReleaseNative=()=>fn.call(tx,event)})},get(){return null}})}return tx};globalThis.qaRestoreTransactions=()=>{IDBDatabase.prototype.transaction=original}})()`);
  await click('Accept preferred option'); await until('qaNativeEnded');
  const before=await ev('({setup:qaStore.getState(),proposals:qaStore.exportProposalAuthority(),realizations:qaStore.exportRealizationAuthority()})');
  await settings();await click('Clear Local Data');await click('Confirm Clear Local Data');await until(has('Clear was not started'));
  await widths('controlled-native-'+target+'-busy-clear');
  await upload(path.join(out,'source-undecided-export-RESULT.json'));await until(has('Backup restore was not started'));
  if(JSON.stringify(before)!==JSON.stringify(await ev('({setup:qaStore.getState(),proposals:qaStore.exportProposalAuthority(),realizations:qaStore.exportRealizationAuthority()})')))throw Error('busy replacement changed authority');
  await widths('controlled-native-'+target+'-busy-restore');
  await click('Goals');await until(`[...document.querySelectorAll('input')].some(e=>e.value==='Retained lifecycle draft')`);
  checks[target+'DraftRetained']=true;
  await ev('qaRestoreTransactions();qaReleaseNative()');await until('qaStore.listRealizedScheduleFacts().length===3');
  checks[target+'BusyCreated']=await ev('qaPhysicalCreated');
  await click('Review Plan'); await settings();await click('Clear Local Data');await click('Confirm Clear Local Data');await until(has('Local DayFrame setup data cleared'));
  await navigate(4975);const cleared=await physical();if(cleared.proposalAuthority.length||cleared.realizationAuthority.length)throw Error('late resurrection after busy retry');
 }
 for(const target of ['proposalAuthority','realizationAuthority']) {
  await navigate(4975);await upload(path.join(out,'source-undecided-export-RESULT.json'));await until(has('Complete backup restored across setup'));await appStore();await review();
  // Controlled delivery: a real native request succeeds and its transaction commits,
  // but one request acknowledgment is withheld. The native terminal receipt still runs.
  await ev(`(()=>{const original=IDBObjectStore.prototype.put;let armed=true;globalThis.qaAckHeld=false;IDBObjectStore.prototype.put=function(...args){const req=original.apply(this,args);if(armed&&this.name===${JSON.stringify(target)}){armed=false;Object.defineProperty(req,'onsuccess',{configurable:true,set(fn){req.addEventListener('success',event=>{qaAckHeld=true;globalThis.qaReleaseAck=()=>fn.call(req,event)})},get(){return null}})}return req};globalThis.qaRestorePut=()=>{IDBObjectStore.prototype.put=original}})()`);
  await click('Accept preferred option');await until(has('outcome is unconfirmed'));
  const protectedRows=await physical();retain('controlled-native-'+target+'-uncertain-authority',protectedRows);
  await widths('controlled-native-'+target+'-unconfirmed');
  if(target==='proposalAuthority'&&protectedRows.realizationAuthority.length)throw Error('unconfirmed acceptance auto-realized');
  await settings();await click('Clear Local Data');await click('Confirm Clear Local Data');await until(has('Clear was not started'));
  await widths('controlled-native-'+target+'-protected-clear');
  if(JSON.stringify(protectedRows)!==JSON.stringify(await physical()))throw Error('protected clear changed evidence');
  await ev('qaRestorePut();qaReleaseAck()');
  // Verified startup is the existing way to re-establish current authority; no in-session bypass.
  await navigate(4975);await appStore();checks[target+'UncertaintyReload']=await ev('({proposal:qaStore.getProposalIngressStatus(),realization:qaStore.getRealizationIngressStatus()})');
  await settings();await click('Clear Local Data');await click('Confirm Clear Local Data');await until(has('Local DayFrame setup data cleared'));
 }
 await navigate(4975);await upload(path.join(out,'source-undecided-export-RESULT.json'));await until(has('Complete backup restored across setup'));await review();
 await send('Emulation.setDeviceMetricsOverride',{width:320,height:420,deviceScaleFactor:1,mobile:false});
 await ev(`[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Accept preferred option').focus()`);
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await measure('320-reduced-height-keyboard');await screenshot('320-reduced-height-keyboard');
 checks.errors=nativeErrors;retain('browser-checks',checks);console.log('NATIVE_LIFECYCLE_MOBILE_PASS');
}
