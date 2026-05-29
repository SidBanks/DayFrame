/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { SuggestedFix } from "../../core/friction/types.js";
import type { DayFramePreview, DayFrameState } from "../../state/types.js";
import { PreviewScreenContainer, type PreviewScreenStore } from "../PreviewScreenContainer.js";

afterEach(() => {
  cleanup();
});

describe("PreviewScreenContainer", () => {
  it("renders the current preview from the store", () => {
    const store = createPreviewScreenStore({
      preview: buildPreview(),
    });

    render(
      <PreviewScreenContainer getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)} store={store} />,
    );

    expect(screen.getByText("Generated")).toBeInTheDocument();
    expect(screen.getByText("Today at 1:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Workout conflicts with Work")).toBeInTheDocument();
  });

  it("refreshes when the store publishes a new preview state", () => {
    const store = createPreviewScreenStore({
      preview: null,
    });

    render(
      <PreviewScreenContainer getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)} store={store} />,
    );

    expect(screen.getByText("No preview generated yet.")).toBeInTheDocument();

    act(() => {
      store.setPreview(buildPreview());
    });

    expect(screen.getByText("Generated")).toBeInTheDocument();
    expect(screen.getByText("Today at 1:00 PM")).toBeInTheDocument();
  });

  it("applies a selected suggested fix through the store with a revision timestamp", () => {
    const applySuggestedFixToPreview = vi.fn();
    const store = createPreviewScreenStore(
      {
        preview: buildPreview(),
      },
      applySuggestedFixToPreview,
    );

    render(
      <PreviewScreenContainer
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        getRevisedAt={() => "2026-05-03T15:00:00-05:00"}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Move block" }));

    expect(applySuggestedFixToPreview).toHaveBeenCalledTimes(1);
    expect(applySuggestedFixToPreview).toHaveBeenCalledWith({
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_move_scheduled_workout",
      revisedAt: "2026-05-03T15:00:00-05:00",
    });
  });

  it("wires every preview friction action through the store", () => {
    const applySuggestedFixToPreview = vi.fn();
    const store = createPreviewScreenStore(
      {
        preview: buildPreview([
          {
            id: "fix_move_scheduled_workout",
            label: "Move block",
            action: "moveBlock",
          },
          {
            id: "fix_reduce_scheduled_workout",
            label: "Reduce duration",
            action: "reduceDuration",
          },
          {
            id: "fix_convert_scheduled_workout",
            label: "Convert to recovery",
            action: "convertToRecovery",
          },
          {
            id: "fix_change_fixed_time_scheduled_workout",
            label: "Review fixed time",
            action: "changeFixedTime",
          },
          {
            id: "fix_accept_work_shift_day_2026-05-05_scheduled_workout",
            label: "Accept conflict",
            action: "acceptConflict",
          },
        ]),
      },
      applySuggestedFixToPreview,
    );

    render(
      <PreviewScreenContainer
        getNow={() => new Date(2026, 4, 3, 16, 0, 0, 0)}
        getRevisedAt={() => "2026-05-03T15:00:00-05:00"}
        store={store}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Move block" }));
    fireEvent.click(screen.getByRole("button", { name: "Reduce duration" }));
    fireEvent.click(screen.getByRole("button", { name: "Convert to recovery" }));
    fireEvent.click(screen.getByRole("button", { name: "Review fixed time" }));
    fireEvent.click(screen.getByRole("button", { name: "Accept conflict" }));

    expect(applySuggestedFixToPreview).toHaveBeenCalledTimes(5);
    expect(applySuggestedFixToPreview).toHaveBeenNthCalledWith(1, {
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_move_scheduled_workout",
      revisedAt: "2026-05-03T15:00:00-05:00",
    });
    expect(applySuggestedFixToPreview).toHaveBeenNthCalledWith(2, {
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_reduce_scheduled_workout",
      revisedAt: "2026-05-03T15:00:00-05:00",
    });
    expect(applySuggestedFixToPreview).toHaveBeenNthCalledWith(3, {
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_convert_scheduled_workout",
      revisedAt: "2026-05-03T15:00:00-05:00",
    });
    expect(applySuggestedFixToPreview).toHaveBeenNthCalledWith(4, {
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_change_fixed_time_scheduled_workout",
      revisedAt: "2026-05-03T15:00:00-05:00",
    });
    expect(applySuggestedFixToPreview).toHaveBeenNthCalledWith(5, {
      selectedFrictionPointId: "friction_conflict_1",
      selectedSuggestedFixId: "fix_accept_work_shift_day_2026-05-05_scheduled_workout",
      revisedAt: "2026-05-03T15:00:00-05:00",
    });
  });
});

