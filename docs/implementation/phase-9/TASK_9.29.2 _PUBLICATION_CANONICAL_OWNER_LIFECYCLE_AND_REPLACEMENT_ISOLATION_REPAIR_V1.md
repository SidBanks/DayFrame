# Task 9.29.2 — Publication Canonical Owner Lifecycle & Replacement Isolation Repair V1

**Status:** READY — BOUNDED FOUNDATION IMPLEMENTATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Publication Lifecycle, Physical-Write Admission, Replacement Coordination, and Existing-Consumer Safety Repair
**System:** DayFrame
**Parent Task:** Task 9.29 — Planner / Review Schedule Workflow Convergence V1 — PARTIAL/BLOCKED
**Prerequisite:** Task 9.29.1 resolution proposal and accompanying contract accepted in the architectural review
**Implementation Authority:** Accepted publication-isolation contract plus the explicit queue-admission clarification
**Persistence-Format / Schema / Migration / Dependency Authority:** NONE
**New Review Layout / Navigation Authority:** NONE
**New Recovery / Historical-Correction Authority:** NONE
**Capability Retirement / Module Removal Authority:** NONE

---

## 1. Objective

Implement the accepted Publication Lifecycle & Replacement Isolation Contract V1.

Prevent publication work originating before a successful clear or restore from later:

- Writing displaced HistoricalPlan batches.
- Reinstalling old metadata or pending overlays.
- Reopening readiness or replacing current protection.
- Flushing displaced retry state.
- Reporting success as though it belongs to the replacement context.

Preserve publication identity, time, complete-day atomicity, exact historical evidence, supported legacy behavior, commit certainty, and the existing restore/recovery protocol.

This is the prerequisite owner repair. It does not implement or complete Task 9.29’s Review Schedule interface convergence.

---

## 2. Architectural Acceptance and Task Identity

Before application changes, create a separate acceptance ADR:

`docs/adr/ADR_PUBLICATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_V1_RESULT.md`

It must identify:

- The exact proposed contract path and SHA-256.
- Task 9.29’s blocked RESULT and demonstrated orderings.
- Task 9.29.1’s RESULT.
- Acceptance for this bounded implementation.
- The guarantee boundary and no-migration decision.
- The queue-admission clarification below.
- Implementation status as pending until this task’s reviewed RESULT.

Preserve the original PROPOSED contract, task inputs, earlier ADRs, RESULTs, and diagnostics unchanged.

### Accepted queue-admission clarification

Healthy current-origin publication calls may join the supported serial queue while another healthy publication executes.

Only the executing queue head owns the settlement lease and excludes replacement.

Do not interpret ordinary in-flight publication as a blanket busy rejection of later supported publication submissions.

Active replacement, displaced origin, protection, and unconfirmed physical settlement retain the contract’s specified restrictions.

Test a second submission arriving after the first physical transaction starts.

Confirm no conflicting executed Task 9.29.2 exists. Do not overwrite or silently renumber a conflict.

Verify this immutable execution input contains Sections 1–18 and the final completion statement.

---

## 3. Governing Inputs and Current Contract Map

Read actual repository copies of:

1. `PUBLICATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md`, in full.
2. Task 9.29.1 RESULT and retained writer inventory, source hashes, diagnostic copies, and observations.
3. Task 9.29 input, blocked RESULT, and exact original reproductions.
4. Accepted Structure owner-safety ADR and Task 9.27.2 RESULT/tests.
5. HistoricalPlan/day-publication architecture and relevant surface/persistence contracts.
6. Tasks 9.7, 9.9, and applicable first-class Sleep publication RESULTs.
7. Cross-storage restore ADRs/amendments and Task 9.26 recovery-readiness evidence.
8. Durable compatibility/versioning and End-State Compatibility & Retirement specifications.
9. Relevant current Review, Utilities, Goal-context, and restore regressions.

Record the actual current writer/installer/result-consumer map.

