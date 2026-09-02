# Task 7.9 — Planner Navigation Convergence, Month Default, and Legacy Plan Retirement

## Status

Ready for implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Planner navigation-convergence implementation, Month-default migration, legacy Plan user-facing retirement, supporting-workflow information-architecture alignment, capability-parity verification, obsolete Plan composition removal, SetupScreen residual-role audit, shared SetupDraft/Save Setup preservation, lifecycle/recovery preservation, accessibility/focus/keyboard/mobile validation, lazy-boundary and bundle-governance validation, regression testing, production-browser QA, and governance.

**Task 7.9 is a convergence and retirement task. It does not authorize new planning capability.**

---

# 1. Objective

Complete the Phase 7 Planner strangler migration by making **Month** the default primary Planner workspace and retiring the legacy **Plan** surface from user-facing Planner navigation.

Tasks 7.3–7.8 have already decomposed Plan's responsibilities into canonical replacement workflows:

```text
Month
    routine and contextual planning

Planning Settings
    Goals
    global Schedule Preferences
    Planning Range

Work Pattern
    structural Work configuration

Commitment Library
    complete scheduling-intent inventory

Detailed Review
    schedule diagnostics
    friction resolution
    Try
    Apply Planning Change
    Day Visualizer
```

Task 7.8 determined:

```text
Legacy Plan unique product responsibilities = 0
```

Task 7.9 must make the product's navigation and composition reflect that already-proven responsibility architecture.

---

# 2. Governing Convergence Principle

> **Retire a legacy surface only after every responsibility it carried has a proven canonical replacement.**

Task 7.9 must not remove Plan and then reconstruct missing behavior elsewhere.

Required sequence:

```text
replacement capability exists
        ↓
capability parity is reverified
        ↓
Month becomes default
        ↓
Plan navigation retires
        ↓
dead wrapper composition may be removed
```

---

# 3. Governing Planner Principle

After Task 7.9:

```text
Planner
    ↓
Month
```

Month is the default and primary routine Planner workspace.

The following remain supporting or specialized workflows:

```text
Planning Settings
Work Pattern
Commitment Library
Detailed Review
```

They do not automatically become equal primary tabs.

---

# 4. Governing Surface Hierarchy

The intended mature hierarchy is:

### Primary

**Month**

### Supporting authored workflows

* Planning Settings
* Work Pattern
* Commitment Library

### Specialized derived workflow

* Detailed Review

### Retired legacy surface

* Plan

---

# 5. Governing Responsibility Principle

> **Navigation should reflect product responsibility, not historical component composition.**

Legacy Plan may still leave behind reusable implementation modules such as:

* `SetupScreen`;
* shared Setup sections;
* validation helpers;
* draft helpers.

Those do not justify retaining Plan as a product surface.

---

# 6. Governing Authority Principle

Task 7.9 changes navigation and presentation composition only.

It must not change:

* SetupDraft authority;
* durable authored setup;
* Goal authority;
* Event authority;
* Preview;
* PlanDecision;
* HistoricalPlan;
* ExecutionHistory;
* Progress;
* scheduler semantics;
* recurrence semantics.

---

# 7. Governing Save Boundary

Preserve:

```text
edit authored planning state
        ↓
SetupDraft
        ↓
Save Setup
        ↓
durable authored setup
        ↓
Preview stale
        ↓
Refresh Schedule
```

Legacy Plan retirement must not alter this transaction model.

---

# 8. Task 7.8 Prerequisite

Treat Task 7.8 as governing.

Confirmed outcomes include:

* Commitment Library is implemented;
* complete active, disabled, and non-occurring Commitment inventory is directly reachable;
* advanced Commitment fields are directly reachable;
* recurrence authoring remains directly reachable;
* Work Pattern is directly reachable;
* Planning Settings is directly reachable;
* Month supports routine contextual authoring;
* Detailed Review remains directly reachable;
* one SetupDraft remains;
* one Save Setup transaction remains;
* legacy Plan owns zero unique product capability;
* Plan-retirement readiness is **A**;
* Month-default readiness is **Ready**;
* baseline validation is:

```text
94 test files
975 tests
```

* bundle baseline is:

```text
Initial raw        637,805
Initial gzip       162,143
Largest lazy        53,130
Total JS           763,279
```

No Task 7.8 responsibility decision should be reopened unless current production evidence contradicts the result.

---

# 9. Explicit Scope

Implement and/or audit:

* Planner default destination;
* Planner navigation hierarchy;
* Month-default behavior;
* Plan primary-navigation removal;
* Plan surface retirement;
* Planning Settings reachability;
* Work Pattern reachability;
* Commitment Library reachability;
* Detailed Review reachability;
* supporting-workflow return paths;
* Month context preservation;
* Save Setup reachability;
* global dirty-state visibility;
* Generate/Refresh reachability;
* no-Preview behavior;
* stale-Preview behavior;
* profile workflow;
* Backup workflow;
* restore workflow;
* full clear;
* protection/recovery;
* legacy Plan mode removal;
* stale Plan internal references;
* Plan-specific copy;
* SetupScreen residual role;
* dead wrapper removal;
* lazy ownership;
* bundle output;
* accessibility;
* focus;
* keyboard;
* mobile;
* browser QA;
* governance;
* Phase 7 Planner-convergence determination.

---

# 10. Explicit Non-Goals

Do not implement:

* new Month functionality;
* new Planning Settings functionality;
* new Work Pattern functionality;
* Work Pattern presets;
* preset application policy;
* new Commitment Library functionality;
* Pattern Library;
* Detailed Review migration;
* Try/Apply migration;
* direct schedule geometry editing;
* drag/drop;
* Capacity;
* Allocation;
* Recommendations;
* shift-transition adaptation;
* scheduler redesign;
* recurrence redesign;
* new authority;
* new persistence;
* Backup version change;
* runtime dependency;
* bundle-policy change.

---

# 11. Execution Artifact Rules

Before implementation:

1. verify this Task 7.9 artifact;
2. create immutable project copy;
3. record SHA-256;
4. inspect:

   * Task 7.8 result;
   * current Planner navigation;
   * Planner mode/state types;
   * `DayFrameApp`;
   * Month composition;
   * Planning Settings entry;
   * Work Pattern entry;
   * Commitment Library entry;
   * Detailed Review entry;
   * Plan entry/mode;
   * `SetupScreen`;
   * Save Setup;
   * profile/Backup/restore/full-clear;
   * protection/recovery;
   * focus management;
   * lazy imports;
   * bundle policy;
5. do not modify immutable artifacts.

Create:

`docs/implementation/phase-7/TASK_7.9_PLANNER_NAVIGATION_CONVERGENCE_MONTH_DEFAULT_AND_LEGACY_PLAN_RETIREMENT_RESULT.md`

---

# 12. Mandatory Initial Capability-Parity Audit

Before removing any Plan navigation or wrapper, mechanically reverify every currently reachable Plan capability.

At minimum:

| Legacy Plan responsibility    | Canonical replacement            |
| ----------------------------- | -------------------------------- |
| Goals                         | Planning Settings                |
| global day boundary           | Planning Settings                |
| global week start             | Planning Settings                |
| Planning Range                | Planning Settings                |
| Shift Definitions             | Work Pattern                     |
| Work cycles/schedules         | Work Pattern                     |
| manual Work regimes           | Work Pattern                     |
| repeating rotations           | Work Pattern                     |
| Off days                      | Work Pattern                     |
| regime boundary overrides     | Work Pattern                     |
| regime week-start overrides   | Work Pattern                     |
| complete Commitment inventory | Commitment Library               |
| disabled Commitments          | Commitment Library               |
| non-occurring Commitments     | Commitment Library               |
| recurrence configuration      | Commitment Library/shared editor |
| advanced Commitment fields    | Commitment Library               |
| contextual Commitment edit    | Month                            |
| contextual Work edit          | Month → Work Pattern             |
| Event authoring               | Month                            |
| Save Setup                    | shared canonical boundary        |
| Generate / Refresh            | Month                            |
| friction diagnostics          | Detailed Review                  |
| Try                           | Detailed Review                  |
| Apply Planning Change         | Detailed Review                  |
| Day Visualizer                | Detailed Review                  |

