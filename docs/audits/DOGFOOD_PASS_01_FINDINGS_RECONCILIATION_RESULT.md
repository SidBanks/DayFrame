# Dogfood Pass 01 Findings Reconciliation Result

## 1. Executive Reconciliation

The complete repository ledger contains 63 stable findings: `DF-001`–`DF-055` and `PM-01`–`PM-08`. Every finding is preserved and dispositioned. Accepted architecture resolves the former Capacity, Demand/Allocation, Structure, Composition, Proposal, Found-Time, history, and learning questions, but implementation remains open. Three observations remain defect candidates requiring targeted reproduction: Sunday Work alignment (`DF-006`) and self-reference acceptance/plausible output (`DF-017`, `DF-018`). Closure is **DFR2 — Reconciled With Targeted Reproduction Needed**. No Dogfood finding requires new architecture before alignment.

## 2. Scope

This reconciliation compares Experienced Truth in the Dogfood ledger, Intended Truth in the AS2 synthesis/specifications, and only the Implemented Truth needed for disposition. It does not redesign the product, fix defects, write tests, create tasks, construct a roadmap, or name a future phase.

## 3. Source Inventory

Primary ledger: `docs/audits/DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md` (55 `DF-*`, 8 `PM-*`). Normative sources: `POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`, Capacity, Goal Demand/Allocation, Goal Structure, Commitment Composition, and Constructive Proposal specification results. Supporting evidence: `DECISIONS.md`, `CURRENT_STATE.md`, architecture/audit descendants, and targeted production searches in `code/src/core/blocks`, engine tests, UI/state, profiles, and Backup V3–V6.

## 4. Corrected Governance Filename Note

The corrected files are `docs/architecture/ARCHITECTURE_CHARTER.md` and `docs/audits/IMPLEMENTATION_ARCHITECTURE_AUDIT_SYNTHESIS.md`. Both now exist; the synthesis's earlier missing-file observation is closed as a filename correction, not governance debt. Neither was modified.

## 5. Truth Model

Intended Truth has normative precedence. Implemented Truth describes current executable behavior, never architectural authority. Experienced Truth records what a real user could discover and accomplish. “Architecture-resolved” therefore does not mean implemented, and “not discovered” is not proof of code absence.

## 6. Classification Method

Each finding has exactly one primary disposition A–G, controlled tags, S0–S4 severity, confidence, current status, provenance, and downstream destination. Working strengths use A/`ClosedNoAction` when architecture validates them; conceptually resolved but unimplemented findings use A/`ArchitecturallyResolvedImplementationOpen`; concrete missing executable semantics use B; surprising behavior without reproduction uses C; workflow and visual concerns use D/E; optional timer capabilities use F.

## 7. Complete Reconstructed Dogfood Ledger

The authoritative reconstruction is `DF-001`–`DF-055` plus `PM-01`–`PM-08`, in source order. No `DFV-*` identifiers were found. Unnumbered narrative was checked against these records; it refines rather than adds independent findings. Compound findings retain their IDs and are cross-tagged; no child split is necessary because architecture, implementation, and UX consequences can coexist under one primary disposition/status.

## 8. Ledger Provenance

All IDs originate directly in `DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md`: `DF-*` are observed capabilities/problems and `PM-*` are higher-order principles distilled during that pass. `DF-022/023` spawned Composition work; `DF-041` Capacity; `DF-045/046` Demand/Allocation/Proposal; `DF-013`–`016` inform Work-relative policy; `DF-029`–`033` decision/preference semantics; `DF-038`–`040` horizon separation. Later audits refined executable status; accepted specification results supersede their open semantic interpretation, not their Experienced Truth.

## 9. Disposition Summary

| Measure | Count |
|---|---:|
| Total findings | 63 |
| A — Resolved by Accepted Architecture | 32 |
| B — Implementation-Alignment Gap | 5 |
| C — Defect / Bug Candidate | 3 |
| D — UX / Workflow Issue | 20 |
| E — Visual / Polish Issue | 1 |
| F — Deferred Enhancement | 2 |
| G — Architectural Follow-Up | 0 |
| ArchitecturallyResolvedImplementationOpen | 20 |
| Confirmed bugs | 0 |
| Bug candidates needing reproduction | 3 |
| UX issues (primary D) | 20 |
| Visual issues | 1 |
| Deferred enhancements | 2 |
| Carry into some downstream destination | 50 |

## 10. Master Findings Matrix

Evidence abbreviations: **Ledger** = `DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md`; **Synth** = post-Phase-7 synthesis; **Impl** = current production/tests searched. All “A-open” rows mean semantics resolved, implementation not implied.

