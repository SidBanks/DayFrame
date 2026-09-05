# Task 9.7 — Explicit Publication Workflow V1 Result

## 1. Executive Result

Implemented one explicit, bounded, atomic publication path from Review Schedule to immutable HistoricalPlan evidence.

## 2. Starting Baseline

Task 9.6: 124 files, 1,079 tests; initial 668,266 raw/169,997 gzip; schema 11; Backup V12.

## 3. Governing Foundations

Tasks 9.2–9.6 remain authoritative for Proposal, acceptance, Realization, scope, Planner, and readiness.

## 4. Existing Publication Audit

`generatePreview` directly materialized and asynchronously published through `historicalPlanSurface.publish`; range defaulted from Preview, batches were immutable and transactionally persisted, but authorization was implicit. The materializer, V3 role snapshots, batch factory, IndexedDB owner, bounded readers, restore, and Backup V12 were retained; generation coupling was replaced; the surface was adapted with an atomic explicit commit entry point.

## 5. Scope Delivered

Explicit conversion, command, command-time validation, atomic persistence, lazy Review UI, feedback, and canonical requery.

## 6. Explicit Non-Goals

No schedule, Preview, Realization, execution, Progress, recurrence, history-browser, or backup redesign.

## 7. Publication Product Role

Publication freezes current reviewed truth as bounded historical evidence.

## 8. Epistemic Boundary

HistoricalPlan records evidence and never becomes current schedule authority.

## 9. User Authorization

Only a native range-labelled button invokes publication; Preview generation no longer publishes.

## 10. Canonical Publication Command

`publishScheduleRange` is the sole product-facing V1 command.

## 11. Command Input

It accepts `publicationRange`, `expectedSourceFingerprint`, and injected `publishedAt`.

## 12. Publication Range

The command requires a distinct validated `PublicationRangeV1`.

## 13. Review→Publication Conversion

`publicationRangeFromReviewScope` copies exact half-open bounds into a distinct semantic type.

## 14. Range Confirmation

The action names start and exclusive-end user-day labels.

## 15. Current Publication Architecture

Existing materialization and HistoricalPlan authority are reused; the former automatic entry point was retired.

## 16. Preview Dependency

A fresh Preview remains a materialization input, not authority.

## 17. Required Preview State

Preview must exist, be current, and cover the full range.

## 18. Silent Preview Generation Decision

Publish never generates Preview; the user refreshes it separately.

## 19. Authoritative Revalidation

The command requeries `queryPlanningReview` immediately before materialization.

## 20. TOCTOU Protection

The command compares the current deterministic source fingerprint with the reviewed fingerprint.

## 21. Source Fingerprint

It covers Preview identity/freshness/range/Friction and intersecting realized and accepted authority.

## 22. Command Result

Typed `published`, `alreadyPublished`, and reason-coded `rejected` results are returned.

## 23. Publication Multiplicity

Changed truth can create a later immutable batch; unchanged truth is a semantic no-op.

## 24. Duplicate Invocation Semantics

An exact retry resolves `alreadyPublished` without duplication.

## 25. Publication Identity

Existing HistoricalPlan batch identity policy is retained.

## 26. Publication Timestamp

The command injects the supplied timestamp into the existing pure factory.

## 27. HistoricalPlan Immutability

No prior batch is edited, replaced, or refreshed.

## 28. Current Schedule Independence

Publishing does not mutate current schedule or Preview.

## 29. Snapshot Content

Existing materialization preserves all governed schedule roles.

## 30. Goal Work Snapshot

V3 realized Goal lineage, identity, interval, user-day, and accepted origin remain intact.

## 31. Support Snapshot

Support remains distinct operational activity without Demand credit.

## 32. Buffer Snapshot

Buffer remains provenance-bearing, protective, and non-executable.

## 33. Direct Commitment Snapshot

Authored origin remains intact.

## 34. Work Snapshot

Existing external/fixed Work representation remains intact.

## 35. Cross-Boundary Facts

