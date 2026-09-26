# Task 9.27.2 — Goal Structure Canonical Owner Repair V1 — RESULT

## 1. Bounded outcome

Implemented the accepted temporal qualification, Milestone patch fidelity, ordinary mutation admission and planning freshness repairs. The separate [acceptance ADR](../../adr/ADR_GOAL_STRUCTURE_TEMPORAL_QUALIFICATION_AND_OWNER_SAFETY_V1_RESULT.md) was created before application changes. It identifies the original proposal and its SHA-256; that PROPOSED artifact remains unchanged. Task 9.27’s Structure/Milestone authoring UI is not implemented by this task.

**Outcome: COMPLETE for this bounded foundation repair.** Automated, native/mobile and hard bundle gates passed; Task 9.27 authoring remains pending explicit continuation and acceptance.

## 2. Governing inputs and preservation baseline

The immutable Task 9.27.2 input matches the supplied attachment byte-for-byte, contains Sections 1–18 and its final completion statement, and had no conflicting executed assignment. No applicable AGENTS.md was found. No skill or delegated agent was used.

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Starting working-tree status: **209 entries**. Captured **1,052 baseline files** before changes. The baseline is the existing dirty working tree, not just HEAD. Its HEAD, status and SHA-256 manifest are retained in this task’s evidence directory. Final preservation checks identify **15 changed baseline application files, 1,037 unchanged baseline files and zero missing files**, plus three new source/test files; earlier task inputs, ADRs, RESULTs, diagnostic assertions and observations remain unchanged.

Governing sources: the exact accepted proposal; Tasks 9.27 and 9.27.1 inputs, RESULTs and retained diagnostics; Goal Structure architecture specification and Task 8.2 RESULT; durable compatibility/versioning and cross-storage restore ADRs/amendments; Goal identity/lifecycle and Task 8.1 provenance/freshness contracts; Tasks 9.24–9.26 RESULTs and regressions; End-State Compatibility & Retirement; Product Ontology and applicable Appendix B definitions. Source inspection followed the current owner, lazy adapter, bootstrap/admission/clear, storage, restore, projection, Feasibility, Allocation, Proposal and existing product callers.

No commit, reset, stash, push, dependency installation, database migration or preserved Dogfood Pass 02 access occurred. Browser work used only a new `/tmp/dayframe-9272-chrome-RESULT` profile and localhost origins on ports 4947/4948. Fake-IndexedDB tests use disposable factories/databases.

## 3. Temporal query and compatibility mapping

`goalStructureTemporal.ts` owns current-authority qualification and applicability:

- Intervals are `[effectiveFrom, effectiveTo)`, with absent ends unbounded, equal endpoints empty, and inverted endpoints unknown.
- Latest retired records remain retired even when the supplied instant lies inside their recorded interval. Future active records remain visible but not applicable before their start.
- All retained relationship and Milestone revisions are checked for inverted intervals, creation/update ordering, decreasing update times across revisions, and lifecycle timestamps outside creation/update bounds.
- Any anomaly protects the whole Structure authority. Exact rows remain available; eligibility and applicability are unknown. Unavailable ingress is separately represented, and a qualified empty collection is affirmative available evidence.
- Results carry the evaluated instant, current-authority basis, record references, status/interval/applicability distinctions, reasons, available-input fingerprints and the next relevant applicability boundary. Unsupported historical reconstruction and invalid instants are rejected explicitly.
- Applicable outgoing dependencies retain existing hard/advisory and Goal-completed/manual-Milestone-satisfied semantics. Aggregate precedence is unknown, ineligible, conditionally eligible, eligible, independently of row order.

`structureEligibilityV1` purely maps an already evaluated result. It does not sample time or introduce runtime reason codes into serialized V1 records. Global unknown qualification does not fabricate a prerequisite reference. The direct legacy `getStructuralEligibility(goalId)` wrapper samples its owner clock once. New projection orchestration passes its captured instant to the explicit query instead.

The shared Structure decoder, durable V1 record shapes and supported backup reader predicates are unchanged. Qualification is derived after exact installation, including rollback/reload. Legacy-valid anomalies remain accepted for preservation and complete export, rather than being treated as malformed ingress or silently repaired.

## 4. Prospective commands and Milestone fidelity

Changed ordinary commands sample the real clock once after admission/no-op checks. The sample must be canonical ISO and at least every retained Structure createdAt/updatedAt value. Retirement also requires time at or after effectiveFrom. Equal command times are valid. Rejections do not clamp, resample, allocate identities or modify authority. Empty authority cannot establish an earlier watermark.

