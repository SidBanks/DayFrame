/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { publicationFixture, at } from "../../state/publicationSourceTestFixtures.js";
import { deferred } from "../../state/acceptanceLifecycleTestFixtures.js";
import { DayFrameApp } from "../DayFrameApp.js";
import { ScheduleReviewWorkspace } from "../ScheduleReviewWorkspace.js";
import { createGoalEditingContext } from "../goalEditingContext.js";
import { createReviewScope } from "../../core/planning/reviewScope.js";
import type { PublishScheduleRangeResultV1 } from "../../state/types.js";

afterEach(cleanup);
it("bounds more than ten canonically generated offers without deciding", async () => {
  const { f, props } = await workspace();
  const range = { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-18" } as const;
  for (let i = 0; i < 11; i++) {
    const goal = await f.store.createGoal({ title: `Bounded offer ${i}` });
    if (goal.status !== "accepted") throw Error(JSON.stringify(goal));
    const demand = await f.store.createDemand({
      goalId: goal.goal.id,
      requestedEffort: { unit: "minutes", amount: 15 },
      horizon: {
        kind: "userDayInterval",
        startUserDayDate: `2026-09-${18 + i}`,
        endUserDayDateExclusive: `2026-09-${19 + i}`,
      },
      session: { mode: "indivisible", exactMinutes: 15 },
      satisfaction: { kind: "minimum", allowPartial: false },
      cadence: { kind: "total" },
    });
    if (demand.status !== "accepted") throw Error(JSON.stringify(demand));
    expect(
      (
        await f.store.setDemandResourceFootprintAssociation({
          demandId: demand.value.id,
          selection: { kind: "productiveOnly" },
        })
      ).status,
    ).toBe("accepted");
  }
  f.store.setPreviewRange({
    source: "custom",
    preset: "custom",
    startDate: "2026-09-17",
    endDate: "2026-09-28",
  });
  f.store.generatePreview({
    rangeStartDate: "2026-09-17",
    rangeEndDate: "2026-09-28",
    planningWindowStart: new Date(2026, 8, 17),
    planningWindowEnd: new Date(2026, 8, 29),
    generatedAt: at,
  });
  for (let day = 18; day <= 28; day++) {
    const horizon = {
      startUserDayDate: `2026-09-${day}`,
      endUserDayDateExclusive: `2026-09-${day + 1}`,
    } as const;
    const evaluation = await f.store.evaluateCompetingAllocation({
      ...horizon,
      evaluationCutoff: at,
    });
    if (evaluation.status !== "evaluated") throw Error(JSON.stringify(evaluation));
    expect(evaluation.allocation.allocations.length).toBeGreaterThan(0);
    const proposal = await f.store.deriveProposal({
      allocation: evaluation.allocation.allocations[0]!,
      horizon,
      allocationHorizon: horizon,
      generatedAt: at,
      evaluationCutoff: at,
    });
    if (proposal.status !== "proposed") throw Error(JSON.stringify(proposal));
    expect((await f.store.recordProposal(proposal)).status).toBe("accepted");
  }
  props.review.endUserDayDateExclusive =
    "2026-09-29" as typeof props.review.endUserDayDateExclusive;
  const model = await f.store.queryPlanningReview({
    reviewScope: createReviewScope({
      kind: "custom",
      anchorUserDayDate: range.startUserDayDate,
      weekStartsOn: "monday",
      customRange: { ...range, endUserDayDateExclusive: "2026-09-29" },
    }),
    historyAsOf: at,
  });
  expect(model.proposals.records.length).toBeGreaterThan(10);
  const first = render(<ScheduleReviewWorkspace {...props} />);
  expect(await screen.findAllByRole("button", { name: "Accept preferred option" })).toHaveLength(
    10,
  );
  fireEvent.click(
    screen.getAllByText("Requested Time and full option effects", { selector: "summary" })[0]!,
  );
  fireEvent.click(screen.getByRole("button", { name: "Show more offers" }));
  expect(screen.getAllByRole("button", { name: "Accept preferred option" })).toHaveLength(
    model.proposals.records.length,
  );
  first.unmount();
  render(<ScheduleReviewWorkspace {...props} />);
  expect(await screen.findAllByRole("button", { name: "Accept preferred option" })).toHaveLength(
    model.proposals.records.length,
  );
  expect(
    screen.getAllByText("Requested Time and full option effects", { selector: "summary" })[0]!
      .parentElement,
  ).toHaveAttribute("open");
  expect(f.counts().transactions).toBe(0);
});
const openReview = () =>
  fireEvent.click(
    within(screen.getByRole("navigation", { name: "Planner modes" })).getByRole("button", {
      name: "Review Schedule",
    }),
  );

it("retains applied and invalid review periods through Calendar and Summary without commands", async () => {
  const f = await publicationFixture();
  const query = vi.spyOn(f.store, "queryPlanningReview");
  const writes = [
    "generatePreview",
    "acceptProposalOption",
    "realizeAcceptedAllocation",
    "publishScheduleRange",
    "commitAuthoredSetup",
    "acceptPlanDecision",
  ] as const;
  const spies = writes.map((name) => vi.spyOn(f.store, name));
  render(<DayFrameApp store={f.store} getNow={() => new Date(at)} />);
  openReview();
  await screen.findByLabelText("Review start date");
  expect(screen.getByLabelText("Review start date")).toHaveValue("2026-09-17");
  fireEvent.change(screen.getByLabelText("Review end date"), { target: { value: "2026-09-18" } });
  fireEvent.click(screen.getByRole("button", { name: "Apply review period" }));
  await waitFor(() =>
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({
        reviewScope: expect.objectContaining({ endUserDayDateExclusive: "2026-09-19" }),
      }),
    ),
  );
  fireEvent.change(screen.getByLabelText("Review end date"), { target: { value: "2026-09-16" } });
  fireEvent.click(screen.getByRole("button", { name: "Apply review period" }));
  expect(screen.getByLabelText("Review end date")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText(/applied review period has not changed/)).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Calendar" }));
  fireEvent.click(screen.getByRole("button", { name: "Next month" }));
  openReview();
  expect(await screen.findByLabelText("Review end date")).toHaveValue("2026-09-16");
  expect(screen.getByText(/Reviewing 2026-09-17 through 2026-09-18/)).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Summary" }));
  await screen.findByRole("heading", { name: "History" });
  fireEvent.click(screen.getByRole("button", { name: "Planner" }));
  expect(await screen.findByLabelText("Review end date")).toHaveValue("2026-09-16");
  for (const spy of spies) expect(spy).not.toHaveBeenCalled();
});

