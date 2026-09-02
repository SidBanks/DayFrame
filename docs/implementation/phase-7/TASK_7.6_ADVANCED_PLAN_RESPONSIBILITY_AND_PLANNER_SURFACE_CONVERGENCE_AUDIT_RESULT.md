# Task 7.6 — Advanced Plan Responsibility and Planner Surface Convergence Audit Result

## 1. Executive Result

**Outcome C — multiple workflows are canonical.** Retire Plan only by decomposing it into (1) Work Pattern for Shift Definitions, manual/repeating Work regimes and regime overrides, and (2) Commitment Library for complete/inactive/non-occurring sources and advanced intent. Authorize Work Pattern first. Month remains primary; Planning Settings global; Review specialized.

## 2. Artifact Integrity

The immutable project task matches SHA-256 `66e0bb1fa6f64916a1fe1995cb08062ffaebef25d98e557c6801046f20110b3c`. Task 7.5 result was preserved.

## 3. Task 7.5 Prerequisite Confirmation

Confirmed: Month Settings shares Goals/global Preferences/Range/Save; Plan uniquely exposes Work structure and advanced/global Commitment access; Review remains specialized. Baseline is 634,896 / 161,779 / 52,326 / 759,310.

## 4. Audit Method

Read-only inspection traced production types, UI composition, draft/save paths, validation, generation, identity, publication, lifecycle, tests, and bundle graph. Findings use Confirmed, Inferred, Not found, or Decision required.

## 5. Files Reviewed

Reviewed `SetupScreen`, `CommitmentSection`, `setupDraft`, `DayFrameApp`, Planner/Month composition; shifts/cycles/time/blocks/engine/authored validation/occurrence identity/HistoricalPlan; store/types/profile/backup/restore; relevant tests and Task 7.5 governance.

## 6. Current Planner Surface Map

Current model: Month primary routine planning; Planning Settings bounded global configuration; Plan supporting structural Work plus full/advanced Commitment setup; Review detailed resolution; Today execution; Summary history.

## 7. Current Plan Production Composition

Plan composes canonical GoalSection plus full SetupScreen. Full SetupScreen contains Commitment inventory, global Preferences/Range, Work Hours, Work Schedule, Advanced Commitment Fields, and one action bar. Task 7.5's scoped composition proves Preferences/Range can be separated.

## 8. Remaining Plan Responsibility Inventory

Unique reachability: Shift Definition CRUD; cycle CRUD and date bounds; manual segment CRUD/notes/overrides; repeating sequence anchor/day/off editing; direct complete Commitment inventory entry; advanced template/recurrence fields. Save is shared, not unique.

## 9. Responsibility Classification

Work definitions/cycles/segments/sequences are Structural + Configuration + Inventory. Commitments/templates/recurrences are Scheduling Intent + Inventory, with contextual editing in Month. Profiles/restore/clear are Lifecycle. Review owns Diagnostic behavior.

## 10. Shift Definition Semantics

Confirmed. `ShiftDefinition` is authored setup with logical/exact active identity and name, start/end, weekdays, derived crosses-midnight, optional color, timestamps. SetupDraft/SetupScreen writes it; cycles may reference one definition many times. It is not dated occurrence. Validation requires valid time, nonempty unique weekdays, and correct crossing.

## 11. Work Definition vs Work Occurrence

Authored ShiftDefinition is mutable structural input. `GeneratedCycleWorkBlock` is dated derived Preview output with work/cycle/segment identity. HistoricalPlan freezes a work occurrence snapshot/reference as immutable historical evidence.

## 12. Work Architectural Specialness

Confirmed special. Work is expanded through `generateCycleWorkBlocks` before Commitment placement, becomes occupied/anchor context, has work-specific occurrence identity/source family, and is published separately. Ordinary Commitments become candidates then placed/unplaced. Work cannot truthfully be modeled as an ordinary Commitment without redesign.

## 13. Shift Cycle Semantics

Confirmed. ShiftCycle has exact identity, name, bounded start/end, mode, manual segments or repeating sequence, optional anchor, timestamps. Cycles cannot overlap; references and containment are validated; generation selects the active dated cycle.

