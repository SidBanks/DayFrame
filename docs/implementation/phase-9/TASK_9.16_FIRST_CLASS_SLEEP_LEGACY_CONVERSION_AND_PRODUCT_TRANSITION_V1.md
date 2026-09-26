# Task 9.16 — First-Class Sleep Legacy Conversion & Product Transition V1

**Status:** Ready for Codex  
**Phase:** Phase 9 — Post-Dogfood Convergence  
**Task Type:** Legacy Conversion / Product Transition / Migration Safety / Authority Cutover  
**Primary Specification:** Task 9.10 — First-Class Sleep Architecture Specification  
**Prerequisites:**  
- Task 9.10 — First-Class Sleep Architecture Specification — COMPLETE  
- Task 9.11 — First-Class Sleep Domain & Persistence Foundation — COMPLETE  
- Task 9.12 — First-Class Sleep Derivation & Feasibility Foundation — COMPLETE  
- Task 9.13 — First-Class Sleep Capacity & Planning Integration V1 — COMPLETE  
- Task 9.14 — First-Class Sleep Friction & Corrective Authority V1 — COMPLETE  
- Task 9.15 — First-Class Sleep Publication, Execution & Historical Authority V1 — COMPLETE  
**Implementation Changes:** **AUTHORIZED WITHIN THIS TASK'S BOUNDED SCOPE**  
**Automatic Legacy Sleep Promotion:** **PROHIBITED**  
**Historical Legacy Sleep Rewriting:** **PROHIBITED**  
**Sleep Architecture Redesign:** **PROHIBITED**  
**Sleep Progress / Scoring / Learning:** **PROHIBITED**  
**Planner / Summary Shell Migration:** **PROHIBITED**  
**General HistoricalPlan Recovery UX:** **PROHIBITED**  
**Required Durable Output:** `PHASE_9_TASK_9_16_FIRST_CLASS_SLEEP_LEGACY_CONVERSION_PRODUCT_TRANSITION_V1_RESULT.md`

---

## 1. Objective

Complete the First-Class Sleep transition by providing an explicit, conservative, user-authorized path from eligible legacy Sleep Commitment configuration into the now-complete First-Class Sleep authority model.

Tasks 9.10–9.15 established the complete First-Class Sleep lifecycle:

```text
SleepRequirementV1
        ↓
effective authored requirement
        ↓
SleepOccurrenceV1
        ↓
joint bounded feasibility
        ↓
Sleep-qualified planning
        ↓
optional accepted corrective placement
        ↓
fresh publication
        ↓
immutable Published Sleep snapshot
        ↓
Today
        ↓
explicit actual execution
        ↓
correction / retraction
        ↓
historical query
```

Task 9.16 must now establish the explicit transition:

```text
Legacy Sleep Commitment
        ↓
user reviews proposed conversion
        ↓
explicit conversion command
        ↓
new First-Class SleepRequirement lifetime
        +
future legacy recurrence retirement
        +
conversion provenance
        ↓
no duplicate future Sleep ownership
        ↓
First-Class Sleep lifecycle continues normally
```

The governing rule is:

> **Legacy Sleep may become First-Class Sleep only through explicit, reviewable, atomic conversion.**

And equally:

> **Historical legacy truth remains legacy truth forever.**

Task 9.16 is not an inference task.

It is not a data-cleanup task.

It is not permission to reinterpret every Commitment named “Sleep.”

It is the bounded transition from one known semantic model to another.

---

## 2. Final First-Class Sleep Foundation Boundary

Task 9.16 is intended to be the final required First-Class Sleep foundation task before returning to broader DayFrame convergence work.

At completion, First-Class Sleep should have:

```text
architecture
authored authority
persistence
durable identity
derivation
joint feasibility
planning integration
Capacity integration
Goal-planning integration
Friction
Suggested Fix
accepted corrective placement
publication
Today
execution
history
legacy transition
```

Do not use Task 9.16 to expand Sleep beyond that boundary.

Specifically deferred beyond the First-Class Sleep foundation:

```text
split Sleep
naps as additional required Sleep objects
Sleep scoring
Sleep debt
Sleep recommendations
learned Sleep preferences
device ingestion
health integrations
automatic biological inference
one-off omission override
one-off shortening override
protection waiver
Goal Progress from Sleep
```

---

## 3. Canonical Transition Rule

Conversion must be:

```text
explicit
user-authorized
reviewable before mutation
atomic
idempotent
source-lifetime safe
history preserving
future-ownership safe
```

Conversion must never be:

```text
automatic
title-driven
category-driven
startup-driven
profile-load-driven
backup-restore-driven
Preview-driven
heuristic requiredness inference
historical rewrite
```

---

## 4. Critical Non-Inference Rule

The following are **not sufficient evidence** that a legacy object should become First-Class Sleep:

```text
id === "default_sleep"
title === "Sleep"
category === "sleep"
beforeWork placement
overnight duration
8-hour duration
high priority
recovery category
existing Sleep-specific UI copy
```

These facts may identify a **candidate for user review**.

They may not authorize conversion.

The architecture established in Task 9.10 remains controlling:

> Legacy category/title/default identity may identify candidate legacy Sleep content, but First-Class requiredness must not be inferred.

---

## 5. Candidate Discovery Is Not Conversion

Task 9.16 may implement a bounded query that discovers possible legacy Sleep candidates.

Candidate discovery is derived/read-only.

Conceptually:

```text
LegacySleepConversionCandidateV1
```

A candidate may include:

```text
legacy template identity
legacy recurrence identity
title
category
duration
placement mode
preferred window
buffers
recurrence summary
effective dates
resources / attachments
known ambiguous semantics
conversion compatibility
required user decisions
```

Candidate discovery must not:

```text
create SleepRequirementV1
retire recurrence
change legacy placement
change Preview
change Capacity
change publication
write conversion provenance
```

---

## 6. Candidate Discovery Scope

Audit the actual legacy Sleep representation before implementation.

Trace at minimum:

```text
BlockTemplate
BlockRecurrence
default_sleep
category sleep
beforeWork / afterWork
fixed / flexible placement
duration
priority
buffers
resources
attachments / composition
effective dates
weekdays
cycle behavior
profiles
backup
publication
execution
```

Do not assume the current legacy model matches old product terminology.

Record exact production representation in the RESULT.

---

## 7. Explicit Conversion Review

Before mutation, DayFrame must be able to present or query a deterministic conversion review.

The review must show:

```text
what legacy source will be converted
what future legacy recurrence will be retired
what new SleepRequirement will be authored
what semantics transfer exactly
what semantics cannot transfer automatically
what user decisions are required
what historical authority remains untouched
what future behavior changes after cutover
```

The review itself owns no authority.

---

## 8. Conversion Compatibility Classification

Classify candidate conversion readiness explicitly.

At minimum distinguish:

```text
convertible
requiresReview
unsupported
protected
alreadyConverted
```

Do not collapse ambiguous semantics into a guessed conversion.

Examples that may require explicit review:

```text
multiple recurrence rules
nonstandard duration
legacy priority
resources
attachments
composition
custom recurrence
cycle-specific behavior
multiple legacy Sleep templates
overlapping effective ranges
existing future accepted movement
existing legacy publication
existing legacy execution
```

Historical publication/execution alone must not make future conversion impossible, but it must be preserved.

---

## 9. Required User Decisions

Where legacy semantics cannot map exactly to `SleepRequirementV1`, require explicit conversion input.

Possible decisions include:

```text
required duration
clock vs beforeWork vs afterWork intent
clock window
relative span
off-day fallback
before buffer
after buffer
effective start / cutover
weekdays/applicability
preferred start
```

Do not invent missing values merely to make conversion convenient.

---

## 10. No Hidden Defaults That Create Requiredness

Existing product defaults may be used for UI suggestions only if clearly represented as suggestions.

They may not silently become persisted First-Class Sleep authority during conversion.

Especially do not infer:

```text
8 hours required
22:00–06:00
beforeWork
30-minute buffers
all weekdays
```

unless the legacy source or explicit user conversion input supports those values.

---

## 11. Conversion Cutover

Conversion must have an explicit prospective cutover.

Conceptually:

```text
cutoverOwnerDay
```

or repository-equivalent.

The cutover determines:

```text
before cutover
→ legacy semantics remain responsible

at/after cutover
→ First-Class Sleep becomes responsible
→ selected future legacy recurrence no longer creates duplicate Sleep ownership
```

Do not rewrite past dates merely because the current source is converted.

---

## 12. Cutover Uses Canonical User-Day Semantics

The conversion cutover must use canonical DayFrame user-day semantics rather than naive civil-midnight assumptions.

The cutover coordinate must remain deterministic across:

```text
Day Boundary
overnight Work
cycle transition
civil midnight
```

Do not use physical Sleep geometry as conversion identity.

---

## 13. Prospective Conversion Only

V1 conversion is prospective.

Do not retroactively convert already historical legacy occurrences.

If cutover is:

```text
2026-10-01
```

then legacy history before that cutover remains legacy.

Do not create First-Class historical snapshots for prior legacy Sleep.

Do not rewrite old execution subjects.

---

## 14. Atomic Conversion

The conversion command must atomically establish:

```text
new SleepRequirement lifetime
+
future legacy recurrence retirement
+
conversion provenance
```

If any required write fails:

```text
none of the conversion may become effective.
```

Do not permit:

```text
SleepRequirement created
but legacy recurrence still active
```

or:

```text
legacy recurrence retired
but no First-Class requirement exists
```

---

## 15. One Semantic Owner After Cutover

The central safety invariant is:

> **After a successful conversion cutover, the converted future Sleep obligation has one semantic owner.**

For the selected converted source:

```text
legacy future recurrence
XOR
First-Class SleepRequirement
```

must own the converted future obligation.

Not both.

---

## 16. Physical Coexistence Is Not Automatic Duplication

Do not globally prohibit legacy Sleep Commitments and First-Class Sleep from coexisting.

A user may intentionally have:

```text
First-Class required Sleep
+
another legacy Commitment categorized sleep
```

if they are semantically distinct.

The conversion invariant applies to the **specific selected legacy source being converted**, not every object with category `sleep`.

---

## 17. Legacy Retirement Semantics

Determine the narrowest lawful way to retire only the selected legacy source prospectively.

Prefer existing authored recurrence semantics.

Possible mechanisms may include:

```text
exclusive effective end
retired recurrence revision
future recurrence disablement from cutover
```

Do not delete historical source identity if doing so would damage history/provenance.

Do not globally disable unrelated recurrence.

---

## 18. Do Not Mutate Historical Legacy Truth

Conversion must not alter:

```text
HistoricalPlan legacy publications
legacy execution assertions
legacy corrections
legacy retractions
legacy Summary/history evidence
legacy durable occurrence references
past Preview evidence where disposable state happens to remain
```

Historical legacy truth remains interpretable under its original semantics.

---

## 19. Conversion Provenance

Implement explicit durable conversion provenance.

Conceptually:

```text
LegacySleepConversionV1
```

At minimum preserve:

```text
conversion version
conversion identity
legacy source identity
legacy source lifetime if one exists
legacy recurrence identity / selected future authority
new SleepRequirement ID
new SleepRequirement incarnation
cutover owner day
conversion timestamp
conversion command identity / idempotence identity
mapping summary or conversion fingerprint
explicit user decisions required for conversion
```

Use repository conventions rather than inventing unnecessary identifiers.

---

## 20. Provenance Ownership

Before creating a new persistence owner, audit whether conversion provenance belongs naturally in:

```text
Active authored aggregate
Sleep requirement lineage
legacy recurrence revision metadata
existing conversion/migration metadata
```

Prefer one semantic owner.

Do not create a standalone:

```text
sleep-conversions-v1
```

storage silo unless existing architecture makes that unavoidable.

Document the decision.

---

## 21. Conversion Provenance Is Authority Evidence

Conversion provenance explains:

```text
why the new First-Class source exists
which legacy future authority it replaced
when responsibility changed
```

It must not itself schedule Sleep.

It must not itself own physical time.

It must not replace `SleepRequirementV1`.

---

## 22. New First-Class Lifetime

Successful conversion creates a new First-Class Sleep source lifetime.

It must use normal First-Class Sleep identity semantics:

```text
SleepRequirement ID
incarnation
revision
timestamps
```

Do not reuse a legacy template ID/incarnation as though it were already a First-Class source lifetime.

A mapping may preserve provenance without collapsing identities.

---

## 23. Requirement Revision

The converted First-Class source begins through the canonical authored Sleep command semantics.

Do not bypass normal Sleep validation.

If conversion produces the first requirement:

```text
revision 1
new incarnation
```

according to existing Task 9.11 semantics.

If an active First-Class Sleep source already exists, do not silently create a second simultaneous primary requirement.

Classify and require review or reject according to the V1 one-primary-requirement rule.

---

## 24. Existing First-Class Sleep

Explicitly handle:

```text
no First-Class Sleep configured
First-Class Sleep disabled
First-Class Sleep currently effective
First-Class Sleep future-dated
First-Class Sleep source exists with revisions
```

Do not overwrite an existing source silently.

Candidate review must explain conflicts.

V1 may reject conversion where safe merging would require new architecture.

Prefer rejection/review to implicit merge.

---

## 25. Multiple Legacy Sleep Candidates

If multiple candidate legacy Sleep sources exist:

```text
do not automatically combine them.
```

The user must select the source being converted.

If multiple sources collectively express one intended Sleep pattern but cannot be represented faithfully as one V1 requirement:

```text
requiresReview
```

or:

```text
unsupported
```

Do not invent a merger algorithm.

---

## 26. Legacy Priority

First-Class Sleep has no numeric priority.

Therefore:

```text
legacy priority
```

must not be copied into First-Class Sleep authority.

Conversion review should explain that this legacy semantic does not transfer.

Do not use the priority value to determine requiredness.

---

## 27. Legacy Omit / Move Decisions

Legacy Sleep may have historical/current generic Commitment decisions.

Do not convert generic legacy:

```text
Omit
Move
priority adjustment
buffer reduction
```

into First-Class Sleep authority.

Task 9.10 explicitly rejected importing legacy omit/reduce/priority semantics.

Historical legacy decisions remain historical/legacy evidence.

Future accepted legacy movement must be handled conservatively at cutover.

---

## 28. Future Legacy Decisions

Audit whether a selected legacy recurrence has future accepted movement/correction authority.

Conversion must not leave future legacy accepted geometry capable of owning the same converted Sleep after cutover.

Possible lawful outcomes:

```text
conversion blocked pending review
explicit retirement/revocation as part of atomic conversion
unsupported in V1
```

Choose based on existing PlanDecision authority semantics.

Do not silently delete accepted evidence.

---

## 29. Existing Realized Legacy Facts

Already realized legacy schedule facts are immutable.

Conversion must not:

```text
delete them
reclassify them as First-Class Sleep
move them
rewrite their source identity
```

If realized legacy geometry exists after the proposed cutover because it is already authoritative, conversion must account for that authority.

It may require a later cutover or explicit review.

---

## 30. Existing Legacy Publication

Published legacy Sleep remains immutable.

Conversion must not mutate it.

If a proposed cutover intersects already published future legacy Sleep:

```text
do not create contradictory First-Class published truth.
```

Audit existing publication authority.

Possible lawful outcomes:

```text
cutover must occur after existing publication authority
conversion allowed but First-Class planning must respect immutable published seam
conversion blocked pending review
```

Implement the narrowest architecture-consistent behavior.

---

## 31. Existing Legacy Execution

Legacy execution remains attached to legacy publication/legacy execution subjects.

Do not retarget it to First-Class Sleep.

After conversion:

```text
old execution remains legacy evidence
new execution after First-Class publication uses First-Class subjects
```

History may therefore contain both generations.

That is correct.

---

## 32. Conversion and First-Class History

Conversion provenance itself does not fabricate First-Class history.

First-Class historical truth begins only when the converted requirement participates in normal future publication.

Do not create:

```text
PublishedSleepSnapshotV1
```

during conversion.

---

## 33. Conversion and Preview

After successful conversion, existing derived Preview may become stale.

Use the existing stale-derived-state policy.

Do not mutate Preview into a converted version in place.

Expected pattern:

```text
conversion writes authored authority
        ↓
existing derived state marked stale / invalidated
        ↓
explicit regeneration
```

according to current store conventions.

---

## 34. Conversion and Capacity

