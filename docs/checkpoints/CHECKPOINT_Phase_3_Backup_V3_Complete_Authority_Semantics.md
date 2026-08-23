# Checkpoint — Phase 3 Backup V3 Complete Authority Semantics

**Status:** Implemented and validated

Backup V3 is DayFrame's portable, storage-engine-independent representation of Active V2, Profiles V2, PlanDecision V1, ExecutionHistory V1 including governed quarantine, and HistoricalPlan V1 complete publication history. It excludes Preview, OutcomeSummary/coverage, durability status, restore journal/staging, physical database wrappers, and retained legacy ExecutionHistory migration evidence.

V3 preserves all domain identities and timestamps exactly. Accepted pending ExecutionHistory records and HistoricalPlan batches are exported as authority; their former persistence status is not. Whole protected/uninterpretable authority blocks canonical export, while governed quarantine remains canonical evidence.

Import validates the complete strict envelope before mutation, constructs five participant targets, and delegates replacement to Task 3.14A/3.14A.2. Restore is complete replacement, clears Preview, creates no execution record, publishes no HistoricalPlan batch, and retains anti-resurrection.

V1/V2 semantics remain unchanged. Ordinary UI export is V3. Physical storage migration alone does not require Backup V4; V4 requires an incompatible portable authority-contract change.

Invariants: backups contain domain authority rather than storage layout or runtime state; all five surfaces validate before restore; historical references need not resolve to current Active; no merge, allocation, retimestamping, workflow replay, or derived-state restoration occurs; fingerprints exclude `exportedAt`; JSON/restart roundtrips preserve semantic authority.
