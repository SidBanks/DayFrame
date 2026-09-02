# Task 7.9A — DayFrameApp Integration-Test Migration to the Converged Planner Architecture

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Parent Task

Task 7.9 — Planner Navigation Convergence, Month Default, and Legacy Plan Retirement

## Task Type

Integration-test architecture migration, legacy Plan-assumption removal, canonical workflow routing coverage, capability-parity verification, production-regression detection, test-helper remediation, accessibility-query preservation, lifecycle regression migration, focused validation, full validation, bundle verification, and Task 7.9 completion gate.

**Task 7.9A is primarily a test-suite migration task. Production behavior is frozen unless migrated tests reveal a genuine product regression.**

---

# 1. Objective

Complete Task 7.9 by migrating the historical `DayFrameApp` integration suite from the retired legacy Plan architecture to the converged Planner architecture implemented by Task 7.9.

Task 7.9 production behavior now establishes:

```text
Planner
    ↓
Month
```

with canonical supporting workflows:

```text
Planning Settings
    Goals
    global Schedule Preferences
    Planning Range

Work Pattern
    structural Work configuration

Commitment Library
    complete scheduling-intent inventory

Detailed Review
    diagnostics
    friction resolution
    Try
    Apply Planning Change
    Day Visualizer
```

The remaining blocker is approximately **87 historical `DayFrameApp` integration tests** whose setup assumes that rendering `DayFrameApp` immediately mounts the legacy Plan surface and therefore exposes every setup form simultaneously.

Task 7.9A must migrate those tests to the architecture users now actually encounter.

---

# 2. Governing Test-Migration Principle

> **Tests must exercise capabilities through their canonical product owners, not through retired implementation geography.**

The old test assumption was approximately:

```text
render DayFrameApp
    ↓
Plan is mounted
    ↓
all setup controls are immediately available
```

The canonical architecture is now:

```text
render DayFrameApp
    ↓
Month

then navigate explicitly to the workflow
that owns the behavior under test
```

The integration suite must reflect that distinction.

---

# 3. Governing Production-Freeze Principle

> **Task 7.9A changes tests first, not production first.**

Do not modify production merely because a historical test fails.

A production change is permitted only when migration demonstrates that the current converged Planner genuinely fails an already-required Task 7.9 capability or invariant.

Every production change made during Task 7.9A must therefore be classified as:

```text
genuine Task 7.9 regression repair
```

and documented with:

* failing migrated journey;
* expected canonical behavior;
* production cause;
* bounded fix;
* regression coverage.

---

# 4. Governing Anti-Resurrection Principle

The legacy Plan surface must not be restored for test compatibility.

Prohibited:

* test-only Plan mode;
* hidden Plan wrapper;
* legacy Plan feature flag;
* mounting `SetupScreen` as Plan solely in tests;
* compatibility route that exposes Plan;
* environment-specific Plan behavior;
* helper that bypasses canonical workflow navigation by rendering retired composition.

Tests must adapt to the product.

The product must not regress to accommodate the tests.

---

# 5. Governing Anti-Mechanical-Migration Principle

Do not migrate the suite by blindly inserting the same navigation action into every failing test.

For each affected test, determine:

```text
What product responsibility is this test actually exercising?
```

Then route through the canonical owner.

Examples:

| Tested responsibility                            | Canonical owner                  |
| ------------------------------------------------ | -------------------------------- |
| Goal editing                                     | Planning Settings                |
| global day boundary                              | Planning Settings                |
| global week start                                | Planning Settings                |
| Planning Range                                   | Planning Settings                |
| Shift Definitions                                | Work Pattern                     |
| Work cycles                                      | Work Pattern                     |
| manual Work regimes                              | Work Pattern                     |
| repeating rotations                              | Work Pattern                     |
| Off days                                         | Work Pattern                     |
| Work regime overrides                            | Work Pattern                     |
| Commitment inventory                             | Commitment Library               |
| disabled Commitment                              | Commitment Library               |
| non-occurring Commitment                         | Commitment Library               |
| recurrence                                       | Commitment Library/shared editor |
| advanced Commitment fields                       | Commitment Library               |
| contextual Commitment edit                       | Month                            |
| contextual Work edit                             | Month → Work Pattern             |
| Event authoring                                  | Month                            |
| Generate / Refresh                               | Month                            |
| friction diagnostics                             | Detailed Review                  |
| Try / Apply                                      | Detailed Review                  |
| Day Visualizer                                   | Detailed Review                  |
| profile / restore / clear / recovery destination | Month                            |

---

# 6. Governing Integration-Test Principle

`DayFrameApp` integration tests should continue to validate real application composition.

They must not become isolated component tests merely to avoid navigation.

Where a test's purpose is genuinely application-level behavior, preserve:

```text
render DayFrameApp
    ↓
navigate through real application controls
    ↓
exercise capability
    ↓
assert application-level result
```

---

# 7. Governing Accessibility-Query Principle

Prefer user-visible and accessible queries when navigating the converged Planner.

Use existing repository testing conventions, but favor:

* role;
* accessible name;
* visible label;
* canonical user-facing action.

Avoid replacing old Plan coupling with new implementation-detail coupling.

---

# 8. Governing Capability-Parity Principle

Task 7.9A is also the final executable verification of Task 7.9's capability-parity conclusion.

If a historical test exercises a legitimate capability that cannot be reached through:

* Month;
* Planning Settings;
* Work Pattern;
* Commitment Library;
* Detailed Review;

do not delete or weaken the test merely because Plan has been retired.

Trigger the capability-parity stop condition.

---

# 9. Task 7.9 Prerequisite

Treat the completed production portion of Task 7.9 as governing.

Confirmed production changes:

* Month is the deterministic Planner default;
* user-facing Plan mode is removed;
* Plan navigation is removed;
* Plan wrapper composition is removed;
* Today returns to Month;
* Summary returns to Month;
* profile load returns to Month;
* restore returns to Month;
* clear returns to Month;
* recovery returns to Month;
* exact Commitment actions route to dedicated Commitment workflow;
* exact Work actions route to dedicated Work workflow;
* browser QA confirms Plan absence;
* browser QA confirms Month focus;
* browser QA confirms responsive behavior;
* browser QA confirms no overflow.

Task 7.9 bundle result:

```text
Initial raw        636,219
Initial gzip       162,013
Largest lazy        53,130
Total JS           761,781
```

The remaining known blocker is the historical `DayFrameApp` integration suite.

---

# 10. Task 7.8 Baseline Context

Task 7.8 baseline:

```text
94 test files
975 tests

Initial raw        637,805
Initial gzip       162,143
Largest lazy        53,130
Total JS           763,279
```

Task 7.9 production convergence therefore currently represents:

```text
Initial raw        -1,586 bytes
Initial gzip         -130 bytes
Largest lazy            0 bytes
Total JS           -1,498 bytes
```

Task 7.9A should normally remain bundle-neutral because its primary work is test migration.

---

# 11. Explicit Scope

Audit and migrate:

* failing `DayFrameApp` integration tests;
* shared `DayFrameApp` test setup;
* render helpers;
* navigation helpers;
* setup helpers;
* test fixture initialization;
* Planning Settings journeys;
* Work Pattern journeys;
* Commitment Library journeys;
* Month journeys;
* Detailed Review journeys;
* Save Setup journeys;
* Save → stale → Refresh journeys;
* cross-workflow SetupDraft journeys;
* Goal journeys;
* global preference journeys;
* Planning Range journeys;
* Work configuration journeys;
* Commitment journeys;
* Event journeys where affected;
* Preview generation/refresh journeys;
* profile journeys;
* Backup journeys where affected;
* restore journeys;
* full-clear journeys;
* protection/recovery journeys;
* focus assertions;
* accessibility assertions;
* Planner return assertions;
* stale references to Plan;
* obsolete Plan test utilities;
* obsolete Plan test fixtures;
* full repository validation;
* Task 7.9 completion determination.

---

# 12. Explicit Non-Goals

Do not implement:

* new Month capability;
* new Planning Settings capability;
* new Work Pattern capability;
* Work Pattern presets;
* preset application;
* new Commitment Library capability;
* Pattern Library;
* Detailed Review migration;
* new Review capability;
* Capacity;
* Allocation;
* Recommendations;
* transition adaptation;
* scheduler redesign;
* recurrence redesign;
* authority changes;
* persistence changes;
* Backup version changes;
* routing architecture;
* new runtime dependencies;
* bundle-policy changes;
* broad production refactors unrelated to a demonstrated regression.

---

# 13. Execution Artifact Rules

Before changing tests:

1. preserve the Task 7.9 artifact/result;
2. create the Task 7.9A execution artifact;
3. record immutable artifact SHA-256 where required by current methodology;
4. reproduce the failing suite;
5. record exact:

   * failing test files;
   * failing tests;
   * failure classes;
   * representative failure messages;
6. inspect current production navigation before altering test assumptions;
7. do not modify immutable task artifacts.

Create:

`docs/implementation/phase-7/TASK_7.9A_DAYFRAMEAPP_INTEGRATION_TEST_MIGRATION_TO_CONVERGED_PLANNER_RESULT.md`

---

# 14. Mandatory Clean Failure Baseline

Before migration, run the relevant `DayFrameApp` suite in its current state.

Record:

```text
test files:
tests:
passed:
failed:
skipped:
```

Confirm whether the reported **87 failures** reproduce exactly.

If not, use the actual current count as authoritative and explain the difference.

---

# 15. Failure Inventory

Inventory every failing test.

For each failure record:

* test file;
* test name;
* historical assumption;
* actual responsibility being tested;
* canonical workflow owner;
* migration strategy;
* whether production behavior appears defective;
* final disposition.

Do not treat “cannot find field” as sufficient diagnosis.

---

# 16. Failure Classification

Classify every affected test into one primary category:

### A — Planning Settings

Goals, global preferences, Planning Range.

### B — Work Pattern

Shift Definitions, cycles, manual regimes, rotations, Off days, overrides.

### C — Commitment Library

Complete inventory, recurrence, disabled/non-occurring sources, advanced fields.

### D — Month Contextual Workflow

Event authoring, contextual Commitment editing, contextual Work entry, Generate/Refresh.

### E — Detailed Review

Diagnostics, friction, Try, Apply, Day Visualizer.

### F — Shared SetupDraft / Save

Cross-workflow draft and canonical Save Setup behavior.

### G — Lifecycle

Profiles, Backup, restore, full clear, protection, recovery.

### H — Navigation / Focus / Accessibility

Month default, workflow entry/return, focus, accessible names.

### I — Obsolete Plan-Surface Test

The test's only purpose was to assert Plan UI itself.

### J — Genuine Production Regression

The test represents a still-required capability that is broken in the converged architecture.

### K — Other

Explain.

---

# 17. Obsolete-Test Rule

A test may be removed only when its asserted behavior is genuinely obsolete.

Examples:

```text
Plan tab exists
Plan is default
Plan heading appears
all setup forms mount immediately
```

These should not be rewritten to assert a fictional replacement.

Where useful, replace them with the new architectural invariant:

```text
Month is default
Plan is absent
supporting workflow is directly reachable
```

---

# 18. Capability-Test Preservation Rule

A historical test must not be deleted merely because its old path used Plan.

If it validates a still-supported capability, migrate the path and preserve the behavioral assertion.

---

# 19. Test Intent Before Mechanics

For each test, distinguish:

```text
navigation/setup mechanics
```

from:

```text
behavior actually under test
```

Migration may change the first.

It should preserve the second unless the behavior was intentionally retired by Task 7.9.

---

# 20. Planning Settings Migration

Tests concerning:

* Goals;
* global day boundary;
* global week start;
* Planning Range;

must explicitly navigate to Planning Settings before interacting with those controls.

Do not render legacy Plan.

---

# 21. Work Pattern Migration

Tests concerning structural Work must explicitly navigate to Work Pattern.

At minimum:

* Shift Definitions;
* shift cycles;
* manual regimes;
* repeating rotations;
* Off days;
* regime boundary overrides;
* regime week-start overrides.

---

# 22. Commitment Library Migration

Tests requiring the complete authored Commitment inventory must navigate to Commitment Library.

At minimum:

* Add Commitment;
* Edit Commitment;
* Remove Commitment;
* disabled Commitment;
* non-occurring Commitment;
* recurrence;
* duration;
* priority;
* preferred window;
* Goal link;
* other advanced fields currently supported.

---

# 23. Month Contextual Migration

Tests whose actual purpose is routine contextual planning should remain in Month.

Do not send every Commitment test to Commitment Library if the behavior under test is specifically contextual Month editing.

---

# 24. Event Migration

Event authoring remains Month-owned.

Affected application integration tests must use Month's canonical Event journey.

---

# 25. Generate / Refresh Migration

Preview generation and stale-refresh behavior must be tested through Month.

Required canonical journey:

```text
Month
    ↓
Generate / Refresh
```

No Plan dependency.

---

# 26. Detailed Review Migration

Tests concerning:

* schedule diagnostics;
* friction;
* Try;
* Apply Planning Change;
* Day Visualizer;

must navigate to Detailed Review through current canonical controls.

---

# 27. Shared SetupDraft Migration

Tests that edit multiple authored domains must use real cross-workflow navigation.

Example:

```text
Planning Settings edit
    ↓
Month
    ↓
Work Pattern edit
    ↓
Month
    ↓
Commitment Library edit
```

Pending draft must survive.

---

# 28. Save Setup Migration

Tests that historically saved from Plan must now invoke the canonical Save Setup boundary from a currently supported location.

Do not introduce a test-only Save action.

---

# 29. Save / Refresh Migration

Preserve the architectural distinction:

```text
edit
    ↓
Save Setup
    ↓
Preview stale
    ↓
Refresh
```

Do not collapse these operations for easier testing.

---

# 30. Cross-Workflow Save Coverage

