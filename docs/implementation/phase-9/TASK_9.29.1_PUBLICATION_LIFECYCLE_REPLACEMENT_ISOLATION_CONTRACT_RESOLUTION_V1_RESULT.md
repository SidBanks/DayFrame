# Task 9.29.1 — Publication Lifecycle & Replacement Isolation Contract Resolution V1 — RESULT

**Status: COMPLETE as a bounded architecture-resolution proposal. Acceptance and implementation pending.**

## 1. Delivered decision

Delivered the separate [Publication Lifecycle & Replacement Isolation Contract V1](../../architecture/PUBLICATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md), marked **PROPOSED — AWAITING ARCHITECTURAL ACCEPTANCE — NOT IMPLEMENTED**.

It selects one policy: capture origin before asynchronous dispatch; retain original epoch/generation through the existing serial publication queue; reserve replacement exclusion only when execution reaches the owner queue head; check physical admission after database opening; retain the reservation until native transaction terminal state, verification and owner settlement are established. Replacement checks publication and Structure quiescence before snapshots and returns busy without staging if either remains active. Displaced pre-execution intent rejects; active publication may settle first and then be replaced through an explicit retry of the replacement command.

The proposal specifies legacy pending/retry and initialization behavior, stale read/protection/notification exclusion, exact abort/rollback state under new lifetimes, privileged coordinator paths, runtime outcome additions and late-result identity. A runtime adapter terminal receipt distinguishes an unresolved live write from settled uncertainty. Uncertainty remains protected after the active reservation is released. No timeout claims cancellation. The contract preserves publication time, identity, atomic complete-day evidence, deduplication and existing restore/recovery representations; it recommends no migration or durable version increment.

Task 9.29 remains PARTIAL/BLOCKED. This task neither adopts the contract nor implements the repair or Review interface. Accepted 9.27.2 and 9.28 completion claims are unchanged.

## 2. Checkpoint and source versions

The existing immutable Task 9.29.1 input matched the supplied attachment byte-for-byte, contained Sections 1–18 and its final statement, and had no conflicting executed RESULT at entry. It remains a separate READY input, not this execution result. No applicable AGENTS.md was found. No skill or sub-agent was used.

HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Measured entry status: **242 entries**; captured baseline: **1,233 tracked/unignored files**. These measurements supersede assumptions based on earlier task counts for this execution only. The dirty working tree, not HEAD alone, is the executable source baseline.

The [governing-source hash manifest](evidence/task-9.29.1/governing-source-hashes-RESULT.json) pins actual repository source/evidence bytes. Governing inputs consulted include:

- Task 9.29 input/blocked RESULT, command map, reproduction guide, diagnostic/configuration, both observations, rejected early-dispatch evidence and governing versions.
- Accepted Structure owner-safety ADR and 9.27.2 RESULT, without extending their acceptance to publication.
- Historical Plan Ledger/Day-Publication ADR, relevant 3.12 surface/retry contract, current domain/fingerprint/projection/validation/materializer and storage sources.
- 9.7 explicit-publication RESULT, 9.9 certainty/readiness repair and 9.15 first-class Sleep publication RESULT plus current snapshot/materialization contracts.
- Cross-storage restore ADR/amendment, current runtime authority/controller/composition/coordinator and supported backup-transfer paths, plus 9.26 restore/recovery-readiness RESULT.
- Durable-data compatibility/versioning ADR and End-State Compatibility & Retirement specification; 9.28 RESULT status remains historical and unchanged.

Current public result unions, Review failure/success feedback and full-clear/import wiring were inspected. Older reports establish historical scope, not a blanket current API guarantee. In particular, current atomic publication differs from retained legacy pending acceptance. The detailed [writer/installer inventory](evidence/task-9.29.1/WRITER_INVENTORY_RESULT.md) classifies ordinary publication, read/install effects and privileged replacement separately.

