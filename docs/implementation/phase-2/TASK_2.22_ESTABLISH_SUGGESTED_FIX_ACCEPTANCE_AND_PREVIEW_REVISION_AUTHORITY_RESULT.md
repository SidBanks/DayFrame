# Task 2.22 — Suggested-Fix Acceptance and Preview-Revision Authority — Result

## 1. Executive Determination

**Completed — architectural decision only.** `SuggestedFix` remains advisory derived information. Today, `moveBlock`, `skipBlock`, `reduceDuration`, `convertToRecovery`, `changePriority`, and `acceptConflict` create fresh-Preview-only experiments; regeneration/reload discards them. `changeFixedTime` is not acceptance or revision: it hands the user to an authored template edit. `addResource` is only a dormant type member; it is neither generated nor supported, so its future authority is unresolved.

**Recommended:** the six automatic changes and `acceptConflict` express occurrence/conflict-specific choices strongly enough that, if “acceptance” is intended to survive regeneration, each must create separate PlanDecision-like authored authority rather than mutate a derived suggestion or source-wide template. Do not introduce a session-only decision model. First establish PlanDecision semantics; then solve source incarnation before durability. Until then, retain the current behavior as explicitly ephemeral experimentation and clarify the UI.

## 2. Artifact Integrity

**Confirmed.** The supplied artifact was complete: 44,129 bytes / 1,855 lines, SHA-256 `9f88fa148e0079da176d0228115db80d6eb6ab7aedf4f2d95d0e375170e5ccab`. The saved copy contained identical text plus one trailing newline: 44,130 bytes / 1,856 lines, SHA-256 `bfaf5ef497531b58b4c9a52138bcc6bb43d16f45bfef3237c1bcbecddda91038`. Neither immutable artifact was changed.

## 3. Evidence Reviewed

**Confirmed:** friction types/detection; `generateSuggestedFixes`; `applySuggestedFix`; `generateSchedulePreview`; `reviseSchedulePreview`; store revision, clone, generation and persistence paths; occurrence identity and block/work types; `PreviewScreen`; `DayFrameApp`; generator/application/revision/store/UI tests; Tasks 2.1, 2.5, 2.10–2.15; architecture rules for authored/derived categories, Author/Derive transformations, Plan ownership, services, provenance, and determinism.

## 4. Current Suggested-Fix Inventory

| Suggested Fix Type | Generator | User-Facing Action | Application Path | Current Authority Effect |
| --- | --- | --- | --- | --- |
| `moveBlock` | friction detector + generator refinement | Move block | UI → store → revise → apply | Preview placement only |
| `skipBlock` | detector/generator | Skip block | same | marks scheduled occurrence skipped or removes unplaced candidate |
| `reduceDuration` | detector/generator | Reduce duration | same | shortens scheduled occurrence 30 minutes, min 15 |
| `convertToRecovery` | generator | Convert to recovery | same | changes occurrence/candidate title/category only |
| `changePriority` | detector/generator | Change priority | same | increments scheduled occurrence priority, max 5 |
| `acceptConflict` | detector/generator | Accept conflict | same | marks one friction point ignored/resolved |
| `changeFixedTime` | detector/generator | Review fixed time | UI branches to Setup | navigation/focus only; no Preview/authored mutation on click |
| `addResource` | **Not found** in production generators | none | `applySuggestedFix` throws unsupported | dormant/unsupported; authority unresolved |

## 5. Current End-to-End Suggested-Fix Flow

**Confirmed:** generated work/candidates/placements → friction detection → suggested-fix generation → buttons rendered in repeated/day friction groups → fresh-only UI handler → `changeFixedTime` branches to Setup, all others call store → store rejects stale Preview or calls `reviseSchedulePreview` → `applySuggestedFix` clones/transforms Preview arrays → friction and fixes recomputed → store replaces only `preview.result`, adds `revisedAt` when revised and optional `actionFeedback` → subscribers receive derived snapshot. Regeneration calls `generateSchedulePreview` solely from authored state/generation inputs, so revisions disappear. Preview is not durable, so reload discards it.

