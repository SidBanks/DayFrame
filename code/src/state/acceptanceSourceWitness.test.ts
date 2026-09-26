import { expect, it, vi } from "vitest";
import { deriveOrdinaryProposal } from "../core/planning/proposal.js";
import { allocation, horizon } from "../core/planning/proposalTestFixtures.js";
import { prepared, deferred, at, range } from "./acceptanceLifecycleTestFixtures.js";

it.each(["work", "manual", "fixed", "sleepPlacement"] as const)(
  "saved %s edit during storage opening denies realization before transaction creation",
  async (source) => {
    const { store, durable, input } = await prepared(true);
    const entered = deferred(),
      release = deferred(),
      real = durable.mutate;
    let transactions = 0;
    vi.spyOn(durable, "mutate").mockImplementation(async (rows, admit, observe) => {
      if (!rows.some((r) => r.store === "realizationAuthority")) return real(rows, admit, observe);
      entered.resolve();
      await release.promise;
      return real(rows, admit, (receipt) => {
        transactions++;
        observe?.(receipt);
      });
    });
    const pending = store.acceptProposalOption(input);
    await entered.promise;
    const accepted = store.exportProposalAuthority().acceptedAllocations;
    if (source === "manual")
      store.setManualEvents([
        {
          id: "later",
          title: "Later saved event",
          userDayDate: "2026-09-17",
          allDay: true,
          createdAt: at,
          updatedAt: at,
        },
      ]);
    if (source === "work") {
      store.setShiftDefinitions([
        {
          id: "work",
          userId: "u",
          name: "Work",
          startTime: "00:00",
          endTime: "23:59",
          workDays: ["thursday"],
          crossesMidnight: false,
          createdAt: at,
          updatedAt: at,
        },
      ]);
      store.setShiftCycles([
        {
          id: "cycle",
          userId: "u",
          name: "Cycle",
          type: "fixedSegments",
          startsOnDate: "2026-09-01",
          endsOnDate: "2026-09-30",
          segments: [
            {
              id: "segment",
              shiftCycleId: "cycle",
              shiftDefinitionId: "work",
              startsOnDate: "2026-09-01",
              endsOnDate: "2026-09-30",
            },
          ],
          createdAt: at,
          updatedAt: at,
        },
      ]);
    }
    if (source === "fixed") {
      store.setBlockTemplates([
        {
          id: "fixed",
          userId: "u",
          title: "Fixed",
          category: "admin",
          placementType: "fixed",
          durationMinutes: 1439,
          priority: 1,
          preferredWindow: "anyAvailable",
          fixedStartTime: "00:00",
          rescheduleBehavior: "skip",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: at,
          updatedAt: at,
        },
      ]);
      store.setBlockRecurrences([
        {
          id: "fixed-rule",
          blockTemplateId: "fixed",
          frequency: "daily",
          startsOnDate: "2026-09-17",
          endsOnDate: "2026-09-17",
        },
      ]);
    }
    if (source === "sleepPlacement") {
      const resolution = await store.resolveRequiredSleep({ ownerRange: range });
      if (resolution.status !== "satisfied") throw Error(resolution.status);
      const trial = store.trySleepPlacement({
        ownerRange: range,
        target: resolution.occurrences.find((o) => o.membership === "requested")!.reference,
        sleepStart: new Date(2026, 8, 17, 0).toISOString(),
      });
      if (trial.status !== "available") throw Error(JSON.stringify(trial));
      expect(store.acceptPlanDecision(trial.candidate).status).toBe("accepted");
    }
    release.resolve();
    expect(await pending).toMatchObject({
      status: "accepted",
      value: { realization: { status: "rejected", reasons: ["sourceChanged"] } },
    });
    expect(transactions).toBe(0);
    expect(store.exportProposalAuthority().acceptedAllocations).toEqual(accepted);
    expect(store.listRealizedScheduleFacts()).toEqual([]);
    const fresh = await store.realizeAcceptedAllocation(accepted[0]!.id);
    expect(fresh.status).toBe(source === "sleepPlacement" ? "realized" : "inapplicable");
    expect(transactions).toBe(source === "sleepPlacement" ? 1 : 0);
    expect(store.exportProposalAuthority().acceptedAllocations).toEqual(accepted);
  },
);

it("unrelated Proposal lifecycle append can settle during realization without invalidating its exact acceptance", async () => {
  const { store, durable, input } = await prepared(true),
    entered = deferred(),
    release = deferred(),
    real = durable.mutate;
  vi.spyOn(durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    if (rows.some((r) => r.store === "realizationAuthority")) {
      entered.resolve();
      await release.promise;
    }
    return real(rows, admit, observe);
  });
  const pending = store.acceptProposalOption(input);
  await entered.promise;
  const accepted = store.exportProposalAuthority().acceptedAllocations;
  const generated = deriveOrdinaryProposal({
    allocation: allocation(),
    horizon,
    allocationHorizon: horizon,
    generatedAt: at,
  });
  if (generated.status !== "proposed") throw Error(generated.status);
  expect((await store.recordProposal(generated)).status).toBe("accepted");
  release.resolve();
  expect(await pending).toMatchObject({
    status: "accepted",
    value: { realization: { status: "realized" } },
  });
  expect(store.exportProposalAuthority().acceptedAllocations).toEqual(accepted);
  expect(store.listRealizedScheduleFacts()).toHaveLength(3);
});