At least one application integration test must prove:

```text
Work Pattern edit
    ↓
Commitment Library edit
    ↓
Planning Settings
    ↓
Save Setup
```

and confirm both/all edits persist through the one SetupDraft transaction.

---

# 31. Goal Test Migration

Goal tests must no longer rely on Goal controls being initially mounted.

Navigate to Planning Settings.

Preserve existing Goal authority assertions.

---

# 32. Schedule Preference Test Migration

Global schedule preference tests must navigate to Planning Settings.

Per-regime Work preference tests belong to Work Pattern.

Do not conflate the two.

---

# 33. Planning Range Test Migration

Planning Range tests belong to Planning Settings.

---

# 34. Shift Definition Test Migration

Shift Definition tests belong to Work Pattern.

---

# 35. Work-Cycle Test Migration

Work cycle/rotation tests belong to Work Pattern.

---

# 36. Commitment Recurrence Test Migration

Recurrence tests requiring complete source editing belong to Commitment Library unless the test explicitly targets Month contextual editing.

---

# 37. Advanced Commitment Test Migration

Advanced fields must remain covered through Commitment Library/shared canonical editor.

Do not weaken advanced-field coverage because Month intentionally exposes a narrower contextual surface.

---

# 38. Disabled Commitment Test Migration

Disabled Commitments belong to Commitment Library.

Do not infer their absence from Month as deletion.

---

# 39. Non-Occurring Commitment Test Migration

Non-occurring Commitments belong to Commitment Library.

---

# 40. Profile Test Migration

Profile load must return to Month under Task 7.9.

Migrate assertions accordingly.

If profile tests need authored controls after loading, navigate explicitly to the relevant supporting workflow.

---

# 41. Backup Test Migration

Backup behavior remains independent of Plan.

Any affected integration test must use current lifecycle controls and navigate explicitly afterward.

---

# 42. Restore Test Migration

Restore must return to Month/safe canonical state.

Tests requiring restored authored controls must navigate to their owner after restore.

---

# 43. Full-Clear Test Migration

Full clear must return to truthful Month/default state.

Do not expect Plan.

---

# 44. Protection Test Migration

Protected state must remain non-writable and truthful.

Do not navigate around protection to make a test pass.

---

# 45. Recovery Test Migration

Successful recovery returns to Month.

Affected tests must assert the new destination.

---

# 46. Today → Planner Migration

Tests expecting Today → Plan must migrate to Today → Month or the exact canonical target now defined by production.

---

# 47. Summary → Planner Migration

Same principle.

---

# 48. Exact Commitment Action Migration

Where Task 7.9 routes an exact Commitment action to its dedicated workspace, integration tests must verify that canonical target rather than Plan.

---

# 49. Exact Work Action Migration

Where Task 7.9 routes an exact Work action to Work Pattern, integration tests must verify that canonical target rather than Plan.

---

# 50. Focus Migration

Remove assertions expecting focus on:

* Plan heading;
* Plan tab;
* Plan form.

Replace with the canonical destination:

* Month;
* Planning Settings;
* Work Pattern;
* Commitment Library;
* Detailed Review;

according to the journey.

---

# 51. Accessibility Migration

Remove obsolete accessible-name assertions tied solely to Plan.

Preserve or add coverage for:

* Month primary identity;
* Planning Settings;
* Work Pattern;
* Commitment Library;
* Detailed Review;
* Save Setup;
* Generate/Refresh.

---

# 52. Shared Navigation Helpers

Audit whether repeated canonical navigation deserves bounded test helpers.

Potential conceptual helpers:

```text
openPlanningSettings()
openWorkPattern()
openCommitmentLibrary()
openDetailedReview()
returnToMonth()
```

Only create helpers if they improve clarity across multiple tests.

---

# 53. Helper Abstraction Rule

A helper must express **user intent**, not implementation internals.

Good:

```text
openWorkPattern()
```

Poor:

```text
setPlannerMode("workPattern")
```

Application integration tests should exercise user-visible navigation.

---

# 54. No Universal `openSetup()` Helper

Do not replace Plan with another fictional broad setup abstraction.

There is intentionally no longer one universal setup surface.

---

# 55. Helper Assertion Rule

Navigation helpers should normally verify successful arrival at their target.

This localizes failures and prevents later field queries from obscuring navigation regressions.

---

# 56. Shared Render Helper Audit

Audit current `renderDayFrameApp` or equivalent helper.

It may continue to render the application.

It must not automatically navigate to a supporting workflow merely to preserve old assumptions.

Default render should expose the actual default:

```text
Month
```

---

# 57. Fixture Audit

Audit fixtures that implicitly assume all editors are mounted simultaneously.

Change only fixture/setup mechanics required by the new workflow boundaries.

Do not change authored fixture semantics unnecessarily.

---

# 58. Query Audit

Search affected tests for queries naming:

* Plan;
* Plan heading;
* Plan tab;
* legacy setup sections expected immediately after render;
* fields now behind supporting workflows.

Classify each occurrence before editing.

---

# 59. Test-Name Audit

Rename test names that encode obsolete navigation assumptions.

Preserve names describing still-valid behavior.

Example:

Old:

```text
Plan lets the user edit...
```

New:

```text
Planning Settings lets the user edit...
```

only where that is truly the canonical owner.

---

# 60. Test-Structure Audit

Where one historical test exercises unrelated Plan sections solely because they happened to be mounted together, consider splitting it into responsibility-focused journeys.

Do not split mechanically.

Use behavioral coherence.

---

# 61. Integration-Level Preservation

Do not move all migrated tests into lower-level component suites.

`DayFrameApp` still requires integration coverage proving the replacement workflows are composed correctly.

---

# 62. Component-Test Boundary

Existing focused component tests remain valuable and should not be duplicated unnecessarily.

Task 7.9A concerns the application integration layer.

---

# 63. Production-Regression Detection

If migration reveals:

```text
canonical workflow exists
but required behavior cannot be completed through it
```

classify as a genuine production regression.

Examples could include:

* Save Setup unreachable after an edit;
* advanced field lost;
* exact source opens wrong editor;
* draft discarded during navigation;
* restored setup cannot be edited;
* focus traps access;
* disabled Commitment cannot be reached.

Stop and diagnose before altering the test expectation.

---

# 64. Production-Regression Repair Rule

A production fix is allowed only when:

1. Task 7.8/7.9 says the capability must exist;
2. the migrated user journey proves it does not;
3. the fix is bounded;
4. no new architecture is invented;
5. regression coverage is added.

---

# 65. Capability-Parity Stop Condition

If a legitimate former Plan capability has no canonical replacement, stop.

Report:

```text
capability:
historical Plan path:
expected canonical owner:
missing behavior:
architectural consequence:
recommended remediation:
```

Do not resurrect Plan.

---

# 66. Ambiguous-Ownership Stop Condition

If a test exposes a capability whose canonical owner cannot be determined from Tasks 7.1–7.9 and current architecture, stop that migration and report the ambiguity.

