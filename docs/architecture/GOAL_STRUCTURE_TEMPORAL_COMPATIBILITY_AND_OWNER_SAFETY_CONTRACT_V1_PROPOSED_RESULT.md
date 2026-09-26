# Goal Structure Temporal, Compatibility & Owner Safety Contract V1

**PROPOSED — AWAITING ARCHITECTURAL ACCEPTANCE — NOT IMPLEMENTED**

Produced under Task 9.27.1. This is one recommended contract for review, not an accepted ADR, migration authorization, implementation, or reopening of Task 9.27. Existing architecture and historical RESULTs are unchanged.

## 1. Selected resolution and evidence basis

Adopt **prospective command correctness with lossless legacy preservation and explicitly qualified current-authority evaluation**. Keep the existing durable V1 Structure representation and supported backup readers. Do not tighten their acceptance predicates. Add a separate, derived temporal qualification owned by Structure; ambiguous accepted records remain inspectable/exportable but cannot become trusted planning evidence. Fix future Milestone patches and complete ordinary mutation admission with generation and actual-write checks.

This resolves the four gaps without guessing old intended dates or introducing a new durable temporal model. It does require bounded changes to the existing owner, query consumers, storage admission seam and transaction composition; it is not a React-only repair.

Evidence and precedence:

- Normative Structure specification §§5–25, 45–47, 57–64: opaque identities, revisioned history, separate applicability, explicit prerequisites and validated intervals. Broader accounting, automatic policies and traversal are not implemented authority.
- Task 8.2 RESULT §§8–26: current/exact queries, append-only records and atomic collection persistence. Current source implements these bounded contracts, with the defects documented below.
- Durable compatibility ADR, especially Format-Version Definition and Version-Increment Rules: preserving serialized keys alone is insufficient; newly rejecting accepted durable representations requires a format/migration decision.
- Cross-storage restore ADR and amendment: exact staging, verification, runtime translation, rollback and startup journal remain the sole recovery protocol.
- Goal identity ADR; Task 8.1 provenance/freshness foundation; product vocabulary and Appendix B: current identity is not historical knowledge, Proposed is not Accepted, and Requested Time is not Structure.
- Tasks 9.24–9.26 establish app-owned drafts, exact field fidelity, distinct acceptances, replacement invalidation and readiness protection. Task 9.26 remains accepted COMPLETE; Task 9.27 remains blocked.

The unchanged owner diagnostic reproduces: clock-rollback retirement with end before start, title-only rename replacing `satisfiedAt`, and denied-admission revision. The extended diagnostic directly reproduces denied relationship revision, retirement and retry issuing writes. These are controlled fake-IndexedDB observations, not claims about Dogfood data or native restore races.

## 2. Temporal definitions

| Concept              | Recommended meaning                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logical identity     | Existing opaque Goal/PlanningFactId. Never derive identity from titles, endpoints or time.                                                                                                               |
| Revision             | Existing increasing integer orders authored versions. Timestamps do not replace revision ordering.                                                                                                       |
| Status               | Active/retired authority of the latest relationship revision. Retirement does not delete history.                                                                                                        |
| Effective interval   | Stored relationship interval `[effectiveFrom, effectiveTo)`; absent end means unbounded. Equal endpoints are valid and denote an empty interval. Inverted endpoints are temporally ambiguous, not empty. |
| Command time         | One actual UTC ISO clock sample for an admitted semantic write; creation/update/lifecycle timestamps record that sample. Never clamp, swap, increment artificially or resample until convenient.         |
| Evaluation instant   | Explicit UTC instant supplied once per logical evaluation. It tests applicability of the current authority snapshot, not the planning horizon's start.                                                   |
| Freshness            | Whether current qualified authority and temporal membership still support the result. Revision equality alone is insufficient.                                                                           |
| Historical knowledge | Exact rows establish what a revision says; they do not reconstruct all Goal lifecycle states known at a past instant. This proposal supplies no historical reconstruction service.                       |

For a temporally coherent row and instant `t`, interval position is `beforeStart`, `inside`, `atOrAfterEnd` or `empty`. At start is inside except for an empty interval; at end is outside. A future-effective active row is currently `notApplicable/beforeStart`. Its source/target identities and record status remain visible.

