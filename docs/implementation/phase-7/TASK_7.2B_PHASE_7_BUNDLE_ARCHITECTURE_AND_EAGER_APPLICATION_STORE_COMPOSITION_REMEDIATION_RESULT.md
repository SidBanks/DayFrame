# Task 7.2B — Bundle Architecture and Eager Application/Store Composition Result

## 1–7. Executive Result, Integrity, Baseline, and Eager Graph

**Result: architecture audit complete; guard-governance stop condition 11 triggered.**
No production change was retained. The immutable brief and project copy have SHA-256
`082daecca8cfad557ee76da2341d0290c11f5e240b69d23d47a78d6dcd914bd3`.
Task 7.2A's conclusion was accepted and its exact baseline reproduced: 116 transformed
modules, 630,499 initial raw, 160,954 initial gzip, 51,479 largest lazy, 749,882 total
JS, and 118 bytes total headroom.

The guard counts every emitted production JavaScript chunk: eager entry/imports plus all
dynamic entries. It does not exclude a capability merely because that capability is
demand-loaded. A source-map ownership build traced 87 application modules in the
436,920-byte entry. Its largest source owners are `DayFrameApp`, `dayFrameStore`,
execution/history authorities, Review, scheduling/friction, restore coordination,
Goals, validation, and persistence. Each module occurs in one output owner; shared
React and time presentation are extracted rather than duplicated.

## 8–17. Authority, Bootstrap, Capabilities, and Store Facade

The authority core is the singular store plus Active setup, Events, Preview,
PlanDecision, HistoricalPlan, ExecutionHistory, Goals, measurement definitions, and
progress observations. Bootstrap/readiness must load current persistence validators,
classify protected data, establish recovery actions, and expose trustworthy authority.
Recovery-critical code is distinct from imported historical Backup handling, but its
runtime participants share the exact restore/transaction infrastructure.

Profiles, complete Backup export/import, explicit restore, full clear, generation,
revision, and publication are user-invoked capabilities. Review and Goal editors are
presentation capabilities. Historical Backup V1–V6 validators/translators are
compatibility support. Canonical time, scheduling, exact identity, and validation
primitives are shared domain logic.

The store statically composes these implementations behind one action facade. This is
broader than a minimal startup facade, but it is not duplicated authority. Moving
implementation outside the store could retain singular state only by adding adapters
and, for several actions, an asynchronous load/revalidation contract. Such a split
would move the same code into counted chunks without reducing total output. Stable
synchronous generation/revision/Event/profile actions and atomic restore/publication
were therefore not changed.

## 18–24. Backup, Restore, Recovery, Rehydration, and Compatibility

Backup creation is invoked from the shell and exports current V6 while preserving older
formats. Validation dispatch supports V1–V6; V1–V4 share the legacy envelope path and
V5/V6 add measurement/progress authority. Restore performs strict validation,
translation, staging, semantic verification, exact multi-authority replacement,
rollback, and recovery protection.

Ordinary persistence rehydration needs current Active/profile/decision/execution/
history/Goal/measurement/progress schemas but not every user-imported Backup version.
The historical chain could technically become demand-loaded during the already-async
file workflow. Rolldown would nevertheless emit all statically named dynamic targets,
so guarded total JS would remain approximately unchanged while load-failure and stale-
authority races would be added. Compatibility was retained eagerly. No version,
strict-key check, unknown-field behavior, or absent-versus-empty clone semantic changed.

## 25–36. Product Capability Ownership

Profiles own persistent metadata and exact authored-state replacement and remain
supported. Full clear intentionally coordinates every authority and cannot omit a
participant. Goal authority/readiness is independent; its editor is Plan presentation.
Events and Work participate in Month temporal/schedule truth, so their domain behavior
cannot be made feature-local. Preview generation and revision are synchronous store
commands; demand loading would change public timing. Historical publication shares the
atomic authority transaction boundary. Review remains a reachable Planner mode and
still owns generation, Event authoring, contextual edit, and friction workflows beyond
Month's read-only detail.

`DayFrameApp` statically owns readiness/recovery, profiles/Backup controls, compact
Preview/Event workflow, Review, Goal composition, and navigation. Month, Plan authoring,
Today UI/query, and Summary are healthy dynamic entries. Review and Goal presentation
could also become lazy, but the guard would count the resulting chunks and no duplicate
implementation would disappear. No new surface or compatibility registry was added.

## 37–46. Total Guard, Replacement, Consolidation, and Candidate Ranking

The graph hits the guard because it is a hard sum of the whole supported application:
189,637 bytes of React runtime, 436,920 bytes of singular authority/application code,
and 123,325 bytes of lazy/shared product code. The source-map audit found no repeated
production module across owners. Therefore the current ceiling now behaves as a hard
whole-product complexity limit, not merely a detector of accidental eager loading or
duplication.