If any capability lacks a truthful replacement, trigger the Plan-retirement stop condition.

---

# 13. Zero-Unique-Responsibility Gate

Plan retirement requires current production confirmation that:

```text
uniquePlanResponsibilities.length === 0
```

Conceptual expression only.

Do not rely solely on the prior task result.

Reverify current code.

---

# 14. Previous Planner Navigation

Document the exact current navigation before changes.

At minimum determine whether users currently see:

```text
Month
Plan
Review Schedule
```

or another combination.

Record default state.

---

# 15. Final Planner Navigation

Implement the evidence-supported mature model.

Expected conceptual result:

```text
Planner
    Month

Month actions / supporting workflows:
    Planning Settings
    Work Pattern
    Commitment Library
    Detailed Review
```

Use actual existing navigation patterns.

Do not introduce a new routing framework.

---

# 16. Month Default

Entering Planner with no explicit active supporting workflow must open Month.

Required:

```text
enter Planner
    ↓
Month
```

Legacy Plan must no longer be the default.

---

# 17. Default Entry Audit

Trace all entry paths into Planner:

* application startup where applicable;
* top-level Planner navigation;
* Today → Planner;
* Summary → Planner;
* Detailed Review return;
* recovery completion;
* profile replacement;
* restore;
* full clear;
* any internal exact-target navigation.

Define deterministic behavior for each.

---

# 18. Existing Supporting Workflow Preservation

Month-default behavior applies to fresh Planner entry.

It must not forcibly redirect a user on every render when already inside a legitimate:

* Planning Settings;
* Work Pattern;
* Commitment Library;
* Detailed Review

workflow.

---

# 19. Planner Mode Model

Audit current mode/state representation.

Remove the legacy Plan mode where it no longer serves production behavior.

Conceptually, the mature mode set may resemble:

```text
month
planningSettings
workPattern
commitmentLibrary
detailedReview
```

Use actual repository architecture.

---

# 20. Plan Primary Navigation Removal

Remove Plan from the primary Planner navigation.

Users must no longer be asked to choose a broad legacy surface whose responsibilities have already been decomposed.

---

# 21. Plan User-Facing Surface Retirement

Retire the user-facing Plan workspace if the zero-responsibility gate passes.

This may include:

* Plan heading;
* Plan layout;
* Plan tab/button;
* Plan-specific mode;
* Plan-only wrapper;
* Plan-only loading state.

Retirement does not require deleting every source module historically used by Plan.

---

# 22. Planning Settings Reachability

Verify Planning Settings remains directly reachable without Plan.

Required capabilities include:

* Goals;
* global Schedule Preferences;
* Planning Range;
* Save Setup where appropriate.

---

# 23. Work Pattern Reachability

Verify Work Pattern remains directly reachable without Plan.

Required capabilities include:

* Shift Definitions;
* structural Work inventory;
* manual regimes;
* repeating rotations;
* Off days;
* regime-specific overrides;
* shared Save Setup.

---

# 24. Commitment Library Reachability

Verify Commitment Library remains directly reachable without Plan.

Required capabilities include:

* complete authored inventory;
* disabled sources;
* non-occurring sources;
* Add/Edit/Remove;
* recurrence;
* advanced fields;
* Goal-link context.

---

# 25. Detailed Review Reachability

Verify the specialized review workflow remains directly reachable without Plan.

At minimum:

* detailed schedule;
* friction diagnostics;
* exact issue navigation;
* Try;
* Apply Planning Change;
* Day Visualizer.

---

# 26. Detailed Review Naming Assessment

Audit whether current user-facing `Review Schedule` wording still fits its specialized mature role.

Possible recommendation only:

* Detailed Review;
* Schedule Review;
* Resolve Schedule.

Do not rename unless bounded and clearly supported.

Plan retirement does not depend on this rename.

---

# 27. Save Setup Reachability

Identify every workflow that may create SetupDraft changes.

Verify the user can Save Setup without opening legacy Plan.

At minimum:

* Planning Settings;
* Work Pattern;
* Commitment Library;
* Month contextual Commitment workflow;
* other current shared setup editors.

---

# 28. Pending Draft Visibility

Verify pending SetupDraft remains visible/truthful after Plan retirement.

Do not create a new dirty-state implementation.

---

# 29. Shared SetupDraft Boundary

Preserve one global SetupDraft across all supporting authored workflows.

No workflow-specific durable draft.

---

# 30. Cross-Workflow Draft Preservation

Mandatory behavior:

```text
edit Work Pattern
    ↓
return Month
    ↓
edit Commitment
    ↓
open Planning Settings
    ↓
Save Setup
```

All pending authored changes coexist.

---

# 31. Save Setup Boundary

Preserve one canonical Save Setup transaction.

No replacement Plan save action is invented.

---

# 32. Save / Refresh Separation

Preserve:

```text
Save Setup
    ≠
Refresh Schedule
```

Saving authored truth must not silently regenerate Preview.

---

# 33. Generate / Refresh Reachability

Month remains the canonical routine location for:

* Generate when no Preview exists;
* Refresh when Preview is stale.

No Plan dependency.

---

# 34. Missing Preview

Planner → Month with no Preview must remain truthful.

Allowed semantics:

* not generated;
* Generate action where canonical readiness permits.

Prohibited semantics:

* empty schedule;
* free month.

---

# 35. Stale Preview

Planner → Month with stale Preview must preserve:

* old geometry;
* stale status;
* explicit Refresh.

No Plan fallback.

---

# 36. Generation Error

Preserve existing canonical generation error/protection behavior.

Do not redirect to Plan.

---

# 37. Profile Workflow

Audit profile controls after Plan retirement.

Preserve canonical location and replacement behavior.

Profiles must not require Plan.

---

# 38. Backup Workflow

Backup remains reachable through existing lifecycle controls.

No Plan dependency.

---

# 39. Restore Workflow

Restore remains reachable and replaces authored state canonically.

No Plan dependency.

---

# 40. Full Clear

Full clear remains available and returns Planner to a truthful Month/default state.

No Plan dependency.

---

# 41. Protection

Protected authored state must never become writable empty Month/setup merely because Plan was removed.

Reuse canonical protection/recovery state.

---

# 42. Recovery

Audit recovery completion behavior.

After successful recovery, Planner should resolve to the mature safe destination—normally Month—unless exact current context dictates otherwise.

---

# 43. Legacy Plan Mode

Search production state for Plan-specific mode values.

Remove if entirely obsolete.

If stale ephemeral state may still produce it during runtime, translate safely to Month.

---

# 44. Persisted Planner Mode Audit

Verify whether Planner mode is persisted anywhere.

At minimum inspect:

* local storage;
* profiles;
* Backup;
* restore payloads.

Expected: UI mode is ephemeral.

If confirmed, no persistence migration is authorized or required.

---

# 45. Profiles Planner-Mode Boundary

Profiles must not begin storing navigation mode.

---

# 46. Backup Planner-Mode Boundary

Backup must not begin storing navigation mode.

---

# 47. Restore Planner-Mode Boundary

Restore must not begin restoring navigation mode.

---

# 48. Browser-History Boundary

