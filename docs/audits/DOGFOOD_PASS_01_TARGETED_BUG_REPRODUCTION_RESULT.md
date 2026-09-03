# Dogfood Pass 01 Targeted Bug Reproduction Result

## 1. Executive Result

The three unresolved Dogfood candidates are sufficiently bounded for implementation alignment, and none is a confirmed current defect. `DF-006` reproduces only as a Saturday-owned overnight Work occurrence whose elapsed time crosses into calendar Sunday; it does not reproduce as unauthorized canonical-Sunday recurrence. `DF-017` and `DF-018` do not reproduce through the current supported Commitment model because that model has no Commitment-to-Commitment reference edge. A current `beforeSleep` preference is a placement category, not a reference to a Sleep Commitment. Unknown experimental reference-shaped properties are ignored, but there is no evidence that such a property represented the Dogfood state.

Overall closure is **TBR3 — Resolved Without Current Defects**. The next gate is **Path A — Implementation Alignment Strategy**.

## 2. Scope

This investigation is limited to `DF-006`, `DF-017`, and `DF-018`. It traces current production behavior, inspects relevant existing tests, and runs deterministic in-memory reproductions. It makes no production, test, architecture, governance, or roadmap change and implements no fix.

## 3. Source Inventory

Primary evidence:

- `docs/audits/DOGFOOD_PASS_01_FINDINGS_RECONCILIATION_RESULT.md`
- `docs/audits/DAYFRAME_DOGFOOD_PASS_01_FINDINGS.md`
- `docs/architecture/POST_PHASE_7_ARCHITECTURE_SYNTHESIS_RESULT.md`
- `code/src/core/shifts/types.ts`
- `code/src/core/shifts/generateWorkBlocks.ts`
- `code/src/core/cycles/generateCycleWorkBlocks.ts`
- `code/src/core/time/canonicalUserDay.ts`
- `code/src/core/blocks/types.ts`
- `code/src/core/blocks/validateBlockTemplate.ts`
- `code/src/core/authored/validateDayFrameAuthoredSetup.ts`
- `code/src/core/blocks/generateBlockCandidates.ts`
- `code/src/state/dayFrameStore.ts`
- Relevant test files listed in section 29.

The original ledger records observations but does not preserve a complete serialized Dogfood setup, exact generated occurrence payload, or screenshot-level provenance for these three findings. Conclusions below therefore separate direct current execution from historical inference.

## 4. Truth Model

- **Intended Truth:** Work recurrence is authorized from the applicable start-date/cycle source and assigned canonical user-day ownership; malformed recursive scheduling authority should fail closed. Current Commitment preferences are categorical placement intent.
- **Implemented Truth:** Work blocks retain start-date provenance and canonical user-day identity through overnight crossover. Current Commitments expose no source-reference edge. Authored edits mark retained Preview stale.
- **Experienced Truth:** Dogfood showed Sunday-visible Work and a UI state understood as Sleep relative to itself followed by plausible-looking output. The ledger does not prove the canonical date of the Work or whether the output was newly generated.

Behavioral statements are labeled **Confirmed**, **Inferred**, or **Not Found**.

## 5. Reproduction Method

Relevant production TypeScript was compiled into `/tmp/dayframe-targeted-build`; two temporary scripts invoked the production Work/cycle generators and Commitment validation/candidate generation directly with frozen dates, timezone, boundary, sources, and ranges. Each key case was repeated. The temporary build and scripts were deleted after capture.

No UI automation was required: `DF-006` is distinguishable in generated provenance, while the decisive `DF-017`/`DF-018` fact is that the supported domain shape contains no target-reference property. A speculative unknown property was used only as a parser-tolerance control and is not treated as reconstructed Dogfood state.

## 6. Original Dogfood Evidence

**Confirmed:** The Dogfood ledger records `DF-006` as Work appearing Sunday although the tester believed neither shift included Sunday. It records `DF-017` as Sleep being configured relative to Sleep and accepted far enough to continue, and `DF-018` as plausible output afterward: workdays resembled prior `afterWork` behavior and off-days resembled midnight-to-08:00 placement.

