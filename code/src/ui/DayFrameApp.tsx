import { scheduleReviewNavigation } from "./scheduleReviewNavigation.js";
import { goalInspectionNavigation, goalRecordedNavigation } from "./goalAcceptedPlanningContext.js";
import { createGoalEditingContext } from "./goalEditingContext.js";
import { initialAcceptedSummaryContext } from "./acceptedPlanningSummaryContext.js";
import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ErrorInfo,
  type ReactElement,
  type ReactNode,
} from "react";

import type { ManualCalendarEvent } from "../core/calendar/types.js";
import { allocateReadableSourceId } from "../core/authored/allocateReadableSourceId.js";
import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../core/cycles/resolveEffectiveSchedulePreferences.js";
import { addUserDayLabels, resolveUserDayWindowForLabel } from "../core/time/canonicalUserDay.js";
import { createPlanDecisionAcceptanceCandidate } from "../core/decisions/createPlanDecisionAcceptanceCandidate.js";
import type { AcceptPlanDecisionInput, PlanDecisionV1 } from "../core/decisions/planDecision.js";
import type { ShiftCycle } from "../core/cycles/types.js";
import type { LocalDateString } from "../core/shifts/types.js";
import type { CommitmentTarget, EventTarget } from "../core/monthlyPlanner/queryMonthlyPlanner.js";
import { parseDayFrameBackupJson, type DayFrameBackup } from "../state/dayFrameBackup.js";
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
import type { DayFrameReadiness } from "../state/dayFrameReadiness.js";
import type { PlanDecisionIngressStatus } from "../state/planDecisionSurface.js";

import type { GoalPlanningStore } from "./GoalPlanningSection.js";
import { currentPlannerView, usePlannerNavigation } from "./plannerNavigation.js";
export type { PrimarySurface } from "./plannerNavigation.js";
import { PlannerSurface, type PlannerMode } from "./PlannerSurface.js";
import type { CommitmentEditorTarget } from "./CommitmentSection.js";
import { buildAcceptedDecisionViewModels } from "./acceptedDecisionPresentation.js";
import { getPreviewRangeWarnings } from "./previewRangeWarnings.js";
import { buildSetupDraft, buildSetupLifecycleTransaction, type SetupDraft } from "./setupDraft.js";
import { formatPlanningWindow, formatPreviewTimestamp } from "./timeDisplay.js";
import "./dayFrameUi.css";

const GoalAcceptedPlanningSection = lazy(() =>
  import("./GoalAcceptedPlanningSection.js").then((module) => ({
    default: module.GoalAcceptedPlanningSection,
  })),
);
const GoalRecordedInspection = lazy(() =>
  import("./GoalRecordedInspection.js").then((module) => ({
    default: module.GoalRecordedInspection,
  })),
);
const GoalStructureSection = lazy(() =>
  import("./GoalStructureSection.js").then((module) => ({ default: module.GoalStructureSection })),
);
const loadGoals = () => import("./GoalSection.js");
const GoalSection =
  import.meta.env.MODE === "test"
    ? (await loadGoals()).GoalSection
    : lazy(() => loadGoals().then((module) => ({ default: module.GoalSection })));

const GoalPlanningSection = lazy(() =>
  import("./GoalPlanningSection.js").then((module) => ({ default: module.GoalPlanningSection })),
);

const loadMySchedule = () => import("./MyScheduleSurface.js");
const MyScheduleSurface =
  import.meta.env.MODE === "test"
    ? (await loadMySchedule()).MyScheduleSurface
    : lazy(() => loadMySchedule().then((m) => ({ default: m.MyScheduleSurface })));
const loadSleepEditor = () => import("./SleepRequirementSection.js");
const SleepRequirementSection =
  import.meta.env.MODE === "test"
    ? (await loadSleepEditor()).SleepRequirementSection
    : lazy(() => loadSleepEditor().then((m) => ({ default: m.SleepRequirementSection })));
const loadAcceptedSummary = () => import("./AcceptedPlanningSummary.js");
const AcceptedPlanningSummary =
  import.meta.env.MODE === "test"
    ? (await loadAcceptedSummary()).AcceptedPlanningSummary
    : lazy(() =>
        loadAcceptedSummary().then((module) => ({ default: module.AcceptedPlanningSummary })),
      );
const loadSummarySurface = () => import("./HistoricalIntelligenceSummary.js");
const HistoricalIntelligenceSummary = lazy(() =>
  loadSummarySurface().then((module) => ({ default: module.HistoricalIntelligenceSummary })),
);
const loadDayWorksurface = () => import("./DayWorksurface.js");
const DayWorksurface =
  import.meta.env.MODE === "test"
    ? (await loadDayWorksurface()).DayWorksurface
    : lazy(() => loadDayWorksurface().then((module) => ({ default: module.DayWorksurface })));

const loadPlanAuthoring = () => import("./SetupScreen.js");
const SetupScreen =
  import.meta.env.MODE === "test"
    ? (await loadPlanAuthoring()).SetupScreen
    : lazy(() => loadPlanAuthoring().then((module) => ({ default: module.SetupScreen })));
const loadMonthlyPlanner = () => import("./MonthlyPlannerSurface.js");
const MonthlyPlannerSurface =
  import.meta.env.MODE === "test"
    ? (await loadMonthlyPlanner()).MonthlyPlannerSurface
    : lazy(() =>
        loadMonthlyPlanner().then((module) => ({ default: module.MonthlyPlannerSurface })),
      );
const loadScheduleReview = () => import("./ScheduleReviewWorkspace.js");
const ScheduleReviewWorkspace =
  import.meta.env.MODE === "test"
    ? (await loadScheduleReview()).ScheduleReviewWorkspace
    : lazy(() =>
        loadScheduleReview().then((module) => ({ default: module.ScheduleReviewWorkspace })),
      );

export class LazySurfaceBoundary extends Component<
  { children: ReactNode; name: string },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    void error;
    void info;
  }
  render() {
    return this.state.failed ? (
      <section className="df-panel" role="alert">
        <h2>{this.props.name} could not be loaded</h2>
        <p>Reload DayFrame to try again. Your saved data was not changed.</p>
      </section>
    ) : (
      this.props.children
    );
  }
}

export function LazySurfaceLoading({ name }: { name: string }) {
  return (
    <section className="df-panel" role="status">
      Loading {name}…
    </section>
  );
}

export type DayFrameAppStore = Pick<
  DayFrameStore,
  | "getReadiness"
  | "subscribeReadiness"
  | "whenReady"
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
  | "getGoalStructureQualification"
  | "createRelationship"
  | "reviseRelationship"
  | "retireRelationship"
  | "createMilestone"
  | "reviseMilestone"
  | "listGoalStructureRelationships"
  | "listGoalStructureMilestones"
  | "getGoalStructureRelationshipRevision"
  | "getGoalStructureMilestoneRevision"
  | "getGoalStructureIngressStatus"
  | "getGoalStructureDurabilityStatus"
  | "retryGoalStructurePersistence"
  | "queryGoalStructure"
  | "exportBackup"
  | "importBackup"
  | "exportBackupV11"
  | "exportBackupV14"
  | "reviewLegacySleepConversion"
  | "convertLegacySleepToFirstClass"
  | "importBackupV3"
  | "importBackupFile"
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
  | "getExecutionHistory"
  | "getQuarantinedExecutionHistory"
  | "getExecutionHistoryDurabilityStatus"
  | "getExecutionHistoryIngressStatus"
  | "findExecutionSubjectByPlannedReference"
  | "getExecutionOutcome"
  | "recordExecution"
  | "correctExecutionRecord"
  | "retractExecutionRecord"
  | "retryExecutionHistoryPersistence"
  | "subscribeExecutionHistory"
  | "subscribeExecutionHistoryDurability"
  | "subscribeExecutionHistoryIngress"
  | "getHistoricalCompletionDistribution"
  | "getHistoricalSchedulingRealization"
  | "getGoalActivity"
  | "queryToday"
  | "querySelectedDayEvidence"
  | "queryAcceptedPlanningEvidence"
  | "subscribeProposals"
  | "authorSleepRequirement"
  | "listCurrentAttachments"
  | "getCompositionIngressStatus"
  | "subscribeComposition"
  | "queryEffectiveSleepRequirement"
  | "recordSleepExecution"
  | "queryPlanningReview"
  | "subscribePlanningReview"
  | "acceptProposalOption"
  | "rejectProposal"
  | "publishScheduleRange"
  | "realizeAcceptedAllocation"
  | "listRealizedScheduleFacts"
  | "getStatus"
  | "subscribeStatus"
  | "subscribeHistory"
  | "listGoals"
  | "getGoal"
  | "getGoalLinkAvailability"
  | "getGoalIngressStatus"
  | "getGoalDurabilityStatus"
  | "subscribeGoals"
  | "createGoal"
  | "updateGoal"
  | "completeGoal"
  | "archiveGoal"
  | "reactivateGoal"
  | "linkCommitment"
  | "unlinkCommitment"
  | "retryGoalPersistence"
  | "listMeasurementDefinitionHistory"
  | "getMeasurementDefinitionIngressStatus"
  | "getMeasurementDefinitionDurabilityStatus"
  | "subscribeMeasurementDefinitions"
  | "createMeasurementDefinition"
  | "reviseMeasurementDefinition"
  | "stopMeasuringGoal"
  | "restartMeasurement"
  | "retryMeasurementDefinitionPersistence"
  | "queryGoalProgressObservationHistory"
  | "subscribeProgressObservations"
  | "getProgressObservationDurabilityStatus"
  | "retryProgressObservationPersistence"
  | "createProgressObservation"
  | "correctProgressObservation"
  | "retractProgressObservation"
  | "queryGoalProgress"
> &
  GoalPlanningStore;

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