Include publication dispatch, owner queues, legacy publish/retry, initialization, protection capture/recheck, metadata reads, direct clear, controller begin, restore/rollback/recovery, and current UI result handling.

Use current code for executable contracts and the acceptance ADR for the authorized changes.

Do not repeat a general architecture audit or treat illustrative signature spelling as more authoritative than the accepted semantics.

---

## 4. Baseline and Forensic Protection

Before modifying application files:

- Record HEAD and exact working-tree status.
- Inspect applicable repository instructions.
- Capture task-relative hashes and preservation evidence.
- Measure current tests and production bundle.
- Pin the governing source versions.

Task 9.29.1 reported 242 status entries and 1,233 baseline files. Capture the actual current baseline rather than assuming those counts remain exact.

Preserve unrelated dirty work and every historical input, RESULT, ADR, diagnostic, and retained observation.

Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable fixtures, storage factories, browser profiles, databases, and origins.

Retain the original defect-confirming diagnostics. Derive new permanent repaired-behavior tests rather than overwriting historical observations or presenting their old assertions as safety tests.

---

## 5. Authorized Implementation Scope

Implement the contract through the existing equivalents of:

- `dayFrameStore`: synchronous origin capture, composition, clear, and last-result handling.
- `schedulePublication`: original source/origin propagation and result mapping.
- `historicalPlanSurface`: publication, queue, lease, retry, initialization, protection, and installation.
- Collection storage interface and IndexedDB adapter: physical admission and terminal receipt.
- Runtime authority transaction: combined quiescence and admission closure before snapshots.
- Restore composition/coordinator: existing private capabilities and result mappings.
- Runtime-only publication/readiness/result types.
- Current Review and Utilities feedback for the new distinctions.

Small focused helpers are permitted within these owners.

Do not create another publication owner, database, journal, recovery engine, global lock, or durable operation ledger.

Preserve unrelated storage callers and Structure’s accepted temporal/command rules. Shared adapter changes must remain backward-compatible for callers not using the new optional lifecycle observation.

Runtime admission and outcome additions expressly defined by the accepted contract are authorized. New persisted policy or serialization is not.

---

## 6. Origin Capture and Lifetime Identity

Capture publication origin synchronously before the public command’s first await, including lazy import.

Retain:

- Owner-instance identity.
- Opaque operation identity.
- Runtime authority epoch.
- HistoricalPlan owner generation.
- Frozen requested range, reviewed source witness, and requested publication time.

Pass the same origin through preparation, materialization, queue, owner execution, and result projection.

Factory-level publication and explicit retry capture at their own synchronous entry when no valid upstream origin is supplied.

Never recapture an old continuation into a new lifetime.

Revalidate after awaited preparation/source operations and before materialization. A displaced origin rejects before using replacement content.

Owner installation, clear, authorized abandonment, and abort restoration invalidate generations as specified. Epochs/generations never roll backward with restored snapshots.

Content equality or reused source/batch IDs do not establish lifetime equality.

Coordination objects, counters, receipts, and capabilities remain process-local and excluded from snapshots, backups, staging, journals, and stored rows.

---

## 7. Serial Queue and Settlement Lease

Preserve the supported serial publication queue, ordered by submission to that queue.

Waiting entries retain immutable origin and candidate but hold no replacement exclusion and install no pending overlay.

At queue head, synchronously validate admission/origin and acquire the single settlement lease before asynchronous owner validation, deduplication, collection reads, or storage opening.

Hold it through:

- Owner checks.
- Physical transaction terminal state.
- Verification.
- Metadata/pending/protection disposition.
- Owner result recording and synchronous settlement notifications.

Then release under the contract’s physical and owner-settlement conditions.

Do not replace queueing with Structure’s single-unresolved-command rejection model.

A queued old operation checks lifetime before deduplication, including when replacement restored equivalent content.

Queue rejection or exceptions must not poison later lawful entries.

### Original race outcomes

The original pre-real-mutation gate is now inside the lease.

For both clear and V14 restore:

