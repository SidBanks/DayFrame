# CURRENT_STATE.md

# Current State

## Phase 9 — Accepted Allocation Realization V1

Task 9.3 closes the accepted-authority-to-scheduled-reality boundary. A current complete `AcceptedAllocationV2` is realized through one deterministic, immutable `RealizationV1` into first-class productive Goal work, support activity, and Buffer protection facts. The dedicated `realizationAuthority` store is schema 11; one transaction persists the record and its entire footprint, restart retries are idempotent, conflicts fail closed, and acceptance remains intact when installation cannot proceed.

Capacity represents accepted-but-unrealized claims as bounded liabilities and replaces those liabilities with occupied/protected realized facts after success, preventing double consumption. Preview reads fixed realized facts without creating candidates, flexible placement treats them as immovable authority, successful realization stales the prior Preview, and explicit HistoricalPlan publication freezes them as V3 snapshots. Backup V12 and combined restore preserve the authority atomically; older migrations install an empty realization authority and V11 downgrade refuses loss.

Task 9.2.0 resolves the semantic portion of the Task 9.3 architecture reopen with an
implementation-ready, documentation-only Goal-Demand resource-footprint association
architecture. A reusable authored Demand Resource Footprint Specification and one
explicit Demand-specific association distinguish productive-only authority from
unspecified input, create deterministic hypothetical Candidate Parents, and project
exact per-session productive/support/Buffer claims without scheduled occurrences.
Goal links retain their existing meaning; Task 8.4 geometry can cross only through an
explicit normalized source snapshot. The contract fixes requiredness, variants,
cross-user-day/coverage rules, freshness, Goal Planning V2 persistence, Backup V11
migration, and downstream Feasibility-to-Accepted-Allocation propagation. No production
code or tests changed. Task 9.2.1 is now authorized; Task 9.2.2 and Task 9.3 remain
blocked in sequence.

Task 9.2 implements bounded ordinary Constructive Proposal V1 over exact Task 9.1
Allocation, typed No-Proposal outcomes, durable revisioned lifecycle history, explicit
modification/rejection/acceptance evidence, and immutable conflict-safe Accepted
Allocation authority. Every acceptance fully revalidates current dependencies and
atomically records ProposalDecision, Accepted Allocation, lifecycle, and conflicting
Proposal staleness. Schema 10 and Backup V10 preserve exact authority; older backups
acquire explicit empty Proposal state and lossy V9 export is refused. Acceptance is
unrealized and creates no schedule, publication, execution, preference, recurrence,
Friction, or Progress truth. All 114 test files / 1,051 tests and all hard gates pass.
The production bundle is 647,952 initial raw, 165,487 initial gzip, 53,187 largest
lazy, and 895,026 total bytes; gzip-headroom and total architecture-review warnings
remain. Architecture did not reopen. Recommended next is Task 9.3, an explicit
Accepted Allocation realization increment.

Task 9.1 implements deterministic Competing Demand Set V1 and provisional Allocation
V1 over exact Phase 8 Capacity, Demand Projection, Goal Priority, and Feasibility
contracts. Positive overlap between feasible half-open claims defines competition;
connected components and singletons preserve exact demand identity. Governed bounded
search produces non-overlapping maximal alternatives, exact session partitions,
requested/assigned/unmet accounting, residual Capacity, scoped priority ranking,
technical tie-breaks, reasons, provenance, and freshness without Proposal, acceptance,
scheduling, Friction, Progress, persistence, schema, or backup changes. All 111 test
files / 1,032 tests and all gates pass. The production bundle is 671,863 initial raw,
169,998 initial gzip, 53,187 largest lazy, and 867,085 total bytes; hard limits pass,
but only two gzip bytes remain and the total-size architecture-review warning remains.
Architecture did not reopen. Recommended next is a bounded Proposal/user-decision
increment that preserves explicit acceptance authority.

Task 8.3 implements first-class Goal Demand Intent V1 and independent Goal Priority
V1 authored authority plus disposable Demand Projection V1. Complete Demand/Priority
revision histories persist in a sibling authority and round-trip through Backup V8;
V7 and older imports explicitly acquire empty authority, while lossy V7 export is
refused when live Goal planning facts exist. Projection resolves exact canonical
user-day coverage and records exact Demand, Goal, and structural-eligibility
dependencies without owning time or affecting scheduling. Capacity, Feasibility,
Allocation, Proposal, Progress inference, and Commitment attribution remain absent.
All 104 files / 1,003 tests pass with format, typecheck, lint, build, and hard bundle
policy green. The production bundle is 677,971 initial raw, 169,985 initial gzip,
53,187 largest lazy, and 807,972 total bytes; headroom and total-growth warnings are
recorded below their hard/review limits. Architecture did not reopen. Recommended
next is the bounded Phase 8 Commitment Composition increment.

Task 8.2 implements first-class, non-UI Goal Structure V1 authority. Typed `contains`,
`contributesTo`, and `dependsOn` relationships plus Goal-owned Milestones now have
durable identity, semantic revisions, retained exact history, deterministic graph
validation, structural eligibility evidence, persistence/protected restore, explicit
store actions, and Backup V7 compatibility. V6 and older state migrate to empty
structure without inference; Goal IDs, service links, Progress, and scheduling remain
unchanged. The temporary Task 8.1 relationship proof is retired in favor of the live
domain. All 100 files / 993 tests pass with format, typecheck, lint, build, and hard
bundle policy green. Initial bundle warnings are 659,582 raw and 166,746 gzip.
Architecture did not reopen. Recommended next is the bounded Phase 8 Goal Demand
Intent and Goal Priority implementation task.

Task 8.1 implements the first Phase 8 foundation: bounded shared planning identity,
revision, typed provenance, declared dependency fingerprints, typed freshness,
canonical user-day coverage, qualification, structured reasons, exact historical
resolution, and fail-closed versioned snapshot migration. A non-user-facing
revisioned Goal-relationship evidence slice proves semantic-only revision advancement,
dependency staleness, exact history, and JSON/backup-compatible round trips without
starting full Goal Structure. Existing scheduling, Preview, surfaces, and Backup V6
remain unchanged. All 987 tests pass; format, typecheck, lint, build, and hard bundle
policy pass with the established 162,015-byte initial-gzip warning. Architecture did
not reopen. Recommended next is Task 8.2 — Goal Structure V1 Domain and Persistence.

Task 7.10 closes Phase 7 with Classification A and declares Phase 8 Ready. Evidence
confirms that Month is a real routine planning workspace, supported by Planning
Settings, Work Pattern, Commitment Library, and specialized Detailed Review; no
required product, authority, accessibility, mobile, loading, lifecycle, or bundle gap
remains. Plan stays retired. Work Pattern presets are the highest-value credible next
opportunity, but structural readiness is ahead of application policy: replace/add/
merge, identity remapping, dates/anchors/bounds, and preview-before-apply require a
design decision. Recommended next is Task 8.1 — Work Pattern Preset Application Policy
and Product Semantics Audit, classified as Phase 8 foundation. No production or test
file changed for this audit. Lint/typecheck, 94 files/976 tests, build, bundle, and diff
validation pass at the unchanged 636,234/162,015/53,188/761,854-byte baseline.

Tasks 7.9 and 7.9A complete Phase 7 Planner convergence. Month is now the
deterministic production and integration-test default; legacy Plan navigation and
composition are absent. Planning Settings, Work Pattern, Commitment Library, Month,
and Detailed Review own their bounded responsibilities while preserving one
SetupDraft, one Save transaction, explicit Refresh, exact identity, and existing
authority/lifecycle semantics. The migrated DayFrameApp suite is 123/123 and the full
repository is 976/976 with zero skips. Lint, typecheck, build, and bundle guards pass;
final bundle is 636,234 raw, 162,015 gzip, 53,188 largest lazy, and 761,854 total, with
only the established gzip warning. Test convergence and Plan retirement are both A;
the Phase 7 Planner strangler is complete and Task 7.10 is authorized as a closeout/
product-value audit.

Task 7.8 extracts complete authored scheduling intent into Commitment Library with
direct Planner and Month-contextual entry. Active, disabled, non-occurring, Sleep, and
advanced Commitment sources remain discoverable independent of Preview/Month and use
the shared exact template/recurrence editor, SetupDraft, lifecycle, validation, and
Save Setup. Work and Events remain excluded. The residual audit classifies Plan
retirement A (zero unique responsibility) and Month-default readiness Ready; Task 7.9
is authorized for navigation convergence, Month default, and legacy Plan retirement.
All 975 tests, lint, typecheck, build, bundle checks, diff checks, and 320–1024px browser
QA pass. Bundle is 637,805 raw, 162,143 gzip, 53,130 largest lazy, and 763,279 total;
only the established initial-gzip warning remains.

Task 7.7 extracts structural Work into a bounded Work Pattern workspace with direct
Planner and Month-contextual entry. Both reuse the lazy SetupScreen, singular
SetupDraft, canonical validation/identity lifecycle, and Save Setup; Month remains
mounted and context-preserving. Commitments, global Planning Settings, Events, Goals,
Review actions, and generated truth remain outside. Preset readiness is Classification
C: the model is expressive, but replace/add/merge and date/anchor application policy
remain unresolved, so no preset foundation was invented. All 974 tests, lint,
typecheck, production build, bundle policy, and 320–1024px browser QA pass. Final
bundle is 636,070 raw, 161,963 gzip, 52,651 largest lazy, and 760,931 total; only the
existing gzip warning remains. Task 7.8 should extract Commitment Library.

Task 7.6 is a read-only audit of Plan's remaining advanced responsibility. It selects
multiple coherent workflows: Work Pattern for Shift Definitions, rotations/manual
regimes/off days and regime overrides; Commitment Library for complete inactive/non-
occurring inventory, recurrence, removal and advanced intent fields. Schedule
Structure is too broad because no non-Work structural rule exists. Plan remains a
temporary supporting shell until both workflows are extracted; Month should become
the default only in final navigation convergence. Review remains specialized.
`transitionStrategyId` is dormant metadata, not behavior. All 973 tests pass and the
bundle is unchanged at 634,896 raw, 161,779 gzip, 52,326 largest lazy and 759,310 total.
Task 7.7 Work Pattern extraction is precisely authorized.

