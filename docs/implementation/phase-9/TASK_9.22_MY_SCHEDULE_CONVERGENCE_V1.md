# Task 9.22 — My Schedule Convergence V1

**Status:** READY FOR IMPLEMENTATION  
**Phase:** 9 — Product Convergence  
**Task Type:** Bounded implementation / authored-schedule UX convergence / mobile product convergence  
**Primary Surface:** Planner → My Schedule  
**Primary Domains:** Work Pattern, First-Class Sleep, Commitments  
**Depends On:** Tasks 9.9–9.21, especially 9.10–9.18 and the accepted Planner navigation architecture  
**Must Preserve:** Authored authority, canonical user-day semantics, Work/cycle semantics, First-Class Sleep authority, Commitment identity/recurrence semantics, legacy Sleep conversion, explicit planning/publication authority, Mobile Acceptance Gate, bundle hard gate  
**Required Durable Output:** `PHASE_9_TASK_9_22_MY_SCHEDULE_CONVERGENCE_V1_RESULT.md`

---

## 1. Objective

Converge **Planner → My Schedule** into the coherent product home for the recurring authored structure that shapes a user's life:

```text
My Schedule
├── Work Pattern
├── Sleep
└── Commitments
```

Task 9.22 shall make these three domains understandable and directly reachable as distinct parts of one product concept without merging their authority models.

The user should be able to enter My Schedule and answer:

- What does DayFrame know about my Work Pattern?
- How is my required Sleep configured?
- What Commitments have I told DayFrame about?
- Which of these are active?
- How do I edit the appropriate source?
- What important configuration needs review?
- How do these authored sources relate to the schedule DayFrame later builds?

The task shall establish a scalable, mobile-first My Schedule experience while preserving the canonical owners already established by the architecture.

### Governing Principle

> **My Schedule organizes authored scheduling intent. It does not become a new owner of that intent.**

The three domains remain semantically distinct:

```text
Work Pattern ≠ Sleep Requirement ≠ Commitment
```

My Schedule is their product home, not their replacement data model.

---

## 2. Why This Task Exists

Task 9.17 defined the target product hierarchy:

```text
Planner
├── Calendar
├── My Schedule
│   ├── Work Pattern
│   ├── Sleep
│   └── Commitments
├── Goals
└── Review Plan
```

Task 9.18 established the Planner/Summary shell and made My Schedule a Planner destination, but intentionally did **not** invent a fake First-Class Sleep editor merely to complete the navigation tree.

At the end of Task 9.18:

- Work Pattern was reachable;
- Commitments were reachable;
- First-Class Sleep had a mature domain architecture but lacked a complete ordinary product home;
- legacy Sleep conversion remained available through its transitional path.

Tasks 9.10–9.16 subsequently represent the accepted First-Class Sleep foundation that My Schedule must respect:

```text
SleepRequirement
→ derivation
→ feasibility
→ Capacity integration
→ corrective placement authority
→ publication
→ execution
→ history
→ explicit legacy conversion
```

Task 9.22 is therefore a **product convergence task**, not a new scheduling-engine task.

It must make the existing authored schedule architecture understandable and reachable without reopening settled scheduling semantics.

---

## 3. Scope Boundary

Task 9.22 is deliberately bounded.

### In Scope

- converge Planner → My Schedule;
- present Work Pattern, Sleep, and Commitments as the three primary My Schedule domains;
- provide clear domain summaries;
- preserve or improve lawful editing reachability;
- make general First-Class Sleep authoring reachable if the existing command/domain contract safely supports it;
- preserve existing Work Pattern authoring modes;
- preserve existing Commitment authoring semantics;
- improve human-facing duration/time presentation where this can be done without semantic change;
- improve focused/per-item progressive disclosure;
- make large Commitment sets manageable;
- preserve legacy Sleep conversion as a transitional explicit workflow;
- expose relevant authored-source review states;
- preserve Planner navigation/Back context;
- validate the complete workflow on mobile;
- preserve bundle policy.

### Out of Scope

Do not use Task 9.22 to implement:

- a new Work scheduling engine;
- a new Sleep solver;
- new Sleep exception semantics;
- naps;
- Sleep scoring;
- health inference;
- one-off Sleep omission;
- one-off Sleep shortening;
- new Commitment recurrence semantics;
- Goal convergence;
- recurring Goal Demand;
- Review Plan convergence;
- Proposal redesign;
- Friction redesign;
- Found Time;
- Live Capacity;
- Live Opportunity;
- HistoricalPlan recovery;
- broader Summary convergence;
- compatibility retirement;
- external calendar ingestion;
- holiday ingestion;
- new recommendation semantics.

---

## 4. Required Pre-Implementation Discovery

Before implementation, inspect the current repository and document the actual product/domain contracts.

At minimum inspect:

1. current Planner → My Schedule navigation;
2. current Work Pattern surface;
3. current Work Pattern editing commands/state ownership;
4. repeating rotation configuration;
5. dated cycle/segment configuration;
6. Day Boundary controls;
7. effective/global/segment week-start controls;
8. Planning Range / planning-period controls currently near or separate from Work Pattern;
9. current Commitment Library/surface;
10. Commitment editor;
11. Commitment recurrence controls;
12. Commitment placement controls;
13. Commitment duration controls;
14. support/attachment/subordinate Commitment behavior;
15. legacy Sleep Commitment presentation;
16. First-Class `SleepRequirementV1` authored contract;
17. current store commands for creating/updating/disabling First-Class Sleep;
18. current Sleep read/query contracts;
19. accepted Sleep placement review/revocation reachability;
20. legacy Sleep conversion surface and lazy boundary;
21. current default Sleep behavior;
22. current SetupScreen or other compatibility authoring paths;
23. current persistence boundaries;
24. current responsive CSS;
25. current My Schedule mobile behavior;
26. current test baseline;
27. current bundle baseline;
28. current dirty-tree state.

Record:

```bash
git rev-parse HEAD
git status --short
```

Measure the actual current test and bundle baseline.

For historical comparison only, Task 9.21 completed at:

```text
152 test files
1,527 tests

Initial raw JS:       618,770 bytes
Initial gzip:         161,960 bytes
Hard gzip limit:      170,000 bytes
Remaining headroom:     8,040 bytes
Largest lazy chunk:    59,671 bytes
Total JS:           1,174,210 bytes
```

Fresh measurements govern.

---

## 5. Canonical My Schedule Model

My Schedule is a product-level grouping of three existing authored domains:

```text
My Schedule
│
├── Work Pattern
│   └── when Work owns time and how the user's scheduling frame is oriented
│
├── Sleep
│   └── required Sleep intent and its lawful temporal domain
│
└── Commitments
    └── authored obligations that own or constrain time
```

Do not create:

```text
MyScheduleV1
ScheduleSetupV2
UnifiedRecurringRule
GenericScheduleRequirement
```

or another persisted semantic aggregate merely to support the UI.

My Schedule itself owns no time.

Its child domains continue to own their respective authority.

---

## 6. Authored Authority

Task 9.22 must preserve:

```text
User edits authored source
        ↓
canonical domain command/store owner
        ↓
authored state changes
        ↓
derived planning becomes stale/recomputable
```

Do not create:

```text
UI draft
→ silently accepted schedule
```

or:

```text
save My Schedule
→ regenerate
→ accept
→ publish
```

Saving authored intent must not automatically:

- generate a Preview;
- accept a Proposal;
- realize Goal work;
- publish;
- record execution;
- mutate Progress.

If an authored edit makes existing derived planning stale, use existing freshness/staleness semantics.

---

## 7. Required My Schedule Landing Surface

My Schedule shall have a clear landing experience containing the three primary domains:

```text
Work Pattern
Sleep
Commitments
```

Each should provide a compact human-readable orientation summary and an obvious path to inspect/edit.

The landing surface should not attempt to render the full editor for all three domains simultaneously.

Prefer:

```text
My Schedule

Work Pattern
  concise current configuration
  [View / Edit]

Sleep
  concise current requirement or setup state
  [View / Edit]

Commitments
  concise count/status orientation
  [View / Manage]
```

Exact copy/design may follow current DayFrame conventions.

The user should not need to understand internal architecture to know where to go.

---

## 8. Work Pattern Product Convergence

Work Pattern must remain one product concept even if the underlying implementation supports multiple configuration styles.

Target product model:

```text
Work Pattern
├── Repeating rotation
└── Dated periods
```

Use repository evidence to determine the exact current names/contracts.

Do not silently convert between modes.

### Work Pattern Surface Should Make Understandable

Where applicable:

- current Work Pattern mode;
- shift/cycle names;
- repeating sequence or dated periods;
- shift start/end;
- cross-midnight behavior;
- effective Day Boundary;
- week orientation/start;
- cycle/segment overrides;
- active/effective dates where relevant.

Do not expose every advanced field in the initial summary.

Use progressive disclosure or focused editing.

---

## 9. Work Pattern Mode Integrity

Repeating rotation and dated cycle/segment configuration may represent different authored structures.

Do not flatten them into one generic recurrence object in the UI if doing so would erase semantics.

Do not implement automatic conversion such as:

```text
Repeating rotation
→ edit
→ silently becomes dated periods
```

or the reverse.

If switching modes would require an unapproved migration/conversion policy:

```text
STOP CONDITION — WORK PATTERN MODE CONVERSION REQUIRED
```

Document the decision needed.

A product surface may let the user choose which existing mode to configure only where the current architecture safely supports that choice.

---

## 10. Day Boundary and Week Orientation

Dogfood repeatedly demonstrated that Day Boundary is part of understanding the Work Pattern.

Where supported by current architecture, make Day Boundary visibly associated with Work Pattern rather than buried in an unrelated advanced area.

Likewise, present week orientation/start in understandable product language.

Preserve:

- global boundary semantics;
- effective segment/cycle overrides;
- canonical user-day ownership;
- effective week-start semantics.

Do not simplify the UI by pretending an override does not exist.

Do not rewrite an effective segment override into a global value.

Where the current value is inherited, communicate inheritance rather than duplicating authored authority.

---

## 11. Planning Period / Planning Range Relationship

Task 9.17 identified that Planning Range had historically been too far removed from Work Pattern.

Task 9.22 may improve **reachability/context** for planning-period controls from My Schedule/Work Pattern.

However:

```text
Work Pattern ≠ Planning Range
```

Planning Range is not part of Work recurrence authority.

Do not persist planning range inside Work Pattern merely because the controls are presented nearby.

Use clear product language such as:

```text
Planning period
Review range
```

only according to the actual existing semantic owner.

If the existing control belongs elsewhere, link to it contextually rather than creating a second owner.

---

## 12. First-Class Sleep Product Home

Task 9.22 must establish:

```text
Planner
→ My Schedule
→ Sleep
```

as the ordinary product identity/path for First-Class Sleep.

The Sleep surface should make the current requirement understandable in human terms.

Where applicable show:

- required duration;
- before-Sleep buffer;
- after-Sleep buffer;
- applicable weekdays;
- effective dates/lifetime;
- temporal mode;
- clock-based window;
- Work-relative window;
- off-day fallback;
- current configuration/review state.

Do not expose internal solver structures as the primary experience.

---

## 13. First-Class Sleep Editing

The task shall determine during discovery whether the existing authored command/domain contract supports a complete lawful ordinary First-Class Sleep editor.

If yes, provide the smallest coherent editor necessary to create/update the existing authored requirement.

If the repository lacks a safe public authored command for a required edit:

```text
STOP CONDITION — SLEEP AUTHORING CONTRACT GAP
```

Do not create UI-local Sleep authority.

Do not bypass canonical validation.

Do not mutate raw persisted Sleep state directly from React.

### Sleep Editing Must Preserve

- one primary First-Class Sleep requirement in V1;
- duration;
- required buffers;
- applicability;
- effective dates;
- clock or Work-relative temporal rule;
- off-day fallback;
- source revision/lifetime semantics;
- canonical validation.

---

## 14. Sleep Is Not a Commitment

The product must reinforce the architecture established in Tasks 9.10–9.16.

Do not present First-Class Sleep as:

```text
Commitment: Sleep
Priority: 1
```

or reuse ordinary Commitment priority semantics.

Sleep is:

- required when applicable;
- solved before discretionary Capacity;
- not ordinary numeric priority;
- not optional merely because another Commitment has higher priority.

The Sleep surface may visually coexist with Work Pattern and Commitments under My Schedule, but it must remain a distinct domain.

---

## 15. No New Sleep Exception Authority

Task 9.22 must not introduce controls for:

- Skip Sleep;
- Omit tonight;
- Shorten Sleep;
- Split Sleep;
- Ignore buffer;
- Reduce required protection;
- Treat Sleep as optional;
- override infeasibility through UI force-save.

The accepted V1 architecture explicitly does not contain one-off omission/shortening/protection-waiver authority.

If product usability appears to require such a feature:

```text
STOP CONDITION — NEW SLEEP AUTHORITY REQUIRED
```

Do not invent it during convergence.

---

## 16. Accepted Sleep Placement

Existing accepted Sleep placement authority remains separate from authored Sleep requirement editing.

Preserve the distinction:

```text
Sleep Requirement
≠
Accepted Sleep Placement
```

The requirement defines what lawful Sleep must exist.

An accepted placement chooses where one required occurrence occurs inside an already-lawful domain.

If accepted-placement review/revocation is currently reachable elsewhere, Task 9.22 may provide a contextual link where useful.

Do not merge accepted occurrence placement into the authored requirement editor.

Do not silently delete stale accepted placement evidence when the requirement changes.

Existing stale-pin/review semantics govern.

---

## 17. Sleep Feasibility / Review States

Where current read models safely expose relevant Sleep configuration state, the product may communicate states such as:

```text
Configured
Needs review
Unable to place required Sleep
Planning context incomplete
Protected evidence
```

Use human language grounded in canonical states.

Do not turn:

```text
searchIncomplete
contextIncomplete
protected
invalid
```

into:

```text
No time for sleep
```

unless canonical evidence proves physical infeasibility.

Only canonical `infeasible` may support a proven incompatibility claim under the established Sleep architecture.

---

## 18. Legacy Sleep Conversion

Preserve the explicit legacy conversion path from Task 9.16.

The governing rule remains:

> **Convert the future explicitly. Preserve the past exactly.**

Legacy Sleep Commitments may be identified in Commitments and/or linked contextually from Sleep.

Conversion must remain:

- explicit;
- prospective;
- reviewed;
- lazy where currently implemented;
- non-heuristic;
- non-automatic.

Do not automatically convert a Commitment because:

- category is Sleep;
- title contains Sleep;
- ID resembles `default_sleep`.

Those remain candidate heuristics only.

If First-Class Sleep already exists, preserve current conversion blocking/handling semantics.

---

## 19. Commitments Product Convergence

My Schedule → Commitments should provide a focused scalable home for authored Commitments.

The user should be able to understand:

- what Commitments exist;
- which are enabled;
- category/type;
- duration;
- recurrence;
- placement intent;
- Work dependency/exclusion where supported;
- relevant support/attachment relationships;
- whether an item is legacy Sleep.

The list should not require opening every Commitment simultaneously.

---

## 20. Commitment List Scalability

Design for at least approximately 50 Commitments.

Use bounded presentation.

Where compatible with current architecture, provide useful controls such as:

- search;
- enabled/disabled filter;
- category filter;
- bounded initial list;
- incremental reveal or pagination;
- one focused editor at a time.

