# Phase 5 Checkpoint — Goal V1 Durable Authority

**Date:** 2026-08-23  
**Status:** Task 5.15 Progress workflow audit complete; Measurement Configuration UX next

Goal V1 is now an independent, versioned, durable authored authority. It has
opaque never-reused identity, revision-guarded lifecycle commands, exact
commitment-incarnation links, clone-isolated queries, protected bootstrap, and a
seven-participant runtime transaction boundary including Measurement Definitions.

Backup V4, restore, rollback/recovery, and full clear include Goals. Backup V3
remains import-compatible and translates explicitly to empty Goal authority; it
cannot represent non-empty Goals. HistoricalPlan publication freezes linked Goal
identity, revision, title, status, and optional measurement-policy reference.
Goal state does not enter scheduling inputs and Goal mutation does not stale
Preview.

Validation on the canonical suite: lint passed, typecheck passed, 80 test files /
866 tests passed, and the production build passed. The build retains a non-blocking
676.65 kB chunk-size advisory.

Task 5.4 exposes this authority only in Planner / Plan through an independent,
explicit Goal draft/save workflow. Users can create, edit, complete, archive,
reactivate, link, unlink, and inspect unavailable exact relationships. Summary and
Schedule gained no Goal authoring, and Progress/Recommendations remain deferred.

Task 5.5 confirmed that linked HistoricalPlan provenance and ExecutionHistory
references are sufficient for categorical Goal activity evidence, but found one
blocking ambiguity: both legacy/pre-Goal publications and Goal-aware publications
with zero links omit `occurrence.goals`. “Provenance unavailable” therefore cannot
be distinguished from “known unlinked.” No Progress implementation is authorized
until this coverage boundary is explicit.

Task 5.6 resolves that ambiguity without rewriting history or changing format
versions. Presence of `occurrence.goals`, including canonical `[]`, means Goal-aware
coverage; absence remains legacy/unavailable. New eligible publications always
write the field. Validation, fingerprinting, JSON/clone, IndexedDB, Backup V4,
restore, and republication preserve the distinction.

Task 5.7 adds a pure, policy-versioned, non-persisted Goal Activity query. It
combines current Goal context, frozen HistoricalPlan membership/planning evidence,
and governed ExecutionHistory heads into categorical planning and outcome
distributions with separate plan, Goal-link, and reporting coverage. It adds no
score, percentage, authority, Backup field, clear participant, or UI.

Task 5.8 found the projection ready for bounded integration. The accepted shape is
one read-only Goal Activity section inside Summary's existing History panel, using
the shared range/cutoff, an explicit ephemeral Goal selector, three compact
coverage rows, nested Goal-scoped Planning/Execution counts, and existing inserted
drill-down behavior. Generic Planning/Execution remain unchanged. A navigation-only
handoff may open Planner / Plan without deep selection.

Task 5.9 implements that bounded shape with lifecycle-grouped selection, current
authored context, the shared Summary range/cutoff, three independent coverage rows,
categorical evidence drill-down, protected-state degradation, and navigation-only
Planner handoff. Summary remains read-only.

Task 5.10 keeps Progress deferred. Goal V1's policy reference identifies semantics
but cannot store an authored target, unit, baseline, direction, or measurement
epoch, while Goal Activity and execution outcomes are not universal Progress
evidence. The preferred first eventual slice is manual quantity Progress over a
revisioned measurement definition and durable user observation ledger. Task 5.11
defines the Measurement Definition V1 architecture and durable authority boundary.

Task 5.11 accepts one independent durable Measurement Definition authority: one
stable lineage per Goal, immutable monotonic revision epochs, exact future
observation binding, and a bounded `manualQuantityTarget@1` policy with canonical
decimal target and built-in unit. Goal's policy ref becomes non-operative
compatibility metadata; HistoricalPlan and ExecutionHistory remain unchanged.
Task 5.12 now implements that complete authority with a closed built-in unit and
policy registry, strict canonical validation, revision-guarded lifecycle commands,
protected bootstrap, seven-participant runtime/full-clear integration, and Backup
V5 restore/rollback coverage. Backup V4 remains import-compatible and translates
to empty Measurement Definition authority; it cannot export non-empty definitions.
At the Task 5.12 boundary, Progress and observation authority remained
unimplemented; Task 5.13 was selected to define and implement that boundary.

Task 5.13 now implements Progress Observation V1 as the eighth independent durable
authority. Opaque observation lineages retain immutable correction/retraction
history, exact Goal/definition-revision/unit binding, and separate measurement-time
and knowledge-time semantics. Backup V6, legacy-empty restore translation, generic
restore/rollback/recovery, and full clear include the authority. No Progress
calculation or UI was added. Task 5.14 is the Manual Quantity Progress V1 pure
projection.

Task 5.14 now implements that pure, non-persisted projection. The application query
requires Goal ID plus explicit cutoff, resolves the exact effective definition and
latest compatible observation, and returns exact quantity/target provenance,
arithmetic comparison, and an unclamped canonical percentage. BigInt scaled-decimal
division rounds half-up to four places. Missing/inactive definitions, unsupported
policy, insufficient evidence, known zero, and authority-specific protection remain
distinct. No UI or lifecycle mutation was added. Task 5.15 is the Progress
Authoring and Summary Integration Readiness Audit.

Task 5.15 confirms the user-facing workflow is ready only as separated slices.
Planner Goal detail owns measurement configuration. A single canonical reporting
workflow, owned from Goal detail and reachable by navigation from Summary, owns
record/correct/remove-invalid-record actions; Summary remains read-oriented and
shows quantity-first Progress plus provenance separately from Goal Activity. The
existing definition history is adequate, but Observation UX must first add a
Goal-scoped history read model that includes retracted lineages. Task 5.16 may
proceed independently as Goal Measurement Configuration V1 UX. Observation UX,
Summary integration, and the mandatory Phase 5 bundle exit pass remain separate.