Task 7.5 makes bounded global Planning Settings available inside Month without
embedding Plan or duplicating authority. Month and Plan now share GoalSection, the
same lazy SetupScreen Preferences/Planning Range composition, one SetupDraft, and one
Save Setup transaction. Month/range independence, pending-versus-durable truth,
stale-without-auto-refresh, focus, keyboard, 320–430px behavior, and all 973 tests pass. Plan retains
unique coupled shift/cycle/segment and advanced Commitment setup, so it remains
supporting and is not retirement-ready; Review remains specialized. Bundle hard and
review limits remain green at 634,896 raw, 161,779 gzip, 52,326 largest lazy, and
759,310 total; initial gzip remains the sole warning. One bounded advanced-
configuration extraction audit is recommended next.

Task 7.4 makes Month attention actionable and brings canonical Generate/Refresh to the
primary planning surface. Selected-day friction now retains exact ID, message, and
canonical suggested-fix summaries, then opens the exact focused issue in specialized
Review; Try/Apply remains there because it coordinates transient Preview revision and
PlanDecision acceptance. Missing/stale generation uses the existing store action,
preserves Month context, and stays separate from Save Setup. Goals, preferences, range,
detailed visualization, and resolution remain supporting Plan/Review responsibilities;
neither legacy mode is retirement-ready. All 972 tests and production-browser checks
pass. Bundle hard limits remain green; initial gzip warns at 161,703 and total is
758,317. The next boundary is bounded Planner configuration convergence.

Task 7.3 turns Month's selected-day review into contextual source navigation. Add/Edit
Event uses the singular Event writer; Add/Edit Commitment and Work use the existing
lazy Plan authoring component inside the Month workspace. Exact Event incarnation and
exact template/recurrence incarnations are revalidated after lazy loading and authority
replacement; recreated sources never retarget. Month context remains mounted through
loading and returns, while SetupDraft/Save Setup, stale Preview, generation, and Review
semantics remain unchanged. All 970 tests and production-browser mobile/keyboard/slow-
load checks pass. Bundle policy is green at 633,562 raw, 161,467 gzip, 51,852 largest
lazy, and 755,909 total. Task 7.4 is ready.

Task 7.2C selected a sustainable hybrid production-bundle policy after reconstructing
Task 5.19 intent and the Phase 5–7 trend. Initial raw (685,000), initial gzip (170,000),
and largest lazy (100,000) remain unchanged hard limits with early warnings. All
749,882 emitted bytes remain counted, but total JS is now advisory with 800,000 growth-
review and 825,000 architecture-review milestones. The prior fixed-total ADR policy is
explicitly superseded; no production output or behavior changed. Task 7.3 is ready.

Task 7.2B traced the production entry and store composition with source-map ownership
evidence. Each production module has one owner; Month, Plan, Today, Today query, and
Summary are clean lazy entries. The eager graph contains singular authority, readiness,
recovery, persistence, supported compatibility, Review, and current user workflows.
Demand-loading optional implementations would still be counted by the all-chunks total
guard and would add async/atomicity risk. No production change was retained. The exact
749,882-byte baseline therefore triggers a Bundle Budget Governance/ADR prerequisite;
Task 7.3 remains paused.

Task 7.2A reproduced and audited the production graph but hit its explicit safety stop
condition. Total JS remains 749,882 bytes with only 118 bytes free. Dead Preview-era
composition is already absent; remaining large paths are reachable behavior or governed
compatibility/recovery code. Measured chunk-policy experiments were negative or below
the 5 KB meaningful floor and were reverted. No production behavior, authority, guard,
dependency, or build policy changed. Task 7.3 is paused pending a dedicated bundle-
architecture remediation.

Task 7.2 delivers the first visible Monthly Planner as a lazy, read-only third Planner
mode. Its accessible 35/42-cell grid and selected canonical user-day workspace consume
the Task 7.1 projection without redefining time, coverage, identity, or authority.
Keyboard, focus, mobile, recovery, and loading states are implemented; navigation is
write-free; Plan and Review remain reachable. Production-browser QA, 960 tests, and
all bundle guards pass (749,882 total JS). Task 7.3 contextual workflow migration is
ready.

Task 7.1 implements the pure canonical Monthly Planner read model. It validates an
explicit displayed month, selected visible label, evaluation instant, temporal state,
planning-range context, Preview, current Events/exact sources, and availability; then
returns a deterministic clone-isolated 35/42-cell civil grid. One effective M-01
display-week anchor controls columns while each label retains canonical piecewise
user-day/week truth. Covered fresh/stale, generated-empty, uncovered, and protected/
unavailable remain distinct. Work, Commitment/Sleep, Event, friction, and unplaced
evidence retain one owning label and exact non-retargeting context. HistoricalPlan,
ExecutionHistory, Progress, Capacity, Recommendations, UI, writes, persistence, and
new dependencies remain excluded. Task 7.2 is authorized.

Phase 7 Audit 01 selected **Outcome A — Monthly Planner Architecture Ready**. Month
will become Planner's dominant civil-date navigation/projection, with the selected
canonical user-day driving a contextual workspace. Month is not authority, a fixed
elapsed interval, a user-week boundary, or a generation range. Preview remains the
current derived schedule; generation/publication stays explicit; Today and Summary
retain their Phase 6 roles. A month-anchored display-week policy keeps grid columns
stable across within-month preference transitions while canonical user-week truth is
resolved per label. Task 7.1, a pure read model with no writes and minimal/no UI, is
authorized next. No Phase 7 production behavior has begun.

Phase 6 is complete and publication-ready. Task 6.11 exercised the production build
in Chromium across desktop and 320/375/390/430px widths, keyboard/focus, the browser
accessibility tree, throttled lazy loading, Commitment/Event/Review journeys, and
22/24/26-hour user-days. One P2 focus loss after Generate Schedule was fixed by
focusing the Review heading. All 90 files/934 tests and unchanged bundle guards pass.
Planner owns intent/review, Today owns current execution, and Summary owns historical
interpretation. Phase 7 planning is next; no specific Phase 7 feature is authorized.

Task 6.8 connects Review Schedule occurrences to current Event, Commitment, and
truthful composite Work editors while keeping Event writes, SetupDraft edits, Try
revisions, and PlanDecision acceptance semantically distinct. Task 6.9 production
audit corrected one overclaim: Event recreation is guarded exactly, but stale
Commitment occurrences currently resolve a new incarnation by logical IDs.

Task 6.7 converges authored flexible scheduling inputs into a derived Commitment
inventory with bounded Add/Edit/Remove over the single Setup draft. Work Hours,
Work Schedule, preferences, and advanced fields retain their canonical source
semantics; manual events keep their calendar path and no Pattern or Commitment
authority exists. Plan authoring is production-lazy with authority/recovery eager.
Task 6.8 is authorized.

Task 6.6 converges Planner's generated result into an explicit Review Schedule
workflow. Plan remains the authored-intent mode; Review Schedule preserves the
existing Preview scheduler/publication and Try/PlanDecision paths while presenting
schedule status, range/date review, planned geometry, unplaced attention, and
conflict resolution in product language. Planner no longer composes execution
reporting. Task 6.7 is authorized.

Task 6.3A has now resolved both architectural questions. Canonical user-days will
be half-open intervals between consecutive label-indexed effective boundary starts,
so boundary changes produce exact short or long days without gaps or overlaps.
HistoricalPlan occurrence snapshot V2 now carries required tagged all-day/timed
provenance; V1 absence remains unavailable legacy and is never backfilled. The
separate Tasks 6.3B (resolver and variable-duration consumers) and 6.3C
(HistoricalPlan timing provenance and compatibility) are implemented and green.

## Phase 6 — Platform Maturity

**Status:** Phase 6 complete; Phase 7 awaiting bundle-budget governance decision
**Current through:** Task 7.2B architecture audit/governance stop
**Last reviewed:** 2026-08-25

Task 6.1 audited the proposed Monthly Planner / Daily Workspace / Summary operating
model against production behavior. Determination A accepts the three user questions
but recommends the truthful primary navigation **Planner / Today / Summary**:
planning ranges are arbitrary and cycle/user-week aware, so month is a Planner view
rather than an authority boundary; Today is the canonical current user-day rather
than calendar midnight; Summary remains settled and read-only. Existing Active,
PlanDecision, HistoricalPlan, ExecutionHistory, Goal, Measurement Definition, and
Progress Observation authorities suffice for V1. No generic Commitment, Daily
Workspace, current-plan, or acceptance authority is required. Task 6.2 should create
bounded application/surface composition without changing semantics or duplicating
write paths; a later pure read-model task should compose current-user-day,
HistoricalPlan, now/next/later, and Execution outcomes.

Task 6.2 now implements the structural boundary without changing product truth.
Planner remains eager/default and contains the unchanged Plan/Schedule workflows;
Today is an eager bounded placeholder with no semantic authority reads or writes;
Summary remains lazy with intent preload and unchanged projections. One canonical
surface state governs navigation while Planner mode remains orthogonal. Store,
draft, command, bootstrap, recovery, restore/full-clear, persistence, and Backup V6
ownership remain unchanged. Task 6.3 is next: the pure canonical Today
current-user-day/current-plan read model, without Today UI.

Task 6.3 source audit triggered mandatory stop conditions before production work.
Valid adjacent shift segments may change `dayBoundaryStartTime`, but current
architecture defines no ownership precedence for the resulting gap/overlap instants;
instant-to-user-day resolution can be ambiguous or circular. HistoricalPlan V1 also
drops the manual-event all-day marker during publication. A bounded architecture
audit must define boundary-transition ownership and all-day publication semantics,
including compatibility/versioning, before Task 6.3 resumes. Task 6.4 remains
blocked on the canonical read model at that checkpoint.

