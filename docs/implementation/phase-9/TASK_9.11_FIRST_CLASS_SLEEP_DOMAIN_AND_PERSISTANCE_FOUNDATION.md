# Task 9.11 — First-Class Sleep Domain & Persistence Foundation

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Foundational implementation / domain identity / persistence / migration task  
**Primary Specification:** Task 9.10 — First-Class Sleep Architecture Specification  
**Implementation Changes:** **AUTHORIZED WITHIN THIS TASK'S BOUNDED SCOPE**  
**Scheduling / Capacity / Friction Semantic Changes:** **PROHIBITED**  
**UI Redesign:** **PROHIBITED**  
**Required Durable Output:** `PHASE_9_TASK_9_11_FIRST_CLASS_SLEEP_DOMAIN_PERSISTENCE_FOUNDATION_RESULT.md`

---

## 1. Objective

Implement the **domain and persistence foundation** required for First-Class Sleep V1.

Task 9.10 established the canonical architectural decision:

> **For First-Class Sleep V1, Sleep SHALL be represented as a dedicated authored `SleepRequirementV1`, with deterministic required Sleep occurrences resolved before discretionary Capacity and ordinary movable Commitment placement.**

Task 9.11 must implement the lowest-level authoritative substrate necessary for that architecture while deliberately stopping **before Sleep scheduling semantics change**.

The task must establish:

```text
First-Class Sleep domain identity
+
authored requirement representation
+
revision semantics
+
durable occurrence identity
+
active authored-state ownership
+
profile representation
+
backup representation
+
restore / clear compatibility
+
conservative legacy coexistence
+
validation
+
tests
```

The result must make First-Class Sleep a valid, durable DayFrame domain concept that later tasks can consume.

Task 9.11 must **not** yet:

```text
derive Sleep occurrences into schedule geometry
solve Sleep feasibility
change placement
change Capacity
change Goal feasibility
change Friction
change Suggested Fix
remove Omit Sleep from current legacy behavior
change publication semantics
change Today
change execution
change Summary
replace existing Sleep Commitments
perform automatic legacy conversion
redesign the UI
```

At completion, the repository should understand and safely persist First-Class Sleep **without yet treating it as active scheduling occupancy**.

---

## 2. Governing Architecture

Preserve DayFrame's authority chain:

```text
Authored
  ↓
Derived
  ↓
Proposed
  ↓
Accepted
  ↓
Scheduled / Realized
  ↓
Published
  ↓
Execution / Progress
  ↓
History
  ↓
Learned
  ↓
Explicit Preference
```

Task 9.11 operates primarily at the:

```text
Authored
```

layer and establishes identity primitives needed by later Derived/Historical layers.

Do not allow this foundational task to prematurely implement downstream authority.

---

## 3. Governing Sleep Architecture

Task 9.10 established the following canonical First-Class Sleep V1 principles.

Task 9.11 must implement only the subset necessary for domain/persistence foundation while preserving all of them for later work.

At minimum:

1. Sleep has explicit semantic identity.
2. Authored Sleep requirement is distinct from derived Sleep occurrence.
3. Sleep is not merely an ordinary optional flexible Commitment.
4. Sleep may be temporally flexible without being optional.
5. Sleep has no numeric scheduling priority.
6. V1 exact duration is authored explicitly.
7. Sleep may use clock-relative or Work-relative intent.
8. Work-relative Sleep requires explicit off-day fallback.
9. Sleep has canonical durable occurrence identity independent of geometry.
10. Sleep source lifetime uses source incarnation semantics.
11. Requirement revision is distinct from occurrence identity.
12. Sleep derivation is disposable.
13. Sleep publication and execution will later be separate historical objects.
14. Legacy Sleep Commitments retain their historical/current semantics until explicitly converted.
15. No title/category-based automatic conversion is permitted.
16. Profiles must not carry live source incarnations or accepted authority.
17. Full backups must preserve live authority and lineage.
18. Restore and clear must preserve existing anti-resurrection guarantees.
19. Unsupported or malformed new authority must be protected rather than silently discarded.
20. UI must not become the semantic owner.

---

## 4. Task Boundary

Task 9.11 is intentionally narrower than the full Task 9.10 implementation sequence.

The required implementation boundary is:

```text
Domain identity
→ authored state
→ validation
→ persistence
→ profiles
→ backups
→ restore
→ clear
→ durable reference support
→ migration-compatible legacy coexistence
```

Stop there.

The following future dependency chain remains outside this task:

```text
Sleep occurrence derivation
→ full physical context
→ deterministic joint solver
→ Sleep resolution
→ ordinary Commitment ordering
→ Capacity
→ Goal feasibility
→ Friction
→ Suggested Fix
→ publication
→ execution/history
→ Planner/Summary convergence
```

---

## 5. Required Pre-Implementation Repository Trace

Before changing code, trace the current owners identified by Task 9.10.

At minimum inspect:

```text
state/createInitialDayFrameState.ts
state/dayFrameStore.ts
state/activeV2.ts
state/dayFrameProfiles.ts
state/dayFrameBackupV12.ts
state/dayFrameRestoreComposition.ts
core/blocks/types.ts
core/occurrences/occurrenceIdentity.ts
core/occurrences/durableOccurrenceReference.ts
```

Also inspect:

- all current active-state validators;
- profile validators/translators;
- backup validators/translators;
- restore orchestration;
- clear/anti-resurrection behavior;
- source-incarnation helpers;
- schema-version conventions;
- existing decision references to block/template occurrences;
- tests for malformed/unsupported persisted state.

Do not infer ownership from filenames alone.

Trace production call paths.

---

## 6. Architecture Governance Update

Task 9.10 identified a genuine architecture revision relative to older Commitment/Capacity wording.

Task 9.11 must record the **minimal governance update necessary to authorize implementation**.

Follow the existing `ARCHITECTURE_CHARTER.md` process.

At minimum record the architectural decision that:

> **Sleep is a dedicated authored domain concept rather than an ordinary Commitment subtype.**

And that:

> **Fixed, locked and explicitly accepted Commitment geometry constrains planning; ordinary movable Commitment geometry will ultimately be resolved around foundational Work and required Sleep before Goal allocation.**

And that:

> **Capacity will ultimately consume dedicated Sleep resolution rather than treating first-class Sleep as an ordinary Commitment liability.**

Do not rewrite the complete architecture specification unnecessarily.

Use the repository's existing ADR/decision/governance convention.

The governance change must be narrow and traceable to Task 9.10.

---

## 7. Canonical Authored Domain Type

Implement the canonical authored First-Class Sleep V1 representation established by Task 9.10.

The conceptual specification is:

```ts
type SleepWindowIntentV1 =
  | {
      kind: 'clock';
      startClock: TimeString;
      endClock: TimeString;
      preferredStartClock?: TimeString;
    }
  | {
      kind: 'beforeWork' | 'afterWork';
      spanMinutes: number;
      offDay: {
        startClock: TimeString;
        endClock: TimeString;
        preferredStartClock?: TimeString;
      };
    };

type SleepRequirementV1 = {
  version: 1;
  id: string;
  incarnationId: SourceIncarnationId;
  revision: number;
  enabled: boolean;
  effectiveFrom: LocalDateString;
  effectiveUntilExclusive?: LocalDateString;
  weekdays: 'all' | Weekday[];
  durationMinutes: number;
  window: SleepWindowIntentV1;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  createdAt: string;
  updatedAt: string;
};
```

Adapt names only where repository conventions clearly require it.

Do not alter semantics merely to reduce implementation work.

If implementation naming differs, document the exact mapping in the RESULT.

---

## 8. Required Validation Rules

Implement structural validation for First-Class Sleep V1.

At minimum:

### 8.1 Version

```text
version === 1
```

Unsupported versions must fail safely.

### 8.2 Identity

Require:

```text
nonempty id
valid incarnationId
positive revision
```

Identity reuse across recreated source lifetimes is prohibited.

### 8.3 Enabled

Must be explicit boolean.

Do not infer enabled state.

### 8.4 Effective dates

Require:

```text
valid effectiveFrom
valid optional effectiveUntilExclusive
effectiveUntilExclusive > effectiveFrom
```

when an end exists.

### 8.5 Weekdays

Allow:

```text
'all'
```

or:

```text
nonempty unique valid weekday set
```

Do not silently normalize an empty list to all days.

### 8.6 Duration

Require integer:

```text
1 <= durationMinutes <= 1440
```

This is an application representation bound, not health advice.

### 8.7 Buffers

Require integers:

```text
0 <= bufferBeforeMinutes <= 1440
0 <= bufferAfterMinutes <= 1440
```

### 8.8 Clock window

Require valid canonical clock strings.

`preferredStartClock` is optional.

Equal start/end is legal and represents the full civil-day window under later derivation semantics.

Do not attempt to derive geometry in this task.

### 8.9 Work-relative window

Require:

```text
kind === 'beforeWork' | 'afterWork'
1 <= spanMinutes <= 4320
valid offDay clock window
```

The structural footprint rule must reject:

```text
durationMinutes
+ bufferBeforeMinutes
+ bufferAfterMinutes
> spanMinutes
```

for Work-relative intent.

Do not attempt to prove dated Work feasibility in this task.

### 8.10 Timestamps

Require valid timestamps according to existing repository conventions.

Metadata timestamps must not become scheduling inputs.

---

## 9. Requirement Revision Semantics

Implement the authored revision model specified by Task 9.10.

A First-Class Sleep source has:

```text
stable source lifetime
+
revisioned authored intent
```

A new authored edit must not require a new source incarnation.

A deletion/recreation must.

Task 9.11 must support the persistence representation necessary for:

```text
one logical Sleep source lifetime
multiple revisions
one effective revision per owner date
```

The effective revision rule is:

1. revisions have effective dates;
2. a revision applies beginning at its `effectiveFrom`;
3. it ends at the next effective revision or its explicit exclusive end;
4. when multiple revisions share the same effective date, the highest revision wins;
5. older revisions remain preserved;
6. edits do not rewrite historical revision records.

Do not implement scheduling derivation from these revisions yet.

Implement and test the **pure authored-state effective-revision query**.

---

## 10. One Primary Sleep Requirement

Task 9.10 selected:

> **V1 has one primary Sleep requirement per active setup.**

Enforce this at the canonical authored-state owner.

Do not rely on UI prevention.

The state model must make it impossible for normal valid authored state to contain two simultaneously active primary First-Class Sleep source lifetimes.

If the repository representation uses a collection for forward compatibility, validation must enforce the V1 cardinality rule.

Do not silently choose one when malformed persisted state contains multiple competing sources.

Protect/reject according to existing persistence conventions.

---

