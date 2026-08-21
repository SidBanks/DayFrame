# Task 2.10 — Introduce Explicit Versioned Occurrence Identity Without Plan-Decision Behavior

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.10

**Task Name:** Introduce Explicit Versioned Occurrence Identity Without Plan-Decision Behavior

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Bounded Implementation

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning implementation, verify that this task artifact is complete and record its integrity hash.

Record the execution outcome in a separate result artifact:

`TASK_2.10_INTRODUCE_EXPLICIT_VERSIONED_OCCURRENCE_IDENTITY_WITHOUT_PLAN_DECISION_BEHAVIOR_RESULT.md`

The result artifact should document:

* implementation completed;
* files changed;
* occurrence-identity type introduced;
* version contract;
* source-kind contract;
* template occurrence identity;
* weekly/N-per-week slot identity;
* daily/specific-weekday identity;
* work occurrence identity;
* manual-event occurrence identity;
* candidate propagation;
* scheduled/unplaced propagation;
* Preview-result propagation;
* runtime ID preservation;
* deterministic regeneration;
* window-invariance preservation;
* source-incarnation limitation;
* durability prohibition;
* tests added or updated;
* validation;
* deviations;
* discoveries and deferred work;
* recommended next task;
* final completion determination.

If implementation requires persistence, durable-format changes, PlanDecision, source-incarnation migration, UI behavior changes, recurrence-semantic changes, or broad engine refactoring, stop the affected work and record the discrepancy rather than expanding Task 2.10.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Governing Decisions;
* Objective;
* Occurrence Identity Contract;
* Versioning Contract;
* Template Identity;
* Work Identity;
* Manual Event Identity;
* Propagation Contract;
* Runtime ID Preservation;
* Source-Incarnation Boundary;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame exposes an explicit versioned semantic occurrence identity for generated template, work, and manual-event occurrences; propagates that identity unchanged through candidate, scheduled, unplaced, and Preview-derived structures; preserves current runtime IDs and scheduling behavior; proves deterministic and window-invariant identity generation; and explicitly prevents that identity from becoming durable PlanDecision foreign-key authority until source-incarnation safety is resolved.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the artifact-integrity discrepancy for project review.

---

# Purpose

Implement the explicit occurrence-identity layer enabled by Tasks 2.7–2.9.

Task 2.7 established that durable plan decisions require a stable semantic occurrence identity.

Task 2.8 defined canonical week-scoped recurrence semantics.

Task 2.9 implemented those semantics so that weekly and `timesPerUserWeek` occurrence dates/slots are no longer dependent on requested-window truncation.

DayFrame can therefore now introduce a semantic identity for a logical generated occurrence without promoting current runtime object IDs to durable authority.

---

# Governing Decisions

Task 2.7 adopted these principles:

1. occurrence identity names a logical source occurrence;
2. identity is independent of placement;
3. identity is independent of scheduled/unplaced state;
4. identity is independent of Preview generation timestamp;
5. identity remains stable across deterministic regeneration;
6. overlapping windows do not rename shared occurrences;
7. source kind must be explicit;
8. multiple same-source occurrences require a discriminator/slot;
9. identity semantics must be versionable;
10. authored deletion must eventually orphan references rather than retarget them;
11. identity and source validity/incarnation are separate concerns.

Task 2.9 now provides canonical week/slot semantics for week-scoped template recurrences.

Task 2.10 implements only the runtime identity layer.

---

# Objective

Introduce an explicit semantic occurrence identity that:

1. identifies template recurrence occurrences;
2. identifies work occurrences;
3. identifies manual-event projections;
4. is explicitly versioned;
5. distinguishes source kinds;
6. uses canonical recurrence semantics;
7. survives placement changes;
8. survives scheduled/unplaced transitions;
9. survives equivalent regeneration;
10. remains stable across overlapping windows;
11. is propagated through relevant derived structures;
12. does not replace current runtime `id`;
13. is not persisted;
14. is not used by PlanDecision yet;
15. does not attempt to solve source-incarnation safety.

---

# Core Occurrence Identity Contract

Introduce a semantic type equivalent to:

```ts
type OccurrenceIdentity =
  | TemplateOccurrenceIdentity
  | WorkOccurrenceIdentity
  | ManualEventOccurrenceIdentity;
```

The exact field names may vary to fit repository conventions.

The semantic contract matters more than cosmetic naming.

---

# Versioning Contract

Every occurrence identity must explicitly identify its semantic identity version.

Preferred conceptual form:

```ts
version: 1
```

or:

```ts
version: "v1"
```

Choose the smallest strongly typed representation consistent with the project.

Do not use an unversioned raw string as the sole semantic identity.

---

# Why Versioning Is Required

Once future PlanDecisions target occurrence identity, the identity algorithm becomes durable compatibility infrastructure.

Task 2.10 does not yet persist identity, but introducing the version now prevents a later transition from:

```text
unversioned runtime convention
```

to:

```text
durable compatibility contract
```

after references already exist.

---

# Structured Identity Preference

Prefer an explicit structured discriminated type over one opaque concatenated string.

Conceptually:

```ts
{
  version: 1,
  sourceKind: "template",
  templateId: "...",
  recurrenceId: "...",
  occurrenceKey: "...",
  slot: 0
}
```

rather than only:

```text
template:foo:recurrence:bar:2026-08-18:0
```

A canonical string representation may be derived later if needed.

Do not introduce hashing merely for compactness.

---

# Source Kind

Occurrence identity must explicitly distinguish at least:

```text
template
work
manualEvent
```

Use repository-consistent literal names.

Different source kinds must never compare equal merely because their component IDs happen to match.

---

# Template Occurrence Identity

Template-derived occurrences must preserve enough semantic provenance to identify one logical recurrence expansion.

At minimum assess/include:

* template ID;
* recurrence ID;
* canonical occurrence scope/key;
* stable occurrence discriminator/slot;
* identity version;
* source kind.

---

# Daily Template Occurrence Identity

For `daily`, the logical occurrence key should derive from:

```text
template
+
recurrence
+
logical user-day
```

with one stable slot/discriminator.

Because current daily recurrence generates at most one occurrence per recurrence per user-day, slot 0 may be sufficient.

Do not depend on placement time.

---

# Specific-Weekday Template Occurrence Identity

Equivalent principle:

```text
template
+
recurrence
+
matching logical user-day
+
slot 0
```

The authored weekday set determines whether the occurrence exists but need not be duplicated unnecessarily into identity if source recurrence ID plus canonical occurrence key already provides provenance.

---

# Weekly Template Occurrence Identity

Task 2.9 now provides canonical semantics.

Identity must represent:

```text
template
+
recurrence
+
canonical effective week key
+
slot 0
```

The selected canonical occurrence date may be retained as useful semantic metadata if appropriate, but the durable semantic discriminator should be the canonical week/slot contract rather than a clipped-window artifact.

---

# `timesPerUserWeek` Template Occurrence Identity

Identity must represent:

```text
template
+
recurrence
+
canonical effective week key
+
slot N
```

where `slot N` is the canonical pre-clipping allocation order established by Task 2.9.

A surviving slot must not be renumbered because earlier slots fall outside the requested generation domain.

---

# Occurrence Key Representation

Choose a clear semantic representation.

Possible concepts:

```text
userDayDate
```

for date-scoped daily/specific-weekday recurrence,

and:

```text
userWeekStartDate
```

for week-scoped recurrence.

Avoid a generic ambiguous field if explicit discriminated fields improve type safety.

---

# Frequency Awareness

Do not require downstream callers to infer identity semantics by parsing strings.

The identity shape should expose enough source/frequency semantic information for later validation.

Possible model:

```ts
sourceKind: "template";
scopeKind: "userDay" | "userWeek";
```

or a frequency-specific discriminated structure.

Choose the smallest clear model.

---

# Stable Slot

Introduce an explicit slot/discriminator in identity where necessary.

For current recurrence behavior:

* daily: slot 0;
* specific weekdays: slot 0;
* weekly: slot 0;
* `timesPerUserWeek`: canonical slot index.

Do not add multiple same-day scheduling behavior.

Slot exists to make identity semantics future-safe and explicit.

---

# Candidate Propagation

Every generated `BlockCandidate` should carry the semantic occurrence identity corresponding to the logical occurrence that produced it.