Task 6.3C implements the accepted occurrence-only HistoricalPlan evolution. New
publications emit strict occurrence V2 with required tagged timing provenance;
legacy V1 remains valid and explicitly unavailable rather than inferred. Semantic
fingerprints, clone/JSON, IndexedDB mixed ledgers, Backup V6, restore, protection,
full clear, and republication cutoffs preserve version and timing exactly. No
Backup V7, store, migration, temporal change, or Today behavior was introduced.
Together with Task 6.3B, both Task 6.3 stop conditions are now resolved.

Resumed Task 6.3 composes those prerequisites into `queryToday`. HistoricalPlan is
the sole plan source, ExecutionHistory the sole outcome source, and Active is used
only by canonical temporal resolution. Known-empty, missing, plan-protected, and
independently execution-protected states remain explicit. Multiple current items,
tied next groups, republication, correction/retraction cutoffs, and exact-reference
identity are deterministic. No Preview, UI, write, Goal/Progress context, Today
authority, persistence, or Backup change was introduced.

Task 6.4 replaces the Today placeholder with the first user-visible operational
read surface. It consumes only `queryToday`, displays frozen evidence and neutral
outcome copy, retains multiple current/tied next items, and exposes attention
without cause. Refresh advances time; authority changes preserve the cutoff; no
polling exists. Navigation/refresh/restore/clear races are generation-guarded.
Today joins Summary as a justified lazy primary surface and fixed budgets stay green.

Task 6.5 adds bounded outcome actions without changing Today chronology or plan
authority. First reports, corrections, and confirmed removals use canonical
append-only ExecutionHistory commands and exact durable occurrence identity.
Protected/missing/empty and plan-attention states remain non-writing. Accepted user
writes explicitly advance Today's cutoff and canonical re-query; passive updates
retain the cutoff. Fixed bundle budgets remain green.

Task 6.6 introduces Plan / Review Schedule product navigation without moving state
ownership. Generate/Refresh Schedule still invokes canonical Preview generation and
HistoricalPlan publication; stale schedules remain visible. Existing calendar/day
filtering, variable-duration DayVisualizer, unplaced items, friction, Try, and
PlanDecision Apply paths are recomposed. Execution outcomes are excluded from
Planner. Fixed eager/lazy bundle budgets remain green.

---

## Phase 5 — Prescriptive Intelligence / Adaptive Planning Foundation

Task 5.1 defines the boundary from descriptive evidence to user-governed action.
Goals are recommended as a future independent durable authored authority, distinct
from Commitments and priority. Progress remains deterministic, policy-versioned,
provenance-bearing derived interpretation rather than a universal percentage.
Recommendations remain ephemeral explainable proposals; only a future durable
RecommendationDecision records user acceptance/rejection. Adaptation is a separate,
explicitly accepted Planner transaction into future authored state, followed by
normal stale-Schedule and explicit-generation behavior. Automatic adaptation and
machine learning are not authorized for V1.

Summary remains read-only explanation and handoff; Planner remains the operational
decision surface. HistoricalPlan and ExecutionHistory remain immutable authorities,
and neither behavior nor correlation may redefine user intent, importance, or
preference. No Phase 5 production type, store, schema, Backup format, or UI exists
yet. Task 5.1 therefore selected Goal V1 Authority, Identity, Lifecycle, and
Commitment-Link Semantics Definition as Task 5.2.

Task 5.2 finalized that contract: one versioned independent Goal collection,
opaque never-reused IDs, revision-based staleness, active/completed/archived
authored lifecycle, optional target/policy reference, and Goal-owned exact source-
incarnation links. V1 is archive-only and scheduling-independent. Goal must join
historical publication provenance and a new complete Backup/restore/full-clear
boundary before Planner UI ships. Task 5.3 now implements that substrate: Goal V1
has independent IndexedDB authority, strict lifecycle and link commands, protected
bootstrap, six-participant runtime/restore/full-clear integration, Backup V4, and
frozen HistoricalPlan Goal provenance. Backup V3 imports explicitly produce empty
Goal authority and non-empty Goals cannot be exported as V3. Goal mutation remains
scheduling-independent and does not stale Preview. Task 5.4 adds bounded Goal
authoring to Planner / Plan: explicit independent create/edit drafts and saves,
lifecycle controls, exact current commitment linking, preserved unavailable
relationships, protection/durability feedback, and responsive accessible
presentation. Summary and Schedule have no Goal authoring. Progress and
Recommendations remain unimplemented. Task 5.5 found frozen linked Goal provenance
and existing execution categories sufficient for a future categorical Goal Activity
projection, but not yet sufficient to distinguish Goal-aware known-unlinked history
from legacy provenance-unavailable history: both previously omitted `goals`. Task
5.6 now makes Goal-aware known-empty history explicit as `goals: []` while absent
`goals` remains legacy/unavailable. New publication, strict validation, canonical
fingerprinting, Backup V4, restore, and republication preserve this distinction
without migration or version bump. Task 5.7 may define a pure categorical Goal
Activity projection. Task 5.7 now implements that deterministic non-persisted query:
linked intended occurrences conserve across scheduled/unplaced/omitted/blocked,
linked scheduled occurrences conserve across completed/partial/skipped/unknown/not
reported, and plan/Goal-link/reporting coverage remain separate with drill-down
provenance. Current Goal links and scheduling state are not inputs. Summary UI,
Progress, scores, measurement policies, and Recommendations remain unimplemented;
Task 5.8 confirms direct bounded Summary integration is ready: a selected-Goal
composite section under the shared History range/cutoff, three compact independent
coverage rows, categorical Planning/Execution counts, and evidence drill-down that
shows frozen labels only when they differ from current context. Summary remains
read-only and generic metrics remain unchanged. Task 5.9 implements this audited
shape with explicit ephemeral selection, current context, shared range/cutoff,
independent coverage, categorical evidence drill-down, protected-state degradation,
and Planner navigation. Progress and Recommendations remain deferred; Task 5.10
audits Progress V1 and measurement-policy architecture before implementation.
It finds Progress not implementation-ready: the current policy reference lacks
authored unit/target/baseline/direction/epoch configuration, and neither Goal
Activity nor ExecutionHistory is a universal Progress numerator. Progress remains
pure and non-persisted; the smallest truthful future slice is manual quantity
Progress over separate revisioned measurement definitions and durable user-reported
observations. Task 5.11 defines the Measurement Definition V1 architecture and
durable authority boundary before any Progress implementation.
Task 5.11 now finalizes that boundary: an independent durable authority owns one
immutable revision lineage per Goal, with `(definitionId, revision)` epochs,
save-time non-overlapping effective intervals, explicit inactive boundaries, exact
future observation binding, and no normal deletion. The first built-in policy is
bounded absolute manual quantity toward a positive canonical-decimal target in an
exact built-in unit, with no baseline or conversion. Goal's policy ref becomes
non-operative compatibility metadata; HistoricalPlan/ExecutionHistory stay
unchanged. Task 5.12 now implements the complete substrate and Backup V5 boundary:
strict identity/revision/effective-time validation, closed built-in unit and policy
registries, revision-guarded lifecycle commands, protected bootstrap,
seven-authority runtime/full-clear participation, and transactional restore and
rollback. Older backups translate to empty Measurement Definition authority, and
Backup V4 export rejects non-empty definitions. No observation ledger or Progress
projection is added. Task 5.13 defines Progress Observation V1 architecture and
its durable authority boundary.
Task 5.13 implements that boundary as an eighth independent authority with opaque
observation identity, immutable monotonic correction/retraction revisions, exact
Goal/definition-revision/unit binding, absolute canonical quantity values, and
separate `observedAt` measurement time from `recordedAt` knowledge time. Backdated
evidence is epoch-checked, future evidence and same-time active conflicts are
rejected, and as-of queries reconstruct the known effective head. IndexedDB,
runtime transactions, full clear, Backup V6, legacy-empty translation, restore,
rollback, and recovery now include observations. Progress interpretation and UI
remain absent; Task 5.14 defines the pure Manual Quantity Progress V1 projection.
Task 5.14 implements that projection as deterministic derived intelligence. One
Goal ID and explicit cutoff resolve the exact effective definition epoch and latest
effective compatible observation. The result preserves raw quantity/target/unit,
exact provenance, arithmetic comparison, and an unclamped canonical percentage
computed with BigInt scaled decimals and four-place half-up rounding. Definition,
evidence, unsupported-policy, known-zero, and authority-protection states remain
explicit. Goal lifecycle/target date are context only; Goal Activity and all
scheduling/history authorities are excluded. Progress is not persisted or backed
up, and no UI exists. Task 5.15 now selects a separated product sequence. Planner
Goal detail owns bounded Measurement configuration; Summary remains read-oriented
and later presents quantity-first Progress and provenance distinctly from Goal
Activity. Observation reporting uses one canonical Planner-owned workflow reachable
contextually from both surfaces. Measurement APIs are implementation-ready.
Observation commands are ready, but correction/retraction UI needs one Goal-scoped
history read model that includes retracted lineages; that gap belongs to the
Observation slice and does not block Task 5.16. Historical Progress selection,
progress bars, and all prescriptive interpretation remain deferred. The 676.65 kB
bundle baseline and mandatory Phase 5 exit bundle-architecture pass remain reserved.
Task 5.16 adds selected-Goal Manual Quantity setup, change, stop, and restart through
canonical Measurement Definition authority. Qualitative, active, stopped,
unsupported, loading, protected, durability-failure, and conflict states remain
distinct; adjacent Goal, scheduling, Preview, Observation, Progress, and Summary
boundaries remain unchanged.
Task 5.17 now adds selected-Goal absolute quantity reporting, correction, retraction,
and one derived Goal-scoped logical-record history across exact Measurement periods.
Observation is the only write authority. Summary and derived Progress remain absent;
Task 5.19 remains the mandatory bundle exit gate.
Task 5.18 now adds quantity-first read-only Summary Progress and bounded provenance
for the same selected Goal as Goal Activity. Percentage and comparison remain
derived arithmetic; Activity, lifecycle, and target date remain separate. Planner
handoffs navigate only. Task 5.19 is now the mandatory next task.
Task 5.19 measures the production dependency graph and closes Phase 5. Summary is
one accessible lazy product surface; React has a stable vendor cache boundary;
authority/bootstrap/restore and default Planner remain eager. Automated manifest
budgets guard initial raw/gzip, largest lazy, and total JavaScript. The exit gate
passes at 676.31 kB initial / 168.20 kB gzip with the complete canonical suite
green. Phase 6 — Platform Maturity is next at Roadmap level; no entry task is yet
defined.