Do not render 50 complete editors on page load.

Do not globally open Advanced Options for every Commitment.

---

## 21. Commitment Editing

Use focused/per-item editing.

The ordinary editor should prioritize essential fields first.

Advanced values should use per-item progressive disclosure.

Preserve unsupported/advanced authored values even if they are not exposed in the first-level form.

Never silently drop a field because the converged editor does not currently render it.

If an existing Commitment contains a value the new editor cannot safely round-trip:

```text
STOP CONDITION — COMMITMENT ROUND-TRIP GAP
```

Do not save a lossy replacement.

---

## 22. Human Duration Inputs

Where the existing command contract accepts minute durations, the converged UI should prefer human-friendly input.

Suitable presentation may use:

```text
Hours
Minutes
```

rather than requiring raw total minutes.

Preserve exact canonical duration on round-trip.

Examples:

```text
90 minutes
→ 1 hour 30 minutes
→ save
→ 90 canonical minutes
```

Do not introduce ambiguous fractional conversions.

If minutes exceed normal display ranges, normalize presentation appropriately.

For example:

```text
75 minutes
→ 1 hour 15 minutes
```

rather than:

```text
0 hours 75 minutes
```

unless an existing specialized field intentionally behaves differently.

---

## 23. Time Input Behavior

Where touched by the converged editor, time entry should be understandable on phone and desktop.

Do not require hidden advanced controls merely to set ordinary hours.

Preserve cross-midnight semantics.

Do not silently clamp or reinterpret a valid next-day relationship.

If native time inputs are used, ensure canonical conversion remains deterministic.

Do not alter the underlying temporal model merely to improve the input widget.

---

## 24. Commitment Recurrence

Task 9.22 may improve presentation of existing recurrence semantics.

It must not invent new recurrence authority.

Preserve existing supported recurrence types and identity.

Do not conflate:

```text
Commitment recurrence
```

with:

```text
Goal Demand recurrence
```

Recurring Goal Demand remains outside this task.

Where recurrence is complex, prefer a human-readable summary plus focused editor rather than exposing raw recurrence structures.

---

## 25. Work Relationship Controls

Dogfood identified important Commitment relationships such as:

```text
Requires a Work shift
Exclude days with Work shift
```

Discovery must determine the exact current supported semantics.

Expose existing lawful controls where they are already part of canonical Commitment authority.

Do not implement a requested dogfood control merely because it was desired if the domain contract does not yet support it.

If a needed control lacks canonical support:

```text
STOP CONDITION — COMMITMENT SEMANTIC GAP
```

Document it for later architecture work.

---

## 26. Support / Attachment Relationships

Do not flatten real subordinate/support relationships into ordinary independent Commitments if the architecture distinguishes them.

Where existing support/attachment configuration is authored through Commitment composition:

- preserve exact parent/child relationship;
- present it in understandable language;
- do not create duplicate time ownership;
- do not detach it accidentally during editing.

If the current product cannot safely edit an existing relationship, preserve it read-only and provide appropriate product explanation rather than destructively rewriting it.

---

## 27. Editing vs Planning

My Schedule edits authored intent.

Review Plan evaluates consequences.

Preserve:

```text
Edit Work / Sleep / Commitment
        ↓
authored state changes
        ↓
derived planning may become stale
        ↓
user later reviews/regenerates through existing planning flow
```

Do not automatically:

- resolve Friction;
- accept a Proposal;
- move Goal work;
- republish;
- alter execution.

Where an edit invalidates current derived planning, use the existing stale/review language.

A useful product action may navigate to Review Plan, but it must remain explicit.

---

## 28. My Schedule Attention

My Schedule may surface meaningful authored-source review states.

Examples may include:

- Sleep configuration needs review;
- legacy Sleep conversion is available;
- an authored source contains protected/unavailable evidence;
- derived planning is stale after an edit.

Do not create a generic recommendation engine.

Do not turn every advanced configuration into an alert.

If no meaningful attention exists, do not show decorative empty warning panels.

---

## 29. Product Vocabulary

Prefer:

```text
My Schedule
Work Pattern
Repeating rotation
Dated periods
Day starts at
Week starts on
Sleep
Sleep duration
Sleep window
Before sleep
After sleep
Work-relative
Off days
Commitments
Repeats
Duration
Placement
Enabled
Needs review
Review Plan
```

Avoid ordinary UI exposure of:

```text
SleepRequirementV1
occurrence coordinate
incarnation
canonical owner day
solver domain
constraint propagation
template realization
authority aggregate
```

Technical detail may remain available where useful, but should not dominate ordinary editing.

---

## 30. Navigation and Back Behavior

Preserve the Planner navigation owner established by Task 9.18.

Expected conceptual paths:

```text
Planner
→ My Schedule
→ Work Pattern
```

```text
Planner
→ My Schedule
→ Sleep
```

```text
Planner
→ My Schedule
→ Commitments
→ selected Commitment
```

Back should restore the prior My Schedule context where practical.

Do not create a second independent navigation stack inside each editor.

Do not persist navigation as domain state.

---

## 31. Direct Links From Other Surfaces

Existing lawful contextual navigation may point into My Schedule.

