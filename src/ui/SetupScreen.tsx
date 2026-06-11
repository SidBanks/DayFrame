import type {
  BlockCategory,
  BlockRecurrence,
  BlockTemplate,
  PreferredWindow,
  RecurrenceFrequency,
  RescheduleBehavior,
} from "../core/blocks/types.js";
import type { ShiftCycle, ShiftSegment } from "../core/cycles/types.js";
import type { LocalDateString, ShiftDefinition } from "../core/shifts/types.js";
import type {
  DayFramePreviewRange,
  DayFramePreviewRangePreset,
  DayFrameSchedulingPreferences,
  DayFrameState,
} from "../state/types.js";
import type { TimeString, Weekday } from "../core/time/types.js";
import type { Dispatch, ReactElement, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { formatHumanTimeRange } from "./timeDisplay.js";

const blockCategories: BlockCategory[] = [
  "work",
  "sleep",
  "fitness",
  "meal",
  "maintenance",
  "family",
  "health",
  "review",
  "admin",
  "recovery",
  "optional",
];

const preferredWindows: PreferredWindow[] = [
  "afterWaking",
  "beforeWork",
  "afterWork",
  "beforeSleep",
  "anyAvailable",
  "custom",
];

const rescheduleBehaviors: RescheduleBehavior[] = [
  "autoSameDay",
  "autoSameUserWeek",
  "askUser",
  "skip",
];

const recurrenceFrequencies: RecurrenceFrequency[] = [
  "daily",
  "weekly",
  "specificWeekdays",
  "timesPerUserWeek",
  "perShiftSegment",
  "custom",
];

const previewRangePresets: DayFramePreviewRangePreset[] = [
  "threeDays",
  "oneWeek",
  "twoWeeks",
  "oneMonth",
  "custom",
];

const weekdays: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export type SetupDraftEntry = {
  template: BlockTemplate;
  recurrence: BlockRecurrence;
};

export type SetupDraft = {
  schedulingPreferences: DayFrameSchedulingPreferences;
  previewRange: DayFramePreviewRange;
  shiftDefinitions: ShiftDefinition[];
  shiftCycles: ShiftCycle[];
  templateEntries: SetupDraftEntry[];
};

export type SetupScreenProps = {
  draft: SetupDraft;
  setDraft: Dispatch<SetStateAction<SetupDraft>>;
  onSave: () => void;
  saveMessage: string;
  isDirty?: boolean;
  focusedTemplateField?: {
    templateId: string;
    field: "fixedStartTime";
  } | null;
};

export function SetupScreen({
  draft,
  setDraft,
  onSave,
  saveMessage,
  isDirty = false,
  focusedTemplateField = null,
}: SetupScreenProps): ReactElement {
  const [confirmingDeleteShiftIndex, setConfirmingDeleteShiftIndex] = useState<number | null>(null);
  const [confirmingDeleteCycleIndex, setConfirmingDeleteCycleIndex] = useState<number | null>(null);
  const [confirmingDeleteSegment, setConfirmingDeleteSegment] = useState<{
    cycleIndex: number;
    segmentIndex: number;
  } | null>(null);
  const [confirmingDeleteTemplateIndex, setConfirmingDeleteTemplateIndex] = useState<number | null>(
    null,
  );
  const [isSchedulePreferencesOpen, setIsSchedulePreferencesOpen] = useState(true);
  const [isShiftsOpen, setIsShiftsOpen] = useState(true);
  const [isCyclesOpen, setIsCyclesOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isPreviewRangeOpen, setIsPreviewRangeOpen] = useState(false);
  const fixedStartTimeInputRefs = useRef(new Map<string, HTMLInputElement>());
  const setupStatusMessage = saveMessage || (isDirty ? "Unsaved changes" : "All changes saved");

  useEffect(() => {
    if (!focusedTemplateField || focusedTemplateField.field !== "fixedStartTime") {
      return;
    }

    const input = fixedStartTimeInputRefs.current.get(focusedTemplateField.templateId);

    if (!input) {
      return;
    }

    input.focus();
    input.scrollIntoView?.({
      block: "center",
      behavior: "smooth",
    });
  }, [focusedTemplateField]);

  return (
    <main className="df-screen">
      <header className="df-panel df-screen-header">
        <h1 className="df-screen-title">Setup</h1>
        <p className="df-screen-subtitle">
          Edit your authored setup in one place. Generate Preview will save the current draft
          automatically.
        </p>
        <p className="df-support">
          Setup includes schedule preferences, shifts, cycles, templates, and recurrences.
        </p>
      </header>

      <div className="df-panel df-setup-action-bar" role="toolbar" aria-label="Setup actions">
        <div className="df-screen-actions">
          <button className="df-action-button" onClick={onSave} type="button">
            Save Setup
          </button>
          <button
            className="df-secondary-button"
            onClick={() => {
              setIsSchedulePreferencesOpen(true);
              setIsPreviewRangeOpen(true);
              setIsShiftsOpen(true);
              setIsCyclesOpen(true);
              setIsTemplatesOpen(true);
            }}
            type="button"
          >
            Expand All
          </button>
          <button
            className="df-secondary-button"
            onClick={() => {
              setIsSchedulePreferencesOpen(false);
              setIsPreviewRangeOpen(false);
              setIsShiftsOpen(false);
              setIsCyclesOpen(false);
              setIsTemplatesOpen(false);
            }}
            type="button"
          >
            Collapse All
          </button>
        </div>
        <p
          className={
            saveMessage ? "df-success-message" : isDirty ? "df-warning-message" : "df-support"
          }
        >
          {setupStatusMessage}
        </p>
      </div>

      <CollapsibleSetupSection
        helperText="Controls how DayFrame interprets days, weeks, and schedule boundaries."
        isOpen={isSchedulePreferencesOpen}
        onToggle={() => {
          setIsSchedulePreferencesOpen((currentValue) => !currentValue);
        }}
        sectionId="setup-preferences"
        title="Schedule Preferences"
      >
        <div className="df-screen-header">
          <h2 className="df-panel-title" id="setup-preferences-heading">
            Schedule Preferences
          </h2>
          <p className="df-support">
            Global preferences apply by default and can be overridden by cycle segments.
          </p>
        </div>
        <div className="df-grid">
          <div className="df-field">
            <label htmlFor="setup-global-day-boundary">Day Boundary Start Time</label>
            <input
              id="setup-global-day-boundary"
              onChange={(event) => {
                const nextValue = (event.target as { value: `${number}:${number}` }).value;

                setDraft((currentDraft) => ({
                  ...currentDraft,
                  schedulingPreferences: {
                    ...currentDraft.schedulingPreferences,
                    dayBoundaryStartTime: nextValue,
                  },
                }));
              }}
              type="time"
              value={draft.schedulingPreferences.dayBoundaryStartTime}
            />
          </div>
          <div className="df-field">
            <label htmlFor="setup-global-week-start">Week Starts On</label>
            <select
              id="setup-global-week-start"
              onChange={(event) => {
                const nextValue = (event.target as { value: Weekday }).value;

                setDraft((currentDraft) => ({
                  ...currentDraft,
                  schedulingPreferences: {
                    ...currentDraft.schedulingPreferences,
                    weekStartsOn: nextValue,
                  },
                }));
              }}
              value={draft.schedulingPreferences.weekStartsOn}
            >
              {weekdays.map((weekday) => (
                <option key={weekday} value={weekday}>
                  {formatWeekdayLabel(weekday)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CollapsibleSetupSection>

      <CollapsibleSetupSection
        helperText="Controls how far ahead DayFrame generates a preview."
        isOpen={isPreviewRangeOpen}
        onToggle={() => {
          setIsPreviewRangeOpen((currentValue) => !currentValue);
        }}
        sectionId="setup-preview-range"
        title="Preview Range"
      >
        <div className="df-screen-header">
          <h2 className="df-panel-title" id="setup-preview-range-heading">
            Preview Range
          </h2>
          <p className="df-support">
            Choose the saved date range DayFrame should use when generating preview.
          </p>
        </div>
        <div className="df-grid">
          <div className="df-field">
            <label htmlFor="setup-preview-range-source">Range Source</label>
            <select
              id="setup-preview-range-source"
              onChange={(event) => {
                const nextSource = (
                  event.target as { value: NonNullable<DayFramePreviewRange["source"]> }
                ).value;

                setDraft((currentDraft) => ({
                  ...currentDraft,
                  previewRange:
                    nextSource === "cycle"
                      ? buildCyclePreviewRange(currentDraft)
                      : {
                          ...currentDraft.previewRange,
                          ...(nextSource === "preset"
                            ? { source: "preset" as const }
                            : { source: "custom" as const }),
                          preset:
                            nextSource === "custom" ? "custom" : currentDraft.previewRange.preset,
                        },
                }));
              }}
              value={getPreviewRangeSource(draft.previewRange)}
            >
              <option value="preset">Preset</option>
              <option value="custom">Custom</option>
              <option value="cycle">Preview All Cycles</option>
            </select>
          </div>

          <div className="df-field">
            <label htmlFor="setup-preview-range-preset">Range Preset</label>
            <select
              id="setup-preview-range-preset"
              disabled={getPreviewRangeSource(draft.previewRange) !== "preset"}
              onChange={(event) => {
                const nextPreset = (event.target as { value: DayFramePreviewRangePreset }).value;

                setDraft((currentDraft) => ({
                  ...currentDraft,
                  previewRange: {
                    ...currentDraft.previewRange,
                    source: nextPreset === "custom" ? "custom" : "preset",
                    preset: nextPreset,
                    ...(nextPreset === "custom"
                      ? {}
                      : {
                          endDate: calculatePreviewRangeEndDate(
                            currentDraft.previewRange.startDate,
                            nextPreset,
                          ),
                        }),
                  },
                }));
              }}
              value={draft.previewRange.preset}
            >
              {previewRangePresets.map((preset) => (
                <option key={preset} value={preset}>
                  {formatPreviewRangePresetLabel(preset)}
                </option>
              ))}
            </select>
          </div>

          <div className="df-field">
            <label htmlFor="setup-preview-range-start-date">Start Date</label>
            <input
              disabled={getPreviewRangeSource(draft.previewRange) === "cycle"}
              id="setup-preview-range-start-date"
              onChange={(event) => {
                const nextStartDate = (event.target as { value: string }).value as LocalDateString;

                setDraft((currentDraft) => ({
                  ...currentDraft,
                  previewRange: {
                    ...currentDraft.previewRange,
                    source:
                      getPreviewRangeSource(currentDraft.previewRange) === "preset"
                        ? "preset"
                        : "custom",
                    startDate: nextStartDate,
                    ...(currentDraft.previewRange.preset === "custom"
                      ? {}
                      : {
                          endDate: calculatePreviewRangeEndDate(
                            nextStartDate,
                            currentDraft.previewRange.preset,
                          ),
                        }),
                  },
                }));
              }}
              type="date"
              value={draft.previewRange.startDate}
            />
          </div>

          <div className="df-field">
            <label htmlFor="setup-preview-range-end-date">End Date</label>
            <input
              disabled={getPreviewRangeSource(draft.previewRange) === "cycle"}
              id="setup-preview-range-end-date"
              onChange={(event) => {
                const nextEndDate = (event.target as { value: string }).value as LocalDateString;

                setDraft((currentDraft) => ({
                  ...currentDraft,
                  previewRange: {
                    ...currentDraft.previewRange,
                    source: "custom",
                    preset:
                      currentDraft.previewRange.preset === "custom"
                        ? currentDraft.previewRange.preset
                        : "custom",
                    endDate: nextEndDate,
                  },
                }));
              }}
              type="date"
              value={draft.previewRange.endDate}
            />
          </div>
        </div>
      </CollapsibleSetupSection>

      <CollapsibleSetupSection
        helperText="Define your work shifts and workday patterns."
        isOpen={isShiftsOpen}
        onToggle={() => {
          setIsShiftsOpen((currentValue) => !currentValue);
        }}
        sectionId="setup-shifts"
        title="Shifts"
      >
        <div className="df-screen-header">
          <h2 className="df-panel-title" id="setup-shifts-heading">
            Shift Definitions
          </h2>
          <p className="df-support">
            Create one definition for each kind of shift you work, including overnight shifts.
          </p>
        </div>
        <div className="df-screen-actions">
          <button
            className="df-secondary-button"
            onClick={() => {
              setDraft((currentDraft) => ({
                  ...currentDraft,
                  shiftDefinitions: [
                    ...currentDraft.shiftDefinitions,
                    createDraftShiftDefinition(
                      currentDraft.shiftDefinitions,
                      currentDraft.shiftCycles,
                    ),
                  ],
                }));
            }}
            type="button"
          >
            Add Shift Definition
          </button>
        </div>

        {draft.shiftDefinitions.length === 0 ? (
          <div>
            <p className="df-empty">
              No shifts yet. Add your first shift definition to get started.
            </p>
          </div>
        ) : (
          <ul className="df-list">
            {draft.shiftDefinitions.map((shiftDefinition, index) => (
              <li className="df-list-card" key={shiftDefinition.id}>
                <div className="df-screen-actions">
                  <h3 className="df-item-title">{shiftDefinition.name || `Shift ${index + 1}`}</h3>
                  <button
                    className="df-secondary-button"
                    onClick={() => {
                      setConfirmingDeleteShiftIndex(index);
                    }}
                    type="button"
                  >
                    Delete Shift Definition
                  </button>
                </div>

                {confirmingDeleteShiftIndex === index ? (
                  <div className="df-confirmation">
                    <p className="df-danger-message">
                      Delete this shift definition from the current setup draft?
                    </p>
                    <div className="df-confirmation-actions">
                      <button
                        className="df-danger-button"
                        onClick={() => {
                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            shiftDefinitions: currentDraft.shiftDefinitions.filter(
                              (_, currentIndex) => currentIndex !== index,
                            ),
                            shiftCycles: currentDraft.shiftCycles.map((shiftCycle) => ({
                              ...shiftCycle,
                              segments: shiftCycle.segments.map((segment) =>
                                segment.shiftDefinitionId === shiftDefinition.id
                                  ? {
                                      ...segment,
                                      shiftDefinitionId:
                                        currentDraft.shiftDefinitions.find(
                                          (candidateShift) =>
                                            candidateShift.id !== shiftDefinition.id,
                                        )?.id ?? "",
                                    }
                                  : segment,
                              ),
                            })),
                          }));
                          setConfirmingDeleteShiftIndex(null);
                        }}
                        type="button"
                      >
                        Confirm Delete Shift Definition
                      </button>
                      <button
                        className="df-secondary-button"
                        onClick={() => {
                          setConfirmingDeleteShiftIndex(null);
                        }}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="df-grid">
                  <div className="df-field">
                    <label>Name</label>
                    <input
                      aria-label="Name"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          shiftDefinitions: currentDraft.shiftDefinitions.map(
                            (currentShiftDefinition, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentShiftDefinition,
                                    name: nextValue,
                                  }
                                : currentShiftDefinition,
                          ),
                        }));
                      }}
                      type="text"
                      value={shiftDefinition.name}
                    />
                  </div>

                  <div className="df-field">
                    <label>Start Time</label>
                    <input
                      aria-label="Start Time"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          shiftDefinitions: currentDraft.shiftDefinitions.map(
                            (currentShiftDefinition, currentIndex) => {
                              if (currentIndex !== index) {
                                return currentShiftDefinition;
                              }

                              const nextShiftDefinition = {
                                ...currentShiftDefinition,
                                startTime: nextValue as ShiftDefinition["startTime"],
                              };

                              return {
                                ...nextShiftDefinition,
                                crossesMidnight: deriveCrossesMidnight(nextShiftDefinition),
                              };
                            },
                          ),
                        }));
                      }}
                      type="time"
                      value={shiftDefinition.startTime}
                    />
                  </div>

                  <div className="df-field">
                    <label>End Time</label>
                    <input
                      aria-label="End Time"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          shiftDefinitions: currentDraft.shiftDefinitions.map(
                            (currentShiftDefinition, currentIndex) => {
                              if (currentIndex !== index) {
                                return currentShiftDefinition;
                              }

                              const nextShiftDefinition = {
                                ...currentShiftDefinition,
                                endTime: nextValue as ShiftDefinition["endTime"],
                              };

                              return {
                                ...nextShiftDefinition,
                                crossesMidnight: deriveCrossesMidnight(nextShiftDefinition),
                              };
                            },
                          ),
                        }));
                      }}
                      type="time"
                      value={shiftDefinition.endTime}
                    />
                  </div>

                  <label className="df-checkbox">
                    <input
                      aria-label="Crosses Midnight"
                      checked={shiftDefinition.crossesMidnight}
                      disabled
                      onChange={() => undefined}
                      type="checkbox"
                    />
                    Crosses Midnight
                  </label>
                </div>

                <p className="df-support">
                  Shift hours:{" "}
                  {formatHumanTimeRange(
                    createDateForTime(shiftDefinition.startTime),
                    createDateForTime(shiftDefinition.endTime, shiftDefinition.crossesMidnight),
                  )}
                </p>

                <fieldset className="df-fieldset">
                  <legend>Work Days</legend>
                  <div className="df-checkbox-grid">
                    {weekdays.map((weekday) => (
                      <label className="df-checkbox" key={weekday}>
                        <input
                          checked={shiftDefinition.workDays.includes(weekday)}
                          onChange={() => {
                            setDraft((currentDraft) => ({
                              ...currentDraft,
                              shiftDefinitions: currentDraft.shiftDefinitions.map(
                                (currentShiftDefinition, currentIndex) =>
                                  currentIndex === index
                                    ? {
                                        ...currentShiftDefinition,
                                        workDays: toggleWeekday(
                                          currentShiftDefinition.workDays,
                                          weekday,
                                        ),
                                      }
                                    : currentShiftDefinition,
                              ),
                            }));
                          }}
                          type="checkbox"
                        />
                        {formatWeekdayLabel(weekday)}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </li>
            ))}
          </ul>
        )}
      </CollapsibleSetupSection>

      <CollapsibleSetupSection
        helperText="Connect shifts to date ranges and rotating schedules."
        isOpen={isCyclesOpen}
        onToggle={() => {
          setIsCyclesOpen((currentValue) => !currentValue);
        }}
        sectionId="setup-cycle"
        title="Cycles"
      >
        <div className="df-screen-header">
          <h2 className="df-panel-title" id="setup-cycle-heading">
            Schedule Cycles
          </h2>
          <p className="df-support">Map each dated cycle and its manual segments to the shift definitions above.</p>
        </div>

        <div className="df-screen-actions">
          <button
            className="df-secondary-button"
            onClick={() => {
              setDraft((currentDraft) => ({
                ...currentDraft,
                shiftCycles: [
                  ...currentDraft.shiftCycles,
                  createDraftShiftCycleFromDraft(
                    currentDraft,
                    currentDraft.shiftCycles.length + 1,
                  ),
                ],
                previewRange:
                  getPreviewRangeSource(currentDraft.previewRange) === "cycle"
                    ? buildCyclePreviewRange({
                        ...currentDraft,
                        shiftCycles: [
                          ...currentDraft.shiftCycles,
                          createDraftShiftCycleFromDraft(
                            currentDraft,
                            currentDraft.shiftCycles.length + 1,
                          ),
                        ],
                      })
                    : currentDraft.previewRange,
              }));
            }}
            type="button"
          >
            Add Shift Cycle
          </button>
        </div>

        {draft.shiftCycles.length === 0 ? (
          <div>
            <p className="df-empty">No cycles yet. Add your first dated cycle to get started.</p>
          </div>
        ) : (
          <ul className="df-list">
            {draft.shiftCycles.map((shiftCycle, cycleIndex) => (
              <li className="df-list-card" key={shiftCycle.id}>
                <div className="df-screen-actions">
                  <h3 className="df-item-title">{shiftCycle.name || `Cycle ${cycleIndex + 1}`}</h3>
                  <button
                    className="df-secondary-button"
                    onClick={() => {
                      setConfirmingDeleteCycleIndex(cycleIndex);
                    }}
                    type="button"
                  >
                    Delete Shift Cycle
                  </button>
                </div>

                {confirmingDeleteCycleIndex === cycleIndex ? (
                  <div className="df-confirmation">
                    <p className="df-danger-message">
                      Delete this shift cycle from the current setup draft?
                    </p>
                    <div className="df-confirmation-actions">
                      <button
                        className="df-danger-button"
                        onClick={() => {
                          setDraft((currentDraft) => {
                            const nextShiftCycles = currentDraft.shiftCycles.filter(
                              (_, currentIndex) => currentIndex !== cycleIndex,
                            );

                            return {
                              ...currentDraft,
                              shiftCycles: nextShiftCycles,
                              previewRange:
                                getPreviewRangeSource(currentDraft.previewRange) === "cycle"
                                  ? buildCyclePreviewRange({
                                      ...currentDraft,
                                      shiftCycles: nextShiftCycles,
                                    })
                                  : currentDraft.previewRange,
                            };
                          });
                          setConfirmingDeleteCycleIndex(null);
                        }}
                        type="button"
                      >
                        Confirm Delete Shift Cycle
                      </button>
                      <button
                        className="df-secondary-button"
                        onClick={() => {
                          setConfirmingDeleteCycleIndex(null);
                        }}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="df-grid">
                  <div className="df-field">
                    <label>Cycle Name</label>
                    <input
                      aria-label="Cycle Name"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          shiftCycles: currentDraft.shiftCycles.map((currentCycle, currentIndex) =>
                            currentIndex === cycleIndex
                              ? {
                                  ...currentCycle,
                                  name: nextValue,
                                }
                              : currentCycle,
                          ),
                        }));
                      }}
                      type="text"
                      value={shiftCycle.name}
                    />
                  </div>

                  <div className="df-field">
                    <label>Cycle Start Date</label>
                    <input
                      aria-label="Cycle Start Date"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value as LocalDateString;

                        setDraft((currentDraft) => {
                          const nextShiftCycles = currentDraft.shiftCycles.map(
                            (currentCycle, currentIndex) =>
                              currentIndex === cycleIndex
                                ? {
                                    ...currentCycle,
                                    startsOnDate: nextValue,
                                  }
                                : currentCycle,
                          );

                          return {
                            ...currentDraft,
                            shiftCycles: nextShiftCycles,
                            previewRange:
                              getPreviewRangeSource(currentDraft.previewRange) === "cycle"
                                ? buildCyclePreviewRange({
                                    ...currentDraft,
                                    shiftCycles: nextShiftCycles,
                                  })
                                : currentDraft.previewRange,
                          };
                        });
                      }}
                      type="date"
                      value={shiftCycle.startsOnDate}
                    />
                  </div>

                  <div className="df-field">
                    <label>Cycle End Date</label>
                    <input
                      aria-label="Cycle End Date"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value;

                        setDraft((currentDraft) => {
                          const nextShiftCycles = currentDraft.shiftCycles.map(
                            (currentCycle, currentIndex) => {
                              if (currentIndex !== cycleIndex) {
                                return currentCycle;
                              }

                              const nextCycle = {
                                ...currentCycle,
                              };

                              delete nextCycle.endsOnDate;

                              return nextValue
                                ? {
                                    ...nextCycle,
                                    endsOnDate: nextValue as LocalDateString,
                                  }
                                : nextCycle;
                            },
                          );

                          return {
                            ...currentDraft,
                            shiftCycles: nextShiftCycles,
                            previewRange:
                              getPreviewRangeSource(currentDraft.previewRange) === "cycle"
                                ? buildCyclePreviewRange({
                                    ...currentDraft,
                                    shiftCycles: nextShiftCycles,
                                  })
                                : currentDraft.previewRange,
                          };
                        });
                      }}
                      type="date"
                      value={shiftCycle.endsOnDate ?? ""}
                    />
                  </div>
                </div>

                <div className="df-screen-actions">
                  <button
                    className="df-secondary-button"
                    onClick={() => {
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        shiftCycles: currentDraft.shiftCycles.map((currentCycle, currentIndex) =>
                          currentIndex === cycleIndex
                            ? {
                                ...currentCycle,
                                segments: [
                                  ...currentCycle.segments,
                                  createDraftSegment(
                                    currentCycle,
                                    currentDraft.shiftDefinitions,
                                    currentCycle.segments.length + 1,
                                  ),
                                ],
                              }
                            : currentCycle,
                        ),
                      }));
                    }}
                    type="button"
                  >
                    Add Cycle Segment
                  </button>
                </div>

                {shiftCycle.segments.length === 0 ? (
                  <p className="df-empty">No segments yet for this cycle.</p>
                ) : (
                  <ul className="df-list">
                    {shiftCycle.segments.map((segment, segmentIndex) => (
                      <li className="df-list-card" key={segment.id}>
                        <div className="df-screen-actions">
                          <h4 className="df-item-title">Cycle Segment {segmentIndex + 1}</h4>
                          <button
                            className="df-secondary-button"
                            onClick={() => {
                              setConfirmingDeleteSegment({
                                cycleIndex,
                                segmentIndex,
                              });
                            }}
                            type="button"
                          >
                            Delete Cycle Segment
                          </button>
                        </div>

                        {confirmingDeleteSegment?.cycleIndex === cycleIndex &&
                        confirmingDeleteSegment.segmentIndex === segmentIndex ? (
                          <div className="df-confirmation">
                            <p className="df-danger-message">
                              Delete this cycle segment from the current setup draft?
                            </p>
                            <div className="df-confirmation-actions">
                              <button
                                className="df-danger-button"
                                onClick={() => {
                                  setDraft((currentDraft) => ({
                                    ...currentDraft,
                                    shiftCycles: currentDraft.shiftCycles.map(
                                      (currentCycle, currentIndex) =>
                                        currentIndex === cycleIndex
                                          ? {
                                              ...currentCycle,
                                              segments: currentCycle.segments.filter(
                                                (_, currentSegmentIndex) =>
                                                  currentSegmentIndex !== segmentIndex,
                                              ),
                                            }
                                          : currentCycle,
                                    ),
                                  }));
                                  setConfirmingDeleteSegment(null);
                                }}
                                type="button"
                              >
                                Confirm Delete Cycle Segment
                              </button>
                              <button
                                className="df-secondary-button"
                                onClick={() => {
                                  setConfirmingDeleteSegment(null);
                                }}
                                type="button"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : null}

                        <div className="df-grid">
                          <div className="df-field">
                            <label>Shift Definition</label>
                            <select
                              aria-label="Shift Definition"
                              onChange={(event) => {
                                const nextValue = (event.target as { value: string }).value;

                                setDraft((currentDraft) => ({
                                  ...currentDraft,
                                  shiftCycles: currentDraft.shiftCycles.map(
                                    (currentCycle, currentIndex) =>
                                      currentIndex === cycleIndex
                                        ? {
                                            ...currentCycle,
                                            segments: currentCycle.segments.map(
                                              (currentSegment, currentSegmentIndex) =>
                                                currentSegmentIndex === segmentIndex
                                                  ? {
                                                      ...currentSegment,
                                                      shiftDefinitionId: nextValue,
                                                    }
                                                  : currentSegment,
                                            ),
                                          }
                                        : currentCycle,
                                  ),
                                }));
                              }}
                              value={segment.shiftDefinitionId}
                            >
                              {draft.shiftDefinitions.length === 0 ? (
                                <option value="">No shifts available</option>
                              ) : null}
                              {draft.shiftDefinitions.map((shiftDefinition) => (
                                <option key={shiftDefinition.id} value={shiftDefinition.id}>
                                  {shiftDefinition.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="df-field">
                            <label>Segment Start Date</label>
                            <input
                              aria-label="Segment Start Date"
                              onChange={(event) => {
                                const nextValue = (event.target as { value: string }).value;

                                setDraft((currentDraft) => ({
                                  ...currentDraft,
                                  shiftCycles: currentDraft.shiftCycles.map(
                                    (currentCycle, currentIndex) =>
                                      currentIndex === cycleIndex
                                        ? {
                                            ...currentCycle,
                                            segments: currentCycle.segments.map(
                                              (currentSegment, currentSegmentIndex) =>
                                                currentSegmentIndex === segmentIndex
                                                  ? {
                                                      ...currentSegment,
                                                      startsOnDate: nextValue as LocalDateString,
                                                    }
                                                  : currentSegment,
                                            ),
                                          }
                                        : currentCycle,
                                  ),
                                }));
                              }}
                              type="date"
                              value={segment.startsOnDate}
                            />
                          </div>

                          <div className="df-field">
                            <label>Segment End Date</label>
                            <input
                              aria-label="Segment End Date"
                              onChange={(event) => {
                                const nextValue = (event.target as { value: string }).value;

                                setDraft((currentDraft) => ({
                                  ...currentDraft,
                                  shiftCycles: currentDraft.shiftCycles.map(
                                    (currentCycle, currentIndex) =>
                                      currentIndex === cycleIndex
                                        ? {
                                            ...currentCycle,
                                            segments: currentCycle.segments.map(
                                              (currentSegment, currentSegmentIndex) =>
                                                currentSegmentIndex === segmentIndex
                                                  ? {
                                                      ...currentSegment,
                                                      endsOnDate: nextValue as LocalDateString,
                                                    }
                                                  : currentSegment,
                                            ),
                                          }
                                        : currentCycle,
                                  ),
                                }));
                              }}
                              type="date"
                              value={segment.endsOnDate}
                            />
                          </div>

                          <div className="df-field">
                            <label>Notes</label>
                            <input
                              aria-label="Notes"
                              onChange={(event) => {
                                const nextValue = (event.target as { value: string }).value;

                                setDraft((currentDraft) => ({
                                  ...currentDraft,
                                  shiftCycles: currentDraft.shiftCycles.map(
                                    (currentCycle, currentIndex) =>
                                      currentIndex === cycleIndex
                                        ? {
                                            ...currentCycle,
                                            segments: currentCycle.segments.map(
                                              (currentSegment, currentSegmentIndex) =>
                                                currentSegmentIndex === segmentIndex
                                                  ? updateOptionalSegmentField(
                                                      currentSegment,
                                                      "notes",
                                                      nextValue,
                                                    )
                                                  : currentSegment,
                                            ),
                                          }
                                        : currentCycle,
                                  ),
                                }));
                              }}
                              type="text"
                              value={segment.notes ?? ""}
                            />
                          </div>

                          <label className="df-checkbox">
                            <input
                              aria-label="Override global schedule preferences"
                              checked={segment.schedulePreferences !== undefined}
                              onChange={(event) => {
                                const nextChecked = (event.target as { checked: boolean }).checked;

                                setDraft((currentDraft) => ({
                                  ...currentDraft,
                                  shiftCycles: currentDraft.shiftCycles.map(
                                    (currentCycle, currentIndex) =>
                                      currentIndex === cycleIndex
                                        ? {
                                            ...currentCycle,
                                            segments: currentCycle.segments.map(
                                              (currentSegment, currentSegmentIndex) => {
                                                if (currentSegmentIndex !== segmentIndex) {
                                                  return currentSegment;
                                                }

                                                if (!nextChecked) {
                                                  const nextSegment = {
                                                    ...currentSegment,
                                                  };

                                                  delete nextSegment.schedulePreferences;
                                                  return nextSegment;
                                                }

                                                return {
                                                  ...currentSegment,
                                                  schedulePreferences: {
                                                    dayBoundaryStartTime:
                                                      currentDraft.schedulingPreferences.dayBoundaryStartTime,
                                                    weekStartsOn:
                                                      currentDraft.schedulingPreferences.weekStartsOn,
                                                  },
                                                };
                                              },
                                            ),
                                          }
                                        : currentCycle,
                                  ),
                                }));
                              }}
                              type="checkbox"
                            />
                            Override global schedule preferences
                          </label>

                          {segment.schedulePreferences ? (
                            <>
                              <div className="df-field">
                                <label>Segment Day Boundary</label>
                                <input
                                  aria-label="Segment Day Boundary"
                                  onChange={(event) => {
                                    const nextValue = (event.target as { value: string }).value;

                                    setDraft((currentDraft) => ({
                                      ...currentDraft,
                                      shiftCycles: currentDraft.shiftCycles.map(
                                        (currentCycle, currentIndex) =>
                                          currentIndex === cycleIndex
                                            ? {
                                                ...currentCycle,
                                                segments: currentCycle.segments.map(
                                                  (currentSegment, currentSegmentIndex) =>
                                                    currentSegmentIndex === segmentIndex
                                                      ? updateSegmentSchedulePreferences(
                                                          currentSegment,
                                                          {
                                                            dayBoundaryStartTime: nextValue
                                                              ? (nextValue as TimeString)
                                                              : null,
                                                          },
                                                        )
                                                      : currentSegment,
                                                ),
                                              }
                                            : currentCycle,
                                      ),
                                    }));
                                  }}
                                  type="time"
                                  value={segment.schedulePreferences.dayBoundaryStartTime ?? ""}
                                />
                              </div>

                              <div className="df-field">
                                <label>Segment Week Starts On</label>
                                <select
                                  aria-label="Segment Week Starts On"
                                  onChange={(event) => {
                                    const nextValue = (event.target as { value: string }).value;

                                    setDraft((currentDraft) => ({
                                      ...currentDraft,
                                      shiftCycles: currentDraft.shiftCycles.map(
                                        (currentCycle, currentIndex) =>
                                          currentIndex === cycleIndex
                                            ? {
                                                ...currentCycle,
                                                segments: currentCycle.segments.map(
                                                  (currentSegment, currentSegmentIndex) =>
                                                    currentSegmentIndex === segmentIndex
                                                      ? updateSegmentSchedulePreferences(
                                                          currentSegment,
                                                          {
                                                            weekStartsOn: nextValue
                                                              ? (nextValue as Weekday)
                                                              : null,
                                                          },
                                                        )
                                                      : currentSegment,
                                                ),
                                              }
                                            : currentCycle,
                                      ),
                                    }));
                                  }}
                                  value={segment.schedulePreferences.weekStartsOn ?? ""}
                                >
                                  <option value="">Use global</option>
                                  {weekdays.map((weekday) => (
                                    <option key={weekday} value={weekday}>
                                      {formatWeekdayLabel(weekday)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </CollapsibleSetupSection>

      <CollapsibleSetupSection
        helperText="Reusable activities DayFrame can place into your schedule."
        isOpen={isTemplatesOpen}
        onToggle={() => {
          setIsTemplatesOpen((currentValue) => !currentValue);
        }}
        sectionId="setup-templates"
        title="Templates"
      >
        <div className="df-screen-header">
          <h2 className="df-panel-title" id="setup-templates-heading">
            Templates And Recurrences
          </h2>
          <p className="df-support">
            Templates describe what should happen. Recurrence tells DayFrame how often to consider
            each block.
          </p>
        </div>
        <div className="df-screen-actions">
          <button
            className="df-secondary-button"
            onClick={() => {
              setDraft((currentDraft) => ({
                ...currentDraft,
                templateEntries: [
                  ...currentDraft.templateEntries,
                  createDraftTemplateEntry(currentDraft.templateEntries, currentDraft.shiftCycles),
                ],
              }));
            }}
            type="button"
          >
            Add Block Template
          </button>
        </div>

        {draft.templateEntries.length === 0 ? (
          <div>
            <p className="df-empty">No templates yet. Add your first template to get started.</p>
          </div>
        ) : (
          <ul className="df-list">
            {draft.templateEntries.map((entry, index) => (
              <li className="df-list-card" key={entry.template.id}>
                <div className="df-screen-actions">
                  <div className="df-form-stack">
                    <h3 className="df-item-title">
                      {entry.template.title || `Template ${index + 1}`}
                    </h3>
                    <div className="df-screen-actions">
                      <label className="df-checkbox">
                        <input
                          aria-label="Include in Preview"
                          checked={entry.template.enabled}
                          onChange={(event) => {
                            const nextChecked = (event.target as { checked: boolean }).checked;

                            setDraft((currentDraft) => ({
                              ...currentDraft,
                              templateEntries: currentDraft.templateEntries.map(
                                (currentEntry, currentIndex) =>
                                  currentIndex === index
                                    ? {
                                        ...currentEntry,
                                        template: {
                                          ...currentEntry.template,
                                          enabled: nextChecked,
                                        },
                                      }
                                    : currentEntry,
                              ),
                            }));
                          }}
                          type="checkbox"
                        />
                        Include in Preview
                      </label>
                      <button
                        className="df-secondary-button"
                        onClick={() => {
                          setConfirmingDeleteTemplateIndex(index);
                        }}
                        type="button"
                      >
                        Delete Block Template
                      </button>
                    </div>
                  </div>
                </div>

                {!entry.template.enabled ? (
                  <p className="df-muted">Not included in preview.</p>
                ) : null}

                {confirmingDeleteTemplateIndex === index ? (
                  <div className="df-confirmation">
                    <p className="df-danger-message">
                      Delete this template and its matching recurrence from the current setup draft?
                    </p>
                    <div className="df-confirmation-actions">
                      <button
                        className="df-danger-button"
                        onClick={() => {
                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            templateEntries: currentDraft.templateEntries.filter(
                              (_, currentIndex) => currentIndex !== index,
                            ),
                          }));
                          setConfirmingDeleteTemplateIndex(null);
                        }}
                        type="button"
                      >
                        Confirm Delete Block Template
                      </button>
                      <button
                        className="df-secondary-button"
                        onClick={() => {
                          setConfirmingDeleteTemplateIndex(null);
                        }}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="df-grid">
                  <div className="df-field">
                    <label>Title</label>
                    <input
                      aria-label="Title"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentEntry,
                                    template: {
                                      ...currentEntry.template,
                                      title: nextValue,
                                    },
                                  }
                                : currentEntry,
                          ),
                        }));
                      }}
                      type="text"
                      value={entry.template.title}
                    />
                  </div>

                  <div className="df-field">
                    <label>Category</label>
                    <select
                      aria-label="Category"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentEntry,
                                    template: {
                                      ...currentEntry.template,
                                      category: nextValue as BlockTemplate["category"],
                                    },
                                  }
                                : currentEntry,
                          ),
                        }));
                      }}
                      value={entry.template.category}
                    >
                      {blockCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="df-field">
                    <label>Placement Type</label>
                    <select
                      aria-label="Placement Type"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentEntry,
                                    template: {
                                      ...currentEntry.template,
                                      placementType: nextValue as BlockTemplate["placementType"],
                                    },
                                  }
                                : currentEntry,
                          ),
                        }));
                      }}
                      value={entry.template.placementType}
                    >
                      <option value="flexible">flexible</option>
                      <option value="fixed">fixed</option>
                    </select>
                  </div>

                  <div className="df-field">
                    <div className="df-checkbox-card">
                      <label className="df-checkbox-card-label">
                        <input
                          aria-label="Requires Work Shift"
                          checked={entry.template.requiresWorkAnchor ?? false}
                          onChange={(event) => {
                            const nextChecked = (event.target as { checked: boolean }).checked;

                            setDraft((currentDraft) => ({
                              ...currentDraft,
                              templateEntries: currentDraft.templateEntries.map(
                                (currentEntry, currentIndex) =>
                                  currentIndex === index
                                    ? {
                                        ...currentEntry,
                                        template: {
                                          ...currentEntry.template,
                                          requiresWorkAnchor: nextChecked,
                                        },
                                      }
                                    : currentEntry,
                              ),
                            }));
                          }}
                          type="checkbox"
                        />
                        <span>Requires Work Shift</span>
                      </label>
                      <p className="df-support">
                        Only schedule this activity on days that contain a work shift.
                      </p>
                    </div>
                  </div>

                  <div className="df-field">
                    <label>Duration Hours</label>
                    <input
                      aria-label="Duration Hours"
                      min="0"
                      onChange={(event) => {
                        const nextValue = Number((event.target as { value: string }).value);
                        const safeValue = Number.isFinite(nextValue) ? Math.max(0, nextValue) : 0;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) => {
                              if (currentIndex !== index) {
                                return currentEntry;
                              }

                              const currentMinutes = currentEntry.template.durationMinutes % 60;

                              return {
                                ...currentEntry,
                                template: {
                                  ...currentEntry.template,
                                  durationMinutes: safeValue * 60 + currentMinutes,
                                },
                              };
                            },
                          ),
                        }));
                      }}
                      type="number"
                      value={Math.floor(entry.template.durationMinutes / 60)}
                    />
                  </div>

                  <div className="df-field">
                    <label>Duration Minutes</label>
                    <input
                      aria-label="Duration Minutes"
                      max="59"
                      min="0"
                      onChange={(event) => {
                        const nextValue = Number((event.target as { value: string }).value);
                        const safeValue = Number.isFinite(nextValue)
                          ? Math.max(0, Math.min(59, nextValue))
                          : 0;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) => {
                              if (currentIndex !== index) {
                                return currentEntry;
                              }

                              const currentHours = Math.floor(
                                currentEntry.template.durationMinutes / 60,
                              );

                              return {
                                ...currentEntry,
                                template: {
                                  ...currentEntry.template,
                                  durationMinutes: currentHours * 60 + safeValue,
                                },
                              };
                            },
                          ),
                        }));
                      }}
                      type="number"
                      value={entry.template.durationMinutes % 60}
                    />
                  </div>

                  <div className="df-field">
                    <p className="df-support">
                      Buffers reserve transition time around this block, such as travel, meals,
                      showering, or winding down.
                    </p>
                  </div>

                  <div className="df-field">
                    <label>Buffer Before (minutes)</label>
                    <input
                      aria-label="Buffer Before (minutes)"
                      min="0"
                      onChange={(event) => {
                        const rawValue = (event.target as { value: string }).value.trim();
                        const nextValue =
                          rawValue === ""
                            ? undefined
                            : Math.max(0, Number.parseInt(rawValue, 10) || 0);

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentEntry,
                                    template: updateTemplateOptionalNumberField(
                                      currentEntry.template,
                                      "bufferBeforeMinutes",
                                      nextValue,
                                    ),
                                  }
                                : currentEntry,
                          ),
                        }));
                      }}
                      placeholder="0"
                      type="number"
                      value={entry.template.bufferBeforeMinutes ?? ""}
                    />
                  </div>

                  <div className="df-field">
                    <label>Buffer After (minutes)</label>
                    <input
                      aria-label="Buffer After (minutes)"
                      min="0"
                      onChange={(event) => {
                        const rawValue = (event.target as { value: string }).value.trim();
                        const nextValue =
                          rawValue === ""
                            ? undefined
                            : Math.max(0, Number.parseInt(rawValue, 10) || 0);

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentEntry,
                                    template: updateTemplateOptionalNumberField(
                                      currentEntry.template,
                                      "bufferAfterMinutes",
                                      nextValue,
                                    ),
                                  }
                                : currentEntry,
                          ),
                        }));
                      }}
                      placeholder="0"
                      type="number"
                      value={entry.template.bufferAfterMinutes ?? ""}
                    />
                  </div>

                  <div className="df-field">
                    <label>Priority</label>
                    <select
                      aria-label="Priority"
                      onChange={(event) => {
                        const nextValue = Number((event.target as { value: string }).value);

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentEntry,
                                    template: {
                                      ...currentEntry.template,
                                      priority: nextValue as BlockTemplate["priority"],
                                    },
                                  }
                                : currentEntry,
                          ),
                        }));
                      }}
                      value={entry.template.priority}
                    >
                      {[1, 2, 3, 4, 5].map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  {entry.template.placementType === "flexible" ? (
                    <>
                      <div className="df-field">
                        <label>Preferred Window</label>
                        <select
                          aria-label="Preferred Window"
                          onChange={(event) => {
                            const nextValue = (event.target as { value: string }).value;

                            setDraft((currentDraft) => ({
                              ...currentDraft,
                              templateEntries: currentDraft.templateEntries.map(
                                (currentEntry, currentIndex) =>
                                  currentIndex === index
                                    ? {
                                        ...currentEntry,
                                        template: {
                                          ...currentEntry.template,
                                          preferredWindow:
                                            nextValue as BlockTemplate["preferredWindow"],
                                        },
                                      }
                                    : currentEntry,
                              ),
                            }));
                          }}
                          value={entry.template.preferredWindow}
                        >
                          {preferredWindows.map((preferredWindow) => (
                            <option key={preferredWindow} value={preferredWindow}>
                              {formatPreferredWindowLabel(preferredWindow)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <div
                      className={
                        focusedTemplateField?.templateId === entry.template.id &&
                        focusedTemplateField.field === "fixedStartTime"
                          ? "df-field is-highlighted"
                          : "df-field"
                      }
                    >
                      <label>Fixed Start Time</label>
                      <input
                        aria-label="Fixed Start Time"
                        ref={(node) => {
                          if (node) {
                            fixedStartTimeInputRefs.current.set(entry.template.id, node);
                            return;
                          }

                          fixedStartTimeInputRefs.current.delete(entry.template.id);
                        }}
                        onChange={(event) => {
                          const nextValue = (event.target as { value: string }).value;

                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            templateEntries: currentDraft.templateEntries.map(
                              (currentEntry, currentIndex) =>
                                currentIndex === index
                                  ? {
                                      ...currentEntry,
                                      template: updateTemplateOptionalTimeField(
                                        currentEntry.template,
                                        "fixedStartTime",
                                        nextValue ? (nextValue as TimeString) : null,
                                      ),
                                    }
                                  : currentEntry,
                            ),
                          }));
                        }}
                        type="time"
                        value={entry.template.fixedStartTime ?? ""}
                      />
                    </div>
                  )}
                </div>

                {entry.template.placementType === "flexible" &&
                entry.template.preferredWindow === "custom" ? (
                  <div className="df-grid">
                    <div className="df-field">
                      <label>Custom Window Start</label>
                      <input
                        aria-label="Custom Window Start"
                        onChange={(event) => {
                          const nextValue = (event.target as { value: string }).value;

                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            templateEntries: currentDraft.templateEntries.map(
                              (currentEntry, currentIndex) =>
                                currentIndex === index
                                  ? {
                                      ...currentEntry,
                                      template: updateTemplateOptionalTimeField(
                                        currentEntry.template,
                                        "customWindowStartTime",
                                        nextValue ? (nextValue as TimeString) : null,
                                      ),
                                    }
                                  : currentEntry,
                            ),
                          }));
                        }}
                        type="time"
                        value={entry.template.customWindowStartTime ?? ""}
                      />
                    </div>
                    <div className="df-field">
                      <label>Custom Window End</label>
                      <input
                        aria-label="Custom Window End"
                        onChange={(event) => {
                          const nextValue = (event.target as { value: string }).value;

                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            templateEntries: currentDraft.templateEntries.map(
                              (currentEntry, currentIndex) =>
                                currentIndex === index
                                  ? {
                                      ...currentEntry,
                                      template: updateTemplateOptionalTimeField(
                                        currentEntry.template,
                                        "customWindowEndTime",
                                        nextValue ? (nextValue as TimeString) : null,
                                      ),
                                    }
                                  : currentEntry,
                            ),
                          }));
                        }}
                        type="time"
                        value={entry.template.customWindowEndTime ?? ""}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="df-grid">
                  <div className="df-field">
                    <label>Reschedule Behavior</label>
                    <select
                      aria-label="Reschedule Behavior"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string }).value;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentEntry,
                                    template: {
                                      ...currentEntry.template,
                                      rescheduleBehavior:
                                        nextValue as BlockTemplate["rescheduleBehavior"],
                                    },
                                  }
                                : currentEntry,
                          ),
                        }));
                      }}
                      value={entry.template.rescheduleBehavior}
                    >
                      {rescheduleBehaviors.map((rescheduleBehavior) => (
                        <option key={rescheduleBehavior} value={rescheduleBehavior}>
                          {formatRescheduleBehaviorLabel(rescheduleBehavior)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="df-checkbox">
                    <input
                      aria-label="Requires Resource"
                      checked={entry.template.requiresResource}
                      onChange={(event) => {
                        const nextChecked = (event.target as { checked: boolean }).checked;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentEntry,
                                    template: {
                                      ...currentEntry.template,
                                      requiresResource: nextChecked,
                                    },
                                  }
                                : currentEntry,
                          ),
                        }));
                      }}
                      type="checkbox"
                    />
                    Requires Resource
                  </label>
                </div>

                <fieldset className="df-fieldset">
                  <legend>Recurrence</legend>

                  <div className="df-field">
                    <label>Frequency</label>
                    <select
                      aria-label="Frequency"
                      onChange={(event) => {
                        const nextValue = (event.target as { value: string })
                          .value as RecurrenceFrequency;

                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          templateEntries: currentDraft.templateEntries.map(
                            (currentEntry, currentIndex) =>
                              currentIndex === index
                                ? {
                                    ...currentEntry,
                                    recurrence: {
                                      ...currentEntry.recurrence,
                                      frequency: nextValue,
                                      ...(nextValue === "specificWeekdays"
                                        ? {
                                            weekdays: currentEntry.recurrence.weekdays ?? [
                                              "monday",
                                            ],
                                          }
                                        : {}),
                                      ...(nextValue === "timesPerUserWeek"
                                        ? {
                                            timesPerUserWeek:
                                              currentEntry.recurrence.timesPerUserWeek ?? 1,
                                          }
                                        : {}),
                                    },
                                  }
                                : currentEntry,
                          ),
                        }));
                      }}
                      value={entry.recurrence.frequency}
                    >
                      {recurrenceFrequencies.map((frequency) => (
                        <option key={frequency} value={frequency}>
                          {formatRecurrenceFrequencyLabel(frequency)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {entry.recurrence.frequency === "specificWeekdays" ? (
                    <fieldset className="df-fieldset">
                      <legend>Weekdays</legend>
                      <div className="df-checkbox-grid">
                        {weekdays.map((weekday) => (
                          <label className="df-checkbox" key={weekday}>
                            <input
                              checked={entry.recurrence.weekdays?.includes(weekday) ?? false}
                              onChange={() => {
                                setDraft((currentDraft) => ({
                                  ...currentDraft,
                                  templateEntries: currentDraft.templateEntries.map(
                                    (currentEntry, currentIndex) =>
                                      currentIndex === index
                                        ? {
                                            ...currentEntry,
                                            recurrence: normalizeRecurrence({
                                              ...currentEntry.recurrence,
                                              weekdays: toggleWeekday(
                                                currentEntry.recurrence.weekdays ?? [],
                                                weekday,
                                              ),
                                            }),
                                          }
                                        : currentEntry,
                                  ),
                                }));
                              }}
                              type="checkbox"
                            />
                            {formatWeekdayLabel(weekday)}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : null}

                  {entry.recurrence.frequency === "timesPerUserWeek" ? (
                    <div className="df-field">
                      <label>Times Per User Week</label>
                      <input
                        aria-label="Times Per User Week"
                        onChange={(event) => {
                          const nextValue = Number((event.target as { value: string }).value);

                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            templateEntries: currentDraft.templateEntries.map(
                              (currentEntry, currentIndex) =>
                                currentIndex === index
                                  ? {
                                      ...currentEntry,
                                      recurrence: {
                                        ...currentEntry.recurrence,
                                        timesPerUserWeek: nextValue,
                                      },
                                    }
                                  : currentEntry,
                            ),
                          }));
                        }}
                        type="number"
                        value={entry.recurrence.timesPerUserWeek ?? 1}
                      />
                    </div>
                  ) : null}
                </fieldset>
              </li>
            ))}
          </ul>
        )}
      </CollapsibleSetupSection>
    </main>
  );
}