**Applicability also requires latest active status.** A retired latest row is `notApplicable/retired` even if a supplied earlier instant lies within its stored interval. Expose both interval position and retired status; do not resurrect its previous revision. This deliberate distinction makes the query a projection of current authority, not a timeline. Exact historical row inspection can report its interval position without asserting historical Goal eligibility.

A later semantic revision that preserves `effectiveFrom` does not prove those new semantics were known at that earlier time. All results carry `basis: currentAuthority`; no consumer labels them “what was eligible then.” A historical-knowledge request returns `unavailable/historicalReconstructionUnsupported`, with no eligibility assertion.

## 3. Prospective clock and command rules

Sample time after lazy loading and admission, immediately before candidate construction. Admission and no-op checks precede allocation/persistence. Semantic no-ops preserve the existing revision and every timestamp and need no new time; denied admission still rejects them.

For every **changed** Structure command, require a valid ISO sample at least the maximum recorded command timestamp (`createdAt`/`updatedAt`) across the currently loaded Structure authority. This conservative owner-local high-water value derives from retained rows, survives reload, and resets only with explicit whole-authority replacement. Equal command times are allowed. It is not a new persisted clock or a clock inferred from target dates/evaluation times. An empty authority has no prior watermark: it cannot detect rollback before its first write and must not claim otherwise.

- Create: allocate only after these checks; `createdAt = updatedAt = effectiveFrom = now` for relationships. Milestones use existing creation fields.
- Revise: retain `createdAt`, interval, identity and provenance; use `updatedAt = now` only for a semantic change. Preserve legitimate future `effectiveFrom` values on existing rows; revising semantics before that future start does not activate the row.
- Retire relationship: additionally require `now >= effectiveFrom`. Append retired revision with `effectiveTo = updatedAt = now`. Equality produces an empty interval. A repeated retirement is a no-op, subject to admission.
- Milestone transitions follow §7; their actual transition time cannot precede the owner's watermark.
- Clock rollback rejects with existing `invalidInput`, plus runtime-only detail `clockBeforeRecordedAuthority` or `retirementBeforeEffectiveStart`. No runtime revision, desired snapshot, durable write or automatic retry occurs. Explain that the clock precedes recorded authority and preserve the draft; the user may correct the clock and explicitly retry.

New candidates must satisfy prospective temporal checks, but the shared legacy decoder remains unchanged. Do not validate old history with a newly tightened whole-authority predicate as a side effect of an unrelated save.

## 4. Canonical qualification and query contract

Structure owns pure temporal classification, applicability, reasons and time-sensitive freshness. React presents returned classifications only. Qualification checks **all retained rows**, including nonlatest revisions, for inverted relationship intervals, `updatedAt < createdAt`, decreasing update timestamps along one logical revision history, and lifecycle timestamps outside their recorded creation/update bounds. Missing/unsupported shapes remain the existing decoder's concern. A coherent future interval and an empty interval are not anomalies. Do not infer that a plausible satisfaction timestamp was caused by the rename bug.

Any accepted temporal anomaly makes this bounded Structure authority **preserved but temporally unqualified**. This conservative whole-Structure scope avoids inventing a new graph traversal for impact isolation. It returns exact issue IDs/revisions, keeps current/exact inspection and export available, makes all Structure eligibility `unknown`, and blocks ordinary Structure authoring/retry with `protected` plus `temporalQualificationRequired`. Other independent owners need not be globally blocked solely by this derived qualification. Planning consumers must receive unknown, never empty Structure. Existing malformed/read-failure/global-recovery protection remains stronger.

Proposed runtime-only API sketch (names are part of this recommendation, not implemented exports):

