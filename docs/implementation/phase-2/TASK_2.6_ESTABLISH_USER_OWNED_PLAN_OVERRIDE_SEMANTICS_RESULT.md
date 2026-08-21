# Task 2.6 — Establish User-Owned Plan Override Semantics — Result

## 1. Executive Determination

**Confirmed:** DayFrame currently has no authoritative representation of an accepted occurrence-level planning decision. It mutates only the non-durable Preview, so the decision disappears on regeneration and reload.

**Recommended:** accepted planning decisions are a distinct class of **authoritative planning data**. They are neither recurring authored intent, derived Preview state, nor command history. The authority becomes real only through an explicit user action; an engine recommendation remains derived until accepted.

**Recommended:** adopt a general `PlanDecision` authority category with two semantic branches:

1. a normalized final-state `OccurrenceOverride` for placement, suppression, duration, category, and priority; and
2. a `ConflictAcknowledgement` for accepting a specific, still-applicable conflict.

**Recommended:** every decision must target a first-class deterministic occurrence identity derived from stable source identity and recurrence-expansion context—not a scheduled-block ID, friction ID, placement time, planning-window position, or Preview revision. The current code does not yet guarantee that identity contract. Therefore the dependency-correct next task is **Task 2.7 — Establish Stable Generated-Occurrence Identity**. Override representation and persistence should not be implemented before that prerequisite.

## 2. Artifact Integrity

**Confirmed:** the attachment contains the required title, metadata, execution rules, purpose, Phase 2 context, governing evidence, objective, authority and identity questions, scope, invalidation, conflict, regeneration, durability, profile/backup, history, candidate-model, decision-standard, non-goal, validation, completion, and determination sections. It ends with the exact required completion statement.

- Artifact: `/home/sid/.codex/attachments/9b0d0a9d-a5e9-486f-ab67-2d88c937c614/pasted-text.txt`
- Size: 36,378 bytes; 1,557 lines
- SHA-256: `b62922aaf457c28080e507352100a8b9a8bc7f074bd64f41c982491434152c30`
- **Confirmed:** the artifact remained immutable.

## 3. Evidence Reviewed

**Confirmed:** primary executable evidence included `ScheduledBlock`, `BlockCandidate`, `BlockRecurrence`, `BlockTemplate`, `ManualCalendarEvent`, generated work-block types, candidate/work/manual identity construction, `generateBlockCandidates`, `placeBlockCandidates`, `generateSchedulePreview`, `detectScheduleFriction`, `generateSuggestedFixes`, `applySuggestedFix`, `reviseSchedulePreview`, `DayFrameState`, `DayFrameAuthoredSetup`, store generation/revision/invalidation/load/import/clear paths, profile storage, and V1 backup behavior.

**Confirmed:** direct tests were inspected for candidate expansion, `timesPerUserWeek`, placement identity, preview generation, revision, and store replacement. Tasks 2.1, 2.4, and 2.5; the Architecture Specification; `DECISIONS.md`; the durable-data ADR; and the Phase 1 checkpoint supplied governing context.

## 4. Current Planning-Decision Gap

**Confirmed:** current flow is `authored setup A → generated Preview P → accepted fix → preview-only P'`. `P'` is user-influenced but non-durable, is not reproducible from `A`, and is discarded by regeneration, profile load, backup import, clear, or reload.

**Recommended:** the target flow is `authored setup A + authoritative plan decisions D + generation provenance G → derived Preview P'`. Preview remains disposable; `D` carries the user's accepted planning intent.

## 5. Override Authority Classification

**Recommended:** a plan override is a **planning-layer authoritative domain object**. It is not part of the recurring authored definition because it governs one expanded occurrence. It is not derived because explicit acceptance gives it user ownership. It is not a command because current authority can be represented without replay. It is not historical evidence because it expresses a current desired plan condition.

**Confirmed:** recommendation generation alone confers no authority. **Recommended:** creation, replacement, or removal requires an explicit user action or a separately authorized user workflow.

## 6. Current Generated Identity Inventory

