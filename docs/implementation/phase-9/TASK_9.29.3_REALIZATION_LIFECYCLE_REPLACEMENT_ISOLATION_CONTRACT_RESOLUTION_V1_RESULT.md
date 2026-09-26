# Task 9.29.3 — Realization Lifecycle & Replacement Isolation Contract Resolution V1 — RESULT

**Status: COMPLETE as a bounded architecture-resolution proposal — architectural acceptance and implementation pending.**

## 1. Bounded outcome

Produced one concrete [Realization Lifecycle & Replacement Isolation Contract V1 proposal](../../architecture/REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md), marked **PROPOSED — AWAITING ARCHITECTURAL ACCEPTANCE — NOT IMPLEMENTED**. Its selected ordering uses a nonqueued realization execution lease, original-lifetime automatic handoff, before-snapshot replacement exclusion, physical admission/native terminal evidence, complete-set verification and truthful runtime outcomes/currentness.

The bounded read-only review also independently demonstrates an **earlier Proposal acceptance-persistence gap**. The proposal identifies it separately and explicitly includes the minimum common Proposal-write lifecycle boundary in one recommended acceptance-to-realization repair slice. It does not silently assume acceptance has committed in every in-flight phase or leave that dependency to implementation choice.

No application, existing test, configuration, dependency, architecture, task input or earlier evidence was changed. Task 9.29 remains PARTIAL/BLOCKED. Task 9.29.2's accepted publication repair and Structure's accepted rules are not reopened. This task implements no Review interface, earns no native/mobile workflow acceptance, and authorizes no recovery or historical correction.

## 2. Identity and measured baseline

The repository input `TASK_9.29.3_REALIZATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_RESOLUTION_V1.md` matches the attachment byte-for-byte. Sections 1–18 and the final statement were checked. No executed/conflicting 9.29.3 RESULT, proposal or evidence directory existed. Every newly written durable filename contains RESULT; the existing immutable input remains untouched.

