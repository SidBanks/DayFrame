import { expect, it, vi } from "vitest";
import { prepared, deferred } from "./acceptanceLifecycleTestFixtures.js";
import { createProposalSurface } from "./proposalSurface.js";
import { createHistoricalPlanSurface } from "./historicalPlanSurface.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability,
  getDayFrameRuntimeAuthorityController,
} from "./dayFrameRuntimeAuthority.js";
import {
  PLAN_PUBLICATION_BATCH_VERSION,
  HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
  HISTORICAL_PLAN_SURFACE_VERSION,
} from "../core/historicalPlan/historicalPlan.js";

it("all four real registered owners must settle before before-snapshot replacement", async () => {
  const db = createDayFrameDurableDb(),
    proposals = createProposalSurface({ storage: db }),
    history = createHistoricalPlanSurface({ storage: db });
  const { store, input } = await prepared(true, {
    restoreIndexedDb: db,
    proposalSurface: proposals,
    historicalPlanSurface: history,
  });
  expect(
    (
      await store.acceptProposalOption({
        ...input,
        current: { status: "proposed", proposal: proposals.listActionableProposals()[0]! },
      })
    ).status,
  ).toBe("accepted");
  const accepted = store.exportProposalAuthority().acceptedAllocations[0]!;
  const gates = Object.fromEntries(
    ["realizationAuthority", "proposalAuthority", "goalStructure", "historicalPlanBatches"].map(
      (name) => [name, { entered: deferred(), release: deferred() }],
    ),
  );
  const real = db.mutate;
  vi.spyOn(db, "mutate").mockImplementation(async (rows, admit, observe) => {
    const gate = gates[rows[0]!.store];
    if (gate) {
      gate.entered.resolve();
      await gate.release.promise;
    }
    return real(rows, admit, observe);
  });
  const realization = store.realizeAcceptedAllocation(accepted.id);
  await gates.realizationAuthority!.entered.promise;
  const proposal = store.retryProposalPersistence();
  await gates.proposalAuthority!.entered.promise;
  const structure = store.createMilestone({
    ownerGoalId: store.listGoals()[0]!.id,
    title: "Independent milestone",
  });
  await gates.goalStructure!.entered.promise;
  const publication = history.publishAtomically({
    surfaceVersion: HISTORICAL_PLAN_SURFACE_VERSION,
    version: PLAN_PUBLICATION_BATCH_VERSION,
    id: "11111111-1111-4111-8111-111111111111" as never,
    publishedAt: "2026-09-16T12:00:00.000Z",
    range: { startUserDayDate: "2026-09-15", endUserDayDate: "2026-09-15" },
    days: [
      {
        version: HISTORICAL_PLAN_DAY_PUBLICATION_VERSION,
        userDayDate: "2026-09-15",
        dayBoundaryStartTime: "00:00",
        weekStartsOn: "monday",
        utcOffsetMinutes: 0,
        occurrences: [],
      },
    ],
  });
  await gates.historicalPlanBatches!.entered.promise;
  const controller = getDayFrameRuntimeAuthorityController(store, capability),
    epoch = controller.getEpoch!();
  for (const [name, operation] of [
    ["proposalAuthority", proposal],
    ["realizationAuthority", realization],
    ["historicalPlanBatches", publication],
    ["goalStructure", structure],
  ] as const) {
    expect(controller.begin()).toEqual({ status: "busy" });
    expect(controller.getEpoch!()).toBe(epoch);
    gates[name]!.release.resolve();
    const outcome = await operation;
    expect(outcome.status).toBe(
      name === "proposalAuthority"
        ? "durable"
        : name === "realizationAuthority"
          ? "realized"
          : name === "historicalPlanBatches"
            ? "publishedAndDurable"
            : "accepted",
    );
  }
  expect(controller.begin().status).toBe("begun");
  expect(controller.abort().status).toBe("aborted");
});

it.each(["snapshotFailure", "abort"] as const)(
  "%s advances lifetime; exact returned data does not revive an old Proposal origin",
  async (phase) => {
    const db = createDayFrameDurableDb(),
      proposals = createProposalSurface({ storage: db });
    const { store, input } = await prepared(false, {
      restoreIndexedDb: db,
      proposalSurface: proposals,
    });
    const shell = proposals.getProposalLifecycle(capability),
      origin = shell.capture(),
      before = store.exportProposalAuthority();
    const controller = getDayFrameRuntimeAuthorityController(store, capability),
      epoch = controller.getEpoch!();
    if (phase === "snapshotFailure") {
      vi.spyOn(
        proposals.getProposalRuntimeAdapter(capability),
        "captureRuntimeSnapshot",
      ).mockImplementationOnce(() => {
        throw Error("snapshot");
      });
      expect(controller.begin()).toEqual({ status: "snapshotFailed" });
    } else {
      expect(controller.begin().status).toBe("begun");
      expect(controller.abort().status).toBe("aborted");
    }
    expect(controller.getEpoch!()).toBe(epoch + 1);
    const writes = vi.spyOn(db, "mutate");
    expect(await shell.enter(origin, () => proposals.acceptProposalOption(input))).toMatchObject({
      status: "rejected",
      reason: "contextReplaced",
    });
    expect(writes).not.toHaveBeenCalled();
    expect(store.exportProposalAuthority()).toEqual(before);
  },
);

it("direct attached install and stale coordinator capability cannot bypass replacement admission", async () => {
  const db = createDayFrameDurableDb(),
    proposals = createProposalSurface({ storage: db });
  await prepared(false, { restoreIndexedDb: db, proposalSurface: proposals });
  const adapter = proposals.getProposalRuntimeAdapter(capability),
    snapshot = adapter.captureRuntimeSnapshot();
  expect(() => adapter.installRuntimeExact(snapshot)).toThrow(/coordinator/);
  expect(await proposals.clearProposalForCoordinator(capability, -1)).toEqual({
    status: "storageFailure",
  });
  expect(() => proposals.getProposalRuntimeAdapter(Symbol() as never)).toThrow(/capability/);
  expect(adapter.captureRuntimeSnapshot()).toEqual(snapshot);
});

it("accepted-evidence query cannot deliver pre-replacement authority after a begun and aborted epoch", async () => {
  const { store } = await prepared(true);
  const query = {
    startUserDayDate: "2026-09-17",
    endUserDayDateExclusive: "2026-09-18",
    asOf: "2026-09-16T12:00:00.000Z",
  };
  const pending = store.queryAcceptedPlanningEvidence(query);
  const controller = getDayFrameRuntimeAuthorityController(store, capability);
  expect(controller.begin().status).toBe("begun");
  expect(controller.abort().status).toBe("aborted");
  expect(await pending).toEqual({ status: "error", reason: "evidenceQueryFailed" });
  expect((await store.queryAcceptedPlanningEvidence(query)).status).toBe("projected");
});
