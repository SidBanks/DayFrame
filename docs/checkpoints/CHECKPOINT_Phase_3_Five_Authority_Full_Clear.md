# Checkpoint — Phase 3 Five-Authority Full Clear

## Scope

Full clear covers the five durable authorities: Active, Profiles, PlanDecision, ExecutionHistory, and HistoricalPlan. Preview is cleared as derived runtime state and is not counted as a sixth authority.

## Terminal Settlement

`await clearLocalData()` returns only after both IndexedDB clear operations and all local authority attempts reach terminal outcomes. The canonical enumerable `authorities` object contains five results. Five successes produce `cleared`, mixed successes/failures produce `partiallyCleared`, and zero successes produce `failed`; pending is never folded into partial.

## ExecutionHistory and Anti-Resurrection

ExecutionHistory replaces established IndexedDB contents with valid empty established metadata, then removes legacy bytes where possible while retaining the established-authority marker. Restart remains IndexedDB-first even if stale legacy bytes are reintroduced. A durable clear failure remains visible and cannot produce top-level success.

## HistoricalPlan

HistoricalPlan atomically clears batch/day stores, pending publications, runtime metadata, and protection on successful recovery clear. Prior day queries return missing publication after restart; no empty publication batch is synthesized.

## Runtime, Preview, and Subscribers

The shared five-participant authority notification transaction defers participant callbacks until terminal settlement and coherent runtime clear. Preview is installed as absent at clear start. Historical reporting subscribes to the plan-history clear event and drops stale loaded rows.

## Restart and Restore Isolation

Local authority keys remain absent and IndexedDB authorities remain empty after restart. Full clear is centrally blocked during initialization, whole protection, restore, or another authority transaction. Restore journal/staging evidence is not removed by domain clear.

## Invariants

- Every durable authority result is enumerable and directly inspectable.
- Terminal success represents established cleared authority, not invoked calls.
- No arbitrary timing sleep is needed to observe clear completion.
- No HistoricalPlan publication, ExecutionHistory record, domain ID, store, or version is created.
- Backup V3 after successful clear exports empty historical authorities.
- P3-GAP-002 is closed; P3-GAP-003/P3-GAP-004 remain Task 3.15C.
