# Checkpoint — Phase 6 Canonical Piecewise User-Day Windows

**Date:** 2026-08-24

**Status:** Task 6.3B complete; Task 6.3C pending

DayFrame now derives each user-day as `[start(D), start(D+1))` from label-specific effective authored preferences. Unique instant ownership, strict monotonic starts, variable-duration placement/openings, work ownership, manual all-day expansion, Preview overlap/clipping, and actual-duration visualization are implemented and green.

No durable authority, schema, migration, Backup envelope, Today query/UI, or behavioral transition policy was added. HistoricalPlan V1 remains unchanged. Task 6.3C is the remaining prerequisite before Task 6.3 may resume.
