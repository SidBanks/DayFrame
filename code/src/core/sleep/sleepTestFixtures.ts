import type { SleepRequirementV1 } from "./sleepRequirement.js";
export const requirement = (): SleepRequirementV1 => ({
  version: 1,
  id: "primary-sleep",
  incarnationId: "11111111-1111-4111-8111-111111111111" as SleepRequirementV1["incarnationId"],
  revision: 1,
  enabled: true,
  effectiveFrom: "2026-09-01",
  weekdays: "all",
  durationMinutes: 480,
  window: {
    kind: "beforeWork",
    spanMinutes: 1440,
    offDay: { startClock: "22:00", endClock: "08:00" },
  },
  bufferBeforeMinutes: 30,
  bufferAfterMinutes: 30,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
});