## 14. Repeating Sequence Semantics

Confirmed. Contiguous zero-based sequence entries repeat modulo sequence length from anchor across cycle bounds. Each entry selects a Shift Definition or `null` off day. Entry identity becomes derived Work's segment identity.

## 15. Manual Segment Semantics

Confirmed. Manual segments are inclusive dated, non-overlapping ranges inside one cycle. Each requires a Shift Definition, may carry notes, optional preference override, and dormant transitionStrategyId.

## 16. Segment Semantics

A Segment is a dated Work regime subsection within a manual ShiftCycle: it cannot exist without a parent cycle, owns a Shift Definition reference, and may own regime preferences. The user UI says Cycle Segment; code term is meaningful but product vocabulary can improve.

## 17. Manual Segment vs Repeating Cycle

They are two authoring modes for the same higher-level Work Pattern. Manual segments model explicit dated regimes and overrides; sequences model repeating shift/off rotation. They are not identical because sequence entries lack segment preference/notes/transition fields.

## 18. Segment Preference Overrides

Confirmed. Only manual `ShiftSegment.schedulePreferences` can override day boundary/week start. Resolver composes its defined fields over global defaults for the active date. Overrides have no independent authority or writer.

## 19. Global vs Regime-Specific Preferences

Decision: global preferences belong in Planning Settings; regime overrides belong in Work Pattern because their meaning and validation require the owning manual regime. Co-location by field name would sever structural context.

## 20. User-Day Boundary Ownership

Global boundary stays in Planning Settings. A manual-regime override belongs with that Work Pattern segment. Canonical `resolveEffectiveSchedulePreferences…` remains semantic owner.

## 21. Week-Start Ownership

Same decision for global and segment-specific `weekStartsOn`; no user-week semantics change.

## 22. transitionStrategyId

Confirmed dormant stored metadata. The only production reference is the optional `ShiftSegment` type field. Generic cloning/persistence preserves it, but there is no UI, specific validation, generator/Preview/Today/Summary consumer, or test. It is not executable.

## 23. Current Shift-Transition Facts

Confirmed authored facts include regime bounds, referenced shifts/times, overrides, sequence positions and null/off entries. Boundary/week deltas and adjacent window differences are derivable from canonical data. Not found: a production transition-context model, difficulty score, adaptation need, or return-to-stability calculation.

## 24. Future Transition Planning Boundary

Future transition policy would attach contextually to Work Pattern but remain a separate advisory/user-approved layer. Structural data may supply facts; it must not become recommendation authority.

## 25. Work Pattern Hypothesis

Accepted. Work definitions, cycles, both modes, off days, manual regimes, and regime overrides share one user task, SetupDraft writer, validation graph, identity relationships, generator, and future transition context. `Work Pattern` is specific and coherent.

## 26. Schedule Structure Hypothesis

Rejected as current product surface. No meaningful non-Work structural rule was found. The name would either mean Work Pattern imprecisely or invite Commitments/Goals/Events into a dumping ground.

## 27. Non-Work Structural Evidence

Sleep is template-backed intent; recurrence is intent cadence; global temporal preferences are configuration; Events are dated facts; Goals are intent authority. None provides current non-Work structural-regime evidence.

## 28. Sleep Classification

Confirmed ordinary Commitment-backed scheduling intent with category `sleep`; it uses BlockTemplate/Recurrence candidate/placement paths. No current structural Sleep regime exists.

## 29. Event Classification

Confirmed manual Event authority and dated anchored schedule input. It has no structural Work role and should remain Month/day contextual.

## 30. Commitment Inventory Audit

Plan exposes every template/recurrence summary, including disabled/non-occurring sources, common editor, removal, and advanced source fields. This is distinct from Work structure.

## 31. Month Commitment Capability

Month can Add and exact Edit/Remove a Commitment through the reused full SetupScreen/CommitmentSection. The bounded editor covers title, kind, duration, four supported recurrence modes, weekdays/count, preferred window, enabled. Occurrence navigation requires current exact source; Add incidentally exposes the inventory, but Month has no deliberate Library entry.