type CollapsibleSetupSectionProps = {
  sectionId: string;
  title: string;
  helperText: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactElement | ReactElement[];
};

function CollapsibleSetupSection({
  sectionId,
  title,
  helperText,
  isOpen,
  onToggle,
  children,
}: CollapsibleSetupSectionProps): ReactElement {
  return (
    <section
      aria-labelledby={`${sectionId}-toggle`}
      className="df-panel df-form-stack df-collapsible-section"
    >
      <div className="df-collapsible-section-header df-collapsible-section-header--sticky">
        <p className="df-support">{helperText}</p>
        <button
          aria-controls={`${sectionId}-content`}
          aria-expanded={isOpen}
          className="df-secondary-button df-section-toggle"
          id={`${sectionId}-toggle`}
          onClick={onToggle}
          type="button"
        >
          {title}: {isOpen ? "Collapse" : "Expand"}
        </button>
      </div>
      <div
        aria-hidden={!isOpen}
        className={
          isOpen
            ? "df-form-stack df-collapsible-section-content"
            : "df-form-stack df-collapsible-section-content is-collapsed"
        }
        id={`${sectionId}-content`}
      >
        {children}
      </div>
    </section>
  );
}

export function buildSetupDraft(state: DayFrameState, timestamp: string): SetupDraft {
  const shiftCycles =
    state.shiftCycles.length > 0
      ? cloneShiftCycles(state.shiftCycles)
      : [createDraftShiftCycle(state, timestamp, 1)];

  return {
    schedulingPreferences: {
      ...state.schedulingPreferences,
    },
    previewRange: {
      ...state.previewRange,
    },
    shiftDefinitions: cloneShiftDefinitions(state.shiftDefinitions),
    shiftCycles,
    templateEntries: buildDraftEntries(state),
  };
}