| ID | Finding | Experienced Truth | Intended Truth | Implemented Truth | Primary | Tags | Sev | Confidence | Status | Carry? |
|---|---|---|---|---|---|---|---|---|---|---:|
| DF-001 | Multiple shifts supported | Worked | Work allows plurality | Present | A | Work,Teach | S3 | Confirmed | ClosedNoAction | Preserve |
| DF-002 | Dated rotations supported | Worked but buried | Work Pattern owns | Present | A | Work,Discoverability | S3 | Confirmed | ImplementedNeedsValidation | UX |
| DF-003 | Rotation authoring unclear | Experimentation required | Semantics valid | Workspace exists | D | Work,Teach,Accessibility | S2 | Needs UX Validation | Open | UX |
| DF-004 | Date-range recovery weak | Validation blocked, reason hard | Explain invalid facts | Validation present | D | Work,Discoverability | S2 | Strongly Supported | Open | UX |
| DF-005 | Dated transitions generate | Worked | Deterministic Work | Present | A | Work,Determinism | S3 | Confirmed | ClosedNoAction | Preserve |
| DF-006 | Sunday Work anomaly | Work appeared unexpectedly | Canonical weekday/user-day | Cause unproved; weekday tests exist | C | Work,UserDay | S1 | Needs Reproduction | BugCandidate | Reproduce |
| DF-007 | Work provenance hard to verify | Manual inspection | Explainable provenance | Data exists, weak display | D | Work,Discoverability | S2 | Needs UX Validation | Open | UX |
| DF-008 | Recurring Commitments work | Worked | Prior authority realizes | Present | A | Commitment | S3 | Confirmed | ClosedNoAction | Preserve |
| DF-009 | Weekday control weak | Functional/unattractive | No semantic gap | Present | E | Commitment,Visual,Accessibility | S4 | Needs UX Validation | Open | Polish |
| DF-010 | Advanced controls buried | Capabilities looked absent | Planner/Teach expose intent | Present but buried | D | Commitment,Discoverability | S2 | Strongly Supported | Open | UX |
| DF-011 | Sleep relative to Work | Worked | Commitment relation | Present | A | Work,Commitment | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-012 | Relative Sleep adapts | Worked across shifts | Deterministic relation | Present | A | Work,Commitment | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-013 | Off-day semantics unclear | Deterministic fallback surprised | Explicit policy required | Fallback exists | D | Work,Commitment,UserDay | S2 | Needs Product Decision | Open | Product |
| DF-014 | Off-day policy explicit | Two valid philosophies | Authored policy | Not first-class found | D | Work,Preference | S2 | Needs Product Decision | ArchitecturallyResolvedImplementationOpen | Product+align |
| DF-015 | Preserve Routine mode | Desired | Valid policy option | Not found | D | Work,Preference | S3 | Needs Product Decision | Open | Product |
| DF-016 | Adapt Off Days mode | Desired | Valid policy option | Not found | D | Work,Capacity | S3 | Needs Product Decision | Open | Product |
| DF-017 | Self-reference accepted | Circular relation entered | Invalid unless explicitly defined | Guard not established | C | Commitment,Determinism | S1 | Needs Reproduction | BugCandidate | Reproduce |
| DF-018 | Self-reference plausible output | Invalid input looked credible | Fail closed/explain | Cause not established | C | Commitment,Determinism | S1 | Needs Reproduction | BugCandidate | Reproduce |
| DF-019 | Buffers exist | Initially missed, then worked | Buffer protects time | Present | A | Buffer,Discoverability | S3 | Confirmed | ImplementedNeedsValidation | Preserve+UX |
| DF-020 | Buffers buried | Advanced path required | Semantics resolved | Present/buried | D | Buffer,Commitment,Discoverability | S2 | Needs UX Validation | Open | UX |
| DF-021 | Large Buffer unplaceable | Observed | Full footprint may fail; explain | Placement failure present | D | Buffer,Friction | S2 | Strongly Supported | Open | UX+align |
| DF-022 | Buffer not real commute | Semantic mismatch | Attached Activity distinct | Composition not executable | B | Composition,Buffer | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| DF-023 | Attached/subordinate activity | Needed model | Composition specifies it | Not implemented | B | Composition,Commitment | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| DF-024 | Friction detection works | Worked | Corrective domain | Present | A | Friction | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-025 | Bounded fixes generated | Worked | SuggestedFix corrective | Present | A | Friction,Determinism | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-026 | Fix application works | Worked | Explicit accept | Present | A | Friction,AcceptedChoice | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-027 | Decisions persist | Worked | Accepted Choice evidence | Present | A | AcceptedChoice,Persistence | S1 | Confirmed | ClosedNoAction | Preserve |
| DF-028 | Applicability visible | Applied/Blocked shown | Stale/applicability explicit | Present | A | AcceptedChoice,Friction | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-029 | Choice list will not scale | Flat list concern | History resolution may vary | Flat presentation | D | AcceptedChoice,Scalability | S2 | Needs UX Validation | Open | UX |
| DF-030 | Choices may guide | Opportunity identified | Guidance distinct from preference | No reuse | A | AcceptedChoice,Preference | S2 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align+product |
| DF-031 | Preference precedence | Needed | Authority order specified | No general mechanism | A | Preference,GoalPriority | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| DF-032 | Preference conflict visible | Opportunity | Higher-authority conflict exposed | Not implemented | A | Preference,Friction | S2 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align+UX |
| DF-033 | Repetition not authority | Principle | Explicit promotion required | No learning path | A | Preference,History | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| DF-034 | Individual recovery works | Worked | Occurrence corrective flow | Present | A | Friction | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-035 | No bulk workflow | Not discovered | Scope must be explicit | Individual only | D | Friction,Scalability | S2 | Strongly Supported | Open | Product+UX |
| DF-036 | Per-occurrence does not scale | Burdensome projection | Occurrence/pattern/preference distinct | Occurrence decisions | D | Friction,Scalability | S2 | Needs Product Decision | Open | Product |
| DF-037 | Long horizons work | Year generated | Planning-data may be broad | Present | A | PlanningHorizon,Performance | S3 | Confirmed | ClosedNoAction | Preserve |
| DF-038 | Horizon/review coupled | Long generation broadened review | Ranges distinct | Coupling remains | D | PlanningHorizon,ReviewScope | S2 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align+UX |
| DF-039 | Annual review overwhelms | Too many conflicts | Bounded review | Broad list remains | D | ReviewScope,Scalability | S2 | Needs UX Validation | Open | UX+perf |
| DF-040 | Planning ≠ attention | Product insight | Synthesis separates ranges | Not independently modeled | D | PlanningHorizon,ReviewScope | S2 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| DF-041 | Capacity invisible | No meaningful Capacity surface | First-class read model | Not implemented | B | Capacity,Planner | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| DF-042 | Goals authored | Worked | Goal authority | Present | A | Goal,Teach | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-043 | Goals in Summary/history | Worked | Historical Goal interpretation | Present | A | Goal,Summary,History | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-044 | Scheduled work Goal-linked | Worked via advanced path | Useful direct provenance | Present/buried | D | Goal,Execution,Discoverability | S2 | Confirmed | PartiallyImplemented | Preserve+UX |
| DF-045 | Allocation user-driven | User manually planned | Demand→Allocation→Proposal/direct path | Automated path absent | B | GoalDemand,Capacity,Proposal | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| DF-046 | General Proposal absent | Not observable | Constructive Proposal specified | Not implemented | B | Proposal,Planner | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| DF-047 | Execution/Progress exist | Worked | Separate evidence | Present | A | Execution,Progress | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-048 | Duration manually reported | Clarified | Valid execution evidence | Present | A | Execution | S3 | Confirmed | ClosedNoAction | Preserve |
| DF-049 | No native timer | Not found | Timer not required | Not present | F | Execution,Today | S4 | Confirmed | Deferred | Backlog |
| DF-050 | Manual + measured coexist | Opportunity | Compatible provenance modes | Measured absent | F | Execution,Today | S4 | Needs Product Decision | Deferred | Backlog |
| DF-051 | Summary substantial | More existed than apparent | Summary owns interpretation | Present | A | Summary,History | S2 | Confirmed | ClosedNoAction | Preserve |
| DF-052 | Summary weakly connected | Fragmented operating loop | Planner/Today/Summary boundaries | Navigation partial | D | Summary,Discoverability | S2 | Needs UX Validation | Open | UX |
| DF-053 | Summary scale risk | Years would overwhelm | Operational/analytic/archive distinction | Limited data today | D | Summary,Scalability | S2 | Needs Product Decision | Open | Product+UX |
| DF-054 | Profiles feel legacy | Save/load setup seems obsolete | Separate from backup; role unresolved product-wise | Profiles persist | D | Profile,Persistence,Migration | S2 | Needs Product Decision | Open | Product |
| DF-055 | Backup valuable | Need confirmed | Authority backup/restore required | V6 path exists | A | Backup,Persistence | S1 | Confirmed | ClosedNoAction | Preserve |
| PM-01 | Proposal constructive; Friction corrective | Derived principle | Explicitly resolved | Only Friction executable | A | Proposal,Friction | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| PM-02 | Commitments shape Capacity | Derived principle | Capacity contract | Capacity model absent | A | Commitment,Capacity | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| PM-03 | Goals compete for Capacity | Derived principle | Demand/Allocation contract | Absent | A | Goal,Capacity | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| PM-04 | Proposal epistemic boundary | Derived principle | Proposal spec | Absent | A | Proposal | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| PM-05 | Goals inform, not schedule | Derived principle | Synthesized chain | Partial direct path only | A | Goal,Proposal | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| PM-06 | History resolution ages | Derived principle | Persistence/history classes | Presentation absent | A | Summary,History,Scalability | S2 | Confirmed | ArchitecturallyResolvedImplementationOpen | Product+align |
| PM-07 | Operational/analytic/archive | Derived principle | Synthesis persistence classes | Not separated | A | History,Persistence | S1 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align |
| PM-08 | Provenance ≠ prominence | Derived principle | Hybrid history + review scope | UI not aligned | A | History,Summary | S2 | Confirmed | ArchitecturallyResolvedImplementationOpen | Align+UX |