The conversion command itself must not calculate or persist Capacity.

After regeneration, the First-Class requirement naturally enters the existing:

```text
Sleep derivation
→ planning gate
→ Capacity
```

pipeline.

No special converted-Sleep Capacity path.

---

## 35. Conversion and Friction

The conversion command does not need to prove that the resulting future Sleep is feasible forever.

However, it must validate the authored requirement structurally.

After conversion, normal First-Class derivation may produce:

```text
satisfied
infeasible
searchIncomplete
contextIncomplete
```

and normal Sleep Friction rules apply.

Do not reject structurally valid conversion merely because a future bounded planning horizon later proves infeasible, unless current authoritative cutover geometry creates an immediate contradiction that conversion must account for.

---

## 36. Conversion and Publication Readiness

A successful conversion may invalidate current publication readiness because authored authority changed.

That is expected.

Do not preserve a stale “Ready to publish” result across conversion.

Existing fresh publication revalidation from Task 9.15 remains controlling.

---

## 37. Conversion and Today

Today continues to consume Published Plan truth.

Immediately after conversion:

```text
current First-Class authored requirement exists
```

does not mean:

```text
Today has First-Class published Sleep.
```

Until new publication:

```text
Today continues to show existing immutable Published Plan authority.
```

Do not substitute converted current planning into Today.

---

## 38. Conversion and Historical Query

Historical Sleep query must continue to distinguish:

```text
legacy Sleep historical evidence
First-Class Sleep historical evidence
```

Conversion provenance may support explanation, but must not merge those histories.

---

## 39. Conversion and Profiles

Profiles require special treatment because Task 9.11 established:

```text
profiles preserve portable authored Sleep intent
fresh lifetime on activation
```

Audit how converted legacy retirement and First-Class Sleep intent should project into profiles.

Required invariant:

> A saved profile after conversion must not reactivate the retired converted legacy recurrence alongside the portable First-Class Sleep requirement.

But:

> A profile saved before conversion must not be silently rewritten by converting the active setup.

Do not mutate unrelated saved profiles during active conversion.

---

## 40. Profile Save After Conversion

When saving a new profile from a converted active setup:

```text
portable First-Class Sleep intent
+
portable prospective legacy retirement state
```

must project consistently enough that loading the profile does not restore duplicate converted legacy Sleep ownership.

Use existing portable authored semantics.

Do not carry live conversion incarnation identities into the profile where profiles intentionally allocate fresh lifetimes.

---

## 41. Profile Load After Conversion

Loading a converted profile must:

```text
allocate fresh First-Class source lifetime
preserve portable conversion outcome
keep converted legacy future recurrence retired
avoid duplicate ownership
```

Historical conversion identity from another active lifetime must not be falsely reused as live authority if profiles intentionally create fresh lifetimes.

Document what conversion provenance is portable versus lifetime-specific.

---

## 42. Old Profiles

A profile created before Task 9.16 or before conversion may still contain legacy Sleep.

Loading it must not automatically convert it.

It should again surface as:

```text
legacy candidate
```

if candidate discovery identifies it.

Explicit conversion remains required.

---

## 43. Full Backup

Full backup must preserve active conversion authority/provenance exactly.

Unlike profiles, full backup is authority-preserving.

Required:

```text
legacy retirement
new SleepRequirement lifetime
conversion provenance
```

all survive backup/restore without allocating new identities.

---

## 44. Restore

Full restore must validate the conversion relationship.

Reject/protect malformed states such as:

```text
conversion says new SleepRequirement X
but X is absent
conversion references wrong incarnation
conversion references nonexistent legacy source
conversion cutover inconsistent with retirement
both converted future legacy recurrence and First-Class source active for same conversion relationship
unsupported conversion version
```

Do not silently repair malformed conversion authority.

---

## 45. Older Backups

Older valid backups without conversion provenance remain valid.

They must not gain inferred conversion.

Restoring old legacy Sleep yields legacy Sleep.

Candidate discovery may later surface it for explicit conversion.

---

## 46. Clear / Anti-Resurrection

Full clear must remove effective conversion authority through the existing canonical owners.

Test:

```text
legacy Sleep
→ convert
→ save state
→ clear
→ invoke retry/checkpoint paths
→ restart
```

Expected:

```text
no SleepRequirement resurrection
no retired recurrence resurrection
no conversion provenance resurrection
```

according to established full-clear semantics.

---

## 47. Startup Migration

Do not convert legacy Sleep during startup migration.

Schema migration may add an empty conversion-capable field/envelope if necessary.

It must not inspect:

```text
default_sleep
title
category
duration
```

and decide to create First-Class Sleep.

Startup migration remains structural, not semantic.

---

## 48. Persistence Versioning

Audit before choosing schema versions.

Task 9.15 retained:

```text
Active V3
Profiles V3
Backup V13
```

unless Task 9.14 changed them.

Task 9.16 may require successor versions if durable conversion/retirement semantics cannot be represented safely in current envelopes.

Do not pre-decide version numbers.

For every bump, document:

| Surface | Old Version | New Version | Reason | Migration | Older Reader Behavior | Unknown Future Version |
|---|---:|---:|---|---|---|---|

Do not bump publication/execution schemas merely because conversion exists.

---

## 49. Prefer Authored-Aggregate Ownership

Conversion changes authored future planning truth.

Therefore prefer representing the durable conversion relationship within the existing authored aggregate/versioned authored model where semantically appropriate.

Do not create a second authoritative active-state system.

---

## 50. Conversion Command

Implement one canonical conversion command.

Conceptually:

```text
convertLegacySleepToFirstClass(...)
```

or repository-equivalent.

Inputs should include enough information to establish:

```text
selected legacy source
selected recurrence / future authority
expected source lifetime/revision where applicable
explicit cutover
explicit SleepRequirement intent
expected current Sleep state
conversion review fingerprint / expected conversion state
idempotence identity if existing command architecture requires it
```

Do not expose a low-level sequence of independent writes as the canonical product command.

---

## 51. Command Revalidation

Immediately before mutation, revalidate:

```text
legacy source still exists
legacy recurrence still matches reviewed authority
cutover still lawful
no conflicting First-Class Sleep appeared
future legacy decisions/publication/realization state still compatible
review fingerprint still current
conversion not already applied
```

If stale:

```text
reject/reviewRequired
```

Do not apply an old review to changed authority.

---

## 52. Idempotence

Repeating the same successful conversion command must not create:

```text
second SleepRequirement
second incarnation
second retirement
second conversion record
```

Return existing success/no-op according to repository conventions.

A materially different conversion request must not masquerade as the same conversion.

---

## 53. Source-Lifetime Safety

If legacy source identity supports incarnation/lifetime semantics, conversion must be lifetime-safe.

A stale conversion request for deleted/recreated legacy source must not convert the new source accidentally.

If legacy sources lack incarnation semantics, document the strongest available stale-command protection and do not invent false guarantees.

---

## 54. Conversion Fingerprint

The conversion review/command should carry a deterministic fingerprint or equivalent stale-review token over the authority that materially affects conversion.

At minimum consider:

```text
legacy source
legacy recurrence
future retirement state
cutover
explicit mapped Sleep intent
existing First-Class Sleep state
future accepted legacy decisions
relevant already-realized/published authority
```

Do not include irrelevant UI presentation.

---

## 55. Product Reachability

Task 9.16 must make explicit conversion reachable through the ordinary product.

Do not require:

```text
developer console
manual JSON editing
test-only command
direct IndexedDB manipulation
```

At minimum provide a bounded ordinary-user path to:

```text
discover candidate
review conversion
supply required missing semantics
confirm conversion
observe successful transition
```

This is a transition surface, not the final Planner redesign.

---

## 56. Product Placement

Use the current product architecture.

Do not perform Planner/Summary shell migration.

Place the bounded conversion entry where legacy Sleep configuration is currently reachable or where authored Sleep setup currently belongs.

Prefer contextual presentation such as:

```text
“Convert legacy Sleep setup”
```

rather than introducing a new primary navigation destination.

---

## 57. Product Copy

User-facing copy must avoid architecture language where unnecessary.

Prefer:

```text
“Your existing Sleep schedule uses DayFrame’s older scheduling model.”

“Review it before converting to required Sleep.”

“Past Sleep history will not be changed.”

“From [date], this Sleep schedule will use DayFrame’s required Sleep planning.”
```

