# Task 7.2C — Bundle Budget Governance Audit and Sustainable Production Complexity Guard ADR

## Status

Ready for governance audit and, only if justified by the audit, bounded guard-policy implementation.

## Phase

Phase 7 — Monthly Planner and Contextual Planning Workspace

## Task Type

Bundle-budget governance audit, guard-intent reconstruction, production-risk classification, historical-growth analysis, metric evaluation, sustainable headroom policy, ADR decision, bounded guard implementation if authorized, regression validation, and governance.

**This task is not bundle remediation.**

Tasks 7.2A and 7.2B have already tested local and architectural remediation hypotheses.

Task 7.2C asks whether DayFrame's current bundle guards still encode the architectural and product risks they were intended to protect.

---

# 1. Objective

Establish a durable, evidence-based bundle-budget policy for DayFrame before Phase 7 feature development continues.

Current exact production baseline from Tasks 7.2A/7.2B:

```text
Initial raw        630,499
Initial gzip       160,954
Largest lazy        51,479
Total JS           749,882

Current guards:

Initial raw        685,000
Initial gzip       170,000
Largest lazy       100,000
Total JS           750,000

Current headroom:

Initial raw         54,501
Initial gzip         9,046
Largest lazy        48,521
Total JS                118
```

Task 7.2A established that safe local cleanup cannot recover meaningful headroom.

Task 7.2B established that:

* the production graph is low-duplication;
* major surfaces are appropriately lazy;
* the singular authority architecture is not accidentally duplicated;
* compatibility code represents supported product contracts;
* moving capability implementations from eager to lazy chunks would not materially reduce the current total-JS guard;
* meaningful further reduction would require feature compression, compatibility weakening, contract changes, or disproportionate architecture work;
* the total-JS ceiling is now functioning as a hard whole-product complexity limit rather than primarily detecting accidental bundling regressions.

Task 7.2C must determine whether that is the policy DayFrame actually wants.

---

# 2. Governing Principle

> **A guard is useful only when the metric, threshold, and failure behavior correspond to a risk DayFrame intentionally wants to control.**

Do not preserve a number merely because it already exists.

Do not change a number merely because it is inconvenient.

Recover the architectural purpose.

Measure the current product against that purpose.

Then govern deliberately.

---

# 3. No Predetermined Threshold Outcome

Do **not** begin by deciding:

> Raise 750 KB.

The audit may conclude:

### Outcome A — Keep current total-JS hard ceiling

If whole-product emitted complexity is intentionally constrained to approximately 750 KB and further product growth should require code retirement.

### Outcome B — Retain total JS but establish a larger evidence-based hard ceiling

If whole-product size remains a useful hard risk metric but 750 KB no longer corresponds to the intended product envelope.

### Outcome C — Retain total JS as an advisory/trend metric

If total emitted code is useful for detecting long-term growth but is not a strong proxy for user-perceived loading/runtime cost.

### Outcome D — Replace the total hard stop with more targeted hard guards

For example:

* initial raw;
* initial gzip;
* largest lazy;
* per-feature/lazy chunk size;
* duplication/regression;
* per-task growth delta;

while retaining total JS for reporting.

### Outcome E — Hybrid policy

For example:

```text
Hard:
    initial raw
    initial gzip
    largest lazy
    abnormal task-growth delta

Advisory:
    whole-product total JS

Escalation:
    periodic architecture audit when total growth crosses a defined milestone
```

Do not choose among these until evidence is complete.

---

# 4. Governing Safety Principle

> **Bundle governance must protect architecture from both uncontrolled growth and artificial compression.**

A weak budget can allow accidental bloat.

An inappropriate budget can pressure engineers to:

* remove useful capability;
* weaken compatibility;
* over-generalize code;
* introduce unsafe lazy boundaries;
* distort module ownership;
* optimize for minifier output rather than maintainability;
* postpone legitimate product work;
* game chunk accounting.

Both failure modes are architectural problems.

---

# 5. Task 7.2A Prerequisite

Treat Task 7.2A as governing evidence.

Its conclusion:

> No safe local dead-code/deduplication/lazy-boundary remediation can recover meaningful total-JS headroom.

Do not repeat that audit.

---

# 6. Task 7.2B Prerequisite

Treat Task 7.2B as governing evidence.

Its conclusion:

> The production graph is appropriately split, low-duplication, and composed primarily of intended capability and compatibility contracts. The inherited total-JS ceiling has reached exhaustion as a whole-product complexity budget.

Do not repeat the eager/store architecture audit.

Use its ownership map and bundle evidence.

---

# 7. Explicit Scope

Audit:

* current bundle guard implementation;
* current guard thresholds;
* historical reason for each guard where recoverable;
* historical bundle growth where repository evidence exists;
* relationship between each metric and user/runtime risk;
* initial raw size;
* initial gzip size;
* largest lazy chunk;
* total emitted JS;
* React/vendor contribution;
* application contribution;
* lazy product contribution;
* code duplication risk;
* per-task growth risk;
* catastrophic-regression detection;
* healthy feature-growth expectations;
* Phase 7 expected growth;
* compatibility growth;
* framework/vendor growth;
* sustainable headroom;
* warning vs hard-failure policy;
* review/escalation triggers;
* ADR requirement;
* guard implementation if and only if authorized by the audit;
* tests;
* governance.

