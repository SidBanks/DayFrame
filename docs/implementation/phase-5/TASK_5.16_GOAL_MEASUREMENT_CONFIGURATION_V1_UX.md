# Task 5.16 — Goal Measurement Configuration V1 UX

## Status

Ready for implementation.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Bounded production UX integration.

---

# 1. Objective

Implement the first user-facing configuration workflow for Goal measurement.

A user must be able to select an existing Goal in Planner / Plan and:

* see whether the Goal currently has an active quantity measurement;
* set up measurement for an unmeasured Goal;
* inspect the current quantity target and unit;
* change the measurement target and/or unit;
* stop measurement;
* restart measurement;
* understand that measurement configuration is independent from Goal lifecycle, supporting commitments, scheduling, Preview, and measured Progress evidence.

This task exposes the already-implemented Measurement Definition authority.

It does **not** implement Progress Observation reporting or Summary Progress.

---

# 2. Governing Product Model

Preserve:

```text
Planner / Plan
    Goal
      ├── authored Goal intent
      ├── Measurement
      └── supporting commitments
```

Measurement configuration belongs to the selected Goal detail.

Do not add measurement fields to:

* Goal creation;
* Goal editing;
* Goal list cards;
* Setup;
* Schedule;
* Summary.

---

# 3. Governing Authority Model

The conceptual boundaries remain:

```text
Goal
    authored intent

Measurement Definition
    authored measurement semantics

Progress Observation
    measured-state evidence

Progress
    derived interpretation
```

Task 5.16 may write **Measurement Definition authority only**.

It must not write:

* Goal authority as a side effect of measurement configuration;
* Progress Observation;
* HistoricalPlan;
* ExecutionHistory;
* Active;
* Preview;
* Goal Activity;
* derived Progress.

---

# 4. Task 5.15 Governing Decisions

Treat the Task 5.15 readiness audit as binding unless production code proves a factual assumption incorrect.

In particular:

* Measurement configuration belongs in selected Goal detail.
* Qualitative Goals remain valid.
* Do not expose a one-option measurement-policy selector.
* V1 exposes `manualQuantityTarget@1` through product language rather than architectural identifiers.
* Changing target or unit starts a new measurement period.
* Previous evidence remains preserved.
* Previous evidence does not carry into the new measurement period.
* Stopping measurement preserves history.
* Restarting measurement starts a new measurement period and requires new compatible evidence.
* Planner owns configuration writes.
* Summary receives no Measurement UI in this task.
* Observation reporting belongs to Task 5.17.
* Progress presentation belongs to Task 5.18.

---

# 5. Required Initial Audit

Before modifying code, inspect and document the actual current implementation of:

* `DayFrameApp`;
* `GoalSection`;
* Goal detail composition;
* Goal subscriptions;
* Goal create/edit draft behavior;
* Goal lifecycle commands;
* revision-conflict handling;
* durability/retry handling;
* protection/loading states;
* Measurement Definition domain types;
* Measurement Definition validators;
* Measurement Definition queries;
* Measurement Definition commands;
* Measurement Definition subscriptions;
* supported units;
* measurement policy identity/version;
* Backup V6 participation;
* full-clear behavior;
* relevant tests;
* responsive Goal styles;
* focus conventions.

Do not infer command signatures from Task 5.15.

Use production code as authority.

---

# 6. Stop Conditions

Stop and report rather than widening scope if implementation reveals that:

* no canonical command exists for starting measurement;
* no canonical command exists for revising measurement;
* no canonical command exists for stopping measurement;
* no canonical command exists for restarting measurement;
* the effective Measurement Definition cannot be queried for a selected Goal;
* revision conflicts cannot be detected;
* protected Measurement Definition authority cannot be distinguished from no definition;
* durability failure cannot be represented truthfully;
* supported unit identities cannot be mapped to stable product labels;
* configuration requires modifying Goal authority;
* configuration requires modifying Progress Observation authority;
* configuration requires scheduler or Preview coupling;
* configuration requires a new persistence authority;
* configuration requires a Backup version change;
* existing semantics materially contradict Task 5.15.

Do not solve an architectural blocker by inventing a second authority or bypass API.

---

# 7. Measurement Placement

Add a bounded `Measurement` subsection to selected Goal detail.

Preferred conceptual order:

```text
Goal detail

Authored Goal context
Lifecycle actions

Measurement
    ...

Supporting commitments
    ...
```

If current component composition makes a slightly different ordering materially cleaner, document the deviation.

Do not put the complete workflow permanently into Goal list cards.

---

# 8. Qualitative Goal State

A Goal without an effective Measurement Definition remains a valid Goal.

Present neutral copy:

> This Goal is not currently measured with a quantity target.

Provide:

**Set up Measurement**

Do not say:

* incomplete;
* missing configuration;
* needs setup;
* no Progress yet;
* 0%;
* untracked failure.

Measurement is optional.

---

# 9. Measurement Setup Workflow

Activating **Set up Measurement** opens an ephemeral configuration draft.

The user-facing model is:

```text
Measurement

Measure this Goal using:
Quantity toward a target

Quantity target
[             ]

Unit
[             ]

Start Measurement
Cancel
```

Do not expose an interactive policy selector when `manualQuantityTarget@1` is the only supported policy.

A static explanation such as **Quantity toward a target** is acceptable.

Do not expose:

* policy IDs;
* policy versions;
* revision IDs;
* epoch terminology.

---

# 10. Target Field

Use product label:

**Quantity target**

The target must use the existing canonical decimal semantics.

Do not use browser floating-point parsing as the source of truth.

Audit the existing domain validator and feed canonical values through it.

Zero/negative/format rules must come from existing authority semantics rather than being invented by the component.

---

# 11. Numeric Input Strategy

Task 5.15 recommends:

```text
type="text"
inputMode="decimal"
maxLength=100
```

Use this strategy if compatible with the existing canonical validator.

Avoid `type="number"` if doing so would introduce:

* binary floating-point conversion;
* browser locale semantics;
* exponent syntax unsupported by the domain;
* accidental normalization inconsistent with canonical decimal grammar.

The draft may remain a string until explicit save.

---

# 12. Unit Field

Use a native labelled selector unless production architecture demonstrates a reason not to.

Task 5.15 identified V1 product labels:

* Count
* Words
* Pages
* Miles
* Kilometers
* Minutes

Verify the actual canonical unit registry before implementation.

The stored value must use canonical unit identity.

The UI must use product labels.

Do not add:

* custom units;
* unit creation;
* unit conversion;
* search;
* aliases;
* pluralization infrastructure beyond what already exists.

---

# 13. Start Measurement

Explicit action:

**Start Measurement**

On save:

1. validate draft;
2. invoke the canonical Measurement Definition creation/start command;
3. do not mutate Goal;
4. do not create an Observation;
5. do not generate Progress;
6. do not regenerate schedule;
7. do not stale Preview;
8. refresh/render from canonical authority.

After successful creation, the read state should show the active target/unit.

Because no observation exists yet, do not invent a Progress value.

---

# 14. Active Measurement Read State

For an active Manual Quantity measurement, selected Goal detail should expose approximately:

```text
Measurement

Quantity toward a target

Target
50,000 words

Changing the target or unit starts a new measurement period.

Change Measurement
Stop Measuring
```

Exact visual hierarchy should follow existing GoalSection conventions.

Do not show:

* percentage;
* current value;
* progress bar;
* “on track”;
* Goal Activity;
* observation history.

Those belong to later tasks.

---

# 15. Change Measurement

Provide explicit:

**Change Measurement**

Open an ephemeral draft prepopulated from the current effective definition.

Editable V1 fields:

* quantity target;
* unit.

Do not mutate authority on field change.

---

# 16. Change Warning

Changing either target or unit starts a new measurement period.

The UI must communicate this before the user commits the change.

Recommended bounded copy:

> Changing the target or unit starts a new measurement period. Previous records remain in history, but you'll need to record a new current value for the updated measurement.

If the unit changed, also communicate:

> DayFrame does not convert previous values between units.

The implementation may combine these sentences cleanly.

Do not use “revision,” “epoch,” or “incarnation” as primary user language.

---

# 17. Change Save Action

Use:

**Save Measurement Changes**

On explicit save:

* invoke the canonical revise command;
* preserve the existing Measurement Definition identity/revision semantics exactly as implemented;
* pass the correct expected revision if required;
* do not migrate observations;
* do not copy observations;
* do not synthesize a new current value;
* do not change Goal lifecycle.

---

# 18. No-Op Change

Audit canonical no-op semantics.

If the user submits unchanged target/unit:

* prefer the existing authority behavior;
* do not manufacture a new measurement period merely because the form was opened.

If production semantics differ, document them.

---

# 19. Stop Measuring

Active measurement exposes:

**Stop Measuring**

Stopping measurement is not deletion.

Require explicit confirmation.

Recommended confirmation:

> Stop measuring this Goal?

> The Goal will remain unchanged. Previous measurement settings and records will be preserved.

Actions:

* **Stop Measuring**
* **Cancel**

Use the canonical stop command.

---

# 20. Stop Boundary

Stopping measurement must not:

