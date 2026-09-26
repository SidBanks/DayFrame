import { describe, expect, it } from "vitest";
import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import { requirement } from "../sleep/sleepTestFixtures.js";
import type { SleepFoundationAuthority } from "../sleep/sleepFoundationalOccupancy.js";
import type { TimeString } from "../time/types.js";
import { deriveFoundationalSchedule } from "./deriveFoundationalSchedule.js";
import { deriveCapacity } from "./capacity.js";
import { evaluateGoalFeasibility } from "./goalFeasibility.js";
import type { DemandProjectionV1 } from "./goalDemandProjection.js";
import { deriveCompetingDemandSets } from "./competingDemand.js";
import { allocateAllCompetitionSets, allocateCompetingDemandSet } from "./allocation.js";
import { deriveOrdinaryProposal } from "./proposal.js";
import { allocation } from "./proposalTestFixtures.js";
import { addUserDayLabels } from "../time/canonicalUserDay.js";

const range = { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-18" } as const;
const at = "2026-09-01T00:00:00.000Z";
function authority(): SleepFoundationAuthority {
  return {
    status: "complete",
    planDecisions: [],
    realizedFacts: [],
    composition: { authority: { version: 1, relationships: [], decisions: [] }, sources: [] },
  };
}
function template() {
  return {
    id: "legacy",
    userId: "u",
    title: "Sleep",
    category: "sleep" as const,
    placementType: "flexible" as const,
    durationMinutes: 60,
    priority: 1 as const,
    preferredWindow: "custom" as const,
    customWindowStartTime: "00:00" as const,
    customWindowEndTime: "08:00" as const,
    rescheduleBehavior: "autoSameDay" as const,
    requiresResource: false,
    externalResources: [],
    enabled: true,
    createdAt: at,
    updatedAt: at,
  };
}
function setup(boundary: TimeString = "00:00", commitment = false) {
  const state = createInitialDayFrameState({
    schedulingPreferences: { dayBoundaryStartTime: boundary, weekStartsOn: "monday" },
    ...(commitment
      ? {
          blockTemplates: [template()],
          blockRecurrences: [{ id: "r", blockTemplateId: "legacy", frequency: "daily" }],
        }
      : {}),
  });
  state.sleepRequirements = [
    {
      ...requirement(),
      durationMinutes: 120,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      window: { kind: "clock", startClock: "00:00", endClock: "08:00" },
    },
  ];
  return state;
}
function run(
  state = setup(),
  auth = authority(),
  budget?: number,
  ownerRange: {
    startUserDayDate: typeof range.startUserDayDate;
    endUserDayDateExclusive: `${number}-${number}-${number}`;
  } = range,
) {
  const planning = deriveFoundationalSchedule({
    authoredState: state,
    authority: auth,
    ownerRange,
    ...(budget === undefined ? {} : { budget }),
  });
  const capacity = deriveCapacity({
    ...ownerRange,
    resolver: {
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
    },
    schedule: {
      ...planning.schedule,
      ...(planning.schedule.compositionResults
        ? { composites: planning.schedule.compositionResults }
        : {}),
      foundation: planning.foundation,
      hardOccupancy: planning.hardOccupancy,
      planningWindow: planning.planningWindow,
    },
  });
  return { ...planning, capacity };
}
function demand(
  capacity: ReturnType<typeof run>["capacity"],
  minutes: number,
  id = "a",
): DemandProjectionV1 {
  return {
    version: 1,
    semanticId: id,
    demandId: id as never,
    demandRevision: 1 as never,
    goalId: id as never,
    goalRevision: 1 as never,
    policy: { id: "goal-demand-projection", version: 1 },
    coverage: {
      version: 1,
      kind: "canonicalUserDayInterval",
      ...range,
      startsAt: capacity.query.requestedStartsAt,
      endsAt: capacity.query.requestedEndsAt,
      startDayBoundaryTime: "00:00",
      endDayBoundaryTime: "00:00",
    },
    requestedEffort: { unit: "minutes", amount: minutes },
    session: { mode: "indivisible", exactMinutes: minutes },
    satisfaction: { kind: "minimum", allowPartial: false },
    cadence: { kind: "total" },
    structuralEligibility: "eligible",
    applicability: "applicable",
    reasons: [],
    dependencies: [],
    dependencyFingerprint: {
      version: 1,
      algorithm: "fnv1a64-canonical-v1",
      ordering: "set",
      value: id,
    },
    provenance: {
      version: 1,
      role: "derivedArtifact",
      origin: { kind: "derivedFromDependencies" },
    },
  };
}
function goalPipeline(capacity: ReturnType<typeof run>["capacity"], minutes = 120) {
  const demands = ["a", "b"].map((id) => {
    const d = demand(capacity, minutes, id);
    return {
      demand: d,
      feasibility: evaluateGoalFeasibility({ demand: d, capacity }),
      priorities: [],
    };
  });
  const competition = deriveCompetingDemandSets({ capacity, demands, evaluationCutoff: at });
  const allocations = allocateAllCompetitionSets({ sets: competition.sets, capacity, demands });
  const proposals = allocations.allocations.map((a) =>
    deriveOrdinaryProposal({
      allocation: a,
      horizon: range,
      allocationHorizon: range,
      generatedAt: at,
    }),
  );
  return { demands, competition, allocations, proposals };
}
function assertNoOverlap(result: ReturnType<typeof run>) {
  for (const p of result.foundation.protection) {
    for (const c of result.capacity.intervals)
      expect(
        Date.parse(c.startsAt) < Date.parse(p.endsAt) &&
          Date.parse(p.startsAt) < Date.parse(c.endsAt),
      ).toBe(false);
    for (const b of result.schedule.scheduledBlocks.filter((b) => b.placementType === "flexible"))
      expect(
        b.startsAt.getTime() - (b.bufferBeforeMinutes ?? 0) * 60000 < Date.parse(p.endsAt) &&
          Date.parse(p.startsAt) < b.endsAt.getTime() + (b.bufferAfterMinutes ?? 0) * 60000,
      ).toBe(false);
  }
}
describe("Sleep-qualified planning", () => {
  it.each([
    "notConfigured",
    "notApplicable",
    "satisfied",
    "infeasible",
    "searchIncomplete",
    "contextIncomplete",
    "invalid",
    "protected",
  ] as const)(
    "qualifies %s across Capacity, feasibility, competition, allocation and Proposal",
    (status) => {
      const s = setup(),
        a = authority();
      let budget: number | undefined;
      if (status === "notConfigured") s.sleepRequirements = [];
      if (status === "notApplicable") s.sleepRequirements![0]!.enabled = false;
      if (status === "infeasible") s.sleepRequirements![0]!.durationMinutes = 600;
      if (status === "searchIncomplete") budget = 0;
      if (status === "contextIncomplete") a.status = "incomplete";
      if (status === "invalid") s.sleepRequirements![0]!.durationMinutes = 0;
      if (status === "protected") a.status = "protected";
      const r = run(s, a, budget);
      expect(r.foundation.sleep.status).toBe(status);
      const safe = ["notConfigured", "notApplicable", "satisfied"].includes(status);
      expect(r.capacity.qualification.allocability).toBe(safe ? "allocatable" : "nonAllocatable");
      const pipeline = goalPipeline(r.capacity);
      if (!safe) {
        expect(r.capacity.qualification.coverage).toBe("unavailable");
        expect(r.capacity.intervals).toEqual([]);
        expect(pipeline.demands.every((d) => d.feasibility.classification === "unknown")).toBe(
          true,
        );
        expect(pipeline.allocations).toMatchObject({
          qualification: "nonAllocatable",
          allocations: [],
        });
        const blocked = allocateCompetingDemandSet({
          set: { id: "x", demandProjectionIds: [], freshness: "current" } as never,
          capacity: r.capacity,
          demands: [],
        });
        expect(blocked.alternatives).toEqual([]);
        expect(
          deriveOrdinaryProposal({
            allocation: { ...allocation(), qualification: blocked.qualification! },
            horizon: range,
            allocationHorizon: range,
            generatedAt: at,
          }),
        ).toMatchObject({
          status: "noProposal",
          result: { reasons: [{ code: "incompleteInput" }] },
        });
      } else
        expect(r.capacity.summary.totalEligibleMinutes).toBe(status === "satisfied" ? 1320 : 1440);
    },
  );
  it("subtracts two hours from eight, buffers and unioned overlap rather than the valid domain", () => {
    const s = setup();
    const p = run(s);
    const schedule = {
      ...p.schedule,
      foundation: p.foundation,
      planningWindow: p.planningWindow,
      generatedWorkBlocks: [
        {
          id: "hard",
          startsAt: new Date("2026-09-17T08:00:00"),
          endsAt: new Date("2026-09-18T00:00:00"),
          userDayDate: range.startUserDayDate,
        },
      ],
    };
    const cap = deriveCapacity({
      ...range,
      resolver: { shiftCycles: [], defaultSchedulingPreferences: s.schedulingPreferences },
      schedule,
    });
    expect(cap.summary.fullyAllocatableMinutes).toBe(360);
    schedule.generatedWorkBlocks.push({
      id: "overlap",
      startsAt: new Date("2026-09-17T00:00:00"),
      endsAt: new Date("2026-09-17T01:00:00"),
      userDayDate: range.startUserDayDate,
    });
    expect(
      deriveCapacity({
        ...range,
        resolver: { shiftCycles: [], defaultSchedulingPreferences: s.schedulingPreferences },
        schedule,
      }).summary.fullyAllocatableMinutes,
    ).toBe(360);
    s.sleepRequirements![0]!.bufferBeforeMinutes = 30;
    s.sleepRequirements![0]!.bufferAfterMinutes = 30;
    const buffered = run(s);
    expect(buffered.capacity.summary.fullyAllocatableMinutes).toBe(1260);
    expect(buffered.foundation.protection.map((p) => p.part)).toContain("beforeBuffer");
    expect(buffered.foundation.protection.map((p) => p.part)).toContain("afterBuffer");
  });
  it("moves ordinary and legacy Sleep around the unchanged witness, or leaves them unplaced", () => {
    const s = setup("00:00", true),
      r = run(s);
    expect(
      r.schedule.scheduledBlocks
        .find((b) => b.userDayDate === range.startUserDayDate)!
        .startsAt.getHours(),
    ).toBe(2);
    assertNoOverlap(r);
    s.blockTemplates[0]!.durationMinutes = 420;
    const unplaced = run(s);
    expect(
      unplaced.schedule.unplacedCandidates.some((c) => c.userDayDate === range.startUserDayDate),
    ).toBe(true);
    expect(unplaced.foundation.protection).toEqual(r.foundation.protection);
  });
  it("fixed legacy authority stays fixed and can make Sleep infeasible", () => {
    const s = setup("00:00", true);
    s.blockTemplates[0]!.placementType = "fixed";
    s.blockTemplates[0]!.fixedStartTime = "00:00";
    s.blockTemplates[0]!.durationMinutes = 480;
    delete s.blockTemplates[0]!.customWindowStartTime;
    delete s.blockTemplates[0]!.customWindowEndTime;
    const saved = structuredClone(s);
    expect(run(s).foundation.sleep.status).toBe("infeasible");
    expect(s).toEqual(saved);
  });
  it.each(["00:00", "03:00", "12:00"] as const)(
    "physical exclusion, placement and Goals cross owner boundary %s",
    (boundary) => {
      const s = setup(boundary, true);
      const hour = Number(boundary.slice(0, 2));
      const clock = (n: number) => `${String((n + 24) % 24).padStart(2, "0")}:00` as TimeString;
      s.sleepRequirements![0]!.window = {
        kind: "clock",
        startClock: clock(hour - 1),
        endClock: clock(hour + 3),
      };
      s.blockTemplates[0]!.preferredWindow = "anyAvailable";
      delete s.blockTemplates[0]!.customWindowStartTime;
      delete s.blockTemplates[0]!.customWindowEndTime;
      const r = run(s);
      expect(r.foundation.sleep.status).toBe("satisfied");
      assertNoOverlap(r);
      expect(
        r.foundation.protection.some(
          (p) =>
            p.reference.coordinate.userDayDate < range.startUserDayDate &&
            Date.parse(p.endsAt) > r.planningWindow.startsAt.getTime(),
        ),
      ).toBe(true);
      for (const p of goalPipeline(r.capacity, 60).proposals)
        if (p.status === "proposed")
          for (const claim of p.proposal.scope.capacityClaims)
            expect(
              r.foundation.protection.some(
                (o) => claim.startsAt < o.endsAt && o.startsAt < claim.endsAt,
              ),
            ).toBe(false);
    },
  );
  it("known insufficient and known zero differ from blocked foundation; Goal Demand cannot change Sleep", () => {
    const s = setup();
    const before = run(s);
    s.sleepRequirements = [];
    const absent = run(s);
    expect(
      evaluateGoalFeasibility({ demand: demand(absent.capacity, 1400), capacity: absent.capacity })
        .classification,
    ).toBe("feasible");
    expect(
      evaluateGoalFeasibility({ demand: demand(before.capacity, 1400), capacity: before.capacity })
        .classification,
    ).toBe("infeasible");
    expect(
      evaluateGoalFeasibility({ demand: demand(before.capacity, 60), capacity: before.capacity })
        .classification,
    ).toBe("feasible");
    const sleep = structuredClone(before.foundation);
    goalPipeline(before.capacity, 60);
    goalPipeline(before.capacity, 1000);
    expect(before.foundation).toEqual(sleep);
    s.sleepRequirements = [
      {
        ...requirement(),
        durationMinutes: 1440,
        window: { kind: "clock", startClock: "00:00", endClock: "00:00" },
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
      },
    ];
    const zero = run(s);
    expect(zero.capacity.qualification.allocability).toBe("allocatable");
    expect(zero.capacity.summary.totalEligibleMinutes).toBe(0);
    expect(
      evaluateGoalFeasibility({ demand: demand(zero.capacity, 60), capacity: zero.capacity })
        .classification,
    ).toBe("infeasible");
  });
  it("competition and proposals consume only post-Sleep openings", () => {
    const s = setup();
    s.sleepRequirements = [];
    s.manualEvents = createInitialDayFrameState({
      manualEvents: [
        {
          id: "midday",
          title: "Lunch",
          userDayDate: range.startUserDayDate,
          allDay: false,
          startTime: "12:00",
          endTime: "13:00",
          createdAt: at,
          updatedAt: at,
        },
      ],
    }).manualEvents;
    const before = goalPipeline(run(s).capacity, 600);
    s.sleepRequirements = setup().sleepRequirements!;
    s.sleepRequirements![0]!.durationMinutes = 240;
    const r = run(s),
      after = goalPipeline(r.capacity, 600);
    expect(
      Math.max(
        ...before.allocations.allocations.flatMap((a) =>
          a.alternatives.map((a) => a.productiveMinutes),
        ),
      ),
    ).toBe(1200);
    expect(
      Math.max(
        ...after.allocations.allocations.flatMap((a) =>
          a.alternatives.map((a) => a.productiveMinutes),
        ),
      ),
    ).toBe(600);
    for (const a of after.allocations.allocations)
      for (const alternative of a.alternatives)
        for (const claim of alternative.resourceClaims)
          expect(
            r.foundation.protection.some(
              (o) => claim.startsAt < o.endsAt && o.startsAt < claim.endsAt,
            ),
          ).toBe(false);
    expect(after.proposals.some((p) => p.status === "proposed")).toBe(true);
  });
  it.each(["duration", "window", "boundary", "manual"])(
    "recomputes after %s changes and leaves authority untouched",
    (change) => {
      const s = setup();
      const before = run(s);
      if (change === "duration") s.sleepRequirements![0]!.durationMinutes = 180;
      if (change === "window")
        s.sleepRequirements![0]!.window = { kind: "clock", startClock: "01:00", endClock: "08:00" };
      if (change === "boundary") s.schedulingPreferences.dayBoundaryStartTime = "03:00";
      if (change === "manual")
        s.manualEvents = createInitialDayFrameState({
          manualEvents: [
            {
              id: "e",
              title: "Event",
              userDayDate: range.startUserDayDate,
              allDay: false,
              startTime: "00:00",
              endTime: "01:00",
              createdAt: at,
              updatedAt: at,
            },
          ],
        }).manualEvents;
      const snapshot = structuredClone(s),
        after = run(s);
      expect(after.capacity.fingerprint).not.toBe(before.capacity.fingerprint);
      expect(s).toEqual(snapshot);
      expect(run(s)).toEqual(after);
    },
  );
  it.each([7, 31, 90])("bounds and deterministically solves a %i day planning range", (days) => {
    const s = setup(),
      ownerRange = {
        startUserDayDate: range.startUserDayDate,
        endUserDayDateExclusive: addUserDayLabels(range.startUserDayDate, days),
      };
    const r = run(s, authority(), undefined, ownerRange);
    expect(r.foundation.sleep.status).toBe("satisfied");
    expect(run(s, authority(), undefined, ownerRange)).toEqual(r);
  });
});

function shiftSetup(
  sequence: Array<"Day" | "Evening" | "Night" | null>,
  kind: "beforeWork" | "afterWork" | "clock" = "beforeWork",
) {
  const base = setup("03:00", true);
  const shifts = (
    [
      ["Day", "09:00", "17:00"],
      ["Evening", "14:00", "22:00"],
      ["Night", "23:00", "07:00"],
    ] as const
  ).map(([id, startTime, endTime]) => ({
    id,
    userId: "u",
    name: id,
    startTime,
    endTime,
    crossesMidnight: endTime <= startTime,
    workDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ] as const,
    createdAt: at,
    updatedAt: at,
  }));
  const state = createInitialDayFrameState({
    ...base,
    sleepRequirements: [],
    shiftDefinitions: shifts.map((s) => ({ ...s, workDays: [...s.workDays] })),
    shiftCycles: [
      {
        id: "cycle",
        userId: "u",
        name: "Cycle",
        type: "fixedSegments",
        mode: "repeatingSequence",
        startsOnDate: "2026-09-01",
        endsOnDate: "2026-12-31",
        segments: [],
        sequenceAnchorDate: "2026-09-17",
        sequence: sequence.map((shiftDefinitionId, dayOffset) => ({
          id: `step-${dayOffset}`,
          dayOffset,
          shiftDefinitionId,
        })),
        createdAt: at,
        updatedAt: at,
      },
    ],
  });
  state.blockTemplates[0]!.preferredWindow = "anyAvailable";
  delete state.blockTemplates[0]!.customWindowStartTime;
  delete state.blockTemplates[0]!.customWindowEndTime;
  state.sleepRequirements = [
    {
      ...requirement(),
      durationMinutes: 60,
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 15,
      window:
        kind === "clock"
          ? { kind, startClock: "00:00", endClock: "02:00" }
          : { kind, spanMinutes: 180, offDay: { startClock: "10:00", endClock: "13:00" } },
    },
  ];
  return state;
}
it.each([
  ["Day", "beforeWork"],
  ["Evening", "clock"],
  ["Night", "afterWork"],
] as const)("%s / %s planning consumes solved Sleep first", (shift, kind) => {
  const s = shiftSetup([shift], kind),
    r = run(s);
  expect(r.foundation.sleep.status).toBe("satisfied");
  assertNoOverlap(r);
  expect(
    goalPipeline(r.capacity, 30).demands.every((d) => d.feasibility.classification === "feasible"),
  ).toBe(true);
});
it.each([
  ["Day", "Evening"],
  ["Evening", "Night"],
  ["Night", "Day"],
  ["Day", null],
  [null, "Day"],
] as const)("transition %s → %s uses actual repeating cycle geometry", (a, b) => {
  const s = shiftSetup([a, b]),
    ownerRange = { ...range, endUserDayDateExclusive: "2026-09-19" as const };
  const r = run(s, authority(), undefined, ownerRange);
  expect(r.foundation.sleep.status).toBe("satisfied");
  assertNoOverlap(r);
  for (const label of ["2026-09-17", "2026-09-18"] as const) {
    const c = deriveCapacity({
      startUserDayDate: label,
      endUserDayDateExclusive: addUserDayLabels(label, 1),
      resolver: {
        shiftCycles: s.shiftCycles,
        defaultSchedulingPreferences: s.schedulingPreferences,
      },
      schedule: {
        ...r.schedule,
        foundation: r.foundation,
        hardOccupancy: r.hardOccupancy,
        planningWindow: r.planningWindow,
      },
    });
    const d = demand(c, 30);
    d.coverage.startUserDayDate = label;
    d.coverage.endUserDayDateExclusive = addUserDayLabels(label, 1);
    expect(evaluateGoalFeasibility({ demand: d, capacity: c }).classification).toBe("feasible");
  }
  const permuted = structuredClone(s);
  permuted.shiftDefinitions.reverse();
  permuted.shiftCycles[0]!.sequence!.reverse();
  permuted.blockRecurrences.reverse();
  const reordered = run(permuted, authority(), undefined, ownerRange);
  expect({ ...reordered, resolver: undefined }).toEqual({ ...r, resolver: undefined });
  expect(goalPipeline(reordered.capacity)).toEqual(goalPipeline(r.capacity));
});
it("Work edits change current Sleep geometry without changing occurrence identity", () => {
  const s = shiftSetup(["Day"]),
    first = run(s);
  s.shiftDefinitions.find((s) => s.id === "Day")!.startTime = "10:00";
  const second = run(s);
  expect(first.foundation.sleep.status).toBe("satisfied");
  expect(second.foundation.sleep.status).toBe("satisfied");
  expect(second.foundation.protection.map((p) => p.reference)).toEqual(
    first.foundation.protection.map((p) => p.reference),
  );
  expect(second.foundation.protection.map((p) => p.startsAt)).not.toEqual(
    first.foundation.protection.map((p) => p.startsAt),
  );
  expect(second.capacity.fingerprint).not.toBe(first.capacity.fingerprint);
  assertNoOverlap(second);
});
it("movable attached support and its buffer cannot claim solved Sleep", () => {
  const templates = createInitialDayFrameState({
    blockTemplates: [template(), { ...template(), id: "child", title: "Support" }],
    blockRecurrences: [{ id: "r", blockTemplateId: "legacy", frequency: "daily" }],
  });
  const s = setup();
  s.blockTemplates = templates.blockTemplates;
  s.blockRecurrences = templates.blockRecurrences;
  const sources = s.blockTemplates.map((t) => ({
    kind: "template" as const,
    sourceId: t.id,
    incarnationId: t.incarnationId,
    title: t.title,
    durationMinutes: t.durationMinutes,
    revisionToken: t.updatedAt,
    userId: t.userId,
    category: t.category,
    priority: t.priority,
  }));
  const a = authority();
  a.composition = {
    sources,
    authority: {
      version: 1,
      decisions: [],
      relationships: [
        {
          recordType: "attachmentRelationship",
          version: 1,
          id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as never,
          revision: 1 as never,
          status: "active",
          parent: sources[0]!,
          child: sources[1]!,
          slot: "support",
          order: 0,
          applicability: {},
          requiredness: "required",
          timing: { kind: "endsAtParentStart" },
          timingStrictness: "constraint",
          buffer: { beforeMinutes: 30, afterMinutes: 0 },
          goalSupport: "none",
          createdAt: at,
          updatedAt: at,
          effectiveFrom: at,
          provenance: {
            version: 1,
            role: "authoredAuthority",
            origin: { kind: "directAuthoring" },
          },
        },
      ],
    },
  };
  const r = run(s, a);
  expect(r.foundation.sleep.status).toBe("satisfied");
  expect(r.schedule.compositionResults!.some((c) => c.state === "requiredComponentFailure")).toBe(
    true,
  );
  expect(r.schedule.scheduledBlocks.some((b) => b.templateId === "child")).toBe(false);
  expect(r.capacity.liabilities.some((l) => l.kind === "compositeCommitment")).toBe(true);
  expect(r.foundation.protection).toEqual(run(s).foundation.protection);
  assertNoOverlap(r);
});
