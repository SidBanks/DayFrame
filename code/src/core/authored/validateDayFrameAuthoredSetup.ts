import { validateBlockTemplate } from "../blocks/validateBlockTemplate.js";
import type { BlockRecurrence, RecurrenceFrequency } from "../blocks/types.js";
import type { ShiftCycle } from "../cycles/types.js";
import { parseTimeString } from "../time/userDay.js";
import type { Weekday } from "../time/types.js";
import type { DayFrameAuthoredPattern } from "../../state/types.js";

export type AuthoredSnapshotIssueClassification = "invalid" | "unsupported";

export type AuthoredSnapshotIssueCode =
  | "duplicateSourceId"
  | "duplicateWorkEntryId"
  | "emptySourceId"
  | "invalidShiftDefinition"
  | "missingSourceReference"
  | "cycleContainmentMismatch"
  | "invalidCycle"
  | "overlappingCycle"
  | "invalidSegment"
  | "overlappingSegment"
  | "invalidSequence"
  | "invalidTemplate"
  | "invalidRecurrence"
  | "unsupportedRecurrenceFrequency"
  | "invalidSchedulingPreference"
  | "invalidPreviewRange"
  | "invalidManualEvent";

export type AuthoredSnapshotIssue = {
  code: AuthoredSnapshotIssueCode;
  classification: AuthoredSnapshotIssueClassification;
  path: string;
  sourceKind: string;
  sourceId?: string;
  referenceId?: string;
};

export type AuthoredSnapshotValidationResult =
  | { status: "valid"; advisories: AuthoredSnapshotIssue[] }
  | {
      status: "invalid";
      issues: AuthoredSnapshotIssue[];
      advisories: AuthoredSnapshotIssue[];
    };

const WEEKDAYS: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const RECURRENCE_FREQUENCIES: RecurrenceFrequency[] = [
  "daily",
  "weekly",
  "specificWeekdays",
  "timesPerUserWeek",
  "perShiftSegment",
  "custom",
];

export function validateDayFrameAuthoredSetup(
  authoredSetup: DayFrameAuthoredPattern,
): AuthoredSnapshotValidationResult {
  const issues: AuthoredSnapshotIssue[] = [];
  const advisories: AuthoredSnapshotIssue[] = [];

  validateTopLevelIds(authoredSetup, issues);
  validateSchedulingPreferences(authoredSetup, issues);
  validatePreviewRange(authoredSetup, issues);
  validateShiftDefinitions(authoredSetup, issues);
  validateShiftCycles(authoredSetup, issues);
  validateTemplates(authoredSetup, issues);
  validateRecurrences(authoredSetup, issues, advisories);
  validateManualEvents(authoredSetup, issues);

  return issues.length === 0
    ? { status: "valid", advisories }
    : { status: "invalid", issues, advisories };
}

function validateTopLevelIds(
  setup: DayFrameAuthoredPattern,
  issues: AuthoredSnapshotIssue[],
): void {
  validateUniqueIds(setup.shiftDefinitions, "shiftDefinitions", "shiftDefinition", issues);
  validateUniqueIds(setup.shiftCycles, "shiftCycles", "shiftCycle", issues);
  validateUniqueIds(setup.blockTemplates, "blockTemplates", "blockTemplate", issues);
  validateUniqueIds(setup.blockRecurrences, "blockRecurrences", "blockRecurrence", issues);
  validateUniqueIds(setup.manualEvents, "manualEvents", "manualEvent", issues);
}

function validateUniqueIds(
  sources: Array<{ id: string }>,
  path: string,
  sourceKind: string,
  issues: AuthoredSnapshotIssue[],
): void {
  const seenIds = new Set<string>();

  sources.forEach((source, index) => {
    if (typeof source.id !== "string" || source.id.trim() === "") {
      issues.push(issue("emptySourceId", `${path}[${index}].id`, sourceKind, source.id));
      return;
    }

    if (seenIds.has(source.id)) {
      issues.push(issue("duplicateSourceId", `${path}[${index}].id`, sourceKind, source.id));
    }

    seenIds.add(source.id);
  });
}

function validateSchedulingPreferences(
  setup: DayFrameAuthoredPattern,
  issues: AuthoredSnapshotIssue[],
): void {
  if (!isValidTime(setup.schedulingPreferences.dayBoundaryStartTime)) {
    issues.push(
      issue(
        "invalidSchedulingPreference",
        "schedulingPreferences.dayBoundaryStartTime",
        "schedulingPreferences",
      ),
    );
  }

  if (!WEEKDAYS.includes(setup.schedulingPreferences.weekStartsOn)) {
    issues.push(
      issue(
        "invalidSchedulingPreference",
        "schedulingPreferences.weekStartsOn",
        "schedulingPreferences",
      ),
    );
  }
}