## 6. Fix-Type Current Classification

- **Confirmed Preview-only mutation:** move, skip, reduce, convert, priority, accept conflict.
- **Confirmed authored-edit navigation:** change fixed time.
- **Confirmed unsupported:** add resource.
- **Not found:** any fix directly mutating authored state, work blocks, manual events, persistence, or decision history.

## 7. `changeFixedTime` Authority

**Confirmed.** `DayFrameApp` locates the affected fixed template, opens Setup, expands/focuses the fixed-time field, and returns before store revision. Pressing “Review fixed time” carries no durable authority. Only a later explicit Setup save performs an Author-like authored mutation; Preview becomes stale and must regenerate. This is a recommendation to review/change pattern-wide authored intent, not an accepted planning revision.

## 8. Preview-Only Fix Types

**Confirmed.** Automatic targets are template-derived scheduled blocks or candidates; work and manual blocks serve as anchors/conflict context and are excluded as adjustment targets. The revision keeps original template/recurrence/manual/shift sources unchanged. Occurrence identity is cloned where present. Only current Preview arrays/friction metadata change; no decision record is retained.

## 9. Current Regeneration Behavior

**Confirmed by code structure, inferred for the exact post-fix sequence; direct regression test not found.** Regeneration does not consume revised Preview or accepted actions. Equivalent authored inputs and generation conditions rebuild original placement/duration/category/priority/status/friction, not P′. Reload has no Preview because active/profile/backup persistence excludes it.

## 10. Regeneration Matrix

| Fix Type | Revised Preview Changes | Regeneration Preserves Choice? | Reload Preserves Choice? | Authored State Changed? |
| --- | --- | ---: | ---: | ---: |
| moveBlock | occurrence time/status or candidate placement | no | no | no |
| skipBlock | skipped status/removes candidate | no | no | no |
| reduceDuration | occurrence end time | no | no | no |
| convertToRecovery | occurrence/candidate category/title | no | no | no |
| changePriority | occurrence priority | no | no | no |
| acceptConflict | friction ignored/resolved | no | no | no |
| changeFixedTime | none on click; opens authored editor | n/a until authored save | only authored save survives | no on click |
| addResource | throws/no revision | n/a | n/a | no |

## 11. Deterministic Regeneration Assessment

**Partially aligned today.** Authoritative authored inputs still deterministically reconstruct P; revised P′ cannot be reconstructed because acceptance is not authority. This is consistent only if P′ is explicitly disposable experimentation. It conflicts with a user expectation that “Accept conflict,” “Move,” or “Skip” records a lasting choice.

## 12. Current User-Intent Evidence

**Confirmed:** labels are imperative (“Move,” “Skip,” “Reduce,” “Convert,” “Change,” “Accept”), not “Try.” `acceptConflict` explicitly signals acceptance. **Inferred:** users likely understand these as choices about the displayed occurrence/conflict, not changes to every recurrence. **Unresolved:** hard versus soft decision strength, exact persistence expectation, and whether every action should endure restart.

## 13. Instance Versus Pattern Scope

Current fix IDs target block IDs within one Preview/friction; mutations change one scheduled occurrence/candidate or one friction point. No generator supplies recurrence-wide/range-wide parameters. `changeFixedTime` alone deliberately hands off to a source-template field and is pattern/source-wide if the later edit is saved.

## 14. Intent-Scope Matrix

| Fix Type | Occurrence-Specific | Pattern-Specific | Source-Wide | Ambiguous |
| --- | ---: | ---: | ---: | ---: |
| moveBlock | yes | no | no | target time strength unresolved |
| skipBlock | yes | no | no | no |
| reduceDuration | yes | no | no | exact/soft strength unresolved |
| convertToRecovery | yes | no | no | semantic meaning partially ambiguous |
| changePriority | yes | no | no | priority meaning/strength unresolved |
| acceptConflict | conflict-instance-specific | no | no | replay conflict identity unresolved |
| changeFixedTime | no on click | yes after authored edit | template-wide | no |
| addResource | unresolved | unresolved | unresolved | yes |