---

## Phase 4 — Historical Intelligence Foundation and Planner/Summary Product Architecture

**Status:** Phase 4 complete with non-blocking deferred scope and residual debt
**Current through:** Task 4.11
**Last reviewed:** 2026-08-23

Historical Intelligence is implemented as a pure, deterministic projection of
HistoricalPlan and ExecutionHistory under an explicit metric-policy version and
resolved user-day query. Task 4.2 provides explicit complete/incomplete/unavailable
plan coverage and categorical completion distribution over scheduled occurrences;
partial, skipped, retracted/unknown, and not reported remain distinct, with exact
reference provenance and conservative protected/quarantine handling. It creates no
third historical authority and requires no new Backup or clear participant.
Task 4.3 exposes this governed projection in a third bounded top-level Summary
destination with explicit date selection, coverage disclosure, five categorical
counts, reporting coverage, frozen-context category drill-down, missing dates, and
planner-exclusion explanations. Queries refresh from both historical authorities,
reject stale async results, and suppress misleading output during protection or
quarantine. Scheduling realization, planned allocation, scores, adherence, trends,
Goals, Progress, Recommendations, and automatic learning remain unimplemented.

Task 4.4 confirmed that the Planner/Summary direction remains sound and that
Summary should remain read-only for now. It also found a bounded product issue:
Preview combines draft-schedule review with operational reporting and a
date-filtered ExecutionHistory aggregate whose `Not reported` meaning differs from
Summary's HistoricalPlan-denominated category. Top-level navigation also mixes the
Generate Preview command with Setup/Summary destinations. Task 4.5 should clarify
those responsibilities, scopes, and labels before another metric is authorized.

Task 4.5 completed that refinement. Top-level navigation is now destination-only
(`Setup`, `Preview`, `Summary`); generation/regeneration is explicit within Setup
or Preview and navigation never generates. Preview retains contextual current and
past-plan reporting plus renamed `Report history`, while its ambiguous broad
ExecutionHistory aggregate was removed. Summary remains read-only and its selected-
date reporting coverage and Scheduled outcomes semantics are unchanged. The next
governed candidate is Scheduling Realization V1.

Task 4.6 implements that candidate as a non-durable HistoricalPlan-only query.
Its denominator conserves every intended occurrence across scheduled, unplaced,
omitted, and blocked; coverage/cutoff semantics match Task 4.2. No UI, outcome,
score, reason, trend, capacity, or allocation meaning is inferred. Task 4.7 is
the next bounded integration audit.

Task 4.7 completes that integration. One Summary range/cutoff and shared plan
coverage support Planning/Scheduling realization and Execution/Scheduled outcomes
as peer, denominator-separated projections. Planning categories have frozen
read-only evidence; no cause, score, funnel, mutation, or new durability was
added. Next is a bounded product/roadmap review of Planner convergence versus
further Historical Intelligence, not an automatic new metric.

Task 4.8 selected Product Architecture Determination A. Summary is sufficient as
an independent V1, and another metric has lower immediate value than converging
the fragmented operational journey. Setup and Preview can be composed under one
Planner destination without changing the engine, draft model, explicit
generation, stale Preview, authorities, persistence, Backup, or Summary. Phase 4
remains open because its broader Learn promises are not complete. Task 4.9 is the
bounded composition-first Planner Convergence V1 implementation.

Task 4.9 implements the canonical top-level `Planner / Summary` model. Planner
contains transient `Plan / Schedule` modes and composes the existing Setup and
Preview workflows around one app-owned draft. Explicit save/generation, saved-
state Schedule regeneration, stale Preview, friction decisions, operational
reporting, all authorities, Backup/restore/clear, and read-only Summary remain
unchanged. Task 4.10 should audit the converged product and decide Phase 4 closure
and sequencing.

Task 4.10 accepts Planner V1 with non-blocking UX debt and finds the implemented
Phase 4 boundary conceptually mature. No additional feature or metric is required
for closure. Phase 4 remains open for exactly one governance task: Task 4.11 must
publish the achieved Historical Intelligence Foundation and Planner/Summary
Product Architecture identity, explicitly retain deferred aspirations, verify the
final evidence, and define the design-first Phase 5 entry boundary.

Task 4.11 independently confirms and publishes the completed phase boundary.
Planner (`Plan / Schedule`) and Summary are the canonical product model: Planner
owns operational planning/reporting and Summary owns read-only derived historical
understanding. Historical Intelligence remains deterministic, policy-versioned,
explainable, ephemeral projection over HistoricalPlan and ExecutionHistory. Plan
coverage, Scheduling Realization, Scheduled Outcomes, reporting coverage, and
frozen provenance constitute the mature V1 foundation. Planner V1 is accepted
with non-blocking UX debt.

Planned Allocation, comparisons/trends, Capacity, Goals, Progress,
Recommendations, and learning/adaptation are not implemented and are explicitly
deferred. Phase 5 begins design-first with Task 5.1, defining Goals, Progress,
Recommendations, and Adaptive Planning boundaries while keeping descriptive
evidence separate from prescriptive policy and preserving user control.

Canonical publication: `docs/checkpoints/CHECKPOINT_Phase_4_COMPLETE.md`.

---

## Phase 3 — Execution and History Semantic Foundation

**Status:** Phase 3 complete
**Current through:** Task 3.16
**Last reviewed:** 2026-08-22

DayFrame now has a published epistemic and domain boundary between planning and
reality. Preview and PlanDecision remain planning facts. The accepted Phase 3 V1
direction is an independent `ExecutionRecord` surface with immutable correction
revisions, derived current outcomes, lifetime-safe planned linkage, historical
snapshot context, explicit provenance, and unknown-by-default semantics.

Phase 3 now includes operative Preview planning and revisions; durable
HistoricalPlan publications; HistoricalPlan- and Preview-backed execution
reporting; IndexedDB ExecutionHistory with immutable correction/retraction chains;
categorical Outcome Summary reporting; asynchronous readiness; journaled
cross-storage restore; complete Backup V3; and terminal five-authority full clear.
Task 3.15C replaced scheduler-dependent durability checks with deterministic
completion observation, and Task 3.16 independently closed Phase 3 with a green
validation baseline. Historical metrics, adherence scoring, Goals, Progress,
streaks, and learning remain unimplemented and belong to future design work.

Canonical publication:
`docs/checkpoints/CHECKPOINT_Phase_3_COMPLETE.md`.

---

## Phase 2 — Authoritative State and Lifetime-Safe Planning Authority

**Status:** Complete with deferred release work
**Current through:** Task 2.40
**Last reviewed:** 2026-08-20

DayFrame now has explicit source incarnations, Active/Profile/Backup V2 lifetime semantics, lifetime-safe durable occurrence references, independently persisted PlanDecision V1 authority, deterministic replay, explicit Try → Accept, persistent accepted-choice visibility/removal, and decision-aware recommendations.

No Phase 2 correctness defect remains. Backup V3 is required before broader release because Setup Backup V2 does not include PlanDecision or Profile V2 authority. The next architecture-first direction is Phase 3 execution/history semantics; release-readiness work may prioritize Backup V3 first.

Canonical publication: `docs/checkpoints/CHECKPOINT_Phase_2_Complete.md`.

---

## Phase 1 — Architectural Foundation Alignment

**Status:** Complete
**Current through:** Task 1.39
**Last reviewed:** 2026-08-18

Phase 1 has completed the architectural-foundation alignment work required before
DayFrame moves into **Phase 2 — Authority and State Alignment**.

The completed Phase 1 work established canonical ownership for authored Setup and
Preview coordination, removed obsolete singular shift-cycle authority from current
runtime and scheduling pathways, adopted durable-data compatibility governance,
and built a complete session-first durability model spanning persistence outcomes,
retained durability state, user-visible failure awareness, explicit retry, and a
bounded recovery-required contract.

No additional durability implementation is currently required before proceeding
to the next architectural domain.

---

# Phase 1 Closure Focus (Historical)

At the Phase 1 checkpoint, DayFrame had completed **Phase 1 — Architectural Foundation Alignment** through
Task **1.39**.

The immediate project objective is now:

```text
Phase 1 review / checkpoint
        ↓
validated repository checkpoint
        ↓
Phase 2 — Authority and State Alignment
```

Phase 2 should begin with an investigation of:

```text
authoritative state objects
derived-state boundaries
invalidation ownership
replacement semantics
state-transition authority
```

rather than another durability implementation task.

---

# Phase 1 Executive Result

Phase 1 established four major architectural foundations.

## 1. Transaction and Workflow Ownership

Authored Setup now commits through one store-owned atomic transition:

```text
DayFrameApp.saveCurrentSetup
        ↓
commitAuthoredSetup
        ↓
one complete authored transition
        ↓
stale once
persist once
notify once
```

Preview coordination has one supported application path:

```text
DayFrameApp
    ↓
PreviewScreen
```

The obsolete alternate Preview container/path was removed.

---

## 2. Canonical Shift-Cycle Authority

Current DayFrame architecture uses:

```text
shiftCycles
```

through all current authored, runtime, store, and scheduling pathways.