Actual entry HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`. Current dirty working tree: **258 status entries / 1,390 tracked or unignored files**. Baseline head, exact status and file hashes are retained. No applicable AGENTS.md was found in the repository or ancestor locations. No skill or sub-agent was used.

## 3. Governing versions and inspection

[Source hashes](evidence/task-9.29.3/governing-source-hashes-RESULT.json) pin the actual working-tree versions. The governing chain includes:

- Original 9.29 input/publication-blocked RESULT; exact authorized continuation input/blocked RESULT and retained command/requirement/source inventories.
- Continuation diagnostic, five-case log and all four observations; copied source/config are byte-identical, new runs write here only.
- Publication acceptance ADR, immutable proposed publication contract and accepted 9.29.2 RESULT/inventory/regressions. The proposal hash remains `0d578e820645f8fb023e35fec501501f9582809f185ee9801c69e076a47393f5`.
- Task 9.3 realization task/RESULT, 9.2 acceptance, 9.2.1 complete footprint, and 9.2.2 scheduled-identity contracts/results: separate transactions, exact complete V2 authority, deterministic role identity, Buffer semantics, idempotence and immutable history.
- Current Proposal persistence/automatic callback, lazy façades, realization owner/domain staging/validation, canonical Sleep/foundation/occupancy, storage adapter, controller, restore participants/translation/recovery/bootstrap, and current Review/accepted-evidence consumers.
- Accepted Structure owner-safety ADR and 9.27.2 RESULT/tests; cross-storage restore ADR/amendment, durable compatibility/versioning ADR and End-State Compatibility & Retirement specification.

Current source establishes executable behavior; the historical 9.3 result establishes semantics and the bounded tests that existed then, not universal concurrency guarantees. The [writer/handoff inventory and Review coverage ledger](evidence/task-9.29.3/WRITER_HANDOFF_AND_COVERAGE_LEDGER_RESULT.md) separates new demonstrated orderings, named existing regressions, source inspection and unverified boundaries. Inspection of correction, publication and editor handoffs continued after the independent finding.

## 4. Reproduced original orderings

[Reproduction guide](evidence/task-9.29.3/REPRODUCTION_AND_VALIDATION_RESULT.md) identifies exact commands, fixture provenance, controlled seams and evidence limits. The untouched copied diagnostic passed **5/5**: healthy control and automatic/retry × clear/V14. A separate detail-only derivative passed the same five cases while retaining all requested phase snapshots and separate outer/inner outcomes. Neither is a repaired-behavior test.

| Original path                                     | Replacement   | Epoch | Realization attempts / created transactions before release | Late outer / inner                  | Physical rows after release | Restart   |
| ------------------------------------------------- | ------------- | ----- | ---------------------------------------------------------- | ----------------------------------- | --------------------------: | --------- |
| Accepted Proposal → automatic realization → clear | `cleared`     | 0 → 1 | 1 / 0                                                      | accepted / realized                 |                           2 | protected |
| Accepted Proposal → automatic realization → V14   | `restoredV14` | 0 → 1 | 1 / 0                                                      | accepted / realized                 |                           2 | protected |
| Retained acceptance → explicit retry → clear      | `cleared`     | 0 → 1 | 1 / 0                                                      | realized / realized (direct result) |                           2 | protected |
| Retained acceptance → explicit retry → V14        | `restoredV14` | 0 → 1 | 1 / 0                                                      | realized / realized (direct result) |                           2 | protected |

The paused phase is after accepted-target/foundation/occupancy checks and staging, at adapter invocation before delegation/native transaction creation. Immediately after replacement, accepted allocations, runtime realization facts and physical rows are empty. Release forwards the original rows and adapter arguments: one physical transaction then writes the original realization and fact. No admission callback was supplied. Old runtime authority is adopted; independent reopen sees the same exact rows. Restart protects realization ingress and overall store readiness (`authorityInitializationFailed`) because acceptance no longer resolves.

The retry fixture establishes its retained acceptance through a real earlier realization admission failure, then calls actual explicit retry without another acceptance. The automatic acceptance had already committed before its realization gate: outer accepted is a historical operation outcome, not proof that scheduling remains current. Four detailed observations retain exact accepted target, phase, pre-release authority, mutation/transaction counts, outer/inner outcomes, runtime/durable sets and independent startup state. IDs, timestamps, revisions, lineage, geometry and nested order are not blanket-normalized.

## 5. Independently demonstrated and source-inspected findings

The four-case [extended diagnostic](evidence/task-9.29.3/extended-contract-repro-RESULT.test.ts) passed:

1. **Earlier Proposal commit → clear:** actual acceptance is paused after revalidation but before its Proposal transaction. Clear returns cleared. The old Proposal whole-image write then commits/adopts accepted authority; outer acceptance is accepted, inner realization is inapplicable because the cleared foundation no longer qualifies. This is acceptance resurrection even though no new realization succeeds.
2. **Earlier Proposal commit → V14:** restore of the actual pre-acceptance backup succeeds; old Proposal authority then reinstalls acceptance and automatic realization succeeds against restored foundation. This is distinct from the original already-committed handoff.
3. **Same-acceptance automatic plus concurrent explicit retry:** both create a physical transaction. Deterministic IDs leave one fact, but do not serialize the commands or guarantee whole-array adoption safety.
4. **Healthy canonical multi-role control:** actual footprint authoring/association, allocation and acceptance produce required productive, support and Buffer claims. One realization plus three exact role facts persists and reloads ready; original geometry/claim linkage is preserved. This is valid fixture evidence, not full multi-role fault/atomicity certification.

Source inspection separately identifies precomputed authority-array adoption, unspecialized init/install generations, Preview-based occupancy callback freshness limits, and the absence of realization quiescence from shared begin. The proposal resolves these paths prospectively. Distinct-ID lost runtime updates, arbitrary stale init/protection, and every Proposal command alias were not separately reproduced; they remain source-inspected and future regression requirements. No other owner is declared defective from a naming/mechanism difference.

## 6. Selected lifecycle, concurrency and handoff

The separate proposal's §§3–7 are the complete phase model and physical evidence contract:

- Capture owner/operation, epoch and Proposal/realization generations before lazy dispatch. Freeze target input. Automatic scheduling carries the **original acceptance lifetime**, including across acceptance revalidation, persistence/adoption and callback dispatch. Restored equivalent IDs do not renew it. Fresh explicit retry is a new command on current accepted authority.
- Proposal common writes get their own nonqueued lease through physical terminal, exact full-image verification, adoption and notification. All shared writer aliases participate; destructive owner replacement uses the shared controller. This explicitly addresses the independently demonstrated earlier gap without altering Proposal decision policy.
- Release the Proposal lease before invoking realization; no nested wait/deadlock. Replacement may win at this handoff. Outer committed acceptance stays a historical outcome with a stale receipt; inner realization rejects contextReplaced without writes.
- Realization acquires one lease before asynchronous owner checks/storage opening. A concurrent same- or distinct-acceptance command returns realizationBusy, never a queued/joined or already-realized success. New explicit calls after settlement inspect current facts and either alreadyRealized, realize exact nonconflicting geometry, or return canonical conflict/inapplicability.
- Existing source/foundation/occupancy evidence is captured separately from lifetime. Pure synchronous post-open admission checks owner, origin, lease, ordinary protection/readiness, attempt openness, exact acceptance/base and saved-source witness. Changes before that point reject without writing; later authoring does not retroactively cancel a physically admitted operation and may require Review.
- Native terminal proof keeps replacement excluded. Known no-transaction throw with a closed callback and required observer, or actual abort, is safely no-write; committed/lost acknowledgment remains unconfirmed/protected. Complete durable realization/fact-set verification is required for new or already-realized command success. No old whole-authority array may overwrite current state.

Publication's supported queue and existing certainty/MessageChannel implementation remain unchanged. Realization's own selected nonqueued and no-pending-overlay model is explicit, not copied from publication by default.

## 7. Coordinator, outcomes, initialization and compatibility

Proposal §9 defines clear, modern restore/V14, internal/exposed begin, attached/standalone direct owner clear/replacement, private epoch installs, abort/rollback and startup recovery. Shared begin requires Structure, HistoricalPlan, Proposal-write and realization quiescence before snapshots/staging. Live work returns busy without advancing epoch; quiescent protection returns structured protected denial. Ready begin closes admission before reentrant callbacks. Snapshot failure/begun abort keep lifetime invalidation. Full clear retains existing cleared/partial/failed semantics; restore retains existing journal, staging, verification, translation, rollback and recovery authority.

Proposal §8 maps current domain results and concrete runtime additions: sourceChanged, realizationBusy, replacementBusy, contextReplaced, unavailable/protected and commit/verification uncertainty. Every completion preserves its original non-enumerable receipt. Proposal acceptance uncertainty has its own unconfirmed result, not false “not recorded”; current Review and retry consumers require exhaustive typed handling. No receipt is assumed to exist today on realization/Proposal results.

Initialization, lazy-shell installation, reads/protection and deferred notifications bind to generation/epoch and exact installed/protection instance. No automatic replay follows abort/recovery. Known-failed Proposal desired-image retry remains exact and lifetime-scoped; realization retry uses the current immutable acceptance and deterministic fact identities, never a legacy pending overlay. Uncertain attempts remain protected and cannot be blindly retried.

**Compatibility decision: no migration, schema or durable version change.** Same Realization V1, all role facts, complete Accepted V2/legacy distinctions, schema 11, V14/supported historical readers and existing staging/journal payloads. Only process-local coordination and runtime outcomes change. Complete-set proof preserves semantic identity/lineage, not merely keys. Existing orphan data remains preserved/protected; no invented acceptance, row deletion, validator relaxation or retrospective affected-data classifier. Profiles remain independent authored setup and may change source freshness without replacing accepted/realized authority.

## 8. Future tests and one repair handoff

Proposal §12 contains all **22 numbered phase-selected regression cases**, with one selected outcome, allowed writes, preserved evidence and test layer. Additional adjacent Proposal commit, exact desired retry, private capability, source-witness and multi-role tests are mandatory. These are proposed tests, not claims of implementation. The full existing publication/Structure suite must remain intact.

Recommend exactly **one next bounded acceptance-to-realization lifecycle/replacement owner repair slice**, with no task number assigned. Require a separate acceptance ADR pinning the proposal hash and explicitly authorizing the adjacent Proposal common-write guard; then repair the named lazy façades/owners/store composition, runtime types, coordinator participation and affected current consumers. Preserve all domain semantics, accepted publication infrastructure, current source policies and existing recovery limitations.

Native repair gates must include actual existing UI acceptance with automatic realization, explicit retry, multi-role durable readback, V14 export/import/re-export/reload, full clear/reload, and truthful busy/protected/unconfirmed/currentness feedback at the affected viewport widths. Controlled native-delivery seams must be labelled. A successful ordinary import alone cannot prove isolation. No new Review layout, bulk action, Goal lifecycle, recurrence, time release/replacement, Found Time, recovery/abandonment UI, dependency or retirement is included.

## 9. Fresh validation and bundle

- Copied original diagnostic: **5/5 pass**.
- Detailed original-ordering derivative: **5/5 pass**.
- Extended bounded diagnostic: **4/4 pass**.
- Relevant existing suites: **8 files / 75 tests pass**.
- Final complete suite: **166 files / 1,718 tests pass**, 170.82 seconds, one worker.
- Fresh repository formatting, lint, typecheck and production build: pass. Whitespace and new-artifact/readback/preservation checks are retained.

The initial full run passed 1,717/1,718. Its existing `GoalStructureAuthoring` related-navigation/V14 test did not observe restore success within its wait. The unchanged isolated suite passed 27/27. No cause was established; the complete suite was repeated, still one worker and without concurrent build/static jobs. No source, assertion, timeout, configuration or selection was changed. The initial new multi-role fixture omitted required expected association revision; supplying the actual existing revision fixed that fixture without weakening assertions. Both failures are retained separately.

All reproduction commands and final/material intermediate logs are in the evidence guide. The runner config loader permitted isolated diagnostics without external bundled-config cache writes; no dependency or existing configuration changes were needed.

One fresh production build establishes before and after because every production input is hash-unchanged. These are current measurements, not copied historical values or predictions of the future repair:

| Measure            |    Before |     After | Delta |                Hard gate |
| ------------------ | --------: | --------: | ----: | -----------------------: |
| Initial raw JS     |   633,786 |   633,786 |     0 |                  685,000 |
| Initial gzip JS    |   166,306 |   166,306 |     0 |                  170,000 |
| Largest lazy chunk |    62,657 |    62,657 |     0 |                  100,000 |
| Total JS           | 1,279,887 | 1,279,887 |     0 | Existing advisory policy |

Gzip headroom: **3,694 bytes**. Existing 161,500 initial-gzip headroom and 825,000 total-JS architecture-review advisories remain. Lazy façades and synchronous lightweight origin shells are likely repair touch points; importing realization/Proposal/foundation or verification engines eagerly through store/UI context risks this small headroom. Keep existing lazy boundaries and measure the repair early. No threshold increase or future bundle estimate is proposed.

## 10. Files, preservation and evidence limits

[File manifest](evidence/task-9.29.3/FILE_MANIFEST_RESULT.md) lists every created artifact and purpose. [Preservation evidence](evidence/task-9.29.3/preservation-RESULT.json) verifies all 1,390 baseline files unchanged and none missing, unchanged HEAD, exact immutable input and byte-identical copied diagnostic/config. All original observations/logs, both blocked 9.29 executions, proposed/accepted publication records and accepted Structure evidence remain intact.

No reset, stash, commit, push, dependency installation or unrelated cleanup occurred. No preserved Dogfood Pass 02 state was opened/initialized/imported/cleared/migrated/repaired/normalized. Fixtures use disposable memory storage/fake IndexedDB; independent reopen follows settlement. Evidence is repository-local, not a commit or remote backup.

No native/browser/mobile authoring, physical device, OS dialog, soft keyboard, screen reader, native zoom, cross-tab writer safety, real-user incidence or affected-data classification was established by this proposal task. The healthy multi-role control does not replace future complete-footprint failure/uncertainty tests. No unverified ledger row is promoted to safety evidence.

## 11. Decisions, acceptance and resumption

There is no material ordering choice deferred to the repair: lease timing/release, busy rather than queue/join, automatic lifetime inheritance, earlier Proposal commit participation, source linearization, terminal/verification certainty, result/currentness, retry/init/protection, and compatibility are selected in the complete proposal. Architectural acceptance of that concrete scope remains pending; this RESULT does not adopt it. Implementation must stop for a genuinely different policy or incompatible representation rather than treating it as signature plumbing.

Task 9.29 may resume only after accepted contract, separate repair authorization and reviewed repair evidence. Its next continuation needs a **new distinct input and RESULT path**, preserving both prior blocked executions. Review the acceptance-to-realization chain end to end, reconcile the bounded Review coverage ledger, resolve or explicitly disposition demonstrated independent blockers, finish the stopped governing/capability review, and retain all original correction/Build/navigation/draft/native/mobile requirements. Realization is not asserted to be the final possible blocker or completion of Phase 9.

**Task 9.29.3 — Realization Lifecycle & Replacement Isolation Contract Resolution V1 is COMPLETE as a bounded architecture-resolution proposal. Architectural acceptance and implementation remain pending.**

**The task is complete when one concrete proposed contract defines how acceptance handoff, automatic and explicit realization, physical writes, runtime adoption, and replacement are ordered so displaced operations cannot reinstall orphan scheduled facts—while preserving valid acceptance, exact realization identity, current scheduling checks, compatibility, and existing recovery protection.**