## 15. Ephemeral Preview Model

**Accepted as the truthful current/interim model.** It preserves authored authority and supports non-destructive exploration, but must be communicated as temporary. Current labels/copy do not adequately explain regeneration/reload loss, making it useful but potentially misleading.

## 16. Authored Mutation Model

**Rejected for automatic fixes.** Existing authored objects lack occurrence exceptions; changing template duration/category/priority or recurrence behavior would affect future occurrences and exceed the displayed local choice. It is correct only for `changeFixedTime` after explicit authored review/save.

## 17. Authored Occurrence-Override Model

**Plausible but not adopted.** An authored exception could express a single occurrence and would effectively be a new authoritative object in `DayFrameAuthoredSetup`. Its semantics overlap the proposed PlanDecision; object category, strength, invalidation and persistence need definition before choosing terminology/location.

## 18. PlanDecision Model

**Recommended for investigation.** Acceptance should Author a separate object identifying semantic occurrence/conflict, action/outcome, provenance, authored lineage/dependencies, strength, and replay/invalidation policy. It must not mutate `SuggestedFix`. Full schema is intentionally deferred.

## 19. Replayable Command Model

**Rejected as the authority model; possible implementation technique only.** Raw command order can change placements, stale targets may disappear, and replay lacks declared decision strength/invalidation. A command requires the same semantics as PlanDecision and is not meaningfully simpler.

## 20. Authority Model Matrix

| Model | Survives Regeneration | Survives Restart | Alters Authored Intent | Occurrence-Specific | Requires New Domain Object | Explainable | Recommendation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| ephemeral Preview experiment | no | no | no | yes | no | only with clear copy | current interim |
| direct authored mutation | yes | yes | yes | generally no | no | yes | fixed-time handoff only |
| authored occurrence override | yes | if persisted | yes | yes | yes | yes | candidate, defer |
| PlanDecision | yes | if persisted | yes, separately | yes | yes | strongest | investigate/adopt conceptually |
| replayable command | yes | if persisted | implicitly | yes | effectively yes | weak without policy | implementation detail only |

## 21. Per-Fix Authority Matrix

| Fix Type | Current Behavior | User Intent Scope | Should Survive Regeneration? | Proposed Authority Class | Rationale |
| --- | --- | --- | ---: | --- | --- |
| moveBlock | Preview move/place | one occurrence | yes if accepted | PlanDecision-like placement | broad template edit is wrong |
| skipBlock | Preview skip/drop | one occurrence | yes if accepted | PlanDecision-like omission | not recurrence deletion |
| reduceDuration | Preview shorten | one occurrence | yes if accepted | PlanDecision-like occurrence adjustment | not template duration mutation |
| convertToRecovery | Preview category/title change | one occurrence | yes if accepted | PlanDecision-like substitution | pattern intent unchanged |
| changePriority | Preview priority increment | one occurrence | yes if accepted | PlanDecision-like planning preference | not source-wide priority edit |
| acceptConflict | ignored/resolved friction | one occurrence pair/conflict | yes if accepted | PlanDecision-like conflict acceptance | strongest acceptance evidence |
| changeFixedTime | Setup handoff | source pattern after later save | authored save already survives | existing authored mutation | click itself no authority |
| addResource | unsupported | unresolved | unresolved | unresolved | no executable semantics |

## 22. Move Semantics

Current move chooses the first feasible same-user-day gap after the block (or first gap for an unplaced candidate), marks it rescheduled, and preserves occurrence identity. **Recommended:** enduring acceptance represents this occurrence's selected/exact placement outcome, not future template preference. Whether exact placement is hard or revalidated is unresolved.

## 23. Skip Semantics

Current skip marks a scheduled occurrence `skipped` or removes one unplaced candidate. **Recommended:** enduring meaning is “omit this occurrence from this plan,” never “delete the recurring commitment.”

## 24. Manual-Event Fix Semantics

**Confirmed.** Manual events may participate in conflicts but generator selects the other flexible template for move/reduce. There is no direct manual-event fix. `acceptConflict` may accept a conflict involving manual-event projection without altering the event. A future conflict decision needs identities for both sides; direct movement of manual events would require authored edit semantics and is not currently supported.

