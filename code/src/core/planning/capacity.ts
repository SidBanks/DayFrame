import type { DraftScheduledBlock, BlockCandidate } from "../blocks/types.js";
import type { CompositeOccurrenceV1 } from "./commitmentComposition.js";
import {
  addUserDayLabels,
  resolveUserDayWindowForLabel,
  type CanonicalUserDayResolverInput,
} from "../time/canonicalUserDay.js";
import type { LocalDateString } from "../shifts/types.js";
import { capacityFingerprint as semanticFingerprint } from "./capacityFingerprint.js";
import type { DependencyFingerprintV1, PlanningProvenanceV1 } from "./planningFoundation.js";
import type { ProjectedResourceClaimV1 } from "./demandResourceFootprint.js";
import type { RealizedScheduleFactV1 } from "./realizedScheduleIdentity.js";

export const CAPACITY_POLICY_V1 = { id: "capacity", version: 1 } as const;
export const GENERAL_AVAILABILITY_POLICY_V1 = {
  id: "neutral-geometric-openings",
  version: 1,
} as const;

export type CapacityReasonV1 =
  | { code: "unresolvedOrdinaryCommitment"; liabilityId: string }
  | { code: "unresolvedCompositeLiability"; liabilityId: string }
  | { code: "acceptedAllocationLiability"; liabilityId: string }
  | { code: "incompleteCoverage" }
  | { code: "staleDependency" }
  | { code: "invalidInput" }
  | { code: "protectedAuthority" }
  | { code: "unavailableUserDay" };
export type CapacityQualificationV1 = {
  freshness: "current" | "stale";
  coverage: "complete" | "partial" | "unavailable";
  integrity: "valid" | "protected" | "invalid";
  liability: "resolved" | "unresolved";
  allocability: "allocatable" | "qualified" | "nonAllocatable";
};
export type CapacityExclusionContributorV1 = {
  kind: "occupied" | "buffer";
  id: string;
  sourceFamily: string;
  startsAt: string;
  endsAt: string;
};
export type CapacityLiabilityV1 = {
  id: string;
  kind: "ordinaryCommitment" | "compositeCommitment" | "acceptedAllocation";
  demandedMinutes: number;
  scope: { kind: "userDay"; userDayDate: LocalDateString; startsAt: string; endsAt: string };
  reason: string;
  sourceId: string;
};
export type CapacityIntervalV1 = {
  version: 1;
  id: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  userDayDate: LocalDateString;
  userDayWindow: { startsAt: string; endsAt: string };
  coverage: "complete" | "partial";
  allocability: "allocatable" | "qualified";
  reasons: CapacityReasonV1[];
  adjacentExclusions: {
    before: CapacityExclusionContributorV1[];
    after: CapacityExclusionContributorV1[];
  };
  dependencyFingerprint: DependencyFingerprintV1;
  provenance: PlanningProvenanceV1;
};
export type CapacityUserDayV1 = {
  userDayDate: LocalDateString;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  coverage: "complete" | "partial";
  qualification: CapacityQualificationV1;
};
export type CapacityResultV1 = {
  version: 1;
  queryId: string;
  fingerprint: string;
  policy: typeof CAPACITY_POLICY_V1;
  generalAvailabilityPolicy: typeof GENERAL_AVAILABILITY_POLICY_V1;
  query: {
    startUserDayDate: LocalDateString;
    endUserDayDateExclusive: LocalDateString;
    requestedStartsAt: string;
    requestedEndsAt: string;
    coveredStartsAt: string;
    coveredEndsAt: string;
  };
  qualification: CapacityQualificationV1;
  userDays: CapacityUserDayV1[];
  intervals: CapacityIntervalV1[];
  exclusions: CapacityExclusionContributorV1[];
  liabilities: CapacityLiabilityV1[];
  summary: {
    totalEligibleMinutes: number;
    fullyAllocatableMinutes: number;
    qualifiedMinutes: number;
    longestAllocatableMinutes: number;
    intervalCount: number;
    perUserDay: Array<{
      userDayDate: LocalDateString;
      eligibleMinutes: number;
      allocatableMinutes: number;
    }>;
    liabilityMinutes: number;
  };
  dependencyFingerprint: DependencyFingerprintV1;
  provenance: PlanningProvenanceV1;
};

export type CapacityScheduleSnapshotV1 = {
  scheduledBlocks: readonly DraftScheduledBlock[];
  generatedWorkBlocks: readonly {
    id: string;
    startsAt: Date;
    endsAt: Date;
    userDayDate: LocalDateString;
  }[];
  unplacedCandidates: readonly BlockCandidate[];
  composites?: readonly CompositeOccurrenceV1[];
  realizedScheduleFacts?: readonly RealizedScheduleFactV1[];
  acceptedUnrealizedClaims?: readonly ProjectedResourceClaimV1[];
  isStale?: boolean;
  planningWindow: { startsAt: Date; endsAt: Date };
};

