# Task 5.10 — Progress V1 and Measurement-Policy Architecture Audit

## Status

Ready for architecture audit.

## Phase

Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

## Task Type

Read-only architecture audit covering Progress semantics, measurement-policy design, qualitative versus measurable Goals, evidence eligibility, target/horizon interpretation, lifecycle boundaries, policy versioning, Summary/Planner responsibility, persistence/authority boundaries, and Phase 5 sequencing.

**No Progress implementation is authorized.**

---

# 1. Context

Phase 5 has now established:

```text
Goal
    independent durable authored intent

Goal Activity
    derived historical evidence
```

Task 5.9 made Goal Activity user-visible in Summary as a bounded read-only capability.

Goal Activity answers:

> **What historical planning and reported activity supported this Goal?**

It does not answer:

> **How far along is this Goal?**

That distinction is deliberate.

Current Goal Activity provides:

* current Goal context;
* historical Goal membership from frozen HistoricalPlan provenance;
* Goal-linked planning distribution:

  * scheduled;
  * unplaced;
  * omitted;
  * blocked;
* Goal-linked scheduled-outcome distribution:

  * completed;
  * partial;
  * skipped;
  * unknown;
  * not reported;
* plan coverage;
* Goal-link coverage;
* reporting coverage;
* deterministic evidence drill-down.

Current Goal V1 may also contain:

* optional target date;
* optional measurement-policy reference.

However:

* no concrete measurement policy exists yet;
* no Progress policy exists;
* no Progress projection exists;
* no Progress UI exists;
* Goal completion remains explicit authored lifecycle state;
* Goal Activity remains descriptive only.

Task 5.9 therefore recommended:

> **Task 5.10 — Progress V1 and Measurement-Policy Architecture Audit.**

---

# 2. Purpose

Determine whether DayFrame is ready to define Progress V1 and, if so, what the smallest truthful Progress architecture should be.

Task 5.10 must answer:

1. What exactly does Progress mean in DayFrame?
2. Which Goals are eligible for measurable Progress?
3. Which Goals are not?
4. Does every measurable Goal require an explicit measurement policy?
5. What belongs in Goal authority versus derived Progress policy?
6. Is a percentage ever valid?
7. If so, under what denominator?
8. How should qualitative Goals be represented?
9. How should Goal Activity relate to Progress?
10. Can Goal-linked occurrence evidence directly drive Progress?
11. When is execution evidence sufficient?
12. What does missing reporting mean?
13. What does partial mean?
14. How should target dates affect interpretation?
15. How should Goal lifecycle affect Progress?
16. Does completed Goal status imply 100%?
17. Does Progress ever write Goal authority?
18. Should Progress remain pure/derived/non-persisted?
19. What policy identity/version is required?
20. What happens when measurement policy changes?
21. What historical context must be frozen?
22. Is current Goal provenance sufficient?
23. Does Progress need new historical authority?
24. Does Progress need a new Goal field?
25. What belongs in Summary?
26. What belongs in Planner?
27. What should the first Progress V1 implementation task be?
28. What should remain deferred?

---

# 3. Governing Progress Principle

> **Progress is a policy-governed interpretation of evidence relative to explicit authored Goal measurement semantics.**

Progress must never be inferred merely because Goal Activity exists.

---

# 4. Governing Measurement Principle

> **No Goal receives a percentage unless the user-authored Goal semantics and a versioned measurement policy define a truthful numerator and denominator.**

---

# 5. Governing Qualitative-Goal Principle

> **A Goal may be completely valid without supporting numeric Progress.**

Examples:

```text
Maintain family time
Develop as a writer
Exercise consistently
Stay engaged with learning
```

Do not force these into fake quantitative models.

---

# 6. Governing Lifecycle Principle

> **Goal lifecycle and Progress are separate semantics.**

Therefore:

```text
Goal status = completed
```

does not automatically mean:

```text
Progress = 100%
```

unless a specific policy defines that relationship.

Likewise:

```text
Progress = 100%
```

must not automatically mutate Goal status.

---

# 7. Explicit Scope

Audit:

* Progress definition;
* measurable versus qualitative Goals;
* measurement-policy architecture;
* percentage validity;
* numerator/denominator semantics;
* current Goal field sufficiency;
* Goal Activity relationship;
* HistoricalPlan evidence;
* ExecutionHistory evidence;
* Goal lifecycle;
* target date;
* missing evidence;
* partial evidence;
* user-declared progress;
* milestone models;
* quantity models;
* binary completion models;
* ongoing/maintenance models;
* policy identity/version;
* evaluation cutoff;
* policy changes;
* historical interpretation;
* Summary presentation boundary;
* Planner authored-policy boundary;
* persistence/Backup/restore implications;
* implementation sequencing.

---

# 8. Explicit Non-Goals

Do not implement:

* Progress types;
* Progress projection;
* Progress UI;
* measurement-policy registry;
* measurement-policy UI;
* Goal schema changes;
* HistoricalPlan schema changes;
* ExecutionHistory schema changes;
* Recommendations;
* RecommendationDecision;
* adaptation;
* Goal scoring;
* Goal health;
* pace;
* “on track”;
* target urgency;
* Capacity;
* Planned Allocation;
* trends;
* comparisons;
* machine learning.

---

# 9. Execution Artifact Rules

Before auditing:

1. verify this Task 5.10 artifact is complete;
2. save an immutable project copy;
3. compare supplied and saved copies where applicable;
4. record SHA-256;
5. review:

   * Task 5.1 result;
   * Task 5.2 result;
   * Goal ADR;
   * Task 5.3 result;
   * Task 5.5 result;
   * Task 5.7 result;
   * Task 5.8 result;
   * Task 5.9 result;
   * Goal V1 domain;
   * measurementPolicyRef semantics;
   * HistoricalPlan frozen Goal provenance;
   * Goal Activity projection;
   * Goal Activity Summary UI;
   * ExecutionHistory outcome model;
   * Goal lifecycle semantics;
   * target-date semantics;
   * current Historical Intelligence policy/version conventions;
6. do not modify the immutable Task 5.10 artifact.

Create:

`docs/implementation/phase-5/TASK_5.10_PROGRESS_V1_AND_MEASUREMENT_POLICY_ARCHITECTURE_AUDIT_RESULT.md`

---

# 10. Audit Method

Perform a fresh architecture audit.

For every conclusion classify as:

* **Confirmed**
* **Supported**
* **Architecture recommendation**
* **Requires decision**
* **Deferred**
* **Unsupported**
* **Blocker**
* **Not found**

Do not design Progress from UI expectations.

---

# 11. Current Goal Contract Reconstruction

Reconstruct exact Goal V1 fields.

At minimum:

* Goal ID;
* revision;
* lifecycle;
* title;
* description;
* target date;
* measurement-policy reference;
* commitment links.

Determine what Progress can and cannot derive from these fields.

---

# 12. Current Goal Activity Reconstruction

Reconstruct the exact Goal Activity contract.

Document what evidence it provides and what it deliberately does not mean.

---

# 13. Progress Problem Definition

Define Progress.

Candidate:

> **A policy-versioned interpretation of evidence describing movement toward an explicitly measurable Goal state or target.**

Assess whether:

* movement;
* target;
* measurable;

are all required.

---

# 14. Goal Activity vs Progress

Define the boundary:

```text
Goal Activity
    what supporting work happened

Progress
    what that evidence means relative to Goal measurement semantics
```

Do not collapse these.

---

# 15. Progress Eligibility

Determine whether a Goal is eligible for Progress only when:

```text
measurementPolicyRef exists
```

or whether some built-in Goal lifecycle types may have implicit semantics.

Strong default:

> explicit policy required.

Audit.

---

# 16. No-Policy Goal

For a Goal with no measurement policy:

possible result:

```text
Progress unavailable / not defined
```

while Goal Activity remains fully available.

Determine preferred wording and architecture.

---

# 17. Unknown Policy

If Goal contains a syntactically valid but unsupported policy reference:

return:

```text
unsupported measurement policy
```

not:

```text
0% progress
```

---

# 18. Measurement-Policy Definition

Define what a measurement policy owns.

Candidate responsibilities:

* eligibility;
* evidence source;
* numerator;
* denominator;
* unit;
* aggregation;
* interpretation;
* zero behavior;
* partial handling;
* cutoff;
* provenance;
* compatibility.

Refine.

---

# 19. Measurement Policy Identity

Require explicit:

```text
measurementPolicyId
measurementPolicyVersion
```

Determine whether current `{id, version}` Goal reference is sufficient.

---

# 20. Progress Policy vs Measurement Policy

Decide whether DayFrame needs:

### A. one MeasurementPolicy that fully defines Progress

### B. MeasurementPolicy + generic GoalProgressPolicy

### C. one generic Progress policy with measurement strategy

### D. another architecture

Avoid unnecessary policy layering.

---

# 21. Measurement-Policy Registry

Determine whether policies should be registered in code.

Likely V1:

```text
known deterministic built-in policy registry
```

No user-authored arbitrary formulas.

Audit.

---

# 22. User-Authored Measurement Configuration

Determine whether a policy reference needs authored parameters.

Examples:

```text
Target quantity: 100 miles
Target quantity: 50,000 words
Target frequency: 3 sessions/week
```

Current Goal V1 stores only:

```text
measurementPolicyRef
```

not generic policy parameters.

This may be a blocker.

Audit carefully.

---

# 23. Goal Schema Sufficiency

Explicitly determine whether current Goal V1 can represent a useful measurable target.

Choose:

### A. Yes; policy reference alone is sufficient

### B. No; Goal requires policy-specific authored configuration

### C. Some policy classes are possible without additional fields

Explain.

---

# 24. Possible Policy Classes

Evaluate at least:

### Binary explicit completion

```text
Earn Security+
```

Possible output:

* not completed;
* completed.

But note lifecycle already stores completion.

Is this useful as Progress?

### Quantity target

```text
Write 50,000 words
```

Requires numeric evidence and target.

### Count target

```text
Complete 20 practice labs
```

Requires countable evidence.

### Frequency/consistency

```text
Exercise 3 times/week
```

May represent adherence, not Goal completion.

### Milestone

```text
Finish course modules 1–10
```

Requires milestone authority/evidence.

### Ongoing maintenance

```text
Maintain family time
```

May not support completion Progress.

Classify V1 readiness.

---

# 25. Binary Completion Policy

Assess whether a policy that simply maps:

```text
Goal status completed
```

to:

```text
Progress complete
```

adds useful derived intelligence.

Likely not.

It duplicates authored lifecycle.

Do not call lifecycle reflection Progress unless justified.

---

# 26. Quantity Policy

Assess data requirements.

Potential:

```text
target = 100 miles
observed = 37 miles
progress = 37%
```

Where does:

* target;
* observed quantity;
* unit;

come from?

Current Goal/ExecutionHistory likely cannot support arbitrary quantities.

Identify gaps.

---

# 27. Count Policy

Possible:

```text
target = 20 linked occurrences completed
observed = 8 completed
```

But this may conflate supporting work with Goal progress.

Example:

```text
20 study sessions
```

is not necessarily equivalent to:

```text
Earn Security+
```

Determine when count-of-activities is legitimate only if user explicitly authored that as Goal measurement.

---

# 28. Commitment-Activity Policy

Could user define:

> Goal progress is measured by completed linked commitment occurrences.

Assess whether this is semantically valid as an optional policy.

Potential problem:

* one commitment may support multiple Goals;
* completed occurrence may not equal outcome progress;
* no link weights.

Do not assume.

---

# 29. Time-Based Policy

Could user define:

> Goal target = 100 hours of practice.

Audit whether ExecutionHistory records actual duration sufficiently.

Do not use scheduled duration as actual effort.

If actual-duration evidence is incomplete, defer.

---

# 30. Milestone Policy

Requires durable milestone definitions and completion evidence.

No milestone authority currently exists.

Likely future work.

---

# 31. User-Reported Numeric Progress

Consider whether Progress should support explicit user-authored updates such as:

```text
37 / 100 miles
```

This would introduce new durable progress evidence authority.

Audit whether this is necessary for useful Progress V1.

---

# 32. External Evidence

Defer.

No wearables, APIs, imports, integrations, telemetry, etc.

