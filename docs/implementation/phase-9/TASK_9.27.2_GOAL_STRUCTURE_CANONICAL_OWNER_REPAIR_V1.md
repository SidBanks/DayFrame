# Task 9.27.2 — Goal Structure Canonical Owner Repair V1

**Status:** READY — BOUNDED FOUNDATION IMPLEMENTATION
**Phase:** Phase 9 — Product Convergence
**Task Type:** Canonical Temporal Qualification, Field-Fidelity, Mutation-Admission, and Planning-Freshness Repair
**System:** DayFrame
**Parent Task:** Task 9.27 — Goal Structure & Manual Milestone Authoring V1 — PARTIAL/BLOCKED
**Prerequisite:** Task 9.27.1 resolution proposal accepted in the accompanying architectural review
**Implementation Authority:** The accepted contract and directly necessary existing-surface integration
**Persistence-Format / Schema / Migration Authority:** NONE
**Dependency Authority:** NONE
**Capability / Code Retirement or Removal Authority:** NONE
**New Structure Authoring UI Authority:** NONE

---

## 1. Objective

Implement the accepted Goal Structure Temporal, Compatibility & Owner Safety Contract V1.

Close the four documented foundation gaps:

1. Invalid prospective relationship intervals and missing canonical applicability.
2. Safe operational treatment of previously accepted temporal anomalies.
3. Milestone metadata edits changing untouched lifecycle timestamps.
4. Ordinary Structure writes bypassing admission or crossing replacement boundaries.

Propagate qualified temporal evidence through existing planning and acceptance revalidation.

Preserve supported durable representations, exact history, independent authorities, and existing recovery semantics.

This task repairs the foundation. It does not implement or complete Task 9.27’s Structure authoring UI.

---

## 2. Architectural Acceptance and Task Identity

Task 9.27.1 is accepted COMPLETE as an architecture-resolution proposal.

The accompanying review accepts its proposed contract for this bounded implementation, with the single-clock clarification below.

Before application changes, create a separate acceptance ADR:

`docs/adr/ADR_GOAL_STRUCTURE_TEMPORAL_QUALIFICATION_AND_OWNER_SAFETY_V1_RESULT.md`

The ADR must:

- Identify the exact proposed contract by repository path and content hash.
- Reference the 9.27 blocked RESULT and 9.27.1 RESULT.
- Record acceptance of the contract for this bounded repair.
- Record the no-migration/no-durable-version decision and its limits.
- Include the single-clock clarification.
- State that implementation completion is established only by this task’s RESULT.

Preserve the original PROPOSED artifact, earlier ADRs, task inputs, and RESULTs unchanged. Adoption by a separate record must not rewrite the proposal’s historical status.

### Single-clock clarification

New planning orchestration captures one evaluation instant, passes it to the explicit canonical query, and maps the returned result into the existing V1 representation without resampling.

The goalId-only compatibility wrapper samples the owner clock once only when directly invoked by a legacy caller.

“Use the V1 adapter” does not authorize calling the clock-sampling wrapper from an already-time-qualified evaluation.

Confirm no conflicting executed Task 9.27.2 exists. Do not overwrite or silently renumber a conflict.

Verify this immutable input contains Sections 1–18 and its final completion statement.

---

## 3. Governing Inputs and Baseline

Read the current repository copies of:

- The accepted proposal:
  `GOAL_STRUCTURE_TEMPORAL_COMPATIBILITY_AND_OWNER_SAFETY_CONTRACT_V1_PROPOSED_RESULT.md`.
- Tasks 9.27 and 9.27.1 inputs, RESULTs, diagnostics, and retained observations.
- Goal Structure Architecture Specification and Task 8.2 RESULT.
- Durable-data compatibility/versioning ADR.
- Cross-storage restore ADR and applicable amendments.
- Goal identity/lifecycle and planning provenance/freshness contracts.
- Tasks 9.24–9.26 RESULTs and relevant permanent regressions.
- End-State Compatibility & Retirement specification.
- Product Ontology and relevant Appendix B definitions.

