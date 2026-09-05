import type { RealizationAuthorityV1 } from "../core/planning/acceptedAllocationRealization.js";
import type { RealizationSurface, createRealizationSurface } from "./realizationSurface.js";
import { createLazySurface } from "./lazySurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";

export function createLazyRealizationSurface(
  options: Parameters<typeof createRealizationSurface>[0],
): RealizationSurface {
  let surface: RealizationSurface | undefined;
  let loading: Promise<RealizationSurface>;
  const load = () =>
    (loading ??= import("./realizationSurface.js").then(
      (module) => (surface = module.createRealizationSurface(options)),
    ));
  const empty = (): RealizationAuthorityV1 => ({ version: 1, realizations: [], facts: [] });
  return createLazySurface(
    [
      "initializeRealizations",
      "realizeAcceptedAllocation",
      "resolveRealization",
      "getRealizationForAcceptedAllocation",
      "listRealizations",
      "listRealizedScheduleFacts",
      "listScheduledGoalWork",
      "listScheduledSupportActivities",
      "listRealizedBufferProtections",
      "resolveScheduledAcceptedSubject",
      "resolveAcceptedScheduleLineage",
      "exportRealizationAuthority",
      "replaceRealizationAuthority",
      "clearRealizationAuthority",
      "getRealizationIngressStatus",
      "getRealizationRuntimeAdapter",
    ],
    load,
    {
      listRealizations: () => surface?.listRealizations() ?? [],
      listRealizedScheduleFacts: () => surface?.listRealizedScheduleFacts() ?? [],
      listScheduledGoalWork: (range?: { startsAt: string; endsAt: string }) =>
        surface?.listScheduledGoalWork(range) ?? [],
      listScheduledSupportActivities: (range?: { startsAt: string; endsAt: string }) =>
        surface?.listScheduledSupportActivities(range) ?? [],
      listRealizedBufferProtections: (range?: { startsAt: string; endsAt: string }) =>
        surface?.listRealizedBufferProtections(range) ?? [],
      exportRealizationAuthority: () => surface?.exportRealizationAuthority() ?? empty(),
      getRealizationIngressStatus: () => surface?.getRealizationIngressStatus() ?? "initializing",
      getRealizationRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
        if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
          throw new Error("Invalid capability");
        return {
          id: "realizations" as const,
          captureRuntimeSnapshot: () =>
            surface?.getRealizationRuntimeAdapter(capability).captureRuntimeSnapshot() ?? {
              authority: empty(),
              ingress: "initializing" as const,
            },
          installRuntimeExact: (value: never) =>
            surface?.getRealizationRuntimeAdapter(capability).installRuntimeExact(value),
        };
      },
    },
  );
}
