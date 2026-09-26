# Task 9.27 — Goal Structure & Manual Milestone Authoring V1 — RESULT

## 1. Outcome and stop determination

**PARTIAL/BLOCKED at the mandatory pre-implementation contract check. No application implementation was made.**

**STOP CONDITION — ARCHITECTURE DECISION REQUIRED**

Task §8 requires validated effective intervals. The existing canonical owner can durably author and reload a relationship with `effectiveTo < effectiveFrom`. Tightening the shared authority validator would reject a representation currently accepted by the durable reader. The durable-data compatibility ADR requires an explicit version/migration decision before tightening validation against accepted durable data; Task 9.27 authorizes neither format changes nor migrations. Silently normalizing the dates, hiding the record, or adding a competing React validator would not satisfy the task.

**STOP CONDITION — EVIDENCE CONTRACT GAP**

Task §9 requires distinguishing active record status from effective applicability at the query's evaluation time. `getStructuralEligibility(goalId)` and its core query have no clock/cutoff input or applicability output. They use latest active records regardless of `effectiveFrom`. The injected owner clock also is not consumed by this query. The UI can show stored dates, but cannot claim canonical time-qualified applicability or a matching eligibility cutoff. A decision is needed on that existing interval contract, followed by an authorized owner-level implementation. No historical traversal or broader Structure implementation is proposed.

The existing ordinary flat/current prerequisite behavior remains implemented. These findings narrow the earlier readiness assessment against Task 9.27's explicit fidelity requirements; they do not invalidate every Structure command or claim the whole specification is missing.

## 2. Baseline, task identity, and preservation

The immutable execution input `TASK_9.27_GOAL_STRUCTURE_AND_MANUAL_MILESTONE_AUTHORING_V1.md` exactly matches the supplied attachment and includes §§1–18 and its final completion statement. Repository discovery found no conflicting executed Task 9.27; the hydration file's projected Compatibility Retirement Audit is a projection only.

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Starting working-tree status: **204 entries**. Before any writes, **1,030 tracked/unignored files** were copied and SHA-256 indexed under `/tmp/dayframe-927-baseline-RESULT/`. Exact HEAD, status, and the hash index are also retained in this task's evidence directory. No applicable AGENTS.md was found in the repository or checked ancestors.

All 1,030 baseline files remain byte-identical, with none missing. This includes previous RESULTs, task inputs, architecture, production/test source and prior evidence. No reset, stash, commit, push, dependency installation, or unrelated cleanup occurred. Dogfood Pass 02 state was not opened, initialized, imported, cleared, migrated, repaired, or normalized. Reproduction uses an isolated in-memory fake IndexedDB factory, not any browser profile or user's database.

## 3. Governing evidence and source versions

The checked-out working-tree sources, rather than HEAD alone, are the executable baseline. The retained hash index identifies exact versions. Relevant repository copies inspected:

- `docs/architecture/GOAL_STRUCTURE_ARCHITECTURE_SPECIFICATION_RESULT.md`, especially identity, manual checkpoints, four-state eligibility, modification/history, determinism, effective intervals and validation (§§6–25, 40–59, 63–64).
- `docs/implementation/phase-8/TASK_8.2_GOAL_STRUCTURE_V1_DOMAIN_AND_PERSISTENCE_RESULT.md`: bounded current/exact reads, append-only revisions, atomic persistence, manual Milestones and backup participation.
- Task 9.23 RESULT §9 and persistence/fidelity findings; Tasks 9.24–9.26 RESULTs' editing, context, restore and protection contracts.
- `DayFrame_Product_Ontology_Vocabulary_Specification_V1.md` §§3–8 and relevant Appendix B entries in `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION_v1.0.0.md`: Goal, derived evidence, provenance and explicit acceptance.
- `DayFrame_End_State_Compatibility_Retirement_Architecture_Specification_V1.md` §6: round-trip fidelity and historical/protection parity.
- `ADR_GOAL_AUTHORITY_IDENTITY_LIFECYCLE_AND_COMMITMENT_LINK_MODEL.md`, `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`, and `ADR_DURABLE_CROSS_STORAGE_RESTORE_FOUNDATION.md`.
- Task 8.1 planning provenance/freshness RESULT and current planning/Structure source contracts. No separately named planning-foundation ADR was found in `docs/adr`; the implementation RESULT is identified as such, not relabeled an ADR.
- `core/planning/goalStructure.ts` and its tests; `state/goalStructureSurface.ts`, its tests and lazy adapter; public store wiring; `goalStructureSchedulingBoundary.test.ts`; `goalDemandProjectionQuery.ts`, proposal revalidation, and GoalPlanning Structure subscription.
- Relevant permanent 9.24–9.26 regressions remain in the executed full suite. `V14ImportContext.test.tsx` was inspected for actual rejected/accepted import and recovery boundaries.

