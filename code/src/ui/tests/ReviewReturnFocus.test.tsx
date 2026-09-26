/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { publicationFixture, at } from "../../state/publicationSourceTestFixtures.js";
import { DayFrameApp } from "../DayFrameApp.js";
afterEach(cleanup);
it.each(["day", "setup", "goal"] as const)(
  "returns Review focus to the actual originating %s control",
  async (destination) => {
    const f = await publicationFixture();
    expect((await f.store.acceptProposalOption(f.input)).status).toBe("accepted");
    f.generate();
    render(<DayFrameApp store={f.store} getNow={() => new Date(at)} />);
    fireEvent.click(
      within(screen.getByRole("navigation", { name: "Planner modes" })).getByRole("button", {
        name: "Review Schedule",
      }),
    );
    await screen.findByRole("heading", { name: "Review readiness" });
    let name: string | RegExp;
    if (destination === "day") {
      fireEvent.click(
        screen.getByText("Conflicts, corrections and schedule detail", { selector: "summary" }),
      );
      name = "Open Daily Planner for 2026-09-17";
    } else
      name = destination === "setup" ? "Generation range and setup" : /Inspect accepted planning:/;
    const origin = await screen.findByRole("button", { name });
    origin.focus();
    fireEvent.click(origin);
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: "Review Schedule" })).not.toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() => expect(screen.getByRole("button", { name })).toHaveFocus());
    expect(f.counts().transactions).toBe(0);
  },
);

it("returns focus after closing the in-place Event editor without saving", async () => {
  const f = await publicationFixture();
  render(<DayFrameApp store={f.store} getNow={() => new Date(at)} />);
  fireEvent.click(
    within(screen.getByRole("navigation", { name: "Planner modes" })).getByRole("button", {
      name: "Review Schedule",
    }),
  );
  await screen.findByRole("heading", { name: "Review readiness" });
  fireEvent.click(
    screen.getByText("Conflicts, corrections and schedule detail", { selector: "summary" }),
  );
  const origin = screen.getByRole("button", { name: /Add event to/ });
  origin.focus();
  fireEvent.click(origin);
  const close = screen.getByRole("button", { name: "Close" });
  close.focus();
  fireEvent.click(close);
  await waitFor(() => expect(origin).toHaveFocus());
  expect(f.counts().transactions).toBe(0);
});
