import { detectSleepFriction } from "../sleep/sleepCorrective.js";
import {
  resolveRequiredSleep,
  type ResolveRequiredSleepInput,
} from "../sleep/resolveRequiredSleep.js";
import { qualifyFoundationalPlanning } from "./foundationalPlanning.js";
import { addUserDayLabels, resolveUserDayWindowForLabel } from "../time/canonicalUserDay.js";
import {
  generatePlanningSchedule,
  type GenerateSchedulePreviewResult,
} from "../engine/generatePlanningSchedule.js";
import { deriveSleepBlockingOccupancy } from "../sleep/sleepFoundationalOccupancy.js";
import { generateCycleWorkBlocks } from "../cycles/generateCycleWorkBlocks.js";
import { projectCompositeOccurrence } from "./commitmentComposition.js";

/** One current snapshot, one Sleep witness, then ordinary scheduling. No Preview input/cache. */
export function deriveFoundationalSchedule(
  input: ResolveRequiredSleepInput & { generatedAt?: string },
) {
  const state = input.authoredState;
  const resolver = {
    shiftCycles: state.shiftCycles,
    defaultSchedulingPreferences: state.schedulingPreferences,
  };
  // Candidate generation includes adjacent owners. Work-relative searches reach 24h;
  // propagated legacy Sleep additionally reaches its full footprint. Include clock/offset carry.
  const pad =
    3 +
    Math.ceil(
      Math.max(
        0,
        ...state.blockTemplates.map(
          (t) => t.durationMinutes + (t.bufferBeforeMinutes ?? 0) + (t.bufferAfterMinutes ?? 0),
        ),
      ) / 1440,
    );
  const ownerRange = {
    startUserDayDate: addUserDayLabels(input.ownerRange.startUserDayDate, -pad),
    endUserDayDateExclusive: addUserDayLabels(input.ownerRange.endUserDayDateExclusive, pad),
  };
  const foundation = qualifyFoundationalPlanning(resolveRequiredSleep({ ...input, ownerRange }));
  const planningWindow = {
    startsAt: resolveUserDayWindowForLabel({
      ...resolver,
      userDayDate: input.ownerRange.startUserDayDate,
    }).start,
    endsAt: resolveUserDayWindowForLabel({
      ...resolver,
      userDayDate: addUserDayLabels(input.ownerRange.endUserDayDateExclusive, -1),
    }).end,
  };
  const empty: GenerateSchedulePreviewResult = {
    generatedWorkBlocks: [],
    blockCandidates: [],
    scheduledBlocks: [],
    unplacedCandidates: [],
    frictionPoints: detectSleepFriction(
      foundation.sleep,
      input.generatedAt ?? new Date().toISOString(),
      { ...input, ownerRange },
    ),
    planDecisionResults: [],
    foundation,
  };
  if (foundation.status === "nonAllocatable")
    return {
      resolver,
      foundation,
      schedule: empty,
      planningWindow,
      hardOccupancy: [] as
        | typeof foundation.protection
        | ReturnType<typeof deriveSleepBlockingOccupancy>,
    };
  const start = resolveUserDayWindowForLabel({
    ...resolver,
    userDayDate: ownerRange.startUserDayDate,
  }).start;
  const end = resolveUserDayWindowForLabel({
    ...resolver,
    userDayDate: addUserDayLabels(ownerRange.endUserDayDateExclusive, -1),
  }).end;
  const work = generateCycleWorkBlocks({
    shiftDefinitions: state.shiftDefinitions,
    shiftCycles: state.shiftCycles,
    defaultSchedulingPreferences: state.schedulingPreferences,
    planningWindowStart: start,
    planningWindowEnd: end,
  });
  const hard = deriveSleepBlockingOccupancy(state, work, input.authority, {
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
  });
  const occupied = [...hard, ...foundation.protection].map((o) => ({
    id: o.id,
    startsAt: new Date(o.startsAt),
    endsAt: new Date(o.endsAt),
  }));
  const latest = new Map<
    string,
    (typeof input.authority.composition.authority.relationships)[number]
  >();
  for (const r of input.authority.composition.authority.relationships)
    if (!latest.has(r.id) || latest.get(r.id)!.revision < r.revision) latest.set(r.id, r);
  const children = new Set(
    [...latest.values()]
      .filter((r) => r.status === "active")
      .map((r) => `${r.child.sourceId}|${r.child.incarnationId}`),
  );
  const schedule = generatePlanningSchedule({
    ...state,
    blockRecurrences: state.blockRecurrences.filter(
      (r) =>
        !children.has(
          `${r.blockTemplateId}|${state.blockTemplates.find((t) => t.id === r.blockTemplateId)?.incarnationId}`,
        ),
    ),
    planningWindowStart: planningWindow.startsAt,
    planningWindowEnd: planningWindow.endsAt,
    ...state.schedulingPreferences,
    generatedAt: input.generatedAt ?? "2000-01-01T00:00:00.000Z",
    planDecisions: input.authority.planDecisions,
    realizedScheduleFacts: input.authority.realizedFacts,
    foundation,
    // Only movable placement consumes this additional foundation. Exact/fixed replay
    // keeps its existing owner and does not collide with its own hard geometry.
    foundationalOccupiedBlocks: [
      ...occupied,
      // No flexible footprint may escape the validated Sleep problem's physical envelope.
      { startsAt: new Date(-8640000000000000), endsAt: start },
      { startsAt: end, endsAt: new Date(8640000000000000) },
    ],
  });
  const sources = [...input.authority.composition.sources].sort((a, b) =>
    a.sourceId.localeCompare(b.sourceId),
  );
  const composites = schedule.scheduledBlocks.flatMap((parent) => {
    const identity = parent.commitmentNavigationIdentity;
    const parentSource = sources.find(
      (s) =>
        s.sourceId === identity?.templateId && s.incarnationId === identity?.templateIncarnationId,
    );
    return parentSource
      ? [
          projectCompositeOccurrence({
            parent,
            parentSource,
            sources,
            authority: input.authority.composition.authority,
            planningWindow: { startsAt: start, endsAt: end },
            occupied: [
              ...occupied.filter(
                (o) => parent.placementType !== "fixed" || !hard.some((h) => h.id === o.id),
              ),
              ...work,
              ...schedule.scheduledBlocks,
            ],
          }),
        ]
      : [];
  });
  schedule.scheduledBlocks.push(...composites.flatMap((c) => c.attachedOccurrences));
  if (composites.length) schedule.compositionResults = composites;
  schedule.frictionPoints.push(
    ...composites.flatMap((value) =>
      value.liabilities.map((liability) => ({
        id: `composition-${value.compositeId}-${liability.relationshipId}`,
        userId: "dayframe",
        kind: "compositionFailure" as const,
        severity: "critical" as const,
        title: "Required commitment support is unresolved",
        message: `Required attached activity could not be placed (${liability.reason}).`,
        affectedBlockIds: [value.parentOccurrenceId],
        suggestedFixes: [],
        canIgnore: false,
        ignored: false,
        resolved: false,
        createdAt: input.generatedAt ?? "2000-01-01T00:00:00.000Z",
        updatedAt: input.generatedAt ?? "2000-01-01T00:00:00.000Z",
      })),
    ),
  );
  return { resolver, foundation, schedule, planningWindow, hardOccupancy: hard };
}
export type FoundationalScheduleV1 = ReturnType<typeof deriveFoundationalSchedule>;