```ts
type StructureEvaluationInput = {
  goalId: GoalId;
  evaluationInstant: string;
  basis: "currentAuthority";
};
type StructureEvaluation = {
  version: 2; // derived query contract, NOT a persisted Structure version
  basis: "currentAuthority";
  evaluatedAt: string;
  qualification: "qualified" | "unavailable" | "protected";
  eligibility: "eligible" | "ineligible" | "conditionallyEligible" | "unknown";
  records: { status: "available"; values: Array<{
    id: PlanningFactId;
    revision: number;
    status: "active" | "retired";
    effectiveFrom: string;
    effectiveTo?: string;
    intervalPosition: "beforeStart" | "inside" | "atOrAfterEnd" | "empty" | "unknown";
    applicability: "applicable" | "notApplicable" | "unknown";
    reason: "activeInterval" | "retired" | "beforeStart" | "emptyInterval"
      | "ended" | "temporalAnomaly";
  }> } | { status: "unavailable"; reason: "initializing" | "protected" };
  reasons: Array<{
    code: "initializing" | "protected" | "temporalAnomaly" | "missingGoal"
      | "goalLifecycle" | "hardPrerequisiteUnsatisfied" | "hardPrerequisiteUnknown"
      | "advisoryPrerequisiteUnmet" | "advisoryPrerequisiteUnknown";
    record?: { id: PlanningFactId; revision: number };
  }>;
  dependencies: PlanningDependencyReferenceV1[];
  authorityFingerprint?: string; // absent when authority is unavailable
  applicabilityFingerprint?: string; // absent when applicability is unknown
  nextApplicabilityChangeAt?: string;
};
queryGoalStructure(input: StructureEvaluationInput):
  | { status: "evaluated"; value: StructureEvaluation }
  | { status: "invalidQuery"; reason: "invalidInstant" }
  | { status: "unavailable"; reason: "historicalReconstructionUnsupported" };
```

The result and per-record reason unions above distinguish initialization, protection, temporal anomaly (exact row), missing Goal, lifecycle ineligibility, interval position and prerequisite conditions. An evaluated protected/unavailable result contains no invented empty/satisfied evidence: eligibility is unknown and qualification/reasons explain why. The discriminated records availability field prevents protected ingress from appearing as a complete empty list. Fingerprints are absent, not synthetic empty fingerprints, when their inputs are unavailable.

Retain `getStructuralEligibility(goalId)` as a compatibility entry point: sample the injected owner clock once, call this canonical query and map to the existing V1 four-state result. On unavailable/protected evidence map to `unknown` with a truthful reason, not `eligible`. New planning orchestration and Structure UI use the explicit query. Do not add the new query reason codes to serialized V1 planning records. The V1 adapter retains its existing reason union; where no existing code truthfully represents a global qualification failure, return `status: "unknown"` with no invented prerequisite reference, and obtain its explanation from the V2 qualification result. The absence of a V1 reason is not evidence of absent constraints. Keep old exact/current record APIs; no code retirement is authorized. Legacy consumers must not treat the V1 wrapper's dependency fingerprint as sufficient time-sensitive freshness.

For qualified evaluation, only applicable outgoing dependencies gate the selected Goal. Keep existing hard/advisory and Goal-completed/Milestone-satisfied semantics. An archived hard prerequisite is unknown; unmet advisory evidence remains qualified conditional eligibility, not a hard block. Unknown **applicability** is unknown even for an advisory relationship: do not assume it is absent. Aggregate precedence is unknown decisive evidence, then known ineligibility, then conditional eligibility, then eligible. This resolves order dependence explicitly in the new derived contract. Structural eligibility is neither Feasibility nor parent completion eligibility.

## 5. Consumers, horizon and freshness

One explicit planning evaluation captures its current clock instant once and passes it through `goalPlanningSurface` → `goalDemandProjectionQuery` → Structure. Use the actual requested canonical User Day horizon independently to project requested effort and Capacity. Do not substitute horizon start/end for the evaluation instant, or evaluate each scheduled activity as a dependency ordering problem.

Required changes:

1. Public store/lazy surface expose the explicit query and qualification. A not-yet-loaded surface returns unavailable/unknown; it never exposes empty accepted authority as proof of no constraints. Recheck current readiness and generation after loading.
2. Demand projection consumes canonical eligibility through that V1 adapter while carrying the V2 qualification alongside it only in runtime orchestration. Preserve existing V1 projection storage shapes and reason unions, but fix `evaluateDemandProjectionFreshness`: compare newly projected semantic content (eligibility, reasons and temporal membership) as well as references. Current implementation compares dependency fingerprints only.
3. The derived applicability fingerprint includes policy identifier `goal-structure-current-temporal-v1`, latest relevant relationship identities/revisions/statuses, temporal classifications and condition evidence. Include the current relationship-set membership so a newly added dependency is detected. Authority qualification scans all retained rows; an anomaly outside that set also invalidates qualification. These query fingerprints are not silently inserted into immutable legacy records.
4. `nextApplicabilityChangeAt` is the earliest future boundary capable of changing current applicability (in this bounded active/unbounded-end model, primarily future starts). If the clock moves backward before `evaluatedAt`, cached temporal freshness is unknown until recomputed. At/after the next boundary, the old result is stale even without a revision. A changed authority or condition also requires recomputation.
5. On opening/refreshing Structure, explicit planning evaluation, route return/resume, and every command that consumes evidence, query again using one captured instant. Existing subscriptions invalidate record changes. No polling, per-render clock sampling or new event bus. A stationary screen labels its result “Evaluated at …”; it must not claim continuously live eligibility. Before an action it always rechecks; no timer is needed for a truthful as-of display.
6. Proposal derivation uses that evaluation's instant through its existing `evaluationCutoff`/`generatedAt` fields. Acceptance **must** derive current evidence with the actual acceptance instant, not reuse the stored cutoff as current time, and compare current semantic inputs via the existing revalidation path in `proposalSurface`. Time-only membership changes stale the proposal; returning to equivalent membership still requires explicit revalidation. Unknown qualification prevents acceptance. Persisted proposals lacking the new runtime qualification envelope are unverified on load until this revalidation succeeds; do not infer policy version from dates.
7. Existing accepted allocations, realizations and publications remain immutable independent facts. Do not retroactively revoke acceptance, alter placement or recompute historical Goal labels. Network+ 10-hour, 20-hour and unrealized 1-hour iterations remain separate.

No new durable query cache is introduced. Existing proposal/projection fingerprints are opaque derived evidence, not a guarantee of current authority; the accepted architecture already requires revalidation. The new semantic comparison must prove propagation through Feasibility, Allocation and Proposal instead of assuming a new field automatically reaches all consumers.

## 6. Compatibility decision and matrix

**Recommend no durable version increment and no migration.** Separate lossless representational reading from temporal operational qualification and prospective command validation. This is specifically _not_ a recommendation to tighten `validateGoalStructureAuthority` for persisted input.

Current surfaces inspected: Structure authority/rows version 1; IndexedDB schema version 11, `goalStructure` compound key `[recordType,id,revision]`; surface initialization and whole-collection mutation; V7 introduces Structure and V8→V14 validates through that chain; current complete writer/import is V14. V1–V6 adapters supply empty Structure only because those formats never owned it. Profiles do not own Goals/Structure. Restore translation supplies separate exact durable/runtime payloads; staging and the journal remain their current formats.

| Record class                                               | Existing acceptance                   | Proposed new-write rule                                                                                       | Read / activation                                                                               | Export / restore                                                                                    | Preservation / recovery                                                                                                 | Version impact                                              |
| ---------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Coherent ordinary data                                     | Accepted                              | Monotonic sampled command time; valid graph and temporal candidate                                            | Same records, qualified current query                                                           | Exact all-row round trip through supported chain                                                    | Existing retry/restore                                                                                                  | None                                                        |
| Inverted interval from rollback                            | Accepted if other V1 checks pass      | Reject creation of anomaly; retirement cannot precede start                                                   | Decode unchanged; temporal qualification protected, eligibility unknown                         | Preserve and permit exact backup/restore; resulting authority remains qualified as unsafe           | No clamp/swap/drop; explicit known-good full restore or explicit clear remains existing user choice, no inferred repair | No reader rejection or migration                            |
| Future-effective active row                                | Accepted                              | Ordinary creation starts now; preserve existing future start on supported revise; retire-before-start rejects | Retain active status; not applicable before start, applicable at start                          | Exact retained values                                                                               | No early activation or waiting-loop write                                                                               | None; query policy is explicitly versioned derived behavior |
| Equal start/end                                            | Accepted                              | Valid empty interval; same-instant retirement allowed                                                         | Empty, not applicable; retain retired state                                                     | Exact, no loss                                                                                      | No manufactured duration                                                                                                | None                                                        |
| Active row without end                                     | Accepted                              | Keep existing unbounded-end rule                                                                              | Applicable from start if qualified                                                              | Exact optional absence                                                                              | No sentinel end added                                                                                                   | None                                                        |
| Retired/superseded anomalous historical row                | Accepted if original validator passes | New writes cannot create anomaly; ordinary writes blocked by authority qualification                          | Every row retained; nonlatest anomaly also qualifies authority, never “latest is fine” shortcut | Export/restore includes anomalous row and all other history                                         | Exact lookup remains; no automatic historical rewrite                                                                   | None; no new exclusion from reader                          |
| Milestone timestamp already changed by rename              | Accepted                              | Future metadata patches preserve current timestamp                                                            | Read recorded value; do not guess earlier satisfaction                                          | Exact history/current row                                                                           | Correction of historical fact is separate ungranted authority                                                           | None                                                        |
| Unknown fields, unsupported version, malformed graph/shape | Existing reject/protect               | No permissive new authoring                                                                                   | Existing rejection/protection, preserve original source                                         | Reject import without replacing current authority; supported export cannot fabricate interpretation | Existing preserved source/staging and recovery; no new raw export promise                                               | None; no reader retired                                     |

