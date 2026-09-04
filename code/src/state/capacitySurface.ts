import type { LocalDateString } from "../core/shifts/types.js";
import type { DayFrameState } from "./types.js";
import type { PlanningFactId } from "../core/planning/planningFoundation.js";
import type { CapacityResultV1 } from "../core/planning/capacity.js";
import type { GoalPlanningSurface } from "./goalPlanningSurface.js";

export function createCapacitySurface(options: {
  getState: () => DayFrameState;
  projectGoalDemand: GoalPlanningSurface["projectGoalDemand"];
  getIntegrity?: () => "valid" | "protected";
}) {
  async function queryCapacity(query: {
    startUserDayDate: LocalDateString;
    endUserDayDateExclusive: LocalDateString;
  }) {
    const state = options.getState(),
      preview = state.preview;
    if (options.getIntegrity?.() === "protected")
      return { status: "unavailable" as const, reason: "protectedAuthority" as const };
    if (!preview) return { status: "unavailable" as const, reason: "noPreview" as const };
    const { deriveCapacity } = await import("../core/planning/capacity.js");
    const resolver = {
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
    };
    if (
      query.endUserDayDateExclusive <= preview.rangeStartDate ||
      query.startUserDayDate > preview.rangeEndDate
    )
      return { status: "unavailable" as const, reason: "outsidePreview" as const };
    return {
      status: "derived" as const,
      capacity: deriveCapacity({
        ...query,
        resolver,
        schedule: {
          scheduledBlocks: preview.result.scheduledBlocks,
          generatedWorkBlocks: preview.result.generatedWorkBlocks,
          unplacedCandidates: preview.result.unplacedCandidates,
          ...(preview.result.compositionResults
            ? { composites: preview.result.compositionResults }
            : {}),
          isStale: preview.isStale,
          planningWindow: {
            startsAt: preview.planningWindowStart,
            endsAt: preview.planningWindowEnd,
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
    }) => {
      const projected = await options.projectGoalDemand(input.demandId);
      if (projected.status !== "projected")
        return { status: projected.status as "notFound" | "unknown" };
      const { evaluateGoalFeasibility } = await import("../core/planning/goalFeasibility.js");
      return {
        status: "evaluated" as const,
        feasibility: evaluateGoalFeasibility({
          demand: projected.projection,
          capacity: input.capacity,
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
