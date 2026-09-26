# Task 9.29.7 pre-edit contract reconciliation — RESULT

Recorded before application edits. This is an existing-semantics repair authorized by §§5–9, not a new domain or historical-snapshot decision.

## Defect and existing meaning

Task 3.4's historical execution target contract supports current applicable omitted template planning evidence with `plan: { state: "omitted" }` and no interval. Its original bridge expected an original candidate. Current canonical expansion still produces that candidate, but `replayPlanDecisions` removes it before `generatePlanningSchedule` returns `blockCandidates`. `fromDecision` searches that post-suppression collection. A resolvable reference alone intentionally cannot reconstruct historical context.

The inherited canonical reproduction is copied into this task's evidence directory, with its original source/observation preserved under Continuation 3. The healthy control is materialization-eligible. After exact supported Skip Try/mapping/Accept/regeneration, publication refuses `planDecision:insufficientHistoricalContext` without adapter mutation or physical history transaction. The new baseline reproduction output records this task's actual run.

## Required-data map

| Required datum | Canonical producer | Before replay | After replay now | Current consumer | Proposed handoff |
|---|---|---|---|---|---|
| Semantic occurrence identity, including source/recurrence incarnations and coordinate | `core/blocks/generateBlockCandidates.ts` → candidate OccurrenceIdentity | Present | Missing for omitted target | `createDurableOccurrenceReference`, exact equality with replay target; lifetime/reference validators | Copy only identity into an omission-specific context, never into placement candidates |
| Applied exact decision ID/kind/target | `state/planDecisionSurface.ts` validates/accepts; replay validates applicability and maps exact durable key | Accepted instruction | Applied replay result retained | `historicalExecutionTarget.fromDecision` selects decisionId and tests omit/applied | Context carries decisionId; consumer correlates exact target rather than array order |
| Canonical owner user-day | Canonical expansion candidate.userDayDate | Present | Removed with candidate | Existing user-day preferences and historical day membership | Retain userDayDate from the same expansion, including weekly owner selection |
| Current display title/category | Candidate produced from current saved template | Present | Removed with candidate | `sourceContext`, `validateExecutionHistoricalSnapshot` | Retain title/category only; freezes current plan context, not acceptance-time historical metadata |
| Effective day boundary / week starts / offset | Saved cycles/preferences + existing current-generation owner day | Available separately | Still available | `resolveEffectiveSchedulePreferencesForUserDayDate`, existing target-date noon offset convention | No new timezone policy or stored field; reuse helpers exactly |
| Generation provenance | `generatePlanningSchedule` input.generatedAt and planning window instants | Present | Preview wrapper retains generation/window | Current fresh/Try checks and new handoff association | Optional ephemeral evidence envelope records the same generation timestamp/window; consumer rejects mismatch |
| Plan state | Valid applicable replay of omitOccurrence | Derived by replay | Applied result retained | Existing `plan: {state: "omitted"}` validator | Unchanged; no startsAt/endsAt/zero duration/outcome |
| Goal-link provenance and publication timing | Existing materializer's current Goals/reference mapping; `timingForSelection` | Available independently | Available | HistoricalPlan V2 constructor/validators | Unchanged current Goal snapshot and existing unavailable timing for omission |
| Required Sleep, realized facts and complete source qualification | Existing captured Review sources and foundational scheduler | Available | Available | Same dry/actual materializer, validators and physical admission | No changed owner/input policy; new evidence rides the same scheduler result |

No duration, priority, preferred window, placement geometry, external resources, fix ID or complete BlockCandidate is needed for the omitted snapshot. Retaining the entire candidate is unnecessary.

## Selected narrow path