---

# 33. Progress Evidence Sources

Classify possible sources:

* Goal lifecycle;
* Goal Activity;
* HistoricalPlan;
* ExecutionHistory;
* future user numeric updates;
* future milestone evidence;
* future external evidence.

For each:

* available now?
* sufficient?
* authoritative?
* derived?
* safe for V1?

---

# 34. Progress From Goal Activity

Determine whether Goal Activity should ever be a direct numeric Progress input.

Strong caution:

```text
8 completed study sessions
```

does not automatically imply:

```text
40% toward certification
```

Adopt explicit boundary.

---

# 35. Progress From Execution Outcomes

Execution outcomes may only contribute when a measurement policy explicitly defines their meaning.

Do not hardcode:

```text
completed = 1 progress unit
partial = 0.5
```

---

# 36. Partial Handling

Measurement policy must explicitly define whether partial:

* contributes;
* does not contribute;
* is unsupported;
* requires additional quantity evidence.

No generic weighting.

---

# 37. Unknown / Not Reported

Do not treat either as zero contribution unless policy explicitly defines missing evidence semantics—and likely avoid that.

---

# 38. Skipped

Do not infer negative Progress.

Most policies should likely exclude skipped from achieved numerator while preserving denominator semantics only where explicitly defined.

Audit carefully.

---

# 39. Unplaced / Blocked / Omitted

These are planning dispositions.

They must not directly reduce Goal Progress unless policy explicitly concerns planning realization.

But then that may be a planning metric rather than Goal Progress.

Separate.

---

# 40. Progress Denominator

Define requirements for a valid denominator.

It must be:

* explicitly authored or policy-defined;
* meaningful for the Goal;
* stable/versioned;
* explainable.

Do not use:

* number of scheduled occurrences;
* time elapsed;
* target date;
* count of linked commitments;

by default.

---

# 41. Percentage Validity

A percentage is valid only if:

```text
numerator and denominator
share the same explicit unit
```

and the denominator truthfully represents Goal completion.

Examples:

```text
37 miles / 100 miles
```

possibly valid.

```text
8 completed study sessions / 20 planned study sessions
```

may measure plan execution, not certification Progress.

---

# 42. Progress Units

Measurement policy may need explicit units.

Examples:

* count;
* miles;
* words;
* pages;
* modules;
* percent external completion;
* another unit.

Do not build generic unit system unless needed.

---

# 43. Progress Value Model

Compare possible V1 outputs:

### Percentage

```text
37%
```

### Quantity

```text
37 of 100 miles
```

### Categorical

```text
Not started / In progress / Complete
```

### Milestones

```text
4 of 10 milestones
```

### No metric

```text
Progress not defined
```

Determine whether one universal result shape can support all without false equivalence.

---

# 44. Recommended Result Architecture

Potential:

```text
GoalProgressResult
    policy identity
    status
    valueKind:
        quantity
        percentage
        milestone
        categorical
        unavailable
    evidence
    coverage
```

But do not over-design if no V1 policy is ready.

---

# 45. Qualitative Goal Handling

Determine whether qualitative Goals should:

### A. show Goal Activity only

### B. show “Progress not defined”

### C. allow explicit user status updates

### D. future policy

Choose.

---

# 46. Progress Not Applicable vs Unavailable

Differentiate:

### Not defined / not applicable

Goal intentionally has no measurement policy.

### Unsupported

Policy reference exists but implementation unavailable.

### Unavailable

Required evidence is inaccessible/protected.

### Insufficient evidence

Policy exists but evidence coverage insufficient.

Do not collapse.

---

# 47. Measurement Policy Parameters

Audit whether policy-specific parameters belong:

### A. inside Goal authority

### B. in separate MeasurementDefinition authority

### C. encoded in policy ID/version

### D. another model

This is likely one of the key architecture decisions.

---

# 48. Goal Authority Extension

If policy parameters are needed, determine minimum change.

Conceptual possibility:

```text
measurement:
    policyRef
    config
```

But do not implement.

Assess implications for:

* Goal validation;
* revision;
* Backup;
* restore;
* HistoricalPlan provenance;
* Summary;
* Planner UI.

---

# 49. Historical Measurement Context

Current HistoricalPlan freezes measurement-policy ref, but not arbitrary policy config.

If Goal measurement configuration changes later, old evidence may need old config for reproducibility.

This may require freezing config or a semantic fingerprint.

Audit.

---

# 50. Measurement Policy Change

If user changes:

```text
Goal measurement
```

from Policy A to Policy B:

how should historical Progress behave?

Possible:

### A. current policy reinterprets all old evidence

Risky.

### B. evidence segmented by frozen historical policy

Safer.

### C. new Progress epoch begins

Potentially clean.

Determine.

---

# 51. Measurement Epoch

Consider introducing conceptual:

```text
Measurement Epoch
```

when policy/config changes.

This could prevent reinterpretation.

Do not implement unless architecture recommends it.

---

# 52. Goal Revision vs Measurement Revision

Goal revision exists but is not a full history ledger.

Can Progress use Goal revision boundaries?

HistoricalPlan freezes revision, but current Goal authority cannot reconstruct full old Goal config.

Assess whether this is sufficient.

---

# 53. Policy Fingerprint

Possible future:

```text
measurementDefinitionFingerprint
```

frozen into HistoricalPlan.

Determine whether needed.

---

# 54. Target Date

Does target date belong to Progress calculation?

Possible:

### Context only

### Evaluation horizon

### Future recommendation input

### Pace calculation

For V1, default toward context only unless specific policy defines time-sensitive semantics.

---

# 55. Pace

Do not introduce:

```text
on track
ahead
behind
```

without explicit time-aware measurement policy.

Likely defer.

---

# 56. Target Date Passed

No automatic failure.

---

# 57. Completed Goal

If user marks Goal completed:

possible Progress display:

* lifecycle status remains completed;
* derived Progress may still be unavailable or policy-specific.

Do not force 100%.

---

# 58. Reactivated Goal

If Goal returns active after completion:

does previous Progress continue?

Without lifecycle history, policy must not assume a new epoch unless explicit measurement revision exists.

Audit.

---

# 59. Archived Goal

Progress may remain inspectable.