Month does not replace Review's write/resolution workflows. The legacy mini-calendar
also drives range selection and Event detail; prior regression evidence mechanically
proved it is not yet dead. Validator, restore, clone, constants, and React structures
contain local repetition, but consolidation cannot recover the required 20 KB without
a new validation framework, generic authority factory, or altered version semantics.

Ranked candidates were: historical Backup demand loading (high complexity, zero guarded
total benefit); Review/Goal presentation lazy ownership (low risk, zero guarded total
benefit); synchronous engine/revision loading (contract change, zero guarded total
benefit); compatibility/schema consolidation (high semantic risk and insufficient
measured opportunity); feature retirement (prohibited). None satisfied expected total
recovery × safety ÷ complexity.

## 47–58. Chosen Remediation, Files, and Experiments

The chosen action is the task's governed stop, not a forced source rewrite. Only task,
result, checkpoint, and governance documentation changed. Authority/capability
classification is recorded, but production imports, store actions, capability loading,
compatibility loading, presentation loading, and Vite configuration are byte-identical.
Removed/deduplicated emitted code: zero.

Task 7.2A's measured negative experiments remain governing: automatic chunk ownership
added 42 bytes, module-preload removal saved only 556 bytes while narrowing behavior,
and `esnext` saved nothing. Task 7.2B additionally used a source-map audit build in
`/tmp`; source maps slightly change emitted comments and were never proposed as a
production change. No structural experiment was retained because every candidate
predictably moved counted code or crossed an explicit contract stop condition.

## 59–82. Race Safety, Regression, and Validation

No asynchronous capability boundary was introduced, so no new profile/restore/clear/
recovery race exists. Behavioral equivalence is mechanical: final production sources
and emitted assets match the Task 7.2A baseline. Recovery, profile, Backup, restore,
full clear, Goal, Event, Work, Preview, HistoricalPlan, Month, Plan, Review, Today,
Summary, accessibility, focus, and mobile semantics are unchanged. Slow-network and
module-load behavior are unchanged. No tests changed.

Canonical validation passed: Prettier, ESLint, TypeScript, 93 test files and 960 tests,
production build, all bundle guards, artifact hashes, and `git diff --check`. Because
no production composition or loading changed, browser and slow-network repetition
would execute the byte-identical Task 7.2 build and was not repeated.

## 83–99. Bundle Result, Boundaries, Governance, and Deferred Work

Baseline and final bundle are identical. Raw recovered, gzip change, initial change,
largest-lazy change, and recovered headroom are all zero. No runtime dependency,
persistence participant, authority, scheduler, recurrence, build rule, or threshold
changed. No ADR was created inside this task because changing the guard is explicitly
out of scope.

Evidence supports sustainable-guard interpretation **B**: the graph is appropriately
split, low-duplication, and composed of supported product/compatibility contracts, while
the inherited whole-product limit has reached exhaustion. This triggers stop condition
11 and requires a dedicated **Bundle Budget Governance Audit / ADR**. That audit must
decide whether total-JS remains a hard product-complexity budget, whether per-entry/
route/duplication metrics better express architectural health, and what justified
headroom policy governs Phase 7. Task 7.3 remains paused until that decision.

## 100. Architecture Remediation Ledger

| Candidate | Hypothesis | Total delta | Risk | Decision |
| --- | --- | ---: | --- | --- |
| Backup V1–V6 demand loading | remove compatibility from startup | approximately 0 | async validation/restore races | Rejected |
| Review lazy entry | reduce eager presentation | approximately 0 | loading/focus complexity | Rejected for total task |
| Goal editor with Plan chunk | align presentation ownership | approximately 0 | composition churn | Rejected for total task |
| Engine/revision demand loading | contextualize commands | approximately 0 | synchronous contract change | Stop condition |
| Generic validator/restore factories | consolidate boilerplate | below target/unknown | compatibility semantics | Stop condition |
| Retire mini-calendar/Review behavior | remove emitted UI | potentially meaningful | feature loss | Prohibited |
| Guard/count policy change | align metric to healthy graph | N/A | enduring governance | Deferred to ADR audit |

## 101. Eager Ownership Matrix

| Capability | Eager | Eager authority required | Implementation contextual? | Decision |
| --- | ---: | ---: | ---: | --- |
| Store/readiness/current persistence | Yes | Yes | No | Keep |
| Recovery | Yes | Yes for protected boot | Partly | Keep safety core |
| Profiles | Yes | Metadata/readiness yes | Commands potentially | Keep contracts |
| Backup create/validate/restore | Yes | No | Yes | Keep: total unchanged/risk added |
| Full clear | Yes | coordinator needs all authorities | No practical split | Keep |
| Goals/Events/Work | Yes | Yes | Editors partly | Keep authority; existing Plan lazy UI |
| Generation/revision/publication | Yes | No | Conceptually yes | Keep synchronous/atomic contracts |
| Review UI | Yes | No | Yes | Keep: no total benefit |

