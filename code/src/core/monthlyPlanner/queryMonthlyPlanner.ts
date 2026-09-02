import type { BlockCandidate, CommitmentNavigationIdentity } from "../blocks/types.js";
import type { ActiveManualCalendarEvent, DayFramePreview } from "../../state/types.js";
import type { ShiftCycle } from "../cycles/types.js";
import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../cycles/resolveEffectiveSchedulePreferences.js";
import type { FrictionPoint, FrictionSeverity } from "../friction/types.js";
import type { LocalDateString } from "../shifts/types.js";
import {
  addUserDayLabels,
  resolveUserDayContainingInstant,
  resolveUserDayWindowForLabel,
} from "../time/canonicalUserDay.js";
import type { TimeString, UserTimePreferences, Weekday } from "../time/types.js";
import { formatLocalDate, parseTimeString } from "../time/userDay.js";

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const satisfies readonly Weekday[];

export type DisplayedMonth = `${number}-${number}`;
export type MonthMembership = "previous" | "displayed" | "next";
export type MonthlyPlannerCoverage =
  | { kind: "coveredFresh"; generatedEmpty: boolean }
  | { kind: "coveredStale"; generatedEmpty: boolean }
  | { kind: "uncovered" };

export type CommitmentTarget = {
  kind: "commitment";
  templateId: string;
  templateIncarnationId: string;
  recurrenceId: string;
  recurrenceIncarnationId: string;
  availability: "current" | "staleSource";
};

export type EventTarget = {
  kind: "event";
  eventId: string;
  eventIncarnationId: string;
  availability: "current";
};

export type MonthlyPlannerTarget =
  | CommitmentTarget
  | EventTarget
  | { kind: "work" }
  | { kind: "friction"; frictionPointId: string }
  | { kind: "unplaced"; candidateId: string; commitment: CommitmentTarget | null }
  | { kind: "unavailableEvidence"; reason: "missingExactCommitmentIdentity" };

export type MonthlyPlannerEvidence = {
  id: string;
  kind: "allDayEvent" | "timedEvent" | "work" | "commitment" | "sleep" | "attention";
  title: string;
  startsAt: Date | null;
  endsAt: Date | null;
  target: MonthlyPlannerTarget;
};

export type MonthlyPlannerCell = {
  id: LocalDateString;
  label: LocalDateString;
  membership: MonthMembership;
  isInDisplayedMonth: boolean;
  isCurrentUserDay: boolean;
  canonical: {
    start: Date;
    end: Date;
    durationMinutes: number;
    dayBoundaryStartTime: TimeString;
    weekStartsOn: Weekday;
  };
  coverage: MonthlyPlannerCoverage;
  evidence: MonthlyPlannerEvidence[];
  tokens: MonthlyPlannerEvidence[];
  counts: {
    allDayEvents: number;
    timedEvents: number;
    work: number;
    commitments: number;
    sleep: number;
    friction: number;
    unplaced: number;
  };
  friction: MonthlyPlannerFriction[];
  unplaced: MonthlyPlannerUnplaced[];
};

export type MonthlyPlannerFriction = {
  id: string;
  title: string;
  message: string;
  severity: FrictionSeverity;
  resolutionOptions: Array<{ id: string; label: string }>;
  target: Extract<MonthlyPlannerTarget, { kind: "friction" }>;
};

export type MonthlyPlannerUnplaced = {
  id: string;
  title: string;
  userDayDate: LocalDateString;
  target: Extract<MonthlyPlannerTarget, { kind: "unplaced" }>;
};