---

# 8. Explicit Non-Goals

Do not:

* perform another bundle-remediation pass;
* delete features;
* retire compatibility;
* change scheduler behavior;
* change recurrence;
* change authority ownership;
* redesign the store;
* implement Task 7.3;
* implement Month authoring;
* change Vite/Rolldown;
* add dependencies;
* change React;
* introduce external code loading;
* use compression tricks;
* alter source-map policy for size;
* split chunks merely to game metrics.

---

# 9. Artifact Integrity

Before implementation:

1. verify this Task 7.2C artifact;
2. save immutable project copy;
3. record SHA-256;
4. reproduce Task 7.2B baseline;
5. inspect current guard implementation;
6. make no guard change until audit findings support a policy.

Create:

`docs/implementation/phase-7/TASK_7.2C_BUNDLE_BUDGET_GOVERNANCE_AUDIT_AND_SUSTAINABLE_PRODUCTION_COMPLEXITY_GUARD_ADR_RESULT.md`

---

# 10. Baseline Reproduction

Run:

```bash
npm run build
npm run check:bundle
```

Confirm or explain differences from:

```text
Initial raw        630,499
Initial gzip       160,954
Largest lazy        51,479
Total JS           749,882
```

Record every emitted production JavaScript chunk.

---

# 11. Guard Implementation Audit

Trace the implementation of `npm run check:bundle`.

Document:

* source file;
* inputs;
* build directory inspected;
* chunk inclusion rules;
* raw-byte calculation;
* gzip calculation;
* lazy classification;
* total-JS calculation;
* failure conditions;
* reporting;
* tests, if any.

Do not infer from output alone.

---

# 12. Current Guard Matrix

Establish mechanically:

| Metric       | Current threshold | Current value | Headroom | Failure meaning |
| ------------ | ----------------: | ------------: | -------: | --------------- |
| Initial raw  |           685,000 |       630,499 |   54,501 | Audit           |
| Initial gzip |           170,000 |       160,954 |    9,046 | Audit           |
| Largest lazy |           100,000 |        51,479 |   48,521 | Audit           |
| Total JS     |           750,000 |       749,882 |      118 | Audit           |

The final column is the important one.

Determine what architectural/product failure each threshold is supposed to detect.

---

# 13. Historical Intent Reconstruction

Search repository history/documentation for the introduction and subsequent changes of bundle guards.

Where available, identify:

* introducing task/commit;
* original bundle size;
* original thresholds;
* stated rationale;
* expected future growth;
* whether thresholds were intended as temporary Phase limits;
* whether total JS was intended as duplication protection;
* whether it was explicitly intended as a permanent product-size ceiling.

Classify evidence:

* Confirmed;
* Inferred;
* Not found.

Do not manufacture rationale if documentation is absent.

---

# 14. Historical Growth Reconstruction

Using repository evidence where reasonably available, reconstruct major bundle checkpoints.

Prefer existing task results/checkpoints rather than rebuilding many historical commits unless necessary.

Produce:

| Checkpoint | Initial raw | Initial gzip | Largest lazy | Total JS | Major capability added |
| ---------- | ----------: | -----------: | -----------: | -------: | ---------------------- |

At minimum include available Phase 5, Phase 6, and Phase 7 checkpoints.

---

# 15. Growth Attribution

Separate historical growth into:

### Product capability

New real DayFrame functionality.

### Compatibility

Code retained to honor historical data/contracts.

### Framework/vendor

React/runtime/toolchain contribution.

### Accidental/regressive

Duplication, incorrect eager ownership, dead code, etc.

### Unknown

Cannot be established from repository evidence.

Do not label intended product growth as bloat.

---

# 16. Current Bundle Composition

Use Task 7.2B evidence:

```text
React vendor        189,637
Entry               436,920
Lazy/shared         123,325
Total               749,882
```

Verify current values.

Calculate approximate percentages.

The purpose is to understand what the total metric measures.

---

# 17. Initial Raw Risk Model

Determine what initial raw protects against.

Potential concerns include:

* download size;
* parsing;
* compilation;
* startup;
* memory;
* catastrophic eager import regressions.

Do not assume all are equally correlated.

Assess whether 685 KB remains reasonable.

Do not change it unless evidence supports a change.

---

# 18. Initial Gzip Risk Model

Determine what initial gzip protects against.

This is likely closer to transferred startup JavaScript than raw source size.

Assess:

* current 160,954;
* 9,046-byte headroom;
* whether this is actually the tighter user-facing guard;
* whether Phase 7 expected additions are mostly lazy and therefore should not affect it materially.

Do not loosen merely because headroom is smaller.

---

# 19. Largest Lazy Risk Model

Determine what 100 KB protects against:

* route interaction latency;
* parse/compile burst;
* accidental feature conglomeration;
* surface-level complexity.

Current largest lazy is approximately 51 KB.

Assess whether this guard remains useful.

---

# 20. Total-JS Risk Model

Determine exactly what risk total emitted JS protects against.

Candidates:

* download cost over full application lifetime;
* install/cache footprint;
* overall product complexity;
* accidental duplication;
* runaway dependency growth;
* maintenance complexity proxy;
* arbitrary historical budget.