## 25. Work Fix Semantics

**Confirmed.** Work blocks are locked anchors and are never directly moved/skipped/shortened by current generated fixes. Flexible template occurrences may adjust around them; fixed conflicts route to fixed-time authored review or accept conflict. Any future work-movement fix would imply shift/cycle authoring and requires separate authority.

## 26. Template / Recurrence Fix Semantics

This is the central PlanDecision case. Automatic actions target one generated template occurrence/candidate while the template and recurrence remain unchanged. Translating them into source mutation would silently broaden scope.

## 27. Suggested-Fix Provenance

`SuggestedFix` holds ID, label, action and optional primitive parameters. Target identity is usually encoded in string ID and resolved through `FrictionPoint.affectedBlockIds`; it has no occurrence identity, generation timestamp, authored revision, producer/provenance record, selected outcome strength, or durable revalidation facts. **Confirmed:** sufficient for current display/application; **insufficient** as durable authority.

## 28. OccurrenceIdentity Coverage

Template candidates/scheduled blocks, work blocks and manual projections can carry V1 identities; revision clones them and candidate placement transfers identity. Fix objects have no direct identity. Target identity is indirect through affected block lookup. `acceptConflict` may need two identities. `addResource` has none because no path exists.

## 29. V1 Identity Session Adequacy

**Confirmed/recommended.** V1 is stable across overlapping windows and adequate to address an occurrence within the current active source lineage/session, subject to fresh Preview and semantic target resolution. It could support session replay technically.

## 30. V1 Identity Durable Limitation

**Confirmed.** V1 is explicitly not a durable foreign key: source IDs can be deleted/recreated or restored across lifetimes. It cannot safely anchor restart-surviving decisions.

## 31. Source-Incarnation Dependency

Durable occurrence-specific decisions require lifetime-safe source identity. Without incarnation, a decision can incorrectly attach to a newly created/restored source reusing template/recurrence/manual/shift IDs. Source incarnation is therefore a blocker for durable PlanDecision persistence, but not for defining its semantics.

## 32. Authored-Lineage / Revision Dependency

Freshness protects only the original click. Replay after authored change requires dependency evidence: source/occurrence identity plus authored revision or semantic fingerprint and revalidation. Template duration, recurrence dates/frequency, scheduling preference, shift cycle, and manual-event edits can invalidate feasibility or meaning.

## 33. Generation-Window Semantics

**Recommended:** an occurrence-specific decision follows the semantic occurrence whenever it appears in same, overlapping, larger, or smaller windows. It must not be scoped merely to the UI range. If the occurrence is outside a window, the decision is dormant, not applied.

## 34. Regeneration Scope

Same-occurrence decisions should replay across equivalent regeneration/ranges. Cycle or recurrence recalculation that eliminates or changes the occurrence requires revalidation. Exact generation-only behavior is ephemeral Preview, not PlanDecision.

## 35. Decision Invalidation Requirements

Prerequisites: define behavior for deleted/reincarnated source, nonexistent occurrence, changed duration/category/anchor, changed recurrence/time boundary, infeasible placement, and edited manual/work counterpart. Prefer observable stale/unresolved decision or friction over silent misapplication/deletion; exact states are deferred.

## 36. Decision Conflict / Ordering

Conflict/replacement policy is prerequisite. Multiple decisions for one occurrence need explicit replace/compose/conflict semantics. Cross-occurrence placement can be order-dependent; deterministic decision ordering and engine reconciliation are required. “Latest wins” cannot be assumed from timestamps.

## 37. SuggestedFix Versus Accepted Decision

**Adopted:** SuggestedFix is a derived Recommendation Proposal. Acceptance is a separate Author transformation producing new authoritative planning information. Recommendation does not change category or become authoritative in place.

## 38. Domain Object Category Assessment

A durable/replayable accepted choice must be a new Authored Named Domain Object (working name PlanDecision/occurrence override), while SuggestedFix stays Derived. The canonical name and whether “PlanDecision” already fits governance are **unresolved** pending dedicated semantics.

