/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { publicationFixture, at } from "../../state/publicationSourceTestFixtures.js";
import { ScheduleReviewPanel } from "../ScheduleReviewPanel.js";
import { deriveScheduleReviewReadiness } from "../scheduleReviewReadiness.js";
import { deferred } from "../../state/acceptanceLifecycleTestFixtures.js";
afterEach(cleanup);
it("real protected authority invalidates Ready synchronously and shares source/reason with the public command", async () => {
  const f = await publicationFixture();
  render(
    <>
      <input aria-label="Independent draft" defaultValue="Retained evidence draft" />
      <ScheduleReviewPanel
        startUserDayDate="2026-09-17"
        endUserDayDateExclusive="2026-09-18"
        weekStartsOn="monday"
        historyAsOf={at}
        query={f.store.queryPlanningReview}
        subscribeReview={f.store.subscribePlanningReview}
        unresolvedFrictionCount={0}
        onGeneratePreview={f.generate}
        onOpenFriction={() => {}}
        onAcceptProposal={f.store.acceptProposalOption}
        onRejectProposal={f.store.rejectProposal}
        onPublish={f.store.publishScheduleRange}
        getPublishedAt={() => at}
      />
    </>,
  );
  expect(await screen.findByRole("heading", { name: "Ready to publish" })).toBeVisible();
  const mutate = vi.mocked(f.durable.mutate).getMockImplementation()!,
    entered = deferred(),
    release = deferred();
  vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    if (rows.some((row) => row.store === "proposalAuthority")) {
      entered.resolve();
      await release.promise;
      await mutate(rows, admit, observe);
      throw Error("Controlled lost acknowledgment");
    }
    return mutate(rows, admit, observe);
  });
  let write: Promise<unknown>;
  await act(async () => {
    write = f.store.markProposalShown(f.input.proposalId, f.input.proposalRevision);
    await entered.promise;
  });
  expect(screen.queryByRole("heading", { name: "Ready to publish" })).not.toBeInTheDocument();
  await act(async () => {
    release.resolve();
    await write;
  });
  expect(await screen.findByText(/proposal\/commitUnconfirmed/)).toBeVisible();
  expect(screen.queryByText(/constructive Proposal.*awaiting a decision/)).not.toBeInTheDocument();
  for (const button of screen.getAllByRole("button", { name: "Accept preferred option" }))
    expect(button).toBeDisabled();
  expect(screen.getByLabelText("Independent draft")).toHaveValue("Retained evidence draft");
  const model = await f.store.queryPlanningReview(f.query),
    readiness = deriveScheduleReviewReadiness({
      model,
      unresolvedFrictionCount: 0,
      publicationRangeValid: true,
    }),
    result = await f.store.publishScheduleRange(await f.command());
  expect(result).toMatchObject({
    reason: "publicationSourceUnqualified",
    sourceIssues: readiness.blockers[0]!.sourceIssues,
  });
  expect(f.counts().transactions).toBe(0);
  expect(screen.getByRole("button", { name: /Build this Schedule:/ })).toBeDisabled();
});
it("duplicate publication clicks dispatch once with the original operation receipt", async () => {
  const f = await publicationFixture(),
    entered = deferred(),
    release = deferred(),
    publish = vi.fn(async (input: Parameters<typeof f.store.publishScheduleRange>[0]) => {
      entered.resolve();
      await release.promise;
      return f.store.publishScheduleRange(input);
    });
  render(
    <ScheduleReviewPanel
      startUserDayDate="2026-09-17"
      endUserDayDateExclusive="2026-09-18"
      weekStartsOn="monday"
      historyAsOf={at}
      query={f.store.queryPlanningReview}
      subscribeReview={f.store.subscribePlanningReview}
      unresolvedFrictionCount={0}
      onGeneratePreview={f.generate}
      onOpenFriction={() => {}}
      onAcceptProposal={f.store.acceptProposalOption}
      onRejectProposal={f.store.rejectProposal}
      onPublish={publish}
      getPublishedAt={() => at}
    />,
  );
  const button = await screen.findByRole("button", { name: /Build this Schedule:/ });
  fireEvent.click(button);
  fireEvent.click(button);
  await entered.promise;
  expect(publish).toHaveBeenCalledOnce();
  await act(async () => {
    release.resolve();
  });
  expect(await screen.findByText(/Schedule published\./)).toBeVisible();
  expect(f.counts().transactions).toBe(1);
});
it("unknown realization coverage never describes every readable claim as unscheduled or invites a blind retry", async () => {
  const f = await publicationFixture(),
    mutate = vi.mocked(f.durable.mutate).getMockImplementation()!;
  vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    const result = await mutate(rows, admit, observe);
    if (rows.some((row) => row.store === "realizationAuthority"))
      throw Error("Controlled realization acknowledgment loss");
    return result;
  });
  await f.store.acceptProposalOption(f.input);
  render(
    <ScheduleReviewPanel
      startUserDayDate="2026-09-17"
      endUserDayDateExclusive="2026-09-18"
      weekStartsOn="monday"
      historyAsOf={at}
      query={f.store.queryPlanningReview}
      subscribeReview={f.store.subscribePlanningReview}
      unresolvedFrictionCount={0}
      onGeneratePreview={f.generate}
      onOpenFriction={() => {}}
      onAcceptProposal={f.store.acceptProposalOption}
      onRejectProposal={f.store.rejectProposal}
      onRetryRealization={f.store.realizeAcceptedAllocation}
      onPublish={f.store.publishScheduleRange}
      getPublishedAt={() => at}
    />,
  );
  expect(await screen.findByText(/Current realization coverage is unknown/)).toBeVisible();
  expect(
    screen.queryByText(/Accepted resource intent has not reached scheduled reality/),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Retry scheduling accepted work" })).toBeDisabled();
  expect(f.counts().transactions).toBe(0);
});
