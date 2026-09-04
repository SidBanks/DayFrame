import type { GoalPlanningAuthorityV1 } from "../core/planning/goalDemand.js";
import type { GoalPlanningSurface, createGoalPlanningSurface } from "./goalPlanningSurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";

export function createLazyGoalPlanningSurface(
  options: Parameters<typeof createGoalPlanningSurface>[0],
): GoalPlanningSurface {
  let surface: GoalPlanningSurface | undefined, loading: Promise<GoalPlanningSurface>;
  const empty = (): GoalPlanningAuthorityV1 => ({ version: 1, demands: [], priorities: [] });
  const load = () =>
    (loading ??= import("./goalPlanningSurface.js").then(
      (module) => (surface = module.createGoalPlanningSurface(options)),
    ));
  const sync: Record<string, (...args: never[]) => unknown> = {
    exportGoalPlanningAuthority: () => surface?.exportGoalPlanningAuthority() ?? empty(),
    listCurrentGoalDemands: (id) => surface?.listCurrentGoalDemands(id) ?? [],
    getApplicableGoalPriority: (id, date) => surface?.getApplicableGoalPriority(id, date),
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
  return new Proxy(
    {},
    {
      ownKeys: () => keys,
      getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
      get(_target, key: string) {
        if (sync[key]) return sync[key];
        if (key === "getRuntimeAuthorityAdapter")
          return (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
            if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
              throw new Error("Invalid capability");
            return {
              id: "goalPlanning",
              captureRuntimeSnapshot: () =>
                surface?.getRuntimeAuthorityAdapter(capability).captureRuntimeSnapshot() ?? {
                  authority: empty(),
                  desired: empty(),
                  ingress: { status: "initializing" },
                  durability: "unknown",
                },
              installRuntimeExact: (value: never) =>
                surface?.getRuntimeAuthorityAdapter(capability).installRuntimeExact(value),
            };
          };
        if (key === "subscribeGoalPlanning")
          return (listener: () => void) =>
            surface?.subscribeGoalPlanning(listener) ?? (() => undefined);
        if (key.startsWith("get") || key.startsWith("list"))
          return (...args: unknown[]) =>
            surface
              ? (surface[key as keyof GoalPlanningSurface] as (...values: unknown[]) => unknown)(
                  ...args,
                )
              : { status: "notFound" };
        return (...args: unknown[]) =>
          load().then((value) =>
            (value[key as keyof GoalPlanningSurface] as (...values: unknown[]) => unknown)(...args),
          );
      },
    },
  ) as GoalPlanningSurface;
}