Avoid ordinary-user copy such as:

```text
SleepRequirementV1
incarnation
semantic owner
authority cutover
legacy recurrence retirement
```

unless surfaced in diagnostics/developer views.

---

## 58. Explicit Confirmation

The final mutation must require an explicit user confirmation action.

Do not convert on:

```text
opening review
changing a field
blur
navigation
Preview generation
profile load
startup
```

The confirmation should communicate at least:

```text
future behavior changes
past history stays unchanged
the selected old Sleep schedule stops generating future occurrences from cutover
First-Class required Sleep begins from cutover
```

---

## 59. No Destructive “Undo” Shortcut

Do not implement conversion undo by deleting historical evidence.

If post-conversion product behavior needs reversal, normal authored controls may prospectively:

```text
disable/edit First-Class Sleep
```

but must not pretend conversion never happened.

A formal reverse-conversion command is outside V1 unless existing architecture requires one for correctness.

---

## 60. Conversion Provenance After Later Edits

After conversion, the user may edit the First-Class Sleep requirement normally.

Conversion provenance remains historical lineage:

```text
this source originated from legacy source X at cutover Y
```

It does not force future revisions to retain original mapped values.

---

## 61. Conversion Provenance After Delete/Recreate

If the converted First-Class source is later deleted and recreated:

```text
the original conversion provenance must not falsely attach to the new incarnation.
```

Preserve lineage of the original converted lifetime without granting authority to the new source.

---

## 62. Conversion and Accepted First-Class Placement

Conversion itself must not fabricate an Accepted Sleep placement.

After conversion:

```text
First-Class Sleep solver
```

chooses geometry normally.

If correction is needed later:

```text
Task 9.14 accepted-placement path
```

applies.

Do not translate legacy preferred/moved geometry into a pin unless the user separately accepts a lawful First-Class correction.

---

## 63. Conversion and Omission

Conversion must not translate a legacy omitted occurrence into:

```text
First-Class omission
disabled one-off Sleep
shortened requirement
```

V1 has no such authority.

If legacy future omission semantics cannot coexist with conversion:

```text
requiresReview
```

or block conversion until resolved.

---

## 64. Conversion and Buffers

Legacy buffers may map only when their semantics are equivalent to First-Class:

```text
beforeBufferMinutes
afterBufferMinutes
```

If legacy buffer semantics differ or are ambiguous:

```text
require explicit user decision.
```

Do not silently weaken protection.

---

## 65. Conversion and Work-Relative Sleep

For a legacy `beforeWork`/`afterWork` candidate:

```text
do not merely copy the label.
```

Validate that the explicit conversion intent satisfies First-Class requirements:

```text
relative span
off-day fallback
duration
buffers
preferred semantics
```

Missing First-Class-required information must be supplied explicitly.

---

## 66. Conversion and Clock Sleep

For a legacy clock-window candidate, preserve only semantics actually represented by legacy authority.

If the old model contains only:

```text
preferred start
duration
```

but not a required legal window:

```text
do not invent a First-Class window.
```

Require explicit review/input.

---

## 67. Conversion and Recurrence

Legacy recurrence and First-Class applicability are not automatically identical abstractions.

Audit mapping for:

```text
daily
weekly
specificWeekdays
timesPerUserWeek
custom
perShiftSegment
```

Only convert recurrence semantics that can be represented faithfully as First-Class applicability.

Unsupported recurrence must not be approximated.

---

## 68. `timesPerUserWeek`

If a legacy Sleep candidate uses:

```text
timesPerUserWeek
```

do not convert it into required Sleep on arbitrary days.

This likely cannot represent one required occurrence per applicable owner day without explicit reinterpretation.

Classify conservatively.

---

## 69. Custom / Per-Shift Recurrence

If current legacy Sleep uses unsupported or differently modeled recurrence such as:

```text
custom
perShiftSegment
```

do not invent conversion semantics.

Return:

```text
requiresReview
```

or:

```text
unsupported
```

with evidence.

---

## 70. Existing Default Seed

Audit current default/demo seed.

Do not automatically convert seed legacy Sleep merely because it is `default_sleep`.

If fresh installations should now author First-Class Sleep directly, that is a separate product-default decision unless already governed by accepted architecture.

Task 9.16 should not silently change default product semantics without evidence.

Record the current seed behavior.

---

## 71. Legacy Candidate Labels

Candidate discovery may use category/title/default identity to help locate likely Sleep content.

But the RESULT must distinguish:

```text
candidate discovery heuristic
```

from:

```text
conversion authority
```

This distinction is mandatory.

---

## 72. Conversion Safety With Derived State

Before/after conversion, verify:

```text
Preview
planning review
Capacity
Goal feasibility
Proposal
publication readiness
```

do not retain stale pre-conversion authority as current truth.

Use existing stale/invalidation mechanisms.

Do not manually patch each derived result.

---

## 73. Conversion Safety With Accepted Allocations

Existing accepted Goal allocations remain evidence.

Conversion must not silently cancel them.

After conversion, the existing Task 9.13 freshness/revalidation rules apply:

```text
if converted Sleep conflicts with unrealized accepted intent
→ reviewRequired / realization rejection as already defined
```

Do not special-case cancellation.

---

## 74. Conversion Safety With Realized Goal Facts

Existing realized Goal/support/protected facts remain hard occupancy.

Conversion does not move/delete them.

The newly converted Sleep may later derive as infeasible around those facts.

That is lawful evidence of incompatibility.

---

## 75. Conversion Safety With Manual Events

Manual fixed Events remain hard physical authority.

Conversion does not move them.

The resulting First-Class Sleep requirement enters the normal solver afterward.

---

## 76. Conversion Safety With Work

Work remains foundational fixed authority.

Conversion does not change Work.

First-Class Work-relative semantics begin only through the converted requirement and normal Sleep derivation.

---

## 77. Historical Boundary

The product must make this distinction observable:

```text
Before cutover:
legacy Sleep schedule/history

After cutover:
First-Class required Sleep planning
```

Do not pretend the entire timeline was always First-Class Sleep.

---

## 78. Historical Query Transition

Where the existing Sleep history surface can safely do so, preserve the ability to show both generations across the cutover.

For example:

```text
Sep 28 — legacy Sleep Commitment
Sep 29 — legacy Sleep Commitment
Sep 30 — legacy Sleep Commitment
Oct 01 — First-Class Published Sleep
Oct 02 — First-Class Published Sleep
```

Do not redesign the history UI solely to make this prettier.

Correct semantic distinction is the requirement.

---

## 79. Required Pre-Implementation Audit

Before editing, trace:

### First-Class Sleep

```text
SleepRequirementV1
SleepRequirementPatternV1
SleepRequirementIntentV1
Sleep occurrence reference
author/update/disable/delete
Active V3
Profiles V3
Backup V13
Sleep solver
planning integration
corrective authority
publication
execution
history
```

### Legacy Sleep

```text
BlockTemplate
BlockRecurrence
default_sleep
category sleep
legacy Sleep-specific placement logic
recurrence expansion
profiles
backup
publication
execution
```

### Authored mutation

```text
active aggregate writer
transaction gate
revision semantics
profile projection
restore composition
clear
anti-resurrection
```

### PlanDecision / Realization / Publication

Trace future legacy authority that could survive cutover.

### UI

Trace current authored Sleep/Commitment configuration surfaces.

Record actual symbols/files and findings in RESULT.

---

## 80. Required Conversion Tests — Candidate Discovery

At minimum:

### No legacy Sleep

```text
→ no candidate
```

### `default_sleep`

```text
→ candidate may be discovered
→ no conversion write
```

### title “Sleep”

```text
→ candidate may be discovered
→ no conversion write
```

### category `sleep`

```text
→ candidate may be discovered
→ no conversion write
```

### unrelated recovery Commitment

```text
→ not falsely converted
```

### multiple candidates

```text
→ independently identified
→ no automatic merge
```

---

## 81. Required Conversion Tests — Explicit Authority

Prove:

```text
candidate discovery
```

does not mutate.

Prove:

```text
review
```

does not mutate.

Prove:

```text
explicit confirmed conversion
```

is required before any authored authority changes.

---