function buildDraftEntries(state: DayFrameState): SetupDraftEntry[] {
  return state.blockTemplates.map((template) => ({
    template: {
      ...template,
      requiresWorkAnchor: template.requiresWorkAnchor ?? false,
      externalResources: [...template.externalResources],
    },
    recurrence: normalizeRecurrence(
      state.blockRecurrences.find((recurrence) => recurrence.blockTemplateId === template.id) ??
        createDefaultRecurrence(template.id),
    ),
  }));
}

function cloneShiftDefinitions(shiftDefinitions: ShiftDefinition[]): ShiftDefinition[] {
  return shiftDefinitions.map((shiftDefinition) => ({
    ...shiftDefinition,
    workDays: [...shiftDefinition.workDays],
  }));
}

function cloneShiftCycles(shiftCycles: ShiftCycle[]): ShiftCycle[] {
  return shiftCycles.map((shiftCycle) => ({
    ...shiftCycle,
    segments: shiftCycle.segments.map((segment) => ({
      ...segment,
      ...(segment.schedulePreferences
        ? {
            schedulePreferences: {
              ...segment.schedulePreferences,
            },
          }
        : {}),
    })),
  }));
}

function cloneRecurrence(recurrence: BlockRecurrence): BlockRecurrence {
  return {
    ...recurrence,
    ...(recurrence.weekdays ? { weekdays: [...recurrence.weekdays] } : {}),
  };
}

