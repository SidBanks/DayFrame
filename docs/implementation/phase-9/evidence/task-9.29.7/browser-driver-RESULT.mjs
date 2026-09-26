import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
const out = path.resolve(
  "docs/implementation/phase-9/evidence/task-9.29.7",
);
const attempt = process.argv[2];
if (!/^\d+$/.test(attempt ?? "")) throw Error("Numbered attempt required");
const run = path.join(out, `browser-attempt-${attempt}-RESULT`);
fs.mkdirSync(run); // refuse artifact overwrites
const targets = await (await fetch("http://127.0.0.1:9348/json")).json();
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
  try { fs.writeFileSync(path.join(run, 'native-timeout-diagnostic-RESULT.json'), JSON.stringify(await ev(`(async()=>({preview:qaStore.getState().preview,review:await qaStore.queryPlanningReview({reviewScope:{version:1,scopeType:'reviewScope',id:'diagnostic',kind:'custom',anchorUserDayDate:'2026-09-26',startUserDayDate:'2026-09-26',endUserDayDateExclusive:'2026-09-27',provenance:{source:'explicit'}},historyAsOf:new Date().toISOString()})}))()`), null, 2)); } catch {}
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
const downloads = "/tmp/dayframe-9297-downloads-RESULT";
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
 await ev(fs.readFileSync('/tmp/dayframe-9297-seed-build-RESULT/canonical-seed-RESULT.js','utf8'));
 const identity=await ev(`seedReview9297(${JSON.stringify(label)},${sleepCorrection})`);
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
async function freshQuery(){return ev(`qaStore.queryPlanningReview({reviewScope:{version:1,scopeType:'reviewScope',id:'native-range',kind:'custom',anchorUserDayDate:'2026-09-26',startUserDayDate:'2026-09-26',endUserDayDateExclusive:'2026-09-27',provenance:{source:'explicit'}},historyAsOf:new Date().toISOString()})`)}
async function publicPublish(hash){return ev(`qaStore.publishScheduleRange({publicationRange:{version:1,scopeType:'publicationRange',startUserDayDate:'2026-09-26',endUserDayDateExclusive:'2026-09-27',provenance:{source:'explicitPublication'}},expectedSourceFingerprint:${JSON.stringify(hash)},publishedAt:new Date().toISOString()})`)}