All retained rows remain representationally accepted exactly as before. No discriminator is added to data, no compatible record is rejected, no persisted field is reinterpreted to a guessed value, and no old history is rewritten. New command output is a subset already understood by promised V1 readers. The interval meaning is the explicit proposed operational interpretation of an existing effective interval, exposed as **derived query version 2**, not a silent reinterpretation of frozen historical decisions. Older builds can still read exact V1 bytes but do not implement the new safety qualification; this is a known old implementation defect, not a forward-safety guarantee. Export must explain that preservation does not mean an older application will enforce the new runtime rule.

This recommendation satisfies the compatibility ADR by retaining recovery continuity and unchanged supported read/write representations while refusing unsafe activation. If implementation instead requires rejecting such rows at ingress, adding persisted policy fields, altering frozen semantics, or discarding records, that is outside this proposal and requires a distinct version/migration decision before work continues. No automatic V15, database bump, new record version or migration epoch is recommended.

Temporally unqualified data is **accepted for preservation**, distinct from malformed ingress protection. Keep that distinction separate from `getGoalStructureIngressStatus()` so `backupTransferSurface` can export the complete legacy-valid authority rather than blocking on its existing `protectedSurface` branch. Ordinary Structure mutation admission additionally consults qualification. Restore reports exact restore success plus an explicit “Structure preserved; temporal evidence requires review” qualification, not normal planning readiness for that authority. Global recovery-required readiness still blocks all ordinary authoring. Recovery staging must preserve/verify both target and recovery payloads without running new-write validators or qualifying records away; runtime qualification is derived after installation and after rollback.

## 7. Milestone patch matrix

Keep `reviseMilestone(id, expectedRevision, { title?, targetDate?: string | null, state? })`. Owner, policy, identity, createdAt and provenance are not patch fields. Omission preserves targetDate, null clears, a valid string authors a date. Normal trim/no-op semantics remain. All changes retain earlier exact revisions.

| Base / patch                                                    | New lifecycle facts                                                | Revision / timestamps                                                                     |
| --------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Any state; semantically identical fields, omitted or same state | Preserve everything                                                | No revision/time change; report `changed:false` with actual durability                    |
| Active; title/date edit, state omitted/active                   | Keep active, no satisfiedAt/retiredAt                              | One metadata revision, updatedAt = command time                                           |
| Satisfied; title/date edit, state omitted/satisfied             | Preserve exact satisfiedAt, absent retiredAt                       | One metadata revision; normal updatedAt, no resatisfaction                                |
| Retired; title/date edit, state omitted/retired                 | Preserve exact retiredAt, absent satisfiedAt                       | One metadata revision; no reretirement                                                    |
| Active or retired → satisfied                                   | Set satisfiedAt = command time; remove retiredAt                   | One explicit transition revision                                                          |
| Satisfied or retired → active                                   | Remove satisfiedAt and retiredAt from new row only                 | One explicit transition revision                                                          |
| Active or satisfied → retired                                   | Set retiredAt = command time; remove satisfiedAt from new row only | One explicit transition revision; may reject if active dependency targets this checkpoint |

These transitions are supported by the current patch/state validator; this proposal does not introduce a new transition enum or automatic action. Complete graph validation remains authoritative. No dependent relationship is auto-retired. A combined metadata plus genuine state change is one revision; timestamp changes follow the transition, not the mere presence of a `state` key.

For the reproduced September 25 rename, preserve September 24 `satisfiedAt` exactly, increment revision normally and record September 25 `updatedAt`. Already affected current timestamps remain as recorded. Earlier history may be displayed as evidence but must not be automatically used to “repair” them. Historical correction requires a separately authorized meaning/command and is excluded.

