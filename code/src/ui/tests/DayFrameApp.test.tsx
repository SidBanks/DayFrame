/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ComponentProps, ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createDayFrameBackup } from "../../state/dayFrameBackup.js";
import {
  DAYFRAME_ACTIVE_V2_STORAGE_KEY,
  DAYFRAME_PROFILES_STORAGE_KEY,
  DAYFRAME_PROFILES_V2_STORAGE_KEY,
  DAYFRAME_STORAGE_KEY,
} from "../../state/dayFrameStore.js";
import { projectActiveToPattern } from "../../state/activeV2.js";
import type {
  ActiveLocalReplacementRecoveryResult,
  PersistenceWriteOutcome,
  StoreDurabilityStatus,
} from "../../state/types.js";
import { DayFrameApp as ProductionDayFrameApp } from "../DayFrameApp.js";
import {
  createControllableReadinessStore,
  createReadyDayFrameTestStore,
} from "../../state/tests/dayFrameStoreTestUtils.js";

function DayFrameApp(props: ComponentProps<typeof ProductionDayFrameApp>) {
  return <ProductionDayFrameApp {...props} store={props.store ?? createReadyDayFrameTestStore()} />;
}

function createExampleScheduleStore() {
  return createReadyDayFrameTestStore({
    shiftDefinitions: [
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
    ],
    shiftCycles: [
      {
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
      },
    ],
    blockTemplates: [
      {
        id: "default_sleep",
        userId: "user_001",
        title: "Sleep",
        category: "sleep",
        requiresWorkAnchor: false,
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
        requiresWorkAnchor: false,
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
    ],
    blockRecurrences: [
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
    ],
  });
}

function ExampleScheduleApp(props: ComponentProps<typeof DayFrameApp>): ReactElement {
  return <DayFrameApp {...props} store={createExampleScheduleStore()} />;
}

let createObjectUrlMock: ReturnType<typeof vi.fn>;
let revokeObjectUrlMock: ReturnType<typeof vi.fn>;
let anchorClickMock: ReturnType<typeof vi.fn>;
let originalAnchorClick: (() => void) | undefined;

beforeEach(() => {
  createObjectUrlMock = vi.fn(() => "blob:dayframe-backup");
  revokeObjectUrlMock = vi.fn();
  anchorClickMock = vi.fn();

  const urlLike = globalThis.URL as unknown as {
    createObjectURL: (blob: Blob) => string;
    revokeObjectURL: (id: string) => void;
  };
  const htmlAnchorElementLike = globalThis as unknown as {
    HTMLAnchorElement?: {
      prototype: {
        click: () => void;
      };
    };
  };

  urlLike.createObjectURL = createObjectUrlMock as unknown as (blob: Blob) => string;
  urlLike.revokeObjectURL = revokeObjectUrlMock as unknown as (id: string) => void;

  if (htmlAnchorElementLike.HTMLAnchorElement) {
    originalAnchorClick = htmlAnchorElementLike.HTMLAnchorElement.prototype.click;
    htmlAnchorElementLike.HTMLAnchorElement.prototype.click = () => {
      const recordAnchorClick = anchorClickMock as unknown as () => void;

      recordAnchorClick();
    };
  }
});

afterEach(() => {
  cleanup();

  const htmlAnchorElementLike = globalThis as unknown as {
    HTMLAnchorElement?: {
      prototype: {
        click: () => void;
      };
    };
  };

  if (htmlAnchorElementLike.HTMLAnchorElement && originalAnchorClick) {
    htmlAnchorElementLike.HTMLAnchorElement.prototype.click = originalAnchorClick;
  }

  if ("localStorage" in globalThis && globalThis.localStorage) {
    globalThis.localStorage.clear();
  }
});

describe("DayFrameApp", () => {
  const retiredGuardrailMessage =
    "Add at least one shift definition, an active shift cycle, at least one block template, and at least one block recurrence before generating a preview.";

  it("renders only the loading shell until authority becomes ready", async () => {
    const controlled = createControllableReadinessStore(createReadyDayFrameTestStore());
    render(<DayFrameApp store={controlled.store} />);
    expect(screen.getByText("Loading DayFrame…")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Plan" })).not.toBeInTheDocument();
    controlled.transition({ status: "ready" });
    expect(await screen.findByRole("button", { name: "Plan" })).toBeInTheDocument();
  });

  it("renders only the protected shell when authority needs recovery", () => {
    const controlled = createControllableReadinessStore(createReadyDayFrameTestStore(), {
      status: "protected",
      reason: "authorityRecoveryRequired",
    });
    render(<DayFrameApp store={controlled.store} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "DayFrame needs recovery before saved data can be used.",
    );
    expect(screen.queryByRole("button", { name: "Plan" })).not.toBeInTheDocument();
  });

  it("renders the shell and opens on setup", () => {
    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);

    expect(screen.getByRole("button", { name: "Plan" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("heading", { name: "DayFrame" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate Schedule" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Setup" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Current Setup as Profile" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Saved Setup Profiles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export Complete Backup" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import Setup Backup" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear Local Data" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Set up your shifts, connect them to a cycle, add repeatable life blocks, then generate a schedule.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Work Hours" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Planning Range: Expand" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Work Schedule: Expand" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(
      screen.getByText("No shifts yet. Add your first shift definition to get started."),
    ).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Day Shift")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("Day Rotation")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("Sleep")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("Errands")).not.toBeInTheDocument();
  });

  it("shows persistent recovery awareness and explicit controls for a protected checkpoint", () => {
    const rawCheckpoint = "{ invalid active checkpoint";
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, rawCheckpoint);

    render(<DayFrameApp />);

    const warning = screen.getByRole("region", { name: "Saved setup needs recovery" });
    expect(warning).toHaveTextContent("safe temporary setup");
    expect(warning).toHaveTextContent("prior saved checkpoint is being preserved");
    expect(warning).toHaveTextContent("ordinary active saving is temporarily blocked");
    expect(warning).toHaveTextContent("may be lost if you reload or close DayFrame");
    expect(warning).toHaveTextContent("replace the protected saved setup with the current session");
    expect(warning).toHaveTextContent("readable and preserved pending recovery");
    expect(
      screen.getByRole("button", {
        name: "Replace protected saved setup with current session",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Abandon protected saved setup and reset" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /repair|migrate|export recovery/i })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(
      screen.getByText("Setup applied for this session; no durability attempt was made."),
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Saved setup needs recovery" })).toBeInTheDocument();
    expect(globalThis.localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(rawCheckpoint);
  });

  it("does not show active-ingress awareness for healthy startup", () => {
    render(<DayFrameApp />);

    expect(screen.queryByRole("region", { name: "Saved setup needs recovery" })).toBeNull();
    expect(screen.queryByRole("button", { name: /protected saved setup/i })).toBeNull();
  });

  it("requires replacement confirmation, supports cancel, and invokes replacement once", () => {
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
    const store = createReadyDayFrameTestStore();
    const replace = vi.spyOn(store, "replaceProtectedActiveCheckpointWithCurrentState");
    const commit = vi.spyOn(store, "commitAuthoredSetupTransaction");
    const mutateManualEvent = vi.spyOn(store, "mutateManualEvent");
    render(<DayFrameApp store={store} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Replace protected saved setup with current session" }),
    );
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByText(/current committed session/)).toHaveTextContent(
      "Unsaved editor drafts are not included",
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel replacement" }));
    expect(replace).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Replace protected saved setup with current session" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm replace protected saved setup" }));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(commit).not.toHaveBeenCalled();
    expect(mutateManualEvent).not.toHaveBeenCalled();
    expect(screen.queryByRole("region", { name: "Saved setup needs recovery" })).toBeNull();
  });

  it("uses mutually exclusive confirmations", () => {
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
    render(<DayFrameApp />);

    fireEvent.click(
      screen.getByRole("button", { name: "Replace protected saved setup with current session" }),
    );
    expect(
      screen.getByRole("button", { name: "Confirm replace protected saved setup" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Abandon protected saved setup and reset" }),
    );
    expect(
      screen.queryByRole("button", { name: "Confirm replace protected saved setup" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: "Confirm abandon protected saved setup" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Replace protected saved setup with current session" }),
    );
    expect(
      screen.queryByRole("button", { name: "Confirm abandon protected saved setup" }),
    ).toBeNull();
  });

  it("confirms active-only abandonment and reflects the store-owned reset", () => {
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
    const store = createReadyDayFrameTestStore();
    store.saveProfile({ name: "Kept Profile", savedAt: "2026-05-05T10:00:00-05:00" });
    const abandon = vi.spyOn(store, "abandonProtectedActiveCheckpointAndReset");
    render(<DayFrameApp store={store} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Abandon protected saved setup and reset" }),
    );
    expect(abandon).not.toHaveBeenCalled();
    expect(screen.getByText(/Confirm permanent abandonment/)).toHaveTextContent(
      "Saved profiles remain",
    );
    expect(screen.getByText(/Confirm permanent abandonment/)).toHaveTextContent(
      "separate from Clear Local Data",
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm abandon protected saved setup" }));

    expect(abandon).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("region", { name: "Saved setup needs recovery" })).toBeNull();
    expect(screen.getByText("Kept Profile")).toBeInTheDocument();
    expect(
      screen.getByText("No shifts yet. Add your first shift definition to get started."),
    ).toBeInTheDocument();
  });

  it.each([
    [
      "serializationFailure",
      {
        status: "notResolved",
        resolution: "replaceWithCurrentState",
        persistence: { status: "serializationFailure" },
      } as const,
      /could not prepare the current session for durable replacement/i,
    ],
    [
      "storageFailure",
      {
        status: "notResolved",
        resolution: "replaceWithCurrentState",
        persistence: { status: "storageFailure" },
      } as const,
      /could not complete the replacement/i,
    ],
    [
      "invalidReplacement",
      {
        status: "notAttempted",
        reason: "invalidReplacement",
        validation: { status: "invalid", issues: [], advisories: [] },
      } as const,
      /current session cannot be used as the replacement yet/i,
    ],
    [
      "sourceChanged",
      { status: "notAttempted", reason: "sourceChanged" } as const,
      /saved setup changed since DayFrame detected/i,
    ],
    [
      "sourceUnreadable",
      { status: "notAttempted", reason: "sourceUnreadable" } as const,
      /cannot currently read the protected saved setup/i,
    ],
  ])(
    "presents replacement %s truthfully and requires fresh confirmation",
    (_label, result, copy) => {
      globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
      const baseStore = createReadyDayFrameTestStore();
      const replace = vi.fn(() => result as ActiveLocalReplacementRecoveryResult);
      render(
        <DayFrameApp
          store={{ ...baseStore, replaceProtectedActiveCheckpointWithCurrentState: replace }}
        />,
      );

      fireEvent.click(
        screen.getByRole("button", { name: "Replace protected saved setup with current session" }),
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Confirm replace protected saved setup" }),
      );

      expect(replace).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("status")).toHaveTextContent(copy);
      expect(
        screen.getByRole("region", { name: "Saved setup needs recovery" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Confirm replace protected saved setup" }),
      ).toBeNull();
      fireEvent.click(
        screen.getByRole("button", { name: "Replace protected saved setup with current session" }),
      );
      expect(replace).toHaveBeenCalledTimes(1);
    },
  );

  it("presents failed abandonment without resetting the current UI", () => {
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
    const baseStore = createReadyDayFrameTestStore({
      shiftDefinitions: createExampleScheduleStore().getState().shiftDefinitions,
    });
    const abandon = vi.fn(
      () =>
        ({
          status: "notResolved",
          resolution: "abandonAndReset",
          persistence: { status: "storageFailure" },
        }) as const,
    );
    render(
      <DayFrameApp store={{ ...baseStore, abandonProtectedActiveCheckpointAndReset: abandon }} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Abandon protected saved setup and reset" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm abandon protected saved setup" }));

    expect(abandon).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent("current session was not reset");
    expect(screen.getAllByDisplayValue("Day Shift").length).toBeGreaterThan(0);
  });

  it("suppresses active durability Retry during recovery while preserving profile Retry", () => {
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
    const baseStore = createReadyDayFrameTestStore();
    render(
      <DayFrameApp
        store={{
          ...baseStore,
          getDurabilityStatus: () => ({
            activeState: "storageFailure",
            profiles: "storageFailure",
          }),
        }}
      />,
    );

    expect(screen.queryByRole("button", { name: "Retry active setup durability" })).toBeNull();
    expect(screen.getByRole("button", { name: "Retry saved profiles durability" })).toBeEnabled();
  });

  it("communicates unreadable startup uncertainty without hiding explicit controls", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new RangeError("Injected startup read failure");
    });
    const store = createReadyDayFrameTestStore();
    getItem.mockRestore();

    render(<DayFrameApp store={store} />);

    const warning = screen.getByRole("region", { name: "Saved setup needs recovery" });
    expect(warning).toHaveTextContent("could not read and capture the original saved setup");
    expect(warning).toHaveTextContent("may be refused until the protected source can be read");
    expect(
      screen.getByRole("button", { name: "Replace protected saved setup with current session" }),
    ).toBeEnabled();
  });

  it("treats a stale not-recovery-required confirmation as benign", () => {
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
    const baseStore = createReadyDayFrameTestStore();
    const replace = vi.fn(
      (): ActiveLocalReplacementRecoveryResult => ({
        status: "notAttempted",
        reason: "notRecoveryRequired",
      }),
    );
    render(
      <DayFrameApp
        store={{ ...baseStore, replaceProtectedActiveCheckpointWithCurrentState: replace }}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Replace protected saved setup with current session" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm replace protected saved setup" }));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("status")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Confirm replace protected saved setup" }),
    ).toBeNull();
  });

  it("refreshes active-ingress awareness when the injected store is replaced", () => {
    const healthyStore = createReadyDayFrameTestStore();
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, "{");
    const protectedStore = createReadyDayFrameTestStore();
    const { rerender } = render(<DayFrameApp store={healthyStore} />);

    expect(screen.queryByRole("region", { name: "Saved setup needs recovery" })).toBeNull();

    rerender(<DayFrameApp store={protectedStore} />);
    expect(screen.getByRole("region", { name: "Saved setup needs recovery" })).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Replace protected saved setup with current session" }),
    );
    expect(screen.getByRole("button", { name: "Cancel replacement" })).toBeInTheDocument();

    rerender(<DayFrameApp store={healthyStore} />);
    expect(screen.queryByRole("region", { name: "Saved setup needs recovery" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Cancel replacement" })).toBeNull();
  });

  it("does not persist or notify through authored mutations during neutral default startup", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    setItem.mockClear();

    render(<DayFrameApp />);

    expect(setItem).not.toHaveBeenCalled();
    expect(globalThis.localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBeNull();
    expect(
      screen.getByText("No shifts yet. Add your first shift definition to get started."),
    ).toBeInTheDocument();
  });

  it("preserves all seven persisted authored fields without rewriting seed-looking data", () => {
    const persistedState = {
      schedulingPreferences: {
        dayBoundaryStartTime: "04:30",
        weekStartsOn: "monday",
      },
      previewRange: {
        source: "custom",
        preset: "custom",
        startDate: "2026-06-01",
        endDate: "2026-06-03",
      },
      shiftDefinitions: [
        {
          id: "shift_day",
          userId: "user_persisted",
          name: "Persisted Custom Shift",
          startTime: "08:00",
          endTime: "16:00",
          workDays: ["monday"],
          crossesMidnight: false,
          createdAt: "2026-06-01T00:00:00-05:00",
          updatedAt: "2026-06-02T00:00:00-05:00",
        },
      ],
      shiftCycles: [
        {
          id: "cycle_001",
          userId: "user_persisted",
          name: "Persisted Custom Cycle",
          type: "fixedSegments",
          startsOnDate: "2026-06-01",
          endsOnDate: "2026-06-30",
          segments: [
            {
              id: "segment_custom",
              shiftCycleId: "cycle_001",
              shiftDefinitionId: "shift_day",
              startsOnDate: "2026-06-01",
              endsOnDate: "2026-06-30",
            },
          ],
          createdAt: "2026-06-01T00:00:00-05:00",
          updatedAt: "2026-06-02T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_persisted",
          title: "Persisted Custom Sleep",
          category: "sleep",
          requiresWorkAnchor: true,
          placementType: "flexible",
          durationMinutes: 420,
          priority: 2,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "manualOnly",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-06-01T00:00:00-05:00",
          updatedAt: "2026-06-02T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
      manualEvents: [
        {
          id: "manual_persisted",
          title: "Persisted Appointment",
          userDayDate: "2026-06-02",
          allDay: true,
          createdAt: "2026-06-01T00:00:00-05:00",
          updatedAt: "2026-06-02T00:00:00-05:00",
        },
      ],
    } as const;
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, JSON.stringify(persistedState));
    const storedBeforeMount = globalThis.localStorage.getItem(DAYFRAME_STORAGE_KEY);
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    setItem.mockClear();

    render(<DayFrameApp />);

    expect(setItem).toHaveBeenCalledWith(DAYFRAME_ACTIVE_V2_STORAGE_KEY, expect.any(String));
    expect(globalThis.localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(storedBeforeMount);
    expect(screen.getByLabelText("Day Boundary Start Time")).toHaveValue("04:30");
    expect(screen.getByLabelText("Week Starts On")).toHaveValue("monday");
    expect(screen.getByLabelText("Name")).toHaveValue("Persisted Custom Shift");
    fireEvent.click(screen.getByRole("button", { name: "Planning Range: Expand" }));
    const expandCycles = screen.queryByRole("button", { name: "Work Schedule: Expand" });
    if (expandCycles) fireEvent.click(expandCycles);
    fireEvent.click(screen.getByRole("button", { name: "Advanced Commitment Fields: Expand" }));
    expect(screen.getByLabelText("Start Date")).toHaveValue("2026-06-01");
    expect(screen.getByDisplayValue("Persisted Custom Cycle")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Persisted Custom Sleep")).toBeInTheDocument();

    const rehydratedState = createReadyDayFrameTestStore().getState();
    const rehydratedPattern = projectActiveToPattern(rehydratedState);
    expect(rehydratedPattern.manualEvents).toEqual(persistedState.manualEvents);
    expect(rehydratedPattern.shiftDefinitions).toEqual(persistedState.shiftDefinitions);
    expect(rehydratedPattern.blockRecurrences).toEqual(persistedState.blockRecurrences);
  });

  it("preserves intentionally empty persisted authored collections without rewriting them", () => {
    const emptyPersistedState = {
      schedulingPreferences: {
        dayBoundaryStartTime: "03:00",
        weekStartsOn: "saturday",
      },
      previewRange: {
        preset: "threeDays",
        startDate: "2026-05-04",
        endDate: "2026-05-06",
      },
      shiftDefinitions: [],
      shiftCycles: [],
      blockTemplates: [],
      blockRecurrences: [],
      manualEvents: [],
    };
    const serializedState = JSON.stringify(emptyPersistedState);
    globalThis.localStorage.setItem(DAYFRAME_STORAGE_KEY, serializedState);
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    setItem.mockClear();

    render(<DayFrameApp />);

    expect(setItem).toHaveBeenCalledWith(DAYFRAME_ACTIVE_V2_STORAGE_KEY, expect.any(String));
    expect(globalThis.localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBe(serializedState);
    expect(
      screen.getByText("No shifts yet. Add your first shift definition to get started."),
    ).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Day Shift")).not.toBeInTheDocument();
  });

  it("keeps cleared state neutral after default app reconstruction", () => {
    globalThis.localStorage.setItem(
      DAYFRAME_STORAGE_KEY,
      JSON.stringify({
        ...createExampleScheduleStore().getState(),
        savedProfiles: undefined,
        preview: undefined,
      }),
    );
    const firstRender = render(<DayFrameApp />);

    expect(screen.getByLabelText("Name")).toHaveValue("Day Shift");
    fireEvent.click(screen.getByRole("button", { name: "Clear Local Data" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Clear Local Data" }));
    expect(globalThis.localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBeNull();
    firstRender.unmount();

    render(<DayFrameApp />);

    expect(globalThis.localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBeNull();
    expect(
      screen.getByText("No shifts yet. Add your first shift definition to get started."),
    ).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Day Shift")).not.toBeInTheDocument();
  });

  it("rehydrates saved profiles separately without seeding neutral active state", () => {
    globalThis.localStorage.setItem(
      DAYFRAME_PROFILES_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        version: 1,
        profiles: [
          {
            id: "profile_explicit",
            name: "Explicit Profile",
            savedAt: "2026-06-01T10:00:00-05:00",
            data: {
              ...createExampleScheduleStore().getState(),
              savedProfiles: undefined,
              preview: undefined,
            },
          },
        ],
      }),
    );

    render(<DayFrameApp />);

    expect(screen.getByText("Explicit Profile")).toBeInTheDocument();
    expect(
      screen.getByText("No shifts yet. Add your first shift definition to get started."),
    ).toBeInTheDocument();
    expect(globalThis.localStorage.getItem(DAYFRAME_STORAGE_KEY)).toBeNull();
  });

  it("shows protected-profile recovery, exports exact bytes, and confirms destructive actions", async () => {
    const raw = "{ protected profile bytes";
    globalThis.localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, raw);

    render(<DayFrameApp />);

    expect(
      screen.getByRole("heading", { name: "Saved profiles need recovery" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Export preserved profile data" }));
    const recoveryBlob = createObjectUrlMock.mock.calls.at(-1)?.[0] as Blob;
    expect(await recoveryBlob.text()).toBe(raw);
    expect(globalThis.localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)).toBe(raw);

    fireEvent.click(screen.getByRole("button", { name: "Abandon protected profiles" }));
    expect(
      screen.getByRole("button", {
        name: "Confirm abandon protected profiles",
      }),
    ).toBeInTheDocument();
  });

  it("reports sourceChanged instead of overwriting externally changed protected profiles", () => {
    globalThis.localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, "{");
    render(<DayFrameApp />);
    globalThis.localStorage.setItem(DAYFRAME_PROFILES_V2_STORAGE_KEY, "externally changed");

    fireEvent.click(screen.getByRole("button", { name: "Replace with current profiles" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm replace protected profiles" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Saved profile data changed outside DayFrame",
    );
    expect(globalThis.localStorage.getItem(DAYFRAME_PROFILES_V2_STORAGE_KEY)).toBe(
      "externally changed",
    );
  });

  it("shows quarantine count and explicitly removes preserved invalid profile data", () => {
    globalThis.localStorage.setItem(
      DAYFRAME_PROFILES_V2_STORAGE_KEY,
      JSON.stringify({
        app: "DayFrame",
        surface: "profiles",
        version: 2,
        profiles: [],
        quarantinedProfiles: [{ id: "invalid_profile", name: "Invalid Profile", data: null }],
      }),
    );

    render(<DayFrameApp />);

    expect(
      screen.getByRole("heading", { name: "Some saved profiles need attention" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/1 saved profile entry was preserved/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export quarantined entry" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove quarantined entry" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm remove quarantined entry" }));

    expect(
      screen.queryByRole("heading", { name: "Some saved profiles need attention" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Quarantined profile entry permanently removed",
    );
  });

  it("commits one complete authored setup transition when Setup is saved", () => {
    const store = createReadyDayFrameTestStore();
    const commitAuthoredSetupTransaction = vi.spyOn(store, "commitAuthoredSetupTransaction");

    render(<DayFrameApp store={store} />);

    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(commitAuthoredSetupTransaction).toHaveBeenCalledTimes(1);
    expect(commitAuthoredSetupTransaction).toHaveBeenCalledWith({
      authoredSetup: {
        schedulingPreferences: {
          dayBoundaryStartTime: "03:00",
          weekStartsOn: "saturday",
        },
        previewRange: {
          preset: "threeDays",
          startDate: "2026-05-04",
          endDate: "2026-05-06",
        },
        shiftDefinitions: [],
        shiftCycles: [
          expect.objectContaining({
            id: "cycle_001",
            mode: "manualSegments",
            name: "Cycle 1",
          }),
        ],
        blockTemplates: [],
        blockRecurrences: [],
      },
      lifecycle: {
        operations: expect.arrayContaining([
          expect.objectContaining({
            operation: "create",
            sourceKind: "shiftCycle",
            sourceId: "cycle_001",
          }),
        ]),
      },
    });
    expect(screen.getByText("Setup saved.")).toBeInTheDocument();
  });

  it("shows unified setup content and still lets the user open preview", () => {
    render(<ExampleScheduleApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);

    expect(screen.getByRole("heading", { name: "Schedule Preferences" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Work Hours" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Planning Range: Expand" }));
    fireEvent.click(screen.getByRole("button", { name: "Work Schedule: Expand" }));
    fireEvent.click(screen.getByRole("button", { name: "Advanced Commitment Fields: Expand" }));
    expect(screen.getByRole("heading", { name: "Planning Range" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Work Schedule" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Advanced Commitment Fields" })).toBeInTheDocument();
    expect(screen.getByLabelText("Range Preset")).toHaveValue("threeDays");
    expect(screen.getByLabelText("Start Date")).toHaveValue("2026-05-04");
    expect(screen.getByLabelText("End Date")).toHaveValue("2026-05-06");
    expect(screen.getByDisplayValue("Day Rotation")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sleep")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Include in Schedule")[0]).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Refresh Schedule" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Schedule details" })).toBeInTheDocument();
    expect(screen.getAllByText("Needs attention")[0]!).toBeInTheDocument();
  });

  it("keeps unified setup draft edits when switching to preview and back", () => {
    render(<ExampleScheduleApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Sunrise Shift" },
    });
    expect(screen.getByLabelText("Name")).toHaveValue("Sunrise Shift");

    fireEvent.change(screen.getByLabelText("Cycle Name"), {
      target: { value: "Weekend Rotation" },
    });
    expect(screen.getByDisplayValue("Weekend Rotation")).toBeInTheDocument();

    fireEvent.change(screen.getAllByLabelText("Title")[0]!, {
      target: { value: "Sleep Baseline" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: "Plan" }));

    expect(screen.getByDisplayValue("Sleep Baseline")).toBeInTheDocument();
  });

  it("updates global schedule preferences after saving setup", () => {
    const store = createReadyDayFrameTestStore();

    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} store={store} />);

    fireEvent.change(screen.getByLabelText("Day Boundary Start Time"), {
      target: { value: "05:00" },
    });
    fireEvent.change(screen.getByLabelText("Week Starts On"), {
      target: { value: "monday" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(store.getState().schedulingPreferences).toEqual({
      dayBoundaryStartTime: "05:00",
      weekStartsOn: "monday",
    });
  });

  it("updates preview range after saving setup", () => {
    const store = createReadyDayFrameTestStore();

    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} store={store} />);

    fireEvent.change(screen.getByLabelText("Range Preset"), {
      target: { value: "oneWeek" },
    });
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2026-05-05" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(store.getState().previewRange).toEqual({
      preset: "oneWeek",
      source: "preset",
      startDate: "2026-05-05",
      endDate: "2026-05-11",
    });
  });

  it("saves unified authored edits through the single setup action", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 480,
          priority: 1,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
      ],
    });

    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} store={store} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Sunrise Shift" },
    });
    fireEvent.change(screen.getByLabelText("Cycle Name"), {
      target: { value: "Weekend Rotation" },
    });
    fireEvent.change(screen.getAllByLabelText("Title")[0]!, {
      target: { value: "Sleep Baseline" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(screen.getByText("Setup saved.")).toBeInTheDocument();
    expect(store.getState().shiftDefinitions[0]).toMatchObject({
      name: "Sunrise Shift",
    });
    expect(store.getState().shiftCycles[0]).toMatchObject({
      name: "Weekend Rotation",
    });
    expect(store.getState().previewRange).toMatchObject({
      preset: "threeDays",
      startDate: "2026-05-04",
      endDate: "2026-05-06",
    });
    expect(store.getState().blockTemplates[0]).toMatchObject({
      title: "Sleep Baseline",
    });
  });

  it("switches a cycle to repeating sequence, edits sequence days, and saves it", () => {
    const store = createExampleScheduleStore();

    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} store={store} />);

    fireEvent.click(screen.getByRole("button", { name: "Work Schedule: Expand" }));
    expect(screen.getByLabelText("Cycle Type")).toHaveValue("manualSegments");

    fireEvent.change(screen.getByLabelText("Cycle Type"), {
      target: { value: "repeatingSequence" },
    });

    expect(screen.getByLabelText("Sequence Anchor Date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Sequence Day" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add Sequence Day" }));
    fireEvent.change(screen.getByLabelText("Sequence Day 1 Shift"), {
      target: { value: "off" },
    });
    const secondSequenceSelect = screen.getByLabelText("Sequence Day 2 Shift") as HTMLSelectElement;
    const shiftValue = secondSequenceSelect.options[1]?.value ?? "";

    fireEvent.change(secondSequenceSelect, {
      target: { value: shiftValue },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(store.getState().shiftCycles[0]).toMatchObject({
      mode: "repeatingSequence",
      sequenceAnchorDate: "2026-05-01",
      sequence: [
        { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: null },
        { id: "sequence_day_2", dayOffset: 1, shiftDefinitionId: shiftValue },
      ],
    });
  });

  it("allocates collision-free readable IDs across Setup source scopes", () => {
    const baseState = createExampleScheduleStore().getState();
    const baseShift = baseState.shiftDefinitions[0]!;
    const baseCycle = baseState.shiftCycles[0]!;
    const baseTemplate = baseState.blockTemplates[1]!;

    const store = createReadyDayFrameTestStore({
      ...baseState,
      shiftDefinitions: [
        { ...baseShift, id: "shift_1", name: "Shift 1" },
        { ...baseShift, id: "shift_2", name: "Shift 2" },
        { ...baseShift, id: "shift_3", name: "Shift 3" },
      ],
      shiftCycles: [
        {
          ...baseCycle,
          id: "cycle_001",
          segments: [
            {
              ...baseCycle.segments[0]!,
              id: "segment_1",
              shiftCycleId: "cycle_001",
              shiftDefinitionId: "shift_1",
            },
          ],
          sequence: [{ id: "segment_2", dayOffset: 0, shiftDefinitionId: null }],
        },
        {
          ...baseCycle,
          id: "cycle_003",
          startsOnDate: "2026-06-01",
          endsOnDate: "2026-06-30",
          segments: [],
          sequence: [],
        },
      ],
      blockTemplates: [
        { ...baseTemplate, id: "template_1", title: "Template 1" },
        { ...baseTemplate, id: "template_3", title: "Template 3" },
      ],
      blockRecurrences: [
        { id: "rec_template_1", blockTemplateId: "template_1", frequency: "daily" },
        { id: "rec_template_4", blockTemplateId: "template_3", frequency: "weekly" },
      ],
    });

    render(<DayFrameApp store={store} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Delete Shift Definition" })[1]!);
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete Shift Definition" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Shift Definition" }));
    fireEvent.click(screen.getByRole("button", { name: "Work Schedule: Expand" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Shift Cycle" }));
    fireEvent.change(screen.getAllByLabelText("Cycle Start Date")[2]!, {
      target: { value: "2026-07-01" },
    });
    fireEvent.change(screen.getAllByLabelText("Cycle End Date")[2]!, {
      target: { value: "2026-07-31" },
    });
    fireEvent.change(screen.getAllByLabelText("Segment Start Date")[1]!, {
      target: { value: "2026-07-01" },
    });
    fireEvent.change(screen.getAllByLabelText("Segment End Date")[1]!, {
      target: { value: "2026-07-01" },
    });
    fireEvent.change(screen.getAllByLabelText("Segment End Date")[0]!, {
      target: { value: "2026-05-01" },
    });
    fireEvent.click(screen.getAllByRole("button", { name: "Add Cycle Segment" })[0]!);
    fireEvent.click(screen.getByRole("button", { name: "Add Commitment" }));
    fireEvent.change(document.getElementById("commitment-title")!, {
      target: { value: "Template 4" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add to Plan" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    const state = store.getState();
    expect(state.shiftDefinitions.map((shiftDefinition) => shiftDefinition.id)).toEqual([
      "shift_1",
      "shift_3",
      "shift_4",
    ]);
    expect(state.shiftCycles.map((shiftCycle) => shiftCycle.id)).toEqual([
      "cycle_001",
      "cycle_003",
      "cycle_004",
    ]);
    expect(state.shiftCycles[0]?.segments.map((segment) => segment.id)).toEqual([
      "segment_1",
      "segment_3",
    ]);
    expect(state.blockTemplates.map((template) => template.id)).toEqual([
      "template_1",
      "template_3",
      "template_4",
    ]);
    expect(state.blockRecurrences.map((recurrence) => recurrence.id)).toEqual([
      "rec_template_1",
      "rec_template_4",
      "rec_template_4_2",
    ]);
    expect(state.blockRecurrences[2]?.blockTemplateId).toBe("template_4");
  });

  it("allows final-suffix reuse without colliding with an active shift", () => {
    const baseState = createExampleScheduleStore().getState();
    const baseShift = baseState.shiftDefinitions[0]!;
    const cycle = baseState.shiftCycles[0]!;
    const store = createReadyDayFrameTestStore({
      ...baseState,
      shiftDefinitions: [
        { ...baseShift, id: "shift_1", name: "Shift 1" },
        { ...baseShift, id: "shift_2", name: "Shift 2" },
      ],
      shiftCycles: [
        {
          ...cycle,
          segments: cycle.segments.map((segment) => ({
            ...segment,
            shiftDefinitionId: "shift_1",
          })),
        },
      ],
    });
    const commit = vi.spyOn(store, "commitAuthoredSetupTransaction");
    render(<DayFrameApp store={store} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Delete Shift Definition" })[1]!);
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete Shift Definition" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Shift Definition" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(store.getState().shiftDefinitions.map((shiftDefinition) => shiftDefinition.id)).toEqual([
      "shift_1",
      "shift_2",
    ]);
    const operations = commit.mock.calls[0]![0].lifecycle.operations.filter(
      (operation) => operation.sourceKind === "shiftDefinition" && operation.sourceId === "shift_2",
    );
    expect(operations.map((operation) => operation.operation)).toEqual(["delete", "create"]);
  });

  it("allocates sequence IDs against the common cycle-local work-entry namespace", () => {
    const pattern = projectActiveToPattern(createExampleScheduleStore().getState());
    const cycle = pattern.shiftCycles[0]!;

    const store = createReadyDayFrameTestStore({
      ...pattern,
      shiftCycles: [
        {
          ...cycle,
          mode: "repeatingSequence",
          segments: [{ ...cycle.segments[0]!, id: "sequence_day_2" }],
          sequence: [
            { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: null },
            { id: "sequence_day_3", dayOffset: 1, shiftDefinitionId: null },
          ],
        },
      ],
    });
    render(<DayFrameApp store={store} />);

    const expandCycles = screen.queryByRole("button", { name: "Work Schedule: Expand" });
    if (expandCycles) fireEvent.click(expandCycles);
    fireEvent.click(screen.getByRole("button", { name: "Add Sequence Day" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(store.getState().shiftCycles[0]?.sequence?.map((entry) => entry.id)).toEqual([
      "sequence_day_1",
      "sequence_day_3",
      "sequence_day_4",
    ]);
  });

  it("allocates distinct manual-event IDs for an identical creation timestamp and preserves edits", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-19T13:00:00.000Z"));

    try {
      const store = createExampleScheduleStore();
      const mutateManualEvent = vi.spyOn(store, "mutateManualEvent");

      render(
        <DayFrameApp
          getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
          getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
          store={store}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
      fireEvent.click(screen.getByRole("button", { name: /^Monday, May 4, 2026/ }));
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "First Event" } });
      fireEvent.click(screen.getByRole("button", { name: "Save Event" }));
      fireEvent.click(screen.getByRole("button", { name: /^Tuesday, May 5, 2026/ }));
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Second Event" } });
      fireEvent.click(screen.getByRole("button", { name: "Save Event" }));

      const createdIds = store.getState().manualEvents.map((manualEvent) => manualEvent.id);
      expect(createdIds).toEqual([
        "manual_event_2026-08-19T13:00:00.000Z",
        "manual_event_2026-08-19T13:00:00.000Z_2",
      ]);

      fireEvent.click(screen.getByRole("button", { name: "Edit Event" }));
      fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Edited Event" } });
      fireEvent.click(screen.getByRole("button", { name: "Save Event" }));

      expect(store.getState().manualEvents.map((manualEvent) => manualEvent.id)).toEqual(
        createdIds,
      );
      expect(mutateManualEvent.mock.calls.map(([mutation]) => mutation.operation)).toEqual([
        "create",
        "create",
        "update",
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("generates preview work from a repeating sequence cycle", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["monday"],
          crossesMidnight: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      shiftCycles: [
        {
          id: "cycle_sequence",
          userId: "user_001",
          name: "2 On 1 Off",
          type: "fixedSegments",
          mode: "repeatingSequence",
          startsOnDate: "2026-05-04",
          endsOnDate: "2026-05-06",
          segments: [],
          sequenceAnchorDate: "2026-05-04",
          sequence: [
            { id: "sequence_day_1", dayOffset: 0, shiftDefinitionId: "shift_night" },
            { id: "sequence_day_2", dayOffset: 1, shiftDefinitionId: "shift_night" },
            { id: "sequence_day_3", dayOffset: 2, shiftDefinitionId: null },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "template_review",
          userId: "user_001",
          title: "Schedule Review",
          category: "review",
          placementType: "flexible",
          durationMinutes: 60,
          priority: 2,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_review",
          blockTemplateId: "template_review",
          frequency: "daily",
        },
      ],
    });

    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} store={store} />);

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getByRole("heading", { name: "Schedule details" })).toBeInTheDocument();
    expect(screen.getAllByText("Night Shift 9:45 PM - 6:15 AM")).toHaveLength(2);
  });

  it("clears the unified save message when the draft changes again", () => {
    render(<ExampleScheduleApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);

    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
    expect(screen.getByText("Setup saved.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Sunrise Shift" },
    });

    expect(screen.queryByText("Setup saved.")).not.toBeInTheDocument();
  });

  it("saves, loads, and deletes a local setup profile", async () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "template_workout",
          userId: "user_001",
          title: "Workout",
          category: "fitness",
          placementType: "flexible",
          durationMinutes: 720,
          priority: 2,
          preferredWindow: "anyAvailable",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
      previewRange: {
        preset: "threeDays",
        startDate: "2026-05-04",
        endDate: "2026-05-06",
      },
    });

    render(<DayFrameApp store={store} />);

    fireEvent.change(screen.getByLabelText("Range Preset"), {
      target: { value: "oneWeek" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    fireEvent.change(screen.getByLabelText("Profile Name"), {
      target: { value: "Night Rotation" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Current Setup as Profile" }));

    expect(screen.getByText("Current setup saved as a local profile.")).toBeInTheDocument();
    expect(screen.getByText("Night Rotation")).toBeInTheDocument();

    store.setShiftDefinitions([
      {
        id: "shift_temp",
        userId: "user_001",
        name: "Temp Shift",
        startTime: "07:00",
        endTime: "15:00",
        workDays: ["monday"],
        crossesMidnight: false,
        createdAt: "2026-05-03T00:00:00-05:00",
        updatedAt: "2026-05-03T00:00:00-05:00",
      },
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Load Profile" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("Day Shift");
    });
    expect(screen.getByLabelText("Range Preset")).toHaveValue("oneWeek");
    expect(screen.getByLabelText("End Date")).toHaveValue("2026-05-10");

    expect(screen.getByText('Loaded profile "Night Rotation".')).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete Profile" }));

    await waitFor(() => {
      expect(screen.getByText("No saved profiles yet.")).toBeInTheDocument();
    });
  });

  it("rejects a semantic-invalid profile and keeps it available without changing setup", () => {
    const currentState = createExampleScheduleStore().getState();
    const invalidProfile = {
      id: "profile_invalid",
      name: "Needs Recovery",
      savedAt: "2026-05-05T09:00:00-05:00",
      data: {
        schedulingPreferences: currentState.schedulingPreferences,
        previewRange: currentState.previewRange,
        shiftDefinitions: currentState.shiftDefinitions,
        shiftCycles: currentState.shiftCycles,
        blockTemplates: currentState.blockTemplates,
        blockRecurrences: [
          { id: "rec_orphan", blockTemplateId: "missing_template", frequency: "daily" as const },
        ],
        manualEvents: currentState.manualEvents,
      },
    };
    const store = createReadyDayFrameTestStore({
      ...currentState,
      savedProfiles: [invalidProfile],
    });
    const before = store.getState();

    render(<DayFrameApp store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Profile" }));

    expect(
      screen.getByText(
        "Profile was not loaded. Your current setup and the saved profile were preserved because the profile needs recovery before it can be used.",
      ),
    ).toBeInTheDocument();
    expect(store.getState()).toEqual(before);
    expect(screen.getByText("Needs Recovery")).toBeInTheDocument();
    expect(screen.queryByText('Loaded profile "Needs Recovery".')).not.toBeInTheDocument();
  });

  it("generates a preview from an explicit example schedule when the user requests it", () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getAllByText("Generated").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Today at 1:00 PM").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Needs attention")[0]!).toBeInTheDocument();
    expect(screen.getByText("Day Shift 5:45 AM - 2:15 PM")).toBeInTheDocument();
    expect(screen.getAllByText("Sleep 8:45 PM - 4:45 AM").length).toBeGreaterThan(0);
    expect(screen.getByText("Errands 2:30 PM - 3:30 PM")).toBeInTheDocument();
    expect(screen.getByLabelText("Day visualizer for 2026-05-04")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "No friction" })).toBeInTheDocument();
    expect(screen.getByText("Visible Days")).toBeInTheDocument();
    expect(screen.getByText("Open Review Schedule")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Monday, May 4, 2026$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Tuesday, May 5, 2026$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Wednesday, May 6, 2026$/ })).toBeInTheDocument();
  });

  it("filters the full preview to a selected day and range from the compact calendar", () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    fireEvent.click(screen.getByRole("button", { name: /^Tuesday, May 5, 2026$/ }));

    expect(
      screen.getByRole("button", { name: "Tuesday, May 5, 2026, selected day" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Tuesday, May 5, 2026, selected day" })).toHaveClass(
      "is-selected",
      "is-range-start",
      "is-range-end",
    );
    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Tuesday, 2026-05-05" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Monday, 2026-05-04" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Wednesday, May 6, 2026$/ }));

    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Tuesday, 2026-05-05" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Wednesday, 2026-05-06" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tuesday, May 5, 2026, selected range start" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Wednesday, May 6, 2026, selected range end" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Tuesday, May 5, 2026, selected range start" }),
    ).toHaveClass("is-selected", "is-range-start");
    expect(
      screen.getByRole("button", { name: "Wednesday, May 6, 2026, selected range end" }),
    ).toHaveClass("is-selected", "is-range-end");
  });

  it("keeps the selected compact-preview day stable when switching between Setup and Preview", () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: /^Tuesday, May 5, 2026$/ }));

    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Plan" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(
      screen.getByRole("button", { name: "Tuesday, May 5, 2026, selected day" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Tuesday, 2026-05-05" })).toBeInTheDocument();
  });

  it("uses a lighter interior style for selected preview ranges", () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: /^Monday, May 4, 2026$/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Wednesday, May 6, 2026$/ }));

    expect(
      screen.getByRole("button", { name: "Tuesday, May 5, 2026, selected range" }),
    ).toHaveClass("is-selected", "is-range-middle");
  });

  it("marks compact calendar friction days and restores the full visible range", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "template_workout",
          userId: "user_001",
          title: "Workout",
          category: "fitness",
          placementType: "flexible",
          durationMinutes: 720,
          priority: 2,
          preferredWindow: "anyAvailable",
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
          priority: 3,
          preferredWindow: "afterWork",
          rescheduleBehavior: "autoSameDay",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
        {
          id: "rec_errands",
          blockTemplateId: "template_errands",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
    });

    render(
      <DayFrameApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    const conflictDayButton = screen.getByRole("button", {
      name: "Monday, May 4, 2026, has friction",
    });

    expect(conflictDayButton).toBeInTheDocument();
    expect(conflictDayButton).toHaveAttribute("aria-label", "Monday, May 4, 2026, has friction");

    fireEvent.click(conflictDayButton);
    expect(
      screen.getByRole("button", { name: "Monday, May 4, 2026, selected day, has friction" }),
    ).toHaveClass("is-selected", "is-conflict");
    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Open Review Schedule" }));

    expect(screen.getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(3);
  });

  it("marks today in the compact calendar and keeps setup and preview navigation working", () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-05T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 5, 16, 0, 0, 0)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    const todayButton = screen.getByRole("button", {
      name: "Tuesday, May 5, 2026, today",
    });

    expect(todayButton).toHaveAttribute("aria-current", "date");
    expect(screen.getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Plan" }));

    expect(screen.getByRole("button", { name: "Plan" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Plan" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Tuesday, May 5, 2026, today" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tuesday, May 5, 2026, today" }));
    expect(
      screen.getByRole("button", { name: "Tuesday, May 5, 2026, selected day, today" }),
    ).toHaveClass("is-selected", "is-today");
  });

  it("collapses setup sections by default and preserves draft edits when sections are reopened", () => {
    render(<ExampleScheduleApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);

    expect(screen.getByRole("button", { name: "Schedule Preferences: Collapse" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Work Hours: Collapse" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Work Schedule: Expand" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(
      screen.getByText("Advanced work schedule rotation and dated-period configuration."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Advanced Commitment Fields: Expand" }));
    fireEvent.change(screen.getAllByLabelText("Title")[0]!, {
      target: { value: "Sleep Buffer" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Advanced Commitment Fields: Collapse" }));
    fireEvent.click(screen.getByRole("button", { name: "Advanced Commitment Fields: Expand" }));

    expect(screen.getByDisplayValue("Sleep Buffer")).toBeInTheDocument();
  });

  it("clears the selected compact-preview range when a loaded profile replaces the preview", async () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.change(screen.getByLabelText("Profile Name"), {
      target: { value: "Saved Setup" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Current Setup as Profile" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: /^Tuesday, May 5, 2026$/ }));

    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Plan" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Temporary Shift" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Load Profile" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("Day Shift");
    });
    expect(
      screen.queryByRole("button", { name: /Tuesday, May 5, 2026, selected day/ }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(3);
    expect(screen.getByRole("button", { name: /^Tuesday, May 5, 2026$/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("generates preview using the saved preview range instead of the old hardcoded window", () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.change(screen.getByLabelText("Range Preset"), {
      target: { value: "oneWeek" },
    });
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2026-05-05" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getAllByText("May 5-11, 2026").length).toBeGreaterThan(0);
  });

  it("can save a cycle-based preview range and generate the full authored cycle", () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Planning Range: Expand" }));
    fireEvent.click(screen.getByRole("button", { name: "Work Schedule: Expand" }));
    fireEvent.change(screen.getByLabelText("Cycle Start Date"), {
      target: { value: "2026-05-10" },
    });
    fireEvent.change(screen.getByLabelText("Cycle End Date"), {
      target: { value: "2026-05-12" },
    });
    fireEvent.change(screen.getByLabelText("Segment Start Date"), {
      target: { value: "2026-05-10" },
    });
    fireEvent.change(screen.getByLabelText("Segment End Date"), {
      target: { value: "2026-05-12" },
    });
    fireEvent.change(screen.getByLabelText("Range Source"), {
      target: { value: "cycle" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getAllByText("May 10-12, 2026").length).toBeGreaterThan(0);
  });

  it("keeps Setup authoritative and does not generate Preview after a rejected commit", () => {
    const store = createExampleScheduleStore();
    const originalCycle = store.getState().shiftCycles[0]!;

    render(<DayFrameApp store={store} />);

    fireEvent.click(screen.getByRole("button", { name: "Work Schedule: Expand" }));
    fireEvent.change(screen.getByLabelText("Cycle End Date"), {
      target: { value: "2026-04-30" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(
      screen.getByText("Setup contains conflicting or incomplete authored data and was not saved."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Plan" })).toHaveAttribute("aria-pressed", "true");
    expect(store.getState().shiftCycles[0]).toEqual(originalCycle);
    expect(store.getState().preview).toBeNull();
  });

  it("creates, edits, and deletes a manual event from the compact preview day details", async () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: /^Monday, May 4, 2026/ }));

    expect(screen.getByRole("heading", { name: "Add Event" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Doctor Appointment" },
    });
    fireEvent.change(screen.getByLabelText("Start Time"), {
      target: { value: "10:00" },
    });
    fireEvent.change(screen.getByLabelText("End Time"), {
      target: { value: "11:00" },
    });
    fireEvent.change(screen.getByLabelText("Notes"), {
      target: { value: "Bring forms" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Event" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Day Details" })).toBeInTheDocument();
    });
    expect(screen.getAllByText("Doctor Appointment").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Day Shift conflicts with Doctor Appointment").length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Edit Event" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Edit Event" }));
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Appointment" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Event" }));

    await waitFor(() => {
      expect(screen.getAllByText("Updated Appointment").length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole("button", { name: "Delete Event" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete Event" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Add Event" })).toBeInTheDocument();
    });
    expect(screen.queryByText("Updated Appointment")).not.toBeInTheDocument();
  });

  it("opens the singular Event workflow from the selected Review Schedule user-day", async () => {
    render(<ExampleScheduleApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: "Review Schedule" }));

    const addEvent = screen.getByRole("button", { name: "Add event to Monday, 2026-05-04" });
    fireEvent.click(addEvent);

    expect(screen.getByRole("heading", { name: "Add Event" })).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toHaveValue("2026-05-04");
    await waitFor(() => expect(screen.getByLabelText("Title")).toHaveFocus());
  });

  it("navigates from an exact scheduled occurrence to the reused lazy Commitment editor", async () => {
    render(<ExampleScheduleApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Review Schedule" })).toHaveFocus(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Review Schedule" }));

    fireEvent.click(screen.getByRole("button", { name: "Edit commitment Errands" }));

    expect(screen.getByRole("button", { name: "Plan" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Return to Review Schedule" })).toBeInTheDocument();
    await waitFor(() => expect(document.getElementById("commitment-title")).toHaveValue("Errands"));
    expect(document.getElementById("commitment-title")).toHaveFocus();
  });

  it("keeps daily before-work sleep on every visible night-shift day across a one-week app preview", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
          crossesMidnight: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      shiftCycles: [
        {
          id: "cycle_001",
          userId: "user_001",
          name: "Night Rotation",
          type: "fixedSegments",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
          segments: [
            {
              id: "segment_night",
              shiftCycleId: "cycle_001",
              shiftDefinitionId: "shift_night",
              startsOnDate: "2026-05-01",
              endsOnDate: "2026-05-31",
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 510,
          bufferBeforeMinutes: 30,
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
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
      ],
    });

    render(
      <DayFrameApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 5, 16, 0, 0, 0)}
        store={store}
      />,
    );

    fireEvent.change(screen.getByLabelText("Range Preset"), {
      target: { value: "oneWeek" },
    });
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2026-05-05" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getAllByText("May 5-11, 2026").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(7);
    expect(screen.getAllByText("Sleep 12:15 PM - 8:45 PM")).toHaveLength(7);
    expect(screen.getAllByText("Night Shift 9:45 PM - 6:15 AM")).toHaveLength(7);

    const preview = store.getState().preview;
    const sleepBlocks =
      preview?.result.scheduledBlocks.filter(
        (scheduledBlock) => scheduledBlock.title === "Sleep",
      ) ?? [];

    expect(sleepBlocks.map((scheduledBlock) => scheduledBlock.userDayDate)).toEqual([
      "2026-05-05",
      "2026-05-06",
      "2026-05-07",
      "2026-05-08",
      "2026-05-09",
      "2026-05-10",
      "2026-05-11",
    ]);
    expect(
      sleepBlocks.every(
        (scheduledBlock) =>
          scheduledBlock.endsAt.getTime() - scheduledBlock.startsAt.getTime() === 510 * 60_000,
      ),
    ).toBe(true);
    expect(sleepBlocks.every((scheduledBlock) => scheduledBlock.bufferBeforeMinutes === 30)).toBe(
      true,
    );
    expect(sleepBlocks.every((scheduledBlock) => scheduledBlock.bufferAfterMinutes === 60)).toBe(
      true,
    );
  });

  it.each([
    {
      preset: "threeDays" as const,
      expectedVisibleDayCount: 3,
      expectedPlanningWindowLabel: "May 5-7, 2026",
    },
    {
      preset: "oneWeek" as const,
      expectedVisibleDayCount: 7,
      expectedPlanningWindowLabel: "May 5-11, 2026",
    },
    {
      preset: "twoWeeks" as const,
      expectedVisibleDayCount: 14,
      expectedPlanningWindowLabel: "May 5-18, 2026",
    },
    {
      preset: "oneMonth" as const,
      expectedVisibleDayCount: 30,
      expectedPlanningWindowLabel: "May 5 - June 3, 2026",
    },
  ])(
    "shows exactly $expectedVisibleDayCount visible user days for $preset",
    ({ preset, expectedVisibleDayCount, expectedPlanningWindowLabel }) => {
      render(
        <ExampleScheduleApp
          getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
          getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        />,
      );

      fireEvent.change(screen.getByLabelText("Range Preset"), {
        target: { value: preset },
      });
      fireEvent.change(screen.getByLabelText("Start Date"), {
        target: { value: "2026-05-05" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
      fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

      expect(screen.getAllByText(expectedPlanningWindowLabel).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(
        expectedVisibleDayCount,
      );
    },
  );

  it("uses the current preferred window values when generating preview placements", () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.change(screen.getAllByLabelText("Preferred Window")[0]!, {
      target: { value: "afterWork" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getByText("Sleep 2:15 PM - 10:15 PM")).toBeInTheDocument();
    expect(screen.queryByText("Sleep 8:45 PM - 4:45 AM")).not.toBeInTheDocument();
  });

  it("persists the requires-work-shift setting from the template editor", () => {
    const store = createReadyDayFrameTestStore({
      blockTemplates: [
        {
          id: "template_workout",
          userId: "user_001",
          title: "Workout",
          category: "fitness",
          requiresWorkAnchor: false,
          placementType: "flexible",
          durationMinutes: 60,
          priority: 2,
          preferredWindow: "afterWork",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
    });

    render(
      <DayFrameApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Advanced Commitment Fields: Expand" }));

    const requiresWorkShift = screen.getAllByLabelText("Requires Work Shift")[0]!;

    expect(requiresWorkShift).not.toBeChecked();
    fireEvent.click(requiresWorkShift);
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(store.getState().blockTemplates[0]?.requiresWorkAnchor).toBe(true);
  });

  it("shows a clear setup message when preview data is incomplete", () => {
    const store = createReadyDayFrameTestStore();

    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} store={store} />);

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getByText("Finish setup before generating a schedule:")).toBeInTheDocument();
    expect(screen.getByText("Add at least one shift definition.")).toBeInTheDocument();
    expect(screen.getByText("Add or include at least one block template.")).toBeInTheDocument();
    expect(screen.queryByText(retiredGuardrailMessage)).not.toBeInTheDocument();
    expect(screen.queryByText("Add at least one block recurrence.")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("No schedule generated yet.")).toBeInTheDocument();
  });

  it("shows only the missing setup items that still need attention", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
    });

    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} store={store} />);

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getByText("Finish setup before generating a schedule:")).toBeInTheDocument();
    expect(screen.queryByText("Add at least one shift definition.")).not.toBeInTheDocument();
    expect(screen.getByText("Add or include at least one block template.")).toBeInTheDocument();
    expect(screen.queryByText(retiredGuardrailMessage)).not.toBeInTheDocument();
    expect(screen.queryByText("Add at least one block recurrence.")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("No schedule generated yet.")).toBeInTheDocument();
  });

  it("generates a preview in the app for a 3-day night-shift window with edge-day sleep and workout blocks", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
        {
          id: "shift_night",
          userId: "user_001",
          name: "Night Shift",
          startTime: "21:45",
          endTime: "06:15",
          workDays: ["tuesday", "wednesday", "thursday"],
          crossesMidnight: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      shiftCycles: [
        {
          id: "cycle_001",
          userId: "user_001",
          name: "Night Rotation",
          type: "fixedSegments",
          startsOnDate: "2026-05-01",
          endsOnDate: "2026-05-31",
          segments: [
            {
              id: "segment_night",
              shiftCycleId: "cycle_001",
              shiftDefinitionId: "shift_night",
              startsOnDate: "2026-05-01",
              endsOnDate: "2026-05-31",
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 510,
          bufferBeforeMinutes: 60,
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
          id: "template_workout",
          userId: "user_001",
          title: "Workout",
          category: "fitness",
          placementType: "flexible",
          durationMinutes: 60,
          priority: 2,
          preferredWindow: "afterWork",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "daily",
        },
      ],
      previewRange: {
        preset: "custom",
        startDate: "2026-05-05",
        endDate: "2026-05-07",
      },
    });

    render(
      <DayFrameApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 5, 16, 0, 0, 0)}
        getPreviewWindow={() => ({
          planningWindowStart: new Date(2026, 4, 5, 3, 0, 0, 0),
          planningWindowEnd: new Date(2026, 4, 8, 3, 0, 0, 0),
        })}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(
      screen.queryByText("Finish setup before generating a schedule:"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Generated").length).toBeGreaterThan(0);
    expect(screen.getAllByText("May 5-7, 2026").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Tuesday, 2026-05-05" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Wednesday, 2026-05-06" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Thursday, 2026-05-07" })).toBeInTheDocument();
    expect(screen.queryByText("Monday, 2026-05-04")).not.toBeInTheDocument();
    expect(screen.queryByText("Friday, 2026-05-08")).not.toBeInTheDocument();
    expect(screen.getAllByText("Sleep 12:15 PM - 8:45 PM")).toHaveLength(3);
    expect(screen.getAllByText("Workout 6:15 AM - 7:15 AM")).toHaveLength(2);
    expect(screen.getAllByText("Night Shift 9:45 PM - 6:15 AM")).toHaveLength(3);
  });

  it("lets the user apply a suggested fix after generating a preview", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "template_workout",
          userId: "user_001",
          title: "Workout",
          category: "fitness",
          placementType: "flexible",
          durationMinutes: 60,
          priority: 2,
          preferredWindow: "custom",
          customWindowStartTime: "14:15",
          customWindowEndTime: "15:15",
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
          placementType: "fixed",
          durationMinutes: 60,
          priority: 3,
          preferredWindow: "afterWaking",
          fixedStartTime: "14:30",
          rescheduleBehavior: "autoSameDay",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
        {
          id: "rec_errands",
          blockTemplateId: "template_errands",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
    });

    render(
      <DayFrameApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        getRevisedAt={() => "2026-05-03T14:00:00-05:00"}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: "Move block" }));

    expect(screen.getByText("Revised")).toBeInTheDocument();
    expect(screen.getByText("Today at 2:00 PM")).toBeInTheDocument();
    expect(screen.getAllByText("Needs attention")[0]!).toBeInTheDocument();
    expect(screen.getByText("0 total, 0 critical, 0 warning, 0 info")).toBeInTheDocument();
    expect(store.getPlanDecisions()).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Apply Planning Change" }));
    expect(store.getPlanDecisions()).toHaveLength(1);
    expect(store.getPlanDecisions()[0]).toMatchObject({
      kind: "placeOccurrence",
      provenance: { source: "suggestedFix", suggestedAction: "moveBlock" },
    });
    expect(screen.getByRole("status")).toHaveTextContent("Accepted and saved.");
    expect(screen.getByRole("heading", { name: "Accepted choices (1)" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove accepted choice for Workout" }));
    expect(store.getPlanDecisions()).toHaveLength(0);
    expect(screen.queryByRole("heading", { name: /Accepted choices/ })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Accepted choice removed and saved.");
  });

  it("marks an existing preview as stale after setup changes", async () => {
    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    expect(screen.getAllByText("Today at 1:00 PM").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Plan" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Updated Day Shift" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
    fireEvent.click(screen.getByRole("button", { name: "Open Review Schedule" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Your planning setup changed after this schedule was generated. Refresh the schedule to see those changes.",
        ),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Day Shift 5:45 AM - 2:15 PM")).toBeInTheDocument();
  });

  it("regenerates a stale preview after a template edit and clears the stale warning", async () => {
    const getGeneratedAt = vi
      .fn<() => string>()
      .mockReturnValueOnce("2026-05-03T13:00:00-05:00")
      .mockReturnValueOnce("2026-05-03T15:00:00-05:00");

    render(
      <ExampleScheduleApp
        getGeneratedAt={getGeneratedAt}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getAllByText("Today at 1:00 PM").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sleep 8:45 PM - 4:45 AM").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Plan" }));
    fireEvent.change(screen.getAllByLabelText("Title")[0]!, {
      target: { value: "Sleep Recovery" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
    fireEvent.click(screen.getByRole("button", { name: "Open Review Schedule" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Your planning setup changed after this schedule was generated. Refresh the schedule to see those changes.",
        ),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Refresh Schedule" })).toBeEnabled();
    expect(screen.getAllByText("Sleep 8:45 PM - 4:45 AM").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Refresh Schedule" }));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Your planning setup changed after this schedule was generated. Refresh the schedule to see those changes.",
        ),
      ).not.toBeInTheDocument();
    });
    expect(screen.getAllByText("Today at 3:00 PM").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sleep Recovery 8:45 PM - 4:45 AM").length).toBeGreaterThan(0);
    expect(screen.queryByText("Sleep 8:45 PM - 4:45 AM")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No friction" })).toBeInTheDocument();
    expect(screen.getAllByText("May 4-6, 2026").length).toBeGreaterThan(0);
  });

  it("shows non-blocking preview range mismatch warnings only after preview generation", () => {
    const store = createReadyDayFrameTestStore({
      previewRange: {
        preset: "custom",
        startDate: "2026-06-01",
        endDate: "2026-06-03",
      },
      shiftDefinitions: [
        {
          id: "shift_day",
          userId: "user_001",
          name: "Day Shift",
          startTime: "05:45",
          endTime: "14:15",
          workDays: ["monday", "tuesday", "wednesday"],
          crossesMidnight: false,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "template_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 480,
          priority: 1,
          preferredWindow: "beforeSleep",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "template_sleep",
          frequency: "daily",
        },
      ],
    });

    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} store={store} />);

    expect(
      screen.queryByRole("heading", { name: "Preview Range Warnings" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("This preview range does not overlap the active cycle."),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getAllByText("Planning range warnings:").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Refresh Schedule" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Refresh Schedule" }));

    expect(
      screen.getAllByText("This preview range does not overlap the active cycle.").length,
    ).toBeGreaterThan(0);
  });

  it("blocks stale Review fixed time navigation until the preview is regenerated", async () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "template_workout",
          userId: "user_001",
          title: "Workout",
          category: "fitness",
          placementType: "fixed",
          fixedStartTime: "06:00",
          durationMinutes: 60,
          priority: 2,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "askUser",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
    });

    render(
      <DayFrameApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        getRevisedAt={() => "2026-05-03T14:00:00-05:00"}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    store.setSchedulingPreferences({ weekStartsOn: "monday" });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Review fixed time" })).toBeDisabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "Review fixed time" }));
    expect(screen.getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Refresh Schedule" }));
    const freshReviewButton = screen.getByRole("button", { name: "Review fixed time" });
    expect(freshReviewButton).toBeEnabled();
    fireEvent.click(freshReviewButton);

    expect(screen.getByRole("button", { name: "Plan" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Fixed Start Time")[0]).toHaveFocus();
  });

  it("regenerates the preview after Review fixed time, setup save, and Regenerate Preview", async () => {
    const getGeneratedAt = vi
      .fn<() => string>()
      .mockReturnValueOnce("2026-05-03T13:00:00-05:00")
      .mockReturnValueOnce("2026-05-03T15:00:00-05:00");
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "template_workout",
          userId: "user_001",
          title: "Workout",
          category: "fitness",
          placementType: "fixed",
          fixedStartTime: "06:00",
          durationMinutes: 60,
          priority: 2,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "askUser",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
    });

    render(
      <DayFrameApp
        getGeneratedAt={getGeneratedAt}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    expect(screen.getByRole("button", { name: "Review fixed time" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Review fixed time" }));
    fireEvent.change(screen.getAllByLabelText("Fixed Start Time")[0]!, {
      target: { value: "15:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
    fireEvent.click(screen.getByRole("button", { name: "Open Review Schedule" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Your planning setup changed after this schedule was generated. Refresh the schedule to see those changes.",
        ),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Refresh Schedule" })).toBeEnabled();
    expect(screen.getByText("Workout 6:00 AM - 7:00 AM")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Refresh Schedule" }));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Your planning setup changed after this schedule was generated. Refresh the schedule to see those changes.",
        ),
      ).not.toBeInTheDocument();
    });
    expect(getGeneratedAt).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Workout 3:00 PM - 4:00 PM")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Review fixed time" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No friction" })).toBeInTheDocument();
  });

  it("focuses the fixed-time input for the selected friction when multiple fixed templates exist", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "template_breakfast",
          userId: "user_001",
          title: "Breakfast",
          category: "meal",
          placementType: "fixed",
          fixedStartTime: "06:00",
          durationMinutes: 30,
          priority: 2,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "askUser",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
        {
          id: "template_workout",
          userId: "user_001",
          title: "Workout",
          category: "fitness",
          placementType: "fixed",
          fixedStartTime: "06:30",
          durationMinutes: 60,
          priority: 2,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "askUser",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_breakfast",
          blockTemplateId: "template_breakfast",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
        {
          id: "rec_workout",
          blockTemplateId: "template_workout",
          frequency: "specificWeekdays",
          weekdays: ["monday"],
        },
      ],
      preview: {
        result: {
          generatedWorkBlocks: [
            {
              id: "work_shift_day_2026-05-05",
              shiftDefinitionId: "shift_day",
              shiftCycleId: "cycle_001",
              shiftSegmentId: "segment_day",
              userId: "user_001",
              title: "Day Shift",
              startsAt: new Date(2026, 4, 5, 5, 45, 0, 0),
              endsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
              startDate: "2026-05-05",
              endDate: "2026-05-05",
              userDayDate: "2026-05-05",
              crossesMidnight: false,
            },
          ],
          blockCandidates: [],
          scheduledBlocks: [
            {
              id: "scheduled_breakfast",
              userId: "user_001",
              templateId: "template_breakfast",
              source: "template",
              title: "Breakfast",
              category: "meal",
              anchorType: "fixedTemplate",
              placementType: "fixed",
              fixedStartTime: "06:00",
              startsAt: new Date(2026, 4, 5, 6, 0, 0, 0),
              endsAt: new Date(2026, 4, 5, 6, 30, 0, 0),
              userDayDate: "2026-05-05",
              userWeekStartDate: "2026-05-02",
              priority: 2,
              status: "planned",
              externalResources: [],
            },
            {
              id: "scheduled_workout",
              userId: "user_001",
              templateId: "template_workout",
              source: "template",
              title: "Workout",
              category: "fitness",
              anchorType: "fixedTemplate",
              placementType: "fixed",
              fixedStartTime: "06:30",
              startsAt: new Date(2026, 4, 5, 6, 30, 0, 0),
              endsAt: new Date(2026, 4, 5, 7, 30, 0, 0),
              userDayDate: "2026-05-05",
              userWeekStartDate: "2026-05-02",
              priority: 2,
              status: "planned",
              externalResources: [],
            },
          ],
          unplacedCandidates: [],
          planDecisionResults: [],
          frictionPoints: [
            {
              id: "friction_conflict_work_breakfast",
              userId: "user_001",
              severity: "warning",
              title: "Day Shift conflicts with Breakfast",
              message: "Needs review.",
              affectedBlockIds: ["work_shift_day_2026-05-05", "scheduled_breakfast"],
              affectedUserDayDate: "2026-05-05",
              affectedUserWeekStartDate: "2026-05-02",
              suggestedFixes: [
                {
                  id: "fix_change_fixed_time_scheduled_breakfast",
                  label: "Review fixed time",
                  action: "changeFixedTime",
                },
              ],
              canIgnore: true,
              ignored: false,
              resolved: false,
              createdAt: "2026-05-03T10:00:00-05:00",
              updatedAt: "2026-05-03T10:00:00-05:00",
            },
            {
              id: "friction_conflict_work_workout",
              userId: "user_001",
              severity: "warning",
              title: "Day Shift conflicts with Workout",
              message: "Needs review.",
              affectedBlockIds: ["work_shift_day_2026-05-05", "scheduled_workout"],
              affectedUserDayDate: "2026-05-05",
              affectedUserWeekStartDate: "2026-05-02",
              suggestedFixes: [
                {
                  id: "fix_change_fixed_time_scheduled_workout",
                  label: "Review fixed time",
                  action: "changeFixedTime",
                },
              ],
              canIgnore: true,
              ignored: false,
              resolved: false,
              createdAt: "2026-05-03T10:00:00-05:00",
              updatedAt: "2026-05-03T10:00:00-05:00",
            },
          ],
        },
        rangeStartDate: "2026-05-05",
        rangeEndDate: "2026-05-05",
        planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
        planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
        generatedAt: "2026-05-03T13:00:00-05:00",
        isStale: false,
      },
    });

    render(
      <DayFrameApp
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        getRevisedAt={() => "2026-05-03T14:00:00-05:00"}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Review fixed time" })[1]!);

    expect(screen.getByRole("button", { name: "Plan" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByLabelText("Fixed Start Time")[1]).toHaveFocus();
  });

  it("re-enables persisted untouched default sleep and generates preview", () => {
    globalThis.localStorage.setItem(
      DAYFRAME_STORAGE_KEY,
      JSON.stringify({
        schedulingPreferences: {
          dayBoundaryStartTime: "03:00",
          weekStartsOn: "saturday",
        },
        shiftDefinitions: [
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
        ],
        shiftCycle: {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
        blockTemplates: [
          {
            id: "default_sleep",
            userId: "user_001",
            title: "Sleep",
            category: "sleep",
            placementType: "flexible",
            durationMinutes: 480,
            priority: 1,
            preferredWindow: "beforeSleep",
            rescheduleBehavior: "autoSameUserWeek",
            requiresResource: false,
            externalResources: [],
            enabled: false,
            createdAt: "2026-05-03T00:00:00-05:00",
            updatedAt: "2026-05-03T00:00:00-05:00",
          },
        ],
        blockRecurrences: [
          {
            id: "rec_sleep",
            blockTemplateId: "default_sleep",
            frequency: "daily",
          },
        ],
      }),
    );

    render(
      <DayFrameApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        store={createReadyDayFrameTestStore()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getAllByText("Generated").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sleep 7:00 PM - 3:00 AM")).toHaveLength(3);
  });

  it("allows preview generation when sleep is intentionally disabled but another template is enabled", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 480,
          priority: 1,
          preferredWindow: "beforeSleep",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: false,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-04T00:00:00-05:00",
        },
        {
          id: "template_errands",
          userId: "user_001",
          title: "Errands",
          category: "admin",
          placementType: "flexible",
          durationMinutes: 60,
          priority: 3,
          preferredWindow: "afterWork",
          rescheduleBehavior: "autoSameDay",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
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
      ],
    });

    render(
      <DayFrameApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getAllByText("Generated").length).toBeGreaterThan(0);
    expect(screen.getByText("Errands 2:15 PM - 3:15 PM")).toBeInTheDocument();
    expect(screen.queryByText("Sleep 7:00 PM - 3:00 AM")).not.toBeInTheDocument();
  });

  it("shows a clear guardrail when all templates are disabled", () => {
    const store = createReadyDayFrameTestStore({
      shiftDefinitions: [
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
      ],
      shiftCycles: [
        {
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
            },
          ],
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-03T00:00:00-05:00",
        },
      ],
      blockTemplates: [
        {
          id: "default_sleep",
          userId: "user_001",
          title: "Sleep",
          category: "sleep",
          placementType: "flexible",
          durationMinutes: 480,
          priority: 1,
          preferredWindow: "beforeSleep",
          rescheduleBehavior: "autoSameUserWeek",
          requiresResource: false,
          externalResources: [],
          enabled: false,
          createdAt: "2026-05-03T00:00:00-05:00",
          updatedAt: "2026-05-04T00:00:00-05:00",
        },
      ],
      blockRecurrences: [
        {
          id: "rec_sleep",
          blockTemplateId: "default_sleep",
          frequency: "daily",
        },
      ],
    });

    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} store={store} />);

    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(screen.getByText("Finish setup before generating a schedule:")).toBeInTheDocument();
    expect(screen.getByText("Add or include at least one block template.")).toBeInTheDocument();
    expect(screen.queryByText("Add at least one block recurrence.")).not.toBeInTheDocument();
  });

  it("requires confirmation before clearing locally saved setup data", () => {
    render(<ExampleScheduleApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear Local Data" }));

    expect(screen.getByText("Clear all locally saved DayFrame setup data?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm Clear Local Data" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByText("Clear all locally saved DayFrame setup data?"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Local DayFrame setup data cleared from this device."),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Day Shift");
  });

  it("clears local setup data after confirmation", async () => {
    render(<DayFrameApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear Local Data" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Clear Local Data" }));

    await waitFor(() =>
      expect(
        screen.queryByText("Clear all locally saved DayFrame setup data?"),
      ).not.toBeInTheDocument(),
    );
    expect(
      screen.getByText("Local DayFrame setup data cleared from this device."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No shifts yet. Add your first shift definition to get started."),
    ).toBeInTheDocument();
  });

  it("exports authored setup as a json backup file", async () => {
    render(<ExampleScheduleApp getExportedAt={() => "2026-05-05T15:00:00.000Z"} />);

    fireEvent.click(screen.getByRole("button", { name: "Export Complete Backup" }));

    await waitFor(() => expect(createObjectUrlMock).toHaveBeenCalledTimes(1));
    expect(anchorClickMock).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Complete DayFrame backup downloaded.")).toBeInTheDocument();

    const backupBlob = createObjectUrlMock.mock.calls[0]?.[0] as Blob;
    const backupJson = await backupBlob.text();

    const parsed = JSON.parse(backupJson) as {
      app: string;
      surface: string;
      version: number;
      exportedAt: string;
      data: Record<string, unknown>;
    };
    expect(parsed).toMatchObject({
      app: "DayFrame",
      surface: "backup",
      version: 6,
      exportedAt: "2026-05-05T15:00:00.000Z",
    });
    expect(parsed.data).toHaveProperty("active");
    expect(parsed.data).toHaveProperty("measurementDefinitions");
    expect(parsed.data).toHaveProperty("goals");
    expect(parsed.data).toHaveProperty("profiles");
    expect(parsed.data).toHaveProperty("planDecisions");
    expect(parsed.data).toHaveProperty("executionHistory");
    expect(parsed.data).toHaveProperty("historicalPlan");
    expect(JSON.stringify(parsed.data)).not.toContain('"preview"');
    expect(JSON.stringify(parsed.data)).toContain("incarnationId");
  });

  it("imports a valid setup backup json file", async () => {
    const store = createReadyDayFrameTestStore();

    render(<DayFrameApp store={store} />);

    fireEvent.change(screen.getByLabelText("Import Setup Backup File"), {
      target: {
        files: [
          new File(
            [
              JSON.stringify(
                createDayFrameBackup(
                  {
                    schedulingPreferences: {
                      dayBoundaryStartTime: "04:00",
                      weekStartsOn: "monday",
                    },
                    previewRange: {
                      preset: "custom",
                      startDate: "2026-05-08",
                      endDate: "2026-05-12",
                    },
                    manualEvents: [],
                    shiftDefinitions: [
                      {
                        id: "shift_night",
                        userId: "user_001",
                        name: "Night Shift",
                        startTime: "22:00",
                        endTime: "06:00",
                        workDays: ["tuesday"],
                        crossesMidnight: true,
                        createdAt: "2026-05-03T00:00:00-05:00",
                        updatedAt: "2026-05-03T00:00:00-05:00",
                      },
                    ],
                    shiftCycles: [],
                    blockTemplates: [],
                    blockRecurrences: [],
                  },
                  "2026-05-05T10:00:00-05:00",
                ),
              ),
            ],
            "dayframe-backup.json",
            { type: "application/json" },
          ),
        ],
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText("Legacy Backup V1 imported with fresh source lifetimes."),
      ).toBeInTheDocument();
    });

    expect(store.getState().schedulingPreferences).toEqual({
      dayBoundaryStartTime: "04:00",
      weekStartsOn: "monday",
    });
    expect(store.getState().previewRange).toEqual({
      preset: "custom",
      startDate: "2026-05-08",
      endDate: "2026-05-12",
    });
    expect(store.getState().shiftDefinitions[0]?.name).toBe("Night Shift");
  });

  it("restores a Backup V2 file with lifetime-specific feedback", async () => {
    const source = createExampleScheduleStore();
    const backup = source.exportBackup("2026-05-05T10:00:00-05:00");
    const target = createReadyDayFrameTestStore();
    render(<DayFrameApp store={target} />);

    fireEvent.change(screen.getByLabelText("Import Setup Backup File"), {
      target: {
        files: [new File([JSON.stringify(backup)], "backup-v2.json", { type: "application/json" })],
      },
    });

    await waitFor(() =>
      expect(
        screen.getByText("Backup V2 restored with its original source lifetimes."),
      ).toBeInTheDocument(),
    );
    expect(target.getState().shiftDefinitions[0]?.incarnationId).toBe(
      backup.data.shiftDefinitions[0]?.incarnationId,
    );
  });

  it("rejects a semantic-invalid backup without replacing the current workflow state", async () => {
    const store = createExampleScheduleStore();
    const before = store.getState();
    const invalidBackup = createDayFrameBackup(
      {
        schedulingPreferences: before.schedulingPreferences,
        previewRange: before.previewRange,
        shiftDefinitions: [],
        shiftCycles: before.shiftCycles,
        blockTemplates: before.blockTemplates,
        blockRecurrences: before.blockRecurrences,
        manualEvents: before.manualEvents,
      },
      "2026-05-05T10:00:00-05:00",
    );

    render(<DayFrameApp store={store} />);
    fireEvent.change(screen.getByLabelText("Import Setup Backup File"), {
      target: {
        files: [
          new File([JSON.stringify(invalidBackup)], "invalid-backup.json", {
            type: "application/json",
          }),
        ],
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Backup was not imported because validation failed. Your current setup was preserved.",
        ),
      ).toBeInTheDocument();
    });
    expect(store.getState()).toEqual(before);
    expect(screen.queryByText("DayFrame setup backup imported.")).not.toBeInTheDocument();
  });

  it("shows an error when backup import fails", async () => {
    render(<DayFrameApp />);

    fireEvent.change(screen.getByLabelText("Import Setup Backup File"), {
      target: {
        files: [new File(["not json"], "bad-backup.json", { type: "application/json" })],
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Backup file is not valid JSON.")).toBeInTheDocument();
    });
  });

  it.each([
    ["unavailable", "Setup applied for this session, but local storage is unavailable."],
    ["storageFailure", "Setup applied for this session, but it could not be saved locally."],
    [
      "serializationFailure",
      "Setup applied for this session, but it could not be prepared for local storage.",
    ],
  ] as const)(
    "keeps a Setup commit in runtime while reflecting %s durability semantics",
    (status, expectedMessage) => {
      const store = createReadyDayFrameTestStore();
      const commitAuthoredSetupTransaction = store.commitAuthoredSetupTransaction;
      const retryActivePersistence = vi.spyOn(store, "retryActivePersistence");
      const workflowStore = {
        ...store,
        commitAuthoredSetupTransaction: (
          ...args: Parameters<typeof commitAuthoredSetupTransaction>
        ) => ({
          ...commitAuthoredSetupTransaction(...args),
          persistence: { status } as PersistenceWriteOutcome,
        }),
      };

      render(<DayFrameApp store={workflowStore} />);
      fireEvent.change(screen.getByLabelText("Week Starts On"), {
        target: { value: "monday" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

      expect(store.getState().schedulingPreferences.weekStartsOn).toBe("monday");
      expect(screen.getByText(expectedMessage)).toHaveClass("df-danger-message");
      expect(screen.queryByText("Setup saved.")).not.toBeInTheDocument();
      expect(retryActivePersistence).not.toHaveBeenCalled();
      expect(screen.getByRole("heading", { name: "Plan" })).toBeInTheDocument();
    },
  );

  it("distinguishes a runtime profile save from retryable profile durability failure", () => {
    const store = createReadyDayFrameTestStore();
    const saveProfile = store.saveProfile;
    const workflowStore = {
      ...store,
      saveProfile: (...args: Parameters<typeof saveProfile>) => ({
        ...saveProfile(...args),
        persistence: { status: "storageFailure" } as const,
      }),
    };

    render(<DayFrameApp store={workflowStore} />);
    fireEvent.change(screen.getByLabelText("Profile Name"), {
      target: { value: "Session Profile" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Current Setup as Profile" }));

    expect(store.getState().savedProfiles[0]?.name).toBe("Session Profile");
    expect(
      screen.getByText(
        'Profile "Session Profile" exists for this session, but the local storage attempt failed.',
      ),
    ).toHaveClass("df-danger-message");
    expect(screen.queryByText("Current setup saved as a local profile.")).not.toBeInTheDocument();
  });

  it("keeps a manual event runtime change and editor behavior after retryable persistence failure", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });

    render(
      <ExampleScheduleApp
        getGeneratedAt={() => "2026-05-03T13:00:00-05:00"}
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: /^Monday, May 4, 2026/ }));
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Runtime Appointment" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Event" }));

    await waitFor(() => {
      expect(screen.getAllByText("Runtime Appointment").length).toBeGreaterThan(0);
    });
    expect(
      screen.getByText("Event change applied for this session, but it could not be saved locally."),
    ).toHaveClass("df-danger-message");
    expect(
      screen.getByText("Active setup is available for this session, but the durable save failed."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Day Details" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Retry active setup durability" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("heading", { name: "Day Details" })).not.toBeInTheDocument();
    expect(
      screen.getByText("Active setup is available for this session, but the durable save failed."),
    ).toBeInTheDocument();

    setItem.mockRestore();
  });

  it("retains profile delete and load runtime transitions while classifying durability", () => {
    const store = createReadyDayFrameTestStore();
    store.saveProfile({ name: "Runtime Profile", savedAt: "2026-05-05T10:00:00-05:00" });
    const loadProfile = store.loadProfile;
    const deleteProfile = store.deleteProfile;
    const workflowStore = {
      ...store,
      loadProfile: (...args: Parameters<typeof loadProfile>) => ({
        ...loadProfile(...args),
        persistence: { status: "unavailable" } as const,
      }),
      deleteProfile: (...args: Parameters<typeof deleteProfile>) => ({
        ...deleteProfile(...args),
        persistence: { status: "storageFailure" } as const,
      }),
    };

    render(<DayFrameApp store={workflowStore} />);
    fireEvent.click(screen.getByRole("button", { name: "Load Profile" }));
    expect(
      screen.getByText(
        'Profile "Runtime Profile" is loaded for this session, but local storage is unavailable.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete Profile" }));
    expect(store.getState().savedProfiles).toHaveLength(0);
    expect(
      screen.getByText(
        'Profile "Runtime Profile" is removed for this session, but the local storage attempt failed.',
      ),
    ).toBeInTheDocument();
  });

  it("keeps a valid backup import in runtime while reflecting recovery-required semantics", async () => {
    const store = createReadyDayFrameTestStore();
    const importBackup = store.importBackup;
    const workflowStore = {
      ...store,
      importBackup: (...args: Parameters<typeof importBackup>) => ({
        ...importBackup(...args),
        persistence: { status: "serializationFailure" } as const,
      }),
      importBackupFile: async (value: unknown) => ({
        ...importBackup(value),
        persistence: { status: "serializationFailure" } as const,
      }),
    };
    const backup = createDayFrameBackup(
      {
        schedulingPreferences: { dayBoundaryStartTime: "04:00", weekStartsOn: "monday" },
        previewRange: {
          preset: "custom",
          startDate: "2026-05-08",
          endDate: "2026-05-12",
        },
        manualEvents: [],
        shiftDefinitions: [],
        shiftCycles: [],
        blockTemplates: [],
        blockRecurrences: [],
      },
      "2026-05-05T10:00:00-05:00",
    );

    render(<DayFrameApp store={workflowStore} />);
    fireEvent.change(screen.getByLabelText("Import Setup Backup File"), {
      target: {
        files: [
          new File([JSON.stringify(backup)], "dayframe-backup.json", {
            type: "application/json",
          }),
        ],
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Backup applied for this session, but it could not be prepared for local storage.",
        ),
      ).toBeInTheDocument();
    });
    expect(store.getState().schedulingPreferences.weekStartsOn).toBe("monday");
    expect(screen.queryByText("DayFrame setup backup imported.")).not.toBeInTheDocument();
  });

  it.each([
    [
      "partiallyCleared",
      { status: "removed" },
      { status: "storageFailure" },
      "saved profiles (storage failure)",
    ],
    [
      "notCleared",
      { status: "unavailable" },
      { status: "storageFailure" },
      "active setup (storage unavailable) and saved profiles (storage failure)",
    ],
  ] as const)(
    "retains structured %s clear semantics after the runtime reset",
    async (durability, activeState, profiles, unresolvedText) => {
      const store = createReadyDayFrameTestStore({
        schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" },
      });
      const clearLocalData = store.clearLocalData;
      const workflowStore = {
        ...store,
        clearLocalData: async () => {
          const result = await clearLocalData();
          return {
            ...result,
            activeState,
            profiles,
            durability,
            status: durability === "notCleared" ? ("failed" as const) : durability,
            authorities: { ...result.authorities, active: activeState, profiles },
          };
        },
      };

      render(<DayFrameApp store={workflowStore} />);
      fireEvent.click(screen.getByRole("button", { name: "Clear Local Data" }));
      fireEvent.click(screen.getByRole("button", { name: "Confirm Clear Local Data" }));

      await waitFor(() =>
        expect(
          screen.getByText(
            `Local data cleared for this session, but local removal is incomplete for ${unresolvedText}.`,
          ),
        ).toHaveClass("df-danger-message"),
      );
      expect(store.getState().schedulingPreferences.weekStartsOn).toBe("saturday");
      expect(
        screen.queryByText("Local DayFrame setup data cleared from this device."),
      ).not.toBeInTheDocument();
    },
  );

  it("suppresses persistent durability awareness for initial unknown and durable surfaces", () => {
    const unknownStore = createReadyDayFrameTestStore();
    const { rerender } = render(<DayFrameApp store={unknownStore} />);

    expect(
      screen.queryByRole("region", { name: "Some changes are not durably saved" }),
    ).not.toBeInTheDocument();

    const durableStore = createReadyDayFrameTestStore();
    durableStore.setSchedulingPreferences({ weekStartsOn: "monday" });
    durableStore.saveProfile({ name: "Durable", savedAt: "2026-05-05T10:00:00-05:00" });
    rerender(<DayFrameApp store={durableStore} />);

    expect(
      screen.queryByRole("region", { name: "Some changes are not durably saved" }),
    ).not.toBeInTheDocument();
  });

  it("shows active storage failure persistently beside immediate feedback and clears on ordinary convergence", () => {
    const store = createReadyDayFrameTestStore();
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });

    render(<DayFrameApp store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(
      screen.getByText("Setup applied for this session, but it could not be saved locally."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Active setup is available for this session, but the durable save failed."),
    ).toBeInTheDocument();

    setItem.mockRestore();
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(
      screen.queryByRole("region", { name: "Some changes are not durably saved" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Setup saved.")).toBeInTheDocument();
  });

  it("keeps active durability awareness across workflow navigation", () => {
    const store = createReadyDayFrameTestStore();
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });

    render(<DayFrameApp store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(
      screen.getByText("Active setup is available for this session, but the durable save failed."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Retry active setup durability" }),
    ).toBeInTheDocument();

    setItem.mockRestore();
  });

  it("shows profile failure independently and clears it after ordinary profile convergence", () => {
    const store = createReadyDayFrameTestStore();
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });

    render(<DayFrameApp store={store} />);
    fireEvent.change(screen.getByLabelText("Profile Name"), {
      target: { value: "First Profile" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Current Setup as Profile" }));

    expect(
      screen.getByText(
        "Saved profiles are available for this session, but the durable save failed.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Active setup is available for this session, but the durable save failed.",
      ),
    ).not.toBeInTheDocument();

    setItem.mockRestore();
    fireEvent.change(screen.getByLabelText("Profile Name"), {
      target: { value: "Second Profile" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Current Setup as Profile" }));

    expect(
      screen.queryByRole("region", { name: "Some changes are not durably saved" }),
    ).not.toBeInTheDocument();
  });

  it("represents both surfaces and suppresses mixed unknown or durable surfaces", () => {
    const store = createReadyDayFrameTestStore();
    const combinedStore = {
      ...store,
      getDurabilityStatus: () => ({
        activeState: "unavailable" as const,
        profiles: "serializationFailure" as const,
      }),
    };

    const { rerender } = render(<DayFrameApp store={combinedStore} />);

    expect(
      screen.getByText(
        "Active setup is available for this session, but local storage is unavailable.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Saved-profile changes are still available in this session, but they are not durably saved and ordinary Retry is unavailable. Reloading or closing DayFrame may discard these session changes; an older saved profile list may return.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Retry active setup durability" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Retry saved profiles durability" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/snapshot|absent/i)).not.toBeInTheDocument();

    rerender(
      <DayFrameApp
        store={{
          ...store,
          getDurabilityStatus: () => ({
            activeState: "unknown" as const,
            profiles: "storageFailure" as const,
          }),
        }}
      />,
    );
    expect(
      screen.queryByText(/Active setup is available for this session/),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Saved profiles are available for this session/)).toBeInTheDocument();

    rerender(
      <DayFrameApp
        store={{
          ...store,
          getDurabilityStatus: () => ({
            activeState: "durable" as const,
            profiles: "unavailable" as const,
          }),
        }}
      />,
    );
    expect(
      screen.queryByText(/Active setup is available for this session/),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Saved profiles are available for this session, but local storage is unavailable.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry saved profiles durability" })).toBeEnabled();
  });

  it("shows active recovery-required awareness without implying an action", () => {
    const store = createReadyDayFrameTestStore();

    render(
      <DayFrameApp
        store={{
          ...store,
          getDurabilityStatus: () => ({
            activeState: "serializationFailure",
            profiles: "durable",
          }),
        }}
      />,
    );

    expect(
      screen.getByText(
        "Active setup changes are still available in this session, but they are not durably saved and ordinary Retry is unavailable. Reloading or closing DayFrame may discard these session changes; an older saved setup may return.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /retry|recover/i })).not.toBeInTheDocument();
  });

  it("communicates both active and profile recovery-required session risks distinctly", () => {
    const baseStore = createReadyDayFrameTestStore();

    render(
      <DayFrameApp
        store={{
          ...baseStore,
          getDurabilityStatus: () => ({
            activeState: "serializationFailure",
            profiles: "serializationFailure",
          }),
        }}
      />,
    );

    const region = screen.getByRole("region", { name: "Some changes are not durably saved" });
    expect(
      within(region).getByText(
        "Active setup changes are still available in this session, but they are not durably saved and ordinary Retry is unavailable. Reloading or closing DayFrame may discard these session changes; an older saved setup may return.",
      ),
    ).toBeInTheDocument();
    expect(
      within(region).getByText(
        "Saved-profile changes are still available in this session, but they are not durably saved and ordinary Retry is unavailable. Reloading or closing DayFrame may discard these session changes; an older saved profile list may return.",
      ),
    ).toBeInTheDocument();
    expect(within(region).queryByRole("button")).not.toBeInTheDocument();
    expect(within(region).queryByRole("link")).not.toBeInTheDocument();
  });

  it("keeps recovery-required session-risk communication across in-app navigation", () => {
    const baseStore = createReadyDayFrameTestStore();
    const store = {
      ...baseStore,
      getDurabilityStatus: () => ({
        activeState: "serializationFailure" as const,
        profiles: "durable" as const,
      }),
      subscribeDurability: () => () => undefined,
    };

    render(<DayFrameApp store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));

    expect(
      screen.getByText(/Reloading or closing DayFrame may discard these session changes/),
    ).toBeInTheDocument();
  });

  it("clears recovery-required session-risk communication after natural convergence", () => {
    const baseStore = createReadyDayFrameTestStore();
    let status: StoreDurabilityStatus = {
      activeState: "serializationFailure",
      profiles: "durable",
    };
    const durabilityListeners = new Set<(nextStatus: StoreDurabilityStatus) => void>();
    const commitAuthoredSetupTransaction = baseStore.commitAuthoredSetupTransaction;
    const store = {
      ...baseStore,
      getDurabilityStatus: () => ({ ...status }),
      subscribeDurability: (listener: (nextStatus: StoreDurabilityStatus) => void) => {
        durabilityListeners.add(listener);
        return () => durabilityListeners.delete(listener);
      },
      commitAuthoredSetupTransaction: (
        ...args: Parameters<typeof commitAuthoredSetupTransaction>
      ) => {
        const result = commitAuthoredSetupTransaction(...args);
        status = { ...status, activeState: "durable" };
        for (const listener of durabilityListeners) {
          listener({ ...status });
        }
        return result;
      },
    };

    render(<DayFrameApp store={store} />);
    expect(screen.getByText(/Reloading or closing DayFrame/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save Setup" }));

    expect(
      screen.queryByRole("region", { name: "Some changes are not durably saved" }),
    ).not.toBeInTheDocument();
  });

  it("retries active durability explicitly without replaying a workflow or notifying state subscribers", () => {
    const store = createReadyDayFrameTestStore();
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });
    store.setSchedulingPreferences({ weekStartsOn: "monday" });
    setItem.mockRestore();
    const retryActivePersistence = vi.spyOn(store, "retryActivePersistence");
    const commitAuthoredSetupTransaction = vi.spyOn(store, "commitAuthoredSetupTransaction");
    const stateListener = vi.fn();
    store.subscribe(stateListener);

    render(<DayFrameApp store={store} />);
    expect(screen.getByText(/Active setup is available for this session/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry active setup durability" }));

    expect(
      screen.queryByRole("region", { name: "Some changes are not durably saved" }),
    ).not.toBeInTheDocument();
    expect(retryActivePersistence).toHaveBeenCalledTimes(1);
    expect(commitAuthoredSetupTransaction).not.toHaveBeenCalled();
    expect(stateListener).not.toHaveBeenCalled();
  });

  it("updates a retry failure from storage failure to unavailable", () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    const store = createReadyDayFrameTestStore();
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });
    store.setSchedulingPreferences({ weekStartsOn: "monday" });
    setItem.mockRestore();

    render(<DayFrameApp store={store} />);
    expect(screen.getByText(/the durable save failed/)).toBeInTheDocument();

    delete (globalThis as { localStorage?: unknown }).localStorage;
    fireEvent.click(screen.getByRole("button", { name: "Retry active setup durability" }));

    if (originalDescriptor) {
      Object.defineProperty(globalThis, "localStorage", originalDescriptor);
    }

    expect(screen.getByText(/local storage is unavailable/)).toBeInTheDocument();
    expect(screen.queryByText(/the durable save failed/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Retry active setup durability" }),
    ).toBeInTheDocument();
  });

  it("retries profile snapshot durability through the profile store API", () => {
    const store = createReadyDayFrameTestStore();
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });
    store.saveProfile({ name: "Retry Profile", savedAt: "2026-05-05T10:00:00-05:00" });
    setItem.mockRestore();
    const retryProfilePersistence = vi.spyOn(store, "retryProfilePersistence");
    const saveProfile = vi.spyOn(store, "saveProfile");

    render(<DayFrameApp store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry saved profiles durability" }));

    expect(retryProfilePersistence).toHaveBeenCalledTimes(1);
    expect(saveProfile).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("region", { name: "Some changes are not durably saved" }),
    ).not.toBeInTheDocument();
  });

  it("keeps surface retries independent when both surfaces fail", () => {
    const store = createReadyDayFrameTestStore();
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });
    store.setSchedulingPreferences({ weekStartsOn: "monday" });
    store.saveProfile({ name: "Failed Profile", savedAt: "2026-05-05T10:00:00-05:00" });
    setItem.mockRestore();
    const retryActivePersistence = vi.spyOn(store, "retryActivePersistence");
    const retryProfilePersistence = vi.spyOn(store, "retryProfilePersistence");

    render(<DayFrameApp store={store} />);
    expect(screen.getByRole("button", { name: "Retry active setup durability" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Retry saved profiles durability" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Retry active setup durability" }));

    expect(retryActivePersistence).toHaveBeenCalledTimes(1);
    expect(retryProfilePersistence).not.toHaveBeenCalled();
    expect(
      screen.queryByText(/Active setup is available for this session/),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Saved profiles are available for this session/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry saved profiles durability" })).toBeEnabled();
  });

  it.each([
    ["active", DAYFRAME_STORAGE_KEY, "Retry active setup durability"],
    ["profiles", DAYFRAME_PROFILES_STORAGE_KEY, "Retry saved profiles durability"],
  ] as const)(
    "retries a partial-clear %s removal without replaying clear",
    async (failedSurface, failedKey, retryName) => {
      const store = createReadyDayFrameTestStore();
      const originalRemoveItem = Storage.prototype.removeItem;
      const removeItem = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(function (
        this: Storage,
        key: string,
      ) {
        if (key === failedKey) {
          throw new DOMException("Storage removal failed.");
        }
        originalRemoveItem.call(this, key);
      });
      const clearLocalData = vi.spyOn(store, "clearLocalData");
      await store.clearLocalData();
      removeItem.mockRestore();
      const retryMethod =
        failedSurface === "active"
          ? vi.spyOn(store, "retryActivePersistence")
          : vi.spyOn(store, "retryProfilePersistence");

      render(<DayFrameApp store={store} />);
      fireEvent.click(screen.getByRole("button", { name: retryName }));

      expect(retryMethod).toHaveBeenCalledTimes(1);
      expect(clearLocalData).toHaveBeenCalledTimes(1);
      expect(
        screen.queryByRole("region", { name: "Some changes are not durably saved" }),
      ).not.toBeInTheDocument();
    },
  );

  it("performs one attempt for one failed Retry activation and leaves Retry available", () => {
    const store = createReadyDayFrameTestStore();
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });
    store.setSchedulingPreferences({ weekStartsOn: "monday" });
    const retryActivePersistence = vi.spyOn(store, "retryActivePersistence");
    const attemptsBeforeClick = setItem.mock.calls.length;

    render(<DayFrameApp store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry active setup durability" }));

    expect(retryActivePersistence).toHaveBeenCalledTimes(1);
    expect(setItem.mock.calls.length - attemptsBeforeClick).toBe(1);
    expect(screen.getByRole("button", { name: "Retry active setup durability" })).toBeEnabled();

    setItem.mockRestore();
  });

  it("transitions Retry to recovery-required awareness when retry classification requires it", () => {
    const baseStore = createReadyDayFrameTestStore();
    let status: StoreDurabilityStatus = {
      activeState: "storageFailure",
      profiles: "durable",
    };
    const durabilityListeners = new Set<(nextStatus: StoreDurabilityStatus) => void>();
    const retryActivePersistence = vi.fn(() => {
      status = { activeState: "serializationFailure", profiles: "durable" };
      for (const listener of durabilityListeners) {
        listener(status);
      }
      return { status: "notAttempted", reason: "serializationFailure" } as const;
    });
    const store = {
      ...baseStore,
      getDurabilityStatus: () => ({ ...status }),
      retryActivePersistence,
      subscribeDurability: (listener: (nextStatus: StoreDurabilityStatus) => void) => {
        durabilityListeners.add(listener);
        return () => durabilityListeners.delete(listener);
      },
    };

    render(<DayFrameApp store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry active setup durability" }));

    expect(retryActivePersistence).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/ordinary Retry is unavailable/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Retry active setup durability" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /recover/i })).not.toBeInTheDocument();
  });

  it("cleans up durability subscriptions and follows a replacement store", () => {
    const firstStore = createReadyDayFrameTestStore();
    const secondStore = createReadyDayFrameTestStore();
    const firstUnsubscribe = vi.fn();
    const firstSubscribe = firstStore.subscribeDurability;
    vi.spyOn(firstStore, "subscribeDurability").mockImplementation((listener) => {
      const unsubscribe = firstSubscribe(listener);
      return () => {
        firstUnsubscribe();
        unsubscribe();
      };
    });
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage write failed.");
    });
    firstStore.setSchedulingPreferences({ weekStartsOn: "monday" });
    setItem.mockRestore();
    const { rerender, unmount } = render(<DayFrameApp store={firstStore} />);

    expect(screen.getByText(/Active setup is available for this session/)).toBeInTheDocument();
    rerender(<DayFrameApp store={secondStore} />);
    expect(firstUnsubscribe).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("region", { name: "Some changes are not durably saved" }),
    ).not.toBeInTheDocument();

    unmount();
  });

  it("opens historical intelligence as a bounded top-level Summary destination", async () => {
    render(<DayFrameApp getNow={() => new Date("2026-08-22T17:00:00.000Z")} />);

    fireEvent.click(screen.getByRole("button", { name: "Summary" }));

    expect(screen.getByRole("button", { name: "Summary" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Review your history" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "History" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Preview" })).not.toBeInTheDocument();
  });

  it("uses one accessible Planner, Today, and Summary navigation state", async () => {
    render(<DayFrameApp getNow={() => new Date("2026-08-22T17:00:00.000Z")} />);
    const navigation = screen.getByRole("navigation", { name: "App Sections" });
    const planner = within(navigation).getByRole("button", { name: "Planner" });
    const today = within(navigation).getByRole("button", { name: "Today" });
    const summary = within(navigation).getByRole("button", { name: "Summary" });

    expect(planner).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { level: 1, name: "Planner" })).toBeInTheDocument();
    fireEvent.click(today);
    expect(today).toHaveAttribute("aria-pressed", "true");
    expect(planner).toHaveAttribute("aria-pressed", "false");
    expect(await screen.findByRole("heading", { level: 1, name: "Today" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Report outcome" })).not.toBeInTheDocument();
    fireEvent.click(summary);
    expect(summary).toHaveAttribute("aria-pressed", "true");
    expect(await screen.findByRole("heading", { name: "History" })).toBeInTheDocument();
    fireEvent.click(planner);
    expect(planner).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { level: 1, name: "Planner" })).toBeInTheDocument();
  });

  it("preserves the app-owned Setup draft through Today without an implicit write", () => {
    const store = createReadyDayFrameTestStore();
    const commit = vi.spyOn(store, "commitAuthoredSetupTransaction");
    render(<DayFrameApp store={store} />);

    fireEvent.change(screen.getByLabelText("Day Boundary Start Time"), {
      target: { value: "04:30" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(commit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Planner" }));
    expect(screen.getByLabelText("Day Boundary Start Time")).toHaveValue("04:30");
    expect(commit).not.toHaveBeenCalled();
  });

  it("separates destination navigation from explicit Preview generation", async () => {
    const store = createExampleScheduleStore();
    const generate = vi.spyOn(store, "generatePreview");
    render(<DayFrameApp getNow={() => new Date("2026-08-22T17:00:00.000Z")} store={store} />);

    const navigation = screen.getByRole("navigation", { name: "App Sections" });
    expect(within(navigation).getByRole("button", { name: "Planner" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(navigation).queryByRole("button", { name: "Setup" })).not.toBeInTheDocument();
    expect(within(navigation).queryByRole("button", { name: "Preview" })).not.toBeInTheDocument();
    const modes = screen.getByRole("navigation", { name: "Planner modes" });
    expect(within(modes).getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      within(navigation).queryByRole("button", { name: "Generate Schedule" }),
    ).not.toBeInTheDocument();

    fireEvent.click(within(modes).getByRole("button", { name: "Review Schedule" }));
    expect(generate).not.toHaveBeenCalled();
    expect(within(modes).getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Generate Schedule" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Report a past planned occurrence" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Report history" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /report outcome/i })).not.toBeInTheDocument();

    fireEvent.click(within(navigation).getByRole("button", { name: "Summary" }));
    expect(generate).not.toHaveBeenCalled();
    fireEvent.click(within(navigation).getByRole("button", { name: "Planner" }));
    const returnedModes = screen.getByRole("navigation", { name: "Planner modes" });
    fireEvent.click(within(returnedModes).getByRole("button", { name: "Plan" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    expect(generate).toHaveBeenCalledTimes(1);
    expect(within(returnedModes).getByRole("button", { name: "Review Schedule" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("preserves one dirty draft across Planner modes and Summary without implicit writes", async () => {
    const store = createReadyDayFrameTestStore();
    const commit = vi.spyOn(store, "commitAuthoredSetupTransaction");
    const generate = vi.spyOn(store, "generatePreview");
    render(<DayFrameApp getNow={() => new Date("2026-08-22T17:00:00.000Z")} store={store} />);

    fireEvent.change(screen.getByLabelText("Day Boundary Start Time"), {
      target: { value: "04:30" },
    });
    expect(
      screen.getByText(
        "Plan has unsaved changes. Schedule actions continue to use the saved plan.",
      ),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Review Schedule" }));
    expect(generate).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Review Schedule" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Summary" }));
    await screen.findByRole("heading", { name: "History" });
    fireEvent.click(screen.getByRole("button", { name: "Planner" }));
    expect(screen.getByLabelText("Day Boundary Start Time")).toHaveValue("04:30");
    expect(commit).not.toHaveBeenCalled();
    expect(generate).not.toHaveBeenCalled();
  });

  it("regenerates Schedule from saved Active without consuming the dirty Plan draft", () => {
    const store = createExampleScheduleStore();
    render(<DayFrameApp getGeneratedAt={() => "2026-08-22T17:00:00.000Z"} store={store} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: "Plan" }));
    const savedName = store.getState().shiftDefinitions[0]!.name;
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Unsaved Shift Name" } });
    fireEvent.click(screen.getByRole("button", { name: "Review Schedule" }));
    fireEvent.click(screen.getByRole("button", { name: "Refresh Schedule" }));
    expect(store.getState().shiftDefinitions[0]!.name).toBe(savedName);
    fireEvent.click(screen.getByRole("button", { name: "Plan" }));
    expect(screen.getByLabelText("Name")).toHaveValue("Unsaved Shift Name");
  });

  it("reviews one selected canonical user-day without execution outcome controls", () => {
    render(<ExampleScheduleApp getGeneratedAt={() => "2026-05-03T13:00:00-05:00"} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate Schedule" }));
    const day = screen.getByLabelText("Review one user-day");
    const lastDay = day.getAttribute("max")!;
    fireEvent.change(day, { target: { value: lastDay } });
    expect(day).toHaveValue(lastDay);
    expect(screen.getAllByRole("heading", { name: "Day Visualizer" })).toHaveLength(1);
    expect(screen.queryByRole("button", { name: /report outcome/i })).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/reported completed|reported skipped|capacity/i);
  });
});