## 39. Transformation / Pillar / Service Implications

Acceptance is **Author**, not Derive or Record. Architecture assigns Author transformations to Teach, while Plan owns deterministic derivation; thus a future Authoring Service must produce the decision and Plan derivation must consume it. This cross-pillar workflow is evidence-supported; the exact service name/producer is deferred. A decision is not historical execution.

## 40. `reviseSchedulePreview` Architectural Assessment

Legitimate derived-state experimentation engine today. It coordinates a derived change then recomputes friction/fixes deterministically. It is not an authority service. Future options are retain as “Try,” or make a separate planning path apply authored decisions during generation; it should not remain the only “Accept” implementation.

## 41. `applySuggestedFix` Architectural Assessment

Contains derived transformation logic for block arrays/friction: move, skip, shorten, recategorize, reprioritize and ignore conflict. This is legitimate for ephemeral Preview. If used to enact authority, equivalent logic must be governed by decision semantics/revalidation rather than treating a click as unrecorded mutation.

## 42. `actionFeedback` Assessment

**Confirmed.** It is single-message derived workflow metadata. It carries no action ID, occurrence, ordering, provenance or reconstruction data and is excluded from durable state. It is not authority/history.

## 43. Revision History Requirement

**Not found:** ordered or durable history after Tasks 2.2–2.21. Future authority needs the current effective decision set and provenance, not necessarily an append-only command/audit history. Full history is not a prerequisite; audit/history may be a later concern.

## 44. Undo Requirement

Minimum prerequisite is remove/replace an effective decision and regenerate without/with its replacement. An undo stack is not architecturally required before PlanDecision. UI undo/history is deferred.

## 45. Persistence Matrix

| Authority Class | Session | Regeneration | Restart | Profiles | Backup |
| --- | ---: | ---: | ---: | ---: | ---: |
| ephemeral Preview | current Preview only | no | no | no | no |
| authored mutation | yes | yes | yes via authored persistence | yes | yes |
| authored occurrence override | yes | yes | recommended eventually | unresolved policy | unresolved/versioned |
| PlanDecision | yes | yes | recommended eventually after incarnation | recommend separate from setup profiles unless explicitly selected | requires explicit new/versioned scope |

## 46. Profile Semantics

**Confirmed current:** profiles contain only `DayFrameAuthoredSetup`. **Recommended:** do not silently add plan decisions. Profiles describe reusable authored setup/patterns; occurrence-date decisions are active-plan data. Whether a future “plan snapshot” includes them needs explicit product/format design.

## 47. Backup Semantics

Current backups contain authored setup only and exclude Preview/revisions. A durable decision surface would need explicit export/version semantics; do not silently extend V1 backup. Existing artifacts require no migration for revisions.

## 48. Active Persistence Semantics

If PlanDecision becomes durable, it is authoritative active planning data. Storage location is unresolved: extending active authored state versus separate durable plan surface has format/durability consequences. Choose only after object/lifecycle semantics.

## 49. Session-Only Versus Durable Staging

**Recommended:** keep existing revisions explicitly ephemeral until PlanDecision semantics and durable identity are ready. Reject a temporary session-only PlanDecision: although V1 can address session occurrences, a second authority model creates migration/expectation debt and still requires conflict/invalidation design.

## 50. Staging Matrix

| Staging Model | Immediate UX Value | Architectural Debt | Requires Incarnation Now | Persistence Change | Recommendation |
| --- | ---: | ---: | ---: | ---: | --- |
| keep ephemeral until durable model ready | moderate | low; copy mismatch only | no | no | adopt interim |
| session-only PlanDecision first | high | high transition/expectation debt | no | no | reject |
| durable PlanDecision directly | highest | lowest long-term, more prerequisites | yes before persistence | yes | target after semantics/incarnation |

## 51. UI Language Audit

**Confirmed:** labels imply action/acceptance and buttons do not say Preview-only or Try. `Review fixed time` correctly signals handoff. Feedback is mainly warnings/info when no safe change; successful revisions have no persistence explanation. Current language therefore overstates endurance for automatic fixes.

