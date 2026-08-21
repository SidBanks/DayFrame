# Task 2.29 — Establish Explicit Recovery Actions for Protected and Quarantined Profile V2 Ingress

## Status

Ready for implementation.

## Phase

Phase 2 — Authoritative State, Planning Decisions, and Lifetime-Safe Reference Foundations

## Task Type

Bounded recovery-authority implementation task.

Task 2.28 introduced an independently versioned Profile V2 durable surface with:

* valid reusable-pattern profiles;
* `quarantinedProfiles` for invalid preserved entries;
* protected ingress behavior for malformed/unsupported Profile V2;
* no silent V1 fallback;
* no destructive invalid-entry loss;
* no user-facing recovery actions.

Task 2.29 completes that recovery boundary by defining and implementing explicit, store-owned actions for:

1. protected Profile V2 ingress;
2. quarantined Profile V2 entries;
3. user-controlled preservation/export/removal/replacement where authorized.

This task does **not** change profile semantics, active source incarnation semantics, Active V2, Backup V2, DurableOccurrenceReference, PlanDecision, or scheduling behavior.

---

# 1. Execution Artifact Rules

This task specification is immutable once execution begins.

Before implementation:

1. verify that the saved project copy exists;
2. verify the supplied execution artifact is complete;
3. compare supplied and saved copies when both are available;
4. record SHA-256 evidence;
5. verify Task 2.28 is accepted as complete;
6. do not modify this task artifact during execution.

Execution findings must be recorded separately in:

`TASK_2.29_ESTABLISH_EXPLICIT_RECOVERY_ACTIONS_FOR_PROTECTED_AND_QUARANTINED_PROFILE_V2_INGRESS_RESULT.md`

If recovery cannot be implemented without changing the accepted Profile V2 reusable-pattern model, stop and report rather than broadening scope.

---

# 2. Purpose

Task 2.28 established correct preservation semantics for invalid profile data:

```text id="c18e6a"
Profile V2 ingress
    ├─ valid profiles
    └─ quarantined invalid entries
```

and:

```text id="7t2m8v"
invalid / unsupported Profile V2
    → protected ingress
    → no silent fallback
    → no destructive overwrite
```

That solved durable-data preservation.

It did not yet solve user recovery authority.

DayFrame can now preserve problematic profile data, but the user needs explicit, bounded recovery actions that answer:

> What can I do with preserved invalid profile data?

and:

> What can I do when the current Profile V2 durable source itself is protected?

Task 2.29 defines those actions.

---

# 3. Governing Architectural Principles

The task is governed by:

* Task 2.28 Profile V2 semantics;
* Phase 1 durable-data compatibility governance;
* profile durability/retry behavior;
* protected-ingress principles already established for active local recovery;
* non-destructive user-data preservation.

The following remain fixed:

1. profiles are reusable authored patterns;
2. Profile V2 is incarnation-free;
3. active source incarnation is unrelated to profile recovery;
4. valid profiles remain valid even when siblings are quarantined;
5. quarantined entries are preserved user data;
6. malformed/unsupported current Profile V2 must not be silently replaced;
7. V1 must not silently regain authority;
8. recovery actions must be explicit;
9. recovery must preserve truthful durability status;
10. recovery authority belongs to the store/domain boundary, not UI inference.

---

# 4. Architectural Objective

After Task 2.29, Profile V2 recovery must have explicit authority paths such as:

```text id="oph3yj"
Protected Profile V2
    ├─ retry / recheck
    ├─ export preserved raw source
    ├─ replace protected source with current valid profile collection
    └─ abandon protected profile source and establish empty/current Profile V2
```

and:

```text id="yo8h2l"
Quarantined Profile Entry
    ├─ inspect metadata / reason
    ├─ export preserved raw entry
    └─ explicitly remove from quarantine
```

The exact supported action set must be evidence-backed and narrowly scoped.

Do not add automatic repair.

---

# 5. Required Initial Audit

Before modifying code, inspect:

* Profile V2 ingress status type;
* `quarantinedProfiles`;
* protected raw profile-source evidence;
* current profile retry;
* current profile durability status;
* current desired durable condition;
* clear behavior;
* existing active-local recovery patterns;
* profile UI feedback;
* profile save/load/delete flows;
* profile persistence helpers;
* profile migration failures;
* store subscriptions;
* tests for invalid Profile V2 and quarantined entries.

Document current supported and missing recovery actions.

---

# 6. Recovery State Classification