## 32. Advanced Commitment Fields

Plan-only advanced panel covers enabled/title/category, flexible/fixed placement, requires-work anchor, split duration, buffers, priority, preferred/custom windows, fixed time, reschedule behavior, resource flag, and all recurrence frequencies/parameters. External resource values are stored but no authoring UI was found.

## 33. Recurrence Semantics

BlockRecurrence is a separately identified/incarnated authored source linked by template logical ID. Frequencies: daily, weekly, specific weekdays, times per user-week, per shift segment, custom. Last two validate as unsupported advisories; bounded editor preserves but cannot select them.

## 34. BlockTemplate / Pattern Relationship

BlockTemplate plus one projected recurrence forms today's Commitment. It is authored scheduling intent, not a reusable multi-instantiation Pattern Library. Exact logical/incarnation identity is preserved; future Pattern Library remains separate/contextual direction.

## 35. Commitment Inventory Product Need

Confirmed need. Disabled and date-bounded/non-occurring sources cannot reliably be discovered from a Month occurrence. Users need global inspection, enable/disable, deletion, recurrence and advanced field management independent of current projection.

## 36. Disabled / Inactive Commitment Semantics

Confirmed `BlockTemplate.enabled=false` preserves the source and suppresses candidate generation. It remains listed in Plan inventory. Disabled is not deleted.

## 37. Non-Occurring Commitment Semantics

Confirmed recurrence bounds/frequency or disabled state can yield no current Month occurrence while source remains authored. Month projection is not a complete inventory.

## 38. Commitment Library Hypothesis

Accepted as a separate supporting workflow, preferably `Commitment Library`. It coherently owns all authored scheduling intent sources and advanced/source-level fields; it must reuse CommitmentSection/advanced controls and Goal link identities.

## 39. Structural vs Intent Boundary

Supported distinction: Work Pattern is structural regime input; Commitment is desired schedulable intent; Preview is derived; HistoricalPlan is evidence. Shared SetupDraft is transaction cohesion, not product cohesion.

## 40. SetupDraft Boundary

One SetupDraft contains preferences/range/work/templates/recurrences plus lifecycle provenance. Candidate workflows must share that same in-memory draft and dirty fingerprint.

## 41. Save Setup Boundary

One `saveCurrentSetup` commits the entire authored setup transaction, validates, preserves incarnations/lifecycle provenance, and stales Preview. Future workflows share it; no independent partial-save semantics are authorized.

## 42. Cross-Workflow Unsaved State

Unsaved changes persist globally across Planner modes today. Work Pattern and Commitment Library may coexist against one draft; navigation must expose one global pending state and never silently discard.

## 43. Validation Coupling

Authored validation is cross-entity: cycles reference definitions; segments must be contained/non-overlapping; sequences contiguous/reference-valid; recurrences reference templates; templates validate placement/window fields. Extraction must reuse the whole validator.

## 44. Referential Integrity

Exact active incarnations plus lifecycle transactions cover shift definitions, cycles, nested segments/sequence entries, templates, and recurrences. Goal links validate current template/recurrence availability. Decomposition cannot weaken these relationships.

## 45. Structural Deletion Semantics

Deleting a Shift Definition rewrites affected segment and sequence references in SetupScreen to another definition or empty/null; validation may block saving if no valid replacement. Deleting cycles/segments records nested lifecycle deletion.

## 46. Commitment Deletion Semantics

Commitment removal deletes the paired template and recurrence from SetupDraft and lifecycle. Goal link authority is separate and its availability semantics handle removed/recreated exact sources; no cascading Goal mutation is performed here.

## 47. Structural Entity Inactive Semantics

Not found. Shift Definitions/Cycles/Segments have no enabled/inactive flag. Absence/deletion/date bounds/off sequence entries are distinct; do not invent inactive structural state.

## 48. Planning Settings Boundary

Keep Goals/global Preferences/Planning Range/Save entry. Do not expand it with structural regimes or Commitment inventory merely to eliminate Plan.