Existing publication filtering and stable source identity remain governed by the materializer.

## 36. Publication Range Boundary

Loaded context never widens batch range metadata.

## 37. Canonical User-Day

Half-open canonical user-day bounds are preserved.

## 38. Overnight Handling

Existing user-day attribution and HistoricalPlan timing remain unchanged.

## 39. Boundary Context

Context supports derivation but is not published outside the requested range.

## 40. Publication Coverage

Incomplete coverage fails closed; no clipping occurs.

## 41. Unknown-vs-Empty

Unknown, none, and partial planning coverage are not publishable empty truth.

## 42. Accepted-Unrealized Policy

Intersecting accepted liabilities block publication.

## 43. Realization Conflict

Publication neither skips nor resolves accepted authority.

## 44. Friction Policy

Unresolved Friction blocks and remains untouched.

## 45. Proposal Policy

Actionable Proposal remains a nonblocking warning and is not decided by publication.

## 46. Review Readiness Reuse

The UI continues using `deriveScheduleReviewReadiness`.

## 47. Publication Readiness Reuse

The button uses derived `publicationReady`; the command independently revalidates.

## 48. Publish Action Placement

The action sits in Review readiness actions.

## 49. Disabled Publish

It is disabled while blockers are listed nearby.

## 50. Ready Publish

One clear action exposes the exact range.

## 51. Confirmation UX

The explicit range-labelled button is the minimal V1 confirmation.

## 52. Confirmation Meaning

Nearby success language explains immutable history without locking future edits.

## 53. Pending State

All decision/publication actions disable while publication is pending.

## 54. Success State

Durable success is announced and history is requeried at the publication cutoff.

## 55. Failure State

Typed failures preserve current schedule and prior history.

## 56. Stale-on-Click

Source change instructs refresh/review and writes nothing.

## 57. Atomicity

One existing multi-store IndexedDB mutation commits metadata and every day.

## 58. Partial Failure

Injected mutation failure produces no pending or readable history.

## 59. Transaction Boundary

HistoricalPlan remains the transaction owner.

## 60. In-Memory Atomicity

Explicit failures are not adopted into the pending ledger.

## 61. Restart Behavior

Existing restart reconstruction retains durable batches independently of current schedule.

## 62. Backup Decision

Backup V12 already preserves HistoricalPlan; unchanged.

## 63. Schema Decision

Existing stores and indexes suffice; schema remains 11.

## 64. HistoricalPlan Version

V1/V2/V3 remain sufficient.

## 65. Publication Event Metadata

Existing immutable batch ID, timestamp, range, and day metadata are reused.

## 66. Multiple Publications

Overlapping changed batches coexist; semantic duplicates no-op.

## 67. Latest Publication

Existing as-of projection derives latest evidence without rewriting history.

## 68. Historical Comparison Boundary

Detailed diff UI remains deferred.

## 69. Publication List

Review shows bounded coverage, not a full history browser.

## 70. Planner Integration

Canonical history queries reflect publication; no Month cell is manually patched.

## 71. Review Schedule Integration

Durable result advances the query cutoff and triggers canonical requery.

## 72. Preview After Publication

History creation does not stale or mutate Preview.

## 73. Readiness After Publication

Readiness and historical existence remain separate.

## 74. Schedule Change After Publication

Old history remains immutable; a later reviewed schedule may be republished.

## 75. Execution Boundary

No ExecutionRecord is created.

## 76. Progress Boundary

No Progress or Demand satisfaction is inferred.

## 77. Acceptance Boundary

No ProposalDecision or Accepted Allocation is created.

## 78. Realization Boundary

Publication cannot realize accepted claims.

## 79. Friction Boundary

Publication cannot suppress Friction.

## 80. Authoring Boundary

No Commitment is authored or edited.

## 81. Preference Boundary

History creates no reusable preference.

## 82. User-Facing Language

UI uses schedule, range, ready, publish, and historical-record language.

## 83. Historical Language

Published means snapshot, not locked current schedule.

