/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LegacySleepConversionSection } from "../LegacySleepConversionSection.js";
import { conversionFixture } from "../../core/sleep/legacySleepConversionTestFixtures.js";
import { reviewLegacySleep } from "../../core/sleep/legacySleepConversion.js";
import type { DayFrameState, DayFrameStore } from "../../state/types.js";
afterEach(cleanup);
it("reaches review from ordinary controls and requires an explicit final confirmation", async () => {
  const { context } = conversionFixture();
  const store = {
    getState: () => context.setup as DayFrameState,
    reviewLegacySleepConversion: vi.fn(async (request) => reviewLegacySleep(context, request)),
    convertLegacySleepToFirstClass: vi.fn<DayFrameStore["convertLegacySleepToFirstClass"]>(
      async () => ({ status: "rejected" as const, reason: "Storage unavailable" }),
    ),
  };
  render(<LegacySleepConversionSection store={store} />);
  expect(store.convertLegacySleepToFirstClass).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText("Old Sleep schedule"), {
    target: { value: context.setup.blockRecurrences[0]!.incarnationId },
  });
  fireEvent.change(screen.getByLabelText("Start required Sleep on user day"), {
    target: { value: "2026-10-01" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Review conversion" }));
  await screen.findByText("Ready for your confirmation");
  expect(store.convertLegacySleepToFirstClass).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Confirm conversion" })).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Confirm conversion" }));
  await waitFor(() => expect(store.convertLegacySleepToFirstClass).toHaveBeenCalledOnce());
  expect(store.convertLegacySleepToFirstClass.mock.calls[0]![0]).toMatchObject({
    confirmed: true,
    request: { cutover: "2026-10-01" },
  });
  expect(await screen.findByRole("status")).toHaveTextContent("Storage unavailable");
});
it("keeps missing semantics blank and blocks conversion while setup has unsaved edits", () => {
  const { context } = conversionFixture();
  context.setup.blockTemplates[0]!.preferredWindow = "beforeWork";
  delete context.setup.blockTemplates[0]!.customWindowStartTime;
  delete context.setup.blockTemplates[0]!.customWindowEndTime;
  const store = {
    getState: () => context.setup as DayFrameState,
    reviewLegacySleepConversion: vi.fn(),
    convertLegacySleepToFirstClass: vi.fn(),
  };
  const { rerender } = render(<LegacySleepConversionSection store={store} />);
  fireEvent.change(screen.getByLabelText("Old Sleep schedule"), {
    target: { value: context.setup.blockRecurrences[0]!.incarnationId },
  });
  expect(screen.getByLabelText("Work-relative window span (minutes)")).toHaveValue(null);
  expect(screen.getByLabelText("Window start")).toHaveValue("");
  expect(screen.getByLabelText("Window end")).toHaveValue("");
  expect(store.convertLegacySleepToFirstClass).not.toHaveBeenCalled();
  rerender(<LegacySleepConversionSection store={store} disabled />);
  expect(screen.getByRole("button", { name: "Review conversion" })).toBeDisabled();
});