## 52. Preview Persistence Communication

**Not found.** The UI does not explain that revised choices vanish on regeneration/reload. If ephemeral behavior remains, a bounded communication change is required: label action as trying a Preview change and state regeneration resets it.

## 53. Try Versus Accept Assessment

**Recommended.** Distinguish “Try” (current `reviseSchedulePreview`, disposable) from future “Accept” (Author PlanDecision). Current one-button flow conflates them. Not every suggestion needs both, but authoritative language must not point only to derived mutation.

## 54. Fixed-Time Handoff Pattern

This is a sound model when a recommendation truly implies pattern/source-wide intent: review authored source, explicitly save, regenerate. It should not be generalized to occurrence-local fixes unless the user deliberately selects a broader template edit.

## 55. PlanDecision Necessity Test

Adopted test: a PlanDecision-like object is justified when a user planning choice should survive regeneration, is not correctly expressible as existing authored source mutation, and is occurrence/plan-specific. This keeps new authority evidence-driven.

## 56. Fixes Satisfying Necessity Test

**Recommended:** move, skip, reduce duration, convert to recovery, change priority, and accept conflict all pass if their imperative/accept labels mean an enduring accepted choice. They target one occurrence/conflict and broad authored mutation is incorrect. `changeFixedTime` fails because existing authored editing correctly expresses its intended broader change. `addResource` is unresolved due to absent semantics.

## 57. Source-Incarnation Sequencing

Choose **PlanDecision semantics first**, because it determines which source lifetimes and multi-source conflict references incarnation must cover. Then implement incarnation/identity evolution before durable foreign keys/persistence. Do not persist against V1 in the interim.

## 58. Preview Revision Future

Retain `reviseSchedulePreview` as an explicit ephemeral “Try” engine. Future acceptance should create/replace decision authority and regenerate through a decision-aware planner. It may later share pure transformation primitives but should not masquerade as persistence/replay.

## 59. Store / UI Future Authority

Store may continue coordinate derived Preview experiments. UI should route `changeFixedTime` to authored editor, Try actions to revision, and future Accept actions to an Authoring Service/store command that creates decisions; subscribers then receive regenerated derived output.

## 60. Current Behavior Safety

**Safe but misleading, not authority-corrupting.** Task 2.5 freshness prevents stale mutation; changes are cloned, session-only, non-persistent, and authored data remains intact. No need to disable before replacement exists. Copy/labels should clarify ephemerality soon.

## 61. Interim Communication Requirement

**Recommended bounded follow-up after semantics or immediately if prioritized:** explain “Preview change only; regenerating/reloading resets it,” and consider “Try” labels. Do not call current action accepted/saved.

## 62. Compatibility Assessment

No current accepted revisions survive restart, profiles, backups or active persistence, so future semantics need no migration of existing revisions. New durable decisions will require new versioned compatibility decisions but can be introduced without interpreting historical Preview state.

## 63. Test Coverage Assessment

**Confirmed coverage:** every generated automatic action in generator/application tests; unsupported addResource throwing; revision recomputes friction; identity clone/isolation for revised scheduled block; stale store/UI rejection; authored persistence exclusion; profile/backup Preview exclusion; fixed-time no-revision engine/store behavior and UI handoff/regeneration.

**Not found/gaps:** one table-driven test proving all fix types disappear on regeneration from unchanged authority; explicit authored snapshot equality for every action; overlapping-window identity/revision replay expectation; manual/work conflict identity coverage for acceptance; reload test after every action; actionFeedback non-history beyond structural exclusion; no PlanDecision tests (not implemented).

## 64. Architectural Alignment Assessment

| Principle | Current | Adopted Future |
| --- | --- | --- |
| authored/derived separation | aligned in data | retain; acceptance creates separate authored object |
| determinism | authoritative P reproducible; P′ not | authored + decision set reproduces plan |
| user authority | click visibly changes derived output only | explicit Author transformation |
| provenance | adequate for current Preview, insufficient durable | preserve source, occurrence, recommendation, acceptance, outcome |
| category stability | SuggestedFix remains derived | never mutate it into authority |
| historical separation | aligned | decisions remain non-historical |

