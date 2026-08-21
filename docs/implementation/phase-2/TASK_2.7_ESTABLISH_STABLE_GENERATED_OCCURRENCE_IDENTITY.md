# Task 2.7 — Establish Stable Generated-Occurrence Identity

**Project:** DayFrame

**Phase:** Phase 2 — Authority and State Alignment

**Task ID:** 2.7

**Task Name:** Establish Stable Generated-Occurrence Identity

**Version:** 1.0.0

**Status:** Ready

**Execution Type:** Investigation / Architectural Identity Decision

---

# Execution Artifact Rules

This task specification is an immutable execution contract.

Do not modify, rewrite, replace, truncate, or overwrite this task document during execution.

Before beginning the investigation, verify that this task artifact is complete and record its integrity hash.

Record the investigation outcome in a separate result artifact:

`TASK_2.7_ESTABLISH_STABLE_GENERATED_OCCURRENCE_IDENTITY_RESULT.md`

The result artifact should document:

* current generated identity inventory;
* current recurrence-expansion identity behavior;
* template/recurrence occurrence identity;
* `timesPerUserWeek` behavior;
* weekly recurrence behavior;
* work occurrence identity;
* manual-event projection identity;
* planning-window invariance;
* user-day/week-boundary behavior;
* overnight behavior;
* DST/time-zone implications if applicable;
* multiple-occurrence semantics;
* authored-change behavior;
* collision analysis;
* candidate identity models;
* selected semantic identity contract;
* versioning requirements;
* migration/durable-reference implications;
* required later tests;
* recommended next task;
* validation;
* final completion determination.

This task is investigation and architectural decision only.

Do not modify production code, tests, IDs, state types, engine inputs, recurrence semantics, placement behavior, persistence, durable formats, profiles, backups, or UI.

If current recurrence semantics cannot support a stable identity contract without first changing expansion behavior, identify that as a dependency rather than redefining current scheduling behavior inside Task 2.7.

---

# Pre-Execution Artifact Integrity Check

Before execution, verify that this saved task artifact contains:

* this title and metadata;
* Execution Artifact Rules;
* Purpose;
* Phase 2 Context;
* Governing Evidence;
* Objective;
* Identity Invariants;
* Current Identity Audit;
* Recurrence Expansion Audit;
* Window Invariance;
* Multiple Occurrences;
* Work Identity;
* Manual Event Identity;
* Authored-Change Semantics;
* Versioning;
* Candidate Models;
* Decision Standard;
* Explicit Non-Goals;
* Validation Requirements;
* Completion Criteria;
* Task Determination.

Confirm that the document ends with:

> **The task is complete when DayFrame has an evidence-backed, versionable semantic identity contract for generated occurrences that remains stable for the same logical occurrence across deterministic regeneration and overlapping planning windows, distinguishes multiple same-source occurrences, handles work and manual-event sources explicitly, never silently retargets after authored changes, and is strong enough to serve as the durable target of future user-owned plan decisions without yet implementing those decisions.**

If the saved artifact is incomplete, truncated, or does not end with that sentence, do not begin execution.

Record the discrepancy for project review.

---

# Purpose

Establish the identity prerequisite discovered by Task 2.6.

Task 2.6 adopted:

```text
DayFrameAuthoredSetup
    +
PlanDecisions
    ↓
deterministic planning
    ↓
derived plan
```

and determined that plan decisions must target stable logical occurrences.

Current generated IDs are not yet an accepted durable identity contract.

Task 2.7 determines what occurrence identity means before any durable planning authority references it.

---

# Phase 2 Context

Task 2.6 established:

* accepted occurrence-level planning decisions are durable authoritative planning data;
* `PlanDecision` should include occurrence overrides and conflict acknowledgements;
* current generated block IDs must not be used casually as durable foreign keys;
* stable occurrence identity is the prerequisite for override representation and persistence.

The current important cases include:

```text
template + recurrence occurrence
work / shift-derived occurrence
manual-event projection
```

Each has different source semantics.

---

# Governing Evidence

Use current executable behavior first.

Task 2.6 established these current identity facts:

* `BlockCandidate` IDs resemble:
  `candidate_{templateId}_{recurrenceId}_{userDayDate}`;
* scheduled template blocks wrap candidate IDs;
* work IDs resemble:
  `work_{shiftDefinitionId}_{localDate}`;
* manual-event projections inherit `manualEvent.id`;
* friction and fix IDs are derived relationship/recommendation IDs and are not occurrence identities.