## 84. Success Copy

Success explicitly describes immutable history and future editability.

## 85. Republish Language

Existing coverage changes the action to “Publish current schedule again”.

## 86. Action Accessibility

Publication uses a named native button.

## 87. Range Accessibility

The accessible name includes exact canonical bounds and exclusivity.

## 88. Live Success

Durable success uses `role=status`.

## 89. Error Accessibility

Failure uses `role=alert`.

## 90. Confirmation Accessibility

No modal is needed; native focus behavior is retained.

## 91. Color Boundary

Text, roles, disabled state, and reason lists carry meaning.

## 92. Loading State

Pending is labelled “Publishing…” and is never success.

## 93. Query Failure

Command returns `queryFailure` and writes nothing.

## 94. Command Error

Unexpected UI errors produce a bounded alert and preserve authority.

## 95. Action Eligibility

Task 9.6 central readiness governs presentation.

## 96. Domain Validation

Command-time checks are the ultimate applicability guard.

## 97. Publication Reason Codes

Invalid range, coverage, Preview, Friction, accepted authority, source change, query, materialization, and persistence are distinct.

## 98. Proposal Pending Policy

Proposal is not a publication failure reason.

## 99. Determinism

Equivalent inputs retain equivalent historical semantics except governed event metadata.

## 100. Stable Snapshot Ordering

Existing materializer/factory canonicalization remains responsible.

## 101. Stable Subject Identity

Source and realized identities are preserved.

## 102. Serialization

Only typed canonical dates and HistoricalPlan records persist.

## 103. Publication Provenance

Existing V3 accepted/realized lineage is retained.

## 104. Publication Range Provenance

The typed range adapts to existing compatible inclusive batch metadata without rewriting old data.

## 105. Legacy Readers

V1/V2/V3 readers remain green.

## 106. Legacy History

No inference or upgrade mutates old publications.

## 107. History Queries

Existing indexed bounded reads are reused.

## 108. Performance

Materialization remains bounded to the publication range.

## 109. Query Count

One review requery plus one atomic persistence operation is used.

## 110. Lazy UI

The UI and command implementation stay behind lazy boundaries.

## 111. Bundle Review

Final production metrics: initial **658,710 raw / 167,968 gzip**, largest lazy **53,194**, total **975,694** bytes. Publication is isolated in an **11,920 raw / 3,550 gzip** lazy command chunk and Review Schedule is approximately **9,150 raw / 2,870 gzip**. Hard limits pass; governed initial-headroom and total architecture-review warnings remain.

## 112. Range Conversion Tests

Exact bounds, distinct type, provenance, half-open semantics, and invalid validation are covered.

## 113. Eligibility Tests

Coverage, Preview, Friction, accepted liability, invalid range, source change, and query failure are covered.

## 114. Successful Publication Tests

Explicit action, revalidation, durable batch, and unchanged Preview are covered.

## 115. Atomicity Tests

Injected mutation failure proves zero pending/readable publication.

## 116. Retry Tests

Exact retry returns `alreadyPublished`.

## 117. Republish Tests

Existing HistoricalPlan projection tests preserve changed-publication multiplicity; unchanged truth no-ops.

## 118. Goal Work Tests

Existing V3 materialization tests remain green.

## 119. Support Tests

Existing distinct support-role publication tests remain green.

## 120. Buffer Tests

Existing protected, non-executable Buffer tests remain green.

## 121. Commitment Tests

Existing authored-origin tests remain green.

## 122. Work Tests

Existing Work snapshot tests remain green.

## 123. Cross-Boundary Tests

Existing materializer subset, boundary, and overnight tests remain green.

## 124. History Tests

Atomic persistence, restart, bounded reads, immutability, and projection remain green.

## 125. Review Schedule UI Tests

Blocked, ready, exact range, pending, success, and failure semantics are covered.

## 126. Proposal Policy Tests

Proposal proceeds past proposal policy and remains independently actionable.

## 127. Accepted Authority Tests