1. Initial replacement attempt returns busy before snapshots/staging/writes.
2. Release publication and let it settle.
3. Explicitly retry replacement.
4. Confirm the replacement target survives restart without late repopulation.

Separately test replacement winning before the publication obtains its lease; that old publication must reject without writing.

No automatic destructive retry is authorized.

---

## 8. Physical Admission and Native Terminal Receipt

Supply the existing post-open synchronous storage-admission callback.

It must check the exact operation/lease, owner instance, epoch/generation, admission/protection, open-attempt state, and original source witness where applicable.

There must be no intervening await, timer, or user callback between successful admission and transaction creation/request enqueueing.

Keep admission attached through wrappers and delayed database opening.

Add the accepted optional internal transaction-lifecycle observer/receipt:

- Register synchronously when the native transaction and terminal handlers exist, before enqueueing.
- Keep the internal observer nonthrowing.
- Observe native completion/abort.
- Do not treat an individual request error or transaction error notification alone as terminal settlement.
- On enqueue exception, abort and observe terminal settlement before declaring the attempt finished.

### Lost or thrown acknowledgment

Close the attempt’s admission flag.

If no transaction receipt exists, the closed callback must prevent later delayed delegation from starting a transaction.

If a transaction started, retain exclusion until its terminal state is observed.

Settlement must continue safely even when outward acknowledgment is lost.

Do not unconditionally release in a catch/finally while a physical transaction remains live.

No timeout or database-close request establishes cancellation.

If terminal state never arrives, preserve the fence and truthful unconfirmed/protected feedback. Do not authorize in-process replacement by assumption.

---

## 9. Commit Certainty, Deduplication, and Result Receipts

Keep physical termination, source validity, lifetime validity, and durable verification separate.

Preserve existing outcomes for:

- Source/validation rejection.
- Known atomic failure before commit.
- Verified durable publication.
- Durable identical/no-op.
- Verification failure after acknowledged commit.
- Commit state uncertain.
- Unexpected unconfirmed result.
- Protected or recovery-required state.

Implement the accepted runtime additions consistently:

- Displaced origin → `contextReplaced`.
- New ordinary call during active replacement → `publicationBusy`.
- Pending-only semantic duplicate → owner `identicalPending`, public `pendingPublication`.
- Settled protected HistoricalPlan → structured protected replacement denial, not permanent busy.

Do not report pending overlays as already durably published.

Atomic publication failure does not acquire legacy pending acceptance merely for convenience.

A terminal receipt does not replace complete metadata/day verification or justify upgrading an uncertain result to success.

After uncertainty has terminally settled and protection/evidence capture is settled, release the active lease while retaining protected admission.

A genuinely live write remains busy for replacement.

Every completion carries the accepted opaque runtime receipt. Record the store’s last-result slot while settlement belongs to the current lease/context.

Late outer delivery cannot overwrite current feedback or refresh replacement context as a success.

Handle new cases exhaustively in current consumers; do not rely on a generic unknown-failure branch.

---

## 10. Legacy Pending Work, Initialization, Reads, and Protection

Retain the supported factory-level legacy `publish(batch)` path.

After known failure, preserve exact accepted pending batch identity, timestamp, range, frozen days, and order.

Explicit retry:

- Captures new origin for the currently authoritative pending record.
- Joins the existing queue.
- Obtains the lease.
- Writes that exact accepted record.
- Does not rematerialize, allocate another identity/time, or validate old accepted intent against today’s setup.

An uncertain or possibly committed attempt remains protected evidence, not ordinary retryable pending data.

Initialization-triggered flush binds to its initialization lifetime and joins the queue only after metadata initialization resolves. Avoid recursive queue/initialization waits.

Generation-scope initialization promises, metadata reloads, reads that can protect, protection capture/recheck, and deferred notifications.

Recheck after awaits before changing metadata, pending state, protection, readiness, notifications, or retry scheduling.

Stale reads return explicit unavailable/context-replaced information, not valid empty history.

