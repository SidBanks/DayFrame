import type { CompositionAuthorityV1 } from "../core/planning/commitmentComposition.js";
import type { CompositionSurface, createCompositionSurface } from "./compositionSurface.js";
import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY } from "./dayFrameRuntimeAuthority.js";

export function createLazyCompositionSurface(
  options: Parameters<typeof createCompositionSurface>[0],
): CompositionSurface {
  let surface: CompositionSurface | undefined;
  let loading: Promise<CompositionSurface>;
  const load = () =>
    (loading ??= import("./compositionSurface.js").then(
      (module) => (surface = module.createCompositionSurface(options)),
    ));
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
    exportCompositionAuthority: () => surface?.exportCompositionAuthority() ?? empty(),
    getCompositionIngressStatus: () =>
      surface?.getCompositionIngressStatus() ?? { status: "initializing" },
    getCompositionDurabilityStatus: () => surface?.getCompositionDurabilityStatus() ?? "unknown",
  };
  const keys = [
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
  return new Proxy(
    {},
    {
      ownKeys: () => keys,
      getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
      get(_target, key: string) {
        if (sync[key]) return sync[key];
        if (key === "getCompositionRuntimeAdapter")
          return (capability: typeof DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY) => {
            if (capability !== DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY)
              throw new Error("Invalid capability");
            return {
              id: "composition",
              captureRuntimeSnapshot: () =>
                surface?.getCompositionRuntimeAdapter(capability).captureRuntimeSnapshot() ?? {
                  authority: empty(),
                  desired: empty(),
                  ingress: { status: "initializing" },
                  durability: "unknown",
                },
              installRuntimeExact: (value: never) =>
                surface?.getCompositionRuntimeAdapter(capability).installRuntimeExact(value),
            };
          };
        if (key === "subscribeComposition")
          return (listener: () => void) =>
            surface?.subscribeComposition(listener) ?? (() => undefined);
        if (key.startsWith("get"))
          return (...args: unknown[]) =>
            surface
              ? (surface[key as keyof CompositionSurface] as (...values: unknown[]) => unknown)(
                  ...args,
                )
              : { status: "notFound" };
        return (...args: unknown[]) =>
          load().then((value) =>
            (value[key as keyof CompositionSurface] as (...values: unknown[]) => unknown)(...args),
          );
      },
    },
  ) as CompositionSurface;
}
