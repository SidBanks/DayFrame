# Task 2.33 — Define PlanDecision V1 Domain Semantics and Durable Decision Lifecycle

## Status

Ready for investigation and architectural definition.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Architecture-first domain-contract task.

Task 2.33 defines **PlanDecision V1** as DayFrame’s first durable planning-decision concept.

It establishes:

* what a PlanDecision is;
* what it is not;
* decision ownership;
* decision identity;
* target reference semantics;
* supported decision kinds;
* lifecycle state;
* acceptance semantics;
* applicability;
* supersession;
* stale-reference handling;
* replay authority;
* invalidation;
* conflict behavior;
* persistence-readiness requirements;
* relationship to Preview, SuggestedFix, authored state, and `DurableOccurrenceReference V1`.

Task 2.33 does **not** implement PlanDecision persistence, replay, application, UI, history storage, or durable-format changes.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before investigation:

1. verify the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 2.32 is complete;
6. review the Task 2.32 result and current `DurableOccurrenceReference V1`;
7. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`TASK_2.33_DEFINE_PLANDECISION_V1_DOMAIN_SEMANTICS_AND_DURABLE_DECISION_LIFECYCLE_RESULT.md`

If a safe PlanDecision V1 contract cannot be defined without changing the accepted durable-reference or source-incarnation architecture, stop and report the missing prerequisite rather than broadening scope.

---

# 2. Purpose

DayFrame can now durably identify one semantic occurrence from one specific source lifetime.

Task 2.32 established:

```text
DurableOccurrenceReference V1
    =
    source-lifetime lineage
    +
    canonical occurrence coordinates
```

and a pure resolver that distinguishes:

* `resolved`;
* `sourceMissing`;
* `lifetimeMismatch`;
* `occurrenceMissing`;
* `invalidReference`;
* `unsupportedVersion`.

That makes it possible to answer:

> What occurrence did this durable fact originally refer to?

The next question is:

> What durable planning fact should DayFrame retain about that occurrence?

Task 2.33 defines that concept as `PlanDecision V1`.

---

# 3. Governing Evidence

This task is governed by:

* Task 2.23 planning-decision findings where applicable;
* Task 2.24–2.31 source-incarnation architecture;
* Task 2.32 `DurableOccurrenceReference V1`;
* current SuggestedFix behavior;
* current Preview revision behavior;
* stale-preview protections;
* current authored-state authority;
* current persistence/versioning ADRs;
* current lack of execution/history state.

Executable behavior is authoritative where prior design language and implementation differ.

---

# 4. Architectural Objective

At completion, DayFrame must have an implementation-ready answer to:

```text
What durable planning choice was made?
Who/what does it target?
What authority does it have?
When is it applicable?
When is it stale?
When is it superseded?
When may it replay?
What happens if its target no longer resolves?
What does acceptance mean?
What does regeneration do with it?
```

The result must be precise enough that a later implementation task can add PlanDecision persistence and replay without inventing policy while coding.

---

# 5. Core PlanDecision Definition

Define `PlanDecision` as:

> A durable record of an explicitly accepted planning choice that is intended to influence future schedule regeneration when its target and preconditions remain applicable.

A PlanDecision is not:

* a Preview snapshot;
* a SuggestedFix;
* a transient Try result;
* a friction point;
* an execution/history event;
* a source-lifecycle operation;
* an authored scheduling source;
* a raw runtime block mutation;
* a generic undo record.

---

# 6. Decision Authority

A PlanDecision must represent **accepted planning authority**, not merely a recommendation.

The distinction must be explicit:

```text
SuggestedFix
    = recommendation

Try
    = temporary derived experiment

Accept
    = user-authorized durable planning choice
        ↓
PlanDecision
```

Do not make every generated suggestion a durable decision.

---

# 7. Acceptance Boundary

Determine the exact operation that causes a PlanDecision to exist.

Preferred rule:

> A PlanDecision is created only after explicit acceptance of a planning action.

Do not create PlanDecision records merely because:

* a suggestion was displayed;
* a preview was generated;
* a Try action was performed;
* a friction point exists;
* a user navigated to Setup.

---

# 8. Try Versus Accept

Define Try and Accept separately.

## Try

* modifies only derived Preview state;
* does not create durable authority;
* can be discarded by regeneration;
* remains reversible/experimental.

## Accept

* records an explicit planning choice;
* creates or updates durable PlanDecision authority;
* must be replayable or deliberately classified otherwise.

This distinction should govern later implementation.

---

# 9. Relationship To Current SuggestedFix

Audit existing SuggestedFix kinds and current preview-revision behavior.

Determine which current fixes are candidates for durable acceptance.

Do not assume every SuggestedFix kind can become a PlanDecision.

Classify each current fix as one of:

* durable-decision candidate;
* authored-edit navigation only;
* Preview-only experiment;
* unsupported for durable acceptance.

---

# 10. Decision Kind Vocabulary

Define an explicit versioned decision-kind vocabulary.

The exact names should follow current semantics.

Potential examples may include:

* move occurrence;
* skip occurrence;
* preserve occurrence at chosen placement;
* defer occurrence;
* another currently supported revision action.

Do not invent speculative kinds unrelated to current behavior.

---

# 11. Decision Kind Stability

Decision kinds are durable semantic vocabulary.

Do not encode UI labels as kind identifiers.

Prefer stable machine-readable discriminators.

---

# 12. `changeFixedTime` Boundary

Current `changeFixedTime` behavior routes the user to Setup rather than directly revising authored authority.

Determine whether it is:

* not a PlanDecision;
* an authored-edit workflow;
* or a future durable decision only after the authored edit is committed.

Preferred default:

> navigation to authored Setup is not itself a durable PlanDecision.

Document definitively.

---

# 13. Decision Target

Every occurrence-scoped PlanDecision must target a validated `DurableOccurrenceReference V1`.

Do not target:

* runtime scheduled-block ID;
* candidate ID;
* friction ID;
* SuggestedFix ID;
* preview index;
* day-group index.

Those are transient.

---

# 14. Single-Target Versus Multi-Target Decisions

Determine whether PlanDecision V1 may target:

* exactly one occurrence;
* multiple occurrences;
* one primary occurrence plus related context.

Prefer the smallest contract consistent with current planning actions.

If current accepted decisions are occurrence-local, V1 should likely be single-target.

Do not add multi-target semantics speculatively.

---

# 15. Decision Identity

Define a durable PlanDecision identity separate from its target.

A decision needs an identity if multiple decisions can:

* target the same occurrence;
* supersede one another;
* be referenced diagnostically;
* be migrated independently.

Determine requirements for:

* decision ID;
* uniqueness;
* opacity;
* allocation;
* persistence.

Do not reuse target reference as decision ID.

---

# 16. Decision ID Semantics

Preferred:

> `PlanDecisionId` identifies one durable decision record, not the occurrence and not the decision kind.

Evaluate opaque UUID-style identity consistent with project durable identifiers.

Do not implement allocation in this task unless needed for contract tests.

---

# 17. Decision Version

PlanDecision requires an independent version.

Preferred:

```ts
version: 1
```

Do not couple it to:

* `DurableOccurrenceReference`;
* Active V2;
* Profile V2;
* Backup V2;
* `OccurrenceIdentity`.

---

# 18. Decision Structure

Define an implementation-ready V1 shape.

Conceptually:

```ts
type PlanDecisionV1 = {
  version: 1;
  id: PlanDecisionId;
  kind: PlanDecisionKind;
  target: DurableOccurrenceReferenceV1;
  payload: ...;
  acceptedAt: string;
  provenance: ...;
};
```

Exact fields must be justified.

Do not add fields merely because they might be useful later.

---

# 19. Decision Payload

Each decision kind may require kind-specific payload.

Examples:

## Move

* intended placement coordinate/time;
* possibly user-day semantics.

## Skip

* no additional placement payload.

The payload must contain the durable intent needed for replay.

Do not store derived block snapshots if a smaller semantic instruction is sufficient.

---

# 20. Placement Payload Semantics

If a decision moves an occurrence, define what placement data means durably.

Audit:

* user-day boundary;
* local date;
* local clock time;
* timezone assumptions;
* overnight handling;
* effective segment preferences.

Do not reuse transient scheduled start/end timestamps without determining their durable semantic meaning.

---

# 21. Absolute Versus Relative Placement

Determine whether move decisions express:

* absolute local date/time;
* same user-day + clock time;
* relative offset;
* another canonical placement instruction.

The choice must be replayable against current authored authority.

---

# 22. Placement And User-Day Boundary

If placement is defined relative to a user day, specify how replay handles later boundary changes.

Potential outcomes:

* preserve absolute intended instant;
* preserve user-day-relative intent;
* decision becomes inapplicable;
* replay recalculates.

Do not leave this implicit.

---

# 23. Scheduling Preference Changes

Determine how PlanDecision applicability responds when:

* day-boundary changes;
* week-start changes;
* segment-level preference overrides change.

A target reference may still resolve while the decision payload becomes semantically incompatible.

PlanDecision applicability therefore may require more than reference resolution.

---

# 24. Decision Preconditions

Define whether a PlanDecision stores or derives preconditions.

Potential preconditions:

* target resolves;
* occurrence remains movable;
* intended placement is valid;
* source remains enabled;
* target remains generated;
* decision-kind assumptions still hold.

Prefer recomputation from current authority where possible.

Do not persist large derived-state snapshots merely as preconditions.

---

# 25. Applicability

Define `applicable` as:

> The target reference resolves to the intended current occurrence and the decision’s semantic action can still be applied under current authoritative constraints.

This is stronger than reference `resolved`.

---

# 26. Resolver Outcome Mapping

Define PlanDecision behavior for every `DurableOccurrenceReference` outcome.

At minimum:

| Reference result   | Decision implication         |
| ------------------ | ---------------------------- |
| resolved           | evaluate applicability       |
| sourceMissing      | stale / not applicable       |
| lifetimeMismatch   | stale / not applicable       |
| occurrenceMissing  | stale / not applicable       |
| invalidReference   | invalid durable decision     |
| unsupportedVersion | unsupported durable decision |

Refine status names.

---

# 27. LifetimeMismatch Semantics

A PlanDecision must never silently retarget a recreated same-ID source.

If resolver returns `lifetimeMismatch`:

* do not replay;
* do not mutate the new occurrence;
* retain or retire the decision according to durable lifecycle policy.

This is a critical invariant.

---

# 28. SourceMissing Semantics

If target source is deleted:

* decision cannot replay;
* classify distinctly from lifetime mismatch if useful for diagnostics;
* do not reinterpret another similar occurrence as the target.

---

# 29. OccurrenceMissing Semantics

If source lifetime remains but the specific occurrence no longer exists:

* decision becomes inapplicable/stale;
* do not rotate source incarnation merely to preserve the decision;
* do not retarget another occurrence.

---

# 30. InvalidReference Semantics

A persisted PlanDecision containing an invalid V1 reference must be treated as invalid durable data.

Do not silently drop or repair it without explicit migration/recovery policy.

---

# 31. UnsupportedReferenceVersion

A future reference version inside an otherwise known PlanDecision version must not be interpreted as V1.

Determine whether the decision becomes:

* unsupported;
* quarantined;
* migration-required.

Do not guess.

---

# 32. Decision Lifecycle States

Define whether PlanDecision itself has persistent state such as:

* active;
* superseded;
* stale;
* retired.

Or whether these are derived classifications from current authority.

Prefer deriving current applicability where possible.

Do not persist rapidly changing derived status unless necessary.

---

# 33. Durable Versus Derived Decision Status

Distinguish:

## Durable facts

* accepted decision record;
* target;
* kind;
* payload;
* acceptance provenance;
* explicit supersession/removal if applicable.