## 65. Behavioral Invariants

1. SuggestedFix remains advisory derived information.
2. Acceptance never changes the same object into authority.
3. Durable accepted choices are represented separately through Author.
4. One-occurrence decisions never silently become recurrence-wide mutations.
5. Fresh Preview remains required for Preview-derived action.
6. Equivalent authored inputs plus effective decision set produce equivalent plan.
7. Replay preserves decision/source/recommendation provenance.
8. Durable occurrence decisions require lifetime-safe identity.
9. Planning decisions remain distinct from execution/history.
10. `changeFixedTime` remains authored-edit handoff.
11. Retained experimentation is explicitly ephemeral.
12. Regeneration either consumes authoritative decisions or clearly discards experiments.

## 66. Open Questions

- Decision strength: exact hard placement, soft preference, constraint, exception, or remembered advisory choice.
- Conflict identity and whether `acceptConflict` references a pair/set of occurrence identities plus conflict kind.
- Invalidation states, missing occurrence policy, infeasible replay, replacement/composition and deterministic ordering.
- Canonical object/service name and whether occurrence override and PlanDecision are one model.
- Active storage surface, profile inclusion, backup version/export policy, and undo UX.
- Whether proposal provenance must retain full suggestion or only action/reason/source facts.
- `addResource` semantics and authority.

## 67. Recommended Implementation / Investigation Sequence

1. Establish PlanDecision semantics for the seven occurrence/conflict choices: object category, scope, strength, provenance, invalidation, conflict/replacement, replay, windows, undo/removal, and persistence boundaries.
2. Establish source incarnation and evolve occurrence references to support exactly those semantics.
3. Implement decision-aware deterministic generation and authoritative command/result boundaries, initially without silently changing profiles/backups.
4. Add Try versus Accept workflow and interim/final persistence communication.
5. Govern durable format/export/profile compatibility before enabling restart survival.

## 68. Recommended Next Task

**Task 2.23 — Establish PlanDecision Semantics, Invalidation, and Replay Authority.** This must remain investigation-first and must not persist decisions until source incarnation and durable compatibility are subsequently established.

## 69. Deviations

The saved artifact differed from the supplied artifact only by one trailing newline; both hashes are recorded. No implementation deviation and no executable/test/governance change.

## 70. Discoveries and Deferred Work

`addResource` broadens the union beyond executable inventory and must not be assigned semantics from its name. Current automatic generators intentionally avoid work/manual targets. Suggested-fix IDs encode block IDs rather than semantic occurrence references. `acceptConflict` carries the clearest acceptance language but the weakest standalone replay provenance. PlanDecision, occurrence override, source incarnation, decision-aware planning, persistence, profile/backup policy, Try/Accept UI, history, and repair remain deferred.

## 71. Validation

- Task artifact SHA-256/immutability: confirmed above.
- Reference audit: covered all eight action discriminants, all production generation and application paths, store/UI orchestration, stale handling, identity propagation, persistence exclusions, tests, and governing architecture.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- Full suite: 26 files, 469 tests passed.
- `npm run build`: passed; 46 modules transformed.
- `git diff --check`: passed.
- Task-specific executable/test changes: none.
- Governance/checkpoint changes: none.
- Earlier cumulative Phase 2 changes remain present and untouched by Task 2.22.

## 72. Final Completion Determination

Task 2.22 is complete. Every current suggested-fix path has an evidence-backed current and future authority classification; PlanDecision necessity and identity/incarnation dependencies are explicit; ephemeral safety and communication gaps are bounded; and no implementation was performed.

**Task 2.22 is complete when DayFrame has an evidence-backed authority classification for every current suggested-fix acceptance path, has determined whether any accepted fix requires a PlanDecision-like authoritative object, has established occurrence-identity and source-incarnation dependencies for any enduring decision, and has made no unauthorized implementation change.**