| Patch                                         | Verified behavior                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------------- |
| Trim-equivalent or same-state no-op           | No revision/time sample; still subject to admission                               |
| Satisfied title/date edit or same-state patch | Exact satisfiedAt retained; updatedAt records metadata edit                       |
| Retired metadata/same-state edit              | Exact retiredAt retained                                                          |
| Genuine transition to satisfied               | New satisfiedAt; retiredAt absent                                                 |
| Genuine transition to active                  | Both lifecycle timestamps absent in the new revision                              |
| Genuine transition to retired                 | New retiredAt; satisfiedAt absent; referenced Milestone retirement still rejected |
| Target date omitted / explicit null           | Preserve / remove, respectively                                                   |
| Combined metadata and state change            | One revision; exact earlier rows retained                                         |

The September 24 satisfaction → September 25 rename regression preserves September 24 satisfiedAt and records September 25 updatedAt. No already-affected historical timestamp is corrected.

## 5. Write paths, admission and transaction boundaries

| Path                                                       | Boundary and result                                                                                                                                       |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Relationship create/revise/retire; Milestone create/revise | Rich existing readiness/transaction admission, ingress and temporal qualification; revision/no-op checks; synchronous recheck before candidate acceptance |
| Retry                                                      | Same ordinary admission; exact desired snapshot; no new identity/revision                                                                                 |
| Public replacement                                         | Qualified source and validated/qualified target; generation/epoch checks; lease remains held through runtime installation                                 |
| Public clear                                               | Same ordinary admission and lease through exact empty runtime installation                                                                                |
| Initialization                                             | Read/install only; generation/epoch checked after read; cannot reopen protected authority                                                                 |
| Lazy ordinary dispatch                                     | Captures epoch before loading and rejects displaced intent even if the transaction has already ended                                                      |
| Ordinary storage                                           | Optional synchronous admission callback runs after database open, immediately before readwrite transaction creation/enqueueing                            |
| Runtime transaction begin                                  | Structure quiescence checked before scheduler/snapshot work, covering restore, internal replacement and full clear                                        |
| Coordinator restore/recovery                               | Existing private composition captures the begun epoch; combined durable write callback and runtime install/commit/abort require that active epoch         |
| Coordinator full clear                                     | Separate capability plus matching active epoch; ordinary inactive admission is not used                                                                   |
| Runtime installation/rollback                              | Existing capability-bearing participant machinery; owner generation/desired-version counters increase and never roll back                                 |

One owner-local lease rejects a second unresolved ordinary operation as busy. Accepted semantic state survives storage failure as pending/storageFailure and can be explicitly retried. Started transactions settle; no post-commit check is claimed to undo a write. Only matching epoch/generation/desired identity can receive durable completion. An unexpected ordinary displacement is protected. Leases release on success, rejection and thrown storage errors.

The optional storage seam leaves callers without a callback unchanged. The combined restore write remains the existing atomic journal-controlled batch; no second recovery manager or global lock was introduced. These protections are bounded to this owner and its existing coordinator composition, not cross-tab or universal concurrency guarantees.

## 6. Planning freshness and acceptance

The evaluation instant is separate from the Requested Time User Day horizon. Allocation passes one captured instant into projection; Feasibility reuses that projection. Projection freshness compares freshly projected semantic evidence as well as dependency references. Time-only membership changes can therefore stale an otherwise unchanged requested-minute total. Runtime temporal freshness becomes unknown on clock rollback until recomputation.

Acceptance samples its actual instant once. It first checks whether current rules can reproduce the stored proposal’s evidence, then recomputes current Structure membership at the acceptance instant. Comparison retains the old competition identity cutoff solely to avoid making elapsed time itself a semantic difference. Changed membership/dependencies fail through the existing stale/re-evaluate workflow; unchanged lawful evidence can still be accepted later. Persisted proposals are not granted inferred runtime qualification merely because their serialized format or date is familiar.

After asynchronous revalidation, admission and the exact current Proposal object are checked again, preventing a displaced continuation from accepting into replacement authority. Earlier accepted allocations and their exact records are retained. No automatic scheduling, acceptance, release or replacement was added.

## 7. Permanent regressions and controlled interleavings

New repaired-behavior suites are separate from immutable diagnostic artifacts:

- `goalStructureOwnerSafety.test.ts`: boundaries, future retirement, equal times, rollback/no-op allocation behavior, Milestone patches/history/reload, nonlatest legacy anomalies, four-state aggregation/manual conditions, unavailable/empty distinction, pure mapping, temporal freshness, all ordinary denial paths, lazy epoch displacement, optional storage admission, storage throw/retry, delayed stale-write suppression, initialization displacement, actual store begin/full-clear quiescence, capability denial, committed-write acknowledgement and replacement/clear lease handoff.
- `goalStructurePlanningSafety.test.ts`: exact instant forwarding with a throwing legacy-wrapper sentinel, later equivalent acceptance, time-only advisory membership change with unchanged minutes, V14 anomaly preservation/reload, active-transaction denial, persisted-proposal revalidation, deferred acceptance displacement and displaced coordinator epoch rejection.

Deferred promises control the interleavings. A committed-write test reads the row before releasing its acknowledgement and verifies the lease remains held. A coordinator displacement test changes the runtime epoch while the combined write is delayed and verifies no stale restore completes or aborts the newer transaction. These are controlled fake-IndexedDB tests, distinct from native observations.

Intermediate failures were resolved without weakening existing assertions, timeouts or configuration: the initial UI suite exposed unloaded evidence mislabeled as temporal anomaly; an overly strict earlier-clock acceptance guard was replaced by explicit recomputation; new test fixtures initially used a missing graph endpoint and the wrong adapter method; a reload fixture passed `{}` (which intentionally reinstantiates setup identities) rather than the production `undefined` path; accepted-history comparison was corrected to resolve each exact record by ID across unspecified collection ordering. New handoff tests verify the final lease correction.

## 8. Native production and current-surface acceptance

The retained browser driver uses real production UI export/download and file input import, product evaluation and acceptance, and canonical readback. Seeding only supplies supporting disposable state. Source A has independent Goal, Requested Time, Structure, accepted planning, realized/published facts, Actual and Progress evidence. Destination B is separately seeded and has unsaved editing context.

At **320, 390, 768 and 1280px**, each workflow verifies:

1. Invalid JSON import preserves B’s authority and Goal draft and restores focus to Import.
2. Native export A → UI import B → UI re-export → page reload → re-export preserves complete authority.
3. Product evaluation saves a proposal; Review Schedule acceptance adds exactly one accepted allocation using current qualification evidence.
4. UI import of a legacy-valid temporal anomaly reports successful preservation distinctly from planning readiness. Product evaluation yields no proposal; preservation export and reload retain exact rows and all independent authority.

The anomalous fixture copies the two retained pre-repair relationship revisions from Task 9.27’s immutable observation, remaps only Goal endpoints to its supporting fixture, and orders rows canonically at construction. It does not bypass repaired ordinary commands. Precise clock-boundary proof comes from fake-clock regressions, not the native run.

Comparisons exclude only export metadata and explicitly identify six unordered Proposal/Realization collection arrays. Within records, IDs, revisions, timestamps, optional absence, values and ordered nested data are compared exactly. Structure arrays are compared directly. Each comparison records source/restored SHA-256 and whether raw collection order also matches; all 24 final comparisons also passed raw array-order equality. No blanket normalization hides changes.

Measurements verify no document horizontal overflow, at least approximately 44px affected controls, semantic buttons/inputs/status feedback, associated import feedback, visible focus outlines and keyboard return to Import. Native Tab navigation remains usable at 390×420; 200% CSS zoom supplies an approximately 320px reflow check. No hover, drag, context menu or double-click is required. Representative narrow screenshots retain preservation and planning protection feedback.

Limits: desktop Chromium viewport emulation, file selection through CDP, and CSS zoom are not physical-device, OS-dialog, soft-keyboard, screen-reader or browser-native-zoom certification. No Structure-authoring mobile acceptance is claimed. Native uncaught errors: zero.

## 9. Validation and bundle gate

Final checks passed: Prettier repository check, ESLint, TypeScript, **161 test files / 1,626 tests** (83.50s), production build, bundle policy and `git diff --check`. The final native run passed **60 observations**, including **24 authority comparisons**, with zero uncaught errors. All 268 sampled affected controls were at least 44px high (minimum width 105.5px); all measured document scroll widths equaled client widths. The full suite uses the permitted worker bound `npm test -- --maxWorkers=2`; no suite exclusion or test configuration change was made. Baseline: 159 files / 1,590 tests, all passing.

| Measure                 |    Before |     After | Delta / limit                   |
| ----------------------- | --------: | --------: | ------------------------------- |
| Initial raw JavaScript  |   623,114 |   625,674 | +2,560; 685,000 hard limit      |
| Initial gzip JavaScript |   163,250 |   163,927 | +677; 170,000 hard limit        |
| Largest lazy chunk      |    62,652 |    62,657 | +5; 100,000 hard limit          |
| Total JavaScript        | 1,226,690 | 1,237,649 | +10,959; Existing advisory only |

