# Task 5.15 — Progress Authoring and Summary Integration Readiness Audit

## Status

Ready for audit.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Read-only architecture, product-workflow, UX, accessibility, and implementation-readiness audit.

**No production behavior changes are authorized.**

---

# 1. Context

Tasks 5.1–5.14 established the first complete factual foundation for user-authored Goals and manually measured Progress.

The current conceptual chain is:

```text
Goal
    authored intent
        ↓
Measurement Definition
    how the Goal is measured
        ↓
Progress Observation
    durable measured-state evidence
        ↓
Manual Quantity Progress
    pure derived interpretation
```

The relevant implemented capabilities now include:

* independent durable Goal authority;
* Planner Goal V1 authoring;
* exact Goal-to-commitment relationships;
* frozen Goal-link HistoricalPlan provenance;
* Goal Activity derived intelligence;
* Measurement Definition V1 authority;
* `manualQuantityTarget@1`;
* Progress Observation V1 authority;
* immutable observation revision lineage;
* correction and retraction semantics;
* `observedAt` versus `recordedAt`;
* exact Measurement Definition epoch binding;
* Manual Quantity Progress V1;
* deterministic decimal arithmetic;
* known-zero versus insufficient-evidence distinction;
* unclamped percentages;
* policy/version provenance;
* `queryGoalProgress(...)`;
* no persisted derived Progress.

What does **not** yet exist is the complete user-facing workflow connecting those capabilities.

Task 5.15 determines how that workflow should work before implementation begins.

---

# 2. Purpose

Determine the smallest truthful and coherent V1 product workflow for:

1. configuring how a Goal is measured;
2. starting, changing, stopping, and restarting measurement;
3. recording measured quantity;
4. correcting or retracting observations;
5. viewing derived Progress;
6. inspecting why that Progress value exists;
7. keeping Goal Activity distinct from measured Progress;
8. preserving the Planner/Summary surface model;
9. handling incomplete, unavailable, protected, historical, and lifecycle states;
10. identifying the exact bounded implementation task or tasks that should follow.

This is a **readiness audit**, not an implementation task.

---

# 3. Governing Surface Principle

The preferred DayFrame mental model remains:

```text
Planner
    author intent
    configure plans
    perform explicit writes

Summary
    inspect derived understanding
    inspect historical evidence
    understand current state
```

Task 5.15 must test Progress workflows against this model rather than assuming every Goal-related action belongs on the same screen.

---

# 4. Governing Authority Principle

The UI must never blur:

```text
Goal
Measurement Definition
Progress Observation
Progress
```

into one writable object.

They remain separate concepts with separate semantics.

---

# 5. Governing Progress Principle

> Progress is derived interpretation, not authored state.

Therefore the user may author:

* a Goal;
* a Measurement Definition;
* a Progress Observation.

The user does **not** directly author:

* a percentage;
* a comparison state;
* a Progress score.

---

# 6. Governing Evidence Principle

For `manualQuantityTarget@1`:

```text
Progress numerator
    = effective Progress Observation

Progress denominator
    = effective Measurement Definition target
```

No UI workflow may imply that Goal Activity, schedule completion, or Goal lifecycle supplies either value.

---

# 7. Governing Write-Surface Principle

Planner remains the default home for authored intent.

However, Task 5.15 must explicitly determine whether recording a Progress Observation is best understood as:

### A. Planner authoring

### B. Summary reporting

### C. a contextual action accessible from both surfaces but backed by one canonical workflow

### D. another bounded interaction model

Do not assume the answer.

---

# 8. Governing Summary Principle

Summary is primarily read-oriented.

If an observation-entry action is eventually reachable from Summary, the audit must determine whether this violates that model or whether a clearly bounded reporting action is compatible with it.

Do not silently turn Summary into a general editing surface.

---

# 9. Governing Epistemic Principle

The UI must preserve these distinctions:

```text
notDefined
unsupportedPolicy
insufficientEvidence
known 0%
belowTarget
atTarget
aboveTarget
protected/unavailable
```

No state may be cosmetically collapsed into another.

---

# 10. Explicit Scope

Audit:

* existing Planner architecture;
* existing Summary architecture;
* Goal V1 workflow;
* Measurement Definition command/query surface;
* Progress Observation command/query surface;
* Manual Quantity Progress query/result;
* Goal Activity presentation;
* measurement-definition authoring workflow;
* observation-entry workflow;
* correction workflow;
* retraction workflow;
* Progress Summary placement;
* Goal Activity versus Progress hierarchy;
* no-definition behavior;
* insufficient-evidence behavior;
* known-zero behavior;
* > 100% behavior;
* inactive measurement behavior;
* unsupported-policy behavior;
* Goal lifecycle interactions;
* current versus historical semantics;
* provenance/drill-down;
* accessibility;
* keyboard behavior;
* focus behavior;
* responsive/mobile behavior;
* loading/protection/error states;
* implementation boundaries;
* likely test boundaries;
* likely follow-up tasks.

---

# 11. Explicit Non-Goals

Do not implement:

* UI;
* CSS;
* component changes;
* store changes;
* authority changes;
* schema changes;
* Backup changes;
* Measurement Definition changes;
* Progress Observation changes;
* Progress projection changes;
* Goal Activity changes;
* Recommendation;
* RecommendationDecision;
* adaptation;
* pace;
* forecast;
* trend;
* “on track”;
* “ahead”;
* “behind”;
* automatic Goal completion;
* automatic observation generation;
* Goal Activity → Progress conversion;
* ExecutionHistory → Progress conversion;
* unit conversion;
* custom units;
* new measurement policies;
* cross-Goal scoring;
* composite performance scores;
* machine learning;
* bundle optimization.

---

# 12. Execution Artifact Rules

Before auditing:

1. verify the complete Task 5.15 artifact;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review the results and relevant ADRs for Tasks 5.1–5.14;
6. review current Planner/Plan and Summary production code;
7. review Goal authoring UI;
8. review Goal Activity Summary UI;
9. review Measurement Definition domain/query/command surfaces;
10. review Progress Observation domain/query/command surfaces;
11. review Manual Quantity Progress projection/application query;
12. review existing accessibility/focus conventions;
13. review tests as evidence of actual behavior;
14. do not modify the immutable audit artifact.

Create:

`docs/implementation/phase-5/TASK_5.15_PROGRESS_AUTHORING_AND_SUMMARY_INTEGRATION_READINESS_AUDIT_RESULT.md`

---

# 13. Evidence Rules

Every significant finding must be classified as:

* **Confirmed** — directly supported by production code;
* **Covered by test** — deterministic behavior proven by automated tests;
* **Inferred** — strongly suggested but not mechanically guaranteed;
* **Not found** — no supporting implementation located;
* **Decision required** — multiple valid product choices remain;
* **Blocked** — implementation cannot proceed truthfully without prerequisite work.