Protection capture also binds to its exact protection instance.

Successful replacement removes displaced pending work. Abort restoration may restore its captured data under a new lifetime, but old queued retry closures still reject.

Recheck/export do not become new authority to reopen ready or repair data.

---

## 11. Replacement and Coordinator Composition

At every relevant controller begin route, combine Structure and HistoricalPlan quiescence before snapshot capture or staging.

- Active publication or Structure work → busy without epoch advancement, snapshot, staging, or writes.
- Quiescent protected HistoricalPlan → structured protected denial for ordinary replacement.
- Ready → synchronously close ordinary admission and advance the transaction epoch before any snapshot participant callback can reenter authoring.

Snapshot failure retains the attempted-begin invalidation; it must not restore old operation lifetimes.

Do not begin a transaction and then asynchronously drain publication behind closed admission.

Cover:

- Modern complete restore, including V14.
- Full clear.
- Internal replacement and exposed controller begin.
- Restore rollback.
- Startup journal recovery.
- Attached direct HistoricalPlan clear.
- Standalone factory clear within its narrower local guarantee.
- Existing explicitly authorized protected abandonment.

Coordinator writes/installations use private capabilities and matching epochs, not ordinary inactive-transaction admission.

Existing authorized recovery may bypass ordinary protected readiness only under its existing evidence/source-recheck authority. It never bypasses physical quiescence.

Do not add a permissive recovery bypass where no supported command exists.

Preserve journal stages, staging verification, combined IndexedDB replacement, localStorage handling, source checks, anti-resurrection, rollback, runtime translation, and finalization.

Full clear retains its existing cleared/partial/failed semantics. Do not claim it has become atomic or journaled.

---

## 12. Current-Surface Feedback and Context

Update only affected current Review and Utilities feedback.

Users must distinguish:

- Publication still finishing; replacement was not started.
- Context changed; the old publication was rejected.
- Matching publication is pending rather than durable.
- Publication succeeded or was already durable.
- History was written but verification failed.
- Commit outcome remains uncertain.
- Physical work ended but protected history still prevents ordinary replacement.

No blind retry, silent resubmission, automatic clear/import retry, or false “nothing changed” message.

Preserve valid Goal, Requested Time, Structure, Measurement, Observation, and Setup drafts on busy or pre-mutation rejection.

A busy replacement does not invalidate legitimate current publication intent.

Successful replacement invalidates displaced feedback/results/continuations. An aborted begun transaction may invalidate tokens while preserving appropriate drafts and accepted data.

Profile loading retains its existing independent scope and source-freshness effects.

Do not save/rebase drafts as part of publication or replacement.

Keep Planner/Summary navigation and the existing Review layout intact. This task does not deliver the new Build this Schedule workflow layout, new recovery controls, or Task 9.29’s broader navigation convergence.

---

## 13. Permanent Regression Matrix

Implement all twenty numbered cases and the additional subassertions in accepted contract §10.

Retain their selected phase-dependent outcomes—not assertions accepting whichever of busy, rejection, or success occurs.

Required groups include:

- Ordinary publication and verified durable no-op.
- Replacement winning during lazy dispatch or Review preparation.
- Replacement denied while owner checks/database opening, physical transaction, verification, or settlement remain leased.
- Queued B invalidated by replacement after A settles.
- Equivalent concurrent publications producing exactly one durable batch.
- A healthy B submitted after A’s physical transaction starts remaining queued, not rejected merely because A executes.
- Known abort, atomic failure without overlay, and exact legacy retry.
- Postcommit verification failure versus lost acknowledgment with a live terminal receipt.
- Both original clear/V14 delayed-write reproductions: busy first, explicit replacement retry later.
- Identical-content restoration not renewing old intent.
- Snapshot failure, abort, rollback, and recovery-required lifetimes.
- Stale initialization, protection capture, notification, metadata, and retry exclusion.
- Fresh explicitly initiated publication after replacement.
- Combined Structure/publication quiescence.
- Restart preserving the intended replacement target.