The final boundary is:

```text
RAW HISTORICAL INPUT
    shiftCycle accepted
          ↓
boundary-specific validation / normalization
          ↓
NORMALIZED AUTHORED DATA
    shiftCycles only
          ↓
CURRENT RUNTIME
    shiftCycles only
          ↓
STORE / CORE SCHEDULING
    shiftCycles only
```

Singular `shiftCycle` survives only at raw historical-data ingress where older
repository-produced data may still require it.

---

## 3. Durable-Data Governance

DayFrame now has an accepted durable-data compatibility and independent
format-versioning policy:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

DayFrame treats durable authored data it writes or exports as user data.

Historical representations must be handled through explicit:

- compatibility;
- migration;
- conversion;
- recovery;
- or explicit unsupported-format behavior;

rather than silent degradation.

Local persistence, profile storage, and backup formats are independently
versioned.

A durable format version represents a compatibility contract rather than a frozen
serialized layout.

In-memory normalization does not constitute completed migration.

Compatibility-reader retirement requires explicit architectural authorization and
surface-appropriate migration or recovery evidence.

---

## 4. Session-First Durability Architecture

Tasks 1.23–1.39 established a complete ordinary durability lifecycle:

```text
runtime mutation
    ↓
factual persistence outcome
    ↓
store-owned durability interpretation
    ↓
mutation-result observability
    ↓
retained durability status
    ↓
desired durable condition
    ↓
explicit store-owned retry
    ↓
reactive durability subscription
    ↓
shared semantic classification
    ↓
immediate workflow feedback
    ↓
persistent app-level awareness
    ↓
explicit user-triggered Retry
    ↓
recovery-required boundary
    ↓
session-loss risk communication
```

Runtime/domain success and durable success are no longer treated as the same fact.

---

# Architecture Status

| Area                                    | Status         |
| --------------------------------------- | -------------- |
| Architecture Specification              | ✅ Published   |
| Architecture Charter                    | ✅ Published   |
| Architectural Decisions                 | ✅ Published   |
| Canonical Terminology                   | ✅ Published   |
| Architecture Governance                 | ✅ Established |
| Durable-Data Compatibility ADR          | ✅ Accepted    |
| Phase 1 Foundation Alignment            | ✅ Complete    |
| Phase 2 — Authority and State Alignment | ⏭ Next        |

---

# Audit and Alignment Status

| Area                          | Status      |
| ----------------------------- | ----------- |
| Architecture Alignment Audit  | ✅ Complete |
| Architecture Audit Synthesis  | ✅ Complete |
| UX Audit                      | ✅ Complete |
| UX Audit Synthesis            | ✅ Complete |
| Alignment Strategy            | ✅ Complete |
| Implementation Roadmap        | ✅ Complete |
| Implementation Execution Plan | ✅ Complete |

---

# Implementation Status

| Area                                                        | Status      |
| ----------------------------------------------------------- | ----------- |
| Implementation Planning                                     | ✅ Complete |
| Tasks 1.1–1.4 — Initial ownership/obsolete-path alignment   | ✅ Complete |
| Tasks 1.5–1.20 — `shiftCycle` compatibility alignment       | ✅ Complete |
| Tasks 1.21–1.22 — Durable-data governance                   | ✅ Complete |
| Tasks 1.23–1.39 — Durability behavior and recovery boundary | ✅ Complete |
| Phase 1 — Architectural Foundation Alignment                | ✅ Complete |
| Phase 1 Project Review / Checkpoint                         | ⏳ Next     |
| Phase 2 — Authority and State Alignment                     | ⏭ Next     |

---

# Completed Phase 1 Sequence

## Tasks 1.1–1.4 — Initial Foundation Alignment

The first Phase 1 cluster:

- established the foundational ownership map;
- identified authored Setup transaction ownership as distributed;
- introduced one atomic store-owned authored Setup commit;
- investigated `PreviewScreenContainer`;
- classified it as obsolete;
- removed the obsolete Preview path;
- preserved supported `DayFrameApp → PreviewScreen` behavior.

The resulting authored Setup path is:

```text
DayFrameApp.saveCurrentSetup
        ↓
commitAuthoredSetup
        ↓
one store-owned authored transition
```

The resulting Preview coordination path is:

```text
DayFrameApp
    ↓
PreviewScreen
```

---

# Tasks 1.5–1.20 — Legacy `shiftCycle` Alignment

Tasks 1.5–1.20 completed a staged investigation and retirement of the old singular
shift-cycle representation from current architectural authority.

The work deliberately separated:

```text
historical compatibility
```

from:

```text
current architectural authority
```

rather than deleting singular support indiscriminately.

## Writer Alignment

Current local-storage, profile, and backup writers now emit plural:

```text
shiftCycles
```

only.

Historical readers continue accepting singular:

```text
shiftCycle
```

where repository-produced historical data requires it.

## Runtime Alignment

Removed:

- `DayFrameState.shiftCycle`;
- singular runtime mirror synthesis;
- singular store-initialization fallback;
- `setShiftCycle`.

Current runtime uses:

```text
DayFrameState.shiftCycles
```

only.

## Core Scheduling Alignment

Removed obsolete singular collection aliases from:

- `generateBlockCandidates`;
- `getActiveShiftSegment`;
- `generateCycleWorkBlocks`;
- `generateSchedulePreview`.

The supported scheduling path is now:

```text
DayFrameState.shiftCycles
        ↓
generateSchedulePreview({ shiftCycles })
        ├── generateCycleWorkBlocks({ shiftCycles })
        └── generateBlockCandidates({ shiftCycles })

effective preference resolution
        └── getActiveShiftSegment({ shiftCycles })
```

## Normalized Authored Data

Removed obsolete:

```text
DayFrameAuthoredSetup.shiftCycle
```

`DayFrameAuthoredSetup` is plural-only.

---

# Task 1.20 — Compatibility Horizon

Task 1.20 established that no current evidence justifies retiring the remaining
raw singular readers.

The reader classifications are:

## Local Authored State

**Retain Until Explicit Criteria Are Met**

Legacy local state can converge to plural-only persistence, but migration remains
lazy and unobservable at the population level.

## Saved Profiles

**Retain Until Explicit Criteria Are Met**

Legacy profiles normalize in memory, but loading a profile does not rewrite the
source profile collection.

## V1 Backups

**Retain Indefinitely for Now**

Historical backup files are externally held and cannot be automatically rewritten
or globally detected.

No finite retirement horizon is currently defensible.

---

# Tasks 1.21–1.22 — Durable-Data Governance

Task 1.21 investigated DayFrame's durable-data compatibility and format-versioning
requirements.

Task 1.22 adopted the resulting policy through:

`ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

The adopted surface commitments are:

| Surface            | Commitment                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Active local state | Bounded backward compatibility with eager or durably observable migration before historical-reader retirement |
| Saved profiles     | Strong bounded compatibility, atomic migration, preservation of unconvertible entries, explicit recovery      |
| Backup files       | Long-lived versioned direct import plus continued conversion/recovery support before direct-reader retirement |

The ADR also establishes that:

- formats are independently versioned;
- incompatible semantic or representation changes require a new version or
  migration epoch;
- unsupported historical data must not silently degrade;
- pre-public-release repository-produced data receives the normal compatibility
  presumption unless explicitly excluded;
- compatibility retirement requires explicit architectural authorization.

---

# Existing V1 Compatibility

Existing V1 representations remain intentionally supported:

```text
dayframe-store-v1
    historical singular + current plural family

profile version 1
    historical singular + current plural family

backup version 1
    historical singular + current plural family
```

These V1 identifiers span multiple writer generations and therefore cannot
themselves distinguish singular from plural historical data.

Current writers remain plural-only.

---

# Tasks 1.23–1.27 — Persistence Outcomes and Retained Durability

This sequence established factual persistence reporting and store-owned durability
knowledge.

## Persistence Outcomes

Persistence helpers now distinguish factual outcomes including:

```text
persisted
removed
unavailable
storageFailure
serializationFailure
```

as applicable to the operation.

Runtime mutations remain session-first:

```text
valid runtime mutation
    ↓
runtime state applied
    ↓
persistence attempted
    ↓
durability outcome reported
```

A persistence failure does not roll back a valid runtime transition.

## Store Mutation Results

Persisting store operations expose their persistence result to the initiating
workflow.

Runtime/domain success and persistence success are therefore independently
observable.

## Retained Durability

The store retains per-surface durability outside `DayFrameState`.

Current durability vocabulary is:

```text
unknown
durable
unavailable
storageFailure
serializationFailure
```

for:

```text
activeState
profiles
```

`unknown` is not treated as failure.

Durability status is infrastructure truth, not domain state.

---

# Task 1.28 — Retry Semantics and Authority

Task 1.28 established the governing retry rule:

> Retry attempts again to establish the store's current desired durable condition.

Rejected models included:

- replaying the original failed mutation;
- replaying a last-failed snapshot;
- workflow command replay;
- persistence-operation queues.

The authoritative retry source is:

```text
current desired durable condition
```

with:

```text
snapshot
```

meaning the latest complete current representation, and:

```text
absent
```

meaning durable key absence after clear.

Retry initiation belongs to user/workflow interaction.

Retry execution and interpretation belong to the store.

---

# Task 1.29 — Desired Durable Condition

The store now privately retains per-surface desired durable condition:

```text
snapshot
absent
```

outside `DayFrameState`.

Ordinary persistence establishes:

```text
snapshot
```

intent.

Clear establishes:

```text
absent
```

intent.

This distinction allows failed clear operations to be retried safely without
mistaking reset runtime defaults for data that should be persisted.

---

# Task 1.30 — Persistence Accessor Failure Normalization

Throwing `globalThis.localStorage` access during writes/removals is normalized to:

```text
storageFailure
```

through the existing persistence outcome model.

This allows ordinary mutations and clear to complete their established
session-first path instead of allowing accessor exceptions to escape.

Read/hydration accessor behavior remains a separately deferred lifecycle concern.

---

# Task 1.31 — Explicit Store-Owned Retry

The store exposes explicit surface-specific retry:

```text
retryActivePersistence()
retryProfilePersistence()
```

Retry eligibility is:

| Durability Status      | Ordinary Retry |
| ---------------------- | -------------- |
| `storageFailure`       | Yes            |
| `unavailable`          | Yes            |
| `serializationFailure` | No             |
| `durable`              | No             |
| `unknown`              | No             |

Snapshot retry uses the latest complete current representation.

Absence retry repeats removal.

Retry:

- changes no `DayFrameState`;
- sends no ordinary state notification;
- updates only retained durability;
- returns an exact discriminated result.

---

# Task 1.32 — Workflow Durability Feedback Contract

Task 1.32 adopted:

```text
immediate contextual feedback
        +
