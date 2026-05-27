import { useEffect, useRef, useState, type ChangeEvent, type ReactElement } from "react";

import type { BlockRecurrence, BlockTemplate } from "../core/blocks/types.js";
import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../core/cycles/resolveEffectiveSchedulePreferences.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import type { LocalDateString, ShiftDefinition } from "../core/shifts/types.js";
import { parseDayFrameBackupJson, type DayFrameBackupV1 } from "../state/dayFrameBackup.js";
import { createDayFrameStore } from "../state/dayFrameStore.js";
import type {
  DayFramePreviewRange,
  DayFrameState,
  DayFrameStore,
  GeneratePreviewActionInput,
} from "../state/types.js";
import { PreviewScreen } from "./PreviewScreen.js";
import { SetupScreen, buildSetupDraft, type SetupDraft } from "./SetupScreen.js";
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

  return (
    <div className="df-app">
      <div className="df-shell">
        <header className="df-shell-header">
          <div className="df-shell-toolbar">
            <div className="df-brand">
              <h1>DayFrame</h1>
              <p className="df-shell-subtitle">Built for life that does not run 9 to 5.</p>
              <p className="df-support">
                Set up your shifts, connect them to a cycle, add repeatable life blocks, then
                generate a preview.
              </p>
            </div>
            <div className="df-confirmation">
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
            </div>
          </div>

          <nav aria-label="App Sections" className="df-nav">
            <button
              onClick={() => {
                setCurrentScreen("setup");
                setSetupSaveMessage("");
                setPreviewGuardrailMissingItems([]);
                setIsConfirmingClearLocalData(false);
                setClearLocalDataMessage("");
                setBackupMessage("");
                setBackupErrorMessage("");
                setProfileMessage("");
                setProfileErrorMessage("");
              }}
              type="button"
            >
              Setup
            </button>
            <button
              onClick={() => {
                setCurrentScreen("preview");
                setSetupSaveMessage("");
                setPreviewGuardrailMissingItems([]);
                setIsConfirmingClearLocalData(false);
                setClearLocalDataMessage("");
                setBackupMessage("");
                setBackupErrorMessage("");
                setProfileMessage("");
                setProfileErrorMessage("");
              }}
              type="button"
            >
              Preview
            </button>
          </nav>
        </header>

        {currentScreen === "setup" ? (
          <SetupScreen
            draft={setupDraft}
            onSave={() => {
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
            }}
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
                  onClick={() => {
                    const missingItems = getMissingPreviewSetupItems(storeRef.current.getState());

                    if (missingItems.length > 0) {
                      setPreviewGuardrailMissingItems(missingItems);
                      return;
                    }

                    const previewWindow =
                      getPreviewWindow?.() ??
                      createPreviewWindowFromRange(storeRef.current.getState().previewRange);

                    storeRef.current.generatePreview({
                      planningWindowStart: previewWindow.planningWindowStart,
                      planningWindowEnd: previewWindow.planningWindowEnd,
                      generatedAt: getGeneratedAt(),
                    });
                    setPreviewGuardrailMissingItems([]);
                  }}
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
  previewRange: DayFramePreviewRange,
): Pick<GeneratePreviewActionInput, "planningWindowStart" | "planningWindowEnd"> {
  return {
    planningWindowStart: createDateAtStartOfDay(previewRange.startDate),
    planningWindowEnd: createDateAtEndOfDay(previewRange.endDate),
  };
}

function createDateAtStartOfDay(localDate: LocalDateString): Date {
  const [year, month, day] = localDate.split("-").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
}

function createDateAtEndOfDay(localDate: LocalDateString): Date {
  const [year, month, day] = localDate.split("-").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 23, 59, 0, 0);
}