## 11. No Automatic Sleep Requirement

A fresh setup must **not** silently acquire a First-Class Sleep requirement merely because older DayFrame versions historically seeded or normalized `default_sleep`.

Preserve the Task 9.10 rule:

```text
no requirement configured
```

is distinct from:

```text
requirement configured and satisfied
```

Task 9.11 must represent:

```text
notConfigured
```

at the authored-query level.

Do not create an 8-hour default.

Do not infer health requirements.

Do not promote `default_sleep`.

---

## 12. Legacy Sleep Commitment Coexistence

Existing Sleep-like `BlockTemplate` records remain ordinary legacy Commitments.

This includes records identified by:

```text
category === 'sleep'
title === 'Sleep'
id === 'default_sleep'
legacy normalization characteristics
```

None of these alone authorize conversion.

Task 9.11 must preserve:

```text
legacy Sleep Commitment
```

and:

```text
First-Class Sleep Requirement
```

as distinct source families.

They may temporarily coexist in persistence during the migration period.

However:

> **Task 9.11 must not cause duplicate schedule ownership because First-Class Sleep is not yet connected to schedule derivation.**

Do not remove or disable legacy Sleep automatically.

Do not change legacy placement behavior in this task.

---

## 13. Conversion Foundation

Implement only the **domain/persistence foundation** required for later explicit conversion.

The conceptual lineage object from Task 9.10 is:

```ts
type LegacySleepConversionV1 = {
  commandId: string;
  legacyTemplate: Lifetime;
  legacyRecurrences: Lifetime[];
  requirement: Lifetime;
  effectiveFrom: LocalDateString;
};
```

Task 9.11 may introduce the validated persistence representation for conversion provenance if necessary for safe schema design.

However:

```text
DO NOT expose or execute the conversion workflow yet
```

unless the existing architecture requires an atomic conversion command merely to validate persistence behavior.

The future conversion must eventually:

```text
create new Sleep requirement
+
retire selected future legacy recurrence generation
+
preserve old history
+
preserve explicit lineage
```

Task 9.11 must not prematurely perform that behavior.

If conversion provenance cannot be introduced safely without implementing conversion, defer the persisted record and document the exact future insertion point.

Do not invent fake conversion records.

---

## 14. Durable Sleep Occurrence Identity

Extend DayFrame's canonical durable-occurrence identity system with First-Class Sleep.

The conceptual variant is:

```ts
type SleepOccurrenceReferenceV1 = {
  version: 1;
  sourceKind: 'sleepRequirement';
  requirement: {
    id: string;
    incarnationId: SourceIncarnationId;
  };
  coordinate: {
    scopeKind: 'userDay';
    userDayDate: LocalDateString;
    slot: 0;
  };
};
```

Use existing repository conventions where appropriate.

Required semantics:

```text
source lifetime
+
canonical owner day
+
slot 0
```

determine occurrence identity.

Occurrence identity must **not** depend on:

```text
physical start
physical end
title
duration
priority
week start
view range
requirement revision
Work anchor
cycle
segment
```

Those may later be provenance/dependency fields.

They are not occurrence identity.

---

## 15. Durable Reference Compatibility

Existing durable occurrence references must remain readable and semantically unchanged.

Do not reinterpret old template references as SleepRequirement references.

Extend:

- validators;
- equality;
- serialization;
- parsing;
- source-kind discriminators;
- helper functions;
- test fixtures;

only as necessary to support the new variant.

Unknown future source kinds/versions must fail safely.

No reference may silently retarget from:

```text
legacy Sleep Commitment
```

to:

```text
First-Class Sleep Requirement
```

---

## 16. Source Incarnation Semantics

Reuse DayFrame's existing source-incarnation model.

Required behavior:

```text
edit requirement
→ same id + same incarnationId + higher revision

delete requirement
→ source lifetime ends

recreate requirement
→ new incarnationId

profile activation
→ fresh active incarnation

backup restore
→ restore preserved authority/lineage according to restore semantics
```

Stale references to an old incarnation must never bind to a recreated Sleep requirement with the same logical ID.

Add direct regression coverage.

---

## 17. Active Authored-State Integration

Integrate First-Class Sleep into the canonical active authored aggregate.

Task 9.10 proposed an active-state schema successor.

Discover the existing versioning convention and implement the appropriate successor.

Expected architectural direction:

```text
Active V2
→ Active V3
```

if repository conventions support that naming/version sequence.

Do not force the name if the actual codebase uses another convention.

The new active authored state must preserve all existing authored state plus First-Class Sleep.

No existing authored data may be dropped.

---

## 18. Active-State Migration

Implement deterministic migration from the previous active-state version.

The migration must:

```text
preserve all existing authored data
+
add no First-Class Sleep requirement by default
+
preserve all legacy Sleep Commitments unchanged
+
preserve existing source lifetimes
+
produce valid new-version state
```

Migration must be:

```text
deterministic
idempotent
restart-safe
```

Do not use:

```text
title
category
default_sleep
```

to create First-Class Sleep.

Test malformed and unsupported variants.

---

## 19. Profile Integration

Profiles are reusable authored patterns, not live authority.

Implement First-Class Sleep profile representation consistent with Task 9.10.

A profile may preserve portable Sleep intent such as:

```text
enabled
effective pattern as appropriate
weekdays
duration
window
buffers
```

but must not preserve live active authority such as:

```text
active incarnationId
accepted Sleep placement decisions
publication IDs
execution history
```