## 82. Required Conversion Tests — Exact Mapping

For faithfully representable legacy semantics, prove exact transfer of supported values.

At minimum test:

```text
duration
buffers
effective dates
weekdays
clock intent where complete
beforeWork intent where complete
afterWork intent where complete
off-day fallback
preferred start where semantically valid
```

---

## 83. Required Conversion Tests — Ambiguity

At minimum test candidates with:

```text
missing legal window
missing relative span
missing off-day fallback
ambiguous recurrence
resources
attachments/composition
multiple future recurrences
existing active First-Class Sleep
```

Expected:

```text
requiresReview
```

or:

```text
unsupported
```

not guessed conversion.

---

## 84. Required Conversion Tests — Atomicity

Inject failure:

```text
before SleepRequirement write
after SleepRequirement staging
during legacy retirement
during conversion provenance persistence
during transaction commit
```

Expected:

```text
no partial conversion authority.
```

Use actual repository transaction semantics.

---

## 85. Required Conversion Tests — Idempotence

Run identical confirmed conversion twice.

Expected:

```text
one First-Class source lifetime
one retirement
one conversion relationship
```

No duplicate incarnation.

Then change material input and prove stale/idempotence mismatch is rejected.

---

## 86. Required Conversion Tests — Cutover

At minimum:

```text
day before cutover
cutover day
day after cutover
```

Prove:

```text
legacy future generation stops at cutover
First-Class applicability begins at cutover
no duplicate converted ownership
```

Use canonical user-day semantics.

---

## 87. Required Conversion Tests — Day Boundary

Test cutover under at least:

```text
00:00
03:00
12:00
```

and prove owner-day transition is stable.

---

## 88. Required Conversion Tests — Shift Transitions

At minimum:

```text
Day → Evening
Evening → Night
Night → Day
Work → Off
Off → Work
```

Conversion cutover must not change identity based on physical Sleep geometry.

---

## 89. Required Conversion Tests — Historical Preservation

Create legacy:

```text
publication
execution
correction
retraction
```

before cutover.

Convert.

Expected:

```text
all legacy historical evidence byte/semantically unchanged.
```

No First-Class rewrite.

---

## 90. Required Conversion Tests — Future Publication

After conversion:

```text
regenerate
resolve First-Class Sleep
publish
```

Expected:

```text
new publication uses PublishedSleepSnapshot
old publication remains legacy
```

No merged historical identity.

---

## 91. Required Conversion Tests — Existing Published Future Legacy Sleep

Create future legacy publication intersecting proposed cutover.

Prove the implemented policy:

```text
block
review
or lawful seam-safe later cutover
```

without rewriting immutable publication.

Document exact policy.

---

## 92. Required Conversion Tests — Existing Realized Legacy Facts

Create authoritative realized legacy geometry after proposed cutover.

Conversion must not delete/move/reclassify it.

Prove chosen safe policy.

---

## 93. Required Conversion Tests — Legacy Decisions

Create future legacy Move/Omit/etc. decision.

Prove conversion does not silently translate it into First-Class pin/omission.

Prove chosen review/block/retirement behavior.

---

## 94. Required Conversion Tests — Existing First-Class Sleep

Test:

```text
effective active source
disabled source
future-dated source
existing revisions
```

Conversion must not silently overwrite/merge.

---

## 95. Required Conversion Tests — Profiles

### Profile before conversion

```text
save legacy profile
convert active setup
load old profile
```

Expected:

```text
legacy candidate returns
no automatic conversion
```

### Profile after conversion

```text
convert
save new profile
load profile
```

Expected:

```text
fresh First-Class lifetime
converted legacy future recurrence remains retired
no duplicate ownership
```

---

## 96. Required Conversion Tests — Backup / Restore

```text
convert
publish First-Class Sleep
record execution
backup
clear
restore
restart
```

Expected:

```text
conversion provenance preserved
First-Class lifetime preserved
legacy retirement preserved
historical legacy evidence preserved
First-Class publication preserved
First-Class execution preserved
no duplicate future ownership
```

---

## 97. Required Conversion Tests — Malformed Restore

Reject/protect:

```text
missing converted requirement
wrong requirement incarnation
missing legacy source
retirement/cutover mismatch
duplicate future ownership
unknown conversion version
broken conversion fingerprint
```

Do not repair silently.

---

## 98. Required Conversion Tests — Clear

```text
convert
clear
invoke retry paths
restart
```

Expected no resurrection.

---

## 99. Required Conversion Tests — Stale Review

Generate review.

Then change:

```text
legacy recurrence
cutover-relevant future decision
existing First-Class source
legacy source lifetime
published future authority
```

Attempt old conversion.

Expected:

```text
rejected / reviewRequired
```

with zero partial mutation.

---

## 100. Required Conversion Tests — Derived-State Freshness

After successful conversion, prove stale derived state cannot retain current authority:

```text
Preview
planning review
Capacity
Goal feasibility
Proposal
publication readiness
```

must be invalidated/recomputed through existing semantics.

---

## 101. Required Conversion Tests — Non-Activation

Prove conversion does not:

```text
create accepted Sleep pin
create publication
create execution
create Goal Progress
create recommendation
create Sleep score
create learned preference
create one-off override
convert unrelated legacy Sleep
rewrite old history
```

---

## 102. Conversion Eligibility Matrix

Include in RESULT:

| Legacy Candidate State | Conversion Status | User Review Required? | May Convert? | Reason |
|---|---|---:|---:|---|
| no candidate | | | | |
| simple complete clock Sleep | | | | |
| complete beforeWork Sleep | | | | |
| complete afterWork Sleep | | | | |
| missing required window semantics | | | | |
| missing off-day fallback | | | | |
| ambiguous recurrence | | | | |
| multiple candidate sources | | | | |
| active First-Class Sleep exists | | | | |
| future legacy accepted decision | | | | |
| future realized legacy fact | | | | |
| future published legacy Sleep | | | | |
| malformed/protected authored authority | | | | |
| already converted | | | | |

Populate with actual implemented semantics.

---

## 103. Semantic Mapping Matrix

Include:

| Legacy Semantic | First-Class Equivalent | Automatic Mapping Allowed? | Explicit Review Needed? | Notes |
|---|---|---:|---:|---|
| title | | | | |
| category | | | | |
| duration | | | | |
| priority | | | | |
| preferred window | | | | |
| fixed clock | | | | |
| beforeWork | | | | |
| afterWork | | | | |
| buffers | | | | |
| recurrence | | | | |
| weekdays | | | | |
| effective dates | | | | |
| resources | | | | |
| attachments | | | | |
| accepted Move | | | | |
| accepted Omit | | | | |
| publication | | | | |
| execution | | | | |

---

## 104. Cutover Authority Matrix

Include:

| Authority | Before Cutover | At/After Cutover | Mutated by Conversion? | Historical Identity Preserved? |
|---|---|---|---:|---:|
| selected legacy recurrence | | | | |
| legacy historical publication | | | | |
| legacy execution | | | | |
| legacy PlanDecision | | | | |
| legacy realized fact | | | | |
| new SleepRequirement | | | | |
| First-Class solver output | | | | |
| First-Class publication | | | | |
| First-Class execution | | | | |
| conversion provenance | | | | |

---

## 105. Persistence Matrix

Include:

| Surface | Legacy Source | Retirement | First-Class Requirement | Conversion Provenance | Historical Legacy | First-Class History |
|---|---:|---:|---:|---:|---:|---:|
| Active | | | | | | |
| PlanDecision | | | | | | |
| Profile | | | | | | |
| HistoricalPlan | | | | | | |
| Execution | | | | | | |
| Full Backup | | | | | | |
| Restore | | | | | | |
| Clear | | | | | | |

---

## 106. Product Reachability Matrix

Include:

| Product Step | Reachable? | Writes Authority? | Required Input | Failure / Review State |
|---|---:|---:|---|---|
| discover candidate | | | | |
| open review | | | | |
| inspect legacy semantics | | | | |
| supply missing First-Class semantics | | | | |
| choose cutover | | | | |
| confirm conversion | | | | |
| observe converted setup | | | | |
| regenerate planning | | | | |
| publish First-Class Sleep | | | | |

---

## 107. Lifecycle Transition Matrix

Include:

| Stage | Semantic Owner | Authority Class | Historical or Current? | May Conversion Rewrite It? |
|---|---|---|---|---:|
| legacy authored recurrence | | | | |
| legacy generated occurrence | | | | |
| legacy publication | | | | |
| legacy execution | | | | |
| conversion review | | | | |
| conversion provenance | | | | |
| First-Class requirement | | | | |
| First-Class derived occurrence | | | | |
| First-Class publication | | | | |
| First-Class execution | | | | |

---

## 108. Required Behavioral Invariants

Task 9.16 must establish and test at least:

1. Legacy Sleep is never automatically promoted.
2. `default_sleep` does not authorize conversion.
3. title `Sleep` does not authorize conversion.
4. category `sleep` does not authorize conversion.
5. candidate discovery is read-only.
6. conversion review is read-only.
7. conversion requires explicit confirmation.
8. conversion requires explicit First-Class semantics where legacy semantics are insufficient.
9. conversion does not invent required duration.
10. conversion does not invent legal window.
11. conversion does not invent off-day fallback.
12. conversion does not invent buffers.
13. conversion does not infer requiredness from priority.
14. conversion does not copy legacy priority into First-Class Sleep.
15. conversion does not translate legacy Omit into First-Class omission.
16. conversion does not translate legacy Move into accepted First-Class pin automatically.
17. conversion does not translate legacy buffer reduction into First-Class protection weakening.
18. conversion is prospective.
19. cutover uses canonical owner-day semantics.
20. historical legacy occurrences are not converted.
21. historical legacy publication is immutable.
22. historical legacy execution is immutable.
23. historical legacy correction/retraction remains legacy.
24. conversion creates a new First-Class source lifetime.
25. legacy identity is not reused as First-Class identity.
26. conversion provenance links the two lifetimes without collapsing them.
27. conversion provenance does not own physical time.
28. conversion provenance does not schedule Sleep.
29. conversion is atomic.
30. partial requirement-only conversion cannot persist.
31. partial retirement-only conversion cannot persist.
32. conversion is idempotent.
33. repeated identical conversion does not create a second source.
34. stale conversion review cannot mutate changed authority.
35. deleted/recreated legacy source cannot be converted by stale request.
36. one converted future obligation has one semantic owner after cutover.
37. selected legacy recurrence no longer generates converted future ownership after cutover.
38. First-Class requirement begins according to explicit cutover.
39. unrelated legacy Sleep may coexist.
40. multiple candidates are not automatically merged.
41. active First-Class Sleep is not silently overwritten.
42. future-dated First-Class Sleep is not silently overwritten.
43. ambiguous merge is rejected/reviewed.
44. already-realized legacy facts are not deleted.
45. already-realized legacy facts are not reclassified.
46. future immutable legacy publication is not rewritten.
47. conversion accounts for future published legacy authority.
48. future accepted legacy decisions are not silently discarded.
49. future legacy Omit does not become First-Class omission.
50. future legacy Move does not become First-Class pin.
51. conversion itself creates no Accepted Sleep placement.
52. conversion itself creates no publication.
53. conversion itself creates no execution.
54. conversion itself creates no Progress.
55. conversion itself creates no recommendation.
56. conversion itself creates no learned preference.
57. conversion itself creates no health inference.
58. conversion itself creates no one-off override.
59. converted requirement enters the existing solver normally.
60. converted requirement enters existing Capacity integration normally.
61. converted requirement enters existing Goal planning normally.
62. converted requirement enters existing Friction normally.
63. converted requirement enters existing publication normally.
64. converted requirement enters existing execution/history normally.
65. conversion does not create a parallel planning path.
66. conversion invalidates stale derived state through existing semantics.
67. stale publication readiness cannot survive conversion.
68. Today continues to consume Published Plan truth.
69. conversion does not make unpublished Sleep appear as Today planned truth.
70. old profiles are not silently converted.
71. active conversion does not rewrite unrelated saved profiles.
72. profile saved after conversion does not restore duplicate converted legacy ownership.
73. converted profile activation creates fresh First-Class lifetime.
74. profile activation does not reuse live conversion incarnation incorrectly.
75. full backup preserves conversion authority.
76. full restore preserves First-Class lifetime identity.
77. full restore preserves legacy retirement.
78. full restore preserves conversion provenance.
79. full restore preserves legacy history.
80. full restore preserves First-Class history.
81. malformed conversion authority fails safely.
82. missing converted requirement is not treated as successful conversion.
83. retirement/cutover mismatch fails safely.
84. duplicate converted future ownership fails safely.
85. unknown conversion version fails safely.
86. older backups without conversion remain valid.
87. older backups do not gain inferred conversion.
88. startup migration does not convert legacy Sleep.
89. structural schema migration does not infer requiredness.
90. clear removes conversion authority according to existing semantics.
91. clear does not allow requirement resurrection.
92. clear does not allow retired recurrence resurrection.
93. conversion history remains lineage after later First-Class edits.
94. deleting/recreating First-Class Sleep does not transfer old conversion authority to new incarnation.
95. legacy and First-Class historical identities remain distinct across cutover.
96. historical query may show both generations without merging them.
97. candidate-discovery heuristics are distinct from conversion authority.
98. conversion preserves deterministic behavior.
99. conversion adds no second persistence owner unless unavoidable and explicitly justified.
100. Task 9.16 completes legacy transition without reopening First-Class Sleep architecture.

---

## 109. Bundle Architecture Gate

Task 9.15 ended at:

```text
Initial gzip:       166,310 bytes
Hard limit:         170,000 bytes
Hard headroom:        3,690 bytes
Initial raw:        638,276 bytes
Largest lazy chunk:  53,183 bytes
Total emitted:    1,101,789 bytes
```

The hard limit remains unchanged.

Task 9.16 must not:

```text
raise
relax
bypass
reinterpret
remove
```

the 170,000-byte initial gzip gate.

Candidate discovery/review/conversion UI is likely not startup-critical.

Prefer:

```text
lazy conversion review surface
lazy conversion analysis
type-only imports
shared existing validators
shared authored mutation infrastructure
```

Do not duplicate the Sleep solver or historical machinery into the startup graph.

If implementation cannot remain under the hard limit without weakening architecture:

```text
Task 9.16 is INCOMPLETE.
```

Do not raise the threshold.

---

## 110. Bundle Evidence

Record:

```text
Task 9.15 baseline initial gzip
Task 9.16 final initial gzip
delta
hard limit
remaining hard headroom
initial raw
largest lazy chunk
total emitted output
advisory warnings
```

Explain any import-boundary changes.

---

## 111. Performance Assessment

Measure representative:

```text
candidate discovery
conversion review
confirmed conversion
profile save/load after conversion
backup validation/restore with conversion
```

Also measure planning regeneration after conversion for a representative setup to ensure no pathological duplicate expansion was introduced.

Performance is observational.

Do not add semantic wall-clock timeouts.

---

## 112. Architecture Governance

Task 9.10 already specifies conservative explicit conversion and `LegacySleepConversionV1`.

Do not create a new ADR merely to restate:

```text
explicit conversion
no inferred requiredness
prospective cutover
history preservation
```

Amend governance only if implementation reveals a genuinely unresolved normative authority question.

If a persisted authored schema advances, update required schema documentation without pretending the schema bump itself is a new architectural decision.

---

## 113. Prohibited Changes

Do **not**:

- redesign First-Class Sleep;
- create `SleepRequirementV2`;
- change durable Sleep occurrence identity;
- change the Task 9.12 solver semantics;
- change Task 9.13 planning precedence;
- weaken Task 9.14 corrective authority;
- create Sleep omission;
- create Sleep shortening;
- create buffer waiver;
- create a generic Sleep override;
- change Task 9.15 planned-vs-actual semantics;
- rewrite Published Sleep;
- rewrite legacy publication;
- rewrite legacy execution;
- infer conversion from `default_sleep`;
- infer conversion from title;
- infer conversion from category;
- infer conversion from priority;
- infer conversion from duration;
- automatically convert on startup;
- automatically convert on profile load;
- automatically convert on restore;
- automatically convert during Preview generation;
- automatically convert during publication;
- merge multiple legacy Sleep sources heuristically;
- copy legacy priority into First-Class Sleep;
- translate legacy Omit into First-Class authority;
- translate legacy Move into First-Class accepted placement;
- delete immutable realized facts;
- delete immutable publication;
- retarget historical execution;
- create First-Class history during conversion;
- create First-Class execution during conversion;
- create First-Class accepted placement during conversion;
- create Goal Progress from Sleep;
- add Sleep scoring;
- add Sleep recommendations;
- add learned Sleep behavior;
- add device integrations;
- add medical/health semantics;
- implement split Sleep/naps;
- perform Planner/Summary shell migration;
- redesign Summary;
- redesign Today;
- implement general HistoricalPlan recovery UX;
- create a new Sleep persistence silo without necessity;
- weaken protection behavior;
- weaken restore validation;
- weaken clear/anti-resurrection;
- weaken bundle thresholds;
- add dependencies unless necessary and explicitly justified;
- commit;
- push.