Do not arbitrarily choose a surface merely to satisfy the suite.

---

# 67. Obsolete-Behavior Determination

For every deleted/replaced Plan-specific assertion, state why the behavior is obsolete.

Examples:

* Plan no longer exists by accepted convergence decision;
* Month is now deterministic default;
* all forms are intentionally not simultaneously mounted.

---

# 68. No Coverage Reduction by Count

Do not use passing-test count alone as proof of preserved coverage.

Compare behavioral responsibilities before and after migration.

---

# 69. Test Count Changes

Test count may:

* remain equal;
* increase;
* decrease modestly due to obsolete Plan-only tests or coherent splits/merges.

Every reduction must be explained.

---

# 70. Skipped-Test Rule

Do not skip affected tests as a migration strategy.

Any existing unrelated skips should be reported but need not be remediated unless relevant.

---

# 71. `only` Rule

No committed `.only`.

---

# 72. Test-Only Compatibility Rule

No test-only production behavior.

---

# 73. Mocking Boundary

Do not mock Planner navigation merely to reach supporting workflows.

Use real integration composition.

Existing unrelated mocks may remain.

---

# 74. Direct State Mutation Boundary

Do not directly mutate Planner UI mode in tests merely to avoid navigation unless an existing test explicitly targets internal state rather than user behavior.

For application integration journeys, use the UI.

---

# 75. Exact Identity Preservation

Tests involving exact Commitment/Work targets must preserve exact identity assertions.

Do not weaken them to title-only matching.

---

# 76. SetupDraft Authority Preservation

Tests must continue to distinguish:

* draft authored changes;
* durable authored state;
* Preview state.

---

# 77. Preview Authority Preservation

Do not change tests so that Month's displayed Preview is treated as authored truth.

---

# 78. PlanDecision Boundary

Do not alter PlanDecision tests because the Plan UI name disappeared.

---

# 79. HistoricalPlan Boundary

No semantic change.

---

# 80. ExecutionHistory Boundary

No semantic change.

---

# 81. Today Boundary

Only navigation expectations affected by Task 7.9 may change.

Today semantics remain unchanged.

---

# 82. Summary Boundary

Same.

---

# 83. Persistence Boundary

No persistence changes are expected.

---

# 84. Backup Boundary

No Backup version changes.

---

# 85. Bundle Boundary

Task 7.9A is test-focused.

Production bundle should remain at or extremely near Task 7.9 unless a genuine production regression requires a bounded repair.

---

# 86. Task 7.9 Bundle Baseline

Use:

```text
Initial raw        636,219
Initial gzip       162,013
Largest lazy        53,130
Total JS           761,781
```

---

# 87. Bundle Governance

Preserve existing Phase 7 guards.

### Initial raw

Warning:

```text
>= 650,000
```

Hard failure:

```text
> 685,000
```

### Initial gzip

Hard failure:

```text
> 170,000
```

### Largest lazy

Warning:

```text
>= 80,000
```

Hard failure:

```text
> 100,000
```

### Total JS

Governed review:

```text
>= 800,000
```

Architecture stop:

```text
>= 825,000
```

---

# 88. Unexpected Bundle-Change Rule

If test-only migration changes production bundle output materially, investigate.

Test changes should not alter production graph.

---

# 89. Mandatory Migration Ledger

Maintain a migration ledger with one row per affected test or coherent test group.

Required columns:

| Test / group | Old assumption | Responsibility | Canonical owner | Migration | Production defect? | Final status |
| ------------ | -------------- | -------------- | --------------- | --------- | -----------------: | ------------ |

All reported failures must be accounted for.

---

# 90. Mandatory Failure-Class Matrix

| Failure class      | Count before | Migrated | Deleted as obsolete | Production regression | Remaining |
| ------------------ | -----------: | -------: | ------------------: | --------------------: | --------: |
| Planning Settings  |              |          |                     |                       |           |
| Work Pattern       |              |          |                     |                       |           |
| Commitment Library |              |          |                     |                       |           |
| Month contextual   |              |          |                     |                       |           |
| Detailed Review    |              |          |                     |                       |           |
| SetupDraft / Save  |              |          |                     |                       |           |
| Lifecycle          |              |          |                     |                       |           |
| Navigation / focus |              |          |                     |                       |           |
| obsolete Plan-only |              |          |                     |                       |           |
| genuine regression |              |          |                     |                       |           |
| other              |              |          |                     |                       |           |

Totals must reconcile.

---

# 91. Mandatory Capability-Coverage Matrix

| Capability                    | Historical integration coverage | Canonical journey after 7.9A     | Coverage retained? |
| ----------------------------- | ------------------------------: | -------------------------------- | -----------------: |
| Goals                         |                                 | Planning Settings                |                    |
| global boundary               |                                 | Planning Settings                |                    |
| global week start             |                                 | Planning Settings                |                    |
| Planning Range                |                                 | Planning Settings                |                    |
| Shift Definitions             |                                 | Work Pattern                     |                    |
| Work cycles                   |                                 | Work Pattern                     |                    |
| manual regimes                |                                 | Work Pattern                     |                    |
| rotations                     |                                 | Work Pattern                     |                    |
| Off days                      |                                 | Work Pattern                     |                    |
| regime overrides              |                                 | Work Pattern                     |                    |
| complete Commitment inventory |                                 | Commitment Library               |                    |
| disabled Commitment           |                                 | Commitment Library               |                    |
| non-occurring Commitment      |                                 | Commitment Library               |                    |
| recurrence                    |                                 | Commitment Library/shared editor |                    |
| advanced Commitment fields    |                                 | Commitment Library               |                    |
| contextual Commitment edit    |                                 | Month                            |                    |
| contextual Work edit          |                                 | Month → Work Pattern             |                    |
| Event authoring               |                                 | Month                            |                    |
| Save Setup                    |                                 | shared canonical boundary        |                    |
| Generate / Refresh            |                                 | Month                            |                    |
| diagnostics                   |                                 | Detailed Review                  |                    |
| Try / Apply                   |                                 | Detailed Review                  |                    |
| Day Visualizer                |                                 | Detailed Review                  |                    |

---

# 92. Mandatory Navigation Matrix

| Journey                         | Expected destination         |
| ------------------------------- | ---------------------------- |
| render `DayFrameApp`            | Month                        |
| open Planning Settings          | Planning Settings            |
| open Work Pattern               | Work Pattern                 |
| open Commitment Library         | Commitment Library           |
| open Detailed Review            | Detailed Review              |
| return from supporting workflow | Month/context                |
| Today → Planner                 | Month/canonical exact target |
| Summary → Planner               | Month/canonical exact target |
| profile load                    | Month                        |
| restore                         | Month                        |
| full clear                      | Month                        |
| recovery success                | Month                        |

---

# 93. Mandatory Test-Helper Matrix