Separate these.

Total source bytes are not automatically equivalent to runtime architectural complexity.

---

# 21. User Exposure Model

Determine whether a normal user downloads all emitted chunks:

* immediately;
* eventually through common navigation;
* only if every feature is visited;
* depending on browser/module preload behavior;
* depending on caching.

Use current build/runtime behavior.

Do not make speculative network claims without evidence.

---

# 22. Cache Model

Audit how emitted lazy chunks participate in browser caching under the current Vite production output.

The purpose is not browser optimization.

It is determining whether whole-product emitted bytes correspond directly to repeated user cost.

---

# 23. Vendor Growth Risk

React currently contributes approximately 190 KB raw.

Determine whether a whole-product hard ceiling implicitly penalizes DayFrame when framework/runtime output changes independently of DayFrame product architecture.

Do not exclude vendor automatically.

Assess whether vendor should:

* remain included in startup guards;
* remain included in total reporting;
* be separately tracked;
* participate in a hard whole-product ceiling.

---

# 24. Compatibility Growth Risk

DayFrame intentionally preserves historical formats and authority semantics.

Determine whether total-JS policy should account explicitly for compatibility growth.

Do not create a license for unlimited compatibility accumulation.

Instead ask:

> At what point should compatibility itself trigger an architecture/version-retirement review?

That is different from forcing retirement because an unrelated total byte ceiling was reached.

---

# 25. Feature Growth Risk

DayFrame is still actively implementing primary product surfaces.

Determine whether a hard whole-product ceiling established before those surfaces existed can remain fixed indefinitely without effectively becoming a feature cap.

---

# 26. Phase 7 Growth Forecast

Without implementing Task 7.3, inspect the roadmap/specification enough to identify likely remaining Phase 7 capability categories.

Do not estimate fake precise byte counts.

Classify likely growth:

* small;
* moderate;
* substantial;
* unknown.

Identify whether growth is expected primarily in:

* existing chunks;
* new lazy chunks;
* eager core.

---

# 27. Future-Phase Growth Consideration

Do not optimize only for Task 7.3.

Determine whether the selected policy remains usable as DayFrame continues beyond Phase 7.

A guard that requires governance intervention every few tasks is not sustainable.

---

# 28. Whole-Product Hard-Cap Assessment

Explicitly answer:

> Should total emitted production JavaScript remain a hard CI failure metric?

Evaluate benefits and harms.

Do not answer by preference.

Use 7.2A/7.2B evidence.

---

# 29. Advisory Total Metric Assessment

Evaluate:

> Should total emitted JS remain measured and reported even if it is no longer a hard stop?

An advisory metric can still:

* reveal trend;
* expose sudden jumps;
* trigger audits;
* support release reviews.

If adopted, specify escalation policy.

---

# 30. Per-Task Growth Guard

Evaluate whether a **delta guard** better detects accidental regressions.

Example concept only:

```text
Current known-good baseline
    +
allowed unexplained task delta
```

Do not implement a brittle baseline requiring manual edits on every legitimate feature.

Determine whether repository/build tooling can support a useful version.

---

# 31. Relative Growth Guard

Evaluate percentage-based regression detection.

Example:

```text
fail when initial bundle grows > X%
without explicit budget update
```

Assess whether this is more meaningful than absolute total size.

Do not choose a percentage arbitrarily.

---

# 32. Per-Surface Guard

Evaluate whether each lazy surface should retain a maximum.

Current:

```text
Largest lazy <= 100 KB
```

Determine whether this sufficiently protects surface-level growth or whether named feature budgets would improve governance.

Prefer simplicity unless evidence demands complexity.

---

# 33. Duplication Guard

Task 7.2B's source-map audit found low duplication.

Determine whether bundle tooling can cheaply detect future accidental duplicate ownership.

Do not introduce heavy tooling unless needed.

A periodic audit may be better than another permanent CI mechanism.

---

# 34. Dependency Guard

Evaluate whether new runtime dependencies should trigger explicit bundle review rather than relying solely on total bytes.

Current architecture has only React/React DOM/Scheduler runtime dependencies.

Do not add a dependency in this task.

---

# 35. Warning vs Failure Semantics

For each metric decide whether it should be:

* hard failure;
* warning/advisory;
* report only;
* periodic audit trigger.

Do not make every metric hard.

Hard failures should correspond to a clear architectural risk.

---

# 36. Headroom Principle

Define what **meaningful headroom** means under the chosen policy.

Headroom should provide room for normal feature work without making guards toothless.

Avoid both:

```text
118 bytes
```

and:

```text
effectively unlimited
```

---

# 37. Budget-Setting Method

If any absolute threshold changes, derive it from an explicit method.

Possible methods include:

* current known-good baseline + governed headroom;
* historical growth + expected phase growth;
* user-facing performance constraint;
* route-size constraint;
* architecture milestone budget.

Do not select a round number first and rationalize afterward.

---

# 38. Threshold Precision

Do not pretend byte-level precision has architectural meaning.

If thresholds are policy budgets, reasonable rounded values are preferable to false precision once the derivation is established.

---

# 39. Budget Review Trigger

Define when bundle policy must be revisited.

Examples:

* threshold warning zone reached;
* runtime dependency added;
* framework upgrade materially changes vendor size;
* new primary surface added;
* compatibility family expands materially;
* unexplained bundle jump;
* major phase boundary.

Choose evidence-based triggers.

---

# 40. Warning Zone

Evaluate a warning zone before hard failure.

For example:

```text
healthy
warning
hard failure
```

This may prevent another 118-byte situation.

If implemented, define deterministic behavior.

---

# 41. Architecture Audit Trigger

Consider whether reaching a high percentage of a hard guard should automatically require an architecture audit before the threshold can change.

Tasks 7.2A and 7.2B effectively performed this process manually.

The resulting ADR may formalize it.

---

# 42. No Automatic Threshold Ratchet

Do not implement:

> Build exceeded guard → automatically raise guard.

Any hard-budget increase must remain an explicit governed change.

---

# 43. No Feature-by-Feature Byte Tax

Do not require every legitimate feature to "pay for itself" by deleting an equal amount of unrelated capability unless the selected whole-product policy explicitly intends a fixed-size product.

That would be a major product constraint and must be deliberate.

---

# 44. No Compatibility-by-Accident Retirement

Do not let bundle pressure silently become data-retention policy.

Compatibility retirement requires its own evidence and decision.

---

# 45. No Lazy-Chunk Gaming

Do not reward splitting one coherent feature into many tiny chunks solely to satisfy a largest-lazy metric.

Guard policy should discourage metric gaming.

---

# 46. No Vendor Exclusion Gaming

Do not exclude React/vendor bytes merely to create cosmetic headroom unless the ADR establishes a principled reason.

Startup users still execute vendor code.

---

# 47. Candidate Policy A — Existing Policy

Evaluate:

```text
Initial raw hard       685 KB
Initial gzip hard      170 KB
Largest lazy hard      100 KB
Total JS hard          750 KB
```

State advantages, disadvantages, and consequences for Phase 7.

---

# 48. Candidate Policy B — Raised Whole-Product Ceiling

Evaluate retaining all four hard guards while deliberately increasing total-JS headroom.

If considered, derive:

* new total ceiling;
* warning threshold;
* review trigger.

Do not alter initial/lazy thresholds automatically.

---

# 49. Candidate Policy C — Total Advisory

Evaluate:

```text
Initial raw        hard
Initial gzip       hard
Largest lazy       hard
Total JS           advisory + audit trigger
```

Determine how uncontrolled whole-product growth would still be caught.

---

# 50. Candidate Policy D — Hybrid

Evaluate a hybrid such as:

```text
Initial raw             hard
Initial gzip            hard
Largest lazy            hard
Total JS                advisory
Total growth milestone  architecture audit
New dependency          explicit review
Major unexplained delta failure/review
```

This is only a candidate.

---

# 51. Candidate Policy E — Alternative Evidence-Based Model

If repository evidence suggests a better simple policy, document it.

Do not over-engineer.

---

# 52. Policy Comparison Matrix

Required:

| Policy | User-startup protection | Lazy-surface protection | Duplication protection | Whole-product growth control | Feature-growth sustainability | Gaming risk | Recommendation |
| ------ | ----------------------: | ----------------------: | ---------------------: | ---------------------------: | ----------------------------: | ----------: | -------------- |

---

# 53. Recommended Policy

Select one policy only after completing the audit.

Explain:

* what risk each metric protects;
* why it is hard/advisory;
* how threshold/headroom is derived;
* what triggers future review.

---

# 54. ADR Requirement

If the recommended policy differs materially from current behavior, create an ADR.

Suggested title if appropriate:

`ADR — Sustainable Production Bundle Budget Governance`

The ADR must record:

* context;
* evidence from 7.2A;
* evidence from 7.2B;
* previous policy;
* decision;
* metric semantics;
* hard guards;
* advisory metrics;
* headroom method;
* escalation/review triggers;
* prohibited gaming;
* consequences.

---

# 55. ADR Supersession

If an earlier ADR governs bundle limits, supersede/amend it explicitly rather than creating contradictory policy.

Search first.

---

# 56. Guard Implementation Authorization

Only after the audit and ADR decision may production/build tooling change.

Allowed if justified:

* threshold updates;
* warning thresholds;
* advisory total reporting;
* clearer guard output;
* deterministic review-trigger messages;
* tests for guard behavior.

Not allowed:

* changing what emitted files count merely to reduce reported size;
* excluding chunks without policy justification;
* changing build output;
* changing minification;
* changing compression.

---

# 57. Guard Code Simplicity

Keep guard implementation simple.

Bundle governance should not become a second build system.

Prefer a few meaningful metrics over many fragile heuristics.

---

# 58. Guard Test Coverage

If guard behavior changes, add tests covering:

* below threshold;
* warning zone if introduced;
* exact threshold;
* above threshold;
* advisory metric behavior;
* malformed/missing build output where currently relevant.

Test policy, not implementation trivia.

---

# 59. Exact Threshold Semantics

Document whether:

```text
value == threshold
```

passes or fails.

Do not leave boundary behavior implicit.

---

# 60. Baseline Independence

Avoid a guard that silently reads the developer's current local baseline and therefore always passes.

A governed threshold/reference must be repository-visible and reviewable.

---

# 61. CI Determinism

