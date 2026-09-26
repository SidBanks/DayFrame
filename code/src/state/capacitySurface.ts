import type { LocalDateString } from "../core/shifts/types.js";
import type { DayFrameState } from "./types.js";
import type { PlanningFactId } from "../core/planning/planningFoundation.js";
import type { CapacityResultV1 } from "../core/planning/capacity.js";
import type { GoalPlanningSurface } from "./goalPlanningSurface.js";

export function createCapacitySurface(options: {
  getState: () => DayFrameState;
  derivePlanning?: (
    range: import("../core/sleep/sleepResolution.js").SleepOwnerRange,
  ) => Promise<import("../core/planning/deriveFoundationalSchedule.js").FoundationalScheduleV1>;
  projectGoalDemand: GoalPlanningSurface["projectGoalDemand"];
  resolveDemandResourceFootprintAssociation?: GoalPlanningSurface["resolveDemandResourceFootprintAssociation"];
  getIntegrity?: () => "valid" | "protected";
  listRealizedScheduleFacts?: () => import("../core/planning/realizedScheduleIdentity.js").RealizedScheduleFactV1[];
  listAcceptedAllocations?: () => import("../core/planning/proposal.js").AcceptedAllocationV2[];
}) {
  async function queryCapacity(query: {
    startUserDayDate: LocalDateString;
    endUserDayDateExclusive: LocalDateString;
  }) {
    const { deriveCapacity } = await import("../core/planning/capacity.js");
    const planning = await options.derivePlanning?.(query);
    const state = options.getState(),
      preview = state.preview;
    if (!planning && options.getIntegrity?.() === "protected")
      return { status: "unavailable" as const, reason: "protectedAuthority" as const };
    if (!planning && !preview)
      return { status: "unavailable" as const, reason: "noPreview" as const };
    const resolver = planning?.resolver ?? {
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
    };
    if (
      !planning &&
      preview &&
      (query.endUserDayDateExclusive <= preview.rangeStartDate ||
        query.startUserDayDate > preview.rangeEndDate)
    )
      return { status: "unavailable" as const, reason: "outsidePreview" as const };
    const schedule = planning?.schedule ?? preview!.result;
    const realized = planning
      ? (schedule.realizedScheduleFacts ?? [])
      : (options.listRealizedScheduleFacts?.() ?? []);
    return {
      status: "derived" as const,
      resolver,
      capacity: deriveCapacity({
        ...query,
        resolver,
        schedule: {
          ...(planning
            ? { foundation: planning.foundation, hardOccupancy: planning.hardOccupancy }
            : {}),
          scheduledBlocks: schedule.scheduledBlocks,
          generatedWorkBlocks: schedule.generatedWorkBlocks,
          unplacedCandidates: schedule.unplacedCandidates,
          ...(schedule.compositionResults ? { composites: schedule.compositionResults } : {}),
          realizedScheduleFacts: realized,
          acceptedUnrealizedClaims: (options.listAcceptedAllocations?.() ?? []).flatMap(
            (accepted) =>
              realized.some((fact) => fact.origin.acceptedAllocationId === accepted.id)
                ? []
                : accepted.claims,
          ),
          isStale: planning ? false : preview!.isStale,
          planningWindow: planning?.planningWindow ?? {
            startsAt: preview!.planningWindowStart,
            endsAt: preview!.planningWindowEnd,
          },
        },
      }),
    };
  }
  return {
    queryCapacity,
    queryCapacityForUserDay: async (userDayDate: LocalDateString) => {
      return queryCapacity({
        startUserDayDate: userDayDate,
        endUserDayDateExclusive: nextLabel(userDayDate),
      });
    },
    evaluateGoalDemandFeasibility: async (input: {
      demandId: PlanningFactId;
      capacity: CapacityResultV1;
      evaluationInstant?: string;
      projection?: import("../core/planning/goalDemandProjection.js").DemandProjectionV1;
    }) => {
      const current = options.derivePlanning
        ? await queryCapacity(input.capacity.query)
        : undefined;
      const capacity = current?.status === "derived" ? current.capacity : input.capacity;
      const projected = input.projection
        ? { status: "projected" as const, projection: input.projection }
        : await options.projectGoalDemand(input.demandId, undefined, input.evaluationInstant);
      if (projected.status !== "projected")
        return { status: projected.status as "notFound" | "unknown" };
      const { evaluateGoalFeasibility } = await import("../core/planning/goalFeasibility.js");
      const resolver =
        current?.status === "derived"
          ? current.resolver
          : {
              shiftCycles: options.getState().shiftCycles,
              defaultSchedulingPreferences: options.getState().schedulingPreferences,
            };
      return {
        status: "evaluated" as const,
        feasibility: evaluateGoalFeasibility({
          demand: projected.projection,
          capacity,
          ...(options.resolveDemandResourceFootprintAssociation
            ? {
                footprintAssociation: options.resolveDemandResourceFootprintAssociation(
                  projected.projection.demandId,
                ),
                resolver,
              }
            : {}),
        }),
      };
    },
  };
}
export type CapacitySurface = ReturnType<typeof createCapacitySurface>;

function nextLabel(value: LocalDateString): LocalDateString {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10) as LocalDateString;
}
