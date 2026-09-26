import { describe, expect, it } from "vitest";
import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import { requirement } from "./sleepTestFixtures.js";
import { resolveRequiredSleep, type ResolveRequiredSleepInput } from "./resolveRequiredSleep.js";
import { detectSleepFriction, trySleepPlacement } from "./sleepCorrective.js";
import {
  validatePlanDecision,
  type PlanDecisionV1,
  type PlanDecisionId,
} from "../decisions/planDecision.js";
import { deriveFoundationalSchedule } from "../planning/deriveFoundationalSchedule.js";
import { applySuggestedFix } from "../friction/applySuggestedFix.js";
import { solveRequiredSleep } from "./solveRequiredSleep.js";
import { solveSleepPlacementAuthority } from "./sleepPlacementAuthority.js";

const at = "2026-09-01T00:00:00.000Z";
const range = { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-18" } as const;
function setup(): ResolveRequiredSleepInput {
  const state = createInitialDayFrameState({
    schedulingPreferences: { dayBoundaryStartTime: "00:00", weekStartsOn: "monday" },
  });
  state.sleepRequirements = [
    {
      ...requirement(),
      durationMinutes: 120,
      bufferBeforeMinutes: 30,
      bufferAfterMinutes: 30,
      window: { kind: "clock", startClock: "00:00", endClock: "08:00" },
    },
  ];
  return {
    authoredState: state,
    ownerRange: range,
    authority: {
      status: "complete",
      planDecisions: [],
      realizedFacts: [],
      composition: { authority: { version: 1, relationships: [], decisions: [] }, sources: [] },
    },
  };
}
function trial(input = setup(), hour = 2) {
  const r = resolveRequiredSleep(input);
  if (r.status !== "satisfied") throw new Error(JSON.stringify(r));
  const target = r.occurrences.find((o) => o.membership === "requested")!.reference;
  const result = trySleepPlacement(input, {
    target,
    sleepStart: new Date(2026, 8, 17, hour).toISOString(),
  });
  if (result.status !== "available") throw new Error(JSON.stringify(result));
  return result;
}
function pin(input = setup()): PlanDecisionV1 {
  return {
    ...trial(input).candidate,
    version: 1,
    id: "00000000-0000-4000-8000-000000000001" as PlanDecisionId,
    acceptedAt: at,
  };
}
function edit(input: ResolveRequiredSleepInput, patch: Partial<ReturnType<typeof requirement>>) {
  const old = input.authoredState.sleepRequirements![0]!;
  input.authoredState.sleepRequirements!.push({ ...old, ...patch, revision: 2 });
}

describe("Sleep corrective proof and narrow authority", () => {
  it("Try is pure and its exact witness preserves duration and both buffers", () => {
    const input = setup(),
      before = structuredClone(input),
      t = trial(input);
    expect(input).toEqual(before);
    expect(t.candidate.payload).toMatchObject({
      durationMinutes: 120,
      bufferBeforeMinutes: 30,
      bufferAfterMinutes: 30,
      revokedAt: null,
    });
    expect(resolveRequiredSleep(input)).toEqual(resolveRequiredSleep(before));
    expect(t.resolution.status).toBe("satisfied");
  });
  it("replays exact geometry inside canonical planning and never emits a scheduled Sleep block", () => {
    const input = setup(),
      decision = pin(input);
    input.authority.planDecisions = [decision];
    const r = resolveRequiredSleep(input);
    expect(r.status).toBe("satisfied");
    expect(r.placementReviews?.[0]?.status).toBe("applicable");
    const planning = deriveFoundationalSchedule(input);
    expect(planning.foundation.status).toBe("allocatable");
    expect(
      planning.foundation.protection.some(
        (p) =>
          p.startsAt ===
          (decision.kind === "placeSleepOccurrence" ? decision.payload.sleepStart : ""),
      ),
    ).toBe(true);
    expect(planning.schedule.scheduledBlocks).toEqual([]);
  });
  it.each(["omitOccurrence", "setOccurrenceDuration", "setOccurrencePriority", "placeOccurrence"])(
    "rejects %s against a Sleep reference",
    (kind) => {
      const p = pin();
      expect(validatePlanDecision({ ...p, kind })).toMatchObject({ status: "invalid" });
    },
  );
  it.each(["durationMinutes", "bufferBeforeMinutes", "bufferAfterMinutes"] as const)(
    "rejects a payload that weakens %s",
    (key) => {
      const p = pin();
      expect(validatePlanDecision({ ...p, payload: { ...p.payload, [key]: 0 } })).toMatchObject({
        status: "invalid",
      });
    },
  );
  it.each(["omit", "split", "waiveProtection", "enabled", "priority", "window"])(
    "rejects prohibited payload field %s",
    (key) => {
      const p = pin();
      expect(validatePlanDecision({ ...p, payload: { ...p.payload, [key]: true } })).toMatchObject({
        status: "invalid",
      });
    },
  );
  it("accepts a compatible later revision without changing geometry", () => {
    const i = setup();
    i.authority.planDecisions = [pin(i)];
    edit(i, { window: { kind: "clock", startClock: "00:00", endClock: "09:00" } });
    expect(resolveRequiredSleep(i)).toMatchObject({
      status: "satisfied",
      placementReviews: [{ status: "applicable" }],
    });
  });
  it.each([
    { durationMinutes: 180 },
    { bufferBeforeMinutes: 40 },
    { bufferAfterMinutes: 40 },
    { enabled: false },
    {
      window: { kind: "clock" as const, startClock: "04:00" as const, endClock: "08:00" as const },
    },
  ])("blocks incompatible authored changes %j", (patch) => {
    const i = setup();
    i.authority.planDecisions = [pin(i)];
    edit(i, patch);
    const r = resolveRequiredSleep(i);
    expect(r.status).toBe("contextIncomplete");
    expect(r.placementReviews?.[0]?.status).not.toBe("applicable");
    expect(deriveFoundationalSchedule(i).foundation.status).toBe("nonAllocatable");
  });
  it("does not rebind a deleted and recreated source", () => {
    const i = setup();
    i.authority.planDecisions = [pin(i)];
    i.authoredState.sleepRequirements![0]!.incarnationId =
      "22222222-2222-4222-8222-222222222222" as never;
    expect(resolveRequiredSleep(i)).toMatchObject({
      status: "contextIncomplete",
      placementReviews: [{ status: "inapplicable" }],
    });
  });
  it("retains revocation evidence and returns to fresh unconstrained ranking", () => {
    const i = setup(),
      before = resolveRequiredSleep(i),
      p = pin(i);
    if (p.kind !== "placeSleepOccurrence") throw new Error();
    p.payload.revokedAt = at;
    i.authority.planDecisions = [p];
    const r = resolveRequiredSleep(i);
    expect(r.status).toBe("satisfied");
    expect(r.placementReviews).toMatchObject([{ status: "revoked" }]);
    if (r.status === "satisfied" && before.status === "satisfied")
      expect(r.occurrences).toEqual(before.occurrences);
  });
  it("proven infeasibility has stable typed evidence and no fabricated move/ignore fix", () => {
    const i = setup();
    i.authoredState.sleepRequirements![0]!.durationMinutes = 600;
    const r = resolveRequiredSleep(i),
      f = detectSleepFriction(r, at);
    expect(r.status).toBe("infeasible");
    expect(f).toHaveLength(1);
    expect(f[0]).toMatchObject({
      canIgnore: false,
      kind: "sleep",
      suggestedFixes: [],
      sleepEvidence: { kind: "provenIncompatibility" },
    });
    expect(detectSleepFriction(r, "2099-01-01T00:00:00Z")[0]?.id).toBe(f[0]?.id);
    f[0]!.suggestedFixes = [{ id: "forged", label: "Ignore", action: "acceptConflict" }];
    expect(
      applySuggestedFix({
        frictionPoints: f,
        generatedWorkBlocks: [],
        scheduledBlocks: [],
        unplacedCandidates: [],
        selectedFrictionPointId: f[0]!.id,
        selectedSuggestedFixId: "forged",
        dayBoundaryStartTime: "00:00",
        revisedAt: at,
      }),
    ).toMatchObject({ didRevise: false, frictionPoints: [{ ignored: false, resolved: false }] });
  });
  it.each(["protected", "incomplete"] as const)(
    "does not label %s authority infeasible",
    (status) => {
      const i = setup();
      i.authority.status = status;
      expect(detectSleepFriction(resolveRequiredSleep(i), at)).toEqual([]);
    },
  );
  it("does not label budget exhaustion or invalid input infeasible", () => {
    expect(detectSleepFriction(resolveRequiredSleep({ ...setup(), budget: 0 }), at)).toEqual([]);
    expect(detectSleepFriction(resolveRequiredSleep({ ...setup(), budget: -1 }), at)).toEqual([]);
  });
  it("distinguishes pin-induced conflict and generates only freshly joint-validated alternatives", () => {
    const i = setup();
    i.authority.planDecisions = [pin(i)];
    i.authoredState.manualEvents = [
      {
        id: "event",
        incarnationId: "22222222-2222-4222-8222-222222222222",
        title: "Appointment",
        userDayDate: "2026-09-17",
        allDay: false,
        startTime: "01:30",
        endTime: "04:30",
        createdAt: at,
        updatedAt: at,
      } as never,
    ];
    const r = resolveRequiredSleep(i);
    expect(r).toMatchObject({
      status: "contextIncomplete",
      underlyingStatus: "satisfied",
      placementReviews: [{ reason: "pinConflict" }],
    });
    const f = detectSleepFriction(r, at, i);
    expect(f[0]?.sleepEvidence?.kind).toBe("acceptedPlacementReview");
    expect("occurrences" in r).toBe(false); // Only explicitly diagnostic unpinned geometry survives.
    expect(f[0]?.suggestedFixes).toHaveLength(1);
    expect(f[0]?.suggestedFixes[0]?.sleepPlacement?.payload.durationMinutes).toBe(120);
    expect(detectSleepFriction(r, at, i)).toEqual(f);
    i.authoredState.manualEvents[0]!.endTime = "08:00";
    i.authoredState.manualEvents[0]!.startTime = "00:00";
    expect(resolveRequiredSleep(i)).toMatchObject({
      status: "infeasible",
      underlyingStatus: "infeasible",
    });
  });
  it("joint validation rejects individually legal pins which collide with another required Sleep", () => {
    const i = setup(),
      r = resolveRequiredSleep(i);
    if (r.status !== "satisfied") throw new Error();
    const a = r.requiredOccurrences.find((o) => o.membership === "requested")!;
    const b = structuredClone(a);
    b.reference.coordinate.userDayDate = "2026-09-18";
    b.ownerDay = "2026-09-18";
    const input = {
      ownerRange: range,
      occurrences: [a, b],
      occupancy: [],
      physicalContext: r.physicalContext,
      configured: true,
    };
    expect(solveRequiredSleep(input).status).toBe("satisfied");
    const p = pin(i);
    if (p.kind !== "placeSleepOccurrence") throw new Error();
    const second = {
      ...p,
      id: "00000000-0000-4000-8000-000000000002" as PlanDecisionId,
      target: b.reference,
    };
    expect(solveSleepPlacementAuthority(input, [p, second])).toMatchObject({
      status: "contextIncomplete",
      underlyingStatus: "satisfied",
    });
    expect(solveSleepPlacementAuthority({ ...input, occurrences: [b, a] }, [second, p])).toEqual(
      solveSleepPlacementAuthority(input, [p, second]),
    );
  });
});

it("an accepted pin affects exactly one owner occurrence and never propagates", () => {
  const i = setup();
  i.ownerRange = { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-20" };
  const original = resolveRequiredSleep(i);
  if (original.status !== "satisfied") throw new Error();
  const p = pin(i);
  i.authority.planDecisions = [p];
  const revised = resolveRequiredSleep(i);
  if (revised.status !== "satisfied") throw new Error();
  for (const o of original.occurrences)
    if (o.ownerDay !== "2026-09-17")
      expect(revised.occurrences.find((r) => r.ownerDay === o.ownerDay)?.sleepStart).toBe(
        o.sleepStart,
      );
  expect(i.authoredState.sleepRequirements).toEqual(setup().authoredState.sleepRequirements);
});
it.each([0, 7])("Try rejects out-of-domain full footprint at hour %s", (hour) => {
  const i = setup(),
    r = resolveRequiredSleep(i);
  if (r.status !== "satisfied") throw new Error();
  expect(
    trySleepPlacement(i, {
      target: r.occurrences.find((o) => o.membership === "requested")!.reference,
      sleepStart: new Date(2026, 8, 17, hour).toISOString(),
    }).status,
  ).toBe("unavailable");
});
it("canonical solver refuses duplicate exact constraints rather than choosing one", () => {
  const i = setup(),
    r = resolveRequiredSleep(i);
  if (r.status !== "satisfied") throw new Error();
  const o = r.occurrences.find((o) => o.membership === "requested")!;
  expect(
    solveRequiredSleep({
      ownerRange: range,
      occurrences: r.requiredOccurrences,
      occupancy: [],
      physicalContext: r.physicalContext,
      configured: true,
      exactPlacements: [
        { reference: o.reference, sleepStart: o.sleepStart },
        { reference: o.reference, sleepStart: o.sleepStart },
      ],
    }).status,
  ).toBe("invalid");
});