Do not infer behavior from file names, comments, task artifacts, or architectural intent when production behavior differs.

---

# 14. Initial Architecture Audit

Document the current production paths for:

```text
Planner
GoalSection
Summary
Goal Activity
Measurement Definition
Progress Observation
queryGoalProgress
```

Identify:

* component ownership;
* application/store boundaries;
* subscriptions;
* command boundaries;
* query boundaries;
* current loading/protection/error patterns;
* current focus conventions;
* current responsive layout conventions.

---

# 15. Current Planner Audit

Determine what Planner currently owns.

At minimum inspect:

* Goal list;
* Goal detail;
* Goal create/edit;
* Goal lifecycle actions;
* commitment links;
* Setup scheduling editor;
* draft/save separation;
* ordering of Goal versus scheduling content;
* mobile behavior.

Answer:

> Where can measurement configuration fit without turning Goal authoring into an overloaded form?

---

# 16. Current Summary Audit

Determine what Summary currently presents.

At minimum inspect:

* range selection;
* historical plan coverage;
* Scheduling Realization;
* Scheduled Outcomes;
* Goal Activity;
* existing drill-down;
* async refresh behavior;
* focus behavior;
* responsive layout.

Answer:

> Where can Progress fit while remaining conceptually distinct from activity and execution?

---

# 17. Goal Detail Integration Audit

Evaluate whether Measurement Definition belongs inside Goal detail.

Candidate conceptual hierarchy:

```text
Goal
├── Authored intent
├── Supporting commitments
└── Measurement
```

Determine whether this is understandable and sufficiently bounded.

---

# 18. Measurement Section Audit

Evaluate a Goal-detail section conceptually like:

```text
Measurement

Measure this Goal by:
    Quantity toward a target

Target:
    50,000

Unit:
    words
```

Determine:

* required labels;
* explanatory copy;
* status presentation;
* active/inactive presentation;
* whether policy name should be visible;
* whether technical policy/version should remain hidden.

---

# 19. Measurement Definition Creation Workflow

Determine the smallest V1 flow for a qualitative Goal becoming measurable.

Potential interaction:

```text
Goal has no measurement
        ↓
Set up measurement
        ↓
Choose quantity target
        ↓
Target value
Unit
        ↓
Start measuring
```

Audit whether policy choice should be explicit when only one policy exists.

Strong candidate:

> Do not expose a meaningless one-option policy selector.

But verify against architecture.

---

# 20. Measurement Definition Edit Semantics

A change to:

* target;
* unit;
* policy;

creates a new definition epoch rather than mutating historical semantics.

Determine how UI must communicate this.

The user should understand that changing measurement configuration may require a new observation.

Avoid implementation-language such as “revision epoch” unless necessary.

---

# 21. Target Change UX

Evaluate copy such as:

> Changing the target starts a new measurement period. Previous measurements remain in history, but you’ll need to record a new value for the updated target.

Determine whether this accurately reflects authority behavior.

Do not imply previous evidence was deleted.

---

# 22. Unit Change UX

Evaluate equivalent behavior.

Example:

```text
50,000 words
    ↓
200 pages
```

Old word observations cannot satisfy the page definition.

No conversion exists.

Determine how much explanation is necessary before save.

---

# 23. Stop Measurement UX

Determine how the user intentionally makes the effective Measurement Definition inactive.

Potential action:

```text
Stop measuring this Goal
```

Audit:

* confirmation requirement;
* resulting Goal detail state;
* Summary behavior;
* preservation of historical measurement;
* whether “Stop measuring” is preferable to “Deactivate.”

---

# 24. Restart Measurement UX

Determine how measurement resumes.

Restart creates a new active definition revision/epoch and requires new compatible evidence.

Potential interaction:

```text
Start measuring again
```

Determine whether the prior target/unit should prepopulate the new draft.

Prepopulation must not imply evidence carry-forward.

---

# 25. Qualitative Goal UX

A Goal without Measurement Definition remains completely valid.

Determine appropriate copy.

Possible:

> This Goal is not currently measured with a quantity target.

Do not portray qualitative Goals as incomplete configuration.

---

# 26. Observation Entry Ownership

This is a central decision.

Evaluate at least:

### Option A — Planner Goal detail

```text
Goal
    Measurement
    Record progress
```

### Option B — Summary Progress card

```text
Progress
    Record current value
```

### Option C — canonical reporting flow reachable contextually from both

### Option D — separate reporting surface

Evaluate:

* mental model;
* discoverability;
* write/read separation;
* implementation complexity;
* mobile workflow;
* future policy extensibility.

Produce a recommendation.

---

# 27. Observation Terminology

Determine user-facing terminology.

Candidates:

* Record progress;
* Record current value;
* Update progress;
* Add measurement;
* Log measurement.

Avoid language implying the derived percentage itself is authored.

Strong candidate:

> **Record current value**

because the user is supplying evidence, not directly editing Progress.

Audit.

---

# 28. Observation Entry Form

For Manual Quantity V1, determine minimum fields:

```text
Current value
Observed date/time
```

`recordedAt` should normally be system-generated knowledge time.

Determine whether `observedAt` defaults to now but remains editable.

---

# 29. Observation Value Context

Entry form must show:

* Goal;
* target;
* unit;
* current definition context.

Example:

```text
Record current value

Goal: Draft Novel
Target: 50,000 words

Current value:
[ 12,400 ] words
```

Determine whether current derived Progress should also appear.

---

# 30. Absolute-Value Semantics

The UI must make clear that the user records:

> current total quantity

not:

> quantity added since last report.

Evaluate explicit helper copy.

This is critical.

---

# 31. Zero Observation UX

`0` is valid evidence.

Ensure form validation and copy do not treat zero as empty.

---

# 32. Above-Target Entry UX

Values above target are valid.

Do not warn as invalid merely because:

```text
observedValue > targetValue
```

Determine whether informational copy is useful or unnecessary.

---

# 33. Decreasing Observation UX

A later current value may be lower than an earlier one.

Do not block it.

Determine whether UI should:

* accept silently;
* show non-blocking confirmation;
* require explicit confirmation.

Do not infer user error without evidence.

---

# 34. Observation History Audit

Determine whether V1 needs an observation history presentation immediately.

Correction/retraction usability may require users to identify the observation being changed.

Audit existing query support.

---

# 35. Correction Workflow

Determine user-facing semantics for correcting an observation.

Potential language:

```text
Correct record
```

rather than:

```text
Edit
```

because historical revision lineage is preserved.

Determine:

* where action appears;
* fields editable;
* whether corrected record retains observedAt unless changed;
* confirmation requirements;
* how correction history is disclosed.

---

