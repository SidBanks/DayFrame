import { createAcceptanceLifecycle } from "./acceptanceLifecycle.js";
import type { RealizationAuthorityV1 } from "../core/planning/acceptedAllocationRealization.js";
import type { RealizationSurface, createRealizationSurface } from "./realizationSurface.js";
import { createLazySurface } from "./lazySurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";

export function createLazyRealizationSurface(
  options: Parameters<typeof createRealizationSurface>[0],
): RealizationSurface {
  const lifecycle = options.lifecycle ?? createAcceptanceLifecycle();
  let installed = options.initialRuntime;
  let surface: RealizationSurface | undefined;
  let loading: Promise<RealizationSurface>;
  const load = () =>
    (loading ??= import("./realizationSurface.js").then((module) => {
      surface = module.createRealizationSurface({
        ...options,
        lifecycle,
        ...(installed === undefined
          ? {}
          : {
              initialRuntime: installed as NonNullable<
                Parameters<typeof createRealizationSurface>[0]["initialRuntime"]
              >,
            }),
      });
      return surface;
    }));
  const empty = (): RealizationAuthorityV1 => ({ version: 1, realizations: [], facts: [] });
  const selectInstalled = (
    role: RealizationAuthorityV1["facts"][number]["scheduleRole"],
    range?: { startsAt: string; endsAt: string },
  ) =>
    structuredClone(
      (installed?.authority.facts ?? []).filter(
        (fact) =>
          fact.scheduleRole === role &&
          (!range || (fact.startsAt < range.endsAt && range.startsAt < fact.endsAt)),
      ),
    );
  const dispatch = Object.fromEntries(
    [
      "initializeRealizations",
      "realizeAcceptedAllocation",
      "replaceRealizationAuthority",
      "clearRealizationAuthority",
    ].map((key) => [
      key,
      (...args: unknown[]) => {
        const origin = lifecycle.origin(),
          input = structuredClone(args);
        const invoke = (owner: RealizationSurface) =>
          lifecycle.enter(origin, () =>
            (owner[key as keyof RealizationSurface] as (...values: unknown[]) => unknown)(...input),
          );
        return surface ? invoke(surface) : load().then(invoke);
      },
    ]),
  );
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
      "getRealizationReviewEvidence",
      "getRealizationIngressStatus",
      "getRealizationProtectionEvidence",
      "getRealizationRuntimeAdapter",
      "clearRealizationForCoordinator",
    ],
    load,
    {
      ...dispatch,
      getRealizationReviewEvidence: () =>
        surface?.getRealizationReviewEvidence() ?? {
          observation: lifecycle.observation,
          protectionCause: undefined,
          active: !lifecycle.isQuiescent(),
        },
      listRealizations: () =>
        surface?.listRealizations() ?? structuredClone(installed?.authority.realizations ?? []),
      listRealizedScheduleFacts: () =>
        surface?.listRealizedScheduleFacts() ?? structuredClone(installed?.authority.facts ?? []),
      listScheduledGoalWork: (range?: { startsAt: string; endsAt: string }) =>
        surface?.listScheduledGoalWork(range) ?? selectInstalled("productiveGoalWork", range),
      listScheduledSupportActivities: (range?: { startsAt: string; endsAt: string }) =>
        surface?.listScheduledSupportActivities(range) ?? selectInstalled("supportActivity", range),
      listRealizedBufferProtections: (range?: { startsAt: string; endsAt: string }) =>
        surface?.listRealizedBufferProtections(range) ?? selectInstalled("bufferProtection", range),
      exportRealizationAuthority: () =>
        surface?.exportRealizationAuthority() ?? structuredClone(installed?.authority ?? empty()),
      getRealizationIngressStatus: () =>
        surface?.getRealizationIngressStatus() ?? installed?.ingress ?? "initializing",
      getRealizationProtectionEvidence: (
        capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
      ) => {
        if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
          throw new Error("Invalid capability");
        return surface?.getRealizationProtectionEvidence(capability);
      },
      getRealizationRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
        if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
          throw new Error("Invalid capability");
        return {
          id: "realizations" as const,
          captureRuntimeSnapshot: () =>
            surface?.getRealizationRuntimeAdapter(capability).captureRuntimeSnapshot() ??
            installed ?? {
              authority: empty(),
              ingress: "initializing" as const,
            },
          installRuntimeExact: (value: never) => {
            lifecycle.assertInstall();
            lifecycle.invalidate();
            installed = structuredClone(value);
            surface?.getRealizationRuntimeAdapter(capability).installRuntimeExact(value);
            lifecycle.observation.changed();
          },
        };
      },
    },
  );
}
