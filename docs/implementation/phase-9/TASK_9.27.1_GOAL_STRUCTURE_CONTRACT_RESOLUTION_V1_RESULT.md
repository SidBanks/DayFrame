# Task 9.27.1 — Goal Structure Contract Resolution V1 — RESULT

## 1. Bounded outcome

Delivered one [proposed contract](../../architecture/GOAL_STRUCTURE_TEMPORAL_COMPATIBILITY_AND_OWNER_SAFETY_CONTRACT_V1_PROPOSED_RESULT.md) covering temporal applicability, durable compatibility, Milestone patch fidelity and complete ordinary mutation admission. Its status is **PROPOSED — AWAITING ARCHITECTURAL ACCEPTANCE — NOT IMPLEMENTED**.

The recommendation preserves the existing supported durable representations and every revision row, separates temporal qualification from decoding, rejects future backward-clock writes, preserves lifecycle timestamps during metadata edits, and adds bounded generation/write-boundary protection to the existing owner/transaction infrastructure. All design choices are selected; architectural acceptance is pending. No implementation began.

Task 9.26 remains accepted COMPLETE. Task 9.27 remains PARTIAL/BLOCKED; its UI, Mobile Acceptance and fidelity gates have not passed. This resolution does not change either historical RESULT.

## 2. Identity, baseline and governing sources

No conflicting executed 9.27.1 assignment was found. The existing immutable input `TASK_9.27.1_GOAL_STRUCTURE_CONTRACT_RESOLUTION_V1.md` matches the attachment byte-for-byte and contains §§1–18 and the final completion statement.

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Actual starting status: **206 entries**; **1,040 tracked/unignored files** were copied and hashed before writing outputs. No applicable AGENTS.md was found in the repository or checked ancestor locations. Exact status, HEAD and hashes are retained under `evidence/task-9.27.1/`. The final comparison verifies all 1,040 baseline files unchanged, with none missing.

Governing repository sources were the 9.27 input/blocked RESULT and retained diagnostic/configuration/observations/provenance; Structure architecture specification RESULT; Task 8.2 RESULT; durable compatibility and cross-storage restore ADRs; Goal authority identity/lifecycle ADR; Task 8.1 planning provenance/freshness contract; Tasks 9.24–9.26 RESULTs and permanent regressions; End-State Compatibility/Retirement §6; Product Ontology §§4–6 and Appendix B Goal, Generated Plan, historical evidence and provenance definitions. The proposal distinguishes their normative requirements from observed implementation and new recommendations. No broader future Structure capability was assumed implemented.

Source inspection covered `goalStructure.ts`, the surface and lazy adapter, current/exact validators and queries, public store admission/bootstrap/full-clear wiring, IndexedDB mutation/open boundaries, runtime transaction/controller epochs, restore participants/translators, backup transfer and V7→V14 validation chain, Requested Time projection and freshness, constructive evaluation, GoalPlanning subscriptions and proposal acceptance revalidation. Current source is the dirty working-tree baseline identified by hashes, not merely HEAD.

## 3. Reproduced observations versus inspected behavior

The original diagnostic was copied into the new evidence directory before rerunning, so old observations were not overwritten. It again reproduced:

- A hard prerequisite created October 1; owner clock rolled back to September 23; eligibility still ineligible; retirement durably accepted with end before start; reinitialization returns identical authority.
- A Milestone satisfied September 24 and renamed September 25; current `satisfiedAt` changes, while exact prior revision remains preserved.
- Creation rejected under denied mutation callback, but Milestone revision accepted.

The extended diagnostic directly reproduced denied relationship revision and retirement acceptance, plus persistence retry writing successfully. Exactly **three denied storage mutation calls** were observed; retry created no new revision. These observations are captured as diagnostic defects, not approved behavior.

Source inspection additionally established: revision/retirement/retry paths omit admission; public replacement/clear and initialization need distinct ordinary/coordinator treatment; lazy calls await loading; storage mutation awaits database opening before transaction creation; runtime epoch is not exposed while inactive; full clear begins a shared transaction and then calls participant clears; restore stages/rechecks/verifies exact authority. No delayed native write race, real-user anomaly or native-browser finding is claimed from those inspections.

## 4. Chosen resolution and compatibility rationale

The proposal defines half-open intervals, valid empty intervals, absent unbounded ends, explicit current-authority evaluation and separate active/retired status. Retired records are not revived for a past instant; exact revision access does not manufacture historical Goal lifecycle knowledge. Command times are actual samples checked against recorded owner timestamps; rollback rejects rather than clamping or guessing.

Keep the V1 Structure authority/rows, database schema 11, current V14 complete backup and supported readers. Add no migration or new backup number. The existing reader continues accepting supported representations; a separate all-revision temporal qualification preserves anomalies but returns unknown eligibility and blocks ordinary Structure mutations. Export and coordinator restore retain exact evidence, with explicit qualification after install. Unsupported data keeps its existing protection/rejection behavior. This is a lossless preservation/unsafe-activation distinction, not a stricter ingress validator disguised by unchanged keys.

A new runtime derived-query version identifies the applicability contract. Planning consumes one explicit evaluation instant independent of its horizon, detects time-only boundary changes and revalidates at acceptance. Existing accepted/realized/published records are never retroactively rewritten.

Milestone metadata patches retain satisfiedAt/retiredAt exactly unless an explicit supported state transition occurs. Already affected records are not automatically repaired from history. This is independently a prospective command correction with no format change.

