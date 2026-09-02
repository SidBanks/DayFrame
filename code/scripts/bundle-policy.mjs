export const bundlePolicy = Object.freeze({
  hard: Object.freeze({
    initialBytes: 685_000,
    initialGzip: 170_000,
    largestLazy: 100_000,
  }),
  warning: Object.freeze({
    initialBytes: 650_000,
    initialGzip: 161_500,
    largestLazy: 80_000,
  }),
  total: Object.freeze({
    warning: 800_000,
    architectureReview: 825_000,
  }),
});

export function evaluateBundlePolicy(metrics) {
  const failures = Object.entries(bundlePolicy.hard)
    .filter(([name, limit]) => metrics[name] > limit)
    .map(([name, limit]) => ({ name, limit, value: metrics[name] }));

  const warnings = Object.entries(bundlePolicy.warning)
    .filter(([name, threshold]) => metrics[name] >= threshold)
    .map(([name, threshold]) => ({
      kind: "headroom",
      name,
      threshold,
      value: metrics[name],
    }));

  if (metrics.totalBytes >= bundlePolicy.total.architectureReview) {
    warnings.push({
      kind: "architecture-review",
      name: "totalBytes",
      threshold: bundlePolicy.total.architectureReview,
      value: metrics.totalBytes,
    });
  } else if (metrics.totalBytes >= bundlePolicy.total.warning) {
    warnings.push({
      kind: "growth-review",
      name: "totalBytes",
      threshold: bundlePolicy.total.warning,
      value: metrics.totalBytes,
    });
  }

  return { failures, warnings };
}