**Not Found:** Exact shift payloads, cycle anchor, day boundary, timezone serialization, source occurrence ID, direct referenced ID, saved authored JSON, and proof that the post-edit Preview was fresh are absent. The reproduction therefore uses minimal conditions capable of distinguishing the suspected mechanisms.

## 7. DF-006 Intended Behavior

Weekday eligibility answers whether a shift starts on an authorized local calendar date. An overnight continuation may occupy the next calendar date without becoming recurrence on that weekday. `localStartDate` identifies the shift start; `userDayDate` identifies canonical ownership under the effective boundary; timestamps describe elapsed time; UI grouping can expose either calendar overlap or canonical ownership. Week-start preference changes presentation order, not recurrence membership.

## 8. DF-006 Production Trace

**Confirmed:** `ShiftDefinition` and `GeneratedWorkBlock` are defined in `code/src/core/shifts/types.ts`. `generateWorkBlocks` enumerates candidate local start dates, checks `workDays` against the start date's weekday, constructs overnight end time on the next calendar date, and retains start-date provenance. `generateCycleWorkBlocks` selects manual or repeating-cycle segments, delegates or constructs occurrences, and resolves canonical user-day ownership with `resolveUserDayContainingInstant`. Preview generation consumes these Work blocks downstream; display surfaces can show elapsed overlap on a calendar date without changing source recurrence identity.

The recurrence control date is the local shift start date (or the repeating sequence position attached to that date), not every calendar date touched by the block.

## 9. DF-006 Existing Tests

**Confirmed:** Existing shift, cycle, and canonical-user-day suites cover weekday filtering, overnight construction and start-date ownership, repeating sequences and explicit off-days, cycle modulo alignment, multiple shifts, and boundary resolution. They strongly cover the domain invariant but no single named test reconstructs the original unpreserved Dogfood setup or its rendering context. Sunday visibility versus Sunday authorization remains a useful explicit future regression scenario.

## 10. DF-006 Minimal Reproduction

Frozen input used timezone `America/Chicago`, boundary `03:00`, range `2026-05-30` through `2026-06-01`, and a Saturday-authorized shift `21:00–05:00` with `crossesMidnight: true`.

**Confirmed output:** identity `work_sat-night_2026-05-30`; `localStartDate` `2026-05-30`; `userDayDate` `2026-05-30`; local start Saturday at 21:00; local end Sunday at 05:00. Its UTC timestamps were `2026-05-31T02:00:00.000Z` through `2026-05-31T10:00:00.000Z`. Thus both serialized UTC dates are Sunday while recurrence and canonical ownership remain Saturday.

## 11. DF-006 Boundary Cases

- **A — Saturday overnight:** one block; Saturday source and canonical ownership; Sunday calendar overlap.
- **B — Saturday non-overnight 09:00–17:00:** one Saturday block; no Sunday overlap or ownership.
- **C — Sunday-only queried interval with Saturday non-overnight source:** no block.
- **D — repeating cycle:** Saturday night shift, explicit Sunday off-day, Monday control shift produced Saturday and Monday identities only; no Sunday canonical occurrence.
- **E — Sunday 00:00–04:00 calendar-overlap range:** includes the Saturday overnight interval, while `localStartDate` and `userDayDate` remain Saturday.

## 12. DF-006 Source-vs-Rendering Analysis

**Confirmed:** The source generator did not create unauthorized Sunday recurrence in any executed case. The reproduced symptom is calendar crossover: a Saturday-authorized block occupies Sunday clock time and can therefore appear in a calendar-overlap rendering. **Inferred:** The original Dogfood observation most likely conflated displayed calendar overlap with recurrence/user-day ownership. The exact historical renderer state is **Not Found**.

## 13. DF-006 Determinism

Repeating the frozen Saturday-overnight case returned the same semantic block identity, ownership date, and timestamps. No ambient clock or array-order dependency appeared. Timezone and boundary were explicit inputs.

## 14. DF-006 Classification