## 49. Month Contextualization Test

Month should retain contextual edit entry for a visible Work occurrence or Commitment. It should not host complete structural/inventory management inside selected-day authority.

## 50. Supporting Workspace Test

Both Work Pattern and Commitment Library satisfy supporting-workspace criteria: coherent global user tasks, lower frequency than Month review, canonical writer reuse, and no need for equal primary tabs.

## 51. Schedule Structure Candidate Boundary

No implementation recommended because `Schedule Structure` lacks supported breadth. If ever introduced, it must be justified by real non-Work structural concepts.

## 52. Work Pattern Candidate Boundary

Work Pattern boundary: Shift Definition inventory; cycles; manual regimes; repeating rotations/off days; regime overrides; dormant metadata preservation; shared Save/status. Excludes Commitments, global Preferences, Goals, events, recommendations.

## 53. Commitment Workflow Candidate Boundary

Commitment Library boundary: complete template/recurrence inventory, common and advanced fields, inactive/non-occurring discovery, paired removal, Goal-link context, shared Save. Excludes Work structure and Pattern Library semantics.

## 54. Product Vocabulary Audit

Use Work Pattern and Commitment Library. Keep code terms Shift Definition and cycle internally. Avoid Schedule Structure until broader evidence. Do not call current templates Patterns.

## 55. Segment Language Assessment

`Segment` is accurate internally but ambiguous to users; prefer `dated work regime` or `work schedule period`, while preserving source identity/type.

## 56. Cycle Language Assessment

`Cycle` currently includes a bounded container for either manual date ranges or repeating sequence. In product copy, `Work Pattern` plus `manual date ranges`/`repeating rotation` is clearer.

## 57. Work Pattern Naming Risk

Risk: collision with future Pattern Library. Mitigate with explicit `Work Pattern` versus `Commitment Library`; do not shorten both to Pattern.

## 58. Schedule Structure Naming Risk

High risk of abstraction/dumping-ground behavior because production contains no non-Work structure.

## 59. User-Task Audit

Work Pattern answers when normally working, available shifts, rotation/off days, regime changes and overrides. Commitment Library answers what intent exists, inactive items, recurrence, advanced behavior and Goal support.

## 60. Workflow Frequency Assessment

Frequency is Inferred: Month review is routine; structural Work and library management are occasional/supporting. Code confirms access and context, not actual user frequency analytics.

## 61. Primary vs Supporting Surface Assessment

Month primary; Settings, Work Pattern and Commitment Library supporting contextual destinations; Review specialized. Supporting workflows need not be equal tabs.

## 62. Current Navigation Audit

Current Planner nav exposes Month, Plan, Review; Plan remains initial mode despite Month's primary product role. Planning Settings is a Month context, while Plan still bundles both future workflows.

## 63. Month-Default Readiness

Not yet. Product readiness is strong, but changing default before direct Work Pattern and Commitment Library entries would hide unique capability behind legacy Plan. Make Month default in the final convergence slice after both replacements pass.

## 64. Plan Retirement Criteria

Retire Plan only when all Work Pattern and Commitment Library capabilities have direct truthful entries; shared dirty/save/recovery/focus/mobile/lazy behavior passes; no unique Plan-only field or inventory remains.

## 65. Replacement vs Rename vs Decomposition

Recommendation is decomposition, not rename. Renaming Plan to Work Pattern would strand Commitments; naming it Schedule Structure would misclassify them.

## 66. Plan Navigation Fate

Keep Plan as supporting navigation during staged extraction. Remove it only after both replacement workflows are proven.

## 67. Plan Label Fate

Keep `Plan` until replacement; no rename is useful during the temporary mixed responsibility.

## 68. Commitment Inventory Fate

Create a supporting Commitment Library after Work Pattern. Preserve Month contextual common editing and exact navigation.

## 69. Segment Override Fate

Keep manual segment overrides inside Work Pattern beside their owning regime; global values remain Settings.

## 70. Transition Strategy Fate

Preserve dormant metadata through extraction; do not expose or execute it. Re-audit only when transition policy is separately authorized.