---

## 114. Validation

Run repository-standard validation.

At minimum:

```text
npm run format
npx prettier --check .
npm run lint
npm run build
npm test
npm run check:bundle
git diff --check
```

Run focused suites covering:

```text
legacy BlockTemplate / recurrence
default Sleep seed
First-Class Sleep domain
Sleep persistence
profiles
backup
restore
clear
candidate discovery
conversion review
conversion command
atomic conversion
idempotence
stale review
cutover
Day Boundary
shift/cycle transitions
PlanDecision
realized facts
publication
execution
historical query
planning integration
Capacity
Goal feasibility
Friction
Today
legacy / First-Class coexistence
bundle lazy boundary
```

Record exact commands and exact results.

Do not claim commands that were not run.

---

## 115. Repository Hygiene

Before implementation:

1. inspect `git status`;
2. record HEAD;
3. record all pre-existing dirty files;
4. preserve Tasks 9.9–9.15 work;
5. capture a baseline sufficient to distinguish Task 9.16 changes;
6. record baseline bundle metrics.

After implementation:

1. inspect `git status`;
2. inspect `git diff --stat`;
3. inspect relevant diffs;
4. compare against baseline;
5. run `git diff --check`;
6. distinguish pre-existing modifications from Task 9.16 additions;
7. account for every Task 9.16 file;
8. do not commit;
9. do not push.

---

## 116. Required RESULT Artifact

Create exactly one durable task-result artifact:

```text
PHASE_9_TASK_9_16_FIRST_CLASS_SLEEP_LEGACY_CONVERSION_PRODUCT_TRANSITION_V1_RESULT.md
```

Place it in the existing Phase 9 durable RESULT folder.

The filename must contain:

```text
RESULT
```

No additional task report is authorized.

Governance artifacts are permitted only if Section 112 requires them.

---

## 117. Required RESULT Structure

The RESULT must contain these sections in this exact order:

```text
# Task 9.16 — First-Class Sleep Legacy Conversion & Product Transition V1 RESULT

## 1. Executive Summary
## 2. Scope and Governing Architecture
## 3. Pre-Implementation Repository State
## 4. Legacy Sleep Production Representation Audit
## 5. First-Class Sleep Authority Consumed
## 6. Candidate Discovery Model
## 7. Candidate Discovery Heuristics Versus Conversion Authority
## 8. Conversion Compatibility Classification
## 9. Conversion Review Model
## 10. Required Explicit User Decisions
## 11. Conversion Cutover Semantics
## 12. Canonical User-Day Cutover
## 13. Prospective-Only Conversion
## 14. Conversion Command
## 15. Command Revalidation
## 16. Conversion Idempotence
## 17. Source-Lifetime Safety
## 18. Conversion Fingerprint / Stale Review Protection
## 19. Atomic Conversion
## 20. Legacy Retirement Semantics
## 21. New First-Class Source Lifetime
## 22. Conversion Provenance
## 23. Conversion Provenance Ownership
## 24. One-Semantic-Owner Invariant
## 25. Existing First-Class Sleep Handling
## 26. Multiple Legacy Candidate Handling
## 27. Legacy Priority Handling
## 28. Legacy Move / Omit / Corrective Authority Handling
## 29. Existing Realized Legacy Fact Handling
## 30. Existing Future Legacy Publication Handling
## 31. Existing Legacy Execution Handling
## 32. Clock-Sleep Mapping
## 33. Work-Relative Sleep Mapping
## 34. Buffer Mapping
## 35. Recurrence / Applicability Mapping
## 36. Unsupported / Ambiguous Legacy Semantics
## 37. Derived-State Invalidation
## 38. Capacity / Goal / Proposal Post-Conversion Behavior
## 39. Friction / Corrective Authority Post-Conversion Behavior
## 40. Publication Post-Conversion Behavior
## 41. Today Post-Conversion Behavior
## 42. Historical Query Transition
## 43. Profile Semantics
## 44. Profile Save After Conversion
## 45. Profile Load After Conversion
## 46. Old Profile Behavior
## 47. Backup Semantics
## 48. Restore Semantics
## 49. Older Backup Compatibility
## 50. Clear / Anti-Resurrection
## 51. Startup Migration / Non-Inference
## 52. Persistence Ownership
## 53. Schema Evolution
## 54. Product Reachability
## 55. Product Placement / Copy / Confirmation
## 56. Conversion Eligibility Matrix
## 57. Semantic Mapping Matrix
## 58. Cutover Authority Matrix
## 59. Persistence Matrix
## 60. Product Reachability Matrix
## 61. Lifecycle Transition Matrix
## 62. Behavioral Invariants
## 63. Candidate Discovery Coverage
## 64. Explicit Authority / Confirmation Coverage
## 65. Exact Mapping Coverage
## 66. Ambiguity / Unsupported Coverage
## 67. Atomicity Coverage
## 68. Idempotence Coverage
## 69. Cutover Coverage
## 70. Day Boundary / Shift Transition Coverage
## 71. Historical Preservation Coverage
## 72. Future Publication / Realization / Decision Coverage
## 73. Existing First-Class Sleep Coverage
## 74. Profile Coverage
## 75. Backup / Restore Coverage
## 76. Malformed Authority / Protection Coverage
## 77. Clear / Anti-Resurrection Coverage
## 78. Stale Review Coverage
## 79. Derived-State Freshness Coverage
## 80. Legacy / First-Class Coexistence Coverage
## 81. Non-Activation Coverage
## 82. Determinism / Non-Mutation Coverage
## 83. Performance Assessment
## 84. Bundle Architecture Assessment
## 85. Architecture Governance Assessment
## 86. Test Coverage
## 87. Validation Record
## 88. Changed Files
## 89. Deferred Work
## 90. First-Class Sleep Foundation Completion Assessment
## 91. Completion Assessment
```

---

## 118. Changed-Files Accounting

List every Task 9.16 changed file.

Classify each as:

```text
Legacy Candidate Discovery
Conversion Review
Conversion Command
Conversion Provenance
Legacy Retirement
First-Class Sleep
Active Persistence
Profile
Backup
Restore
Clear
Migration
PlanDecision
Publication Safety
Historical Safety
Derived-State Freshness
Product UI
UI Copy
Lazy / Bundle Architecture
Schema / Validation
Governance
Test
RESULT
```

For every file record:

```text
purpose
semantic change
authority impact
persistence impact
schema/version impact
associated tests
```

For already-dirty files distinguish:

```text
pre-existing modification
```

from:

```text
Task 9.16 additional modification
```

---

## 119. Completion Criteria

Task 9.16 is complete only if all applicable criteria pass.

### Candidate Discovery

- [ ] legacy candidate discovery exists.
- [ ] discovery is read-only.
- [ ] `default_sleep` does not authorize conversion.
- [ ] title `Sleep` does not authorize conversion.
- [ ] category `sleep` does not authorize conversion.
- [ ] multiple candidates remain distinct.
- [ ] ambiguous candidates are classified explicitly.

### Review

- [ ] deterministic conversion review exists.
- [ ] review identifies exact legacy source.
- [ ] review identifies exact future authority to retire.
- [ ] review identifies proposed First-Class requirement.
- [ ] unsupported semantics are explicit.
- [ ] required user decisions are explicit.
- [ ] review communicates historical preservation.
- [ ] review is non-mutating.

### Conversion