**BR3 — Valid Behavior / User-Day Interpretation.** Reproduction confirms a Sunday-visible interval but not Sunday recurrence. The explanation is calendar crossover plus Saturday canonical ownership. Primary subsystem: Work generation/user-day provenance; secondary concern: presentation clarity. Severity is revised from S1 to S3. Implementation alignment carries no defect fix, only provenance/display clarity and regression preservation.

## 15. DF-017 Intended Validation Rule

Recursive scheduling authority has no accepted semantics and should fail closed if such a graph is ever introduced: direct `A → A`, indirect `A → B → A`, and composition cycles would require rejection. In the current model, however, a Commitment cannot express `before Commitment X` or `after Commitment X`. `beforeSleep`, `afterWork`, and similar values are categorical preferred windows, not source IDs.

## 16. DF-017 Production Validation Trace

**Confirmed:** `BlockTemplate` in `code/src/core/blocks/types.ts` contains a `preferredWindow` enum but no target Commitment ID. `validateBlockTemplate` validates the supported fields; `validateDayFrameAuthoredSetup` invokes that validator while validating setup source identity and recurrence structures. Candidate generation copies the category into scheduling intent. The authoring UI exposes these categories, not a Commitment reference selector.

UI, store, domain, restore, and engine therefore have no current cross-Commitment relationship semantic to validate. Unknown object keys are not rejected by exact-shape validation, but candidate generation does not consume a speculative `relativeToTemplateId` key.

## 17. DF-017 Direct Self-Reference Reproduction

An exact supported `A → A` state could not be constructed because no target-reference field exists. A valid Sleep template with `preferredWindow: "beforeSleep"` passed validation and generated candidates; this is not self-reference. Adding a speculative unknown `relativeToTemplateId` equal to the template's own ID also passed shape validation but had no semantic effect. This control demonstrates open-object tolerance, not acceptance of a current relationship.

## 18. DF-017 Control Cases

- **Normal current preference:** `beforeSleep` validated and generated ordinary candidates.
- **Speculative A → B key:** ignored, with output identical to the baseline.
- **Speculative A → nonexistent key:** ignored, with output identical to the baseline.
- **Indirect A ↔ B:** not applicable in the supported schema; no relationship graph exists to cycle.

The normal, self-shaped, other-shaped, and missing-shaped unknown-key runs produced the same candidate semantics.

## 19. DF-017 Persistence/Restore Analysis

**Confirmed:** Current V2 setup validation reaches `validateDayFrameAuthoredSetup`. Runtime cloning/spreading and legacy normalization can preserve or tolerate unknown keys rather than treat them as semantic edges. **Inferred:** imported data containing an obsolete or invented reference-like key could survive as inert data at some boundaries, but it cannot create current relative-placement authority. The original persisted Dogfood payload is **Not Found**, so neither UI creation nor restore of the reported relation can be proven.

## 20. DF-017 Classification

**BR5 — Not Reproducible.** The current executable schema cannot represent the reported relationship, and the historical state needed to prove an obsolete behavior is absent. The current `beforeSleep` category is valid and must not be mislabeled as self-reference. Severity is revised from S1 to S3 as a historical validation/regression concern. No current defect fix enters implementation alignment.

## 21. DF-018 Relationship to DF-017

`DF-018` is analytically distinct: acceptance and downstream fresh generation are separate claims. Here both depend on a relationship edge absent from the current model. The current generator can produce plausible output from valid `beforeSleep` intent, while an unknown reference-shaped key is semantically ignored. Neither proves that current code generated fresh output from an invalid recursive relation.

## 22. DF-018 Stale-Preview Control

**Confirmed:** `dayFrameStore.test.ts` proves authored setup changes mark the current Preview stale rather than deleting it. Execution and historical-publication paths explicitly reject stale Preview as current authority. Therefore a plausible display after an invalid edit is not proof of new generation. **Inferred:** retained stale Preview is a viable explanation for the Dogfood appearance, but the ledger lacks freshness metadata and cannot distinguish it from valid `beforeSleep` generation.

## 23. DF-018 Generation Reproduction

The valid `beforeSleep` baseline generated daily Commitment candidates. Adding speculative self, other, or missing target keys yielded identical candidates on repeated execution: no referenced source, relation-derived window, diagnostic, recursion, or new semantic branch appeared. An exact invalid-self-reference generation case is not representable. No stale Preview participated in the direct domain reproduction.

