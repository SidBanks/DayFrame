# Checkpoint — Task 6.3 Architecture Prerequisite

**Date:** 2026-08-24

**Status:** Task 6.3 stopped; architecture prerequisite required

Task 6.3 cannot truthfully implement canonical Today semantics yet. Segment-specific
day-boundary overrides are valid, but no policy assigns instants uniquely when the
boundary changes between adjacent dates: later transitions create gaps and earlier
transitions create overlaps. Existing fixed-boundary helpers cannot resolve this
without invented precedence.

HistoricalPlan V1 also drops Preview's `isAllDay` marker and persists only scheduled
start/end instants. Today therefore cannot distinguish an all-day manual event from
an equivalent timed interval without changing publication semantics.

No production code, query, authority, persistence, schema, Backup, or UI was changed.
The next governed work is a bounded Today user-day boundary-transition and all-day
publication semantics architecture audit. Task 6.3 must resume after that decision;
Task 6.4 remains blocked on the read model.