1. Add a readonly ephemeral occurrence-context type containing required identity, title, category, userDayDate and decisionId. Replay clones these original fields only after actual `omitOccurrence` applicability and exact candidate lookup, before suppression. The existing returned placement candidates, hard IDs and decision ordering stay unchanged.
2. Generation carries those contexts in an optional omission-evidence envelope with its actual timestamp/window. It is not an authority store, serialized Preview or new historical representation. No field is present for a healthy no-omission result.
3. The existing target consumer uses this context for applied omission only, validating generation association, exact decision/reference and source lifetime. Existing original-candidate inputs remain supported for the older current-context branch. Missing/mismatched data still refuses. Blocked placement and other materialization branches keep their existing inputs.
4. Complete publication filters a successfully resolved omitted target by its owner day just as other occurrence families are filtered by range. Missing evidence is checked before any range exclusion, so absence cannot silently disappear from the batch. This is existing scope fidelity, not suppression of a failed in-range record.

Both qualified Review dry materialization and actual Build call `core/historicalPlan/materializePlanPublication.ts` with the same captured setup/Preview/Goals/Sleep. That function's Sleep branch runs `deriveFoundationalSchedule`, which calls this same `generatePlanningSchedule`; it therefore receives the repaired evidence too. No parallel React or special publication route is introduced.

## Freshness, validation and compatibility

`state/reviewSourceQualification.ts` captures saved setup, PlanDecision, Composition, Goals, realization, Sleep and state using current source observations. `planningScopeQuery.ts` includes canonical materialized publication truth in the tagged runtime fingerprint. `schedulePublication.ts` additionally captures setup/Preview/Goals/Sleep and rechecks original observations through physical admission. New derived inputs are entirely functions of those existing observed inputs. No persisted fingerprint algorithm or freshness policy changes are necessary.

The evidence contains no scheduled interval and is never supplied to placement, occupancy, capacity or Friction. It is regenerated after reload. Removal/replacement of the decision and source replacement still invalidate via existing store observations/stale Preview and new generation. No new family eligibility, reporting controls, snapshot version, durable field, schema, serializer or reader is needed.

Canonical PlanDecision storage enforces one current target decision; acceptance replaces the existing target under its existing rules. Replay sorting and duration/priority/placement handling are untouched. Tests will cover lawful replacement/removal and detached pre-suppression context; raw conflicting invalid authority is not given new semantics.

## Baseline and retained work

Task input matches the supplied attachment byte-for-byte; no executed 9.29.7 RESULT/evidence existed. Baseline is HEAD plus 307 actual dirty status entries, 1,081 non-generated/non-evidence repository files, with prior evidence hashes recorded separately. This inventory intentionally excludes node_modules/dist/.git/evidence archives, so it is not the earlier continuation's differently scoped 1,801-file count. Continuation 3's full evidence and its 26 UI/test changes are retained. No applicable AGENTS.md was found in repository/ancestors. All old forensic logs, including the disclosed missing initial Move timeout, remain historical evidence.

Final pre-edit plumbing check: `state/dayFrameStore.ts::clonePreviewResult` explicitly copies fields rather than spreading the result. It must clone the optional envelope so `getState()` and captured qualified snapshots retain it without shared mutable identities. Try revisions remain rejected and fresh regeneration reconstructs their context. Baseline full suite passes 178 files / 1,831 tests; baseline raw/gzip/lazy/total bytes are 641,793 / 169,064 / 62,700 / 1,330,178.

Implementation reconciliation: semantic `OccurrenceIdentity` itself contains reusable source IDs, not incarnations. The omission context therefore also retains the already-validated durable replay `target` (template/recurrence lifetimes). The consumer compares that exact retained target with the selected replay target and the reference constructed from current canonical inputs. Owner day is checked against daily identity or the existing canonical week resolver for weekly identity. This is required current identity plumbing, not a new identity policy.

Validator reconciliation correction: `timingForSelection` supplies `{kind: "timed"}` for a PlanDecision selection; this is the existing timing family, not a scheduled interval. `plan: {state: "omitted"}` remains interval-free. No `unavailable` timing variant will be introduced. The initial regression expectation used the wrong name and is corrected to preserve the actual existing representation.