| Helper                  | Existing? | Keep / modify / remove / add | User-intent based? | Verifies arrival? |
| ----------------------- | --------: | ---------------------------- | -----------------: | ----------------: |
| render app              |           |                              |                    |                   |
| open Planning Settings  |           |                              |                    |                   |
| open Work Pattern       |           |                              |                    |                   |
| open Commitment Library |           |                              |                    |                   |
| open Detailed Review    |           |                              |                    |                   |
| return to Month         |           |                              |                    |                   |
| legacy open Plan        |           | remove                       |                 No |               N/A |

---

# 94. Mandatory Obsolete-Test Matrix

| Test/assertion                    | Why obsolete | Replacement invariant        | Deleted or replaced? |
| --------------------------------- | ------------ | ---------------------------- | -------------------- |
| Plan is default                   | Task 7.9     | Month is default             |                      |
| Plan navigation exists            | Task 7.9     | Plan absent                  |                      |
| Plan heading exists               | Task 7.9     | canonical workflow heading   |                      |
| all setup forms initially mounted | converged IA | explicit workflow navigation |                      |

Add repository-specific rows.

---

# 95. Mandatory Production-Change Matrix

Expected to be empty.

If not:

| File | Production change | Regression exposed by | Why required | Architecture changed? |
| ---- | ----------------- | --------------------- | ------------ | --------------------: |

Any non-empty matrix requires explicit justification.

---

# 96. Mandatory SetupDraft Matrix

| Journey                             | Draft survives navigation? | Durable before Save? | Durable after Save? | Preview after Save     |
| ----------------------------------- | -------------------------: | -------------------: | ------------------: | ---------------------- |
| Planning Settings → Month           |                            |                   No |                 N/A | unchanged              |
| Work Pattern → Month                |                            |                   No |                 N/A | unchanged              |
| Commitment Library → Month          |                            |                   No |                 N/A | unchanged              |
| Work → Commitment → Settings → Save |                            |                   No |                 Yes | stale where applicable |

---

# 97. Mandatory Lifecycle Matrix

| Lifecycle action  | Historical expectation | Canonical expectation | Migrated? |
| ----------------- | ---------------------- | --------------------- | --------: |
| profile load      | Plan/legacy            | Month                 |           |
| restore           | Plan/legacy            | Month                 |           |
| full clear        | Plan/legacy            | Month                 |           |
| recovery          | Plan/legacy            | Month                 |           |
| Today → Planner   | Plan/legacy            | Month/exact target    |           |
| Summary → Planner | Plan/legacy            | Month/exact target    |           |

---

# 98. Mandatory Focus Matrix

| Journey                  | Historical target | Canonical target   | Covered? |
| ------------------------ | ----------------- | ------------------ | -------: |
| initial Planner          | Plan              | Month              |          |
| Planning Settings entry  | legacy setup      | Planning Settings  |          |
| Work Pattern entry       | legacy setup      | Work Pattern       |          |
| Commitment Library entry | legacy setup      | Commitment Library |          |
| Review entry             | Review            | Detailed Review    |          |
| supporting return        | Plan/varied       | Month/context      |          |
| recovery                 | Plan/legacy       | Month              |          |

---

# 99. Mandatory Authority Matrix

| Authority/source       |                         Task 7.9A change? |
| ---------------------- | ----------------------------------------: |
| SetupDraft             |                                        No |
| durable authored setup |                                        No |
| Goal authority         |                                        No |
| Event authority        |                                        No |
| Preview                |                                        No |
| PlanDecision           |                                        No |
| HistoricalPlan         |                                        No |
| ExecutionHistory       |                                        No |
| Progress               |                                        No |
| Planner mode           | Tests updated to current UI behavior only |

---

# 100. Mandatory Bundle Matrix

| Metric       | Task 7.9 baseline | Task 7.9A final | Delta |
| ------------ | ----------------: | --------------: | ----: |
| Initial raw  |           636,219 |                 |       |
| Initial gzip |           162,013 |                 |       |
| Largest lazy |            53,130 |                 |       |
| Total JS     |           761,781 |                 |       |

Explain every production-byte delta.

---

# 101. Mandatory Validation Matrix

| Validation                   | Result |
| ---------------------------- | ------ |
| affected `DayFrameApp` tests |        |
| focused Planner tests        |        |
| Month tests                  |        |
| Planning Settings tests      |        |
| Work Pattern tests           |        |
| Commitment Library tests     |        |
| Detailed Review tests        |        |
| lifecycle tests              |        |
| accessibility/focus tests    |        |
| lint                         |        |
| typecheck                    |        |
| full test                    |        |
| production build             |        |
| bundle guard                 |        |
| `git diff --check`           |        |

---

# 102. Migration Sequence

Use this order:

```text
1. reproduce failures
2. inventory failures
3. classify by responsibility
4. audit shared test helpers
5. establish canonical navigation helpers where justified
6. migrate Month/navigation assertions
7. migrate Planning Settings tests
8. migrate Work Pattern tests
9. migrate Commitment Library tests
10. migrate Detailed Review tests
11. migrate shared SetupDraft/Save tests
12. migrate lifecycle tests
13. migrate focus/accessibility tests
14. remove obsolete Plan-only tests/helpers
15. run affected suite
16. investigate genuine regressions
17. run focused subsystem suites
18. run full validation
19. verify production bundle
20. complete Task 7.9
```

Do not start with production changes.

---

# 103. Batch-Migration Guidance

The 87 failures may be migrated in coherent responsibility batches.

Recommended order:

### Batch 1 — Test Infrastructure

Render/navigation helpers and Month default.

### Batch 2 — Planning Settings

Goals, global preferences, Planning Range.

### Batch 3 — Work Pattern

Shift and cycle structure.

### Batch 4 — Commitment Library

Complete inventory and advanced authoring.

### Batch 5 — Month

Contextual editing, Event, Generate/Refresh.

### Batch 6 — Detailed Review

Diagnostics/resolution.

### Batch 7 — Shared Draft/Save

Cross-workflow integration.

### Batch 8 — Lifecycle

Profiles, restore, clear, recovery.

### Batch 9 — Focus/Accessibility

Final navigation semantics.

Run the affected suite after each coherent batch.

---

# 104. Failure-Triage Rule

After each migration batch, classify remaining failures as:

```text
expected unmigrated
migration defect
genuine production regression
unrelated baseline failure
```

Do not allow one class to masquerade as another.

---

# 105. Cascading-Failure Rule

One incorrect navigation helper may produce many failures.

Diagnose root causes before editing dozens of assertions.

---

# 106. Timing / Async Rule

Do not add arbitrary sleeps or inflated waits to compensate for lazy workflow mounting.

Use existing async testing conventions and observable UI readiness.

---

# 107. Lazy-Loading Test Rule

Supporting workflows may mount asynchronously.

Tests should await the actual accessible destination rather than assume synchronous mounting.

---

# 108. Query-Uniqueness Rule

Where fields with similar names exist across workflows, scope queries to the active workflow where useful.

Do not rely on the historical fact that only one broad Plan form existed.

---

# 109. Form-State Rule

Navigation away from a supporting workflow must not be interpreted as unmount-and-discard if SetupDraft is globally shared.

