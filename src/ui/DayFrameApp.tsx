import { useEffect, useRef, useState, type ChangeEvent, type ReactElement } from "react";

import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../core/cycles/resolveEffectiveSchedulePreferences.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import type { LocalDateString, ShiftDefinition } from "../core/shifts/types.js";
import { parseDayFrameBackupJson, type DayFrameBackupV1 } from "../state/dayFrameBackup.js";
import { createDayFrameStore } from "../state/dayFrameStore.js";
import type { DayFrameState, DayFrameStore, GeneratePreviewActionInput } from "../state/types.js";
import { PreviewScreen } from "./PreviewScreen.js";
import { SetupScreen, buildSetupDraft, type SetupDraft } from "./SetupScreen.js";
import { formatPlanningWindow, formatPreviewTimestamp } from "./timeDisplay.js";
import "./dayFrameUi.css";

export type DayFrameAppStore = Pick<
  DayFrameStore,
  | "getState"
  | "subscribe"
  | "saveProfile"
  | "loadProfile"
  | "deleteProfile"
  | "clearLocalData"
  | "exportBackup"
  | "importBackup"
  | "setSchedulingPreferences"
  | "setPreviewRange"
  | "setShiftDefinitions"
  | "setShiftCycle"
  | "setBlockTemplates"
  | "setBlockRecurrences"
  | "generatePreview"
  | "applySuggestedFixToPreview"
>;

type DayFrameScreen = "setup" | "preview";
type SelectedPreviewDayRange = {
  startDate: LocalDateString;
  endDate: LocalDateString;
} | null;

export type DayFrameAppProps = {
  store?: DayFrameAppStore;
  getGeneratedAt?: () => string;
  getRevisedAt?: () => string;
  getExportedAt?: () => string;
  getNow?: () => Date;
  getPreviewWindow?: () => Pick<
    GeneratePreviewActionInput,
    "planningWindowStart" | "planningWindowEnd"
  >;
};