Archive does not erase evidence.

---

# 60. Lifecycle History

Reassess whether measurable Progress requires lifecycle intervals.

Potentially no if Progress evaluates current measurement definition over evidence window.

But if policy should reset at reactivation, lifecycle history becomes necessary.

Decide.

---

# 61. Progress Evaluation Window

Potential inputs:

```text
goalId
date range
evaluationAsOf
measurement policy
```

or default to:

```text
Goal createdAt → evaluationAsOf
```

Determine.

---

# 62. User-Selected Range vs Goal Lifetime

Should Progress be:

### lifetime metric

or:

### range-specific metric

Goal Activity is range-specific.

Progress might be Goal-lifetime by default.

Audit product meaning.

---

# 63. Progress Snapshot vs Historical Query

Potential:

```text
current progress as of cutoff
```

rather than arbitrary range distribution.

Determine whether Progress should be queryable historically.

---

# 64. evaluationAsOf

Likely mandatory for reproducibility.

But current Goal authority is not historical as-of.

This creates a limitation.

Define what `evaluationAsOf` can truthfully mean.

---

# 65. Current Goal Definition + Historical Evidence

Possible V1 model:

> Evaluate current Goal measurement semantics using effective historical evidence up to cutoff.

This is reproducible only if current Goal remains unchanged.

If Goal changes later, old result cannot be reconstructed unless config is frozen elsewhere.

Assess.

---

# 66. Progress Reproducibility Requirement

Determine whether V1 Progress must be reproducible after Goal edits.

Strong preference: yes.

If yes, architecture must freeze enough measurement semantics.

---

# 67. Progress Persistence Alternative

Could persist derived Progress snapshots to preserve history.

Likely undesirable.

Prefer freezing policy/config authority, not derived result.

Evaluate.

---

# 68. HistoricalPlan as Measurement Context

Could HistoricalPlan freeze measurement definition with each Goal-linked occurrence.

This supports historical evidence interpretation but may not define Goal-level target denominator.

Audit.

---

# 69. Separate Measurement Authority

Consider:

```text
GoalMeasurementDefinition
```

as independent durable authored authority/revisioned object.

This may be too much for V1.

Compare against Goal-embedded config.

---

# 70. Measurement Definition Identity

If config exists, does it need:

* stable ID;
* revision;
* effectiveFrom;
* policy ref;
* parameters?

Do not overbuild prematurely.

---

# 71. Minimal Progress V1 Slice

Determine the smallest real Progress feature worth implementing.

Possible:

### A. No numeric Progress yet

Architecture only; continue Goal Activity.

### B. Explicit quantity target policy

User sets target and manually reports quantity.

### C. Completed-occurrence count policy

User explicitly says N linked completed occurrences = target.

### D. Milestone policy

Requires milestone substrate.

### E. Binary lifecycle reflection

Likely too trivial.

Choose only if semantically honest and useful.

---

# 72. Manual Quantity Updates

Potentially powerful minimal model:

```text
Goal: Write 50,000 words

User update:
    12,400 words

Progress:
    12,400 / 50,000
```

This requires a new durable GoalProgressEvidence authority or update ledger.

Assess whether this is actually simpler and more truthful than inferring from Goal Activity.

---

# 73. User-Reported Progress Evidence

Define possible concept:

```text
GoalProgressObservation
```

User-authored, timestamped, policy-specific.

This would separate:

* Goal intent;
* historical activity;
* actual outcome quantity.

Consider architecture implications.

---

# 74. Observation vs Authority

A progress observation may be:

* durable evidence;
* append-only/revisioned;
* separate from derived Progress.

Compare with ExecutionHistory patterns.

---

# 75. Progress from External Outcome vs Activity

This is a key distinction.

For many Goals:

```text
supporting activity
≠
goal-state change
```

Example:

```text
Study session completed
≠
Security+ certification earned
```

Therefore Goal Activity should not become a proxy measurement policy unless explicitly authored.

Adopt as invariant.

---

# 76. Goal Types

Determine whether DayFrame needs explicit Goal types:

* outcome;
* quantity;
* milestone;
* maintenance;
* habit/consistency.

Avoid type explosion.

Maybe measurement policy itself provides type semantics.

---

# 77. Goal Type vs Measurement Policy

Prefer:

```text
Goal remains generic
Measurement policy defines measurable interpretation
```

unless audit finds lifecycle/UI needs explicit Goal type.

Assess.

---

# 78. Habit/Consistency Goals

A Goal like:

```text
Exercise 3 times/week
```

may be better modeled as:

* Commitment expectation;
* Progress policy;
* Goal Activity trend.

Do not assume it fits Goal Progress.

---

# 79. Maintenance Goals

Examples:

```text
Maintain sleep routine
Keep family evenings protected
```

These may never be “complete.”

Progress may be inappropriate.

---

# 80. Outcome Goals

Examples:

```text
Earn Security+
Ship DayFrame v1
Finish degree
```

Often completion is a discrete external state.

Supporting activity may be informative but not progress percentage.

---

# 81. Quantity Goals

Examples:

```text
Write 50,000 words
Walk 100 miles
Save $10,000
```

These can support truthful numeric Progress if actual quantities are observed.

Current architecture may not provide those observations.

---

# 82. Milestone Goals

Require discrete authored milestones.

Not currently supported.

---

# 83. Progress Evidence Taxonomy

Propose a taxonomy:

```text
Activity Evidence
    HistoricalPlan + ExecutionHistory

Outcome Evidence
    explicit Goal progress observations / milestone completion

Lifecycle Evidence
    Goal status

External Evidence
    future integrations
```

Determine whether this should become canonical.

---

# 84. Goal Activity Role

Goal Activity should remain:

> supporting evidence

not denominator/numerator by default.

---

# 85. Progress Coverage

If Progress uses outcome observations, coverage semantics may differ from Goal Activity.

Do not automatically reuse plan/reporting coverage.

Define possible:

* observation freshness;
* measurement completeness;
* supported/unsupported policy.

---

# 86. Progress Provenance

Every Progress result must explain:

* measurement policy;
* target/config;
* evidence observations;
* evaluation cutoff;
* missing/unsupported evidence.

Candidate invariant.