Determine whether profile revision metadata itself is portable or whether the profile should store normalized pattern values.

Follow existing profile semantics.

Document the choice.

---

## 20. Profile Activation

When a profile containing First-Class Sleep is loaded into active authored state:

```text
allocate a fresh active source lifetime
```

Do not reuse the source incarnation from:

- the profile;
- the previously active setup;
- another profile activation.

If profile loading replaces authored state under existing semantics, preserve that behavior.

Loading a profile must not resurrect:

```text
old Sleep decisions
old publication
old execution
old source references
```

Add direct regression tests.

---

## 21. Profile Versioning

Task 9.10 proposed a profile schema successor.

Implement the appropriate versioned profile envelope.

Expected direction:

```text
Profiles V2
→ Profiles V3
```

if consistent with repository conventions.

Old profiles must remain importable/readable.

They must migrate to:

```text
no First-Class Sleep configured
```

unless they explicitly contain the new schema.

Do not infer First-Class Sleep from legacy profile Commitments.

---

## 22. Backup Integration

Extend full DayFrame backup to preserve First-Class Sleep authored authority and lineage.

Task 9.10 proposed:

```text
Backup V12
→ Backup V13
```

if consistent with repository conventions.

A full backup must preserve:

```text
Sleep requirement source lifetime
Sleep revisions
Sleep authored intent
future supported conversion lineage if implemented
```

It must also preserve every existing backup domain unchanged.

Do not accidentally turn backup into profile semantics.

Backup restore is authority restoration, not fresh source creation.

---

## 23. Backup Translation

Older backups must remain restorable.

Migration from old backup versions must:

```text
preserve all old data
+
create no First-Class Sleep requirement
+
preserve legacy Sleep Commitments
+
preserve legacy decisions/history
```

A backup containing no First-Class Sleep data must remain semantically:

```text
notConfigured
```

after translation.

Do not infer a requirement from historical Sleep category data.

---

## 24. Restore Integration

Integrate the new authored Sleep state into the existing restore composition/transaction path.

Preserve:

- staged validation;
- atomic replacement semantics;
- restart safety;
- rollback/protection behavior;
- anti-resurrection behavior;
- storage verification behavior established by prior tasks.

A failed restore must not produce a partially restored Sleep source.

A successful restore must not lose Sleep revision lineage.

Do not create a separate Sleep restore mechanism.

---

## 25. Clear / Anti-Resurrection Integration

Ensure full DayFrame clear semantics include the new First-Class Sleep authority.

After clear and restart:

```text
old Sleep requirement
old Sleep revisions
old active Sleep source lifetime
```

must not reappear from stale persistence.

Preserve existing anti-resurrection coordination.

Do not introduce a standalone Sleep persistence key unless repository architecture absolutely requires one.

Task 9.10 explicitly preferred integration into the active authored aggregate.

---

## 26. Unsupported / Malformed Authority Protection

The new schema introduces authority-bearing authored state.

Unsupported or malformed First-Class Sleep data must not silently degrade into:

```text
no Sleep requirement
```

if doing so would discard authority.

Follow existing DayFrame protection semantics.

At minimum test:

```text
unsupported SleepRequirement version
invalid incarnation
invalid revision
invalid effective dates
duplicate weekdays
empty weekday set
invalid duration
invalid buffer
invalid clock
invalid Work-relative span
footprint > span
multiple active primary Sleep sources
unknown durable-reference source kind/version
```

Expected behavior must be explicit and deterministic.

---

## 27. Pure Effective-Requirement Query

Implement a pure domain/state query equivalent to:

```text
queryEffectiveSleepRequirement(ownerDay)
```

or the repository-appropriate equivalent.

It must distinguish:

```text
notConfigured
disabled
notApplicable
effective
invalid/protected where applicable
```

For `effective`, return the exact effective revision.

The query must not:

```text
derive schedule geometry
inspect Capacity
inspect Goal Demand
place Sleep
inspect Preview
mutate state
```

This is an authored-state query only.

---

## 28. Required Query Determinism

For equivalent authored state and owner date:

```text
queryEffectiveSleepRequirement
```

must return semantically identical output regardless of:

- collection insertion order;
- profile history;
- previous Preview generation;
- UI navigation;
- current selected day;
- generated timestamps unrelated to the requirement.

Add order-independence tests where meaningful.

---

## 29. No Scheduling Activation Yet

This is a critical task invariant.

At the end of Task 9.11:

> **Persisting a First-Class Sleep Requirement must not yet create schedule occupancy.**

Do not connect the new requirement to:

```text
generateBlockCandidates
placeBlockCandidates
generateSchedulePreview
physical occupancy
Capacity
Goal feasibility
Friction
Suggested Fix
publication
Today
execution
Summary
```

unless a minimal type-union compatibility change is required so those systems safely ignore the new authored source.

If such compatibility changes are required:

```text
they must preserve existing behavior exactly
```

and must be documented in the RESULT.

This invariant keeps Task 9.11 reviewable.

---

## 30. Legacy Scheduling Behavior Must Remain Stable

All existing legacy Sleep Commitments must continue to behave exactly as they did before Task 9.11.

This includes current:

- recurrence;
- candidate generation;
- beforeWork handling;
- off-day propagation;
- priority;
- Friction;
- Suggested Fix;
- `Omit Sleep`;
- Preview;
- publication;
- execution;