## 24. DF-018 Fail-Closed Analysis

For supported inputs, fail-closed recursive-reference behavior is not applicable because recursive authority cannot enter the engine. Unknown keys are ignored rather than interpreted, so they do not create recursive scheduling semantics. If a future reference model is added, exact validation and cycle rejection must precede authoritative preview generation. Current stale Preview is explicitly identifiable and rejected by downstream authority paths.

## 25. DF-018 Plausibility Hazard

The historical hazard remains legitimate: output that looks reasonable can hide invalid intent, encourage false confidence, propagate malformed authored data, and obscure whether Preview is stale. Current evidence bounds this as a preservation requirement, not a reproduced current defect. Plausible current output is explained by valid categorical placement or possibly retained stale Preview, not proven recursive placement.

## 26. DF-018 Classification

**BR5 — Not Reproducible.** Fresh output from an invalid recursive relation cannot be produced through the current supported model, and the original Preview freshness evidence is missing. Severity is revised from S1 to S3. Implementation alignment should preserve stale labeling and record a future fail-closed regression requirement, not carry a speculative engine fix.

## 27. Root-Cause Matrix

| Finding | Reproduced? | Root Cause / Explanation | Primary Layer | Secondary Layer | Confirmed Defect? |
| --- | ---: | --- | --- | --- | ---: |
| DF-006 | Symptom only | Saturday overnight calendar crossover retains Saturday recurrence and user-day ownership | Work generation | Display interpretation | No |
| DF-017 | No | Current model has categorical preferences and no Commitment-reference edge | Domain model | Historical UI/state evidence | No |
| DF-018 | No | No recursive edge reaches generation; valid category or stale Preview can explain plausible display | Generation boundary | Preview freshness presentation | No |

## 28. Validation-Layer Matrix

| Invariant | UI | Store | Domain Validator | Persistence Restore | Engine | Preview UI |
| --- | --- | --- | --- | --- | --- | --- |
| Valid Work weekday | Present | Not Applicable | Present | Partial | Present | Not Applicable |
| Canonical user-day ownership | Not Applicable | Not Applicable | Present | Partial | Present | Present |
| No direct self-reference | Not Applicable | Not Applicable | Not Applicable | Not Applicable | Not Applicable | Not Applicable |
| No indirect reference cycle | Not Applicable | Not Applicable | Not Applicable | Not Applicable | Not Applicable | Not Applicable |
| Invalid relation fails closed | Not Applicable | Not Applicable | Not Applicable | Not Applicable | Not Applicable | Not Applicable |
| Stale Preview is identifiable | Present | Present | Not Applicable | Partial | Present | Present |

“Not Applicable” for reference invariants means the current schema exposes no such relation. Exact rejection of unknown keys is **Absent** in `validateBlockTemplate`; this is a generic hardening observation, not evidence of an active recursive edge.

## 29. Existing-Test Coverage Matrix

| Invariant | Existing Test File | Test Name / Scenario | Exact Coverage? | Gap |
| --- | --- | --- | ---: | --- |
| Weekday membership including Sunday exclusion | `core/shifts/__tests__/generateWorkBlocks.test.ts` | work-day filtering scenarios | Partial | No exact Dogfood fixture |
| Overnight calendar crossover | same | overnight shift construction | Yes | Rendering not included |
| Canonical user-day ownership | `core/time/__tests__/canonicalUserDay.test.ts` | boundary-containing user-day scenarios | Yes | No Dogfood renderer |
| Overnight start-date ownership | `core/cycles/__tests__/generateCycleWorkBlocks.test.ts` | overnight start-date ownership | Yes | None at domain layer |
| Cycle alignment/off-day | same | anchor modulo and repeating off-days | Yes | No original anchor payload |
| Direct self-reference | `core/authored/tests/validateDayFrameAuthoredSetup.test.ts`; `core/blocks/tests/validateBlockTemplate.test.ts` | supported schema validation | Not Applicable | No reference model exists |
| Indirect relation cycle | same | supported schema validation | Not Applicable | No graph exists |
| Missing relation target | same | supported schema validation | Not Applicable | Unknown keys are not exact-rejected |
| Invalid relation generation | block/engine tests | supported preferred-window generation | Not Applicable | No relation semantic exists |
| Stale Preview after edit | `state/tests/dayFrameStore.test.ts` | “marks the current preview as stale when authored setup changes” | Yes | Original Dogfood freshness absent |

