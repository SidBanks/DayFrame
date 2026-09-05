import { describe, expect, it } from "vitest";
import {
  assessRangeCoverage,
  canonicalUserDayRange,
  containsRange,
  equalRange,
  expandCanonicalUserDayRange,
  intersectRange,
  intersectsRange,
  resolvePlanningDataHorizon,
  userDayRangeDuration,
  validateCanonicalUserDayRange,
  validatePlanningScopeContext,
  visibleInterval,
} from "./planningScope.js";
import {
  assessPreviewReviewCoverage,
  createReviewScope,
  publicationRangeFromReviewScope,
  previewRangeFromReviewScope,
} from "./reviewScope.js";

const range = (startUserDayDate: string, endUserDayDateExclusive: string) =>
  canonicalUserDayRange({
    startUserDayDate: startUserDayDate as never,
    endUserDayDateExclusive: endUserDayDateExclusive as never,
  });

describe("canonical planning scope V1", () => {
  it("validates real dates and rejects empty, reversed, and malformed ranges", () => {
    expect(validateCanonicalUserDayRange(range("2026-09-01", "2026-09-02")).status).toBe("valid");
    expect(
      validateCanonicalUserDayRange({
        startUserDayDate: "2026-02-30",
        endUserDayDateExclusive: "2026-03-02",
      }).status,
    ).toBe("invalid");
    expect(
      validateCanonicalUserDayRange({
        startUserDayDate: "2026-09-02",
        endUserDayDateExclusive: "2026-09-02",
      }),
    ).toMatchObject({ status: "invalid", reasons: ["emptyOrReversed"] });
  });

  it("uses governed half-open containment, intersection, duration, expansion, and clipping", () => {
    const parent = range("2026-09-01", "2026-09-08"),
      child = range("2026-09-02", "2026-09-04"),
      touching = range("2026-09-08", "2026-09-09");
    expect(containsRange(parent, child)).toBe(true);
    expect(intersectsRange(parent, touching)).toBe(false);
    expect(intersectRange(parent, touching)).toBeUndefined();
    expect(userDayRangeDuration(parent)).toBe(7);
    expect(
      equalRange(
        expandCanonicalUserDayRange(child, { beforeUserDays: 1, afterUserDays: 4 }),
        parent,
      ),
    ).toBe(true);
    expect(
      visibleInterval(
        { startsAt: "2026-09-01T03:00:00Z", endsAt: "2026-09-01T08:00:00Z" },
        { startsAt: "2026-09-01T04:00:00Z", endsAt: "2026-09-01T07:00:00Z" },
      ),
    ).toEqual({ startsAt: "2026-09-01T04:00:00Z", endsAt: "2026-09-01T07:00:00Z" });
  });

  it("constructs deterministic day/week/month/custom review scopes using effective week start", () => {
    const sunday = createReviewScope({
      kind: "week",
      anchorUserDayDate: "2026-09-09",
      weekStartsOn: "sunday",
    });
    const monday = createReviewScope({
      kind: "week",
      anchorUserDayDate: "2026-09-09",
      weekStartsOn: "monday",
    });
    expect(sunday).toMatchObject({
      startUserDayDate: "2026-09-06",
      endUserDayDateExclusive: "2026-09-13",
    });
    expect(monday).toMatchObject({
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-14",
    });
    expect(
      createReviewScope({ kind: "month", anchorUserDayDate: "2026-02-14", weekStartsOn: "monday" }),
    ).toMatchObject({ startUserDayDate: "2026-02-01", endUserDayDateExclusive: "2026-03-01" });
    expect(
      createReviewScope({ kind: "day", anchorUserDayDate: "2026-09-09", weekStartsOn: "monday" })
        .id,
    ).toBe(
      createReviewScope({ kind: "day", anchorUserDayDate: "2026-09-09", weekStartsOn: "monday" })
        .id,
    );
  });

  it("keeps equal Review and Preview geometry semantically typed and assesses coverage separately from freshness", () => {
    const review = createReviewScope({
      kind: "week",
      anchorUserDayDate: "2026-09-09",
      weekStartsOn: "monday",
    });
    const preview = previewRangeFromReviewScope(review);
    const publication = publicationRangeFromReviewScope(review);
    expect(review.scopeType).toBe("reviewScope");
    expect(preview.scopeType).toBe("previewRange");
    expect(publication).toEqual({
      version: 1,
      scopeType: "publicationRange",
      startUserDayDate: review.startUserDayDate,
      endUserDayDateExclusive: review.endUserDayDateExclusive,
      provenance: { source: "explicitPublication" },
    });
    expect(assessPreviewReviewCoverage(preview, review)).toBe("covers");
    expect(assessRangeCoverage(range("2026-09-08", "2026-09-10"), review)).toBe("partial");
    expect(assessRangeCoverage(undefined, review)).toBe("unknown");
  });

  it("resolves bounded requested/effective horizons with explicit footprint and boundary provenance", () => {
    const result = resolvePlanningDataHorizon({
      operation: "proposal",
      requestedRange: range("2026-09-07", "2026-09-14"),
      boundaryContext: true,
      requiredContext: [
        { range: range("2026-09-06", "2026-09-15"), reason: "supportFootprint" },
        { range: range("2026-09-05", "2026-09-16"), reason: "bufferFootprint" },
      ],
    });
    expect(result.requested).toMatchObject({
      startUserDayDate: "2026-09-07",
      endUserDayDateExclusive: "2026-09-14",
    });
    expect(result.effective).toMatchObject({
      startUserDayDate: "2026-09-05",
      endUserDayDateExclusive: "2026-09-16",
    });
    expect(result.expansionReasons).toEqual([
      "bufferFootprint",
      "canonicalUserDayBoundary",
      "supportFootprint",
    ]);
    expect(
      validatePlanningScopeContext({
        version: 1,
        planningDataHorizon: result,
        proposalHorizon: range("2026-09-07", "2026-09-14"),
      }),
    ).toEqual({ status: "valid" });
  });
});
