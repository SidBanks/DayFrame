import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../cycles/resolveEffectiveSchedulePreferences.js";
import type { BlockCandidate, DraftScheduledBlock } from "../blocks/types.js";
import {
  getPlanDecisionTargetKey,
  validatePlanDecision,
  type PlanDecisionV1,
} from "./planDecision.js";
import {
  createDurableOccurrenceReference,
  resolveDurableOccurrenceReference,
  type DurableOccurrenceReference,
} from "../occurrences/durableOccurrenceReference.js";
import type { DayFrameAuthoredSetup } from "../../state/types.js";
import type { LocalDateString } from "../shifts/types.js";
import type { TimeString, Weekday } from "../time/types.js";
import { getUserWeekStartDate } from "../time/userWeek.js";

export type PlanDecisionApplicability =
  | { status: "applicable" }
  | { status: "staleSourceMissing" }
  | { status: "staleLifetime" }
  | { status: "staleOccurrenceMissing" }
  | { status: "inapplicable"; reason: "unsupportedTargetFamily" | "immovableTemplate" }
  | { status: "invalid" }
  | { status: "unsupported" };

export type PlanDecisionReplayResult = {
  decisionId: PlanDecisionV1["id"];
  kind: PlanDecisionV1["kind"];
  target: DurableOccurrenceReference;
} & (
  | { status: "applied" }
  | { status: "outsideWindow" }
  | { status: "staleSourceMissing" | "staleLifetime" | "staleOccurrenceMissing" }
  | { status: "inapplicable"; reason: "unsupportedTargetFamily" | "immovableTemplate" }
  | { status: "blocked"; reason: "exactPlacementUnavailable" }
  | { status: "invalid" | "unsupported" }
);

/** Current expansion context only; never a placement candidate or durable history. */
export type OmittedOccurrenceContext = Readonly<
  Pick<BlockCandidate, "title" | "category" | "userDayDate"> & {
    decisionId: PlanDecisionV1["id"];
    target: DurableOccurrenceReference;
    occurrenceIdentity: NonNullable<BlockCandidate["occurrenceIdentity"]>;
  }
>;

export function evaluatePlanDecisionApplicability(
  value: unknown,
  authoredSetup: DayFrameAuthoredSetup,
): PlanDecisionApplicability {
  const validation = validatePlanDecision(value);
  if (
    validation.status === "unsupportedVersion" ||
    validation.status === "unsupportedTargetVersion"
  ) {
    return { status: "unsupported" };
  }
  if (validation.status === "invalid") return { status: "invalid" };
  const resolution = resolveDurableOccurrenceReference(validation.decision.target, authoredSetup);
  if (resolution.status === "sourceMissing") return { status: "staleSourceMissing" };
  if (resolution.status === "lifetimeMismatch") return { status: "staleLifetime" };
  if (resolution.status === "occurrenceMissing") return { status: "staleOccurrenceMissing" };
  if (resolution.status === "invalidReference") return { status: "invalid" };
  if (resolution.status === "unsupportedVersion") return { status: "unsupported" };
  const target = validation.decision.target;
  if (target.sourceKind !== "template") {
    return { status: "inapplicable", reason: "unsupportedTargetFamily" };
  }
  const template = authoredSetup.blockTemplates.find((source) => source.id === target.template.id);
  if (validation.decision.kind === "placeOccurrence" && template?.placementType !== "flexible") {
    return { status: "inapplicable", reason: "immovableTemplate" };
  }
  return { status: "applicable" };
}