* archive the Goal;
* complete the Goal;
* unlink commitments;
* remove definitions;
* remove observations;
* change schedule;
* stale Preview;
* create Progress;
* delete history.

After success, render the stopped state from canonical authority.

---

# 21. Stopped Measurement State

A stopped measurement must remain distinguishable from a Goal that has never been measured.

Present approximately:

```text
Measurement

Measurement stopped.

Previous measurement settings and records are preserved.

Last measurement:
50,000 words

Restart Measurement
```

Only show historical target/unit information that canonical queries actually support.

Do not imply prior Progress remains current.

---

# 22. Restart Measurement

Provide:

**Restart Measurement**

Opening restart should prepopulate the most recent appropriate target/unit if canonical authority supports retrieving it.

Explain:

> Restarting begins a new measurement period. You'll need to record a new current value.

Do not carry prior observations into the new period.

---

# 23. Restart Save

Use explicit:

**Restart Measurement**

or another equally unambiguous action if existing conventions require differentiation between trigger and submit.

On save:

* invoke canonical restart behavior;
* create no observation;
* derive no Progress in this component;
* preserve historical measurement authority.

---

# 24. Unsupported Policy

If a Measurement Definition exists but uses a policy this UI cannot render:

show a preserved-data state such as:

> This measurement method is not supported by this version of DayFrame.

Do not:

* reinterpret it as Manual Quantity;
* show Set up Measurement over it;
* overwrite it;
* offer target/unit editing;
* silently stop it.

---

# 25. Measurement Authority Loading

If Measurement Definition authority is initializing, do not show the qualitative/no-measurement state.

Use an explicit loading state such as:

> Loading Measurement…

Follow current product loading conventions where possible.

---

# 26. Measurement Authority Protection

Protected/unavailable Measurement Definition authority must not render as:

> This Goal is not currently measured…

That would falsely convert unavailable authority into known absence.

Show recovery-oriented protected-state copy consistent with existing Goal authority behavior.

Do not expose configuration writes while authority is protected unless canonical application semantics explicitly permit them.

---

# 27. Durability Failure

If Measurement Definition writes succeed only in session state because durable persistence failed, expose truthful durability status and the existing retry path if one exists.

Reuse existing authority/application patterns rather than inventing component-local persistence recovery.

---

# 28. Revision Conflict

Measurement edits must use canonical stale/revision protection.

If a save is rejected because authority changed:

* do not overwrite;
* preserve the user's draft;
* refresh current canonical measurement;
* explain that the measurement changed since editing began;
* require review and explicit retry.

Suggested meaning:

> This measurement changed while you were editing it. Review the latest settings and try again.

Do not silently rebase the draft onto a new revision.

---

# 29. Draft Independence

Measurement forms use ephemeral component/UI state.

No Measurement Definition write occurs:

* on keystroke;
* on select change;
* on blur;
* when opening a form;
* when cancelling.

Only explicit submit actions mutate authority.

---

# 30. Goal Draft Independence

Measurement drafts must remain separate from the existing Goal edit draft.

Specifically:

```text
Save Goal
```

must not save Measurement changes.

And:

```text
Start Measurement
Save Measurement Changes
Stop Measuring
Restart Measurement
```

must not save Goal title/description/target-date edits.

Do not recreate a combined mega-draft.

---

# 31. Setup Independence

Measurement configuration is not part of Setup.

`Save Setup` must have no Measurement effect.

Measurement writes must have no Setup-draft effect.

---

# 32. Goal Lifecycle Independence

Verify and preserve that:

* Mark Complete;
* Archive Goal;
* Reactivate Goal;

do not mutate Measurement Definition authority.

Measurement status does not mutate Goal lifecycle.

An Active Goal can have no measurement.

A Completed Goal can have active measurement.

A Goal can reach its target without being automatically completed.

---

# 33. Archived Goal Product Policy

Task 5.15 selected a V1 product policy in which archived Goals are not used for new reporting.

For this task, audit whether Measurement configuration controls should remain available for archived Goals.

Prefer the smallest policy consistent with the existing Goal UI and later reporting workflow.

Do not change underlying authority merely to enforce a UI policy.

Document the chosen presentation in the result.

---

# 34. Completed Goal Configuration

Do not automatically prohibit measurement configuration merely because the Goal is Completed if the existing authority permits it.

If the product chooses to expose or suppress configuration for Completed Goals, document why and keep lifecycle semantics independent.

---

# 35. Supporting Commitment Independence

Measurement configuration must not:

* add links;
* remove links;
* change availability;
* modify commitments.

Supporting commitments remain a sibling Goal concern.

---

# 36. Scheduler Independence

Verify through existing tests or focused regression tests that Measurement commands do not alter scheduling inputs.

