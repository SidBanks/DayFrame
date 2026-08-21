import type { TimeString, Weekday } from "../time/types.js";
import type { AnchorType } from "../anchors/types.js";
import type { OccurrenceIdentity } from "../occurrences/occurrenceIdentity.js";

export type LocalDateString = `${number}-${number}-${number}`;

export type ShiftDefinition = {
  id: string;
  userId: string;
  name: string;
  startTime: TimeString;
  endTime: TimeString;
  workDays: Weekday[];
  crossesMidnight: boolean;
  colorToken?: string;
  createdAt: string;
  updatedAt: string;
};

export type GeneratedWorkBlock = {
  id: string;
  occurrenceIdentity?: OccurrenceIdentity;
  shiftDefinitionId: string;
  userId: string;
  title: string;
  anchorType?: AnchorType;
  startsAt: Date;
  endsAt: Date;
  startDate: LocalDateString;
  endDate: LocalDateString;
  userDayDate: LocalDateString;
  crossesMidnight: boolean;
};

export type GenerateWorkBlocksInput = {
  shiftDefinition: ShiftDefinition;
  planningWindowStart: Date;
  planningWindowEnd: Date;
  dayBoundaryStartTime: TimeString;
};