## Derived status

* currently applicable;
* stale because target missing;
* stale because occurrence missing;
* blocked by current conflict;
* successfully replayable.

This distinction is essential.

---

# 34. Supersession

Define how a newer accepted decision affects an older decision targeting the same semantic occurrence.

Possible rule:

> At most one active decision per target + decision domain.

Determine whether newer acceptance:

* supersedes older decision;
* replaces it atomically;
* coexists if kinds differ.

Do not allow ambiguous replay order.

---

# 35. Same-Target Conflicts

Examples:

* move occurrence to 09:00;
* later move same occurrence to 10:00;
* skip same occurrence after move.

Define deterministic authority.

Potential model:

* newer accepted decision supersedes earlier incompatible decisions.

Do not rely on array order implicitly.

---

# 36. Supersession Identity

If supersession is durable, determine whether record includes:

* `supersedesDecisionId`;
* `supersededByDecisionId`;
* neither, with canonical active-index derivation.

Prefer minimal representation.

---

# 37. Decision Ordering

If multiple independent PlanDecisions replay during generation, define deterministic ordering.

Potential bases:

* acceptedAt;
* decision ID;
* target grouping;
* semantic precedence by kind.

Do not leave ordering to storage insertion order.

---

# 38. `acceptedAt`

Determine whether acceptance timestamp is required.

Potential uses:

* deterministic supersession;
* audit/explanation;
* user-visible history later.

If included:

* use canonical ISO timestamp;
* do not use it as decision identity;
* define ties deterministically.

---

# 39. Acceptance Provenance

Determine minimal provenance.

Potential:

* source: user acceptance;
* originating SuggestedFix kind;
* optional friction classification.

Do not persist full friction/SuggestedFix snapshots unless necessary.

---

# 40. SuggestedFix Provenance

If a decision originates from SuggestedFix, decide whether to persist:

* SuggestedFix semantic kind only;
* source friction reason;
* no SuggestedFix provenance.

SuggestedFix IDs are transient and should not be durable foreign keys.

---

# 41. Manual User Decision

Future users may make a planning decision without a SuggestedFix.

PlanDecision V1 should not require SuggestedFix provenance unless current product scope explicitly does.

Prefer decision semantics independent from recommendation source.

---

# 42. Decision Ownership

Determine which layer owns PlanDecision.

Preferred:

> store/domain durable planning authority, distinct from authored setup and derived Preview.

It should not live inside:

* source objects;
* Preview;
* UI local state.

---

# 43. `DayFrameState` Boundary

Decide whether future runtime aggregate should include PlanDecision collection.

Task 2.1 established that `DayFrameState` already mixes active authored state, profiles, and Preview.

Do not automatically add decisions there without considering authority separation.

Potential:

* dedicated store-owned decision collection outside authored setup;
* explicit runtime aggregate field.

Task 2.33 should determine, not implement.

---

# 44. Authored Setup Boundary

PlanDecision must not be part of `DayFrameAuthoredSetup`.

Authored setup describes user-authored scheduling sources and configuration.

PlanDecision is durable planning authority layered over authored state.

---

# 45. Profile Boundary

Profiles should not capture active PlanDecisions by default.

A profile is a reusable pattern and instantiates fresh source lifetimes.

Any decision targeting old lifetimes would immediately stale.

Therefore preferred rule:

> Profile V2 excludes PlanDecision.

Confirm.

---

# 46. Backup Boundary

Backup V2 currently preserves exact active source lifetimes but excludes PlanDecision.

Once PlanDecision becomes durable, determine whether future backup evolution must include it.

Task 2.33 should classify this as:

* required future Backup V3/V2 evolution;
* explicitly deferred.

Do not change Backup V2 now.

---

# 47. Active Persistence Boundary

Determine whether PlanDecision will share Active V2 storage or use an independently versioned durable surface.

This is a major decision.

Evaluate:

## Option A — embed in future Active version

Pros:

* atomic authored + decision checkpoint.

Cons:

* couples authored data and decision versioning.

## Option B — independent decision surface

Pros:

* independent evolution;
* clearer authority separation.

Cons:

* cross-surface atomicity/recovery complexity.

Task 2.33 must recommend one.

Do not implement it yet.

---

# 48. Atomicity Requirement

Determine whether accepted decision persistence must be atomic with any authored mutation.

For pure occurrence move/skip decisions that do not modify authored setup, likely no authored mutation occurs.

For decisions that require authored edits, PlanDecision may not be appropriate.

Clarify.

---

# 49. Acceptance Transaction

Define conceptual acceptance transaction:

```text
fresh Preview / valid candidate
    ↓
user Accept
    ↓
construct DurableOccurrenceReference
    ↓
construct PlanDecision
    ↓
validate decision
    ↓
commit durable planning authority
    ↓
regenerate/replay
```

Do not persist before the target reference is constructed and validated.

---

# 50. Stale Preview Acceptance

Task 2.5 blocks suggested-fix actions on stale Preview.

PlanDecision acceptance must inherit that safety.

Do not permit acceptance from stale Preview evidence.

---

# 51. Try Acceptance Transition

If user tries a move in Preview and then accepts it, determine whether acceptance uses:

* original source reference + chosen final payload;
* transformed Preview block state.

Preferred:

> reconstruct/validate durable semantic intent from authoritative source/reference and accepted action, not clone Preview state wholesale.

---

# 52. Replay Definition

Define replay as:

> Applying an active applicable PlanDecision to schedule generation or a post-generation planning stage so that accepted planning intent survives regeneration.

Replay is not:

* re-running UI clicks;
* mutating authored source IDs;
* editing Preview snapshots directly.

---

# 53. Replay Stage

Determine where decisions apply in the generation pipeline.

Potential stages:

1. source/candidate expansion;
2. placement;
3. post-placement revision;
4. friction handling.

This is critical.