No schedule regeneration should occur.

---

# 37. Preview Independence

Measurement writes must not mark Preview stale.

Add regression coverage if this boundary is not already mechanically protected.

---

# 38. HistoricalPlan Independence

Do not republish HistoricalPlan merely because Measurement settings changed.

Historical Goal/plan provenance remains governed by its own publication semantics.

---

# 39. Progress Observation Boundary

Do not implement:

* Record Current Value;
* Record New Value;
* Correct Record;
* Remove Invalid Record;
* observation history;
* observation date/time forms.

Those are Task 5.17.

The Measurement UI may explain that a current value will be required, but it must not provide the reporting workflow.

---

# 40. Progress Boundary

Do not call Measurement configuration itself “Progress.”

Do not display:

* numerator;
* percentage;
* comparison;
* belowTarget;
* atTarget;
* aboveTarget;
* progress bars.

Task 5.18 owns Summary Progress.

---

# 41. Goal Activity Boundary

Do not modify Goal Activity presentation or calculations.

---

# 42. Summary Boundary

Do not add Measurement configuration to Summary.

Do not add Summary handoff controls yet unless an existing navigation primitive makes doing so unavoidable for component composition.

Cross-surface handoff belongs with later integration.

---

# 43. Policy Extensibility

The component may dispatch based on measurement policy.

Do not build a supposedly universal configuration form whose abstraction assumes every future policy has:

```text
targetValue
unitId
```

Manual Quantity V1 may have a bounded policy-specific form.

Prefer explicit semantics over premature abstraction.

---

# 44. Accessibility — Structure

Measurement must have a semantic heading within Goal detail.

Forms require:

* explicit labels;
* helper descriptions;
* associated validation messages;
* status/error semantics;
* native controls where appropriate.

Do not communicate active/stopped/protected state by color alone.

---

# 45. Accessibility — Setup Focus

When **Set up Measurement** opens:

* focus the first editable field.

Likely:

**Quantity target**

---

# 46. Accessibility — Change Focus

When **Change Measurement** opens:

* focus the first editable field;
* preserve prepopulated values.

---

# 47. Accessibility — Validation Focus

On invalid submit:

* focus the first invalid field;
* associate its error text programmatically.

---

# 48. Accessibility — Successful Save

After successful create/change/restart:

* return focus to a stable Measurement heading/status/action;
* do not lose keyboard position into the document body.

---

# 49. Accessibility — Cancel

Cancel should:

* discard only the local draft;
* restore focus to the action that opened the form where practical.

---

# 50. Accessibility — Stop Confirmation

Use the project's existing accessible confirmation pattern if one exists.

Ensure:

* keyboard operation;
* initial sensible focus;
* explicit destructive-but-non-delete wording;
* Cancel;
* focus restoration after close.

---

# 51. Accessibility — Conflict

Revision conflict should use alert/status semantics and place focus appropriately without destroying the user's draft.

---

# 52. Responsive Layout

The Measurement subsection must work at:

* wide desktop;
* narrow desktop;
* tablet;
* mobile.

Use existing responsive Goal patterns.

Avoid horizontal dependence.

---

# 53. Mobile Form

On mobile:

* target and unit controls may stack;
* action buttons may stack/full-width if consistent with existing styles;
* warning/help copy must wrap naturally;
* no horizontal scrolling;
* current target/unit must remain readable.

---

# 54. Information Density

When not editing, Measurement should be concise.

Do not permanently display:

* configuration forms;
* large explanatory essays;
* definition history;
* observation history.

Prefer:

```text
Measurement
Quantity toward a target
50,000 words

Change Measurement
Stop Measuring
```

with additional explanation only where semantically needed.

---

# 55. Definition History Boundary

Task 5.15 permits a compact previous-settings disclosure but does not require a full audit log.

Do not implement a full Measurement Definition history browser unless correction of an implementation blocker genuinely requires it.

If a simple existing query allows a small useful disclosure with negligible scope, document before adding it.

Default: defer.

---

# 56. User-Facing Terminology

Prefer:

* Measurement
* Quantity toward a target
* Quantity target
* Unit
* Set up Measurement
* Start Measurement
* Change Measurement
* Save Measurement Changes
* Stop Measuring
* Restart Measurement
* measurement period
* previous measurement settings

Avoid primary product copy containing:

* Measurement Definition;
* manualQuantityTarget@1;
* revision;
* epoch;
* policy version;
* authority;
* observation.

Architecture terminology may remain in code/tests.

---

# 57. Required Copy Semantics

The UI must communicate four facts without excessive explanation:

### Qualitative

> This Goal is not currently measured with a quantity target.

### Changing

