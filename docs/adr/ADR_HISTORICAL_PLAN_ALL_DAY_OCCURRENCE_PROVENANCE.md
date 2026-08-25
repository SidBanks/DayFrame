# ADR — HistoricalPlan All-Day Occurrence Provenance

**Status:** Accepted

**Date:** 2026-08-24

## Context

Manual events author an explicit all-day boolean and Preview retains it, but HistoricalPlan occurrence V1 freezes only scheduled start/end instants. A user-day-wide event and a timed event can have the same interval, so intent cannot be reconstructed.

## Decision

Introduce `HistoricalPlannedOccurrenceSnapshotV2` with required timing provenance:

```text
timing: { kind: "allDay" } | { kind: "timed" }
```

Keep exact scheduled intervals in the plan. Preserve V1 records unchanged and interpret missing timing provenance as `unavailableLegacy`; never backfill it from current authored state. Dispatch strict validation by snapshot version, include version/timing in semantic fingerprints, and preserve the tag through clone, IndexedDB, JSON, Backup, restore, and republication.

Prefer an occurrence-only version bump. Existing enclosing versions and Backup V6 may remain when their contracts can explicitly transport the occurrence union; any wider bump requires implementation evidence.

## Consequences

New publications distinguish all-day from timed occurrences even for identical intervals. Legacy history remains usable but epistemically incomplete. A later republication supplies explicit knowledge only from its publication cutoff onward.
