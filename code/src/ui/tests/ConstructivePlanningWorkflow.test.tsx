/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DayFrameApp } from "../DayFrameApp.js";
import { createDayFrameStore } from "../../state/dayFrameStore.js";
import type { DayFrameStore, CommitAuthoredSetupInput } from "../../state/types.js";
import {
  createDayFrameDurableDb,
  REALIZATION_AUTHORITY_STORE,
} from "../../infrastructure/storage/dayFrameDurableDb.js";
import type { IndexedDbCollectionStorage } from "../../infrastructure/storage/indexedDbCollectionStorage.js";

const at = "2030-05-06T12:00:00.000Z";
const timestamps = { createdAt: at, updatedAt: at };
function setup(conflict = false): CommitAuthoredSetupInput {
  return {
    previewRange: { preset: "custom", startDate: "2030-05-06", endDate: "2030-05-06" },
    schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" },
    shiftDefinitions: [
      {
        id: "day",
        userId: "user",
        name: "Day Work",
        startTime: "09:00",
        endTime: "17:00",
        crossesMidnight: false,
        workDays: ["monday"],
        ...timestamps,
      },
    ],
    shiftCycles: [
      {
        id: "cycle",
        userId: "user",
        name: "Work cycle",
        type: "fixedSegments",
        startsOnDate: "2030-05-01",
        endsOnDate: "2030-05-31",
        segments: [
          {
            id: "segment",
            shiftCycleId: "cycle",
            shiftDefinitionId: "day",
            startsOnDate: "2030-05-01",
            endsOnDate: "2030-05-31",
          },
        ],
        ...timestamps,
      },
    ],
    blockTemplates: [
      {
        id: "routine",
        userId: "user",
        title: "Routine",
        category: "maintenance",
        placementType: "fixed",
        fixedStartTime: conflict ? "10:00" : "18:00",
        durationMinutes: 30,
        priority: 2,
        preferredWindow: "anyAvailable",
        rescheduleBehavior: "askUser",
        requiresResource: false,
        externalResources: [],
        enabled: true,
        ...timestamps,
      },
    ],
    blockRecurrences: [{ id: "daily", blockTemplateId: "routine", frequency: "daily" }],
  };
}
beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: new IDBFactory() });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
async function mount(
  options: { conflict?: boolean; storage?: IndexedDbCollectionStorage; generate?: boolean } = {},
) {
  const store = createDayFrameStore(
    setup(options.conflict),
    options.storage ? { restoreIndexedDb: options.storage } : {},
  );
  expect(await store.whenReady()).toEqual({ status: "ready" });
  expect(store.commitAuthoredSetup(setup(options.conflict)).status).toBe("applied");
  render(
    <DayFrameApp
      store={store}
      getNow={() => new Date(at)}
      getGeneratedAt={() => at}
      getExportedAt={() => "2030-05-06T18:00:00.000Z"}
    />,
  );
  if (options.generate !== false) {
    fireEvent.click(screen.getByRole("button", { name: "Review Schedule" }));
    fireEvent.click(await screen.findByRole("button", { name: "Generate Schedule" }));
    await waitFor(() => expect(store.getState().preview?.isStale).toBe(false));
  }
  return store;
}
async function authorGoal(
  store: DayFrameStore,
  options: { effortHours?: number; resources?: boolean; title?: string } = {},
) {
  fireEvent.click(screen.getByRole("button", { name: "Goals" }));
  fireEvent.click(await screen.findByRole("button", { name: "Add Goal" }));
  fireEvent.change(screen.getByLabelText("Goal title"), {
    target: { value: options.title ?? "Study Network+" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save Goal" }));
  const planning = await screen.findByRole("region", { name: "Goal planning" });
  expect(within(planning).getByText(/No planning effort/)).toBeVisible();
  if (options.effortHours)
    fireEvent.change(within(planning).getByLabelText("Requested Time hours"), {
      target: { value: options.effortHours },
    });
  fireEvent.change(within(planning).getByLabelText("Goal planning priority"), {
    target: { value: "high" },
  });
  fireEvent.change(within(planning).getByLabelText("Session resources"), {
    target: { value: options.resources ? "resources" : "productiveOnly" },
  });
  if (options.resources) {
    fireEvent.change(
      within(planning).getByLabelText("Follow-up activity after each session minutes"),
      { target: { value: 15 } },
    );
    fireEvent.change(
      within(planning).getByLabelText("Protected time after work and follow-up minutes"),
      { target: { value: 15 } },
    );
  }
  fireEvent.click(within(planning).getByRole("button", { name: "Save Requested Time" }));
  await within(planning).findByText(/Requested Time saved/);
  const goal = store.listGoals().find((g) => g.title === (options.title ?? "Study Network+"))!;
  expect(goal).toBeDefined();
  expect(store.listCurrentGoalDemands(goal.id)).toHaveLength(1);
  expect(
    store
      .exportGoalPlanningAuthority()
      .priorities.some((p) => p.goalId === goal.id && p.level === "high"),
  ).toBe(true);
  const demand = store.listCurrentGoalDemands(goal.id)[0]!;
  expect(store.resolveDemandResourceFootprintAssociation(demand.id).status).toBe("resolved");
  return planning;
}
async function evaluate(planning: HTMLElement) {
  fireEvent.click(within(planning).getByRole("button", { name: "Evaluate planning opportunity" }));
  return within(planning).findByRole("region", { name: "Planning result" });
}
async function openDecision(planning: HTMLElement) {
  fireEvent.click(within(planning).getByRole("button", { name: "Review Schedule" }));
  return screen.findByRole("button", { name: "Accept preferred option" });
}
function expectUnaccepted(store: DayFrameStore) {
  expect(store.exportProposalAuthority().acceptedAllocations).toHaveLength(0);
  expect(store.exportRealizationAuthority().realizations).toHaveLength(0);
  expect(store.listRealizedScheduleFacts()).toHaveLength(0);
}
describe("ordinary constructive product workflow", () => {
  it("authors a fresh Goal, evaluates, explicitly accepts, realizes all roles, reviews and publishes", async () => {
    const store = await mount();
    const before = store.getState().preview;
    const planning = await authorGoal(store, { resources: true });
    expect(store.getState().preview).toEqual(before);
    const result = await evaluate(planning);
    expect(await within(result).findByText(/Proposal saved for review/)).toBeVisible();
    expect(within(result).getByText(/This effort can fit/)).toBeVisible();
    expect(store.listActionableProposals()).toHaveLength(1);
    expectUnaccepted(store);
    expect((await store.getHistoricalPlanDay("2030-05-06", "2031-01-01T00:00:00Z")).status).toBe(
      "unavailableNoPublication",
    );
    const accept = await openDecision(planning);
    fireEvent.click(accept);
    await waitFor(() =>
      expect(
        store.exportRealizationAuthority().realizations,
        document.querySelector(".df-schedule-review-summary")?.textContent,
      ).toHaveLength(1),
    );
    expect(store.exportProposalAuthority().acceptedAllocations).toHaveLength(1);
    expect(
      store
        .listRealizedScheduleFacts()
        .map((f) => f.scheduleRole)
        .sort(),
    ).toEqual(["bufferProtection", "productiveGoalWork", "supportActivity"]);
    expect(
      store.listRealizedScheduleFacts().find((f) => f.scheduleRole === "bufferProtection")
        ?.executionEligibility,
    ).toBe("prohibited");
    expect(
      await screen.findByRole("region", { name: "Scheduled Goal work and resources" }),
    ).toHaveTextContent("Protected Buffer — not an activity");
    expect((await store.getHistoricalPlanDay("2030-05-06", "2031-01-01T00:00:00Z")).status).toBe(
      "unavailableNoPublication",
    );
    fireEvent.click(screen.getByRole("button", { name: "Refresh Schedule" }));
    const publish = await screen.findByRole("button", { name: /^Build this Schedule:/ });
    await waitFor(() => expect(publish).toBeEnabled());
    fireEvent.click(publish);
    await screen.findByText(/Schedule published\. This immutable/);
    const history = await store.getHistoricalPlanDay("2030-05-06", "2031-01-01T00:00:00Z");
    expect(history.status).toBe("available");
    if (history.status === "available")
      expect(
        history.day.occurrences.filter((o) => o.sourceFamily === "acceptedAllocation"),
      ).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Calendar" }));
    fireEvent.click(await screen.findByRole("button", { name: "Calendar" }));
    fireEvent.click(screen.getByRole("button", { name: "Calendar editing tools" }));
    const selectedDay = document.querySelector(".df-month-selected-day")!;
    expect(selectedDay).toHaveTextContent("Goal work");
    expect(selectedDay).toHaveTextContent("Support activity");
    expect(selectedDay).toHaveTextContent("Protected Buffer — not an activity");
  }, 15000);

  it("explains known infeasibility without accepting, realizing, or publishing", async () => {
    const store = await mount();
    const before = store.getState().preview;
    const planning = await authorGoal(store, { effortHours: 24 });
    const result = await evaluate(planning);
    expect(within(result).getByText(/Known usable time/)).toBeVisible();
    expect(within(result).getByText(/cannot currently fit/)).toBeVisible();
    expect(within(result).getByText(/No proposal is available/)).toBeVisible();
    expectUnaccepted(store);
    expect(store.listActionableProposals()).toHaveLength(0);
    expect(store.getState().preview).toEqual(before);
    expect((await store.getHistoricalPlanDay("2030-05-06", "2031-01-01T00:00:00Z")).status).toBe(
      "unavailableNoPublication",
    );
  });

  it("rejects a UI-derived Proposal without creating scheduled or accepted authority", async () => {
    const store = await mount();
    const planning = await authorGoal(store);
    await evaluate(planning);
    await within(planning).findByText(/Proposal saved for review/);
    await openDecision(planning);
    fireEvent.click(screen.getByRole("button", { name: "Reject Proposal" }));
    await waitFor(() => expect(store.listActionableProposals()).toHaveLength(0));
    expect(store.exportProposalAuthority().decisions).toHaveLength(1);
    expectUnaccepted(store);
  });

  it("recomputes current Capacity after boundary edits and beyond the old Preview range", async () => {
    const store = await mount();
    const planning = await authorGoal(store);
    act(() => {
      store.setSchedulingPreferences({
        ...store.getState().schedulingPreferences,
        dayBoundaryStartTime: "04:00",
      });
    });
    await evaluate(planning);
    expect(within(planning).getByText(/Known usable time/)).toBeVisible();
    expect(within(planning).getByText(/This effort can fit/)).toBeVisible();
    expectUnaccepted(store);
    fireEvent.change(within(planning).getByLabelText("Plan through"), {
      target: { value: "2030-05-07" },
    });
    fireEvent.click(within(planning).getByRole("button", { name: "Save Requested Time" }));
    await within(planning).findByText(/Requested Time saved/);
    fireEvent.click(
      within(planning).getByRole("button", { name: "Evaluate planning opportunity" }),
    );
    expect(await within(planning).findByText(/This effort can fit/)).toBeVisible();
    expect(store.listActionableProposals().length).toBeGreaterThan(0);
    expectUnaccepted(store);
  });

  it("offers explicitly permitted partial effort with unmet effort visible", async () => {
    const store = await mount();
    const planning = await authorGoal(store, { effortHours: 24 });
    fireEvent.change(within(planning).getByLabelText("Session arrangement"), {
      target: { value: "split" },
    });
    fireEvent.click(within(planning).getByLabelText("Set maximum session duration"));
    fireEvent.change(within(planning).getByLabelText("Maximum session hours"), {
      target: { value: 8 },
    });
    fireEvent.click(within(planning).getByLabelText("Allow less than the requested effort"));
    fireEvent.click(within(planning).getByRole("button", { name: "Save Requested Time" }));
    await within(planning).findByText(/Requested Time saved/);
    const result = await evaluate(planning);
    expect(within(result).getByText(/Part of this effort can fit/)).toBeVisible();
    expect(within(result).getByText(/Proposal saved for review/)).toBeVisible();
    const option = store.listActionableProposals()[0]!.options.find((o) => o.preferred)!;
    expect(option.assignments[0]!.unmetMinutes).toBeGreaterThan(0);
    expectUnaccepted(store);
  });

  it("requires an explicit footprint and preserves saved resources during a priority edit", async () => {
    const store = await mount();
    const planning = await authorGoal(store, { resources: true });
    const before = store.exportGoalPlanningAuthority();
    fireEvent.change(within(planning).getByLabelText("Goal planning priority"), {
      target: { value: "critical" },
    });
    fireEvent.click(within(planning).getByRole("button", { name: "Save Requested Time" }));
    await within(planning).findByText(/Requested Time saved/);
    expect(store.exportGoalPlanningAuthority().footprintSpecifications).toEqual(
      before.footprintSpecifications,
    );
    expect(store.exportGoalPlanningAuthority().footprintAssociations).toEqual(
      before.footprintAssociations,
    );
    fireEvent.change(within(planning).getByLabelText("Session resources"), {
      target: { value: "" },
    });
    fireEvent.submit(
      within(planning).getByRole("button", { name: "Save Requested Time" }).closest("form")!,
    );
    await within(planning).findByText(/Choose whether this work needs support/);
    expect(
      within(planning).getByRole("button", { name: "Evaluate planning opportunity" }),
    ).toBeDisabled();
    expectUnaccepted(store);
  });

  it("respects an existing hard Goal prerequisite during ordinary evaluation", async () => {
    const store = await mount();
    const prerequisite = await store.createGoal({ title: "Prerequisite" });
    expect(prerequisite.status).toBe("accepted");
    const planning = await authorGoal(store);
    const goal = store.listGoals().find((g) => g.title === "Study Network+")!;
    await act(async () => {
      expect(
        (
          await store.createRelationship({
            kind: "dependsOn",
            sourceGoalId: goal.id,
            target: {
              kind: "goal",
              goalId: store.listGoals().find((g) => g.title === "Prerequisite")!.id,
            },
            semantics: { kind: "dependency", strength: "hard", condition: "goalCompleted" },
          })
        ).status,
      ).toBe("accepted");
    });
    const result = await evaluate(planning);
    expect(within(result).getByText(/A Goal prerequisite prevents/)).toBeVisible();
    expect(within(result).getByText(/No proposal is available/)).toBeVisible();
    expectUnaccepted(store);
  });

  it("does not claim durable intent when storage fails and retries without duplicate Demand", async () => {
    const db = createDayFrameDurableDb();
    let fail = false;
    const storage: IndexedDbCollectionStorage = {
      ...db,
      mutate: async (operations, admit, observe) => {
        if (fail && operations.some((op) => op.store === "goalPlanning"))
          return {
            status: "failure",
            error: { code: "transactionAborted", operation: "planning" },
          };
        return db.mutate(operations, admit, observe);
      },
    };
    const store = await mount({ storage });
    const planning = await authorGoal(store);
    fail = true;
    fireEvent.change(within(planning).getByLabelText("Goal planning priority"), {
      target: { value: "critical" },
    });
    fireEvent.click(within(planning).getByRole("button", { name: "Save Requested Time" }));
    await within(planning).findByText(/accepted for this session but could not be saved/);
    expect(
      within(planning).getByRole("button", { name: "Evaluate planning opportunity" }),
    ).toBeDisabled();
    expect(within(planning).queryByText(/Requested Time saved/)).toBeNull();
    fail = false;
    fireEvent.click(within(planning).getByRole("button", { name: "Save Requested Time" }));
    await within(planning).findByText(/Requested Time saved/);
    expect(store.listCurrentGoalDemands(store.listGoals()[0]!.id)).toHaveLength(1);
    expect(store.getGoalPlanningDurabilityStatus()).toBe("durable");
    expect(
      within(planning).getByRole("button", { name: "Evaluate planning opportunity" }),
    ).toBeEnabled();
  });

  it("derives current Capacity without requiring Preview generation", async () => {
    const store = await mount({ generate: false });
    const planning = await authorGoal(store);
    fireEvent.click(
      within(planning).getByRole("button", { name: "Evaluate planning opportunity" }),
    );
    expect(await within(planning).findByText(/Known usable time/)).toBeVisible();
    expectUnaccepted(store);
  });

  it("revalidates a UI-derived Proposal against changed schedule truth before acceptance", async () => {
    const store = await mount();
    const planning = await authorGoal(store);
    await evaluate(planning);
    await within(planning).findByText(/Proposal saved for review/);
    await openDecision(planning);
    act(() => {
      store.setSchedulingPreferences({
        ...store.getState().schedulingPreferences,
        dayBoundaryStartTime: "04:00",
      });
    });
    const accept = await screen.findByRole("button", { name: "Accept preferred option" });
    fireEvent.click(accept);
    await screen.findByText(/This Proposal is out of date/);
    expectUnaccepted(store);
  });

  it("keeps durable acceptance after an atomic realization failure and retries exactly once through UI", async () => {
    const db = createDayFrameDurableDb();
    let fail = true;
    const storage: IndexedDbCollectionStorage = {
      ...db,
      mutate: async (operations, admit, observe) => {
        if (
          fail &&
          operations.some((op) => op.store === REALIZATION_AUTHORITY_STORE && op.type === "put")
        )
          return {
            status: "failure",
            error: { code: "transactionAborted", operation: "realization" },
          };
        return db.mutate(operations, admit, observe);
      },
    };
    const store = await mount({ storage });
    const planning = await authorGoal(store, { resources: true });
    await evaluate(planning);
    await within(planning).findByText(/Proposal saved for review/);
    fireEvent.click(await openDecision(planning));
    await screen.findByText(/Acceptance is saved, but scheduling has not completed/);
    await waitFor(() => expect(screen.getByText(/Scheduling could not be saved/)).toBeVisible());
    expect(store.exportProposalAuthority().acceptedAllocations).toHaveLength(1);
    expectUnrealized(store);
    const durable = await db.getAll<unknown>("proposalAuthority");
    expect(durable.status).toBe("success");
    if (durable.status === "success")
      expect(
        durable.value.filter(
          (v) => (v as { recordType: string }).recordType === "acceptedAllocation",
        ),
      ).toHaveLength(1);
    fail = false;
    fireEvent.click(await screen.findByRole("button", { name: "Retry scheduling accepted work" }));
    await waitFor(() =>
      expect(
        store.exportRealizationAuthority().realizations,
        document.querySelector(".df-schedule-review-summary")?.textContent,
      ).toHaveLength(1),
    );
    expect(store.exportProposalAuthority().acceptedAllocations).toHaveLength(1);
    expect(store.listRealizedScheduleFacts()).toHaveLength(3);
    const id = store.exportProposalAuthority().acceptedAllocations[0]!.id;
    expect((await store.realizeAcceptedAllocation(id)).status).toBe("alreadyRealized");
    expect(store.exportRealizationAuthority().realizations).toHaveLength(1);
  });

  it("opens a real mounted conflict destination with individual fixes without accepting one", async () => {
    const store = await mount({ conflict: true });
    fireEvent.click(screen.getByRole("button", { name: "Review Schedule" }));
    const resolve = await screen.findByRole("button", { name: "Resolve schedule conflicts" });
    const before = store.getState().preview;
    const choices = store.getPlanDecisions();
    fireEvent.click(resolve);
    const destination = await screen.findByRole("heading", { name: "Schedule details" });
    await waitFor(() => expect(destination).toHaveFocus());
    expect(document.querySelectorAll(".df-fix-button").length).toBeGreaterThan(0);
    expect(store.getPlanDecisions()).toEqual(choices);
    expect(store.getState().preview).toEqual(before);
  });
});
function expectUnrealized(store: DayFrameStore) {
  expect(store.listRealizedScheduleFacts()).toHaveLength(0);
  expect(store.exportRealizationAuthority().realizations).toHaveLength(0);
}

describe("Task 9.9 corrective authority integration", () => {
  it("durably accepts an unplaced move, replays after restart, and never changes realized authority", async () => {
    const { createPlanDecisionAcceptanceCandidate } =
      await import("../../core/decisions/createPlanDecisionAcceptanceCandidate.js");
    const store = await mount();
    const planning = await authorGoal(store, { resources: true });
    await evaluate(planning);
    fireEvent.click(await openDecision(planning));
    await waitFor(() => expect(store.exportRealizationAuthority().realizations).toHaveLength(1));
    const authority = structuredClone(store.exportRealizationAuthority());
    const authored = setup();
    Object.assign(authored.blockTemplates![0]!, {
      placementType: "flexible",
      preferredWindow: "custom",
      customWindowStartTime: "09:00",
      customWindowEndTime: "09:10",
    });
    delete authored.blockTemplates![0]!.fixedStartTime;
    const range = {
      rangeStartDate: "2030-05-06" as const,
      rangeEndDate: "2030-05-06" as const,
      planningWindowStart: new Date(2030, 4, 6, 3),
      planningWindowEnd: new Date(2030, 4, 7, 3),
      generatedAt: at,
    };
    act(() => {
      store.commitAuthoredSetup(authored);
      store.generatePreview(range);
    });
    function tryMove() {
      const original = store.getState().preview!.result;
      const candidate = original.unplacedCandidates.find((c) => c.templateId === "routine")!;
      const point = original.frictionPoints.find((p) => p.affectedBlockIds.includes(candidate.id))!;
      const fix = point.suggestedFixes.find((f) => f.action === "moveBlock")!;
      act(() => {
        store.applySuggestedFixToPreview({
          selectedFrictionPointId: point.id,
          selectedSuggestedFixId: fix.id,
          revisedAt: at,
        });
      });
      const revised = store.getState().preview!.result;
      expect(revised.realizedScheduleFacts).toEqual(authority.facts);
      expect(store.exportRealizationAuthority()).toEqual(authority);
      const mapped = createPlanDecisionAcceptanceCandidate({
        suggestedFix: fix,
        frictionPoint: point,
        originalPreview: original,
        revisedPreview: revised,
        authoredSetup: store.getState(),
      });
      if (mapped.status !== "supported") throw new Error(JSON.stringify(mapped));
      return mapped.candidate;
    }
    tryMove();
    act(() => {
      store.generatePreview(range);
    }); // discard a Try
    expect(store.getPlanDecisions()).toHaveLength(0);
    expect(store.exportRealizationAuthority()).toEqual(authority);
    const decision = tryMove();
    act(() => {
      expect(store.acceptPlanDecision(decision)).toMatchObject({
        status: "accepted",
        persistence: { status: "persisted" },
      });
      store.generatePreview(range);
    });
    expect(store.getState().preview!.result.planDecisionResults).toContainEqual(
      expect.objectContaining({ kind: "placeOccurrence", status: "applied" }),
    );
    expect(store.exportRealizationAuthority()).toEqual(authority);
    cleanup();
    const restarted = createDayFrameStore();
    expect(await restarted.whenReady()).toEqual({ status: "ready" });
    restarted.generatePreview(range);
    expect(restarted.getPlanDecisions()).toHaveLength(1);
    expect(restarted.getState().preview!.result.planDecisionResults).toContainEqual(
      expect.objectContaining({ status: "applied" }),
    );
    expect(restarted.exportRealizationAuthority()).toEqual({
      ...authority,
      facts: [...authority.facts].sort((a, b) => a.id.localeCompare(b.id)),
    });
    restarted.commitAuthoredSetup({ ...authored, blockTemplates: [], blockRecurrences: [] });
    restarted.commitAuthoredSetup(authored);
    expect(restarted.acceptPlanDecision(decision)).toMatchObject({
      status: "rejected",
      reason: "targetLifetimeMismatch",
    });
    expect(restarted.exportRealizationAuthority()).toEqual({
      ...authority,
      facts: [...authority.facts].sort((a, b) => a.id.localeCompare(b.id)),
    });
  });
});
