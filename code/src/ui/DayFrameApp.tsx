import { useEffect, useRef, useState, type ChangeEvent, type ReactElement } from "react";

import type { ManualCalendarEvent } from "../core/calendar/types.js";
import { allocateReadableSourceId } from "../core/authored/allocateReadableSourceId.js";
import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../core/cycles/resolveEffectiveSchedulePreferences.js";
import { createPlanDecisionAcceptanceCandidate } from "../core/decisions/createPlanDecisionAcceptanceCandidate.js";
import type { AcceptPlanDecisionInput, PlanDecisionV1 } from "../core/decisions/planDecision.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import type { LocalDateString } from "../core/shifts/types.js";
import { parseDayFrameBackupJson, type DayFrameBackupV2 } from "../state/dayFrameBackup.js";
import { createDayFrameStore } from "../state/dayFrameStore.js";
import {
  classifyClearLocalDataResult,
  classifyActiveStoreMutationResult,
  classifyDurabilityRetryResult,
  classifyStoreDurabilityStatus,
  classifyStoreMutationResult,
  type ClearDurabilitySemanticClassification,
  type DurabilitySemanticCategory,
} from "../state/durabilitySemantics.js";
import type {
  ActiveLocalAbandonmentRecoveryResult,
  ActiveLocalIngressStatus,
  ActiveLocalReplacementRecoveryResult,
  DayFrameState,
  DayFrameStore,
  GeneratePreviewActionInput,
  StoreDurabilityStatus,
  ProfileIngressStatus,
  ProfileMutationResult,
  QuarantinedProfileEntry,
  SurfaceDurabilityStatus,
} from "../state/types.js";
import type { PlanDecisionIngressStatus } from "../state/planDecisionSurface.js";
import { PreviewScreen } from "./PreviewScreen.js";
import { buildAcceptedDecisionViewModels } from "./acceptedDecisionPresentation.js";
import { getPreviewRangeWarnings } from "./previewRangeWarnings.js";
import {
  SetupScreen,
  buildSetupDraft,
  buildSetupLifecycleTransaction,
  type SetupDraft,
} from "./SetupScreen.js";
import { formatPlanningWindow, formatPreviewTimestamp } from "./timeDisplay.js";
import "./dayFrameUi.css";

export type DayFrameAppStore = Pick<
  DayFrameStore,
  | "getState"
  | "getDurabilityStatus"
  | "getActiveLocalIngressStatus"
  | "getProfileIngressStatus"
  | "getQuarantinedProfiles"
  | "exportProtectedProfileSource"
  | "exportQuarantinedProfile"
  | "recheckProtectedProfileSource"
  | "retryActivePersistence"
  | "retryProfilePersistence"
  | "subscribeDurability"
  | "subscribeActiveLocalIngress"
  | "subscribeProfileIngress"
  | "subscribe"
  | "replaceProtectedActiveCheckpointWithCurrentState"
  | "abandonProtectedActiveCheckpointAndReset"
  | "replaceProtectedProfileCheckpointWithCurrentProfiles"
  | "abandonProtectedProfileCheckpoint"
  | "removeQuarantinedProfile"
  | "commitAuthoredSetupTransaction"
  | "saveProfile"
  | "loadProfile"
  | "deleteProfile"
  | "clearLocalData"
  | "exportBackup"
  | "importBackup"
  | "mutateManualEvent"
  | "generatePreview"
  | "applySuggestedFixToPreview"
  | "acceptPlanDecision"
  | "retryPlanDecisionPersistence"
  | "getPlanDecisionDurabilityStatus"
  | "getPlanDecisionIngressStatus"
  | "subscribePlanDecisionDurability"
  | "subscribePlanDecisionIngress"
  | "getPlanDecisions"
  | "subscribePlanDecisions"
  | "removePlanDecision"
>;

type DayFrameScreen = "setup" | "preview";
type ProfileDurabilityFeedback = {
  category: DurabilitySemanticCategory;
  operation: "save" | "load" | "delete";
  profileName: string;
};
type SelectedPreviewDayRange = {
  startDate: LocalDateString;
  endDate: LocalDateString;
} | null;
type PendingPlanDecisionAcceptance = { candidate: AcceptPlanDecisionInput };
type PlanDecisionWorkflowFeedback = { message: string; tone: "info" | "warning" };

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

function PersistentDurabilityAwareness({
  activeRecoveryProtected,
  onRetryActive,
  onRetryProfiles,
  status,
}: {
  activeRecoveryProtected: boolean;
  onRetryActive: () => void;
  onRetryProfiles: () => void;
  status: StoreDurabilityStatus;
}): ReactElement | null {
  const semantics = classifyStoreDurabilityStatus(status);
  const activeMessage = getPersistentDurabilityMessage("activeState", semantics.activeState);
  const profilesMessage = getPersistentDurabilityMessage("profiles", semantics.profiles);

  if (!activeMessage && !profilesMessage) {
    return null;
  }

  return (
    <section
      aria-labelledby="dayframe-durability-awareness-heading"
      className="df-confirmation df-workflow-block"
    >
      <div className="df-screen-header">
        <p className="df-workflow-eyebrow">Local save status</p>
        <h2 className="df-panel-title" id="dayframe-durability-awareness-heading">
          Some changes are not durably saved
        </h2>
      </div>
      <ul className="df-plain-list">
        {activeMessage ? (
          <li className="df-danger-message">
            <p>{activeMessage}</p>
            {isRetryableDurabilitySemantic(semantics.activeState) && !activeRecoveryProtected ? (
              <button className="df-secondary-button" onClick={onRetryActive} type="button">
                Retry active setup durability
              </button>
            ) : null}
          </li>
        ) : null}
        {profilesMessage ? (
          <li className="df-danger-message">
            <p>{profilesMessage}</p>
            {isRetryableDurabilitySemantic(semantics.profiles) ? (
              <button className="df-secondary-button" onClick={onRetryProfiles} type="button">
                Retry saved profiles durability
              </button>
            ) : null}
          </li>
        ) : null}
      </ul>
    </section>
  );
}