Task 2.6 also found that current date-based candidate identity can be sensitive to recurrence expansion and represented windows, especially for:

* weekly recurrence;
* `timesPerUserWeek`;
* effective week boundaries.

---

# Objective

Determine:

1. the semantic definition of a logical occurrence;
2. what source information identifies it;
3. whether identity is created during recurrence expansion or later;
4. what must remain stable across regeneration;
5. how planning-window changes affect identity;
6. how week-start/day-boundary changes affect identity;
7. how multiple same-source occurrences are distinguished;
8. how work occurrences are identified;
9. how manual events are identified;
10. how authored edits affect identity;
11. when identity becomes orphaned;
12. how identity must be versioned;
13. whether current recurrence semantics can support the required contract;
14. what smallest implementation task should follow.

---

# Core Identity Principle

Evaluate and refine:

> A generated occurrence identity names one logical expanded instance of authoritative source intent, not one placement, one Preview row, one friction item, or one generation run.

Therefore identity must not depend on:

* placement time;
* generated array index;
* friction order;
* Preview generation timestamp;
* revision timestamp;
* current scheduled/unplaced state;
* visible planning-window position.

---

# Identity Invariants

The investigation should attempt to establish these invariants.

## Invariant 1 — Deterministic Regeneration

Equivalent authoritative inputs must produce the same identity for the same logical occurrence.

## Invariant 2 — Placement Independence

Moving an occurrence must not change occurrence identity.

## Invariant 3 — Scheduled/Unplaced Independence

The same occurrence must retain identity whether successfully placed or unplaced.

## Invariant 4 — Window Overlap Stability

Generating a wider or narrower overlapping window must not rename an occurrence that exists in both results.

## Invariant 5 — Source Separation

Occurrences from distinct authoritative sources must never collide.

## Invariant 6 — Multiple Occurrence Discrimination

If one source can yield more than one occurrence in the same logical scope, each must receive a distinct stable identity.

## Invariant 7 — No Silent Retargeting

If authored changes eliminate an occurrence, an old identity must become unresolved/orphaned rather than silently naming another occurrence.

## Invariant 8 — Versionability

Identity semantics must be explicitly versionable before durable user data references them.

---

# Define Logical Occurrence

Explicitly answer:

> What is the logical thing being identified?

For template recurrence, likely:

```text
one expansion of one recurrence rule
for one logical recurrence occurrence
```

rather than:

```text
the block that happened to be placed on Tuesday at 18:00
```

For work:

```text
one generated shift/cycle work occurrence
```

For manual events:

```text
the authored manual event itself
```

Confirm or revise each.

---

# Current Identity Audit

Inspect current types and construction for:

```text
BlockCandidate
DraftScheduledBlock
ScheduledBlock
GeneratedWorkBlock
ManualCalendarEvent
```

Record:

| Object | Current ID | Source Components | Placement-Dependent? | Window-Dependent? | Durable Contract? |
| ------ | ---------- | ----------------- | -------------------: | ----------------: | ----------------: |

Do not infer durability from determinism alone.

---

# Template / Recurrence Identity Audit

Trace recurrence expansion from:

```text
BlockTemplate
BlockRecurrence
    ↓
generateBlockCandidates
```

Determine:

* what constitutes one candidate occurrence;
* how `userDayDate` is selected;
* whether recurrence identity is stable;
* whether one recurrence may produce multiple occurrences per user-day;
* whether future recurrence models are likely to do so.

---

# Current Recurrence Types

Inventory supported recurrence types.

At minimum inspect:

* daily;
* weekly;
* specific weekdays;
* `timesPerUserWeek`;
* any other currently supported frequency.

For each, establish what logical occurrence key exists today.

---

# Daily Recurrence

Determine whether:

```text
recurrence ID
+
logical user-day
```

is sufficient for current daily recurrence.

Assess effects of:

* day boundary;
* planning window;
* DST;
* disabled/enabled state.

---

# Specific-Weekday Recurrence

Determine whether:

```text
recurrence ID
+
logical user-day
```

remains a stable occurrence key.

Confirm that widening the generation window does not rename overlapping occurrences.

---

# Weekly Recurrence

Task 2.6 found that weekly recurrence may choose the first eligible represented user-day in a week.

Trace exact behavior.

Explicitly determine whether a logical weekly occurrence is:

* tied to a particular week identity;
* tied to whichever represented date is selected;
* dependent on planning-window start;
* dependent on `weekStartsOn`.

If current behavior causes identity to shift when the represented window changes, classify that carefully.

---

# `timesPerUserWeek` Recurrence

This is a critical case.

Trace exact expansion behavior.

Determine:

* how N occurrences are selected;
* whether they have intrinsic occurrence ordinals;
* whether widening the represented week can shift earlier/later selected dates;
* whether occurrence #1/#2/... can be defined independently of requested window;
* whether effective week start alters logical identity.

Produce explicit examples.

---

# Window Truncation Analysis

For each recurrence type, compare conceptually:

```text
generate window W1
generate wider window W2
```

where both include the same date range subset.

Determine whether occurrences in the overlap:

* exist in both;
* receive the same current ID;
* represent the same logical recurrence instance.

Distinguish:

```text
same current string ID
```

from:

```text
same semantic occurrence
```

---

# Planning-Window Invariance Matrix

Produce:

| Recurrence Type   | Narrow → Wide Stable? | Wide → Narrow Stable? | Depends On Window Start? | Depends On Window End? | Identity Risk |
| ----------------- | --------------------: | --------------------: | -----------------------: | ---------------------: | ------------- |
| daily             |                       |                       |                          |                        |               |
| weekly            |                       |                       |                          |                        |               |
| specific weekdays |                       |                       |                          |                        |               |
| timesPerUserWeek  |                       |                       |                          |                        |               |

---

# User-Day Boundary Semantics

DayFrame uses user-day boundaries rather than raw calendar midnight.

Determine whether occurrence identity should reference:

* local calendar date;
* user-day date;
* UTC instant;
* another logical date key.

Preferred bias:

> identity should use the recurrence's semantic user-day key, not placement instant.

Confirm with current behavior.

---

# `weekStartsOn` Semantics

Determine whether changing `weekStartsOn`:

* changes only grouping;
* changes recurrence expansion;
* changes logical weekly occurrence identity;
* causes old identities to orphan.

Do not force identity continuity across a semantic authored change if the underlying occurrence definition actually changed.

---

# Day-Boundary Change Semantics

Determine whether changing `dayBoundaryStartTime`:

* reattributes occurrences to different user-days;
* changes recurrence expansion;
* should preserve or invalidate old occurrence identity.

Classify whether this is:

* same occurrence under new grouping;
* semantically changed occurrence;
* recurrence-dependent.

---

# Overnight Semantics

Inspect occurrences whose scheduled or preferred time crosses midnight relative to user-day boundary.

Identity must not change merely because placement occurs on the next calendar date if it remains part of the same logical user-day occurrence.

Confirm this principle.

---

# DST / Time Zone Assessment

Determine what timezone model DayFrame currently uses.

If explicit timezone support is absent, record that.

Assess whether a future durable occurrence identity must avoid encoding:

* UTC offsets;
* placement timestamps;

when recurrence semantics are local/user-day based.

Do not invent timezone architecture.

---

# Multiple Same-Day Occurrence Problem

Current candidate IDs lack an ordinal.

Determine whether any current recurrence can produce more than one occurrence for:

```text
same template
same recurrence
same user-day
```

If not, classify as **Not found currently** but evaluate future extensibility.

Task 2.6 requires the durable identity contract to support this case.

---

# Occurrence Discriminator Options

Assess candidate discriminators:

## Option A — Ordinal Within Recurrence Scope

Example:

```text
occurrenceIndex = 0, 1, 2
```

Assess stability if earlier occurrences are inserted/removed.

## Option B — Authored Occurrence Key

If recurrence definitions eventually define sub-occurrence keys.

Assess current support.

## Option C — Deterministic Expansion Slot

Derived from recurrence semantics, such as week + slot number.

Assess fit for `timesPerUserWeek`.

## Option D — Stable Generated UUID Persisted In Authored Rule

Likely inappropriate for purely derived occurrence expansion unless recurrence rules materialize instances.

Assess and likely reject unless justified.

---

# Required Multiple-Occurrence Matrix

Produce:

| Discriminator  | Stable After Earlier Occurrence Added? | Requires Authored Schema Change | Deterministic | Explainable | Recommendation |
| -------------- | -------------------------------------: | ------------------------------: | ------------: | ----------: | -------------- |
| ordinal        |                                        |                                 |               |             |                |
| authored key   |                                        |                                 |               |             |                |
| expansion slot |                                        |                                 |               |             |                |
| persisted UUID |                                        |                                 |               |             |                |