## 11. Architecture-Resolved Findings

Primary A findings either preserve proven behavior (`DF-001/002/005/008/011/012/019/024`–`028/034/037/042/043/047/048/051/055`) or capture semantics resolved by specifications (`DF-030`–`033`, `PM-01`–`08`). The latter remain implementation-open where models, history resolution, guidance, or preference promotion are absent.

## 12. Implementation-Alignment Gaps

Primary B: `DF-022/023` require executable Composition/Attached Activities; `DF-041` first-class Capacity; `DF-045` Demand/Feasibility/Allocation/Accepted Allocation; `DF-046` constructive Proposal. These are fully specified, significant/critical, and must carry forward without reopening architecture.

## 13. Defect / Bug Candidates

`DF-006`, `DF-017`, and `DF-018` remain candidates, not confirmed defects. Current weekday/user-day tests demonstrate intended deterministic mechanics but do not reproduce the Dogfood setup. Targeted reproduction must freeze authored setup, planning window, timezone/user-day boundary, and rendered/source occurrence identity.

## 14. UX / Workflow Issues

Primary D preserves authoring comprehension/recovery, provenance verification, advanced-control discoverability, off-day choices, Buffer explanation, choice/review scalability, bulk conflict handling, Goal linkage, Summary connection/scale, and Profile role. Valid semantics do not close these experienced problems.

## 15. Visual / Polish Issues

`DF-009` remains a weekday-control visual/interactivity issue with accessibility implications. It has no architecture dependency beyond preserving weekday authority.

## 16. Deferred Enhancements