Existing lazy GoalSection, GoalPlanningSection and `lazyGoalStructureSurface` boundaries are unchanged. No presentation context imports or new eager engines were added.

## 4. Actual capability-to-command/query map

All methods below are exposed through the existing public store's Structure surface. Creation allocates opaque UUID-v4 PlanningFactId, revision 1, owner-clock timestamps and `authoredAuthority/directAuthoring` provenance. The UI must not allocate substitute identities or provenance.

| Capability                         | Actual input and behavior                                                                                                                                                                     | Return / fidelity / protection                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create relationship                | `{kind, sourceGoalId, target, semantics}`; target is Goal ID or Milestone ID; semantics is containment requiredness, non-aggregating contribution, or hard/advisory dependency plus condition | Complete graph validates before runtime acceptance. Creation checks mutation admission and ingress.                                                                                                                                                                                                                                                     |
| Revise relationship                | `(id, expectedRevision, patch)`; patch permits kind/source/target/semantics                                                                                                                   | Latest exact revision checked; semantic no-op retains revision. Changed revision spreads original record, retaining interval/provenance. UI must not silently change kind/endpoints. Revision path currently omits mutation admission.                                                                                                                  |
| Retire relationship                | `(id, expectedRevision)`                                                                                                                                                                      | Appends retired revision with `effectiveTo = updatedAt = now`; exact old revision retained. Already retired is a no-op. No atomic reparent command. No interval-order check.                                                                                                                                                                            |
| Create manual Milestone            | `{ownerGoalId, title, targetDate?}`                                                                                                                                                           | Trims title; absent date remains absent; starts active with manual satisfaction policy. Creation checks admission/ingress.                                                                                                                                                                                                                              |
| Revise manual Milestone            | `(id, expectedRevision, {title?, targetDate?: string \| null, state?: active \| satisfied \| retired})`                                                                                       | Owner remains fixed; null clears date; semantic no-op retains revision. Any enum state can be submitted subject to complete graph validation. Transition timestamps are rebuilt even for a title-only semantic change. Revision path omits admission.                                                                                                   |
| Current relationships / Milestones | `listGoalStructureRelationships(goalId)` / `listGoalStructureMilestones(goalId)`                                                                                                              | Highest revision per identity, deterministic ID/revision ordering, includes inactive records. Relationship query includes outgoing and incoming Goal endpoints; a Milestone target is not returned as an inverse edge by its owning Goal.                                                                                                               |
| Exact revision                     | `getGoalStructureRelationshipRevision(id, revision)` / `getGoalStructureMilestoneRevision(id, revision)`                                                                                      | `resolved` with cloned exact record or `notFound`; never substitutes latest.                                                                                                                                                                                                                                                                            |
| Eligibility                        | `getStructuralEligibility(goalId)`                                                                                                                                                            | Four statuses, typed reasons, exact relationship references and dependency fingerprint. No time parameter or interval-applicability result. Core query throws on invalid authority; UI must check ingress and not turn protection into empty evidence.                                                                                                  |
| Persistence / retry                | ingress and durability getters; `retryGoalStructurePersistence()`; subscription                                                                                                               | Changed command installs runtime authority, marks pending, then replaces all revision rows in one IndexedDB transaction. Accepted result has value, changed flag and `persistence: durable \| pending`; getter distinguishes `storageFailure`. Retry writes desired authority without allocating another identity. Retry itself has no admission check. |