export type MonthlyPlannerSelectedDay = {
  label: LocalDateString;
  isInDisplayedMonth: boolean;
  isCurrentUserDay: boolean;
  canonical: MonthlyPlannerCell["canonical"];
  coverage: MonthlyPlannerCoverage;
  occurrences: MonthlyPlannerEvidence[];
  friction: MonthlyPlannerFriction[];
  unplaced: MonthlyPlannerUnplaced[];
  weekStartTransition: {
    differsFromDisplayAnchor: boolean;
    displayWeekAnchor: Weekday;
    selectedDayWeekStart: Weekday;
  };
  boundaryTransition: {
    previousBoundaryStartTime: TimeString;
    currentBoundaryStartTime: TimeString;
    nextBoundaryStartTime: TimeString;
    differsFromPrevious: boolean;
    differsFromNext: boolean;
  };
};

export type MonthlyPlannerReadModel = {
  displayedMonth: { id: DisplayedMonth; year: number; month: number };
  displayWeekAnchor: Weekday;
  weekdayColumns: Array<{ weekday: Weekday; index: number }>;
  gridStartLabel: LocalDateString;
  gridEndLabel: LocalDateString;
  cells: MonthlyPlannerCell[];
  currentUserDayLabel: LocalDateString;
  selectedDay: MonthlyPlannerSelectedDay | null;
  planningRange: { startDate: LocalDateString; endDate: LocalDateString };
  status: "noCoverage" | "partialCoverage" | "fullyCoveredFresh" | "fullyCoveredStale";
  coverageSummary: { coveredFresh: number; coveredStale: number; uncovered: number };
  attention: { frictionCount: number; unplacedCount: number; hasStaleCoverage: boolean };
};

export type MonthlyPlannerQueryInput = {
  displayedMonth: DisplayedMonth | string;
  selectedLabel?: LocalDateString | string | null;
  evaluationInstant: Date;
  temporal: {
    defaultSchedulingPreferences: UserTimePreferences;
    shiftCycles: ShiftCycle[];
  };
  planningRange: { startDate: LocalDateString; endDate: LocalDateString };
  preview: DayFramePreview | null;
  manualEvents: ActiveManualCalendarEvent[];
  currentCommitmentSources: {
    templates: Array<{ id: string; incarnationId: string }>;
    recurrences: Array<{ id: string; incarnationId: string }>;
  };
  availability?: "available" | "protected" | "unavailable";
};

export type MonthlyPlannerQueryResult =
  | { kind: "available"; model: MonthlyPlannerReadModel }
  | { kind: "invalidQuery"; reason: string }
  | { kind: "protected"; reason: "planningAuthorityProtected" }
  | { kind: "unavailable"; reason: "planningAuthorityUnavailable" };

type IndexedEvidence = {
  work: Map<LocalDateString, MonthlyPlannerEvidence[]>;
  commitments: Map<LocalDateString, MonthlyPlannerEvidence[]>;
  events: Map<LocalDateString, MonthlyPlannerEvidence[]>;
  friction: Map<LocalDateString, MonthlyPlannerFriction[]>;
  unplaced: Map<LocalDateString, MonthlyPlannerUnplaced[]>;
  unresolvedFrictionCount: number;
};

