# Task 5.10 Result — Progress V1 and Measurement-Policy Architecture Audit

## 1. Executive Determination
**Progress should remain deferred.** The first truthful slice is manual quantity Progress, but durable measurement-definition and observation semantics must be designed first.
## 2. Artifact Integrity
The immutable project copy matches the supplied artifact at SHA-256 `1a6b13aaef02f1676421d3c94513303169b7268922cc449e70bd92e4c309f78a`.
## 3. Audit Scope
Read-only audit of semantics, eligibility, evidence, measurement configuration, reproducibility, authority boundaries, presentation, and sequencing.
## 4. Sources Reviewed
Tasks 5.1–5.3, 5.5, and 5.7–5.9; the Goal ADR/domain; HistoricalPlan Goal provenance; Goal Activity; ExecutionHistory; and historical-policy conventions.
## 5. Goal Contract Reconstruction
Goal V1 has stable ID, revision, title/description, authored lifecycle, optional target date, optional `{id,version}` policy reference, exact commitment-incarnation links, and timestamps. It has no measurement parameters or Progress value.
## 6. Goal Activity Reconstruction
Goal Activity supplies frozen membership/planning dispositions, governed occurrence outcomes, three coverages, cutoff, and provenance. It describes support activity, not target-state movement.
## 7. Progress Definition
**Architecture recommendation:** Progress is a deterministic, policy-versioned interpretation of eligible evidence relative to an explicit authored measurement definition.
## 8. Goal Activity vs Progress
Goal Activity answers what supporting work happened; Progress answers what valid evidence means relative to a defined target. Neither substitutes for the other.
## 9. Progress Eligibility
An explicit supported measurement definition is required. Goal lifecycle or linked activity never implicitly opts a Goal into Progress.
## 10. No-Policy Goal
Return `notDefined`; Goal Activity remains available. Preferred user copy: “Progress is not defined for this Goal.”
## 11. Unknown Policy
Return `unsupportedPolicy`, never zero or 0%.
## 12. Measurement-Policy Definition
A policy owns accepted configuration, evidence kinds, unit compatibility, aggregation, baseline, numerator/denominator, direction, bounds, cutoff behavior, partial handling, result shape, provenance, and compatibility.
## 13. Policy Identity
Every policy requires stable ID and positive version. The current reference identifies code semantics but not authored configuration.
## 14. Progress Policy vs Measurement Policy
Choose one measurement policy that fully defines interpretation, wrapped by a generic result/status envelope. A second semantic Progress policy layer adds no V1 value.
## 15. Policy Registry
Use a closed deterministic built-in code registry in V1. Formula DSLs, expressions, plugins, and arbitrary executable policies are deferred.
## 16. User-Authored Measurement Configuration
Required for a useful policy: target, unit, baseline, direction, evidence kind, and effective measurement epoch as applicable.
## 17. Goal Schema Sufficiency
**C:** policy classes without parameters are representable, but Goal V1 is insufficient for the selected useful measurable target. `{id,version}` cannot encode target quantity or baseline.
## 18. Policy Classes
Binary reflection is redundant; quantity/count can be truthful with explicit config; activity-count measures activity only; time/frequency/maintenance need horizon semantics; milestones need milestone authority.
## 19. Binary Completion Policy
Rejected as first Progress policy: it merely mirrors authored lifecycle and falsely suggests lifecycle is measurement.
## 20. Quantity Policy
Supported as the strongest first candidate when target, unit, baseline, direction, and observations are explicit.
## 21. Count Policy
Supported only with an explicit target and counted evidence definition; it must name what is counted.
## 22. Activity-Based Policy
Possible only by explicit user choice and must be labelled activity progress, not assumed outcome progress.
## 23. Time-Based Policy
Deferred. Scheduled time is not evidence; user-reported duration may be evidence only under an explicit policy.
## 24. Milestone Policy
Deferred pending authored milestone identity, ordering, lifecycle, evidence, and history.
## 25. User-Reported Numeric Progress
Recommended for the first real slice because it records outcome quantity directly instead of inferring it from supporting activity.
## 26. Progress Evidence Sources
Future observations are primary for manual quantity; Goal definition supplies intent; Goal Activity is contextual; ExecutionHistory is eligible only when a policy explicitly selects compatible occurrence evidence.
## 27. Goal Activity as Evidence
Rejected as a universal numerator. It may be policy-selected evidence for explicitly activity-measured Goals.
## 28. Execution Outcomes as Evidence
Completed/partial/skipped reports have no generic numeric meaning relative to a Goal target.
## 29. Partial/Unknown/Skipped Semantics
No default weights: partial is policy-defined or excluded; unknown/not reported are missing interpretation; skipped is not negative Progress.
## 30. Progress Denominator
Must be an explicit authored target in a compatible unit and valid measurement epoch. Linked occurrences, scheduled time, target date, or Goal lifetime are not implicit denominators.
## 31. Percentage Validity
Valid only as a derived presentation when numerator and positive denominator share a policy-defined unit and bounds. Preserve the underlying quantity alongside it.
## 32. Units
Units are explicit stable identifiers with display labels and compatibility rules; no conversion is inferred.
## 33. Progress Value Model
Use a tagged result: quantity first; optional derived ratio/percentage; future categorical/milestone variants; and explicit non-value states.
## 34. Qualitative Goals
Remain fully valid with Goal Activity and `notDefined`; no forced numeric or qualitative pseudo-score.
## 35. Progress Availability States
Distinguish `notDefined`, `unsupportedPolicy`, `unavailable`, `insufficientEvidence`, and `available`.
## 36. Measurement Policy Parameters
Parameters belong in durable authored measurement definitions, not policy IDs and not derived results.
## 37. Goal Authority Extension
Do not add arbitrary config directly to Goal V1 during this audit. Task 5.11 must decide the minimal reference/integration contract.
## 38. Historical Measurement Context
Reproducibility requires immutable definition revision/fingerprint and epoch, not merely current Goal revision.
## 39. Policy Changes
A material config or policy change starts a new measurement epoch; it does not silently reinterpret old observations.
## 40. Measurement Epoch
Recommended: stable definition identity plus revision/effective-from boundary; observations bind to the exact definition revision.
## 41. Goal Revision Sufficiency
Unsupported. Goal revision mixes unrelated title/lifecycle/link edits and does not preserve config contents.
## 42. Policy Fingerprint
Canonical fingerprint should cover policy ID/version and normalized authored parameters, unit, baseline, target, direction, and epoch.
## 43. Target Date
Context only in V1. It is neither denominator nor evidence cutoff unless a future explicit policy says otherwise.
## 44. Pace Boundary
Pace, overdue, on-track, forecast, urgency, and target-date judgment remain prohibited.
## 45. Lifecycle/Completion
Completed is authored status, not 100%; reaching target does not mutate lifecycle.
## 46. Reactivation
Does not reset or merge measurement epochs automatically. Current and historical definitions remain independently governed.
## 47. Progress Evaluation Window
Default to the selected definition epoch through explicit `evaluationAsOf`; a policy may further constrain evidence.
## 48. Lifetime vs Range
Progress is epoch/lifetime-oriented, not the user-selected Goal Activity date range. Range-specific evidence remains an explanation view.
## 49. evaluationAsOf
Required and explicit; excludes evidence recorded after the cutoff and supports deterministic projection.
## 50. Reproducibility
Requires exact policy/config identity, eligible evidence revisions, cutoff, coverage, and deterministic aggregation.
## 51. Persistence Alternative
Reject persisted derived Progress snapshots. Persist authored definition and observation evidence, then recompute.
## 52. HistoricalPlan Measurement Context
Its frozen policy reference explains linked occurrence context but cannot define a Goal-level target/baseline. Do not enlarge it before a concrete policy needs it.
## 53. Separate Measurement Authority
**Architecture recommendation:** a separate durable GoalMeasurementDefinition authority is preferable to opaque Goal fields for revisioned config and epochs.
## 54. Measurement Definition Identity
Needs stable ID, Goal ID, revision, policy reference, normalized parameters, effective-from, timestamps, and canonical fingerprint; replacement/history semantics remain for Task 5.11.
## 55. Minimum Progress Slice
Manual quantity target plus explicit user-reported quantity observations is the smallest useful, truthful slice—but it is not yet ready to implement.
## 56. Manual Quantity Updates
Example: `12,400 words / 50,000 words`; the observation must declare compatible unit and time and bind to a definition revision.
## 57. Progress Observation Evidence
A future GoalProgressObservation should be durable, user-authored, timestamped, correction-capable, and definition-revision-specific.
## 58. Activity vs Outcome Evidence
Supporting activity and Goal-state outcome are separate evidence kinds. V1 manual quantity uses direct observations, not linked occurrence proxies.
## 59. Goal Types
Avoid a required Goal type taxonomy; validity does not depend on classification.
## 60. Goal Type vs Policy
Measurement policy expresses how a Goal is measured. Optional future Goal taxonomy must not silently choose policy.
## 61. Maintenance/Habit/Outcome/Quantity/Milestone Goals
Maintenance/habit need horizons; outcome may need external/manual observation; quantity is ready after substrate; milestones need authority; qualitative needs no metric.
## 62. Progress Evidence Taxonomy
Authored intent/config, direct Goal-state observation, policy-selected occurrence evidence, and contextual activity are distinct classes.
## 63. Progress Coverage
Report definition availability, observation/evidence availability, and source coverage separately; never combine them as confidence.
## 64. Progress Provenance
Include Goal ID/revision context, definition ID/revision/fingerprint, policy ID/version, cutoff/window, evidence identifiers/revisions, aggregation, and exclusions.
## 65. Authority Determination
Progress remains pure, derived, non-authoritative, and non-persisted.
## 66. Measurement Definition Authority
Required for the selected slice and must join runtime/restore/full-clear/Backup boundaries before UI.
## 67. Observation Authority
Required for manual quantity Progress; separate from Goal, HistoricalPlan, and ExecutionHistory.
## 68. Backup Consequences
Any definition/observation authority requires the next complete Backup version plus explicit older-backup translation, restore transaction, rollback, and clear participation.
## 69. HistoricalPlan Consequences
No immediate schema change. Revisit only if a concrete activity policy needs frozen configuration beyond its current policy reference.
## 70. ExecutionHistory Consequences
No schema change. It remains occurrence-outcome evidence, not a generic Goal measurement ledger.
## 71. Summary Responsibility
Future read-only Progress explanation/result and evidence provenance; never config or observation writes.
## 72. Planner Responsibility
Author measurement definitions and lifecycle decisions. Exact workflow awaits substrate architecture.
## 73. Operational Reporting Responsibility
Future observation entry belongs in an explicitly chosen write surface, likely Planner/Goal workflow, not Summary and not overloaded execution reporting.
## 74. Goal Completion Suggestion Boundary
Progress may someday offer a non-authoritative suggestion only after Recommendation architecture; no automatic lifecycle write.
## 75. Status/Trend/Comparison Boundaries
No health, success, track state, pace, trend, forecast, comparison, or ranking in V1.
## 76. Goal Activity + Progress Relationship
Present as peer explanations: activity provides supporting context; Progress uses only policy-eligible evidence and discloses that distinction.
## 77. Cold Start/Baseline
Definition without observations returns `insufficientEvidence` unless its explicit baseline is itself a valid starting observation.
## 78. Directionality
Explicitly `increaseTowardTarget` or a later governed alternative; do not infer from sign or wording.
## 79. Bounds
Policy defines whether results clamp, allow above-target values, or reject invalid evidence. Preserve raw quantity; do not silently clamp V1.
## 80. Units/Precision
Policy/config sets unit and display precision; storage preserves validated numeric precision and rejects non-finite values.
## 81. Policy Registry Alternatives
Built-in registry: recommended V1. Formula DSL, user expressions, and plugins: deferred due validation, safety, migration, and reproducibility cost.
## 82. First Built-In Policy Candidate
Manual quantity target is recommended; it measures explicit Goal-state observations and supports a truthful same-unit ratio.
## 83. Measurement Architecture Alternatives Matrix
| Alternative | Assessment |
| --- | --- |
| Goal policy reference only | Unsupported for configured targets |
| Goal-embedded generic config | Smaller but weak identity/history |
| Separate revisioned definition | Recommended |
| Persisted derived Progress | Rejected |
## 84. Progress Evidence Alternatives Matrix
| Evidence | Assessment |
| --- | --- |
| Goal Activity | Context; policy-selected only |
| Execution outcomes | No generic weight |
| Manual quantity observation | Recommended first source |
| External integrations | Deferred |
## 85. Progress Model Alternatives Matrix
| Model | Assessment |
| --- | --- |
| Quantity + optional ratio | Recommended first |
| Percentage only | Rejected |
| Categorical | Future policy-specific |
| Milestones | Deferred substrate |
| No metric | Valid qualitative state |
## 86. Goal-Type Alternatives Matrix
| Goal kind | Result |
| --- | --- |
| Qualitative | Valid, no metric |
| Quantity | First candidate |
| Activity/count | Explicit opt-in only |
| Habit/maintenance | Deferred horizon semantics |
| Milestone | Deferred authority |
## 87. Lifecycle Matrix
| Lifecycle | Progress meaning |
| --- | --- |
| Active | Evaluate supported definition |
| Completed | Authored status; not forced 100% |
| Reactivated | No implicit reset |
| Archived | Read-only inspectable; no new meaning |
## 88. Measurement-State Matrix
| State | Result |
| --- | --- |
| No definition | `notDefined` |
| Unknown policy | `unsupportedPolicy` |
| Protected authority | `unavailable` |
| Valid definition/no evidence | `insufficientEvidence` |
| Valid compatible evidence | `available` |
## 89. Evidence Matrix
| Evidence state | Treatment |
| --- | --- |
| Compatible direct observation | Include |
| Incompatible unit/epoch | Exclude with provenance |
| Partial occurrence | Policy-specific; no default |
| Unknown/not reported | Missing, not zero |
| Skipped/unplaced/blocked/omitted | No negative inference |
## 90. Percentage Matrix
| Condition | Percentage valid? |
| --- | --- |
| Same unit, explicit positive target/baseline/direction | Yes, derived |
| Occurrence completion counts without opt-in | No |
| Target date as denominator | No |
| Qualitative Goal | No |
| Unknown/missing evidence | No |
## 91. Historical Reproducibility Matrix
| Input | Requirement |
| --- | --- |
| Policy/config | Exact definition revision/fingerprint |
| Observations | Immutable/correctable history and IDs |
| Time | Explicit cutoff and epoch |
| Result | Recomputed, not persisted |
## 92. Authority Matrix
| Concept | Authority |
| --- | --- |
| Goal intent/lifecycle | Goal |
| Measurement semantics/config | Future definition authority |
| Quantity claims | Future observation authority |
| Occurrence reports | ExecutionHistory |
| Progress | Derived non-authority |
## 93. Backup Matrix
| Surface | Consequence |
| --- | --- |
| Current Goal/History/Execution | No Task 5.10 change |
| Future definitions | Full Backup/restore/clear participant |
| Future observations | Full Backup/restore/clear participant |
| Derived Progress | Never backed up |
## 94. Product Responsibility Matrix
| Surface | Responsibility |
| --- | --- |
| Summary | Read-only explanation |
| Planner | Definition authoring and Goal decisions |
| Observation workflow | Explicit future write surface |
| Scheduler | No Progress input |
## 95. Epistemic Matrix
| Fact | Permitted interpretation |
| --- | --- |
| Linked/completed work | Supporting activity only by default |
| Direct compatible observation | Policy-eligible Goal-state evidence |
| Missing report/observation | Unknown/insufficient, not zero |
| Lifecycle completed | User-authored status, not measured 100% |
## 96. Progress Invariant Assessment
All 51 required invariants are **Confirmed** or adopted as **Architecture recommendations**: explicit measurement, qualitative validity, no arbitrary weights, independent lifecycle/date semantics, pure derived results, reproducible config/evidence, read-only Summary, and no scheduler/prescriptive coupling.
## 97. Stop-Condition Assessment
Policy-specific configuration and useful manual quantity evidence lack durable homes. These are implementation blockers, resolved by sequencing a measurement substrate architecture task before Progress.
## 98. Implementation Readiness
**E — Progress should remain deferred.** Neither a general policy nor the selected manual quantity slice can be implemented truthfully until definition and observation boundaries are finalized.
## 99. Minimum Useful Progress Slice
**No Progress yet; measurement substrate first.** The eventual first Progress policy should be manual quantity target/observation.
## 100. Recommended Task 5.11
**Task 5.11 — Measurement Definition V1 Architecture and Durable Authority Boundary.** Define exact config identity, revision/epoch semantics, Goal linkage, observation compatibility, and Backup/restore/clear requirements without implementing Progress UI.
## 101. Recommended Phase 5 Sequence
5.11 measurement-definition architecture; 5.12 durable definition substrate; 5.13 Progress observation architecture/substrate; 5.14 manual quantity projection; 5.15 Summary/Planner integration; then Recommendation architecture.
## 102. Governance Updates
Updated the Phase 5 checkpoint, CURRENT_STATE, ROADMAP, DECISIONS, and CHANGELOG without marking Progress implemented.
## 103. ADR Determination
An ADR is warranted after Task 5.11 finalizes the durable definition contract and its relationship to observations. Creating it during this audit would prematurely freeze unresolved details.
## 104. Validation
Audit-only validation: immutable hash verified and `git diff --check` passed. No test/build run is claimed for Task 5.10.
## 105. Final Audit Statement
Task 5.10 is complete: Progress is cleanly separated from activity, requires explicit reproducible measurement semantics, and remains deferred until its authored measurement substrate exists.