export function DayFrameApp({
  store,
  getGeneratedAt = createIsoTimestamp,
  getRevisedAt = createIsoTimestamp,
  getExportedAt = createIsoTimestamp,
  getNow = () => new Date(),
  getPreviewWindow,
}: DayFrameAppProps): ReactElement {
  const storeRef = useRef<DayFrameAppStore>(store ?? createSeededDayFrameStore());
  const importInputRef = useRef<FileInputLike | null>(null);
  const now = getNow();
  const [stateSnapshot, setStateSnapshot] = useState<DayFrameState>(() =>
    storeRef.current.getState(),
  );
  const [setupDraft, setSetupDraft] = useState<SetupDraft>(() =>
    buildSetupDraft(storeRef.current.getState(), createIsoTimestamp()),
  );
  const [setupSaveMessage, setSetupSaveMessage] = useState("");
  const [currentScreen, setCurrentScreen] = useState<DayFrameScreen>("setup");
  const [previewGuardrailMissingItems, setPreviewGuardrailMissingItems] = useState<string[]>([]);
  const [isConfirmingClearLocalData, setIsConfirmingClearLocalData] = useState(false);
  const [clearLocalDataMessage, setClearLocalDataMessage] = useState("");
  const [backupMessage, setBackupMessage] = useState("");
  const [backupErrorMessage, setBackupErrorMessage] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [selectedPreviewDayRange, setSelectedPreviewDayRange] =
    useState<SelectedPreviewDayRange>(null);
  const [pendingPreviewRangeStartDate, setPendingPreviewRangeStartDate] =
    useState<LocalDateString | null>(null);
  const [focusedTemplateField, setFocusedTemplateField] = useState<{
    templateId: string;
    field: "fixedStartTime";
  } | null>(null);
  const getDayBoundaryStartTimeForUserDayDate = (userDayDate: string) =>
    resolveEffectiveSchedulePreferencesForUserDayDate({
      shiftCycle: stateSnapshot.shiftCycle,
      defaultSchedulingPreferences: stateSnapshot.schedulingPreferences,
      userDayDate: userDayDate as `${number}-${number}-${number}`,
    }).dayBoundaryStartTime;
  const previewSummary = stateSnapshot.preview
    ? buildCompactPreviewSummary(stateSnapshot.preview, now, getDayBoundaryStartTimeForUserDayDate)
    : null;

  useEffect(() => {
    return storeRef.current.subscribe((nextState) => {
      setStateSnapshot(nextState);
    });
  }, []);

  useEffect(() => {
    setSetupDraft(buildSetupDraft(stateSnapshot, createIsoTimestamp()));
  }, [
    stateSnapshot.schedulingPreferences,
    stateSnapshot.previewRange,
    stateSnapshot.shiftDefinitions,
    stateSnapshot.shiftCycle,
    stateSnapshot.blockTemplates,
    stateSnapshot.blockRecurrences,
  ]);

  function resetShellMessages(): void {
    setSetupSaveMessage("");
    setPreviewGuardrailMissingItems([]);
    setIsConfirmingClearLocalData(false);
    setClearLocalDataMessage("");
    setBackupMessage("");
    setBackupErrorMessage("");
    setProfileMessage("");
    setProfileErrorMessage("");
  }

  function openSetupScreen(): void {
    setCurrentScreen("setup");
    setFocusedTemplateField(null);
    resetShellMessages();
  }

  function openPreviewScreen(): void {
    setCurrentScreen("preview");
    setFocusedTemplateField(null);
    resetShellMessages();
  }

  function openFullPreviewScreen(): void {
    clearPreviewSelection();
    openPreviewScreen();
  }

  function clearPreviewSelection(): void {
    setSelectedPreviewDayRange(null);
    setPendingPreviewRangeStartDate(null);
  }

  function saveCurrentSetup(): void {
    const savedAt = createIsoTimestamp();

    storeRef.current.setSchedulingPreferences(setupDraft.schedulingPreferences);
    storeRef.current.setPreviewRange(setupDraft.previewRange);
    storeRef.current.setShiftDefinitions(
      setupDraft.shiftDefinitions.map((shiftDefinition) => ({
        ...shiftDefinition,
        updatedAt: savedAt,
      })),
    );
    storeRef.current.setShiftCycle({
      ...setupDraft.shiftCycle,
      updatedAt: savedAt,
    });
    storeRef.current.setBlockTemplates(
      setupDraft.templateEntries.map((entry) => ({
        ...entry.template,
        updatedAt: savedAt,
      })),
    );
    storeRef.current.setBlockRecurrences(
      setupDraft.templateEntries.map((entry) => ({
        ...entry.recurrence,
      })),
    );
    setFocusedTemplateField(null);
    setSetupSaveMessage("Setup saved.");
  }

  function generatePreviewFromSavedState(): void {
    const currentState = storeRef.current.getState();
    const missingItems = getMissingPreviewSetupItems(currentState);

    if (missingItems.length > 0) {
      setPreviewGuardrailMissingItems(missingItems);
      return;
    }

    const previewWindow = getPreviewWindow?.() ?? createPreviewWindowFromRange(currentState);

    storeRef.current.generatePreview({
      rangeStartDate: currentState.previewRange.startDate,
      rangeEndDate: currentState.previewRange.endDate,
      planningWindowStart: previewWindow.planningWindowStart,
      planningWindowEnd: previewWindow.planningWindowEnd,
      generatedAt: getGeneratedAt(),
    });
    clearPreviewSelection();
    setPreviewGuardrailMissingItems([]);
  }

  function openSetupForFixedTime(templateId: string): void {
    setCurrentScreen("setup");
    setFocusedTemplateField({
      templateId,
      field: "fixedStartTime",
    });
    resetShellMessages();
  }

  function handleCompactPreviewDayClick(userDayDate: LocalDateString): void {
    const currentSelection = selectedPreviewDayRange;

    if (
      currentSelection === null ||
      currentSelection.startDate !== currentSelection.endDate ||
      pendingPreviewRangeStartDate === null
    ) {
      setSelectedPreviewDayRange({
        startDate: userDayDate,
        endDate: userDayDate,
      });
      setPendingPreviewRangeStartDate(userDayDate);
    } else if (pendingPreviewRangeStartDate === userDayDate) {
      setSelectedPreviewDayRange({
        startDate: userDayDate,
        endDate: userDayDate,
      });
    } else {
      setSelectedPreviewDayRange(orderPreviewDayRange(pendingPreviewRangeStartDate, userDayDate));
      setPendingPreviewRangeStartDate(null);
    }

    setCurrentScreen("preview");
    setFocusedTemplateField(null);
    resetShellMessages();
  }

  function handlePreviewSuggestedFix(input: {
    selectedFrictionPointId: string;
    selectedSuggestedFixId: string;
  }): void {
    const preview = stateSnapshot.preview;

    if (!preview) {
      return;
    }

    const selectedSuggestedFix = findPreviewSuggestedFix(
      preview,
      input.selectedFrictionPointId,
      input.selectedSuggestedFixId,
    );

    if (selectedSuggestedFix?.action === "changeFixedTime") {
      const fixedTimeTemplateId = findFixedTimeTemplateId(
        preview,
        input.selectedFrictionPointId,
        input.selectedSuggestedFixId,
      );

      if (fixedTimeTemplateId) {
        openSetupForFixedTime(fixedTimeTemplateId);
        return;
      }
    }

    storeRef.current.applySuggestedFixToPreview({
      ...input,
      revisedAt: getRevisedAt(),
    });
  }

  return (
    <div className="df-app">
      <div className="df-shell">
        <header className="df-shell-header">
          <div className="df-shell-header-grid">
            <section className="df-confirmation">
              <div className="df-form-stack">
                <div className="df-screen-header">
                  <h2 className="df-panel-title">Saved Setup Profiles</h2>
                  <p className="df-support">
                    Save named local setups, then load one later to replace the current active
                    setup.
                  </p>
                </div>
                <div className="df-field">
                  <label htmlFor="dayframe-profile-name">Profile Name</label>
                  <input
                    id="dayframe-profile-name"
                    onChange={(event) => {
                      setProfileName((event.target as unknown as { value: string }).value);
                      setProfileMessage("");
                      setProfileErrorMessage("");
                    }}
                    placeholder="Profile name"
                    type="text"
                    value={profileName}
                  />
                </div>
                <div className="df-screen-actions">
                  <button
                    className="df-secondary-button"
                    onClick={() => {
                      try {
                        storeRef.current.saveProfile({
                          name: profileName,
                          savedAt: getExportedAt(),
                        });
                        setProfileMessage("Current setup saved as a local profile.");
                        setProfileErrorMessage("");
                        setProfileName("");
                      } catch (error) {
                        setProfileMessage("");
                        setProfileErrorMessage(getProfileErrorMessage(error));
                      }
                    }}
                    type="button"
                  >
                    Save Current Setup as Profile
                  </button>
                </div>
                {stateSnapshot.savedProfiles.length === 0 ? (
                  <p className="df-support">No saved profiles yet.</p>
                ) : (
                  <ul className="df-plain-list">
                    {stateSnapshot.savedProfiles.map((savedProfile) => (
                      <li key={savedProfile.id}>
                        <div>
                          <strong>{savedProfile.name}</strong>
                          <span className="df-muted"> Saved {savedProfile.savedAt}</span>
                        </div>
                        <div className="df-screen-actions">
                          <button
                            className="df-secondary-button"
                            onClick={() => {
                              storeRef.current.loadProfile(savedProfile.id);
                              setCurrentScreen("setup");
                              clearPreviewSelection();
                              setSetupSaveMessage("");
                              setProfileMessage(`Loaded profile "${savedProfile.name}".`);
                              setProfileErrorMessage("");
                              setBackupMessage("");
                              setBackupErrorMessage("");
                              setClearLocalDataMessage("");
                              setPreviewGuardrailMissingItems([]);
                              setIsConfirmingClearLocalData(false);
                            }}
                            type="button"
                          >
                            Load Profile
                          </button>
                          <button
                            className="df-secondary-button"
                            onClick={() => {
                              storeRef.current.deleteProfile(savedProfile.id);
                              setProfileMessage(`Deleted profile "${savedProfile.name}".`);
                              setProfileErrorMessage("");
                            }}
                            type="button"
                          >
                            Delete Profile
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="df-screen-actions">
                <button
                  className="df-secondary-button"
                  onClick={() => {
                    const backup = storeRef.current.exportBackup(getExportedAt());

                    downloadDayFrameBackup(backup);
                    setBackupMessage("DayFrame setup backup downloaded.");
                    setBackupErrorMessage("");
                    setProfileMessage("");
                    setProfileErrorMessage("");
                    setIsConfirmingClearLocalData(false);
                    setClearLocalDataMessage("");
                  }}
                  type="button"
                >
                  Export Setup Backup
                </button>
                <button
                  className="df-secondary-button"
                  onClick={() => {
                    importInputRef.current?.click();
                  }}
                  type="button"
                >
                  Import Setup Backup
                </button>
                <button
                  className="df-secondary-button"
                  onClick={() => {
                    setIsConfirmingClearLocalData(true);
                    setSetupSaveMessage("");
                    setClearLocalDataMessage("");
                    setBackupMessage("");
                    setBackupErrorMessage("");
                    setProfileMessage("");
                    setProfileErrorMessage("");
                  }}
                  type="button"
                >
                  Clear Local Data
                </button>
              </div>
              <input
                accept="application/json,.json"
                aria-label="Import Setup Backup File"
                hidden
                onChange={async (event) => {
                  await handleBackupFileSelection(
                    event,
                    storeRef.current,
                    setBackupMessage,
                    setBackupErrorMessage,
                    setSetupSaveMessage,
                    setProfileMessage,
                    setProfileErrorMessage,
                    setClearLocalDataMessage,
                    setCurrentScreen,
                    clearPreviewSelection,
                    setPreviewGuardrailMissingItems,
                    setIsConfirmingClearLocalData,
                  );
                }}
                ref={(node) => {
                  importInputRef.current = node as unknown as FileInputLike | null;
                }}
                type="file"
              />
              {isConfirmingClearLocalData ? (
                <div className="df-form-stack">
                  <p className="df-danger-message">Clear all locally saved DayFrame setup data?</p>
                  <div className="df-confirmation-actions">
                    <button
                      className="df-danger-button"
                      onClick={() => {
                        storeRef.current.clearLocalData();
                        setCurrentScreen("setup");
                        clearPreviewSelection();
                        setSetupSaveMessage("");
                        setPreviewGuardrailMissingItems([]);
                        setIsConfirmingClearLocalData(false);
                        setClearLocalDataMessage(
                          "Local DayFrame setup data cleared from this device.",
                        );
                        setBackupMessage("");
                        setBackupErrorMessage("");
                        setProfileMessage("");
                        setProfileErrorMessage("");
                        setProfileName("");
                      }}
                      type="button"
                    >
                      Confirm Clear Local Data
                    </button>
                    <button
                      className="df-secondary-button"
                      onClick={() => {
                        setIsConfirmingClearLocalData(false);
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : clearLocalDataMessage ? (
                <p className="df-success-message">{clearLocalDataMessage}</p>
              ) : backupErrorMessage ? (
                <p className="df-danger-message">{backupErrorMessage}</p>
              ) : backupMessage ? (
                <p className="df-success-message">{backupMessage}</p>
              ) : profileErrorMessage ? (
                <p className="df-danger-message">{profileErrorMessage}</p>
              ) : profileMessage ? (
                <p className="df-success-message">{profileMessage}</p>
              ) : (
                <p className="df-support">
                  Save named profiles locally, or export and import authored setup as JSON. Preview
                  data is not included.
                </p>
              )}
            </section>

            <section className="df-workflow-panel">
              <div className="df-brand">
                <h1>DayFrame</h1>
                <p className="df-shell-subtitle">Built for life that does not run 9 to 5.</p>
                <p className="df-support">
                  Set up your shifts, connect them to a cycle, add repeatable life blocks, then
                  generate a preview.
                </p>
              </div>

              <div className="df-workflow-status">
                <p className="df-workflow-eyebrow">Workspace</p>
                <h2 className="df-panel-title">
                  {currentScreen === "setup" ? "Setup your schedule inputs" : "Review your preview"}
                </h2>
                <p className="df-support">
                  {currentScreen === "setup"
                    ? "Save edits in Setup, then switch to Preview when you're ready to generate or review a schedule draft."
                    : "Use Preview to generate a schedule draft from your saved setup and review any friction that needs attention."}
                </p>
              </div>

              <nav aria-label="App Sections" className="df-primary-nav">
                <button
                  aria-label="Setup"
                  aria-pressed={currentScreen === "setup"}
                  className={
                    currentScreen === "setup"
                      ? "df-primary-nav-button is-active"
                      : "df-primary-nav-button"
                  }
                  onClick={openSetupScreen}
                  type="button"
                >
                  <span className="df-primary-nav-title">Setup</span>
                  <span aria-hidden="true" className="df-primary-nav-detail">
                    Edit shifts, cycle, templates, and range
                  </span>
                </button>
                <button
                  aria-label="Preview"
                  aria-pressed={currentScreen === "preview"}
                  className={
                    currentScreen === "preview"
                      ? "df-primary-nav-button is-active"
                      : "df-primary-nav-button"
                  }
                  onClick={openPreviewScreen}
                  type="button"
                >
                  <span className="df-primary-nav-title">Preview</span>
                  <span aria-hidden="true" className="df-primary-nav-detail">
                    Generate and review a draft schedule
                  </span>
                </button>
              </nav>

              {previewSummary ? (
                <section className="df-compact-preview" aria-labelledby="compact-preview-heading">
                  <div className="df-compact-preview-header">
                    <div className="df-screen-header">
                      <p className="df-workflow-eyebrow">Latest Preview</p>
                      <h2 className="df-panel-title" id="compact-preview-heading">
                        {previewSummary.frictionLabel}
                      </h2>
                      <p className="df-support">
                        {previewSummary.rangeLabel} · Generated {previewSummary.generatedLabel}
                      </p>
                    </div>
                    <button
                      className="df-action-button"
                      onClick={openFullPreviewScreen}
                      type="button"
                    >
                      Open Full Preview
                    </button>
                  </div>

                  <div className="df-compact-preview-card">
                    <div className="df-compact-preview-metrics">
                      <div className="df-compact-preview-metric">
                        <strong>Planning Range</strong>
                        <span>{previewSummary.rangeLabel}</span>
                      </div>
                      <div className="df-compact-preview-metric">
                        <strong>Generated</strong>
                        <span>{previewSummary.generatedLabel}</span>
                      </div>
                      <div className="df-compact-preview-metric">
                        <strong>Visible Days</strong>
                        <span>{previewSummary.visibleDayCount}</span>
                      </div>
                      <div className="df-compact-preview-metric">
                        <strong>Friction</strong>
                        <span>{previewSummary.frictionLabel}</span>
                      </div>
                    </div>

                    <div className="df-compact-preview-days">
                      {previewSummary.dayItems.map((dayItem) => (
                        <button
                          aria-current={dayItem.isToday ? "date" : undefined}
                          aria-label={buildCompactPreviewDayAriaLabel(dayItem)}
                          aria-pressed={isUserDayDateWithinSelection(
                            dayItem.date,
                            selectedPreviewDayRange,
                          )}
                          className={buildCompactPreviewDayClassName(
                            dayItem,
                            selectedPreviewDayRange,
                          )}
                          key={dayItem.date}
                          onClick={() => {
                            handleCompactPreviewDayClick(dayItem.date);
                          }}
                          type="button"
                        >
                          <strong>{dayItem.weekday}</strong>
                          <span>{dayItem.dayNumber}</span>
                          {dayItem.hasFriction ? (
                            <span aria-hidden="true" className="df-compact-preview-day-marker">
                              !
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null}
            </section>
          </div>
        </header>

        {currentScreen === "setup" ? (
          <SetupScreen
            draft={setupDraft}
            focusedTemplateField={focusedTemplateField}
            onSave={saveCurrentSetup}
            saveMessage={setupSaveMessage}
            setDraft={(nextDraft) => {
              setFocusedTemplateField(null);
              setSetupSaveMessage("");
              setSetupDraft(nextDraft);
            }}
          />
        ) : null}
        {currentScreen === "preview" ? (
          <div className="df-screen">
            <div className="df-panel">
              <div className="df-screen-header">
                <h1 className="df-screen-title">Preview</h1>
                <p className="df-screen-subtitle">
                  Generate a draft schedule preview from your saved shifts, cycle, and templates.
                </p>
              </div>
              <div className="df-screen-actions">
                <button
                  className="df-action-button"
                  onClick={generatePreviewFromSavedState}
                  type="button"
                >
                  Generate Schedule Preview
                </button>
              </div>
              <p className="df-support">
                Preview uses your current setup only. It does not export or save anything to your
                calendar.
              </p>
              {previewGuardrailMissingItems.length > 0 ? (
                <div className="df-form-stack">
                  <p className="df-danger-message">Finish setup before generating a preview:</p>
                  <ul className="df-plain-list">
                    {previewGuardrailMissingItems.map((missingItem) => (
                      <li key={missingItem}>{missingItem}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <PreviewScreen
              getDayBoundaryStartTimeForUserDayDate={getDayBoundaryStartTimeForUserDayDate}
              now={now}
              onApplySuggestedFix={handlePreviewSuggestedFix}
              preview={stateSnapshot.preview}
              visibleRangeEndDate={selectedPreviewDayRange?.endDate ?? null}
              visibleRangeStartDate={selectedPreviewDayRange?.startDate ?? null}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

type CompactPreviewSummary = {
  rangeLabel: string;
  generatedLabel: string;
  visibleDayCount: number;
  frictionLabel: string;
  dayItems: Array<{
    date: LocalDateString;
    weekday: string;
    dayNumber: string;
    hasFriction: boolean;
    isToday: boolean;
  }>;
};

function buildCompactPreviewSummary(
  preview: NonNullable<DayFrameState["preview"]>,
  now: Date,
  getDayBoundaryStartTimeForUserDayDate: (userDayDate: string) => string,
): CompactPreviewSummary {
  const visibleFrictionCount = preview.result.frictionPoints.filter(
    (frictionPoint) => !frictionPoint.ignored,
  ).length;
  const dayItems = buildPreviewDayItems(preview, now, getDayBoundaryStartTimeForUserDayDate);

  return {
    rangeLabel: formatPlanningWindow(
      createCompactPreviewDateFromLocalDate(preview.rangeStartDate),
      createCompactPreviewDateFromLocalDate(preview.rangeEndDate),
    ),
    generatedLabel: formatPreviewTimestamp(preview.generatedAt, now),
    visibleDayCount: dayItems.length,
    frictionLabel: visibleFrictionCount === 0 ? "No friction" : `${visibleFrictionCount} friction`,
    dayItems,
  };
}

function buildPreviewDayItems(
  preview: NonNullable<DayFrameState["preview"]>,
  now: Date,
  getDayBoundaryStartTimeForUserDayDate: (userDayDate: string) => string,
): CompactPreviewSummary["dayItems"] {
  const dayItems: CompactPreviewSummary["dayItems"] = [];
  const frictionDates = getCompactPreviewFrictionDates(
    preview,
    getDayBoundaryStartTimeForUserDayDate,
  );
  const todayDateString = toLocalDateString(now);
  let currentDate = preview.rangeStartDate;

  while (currentDate <= preview.rangeEndDate) {
    const date = createCompactPreviewDateFromLocalDate(currentDate);

    dayItems.push({
      date: currentDate,
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: String(date.getDate()),
      hasFriction: frictionDates.has(currentDate),
      isToday: currentDate === todayDateString,
    });
    currentDate = addCompactPreviewDaysToLocalDate(currentDate, 1);
  }

  return dayItems;
}

function createCompactPreviewDateFromLocalDate(localDate: LocalDateString): Date {
  const [year, month, day] = localDate.split("-").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);
}

function addCompactPreviewDaysToLocalDate(
  localDate: LocalDateString,
  days: number,
): LocalDateString {
  const nextDate = createCompactPreviewDateFromLocalDate(localDate);

  nextDate.setDate(nextDate.getDate() + days);

  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(
    nextDate.getDate(),
  ).padStart(2, "0")}` as LocalDateString;
}

function getCompactPreviewFrictionDates(
  preview: NonNullable<DayFrameState["preview"]>,
  getDayBoundaryStartTimeForUserDayDate: (userDayDate: string) => string,
): Set<LocalDateString> {
  const visibleUserDayDates = new Set<LocalDateString>();
  const frictionDates = new Set<LocalDateString>();
  let currentDate = preview.rangeStartDate;

  while (currentDate <= preview.rangeEndDate) {
    visibleUserDayDates.add(currentDate);
    currentDate = addCompactPreviewDaysToLocalDate(currentDate, 1);
  }

  for (const frictionPoint of preview.result.frictionPoints.filter(
    (currentFrictionPoint) => !currentFrictionPoint.ignored,
  )) {
    const resolvedDate = resolveCompactPreviewFrictionDate(
      frictionPoint,
      preview,
      visibleUserDayDates,
      getDayBoundaryStartTimeForUserDayDate,
    );

    if (resolvedDate) {
      frictionDates.add(resolvedDate);
    }
  }

  return frictionDates;
}

function resolveCompactPreviewFrictionDate(
  frictionPoint: NonNullable<DayFrameState["preview"]>["result"]["frictionPoints"][number],
  preview: NonNullable<DayFrameState["preview"]>,
  visibleUserDayDates: Set<LocalDateString>,
  getDayBoundaryStartTimeForUserDayDate: (userDayDate: string) => string,
): LocalDateString | null {
  for (const userDayDate of visibleUserDayDates) {
    const dayBoundaryStartTime = getDayBoundaryStartTimeForUserDayDate(userDayDate);

    const overlapsScheduledBlock = preview.result.scheduledBlocks.some(
      (scheduledBlock) =>
        frictionPoint.affectedBlockIds.includes(scheduledBlock.id) &&
        overlapsCompactPreviewUserDay(
          scheduledBlock.startsAt,
          scheduledBlock.endsAt,
          userDayDate,
          dayBoundaryStartTime,
        ),
    );

    if (overlapsScheduledBlock) {
      return userDayDate;
    }

    const overlapsWorkBlock = preview.result.generatedWorkBlocks.some(
      (workBlock) =>
        frictionPoint.affectedBlockIds.includes(workBlock.id) &&
        overlapsCompactPreviewUserDay(
          workBlock.startsAt,
          workBlock.endsAt,
          userDayDate,
          dayBoundaryStartTime,
        ),
    );

    if (overlapsWorkBlock) {
      return userDayDate;
    }

    const containsUnplacedCandidate = preview.result.unplacedCandidates.some(
      (candidate) =>
        frictionPoint.affectedBlockIds.includes(candidate.id) &&
        candidate.userDayDate === userDayDate,
    );

    if (containsUnplacedCandidate) {
      return userDayDate;
    }
  }

  if (
    frictionPoint.affectedUserDayDate &&
    visibleUserDayDates.has(frictionPoint.affectedUserDayDate)
  ) {
    return frictionPoint.affectedUserDayDate;
  }

  return null;
}

function overlapsCompactPreviewUserDay(
  startsAt: Date,
  endsAt: Date,
  userDayDate: LocalDateString,
  dayBoundaryStartTime: string,
): boolean {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const [hours, minutes] = dayBoundaryStartTime.split(":").map(Number);
  const userDayStart = new Date(
    year ?? 2026,
    (month ?? 1) - 1,
    day ?? 1,
    hours ?? 0,
    minutes ?? 0,
    0,
    0,
  );
  const userDayEnd = new Date(userDayStart);

  userDayEnd.setDate(userDayEnd.getDate() + 1);

  return startsAt.getTime() < userDayEnd.getTime() && endsAt.getTime() > userDayStart.getTime();
}

function toLocalDateString(date: Date): LocalDateString {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}` as LocalDateString;
}

function orderPreviewDayRange(
  leftDate: LocalDateString,
  rightDate: LocalDateString,
): NonNullable<SelectedPreviewDayRange> {
  return leftDate <= rightDate
    ? { startDate: leftDate, endDate: rightDate }
    : { startDate: rightDate, endDate: leftDate };
}

function isUserDayDateWithinSelection(
  userDayDate: LocalDateString,
  selection: SelectedPreviewDayRange,
): boolean {
  return (
    selection !== null && userDayDate >= selection.startDate && userDayDate <= selection.endDate
  );
}

function buildCompactPreviewDayClassName(
  dayItem: CompactPreviewSummary["dayItems"][number],
  selection: SelectedPreviewDayRange,
): string {
  return [
    "df-compact-preview-day",
    isUserDayDateWithinSelection(dayItem.date, selection) ? "is-selected" : "",
    dayItem.hasFriction ? "is-conflict" : "",
    dayItem.isToday ? "is-today" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildCompactPreviewDayAriaLabel(
  dayItem: CompactPreviewSummary["dayItems"][number],
): string {
  const date = createCompactPreviewDateFromLocalDate(dayItem.date);
  const labelParts = [
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  ];

  if (dayItem.hasFriction) {
    labelParts.push("has friction");
  }

  if (dayItem.isToday) {
    labelParts.push("today");
  }

  return labelParts.join(", ");
}

function findPreviewSuggestedFix(
  preview: NonNullable<DayFrameState["preview"]>,
  frictionPointId: string,
  suggestedFixId: string,
) {
  return preview.result.frictionPoints
    .find((frictionPoint) => frictionPoint.id === frictionPointId)
    ?.suggestedFixes.find((suggestedFix) => suggestedFix.id === suggestedFixId);
}

function findFixedTimeTemplateId(
  preview: NonNullable<DayFrameState["preview"]>,
  frictionPointId: string,
  suggestedFixId: string,
): string | null {
  const frictionPoint = preview.result.frictionPoints.find(
    (currentFrictionPoint) => currentFrictionPoint.id === frictionPointId,
  );

  if (!frictionPoint) {
    return null;
  }

  const targetedScheduledBlock = preview.result.scheduledBlocks.find(
    (currentScheduledBlock) =>
      currentScheduledBlock.placementType === "fixed" &&
      currentScheduledBlock.templateId !== undefined &&
      suggestedFixId === `fix_change_fixed_time_${currentScheduledBlock.id}`,
  );

  if (targetedScheduledBlock?.templateId) {
    return targetedScheduledBlock.templateId;
  }

  const scheduledBlock = preview.result.scheduledBlocks.find(
    (currentScheduledBlock) =>
      frictionPoint.affectedBlockIds.includes(currentScheduledBlock.id) &&
      currentScheduledBlock.placementType === "fixed" &&
      currentScheduledBlock.templateId,
  );

  return scheduledBlock?.templateId ?? null;
}

function createSeededDayFrameStore(): DayFrameStore {
  const seededStore = createDayFrameStore();

  seededStore.setShiftDefinitions(createDemoShiftDefinitions());
  seededStore.setShiftCycle(createDemoShiftCycle());
  seededStore.setBlockTemplates(createDemoBlockTemplates());
  seededStore.setBlockRecurrences(createDemoBlockRecurrences());

  return seededStore;
}

function createDemoShiftDefinitions(): ShiftDefinition[] {
  return [
    {
      id: "shift_day",
      userId: "user_001",
      name: "Day Shift",
      startTime: "05:45",
      endTime: "14:15",
      workDays: ["monday"],
      crossesMidnight: false,
      createdAt: "2026-05-03T00:00:00-05:00",
      updatedAt: "2026-05-03T00:00:00-05:00",
    },
  ];
}

function createDemoShiftCycle(): ShiftCycle {
  return {
    id: "cycle_001",
    userId: "user_001",
    name: "Day Rotation",
    type: "fixedSegments",
    startsOnDate: "2026-05-01",
    endsOnDate: "2026-05-31",
    segments: [
      {
        id: "segment_day",
        shiftCycleId: "cycle_001",
        shiftDefinitionId: "shift_day",
        startsOnDate: "2026-05-01",
        endsOnDate: "2026-05-31",
        schedulePreferences: {
          dayBoundaryStartTime: "03:00",
          weekStartsOn: "monday",
        },
      },
    ],
    createdAt: "2026-05-03T00:00:00-05:00",
    updatedAt: "2026-05-03T00:00:00-05:00",
  };
}

function createDemoBlockTemplates(): BlockTemplate[] {
  return [
    {
      id: "default_sleep",
      userId: "user_001",
      title: "Sleep",
      category: "sleep",
      placementType: "flexible",
      durationMinutes: 480,
      bufferAfterMinutes: 60,
      priority: 1,
      preferredWindow: "beforeWork",
      rescheduleBehavior: "autoSameUserWeek",
      requiresResource: false,
      externalResources: [],
      enabled: true,
      createdAt: "2026-05-03T00:00:00-05:00",
      updatedAt: "2026-05-03T00:00:00-05:00",
    },
    {
      id: "template_errands",
      userId: "user_001",
      title: "Errands",
      category: "admin",
      placementType: "flexible",
      durationMinutes: 60,
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 15,
      priority: 3,
      preferredWindow: "afterWork",
      rescheduleBehavior: "autoSameDay",
      requiresResource: false,
      externalResources: [],
      enabled: true,
      createdAt: "2026-05-03T00:00:00-05:00",
      updatedAt: "2026-05-03T00:00:00-05:00",
    },
  ];
}

function createDemoBlockRecurrences(): BlockRecurrence[] {
  return [
    {
      id: "rec_sleep",
      blockTemplateId: "default_sleep",
      frequency: "daily",
    },
    {
      id: "rec_errands",
      blockTemplateId: "template_errands",
      frequency: "specificWeekdays",
      weekdays: ["monday"],
    },
  ];
}

function createIsoTimestamp(): GeneratePreviewActionInput["generatedAt"] {
  return new Date().toISOString();
}

async function handleBackupFileSelection(
  event: ChangeEvent<HTMLInputElement>,
  store: DayFrameAppStore,
  setBackupMessage: (message: string) => void,
  setBackupErrorMessage: (message: string) => void,
  setSetupSaveMessage: (message: string) => void,
  setProfileMessage: (message: string) => void,
  setProfileErrorMessage: (message: string) => void,
  setClearLocalDataMessage: (message: string) => void,
  setCurrentScreen: (screen: DayFrameScreen) => void,
  clearPreviewSelection: () => void,
  setPreviewGuardrailMissingItems: (items: string[]) => void,
  setIsConfirmingClearLocalData: (value: boolean) => void,
): Promise<void> {
  const input = event.target as unknown as FileInputLike;
  const file = input.files?.[0];

  input.value = "";

  if (!file) {
    return;
  }

  try {
    const backup = parseDayFrameBackupJson(await file.text());

    store.importBackup(backup);
    setBackupMessage("DayFrame setup backup imported.");
    setBackupErrorMessage("");
    setSetupSaveMessage("");
    setClearLocalDataMessage("");
    setProfileMessage("");
    setProfileErrorMessage("");
    setCurrentScreen("setup");
    clearPreviewSelection();
    setPreviewGuardrailMissingItems([]);
    setIsConfirmingClearLocalData(false);
  } catch (error) {
    setBackupMessage("");
    setClearLocalDataMessage("");
    setBackupErrorMessage(getBackupErrorMessage(error));
    setProfileMessage("");
  }
}

function downloadDayFrameBackup(backup: DayFrameBackupV1): void {
  const backupBlob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const downloadUrl = globalThis.URL.createObjectURL(backupBlob);
  const documentLike = globalThis as {
    document?: {
      createElement: (tagName: string) => DownloadAnchorLike;
    };
  };
  const anchor = documentLike.document?.createElement("a");

  if (!anchor) {
    throw new RangeError("Backup download is not available in this environment.");
  }

  anchor.href = downloadUrl;
  anchor.download = `dayframe-backup-${backup.exportedAt.slice(0, 10)}.json`;
  anchor.click();

  globalThis.URL.revokeObjectURL(downloadUrl);
}

function getBackupErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Backup file could not be imported.";
}

function getProfileErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Saved profile action could not be completed.";
}

type FileInputLike = {
  click: () => void;
  files?: ArrayLike<{
    text: () => Promise<string>;
  }> | null;
  value: string;
};

type DownloadAnchorLike = {
  click: () => void;
  download: string;
  href: string;
};

function getMissingPreviewSetupItems(state: DayFrameState): string[] {
  const missingItems: string[] = [];
  const enabledTemplates = state.blockTemplates.filter((blockTemplate) => blockTemplate.enabled);
  const enabledTemplateIds = new Set(enabledTemplates.map((blockTemplate) => blockTemplate.id));
  const matchingRecurrences = state.blockRecurrences.filter((blockRecurrence) =>
    enabledTemplateIds.has(blockRecurrence.blockTemplateId),
  );

  if (state.shiftDefinitions.length === 0) {
    missingItems.push("Add at least one shift definition.");
  }

  if (state.shiftCycle === null) {
    missingItems.push("Add an active shift cycle.");
  }

  if (enabledTemplates.length === 0) {
    missingItems.push("Add or include at least one block template.");
  }

  if (enabledTemplates.length > 0 && matchingRecurrences.length === 0) {
    missingItems.push("Add at least one block recurrence.");
  }

  return missingItems;
}

function createPreviewWindowFromRange(
  state: Pick<DayFrameState, "previewRange" | "shiftCycle" | "schedulingPreferences">,
): Pick<GeneratePreviewActionInput, "planningWindowStart" | "planningWindowEnd"> {
  const startDate = state.previewRange.startDate;
  const exclusiveEndUserDayDate = addDaysToLocalDate(state.previewRange.endDate, 1);

  return {
    planningWindowStart: createUserDayBoundaryDate({
      userDayDate: startDate,
      shiftCycle: state.shiftCycle,
      schedulingPreferences: state.schedulingPreferences,
    }),
    planningWindowEnd: createUserDayBoundaryDate({
      userDayDate: exclusiveEndUserDayDate,
      shiftCycle: state.shiftCycle,
      schedulingPreferences: state.schedulingPreferences,
    }),
  };
}

function createUserDayBoundaryDate(input: {
  userDayDate: LocalDateString;
  shiftCycle: ShiftCycle | null;
  schedulingPreferences: DayFrameState["schedulingPreferences"];
}): Date {
  const [year, month, day] = input.userDayDate.split("-").map(Number);
  const effectivePreferences = resolveEffectiveSchedulePreferencesForUserDayDate({
    shiftCycle: input.shiftCycle,
    defaultSchedulingPreferences: input.schedulingPreferences,
    userDayDate: input.userDayDate,
  });
  const [hours, minutes] = effectivePreferences.dayBoundaryStartTime.split(":").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, 0, 0);
}

function addDaysToLocalDate(localDate: LocalDateString, days: number): LocalDateString {
  const [year, month, day] = localDate.split("-").map(Number);
  const nextDate = new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);

  nextDate.setDate(nextDate.getDate() + days);

  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(
    nextDate.getDate(),
  ).padStart(2, "0")}` as LocalDateString;
}