The identity must be created during recurrence expansion, not during placement.

Conceptually:

```text
recurrence expansion
    ↓
BlockCandidate
    id
    occurrenceIdentity
```

---

# Candidate Runtime ID Preservation

Keep existing:

```text
candidate_{templateId}_{recurrenceId}_{userDayDate}
```

or current exact runtime ID format unchanged.

Do not replace it with occurrence identity in Task 2.10.

Current `id` remains an implementation/runtime correlation key.

---

# Scheduled Block Propagation

When a candidate becomes a scheduled block, propagate its `occurrenceIdentity` unchanged.

Placement must not recompute or reinterpret identity.

Conceptually:

```text
candidate occurrenceIdentity O
    ↓
placement
    ↓
scheduled block occurrenceIdentity O
```

---

# Unplaced Candidate Propagation

Unplaced candidate structures must retain the same occurrence identity as the original candidate.

Scheduled versus unplaced is derived planning state and must not alter semantic identity.

---

# Revision Preservation

Current Preview revisions may move/skip/change derived schedule state.

Where a revised scheduled/unplaced block already carries an occurrence identity, revision must preserve it unchanged.

Do not generate a replacement identity from revised placement state.

---

# Preview Result Propagation

Ensure semantic occurrence identity remains available in the relevant Preview result structures needed by later:

* friction provenance;
* suggested fixes;
* future PlanDecision targeting.

Do not redesign Preview result shape beyond adding/propagating the identity where structurally required.

---

# Manual Event Occurrence Identity

Manual events are already authored single occurrences.

Preferred semantic identity:

```text
version
sourceKind = manualEvent
manualEventId
```

No recurrence scope/slot is required unless the current model demands a uniform field.

Manual-event placement date/time changes must not create a different occurrence identity if the authored manual event retains the same ID.

---

# Manual Event Projection Runtime ID

Preserve current projection/runtime IDs.

Add semantic occurrence identity alongside them.

Do not replace manual event authored IDs or scheduled block IDs.

---

# Work Occurrence Identity

Work identity requires more semantic context than today's runtime ID.

Task 2.7 found that:

```text
work_{shiftDefinitionId}_{localDate}
```

may omit cycle/segment provenance.

Inspect current generation and include sufficient source context to distinguish logical work occurrences.

Likely semantic components include:

* identity version;
* source kind = work;
* shift definition ID;
* shift cycle ID;
* segment or sequence identity/index;
* canonical logical user-day/date;
* occurrence discriminator if required.

Use actual executable provenance rather than inventing fields that are unavailable.

---

# Work Segment Identity

Determine what stable segment identity currently exists.

Possibilities may include:

* explicit segment ID;
* stable segment index;
* cycle sequence index;
* segment date-range identity.

Prefer existing authored identity.

If no stable segment identity exists, record the limitation explicitly.

Do not silently pretend an array index is durable source identity unless its semantics are actually stable.

---

# Work Identity Blocker Rule

If work occurrences cannot receive a defensible semantic identity under current authored data:

* do not invent a misleading durable-strength identity;
* implement the strongest explicit provisional runtime identity supported;
* classify it as non-durable/provisional;
* record the blocker for follow-up.

However, template and manual-event occurrence identity should not be blocked unnecessarily if they are fully defensible.

---

# Work Collision Tests

Directly cover cases where the same shift definition could appear in distinct cycle/segment contexts if current model permits it.

Assert semantic identities are distinct.

If such configurations are structurally impossible, document and test that invariant where practical.

---

# Identity Equality

Define equality structurally.

Two occurrence identities are equal when all semantic identity components for their version/source kind are equal.

Do not use:

* object reference equality;
* scheduled start time;
* array position;
* Preview timestamp;
* runtime `id` alone.

Tests should use deep equality or canonical comparison helper as appropriate.

---

# Identity Serialization Helper

Do not create durable serialization infrastructure.

A small deterministic helper for tests/debugging may be acceptable if useful, but semantic identity should remain structured.

Do not add persistence codecs.

---

# Canonical Identity Constructor

Prefer small pure constructors/helpers such as:

```text
createTemplateOccurrenceIdentity(...)
createWorkOccurrenceIdentity(...)
createManualEventOccurrenceIdentity(...)
```

or equivalent.

Centralizing construction reduces semantic drift.

Avoid a large identity service abstraction.

---

# Type Placement

Place identity types at the narrowest appropriate shared domain/type boundary.

Likely candidates include:

```text
src/types
```

or a focused occurrence identity module.

Do not bury semantic identity inside UI or placement modules.

---

# No PlanDecision Behavior

Do not add:

```text
PlanDecision
OccurrenceOverride
ConflictAcknowledgement
acceptedFixes
```

or any state that consumes occurrence identity as authority.

Task 2.10 establishes identity only.

---

# Source-Incarnation Boundary

This is mandatory.

Task 2.7 found that authored source IDs may be reused after deletion because some creation paths derive IDs from collection length or similarly reusable schemes.

Therefore:

> OccurrenceIdentity v1 introduced by Task 2.10 is not yet authorized as a durable foreign key for persisted PlanDecision data unless source-incarnation safety is separately resolved.

State this explicitly in code comments only if repository conventions justify it; more importantly, protect it in the result artifact and follow-up task.

---

# Do Not Solve Source Incarnation Opportunistically

Task 2.10 shall not:

* change authored ID generation;
* add source UUIDs;
* add revisions/incarnation numbers;
* migrate existing IDs;
* change profile/backup schema.

Those changes require their own authority/compatibility task.

---

# Runtime Safety Versus Durable Safety

Distinguish:

## Runtime semantic identity

Safe for:

* deterministic comparison;
* propagation;
* friction/suggestion provenance;
* testing;
* future implementation staging.

## Durable foreign-key identity

Not yet safe because source ID reuse can make an old identity resolve to a new authored source incarnation.

Task 2.10 authorizes only the first.

---

# Identity And Source Validity

Do not include all mutable source properties in occurrence identity merely to prevent reuse.

A duration/title/preferred-window change should not necessarily rename the logical occurrence.

Source validity/fingerprint is a separate concern for future PlanDecision revalidation.

---

# Authored Deletion Behavior

Task 2.10 does not implement durable orphan resolution.

At runtime, if the source no longer generates an occurrence, that occurrence identity simply does not appear in regenerated output.

Do not attempt nearest-match retargeting.

---

# Regeneration Invariance

Required:

```text
same authoritative setup
same canonical generation semantics
same generation domain overlap
    ↓
same logical occurrence
    ↓
same OccurrenceIdentity
```

Generate twice and compare semantic identities.

---

# Overlapping-Window Invariance

Mandatory for template recurrence.

For two overlapping windows:

```text
W1
W2
```

any logical occurrence present in both must carry structurally identical occurrence identity.

Directly test:

* daily;
* specific weekdays;
* weekly;
* `timesPerUserWeek`.

---

# Placement Independence

Required:

```text
same candidate O
    ↓
different placement result
    ↓
identity remains O
```

Where practical, test a candidate that becomes scheduled and one that remains unplaced.

---

# Scheduled/Unplaced Transition

If engine fixtures can produce the same logical occurrence under different capacity conditions:

* one run scheduled;
* another run unplaced;

assert identity remains the same.

Do not alter placement semantics to manufacture this if an existing fixture suffices.

---

# Overnight Independence

An occurrence whose final placement crosses calendar midnight must retain the logical occurrence identity created from its canonical user-day/source.

Do not include actual scheduled calendar date/time in identity.

---

# Preview Revision Independence

For current preview-only revision actions:

* move;
* duration;
* priority;
* category;
* accept conflict;
* skip/unplaced transitions as applicable;

identity must not change merely because the derived result changes.

Add targeted tests where existing revision tests naturally support this.

---

# Friction / Suggested Fix Integration

Do not redesign friction or suggested-fix types unless required for identity propagation.

If friction already references scheduled block IDs only, Task 2.10 may leave that unchanged.

The goal is to make occurrence identity available in derived structures, not to immediately replace every runtime relationship key.

Document what remains runtime-ID based.

---

# Deterministic Ordering Preservation

Adding structured identity must not alter:

* candidate ordering;
* placement ordering;
* friction ordering;
* Preview ordering.

