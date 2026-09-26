import { expect, it, vi } from "vitest";
import { prepared, deferred, at, author } from "./acceptanceLifecycleTestFixtures.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability,
  getDayFrameRuntimeAuthorityController,
} from "./dayFrameRuntimeAuthority.js";
import { hasCurrentAcceptanceReceipt } from "./acceptanceLifecycle.js";

it.each(["automatic", "retry", "proposal"] as const)(
  "%s × clear/V14 excludes replacement before physical creation",
  async (path) => {
    for (const replacement of ["clear", "restore"] as const) {
      // A fresh fixture/factory for each ordering is provided by the test globals.
      const { store, durable, input } = await prepared(true);
      const real = durable.mutate;
      if (path === "retry") {
        const fault = vi
          .spyOn(durable, "mutate")
          .mockImplementation((rows, admit, observe) =>
            real(
              rows,
              rows.some((r) => r.store === "realizationAuthority") ? () => false : admit,
              observe,
            ),
          );
        const accepted = await store.acceptProposalOption(input);
        expect(accepted.status).toBe("accepted");
        expect(store.listRealizations()).toEqual([]);
        fault.mockRestore();
      }
      const backup = await store.exportBackupV14(at);
      if (backup.status !== "exported") throw Error(backup.status);
      const entered = deferred(),
        release = deferred();
      let attempts = 0,
        transactions = 0;
      const spy = vi.spyOn(durable, "mutate").mockImplementation(async (rows, admit, observe) => {
        const selected = rows.some(
          (r) =>
            r.type === "put" &&
            r.store === (path === "proposal" ? "proposalAuthority" : "realizationAuthority"),
        );
        if (selected) {
          attempts++;
          entered.resolve();
          await release.promise;
        }
        return real(rows, admit, (receipt) => {
          if (selected) transactions++;
          observe?.(receipt);
        });
      });
      const pending =
        path === "retry"
          ? store.realizeAcceptedAllocation(
              store.exportProposalAuthority().acceptedAllocations[0]!.id,
            )
          : store.acceptProposalOption(input);
      await entered.promise;
      const controller = getDayFrameRuntimeAuthorityController(store, capability),
        epoch = controller.getEpoch!();
      expect(attempts).toBe(1);
      expect(transactions).toBe(0);
      expect(controller.begin()).toEqual({ status: "busy" });
      if (replacement === "clear") await expect(store.clearLocalData()).rejects.toThrow();
      else
        expect(await store.importBackupV14(backup.backup)).toMatchObject({ status: "restoreBusy" });
      expect(controller.getEpoch!()).toBe(epoch);
      release.resolve();
      const outcome = await pending;
      expect(outcome.status).toBe(path === "retry" ? "realized" : "accepted");
      expect(hasCurrentAcceptanceReceipt(outcome)).toBe(true);
      expect(transactions).toBe(1);
      expect(store.listRealizedScheduleFacts()).toHaveLength(3);
      spy.mockRestore();
      const replaced =
        replacement === "clear"
          ? await store.clearLocalData()
          : await store.importBackupV14(backup.backup);
      expect(replaced.status).toBe(replacement === "clear" ? "cleared" : "restoredV14");
      expect(hasCurrentAcceptanceReceipt(outcome)).toBe(false);
      const restarted = createDayFrameStore(undefined, {
        restoreIndexedDb: createDayFrameDurableDb(),
      });
      await restarted.whenReady();
      expect(restarted.getRealizationIngressStatus()).toBe("ready");
      expect(restarted.exportRealizationAuthority()).toEqual(store.exportRealizationAuthority());
      expect(restarted.exportProposalAuthority()).toEqual(store.exportProposalAuthority());
      if (replacement === "restore" && path === "retry") {
        const fresh = await store.realizeAcceptedAllocation(
          store.exportProposalAuthority().acceptedAllocations[0]!.id,
        );
        expect(fresh.status).toBe("realized");
      }
      await store.clearLocalData();
    }
  },
);

it("automatic + same-target retry rejects busy; fresh retry verifies complete original identities", async () => {
  const { store, durable, input } = await prepared(true);
  const entered = deferred(),
    release = deferred(),
    real = durable.mutate;
  let transactions = 0;
  vi.spyOn(durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    const selected = rows.some((r) => r.store === "realizationAuthority");
    if (selected) {
      entered.resolve();
      await release.promise;
    }
    return real(rows, admit, (receipt) => {
      if (selected) transactions++;
      observe?.(receipt);
    });
  });
  const automatic = store.acceptProposalOption(input);
  await entered.promise;
  const id = store.exportProposalAuthority().acceptedAllocations[0]!.id;
  expect(await store.realizeAcceptedAllocation(id)).toMatchObject({
    status: "rejected",
    reasons: ["realizationBusy"],
  });
  release.resolve();
  await automatic;
  const before = store.exportRealizationAuthority();
  expect(await store.realizeAcceptedAllocation(id)).toMatchObject({ status: "alreadyRealized" });
  expect(store.exportRealizationAuthority()).toEqual(before);
  expect(transactions).toBe(1);
});

it.each(["before", "after"] as const)(
  "saved source edit %s physical admission has selected effect",
  async (phase) => {
    const { store, durable, input } = await prepared(true);
    const entered = deferred(),
      release = deferred(),
      real = durable.mutate;
    let transactions = 0;
    vi.spyOn(durable, "mutate").mockImplementation(async (rows, admit, observe) => {
      if (!rows.some((r) => r.store === "realizationAuthority")) return real(rows, admit, observe);
      if (phase === "before") {
        entered.resolve();
        await release.promise;
      }
      const result = await real(rows, admit, (receipt) => {
        transactions++;
        observe?.(receipt);
      });
      if (phase === "after") {
        entered.resolve();
        await release.promise;
      }
      return result;
    });
    const pending = store.acceptProposalOption(input);
    await entered.promise;
    author(store, { durationMinutes: 90 });
    release.resolve();
    const outcome = await pending;
    expect(outcome).toMatchObject({
      status: "accepted",
      value: {
        realization:
          phase === "before"
            ? { status: "rejected", reasons: ["sourceChanged"] }
            : { status: "realized", reviewRequired: true },
      },
    });
    expect(transactions).toBe(phase === "before" ? 0 : 1);
    expect(store.listRealizedScheduleFacts()).toHaveLength(phase === "before" ? 0 : 3);
    expect(store.exportProposalAuthority().acceptedAllocations).toHaveLength(1);
  },
);
