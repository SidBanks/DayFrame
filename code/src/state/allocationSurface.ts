import type { LocalDateString } from "../core/shifts/types.js";
import type { CapacitySurface } from "./capacitySurface.js";
import type { GoalPlanningSurface } from "./goalPlanningSurface.js";
import type { GoalSurface } from "./goalSurface.js";
import type { CapacityResultV1 } from "../core/planning/capacity.js";
import type {
  CompetingDemandInputV1,
  CompetingDemandResultV1,
  CompetingDemandSetV1,
} from "../core/planning/competingDemand.js";
import type { AllocationResultV1 } from "../core/planning/allocation.js";

export function createAllocationSurface(options: {
  capacity: CapacitySurface;
  goals: Pick<GoalSurface, "listGoals">;
  planning: Pick<
    GoalPlanningSurface,
    "listCurrentGoalDemands" | "projectGoalDemand" | "exportGoalPlanningAuthority"
  >;
}) {
  return {
    deriveCompetingDemandContext: async (input: {
      capacity: CapacityResultV1;
      demands: CompetingDemandInputV1[];
      evaluationCutoff: string;
    }) => (await import("../core/planning/competingDemand.js")).deriveCompetingDemandSets(input),
    allocateCompetingSet: async (input: {
      set: CompetingDemandSetV1;
      capacity: CapacityResultV1;
      demands: CompetingDemandInputV1[];
    }) => (await import("../core/planning/allocation.js")).allocateCompetingDemandSet(input),
    allocateAllCompetition: async (input: {
      competition: CompetingDemandResultV1;
      capacity: CapacityResultV1;
      demands: CompetingDemandInputV1[];
    }) =>
      (await import("../core/planning/allocation.js")).allocateAllCompetitionSets({
        sets: input.competition.sets,
        capacity: input.capacity,
        demands: input.demands,
      }),
    resolveCompetingSet: async (result: CompetingDemandResultV1, id: string) =>
      (await import("../core/planning/competingDemand.js")).resolveCompetingDemandSet(result, id),
    resolveAllocationAlternative: async (result: AllocationResultV1, id: string) =>
      (await import("../core/planning/allocation.js")).resolveAllocationAlternative(result, id),
    evaluateCompetingAllocation: async (query: {
      startUserDayDate: LocalDateString;
      endUserDayDateExclusive: LocalDateString;
      evaluationCutoff: string;
    }) => {
      const capacityResult = await options.capacity.queryCapacity(query);
      if (capacityResult.status !== "derived") return capacityResult;
      const authority = options.planning.exportGoalPlanningAuthority(),
        demands = options.goals
          .listGoals()
          .flatMap((goal) => options.planning.listCurrentGoalDemands(goal.id))
          .filter(
            (demand) =>
              demand.lifecycle === "active" &&
              demand.horizon.startUserDayDate === query.startUserDayDate &&
              demand.horizon.endUserDayDateExclusive === query.endUserDayDateExclusive,
          )
          .sort((a, b) => a.id.localeCompare(b.id));
      const inputs: CompetingDemandInputV1[] = [];
      for (const demand of demands) {
        const projection = await options.planning.projectGoalDemand(demand.id),
          feasibility =
            projection.status === "projected"
              ? await options.capacity.evaluateGoalDemandFeasibility({
                  demandId: demand.id,
                  capacity: capacityResult.capacity,
                })
              : undefined;
        if (projection.status !== "projected" || feasibility?.status !== "evaluated") continue;
        inputs.push({
          demand: projection.projection,
          feasibility: feasibility.feasibility,
          priorities: authority.priorities.filter(
            (item) => item.goalId === demand.goalId && item.status === "active",
          ),
        });
      }
      const { deriveCompetingDemandSets } = await import("../core/planning/competingDemand.js"),
        competition = deriveCompetingDemandSets({
          capacity: capacityResult.capacity,
          demands: inputs,
          evaluationCutoff: query.evaluationCutoff,
        }),
        { allocateAllCompetitionSets } = await import("../core/planning/allocation.js");
      return {
        status: "evaluated" as const,
        capacity: capacityResult.capacity,
        demands: inputs,
        competition,
        allocation: allocateAllCompetitionSets({
          sets: competition.sets,
          capacity: capacityResult.capacity,
          demands: inputs,
        }),
      };
    },
  };
}
export type AllocationSurface = ReturnType<typeof createAllocationSurface>;