Record HEAD, working-tree status, applicable repository instructions, and a task-relative preservation baseline.

Task 9.27.1 reported 206 starting status entries and 1,040 unchanged baseline files. These are historical measurements; capture current values.

Reconfirm the affected executable contracts and exact callers. Do not repeat the general Goals audit.

Preserve unrelated dirty work. Do not reset, stash, commit, push, install dependencies, or perform unrelated cleanup.

Do not open, initialize, import over, clear, migrate, repair, or normalize preserved Dogfood Pass 02 state.

Use disposable fixtures, databases, browser profiles, and origins.

---

## 4. Authorized Implementation Areas

The accepted contract identifies bounded changes in:

- Structure domain classification and query functions.
- Structure surface and lazy adapter.
- Public store types, admission, and bootstrap wiring.
- Runtime transaction epoch exposure and begin-time quiescence.
- Optional IndexedDB mutation admission callback.
- Structure restore/clear capability wiring.
- Requested Time projection and freshness.
- Planning orchestration and proposal acceptance revalidation.
- Existing backup/planning feedback where needed to explain qualification.

Inspect actual paths before editing.

Reuse the existing owners, restore coordinator, journal, runtime transaction, durability model, and lazy boundaries.

Do not create a second Structure authority, global locking system, recovery manager, durable cache, or universal operation ledger.

Changes to shared infrastructure must be the specific optional seams required by this contract. Unrelated callers must retain their existing behavior.

---

## 5. Prospective Time Rules and Legacy Qualification

Implement the accepted temporal definitions:

- Relationship interval: `[effectiveFrom, effectiveTo)`.
- Absent end: unbounded.
- Equal endpoints: valid empty interval.
- Inverted endpoints: temporal anomaly, not empty.
- Applicability requires latest active status and applicable interval.
- Current evaluation does not revive retired records or reconstruct historical Goal state.

### Prospective commands

For an admitted semantic change:

- Sample the real owner clock once immediately before candidate construction.
- Require a valid sample at least the recorded Structure-wide createdAt/updatedAt high-water value.
- Derive that value from retained authority; do not persist a synthetic clock.
- Permit equal timestamps.
- Require relationship retirement time to be at least effectiveFrom.
- Reject rollback rather than clamping, swapping, artificially incrementing, or repeatedly sampling.

Perform admission and semantic no-op checks before new allocation or persistence.

No-ops preserve revisions and timestamps but remain subject to admission.

Preserve the empty-authority limitation: no prior timestamp means no prior rollback can be detected.

Use the accepted existing rejection categories and runtime-only explanatory details. Rejection must not alter authority, desired state, identity allocation, or durability.

### Legacy qualification

Leave the shared supported durable decoder’s acceptance predicates unchanged.

Separately qualify all retained rows, including nonlatest revisions, for the temporal anomalies identified in the accepted contract.

Any such anomaly makes whole-Structure temporal qualification protected:

- Exact records remain retained and inspectable.
- Structural eligibility is unknown.
- Ordinary Structure authoring and retry are blocked.
- Preservation export and authorized coordinator restore remain available.

Do not qualify only the latest row, infer affected-Goal isolation, hide anomalous records, or repair their dates.

Keep temporal qualification distinct from malformed-ingress protection.

---

## 6. Canonical Query and Single-Clock Integration

Implement the explicit current-authority query and qualification contract from proposal §4.

Preserve:

- Evaluated instant and current-authority basis.
- Record status versus interval position versus applicability.
- Four-state structural eligibility.
- Exact reasons and record references where available.
- Unavailable/protected records versus an available empty collection.
- Authority/applicability fingerprints only when their inputs are available.
- The next relevant applicability boundary.

Historical reconstruction requests must not receive invented historical eligibility.

Retain existing exact/current record APIs and the goalId-only compatibility entry point.

### V1 mapping

Provide one pure mapping from an already-evaluated canonical result to the existing V1 result.

The legacy wrapper may sample once and delegate.

New planning must pass its existing captured instant and reuse the result. It must not invoke the clock-sampling wrapper again.

