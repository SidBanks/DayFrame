# Task 9.29.2 — Publication Canonical Owner Lifecycle & Replacement Isolation Repair V1 — RESULT

**Status: COMPLETE — bounded foundation repair; Task 9.29 remains pending.**

## 1. Bounded implementation and acceptance

Implemented the accepted publication lifecycle/replacement-isolation contract through the existing HistoricalPlan owner, collection adapter, runtime controller and restore composition. The separate [acceptance ADR](../../adr/ADR_PUBLICATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_V1_RESULT.md) was written before application edits. It pins the immutable proposal SHA-256 `0d578e820645f8fb023e35fec501501f9582809f185ee9801c69e076a47393f5` and explicitly accepts healthy queueing behind an executing publication.

Publication captures its origin before lazy dispatch, retains it through canonical Review/materialization and queueing, and reserves replacement exclusion only while executing. Clear/restore cannot begin snapshots or staging while publication or Structure remains nonquiescent. Already-started writes reach native terminal state and owner settlement before release; terminal uncertainty becomes protected admission, not unexplained permanent busy. Waiting displaced intent rejects without writing or deduplicating against replacement data.

Task 9.29 workflow convergence remains pending a separate authorized continuation and acceptance. The original blocked report, 9.29.1 proposal, accepted Structure repair and 9.28 completion records remain unchanged. No new Review layout/navigation or recovery authority was introduced.

## 2. Baseline, governing sources and scope

Measured entry HEAD: `c0cc9ae2ae68af626e64747539a417f10df1cf3a`; **245 status entries and 1,264 baseline tracked/unignored files**. The existing Task 9.29.2 input (whose repository filename contains a space after `9.29.2`) matched the attachment exactly and contained Sections 1–18/final statement. No conflicting executed assignment existed. No applicable AGENTS.md was found; no skill or sub-agent was used.

The actual dirty working tree establishes executable behavior. [Governing hashes](evidence/task-9.29.2/governing-source-hashes-RESULT.json) pin the accepted proposal and prior 9.29/9.29.1 reports/reproductions/inventory, accepted Structure ADR/9.27.2 evidence, HistoricalPlan domain/surface/day-publication contracts, 9.7/9.9/9.15 publication/Sleep results, cross-storage restore ADR/amendments and 9.26 recovery evidence, compatibility/versioning and retirement specifications, current sources and relevant consumer regressions.

Baseline single-worker suite passed **163 files / 1,683 tests**, 182.92 seconds. A fresh baseline build/bundle was measured before application changes. No reset, stash, commit, push, dependency installation, schema migration, unrelated cleanup or preserved Dogfood Pass 02 access occurred. All fixture databases/profiles/origins are disposable.

## 3. Final lifecycle and writer/consumer map

The [final writer/installer/result-consumer inventory](evidence/task-9.29.2/WRITER_AND_CONSUMER_MAP_RESULT.md) identifies every bounded path: public lazy dispatch, query/materialization, atomic/legacy queue, deduplication, physical mutation, verification/adoption, exact retry, initialization, read/protection effects, clear/abandonment, runtime installation/notifications, shared begin, restore/rollback/startup recovery, current result slot and Review/Utilities consumers.

Origins are unique process-local objects recognized by their owner and capture epoch/generation. Requested input and queued candidates are cloned. Runtime install, clear and abort restoration invalidate generations; shared begin advances epoch before snapshot callbacks, even if capture later fails. Coordination objects never enter runtime authority snapshots or durable payloads.

Healthy B may join the queue after A has physically started. Only the queue head leases execution; waiting entries have no overlay or exclusion. At dequeue, lifetime/admission and source checks precede semantic no-op. Current durable identity returns existing no-op; pending-only identity returns `identicalPending` → `pendingPublication`. A queue exception cannot poison later lawful work.

The storage callback runs after database open and synchronously before transaction creation/enqueue. It checks active origin/lease, captured epoch/generation, ordinary admission/protection, attempt-open state and the original source witness. The optional receipt observer is registered when native terminal handlers exist, before requests; existing callers remain compatible. Enqueue exceptions abort and await terminal. Request or transaction error notification alone is not terminal.

A lost/thrown acknowledgment closes admission. No started receipt means delayed delegation cannot subsequently start a transaction; a started receipt must terminate. A MessageChannel task checkpoint after proven native termination lets ordinary promise delivery drain; absent outward acknowledgment is conservatively classified uncertain. This is not a timeout declaring cancellation, and it never promotes terminal knowledge into verified success. If native terminal never arrives, the fence stays. Lease release additionally requires verification/classification, pending/metadata/protection disposition, evidence capture and synchronous result recording/notifications.