function normalizeRecurrence(recurrence: BlockRecurrence): BlockRecurrence {
  const nextRecurrence = cloneRecurrence(recurrence);

  if (
    nextRecurrence.frequency === "specificWeekdays" &&
    weekdays.every((weekday) => nextRecurrence.weekdays?.includes(weekday))
  ) {
    return {
      id: nextRecurrence.id,
      blockTemplateId: nextRecurrence.blockTemplateId,
      frequency: "daily",
    };
  }

  return nextRecurrence;
}

function createDefaultRecurrence(blockTemplateId: string): BlockRecurrence {
  return {
    id: `rec_${blockTemplateId}`,
    blockTemplateId,
    frequency: "daily",
  };
}

function createDraftShiftDefinition(
  currentDrafts: ShiftDefinition[],
  shiftCycles: ShiftCycle[],
): ShiftDefinition {
  const timestamp = createIsoTimestamp();

  return {
    id: `shift_${currentDrafts.length + 1}`,
    userId: currentDrafts[0]?.userId ?? shiftCycles[0]?.userId ?? "user_001",
    name: `Shift ${currentDrafts.length + 1}`,
    startTime: "09:00",
    endTime: "17:00",
    workDays: ["monday"],
    crossesMidnight: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createDraftShiftCycle(
  state: DayFrameState,
  timestamp: string,
  nextIndex: number,
): ShiftCycle {
  return {
    id: `cycle_${String(nextIndex).padStart(3, "0")}`,
    userId: state.shiftDefinitions[0]?.userId ?? "user_001",
    name: `Cycle ${nextIndex}`,
    type: "fixedSegments",
    startsOnDate: "2026-05-01",
    endsOnDate: "2026-05-31",
    segments:
      state.shiftDefinitions.length > 0
        ? [
            createDraftSegmentBase(
              `cycle_${String(nextIndex).padStart(3, "0")}`,
              state.shiftDefinitions[0]!.id,
              1,
            ),
          ]
        : [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createDraftShiftCycleFromDraft(draft: SetupDraft, nextIndex: number): ShiftCycle {
  const timestamp = createIsoTimestamp();

  return {
    id: `cycle_${String(nextIndex).padStart(3, "0")}`,
    userId: draft.shiftDefinitions[0]?.userId ?? draft.shiftCycles[0]?.userId ?? "user_001",
    name: `Cycle ${nextIndex}`,
    type: "fixedSegments",
    startsOnDate: "2026-05-01",
    endsOnDate: "2026-05-31",
    segments:
      draft.shiftDefinitions.length > 0
        ? [
            createDraftSegmentBase(
              `cycle_${String(nextIndex).padStart(3, "0")}`,
              draft.shiftDefinitions[0]!.id,
              1,
            ),
          ]
        : [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createDraftSegment(
  shiftCycle: ShiftCycle,
  shiftDefinitions: ShiftDefinition[],
  nextIndex: number,
): ShiftSegment {
  const fallbackShiftDefinitionId =
    shiftDefinitions[0]?.id ?? shiftCycle.segments[0]?.shiftDefinitionId ?? "";

  return createDraftSegmentBase(shiftCycle.id, fallbackShiftDefinitionId, nextIndex);
}

function createDraftSegmentBase(
  shiftCycleId: string,
  shiftDefinitionId: string,
  nextIndex: number,
): ShiftSegment {
  const nextMonthDay = String(nextIndex).padStart(2, "0");
  const nextDate = `2026-05-${nextMonthDay}` as LocalDateString;

  return {
    id: `segment_${nextIndex}`,
    shiftCycleId,
    shiftDefinitionId,
    startsOnDate: nextDate,
    endsOnDate: nextDate,
  };
}

function createDraftTemplateEntry(
  currentEntries: SetupDraftEntry[],
  shiftCycles: ShiftCycle[],
): SetupDraftEntry {
  const timestamp = createIsoTimestamp();
  const nextIndex = currentEntries.length + 1;
  const templateId = `template_${nextIndex}`;
  const userId = currentEntries[0]?.template.userId ?? shiftCycles[0]?.userId ?? "user_001";

  return {
    template: {
      id: templateId,
      userId,
      title: `Template ${nextIndex}`,
      category: "optional",
      requiresWorkAnchor: false,
      placementType: "flexible",
      durationMinutes: 60,
      priority: 3,
      preferredWindow: "anyAvailable",
      rescheduleBehavior: "askUser",
      requiresResource: false,
      externalResources: [],
      enabled: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    recurrence: {
      id: `rec_template_${nextIndex}`,
      blockTemplateId: templateId,
      frequency: "daily",
    },
  };
}

function updateOptionalSegmentField(
  shiftSegment: ShiftSegment,
  field: "notes",
  nextValue: string,
): ShiftSegment {
  const nextSegment = {
    ...shiftSegment,
  };

  delete nextSegment[field];

  return nextValue
    ? {
        ...nextSegment,
        [field]: nextValue,
      }
    : nextSegment;
}

function updateSegmentSchedulePreferences(
  shiftSegment: ShiftSegment,
  partialPreferences: {
    dayBoundaryStartTime?: TimeString | null;
    weekStartsOn?: Weekday | null;
  },
): ShiftSegment {
  const nextPreferences = {
    ...(shiftSegment.schedulePreferences ?? {}),
  };

  if ("dayBoundaryStartTime" in partialPreferences) {
    if (partialPreferences.dayBoundaryStartTime === null) {
      delete nextPreferences.dayBoundaryStartTime;
    } else if (partialPreferences.dayBoundaryStartTime !== undefined) {
      nextPreferences.dayBoundaryStartTime = partialPreferences.dayBoundaryStartTime;
    }
  }

  if ("weekStartsOn" in partialPreferences) {
    if (partialPreferences.weekStartsOn === null) {
      delete nextPreferences.weekStartsOn;
    } else if (partialPreferences.weekStartsOn !== undefined) {
      nextPreferences.weekStartsOn = partialPreferences.weekStartsOn;
    }
  }

  if (Object.keys(nextPreferences).length === 0) {
    const nextSegment = {
      ...shiftSegment,
    };

    delete nextSegment.schedulePreferences;

    return nextSegment;
  }

  return {
    ...shiftSegment,
    schedulePreferences: nextPreferences,
  };
}

function updateTemplateOptionalNumberField(
  template: BlockTemplate,
  field: "bufferBeforeMinutes" | "bufferAfterMinutes",
  nextValue: number | undefined,
): BlockTemplate {
  const nextTemplate = {
    ...template,
  };

  delete nextTemplate[field];

  return nextValue === undefined
    ? nextTemplate
    : {
        ...nextTemplate,
        [field]: nextValue,
      };
}

function updateTemplateOptionalTimeField(
  template: BlockTemplate,
  field: "fixedStartTime" | "customWindowStartTime" | "customWindowEndTime",
  nextValue: TimeString | null,
): BlockTemplate {
  const nextTemplate = {
    ...template,
  };

  delete nextTemplate[field];

  return nextValue === null
    ? nextTemplate
    : {
        ...nextTemplate,
        [field]: nextValue,
      };
}

function toggleWeekday(workdays: Weekday[], weekday: Weekday): Weekday[] {
  if (workdays.includes(weekday)) {
    return workdays.filter((currentWeekday) => currentWeekday !== weekday);
  }

  return [...workdays, weekday];
}

function formatPreferredWindowLabel(preferredWindow: PreferredWindow): string {
  switch (preferredWindow) {
    case "afterWaking":
      return "After waking";
    case "beforeWork":
      return "Before work";
    case "afterWork":
      return "After work";
    case "beforeSleep":
      return "Before day boundary";
    case "anyAvailable":
      return "Any available";
    case "custom":
      return "Custom";
  }
}

function formatRescheduleBehaviorLabel(rescheduleBehavior: RescheduleBehavior): string {
  switch (rescheduleBehavior) {
    case "autoSameDay":
      return "Same day";
    case "autoSameUserWeek":
      return "Same user week";
    case "askUser":
      return "Ask user";
    case "skip":
      return "Skip";
  }
}

function formatRecurrenceFrequencyLabel(frequency: RecurrenceFrequency): string {
  switch (frequency) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "specificWeekdays":
      return "Specific weekdays";
    case "timesPerUserWeek":
      return "Times per user week";
    case "perShiftSegment":
      return "Per shift segment";
    case "custom":
      return "Custom";
  }
}

function formatPreviewRangePresetLabel(preset: DayFramePreviewRangePreset): string {
  switch (preset) {
    case "threeDays":
      return "3 days";
    case "oneWeek":
      return "1 week";
    case "twoWeeks":
      return "2 weeks";
    case "oneMonth":
      return "1 month";
    case "custom":
      return "Custom";
  }
}

function getPreviewRangeSource(
  previewRange: DayFramePreviewRange,
): NonNullable<DayFramePreviewRange["source"]> {
  if (previewRange.source) {
    return previewRange.source;
  }

  return previewRange.preset === "custom" ? "custom" : "preset";
}

function buildCyclePreviewRange(draft: SetupDraft): DayFramePreviewRange {
  const cycleRange = getDraftShiftCyclesRange(draft.shiftCycles);

  return {
    ...draft.previewRange,
    source: "cycle",
    startDate: cycleRange?.startDate ?? draft.previewRange.startDate,
    endDate: cycleRange?.endDate ?? draft.previewRange.endDate,
  };
}

function getDraftShiftCyclesRange(
  shiftCycles: ShiftCycle[],
): { startDate: LocalDateString; endDate: LocalDateString } | null {
  if (shiftCycles.length === 0) {
    return null;
  }

  return shiftCycles.reduce(
    (currentRange, shiftCycle) => ({
      startDate:
        shiftCycle.startsOnDate < currentRange.startDate
          ? shiftCycle.startsOnDate
          : currentRange.startDate,
      endDate:
        (shiftCycle.endsOnDate ?? shiftCycle.startsOnDate) > currentRange.endDate
          ? (shiftCycle.endsOnDate ?? shiftCycle.startsOnDate)
          : currentRange.endDate,
    }),
    {
      startDate: shiftCycles[0]!.startsOnDate,
      endDate: shiftCycles[0]!.endsOnDate ?? shiftCycles[0]!.startsOnDate,
    },
  );
}

function formatWeekdayLabel(weekday: Weekday): string {
  return weekday.slice(0, 1).toUpperCase() + weekday.slice(1);
}

function createDateForTime(time: `${number}:${number}`, nextDay = false): Date {
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(2026, 4, nextDay ? 4 : 3, hours ?? 0, minutes ?? 0, 0, 0);
}

function deriveCrossesMidnight(
  shiftDefinition: Pick<ShiftDefinition, "startTime" | "endTime">,
): boolean {
  return shiftDefinition.endTime <= shiftDefinition.startTime;
}

function createIsoTimestamp(): string {
  return new Date().toISOString();
}

function calculatePreviewRangeEndDate(
  startDate: LocalDateString,
  preset: DayFramePreviewRangePreset,
): LocalDateString {
  const start = createDateFromLocalDate(startDate);

  switch (preset) {
    case "threeDays":
      return createLocalDateString(addDays(start, 2));
    case "oneWeek":
      return createLocalDateString(addDays(start, 6));
    case "twoWeeks":
      return createLocalDateString(addDays(start, 13));
    case "oneMonth":
      return createLocalDateString(addDays(start, 29));
    case "custom":
      return startDate;
  }
}

function createDateFromLocalDate(localDate: LocalDateString): Date {
  const [year, month, day] = localDate.split("-").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function createLocalDateString(date: Date): LocalDateString {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}` as LocalDateString;
}