Preserve serialized V1 reason unions and shapes. Do not insert new V2/runtime reasons into durable V1 planning records.

Where the accepted adapter uses unknown without an invented prerequisite reference, preserve that distinction and obtain explanation from the explicit qualification result.

If a truthful mapping cannot satisfy existing serialized validators, stop rather than fabricate evidence or silently change a format.

React renders canonical results; it does not implement applicability or graph authority.

---

## 7. Planning Freshness and Acceptance

Carry one real evaluation instant through planning independently of the canonical User Day horizon.

The horizon describes requested/plannable time. It is not the Structure evaluation clock.

Implement the accepted time-sensitive freshness behavior:

- Relevant authority or condition changes require recomputation.
- Crossing an applicability boundary can stale evidence without a revision.
- Clock rollback before the prior evaluated instant makes cached temporal freshness unknown until recomputed.
- A newly added dependency must be detected.
- Whole-Structure qualification changes must not be missed because they originate outside the selected Goal’s relationship set.

Projection freshness must compare the necessary semantic evidence and membership, not dependency fingerprints alone.

Trace propagation through Feasibility, Allocation, Proposal, and acceptance. Do not assume that adding a runtime field automatically reaches every consumer.

### Acceptance

Revalidate using the actual acceptance instant, not the proposal’s stored cutoff.

A time-only membership change must not silently authorize an old proposal.

A later evaluation instant with otherwise unchanged lawful inputs must not cause every proposal to fail merely because a timestamp differs.

Persisted proposals without current runtime qualification are unverified until explicit current revalidation succeeds. Do not infer a policy version from their dates.

When existing evidence cannot prove the required comparison, fail closed through the existing refresh/re-evaluation workflow. Do not invent provenance or add persisted qualification fields.

Retain existing accepted allocations, realized facts, publications, Actual, and Progress unchanged.

No automatic acceptance, replacement, release, or scheduling is authorized.

---

## 8. Milestone Patch Fidelity

Implement the accepted patch matrix without adding fields or lifecycle states.

Metadata-only or same-state edits must preserve existing satisfiedAt/retiredAt exactly.

A genuine supported transition changes the appropriate lifecycle timestamp using the admitted command time.

Preserve:

- Ownership, policy, identity, creation time, and provenance.
- Optional target-date omission versus explicit null clearing.
- Existing trim and semantic no-op rules.
- One revision for a genuine combined metadata/state change.
- All exact earlier revisions.
- Existing graph rejection of retirement when an active dependency still targets the Milestone.

Permanent regression:

```text
Satisfied September 24
→ title-only rename September 25
→ current satisfiedAt remains September 24
→ updatedAt reflects the metadata edit
→ prior revision remains exact
```

Do not automatically correct already-affected timestamps from history.

The prospective patch fix is not authority for historical correction.

---

## 9. Complete Ordinary Admission and Coordinator Separation

Implement the accepted inventory for every Structure write path:

- Create/revise/retire relationship.
- Create/revise Milestone.
- Persistence retry.
- Public replacement and clear.
- Initialization.
- Internal durable replacement.
- Coordinator restore/full-clear/recovery installation.

Ordinary operations must consult current readiness, transaction state, ingress, temporal qualification, and the required revision/generation checks.

Use richer existing admission classification at the owner seam. Preserve boolean-callers through the accepted compatibility adapter.

Denial is not storageFailure, accepted success, or durable completion.

Do not alter authority or its durability status merely to report a denied command.

### Coordinator operations

Authorized restore, full clear, and startup recovery use private capability-bearing paths tied to the matching coordinator epoch.

They must not depend on ordinary inactive-transaction admission while their authorized transaction is active.

Conversely, public replacement/clear must not become an unguarded repair/import bypass.

Initialization is read/install authority with generation checks, not an escape from protected state.

UI controls must not acquire coordinator capabilities.

---

## 10. Lazy Dispatch, Leases, and the Actual Write Boundary

Implement proposal §8’s bounded mechanism:

1. Expose the existing runtime epoch while inactive as well as active.