for **legacy Commitment-based Sleep**.

Those semantics will be retired or adapted in later bounded tasks.

Task 9.11 must not mix the old and new systems.

---

## 31. No Duplicate Semantic Owner

Although legacy and first-class representations may coexist temporarily, they must remain explicitly different source families.

The codebase must not create:

```text
SleepRequirement
→ hidden BlockTemplate
```

or:

```text
BlockTemplate
→ hidden SleepRequirement
```

as a synchronization mechanism.

No dual writes.

No shadow objects.

No mirrored authored state.

The future explicit conversion workflow will transfer future authority deliberately.

---

## 32. Required Domain Tests

Add focused tests for First-Class Sleep authored semantics.

At minimum:

### Valid clock requirement

```text
8h
clock window
buffers
all days
```

validates and round-trips.

### Valid beforeWork requirement

```text
beforeWork
span
off-day fallback
```

validates.

### Valid afterWork requirement

same.

### Equal clock window

```text
startClock === endClock
```

is structurally valid.

### Duration bounds

```text
0
1441
noninteger
```

rejected.

### Buffer bounds

negative / >1440 / noninteger rejected.

### Span bounds

0 / >4320 / noninteger rejected.

### Footprint exceeds span

rejected.

### Weekdays

empty/duplicate/invalid rejected.

### Effective dates

invalid/reversed rejected.

### Version

unsupported rejected/protected appropriately.

---

## 33. Required Revision Tests

At minimum:

```text
revision 1 effective on date A
revision 2 effective on date B
```

returns correct revision before/after B.

Also test:

```text
same effective date
higher revision wins
```

and:

```text
explicit end
```

and:

```text
disabled revision
```

and:

```text
non-applicable weekday
```

Older revisions must remain present after edits.

Do not test scheduling geometry here.

---

## 34. Required Identity Tests

At minimum:

### Geometry independence

Equivalent Sleep occurrence reference remains identical even if hypothetical:

```text
start time changes
end time changes
duration changes through a later revision
Work anchor changes
```

because those are not identity fields.

### Revision independence

Revision changes do not change:

```text
source lifetime + owner day + slot
```

occurrence identity.

### Recreation

Deleting/recreating produces a new incarnation and therefore a different durable occurrence reference.

### Legacy isolation

A legacy template occurrence and First-Class Sleep occurrence for the same day must never compare equal.

---

## 35. Required Active-State Tests

At minimum verify:

```text
fresh state
→ no First-Class Sleep configured
```

```text
old active state migration
→ no First-Class Sleep inferred
```

```text
new active state
→ Sleep round-trips
```

```text
legacy Sleep template
→ remains unchanged
```

```text
malformed multiple primary Sleep sources
→ rejected/protected
```

```text
edit Sleep
→ same source incarnation, higher revision
```

```text
delete/recreate
→ fresh incarnation
```

---

## 36. Required Profile Tests

At minimum:

```text
save profile with First-Class Sleep
→ portable Sleep intent preserved
```

```text
load profile
→ fresh active Sleep incarnation
```

```text
load same profile twice
→ different active incarnations
```

```text
profile does not contain accepted Sleep decisions/publication/execution
```

```text
old profile containing legacy Sleep Commitment
→ no automatic First-Class Sleep
```

```text
profile round-trip
→ stable portable intent
```

---

## 37. Required Backup Tests

At minimum:

```text
backup new state
→ Sleep requirement + revisions preserved
```

```text
restore backup
→ original Sleep source lifetime preserved
```

```text
old V12 backup
→ migrates with no First-Class Sleep
```

```text
legacy Sleep Commitment in old backup
→ remains legacy
```

```text
malformed new Sleep authority
→ restore fails/protects safely
```

```text
restore failure
→ no partial Sleep authority committed
```

```text
restore + restart
→ Sleep lineage stable
```

---

## 38. Required Clear / Restart Tests

At minimum:

```text
create Sleep requirement
→ persist
→ clear
→ restart
→ no Sleep requirement
```

Verify no stale persistence layer resurrects:

```text
source lifetime
revisions
profile-derived active authority
```

Do not delete saved profiles unless existing clear semantics say profiles are cleared.

Test the actual existing contract.

---

## 39. Required Legacy Regression Tests

Preserve representative current behavior for legacy Commitment-based Sleep.

At minimum ensure existing tests still cover:

- `default_sleep` normalization;
- Sleep BlockTemplate persistence;
- legacy Sleep candidate generation;
- current beforeWork behavior;
- current off-day behavior;
- current Friction/Suggested Fix behavior;
- current publication/execution compatibility where already tested.

Do not rewrite those tests to make First-Class Sleep appear implemented.

---

## 40. Required Persistence Matrix

Include in the RESULT:

| Object | Active State | Profile | Backup | Restore | Clear | Authority |
|---|---:|---:|---:|---:|---:|---|
| Sleep Requirement | | | | | | |
| Sleep Revision History | | | | | | |
| Sleep Source Incarnation | | | | | | |
| Sleep Occurrence Reference | | | | | | |
| Legacy Sleep Commitment | | | | | | |
| Conversion Provenance | | | | | | |
| Accepted Sleep Decision | | | | | | |
| Published Sleep | | | | | | |
| Sleep Execution | | | | | | |

For objects deferred from Task 9.11, explicitly write:

```text
Not yet implemented
```

rather than implying persistence exists.

---

## 41. Required Schema Migration Matrix