## 4. Certainty, retry, initialization and replacement

Preserved validation/source rejection, known precommit failure, verified durable publication, durable no-op, postcommit verification failure, uncertain commit and unexpected-unconfirmed copy. Atomic known failure creates no legacy overlay. Existing factory `publish(batch)` retains exact accepted pending identity/time/range/frozen days on known failure. Retry joins the queue and persists that accepted record without rematerialization; uncertain attempts are not ordinary retryable pending data.

New runtime results explicitly distinguish `contextReplaced`, `publicationBusy`, `identicalPending`/`pendingPublication`, and structured protected replacement denial. Completion receipts are non-enumerable runtime envelopes, never serialization fields. Current last-result recording occurs within matching settlement; displaced stored/late results cannot present current publication success or refresh replacement Review.

Initialization caches are lifetime-scoped and check after asynchronous reads. Its possible flush is scheduled only after initialization resolves and enters the same queue. Replacement/abort invalidation suppresses displaced automatic flush; exact abort-restored pending requires fresh explicit retry. Read, metadata, protection-evidence and notification continuations check lifetime; stale reads return explicit unavailable/contextReplaced. Protection capture also checks its exact loading instance. Recheck/export remain read-only evidence operations, not readiness unlocks.

The central controller combines Structure and HistoricalPlan quiescence before scheduler/snapshot work. Busy denial causes no epoch/snapshot/staging/write. Quiescent protected history returns structured protection. Ready begin closes admission and advances epoch before capture; snapshot failure never restores an old lifetime. Full clear uses private capability/matching epoch and retains cleared/partial/failed semantics. Attached direct clear shares that boundary; standalone clear has its narrower local scope. Existing explicit protected abandonment rechecks exact raw evidence under exclusion and does not bypass a live physical write.

Restore/rollback/startup recovery retain the existing journal/staging/source checks, combined IndexedDB replacement, localStorage reread/anti-resurrection, exact recovery payloads, runtime translation/install and finalization. Composition retains its private epoch guard and forwards the optional observer. No new permissive recovery path was added where protected source capture was already unsupported.

## 5. Permanent regression coverage and repaired original orderings

[All twenty contract cases and mandatory subassertions](evidence/task-9.29.2/REGRESSION_MATRIX_RESULT.md) map to permanent tests and retained native evidence. New coverage uses deterministic deferred actual store/adapter operations, not mocked publication success. Existing publication/materializer/Sleep/Structure/restore/clear/Goal/Progress/backup suites remain in the complete selection.

Both original delayed-write reproductions now assert: eligible canonical Review → publication reaches pre-real-mutate gate inside lease → clear/V14 first attempt busy → unchanged epoch/current state, one attempted publication call and zero created physical transactions → release → exactly one verified publication transaction → explicit replacement retry succeeds → exact intended empty HistoricalPlan survives reinitialization. The separate pre-lease cases allow replacement to win and reject old intent with `contextReplaced`, including identical backup content/reused identities, abort, failed snapshot, rollback and recovery-required lifetimes.

Additional tests cover healthy B arriving after native transaction creation; pending-only duplicate versus durable no-op; native atomic abort and exact legacy retry; pre-delegation throw and zero later transaction creation; thrown/lost acknowledgment with terminal fencing; indefinitely lost outward promise after real native completion; stale metadata/init/protection/notification callbacks; private clear capabilities; queued retry after successful clear; exact abort-restored pending; source checks before no-op; and result recording/notifications still inside the lease.

## 6. Current UI, native/mobile and evidence limits

Current Review explicitly explains context change, busy replacement and pending-only publication while preserving certainty/protection copy. Late displaced success cannot install feedback or refresh current Review. Utilities distinguish busy/protected/unknown clear and busy restore, release button busy state on failure, preserve drafts on rejected clear, close the rejected confirmation, restore Clear focus, and keep subsequent import feedback visible. Goal editing resets only after accepted clear. A scoped CSS change raises affected Review actions from the observed 40px to at least 44px; navigation/layout remains unchanged.

Native production execution used a fresh Chromium profile, source port 4970 and distinct destination port 4971. Supporting canonical seeding authored Work, first-class Sleep, one routine and a linked Goal. Actual UI controls performed publication, complete V14 download/upload/re-export/reload, a fresh changed-source publication after restore, and full clear/reload. Complete backup `data` compared exactly, without collection normalization; only export metadata outside `data` was excluded. Native historical row comparisons preserve exact IDs/time/range, optional absence and frozen Work/Sleep/Goal evidence.

