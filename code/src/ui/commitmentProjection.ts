import type { BlockCategory, PreferredWindow, RecurrenceFrequency } from "../core/blocks/types.js";
import type { SetupDraftEntry } from "./setupDraft.js";

export type CommitmentReference = {
  sourceKind: "blockTemplate";
  logicalId: string;
  incarnationId?: string;
};

export type CommitmentSummary = {
  reference: CommitmentReference;
  label: string;
  kind: string;
  recurrence: string;
  preferredTiming: string;
  enabled: boolean;
};

const weekdayLabels: Record<string, string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

export function deriveCommitmentSummaries(
  entries: readonly SetupDraftEntry[],
): CommitmentSummary[] {
  return entries.map(({ template, recurrence }) => {
    const incarnationId = getIncarnationId(template);
    return {
      reference: {
        sourceKind: "blockTemplate",
        logicalId: template.id,
        ...(incarnationId ? { incarnationId } : {}),
      },
      label: template.title,
      kind: formatKind(template.category),
      recurrence: formatRecurrence(
        recurrence.frequency,
        recurrence.weekdays,
        recurrence.timesPerUserWeek,
      ),
      preferredTiming: formatPreferredTiming(template.preferredWindow),
      enabled: template.enabled,
    };
  });
}

function getIncarnationId(value: object): string | undefined {
  return "incarnationId" in value && typeof value.incarnationId === "string"
    ? value.incarnationId
    : undefined;
}

function formatKind(category: BlockCategory): string {
  if (category === "sleep") return "Sleep";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function formatPreferredTiming(window: PreferredWindow): string {
  const labels: Record<PreferredWindow, string> = {
    afterWaking: "After waking",
    beforeWork: "Before work",
    afterWork: "After work",
    beforeSleep: "Before sleep",
    anyAvailable: "Any available time",
    custom: "Custom preferred window",
  };
  return labels[window];
}

function formatRecurrence(
  frequency: RecurrenceFrequency,
  weekdays?: readonly string[],
  count?: number,
): string {
  if (frequency === "daily") return "Every day";
  if (frequency === "weekly") return "Every user-week";
  if (frequency === "specificWeekdays")
    return (weekdays ?? []).map((day) => weekdayLabels[day] ?? day).join(", ");
  if (frequency === "timesPerUserWeek") return `${count ?? 1} times per user-week`;
  if (frequency === "perShiftSegment") return "Each work schedule period";
  return "Custom recurrence (advanced setup)";
}