## 71. Future Transition Capability Map

Work Pattern can later expose exact regime-change facts to an advisory layer. No new policy, authority, or recommendation is part of extraction.

## 72. Future Sleep-Transition Fit

Future Sleep-transition advice consumes structural facts plus separate policy; Sleep remains Commitment intent and user-approved changes remain outside Work Pattern authority.

## 73. Future Goal-Reorientation Fit

Future temporary Goal/Commitment reorientation is advisory and user-approved through existing authorities, never structural mutation.

## 74. Pattern Library Relationship

Commitment Library is authored-source management, not Pattern Library. Future reusable patterns may inform creation contextually but require separate semantics.

## 75. Review Boundary

Review retains friction diagnostics, Try/Apply, accepted choices and Visualizer; it does not absorb structure.

## 76. Today Boundary

Today remains current-plan/execution oriented and does not author global structure.

## 77. Summary Boundary

Summary remains historical interpretation and does not author structure.

## 78. Profiles Boundary

Profiles remain shell lifecycle snapshots of authored state, not Work Pattern or Library responsibility.

## 79. Backup / Restore Boundary

Backup/restore remains persistence/lifecycle support and already carries these sources.

## 80. Full-Clear Boundary

Full clear remains shell lifecycle and reprojects the shared draft.

## 81. Persistence Boundary

No persistence/Backup/state-schema change is required for surface decomposition.

## 82. Canonical Writer Map

Writers: SetupScreen/CommitmentSection mutate one SetupDraft; DayFrameApp commits one transaction; GoalSection writes independent Goal authority; engine generates Preview; store lifecycle replaces authored setup.

## 83. Authority Map

Authorities: durable authored setup owns shifts/cycles/templates/recurrences/preferences/range; Goal authority owns Goals/links; Event owns manual events; Preview derived; HistoricalPlan/Execution history immutable ledgers.

## 84. Validation Map

Reuse `validateDayFrameAuthoredSetup`, `validateBlockTemplate`, shift-cycle validation, editor validation, and transaction admission. Do not fork per surface.

## 85. Referential-Integrity Map

Preserve logical/incarnation identities, parent IDs for nested lifecycle entries, cycle-definition and recurrence-template references, and Goal link availability.

## 86. Delete / Replacement Map

Profile/restore/clear replace and reproject the shared draft. Deletion operations remain explicit; recreated logical IDs receive new incarnations and must not retarget stale context.

## 87. Lazy Ownership Audit

Plan/Settings implementation is the existing 52,326-byte lazy SetupScreen chunk; Month is 25,780 lazy; GoalSection/application authority remains eager. Extraction should create bounded lazy Work Pattern and Commitment Library modules or split SetupScreen without moving forms eager.

## 88. Bundle Baseline

Task 7.5 baseline reproduced byte-for-byte: 634,896 initial raw, 161,779 initial gzip,
52,326 largest lazy, and 759,310 total JS. Audit delta is zero.

## 89. Candidate Bundle Architecture

Future slices should preserve one lazy advanced-authoring ownership graph. Shared low-level section code may be factored, but writers/validation remain singular. Avoid duplicate full SetupScreen rendering.

## 90. Schedule Structure Assessment

Rejected: broad term unsupported and Commitment misclassification unavoidable.

## 91. Work Pattern Assessment

Accepted for structural Work responsibilities.

## 92. Multiple-Workflow Assessment

Accepted overall architecture: Work Pattern + Commitment Library are the smallest coherent workflows.

## 93. Preserve-Plan Assessment

Rejected as mature architecture; acceptable only temporarily during migration.

## 94. Navigation Model Comparison

Best model: Month primary; contextual Planning Settings, Work Pattern and Commitment Library supporting; Detailed Review specialized. Today/Summary remain top-level product surfaces.

## 95. Recommended Product Architecture

Recommended mature Planner: Month; supporting Planning Settings, Work Pattern, Commitment Library; Detailed Review. Plan disappears after staged proof, and Month becomes default at final navigation convergence.

## 96. Implementation Coupling Audit