---

# Candidate Semantic Occurrence Identity

Evaluate a conceptual identity such as:

```text
OccurrenceIdentity {
  version
  sourceKind
  sourceId(s)
  recurrenceKey
  logicalOccurrenceKey
}
```

Do not adopt exact fields prematurely.

The investigation should determine the required semantic components.

---

# Source Kind

Determine whether identity must explicitly distinguish:

```text
templateOccurrence
workOccurrence
manualEventOccurrence
```

or equivalent source categories.

Preferred bias: yes.

This prevents accidental collisions and enables source-specific validation.

---

# Template Source Components

Determine whether template occurrence identity requires:

* `templateId`;
* `recurrenceId`;
* logical recurrence key;
* occurrence discriminator.

Assess whether both template and recurrence IDs are required even if recurrence already references template.

Prefer explicit provenance if it improves durable safety.

---

# Work Source Components

Task 2.6 found current work ID:

```text
work_{shiftDefinitionId}_{localDate}
```

may omit meaningful cycle/segment context.

Trace generation.

Determine whether stable work identity requires:

* shift definition ID;
* shift cycle ID;
* segment ID;
* logical user-day/date;
* occurrence discriminator.

Assess what happens if the same shift definition is reused in different cycles/segments.

---

# Work Collision Analysis

Construct or inspect cases where:

```text
same shiftDefinitionId
same date
different cycle/segment context
```

could exist.

Determine whether current IDs collide or whether upstream constraints prevent it.

Use evidence.

---

# Manual Event Identity

Manual projections currently inherit:

```text
manualEvent.id
```

Determine whether this can be adopted directly as stable occurrence identity with an explicit source-kind wrapper.

Likely semantic model:

```text
sourceKind = manualEvent
sourceId = manualEvent.id
```

Since manual events are already one authored occurrence, no recurrence key may be required.

Confirm.

---

# Manual Event Edit Semantics

If a manual event changes date/time but retains `manualEvent.id`, is it still the same logical occurrence?

Likely yes because the authored object itself remains the same.

Assess implications for future plan decisions.

Task 2.6 currently recommends restricting generic overrides of manual events, but identity still matters for conflict acknowledgements.

---

# Authored Deletion

If a source template, recurrence, shift cycle, segment, or manual event is deleted:

```text
old occurrence identity
    ↓
must not resolve
```

Confirm orphan semantics.

No nearest-match migration.

---

# Authored ID Reuse

Investigate whether users/system can delete an authored source and later create a new source with the same ID.

If possible, durable occurrence identity needs source revision/provenance protection beyond raw IDs.

Classify current risk.

---

# Source Revision / Fingerprint

Task 2.6 identified a possible need for source signature/revision.

Determine whether occurrence identity itself should include source revision.

Candidate principles:

## Model A — Identity Includes Revision

Any material authored edit creates a new occurrence identity.

Risk: too much invalidation.

## Model B — Identity Excludes Revision, Validation Uses Source Fingerprint Separately

Identity names the logical source occurrence; plan decisions retain base provenance for compatibility checks.

Likely preferable.

Assess.

---

# Identity Versus Validity

Explicitly separate:

```text
identity
```

from:

```text
whether a PlanDecision remains valid for current source semantics
```

A title or duration edit may not need to rename an occurrence.

Task 2.6 already recommends semantic revalidation.

Identity should not encode every mutable source property if doing so destroys continuity unnecessarily.

---

# Candidate Identity Model A — Current Generated String IDs

Assess as durable contract.

Likely reject.

---

# Candidate Identity Model B — Structured Semantic Identity

Conceptually:

```text
version
sourceKind
sourceIds
logical recurrence key
occurrence discriminator
```

Assess.

---

# Candidate Identity Model C — Hashed Semantic Identity

Hash the structured semantic identity into a compact string.

Assess:

* debugging;
* collision;
* migration;
* versioning.

Likely acceptable as encoding only if canonical structured semantics remain defined.

---

# Candidate Identity Model D — Random UUID At Generation

Assess and likely reject because regeneration would not reproduce it unless persisted elsewhere.

---

# Required Identity Model Matrix

Produce:

| Model                        | Deterministic | Window-Stable | Explainable | Versionable | Durable Reference Fit | Recommendation |
| ---------------------------- | ------------: | ------------: | ----------: | ----------: | --------------------: | -------------- |
| current generated IDs        |               |               |             |             |                       |                |
| structured semantic identity |               |               |             |             |                       |                |
| hashed semantic identity     |               |               |             |             |                       |                |
| random generated UUID        |               |               |             |             |                       |                |

---

# Versioning Requirement

Once PlanDecisions persist against occurrence identities, identity semantics become durable compatibility infrastructure.

Determine:

* whether identity requires an explicit version;
* whether version belongs in the identity itself;
* whether version belongs in the containing PlanDecision format;
* whether both may be useful.

Preferred invariant:

> future identity algorithm changes must never silently reinterpret an existing durable target.

---

# Identity Migration Semantics

Do not design migration code.

Determine only governance requirements.

Potential future behavior:

```text
identity v1
    ↓
migration/converter
    ↓
identity v2
```

or:

```text
retain v1 resolution indefinitely for supported durable decisions
```

Assess against durable-data ADR.

---

# Serialization Form

Consider whether durable identity should be:

* structured JSON;
* canonical string;
* opaque branded string plus version;
* combination.

Do not select purely for convenience.

The semantic contract matters more than encoding.

---

# Equality Semantics

Define what makes two occurrence identities equal.

Avoid equality based on:

* generated object reference;
* array position;
* scheduled start time.

Prefer semantic component equality.

---

# Canonical Ordering

PlanDecision serialization may later need stable ordering.

Determine whether occurrence identity has a canonical comparison/serialization order.

Do not implement.

---

# Conflict Identity Dependency

Task 2.6 defines `ConflictAcknowledgement` using canonical participant occurrence identities.

Therefore Task 2.7 should also assess:

```text
ConflictIdentity
    = conflict kind + canonical participant occurrence identities + material condition where needed
```

Do not fully design conflict acknowledgement, but ensure occurrence identity supports canonical pair/set ordering.

---

# Source Capability

Occurrence identity does not imply all PlanDecision actions are legal.

Explicitly separate:

```text
can identify work occurrence
```

from:

```text
can move work occurrence
```

Task 2.6 restricts generic work/manual overrides.

Identity should still support friction provenance and acknowledgements.

---

# Current ID Compatibility

Determine whether future semantic occurrence IDs should replace current runtime IDs or coexist initially.

Possible approaches:

## A. Replace current candidate/scheduled IDs

Higher disruption.

## B. Add explicit `occurrenceId` alongside current runtime `id`

Likely safer.

## C. Derive current runtime ID from occurrence identity

Potential later cleanup.

Do not implement.

Recommend the smallest future boundary.

---

# Runtime ID Versus Durable Occurrence ID

Explicitly distinguish:

```text
id
    → current object identity within generated structures
```

from:

```text
occurrenceId
    → semantic identity of logical source occurrence
```

They may eventually be equal, but must not be assumed identical.

---

# Required Future Type Boundary

Assess whether later implementation should introduce a branded or structured type such as:

```text
OccurrenceIdentity
```

rather than continuing raw `string`.

Preferred bias: yes once semantics are implemented.

Do not add it now.

---

# Recurrence Expansion Contract

Task 2.7 must determine whether stable identity requires expansion to operate over a canonical recurrence domain rather than the requested visible window.

For example, `timesPerUserWeek` may need to determine the week's logical N slots independent of which portion of the week is currently requested.

If current expansion cannot do that, classify it as a prerequisite behavior change.

This is potentially the most important investigation outcome.

---

# Weekly Canonicalization

Assess whether weekly recurrence should identify occurrences by:

```text
canonical user-week key
+
slot
```

rather than:

```text
first represented eligible date
```

Do not change recurrence behavior.

Determine whether current semantics and durable identity can coexist.

---

# `timesPerUserWeek` Canonicalization

Assess whether N occurrences should have stable slots:

```text
weekKey + slot 1
weekKey + slot 2
...
```

with each slot deterministically mapped to eligible days from the full semantic week.

If so, current truncated-window expansion may need later alignment.

Explicitly identify that dependency.

---

# Window-Clipped Generation

The generated output may still contain only occurrences intersecting the requested planning window.

But identity selection should ideally come from canonical logical expansion before clipping.

Assess this architectural principle:

```text
canonical occurrence expansion
    ↓
stable occurrence identity
    ↓
window clipping
```

rather than:

```text
requested window
    ↓
choose occurrences
    ↓
identity
```

This distinction is central to window invariance.