it("applies an explicit Calendar period but ordinary Calendar browsing does not change Review", async () => {
  const f = await publicationFixture();
  render(<DayFrameApp store={f.store} getNow={() => new Date(at)} />);
  fireEvent.click(screen.getByRole("button", { name: "Review this period" }));
  await waitFor(() => expect(screen.getByLabelText("Review start date")).toHaveValue("2026-09-01"));
  expect(screen.getByLabelText("Review end date")).toHaveValue("2026-09-30");
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  fireEvent.click(screen.getByRole("button", { name: "Next month" }));
  openReview();
  expect(await screen.findByLabelText("Review end date")).toHaveValue("2026-09-30");
});

async function workspace() {
  const f = await publicationFixture();
  f.store.generatePreview({
    rangeStartDate: "2026-09-17",
    rangeEndDate: "2026-09-18",
    planningWindowStart: new Date(2026, 8, 17),
    planningWindowEnd: new Date(2026, 8, 19),
    generatedAt: at,
  });
  const context = createGoalEditingContext();
  const publish = vi.fn(f.store.publishScheduleRange);
  const props = {
    context,
    missingSetup: [],
    message: "",
    onOpenSetup: vi.fn(),
    onDay: vi.fn(),
    review: {
      startUserDayDate: "2026-09-17" as const,
      endUserDayDateExclusive: "2026-09-19" as const,
      weekStartsOn: "monday" as const,
      historyAsOf: at,
      getPublishedAt: () => at,
      query: f.store.queryPlanningReview,
      subscribeReview: f.store.subscribePlanningReview,
      unresolvedFrictionCount: 0,
      onGeneratePreview: vi.fn(),
      onOpenFriction: vi.fn(),
      onAcceptProposal: f.store.acceptProposalOption,
      onRejectProposal: f.store.rejectProposal,
      onRetryRealization: f.store.realizeAcceptedAllocation,
      onPublish: publish,
    },
    preview: {
      preview: f.store.getState().preview,
      getDayBoundaryStartTimeForUserDayDate: () => "00:00" as const,
      onApplySuggestedFix: vi.fn(),
    },
  };
  return { f, props, publish, context };
}