## 30. Reproduction Matrix

| Case | Input | Expected | Actual | Repeatable? | Classification |
| --- | --- | --- | --- | ---: | --- |
| W-A | Saturday 21:00–05:00 overnight | Saturday recurrence, Sunday overlap | Saturday identity/ownership; Sunday elapsed time | Yes | Valid crossover |
| W-B | Saturday 09:00–17:00 | Saturday only | Saturday only | Yes | Valid |
| W-C | Sunday range, Saturday-only non-overnight | No Sunday block | None | Yes | Valid |
| W-D | repeating Sat night / Sun off / Mon control | No canonical Sunday Work | Saturday and Monday only | Yes | Valid cycle alignment |
| W-E | Sunday 00:00–04:00 overlap query | Saturday-owned overlap | Saturday identity/ownership returned | Yes | Valid crossover |
| C-0 | supported `beforeSleep` | valid candidates | valid daily candidates | Yes | Valid preference |
| C-A | speculative unknown self ID | no relationship semantics | identical to baseline | Yes | Not a supported relation |
| C-B | speculative unknown other ID | no relationship semantics | identical to baseline | Yes | Not a supported relation |
| C-C | speculative unknown missing ID | no relationship semantics | identical to baseline | Yes | Not a supported relation |
| C-D | indirect cycle | not constructible | no schema edge | Not Applicable | Not Applicable |
| P-A | authored setup mutation with current Preview | retained Preview marked stale | covered by existing store test | Yes | Stale control passes |

## 31. Severity Reassessment

- `DF-006`: **S1 → S3**. Evidence proves correct recurrence/ownership; remaining risk is interpretation and provenance presentation.
- `DF-017`: **S1 → S3**. The current supported model cannot express self-reference; preserve a future validation invariant and avoid treating unknown-key tolerance as a confirmed relation defect.
- `DF-018`: **S1 → S3**. Fresh invalid generation is not reproducible; stale Preview remains identifiable. The historical plausibility hazard warrants regression guidance.

## 32. Defect Relationship

**Model D — One or More Findings Are Not Current Defects.** In fact, none is established as a current defect. `DF-006` is valid crossover semantics. `DF-017` and `DF-018` share missing historical-state ambiguity but concern separate acceptance and generation claims; neither exists as a supported current relationship path.

## 33. Implementation-Alignment Consequences

- `DF-006`: carry no defect task; preserve start-date and canonical-user-day provenance, and consider existing UX/explanation clarity during normal alignment.
- `DF-017`: carry no speculative defect; preserve the invariant that any future reference graph rejects direct and indirect cycles.
- `DF-018`: carry no speculative engine fix; preserve stale-Preview distinction and fail-closed expectations for any future recursive authority.

These are constraints, not implementation tasks created by this result.

## 34. Regression Requirements

Future regression coverage should protect:

1. A Work pattern excluding Sunday does not generate a canonical-Sunday occurrence.
2. A Saturday overnight Work occurrence may contain Sunday timestamps without becoming Sunday recurrence.
3. Explicit cycle off-days remain occurrence-free regardless of adjacent overnight overlap.
4. Work identity retains local start date and canonical user-day provenance across display grouping.
5. If relative Commitment references are ever introduced, direct `A → A`, missing targets, and indirect cycles fail closed before save/restore/generation.
6. Malformed recursive scheduling input never silently produces a fresh authoritative-looking Preview.
7. An authored edit retains only clearly stale Preview, and stale Preview cannot become execution/publication authority.

## 35. Architecture Reopen Check

No finding requires accepted architecture to reopen. Current Work behavior matches canonical user-day architecture; current Commitment behavior lacks the suspected relation rather than contradicting an accepted relation design; current stale handling aligns with retained-but-nonauthoritative Preview semantics.