Current UI sections share a large component and SetupDraft, but section boundaries are mechanically separable. Cross-field validation/save/lifecycle are shared services, not justification for one product surface.

## 97. Recommended Implementation Slices

1. Task 7.7 extract lazy Work Pattern using existing Work Hours/Work Schedule controls and shared draft/save. 2. Extract Commitment Library with common+advanced controls. 3. Converge navigation, make Month default, retire Plan after zero-responsibility audit.

## 98. Bundle Impact Assessment

Audit adds no production bytes. Future extraction should keep both supporting workflows lazy and perform governed attribution.

## 99. Authority Impact Assessment

No new authority is needed; use authored setup, Goal authority, Event authority, Preview, and ledgers unchanged.

## 100. Persistence Impact Assessment

No schema, Backup, restore, profile, or database change is needed for surface extraction.

## 101. Product-Boundary Assessment

All non-goals preserved. Work Pattern must not become Recommendation authority; Commitment Library must not become Pattern Library.

## 102. Architectural Invariant Assessment

All 130 invariants are Confirmed, Preserved, Inferred where frequency/future fit is discussed, Deferred, Prohibited, or Not applicable. No blocked invariant remains.

## 103. Stop-Condition Assessment

No stop condition fired. Semantics, writers, identity, referential integrity, inventory need, and bounded decomposition are sufficiently precise. Plan still owns unique behavior today, so immediate retirement remains stopped.

## 104. ADR Determination

No ADR. This audit selects product surface decomposition without changing authority, persistence, temporal, save, or scheduling rules.

## 105. Validation

Focused validation passed 8 files/71 tests. Lint, typecheck, full 94 files/973
tests, production build (116 modules), bundle check, and `git diff --check` passed.
Initial gzip retains its existing warning; all hard/review thresholds remain green.

## 106. Governance Updates

Governance records the recommendation without claiming implementation.

## 107. Deviations

None. No production or test implementation was authorized or performed. Browser QA
was not required. Write-formatting was omitted because this read-only audit forbids
production/test mutation and lint/typecheck already validate source formatting quality.

## 108. Discoveries

Key discovery: Month's reused contextual SetupScreen technically exposes the full Commitment list after entry, but this is incidental composition, not a deliberate discoverable global inventory. Another: sequence entries currently cannot own regime overrides.

## 109. Deferred Work

Deferred: Work Pattern extraction; Commitment Library extraction; final Month-default/navigation/Plan retirement; any transition advisory policy; Pattern Library.

## 110. Plan Responsibility Matrix

| Responsibility | Product class | Authority/writer | Contextual equivalent? | Natural home |
| --- | --- | --- | ---: | --- |
| Shift Definitions | structural inventory | authored setup/SetupDraft | Work entry | Work Pattern |
| Work schedule/cycles | structural | authored setup/SetupDraft | entry only | Work Pattern |
| manual segments | structural regime | authored setup/SetupDraft | entry only | Work Pattern |
| repeating sequence/off days | structural rotation | authored setup/SetupDraft | entry only | Work Pattern |
| segment boundary/week override | regime configuration | segment/SetupDraft | entry only | Work Pattern |
| Commitment inventory | intent inventory | template+recurrence/SetupDraft | incidental | Commitment Library |
| advanced Commitment fields | intent/configuration | template+recurrence/SetupDraft | No direct entry | Commitment Library |
| recurrence/template management | intent/inventory | authored setup/SetupDraft | common fields | Commitment Library |
| Save Setup | transaction | existing app action | Yes | shared |

## 111. Candidate Decision Matrix

| Criterion | Schedule Structure | Work Pattern | Multiple Workflows | Preserve Plan |
| --- | --- | --- | --- | --- |
| coherent task/domain | weak/broad | strong for Work | strongest overall | mixed legacy |
| writer/authority cohesion | shared only | strong | strong via shared transaction | strong technically |
| avoids dumping ground | No | Yes | Yes | No |
| regime override/transition fit | adequate | strongest | strongest | adequate |
| Commitment fit | poor | excluded correctly | strong separate workflow | bundled |
| naming clarity/Pattern risk | abstract | clear with qualifier | clear | vague |
| feasibility/retirement | feasible but wrong | bounded | staged and complete | no convergence |
| Decision | Reject | Accept slice | **Accept architecture** | temporary only |

