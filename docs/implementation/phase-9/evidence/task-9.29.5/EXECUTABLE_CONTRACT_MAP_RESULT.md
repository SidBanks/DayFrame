# Executable contract map — RESULT

Current dirty-source inspection, not proposed implementation. Source excerpts below preserve exact current unions and call sites; line numbers and complete baseline source archive identify context. No existing files changed.

## code/src/state/types.ts:75

```ts
export type PublishScheduleRangeInputV1 = {
  publicationRange: PublicationRangeV1;
  expectedSourceFingerprint: string;
  publishedAt: string;
};

export type PublishScheduleRangeFailureReasonV1 =
  | "contextReplaced"
  | "publicationBusy"
  | "pendingPublication"
  | "invalidPublicationRange"
  | "planningCoverageIncomplete"
  | "previewMissing"
  | "previewStale"
  | "previewRangeMismatch"
  | "frictionUnresolved"
  | "acceptedAllocationUnrealized"
  | "sourceChanged"
  | "queryFailure"
  | "materializationFailure"
  | "persistenceFailure"
  | "historicalPlanProtected"
  | "historicalPlanUnavailable"
  | "tryPreview"
  | "verificationFailedAfterCommit"
  | "commitStateUncertain"
  | "writeFailedBeforeCommit";

export type PublishScheduleRangeResultV1 = {
  readonly receipt?: import("./publicationReceipt.js").PublicationReceipt;
} & (
  | { status: "published"; batchId: string; publishedAt: string }
  | { status: "alreadyPublished" }
  | { status: "rejected"; reason: PublishScheduleRangeFailureReasonV1 }
);
```

## code/src/state/planningScopeQuery.ts:25

```ts
export type PlanningReviewReadModelV1 = {
  version: 1;
  sourceFingerprint: string;
  reviewScope: ReviewScopeV1;
  planningDataCoverage: PlanningScopeCoverageV1;
  preview: {
    availability: "available" | "unavailable";
    revision: "generated" | "try";
    coverage: "covers" | "partiallyCovers" | "doesNotCover";
    freshness: "current" | "stale" | "unavailable";
  };
  scheduledReality: Array<{
    epistemicClass: "scheduledReality";
    fact: ReturnType<RealizationSurface["listRealizedScheduleFacts"]>[number];
    authoritativeInterval: { startsAt: string; endsAt: string };
    visibleInterval: { startsAt: string; endsAt: string };
  }>;
  derivedSchedule: Array<{
    epistemicClass: "derivedSchedule";
    scheduleClass: "work" | "commitment";
    fact:
      | NonNullable<DayFrameState["preview"]>["result"]["generatedWorkBlocks"][number]
      | NonNullable<DayFrameState["preview"]>["result"]["scheduledBlocks"][number];
    authoritativeInterval: { startsAt: string; endsAt: string };
    visibleInterval: { startsAt: string; endsAt: string };
  }>;
  acceptedLiabilities: Array<{
    epistemicClass: "acceptedAuthority";
    acceptedAllocationId: string;
    claim: ReturnType<
      ProposalSurface["listUnrealizedAcceptedAllocations"]
    >[number]["claims"][number];
    authoritativeInterval: { startsAt: string; endsAt: string };
    visibleInterval: { startsAt: string; endsAt: string };
  }>;
  proposals: Array<{
    epistemicClass: "proposed";
    proposal: ReturnType<ProposalSurface["listActionableProposals"]>[number];
    membership: "contained" | "intersecting";
  }>;
  unresolvedFrictionCount: number;
  publication: {
    epistemicClass: "historical";
    availability:
      | { status: "available" }
      | { status: "protected"; reason: HistoricalPlanProtectionReason }
      | { status: "unavailable"; reason: string };
    materialization:
      | { status: "eligible" }
      | {
          status: "blocked";
          reason: Exclude<MaterializePlanPublicationResult, { status: "materialized" }>["status"];
        };
    coverage: PlanningScopeCoverageV1;
    publishedUserDays: string[];
    missingUserDays: string[];
  };
};

export function createPlanningScopeQuery(options: {
  getState: () => DayFrameState;
  getSleepAuthority?: () => import("../core/sleep/sleepFoundationalOccupancy.js").SleepFoundationAuthority;
  proposals: Pick<ProposalSurface, "listActionableProposals" | "listUnrealizedAcceptedAllocations">;
  realizations: Pick<RealizationSurface, "listRealizedScheduleFacts">;
  historicalPlan: Pick<HistoricalPlanSurface, "getHistoricalPlanRange"> &
    Partial<Pick<HistoricalPlanSurface, "exportHistoricalPlan">>;
}) {
  return async function queryPlanningReview(input: {
    reviewScope: ReviewScopeV1;
    historyAsOf: string;
  }): Promise<PlanningReviewReadModelV1> {
    const finalLabel = addUserDayLabels(input.reviewScope.endUserDayDateExclusive, -1);
    const history = await options.historicalPlan.getHistoricalPlanRange(
      input.reviewScope.startUserDayDate,
      finalLabel,
      input.historyAsOf,
    );
    const state = options.getState();
    const resolve = (date: ReviewScopeV1["startUserDayDate"]) =>
```