No production source, existing test/configuration, existing architecture/input/evidence file or dependency was changed. No reset, stash, commit, push, dependency installation, migration, or preserved Dogfood Pass 02 state access occurred. Diagnostic storage consists of disposable fake-IndexedDB factories and memory localStorage. No browser profile was opened for this task.

## 3. Reproduced ordering and evidence limits

Exact byte copies of the retained 9.29 diagnostic/config ran in this task's separate evidence directory. Both defect-confirming cases passed. The config-loader runner flag avoids an external temporary-directory write; the diagnostic/config bytes remain identical to their originals.

For both cases: canonical Work/Sleep setup produced eligible Review; actual publication reached a gate before forwarding to the real storage mutation; actual replacement succeeded; empty HistoricalPlan was inspected before release; the old publication resumed and returned published; full history after reinitialization exactly matched the late-written history.

| Observation                            | Full clear                             | V14 restore                            |
| -------------------------------------- | -------------------------------------- | -------------------------------------- |
| Replacement result                     | `cleared`                              | `restoredV14`                          |
| Epoch                                  | 0 → 1                                  | 0 → 1                                  |
| Physical admission callback supplied   | false                                  | false                                  |
| Batches before gate release            | 0                                      | 0                                      |
| Late result                            | `published`                            | `published`                            |
| Late batch ID                          | `8c125ce3-8e56-4a90-b051-ed06e248bb94` | `bfd9d25b-af6a-446d-ac79-aeaa4c276f48` |
| Publication time                       | `2026-09-17T23:59:00.000Z`             | `2026-09-17T23:59:00.000Z`             |
| Batches after release/reinitialization | 1 / 1, exact equality                  | 1 / 1, exact equality                  |

Full IDs, ranges, source incarnations/revisions, and frozen Work/Sleep snapshots remain in the new observation JSON. The [diagnostic summary](evidence/task-9.29.1/diagnostic-summary-RESULT.json) records equality and output hashes. No success was mocked and eligibility was not bypassed.

The original earlier-dispatch hypothesis failed materialization after Sleep became incomplete. It remains separate from the confirmed later physical-write race. Source inspection confirms missing HistoricalPlan physical callback and before-snapshot quiescence. Other stale initialization/retry/notification failure modes motivate the proposed requirements but were not newly reproduced here. The 20-case future matrix is not an implemented acceptance suite. Controlled fake IndexedDB demonstrates the ordering, not native-browser incidence or the frequency of real-user harm.

## 4. Validation actually run

Installed toolchain: Node 22.23.2, npm 12.1.0, Vitest 4.1.5, Vite 8.0.10, TypeScript 6.0.3, Prettier 3.8.3, ESLint 10.2.1, fake-indexeddb 6.2.5, React 19.2.5 and jsdom 29.1.1. Exact commands and limits are in the [reproduction/validation guide](evidence/task-9.29.1/REPRODUCTION_AND_VALIDATION_RESULT.md).

| Check                                                       | Actual result                                                                                               |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Copied diagnostic                                           | PASS, 1 file / 2 cases; confirms existing defect                                                            |
| Relevant owner/controller/composition/publication/UI suites | PASS, 5 files / 49 tests                                                                                    |
| Initial mistyped focused paths                              | Only correctly named UI matched: PASS, 1 file / 8 tests; corrected owner run above supplies actual coverage |
| Code formatting                                             | PASS, `prettier --check .` in `code/`                                                                       |
| Lint                                                        | PASS                                                                                                        |
| Typecheck                                                   | PASS                                                                                                        |
| Production build                                            | PASS                                                                                                        |
| Bundle hard gates                                           | PASS, existing advisories retained                                                                          |
| First full suite, default worker settings                   | FAIL, 161 files passed / 2 failed; 1,679 tests passed / 4 failed; 63.26 seconds                             |
| Final full suite, one worker                                | PASS, 163 files / 1,683 tests; 165.41 seconds                                                               |
| New authored Markdown formatting                            | PASS, scoped Prettier check                                                                                 |
| Whitespace / baseline preservation                          | PASS; 1,233 unchanged, zero changed/missing baseline files                                                  |

