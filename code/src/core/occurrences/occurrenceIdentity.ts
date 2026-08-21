import type { RecurrenceFrequency } from "../blocks/types.js";
import type { LocalDateString } from "../shifts/types.js";

export const OCCURRENCE_IDENTITY_VERSION = 1 as const;

type OccurrenceIdentityBase = {
  version: typeof OCCURRENCE_IDENTITY_VERSION;
  slot: number;
};

export type TemplateOccurrenceIdentity = OccurrenceIdentityBase &
  (
    | {
        sourceKind: "template";
        frequency: Extract<RecurrenceFrequency, "daily" | "specificWeekdays">;
        templateId: string;
        recurrenceId: string;
        scopeKind: "userDay";
        userDayDate: LocalDateString;
      }
    | {
        sourceKind: "template";
        frequency: Extract<RecurrenceFrequency, "weekly" | "timesPerUserWeek">;
        templateId: string;
        recurrenceId: string;
        scopeKind: "userWeek";
        userWeekStartDate: LocalDateString;
      }
  );

export type WorkOccurrenceIdentity = OccurrenceIdentityBase & {
  sourceKind: "work";
  shiftDefinitionId: string;
  shiftCycleId: string;
  shiftSegmentId: string;
  localStartDate: LocalDateString;
};

export type ManualEventOccurrenceIdentity = Omit<OccurrenceIdentityBase, "slot"> & {
  sourceKind: "manualEvent";
  manualEventId: string;
};

export type OccurrenceIdentity =
  | TemplateOccurrenceIdentity
  | WorkOccurrenceIdentity
  | ManualEventOccurrenceIdentity;

// Runtime semantic identity only. Authored source IDs can currently be reused,
// so v1 is not safe as a durable foreign key until source incarnation is solved.
export function createTemplateOccurrenceIdentity(input: {
  templateId: string;
  recurrenceId: string;
  frequency: Extract<
    RecurrenceFrequency,
    "daily" | "specificWeekdays" | "weekly" | "timesPerUserWeek"
  >;
  userDayDate: LocalDateString;
  userWeekStartDate: LocalDateString;
  slot: number;
}): TemplateOccurrenceIdentity {
  if (input.frequency === "daily" || input.frequency === "specificWeekdays") {
    return {
      version: OCCURRENCE_IDENTITY_VERSION,
      sourceKind: "template",
      frequency: input.frequency,
      templateId: input.templateId,
      recurrenceId: input.recurrenceId,
      scopeKind: "userDay",
      userDayDate: input.userDayDate,
      slot: input.slot,
    };
  }

  return {
    version: OCCURRENCE_IDENTITY_VERSION,
    sourceKind: "template",
    frequency: input.frequency,
    templateId: input.templateId,
    recurrenceId: input.recurrenceId,
    scopeKind: "userWeek",
    userWeekStartDate: input.userWeekStartDate,
    slot: input.slot,
  };
}

export function createWorkOccurrenceIdentity(input: {
  shiftDefinitionId: string;
  shiftCycleId: string;
  shiftSegmentId: string;
  localStartDate: LocalDateString;
}): WorkOccurrenceIdentity {
  return {
    version: OCCURRENCE_IDENTITY_VERSION,
    sourceKind: "work",
    shiftDefinitionId: input.shiftDefinitionId,
    shiftCycleId: input.shiftCycleId,
    shiftSegmentId: input.shiftSegmentId,
    localStartDate: input.localStartDate,
    slot: 0,
  };
}

export function createManualEventOccurrenceIdentity(
  manualEventId: string,
): ManualEventOccurrenceIdentity {
  return {
    version: OCCURRENCE_IDENTITY_VERSION,
    sourceKind: "manualEvent",
    manualEventId,
  };
}

export function cloneOccurrenceIdentity(identity: OccurrenceIdentity): OccurrenceIdentity {
  return { ...identity };
}