> Changing the target or unit starts a new measurement period. Previous records remain in history, but you'll need to record a new current value.

### Unit change

> DayFrame does not convert previous values between units.

### Stopping

> The Goal remains unchanged. Previous measurement settings and records are preserved.

Wording may be refined for clarity while preserving meaning.

---

# 58. Error Mapping

Inspect canonical command/domain errors.

Map expected user-correctable errors to product language where possible.

Do not expose raw internal error identifiers as the primary message.

Unexpected errors may use the existing generic error/recovery pattern.

---

# 59. Protection/Error Distinction

Keep distinct:

```text
loading
known no measurement
active measurement
stopped measurement
unsupported policy
protected authority
durability failure
validation error
revision conflict
unexpected command failure
```

Do not collapse these into one empty/error state.

---

# 60. Subscription Behavior

Use canonical Measurement Definition subscriptions/read models.

The selected Goal's Measurement view should update when canonical authority changes.

Do not duplicate Measurement Definition state inside Goal authority or a persistent UI cache.

---

# 61. Selection Behavior

If selected Goal disappears because of:

* full clear;
* authority replacement;
* restore;

close/discard Measurement drafts and return to the existing safe Goal-selection state.

Do not leave a writable draft targeting a nonexistent Goal.

---

# 62. Profile Boundary

Profiles do not own Goals or Measurement Definitions.

Loading a profile must not replace Measurement authority.

Verify existing behavior remains unchanged.

---

# 63. Backup V6 Boundary

No Backup version change is authorized.

Measurement Definition authority already participates in Backup V6.

Task 5.16 adds presentation only.

---

# 64. Restore

After Backup V6 restore, Measurement UI must render canonical restored state through existing subscriptions/queries.

Do not restore UI drafts.

---

# 65. Older Backup Behavior

Respect existing compatibility semantics for backups predating Measurement Definition authority.

Do not reinterpret missing historical authority as corrupted data unless existing restore semantics do so.

---

# 66. Full Clear

After full clear:

* Goal selection clears according to existing behavior;
* Measurement draft closes;
* no stale target/unit remains visible;
* no derived UI cache survives.

---

# 67. Performance

Do not add component-level polling or repeated history scans on render.

A selected Goal should require only bounded canonical reads/subscriptions.

No all-Goal measurement dashboard is needed.

---

# 68. Dependency Boundary

Do not add a new runtime dependency for this workflow unless absolutely necessary.

Native form controls and existing component infrastructure should be sufficient.

If a dependency appears necessary, stop and justify it before adding it.

---

# 69. Bundle Baseline

Record production bundle size after implementation.

The verified post-5.14 baseline is:

```text
Main JS: 676.65 kB
Gzip:    168.21 kB
```

Compare Task 5.16 against that baseline.

Do not perform the permanent bundle architecture pass here.

If main JS approaches roughly **750–800 kB**, flag early inspection.

Do not raise the warning threshold.

Task 5.19 remains the mandatory Phase 5 bundle/code-splitting exit gate.

---

# 70. Component Placement

Prefer a bounded Measurement-specific child component rather than substantially enlarging `GoalSection`.

Candidate:

```text
GoalSection
    GoalMeasurementSection
```

or an equivalent repository-consistent name.

The child may own:

* presentation;
* ephemeral Measurement draft;
* validation presentation;
* focus behavior.

Canonical authority remains in state/application layers.

Do not force this exact component if current architecture suggests a cleaner equivalent.

---

# 71. Application Boundary

Consume existing Measurement Definition query/command APIs through the established application/store contract.

Do not import low-level persistence adapters directly into React.

Do not recreate domain validation in the component when canonical validation exists.

---

# 72. Test Strategy

Add focused tests covering the real user workflow.

At minimum test:

1. qualitative Goal renders neutral no-measurement state;
2. Set up Measurement opens form;
3. setup focuses first field;
4. valid target/unit starts measurement;
5. Goal authority remains unchanged;
6. Setup remains unchanged;
7. Preview staleness remains unchanged;
8. active measurement displays target/unit;
9. Change Measurement prepopulates current values;
10. target change displays new-period warning;
11. unit change displays no-conversion warning;
12. save change invokes canonical revision semantics;
13. unchanged save respects canonical no-op behavior;
14. Stop Measuring requires confirmation;
15. stop preserves Goal;
16. stopped state differs from never-measured state;
17. Restart Measurement prepopulates prior settings;
18. restart requires explicit save;
19. restart does not create an Observation;
20. completed Goal behavior matches chosen policy;
21. archived Goal behavior matches chosen policy;
22. unsupported policy is preserved/not editable;
23. protected authority is not shown as no measurement;
24. loading is not shown as no measurement;
25. durability failure/retry follows canonical behavior;
26. revision conflict preserves draft;
27. Cancel does not write;
28. Goal draft and Measurement draft remain independent;
29. keyboard/focus behavior;
30. responsive class/structure behavior where repository tests support it;
31. restore refreshes Measurement UI;
32. full clear removes stale selection/draft;
33. profile load does not replace Measurement authority.

