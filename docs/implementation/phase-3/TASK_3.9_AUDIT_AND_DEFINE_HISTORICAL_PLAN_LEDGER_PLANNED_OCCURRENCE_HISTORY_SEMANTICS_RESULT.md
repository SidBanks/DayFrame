# Task 3.9 — Historical Plan Ledger / PlannedOccurrence History Semantics Result

## 1. Executive Determination

A durable HistoricalPlan ledger is necessary for truthful historical denominators. V1 is architecturally defined, but implementation must wait for transactional collection storage.

## 2. Artifact Integrity

The supplied and saved artifacts were byte-identical. SHA-256: `ebe4598f4dd69e9644cf67c9035aa7a480c243377f3da1fefefa999a1d7da01f`.

## 3. Governing Evidence

Phase 2 planning checkpoint, Phase 3 execution/progress checkpoints, Tasks 3.7–3.8, current Preview lifecycle, PlanDecision replay, ExecutionHistory, durable references, backup/profile formats, and durability architecture.

## 4. Repository Audit Method

Inspected production generation/regeneration, Try/stale flags, accepted decision flows, materialization, current coverage, persistence surfaces, recovery, tests, and governance documents.

## 5. Historical Denominator Problem

Never-reported planned occurrences leave no durable trace after Preview replacement; scheduler replay cannot reconstruct them truthfully.

## 6. Preview Historical Status

Current derived operative plan, replaceable and non-durable; not history itself.

## 7. PlanDecision Historical Status

Current accepted occurrence authority, not an audit log. Removed/superseded results are not retained.

## 8. ExecutionRecord Snapshot Limitation

Freezes context only for subjects that receive an execution report.

## 9. Ledger Necessity Determination

Required before arbitrary historical reporting coverage or plan follow-through.

## 10. Candidate Models

Bare occurrence ledger, arbitrary-range publication, complete-day publication, full Preview snapshot, and no-ledger/report-only limit were compared.

## 11. Occurrence Ledger Assessment

Efficient joins but ambiguous absence/removal; rejected alone.

## 12. Range Publication Assessment

Atomic context but costly overlapping duplication and complex resolution; rejected as primary authority unit.

## 13. Day Publication Assessment

Complete absence semantics, simple overlap, semantic user-day ownership, and localized corruption; selected.

## 14. Chosen V1 Model

Independent HistoricalPlanSurface containing append-only atomic generation batches of complete day publications.

## 15. Publication Boundary

Successful fresh authoritative Preview generation/regeneration.

## 16. Fresh Preview Semantics

Represents the operative plan because no stronger whole-plan publish action exists.

## 17. Try Preview Semantics

Never publishes.

## 18. Stale Preview Semantics

Never publishes.

## 19. Initial Publication

Initial fresh generation publishes requested-scope day facts.

## 20. Accepted-Regeneration Publication

Fresh regeneration after accepted/removed decisions publishes effective replay results.

## 21. Identical Publication Dedup

Canonical semantic day fingerprint suppresses an identical latest day revision.

## 22. Plan Revision

Meaningful day-plan change appends an immutable publication.

## 23. Plan Supersession

Later publication becomes operative for its day/as-of query; earlier revisions remain.

## 24. Effective Plan Query

Latest valid day publication with `publishedAt <= asOf`; exact future metric cutoff remains separate policy.

## 25. Publication Identity

Independent UUID batch/publication identity plus canonical UTC `publishedAt`.

## 26. Planned Occurrence Identity

Day publication identity plus DurableOccurrenceReference identifies one planned version.

## 27. DurableOccurrenceReference Relationship

Correlates semantic occurrences across publications and ExecutionHistory; lifetime-safe but insufficient without frozen publication context.

## 28. Snapshot Schema

Dedicated versioned plan snapshot: reference, family/title/category, user-day context, plan state, and scheduled interval when real.

## 29. Scheduled State

Persisted with canonical UTC start/end; future actionable follow-through candidate.

## 30. Unplaced State

Persisted without interval; excluded from follow-through.

## 31. Omitted State

Persisted effective accepted omission; excluded from follow-through.

## 32. Blocked State

Persisted without fictional interval; excluded from follow-through.