Task 2.29 must preserve a clear distinction between:

## A. Protected whole-source ingress

The current Profile V2 source itself cannot be safely adopted.

Examples:

* malformed JSON;
* unsupported version;
* invalid envelope;
* reread uncertainty;
* verification mismatch.

## B. Valid Profile V2 with quarantined entries

The Profile V2 collection is adopted, valid profiles are usable, but one or more preserved entries are quarantined.

These conditions must not share identical recovery semantics.

---

# 7. Protected Whole-Source Recovery

For protected whole-source ingress, define explicit supported actions.

At minimum evaluate:

1. recheck/retry current source;
2. export preserved raw Profile V2 bytes;
3. replace protected profile checkpoint with current in-memory valid profile collection;
4. abandon protected profile checkpoint and establish authoritative empty Profile V2.

Do not silently mutate protected bytes.

---

# 8. Protected Source Recheck

Implement a store-owned recheck action analogous in spirit to active-local protected-source recheck.

It must:

1. reread the exact protected profile key;
2. compare against protected evidence;
3. distinguish unchanged from changed source;
4. revalidate if appropriate;
5. refuse stale recovery action if source changed externally.

Do not assume local storage is unchanged.

---

# 9. Source Changed Semantics

If the protected profile source has changed since protection was established:

* do not overwrite automatically;
* return explicit `sourceChanged` or equivalent;
* preserve current profile runtime state;
* require a fresh recovery decision.

This prevents destructive recovery against stale evidence.

---

# 10. Retry Semantics

Retry must be clearly separated from destructive replacement.

If retry means "attempt current desired Profile V2 durable condition again":

* use current valid runtime profile collection;
* do not overwrite protected ingress unless recovery authority explicitly allows it.

If retry means "re-read protected ingress":

* name/classify it accordingly.

Do not overload one action with ambiguous semantics.

---

# 11. Replace Protected Checkpoint

Define an explicit recovery action:

> Replace the protected Profile V2 checkpoint with the current valid in-memory profile collection.

Requirements:

1. current runtime collection must be valid;
2. quarantined entries must be included or excluded according to explicit policy;
3. write complete Profile V2;
4. reread;
5. validate;
6. verify;
7. only then clear protection;
8. durability becomes `durable`.

This is destructive replacement of the protected durable source and therefore must be user-triggered.

---

# 12. Quarantine Inclusion During Replacement

Determine whether replacing the protected Profile V2 source with current in-memory state includes current quarantined entries.

Preferred default:

> preserve them unless the user explicitly removed them.

Do not silently discard quarantine merely because the outer protected source is being replaced.

Document the adopted rule.

---

# 13. Abandon Protected Profile Source

Define an explicit destructive action:

> Abandon the protected Profile V2 durable source and establish an authoritative empty/current Profile V2 state.

Requirements:

* remove protected profile keys as necessary;
* preserve V1 anti-resurrection semantics;
* establish Profile V2 authority/marker;
* clear protected ingress evidence;
* reset runtime valid profiles/quarantine according to the chosen abandonment semantics;
* survive restart.

This must be explicit and user-triggered.

---

# 14. Abandonment Semantics

Decide whether abandonment means:

## A. empty profiles + empty quarantine

or:

## B. keep current runtime profiles but discard protected durable source

Task wording should follow current recovery model.

Prefer the interpretation most consistent with existing active-local abandonment semantics.

Document it explicitly.

---

# 15. Export Protected Raw Source

Provide a non-destructive way to retrieve/export the exact protected raw Profile V2 source.

This is important because protected durable data is user data.

The action may expose:

* raw JSON/string;
* downloadable file content;
* another existing export mechanism.

Do not parse/rewrite the raw evidence before export.

---

# 16. Export Quarantined Entry

Each quarantined profile entry must be exportable in preserved form.

Requirements:

* export exact preserved raw entry data where available;
* include enough metadata to identify the quarantine reason;
* do not mutate or remove the entry on export;
* do not fabricate a valid profile representation.

---

# 17. Quarantine Metadata

Audit current `quarantinedProfiles` representation.

Each quarantined entry should preserve enough information for:

* stable identity within the quarantine;
* original profile ID/name when available;
* raw preserved payload;
* reason/classification;
* source version context if necessary.

Do not add excessive diagnostics.

---

# 18. Quarantine Identity

A quarantined entry needs a stable handle for explicit removal/export.

Determine whether current profile ID is sufficient.

If invalid data may not contain a valid/unique profile ID, introduce a quarantine-local handle.