`DF-049/050` preserve the optional native-timer/measured-execution opportunity. Architecture requires credible actual evidence for some Live derivations, but manual/cancellation/end-time inputs can satisfy it; a timer is an optional implementation/product strategy.

## 17. Architectural Follow-Ups

**No Dogfood Pass 01 finding requires additional architecture work before implementation alignment.**

## 18. Work Pattern Findings

`DF-001/002/005/037` are strengths; `DF-003/004/007` are workflow/explanation issues; `DF-006` needs reproduction. Rotations, cycles, overnight and split patterns fit the canonical Work/user-day architecture. Terminology and authoring sequence remain UX concerns.

## 19. Work-Day Alignment

Canonical weekday selection applies to a canonical user-day, not necessarily calendar-date display. Dogfood observed Sunday Work (`DF-006`) despite neither shift selecting Sunday. Candidate/work generation contains explicit user-day/weekday logic and substantial tests, but the exact setup is absent; classify C/S1/Needs Reproduction rather than defect or misunderstanding.

## 20. Sleep Findings

`DF-011/012` prove useful Work-relative placement and are regression risks. `DF-013`–`016` require product selection/defaults for explicit Preserve Routine and Adapt to Off Days policies under existing Commitment/preference semantics. `DF-017/018` require reproduction of circular reference validation. No Sleep-specific domain is warranted.

## 21. Buffer Findings

`DF-019` confirms implementation; `DF-020` is discoverability; `DF-021` is valid full-footprint failure needing explanation/recovery. Architecture now separates protected Buffer from executable Attached Activity, so UX must let users express ordinary before/after space without hiding semantics.

## 22. Attached Activities

`DF-022/023` are architecture-resolved implementation gaps: normal Commitment sources attach through versioned relationships, real components execute, Buffers do not, and full footprints affect Capacity. Future UX/product presentation remains open but does not block semantic alignment.

## 23. Planning Horizon / Review Scope

`DF-037` preserves broad generation; `DF-038/040` are architecturally resolved yet implementation-open; `DF-039` remains UX/performance scale. Planning-data horizon, Proposal Horizon, review scope, and publication range must become separate inputs without redesigning their controls here.

## 24. Friction / Bulk Resolution

`DF-024`–`028/034` are working corrective strengths. `DF-035/036` are D rather than missing architecture: bulk/pattern operations require a product/UX decision about occurrence, pattern, composite, and preference scopes. Bulk acceptance must revalidate each affected authority and cannot silently promote preference.

## 25. Recommendation Discoverability

Dogfood found corrective SuggestedFix but not constructive Proposal (`DF-046`, `PM-01/04/05`). Architecture distinguishes Preview placements, recurring realization, Friction, and Proposal. Implementing Proposal is B; explaining and locating the different recommendation types remains a later UX obligation.

## 26. Accepted Choices

`DF-027/028` durability/applicability must be preserved. `DF-029` flat-list scale is D. `DF-030`–`033` are semantically resolved: PlanDecision choice, ProposalDecision, learned guidance, and explicit Preference are distinct; conflict and promotion need future implementation/UX.

## 27. Goal-to-Execution

Current useful path—Goal link → scheduled occurrence → frozen Goal snapshot → execution/history and separate Progress—must survive. `DF-044` is discoverability/partial provenance; `DF-045/046` are missing constructive planning. Direct scheduling stays valid while the normalized Demand→Allocation→Proposal path is added.

## 28. Native Execution Timer

The architecture needs trustworthy actual timing/cancellation for divergence but not a timer specifically. Manual retrospective evidence remains essential. `DF-049/050` are F/S4 pending a product decision; neither blocks alignment.

## 29. Saved Setup Profiles

`DF-054` is D/S2/Needs Product Decision. Current Profiles are durable alternate setup snapshots, but their future role as scenario/template/snapshot or deprecation is unresolved at product level. They must not be conflated with current authority, backup, or historical publication.

## 30. Backup

`DF-055` found no backup defect. Current versioned Backup V6 and restore remain a high-value regression surface. Backup is portability/recovery of authority, distinct from profiles/templates/scenarios/history.

## 31. Weekday Controls

`DF-009` is primarily E/S4 with secondary Accessibility and interaction implications. Preserve keyboard/semantic selection and authored weekday truth; visual redesign is downstream.

## 32. Summary

`DF-051` preserves substantial history/Goal/outcome functionality. `DF-052` is operating-loop UX; `DF-053` and `PM-06`–`08` require scalable resolution/presentation while immutable provenance remains available. Summary interprets; it never authorizes.

## 33. Terminology

Segment/cycle/Setup/Candidate/Accepted Choice/Buffer/Commitment/Goal Activity/Friction/Summary have valid internal meanings but may be poor user labels. `BlockCandidate` must never be relabeled Proposal Option; “free time” is not Capacity; “Accepted Choice” needs decision kind/scope. Terminology is a cross-cutting D concern attached to `DF-003/007/010/019/029/052/054`, not a new orphan finding.

## 34. Scalability

Explicit findings: `DF-029`, `DF-036`, `DF-039`, `DF-053`, `PM-06`–`08`; secondary: multiple rotations, Friction volume, Goal/Commitment libraries, broad horizon. Architecture supplies bounded scopes, persistence classes, and provenance resolution; data/query and progressive-disclosure validation remain downstream.

## 35. Accessibility

Evidence-supported implications attach to `DF-003/004/009/010/020/029/039/052`: cognitive load, weak recovery, control affordance, buried actions, long lists, and fragmented navigation. Architecture requires accessible implementation but does not predetermine UI.