## 33. Removal/Absence Semantics

Absence from a later complete day publication withdraws prior operative presence.

## 34. Source Lifetime

Exact incarnation retained; readable IDs never retarget.

## 35. Same-Lifetime Mutation

New publications freeze changed display/plan facts; old snapshots remain unchanged.

## 36. Source Deletion

Old plan remains readable.

## 37. Source Recreation

New incarnation creates distinct plan identity.

## 38. Profile Activation

New source lifetimes/publications; old history remains.

## 39. Backup V1

Fresh lifetimes; no rewrite.

## 40. Backup V2

Restored lifetimes may recur but old publications never merge/rewrite.

## 41. Active Abandonment

Independent historical ledger remains unless full clear.

## 42. PlanDecision Relationship

Ledger freezes effective replayed plan state, not decision IDs/current records.

## 43. Try/SuggestedFix Boundary

Temporary geometry and SuggestedFix IDs never publish.

## 44. ExecutionHistory Join

Durable reference joins one execution subject to possibly several plan revisions.

## 45. Historical Reporting Coverage

Ready only after valid ledger coverage; all version-policy-reportable states may form its denominator.

## 46. Historical Follow-Through Readiness

Ledger supplies facts; later explicit metric policy selects actionable scheduled denominator and temporal cutoff.

## 47. Historical Plan Correction

No V1 manual correction UI. Later publication is a real revision; advanced correction remains deferred.

## 48. User-Day Semantics

Complete authority unit is frozen semantic user day; cross-midnight occurrence belongs once.

## 49. Week-Start Semantics

Freeze `weekStartsOn` at publication.

## 50. Timezone/DST

Freeze day boundary/offset; scheduled instants remain UTC. No 24-hour-day assumption.

## 51. Preview Buffer Boundary

Only requested visible range publishes; hidden expansion excluded.

## 52. Publication Range/Day Authority

Batch records requested range; each contained day is independently complete authority.

## 53. Overlapping Publication Resolution

Resolve latest per day before `asOf`; different ranges do not duplicate semantic authority.

## 54. Publication Atomicity

One Preview generation batch commits atomically.

## 55. Corruption/Quarantine Model

Day publication is smallest complete component; corrupt latest day makes affected scope unavailable, never silent fallback. Envelope/version failure protects whole source.

## 56. Persistence Surface

Independent HistoricalPlanSurface, outside Active, Profiles, PlanDecision, and ExecutionHistory.

## 57. Version Independence

Independent surface/publication/snapshot versions.

## 58. Durability/Retry Recommendation

Own desired checkpoint, observable durability, exact retry, subscriptions, ingress protection, export, and clear.

## 59. Storage Growth

Potentially many occurrences per day plus revisions; grows faster than ExecutionHistory.

## 60. LocalStorage Suitability

Unsuitable for indefinite ledger scale, atomic batches, and indexed temporal queries.

## 61. IndexedDB Recommendation

Preferred transactional collection foundation, ideally shared with long-lived ExecutionHistory.

## 62. Privacy

Highly sensitive intended-activity history; indefinite retention requires explicit clear/export and no silent trimming.

## 63. Export/Clear

User export includes it; full clear deletes it.

## 64. Backup V3 Implication

Wait until Phase 3 durable surfaces stabilize, then include Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan.

## 65. Backfill Policy

No fabricated historical backfill. Current fresh Preview may publish prospectively at adoption.

## 66. Ledger Start-Date/Gaps

Coverage begins at first durable publication; missing app use, failed writes, protection, and corruption are explicit gaps.

## 67. Historical Metric Completeness

Metrics must expose ledger coverage/gaps; missing publication never means no plan.

## 68. HistoricalExecutionTarget Future Integration

Ledger may later enable retroactive reporting after source/decision loss; no current change.

## 69. Goal Boundary

Ledger does not create Goals or Goal mapping.

## 70. Learning Boundary

Ledger facts may later supply plan features, never outcome labels or silent authority mutation.

## 71. Architectural Invariants

All 18 required invariants were adopted/refined in the checkpoint, plus batch atomicity and semantic deduplication.

## 72. Terminology