2. Capture the epoch before asynchronous lazy dispatch. Recheck after loading and before acceptance so a transaction that begins and ends during loading still invalidates the old call.

3. Use ephemeral owner-generation and desired-version counters. Restore/clear/replacement invalidates tokens; rollback must not restore an old generation counter.

4. Serialize unresolved ordinary Structure operations with one owner-local lease. Reject a second unresolved submission as busy rather than queueing or replaying user intent.

5. Recheck admission, expected revision, generation, and qualification at the synchronous candidate-acceptance boundary.

6. Add the optional synchronous storage-admission callback after database open and immediately before readwrite transaction creation/request enqueueing, with no intervening await.

7. Apply Structure quiescence at every relevant runtime transaction begin, before snapshot capture. An outstanding ordinary persistence lease makes restore/clear begin return busy.

8. Let a started ordinary storage transaction settle. Do not claim that a post-commit check undoes its write.

9. Update durability only for matching epoch/generation/desired identity. Handle an unexpected mismatch protectively, not as durable completion of replacement authority.

10. Release the lease on every completion, rejection, and thrown-error path.

Retry persists the exact current accepted desired snapshot. It allocates no new semantic identity or revision.

Do not introduce an await-after-begin deadlock, a stale queued write, cross-tab guarantees, or a claim that unexamined owners now share these protections.

---

## 11. Backup, Restore, and Preservation

Keep unchanged:

- Structure V1 durable representations.
- Database schema 11.
- Current V14 complete backup writer.
- Supported historical reader chain.
- Existing staging/journal formats and recovery protocol.

Do not add a migration, migration marker, inferred correction, or V15 merely for this repair.

A legacy-valid temporal anomaly must remain exportable and exactly restorable.

After installation or rollback, derive qualification from the exact installed rows. Do not run prospective command validators against restore payloads or discard anomalous history.

Keep these outcomes distinct:

- Exact restore completed, Structure qualified.
- Exact restore completed, Structure preserved but temporally unqualified.
- Invalid/unsupported input rejected.
- Persistence/rollback failure.
- Recovery-required protection.

Successful preservation is not a claim of safe planning readiness.

No blanket normalization may hide changed IDs, revisions, optional absence, timestamps, or historical values.

Known-good restore and explicit full clear retain their existing authority and consequences. Do not present either as an automatic, selective, or lossless repair of ambiguous records.

---

## 12. Existing Product Feedback and Context Boundaries

Add only the feedback needed on existing planning and backup surfaces.

Users must be able to understand:

- Which evidence is unavailable or temporally unqualified.
- That records have been preserved.
- That planning or ordinary Structure mutation is blocked.
- That preservation export remains available where supported.
- Whether restore actually succeeded.
- Whether the application instead requires recovery.

Do not promise a review/repair action that does not exist.

Use current product vocabulary rather than exposing raw internal enum strings as the primary explanation.

Preserve Tasks 9.24–9.26 context behavior:

- Rejected import preserves appropriate drafts and accepted identities.
- A transaction that began and aborted may invalidate operation tokens without erasing drafts.
- Successful replacement invalidates displaced editing/query context.
- Late results cannot resurrect prior Goal or period views.
- Old multistep continuations cannot replay edits into replacement authority.
- Setup profile loading retains its independent scope.

No new Structure editor, persistent drafts, historical timeline, or recovery workflow is authorized.

---

## 13. Permanent Regression Requirements

Add repaired-behavior tests separately from the immutable diagnostic artifacts.

Original diagnostic observations remain historical evidence. Do not rewrite their defect-confirming assertions to pretend the defects never existed.

Cover the accepted proposal’s full regression table, including:

### Temporal and fidelity

- Before/at/after interval boundaries, absent ends, equal endpoints, future-effective records, and retired current records.
- Clock rollback on create/revise/retire, valid equal command times, and no-op preservation.
- Latest and nonlatest temporal anomalies.
- Exact history, reload, and supported backup preservation.
- Metadata, same-state, genuine-transition, and optional-date Milestone cases.