Additional mandatory adapter/owner assertions:

- Receipt registration precedes enqueue failure.
- Request error is not terminal abort.
- Closed admission rejects delegation arriving after a wrapper throws before starting storage.
- A started transaction remains fenced after outward failure.
- Protected settlement releases busy status only when legally settled.
- Pending-only duplicate never reports durable success.
- No initialization/flush deadlock or poisoned queue.
- Private coordinator capabilities cannot be used as public clear/recovery bypasses.
- Exact abort-restored pending data requires fresh explicit retry.

Count attempted adapter calls and created physical transactions separately.

Use deterministic deferred operations and actual store/adapter integration. Independently reopen storage only after the relevant settlement/replacement to verify exact authority.

Run existing publication, materializer, Sleep, Structure-safety, restore, clear, Goal-context, Progress, and supported-backup suites.

Do not weaken old semantic assertions or alter historical diagnostic artifacts.

---

## 14. Native Production and Mobile Acceptance Gate

Use the production build and disposable state.

Required actual workflows:

1. Ordinary publication through the existing UI, followed by verified historical readback.
2. UI V14 export, distinct-destination import, re-export, reload, and exact authority comparison.
3. Explicit full clear, durable readback, and reload without displaced history.
4. Fresh lawful publication after an admitted replacement and new review.
5. Rejected/busy replacement retaining appropriate authority and drafts.

Validate affected current controls and feedback at:

```text
320px
390px
768px
1280px
```

Include busy, pending, protected, and unconfirmed outcome presentation using the repaired owner paths or clearly identified controlled seams.

Where deterministic delay/fault injection supplies a case, label it. Do not call it spontaneous native-browser failure or claim an ordinary import proves concurrent isolation.

Supporting canonical seeding is permitted. It must not substitute for publication, import/export, or clear actions being certified.

Require:

- No unintended document horizontal overflow.
- Practical approximately 44 CSS px primary hit targets.
- Reachable actionable feedback.
- Visible keyboard focus and sensible restoration.
- Semantic controls/headings and associated errors.
- Non-color-only states.
- Reduced-height and reflow usability.
- No required hover, double-click, right-click, or dragging.
- Equivalent underlying admission/settlement semantics across widths.

Do not clip feedback or hide overflow to pass.

Retain exact IDs, timestamps, revisions, optional absence, ordered data, and frozen Work/Sleep/Goal evidence in comparisons. Document only legitimate export-metadata or contractually unordered-collection differences.

No physical-device, OS-dialog, soft-keyboard, screen-reader, or browser-native-zoom certification without actual execution.

This certifies affected existing surfaces, not the unimplemented 9.29 layout.

---

## 15. Validation and Bundle Gate

Task 9.29.1 reported:

| Measure | Historical value |
|---|---:|
| Test files / tests | 163 / 1,683 |
| Initial raw JavaScript | 626,896 bytes |
| Initial gzip JavaScript | 164,266 bytes |
| Largest lazy chunk | 62,657 bytes |
| Total JavaScript | 1,271,716 bytes |
| Initial-gzip headroom | 5,734 bytes |

Its final full run passed with one worker. Its earlier default-worker run had four failures across two UI suites; no cause was established.

Measure actual current before/after values.

Run the final full suite without concurrent build/static jobs. A documented worker bound is permitted; do not reduce test selection.

Run repository equivalents of:

```text
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm run test -- --maxWorkers=1
npm run build
npm run check:bundle
git diff --check
```

Record exact commands, selected suites, intermediate failures, and resolutions.

Do not weaken assertions, existing timeouts, configuration, or test coverage to obtain a pass. Do not silently absorb unrelated test-reliability work into this repair.

Preserve hard limits:

- Initial gzip ≤170,000 bytes.
- Initial raw ≤685,000 bytes.
- Largest lazy chunk ≤100,000 bytes.
- All other current repository hard gates.