Include:

| Schema Family | Previous Version | New Version | Sleep Change | Legacy Reader / Translator | Authority Risk | Evidence |
|---|---|---|---|---|---|---|
| Active authored state | | | | | | |
| Profiles | | | | | | |
| Backup | | | | | | |
| Durable occurrence reference | | | | | | |
| PlanDecision | | | | | | |
| Publication | | | | | | |
| Execution | | | | | | |

Only families actually changed by 9.11 should receive a new implementation version.

For untouched future families, mark:

```text
Deferred
```

Do not version them merely because Task 9.10 predicted future changes.

---

## 42. Required Legacy Coexistence Matrix

Include:

| Scenario | Legacy Commitment Exists? | First-Class Requirement Exists? | Scheduling Owner in 9.11 | Automatic Conversion? | Expected Behavior |
|---|---:|---:|---|---:|---|
| Old setup with Sleep template | | | | | |
| Fresh setup | | | | | |
| New requirement authored | | | | | |
| Both temporarily present | | | | | |
| Old profile loaded | | | | | |
| New profile loaded | | | | | |
| Old backup restored | | | | | |
| New backup restored | | | | | |

The key Task 9.11 rule is:

```text
First-Class Sleep is persisted authority,
but legacy scheduling remains the only active Sleep scheduling path
until the later derivation task.
```

---

## 43. Required Identity Matrix

Include:

| Change | Same Sleep Source Lifetime? | Same Occurrence Reference? | New Revision? | New Incarnation? |
|---|---:|---:|---:|---:|
| Change duration prospectively | | | | |
| Change window prospectively | | | | |
| Change buffers prospectively | | | | |
| Disable prospectively | | | | |
| Re-enable through new revision | | | | |
| Delete source | | | | |
| Recreate source | | | | |
| Load profile | | | | |
| Restore full backup | | | | |
| Change Work Pattern | | | | |
| Change Day Boundary | | | | |

Explain owner-day occurrence identity where applicable.

---

## 44. Required Behavioral Invariants

The implementation must establish and test at least these Task 9.11 invariants:

1. First-Class Sleep has an explicit authored source kind.
2. First-Class Sleep is not represented as a BlockTemplate.
3. First-Class Sleep does not shadow-write a BlockTemplate.
4. Legacy Sleep Commitments remain ordinary Commitments.
5. No legacy Sleep is automatically promoted.
6. A fresh setup contains no inferred First-Class Sleep requirement.
7. V1 permits at most one primary active Sleep source.
8. A Sleep source has stable ID/incarnation across authored revisions.
9. Recreating the source creates a new incarnation.
10. Revision history is append-preserving.
11. Effective revision selection is deterministic.
12. Requirement revision is not occurrence identity.
13. Sleep occurrence identity is owner-day based and geometry-independent.
14. Legacy and First-Class Sleep references cannot compare equal.
15. Profiles preserve portable intent but not live source incarnation.
16. Profile activation creates a fresh source incarnation.
17. Full backup preserves live Sleep authority and lineage.
18. Old backups do not infer First-Class Sleep.
19. Restore is atomic with respect to Sleep authority.
20. Clear prevents Sleep authority resurrection.
21. Unsupported/malformed Sleep authority is not silently discarded as `notConfigured`.
22. Persisting First-Class Sleep does not yet create schedule occupancy.
23. Existing legacy scheduling behavior remains unchanged.
24. No Task 9.11 code path makes Sleep subtract from Capacity.
25. No Task 9.11 code path changes Friction or Suggested Fix semantics.
26. No Task 9.11 code path changes publication or execution semantics.
27. UI is not the semantic owner of Sleep.
28. Equivalent authored inputs produce deterministic effective-requirement results.
29. New persistence versions remain backward-compatible with supported prior versions.
30. Historical legacy references retain their original semantics.

---

## 45. No Premature PlanDecision Versioning

Task 9.10 anticipates a future Sleep placement decision payload.

Task 9.11 does **not** implement accepted Sleep placement.

Therefore:

```text
do not version PlanDecision merely to reserve space
```

unless the durable-reference union itself is structurally embedded in PlanDecision validation in a way that requires compatibility changes.

If compatibility changes are necessary:

- preserve all current PlanDecision semantics;
- do not introduce Sleep move/omit payloads;
- document exactly why the schema changed.

Otherwise mark PlanDecision changes:

```text
Deferred
```

---

## 46. No Premature Publication Versioning

Task 9.10 anticipates:

```text
PublishedSleepSnapshotV1
SleepPublicationContextV1
publication seam validation
```

These are outside Task 9.11.

Do not implement or reserve empty publication structures.

Publication must continue operating on current scheduling sources exactly as before.

Mark publication schema work:

```text
Deferred to later First-Class Sleep publication task
```

---

## 47. No Premature Execution Versioning

Task 9.10 anticipates a first-class published Sleep execution subject.

Do not implement it yet.

Execution remains unchanged in Task 9.11.

Do not create an execution record referencing an unpublished First-Class Sleep requirement.

Mark execution schema work:

```text
Deferred
```

---

## 48. No Premature Solver

Do not implement:

```text
SleepOccurrenceV1
ScheduledSleepOccurrenceV1
SleepResolutionV1
SleepFeasibilityConflictV1
```

as operational scheduling systems in Task 9.11.

The durable occurrence **reference type** is authorized.

Pure authored revision applicability is authorized.

Physical geometry is not.