persistent app-level durability awareness
```

Immediate mutation results answer:

> What happened during this operation?

Retained durability answers:

> Does this durable surface still need attention?

The investigation established a real need for a separate reactive durability
subscription because retry may change durability without changing
`DayFrameState`.

---

# Task 1.33 — Durability Subscription

`DayFrameStore` now exposes a separate retained-durability subscription.

Conceptually:

```text
getState()
subscribe()
    → runtime/domain truth

getDurabilityStatus()
subscribeDurability()
    → retained durability truth
```

A logical store operation emits at most one durability notification and emits none
when the final retained durability snapshot is unchanged.

Clear batches active/profile durability into one final notification.

Retry can produce a durability notification while ordinary `DayFrameState`
subscribers remain silent.

---

# Task 1.34 — Shared Durability Semantic Classification

A pure shared classification layer translates factual persistence/store outcomes
into workflow meaning.

Current semantic vocabulary is:

```text
durableSuccess
retryableUnavailable
retryableStorageFailure
recoveryRequired
internalNoOp
```

Key mappings include:

```text
unavailable
    → retryableUnavailable

storageFailure
    → retryableStorageFailure

serializationFailure
    → recoveryRequired

unknown
    → internalNoOp

alreadyDurable retry
    → durableSuccess
```

The classifier:

- contains no React;
- contains no product copy;
- performs no persistence;
- executes no retry;
- performs no store mutation.

Clear classification preserves aggregate and independent active/profile semantics.

---

# Task 1.35 — Immediate Workflow Durability Feedback

Every user-facing persisting workflow now consumes the shared semantic classifier.

Covered workflows include:

- Setup save;
- manual-event create/edit/delete;
- profile save;
- profile delete;
- profile load;
- backup import;
- clear local data.

Current workflow behavior can represent:

```text
runtime change succeeded
+
durability failed
```

without rolling back session state or falsely claiming durable success.

Immediate feedback remains workflow-local and may disappear with workflow
navigation.

---

# Task 1.36 — Persistent App-Level Durability Awareness

DayFrame now has one shell-level persistent durability-awareness surface.

It initializes from:

```text
getDurabilityStatus()
```

and updates through:

```text
subscribeDurability()
```

Active-state and profile durability are represented independently.

Persistent behavior is:

```text
unknown
    → silent

durable
    → silent

unavailable
    → persistent retryable awareness

storageFailure
    → persistent retryable awareness

serializationFailure
    → persistent recovery-required awareness
```

The surface survives in-app workflow navigation and clears automatically when the
retained durability surface converges to `durable`.

---

# Task 1.37 — Explicit User-Triggered Durability Retry

Persistent retryable awareness now exposes independent controls for:

```text
active state
profiles
```

Retry appears only for:

```text
retryableUnavailable
retryableStorageFailure
```

No Retry appears for:

```text
recoveryRequired
durableSuccess
internalNoOp
```

The controls invoke only:

```text
retryActivePersistence()
retryProfilePersistence()
```

They do not replay Setup saves, profile mutations, clear, or other originating
workflow commands.

Partial-clear failure can therefore be repaired through the correct store-owned
absence retry without exposing `snapshot | absent` to the UI.

---

# Task 1.38 — Serialization-Failure Recovery Boundary

Task 1.38 investigated what `recoveryRequired` should mean.

The principal finding was that no supported production UI path was found that
naturally creates unserializable authored data.

Current concrete serialization-failure tests deliberately inject invalid
programmatic runtime values.

The condition is therefore primarily a defensive integrity boundary in the
current implementation.

The investigation nevertheless established stable recovery principles.

## Runtime Preservation

After serialization failure:

```text
latest session intent
    → remains active in memory
```

## Durable Checkpoint Preservation

Serialization occurs before durable replacement.

Therefore:

```text
serialization failure
    ↓
no successful durable write
    ↓
previous durable representation remains untouched
```

## Recovery Boundary

Ordinary unchanged Retry is inappropriate.

A later ordinary mutation that changes the representation may serialize
successfully and naturally restore durability.

Automatic rollback, reset, reload, or schema-specific repair is not adopted.

## Future-Model Deferral

Current-model-specific work intentionally deferred includes:

- field-level repair;
- entity-specific serialization diagnostics;
- shift/template/recurrence-specific repair UI;
- invalid-profile surgery;
- schema-specific recovery tooling.

Those areas are expected to couple strongly to the later authored-data and engine
redesign.

---

# Task 1.39 — Recovery-Required Session-Risk Communication

Persistent recovery-required awareness now explicitly communicates:

- current session changes remain available;
- those changes are not durably saved;
- ordinary Retry is unavailable;
- reloading DayFrame may discard those changes;
- closing DayFrame may discard those changes;
- older saved data may return.

No:

- recovery control;
- rollback;
- reset;
- backup-export promise;
- unload interception;
- navigation blocking;
- model-specific repair

was introduced.

Task 1.39 completed the minimum Phase 1 serialization-recovery obligation.

---

# Current Durability Architecture

The current operational durability path is:

```text
USER ACTION
    ↓
STORE-OWNED RUNTIME MUTATION
    ↓
CURRENT SESSION STATE APPLIED
    ↓
PERSISTENCE ATTEMPT
    ↓
FACTUAL OUTCOME
    ├── persisted / removed
    ├── unavailable
    ├── storageFailure
    └── serializationFailure
    ↓
RETAINED DURABILITY STATUS
    ↓
SHARED WORKFLOW SEMANTICS
    ├── durableSuccess
    ├── retryableUnavailable
    ├── retryableStorageFailure
    └── recoveryRequired
    ↓
IMMEDIATE CONTEXTUAL FEEDBACK
    +
PERSISTENT APP-LEVEL AWARENESS
    ↓
USER RETRY when eligible
    ↓
STORE-OWNED RETRY
    ↓
RETAINED STATUS CONVERGENCE
```

The current architecture deliberately separates:

```text
DayFrameState
    = current runtime/domain truth

StoreDurabilityStatus
    = current durability knowledge

StoreDesiredDurableCondition
    = retry-routing intent

DurabilitySemanticCategory
    = workflow interpretation
```

None is treated as interchangeable with the others.

---

# Session-First Authority

The current durability model follows:

> A valid runtime transition remains authoritative for the current session even if
> durable persistence fails.

Persistence failure therefore does not:

- roll back runtime state;
- suppress a valid mutation;
- reload older data;
- regenerate domain state;
- pretend the mutation itself failed.

Instead, DayFrame records and communicates the durability discrepancy.

---

# Retry Authority

The current retry rule is:

```text
current desired durable condition
    ↓
snapshot
    → persist latest current representation

absent
    → remove durable key
```

Retry does not preserve or replay historical failed commands.

This means newer runtime intent supersedes older failed persistence attempts.

---

# Recovery Boundary

Current ordinary retry covers:

```text
unavailable
storageFailure
```

Current recovery-required classification covers:

```text
serializationFailure
```

No model-specific recovery machinery is currently justified.

The minimum safety boundary is:

```text
preserve current runtime intent
preserve prior durable representation
communicate session-end risk
allow continued editing
never automatically discard or roll back
```

---

# Durable / Derived Data Boundary

The current durability work protects authored/recovery-relevant state rather than
treating all runtime data as durable authority.

This principle is expected to become more important during future engine
alignment:

```text
USER-AUTHORED / RECOVERY-RELEVANT STATE
    → preserve / migrate / recover

RECOMPUTABLE ENGINE OUTPUT
    → derived
    → invalidate / regenerate
```

The exact authored-data boundary remains a Phase 2 authority question.

---

# Existing V1 Reader Status

The remaining raw singular compatibility readers remain unchanged.

## Local State

**Retain Until Explicit Criteria Are Met**

## Saved Profiles

**Retain Until Explicit Criteria Are Met**

## V1 Backups

**Retain Indefinitely for Now**

The accepted durable-data ADR governs their future treatment.

No Task 1.23–1.39 durability work authorized reader retirement.

---

# Validation Status

Current validated baseline after Task 1.39:

- `npm run lint` — passed
- `npm run typecheck` — passed
- `npm test` — passed
- `npm run build` — passed
- affected-scope `git diff --check` — passed

Current automated baseline:

**23 test files / 366 tests passing**

The current suite protects:

- historical singular local/profile/backup compatibility;
- plural current runtime/core authority;
- persistence outcomes;
- mutation-result semantics;
- retained durability;
- desired durable condition;
- storage-accessor normalization;
- store-owned retry;
- durability subscriptions;
- semantic classification;
- immediate workflow feedback;
- persistent cross-navigation awareness;
- explicit user-triggered Retry;
- partial-clear retry;
- recovery-required suppression of Retry;
- session-end risk communication.

Repository-wide `git diff --check` continues to identify pre-existing whitespace in
architecture documentation outside the executable task scopes. That cleanup should
be performed when those documents are intentionally edited rather than folded into
an unrelated implementation task.

---

# Phase 1 Completion Assessment

Phase 1 has completed the architectural foundation work currently required by the
accepted execution sequence.

Completed foundation areas include:

## Transaction Ownership

```text
Setup save
    ↓