function createPreviewScreenStore(
  partialState: Partial<DayFrameState>,
  applySuggestedFixToPreview = vi.fn(),
): PreviewScreenStore & { setPreview: (preview: DayFramePreview | null) => void } {
  let state = buildState(partialState);
  const listeners = new Set<(state: DayFrameState) => void>();

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    applySuggestedFixToPreview,
    setPreview: (preview) => {
      state = {
        ...state,
        preview,
      };

      for (const listener of listeners) {
        listener(state);
      }
    },
  };
}

function buildState(partialState: Partial<DayFrameState>): DayFrameState {
  return {
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
    shiftCycle: null,
    blockTemplates: [],
    blockRecurrences: [],
    savedProfiles: [],
    preview: null,
    ...partialState,
  };
}

function buildPreview(suggestedFixes: SuggestedFix[] = [buildSuggestedFix()]): DayFramePreview {
  return {
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
          id: "scheduled_workout",
          userId: "user_001",
          templateId: "template_workout",
          source: "template",
          title: "Workout",
          category: "fitness",
          startsAt: new Date(2026, 4, 5, 14, 15, 0, 0),
          endsAt: new Date(2026, 4, 5, 15, 15, 0, 0),
          userDayDate: "2026-05-05",
          userWeekStartDate: "2026-05-02",
          priority: 2,
          status: "planned",
          externalResources: [],
        },
      ],
      unplacedCandidates: [
        {
          id: "candidate_review",
          userId: "user_001",
          templateId: "template_review",
          recurrenceId: "rec_review",
          recurrenceFrequency: "specificWeekdays",
          title: "Schedule Review",
          category: "review",
          placementType: "flexible",
          durationMinutes: 60,
          priority: 2,
          preferredWindow: "beforeWork",
          rescheduleBehavior: "autoSameUserWeek",
          externalResources: [],
          userDayDate: "2026-05-05",
          userWeekStartDate: "2026-05-02",
        },
      ],
      frictionPoints: [
        {
          id: "friction_conflict_1",
          userId: "user_001",
          severity: "warning",
          title: "Workout conflicts with Work",
          message: "Workout overlaps work and needs review.",
          affectedBlockIds: ["scheduled_workout", "work_shift_day_2026-05-05"],
          affectedUserDayDate: "2026-05-05",
          affectedUserWeekStartDate: "2026-05-02",
          suggestedFixes,
          canIgnore: true,
          ignored: false,
          resolved: false,
          createdAt: "2026-05-03T13:00:00-05:00",
          updatedAt: "2026-05-03T14:00:00-05:00",
        },
      ],
    },
    rangeStartDate: "2026-05-05",
    rangeEndDate: "2026-05-06",
    planningWindowStart: new Date(2026, 4, 5, 0, 0, 0, 0),
    planningWindowEnd: new Date(2026, 4, 6, 0, 0, 0, 0),
    generatedAt: "2026-05-03T13:00:00-05:00",
    revisedAt: "2026-05-03T14:00:00-05:00",
    isStale: false,
  };
}

function buildSuggestedFix(): SuggestedFix {
  return {
    id: "fix_move_scheduled_workout",
    label: "Move block",
    action: "moveBlock",
  };
}