This handle must not be confused with:

* profile artifact ID;
* source ID;
* source incarnation.

---

# 19. Remove Quarantined Entry

Implement an explicit action:

> Remove one quarantined entry from the current Profile V2 collection.

Requirements:

* target unambiguously;
* preserve valid profiles;
* preserve other quarantined entries;
* persist complete next Profile V2 collection;
* update desired durable condition;
* report durability outcome;
* do not alter active state or Preview.

This is destructive user-data removal and must be explicit.

---

# 20. Remove All Quarantined Entries

Determine whether a bulk-clear-quarantine action is justified.

If implemented:

* it must be explicit;
* it must not delete valid profiles;
* persistence semantics must be atomic;
* result must report durability status.

If no clear product requirement exists, defer bulk removal and support per-entry removal only.

---

# 21. Quarantined Entry Repair

Do **not** automatically repair quarantined entries.

Do not infer missing fields, assign defaults, or rewrite invalid patterns to make them valid.

A future import/edit recovery workflow may support repair under its own task.

Task 2.29 only supports preservation/export/removal/replacement authority.

---

# 22. Reimport / Replace Quarantined Entry

Audit whether current profile save/import workflows provide a defensible way to replace a quarantined entry with a corrected valid profile.

If such a path already exists, document it.

Do not invent a new profile editor for raw quarantined data.

---

# 23. Valid Profile Independence

Quarantine recovery actions must not affect valid profiles unless the action explicitly replaces the whole collection.

Per-entry export/removal must leave valid profiles unchanged.

Direct tests required.

---

# 24. Active State Independence

Profile recovery actions must not alter:

* active authored state;
* active source incarnation;
* Active V2;
* Preview;

except if an explicitly separate profile activation occurs later.

Recovery of the profile durable surface alone is secondary-artifact work.

---

# 25. Profile Durability

All mutating recovery actions must integrate with profile durability.

Examples:

* remove quarantined entry;
* replace protected checkpoint;
* abandon protected source.

Each must:

* update desired durable condition;
* record factual persistence outcome;
* support retry where appropriate.

Do not reuse active durability status.

---

# 26. Protected Recovery and Retry

If protected profile ingress exists, ordinary profile retry must not overwrite it unless the recovery action explicitly authorizes replacement.

Audit and enforce this boundary.

Protected evidence takes precedence over convenience retry.

---

# 27. Recovery Result Types

Introduce explicit result semantics for recovery actions.

Possible outcomes:

* success;
* persistenceFailed;
* sourceChanged;
* noProtectedSource;
* invalidCurrentState;
* unavailable;
* unsupported;

Use existing project conventions.

Do not throw for expected recoverable conditions.

---

# 28. Subscriber Behavior

Define notification behavior.

For each action:

## Export

No state mutation; no ordinary/durability notification unless existing infrastructure requires it.

## Remove quarantine

Profile collection/quarantine mutation + durability notification as appropriate.

## Replace protected source

Protection state clears on verified success; profile durability/status subscribers update.

## Abandon

Profile runtime/quarantine/protection state changes; notifications occur once per authoritative action where possible.

Direct tests required.

---

# 29. Protection Clearing

Protected ingress evidence must clear only after:

* verified successful replacement;
* verified successful abandonment;
* another explicitly governed recovery resolution.

Do not clear protection merely because a write was attempted.

---

# 30. Quarantine Persistence

Quarantined entries remain part of Profile V2 current durable authority until explicitly removed.

Retry, save, delete, migration, and unrelated profile writes must preserve them.

Task 2.28 already established this; Task 2.29 must protect it during recovery actions too.

---

# 31. Profile Save With Quarantine

Saving a valid profile while quarantine exists must:

* modify valid profiles;
* preserve all quarantine entries;
* persist complete V2 collection.

No quarantine loss.

---

# 32. Profile Delete With Quarantine

Deleting a valid profile while quarantine exists must:

* delete only the valid profile;
* preserve quarantine;
* persist complete V2 collection.

---

# 33. Profile Retry With Quarantine

Retry must include current quarantine exactly.

No valid or quarantined data may silently disappear.

---

# 34. Clear Interaction

Audit `clearLocalData()` under Profile V2 recovery.

If clear is already governed to clear profiles/quarantine/protected ingress:

* preserve that behavior;
* verify restart anti-resurrection.

Do not create a second profile-only clear unless justified.

---

# 35. V1 Resurrection Prevention

All recovery actions must preserve the established rule:

> once Profile V2 authority is established, retained Profile V1 can never silently become current authority again.

Test after:

* replacement;
* abandonment;
* quarantine removal;
* clear.

---

# 36. Empty V2 Authority

An empty valid Profile V2 collection remains authoritative.

Recovery actions must not interpret:

```text id="0pf0nv"
profiles = []
quarantinedProfiles = []
```

as "no Profile V2 exists."

This is essential to anti-resurrection.

---

# 37. Unsupported V2

For unsupported future Profile V2:

* export raw source should remain available;
* destructive replacement/abandonment may be available if safely governed;
* automatic parsing/repair remains prohibited.

Do not pretend to understand the unknown payload.

---

# 38. Corrupt JSON

For malformed JSON:

* preserve exact raw bytes;
* allow raw export;
* allow explicit abandonment/replacement if the recovery action can safely operate without parsing the old source;
* do not silently substitute defaults.

---

# 39. Recovery Replacement Current State

If the current runtime profile collection was initialized empty because ingress was protected, replacing the protected checkpoint with current state may destroy preserved data.

Therefore the action must be explicit and user-triggered.

Tests must confirm no automatic call performs this replacement.

---

# 40. Recovery UI

Implement the minimum UI necessary for explicit user authority.

At minimum, when profile ingress is protected or quarantine exists, the user should be able to understand that preserved profile data requires attention.

Possible controls:

* Export protected data;
* Replace with current profiles;
* Abandon protected profiles;
* Export quarantined entry;
* Remove quarantined entry.

Do not redesign the Profile UX broadly.

Use existing profile/workflow feedback areas if possible.

---

# 41. UI Copy

Copy must distinguish:

## Protected whole source

Example concept:

> Saved profiles could not be safely loaded. The original data has been preserved.

## Quarantine

Example concept:

> Some saved profiles could not be validated. Valid profiles remain available and the invalid entries were preserved.

Do not imply corruption if the actual status is unsupported version or verification uncertainty.

Use factual status-specific wording where practical.

---

# 42. Destructive Confirmation

Destructive actions should require appropriate explicit confirmation.

At minimum:

* abandon protected profile source;
* remove quarantined entry if it permanently deletes preserved user data;
* replace protected checkpoint if it overwrites preserved raw source.

Use current project confirmation patterns.

Do not add modal complexity unnecessarily.

---

# 43. Export Before Destructive Action

Do not require export before deletion/replacement, but ensure export is available.

The user may choose to preserve a copy before destructive recovery.

---

# 44. Accessibility

Recovery controls must:

* use native buttons;
* expose disabled state when unavailable;
* provide descriptive labels;
* not rely solely on color/status icon;
* keep preserved-data status visible.

---

# 45. No Profile Semantics Change

Recovery actions do not change the meaning of profiles.

A recovered valid profile still represents:

> reusable authored pattern data

and activation still creates fresh active source lifetimes.

Do not introduce restoration of active incarnation through recovery.

---

# 46. No Active Incarnation In Quarantine

Quarantined Profile V2 entries are still profile artifacts.

Do not introduce active incarnation into them.

If historical Profile V1 contained active-like records with incarnation, preserve raw historical content where necessary but normalize valid Profile V2 output to incarnation-free pattern semantics.

---

# 47. No Active-State Recovery Coupling

Do not call active-local recovery actions from profile recovery.

The surfaces are independent.

Profile recovery must not replace or abandon Active V2.

---

# 48. No Backup V2

Do not implement Backup V2 in this task.

Profile raw/quarantine export is a recovery convenience, not the Backup V2 architectural surface.

---

# 49. No DurableOccurrenceReference

Do not introduce durable occurrence references.

Profile recovery has no need for them.

---

# 50. No PlanDecision

Do not introduce PlanDecision or decision persistence.

Profiles remain authored patterns only.

---

# 51. No Scheduling Changes

Do not modify schedule generation, recurrence expansion, placement, friction, SuggestedFix, or `OccurrenceIdentity`.

---

# 52. Recovery Data Export Format

Determine the narrowest export representation.

For protected whole-source export, prefer exact raw source bytes/string.

For quarantined entry export, preserve:

* raw entry;
* reason metadata separately where useful.

Do not silently convert invalid entry into a new Profile V2 valid profile.

---

# 53. File Naming

If UI export generates downloadable files, use deterministic descriptive filenames such as:

* `dayframe-profile-recovery.json`;
* `dayframe-quarantined-profile-<id>.json`.