| Object | Current identity construction | Assessment |
|---|---|---|
| `BlockCandidate` | `candidate_{templateId}_{recurrenceId}_{userDayDate}` | **Confirmed:** deterministic for a particular expanded occurrence, but its existence/date can depend on recurrence expansion and the generation window. No ordinal supports multiple same-day occurrences. |
| template `DraftScheduledBlock` | `scheduled_{candidate.id}` | **Confirmed:** inherits candidate identity; placement time is not encoded. It adds no independent occurrence guarantee. |
| generated work block | `work_{shiftDefinitionId}_{localDate}` | **Confirmed:** deterministic, but omits cycle and segment identity even though generated cycle work blocks retain those fields. It is not a declared durable key. |
| manual-event projection | `manualEvent.id` | **Confirmed:** directly inherits stable authored identity and is the strongest present identity case. |
| friction point | `friction_unplaced_{candidateId}` or `friction_conflict_{leftId}_{rightId}` | **Confirmed:** deterministic for current derived participants/order, but represents a transient relationship, not an occurrence. |
| suggested fix | action prefix plus target/participant derived IDs | **Confirmed:** identifies a current recommendation, not durable user intent or a complete result payload. |

## 7. Occurrence Identity Assessment

**Confirmed:** current template occurrences usually have stable source components (`templateId`, `recurrenceId`, `userDayDate`). For present supported frequencies, generation emits at most one candidate for a recurrence on a user-day.

**Confirmed:** weekly recurrence chooses the first eligible user-day in each represented week; `timesPerUserWeek` chooses the first N eligible represented user-days. Consequently an occurrence can move or disappear when the expansion window or effective week boundary changes. Day-boundary/week-start changes can also alter date/week attribution.

**Inferred:** current IDs are adequate transient correlation keys but are not sufficient as a long-lived durable contract. They lack an explicit identity version, source-kind discrimination, occurrence ordinal, and guarantees for future recurrence models. Work IDs can be ambiguous if a shift definition participates in distinct cycle/segment contexts on the same date.

## 8. Occurrence Identity Model Matrix

| Identity Model | Stable Across Regeneration | Stable Across Range Change | Survives Authored Edit | Human/Debug Explainability | Implementation Complexity | Recommendation |
|---|---:|---:|---:|---:|---:|---|
| generated block ID | conditionally | no guarantee | conditionally | medium | low | **Not recommended** as durable authority |
| authored source + date/key | yes when logical expansion is unchanged | usually | source-dependent | high | medium | **Recommended** semantic basis |
| deterministic occurrence ID | yes by contract | yes by contract | re-resolves or orphans explicitly | high with inspectable components | medium/high | **Recommended** durable target |
| semantic predicate | potentially | potentially | ambiguous | medium | high | **Deferred** for range/bulk rules, not single occurrence |

## 9. Adopted Occurrence Identity Contract

**Recommended:** introduce a first-class, versionable deterministic occurrence identity whose semantics include:

- source kind;
- stable authored source identity (for templates, both template and recurrence identity);
- logical user-day/date or equivalent recurrence-expansion key;
- an explicit occurrence discriminator/ordinal where the source can yield more than one occurrence in that scope; and
- for work, enough cycle/segment/definition context to avoid source ambiguity.

Identity must be independent of placement time, generated array order, requested-window position, Preview generation/revision timestamps, friction identity, and scheduled/unplaced state. The same logical occurrence must have the same identity when regenerated in an overlapping or larger window. If authored changes eliminate that occurrence, the identity must fail to resolve and become orphaned; it must never silently retarget a neighboring occurrence.

**Deferred:** concrete field names, serialization form, hashing/string encoding, identity version, and migration schema belong to Task 2.7.

## 10. Override Scope

**Recommended:** initial plan-decision scope is exactly one logical occurrence. “One user-day instance” and “date-specific override” are equivalent only when identity proves there is one matching occurrence. Range-limited and bulk semantic rules are future features and require distinct scope/type semantics.

**Confirmed:** changing a recurring definition—such as every workout's duration or fixed time—is an authored edit, never an occurrence override. `changeFixedTime` remains an authored-edit recommendation.