## code/src/state/publicationEligibility.ts:1

```ts
import type { PlanningReviewReadModelV1 } from "./planningScopeQuery.js";

/** Shared, deterministic preconditions for Review and explicit publication. */
export function publicationBlockers(model: PlanningReviewReadModelV1) {
  const blockers: Array<
    | "planningCoverageIncomplete"
    | "previewMissing"
    | "previewStale"
    | "previewRangeMismatch"
    | "frictionUnresolved"
    | "acceptedAllocationUnrealized"
    | "historicalPlanProtected"
    | "historicalPlanUnavailable"
    | "tryPreview"
    | "materializationFailure"
  > = [];
  if (model.planningDataCoverage !== "complete")
    blockers.push("planningCoverageIncomplete");
  if (model.preview.availability !== "available")
    blockers.push("previewMissing");
  else {
    if (model.preview.freshness !== "current") blockers.push("previewStale");
    if (model.preview.coverage !== "covers")
      blockers.push("previewRangeMismatch");
    if (model.preview.revision === "try") blockers.push("tryPreview");
  }
  if (model.unresolvedFrictionCount > 0) blockers.push("frictionUnresolved");
  if (model.acceptedLiabilities.length > 0)
    blockers.push("acceptedAllocationUnrealized");
  if (model.publication.availability?.status === "protected")
    blockers.push("historicalPlanProtected");
  else if (model.publication.availability?.status !== "available")
    blockers.push("historicalPlanUnavailable");
  if (
    model.publication.materialization?.status !== "eligible" &&
    !blockers.some((code) =>
      [
        "previewMissing",
        "previewStale",
        "previewRangeMismatch",
        "tryPreview",
      ].includes(code),
    )
  )
    blockers.push("materializationFailure");
  return blockers;
}
```

## code/src/ui/scheduleReviewReadiness.ts:1

```ts
import { publicationBlockers } from "../state/publicationEligibility.js";
import type { PlanningReviewReadModelV1 } from "../state/planningScopeQuery.js";

export type ScheduleReviewReasonCodeV1 =
  | "planningCoverageIncomplete"
  | "planningCoverageUnknown"
  | "previewMissing"
  | "previewStale"
  | "previewRangeMismatch"
  | "frictionUnresolved"
  | "acceptedAllocationUnrealized"
  | "publicationRangeInvalid"
  | "proposalDecisionPending"
  | "historicalPlanProtected"
  | "historicalPlanUnavailable"
  | "tryPreview"
  | "materializationFailure";
export type ScheduleReviewAttentionV1 = {
  code: ScheduleReviewReasonCodeV1;
  attention: "blocking" | "warning" | "informational";
  blocksReview: boolean;
  blocksPublication: boolean;
  message: string;
  action?:
    | "generatePreview"
    | "refreshPreview"
    | "resolveFriction"
    | "inspectAccepted"
    | "decideProposal";
};
export type ScheduleReviewReadinessV1 = {
  version: 1;
  reviewReady: boolean;
  publicationReady: boolean;
  blockers: ScheduleReviewAttentionV1[];
  warnings: ScheduleReviewAttentionV1[];
  informational: ScheduleReviewAttentionV1[];
};

const order: ScheduleReviewReasonCodeV1[] = [
  "planningCoverageUnknown",
  "planningCoverageIncomplete",
  "previewMissing",
  "previewStale",
  "previewRangeMismatch",
  "frictionUnresolved",
  "acceptedAllocationUnrealized",
  "publicationRangeInvalid",
  "historicalPlanProtected",
  "historicalPlanUnavailable",
  "tryPreview",
  "materializationFailure",
  "proposalDecisionPending",
];

export function deriveScheduleReviewReadiness(input: {
  model: PlanningReviewReadModelV1;
```

