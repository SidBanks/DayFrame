# ADR — Goal Measurement Definition Authority, Revision, Epoch, and Policy Model

**Status:** Accepted architecture; not implemented

**Date:** 2026-08-23

## Decision

Goal measurement semantics will live in one independent durable authored authority,
not in Goal, observations, HistoricalPlan, or derived Progress. A Goal may have no
measurement lineage; V1 permits at most one lineage per Goal, with one stable opaque
definition ID and immutable monotonic revisions. The exact `(definitionId, revision)`
pair identifies a measurement epoch. Revisions take effect when saved, cannot be
backdated, and form non-overlapping intervals. Active revisions contain policy and
configuration; an inactive revision ends measurement without deleting history.
Restarting appends a new active revision rather than reopening an old epoch.

The first built-in policy is `manualQuantityTarget@1`: absolute non-negative manual
observations in an exact matching built-in unit move toward a positive target.
Configuration contains canonical decimal-string `targetValue` and `unitId`; direction
is fixed to increase-toward-target, baseline and conversion are absent, and values may
exceed the target. Policy/config edits append a revision; normalized no-ops do not.

Future observations bind to Goal ID plus exact definition ID/revision and matching
unit. Corrections retain that binding. Progress remains derived and non-persisted.
The existing Goal measurement-policy reference is deprecated compatibility metadata
and must not participate in current-definition resolution. Manual quantity Progress
does not require HistoricalPlan or ExecutionHistory changes.

The authority will use an independent protected IndexedDB collection, centralized
mutation admission, shared notification scheduling, runtime snapshots/transactions,
full clear, and a complete next Backup/restore version. Older backups translate to
explicit empty measurement authority; no definitions are fabricated from Goal refs.

## Consequences

Task 5.12 must implement the complete durable authority and Backup boundary before
Planner UI or observations. Participant registries must become seven-member capable
without treating seven as final. All revisions remain retained and normal hard delete
is prohibited. Unknown structurally valid policies are preserved as unsupported;
malformed envelopes or known-policy config protect the authority.