export function deriveCapacity(input: {
  startUserDayDate: LocalDateString;
  endUserDayDateExclusive: LocalDateString;
  resolver: CanonicalUserDayResolverInput;
  schedule: CapacityScheduleSnapshotV1;
}): CapacityResultV1 {
  if (input.startUserDayDate >= input.endUserDayDateExclusive)
    throw new RangeError("Invalid Capacity range.");
  const windows = [];
  for (
    let label = input.startUserDayDate;
    label < input.endUserDayDateExclusive;
    label = addUserDayLabels(label, 1)
  )
    windows.push(resolveUserDayWindowForLabel({ ...input.resolver, userDayDate: label }));
  const requestedStart = windows[0]!.start,
    requestedEnd = windows.at(-1)!.end,
    coveredStart = new Date(
      Math.max(requestedStart.getTime(), input.schedule.planningWindow.startsAt.getTime()),
    ),
    coveredEnd = new Date(
      Math.min(requestedEnd.getTime(), input.schedule.planningWindow.endsAt.getTime()),
    ),
    complete =
      coveredStart.getTime() === requestedStart.getTime() &&
      coveredEnd.getTime() === requestedEnd.getTime();
  const exclusions = exclusionContributors(input.schedule, requestedStart, requestedEnd);
  const liabilities = liabilityValues(input.schedule, windows);
  const dependencySemantic = {
    policy: CAPACITY_POLICY_V1,
    availability: GENERAL_AVAILABILITY_POLICY_V1,
    range: [
      input.startUserDayDate,
      input.endUserDayDateExclusive,
      requestedStart.toISOString(),
      requestedEnd.toISOString(),
    ],
    schedule: {
      occupied: exclusions,
      liabilities,
      stale: input.schedule.isStale === true,
      coverage: [
        input.schedule.planningWindow.startsAt.toISOString(),
        input.schedule.planningWindow.endsAt.toISOString(),
      ],
    },
  };
  const fingerprintValue = semanticFingerprint(dependencySemantic),
    dependencyFingerprint: DependencyFingerprintV1 = {
      version: 1,
      algorithm: "fnv1a64-canonical-v1",
      ordering: "set",
      value: fingerprintValue,
    };
  const intervals: CapacityIntervalV1[] = [],
    days: CapacityUserDayV1[] = [];
  for (const window of windows) {
    const dayStart = new Date(Math.max(window.start.getTime(), coveredStart.getTime())),
      dayEnd = new Date(Math.min(window.end.getTime(), coveredEnd.getTime())),
      dayCoverage = dayStart <= window.start && dayEnd >= window.end ? "complete" : "partial";
    if (dayStart < dayEnd) {
      const merged = unionExclusions(exclusions, dayStart, dayEnd),
        openings = complement(merged, dayStart, dayEnd);
      for (const opening of openings) {
        const affected = liabilities.filter((item) => overlaps(opening, dates(item.scope)));
        const reasons = affected.map(
          (item): CapacityReasonV1 => ({
            code:
              item.kind === "ordinaryCommitment"
                ? "unresolvedOrdinaryCommitment"
                : item.kind === "compositeCommitment"
                  ? "unresolvedCompositeLiability"
                  : "acceptedAllocationLiability",
            liabilityId: item.id,
          }),
        );
        if (dayCoverage === "partial") reasons.push({ code: "incompleteCoverage" });
        if (input.schedule.isStale) reasons.push({ code: "staleDependency" });
        const allocability = reasons.length ? "qualified" : "allocatable";
        const semantic = {
          policy: CAPACITY_POLICY_V1,
          userDayDate: window.userDayDate,
          userDayWindow: [window.start.toISOString(), window.end.toISOString()],
          interval: [opening.startsAt.toISOString(), opening.endsAt.toISOString()],
          dependencyFingerprint,
        };
        intervals.push({
          version: 1,
          id: semanticFingerprint(semantic),
          startsAt: opening.startsAt.toISOString(),
          endsAt: opening.endsAt.toISOString(),
          durationMinutes: minutes(opening),
          userDayDate: window.userDayDate,
          userDayWindow: { startsAt: window.start.toISOString(), endsAt: window.end.toISOString() },
          coverage: dayCoverage,
          allocability,
          reasons,
          adjacentExclusions: adjacent(merged, opening),
          dependencyFingerprint,
          provenance: derived(),
        });
      }
    }
    const unresolved = liabilities.some((item) => item.scope.userDayDate === window.userDayDate);
    days.push({
      userDayDate: window.userDayDate,
      startsAt: window.start.toISOString(),
      endsAt: window.end.toISOString(),
      durationMinutes: window.durationMinutes,
      coverage: dayCoverage,
      qualification: qualification(input.schedule.isStale === true, complete, unresolved),
    });
  }
  const resultQualification = qualification(
      input.schedule.isStale === true,
      complete,
      liabilities.length > 0,
    ),
    summary = summarize(intervals, liabilities);
  const base = {
    version: 1 as const,
    queryId: semanticFingerprint({
      policy: CAPACITY_POLICY_V1,
      start: input.startUserDayDate,
      end: input.endUserDayDateExclusive,
    }),
    policy: CAPACITY_POLICY_V1,
    generalAvailabilityPolicy: GENERAL_AVAILABILITY_POLICY_V1,
    query: {
      startUserDayDate: input.startUserDayDate,
      endUserDayDateExclusive: input.endUserDayDateExclusive,
      requestedStartsAt: requestedStart.toISOString(),
      requestedEndsAt: requestedEnd.toISOString(),
      coveredStartsAt: coveredStart.toISOString(),
      coveredEndsAt: coveredEnd.toISOString(),
    },
    qualification: resultQualification,
    userDays: days,
    intervals,
    exclusions,
    liabilities,
    summary,
    dependencyFingerprint,
    provenance: derived(),
  };
  return { ...base, fingerprint: semanticFingerprint(base) };
}