Examples:

```text
Day Worksurface
→ source Work Pattern / Commitment where already supported
```

```text
Sleep review
→ My Schedule / Sleep
```

```text
Review Plan
→ source authored item
```

Do not add heuristic navigation based on title matching.

Use durable source identity where existing navigation contracts support it.

If a source cannot be targeted safely, navigate to the relevant domain landing surface rather than guessing the item.

---

## 32. Large-Data Behavior

Validate practical behavior with representative authored data.

At minimum consider:

```text
multiple Work segments/cycles
one First-Class Sleep requirement
legacy Sleep candidate(s)
~50 Commitments
long Commitment names
disabled Commitments
mixed recurrence styles
advanced Commitment values
```

Do not render every editor simultaneously.

Do not introduce virtualization or a new dependency without measured need.

If a dependency becomes necessary:

```text
STOP CONDITION — DEPENDENCY REQUIRED
```

---

## 33. Loading and Async Safety

If any My Schedule domain uses lazy asynchronous queries or modules, handle:

- loading;
- errors;
- rapid navigation;
- stale responses;
- unmount/remount.

A response for a previously selected item must not replace a newer selection.

Do not cache derived read evidence into persistent authored state.

Authored form drafts may exist locally while editing, but saving must pass through canonical domain commands.

---

## 34. Form Draft Semantics

A form draft is not authored authority until successfully saved through the canonical command.

Preserve:

```text
stored authored state
≠
unsaved form draft
```

If save fails:

- retain the user's draft where practical;
- show the canonical error;
- do not pretend the source changed;
- do not patch domain state optimistically.

If save succeeds:

- re-read or consume canonical resulting state;
- do not maintain a divergent UI-only authority copy.

---

## 35. Validation and Error Presentation

Dogfood identified that setup errors were sometimes insufficiently specific.

Where canonical validators already provide useful failure information, surface it near the relevant field/section.

Do not invent diagnoses that validators do not establish.

A failed save should help the user identify:

```text
what needs correction
```

without exposing internal stack/architecture terminology.

Do not weaken validation to make the form easier to save.

---

## 36. Mobile Acceptance Gate

Task 9.22 is a major user-facing convergence task.

The full standing **Mobile Acceptance Gate is mandatory**.

Validate production-rendered behavior at approximately:

```text
320px
390px
768px
1280px
```

### Reachability

At every viewport verify:

```text
Planner
→ My Schedule
→ Work Pattern
```

```text
Planner
→ My Schedule
→ Sleep
```

```text
Planner
→ My Schedule
→ Commitments
→ inspect/edit a Commitment
```

Also verify any legacy Sleep conversion entry retained by the task.

### Layout

Verify:

- no unintended document-level horizontal overflow;
- Work Pattern summaries remain readable;
- long cycle/segment names wrap safely;
- Sleep windows remain readable;
- Commitment names wrap safely;
- recurrence summaries do not force horizontal scrolling;
- form controls fit narrow screens;
- nested advanced sections do not create excessive horizontal indentation.

### Touch

Primary interactive controls should provide practical touch targets, approximately 44 CSS px where feasible.

No required:

- hover;
- double-click;
- right-click;
- precision pointer gesture.

### Forms

Validate:

- text entry;
- date entry;
- time entry;
- hours/minutes;
- select controls;
- toggles;
- recurrence controls;
- advanced disclosure;
- save/cancel;
- validation errors;
- reduced-height mobile viewport.

### Progressive Disclosure

Do not open:

- all Work segments;
- all Sleep technical detail;
- all Commitment editors;
- all Commitment advanced options

simultaneously by default.

### Navigation

Verify:

- Back is predictable;
- domain return restores useful context;
- saving does not unexpectedly eject the user from My Schedule;
- cancellation does not mutate authority.

### Semantic Parity

Mobile and desktop must use the same authored domain commands and represent the same authority.

Mobile may use different layout.

It may not use a simplified semantic model.

### Accessibility

Validate touched interactions for:

- keyboard navigation;
- visible focus;
- logical tab order;
- labels;
- field/error association;
- semantic headings;
- accessible names;
- `aria-expanded` where applicable;
- non-color-only status;
- focus restoration;
- zoom/reflow.

Do not claim screen-reader, hardware keyboard, hardware soft-keyboard, or physical-device certification unless actually tested.

> **Failure of the Mobile Acceptance Gate means Task 9.22 is not complete.**

---

## 37. Bundle Gate

Measure the actual current bundle before implementation.

After implementation record:

```text
initial raw JS
initial gzip
delta
largest lazy chunk
total emitted JS
remaining hard headroom
advisory status
```

Hard requirement:

```text
initial gzip <= 170,000 bytes
```

Do not raise the threshold.

Task 9.21 ended at approximately:

```text
161,960 bytes initial gzip
8,040 bytes hard headroom
```

Fresh measurements govern.

Preserve or introduce appropriate lazy boundaries for:

- detailed editors;
- legacy Sleep conversion;
- rare advanced configuration;
- other heavy My Schedule sub-surfaces.

Do not eagerly import all Work/Sleep/Commitment editing logic into the initial bundle merely because they now share one landing surface.

No new runtime dependency without explicit architecture review.

---

## 38. Persistence and Schema Constraints

