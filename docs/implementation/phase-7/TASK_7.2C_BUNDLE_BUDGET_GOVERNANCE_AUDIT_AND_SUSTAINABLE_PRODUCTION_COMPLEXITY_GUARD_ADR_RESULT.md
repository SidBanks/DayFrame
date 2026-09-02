# Task 7.2C — Bundle Budget Governance Audit and Sustainable Production Complexity Guard ADR Result

## 1. Executive Result

**Complete — Outcome E, hybrid policy.** Startup raw/gzip and largest-lazy limits
remain hard and unchanged. Total emitted JavaScript remains fully counted and reported
but is now advisory, with 800,000-byte growth-review and 825,000-byte architecture-
review milestones. This reflects the verified risk model rather than making an
informal exception for Task 7.3.

## 2. Artifact Integrity

The supplied artifact was copied unchanged to the Phase 7 implementation directory.
SHA-256: `768999271d3e1aeba5841aa178d2a652324e95482bba651a5ceaed8bd822e4de`.

## 3. Task 7.2A Prerequisite

Governing: no safe local dead-code, deduplication, or lazy-boundary remediation could
recover meaningful total headroom.

## 4. Task 7.2B Prerequisite

Governing: source maps showed one owner per production module, clean surface chunks,
singular authority, and intended compatibility. Moving code would not reduce an all-
chunks total and could weaken synchronous/atomic contracts.

## 5. Baseline Reproduction

The pre-policy build reproduced 116 modules and the exact baseline: 630,499 initial
raw, 160,954 initial gzip, 51,479 largest lazy, and 749,882 total bytes.

## 6. Guard Implementation

`scripts/check-bundle.mjs` reads `dist/.vite/manifest.json`, finds the Vite entry,
recursively includes its static imports, counts raw filesystem bytes, gzips each
initial file in memory, classifies all non-initial manifest JavaScript as lazy, and
sums all manifest JavaScript for total. It reports JSON and previously failed when
any value exceeded its limit. Policy evaluation is now isolated in
`scripts/bundle-policy.mjs`; missing entry/build behavior remains unchanged.

## 7. Current Guard Matrix

| Metric       | Previous threshold | Baseline | Headroom | Intended failure meaning                                                  |
| ------------ | -----------------: | -------: | -------: | ------------------------------------------------------------------------- |
| Initial raw  |       685,000 hard |  630,499 |   54,501 | Eager parse/compile or import regression                                  |
| Initial gzip |       170,000 hard |  160,954 |    9,046 | Startup transfer regression                                               |
| Largest lazy |       100,000 hard |   51,479 |   48,521 | Oversized contextual load/feature conglomeration                          |
| Total JS     |       750,000 hard |  749,882 |      118 | Originally all-chunk growth/redistribution; now an accidental feature cap |

## 8. Historical Intent

Confirmed: Task 5.19/its ADR introduced all four thresholds after a 704.36 kB gzip-
over-budget monolith, used total to prevent byte redistribution from masquerading as
reduction, and required review for more than 25 kB of initial growth. Inferred: limits
were calibrated to the then-current product/loading split. Not found: any declaration
that 750 kB was a permanent fixed-size product constraint or any forecast covering
the later Today, converged Planner, and Month surfaces.

## 9. Historical Bundle Checkpoints

Reliable published checkpoints are retained in the trend matrix in section 79.

## 10. Historical Growth Attribution

Product capability accounts for the documented checkpoint changes: Today, reporting,
Review, authoring, contextual workflows, identity completion, and Month. Compatibility
remained intentional and supported. React/vendor is separately visible. Tasks 7.2A/B
found no current accidental/regressive ownership. Exact byte attribution within the
entry is not recoverable from checkpoint totals and remains unknown.

## 11. Current Composition

| Component    |   Bytes | Approx. total |
| ------------ | ------: | ------------: |
| React vendor | 189,637 |         25.3% |
| Entry        | 436,920 |         58.3% |
| Lazy/shared  | 123,325 |         16.4% |
| Total        | 749,882 |          100% |

## 12. Initial Raw Risk

It protects against catastrophic eager imports and proxies parse/compile/startup memory
work. It is not transfer size. The unchanged 685,000 hard limit remains useful.

## 13. Initial Gzip Risk

It is the tighter and closest current proxy for transferred startup JavaScript. The
9,046-byte hard margin is intentional; Phase 7 additions should primarily stay lazy.
The limit is not loosened.