export function resolveCapacityInterval(result: CapacityResultV1, id: string) {
  const interval = result.intervals.find((value) => value.id === id);
  return interval
    ? { status: "resolved" as const, interval: structuredClone(interval) }
    : { status: "notFound" as const };
}

function exclusionContributors(schedule: CapacityScheduleSnapshotV1, start: Date, end: Date) {
  const result: CapacityExclusionContributorV1[] = [];
  for (const item of schedule.generatedWorkBlocks)
    add("occupied", item.id, "work", item.startsAt, item.endsAt);
  for (const item of schedule.scheduledBlocks) {
    add("occupied", item.id, item.source, item.startsAt, item.endsAt);
    if (item.bufferBeforeMinutes)
      add(
        "buffer",
        `${item.id}:before`,
        "buffer",
        new Date(item.startsAt.getTime() - item.bufferBeforeMinutes * 60_000),
        item.startsAt,
      );
    if (item.bufferAfterMinutes)
      add(
        "buffer",
        `${item.id}:after`,
        "buffer",
        item.endsAt,
        new Date(item.endsAt.getTime() + item.bufferAfterMinutes * 60_000),
      );
  }
  for (const item of schedule.realizedScheduleFacts ?? [])
    add(
      item.scheduleRole === "bufferProtection" ? "buffer" : "occupied",
      item.id,
      `acceptedAllocation:${item.scheduleRole}`,
      new Date(item.startsAt),
      new Date(item.endsAt),
    );
  return result.sort(
    (a, b) =>
      a.startsAt.localeCompare(b.startsAt) ||
      a.endsAt.localeCompare(b.endsAt) ||
      a.id.localeCompare(b.id),
  );
  function add(
    kind: "occupied" | "buffer",
    id: string,
    sourceFamily: string,
    startsAt: Date,
    endsAt: Date,
  ) {
    if (startsAt < end && start < endsAt)
      result.push({
        kind,
        id,
        sourceFamily,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      });
  }
}
function liabilityValues(
  schedule: CapacityScheduleSnapshotV1,
  windows: ReturnType<typeof resolveUserDayWindowForLabel>[],
) {
  const result: CapacityLiabilityV1[] = schedule.unplacedCandidates.flatMap((item) => {
    const window = windows.find((value) => value.userDayDate === item.userDayDate);
    return window
      ? [
          {
            id: `ordinary:${item.id}`,
            kind: "ordinaryCommitment" as const,
            demandedMinutes: item.durationMinutes,
            scope: {
              kind: "userDay" as const,
              userDayDate: item.userDayDate,
              startsAt: window.start.toISOString(),
              endsAt: window.end.toISOString(),
            },
            reason: "unplaced",
            sourceId: item.id,
          },
        ]
      : [];
  });
  for (const composite of schedule.composites ?? [])
    for (const item of composite.liabilities) {
      const point = item.startsAt ? new Date(item.startsAt) : undefined,
        window = point
          ? windows.find((value) => value.start <= point && point < value.end)
          : undefined;
      if (window)
        result.push({
          id: `composite:${composite.compositeId}:${item.relationshipId}`,
          kind: "compositeCommitment",
          demandedMinutes: item.requiredMinutes,
          scope: {
            kind: "userDay",
            userDayDate: window.userDayDate,
            startsAt: window.start.toISOString(),
            endsAt: window.end.toISOString(),
          },
          reason: item.reason,
          sourceId: item.relationshipId,
        });
    }
  for (const claim of schedule.acceptedUnrealizedClaims ?? [])
    result.push({
      id: `accepted:${claim.id}`,
      kind: "acceptedAllocation",
      demandedMinutes: claim.durationMinutes,
      scope: {
        kind: "userDay",
        userDayDate: claim.userDayDate,
        startsAt: claim.startsAt,
        endsAt: claim.endsAt,
      },
      reason: "acceptedButUnrealized",
      sourceId: claim.id,
    });
  return result.sort((a, b) => a.id.localeCompare(b.id));
}
function unionExclusions(values: CapacityExclusionContributorV1[], start: Date, end: Date) {
  const clipped = values
    .map((item) => ({
      startsAt: new Date(Math.max(start.getTime(), Date.parse(item.startsAt))),
      endsAt: new Date(Math.min(end.getTime(), Date.parse(item.endsAt))),
      contributors: [item],
    }))
    .filter((item) => item.startsAt < item.endsAt)
    .sort(
      (a, b) =>
        a.startsAt.getTime() - b.startsAt.getTime() || a.endsAt.getTime() - b.endsAt.getTime(),
    );
  const merged: typeof clipped = [];
  for (const item of clipped) {
    const prior = merged.at(-1);
    if (prior && item.startsAt < prior.endsAt) {
      if (item.endsAt > prior.endsAt) prior.endsAt = item.endsAt;
      prior.contributors.push(...item.contributors);
    } else merged.push(item);
  }
  return merged;
}
function complement(exclusions: ReturnType<typeof unionExclusions>, start: Date, end: Date) {
  const result: Array<{ startsAt: Date; endsAt: Date }> = [];
  let cursor = start;
  for (const item of exclusions) {
    if (cursor < item.startsAt) result.push({ startsAt: cursor, endsAt: item.startsAt });
    if (item.endsAt > cursor) cursor = item.endsAt;
  }
  if (cursor < end) result.push({ startsAt: cursor, endsAt: end });
  return result;
}
function adjacent(
  exclusions: ReturnType<typeof unionExclusions>,
  opening: { startsAt: Date; endsAt: Date },
) {
  return {
    before:
      exclusions.find((item) => item.endsAt.getTime() === opening.startsAt.getTime())
        ?.contributors ?? [],
    after:
      exclusions.find((item) => item.startsAt.getTime() === opening.endsAt.getTime())
        ?.contributors ?? [],
  };
}
function qualification(
  stale: boolean,
  complete: boolean,
  unresolved: boolean,
): CapacityQualificationV1 {
  return {
    freshness: stale ? "stale" : "current",
    coverage: complete ? "complete" : "partial",
    integrity: "valid",
    liability: unresolved ? "unresolved" : "resolved",
    allocability: stale ? "nonAllocatable" : unresolved || !complete ? "qualified" : "allocatable",
  };
}
function summarize(intervals: CapacityIntervalV1[], liabilities: CapacityLiabilityV1[]) {
  const allocatable = intervals.filter((item) => item.allocability === "allocatable");
  return {
    totalEligibleMinutes: intervals.reduce((sum, item) => sum + item.durationMinutes, 0),
    fullyAllocatableMinutes: allocatable.reduce((sum, item) => sum + item.durationMinutes, 0),
    qualifiedMinutes: intervals
      .filter((item) => item.allocability === "qualified")
      .reduce((sum, item) => sum + item.durationMinutes, 0),
    longestAllocatableMinutes: Math.max(0, ...allocatable.map((item) => item.durationMinutes)),
    intervalCount: intervals.length,
    perUserDay: [...new Set(intervals.map((item) => item.userDayDate))].map((userDayDate) => ({
      userDayDate,
      eligibleMinutes: intervals
        .filter((item) => item.userDayDate === userDayDate)
        .reduce((sum, item) => sum + item.durationMinutes, 0),
      allocatableMinutes: allocatable
        .filter((item) => item.userDayDate === userDayDate)
        .reduce((sum, item) => sum + item.durationMinutes, 0),
    })),
    liabilityMinutes: liabilities.reduce((sum, item) => sum + item.demandedMinutes, 0),
  };
}
function minutes(value: { startsAt: Date; endsAt: Date }) {
  return (value.endsAt.getTime() - value.startsAt.getTime()) / 60_000;
}
function dates(value: CapacityLiabilityV1["scope"]) {
  return { startsAt: new Date(value.startsAt), endsAt: new Date(value.endsAt) };
}
function overlaps(a: { startsAt: Date; endsAt: Date }, b: { startsAt: Date; endsAt: Date }) {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}
function derived(): PlanningProvenanceV1 {
  return {
    version: 1,
    role: "derivedArtifact",
    origin: { kind: "derivedFromDependencies" },
    algorithm: CAPACITY_POLICY_V1,
  };
}