Guard output must be deterministic for identical production artifacts.

---

# 62. Build-Tool Upgrade Behavior

Define what happens when a Vite/Rolldown/React upgrade materially changes output without DayFrame feature growth.

The correct response may be:

* investigate;
* record;
* update budget through governance;

not arbitrary feature deletion.

---

# 63. Runtime Dependency Behavior

Define what happens when a future runtime dependency is proposed.

At minimum require explicit bundle impact assessment.

---

# 64. Compatibility Expansion Behavior

Define what happens when a future persisted/Backup version adds compatibility code.

Track its bundle impact, but do not automatically prohibit necessary compatibility.

---

# 65. Major Surface Behavior

Define what happens when a future primary surface is introduced.

A primary product capability may legitimately grow total emitted JS while still being correctly lazy.

---

# 66. Task-Level Reporting

Determine whether future implementation result reports should continue recording:

* initial raw;
* initial gzip;
* largest lazy;
* total JS.

Prefer continuing all four even if one becomes advisory.

Historical data is valuable.

---

# 67. Phase-Level Reporting

Consider requiring a more detailed bundle architecture review at phase boundaries rather than every small task.

---

# 68. Historical Trend Preservation

Do not discard total-JS reporting if it becomes advisory.

It remains useful for long-term trend analysis.

---

# 69. Task 7.3 Headroom Requirement

The final policy must establish enough governed room for Task 7.3 to proceed without immediately requiring another threshold intervention.

Do not estimate Task 7.3's exact bytes.

But the resulting policy must not leave effective headroom at approximately zero.

---

# 70. Phase 7 Headroom Requirement

Prefer enough policy headroom for the remainder of the current phase, not merely one task.

If this cannot be estimated responsibly, establish a review trigger rather than fake precision.

---

# 71. Long-Term Sustainability

The policy should remain useful when DayFrame has:

* mature Planner;
* Today;
* Summary;
* contextual authoring;
* richer planning intelligence;
* additional compatibility history.

Do not design the budget solely around today's codebase.

---

# 72. Performance Boundary

Bundle policy is not a substitute for actual performance testing.

If current guards are proxies, say so.

Do not claim a byte threshold guarantees good startup performance.

---

# 73. Complexity Boundary

Likewise, emitted JavaScript is not a complete measure of maintainability.

Do not call total JS an architecture-complexity measurement unless qualified as a proxy.

---

# 74. Duplication Boundary

Total JS can reveal sudden duplication but does not prove duplication.

Task 7.2B used source-map ownership to establish the current graph.

Future suspicious jumps may trigger similar audits.

---

# 75. Product Boundary

The budget exists to support the product, not define the product accidentally.

If DayFrame deliberately chooses a fixed-size application philosophy, that must be an explicit architecture/product decision.

---

# 76. Required Governance Result Artifact

Create:

`docs/implementation/phase-7/TASK_7.2C_BUNDLE_BUDGET_GOVERNANCE_AUDIT_AND_SUSTAINABLE_PRODUCTION_COMPLEXITY_GUARD_ADR_RESULT.md`

Include at least:

1. Executive Result
2. Artifact Integrity
3. Task 7.2A Prerequisite
4. Task 7.2B Prerequisite
5. Baseline Reproduction
6. Guard Implementation
7. Current Guard Matrix
8. Historical Intent
9. Historical Bundle Checkpoints
10. Historical Growth Attribution
11. Current Composition
12. Initial Raw Risk
13. Initial Gzip Risk
14. Largest Lazy Risk
15. Total-JS Risk
16. User Exposure
17. Cache Model
18. Vendor Contribution
19. Compatibility Contribution
20. Feature Growth
21. Phase 7 Forecast
22. Future-Phase Consideration
23. Whole-Product Hard-Cap Assessment
24. Advisory Total Assessment
25. Per-Task Growth Assessment
26. Relative Growth Assessment
27. Per-Surface Guard Assessment
28. Duplication Guard Assessment
29. Dependency Guard Assessment
30. Warning/Failure Semantics
31. Headroom Principle
32. Budget-Setting Method
33. Review Triggers
34. Warning Zone
35. Architecture Audit Trigger
36. Candidate Policy A
37. Candidate Policy B
38. Candidate Policy C
39. Candidate Policy D
40. Candidate Policy E if applicable
41. Policy Comparison Matrix
42. Recommended Policy
43. ADR Determination
44. ADR Created/Superseded
45. Guard Changes Authorized
46. Guard Files Changed
47. Threshold Changes
48. Warning Changes
49. Advisory Reporting Changes
50. Guard Test Changes
51. Exact Threshold Semantics
52. CI Determinism
53. Build-Tool Upgrade Policy
54. Runtime Dependency Policy
55. Compatibility Expansion Policy
56. Major Surface Policy
57. Task-Level Reporting
58. Phase-Level Reporting
59. Historical Trend Policy
60. Task 7.3 Headroom
61. Phase 7 Headroom
62. Long-Term Sustainability
63. Performance Boundary
64. Complexity Boundary
65. Duplication Boundary
66. Product Boundary
67. Focused Validation
68. Full Validation
69. Final Bundle
70. Final Guard Matrix
71. Governance Updates
72. Deviations
73. Discoveries
74. Deferred Work
75. Policy Matrix
76. Risk-to-Metric Matrix
77. Warning/Failure Matrix
78. Review-Trigger Matrix
79. Bundle Trend Matrix
80. Product-Boundary Matrix
81. Architectural Invariant Assessment
82. Stop-Condition Assessment
83. Architectural Alignment Assessment
84. Task 7.3 Readiness
85. Recommended Next Task
86. Final Completion Determination