# 36. Retraction Workflow

Determine user-facing language.

Candidates:

* Remove record;
* Retract record;
* Mark record invalid.

Because authority does not hard-delete evidence, avoid misleading “Delete permanently.”

Determine whether confirmation is required.

Strong candidate: yes.

---

# 37. Correction vs New Observation

The UI must distinguish:

```text
I measured again later
    → new observation

I entered the earlier measurement incorrectly
    → correction
```

Audit how this distinction can be taught without overwhelming the workflow.

---

# 38. Backdated Observation UX

`observedAt` may precede `recordedAt`.

Determine how user records a measurement from yesterday, last week, etc.

Do not expose `recordedAt` as editable.

---

# 39. Future Observed Time

Audit domain validation.

If future `observedAt` is allowed by current authority, determine whether UI should permit it.

Do not invent a restriction unsupported by architecture without recording it as a decision.

---

# 40. Summary Progress Placement

Determine the best Summary hierarchy.

Candidate:

```text
Summary
├── Goal Activity
│   └── supporting work
└── Progress
    └── measured Goal state
```

Alternative:

```text
Summary
└── Goals
    ├── Activity
    └── Progress
```

Evaluate against current Summary architecture.

---

# 41. Goal-Centric Summary Model

Determine whether Goal Activity and Progress should eventually be grouped under each Goal.

Example:

```text
Draft Novel

Progress
12,400 of 50,000 words
24.8%

Activity
8 scheduled supporting occurrences
6 completed
...
```

This may create a clearer distinction between:

```text
what happened in support of the Goal
```

and:

```text
what measured state the Goal is in
```

Audit whether current component architecture supports this without redesigning Summary prematurely.

---

# 42. Progress Card Minimum Content

For available Manual Quantity Progress, audit whether V1 should show:

* Goal title;
* current value;
* target;
* unit;
* percentage;
* arithmetic comparison;
* observation date;
* target date;
* lifecycle;
* provenance action.

Determine minimum useful set.

---

# 43. Percentage Presentation

The projection may return:

```text
24.8
100
125
33.3333
```

Determine Summary formatting.

Questions:

* display all four canonical decimal places?
* format to one decimal?
* trim zeros?
* retain exact canonical value in accessible/provenance context?

Do not change core arithmetic in this audit.

---

# 44. Quantity-First Presentation

Evaluate whether Summary should emphasize:

```text
12,400 of 50,000 words
```

before:

```text
24.8%
```

Strong candidate: yes.

This keeps the authored measurement semantics visible.

---

# 45. Progress Bar Audit

Task 5.14 prohibited Progress UI entirely, including progress bars.

Task 5.15 may evaluate whether a future V1 Progress UI should use one.

Consider:

* > 100%;
* accessibility;
* semantic overemphasis;
* quantitative readability;
* mobile space;
* visual implication of completion.

Do not implement.

---

# 46. Over-Target Presentation

Determine truthful presentation for:

```text
60,000 of 50,000 words
120%
```

Do not clamp visual/text semantics to 100%.

Avoid celebratory or success language unless Goal lifecycle independently supports it—and even then do not conflate lifecycle with measurement.

---

# 47. At-Target Presentation

For:

```text
50,000 / 50,000
100%
Goal status: Active
```

UI must not say:

* Goal complete;
* Done;
* Success.

unless lifecycle separately says Completed.

---

# 48. Completed Goal Below Target

For:

```text
Goal status: Completed
Progress: 40%
```

present both facts without contradiction resolution.

The user owns Goal lifecycle.

---

# 49. Archived Goal

Determine whether Summary should:

* show archived Goals by default;
* hide them;
* offer historical access;
* show only if selected/range-relevant.

Do not infer the answer.

---

# 50. No Definition Summary State

Qualitative Goal:

```text
Progress
No quantity measurement configured
```

Determine whether this should appear at all or whether Progress section should omit such Goals.

Consider discoverability versus noise.

---

# 51. Insufficient Evidence Summary State

Definition exists, no effective observation:

```text
Target: 50,000 words
No current value recorded
```

This must not display 0%.

Determine whether Summary may offer contextual access to the reporting flow.

---

# 52. Known Zero Summary State

Explicit observation:

```text
0 of 50,000 words
0%
```

Must remain visibly different from no current value.

---

# 53. Inactive Measurement Summary State

After stop-measuring:

Determine whether current Summary says:

* Measurement stopped;
* Not currently measured;
* historical measurement available.

Do not present stale prior Progress as current without explicit historical framing.

---

# 54. Unsupported Policy Summary State

Future-proof presentation:

> This measurement method is not supported by this version of DayFrame.

Do not silently hide or reinterpret.

---

# 55. Protected Authority Summary State

Determine behavior for:

* Goal protection;
* Measurement Definition protection;
* Progress Observation protection.

Preserved data must not appear as zero/no data.

Reuse existing recovery language where possible.

---

# 56. Loading State

Determine whether Progress participates in existing Summary refresh/loading behavior.

Avoid stale Progress from previous query context appearing as current.

---

# 57. Error State

Determine bounded query error behavior.

Do not collapse query failure into insufficient evidence.

---

# 58. Current Goal Context vs Historical Measurement

Task 5.14 identified an important limitation:

Measurement Definition and Observation semantics can be reconstructed as-of the cutoff, but Goal title/lifecycle context is current.

Audit how UI should avoid implying:

> this Goal had this title/status at that historical cutoff

when that is not known.

---

# 59. Historical Progress Scope

Determine whether initial UI should expose historical `evaluationAsOf` selection.

Possible answers:

### A. Current Progress only initially

### B. Progress follows Summary range/cutoff

### C. explicit historical Progress inspection

Do not assume historical Progress belongs to the same date-range semantics as Goal Activity.

Manual Quantity Progress requires a cutoff, not a range.

---

# 60. Summary Range Interaction

Current Summary uses a historical date range and shared cutoff for existing projections.

Determine how Manual Quantity Progress should interact with it.

Potential semantic model:

```text
Summary range:
    activity/history window

Summary evaluation cutoff:
    Progress state known as of refresh/cutoff
```

Audit carefully.

---

# 61. Goal Activity vs Progress

The UI must explicitly distinguish:

```text
Goal Activity
    what supporting commitments were planned/reported

Progress
    what measured quantity was recorded
```

Develop bounded explanatory copy.

---

# 62. No Arithmetic Between Activity and Progress

Do not create statements such as:

* “You completed 80% of your activities, so you're 80% toward your Goal.”
* “Activity is ahead of Progress.”
* “Your schedule is producing results.”

Those require unsupported causal interpretation.

---

# 63. Progress Provenance Drill-Down

Determine whether Summary needs a bounded “Why this value?” interaction.

Potential detail:

```text
Measurement
Target: 50,000 words

Current recorded value
12,400 words
Observed: Aug 23
Recorded: Aug 23

Measurement method
Quantity toward target
```

Technical IDs/revisions generally should remain hidden unless useful for diagnostics.

---

# 64. Observation History vs Provenance

Do not confuse:

```text
Why is this the current Progress?
```

with:

```text
Show every historical observation.
```

Determine whether V1 needs both.

---

# 65. Definition History UX

Likewise determine whether users need to inspect old targets/units in V1.

Correction/retraction and historical Progress may make some history necessary, but avoid building a full audit-log product without need.

---

# 66. Planner-to-Summary Handoff

Evaluate contextual navigation:

```text
Planner Goal
    → View Progress

Summary Goal Progress
    → Configure Measurement
```

Determine whether cross-surface links improve comprehension without violating write boundaries.

---

# 67. Summary-to-Reporting Handoff

If observation entry does not live directly in Summary, determine whether Summary can offer:

```text
Record current value
```

that navigates/opens the canonical reporting workflow.

The action itself must not create evidence until explicit save.

---

# 68. Draft Semantics

Measurement Definition and Observation forms must use ephemeral UI drafts.

No authority writes on keystrokes.

---

# 69. Save Semantics

Determine explicit save labels.

Potential:

```text
Start Measurement
Save Measurement Changes
Record Value
Save Correction
```

Avoid ambiguous global “Save” where multiple authorities exist.

---

# 70. Unsaved Changes

Audit existing navigation behavior.

Determine whether measurement/observation drafts require unsaved-change protection or whether bounded inline forms are sufficient.

---

# 71. Revision Conflict UX

Measurement Definition and Progress Observation commands may use expected revisions.

Audit existing conflict behavior and determine required user-facing recovery.

Do not silently overwrite newer authority.

---

# 72. Goal Lifecycle and Measurement

Audit what happens when Goal becomes:

* Completed;
* Archived;
* Reactivated.

Determine whether measurement remains active automatically under current authority.

Do not invent coupling if none exists.

---

# 73. Completed Goal Observation Entry

Determine whether users may continue recording observations for a Completed Goal under existing authority.

If architecture permits it, decide whether UI should expose it.

Do not automatically prohibit based on intuition.

---

# 74. Archived Goal Observation Entry

Same audit.

---

# 75. Goal Reactivation

Determine whether reactivation affects measurement definition or observations.

Expected architectural answer may be “no,” but verify.

---

# 76. Measurement Definition Deletion Boundary

Confirm whether hard delete exists.

If not, UI must use lifecycle semantics such as stop measurement rather than delete.

---

# 77. Observation Deletion Boundary

Confirm no hard delete.

Retraction must be represented truthfully.

---

# 78. Unit Registry Presentation

Audit supported V1 units.

Determine user-facing labels and ordering.

Do not expose internal IDs if product labels exist.

---

# 79. Unit Selector

Determine whether native select is sufficient for V1.

Avoid premature searchable/custom-unit UI.

---

# 80. Numeric Input

Audit browser/input constraints against canonical decimal grammar.

Determine:

* `type=number` versus text/inputmode decimal;
* decimal separator behavior;
* leading zeros;
* maximum length;
* mobile keyboard behavior;
* accessibility.

Do not allow browser floating-point behavior to redefine canonical decimal semantics.

---

# 81. Date/Time Input

Audit `observedAt` editing.

Determine:

* local-time presentation;
* timezone conversion;
* seconds precision;
* default-now behavior;
* historical entry.

Preserve canonical stored timestamp semantics.

---

# 82. Accessibility Audit

Future implementation must support:

* semantic headings;
* explicit labels;
* field descriptions;
* error association;
* keyboard operation;
* focus entry;
* focus recovery after save/cancel;
* status announcements;
* no color-only Progress semantics;
* accessible percentage/quantity reading;
* confirmation-dialog focus where applicable.

---

# 83. Progress Bar Accessibility

If recommended, require textual quantity and percentage independently of the visual bar.

A bar may never be the sole carrier of Progress information.

---

# 84. Focus — Measurement Creation

Determine desired focus when “Set up measurement” opens.

Likely first editable field.

---

# 85. Focus — Observation Entry

Determine desired focus when “Record current value” opens.

Likely value input.

---

# 86. Focus — Validation Failure

Return focus to first invalid field.

---

# 87. Focus — Correction

Focus corrected value or first editable field.

---

# 88. Focus — Retraction Confirmation

Use existing accessible confirmation conventions.

---

# 89. Focus — Summary Drill-Down

Reuse existing keyboard-only inserted-detail focus behavior where appropriate.

Pointer activation should not unexpectedly move focus.

---

# 90. Responsive Audit

Test conceptual workflows at:

* wide desktop;
* narrow desktop;
* tablet;
* mobile.

Avoid tables as the primary interaction structure.

---

# 91. Mobile Measurement Form

Ensure target/unit controls stack cleanly.

---

# 92. Mobile Observation Entry

Value/unit context and observed time must remain understandable without horizontal scrolling.

---

# 93. Mobile Progress Card

Quantity and percentage should not compete for width.

Audit hierarchy rather than simply shrinking typography.

---

# 94. Information Density

Goal detail already contains authored fields, lifecycle, and supporting commitments.

Determine whether Measurement should be:

* always expanded;
* collapsed section;
* separate detail subsection;
* contextual secondary panel.

Avoid making Goal cards themselves carry full measurement workflow.

---

# 95. Planner Naming

Current product terminology may use Planner / Plan.

Use actual current production navigation terminology consistently.

Document any mismatch rather than renaming in this audit.

---

# 96. Progress Terminology

Determine whether user-facing heading should simply be:

```text
Progress
```

rather than:

```text
Manual Quantity Progress
```

The latter is an architectural identity, not necessarily product language.

---

# 97. Measurement Terminology

Prefer product language such as:

```text
Measurement
Quantity target
Current value
```

over:

```text
Measurement Definition
Progress Observation
```

unless technical terms are necessary.

---

# 98. Correction Terminology

Determine product-safe distinction between:

```text
Record new value
Correct previous value
```

This distinction is more important than exposing “revision lineage.”

---

# 99. Retraction Terminology

Determine whether “Remove incorrect record” with explanatory confirmation is clearer than “Retract observation.”

But do not imply hard deletion.

---

# 100. Existing Goal Activity Preservation

No Goal Activity semantics or presentation may be silently changed by the eventual Progress integration unless the audit explicitly recommends a bounded restructuring.

---

# 101. Existing Summary Preservation

Scheduling Realization, Scheduled Outcomes, reporting coverage, and their existing epistemic distinctions must remain intact.

---

# 102. Existing Planner Preservation

Setup scheduling workflow remains independent of Goal measurement configuration.