Determine whether Planner sub-workflows use browser history/routes or local UI state.

If local only:

mark direct route compatibility not applicable.

If routed:

remove/translate Plan route safely.

---

# 49. Legacy URL Boundary

If a Plan-specific URL exists, define deterministic compatibility.

If none exists, mark Not applicable.

Do not invent routing infrastructure.

---

# 50. Stale Internal Plan References

Search production for references including:

* Plan surface enum/value;
* `openPlan`;
* Plan tab;
* Plan title;
* Plan focus IDs;
* Plan lazy imports;
* Plan-only adapters;
* Plan-specific accessibility names;
* Plan-specific loading copy;
* Plan-specific return actions.

Classify:

* remove;
* replace;
* preserve as generic planning language;
* internal implementation name;
* unrelated domain term.

---

# 51. Plan Copy Removal

Remove obsolete user-facing copy that specifically refers to the retired Plan surface.

Examples:

```text
Open Plan
Back to Plan
Edit in Plan
Plan tab
```

Do not globally replace ordinary English uses of “plan.”

---

# 52. Domain Naming Protection

Do not accidentally rename:

* PlanDecision;
* HistoricalPlan;
* planning range;
* planning state;
* planning workflow.

Legacy **Plan surface** retirement is narrower than the word “plan.”

---

# 53. SetupScreen Residual-Role Audit

After Plan retirement determine what `SetupScreen` currently represents.

Classify as:

### A — Shared implementation container

Still used by multiple replacement workflows.

### B — Transitional implementation ancestor

User-facing Plan is gone, but decomposition remains incomplete internally.

### C — Dead wrapper

Can be removed safely.

### D — Evidence-derived alternative.

---

# 54. SetupScreen Cleanup Rule

Do not delete `SetupScreen` merely because the Plan product surface is retired.

Delete only code proven:

* unreachable;
* redundant;
* wrapper-only;
* no longer required by replacement workflows.

Internal cleanup is not itself a product requirement.

---

# 55. Shared Section Preservation

Preserve any shared implementation still required by:

* Planning Settings;
* Work Pattern;
* Commitment Library;
* Month contextual editors.

---

# 56. Dead Plan Wrapper Removal

Remove where proven unreachable:

* Plan-only wrapper;
* Plan-only layout;
* Plan-only navigation adapter;
* Plan-only focus logic;
* Plan-only lazy entry;
* Plan-only status shell.

---

# 57. Dead-Code Audit

Perform a production import/reachability audit after retirement.

Do not delete test-owned source merely because it is no longer production reachable unless cleanup is clearly safe and worthwhile.

---

# 58. PlanDecision Boundary

Preserve PlanDecision unchanged.

PlanDecision is not part of legacy Plan UI identity.

---

# 59. Preview Boundary

No semantic change.

---

# 60. HistoricalPlan Boundary

No semantic change.

---

# 61. ExecutionHistory Boundary

No semantic change.

---

# 62. Goal Boundary

No semantic change.

---

# 63. Event Boundary

No semantic change.

---

# 64. Work Boundary

No semantic change.

---

# 65. Commitment Boundary

No semantic change.

---

# 66. Today Boundary

No semantic change.

---

# 67. Summary Boundary

No semantic change.

---

# 68. Month Context Preservation

Supporting-workflow navigation must preserve, where applicable:

* displayed Month;
* selected canonical user-day;
* pending SetupDraft;
* useful return focus.

---

# 69. Supporting Workflow Return

Every supporting workflow requires a deterministic return path to Month/context.

Examples may include:

* Back to Month;
* Back to day.

Reuse established behavior.

---

# 70. Primary-Surface Visual Hierarchy

The final Planner UI should communicate:

```text
Month = main workspace
```

Supporting workflows remain discoverable without appearing as legacy equal peers unless current UX evidence supports that layout.

---

# 71. Supporting Workflow Discoverability

Do not hide necessary workflows merely to simplify visual hierarchy.

Users must be able to find:

* Planning Settings;
* Work Pattern;
* Commitment Library;
* Detailed Review.

---

# 72. Desktop Navigation

Verify mature navigation at normal desktop widths.

No obsolete Plan control.

---

# 73. Mobile Navigation

At:

```text
320
375
390
430
```

verify:

* Month default;
* all supporting workflows reachable;
* no Plan control;
* no horizontal navigation overflow.

---

# 74. Accessibility — Planner Identity

Planner heading/landmark should make Month's role clear.

---

# 75. Accessibility — Supporting Workflows

Each supporting action requires a clear accessible name.

Do not replace Plan with an unlabeled generic menu.

---

# 76. Accessibility — Mode Semantics

If supporting workflows are implemented as modes:

* expose correct current-state semantics.

If implemented as actions/workspaces:

* do not pretend they are tabs.

Use the actual interaction model truthfully.

---

# 77. Focus — Planner Entry

Fresh Planner entry focuses:

* Month heading;
* or existing canonical Month initial target.

No focus on removed Plan UI.

---

# 78. Focus — Supporting Workflow Entry

Preserve existing deterministic focus for:

* Planning Settings;
* Work Pattern;
* Commitment Library;
* Detailed Review.

---

# 79. Focus — Return to Month

Restore useful Month context.

No focus to `body`.

---

# 80. Focus — Stale Plan Translation

If a stale runtime Plan mode must be translated to Month:

focus Month deterministically.

---

# 81. Keyboard

Without pointer input, the user must be able to:

* enter Planner;
* use Month;
* open Planning Settings;
* return;
* open Work Pattern;
* return;
* open Commitment Library;
* return;
* open Detailed Review;
* return.

---

# 82. Planner Entry From Today

Audit and preserve appropriate behavior.

Default destination should be Month unless Today requests a specific supporting workflow.

---

# 83. Planner Entry From Summary

Same.

---

# 84. Review Return

Returning from Detailed Review should restore Month/context where appropriate.

---

# 85. Recovery Return

Recovery completion must not open retired Plan.

---

# 86. Large Draft State

Verify navigation convergence does not reset SetupDraft when multiple unsaved workflows have contributed changes.

---

# 87. No New Navigation Persistence

Do not persist:

* selected supporting workflow;
* selected Month day;
* Month display;
* Plan-retirement translation state.

Unless already canonical.

---

# 88. Lazy Ownership Audit

Before and after implementation, map lazy ownership for:

* Month;
* shared Setup/authoring code;
* Planning Settings;
* Work Pattern;
* Commitment Library;
* Detailed Review;
* Today;
* Summary;
* retired Plan entry if present.

---

# 89. Plan Lazy Entry

If Plan has a dedicated user-facing dynamic import:

remove it when no longer needed.

If the same entry is still the shared implementation loader for replacement workflows:

preserve it and document its new responsibility.

---

# 90. Shared Setup Chunk

A lazy chunk containing historically Plan-owned code may remain valid.

Its existence does not mean the Plan product surface still exists.

Record actual ownership.

---

# 91. No Cosmetic Chunk Refactor

Do not split/rename chunks solely to make emitted files mirror product labels.

---

# 92. Bundle Baseline

Use Task 7.8 baseline:

```text
Initial raw        637,805
Initial gzip       162,143
Largest lazy        53,130
Total JS           763,279
```

---

# 93. Initial-Raw Governance

Warning:

```text
>= 650,000
```

Hard failure:

```text
> 685,000
```

---

# 94. Initial-Gzip Governance

Already in warning state.

Hard failure:

```text
> 170,000
```

Any eager growth requires attribution.

---

# 95. Largest-Lazy Governance

Warning:

```text
>= 80,000
```

Hard failure:

```text
> 100,000
```

---

# 96. Total-JS Governance

At:

```text
>= 800,000
```

