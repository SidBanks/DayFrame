import { describe, expect, it } from "vitest";
import {
  validateSleepRequirement,
  validateSleepRequirements,
  queryEffectiveSleepRequirement,
} from "./sleepRequirement.js";
import { createSleepOccurrenceReference } from "../occurrences/sleepOccurrenceReference.js";
import {
  validateDurableOccurrenceReference,
  cloneDurableOccurrenceReference,
  createDurableOccurrenceReference,
  durableOccurrenceReferencesEqual,
  resolveDurableOccurrenceReference,
  validateScheduledOccurrenceReference,
} from "../occurrences/durableOccurrenceReference.js";
import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import { validatePlanDecision } from "../decisions/planDecision.js";

import { requirement } from "./sleepTestFixtures.js";
describe("Sleep authored foundation", () => {
  it.each(["clock", "beforeWork", "afterWork"] as const)(
    "validates %s without needing Work/Preview",
    (kind) => {
      const value = requirement();
      value.window =
        kind === "clock"
          ? { kind, startClock: "22:00", endClock: "22:00", preferredStartClock: "23:00" }
          : { kind, spanMinutes: 540, offDay: { startClock: "22:00", endClock: "08:00" } };
      expect(validateSleepRequirement(value)).toEqual(value);
    },
  );
  it.each([
    { version: 2 },
    { id: " " },
    { incarnationId: "old" },
    { revision: 0 },
    { revision: 1.5 },
    { enabled: undefined },
    { effectiveFrom: "2026-02-30" },
    { effectiveUntilExclusive: "2026-09-01" },
    { weekdays: [] },
    { weekdays: ["monday", "monday"] },
    { weekdays: ["noday"] },
    { durationMinutes: 0 },
    { durationMinutes: 1441 },
    { durationMinutes: 10.5 },
    { bufferBeforeMinutes: -1 },
    { bufferAfterMinutes: 1441 },
    { window: { kind: "clock", startClock: "25:00", endClock: "08:00" } },
    {
      window: {
        kind: "clock",
        startClock: "22:00",
        endClock: "08:00",
        preferredStartClock: "7:00",
      },
    },
    { window: { kind: "beforeWork", spanMinutes: 1440 } },
    {
      window: {
        kind: "afterWork",
        spanMinutes: 4321,
        offDay: { startClock: "22:00", endClock: "08:00" },
      },
    },
    {
      window: {
        kind: "beforeWork",
        spanMinutes: 539,
        offDay: { startClock: "22:00", endClock: "08:00" },
      },
    },
    { createdAt: "yesterday" },
    { updatedAt: "2026-02-30T00:00:00Z" },
    { priority: 1 },
  ])("rejects malformed authority %#", (change) =>
    expect(() => validateSleepRequirement({ ...requirement(), ...change })).toThrow(),
  );
  it("compares valid UTC timestamps chronologically across supported precision", () => {
    const a = {
      ...requirement(),
      createdAt: "2026-09-01T00:00:00Z",
      updatedAt: "2026-09-01T00:00:00.001Z",
    };
    expect(validateSleepRequirement(a)).toEqual(a);
    expect(() =>
      validateSleepRequirement({ ...a, createdAt: a.updatedAt, updatedAt: "2026-09-01T00:00:00Z" }),
    ).toThrow();
  });
  it("selects effective revisions by authored dates, highest same-date revision; never falls back after expiry", () => {
    const a = requirement(),
      b = { ...a, revision: 2, effectiveFrom: "2026-09-03" as const, durationMinutes: 420 },
      c = {
        ...b,
        revision: 3,
        durationMinutes: 450,
        effectiveUntilExclusive: "2026-09-06" as const,
      };
    expect(queryEffectiveSleepRequirement([c, a, b], "2026-09-03")).toEqual({
      status: "effective",
      requirement: c,
    });
    expect(queryEffectiveSleepRequirement([a, b, c], "2026-09-03")).toEqual(
      queryEffectiveSleepRequirement([c, a, b], "2026-09-03"),
    );
    expect(queryEffectiveSleepRequirement([a, b, c], "2026-09-06")).toEqual({
      status: "notApplicable",
    });
    expect(queryEffectiveSleepRequirement([a, b, c], "2026-08-31")).toEqual({
      status: "notApplicable",
    });
    expect(queryEffectiveSleepRequirement([], "2026-09-01")).toEqual({ status: "notConfigured" });
    expect(queryEffectiveSleepRequirement([{ ...a, enabled: false }], "2026-09-01").status).toBe(
      "disabled",
    );
    expect(
      queryEffectiveSleepRequirement([{ ...a, weekdays: ["monday"] }], "2026-09-01").status,
    ).toBe("notApplicable");
    expect(queryEffectiveSleepRequirement([{}], "2026-09-01").status).toBe("invalid");
  });
  it("rejects competing lifetimes, duplicate revisions, and retrograde effective edits", () => {
    const a = requirement();
    for (const b of [
      { ...a, id: "other" },
      { ...a, incarnationId: "22222222-2222-4222-8222-222222222222" },
      a,
      { ...a, revision: 2, effectiveFrom: "2026-08-31" },
    ])
      expect(() => validateSleepRequirements([a, b])).toThrow();
  });
  it("validates and clones reference identity, independent of geometry/revision/context", () => {
    const a = requirement(),
      ref = createSleepOccurrenceReference(a, "2026-09-02");
    const changed = { ...a, revision: 2, durationMinutes: 420 };
    expect(
      durableOccurrenceReferencesEqual(ref, createSleepOccurrenceReference(changed, "2026-09-02")),
    ).toBe(true);
    expect(validateDurableOccurrenceReference(JSON.parse(JSON.stringify(ref)))).toEqual({
      status: "valid",
      reference: ref,
    });
    const copy = cloneDurableOccurrenceReference(ref);
    if (copy.sourceKind === "sleepRequirement") copy.requirement.id = "mutated";
    expect(ref.requirement.id).toBe(a.id);
    expect(validateDurableOccurrenceReference({ ...ref, version: 2 }).status).toBe(
      "unsupportedVersion",
    );
    expect(validateDurableOccurrenceReference({ ...ref, sourceKind: "future" }).status).toBe(
      "invalid",
    );
    expect(
      validateDurableOccurrenceReference({ ...ref, coordinate: { ...ref.coordinate, slot: 1 } })
        .status,
    ).toBe("invalid");
    expect(validateDurableOccurrenceReference({ ...ref, durationMinutes: 480 }).status).toBe(
      "invalid",
    );
    const state = { ...createInitialDayFrameState(), sleepRequirements: [changed] };
    expect(
      createDurableOccurrenceReference(
        {
          version: 1,
          sourceKind: "sleepRequirement",
          requirementId: a.id,
          scopeKind: "userDay",
          userDayDate: "2026-09-02",
          slot: 0,
        },
        state,
      ),
    ).toEqual({ status: "created", reference: ref });
    expect(
      durableOccurrenceReferencesEqual(ref, {
        version: 1,
        sourceKind: "template",
        template: ref.requirement,
        recurrence: ref.requirement,
        coordinate: {
          frequency: "daily",
          scopeKind: "userDay",
          userDayDate: "2026-09-02",
          slot: 0,
        },
      }),
    ).toBe(false);
    expect(resolveDurableOccurrenceReference(ref, state).status).toBe("resolved");
    expect(
      resolveDurableOccurrenceReference(ref, {
        ...state,
        sleepRequirements: [
          {
            ...changed,
            incarnationId: "22222222-2222-4222-8222-222222222222" as typeof a.incarnationId,
          },
        ],
      }).status,
    ).toBe("lifetimeMismatch");
    expect(resolveDurableOccurrenceReference(ref, { ...state, sleepRequirements: [] }).status).toBe(
      "sourceMissing",
    );
    expect(
      durableOccurrenceReferencesEqual(ref, {
        version: 1,
        sourceKind: "manualEvent",
        manualEvent: ref.requirement,
      }),
    ).toBe(false);
  });
  it("does not admit a foundation identity into existing downstream authority", () => {
    const reference = createSleepOccurrenceReference(requirement(), "2026-09-02");
    expect(validateScheduledOccurrenceReference(reference).status).toBe("invalid");
    expect(
      validatePlanDecision({
        version: 1,
        id: "22222222-2222-4222-8222-222222222222",
        kind: "omitOccurrence",
        target: reference,
        payload: {},
        provenance: { source: "user" },
        acceptedAt: "2026-09-01T00:00:00.000Z",
      }).status,
    ).toBe("invalid");
  });
});
