# Checkpoint — Phase 6 User-Day Transition and All-Day Publication Architecture

**Date:** 2026-08-24

**Status:** Architecture accepted; implementation prerequisites pending

Task 6.3A adopts label-indexed piecewise user-day starts. Each label's effective boundary opens its day and the next label's start closes it, yielding unique half-open ownership and truthful short/long transition days.

HistoricalPlan will add occurrence snapshot V2 with explicit tagged all-day/timed provenance. V1 remains `unavailableLegacy` and is never inferred from current authority. Backup V6 is expected to carry both versions through updated HistoricalPlan validation without an envelope bump.

No production behavior changed. Task 6.3 remains blocked until Task 6.3B remediates the resolver and fixed-24-hour consumers and Task 6.3C implements HistoricalPlan timing provenance compatibility. Task 6.4 remains downstream of Task 6.3.