## 14. Largest Lazy Risk

The 100,000-byte limit protects contextual interaction latency and detects accidental
surface conglomeration. At 51,479 it has meaningful room and remains hard.

## 15. Total-JS Risk

Total reveals lifetime/cache footprint trend, dependency jumps, possible duplication,
and broad growth. It does not prove duplication, startup cost, or maintainability. At
the healthy audited graph, a fixed 750,000 hard stop now constrains intended product
scope more than a demonstrated runtime risk.

## 16. User Exposure

Users receive the entry closure initially. Lazy chunks are requested when their
surfaces/intent preload paths are exercised; a user who visits every surface may
eventually receive all chunks, while one who does not will not necessarily do so.

## 17. Cache Model

Vite emits content-hashed files that normal HTTP caches can retain and invalidate by
content identity. Total bytes remain relevant to a full traversal/cache fill but do
not equal repeated startup transfer.

## 18. Vendor Contribution

React/vendor remains inside startup hard guards and total reporting. A framework jump
must be investigated and governed; excluding vendor would hide code users execute.

## 19. Compatibility Contribution

Compatibility is supported product behavior, not bloat by default. A material new
compatibility family triggers review; retirement requires a separate evidence-based
data/product decision.

## 20. Feature Growth

DayFrame is still building primary surfaces. Correctly lazy capability may raise total
without harming startup. Legitimate growth is attributed and reported, not presumed
regressive.

## 21. Phase 7 Forecast

Contextual authoring, attention/configuration migration, and convergence cleanup imply
moderate, not precisely estimable growth, mainly in existing/new lazy surface code.
Eager core growth should remain small.

## 22. Future-Phase Consideration

Milestones and phase audits scale beyond one task; they avoid both per-task threshold
editing and unlimited silent accumulation.

## 23. Whole-Product Hard-Cap Assessment

**No.** Its benefit is simple catastrophic-growth detection, but Tasks 7.2A/B show
750,000 no longer distinguishes regression from intended correctly split capability.
The same risks are better governed by hard user-path limits plus total trend/review.

## 24. Advisory Total Assessment

**Yes.** Total remains deterministic, visible, historically comparable, and escalates
at 800,000 and 825,000 bytes.

## 25. Per-Task Growth Assessment

A checked-in moving total baseline would be brittle. Preserve explicit review for
more than 25 kB initial growth and require attribution of any unexplained material
jump; do not add an arbitrary automatic delta failure.

## 26. Relative Growth Assessment

Rejected for CI: no repository evidence supports a meaningful universal percentage,
and small/large baselines distort it. The approximately ten-percent total milestone
is a rounded architecture-review point, not a pass/fail regression formula.

## 27. Per-Surface Guard Assessment

Largest-lazy is sufficient today. Named budgets add maintenance without evidence of
a missed risk and encourage fragmentation.

## 28. Duplication Guard Assessment

Total can signal but cannot prove duplication. A source-map ownership audit at a
suspicious jump or architecture milestone is cheaper and more truthful than heavy
permanent tooling.

## 29. Dependency Guard Assessment

Every proposed runtime dependency requires explicit bundle-impact review. Current
runtime dependencies remain React, ReactDOM, and Scheduler.

## 30. Warning/Failure Semantics

Hard equality passes and one byte above fails. Warning/milestone equality warns.
Warnings require attribution; architecture-review warnings require the governed audit.

## 31. Headroom Principle

Meaningful headroom accommodates normal correctly bounded feature work while warning
well before user-path failures or silent broad accumulation. It is not permission to
consume the margin without explanation.

## 32. Budget-Setting Method

Hard limits remain tied to established user-path risk. Total milestones use the
749,882 known-good audit baseline plus rounded approximately 50 kB growth review and
75 kB/about-ten-percent architecture review.

## 33. Review Triggers

Warnings, milestones, unexplained jumps, >25 kB initial deltas, dependencies,
framework/toolchain jumps, compatibility expansion, primary surfaces, and phase
boundaries trigger the responses in section 78.

## 34. Warning Zone

Warnings begin at 650,000 raw, 161,500 gzip, and 80,000 largest lazy. These are
repository-visible constants and do not alter hard thresholds.

## 35. Architecture Audit Trigger

At 825,000 total, audit ownership/duplication and decide through ADR before revising
the milestone. No automatic ratchet exists.