export { trySleepPlacement, sleepCorrectionFingerprint } from "../sleep/sleepCorrective.js";

/** Current realization evidence uses saved canonical sources, never the Preview cache. */
export function prepareRealizationSources(
  input: Parameters<typeof deriveFoundationalSchedule>[0],
  accepted: import("./proposal.js").AcceptedAllocationV2,
):
  | {
      status: "eligible";
      schedule: import("./acceptedAllocationRealization.js").RealizationConflictSubjectV1[];
    }
  | { status: "reviewRequired" | "unavailable" } {
  if (input.authority.status !== "complete") return { status: "unavailable" };
  try {
    const planning = deriveFoundationalSchedule(input);
    if (
      planning.foundation.status === "nonAllocatable" ||
      accepted.claims.some(
        (claim) =>
          Date.parse(claim.startsAt) < planning.planningWindow.startsAt.getTime() ||
          Date.parse(claim.endsAt) > planning.planningWindow.endsAt.getTime() ||
          planning.foundation.protection.some(
            (p) => claim.startsAt < p.endsAt && p.startsAt < claim.endsAt,
          ),
      )
    )
      return { status: "reviewRequired" };
    const hard = planning.hardOccupancy;
    const realizedIds = new Set(input.authority.realizedFacts.map((f) => f.id));
    const hardIds = new Set(hard.map((item) => item.id));
    return {
      status: "eligible",
      schedule: [
        ...hard
          .filter((item) => !item.id.startsWith("realized:"))
          .map((item) => ({
            id: item.id as never,
            startsAt: item.startsAt,
            endsAt: item.endsAt,
            sourceKind: ("authority" in item ? item.authority : "sleep") as never,
            ...(!("timeSemantics" in item) || item.timeSemantics === "protection"
              ? { scheduleRole: "bufferProtection" as const }
              : {}),
          })),
        ...planning.schedule.scheduledBlocks
          .filter(
            (item) =>
              !realizedIds.has(item.id as never) &&
              !hardIds.has(`fixed:${item.id}`) &&
              !hardIds.has(`event:${item.id}`),
          )
          .map((item) => ({
            id: item.id as never,
            startsAt: item.startsAt.toISOString(),
            endsAt: item.endsAt.toISOString(),
            sourceKind: item.source as never,
          })),
      ],
    };
  } catch {
    return { status: "unavailable" };
  }
}
