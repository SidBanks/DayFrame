# ADR — Canonical User-Day Boundary Transition Semantics

**Status:** Accepted

**Date:** 2026-08-24

## Context

Shift segments may author different day boundaries. Resolving an instant with a boundary selected from that instant's apparent segment creates gaps, overlaps, or circular fixed-point selection at changes.

## Decision

For every local date label `D`, resolve effective schedule preferences by `D` and construct `start(D)` on that local calendar date at its effective boundary. The canonical user-day is `[start(D), start(D+1))`. Starts must be strictly increasing. An instant belongs to the unique interval containing it.

Boundary increases create longer user-days; decreases create shorter user-days. The label is the date that supplies the start. Segment transition context is derived separately and cannot change ownership. Sleep preferences, Goals, execution evidence, work intervals, and future recommendations never determine temporal partition.

The existing fixed-boundary helper remains a primitive, not the variable-boundary resolver.

## Consequences

Transition days and DST days may have non-24-hour elapsed durations. Placement, clipping, all-day expansion, visualization, and work ownership must consume consecutive canonical starts. Future planning may compare adjacent regimes without redefining user-day truth.