## code/src/state/proposalSurface.ts:35

```ts
const STORE = "proposalAuthority";
type Ingress =
  | { status: "initializing" | "accepted" }
  | { status: "protected"; reason: "readFailure" | "invalidAuthority" };
type Durability = "unknown" | "durable" | "pending" | "storageFailure";
export type ProposalRuntimeSnapshot = {
  authority: ProposalAuthorityV1;
  desired: ProposalAuthorityV1;
  ingress: Ingress;
  durability: Durability;
};
export type ProposalCommand<T> =
  | { status: "unconfirmed"; reason: "commitStateUncertain" | "verificationFailedAfterCommit" }
  | { status: "accepted"; value: T; persistence: "durable" | "pending" }
  | {
      status: "rejected";
      reason:
        | "proposalBusy"
        | "contextReplaced"
        | "sourceChanged"
        | "authorityUnavailable"
        | "authorityProtected"
        | "replacementBusy"
        | "initializing"
        | "protected"
        | "authorityTransactionActive"
        | "notFound"
        | "notActionable"
        | "stale"
        | "invalidInput"
        | "conflictingClaim"
        | "allocationFailure"
        | "persistenceFailure";
    };

export function createProposalSurface(options: {
  storage: IndexedDbCollectionStorage;
  lifecycle?: AcceptanceLifecycle;
  initialRuntime?: ProposalRuntimeSnapshot;
  sourceWitness?: () => string;
  now?: () => string;
```

## code/src/state/proposalSurface.ts:680

```ts
    listActionableProposals: () =>
      latestProposals(authority.proposals).filter(actionable).map(clone),
    listProposalHistory: (limit = 100) =>
      clone(
        authority.proposals
          .slice()
          .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
          .slice(0, Math.max(0, limit)),
      ),
    resolveAcceptedAllocation: (id: string) => {
      const value = authority.acceptedAllocations.find((item) => item.id === id);
      return value
        ? { status: "resolved" as const, acceptedAllocation: clone(value) }
        : { status: "notFound" as const };
    },
    listUnrealizedAcceptedAllocations: () =>
      clone(authority.acceptedAllocations.filter((item) => item.realization === "unrealized")),
    exportProposalAuthority: () => clone(authority),
    replaceProposalAuthority: (value: ProposalAuthorityV1) => {
      const frozen = clone(value);
      return !lifecycle.current(lifecycle.origin()) || ingress.status === "protected"
        ? Promise.resolve({ status: "failure" as const })
        : lifecycle.replace((epoch) => replace(frozen, epoch));
    },
    clearProposalAuthority: async () => {
      const result =
        !lifecycle.current(lifecycle.origin()) || ingress.status === "protected"
          ? { status: "failure" }
          : await lifecycle.replace((epoch) => replace(emptyProposalAuthority(), epoch));
      return result.status === "accepted"
        ? { status: "removed" as const }
        : { status: "storageFailure" as const };
    },
    clearProposalForCoordinator: async (
      capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
      epoch: number,
    ) => {
      if (
        capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY ||
        !lifecycle.coordinatorCurrent(epoch)
      )
        return { status: "storageFailure" as const };
      const result = await replace(emptyProposalAuthority(), epoch);
      return result.status === "accepted"
        ? { status: "removed" as const }
        : { status: "storageFailure" as const };
    },
    getProposalIngressStatus: () => clone(ingress),
    getProposalDurabilityStatus: () => durability,
    retryProposalPersistence: write(async () => {
      const origin = lifecycle.active()!;
      if (origin.desiredVersion !== lifecycle.desiredVersion()) return reject("contextReplaced");
      const intended = desired;
      if (desiredWitness !== undefined && source() !== desiredWitness)
        return reject("sourceChanged");
      const result = await commit(intended, undefined);
      return result.status === "accepted" ? { status: "durable" as const } : result;
    }),
    subscribeProposals: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getProposalRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
```

## code/src/state/realizationSurface.ts:50