## 102. Store Capability Matrix

| Capability | Current import | Class | Could leave store? | Risk |
| --- | --- | --- | ---: | --- |
| Authored/Event mutations | validation + Active persistence | Core | No | authority/timing |
| Profiles | profile storage/validation | Intended capability | Partly | exact replacement/protection |
| Backup V1–V6 | version modules | Import/export | Technically | async races; zero total benefit |
| Restore/full clear | coordinator/participants | Recovery/transaction | No safely | atomicity/rollback |
| Generate/revise | engine/friction | User command | Only with contract change | synchronous semantics |
| PlanDecision/history/execution | authority surfaces | Core cross-surface | No | singular authority |
| Historical queries | query factories | Derived query | UI may call lazy facade | emitted total unchanged |

## 103–105. Compatibility, Lazy Capability, and Race Matrices

| Family | Startup | Import/restore | Isolatable | Result |
| --- | ---: | ---: | ---: | --- |
| Active/profile current schemas | Yes | Yes | No | Eager |
| Backup V1–V6 | No | Yes | Technically | Retained; counted total unchanged |
| PlanDecision/Execution/HistoricalPlan | Yes for authority protection | Yes | Partly | Eager authority validators |
| Goals/measurement/progress | Yes for readiness | V4–V6 | Partly | Eager authority validators |
| Restore translation | Recovery/restore composition | Yes | Not without transaction split | Eager |

No lazy capability change was retained, so the required lazy-capability and race
matrices have no new rows. Existing Month/Plan/Today/Summary loading and race behavior
remain governed by Task 7.2.

## 106. Bundle Matrix

| Metric | 7.2A | 7.2B | Delta | Guard |
| --- | ---: | ---: | ---: | ---: |
| Initial raw | 630,499 | 630,499 | 0 | 685,000 |
| Initial gzip | 160,954 | 160,954 | 0 | 170,000 |
| Month | 21,602 | 21,602 | 0 | 100,000 lazy max |
| Plan | 51,479 | 51,479 | 0 | 100,000 lazy max |
| Today UI | 11,282 | 11,282 | 0 | 100,000 lazy max |
| Today query | 4,890 | 4,890 | 0 | 100,000 lazy max |
| Summary | 30,130 | 30,130 | 0 | 100,000 lazy max |
| time display | 3,856 | 3,856 | 0 | shared |
| React vendor | 189,637 | 189,637 | 0 | initial |
| entry | 436,920 | 436,920 | 0 | initial |
| runtime | 86 | 86 | 0 | initial |
| Largest lazy | 51,479 | 51,479 | 0 | 100,000 |
| Total | 749,882 | 749,882 | 0 | 750,000 |

## 107–108. Guard and Product-Boundary Matrices

| Guard | Threshold | Final | Headroom | Pass |
| --- | ---: | ---: | ---: | --- |
| Initial raw | 685,000 | 630,499 | 54,501 | Yes |
| Initial gzip | 170,000 | 160,954 | 9,046 | Yes |
| Largest lazy | 100,000 | 51,479 | 48,521 | Yes |
| Total | 750,000 | 749,882 | 118 | Yes; governance-blocked |

| Boundary | Result |
| --- | --- |
| Architecture/authority-capability/compatibility audits | Completed |
| Safe store/composition remediation | None with real total benefit |
| Recovery, profiles, Backup/restore | Preserved |
| Product features/Task 7.3 | Prohibited and absent |
| Authority duplication/scheduler redesign/dependency | Prohibited and absent |
| Threshold/count/build policy | Unchanged; governance audit required |

## 109–114. Final Assessment

Invariants 1–77 and 80–89 are confirmed, preserved, tested, or not applicable. Invariant
78 is satisfied through the specified guard-governance stop. Invariants 79 and 84
(preferred reduction and meaningful new headroom) are blocked by that stop. Invariant
90 is satisfied by explicitly identifying the governance prerequisite.

The result is architecturally aligned: it distinguishes authority from capability,
proves why contextual loading cannot change the governing total, and refuses unsafe
contract changes or feature compression. Task 7.3 is not ready. Recommended next task:
**Phase 7 Bundle Budget Governance Audit and ADR**, followed by Task 7.3 only if that
decision establishes sustainable, evidence-based Phase 7 budget policy. Task 7.2B is
complete as an architecture audit with guard-governance outcome B; it is not a bundle-
reduction success.
