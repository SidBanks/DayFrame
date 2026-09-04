import type { GoalStructureAuthorityV1 } from "../core/planning/goalStructure.js";
import type { GoalStructureSurface, createGoalStructureSurface } from "./goalStructureSurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";

export function createLazyGoalStructureSurface(
  options: Parameters<typeof createGoalStructureSurface>[0],
): GoalStructureSurface {
  let surface: GoalStructureSurface | undefined;
  let loading: Promise<GoalStructureSurface>;
  const load = () =>
    (loading ??= import("./goalStructureSurface.js").then(
      (module) => (surface = module.createGoalStructureSurface(options)),
    ));
  const empty = (): GoalStructureAuthorityV1 => ({ version: 1, relationships: [], milestones: [] });
  const sync: Record<string, (...args: never[]) => unknown> = {
    listGoalStructureRelationships: (...args) =>
      (surface?.listGoalStructureRelationships as ((...values: never[]) => unknown) | undefined)?.(
        ...args,
      ) ?? [],
    listGoalStructureMilestones: (...args) =>
      (surface?.listGoalStructureMilestones as ((...values: never[]) => unknown) | undefined)?.(
        ...args,
      ) ?? [],
    getStructuralEligibility: (...args) =>
      (surface?.getStructuralEligibility as ((...values: never[]) => unknown) | undefined)?.(
        ...args,
      ) ?? {
        version: 1,
        goalId: args[0],
        status: "unknown",
        reasons: [],
        dependencies: [],
        dependencyFingerprint: "unavailable",
      },
    exportGoalStructureAuthority: () => surface?.exportGoalStructureAuthority() ?? empty(),
    getGoalStructureIngressStatus: () =>
      surface?.getGoalStructureIngressStatus() ?? { status: "initializing" },
    getGoalStructureDurabilityStatus: () =>
      surface?.getGoalStructureDurabilityStatus() ?? "unknown",
  };
  const keys = [
    "initializeGoalStructure",
    "createRelationship",
    "reviseRelationship",
    "retireRelationship",
    "createMilestone",
    "reviseMilestone",
    "listGoalStructureRelationships",
    "listGoalStructureMilestones",
    "getStructuralEligibility",
    "getGoalStructureRelationshipRevision",
    "getGoalStructureMilestoneRevision",
    "exportGoalStructureAuthority",
    "getGoalStructureIngressStatus",
    "getGoalStructureDurabilityStatus",
    "replaceGoalStructureAuthority",
    "retryGoalStructurePersistence",
    "clearGoalStructure",
    "subscribeGoalStructure",
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
          return (capability: symbol) => {
            if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
              throw new Error("Invalid capability");
            return {
              id: "goalStructure",
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
        if (key === "subscribeGoalStructure")
          return (listener: () => void) =>
            surface?.subscribeGoalStructure(listener) ?? (() => undefined);
        if (key.startsWith("get"))
          return (...args: unknown[]) =>
            surface
              ? (surface[key as keyof GoalStructureSurface] as (...values: unknown[]) => unknown)(
                  ...args,
                )
              : { status: "notFound" };
        return (...args: unknown[]) =>
          load().then((value) =>
            (value[key as keyof GoalStructureSurface] as (...values: unknown[]) => unknown)(
              ...args,
            ),
          );
      },
    },
  ) as GoalStructureSurface;
}
