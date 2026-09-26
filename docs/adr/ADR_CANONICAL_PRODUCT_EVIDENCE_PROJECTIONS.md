# Canonical Product Evidence Projections

Status: Accepted for Task 9.19's bounded implementation, under the Task 9.17/9.18 authority contracts.

## Context

Calendar, Today, historical reporting and accepted-planning views currently consume complementary queries. They cannot safely converge by treating a selected date as Today’s evaluation instant or joining accepted work by title, duration, or adjacency. First-class Sleep, immutable publication, realized support/protection and execution each retain separate authority.

## Decision

Use **Model B: separate G1 and G2 projections sharing only low-level references/types**. Neither projection depends on the other. Pure composition lives in `code/src/core/productEvidence/`; lazy read-only adapters live in `code/src/state/`. No React component or navigation hook owns these semantics.

- `querySelectedDayEvidence({ ownerDay, asOf })` composes current authored/manual context, explicitly current Preview evidence, accepted realized facts, current Sleep resolution, retained publications for the owner, and effective execution evidence at the real as-of. Families have their own availability; there is no misleading overall “complete day” claim.
- `queryAcceptedPlanningEvidence({ startUserDayDate, endUserDayDateExclusive, asOf, select? })` traces accepted iterations and scheduled facts using stored IDs/revisions. The required half-open owner range is at most 366 days. An optional selector targets a Goal, Accepted Allocation, or scheduled fact. Historical snapshots can retain lineage when current records are unreadable; this is reference evidence, not verified reconstruction of missing source records.

The shared vocabulary contains scoped availability, canonical publication/execution references, date validation and deterministic ordering only. It is not an aggregate authority object.

## Ownership and time

Each projection is **read-only and disposable**. It **owns no time, no persistence, and no authority**. It **cannot create authority or repair authority**. It cannot accept planning, realize work, publish, record execution, measure Progress, convert Sleep, or save setup.

G1 separates selected owner label from real evaluation instant. Canonical day resolvers own current boundaries. Published offsets, labels, intervals and provenance remain frozen. Current authored context and Preview are explicitly current-source context even when inspecting a past owner; they do not reconstruct historical setup. Sleep resolution delegates to the existing solver once per query and retains its native qualification/status and guard-owner semantics.

G2 uses `origin` and `lineage` on realized facts, exact accepted IDs/revisions, acceptance decisions, Proposal IDs/revisions/options, and immutable V3 publication snapshots. Proposal lifecycle/successor metadata does not revoke accepted allocations. There is no accepted-allocation supersession authority to infer from newer timestamps. Acceptance and realization visibility use their recorded timestamps, publication uses published-at, and execution uses recorded-at. Current Goal context and current Proposal lifecycle are not as-of reconstructions.

## Protection and actions

Unavailable families have explicit status/reason rather than counterfeit empty payloads. Available empty publication history means not published; a retained publication with no items is a known-empty plan. Older legal accepted publication snapshots without V3 frozen lineage remain `legacyLineageUnavailable`, with partial coverage and no false no-lineage claim. Missing execution is unknown; skipped assertions, corrections and retractions retain canonical execution records. G2 marks partial fact coverage explicitly when a lineage source is unreadable.

Historical indexed reads reuse existing physical batch validation. Day queries read relevant retained versions through the existing owner/as-of index. Sleep execution protection retains the existing global validation of retained execution-to-publication references; exact referenced batches are read by ID rather than exporting all publication history. This intentionally costs work proportional to retained Sleep references where the existing authority contract requires it.

Published generic action targets come from `materializeHistoricalPlanExecutionTarget`; Sleep targets come from `publishedSleepExecutionTarget`. A target is not a promise that a later write will be admitted: the command rechecks current authority. Buffers remain protection and are not reportable activities. No generic `canComplete` flag exists.

## Consequences

The store adds lazy query functions and HistoricalPlan adds only read methods. No persisted schema/version, writer, migration, or projection cache changes. Query output can support compact item disclosure plus deeper lineage details on both mobile and desktop without presentation-specific semantics.

Task 9.18 navigation and compatibility mounts remain intact. G1/G2 do not implement the final Day Worksurface, unified Summary, arbitrary-history recovery, found time, recurring Demand, or Progress inference. A future Day surface must honor family coverage and command rechecks before retiring compatibility components. Summary still needs product-level grouping/filtering and presentation, not title/time provenance heuristics.

## Validation

Task 9.19's result records deterministic and mutation-isolation tests, exact Network+ multi-acceptance provenance, frozen-history tests, scoped/global protection checks, larger-data measurements, full regression/static checks and the unchanged 170,000-byte initial-gzip gate.