- [ ] explicit confirmation is required.
- [ ] conversion is prospective.
- [ ] cutover uses canonical user-day.
- [ ] conversion creates a new First-Class lifetime.
- [ ] conversion uses canonical Sleep validation.
- [ ] selected future legacy recurrence is retired.
- [ ] conversion provenance is durable.
- [ ] conversion is atomic.
- [ ] conversion is idempotent.
- [ ] stale review cannot convert changed authority.
- [ ] source lifetime is protected against stale conversion where representable.
- [ ] no duplicate converted future ownership exists after cutover.
- [ ] no automatic accepted Sleep placement is created.
- [ ] no publication is created.
- [ ] no execution is created.

### Historical Preservation

- [ ] legacy publication remains unchanged.
- [ ] legacy execution remains unchanged.
- [ ] legacy correction/retraction remains unchanged.
- [ ] legacy realized facts remain unchanged.
- [ ] legacy PlanDecision evidence is not silently rewritten.
- [ ] First-Class history begins only through normal future publication.
- [ ] historical query preserves legacy/First-Class distinction.

### Existing Authority

- [ ] existing First-Class Sleep is handled safely.
- [ ] multiple legacy candidates are not merged heuristically.
- [ ] future accepted legacy decisions are handled explicitly.
- [ ] future realized facts are preserved.
- [ ] future immutable publication is respected.
- [ ] accepted Goal allocations are not silently cancelled.
- [ ] realized Goal/support/protection remains immutable.
- [ ] Work remains unchanged.
- [ ] Manual Events remain unchanged.

### Mapping

- [ ] supported duration mapping is explicit.
- [ ] supported buffer mapping is explicit.
- [ ] clock mapping is exact or requires review.
- [ ] Work-relative mapping requires complete First-Class semantics.
- [ ] off-day fallback is never invented.
- [ ] recurrence mapping is exact or rejected/reviewed.
- [ ] priority is not copied.
- [ ] Omit is not converted.
- [ ] Move is not converted into a pin.
- [ ] ambiguous semantics are not guessed.

### Derived State

- [ ] Preview becomes stale/invalid through existing mechanism.
- [ ] planning review cannot remain stale-current.
- [ ] Capacity recomputes through existing pipeline.
- [ ] Goal feasibility recomputes through existing pipeline.
- [ ] Proposal recomputes through existing pipeline.
- [ ] publication readiness revalidates.
- [ ] Today does not substitute unpublished converted Sleep.

### Profiles

- [ ] active conversion does not rewrite old profiles.
- [ ] old profiles remain legacy until explicitly converted.
- [ ] profile saved after conversion does not restore duplicate legacy ownership.
- [ ] converted profile activation creates fresh First-Class lifetime.
- [ ] portable conversion semantics do not incorrectly reuse live incarnations.

### Backup / Restore

- [ ] backup preserves conversion relationship.
- [ ] backup preserves new First-Class lifetime.
- [ ] backup preserves legacy retirement.
- [ ] backup preserves historical legacy authority.
- [ ] restore preserves identities.
- [ ] malformed conversion relationship fails safely.
- [ ] old backups remain valid.
- [ ] old backups do not gain inferred conversion.

### Clear

- [ ] full clear removes effective conversion authority.
- [ ] no First-Class source resurrection.
- [ ] no retired legacy recurrence resurrection.
- [ ] no conversion-provenance resurrection.

### Product Reachability

- [ ] candidate discovery reachable through ordinary product.
- [ ] conversion review reachable.
- [ ] missing semantics can be supplied.
- [ ] cutover can be selected.
- [ ] explicit confirmation exists.
- [ ] successful conversion is observable.
- [ ] no developer-only manipulation required.

### Non-Activation

- [ ] no Sleep Progress.
- [ ] no Sleep score.
- [ ] no recommendations.
- [ ] no learning.
- [ ] no health interpretation.
- [ ] no device integration.
- [ ] no split Sleep.
- [ ] no omission override.
- [ ] no shortening override.
- [ ] no buffer waiver.
- [ ] no Planner/Summary migration.
- [ ] no general HistoricalPlan recovery UX.

### Bundle

- [ ] hard 170,000 initial gzip limit unchanged.
- [ ] hard bundle gate passes.
- [ ] no threshold bypass.
- [ ] conversion surface is lazy where appropriate.
- [ ] no duplicated solver/history implementation.
- [ ] final headroom documented.

### Validation

- [ ] focused conversion tests pass.
- [ ] First-Class Sleep tests pass.
- [ ] legacy Sleep tests pass.
- [ ] profile tests pass.
- [ ] backup/restore tests pass.
- [ ] clear tests pass.
- [ ] PlanDecision tests pass.
- [ ] publication tests pass.
- [ ] execution/history tests pass.
- [ ] planning/Capacity/Goal tests pass.
- [ ] full suite passes.
- [ ] formatting passes.
- [ ] lint passes.
- [ ] build/typecheck passes.
- [ ] bundle gate passes.
- [ ] `git diff --check` passes.
- [ ] no commit.
- [ ] no push.

### Documentation

- [ ] required RESULT exists.
- [ ] all required matrices complete.
- [ ] exact conversion policy documented.
- [ ] candidate heuristic vs conversion authority documented.
- [ ] cutover semantics documented.
- [ ] legacy retirement semantics documented.
- [ ] conversion provenance documented.
- [ ] schema changes documented.
- [ ] profile portability semantics documented.
- [ ] historical preservation documented.
- [ ] bundle before/after documented.
- [ ] changed-file accounting complete.
- [ ] deferred work explicit.

---

## 120. Deferred Work

Task 9.16 must explicitly leave deferred:

```text
Sleep Progress
Sleep scoring
Sleep debt
Sleep recommendations
learned Sleep preferences
device ingestion
medical/health integrations
split Sleep
naps as additional authored required Sleep
one-off omission
one-off shortening
protection waiver
reverse conversion
automatic legacy conversion
heuristic requiredness inference
Planner / Summary shell convergence
general HistoricalPlan recovery UX
```

Do not silently implement any of them.

---

## 121. First-Class Sleep Foundation Completion Assessment

The RESULT must explicitly assess whether Tasks 9.10–9.16 now establish the complete required First-Class Sleep foundation.

Evaluate:

```text
domain
authored authority
persistence
identity
derivation
feasibility
planning precedence
Capacity
Goal planning
Friction
corrective authority
publication
Today
execution
history
legacy transition
```

If all are complete, state that no additional **required pre-shell First-Class Sleep architecture task** remains.

Do not claim that all conceivable Sleep features are complete.

The distinction is:

```text
First-Class Sleep foundation complete
≠
all future Sleep product features complete
```

---

## 122. Final Completion Statement

If and only if all required completion criteria are satisfied, end the RESULT with exactly:

```text
Task 9.16 — First-Class Sleep Legacy Conversion & Product Transition V1 is COMPLETE.
```

If any required criterion remains unresolved, end with exactly:

```text
Task 9.16 — First-Class Sleep Legacy Conversion & Product Transition V1 is INCOMPLETE.
```

Then identify the exact blockers.

Do not mark Task 9.16 complete merely because:

```text
a legacy Sleep template can produce a SleepRequirement
```

Completion requires proof of the complete safe transition:

```text
legacy candidate
        ↓
read-only discovery
        ↓
explicit review
        ↓
explicit missing semantics
        ↓
explicit user confirmation
        ↓
atomic prospective cutover
        ↓
new First-Class source lifetime
        +
selected future legacy retirement
        +
durable conversion provenance
        ↓
no duplicate converted future ownership
        ↓
normal First-Class planning
        ↓
normal First-Class publication/execution/history
```

while preserving:

```text
past legacy history remains legacy
current immutable authority remains immutable
profiles remain portable
backups remain authority-preserving
old data is never semantically upgraded by inference
```

---

## 123. Governing Principle

Tasks 9.10–9.15 established what First-Class Sleep means.

Task 9.16 must establish how an existing user crosses into that model without falsifying the past.

Therefore:

```text
Discovery may suggest.

Review may explain.

Only the user may authorize conversion.

Conversion changes future authored responsibility.

It does not rewrite history.

It does not infer requiredness.

It does not erase legacy identity.

It does not create duplicate future ownership.

After cutover, First-Class Sleep proceeds through the same canonical lifecycle as any other First-Class Sleep requirement.
```

The final architectural boundary is:

> **Convert the future explicitly. Preserve the past exactly.**