Use existing test helpers where possible.

---

# 73. Focused Validation

Run the relevant focused suites for:

* Goal UI;
* new Measurement UI;
* Measurement Definition state/domain;
* DayFrameApp integration;
* Preview independence if needed;
* Backup/restore if touched by integration tests.

Record exact files and test counts.

---

# 74. Full Validation

Before declaring complete, run repository-standard canonical validation.

At minimum, if those are the established commands:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
git diff --check
```

Use actual repository scripts.

Report exact results rather than saying merely “green.”

---

# 75. Manual Product Walkthrough

Perform an actual browser walkthrough if the development environment permits it.

At minimum inspect:

### Desktop

* qualitative Goal;
* setup form;
* active state;
* change workflow;
* stop confirmation;
* stopped state;
* restart workflow;
* completed Goal;
* archived Goal;
* error/protection states where practical.

### Mobile/narrow

* form stacking;
* target/unit readability;
* action layout;
* confirmation;
* long helper copy;
* no horizontal overflow.

If not performed, state that explicitly.

Do not claim a walkthrough based only on DOM tests.

---

# 76. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.16_GOAL_MEASUREMENT_CONFIGURATION_V1_UX_RESULT.md`

The result must contain at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.15 Prerequisite Confirmation
4. Initial Implementation Audit
5. Files Changed
6. Component Placement
7. Application Boundary
8. Measurement Authority Consumption
9. Goal Detail Placement
10. Qualitative Goal State
11. Setup Workflow
12. Policy Presentation
13. Target Input
14. Unit Selector
15. Start Measurement
16. Active Measurement Presentation
17. Change Measurement
18. New-Period Warning
19. Unit-Conversion Warning
20. Change Save Semantics
21. No-Op Semantics
22. Stop Measuring
23. Stop Confirmation
24. Stopped Presentation
25. Restart Measurement
26. Restart Prepopulation
27. Restart Save Semantics
28. Unsupported Policy
29. Loading State
30. Protected State
31. Durability Failure
32. Revision Conflict
33. Draft Independence
34. Goal Draft Independence
35. Setup Independence
36. Goal Lifecycle Independence
37. Completed Goal Policy
38. Archived Goal Policy
39. Supporting Commitment Independence
40. Scheduler Independence
41. Preview Independence
42. HistoricalPlan Independence
43. Progress Observation Boundary
44. Progress Boundary
45. Goal Activity Boundary
46. Summary Boundary
47. Policy Extensibility
48. Error Mapping
49. Subscription Behavior
50. Selection/Clear Behavior
51. Profile Boundary
52. Backup V6 Boundary
53. Restore Behavior
54. Accessibility
55. Keyboard Behavior
56. Focus Behavior
57. Responsive Behavior
58. Mobile Behavior
59. Information Density
60. Terminology/Copy
61. Tests Added/Changed
62. Focused Validation
63. Full Validation
64. Manual Product Walkthrough
65. Bundle Comparison
66. Governance Updates
67. Deviations
68. Discoveries
69. Deferred Work
70. Measurement State Matrix
71. Measurement Lifecycle Matrix
72. Read/Write Matrix
73. Surface Boundary Matrix
74. Accessibility Matrix
75. Epistemic Matrix
76. Architectural Invariant Assessment
77. Stop-Condition Assessment
78. Architectural Alignment Assessment
79. Recommended Next Task
80. Final Completion Determination

---

# 77. Required Measurement State Matrix

Produce:

| State              | Presentation | Available actions | Must not imply |
| ------------------ | ------------ | ----------------- | -------------- |
| never measured     |              |                   |                |
| active             |              |                   |                |
| stopped            |              |                   |                |
| unsupported        |              |                   |                |
| loading            |              |                   |                |
| protected          |              |                   |                |
| durability failure |              |                   |                |
| revision conflict  |              |                   |                |

---

# 78. Required Measurement Lifecycle Matrix

Produce:

| User action   | Measurement Definition effect | Goal effect | Observation effect | Progress implication |
| ------------- | ----------------------------- | ----------- | ------------------ | -------------------- |
| Start         |                               |             |                    |                      |
| Change target |                               |             |                    |                      |
| Change unit   |                               |             |                    |                      |
| Stop          |                               |             |                    |                      |
| Restart       |                               |             |                    |                      |