## 11. Current Fix-to-Override Mapping

| Current Fix | Future semantic home | Final-state meaning |
|---|---|---|
| `moveBlock` | occurrence override | explicit desired placement/placement constraint, not “run move algorithm again” |
| `skipBlock` | occurrence override | suppressed/skipped occurrence |
| `convertToRecovery` | occurrence override | occurrence category/semantic presentation becomes recovery; title derivation should remain derived |
| `reduceDuration` | occurrence override | explicit desired duration, not “subtract 30 again” |
| `changePriority` | occurrence override | explicit desired priority, not “increment again” |
| `acceptConflict` | conflict acknowledgement | user accepts one identified conflict condition among identified occurrences |
| `changeFixedTime` | authored edit recommendation | no plan decision until/unless a distinct occurrence-only time action is designed |
| `addResource` | **Unresolved/Deferred** | unsupported today; resource ownership must be decided before mapping |

## 12. Candidate Override Representations

**Inferred:** a generic action plus untyped payload mirrors today's fix vocabulary but weakens validation and risks replay semantics. A discriminated union improves semantic validation. A normalized final occurrence state best captures current authority. An ordered command list preserves unnecessary interaction history and makes equivalent final plans order-sensitive.

## 13. Override Representation Matrix

| Representation | Encodes Final State | Requires Order | Easy To Validate | Easy To Explain | Future Engine Fit | Recommendation |
|---|---:|---:|---:|---:|---:|---|
| generic action override | partial | often | low | medium | medium | not preferred |
| discriminated override union | yes | no if normalized | high | high | high | useful outer typing |
| normalized final occurrence state | yes | no | high | high | high | **adopt** |
| ordered commands | indirectly | yes | medium | medium | low/medium | defer for audit/undo only |

## 14. Adopted Override Representation Semantics

**Recommended:** represent one canonical normalized desired state per occurrence, within a discriminated `PlanDecision` model. The occurrence override may semantically contain suppression, desired placement, duration, category, and priority fields, subject to source capability validation. Conflict acknowledgement is a separate branch because it changes no occurrence property and targets a relationship/condition.

**Deferred:** whether the normalized occurrence state is one aggregate object or a closed discriminated set of compatible subrecords is a schema question. The invariant is one canonical final state per occurrence, not a bag of replayable actions.

## 15. Final-State Versus Command Determination

**Recommended:** current authority does not require command history. “Move to 18:00, then reduce to 30 minutes” is fully represented as desired start/placement plus duration. “Increase priority twice” must normalize to the resulting explicit priority.

**Deferred:** future undo, audit, analytics, or collaborative editing may retain commands/events separately. Such history must not become the source of current planning authority unless a later decision explicitly adopts event sourcing.

## 16. Multiple-Override Conflict Semantics

**Recommended:** compatible fields merge into the canonical occurrence state; a later explicit decision for the same field replaces the former value at the write boundary. Persisted engine semantics never depend on acceptance order.

- move + duration: merge;
- move + category or priority: merge when the source permits them;
- move + move: newest explicit target replaces the old target;
- priority + priority: newest explicit value replaces the old value;
- skip + move/duration/category/priority: skip is operationally exclusive. Explicitly accepting skip normalizes away superseded active occurrence fields rather than retaining hidden commands;
- conflicting source-inapplicable fields: reject with an explainable validation result, never guess.

## 17. Normalization Semantics

**Recommended:** every create/update operation normalizes immediately to at most one occurrence override per occurrence identity. Canonical serialization/order must use stable identity ordering, not insertion order. Default/empty fields should be omitted; an override with no effective fields should be removed because removal means return to engine-derived behavior.

**Recommended:** conflict acknowledgements normalize separately by a stable conflict-condition identity built from conflict kind and canonical participant occurrence identities.

## 18. Authored-Change Invalidation

**Recommended:** use semantic revalidation, not universal preservation, blanket revision binding, or deletion. At generation time DayFrame resolves the target occurrence, validates each desired field against the current source and constraints, and classifies the decision as applicable, conflicted/needs review, orphaned, or outside the current window.