export function replayPlanDecisions(input: {
  decisions: readonly PlanDecisionV1[];
  authoredSetup: DayFrameAuthoredSetup;
  blockCandidates: BlockCandidate[];
  planningWindowStart: Date;
  planningWindowEnd: Date;
  dayBoundaryStartTime: TimeString;
  weekStartsOn: Weekday;
}): {
  blockCandidates: BlockCandidate[];
  hardPlacementCandidateIds: Set<string>;
  pendingResults: PlanDecisionReplayResult[];
  exactDecisionCandidateIds: Map<string, PlanDecisionV1>;
  omittedOccurrences: OmittedOccurrenceContext[];
} {
  let candidates = input.blockCandidates.map(cloneCandidate);
  const hardPlacementCandidateIds = new Set<string>();
  const exactDecisionCandidateIds = new Map<string, PlanDecisionV1>();
  const pendingResults: PlanDecisionReplayResult[] = [];
  const omittedOccurrences: OmittedOccurrenceContext[] = [];
  const candidateByTarget = new Map<string, BlockCandidate>();
  for (const candidate of candidates) {
    if (!candidate.occurrenceIdentity) continue;
    const constructed = createDurableOccurrenceReference(
      candidate.occurrenceIdentity,
      input.authoredSetup,
    );
    if (constructed.status === "created") {
      candidateByTarget.set(getPlanDecisionTargetKey(constructed.reference), candidate);
    }
  }
  for (const decision of [...input.decisions].sort(compareDecision)) {
    if (decision.kind === "placeSleepOccurrence") continue;
    const base = {
      decisionId: decision.id,
      kind: decision.kind,
      target: structuredClone(decision.target),
    };
    const applicability = evaluatePlanDecisionApplicability(decision, input.authoredSetup);
    if (applicability.status !== "applicable") {
      pendingResults.push({ ...base, ...applicability } as PlanDecisionReplayResult);
      continue;
    }
    const candidate = candidateByTarget.get(getPlanDecisionTargetKey(decision.target));
    if (!candidate) {
      pendingResults.push({ ...base, status: "outsideWindow" });
      continue;
    }
    const index = candidates.findIndex((current) => current.id === candidate.id);
    if (decision.kind === "omitOccurrence") {
      if (candidate.occurrenceIdentity)
        omittedOccurrences.push({
          decisionId: decision.id,
          target: structuredClone(decision.target),
          occurrenceIdentity: structuredClone(candidate.occurrenceIdentity),
          userDayDate: candidate.userDayDate,
          title: candidate.title,
          category: candidate.category,
        });
      candidates = candidates.filter((current) => current.id !== candidate.id);
      pendingResults.push({ ...base, status: "applied" });
    } else if (decision.kind === "setOccurrenceDuration") {
      candidates[index] = { ...candidate, durationMinutes: decision.payload.durationMinutes };
      pendingResults.push({ ...base, status: "applied" });
    } else if (decision.kind === "setOccurrencePriority") {
      candidates[index] = { ...candidate, priority: decision.payload.priority };
      pendingResults.push({ ...base, status: "applied" });
    } else {
      const preferences = resolveEffectiveSchedulePreferencesForUserDayDate({
        shiftCycles: input.authoredSetup.shiftCycles,
        defaultSchedulingPreferences: input.authoredSetup.schedulingPreferences,
        userDayDate: decision.payload.userDayDate,
      });
      const startsAt = placementDate(
        decision.payload.userDayDate,
        decision.payload.startTime,
        preferences.dayBoundaryStartTime,
      );
      const endsAt = new Date(startsAt.getTime() + candidate.durationMinutes * 60_000);
      if (
        startsAt < input.planningWindowStart ||
        startsAt >= input.planningWindowEnd ||
        endsAt > input.planningWindowEnd
      ) {
        pendingResults.push({ ...base, status: "outsideWindow" });
        candidates = candidates.filter((current) => current.id !== candidate.id);
        continue;
      }
      candidates[index] = {
        ...candidate,
        userDayDate: decision.payload.userDayDate,
        userWeekStartDate: getUserWeekStartDate(
          new Date(`${decision.payload.userDayDate}T12:00:00`),
          preferences,
        ) as LocalDateString,
        placementType: "fixed",
        fixedStartTime: decision.payload.startTime,
      };
      hardPlacementCandidateIds.add(candidate.id);
      exactDecisionCandidateIds.set(candidate.id, clonePlanDecisionForReplay(decision));
    }
  }
  return {
    blockCandidates: candidates,
    hardPlacementCandidateIds,
    pendingResults,
    exactDecisionCandidateIds,
    omittedOccurrences,
  };
}

export function finalizePlanDecisionResults(
  pending: PlanDecisionReplayResult[],
  exact: Map<string, PlanDecisionV1>,
  scheduled: DraftScheduledBlock[],
): PlanDecisionReplayResult[] {
  const scheduledIds = new Set(scheduled.map((block) => block.id));
  const exactResults = [...exact].map(([candidateId, decision]) => {
    const base = {
      decisionId: decision.id,
      kind: decision.kind,
      target: structuredClone(decision.target),
    };
    return {
      ...base,
      status: scheduledIds.has(`scheduled_${candidateId}`) ? "applied" : "blocked",
      ...(scheduledIds.has(`scheduled_${candidateId}`)
        ? {}
        : { reason: "exactPlacementUnavailable" }),
    } as PlanDecisionReplayResult;
  });
  const exactIds = new Set([...exact.values()].map((decision) => decision.id));
  return [...pending.filter((result) => !exactIds.has(result.decisionId)), ...exactResults].sort(
    (left, right) =>
      getPlanDecisionTargetKey(left.target).localeCompare(getPlanDecisionTargetKey(right.target)) ||
      left.decisionId.localeCompare(right.decisionId),
  );
}

function placementDate(date: LocalDateString, time: TimeString, boundary: TimeString): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const nextDay = time < boundary ? 1 : 0;
  return new Date(year!, month! - 1, day! + nextDay, hour!, minute!, 0, 0);
}
function cloneCandidate(candidate: BlockCandidate): BlockCandidate {
  return {
    ...candidate,
    externalResources: candidate.externalResources.map((resource) => ({ ...resource })),
  };
}
function clonePlanDecisionForReplay(decision: PlanDecisionV1): PlanDecisionV1 {
  return structuredClone(decision);
}
function compareDecision(left: PlanDecisionV1, right: PlanDecisionV1): number {
  return (
    getPlanDecisionTargetKey(left.target).localeCompare(getPlanDecisionTargetKey(right.target)) ||
    left.id.localeCompare(right.id)
  );
}