## 112. Structural-vs-Intent Matrix

| Entity | Structural | Intent | Derived | Historical | Class |
| --- | ---: | ---: | ---: | ---: | --- |
| ShiftDefinition/ShiftCycle/manual segment/override | Yes | No | No | No | Work Pattern |
| Commitment/recurrence/BlockTemplate | No | Yes | No | No | Commitment Library |
| Goal | No | authored outcome | No | No | Goal authority/Settings |
| Manual Event | No | anchored fact | scheduled input | No | day/Event workflow |
| generated Work/Preview block | No | No | Yes | No | Preview |
| HistoricalPlan occurrence | No | No | No | Yes | historical evidence |

## 113. Transition-Readiness Matrix

| Capability | Evidence sufficient? | Future policy? | Layer |
| --- | ---: | ---: | --- |
| identify regime/change/work windows | Yes from authored data | No | Work Pattern facts |
| boundary/week delta | Yes derivable | No | canonical temporal projection |
| off transition days/cycle position | Yes | No | Work Pattern facts |
| transition day duration | Yes canonically derivable | No | temporal projection |
| temporary Sleep/reduced load | No | Yes | future advisory |
| Goal/Commitment reorientation | links only | Yes | future advisory + user approval |
| return to stable regime | raw bounds exist; model absent | likely | future transition context |

## 114. Commitment Capability Matrix

| Capability | Month contextual | Plan | Inventory needed? | Mature home |
| --- | ---: | ---: | ---: | --- |
| create/edit/remove | Yes | Yes | Yes for discovery | Month + Library |
| enable/disable/common recurrence | Yes | Yes | Yes | Library, contextual edit retained |
| advanced fields/all recurrence | No direct advanced entry | Yes | Yes | Commitment Library |
| Goal linkage | Settings Goal UI | Yes through Goals | global context useful | Goal UI + Library context |
| inactive/non-occurring/all sources | incidental after Add | Yes | **Yes** | Commitment Library |

## 115. Work Capability Matrix

| Capability | Month Work | Plan | Work Pattern | Global context? |
| --- | ---: | ---: | ---: | ---: |
| inspect current occurrence | Yes | derived context | contextual entry | No |
| Shift Definition CRUD | entry to full editor | Yes | Yes | Yes |
| schedule/manual/repeating/off days | entry only | Yes | Yes | Yes |
| regime override | entry only | Yes | Yes | Yes |
| transition metadata | preserved only | no UI | preserve only | Yes |

## 116. Preference-Ownership Matrix

| Preference | Global home | Override owner | Structural context? | Mature home |
| --- | --- | --- | ---: | --- |
| day boundary | Planning Settings | manual segment | Yes for override | Settings + Work Pattern |
| week start | Planning Settings | manual segment | Yes for override | Settings + Work Pattern |
| sequence overrides | none | not supported | N/A | Not found |
| other overrides | none | none | N/A | Not found |

## 117. Vocabulary Matrix

| Concept | Code | Current UI | Future term | Risk |
| --- | --- | --- | --- | --- |
| Work definition | ShiftDefinition | Shift Definition | Shift | definition vs occurrence |
| repeating sequence | sequence | Repeating sequence | Rotation | bounded dates still matter |
| manual regime | ShiftSegment | Cycle Segment | Dated work regime | Segment ambiguous |
| container | ShiftCycle | Shift Cycle | Work Pattern | cycle also manual mode |
| structural workspace | SetupScreen/Plan | Plan | Work Pattern | avoid Pattern Library collision |
| intent inventory | templates/recurrences | Commitments | Commitment Library | not reusable Pattern Library |
| reusable pattern | not found | none | Pattern Library | future semantics absent |

## 118. User-Task Matrix

