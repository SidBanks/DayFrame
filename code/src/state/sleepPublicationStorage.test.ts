import { expect, it } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { fixture, published } from "../core/sleep/sleepPublicationTestFixtures.js";
import {
  createDayFrameDurableDb,
  HISTORICAL_PLAN_BATCH_STORE,
  HISTORICAL_PLAN_DAY_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
it.each(["beforeWrite", "throwAfterCommit", "metadataRead", "dayRead"] as const)(
  "Sleep shares atomic commit certainty: %s",
  async (fault) => {
    const real = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: "sleep-certainty" });
    let committed = false,
      writes = 0;
    const storage = {
      ...real,
      mutate: async (changes: Parameters<typeof real.mutate>[0]) => {
        writes++;
        if (fault === "beforeWrite")
          return {
            status: "failure" as const,
            error: { code: "quotaExceeded" as const, operation: "mutate" },
          };
        const result = await real.mutate(changes);
        committed = result.status === "success";
        if (fault === "throwAfterCommit") throw Error("lost commit response");
        return result;
      },
      get: async (...args: Parameters<typeof real.get>) =>
        committed && fault === "metadataRead"
          ? { status: "failure" as const, error: { code: "readFailed" as const, operation: "get" } }
          : real.get(...args),
      queryIndex: async (...args: Parameters<typeof real.queryIndex>) =>
        committed && fault === "dayRead"
          ? {
              status: "failure" as const,
              error: { code: "readFailed" as const, operation: "queryIndex" },
            }
          : real.queryIndex(...args),
    } as typeof real;
    const surface = createHistoricalPlanSurface({ storage });
    const batch = published();
    expect((await surface.publishAtomically(batch)).status).toBe(
      fault === "beforeWrite"
        ? "writeFailedBeforeCommit"
        : fault === "throwAfterCommit"
          ? "commitStateUncertain"
          : "verificationFailedAfterCommit",
    );
    expect((await surface.retryPendingPublications()).status).toBe("notAttempted");
    expect(writes).toBe(1);
    expect(surface.getPendingPublications()).toEqual([]);
    if (fault !== "beforeWrite") {
      expect(surface.getStatus().status).toBe("protected");
      expect((await surface.publishAtomically(batch)).status).toBe("publicationBlockedProtected");
    }
    const physical = await real.getAll(HISTORICAL_PLAN_BATCH_STORE);
    expect(physical.status === "success" && physical.value.length).toBe(
      fault === "beforeWrite" ? 0 : 1,
    );
  },
);
it("rejects a queued candidate whose authority changes before commit", async () => {
  const real = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: "sleep-fresh" });
  let current = true,
    writes = 0;
  const storage = {
    ...real,
    get: async (...args: Parameters<typeof real.get>) => {
      const result = await real.get(...args);
      current = false;
      return result;
    },
    mutate: async (changes: Parameters<typeof real.mutate>[0]) => {
      writes++;
      return real.mutate(changes);
    },
  } as typeof real;
  const surface = createHistoricalPlanSurface({ storage });
  expect(await surface.publishAtomically(published(), { isCurrent: () => current })).toMatchObject({
    status: "rejected",
    reason: "sourceChanged",
  });
  expect(writes).toBe(0);
  expect(surface.getStatus().status).toBe("ready");
});
it("rejects an adjacent conflicting full footprint without changing prior history", async () => {
  const storage = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: "sleep-seam" });
  const surface = createHistoricalPlanSurface({ storage });
  const first = published();
  expect((await surface.publishAtomically(first)).status).toBe("publishedAndDurable");
  expect((await surface.publishAtomically(published(fixture("2026-09-18", "00:00")))).status).toBe(
    "invalidCandidate",
  );
  expect(await surface.exportHistoricalPlan()).toMatchObject({
    status: "exported",
    batches: [first],
  });
});
it("protects altered frozen provenance even when planned geometry is identical", async () => {
  const storage = createDayFrameDurableDb({
    indexedDB: new IDBFactory(),
    name: "sleep-corruption",
  });
  const surface = createHistoricalPlanSurface({ storage });
  await surface.publishAtomically(published());
  const physical = await storage.getAll<Record<string, unknown>>(HISTORICAL_PLAN_DAY_STORE);
  if (physical.status !== "success") throw Error();
  const entry = physical.value[0]!;
  const day = entry.dayPublication as ReturnType<typeof published>["days"][number];
  const snapshot = day.occurrences[0]!;
  if (snapshot.version !== 4) throw Error();
  snapshot.sleep.occurrence.provenance.dependencyFingerprint = "altered";
  await storage.put(HISTORICAL_PLAN_DAY_STORE, entry);
  expect(
    (await surface.getHistoricalPlanDay("2026-09-17", "2026-09-20T00:00:00.000Z")).status,
  ).toBe("unavailableProtected");
  expect((await surface.exportHistoricalPlan()).status).toBe("protected");
});
