import type { ExecutionHistoryItem } from "../execution/executionHistoryProjection.js";
import type { ExecutionAssertionRecordV1 } from "../execution/executionRecord.js";
import type {
  HistoricalOccurrenceTimingSemantics,
  HistoricalPlannedOccurrenceSnapshot,
} from "../historicalPlan/historicalPlan.js";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { CanonicalUserDayWindow } from "../time/canonicalUserDay.js";

export type TodayExecutionState =
  | { coverage: "available"; status: "notReported" }
  | {
      coverage: "available";
      status: "completed" | "partial" | "skipped";
      record: ExecutionAssertionRecordV1;
    }
  | { coverage: "unavailableProtected" }
  | { coverage: "unavailable" };

export type TodayOccurrence = {
  occurrence: HistoricalPlannedOccurrenceSnapshot;
  execution: TodayExecutionState;
};

export type TodayTimedOccurrence = TodayOccurrence & {
  temporalPosition: "current" | "upcoming" | "elapsed";
};

export type TodayPlanAttention = {
  unplaced: HistoricalPlannedOccurrenceSnapshot[];
  omitted: HistoricalPlannedOccurrenceSnapshot[];
  blocked: HistoricalPlannedOccurrenceSnapshot[];
};

export type TodayAvailableReadModel = {
  status: "available";
  evaluationAsOf: string;
  userDay: {
    date: string;
    start: string;
    end: string;
    durationMinutes: number;
    dayBoundaryStartTime: string;
    nextDayBoundaryStartTime: string;
    weekStartsOn: CanonicalUserDayWindow["weekStartsOn"];
  };
  plan: {
    coverage: "available" | "knownEmpty";
    batchId: string;
    publishedAt: string;
    durability: "durable" | "pending";
  };
  executionCoverage: TodayExecutionState["coverage"];
  allDay: TodayOccurrence[];
  timingUnavailableLegacy: TodayOccurrence[];
  timed: TodayTimedOccurrence[];
  current: TodayTimedOccurrence[];
  next: TodayTimedOccurrence[];
  later: TodayTimedOccurrence[];
  elapsed: TodayTimedOccurrence[];
  planAttention: TodayPlanAttention;
};

export type BuildTodayReadModelInput = {
  evaluationAsOf: string;
  userDay: CanonicalUserDayWindow;
  plan: {
    occurrences: Array<{
      occurrence: HistoricalPlannedOccurrenceSnapshot;
      timing: HistoricalOccurrenceTimingSemantics;
    }>;
    batchId: string;
    publishedAt: string;
    durability: "durable" | "pending";
  };
  execution:
    | { coverage: "available"; items: readonly ExecutionHistoryItem[] }
    | { coverage: "unavailableProtected" | "unavailable" };
};

export function isCanonicalTodayEvaluationInstant(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value))
    return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

export function buildTodayReadModel(input: BuildTodayReadModelInput): TodayAvailableReadModel {
  const evaluationMillis = Date.parse(input.evaluationAsOf);
  if (!Number.isFinite(evaluationMillis)) throw new RangeError("evaluationAsOf must be valid");
  const executionByReference = buildExecutionByReference(input.execution);
  const allDay: TodayOccurrence[] = [];
  const timingUnavailableLegacy: TodayOccurrence[] = [];
  const timed: TodayTimedOccurrence[] = [];
  const planAttention: TodayPlanAttention = { unplaced: [], omitted: [], blocked: [] };

  for (const source of input.plan.occurrences) {
    const occurrence = structuredClone(source.occurrence);
    if (occurrence.plan.state !== "scheduled") {
      planAttention[occurrence.plan.state].push(occurrence);
      continue;
    }
    const projected: TodayOccurrence = {
      occurrence,
      execution: cloneExecutionState(
        executionByReference.get(referenceKey(occurrence.reference)) ??
          unavailableOrNotReported(input.execution.coverage),
      ),
    };
    const timing = source.timing;
    if (timing.coverage === "unavailableLegacy") timingUnavailableLegacy.push(projected);
    else if (timing.kind === "allDay") allDay.push(projected);
    else {
      const start = Date.parse(occurrence.plan.startsAt);
      const end = Date.parse(occurrence.plan.endsAt);
      timed.push({
        ...projected,
        temporalPosition:
          start <= evaluationMillis && evaluationMillis < end
            ? "current"
            : start > evaluationMillis
              ? "upcoming"
              : "elapsed",
      });
    }
  }

  allDay.sort(compareUntimed);
  timingUnavailableLegacy.sort(compareUntimed);
  timed.sort(compareTimed);
  for (const values of Object.values(planAttention)) values.sort(compareSnapshot);
  const current = timed.filter((value) => value.temporalPosition === "current");
  const upcoming = timed.filter((value) => value.temporalPosition === "upcoming");
  const firstUpcomingStart = upcoming[0]?.occurrence.plan;
  const nextStart =
    firstUpcomingStart?.state === "scheduled" ? firstUpcomingStart.startsAt : undefined;
  const next = nextStart
    ? upcoming.filter(
        (value) =>
          value.occurrence.plan.state === "scheduled" &&
          value.occurrence.plan.startsAt === nextStart,
      )
    : [];
  const later = upcoming.slice(next.length);
  const elapsed = timed.filter((value) => value.temporalPosition === "elapsed");

  return structuredClone({
    status: "available",
    evaluationAsOf: input.evaluationAsOf,
    userDay: {
      date: input.userDay.userDayDate,
      start: input.userDay.start.toISOString(),
      end: input.userDay.end.toISOString(),
      durationMinutes: input.userDay.durationMinutes,
      dayBoundaryStartTime: input.userDay.dayBoundaryStartTime,
      nextDayBoundaryStartTime: input.userDay.nextDayBoundaryStartTime,
      weekStartsOn: input.userDay.weekStartsOn,
    },
    plan: {
      coverage: input.plan.occurrences.length === 0 ? "knownEmpty" : "available",
      batchId: input.plan.batchId,
      publishedAt: input.plan.publishedAt,
      durability: input.plan.durability,
    },
    executionCoverage: input.execution.coverage,
    allDay,
    timingUnavailableLegacy,
    timed,
    current,
    next,
    later,
    elapsed,
    planAttention,
  });
}

