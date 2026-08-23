# Checkpoint — Five-Participant Runtime Authority Transaction Integration

DayFrame now has one runtime-only observable-authority transaction spanning Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan.

Each participant supplies a capability-scoped, clone-isolated snapshot and exact-install adapter. Exact installation changes runtime state only: it does not persist, allocate identities, retimestamp evidence, invoke ordinary workflows, or emit pre-commit domain events. The shared scheduler defers participant notifications until every target is installed, flushes each dirty participant channel once in deterministic order, and keeps ordinary mutation admission closed through the flush. Abort restores the complete five-participant snapshot and discards target notifications.

This checkpoint is not durable restore infrastructure. No restore journal, staging store, cross-storage commit, roll-forward, rollback, or Backup V3 exists yet. It establishes the runtime prerequisite consumed by resumed Task 3.14A.

