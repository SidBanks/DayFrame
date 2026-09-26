import type { ActiveDayFrameAuthoredSetup } from "../../state/types.js";
import type { GeneratedCycleWorkBlock } from "../cycles/types.js";
import type { PlanDecisionV1 } from "../decisions/planDecision.js";
import { validatePlanDecision } from "../decisions/planDecision.js";
import { replayPlanDecisions } from "../decisions/replayPlanDecisions.js";
import { generateBlockCandidates } from "../blocks/generateBlockCandidates.js";
import type { DraftScheduledBlock } from "../blocks/types.js";
import { createDurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { RealizedScheduleFactV1 } from "../planning/realizedScheduleIdentity.js";
import { validateRealizedScheduleFact } from "../planning/realizedScheduleIdentity.js";
import {
  projectCompositeOccurrence,
  validateCompositionAuthority,
  type CompositionAuthorityV1,
  type CompositionTemplateSourceV1,
} from "../planning/commitmentComposition.js";
import { resolveUserDayWindowForLabel, addUserDayLabels } from "../time/canonicalUserDay.js";
import type { FoundationalOccupancyV1 } from "../time/physicalOccupancy.js";
import { formatLocalDate } from "../time/userDay.js";
import type { LocalDateString } from "../shifts/types.js";
import { localClock, MINUTE } from "./deriveSleepOccurrences.js";
import type { SleepInterval } from "./sleepResolution.js";

export class SleepContextIncompleteError extends Error {}
export type SleepFoundationAuthority = {
  status: "complete" | "protected" | "incomplete";
  planDecisions: readonly PlanDecisionV1[];
  realizedFacts: readonly RealizedScheduleFactV1[];
  composition: {
    authority: CompositionAuthorityV1;
    sources: readonly CompositionTemplateSourceV1[];
  };
};
/** Inputs are authoritative snapshots, never a placed Preview or Proposal. */
export function deriveSleepBlockingOccupancy(
  state: ActiveDayFrameAuthoredSetup,
  work: GeneratedCycleWorkBlock[],
  authority: SleepFoundationAuthority,
  physical: SleepInterval,
): FoundationalOccupancyV1[] {
  const result: FoundationalOccupancyV1[] = [];
  const add = (
    id: string,
    kind: FoundationalOccupancyV1["authority"],
    a: Date,
    b: Date,
    reference: unknown,
    protection = false,
  ) => {
    if (!Number.isFinite(a.getTime()) || !Number.isFinite(b.getTime()) || b <= a)
      throw new RangeError("Invalid foundational geometry");
    if (a.getTime() < Date.parse(physical.endsAt) && b.getTime() > Date.parse(physical.startsAt))
      result.push({
        id,
        authority: kind,
        startsAt: a.toISOString(),
        endsAt: b.toISOString(),
        sourceReference: structuredClone(reference),
        timeSemantics: protection ? "protection" : "activity",
      });
  };
  for (const w of work) {
    const ref =
      w.occurrenceIdentity && createDurableOccurrenceReference(w.occurrenceIdentity, state);
    if (!ref || ref.status !== "created")
      throw new SleepContextIncompleteError("Work lineage unavailable");
    add(`work:${JSON.stringify(ref.reference)}`, "work", w.startsAt, w.endsAt, ref.reference);
  }
  for (const event of state.manualEvents) {
    const day = resolveUserDayWindowForLabel({
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
      userDayDate: event.userDayDate,
    });
    // Match the canonical manual-event owner: timed Events use civil date, all-day Events canonical day.
    const a =
      event.allDay || !event.startTime ? day.start : localClock(event.userDayDate, event.startTime);
    const b =
      event.allDay || !event.endTime
        ? day.end
        : localClock(
            event.userDayDate,
            event.endTime,
            event.endTime <= (event.startTime ?? event.endTime),
          );
    add(`event:${event.id}`, "manualEvent", a, b, {
      id: event.id,
      incarnationId: event.incarnationId,
    });
  }
  for (const fact of authority.realizedFacts) {
    if (validateRealizedScheduleFact(fact).status !== "valid")
      throw new RangeError("Invalid realized authority");
    add(
      `realized:${fact.id}`,
      fact.scheduleRole === "productiveGoalWork"
        ? "realizedGoalWork"
        : fact.scheduleRole === "supportActivity"
          ? "supportActivity"
          : "protectedBuffer",
      new Date(fact.startsAt),
      new Date(fact.endsAt),
      fact,
      fact.timeSemantics === "protection",
    );
  }
  for (const d of authority.planDecisions)
    if (validatePlanDecision(d).status !== "valid")
      throw new RangeError("Invalid accepted decision");
  const sources = [...authority.composition.sources].sort((a, b) =>
    a.sourceId.localeCompare(b.sourceId),
  );
  const composition = structuredClone(authority.composition.authority);
  composition.relationships.sort((a, b) => a.id.localeCompare(b.id) || a.revision - b.revision);
  composition.decisions.sort((a, b) => a.id.localeCompare(b.id) || a.revision - b.revision);
  if (validateCompositionAuthority(composition, sources).status === "invalid")
    throw new RangeError("Invalid composition authority");
  // Bound hard parent context by every possible attachment displacement and full template footprint.
  const reach =
    2 *
      Math.max(
        0,
        ...state.blockTemplates.map(
          (t) => t.durationMinutes + (t.bufferBeforeMinutes ?? 0) + (t.bufferAfterMinutes ?? 0),
        ),
      ) +
    composition.relationships.reduce(
      (sum, r) =>
        sum +
        r.buffer.beforeMinutes +
        r.buffer.afterMinutes +
        ("offsetMinutes" in r.timing
          ? Math.abs(r.timing.offsetMinutes)
          : "gap" in r.timing
            ? r.timing.gap.minutes
            : 0),
      0,
    );
  const decisionReach = composition.decisions.reduce(
    (sum, d) =>
      sum +
      d.deltas.reduce(
        (n, delta) => n + (delta.action === "offset" ? Math.abs(delta.minutes) : 0),
        0,
      ),
    0,
  );
  const start = new Date(Date.parse(physical.startsAt) - (reach + decisionReach) * MINUTE),
    end = new Date(Date.parse(physical.endsAt) + (reach + decisionReach) * MINUTE);
  const latest = new Map<string, CompositionAuthorityV1["relationships"][number]>();
  for (const r of composition.relationships)
    if (!latest.has(r.id) || latest.get(r.id)!.revision < r.revision) latest.set(r.id, r);
  const childIds = new Set(
    [...latest.values()]
      .filter((r) => r.status === "active")
      .map((r) => `${r.child.sourceId}|${r.child.incarnationId}`),
  );
  const recurrences = state.blockRecurrences.filter(
    (r) =>
      !childIds.has(
        `${r.blockTemplateId}|${state.blockTemplates.find((t) => t.id === r.blockTemplateId)?.incarnationId}`,
      ),
  );
  const candidatesIn = (a: Date, b: Date) =>
    generateBlockCandidates({
      blockTemplates: state.blockTemplates,
      blockRecurrences: recurrences,
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
      planningWindowStart: a,
      planningWindowEnd: b,
    });
  const candidates = new Map(
    candidatesIn(
      new Date(`${addUserDayLabels(formatLocalDate(start) as LocalDateString, -2)}T00:00:00`),
      new Date(`${addUserDayLabels(formatLocalDate(end) as LocalDateString, 2)}T00:00:00`),
    ).map((c) => [c.id, c]),
  );
  // An accepted pin may move an occurrence from far outside this physical range into it.
  for (const d of authority.planDecisions) {
    if (d.target.sourceKind !== "template") continue;
    const coordinate = d.target.coordinate;
    const label =
      coordinate.scopeKind === "userDay" ? coordinate.userDayDate : coordinate.userWeekStartDate;
    for (const c of candidatesIn(
      new Date(`${addUserDayLabels(label, -1)}T00:00:00`),
      new Date(`${addUserDayLabels(label, 8)}T00:00:00`),
    ))
      candidates.set(c.id, c);
  }
  const replay = replayPlanDecisions({
    decisions: authority.planDecisions.filter((d) => d.kind !== "placeSleepOccurrence"),
    authoredSetup: state,
    blockCandidates: [...candidates.values()].sort((a, b) => a.id.localeCompare(b.id)),
    planningWindowStart: new Date(-8_000_000_000_000_000),
    planningWindowEnd: new Date(8_000_000_000_000_000),
    dayBoundaryStartTime: state.schedulingPreferences.dayBoundaryStartTime,
    weekStartsOn: state.schedulingPreferences.weekStartsOn,
  });
  if (replay.pendingResults.some((r) => !["applied", "outsideWindow"].includes(r.status)))
    throw new SleepContextIncompleteError("Accepted decision requires review");
  for (const c of replay.blockCandidates) {
    if (c.placementType !== "fixed") continue;
    if (!c.fixedStartTime || !c.occurrenceIdentity)
      throw new SleepContextIncompleteError("Fixed Commitment has no exact geometry");
    const day = resolveUserDayWindowForLabel({
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
      userDayDate: c.userDayDate,
    });
    const a = localClock(
        c.userDayDate,
        c.fixedStartTime,
        c.fixedStartTime < day.dayBoundaryStartTime,
      ),
      b = new Date(a.getTime() + c.durationMinutes * MINUTE);
    const ref = createDurableOccurrenceReference(c.occurrenceIdentity, state);
    if (ref.status !== "created")
      throw new SleepContextIncompleteError("Missing fixed source lineage");
    const reference = {
      occurrence: ref.reference,
      decisionId: replay.exactDecisionCandidateIds.get(c.id)?.id,
    };
    add(
      `fixed:${c.id}`,
      replay.hardPlacementCandidateIds.has(c.id) ? "acceptedPlacement" : "fixedCommitment",
      a,
      b,
      reference,
    );
    if (c.bufferBeforeMinutes)
      add(
        `fixed:${c.id}:before`,
        "protectedBuffer",
        new Date(a.getTime() - c.bufferBeforeMinutes * MINUTE),
        a,
        reference,
        true,
      );
    if (c.bufferAfterMinutes)
      add(
        `fixed:${c.id}:after`,
        "protectedBuffer",
        b,
        new Date(b.getTime() + c.bufferAfterMinutes * MINUTE),
        reference,
        true,
      );
    const parentSource = sources.find((s) => s.sourceId === c.templateId);
    if (!parentSource) continue;
    const parent: DraftScheduledBlock = {
      ...c,
      startsAt: a,
      endsAt: b,
      source: "template",
      status: "planned",
    };
    const composite = projectCompositeOccurrence({
      parent,
      parentSource,
      sources: [...sources].sort((a, b) => a.sourceId.localeCompare(b.sourceId)),
      authority: composition,
      planningWindow: {
        startsAt: new Date(-8_000_000_000_000_000),
        endsAt: new Date(8_000_000_000_000_000),
      },
    });
    if (composite.state === "stale" || composite.state === "requiredComponentFailure")
      throw new SleepContextIncompleteError("Fixed composition unresolved");
    for (const f of composite.footprint)
      if (f.classification !== "parentCore" && f.classification !== "requiredLiability")
        add(
          `composite:${f.id}`,
          f.classification === "buffer" ? "protectedBuffer" : "supportActivity",
          new Date(f.startsAt),
          new Date(f.endsAt),
          { parent: ref.reference, compositeId: composite.compositeId, footprint: f },
          f.classification === "buffer",
        );
  }
  return result.sort(
    (a, b) =>
      a.startsAt.localeCompare(b.startsAt) ||
      a.endsAt.localeCompare(b.endsAt) ||
      a.id.localeCompare(b.id),
  );
}