No comparator should accidentally begin ordering by serialized occurrence identity unless explicitly required.

---

# Daily Identity Test

Generate equivalent daily recurrence across overlapping windows.

Assert the same shared user-day occurrence has identical identity.

---

# Specific-Weekday Identity Test

Equivalent test for a matching weekday occurrence.

---

# Weekly Identity Test

Use canonical weekly recurrence from Task 2.9.

Assert:

```text
canonical week key K
slot 0
```

is identical across overlapping windows that both include the canonical occurrence.

Also prove a window excluding that occurrence does not manufacture another identity for the same week.

---

# `timesPerUserWeek` Identity Test

Use N=2 or N=3.

Assert stable slot identities across:

* full week;
* partial overlapping window;
* engine-style buffered window.

No renumbering after clipping.

---

# Partial Recurrence-Bound Identity Test

For a recurrence starting midweek:

```text
slot 0 = recurrence start day
slot 1 = next valid day
```

Assert identities are stable across windows.

---

# Manual Event Identity Test

Generate/project the same manual event across equivalent windows.

Assert identity remains tied to manual event ID regardless of display/placement context.

---

# Work Identity Test

Generate the same logical work occurrence twice.

Assert identical identity.

Add distinct-context collision coverage if supported.

---

# Candidate → Scheduled Propagation Test

Take a candidate that becomes scheduled.

Assert scheduled identity equals candidate identity exactly.

---

# Candidate → Unplaced Propagation Test

Equivalent for unplaced outcome.

---

# Revision Preservation Test

Apply one supported preview revision to a fresh Preview.

Assert the affected occurrence retains semantic identity.

Do not change revision behavior.

---

# No Persistence Test

Verify occurrence identity is not added to:

* active local persistence payload;
* saved profile data;
* backup export.

This may be established by type/boundary inspection plus existing persistence tests.

If full `DayFrameState.preview` remains non-persisted, adding identity to Preview does not make it durable.

---

# Clone/Snapshot Preservation

Because store snapshots clone Preview structures, ensure occurrence identity is cloned safely.

If structured identity contains only immutable scalar values, shallow object recreation may be sufficient.

Do not expose mutable internal references.

---

# Type Exhaustiveness

Use discriminated unions/exhaustive handling where appropriate.

A new future source kind should require explicit identity semantics rather than silently falling through to a generic string.

---

# Version Constant

Prefer one central constant/type source for v1 semantics.

Avoid scattered literal version values if a small shared definition makes drift less likely.

Do not create a registry framework.

---

# Unsupported Recurrence Types

`perShiftSegment` and `custom` remain unsupported.

No occurrence identity is needed for non-generated occurrences because those recurrence paths still throw.

---

# Compatibility

Runtime types will change, but durable formats must not.

Do not:

* change persistence keys;
* change profile version;
* change backup version;
* add migrations;
* alter singular compatibility readers.

Occurrence identity is derived runtime state only in Task 2.10.

---

# Production Reference Audit

After implementation search all construction paths for:

* `BlockCandidate`;
* work blocks;
* manual-event scheduled projections;
* scheduled blocks;
* unplaced candidates.

Confirm no supported occurrence-producing path lacks semantic identity.

If a structure does not represent an occurrence, do not force identity onto it.

---

# Required Behavioral Invariants

Task 2.10 must establish:

1. every generated occurrence has an explicit semantic identity;
2. identity has an explicit version;
3. source kind is explicit;
4. template identity includes canonical recurrence scope and slot;
5. work identity includes sufficient available provenance;
6. manual-event identity preserves authored event identity;
7. identity is created before placement;
8. placement does not change identity;
9. scheduled/unplaced state does not change identity;
10. Preview revision does not change identity;
11. overlapping windows preserve identity for shared occurrences;
12. canonical week-slot identity survives clipping;
13. current runtime IDs remain unchanged;
14. persistence formats remain unchanged;
15. occurrence identity is not yet a durable PlanDecision foreign key;
16. source-incarnation safety remains an explicit prerequisite.

---

# Required Tests

At minimum add/update coverage for:

1. daily identity;
2. specific-weekday identity;
3. weekly canonical identity;
4. `timesPerUserWeek` slot identity;
5. overlapping-window stability;
6. partial recurrence-bound stability;
7. candidate-to-scheduled propagation;
8. candidate-to-unplaced propagation;
9. manual-event identity;
10. work identity;
11. work collision/context distinction where supported;
12. overnight placement identity preservation;
13. preview revision identity preservation;
14. deterministic regeneration;
15. runtime ID preservation;
16. non-persistence;
17. clone isolation where relevant.

---

# Production Scope Constraint

Likely production files may include:

* shared types;
* `generateBlockCandidates.ts`;
* cycle/work generation;
* `generateSchedulePreview.ts`;
* placement/scheduled-block construction;
* revision cloning/preservation code if required;
* narrowly related tests.

Do not modify UI unless TypeScript propagation requires a non-behavioral type adjustment.

---

# No Broad Refactor

Task 2.10 is not permission to redesign:

* `ScheduledBlock`;
* engine layering;
* Preview shape generally;
* recurrence APIs;
* friction APIs.

Add the minimum semantic identity field/type needed and propagate it coherently.

---

# Result Documentation Requirement — Source Incarnation

The Task 2.10 result must include a dedicated determination:

## Durable Foreign-Key Readiness

State one of:

* **Not ready** — source-incarnation safety remains unresolved;
* **Ready** — only if implementation evidence unexpectedly proves IDs cannot be reused.

The expected determination from Task 2.7 evidence is **Not ready**.

Do not soften this limitation merely because runtime identity tests pass.

---

# Expected Next Task

If Task 2.10 succeeds but source-incarnation remains unresolved, the next dependency-correct task should be:

> **Task 2.11 — Establish Authored Source Incarnation and Durable Reference Safety**

That investigation should determine:

* which authored IDs can be reused;
* which source types need incarnation identity;
* whether future stable UUID/source keys are needed;
* how existing durable data is treated;
* whether revisions/fingerprints belong in identity or validation;
* migration/version implications.

Only after that should OccurrenceIdentity become the target of persisted PlanDecision data.

---

# Explicit Non-Goals

Task 2.10 shall not:

* add PlanDecision;
* add occurrence overrides;
* add conflict acknowledgements;
* persist occurrence identity;
* modify durable schemas;
* change profile data;
* change backup data;
* change storage keys;
* change authored ID generation;
* add source incarnation;
* add UUID migration;
* change recurrence semantics;
* change canonical recurrence allocation;
* change runtime ID formats;
* change placement;
* change friction semantics;
* change suggested-fix semantics;
* change stale behavior;
* change UI;
* implement unsupported recurrence types;
* add timezone architecture;
* update governance documents before review.

---

# Dependencies

Requires completion and acceptance of:

* Task 2.7 — Establish Stable Generated-Occurrence Identity;
* Task 2.8 — Establish Canonical Window-Invariant Recurrence Expansion;
* Task 2.9 — Implement Canonical Window-Invariant Recurrence Expansion.

Also governed by:

* Task 2.6 PlanDecision authority contract;
* Task 2.4 suggested-fix authority decision;
* durable-data ADR;
* current architecture.

---

# Expected Files To Change

Potentially:

* `code/src/types/...`;
* `code/src/core/blocks/generateBlockCandidates.ts`;
* `code/src/core/cycles/...`;
* `code/src/core/engine/generateSchedulePreview.ts`;
* placement/scheduled-block helpers;
* revision helper(s) where clone propagation is required;
* direct tests.

Exact files should follow actual construction boundaries.

---

# Validation Requirements

Run focused tests for:

* candidate generation;
* cycle/work generation;
* placement;
* Preview generation;
* Preview revision;
* store snapshot cloning where identity is carried inside Preview.

Then run:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Run:

```text
git diff --check
```

Record:

* focused identity test count;
* candidate/work/engine regression counts;
* full test-file count;
* full test count;
* tests added/updated;
* lint result;
* typecheck result;
* build result;
* diff-check result.

Confirm:

* Task 2.10 specification remained immutable;
* result artifact exists separately;
* no governance document changed;
* no durable format changed.

---

# Documentation Rules

During Task 2.10:

## Create