perform governed growth review.

At:

```text
>= 825,000
```

stop for architecture review.

---

# 97. Expected Bundle Direction

Task 7.9 should ideally be bundle-neutral or reduce bytes because it removes legacy composition.

A bundle increase is not automatically failure.

It must be explained precisely.

---

# 98. No Bundle Gaming

Do not:

* change counting;
* change thresholds;
* exclude vendor;
* create pointless lazy splits;
* remove supported behavior for byte savings.

---

# 99. No Runtime Dependency

Mandatory.

---

# 100. Tests — Capability Parity

Keep at least one direct regression proving reachability of every former Plan responsibility.

At minimum:

* Goals;
* global Preferences;
* Planning Range;
* Work Pattern;
* Commitment Library;
* advanced Commitment authoring;
* Save Setup.

---

# 101. Tests — Planner Default

Cover:

* fresh Planner entry;
* Month default;
* no Plan default;
* no Plan peer navigation.

---

# 102. Tests — Existing Supporting Workflow

Opening a valid supporting workflow remains stable.

Default Month does not constantly override it.

---

# 103. Tests — Planning Settings

Direct reachability without Plan.

---

# 104. Tests — Work Pattern

Direct and contextual reachability without Plan.

---

# 105. Tests — Commitment Library

Direct and contextual reachability without Plan.

---

# 106. Tests — Detailed Review

Direct/contextual reachability without Plan.

Try/Apply/Visualizer remain.

---

# 107. Tests — Save Reachability

Pending SetupDraft can be durably saved without Plan.

---

# 108. Tests — Cross-Workflow Draft

Pending changes from multiple replacement workflows coexist.

---

# 109. Tests — Save / Refresh

Mandatory:

```text
supporting workflow edit
    ↓
Save Setup
    ↓
Month stale
    ↓
Refresh
    ↓
fresh
```

---

# 110. Tests — Missing Preview

Month remains truthful without Plan.

---

# 111. Tests — Stale Preview

Month remains truthful without Plan.

---

# 112. Tests — Generation Failure

No Plan fallback.

---

# 113. Tests — Profile Replacement

No Plan dependency.

---

# 114. Tests — Restore

No Plan dependency.

---

# 115. Tests — Full Clear

No Plan dependency.

---

# 116. Tests — Protection / Recovery

No writable fake Month/Plan fallback.

---

# 117. Tests — Legacy Plan Mode

If current mode state contains Plan:

verify removal/translation.

---

# 118. Tests — Mode Persistence Boundary

Verify Planner mode remains non-persisted if that is current architecture.

---

# 119. Tests — Month Context Preservation

Round-trip through each supporting workflow.

---

# 120. Tests — Focus

Cover:

* Planner entry;
* supporting entry;
* supporting return;
* stale Plan translation;
* recovery.

---

# 121. Tests — Accessibility

Cover:

* Month primary identity;
* supporting workflow names;
* current-state semantics;
* absence of obsolete Plan control.

---

# 122. Tests — Mobile Navigation

Component-level where useful.

Browser QA mandatory.

---

# 123. Tests — Plan Wrapper Reachability

Use source/bundle reachability evidence.

Only add automated reachability assertions if they fit existing repository testing patterns.

---

# 124. Tests — Month Regression

All existing Month behavior remains green.

---

# 125. Tests — Planning Settings Regression

All representative canonical settings behavior remains green.

---

# 126. Tests — Work Pattern Regression

All representative structural Work behavior remains green.

---

# 127. Tests — Commitment Library Regression

All representative Commitment inventory/authoring behavior remains green.

---

# 128. Tests — Review Regression

Try/Apply/Visualizer remain green.

---

# 129. Tests — Today Regression

Representative independence.

---

# 130. Tests — Summary Regression

Representative independence.

---

# 131. Browser QA — Fresh Planner Entry

Production build:

```text
open Planner
    ↓
Month
```

Verify:

* Month is primary;
* Plan is absent;
* supporting workflows are discoverable.

---

# 132. Browser QA — Planning Settings

Open directly from mature Planner.

No Plan intermediate step.

---

# 133. Browser QA — Work Pattern

Open directly and contextually.

No Plan intermediate step.

---

# 134. Browser QA — Commitment Library

Open directly and contextually.

No Plan intermediate step.

---

# 135. Browser QA — Detailed Review

Open from Month.

Verify diagnostics and resolution remain intact.

---

# 136. Browser QA — Save / Refresh

Controlled journey:

```text
Month
    ↓
supporting authored workflow
    ↓
edit
    ↓
Save Setup
    ↓
return Month
    ↓
stale
    ↓
Refresh
    ↓
fresh
```

---

# 137. Browser QA — Cross-Workflow Draft

Controlled journey:

```text
Work Pattern edit
    ↓
Month
    ↓
Commitment Library edit
    ↓
Planning Settings
    ↓
Save Setup
```

Verify one draft.

---

# 138. Browser QA — Missing Preview

Planner starts in Month.

No Plan fallback.

---

# 139. Browser QA — Profile

Controlled profile replacement.

Month remains canonical primary Planner.

---

# 140. Browser QA — Restore

Where safely reproducible.

---

# 141. Browser QA — Full Clear

Where safely reproducible.

---

# 142. Browser QA — Keyboard

Without pointer:

* enter Planner;
* navigate Month;
* open/return Planning Settings;
* open/return Work Pattern;
* open/return Commitment Library;
* open/return Detailed Review.

---

# 143. Browser QA — Mobile

Validate:

```text
320
375
390
430
```

Required:

* Month default;
* supporting workflows reachable;
* Plan absent;
* no horizontal overflow.

---

# 144. Browser QA — Slow Loading

Throttle lazy supporting workflows.

Verify:

* truthful loading;
* Month remains stable where appropriate;
* no Plan fallback;
* deterministic focus.

---