```ts
}) {
  const lifecycle = options.lifecycle ?? createAcceptanceLifecycle();
  type Ingress = "initializing" | "ready" | "protected";
  let authority: RealizationAuthorityV1 = structuredClone(
      options.initialRuntime?.authority ?? emptyRealizationAuthority(),
    ),
    ingress: Ingress = options.initialRuntime?.ingress ?? "initializing";
  let protectionEvidence: AcceptanceProtectionEvidence | undefined;
  const runtime: RuntimeAuthorityAdapter<{
    authority: RealizationAuthorityV1;
    ingress: Ingress;
  }> = {
    id: "realizations",
    captureRuntimeSnapshot: () => structuredClone({ authority, ingress }),
    installRuntimeExact: (value) => {
      lifecycle.assertInstall();
```

## code/src/state/historicalPlanSurface.ts:39

```ts
export type HistoricalPlanDurabilityStatus =
  | { status: "initializing" }
  | { status: "ready"; pendingCount: 0 }
  | { status: "pending"; pendingCount: number }
  | { status: "failed"; pendingCount: number; error: DurableStorageError }
  | { status: "protected"; reason: HistoricalPlanProtectionReason }
  | { status: "unavailable"; error: DurableStorageError };
export type HistoricalPlanProtectionReason =
  | "invalidBatchMetadata"
  | "invalidBatch"
  | "physicalMismatch"
  | "conflictingBatchId"
  | "unsupportedVersion";
export type PublicationOrigin = PublicationReceipt &
  Readonly<{ epoch: number; generation: number }>;
type PublicationRejection =
  | "contextReplaced"
  | "publicationBusy"
  | "historicalPlanProtected"
  | "historicalPlanUnavailable"
  | "sourceChanged";
export type HistoricalPlanPublicationResult = { readonly receipt?: PublicationReceipt } & (
  | { status: "publishedAndDurable"; batch: PlanPublicationBatchV1 }
  | {
      status: "publishedPendingDurability";
      batch: PlanPublicationBatchV1;
      error: DurableStorageError;
    }
  | { status: "identicalNoOp" }
  | { status: "identicalPending"; batchIds: string[] }
  | { status: "rejected"; reason: PublicationRejection }
  | { status: "publicationBlockedProtected" }
  | { status: "materializationUnavailable"; batch: PlanPublicationBatchV1 }
  | { status: "invalidCandidate" }
  | { status: "writeFailedBeforeCommit"; batch: PlanPublicationBatchV1; error: DurableStorageError }
  | {
      status: "verificationFailedAfterCommit" | "commitStateUncertain";
      batch: PlanPublicationBatchV1;
      error: DurableStorageError;
    }
);
export type HistoricalPlanDayReadResult =
  | {
```

## code/src/state/historicalPlanSurface.ts:433

```ts
function publishAtomically(
  batchValue: PlanPublicationBatchV1,
  guard?: {
    isCurrent: () => boolean;
    origin?: PublicationOrigin;
    recordResult?: (result: HistoricalPlanPublicationResult) => void;
  },
): Promise<HistoricalPlanPublicationResult> {
  const origin = guard?.origin ?? capturePublicationOrigin();
  let candidate: PlanPublicationBatchV1;
  try {
    candidate = structuredClone(batchValue);
  } catch {
    return Promise.resolve(
      withPublicationReceipt({ status: "invalidCandidate" as const }, origin),
    );
  }
  return enqueue<HistoricalPlanPublicationResult>(
    origin,
    () => publishOne(candidate, false, guard?.isCurrent),
    (reason) => publicationDenied(reason, candidate),
    guard?.recordResult,
  );
}
```

## code/src/state/historicalPlanSurface.ts:509

```ts
    let admissionOpen = true;
    const receipts: DurableTransactionReceipt[] = [];
    const admit = () =>
      admissionOpen &&
      !!origin &&
      activeOrigin === origin &&
      !getPublicationRejection(origin) &&
      (isCurrent?.() ?? true);
    const failed = (error: DurableStorageError) => {
      if (commitState !== "notWritten") protect("physicalMismatch");
```

## code/src/core/historicalPlan/materializePlanPublication.ts:35