## 36. Architecture Resolution Matrix

| Findings | Topic | Resolving Specification / Decision | Semantically Resolved? | Implementation Open? | UX Open? |
|---|---|---|---:|---:|---:|
| DF-013–016 | Off-day/relative policy | Synthesis Commitment/Preference/User-Day | Yes | Yes | Yes |
| DF-022/023 | Composition | Composition spec | Yes | Yes | Yes |
| DF-029–033 | Choice/preference/learning | Proposal spec + synthesis §§32–34 | Yes | Yes | Yes |
| DF-038–040 | Horizons/review | Proposal spec + synthesis §§46–49 | Yes | Yes | Yes |
| DF-041, PM-02/03 | Capacity | Capacity spec | Yes | Yes | Yes |
| DF-045, PM-03/05 | Demand/Allocation | Demand/Allocation spec | Yes | Yes | Yes |
| DF-046, PM-01/04/05 | Proposal | Proposal spec | Yes | Yes | Yes |
| DF-050 | Measured execution compatibility | Synthesis Execution/Live | Yes | Yes optional | Yes |
| DF-053, PM-06–08 | Historical scale | Synthesis persistence/history | Yes | Yes | Yes |

## 37. Bug Candidate Matrix

| ID | Observed | Expected | Evidence | Reproduce? | Subsystem | Severity |
|---|---|---|---|---:|---|---|
| DF-006 | Sunday Work despite weekdays | Correct canonical user-day membership | Ledger §5; generation/tests searched | Yes | Work cycle/user-day/rendering | S1 |
| DF-017 | Self-reference accepted | Reject circular relation | Ledger §9; guard not established | Yes | Commitment validation | S1 |
| DF-018 | Invalid relation yielded plausible output | Fail closed with explanation | Ledger §9 | Yes, with DF-017 | Placement/fallback/validation | S1 |

## 38. UX / Workflow Matrix

| IDs | Surface | Friction | Semantics Correct? | Capability? | Dependency | Severity |
|---|---|---|---:|---:|---|---|
| DF-003/004/007 | Teach/Planner Work | Model/recovery/provenance unclear | Yes | Yes | Work/user-day | S2 |
| DF-010/020/021 | Commitment | Controls/Buffer/explanation buried | Yes | Mostly | Composition/Friction | S2 |
| DF-013–016 | Work/Sleep | Off-day choice/default absent | Resolved | Partial | Preference/Capacity | S2–S3 |
| DF-029/035/036 | Review | Flat choices, no bulk/pattern flow | Resolved scopes | Individual only | Decisions/Friction | S2 |
| DF-038–040 | Review | Broad range overwhelms attention | Resolved | Coupled | Horizon model | S2 |
| DF-044 | Planner/Today | Goal link buried | Yes | Yes | Goal provenance | S2 |
| DF-052/053 | Summary | Weak loop and scale | Yes | Partial | History resolution | S2 |
| DF-054 | Teach/Persistence | Profiles' role unclear | Product-open | Yes legacy | Persistence classes | S2 |

## 39. Visual / Polish Matrix

| ID | Control | Observation | Accessibility | Dependency | Severity |
|---|---|---|---|---|---|
| DF-009 | Weekday selector | Visually weak/inconsistent | Affordance, focus, target clarity | Preserve weekday authority | S4 |

## 40. Deferred Enhancement Matrix

| ID | Enhancement | Existing Primitive | Compatibility | Why Deferred | Trigger |
|---|---|---|---|---|---|
| DF-049 | Native timer | Manual actual-time evidence | Compatible, not required | No correctness requirement | Live execution product decision |
| DF-050 | Manual + measured modes | Execution duration | Explicit provenance modes fit | Optional convenience | Timer/telemetry value validated |

## 41. Architectural Follow-Up Matrix

**No Dogfood Pass 01 finding requires additional architecture work before implementation alignment.**

## 42. Surface Matrix

| Surface | Findings | Themes | Architecture Resolved? | Implementation Open? | UX Open? |
|---|---|---|---:|---:|---:|
| Teach | DF-001–004,008–010,013–023,042,054/055 | Authoring, policy, composition, persistence | Yes | Yes | Yes |
| Planner | DF-005–007,021,024–046 | Generation, Friction, horizons, Capacity/Proposal | Yes | Yes | Yes |
| Today | DF-044,047–050; Found-Time descendants | Execution/Live/direct action | Yes | Yes | Yes |
| Summary | DF-043,047,051–053, PM-06–08 | History, Progress, scale | Yes | Yes | Yes |

## 43. Domain Matrix

| Domain | IDs | Architecture | Implementation | UX | Carry? |
|---|---|---|---|---|---:|
| Work/User-Day | DF-001–007,011–018,037 | Resolved | Mature + 3 repro concerns | Open | Yes |
| Commitment/Composition/Buffer | DF-008–023 | Resolved | Base present; composition absent | Open | Yes |
| Friction/Choices/Preference | DF-024–036, PM-01 | Resolved | Corrective present; preference/bulk absent | Open | Yes |
| Horizons | DF-037–040 | Resolved | Coupled | Open | Yes |
| Capacity/Demand/Proposal | DF-041,045/046, PM-02–05 | Resolved | Absent/partial | Open | Yes |
| Goals/Execution/Progress | DF-042–050 | Resolved | Useful partial path | Open | Yes |
| Summary/History | DF-043,051–053, PM-06–08 | Resolved | Substantial, scale immature | Open | Yes |
| Persistence/Profile/Backup | DF-054/055 | Resolved boundaries | Present | Profile decision open | Yes |