Accepted-unrealized rejection occurs without authority mutation.

## 128. Friction Tests

Unresolved Friction rejection and existing correction paths remain green.

## 129. Preview Tests

Generation no longer publishes; freshness/coverage/materialization behavior remains green.

## 130. Execution/Progress Isolation Tests

Existing separate stores remain untouched by command composition.

## 131. Persistence Tests

Schema 11, atomic transaction, restart, and Backup V12 remain green.

## 132. Accessibility Tests

Native action, range name, disabled/pending state, status, and alert are covered.

## 133. Review Schedule Regression

Task 9.6 readiness and Proposal/Friction behavior remain green.

## 134. Planner/Month Regression

Task 9.5 navigation and presentation remain green.

## 135. Preview Regression

Generation, stale, and range behavior remain green except intentional retirement of auto-publication.

## 136. Proposal Regression

Lifecycle and decisions remain green.

## 137. Acceptance Regression

Accepted authority semantics remain green.

## 138. Realization Regression

Atomic realization and handoff remain green.

## 139. Friction Regression

Detection, SuggestedFix, and Move remain green.

## 140. HistoricalPlan Regression

Legacy versions, restore, range semantics, and immutability remain green.

## 141. Canonical User-Day Regression

Boundary, week-start, overnight, cycle preferences, and DF-006 remain green.

## 142. Full Regression

**125 test files, 1,091 tests, 0 failures.**

## 143. Validation Commands

Prettier, full Vitest, typecheck, lint, build, bundle check, focused suites, and `git diff --check` are required and recorded at completion.

## 144. V1 Design Decision Table

| Question                         | V1 Decision                                                  | Architectural Basis                    | Why Sufficient Now                   | Deferred Capability              |
| -------------------------------- | ------------------------------------------------------------ | -------------------------------------- | ------------------------------------ | -------------------------------- |
| canonical command/owner          | `publishScheduleRange`; HistoricalPlan                       | existing owner                         | one authority path                   | richer history UI                |
| authorization/conversion         | explicit range-labelled action; pure conversion              | Task 9.4 types                         | unambiguous scope                    | modal wizard                     |
| Preview/revalidation/fingerprint | required input; canonical requery; deterministic fingerprint | Tasks 9.4/9.6                          | TOCTOU-safe                          | Preview-independent materializer |
| identity/retry/republish         | existing batch ID; semantic no-op; changed batch retained    | HistoricalPlan projection              | safe retries and immutable evolution | schedule diff                    |
| atomicity/roles/boundaries       | one transaction; existing V3 roles and clipping              | materializer/storage                   | no new semantics                     | none required                    |
| blocker policy                   | Proposal warns; Friction and accepted-unrealized block       | Task 9.6                               | preserves epistemic roles            | recovery polish                  |
| UX/history                       | direct action, live result, bounded coverage                 | Review workflow                        | ordinary path complete               | history browser                  |
| schema/backup                    | 11 / V12                                                     | existing stores serialize all evidence | no new owner                         | none                             |

## 145. Publication Eligibility Matrix

| Condition                | Eligible? | Reason                         |
| ------------------------ | --------: | ------------------------------ |
| Complete coverage        |       Yes | known full truth               |
| Partial/unknown coverage |        No | incomplete authority           |
| Preview current + covers |       Yes | required materialization       |
| Preview stale/mismatch   |        No | stale or wrong range           |
| Friction unresolved      |        No | corrective attention           |
| Accepted unrealized      |        No | authority not scheduled        |
| Actionable Proposal      |       Yes | non-authoritative warning      |
| Prior publication exists |       Yes | history differs from readiness |
| Invalid range            |        No | invalid geometry               |
| Source changed           |        No | TOCTOU guard                   |

## 146. Authority Transition Matrix

