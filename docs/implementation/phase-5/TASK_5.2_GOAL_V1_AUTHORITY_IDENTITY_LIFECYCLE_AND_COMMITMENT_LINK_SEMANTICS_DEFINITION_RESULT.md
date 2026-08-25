# Task 5.2 — Goal V1 Semantics Definition Result

## 1. Executive Determination
Goal V1 is architecture-ready. Adopt an independent versioned durable collection with one never-reused opaque ID, revision counter, authored lifecycle, Goal-owned incarnation-exact links, no hard delete, and no scheduling effect. Next: Task 5.3 Goal Authority Foundation and Durability V1.
## 2. Artifact Integrity
The 2,597-line supplied/saved copies match; SHA-256 `a05d733f1f792042fa781159f4b2ceb933cf96cf1bc73fae6023acec33e9c274`.
## 3. Audit Scope
Goal semantics, identity, lifecycle, links, validation, persistence, recovery, historical provenance, and sequencing; no implementation.
## 4. Sources Reviewed
Phase 4 closure, Task 5.1, governance/ADRs, current authored types, incarnation/reference models, five authorities, Backup/restore/clear transaction, Planner.
## 5. Current Authored-State Audit
Active contains incarnated shifts/cycles/templates/recurrences/manual events; Profiles serialize non-authoritative patterns. Priority/category are scheduling fields. Goal stays independent.
## 6. Commitment Identity Audit
Current sources provide logical ID plus `SourceIncarnationId`; Goal links must use both and source kind, never labels or ID alone.
## 7. Goal Core Definition
A durable user-authored desired future state or sustained direction supported optionally by Commitments.
## 8. Goal Core Fields
Required: version,id,revision,title,status,createdAt,updatedAt,links. Optional: description,targetDate,measurementPolicyRef,completedAt,archivedAt. Category/priority/progress are excluded.
## 9. Goal ID
Opaque, unique, stable across edits/restore, never title-derived or reused.
## 10. Goal Incarnation
No separate incarnation V1: archive-only plus never-reused ID makes ID the lifetime token.
## 11. Edit vs Recreate
All normal edits/transitions/links preserve ID and increment revision; new creation always gets new ID.
## 12. Goal Deletion
Choose archive-only. No hard delete/tombstone command in V1; full clear remains system-wide destruction.
## 13. Goal Lifecycle
Exactly active, completed, archived; all transitions user-authored and reversible to active.
## 14. Active Semantics
Current intent, not priority, schedule presence, or progress.
## 15. Completed Semantics
User declares desired state complete; evidence may never perform the transition.
## 16. Archived Semantics
Retained but outside active intent; neither success nor failure.
## 17. Reopening
Completed→active and archived→active preserve ID/links and record revision/time.
## 18. Transition Matrix
| From | active | completed | archived |
|---|---:|---:|---:|
| active | no-op | yes | yes |
| completed | yes | no-op | yes |
| archived | yes | yes | no-op |
## 19. Lifecycle Timestamps
System-recorded createdAt/updatedAt; completedAt/archivedAt reflect recording time and clear when leaving that state. No claimed effective time V1.
## 20. Goal Description
Optional bounded text, explanatory but not machine-interpreted policy.
## 21. Goal Category
Deferred; commitment categories must not be reused implicitly.
## 22. Goal Priority
Excluded V1; commitment priority remains scheduling-specific.
## 23. Goal Time Horizon
Open-ended or optional target date; target windows/start date deferred.
## 24. Target Semantics
Authored context only, never automatic failure/completion/escalation.
## 25. Ongoing Goals
Fully valid without target or measurement.
## 26. Measurable Goals
Supported only through optional policy reference; no calculation in authority.
## 27. Measurement Policy
Choose minimal `{id,version}` reference; concrete policies deferred to Progress architecture.
## 28. Qualitative Goals
First-class and require no measurement reference.
## 29. Goal-to-Commitment Link Definition
Authored assertion that an exact source incarnation supports a Goal.
## 30. Link Ownership
Goal authority owns links.
## 31. Link Identity
Composite of Goal ID and canonical commitment lifetime reference; no link ID.
## 32. Many-to-Many Semantics
Allowed with unique links per Goal/reference and derived reverse lookup.
## 33. Link Weight/Role
Neither exists V1.
## 34. Link Lifecycle
Current add/remove association; history later freezes publication context.
## 35. Commitment Deletion
Retain an explicit unavailable link until user unlinks/relinks.
## 36. Commitment Recreation
Never inherits prior link; new incarnation needs explicit link.
## 37. Commitment Rename/Edit
Identity-preserving edits retain link; recurrence changes do not alter link semantics.
## 38. Goal Lifecycle Effects on Links
Complete/archive retain links and never disable/delete Commitments.
## 39. Link Validation
Strict shape, supported kind, unique reference; live mutation requires matching current incarnation, while restore may retain well-formed unavailable links.
## 40. Goal Draft
Ephemeral Planner draft; saving Goal/links is explicit.
## 41. Goal/Active Transaction Boundary
Link existing is Goal-only. Combined create-commitment/link needs future coordinated transaction; never partial silent write.
## 42. Persistence Model
Independent IndexedDB durable collection, not Active/localStorage extension.
## 43. Goal Authority Surface
Semantic commands and snapshot/subscription/durability/protection/retry operations.
## 44. Mutation Admission
All commands use readiness/replacement admission and deterministic results.
## 45. Runtime Authority Transaction
Goal becomes sixth participant for restore/full-clear/replacement.
## 46. Participant Evolution
Use iterable participant architecture; do not hardcode six as final.
## 47. Storage Version
Separate Goal domain V1, storage schema V1, and future Backup version.
## 48. Validation
Exact keys, versions, branded IDs/references, dates, status/timestamp coherence, limits, unique IDs/links, deterministic order.
## 49. Corruption/Protection
Invalid collection quarantines/protects authority and blocks dependent mutations/interpretation; never becomes empty.
## 50. Full Clear
Must settle Goal empty authority as sixth participant and prevent resurrection.
## 51. Backup Consequence
Future Backup V4 (or next canonical version) must include Goal before UI creates valuable data.
## 52. Backup V3 Compatibility
V3 remains valid legacy five-authority input and restores Goals to explicit empty only under governed translation; V3 export cannot claim Goal completeness.
## 53. Goal Restore
Stage/validate/install atomically with all participants, preserving IDs/revisions/links/protection semantics.
## 54. Profiles Boundary
Profiles neither own, copy, nor serialize Goals/links.
## 55. Profile Load
Active replacement leaves Goal links unchanged and visibly unavailable when incarnation no longer exists.
## 56. Active Replacement
Never retargets; exact surviving incarnations remain available.
## 57. Link Reconciliation
Explicit user unlink/relink command only; no fuzzy title matching.
## 58. Dangling Links
Call `unavailable`, not broken historical evidence; expose reason/source identity.
## 59. Historical Goal Provenance
Required before Goal-linked planning UI publishes new history.
## 60. Historical Goal Reference
Freeze Goal ID, Goal revision, commitment lifetime reference, and link presence.
## 61. Frozen Goal Label
Freeze title for explanation; not identity.
## 62. Frozen Goal Status
Freeze publication-time status only when relevant to included link.
## 63. Frozen Measurement Context
Freeze policy `{id,version}` if present, not derived Progress.
## 64. Goal Revision Model
Current state plus monotonic revision and lifecycle timestamps; immutable ledger deferred.
## 65. Historical Rename Safety
Frozen labels keep old publications stable; current rename changes only future snapshots.
## 66. Goal Auditability
Revision/timestamps support staleness; future decisions preserve exact revision. Full edit ledger deferred.
## 67. Event Model
Commands emit mutation outcomes; no event-sourced authority V1.
## 68. Summary Boundary
Future read-only context only.
## 69. Planner Boundary
Only future authored Goal/link surface.
## 70. Goal Workflow
Draft→validate→explicit save→durable Goal; lifecycle transitions explicit.
## 71. Commitment-Link Workflow
Select existing live incarnation→save Goal transaction→reverse lookup derives.
## 72. Goal Without Commitment
Valid.
## 73. Commitment Without Goal
Valid.
## 74. Completion Without Evidence
Valid authored lifecycle fact.
## 75. Progress Compatibility
Policy reads Goal revision, links and frozen history; no Progress stored.
## 76. Recommendation Compatibility
Revision is staleness token; proposals never edit Goal.
## 77. Revision/Staleness Token
`{goalId,revision}` plus linked Active fingerprints.
## 78. Counterfactual Compatibility
Draft/counterfactual Goal state remains isolated and non-authoritative.
## 79. Serialization
Plain cloneable JSON, canonical dates/IDs, no `Date`, functions, maps, or derived fields.
## 80. Fingerprint
Canonical semantic serialization excluding runtime durability metadata; stable link ordering.
## 81. Ordering
Canonical storage by Goal ID; UI ordering derived. User-defined order deferred.
## 82. Scheduling Independence
Goal/status/target/link never becomes engine input V1.
## 83. Priority Sovereignty
No inferred Goal priority; commitment priority remains user-authored.
## 84. Goal Conflict Boundary
No optimizer or automatic resolution.
## 85. Goal Success Boundary
Completion is not score, adherence, or evidence-derived success judgment.
## 86. Historical Goal-Link Coverage
Future analytics discloses linked/unlinked/unavailable/frozen coverage; not implemented.
## 87. Goal V1 Canonical Contract
`GoalAuthorityV1 {version:1, goals: GoalV1[]}`; Goal fields follow §8; links are exact `{sourceKind,id,incarnationId}` references.
## 88. Goal Command Inventory
createGoal, updateGoal, completeGoal, archiveGoal, reactivateGoal, linkCommitment, unlinkCommitment; no setGoals/deleteGoal.
## 89. Goal Query Inventory
listGoals, getGoal, getGoalsForCommitment; reverse lookup derived.
## 90. Goal Invariant Assessment
| Invariants | Classification |
|---|---|
| 1–25 | Adopt individually |
| 26 measurable policy | Modify: policy reference only |
| 27–29 | Adopt individually |
| 30 frozen provenance | Defer implementation; adopt requirement |
| 31–34 | Adopt individually |
| 35 Backup/restore/clear | Adopt as pre-UI prerequisite |
| 36 restored identity | Adopt as pre-UI prerequisite |
| 37–50 | Adopt individually |