**Recommended:** a base source signature/revision is useful provenance for detecting material changes, but any validity status should be derived where possible rather than stored as mutable truth.

## 19. Invalidation Matrix

| Authored Change | Override Still Applies? | Revalidation Needed? | User Confirmation Needed? | Never Silently Delete? |
|---|---:|---:|---:|---:|
| title-only change | yes | light source resolution | no | yes |
| duration change | compatible fields yes; explicit duration remains user-owned if valid | yes | only if constraints conflict | yes |
| recurrence/date change | only if the same logical identity still resolves | yes | yes before retargeting; automatic retarget forbidden | yes |
| disable template | no active application; decision becomes orphaned/inactive | yes | yes to restore/reassign | yes |
| delete source template | no; orphaned | yes | yes to reassign | yes |
| scheduling preference change | identity retained if logical occurrence remains; placement may conflict | yes | only when incompatible | yes |
| planning-window change | yes; outside-window is inactive, not invalid | resolution when included | no | yes |

## 20. Orphaned Override Semantics

**Recommended:** an unresolved user-owned decision remains durable but inactive/orphaned. It must be discoverable for user cleanup and must never migrate automatically to a “nearby” occurrence. Explicit removal, reassignment, or source restoration resolves it.

**Recommended:** retention may later require a user-visible cleanup surface and bounded retention policy, but no silent deletion policy is authorized here.

## 21. Override Validity/Freshness

**Recommended:** conceptual outcomes are `applicable`, `conflicted/needsReview`, `orphaned`, and `outsideWindow`. These should normally be derived from the current authored setup, decision, and generation context rather than persisted as authoritative status. Persist only facts/provenance needed to recompute the outcome.

## 22. Generation Integration

**Recommended:** the future engine contract is `DayFrameAuthoredSetup + PlanDecisions + generation window/provenance → Generated Plan`. The engine must return application/validation diagnostics for decisions without mutating or deleting them.

**Confirmed:** current `generateSchedulePreview` accepts no plan-decision input and must not be extended until identity and representation contracts exist.

## 23. Override Application Stage

**Recommended:** override semantics enter at the earliest stage that affects correct planning:

| Decision | Required stage |
|---|---|
| skip/suppress | recurrence expansion or immediately after candidate creation, before placement |
| duration/category | candidate materialization before placement; category effects must precede applicable policies |
| priority | before placement sorting/selection |
| move/desired placement | placement as an explicit constraint/preference; not post-hoc mutation |
| conflict acknowledgement | after friction derivation, matched against the current semantic conflict |

**Inferred:** a single post-placement patch layer would be incorrect because duration, priority, suppression, and placement alter planning constraints and downstream friction.

## 24. Deterministic Regeneration Contract

**Recommended:** equivalent authored setup, normalized plan-decision set, generation window, and semantic provenance must produce equivalent plan output and decision diagnostics. Array insertion order and acceptance history must not affect results. Operational timestamps such as accepted/generated time are provenance only and must not influence placement unless a future rule explicitly makes time semantic.

## 25. Durability Classification

**Recommended:** accepted plan decisions are **authoritative planning data—durable user data**. They must survive regeneration, reload, and ordinary persistence failure under the existing session-first authority principle. The last successful stored representation remains the durable checkpoint.

## 26. Durable Surface Assessment

| Option | Assessment |
|---|---|
| inside authored setup | **Misaligned:** conflates reusable recurring intent with date-specific planning decisions |
| separate active planning storage key | **Partially aligned:** clear boundary, but introduces multi-surface atomicity and durability-status complexity |
| same active envelope, explicit separate section | **Recommended semantic direction:** keeps authored and planning sections distinct while allowing one atomic active snapshot |

**Deferred:** concrete envelope/version changes require a dedicated durable-format design. The recommendation is semantic, not authorization to modify V1.

## 27. Profile Semantics

**Recommended:** profiles remain named reusable authored-setup snapshots and exclude active occurrence decisions. Saving a profile must not silently capture date-specific plan state. A future “plan snapshot” would be a different artifact/type.

