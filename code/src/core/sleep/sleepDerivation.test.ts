import { generateCycleWorkBlocks } from "../cycles/generateCycleWorkBlocks.js";
import { describe, it, expect } from "vitest";
import { createInitialDayFrameState } from "../../state/createInitialDayFrameState.js";
import { requirement } from "./sleepTestFixtures.js";
import { resolveRequiredSleep } from "./resolveRequiredSleep.js";
import { deriveSleepOccurrence } from "./deriveSleepOccurrences.js";
import { solveRequiredSleep } from "./solveRequiredSleep.js";
import type { SleepOccurrenceV1, SleepResolutionV1 } from "./sleepResolution.js";
import type { SleepFoundationAuthority } from "./sleepFoundationalOccupancy.js";
import {
  constrainsFoundationalFeasibility,
  type FoundationalOccupancyV1,
} from "../time/physicalOccupancy.js";
import type { TimeString } from "../time/types.js";
import type { LocalDateString } from "../shifts/types.js";
import { addUserDayLabels } from "../time/canonicalUserDay.js";
import { createDurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import { generateBlockCandidates } from "../blocks/generateBlockCandidates.js";

const emptyAuthority = (): SleepFoundationAuthority => ({
  status: "complete",
  planDecisions: [],
  realizedFacts: [],
  composition: { authority: { version: 1, relationships: [], decisions: [] }, sources: [] },
});
function setup() {
  const state = createInitialDayFrameState();
  state.sleepRequirements = [
    {
      ...requirement(),
      window: { kind: "clock", startClock: "22:00", endClock: "08:00" },
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
    },
  ];
  return state;
}
const ownerRange = {
  startUserDayDate: "2026-09-17",
  endUserDayDateExclusive: "2026-09-18",
} as const;
function run(state = setup(), authority = emptyAuthority(), budget?: number) {
  return resolveRequiredSleep({
    authoredState: state,
    ownerRange,
    authority,
    ...(budget === undefined ? {} : { budget }),
  });
}
function solved(result: SleepResolutionV1) {
  if (result.status !== "satisfied") throw new Error(JSON.stringify(result));
  return result.occurrences.find((o) => o.membership === "requested")!;
}
function workState(start: TimeString, end: TimeString, boundary: TimeString = "03:00") {
  const state = createInitialDayFrameState({
    schedulingPreferences: { dayBoundaryStartTime: boundary, weekStartsOn: "monday" },
    shiftDefinitions: [
      {
        id: "shift",
        userId: "u",
        name: "Arbitrary",
        startTime: start,
        endTime: end,
        workDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        crossesMidnight: end <= start,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ],
    shiftCycles: [
      {
        id: "cycle",
        userId: "u",
        name: "Cycle",
        type: "fixedSegments",
        startsOnDate: "2026-09-01",
        endsOnDate: "2026-12-31",
        segments: [
          {
            id: "segment",
            shiftCycleId: "cycle",
            shiftDefinitionId: "shift",
            startsOnDate: "2026-09-01",
            endsOnDate: "2026-12-31",
          },
        ],
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ],
  });
  state.sleepRequirements = [
    {
      ...requirement(),
      durationMinutes: 420,
      bufferBeforeMinutes: 30,
      bufferAfterMinutes: 30,
      window: {
        kind: "beforeWork",
        spanMinutes: 540,
        offDay: { startClock: "22:00", endClock: "08:00" },
      },
    },
  ];
  return state;
}
describe("Sleep physical derivation", () => {
  it("distinguishes missing, disabled, nonapplicable, malformed and protected context", () => {
    expect(run(createInitialDayFrameState()).status).toBe("notConfigured");
    const state = setup();
    state.sleepRequirements![0]!.enabled = false;
    expect(run(state).status).toBe("notApplicable");
    state.sleepRequirements![0]!.enabled = true;
    state.sleepRequirements![0]!.weekdays = ["sunday"];
    expect(run(state).status).toBe("notApplicable");
    state.sleepRequirements![0]!.durationMinutes = 0;
    expect(run(state).status).toBe("invalid");
    expect(run(setup(), { ...emptyAuthority(), status: "protected" }).status).toBe("protected");
    expect(run(setup(), { ...emptyAuthority(), status: "incomplete" }).status).toBe(
      "contextIncomplete",
    );
  });
  it.each(["00:00", "03:00", "12:00"] as const)("never clips Sleep at boundary %s", (boundary) => {
    const state = setup();
    state.schedulingPreferences.dayBoundaryStartTime = boundary;
    const o = solved(run(state));
    expect((Date.parse(o.sleepEnd) - Date.parse(o.sleepStart)) / 60000).toBe(480);
    expect(o.ownerDay).toBe(ownerRange.startUserDayDate);
  });
  it.each([
    ["22:00", "06:00"],
    ["23:00", "07:00"],
    ["00:00", "08:00"],
  ] as const)("keeps civil window %s–%s continuous", (a, b) => {
    const state = setup();
    state.sleepRequirements![0]!.window = { kind: "clock", startClock: a, endClock: b };
    const o = solved(run(state));
    expect(new Date(o.sleepStart).getHours()).toBe(Number(a.slice(0, 2)));
    expect((Date.parse(o.sleepEnd) - Date.parse(o.sleepStart)) / 60000).toBe(480);
  });
  it("expands equal endpoints to a civil day; preference is soft and clamped only for ranking", () => {
    const state = setup();
    state.sleepRequirements![0]!.window = {
      kind: "clock",
      startClock: "22:00",
      endClock: "22:00",
      preferredStartClock: "21:00",
    };
    const o = solved(run(state));
    expect(
      (Date.parse(o.derivationContext.physicalWindow.endsAt) -
        Date.parse(o.derivationContext.physicalWindow.startsAt)) /
        60000,
    ).toBe(1440);
    expect(o.sleepEnd).toBe(o.derivationContext.physicalWindow.endsAt);
  });
  it.each([
    ["09:00", "17:00"],
    ["15:00", "23:00"],
    ["23:00", "07:00"],
  ] as const)("anchors before/after actual %s–%s Work", (a, b) => {
    for (const kind of ["beforeWork", "afterWork"] as const) {
      const state = workState(a, b);
      state.sleepRequirements![0]!.window = {
        kind,
        spanMinutes: 540,
        offDay: { startClock: "22:00", endClock: "08:00" },
      };
      const o = solved(run(state));
      const anchor = o.derivationContext.anchor!;
      expect(kind === "beforeWork" ? o.footprintEnd : o.footprintStart).toBe(
        kind === "beforeWork" ? anchor.interval.startsAt : anchor.interval.endsAt,
      );
      expect(Date.parse(o.sleepStart) - Date.parse(o.footprintStart)).toBe(30 * 60000);
      expect(Date.parse(o.footprintEnd) - Date.parse(o.sleepEnd)).toBe(30 * 60000);
    }
  });
  it("finds next-civil-date same-owner Work outside a narrow owner label range", () => {
    const state = workState("02:00", "10:00", "12:00");
    const o = solved(run(state));
    expect(o.derivationContext.anchor!.interval.startsAt).toBe(
      new Date("2026-09-18T02:00:00").toISOString(),
    );
    expect(o.ownerDay).toBe("2026-09-17");
  });
  it("falls back on off days without inventing an anchor or skipping Sleep", () => {
    const state = workState("09:00", "17:00");
    state.shiftDefinitions[0]!.workDays = ["sunday"];
    const o = solved(run(state));
    expect(o.derivationContext.windowProvenance).toBe("offDay");
    expect(o.derivationContext.anchor).toBeUndefined();
  });
  it("keeps lifetime/owner identity across revision, boundary and geometry changes", () => {
    const state = setup(),
      a = solved(run(state));
    state.sleepRequirements![0]!.revision = 2;
    state.sleepRequirements![0]!.durationMinutes = 420;
    state.schedulingPreferences.dayBoundaryStartTime = "12:00";
    const b = solved(run(state));
    expect(a.reference).toEqual(b.reference);
    expect(a.sleepEnd).not.toEqual(b.sleepEnd);
    expect(a.requirementRevision).not.toBe(b.requirementRevision);
  });
  it("includes first-edge guards and never truncates last-edge geometry", () => {
    const result = run();
    expect(result.status).toBe("satisfied");
    if (result.status !== "satisfied") return;
    expect(
      result.occurrences.some((o) => o.membership === "guard" && o.ownerDay === "2026-09-16"),
    ).toBe(true);
    expect(solved(result).sleepEnd > new Date("2026-09-18T00:00:00").toISOString()).toBe(true);
  });
  it("is input-order independent and pure", () => {
    const state = workState("09:00", "17:00"),
      before = structuredClone(state),
      a = run(state);
    expect(
      run({
        ...state,
        shiftDefinitions: [...state.shiftDefinitions].reverse(),
        shiftCycles: [...state.shiftCycles].reverse(),
      }),
    ).toEqual(a);
    expect(state).toEqual(before);
    expect(run(state)).toEqual(a);
  });
  it.each([
    ["09:00", "17:00", "15:00", "23:00"],
    ["15:00", "23:00", "23:00", "07:00"],
    ["23:00", "07:00", "09:00", "17:00"],
  ] as const)("solves or proves manual transition %s/%s → %s/%s against all Work", (a, b, c, d) => {
    const state = workState(a, b);
    const next = {
      ...state.shiftDefinitions[0]!,
      id: "next",
      incarnationId: "33333333-3333-4333-8333-333333333333" as never,
      startTime: c,
      endTime: d,
      crossesMidnight: d <= c,
    };
    state.shiftDefinitions.push(next);
    state.shiftCycles[0]!.segments[0]!.endsOnDate = "2026-09-17";
    state.shiftCycles[0]!.segments.push({
      ...state.shiftCycles[0]!.segments[0]!,
      id: "next-segment",
      incarnationId: "44444444-4444-4444-8444-444444444444" as never,
      shiftDefinitionId: "next",
      startsOnDate: "2026-09-18",
      endsOnDate: "2026-12-31",
      schedulePreferences: { dayBoundaryStartTime: "12:00", weekStartsOn: "friday" },
    });
    const result = resolveRequiredSleep({
      authoredState: state,
      authority: emptyAuthority(),
      ownerRange: { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-20" },
    });
    expect(["satisfied", "infeasible"]).toContain(result.status);
    if ("requiredOccurrences" in result) {
      expect(
        result.requiredOccurrences.find((o) => o.ownerDay === "2026-09-18")!.derivationContext
          .dayBoundaryStartTime,
      ).toBe("12:00");
      expect(
        result.requiredOccurrences.find((o) => o.ownerDay === "2026-09-18")!.derivationContext
          .weekStartsOn,
      ).toBe("friday");
    }
  });
});

function job(
  owner: LocalDateString,
  start: number,
  end: number,
  duration: number,
  preferred = start,
): SleepOccurrenceV1 {
  const o = deriveSleepOccurrence(setup(), owner, [], "requested")!;
  const at = (n: number) => new Date(Date.UTC(2026, 8, 17, 0, n)).toISOString();
  return {
    ...o,
    durationMinutes: duration,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    derivationContext: {
      ...o.derivationContext,
      physicalWindow: { startsAt: at(start), endsAt: at(end) },
      preferredSleepStart: at(preferred),
    },
  };
}
function solve(
  jobs: SleepOccurrenceV1[],
  budget = 100000,
  occupancy: FoundationalOccupancyV1[] = [],
) {
  return solveRequiredSleep({
    ownerRange,
    occurrences: jobs,
    occupancy,
    physicalContext: {
      startsAt: new Date("2026-09-17T00:00:00Z").toISOString(),
      endsAt: new Date("2026-09-18T00:00:00Z").toISOString(),
    },
    budget,
    configured: true,
  });
}
describe("complete bounded joint Sleep solver", () => {
  it.each([0, 2])("backtracks out of earliest/preferred trap at %i", (preferred) => {
    const a = job("2026-09-17", 0, 10, 5, preferred),
      b = job("2026-09-18", 0, 5, 5);
    const r = solve([a, b]);
    expect(r.status).toBe("satisfied");
    if (r.status !== "satisfied") return;
    expect(new Date(r.occurrences[0]!.sleepStart).getUTCMinutes()).toBe(5);
    expect(r.search.searchNodes).toBeGreaterThan(2);
  });
  it("proves joint impossibility only after exhaustion", () => {
    const r = solve([job("2026-09-17", 0, 9, 5), job("2026-09-18", 0, 9, 5)]);
    expect(r.status).toBe("infeasible");
    if (r.status === "infeasible") expect(r.conflicts[0]!.category).toBe("jointExhaustion");
  });
  it.each([0, 1, 7, 8])(
    "reports deterministic exhaustion at budget %i with no solved geometry",
    (budget) => {
      const jobs = [job("2026-09-17", 0, 10, 5), job("2026-09-18", 0, 5, 5)];
      const r = solve(jobs, budget);
      expect(r.status).toBe("searchIncomplete");
      expect(r).not.toHaveProperty("occurrences");
      expect(solve([...jobs].reverse(), budget)).toEqual(r);
      if ("search" in r) expect(r.search.budgetConsumed).toBe(budget);
    },
  );
  it("agrees with an independent exhaustive oracle on small overlapping domains", () => {
    for (let endA = 3; endA <= 7; endA++)
      for (let endB = 3; endB <= 7; endB++)
        for (let duration = 1; duration <= 4; duration++) {
          let exists = false;
          for (let a = 0; a + duration <= endA; a++)
            for (let b = 1; b + duration <= endB; b++)
              if (a + duration <= b || b + duration <= a) exists = true;
          const r = solve([
            job("2026-09-17", 0, endA, duration),
            job("2026-09-18", 1, endB, duration),
          ]);
          expect(r.status).toBe(exists ? "satisfied" : "infeasible");
        }
  });
  it("protects both buffers, preserves exact adjacency and ignores low-authority geometry", () => {
    const o = { ...job("2026-09-17", 0, 10, 6), bufferBeforeMinutes: 2, bufferAfterMinutes: 2 };
    const block: FoundationalOccupancyV1 = {
      id: "hard",
      authority: "work",
      timeSemantics: "activity",
      startsAt: "2026-09-17T00:09:00Z",
      endsAt: "2026-09-17T00:20:00Z",
      sourceReference: { id: "work" },
    };
    expect(solve([o], 100, [block]).status).toBe("infeasible");
    expect(solve([o], 100, [{ ...block, startsAt: "2026-09-17T00:10:00Z" }]).status).toBe(
      "satisfied",
    );
    for (const authority of [
      "movableCommitment",
      "goalDemand",
      "proposal",
      "acceptedUnrealized",
      "previewOnly",
    ] as const) {
      expect(constrainsFoundationalFeasibility(authority)).toBe(false);
      expect(solve([o], 100, [{ ...block, authority }]).status).toBe("satisfied");
    }
    for (const authority of [
      "fixedCommitment",
      "acceptedPlacement",
      "manualEvent",
      "realizedGoalWork",
      "supportActivity",
      "protectedBuffer",
    ] as const) {
      expect(constrainsFoundationalFeasibility(authority)).toBe(true);
      expect(solve([o], 100, [{ ...block, authority }]).status).toBe("infeasible");
    }
  });
  it("blocking order and repeated solving do not change semantic results", () => {
    const jobs = [job("2026-09-17", 0, 10, 3), job("2026-09-18", 3, 12, 4)];
    const blocks: FoundationalOccupancyV1[] = [
      {
        id: "a",
        authority: "manualEvent",
        timeSemantics: "activity",
        startsAt: "2026-09-17T00:00:00Z",
        endsAt: "2026-09-17T00:01:00Z",
        sourceReference: {},
      },
      {
        id: "b",
        authority: "protectedBuffer",
        timeSemantics: "protection",
        startsAt: "2026-09-17T00:10:00Z",
        endsAt: "2026-09-17T00:11:00Z",
        sourceReference: {},
      },
    ];
    expect(solve(jobs, 1000, blocks)).toEqual(
      solve([...jobs].reverse(), 1000, [...blocks].reverse()),
    );
  });
});

function template(placementType: "fixed" | "flexible" = "fixed") {
  return {
    id: "default_sleep",
    userId: "u",
    title: "Sleep",
    category: "sleep" as const,
    placementType,
    durationMinutes: 600,
    priority: 1 as const,
    preferredWindow: "custom" as const,
    ...(placementType === "fixed"
      ? { fixedStartTime: "22:00" as const }
      : { customWindowStartTime: "22:00" as const, customWindowEndTime: "08:00" as const }),
    rescheduleBehavior: "autoSameDay" as const,
    requiresResource: false,
    externalResources: [],
    enabled: true,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  };
}
describe("canonical blocking sources and transitions", () => {
  it("ignores movable legacy Sleep but blocks on fixed legacy authority without promotion", () => {
    for (const kind of ["fixed", "flexible"] as const) {
      const state = createInitialDayFrameState({
        blockTemplates: [template(kind)],
        blockRecurrences: [{ id: "rec", blockTemplateId: "default_sleep", frequency: "daily" }],
      });
      expect(run(state).status).toBe("notConfigured");
      state.sleepRequirements = setup().sleepRequirements!;
      expect(run(state).status).toBe(kind === "fixed" ? "infeasible" : "satisfied");
    }
  });
  it("respects timed/manual all-day Events and finds an alternate when preference is blocked", () => {
    const state = createInitialDayFrameState({
      manualEvents: [
        {
          id: "event",
          title: "fixed",
          userDayDate: "2026-09-17",
          allDay: false,
          startTime: "22:00",
          endTime: "23:00",
          createdAt: "2026-09-01T00:00:00Z",
          updatedAt: "2026-09-01T00:00:00Z",
        },
      ],
    });
    state.sleepRequirements = setup().sleepRequirements!;
    expect(new Date(solved(run(state)).sleepStart).getHours()).toBe(23);
    state.manualEvents[0]!.endTime = "08:00";
    expect(run(state).status).toBe("infeasible");
    state.manualEvents[0]!.allDay = true;
    delete state.manualEvents[0]!.startTime;
    delete state.manualEvents[0]!.endTime;
    expect(run(state).status).toBe("infeasible");
  });
  it("reads exact accepted placement even when the target owner is far outside the query", () => {
    const state = createInitialDayFrameState({
      blockTemplates: [template("flexible")],
      blockRecurrences: [{ id: "rec", blockTemplateId: "default_sleep", frequency: "daily" }],
    });
    state.sleepRequirements = setup().sleepRequirements!;
    const candidate = generateBlockCandidates({
      blockTemplates: state.blockTemplates,
      blockRecurrences: state.blockRecurrences,
      planningWindowStart: new Date("2026-09-03T03:00:00"),
      planningWindowEnd: new Date("2026-09-04T03:00:00"),
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
    })[0]!;
    const target = createDurableOccurrenceReference(candidate.occurrenceIdentity!, state);
    if (target.status !== "created") throw new Error("fixture");
    const authority = emptyAuthority();
    authority.planDecisions = [
      {
        version: 1,
        id: "55555555-5555-4555-8555-555555555555" as never,
        kind: "placeOccurrence",
        target: target.reference,
        payload: { userDayDate: "2026-09-17", startTime: "22:00" },
        acceptedAt: "2026-09-01T00:00:00Z",
        provenance: { source: "user" },
      },
    ];
    const r = run(state, authority);
    expect(r.status).toBe("infeasible");
    if (r.status === "infeasible")
      expect(r.conflicts[0]!.blockers.some((b) => b.authority === "acceptedPlacement")).toBe(true);
  });
  it("keeps Work→Off→Work repeating-sequence fallback and transition context", () => {
    const base = workState("09:00", "17:00");
    const state = createInitialDayFrameState({
      shiftDefinitions: base.shiftDefinitions,
      shiftCycles: [
        {
          ...base.shiftCycles[0]!,
          mode: "repeatingSequence",
          segments: [],
          sequenceAnchorDate: "2026-09-17",
          sequence: [
            { id: "on", dayOffset: 0, shiftDefinitionId: "shift" },
            { id: "off", dayOffset: 1, shiftDefinitionId: null },
          ],
        },
      ],
    });
    state.sleepRequirements = [
      { ...requirement(), durationMinutes: 60, bufferBeforeMinutes: 0, bufferAfterMinutes: 0 },
    ];
    const result = resolveRequiredSleep({
      authoredState: state,
      authority: emptyAuthority(),
      ownerRange: { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-20" },
    });
    expect(result.status).toBe("satisfied");
    if (result.status !== "satisfied") return;
    expect(
      result.requiredOccurrences
        .filter((o) => o.membership === "requested")
        .map((o) => o.derivationContext.windowProvenance),
    ).toEqual(["beforeWork", "offDay", "beforeWork"]);
  });
  it.each([7, 31, 90])(
    "resolves %i owner days deterministically within the default budget",
    (days) => {
      const state = workState("09:00", "17:00");
      const query = {
        authoredState: state,
        authority: emptyAuthority(),
        ownerRange: {
          startUserDayDate: "2026-09-17" as const,
          endUserDayDateExclusive: addUserDayLabels("2026-09-17", days),
        },
      };
      const before = performance.now();
      const result = resolveRequiredSleep(query);
      const ms = performance.now() - before;
      expect(result.status).toBe("satisfied");
      expect(resolveRequiredSleep(query)).toEqual(result);
      if ("search" in result)
        console.info(
          JSON.stringify({ sleepBenchmark: { days, ms: Number(ms.toFixed(2)), ...result.search } }),
        );
    },
  );
});
it("attributes guard-only incompatibility to its outside owner, without clipping the guard", () => {
  const s = createInitialDayFrameState({
    manualEvents: [
      {
        id: "prior",
        title: "prior authority",
        userDayDate: "2026-09-16",
        allDay: true,
        createdAt: "2026-09-01T00:00:00Z",
        updatedAt: "2026-09-01T00:00:00Z",
      },
    ],
  });
  const a = {
    ...requirement(),
    effectiveFrom: "2026-09-16" as const,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    durationMinutes: 1440,
    window: { kind: "clock" as const, startClock: "22:00" as const, endClock: "22:00" as const },
  };
  s.sleepRequirements = [
    a,
    {
      ...a,
      revision: 2,
      effectiveFrom: "2026-09-17",
      effectiveUntilExclusive: "2026-09-18",
      durationMinutes: 60,
      window: { kind: "clock", startClock: "22:00", endClock: "23:00" },
    },
  ];
  const r = run(s);
  expect(r.status).toBe("infeasible");
  if (r.status !== "infeasible") return;
  expect(r.conflicts[0]!.affected[0]!.membership).toBe("guard");
  expect(r.conflicts[0]!.affected[0]!.ownerDay).toBe("2026-09-16");
});
it("invalid derived geometry cannot masquerade as infeasibility or double-credit", () => {
  const a = job("2026-09-17", 0, 10, 5);
  expect(solve([a, a]).status).toBe("invalid");
  expect(
    solve([
      {
        ...a,
        derivationContext: {
          ...a.derivationContext,
          physicalWindow: { startsAt: "bad", endsAt: "bad" },
        },
      },
    ]).status,
  ).toBe("invalid");
  expect(solve([a], -1).status).toBe("invalid");
});

it("selects earliest start / latest end among same-owner Work independently of array order", () => {
  const prior = workState("23:00", "07:00");
  const state = createInitialDayFrameState({
    shiftDefinitions: [
      ...prior.shiftDefinitions,
      {
        ...prior.shiftDefinitions[0]!,
        id: "short",
        startTime: "02:00",
        endTime: "04:00",
        crossesMidnight: false,
      },
    ],
    shiftCycles: [
      {
        ...prior.shiftCycles[0]!,
        segments: [
          { ...prior.shiftCycles[0]!.segments[0]!, endsOnDate: "2026-09-17" },
          {
            ...prior.shiftCycles[0]!.segments[0]!,
            id: "short-segment",
            shiftDefinitionId: "short",
            startsOnDate: "2026-09-18",
            endsOnDate: "2026-12-31",
          },
        ],
      },
    ],
  });
  state.sleepRequirements = [
    { ...requirement(), durationMinutes: 60, bufferBeforeMinutes: 0, bufferAfterMinutes: 0 },
  ];
  const work = generateCycleWorkBlocks({
    shiftDefinitions: state.shiftDefinitions,
    shiftCycles: state.shiftCycles,
    defaultSchedulingPreferences: state.schedulingPreferences,
    planningWindowStart: new Date("2026-09-16T00:00:00"),
    planningWindowEnd: new Date("2026-09-20T00:00:00"),
  });
  const before = deriveSleepOccurrence(state, "2026-09-17", work, "requested")!;
  expect(before.derivationContext.work).toHaveLength(2);
  expect(before.derivationContext.anchor!.interval.startsAt).toBe(
    new Date("2026-09-17T23:00:00").toISOString(),
  );
  state.sleepRequirements[0]!.window = {
    kind: "afterWork",
    spanMinutes: 540,
    offDay: { startClock: "22:00", endClock: "08:00" },
  };
  const after = deriveSleepOccurrence(state, "2026-09-17", work, "requested")!;
  expect(after.derivationContext.anchor!.interval.endsAt).toBe(
    new Date("2026-09-18T07:00:00").toISOString(),
  );
  expect(deriveSleepOccurrence(state, "2026-09-17", [...work].reverse(), "requested")).toEqual(
    after,
  );
  expect(after.reference).toEqual(before.reference);
});