Audit current `reviseSchedulePreview`/SuggestedFix behavior and determine the narrowest semantically correct insertion point for future replay.

Do not implement.

---

# 54. Replay And Determinism

Given:

* same authored authority;
* same active PlanDecision set;
* same generation inputs;

replay must produce deterministic output.

No dependence on prior Preview instance.

---

# 55. Replay And Preview

Preview becomes:

```text
authored authority
+
active applicable PlanDecisions
+
generation inputs
=
derived Preview
```

This is likely the intended future model.

Task 2.33 should confirm or revise.

---

# 56. Preview Is Not Decision Authority

Deleting/regenerating Preview must not delete accepted PlanDecisions.

A PlanDecision must survive Preview regeneration if still applicable.

That is its reason for existence.

---

# 57. Preview Revision Future

Once PlanDecision replay exists, determine eventual role of `reviseSchedulePreview`.

Potential future:

* Try continues using Preview-only revision;
* Accept creates PlanDecision and regeneration applies it.

This is the likely clean split.

Document it.

---

# 58. Accepted Move Semantics

For move decisions, define what replay must attempt.

Examples:

* force exact target start;
* prefer target start;
* reserve target time;
* treat as fixed placement override.

Do not use vague "move" semantics.

---

# 59. Accepted Skip Semantics

If skip is a supported durable decision:

> the targeted occurrence should not be scheduled/generated in Preview while the decision remains applicable.

Determine whether it:

* suppresses candidate creation;
* marks candidate intentionally skipped;
* removes after generation.

This affects replay stage.

Define conceptually.

---

# 60. Decision Effect On Friction

Determine whether replayed decisions participate normally in friction detection.

Likely:

* yes;
* accepted move can create conflicts;
* accepted skip can remove conflicts.

Do not encode "accepted" as automatically conflict-free.

---

# 61. Decision Conflict

Define what happens when an applicable PlanDecision cannot be satisfied under current authored constraints.

Potential status:

* `blocked`;
* `conflicted`;
* `unapplied`.

Do not silently ignore.

---

# 62. Applied Versus Applicable

Distinguish:

* applicable = target/action still semantically valid;
* applied = replay successfully influenced generation;
* blocked = applicable intent could not be realized.

This likely belongs in derived replay result, not durable record.

---

# 63. Decision Replay Result

Define future derived result shape conceptually.

Possible outcomes:

* applied;
* stale;
* blocked;
* superseded;
* unsupported.

Do not persist these unless separately governed.

---

# 64. Decision Removal

Define whether user can explicitly remove/revoke an accepted PlanDecision.

Preferred:

> Yes. Durable planning authority should be removable by explicit user action.

Determine whether removal:

* deletes record;
* marks revoked;
* creates compensating decision.

Prefer simplest current product need.

---

# 65. Undo Semantics

Do not confuse removal with full historical undo.

V1 may support:

> remove this accepted planning decision.

No general action history required.

---

# 66. Revocation Versus Supersession

Differentiate:

* revoke/remove: user withdraws decision;
* supersede: newer accepted decision replaces old authority.

Determine whether both require persistent historical records.

Prefer no historical retention unless product needs it.

---

# 67. Decision Retention After Staleness

If target becomes stale, should the decision remain stored?

Possible reasons to retain:

* Backup V2 restore may make it resolve again;
* source lifetime may reappear only through exact restoration;
* explanation/history.

But retained stale decisions can accumulate.

Task 2.33 must decide.

---

# 68. Backup V2 Restoration And Stale Decisions

Important scenario:

1. decision targets lifetime A;
2. active graph changes to lifetime B;
3. decision becomes `lifetimeMismatch`;
4. Backup V2 restores lifetime A.

Should decision become applicable again?

If the decision is retained and lifetime A truly returns, likely yes.

This is a major lifecycle decision.

Define explicitly.

---

# 69. Profile Activation And Decisions

Profile activation creates fresh lifetimes.

Existing decisions should therefore become stale/lifetime-mismatched, not retarget.

Determine whether profile load:

* preserves stale decisions;
* clears decisions;
* requires explicit replacement policy.

Task 2.23 may have prior guidance; reconcile it.

---

# 70. Backup V1 Import And Decisions

Same issue as profile activation.

Fresh lifetimes mean old decisions cannot apply.

Decide retain-versus-clear policy.

---

# 71. Full Active Clear And Decisions

When active authored authority is cleared:

* all occurrence-targeted decisions become sourceMissing.

Should decisions be preserved for potential Backup V2 recovery or cleared because the user explicitly cleared local data?

Likely clear must remove them if they are local durable planning authority.

Define.

---

# 72. Recovery Replacement And Decisions

If active recovery replacement preserves current accepted source lifetimes, decisions targeting those lifetimes should remain potentially applicable.

If recovery replacement changes source lifetime, resolver outcomes govern.

Do not infer by operation name alone.

---

# 73. Backup V2 Restore And Decision Persistence Surface

If decisions live on an independent surface and Backup V2 does not include them, restoring source lifetimes may cause old retained decisions to become applicable again.

Determine whether that is intended.

This is important before persistence architecture.

---

# 74. Decision Garbage Collection

Define whether V1 needs automatic cleanup of permanently stale decisions.

Preferred default:

* no automatic destructive garbage collection;
* stale state derived;
* explicit removal later.

But consider storage growth.

Do not add cleanup policy without need.

---

# 75. Decision Validation

Define strict validation requirements.

At minimum:

* PlanDecision version;
* decision ID;
* kind;
* target reference;
* kind-specific payload;
* acceptedAt if present;
* exact keys;
* no unknown extra fields if project conventions favor strict schemas.

---

# 76. Reference Validation Inside Decision

A PlanDecision is invalid if its target `DurableOccurrenceReference` is structurally invalid.

Unsupported target-reference version may make the decision unsupported rather than malformed.

Distinguish.

---

# 77. Decision Version Migration

PlanDecision V1 should be independently versioned.