## 28. Backup Semantics

**Confirmed:** V1 backups contain authored setup only. **Recommended:** preserve that meaning and compatibility. Because plan decisions are durable user data, a future complete-state backup/export type or new version must be designed to include them; V1 must not be silently reinterpreted.

## 29. Clear Semantics

**Recommended:** `Clear Local Data` clears active plan decisions along with authored state, profiles, and other local user data because the user explicitly requested total local deletion. A future narrower “Clear plan overrides” action should remove decisions while retaining authored setup.

## 30. Profile Load Replacement Semantics

**Recommended:** loading a profile replaces authored setup but must not silently delete plan decisions. Decisions should be preserved and semantically revalidated against the replacement. Exact resolvable, compatible identities may remain applicable; mismatches become inactive `needsReview`/orphan diagnostics. Automatic retargeting is forbidden.

**Inferred:** source/base provenance is necessary to prevent coincidental ID reuse from silently applying an old decision to semantically different profile content.

## 31. Backup Import Replacement Semantics

**Recommended:** importing an authored-only V1 backup follows the same preserve-and-revalidate rule for active plan decisions. The import replaces authored setup, not the separate active planning authority. A future complete-state import must explicitly define whether it replaces both sections.

## 32. Replacement Matrix

| Operation | Authored State | Plan Decisions | Recommendation |
|---|---|---|---|
| narrow authored edit | mutate | preserve/revalidate | apply compatible; diagnose incompatible/orphaned |
| setup commit | replace setup-owned fields | preserve/revalidate | same |
| manual event edit | mutate | preserve/revalidate | manual-target decisions require source-capability checks |
| profile load | full authored replacement | preserve, revalidate, never retarget | incompatible decisions inactive/reviewable |
| backup import | full authored replacement | preserve, revalidate, never retarget | same for authored-only V1 |
| clear | reset | clear | explicit destructive scope includes decisions |
| regeneration | preserve | preserve | consume decisions deterministically |

## 33. Provenance Requirements

**Recommended required semantic provenance:** decision identity; target occurrence identity (or canonical conflict-condition identity); decision kind; normalized desired result; explicit user ownership/acceptance; accepted/updated timestamp for explanation only; stable source identities; and sufficient base source signature/version to detect semantic replacement or incompatible edits.

**Recommended optional provenance:** originating fix kind, source friction identity, original recommendation summary, and originating Preview generation identifier. These help explainability but must not be the only target identity.

**Not required for current authority:** every intermediate recommendation, click sequence, prior override value, or complete Preview snapshot.

## 34. Explainability Requirements

**Recommended:** DayFrame must be able to answer what changed, which occurrence/conflict the decision targets, that the user explicitly accepted it, which authored sources generated the target, whether it currently applies, and why it is conflicted/orphaned when it does not.

For example: “Workout is at 18:00 because you set an occurrence placement override for the 2026-08-21 occurrence generated from template T and recurrence R.”

## 35. History / Undo Determination

**Recommended:** command history is not required for current override authority. Final normalized state plus provenance is sufficient. Undo can initially mean replace/remove the current override; richer multi-step undo or audit history is **Deferred** and must remain separate from current authority.

## 36. Current Authority Versus Historical Acceptance

**Recommended:** `PlanDecision` describes the current desired plan. A record that the user once accepted recommendation X is historical/analytical evidence and has a different retention and immutability contract. Do not use analytics history to reconstruct current authority, and do not treat current override deletion as erasure of any future historical evidence system.

## 37. Manual-Event Implications

**Confirmed:** manual events are already authored fixed occurrences and their projections inherit the authored event ID. **Recommended:** default planning actions must not silently move, skip, or semantically rewrite manual events. Conflict acknowledgement can refer to them; any future editable occurrence exception must use an explicitly authorized subtype and preserve the authored event boundary.

## 38. Work/Shift Implications