This prospective fix changes command construction only: every resulting record is already valid under the current readers and serializers, and no historic row is changed or rejected. Its no-version rationale is independent of the interval qualification decision.

## 8. Complete admission and asynchronous write boundary

### Inventory and roles

| Path                                                                                         | Recommended admission / ownership                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| createRelationship, reviseRelationship, retireRelationship, createMilestone, reviseMilestone | Ordinary authoring: store readiness + inactive transaction + accepted ingress + temporal qualification; expected revision before candidate acceptance. All paths, including no-ops, consult admission.                                     |
| retryGoalStructurePersistence                                                                | Ordinary persistence operation; same guard and generation checks; persist exact current desired snapshot only, no new identity/revision.                                                                                                   |
| public replaceGoalStructureAuthority                                                         | Retain entry point but guard as ordinary replacement; qualified source, validated/qualified target, expected runtime generation. Cannot be an unguarded repair/import bypass. Complete-backup restore uses coordinator capability instead. |
| public clearGoalStructure                                                                    | Ordinary destructive authority command uses same guard. Coordinator-owned full clear uses separate capability path; UI does not acquire that capability.                                                                                   |
| initializeGoalStructure                                                                      | Bootstrap-owned read/install only; no durable normalization. Epoch check after read; late initialization cannot install over replacement. Reinitialization is not an ordinary protected-state escape hatch.                                |
| runtime install / restore participant / full clear                                           | Existing coordinator capability plus matching active transaction kind/epoch, exact payload and recovery protocol. Do not apply ordinary inactive-transaction guard to these authorized operations.                                         |
| replaceDurable internal helper                                                               | Mandatory final storage admission. Callable only with an ordinary captured token or matching coordinator token, never a bare payload from stale desired state.                                                                             |

Use existing rejection concepts: `initializing`, `protected`, `authorityTransactionActive`, `staleRevision`. The richer existing `getDayFrameMutationAdmission` classification should replace lossy boolean interpretation at the owner seam while preserving boolean callers via a compatibility adapter (`false` maps to authorityTransactionActive). Temporal protection is `protected` with runtime detail. A displaced generation is rejected as `authorityTransactionActive` with `contextReplaced`; it is not a record revision rebase. Retry must add the same rejected union to its runtime return type; denial is not `storageFailure` or `durable`. No persisted result format changes.

### Required bounded mechanism

The current runtime transaction has a monotonic internal epoch, but exposes no epoch when inactive. **Extend its runtime read contract to expose the current epoch separately**; do not pretend it already supports a usable inactive token. A token combines that epoch and owner generation/desired-version counters. These counters are ephemeral and never decrease when snapshots are restored; runtime install/clear/replacement invalidates tokens. Do not copy an old generation back during rollback.

1. Capture the runtime epoch before dispatch through the public lazy adapter. After load and immediately before acceptance, require the same epoch and current ordinary admission. A restore that begins and finishes while loading still invalidates the call. No allocation or replay into the new authority.
2. Serialize ordinary Structure operations with one owner-local in-flight lease. A second unresolved submission rejects `authorityTransactionActive` with `ownerPersistenceBusy`; do not silently queue creations or auto-retry drafts. Read-only queries remain possible. Retain accepted identity if runtime acceptance preceded persistence failure.
3. Before replacing runtime desired state, recheck admission, expected revision and generation synchronously. Sample the clock once and accept the candidate only within that synchronous boundary.
4. Extend the existing IndexedDB mutation call with an optional synchronous admission callback evaluated **after `await open()` and immediately before creating the readwrite transaction/enqueuing its requests**, with no intervening await. An ordinary callback checks matching epoch/generation/desired version and admission. Denial creates no transaction or writes. The small optional seam serves this owner; do not invent a new database, global lock, journal or recovery manager. Non-Structure callers remain behaviorally unchanged.
5. Integrate a Structure quiescence check into the existing runtime transaction's **begin-before-snapshot** boundary: while its accepted ordinary persistence lease is outstanding, return existing `busy` before capturing anything. This covers delayed database opening and already-started transactions. It must apply to every begin route, including the exposed runtime controller, not only UI import. Do not acquire a coordinator transaction and then wait on a lease that needs inactive admission to finish. Explicit restore/clear can be retried when pending work settles.
6. Once the ordinary transaction has started, allow it to settle; do not claim a post-commit guard undoes it. Quiescence prevents restore/clear from starting until it settles. Upon completion, update durability/feedback only if its epoch, owner generation and desired version still match. An unexpected mismatch is protected, never a “durable” marker for the replacement. Release the lease in finally, including thrown storage errors. A failed persistence remains accepted runtime authority with pending/storageFailure and explicit retry; never repeat create.
7. Retry captures the exact current desired snapshot/version, observes the same lease, and checks again at the database boundary. It cannot flush a stale closure's snapshot after a successful restore or clear. Return `durable` only for the captured matching authority. No accepted semantic operation is retroactively labeled unaccepted solely because its write failed.
8. Coordinator restore/clear begins only when quiescent, increments epoch, holds existing admission closed, and uses private capability-bearing exact writes. Those callbacks require the active coordinator epoch, not ordinary readiness. Runtime install derives qualification from exact restored bytes. Cleanup/recovery decisions remain the existing journal protocol. Startup recovery precedes initialization and cannot be blocked by a shell's ordinary readiness.