one store-owned authored transaction
```

## Preview Coordination

```text
DayFrameApp
    ↓
PreviewScreen
```

## Shift-Cycle Authority

```text
historical raw input
    → normalization
    → shiftCycles-only current architecture
```

## Durable-Data Governance

```text
user data
    ↓
explicit compatibility/versioning policy
```

## Durability Authority

```text
runtime truth
≠
durability truth
≠
retry intent
≠
workflow semantics
```

## Failure / Retry / Recovery Boundary

```text
transient persistence failure
    → explicit Retry

representation failure
    → recoveryRequired
    → preserve + communicate
```

No additional Phase 1 durability implementation is required before proceeding.

---

# Remaining Architectural Findings

Earlier Phase 1 audits identified additional concerns including:

- manual-event command ownership;
- feedback aggregation;
- focus and continuity ownership;
- duplicated date-conversion helpers;
- seeded-store purpose.

Some of these findings may now be superseded or reframed by the completed Phase 1
architecture.

They should not automatically become implementation tasks.

Phase 2 should re-evaluate them through the broader authority/state model rather
than continuing the original finding list mechanically.

Persistence-failure authority is no longer an unresolved finding; Tasks 1.23–1.39
established that authority comprehensively.

---

# Phase 2 — Authority and State Alignment

## Status

**Next architectural domain**

Phase 2 should begin with investigation rather than mutation.

The first investigation should establish the current and intended boundaries for:

### Authoritative State

Which state objects represent primary truth?

### Derived State

Which values can always be recreated from authoritative inputs?

### Invalidation

Which layer decides that derived information is stale?

### Replacement

What exactly happens when authored state is replaced through:

- profile load;
- backup import;
- future recovery;
- other replacement operations?

### Ownership

Which layer is authorized to perform each transition?

---

# Recommended Phase 2 Opening Question

The next question is:

> **What current DayFrame state is authoritative, what is derived, and which layer
> owns invalidation and replacement of each?**

This investigation should precede substantial scheduling-engine restructuring.

The goal is to establish a stable state authority model before later engine work
changes the shape or volume of derived data.

---

# Why Phase 2 Precedes Engine Redesign

Future DayFrame architecture is expected to contain richer authored concepts and
significantly more derived scheduling information.

A likely conceptual boundary is:

```text
AUTHORED INTENT
    Commitments
    Goals
    Priorities
    Constraints
        ↓
SCHEDULING / ALLOCATION ENGINE
        ↓
DERIVED OUTPUT
    Schedule
    Capacity
    Allocations
    Recommendations
    Friction
    Projections
```

The exact implementation remains future work.

Phase 2 must establish the authority rules before those concepts are implemented.

The durability foundation created in Phase 1 should remain largely independent of
that engine transformation because it protects authoritative authored/recovery
state rather than current engine internals.

---

# Documentation Governance

The following rules remain active.

## Current-State Documentation

Current implementation documents describe the architecture as it exists now.

## Historical Documentation

Audits, task results, checkpoints, and archived documents preserve the state that
existed when they were created.

Historical references to removed structures remain valid historical evidence.

---

# Task Artifact Governance

Task specifications remain immutable once execution begins.

Execution outcomes are recorded separately:

```text
TASK_X.Y_NAME.md
TASK_X.Y_NAME_RESULT.md
```

Pre-execution artifact integrity must be verified before work begins.

A finding does not itself authorize implementation.

Investigation and implementation remain separate where uncertainty warrants it.

Task-specific checkpoints are created only when explicitly authorized.

---

# Execution Model

Implementation continues according to:

```text
Investigate / Review
        ↓
Authorize
        ↓
Implement
        ↓
Validate
        ↓
Document
        ↓
Checkpoint
        ↓
Commit
```

Architecture governs implementation.

---

# Governing Principles

Implementation should preserve:

- Determinism
- Explainability
- Information Provenance
- Epistemic Integrity
- Explicit Authority
- Historical Immutability
- Architectural Traceability
- Continuous Validation
- Documentation Integrity
- Forward Migration Safety
- User Data Preservation
- Session-First Runtime Authority
- Separation of Authoritative and Derived State

When evidence is insufficient, DayFrame should preserve uncertainty rather than
invent certainty.

---

# Immediate Next Steps

1. Complete the Phase 1 project review.
2. Update governance documentation reflecting Tasks 1.23–1.39 where appropriate.
3. Create the Phase 1 / session checkpoint.
4. Resolve the known architecture-document whitespace while those files are
   intentionally in scope.
5. Commit and push the validated Phase 1 baseline.
6. Begin **Phase 2 — Authority and State Alignment** with an investigation of
   authoritative state, derived state, invalidation, and replacement ownership.
7. Do not extend the durability sequence unless a concrete future architectural
   dependency requires it.

---

# Canonical Documents

## Architecture

- `DAYFRAME_COMPLETE_ARCHITECTURE_SPECIFICATION.md`
- `ARCHITECTURE_CHARTER.md`
- `DECISIONS.md`
- `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`

## Audit

- `Implementation_Architecture_Audit.md`
- `Implementation_Architecture_Audit_Synthesis.md`
- `Implementation_UX_Audit.md`
- `Implementation_UX_Audit_Synthesis.md`

## Planning

- `Alignment_Strategy.md`
- `Implementation_Roadmap.md`
- `Implementation_Execution_Plan.md`

## Implementation

- Phase 1 Task Specifications
- Phase 1 Task Result Artifacts

## Governance

- `CURRENT_STATE.md`
- `CHANGELOG.md`
- Session Checkpoints
- Phase Checkpoints
- Architectural Decision Records

---

# Open Questions

## Phase 2 State Authority

Which current state structures own primary truth?

Which values are derived?

Which derived values should never be durable authority?

Who owns invalidation?

What constitutes replacement rather than mutation?

What must survive a replacement operation?

How should Preview and later scheduling-engine output relate to authored state?

---

## Future Durable Formats

Future authored-model changes may require:

- new local persistence versions;
- profile migration epochs;
- new backup versions;
- conversion tooling.

Those decisions remain governed by the accepted durable-data ADR and should be made
when the future authored model is sufficiently defined.

---

## Serialization Recovery

Current model-specific serialization repair remains intentionally deferred.

If future authored data makes representation failure realistically reachable,
DayFrame should revisit:

- diagnostics;
- defensive export;
- repair tooling;
- recovery surfaces;

against the then-current authored architecture.

---

# Phase 1 Determination (Historical)

DayFrame has completed Tasks **1.1 through 1.39** of
**Phase 1 — Architectural Foundation Alignment**.

The phase has produced coherent foundations for:

```text
transaction ownership
Preview coordination
canonical shift-cycle authority
durable-data governance
persistence outcome authority
retained durability
explicit retry
reactive durability observation
workflow durability semantics
persistent user awareness
recovery-required safety
```

The durability sequence is intentionally complete for now.

Current executable validation is:

```text
23 test files
366 tests passing
lint passing
typecheck passing
build passing
```

## Commitment Composition V1

Task 8.4 establishes revisioned Attachment Relationship authority between ordinary,
incarnation-safe Commitment sources. Parent occurrences deterministically derive real
attached activity occurrences, effective protected Buffers, classified composite
footprints, and required liabilities. Accepted CompositeDecision records are replayed
atomically against an exact composite fingerprint; stale decisions apply no deltas.

The schedule suppresses an actively attached child's independent recurrence and includes
only relationship-derived occurrences. Required placement failure produces durable-derived
liability and corrective Friction; optional failure is an explicit omission. Historical
plan snapshots retain composite, parent, pairing, and relationship-revision provenance,
while each attached activity remains one ordinary execution subject.

Composition authority participates in IndexedDB schema 9, Backup V9, protected restore,
runtime authority replacement, and full clear. Older backups migrate to explicit empty
composition; lossy V8 export is refused. Capacity, Goal-specific feasibility, Allocation,
Proposal, and inferred Progress are not implemented. Composition and the prior Goal
Structure/Goal Planning surfaces load lazily to preserve the hard initial bundle budget.

**Evidence:** `TASK_8.4_COMMITMENT_COMPOSITION_V1_DOMAIN_PAIRING_AND_FOOTPRINT_RESULT.md`.

## Capacity and Goal-Specific Feasibility V1

Task 8.5 establishes Capacity as a deterministic, demand-neutral read model over exact
canonical user-day windows. Current Preview activity—including Work, Commitments, manual
events, and Task 8.4 support activities—is occupied time; effective Buffers are protected
time. Half-open exclusions are unioned once before complement. Unplaced ordinary
Commitments and Composite Liability conservatively qualify their affected user-day rather
than becoming clean allocatable time. Interval topology is canonical; totals are derived.

Goal-Specific Feasibility evaluates exactly one current Task 8.3 Demand Projection against
the public Capacity contract. It respects structural eligibility, exact horizon,
contiguity, splittability, minimum/preferred/maximum session duration, session count, and
authored partial satisfaction. Opportunities neither reserve Capacity nor create
Allocation, Proposal, Friction, decisions, or scheduled Goal work.

No general-availability authority currently exists, so V1 uses the governed neutral
geometric-openings policy. Capacity and Feasibility are lazy, non-authoritative, and not
persisted; IndexedDB schema 9 and Backup V9 remain current. Phase 8 foundation semantics
are complete and ready for Phase 9 competing-demand and Allocation work.

**Evidence:** `TASK_8.5_CAPACITY_AND_GOAL_SPECIFIC_FEASIBILITY_V1_RESULT.md`.

## Accepted Resource Footprint Propagation V1

Task 9.2.1 adds explicit reusable Demand Resource Footprint Specifications and
Demand-specific associations under Goal Planning V2. Feasibility projects and
proves complete productive, support-activity, and Buffer-protection Candidate
Parent footprints; Competition and Allocation consider all claims; Proposal and
new AcceptedAllocation V2 records preserve the exact authorized footprint.

Only productive minutes satisfy Demand. Support consumes Capacity as activity;
Buffer protects Capacity as non-activity. Legacy accepted V1 records receive no
inferred authority. IndexedDB remains schema 10; Backup V11 is canonical and
lossy V10 export is refused. Task 9.3 remains blocked pending Task 9.2.2 identity.

**Evidence:** `TASK_9.2.1_ACCEPTED_RESOURCE_FOOTPRINT_PROPAGATION_V1_RESULT.md`.

## Realized Schedule Identity Foundation V1

Task 9.2.2 defines the downstream identity contract required to realize complete
AcceptedAllocation V2 authority. `acceptedAllocation` is now a first-class durable
schedule-reference and publication origin. Productive Goal work, support activity,
and Buffer protection are separate roles: productive/support own activity time and
are execution-capable; Buffer protects time and is structurally non-executable.

Pure factories derive deterministic one-claim/one-subject identities with exact
accepted geometry, canonical user-day, Realization seam, decision/Proposal,
Goal/Demand, Candidate Parent, component, and target lineage. HistoricalPlan V3
snapshots can freeze those facts while V1/V2 history stays unchanged. No realization
store or runtime schedule path exists yet. Schema 10 and Backup V11 remain current.
The Task 9.3 architecture reopen is closed; Task 9.3 is now unblocked.

**Evidence:** `TASK_9.2.2_REALIZED_SCHEDULE_IDENTITY_FOUNDATION_V1_RESULT.md`.

The current execution boundary is:

```text
PHASE 1
Architectural Foundation Alignment
        ↓