**Confirmed:** work blocks are generated from authoritative shift/cycle setup and currently act as strong anchors. **Recommended:** generic move, skip, duration, category, and priority occurrence overrides do not apply to work blocks in the initial model. Changing work belongs to shift/cycle authored editing unless a separately governed work-exception domain object is introduced.

## 39. Conflict-Acceptance Semantics

**Recommended:** `acceptConflict` is not an occurrence property. It is a `ConflictAcknowledgement` targeting a semantic conflict kind plus a canonical set/pair of occurrence identities and, where necessary, the material condition being accepted. It applies only while that conflict still exists equivalently. If placement, participants, or severity/material condition changes, acknowledgement is revalidated and may become inactive/needs review; it must not suppress unrelated future friction sharing a transient friction ID shape.

## 40. Candidate Authority Models

**Inferred:** one monolithic override union can technically include acknowledgement but obscures its relational lifecycle. Separate top-level stores clarify semantics but fragment a single planning-decision authority. A general `PlanDecision` category with discriminated branches preserves one ownership boundary while retaining distinct validation rules.

## 41. Authority Model Matrix

| Model | Handles Placement | Handles Semantic Changes | Handles Conflict Acceptance | Clear Authority | Future Extensibility | Recommendation |
|---|---:|---:|---:|---:|---:|---|
| one `PlanOverride` union | yes | yes | awkwardly | medium | medium | not preferred |
| overrides + acknowledgements as separate authorities | yes | yes | yes | high locally, fragmented globally | medium | acceptable but not adopted |
| generalized `PlanDecision` | yes | yes | yes through distinct branches | high | high | **adopt** |

## 42. Adopted Plan-Decision Authority Contract

**Recommended:** `PlanDecision` is durable, user-owned, planning-layer authority separate from recurring authored setup and derived Preview. It contains normalized occurrence overrides and conflict acknowledgements. Decisions target stable logical occurrence/conflict identities, survive regeneration and reload, enter generation at subtype-appropriate stages, revalidate against authored changes, remain durable when orphaned, and are removed only through explicit user action or full local clear. Profiles and current authored-only backups exclude them. Equivalent normalized authority inputs generate equivalent outputs.

## 43. Required Behavioral Invariants

1. **Recommended:** recommendations remain derived until explicitly accepted.
2. **Recommended:** acceptance creates or updates explicit planning authority.
3. **Recommended:** occurrence decisions never mutate recurring definitions implicitly.
4. **Recommended:** Preview remains derived and disposable.
5. **Recommended:** regeneration consumes retained plan decisions.
6. **Recommended:** decisions survive reload through governed durability.
7. **Recommended:** identity is stable across overlapping/range-expanded regeneration.
8. **Recommended:** missing/incompatible targets are diagnosed, never silently deleted or retargeted.
9. **Recommended:** one canonical final override exists per occurrence; engine meaning is order-independent.
10. **Recommended:** conflict acknowledgement is relational and condition-specific.
11. **Recommended:** full authored replacement has explicit preserve/revalidate semantics.
12. **Recommended:** removing a decision returns the occurrence/conflict to engine-derived behavior.
13. **Recommended:** source capability rules prevent generic overrides of manual/work anchors.
14. **Recommended:** durability outcome remains separate from successful runtime mutation.

## 44. Required Later Test Contract

**Recommended:** later implementation must directly test:

- stable occurrence identity across identical, overlapping, narrower, and wider windows;
- weekly, `timesPerUserWeek`, user-day boundary, week-start, overnight, and DST-relevant identity behavior;
- collision resistance and multiple occurrences per source/day;
- move, skip, duration, category, and priority final-state persistence and regeneration;
- conflict acknowledgement identity and invalidation;
- compatible merge, same-field replacement, skip exclusivity, canonical order, and input-order independence;
- authored title/duration/recurrence/preference edits;
- disabled/deleted/missing source orphan handling and non-retargeting;
- reload and persistence-failure session authority;
- clear and narrow override removal;
- profile exclusion plus load preservation/revalidation;
- V1 backup exclusion plus import preservation/revalidation;
- provenance/explanation output;
- manual/work source restrictions; and
- no recurring template/recurrence mutation from occurrence decisions.