## 36. Candidate Policy A

Existing four hard limits are simple and strongly constrain total, but leave 118
bytes, confuse product growth with regression, and block Phase 7 despite a healthy
graph. Rejected.

## 37. Candidate Policy B

A raised total hard cap restores room but merely postpones the same semantic mismatch;
no user-facing performance evidence derives a new hard number. Rejected.

## 38. Candidate Policy C

Three hard user-path metrics plus advisory total is sustainable, but needs explicit
milestones and review triggers to prevent silent accumulation. Accepted only as part
of the hybrid.

## 39. Candidate Policy D

Hybrid hard startup/lazy limits, advisory total milestones, dependency review, and
phase audits maps failures to risks and controls trend. Recommended.

## 40. Candidate Policy E

No more complex alternative is justified. Per-surface, delta, duplication, or
percentage CI machinery would add fragile policy without current evidence.

## 41. Policy Comparison Matrix

| Policy           | Startup protection | Lazy protection | Duplication signal | Total control         | Sustainable      | Gaming risk               | Recommendation |
| ---------------- | ------------------ | --------------- | ------------------ | --------------------- | ---------------- | ------------------------- | -------------- |
| A existing       | Strong             | Strong          | Strong/simple      | Hard                  | Poor             | High compression pressure | Reject         |
| B raised cap     | Strong             | Strong          | Strong/simple      | Hard later            | Temporary        | Medium                    | Reject         |
| C advisory       | Strong             | Strong          | Trend only         | Weak without triggers | Good             | Low                       | Fold into D    |
| D hybrid         | Strong             | Strong          | Trend + audit      | Milestones/reviews    | Good             | Low                       | Select         |
| E complex guards | Potentially strong | Strong          | More automation    | Complex               | Poor maintenance | High metric gaming        | Reject         |

## 42. Recommended Policy

Outcome E/hybrid as recorded in the ADR: three unchanged hard limits, three early
warnings, advisory total milestones, and explicit event/phase review.

## 43. ADR Determination

Required because total-JS failure behavior materially changes.

## 44. ADR Created/Superseded

Created `ADR_SUSTAINABLE_PRODUCTION_BUNDLE_BUDGET_GOVERNANCE.md`; explicitly
superseded only the prior ADR's fixed-total policy, preserving its loading decisions.

## 45. Guard Changes Authorized

Authorized only after the audit: policy extraction, warnings, advisory total, clearer
output, and boundary tests.

## 46. Guard Files Changed

`scripts/check-bundle.mjs`, `scripts/bundle-policy.mjs`, and its focused test.

## 47. Threshold Changes

No hard startup/lazy threshold changed. The 750,000 total hard threshold was removed;
800,000/825,000 advisory milestones replace its failure behavior.

## 48. Warning Changes

Added 650,000 raw, 161,500 gzip, and 80,000 largest-lazy headroom warnings.

## 49. Advisory Reporting Changes

Total remains in JSON and triggers deterministic growth/architecture review warnings.

## 50. Guard Test Changes

Tests cover healthy state, each exact hard boundary, above-hard failure, each exact
warning boundary, and advisory total behavior at/above both milestones.

## 51. Exact Threshold Semantics

`value > hard` fails; `value >= warning/milestone` warns.

## 52. CI Determinism

Constants are committed; evaluation depends only on manifest-referenced artifact
bytes. No local baseline is read.

## 53. Build-Tool Upgrade Policy

Investigate and record material Vite/Rolldown/React output changes. Govern any limit
change; do not delete unrelated features automatically.

## 54. Runtime Dependency Policy

Explicit bundle-impact assessment is mandatory before acceptance.

## 55. Compatibility Expansion Policy

Attribute and review material growth. Necessary compatibility may proceed through
governance; retirement is never implied by byte pressure.

## 56. Major Surface Policy

A new primary surface must report all metrics and justify eager/lazy ownership. Its
legitimate lazy bytes may grow total within review policy.

## 57. Task-Level Reporting

Continue recording initial raw, initial gzip, largest lazy, and total JS in every
implementation result.

## 58. Phase-Level Reporting

Perform detailed trend and ownership review at every phase boundary.

## 59. Historical Trend Policy

Total reporting is retained permanently unless a later ADR changes it.

## 60. Task 7.3 Headroom