Preserve lazy boundaries and report all existing advisories and task deltas.

No threshold increase, dependency installation, or unrelated bundle restructuring.

Format only task-created/touched files as necessary.

---

## 16. Non-Goals and Stop Conditions

Do not implement:

- New Review navigation/layout or a third primary destination.
- A new publication, recovery, storage, or locking authority.
- Cross-tab/multiple-writer coordination.
- Publication-clock changes or Structure temporal-policy changes.
- Historical batch cleanup, correction, or inferred affected-data classification.
- New recovery/abandonment UI.
- New realization-retry eligibility or bulk decisions/corrections.
- Goal lifecycle, recurrence, scheduled-time release/replacement, or Found Time.
- Persisted operation tokens, schema/version changes, or migrations.
- Capability retirement or module removal.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when a mandatory outcome cannot be represented or proven through the accepted bounded evidence contract.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when implementation requires materially different ordering, broader recovery authority, incompatible serialization, weakened protection, or a new dependency.

The authorized runtime receipt/admission/result changes are not, by themselves, scope violations.

Do not simplify the repair to UI cancellation, an entry-time check, or an unconditional finally-release because the full contract is substantial.

Preserve useful partial work and identify any precise mandatory blocker. Do not declare COMPLETE while it remains unresolved.

---

## 17. RESULT, Retained Evidence, and Completion Criteria

Write a separate RESULT:

`docs/implementation/phase-9/TASK_9.29.2_PUBLICATION_CANONICAL_OWNER_LIFECYCLE_AND_REPLACEMENT_ISOLATION_REPAIR_V1_RESULT.md`

Retain compact evidence under:

`docs/implementation/phase-9/evidence/task-9.29.2/`

Additional reports, screenshots, measurements, exports, and QA artifacts must contain RESULT in their filenames. Application/test source retains repository conventions.

The RESULT must include:

1. Bounded outcome and acceptance-ADR reference.
2. Governing sources and task-relative baseline.
3. Final writer/installer/result-consumer inventory.
4. Origin, queue, lease, and healthy-queue clarification implementation.
5. Physical admission, terminal receipt, and exact release conditions.
6. Commit-certainty and pending-versus-durable result mapping.
7. Legacy retry/init/read/protection/notification handling.
8. Combined before-snapshot coordinator admission and private capabilities.
9. All twenty contract cases plus additional subassertions mapped to evidence.
10. Exact repaired clear/V14 orderings and restart results.
11. Current UI feedback, draft/context, native/mobile observations, and limits.
12. Full validation and before/after bundle metrics.
13. Every created/modified file and its purpose.
14. Schema, migration, dependency, compatibility, history, and forensic effects.
15. Remaining exclusions and original 9.29 resumption checklist.

Retain reproduction commands, fixture provenance, phase/transaction counts, exact authority comparisons, representative narrow-screen feedback, measurements, and material logs.

Distinguish repository-local evidence from commits or remote backups. Do not depend exclusively on `/tmp`.

Read back the actual RESULT and verify its filename, heading, determination, and final statement. Return the RESULT, not the READY input or original defect report.

COMPLETE requires implemented phase-selected behavior, no displaced write/adoption/flush, truthful settlement/protection, preserved supported data, all mandatory automated/native/mobile evidence, and unchanged hard gates.

Task 9.29 remains pending a separate authorized continuation after this repair’s RESULT is reviewed. Preserve its original blocked record and full workflow acceptance requirements.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.29.2 — Publication Canonical Owner Lifecycle & Replacement Isolation Repair V1 is COMPLETE. Task 9.29 workflow convergence remains pending explicit continuation and acceptance.**

or:

**Task 9.29.2 — Publication Canonical Owner Lifecycle & Replacement Isolation Repair V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when publication origin, queued intent, physical writes, verification, pending work, and replacement follow the accepted ordering so displaced operations cannot repopulate cleared or restored history—while preserving publication identity, commit certainty, supported data, existing recovery authority, and truthful current-surface feedback.**