This is a targeted extension of the existing transaction/admission design, justified by `IndexedDbCollectionStorage.mutate` awaiting open before creating its transaction and by lazy dispatch awaiting module loading. It does not claim cross-tab locking, a new universal idempotency ledger or a guarantee about other owners' unexamined concurrency. If that bounded hook cannot be implemented without broader transaction changes, stop for review rather than substituting entry-time checks.

Rejected import before replacement preserves drafts/tokens. A rejected import that actually entered and aborted a runtime transaction may invalidate operation tokens but must preserve drafts and prior accepted identities; retry explicitly against unchanged canonical state, never auto-replay. Successful import/clear invalidates displaced context. Recovery-required readiness blocks ordinary authoring and retry; privileged journal recovery remains available. Setup profile loading retains independent Goal/Structure scope and does not replace these authorities.

## 9. Required future decision/regression table

All outcomes in this table are **proposed acceptance requirements**, not results of this task. Every case retains exact prior rows unless an explicit complete replacement/clear is the authorized operation.

| Case                                             | Owner and expected result                                                               | Allowed writes / preserved evidence                               | Permanent test layer                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| Ordinary create/revise/retire                    | Structure validates, expected revision/no-op behavior retained                          | One revision per semantic change; exact prior identity/provenance | Domain + surface                                   |
| Rollback on create                               | Owner watermark rejects backward sample, empty-authority limitation explicit            | No allocation/persistence; retain draft                           | Surface clock injection + UI later                 |
| Rollback on revise/retire                        | invalidInput; retirement before start also rejects                                      | No candidate install or write                                     | Surface + reload                                   |
| Before start / at start                          | Canonical classifier: notApplicable → applicable                                        | No writes; active status distinct                                 | Pure query + projection                            |
| At end / after end                               | Interval outside; retired stays notApplicable throughout current projection             | No revival or latest-as-old substitution                          | Pure query + exact history                         |
| Equal endpoints / absent end                     | Empty interval / unbounded interval                                                     | Exact optional absence retained                                   | Domain + backup                                    |
| Inverted latest or nonlatest legacy interval     | Decode preserved, whole-Structure temporal qualification protected, eligibility unknown | Export/restore exact; ordinary mutation blocked                   | Ingress + V7–V14 compatibility + recovery          |
| Boundary crosses with no revision                | Old temporal evidence stale; next explicit evaluation changes membership                | No automatic Proposal; explicit acceptance revalidates            | Fake clock planning + proposal                     |
| Satisfied/retired metadata edit                  | Preserve lifecycle timestamp; update metadata revision/time                             | Preserve owner/policy/date absence/history                        | Surface + UI later                                 |
| Same-state/no-op / real transition               | No resatisfaction; genuine transition uses sampled time                                 | No-op none; changed patch one revision                            | Domain/surface matrix                              |
| Denied create/revise/retire/retry/replace/clear  | Actual owner rejection, no writes                                                       | Desired state, identity, durability untouched                     | Surface storage spies                              |
| Denial during lazy/open delay                    | Token recheck rejects before mutation boundary                                          | No old write after replacement                                    | Deferred module/storage + actual store integration |
| Persistence already accepted/in flight           | Restore/clear busy before snapshot; old transaction settles first                       | Accepted ID retained, failure retry not create                    | Transaction + controlled IndexedDB completion      |
| Rejected / successful import / recovery-required | Draft preservation / invalidation / ordinary protected                                  | Existing exact restore and rollback semantics                     | Actual V14 UI tests + native production restore    |
| Reload and backup round trip                     | All revision rows equal, qualification rederived                                        | No migration marker or inferred repair                            | Native disposable export/import/reload + fixtures  |
| Current vs historical request                    | Current-authority label; historical reconstruction unavailable                          | No invented historical Goal status                                | Query + presentation                               |
| Changed planning evidence vs accepted history    | New evidence stale/unknown as appropriate; old acceptance unchanged                     | No realization, publication, Actual or Progress rewrite           | Planning/Network+ + scheduling boundary            |
| Referenced Milestone retirement                  | Existing graph rejection                                                                | Dependent relationship history untouched                          | Surface + UI later                                 |
| Protected malformed input                        | Existing explicit rejection/protection                                                  | Original storage/file preserved                                   | Compatibility/restore failures                     |