Internal: HistoricalPlanSurface, PlanPublicationBatch, HistoricalPlanDayPublication, HistoricalPlannedOccurrenceSnapshot. “Published plan” means durably preserved operative plan, not user-visible social publication.

## 73. Confirmed Findings

Fresh/unrevised authority is distinguishable; generation is current operative-plan boundary; current durable surfaces cannot reconstruct never-reported denominators; localStorage is explicitly bounded.

## 74. Proposed Architecture

Transactional collection storage → pure plan domain → independent ledger publication/persistence → Backup V3 → separately authorized historical metrics.

## 75. Unresolved Questions

Exact historical follow-through cutoff, advanced plan-history correction, archival UX, storage quotas, and future imported-calendar identity remain deferred.

## 76. Deferred Work

Ledger implementation, storage migration, historical metrics/UI, Goals, learning, Backup V3, backfill, and source-family expansion.

## 77. Checkpoint Publication

Published `CHECKPOINT_Phase_3_Historical_Plan_Ledger_Semantics.md`.

## 78. ADR

Published `ADR_HISTORICAL_PLAN_LEDGER_AND_DAY_PUBLICATION_SEMANTICS.md`.

## 79. Governance Updates

Updated `CURRENT_STATE.md`, `DECISIONS.md`, and `ROADMAP.md`.

## 80. Recommended Task 3.10

Option C: **Task 3.10 — Audit and Implement Phase 3 Durable Collection Storage Foundation** before ledger domain/persistence implementation.

## 81. Validation Performed

Read-only production/test/document audit and `git diff --check`. No production/test code changed for Task 3.9, so no implementation suite is claimed.

## 82. Final Completion Determination

Complete. Ledger necessity, complete-day model, publication/revision/identity/state/time/lifecycle/recovery/storage/backup/gap semantics, invariants, governance, and implementation sequence are explicit without implementing plan history.

## Required Matrices

| Model | Denominator-safe | Revision-safe | Storage cost | Complexity |
| --- | ---: | ---: | ---: | ---: |
| Bare occurrence ledger | No; absence ambiguous | With tombstones only | Low | High lifecycle complexity |
| Whole arbitrary-range publication | Yes | Yes | Very high overlap duplication | High query complexity |
| Complete day publication | Yes | Yes | Moderate | Moderate/simple overlap |
| Persisted Preview object | Accidentally | No stable schema | Very high/noisy | High coupling |
| No ledger | No historical denominator | N/A | None | Product limitation |

| Trigger | Historical authority? | Reason |
| --- | ---: | --- |
| Fresh generation | Yes | Current operative plan boundary |
| Stale Preview | No | Inputs changed |
| Try Preview | No | Temporary unaccepted geometry |
| Accepted regeneration | Yes | Effective accepted authority replayed |
| Save Setup | No | Does not establish generated plan |
| First execution report | No | Too late for never-reported entries |
| Day rollover | No | Browser execution is unreliable |

| State | Persisted in ledger? | Interval present? | Follow-through eligibility |
| --- | ---: | ---: | ---: |
| Scheduled | Yes | Yes | Future eligible |
| Unplaced | Yes | No | No |
| Omitted | Yes | No | No |
| Blocked | Yes | No | No |

| Transition | Historical plan effect |
| --- | --- |
| Same-lifetime source update | New publication freezes new facts; old unchanged |
| Source deletion | Old publications retained |
| Source recreation | New lifetime, no retarget |
| Profile activation / Backup V1 | New lifetimes and future publications |
| Backup V2 | Restored lifetimes do not rewrite history |
| PlanDecision accept/remove | Effective change appears only in fresh regeneration publication |
| Try/SuggestedFix | No publication |
| Active abandonment | Ledger retained |
| Full clear | Ledger deleted |

| Surface | Current role | Historical role | Backup V3 inclusion |
| --- | --- | --- | ---: |
| Active | Current authored setup | None | Yes |
| Profiles | Reusable patterns | None | Yes |
| PlanDecision | Current accepted planning authority | None directly | Yes |
| ExecutionHistory | Reported execution evidence | Immutable execution revisions | Yes |
| HistoricalPlanLedger | None for current scheduling | Published operative plan authority | Yes |
