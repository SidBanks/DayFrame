import type {
  GeneratedWorkBlock,
  GenerateWorkBlocksInput,
  LocalDateString,
  ShiftDefinition,
} from "./types.js";
import { getWeekdayFromDate } from "../time/userWeek.js";
import { formatLocalDate, getUserDayDate, parseTimeString } from "../time/userDay.js";

export function generateWorkBlocks(input: GenerateWorkBlocksInput): GeneratedWorkBlock[] {
  validatePlanningWindow(input.planningWindowStart, input.planningWindowEnd);
  validateShiftDefinition(input.shiftDefinition);

  const blocks: GeneratedWorkBlock[] = [];
  const currentDate = getCandidateStartDate(input.planningWindowStart);
  const lastDate = getCandidateEndDate(input.planningWindowEnd);

  while (currentDate.getTime() <= lastDate.getTime()) {
    if (input.shiftDefinition.workDays.includes(getWeekdayFromDate(currentDate))) {
      const workBlock = createWorkBlockForDate(
        currentDate,
        input.shiftDefinition,
        input.dayBoundaryStartTime,
      );

      if (overlapsPlanningWindow(workBlock, input.planningWindowStart, input.planningWindowEnd)) {
        blocks.push(workBlock);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return blocks;
}

function createWorkBlockForDate(
  date: Date,
  shiftDefinition: ShiftDefinition,
  dayBoundaryStartTime: GenerateWorkBlocksInput["dayBoundaryStartTime"],
): GeneratedWorkBlock {
  const startTime = parseTimeString(shiftDefinition.startTime);
  const endTime = parseTimeString(shiftDefinition.endTime);
  const startsAt = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startTime.hours,
    startTime.minutes,
    0,
    0,
  );
  const endsAt = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    endTime.hours,
    endTime.minutes,
    0,
    0,
  );
  const derivedCrossesMidnight = endTime.totalMinutes <= startTime.totalMinutes;

  if (derivedCrossesMidnight) {
    endsAt.setDate(endsAt.getDate() + 1);
  }

  // Work-day ownership follows the shift start date, even when the block ends next calendar day.
  return {
    id: buildWorkBlockId(shiftDefinition.id, formatLocalDate(date) as LocalDateString),
    shiftDefinitionId: shiftDefinition.id,
    userId: shiftDefinition.userId,
    title: shiftDefinition.name,
    anchorType: "work",
    startsAt,
    endsAt,
    startDate: formatLocalDate(startsAt) as LocalDateString,
    endDate: formatLocalDate(endsAt) as LocalDateString,
    userDayDate: getUserDayDate(startsAt, dayBoundaryStartTime) as LocalDateString,
    crossesMidnight: derivedCrossesMidnight,
  };
}

function buildWorkBlockId(shiftDefinitionId: string, startDate: LocalDateString): string {
  return `work_${shiftDefinitionId}_${startDate}`;
}

function validatePlanningWindow(planningWindowStart: Date, planningWindowEnd: Date): void {
  if (planningWindowStart.getTime() >= planningWindowEnd.getTime()) {
    throw new RangeError("planningWindowStart must be before planningWindowEnd");
  }
}

function validateShiftDefinition(shiftDefinition: ShiftDefinition): void {
  const startTime = parseTimeString(shiftDefinition.startTime);
  const endTime = parseTimeString(shiftDefinition.endTime);
  const derivedCrossesMidnight = endTime.totalMinutes <= startTime.totalMinutes;

  if (shiftDefinition.workDays.length === 0) {
    throw new RangeError("shiftDefinition.workDays must include at least one weekday");
  }

  if (shiftDefinition.crossesMidnight !== derivedCrossesMidnight) {
    throw new RangeError("shiftDefinition.crossesMidnight must match the shift time range");
  }
}

function getCandidateStartDate(planningWindowStart: Date): Date {
  const date = new Date(
    planningWindowStart.getFullYear(),
    planningWindowStart.getMonth(),
    planningWindowStart.getDate(),
    0,
    0,
    0,
    0,
  );

  date.setDate(date.getDate() - 1);

  return date;
}

function getCandidateEndDate(planningWindowEnd: Date): Date {
  return new Date(
    planningWindowEnd.getFullYear(),
    planningWindowEnd.getMonth(),
    planningWindowEnd.getDate(),
    0,
    0,
    0,
    0,
  );
}

function overlapsPlanningWindow(
  workBlock: GeneratedWorkBlock,
  planningWindowStart: Date,
  planningWindowEnd: Date,
): boolean {
  return (
    workBlock.startsAt.getTime() < planningWindowEnd.getTime() &&
    workBlock.endsAt.getTime() > planningWindowStart.getTime()
  );
}
