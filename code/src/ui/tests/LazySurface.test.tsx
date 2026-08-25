/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LazySurfaceBoundary, LazySurfaceLoading } from "../DayFrameApp.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe("lazy surface UX", () => {
  it("announces a stable surface loading fallback", () => {
    render(<LazySurfaceLoading name="Summary" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading Summary…");
  });
  it("announces the lazy Today surface with the same stable fallback", () => {
    render(<LazySurfaceLoading name="Today" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading Today…");
  });
  it("keeps a bounded recovery message when a lazy surface fails", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    function Failed(): never {
      throw new Error("chunk");
    }
    render(
      <LazySurfaceBoundary name="Summary">
        <Failed />
      </LazySurfaceBoundary>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Summary could not be loaded");
    expect(screen.getByText(/saved data was not changed/)).toBeInTheDocument();
  });
});