Tests should verify product semantics rather than component lifetime.

---

# 110. Test Isolation

Each integration test must remain independently runnable.

Do not rely on previous tests leaving Planner in a supporting workflow.

---

# 111. Default-State Rule

Shared test render defaults should represent production defaults.

After Task 7.9:

```text
default Planner state = Month
```

---

# 112. Canonical Fixtures

Ensure coverage includes at least:

1. default Month entry;
2. Planning Settings Goal edit;
3. global boundary edit;
4. Planning Range edit;
5. Work Pattern structural edit;
6. Work rotation/Off-day edit;
7. Commitment Library advanced edit;
8. disabled Commitment;
9. non-occurring Commitment;
10. Month contextual Commitment edit;
11. Month Event edit;
12. Generate;
13. stale → Refresh;
14. Detailed Review;
15. Try/Apply where existing;
16. cross-workflow draft;
17. profile load;
18. restore;
19. full clear;
20. recovery;
21. exact Commitment routing;
22. exact Work routing;
23. keyboard/focus semantics where represented at integration level.

Use existing fixtures where possible.

---

# 113. Architectural Invariants

Assess at minimum:

1. Month remains deterministic Planner default.
2. Plan remains absent.
3. no Plan test-only resurrection occurs.
4. no hidden Plan wrapper occurs.
5. tests navigate through canonical workflows.
6. test helpers represent user intent.
7. render helper defaults to actual production behavior.
8. Planning Settings tests use Planning Settings.
9. Work structural tests use Work Pattern.
10. complete Commitment tests use Commitment Library.
11. contextual planning tests use Month.
12. diagnostic tests use Detailed Review.
13. Event authoring remains Month-owned.
14. Generate/Refresh remains Month-owned.
15. Goals remain Planning Settings-owned.
16. global preferences remain Planning Settings-owned.
17. Planning Range remains Planning Settings-owned.
18. Shift Definitions remain Work Pattern-owned.
19. Work cycles remain Work Pattern-owned.
20. manual regimes remain Work Pattern-owned.
21. repeating rotations remain Work Pattern-owned.
22. Off days remain Work Pattern-owned.
23. regime overrides remain Work Pattern-owned.
24. disabled Commitments remain discoverable.
25. non-occurring Commitments remain discoverable.
26. recurrence remains covered.
27. advanced Commitment fields remain covered.
28. exact Commitment routing remains covered.
29. exact Work routing remains covered.
30. one SetupDraft remains.
31. draft survives workflow navigation.
32. one Save Setup remains.
33. whole-setup validation remains.
34. Save does not Refresh.
35. Save marks Preview stale where applicable.
36. Refresh regenerates explicitly.
37. no Preview remains distinct from empty.
38. stale Preview remains visible.
39. profile load returns Month.
40. restore returns Month.
41. full clear returns Month.
42. recovery returns Month.
43. Today → Planner uses canonical destination.
44. Summary → Planner uses canonical destination.
45. focus expectations use canonical targets.
46. accessibility assertions use canonical names.
47. obsolete Plan-only assertions are removed/replaced.
48. valid capability assertions are not deleted.
49. coverage is evaluated behaviorally, not merely numerically.
50. every historical failure is accounted for.
51. failure-class totals reconcile.
52. migration ledger accounts for every affected test/group.
53. no tests are skipped to obtain green.
54. no `.only` remains.
55. no arbitrary sleeps are introduced.
56. lazy mounting is awaited semantically.
57. integration tests continue rendering real application composition.
58. Planner mode is not directly mutated merely for convenience.
59. production changes are not made preemptively.
60. every production change is tied to a genuine regression.
61. genuine regressions receive regression coverage.
62. missing canonical capability triggers stop.
63. ambiguous ownership triggers stop.
64. Plan is never restored to resolve a blocker.
65. no new product capability is introduced.
66. no new authority is introduced.
67. no writer is introduced.
68. no persistence change occurs.
69. no Backup version change occurs.
70. no scheduler semantic changes.
71. no recurrence semantic changes.
72. no Work preset work occurs.
73. no Pattern Library work occurs.
74. no Capacity work occurs.
75. no Allocation work occurs.
76. no Recommendation work occurs.
77. no transition adaptation work occurs.
78. PlanDecision remains unchanged.
79. HistoricalPlan remains unchanged.
80. ExecutionHistory remains unchanged.
81. Today semantics remain unchanged.
82. Summary semantics remain unchanged.
83. exact durable identity remains intact.
84. test fixtures preserve authored semantics.
85. test names reflect current product language.
86. broad old Plan tests may split only when behaviorally coherent.
87. component suites are not substituted for required app integration.
88. existing focused component coverage remains.
89. default render exposes Month.
90. supporting workflow navigation is exercised through UI.
91. supporting workflow arrival is asserted.
92. supporting return behavior remains covered.
93. cross-workflow Save remains covered.
94. lifecycle behavior remains covered.
95. protection/recovery remains covered.
96. test-only migration does not alter production bundle.
97. unexpected bundle change is investigated.
98. Task 7.9 bundle guards remain green.
99. initial raw hard guard remains unchanged.
100. initial gzip hard guard remains unchanged.
101. largest lazy hard guard remains unchanged.
102. total JS review thresholds remain unchanged.
103. no bundle counting change occurs.
104. no runtime dependency is added.
105. affected integration suite passes.
106. focused subsystem suites pass.
107. lint passes.
108. typecheck passes.
109. full tests pass.
110. build passes.
111. bundle check passes.
112. `git diff --check` passes.
113. no production browser regression is introduced by test-only changes.
114. if production changes occur, relevant browser QA is rerun.
115. Task 7.9 capability parity is mechanically confirmed.
116. legacy Plan is executable-history only, not current product architecture.
117. the integration suite now encodes the converged Planner architecture.
118. Task 7.9 may only be declared complete after the suite is green.
119. Task 7.10 remains blocked until Task 7.9 completion.
120. remaining Phase 7 work is selected from product value after convergence.

Classify each as:

* Confirmed
* Implemented
* Preserved
* Covered by test
* Covered by validation
* Inferred
* Decision required
* Deferred
* Prohibited
* Not applicable
* Blocked

---

# 114. Stop Conditions

Stop rather than weakening architecture if:

* a legitimate historical capability cannot be reached through a canonical replacement workflow;
* advanced Commitment behavior exists only through removed Plan composition;
* Work structural behavior exists only through removed Plan composition;
* Goal/global preference/Planning Range behavior exists only through removed Plan composition;
* Save Setup becomes unreachable for a valid draft-producing journey;
* SetupDraft is discarded during canonical workflow navigation;
* lifecycle behavior still depends on Plan;
* exact Commitment/Work routing cannot reproduce required behavior;
* canonical workflow ownership is genuinely ambiguous;
* tests require direct internal mode mutation to exercise normal user behavior;
* migration requires a hidden/test-only Plan surface;
* migration requires skipping legitimate regression coverage;
* production fixes would require new architecture outside Task 7.9;
* a new authority, persistence model, Backup version, scheduler semantic, recurrence semantic, or runtime dependency becomes necessary;
* hard bundle guards fail after a required production repair;
* total JS reaches the architecture-stop threshold.