# 145. Required Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.9_PLANNER_NAVIGATION_CONVERGENCE_MONTH_DEFAULT_AND_LEGACY_PLAN_RETIREMENT_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.8 Prerequisite
4. Initial Capability-Parity Audit
5. Zero-Unique-Responsibility Gate
6. Files Changed
7. Previous Planner Navigation
8. Final Planner Navigation
9. Month Default
10. Planner Entry Audit
11. Existing Supporting Workflow Preservation
12. Planner Mode Model
13. Plan Primary Navigation Removal
14. Plan Surface Retirement
15. Planning Settings Reachability
16. Work Pattern Reachability
17. Commitment Library Reachability
18. Detailed Review Reachability
19. Detailed Review Naming Assessment
20. Save Setup Reachability
21. Pending Draft Visibility
22. Shared SetupDraft Boundary
23. Cross-Workflow Draft
24. Save Setup Boundary
25. Save / Refresh Separation
26. Generate / Refresh Reachability
27. Missing Preview
28. Stale Preview
29. Generation Error
30. Profile Workflow
31. Backup Workflow
32. Restore Workflow
33. Full Clear
34. Protection
35. Recovery
36. Legacy Plan Mode
37. Persisted Planner Mode Audit
38. Profiles Planner-Mode Boundary
39. Backup Planner-Mode Boundary
40. Restore Planner-Mode Boundary
41. Browser-History Boundary
42. Legacy URL Boundary
43. Stale Internal Plan References
44. Plan Copy Removal
45. Domain Naming Protection
46. SetupScreen Residual Role
47. SetupScreen Cleanup
48. Shared Section Preservation
49. Dead Plan Wrapper Removal
50. Dead-Code Audit
51. PlanDecision Boundary
52. Preview Boundary
53. HistoricalPlan Boundary
54. ExecutionHistory Boundary
55. Goal Boundary
56. Event Boundary
57. Work Boundary
58. Commitment Boundary
59. Today Boundary
60. Summary Boundary
61. Month Context Preservation
62. Supporting Workflow Return
63. Primary-Surface Visual Hierarchy
64. Supporting Workflow Discoverability
65. Desktop Navigation
66. Mobile Navigation
67. Accessibility
68. Focus
69. Keyboard
70. Today → Planner
71. Summary → Planner
72. Review Return
73. Recovery Return
74. No Navigation Persistence
75. Lazy Ownership Audit
76. Plan Lazy Entry
77. Shared Setup Chunk
78. No Cosmetic Chunk Refactor
79. Initial-Raw Review
80. Initial-Gzip Review
81. Largest-Lazy Review
82. Total-JS Review
83. Runtime Dependency Assessment
84. Tests Added/Changed
85. Focused Validation
86. Full Validation
87. Bundle Validation
88. Browser Fresh-Entry QA
89. Browser Planning-Settings QA
90. Browser Work-Pattern QA
91. Browser Commitment-Library QA
92. Browser Detailed-Review QA
93. Browser Save/Refresh QA
94. Browser Cross-Draft QA
95. Browser Missing-Preview QA
96. Browser Profile QA
97. Browser Restore QA
98. Browser Full-Clear QA
99. Browser Keyboard QA
100. Browser Mobile QA
101. Slow-Load QA
102. Governance Updates
103. ADR Determination
104. Deviations
105. Discoveries
106. Deferred Work
107. Capability-Parity Matrix
108. Navigation Matrix
109. Surface-Hierarchy Matrix
110. Return/Context Matrix
111. Save/Refresh Matrix
112. Lifecycle Matrix
113. Focus Matrix
114. Responsive Matrix
115. Loading Matrix
116. Lazy-Ownership Matrix
117. Bundle Matrix
118. Dead-Code Matrix
119. Legacy-Plan Matrix
120. Planner-Surface Matrix
121. Authority Matrix
122. Product-Boundary Matrix
123. Epistemic Matrix
124. Architectural Invariant Assessment
125. Stop-Condition Assessment
126. Architectural Alignment Assessment
127. Plan-Retirement Determination
128. Month-Default Determination
129. Phase 7 Planner-Convergence Assessment
130. Task 7.10 Readiness
131. Recommended Next Task
132. Final Completion Determination

---

# 146. Required Capability-Parity Matrix

| Legacy Plan capability     | Canonical replacement            | Verified equivalent? | Plan required? |
| -------------------------- | -------------------------------- | -------------------: | -------------: |
| Goals                      | Planning Settings                |                      |                |
| global day boundary        | Planning Settings                |                      |                |
| global week start          | Planning Settings                |                      |                |
| Planning Range             | Planning Settings                |                      |                |
| Shift Definitions          | Work Pattern                     |                      |                |
| Work cycles                | Work Pattern                     |                      |                |
| manual Work regimes        | Work Pattern                     |                      |                |
| repeating rotations        | Work Pattern                     |                      |                |
| Off days                   | Work Pattern                     |                      |                |
| regime overrides           | Work Pattern                     |                      |                |
| Commitment inventory       | Commitment Library               |                      |                |
| disabled Commitments       | Commitment Library               |                      |                |
| non-occurring Commitments  | Commitment Library               |                      |                |
| recurrence                 | Commitment Library/shared editor |                      |                |
| advanced Commitment fields | Commitment Library               |                      |                |
| contextual Commitment edit | Month                            |                      |                |
| contextual Work edit       | Month → Work Pattern             |                      |                |
| Event authoring            | Month                            |                      |                |
| Save Setup                 | shared                           |                      |                |
| Generate / Refresh         | Month                            |                      |                |
| diagnostics                | Detailed Review                  |                      |                |
| Try / Apply                | Detailed Review                  |                      |                |
| Day Visualizer             | Detailed Review                  |                      |                |

---

# 147. Required Navigation Matrix

| Action                          | Before Task 7.9          | After Task 7.9          |
| ------------------------------- | ------------------------ | ----------------------- |
| enter Planner                   | legacy current default   | Month                   |
| routine planning                | mixed Month/Plan         | Month                   |
| global planning configuration   | Plan / Planning Settings | Planning Settings       |
| Work structure                  | Plan                     | Work Pattern            |
| complete Commitment inventory   | Plan                     | Commitment Library      |
| detailed schedule diagnostics   | Review                   | Detailed Review         |
| return from supporting workflow | mixed                    | Month/contextual return |
| legacy Plan                     | reachable                | retired                 |

---

# 148. Required Surface-Hierarchy Matrix

| Surface            | Mature role            | Surface class | Primary? | Directly reachable? |
| ------------------ | ---------------------- | ------------- | -------: | ------------------: |
| Month              | routine planning       | Primary       |      Yes |                 Yes |
| Planning Settings  | global configuration   | Supporting    |       No |                 Yes |
| Work Pattern       | structural Work        | Supporting    |       No |                 Yes |
| Commitment Library | intent inventory       | Supporting    |       No |                 Yes |
| Detailed Review    | diagnostics/resolution | Specialized   |       No |                 Yes |
| Plan               | legacy broad setup     | Retired       |       No |                  No |

---

# 149. Required Return / Context Matrix

| Workflow            | Return destination | Displayed Month preserved? | Selected day preserved? | SetupDraft preserved? |
| ------------------- | ------------------ | -------------------------: | ----------------------: | --------------------: |
| Planning Settings   | Month              |                            |                         |                       |
| Work Pattern        | Month              |                            |                         |                       |
| Commitment Library  | Month              |                            |                         |                       |
| Detailed Review     | Month/context      |                            |                         |                       |
| profile replacement | Month/safe state   |                            |                         | canonical replacement |
| restore             | Month/safe state   |                            |                         | canonical replacement |

---

# 150. Required Save / Refresh Matrix

| Action                 | SetupDraft   | Durable authored setup | Preview                | Plan required? |
| ---------------------- | ------------ | ---------------------- | ---------------------- | -------------: |
| edit Planning Settings | changed      | unchanged              | unchanged              |             No |
| edit Work Pattern      | changed      | unchanged              | unchanged              |             No |
| edit Commitment        | changed      | unchanged              | unchanged              |             No |
| Save Setup             | synchronized | changed                | stale where applicable |             No |
| Refresh                | unchanged    | unchanged              | regenerated            |             No |

---

# 151. Required Lifecycle Matrix

| Lifecycle event  | Planner result                       | Supporting-workflow result | Plan fallback? |
| ---------------- | ------------------------------------ | -------------------------- | -------------: |
| fresh entry      | Month                                | none                       |             No |
| profile load     | Month/current safe state             | reproject/close stale      |             No |
| restore          | Month/current safe state             | reproject/close stale      |             No |
| full clear       | Month truthful cleared/default state | close stale                |             No |
| protection       | recovery-safe state                  | non-writable               |             No |
| recovery success | Month/default                        | current                    |             No |

---

# 152. Required Focus Matrix

| Action                         | Required focus |
| ------------------------------ | -------------- |
| enter Planner                  |                |
| open Planning Settings         |                |
| return from Planning Settings  |                |
| open Work Pattern              |                |
| return from Work Pattern       |                |
| open Commitment Library        |                |
| return from Commitment Library |                |
| open Detailed Review           |                |
| return from Detailed Review    |                |
| stale Plan translation         |                |
| recovery completion            |                |

---

# 153. Required Responsive Matrix