Thus every numbered invariant is classified: 1–25, 27–29, 31–34, and 37–50 are
Adopt; 26 is Modify; 30 is Deferred implementation with the invariant adopted;
35–36 are Adopt with sequencing qualification. None is rejected or open.
## 91. Goal Epistemic Matrix
| Evidence | May say | Must not infer |
|---|---|---|
| active/completed/archived | authored state | priority/success/failure |
| target passed | date passed | failed |
| no links | none authored | no effort |
| skipped/unreported/unplaced | exact category | motivation/failure/capacity |
| removed incarnation | link unavailable | link transfers |
| rename | label changed | identity changed |
## 92. Link Semantics Matrix
| Event | Current result | Historical implication |
|---|---|---|
| rename/edit | retained | frozen old label/context |
| delete/recreate | unavailable/no transfer | old reference stable |
| profile/import/replacement | exact links retained | no retarget |
| archive/complete/reactivate | links retained | lifecycle snapshot frozen later |
## 93. Lifecycle Matrix
| State | Meaning | Schedule linked? | Link/edit? | History |
|---|---|---:|---:|---|
| active | current intent | unchanged | yes | frozen when published |
| completed | user-declared done | unchanged | yes | not inferred |
| archived | retained inactive intent | unchanged | yes | not failure |
## 94. Identity Matrix
Rename, description, target, policy, links, complete, archive, and reactivate preserve ID and increment revision. Delete/recreate is unavailable in V1; a new Goal always receives a new ID.
## 95. Persistence Matrix
| Concern | Recommendation |
|---|---|
| authority/storage/schema | independent IndexedDB collection V1 |
| runtime/admission | sixth participant; governed admission |
| fingerprint/protection | canonical; quarantine/protect |
| clear/Backup/restore | required before UI; next Backup version |
## 96. Profile/Replacement Matrix
Profiles ignore Goal authority/links. Loads/imports/Active clear retain exact links as available or unavailable. Full clear clears Goals. Future complete Backup preserves all.
## 97. Historical Provenance Matrix
Freeze Goal ID/revision/title, link reference, publication-time status, and measurement policy reference. Do not freeze description, timestamps, derived Progress, or current labels.
## 98. Goal Authority Alternatives
Independent authority wins identity, lifecycle, replacement, provenance, and ownership clarity; Active extension and relationship-only metadata are rejected despite lower initial complexity.
## 99. Link Ownership Alternatives
Goal-owned links support many-to-many with lowest new authority/transaction burden. Commitment-owned links couple Active; separate link authority overmodels V1.
## 100. Deletion Alternatives
Archive-only adopted for safety/simplicity. Hard delete risks references; tombstones add unnecessary storage complexity.
## 101. Revision Alternatives
Explicit revision counter adopted: sufficient staleness/audit token with bounded Backup complexity. Current-only is weak; immutable ledger deferred.
## 102. Risk Register
High: identity/title coupling, silent retarget, historical relabel, inferred completion, Backup loss. Medium: Goal/Commitment wrapper, target judgment, Progress leakage, participant growth. Mitigations are opaque IDs, exact incarnations, frozen provenance, authored lifecycle, strict boundaries, and Backup-before-UI.
## 103. Architecture Decision Set
All 25 required decisions are settled by §§7–101; physical IndexedDB keys and API result names remain implementation detail.
## 104. Implementation Slice Determination
Choose **Slice C staged internally**: authority+lifecycle+links+historical provenance+Backup/restore/full clear substrate before UI. Splitting durable user data from backup or provenance creates an unsafe shipping boundary.
## 105. Backup Sequencing
Same implementation program/checkpoint as Goal persistence and before UI; no period of user-created unexportable Goals.
## 106. Planner UX Sequencing
Authority→Backup/restore/clear→historical publication provenance→Planner UI.
## 107. Historical Provenance Sequencing
Must precede UI because the first Goal-linked publication must not lose context.
## 108. Minimum Useful Goal V1
After substrate: create/edit/complete/archive/reactivate and link/unlink existing Commitments in Planner; no Progress.
## 109. Recommended Phase 5 Sequence
5.3 substrate; 5.4 Planner Goal UX audit/implementation; 5.5 Goal-linked history integration audit; 5.6 Progress architecture. Later recommendations remain gated.
## 110. Recommended Task 5.3
Exactly one: **Task 5.3 — Implement Goal V1 Durable Authority, Commitment Links, Historical Provenance, and Backup/Restore/Clear Integration.** No UI, Progress, or Recommendations.
## 111. Governance Updates
Current State, Roadmap, Decisions, Changelog, and a Goal ADR updated without implementation claims.
## 112. ADR Determination
Created `ADR_GOAL_AUTHORITY_IDENTITY_LIFECYCLE_AND_COMMITMENT_LINK_MODEL.md` with accepted enduring decisions.
## 113. Validation
Pass: `git diff --check` reports no whitespace errors after governance. No production/test files changed, so product tests were not rerun.
## 114. Deviations
None.
## 115. Stop-Condition Assessment
None: current incarnation identity supports links; Goal remains independent; Backup/runtime can evolve; no implementation was needed to settle semantics.
## 116. Final Architecture Statement
Goal V1 is a durable authored intent authority, not scheduled work or inferred progress. Exact Goal-owned lifetime links preserve identity without affecting scheduling; archive-only lifecycle, future frozen provenance, and Backup-before-UI make the next bounded substrate implementation safe.