## 44. Severity Matrix

| Severity | Count | IDs | Why |
|---|---:|---|---|
| S0 | 0 | — | No architecture blocker/data corruption confirmed |
| S1 | 18 | DF-006,017,018,022–028,031,041,045,046,055; PM-01–05,07 | Correctness, authority, foundational alignment |
| S2 | 33 | See Master Findings Matrix | Material comprehension/scale/alignment |
| S3 | 9 | See Master Findings Matrix | Moderate product/validation concerns |
| S4 | 3 | DF-009,049,050 | Polish/optional convenience |

## 45. Carry-Forward Matrix

| IDs | Implementation Alignment? | UX Planning? | Bug Reproduction? | Deferred Backlog? | Notes |
|---|---:|---:|---:|---:|---|
| DF-001/005/008/011/012/024–028/034/042/043/047/048/051/055 | Preserve only | No/optional | No | No | Regression safeguards |
| DF-002/019/037 | Preserve | Yes | No | No | Working but discoverability/scale context |
| DF-003/004/007/009/010/013–016/020/021/029/035/036/038–040/044/052–054 | Where capabilities/models affected | Yes | No | Some product decisions | No loss |
| DF-006/017/018 | After evidence | No | Yes | No | Targeted repro first |
| DF-022/023/041/045/046 | Yes | Yes later | No | No | Core specified gaps |
| DF-030–033 | Yes | Yes | No | Advanced guidance may defer | Semantics resolved |
| DF-049/050 | No blocker | Product UX later | No | Yes | Optional timer |
| PM-01–08 | Yes as constraints | Yes where presentation | No | No | Architecture-resolved principles |

## 46. Dependency Clusters

Analytical clusters: Work Pattern/user-day (`DF-001`–`007`, `011`–`018`); Commitment authoring/composition (`008`–`023`); Friction/choices/preferences (`024`–`036`); planning horizon/review (`037`–`040`); Capacity/Demand/Proposal (`041`, `045/046`, `PM-01`–`05`); Goals/Execution/Found Time (`042`–`050`); Summary/Progress/history (`043`, `047`, `051`–`053`, `PM-06`–`08`); profiles/backup (`054/055`); terminology/visual/accessibility (cross-cutting). These are not sequence or phases.

## 47. Product Decisions Still Open

| Findings | Decision | Constraints | Blocks Alignment? | Venue |
|---|---|---|---:|---|
| DF-013–016 | Off-day defaults/modes | Explicit policy, no silent choice | No; model can support both | Product design |
| DF-029 | Accepted Choice resolution/count shown | Immutable provenance retained | No | UX design |
| DF-035/036 | Bulk/pattern conflict interaction | Explicit scope/revalidation/no promotion | No | Product + UX |
| DF-038–040 | Default Review Scope | Independent horizons | No | Product design |
| DF-049/050 | Include native timer | Manual entry remains | No | Enhancement planning |
| DF-053 | Summary aging/default resolution | Provenance retained | No | Product + UX |
| DF-054 | Profile retain/reframe/deprecate | Separate backup/current/history | No | Product design |
| Cross-cutting | User-facing terminology | Domain meanings preserved | No | UX/content design |

## 48. Regression-Risk Findings

