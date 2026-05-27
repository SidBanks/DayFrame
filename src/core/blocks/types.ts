import type { TimeString, Weekday } from "../time/types.js";
import type { UserTimePreferences } from "../time/types.js";
import type { LocalDateString } from "../shifts/types.js";
import type { GeneratedWorkBlock } from "../shifts/types.js";
import type { ShiftCycle } from "../cycles/types.js";
import type { AnchorType } from "../anchors/types.js";

export type BlockCategory =
  | "work"
  | "sleep"
  | "fitness"
  | "meal"
  | "maintenance"
  | "family"
  | "health"
  | "review"
  | "admin"
  | "recovery"
  | "optional";

export type BlockPlacementType = "fixed" | "flexible";

export type PriorityLevel = 1 | 2 | 3 | 4 | 5;

export type RescheduleBehavior = "autoSameDay" | "autoSameUserWeek" | "askUser" | "skip";

export type PreferredWindow =
  | "afterWaking"
  | "beforeWork"
  | "afterWork"
  | "beforeSleep"
  | "anyAvailable"
  | "custom";

export type ExternalResourceType = "url" | "note" | "checklist" | "file" | "integration";

export type IntegrationProvider =
  | "googleCalendar"
  | "googleTasks"
  | "googleDocs"
  | "notion"
  | "todoist"
  | "appleCalendar"
  | "outlook"
  | "customUrl";

export type ExternalResource = {
  id: string;
  type: ExternalResourceType;
  label: string;
  value: string;
  integrationProvider?: IntegrationProvider;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

export type BlockTemplate = {
  id: string;
  userId: string;
  title: string;
  category: BlockCategory;
  placementType: BlockPlacementType;
  durationMinutes: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  priority: PriorityLevel;
  preferredWindow: PreferredWindow;
  fixedStartTime?: TimeString;
  customWindowStartTime?: TimeString;
  customWindowEndTime?: TimeString;
  rescheduleBehavior: RescheduleBehavior;
  requiresResource: boolean;
  externalResources: ExternalResource[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlockTemplateValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type RecurrenceFrequency =
  | "daily"
  | "weekly"
  | "specificWeekdays"
  | "timesPerUserWeek"
  | "perShiftSegment"
  | "custom";

export type BlockRecurrence = {
  id: string;
  blockTemplateId: string;
  frequency: RecurrenceFrequency;
  weekdays?: Weekday[];
  timesPerUserWeek?: number;
  startsOnDate?: LocalDateString;
  endsOnDate?: LocalDateString;
};

export type BlockCandidate = {
  id: string;
  userId: string;
  templateId: string;
  recurrenceId: string;
  title: string;
  category: BlockCategory;
  anchorType?: AnchorType;
  placementType: BlockPlacementType;
  durationMinutes: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  priority: PriorityLevel;
  preferredWindow: PreferredWindow;
  fixedStartTime?: TimeString;
  customWindowStartTime?: TimeString;
  customWindowEndTime?: TimeString;
  rescheduleBehavior: RescheduleBehavior;
  externalResources: ExternalResource[];
  userDayDate: LocalDateString;
  userWeekStartDate: LocalDateString;
};

export type GenerateBlockCandidatesInput = {
  blockTemplates: BlockTemplate[];
  blockRecurrences: BlockRecurrence[];
  planningWindowStart: Date;
  planningWindowEnd: Date;
  dayBoundaryStartTime?: TimeString;
  weekStartsOn?: Weekday;
  shiftCycle?: ShiftCycle;
  defaultSchedulingPreferences?: UserTimePreferences;
};

export type ScheduledBlockSource = "shift" | "template" | "rule" | "manual" | "importedCalendar";

export type ScheduledBlockStatus =
  | "planned"
  | "completed"
  | "missed"
  | "skipped"
  | "rescheduled"
  | "conflicted";

export type DraftScheduledBlock = {
  id: string;
  userId: string;
  templateId?: string;
  source: ScheduledBlockSource;
  title: string;
  category: BlockCategory;
  anchorType?: AnchorType;
  placementType?: BlockPlacementType;
  fixedStartTime?: TimeString;
  startsAt: Date;
  endsAt: Date;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  userDayDate: LocalDateString;
  userWeekStartDate: LocalDateString;
  priority: PriorityLevel;
  status: ScheduledBlockStatus;
  externalResources: ExternalResource[];
};

export type PlaceBlockCandidatesInput = {
  blockCandidates: BlockCandidate[];
  generatedWorkBlocks: GeneratedWorkBlock[];
  planningWindowStart: Date;
  planningWindowEnd: Date;
  dayBoundaryStartTime: TimeString;
  getDayBoundaryStartTimeForUserDayDate?: (userDayDate: LocalDateString) => TimeString;
};

export type PlaceBlockCandidatesResult = {
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
};