If triggered, report the exact blocker.

---

# 115. Focused Validation

After migration, run the affected `DayFrameApp` integration suite first.

Record:

```text
test files
tests
passed
failed
skipped
duration
```

Then run focused suites for:

* Month;
* Planning Settings;
* Work Pattern;
* Commitment Library;
* Detailed Review;
* SetupDraft/store;
* profiles;
* restore;
* protection/recovery;
* focus/accessibility.

---

# 116. Full Validation

Run:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:bundle
git diff --check
```

Record exact:

* test files;
* tests;
* passed;
* failed;
* skipped;
* transformed modules;
* initial raw;
* initial gzip;
* largest lazy;
* total JS;
* changed chunks;
* guard status;
* diff status.

---

# 117. Browser QA Rule

If Task 7.9A changes **tests only**, do not repeat the entire already-passed Task 7.9 browser matrix merely for ceremony.

Record that production assets are unchanged and reference the Task 7.9 browser result.

If production code changes for a genuine regression:

rerun browser QA for every affected journey.

If the production change touches shared Planner navigation, rerun the full Task 7.9 Planner browser matrix.

---

# 118. Governance Updates

Update:

* Task 7.9A result;
* Task 7.9 result/completion status;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Record:

```text
Task 7.9 production convergence
    completed

Task 7.9A integration-suite convergence
    completed

Legacy Plan
    retired from product and test assumptions

Month
    deterministic Planner default
```

Do not rewrite historical documents that truthfully describe the old architecture at their time.

---

# 119. ADR Determination

No ADR is expected.

Task 7.9A should align executable tests with already-decided architecture.

Create an ADR only if a genuine production regression forces a new enduring architectural decision.

---

# 120. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.9A_DAYFRAMEAPP_INTEGRATION_TEST_MIGRATION_TO_CONVERGED_PLANNER_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Parent Task 7.9 Status
4. Production Freeze Confirmation
5. Initial Failure Baseline
6. Failure Inventory
7. Failure Classification
8. Files Changed
9. Test Files Changed
10. Production Files Changed
11. Production-Change Justification
12. Shared Test Helper Audit
13. Render Helper
14. Navigation Helpers
15. Fixture Audit
16. Query Audit
17. Test-Name Audit
18. Planning Settings Migration
19. Goal Migration
20. Global Preference Migration
21. Planning Range Migration
22. Work Pattern Migration
23. Shift Definition Migration
24. Work Cycle Migration
25. Manual Regime Migration
26. Rotation / Off-Day Migration
27. Regime Override Migration
28. Commitment Library Migration
29. Disabled Commitment Migration
30. Non-Occurring Commitment Migration
31. Recurrence Migration
32. Advanced Commitment Migration
33. Month Contextual Migration
34. Event Migration
35. Generate / Refresh Migration
36. Detailed Review Migration
37. Try / Apply Migration
38. Day Visualizer Migration
39. SetupDraft Migration
40. Cross-Workflow Draft Migration
41. Save Setup Migration
42. Save / Refresh Migration
43. Profile Migration
44. Backup Migration
45. Restore Migration
46. Full-Clear Migration
47. Protection Migration
48. Recovery Migration
49. Today → Planner Migration
50. Summary → Planner Migration
51. Exact Commitment Routing
52. Exact Work Routing
53. Focus Migration
54. Accessibility Migration
55. Obsolete Plan Tests
56. Obsolete Plan Helpers
57. Tests Split/Merged
58. Test Count Changes
59. Coverage Preservation
60. Genuine Production Regressions
61. Capability-Parity Reassessment
62. Ambiguous Ownership Assessment
63. SetupDraft Authority
64. Save Boundary
65. Preview Boundary
66. PlanDecision Boundary
67. HistoricalPlan Boundary
68. ExecutionHistory Boundary
69. Persistence Boundary
70. Backup Boundary
71. Bundle Boundary
72. Focused Validation
73. Full Validation
74. Bundle Validation
75. Browser QA Determination
76. Governance Updates
77. ADR Determination
78. Deviations
79. Discoveries
80. Deferred Work
81. Migration Ledger
82. Failure-Class Matrix
83. Capability-Coverage Matrix
84. Navigation Matrix
85. Test-Helper Matrix
86. Obsolete-Test Matrix
87. Production-Change Matrix
88. SetupDraft Matrix
89. Lifecycle Matrix
90. Focus Matrix
91. Authority Matrix
92. Bundle Matrix
93. Validation Matrix
94. Architectural Invariant Assessment
95. Stop-Condition Assessment
96. Architectural Alignment Assessment
97. Test-Suite Convergence Determination
98. Task 7.9 Completion Determination
99. Phase 7 Planner-Convergence Determination
100. Task 7.10 Readiness
101. Recommended Next Task
102. Final Completion Determination

---

# 121. Test-Suite Convergence Determination

At completion classify:

### A — Fully Converged

All legitimate `DayFrameApp` integration behavior is exercised through canonical Planner workflows and no current test depends on Plan.

### B — Converged With Historical/Internal Naming Residue

Behavioral assumptions are fully migrated, but harmless historical test/helper names remain for documented reasons.

### C — Blocked by Missing Product Capability

A legitimate former Plan capability lacks a canonical replacement.

### D — Blocked by Genuine Production Regression

Replacement architecture exists, but production behavior is defective.

Expected successful result:

```text
A
```

or, with strong justification:

```text
B
```

---

# 122. Task 7.9 Completion Determination

Task 7.9 may be upgraded from:

```text
partially implemented
```

to:

```text
complete
```

only when:

* Task 7.9A passes;
* full repository validation is green;
* no legitimate capability has been lost;
* Plan remains absent;
* Month remains deterministic default;
* bundle guards remain green.

---

# 123. Phase 7 Planner-Convergence Determination

Answer explicitly:

1. Does production use Month as the deterministic Planner default?
2. Is Plan absent from production navigation/composition?
3. Does the integration suite also assume Month as the default?
4. Does every authored responsibility have direct canonical integration coverage?
5. Do tests navigate to Planning Settings for global planning configuration?
6. Do tests navigate to Work Pattern for structural Work?
7. Do tests navigate to Commitment Library for complete scheduling-intent inventory?
8. Do tests use Month for contextual planning?
9. Do tests use Detailed Review for diagnostics/resolution?
10. Does one SetupDraft survive cross-workflow navigation?
11. Does one Save Setup transaction remain?
12. Does explicit Refresh remain separate?
13. Do lifecycle tests converge on Month?
14. Is there any remaining executable assumption that Plan exists?
15. Is the Phase 7 Planner strangler migration now complete?

---

# 124. Task 7.10 Readiness

Task 7.10 is not authorized until Task 7.9A completes successfully and Task 7.9 is formally closed.

After closure, choose Task 7.10 from remaining product value.

Do not automatically create another legacy-cleanup task merely because historical implementation names remain.

---

# 125. Completion Criteria

Task 7.9A is complete only when:

* the current failing `DayFrameApp` suite has been reproduced;
* the actual failure count is recorded;
* every affected test or coherent group appears in the migration ledger;
* every failure is classified by actual product responsibility;
* failure-class totals reconcile with the initial baseline;
* no migration is performed by blindly opening one replacement surface for every test;
* Planning Settings tests explicitly use Planning Settings;
* Goal tests explicitly use Planning Settings;
* global schedule-preference tests explicitly use Planning Settings;
* Planning Range tests explicitly use Planning Settings;
* structural Work tests explicitly use Work Pattern;
* Shift Definition tests explicitly use Work Pattern;
* cycle/manual-regime/rotation/Off-day/override tests explicitly use Work Pattern;
* complete Commitment inventory tests explicitly use Commitment Library;
* disabled and non-occurring Commitment tests explicitly use Commitment Library;
* recurrence and advanced Commitment coverage remains through the canonical editor;
* contextual Commitment tests use Month where Month behavior is what is under test;
* Event tests use Month;
* Generate/Refresh tests use Month;
* diagnostic/friction/Try/Apply/Visualizer tests use Detailed Review;
* cross-workflow tests exercise real canonical navigation;
* one global SetupDraft remains covered;
* one Save Setup transaction remains covered;
* Save → stale Preview → Refresh remains covered;
* profile, Backup, restore, full clear, protection, and recovery integration behavior remains covered;
* profile/restore/clear/recovery destination expectations use Month;
* Today → Planner and Summary → Planner expectations reflect Task 7.9;
* exact Commitment and Work routing remains covered;
* focus assertions use canonical destinations;
* accessibility assertions use canonical product names;
* obsolete Plan-only tests are deleted or replaced only when their behavior is genuinely retired;
* valid behavioral coverage is not deleted because its old route used Plan;
* every deleted assertion has an explicit obsolete-behavior rationale;
* shared test helpers express user intent rather than Planner implementation state;
* default app render continues to expose Month rather than automatically navigating elsewhere;
* no universal replacement `openSetup()` abstraction recreates the retired Plan mental model;
* no direct Planner-mode mutation is used to avoid normal user navigation;
* no hidden Plan wrapper, test-only Plan mode, compatibility Plan route, or environment-specific Plan composition is introduced;
* no legitimate test is skipped;
* no `.only` remains;
* no arbitrary sleep is added to handle lazy loading;
* asynchronous workflow entry is awaited through observable UI state;
* test fixtures preserve their authored semantic meaning;
* test names no longer encode obsolete Plan ownership where inappropriate;
* application integration coverage remains application-level;
* genuine production regressions, if any, are distinguished from migration defects;
* every production change is justified by a still-required Task 7.9 capability;
* every production regression repair receives focused regression coverage;
* any missing canonical capability triggers the stop condition instead of Plan resurrection;
* any ambiguous ownership triggers the stop condition instead of arbitrary placement;
* no new Month, Planning Settings, Work Pattern, Commitment Library, Detailed Review, Work preset, Pattern Library, Capacity, Allocation, Recommendation, transition-adaptation, scheduler, recurrence, authority, persistence, Backup, routing, runtime-dependency, or bundle-policy architecture is introduced;
* SetupDraft/durable authored state/Preview distinctions remain unchanged;
* PlanDecision, HistoricalPlan, ExecutionHistory, Today, and Summary semantics remain unchanged;
* exact identity remains unchanged;
* the affected `DayFrameApp` suite is green;
* focused subsystem suites are green;
* formatting is green;
* lint is green;
* typecheck is green;
* the full repository test suite is green;
* production build is green;
* bundle guard is green;
* `git diff --check` is green;
* production bundle remains at or near Task 7.9 unless a documented production regression repair changes it;
* every bundle delta is attributed;
* browser QA is not redundantly repeated when production assets are unchanged;
* any production repair receives appropriate browser revalidation;
* governance records test-suite convergence;
* Task 7.9 is formally reassessed;
* Phase 7 Planner convergence is formally reassessed;
* the integration suite no longer contains an executable assumption that the legacy Plan surface exists;
* Task 7.10 is authorized only after Task 7.9 is formally complete.

---

# 126. Final Implementation Principle

> **A strangler migration is not finished when the old screen disappears; it is finished when the system's executable expectations no longer depend on the old screen.**

Task 7.9 changed the product from:

```text
Planner
    ↓
