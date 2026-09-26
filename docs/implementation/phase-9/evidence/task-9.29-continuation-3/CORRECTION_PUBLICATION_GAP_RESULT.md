# Accepted omission cannot be materialized for publication — RESULT

**STOP CONDITION — EVIDENCE CONTRACT GAP**

Task 9.29 Continuation 3 §§5, 9, 10, 13(9–12), 14 and 16 require lawful corrective acceptance followed by explicit Build, without a presentation-owned publication workaround. This sequence is blocked in the unchanged canonical owners.

## Reproduction

From `code/`:

```sh
npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29-continuation-3/correction-repro-config-RESULT.mjs --maxWorkers=1
```

The retained diagnostic uses the actual store, real Review V2 witness, canonical Suggested Fix mapper, actual PlanDecision acceptance and actual publication command. It is deliberately outside the permanent application suite and asserts the observed blocked result; its passing status demonstrates the gap, not product success.

1. Establish qualified saved setup, first-class Sleep and a flexible 60-minute Routine within 14:15–15:15. The initial canonical materializer is eligible.
2. Add a fixed 14:30–15:30 Event and explicitly generate. Routine has a canonical `skipBlock` Suggested Fix.
3. Apply that exact fix provisionally; map original/revised evidence through `createPlanDecisionAcceptanceCandidate`.
4. Explicitly accept its exact durable occurrence and regenerate from saved state.
5. Read qualified Review V2, call the canonical materializer using its original private source snapshot, and call `publishScheduleRange` with the fresh fingerprint and same period.

Observed in `correction-publication-repro-evidence-RESULT.json`:

- `queryState: current` asserted; every required source is qualified.
- Preview is current, has no `revisedAt`, has allocatable Sleep foundation and no unresolved Friction.
- Exact `omitOccurrence` is accepted and replayed as `applied`.
- Materializer returns `inconsistentPlanContext`, detail `planDecision:insufficientHistoricalContext`.
- Publication returns `rejected/materializationFailure`; zero publication attempts and zero historical transactions.

The production browser independently reached the same block after actual constructive acceptance/realization and exact Routine Skip Try/Discard/Try/Accept at 320px. See `browser-native-RESULT.log`, `native-timeout-diagnostic-RESULT.json` and the retained earlier `browser-materialization-diagnostic-RESULT.log`. The smaller diagnostic does not require constructive acceptance, so this is not inferred to be a realization-lifecycle defect.

## Source boundary

`core/decisions/replayPlanDecisions.ts` removes an omitted candidate and retains the applied decision result. `core/engine/generatePlanningSchedule.ts` returns candidates from that replay result. `core/historicalPlan/materializePlanPublication.ts` requests a historical target for every applied omission. `core/execution/historicalExecutionTarget.ts` searches the returned candidates for that exact reference; the reference still resolves, but the candidate is absent, so it returns `insufficientHistoricalContext`.

This explains this demonstrated ordering. It is not an all-family scheduling audit. No identity, snapshot, owner-day geometry, or historical omission evidence was fabricated in React to bypass it. Final preservation hashes show every `core`, `state` and `infrastructure` baseline file unchanged by this continuation.

Resolution requires an owner-level evidence contract/repair for historical materialization of accepted omissions. This continuation has no such authority. Keep the current protective refusal; specify and validate the canonical evidence before resuming the workflow acceptance gates.