`TASK_2.10_INTRODUCE_EXPLICIT_VERSIONED_OCCURRENCE_IDENTITY_WITHOUT_PLAN_DECISION_BEHAVIOR_RESULT.md`

## Preserve

* Task 2.10 specification;
* Tasks 2.1–2.9 results;
* Phase 1 checkpoint;
* ADRs;
* current governance documents.

## Do Not Update Yet

* `CURRENT_STATE.md`;
* `CHANGELOG.md`;
* `DECISIONS.md`;
* architecture specification;
* phase checkpoints.

Those require project review.

Do not create a task-specific checkpoint unless explicitly authorized.

---

# Required Result Artifact Structure

The Task 2.10 result should contain:

1. Executive Result
2. Artifact Integrity
3. Implementation Completed
4. Files Changed
5. Occurrence Identity Type
6. Version Contract
7. Source-Kind Contract
8. Template Identity
9. Daily Identity
10. Specific-Weekday Identity
11. Weekly Identity
12. `timesPerUserWeek` Slot Identity
13. Work Identity
14. Manual-Event Identity
15. Candidate Propagation
16. Scheduled Propagation
17. Unplaced Propagation
18. Revision Preservation
19. Preview Propagation
20. Runtime ID Preservation
21. Deterministic Regeneration
22. Overlapping-Window Stability
23. Placement / Overnight Independence
24. Clone/Snapshot Preservation
25. Persistence Boundary
26. Profile / Backup Preservation
27. Source-Incarnation Limitation
28. Durable Foreign-Key Readiness
29. Tests Added or Updated
30. Reference Audit
31. Architectural Alignment Improvement
32. Deviations
33. Discoveries and Deferred Work
34. Recommended Next Task
35. Validation
36. Final Completion Determination

---

# Expected Architectural Result

Before Task 2.10:

```text
logical occurrence
    ↓
runtime ID only
```

After Task 2.10:

```text
logical occurrence
    ↓
versioned semantic OccurrenceIdentity
    +
existing runtime ID
    ↓
candidate
    ↓
scheduled / unplaced / revised Preview
```

The semantic identity is explicit and stable at runtime but not yet durable-reference safe.

---

# Expected Follow-Up

If source-incarnation safety remains unresolved:

> **Task 2.11 — Establish Authored Source Incarnation and Durable Reference Safety**

After source-incarnation safety is resolved, later tasks may:

1. authorize OccurrenceIdentity as a durable PlanDecision target;
2. design PlanDecision runtime representation;
3. decide its durable surface/versioning;
4. integrate PlanDecision into deterministic generation.

Do not skip the incarnation decision.

---

# Completion Criteria

Task 2.10 is complete when:

* explicit `OccurrenceIdentity` exists;
* identity is versioned;
* source kinds are explicit;
* every supported template occurrence receives identity;
* daily/specific-weekday identity is stable;
* weekly identity uses canonical week + slot 0;
* `timesPerUserWeek` identity uses canonical week + stable slot;
* work occurrences receive the strongest defensible semantic identity;
* manual-event projections preserve authored identity;
* candidates carry identity;
* scheduled blocks carry identity;
* unplaced candidates carry identity;
* revision preserves identity;
* overlapping generation windows preserve shared identities;
* placement/overnight behavior does not change identity;
* current runtime IDs remain unchanged;
* no identity is persisted;
* profiles/backups remain unchanged;
* source-incarnation limitations are explicit;
* durable foreign-key readiness is truthfully classified;
* full validation passes.

---

# Task Determination

Task 2.10 is a bounded semantic-identity implementation.

It does not introduce user-owned planning decisions or durable references.

Its purpose is to make logical generated-occurrence identity explicit throughout the current derived planning pipeline now that recurrence semantics are window-invariant, while preserving the separation between runtime semantic identity and future durable reference safety.

**The task is complete when DayFrame exposes an explicit versioned semantic occurrence identity for generated template, work, and manual-event occurrences; propagates that identity unchanged through candidate, scheduled, unplaced, and Preview-derived structures; preserves current runtime IDs and scheduling behavior; proves deterministic and window-invariant identity generation; and explicitly prevents that identity from becoming durable PlanDecision foreign-key authority until source-incarnation safety is resolved.**