---

# 87. Progress UI Explainability

Future Summary should be able to answer:

> Why is this 37%?

with actual numerator/denominator provenance.

If not, percentage is not acceptable.

---

# 88. Progress Authority

Reaffirm likely:

```text
Progress
    derived
    non-authoritative
    non-persisted
```

unless audit finds unavoidable reason otherwise.

---

# 89. Measurement Definition Authority

If user-authored target/config is needed, that config itself **is authority**.

Determine whether it belongs inside Goal or separate.

---

# 90. Progress Observation Authority

If user reports actual progress quantity/milestone, that evidence may require durable authority.

Classify.

---

# 91. Backup Consequences

For any proposed new durable measurement definition or observation authority, identify:

* Backup version consequence;
* restore;
* full clear;
* runtime transaction;
* historical provenance.

Do not implement.

---

# 92. HistoricalPlan Consequences

Determine whether future plan publications need measurement-definition context.

Maybe only Goal Activity provenance is required, while Progress observations carry their own policy identity.

Compare.

---

# 93. ExecutionHistory Consequences

Should ExecutionHistory be extended to carry generic Goal progress quantities?

Likely no.

ExecutionHistory should remain occurrence outcome evidence.

Avoid overloading it.

---

# 94. New Progress Evidence Authority

If needed, consider a separate:

```text
GoalProgressHistory
```

or:

```text
GoalMeasurementHistory
```

Do not name prematurely.

Evaluate necessity.

---

# 95. Policy Change and Old Observations

If measurement policy changes:

old observations may no longer be compatible.

Need:

* policy identity/version on each observation;
* segmentation;
* no silent reinterpretation.

Adopt if observation model recommended.

---

# 96. Progress Reset

Do not add implicit reset.

A policy/config change may begin a new measurement epoch only through explicit semantics.

---

# 97. Summary Role

Future Summary likely owns read-only Progress presentation.

Determine whether:

```text
Goal Activity
Progress
```

should be separate sections or nested.

Avoid replacing Goal Activity.

---

# 98. Planner Role

Planner should author:

* measurement definition/config;
* possibly progress observations if user-entered?

But user-entered outcome updates might belong elsewhere.

Assess.

---

# 99. Reporting Surface

Could Goal progress observation entry belong to existing reporting workflow?

Maybe:

```text
Report completed work
```

is occurrence-level.

Goal outcome quantity may be separate.

Do not merge without evidence.

---

# 100. Goal Edit UI

If measurement config belongs to Goal authority, Planner Goal edit becomes the write surface.

Likely future.

---

# 101. Progress Observation UI

If observations are needed, determine future surface:

* Planner Goal detail;
* Summary read-only handoff;
* separate Report Progress action;
* another bounded flow.

Audit conceptually.

---

# 102. Summary Read-Only Preservation

Summary should not directly author measurement config or observations if current surface boundary is preserved.

Any write handoff should route to Planner or a dedicated operational flow.

---

# 103. Goal Completion Suggestion

Do not introduce suggestion yet.

Progress reaching target may eventually support:

> Mark Goal complete?

but that is Recommendation/adaptation territory.

Defer.

---

# 104. Progress Status Labels

Do not introduce:

* on track;
* at risk;
* behind;
* ahead.

Those require pace/recommendation semantics.

---

# 105. Qualitative Progress Labels

Avoid generic:

* making progress;
* little progress;
* good progress.

These are judgmental without explicit policy.

---

# 106. Progress Trend

Defer.

---

# 107. Comparison

Defer.

---

# 108. Goal Activity + Progress Relationship

Potential future Summary:

```text
Goal
    Progress
        12,400 / 50,000 words
    Activity
        supporting historical work
```

This makes the distinction clear.

Assess.

---

# 109. Progress with No Activity

Possible:

```text
Progress observation exists
Goal Activity none
```

This must be valid.

For example, external outcome may change without DayFrame-tracked supporting work.

---

# 110. Activity with No Progress Observation

Also valid.

---

# 111. Progress Observation Without Linked Commitments

Valid for quantity/outcome Goals.

Do not require Goal links.

---

# 112. Goal Without Measurement

Valid.

Activity only.

---

# 113. Progress Cold Start

If policy exists but no observations:

do not show 0 unless zero is an explicit observed baseline.

Possible:

> No measurement recorded yet.

---

# 114. Baseline

Some policies need baseline.

Example:

```text
Save $10,000
current savings baseline = $4,000
```

Progress could mean incremental vs absolute.

This demonstrates need for policy config.

Audit.

---

# 115. Directionality

Some goals seek increase:

```text
write 50,000 words
```

Some decrease:

```text
reduce debt to $0
```

Some reach target:

```text
weight target
```

Do not build generic percentage without direction semantics.

---

# 116. Bounds

Progress may exceed target.

Example:

```text
110 / 100 miles
```

Do not automatically clamp to 100% unless policy defines it.

---

# 117. Negative Values

Some quantity policies may permit them.

Do not define generic numeric semantics prematurely.

---

# 118. Units

If policy uses units, exact unit identity matters.

Avoid free-text units for arithmetic unless governed.

---

# 119. Currency

Likely future specialized policy.

Defer.

---

# 120. Time

Actual-duration policy may need duration unit and evidence source.

Current evidence limitations likely defer.

---

# 121. Progress Precision

Policy should govern rounding/display.

Not core architecture yet.

---

# 122. Measurement Policy Registry Alternatives

Compare:

### A. Hardcoded built-in policies

### B. Generic formula DSL

### C. User-authored expressions

### D. Plugin policies

For V1, likely A.

Explicitly reject overengineering unless evidence demands otherwise.

---

# 123. First Built-In Policy Candidate

If implementation is ready, choose exactly one first policy.

Potential candidates:

### Manual quantity target

### Manual milestone count

### Completed linked occurrence count

### Goal lifecycle binary

Evaluate usefulness and semantic honesty.

---

# 124. Manual Quantity Target Candidate

Potential architecture:

```text
Goal measurement config
    policy: manualQuantityTarget@1
    targetValue
    unit

Progress observations
    timestamp
    value
    policy identity

Progress
    latest effective observation / target
```

This is simple conceptually but requires new durable evidence.