export function DayFrameApp({
  store,
  getGeneratedAt = createIsoTimestamp,
  getRevisedAt = createIsoTimestamp,
  getExportedAt = createIsoTimestamp,
  getNow = () => new Date(),
  getPreviewWindow,
}: DayFrameAppProps): ReactElement {
  const internalStoreRef = useRef<DayFrameAppStore | null>(null);
  const activeStore = store ?? internalStoreRef.current ?? createDayFrameStore();

  if (!store && internalStoreRef.current === null) {
    internalStoreRef.current = activeStore;
  }
  const storeRef = useRef<DayFrameAppStore>(activeStore);
  storeRef.current = activeStore;
  const importInputRef = useRef<FileInputLike | null>(null);
  const now = getNow();
  const [stateSnapshot, setStateSnapshot] = useState<DayFrameState>(() => activeStore.getState());
  const [durabilityStatus, setDurabilityStatus] = useState<StoreDurabilityStatus>(() =>
    activeStore.getDurabilityStatus(),
  );
  const [activeLocalIngressStatus, setActiveLocalIngressStatus] =
    useState<ActiveLocalIngressStatus>(() => activeStore.getActiveLocalIngressStatus());
  const [profileIngressStatus, setProfileIngressStatus] = useState<ProfileIngressStatus>(() =>
    activeStore.getProfileIngressStatus());
  const [quarantineEntries, setQuarantineEntries] = useState<QuarantinedProfileEntry[]>(() =>
    activeStore.getQuarantinedProfiles());
  const [pendingProfileRecovery, setPendingProfileRecovery] = useState<
    "replace" | "abandon" | string | null>(null);
  const [profileRecoveryMessage, setProfileRecoveryMessage] = useState("");
  const [pendingActiveLocalRecovery, setPendingActiveLocalRecovery] = useState<
    "replace" | "abandon" | null
  >(null);
  const [activeLocalRecoveryMessage, setActiveLocalRecoveryMessage] = useState("");
  const [setupDraft, setSetupDraft] = useState<SetupDraft>(() =>
    buildSetupDraft(activeStore.getState(), createIsoTimestamp()),
  );
  const [setupDurabilityFeedback, setSetupDurabilityFeedback] =
    useState<DurabilitySemanticCategory | null>(null);
  const [setupValidationMessage, setSetupValidationMessage] = useState("");
  const [currentScreen, setCurrentScreen] = useState<DayFrameScreen>("setup");
  const [previewGuardrailMissingItems, setPreviewGuardrailMissingItems] = useState<string[]>([]);
  const [isConfirmingClearLocalData, setIsConfirmingClearLocalData] = useState(false);
  const [clearDurabilityFeedback, setClearDurabilityFeedback] =
    useState<ClearDurabilitySemanticClassification | null>(null);
  const [backupMessage, setBackupMessage] = useState("");
  const [backupDurabilityFeedback, setBackupDurabilityFeedback] =
    useState<DurabilitySemanticCategory | null>(null);
  const [backupErrorMessage, setBackupErrorMessage] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileDurabilityFeedback, setProfileDurabilityFeedback] =
    useState<ProfileDurabilityFeedback | null>(null);
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [selectedPreviewDayRange, setSelectedPreviewDayRange] =
    useState<SelectedPreviewDayRange>(null);
  const [pendingPreviewRangeStartDate, setPendingPreviewRangeStartDate] =
    useState<LocalDateString | null>(null);
  const [focusedTemplateField, setFocusedTemplateField] = useState<{
    templateId: string;
    field: "fixedStartTime";
  } | null>(null);
  const [activeManualEventDate, setActiveManualEventDate] = useState<LocalDateString | null>(null);
  const [editingManualEventId, setEditingManualEventId] = useState<string | null>(null);
  const [manualEventDraft, setManualEventDraft] = useState<{
    title: string;
    userDayDate: LocalDateString;
    allDay: boolean;
    startTime: string;
    endTime: string;
    notes: string;
  } | null>(null);
  const [confirmingDeleteManualEventId, setConfirmingDeleteManualEventId] = useState<string | null>(
    null,
  );
  const [manualEventDurabilityFeedback, setManualEventDurabilityFeedback] =
    useState<DurabilitySemanticCategory | null>(null);
  const [manualEventValidationMessage, setManualEventValidationMessage] = useState("");
  const [pendingPlanDecisionAcceptance, setPendingPlanDecisionAcceptance] =
    useState<PendingPlanDecisionAcceptance | null>(null);
  const [planDecisionFeedback, setPlanDecisionFeedback] =
    useState<PlanDecisionWorkflowFeedback | null>(null);
  const [planDecisionDurability, setPlanDecisionDurability] = useState<SurfaceDurabilityStatus>(() =>
    activeStore.getPlanDecisionDurabilityStatus());
  const [planDecisionIngress, setPlanDecisionIngress] = useState<PlanDecisionIngressStatus>(() =>
    activeStore.getPlanDecisionIngressStatus());
  const [planDecisions, setPlanDecisions] = useState<PlanDecisionV1[]>(() =>
    activeStore.getPlanDecisions());
  const getDayBoundaryStartTimeForUserDayDate = (userDayDate: string) =>
    resolveEffectiveSchedulePreferencesForUserDayDate({
      shiftCycles: stateSnapshot.shiftCycles,
      defaultSchedulingPreferences: stateSnapshot.schedulingPreferences,
      userDayDate: userDayDate as `${number}-${number}-${number}`,
    }).dayBoundaryStartTime;
  const previewSummary = stateSnapshot.preview
    ? buildCompactPreviewSummary(stateSnapshot.preview, now, getDayBoundaryStartTimeForUserDayDate)
    : null;
  const activePreviewDayDetails =
    stateSnapshot.preview && activeManualEventDate
      ? buildPreviewDayDetails(
          stateSnapshot.preview,
          activeManualEventDate,
          getDayBoundaryStartTimeForUserDayDate,
        )
      : null;
  const manualEventsForActiveDate = activeManualEventDate
    ? stateSnapshot.manualEvents.filter(
        (manualEvent) => manualEvent.userDayDate === activeManualEventDate,
      )
    : [];
  const isSetupDirty = hasUnsavedSetupChanges(setupDraft, stateSnapshot);
  const savedRangeWarnings = getPreviewRangeWarnings({
    previewRange: stateSnapshot.previewRange,
    schedulingPreferences: stateSnapshot.schedulingPreferences,
    shiftCycles: stateSnapshot.shiftCycles,
    shiftDefinitions: stateSnapshot.shiftDefinitions,
    blockTemplates: stateSnapshot.blockTemplates,
    blockRecurrences: stateSnapshot.blockRecurrences,
  });
  const acceptedDecisionViewModels = buildAcceptedDecisionViewModels({
    decisions: planDecisions,
    preview: stateSnapshot.preview,
    authoredSetup: stateSnapshot,
  });

  useEffect(() => {
    setStateSnapshot(activeStore.getState());
    setDurabilityStatus(activeStore.getDurabilityStatus());
    setActiveLocalIngressStatus(activeStore.getActiveLocalIngressStatus());
    setProfileIngressStatus(activeStore.getProfileIngressStatus());
    setQuarantineEntries(activeStore.getQuarantinedProfiles());
    setPlanDecisionDurability(activeStore.getPlanDecisionDurabilityStatus());
    setPlanDecisionIngress(activeStore.getPlanDecisionIngressStatus());
    setPlanDecisions(activeStore.getPlanDecisions());
    setPendingActiveLocalRecovery(null);
    setActiveLocalRecoveryMessage("");
    const unsubscribeState = activeStore.subscribe((nextState) => {
      setStateSnapshot(nextState);
    });
    const unsubscribeDurability = activeStore.subscribeDurability((nextStatus) => {
      setDurabilityStatus(nextStatus);
    });
    const unsubscribeActiveLocalIngress = activeStore.subscribeActiveLocalIngress((nextStatus) => {
      setActiveLocalIngressStatus(nextStatus);
    });
    const unsubscribeProfileIngress = activeStore.subscribeProfileIngress((nextStatus) => {
      setProfileIngressStatus(nextStatus);
      setQuarantineEntries(activeStore.getQuarantinedProfiles());
    });
    const unsubscribeDecisionDurability = activeStore.subscribePlanDecisionDurability(
      setPlanDecisionDurability,
    );
    const unsubscribeDecisions = activeStore.subscribePlanDecisions(setPlanDecisions);
    const unsubscribeDecisionIngress = activeStore.subscribePlanDecisionIngress((nextStatus) => {
      setPlanDecisionIngress(nextStatus);
      setPendingPlanDecisionAcceptance(null);
    });

    return () => {
      unsubscribeState();
      unsubscribeDurability();
      unsubscribeActiveLocalIngress();
      unsubscribeProfileIngress();
      unsubscribeDecisionDurability();
      unsubscribeDecisionIngress();
      unsubscribeDecisions();
    };
  }, [activeStore]);

  useEffect(() => {
    if (!stateSnapshot.preview || stateSnapshot.preview.isStale) setPendingPlanDecisionAcceptance(null);
  }, [stateSnapshot.preview]);

  useEffect(() => {
    if (activeLocalIngressStatus.status !== "recoveryRequired") {
      setPendingActiveLocalRecovery(null);
      setActiveLocalRecoveryMessage("");
    }
  }, [activeLocalIngressStatus.status]);

  useEffect(() => {
    setSetupDraft(buildSetupDraft(stateSnapshot, createIsoTimestamp()));
  }, [
    stateSnapshot.schedulingPreferences,
    stateSnapshot.previewRange,
    stateSnapshot.shiftDefinitions,
    stateSnapshot.shiftCycles,
    stateSnapshot.blockTemplates,
    stateSnapshot.blockRecurrences,
  ]);

  function resetShellMessages(): void {
    setSetupDurabilityFeedback(null);
    setSetupValidationMessage("");
    setPreviewGuardrailMissingItems([]);
    setIsConfirmingClearLocalData(false);
    setClearDurabilityFeedback(null);
    setBackupMessage("");
    setBackupDurabilityFeedback(null);
    setBackupErrorMessage("");
    setProfileMessage("");
    setProfileDurabilityFeedback(null);
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

  function saveCurrentSetup(showMessage = true): DayFrameState | null {
    const savedAt = createIsoTimestamp();
    const resolvedPreviewRange = resolvePreviewRangeFromSetupDraft(setupDraft);

    const result = storeRef.current.commitAuthoredSetupTransaction({
      authoredSetup: {
        schedulingPreferences: setupDraft.schedulingPreferences,
        previewRange: resolvedPreviewRange,
        shiftDefinitions: setupDraft.shiftDefinitions.map((shiftDefinition) => ({
          ...shiftDefinition,
          updatedAt: savedAt,
        })),
        shiftCycles: setupDraft.shiftCycles.map((shiftCycle) => ({
          ...shiftCycle,
          updatedAt: savedAt,
        })),
        blockTemplates: setupDraft.templateEntries.map((entry) => ({
          ...entry.template,
          updatedAt: savedAt,
        })),
        blockRecurrences: setupDraft.templateEntries.map((entry) => ({
          ...entry.recurrence,
        })),
      },
      lifecycle: buildSetupLifecycleTransaction(setupDraft),
    });
    setFocusedTemplateField(null);
    setPreviewGuardrailMissingItems([]);
    if (result.status === "rejected") {
      setSetupDurabilityFeedback(null);
      setSetupValidationMessage(
        "Setup contains conflicting or incomplete authored data and was not saved.",
      );
      return null;
    }

    setSetupValidationMessage("");
    setSetupDraft((currentDraft) => ({
      ...currentDraft,
      lifecycle: { created: [], deleted: [] },
    }));
    const durabilityFeedback = classifyActiveStoreMutationResult(result);

    setSetupDurabilityFeedback(showMessage ? durabilityFeedback : null);

    return result.state;
  }

  function generatePreviewFromState(currentState: DayFrameState): boolean {
    setPendingPlanDecisionAcceptance(null);
    const missingItems = getMissingPreviewSetupItems(currentState);

    if (missingItems.length > 0) {
      setPreviewGuardrailMissingItems(missingItems);
      return false;
    }

    const previewWindow = getPreviewWindow?.() ?? createPreviewWindowFromRange(currentState);

    storeRef.current.generatePreview({
      rangeStartDate: currentState.previewRange.startDate,
      rangeEndDate: currentState.previewRange.endDate,
      planningWindowStart: previewWindow.planningWindowStart,
      planningWindowEnd: previewWindow.planningWindowEnd,
      generatedAt: getGeneratedAt(),
    });
    if (
      selectedPreviewDayRange &&
      !isPreviewRangeWithinBounds(
        selectedPreviewDayRange,
        currentState.previewRange.startDate,
        currentState.previewRange.endDate,
      )
    ) {
      clearPreviewSelection();
    }
    setPreviewGuardrailMissingItems([]);
    return true;
  }

  function generatePreviewFromSavedState(): boolean {
    return generatePreviewFromState(storeRef.current.getState());
  }

  function generatePreviewFromCurrentDraft(): void {
    const savedState = saveCurrentSetup(false);

    if (!savedState) {
      return;
    }

    setCurrentScreen("preview");
    setFocusedTemplateField(null);
    setBackupMessage("");
    setBackupErrorMessage("");
    setProfileMessage("");
    setProfileErrorMessage("");
    setIsConfirmingClearLocalData(false);
    setClearDurabilityFeedback(null);
    generatePreviewFromState(savedState);
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
    openManualEventPanel(userDayDate);
    resetShellMessages();
  }

  function openManualEventPanel(userDayDate: LocalDateString): void {
    setActiveManualEventDate(userDayDate);
    const existingManualEvent = stateSnapshot.manualEvents.find(
      (manualEvent) => manualEvent.userDayDate === userDayDate,
    );

    if (existingManualEvent) {
      setEditingManualEventId(existingManualEvent.id);
      setManualEventDraft({
        title: existingManualEvent.title,
        userDayDate: existingManualEvent.userDayDate,
        allDay: existingManualEvent.allDay,
        startTime: existingManualEvent.startTime ?? "",
        endTime: existingManualEvent.endTime ?? "",
        notes: existingManualEvent.notes ?? "",
      });
      return;
    }

    setEditingManualEventId(null);
    setManualEventDraft({
      title: "",
      userDayDate,
      allDay: false,
      startTime: "09:00",
      endTime: "10:00",
      notes: "",
    });
  }

  function saveManualEvent(): void {
    if (!manualEventDraft) {
      return;
    }

    const timestamp = createIsoTimestamp();
    const nextManualEvent: ManualCalendarEvent = {
      id:
        editingManualEventId ??
        allocateReadableSourceId({
          prefix: "manual_event_",
          preferredId: `manual_event_${timestamp}`,
          occupiedIds: stateSnapshot.manualEvents.map((manualEvent) => manualEvent.id),
        }),
      title: manualEventDraft.title.trim() || "Untitled Event",
      userDayDate: manualEventDraft.userDayDate,
      allDay: manualEventDraft.allDay,
      ...(manualEventDraft.allDay
        ? {}
        : { startTime: manualEventDraft.startTime as `${number}:${number}` }),
      ...(manualEventDraft.allDay
        ? {}
        : { endTime: manualEventDraft.endTime as `${number}:${number}` }),
      ...(manualEventDraft.notes.trim() ? { notes: manualEventDraft.notes.trim() } : {}),
      createdAt:
        stateSnapshot.manualEvents.find(
          (manualEvent) => manualEvent.id === (editingManualEventId ?? ""),
        )?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    const result = storeRef.current.mutateManualEvent({
      operation: editingManualEventId ? "update" : "create",
      event: nextManualEvent,
    });
    if (result.status === "rejected") {
      setManualEventDurabilityFeedback(null);
      setManualEventValidationMessage(
        "This event conflicts with current authored data and was not saved.",
      );
      return;
    }

    setManualEventValidationMessage("");
    setManualEventDurabilityFeedback(classifyActiveStoreMutationResult(result));
    setEditingManualEventId(nextManualEvent.id);
    setManualEventDraft({
      title: nextManualEvent.title,
      userDayDate: nextManualEvent.userDayDate,
      allDay: nextManualEvent.allDay,
      startTime: nextManualEvent.startTime ?? "",
      endTime: nextManualEvent.endTime ?? "",
      notes: nextManualEvent.notes ?? "",
    });
    regeneratePreviewIfPresent();
  }

  function deleteManualEvent(eventId: string): void {
    const result = storeRef.current.mutateManualEvent({ operation: "delete", sourceId: eventId });
    if (result.status === "rejected") {
      setManualEventDurabilityFeedback(null);
      setManualEventValidationMessage(
        "This event change conflicts with current authored data and was not saved.",
      );
      return;
    }

    setManualEventValidationMessage("");
    setManualEventDurabilityFeedback(classifyActiveStoreMutationResult(result));
    setConfirmingDeleteManualEventId(null);
    setEditingManualEventId(null);
    if (activeManualEventDate) {
      openManualEventPanel(activeManualEventDate);
    }
    regeneratePreviewIfPresent();
  }

  function regeneratePreviewIfPresent(): void {
    if (!storeRef.current.getState().preview) {
      return;
    }

    generatePreviewFromSavedState();
  }

  function handlePreviewSuggestedFix(input: {
    selectedFrictionPointId: string;
    selectedSuggestedFixId: string;
  }): void {
    const preview = stateSnapshot.preview;

    if (!preview || preview.isStale) {
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

    setPendingPlanDecisionAcceptance(null);
    setPlanDecisionFeedback(null);
    const frictionPoint = preview.result.frictionPoints.find(
      (point) => point.id === input.selectedFrictionPointId,
    );
    const revisedState = storeRef.current.applySuggestedFixToPreview({
      ...input,
      revisedAt: getRevisedAt(),
    });
    if (!selectedSuggestedFix || !frictionPoint || !revisedState.preview) return;
    const mapped = createPlanDecisionAcceptanceCandidate({
      suggestedFix: selectedSuggestedFix,
      frictionPoint,
      originalPreview: preview.result,
      revisedPreview: revisedState.preview.result,
      authoredSetup: stateSnapshot,
    });
    if (mapped.status === "supported") {
      if (planDecisionIngress.status === "recoveryRequired") {
        setPlanDecisionFeedback({ tone: "warning",
          message: "Accepted choices are protected by recovery-required stored data and cannot be changed." });
        return;
      }
      setPendingPlanDecisionAcceptance({ candidate: structuredClone(mapped.candidate) });
    }
  }

  function acceptPendingPlanDecision(): void {
    const pending = pendingPlanDecisionAcceptance;
    const currentPreview = storeRef.current.getState().preview;
    if (!pending || !currentPreview || currentPreview.isStale) {
      setPendingPlanDecisionAcceptance(null);
      setPlanDecisionFeedback({ tone: "warning", message: "Regenerate the preview before accepting this choice." });
      return;
    }
    const result = storeRef.current.acceptPlanDecision(structuredClone(pending.candidate));
    if (result.status === "rejected") {
      const stale = result.reason === "targetSourceMissing" || result.reason === "targetLifetimeMismatch" ||
        result.reason === "targetOccurrenceMissing";
      if (stale) setPendingPlanDecisionAcceptance(null);
      setPlanDecisionFeedback({ tone: "warning", message: result.reason === "protectedDecisionIngress"
        ? "Accepted choices are protected by recovery-required stored data and cannot be changed."
        : stale ? "This choice is no longer current. Regenerate the preview and try again."
          : "DayFrame could not accept this choice." });
      return;
    }
    setPendingPlanDecisionAcceptance(null);
    const durable = result.persistence.status === "persisted";
    try {
      generatePreviewFromSavedState();
      const replay = storeRef.current.getState().preview?.result.planDecisionResults.find(
        (item) => item.decisionId === result.decision.id,
      );
      setPlanDecisionFeedback({ tone: replay?.status === "applied" ? "info" : "warning",
        message: describeAcceptedDecision(durable, replay?.status) });
    } catch {
      setPlanDecisionFeedback({ tone: "warning", message: durable
        ? "Accepted and saved, but the preview could not be regenerated."
        : "Accepted for this session, but saving and preview regeneration failed." });
    }
  }

  function retryPlanDecisionDurability(): void {
    const result = storeRef.current.retryPlanDecisionPersistence();
    const saved = result.status === "attempted" && result.persistence.status === "persisted";
    setPlanDecisionFeedback({ tone: saved ? "info" : "warning", message: saved
      ? "Accepted choice save retry succeeded."
      : "Accepted choice is still available for this session, but could not be saved." });
  }

  function removeAcceptedDecision(decisionId: Parameters<DayFrameAppStore["removePlanDecision"]>[0]): void {
    const preview = storeRef.current.getState().preview;
    const shouldRegenerate = preview !== null && !preview.isStale;
    const result = storeRef.current.removePlanDecision(decisionId);
    if (result.status === "notAttempted") {
      setPlanDecisionFeedback({ tone: "warning", message: result.reason === "protectedDecisionIngress"
        ? "Accepted choices are protected by recovery-required stored data and cannot be removed."
        : "That accepted choice is no longer present." });
      return;
    }
    const durable = result.persistence.status === "persisted";
    setPendingPlanDecisionAcceptance(null);
    setPlanDecisionFeedback({ tone: durable ? "info" : "warning", message: durable
      ? "Accepted choice removed and saved."
      : "Accepted choice removed for this session; saving failed. Retry before closing DayFrame." });
    if (shouldRegenerate) {
      try { generatePreviewFromSavedState(); }
      catch {
        setPlanDecisionFeedback({ tone: "warning", message: durable
          ? "Accepted choice was removed and saved, but the preview could not be regenerated."
          : "Accepted choice was removed for this session, but saving and preview regeneration failed." });
      }
    }
  }

  function retryActiveDurability(): void {
    const result = storeRef.current.retryActivePersistence();

    void classifyDurabilityRetryResult(result);
  }

  function retryProfileDurability(): void {
    const result = storeRef.current.retryProfilePersistence();

    void classifyDurabilityRetryResult(result);
  }

  function confirmActiveLocalReplacement(): void {
    setActiveLocalRecoveryMessage("");
    const result = storeRef.current.replaceProtectedActiveCheckpointWithCurrentState();
    setPendingActiveLocalRecovery(null);
    setActiveLocalRecoveryMessage(getReplacementRecoveryMessage(result));
  }

  function confirmActiveLocalAbandonment(): void {
    setActiveLocalRecoveryMessage("");
    const result = storeRef.current.abandonProtectedActiveCheckpointAndReset();
    setPendingActiveLocalRecovery(null);
    setActiveLocalRecoveryMessage(getAbandonmentRecoveryMessage(result));
  }

  function exportProtectedProfiles(): void {
    const result = storeRef.current.exportProtectedProfileSource();
    if (result.status !== "exported") {
      setProfileRecoveryMessage("The preserved profile source is not currently readable for export.");
      return;
    }
    downloadRecoveryData(result.raw, "dayframe-profile-recovery.json", false);
    setProfileRecoveryMessage("Preserved profile data exported. No saved data was changed.");
  }

  function recheckProtectedProfiles(): void {
    const result = storeRef.current.recheckProtectedProfileSource();
    setProfileRecoveryMessage(result === "unchanged"
      ? "The preserved profile source is unchanged and still needs an explicit recovery choice."
      : result === "sourceChanged"
        ? "Saved profile data changed outside DayFrame. Reload before choosing a recovery action."
        : "The preserved profile source could not be rechecked.");
  }

  function confirmProfileRecovery(action: "replace" | "abandon"): void {
    const result = action === "replace"
      ? storeRef.current.replaceProtectedProfileCheckpointWithCurrentProfiles()
      : storeRef.current.abandonProtectedProfileCheckpoint();
    setPendingProfileRecovery(null);
    if (result.status === "resolved") {
      setProfileRecoveryMessage(action === "replace"
        ? "Protected saved profiles were replaced with the current valid profile collection."
        : "Protected saved profiles were abandoned and an authoritative empty collection was saved.");
    } else if (result.status === "notAttempted" && result.reason === "sourceChanged") {
      setProfileRecoveryMessage(
        "Saved profile data changed outside DayFrame. Recovery was stopped; reload before choosing again.",
      );
    } else {
      setProfileRecoveryMessage("Profile recovery did not complete. The preserved source remains protected.");
    }
  }

  function exportQuarantine(entry: QuarantinedProfileEntry): void {
    const result = storeRef.current.exportQuarantinedProfile(entry.quarantineId);
    if (result.status !== "exported") return;
    downloadRecoveryData(JSON.stringify(result.entry, null, 2),
      `dayframe-quarantined-profile-${entry.originalProfileId ?? entry.quarantineId}.json`, false);
    setProfileRecoveryMessage("Quarantined profile entry exported. No saved data was changed.");
  }

  function confirmQuarantineRemoval(quarantineId: string): void {
    const result = storeRef.current.removeQuarantinedProfile(quarantineId);
    setPendingProfileRecovery(null);
    setQuarantineEntries(storeRef.current.getQuarantinedProfiles());
    setProfileRecoveryMessage(result.status === "removed"
      ? result.persistence.status === "persisted"
        ? "Quarantined profile entry permanently removed."
        : "Entry removed for this session, but the updated profile collection was not durably saved."
      : "The quarantined profile entry was not removed.");
  }

  return (
    <div className="df-app">
      <div className="df-shell">
        {profileIngressStatus.status === "recoveryRequired" ? (
          <section aria-labelledby="dayframe-profile-recovery-title" className="df-danger-message">
            <h2 id="dayframe-profile-recovery-title">Saved profiles need recovery</h2>
            <p>
              Saved profiles could not be safely loaded. The original data has been preserved,
              and ordinary profile saving and deletion are blocked until you choose a recovery action.
            </p>
            <div className="df-screen-actions">
              <button className="df-secondary-button" onClick={recheckProtectedProfiles}
                type="button">Recheck preserved profile data</button>
              <button className="df-secondary-button" disabled={!profileIngressStatus.sourcePreserved}
                onClick={exportProtectedProfiles} type="button">Export preserved profile data</button>
              <button className="df-secondary-button" onClick={() =>
                setPendingProfileRecovery("replace")} type="button">
                Replace with current profiles
              </button>
              <button className="df-danger-button" onClick={() =>
                setPendingProfileRecovery("abandon")} type="button">
                Abandon protected profiles
              </button>
            </div>
            {pendingProfileRecovery === "replace" || pendingProfileRecovery === "abandon" ? (
              <div className="df-form-stack">
                <p>{pendingProfileRecovery === "replace"
                  ? "Confirm replacement of the preserved source with the current valid profile collection."
                  : "Confirm permanent abandonment of the preserved source and all session profiles."}</p>
                <div className="df-confirmation-actions">
                  <button className="df-danger-button" onClick={() =>
                    confirmProfileRecovery(pendingProfileRecovery)} type="button">
                    {pendingProfileRecovery === "replace"
                      ? "Confirm replace protected profiles" : "Confirm abandon protected profiles"}
                  </button>
                  <button className="df-secondary-button" onClick={() =>
                    setPendingProfileRecovery(null)} type="button">Cancel profile recovery</button>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
        {profileIngressStatus.status === "accepted" && quarantineEntries.length > 0 ? (
          <section aria-labelledby="dayframe-profile-quarantine-title" className="df-danger-message">
            <h2 id="dayframe-profile-quarantine-title">Some saved profiles need attention</h2>
            <p>{quarantineEntries.length} saved profile {quarantineEntries.length === 1
              ? "entry was" : "entries were"} preserved because validation did not succeed.
              Valid profiles remain available.</p>
            <ul className="df-plain-list">
              {quarantineEntries.map((entry) => (
                <li key={entry.quarantineId}>
                  <span>{entry.originalProfileName ?? entry.originalProfileId ?? "Unnamed profile entry"}</span>
                  <div className="df-screen-actions">
                    <button className="df-secondary-button" onClick={() => exportQuarantine(entry)}
                      type="button">Export quarantined entry</button>
                    <button className="df-danger-button" onClick={() =>
                      setPendingProfileRecovery(entry.quarantineId)} type="button">
                      Remove quarantined entry
                    </button>
                  </div>
                  {pendingProfileRecovery === entry.quarantineId ? (
                    <div className="df-confirmation-actions">
                      <button className="df-danger-button" onClick={() =>
                        confirmQuarantineRemoval(entry.quarantineId)} type="button">
                        Confirm remove quarantined entry
                      </button>
                      <button className="df-secondary-button" onClick={() =>
                        setPendingProfileRecovery(null)} type="button">Cancel removal</button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {profileRecoveryMessage ? <p className="df-confirmation" role="status">
          {profileRecoveryMessage}</p> : null}
        {activeLocalIngressStatus.status === "recoveryRequired" ? (
          <section
            aria-labelledby="dayframe-active-local-recovery-title"
            className="df-danger-message"
          >
            <h2 id="dayframe-active-local-recovery-title">Saved setup needs recovery</h2>
            <p>
              DayFrame could not safely use the saved active setup, so this session is using a safe
              temporary setup. The prior saved checkpoint is being preserved, and ordinary active
              saving is temporarily blocked to protect it.
            </p>
            <p>
              Changes made in this session are session-only and may be lost if you reload or close
              DayFrame. You can explicitly replace the protected saved setup with the current
              session, or permanently discard it and reset the active setup.
            </p>
            {activeLocalIngressStatus.sourcePreserved ? (
              <p>The protected saved setup remains readable and preserved pending recovery.</p>
            ) : (
              <p>
                DayFrame could not read and capture the original saved setup. A recovery attempt may
                be refused until the protected source can be read.
              </p>
            )}
            <div className="df-screen-actions">
              <button
                className="df-secondary-button"
                onClick={() => {
                  setPendingActiveLocalRecovery("replace");
                  setActiveLocalRecoveryMessage("");
                }}
                type="button"
              >
                Replace protected saved setup with current session
              </button>
              <button
                className="df-danger-button"
                onClick={() => {
                  setPendingActiveLocalRecovery("abandon");
                  setActiveLocalRecoveryMessage("");
                }}
                type="button"
              >
                Abandon protected saved setup and reset
              </button>
            </div>
            {pendingActiveLocalRecovery === "replace" ? (
              <div className="df-form-stack">
                <p>
                  Confirm replacement: DayFrame will attempt to make the current committed session
                  the saved active setup. It may include session edits, a loaded profile, or an
                  imported backup. If successful, it permanently supersedes the protected
                  checkpoint; if it fails, that checkpoint remains protected. Unsaved editor drafts
                  are not included.
                </p>
                <div className="df-confirmation-actions">
                  <button
                    className="df-danger-button"
                    onClick={confirmActiveLocalReplacement}
                    type="button"
                  >
                    Confirm replace protected saved setup
                  </button>
                  <button
                    className="df-secondary-button"
                    onClick={() => setPendingActiveLocalRecovery(null)}
                    type="button"
                  >
                    Cancel replacement
                  </button>
                </div>
              </div>
            ) : null}
            {pendingActiveLocalRecovery === "abandon" ? (
              <div className="df-form-stack">
                <p>
                  Confirm permanent abandonment: if removal succeeds, the protected saved setup is
                  permanently removed and the current active setup and session edits reset to safe
                  defaults. Saved profiles remain. This is separate from Clear Local Data. If
                  removal fails, the current session is not reset.
                </p>
                <div className="df-confirmation-actions">
                  <button
                    className="df-danger-button"
                    onClick={confirmActiveLocalAbandonment}
                    type="button"
                  >
                    Confirm abandon protected saved setup
                  </button>
                  <button
                    className="df-secondary-button"
                    onClick={() => setPendingActiveLocalRecovery(null)}
                    type="button"
                  >
                    Cancel abandonment
                  </button>
                </div>
              </div>
            ) : null}
            {activeLocalRecoveryMessage ? (
              <p className="df-danger-message" role="status">
                {activeLocalRecoveryMessage}
              </p>
            ) : null}
          </section>
        ) : null}
        <PersistentDurabilityAwareness
          activeRecoveryProtected={activeLocalIngressStatus.status === "recoveryRequired"}
          onRetryActive={retryActiveDurability}
          onRetryProfiles={retryProfileDurability}
          status={durabilityStatus}
        />
        <header className="df-shell-header">
          <div className="df-shell-header-grid">
            <section className="df-confirmation df-workflow-block df-workflow-block--profiles">
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
                        const result = storeRef.current.saveProfile({
                          name: profileName,
                          savedAt: getExportedAt(),
                        });
                        if (isBlockedProfileMutation(result)) {
                          setProfileDurabilityFeedback(null);
                          setProfileMessage("");
                          setProfileErrorMessage(
                            "Profile was not saved because preserved profile data needs recovery first.",
                          );
                          return;
                        }
                        setProfileDurabilityFeedback({
                          category: classifyStoreMutationResult(result),
                          operation: "save",
                          profileName: profileName.trim(),
                        });
                        setProfileMessage("");
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
                              const result = storeRef.current.loadProfile(savedProfile.id);

                              if (result.status === "recoveryRequired") {
                                setProfileDurabilityFeedback(null);
                                setProfileMessage("");
                                setProfileErrorMessage(
                                  "Profile was not loaded. Your current setup and the saved profile were preserved because the profile needs recovery before it can be used.",
                                );
                                return;
                              }

                              if (result.status === "activationFailed") {
                                setProfileDurabilityFeedback(null);
                                setProfileMessage("");
                                setProfileErrorMessage(
                                  "Profile was not loaded because fresh source identity could not be allocated. Your current setup and the saved profile were preserved.",
                                );
                                return;
                              }

                              setCurrentScreen("setup");
                              clearPreviewSelection();
                              setSetupDurabilityFeedback(null);
                              setProfileDurabilityFeedback({
                                category: classifyActiveStoreMutationResult(result),
                                operation: "load",
                                profileName: savedProfile.name,
                              });
                              setProfileMessage("");
                              setProfileErrorMessage("");
                              setBackupMessage("");
                              setBackupErrorMessage("");
                              setClearDurabilityFeedback(null);
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
                              const result = storeRef.current.deleteProfile(savedProfile.id);
                              if (isBlockedProfileMutation(result)) {
                                setProfileDurabilityFeedback(null);
                                setProfileMessage("");
                                setProfileErrorMessage(
                                  "Profile was not deleted because preserved profile data needs recovery first.",
                                );
                                return;
                              }
                              setProfileDurabilityFeedback({
                                category: classifyStoreMutationResult(result),
                                operation: "delete",
                                profileName: savedProfile.name,
                              });
                              setProfileMessage("");
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
                    setBackupDurabilityFeedback(null);
                    setBackupErrorMessage("");
                    setProfileMessage("");
                    setProfileDurabilityFeedback(null);
                    setProfileErrorMessage("");
                    setIsConfirmingClearLocalData(false);
                    setClearDurabilityFeedback(null);
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
                    setSetupDurabilityFeedback(null);
                    setClearDurabilityFeedback(null);
                    setBackupMessage("");
                    setBackupDurabilityFeedback(null);
                    setBackupErrorMessage("");
                    setProfileMessage("");
                    setProfileDurabilityFeedback(null);
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
                    setBackupDurabilityFeedback,
                    setBackupErrorMessage,
                    setSetupDurabilityFeedback,
                    setProfileMessage,
                    setProfileDurabilityFeedback,
                    setProfileErrorMessage,
                    setClearDurabilityFeedback,
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
                        const result = storeRef.current.clearLocalData();
                        setCurrentScreen("setup");
                        clearPreviewSelection();
                        setSetupDurabilityFeedback(null);
                        setPreviewGuardrailMissingItems([]);
                        setIsConfirmingClearLocalData(false);
                        setClearDurabilityFeedback(classifyClearLocalDataResult(result));
                        setBackupMessage("");
                        setBackupDurabilityFeedback(null);
                        setBackupErrorMessage("");
                        setProfileMessage("");
                        setProfileDurabilityFeedback(null);
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
              ) : clearDurabilityFeedback ? (
                <p className={getClearFeedbackClassName(clearDurabilityFeedback)}>
                  {getClearFeedbackMessage(clearDurabilityFeedback)}
                </p>
              ) : backupErrorMessage ? (
                <p className="df-danger-message">{backupErrorMessage}</p>
              ) : backupDurabilityFeedback ? (
                <p className={getDurabilityFeedbackClassName(backupDurabilityFeedback)}>
                  {getMutationFeedbackMessage("backupImport", backupDurabilityFeedback)}
                </p>
              ) : backupMessage ? (
                <p className="df-success-message">{backupMessage}</p>
              ) : profileErrorMessage ? (
                <p className="df-danger-message">{profileErrorMessage}</p>
              ) : profileDurabilityFeedback ? (
                <p className={getDurabilityFeedbackClassName(profileDurabilityFeedback.category)}>
                  {getProfileFeedbackMessage(profileDurabilityFeedback)}
                </p>
              ) : profileMessage ? (
                <p className="df-success-message">{profileMessage}</p>
              ) : (
                <p className="df-support">
                  Save named profiles locally, or export and import authored setup as JSON. Preview
                  data is not included.
                </p>
              )}
            </section>

            <section className="df-workflow-panel df-workflow-block df-workflow-block--summary">
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
                  aria-label="Generate Preview"
                  aria-pressed={currentScreen === "preview"}
                  className={
                    currentScreen === "preview"
                      ? "df-primary-nav-button is-active"
                      : "df-primary-nav-button"
                  }
                  onClick={generatePreviewFromCurrentDraft}
                  type="button"
                >
                  <span className="df-primary-nav-title">Generate Preview</span>
                  <span aria-hidden="true" className="df-primary-nav-detail">
                    Save this draft, generate, and open the preview
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
                          aria-label={buildCompactPreviewDayAriaLabel(
                            dayItem,
                            selectedPreviewDayRange,
                          )}
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

              {activeManualEventDate && manualEventDraft ? (
                <section className="df-compact-preview" aria-labelledby="manual-event-heading">
                  <div className="df-screen-header">
                    <p className="df-workflow-eyebrow">Calendar Day</p>
                    <h2 className="df-panel-title" id="manual-event-heading">
                      {manualEventsForActiveDate.length === 0 ? "Add Event" : "Day Details"}
                    </h2>
                    <p className="df-support">{formatPreviewDayHeading(activeManualEventDate)}</p>
                  </div>

                  {activePreviewDayDetails ? (
                    <div className="df-form-stack">
                      <p className="df-support">
                        Work {activePreviewDayDetails.workBlocks.length} · Generated{" "}
                        {activePreviewDayDetails.generatedScheduledBlocks.length} · Manual{" "}
                        {activePreviewDayDetails.manualScheduledBlocks.length} · Friction{" "}
                        {activePreviewDayDetails.frictionPoints.length}
                      </p>
                      <div className="df-day-groups">
                        <section className="df-day-group">
                          <h3 className="df-group-title">Work</h3>
                          {activePreviewDayDetails.workBlocks.length === 0 ? (
                            <p className="df-empty">No work blocks.</p>
                          ) : (
                            <ul className="df-plain-list">
                              {activePreviewDayDetails.workBlocks.map((workBlock) => (
                                <li key={workBlock.id}>{workBlock.title}</li>
                              ))}
                            </ul>
                          )}
                        </section>
                        <section className="df-day-group">
                          <h3 className="df-group-title">Generated</h3>
                          {activePreviewDayDetails.generatedScheduledBlocks.length === 0 ? (
                            <p className="df-empty">No generated blocks.</p>
                          ) : (
                            <ul className="df-plain-list">
                              {activePreviewDayDetails.generatedScheduledBlocks.map(
                                (scheduledBlock) => (
                                  <li key={scheduledBlock.id}>{scheduledBlock.title}</li>
                                ),
                              )}
                            </ul>
                          )}
                        </section>
                        <section className="df-day-group">
                          <h3 className="df-group-title">Friction</h3>
                          {activePreviewDayDetails.frictionPoints.length === 0 ? (
                            <p className="df-empty">No friction.</p>
                          ) : (
                            <ul className="df-plain-list">
                              {activePreviewDayDetails.frictionPoints.map((frictionPoint) => (
                                <li key={frictionPoint.id}>{frictionPoint.title}</li>
                              ))}
                            </ul>
                          )}
                        </section>
                      </div>
                    </div>
                  ) : null}

                  <div className="df-grid">
                    <div className="df-field">
                      <label htmlFor="manual-event-title">Title</label>
                      <input
                        id="manual-event-title"
                        onChange={(event) => {
                          setManualEventDraft({
                            ...manualEventDraft,
                            title: (event.target as { value: string }).value,
                          });
                        }}
                        type="text"
                        value={manualEventDraft.title}
                      />
                    </div>
                    <div className="df-field">
                      <label htmlFor="manual-event-date">Date</label>
                      <input
                        id="manual-event-date"
                        onChange={(event) => {
                          setManualEventDraft({
                            ...manualEventDraft,
                            userDayDate: (event.target as { value: LocalDateString }).value,
                          });
                        }}
                        type="date"
                        value={manualEventDraft.userDayDate}
                      />
                    </div>
                    <label className="df-checkbox">
                      <input
                        checked={manualEventDraft.allDay}
                        onChange={(event) => {
                          setManualEventDraft({
                            ...manualEventDraft,
                            allDay: (event.target as { checked: boolean }).checked,
                          });
                        }}
                        type="checkbox"
                      />
                      All Day
                    </label>
                    {!manualEventDraft.allDay ? (
                      <>
                        <div className="df-field">
                          <label htmlFor="manual-event-start-time">Start Time</label>
                          <input
                            id="manual-event-start-time"
                            onChange={(event) => {
                              setManualEventDraft({
                                ...manualEventDraft,
                                startTime: (event.target as { value: string }).value,
                              });
                            }}
                            type="time"
                            value={manualEventDraft.startTime}
                          />
                        </div>
                        <div className="df-field">
                          <label htmlFor="manual-event-end-time">End Time</label>
                          <input
                            id="manual-event-end-time"
                            onChange={(event) => {
                              setManualEventDraft({
                                ...manualEventDraft,
                                endTime: (event.target as { value: string }).value,
                              });
                            }}
                            type="time"
                            value={manualEventDraft.endTime}
                          />
                        </div>
                      </>
                    ) : null}
                    <div className="df-field">
                      <label htmlFor="manual-event-notes">Notes</label>
                      <textarea
                        id="manual-event-notes"
                        onChange={(event) => {
                          setManualEventDraft({
                            ...manualEventDraft,
                            notes: (event.target as { value: string }).value,
                          });
                        }}
                        rows={3}
                        value={manualEventDraft.notes}
                      />
                    </div>
                  </div>

                  <div className="df-screen-actions">
                    <button className="df-action-button" onClick={saveManualEvent} type="button">
                      Save Event
                    </button>
                    <button
                      className="df-secondary-button"
                      onClick={() => {
                        setEditingManualEventId(null);
                        setManualEventDraft({
                          title: "",
                          userDayDate: activeManualEventDate,
                          allDay: false,
                          startTime: "09:00",
                          endTime: "10:00",
                          notes: "",
                        });
                      }}
                      type="button"
                    >
                      Add Another Event
                    </button>
                    <button
                      className="df-secondary-button"
                      onClick={() => {
                        setActiveManualEventDate(null);
                        setManualEventDraft(null);
                        setEditingManualEventId(null);
                        setConfirmingDeleteManualEventId(null);
                      }}
                      type="button"
                    >
                      Close
                    </button>
                  </div>

                  {manualEventDurabilityFeedback ? (
                    <p className={getDurabilityFeedbackClassName(manualEventDurabilityFeedback)}>
                      {getMutationFeedbackMessage("manualEvent", manualEventDurabilityFeedback)}
                    </p>
                  ) : null}
                  {manualEventValidationMessage ? (
                    <p className="df-danger-message">{manualEventValidationMessage}</p>
                  ) : null}

                  {manualEventsForActiveDate.length > 0 ? (
                    <ul className="df-plain-list">
                      {manualEventsForActiveDate.map((manualEvent) => (
                        <li key={manualEvent.id}>
                          <div>
                            <strong>{manualEvent.title}</strong>
                            <span className="df-muted">
                              {" "}
                              {manualEvent.allDay
                                ? "All day"
                                : `${manualEvent.startTime ?? ""} - ${manualEvent.endTime ?? ""}`}
                            </span>
                          </div>
                          <div className="df-screen-actions">
                            <button
                              className="df-secondary-button"
                              onClick={() => {
                                setEditingManualEventId(manualEvent.id);
                                setManualEventDraft({
                                  title: manualEvent.title,
                                  userDayDate: manualEvent.userDayDate,
                                  allDay: manualEvent.allDay,
                                  startTime: manualEvent.startTime ?? "",
                                  endTime: manualEvent.endTime ?? "",
                                  notes: manualEvent.notes ?? "",
                                });
                              }}
                              type="button"
                            >
                              Edit Event
                            </button>
                            {confirmingDeleteManualEventId === manualEvent.id ? (
                              <>
                                <button
                                  className="df-danger-button"
                                  onClick={() => {
                                    deleteManualEvent(manualEvent.id);
                                  }}
                                  type="button"
                                >
                                  Confirm Delete Event
                                </button>
                                <button
                                  className="df-secondary-button"
                                  onClick={() => {
                                    setConfirmingDeleteManualEventId(null);
                                  }}
                                  type="button"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                className="df-secondary-button"
                                onClick={() => {
                                  setConfirmingDeleteManualEventId(manualEvent.id);
                                }}
                                type="button"
                              >
                                Delete Event
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ) : null}
            </section>
          </div>
        </header>

        {currentScreen === "setup" ? (
          <div className="df-workflow-block df-workflow-block--setup">
            <SetupScreen
              draft={setupDraft}
              focusedTemplateField={focusedTemplateField}
              isDirty={isSetupDirty}
              onSave={saveCurrentSetup}
              saveMessage={
                setupValidationMessage ||
                (setupDurabilityFeedback
                  ? getMutationFeedbackMessage("setup", setupDurabilityFeedback)
                  : "")
              }
              saveMessageTone={
                !setupValidationMessage &&
                (setupDurabilityFeedback === null || setupDurabilityFeedback === "durableSuccess")
                  ? "success"
                  : "failure"
              }
              setDraft={(nextDraft) => {
                setFocusedTemplateField(null);
                setSetupDurabilityFeedback(null);
                setSetupValidationMessage("");
                setSetupDraft(nextDraft);
              }}
            />
          </div>
        ) : null}
        {currentScreen === "preview" ? (
          <div className="df-screen df-workflow-block df-workflow-block--preview">
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
                  Regenerate Preview
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
              {stateSnapshot.preview && savedRangeWarnings.length > 0 ? (
                <div className="df-form-stack">
                  <p className="df-warning-message">Preview range warnings:</p>
                  <ul className="df-plain-list">
                    {savedRangeWarnings.map((warning) => (
                      <li key={warning.id}>{warning.message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <PreviewScreen
              acceptedDecisions={acceptedDecisionViewModels}
              decisionRemovalProtected={planDecisionIngress.status === "recoveryRequired"}
              getDayBoundaryStartTimeForUserDayDate={getDayBoundaryStartTimeForUserDayDate}
              now={now}
              onAcceptPlanDecision={acceptPendingPlanDecision}
              onApplySuggestedFix={handlePreviewSuggestedFix}
              onRetryPlanDecisionDurability={retryPlanDecisionDurability}
              onRemoveAcceptedDecision={removeAcceptedDecision}
              pendingPlanDecisionAcceptance={pendingPlanDecisionAcceptance !== null}
              planDecisionFeedback={planDecisionFeedback}
              planDecisionRetryAvailable={
                planDecisionDurability === "storageFailure" || planDecisionDurability === "unavailable"
              }
              preview={stateSnapshot.preview}
              rangeWarnings={stateSnapshot.preview ? savedRangeWarnings : []}
              visibleRangeEndDate={selectedPreviewDayRange?.endDate ?? null}
              visibleRangeStartDate={selectedPreviewDayRange?.startDate ?? null}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function describeAcceptedDecision(
  durable: boolean,
  replayStatus: string | undefined,
): string {
  const save = durable ? "Accepted and saved." : "Accepted for this session; saving failed.";
  switch (replayStatus) {
    case "applied": return `${save} The choice is active in the regenerated schedule.`;
    case "blocked": return `${save} DayFrame could not apply it in the current schedule.`;
    case "outsideWindow": return `${save} The occurrence is outside this preview.`;
    case "inapplicable": return `${save} The choice cannot currently apply.`;
    case "staleSourceMissing":
    case "staleLifetime":
    case "staleOccurrenceMissing": return `${save} The accepted target is now stale.`;
    default: return `${save} Its replay result is unavailable.`;
  }
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

function isPreviewRangeWithinBounds(
  selection: NonNullable<SelectedPreviewDayRange>,
  startDate: LocalDateString,
  endDate: LocalDateString,
): boolean {
  return selection.startDate >= startDate && selection.endDate <= endDate;
}

function buildCompactPreviewDayClassName(
  dayItem: CompactPreviewSummary["dayItems"][number],
  selection: SelectedPreviewDayRange,
): string {
  const selectionPosition = getCompactPreviewSelectionPosition(dayItem.date, selection);

  return [
    "df-compact-preview-day",
    selectionPosition !== "none" ? "is-selected" : "",
    selectionPosition === "single" || selectionPosition === "start" ? "is-range-start" : "",
    selectionPosition === "single" || selectionPosition === "end" ? "is-range-end" : "",
    selectionPosition === "middle" ? "is-range-middle" : "",
    dayItem.hasFriction ? "is-conflict" : "",
    dayItem.isToday ? "is-today" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildCompactPreviewDayAriaLabel(
  dayItem: CompactPreviewSummary["dayItems"][number],
  selection: SelectedPreviewDayRange,
): string {
  const date = createCompactPreviewDateFromLocalDate(dayItem.date);
  const selectionPosition = getCompactPreviewSelectionPosition(dayItem.date, selection);
  const labelParts = [
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  ];

  if (selectionPosition === "single") {
    labelParts.push("selected day");
  } else if (selectionPosition === "start") {
    labelParts.push("selected range start");
  } else if (selectionPosition === "middle") {
    labelParts.push("selected range");
  } else if (selectionPosition === "end") {
    labelParts.push("selected range end");
  }

  if (dayItem.hasFriction) {
    labelParts.push("has friction");
  }

  if (dayItem.isToday) {
    labelParts.push("today");
  }

  return labelParts.join(", ");
}

function getCompactPreviewSelectionPosition(
  userDayDate: LocalDateString,
  selection: SelectedPreviewDayRange,
): "none" | "single" | "start" | "middle" | "end" {
  if (!selection || !isUserDayDateWithinSelection(userDayDate, selection)) {
    return "none";
  }

  if (selection.startDate === selection.endDate && selection.startDate === userDayDate) {
    return "single";
  }

  if (selection.startDate === userDayDate) {
    return "start";
  }

  if (selection.endDate === userDayDate) {
    return "end";
  }

  return "middle";
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

function createIsoTimestamp(): GeneratePreviewActionInput["generatedAt"] {
  return new Date().toISOString();
}

async function handleBackupFileSelection(
  event: ChangeEvent<HTMLInputElement>,
  store: DayFrameAppStore,
  setBackupMessage: (message: string) => void,
  setBackupDurabilityFeedback: (feedback: DurabilitySemanticCategory | null) => void,
  setBackupErrorMessage: (message: string) => void,
  setSetupDurabilityFeedback: (feedback: DurabilitySemanticCategory | null) => void,
  setProfileMessage: (message: string) => void,
  setProfileDurabilityFeedback: (feedback: ProfileDurabilityFeedback | null) => void,
  setProfileErrorMessage: (message: string) => void,
  setClearDurabilityFeedback: (feedback: ClearDurabilitySemanticClassification | null) => void,
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

    const result = store.importBackup(backup);

    if (result.status === "rejected") {
      setBackupMessage("");
      setBackupDurabilityFeedback(null);
      setClearDurabilityFeedback(null);
      setBackupErrorMessage(
        result.reason === "unsupportedVersion"
          ? "Backup was not imported because its version is not supported. Your current setup was preserved."
          : result.reason === "activeLocalRecovery"
            ? "Backup restore is blocked until the protected saved setup is explicitly resolved."
            : "Backup was not imported because validation failed. Your current setup was preserved.",
      );
      setProfileMessage("");
      setProfileDurabilityFeedback(null);
      return;
    }

    const backupDurability = classifyActiveStoreMutationResult(result);
    setBackupDurabilityFeedback(backupDurability === "durableSuccess" ? null : backupDurability);
    setBackupMessage(result.status === "restored"
      ? "Backup V2 restored with its original source lifetimes."
      : "Legacy Backup V1 imported with fresh source lifetimes.");
    setBackupErrorMessage("");
    setSetupDurabilityFeedback(null);
    setClearDurabilityFeedback(null);
    setProfileMessage("");
    setProfileDurabilityFeedback(null);
    setProfileErrorMessage("");
    setCurrentScreen("setup");
    clearPreviewSelection();
    setPreviewGuardrailMissingItems([]);
    setIsConfirmingClearLocalData(false);
  } catch (error) {
    setBackupMessage("");
    setBackupDurabilityFeedback(null);
    setClearDurabilityFeedback(null);
    setBackupErrorMessage(getBackupErrorMessage(error));
    setProfileMessage("");
    setProfileDurabilityFeedback(null);
  }
}

function getDurabilityFeedbackClassName(category: DurabilitySemanticCategory): string {
  return category === "durableSuccess" ? "df-success-message" : "df-danger-message";
}

function getReplacementRecoveryMessage(result: ActiveLocalReplacementRecoveryResult): string {
  if (result.status === "resolved") {
    return "";
  }

  if (result.status === "notResolved") {
    switch (result.persistence.status) {
      case "serializationFailure":
        return "DayFrame could not prepare the current session for durable replacement. The current session remains available and the protected saved setup was not overwritten. Resolve the issue, then choose and confirm replacement again.";
      case "unavailable":
      case "storageFailure":
        return "DayFrame could not complete the replacement. The protected saved setup remains protected and the current session remains available. Choose and confirm replacement again when local storage is available.";
    }
  }

  switch (result.reason) {
    case "notRecoveryRequired":
      return "";
    case "invalidReplacement":
      return "The current session cannot be used as the replacement yet. Nothing was overwritten, and recovery remains unresolved.";
    case "sourceChanged":
      return "The saved setup changed since DayFrame detected the recovery problem. Nothing was overwritten. Review the current saved state before trying again.";
    case "sourceUnreadable":
      return "DayFrame cannot currently read the protected saved setup, so no destructive recovery was attempted. Choose and confirm recovery again only after the source can be read.";
  }
}

function getAbandonmentRecoveryMessage(result: ActiveLocalAbandonmentRecoveryResult): string {
  if (result.status === "resolved") {
    return "";
  }

  if (result.status === "notResolved") {
    return "DayFrame could not discard the protected saved setup. Your current session was not reset, and the checkpoint remains protected. Choose and confirm abandonment again later.";
  }

  switch (result.reason) {
    case "notRecoveryRequired":
      return "";
    case "sourceChanged":
      return "The saved setup changed since DayFrame detected the recovery problem. Nothing was removed. Review the current saved state before trying again.";
    case "sourceUnreadable":
      return "DayFrame cannot currently read the protected saved setup, so no destructive recovery was attempted. Choose and confirm recovery again only after the source can be read.";
  }
}

function getPersistentDurabilityMessage(
  surface: "activeState" | "profiles",
  category: DurabilitySemanticCategory,
): string | null {
  if (category === "durableSuccess" || category === "internalNoOp") {
    return null;
  }

  const subject = surface === "activeState" ? "Active setup" : "Saved profiles";
  const availability = surface === "activeState" ? "is" : "are";

  switch (category) {
    case "retryableUnavailable":
      return `${subject} ${availability} available for this session, but local storage is unavailable.`;
    case "retryableStorageFailure":
      return `${subject} ${availability} available for this session, but the durable save failed.`;
    case "recoveryRequired":
      return surface === "activeState"
        ? "Active setup changes are still available in this session, but they are not durably saved and ordinary Retry is unavailable. Reloading or closing DayFrame may discard these session changes; an older saved setup may return."
        : "Saved-profile changes are still available in this session, but they are not durably saved and ordinary Retry is unavailable. Reloading or closing DayFrame may discard these session changes; an older saved profile list may return.";
  }
}

function isRetryableDurabilitySemantic(category: DurabilitySemanticCategory): boolean {
  return category === "retryableUnavailable" || category === "retryableStorageFailure";
}

function getMutationFeedbackMessage(
  workflow: "setup" | "manualEvent" | "backupImport",
  category: DurabilitySemanticCategory,
): string {
  const subject =
    workflow === "setup" ? "Setup" : workflow === "manualEvent" ? "Event change" : "Backup";

  switch (category) {
    case "durableSuccess":
      return workflow === "setup"
        ? "Setup saved."
        : workflow === "manualEvent"
          ? "Event change saved."
          : "DayFrame setup backup imported.";
    case "retryableUnavailable":
      return `${subject} applied for this session, but local storage is unavailable.`;
    case "retryableStorageFailure":
      return `${subject} applied for this session, but it could not be saved locally.`;
    case "recoveryRequired":
      return `${subject} applied for this session, but it could not be prepared for local storage.`;
    case "internalNoOp":
      return `${subject} applied for this session; no durability attempt was made.`;
  }
}

function getProfileFeedbackMessage(feedback: ProfileDurabilityFeedback): string {
  const quotedName = `"${feedback.profileName}"`;

  if (feedback.category === "durableSuccess") {
    switch (feedback.operation) {
      case "save":
        return "Current setup saved as a local profile.";
      case "load":
        return `Loaded profile ${quotedName}.`;
      case "delete":
        return `Deleted profile ${quotedName}.`;
    }
  }

  const operation =
    feedback.operation === "save"
      ? `Profile ${quotedName} exists for this session`
      : feedback.operation === "load"
        ? `Profile ${quotedName} is loaded for this session`
        : `Profile ${quotedName} is removed for this session`;
  const durability =
    feedback.category === "retryableUnavailable"
      ? "local storage is unavailable"
      : feedback.category === "retryableStorageFailure"
        ? "the local storage attempt failed"
        : feedback.category === "recoveryRequired"
          ? "the change could not be prepared for local storage"
          : "no durability attempt was made";

  return `${operation}, but ${durability}.`;
}

function getClearFeedbackClassName(feedback: ClearDurabilitySemanticClassification): string {
  return feedback.aggregate === "durableSuccess" ? "df-success-message" : "df-danger-message";
}

function getClearFeedbackMessage(feedback: ClearDurabilitySemanticClassification): string {
  if (feedback.aggregate === "durableSuccess") {
    return "Local DayFrame setup data cleared from this device.";
  }

  const unresolvedSurfaces = [
    feedback.activeState === "durableSuccess"
      ? null
      : `active setup (${getRemovalFailureLabel(feedback.activeState)})`,
    feedback.profiles === "durableSuccess"
      ? null
      : `saved profiles (${getRemovalFailureLabel(feedback.profiles)})`,
  ].filter((surface): surface is string => surface !== null);

  return `Local data cleared for this session, but local removal is incomplete for ${unresolvedSurfaces.join(
    " and ",
  )}.`;
}

function getRemovalFailureLabel(category: DurabilitySemanticCategory): string {
  if (category === "retryableUnavailable") {
    return "storage unavailable";
  }

  if (category === "internalNoOp") {
    return "protected recovery checkpoint";
  }

  return "storage failure";
}

function downloadDayFrameBackup(backup: DayFrameBackupV2): void {
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

function downloadRecoveryData(content: string, filename: string, formatJson: boolean): void {
  const recoveryBlob = new Blob([formatJson ? JSON.stringify(content, null, 2) : content], {
    type: "application/json",
  });
  const downloadUrl = globalThis.URL.createObjectURL(recoveryBlob);
  const documentLike = globalThis as { document?: {
    createElement: (tagName: string) => DownloadAnchorLike } };
  const anchor = documentLike.document?.createElement("a");
  if (!anchor) throw new RangeError("Recovery download is not available in this environment.");
  anchor.href = downloadUrl;
  anchor.download = filename;
  anchor.click();
  globalThis.URL.revokeObjectURL(downloadUrl);
}

function isBlockedProfileMutation(result: ProfileMutationResult): result is Extract<
  ProfileMutationResult, { status: "blocked" }
> {
  return "status" in result && result.status === "blocked";
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

  if (state.shiftCycles.length === 0) {
    missingItems.push("Add at least one shift cycle.");
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
  state: Pick<DayFrameState, "previewRange" | "shiftCycles" | "schedulingPreferences">,
): Pick<GeneratePreviewActionInput, "planningWindowStart" | "planningWindowEnd"> {
  const startDate = state.previewRange.startDate;
  const exclusiveEndUserDayDate = addDaysToLocalDate(state.previewRange.endDate, 1);

  return {
    planningWindowStart: createUserDayBoundaryDate({
      userDayDate: startDate,
      shiftCycles: state.shiftCycles,
      schedulingPreferences: state.schedulingPreferences,
    }),
    planningWindowEnd: createUserDayBoundaryDate({
      userDayDate: exclusiveEndUserDayDate,
      shiftCycles: state.shiftCycles,
      schedulingPreferences: state.schedulingPreferences,
    }),
  };
}

function resolvePreviewRangeFromSetupDraft(setupDraft: SetupDraft): DayFrameState["previewRange"] {
  if (
    (setupDraft.previewRange.source ??
      (setupDraft.previewRange.preset === "custom" ? "custom" : "preset")) !== "cycle"
  ) {
    return {
      ...setupDraft.previewRange,
    };
  }

  return {
    ...setupDraft.previewRange,
    startDate:
      getShiftCyclesRange(setupDraft.shiftCycles)?.startDate ?? setupDraft.previewRange.startDate,
    endDate:
      getShiftCyclesRange(setupDraft.shiftCycles)?.endDate ?? setupDraft.previewRange.endDate,
  };
}

function hasUnsavedSetupChanges(
  setupDraft: SetupDraft,
  stateSnapshot: Pick<
    DayFrameState,
    | "schedulingPreferences"
    | "previewRange"
    | "shiftDefinitions"
    | "shiftCycles"
    | "blockTemplates"
    | "blockRecurrences"
  >,
): boolean {
  return (
    JSON.stringify(serializeDraftAuthoredSetup(setupDraft)) !==
    JSON.stringify({
      schedulingPreferences: stateSnapshot.schedulingPreferences,
      previewRange: stateSnapshot.previewRange,
      shiftDefinitions: stateSnapshot.shiftDefinitions,
      shiftCycles: stateSnapshot.shiftCycles,
      blockTemplates: stateSnapshot.blockTemplates,
      blockRecurrences: stateSnapshot.blockRecurrences,
    })
  );
}

function serializeDraftAuthoredSetup(setupDraft: SetupDraft) {
  return {
    schedulingPreferences: setupDraft.schedulingPreferences,
    previewRange: resolvePreviewRangeFromSetupDraft(setupDraft),
    shiftDefinitions: setupDraft.shiftDefinitions,
    shiftCycles: setupDraft.shiftCycles,
    blockTemplates: setupDraft.templateEntries.map((entry) => entry.template),
    blockRecurrences: setupDraft.templateEntries.map((entry) => entry.recurrence),
  };
}

function buildPreviewDayDetails(
  preview: NonNullable<DayFrameState["preview"]>,
  userDayDate: LocalDateString,
  getDayBoundaryStartTimeForUserDayDate: (userDayDate: string) => string,
): {
  workBlocks: NonNullable<DayFrameState["preview"]>["result"]["generatedWorkBlocks"];
  generatedScheduledBlocks: NonNullable<DayFrameState["preview"]>["result"]["scheduledBlocks"];
  manualScheduledBlocks: NonNullable<DayFrameState["preview"]>["result"]["scheduledBlocks"];
  frictionPoints: NonNullable<DayFrameState["preview"]>["result"]["frictionPoints"];
} {
  const workBlocks = preview.result.generatedWorkBlocks.filter(
    (workBlock) => workBlock.userDayDate === userDayDate,
  );
  const scheduledBlocks = preview.result.scheduledBlocks.filter((scheduledBlock) =>
    doesScheduledBlockOverlapUserDay(
      scheduledBlock.startsAt,
      scheduledBlock.endsAt,
      userDayDate,
      getDayBoundaryStartTimeForUserDayDate(userDayDate),
    ),
  );

  return {
    workBlocks,
    generatedScheduledBlocks: scheduledBlocks.filter(
      (scheduledBlock) => scheduledBlock.source !== "manual",
    ),
    manualScheduledBlocks: scheduledBlocks.filter(
      (scheduledBlock) => scheduledBlock.source === "manual",
    ),
    frictionPoints: preview.result.frictionPoints.filter(
      (frictionPoint) => frictionPoint.affectedUserDayDate === userDayDate,
    ),
  };
}

function doesScheduledBlockOverlapUserDay(
  startsAt: Date,
  endsAt: Date,
  userDayDate: LocalDateString,
  dayBoundaryStartTime: string,
): boolean {
  const userDayStart = createUserDayBoundaryDate({
    userDayDate,
    shiftCycles: [],
    schedulingPreferences: {
      dayBoundaryStartTime: dayBoundaryStartTime as `${number}:${number}`,
      weekStartsOn: "saturday",
    },
  });
  const userDayEnd = new Date(userDayStart);

  userDayEnd.setDate(userDayEnd.getDate() + 1);

  return startsAt.getTime() < userDayEnd.getTime() && endsAt.getTime() > userDayStart.getTime();
}

function formatPreviewDayHeading(userDayDate: LocalDateString): string {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const date = new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function createUserDayBoundaryDate(input: {
  userDayDate: LocalDateString;
  shiftCycles: ShiftCycle[];
  schedulingPreferences: DayFrameState["schedulingPreferences"];
}): Date {
  const [year, month, day] = input.userDayDate.split("-").map(Number);
  const effectivePreferences = resolveEffectiveSchedulePreferencesForUserDayDate({
    shiftCycles: input.shiftCycles,
    defaultSchedulingPreferences: input.schedulingPreferences,
    userDayDate: input.userDayDate,
  });
  const [hours, minutes] = effectivePreferences.dayBoundaryStartTime.split(":").map(Number);

  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, 0, 0);
}

function getShiftCyclesRange(
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

function addDaysToLocalDate(localDate: LocalDateString, days: number): LocalDateString {
  const [year, month, day] = localDate.split("-").map(Number);
  const nextDate = new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, 12, 0, 0, 0);

  nextDate.setDate(nextDate.getDate() + days);

  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(
    nextDate.getDate(),
  ).padStart(2, "0")}` as LocalDateString;
}
