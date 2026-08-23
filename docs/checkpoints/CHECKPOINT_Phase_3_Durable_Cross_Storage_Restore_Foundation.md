# Checkpoint — Phase 3 Durable Cross-Storage Restore Foundation

**Status:** Implemented and validated

**Task:** 3.14A

DayFrame owns one infrastructure-only restore transaction across Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan. Both target and exact recovery authority are clone-isolated, fingerprinted, durably staged, reread, and participant-validated before live mutation. A strict localStorage journal gives every forward/rollback stage one deterministic restart action.

ExecutionHistory and HistoricalPlan replace in one IndexedDB transaction. Active, Profiles, PlanDecision, and the ExecutionHistory anti-resurrection marker replace with per-key reread verification. Source evidence is rechecked immediately before the first write. Once durable authority verifies, the existing five-participant runtime transaction installs the selected side and flushes coherent notifications.

Invariants:

- no live mutation precedes verified target and recovery staging;
- no source mismatch commits;
- no hybrid IndexedDB authority can commit;
- partial localStorage writes remain journal-recoverable;
- rollback uses only verified recovery staging;
- invalid evidence causes protection, never heuristic selection;
- cleanup never selects authority;
- restore allocates no domain identity or timestamp;
- Backup V3 remains a consumer not part of this checkpoint.

The implementation remains single-active-tab. Source recheck is mandatory; optional browser locking is deferred.

## Task 3.14A.2 Amendment

Durable participant payloads and private runtime targets are now explicit separate generic types. Each real participant validates durable authority and deterministically translates it into settled runtime state before the coordinator permits live durable mutation. The same translation is repeated from verified staged target or recovery evidence immediately before coherent runtime installation.

The DayFrame store owns one capability-scoped concrete coordinator and five-participant registry before readiness. Interrupted recovery installs translated authority into non-public runtime shells, then ordinary collection initialization rereads the converged durable side; readiness becomes usable only afterward. Backup V3 remains absent and will contain neither physical restore payloads nor private runtime state.