Do not embed sensitive information unnecessarily.

---

# 54. Export Purity

Export actions must not:

* mutate profile state;
* change durability status;
* remove quarantine;
* clear protection;
* write Profile V2.

They are read-only recovery operations.

---

# 55. Quarantine Removal Atomicity

Removing one quarantined entry must:

1. create complete next Profile V2 collection;
2. validate current V2 collection;
3. serialize;
4. attempt durable write;
5. retain session mutation according to existing profile authority semantics;
6. keep desired durable condition for retry if persistence fails.

Do not partially mutate raw storage.

---

# 56. Protected Replacement Atomicity

Replacement must:

1. recheck protected source;
2. verify it is unchanged;
3. validate current replacement collection;
4. serialize V2;
5. write;
6. reread;
7. validate;
8. verify;
9. establish marker/authority;
10. clear protection only after success.

Direct tests required.

---

# 57. Protected Abandonment Atomicity

Abandonment must:

1. recheck protected source when relevant;
2. remove/neutralize current profile durable source according to authority rules;
3. preserve anti-resurrection marker;
4. establish authoritative empty/current state;
5. clear protection only after durable success.

If deletion itself fails, protection remains.

---

# 58. Source Recheck Failure

If local storage cannot be reread during destructive recovery:

* do not overwrite;
* return unavailable/error outcome;
* keep protection;
* do not mutate session collection unless current architecture explicitly permits it.

Prefer safety.

---

# 59. External Mutation

Direct tests must simulate:

* protected source changes externally before replacement;
* protected source changes externally before abandonment.

Both actions must reject stale recovery authority.

---

# 60. Recovery Status Subscription

Expose enough status for UI to observe:

* protected whole-source condition;
* quarantine count;
* recovery-action result.

Do not add these to `DayFrameState` if existing profile infrastructure keeps them separately.

---

# 61. Quarantine Count

A simple derived count is sufficient for persistent UI awareness.

Do not duplicate the full raw quarantine in presentation state if the store already owns it.

---

# 62. UI Persistence Awareness

If quarantine remains after navigation/profile operations, the app should continue to indicate that preserved invalid profile data exists.

Do not make the warning disappear merely because the user leaves the profile section.

Use existing app-level durability awareness patterns where appropriate.

---

# 63. Successful Quarantine Cleanup

When the final quarantined entry is explicitly removed:

* quarantine warning disappears;
* valid profiles remain;
* Profile V2 remains authoritative;
* V1 cannot resurrect;
* no active-state effect.

---

# 64. Partial Cleanup

Removing one of several quarantined entries:

* preserves the others;
* warning remains;
* count updates accurately.

---

# 65. Recovery Feedback

Provide concise workflow feedback for:

* exported;
* removed;
* replacement succeeded;
* abandonment succeeded;
* source changed;
* persistence failed;
* unavailable.

Avoid exposing raw implementation exceptions.

---

# 66. Recovery Result Persistence

Do not persist UI feedback or recovery result history.

Store factual durability/ingress state only.

---

# 67. Profile Save/Delete During Protected Ingress

Determine whether save/delete should remain disabled/rejected while whole-source Profile V2 ingress is protected.

Preferred principle:

> Do not allow ordinary writes to overwrite protected durable evidence.

If current implementation already blocks Retry but not save/delete, close the gap.

Direct tests required.

---

# 68. Load Profile During Protected Whole-Source Ingress

If runtime valid profile collection is unavailable/empty because ingress is protected, there may be nothing valid to load.

Do not fabricate valid profiles from protected raw data.

If a preexisting valid runtime collection remains, determine whether load remains safe.

Document exact behavior.

---

# 69. Save/Delete With Quarantine

Quarantine alone should not prevent ordinary valid profile save/delete.

Because the V2 collection itself is valid authority:

* valid profile operations may proceed;
* quarantine must be preserved.

This distinction is important.

---

# 70. Retry During Quarantine

Ordinary profile retry should remain allowed because the current V2 collection is valid.

Retry includes quarantine and retries the desired durable condition.

---

# 71. Whole-Source Protected Versus Quarantine Matrix

Produce and directly protect:

| Operation            | Protected whole source                | Valid V2 + quarantine    |
| -------------------- | ------------------------------------- | ------------------------ |
| Save valid profile   | blocked unless recovery-authorized    | allowed                  |
| Delete valid profile | blocked unless recovery-authorized    | allowed                  |
| Load valid profile   | depends on valid runtime availability | allowed                  |
| Retry desired V2     | must not overwrite protected source   | allowed                  |
| Export raw           | allowed                               | per-entry export allowed |
| Replace checkpoint   | explicit recovery                     | N/A                      |
| Abandon              | explicit recovery                     | N/A                      |
| Remove quarantine    | N/A                                   | allowed                  |

Refine from executable evidence.

---

# 72. Quarantine Reason Categories

Use existing reason categories where possible.

Do not explode into overly granular errors.

Potential reasons:

* invalid profile metadata;
* invalid pattern;
* duplicate profile ID;
* unsupported legacy entry;
* normalization failure.

If current V2 already records reason, preserve it.

---

# 73. Quarantine Raw Preservation

A quarantined entry must retain the raw value as received at the migration/ingress boundary, not only a lossy parsed/normalized subset, wherever technically feasible.

This supports future recovery.

---

# 74. Quarantine Writer

Current Profile V2 writes must carry quarantine forward exactly enough for later export/removal.

Do not normalize quarantined raw entries into a different semantic form during unrelated writes.

---

# 75. Migration Quarantine

Task 2.28 migration already creates quarantine.

Task 2.29 must not rerun migration or change V1→V2 quarantine classification unless a direct defect is discovered.

Recovery acts on the established V2 state.

---

# 76. V2 Quarantine On Current Read

Audit whether invalid entries inside a current Profile V2 envelope are quarantined or invalidate the entire V2 envelope.

Preserve Task 2.28's established validation policy.

Do not silently change collection-level versus entry-level classification.

---

# 77. Profile V2 Verification

Recovery replacements must use the same V2 validation/verification primitives as migration.

Do not invent a weaker recovery writer.

---

# 78. Marker Semantics

Recovery replacement/abandonment must maintain the Profile V2 establishment marker correctly.

Directly test no retained V1 resurrection after either action.

---

# 79. Desired Durable Condition After Replacement

After successful protected replacement:

* desired profile condition should be `snapshot`;
* snapshot equals current valid V2 collection;
* durability is `durable`.

---

# 80. Desired Durable Condition After Abandonment

After successful abandonment:

* determine whether desired profile condition is authoritative empty snapshot or absence;
* align with current clear/profile semantics;
* anti-resurrection must still hold.

Document explicitly.

---

# 81. Desired Durable Condition After Quarantine Removal

After removal:

* desired condition is the new complete V2 snapshot;
* Retry retains that exact intended collection if write fails.

---

# 82. Recovery Tests — Protected Export

Test:

* malformed protected Profile V2;
* export returns exact raw bytes/string;
* no state/durability mutation;
* protection remains.

---

# 83. Recovery Tests — Quarantine Export

Test:

* entry export returns preserved raw entry;
* metadata/reason correct;
* collection unchanged;
* no durability change.

---

# 84. Recovery Tests — Quarantine Removal

Test:

* one quarantined entry removed;
* valid profiles unchanged;
* remaining quarantine preserved;
* V2 write correct;
* Retry behavior on failure;
* no active/Preview changes.

---

# 85. Recovery Tests — Final Quarantine Removal

Test:

* final entry removed;
* quarantine empty;
* V2 still established;
* V1 does not resurrect on restart;
* warning/status clears.

---

# 86. Recovery Tests — Protected Replacement Success

Test:

* source unchanged;
* current valid collection written;
* reread/validate/verify;
* protection clears;
* durability durable;
* restart loads replacement.

---

# 87. Recovery Tests — Protected Replacement Source Changed

Test:

* protected source changed externally;
* replacement rejected;
* no write;
* protection remains;
* result sourceChanged.

---

# 88. Recovery Tests — Protected Replacement Write Failure

Test:

* write fails;
* protection remains;
* durability failure factual;
* raw source preserved;
* no false success.

---

# 89. Recovery Tests — Protected Abandonment Success

Test:

* protected source abandoned;
* resulting authoritative state correct;
* marker prevents V1 resurrection;
* restart remains abandoned;
* protection clears.

---

# 90. Recovery Tests — Protected Abandonment Failure

Test:

* remove/write/marker step fails;
* protection remains;
* no false success;
* restart safety preserved.

---

# 91. Recovery Tests — Protected Save/Delete Block

Test ordinary profile save/delete while whole-source ingress is protected.

They must not overwrite protected source.

---

# 92. Recovery Tests — Quarantine Save/Delete Allowed

Test valid V2 + quarantine:

* save valid profile works;
* delete valid profile works;
* quarantine preserved exactly.

---

# 93. Recovery Tests — Clear

Test clear while quarantine/protected state exists.

Ensure:

* keys/status cleared according to existing clear semantics;
* no V1 resurrection;
* restart correct.

---

# 94. Recovery Tests — UI

Add focused UI coverage for:

* protected profile warning;
* quarantine warning/count;
* export action availability;
* destructive confirmation;
* successful removal;
* sourceChanged feedback;
* persistence failure feedback.

Keep UI tests focused on user-visible authority, not storage internals.

---

# 95. Accessibility Tests

Where existing UI testing infrastructure supports it, assert:

* native button roles;
* disabled states;
* confirmation accessibility;
* visible warning copy.

---

# 96. Reference Audit

Before completion, audit all production references to:

* profile ingress status;
* `quarantinedProfiles`;
* profile Retry;
* save/delete;
* clear;
* profile keys/marker;
* profile writer;
* migration;
* UI profile feedback;
* durability subscription.

Confirm no ordinary write bypasses protected ingress authority.

---

# 97. Persistence Writer Audit

After Task 2.29:

* ordinary Profile V2 save/delete/retry writes current V2;
* quarantine removal writes current V2;
* protected replacement writes verified V2;
* protected abandonment establishes governed V2 absence/empty authority;
* no current writer emits Profile V1.

---

# 98. Result Artifact

Create:

`docs/implementation/phase-2/TASK_2.29_ESTABLISH_EXPLICIT_RECOVERY_ACTIONS_FOR_PROTECTED_AND_QUARANTINED_PROFILE_V2_INGRESS_RESULT.md`

The result must include at least:

1. Executive Result
2. Artifact Integrity
3. Governing Evidence
4. Initial Recovery-State Inventory
5. Files Changed
6. Protected Whole-Source Semantics
7. Quarantine Semantics
8. Recovery Action Inventory
9. Protected Source Recheck
10. SourceChanged Semantics
11. Retry Boundary
12. Protected Replacement
13. Quarantine Preservation During Replacement
14. Protected Abandonment
15. Protected Raw Export
16. Quarantine Export
17. Quarantine Metadata
18. Quarantine Identity
19. Quarantine Removal
20. Bulk Removal Determination
21. Valid Profile Independence
22. Active State Independence
23. Profile Durability Integration
24. Recovery Result Types
25. Subscriber Semantics
26. Protection Clearing
27. Quarantine Persistence
28. Save/Delete With Quarantine
29. Clear Interaction
30. V1 Resurrection Prevention
31. Unsupported V2
32. Corrupt JSON
33. Recovery UI
34. UI Copy
35. Destructive Confirmation
36. Accessibility
37. Export Format
38. Export Purity
39. Replacement Atomicity
40. Abandonment Atomicity
41. Source Recheck Failure
42. External Mutation
43. Recovery Status Subscription
44. Quarantine Count
45. Recovery Feedback
46. Save/Delete During Protected Ingress
47. Whole-Source Versus Quarantine Matrix
48. Quarantine Reason Categories
49. Raw Preservation
50. Marker Semantics
51. Desired Durable Condition
52. Tests Added or Updated
53. Reference Audit
54. Persistence Writer Audit
55. Architectural Alignment Assessment
56. Deviations
57. Discoveries and Deferred Work
58. Recommended Next Task
59. Focused Validation
60. Full Validation
61. Final Completion Determination

---

# 99. Required Matrices

## A. Recovery-State Matrix

| State | Valid profiles usable? | Quarantine present? | Ordinary writes allowed? | Recovery required? |
| ----- | ---------------------: | ------------------: | -----------------------: | -----------------: |

## B. Recovery-Action Matrix

| Action | Protected source | Quarantine | Destructive? | Durable write? |
| ------ | ---------------: | ---------: | -----------: | -------------: |

## C. Failure Matrix

| Action | Failure point | Runtime mutation retained? | Protection retained? | Retry/recovery |
| ------ | ------------- | -------------------------: | -------------------: | -------------- |

## D. Independence Matrix

| Action | Active state | Active incarnation | Preview | Valid profiles | Quarantine |
| ------ | ------------ | ------------------ | ------- | -------------- | ---------- |

---

# 100. Validation Requirements

Run focused tests for:

* profile recovery store actions;
* protected ingress;
* quarantine removal/export;
* source recheck;
* persistence failure;
* clear/anti-resurrection;
* profile save/delete with quarantine;
* UI recovery controls.

