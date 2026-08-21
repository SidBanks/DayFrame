import { describe, expect, it } from "vitest";

import { allocateReadableSourceId } from "../allocateReadableSourceId.js";

describe("allocateReadableSourceId", () => {
  it("allocates above the greatest recognized numeric suffix", () => {
    expect(
      allocateReadableSourceId({
        prefix: "shift_",
        occupiedIds: ["shift_1", "shift_3"],
      }),
    ).toBe("shift_4");
  });

  it("preserves numeric padding", () => {
    expect(
      allocateReadableSourceId({
        prefix: "cycle_",
        occupiedIds: ["cycle_001", "cycle_003"],
        numericPadding: 3,
      }),
    ).toBe("cycle_004");
  });

  it("ignores irregular IDs for max selection while treating every value as occupied", () => {
    expect(
      allocateReadableSourceId({
        prefix: "template_",
        occupiedIds: ["template_1", "template_custom", "template_8", "strange_external_id"],
      }),
    ).toBe("template_9");
  });

  it("treats duplicate occupied input as an occupied set", () => {
    expect(
      allocateReadableSourceId({
        prefix: "segment_",
        occupiedIds: ["segment_1", "segment_1", "segment_2"],
      }),
    ).toBe("segment_3");
  });

  it("uses deterministic suffixes when a preferred ID is occupied", () => {
    expect(
      allocateReadableSourceId({
        prefix: "manual_event_",
        preferredId: "manual_event_2026-08-19T13:00:00.000Z",
        occupiedIds: [
          "manual_event_2026-08-19T13:00:00.000Z",
          "manual_event_2026-08-19T13:00:00.000Z_2",
        ],
      }),
    ).toBe("manual_event_2026-08-19T13:00:00.000Z_3");
  });
});