## 45. Architectural Alignment Assessment

| Principle | Assessment | Finding |
|---|---|---|
| authoritative/derived separation | Aligned | explicit planning authority avoids promoting Preview or rewriting recurring intent |
| deterministic planning | Aligned | normalized inputs and stable identity remove replay/insertion-order dependence |
| provenance | Aligned | source and acceptance provenance are mandatory |
| explainability | Aligned | current result and applicability can be traced |
| durable-data governance | Partially aligned | classification is decided; schema/version/migration remains deferred |
| user-data preservation | Aligned | orphaned/incompatible decisions are retained, not silently deleted |
| future Planner semantics | Aligned | create/update/remove maps to explicit authority operations |
| future engine architecture | Partially aligned | subtype stages are defined; APIs and diagnostics remain to design |
| implementation complexity | Partially aligned | normalized state controls complexity, but identity must be solved first |

## 46. Open Questions

- **Unresolved:** exact occurrence-identity schema, encoding, versioning, and migration behavior.
- **Unresolved:** a source fingerprint/revision model capable of distinguishing compatible edits from coincidental identifier reuse.
- **Unresolved:** whether multiple same-source occurrences on one user-day use ordinal, authored occurrence key, or another recurrence-specific discriminator.
- **Unresolved:** concrete placement-override semantics (absolute local time, constrained window, or explicit interval) across DST and boundary changes.
- **Unresolved:** durable active-envelope version and migration path.
- **Unresolved:** UI for conflicted/orphaned decisions and explicit re-confirmation.
- **Deferred:** range/bulk overrides, work exceptions, manual-event occurrence exceptions, resource decisions, audit history, undo stack, analytics, and learning inputs.

## 47. Recommended Next Task

**Recommended:** **Task 2.7 — Establish Stable Generated-Occurrence Identity**.

That task should define identity for template/recurrence occurrences, work occurrences, and manual projections; prove window invariance; cover multiple-occurrence and temporal-boundary behavior; decide versioning; and expose identity without yet implementing plan-decision persistence or engine effects.

After identity is accepted, the next seam should design the concrete `PlanDecision` representation, validation diagnostics, active durable envelope, and lifecycle before changing engine behavior.

## 48. Deviations

**Confirmed:** none. No production code, tests, state types, store APIs, persistence, profiles, backups, engine behavior, Preview behavior, UI, or governance document was modified.

## 49. Discoveries and Deferred Work

**Confirmed discovery:** scheduled template IDs are deterministic wrappers around candidate IDs; they are not independent occurrence identities. **Confirmed discovery:** manual projections already possess stable authored identity. **Confirmed discovery:** work IDs omit cycle/segment context. **Confirmed discovery:** recurrence expansion, particularly weekly and `timesPerUserWeek`, makes date-based identity sensitive to represented eligible days and week-boundary semantics.

**Deferred:** all executable work, including stable IDs, plan-decision types, persistence/versioning, engine consumption, diagnostics, UI, and migration.

## 50. Validation

**Confirmed:** investigation was static and evidence-backed; no new tests were necessary to establish the current identity algorithms because source and direct tests explicitly cover them. The required engine, block, friction, state, profile, backup, replacement, and relevant test surfaces were inspected.

**Confirmed:** the Task 2.6 specification hash was recorded and its final sentence verified. Only this separate result artifact was created for Task 2.6. Existing cumulative working-tree changes from completed prior tasks were left untouched. No governance or durable-format file changed.

## 51. Final Completion Determination

**Confirmed complete:** DayFrame now has an evidence-backed semantic authority contract for user-owned plan decisions. The contract defines what decisions target, stable-identity requirements, occurrence scope, normalization and conflict semantics, authored-change revalidation and orphan retention, deterministic regeneration, subtype-specific engine stages, durability, profile/backup/clear/replacement behavior, provenance, history separation, conflict acknowledgement, implementation invariants, and later tests. Concrete schema is correctly deferred because stable occurrence identity is the prerequisite; Task 2.7 should establish that identity before override implementation.