---

# 79. Required Read/Write Matrix

Produce:

| Interaction      | Reads | Writes |
| ---------------- | ----- | ------ |
| view measurement |       |        |
| open setup       |       |        |
| start            |       |        |
| open change      |       |        |
| save change      |       |        |
| stop             |       |        |
| open restart     |       |        |
| restart          |       |        |

---

# 80. Required Surface Boundary Matrix

Produce:

| Surface/system         | Task 5.16 effect |
| ---------------------- | ---------------- |
| Planner / Plan         |                  |
| Goal authority         |                  |
| Measurement Definition |                  |
| Progress Observation   |                  |
| Progress projection    |                  |
| Goal Activity          |                  |
| Setup                  |                  |
| Schedule               |                  |
| Preview                |                  |
| Summary                |                  |
| Profiles               |                  |
| Backup V6              |                  |

---

# 81. Required Accessibility Matrix

Produce:

| Interaction       | Keyboard | Initial focus | Failure focus | Return focus |
| ----------------- | -------- | ------------- | ------------- | ------------ |
| setup             |          |               |               |              |
| change            |          |               |               |              |
| stop confirmation |          |               |               |              |
| restart           |          |               |               |              |
| revision conflict |          |               |               |              |

---

# 82. Required Epistemic Matrix

Produce:

| State/evidence                         | DayFrame may say | Must not say |
| -------------------------------------- | ---------------- | ------------ |
| no definition                          |                  |              |
| active definition                      |                  |              |
| changed target                         |                  |              |
| changed unit                           |                  |              |
| stopped                                |                  |              |
| restarted                              |                  |              |
| unsupported                            |                  |              |
| protected                              |                  |              |
| completed Goal + active measurement    |                  |              |
| active Goal + target reached elsewhere |                  |              |

---

# 83. Architectural Invariants

Assess at minimum:

1. Measurement configuration lives in Planner.
2. Measurement appears in selected Goal detail.
3. Goal creation remains independent.
4. Goal editing remains independent.
5. Setup remains independent.
6. Measurement Definition remains separate authority.
7. no Measurement state is stored in Goal.
8. Measurement drafts are ephemeral.
9. writes occur only on explicit save/action.
10. qualitative Goals remain valid.
11. no-definition is distinct from loading.
12. no-definition is distinct from protected.
13. no-definition is distinct from stopped.
14. policy identity is not exposed unnecessarily.
15. only supported policy fields are editable.
16. target uses canonical decimal semantics.
17. unit uses canonical identity.
18. no unit conversion occurs.
19. changing target starts a new measurement period.
20. changing unit starts a new measurement period.
21. prior definitions remain historical.
22. prior observations remain historical.
23. prior observations do not carry into the new period.
24. Stop Measuring is not deletion.
25. stopping preserves Goal.
26. stopping preserves observations.
27. restart begins a new measurement period.
28. restart does not create an observation.
29. restart requires new compatible evidence for future Progress.
30. Goal lifecycle does not mutate measurement.
31. measurement does not mutate Goal lifecycle.
32. supporting commitments remain independent.
33. measurement does not alter scheduler inputs.
34. measurement does not regenerate schedule.
35. measurement does not stale Preview.
36. measurement does not republish HistoricalPlan.
37. no Progress Observation UI is added.
38. no Progress percentage is added.
39. no Progress bar is added.
40. no Goal Activity behavior changes.
41. Summary remains unchanged.
42. unsupported policies remain preserved.
43. protected authority is not treated as absent.
44. durability failure is not hidden.
45. revision conflict does not silently overwrite.
46. cancel does not write.
47. Goal and Measurement drafts remain separate.
48. profile load does not own/replace Measurement authority.
49. Backup V6 remains unchanged.
50. restore rehydrates authority, not UI draft.
51. full clear leaves no stale Measurement UI.
52. no new authority is introduced.
53. no new persistence key is introduced.
54. no schema migration is introduced.
55. no Backup V7 is introduced.
56. no new runtime dependency is introduced without explicit justification.
57. accessible labels/errors/status are provided.
58. keyboard operation is complete.
59. focus is deterministic.
60. mobile use requires no horizontal scrolling.
61. product copy avoids architecture jargon.
62. no Recommendation semantics are introduced.
63. no pace/trend/forecast semantics are introduced.
64. no automatic Goal completion is introduced.
65. no causal inference is introduced.
66. Task 5.17 observation-history work remains deferred.
67. Task 5.18 Summary Progress remains deferred.
68. Task 5.19 bundle architecture remains mandatory.
69. bundle warning threshold is not raised.
70. canonical validation passes before completion.