Assess.

---

# 125. Manual Milestone Count Candidate

Requires milestone definitions or just numeric count?

If just count:

```text
completedMilestones / targetMilestones
```

but without identities this may be fragile.

Likely not first.

---

# 126. Completed Linked Occurrence Count Candidate

Potential:

```text
targetCount
completed linked scheduled occurrences
```

But risks equating activity completion with Goal outcome.

Only valid if user explicitly chooses that semantics.

Could be useful for Goals like:

```text
Complete 20 practice labs
```

Assess.

---

# 127. Lifecycle Binary Candidate

Probably too redundant.

---

# 128. Recommended First Policy

Choose one or explicitly recommend:

> No Progress implementation yet; measurement authority prerequisite required first.

This is a valid audit result.

---

# 129. Measurement Architecture Alternatives Matrix

Compare:

| Criterion                  | Goal-embedded config | Separate measurement authority | Policy ref only | Observation-only |
| -------------------------- | -------------------- | ------------------------------ | --------------- | ---------------- |
| authored semantics         |                      |                                |                 |                  |
| historical reproducibility |                      |                                |                 |                  |
| Goal schema impact         |                      |                                |                 |                  |
| Backup impact              |                      |                                |                 |                  |
| policy changes             |                      |                                |                 |                  |
| complexity                 |                      |                                |                 |                  |
| recommendation             |                      |                                |                 |                  |

---

# 130. Progress Evidence Alternatives Matrix

Compare:

| Criterion                 | Goal Activity-derived | user observations | milestones | external data |
| ------------------------- | --------------------- | ----------------- | ---------- | ------------- |
| truthful outcome signal   |                       |                   |            |               |
| current readiness         |                       |                   |            |               |
| quantity support          |                       |                   |            |               |
| automation                |                       |                   |            |               |
| implementation complexity |                       |                   |            |               |
| recommendation            |                       |                   |            |               |

---

# 131. Progress Model Alternatives Matrix

Compare:

| Criterion            | universal percentage | policy-specific numeric | categorical | no Progress without policy |
| -------------------- | -------------------- | ----------------------- | ----------- | -------------------------- |
| semantic honesty     |                      |                         |             |                            |
| qualitative Goals    |                      |                         |             |                            |
| explainability       |                      |                         |             |                            |
| current architecture |                      |                         |             |                            |
| extensibility        |                      |                         |             |                            |
| recommendation       |                      |                         |             |                            |

---

# 132. Goal-Type Alternatives Matrix

Compare:

| Criterion      | explicit Goal type | policy-derived type | no type |
| -------------- | ------------------ | ------------------- | ------- |
| simplicity     |                    |                     |         |
| UX clarity     |                    |                     |         |
| extensibility  |                    |                     |         |
| schema burden  |                    |                     |         |
| recommendation |                    |                     |         |

---

# 133. Lifecycle Matrix

Produce:

| Goal lifecycle | Progress query allowed? | Interpretation |
| -------------- | ----------------------: | -------------- |
| active         |                         |                |
| completed      |                         |                |
| archived       |                         |                |
| reactivated    |                         |                |

---

# 134. Measurement-State Matrix

Produce:

| Goal measurement state       | Progress behavior |
| ---------------------------- | ----------------- |
| no policy                    |                   |
| supported policy             |                   |
| unsupported policy           |                   |
| policy with no evidence      |                   |
| policy with partial evidence |                   |
| protected evidence           |                   |

---

# 135. Evidence Matrix

Produce:

| Evidence                 | May contribute to Progress? | Under what policy? |
| ------------------------ | --------------------------: | ------------------ |
| Goal lifecycle           |                             |                    |
| Goal Activity scheduled  |                             |                    |
| Goal Activity completed  |                             |                    |
| Goal Activity partial    |                             |                    |
| Goal Activity skipped    |                             |                    |
| user numeric observation |                             |                    |
| milestone completion     |                             |                    |
| external observation     |                             |                    |

---

# 136. Percentage Matrix

Produce:

| Numerator / denominator                     | Valid Progress percentage? | Why |
| ------------------------------------------- | -------------------------: | --- |
| completed study sessions / planned sessions |                            |     |
| miles walked / target miles                 |                            |     |
| words written / target words                |                            |     |
| completed milestones / authored milestones  |                            |     |
| days elapsed / target date                  |                            |     |
| Goal status complete / lifecycle            |                            |     |

---

# 137. Historical Reproducibility Matrix

Produce:

| Change                 | Old Progress reproducible? | Required provenance |
| ---------------------- | -------------------------: | ------------------- |
| Goal rename            |                            |                     |
| policy version change  |                            |                     |
| target quantity change |                            |                     |
| unit change            |                            |                     |
| observation correction |                            |                     |
| Goal lifecycle change  |                            |                     |

---

# 138. Authority Matrix

Produce:

| Concept                       | Authority? | Durable? | Owner |
| ----------------------------- | ---------: | -------: | ----- |
| Goal measurement config       |            |          |       |
| Progress observation          |            |          |       |
| Goal Activity                 |            |          |       |
| Progress result               |            |          |       |
| measurement policy definition |            |          |       |

---

# 139. Backup Matrix

Produce:

| Proposed concept        | Backup impact |
| ----------------------- | ------------- |
| policy registry         |               |
| Goal measurement config |               |
| progress observations   |               |
| derived Progress        |               |

---

# 140. Product Responsibility Matrix

Produce:

| Capability                  | Planner | Summary | Other operational surface |
| --------------------------- | ------: | ------: | ------------------------: |
| configure measurement       |         |         |                           |
| record progress observation |         |         |                           |
| view Progress               |         |         |                           |
| inspect evidence            |         |         |                           |
| edit Goal                   |         |         |                           |

---

# 141. Epistemic Matrix

Produce:

| Evidence                   | DayFrame may say | Must not say |
| -------------------------- | ---------------- | ------------ |
| 8 completed study sessions |                  |              |
| 37/100 miles observed      |                  |              |
| no observation             |                  |              |
| Goal completed             |                  |              |
| target date passed         |                  |              |
| partial occurrence         |                  |              |
| skipped occurrence         |                  |              |
| unsupported policy         |                  |              |

