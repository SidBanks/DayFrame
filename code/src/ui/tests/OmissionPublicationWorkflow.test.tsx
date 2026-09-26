/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { omissionFixture, at } from "../../state/omissionPublicationTestFixtures.js";
import { DayFrameApp } from "../DayFrameApp.js";
afterEach(cleanup);
it("uses the retained Review workspace for exact Skip Try, explicit acceptance, fresh Review and durable Build", async () => {
  const f = await omissionFixture();
  f.addConflict();
  const accept = vi.spyOn(f.store, "acceptPlanDecision"),
    publish = vi.spyOn(f.store, "publishScheduleRange");
  render(
    <DayFrameApp
      store={f.store}
      getNow={() => new Date(at)}
      getGeneratedAt={() => at}
      getRevisedAt={() => at}
    />,
  );
  fireEvent.click(
    within(screen.getByRole("navigation", { name: "Planner modes" })).getByRole("button", {
      name: "Review Schedule",
    }),
  );
  fireEvent.click(await screen.findByRole("button", { name: "Try: Skip block" }));
  expect(await screen.findByRole("heading", { name: "Inspect this Try" })).toBeVisible();
  expect(accept).not.toHaveBeenCalled();
  expect(publish).not.toHaveBeenCalled();
  expect(f.store.getPlanDecisions()).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: "Apply Planning Change" }));
  await screen.findByRole("heading", { name: "Ready to publish" });
  expect(accept).toHaveBeenCalledOnce();
  expect(f.store.getState().preview!.revisedAt).toBeUndefined();
  expect(f.counts().transactions).toBe(0);
  fireEvent.click(
    screen.getByRole("button", { name: "Build this Schedule: 2026-09-17–2026-09-17" }),
  );
  await screen.findByText(/Schedule published\./);
  expect(publish).toHaveBeenCalledOnce();
  expect(f.counts()).toEqual({ attempts: 1, transactions: 1 });
  const stored = await f.history.exportHistoricalPlan();
  if (stored.status !== "exported") throw Error(stored.status);
  expect(
    stored.batches[0]!.days[0]!.occurrences.filter((o) => o.plan.state === "omitted"),
  ).toHaveLength(1);
});