function validatePreviewRange(
  setup: DayFrameAuthoredPattern,
  issues: AuthoredSnapshotIssue[],
): void {
  const range = setup.previewRange;
  const validPresets = ["threeDays", "oneWeek", "twoWeeks", "oneMonth", "custom"];
  const validSources = ["preset", "custom", "cycle"];

  if (
    !validPresets.includes(range.preset) ||
    (range.source !== undefined && !validSources.includes(range.source)) ||
    !isValidLocalDate(range.startDate) ||
    !isValidLocalDate(range.endDate) ||
    range.startDate > range.endDate
  ) {
    issues.push(issue("invalidPreviewRange", "previewRange", "previewRange"));
  }
}

function validateShiftDefinitions(
  setup: DayFrameAuthoredPattern,
  issues: AuthoredSnapshotIssue[],
): void {
  setup.shiftDefinitions.forEach((definition, index) => {
    const start = parseTime(definition.startTime);
    const end = parseTime(definition.endTime);
    const weekdaysValid =
      definition.workDays.length > 0 &&
      definition.workDays.every((weekday) => WEEKDAYS.includes(weekday)) &&
      new Set(definition.workDays).size === definition.workDays.length;
    const crossesMidnight = start !== null && end !== null && end <= start;

    if (
      start === null ||
      end === null ||
      !weekdaysValid ||
      definition.crossesMidnight !== crossesMidnight
    ) {
      issues.push(
        issue(
          "invalidShiftDefinition",
          `shiftDefinitions[${index}]`,
          "shiftDefinition",
          definition.id,
        ),
      );
    }
  });
}

function validateShiftCycles(
  setup: DayFrameAuthoredPattern,
  issues: AuthoredSnapshotIssue[],
): void {
  const definitionIds = new Set(setup.shiftDefinitions.map((definition) => definition.id));

  setup.shiftCycles.forEach((cycle, cycleIndex) => {
    validateCycle(cycle, cycleIndex, definitionIds, issues);
  });

  const orderedCycles = setup.shiftCycles
    .map((cycle, index) => ({ cycle, index }))
    .sort(
      (left, right) =>
        left.cycle.startsOnDate.localeCompare(right.cycle.startsOnDate) ||
        left.cycle.id.localeCompare(right.cycle.id) ||
        left.index - right.index,
    );

  for (let index = 1; index < orderedCycles.length; index += 1) {
    const previous = orderedCycles[index - 1]!;
    const current = orderedCycles[index]!;

    if (
      isValidLocalDate(previous.cycle.startsOnDate) &&
      isValidLocalDate(previous.cycle.endsOnDate ?? previous.cycle.startsOnDate) &&
      isValidLocalDate(current.cycle.startsOnDate) &&
      (previous.cycle.endsOnDate ?? previous.cycle.startsOnDate) >= current.cycle.startsOnDate
    ) {
      issues.push(
        issue("overlappingCycle", `shiftCycles[${current.index}]`, "shiftCycle", current.cycle.id),
      );
    }
  }
}

function validateCycle(
  cycle: ShiftCycle,
  cycleIndex: number,
  definitionIds: Set<string>,
  issues: AuthoredSnapshotIssue[],
): void {
  const cyclePath = `shiftCycles[${cycleIndex}]`;
  const cycleEnd = cycle.endsOnDate ?? cycle.startsOnDate;
  const mode = cycle.mode ?? "manualSegments";

  if (
    cycle.type !== "fixedSegments" ||
    (mode !== "manualSegments" && mode !== "repeatingSequence") ||
    !isValidLocalDate(cycle.startsOnDate) ||
    !isValidLocalDate(cycleEnd) ||
    cycle.startsOnDate > cycleEnd ||
    (mode === "repeatingSequence" &&
      (!cycle.sequenceAnchorDate ||
        !isValidLocalDate(cycle.sequenceAnchorDate) ||
        cycle.sequenceAnchorDate > cycleEnd ||
        (cycle.sequence ?? []).length === 0))
  ) {
    issues.push(issue("invalidCycle", cyclePath, "shiftCycle", cycle.id));
  }

  validateWorkEntryIds(cycle, cyclePath, issues);
  validateSegments(cycle, cycleIndex, cycleEnd, definitionIds, issues);
  validateSequence(cycle, cycleIndex, definitionIds, issues);
}

