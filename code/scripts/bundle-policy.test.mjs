import { describe, expect, it } from "vitest";
import { bundlePolicy, evaluateBundlePolicy } from "./bundle-policy.mjs";

const healthy = {
  initialBytes: 600_000,
  initialGzip: 150_000,
  largestLazy: 60_000,
  totalBytes: 750_000,
};

describe("bundle policy", () => {
  it("accepts a bundle below every warning threshold", () => {
    expect(evaluateBundlePolicy(healthy)).toEqual({ failures: [], warnings: [] });
  });

  it.each(Object.entries(bundlePolicy.hard))(
    "allows equality at the %s hard limit and fails only above it",
    (name, limit) => {
      expect(evaluateBundlePolicy({ ...healthy, [name]: limit }).failures).toEqual([]);
      expect(evaluateBundlePolicy({ ...healthy, [name]: limit + 1 }).failures).toEqual([
        { name, limit, value: limit + 1 },
      ]);
    },
  );

  it.each(Object.entries(bundlePolicy.warning))(
    "warns at the %s headroom threshold",
    (name, threshold) => {
      expect(evaluateBundlePolicy({ ...healthy, [name]: threshold }).warnings).toContainEqual({
        kind: "headroom",
        name,
        threshold,
        value: threshold,
      });
    },
  );

  it("keeps the total-size milestones advisory", () => {
    expect(
      evaluateBundlePolicy({ ...healthy, totalBytes: bundlePolicy.total.warning }),
    ).toMatchObject({
      failures: [],
      warnings: [{ kind: "growth-review", name: "totalBytes" }],
    });
    expect(
      evaluateBundlePolicy({
        ...healthy,
        totalBytes: bundlePolicy.total.architectureReview,
      }),
    ).toMatchObject({
      failures: [],
      warnings: [{ kind: "architecture-review", name: "totalBytes" }],
    });
    expect(evaluateBundlePolicy({ ...healthy, totalBytes: 1_000_000 }).failures).toEqual([]);
  });
});
