import { describe, expect, it, vi } from "vitest";
import { createCapacitySurface } from "./capacitySurface.js";

describe("Capacity query surface", () => {
  it("distinguishes unavailable Preview and protected authority from zero Capacity", async () => {
    const noPreview = createCapacitySurface({
      getState: () => ({ preview: null }) as never,
      projectGoalDemand: vi.fn() as never,
    });
    expect(await noPreview.queryCapacityForUserDay("2026-09-07")).toEqual({
      status: "unavailable",
      reason: "noPreview",
    });
    const protectedSurface = createCapacitySurface({
      getState: () => ({ preview: null }) as never,
      projectGoalDemand: vi.fn() as never,
      getIntegrity: () => "protected",
    });
    expect(await protectedSurface.queryCapacityForUserDay("2026-09-07")).toEqual({
      status: "unavailable",
      reason: "protectedAuthority",
    });
  });
});