it("a one-day detail filter cannot narrow a real two-day Build; Refresh is read-only", async () => {
  const { f, props, publish } = await workspace();
  render(<ScheduleReviewWorkspace {...props} />);
  await screen.findByRole("heading", { name: "Ready to publish" });
  fireEvent.click(screen.getByRole("button", { name: "Refresh review" }));
  expect(screen.queryByRole("heading", { name: "Ready to publish" })).not.toBeInTheDocument();
  await screen.findByRole("heading", { name: "Ready to publish" });
  expect(f.counts().transactions).toBe(0);
  fireEvent.click(
    screen.getByText("Conflicts, corrections and schedule detail", { selector: "summary" }),
  );
  fireEvent.change(screen.getByLabelText("Review one user-day"), {
    target: { value: "2026-09-18" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Build this Schedule: 2026-09-17–2026-09-18" }),
  );
  await screen.findByText(/Schedule published\./);
  expect(publish).toHaveBeenCalledOnce();
  expect(publish.mock.calls[0]![0].publicationRange).toMatchObject({
    startUserDayDate: "2026-09-17",
    endUserDayDateExclusive: "2026-09-19",
  });
  expect(f.counts().transactions).toBe(1);
  expect(props.review.onGeneratePreview).not.toHaveBeenCalled();
});

it("keeps a pending Build and its original receipt across a navigation unmount without resubmission", async () => {
  const { f, props, context } = await workspace();
  const gate = deferred();
  let original: PublishScheduleRangeResultV1 | undefined;
  const publish = vi.fn(async (input: Parameters<typeof f.store.publishScheduleRange>[0]) => {
    await gate.promise;
    original = await f.store.publishScheduleRange(input);
    return original;
  });
  const configured = { ...props, review: { ...props.review, onPublish: publish } };
  const first = render(<ScheduleReviewWorkspace {...configured} />);
  fireEvent.click(await screen.findByRole("button", { name: /Build this Schedule:/ }));
  first.unmount();
  render(<ScheduleReviewWorkspace {...configured} />);
  expect(await screen.findByRole("button", { name: "Building…" })).toBeDisabled();
  await act(async () => {
    gate.resolve();
  });
  await screen.findByText(/Schedule published\./);
  expect(publish).toHaveBeenCalledOnce();
  const scope = createReviewScope({
    kind: "custom",
    anchorUserDayDate: "2026-09-17",
    weekStartsOn: "monday",
    source: "navigation",
    customRange: { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-19" },
  });
  const retained = context
    .cell<{
      publicationResult: PublishScheduleRangeResultV1 | null;
    }>(`review-feedback:${scope.id}`, () => ({ publicationResult: null }))
    .get().publicationResult;
  expect(retained).toBe(original);
  expect(retained?.receipt?.isCurrent()).toBe(true);
  expect(Object.getOwnPropertyDescriptor(retained, "receipt")?.enumerable).toBe(false);
  expect(f.counts().transactions).toBe(1);
});