---

# 142. Progress Invariants

Recommend a canonical invariant set.

At minimum assess:

1. Progress is derived.
2. Progress is policy-versioned.
3. Progress is not Goal authority.
4. Progress is not Goal Activity.
5. Goal Activity is not a default Progress numerator.
6. qualitative Goals remain valid without Progress.
7. no measurement policy means no numeric Progress.
8. unsupported policy does not become zero.
9. a percentage requires same-unit numerator/denominator.
10. target date is not denominator.
11. time elapsed is not Progress.
12. completed linked activity does not automatically equal Goal advancement.
13. partial has no generic weight.
14. skipped does not reduce Progress generically.
15. not reported is not zero.
16. lifecycle completion does not force 100%.
17. 100% does not force lifecycle completion.
18. policy changes must not silently reinterpret old evidence.
19. target/config changes require historical provenance or epoching.
20. Progress should be reproducible.
21. derived Progress should not be backed up.
22. measurement config, if authored, must be backed up.
23. progress observations, if authoritative evidence, must be backed up.
24. ExecutionHistory should remain occurrence evidence.
25. Goal Activity remains descriptive supporting evidence.
26. outcome evidence may exist without Goal Activity.
27. Goal Activity may exist without Progress.
28. Goal may exist without measurement.
29. completed/archived Goals remain queryable.
30. target date is context unless policy explicitly uses it.
31. no pace/on-track semantics in V1.
32. no universal Goal score.
33. no cross-Goal comparison.
34. no recommendation derived in this task.
35. no automatic lifecycle mutation.
36. Summary remains read-only.
37. Planner remains authored Goal/config surface.
38. user priority remains sovereign.
39. policy must explain every numeric result.
40. no hidden weighting.
41. no hidden unit conversion.
42. no hidden baseline.
43. no hidden reset.
44. no machine learning required.

Classify:

* Adopt
* Modify
* Reject
* Defer
* Requires decision

---

# 143. Stop Conditions

Stop and recommend a prerequisite if:

* current Goal schema cannot represent any truthful measurement policy;
* policy-specific config is required but has no durable home;
* useful Progress requires new observation evidence authority;
* current HistoricalPlan provenance cannot preserve measurement semantics;
* current Goal revision model cannot support reproducibility without additional authority;
* Progress would require interpreting Goal Activity as outcome evidence by default;
* percentage is only possible through arbitrary weighting;
* qualitative Goals would need fake numeric conversion;
* target date must be used as denominator;
* Progress must persist derived results to remain reproducible;
* Summary would need writes;
* implementation would require Recommendations or adaptation.

Do not force implementation readiness.

---

# 144. Implementation Readiness Determination

Choose exactly one:

### A. Progress V1 ready for implementation

### B. Progress V1 ready after bounded measurement-config extension

### C. Progress V1 requires new measurement-observation authority

### D. Only one specific policy is ready

### E. Progress should remain deferred

Explain precisely.

---

# 145. Minimum Useful Progress Slice

Choose one.

Possible:

### Manual Quantity Progress V1

### Activity-Count Policy V1

### Milestone Progress V1

### No Progress yet; measurement substrate first

Do not select multiple.

---

# 146. Recommended Task 5.11

Choose exactly one next task.

Potential examples:

> **Task 5.11 — Measurement Definition V1 Architecture and Durable Authority**

or:

> **Task 5.11 — Manual Quantity Progress V1 Architecture**

or:

> **Task 5.11 — Implement Measurement Policy V1 Substrate**

or another bounded prerequisite.

Do not bundle Progress UI, Recommendations, and measurement authority together.

---

# 147. Recommended Phase 5 Sequence

Derive from findings.

Possible:

```text
5.11 measurement substrate
5.12 Progress projection
5.13 Summary Progress integration
5.14 Recommendation architecture
```

but only if justified.

---

# 148. Governance

On completion update minimally:

* Task 5.10 result;
* Phase 5 checkpoint;
* `CURRENT_STATE.md`;
* `ROADMAP.md`;
* `DECISIONS.md` if enduring Progress decisions are accepted;
* `CHANGELOG.md`.

Do not mark Progress implemented.

---

# 149. ADR Determination

Determine whether an ADR is warranted for:

* measurement-policy architecture;
* Progress evidence authority;
* Progress non-authority/reproducibility.

Avoid ADR proliferation.

---

# 150. Validation

Task 5.10 is audit-only.

No production/test code changes are authorized.

Run at minimum:

```bash
git diff --check
```

If governance files change, validate formatting.

Do not claim full tests unless actually run.

---

# 151. Required Result Artifact

Create:

`docs/implementation/phase-5/TASK_5.10_PROGRESS_V1_AND_MEASUREMENT_POLICY_ARCHITECTURE_AUDIT_RESULT.md`

Include at least:

1. Executive Determination
2. Artifact Integrity
3. Audit Scope
4. Sources Reviewed
5. Goal Contract Reconstruction
6. Goal Activity Reconstruction
7. Progress Definition
8. Goal Activity vs Progress
9. Progress Eligibility
10. No-Policy Goal
11. Unknown Policy
12. Measurement-Policy Definition
13. Policy Identity
14. Progress Policy vs Measurement Policy
15. Policy Registry
16. User-Authored Measurement Configuration
17. Goal Schema Sufficiency
18. Policy Classes
19. Binary Completion Policy
20. Quantity Policy
21. Count Policy
22. Activity-Based Policy
23. Time-Based Policy
24. Milestone Policy
25. User-Reported Numeric Progress
26. Progress Evidence Sources
27. Goal Activity as Evidence
28. Execution Outcomes as Evidence
29. Partial/Unknown/Skipped Semantics
30. Progress Denominator
31. Percentage Validity
32. Units
33. Progress Value Model
34. Qualitative Goals
35. Progress Availability States
36. Measurement Policy Parameters
37. Goal Authority Extension
38. Historical Measurement Context
39. Policy Changes
40. Measurement Epoch
41. Goal Revision Sufficiency
42. Policy Fingerprint
43. Target Date
44. Pace Boundary
45. Lifecycle/Completion
46. Reactivation
47. Progress Evaluation Window
48. Lifetime vs Range
49. evaluationAsOf
50. Reproducibility
51. Persistence Alternative
52. HistoricalPlan Measurement Context
53. Separate Measurement Authority
54. Measurement Definition Identity
55. Minimum Progress Slice
56. Manual Quantity Updates
57. Progress Observation Evidence
58. Activity vs Outcome Evidence
59. Goal Types
60. Goal Type vs Policy
61. Maintenance/Habit/Outcome/Quantity/Milestone Goals
62. Progress Evidence Taxonomy
63. Progress Coverage
64. Progress Provenance
65. Authority Determination
66. Measurement Definition Authority
67. Observation Authority
68. Backup Consequences
69. HistoricalPlan Consequences
70. ExecutionHistory Consequences
71. Summary Responsibility
72. Planner Responsibility
73. Operational Reporting Responsibility
74. Goal Completion Suggestion Boundary
75. Status/Trend/Comparison Boundaries
76. Goal Activity + Progress Relationship
77. Cold Start/Baseline
78. Directionality
79. Bounds
80. Units/Precision
81. Policy Registry Alternatives
82. First Built-In Policy Candidate
83. Measurement Architecture Alternatives Matrix
84. Progress Evidence Alternatives Matrix
85. Progress Model Alternatives Matrix
86. Goal-Type Alternatives Matrix
87. Lifecycle Matrix
88. Measurement-State Matrix
89. Evidence Matrix
90. Percentage Matrix
91. Historical Reproducibility Matrix
92. Authority Matrix
93. Backup Matrix
94. Product Responsibility Matrix
95. Epistemic Matrix
96. Progress Invariant Assessment
97. Stop-Condition Assessment
98. Implementation Readiness
99. Minimum Useful Progress Slice
100. Recommended Task 5.11
101. Recommended Phase 5 Sequence
102. Governance Updates
103. ADR Determination
104. Validation
105. Final Audit Statement

---

# 152. Completion Criteria

Task 5.10 is complete only when:

* Progress is defined independently from Goal Activity;
* eligibility for Progress is explicit;
* qualitative Goals remain valid without numeric Progress;
* no-policy and unsupported-policy states are explicit;
* measurement-policy responsibilities are defined;
* Progress-policy versus measurement-policy layering is decided;
* policy identity/versioning is explicit;
* current Goal schema is judged sufficient or insufficient;
* policy-specific configuration requirements are identified;
* binary, quantity, count, activity-based, time-based, milestone, maintenance, outcome, and qualitative Goal cases are evaluated;
* Goal Activity is explicitly rejected as a universal Progress numerator;
* execution outcomes receive no generic numeric weighting;
* partial receives no arbitrary weight;
* skipped/not-reported/unknown semantics remain governed;
* a valid Progress denominator is explicitly constrained;
* percentage validity rules are explicit;
* unit requirements are understood;
* Progress output model alternatives are compared;
* target-date semantics remain bounded;
* lifecycle completion is kept separate from Progress;
* reactivation/lifecycle-history implications are addressed;
* evaluation window and cutoff semantics are defined;
* reproducibility after Goal/policy/config changes is addressed;
* measurement-policy change semantics are explicit;
* need for measurement epochs/fingerprints is decided;
* derived Progress persistence is explicitly accepted or rejected;
* need for separate measurement definition authority is assessed;
* need for progress observation evidence authority is assessed;
* manual quantity progress is evaluated;
* activity evidence versus outcome evidence is made explicit;
* Goal type versus policy semantics is decided;
* Progress coverage/provenance requirements are defined;
* Summary/Planner/write-surface responsibilities are explicit;
* Backup/restore/full-clear consequences are identified for any proposed durable concept;
* ExecutionHistory is not overloaded without explicit justification;
* one implementation-readiness determination is chosen;
* exactly one minimum useful Progress slice is selected or Progress is explicitly deferred;
* exactly one Task 5.11 is recommended;
* all required matrices are completed;
* no production code, Progress type, measurement authority, UI, schema, persistence, Recommendation, adaptation, Capacity model, trend, score, pace, “on track,” or unrelated feature is introduced;
* no unresolved stop condition remains.

---

# 153. Final Audit Principle

> **DayFrame should only measure Progress when the Goal itself tells DayFrame what meaningful movement looks like. Supporting activity alone is not enough.**

---

# 154. Final Completion Statement

**Task 5.10 is complete when DayFrame has one explicit architecture for distinguishing Goal Activity from actual Progress; when measurable Progress is constrained to Goals whose authored measurement semantics and versioned policy define a truthful unit, numerator, denominator, evidence source, baseline, direction, and interpretation; when qualitative, maintenance, outcome, activity-based, quantity, count, milestone, and binary Goals have been evaluated without forcing them into one numeric model; when Goal Activity and ExecutionHistory are recognized as supporting/activity evidence rather than universal Goal-outcome evidence; when partial, skipped, unknown, not-reported, blocked, omitted, and unplaced states receive no arbitrary numeric weight or success/failure interpretation; when target dates remain context unless an explicit policy uses them and no pace, overdue, “on track,” or failure semantics are introduced; when Goal lifecycle completion remains authored authority rather than an automatic Progress percentage and Progress reaching a target does not silently mutate Goal lifecycle; when policy identity, versioning, configuration, historical reproducibility, policy changes, measurement epochs, evidence provenance, evaluation cutoff, coverage, cold start, baseline, directionality, bounds, units, and explainability have explicit architectural treatment; when current Goal schema sufficiency is decided; when the need for durable measurement definition and/or Goal progress observation authority is decided; when Backup/restore/full-clear consequences for any such authority are understood; when ExecutionHistory remains occurrence-outcome evidence rather than a generic Goal-measurement store unless architecture explicitly overturns that boundary; when Summary remains read-only, Planner remains the authored Goal/configuration surface, and any future progress-observation write path is explicitly located; when one Progress implementation-readiness determination and one minimum useful Progress slice are selected; when exactly one bounded Task 5.11 is recommended; and when no Progress implementation, percentage, Goal score, measurement authority, schema change, recommendation, adaptive mutation, Capacity inference, trend, comparison, pace, machine-learning behavior, or unsupported interpretation has been introduced during the audit.**
