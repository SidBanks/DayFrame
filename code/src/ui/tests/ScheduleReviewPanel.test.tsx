import { reviewModelFixture } from "../../state/reviewSourceTestFixtures.js";
import { withPublicationReceipt } from "../../state/publicationReceipt.js";
import { createAcceptanceLifecycle } from "../../state/acceptanceLifecycle.js";
/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScheduleReviewPanel } from "../ScheduleReviewPanel.js";

afterEach(cleanup);

it("shows a failed read and allows an explicit read-only retry", async () => {
  const query = vi
    .fn()
    .mockRejectedValueOnce(new Error("Read failed"))
    .mockResolvedValue(queryResult());
  const accept = vi.fn();
  acceptancePanel(accept, query);
  expect(await screen.findByRole("heading", { name: "Review state unavailable" })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Refresh review" }));
  expect(await screen.findByRole("button", { name: "Accept preferred option" })).toBeVisible();
  expect(query).toHaveBeenCalledTimes(2);
  expect(accept).not.toHaveBeenCalled();
});

function acceptancePanel(
  onAcceptProposal: Parameters<typeof ScheduleReviewPanel>[0]["onAcceptProposal"],
  query = vi.fn(async () => queryResult() as never),
) {
  render(
    <ScheduleReviewPanel
      startUserDayDate="2026-09-05"
      endUserDayDateExclusive="2026-09-06"
      weekStartsOn="monday"
      historyAsOf="2026-09-05T12:00:00Z"
      query={query}
      unresolvedFrictionCount={0}
      onGeneratePreview={vi.fn()}
      onOpenFriction={vi.fn()}
      onAcceptProposal={onAcceptProposal}
      onRejectProposal={vi.fn()}
      onPublish={vi.fn()}
      getPublishedAt={() => "2026-09-05T13:00:00Z"}
    />,
  );
  return query;
}

it.each(["commitStateUncertain", "verificationFailedAfterCommit"] as const)(
  "acceptance %s never says not recorded or invites reacceptance",
  async (reason) => {
    const lifecycle = createAcceptanceLifecycle();
    acceptancePanel(async () =>
      lifecycle.result({ status: "unconfirmed", reason }, lifecycle.capture()),
    );
    fireEvent.click(await screen.findByRole("button", { name: "Accept preferred option" }));
    expect(await screen.findByText(/Authority is protected/)).toBeVisible();
    expect(screen.queryByText(/decision was not recorded/i)).not.toBeInTheDocument();
  },
);

it("duplicate acceptance clicks invoke one command and displaced completion does not refresh or install success", async () => {
  const lifecycle = createAcceptanceLifecycle(),
    origin = lifecycle.capture();
  let finish!: () => void;
  const gate = new Promise<void>((resolve) => {
    finish = resolve;
  });
  const action = vi.fn(async () => {
    await gate;
    return lifecycle.result(
      { status: "accepted" as const, value: {} as never, persistence: "durable" as const },
      origin,
    );
  });
  const query = acceptancePanel(action);
  const button = await screen.findByRole("button", { name: "Accept preferred option" });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(action).toHaveBeenCalledOnce();
  lifecycle.invalidate();
  finish();
  await waitFor(() => expect(button).not.toBeDisabled());
  expect(query).toHaveBeenCalledOnce();
  expect(screen.queryByText(/Decision recorded/)).not.toBeInTheDocument();
});

function queryResult() {
  return reviewModelFixture({
    sourceFingerprint: "source-1",
    planningDataCoverage: "complete",
    preview: { availability: "available", coverage: "covers", freshness: "current" },
    scheduledReality: [],
    derivedSchedule: [],
    acceptedLiabilities: [],
    proposals: [
      {
        epistemicClass: "proposed",
        membership: "contained",
        proposal: {
          id: "proposal",
          revision: 1,
          horizon: { startUserDayDate: "2026-09-05", endUserDayDateExclusive: "2026-09-06" },
          options: [{ id: "option", preferred: true }],
        },
      },
    ],
    unresolvedFrictionCount: 0,
    publication: {
      epistemicClass: "historical",
      availability: { status: "available" },
      materialization: { status: "eligible" },
      coverage: "none",
      publishedUserDays: [],
      missingUserDays: [],
    },
  });
}

describe("ScheduleReviewPanel", () => {
  it("publishes the exact reviewed range explicitly and announces durable success", async () => {
    let finish!: (value: { status: "published"; batchId: string; publishedAt: string }) => void;
    const publish = vi.fn(
      () =>
        new Promise<{ status: "published"; batchId: string; publishedAt: string }>((resolve) => {
          finish = resolve;
        }),
    );
    render(
      <ScheduleReviewPanel
        startUserDayDate="2026-09-05"
        endUserDayDateExclusive="2026-09-06"
        weekStartsOn="monday"
        historyAsOf="2026-09-05T12:00:00Z"
        query={async () => queryResult() as never}
        unresolvedFrictionCount={0}
        onGeneratePreview={vi.fn()}
        onOpenFriction={vi.fn()}
        onAcceptProposal={vi.fn()}
        onRejectProposal={vi.fn()}
        onPublish={publish}
        getPublishedAt={() => "2026-09-05T13:00:00Z"}
      />,
    );
    const button = await screen.findByRole("button", {
      name: /Build this Schedule: 2026-09-05–2026-09-05/,
    });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(publish).toHaveBeenCalledWith({
      publicationRange: {
        version: 1,
        scopeType: "publicationRange",
        startUserDayDate: "2026-09-05",
        endUserDayDateExclusive: "2026-09-06",
        provenance: { source: "explicitPublication" },
      },
      expectedSourceFingerprint: "source-1",
      publishedAt: "2026-09-05T13:00:00Z",
    });
    finish(
      withPublicationReceipt(
        { status: "published", batchId: "batch", publishedAt: "2026-09-05T13:00:00Z" },
        { isCurrent: () => true },
      ),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(/immutable historical record/);
  });

  it("shows readiness, keeps Proposal non-authoritative, and routes decisions through existing commands", async () => {
    const lifecycle = createAcceptanceLifecycle();
    const accept = vi.fn(async () =>
      lifecycle.result(
        { status: "accepted" as const, value: {} as never, persistence: "durable" as const },
        lifecycle.capture(),
      ),
    );
    const query = vi.fn(async () => queryResult() as never);
    render(
      <ScheduleReviewPanel
        startUserDayDate="2026-09-05"
        endUserDayDateExclusive="2026-09-06"
        weekStartsOn="monday"
        historyAsOf="2026-09-05T12:00:00Z"
        query={query}
        unresolvedFrictionCount={0}
        onGeneratePreview={vi.fn()}
        onOpenFriction={vi.fn()}
        onAcceptProposal={accept}
        onRejectProposal={vi.fn(async () =>
          lifecycle.result(
            { status: "accepted" as const, value: {} as never, persistence: "durable" as const },
            lifecycle.capture(),
          ),
        )}
        onPublish={vi.fn(async () => ({
          status: "published" as const,
          batchId: "batch",
          publishedAt: "2026-09-05T13:00:00Z",
        }))}
        getPublishedAt={() => "2026-09-05T13:00:00Z"}
      />,
    );
    expect(await screen.findByRole("heading", { name: "Ready to publish" })).toBeVisible();
    expect(screen.getByText(/does not own schedule time/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Accept preferred option" }));
    await waitFor(() =>
      expect(accept).toHaveBeenCalledWith({
        proposalId: "proposal",
        proposalRevision: 1,
        optionId: "option",
      }),
    );
    expect(await screen.findByText(/Decision recorded/)).toBeVisible();
    expect(query).toHaveBeenCalledTimes(2);
  });

  it("explains blockers and exposes governed existing actions", async () => {
    const generate = vi.fn(),
      friction = vi.fn();
    render(
      <ScheduleReviewPanel
        startUserDayDate="2026-09-05"
        endUserDayDateExclusive="2026-09-06"
        weekStartsOn="monday"
        historyAsOf="2026-09-05T12:00:00Z"
        query={async () =>
          ({
            ...queryResult(),
            planningDataCoverage: "unknown",
            preview: {
              availability: "unavailable",
              coverage: "doesNotCover",
              freshness: "unavailable",
            },
            proposals: reviewModelFixture().proposals,
          }) as never
        }
        unresolvedFrictionCount={1}
        onGeneratePreview={generate}
        onOpenFriction={friction}
        onAcceptProposal={vi.fn()}
        onRejectProposal={vi.fn()}
        onPublish={vi.fn()}
        getPublishedAt={() => "2026-09-05T13:00:00Z"}
      />,
    );
    expect(await screen.findByRole("heading", { name: "Not ready to publish" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Generate Preview" }));
    fireEvent.click(screen.getByRole("button", { name: "Resolve schedule conflicts" }));
    expect(generate).toHaveBeenCalledOnce();
    expect(friction).toHaveBeenCalledOnce();
  });
});

describe("Task 9.9 truthful publication state", () => {
  function mountPublication(query: () => Promise<unknown>, publish: () => Promise<unknown>) {
    render(
      <ScheduleReviewPanel
        startUserDayDate="2026-09-05"
        endUserDayDateExclusive="2026-09-06"
        weekStartsOn="monday"
        historyAsOf="2026-09-05T12:00:00Z"
        query={query as never}
        unresolvedFrictionCount={0}
        onGeneratePreview={vi.fn()}
        onOpenFriction={vi.fn()}
        onAcceptProposal={vi.fn()}
        onRejectProposal={vi.fn()}
        onPublish={publish as never}
        getPublishedAt={() => "2026-09-05T13:00:00Z"}
      />,
    );
  }
  it("blocks Publish for protected history without invoking the command", async () => {
    const publish = vi.fn();
    mountPublication(
      async () => ({
        ...queryResult(),
        publication: {
          ...queryResult().publication,
          coverage: "unknown",
          availability: { status: "protected", reason: "physicalMismatch" },
        },
      }),
      publish,
    );
    const button = await screen.findByRole("button", { name: /^Build this Schedule:/ });
    expect(button).toBeDisabled();
    expect(screen.queryByRole("heading", { name: "Ready to publish" })).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(publish).not.toHaveBeenCalled();
    expect(screen.getByText(/Publication is blocked until/)).toBeVisible();
  });
  it.each([
    ["verificationFailedAfterCommit", /written, but verification failed/],
    ["commitStateUncertain", /History may have been saved/],
    ["writeFailedBeforeCommit", /No new plan was saved/],
    ["throw", /History may have been saved/],
  ] as const)("reports %s without falsely claiming unchanged history", async (reason, message) => {
    mountPublication(
      async () => queryResult(),
      async () => {
        if (reason === "throw") throw new Error("lost response");
        return withPublicationReceipt({ status: "rejected", reason }, { isCurrent: () => true });
      },
    );
    fireEvent.click(await screen.findByRole("button", { name: /^Build this Schedule:/ }));
    expect(await screen.findByText(message)).toBeVisible();
    expect(screen.queryByText(/without changing schedule history/)).not.toBeInTheDocument();
  });
});

it.each([
  ["contextReplaced", "The schedule context changed"],
  ["publicationBusy", "Publication was not started"],
  ["pendingPublication", "not durably published"],
] as const)("explains %s without claiming durable publication", async (reason, message) => {
  render(
    <ScheduleReviewPanel
      startUserDayDate="2026-09-05"
      endUserDayDateExclusive="2026-09-06"
      weekStartsOn="monday"
      historyAsOf="2026-09-05T12:00:00Z"
      query={async () => queryResult() as never}
      unresolvedFrictionCount={0}
      onGeneratePreview={vi.fn()}
      onOpenFriction={vi.fn()}
      onAcceptProposal={vi.fn()}
      onRejectProposal={vi.fn()}
      onPublish={async () =>
        withPublicationReceipt({ status: "rejected", reason }, { isCurrent: () => true })
      }
      getPublishedAt={() => "2026-09-05T13:00:00Z"}
    />,
  );
  fireEvent.click(await screen.findByRole("button", { name: /Build this Schedule:/ }));
  expect(await screen.findByText(new RegExp(message))).toBeVisible();
});

it("late displaced success does not install feedback or refresh current Review", async () => {
  const query = vi.fn(async () => queryResult() as never);
  render(
    <ScheduleReviewPanel
      startUserDayDate="2026-09-05"
      endUserDayDateExclusive="2026-09-06"
      weekStartsOn="monday"
      historyAsOf="2026-09-05T12:00:00Z"
      query={query}
      unresolvedFrictionCount={0}
      onGeneratePreview={vi.fn()}
      onOpenFriction={vi.fn()}
      onAcceptProposal={vi.fn()}
      onRejectProposal={vi.fn()}
      onPublish={async () => ({
        status: "published",
        batchId: "old",
        publishedAt: "2026-09-05T13:00:00Z",
        receipt: { isCurrent: () => false },
      })}
      getPublishedAt={() => "2026-09-05T13:00:00Z"}
    />,
  );
  const button = await screen.findByRole("button", { name: /Build this Schedule:/ });
  const calls = query.mock.calls.length;
  fireEvent.click(button);
  await waitFor(() => expect(button).not.toBeDisabled());
  expect(screen.queryByText(/Schedule published\. This immutable/)).not.toBeInTheDocument();
  expect(query).toHaveBeenCalledTimes(calls);
});