---

# 77. Required Risk-to-Metric Matrix

| Risk | Initial raw | Initial gzip | Largest lazy | Total JS | Other policy |
| ---- | ----------: | -----------: | -----------: | -------: | ------------ |

Include:

* startup transfer;
* startup parse/compile;
* accidental eager import;
* oversized contextual surface;
* duplicate dependency/module;
* runaway total growth;
* compatibility accumulation;
* runtime dependency growth;
* normal feature growth.

---

# 78. Required Warning/Failure Matrix

| Metric | Healthy | Warning | Hard failure | Rationale |
| ------ | ------: | ------: | -----------: | --------- |

If a metric is advisory, use `N/A` appropriately.

---

# 79. Required Review-Trigger Matrix

| Trigger                        | Required response |
| ------------------------------ | ----------------- |
| initial warning reached        |                   |
| lazy warning reached           |                   |
| total milestone reached        |                   |
| unexplained large delta        |                   |
| runtime dependency added       |                   |
| framework upgrade jump         |                   |
| compatibility family expansion |                   |
| phase boundary                 |                   |

Populate from the selected policy.

---

# 80. Required Bundle Trend Matrix

Use all reliable repository checkpoints.

| Phase/task | Initial raw | Initial gzip | Largest lazy | Total JS | Interpretation |
| ---------- | ----------: | -----------: | -----------: | -------: | -------------- |

Do not fabricate unavailable numbers.

---

# 81. Required Product-Boundary Matrix

| Capability                      | Task 7.2C                   |
| ------------------------------- | --------------------------- |
| guard governance audit          | Implement                   |
| historical guard reconstruction | Implement                   |
| bundle-risk model               | Implement                   |
| sustainable budget policy       | Implement                   |
| ADR                             | Implement if policy changes |
| guard tooling changes           | Only after decision         |
| bundle remediation              | Prohibited                  |
| feature deletion                | Prohibited                  |
| compatibility retirement        | Prohibited                  |
| Task 7.3                        | Prohibited                  |
| Month authoring                 | Prohibited                  |
| scheduler changes               | Prohibited                  |
| authority changes               | Prohibited                  |
| dependency changes              | Prohibited                  |
| build-output gaming             | Prohibited                  |

---

# 82. Architectural Invariants

Assess at minimum:

1. Task 7.2A evidence remains governing.
2. Task 7.2B evidence remains governing.
3. current production graph is not re-remediated without new evidence.
4. singular authorities remain unchanged.
5. scheduler behavior remains unchanged.
6. recurrence remains unchanged.
7. user-day semantics remain unchanged.
8. display-week semantics remain unchanged.
9. Month remains read-only.
10. Today remains execution reporting.
11. Summary remains historical interpretation.
12. Plan remains authoring.
13. Review remains resolution/review.
14. Backup support remains unchanged.
15. restore support remains unchanged.
16. profiles remain unchanged.
17. recovery remains unchanged.
18. full clear remains unchanged.
19. strict validation remains unchanged.
20. historical unknowns remain unknown.
21. no compatibility format is retired.
22. no runtime dependency is added.
23. Vite/Rolldown configuration remains unchanged except guard tooling if authorized.
24. emitted production files continue to be counted consistently unless ADR explicitly changes metric semantics for principled reasons.
25. no chunk is excluded merely to lower reported total.
26. no source-map/minifier trick is used.
27. current baseline is reproduced before policy change.
28. each existing guard's intended risk is investigated.
29. missing historical rationale is marked Not found.
30. total JS is not assumed to equal user startup cost.
31. initial gzip is not assumed to equal total product complexity.
32. largest lazy remains interpreted as a contextual loading proxy.
33. emitted bytes are treated as proxies, not direct performance guarantees.
34. vendor contribution is explicitly considered.
35. compatibility contribution is explicitly considered.
36. product feature growth is explicitly considered.
37. Phase 7 growth is explicitly considered.
38. future-phase sustainability is explicitly considered.
39. policy does not optimize solely for Task 7.3.
40. threshold changes require explicit rationale.
41. thresholds are not automatically ratcheted.
42. warning thresholds, if used, have explicit response semantics.
43. hard failures correspond to identified risks.
44. advisory metrics remain visible.
45. total-JS historical trend remains available.
46. legitimate feature growth is not automatically classified as regression.
47. compatibility growth is not automatically classified as regression.
48. unexplained growth remains actionable.
49. runtime dependency additions remain reviewable.
50. framework upgrade jumps remain reviewable.
51. a hard whole-product ceiling is retained only if deliberately desired.
52. a raised hard ceiling is derived rather than arbitrary.
53. an advisory total metric has explicit escalation triggers.
54. any delta policy is repository-visible and deterministic.
55. no local-current-baseline auto-pass mechanism is introduced.
56. exact threshold equality semantics are documented.
57. CI behavior remains deterministic.
58. guard tooling remains simple.
59. guard tests cover changed policy.
60. bundle reporting remains understandable to humans.
61. healthy/warning/failure states are distinguishable if introduced.
62. meaningful headroom is defined.
63. effective headroom is restored if Task 7.3 is authorized.
64. Phase 7 does not proceed under a 118-byte practical margin.
65. budget policy supports remaining primary-surface work.
66. policy does not permit unlimited whole-product growth.
67. review triggers prevent silent long-term accumulation.
68. phase-level review is considered.
69. architecture audits remain available for suspicious growth.
70. duplication remains auditable.
71. performance concerns remain separately testable.
72. maintainability is not reduced to a byte count.
73. product capability is not accidentally defined by an inherited byte number.
74. feature retirement requires its own decision.
75. compatibility retirement requires its own decision.
76. build-system changes require their own evidence.
77. guard policy is recorded in governance.
78. ADR is created if policy materially changes.
79. prior conflicting ADR is superseded/amended.
80. current baseline metrics remain recorded.
81. final metrics remain recorded.
82. all current production behavior remains byte/semantically unchanged except guard tooling.
83. focused guard validation passes.
84. full repository validation passes.
85. bundle check passes under the selected policy.
86. no production capability is added in this task.
87. no Task 7.3 implementation leaks into this task.
88. selected policy has an explicit future review mechanism.
89. selected policy explains how framework growth is handled.
90. selected policy explains how compatibility growth is handled.
91. selected policy explains how new dependencies are handled.
92. selected policy explains how new primary surfaces are handled.
93. selected policy explains how unexplained regressions are handled.
94. selected policy explains warning-zone behavior.
95. selected policy explains hard-failure behavior.
96. selected policy explains total-JS reporting.
97. selected policy explains initial bundle reporting.
98. selected policy explains lazy chunk reporting.
99. selected policy is sustainable beyond Phase 7.
100. Task 7.3 readiness follows from governance rather than an informal exception.