## 36. Reproduction Decisions

### BR-DEC-01

- **Decision:** Treat the Sunday-visible overnight block as reproduced.
- **Finding:** DF-006.
- **Reproduction:** W-A.
- **Classification:** Valid crossover.
- **Evidence:** Saturday source/start/user-day; Sunday elapsed time.
- **Root Cause / Explanation:** Calendar crossover.
- **Architecture Relationship:** Conforms.
- **Implementation Alignment Consequence:** No defect fix.
- **Regression Requirement:** Preserve start-date ownership.
- **Remaining Question:** Exact historical renderer is unavailable.

### BR-DEC-02

- **Decision:** Do not equate Sunday visibility with Sunday recurrence.
- **Finding:** DF-006.
- **Reproduction:** W-A/W-E.
- **Classification:** Valid interpretation.
- **Evidence:** Provenance stays Saturday.
- **Root Cause / Explanation:** Calendar and canonical dates differ.
- **Architecture Relationship:** Conforms.
- **Implementation Alignment Consequence:** Preserve provenance clarity.
- **Regression Requirement:** Assert both dates.
- **Remaining Question:** None affecting alignment.

### BR-DEC-03

- **Decision:** Cycle alignment is not the cause.
- **Finding:** DF-006.
- **Reproduction:** W-D.
- **Classification:** Valid cycle behavior.
- **Evidence:** Sunday off-day emitted no source.
- **Root Cause / Explanation:** Anchor modulo and explicit off-day behave correctly.
- **Architecture Relationship:** Conforms.
- **Implementation Alignment Consequence:** No defect fix.
- **Regression Requirement:** Preserve off-day control.
- **Remaining Question:** Original anchor absent.

### BR-DEC-04

- **Decision:** Canonical ownership follows the Saturday-containing user-day.
- **Finding:** DF-006.
- **Reproduction:** W-A/W-E.
- **Classification:** Valid user-day behavior.
- **Evidence:** `userDayDate=2026-05-30` at 03:00 boundary.
- **Root Cause / Explanation:** Canonical boundary resolution.
- **Architecture Relationship:** Conforms.
- **Implementation Alignment Consequence:** Preserve semantics.
- **Regression Requirement:** Assert canonical ownership.
- **Remaining Question:** None.

### BR-DEC-05

- **Decision:** Current direct self-reference is not constructible.
- **Finding:** DF-017.
- **Reproduction:** C-A.
- **Classification:** Unsupported shape.
- **Evidence:** No target field; unknown key inert.
- **Root Cause / Explanation:** Current model is categorical.
- **Architecture Relationship:** No contradiction.
- **Implementation Alignment Consequence:** No current fix.
- **Regression Requirement:** Reject cycles if model evolves.
- **Remaining Question:** Original payload unavailable.

### BR-DEC-06

- **Decision:** No current validation layer owns a nonexistent relation invariant.
- **Finding:** DF-017.
- **Reproduction:** Schema/validator trace.
- **Classification:** Not applicable currently.
- **Evidence:** UI/types/validator/generator expose no edge.
- **Root Cause / Explanation:** No graph semantic.
- **Architecture Relationship:** Conforms.
- **Implementation Alignment Consequence:** Avoid speculative guard.
- **Regression Requirement:** Add domain guard with any future edge.
- **Remaining Question:** Unknown-key exactness is general hardening only.

### BR-DEC-07

- **Decision:** Indirect cycles are not executable.
- **Finding:** DF-017.
- **Reproduction:** C-D.
- **Classification:** Not applicable.
- **Evidence:** No A→B relation field.
- **Root Cause / Explanation:** No graph exists.
- **Architecture Relationship:** No reopen.
- **Implementation Alignment Consequence:** Preservation constraint only.
- **Regression Requirement:** Future graph cycle detection.
- **Remaining Question:** None current.

### BR-DEC-08