Admission covers every ordinary write path, including retry and public replacement/clear. The proposed bounded extension exposes the existing epoch, captures lazy-call tokens, serializes unresolved Structure writes, rechecks after storage open and before transaction creation, and rejects coordinator begin as busy before snapshot if ordinary persistence remains in flight. Capability-bearing coordinator writes bypass ordinary inactive-state requirements only for their matching epoch. No new journal, migration, global lock, polling loop or event bus is proposed.

## 5. Decision tables and implementation consequences

The proposal contains the required compatibility matrix (§6), Milestone patch/transition matrix (§7), all-write-path and async-boundary contract (§8), and future regression table (§9). They specify owner, observable result, allowed writes, preserved evidence and permanent test layer for ordinary/rollback writes, all interval boundaries, nonlatest anomalies, time-only changes, metadata/transition patches, denied writes, pending operations, import/readiness boundaries, exact round trips, unsupported historical reconstruction and immutable accepted history.

These tables are **future acceptance requirements**, not claims of repaired test results. Their changes reach the canonical owner, lazy/store adapter, existing transaction/storage admission seams, Structure restore qualification, Requested Time projection/freshness and proposal revalidation. A disabled control or entry-time boolean is expressly insufficient. Broader accounting, reparenting, lifecycle, automatic Milestones and scheduling dependencies remain excluded.

## 6. Validation actually performed

Installed toolchain only; no dependency installation, source/configuration/test edits, assertion weakening or timeout changes.

- `npm test -- --maxWorkers=2`: **159 files / 1,590 tests passed**, 84.46 seconds.
- Diagnostic command with native config loader: **1 file / 2 diagnostic cases passed**, confirming existing defects.
- Selected existing Structure/domain/persistence/planning/backup/transaction and Tasks 9.24–9.26 UI suites: **10 files / 50 tests passed**, 13.02 seconds; exact selection and output retained in validation evidence.
- `npm exec prettier -- --check .`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run check:bundle`, and `git diff --check`: passed.
- New proposal/report/evidence formatting was checked separately; application formatting was not rewritten. The first broad artifact-format invocation included plain-text baseline files and returned “no parser”; the corrected invocation selects only supported extensions and leaves those exact text captures untouched.

| JavaScript metric  | Fresh measured baseline | Final unchanged application | Delta | Hard limit / remaining |
| ------------------ | ----------------------: | --------------------------: | ----: | ---------------------: |
| Initial raw        |                 623,114 |                     623,114 |     0 |       685,000 / 61,886 |
| Initial gzip       |                 163,250 |                     163,250 |     0 |        170,000 / 6,750 |
| Largest lazy chunk |                  62,652 |                      62,652 |     0 |       100,000 / 37,348 |
| Total              |               1,226,690 |                   1,226,690 |     0 |               Advisory |

One verified build serves both measurements because production inputs are unchanged. Initial-gzip advisory 161,500 and total architecture-review advisory 825,000 (warning 800,000) remain; no threshold was raised. No post-repair bundle size is predicted. No new native-browser/mobile evidence was produced; Task 9.26 browser success is not reused as Structure authoring proof.

## 7. Exact new artifacts and preservation

Created only:

1. `docs/architecture/GOAL_STRUCTURE_TEMPORAL_COMPATIBILITY_AND_OWNER_SAFETY_CONTRACT_V1_PROPOSED_RESULT.md` — decision-ready, unaccepted contract.
2. This execution RESULT.
3. Under `docs/implementation/phase-9/evidence/task-9.27.1/`:
   - `contract-repro-RESULT.test.ts` — copied original plus extended owner diagnostic.
   - `contract-repro-config-RESULT.mjs` — isolated test selection, outside production/default test discovery.
   - `contract-observations-RESULT.json` — new run of original observations.
   - `admission-observations-RESULT.json` — extended denied-write observations.
   - `baseline-head-RESULT.txt`, `baseline-status-RESULT.txt`, `baseline-hashes-RESULT.json` — preservation baseline.
   - `validation-RESULT.json` — exact commands, material logs, file comparison and measurements.
   - `PROVENANCE-RESULT.md` — reproduction instructions and evidence limits.

The immutable task input predated the baseline and was not rewritten. Every new durable output includes RESULT in its filename. All existing production/test source, accepted specifications/ADRs, inputs, historical RESULTs and evidence remain byte-identical. No Dogfood Pass 02 state was opened or mutated. No reset, stash, commit, push, schema/dependency/migration or recovery change occurred. Artifacts are repository-local and uncommitted, not remotely backed up; retained evidence does not depend exclusively on `/tmp`.

## 8. One handoff and resumption checklist

Recommend exactly one next slice, without assigning a task number: **Goal Structure canonical-owner temporal qualification, patch fidelity and mutation-admission repair**. It requires explicit acceptance of the proposed contract. Its scope, production owners, no-migration compatibility policy, rollback/protection behavior, permanent regressions and current production-browser planning/restore evidence are specified in proposal §10. It excludes the unimplemented Structure UI.

After that repair passes, resume 9.27 through an explicit continuation referencing the accepted contract and repair RESULT. Refresh the baseline and command/query map; preserve its blocked RESULT; implement the original focused authoring/navigation slice; verify all fidelity/history/late-operation/restore tests; and pass its full 320/390/768/1280 mobile, accessibility, UI export/import/reload, full-suite and bundle gates. Neither proposal completion nor owner repair waives those requirements.

There is no unresolved design choice hidden as an implementation detail. Architectural acceptance and implementation are intentionally pending, and Task 9.27 remains blocked until the accepted foundation repair and its own resumed work succeed.

**Task 9.27.1 — Goal Structure Contract Resolution V1 is COMPLETE as a bounded architecture-resolution proposal. Architectural acceptance and implementation remain pending.**
