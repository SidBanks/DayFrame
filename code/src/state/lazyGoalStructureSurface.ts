import type { GoalStructureAuthorityV1 } from "../core/planning/goalStructure.js";
import type { GoalStructureSurface, createGoalStructureSurface } from "./goalStructureSurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";
import { createLazySurface } from "./lazySurface.js";

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
    getGoalStructureRelationshipRevision: (...args) =>
      (
        surface?.getGoalStructureRelationshipRevision as
          | ((...values: never[]) => unknown)
          | undefined
      )?.(...args) ?? { status: "notFound" },
    getGoalStructureMilestoneRevision: (...args) =>
      (
        surface?.getGoalStructureMilestoneRevision as ((...values: never[]) => unknown) | undefined
      )?.(...args) ?? { status: "notFound" },
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
  return createLazySurface(keys, load, {
    ...sync,
    subscribeGoalStructure: (listener: () => void) =>
      surface?.subscribeGoalStructure(listener) ?? (() => undefined),
    getRuntimeAuthorityAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return {
        id: "goalStructure" as const,
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