---

# Generation Range Versus Identity Domain

Task 2.1 found configured Preview range and resolved generation window are already separate concerns.

Task 2.7 should determine whether occurrence identity domain is broader than the visible generation window for recurrence semantics.

Do not solve Preview range representation here.

---

# Required Window-Invariance Examples

The result should include concrete examples for at least:

1. daily occurrence in overlapping windows;
2. weekly occurrence with window beginning midweek;
3. `timesPerUserWeek` with window beginning after an earlier eligible day;
4. wider window including the same logical week;
5. user-day boundary crossing midnight;
6. work occurrence with reused shift definition if supported.

---

# Required Behavioral Invariants

The result should recommend later invariants including:

1. same logical occurrence → same semantic identity;
2. placement changes do not change identity;
3. scheduled/unplaced changes do not change identity;
4. Preview regeneration does not change identity;
5. wider/narrower overlapping windows do not rename shared occurrences;
6. deleted source → unresolved identity, never retarget;
7. identity semantics are versioned;
8. manual events preserve authored identity;
9. work identity includes sufficient source context;
10. multiple same-source occurrences can be distinguished;
11. source validity/revision is separate from identity where appropriate.

---

# Required Later Test Contract

Do not add tests now.

Specify future tests covering:

* identical regeneration;
* overlapping windows;
* wider/narrower windows;
* daily recurrence;
* specific weekdays;
* weekly recurrence;
* `timesPerUserWeek`;
* custom week start;
* user-day boundary;
* overnight placement;
* DST-sensitive local dates where applicable;
* multiple same-day occurrences;
* source deletion;
* source edit;
* source ID reuse;
* manual event identity;
* work cycle/segment identity;
* scheduled versus unplaced identity;
* placement change;
* canonical serialization;
* identity versioning.

---

# Architectural Alignment Assessment

Assess proposed identity against:

* deterministic planning;
* information provenance;
* explainability;
* durable-data compatibility;
* user-data preservation;
* plan-decision authority;
* future engine architecture.

Use:

* Aligned
* Partially aligned
* Misaligned
* Unresolved

---

# Required Investigation Labels

Every significant conclusion must be labeled:

* **Confirmed**
* **Inferred**
* **Not found**
* **Unresolved**
* **Recommended**
* **Deferred**

---

# Explicit Non-Goals

Task 2.7 shall not:

* add `OccurrenceIdentity`;
* change current IDs;
* change recurrence expansion;
* change weekly behavior;
* change `timesPerUserWeek`;
* change placement;
* add PlanDecision;
* add plan overrides;
* add conflict acknowledgements;
* change persistence;
* add durable versions;
* migrate data;
* change profiles;
* change backups;
* change clear semantics;
* change UI;
* modify suggested fixes;
* refactor engine architecture;
* update governance documents before review.

---

# Dependencies

Requires completion and acceptance of:

* Task 2.1;
* Task 2.4;
* Task 2.5;
* Task 2.6.

Task 2.2–2.3 startup authority alignment remains preserved.

Governed by:

* Architecture Charter;
* Complete Architecture Specification;
* `DECISIONS.md`;
* durable-data ADR;
* Phase 1 checkpoint;
* accepted Phase 2 authority findings.

---

# Evidence Standards

Priority:

1. executable recurrence expansion code;
2. generated ID construction;
3. direct tests;
4. scheduling preference/date utilities;
5. store generation behavior;
6. architecture/governance context.

Do not infer stability from current test coincidence.

Explicitly test or reason from algorithms.

---

# Required Code Inspection

At minimum inspect:

```text
BlockCandidate
ScheduledBlock
GeneratedWorkBlock
ManualCalendarEvent
BlockRecurrence
BlockTemplate
ShiftCycle
ShiftSegment
generateBlockCandidates
placeBlockCandidates
generateCycleWorkBlocks
generateSchedulePreview
getActiveShiftSegment
user-day/date utilities
week-start utilities
```

Also inspect direct recurrence and identity-related tests.

---

# Required Result Artifact Structure

The Task 2.7 result should contain:

1. Executive Determination
2. Artifact Integrity
3. Evidence Reviewed
4. Logical Occurrence Definition
5. Current Identity Inventory
6. Current Recurrence Types
7. Daily Identity Semantics
8. Specific-Weekday Identity Semantics
9. Weekly Identity Semantics
10. `timesPerUserWeek` Identity Semantics
11. Planning-Window Invariance
12. Window-Invariance Matrix
13. User-Day Boundary Semantics
14. Week-Start Semantics
15. Overnight Semantics
16. DST / Time-Zone Assessment
17. Multiple Same-Day Occurrence Assessment
18. Occurrence Discriminator Options
19. Multiple-Occurrence Matrix
20. Template Occurrence Source Components
21. Work Occurrence Identity
22. Work Collision Analysis
23. Manual-Event Identity
24. Authored Edit / Deletion Semantics
25. Source ID Reuse Assessment
26. Identity Versus Source Validity
27. Source Revision / Fingerprint Assessment
28. Candidate Identity Models
29. Identity Model Matrix
30. Adopted Semantic Identity Contract
31. Canonical Expansion / Clipping Determination
32. Weekly Canonicalization Determination
33. `timesPerUserWeek` Canonicalization Determination
34. Runtime ID Versus Occurrence ID
35. Conflict-Identity Compatibility
36. Versioning Requirements
37. Migration / Compatibility Requirements
38. Serialization / Equality Semantics
39. Required Behavioral Invariants
40. Required Later Test Contract
41. Architectural Alignment Assessment
42. Open Questions
43. Recommended Next Task
44. Deviations
45. Discoveries and Deferred Work
46. Validation
47. Final Completion Determination

---

# Expected Decision Outcomes

Several outcomes are possible.

## Outcome A — Current Expansion Supports Stable Identity Directly

Then Task 2.8 may introduce an explicit `OccurrenceIdentity` without recurrence behavior changes.

## Outcome B — Weekly / `timesPerUserWeek` Expansion Must Be Canonicalized First

Then the next task should establish canonical recurrence expansion semantics before identity implementation.

## Outcome C — Work Identity Is Independent Prerequisite

If cycle/segment ambiguity cannot be solved cleanly, work identity may require its own bounded decision.

## Outcome D — Stable Identity Contract Is Fully Defined But Versioning Needs Governance

Then the next task may design versioned identity representation before implementation.

---

# Expected Follow-Up

Do not assume Task 2.8 is implementation.

Possible next tasks include:

### If recurrence behavior blocks identity

> **Task 2.8 — Establish Canonical Window-Invariant Recurrence Expansion**

### If identity semantics are ready

> **Task 2.8 — Introduce Explicit Occurrence Identity Without Plan-Decision Behavior**

### If versioning is the blocker

> **Task 2.8 — Design Versioned Occurrence Identity Representation and Compatibility Contract**

The Task 2.7 result decides.

---

# Validation Requirements

This task is investigation only.

No executable/test files should change.

Run targeted tests where needed.

At minimum consider suites covering:

```text
generateBlockCandidates
generateCycleWorkBlocks
placeBlockCandidates
generateSchedulePreview
```

and date/week-boundary tests.

Then, if required by project discipline:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Confirm:

* Task 2.7 specification remained immutable;
* only the separate result artifact was created;
* no governance document changed;
* no durable format changed.

---

# Completion Criteria

Task 2.7 is complete when:

* logical occurrence is defined;
* current identity algorithms are inventoried;
* recurrence-specific identity behavior is established;
* weekly and `timesPerUserWeek` window sensitivity is resolved or explicitly identified as a blocker;
* planning-window invariance requirements are defined;
* user-day/week-start semantics are defined;
* overnight behavior is defined;
* DST/time-zone limitations are recorded;
* multiple-occurrence discrimination is decided;
* work identity requirements are defined;
* manual-event identity is defined;
* authored edit/deletion semantics are defined;
* identity is separated from source validity;
* candidate identity models are compared;
* one versionable semantic identity contract is adopted or a prerequisite blocker is identified;
* migration/compatibility implications are recorded;
* required future tests are specified;
* no executable behavior changes;
* a dependency-correct next task is identified.

---

# Task Determination

Task 2.7 is an architectural identity investigation.

It does not implement occurrence identity or PlanDecision.

Its purpose is to establish the durable semantic identity contract that future user-owned plan decisions can safely target.

**The task is complete when DayFrame has an evidence-backed, versionable semantic identity contract for generated occurrences that remains stable for the same logical occurrence across deterministic regeneration and overlapping planning windows, distinguishes multiple same-source occurrences, handles work and manual-event sources explicitly, never silently retargets after authored changes, and is strong enough to serve as the durable target of future user-owned plan decisions without yet implementing those decisions.**