function validateWorkEntryIds(
  cycle: ShiftCycle,
  cyclePath: string,
  issues: AuthoredSnapshotIssue[],
): void {
  const seenIds = new Set<string>();
  const entries = [
    ...cycle.segments.map((entry, index) => ({ entry, path: `${cyclePath}.segments[${index}]` })),
    ...(cycle.sequence ?? []).map((entry, index) => ({
      entry,
      path: `${cyclePath}.sequence[${index}]`,
    })),
  ];

  for (const { entry, path } of entries) {
    if (typeof entry.id !== "string" || entry.id.trim() === "") {
      issues.push(issue("emptySourceId", `${path}.id`, "workEntry", entry.id));
      continue;
    }

    if (seenIds.has(entry.id)) {
      issues.push(issue("duplicateWorkEntryId", `${path}.id`, "workEntry", entry.id));
    }

    seenIds.add(entry.id);
  }
}

function validateSegments(
  cycle: ShiftCycle,
  cycleIndex: number,
  cycleEnd: string,
  definitionIds: Set<string>,
  issues: AuthoredSnapshotIssue[],
): void {
  cycle.segments.forEach((segment, segmentIndex) => {
    const path = `shiftCycles[${cycleIndex}].segments[${segmentIndex}]`;

    if (segment.shiftCycleId !== cycle.id) {
      issues.push(
        issue(
          "cycleContainmentMismatch",
          `${path}.shiftCycleId`,
          "shiftSegment",
          segment.id,
          segment.shiftCycleId,
        ),
      );
    }

    if (!definitionIds.has(segment.shiftDefinitionId)) {
      issues.push(
        issue(
          "missingSourceReference",
          `${path}.shiftDefinitionId`,
          "shiftSegment",
          segment.id,
          segment.shiftDefinitionId,
        ),
      );
    }

    if (
      !isValidLocalDate(segment.startsOnDate) ||
      !isValidLocalDate(segment.endsOnDate) ||
      segment.startsOnDate > segment.endsOnDate ||
      segment.startsOnDate < cycle.startsOnDate ||
      segment.endsOnDate > cycleEnd ||
      !isValidScheduleOverride(segment.schedulePreferences)
    ) {
      issues.push(issue("invalidSegment", path, "shiftSegment", segment.id));
    }
  });

  const orderedSegments = cycle.segments
    .map((segment, index) => ({ segment, index }))
    .sort(
      (left, right) =>
        left.segment.startsOnDate.localeCompare(right.segment.startsOnDate) ||
        left.segment.id.localeCompare(right.segment.id) ||
        left.index - right.index,
    );

  for (let index = 1; index < orderedSegments.length; index += 1) {
    const previous = orderedSegments[index - 1]!;
    const current = orderedSegments[index]!;

    if (
      isValidLocalDate(previous.segment.endsOnDate) &&
      isValidLocalDate(current.segment.startsOnDate) &&
      previous.segment.endsOnDate >= current.segment.startsOnDate
    ) {
      issues.push(
        issue(
          "overlappingSegment",
          `shiftCycles[${cycleIndex}].segments[${current.index}]`,
          "shiftSegment",
          current.segment.id,
        ),
      );
    }
  }
}

function validateSequence(
  cycle: ShiftCycle,
  cycleIndex: number,
  definitionIds: Set<string>,
  issues: AuthoredSnapshotIssue[],
): void {
  const sequence = cycle.sequence ?? [];
  const offsets = new Set<number>();
  let offsetsValid = true;

  sequence.forEach((entry, entryIndex) => {
    const path = `shiftCycles[${cycleIndex}].sequence[${entryIndex}]`;

    if (!Number.isInteger(entry.dayOffset) || entry.dayOffset < 0 || offsets.has(entry.dayOffset)) {
      offsetsValid = false;
      issues.push(issue("invalidSequence", `${path}.dayOffset`, "sequenceEntry", entry.id));
    }
    offsets.add(entry.dayOffset);

    if (entry.shiftDefinitionId !== null && !definitionIds.has(entry.shiftDefinitionId)) {
      issues.push(
        issue(
          "missingSourceReference",
          `${path}.shiftDefinitionId`,
          "sequenceEntry",
          entry.id,
          entry.shiftDefinitionId,
        ),
      );
    }
  });

  if (offsetsValid) {
    const sortedOffsets = [...offsets].sort((left, right) => left - right);
    const isContiguous = sortedOffsets.every((offset, index) => offset === index);

    if (!isContiguous) {
      issues.push(
        issue("invalidSequence", `shiftCycles[${cycleIndex}].sequence`, "shiftCycle", cycle.id),
      );
    }
  }
}

function validateTemplates(setup: DayFrameAuthoredPattern, issues: AuthoredSnapshotIssue[]): void {
  setup.blockTemplates.forEach((template, index) => {
    try {
      const result = validateBlockTemplate(template);

      if (!result.isValid) {
        issues.push(
          issue("invalidTemplate", `blockTemplates[${index}]`, "blockTemplate", template.id),
        );
      }
    } catch {
      issues.push(
        issue("invalidTemplate", `blockTemplates[${index}]`, "blockTemplate", template.id),
      );
    }
  });
}