export function queryMonthlyPlanner(input: MonthlyPlannerQueryInput): MonthlyPlannerQueryResult {
  if (input.availability === "protected")
    return { kind: "protected", reason: "planningAuthorityProtected" };
  if (input.availability === "unavailable")
    return { kind: "unavailable", reason: "planningAuthorityUnavailable" };

  try {
    const displayed = parseDisplayedMonth(input.displayedMonth);
    const selectedLabel =
      input.selectedLabel === undefined || input.selectedLabel === null
        ? null
        : validateLocalDate(input.selectedLabel);
    if (
      !(input.evaluationInstant instanceof Date) ||
      Number.isNaN(input.evaluationInstant.getTime())
    )
      throw new RangeError("evaluationInstant must be a valid Date");
    const planningStart = validateLocalDate(input.planningRange.startDate);
    const planningEnd = validateLocalDate(input.planningRange.endDate);
    if (planningStart > planningEnd)
      throw new RangeError("planningRange start must not exceed end");
    validatePreview(input.preview);

    const resolverInput = {
      shiftCycles: input.temporal.shiftCycles,
      defaultSchedulingPreferences: input.temporal.defaultSchedulingPreferences,
    };
    const firstMonthLabel = `${displayed.id}-01` as LocalDateString;
    const displayWeekAnchor = resolveEffectiveSchedulePreferencesForUserDayDate({
      ...resolverInput,
      userDayDate: firstMonthLabel,
    }).weekStartsOn;
    const weekdayColumns = buildWeekdayColumns(displayWeekAnchor);
    const gridLabels = buildGridLabels(displayed, displayWeekAnchor);
    const visibleLabels = new Set(gridLabels);
    if (selectedLabel) visibleLabels.add(selectedLabel);
    const exactSources = buildExactSourceIndexes(input);
    const indexed = indexEvidence(input, visibleLabels, exactSources);
    const currentUserDayLabel = resolveUserDayContainingInstant({
      ...resolverInput,
      instant: new Date(input.evaluationInstant),
    }).userDayDate;
    const windowCache = new Map<LocalDateString, MonthlyPlannerCell["canonical"]>();
    const resolveCanonical = (label: LocalDateString): MonthlyPlannerCell["canonical"] => {
      const cached = windowCache.get(label);
      if (cached) return cached;
      const window = resolveUserDayWindowForLabel({ ...resolverInput, userDayDate: label });
      const canonical = {
        start: new Date(window.start),
        end: new Date(window.end),
        durationMinutes: window.durationMinutes,
        dayBoundaryStartTime: window.dayBoundaryStartTime,
        weekStartsOn: window.weekStartsOn,
      };
      windowCache.set(label, canonical);
      return canonical;
    };

    const cells = gridLabels.map((label) => {
      const evidence = sortEvidence([
        ...(indexed.events.get(label) ?? []),
        ...(indexed.work.get(label) ?? []),
        ...(indexed.commitments.get(label) ?? []),
      ]);
      const friction = sortFriction(indexed.friction.get(label) ?? []);
      const unplaced = sortUnplaced(indexed.unplaced.get(label) ?? []);
      const attentionTokens = friction.map<MonthlyPlannerEvidence>((item) => ({
        id: `attention:${item.id}`,
        kind: "attention",
        title: item.title,
        startsAt: null,
        endsAt: null,
        target: { ...item.target },
      }));
      const coverage = classifyCoverage(
        input.preview,
        label,
        evidence.length,
        friction.length,
        unplaced.length,
      );
      const membership = getMembership(label, displayed.id);
      return {
        id: label,
        label,
        membership,
        isInDisplayedMonth: membership === "displayed",
        isCurrentUserDay: label === currentUserDayLabel,
        canonical: cloneCanonical(resolveCanonical(label)),
        coverage,
        evidence: evidence.map(cloneEvidence),
        tokens: [...evidence, ...attentionTokens].map(cloneEvidence),
        counts: {
          allDayEvents: evidence.filter((item) => item.kind === "allDayEvent").length,
          timedEvents: evidence.filter((item) => item.kind === "timedEvent").length,
          work: evidence.filter((item) => item.kind === "work").length,
          commitments: evidence.filter((item) => item.kind === "commitment").length,
          sleep: evidence.filter((item) => item.kind === "sleep").length,
          friction: friction.length,
          unplaced: unplaced.length,
        },
        friction: friction.map(cloneFriction),
        unplaced: unplaced.map(cloneUnplaced),
      } satisfies MonthlyPlannerCell;
    });

    const displayedCells = cells.filter((cell) => cell.isInDisplayedMonth);
    const coverageSummary = countCoverage(displayedCells);
    const status = summarizeStatus(coverageSummary);
    const selectedCell = selectedLabel
      ? cells.find((cell) => cell.label === selectedLabel)
      : undefined;
    const selectedDay = selectedLabel
      ? buildSelectedDay({
          label: selectedLabel,
          cell: selectedCell,
          displayed,
          displayWeekAnchor,
          currentUserDayLabel,
          preview: input.preview,
          indexed,
          resolveCanonical,
          resolverInput,
        })
      : null;

    return {
      kind: "available",
      model: {
        displayedMonth: { ...displayed },
        displayWeekAnchor,
        weekdayColumns: weekdayColumns.map((column) => ({ ...column })),
        gridStartLabel: gridLabels[0]!,
        gridEndLabel: gridLabels.at(-1)!,
        cells,
        currentUserDayLabel,
        selectedDay,
        planningRange: { startDate: planningStart, endDate: planningEnd },
        status,
        coverageSummary,
        attention: {
          frictionCount:
            displayedCells.reduce((sum, cell) => sum + cell.friction.length, 0) +
            indexed.unresolvedFrictionCount,
          unplacedCount: displayedCells.reduce((sum, cell) => sum + cell.unplaced.length, 0),
          hasStaleCoverage: coverageSummary.coveredStale > 0,
        },
      },
    };
  } catch (error) {
    return {
      kind: "invalidQuery",
      reason: error instanceof Error ? error.message : "Invalid query",
    };
  }
}