- **Decision:** Do not call inert unknown-key persistence a reproduced relation.
- **Finding:** DF-017.
- **Reproduction:** C-A/C-B/C-C and restore trace.
- **Classification:** Inert tolerated data.
- **Evidence:** Outputs match baseline.
- **Root Cause / Explanation:** Non-exact object validation.
- **Architecture Relationship:** No semantic contradiction.
- **Implementation Alignment Consequence:** No defect carried.
- **Regression Requirement:** Future semantic fields require exact validation.
- **Remaining Question:** Historical serialized state absent.

### BR-DEC-09

- **Decision:** Fresh generation from self-reference is not reproduced.
- **Finding:** DF-018.
- **Reproduction:** C-A.
- **Classification:** Unsupported case.
- **Evidence:** Unknown key does not affect candidates.
- **Root Cause / Explanation:** No relationship branch.
- **Architecture Relationship:** No contradiction.
- **Implementation Alignment Consequence:** No engine fix.
- **Regression Requirement:** Future invalid relation must fail closed.
- **Remaining Question:** Original freshness absent.

### BR-DEC-10

- **Decision:** Retained stale Preview is a viable controlled alternative explanation.
- **Finding:** DF-018.
- **Reproduction:** P-A/existing test.
- **Classification:** Inferred historical explanation.
- **Evidence:** Authored edits mark Preview stale.
- **Root Cause / Explanation:** Intentional retention with staleness.
- **Architecture Relationship:** Conforms.
- **Implementation Alignment Consequence:** Preserve clear stale status.
- **Regression Requirement:** Stale Preview remains nonauthoritative.
- **Remaining Question:** Dogfood freshness metadata absent.

### BR-DEC-11

- **Decision:** Current recursive fail-closed execution is not applicable, not failed.
- **Finding:** DF-018.
- **Reproduction:** Schema and generation trace.
- **Classification:** Not applicable currently.
- **Evidence:** No recursive authority enters engine.
- **Root Cause / Explanation:** Relation absent.
- **Architecture Relationship:** Conforms.
- **Implementation Alignment Consequence:** Future-facing constraint only.
- **Regression Requirement:** Gate before generation if introduced.
- **Remaining Question:** None current.

### BR-DEC-12

- **Decision:** Treat DF-017 and DF-018 as distinct claims sharing the same evidence gap.
- **Finding:** DF-017/DF-018.
- **Reproduction:** C-A/P-A.
- **Classification:** Model D relationship.
- **Evidence:** Acceptance and freshness are independently unproven.
- **Root Cause / Explanation:** Missing historic payload/freshness plus absent current edge.
- **Architecture Relationship:** No reopen.
- **Implementation Alignment Consequence:** No combined defect task.
- **Regression Requirement:** Preserve validation and freshness boundaries.
- **Remaining Question:** Historical mechanics.

### BR-DEC-13

- **Decision:** Existing tests support but do not replace targeted reproduction.
- **Finding:** All.
- **Reproduction:** Six targeted suites plus scratch cases.
- **Classification:** Sufficient current evidence.
- **Evidence:** 203 tests passed and direct outputs captured.
- **Root Cause / Explanation:** Domain invariants are already broadly tested.
- **Architecture Relationship:** Conforms.
- **Implementation Alignment Consequence:** Proceed.
- **Regression Requirement:** Add explicit historical scenarios later.
- **Remaining Question:** None blocking.

### BR-DEC-14

- **Decision:** Reassess all three from S1 to S3.
- **Finding:** All.
- **Reproduction:** Full targeted set.
- **Classification:** Evidence-based downgrade.
- **Evidence:** No current correctness defect reproduced.
- **Root Cause / Explanation:** Valid crossover or unsupported historical state.
- **Architecture Relationship:** No reopen.
- **Implementation Alignment Consequence:** Constraints, not blockers.
- **Regression Requirement:** Section 34.
- **Remaining Question:** Historical provenance only.

### BR-DEC-15

- **Decision:** Carry bounded constraints into implementation alignment.
- **Finding:** All.
- **Reproduction:** Current traces.
- **Classification:** Alignment-ready.
- **Evidence:** Each candidate has one final disposition.
- **Root Cause / Explanation:** Current behavior is bounded.
- **Architecture Relationship:** Accepted architecture sufficient.
- **Implementation Alignment Consequence:** Path A.
- **Regression Requirement:** Preserve enumerated invariants.
- **Remaining Question:** None blocking.