Define future handling:

* unknown decision version → unsupported;
* known decision version with unsupported reference version → unsupported target;
* migration must be explicit.

Do not implement migration.

---

# 78. Decision Equality

Define whether two PlanDecisions are considered equal by:

* decision ID;
* full semantic structure;
* target + kind + payload.

Likely distinguish identity versus semantic equivalence.

Document both if useful.

---

# 79. Semantic Conflict Key

Future replay/supersession may need a canonical conflict key.

Potential:

```text
target durable reference
+
decision domain
```

Do not reuse serialized JSON string blindly.

Determine whether `durableOccurrenceReferencesEqual` is sufficient.

---

# 80. Decision Domain

If different kinds can coexist on one target, define domains.

Example:

* placement decision;
* inclusion/skip decision.

A skip and a move may conflict.

Prefer explicit conflict rules rather than ad hoc ordering.

---

# 81. Deterministic Supersession

If newer decision supersedes old:

* define chronological precedence;
* define tie-breaker.

Example:

1. acceptedAt;
2. decision ID lexical order.

Do not rely on storage array order.

---

# 82. Decision Provenance And Explainability

PlanDecision should contain enough semantic information to later explain:

> You asked DayFrame to move this occurrence to 09:00.

But avoid storing transient UI prose.

Persist machine semantics; derive user explanation.

---

# 83. User Intent Versus Engine Suggestion

Persist the accepted intent, not the recommendation machinery.

If an engine suggested move-to-09:00 and user accepted:

* decision semantics are "move target to 09:00";
* not "apply SuggestedFix ID 47".

---

# 84. Decision Creation From SuggestedFix

Audit whether current SuggestedFix contains enough semantic payload to construct a PlanDecision.

If not, document missing provenance.

Do not change SuggestedFix in this task unless investigation-only type evidence is necessary.

---

# 85. Decision Creation From Manual Planning

Consider whether future user-direct placement can create the same decision kind without SuggestedFix.

Prefer yes if semantic action is identical.

This keeps durable domain vocabulary independent from recommendation source.

---

# 86. Decision Ownership In Store API

Define future store actions conceptually.

Potential:

* `acceptPlanDecision(...)`;
* `removePlanDecision(...)`;
* `getPlanDecisions()`;
* `retryPlanDecisionPersistence()`.

Do not implement yet.

---

# 87. Decision Persistence Surface Options

Perform explicit architectural comparison.

## Option A — Independent PlanDecision surface

Possible envelope:

```text
app: DayFrame
surface: planDecisions
version: 1
decisions: [...]
```

## Option B — Active V3

Embed decisions with active authored authority.

Evaluate:

* atomicity;
* lifetime restoration;
* profile exclusion;
* Backup evolution;
* recovery;
* migration;
* retry;
* independent versioning.

Choose one.

---

# 88. Recommended Persistence Ownership

Preferred initial hypothesis:

> PlanDecision should have an independent durable surface because it is neither authored setup nor derived Preview.

But do not assume; validate against atomicity/recovery.

---

# 89. Cross-Surface Atomicity

If independent:

* accepting decision changes decision surface only;
* authored state unchanged;
* Preview regenerated.

Potential failure:

* decision runtime accepted;
* decision persistence fails.

Apply Phase 1 durability principles.

Document.

---

# 90. Decision Durability Status

Determine whether PlanDecision needs its own durability status/desired condition, analogous to active/profile surfaces.

If independent durable surface, likely yes.

Do not add it now.

---

# 91. Protected Decision Ingress

Future durable decision surface will need corruption/version protection.

Task 2.33 should define expected high-level behavior:

* invalid current decision surface does not silently clear;
* raw user data protected;
* ordinary overwriting blocked;
* explicit recovery.

Reuse established durability governance.

---

# 92. Decision Quarantine

If one decision entry is invalid while collection envelope is valid, determine whether entry-level quarantine is appropriate, analogous to Profile V2.

Consider:

* decisions are user-authored durable intent;
* silent loss is unacceptable.

Likely yes.

Define conceptually.

---

# 93. Decision Surface Migration

No V0 durable decision data exists.

V1 may therefore start without migration from prior decision schema.

But future versioning must remain explicit.

---

# 94. Active V2 Relationship

Active V2 should likely remain authored-only.

Do not modify it in Task 2.33.

If PlanDecision independent surface is selected, state that Active V2 remains unchanged.

---

# 95. Profile V2 Relationship

Profile V2 should exclude decisions.

Profile activation does not carry prior active planning decisions.

State explicitly.

---

# 96. Backup V2 Relationship

Because Backup V2 restores exact source lifetimes, a future recovery-grade backup may reasonably need decisions too.

But Backup V2 currently excludes them.

Determine whether future backup evolution should be:

* Backup V3 including decision surface;
* separate multi-file export;
* explicitly deferred.

No change now.

---

# 97. Decision Retention Across Restart

Once persisted, decisions must survive restart and replay if applicable.

This is the core durable behavior future implementation must satisfy.

---

# 98. Decision Retention Across Preview Regeneration

Must survive.

---

# 99. Decision Retention Across Ordinary Source Update

If target lifetime remains and occurrence still resolves:

* decision remains candidate for applicability.

If occurrence disappears:

* decision becomes stale.

---

# 100. Decision Retention Across Source Recreation

Old decision must not apply to recreated source.

Whether retained or removed, resolver returns lifetime mismatch.

---

# 101. Decision Retention Across Profile Activation

Define explicitly.

Recommended default:

* preserve decision records;
* they become stale via lifetime mismatch;
* do not silently retarget.

But assess user expectations/storage implications.

---

# 102. Decision Retention Across Backup V1 Import

Same as profile activation.

---

# 103. Decision Retention Across Backup V2 Restore

If exact target lifetime returns:

* previously retained decision may become applicable again.

This argues for retaining stale decisions unless explicit user clear removes them.

Evaluate carefully.