export function takeMonthlyPlannerTokens(
  tokens: readonly MonthlyPlannerEvidence[],
  limit: number,
): { visible: MonthlyPlannerEvidence[]; overflowCount: number } {
  if (!Number.isInteger(limit) || limit < 0)
    throw new RangeError("limit must be a non-negative integer");
  return {
    visible: tokens.slice(0, limit).map(cloneEvidence),
    overflowCount: Math.max(0, tokens.length - limit),
  };
}

export function shiftDisplayedMonth(
  month: DisplayedMonth | string,
  offset: number,
): DisplayedMonth {
  if (!Number.isInteger(offset)) throw new RangeError("offset must be an integer");
  const parsed = parseDisplayedMonth(month);
  const date = new Date(parsed.year, parsed.month - 1 + offset, 1, 12);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` as DisplayedMonth;
}

export function projectLabelToDisplayedMonth(
  label: LocalDateString | string,
  displayedMonth: DisplayedMonth | string,
): LocalDateString {
  const source = parseLocalDate(validateLocalDate(label));
  const target = parseDisplayedMonth(displayedMonth);
  const lastDay = new Date(target.year, target.month, 0, 12).getDate();
  return `${target.id}-${String(Math.min(source.getDate(), lastDay)).padStart(2, "0")}` as LocalDateString;
}

function parseDisplayedMonth(value: string): { id: DisplayedMonth; year: number; month: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError(`Invalid displayed month: ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isInteger(year) || year < 1 || year > 9999 || month < 1 || month > 12)
    throw new RangeError(`Invalid displayed month: ${value}`);
  return { id: value as DisplayedMonth, year, month };
}