| Width   | Month default | Supporting workflows reachable | Plan absent | Horizontal overflow |
| ------- | ------------: | -----------------------------: | ----------: | ------------------: |
| 320     |               |                                |             |                  No |
| 375     |               |                                |             |                  No |
| 390     |               |                                |             |                  No |
| 430     |               |                                |             |                  No |
| tablet  |               |                                |             |                     |
| desktop |               |                                |             |                     |

---

# 154. Required Loading Matrix

| Workflow           | Lazy boundary | Month retained where appropriate? | Plan fallback? |
| ------------------ | ------------- | --------------------------------: | -------------: |
| Planning Settings  |               |                                   |             No |
| Work Pattern       |               |                                   |             No |
| Commitment Library |               |                                   |             No |
| Detailed Review    |               |                                   |             No |
| legacy Plan        | retired       |                               N/A |            N/A |

---

# 155. Required Lazy-Ownership Matrix

| Entry/chunk        | Before Task 7.9            | After Task 7.9                      | Appropriate? |
| ------------------ | -------------------------- | ----------------------------------- | -----------: |
| Month              | Month                      | primary Planner                     |              |
| shared Setup       | Plan + extracted workflows | replacement-workflow implementation |              |
| Work Pattern       | supporting                 | supporting                          |              |
| Commitment Library | supporting                 | supporting                          |              |
| Review             | specialized                | specialized                         |              |
| Today              | unchanged                  | unchanged                           |              |
| Summary            | unchanged                  | unchanged                           |              |
| Plan-only entry    | legacy                     | retired/remove if dead              |              |

---

# 156. Required Bundle Matrix

| Metric       | 7.8 baseline | 7.9 final | Warning | Hard/review |
| ------------ | -----------: | --------: | ------: | ----------: |
| Initial raw  |      637,805 |           | 650,000 |     685,000 |
| Initial gzip |      162,143 |           | 161,500 |     170,000 |
| Largest lazy |       53,130 |           |  80,000 |     100,000 |
| Total JS     |      763,279 |           |       — | 800k / 825k |

List relevant changed chunks.

---

# 157. Required Dead-Code Matrix

| Candidate                           | Production reachable after convergence? | Remove? | Reason            |
| ----------------------------------- | --------------------------------------: | ------: | ----------------- |
| Plan navigation control             |                                         |         |                   |
| Plan primary wrapper                |                                         |         |                   |
| Plan mode value                     |                                         |         |                   |
| Plan-specific focus helper          |                                         |         |                   |
| Plan-specific lazy entry            |                                         |         |                   |
| Plan-specific layout                |                                         |         |                   |
| `SetupScreen` shared implementation |                                         |         |                   |
| Commitment shared editor            |                                     Yes |      No | canonical         |
| Work shared editor                  |                                     Yes |      No | Work Pattern      |
| Settings shared sections            |                                     Yes |      No | Planning Settings |

---

# 158. Required Legacy-Plan Matrix

| Legacy Plan artifact             | Mature role                 | Fate                                    |
| -------------------------------- | --------------------------- | --------------------------------------- |
| user-facing Plan navigation      | none                        | remove                                  |
| Plan primary layout              | none                        | remove if dead                          |
| Plan mode                        | none                        | remove/translate                        |
| Plan lazy entry                  | audit                       | remove if dead                          |
| `SetupScreen`                    | audit shared implementation | preserve/decompose as evidence dictates |
| historical Plan task docs        | architecture history        | preserve                                |
| current-state Plan documentation | obsolete                    | update                                  |

---

# 159. Required Planner-Surface Matrix

| Workflow           | Mature responsibility          | Expected frequency     | Surface class |
| ------------------ | ------------------------------ | ---------------------- | ------------- |
| Month              | inspect/edit current plan      | routine                | Primary       |
| Planning Settings  | global assumptions/goals/range | occasional             | Supporting    |
| Work Pattern       | structural Work setup          | setup-heavy/occasional | Supporting    |
| Commitment Library | complete intent inventory      | occasional             | Supporting    |
| Detailed Review    | diagnosis/resolution           | exceptional/contextual | Specialized   |

Frequency may be classified as **Inferred**.

---

# 160. Required Authority Matrix

| Authority/source       | Changed by Task 7.9? | Reason               |
| ---------------------- | -------------------: | -------------------- |
| SetupDraft             |                   No | shared draft         |
| durable authored setup |                   No | Save Setup           |
| Goal authority         |                   No | Planning Settings    |
| Event authority        |                   No | Month                |
| Preview                |                   No | derived schedule     |
| PlanDecision           |                   No | Detailed Review      |
| HistoricalPlan         |                   No | historical authority |
| ExecutionHistory       |                   No | execution authority  |
| Progress               |                   No | separate             |
| Planner workspace mode |              UI only | convergence          |

---

# 161. Required Product-Boundary Matrix

| Capability                      | Task 7.9                                 |
| ------------------------------- | ---------------------------------------- |
| Month default                   | Implement                                |
| Plan primary-navigation removal | Implement                                |
| Plan user-facing retirement     | Implement if zero-capability gate passes |
| Planning Settings               | Preserve                                 |
| Work Pattern                    | Preserve                                 |
| Commitment Library              | Preserve                                 |
| Detailed Review                 | Preserve                                 |
| dead Plan wrapper removal       | Implement where proven                   |
| `SetupScreen` rename            | Not required                             |
| PlanDecision changes            | Prohibited                               |
| Work Pattern presets            | Deferred                                 |
| Pattern Library                 | Deferred                                 |
| Capacity                        | Prohibited                               |
| Allocation                      | Prohibited                               |
| Recommendations                 | Prohibited                               |
| scheduler redesign              | Prohibited                               |
| recurrence redesign             | Prohibited                               |

---

# 162. Required Epistemic Matrix

| State/evidence                        | DayFrame may represent        | Must not imply                         |
| ------------------------------------- | ----------------------------- | -------------------------------------- |
| Month is default                      | primary Planner workspace     | Month owns every authority             |
| Planning Settings                     | global planning configuration | selected-day configuration             |
| Work Pattern                          | authored structural Work      | generated Work authority               |
| Commitment Library                    | complete authored intent      | current scheduled occurrence inventory |
| Detailed Review                       | detailed diagnostic mode      | primary Planner                        |
| Plan retired                          | legacy broad UI removed       | concept of planning removed            |
| `SetupScreen` still exists internally | shared implementation         | Plan surface still exists              |
| pending SetupDraft                    | unsaved authored changes      | durable state changed                  |
| stale Preview                         | schedule needs refresh        | setup is unsaved                       |
| no Preview                            | not generated                 | empty schedule                         |

---

# 163. Architectural Invariants

Assess at minimum:

1. Month becomes Planner default.
2. Month remains primary routine Planner.
3. Planning Settings remains supporting.
4. Work Pattern remains supporting.
5. Commitment Library remains supporting.
6. Detailed Review remains specialized.
7. Plan ceases to be primary.
8. Plan retires only after capability parity passes.
9. Plan unique responsibility is rechecked before retirement.
10. no product capability disappears.
11. no replacement capability is invented in 7.9.
12. no authority changes.
13. no writer changes.
14. one SetupDraft remains.
15. one dirty-state model remains.
16. one Save Setup transaction remains.
17. whole-setup validation remains canonical.
18. Save and Refresh remain distinct.
19. Generate/Refresh remains Month-owned.
20. missing Preview remains truthful.
21. stale Preview remains truthful.
22. Planning Settings remains directly reachable.
23. Work Pattern remains directly reachable.
24. Commitment Library remains directly reachable.
25. Detailed Review remains directly reachable.
26. Month contextual Commitment editing remains.
27. Month contextual Work editing remains.
28. Month Event authoring remains.
29. Month attention remains.
30. Goal editing remains.
31. global Preferences remain.
32. Planning Range remains.
33. Shift Definition editing remains.
34. Work rotation editing remains.
35. manual Work regimes remain.
36. regime overrides remain.
37. complete Commitment inventory remains.
38. disabled Commitment discovery remains.
39. non-occurring Commitment discovery remains.
40. advanced Commitment fields remain.
41. recurrence editing remains.
42. Try remains.
43. Apply Planning Change remains.
44. Day Visualizer remains.
45. profile lifecycle remains.
46. Backup remains.
47. restore remains.
48. full clear remains.
49. protection remains truthful.
50. recovery remains truthful.
51. recovery does not require Plan.
52. PlanDecision remains unchanged.
53. HistoricalPlan remains unchanged.
54. ExecutionHistory remains unchanged.
55. Today remains unchanged.
56. Summary remains unchanged.
57. Work Pattern preset work remains deferred.
58. Pattern Library remains deferred.
59. no Capacity is added.
60. no Allocation is added.
61. no Recommendations are added.
62. no transition adaptation is added.
63. no scheduler redesign occurs.
64. no recurrence redesign occurs.
65. no persistence schema change occurs.
66. no Backup version change occurs.
67. no runtime dependency is added.
68. Planner workspace mode remains ephemeral unless current evidence contradicts this.
69. profiles do not begin storing Planner mode.
70. Backup does not begin storing Planner mode.
71. restore does not begin restoring Planner mode.
72. Month is chosen on fresh Planner entry.
73. active supporting workflow is not forcibly replaced every render.
74. stale Plan mode translates safely if relevant.
75. browser-route behavior remains deterministic if applicable.
76. legacy Plan URL behavior is explicit if applicable.
77. Today → Planner behavior is deterministic.
78. Summary → Planner behavior is deterministic.
79. Detailed Review return is deterministic.
80. recovery return is deterministic.
81. displayed Month survives supporting-workflow round trips.
82. selected user-day survives where applicable.
83. SetupDraft survives supporting-workflow round trips.
84. no navigation silently discards pending draft.
85. focus on fresh Planner entry is deterministic.
86. focus on supporting-workflow entry is deterministic.
87. focus on return is deterministic.
88. focus on stale Plan translation is deterministic.
89. keyboard access remains complete.
90. mobile workflow access remains complete.
91. Plan navigation is absent on desktop.
92. Plan navigation is absent on mobile.
93. no horizontal navigation overflow is introduced.
94. supporting workflow names remain accessible.
95. current-mode semantics remain truthful.
96. obsolete Plan-specific copy is removed.
97. generic planning terminology remains.
98. PlanDecision terminology remains.
99. HistoricalPlan terminology remains.
100. `SetupScreen` is not renamed merely for cosmetic consistency.
101. `SetupScreen` residual role is documented.
102. shared Setup components remain if reachable.
103. dead Plan wrapper code is removed where proven.
104. dead Plan navigation code is removed where proven.
105. dead Plan-specific lazy composition is removed where proven.
106. shared code is not deleted because of historical origin.
107. lazy Month ownership remains appropriate.
108. supporting authored workflows remain appropriately lazy.
109. Detailed Review remains appropriately lazy/specialized.
110. Today lazy ownership remains unchanged.
111. Summary lazy ownership remains unchanged.
112. no cosmetic chunk split is introduced.
113. bundle counting remains unchanged.
114. initial raw hard guard remains unchanged.
115. initial gzip hard guard remains unchanged.
116. largest lazy hard guard remains unchanged.
117. total JS remains reported.
118. > =800k triggers growth review.
119. > =825k triggers architecture review.
120. warning growth is attributed.
121. bundle reduction is desirable but not a completion requirement.
122. capability-parity tests pass.
123. Month-default tests pass.
124. supporting-workflow tests pass.
125. cross-draft tests pass.
126. Save/Refresh tests pass.
127. lifecycle tests pass.
128. accessibility tests pass.
129. keyboard browser QA passes.
130. mobile browser QA passes.
131. slow-load browser QA passes.
132. Plan absence is browser-validated.
133. governance records Plan retirement.
134. governance records Month default.
135. governance records mature supporting-workflow hierarchy.
136. historical architecture docs are not rewritten.
137. Plan retirement does not erase project history.
138. Phase 7 Planner convergence is explicitly assessed.
139. Task 7.10 is not predetermined.
140. next work is selected from remaining product value rather than legacy-screen cleanup.

Classify each as:

* Confirmed
* Implemented
* Preserved
* Covered by test
* Covered by browser QA
* Inferred
* Decision required
* Deferred
* Prohibited
* Not applicable
* Blocked

---

# 164. Stop Conditions

Stop Plan retirement rather than weakening architecture if:

* any current Plan capability lacks a truthful direct replacement;
* Save Setup becomes unreachable;
* pending SetupDraft becomes stranded;
* Planning Settings still requires Plan;
* Work Pattern still requires Plan;
* Commitment Library still requires Plan;
* advanced Commitment fields still require Plan;
* Detailed Review still requires Plan;
* profile/Backup/restore/full-clear/recovery still requires Plan-specific composition;
* removing Plan would delete shared writer or validation behavior;
* Planner mode is persisted under a contract requiring unresolved migration;
* legacy public route semantics are unresolved;
* supporting-workflow navigation becomes pointer-only;
* mobile navigation becomes materially worse;
* hard bundle guards fail without safe bounded remediation;
* total JS reaches 825,000;
* a new authority, persistence mechanism, runtime dependency, scheduler semantic, or recurrence semantic is required.

A source-cleanup blocker does **not** automatically block product Plan retirement.

If shared legacy implementation must remain, retire the user-facing Plan surface and document the internal residue.

---

# 165. Focused Validation

Run focused suites for:

* `DayFrameApp` Planner navigation;
* Month;
* Planning Settings;
* Work Pattern;
* Commitment Library;
* SetupDraft;
* Save Setup;
* Detailed Review;
* profile;
* restore;
* full clear;
* protection/recovery;
* accessibility/focus;
* bundle policy.

Record exact test files and counts.

---

# 166. Full Validation

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

Record:

* test files;
* tests;
* transformed modules;
* initial raw;
* initial gzip;
* Month chunk;
* shared Setup chunk;
* Work Pattern/Commitment Library ownership;
* Review chunk;
* largest lazy;
* total JS;
* warning status;
* total-review status;
* Plan lazy-entry status;
* diff result.

---

# 167. Manual Browser Validation

Use production build.

Mandatory journeys:

### Fresh Planner

```text
enter Planner
    ↓
Month
```

### Planning Settings

```text
Month
    ↓
Planning Settings
    ↓
return Month
```

### Work Pattern

```text
Month
    ↓
Work Pattern
    ↓
return Month
```

### Commitment Library

```text
Month
    ↓
Commitment Library
    ↓
return Month
```

### Detailed Review

```text
Month
    ↓
Detailed Review
    ↓
return Month
```

### Cross-workflow Save

```text
Work Pattern edit
    ↓
Commitment Library edit
    ↓
Planning Settings
    ↓
Save Setup
    ↓
Month stale
    ↓
Refresh
```

### Lifecycle

Where safely reproducible:

* profile;
* restore;
* full clear;
* recovery/protection.

### Keyboard

No pointer.

### Mobile

320 / 375 / 390 / 430.

### Slow loading

Throttle lazy workflows.

---

# 168. Governance Updates

Update:

* Task 7.9 result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`.

Record explicitly:

```text
Month
    default primary Planner

Planning Settings
    supporting global configuration

Work Pattern
    supporting structural Work configuration

Commitment Library
    supporting complete scheduling-intent inventory

Detailed Review
    specialized diagnostics/resolution

Legacy Plan
    retired