function buildExecutionByReference(
  execution: BuildTodayReadModelInput["execution"],
): Map<string, TodayExecutionState> {
  const result = new Map<string, TodayExecutionState>();
  if (execution.coverage !== "available") return result;
  for (const item of execution.items) {
    if (item.subject.kind !== "planned") continue;
    const key = referenceKey(item.subject.reference);
    result.set(
      key,
      item.currentOutcome.status === "unknown"
        ? { coverage: "available", status: "notReported" }
        : {
            coverage: "available",
            status: item.currentOutcome.status,
            record: structuredClone(item.currentOutcome.record),
          },
    );
  }
  return result;
}

function unavailableOrNotReported(
  coverage: BuildTodayReadModelInput["execution"]["coverage"],
): TodayExecutionState {
  return coverage === "available" ? { coverage: "available", status: "notReported" } : { coverage };
}

function cloneExecutionState(value: TodayExecutionState): TodayExecutionState {
  return value.coverage === "available" && value.status !== "notReported"
    ? { ...value, record: structuredClone(value.record) }
    : { ...value };
}

function compareTimed(left: TodayTimedOccurrence, right: TodayTimedOccurrence): number {
  const leftPlan = left.occurrence.plan;
  const rightPlan = right.occurrence.plan;
  if (leftPlan.state !== "scheduled" || rightPlan.state !== "scheduled") return 0;
  return (
    leftPlan.startsAt.localeCompare(rightPlan.startsAt) ||
    leftPlan.endsAt.localeCompare(rightPlan.endsAt) ||
    referenceKey(left.occurrence.reference).localeCompare(referenceKey(right.occurrence.reference))
  );
}

function compareUntimed(left: TodayOccurrence, right: TodayOccurrence): number {
  return compareSnapshot(left.occurrence, right.occurrence);
}

function compareSnapshot(
  left: HistoricalPlannedOccurrenceSnapshot,
  right: HistoricalPlannedOccurrenceSnapshot,
): number {
  return (
    referenceKey(left.reference).localeCompare(referenceKey(right.reference)) ||
    left.title.localeCompare(right.title)
  );
}

function referenceKey(reference: DurableOccurrenceReference): string {
  const value = reference;
  if (value.sourceKind === "manualEvent")
    return `manualEvent|${value.manualEvent.id}|${value.manualEvent.incarnationId}`;
  if (value.sourceKind === "work")
    return [
      "work",
      value.cycle.id,
      value.cycle.incarnationId,
      value.entry.kind,
      value.entry.id,
      value.entry.incarnationId,
      value.shiftDefinition.id,
      value.shiftDefinition.incarnationId,
      value.coordinate.localStartDate,
      value.coordinate.slot,
    ].join("|");
  return [
    "template",
    value.template.id,
    value.template.incarnationId,
    value.recurrence.id,
    value.recurrence.incarnationId,
    value.coordinate.frequency,
    value.coordinate.scopeKind,
    value.coordinate.scopeKind === "userDay"
      ? value.coordinate.userDayDate
      : value.coordinate.userWeekStartDate,
    value.coordinate.slot,
  ].join("|");
}