export function DayFrameApp(props: DayFrameAppProps): ReactElement {
  const internalStoreRef = useRef<DayFrameAppStore | null>(null);
  const activeStore = props.store ?? internalStoreRef.current ?? createDayFrameStore();
  if (!props.store && internalStoreRef.current === null) internalStoreRef.current = activeStore;
  const [readiness, setReadiness] = useState<DayFrameReadiness>(() => activeStore.getReadiness());

  useEffect(() => {
    setReadiness(activeStore.getReadiness());
    return activeStore.subscribeReadiness(setReadiness);
  }, [activeStore]);

  if (readiness.status === "initializing") {
    return (
      <main aria-live="polite">
        <p>Loading DayFrame…</p>
      </main>
    );
  }
  if (readiness.status === "protected") {
    return (
      <main role="alert">
        <p>DayFrame needs recovery before saved data can be used.</p>
      </main>
    );
  }
  return <ReadyDayFrameApp {...props} store={activeStore} />;
}

function ReadyDayFrameApp({
  store,
  getGeneratedAt = createIsoTimestamp,
  getRevisedAt = createIsoTimestamp,
  getExportedAt = createIsoTimestamp,
  getNow = () => new Date(),
  getPreviewWindow,
}: DayFrameAppProps & { store: DayFrameAppStore }): ReactElement {
  const activeStore = store;
  const storeRef = useRef<DayFrameAppStore>(activeStore);
  storeRef.current = activeStore;
  const importInputRef = useRef<FileInputLike | null>(null);
  const importButtonRef = useRef<HTMLButtonElement>(null);
  const now = getNow();
  const [stateSnapshot, setStateSnapshot] = useState<DayFrameState>(() => activeStore.getState());
  const [durabilityStatus, setDurabilityStatus] = useState<StoreDurabilityStatus>(() =>
    activeStore.getDurabilityStatus(),
  );
  const [activeLocalIngressStatus, setActiveLocalIngressStatus] =
    useState<ActiveLocalIngressStatus>(() => activeStore.getActiveLocalIngressStatus());
  const [profileIngressStatus, setProfileIngressStatus] = useState<ProfileIngressStatus>(() =>
    activeStore.getProfileIngressStatus(),
  );
  const [quarantineEntries, setQuarantineEntries] = useState<QuarantinedProfileEntry[]>(() =>
    activeStore.getQuarantinedProfiles(),
  );
  const [pendingProfileRecovery, setPendingProfileRecovery] = useState<
    "replace" | "abandon" | string | null
  >(null);
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
  const [setupIssues, setSetupIssues] = useState<string[]>([]);
  const [setupValidationMessage, setSetupValidationMessage] = useState("");
  const {
    currentScreen,
    setCurrentScreen,
    plannerMode,
    setPlannerMode,
    calendarView: preservedMonthView,
    setCalendarView: setPreservedMonthView,
    canGoBack,
    goBack,
    dayOwner,
    openDay,
  } = usePlannerNavigation(() => currentPlannerView(activeStore.getState(), getNow()));
  const [acceptedSummaryContext, setAcceptedSummaryContext] = useState(() =>
    initialAcceptedSummaryContext(getNow()),
  );
  const [goalEditingContext, setGoalEditingContext] = useState(createGoalEditingContext);
  function resetGoalEditing() {
    goalEditingContext.invalidate();
    setGoalEditingContext(createGoalEditingContext());
    setDayGoalId(undefined);
  }
  const [dayGoalId, setDayGoalId] = useState<string | undefined>(undefined);
  const [calendarEditingTools, setCalendarEditingTools] = useState(false);
  const navigationHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    // Child editors retain their precise focus targets (for example a fixed-time input).
    const active = document.activeElement;
    if (
      active === document.body ||
      active?.closest(
        ".df-foundation-primary, .df-foundation-secondary, .df-foundation-day-nav, .df-foundation-location",
      )
    )
      navigationHeading.current?.focus();
  }, [currentScreen, plannerMode]);
  const [previewGuardrailMissingItems, setPreviewGuardrailMissingItems] = useState<string[]>([]);
  const [isConfirmingClearLocalData, setIsConfirmingClearLocalData] = useState(false);
  const [clearFailureMessage, setClearFailureMessage] = useState("");
  const clearButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (clearFailureMessage) clearButtonRef.current?.focus();
  }, [clearFailureMessage]);
  const [clearDurabilityFeedback, setClearDurabilityFeedback] =
    useState<ClearDurabilitySemanticClassification | null>(null);
  const [backupMessage, setBackupMessage] = useState("");
  const [backupDurabilityFeedback, setBackupDurabilityFeedback] =
    useState<DurabilitySemanticCategory | null>(null);
  const [backupErrorMessage, setBackupErrorMessage] = useState("");
  const [isBackupBusy, setIsBackupBusy] = useState(false);
  useEffect(() => {
    if (!isBackupBusy && backupErrorMessage) importButtonRef.current?.focus();
  }, [isBackupBusy, backupErrorMessage]);
  const [isClearBusy, setIsClearBusy] = useState(false);
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
  const [editingManualEventIncarnationId, setEditingManualEventIncarnationId] = useState<
    string | null
  >(null);
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
  const [manualEventReturnToMonth, setManualEventReturnToMonth] = useState(false);
  const [requestedCommitmentEditorTarget, setRequestedCommitmentEditorTarget] =
    useState<CommitmentEditorTarget | null>(null);
  const [requestedAddCommitmentEditor, setRequestedAddCommitmentEditor] = useState(false);
  const [requestedWorkEditor, setRequestedWorkEditor] = useState(false);
  const [workPatternReturnToMonth, setWorkPatternReturnToMonth] = useState(false);
  const [monthPlanWorkspace, setMonthPlanWorkspace] = useState<
    "commitment" | "commitmentLibrary" | "work" | "planningSettings" | null
  >(null);
  const [contextualNavigationMessage, setContextualNavigationMessage] = useState("");
  const [pendingReviewFrictionId, setPendingReviewFrictionId] = useState<string | null>(null);
  const [returnToReviewAvailable, setReturnToReviewAvailable] = useState(false);
  const [pendingPlanDecisionAcceptance, setPendingPlanDecisionAcceptance] =
    useState<PendingPlanDecisionAcceptance | null>(null);
  const [planDecisionFeedback, setPlanDecisionFeedback] =
    useState<PlanDecisionWorkflowFeedback | null>(null);
  const [planDecisionDurability, setPlanDecisionDurability] = useState<SurfaceDurabilityStatus>(
    () => activeStore.getPlanDecisionDurabilityStatus(),
  );
  const [planDecisionIngress, setPlanDecisionIngress] = useState<PlanDecisionIngressStatus>(() =>
    activeStore.getPlanDecisionIngressStatus(),
  );
  const [planDecisions, setPlanDecisions] = useState<PlanDecisionV1[]>(() =>
    activeStore.getPlanDecisions(),
  );
  const getDayBoundaryStartTimeForUserDayDate = (userDayDate: string) =>
    resolveEffectiveSchedulePreferencesForUserDayDate({
      shiftCycles: stateSnapshot.shiftCycles,
      defaultSchedulingPreferences: stateSnapshot.schedulingPreferences,
      userDayDate: userDayDate as `${number}-${number}-${number}`,
    }).dayBoundaryStartTime;
  const getUserDayWindowForUserDayDate = (userDayDate: string) =>
    resolveUserDayWindowForLabel({
      shiftCycles: stateSnapshot.shiftCycles,
      defaultSchedulingPreferences: stateSnapshot.schedulingPreferences,
      userDayDate: userDayDate as LocalDateString,
    });
  const previewSummary = stateSnapshot.preview
    ? buildCompactPreviewSummary(
        stateSnapshot.preview,
        now,
        getDayBoundaryStartTimeForUserDayDate,
        getUserDayWindowForUserDayDate,
      )
    : null;
  const activePreviewDayDetails =
    stateSnapshot.preview && activeManualEventDate
      ? buildPreviewDayDetails(
          stateSnapshot.preview,
          activeManualEventDate,
          getDayBoundaryStartTimeForUserDayDate,
          getUserDayWindowForUserDayDate,
        )
      : null;
  const manualEventsForActiveDate = activeManualEventDate
    ? stateSnapshot.manualEvents.filter(
        (manualEvent) => manualEvent.userDayDate === activeManualEventDate,
      )
    : [];
  const isSetupDirty = hasUnsavedSetupChanges(setupDraft, stateSnapshot);
  useEffect(() => {
    if (!setupValidationMessage) setSetupIssues([]);
  }, [setupValidationMessage]);
  const authoredStateFingerprint = JSON.stringify({
    schedulingPreferences: stateSnapshot.schedulingPreferences,
    previewRange: stateSnapshot.previewRange,
    shiftDefinitions: stateSnapshot.shiftDefinitions,
    shiftCycles: stateSnapshot.shiftCycles,
    blockTemplates: stateSnapshot.blockTemplates,
    blockRecurrences: stateSnapshot.blockRecurrences,
  });
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
    const unsubscribeDecisionDurability =
      activeStore.subscribePlanDecisionDurability(setPlanDecisionDurability);
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
    if (!stateSnapshot.preview || stateSnapshot.preview.isStale)
      setPendingPlanDecisionAcceptance(null);
  }, [stateSnapshot.preview]);

  useEffect(() => {
    if (activeLocalIngressStatus.status !== "recoveryRequired") {
      setPendingActiveLocalRecovery(null);
      setActiveLocalRecoveryMessage("");
    }
  }, [activeLocalIngressStatus.status]);

  useEffect(() => {
    setSetupDraft(buildSetupDraft(stateSnapshot, createIsoTimestamp()));
  }, [authoredStateFingerprint]);

  useEffect(() => {
    if (!editingManualEventId || !editingManualEventIncarnationId) return;
    const exactSource = stateSnapshot.manualEvents.some(
      (event) =>
        event.id === editingManualEventId &&
        event.incarnationId === editingManualEventIncarnationId,
    );
    if (exactSource) return;
    if (!manualEventReturnToMonth) return;
    setEditingManualEventId(null);
    setEditingManualEventIncarnationId(null);
    setManualEventDraft(null);
    setActiveManualEventDate(null);
    setContextualNavigationMessage(
      "This event has changed or is no longer available to edit from this schedule.",
    );
  }, [
    editingManualEventId,
    editingManualEventIncarnationId,
    manualEventReturnToMonth,
    stateSnapshot.manualEvents,
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

  function openMonthMode(): void {
    setCalendarEditingTools(false);
    setPlannerMode("month");
    setFocusedTemplateField(null);
    resetShellMessages();
  }

  function openWorkPatternMode(): void {
    setPlannerMode("workPattern");
    setWorkPatternReturnToMonth(false);
    setFocusedTemplateField(null);
    resetShellMessages();
  }

  function openCommitmentLibraryMode(): void {
    setPlannerMode("commitmentLibrary");
    setReturnToReviewAvailable(false);
    setFocusedTemplateField(null);
    setRequestedCommitmentEditorTarget(null);
    setRequestedAddCommitmentEditor(false);
    resetShellMessages();
  }

  function openScheduleMode(): void {
    setPlannerMode("schedule");
    setFocusedTemplateField(null);
    resetShellMessages();
  }

  function openReviewPeriod(range: { start: string; end: string }): void {
    scheduleReviewNavigation(goalEditingContext).update({ range });
    openScheduleMode();
  }

  function openSummaryScreen(): void {
    setCurrentScreen("summary");
    setFocusedTemplateField(null);
    resetShellMessages();
  }

  function openTodayScreen(): void {
    openDay(currentPlannerView(storeRef.current.getState(), getNow()).selectedLabel);
    setFocusedTemplateField(null);
    resetShellMessages();
  }

  function openFullPreviewScreen(): void {
    clearPreviewSelection();
    openScheduleMode();
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
      const labels: Record<string, string> = {
        invalidTemplate: "Check the Commitment duration, timing and resources",
        invalidRecurrence: "Check the repeat settings and dates",
        invalidCycle: "Check the Work period dates and configuration",
        invalidSegment: "Check the dated Work period",
        overlappingSegment: "Dated Work periods overlap",
        overlappingCycle: "Work cycles overlap",
        invalidSequence: "Check the repeating rotation",
        invalidSchedulingPreference: "Check day and week start settings",
        invalidPreviewRange: "Check the planning range",
        missingSourceReference: "A linked source is missing",
      };
      setSetupIssues(
        result.validation.issues.map((issue) => {
          const source =
            setupDraft.templateEntries.find(
              (e) => e.template.id === issue.sourceId || e.recurrence.id === issue.sourceId,
            )?.template.title ??
            setupDraft.shiftDefinitions.find((s) => s.id === issue.sourceId)?.name ??
            setupDraft.shiftCycles.find((s) => s.id === issue.sourceId)?.name;
          return (
            (source ? source + ": " : "") +
            (labels[issue.code] ??
              "Check this authored source for conflicting or incomplete fields")
          );
        }),
      );
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

  function openSetupForFixedTime(templateId: string): void {
    setPlannerMode("commitmentLibrary");
    setFocusedTemplateField({
      templateId,
      field: "fixedStartTime",
    });
    resetShellMessages();
  }

  function handleCompactPreviewDayClick(userDayDate: LocalDateString): void {
    setPreservedMonthView({
      selectedLabel: userDayDate,
      displayedMonth: userDayDate.slice(0, 7) as typeof preservedMonthView.displayedMonth,
    });
    const currentSelection = selectedPreviewDayRange;

    if (
      currentSelection === null ||
      currentSelection.startDate !== currentSelection.endDate ||
      pendingPreviewRangeStartDate === null
    ) {
      setSelectedPreviewDayRange({ startDate: userDayDate, endDate: userDayDate });
      setPendingPreviewRangeStartDate(userDayDate);
    } else if (pendingPreviewRangeStartDate === userDayDate) {
      setSelectedPreviewDayRange({ startDate: userDayDate, endDate: userDayDate });
    } else {
      setSelectedPreviewDayRange(orderPreviewDayRange(pendingPreviewRangeStartDate, userDayDate));
      setPendingPreviewRangeStartDate(null);
    }

    setPlannerMode("schedule");
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
      setEditingManualEventIncarnationId(existingManualEvent.incarnationId);
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
    setEditingManualEventIncarnationId(null);
    setEditingManualEventIncarnationId(null);
    setManualEventDraft({
      title: "",
      userDayDate,
      allDay: false,
      startTime: "09:00",
      endTime: "10:00",
      notes: "",
    });
  }

  function openNewEventFromReview(userDayDate: LocalDateString): void {
    setPreservedMonthView({
      selectedLabel: userDayDate,
      displayedMonth: userDayDate.slice(0, 7) as typeof preservedMonthView.displayedMonth,
    });
    setManualEventReturnToMonth(false);
    setSelectedPreviewDayRange({ startDate: userDayDate, endDate: userDayDate });
    setPendingPreviewRangeStartDate(null);
    setActiveManualEventDate(userDayDate);
    setEditingManualEventId(null);
    setManualEventDraft({
      title: "",
      userDayDate,
      allDay: false,
      startTime: "09:00",
      endTime: "10:00",
      notes: "",
    });
    setContextualNavigationMessage("");
    requestAnimationFrame(() => document.getElementById("manual-event-title")?.focus());
  }

  function openExistingEventFromReview(target: {
    logicalId: string;
    incarnationId?: string;
    userDayDate?: LocalDateString;
  }): void {
    setManualEventReturnToMonth(false);
    const event = storeRef.current
      .getState()
      .manualEvents.find(
        (candidate) =>
          candidate.id === target.logicalId &&
          (!target.incarnationId || candidate.incarnationId === target.incarnationId),
      );
    if (!event) {
      setContextualNavigationMessage(
        "This event has changed or is no longer available to edit from this schedule.",
      );
      return;
    }
    setSelectedPreviewDayRange({ startDate: event.userDayDate, endDate: event.userDayDate });
    setActiveManualEventDate(event.userDayDate);
    setEditingManualEventId(event.id);
    setEditingManualEventIncarnationId(event.incarnationId);
    setManualEventDraft({
      title: event.title,
      userDayDate: event.userDayDate,
      allDay: event.allDay,
      startTime: event.startTime ?? "",
      endTime: event.endTime ?? "",
      notes: event.notes ?? "",
    });
    setContextualNavigationMessage("");
    requestAnimationFrame(() => document.getElementById("manual-event-title")?.focus());
  }

  function openCommitmentFromReview(target: CommitmentEditorTarget): void {
    setRequestedCommitmentEditorTarget(target);
    setReturnToReviewAvailable(true);
    setContextualNavigationMessage("");
    setPlannerMode("commitmentLibrary");
    setFocusedTemplateField(null);
    resetShellMessages();
  }

  function openCommitmentFromMonth(target: CommitmentTarget): void {
    setRequestedCommitmentEditorTarget({
      logicalId: target.templateId,
      incarnationId: target.templateIncarnationId,
      recurrenceLogicalId: target.recurrenceId,
      recurrenceIncarnationId: target.recurrenceIncarnationId,
    });
    setRequestedAddCommitmentEditor(false);
    setReturnToReviewAvailable(false);
    setContextualNavigationMessage("");
    setMonthPlanWorkspace("commitment");
  }

  function openNewCommitmentFromMonth(): void {
    setRequestedCommitmentEditorTarget(null);
    setRequestedAddCommitmentEditor(true);
    setReturnToReviewAvailable(false);
    setContextualNavigationMessage("");
    setMonthPlanWorkspace("commitment");
  }

  function openCommitmentLibraryFromMonth(): void {
    setRequestedCommitmentEditorTarget(null);
    setRequestedAddCommitmentEditor(false);
    setReturnToReviewAvailable(false);
    setContextualNavigationMessage("");
    setMonthPlanWorkspace("commitmentLibrary");
  }

  function openWorkFromMonth(): void {
    setRequestedWorkEditor(true);
    setReturnToReviewAvailable(false);
    setContextualNavigationMessage("");
    setMonthPlanWorkspace("work");
  }

  function openWorkPatternFromMonth(): void {
    setRequestedWorkEditor(false);
    setReturnToReviewAvailable(false);
    setContextualNavigationMessage("");
    setFocusedTemplateField(null);
    setMonthPlanWorkspace("work");
  }

  function openPlanningSettingsFromMonth(): void {
    setRequestedCommitmentEditorTarget(null);
    setRequestedAddCommitmentEditor(false);
    setRequestedWorkEditor(false);
    setReturnToReviewAvailable(false);
    setContextualNavigationMessage("");
    setMonthPlanWorkspace("planningSettings");
  }

  function openAttentionFromMonth(input: {
    frictionPointId: string;
    userDayDate: LocalDateString;
  }): void {
    const current = storeRef.current
      .getState()
      .preview?.result.frictionPoints.find(
        (point) => point.id === input.frictionPointId && !point.ignored && !point.resolved,
      );
    if (!current) {
      setContextualNavigationMessage(
        "This schedule issue has changed or is no longer available to review.",
      );
      requestAnimationFrame(() => document.getElementById("selected-day-heading")?.focus());
      return;
    }
    setSelectedPreviewDayRange({ startDate: input.userDayDate, endDate: input.userDayDate });
    setPendingReviewFrictionId(current.id);
    setContextualNavigationMessage("");
    openScheduleMode();
  }

  function generateScheduleFromMonth(): void {
    generatePreviewFromSavedState();
    requestAnimationFrame(() => document.getElementById("month-schedule-status")?.focus());
  }

  function openNewEventFromMonth(userDayDate: LocalDateString): void {
    openNewEventFromReview(userDayDate);
    setManualEventReturnToMonth(true);
  }

  function openExistingEventFromMonth(target: EventTarget): void {
    openExistingEventFromReview({
      logicalId: target.eventId,
      incarnationId: target.eventIncarnationId,
    });
    setManualEventReturnToMonth(true);
  }

  function openWorkFromReview(): void {
    setRequestedWorkEditor(true);
    setReturnToReviewAvailable(true);
    setContextualNavigationMessage("");
    setPlannerMode("workPattern");
    setFocusedTemplateField(null);
    resetShellMessages();
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
    setEditingManualEventIncarnationId(
      storeRef.current.getState().manualEvents.find((event) => event.id === nextManualEvent.id)
        ?.incarnationId ?? null,
    );
    setManualEventDraft({
      title: nextManualEvent.title,
      userDayDate: nextManualEvent.userDayDate,
      allDay: nextManualEvent.allDay,
      startTime: nextManualEvent.startTime ?? "",
      endTime: nextManualEvent.endTime ?? "",
      notes: nextManualEvent.notes ?? "",
    });
    regeneratePreviewIfPresent();
    if (manualEventReturnToMonth) {
      setActiveManualEventDate(null);
      setManualEventDraft(null);
      setEditingManualEventId(null);
      setManualEventReturnToMonth(false);
      requestAnimationFrame(() => document.getElementById("selected-day-heading")?.focus());
    }
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
    setEditingManualEventIncarnationId(null);
    if (activeManualEventDate) {
      openManualEventPanel(activeManualEventDate);
    }
    regeneratePreviewIfPresent();
    if (manualEventReturnToMonth) {
      setActiveManualEventDate(null);
      setManualEventDraft(null);
      setManualEventReturnToMonth(false);
      requestAnimationFrame(() => document.getElementById("selected-day-heading")?.focus());
    }
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
        setPlanDecisionFeedback({
          tone: "warning",
          message:
            "Accepted choices are protected by recovery-required stored data and cannot be changed.",
        });
        return;
      }
      setPendingPlanDecisionAcceptance({ candidate: structuredClone(mapped.candidate) });
    }
  }

  const correctionDispatch = useRef(false);
  useEffect(() => {
    correctionDispatch.current = false;
  }, [pendingPlanDecisionAcceptance, planDecisionFeedback]);
  function acceptPendingPlanDecision(): void {
    if (correctionDispatch.current) return;
    const pending = pendingPlanDecisionAcceptance;
    const currentPreview = storeRef.current.getState().preview;
    if (!pending || !currentPreview || currentPreview.isStale) {
      setPendingPlanDecisionAcceptance(null);
      setPlanDecisionFeedback({
        tone: "warning",
        message: "Regenerate the preview before accepting this choice.",
      });
      return;
    }
    correctionDispatch.current = true;
    const result = storeRef.current.acceptPlanDecision(structuredClone(pending.candidate));
    if (result.status === "rejected") {
      const stale =
        result.reason === "targetSourceMissing" ||
        result.reason === "targetLifetimeMismatch" ||
        result.reason === "targetOccurrenceMissing";
      if (stale) setPendingPlanDecisionAcceptance(null);
      setPlanDecisionFeedback({
        tone: "warning",
        message:
          result.reason === "protectedDecisionIngress"
            ? "Accepted choices are protected by recovery-required stored data and cannot be changed."
            : stale
              ? "This choice is no longer current. Regenerate the preview and try again."
              : "DayFrame could not accept this choice.",
      });
      return;
    }
    setPendingPlanDecisionAcceptance(null);
    const durable = result.persistence.status === "persisted";
    try {
      generatePreviewFromSavedState();
      const replay = storeRef.current
        .getState()
        .preview?.result.planDecisionResults.find((item) => item.decisionId === result.decision.id);
      setPlanDecisionFeedback({
        tone: replay?.status === "applied" ? "info" : "warning",
        message: describeAcceptedDecision(durable, replay?.status),
      });
    } catch {
      setPlanDecisionFeedback({
        tone: "warning",
        message: durable
          ? "Accepted and saved, but the preview could not be regenerated."
          : "Accepted for this session, but saving and preview regeneration failed.",
      });
    }
  }

  function retryPlanDecisionDurability(): void {
    const result = storeRef.current.retryPlanDecisionPersistence();
    const saved = result.status === "attempted" && result.persistence.status === "persisted";
    setPlanDecisionFeedback({
      tone: saved ? "info" : "warning",
      message: saved
        ? "Accepted choice save retry succeeded."
        : "Accepted choice is still available for this session, but could not be saved.",
    });
  }

  function removeAcceptedDecision(
    decisionId: Parameters<DayFrameAppStore["removePlanDecision"]>[0],
  ): void {
    const preview = storeRef.current.getState().preview;
    const shouldRegenerate = preview !== null && !preview.isStale;
    const sleep =
      storeRef.current.getPlanDecisions().find((d) => d.id === decisionId)?.kind ===
      "placeSleepOccurrence";
    const result = storeRef.current.removePlanDecision(decisionId);
    if (result.status === "notAttempted") {
      setPlanDecisionFeedback({
        tone: "warning",
        message:
          result.reason === "protectedDecisionIngress"
            ? "Accepted choices are protected by recovery-required stored data and cannot be removed."
            : result.reason === "storageFailure"
              ? "Saving failed. The accepted placement has not been revoked."
              : "That accepted choice is no longer present.",
      });
      return;
    }
    const durable = result.persistence.status === "persisted";
    setPendingPlanDecisionAcceptance(null);
    setPlanDecisionFeedback({
      tone: durable ? "info" : "warning",
      message: durable
        ? sleep
          ? "Sleep placement revoked and saved. Required Sleep will be solved again."
          : "Accepted choice removed and saved."
        : "Accepted choice removed for this session; saving failed. Retry before closing DayFrame.",
    });
    if (shouldRegenerate) {
      try {
        generatePreviewFromSavedState();
      } catch {
        setPlanDecisionFeedback({
          tone: "warning",
          message: durable
            ? "Accepted choice was removed and saved, but the preview could not be regenerated."
            : "Accepted choice was removed for this session, but saving and preview regeneration failed.",
        });
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
      setProfileRecoveryMessage(
        "The preserved profile source is not currently readable for export.",
      );
      return;
    }
    downloadRecoveryData(result.raw, "dayframe-profile-recovery.json", false);
    setProfileRecoveryMessage("Preserved profile data exported. No saved data was changed.");
  }

  function recheckProtectedProfiles(): void {
    const result = storeRef.current.recheckProtectedProfileSource();
    setProfileRecoveryMessage(
      result === "unchanged"
        ? "The preserved profile source is unchanged and still needs an explicit recovery choice."
        : result === "sourceChanged"
          ? "Saved profile data changed outside DayFrame. Reload before choosing a recovery action."
          : "The preserved profile source could not be rechecked.",
    );
  }

  function confirmProfileRecovery(action: "replace" | "abandon"): void {
    const result =
      action === "replace"
        ? storeRef.current.replaceProtectedProfileCheckpointWithCurrentProfiles()
        : storeRef.current.abandonProtectedProfileCheckpoint();
    setPendingProfileRecovery(null);
    if (result.status === "resolved") {
      setProfileRecoveryMessage(
        action === "replace"
          ? "Protected saved profiles were replaced with the current valid profile collection."
          : "Protected saved profiles were abandoned and an authoritative empty collection was saved.",
      );
    } else if (result.status === "notAttempted" && result.reason === "sourceChanged") {
      setProfileRecoveryMessage(
        "Saved profile data changed outside DayFrame. Recovery was stopped; reload before choosing again.",
      );
    } else {
      setProfileRecoveryMessage(
        "Profile recovery did not complete. The preserved source remains protected.",
      );
    }
  }

  function exportQuarantine(entry: QuarantinedProfileEntry): void {
    const result = storeRef.current.exportQuarantinedProfile(entry.quarantineId);
    if (result.status !== "exported") return;
    downloadRecoveryData(
      JSON.stringify(result.entry, null, 2),
      `dayframe-quarantined-profile-${entry.originalProfileId ?? entry.quarantineId}.json`,
      false,
    );
    setProfileRecoveryMessage("Quarantined profile entry exported. No saved data was changed.");
  }

  function confirmQuarantineRemoval(quarantineId: string): void {
    const result = storeRef.current.removeQuarantinedProfile(quarantineId);
    setPendingProfileRecovery(null);
    setQuarantineEntries(storeRef.current.getQuarantinedProfiles());
    setProfileRecoveryMessage(
      result.status === "removed"
        ? result.persistence.status === "persisted"
          ? "Quarantined profile entry permanently removed."
          : "Entry removed for this session, but the updated profile collection was not durably saved."
        : "The quarantined profile entry was not removed.",
    );
  }

  return (
    <div className="df-app">
      <div className="df-shell">
        <header className="df-foundation-header">
          <strong>DayFrame</strong>
          <nav aria-label="App Sections" className="df-foundation-primary">
            <button
              className="df-secondary-button"
              type="button"
              aria-pressed={currentScreen === "planner"}
              onClick={() => setCurrentScreen("planner")}
            >
              Planner
            </button>
            <button
              className="df-secondary-button"
              type="button"
              aria-pressed={currentScreen === "summary"}
              onClick={openSummaryScreen}
            >
              Summary
            </button>
          </nav>
          <div className="df-foundation-location">
            <h2 ref={navigationHeading} tabIndex={-1} className="df-foundation-location-title">
              {currentScreen === "summary"
                ? "Summary"
                : plannerMode === "month"
                  ? "Calendar"
                  : plannerMode === "today" || plannerMode === "day"
                    ? "Selected day"
                    : plannerMode === "goals"
                      ? "Planner / Goals"
                      : plannerMode === "schedule"
                        ? "Planner / Review Schedule"
                        : "My Schedule"}
            </h2>
            {canGoBack ? (
              <button className="df-secondary-button" type="button" onClick={goBack}>
                Back
              </button>
            ) : null}
          </div>
        </header>
        {profileIngressStatus.status === "recoveryRequired" ? (
          <section aria-labelledby="dayframe-profile-recovery-title" className="df-danger-message">
            <h2 id="dayframe-profile-recovery-title">Saved profiles need recovery</h2>
            <p>
              Saved profiles could not be safely loaded. The original data has been preserved, and
              ordinary profile saving and deletion are blocked until you choose a recovery action.
            </p>
            <div className="df-screen-actions">
              <button
                className="df-secondary-button"
                onClick={recheckProtectedProfiles}
                type="button"
              >
                Recheck preserved profile data
              </button>
              <button
                className="df-secondary-button"
                disabled={!profileIngressStatus.sourcePreserved}
                onClick={exportProtectedProfiles}
                type="button"
              >
                Export preserved profile data
              </button>
              <button
                className="df-secondary-button"
                onClick={() => setPendingProfileRecovery("replace")}
                type="button"
              >
                Replace with current profiles
              </button>
              <button
                className="df-danger-button"
                onClick={() => setPendingProfileRecovery("abandon")}
                type="button"
              >
                Abandon protected profiles
              </button>
            </div>
            {pendingProfileRecovery === "replace" || pendingProfileRecovery === "abandon" ? (
              <div className="df-form-stack">
                <p>
                  {pendingProfileRecovery === "replace"
                    ? "Confirm replacement of the preserved source with the current valid profile collection."
                    : "Confirm permanent abandonment of the preserved source and all session profiles."}
                </p>
                <div className="df-confirmation-actions">
                  <button
                    className="df-danger-button"
                    onClick={() => confirmProfileRecovery(pendingProfileRecovery)}
                    type="button"
                  >
                    {pendingProfileRecovery === "replace"
                      ? "Confirm replace protected profiles"
                      : "Confirm abandon protected profiles"}
                  </button>
                  <button
                    className="df-secondary-button"
                    onClick={() => setPendingProfileRecovery(null)}
                    type="button"
                  >
                    Cancel profile recovery
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
        {profileIngressStatus.status === "accepted" && quarantineEntries.length > 0 ? (
          <section
            aria-labelledby="dayframe-profile-quarantine-title"
            className="df-danger-message"
          >
            <h2 id="dayframe-profile-quarantine-title">Some saved profiles need attention</h2>
            <p>
              {quarantineEntries.length} saved profile{" "}
              {quarantineEntries.length === 1 ? "entry was" : "entries were"} preserved because
              validation did not succeed. Valid profiles remain available.
            </p>
            <ul className="df-plain-list">
              {quarantineEntries.map((entry) => (
                <li key={entry.quarantineId}>
                  <span>
                    {entry.originalProfileName ??
                      entry.originalProfileId ??
                      "Unnamed profile entry"}
                  </span>
                  <div className="df-screen-actions">
                    <button
                      className="df-secondary-button"
                      onClick={() => exportQuarantine(entry)}
                      type="button"
                    >
                      Export quarantined entry
                    </button>
                    <button
                      className="df-danger-button"
                      onClick={() => setPendingProfileRecovery(entry.quarantineId)}
                      type="button"
                    >
                      Remove quarantined entry
                    </button>
                  </div>
                  {pendingProfileRecovery === entry.quarantineId ? (
                    <div className="df-confirmation-actions">
                      <button
                        className="df-danger-button"
                        onClick={() => confirmQuarantineRemoval(entry.quarantineId)}
                        type="button"
                      >
                        Confirm remove quarantined entry
                      </button>
                      <button
                        className="df-secondary-button"
                        onClick={() => setPendingProfileRecovery(null)}
                        type="button"
                      >
                        Cancel removal
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {profileRecoveryMessage ? (
          <p className="df-confirmation" role="status">
            {profileRecoveryMessage}
          </p>
        ) : null}
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
        <div className="df-foundation-support">
          <div className="df-foundation-support-content">
            <details className="df-foundation-utilities">
              <summary>Settings and data</summary>
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

                                setPlannerMode("month");
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
                    disabled={isBackupBusy || isClearBusy}
                    onClick={async () => {
                      setIsBackupBusy(true);
                      const result = await storeRef.current.exportBackupV14(getExportedAt());
                      if (result.status === "exported") {
                        downloadDayFrameBackup(result.backup);
                        setBackupMessage("Complete DayFrame backup downloaded.");
                        setBackupErrorMessage("");
                      } else {
                        setBackupMessage("");
                        setBackupErrorMessage(
                          result.status === "protectedSurface"
                            ? `Backup is unavailable while ${result.surface} recovery is protected.`
                            : "Backup is temporarily unavailable. Your DayFrame authority was preserved.",
                        );
                      }
                      setBackupDurabilityFeedback(null);
                      setProfileMessage("");
                      setProfileDurabilityFeedback(null);
                      setProfileErrorMessage("");
                      setIsConfirmingClearLocalData(false);
                      setClearDurabilityFeedback(null);
                      setIsBackupBusy(false);
                    }}
                    type="button"
                  >
                    {isBackupBusy ? "Preparing Backup…" : "Export Complete Backup"}
                  </button>
                  <button
                    className="df-secondary-button"
                    aria-describedby={
                      backupErrorMessage || backupMessage ? "backup-import-feedback" : undefined
                    }
                    ref={importButtonRef}
                    disabled={isBackupBusy || isClearBusy}
                    onClick={() => {
                      importInputRef.current?.click();
                    }}
                    type="button"
                  >
                    Import Setup Backup
                  </button>
                  <button
                    className="df-secondary-button"
                    disabled={isBackupBusy || isClearBusy}
                    onClick={() => {
                      setIsConfirmingClearLocalData(true);
                      setClearFailureMessage("");
                      setSetupDurabilityFeedback(null);
                      setClearDurabilityFeedback(null);
                      setBackupMessage("");
                      setBackupDurabilityFeedback(null);
                      setBackupErrorMessage("");
                      setProfileMessage("");
                      setProfileDurabilityFeedback(null);
                      setProfileErrorMessage("");
                    }}
                    ref={clearButtonRef}
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
                    setIsBackupBusy(true);
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
                      (value) => {
                        setClearDurabilityFeedback(value);
                        setClearFailureMessage("");
                      },
                      setPlannerMode,
                      clearPreviewSelection,
                      setPreviewGuardrailMissingItems,
                      setIsConfirmingClearLocalData,
                      resetGoalEditing,
                    );
                    setIsBackupBusy(false);
                  }}
                  ref={(node) => {
                    importInputRef.current = node as unknown as FileInputLike | null;
                  }}
                  type="file"
                />
                {clearFailureMessage ? (
                  <p role="alert" className="df-danger-message">
                    {clearFailureMessage}
                  </p>
                ) : null}
                {isConfirmingClearLocalData ? (
                  <div className="df-form-stack">
                    <p className="df-danger-message">
                      Clear all locally saved DayFrame setup data?
                    </p>
                    <div className="df-confirmation-actions">
                      <button
                        className="df-danger-button"
                        disabled={isClearBusy}
                        onClick={async () => {
                          setIsClearBusy(true);
                          setClearFailureMessage("");
                          try {
                            const result = await storeRef.current.clearLocalData();
                            resetGoalEditing();
                            setPlannerMode("month");
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
                          } catch (error) {
                            setIsConfirmingClearLocalData(false);
                            setClearFailureMessage(
                              error instanceof Error &&
                                "reason" in error &&
                                error.reason === "protected"
                                ? "Protected history or local authority blocks clear. Clear was not started. Use the existing supported recovery path."
                                : error instanceof Error &&
                                    "reason" in error &&
                                    error.reason === "authorityTransactionActive"
                                  ? "Publication or another authority operation is still finishing. Clear was not started. Wait for settlement, then explicitly try again."
                                  : error instanceof Error &&
                                      "reason" in error &&
                                      error.reason === "initializing"
                                    ? "DayFrame is still initializing. Clear was not started."
                                    : "The clear result could not be confirmed. Local data may have changed; inspect its status before retrying.",
                            );
                          } finally {
                            setIsClearBusy(false);
                          }
                        }}
                        type="button"
                      >
                        {isClearBusy ? "Clearing Local Data…" : "Confirm Clear Local Data"}
                      </button>
                      <button
                        className="df-secondary-button"
                        disabled={isClearBusy}
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
                  <p id="backup-import-feedback" className="df-danger-message" role="alert">
                    {backupErrorMessage}
                  </p>
                ) : backupDurabilityFeedback ? (
                  <p className={getDurabilityFeedbackClassName(backupDurabilityFeedback)}>
                    {getMutationFeedbackMessage("backupImport", backupDurabilityFeedback)}
                  </p>
                ) : backupMessage ? (
                  <p id="backup-import-feedback" className="df-success-message" role="status">
                    {backupMessage}
                  </p>
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
                    Complete backups include setup, profiles, accepted decisions, historical plans,
                    execution outcomes, notes, and timestamps. Preview data is not included; protect
                    the downloaded JSON as private personal data.
                  </p>
                )}
              </section>
            </details>
            <section className="df-compatibility-actions">
              {currentScreen === "planner" && plannerMode === "schedule" && previewSummary ? (
                <section className="df-compact-preview" aria-labelledby="compact-preview-heading">
                  <div className="df-compact-preview-header">
                    <div className="df-screen-header">
                      <p className="df-workflow-eyebrow">Latest schedule</p>
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
                      Open Review Schedule
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

              {currentScreen === "planner" &&
              (plannerMode === "month" || plannerMode === "schedule") &&
              activeManualEventDate &&
              manualEventDraft ? (
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
                            <p className="df-empty">No schedule conflicts.</p>
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
                        setEditingManualEventIncarnationId(null);
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
                        const shouldReturnFocusToMonth = manualEventReturnToMonth;
                        setActiveManualEventDate(null);
                        setManualEventDraft(null);
                        setEditingManualEventId(null);
                        setEditingManualEventIncarnationId(null);
                        setConfirmingDeleteManualEventId(null);
                        setManualEventReturnToMonth(false);
                        if (shouldReturnFocusToMonth) {
                          requestAnimationFrame(() =>
                            document.getElementById("selected-day-heading")?.focus(),
                          );
                        } else if (plannerMode === "schedule") {
                          const intent = goalEditingContext
                            .cell("review-return-focus", () => ({ key: "", section: "" }))
                            .get();
                          requestAnimationFrame(() => {
                            if (!goalEditingContext.isValid()) return;
                            const origin = [
                              ...document.querySelectorAll<HTMLElement>("[data-review-return]"),
                            ].find((element) => element.dataset.reviewReturn === intent.key);
                            (
                              origin ?? document.getElementById("schedule-friction-heading")
                            )?.focus();
                          });
                        }
                      }}
                      type="button"
                    >
                      {manualEventReturnToMonth ? "Back to day" : "Close"}
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
                                setEditingManualEventIncarnationId(manualEvent.incarnationId);
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
        </div>

        {currentScreen === "planner" ? (
          <PlannerSurface
            mode={plannerMode}
            onOpenGoals={() => setPlannerMode("goals")}
            onOpenToday={openTodayScreen}
            selectedDay={plannerMode === "day" ? dayOwner : preservedMonthView.selectedLabel}
            goalsContent={
              <LazySurfaceBoundary name="Goals">
                <Suspense fallback={<LazySurfaceLoading name="Goals" />}>
                  <GoalSection
                    {...(dayGoalId ? { initialGoalId: dayGoalId } : {})}
                    context={goalEditingContext}
                    onInitialGoalHandled={() => setDayGoalId(undefined)}
                    store={storeRef.current}
                    state={stateSnapshot}
                    renderRecorded={(goal) => (
                      <Suspense fallback={<LazySurfaceLoading name="Recorded evidence" />}>
                        <GoalRecordedInspection
                          {...(goalRecordedNavigation(goalEditingContext, goal.id).get().range
                            ? {
                                navigationRange: goalRecordedNavigation(
                                  goalEditingContext,
                                  goal.id,
                                ).get().range!,
                              }
                            : {})}
                          onNavigationConsumed={() =>
                            goalRecordedNavigation(goalEditingContext, goal.id).update({
                              range: null,
                            })
                          }
                          goal={goal}
                          store={activeStore}
                          context={goalEditingContext}
                          currentDay={(instant) =>
                            currentPlannerView(stateSnapshot, instant).selectedLabel
                          }
                          now={getNow}
                          onDay={openDay}
                        />
                      </Suspense>
                    )}
                    renderStructure={(goal, onGoal) => (
                      <Suspense fallback={<LazySurfaceLoading name="Goal Structure" />}>
                        <GoalStructureSection
                          key={goal.id}
                          goal={goal}
                          context={goalEditingContext}
                          store={storeRef.current}
                          onGoal={onGoal}
                          now={getNow}
                        />
                      </Suspense>
                    )}
                    renderInspection={(goalId) => (
                      <Suspense fallback={<LazySurfaceLoading name="Goal evidence" />}>
                        <GoalAcceptedPlanningSection
                          key={goalId}
                          goalId={goalId}
                          context={goalEditingContext}
                          currentDay={currentPlannerView(stateSnapshot, getNow()).selectedLabel}
                          query={activeStore.queryAcceptedPlanningEvidence}
                          store={activeStore}
                          now={getNow}
                          onDay={(owner) => openDay(owner)}
                          onReview={openScheduleMode}
                        />
                      </Suspense>
                    )}
                    renderPlanning={(goal) => (
                      <Suspense fallback={<LazySurfaceLoading name="Goal planning" />}>
                        <GoalPlanningSection
                          key={goal.id}
                          context={goalEditingContext}
                          goal={goal}
                          store={storeRef.current}
                          state={stateSnapshot}
                          now={getNow}
                          onOpenReview={openScheduleMode}
                        />
                      </Suspense>
                    )}
                  />
                </Suspense>
              </LazySurfaceBoundary>
            }
            todayContent={
              <LazySurfaceBoundary name="Day">
                <Suspense fallback={<LazySurfaceLoading name="Day" />}>
                  <DayWorksurface
                    ownerDay={dayOwner}
                    now={getNow}
                    query={activeStore.querySelectedDayEvidence}
                    store={activeStore}
                    refreshKey={stateSnapshot}
                    onReview={() => openReviewPeriod({ start: dayOwner, end: dayOwner })}
                    onWork={openWorkPatternMode}
                    onGoal={(id) => {
                      setDayGoalId(id);
                      setPlannerMode("goals");
                    }}
                    onAddEvent={() => {
                      setCalendarEditingTools(true);
                      setPlannerMode("month");
                      openNewEventFromMonth(dayOwner as LocalDateString);
                    }}
                    onEditEvent={(target) => {
                      setCalendarEditingTools(true);
                      setPlannerMode("month");
                      openExistingEventFromMonth(target);
                    }}
                    onCompatibility={() => {
                      setCalendarEditingTools(true);
                      setPlannerMode("month");
                    }}
                  />
                </Suspense>
              </LazySurfaceBoundary>
            }
            monthContent={
              <LazySurfaceBoundary name="Monthly Planner">
                <Suspense fallback={<LazySurfaceLoading name="Planner" />}>
                  <MonthlyPlannerSurface
                    onOpenEditingTools={() => setCalendarEditingTools(true)}
                    {...(!calendarEditingTools
                      ? { onOpenDay: (label: LocalDateString) => openDay(label, true) }
                      : {})}
                    goalNames={Object.fromEntries(
                      activeStore.listGoals().map((goal) => [goal.id, goal.title]),
                    )}
                    realizedScheduleFacts={activeStore.listRealizedScheduleFacts()}
                    contextualPlanContent={
                      monthPlanWorkspace ? (
                        <>
                          <LazySurfaceBoundary
                            name={
                              monthPlanWorkspace === "planningSettings"
                                ? "Planning Settings"
                                : "Planning workspace"
                            }
                          >
                            <Suspense
                              fallback={
                                <LazySurfaceLoading
                                  name={
                                    monthPlanWorkspace === "planningSettings"
                                      ? "Planning Settings"
                                      : "Planning workspace"
                                  }
                                />
                              }
                            >
                              <SetupScreen
                                saveIssues={setupIssues}
                                conversionStore={storeRef.current}
                                compositionStore={activeStore}
                                onDiscardDraft={() => {
                                  setSetupDraft(
                                    buildSetupDraft(
                                      storeRef.current.getState(),
                                      createIsoTimestamp(),
                                    ),
                                  );
                                  setSetupValidationMessage("");
                                  setSetupDurabilityFeedback(null);
                                }}
                                draft={setupDraft}
                                embedded
                                focusedTemplateField={focusedTemplateField}
                                isDirty={isSetupDirty}
                                onOpenCommitmentEditorInvalidated={() => {
                                  setContextualNavigationMessage(
                                    "This commitment has changed or is no longer available to edit from this schedule.",
                                  );
                                }}
                                onRequestedAddCommitmentEditorHandled={() =>
                                  setRequestedAddCommitmentEditor(false)
                                }
                                onRequestedCommitmentEditorTargetHandled={(status) => {
                                  setRequestedCommitmentEditorTarget(null);
                                  if (status === "unavailable") {
                                    setContextualNavigationMessage(
                                      "This commitment has changed or is no longer available to edit from this schedule.",
                                    );
                                  }
                                }}
                                onRequestedWorkEditorHandled={() => setRequestedWorkEditor(false)}
                                onSave={saveCurrentSetup}
                                requestedAddCommitmentEditor={requestedAddCommitmentEditor}
                                requestedCommitmentEditorTarget={requestedCommitmentEditorTarget}
                                requestedWorkEditor={requestedWorkEditor}
                                scope={
                                  monthPlanWorkspace === "planningSettings"
                                    ? "planningSettings"
                                    : monthPlanWorkspace === "work"
                                      ? "workPattern"
                                      : "commitmentLibrary"
                                }
                                saveMessage={
                                  setupValidationMessage ||
                                  (setupDurabilityFeedback
                                    ? getMutationFeedbackMessage("setup", setupDurabilityFeedback)
                                    : "")
                                }
                                saveMessageTone={
                                  !setupValidationMessage &&
                                  (setupDurabilityFeedback === null ||
                                    setupDurabilityFeedback === "durableSuccess")
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
                            </Suspense>
                          </LazySurfaceBoundary>
                        </>
                      ) : null
                    }
                    contextualPlanWide={
                      monthPlanWorkspace === "planningSettings" ||
                      monthPlanWorkspace === "work" ||
                      monthPlanWorkspace === "commitment" ||
                      monthPlanWorkspace === "commitmentLibrary"
                    }
                    getNow={getNow}
                    view={preservedMonthView}
                    onAddCommitment={openNewCommitmentFromMonth}
                    onAddEvent={openNewEventFromMonth}
                    onBackToDay={() => {
                      setMonthPlanWorkspace(null);
                      setRequestedCommitmentEditorTarget(null);
                      setRequestedAddCommitmentEditor(false);
                      setRequestedWorkEditor(false);
                      setContextualNavigationMessage("");
                      requestAnimationFrame(() =>
                        document.getElementById("selected-day-heading")?.focus(),
                      );
                    }}
                    onEditCommitment={openCommitmentFromMonth}
                    onEditEvent={openExistingEventFromMonth}
                    onEditWork={openWorkFromMonth}
                    contextualMessage={contextualNavigationMessage}
                    generationMessage={
                      previewGuardrailMissingItems.length > 0
                        ? `Finish setup before generating: ${previewGuardrailMissingItems.join(", ")}.`
                        : ""
                    }
                    isSetupDirty={isSetupDirty}
                    onGenerateSchedule={generateScheduleFromMonth}
                    onOpenAttention={openAttentionFromMonth}
                    onOpenPlanningSettings={openPlanningSettingsFromMonth}
                    onOpenCommitmentLibrary={openCommitmentLibraryFromMonth}
                    onOpenReview={openScheduleMode}
                    onReviewPeriod={(scope) =>
                      openReviewPeriod({
                        start: scope.startUserDayDate,
                        end: addUserDayLabels(scope.endUserDayDateExclusive, -1),
                      })
                    }
                    onOpenWorkPattern={openWorkPatternFromMonth}
                    onViewChange={setPreservedMonthView}
                    readiness={activeStore.getReadiness()}
                    queryPlanningReview={activeStore.queryPlanningReview}
                    subscribePlanningReview={activeStore.subscribePlanningReview}
                    previewState={
                      stateSnapshot.preview?.isStale
                        ? "stale"
                        : stateSnapshot.preview
                          ? "current"
                          : "none"
                    }
                    state={stateSnapshot}
                  />
                </Suspense>
              </LazySurfaceBoundary>
            }
            onOpenMonth={openMonthMode}
            onOpenSchedule={openScheduleMode}
            onOpenMySchedule={() => setPlannerMode("mySchedule")}
            onOpenSleep={() => setPlannerMode("sleep")}
            myScheduleContent={
              <LazySurfaceBoundary name="My Schedule">
                <Suspense fallback={<LazySurfaceLoading name="My Schedule" />}>
                  <MyScheduleSurface
                    state={stateSnapshot}
                    dirty={isSetupDirty}
                    onWork={openWorkPatternMode}
                    onSleep={() => setPlannerMode("sleep")}
                    onCommitments={openCommitmentLibraryMode}
                    onReview={openScheduleMode}
                  />
                </Suspense>
              </LazySurfaceBoundary>
            }
            sleepContent={
              <LazySurfaceBoundary name="Sleep">
                <Suspense fallback={<LazySurfaceLoading name="Sleep" />}>
                  <SleepRequirementSection
                    store={activeStore}
                    state={stateSnapshot}
                    ownerDay={currentPlannerView(stateSnapshot, getNow()).selectedLabel}
                    setupDirty={isSetupDirty}
                    onReview={openScheduleMode}
                  />
                </Suspense>
              </LazySurfaceBoundary>
            }
            onOpenWorkPattern={openWorkPatternMode}
            onOpenCommitmentLibrary={openCommitmentLibraryMode}
            commitmentLibraryContent={
              <div className="df-workflow-block df-workflow-block--setup">
                {returnToReviewAvailable ? (
                  <section className="df-panel">
                    <button
                      className="df-secondary-button"
                      onClick={() => {
                        setReturnToReviewAvailable(false);
                        openScheduleMode();
                      }}
                      type="button"
                    >
                      Return to Review Schedule
                    </button>
                    {contextualNavigationMessage ? (
                      <p className="df-warning-message" role="status">
                        {contextualNavigationMessage}
                      </p>
                    ) : null}
                  </section>
                ) : null}
                <LazySurfaceBoundary name="Commitment Library">
                  <Suspense fallback={<LazySurfaceLoading name="Commitment Library" />}>
                    <SetupScreen
                      saveIssues={setupIssues}
                      conversionStore={storeRef.current}
                      compositionStore={activeStore}
                      onDiscardDraft={() => {
                        setSetupDraft(
                          buildSetupDraft(storeRef.current.getState(), createIsoTimestamp()),
                        );
                        setSetupValidationMessage("");
                        setSetupDurabilityFeedback(null);
                      }}
                      draft={setupDraft}
                      focusedTemplateField={focusedTemplateField}
                      isDirty={isSetupDirty}
                      onOpenCommitmentEditorInvalidated={() => {
                        setContextualNavigationMessage(
                          "This commitment has changed or is no longer available to edit.",
                        );
                      }}
                      onRequestedAddCommitmentEditorHandled={() =>
                        setRequestedAddCommitmentEditor(false)
                      }
                      onRequestedCommitmentEditorTargetHandled={(status) => {
                        setRequestedCommitmentEditorTarget(null);
                        if (status === "unavailable") {
                          setContextualNavigationMessage(
                            "This commitment has changed or is no longer available to edit.",
                          );
                        }
                      }}
                      onSave={saveCurrentSetup}
                      requestedAddCommitmentEditor={requestedAddCommitmentEditor}
                      requestedCommitmentEditorTarget={requestedCommitmentEditorTarget}
                      saveMessage={
                        setupValidationMessage ||
                        (setupDurabilityFeedback
                          ? getMutationFeedbackMessage("setup", setupDurabilityFeedback)
                          : "")
                      }
                      saveMessageTone={
                        !setupValidationMessage &&
                        (setupDurabilityFeedback === null ||
                          setupDurabilityFeedback === "durableSuccess")
                          ? "success"
                          : "failure"
                      }
                      scope="commitmentLibrary"
                      setDraft={(nextDraft) => {
                        setFocusedTemplateField(null);
                        setSetupDurabilityFeedback(null);
                        setSetupValidationMessage("");
                        setSetupDraft(nextDraft);
                      }}
                    />
                  </Suspense>
                </LazySurfaceBoundary>
              </div>
            }
            workPatternContent={
              <div className="df-workflow-block df-workflow-block--setup">
                {returnToReviewAvailable ? (
                  <section className="df-panel">
                    <button
                      className="df-secondary-button"
                      onClick={() => {
                        setReturnToReviewAvailable(false);
                        openScheduleMode();
                      }}
                      type="button"
                    >
                      Return to Review Schedule
                    </button>
                  </section>
                ) : null}
                {workPatternReturnToMonth ? (
                  <section className="df-panel">
                    <button
                      className="df-secondary-button"
                      onClick={() => {
                        setWorkPatternReturnToMonth(false);
                        openMonthMode();
                        requestAnimationFrame(() =>
                          document.getElementById("selected-day-heading")?.focus(),
                        );
                      }}
                      type="button"
                    >
                      Back to Month
                    </button>
                  </section>
                ) : null}
                <LazySurfaceBoundary name="Work Pattern">
                  <Suspense fallback={<LazySurfaceLoading name="Work Pattern" />}>
                    <SetupScreen
                      saveIssues={setupIssues}
                      conversionStore={storeRef.current}
                      compositionStore={activeStore}
                      onDiscardDraft={() => {
                        setSetupDraft(
                          buildSetupDraft(storeRef.current.getState(), createIsoTimestamp()),
                        );
                        setSetupValidationMessage("");
                        setSetupDurabilityFeedback(null);
                      }}
                      draft={setupDraft}
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
                        (setupDurabilityFeedback === null ||
                          setupDurabilityFeedback === "durableSuccess")
                          ? "success"
                          : "failure"
                      }
                      scope="workPattern"
                      setDraft={(nextDraft) => {
                        setSetupDurabilityFeedback(null);
                        setSetupValidationMessage("");
                        setSetupDraft(nextDraft);
                      }}
                    />
                  </Suspense>
                </LazySurfaceBoundary>
              </div>
            }
            scheduleContent={
              <LazySurfaceBoundary name="Review Schedule">
                <Suspense fallback={<LazySurfaceLoading name="Review Schedule" />}>
                  <ScheduleReviewWorkspace
                    context={goalEditingContext}
                    onGoal={(id, range) => {
                      goalInspectionNavigation(goalEditingContext, id).update({ range });
                      setDayGoalId(id);
                      setPlannerMode("goals");
                    }}
                    attentionId={pendingReviewFrictionId}
                    onAttentionHandled={() => setPendingReviewFrictionId(null)}
                    missingSetup={previewGuardrailMissingItems}
                    message={contextualNavigationMessage}
                    onOpenSetup={openWorkPatternMode}
                    onDay={openDay}
                    review={{
                      goalNames: Object.fromEntries(
                        activeStore.listGoals().map((goal) => [goal.id, goal.title]),
                      ),
                      refreshKey: stateSnapshot,
                      startUserDayDate:
                        stateSnapshot.preview?.rangeStartDate ??
                        stateSnapshot.previewRange.startDate,
                      endUserDayDateExclusive: addUserDayLabels(
                        stateSnapshot.preview?.rangeEndDate ?? stateSnapshot.previewRange.endDate,
                        1,
                      ),
                      historyAsOf: now.toISOString(),
                      getPublishedAt: getExportedAt,
                      onAcceptProposal: activeStore.acceptProposalOption,
                      onGeneratePreview: generatePreviewFromSavedState,
                      onOpenFriction: () => undefined,
                      onPublish: activeStore.publishScheduleRange,
                      onRetryRealization: activeStore.realizeAcceptedAllocation,
                      onRejectProposal: activeStore.rejectProposal,
                      query: activeStore.queryPlanningReview,
                      subscribeReview: activeStore.subscribePlanningReview,
                      unresolvedFrictionCount:
                        stateSnapshot.preview?.result.frictionPoints.filter(
                          (point) => !point.ignored,
                        ).length ?? 0,
                      weekStartsOn: stateSnapshot.schedulingPreferences.weekStartsOn,
                    }}
                    preview={{
                      authoredSetup: stateSnapshot,
                      acceptedDecisions: acceptedDecisionViewModels,
                      decisionRemovalProtected: planDecisionIngress.status === "recoveryRequired",
                      getDayBoundaryStartTimeForUserDayDate,
                      getUserDayWindowForUserDayDate,
                      now,
                      onAcceptPlanDecision: acceptPendingPlanDecision,
                      onAddEvent: openNewEventFromReview,
                      onApplySuggestedFix: handlePreviewSuggestedFix,
                      onEditCommitment: openCommitmentFromReview,
                      onEditEvent: openExistingEventFromReview,
                      onEditWork: openWorkFromReview,
                      onRetryPlanDecisionDurability: retryPlanDecisionDurability,
                      onRemoveAcceptedDecision: removeAcceptedDecision,
                      pendingPlanDecisionAcceptance: pendingPlanDecisionAcceptance !== null,
                      planDecisionFeedback,
                      planDecisionRetryAvailable:
                        planDecisionDurability === "storageFailure" ||
                        planDecisionDurability === "unavailable",
                      preview: stateSnapshot.preview,
                      rangeWarnings: stateSnapshot.preview ? savedRangeWarnings : [],
                      visibleRangeStartDate: selectedPreviewDayRange?.startDate ?? null,
                      visibleRangeEndDate: selectedPreviewDayRange?.endDate ?? null,
                    }}
                  />
                </Suspense>
              </LazySurfaceBoundary>
            }
          />
        ) : null}
        {currentScreen === "summary" ? (
          <div className="df-screen df-workflow-block df-workflow-block--summary">
            <LazySurfaceBoundary name="Accepted planning">
              <Suspense fallback={<LazySurfaceLoading name="Accepted planning" />}>
                <AcceptedPlanningSummary
                  query={activeStore.queryAcceptedPlanningEvidence}
                  now={getNow}
                  context={acceptedSummaryContext}
                  onContextChange={setAcceptedSummaryContext}
                  onGoal={(id) => {
                    goalInspectionNavigation(goalEditingContext, id).update({
                      range: {
                        start: acceptedSummaryContext.start,
                        end: acceptedSummaryContext.end,
                      },
                    });
                    setDayGoalId(id);
                    setPlannerMode("goals");
                  }}
                  onDay={(owner) => openDay(owner)}
                  onReview={openScheduleMode}
                />
              </Suspense>
            </LazySurfaceBoundary>
            <LazySurfaceBoundary name="Summary">
              <Suspense fallback={<LazySurfaceLoading name="Summary" />}>
                <HistoricalIntelligenceSummary
                  onInspectGoal={(id, range) => {
                    goalRecordedNavigation(goalEditingContext, id).update({ range });
                    setDayGoalId(id);
                    setPlannerMode("goals");
                  }}
                  context={goalEditingContext}
                  now={getNow}
                  onOpenPlanner={openMonthMode}
                  store={activeStore}
                />
              </Suspense>
            </LazySurfaceBoundary>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function describeAcceptedDecision(durable: boolean, replayStatus: string | undefined): string {
  const save = durable ? "Accepted and saved." : "Accepted for this session; saving failed.";
  switch (replayStatus) {
    case "applied":
      return `${save} The choice is active in the regenerated schedule.`;
    case "blocked":
      return `${save} DayFrame could not apply it in the current schedule.`;
    case "outsideWindow":
      return `${save} The occurrence is outside this preview.`;
    case "inapplicable":
      return `${save} The choice cannot currently apply.`;
    case "staleSourceMissing":
    case "staleLifetime":
    case "staleOccurrenceMissing":
      return `${save} The accepted target is now stale.`;
    default:
      return `${save} Its replay result is unavailable.`;
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
  getUserDayWindowForUserDayDate?: (userDayDate: string) => { start: Date; end: Date },
): CompactPreviewSummary {
  const visibleFrictionCount = preview.result.frictionPoints.filter(
    (frictionPoint) => !frictionPoint.ignored,
  ).length;
  const dayItems = buildPreviewDayItems(
    preview,
    now,
    getDayBoundaryStartTimeForUserDayDate,
    getUserDayWindowForUserDayDate,
  );

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
  getUserDayWindowForUserDayDate?: (userDayDate: string) => { start: Date; end: Date },
): CompactPreviewSummary["dayItems"] {
  const dayItems: CompactPreviewSummary["dayItems"] = [];
  const frictionDates = getCompactPreviewFrictionDates(
    preview,
    getDayBoundaryStartTimeForUserDayDate,
    getUserDayWindowForUserDayDate,
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
  getUserDayWindowForUserDayDate?: (userDayDate: string) => { start: Date; end: Date },
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
      getUserDayWindowForUserDayDate,
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
  getUserDayWindowForUserDayDate?: (userDayDate: string) => { start: Date; end: Date },
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
          getUserDayWindowForUserDayDate?.(userDayDate),
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
          getUserDayWindowForUserDayDate?.(userDayDate),
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
  canonicalWindow?: { start: Date; end: Date },
): boolean {
  const [year, month, day] = userDayDate.split("-").map(Number);
  const [hours, minutes] = dayBoundaryStartTime.split(":").map(Number);
  const userDayStart =
    canonicalWindow?.start ??
    new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, 0, 0);
  const userDayEnd =
    canonicalWindow?.end ??
    new Date(
      userDayStart.getFullYear(),
      userDayStart.getMonth(),
      userDayStart.getDate() + 1,
      userDayStart.getHours(),
      userDayStart.getMinutes(),
      0,
      0,
    );

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
  setPlannerMode: (mode: PlannerMode) => void,
  clearPreviewSelection: () => void,
  setPreviewGuardrailMissingItems: (items: string[]) => void,
  setIsConfirmingClearLocalData: (value: boolean) => void,
  resetGoalEditing: () => void,
): Promise<void> {
  const input = event.target as unknown as FileInputLike;
  const file = input.files?.[0];

  input.value = "";

  if (!file) {
    return;
  }

  try {
    const backupText = await file.text();
    let parsedBackup: unknown;
    try {
      parsedBackup = JSON.parse(backupText);
    } catch {
      throw new Error("Backup file is not valid JSON.");
    }
    const backup =
      parsedBackup &&
      typeof parsedBackup === "object" &&
      "version" in parsedBackup &&
      (parsedBackup.version === 13 || parsedBackup.version === 14)
        ? parsedBackup
        : parseDayFrameBackupJson(backupText);

    const result = await store.importBackupFile(backup);

    if (
      result.status === "restoredV14" ||
      result.status === "restoredV13" ||
      result.status === "restoredV3" ||
      result.status === "restoredV4" ||
      result.status === "restoredV5" ||
      result.status === "restoredV6"
    ) {
      // Only a confirmed authority replacement discards ephemeral Goal drafts.
      resetGoalEditing();
      setBackupMessage(
        store.getGoalStructureQualification().status === "protected"
          ? "Complete backup restored. Structure records and history were preserved, but their recorded times cannot safely support planning. Planning and Structure changes are blocked. You can still export a complete backup; no dates were repaired."
          : result.status === "restoredV14" ||
              result.status === "restoredV13" ||
              result.status === "restoredV4" ||
              result.status === "restoredV5" ||
              result.status === "restoredV6"
            ? "Complete backup restored across setup, history, goals, measurement definitions, and observations."
            : "Complete Backup V3 restored across setup and history.",
      );
      setBackupDurabilityFeedback(null);
      setBackupErrorMessage("");
      setSetupDurabilityFeedback(null);
      setClearDurabilityFeedback(null);
      setProfileMessage("");
      setProfileDurabilityFeedback(null);
      setProfileErrorMessage("");
      setPlannerMode("month");
      clearPreviewSelection();
      setPreviewGuardrailMissingItems([]);
      setIsConfirmingClearLocalData(false);
      return;
    }

    if (result.status === "recoveryRequired") resetGoalEditing();
    if (
      result.status !== "rejected" &&
      result.status !== "instantiatedFromLegacy" &&
      result.status !== "restored"
    ) {
      setBackupMessage("");
      setBackupDurabilityFeedback(null);
      setClearDurabilityFeedback(null);
      setBackupErrorMessage(
        result.status === "restoreBusy"
          ? "Publication or another authority operation is still finishing. Backup restore was not started. Wait for settlement, then explicitly try again."
          : result.status === "protectedCurrentState"
            ? "Backup restore is blocked until protected local authority is explicitly resolved."
            : result.status === "recoveryRequired"
              ? "Backup restore requires recovery before DayFrame can continue safely."
              : "Complete backup restore did not finish. Existing authority was not reported as restored.",
      );
      return;
    }

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
    setBackupMessage(
      result.status === "restored"
        ? "Backup V2 restored with its original source lifetimes."
        : "Legacy Backup V1 imported with fresh source lifetimes.",
    );
    setBackupErrorMessage("");
    setSetupDurabilityFeedback(null);
    setClearDurabilityFeedback(null);
    setProfileMessage("");
    setProfileDurabilityFeedback(null);
    setProfileErrorMessage("");
    setPlannerMode("month");
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
      case "pending":
        return "DayFrame is still establishing durable replacement. The current session remains available.";
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
    feedback.planDecisions === "durableSuccess"
      ? null
      : `accepted plan choices (${getRemovalFailureLabel(feedback.planDecisions)})`,
    feedback.executionHistory === "durableSuccess"
      ? null
      : `execution history (${getRemovalFailureLabel(feedback.executionHistory)})`,
    feedback.historicalPlan === "durableSuccess"
      ? null
      : `published plan history (${getRemovalFailureLabel(feedback.historicalPlan)})`,
    feedback.goals === "durableSuccess"
      ? null
      : `Goals (${getRemovalFailureLabel(feedback.goals)})`,
    feedback.measurementDefinitions === "durableSuccess"
      ? null
      : `measurement definitions (${getRemovalFailureLabel(feedback.measurementDefinitions)})`,
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

function downloadDayFrameBackup(
  backup: DayFrameBackup | { exportedAt: string; version: number },
): void {
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
  anchor.download = `dayframe-backup-v${backup.version}-${backup.exportedAt.slice(0, 10)}.json`;
  anchor.click();

  globalThis.URL.revokeObjectURL(downloadUrl);
}

function downloadRecoveryData(content: string, filename: string, formatJson: boolean): void {
  const recoveryBlob = new Blob([formatJson ? JSON.stringify(content, null, 2) : content], {
    type: "application/json",
  });
  const downloadUrl = globalThis.URL.createObjectURL(recoveryBlob);
  const documentLike = globalThis as {
    document?: {
      createElement: (tagName: string) => DownloadAnchorLike;
    };
  };
  const anchor = documentLike.document?.createElement("a");
  if (!anchor) throw new RangeError("Recovery download is not available in this environment.");
  anchor.href = downloadUrl;
  anchor.download = filename;
  anchor.click();
  globalThis.URL.revokeObjectURL(downloadUrl);
}

function isBlockedProfileMutation(
  result: ProfileMutationResult,
): result is Extract<ProfileMutationResult, { status: "blocked" }> {
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
  getUserDayWindowForUserDayDate?: (userDayDate: string) => { start: Date; end: Date },
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
      getUserDayWindowForUserDayDate?.(userDayDate),
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
  canonicalWindow?: { start: Date; end: Date },
): boolean {
  const userDayStart =
    canonicalWindow?.start ??
    createUserDayBoundaryDate({
      userDayDate,
      shiftCycles: [],
      schedulingPreferences: {
        dayBoundaryStartTime: dayBoundaryStartTime as `${number}:${number}`,
        weekStartsOn: "saturday",
      },
    });
  const userDayEnd =
    canonicalWindow?.end ??
    new Date(
      userDayStart.getFullYear(),
      userDayStart.getMonth(),
      userDayStart.getDate() + 1,
      userDayStart.getHours(),
      userDayStart.getMinutes(),
      0,
      0,
    );

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