Rejected command reasons are the actual union (`initializing`, `protected`, `notFound`, `staleRevision`, `missingEndpoint`, `invalidInput`, `invalidGraph`, `allocationFailure`, `authorityTransactionActive`). Validation currently translates issues to `missingEndpoint` or `invalidGraph`; it does not return the core validator's exact cycle path. No UI may invent one.

## 5. Reproduced findings

The retained diagnostic test runs the unchanged canonical surface with valid Goal fixtures, real owner commands, controlled `now`/admission seams and isolated fake IndexedDB. Assertions record defects as observations; this is not an application acceptance suite that endorses those behaviors.

### A. Effective interval and applicability

1. Create a hard Goal-completed prerequisite at owner time `2026-10-01T00:00:00.000Z`.
2. Change the injected owner clock to `2026-09-23T12:00:00.000Z`, simulating clock rollback.
3. Eligibility still reports `ineligible`; the query has no way to consume that evaluation clock or qualify the future-effective relationship.
4. Retire the relationship. The owner accepts durably with end September 23 and start October 1.
5. Full authority validation says `valid`; a fresh surface initializes successfully from those stored rows and yields identical authority.

The fields were generated by commands, not hand-inserted malformed records. This establishes a producer/reader contract conflict, not evidence that any preserved user database contains such records. The unresolved interval interpretation and compatibility disposition are the primary stop basis. The task cannot repair it by merely displaying an interval or changing a form's date comparison.

### B. Title-only Milestone edit changes satisfaction timestamp

Create a manual checkpoint; satisfy it on September 24; submit only `{title: "Renamed checkpoint"}` on September 25. Revision 3's `satisfiedAt` changes from September 24 to September 25. The exact revision 2 remains correctly resolvable. Thus history is retained, but the current record's untouched satisfaction fact is not preserved by the patch. The patch contract provides no `satisfiedAt` field through which a form can preserve it.

This is a separate §11 fidelity issue requiring an owner correction/clarification before certifying the new editor; it is not claimed to require a new lifecycle or persistence format by itself.

### C. Revision admission differs from creation

With `canMutate` returning false, creating a Milestone rejects with `authorityTransactionActive`, but revising an existing Milestone accepts and persists. Source inspection finds the same missing admission call in relationship revision/retirement and persistence retry. The reproduction proves the Milestone path only; it does not claim an observed native restore race or failure of the existing protected application screen. Task 9.26 supplied the store callback, but these revision paths do not consult it.

UI readiness checks remain necessary, but cannot be presented as proof that the owner rejects all late writes. This additional protection gap needs bounded owner-level review before the new editor is certified.

## 6. Preserved semantics and planning boundaries

The current validator distinguishes single-parent acyclic containment, directional Goal dependencies, and lawful non-aggregating contribution cycles. Requiredness does not imply demand, Priority or completion. A dependency's direction is dependent Goal → prerequisite Goal/Milestone; its conditions are exactly `goalCompleted` and `milestoneSatisfied`.

An active dependency targeting a retired Milestone is rejected by current validation. Consequently retiring a referenced Milestone can reject; no automatic retirement of dependent relationships is authorized. This existing behavior should be explained, not replaced with a batch operation. Current enum transitions do not authorize inferred completion, measured Progress or activity reporting.

Requested Time projection calls existing structural eligibility. GoalPlanning subscribes to Structure changes to invalidate evaluation; proposal acceptance revalidates current evidence. No evaluation, Proposal, acceptance, realization, publication, Actual or Progress write was added. The new explicit prerequisite-to-planning UI workflow was **not implemented or certified**. Network+ accepted iterations and prior realized/published history remain untouched.