Current room is 50,118 bytes to growth warning and 75,118 to architecture review.
Startup hard margins remain 54,501 raw and 9,046 gzip; Task 7.3 must keep eager impact
controlled. Task 7.3 no longer faces a meaningless 118-byte hard margin.

## 61. Phase 7 Headroom

The review milestones provide governed moderate phase room without a fake byte
forecast. Crossing them invokes review rather than an automatic increase.

## 62. Long-Term Sustainability

The model protects user paths while allowing deliberately reviewed mature-product and
compatibility growth. Milestones, dependency review, and phase audits constrain drift.

## 63. Performance Boundary

Byte limits are proxies, not performance guarantees. Material risks still require
browser/network/startup measurement.

## 64. Complexity Boundary

Emitted size is a coarse trend signal, not a complete maintainability metric.

## 65. Duplication Boundary

A total jump suggests investigation; source-map ownership establishes duplication.

## 66. Product Boundary

DayFrame has not adopted a fixed-size product philosophy. Capability or compatibility
retirement requires explicit product/architecture decisions.

## 67. Focused Validation

The focused policy suite passed: 1 file and 8 tests covering every changed boundary.
Lint, typecheck, build, and direct bundle-check validation also passed.

## 68. Full Validation

The full repository suite passed: 94 files and 968 tests. ESLint and TypeScript passed.
Vite 8.0.10 transformed 116 modules, the production build passed, and the bundle check
reported no failures or warnings.

## 69. Final Bundle

Production output is unchanged by guard-only code: 630,499 initial raw, 160,954 initial
gzip, 51,479 largest lazy, and 749,882 total bytes.

## 70. Final Guard Matrix

| Metric       |  Healthy |                                  Warning | Hard failure |         Current |
| ------------ | -------: | ---------------------------------------: | -----------: | --------------: |
| Initial raw  | <650,000 |                                >=650,000 |     >685,000 | 630,499 healthy |
| Initial gzip | <161,500 |                                >=161,500 |     >170,000 | 160,954 healthy |
| Largest lazy |  <80,000 |                                 >=80,000 |     >100,000 |  51,479 healthy |
| Total JS     | <800,000 | >=800,000 growth; >=825,000 architecture |          N/A | 749,882 healthy |

## 71. Governance Updates

ADR, prior-ADR supersession, Current State, Roadmap, Changelog, Phase 7 checkpoint,
immutable specification, and this result are published.

## 72. Deviations

None. No remediation, production behavior, dependency, build output, or Task 7.3 work
was introduced.

## 73. Discoveries

From Task 5.19 to now, total grew 43,483 bytes (about 6.2%) while initial raw fell
45,809 and gzip fell 7,244. This is direct evidence that total and startup risk have
diverged under successful surface splitting.

## 74. Deferred Work

Actual performance benchmarking and any future milestone revision remain separately
evidence-driven. Task 7.3 owns contextual authoring, not this task.

## 75. Policy Matrix

| Concern                             | Policy                                           |
| ----------------------------------- | ------------------------------------------------ |
| Startup                             | Hard raw/gzip + early warning                    |
| Contextual load                     | Hard largest-lazy + early warning                |
| Whole product                       | Always report; milestone reviews                 |
| Dependencies/compatibility/surfaces | Explicit impact review                           |
| Unexplained growth                  | Investigate and block acceptance until explained |
| Phase growth                        | Trend/ownership audit at boundary                |

## 76. Risk-to-Metric Matrix

| Risk                         |     Initial raw |    Initial gzip |      Largest lazy |         Total JS | Other policy     |
| ---------------------------- | --------------: | --------------: | ----------------: | ---------------: | ---------------- |
| Startup transfer             |        Indirect |    Strong proxy |                No | Partial lifetime | Performance test |
| Startup parse/compile        |    Strong proxy |        Indirect |                No |             Weak | Performance test |
| Accidental eager import      |          Strong |          Strong |         May shift |           Signal | Import audit     |
| Oversized contextual surface |              No |              No |            Strong |           Signal | Ownership audit  |
| Duplicate dependency/module  |        Possible |        Possible |          Possible |           Signal | Source-map audit |
| Runaway total growth         |              No |              No |           Partial |     Strong trend | Milestones       |
| Compatibility accumulation   |        Possible |        Possible |          Possible |            Trend | Expansion review |
| Runtime dependency growth    |           Often |           Often |          Possible |            Trend | Mandatory review |
| Normal feature growth        | Constrain eager | Constrain eager | Constrain surface |           Report | Attribution      |

