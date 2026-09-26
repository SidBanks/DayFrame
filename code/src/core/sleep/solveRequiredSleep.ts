import { isSleepOccurrenceReference } from "../occurrences/sleepOccurrenceReference.js";
import { capacityFingerprint } from "../planning/capacityFingerprint.js";
import {
  constrainsFoundationalFeasibility,
  getOccupiedWindowsForRange,
  getOpenWindowsWithinSearchWindow,
  type FoundationalOccupancyV1,
} from "../time/physicalOccupancy.js";
import type {
  SleepOccurrenceV1,
  SleepOwnerRange,
  SleepResolutionV1,
  SleepResolutionBaseV1,
  SleepFeasibilityConflictV1,
} from "./sleepResolution.js";
import { MINUTE } from "./deriveSleepOccurrences.js";

export const SLEEP_SEARCH_BUDGET = 1_000_000;
/** Exhaustive finite minute domains + depth-first joint assignments; budget is work, never time. */
export function solveRequiredSleep(input: {
  ownerRange: SleepOwnerRange;
  occurrences: readonly SleepOccurrenceV1[];
  occupancy: readonly FoundationalOccupancyV1[];
  physicalContext: { startsAt: string; endsAt: string };
  budget?: number;
  configured: boolean;
  exactPlacements?: readonly { reference: SleepOccurrenceV1["reference"]; sleepStart: string }[];
}): SleepResolutionV1 {
  const limit = input.budget ?? SLEEP_SEARCH_BUDGET;
  if (!Number.isSafeInteger(limit) || limit < 0 || limit > 10_000_000)
    return {
      version: 1,
      status: "invalid",
      ownerRange: input.ownerRange,
      reason: "Invalid search budget (0..10000000)",
    };
  const validInterval = (a: string, b: string) =>
    Number.isFinite(Date.parse(a)) &&
    Number.isFinite(Date.parse(b)) &&
    Date.parse(a) < Date.parse(b);
  const integer = (n: number, lo: number, hi: number) =>
    Number.isSafeInteger(n) && n >= lo && n <= hi;
  const keys = input.occurrences.map((o) => JSON.stringify(o.reference));
  if (
    new Set(keys).size !== keys.length ||
    new Set(input.exactPlacements?.map((p) => JSON.stringify(p.reference))).size !==
      (input.exactPlacements?.length ?? 0) ||
    input.exactPlacements?.some(
      (p) =>
        !keys.includes(JSON.stringify(p.reference)) ||
        !Number.isFinite(Date.parse(p.sleepStart)) ||
        Date.parse(p.sleepStart) % MINUTE !== 0,
    ) ||
    (!input.configured && input.occurrences.length > 0) ||
    input.occurrences.some(
      (o) =>
        !isSleepOccurrenceReference(o.reference) ||
        o.ownerDay !== o.reference.coordinate.userDayDate ||
        !integer(o.requirementRevision, 1, Number.MAX_SAFE_INTEGER) ||
        !integer(o.durationMinutes, 1, 1440) ||
        !integer(o.bufferBeforeMinutes, 0, 1440) ||
        !integer(o.bufferAfterMinutes, 0, 1440) ||
        !validInterval(
          o.derivationContext.physicalWindow.startsAt,
          o.derivationContext.physicalWindow.endsAt,
        ) ||
        !Number.isFinite(Date.parse(o.derivationContext.preferredSleepStart)),
    ) ||
    input.occupancy.some(
      (o) =>
        !validInterval(o.startsAt, o.endsAt) ||
        ![
          "work",
          "fixedCommitment",
          "acceptedPlacement",
          "manualEvent",
          "realizedGoalWork",
          "supportActivity",
          "protectedBuffer",
          "movableCommitment",
          "goalDemand",
          "proposal",
          "acceptedUnrealized",
          "previewOnly",
        ].includes(o.authority),
    )
  ) {
    return {
      version: 1,
      status: "invalid",
      ownerRange: input.ownerRange,
      reason: "Invalid or duplicate derived domain / blocking geometry",
    };
  }
  const occurrences = structuredClone([...input.occurrences]).sort(
    (a, b) =>
      a.ownerDay.localeCompare(b.ownerDay) ||
      JSON.stringify(a.reference).localeCompare(JSON.stringify(b.reference)),
  );
  const blockers = structuredClone(
    input.occupancy.filter((o) => constrainsFoundationalFeasibility(o.authority)),
  ).sort(
    (a, b) =>
      a.startsAt.localeCompare(b.startsAt) ||
      a.endsAt.localeCompare(b.endsAt) ||
      a.id.localeCompare(b.id),
  );
  const fingerprint = capacityFingerprint({
    policy: "sleep-minute-joint-v1",
    ownerRange: input.ownerRange,
    occurrences,
    blockers,
    ...(input.exactPlacements?.length
      ? {
          exactPlacements: [...input.exactPlacements].sort((a, b) =>
            JSON.stringify(a.reference).localeCompare(JSON.stringify(b.reference)),
          ),
        }
      : {}),
  });
  const base: SleepResolutionBaseV1 = {
    version: 1,
    ownerRange: structuredClone(input.ownerRange),
    requiredOccurrences: occurrences,
    dependencyFingerprint: fingerprint,
    physicalContext: input.physicalContext,
    search: {
      budgetLimit: limit,
      budgetConsumed: 0,
      candidateStartsExamined: 0,
      candidateCount: 0,
      searchNodes: 0,
      requiredOccurrenceCount: occurrences.length,
      phase: "candidates",
    },
  };
  const consume = () => {
    if (base.search.budgetConsumed >= limit) return false;
    base.search.budgetConsumed++;
    return true;
  };
  const incomplete = (): SleepResolutionV1 => ({
    ...base,
    status: "searchIncomplete",
    reason: "deterministicBudgetExhausted",
  });
  const conflict = (
    category: SleepFeasibilityConflictV1["category"],
    affected: SleepOccurrenceV1[],
  ): SleepResolutionV1 => ({
    ...base,
    search: { ...base.search, phase: "complete" },
    status: "infeasible",
    conflicts: [
      {
        category,
        affected: affected.map((o) => ({
          reference: o.reference,
          ownerDay: o.ownerDay,
          requirementRevision: o.requirementRevision,
          membership: o.membership,
          physicalWindow: o.derivationContext.physicalWindow,
          requiredFootprintMinutes:
            o.durationMinutes + o.bufferBeforeMinutes + o.bufferAfterMinutes,
        })),
        blockers,
        proofScope: base.ownerRange,
        dependencyFingerprint: fingerprint,
      },
    ],
  });
  if (!occurrences.length)
    return {
      ...base,
      search: { ...base.search, phase: "complete" },
      status: input.configured ? "notApplicable" : "notConfigured",
    };
  const starts: number[][] = [];
  for (const o of occurrences) {
    const window = o.derivationContext.physicalWindow;
    const start = Date.parse(window.startsAt),
      end = Date.parse(window.endsAt);
    const length = (o.bufferBeforeMinutes + o.durationMinutes + o.bufferAfterMinutes) * MINUTE;
    if (end - start < length) return conflict("emptyPhysicalDomain", [o]);
    // Existing physical owner merges overlapping blockers by complementing sorted occupied windows.
    const occupied = getOccupiedWindowsForRange(
      blockers.map((b) => ({ startsAt: new Date(b.startsAt), endsAt: new Date(b.endsAt) })),
      new Date(start),
      new Date(end),
    );
    const openings = getOpenWindowsWithinSearchWindow(occupied, {
      windowStart: new Date(start),
      windowEnd: new Date(end),
    });
    const values: number[] = [];
    for (const opening of openings) {
      const first =
        Math.ceil((opening.windowStart.getTime() + o.bufferBeforeMinutes * MINUTE) / MINUTE) *
        MINUTE;
      const last =
        opening.windowEnd.getTime() - (o.durationMinutes + o.bufferAfterMinutes) * MINUTE;
      for (let t = first; t <= last; t += MINUTE) {
        if (!consume()) return incomplete();
        base.search.candidateStartsExamined++;
        base.search.candidateCount++;
        values.push(t);
      }
    }
    const pin = input.exactPlacements?.find(
      (p) => JSON.stringify(p.reference) === JSON.stringify(o.reference),
    );
    if (pin) {
      const exact = Date.parse(pin.sleepStart);
      for (let i = values.length - 1; i >= 0; i--) if (values[i] !== exact) values.splice(i, 1);
    }
    const preferred = Date.parse(o.derivationContext.preferredSleepStart);
    values.sort((a, b) => Math.abs(a - preferred) - Math.abs(b - preferred) || a - b);
    if (!values.length) return conflict("blockedPhysicalDomain", [o]);
    starts.push(values);
  }
  base.search.phase = "jointSearch";
  const selected: number[] = [],
    indexes = occurrences.map(() => 0);
  let depth = 0;
  while (depth >= 0 && depth < occurrences.length) {
    selected.length = depth;
    if (indexes[depth]! >= starts[depth]!.length) {
      indexes[depth] = 0;
      selected.length = depth;
      depth--;
      continue;
    }
    if (!consume()) return incomplete();
    base.search.searchNodes++;
    const t = starts[depth]![indexes[depth]!]!;
    indexes[depth] = indexes[depth]! + 1;
    const o = occurrences[depth]!;
    const a = t - o.bufferBeforeMinutes * MINUTE,
      b = t + (o.durationMinutes + o.bufferAfterMinutes) * MINUTE;
    if (
      selected.some((other, i) => {
        const r = occurrences[i]!;
        return (
          a < other + (r.durationMinutes + r.bufferAfterMinutes) * MINUTE &&
          b > other - r.bufferBeforeMinutes * MINUTE
        );
      })
    )
      continue;
    selected[depth] = t;
    depth++;
  }
  if (depth < 0) return conflict("jointExhaustion", occurrences);
  return {
    ...base,
    status: "satisfied",
    search: { ...base.search, phase: "complete" },
    occurrences: occurrences.map((o, i) => ({
      ...o,
      sleepStart: new Date(selected[i]!).toISOString(),
      sleepEnd: new Date(selected[i]! + o.durationMinutes * MINUTE).toISOString(),
      footprintStart: new Date(selected[i]! - o.bufferBeforeMinutes * MINUTE).toISOString(),
      footprintEnd: new Date(
        selected[i]! + (o.durationMinutes + o.bufferAfterMinutes) * MINUTE,
      ).toISOString(),
      provenance: { policy: "sleep-minute-joint-v1", dependencyFingerprint: fingerprint },
    })),
  };
}