| User question | Current | Context | Future |
| --- | --- | --- | --- |
| when/shifts/rotation/off/regime/override? | Plan Work sections | global structural | Work Pattern |
| what/inactive Commitments? | Plan inventory | global intent | Commitment Library |
| how often/advanced behavior? | Plan editors | source | Commitment Library |
| which Goal supports it? | Goals | Goal + exact source | Goals/Library context |
| what happens this month? | Month | spatial | Month |
| why did it not fit? | Review | derived diagnostic | Review |

## 119. Writer/Authority Matrix

| Responsibility | Authority | Writer | Draft? | New authority/writer? |
| --- | --- | --- | ---: | ---: |
| shifts/cycles/segments/sequence/overrides | authored setup | SetupScreen setDraft | Yes | No |
| Commitment/template/recurrence | authored setup | CommitmentSection/SetupScreen | Yes | No |
| Goal | Goal authority | GoalSection/store | No | No |
| Preview | derived | generator | No | No |

## 120. Surface Responsibility Matrix

| Responsibility | Month | Settings | Work Pattern | Commitment Library | Review |
| --- | ---: | ---: | ---: | ---: | ---: |
| routine review/contextual edit | Yes | No | entry | entry | detailed |
| Goals/global prefs/range | entry | Yes | No | link context | No |
| Work structure/regime override | entry | No | Yes | No | derived |
| Commitment inventory/recurrence | source context | No | No | Yes | derived |
| friction/Try/Apply/Visualizer | entry/limited | No | No | No | Yes |

## 121. Navigation Matrix

| Model | Primary | Supporting | Specialized | Plan fate | Assessment |
| --- | --- | --- | --- | --- | --- |
| Current | mixed/default Plan | Settings + Plan | Review | retained | transitional |
| Month + Structure | Month | Settings + Structure | Review | replaced | too broad |
| Month + Work + Library | Month | Settings + both | Review | decomposed | **recommended** |
| Month contextual only | Month | contextual modes | Review | removed | inventory discoverability risk |
| Preserve Plan | Month in principle | Settings + Plan | Review | retained | coherent only temporarily |

## 122. Bundle Matrix

| Metric | 7.5 baseline | 7.6 final | Delta |
| --- | ---: | ---: | ---: |
| Initial raw | 634,896 | 634,896 | 0 |
| Initial gzip | 161,779 | 161,779 | 0 |
| Largest lazy | 52,326 | 52,326 | 0 |
| Total JS | 759,310 | 759,310 | 0 |

## 123. Product-Boundary Matrix

| Capability | Month | Settings | Work Pattern | Library | Review |
| --- | ---: | ---: | ---: | ---: | ---: |
| Month review/context sources | Yes | No | structural entry | intent entry | detailed |
| Goals/global prefs | entry | Yes | No | links | No |
| Work definitions/rotations/overrides | entry | No | Yes | No | derived |
| full Commitment inventory | contextual | No | No | Yes | No |
| resolution/Try/Apply/Visualizer | entry/limited | No | No | No | Yes |

## 124. Epistemic Matrix

| Evidence | May represent | Must not infer |
| --- | --- | --- |
| Shift Definition | authored Work rule | performed Work |
| sequence/manual segment | Work structure/dated regime | transition difficulty |
| boundary/week delta | exact temporal change | Sleep/productivity advice |
| off entry | no Work assignment | free capacity |
| Commitment/disabled/no occurrence | authored (possibly inactive/unprojected) intent | completion/deletion |
| Month occurrence | current evidence | full inventory |
| transitionStrategyId | stored dormant metadata | executable strategy |
| Plan-only UI | current access | mature natural home |

## 125. Task 7.7 Readiness

**Outcome C — Multiple Workflows Are Canonical.** The boundary is precise enough to authorize Work Pattern as the first extraction.

## 126. Recommended Next Task

**Task 7.7 — Work Pattern Workspace Extraction and Advanced Work Configuration Migration.**

## 127. Final Audit Determination

Task 7.6 complete as a read-only audit. Plan should be decomposed, not renamed: Work Pattern owns structural Work/regime overrides; Commitment Library owns complete advanced scheduling intent; Plan remains until both replacements pass, then Month can become default and Plan can retire.