A controlled native completion-event delivery seam held the receipt of a real committed publication. Actual clear and V14 import returned busy; authority and an independent Goal-title draft remained intact. Release allowed settlement, then a new explicit clear/confirmation left history empty after reload. This is labelled controlled event delivery, not spontaneous browser failure. Pending/protected/uncertain/context presentation additionally uses labelled consumer-result seams; permanent owner/adapter tests establish their durability/admission behavior.

Twenty-six measurements cover **320/390/768/1280px** plus **320×420** reduced-height keyboard/reflow. No measured document horizontal overflow; minimum checked primary target **44px**. Narrow screenshots were visually inspected: textual feedback wraps, remains reachable, and focus is visible. The final keyboard observation has a **2px solid outline**. Final native exceptions: **none**. No physical-device, OS-dialog, soft-keyboard, screen-reader or browser-native-zoom certification is claimed. This certifies affected existing surfaces, not the unimplemented 9.29 workflow layout.

## 7. Validation and bundle

Final full-suite result: **166 files / 1,718 tests passed, 172.24 seconds**. Formatting, lint, typecheck and production build pass; final whitespace/preservation checks are recorded with the manifest. Full-suite execution uses one worker, complete test selection and unchanged timeouts/configuration, without concurrent build/static jobs. [Reproduction/validation guide](evidence/task-9.29.2/REPRODUCTION_AND_VALIDATION_RESULT.md) records exact commands, fixture provenance, intermediate failures and resolutions. Material logs are retained; no assertion was weakened to obtain a pass. The first full run passed 1,717/1,718: the existing Sleep stale-source regression still expected a storage failure. It now requires the exact accepted pre-storage `rejected/sourceChanged` outcome while preserving its zero-write and ready-state assertions. Focused Sleep and the repeated full suite passed; production code did not change for this assertion correction.

| Bundle measure     | Measured before | Measured after |  Delta |               Hard limit |
| ------------------ | --------------: | -------------: | -----: | -----------------------: |
| Initial raw JS     |         626,896 |        633,786 | +6,890 |                  685,000 |
| Initial gzip JS    |         164,266 |        166,306 | +2,040 |                  170,000 |
| Largest lazy chunk |          62,657 |         62,657 |      0 |                  100,000 |
| Total JS           |       1,271,716 |      1,279,887 | +8,171 | Existing advisory policy |

Initial gzip headroom is **3,694 bytes**. Existing 161,500 initial-gzip headroom and 825,000 total-JS architecture-review advisories remain; hard gates pass. No threshold increase, dependency or unrelated bundle restructuring. Lazy boundaries remain.

## 8. Files, preservation, compatibility and continuation

[File manifest](evidence/task-9.29.2/FILE_MANIFEST_RESULT.md) enumerates every modified/created repository artifact and its purpose; final task-relative hashes distinguish this work from pre-existing dirty changes. Task-relative changes comprise 16 baseline code files plus four new source/test files. All 1,248 other baseline files, including historical inputs/ADRs/RESULTs/diagnostics/observations, are unchanged; no baseline file is missing and HEAD is unchanged. No commit or remote backup is claimed. Durable evidence is retained in the repository, not exclusively `/tmp`.

Database schema remains 11. HistoricalPlan surface/batch/day/snapshot representations and supported readers, V14 backup, staging and journal formats remain unchanged. No migration, durable version increment, persisted token, history cleanup/classifier, Structure clock-policy change, Goal/domain expansion, new realization eligibility or capability/module retirement occurred. Publication time, identity, complete-day atomicity, semantic deduplication and frozen evidence retain their meaning. The guarantee is one participating registered store/owner in one live realm; it is not cross-tab/multiple-writer safety.

To resume Task 9.29: retain its original blocked RESULT; review/accept this bounded repair RESULT and evidence; authorize a separate continuation; refresh its capability/command map; then complete its full authoring/decision/correction/Build/mobile/native workflow gates. This repair does not substitute for those gates.

**Task 9.29.2 — Publication Canonical Owner Lifecycle & Replacement Isolation Repair V1 is COMPLETE. Task 9.29 workflow convergence remains pending explicit continuation and acceptance.**

**The task is complete when publication origin, queued intent, physical writes, verification, pending work, and replacement follow the accepted ordering so displaced operations cannot repopulate cleared or restored history—while preserving publication identity, commit certainty, supported data, existing recovery authority, and truthful current-surface feedback.**