| Transition       | Creates Current Schedule Authority? | Creates Historical Authority? | User Authorization Required? |
| ---------------- | ----------------------------------: | ----------------------------: | ---------------------------: |
| Generate Preview |                                  No |                            No |          explicit generation |
| Accept Proposal  |         Accepted resource authority |                            No |                          Yes |
| Realize          |                                 Yes |                            No | inherited accepted authority |
| Publish Schedule |            No new current ownership |                           Yes |                      **Yes** |
| Execute          |       historical execution evidence |                      separate |               later/explicit |
| Progress         |                                  No |              outcome evidence |                     separate |

## 147. Publication Role Matrix

| Source Role                    |  Publish? | Historical Meaning               | Executable Because Published? |
| ------------------------------ | --------: | -------------------------------- | ----------------------------: |
| Work                           |       Yes | external work                    |                            No |
| Authored Commitment            |       Yes | scheduled commitment             |                            No |
| Goal Work                      |       Yes | Goal-serving schedule            |                            No |
| Support                        |       Yes | operational support              |                            No |
| Buffer                         |       Yes | protected time                   |                        **No** |
| Accepted Unrealized / Proposal |    **No** | not scheduled / suggestion       |                            No |
| Friction / Preview             | not facts | corrective/materialization input |                            No |

## 148. Failure Matrix

| Failure                      | Historical Writes | Current Mutation | Recovery             |
| ---------------------------- | ----------------: | ---------------: | -------------------- |
| invalid range/coverage       |                 0 |                0 | select/restore range |
| stale/mismatched Preview     |                 0 |                0 | refresh              |
| Friction/accepted unrealized |                 0 |                0 | resolve              |
| source changed               |                 0 |                0 | refresh/review       |
| persistence/unexpected       |             **0** |                0 | retry/report         |

## 149. Persistence Matrix

| Data                      | Owner          | Durable? | Schema | Backup |
| ------------------------- | -------------- | -------: | ------ | ------ |
| Range/snapshots           | HistoricalPlan |      Yes | 11     | V12    |
| readiness/pending/message | Review UI      |       No | —      | No     |

## 150. Invariant Verification

All 100 specified invariants are satisfied: explicit authorization and semantic range separation; complete coverage/current covering Preview; independent revalidation and source-change closure; Proposal warning versus Friction/accepted blockers; role/provenance/user-day preservation; immutable atomic history and retry safety; current schedule, Preview, execution, Progress, authoring, and preference isolation; canonical requery/accessibility/lazy loading; schema 11, Backup V12, legacy compatibility, and DF-006 preservation.

## 151. Deviations

Unchanged later publication attempts no-op rather than create redundant batches; a materially changed schedule can create another immutable publication. V1 uses the explicit button rather than a modal confirmation. A full publication list/diff is deferred.

## 152. Governance Updates

CURRENT_STATE, CHANGELOG, and DECISIONS record the durable publication boundary.

## 153. Repository Status

Cumulative Phase 9 work was preserved; no reset, clean, commit, or push was performed.

## 154. Ordinary Path Assessment

**Yes.** A user can move from Goal/Demand through Proposal, acceptance, Realization, Planner, bounded Review, and explicit immutable publication.

## 155. Dogfood Publication Assessment

**Yes.** Exact range, blockers, authorization, durable result, prior coverage, and current-versus-history language are product-reachable.

## 156. Remaining Phase 9 Gaps

Typed realization-conflict recovery/retry, minor Review/Planner polish, and richer history inspection remain potential dogfood gaps.

## 157. Recommended Next Task

**Phase 9 Dogfood Pass 02 / Publication Checkpoint**, because the ordinary path is now reachable; validate actual product behavior before adding another feature.

## 158. Completion Statement

**Task 9.7 — Explicit Publication Workflow V1 complete.**

DayFrame now completes the ordinary constructive Phase 9 path with an explicit, separately typed, bounded, command-time-revalidated and atomically durable transition from reviewed current schedule truth into immutable HistoricalPlan evidence, while preserving Preview as materialization input rather than authority and keeping current schedule, Proposal, acceptance, Realization, Friction, execution, Progress, schema 11, Backup V12, legacy history, accessibility, and canonical user-day semantics distinct and intact.