If conceptual type placeholders are needed for compile-time organization, they must not be wired into production scheduling and should be avoided unless necessary.

---

## 49. No UI Redesign

Task 9.11 is not the Sleep authoring UX task.

Do not:

- redesign Commitments;
- move Sleep out of the Commitment screen;
- add a new Sleep settings surface;
- change Planner navigation;
- change Summary;
- change Today;
- expose conversion UI.

If tests require authoring First-Class Sleep, use canonical store/domain commands or fixtures appropriate to the repository architecture.

A later task will expose the semantic owner through product UI.

---

## 50. Validation

Run the repository's standard validation appropriate to an implementation task.

At minimum:

```text
format
lint
typecheck/build
full test suite
```

Use actual repository scripts.

Also run focused suites for:

- active state;
- profiles;
- backups;
- restore;
- clear;
- durable occurrence references;
- source incarnation;
- legacy Sleep regressions.

Record exact commands and outcomes.

Do not claim validation that was not run.

---

## 51. Repository Hygiene

Before implementation:

1. inspect `git status`;
2. record the pre-existing dirty state;
3. do not overwrite unrelated changes;
4. do not delete existing RESULT artifacts;
5. preserve Task 9.8B/9.9/9.10 work;
6. do not commit;
7. do not push.

After implementation:

1. inspect `git status`;
2. inspect `git diff --stat`;
3. inspect relevant diffs;
4. run `git diff --check`;
5. distinguish pre-existing changes from Task 9.11 changes.

---

## 52. Prohibited Changes

Do **not**:

- implement Sleep scheduling;
- implement the Sleep feasibility solver;
- connect First-Class Sleep to candidate generation;
- connect First-Class Sleep to placement;
- connect First-Class Sleep to physical occupancy;
- connect First-Class Sleep to Capacity;
- change Goal Demand;
- change Goal feasibility;
- change Proposal;
- change Accepted Allocation behavior;
- change realization behavior;
- change Friction semantics;
- change Suggested Fix semantics;
- remove legacy `Omit Sleep`;
- implement Sleep overrides;
- change publication semantics;
- version publication solely for future Sleep;
- change Today;
- change execution;
- version execution solely for future Sleep;
- change Goal Progress;
- change Summary/history semantics;
- redesign UI;
- automatically convert legacy Sleep;
- infer a Sleep requirement;
- create an 8-hour default;
- shadow-write legacy templates;
- introduce a second persistence owner;
- add dependencies unless absolutely required and justified;
- commit;
- push.

---

## 53. Required RESULT Artifact

Create exactly one durable task-result artifact:

```text
PHASE_9_TASK_9_11_FIRST_CLASS_SLEEP_DOMAIN_PERSISTENCE_FOUNDATION_RESULT.md
```

Place it in the existing Phase 9 result-artifact folder.

The filename must contain:

```text
RESULT
```

Do not create additional task reports.

Architecture governance artifacts required by Section 6 are authorized repository changes and are not considered task-result artifacts.

---

## 54. Required RESULT Structure

The RESULT must contain these sections in this exact order:

```text
# Task 9.11 — First-Class Sleep Domain & Persistence Foundation RESULT

## 1. Executive Summary

## 2. Scope and Governing Specification

## 3. Pre-Implementation Repository State

## 4. Architecture Governance Update

## 5. Current Persistence Ownership Trace

## 6. Implemented Sleep Domain Model

## 7. Validation Rules

## 8. Revision Semantics

## 9. Effective-Requirement Query

## 10. Source Incarnation Semantics

## 11. Durable Occurrence Identity

## 12. Durable Reference Compatibility

## 13. Active Authored-State Integration

## 14. Active-State Migration

## 15. Profile Integration

## 16. Profile Activation and Fresh Lifetimes

## 17. Profile Migration

## 18. Backup Integration

## 19. Backup Migration

## 20. Restore Integration

## 21. Clear / Anti-Resurrection Integration

## 22. Unsupported / Malformed Authority Protection

## 23. Legacy Sleep Commitment Coexistence

## 24. Conversion Foundation Status

## 25. Scheduling Non-Activation Verification

## 26. Persistence Matrix

## 27. Schema Migration Matrix

## 28. Legacy Coexistence Matrix

## 29. Identity Matrix

## 30. Behavioral Invariants

## 31. Test Coverage

## 32. Legacy Regression Assessment

## 33. Validation Record

## 34. Changed Files

## 35. Deferred First-Class Sleep Work

## 36. Completion Assessment
```

---

## 55. Required Changed-Files Accounting

The RESULT must list every file changed by Task 9.11 and classify it:

```text
Domain
Persistence
Migration
Profile
Backup
Restore
Identity
Governance
Test
RESULT
```

For each file provide:

- purpose;
- semantic change;
- whether authoritative behavior changed;
- associated tests.

Do not mix pre-existing dirty files into the Task 9.11 change list.

If a pre-existing file had to be edited, identify:

```text
pre-existing modification
+
Task 9.11 additional modification
```

separately.

---

## 56. Completion Criteria

Task 9.11 is complete only when all of the following are true.

### Governance

- [ ] Task 9.10's dedicated Sleep domain decision is recorded through the existing governance process.
- [ ] Commitment/Capacity architectural wording is updated only as necessary to authorize the selected architecture.
- [ ] No unrelated architecture rewrite occurred.

### Domain

