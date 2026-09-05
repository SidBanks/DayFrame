import type { CapacitySurface, createCapacitySurface } from "./capacitySurface.js";
import { createLazySurface } from "./lazySurface.js";

export function createLazyCapacitySurface(
  options: Parameters<typeof createCapacitySurface>[0],
): CapacitySurface {
  let loading: Promise<CapacitySurface>;
  const load = () =>
    (loading ??= import("./capacitySurface.js").then((module) =>
      module.createCapacitySurface(options),
    ));
  return createLazySurface(
    ["queryCapacity", "queryCapacityForUserDay", "evaluateGoalDemandFeasibility"],
    load,
  );
}