Plan
    ↓
everything
```

to:

```text
Planner
    ↓
Month

with explicit supporting workflows
for distinct responsibilities
```

Task 7.9A must make the integration suite tell that same architectural truth.

---

# 127. Final Completion Statement

**Task 7.9A is complete when the historical `DayFrameApp` integration suite has been systematically migrated from the retired assumption that rendering Planner immediately mounts a broad Plan surface containing every authored setup form to the canonical Phase 7 architecture in which Month is the deterministic default and tests explicitly navigate through Planning Settings for Goals/global Schedule Preferences/Planning Range, Work Pattern for structural Work configuration, Commitment Library for complete scheduling-intent inventory and advanced authoring, Month for contextual planning/Event/Generate/Refresh behavior, and Detailed Review for diagnostics/friction/Try/Apply/Day Visualizer behavior; when every initially failing test or coherent group has been inventoried, classified by actual responsibility, and accounted for in a migration ledger rather than mechanically patched; when still-valid behavioral assertions are preserved through their canonical user journeys while only genuinely obsolete Plan-surface assertions are removed or replaced; when shared test helpers express user-visible navigation intent rather than directly manipulating Planner implementation state, default application rendering continues to expose the real Month default, no universal replacement setup abstraction recreates the retired Plan mental model, and no hidden, test-only, compatibility, or environment-specific Plan surface is introduced; when one SetupDraft, one whole-setup validation boundary, one Save Setup transaction, explicit Save → stale Preview → Refresh behavior, exact identity, profile/Backup/restore/full-clear/protection/recovery behavior, and all existing Goal/Event/Work/Commitment/Preview/PlanDecision/HistoricalPlan/ExecutionHistory boundaries remain unchanged; when any genuine production regression discovered by canonical test migration is explicitly distinguished from test-assumption failure, repaired only where required by already-governing Task 7.8/7.9 capability parity, and given bounded regression coverage, while any missing or ambiguously owned capability triggers a stop instead of arbitrary reassignment or Plan resurrection; when the affected `DayFrameApp` suite, focused subsystem suites, formatting, lint, typecheck, full repository tests, production build, bundle guard, and diff validation are green, production bundle output remains governed and any byte delta is attributable, browser QA is repeated only where production behavior actually changed, governance records that both production and executable integration expectations now reflect the converged Planner architecture, Task 7.9 can be formally upgraded from partially implemented to complete, and the Phase 7 Planner strangler migration can be declared finished with legacy Plan preserved only as project history rather than as either product behavior or test architecture.**