const assert=(c,m)=>{if(!c)throw Error(m)};
const exact=(a,b,m)=>assert(JSON.stringify(a)===JSON.stringify(b),m);
for (const width of [320,390,768,1280]) {
 await send('Emulation.setDeviceMetricsOverride',{width,height:width===320?568:844,deviceScaleFactor:1,mobile:false});
 const identity=await fresh(4980,`Omission ${width}`);await countWrites();
 await click('Goals');await clickMatch(`Omission ${width}`);await click('Edit Goal');await input('Goal title',`Retained draft ${width}`);
 await review();await click('Accept preferred option');await until(has('Decision recorded. Accepted work is scheduled'));
 await click('Refresh Schedule');
 await ev(`qaStore.setManualEvents([{id:'correction-premise',title:'Fixed appointment',userDayDate:'2026-09-26',allDay:false,startTime:'14:30',endTime:'15:30',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}])`);
 await click('Refresh Schedule');await until(has('Try:'));
 const before=await physical();retain(`${width}-before-correction`,before);const decisions=await ev('qaStore.getPlanDecisions()');
 await clickMatch('Try: Skip');await until(has('Apply Planning Change'));exact(await ev('qaStore.getPlanDecisions()'),decisions,'Try saved authority');
 await click('Discard Try and regenerate');await until(has('Try:'));exact(await ev('qaStore.getPlanDecisions()'),decisions,'Discard saved authority');
 await clickMatch('Try: Skip');await until(has('Apply Planning Change'));await measure(`${width}-try`);await screenshot(`${width}-try`);
 await click('Apply Planning Change');await until(has('Ready to publish'));
 const accepted=await ev('({decisions:qaStore.getPlanDecisions(),preview:qaStore.getState().preview})');
 assert(accepted.decisions.length===1&&accepted.decisions[0].kind==='omitOccurrence','exact omission decision');assert(!accepted.preview.isStale&&!accepted.preview.revisedAt,'handler fresh generation');
 for(const key of ['blockCandidates','scheduledBlocks','unplacedCandidates'])assert(!accepted.preview.result[key].some(x=>x.templateId==='routine'),'omission in '+key);
 assert(accepted.preview.result.omissionEvidence.occurrences.length===1,'single context');assert((await counts()).history===0,'prepublication history write');retain(`${width}-accepted-generation`,accepted);
 const reviewed=await freshQuery();retain(`${width}-qualified-review`,reviewed);assert(reviewed.publication.materialization.status==='eligible','dry materialization');
 await clickMatch('Build this Schedule:');await until(has('Schedule published.'));assert((await counts()).history===1,'exactly one publication');
 const after=await physical();retain(`${width}-durable-after`,after);for(const key of ['proposalAuthority','realizationAuthority','executionHistoryRecords','progressObservations'])exact(after[key],before[key],'unaffected '+key);
 const exported=await download(`${width}-published-export`);const entries=exported.data.historicalPlan.batches.flatMap(b=>b.days.flatMap(d=>d.occurrences));const omission=entries.filter(x=>x.plan.state==='omitted');assert(omission.length===1,'durable omission');
 exact(omission[0].reference,accepted.decisions[0].target,'exact target');exact(Object.keys(omission[0].plan),['state'],'no invented geometry');assert(entries.filter(x=>x.version===3).length===3,'three realized roles');assert(entries.filter(x=>x.version===4).length===1,'Sleep');assert(after.executionHistoryRecords.length>0&&after.progressObservations.length>0,'nonempty independent evidence');
 await measure(`${width}-published`);await screenshot(`${width}-published`);await clickMatch('Open built day:');await until(has('Day agenda'));await click('Back');await until(has('Review start date'));
 const focus=await ev('({text:document.activeElement.textContent,tag:document.activeElement.tagName})');await click('Goals');await until(`[...document.querySelectorAll('input')].some(e=>e.value===${JSON.stringify(`Retained draft ${width}`)})`);await click('Review Schedule');await until(has('Review start date'));
 checks[width]={identity,counts:await counts(),draftRetained:true,tryDiscardAccept:true,automaticFreshGeneration:true,omission,returnFocus:focus};
 if(width===320){await send('Emulation.setDeviceMetricsOverride',{width:320,height:420,deviceScaleFactor:1,mobile:false});await ev(`[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Refresh Schedule').focus()`);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await ev('document.activeElement.scrollIntoView({block:"center"})');await measure('320-reduced-height-focus');await screenshot('320-reduced-height-focus');const focus=observations.at(-1).focus;assert(focus.outline!=='none'&&parseFloat(focus.width)>0,'visible focus');}
 if(width===390){
  const destination=await fresh(4981,'Distinct destination');assert(destination.goalId!==identity.goalId,'distinct destination');await upload(path.join(run,'390-published-export-RESULT.json'));await until(has('Complete backup restored across setup'));await appStore();assert(await ev('qaStore.getState().preview===null'),'restore disposable preview');
  const restored=await download('destination-reexport');exact(backupData(restored.data),backupData(exported.data),'V14 exact authority');await navigate(4981);await appStore();assert(await ev('qaStore.getState().preview===null'),'reload disposable preview');const reloaded=await download('destination-reload-export');exact(backupData(reloaded.data),backupData(exported.data),'reload exact authority');
  await countWrites();await click('Review Schedule');await click('Generate Schedule');await until(has('Ready to publish'));assert(await ev('qaStore.getState().preview.result.omissionEvidence.occurrences.length===1'),'restored generation');await clickMatch('Build this Schedule:');await until(has('already'));assert((await counts()).history===0,'no-op history');const beforeRemoval=await physical();
  await ev(`(()=>{for(const s of document.querySelectorAll('summary'))if(/detail|result|choice/i.test(s.textContent))s.parentElement.open=true})()`);
  await until(`[...document.querySelectorAll('button')].some(b=>b.checkVisibility()&&b.getAttribute('aria-label')?.startsWith('Remove accepted choice'))`);await ev(`[...document.querySelectorAll('button')].find(b=>b.checkVisibility()&&b.getAttribute('aria-label')?.startsWith('Remove accepted choice')).click()`);await until(has('Accepted choice removed and saved.'));assert(await ev('qaStore.getPlanDecisions().length===0&&!qaStore.getState().preview.result.omissionEvidence'),'removal regeneration');
  const afterRemoval=await physical();for(const key of ['historicalPlanBatches','historicalPlanDays','executionHistoryRecords','progressObservations','realizationAuthority'])exact(afterRemoval[key],beforeRemoval[key],'removal preserves '+key);retain('destination-after-removal',afterRemoval);await measure('390-removed');await screenshot('390-removed');checks.roundTrip={distinctDestination:destination,exactAuthority:true,noPreviewAfterReload:true,freshRegeneration:true,noOpHistoryTransactions:0,removalPreservesHistoricalActualProgress:true};
 }
 retain('browser-checks',checks);
}
checks.nativeErrors=nativeErrors;retain('browser-checks',checks);assert(nativeErrors.length===0,'native errors');console.log('NATIVE_9297_PASS');ws.close();