Classify each as:

* Confirmed;
* Covered by test;
* Implemented;
* Preserved;
* Deferred;
* Prohibited;
* Not applicable;
* Blocked.

---

# 84. Governance

Update as appropriate:

* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Update `DECISIONS.md` or add an ADR **only if Task 5.16 discovers a genuinely new enduring architectural decision**.

Do not create an ADR merely for component placement or ordinary UX implementation.

---

# 85. Deferred Work

Explicitly retain:

### Task 5.17

Progress Observation Reporting V1 UX plus the bounded Goal-scoped observation-history read model required for correction/retraction.

### Task 5.18

Summary Progress V1 integration, Goal-centric Progress/Activity composition, provenance, and cross-surface handoffs.

### Task 5.19

Mandatory Phase 5 bundle architecture/code-splitting exit gate.

Also retain as later work:

* historical Progress controls;
* progress bars;
* new measurement policies;
* custom units;
* unit conversion;
* pace;
* trends;
* forecasts;
* Recommendations;
* adaptation;
* composite scores;
* automatic Goal completion.

---

# 86. Recommended Next Task

If Task 5.16 completes without a newly discovered prerequisite:

> **Task 5.17 — Progress Observation Reporting V1 UX and Goal-Scoped History Read Model.**

Do not begin it as part of Task 5.16.

---

# 87. Completion Criteria

Task 5.16 is complete only when:

* Measurement configuration is visible in selected Goal detail;
* qualitative Goals have a neutral state;
* users can set up Manual Quantity measurement;
* the one-option policy is not exposed as meaningless choice;
* canonical target validation is used;
* canonical units are presented with product labels;
* users can explicitly start measurement;
* active target/unit are readable;
* users can change target/unit;
* changing target/unit truthfully communicates a new measurement period;
* unit changes communicate no conversion;
* changes preserve prior history;
* old observations do not become evidence for the new period;
* users can stop measurement;
* stop requires explicit confirmation;
* stop is not represented as deletion;
* stopped state differs from never measured;
* users can restart measurement;
* restart may prepopulate previous settings without carrying evidence forward;
* unsupported policies are preserved and not reinterpreted;
* loading is distinct from absence;
* protected authority is distinct from absence;
* durability failure is represented truthfully;
* stale revision conflicts do not overwrite;
* drafts are ephemeral;
* Cancel does not write;
* Goal drafts and Measurement drafts remain independent;
* Setup remains independent;
* Goal lifecycle remains independent;
* supporting commitments remain independent;
* scheduler behavior remains unchanged;
* Preview staleness remains unchanged;
* HistoricalPlan publication remains unchanged;
* no Observation reporting UI is introduced;
* no Progress UI is introduced;
* no Goal Activity behavior is changed;
* Summary remains unchanged;
* Backup V6 remains unchanged;
* restore renders canonical Measurement authority;
* full clear removes stale Measurement UI;
* profiles do not acquire Measurement ownership;
* accessibility requirements are implemented;
* keyboard operation is complete;
* focus behavior is deterministic;
* responsive/mobile behavior is usable;
* no unnecessary runtime dependency is added;
* focused tests pass;
* full canonical validation passes;
* bundle size is measured against the 676.65 kB baseline;
* the warning threshold is not raised;
* Task 5.19 remains explicitly reserved;
* governance accurately records what was and was not implemented.

---

# 88. Final Implementation Principle

> **A Goal does not need measurement to be valid. When the user chooses to measure one, DayFrame should make the target understandable and editable while preserving the stricter historical rule underneath: changing what the Goal means quantitatively begins a new measurement period rather than rewriting what earlier evidence meant.**

---

# 89. Final Completion Statement

**Task 5.16 is complete when a user can configure, inspect, change, stop, and restart Manual Quantity measurement from the selected Goal in Planner / Plan through the canonical Measurement Definition authority; when qualitative Goals remain first-class; when target and unit changes preserve historical meaning by beginning new measurement periods without migrating evidence; when stopped, unsupported, loading, protected, durability-failure, and revision-conflict states remain mechanically and visibly distinct; when Goal, Setup, supporting commitments, scheduling, Preview, HistoricalPlan, Progress Observation, Goal Activity, Summary, Profiles, and Backup boundaries remain intact; when all writes are explicit and all drafts ephemeral; when accessibility, keyboard, focus, responsive, restore, clear, and persistence behavior are covered; when canonical validation passes and bundle growth is recorded against the 676.65 kB baseline without performing or postponing away the mandatory Task 5.19 exit gate; and when no Observation Reporting or Summary Progress functionality has leaked forward from Tasks 5.17 or 5.18.**
