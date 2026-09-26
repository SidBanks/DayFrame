import { createSourceObservation } from "./sourceObservation.js";
import type { CompositionAuthorityV1 } from "../core/planning/commitmentComposition.js";
import type { CompositionSurface, createCompositionSurface } from "./compositionSurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";
import { createLazySurface } from "./lazySurface.js";

export function createLazyCompositionSurface(
  options: Parameters<typeof createCompositionSurface>[0],
): CompositionSurface {
  const reviewObservation = options.reviewObservation ?? createSourceObservation();
  let installed:
    | ReturnType<
        ReturnType<CompositionSurface["getCompositionRuntimeAdapter"]>["captureRuntimeSnapshot"]
      >
    | undefined;
  let surface: CompositionSurface | undefined;
  let loading: Promise<CompositionSurface>;
  const load = () =>
    (loading ??= import("./compositionSurface.js").then((module) => {
      surface = module.createCompositionSurface({ ...options, reviewObservation });
      if (installed)
        surface
          .getCompositionRuntimeAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
          .installRuntimeExact(installed);
      return surface;
    }));
  const empty = (): CompositionAuthorityV1 => ({ version: 1, relationships: [], decisions: [] });
  const sync: Record<string, (...args: never[]) => unknown> = {
    listCurrentAttachments: () => surface?.listCurrentAttachments() ?? [],
    projectCompositeOccurrence: (...args) =>
      surface && (surface.projectCompositeOccurrence as (...values: never[]) => unknown)(...args),
    applyCompositionToSchedule: (...args) =>
      surface && (surface.applyCompositionToSchedule as (...values: never[]) => unknown)(...args),
    filterIndependentRecurrences: (...args) =>
      surface
        ? (surface.filterIndependentRecurrences as (...values: never[]) => unknown)(...args)
        : args[0],
    exportCompositionAuthority: () =>
      surface?.exportCompositionAuthority() ?? structuredClone(installed?.authority ?? empty()),
    getCompositionIngressStatus: () =>
      surface?.getCompositionIngressStatus() ??
      structuredClone(installed?.ingress ?? { status: "initializing" }),
    getCompositionDurabilityStatus: () =>
      surface?.getCompositionDurabilityStatus() ?? installed?.durability ?? "unknown",
    getAttachmentRevision: (...args) =>
      (surface?.getAttachmentRevision as ((...values: never[]) => unknown) | undefined)?.(
        ...args,
      ) ?? { status: "notFound" },
    getCompositeDecisionRevision: (...args) =>
      (surface?.getCompositeDecisionRevision as ((...values: never[]) => unknown) | undefined)?.(
        ...args,
      ) ?? { status: "notFound" },
  };
  const keys = [
    "getCompositionReviewObservation",
    "initializeComposition",
    "createAttachment",
    "reviseAttachment",
    "retireAttachment",
    "acceptCompositeDecision",
    "getAttachmentRevision",
    "getCompositeDecisionRevision",
    "listCurrentAttachments",
    "projectCompositeOccurrence",
    "applyCompositionToSchedule",
    "filterIndependentRecurrences",
    "exportCompositionAuthority",
    "replaceCompositionAuthority",
    "clearCompositionAuthority",
    "getCompositionIngressStatus",
    "getCompositionDurabilityStatus",
    "retryCompositionPersistence",
    "subscribeComposition",
    "getCompositionRuntimeAdapter",
  ];
  return createLazySurface(keys, load, {
    ...sync,
    getCompositionReviewObservation: () => reviewObservation,
    subscribeComposition: (listener: () => void) => reviewObservation.subscribe(listener),
    getCompositionRuntimeAdapter: (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
      if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
        throw new Error("Invalid capability");
      return {
        id: "composition" as const,
        captureRuntimeSnapshot: () =>
          surface?.getCompositionRuntimeAdapter(capability).captureRuntimeSnapshot() ??
          installed ?? {
            authority: empty(),
            desired: empty(),
            ingress: { status: "initializing" as const },
            durability: "unknown" as const,
          },
        installRuntimeExact: (value: never) => {
          installed = structuredClone(value);
          surface?.getCompositionRuntimeAdapter(capability).installRuntimeExact(value);
          reviewObservation.changed();
        },
      };
    },
  });
}