## 10. One implementation handoff and Task 9.27 resumption

Recommend exactly one next slice: **Goal Structure canonical-owner temporal qualification, patch fidelity and mutation-admission repair**. Do not assign its task number here. Prerequisite: explicit architectural acceptance of this proposal, including no-migration qualification strategy and bounded transaction/storage seams.

Owners/consumers affected: `core/planning/goalStructure.ts`; `state/goalStructureSurface.ts` and lazy adapter; public `dayFrameStore` wiring/types; `dayFrameAuthorityTransaction`/runtime controller read contract; optional admission seam in `indexedDbCollectionStorage`; Structure restore translation/composition and full-clear privileged wiring; `goalDemandProjectionQuery`, `goalPlanningSurface`, Demand freshness, constructive evaluation and proposal revalidation. Existing backup transfer must distinguish preservation from unsafe activation. App feedback may expose that distinction in existing restore/planning surfaces; no Structure authoring editor is part of this slice.

Keep V1 rows, database 11, V14 writer and all supported reader chains. Add no migration, inferred historical correction or new recovery command. Deliver the §9 matrix, existing 9.24–9.26 regressions, full suite/static/build/bundle gates, and production-browser evidence of current planning revalidation, actual V14 preservation/reload and protected recovery. Native evidence uses disposable state; controlled transaction failures stay separately labeled. Native anomalous fixture import must retain all rows while qualifying planning unknown and allowing preservation export.

Completion requires proven no late ordinary write can cross Structure's replacement boundary, exact accepted/pending identity handling, qualified temporal results through acceptance, field fidelity, compatibility round trips and unchanged hard bundle gates. Failure must preserve source/runtime meaning and use existing rollback/protection outcomes. No foundation completion claims mobile authoring acceptance.

Then resume Task 9.27 only by an explicit continuation that:

1. References the accepted proposal and completed owner-repair RESULT; preserves its original blocked RESULT/input.
2. Refreshes command/query map and baseline against repaired owners, confirms tests and lazy boundaries.
3. Implements its original focused relationship/Milestone UI, canonical applicability/reasons and bounds without local temporal authority.
4. Verifies its complete draft/navigation, stale/retry, restore, field/history and planning scenarios, including ambiguous evidence presentation.
5. Passes every original 320/390/768/1280 authoring/accessibility/reflow and UI export/import/reload gate plus full tests/build/bundle.
6. Records a separate continuation result; neither this proposal nor foundation repair waives a mandatory gate.

Rejected alternatives: tightening the legacy reader strands accepted history; swapping/clamping timestamps guesses intent; a new durable version solely to discard ambiguous data gives no lossless conversion; UI-only guards miss delayed writes; arbitrary asOf reconstruction invents missing Goal history; polling substitutes activity for a freshness contract. The chosen preservation/qualification design avoids those changes while making unsafe evidence explicit.

No material rule is left as an unselected option. Architectural acceptance is the remaining decision. Atomic reparenting, accounting, roll-ups, new lifecycle, automatic checkpoints, scheduled-activity dependencies, recurrence, release/replacement and Found Time remain excluded.

**PROPOSED — AWAITING ARCHITECTURAL ACCEPTANCE — NOT IMPLEMENTED**