```ts
export type MaterializePlanPublicationResult =
  | { status: "materialized"; batch: PlanPublicationBatchV1 }
  | { status: "noPreview" | "stalePreview" | "tryPreview" }
  | { status: "inconsistentPlanContext"; detail: string }
  | { status: "unsupportedOccurrenceFamily"; detail: string }
  | { status: "invalidCandidate"; detail: string };

export function materializePlanPublication(input: {
  authoredSetup: DayFrameAuthoredSetup;
  sleepAuthority?: SleepFoundationAuthority;
  preview?: DayFramePreview | null;
  providers?: HistoricalPlanConstructionProviders;
  goals?: readonly GoalV1[];
  publicationRange?: PublicationRangeV1;
```

## Actual source and fingerprint consumers

- `dayFrameStore.queryPlanningReview` awaits the module before composing source adapters; the query awaits history range, reads state/Proposal/realization, materializes synchronously, then may await whole history export for Sleep seams. There is no combined records/qualification witness or final content/qualification check. `historyAsOf` is not a cross-owner snapshot.
- `planningScopeQuery` uses naked Proposal actionable/unrealized arrays and realization fact arrays. `listUnrealizedAcceptedAllocations` filters `realization === "unrealized"`; realized IDs then exclude whole accepted IDs; claims determine actual interval intersection. A V1/empty claim list is not upgraded. These existing semantic rules remain the baseline.
- `sourceFingerprint` hashes publicationTruth (semantic batch fingerprint), Preview generation/revision/staleness/foundation/range/Friction IDs, visible realized facts and visible accepted claims. It omits ingress/settlement, and dry materialization does not receive `listGoals`, unlike the command. Current `getSleepAuthority` includes Active protection, PlanDecision recovery/quarantine, Composition ingress, realization ingress and store readiness/transaction, but no Proposal ingress or active acceptance/realization lease.
- `schedulePublication`'s private capturedAuthority hashes full saved setup, Preview, Goals and SleepFoundationAuthority. It is checked after query, then passed as Boolean `isCurrent` to HistoricalPlan. It does not include Proposal authority/ingress/lease. Goal bytes are consumed while Goal ingress is omitted. This is source-inspected, not a newly reproduced Goal-owner failure.
- `HistoricalPlan.publishOne` checks the guard at queue execution, after initialization, after awaited duplicate classification, after collection/seam checks, and before persistence. `persistBatch` checks before mutate and in `admit` after database open. Boolean false is currently sourceChanged. Its existing-record fast path also needs the proposed fresh-path guard before returning a durable result. These are distinct from the unchanged origin/lease/admissionOpen/native-terminal checks.
- `PlanningReviewPanel` and its `MonthlyPlannerSurface` query prop also consume the Review type/known-empty presentation; migrate these live readers without hiding independent day evidence. `ScheduleReviewPanel` supplies reviewed sourceFingerprint to publish; shared readiness calls publicationBlockers; plannerReviewPresentation consumes arrays and can otherwise label empty. Public result copy and last-result recording must handle any new runtime reason. G1/G2 remain independent qualified inspection projections.
- `sourceFingerprint` and `expectedSourceFingerprint` search in `code/src` finds only Review query, public runtime types, ScheduleReviewPanel, publication comparison and tests/fixtures. It finds no Review fingerprint in serializers/backups/journal/physical records. Restore `sourceFingerprints` are a different type and pipeline and must remain unchanged.
- **Persisted fingerprint distinction:** HistoricalPlan's `toBatchRecord` stores `historicalPlanBatchStorageFingerprint`; `toDayRecord` stores `historicalPlanDayStorageFingerprint`. These use semantic snapshot/day/batch functions and Sleep semantics, also used by durable comparison/readback/no-op. Do not change these functions, their interpretation, or inject source qualification into a batch. Qualification belongs in a separate runtime Review hash/witness.

## Source-inspected omissions versus reproduction

The three unconfirmed acceptance cases and three controls are reproduced. Additional absent propagation is source-inspected: active Proposal/realization settlement, Goal metadata qualification/dry-run input parity, lazy subscription gaps, and cross-await query coherence. Current Sleep aggregate already propagates several protected sources into materialization; no new distinct reproduced failure is claimed for each of them. Neither G2 protection nor global readiness alone proves Review qualified.

`lazyProposalSurface.subscribeProposals` before module load currently returns a no-op unsubscribe; lifecycle acquire/release do not provide qualification subscriptions. Future qualification subscribers must attach to a persistent lazy shell and receive synchronous invalidation even if ordinary presentation notifications are deferred. That is observation, not a new scheduling lock.