## 7. Validation and incomplete acceptance gates

Fresh baseline and unchanged application validation:

- `npm test -- --maxWorkers=2`: **159 files / 1,590 tests passed**, 82.03 seconds. No existing timeouts or assertions changed.
- `npm run build` and `npm run check:bundle`: passed.
- Repository formatting, lint, typecheck and `git diff --check`: results retained in `validation-RESULT.json`.
- Separate diagnostic: `npm test -- --configLoader native --config ../docs/implementation/phase-9/evidence/task-9.27/contract-repro-config-RESULT.mjs`: **1 file / 1 diagnostic passed**. This confirms the observations, not Task 9.27 acceptance.

The initial external-config attempt failed because bundled loading attempted a nonexistent `/home/sid/node_modules/.vite-temp`; native config loading fixed the test harness without installing dependencies or writing there. A first formatting invocation used the wrong working directory; it was rerun from `code/`. No application assertion failed during this task.

| JavaScript metric | Measured baseline | Final unchanged application | Delta | Hard limit / headroom |
| ----------------- | ----------------: | --------------------------: | ----: | --------------------: |
| Initial raw       |           623,114 |                     623,114 |     0 |      685,000 / 61,886 |
| Initial gzip      |           163,250 |                     163,250 |     0 |       170,000 / 6,750 |
| Largest lazy      |            62,652 |                      62,652 |     0 |      100,000 / 37,348 |
| Total             |         1,226,690 |                   1,226,690 |     0 |              Advisory |

The measured build is also the final application build because no application input changed. Existing initial-gzip warning (161,500) and total architecture-review advisory (825,000; warning 800,000) remain. Thresholds are unchanged.

Mandatory new authoring, bounded endpoint selection/reveal, focused forms, navigation/draft integration, persistence/retry UI, native-browser 320/390/768/1280 workflows, accessibility/reflow, UI-authored reload and V14 export/import comparisons are **not performed**. No screenshots or viewport values are manufactured. Existing passing tests and Task 9.26 browser evidence do not satisfy these new acceptance requirements. No COMPLETE claim is made.

## 8. Files and retained evidence

No existing file was modified. New files, all local and uncommitted:

- This RESULT: bounded findings and stop determination.
- `evidence/task-9.27/contract-repro-RESULT.test.ts`: executable owner-contract diagnosis.
- `evidence/task-9.27/contract-repro-config-RESULT.mjs`: isolated diagnostic selection; not part of production build or ordinary test discovery.
- `evidence/task-9.27/contract-observations-RESULT.json`: exact command records, revisions, timestamps and observed outcomes.
- `evidence/task-9.27/baseline-head-RESULT.txt`, `baseline-status-RESULT.txt`, `baseline-hashes-RESULT.json`: task-relative preservation evidence.
- `evidence/task-9.27/validation-RESULT.json`: exact commands, material output, gates and final baseline comparison.
- `evidence/task-9.27/PROVENANCE-RESULT.md`: reproduction instructions and evidence limits.

These repository-local artifacts survive removal of `/tmp`; they are not committed or remotely backed up. The immutable execution input predated this task's baseline and was not created or edited by this execution. No schema, dependency, compatibility reader, historical record, recovery protocol, lifecycle authority or forensic state changed.

## 9. Required resolution and final determination

Before this slice can be completed, resolve the current effective-interval applicability/validation contract and the compatibility treatment of accepted records. Then authorize the bounded canonical-owner corrections needed for interval handling, Milestone field fidelity and mutation admission. Alternatively, an explicit revised task could narrow its mandatory contract; this execution does not silently do so. The retained reproduction supplies concrete inputs for that decision.

Atomic reparenting, accounting, roll-ups, automatic Milestones, scheduling dependencies, new lifecycle semantics and capability retirement remain excluded. They are not the reasons for stopping.

**Task 9.27 — Goal Structure & Manual Milestone Authoring V1 is PARTIAL/BLOCKED for the reasons documented above.**