```

Also record:

* SetupScreen residual implementation role;
* dead Plan composition removed;
* deferred internal cleanup;
* Work Pattern preset architecture remains separate.

---

# 169. ADR Determination

No ADR is expected if Task 7.9 merely aligns navigation with the responsibility model already proven in Tasks 7.1–7.8.

Consider an ADR only if implementation introduces an enduring new rule involving:

* public routing;
* persisted navigation state;
* lifecycle migration;
* authority.

Do not create an ADR solely because Plan navigation is removed.

---

# 170. Plan-Retirement Determination

At task completion classify:

### A — Fully Retired

No user-facing Plan surface or unique responsibility remains.

### B — Product Retired, Internal Shared Implementation Remains

Plan is gone from the product, but historically named shared components remain.

### C — Retirement Blocked

Name the exact missing capability.

Expected successful outcome is **A or B**.

---

# 171. Month-Default Determination

At completion classify:

### Implemented

Month is the deterministic default Planner destination.

### Blocked

Name exact reason.

---

# 172. Phase 7 Planner-Convergence Assessment

Answer explicitly:

1. Is Month the default Planner?
2. Is Plan absent from user-facing navigation?
3. Are Planning Settings, Work Pattern, Commitment Library, and Detailed Review directly reachable?
4. Can routine planning occur without understanding legacy screen architecture?
5. Is SetupDraft/Save/Refresh coherent without Plan?
6. Does any user capability still require Plan?
7. Is the Planner strangler migration complete?
8. What meaningful Phase 7 product work remains?

---

# 173. Task 7.10 Readiness

Do not assume Task 7.10 content.

If convergence is complete, choose the next task from actual remaining product value.

Possible candidates may include:

* Work Pattern preset architecture/application;
* Work Pattern preset library;
* Detailed Review refinement;
* remaining Monthly Planner capability;
* another roadmap item.

Do not spend another task renaming/deleting shared internals unless they create real risk.

---

# 174. Completion Criteria

Task 7.9 is complete only when:

* the current production Plan surface has been mechanically re-audited for capability parity;
* every former Plan responsibility has a direct truthful replacement;
* the zero-unique-responsibility gate passes before retirement;
* Month becomes the deterministic default Planner destination;
* legacy Plan ceases to be a primary user-facing destination;
* obsolete Plan navigation is absent from desktop and mobile;
* Planning Settings remains directly reachable;
* Work Pattern remains directly reachable;
* Commitment Library remains directly reachable;
* Detailed Review remains directly reachable;
* all Month contextual authoring and attention workflows remain intact;
* Save Setup remains reachable wherever SetupDraft can change;
* one SetupDraft, one dirty-state model, one whole-setup validator, and one Save Setup transaction remain;
* pending draft remains visible/truthful;
* Save remains separate from Refresh;
* Generate/Refresh remains reachable from Month;
* missing Preview remains missing;
* stale Preview remains visible until Refresh;
* generation errors remain truthful;
* profile, Backup, restore, full clear, protection, and recovery remain usable without Plan;
* recovery never falls back to writable fabricated setup;
* legacy Plan mode/state is removed or translated safely;
* Planner UI state remains ephemeral unless existing evidence says otherwise;
* profiles, Backup, and restore do not begin storing navigation mode;
* Month/displayed-month/selected-day context survives supporting-workflow navigation;
* pending draft survives supporting-workflow navigation;
* all supporting workflows have deterministic return/focus behavior;
* fresh Planner focus lands on Month;
* keyboard access reaches every supporting workflow;
* mobile access at 320–430 px reaches every supporting workflow;
* no obsolete Plan control remains;
* obsolete Plan-specific copy is removed while PlanDecision/HistoricalPlan/generic planning terminology remain correct;
* `SetupScreen` residual role is explicitly classified;
* genuinely dead Plan wrappers/navigation/focus/lazy composition are removed where mechanically proven;
* shared implementation is retained where still useful;
* internal naming cleanup is not treated as a product-completion requirement;
* no new planning feature, Work preset, Pattern Library, Capacity, Allocation, Recommendation, transition adaptation, scheduler change, recurrence change, authority, persistence, Backup version, runtime dependency, or bundle-policy change is introduced;
* lazy ownership remains appropriate;
* no cosmetic chunk splitting occurs;
* all hard bundle guards remain green;
* warning growth is attributed;
* total JS remains governed by the existing 800k/825k milestones;
* focused tests pass;
* full validation passes;
* production-browser fresh-entry, supporting-workflow, cross-draft, Save/Refresh, missing-Preview, lifecycle, keyboard, mobile, slow-load, and Plan-absence QA pass;
* governance records Month as default and legacy Plan as retired;
* Plan-retirement receives explicit A/B/C classification;
* Month-default receives explicit implementation determination;
* Phase 7 Planner convergence is explicitly assessed;
* Task 7.10 is selected based on remaining user/product value rather than residual legacy-screen cleanup.

---

# 175. Final Implementation Principle

> **The migration is complete when the user no longer needs to understand DayFrame's historical screen architecture.**

The mature product should communicate:

```text
Month
    where planning happens

Planning Settings
    the assumptions that govern planning

Work Pattern
    the structure of Work

Commitment Library
    everything the user has asked DayFrame to schedule

Detailed Review
    deeper diagnosis and resolution
```

Legacy Plan should disappear because every responsibility it once carried now has a smaller and more truthful home.

---

# 176. Final Completion Statement

**Task 7.9 is complete when DayFrame has mechanically reverified that the legacy Plan surface owns zero unique product capability and has then completed the Phase 7 Planner strangler migration by making Month the deterministic default and primary Planner workspace, retiring Plan from user-facing navigation, and preserving direct truthful access to Planning Settings for Goals/global preferences/Planning Range, Work Pattern for complete structural Work configuration, Commitment Library for complete authored scheduling-intent inventory, and Detailed Review for schedule diagnostics, friction resolution, Try, Apply Planning Change, and Day Visualizer; when every capability formerly available through Plan remains reachable through one of those canonical replacement workflows without duplicate writers, alternate authority, or lost advanced behavior; when one SetupDraft, one shared dirty-state model, one canonical whole-setup validation boundary, one Save Setup transaction, explicit Save → stale Preview → Refresh semantics, Month Generate/Refresh, exact source identity, profile/Backup/restore/full-clear/protection/recovery behavior, and all existing Goal/Event/Work/Commitment/Preview/PlanDecision/HistoricalPlan/ExecutionHistory boundaries remain unchanged; when fresh Planner entry lands in Month while legitimate supporting workflows remain stable, stale Plan mode or route state is removed or translated deterministically, supporting-workflow round trips preserve displayed Month, selected user-day, pending draft, and deterministic focus, and keyboard/mobile navigation exposes every mature Planner capability without any residual Plan control; when obsolete user-facing Plan copy, navigation adapters, wrappers, focus helpers, and lazy composition are removed only where mechanically dead while historically named shared implementation such as SetupScreen is retained where still useful and is not mistaken for continued product responsibility; when no Work preset, Pattern Library, Capacity, Allocation, Recommendation, transition-adaptation, scheduler, recurrence, persistence, Backup, authority, runtime-dependency, or bundle-policy change is introduced; when all hard bundle guards remain green, governed warning/total metrics remain correctly reported, focused/full validation and production-browser fresh-entry/supporting-workflow/cross-draft/Save-Refresh/lifecycle/keyboard/mobile/slow-load/Plan-absence QA pass, governance records legacy Plan retirement and Month-default convergence, and Phase 7 can proceed from a Planner whose information architecture now reflects the precise responsibilities established by the underlying system rather than the historical broad Plan surface from which those responsibilities were incrementally extracted.**