- [ ] `SleepRequirementV1` or exact repository-equivalent exists.
- [ ] Sleep window intent is explicitly typed.
- [ ] clock intent validates.
- [ ] beforeWork intent validates.
- [ ] afterWork intent validates.
- [ ] off-day fallback is required for Work-relative intent.
- [ ] exact duration is validated.
- [ ] buffers are validated.
- [ ] applicability is validated.
- [ ] V1 cardinality is enforced.

### Revision semantics

- [ ] source lifetime is stable across edits.
- [ ] revision history is preserved.
- [ ] effective-date semantics are deterministic.
- [ ] same-date highest revision wins.
- [ ] disabled/notApplicable/notConfigured are distinguishable.
- [ ] no scheduling derivation is performed by the effective query.

### Identity

- [ ] durable Sleep occurrence reference exists.
- [ ] owner-day + source lifetime + slot determine occurrence identity.
- [ ] revision does not alter occurrence identity.
- [ ] geometry does not alter occurrence identity.
- [ ] recreation changes incarnation.
- [ ] legacy template references remain distinct.
- [ ] unknown source kinds/versions fail safely.

### Active state

- [ ] active authored state persists First-Class Sleep.
- [ ] previous active state migrates deterministically.
- [ ] old state gains no inferred Sleep requirement.
- [ ] legacy Sleep templates remain unchanged.
- [ ] malformed multiple primary sources are rejected/protected.

### Profiles

- [ ] profiles can preserve portable Sleep intent.
- [ ] profiles do not preserve live Sleep incarnation.
- [ ] profile activation creates fresh lifetime.
- [ ] repeated activation creates fresh lifetimes.
- [ ] old profiles do not infer First-Class Sleep.

### Backup / restore

- [ ] full backup preserves Sleep authority and lineage.
- [ ] previous backup versions remain supported.
- [ ] old backups do not infer First-Class Sleep.
- [ ] restore is atomic with respect to Sleep.
- [ ] failed restore does not partially commit Sleep.
- [ ] restored source incarnation is preserved.
- [ ] restart preserves restored Sleep lineage.

### Clear

- [ ] full clear settles First-Class Sleep authority.
- [ ] restart does not resurrect cleared Sleep.
- [ ] existing profile-clear semantics remain unchanged.

### Legacy coexistence

- [ ] legacy Sleep remains an ordinary Commitment.
- [ ] no automatic conversion exists.
- [ ] no title/category promotion exists.
- [ ] no hidden shadow template exists.
- [ ] no dual writes exist.
- [ ] legacy scheduling remains unchanged.

### Scheduling boundary

- [ ] First-Class Sleep is not consumed by candidate generation.
- [ ] First-Class Sleep is not consumed by placement.
- [ ] First-Class Sleep is not physical occupancy yet.
- [ ] First-Class Sleep does not subtract from Capacity yet.
- [ ] First-Class Sleep does not alter Goal feasibility.
- [ ] First-Class Sleep does not alter Friction.
- [ ] First-Class Sleep does not alter Suggested Fix.
- [ ] First-Class Sleep does not alter publication.
- [ ] First-Class Sleep does not alter execution.
- [ ] First-Class Sleep does not alter Summary/history.

### Validation

- [ ] focused domain tests pass.
- [ ] identity tests pass.
- [ ] active-state tests pass.
- [ ] profile tests pass.
- [ ] backup tests pass.
- [ ] restore tests pass.
- [ ] clear/restart tests pass.
- [ ] legacy Sleep regression tests pass.
- [ ] full test suite passes.
- [ ] lint passes.
- [ ] build/typecheck passes.
- [ ] formatting passes.
- [ ] `git diff --check` passes.
- [ ] no commit was created.
- [ ] no push occurred.

### Documentation

- [ ] required RESULT exists.
- [ ] persistence matrix is complete.
- [ ] schema migration matrix is complete.
- [ ] legacy coexistence matrix is complete.
- [ ] identity matrix is complete.
- [ ] changed-files accounting is complete.
- [ ] deferred downstream Sleep work is explicit.

---

## 57. Final Completion Statement

If and only if every Task 9.11 completion criterion is satisfied, end the RESULT with exactly:

```text
Task 9.11 — First-Class Sleep Domain & Persistence Foundation is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.11 — First-Class Sleep Domain & Persistence Foundation is INCOMPLETE.
```

Then immediately identify the exact unresolved implementation or evidence blockers.

Do not mark Task 9.11 complete merely because the new types compile.

The task is complete only when First-Class Sleep has a safe, versioned, deterministic, persistence-backed authored identity that survives the full DayFrame state lifecycle without altering scheduling behavior.

---

## 58. Governing Principle

Task 9.11 is deliberately foundational.

Do not make Sleep "work" by prematurely wiring it into the scheduler.

First make Sleep **exist correctly**.

At the end of this task, DayFrame should be able to say:

```text
I know what your Sleep requirement is.
I know which revision applies.
I know which source lifetime it belongs to.
I can preserve it safely.
I can back it up.
I can restore it.
I can carry its portable intent through profiles.
I can identify its future occurrences durably.
I will not confuse it with an old Sleep Commitment.
I will not invent one if you never authored one.
```

It should **not yet** say:

```text
I have scheduled your Sleep.
I have reserved Capacity for it.
I have resolved conflicts around it.
```

Those claims require the later derivation and feasibility implementation.

Task 9.11 establishes the authority foundation that makes those later claims trustworthy.