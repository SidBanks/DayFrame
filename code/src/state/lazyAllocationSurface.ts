import type { AllocationSurface, createAllocationSurface } from "./allocationSurface.js";
import { createLazySurface } from "./lazySurface.js";

export function createLazyAllocationSurface(
  options: Parameters<typeof createAllocationSurface>[0],
): AllocationSurface {
  let loading: Promise<AllocationSurface>;
  const load = () =>
    (loading ??= import("./allocationSurface.js").then((module) =>
      module.createAllocationSurface(options),
    ));
  const keys = [
    "deriveCompetingDemandContext",
    "allocateCompetingSet",
    "allocateAllCompetition",
    "resolveCompetingSet",
    "resolveAllocationAlternative",
    "evaluateCompetingAllocation",
  ];
  return createLazySurface(keys, load);
}
