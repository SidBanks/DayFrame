# Protection preflight reproduction — RESULT

## Scope and provenance

Run from `code`:

```sh
npm exec vitest -- run --config ../docs/implementation/phase-9/evidence/task-9.29-continuation-2/protection-preflight-config-RESULT.mjs --maxWorkers=1
```

The isolated config includes only `protection-preflight-RESULT.test.ts`, outside permanent tests. It imports the existing acceptanceLifecycleTestFixtures factory: fresh MemoryStorage/fake-indexeddb and explicit 2026-09-16 evaluation time, full productive 60 / support 30 / buffer 15 minute footprint, saved Sleep/Goal/Demand. It adds valid saved Thursday Work/cycle data, reevaluates the actual allocation, derives/records the resulting Proposal, generates the real one-day Preview, and queries explicit September 17 Review scope. No fake readiness, fabricated accepted record or mocked publish result is used. All six cases first assert canonical publication eligibility is healthy.

The same real durable adapter is supplied to Proposal/realization and registered HistoricalPlan owners. Mutate wrappers forward actual admission and native transaction observer. This is real adapter execution against fake-indexeddb, **not native-browser certification**. The test intentionally reproduces existing behavior; passing it does not mean the application contract gap is repaired.

## Exact ordering and controls

1. Capture healthy canonical Review evidence.
2. Accept the exact freshly derived Proposal ID/revision/preferred option.
3. Fault only the indicated boundary after real physical work: lose outward acknowledgment by throwing after commit (`lostAck`); suppress outward delivery with a never-resolving promise after commit (`missingAck`); or omit a row from one verification readback after commit (`verification`). Native terminal delivery remains real. Physical Proposal authority is retained.
4. Verify unconfirmed acceptance, Proposal protection, original current acceptance receipt, no adopted runtime accepted allocation, and no automatic realization.
5. Requery canonical Review. In the three gap cases shared publicationBlockers is empty, readiness.publicationReady is true, and source fingerprint equals the preacceptance value.
6. Invoke public canonical publishScheduleRange with the **freshly returned** fingerprint and exact publication range/time. Assert `published` with original current publication receipt and one actual HistoricalPlan transaction; compare raw history/export/reopen exactly.
7. Verify ordinary clear rejects protection, preserving Proposal authority. Fresh bootstrap can validate the physically complete accepted authority: one accepted allocation with all three claims. After explicit generation/query it produces acceptedAllocationUnrealized. This is bootstrap verification, not in-session protection dismissal or a recovery workaround.

| Case                 | Acceptance result                                     | Proposal state                          | Shared blockers after acceptance                     | Publication / physical history transactions    |
| -------------------- | ----------------------------------------------------- | --------------------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| lostAck              | unconfirmed / commitStateUncertain                    | protected                               | none                                                 | published / 1                                  |
| missingAck           | unconfirmed / commitStateUncertain                    | protected                               | none                                                 | published / 1                                  |
| verification         | unconfirmed / verificationFailedAfterCommit           | protected                               | none                                                 | published / 1                                  |
| knownAbort           | rejected                                              | accepted ingress                        | none                                                 | published / 1; correctly no accepted authority |
| healthyUnrealized    | accepted; realization admission denied                | accepted ingress                        | acceptedAllocationUnrealized                         | rejected / 0                                   |
| realizationUncertain | accepted; realization unconfirmed after actual commit | accepted ingress; realization protected | acceptedAllocationUnrealized, materializationFailure | rejected / 0                                   |

`knownAbort` appends an invalid missing-key operation to the real Proposal transaction, causing a real abort. `healthyUnrealized` denies realization physical admission; `realizationUncertain` loses its outward acknowledgment after real commit. These controls rule out blanket rejection being necessary and show existing ordinary liabilities/realization protection can already block this fixture.

Each `protection-<case>-observation-RESULT.json` retains exact runtime/raw authorities, outcomes, fingerprints, readiness, transaction counts, original receipt checks as booleans, clear result, reopened history and accepted lineage. JSON serialization of outcome is only evidence output, never used as a runtime receipt or input for follow-up commands. Full authority comparisons preserve IDs, revisions, timestamps, optional absence and nested order; the sorted role-name assertion only checks presence of the three roles, without normalizing stored objects.

## Earlier diagnostic limits and corrections

`protection-fixture-failure-RESULT.log` records initial fixture generation failure because shiftCycles were absent. Adding lawful saved Work/cycle data and deriving a fresh Proposal fixed the fixture; this is not an application defect.

`protection-exploratory-RESULT.test.ts`, its log/observation and the initial `protection-preflight-observation-RESULT.json` retain the first successful one-case exploration. Its publication transaction counter was attached only to the injected Proposal/realization adapter, while HistoricalPlan had a separate handle. The old zero counter is **not zero-write evidence**. Actual export already showed publication. Final six-case diagnostics supply one registered adapter to all relevant owners and count the actual HistoricalPlan transaction (one in each gap case). Use final per-case observations and final log for the finding.

The final source also explicitly requires the clear promise to reject, rather than merely catching an exception. It was formatted and rerun: six cases pass. No permanent test, assertion, timeout or application behavior was weakened.

## Meaning and evidence limits

The owner correctly protects unsettled certainty and refuses destructive clear. The gap is that planningScopeQuery consumes readable Proposal lists without their protection qualification; publicationEligibility and its canonical command can therefore treat missing accepted liabilities as healthy absence. A fresh canonical requery/fingerprint does not cure it. No replacement race is required.

This does not prove existing user history is corrupt, data was lost, every protection cause behaves identically, or all owner combinations are affected. It does not classify a persisted population or prescribe historical cleanup. No nonempty native Actual/Progress/V14 round trip or new mobile workflow was run. The appropriate result is the authorized architecture-decision stop, preserving independent ledger findings and completed repairs.
