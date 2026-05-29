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
  const previewSummary = stateSnapshot.preview
    ? buildCompactPreviewSummary(stateSnapshot.preview, getNow())
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
    resetShellMessages();
  }

  function openPreviewScreen(): void {
    setCurrentScreen("preview");
    resetShellMessages();
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
    setPreviewGuardrailMissingItems([]);
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
                    <button className="df-action-button" onClick={openPreviewScreen} type="button">
                      Open Full Preview
                    </button>
                  </div>

                  <button
                    aria-label="Open compact preview summary"
                    className="df-compact-preview-card"
                    onClick={openPreviewScreen}
                    type="button"
                  >
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
                        <span className="df-compact-preview-day" key={dayItem.date}>
                          <strong>{dayItem.weekday}</strong>
                          <span>{dayItem.dayNumber}</span>
                        </span>
                      ))}
                    </div>
                  </button>
                </section>
              ) : null}
            </section>
          </div>
        </header>

        {currentScreen === "setup" ? (
          <SetupScreen
            draft={setupDraft}
            onSave={saveCurrentSetup}
            saveMessage={setupSaveMessage}
            setDraft={(nextDraft) => {
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
              getDayBoundaryStartTimeForUserDayDate={(userDayDate) =>
                resolveEffectiveSchedulePreferencesForUserDayDate({
                  shiftCycle: stateSnapshot.shiftCycle,
                  defaultSchedulingPreferences: stateSnapshot.schedulingPreferences,
                  userDayDate: userDayDate as `${number}-${number}-${number}`,
                }).dayBoundaryStartTime
              }
              now={getNow()}
              onApplySuggestedFix={(input) => {
                storeRef.current.applySuggestedFixToPreview({
                  ...input,
                  revisedAt: getRevisedAt(),
                });
              }}
              preview={stateSnapshot.preview}
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
    date: string;
    weekday: string;
    dayNumber: string;
  }>;
};

function buildCompactPreviewSummary(
  preview: NonNullable<DayFrameState["preview"]>,
  now: Date,
): CompactPreviewSummary {
  const visibleFrictionCount = preview.result.frictionPoints.filter(
    (frictionPoint) => !frictionPoint.ignored,
  ).length;
  const dayItems = buildPreviewDayItems(preview.rangeStartDate, preview.rangeEndDate);

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
  startDate: LocalDateString,
  endDate: LocalDateString,
): CompactPreviewSummary["dayItems"] {
  const dayItems: CompactPreviewSummary["dayItems"] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const date = createCompactPreviewDateFromLocalDate(currentDate);

    dayItems.push({
      date: currentDate,
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: String(date.getDate()),
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
