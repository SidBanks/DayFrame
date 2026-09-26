# Task 9.29 — Planner / Review Schedule Workflow Convergence V1 — Authorized Continuation — RESULT

**Status: PARTIAL/BLOCKED — STOP CONDITION — ARCHITECTURE DECISION REQUIRED.**

## 1. Outcome and continuation history

The authorized continuation reached a newly demonstrated **realization-owner replacement gap before workflow implementation**. A valid Proposal acceptance's automatic realization, and a fresh explicit retry of a retained acceptance, can each resume a physical write after full clear or V14 restore reports success. The old realization then reinstalls displaced runtime facts. Independent reopen preserves those rows; restart protects realization authority because the referenced acceptance was removed.

This is separate from the accepted publication repair. Task 9.29.2's HistoricalPlan lifecycle, queue, lease, native terminal receipt, MessageChannel settlement, storage admission and controller semantics remain unchanged and their permanent regressions still run. Its guarantee must not be inferred for realization. The original blocked 9.29 execution, 9.29.1 proposal, acceptance ADR and accepted 9.29.2 RESULT/evidence remain unchanged.

Continuation §§8, 11–13 require existing automatic realization/retry and safe replacement continuations. Its §16 prohibits owner/transaction changes and explicitly requires this stop condition when they are necessary. No UI cancellation or new receipt can make an already-dispatched, unguarded owner write safe. No application, permanent test, schema, dependency or architecture file was changed.

## 2. Identity, baseline and governing evidence

The supplied continuation matches the existing `TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_AUTHORIZED_CONTINUATION.md` byte-for-byte. It was saved separately at the requested [CONTINUATION path](TASK_9.29_PLANNER_REVIEW_SCHEDULE_WORKFLOW_CONVERGENCE_V1_CONTINUATION.md). Sections 1–18 and the final statement were verified. No executed/conflicting continuation RESULT or continuation evidence directory existed. The original assignment is intentionally retained as the same task identity.

