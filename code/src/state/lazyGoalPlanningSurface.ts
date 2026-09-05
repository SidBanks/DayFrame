import type { GoalPlanningAuthorityV2 } from "../core/planning/goalDemand.js";
import type { GoalPlanningSurface, createGoalPlanningSurface } from "./goalPlanningSurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";
import { createLazySurface } from "./lazySurface.js";

export function createLazyGoalPlanningSurface(
  options: Parameters<typeof createGoalPlanningSurface>[0],
): GoalPlanningSurface {
  let surface: GoalPlanningSurface | undefined, loading: Promise<GoalPlanningSurface>;
  const empty = (): GoalPlanningAuthorityV2 => ({
    version: 2,
    demands: [],
    priorities: [],
    footprintSpecifications: [],
    footprintAssociations: [],
  });
  const load = () =>
    (loading ??= import("./goalPlanningSurface.js").then(
      (module) => (surface = module.createGoalPlanningSurface(options)),
    ));
  const sync: Record<string, (...args: never[]) => unknown> = {
    exportGoalPlanningAuthority: () => surface?.exportGoalPlanningAuthority() ?? empty(),
    listCurrentGoalDemands: (id) => surface?.listCurrentGoalDemands(id) ?? [],
    getApplicableGoalPriority: (id, date) => surface?.getApplicableGoalPriority(id, date),
    getGoalDemandRevision: (...args) =>
      (surface?.getGoalDemandRevision as ((...values: never[]) => unknown) | undefined)?.(
        ...args,
      ) ?? { status: "notFound" },
    getGoalPriorityRevision: (...args) =>
      (surface?.getGoalPriorityRevision as ((...values: never[]) => unknown) | undefined)?.(
        ...args,
      ) ?? { status: "notFound" },
    resolveDemandResourceFootprintAssociation: (...args) =>
      (
        surface?.resolveDemandResourceFootprintAssociation as
          | ((...values: never[]) => unknown)
          | undefined
      )?.(...args) ?? { status: "unspecified", reason: "surfaceNotLoaded" },
    getGoalPlanningIngressStatus: () =>
      surface?.getGoalPlanningIngressStatus() ?? { status: "initializing" },
    getGoalPlanningDurabilityStatus: () => surface?.getGoalPlanningDurabilityStatus() ?? "unknown",
  };
  const keys = [
    "initializeGoalPlanning",
    "createDemand",
    "reviseDemand",
    "suspendDemand",
    "reactivateDemand",
    "completeDemand",
    "expireDemand",
    "retireDemand",
    "createPriority",
    "revisePriority",
    "retirePriority",
    "createDemandResourceFootprintSpec",
    "reviseDemandResourceFootprintSpec",
    "retireDemandResourceFootprintSpec",
    "setDemandResourceFootprintAssociation",
    "resolveDemandResourceFootprintAssociation",
    "listCurrentGoalDemands",
    "getApplicableGoalPriority",
    "getGoalDemandRevision",
    "getGoalPriorityRevision",
    "projectGoalDemand",
    "exportGoalPlanningAuthority",
    "replaceGoalPlanningAuthority",
    "getGoalPlanningIngressStatus",
    "getGoalPlanningDurabilityStatus",
    "retryGoalPlanningPersistence",
    "clearGoalPlanning",
    "subscribeGoalPlanning",
    "getRuntimeAuthorityAdapter",
  ];
  return createLazySurface(keys, load, {
    ...sync,
    subscribeGoalPlanning: (listener: () => void) =>
      surface?.subscribeGoalPlanning(listener) ?? (() => undefined),
    getRuntimeAuthorityAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return {
        id: "goalPlanning" as const,
        captureRuntimeSnapshot: () =>
          surface?.getRuntimeAuthorityAdapter(capability).captureRuntimeSnapshot() ?? {
            authority: empty(),
            desired: empty(),
            ingress: { status: "initializing" as const },
            durability: "unknown" as const,
          },
        installRuntimeExact: (value: never) =>
          surface?.getRuntimeAuthorityAdapter(capability).installRuntimeExact(value),
      };
    },
  });
}