## 77. Warning/Failure Matrix

| Metric       |  Healthy |                              Warning | Hard failure | Rationale                           |
| ------------ | -------: | -----------------------------------: | -----------: | ----------------------------------- |
| Initial raw  | <650,000 |                            >=650,000 |     >685,000 | Startup/eager risk                  |
| Initial gzip | <161,500 |                            >=161,500 |     >170,000 | Startup transfer proxy              |
| Largest lazy |  <80,000 |                             >=80,000 |     >100,000 | Contextual load proxy               |
| Total JS     | <800,000 | >=800,000; architecture at >=825,000 |          N/A | Trend, not direct user-path failure |

## 78. Review-Trigger Matrix

| Trigger                        | Required response                                      |
| ------------------------------ | ------------------------------------------------------ |
| Initial warning reached        | Attribute eager growth; review imports/performance     |
| Lazy warning reached           | Review surface ownership and interaction load          |
| Total milestone reached        | Growth review at 800k; ownership audit + ADR at 825k   |
| Unexplained large delta        | Investigate before task acceptance                     |
| Runtime dependency added       | Explicit impact and necessity review                   |
| Framework upgrade jump         | Attribute vendor/tool output; govern any policy change |
| Compatibility family expansion | Record impact and review lifecycle separately          |
| Phase boundary                 | Detailed trend and source-ownership review             |

## 79. Bundle Trend Matrix

| Phase/task    | Initial raw | Initial gzip | Largest lazy | Total JS | Interpretation                      |
| ------------- | ----------: | -----------: | -----------: | -------: | ----------------------------------- |
| 5.19          |     676,308 |      168,198 |       30,091 |  706,399 | Initial production split/budgets    |
| 6.2           |     677,829 |      168,596 |       30,091 |  707,920 | Surface/application boundary        |
| 6.5           |     682,538 |      169,851 |            — |  728,781 | Today outcome integration           |
| 6.8/6.9       |     648,162 |      164,161 |       50,645 |  745,080 | Contextual workflows; Plan lazy     |
| 6.10          |     648,577 |      164,327 |       51,445 |  746,295 | Exact identity/authoring completion |
| 6.11/7.1      |     648,706 |      164,373 |       51,445 |  746,424 | QA and Month query                  |
| 7.2/7.2A/7.2B |     630,499 |      160,954 |       51,479 |  749,882 | Month UI; clean audited graph       |

An em dash means the published checkpoint did not provide a reliable value; no number
was fabricated.

## 80. Product-Boundary Matrix

| Capability                                                   | Task 7.2C                  |
| ------------------------------------------------------------ | -------------------------- |
| Governance/history/risk/policy                               | Implemented                |
| ADR and bounded guard tooling/tests                          | Implemented after decision |
| Bundle remediation/feature deletion/compatibility retirement | Prohibited                 |
| Task 7.3/Month authoring/scheduler/authority changes         | Prohibited                 |
| Dependencies/build-output gaming                             | Prohibited                 |

## 81. Architectural Invariant Assessment

All 100 required invariants are confirmed, preserved, implemented, or covered by
tests as applicable. Tasks 7.2A/B remain governing; all production authorities,
semantics, workflows, compatibility, persistence/recovery, build output, and chunk
inclusion are preserved. New policy semantics, visibility, deterministic boundaries,
review mechanisms, tests, and governance satisfy invariants 40–100. No invariant is
blocked or deferred except future reviews that activate only on their stated trigger.

## 82. Stop-Condition Assessment

No stop condition fired: the baseline and implementation were deterministic; no
fixed-size product decision was found; 7.2B remained accurate; the rationale is risk-
based; all chunks remain counted; and the replacement is simple and constraining.

## 83. Architectural Alignment Assessment

Aligned. The policy protects startup/surface architecture, prevents both uncontrolled
growth and artificial compression, and records the material decision through ADR.

## 84. Task 7.3 Readiness

**Ready**, subject to the normal unchanged hard guards and new reporting/review policy.

## 85. Recommended Next Task

Task 7.3 — contextual authoring and attention/configuration migration.

## 86. Final Completion Determination

**Task 7.2C complete.** The inherited 118-byte practical block is replaced by governed,
sustainable headroom without weakening user-path hard protections or changing the
production product.