### Qualification and planning

- Qualified empty Structure versus unavailable/protected evidence.
- Canonical hard/advisory condition semantics and aggregate precedence.
- One captured evaluation instant; no hidden resampling.
- Time-only applicability changes without revisions.
- Unchanged membership at a later instant remains lawfully revalidatable.
- Membership changes that do not alter aggregate requested minutes are still detected.
- Persisted proposal revalidation and immutable accepted history.

### Admission and interleavings

- Denied create/revise/retire/retry/replace/clear.
- Restore completing during lazy loading.
- Admission/generation changing during delayed database opening.
- Outstanding persistence making every relevant transaction-begin route busy before snapshot.
- Already-started storage transaction completion.
- Storage rejection/throw and lease release.
- Accepted runtime state with failed persistence, followed by safe retry.
- No stale desired snapshot written after replacement.
- Coordinator writes permitted only through matching capability/epoch.

### Integration

- Real store/restore composition, not only isolated stubs.
- Actual rejected/successful V14 import and recovery-readiness context handling.
- Non-Structure storage callers unchanged by the optional seam.
- Existing Goal editing, G1/G2, Structure graph, planning, realization, publication, execution, Progress, and compatibility regressions.

Use deterministic deferred promises/storage seams for interleaving proof. Label controlled failures separately from native-browser observations.

No universal concurrency claim is established by a single successful ordering.

---

## 14. Native Browser and Mobile Acceptance Gate

Use the production build, installed browser tooling, and disposable state.

Required native workflows:

1. Coherent source A:
   ordinary UI export → distinct destination B import → re-export → reload → canonical comparison.

2. Legacy-valid anomalous source:
   actual UI import → explicit preservation/qualification feedback → blocked current planning → preservation export → reload → exact retained-row comparison.

3. Current planning:
   explicit evaluation and acceptance revalidation through existing product actions, with canonical evidence showing the repaired time/qualification path.

4. Rejected import:
   existing authority and appropriate editing context preserved.

Build anomalous fixtures from retained pre-repair command evidence or an explicitly identified legacy-valid fixture builder. Do not manufacture post-repair ordinary commands that bypass the new rules.

Canonical seeding may populate supporting fixtures. It must not substitute for the actual import/export or product actions being certified.

Use canonical automated fake-clock tests for precise time boundaries. Native production runs must not be described as clock-boundary proof when they did not exercise those boundaries.

Validate affected current surfaces at approximately:

```text
320px
390px
768px
1280px
```

Require:

- No unintended document horizontal overflow.
- Practical approximately 44px primary hit targets.
- No required hover, double-click, right-click, or dragging.
- Reachable error, preservation, and restore controls.
- Visible keyboard focus and meaningful restoration.
- Semantic controls and associated feedback.
- Non-color-only states.
- Usable reduced-height/reflow behavior.
- Equivalent underlying qualification and authority semantics.

Do not clip content to pass overflow.

No new Structure-authoring mobile acceptance is claimed. Physical-device, OS-dialog, soft-keyboard, screen-reader, and browser-native-zoom certification require actual evidence.

A mandatory missing or failing native/mobile check prevents COMPLETE.

---

## 15. Validation and Bundle Gate

Task 9.27.1 reported this unchanged application baseline:

| Measure | Historical value |
|---|---:|
| Test files / tests | 159 / 1,590 |
| Initial raw JavaScript | 623,114 bytes |
| Initial gzip JavaScript | 163,250 bytes |
| Largest lazy chunk | 62,652 bytes |
| Total JavaScript | 1,226,690 bytes |
| Initial-gzip headroom | 6,750 bytes |

Measure actual current before/after values.

Preserve hard limits:

- Initial gzip: 170,000 bytes.
- Initial raw: 685,000 bytes.
- Largest lazy chunk: 100,000 bytes.
- All other current repository hard gates.

Keep heavy qualification, planning, and backup work behind appropriate existing lazy boundaries.

Do not raise thresholds or add dependencies. Report existing advisories and task-relative changes honestly.

Run repository equivalents of:

```text
npm exec prettier -- --check .
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

A documented full-suite worker bound is permitted. Record the actual command, complete selected suite, intermediate failures, and resolutions.

Do not weaken assertions, existing timeouts, or configuration to obtain a pass.

Format only task-created/touched files as needed.

---

## 16. Non-Goals and Stop Conditions

Do not implement:

- Task 9.27’s Structure/Milestone authoring UI.
- General historical reconstruction or a bitemporal database.
- Selective legacy date repair or historical timestamp correction.
- Atomic reparenting or batch restructuring.
- Quantitative Demand Accounting, Progress roll-up, or Priority propagation.
- Automatic Milestones or Goal completion.
- New Goal lifecycle, recurrence, release, replacement, or Found Time.
- New persisted query policy, schema, backup version, or migration.
- Global locking, cross-tab coordination, or a replacement journal.
- Capability/code retirement or removal.
- Unrelated bundle or repository restructuring.

Use:

`STOP CONDITION — EVIDENCE CONTRACT GAP`

when a mandatory result cannot be represented or proven through the accepted bounded evidence contract.

Use:

`STOP CONDITION — ARCHITECTURE DECISION REQUIRED`

when implementation requires a materially different temporal interpretation, incompatible serialization, broader transaction protocol, new dependency, weakened protection, or new recovery authority.

Preserve useful independent work, but do not declare COMPLETE with a mandatory requirement blocked.

Do not substitute an entry-time boolean check for the accepted actual-write and quiescence requirements.

---

## 17. RESULT, Retained Evidence, and Completion Criteria

Write:

`docs/implementation/phase-9/TASK_9.27.2_GOAL_STRUCTURE_CANONICAL_OWNER_REPAIR_V1_RESULT.md`

Retain compact evidence under `evidence/task-9.27.2/` or the established equivalent.

Additional reports, screenshots, measurements, fixture exports, and QA artifacts must include `RESULT` in filenames. Application/test source retains normal repository conventions.

The RESULT must include:

1. Bounded outcome and acceptance-ADR reference.
2. Governing inputs and task-relative baseline.
3. Exact temporal/query/V1-mapping implementation.
4. Legacy qualification and unchanged durable acceptance evidence.
5. Milestone patch matrix results.
6. Complete write-path/admission map.
7. Deterministic interleaving and quiescence evidence.
8. Planning freshness and actual-time acceptance revalidation.
9. Native coherent/anomalous export-import-reload comparisons.
10. Current-surface mobile/accessibility observations and limits.
11. Full validation and before/after bundle measurements.
12. Every task-created/modified file and purpose.
13. Schema, migration, dependency, history, compatibility, and forensic-state effects.
14. Remaining exclusions and the Task 9.27 resumption checklist.

Retain fixture provenance, reproduction commands, material logs, canonical comparisons, measurements, and representative narrow-screen feedback screenshots.

Distinguish local repository retention from commits or remote backups. Do not rely exclusively on `/tmp`.

COMPLETE requires all four owner gaps repaired, qualified planning evidence propagated, late-write protections proven, exact supported data preserved, all mandatory automated/native/mobile gates passed, and unchanged hard bundle limits.

This does not complete Task 9.27. Its later continuation must reference the accepted contract and this task’s reviewed RESULT, preserve its blocked history, and pass its original authoring/mobile requirements.

---

## 18. Final Completion Statement

End the RESULT with the applicable determination:

**Task 9.27.2 — Goal Structure Canonical Owner Repair V1 is COMPLETE. Task 9.27 authoring remains pending explicit continuation and acceptance.**

or:

**Task 9.27.2 — Goal Structure Canonical Owner Repair V1 is PARTIAL/BLOCKED for the reasons documented above.**

**The task is complete when Structure preserves supported durable evidence while qualifying temporal applicability, maintains untouched Milestone lifecycle facts, enforces admission at every relevant ordinary write boundary, and supplies fresh planning evidence through acceptance—without changing durable formats, rewriting history, or claiming the unimplemented authoring workflow is complete.**