Then run:

`npm run lint`

`npm run typecheck`

`npm test`

`npm run build`

`git diff --check`

The full repository suite must pass.

Record exact file/test counts.

---

# 101. Completion Criteria

Task 2.29 is complete only when:

* protected Profile V2 ingress has explicit recovery actions;
* protected source can be safely rechecked;
* stale recovery detects sourceChanged;
* exact protected raw data can be exported;
* protected checkpoint replacement is explicit, verified, and safe;
* protected abandonment is explicit, durable, and restart-safe;
* ordinary profile writes cannot overwrite protected ingress;
* quarantined entries remain preserved user data;
* quarantined entries can be exported;
* quarantined entries can be explicitly removed;
* valid profiles remain usable while quarantine exists;
* valid save/delete/retry preserve quarantine;
* final quarantine cleanup preserves V2 authority and anti-resurrection;
* active state/incarnation/Preview remain unaffected by profile recovery operations;
* durability status and desired condition remain truthful;
* V1 cannot resurrect after recovery actions;
* minimum factual UI awareness exists;
* destructive actions require explicit user authority;
* Profile V2 reusable-pattern semantics remain unchanged;
* no Backup V2 is implemented;
* no DurableOccurrenceReference is implemented;
* no PlanDecision is implemented;
* scheduling and `OccurrenceIdentity` remain unchanged;
* focused and full validation pass;
* result artifact is complete.

---

# 102. Explicit Non-Goals

Do **not**:

* repair quarantined profiles automatically;
* infer missing profile fields;
* convert quarantine into valid profiles automatically;
* restore active source incarnation from profiles;
* change Active V2 semantics;
* implement Backup V2;
* implement DurableOccurrenceReference;
* implement PlanDecision;
* redesign profile editing;
* add source history;
* add profile history;
* add tombstones beyond any narrowly required quarantine handle;
* create a generic recovery framework;
* change scheduling;
* change `OccurrenceIdentity`;
* weaken protected-ingress semantics;
* silently discard raw preserved data;
* silently overwrite protected sources;
* silently fall back to Profile V1.

---

# 103. Stop Conditions

Stop and report if:

* exact protected raw data cannot be preserved/exported under current storage architecture;
* quarantine entries lack enough stable identity for safe removal and require a broader profile format revision;
* protected replacement/abandonment cannot be made source-recheck safe;
* recovery requires changing the Profile V2 schema incompatibly;
* ordinary save/delete cannot be blocked during protection without redesigning store ownership;
* the UI cannot expose explicit recovery authority without a broader navigation redesign;
* recovery requires Active V2 or Backup V2 coupling;
* full-suite failures reveal an unrelated architectural regression.

Recommend the narrowest prerequisite.

---

# 104. Recommended Follow-On Boundary

If Task 2.29 completes successfully, the next durable-surface task should be:

> **Task 2.30 — Implement Backup V2 Lifetime-Preserving Recovery Format and Restore Semantics**

That task should establish the first artifact capable of preserving and restoring active source incarnation intentionally.

After Active V2, Profile V2/recovery, and Backup V2 are complete, perform a cross-surface incarnation checkpoint before DurableOccurrenceReference work.

---

# 105. Task Determination

**Authorized:** explicit store-owned recovery actions and minimal UI for protected Profile V2 ingress and quarantined entries, including source recheck, raw export, explicit replacement, abandonment, quarantine export/removal, durability integration, anti-resurrection protection, and regression coverage.

**Not authorized:** automatic repair, profile semantic changes, active lifetime restoration, Backup V2, DurableOccurrenceReference, PlanDecision, scheduling redesign, or generic recovery infrastructure.

The governing recovery principle is:

> Preserved user data remains preserved until the user explicitly chooses a destructive recovery action, and DayFrame must never mistake uncertainty for permission to overwrite.

---

# 106. Final Completion Statement

**Task 2.29 is complete when DayFrame provides explicit, source-recheck-safe, non-destructive recovery authority for protected Profile V2 ingress and preserved quarantined profile entries; allows exact preserved data export and explicit user-authorized replacement, abandonment, or quarantine removal without silent overwrite or loss; preserves valid profiles, active state, source incarnation, Preview, durability truth, and V1 anti-resurrection semantics; exposes the minimum factual recovery UI needed for user control; passes complete repository validation; and introduces no Backup V2, DurableOccurrenceReference, PlanDecision, automatic profile repair, or scheduling behavior.**