### BR-DEC-16

- **Decision:** Close targeted reproduction without a current defect.
- **Finding:** All.
- **Reproduction:** W-A–W-E, C-0–C-D, P-A.
- **Classification:** TBR3.
- **Evidence:** Deterministic execution, traces, and targeted tests.
- **Root Cause / Explanation:** Valid user-day crossover plus nonrepresentable historical relation.
- **Architecture Relationship:** No change.
- **Implementation Alignment Consequence:** Proceed to Path A without beginning it here.
- **Regression Requirement:** Section 34.
- **Remaining Question:** None material to current alignment.

## 37. Validation

Executed from `code/`:

```text
npm test -- --run src/core/shifts/__tests__/generateWorkBlocks.test.ts src/core/cycles/__tests__/generateCycleWorkBlocks.test.ts src/core/time/__tests__/canonicalUserDay.test.ts src/core/authored/tests/validateDayFrameAuthoredSetup.test.ts src/core/blocks/tests/validateBlockTemplate.test.ts src/state/tests/dayFrameStore.test.ts
```

Result: **6 test files passed; 203 tests passed; 0 failed**.

Scratch execution:

```text
./node_modules/.bin/tsc --outDir /tmp/dayframe-targeted-build --noEmit false --declaration false --sourceMap false
node --experimental-strip-types /tmp/dayframe-targeted-repro.ts
node --experimental-strip-types /tmp/dayframe-self-reference-repro.ts
```

Results are recorded in sections 10, 11, 17, 18, 23, and 30. Repeated semantic inputs produced identical outputs.

## 38. Repository Modification Verification

The result was written only to `docs/audits/DOGFOOD_PASS_01_TARGETED_BUG_REPRODUCTION_RESULT.md`. Repository status was inspected before and after. Pre-existing working-tree changes and untracked documents were left untouched. No production source, test, architecture, governance, or roadmap file was modified by this investigation. `/tmp/dayframe-targeted-build`, `/tmp/dayframe-targeted-repro.ts`, and `/tmp/dayframe-self-reference-repro.ts` were removed; no reproduction scratch artifact remains in the repository.

## 39. Closure Classification

**TBR3 — Resolved Without Current Defects.** All three candidates have evidence-supported classifications, none is a confirmed current defect, and remaining historical provenance gaps do not prevent safe current implementation alignment.

## 40. Recommended Next Step

**Path A — Implementation Alignment Strategy.** This result selects the gate only; it does not begin that work, create tasks, assign a phase, or produce a roadmap.

## 41. Reproduction Conclusions

`DF-006` demonstrates why calendar date, shift start date, source identity, and canonical user-day must remain distinct. `DF-017` demonstrates that the Dogfood phrase “relative to Sleep” cannot be mapped onto the current categorical `beforeSleep` model without the missing historical payload. `DF-018` demonstrates why Preview freshness must be proven before attributing plausible display output to newly generated invalid semantics. The current executable evidence supports alignment without a defect correction, while retaining precise regression constraints against future recurrence, graph-validation, and Preview-authority regressions.

## 42. Completion Statement

**Dogfood Pass 01 Targeted Bug Reproduction complete.**

The reproduction investigates the three unresolved defect candidates from Dogfood Pass 01—Sunday Work alignment, self-referential Commitment acceptance, and plausible output from invalid self-reference—against DayFrame's accepted canonical user-day, Work, Commitment, validation, determinism, and fail-closed semantics; reconstructs the smallest supportable Dogfood conditions; distinguishes calendar crossover from canonical recurrence, source generation from rendering, authored-state acceptance from downstream engine behavior, and fresh generation from retained stale Preview; classifies each finding from current executable evidence without speculative fixes; records bounded root causes or evidence-based non-defect explanations, affected validation layers, severity, regression requirements, and implementation-alignment consequences; and determines whether DayFrame may proceed to Implementation Alignment Strategy without modifying production code, tests, architecture, governance, or implementation roadmap.