function validateLocalDate(value: string): LocalDateString {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError(`Invalid local date: ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12);
  if (formatLocalDate(date) !== value) throw new RangeError(`Invalid local date: ${value}`);
  return value as LocalDateString;
}

function parseLocalDate(label: LocalDateString): Date {
  const [year, month, day] = label.split("-").map(Number);
  return new Date(year!, month! - 1, day!, 12);
}

function buildWeekdayColumns(anchor: Weekday): Array<{ weekday: Weekday; index: number }> {
  const start = WEEKDAYS.indexOf(anchor);
  return Array.from({ length: 7 }, (_, index) => ({
    weekday: WEEKDAYS[(start + index) % 7]!,
    index,
  }));
}

function buildGridLabels(
  displayed: { year: number; month: number },
  anchor: Weekday,
): LocalDateString[] {
  const first = new Date(displayed.year, displayed.month - 1, 1, 12);
  const lastDay = new Date(displayed.year, displayed.month, 0, 12).getDate();
  const leading = (first.getDay() - WEEKDAYS.indexOf(anchor) + 7) % 7;
  const rows = leading + lastDay <= 35 ? 5 : 6;
  const start = new Date(first);
  start.setDate(start.getDate() - leading);
  return Array.from({ length: rows * 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + index);
    return formatLocalDate(date) as LocalDateString;
  });
}

function getMembership(label: LocalDateString, displayedMonth: DisplayedMonth): MonthMembership {
  const month = label.slice(0, 7);
  return month === displayedMonth ? "displayed" : month < displayedMonth ? "previous" : "next";
}

function validatePreview(preview: DayFramePreview | null): void {
  if (!preview) return;
  const start = validateLocalDate(preview.rangeStartDate);
  const end = validateLocalDate(preview.rangeEndDate);
  if (start > end) throw new RangeError("Preview range start must not exceed end");
}

function buildExactSourceIndexes(input: MonthlyPlannerQueryInput) {
  return {
    templates: new Map(
      input.currentCommitmentSources.templates.map((source) => [source.id, source.incarnationId]),
    ),
    recurrences: new Map(
      input.currentCommitmentSources.recurrences.map((source) => [source.id, source.incarnationId]),
    ),
  };
}

function indexEvidence(
  input: MonthlyPlannerQueryInput,
  visibleLabels: Set<LocalDateString>,
  exactSources: ReturnType<typeof buildExactSourceIndexes>,
): IndexedEvidence {
  const work = new Map<LocalDateString, MonthlyPlannerEvidence[]>();
  const commitments = new Map<LocalDateString, MonthlyPlannerEvidence[]>();
  const events = new Map<LocalDateString, MonthlyPlannerEvidence[]>();
  const friction = new Map<LocalDateString, MonthlyPlannerFriction[]>();
  const unplaced = new Map<LocalDateString, MonthlyPlannerUnplaced[]>();
  const blockDays = new Map<string, Set<LocalDateString>>();
  const pushBlockDay = (id: string, day: LocalDateString) => {
    const days = blockDays.get(id) ?? new Set<LocalDateString>();
    days.add(day);
    blockDays.set(id, days);
  };

  for (const block of input.preview?.result.generatedWorkBlocks ?? []) {
    pushBlockDay(block.id, block.userDayDate);
    if (!visibleLabels.has(block.userDayDate)) continue;
    pushMap(work, block.userDayDate, {
      id: `work:${stableOccurrenceId(block)}`,
      kind: "work",
      title: block.title,
      startsAt: new Date(block.startsAt),
      endsAt: new Date(block.endsAt),
      target: { kind: "work" },
    });
  }

  for (const block of input.preview?.result.scheduledBlocks ?? []) {
    pushBlockDay(block.id, block.userDayDate);
    if (block.source === "manual" || !visibleLabels.has(block.userDayDate)) continue;
    const target = commitmentTarget(block.commitmentNavigationIdentity, exactSources) ?? {
      kind: "unavailableEvidence" as const,
      reason: "missingExactCommitmentIdentity" as const,
    };
    pushMap(commitments, block.userDayDate, {
      id: `commitment:${stableOccurrenceId(block)}`,
      kind: block.category === "sleep" ? "sleep" : "commitment",
      title: block.title,
      startsAt: new Date(block.startsAt),
      endsAt: new Date(block.endsAt),
      target,
    });
  }

  for (const event of input.manualEvents) {
    if (!visibleLabels.has(event.userDayDate)) continue;
    const geometry = eventGeometry(event, input.temporal);
    pushMap(events, event.userDayDate, {
      id: `event:${event.id}:${event.incarnationId}`,
      kind: event.allDay ? "allDayEvent" : "timedEvent",
      title: event.title,
      startsAt: geometry.start,
      endsAt: geometry.end,
      target: {
        kind: "event",
        eventId: event.id,
        eventIncarnationId: event.incarnationId,
        availability: "current",
      },
    });
  }

  for (const candidate of input.preview?.result.unplacedCandidates ?? []) {
    pushBlockDay(candidate.id, candidate.userDayDate);
    if (!visibleLabels.has(candidate.userDayDate)) continue;
    const item = projectUnplaced(candidate, exactSources);
    pushMap(unplaced, candidate.userDayDate, item);
  }

  let unresolvedFrictionCount = 0;
  for (const point of input.preview?.result.frictionPoints ?? []) {
    if (point.ignored || point.resolved) continue;
    const owner = resolveFrictionOwner(point, blockDays);
    if (!owner) {
      const hasVisibleParticipant = point.affectedBlockIds.some((id) =>
        [...(blockDays.get(id) ?? [])].some((day) => visibleLabels.has(day)),
      );
      if (hasVisibleParticipant) unresolvedFrictionCount += 1;
      continue;
    }
    if (!visibleLabels.has(owner)) {
      continue;
    }
    pushMap(friction, owner, {
      id: point.id,
      title: point.title,
      message: point.message,
      severity: point.severity,
      resolutionOptions: point.suggestedFixes.map((fix) => ({ id: fix.id, label: fix.label })),
      target: { kind: "friction", frictionPointId: point.id },
    });
  }
  return { work, commitments, events, friction, unplaced, unresolvedFrictionCount };
}

function eventGeometry(
  event: ActiveManualCalendarEvent,
  temporal: MonthlyPlannerQueryInput["temporal"],
): { start: Date; end: Date } {
  const window = resolveUserDayWindowForLabel({
    shiftCycles: temporal.shiftCycles,
    defaultSchedulingPreferences: temporal.defaultSchedulingPreferences,
    userDayDate: event.userDayDate,
  });
  if (event.allDay) return { start: new Date(window.start), end: new Date(window.end) };
  if (!event.startTime || !event.endTime)
    throw new RangeError(`Timed Event ${event.id} must have startTime and endTime`);
  const start = dateAtTime(event.userDayDate, event.startTime, false);
  const end = dateAtTime(event.userDayDate, event.endTime, event.endTime <= event.startTime);
  return { start, end };
}

function dateAtTime(label: LocalDateString, time: TimeString, nextDay: boolean): Date {
  const date = parseLocalDate(label);
  const parsed = parseTimeString(time);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + (nextDay ? 1 : 0),
    parsed.hours,
    parsed.minutes,
  );
}

function commitmentTarget(
  identity: CommitmentNavigationIdentity | undefined,
  indexes: ReturnType<typeof buildExactSourceIndexes>,
): CommitmentTarget | null {
  if (!identity) return null;
  const current =
    indexes.templates.get(identity.templateId) === identity.templateIncarnationId &&
    indexes.recurrences.get(identity.recurrenceId) === identity.recurrenceIncarnationId;
  return {
    kind: "commitment",
    ...identity,
    availability: current ? "current" : "staleSource",
  };
}

function projectUnplaced(
  candidate: BlockCandidate,
  exactSources: ReturnType<typeof buildExactSourceIndexes>,
): MonthlyPlannerUnplaced {
  const commitment = commitmentTarget(candidate.commitmentNavigationIdentity, exactSources);
  return {
    id: candidate.id,
    title: candidate.title,
    userDayDate: candidate.userDayDate,
    target: { kind: "unplaced", candidateId: candidate.id, commitment },
  };
}

function resolveFrictionOwner(
  point: FrictionPoint,
  blockDays: Map<string, Set<LocalDateString>>,
): LocalDateString | null {
  if (point.affectedUserDayDate) return point.affectedUserDayDate;
  const days = new Set(point.affectedBlockIds.flatMap((id) => [...(blockDays.get(id) ?? [])]));
  return days.size === 1 ? [...days][0]! : null;
}

function stableOccurrenceId(block: {
  id: string;
  occurrenceIdentity?: object;
  commitmentNavigationIdentity?: CommitmentNavigationIdentity;
}): string {
  if (block.commitmentNavigationIdentity) {
    const value = block.commitmentNavigationIdentity;
    return `${value.templateId}:${value.templateIncarnationId}:${value.recurrenceId}:${value.recurrenceIncarnationId}:${block.id}`;
  }
  if (block.occurrenceIdentity) return `${stableSerialize(block.occurrenceIdentity)}:${block.id}`;
  return block.id;
}

function stableSerialize(value: object): string {
  return Object.entries(value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => `${key}=${String(item)}`)
    .join("|");
}

function pushMap<T>(map: Map<LocalDateString, T[]>, label: LocalDateString, value: T): void {
  const values = map.get(label) ?? [];
  values.push(value);
  map.set(label, values);
}

function classifyCoverage(
  preview: DayFramePreview | null,
  label: LocalDateString,
  evidenceCount: number,
  frictionCount: number,
  unplacedCount: number,
): MonthlyPlannerCoverage {
  if (!preview || label < preview.rangeStartDate || label > preview.rangeEndDate)
    return { kind: "uncovered" };
  return {
    kind: preview.isStale ? "coveredStale" : "coveredFresh",
    generatedEmpty: evidenceCount === 0 && frictionCount === 0 && unplacedCount === 0,
  };
}

function evidenceRank(kind: MonthlyPlannerEvidence["kind"]): number {
  return { allDayEvent: 0, timedEvent: 1, work: 2, commitment: 3, sleep: 3, attention: 4 }[kind];
}

function sortEvidence(values: readonly MonthlyPlannerEvidence[]): MonthlyPlannerEvidence[] {
  return values
    .map(cloneEvidence)
    .sort(
      (left, right) =>
        evidenceRank(left.kind) - evidenceRank(right.kind) ||
        compareNullableDates(left.startsAt, right.startsAt) ||
        compareNullableDates(left.endsAt, right.endsAt) ||
        left.kind.localeCompare(right.kind) ||
        left.title.localeCompare(right.title) ||
        left.id.localeCompare(right.id),
    );
}

function compareNullableDates(left: Date | null, right: Date | null): number {
  return (left?.getTime() ?? -Infinity) - (right?.getTime() ?? -Infinity);
}

function sortFriction(values: readonly MonthlyPlannerFriction[]): MonthlyPlannerFriction[] {
  const rank: Record<FrictionSeverity, number> = { critical: 0, warning: 1, info: 2 };
  return values
    .map(cloneFriction)
    .sort(
      (left, right) =>
        rank[left.severity] - rank[right.severity] ||
        left.title.localeCompare(right.title) ||
        left.id.localeCompare(right.id),
    );
}

function sortUnplaced(values: readonly MonthlyPlannerUnplaced[]): MonthlyPlannerUnplaced[] {
  return values
    .map(cloneUnplaced)
    .sort(
      (left, right) => left.title.localeCompare(right.title) || left.id.localeCompare(right.id),
    );
}

function countCoverage(cells: readonly MonthlyPlannerCell[]) {
  return cells.reduce(
    (counts, cell) => {
      if (cell.coverage.kind === "coveredFresh") counts.coveredFresh += 1;
      else if (cell.coverage.kind === "coveredStale") counts.coveredStale += 1;
      else counts.uncovered += 1;
      return counts;
    },
    { coveredFresh: 0, coveredStale: 0, uncovered: 0 },
  );
}

function summarizeStatus(
  summary: MonthlyPlannerReadModel["coverageSummary"],
): MonthlyPlannerReadModel["status"] {
  if (summary.coveredFresh === 0 && summary.coveredStale === 0) return "noCoverage";
  if (summary.uncovered > 0) return "partialCoverage";
  return summary.coveredStale > 0 ? "fullyCoveredStale" : "fullyCoveredFresh";
}

function buildSelectedDay(input: {
  label: LocalDateString;
  cell: MonthlyPlannerCell | undefined;
  displayed: { id: DisplayedMonth };
  displayWeekAnchor: Weekday;
  currentUserDayLabel: LocalDateString;
  preview: DayFramePreview | null;
  indexed: IndexedEvidence;
  resolveCanonical: (label: LocalDateString) => MonthlyPlannerCell["canonical"];
  resolverInput: { shiftCycles: ShiftCycle[]; defaultSchedulingPreferences: UserTimePreferences };
}): MonthlyPlannerSelectedDay {
  const canonical = input.resolveCanonical(input.label);
  const previous = resolveEffectiveSchedulePreferencesForUserDayDate({
    ...input.resolverInput,
    userDayDate: addUserDayLabels(input.label, -1),
  });
  const next = resolveEffectiveSchedulePreferencesForUserDayDate({
    ...input.resolverInput,
    userDayDate: addUserDayLabels(input.label, 1),
  });
  const occurrences = input.cell
    ? input.cell.evidence.map(cloneEvidence)
    : sortEvidence([
        ...(input.indexed.events.get(input.label) ?? []),
        ...(input.indexed.work.get(input.label) ?? []),
        ...(input.indexed.commitments.get(input.label) ?? []),
      ]);
  const friction = input.cell
    ? input.cell.friction.map(cloneFriction)
    : sortFriction(input.indexed.friction.get(input.label) ?? []);
  const unplaced = input.cell
    ? input.cell.unplaced.map(cloneUnplaced)
    : sortUnplaced(input.indexed.unplaced.get(input.label) ?? []);
  return {
    label: input.label,
    isInDisplayedMonth: input.label.slice(0, 7) === input.displayed.id,
    isCurrentUserDay: input.label === input.currentUserDayLabel,
    canonical: cloneCanonical(canonical),
    coverage:
      input.cell?.coverage ??
      classifyCoverage(
        input.preview,
        input.label,
        occurrences.length,
        friction.length,
        unplaced.length,
      ),
    occurrences,
    friction,
    unplaced,
    weekStartTransition: {
      differsFromDisplayAnchor: canonical.weekStartsOn !== input.displayWeekAnchor,
      displayWeekAnchor: input.displayWeekAnchor,
      selectedDayWeekStart: canonical.weekStartsOn,
    },
    boundaryTransition: {
      previousBoundaryStartTime: previous.dayBoundaryStartTime,
      currentBoundaryStartTime: canonical.dayBoundaryStartTime,
      nextBoundaryStartTime: next.dayBoundaryStartTime,
      differsFromPrevious: previous.dayBoundaryStartTime !== canonical.dayBoundaryStartTime,
      differsFromNext: next.dayBoundaryStartTime !== canonical.dayBoundaryStartTime,
    },
  };
}

function cloneCanonical(value: MonthlyPlannerCell["canonical"]): MonthlyPlannerCell["canonical"] {
  return { ...value, start: new Date(value.start), end: new Date(value.end) };
}

function cloneEvidence(value: MonthlyPlannerEvidence): MonthlyPlannerEvidence {
  return {
    ...value,
    startsAt: value.startsAt ? new Date(value.startsAt) : null,
    endsAt: value.endsAt ? new Date(value.endsAt) : null,
    target: cloneTarget(value.target),
  };
}

function cloneTarget(value: MonthlyPlannerTarget): MonthlyPlannerTarget {
  if (value.kind === "unplaced") {
    return {
      ...value,
      commitment: value.commitment ? { ...value.commitment } : null,
    };
  }
  return { ...value };
}

function cloneFriction(value: MonthlyPlannerFriction): MonthlyPlannerFriction {
  return {
    ...value,
    resolutionOptions: value.resolutionOptions.map((option) => ({ ...option })),
    target: { ...value.target },
  };
}

function cloneUnplaced(value: MonthlyPlannerUnplaced): MonthlyPlannerUnplaced {
  return { ...value, target: cloneTarget(value.target) as MonthlyPlannerUnplaced["target"] };
}