function validateRecurrences(
  setup: DayFrameAuthoredPattern,
  issues: AuthoredSnapshotIssue[],
  advisories: AuthoredSnapshotIssue[],
): void {
  const templateIds = new Set(setup.blockTemplates.map((template) => template.id));

  setup.blockRecurrences.forEach((recurrence, index) => {
    const path = `blockRecurrences[${index}]`;

    if (!templateIds.has(recurrence.blockTemplateId)) {
      issues.push(
        issue(
          "missingSourceReference",
          `${path}.blockTemplateId`,
          "blockRecurrence",
          recurrence.id,
          recurrence.blockTemplateId,
        ),
      );
    }

    if (!RECURRENCE_FREQUENCIES.includes(recurrence.frequency)) {
      issues.push(
        issue("invalidRecurrence", `${path}.frequency`, "blockRecurrence", recurrence.id),
      );
      return;
    }

    if (recurrence.frequency === "perShiftSegment" || recurrence.frequency === "custom") {
      advisories.push({
        ...issue(
          "unsupportedRecurrenceFrequency",
          `${path}.frequency`,
          "blockRecurrence",
          recurrence.id,
        ),
        classification: "unsupported",
      });
    }

    if (!hasValidRecurrenceParameters(recurrence)) {
      issues.push(issue("invalidRecurrence", path, "blockRecurrence", recurrence.id));
    }
  });
}

function hasValidRecurrenceParameters(recurrence: BlockRecurrence): boolean {
  if (
    (recurrence.startsOnDate !== undefined && !isValidLocalDate(recurrence.startsOnDate)) ||
    (recurrence.endsOnDate !== undefined && !isValidLocalDate(recurrence.endsOnDate)) ||
    (recurrence.startsOnDate !== undefined &&
      recurrence.endsOnDate !== undefined &&
      recurrence.startsOnDate > recurrence.endsOnDate)
  ) {
    return false;
  }

  if (recurrence.frequency === "specificWeekdays") {
    return (
      recurrence.weekdays !== undefined &&
      recurrence.weekdays.length > 0 &&
      recurrence.weekdays.every((weekday) => WEEKDAYS.includes(weekday)) &&
      new Set(recurrence.weekdays).size === recurrence.weekdays.length
    );
  }

  if (recurrence.frequency === "timesPerUserWeek") {
    return (
      recurrence.timesPerUserWeek !== undefined &&
      Number.isInteger(recurrence.timesPerUserWeek) &&
      recurrence.timesPerUserWeek > 0
    );
  }

  return true;
}

function validateManualEvents(
  setup: DayFrameAuthoredPattern,
  issues: AuthoredSnapshotIssue[],
): void {
  setup.manualEvents.forEach((event, index) => {
    const timesValid = event.allDay
      ? event.startTime === undefined && event.endTime === undefined
      : isValidTime(event.startTime) && isValidTime(event.endTime);

    if (
      event.title.trim() === "" ||
      !isValidLocalDate(event.userDayDate) ||
      typeof event.allDay !== "boolean" ||
      !timesValid ||
      (event.notes !== undefined && typeof event.notes !== "string")
    ) {
      issues.push(issue("invalidManualEvent", `manualEvents[${index}]`, "manualEvent", event.id));
    }
  });
}

function isValidScheduleOverride(
  value: ShiftCycle["segments"][number]["schedulePreferences"],
): boolean {
  return (
    value === undefined ||
    ((value.dayBoundaryStartTime === undefined || isValidTime(value.dayBoundaryStartTime)) &&
      (value.weekStartsOn === undefined || WEEKDAYS.includes(value.weekStartsOn)))
  );
}

function isValidTime(value: unknown): boolean {
  return typeof value === "string" && parseTime(value) !== null;
}

function parseTime(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return parseTimeString(value as `${number}:${number}`).totalMinutes;
  } catch {
    return null;
  }
}

function isValidLocalDate(value: unknown): value is `${number}-${number}-${number}` {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day));

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month! - 1 && date.getUTCDate() === day
  );
}

function issue(
  code: AuthoredSnapshotIssueCode,
  path: string,
  sourceKind: string,
  sourceId?: string,
  referenceId?: string,
): AuthoredSnapshotIssue {
  return {
    code,
    classification: "invalid",
    path,
    sourceKind,
    ...(sourceId !== undefined ? { sourceId } : {}),
    ...(referenceId !== undefined ? { referenceId } : {}),
  };
}