Task 9.22 is expected to use existing persistence/domain contracts.

Expected:

```text
Active schema: unchanged
Profile schema: unchanged
Backup schema: unchanged
HistoricalPlan schema: unchanged
Execution schema: unchanged
Progress schema: unchanged
Sleep schema: unchanged
```

Do not introduce a new `MySchedule` persisted aggregate.

If a required product workflow cannot be implemented without a durable schema/version change:

```text
STOP CONDITION — SCHEMA CHANGE REQUIRED
```

Return evidence rather than improvising a migration.

---

## 39. Profile / Backup Compatibility

Work Pattern, Sleep, and Commitments already participate in established persistence/portability rules.

Task 9.22 must not alter those semantics.

Editing through My Schedule must continue to produce state that existing:

- active-state persistence;
- profiles;
- backup;
- restore;
- clear/restart

can represent according to their current contracts.

Do not add UI-only authored fields that disappear on backup/profile round-trip.

Where First-Class Sleep portability differs from conversion-lineage persistence, preserve the accepted Task 9.16 rules.

---

## 40. Compatibility Surfaces

Task 9.22 converges My Schedule but does not automatically authorize deletion of older setup/editing surfaces.

During discovery classify overlapping surfaces as:

```text
RETAIN
TRANSITIONAL
READY FOR RETIREMENT
BLOCKED BY LATER CONVERGENCE
```

Do not delete a compatibility surface unless this task proves:

- semantic parity;
- editing parity;
- validation parity;
- advanced-value round-trip parity;
- protection parity;
- mobile parity;
- accessibility parity;
- test parity.

In particular, do not prematurely remove a compatibility editor if it remains the only lawful path to an advanced authored value.

---

## 41. No Duplicate Editors With Divergent Semantics

Temporary coexistence of old/new surfaces is acceptable during convergence.

Divergent semantics are not.

If two editors can modify the same authored source, both must use the same canonical domain command/validation semantics.

Do not create:

```text
new My Schedule editor
→ writes one representation

old Setup editor
→ writes a subtly different representation
```

If parity cannot be maintained:

```text
STOP CONDITION — EDITOR SEMANTIC DIVERGENCE
```

---

## 42. Required Tests

Add focused regression coverage for at least the following.

### 42.1 My Schedule Navigation

Verify:

```text
Planner → My Schedule
My Schedule → Work Pattern
My Schedule → Sleep
My Schedule → Commitments
```

and deterministic Back behavior.

### 42.2 No New Authority Owner

Verify My Schedule itself does not persist domain state or become a scheduling authority.

### 42.3 Work Pattern

Cover representative existing modes:

- repeating rotation;
- dated periods/cycle configuration where supported;
- cross-midnight Work;
- Day Boundary;
- week orientation;
- effective override preservation.

Verify no silent mode conversion.

### 42.4 First-Class Sleep

Cover:

- no Sleep configured;
- valid First-Class Sleep configured;
- duration;
- buffers;
- applicability;
- clock window;
- Work-relative window;
- off-day fallback;
- successful edit;
- rejected invalid edit;
- no ordinary Commitment priority;
- no omission/shortening control.

### 42.5 Accepted Sleep Placement Separation

Verify authored Sleep editing does not silently mutate/delete accepted occurrence-placement authority.

### 42.6 Legacy Sleep

Verify:

- legacy Sleep remains identifiable;
- conversion remains explicit;
- candidate heuristics do not auto-convert;
- existing First-Class Sleep blocking semantics remain;
- opening My Schedule does not mutate legacy data.

### 42.7 Commitments

Cover:

- enabled/disabled;
- human duration round-trip;
- recurrence round-trip;
- placement round-trip;
- Work relationship controls that already exist;
- advanced values preserved;
- one focused editor;
- long-name/list behavior;
- legacy Sleep Commitment labeling.

### 42.8 No Automatic Planning Mutation

Verify editing Work/Sleep/Commitments does not automatically:

- accept;
- realize;
- publish;
- execute;
- mutate Progress.

### 42.9 Form Drafts

Verify:

- unsaved edits do not mutate authored state;
- failed save retains correct authority;
- successful save passes through canonical command;
- cancel does not mutate authority.

### 42.10 Large Data

Test representative large Commitment lists and bounded rendering.

### 42.11 Mobile

Add practical regressions for:

- 320px layout;
- long labels;
- Work Pattern editing;
- Sleep editing;
- Commitment editing;
- advanced disclosure;
- hours/minutes;
- time/date controls;
- validation;
- Back/focus behavior.

---

## 43. Required Validation

Run repository canonical equivalents of:

```bash
npm run format
npx prettier --check .
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Also run focused suites for:

- Planner navigation;
- Work Pattern;
- First-Class Sleep;
- legacy Sleep conversion;
- Commitments;
- persistence/profile/backup behavior where touched;
- My Schedule;
- mobile/responsive behavior.

Perform production browser validation for the Mobile Acceptance Gate.

Record exact final test counts.

---

## 44. Repository Hygiene

Before editing:

```bash
git rev-parse HEAD
git status --short
```

Capture a task-relative baseline.

Preserve pre-existing dirty work.

Do not:

- reset;
- stash unrelated work;
- normalize unrelated files;
- mutate preserved dogfood evidence;
- clear the forensic dogfood database;
- commit;
- push.

Use disposable browser/test state.

At completion:

- account for every changed file;
- distinguish Task 9.22 changes from pre-existing changes;
- run `git diff --check`.

---

## 45. Prohibited Changes

Task 9.22 must not:

- create a persisted My Schedule aggregate;
- create a new scheduling authority;
- change canonical user-day semantics;
- change Work generation semantics;
- silently convert Work Pattern modes;
- change Commitment recurrence semantics;
- change Commitment placement semantics;
- collapse Sleep into Commitment;
- add Sleep priority;
- add Sleep omission authority;
- add Sleep shortening authority;
- add Sleep splitting;
- add Sleep buffer waiver;
- add naps;
- add Sleep scoring;
- infer health behavior;
- change Sleep solver semantics;
- silently convert legacy Sleep;
- delete stale accepted Sleep placement evidence;
- change Goal semantics;
- introduce recurring Goal Demand;
- change Proposal/Accepted Allocation/Realization semantics;
- publish automatically;
- infer Progress;
- implement Found Time;
- implement Live Capacity;
- implement HistoricalPlan recovery;
- perform broad Summary convergence;
- retire compatibility surfaces without parity evidence;
- introduce persistence/schema changes without stopping;
- add a runtime dependency without architecture review;
- raise bundle thresholds;
- commit;
- push.

---

## 46. Required Stop Conditions

### STOP CONDITION — SLEEP AUTHORING CONTRACT GAP

Use if the ordinary First-Class Sleep editor requires a write/validation contract the canonical domain does not provide.

### STOP CONDITION — WORK PATTERN MODE CONVERSION REQUIRED

Use if convergence would require inventing semantics for converting repeating rotation to dated periods or vice versa.

### STOP CONDITION — COMMITMENT ROUND-TRIP GAP

Use if the converged editor cannot safely preserve an existing authored Commitment value.

### STOP CONDITION — COMMITMENT SEMANTIC GAP

Use if a desired dogfood control does not exist in canonical Commitment authority.

### STOP CONDITION — NEW SLEEP AUTHORITY REQUIRED

Use if product completion appears to require omission, shortening, splitting, buffer waiver, or another unapproved Sleep exception.

### STOP CONDITION — EDITOR SEMANTIC DIVERGENCE

Use if old/new authoring paths cannot safely share the same domain semantics.

### STOP CONDITION — SCHEMA CHANGE REQUIRED

Use if durable persistence/version changes are necessary.

### STOP CONDITION — DEPENDENCY REQUIRED

Use if a new runtime dependency becomes genuinely necessary.

### STOP CONDITION — BUNDLE HARD GATE

Use if implementation cannot remain at or below:

```text
170,000 bytes initial gzip
```

without architectural intervention.

---

## 47. Completion Criteria

Task 9.22 is complete only when all of the following are true:

1. Planner → My Schedule is a coherent product landing surface.
2. Work Pattern, Sleep, and Commitments are all directly reachable.
3. My Schedule owns no new domain authority.
4. Work Pattern remains its existing canonical authored domain.
5. Repeating/datetime Work modes are not silently converted.
6. Day Boundary is understandable in Work Pattern context.
7. Week orientation remains semantically correct.
8. Planning Range remains distinct from Work Pattern authority.
9. First-Class Sleep has an ordinary product home.
10. Existing lawful First-Class Sleep authoring is reachable through canonical commands, or an explicit stop condition is returned if the contract is insufficient.
11. Sleep remains distinct from Commitment.
12. No new Sleep omission/shortening/splitting/waiver authority exists.
13. Accepted Sleep placement remains separate from requirement editing.
14. Legacy Sleep conversion remains explicit and prospective.
15. Commitments have a focused scalable management surface.
16. Commitment advanced values round-trip safely.
17. Human duration presentation preserves canonical minute values.
18. Existing recurrence semantics are preserved.
19. Existing Work relationship semantics are preserved.
20. Support/attachment relationships are not flattened or lost.
21. Unsaved form drafts do not mutate authority.
22. Failed saves do not create optimistic authority.
23. Authored edits do not automatically generate/accept/realize/publish/execute or mutate Progress.
24. Large Commitment datasets remain usable.
25. Compatibility surfaces are retained unless parity is demonstrated.
26. Full Mobile Acceptance Gate passes.
27. Accessibility checks for touched interactions pass.
28. Initial gzip remains within the unchanged 170,000-byte hard limit.
29. No new runtime dependency is introduced unless separately approved.
30. No persistence/schema change occurs unless a stop condition is returned.
31. Full validation passes.
32. Exact final test counts are recorded.
33. All task-created/modified files are accounted for.
34. Preserved dogfood evidence remains untouched.
35. No commit or push is performed.
36. A durable RESULT artifact is produced.

---

## 48. Required RESULT Artifact

Create:

```text
PHASE_9_TASK_9_22_MY_SCHEDULE_CONVERGENCE_V1_RESULT.md
```

The RESULT must include the following sections.

### A. Executive Summary

State what changed and whether Task 9.22 is complete.

### B. Repository Baseline

Record:

```text
starting HEAD
starting git status
pre-task test count
pre-task bundle
pre-existing dirty files
```

### C. Discovery Findings

Document the actual pre-task contracts for:

- My Schedule;
- Work Pattern;
- Work Pattern modes;
- Day Boundary;
- week orientation;
- Planning Range;
- First-Class Sleep authoring;
- accepted Sleep placement;
- legacy Sleep conversion;
- Commitment editing;
- Commitment recurrence;
- support/attachment relationships;
- compatibility editors.

### D. Implementation

List every created/modified file and its role.

### E. Final My Schedule Structure

Describe the implemented hierarchy:

```text
My Schedule
├── Work Pattern
├── Sleep
└── Commitments
```

and the responsibilities of each.

### F. Authority Analysis

Explicitly demonstrate:

```text
My Schedule owns no time
My Schedule owns no authored domain state
Work remains Work authority
SleepRequirement remains Sleep authority
Commitment remains Commitment authority
form draft ≠ authored state
authored edit ≠ planning acceptance
```

### G. Work Pattern Evidence

Document:

- supported mode presentation;
- repeating rotation;
- dated periods where applicable;
- Day Boundary;
- week orientation;
- overrides;
- cross-midnight behavior;
- whether any mode conversion was introduced.

Expected: none unless separately authorized.

### H. First-Class Sleep Evidence

Document:

- ordinary Sleep path;
- editable fields;
- canonical command/validation owner;
- duration;
- buffers;
- applicability;
- temporal rule;
- off-day fallback;
- invalid-state handling;
- accepted-placement separation;
- absence of omission/shortening/splitting authority.

### I. Legacy Sleep Evidence

Document:

- identification;
- conversion reachability;
- explicit confirmation;
- prospective cutover preservation;
- no automatic conversion.

### J. Commitment Evidence

Document:

- list/search/filter behavior;
- focused editor;
- duration presentation;
- recurrence;
- placement;
- Work relationship controls;
- advanced-value round-trip;
- support/attachment preservation;
- legacy Sleep labeling.

### K. Draft / Save Semantics

Document:

- unsaved draft behavior;
- successful save;
- failed save;
- cancellation;
- canonical re-read/update behavior.

### L. Planning Separation

Prove authored edits do not automatically:

```text
generate
accept
realize
publish
execute
mutate Progress
```

### M. Compatibility Disposition

Classify overlapping old/new surfaces:

```text
RETAIN
TRANSITIONAL
READY FOR RETIREMENT
BLOCKED BY LATER CONVERGENCE
```

Do not delete merely because a surface is transitional.

### N. Large-Data Behavior

Record representative Work/Commitment dataset behavior and any bounded rendering controls.

### O. Mobile Acceptance Gate

Record results at:

```text
320px
390px
768px
1280px
```

Include:

- reachability;
- Work Pattern editing;
- Sleep editing;
- Commitment editing;
- overflow;
- touch;
- forms;
- advanced disclosure;
- Back behavior;
- focus/keyboard;
- semantic parity.

### P. Accessibility

Document tested behavior and explicitly state anything not certified.

### Q. Performance

Record representative rendering/query observations without inventing an SLO.

### R. Bundle

Record:

```text
pre-task initial raw
pre-task initial gzip
post-task initial raw
post-task initial gzip
delta
largest lazy chunk
total JS
remaining hard headroom
advisory status
```

### S. Tests

Record focused and full test counts and important new regressions.

### T. Validation Commands

Record all required validation results.

### U. Persistence / Dependencies

Explicitly state whether any:

```text
schema
persistence version
dependency
bundle policy
```

changed.

Expected answer: none.

### V. Preserved Dogfood Evidence

Explicitly confirm that the original preserved dogfood state was not mutated, cleared, migrated, normalized, or repaired.

### W. Remaining Gaps

Separate genuine future work from Task 9.22 defects.

Examples may include:

- unsupported Work Pattern mode conversion;
- future Commitment semantics;
- one-off Sleep exceptions;
- compatibility retirement;
- later Review Plan convergence.

### X. Next-Task Assessment

Based on repository evidence after Task 9.22, assess the smallest next bounded convergence slice among:

```text
Goals convergence
Review Plan convergence
Protected History Access
broader Summary convergence
another prerequisite discovered during Task 9.22
```

Do not automatically assume the projected roadmap numbering remains correct.

---

## 49. Final Completion Statement

If and only if every completion criterion passes, end the RESULT with:

> **Task 9.22 — My Schedule Convergence V1 is COMPLETE.**

If any completion gate fails, do not use that statement.

Return the precise blocker or stop condition instead.

---

## 50. Final Governing Principles

> **My Schedule is the product home for authored scheduling intent; it is not a new authority owner.**

> **Work Pattern, Sleep, and Commitments belong together in the product without becoming the same thing in the architecture.**

> **Sleep is required planning authority, not an ordinary Commitment with a high priority.**

> **Editing intent does not silently authorize its consequences.**

> **A form draft is not authored truth until the canonical domain accepts it.**

> **Human-friendly controls may translate representation; they may not change semantics.**

> **Legacy conversion is explicit and prospective: convert the future, preserve the past.**

> **Mobile receives the same authored capabilities and authority model with a layout suited to the device.**

> **Converge first. Retire later.**