Measurement changes must not imply schedule changes.

---

# 103. Preview Independence

Measurement configuration or observation entry should not stale Preview unless current production architecture already does so for an explicit reason.

Verify.

Expected: no Preview effect.

---

# 104. Scheduler Independence

Measurement/Progress must not affect scheduling.

---

# 105. Commitment Independence

Recording Progress does not modify supporting commitments.

---

# 106. Goal Activity Independence

Recording Progress does not modify Goal Activity evidence.

---

# 107. Backup Boundary

No Backup version change should be necessary merely for UI integration because the authorities already participate in Backup V6.

Verify.

---

# 108. Restore UX

Determine whether restored measurement/observation authority naturally appears through subscriptions/queries.

No cached Progress should require restoration.

---

# 109. Full Clear UX

Determine how open measurement/observation drafts and Summary selections react when authorities clear.

---

# 110. Protected Restore UX

Reuse authority-specific protected/recovery states.

Do not let a protected observation authority appear as “No current value.”

---

# 111. Performance

Audit expected UI query shape.

Avoid:

```text
one query per Goal
    ×
one query per observation
    ×
one query per definition
```

if a bounded aggregate query or concurrent projection strategy is preferable.

Identify potential N+1 problems before implementation.

---

# 112. Subscription Strategy

Determine whether Summary Progress should:

* query on refresh only;
* subscribe to authority changes;
* reuse existing Summary refresh model;
* combine both.

Preserve stale-request rejection.

---

# 113. Current Summary Cutoff

Audit how Summary currently captures evaluation cutoff.

Determine whether Progress can reuse exactly that cutoff.

Strong preference: yes, if semantics align.

---

# 114. Multi-Goal Query Readiness

`queryGoalProgress(goalId, evaluationAsOf)` is single-Goal.

Audit whether Summary needs:

```text
queryAllGoalProgress(...)
```

or can safely issue bounded concurrent queries.

Do not create an aggregate API unless justified.

---

# 115. Goal Count Scalability

Consider realistic Goal counts and query complexity.

Do not over-engineer for thousands of Goals without evidence.

---

# 116. Observation History Query Readiness

Correction/retraction UI may require:

* list observations for Goal;
* list lineage revisions;
* effective/current status.

Audit whether canonical queries already exist.

If not, classify exact missing query capability.

---

# 117. Definition History Query Readiness

Same for target/unit history.

Do not add it in this audit.

---

# 118. Command Readiness

Map exact commands required for future UI:

### Measurement

* create/start;
* revise;
* stop;
* restart.

### Observation

* record;
* correct;
* retract.

Identify missing application boundaries.

---

# 119. Protection Readiness

Confirm each command/query has a truthful protected-authority behavior suitable for UI.

---

# 120. Validation Readiness

Map domain validation errors to potential user-facing form errors.

Identify any errors currently too technical for UI presentation.

---

# 121. Conflict Readiness

Map revision conflicts to recoverable product behavior.

---

# 122. Policy Extensibility

Future policies may require very different forms.

Do not design Measurement UI as though every future policy has:

```text
targetValue + unitId
```

Keep policy-specific configuration bounded.

---

# 123. Observation Extensibility

Likewise future policies may use evidence unlike a single quantity.

Avoid generic “ObservationForm” abstractions that assume Manual Quantity semantics are universal.

---

# 124. Summary Extensibility

Progress result cards may eventually dispatch by policy.

Audit whether current Summary composition can support policy-specific Progress presentation.

---

# 125. No Recommendation Leakage

Progress copy must not introduce:

* “Good progress”;
* “Needs attention”;
* “You should…”;
* “At this rate…”;
* “You’re falling behind.”

Those belong to later intelligence layers.

---

# 126. No Target-Date Interpretation

Target date may be shown as authored context.

Do not calculate pace against it.

---

# 127. No Goal Score

Do not combine:

* Goal Activity;
* Progress percentage;
* completion distribution;
* scheduling realization;

into a composite.

---

# 128. No Performance Judgment

Do not frame Progress as user performance.

---

# 129. No Causal Claim

Do not claim supporting commitments caused measured Progress.

---

# 130. Implementation Slicing Audit

Determine whether the next work should be:

### One implementation task

Measurement authoring + observation reporting + Summary Progress.

or:

### Multiple bounded tasks

For example:

```text
5.16
Measurement Configuration UX

5.17
Progress Observation Reporting UX

5.18
Summary Progress Integration
```

Evaluate based on:

* authority boundaries;
* component scope;
* test complexity;
* accessibility;
* regression risk.

Strong preference:

> Split implementation if doing all three workflows at once would make semantic review difficult.

---

# 131. Preferred Implementation Sequence

Evaluate this candidate:

```text
5.16
Measurement Configuration UX

5.17
Progress Observation Reporting UX

5.18
Summary Progress Integration

5.19
Phase 5 bundle architecture / code splitting
```

This is only a candidate.

The audit must recommend the actual sequence.

---

# 132. Bundle Architecture Reminder

The main production bundle was approximately:

```text
676.65 kB
```

after Task 5.14.

The permanent bundle architecture/code-splitting pass remains a **mandatory Phase 5 exit task**.

Task 5.15 should:

* record current baseline if build evidence is available;
* estimate whether proposed UI work introduces substantial dependencies;
* prohibit solving bundle size during the audit;
* ensure the recommended roadmap reserves the Phase 5 exit performance task.

If the bundle crosses roughly 750–800 kB before then, flag an early inspection.

Do not raise the warning threshold merely to silence the advisory.

---

# 133. Required Workflow Diagram

Produce a recommended end-to-end V1 workflow.

Example form:

```text
Planner
    Goal
      ↓
    Configure Measurement
      ↓
    Measurement active

Canonical reporting interaction
      ↓
    Record current value
      ↓
    Progress Observation authority

Summary
      ↓
    queryGoalProgress
      ↓
    Quantity + Target + Percentage
      ↓
    Provenance
```

Use the actual recommendation from the audit.

---

# 134. Required Surface Ownership Matrix

Produce:

| Capability                  | Planner | Summary | Contextual flow | Other |
| --------------------------- | ------: | ------: | --------------: | ----: |
| Create Goal                 |         |         |                 |       |
| Edit Goal                   |         |         |                 |       |
| Configure measurement       |         |         |                 |       |
| Stop/restart measurement    |         |         |                 |       |
| Record current value        |         |         |                 |       |
| Correct record              |         |         |                 |       |
| Retract record              |         |         |                 |       |
| View Progress               |         |         |                 |       |
| View Goal Activity          |         |         |                 |       |
| Inspect Progress provenance |         |         |                 |       |

---

# 135. Required Authority/Interaction Matrix

Produce:

| Interaction           | Reads | Writes |
| --------------------- | ----- | ------ |
| Configure measurement |       |        |
| Change target         |       |        |
| Stop measurement      |       |        |
| Restart measurement   |       |        |
| Record value          |       |        |
| Correct value         |       |        |
| Retract value         |       |        |
| View Progress         |       |        |
| View provenance       |       |        |

---

# 136. Required State Matrix

Produce:

| State                            | Planner presentation | Summary presentation | Writable? |
| -------------------------------- | -------------------- | -------------------- | --------: |
| no definition                    |                      |                      |           |
| active definition/no observation |                      |                      |           |
| known zero                       |                      |                      |           |
| below target                     |                      |                      |           |
| at target                        |                      |                      |           |
| above target                     |                      |                      |           |
| inactive definition              |                      |                      |           |
| unsupported policy               |                      |                      |           |
| protected definition             |                      |                      |           |
| protected observation            |                      |                      |           |
| missing Goal                     |                      |                      |           |

---

# 137. Required Measurement Lifecycle Matrix

Produce:

| User action         | Authority consequence | Evidence consequence | Progress consequence |
| ------------------- | --------------------- | -------------------- | -------------------- |
| Start measurement   |                       |                      |                      |
| Change target       |                       |                      |                      |
| Change unit         |                       |                      |                      |
| Stop measurement    |                       |                      |                      |
| Restart measurement |                       |                      |                      |

---

# 138. Required Observation Matrix

Produce:

| User intent                          | Correct operation |
| ------------------------------------ | ----------------- |
| report current quantity now          |                   |
| report quantity measured yesterday   |                   |
| measured again today                 |                   |
| prior record was entered incorrectly |                   |
| prior record should not count        |                   |
| quantity decreased                   |                   |
| quantity exceeded target             |                   |

---

# 139. Required Summary Hierarchy Matrix

Compare at least:

| Option                                     | Strengths | Weaknesses | Recommendation |
| ------------------------------------------ | --------- | ---------- | -------------- |
| separate Goal Activity + Progress sections |           |            |                |
| Goal-centric grouping                      |           |            |                |
| Progress-only new section                  |           |            |                |
| another discovered structure               |           |            |                |

---

# 140. Required Copy Matrix

Produce recommended product copy for:

* Set up measurement;
* target;
* unit;
* Start Measurement;
* Change Measurement;
* Stop Measuring;
* Restart Measurement;
* Record Current Value;
* current total explanation;
* Correct Record;
* retract/remove-invalid-record action;
* no measurement;
* no current value;
* known zero;
* above target;
* unsupported policy;
* protected authority;
* Activity versus Progress distinction.

---

# 141. Required Accessibility Matrix

Produce:

| Interaction              | Keyboard | Focus | Screen-reader semantics | Risk |
| ------------------------ | -------- | ----- | ----------------------- | ---- |
| configure measurement    |          |       |                         |      |
| record value             |          |       |                         |      |
| correct record           |          |       |                         |      |
| retract record           |          |       |                         |      |
| Progress drill-down      |          |       |                         |      |
| cross-surface navigation |          |       |                         |      |

---

# 142. Required Responsive Matrix

Produce:

| Area                | Desktop | Narrow | Mobile |
| ------------------- | ------- | ------ | ------ |
| Goal measurement    |         |        |        |
| observation entry   |         |        |        |
| observation history |         |        |        |
| Progress summary    |         |        |        |
| provenance          |         |        |        |

---

# 143. Required Query/Command Readiness Matrix

Produce:

| Needed capability    | Existing API? | Adequate? | Missing work |
| -------------------- | ------------: | --------: | ------------ |
| effective definition |               |           |              |
| definition history   |               |           |              |
| start measurement    |               |           |              |
| revise measurement   |               |           |              |
| stop/restart         |               |           |              |
| record observation   |               |           |              |
| correct observation  |               |           |              |
| retract observation  |               |           |              |
| observation history  |               |           |              |
| query Progress       |               |           |              |
| multi-Goal Progress  |               |           |              |

---

# 144. Required Current/Historical Semantics Matrix

Produce:

| Field                  | Current or as-of? | User-facing implication |
| ---------------------- | ----------------- | ----------------------- |
| Goal title             |                   |                         |
| Goal lifecycle         |                   |                         |
| Goal target date       |                   |                         |
| Measurement Definition |                   |                         |
| target value           |                   |                         |
| unit                   |                   |                         |
| observation value      |                   |                         |
| observedAt             |                   |                         |
| recordedAt             |                   |                         |
| percentage             |                   |                         |

---

# 145. Required Product-Boundary Matrix

Produce:

| Capability             | Status after 5.15 |
| ---------------------- | ----------------- |
| Goal authoring         |                   |
| Measurement authority  |                   |
| Observation authority  |                   |
| Progress projection    |                   |
| Measurement UI         |                   |
| Observation UI         |                   |
| Progress UI            |                   |
| Goal Activity          |                   |
| Progress provenance UI |                   |
| pace                   |                   |
| trend                  |                   |
| Recommendation         |                   |
| adaptation             |                   |
| bundle optimization    |                   |

Use:

* Implemented;
* Ready;
* Deferred;
* Prohibited;
* Blocked.

---

# 146. Required Epistemic Matrix

Produce:

| Evidence/state        | DayFrame may say | Must not say |
| --------------------- | ---------------- | ------------ |
| 12,400 / 50,000       |                  |              |
| 0 / 50,000            |                  |              |
| no observation        |                  |              |
| 60,000 / 50,000       |                  |              |
| completed Goal at 40% |                  |              |
| active Goal at 100%   |                  |              |
| target date passed    |                  |              |
| high Goal Activity    |                  |              |
| low Goal Activity     |                  |              |
| measurement stopped   |                  |              |
| unsupported policy    |                  |              |
| protected evidence    |                  |              |

---

# 147. Required Implementation Slice Matrix

Produce:

| Candidate slice         | Scope | Risk | Dependencies | Recommendation |
| ----------------------- | ----- | ---- | ------------ | -------------- |
| Measurement UX          |       |      |              |                |
| Observation UX          |       |      |              |                |
| Summary Progress        |       |      |              |                |
| Combined implementation |       |      |              |                |
| Bundle pass             |       |      |              |                |

---

# 148. Required Architectural Invariant Assessment

Classify at least:

1. Planner remains the primary authored-intent surface.
2. Summary remains primarily read-oriented.
3. Goal remains independent authority.
4. Measurement Definition remains independent authority.
5. Progress Observation remains independent authority.
6. Progress remains derived.
7. users never directly author Progress percentage.
8. measurement configuration does not mutate Goal.
9. observation entry does not mutate Goal.
10. observation entry does not mutate Measurement Definition.
11. Progress does not mutate Goal lifecycle.
12. Goal Activity remains distinct from Progress.
13. ExecutionHistory remains distinct from Progress Observation.
14. supporting commitment completion does not become Progress.
15. measurement changes do not alter schedule.
16. observation changes do not alter schedule.
17. measurement changes do not stale Preview.
18. observation changes do not stale Preview.
19. target changes create a new measurement epoch.
20. unit changes create a new measurement epoch.
21. old observations do not carry into a new epoch.
22. stopping measurement preserves history.
23. restarting measurement requires new compatible evidence.
24. qualitative Goals remain valid.
25. no observation remains distinct from zero.
26. above-target remains valid.
27. decreasing observations remain valid.
28. corrections remain revisions, not destructive edits.
29. retractions remain durable history, not hard deletes.
30. observedAt remains user-measurement time.
31. recordedAt remains system knowledge time.
32. backdated evidence remains supported if authority allows it.
33. current Goal context is not falsely presented as historical.
34. historical measurement semantics remain cutoff-governed.
35. target date does not create pace semantics.
36. lifecycle does not change numeric Progress.
37. Goal Activity does not create causal Progress claims.
38. Progress UI must show quantity context.
39. percentage must not be sole semantic carrier.
40. > 100% must not be visually clamped without disclosure.
41. protected evidence must not appear as zero/no evidence.
42. unsupported policy must remain explicit.
43. inactive measurement must remain explicit.
44. loading must not masquerade as empty.
45. errors must not masquerade as insufficient evidence.
46. UI drafts must remain ephemeral.
47. writes occur only on explicit action.
48. revision conflicts must not silently overwrite.
49. measurement history must remain inspectable where correction requires it.
50. observation history must remain inspectable where correction/retraction requires it.
51. technical revision IDs need not be primary product copy.
52. policy-specific UI must not pretend all future policies share Manual Quantity shape.
53. Summary integration must avoid N+1 behavior where reasonably possible.
54. Summary stale-request protection must remain intact.
55. Backup V6 remains authority-only.
56. derived Progress remains absent from Backup.
57. restore re-derives Progress.
58. full clear requires no Progress participant.
59. no new authority is required for UI.
60. no new Backup version is required solely for UI.
61. no Recommendation exists.
62. no pace exists.
63. no trend exists.
64. no forecast exists.
65. no automatic Goal completion exists.
66. no composite Goal score exists.
67. no adaptation exists.
68. no machine learning exists.
69. Phase 5 bundle pass remains reserved.
70. no unresolved readiness blocker remains before the recommended implementation slice.

Use:

* Confirmed;
* Covered by test;
* Inferred;
* Decision required;
* Ready;
* Deferred;
* Prohibited;
* Blocked.

---

# 149. Stop Conditions

Stop and report rather than recommending implementation if:

* Measurement Definition commands cannot support a truthful user workflow;
* Observation commands cannot support record/correct/retract;
* required observation history cannot be queried;
* required definition history cannot be queried where needed;
* revision conflicts cannot be surfaced safely;
* protection states cannot be represented truthfully;
* Summary cannot consume Progress without changing its semantics;
* Planner cannot host measurement configuration without authority coupling;
* observation entry requires directly editing derived Progress;
* correction requires destructive history rewrite;
* retraction requires hard deletion;
* current-vs-historical semantics cannot be explained truthfully;
* Goal Activity and Progress cannot be separated in the existing Summary architecture;
* measurement UI requires a new authority/schema;
* observation UI requires a new authority/schema;
* Progress UI requires persisted derived state;
* implementation would require schedule/Preview coupling;
* a Backup version change is unexpectedly required;
* the recommended implementation slice is too broad to validate safely.

Do not solve blockers in this audit.

---

# 150. Validation

Because this is an audit:

* do not modify production code;
* do not modify tests merely to make findings convenient;
* inspect existing relevant tests;
* run targeted tests only where necessary to confirm behavior;
* run lint/typecheck/build only if required by repository audit conventions.

Record exactly what was and was not executed.

---

# 151. Manual Product Walkthrough

Perform a read-only walkthrough where practical of:

### Planner

* Goal list;
* Goal detail;
* Goal creation/editing;
* lifecycle;
* supporting commitments;
* current density/responsive behavior.

### Summary

* Goal Activity;
* Scheduling Realization;
* Scheduled Outcomes;
* drill-down;
* range/refresh;
* responsive behavior.

Do not claim interactions that were not actually exercised.

---

# 152. Governance

On completion update only audit/governance artifacts as repository convention permits.

At minimum produce:

`docs/implementation/phase-5/TASK_5.15_PROGRESS_AUTHORING_AND_SUMMARY_INTEGRATION_READINESS_AUDIT_RESULT.md`

Update:

* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;

only if audit conventions call for those updates.

Do not mark Measurement UI, Observation UI, or Progress UI implemented.

---

# 153. Required Result Artifact

The Task 5.15 result must contain at least:

1. Executive Result
2. Artifact Integrity
3. Task 5.1–5.14 Prerequisite Confirmation
4. Audit Method
5. Files Reviewed
6. Tests Reviewed/Executed
7. Current Planner Architecture
8. Current Summary Architecture
9. Goal Workflow Findings
10. Measurement Definition API Readiness
11. Progress Observation API Readiness
12. Progress Projection API Readiness
13. Goal Detail Integration Assessment
14. Measurement Configuration Workflow
15. Measurement Creation
16. Target Change
17. Unit Change
18. Stop Measurement
19. Restart Measurement
20. Qualitative Goal State
21. Observation Entry Ownership Decision
22. Observation Terminology
23. Observation Entry Form
24. Absolute-Value Semantics
25. Backdated Observation
26. Zero Observation
27. Above-Target Observation
28. Decreasing Observation
29. Observation History
30. Correction Workflow
31. Retraction Workflow
32. Correction-vs-New-Observation Distinction
33. Summary Progress Placement
34. Goal-Centric Summary Assessment
35. Progress Card Content
36. Quantity/Percentage Hierarchy
37. Progress-Bar Assessment
38. Over-Target Presentation
39. At-Target Presentation
40. Completed-Goal Presentation
41. Archived-Goal Presentation
42. No-Definition Presentation
43. Insufficient-Evidence Presentation
44. Known-Zero Presentation
45. Inactive-Measurement Presentation
46. Unsupported-Policy Presentation
47. Protected/Loading/Error Presentation
48. Current-vs-Historical Semantics
49. Historical Progress Scope
50. Summary Range/Cutoff Interaction
51. Goal Activity/Progress Distinction
52. Progress Provenance
53. Observation/Definition History Boundary
54. Cross-Surface Navigation
55. Draft/Save Semantics
56. Revision Conflict UX
57. Goal Lifecycle Interaction
58. Unit/Numeric Input
59. Date/Time Input
60. Accessibility
61. Focus Behavior
62. Responsive/Mobile Behavior
63. Information Density
64. Terminology
65. Existing Surface Preservation
66. Scheduler/Preview Independence
67. Backup/Restore/Clear Boundary
68. Query Performance
69. Subscription Strategy
70. Multi-Goal Query Readiness
71. Query/Command Gaps
72. Policy Extensibility
73. Recommendation Boundary
74. Implementation Slicing Decision
75. Recommended Sequence
76. Bundle Exit-Gate Confirmation
77. Workflow Diagram
78. Surface Ownership Matrix
79. Authority/Interaction Matrix
80. State Matrix
81. Measurement Lifecycle Matrix
82. Observation Matrix
83. Summary Hierarchy Matrix
84. Copy Matrix
85. Accessibility Matrix
86. Responsive Matrix
87. Query/Command Readiness Matrix
88. Current/Historical Semantics Matrix
89. Product-Boundary Matrix
90. Epistemic Matrix
91. Implementation Slice Matrix
92. Architectural Invariant Assessment
93. Stop-Condition Assessment
94. Architectural Alignment Assessment
95. Governance Updates
96. Deviations
97. Discoveries
98. Deferred Work
99. Recommended Next Task
100. Final Readiness Determination

