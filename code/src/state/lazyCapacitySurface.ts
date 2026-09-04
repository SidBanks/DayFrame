import type { CapacitySurface, createCapacitySurface } from "./capacitySurface.js";

export function createLazyCapacitySurface(
  options: Parameters<typeof createCapacitySurface>[0],
): CapacitySurface {
  let loading: Promise<CapacitySurface>;
  const load = () =>
    (loading ??= import("./capacitySurface.js").then((module) =>
      module.createCapacitySurface(options),
    ));
  return new Proxy(
    {},
    {
      ownKeys: () => ["queryCapacity", "queryCapacityForUserDay", "evaluateGoalDemandFeasibility"],
      getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
      get:
        (_target, key: keyof CapacitySurface) =>
        (...args: unknown[]) =>
          load().then((surface) => (surface[key] as (...values: unknown[]) => unknown)(...args)),
    },
  ) as CapacitySurface;
}