Preserve multiple/dated shift generation (`DF-001/002/005`), recurring authoring (`008`), Work-relative Sleep (`011/012`), Buffer mechanics (`019/021`), Friction/fix/decision/applicability (`024`–`028/034`), long-horizon deterministic generation (`037`), Goals/link/history (`042`–`044), manual execution/Progress (`047/048`), Summary basics (`051`), and Backup V6 (`055`). Later tests should protect exact user-day projection, durable identities/replay, immutable publication, correction/retraction, and backup round trips.

## 49. Legacy Concepts

| Concept | Disposition | Reason |
|---|---|---|
| Setup | Rename/adapt | Teach/Planner vocabulary supersedes monolith |
| Saved Setup Profiles | Product decision required | Alternate reality/template/scenario unclear |
| `BlockCandidate` as recommendation | Retain internally; prohibit reinterpretation | Prior-authority occurrence |
| Free time/opening | Rename/adapt | Not liability-aware Capacity |
| `HistoricalPlan` | Retain implementation, map to Published Plan | Stable ledger semantics |
| Goal Activity | Adapt | Derived history, not execution/Progress itself |
| Broad Review coupling | Migrate | Separate ranges specified |
| Accepted Choice flat list | Adapt | Historical decision view needs scalable resolution |

## 50. Reconciliation Decisions

Each row supplies Decision, Findings, Classification, Reasoning, Architecture Basis, Implementation Consequence, UX/Product Consequence, and Destination.

| ID | Decision | Findings | Class | Reasoning | Architecture Basis | Implementation Consequence | UX/Product Consequence | Destination |
|---|---|---|---|---|---|---|---|---|
| DFR-DEC-01 | Preserve resolved findings as open where unimplemented | A rows | A | Architecture ≠ implementation | AS2 synthesis | Carry contracts | Keep experienced issues | Alignment |
| DFR-DEC-02 | Capacity resolved | DF-041,PM-02/03 | A/B | First-class model specified | Capacity spec | Build read model | Expose meaningfully | Alignment |
| DFR-DEC-03 | Demand/Allocation resolved | DF-045,PM-03/05 | B/A | Bridge defined | Demand spec | Implement chain | Explain choices | Alignment |
| DFR-DEC-04 | Structure has no separate ledger gap | PM-03/05 context | A | Upstream normalization owned | Structure spec | Consume outputs | Avoid hierarchy overload | Alignment |
| DFR-DEC-05 | Composition resolved | DF-022/023 | B | Activity vs Buffer defined | Composition spec | Implement relationships | Author/discover | Alignment |
| DFR-DEC-06 | Proposal resolved | DF-046,PM-01/04/05 | B/A | Constructive lifecycle fixed | Proposal spec | New domain | Discoverable review | Alignment |
| DFR-DEC-07 | Found Time resolved | Execution descendants | A | Live context shares Proposal | Synthesis | Future detector/query | Today opportunity UX | Alignment |
| DFR-DEC-08 | Work authoring is UX-led | DF-001–004 | A/D | Core capability works | Work model | Preserve | Clarify model/recovery | UX |
| DFR-DEC-09 | Sunday anomaly needs repro | DF-006 | C | Cause unknown | User-day contract | No fix yet | Capture evidence | Bug repro |
| DFR-DEC-10 | Sleep relative placement preserved | DF-011/012 | A | Valuable behavior | Commitment model | Regression guard | Explain provenance | Alignment |
| DFR-DEC-11 | Off-day modes product decision | DF-013–016 | D | Both valid | Preference/Capacity | Support explicit policy later | Choose defaults | Product pass |
| DFR-DEC-12 | Buffer discoverability open | DF-019–021 | A/D | Capability/semantics valid | Composition | Preserve/explain | Surface common need | UX |
| DFR-DEC-13 | Attached activities align | DF-022/023 | B | No architecture gap | Composition | Implement | Design authoring | Alignment |
| DFR-DEC-14 | Separate horizons | DF-037–040 | A/D | Engine/review differ | Synthesis | Decouple inputs | Bound attention | Alignment+UX |
| DFR-DEC-15 | Bulk Friction product issue | DF-035/036 | D | Scope safety required | Decision taxonomy | No blind bulk apply | Choose interaction | Product/UX |
| DFR-DEC-16 | Recommendation kinds remain distinct | DF-025/046,PM-01 | A/B | Corrective ≠ constructive | Proposal/Friction | Separate types | Clear labels | Alignment+UX |
| DFR-DEC-17 | Choice semantics resolved | DF-027/028/030–033 | A | Choice≠preference | Synthesis | Preserve/add kinds | Explain scope | Alignment |
| DFR-DEC-18 | Choice scalability UX open | DF-029 | D | Flat history grows | History model | Query/resolution later | Filters/summary decision | UX |
| DFR-DEC-19 | Goal path discoverability open | DF-044 | D | Useful path buried | Direct action model | Preserve | Improve navigation | UX |
| DFR-DEC-20 | Goal provenance alignment open | DF-045 | B | Constructive lineage absent | Demand/Proposal | Add lineage | Display origin | Alignment |
| DFR-DEC-21 | Timer optional | DF-049/050 | F | Evidence need ≠ timer | Execution model | No blocker | Product decision | Backlog |
| DFR-DEC-22 | Profiles require product decision | DF-054 | D | Role not architecture blocker | Persistence classes | Preserve pending decision | Reframe/deprecate | Product |
| DFR-DEC-23 | Backup preserved separately | DF-055 | A | Confirmed need | Durability ADRs | Regression guard | Clear terminology | Alignment |
| DFR-DEC-24 | Weekday control polish | DF-009 | E | Functional semantics | Commitment | Preserve behavior | Visual/a11y refinement | Polish |
| DFR-DEC-25 | Summary basics preserved/loop improved | DF-051–053 | A/D | Strong base, weak scale/connection | Learn/history | Preserve/extend | Product+UX decisions | UX |
| DFR-DEC-26 | Terminology is presentation layer | Cross-cutting | D | Internal terms need not be labels | Domain map | Keep type meanings | Content system | UX |
| DFR-DEC-27 | Visual issue bounded | DF-009 | E | No semantic defect | Governance | None architectural | Polish | UX |
| DFR-DEC-28 | Accessibility cross-cuts UX | Listed D/E | D/E | Cognitive/discovery evidence | Accessibility principle | Semantic controls | Validate designs | UX |
| DFR-DEC-29 | Preserve working behavior | A working rows | A | Migration risk | Synthesis | Regression coverage later | Continuity | Alignment |
| DFR-DEC-30 | Product decisions nonblocking | §47 | D/F | Architecture constrains choices | AS2 | Parameterize seams | Resolve in design | Product/UX |
| DFR-DEC-31 | Three bug candidates only | DF-006/017/018 | C | No proof of cause | Contracts | Reproduce first | No speculative fix | Bug repro |
| DFR-DEC-32 | Timer deferred | DF-049/050 | F | Optional | Execution/Live | Manual remains | Revisit on value | Backlog |
| DFR-DEC-33 | No G findings | All | — | AS2 covers semantics | Synthesis | Proceed | No architecture detour | Alignment |
| DFR-DEC-34 | Carry ledger forward intact | All open/preserve | Mixed | Prevent loss | This reconciliation | Strategy input | UX backlog input | Next process |
| DFR-DEC-35 | Closure DFR2 | All | DFR2 | Repro affects reliable alignment | No blocker | Target bugs next | Product work remains recorded | Path B |

## 51. No-Loss Verification

Verified repository-wide Dogfood searches; all 55 `DF-*` and 8 `PM-*` IDs; zero `DFV-*`; all minor visual/workflow findings; architecture-spawned chains; current-state and corrected governance names. The Master Matrix has 63 unique rows, each with one primary disposition, severity, confidence, status, and destination. All C/D/E/F findings appear in their dedicated matrices; G is explicitly empty. Compound provenance is preserved without artificial duplication; architecture-resolved rows remain implementation-open where applicable.

### Consistency checks

All seventy required checks resolve: `SC-01` Commitment owns time/Goal does not; `SC-02` Demand requests/no ownership; `SC-03` Capacity derived/non-authoritative; `SC-04` free clock time not automatically Capacity; `SC-05` Buffer protects/no execution; `SC-06` Attached Activity executes; `SC-07` support no automatic Demand satisfaction; `SC-08` support no Progress; `SC-09` Structure no scheduling; `SC-10` Structure no Proposal; `SC-11` Proposal consumes resolved structure; `SC-12` feasibility no allocation; `SC-13` Allocation no authority; `SC-14` Proposal no authority; `SC-15` acceptance bounded authority; `SC-16` no silent recurrence; `SC-17` realized schedule owns/protects; `SC-18` Preview projects authority; `SC-19` Preview not Proposal; `SC-20` recurrence placement not Proposal; `SC-21` Published Plan immutable; `SC-22` Execution no rewrite; `SC-23` Execution no automatic Progress; `SC-24` rejection no schedule; `SC-25` ignore not reject; `SC-26` direct action no fabricated Proposal; `SC-27` Found Time no rewrite; `SC-28` Released Interval not Capacity; `SC-29` Live Capacity subtracts liabilities; `SC-30` Live Opportunity no authority; `SC-31` Live Proposal uses ordinary semantics; `SC-32` Live acceptance one-off; `SC-33` required failure not automatically free; `SC-34` Buffer release no Execution; `SC-35` post-accept conflict is Friction; `SC-36` unaccepted competition not Friction; `SC-37` No-Proposal not Friction; `SC-38` No-Proposal not necessarily error; `SC-39` SuggestedFix not Proposal; `SC-40` PlanDecision not ProposalDecision; `SC-41` CompositeDecision not Accepted Allocation; `SC-42` Choice not Preference; `SC-43` tendency not authority; `SC-44` promotion explicit; `SC-45` Commitment Priority not Goal Priority; `SC-46` Goal Priority not urgency; `SC-47` heuristics not values; `SC-48` user-day not calendar day; `SC-49` broad data not broad review; `SC-50` Proposal Horizon explicit; `SC-51` Live current time explicit; `SC-52` historical reasoning independent of mutable state; `SC-53` identities domain-specific; `SC-54` stale state cannot authorize; `SC-55` deterministic tie-breaks; `SC-56` LLM no authority; `SC-57` direct Goal schedule possible; `SC-58` spontaneous Goal execution possible; `SC-59` productive/overhead not double-counted; `SC-60` Allocation does not mutate Capacity; `SC-61` claims do not rewrite historical Capacity; `SC-62` Accepted Allocation distinct from realized schedule; `SC-63` cancellation not retroactive rejection; `SC-64` Goal link not Demand satisfaction; `SC-65` scheduled work not execution; `SC-66` execution not successful outcome; `SC-67` Summary no authority; `SC-68` guidance cannot remove higher-authority choices; `SC-69` ordinary and Live use one model; `SC-70` every authoritative concept has one owner.

## 52. Reconciliation Closure Classification

**DFR2 — Reconciled With Targeted Reproduction Needed.** The ledger is complete and no architecture blocker remains, but `DF-006`, `DF-017`, and `DF-018` require focused reproduction before their implementation-alignment treatment can be trusted. Open product/UX decisions are nonblocking and remain recorded.

## 53. Recommended Next Step

**Path B — Targeted Bug Reproduction.** Reproduce the Sunday Work alignment anomaly and self-referential Commitment acceptance/plausible-output behavior with frozen setup, user-day/timezone, generation range, and source/render provenance. Do not fix them or begin an implementation roadmap in that task.

## 54. Governance Consequences

After reproduction and alignment strategy, governance should record the corrected filenames, AS2/DFR2 outcomes, accepted post-Phase-7 specifications, supersession of stale roadmap language in `CURRENT_STATE.md`, durable decisions in `DECISIONS.md`, and milestone notes in changelog/synthesis documents. No governance file changes here.

## 55. Reconciliation Conclusions

Dogfood Pass 01 remains fully represented: working capabilities become preservation constraints; architecture questions are normatively resolved but not mislabeled implemented; five direct implementation gaps remain; three bug candidates are isolated; twenty workflow issues, one visual issue, and two optional enhancements survive; product decisions remain explicit; no architectural follow-up is required. Targeted reproduction is the only prerequisite selected before implementation alignment strategy.

## 56. Completion Statement

**Dogfood Pass 01 Findings Reconciliation complete.**

The reconciliation reconstructs and preserves the complete Dogfood Pass 01 findings ledger; evaluates every finding against DayFrame's synthesized Intended Truth, current Implemented Truth, and observed Experienced Truth; distinguishes architecture-resolved findings from implementation-alignment gaps, defect candidates, UX/workflow issues, visual/polish issues, deferred enhancements, and any bounded architectural follow-ups; preserves minor observations and regression-worthy working behavior alongside the major architectural discoveries; identifies remaining product decisions, legacy concepts, scalability and accessibility concerns, and explicit downstream destinations for every finding; verifies that no Dogfood finding was lost merely because subsequent architecture work resolved its semantics; and determines the appropriate next step toward implementation alignment without modifying implementation, creating an implementation roadmap, or assigning the work to a future implementation phase.