The initial-gzip advisory (161,500) and total-JavaScript architecture-review advisory (825,000) existed before this task. Thresholds are unchanged. Initial-gzip hard-limit headroom is **6,073 bytes** (previously 6,750). Heavy temporal qualification remains a lazy chunk; no dependency was added.

## 10. Changed-file inventory and effects

Application and test changes:

| File under `code/src/`                                 | Purpose                                                                           |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `core/planning/goalStructureTemporal.ts` (new)         | Qualification, applicability, explicit query, pure adapter and temporal freshness |
| `core/planning/goalDemandProjection.ts`                | Semantic projection freshness                                                     |
| `infrastructure/storage/indexedDbCollectionStorage.ts` | Optional post-open admission callback                                             |
| `state/goalStructureSurface.ts`                        | Clock rules, patch fidelity, admission, generations, leases and coordinator clear |
| `state/lazyGoalStructureSurface.ts`                    | Query availability and pre-load epoch capture                                     |
| `state/dayFrameAuthorityTransaction.ts`                | Inactive epoch exposure and pre-snapshot quiescence                               |
| `state/dayFrameRuntimeAuthority.ts`                    | Compatible optional epoch read contract                                           |
| `state/dayFrameRestoreComposition.ts`                  | Coordinator-owned epoch checks for exact writes and installation                  |
| `state/dayFrameStore.ts`                               | Admission/epoch wiring, full clear and actual-time proposal revalidation          |
| `state/goalPlanningSurface.ts`                         | Captured explicit projection instant                                              |
| `state/goalDemandProjectionQuery.ts`                   | Canonical query with pure V1 mapping                                              |
| `state/allocationSurface.ts`                           | Instant propagation and stable comparison cutoff                                  |
| `state/capacitySurface.ts`                             | Reuse the already evaluated projection                                            |
| `state/proposalSurface.ts`                             | One acceptance clock sample and post-await displacement check                     |
| `ui/DayFrameApp.tsx`                                   | Distinct anomalous-preservation restore feedback                                  |
| `ui/GoalPlanningSection.tsx`                           | Existing Requested Time protection explanation                                    |
| `state/goalStructureOwnerSafety.test.ts` (new)         | Owner/domain/storage/interleaving regressions                                     |
| `state/goalStructurePlanningSafety.test.ts` (new)      | Planning, reload, acceptance and restore regressions                              |

Documentation: the acceptance ADR, this RESULT, and the task evidence directory. The retained inventory enumerates every task-created artifact and every changed baseline file. Evidence includes the seed/build config/browser driver, source/anomaly and representative round-trip exports, malformed input, measurements, screenshots, baseline hashes/status, a task-relative source patch, validation logs and reproduction notes. These are local repository artifacts, not commits or remote backups.

Schema remains 11; Structure representation V1 and complete backup V14 remain unchanged. Supported historical readers, staging/journal formats, frozen facts, accepted history, publications, Actual and Progress are preserved. No data correction, durable qualification version, new policy serialization or recovery authority was introduced. Preserved forensic state was not accessed.

## 11. Task 9.27 resumption checklist

- Explicitly authorize the pending Structure/Milestone authoring continuation; reference this reviewed RESULT and the acceptance ADR.
- Preserve the original blocked 9.27 history and immutable diagnostics.
- Build only the originally authorized authoring workflow over these canonical commands/queries; do not recreate graph or applicability authority in React.
- Handle protected/unavailable evidence, admission failures, draft displacement and independent Goal/Requested Time authorities truthfully.
- Pass 9.27’s original authoring, native/mobile, exact-fidelity and bundle gates. This foundation repair is not their substitute.

Evidence: [reproduction notes](evidence/task-9.27.2/REPRODUCTION_RESULT.md), [native observations](evidence/task-9.27.2/browser-measurements-RESULT.json), [file inventory and preservation](evidence/task-9.27.2/preservation-inventory-RESULT.json), [full suite](evidence/task-9.27.2/tests-RESULT.log), [bundle](evidence/task-9.27.2/bundle-RESULT.log), [preservation feedback](evidence/task-9.27.2/320-anomalous-preservation-RESULT.png) and [planning protection](evidence/task-9.27.2/320-planning-protected-RESULT.png).

**Task 9.27.2 — Goal Structure Canonical Owner Repair V1 is COMPLETE. Task 9.27 authoring remains pending explicit continuation and acceptance.**