---

# 104. Explicit Clear Semantics

`clearLocalData()` likely should clear PlanDecision durable authority along with active/profile local data once decisions exist.

Define.

A later backup restore should not resurrect decisions that the user explicitly cleared unless backup itself contains them under a future format.

---

# 105. Decision Restore Semantics

Until Backup includes decisions, Backup V2 restore restores source lifetimes only.

Retained local decisions may reapply if their target lifetimes match.

Determine whether this is acceptable.

If not, future backup/restore transaction must govern decisions together.

This must be resolved before implementation.

---

# 106. Decision Applicability Evaluator

Define a pure future function conceptually:

```ts
evaluatePlanDecision(
  decision,
  authoredState
)
```

which:

1. validates decision;
2. resolves target;
3. evaluates kind-specific applicability;
4. returns derived status.

No persistence or Preview required.

---

# 107. Decision Replay Input

Future replay should consume:

* authored setup;
* generation inputs;
* active applicable decisions.

Not previous Preview.

---

# 108. Decision Replay Output

Likely:

* generated Preview;
* per-decision replay result.

Do not persist replay outcomes.

---

# 109. Replay Failure Explainability

Derived replay result should distinguish:

* stale target;
* blocked placement;
* superseded decision;
* unsupported kind;
* applied.

This supports future Summary/Recommendations UI.

---

# 110. Decision Priority

If multiple decisions affect scheduling, define whether durable user decisions outrank engine heuristics.

Preferred:

> accepted user planning authority should constrain or override ordinary flexible placement heuristics where applicable.

But should not violate hard authored constraints.

Define hierarchy.

---

# 111. Authored Authority Versus PlanDecision

Establish precedence:

1. authored source existence/lifetime/configuration;
2. accepted applicable PlanDecision;
3. engine default heuristics;
4. derived suggestions.

PlanDecision must not override impossible authored constraints silently.

---

# 112. PlanDecision Cannot Recreate Deleted Source

If target source is missing, replay does nothing.

Do not recreate authored source from decision payload.

---

# 113. PlanDecision Cannot Override Lifetime

If target lifetime mismatches, replay does nothing.

Do not retarget.

---

# 114. PlanDecision Cannot Author Recurrence

A PlanDecision is not a substitute for changing recurrence rules.

If user wants a durable recurring rule change, that belongs in authored setup.

Define boundary.

---

# 115. One-Off Versus Pattern Intent

PlanDecision V1 should represent occurrence-scoped one-off planning intent.

Pattern-level intent belongs in authored recurrence/template/cycle data.

This is a critical scope boundary.

---

# 116. Future Multi-Occurrence Decisions

Do not include recurring "always move Mondays" semantics in V1 unless current product evidence demands it.

That would be authored/pattern policy, not one occurrence decision.

---

# 117. Decision Source Scope

A PlanDecision target is the occurrence reference, not merely source.

This ensures one-off behavior.

---

# 118. Decision Accepted From Fresh Preview

Acceptance should require:

* fresh Preview;
* target occurrence present;
* durable reference construction succeeds;
* chosen action is valid for that occurrence.

This aligns with stale-preview safety.

---

# 119. Decision Acceptance Failure

Define expected reasons:

* stale preview;
* missing lineage;
* unsupported occurrence;
* invalid payload;
* conflicting active decision;
* persistence failure later.

Do not throw for expected cases.

---

# 120. Decision Conflict Resolution

If user accepts a new incompatible decision for same target:

Preferred:

* atomically supersede prior active conflicting decision.

Do not force manual deletion first unless product demands it.

---

# 121. Decision Removal And Regeneration

Removing a decision should cause future generation to return to authored/default behavior.

Preview should regenerate or become stale according to future workflow.

---

# 122. Decision Editing

Do not invent direct "edit decision" semantics if supersede-with-new-decision is simpler.

V1 may define editing as accepting a replacement decision.

---

# 123. Decision History

No historical ledger required.

If superseded/removed records are physically deleted, future history is not available.

Determine whether acceptable.

Preferred for V1: maintain only current durable planning authority unless explainability requires history.

---

# 124. Auditability

Distinguish explanation from audit history.

DayFrame can explain current decision from its semantic payload without retaining all prior decisions.

---

# 125. Decision Collection Semantics

If only current authority is stored, collection should contain:

* active current decisions;
* possibly stale retained decisions if policy chooses retention.

No execution log.

---

# 126. Stale Decision Retention Policy

Task 2.33 must choose one:

## Policy A — retain stale decisions

Pros:

* may reactivate after exact Backup V2 restore;
* preserves explicit user intent.

Cons:

* accumulation.

## Policy B — remove stale automatically

Pros:

* simple collection.

Cons:

* destructive inference;
* may lose recoverable intent.

Preferred architectural default:

> retain stale decisions until explicit user removal/clear, because staleness is derived and can reverse after exact lifetime restoration.

Validate.

---

# 127. Stale Decision UX Boundary

No UI implementation now.

Future UI should distinguish stale/inapplicable decisions from active ones.

Task 2.33 may define terminology.

---

# 128. Decision Reactivation

If stale decision's exact target lifetime becomes current again through Backup V2 restore and occurrence resolves:

* decision may become applicable again.

If retained, this follows naturally.

Document as intended or reject explicitly.

---

# 129. Stale After Occurrence Update

If occurrenceMissing later becomes resolved again due to another update preserving same source lifetime and canonical coordinate:

* retained decision may become applicable again.

This is another reason status should be derived.

---

# 130. Invalid Decision Retention

Structurally invalid persisted decision is different from stale valid decision.

Invalid durable entries should likely be quarantined rather than replayed.

Define.

---

# 131. Unsupported Decision Retention

Unknown future decision versions should be preserved/protected, not erased.

Use established durable governance.

---

# 132. Decision Collection Validation

Conceptual V1 durable collection should validate:

* envelope;
* version;
* unique decision IDs;
* each decision;
* no duplicate active conflict keys unless explicitly allowed.

---

# 133. Duplicate Decision ID

Invalid collection entry.

Do not silently merge.

---

# 134. Duplicate Semantic Decision

Two different IDs with semantically identical target/kind/payload:

Determine whether allowed.

Likely normalize through supersession/acceptance transaction rather than validator rejection.

---

# 135. Conflicting Decisions

Collection must not contain multiple active incompatible decisions for same target/domain after normal store operations.

Validator may reject or classify inconsistent durable input.

Define.

---

# 136. Decision Persistence Envelope

If independent surface selected, define conceptual envelope:

```ts
{
  app: "DayFrame",
  surface: "planDecisions",
  version: 1,
  decisions: [...]
}
```

Exact naming should follow conventions.

No implementation now.

---

# 137. Decision Storage Key

If independent, recommend future distinct key.

Do not add it now.

---

# 138. Decision Established Marker

Determine whether anti-resurrection marker is needed.

Since no V0 exists, V1 may not need historical resurrection protection initially.

But future versions likely need establishment semantics.

Do not overdesign V1.

---

# 139. Decision Recovery

Future protected invalid decision surface should follow:

* preserve raw;
* block overwrite;
* explicit replace/abandon;
* source recheck;
* entry-level quarantine where possible.

Reuse architecture patterns.

---

# 140. Decision Export

No dedicated export task now.

If independent surface is not in Backup V2, user backup completeness becomes a future issue.

Flag explicitly.

---

# 141. Backup Completeness Risk

If PlanDecision becomes durable but Backup V2 excludes it:

* a Backup V2 recovery will restore source lifetimes but not necessarily decision authority.

If stale decisions are retained locally, behavior may vary by device.

This must be surfaced as a required future backup-format task.

Do not ignore.

---

# 142. Persistence Consumer Readiness

Task 2.33 should end with a clear determination:

* PlanDecision V1 semantics ready;
* persistence architecture chosen;
* implementation sequence defined.

---

# 143. Required Initial SuggestedFix Audit

Inspect current SuggestedFix kinds and map each to:

| SuggestedFix kind | Preview-only Try? | Durable Accept candidate? | Authored edit instead? |
| ----------------- | ----------------: | ------------------------: | ---------------------: |

This is mandatory.

---

# 144. Required Decision Kind Matrix

Produce:

| PlanDecision kind | Target family | Payload | Replay stage | Conflicts with |
| ----------------- | ------------- | ------- | ------------ | -------------- |

Only include V1-supported kinds.

---

# 145. Required Resolver Mapping Matrix

Produce:

| Durable reference result | Decision derived status | Replay allowed? | Retained? |
| ------------------------ | ----------------------- | --------------: | --------: |

---

# 146. Required Lifecycle Matrix

Cover:

* acceptance;
* restart;
* Preview regeneration;
* ordinary source update;
* occurrence removal;
* source deletion;
* source recreation;
* Profile V2 activation;
* Backup V1 import;
* Backup V2 restore;
* clear;
* explicit decision removal;
* supersession.

---

# 147. Required Authority Matrix

| Layer          | Authority                                  |
| -------------- | ------------------------------------------ |
| Authored setup | source/configuration truth                 |
| PlanDecision   | accepted occurrence-scoped planning intent |
| Preview        | derived schedule                           |
| SuggestedFix   | recommendation                             |
| Try            | transient derived experiment               |

---

# 148. Required Persistence Options Analysis

Compare at minimum:

| Property             | Independent Decision V1 surface | Future Active V3 embedding |
| -------------------- | ------------------------------- | -------------------------- |
| version independence |                                 |                            |
| atomic acceptance    |                                 |                            |
| recovery complexity  |                                 |                            |
| profile exclusion    |                                 |                            |
| backup evolution     |                                 |                            |
| migration            |                                 |                            |
| durability status    |                                 |                            |

Choose one.

---

# 149. Required Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.33_DEFINE_PLANDECISION_V1_DOMAIN_SEMANTICS_AND_DURABLE_DECISION_LIFECYCLE_RESULT.md`

The result must include at least:

1. Executive Determination
2. Artifact Integrity
3. Governing Evidence
4. Current SuggestedFix Audit
5. Current Preview-Revision Audit
6. PlanDecision Definition
7. Authority Boundary
8. Try Versus Accept
9. Supported Decision Kinds
10. Unsupported SuggestedFix Kinds
11. `changeFixedTime` Determination
12. Decision Target
13. Single/Multi-Target Decision
14. Decision Identity
15. Version Contract
16. Decision Structure
17. Kind-Specific Payloads
18. Placement Semantics
19. User-Day/Boundary Semantics
20. Preconditions
21. Applicability
22. Reference Outcome Mapping
23. LifetimeMismatch
24. SourceMissing
25. OccurrenceMissing
26. Invalid/Unsupported Reference
27. Durable Versus Derived Status
28. Supersession
29. Conflict Rules
30. Ordering
31. Acceptance Timestamp
32. Provenance
33. Ownership
34. `DayFrameState` Boundary
35. Authored Setup Boundary
36. Profile Boundary
37. Backup Boundary
38. Persistence Options Analysis
39. Persistence Ownership Decision
40. Atomicity
41. Acceptance Transaction
42. Stale Preview Boundary
43. Replay Definition
44. Replay Stage
45. Replay Determinism
46. Preview Relationship
47. Move Replay Semantics
48. Skip Replay Semantics
49. Friction Interaction
50. Blocked Decision Semantics
51. Replay Result Semantics
52. Revocation/Removal
53. Supersession Versus Revocation
54. Stale Decision Retention
55. Backup V2 Reactivation
56. Profile Activation
57. Backup V1 Import
58. Clear
59. Recovery Replacement
60. Decision Garbage Collection
61. Validation Contract
62. Version Migration Readiness
63. Semantic Equality
64. Conflict Key
65. Explainability
66. Store API Boundary
67. Decision Durability Model
68. Protected Ingress Model
69. Quarantine Model
70. Backup Completeness Assessment
71. SuggestedFix → PlanDecision Mapping
72. Required Decision Kind Matrix
73. Resolver Mapping Matrix
74. Lifecycle Matrix
75. Authority Matrix
76. Persistence Options Matrix
77. Architectural Alignment Assessment
78. Deviations
79. Discoveries and Deferred Work
80. Recommended Next Task
81. Validation
82. Final Completion Determination