Classify each as:

* Confirmed;
* Implemented;
* Preserved;
* Covered by test;
* Deferred;
* Prohibited;
* Not applicable;
* Blocked.

---

# 83. Stop Conditions

Stop without changing guard policy if:

1. historical evidence establishes that 750 KB is an intentional fixed whole-product product constraint still governing DayFrame;
2. changing the guard would contradict an existing unsuperseded architecture/product decision;
3. reliable current bundle metrics cannot be reproduced;
4. the guard implementation cannot be understood deterministically;
5. Task 7.2B evidence proves inaccurate and a real architecture regression is discovered;
6. the only proposed policy rationale is "we need more room";
7. the proposed replacement policy cannot constrain uncontrolled growth;
8. the proposed policy requires build-output gaming;
9. the proposed policy requires removing vendor or chunks from measurement without principled justification;
10. the proposed policy is so complex that developers cannot reasonably understand when a build should fail.

If a prior governing ADR blocks change, identify the required supersession decision.

---

# 84. Preferred Decision Characteristics

A strong result will likely have these characteristics, though the audit must decide:

* startup-sensitive metrics remain hard;
* surface-sensitive lazy metrics remain hard;
* whole-product total remains visible;
* total growth cannot become unlimited;
* ordinary feature growth does not require byte-for-byte feature deletion;
* suspicious jumps trigger investigation;
* major milestones trigger architectural review;
* thresholds maintain real headroom;
* policy is simple enough to understand from `check:bundle` output.

Do not treat this section as a predetermined answer.

---

# 85. Focused Validation

If guard tooling changes, run its tests plus direct fixture/scenario validation for:

* healthy;
* warning;
* hard failure;
* exact boundary;
* advisory total;
* missing artifact if applicable.

If only documentation/ADR changes, explain why production guard validation is unchanged.

---

# 86. Full Validation

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

* transformed modules;
* test files;
* tests;
* all emitted chunks;
* initial raw;
* initial gzip;
* largest lazy;
* total JS;
* selected guard state;
* headroom where applicable.

---

# 87. Manual Validation

No product UI change is expected.

Real-browser QA is not required unless production application code unexpectedly changes.

If only build guard/governance code changes, validate CLI output directly.

---

# 88. Governance Updates

Update:

* Task 7.2C result;
* Phase 7 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `CHANGELOG.md`;
* ADR index if present;
* bundle/build documentation if present.

The selected policy must be discoverable without reading Task 7.2C's entire result.

---

# 89. Recommended ADR Shape

If warranted:

# ADR — Sustainable Production Bundle Budget Governance

## Context

Record:

* why guards exist;
* 7.2A result;
* 7.2B result;
* current baseline;
* exhaustion of the 750 KB total ceiling.

## Decision

Specify:

* hard metrics;
* advisory metrics;
* thresholds;
* warning zones;
* review triggers;
* update process.

## Consequences

Record:

* what still fails CI;
* what merely warns;
* how legitimate product growth proceeds;
* how suspicious growth is investigated;
* how compatibility/framework growth is handled;
* when another architecture audit is required.

---

# 90. Task 7.3 Readiness

Task 7.3 is authorized only if:

* the governance audit completes;
* no unresolved prior ADR prevents the selected policy;
* any required ADR is accepted;
* guard tooling reflects the accepted policy;
* current production build passes;
* meaningful practical headroom exists under all hard guards;
* total-JS trend remains visible;
* future review/escalation rules are explicit.

Otherwise Task 7.3 remains blocked.

---

# 91. Recommended Next Task

If governance resolves successfully:

> **Task 7.3 — Monthly Planner Contextual Authoring and Exact Source Navigation**

If governance reveals another prerequisite:

name that exact prerequisite instead.

Do not create another generic bundle-remediation task unless new evidence reveals actual production waste.

---

# 92. Completion Criteria

Task 7.2C is complete only when:

* Task 7.2A and 7.2B evidence is treated as governing;
* the exact current production baseline is reproduced;
* `check:bundle` is mechanically traced;
* the inclusion and failure semantics of all four current metrics are documented;
* historical intent for the guards is recovered where repository evidence permits and marked unknown where it does not;
* reliable historical bundle checkpoints are assembled without fabricated values;
* growth is classified into intended product capability, compatibility, framework/vendor, accidental regression, or unknown where evidence supports that classification;
* initial raw, initial gzip, largest lazy, and total emitted JS are each mapped to the actual risk they are intended to proxy;
* normal user exposure to eager and lazy code is assessed;
* vendor/runtime contribution is explicitly considered rather than automatically excluded;
* compatibility growth is explicitly considered without treating supported history as disposable;
* active product/Phase 7 growth is distinguished from accidental bloat;
* the sustainability of a fixed whole-product hard ceiling is explicitly evaluated;
* hard, advisory, warning, and review-trigger semantics are considered separately;
* existing policy plus raised-hard-cap, advisory-total, hybrid, and any better evidence-based candidate are compared;
* the selected policy explains how uncontrolled growth remains constrained;
* meaningful headroom is defined;
* any absolute threshold is derived from an explicit method rather than chosen merely to clear the current build;
* exact threshold equality behavior is documented;
* framework/toolchain growth, runtime dependencies, compatibility expansion, primary-surface additions, and unexplained regressions each have explicit governance responses;
* total-JS trend reporting is preserved even if its failure semantics change;
* warning/review mechanisms prevent the application from silently growing without bound;
* no threshold automatically ratchets upward;
* no chunk/vendor/build output is excluded merely to manufacture compliance;
* no product feature, compatibility contract, authority, scheduler behavior, or runtime architecture is changed;
* any materially changed bundle policy is recorded in an accepted ADR and conflicting prior policy is explicitly superseded/amended;
* guard tooling is changed only after the policy decision and remains deterministic and simple;
* guard tests cover any changed warning/failure/advisory behavior;
* focused and full repository validation pass;
* current production metrics are recorded under the new policy;
* Phase 7 has meaningful governed room to continue rather than another near-zero margin;
* the selected policy remains credible beyond Task 7.3 and beyond Phase 7;
* Task 7.3 is either explicitly authorized by the accepted governance model or remains blocked on a precisely named prerequisite.

---

# 93. Final Implementation Principle

> **Measure what matters. Fail on risks we intentionally prohibit. Warn on trends we intentionally monitor. Revisit budgets through evidence, never convenience.**

The bundle guard exists to protect DayFrame.

DayFrame does not exist to protect an inherited bundle number.

At the same time:

> **A mature product cannot call every byte of intended functionality acceptable growth.**

The sustainable policy must preserve both truths.

---

# 94. Final Completion Statement

**Task 7.2C is complete when DayFrame has reconstructed, as far as repository evidence permits, why its production bundle guards exist and what architectural or user-facing risk each one is intended to constrain; when the current 749,882-byte production graph and its eager, vendor, shared, and lazy composition have been evaluated in light of Tasks 7.2A and 7.2B rather than subjected to a third speculative remediation pass; when initial raw size, initial transferred gzip, largest contextual chunk, total emitted JavaScript, framework contribution, compatibility accumulation, legitimate feature growth, accidental duplication, runtime-dependency growth, and unexplained task deltas have been distinguished instead of collapsed into one notion of bundle health; when the existing fixed 750 KB whole-product ceiling, a deliberately raised hard ceiling, an advisory-total model, a hybrid model, and any superior evidence-based alternative have been compared according to startup protection, contextual-loading protection, regression detection, whole-product growth control, sustainability, simplicity, and resistance to metric gaming; when DayFrame has selected and documented a policy in which every hard failure corresponds to an intentional architectural risk, every advisory metric has an explicit escalation purpose, meaningful headroom exists for ordinary governed product development, and no threshold can silently ratchet upward simply because a build approaches it; when framework upgrades, compatibility expansion, new runtime dependencies, new primary surfaces, unexplained bundle jumps, warning-zone entry, and phase boundaries each have explicit review semantics; when total-JS history remains visible even if its CI role changes; when no supported feature, historical format, authority, scheduler invariant, persistence guarantee, recovery behavior, or build output is distorted merely to satisfy accounting; when any material policy change is captured in an accepted Sustainable Production Bundle Budget Governance ADR and implemented through deterministic, tested, understandable guard tooling; when all repository validation passes under that policy; and when Task 7.3 can proceed with deliberate, sustainable engineering headroom rather than an informal exception to a nearly exhausted inherited number.**