---

# 154. Completion Criteria

Task 5.15 is complete only when:

* current Planner and Summary production behavior has been traced;
* Goal authoring integration points are documented;
* Measurement Definition command/query readiness is established;
* Progress Observation command/query readiness is established;
* `queryGoalProgress` readiness is established;
* the exact user workflow for configuring Manual Quantity measurement is recommended;
* qualitative Goals remain first-class;
* target-change UX preserves epoch semantics;
* unit-change UX preserves epoch semantics;
* stop/restart semantics are mapped;
* the canonical ownership of observation entry is decided;
* user-facing observation terminology is recommended;
* the observation form's minimum fields are established;
* absolute-current-value semantics are made explicit;
* observed zero is distinguished from no observation;
* above-target and decreasing observations remain valid;
* backdated observation behavior is mapped;
* correction is distinguished from a new observation;
* correction preserves immutable revision lineage;
* retraction is distinguished from hard deletion;
* required observation-history support is established or identified as a blocker;
* required definition-history support is established or bounded;
* Summary placement for Progress is recommended;
* Goal Activity and Progress remain semantically separate;
* quantity versus percentage hierarchy is decided;
* Progress-bar suitability is assessed;
* > 100% presentation remains truthful;
* 100% does not imply lifecycle completion;
* Completed below-target Goals remain representable;
* archived Goal behavior is decided;
* no-definition presentation is decided;
* insufficient-evidence presentation is decided;
* known-zero presentation is decided;
* inactive measurement presentation is decided;
* unsupported policy presentation is decided;
* protected/loading/error states remain distinct;
* current Goal context is not misrepresented as historical Goal context;
* historical Progress scope is bounded;
* Summary range versus Progress cutoff semantics are settled;
* Progress provenance/drill-down requirements are established;
* cross-surface navigation is evaluated;
* drafts remain ephemeral;
* writes remain explicit;
* revision conflicts have a recoverable UX;
* Goal lifecycle does not silently mutate measurement;
* supported unit presentation is established;
* numeric input does not redefine canonical decimal semantics;
* observed date/time UX preserves `observedAt`/`recordedAt`;
* accessibility requirements are concrete;
* keyboard/focus behavior is concrete;
* responsive/mobile behavior is concrete;
* existing Planner and Summary semantics are preserved;
* scheduler and Preview independence are preserved;
* Backup V6 remains authority-only unless a blocker proves otherwise;
* restore/full-clear behavior is understood;
* likely query-performance risks are identified;
* subscription/refresh strategy is recommended;
* multi-Goal Progress query needs are assessed;
* all missing query/command capabilities are explicitly identified;
* future measurement-policy extensibility is preserved;
* no Recommendation, pace, trend, forecast, adaptation, Goal score, automatic completion, or causal interpretation is introduced;
* the implementation is divided into the smallest safely reviewable slice or slices;
* a concrete post-audit task sequence is recommended;
* the Phase 5 bundle-architecture/code-splitting task remains a mandatory exit gate;
* the ~676.65 kB post-5.14 main-bundle baseline remains recorded for comparison;
* no bundle warning threshold is raised merely to silence the advisory;
* no unresolved stop condition remains before the recommended next implementation task.

---

# 155. Preferred Audit Outcome

If existing APIs are sufficient, a likely healthy outcome would be:

```text
Planner
    Goal
      └── Measurement configuration

Contextual reporting workflow
    Record Current Value
    Correct Record
    Remove Invalid Record

Summary
    Goal
      ├── Progress
      └── Activity
```

But this is **not predetermined**.

The audit must prefer actual production architecture and truthful workflow over this candidate.

---

# 156. Recommended Next-Task Rule

If the audit finds all required APIs ready and recommends separated implementation slices, prefer:

> **Task 5.16 — Goal Measurement Configuration V1 UX**

followed by a separate Observation UX task and Summary Progress integration task.

If the audit demonstrates that another slice order is safer or that prerequisite query/application work is missing, its recommendation governs instead.

---

# 157. Final Audit Principle

> **The user should experience Progress as a simple answer to “Where am I now relative to the target I chose?” even though DayFrame preserves the much stricter authority, evidence, revision, and historical boundaries required to answer that question truthfully.**

---

# 158. Final Completion Statement

**Task 5.15 is complete when DayFrame's implemented Goal, Measurement Definition, Progress Observation, Goal Activity, and Manual Quantity Progress architecture has been audited end-to-end against the real Planner and Summary surfaces; when the user-facing workflows for configuring measurement, recording current measured state, correcting and retracting evidence, and viewing derived Progress have been specified without collapsing their separate authorities; when the audit establishes exactly where writes belong and how Summary remains primarily interpretive; when qualitative Goals, missing observations, known zero, inactive measurement, unsupported policy, protection, >100% Progress, Goal lifecycle independence, historical cutoffs, and current-versus-historical context all have truthful product semantics; when Goal Activity remains visibly distinct from measured Progress and no causal relationship is invented between them; when accessibility, focus, responsive behavior, revision conflicts, numeric input, observation time, provenance, history access, query performance, subscriptions, Backup/restore, and full-clear behavior are sufficiently understood for implementation; when the next implementation work has been divided into the smallest safely reviewable slices; when the mandatory Phase 5 bundle-architecture exit gate remains explicitly reserved against the approximately 676.65 kB post-5.14 baseline; and when no unresolved authority, evidence, workflow, accessibility, historical-semantics, query-readiness, or surface-ownership blocker remains before implementation begins.**