PROJECT REVIEW / CHECKPOINT
        ↓
PHASE 2
Authority and State Alignment
```

The next implementation work should not extend durability merely for additional
completeness.

The next task should establish **which DayFrame state is authoritative, which is
derived, and who owns invalidation and replacement** before substantial engine
restructuring begins.

---

# Phase 3 Progress-Derivation Boundary

ExecutionHistory V1 now supplies explicit categorical evidence, but DayFrame has
no production progress, adherence, completion-rate, Goal, streak, or learning
derivation. Current Preview Summary content remains planning/friction metadata.

The accepted Task 3.7 boundary is:

```text
ExecutionHistory -> reported-evidence categorical summary
fresh Preview + ExecutionHistory -> volatile current-Preview reporting coverage
durable historical plan ledger -> required for historical plan follow-through
explicit Goal domain -> required for Goal progress
```

Partial receives no arbitrary fractional credit. Not reported remains uncertainty.
No scalar completion/adherence score is authorized. Derived values are
non-authoritative and non-durable by default.

**Evidence:** `CHECKPOINT_Phase_3_Progress_And_Adherence_Semantics.md`, Task 3.7.

## Historical Plan Authority Readiness (Historical; superseded by Tasks 3.11–3.12)

Task 3.9 determined that historical reporting denominators require an independent
HistoricalPlanSurface. Current Preview, PlanDecision, and ExecutionHistory cannot
reconstruct never-reported past planned occurrences.

The accepted V1 model is append-only complete user-day publications grouped by an
atomic fresh-Preview generation batch. Stale/Try Preview never publishes;
identical day plans deduplicate; later publications supersede operative day
authority without deleting revisions. Missing ledger coverage remains unknown.

At Task 3.9, implementation was not yet authorized because collection scale,
atomic batch writes, and indexed range/as-of queries exceeded the bounded
localStorage prototype.
The next prerequisite is a transactional Phase 3 collection storage foundation,
preferably IndexedDB and shared with long-lived ExecutionHistory.

**Evidence:** `CHECKPOINT_Phase_3_Historical_Plan_Ledger_Semantics.md`, Task 3.9.

## Durable Collection Storage Foundation (Historical Task 3.10 state)

Task 3.10 implemented a domain-neutral native IndexedDB infrastructure boundary
with additive schema upgrades, lazy/injected opening, commit-aware atomic
multi-store mutations, indexed bounded queries, structured-clone isolation,
connection/versionchange handling, and normalized expected failures.

At Task 3.10, no production object store or consumer existed yet. Active,
Profiles, PlanDecision, and ExecutionHistory remained on localStorage. The
transition was intentional:
HistoricalPlan pure domain comes next, then its IndexedDB persistence;
ExecutionHistory migration follows under a separate anti-resurrection contract
before Backup V3 and broader release.

**Evidence:** `CHECKPOINT_Phase_3_Durable_Collection_Storage_Foundation.md`, Task 3.10.

## Durable Cross-Storage Restore Foundation (Historical prerequisite chronology)

Task 3.14A provided an interruption-safe, domain-format-neutral authority replacement transaction across Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan. A strict startup journal, verified target/recovery staging, source recheck, atomic two-participant IndexedDB replacement, verified local writes, anti-resurrection preservation, deterministic roll-forward/rollback, and coherent runtime installation are executable. Store bootstrap recovery precedes ordinary authority initialization. Backup V3 was not yet implemented at this historical point; Task 3.14 subsequently completed it.

**Evidence:** `CHECKPOINT_Phase_3_Durable_Cross_Storage_Restore_Foundation.md`, Task 3.14A.

## Phase 9 Planning Scope Contract

Task 9.4 establishes five separately typed canonical user-day scopes: Planning Data
Horizon, Proposal Horizon, Review Scope, Preview Range, and Publication Range. All
use finite half-open `[startUserDayDate, endUserDayDateExclusive)` geometry. The
planning-horizon resolver records requested/effective bounds and structured
expansion reasons; Proposal productive authority remains bounded while complete
support/Buffer footprints must be covered. Review is non-authoritative and defaults
from the configured preview range without durable navigation state. Preview coverage
is separate from freshness, publication requires an explicit fully covered range,
and the planning review query preserves scheduled, accepted, proposed, historical,
coverage, and display-clipping epistemic distinctions. Schema 11 and Backup V12 are
unchanged.

## Phase 9 Canonical Planner and Month

Task 9.5 makes Month the first canonical Planner overview over one bounded
`queryPlanningReview` call per displayed month. A deterministic presentation adapter
keeps derived Work/Commitments, realized Goal work, support, Buffer protection,
accepted-unrealized authority, Proposals, Preview coverage/freshness, planning-data
coverage, and HistoricalPlan coverage explicit. Selected-day presentation filters
the already-bounded month result without becoming an authority or date model.
Legacy Review Schedule/Preview and DayVisualizer remain the detailed corrective
workflow; Today remains operationally separate. Navigation remains session state,
and schema 11/Backup V12 are unchanged.

## Phase 9 Canonical Review Schedule

Task 9.6 composes the Task 9.4 planning query, Task 9.5 presentation semantics,
existing Preview/DayVisualizer, Friction/SuggestedFix, and Proposal authority into a
bounded Review Schedule workflow. Pure ordered reason codes derive review readiness
and publication readiness. Incomplete planning coverage, missing/stale/mismatched
Preview, unresolved Friction, accepted-unrealized authority, and invalid publication
geometry fail closed; actionable Proposal is explicit nonblocking decision attention.
Proposal accept/reject uses existing commands, prevents duplicate pending action, and
re-queries canonical truth. Publication readiness is exposed, but a second publish
command is intentionally not added because current publication materializes through
Preview generation. No reviewed flag/store exists; schema 11 and Backup V12 remain.

## Phase 9 Explicit Publication Workflow

Task 9.7 separates Preview generation from publication. Review Schedule explicitly
converts its bounded Review Scope into a distinct Publication Range and calls the
single `publishScheduleRange` command only after derived readiness. The command
requeries canonical planning truth, verifies complete coverage, a current covering
Preview, zero unresolved Friction, zero accepted-unrealized claims, and the reviewed
source fingerprint, then atomically commits the existing immutable HistoricalPlan
batch. Exact retries are idempotent; changed later schedule truth may create another
immutable publication. Publication creates no current schedule, execution, Progress,
acceptance, or realization authority. Schema 11 and Backup V12 remain unchanged.

Task 3.14A.2 corrected the concrete restore seam: durable payloads no longer masquerade as private runtime snapshots. Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan each reconstruct settled runtime authority from verified durable evidence, and one store-owned coordinator is available before readiness for deterministic interrupted recovery. Backup V3 remained pending at that point and is now implemented by Task 3.14.

## Complete Backup V3

Task 3.14 provides strict complete-authority Backup V3 export/import across Active, Profiles, PlanDecision, ExecutionHistory quarantine/revisions, and HistoricalPlan. Standard UI export is V3; V1/V2 imports retain prior semantics. V3 is canonical, clone-isolated, JSON-safe, fingerprinted independently of `exportedAt`, blocks whole protected surfaces, includes accepted pending authority, clears Preview, and delegates transaction/recovery to Task 3.14A. No cloud, sync, metrics, Goals, or learning capability is implied.

## HistoricalPlan-Backed Execution Reporting Reachability

Task 3.15A makes current effective HistoricalPlan day authority a production reporting source. A bounded date-selected UI converts each stored scheduled, unplaced, omitted, or blocked occurrence directly into the existing historical execution target using its exact durable reference, frozen title/category/plan, and published user-day context. It does not consult current Active/Profile/Preview authority, publish or mutate HistoricalPlan, or introduce historical metrics. Preview-backed reporting remains unchanged and both paths converge on the existing ExecutionHistory workflow.

## Five-Authority Full Clear

Task 3.15B makes full clear an asynchronous terminal authority operation. Its canonical enumerable result covers Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan; Preview is separately guaranteed cleared. ExecutionHistory replaces established IndexedDB authority with verified empty established authority while retaining its anti-resurrection marker, and HistoricalPlan settles an empty ledger. Mixed terminal outcomes are partial; pending IndexedDB work is never reported as partial. Restore/authority transactions continue to block concurrent mutation. P3-GAP-002 is closed; Task 3.15C completed validation stabilization and governance reconciliation, leaving only Task 3.16 closure audit.