Entry HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`; **255 status entries / 1,359 tracked or unignored baseline files**, measured from the actual dirty working tree. No applicable AGENTS.md was found in the repository or ancestor locations. No skill or delegation was used. Baseline status/head/hashes are retained under [continuation evidence](evidence/task-9.29-continuation/REPRODUCTION_RESULT.md).

The focused check consulted the actual original task/blocked report/command map, publication acceptance ADR and immutable proposal provenance, 9.29.2 RESULT/writer inventory/regression matrix and relevant permanent tests, 9.17 §§44–52/capability ledger, current Review/readiness/publication/Proposal/realization/storage/controller implementations, and canonical Sleep/Structure/accepted-work fixtures. [Source provenance](evidence/task-9.29-continuation/governing-source-hashes-RESULT.json) identifies inspected and preserved reference versions. The remaining broad workflow-specific governing review was not completed after the mandatory stop; no full capability, ontology, correction or mobile acceptance is claimed from this focused check.

## 3. Current capability and receipt map

The [command and capability map](evidence/task-9.29-continuation/COMMAND_AND_CAPABILITY_MAP_RESULT.md) records existing entry, query/command, exact target, effects, outcomes and pending presentation for all current Review/Preview capability groups. Before/after reachability is identical: no useful command or legacy component was removed, hidden or retired.

Planner and Summary remain the two primary destinations. Review Plan remains contextual inside Planner. Current Review scope still uses current Preview bounds, otherwise saved configured Preview bounds; one-day visualization is independent of publication range. Typed `createReviewScope` / `publicationRangeFromReviewScope`, canonical date conversion and explicit saved-state generation remain unchanged. New period drafts, handoff, bounded disclosures, inclusive labels and Build composition remain unimplemented.

Readiness still derives from `queryPlanningReview`, `deriveScheduleReviewReadiness` and shared `publicationBlockers`. Pending offers remain distinct from accepted liabilities; history access/protection remains distinct from historical coverage. No second readiness policy, current-month default, automatic generation or new durable review flag was added.

Publication still carries the exact reviewed range, fingerprint and time through its repaired owner. The original completion object exposes a **non-enumerable** `receipt.isCurrent`; current Review checks it before accepting late feedback/refresh. No spreading/cloning or fabricated token was introduced. Proposal/realization results have their own contracts and do not acquire publication receipts by implication.

## 4. Constructive acceptance and realization diagnosis

`dayFrameStore` wires Proposal acceptance to `realizationSurface.realizeAcceptedAllocation` after the Proposal decision/allocation commits. Review also exposes that same existing realization method for explicit retry. The method checks ingress, exact accepted allocation, prior realization (`alreadyRealized`), V2 completeness, current foundation and occupancy before staging an atomic realization/fact mutation.

However, its `storage.mutate` call supplies no physical admission or lifecycle observer. After the await it installs the precomputed authority and returns `realized` without a replacement-lifetime check. The shared controller checks Structure and HistoricalPlan quiescence, not realization. Realization is a runtime snapshot/install participant, but that alone does not settle its outstanding writes.

This finding is not a claim that retry is absent or that eligibility should be inferred from missing facts. Both actual automatic orchestration and the existing explicit retry are demonstrated. Nor does it establish defects in every other owner or every phase of Proposal persistence.

## 5. Reproduction and exact observations

[Diagnostic source](evidence/task-9.29-continuation/realization-replacement-repro-RESULT.test.ts), [commands/fixture provenance](evidence/task-9.29-continuation/REPRODUCTION_RESULT.md), and [final diagnostic log](evidence/task-9.29-continuation/contract-repro-RESULT.log) retain five passing **defect-confirming** cases: one healthy control plus four unsafe orderings. They are intentionally outside the permanent test selection and are not labelled repaired regressions.

| Command in flight                  | Replacement result | Epoch | Realization transactions at replacement | Late outer result | Rows after release | Restart   |
| ---------------------------------- | ------------------ | ----- | --------------------------------------: | ----------------- | -----------------: | --------- |
| Acceptance → automatic realization | `cleared`          | 0 → 1 |                                       0 | `accepted`        |                  2 | protected |
| Acceptance → automatic realization | `restoredV14`      | 0 → 1 |                                       0 | `accepted`        |                  2 | protected |
| Explicit realization retry         | `cleared`          | 0 → 1 |                                       0 | `realized`        |                  2 | protected |
| Explicit realization retry         | `restoredV14`      | 0 → 1 |                                       0 | `realized`        |                  2 | protected |

Every case has exactly one delayed realization mutation attempt and one created realization transaction after release. No physical admission callback was supplied. Immediately after replacement, accepted allocations, runtime facts and physical realization rows are empty. After release, the original realization plus fact are physically durable and installed in runtime, while accepted allocations remain empty. Restart reports realization ingress `protected` and store readiness `protected / authorityInitializationFailed`. Reopening does not erase the orphan records.

Supporting setup uses actual Goal/Demand/Sleep authoring, allocation evaluation, Proposal derivation/recording and acceptance. The control realizes normally. The retry fixture retains acceptance after a controlled real-adapter admission denial for the first realization attempt; it does not fabricate a successful write or another acceptance. The race gate forwards the original rows and caller arguments to the real adapter after release. Incoming V14 is exported before acceptance and therefore legitimately excludes the displaced acceptance/realization.

Four observations files retain exact IDs, times, revisions, lineage, source acceptance, attempted rows, replacement and late outcomes, runtime adoption, physical readback and restarted protection. Equality assertions preserve record payloads and nested order; only top-level keyed lookup follows actual IndexedDB record identity. Independently reopened readers are created after command/replacement settlement, not as concurrent writers. These are deterministic fake-IndexedDB command experiments, not native-browser incidence or claims about preserved user data.

## 6. Missing contract and bounded next authority

The precise unresolved boundary is **existing realization write/adoption versus whole-authority replacement**, including automatic realization after a committed acceptance and explicit retry. An authorized owner decision must define admission/lifetime and replacement ordering through asynchronous opening, physical terminal state, runtime adoption and returned command outcomes. It must preserve valid acceptance, exact realization identity/lineage, foundation/occupancy checks, idempotent `alreadyRealized`, current recovery protection and compatibility.

This execution does not select a new queue/locking model, expand recovery, or copy publication's lifecycle wholesale. Entry-time UI disabling or ignoring late results would not address the demonstrated delayed physical write. Disabling existing retry/automatic realization would violate mandatory capability preservation. The accepted publication repair is not reopened.

## 7. Correction, Build, navigation and unfinished gates

The original [eighteen-group requirement matrix](evidence/task-9.29-continuation/REQUIREMENT_MATRIX_RESULT.md) maps retained foundation suites and this new diagnostic, with every unfinished continuation gate explicit. No new workflow regression is claimed merely because old suites pass.

Existing Friction → SuggestedFix → Try → explicit PlanDecision acceptance, accepted-correction inspection/removal/retry and first-class Sleep proof/geometry remain unchanged. New bounded repeated-Friction grouping, exact focused occurrence flow, stale/discard handling and Sleep mobile workflow were not implemented. No bulk correction, shortened Sleep, hidden acceptance or new retry eligibility was added.

Existing publish feedback retains sourceChanged, contextReplaced, publicationBusy, pendingPublication versus alreadyPublished, verified success, known precommit failure, postcommit verification failure, uncertain/unconfirmed and protection distinctions. The new “Build this Schedule” host, explicit final review and post-build canonical-day return are not delivered.

Goal, Requested Time, Structure, Measurement, Observation and Setup context are unmodified. New Review-owned range/filter/disclosure/selection/outcome context, request freshness, synchronous duplicate-action guards, navigation/focus/draft preservation and new replacement UI proof remain pending. The realization race must not be hidden behind a cosmetic navigation change.

## 8. Automated, production/mobile and validation

Baseline complete suite: **166 files / 1,718 tests passed, 182.90 seconds**. Final complete suite: **166 files / 1,718 tests passed, 179.18 seconds**. Both use `npm run test -- --maxWorkers=1`, without concurrent build/static jobs. All 9.29.2 permanent owner/adapter/controller/UI tests remain selected and unchanged. Diagnostic: **5/5 pass**, including healthy control and exact defect assertions. No timeout, existing assertion, test selection or repository configuration was weakened.

Production build, bundle hard gates, repository formatting, lint and typecheck pass. The isolated diagnostic initially hit Vite's external config-cache EROFS restriction; an approved retry succeeded. The first successful diagnostic was strengthened with exact physical/runtime row equality and post-restart preservation checks, then rerun successfully. This changed only new evidence, not production code.

**Mandatory new native/mobile acceptance was not performed.** No new 320/390/768/1280 workflow, UI acceptance/correction/Build, UI V14 round trip, focus/overflow/target/reflow or reduced-height certification is claimed. Previous 9.29.2 browser evidence is not a substitute. No physical-device, OS-dialog, soft-keyboard, screen-reader or native-zoom certification is claimed. This is an additional unfinished completion gate, not a reason to label the owner diagnostic native evidence.

## 9. Bundle and lazy boundaries

Fresh production measurements use the current dirty working tree. No application change occurred, so before/after values are identical.

| Measure            |    Before |     After | Delta |                Hard gate |
| ------------------ | --------: | --------: | ----: | -----------------------: |
| Initial raw JS     |   633,786 |   633,786 |     0 |                  685,000 |
| Initial gzip JS    |   166,306 |   166,306 |     0 |                  170,000 |
| Largest lazy chunk |    62,657 |    62,657 |     0 |                  100,000 |
| Total JS           | 1,279,887 | 1,279,887 |     0 | Existing advisory policy |

Initial-gzip headroom remains **3,694 bytes**. Existing initial-gzip 161,500 headroom advisory and total-JS 825,000 architecture-review advisory remain. Thresholds, dependencies, measurement scripts and lazy boundaries are unchanged. Commands/logs are retained in the reproduction guide/evidence.

## 10. Files, compatibility and preservation

[File manifest](evidence/task-9.29-continuation/FILE_MANIFEST_RESULT.md) enumerates every new artifact and purpose. [Preservation verification](evidence/task-9.29-continuation/preservation-RESULT.json) compares all baseline files, HEAD, the copied immutable input and prior repair source/evidence. All 1,359 baseline files remain unchanged, with none missing. No app or permanent test file was created or edited.

No reset, stash, commit, push, dependency installation, migration, schema/format/version change, historical cleanup, legacy-module deletion, recovery expansion or unrelated cleanup occurred. Database schema 11 and supported backup/readers remain unchanged. No preserved Dogfood Pass 02 state was opened, initialized, imported, cleared, migrated, repaired or normalized. Only disposable in-memory fixtures were authored/replaced. Evidence is retained locally in the repository; no commit or remote backup is claimed.

## 11. Resumption and determination

A separate authorized realization-owner contract/repair must resolve the demonstrated boundary and add permanent phase-selected regressions for automatic realization and explicit retry across clear/restore, including physical terminal/adoption and exact restart authority. Preserve publication isolation and current scheduling/acceptance semantics. Review its completed evidence before resuming this same original workflow task. Then finish the remaining governing review, capability ledger, all eighteen workflow groups, actual four-width native workflows and unchanged hard gates.

The continuation delivers a precise prerequisite diagnosis and retained evidence, not the requested converged Review interface. It does not retire Preview, complete protected-history recovery or Goal lifecycle, or close Phase 9.

**Task 9.29 — Planner / Review Schedule Workflow Convergence V1 remains PARTIAL/BLOCKED for the reasons documented in this continuation RESULT.**

**The task is complete when users can review an explicit period, make existing constructive and corrective decisions, understand accepted versus scheduled work, and explicitly build the reviewed schedule within Planner—while preserving repaired publication isolation, commit certainty, drafts, history, compatibility, mobile usability, and the two-primary-destination layout.**