The first full run had two 5-second timeouts and one missing restored-message failure in `GoalStructureAuthoring`, plus a missing `Scheduled: 13` button in `GoalRecordedInspection`. It ran without concurrent build/static jobs. Its complete log is retained. The final full run also ran without concurrent build/static work, using the command-line `--maxWorkers=1` setting. No tests, timeouts, configuration, dependencies or source were changed; no causal claim about the initial failures is made.

One fresh build measured **626,896 bytes initial raw JS; 164,266 bytes initial gzip JS; 62,657 bytes largest lazy chunk; 1,271,716 bytes total JS**. Initial gzip hard-gate headroom is **5,734 bytes**. Hard limits remain 685,000 raw / 170,000 gzip / 100,000 largest lazy. Existing initial-gzip headroom warning (161,500) and total-JS architecture-review advisory (825,000) remain. There is no new bundle growth or gate waiver. This single build represents before/after application size because every captured production input is byte-identical; it does not represent a repaired implementation.

No native browser/mobile acceptance is claimed. The repair handoff explicitly requires production UI publication/readback, actual V14 export/import/reload, clear verification and affected controls at 320/390/768/1280px, separately labelled from injected failures and source inspection.

## 5. Exactly one repair handoff and separate continuation

Recommend **Publication Canonical Owner Lifecycle and Replacement Isolation Repair**, without assigning a number. Its prerequisite is architectural acceptance of the separate proposal and implementation authorization. Contract §11 identifies all affected canonical owners, adapter/controller/composition/result consumers, exact future tests, current-surface feedback, native/mobile checks, unchanged bundle gates and exclusions.

Its scope includes the public lazy dispatcher, HistoricalPlan atomic and retained legacy paths, retry/initialization/protection/install state, physical terminal receipts, shared before-snapshot admission, private coordinator clear/restore mapping, and current Review/Utilities feedback. It excludes new Review layout/navigation, global locks, historical cleanup, durable migrations, Structure clock changes, new realization eligibility, domain expansion and capability retirement.

After that owner repair is reviewed and accepted, require a separate authorized Task 9.29 continuation. Preserve the blocked RESULT; recheck its command map; complete its original authoring/decision/correction/Build/mobile and native workflow gates. Neither this proposal nor accepted owner repair substitutes for those UI completion gates.

No material contract decision is left for an implementation task to choose between cancellation, blocking and replay: the phase table and 20-case matrix select the outcome at each controlled ordering. Architectural acceptance itself remains pending; the documented validation failures do not establish a missing architectural source or unresolved contract choice.

## 6. Artifact and preservation accounting

The two primary authored outputs are this execution RESULT and the separate PROPOSED contract at the paths specified by the task. All additional durable artifacts are under `docs/implementation/phase-9/evidence/task-9.29.1/`. Every new filename contains `RESULT`.

The [file manifest](evidence/task-9.29.1/FILE_MANIFEST_RESULT.md) enumerates every created durable artifact and its purpose. The final preservation evidence compares all 1,233 baseline files, verifies unchanged HEAD, confirms exact diagnostic copies, records new-path naming/scope, and checks headings/status/final statements in the actual output files. Generated ignored build/cache files are ordinary tooling products, not new source/evidence deliverables.

No earlier RESULT, ADR, observation or diagnostic was rewritten. The baseline dirty work remains intact. The task supplies a decision-ready proposal; publication is not claimed safe yet.

**Task 9.29.1 — Publication Lifecycle & Replacement Isolation Contract Resolution V1 is COMPLETE as a bounded architecture-resolution proposal. Architectural acceptance and implementation remain pending.**

**The task is complete when one concrete proposed contract establishes how publication admission, physical writes, verification, pending work, and replacement are ordered so displaced operations cannot repopulate cleared or restored history—while preserving publication identity, commit certainty, compatibility, and the existing recovery protocol.**