---

# 150. Evidence Standard

Classify findings as:

* **Confirmed**
* **Architectural determination**
* **Inferred**
* **Not found**
* **Unresolved**
* **Blocked**

Use executable behavior for current system claims.

Use explicit architectural determination for future PlanDecision semantics.

---

# 151. Investigation-Only Changes

Task 2.33 should preferably make no production changes.

Narrow type/test prototypes are allowed only if necessary to prove feasibility and must not establish persistence/application behavior.

If implementation becomes necessary to answer a semantic question, stop and recommend the next task instead.

---

# 152. Validation

Run repository-standard validation to prove the architecture task did not regress behavior.

At minimum:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

Record exact test-file/test counts.

---

# 153. Completion Criteria

Task 2.33 is complete only when:

* PlanDecision V1 is precisely defined;
* decision authority is distinct from SuggestedFix, Try, Preview, and authored setup;
* acceptance semantics are explicit;
* supported decision kinds are enumerated;
* unsupported current SuggestedFix actions are classified;
* every V1 decision kind has a durable semantic payload;
* target is `DurableOccurrenceReference V1`;
* decision identity/version are defined;
* resolver outcomes map to decision applicability;
* stale status is distinguished from invalid data;
* supersession is deterministic;
* conflict rules are deterministic;
* replay semantics are defined;
* replay stage is determined;
* authored authority precedence is defined;
* blocked/unapplied behavior is defined;
* stale-decision retention policy is decided;
* Backup V2 reactivation behavior is decided;
* profile/Backup V1 behavior is decided;
* clear behavior is decided;
* persistence ownership is chosen;
* durability/recovery model is outlined;
* profile exclusion is explicit;
* Backup evolution need is explicit;
* no PlanDecision persistence/application is implemented;
* no DurableOccurrenceReference changes are made;
* no scheduling behavior changes are made;
* required matrices are complete;
* full validation passes;
* result artifact is complete.

---

# 154. Explicit Non-Goals

Do **not**:

* persist PlanDecision;
* implement decision replay;
* implement decision application;
* add decision UI;
* modify `DurableOccurrenceReference V1`;
* modify `OccurrenceIdentity V1`;
* modify Active V2;
* modify Profile V2;
* modify Backup V2;
* add Active V3;
* add Backup V3;
* add decision local-storage key;
* change SuggestedFix engine behavior;
* change friction behavior;
* change scheduling behavior;
* create execution/history state;
* create general undo/redo;
* implement multi-occurrence recurring decisions unless current evidence requires them;
* retarget stale decisions;
* auto-delete stale decisions;
* fabricate source continuity.

---

# 155. Stop Conditions

Stop and report if:

* no current SuggestedFix kind can be represented durably without changing scheduling semantics;
* move semantics cannot be expressed canonically;
* replay requires Preview as authority;
* accepted planning intent cannot be separated from authored setup;
* persistence ownership cannot be chosen without changing existing durable-format governance;
* stale-decision retention conflicts irreconcilably with Backup semantics;
* `DurableOccurrenceReference V1` proves insufficient;
* PlanDecision requires multi-target semantics to represent current behavior safely;
* full validation fails for unrelated reasons.

Recommend the narrowest prerequisite.

---

# 156. Recommended Follow-On Boundary

If Task 2.33 completes successfully, the next task should implement only the **PlanDecision V1 durable data model and store-owned persistence boundary**.

Recommended:

> **Task 2.34 — Implement PlanDecision V1 Durable Surface, Validation, and Store Authority**

That task should include:

* concrete PlanDecision types;
* durable envelope;
* storage key/version;
* validation;
* clone isolation;
* persistence outcome;
* retry;
* protected ingress;
* quarantine;
* save/remove/supersede authority.

It should still stop before replay modifies schedule generation unless the architecture determines persistence and replay must be introduced atomically.

---

# 157. Task Determination

**Authorized:** investigation and architectural definition of `PlanDecision V1`, including decision vocabulary, target semantics, acceptance, applicability, supersession, stale-reference handling, replay contract, persistence ownership, durability/recovery expectations, profile/backup boundaries, and implementation sequencing.

**Not authorized:** PlanDecision persistence, replay, application, UI, new durable formats, `DurableOccurrenceReference` changes, scheduling changes, history, or unrelated refactoring.

The governing planning principle is:

> A durable planning decision records explicitly accepted occurrence-scoped user intent. It may influence future regeneration only while its exact lifetime-safe target and semantic preconditions remain applicable, and it must never silently retarget recreated or merely similar occurrences.

---

# 158. Final Completion Statement

**Task 2.33 is complete when DayFrame has an implementation-ready `PlanDecision V1` domain contract defining accepted occurrence-scoped planning authority, supported decision kinds, versioned identity, `DurableOccurrenceReference V1` targeting, kind-specific durable payloads, applicability, deterministic supersession/conflict semantics, explicit stale-reference handling, removal, replay authority and stage, authored-versus-decision precedence, stale-decision retention/reactivation behavior, profile/backup/clear boundaries, and a chosen independently governed persistence strategy; when SuggestedFix/Try/Accept boundaries are explicitly mapped; when no stale decision can silently retarget a recreated lifetime; when persistence, recovery, quarantine, and backup-evolution requirements are specified without implementing them; when complete repository validation passes; and when no PlanDecision persistence/application, durable-reference modification, scheduling change, execution history, or unrelated behavior is introduced.**
