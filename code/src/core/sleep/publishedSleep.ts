import {
  queryEffectiveSleepRequirement,
  validateSleepRequirement,
  type SleepRequirementV1,
} from "./sleepRequirement.js";
import {
  isSleepOccurrenceReference,
  type SleepOccurrenceReferenceV1,
} from "../occurrences/sleepOccurrenceReference.js";
import {
  durableOccurrenceReferencesEqual,
  validateDurableOccurrenceReference,
} from "../occurrences/durableOccurrenceReference.js";
import { validatePlanDecision, type PlanDecisionV1 } from "../decisions/planDecision.js";
import { capacityFingerprint } from "../planning/capacityFingerprint.js";
import type { ScheduledSleepOccurrenceV1 } from "./sleepResolution.js";
import type {
  HistoricalGoalProvenanceV1,
  PlanPublicationBatchId,
} from "../historicalPlan/historicalPlan.js";

export type PublishedSleepSnapshotV1 = {
  version: 1;
  snapshotId: string;
  publicationBatchId: PlanPublicationBatchId;
  ownerUtcOffsetMinutes: number;
  publicationRange: { startUserDayDate: string; endUserDayDate: string };
  requirement: SleepRequirementV1;
  occurrence: ScheduledSleepOccurrenceV1;
  acceptedPlacement: Extract<PlanDecisionV1, { kind: "placeSleepOccurrence" }> | null;
};
/** The existing HistoricalPlan snapshot union advances with one new strict variant. */
export type HistoricalPublishedSleepSnapshotV4 = {
  version: 4;
  sourceFamily: "sleepRequirement";
  reference: SleepOccurrenceReferenceV1;
  title: "Sleep";
  category: "sleep";
  timing: { kind: "timed" };
  plan: { state: "scheduled"; startsAt: string; endsAt: string };
  sleep: PublishedSleepSnapshotV1;
  goals?: HistoricalGoalProvenanceV1[];
};
export function publishedSleepSnapshotId(
  batchId: string,
  reference: SleepOccurrenceReferenceV1,
): string {
  return capacityFingerprint({ policy: "published-sleep-v1", batchId, reference });
}
export function createPublishedSleepSnapshot(
  sleep: Omit<PublishedSleepSnapshotV1, "version" | "snapshotId" | "ownerUtcOffsetMinutes">,
): HistoricalPublishedSleepSnapshotV4 {
  const o = sleep.occurrence;
  const result: HistoricalPublishedSleepSnapshotV4 = {
    version: 4,
    sourceFamily: "sleepRequirement",
    reference: structuredClone(o.reference),
    title: "Sleep",
    category: "sleep",
    timing: { kind: "timed" },
    plan: { state: "scheduled", startsAt: o.sleepStart, endsAt: o.sleepEnd },
    sleep: {
      ...structuredClone(sleep),
      version: 1,
      snapshotId: publishedSleepSnapshotId(sleep.publicationBatchId, o.reference),
      ownerUtcOffsetMinutes: -new Date(
        o.derivationContext.ownerWindow.startsAt,
      ).getTimezoneOffset(),
    },
    goals: [],
  };
  if (!isPublishedSleepSnapshot(result)) throw new RangeError("Invalid frozen Sleep snapshot");
  return result;
}
/** Strict frozen-context validation. Never queries or re-derives current authored authority. */
export function isPublishedSleepSnapshot(
  value: unknown,
): value is HistoricalPublishedSleepSnapshotV4 {
  try {
    if (
      !object(value) ||
      !keys(value, [
        "version",
        "sourceFamily",
        "reference",
        "title",
        "category",
        "timing",
        "plan",
        "sleep",
        ...(value.goals === undefined ? [] : ["goals"]),
      ])
    )
      return false;
    const v = value as unknown as HistoricalPublishedSleepSnapshotV4;
    if (
      v.version !== 4 ||
      v.sourceFamily !== "sleepRequirement" ||
      v.title !== "Sleep" ||
      v.category !== "sleep" ||
      !isSleepOccurrenceReference(v.reference) ||
      !keys(v.timing, ["kind"]) ||
      v.timing.kind !== "timed" ||
      !keys(v.plan, ["state", "startsAt", "endsAt"]) ||
      v.plan.state !== "scheduled" ||
      (v.goals !== undefined && (!Array.isArray(v.goals) || v.goals.length !== 0))
    )
      return false;
    const s = v.sleep;
    if (
      !keys(s, [
        "version",
        "snapshotId",
        "publicationBatchId",
        "ownerUtcOffsetMinutes",
        "publicationRange",
        "requirement",
        "occurrence",
        "acceptedPlacement",
      ]) ||
      s.version !== 1 ||
      !uuid(s.publicationBatchId) ||
      !Number.isInteger(s.ownerUtcOffsetMinutes) ||
      Math.abs(s.ownerUtcOffsetMinutes) > 840 ||
      !keys(s.publicationRange, ["startUserDayDate", "endUserDayDate"]) ||
      !date(s.publicationRange.startUserDayDate) ||
      !date(s.publicationRange.endUserDayDate) ||
      s.publicationRange.startUserDayDate > s.publicationRange.endUserDayDate
    )
      return false;
    const r = validateSleepRequirement(s.requirement),
      o = s.occurrence,
      c = o.derivationContext;
    if (
      !keys(o, [
        "version",
        "reference",
        "requirementRevision",
        "ownerDay",
        "membership",
        "durationMinutes",
        "bufferBeforeMinutes",
        "bufferAfterMinutes",
        "windowIntent",
        "derivationContext",
        "sleepStart",
        "sleepEnd",
        "footprintStart",
        "footprintEnd",
        "provenance",
      ]) ||
      o.version !== 1 ||
      !isSleepOccurrenceReference(o.reference) ||
      !durableOccurrenceReferencesEqual(o.reference, v.reference) ||
      o.ownerDay !== v.reference.coordinate.userDayDate ||
      !date(o.ownerDay) ||
      !["requested", "guard"].includes(o.membership) ||
      o.ownerDay < s.publicationRange.startUserDayDate ||
      o.ownerDay > s.publicationRange.endUserDayDate ||
      s.snapshotId !== publishedSleepSnapshotId(s.publicationBatchId, v.reference)
    )
      return false;
    if (
      r.id !== v.reference.requirement.id ||
      r.incarnationId !== v.reference.requirement.incarnationId ||
      r.revision !== o.requirementRevision ||
      r.durationMinutes !== o.durationMinutes ||
      r.bufferBeforeMinutes !== o.bufferBeforeMinutes ||
      r.bufferAfterMinutes !== o.bufferAfterMinutes ||
      capacityFingerprint(r.window) !== capacityFingerprint(o.windowIntent) ||
      !r.enabled ||
      queryEffectiveSleepRequirement([r], o.ownerDay).status !== "effective"
    )
      return false;
    if (
      ![o.sleepStart, o.sleepEnd, o.footprintStart, o.footprintEnd].every(instant) ||
      v.plan.startsAt !== o.sleepStart ||
      v.plan.endsAt !== o.sleepEnd ||
      Date.parse(o.sleepEnd) - Date.parse(o.sleepStart) !== o.durationMinutes * 60000 ||
      Date.parse(o.sleepStart) - Date.parse(o.footprintStart) !== o.bufferBeforeMinutes * 60000 ||
      Date.parse(o.footprintEnd) - Date.parse(o.sleepEnd) !== o.bufferAfterMinutes * 60000
    )
      return false;
    if (
      !keys(c, [
        "version",
        "ownerWindow",
        "dayBoundaryStartTime",
        "nextDayBoundaryStartTime",
        "weekStartsOn",
        "work",
        ...(c.anchor === undefined ? [] : ["anchor"]),
        "offDay",
        "windowProvenance",
        "physicalWindow",
        "preferredSleepStart",
        "timezone",
        "offsetMinutes",
        "clockPolicy",
      ]) ||
      c.version !== 1 ||
      !interval(c.ownerWindow) ||
      !interval(c.physicalWindow) ||
      !clock(c.dayBoundaryStartTime) ||
      !clock(c.nextDayBoundaryStartTime) ||
      !["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].includes(
        c.weekStartsOn,
      ) ||
      typeof c.offDay !== "boolean" ||
      !["clock", "beforeWork", "afterWork", "offDay"].includes(c.windowProvenance) ||
      !instant(c.preferredSleepStart) ||
      typeof c.timezone !== "string" ||
      !c.timezone.length ||
      !Array.isArray(c.offsetMinutes) ||
      c.offsetMinutes.length !== 2 ||
      !c.offsetMinutes.every((n) => Number.isInteger(n) && Math.abs(n) <= 840) ||
      c.clockPolicy !== "localDate-compatible-earlier-fold-forward-gap"
    )
      return false;
    new Intl.DateTimeFormat("en", { timeZone: c.timezone });
    const work = (w: unknown) =>
      object(w) &&
      keys(w, ["reference", "interval"]) &&
      validateDurableOccurrenceReference(w.reference).status === "valid" &&
      object(w.reference) &&
      w.reference.sourceKind === "work" &&
      interval(w.interval);
    if (
      new Date(Date.parse(c.ownerWindow.startsAt) + s.ownerUtcOffsetMinutes * 60000)
        .toISOString()
        .slice(0, 10) !== o.ownerDay ||
      !Array.isArray(c.work) ||
      !c.work.every(work) ||
      (c.anchor !== undefined &&
        (!work(c.anchor) ||
          !c.work.some((w) => capacityFingerprint(w) === capacityFingerprint(c.anchor)))) ||
      c.offDay !== (c.work.length === 0) ||
      (o.windowIntent.kind === "clock"
        ? c.windowProvenance !== "clock" || c.anchor !== undefined
        : c.offDay
          ? c.windowProvenance !== "offDay" || c.anchor !== undefined
          : c.windowProvenance !== o.windowIntent.kind || c.anchor === undefined) ||
      Date.parse(o.footprintStart) < Date.parse(c.physicalWindow.startsAt) ||
      Date.parse(o.footprintEnd) > Date.parse(c.physicalWindow.endsAt) ||
      !keys(o.provenance, ["policy", "dependencyFingerprint"]) ||
      o.provenance.policy !== "sleep-minute-joint-v1" ||
      typeof o.provenance.dependencyFingerprint !== "string" ||
      !o.provenance.dependencyFingerprint.length
    )
      return false;
    if (s.acceptedPlacement !== null) {
      const d = s.acceptedPlacement;
      if (
        validatePlanDecision(d).status !== "valid" ||
        d.kind !== "placeSleepOccurrence" ||
        d.payload.revokedAt !== null ||
        !durableOccurrenceReferencesEqual(d.target, v.reference) ||
        d.payload.sleepStart !== o.sleepStart ||
        d.payload.sleepEnd !== o.sleepEnd ||
        d.payload.footprintStart !== o.footprintStart ||
        d.payload.footprintEnd !== o.footprintEnd
      )
        return false;
    }
    return true;
  } catch {
    return false;
  }
}
/** Identity/evidence-only differences across publication scopes do not change physical planned truth. */
export function publishedSleepSemanticValue(snapshot: HistoricalPublishedSleepSnapshotV4) {
  const {
    membership: _membership,
    provenance: _provenance,
    ...occurrence
  } = snapshot.sleep.occurrence;
  void _membership;
  void _provenance;
  return {
    version: 4,
    reference: snapshot.reference,
    occurrence,
    requirement: snapshot.sleep.requirement,
    ownerUtcOffsetMinutes: snapshot.sleep.ownerUtcOffsetMinutes,
    acceptedPlacement: snapshot.sleep.acceptedPlacement,
  };
}
function object(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
function keys(v: unknown, k: string[]): boolean {
  return object(v) && Object.keys(v).length === k.length && k.every((key) => Object.hasOwn(v, key));
}
function uuid(v: unknown) {
  return (
    typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(v)
  );
}
function instant(v: unknown): v is string {
  return typeof v === "string" && Number.isFinite(Date.parse(v)) && new Date(v).toISOString() === v;
}
function date(v: unknown) {
  return (
    typeof v === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v) &&
    Number.isFinite(Date.parse(v)) &&
    new Date(v).toISOString().slice(0, 10) === v
  );
}
function clock(v: unknown) {
  return typeof v === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(v);
}
function interval(v: unknown) {
  return (
    object(v) &&
    keys(v, ["startsAt", "endsAt"]) &&
    instant(v.startsAt) &&
    instant(v.endsAt) &&
    Date.parse(v.startsAt) < Date.parse(v.endsAt)
  );
}
